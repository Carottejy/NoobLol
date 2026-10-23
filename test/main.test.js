/* Tests des modules du processus principal (sans Electron ni serveurs Riot). Lancer : npm test */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const { StatsDb, parseTimeline } = require('../main/db');
const { Collector } = require('../main/collector');
const { RiotApi, RateLimiter } = require('../main/riotapi');
const { parseLockfile, parseCommandLine, simplifySession, LcuWatcher } = require('../main/lcu');
const { simplify } = require('../main/live');
const { Config } = require('../main/config');

const POS = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];
function fakeMatch(id, champsBlue, champsRed, blueWins, opts = {}) {
  const part = (champ, i, teamId, win) => ({
    puuid: `p${teamId}${i}`, participantId: (teamId === 100 ? 1 : 6) + i, championId: champ, championName: 'C' + champ, teamId, teamPosition: POS[i], win,
    perks: { statPerks: { offense: 5008, flex: 5008, defense: 5011 }, styles: [{ description: 'primaryStyle', style: 8100, selections: [{ perk: 8112 }, { perk: 8126 }, { perk: 8138 }, { perk: 8135 }] }, { description: 'subStyle', style: 8300, selections: [{ perk: 8304 }, { perk: 8347 }] }] },
    item0: 3071, item1: 3006, item2: 0, item3: 1036, item4: 0, item5: 0, item6: 3340, summoner1Id: 14, summoner2Id: 4,
  });
  return { metadata: { matchId: id }, info: { queueId: opts.queue || 420, gameDuration: opts.duration || 1800, gameVersion: '16.21.712.3', gameCreation: Date.now() - 3600e3,
    participants: [...champsBlue.map((c, i) => part(c, i, 100, blueWins)), ...champsRed.map((c, i) => part(c, i, 200, !blueWins))] } };
}

test('base de stats : enregistrement et agrégats', async () => {
  const db = await StatsDb.open(null);
  db.addMatchIds(['EUW1_1', 'EUW1_2', 'EUW1_3'], 'euw1');
  assert.strictEqual(db.counts().pending, 3);
  assert.strictEqual(db.addMatch(fakeMatch('EUW1_1', [1, 2, 3, 4, 5], [6, 7, 8, 9, 10], true)), 10);
  db.addMatch(fakeMatch('EUW1_2', [1, 2, 3, 4, 5], [6, 7, 8, 9, 10], false));
  db.addMatch(fakeMatch('EUW1_3', [6, 2, 3, 4, 5], [1, 7, 8, 9, 10], true));
  assert.strictEqual(db.addMatch(fakeMatch('EUW1_4', [1, 2, 3, 4, 5], [6, 7, 8, 9, 10], true, { duration: 200 })), 0, 'remake ignoré');
  assert.strictEqual(db.addMatch(fakeMatch('EUW1_5', [1, 2, 3, 4, 5], [6, 7, 8, 9, 10], true, { queue: 450 })), 0, 'ARAM ignoré');
  const c = db.counts();
  assert.strictEqual(c.picks, 30); assert.strictEqual(c.pending, 0); assert.strictEqual(c.matches, 5);
  const s = db.champ(1, 'top');
  assert.strictEqual(s.games, 3); assert.strictEqual(s.wins, 1);
  assert.strictEqual(s.runes[0].runes, '8100:8112,8126,8138,8135|8300:8304,8347');
  assert.strictEqual(s.runes[0].shards, '5008,5008,5011');
  assert.strictEqual(s.spells[0].spells, '4,14');
  assert.deepStrictEqual(s.items.map((i) => i.item).sort(), [1036, 3006, 3071]);
  const vs6 = s.matchups.find((m) => m.opp === 6);
  assert.strictEqual(vs6.games, 3); assert.strictEqual(vs6.wins, 1);
  assert.strictEqual(db.mainRole(2), 'jungle');
  assert.deepStrictEqual(db.matchup(6, 1, 'top'), { games: 3, wins: 2 });
  assert.strictEqual(db.counters(1, 'top', 30, 1)[0].champ, 6);
  assert.strictEqual(db.tier('top', 30, 1).length, 2);
});

test('base de stats : sauvegarde dans un fichier et relecture', async () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'nl-')), 'stats.sqlite');
  const db = await StatsDb.open(file);
  db.addMatch(fakeMatch('EUW1_9', [1, 2, 3, 4, 5], [6, 7, 8, 9, 10], true));
  db.close();
  const db2 = await StatsDb.open(file);
  assert.strictEqual(db2.counts().picks, 10);
});

test('limiteur de débit : respecte la fenêtre', async () => {
  const rl = new RateLimiter([[3, 300]]);
  const t0 = Date.now();
  for (let i = 0; i < 6; i++) await rl.wait();
  assert.ok(Date.now() - t0 >= 280, 'les 3 dernières requêtes ont attendu');
});

test('API Riot : clé, 429 et erreurs', async () => {
  let n = 0;
  const fakeFetch = async (url, o) => {
    n++;
    assert.strictEqual(o.headers['X-Riot-Token'], 'RGAPI-test');
    const h = new Map([['x-app-rate-limit', '20:1,100:120']]);
    if (url.includes('/status/') && n === 1) return { status: 429, ok: false, headers: { get: (k) => (k === 'retry-after' ? '0' : h.get(k)) } };
    if (url.includes('/status/')) return { status: 200, ok: true, headers: { get: (k) => h.get(k) }, json: async () => ({ id: 'EUW1' }) };
    if (url.includes('by-riot-id')) { assert.ok(url.startsWith('https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Car%20otte/EUW')); return { status: 200, ok: true, headers: { get: () => null }, json: async () => ({ puuid: 'X' }) }; }
    return { status: 403, ok: false, headers: { get: () => null } };
  };
  const api = new RiotApi({ getKey: () => 'RGAPI-test', getPlatform: () => 'euw1', fetchImpl: fakeFetch });
  assert.deepStrictEqual(await api.status(), { id: 'EUW1' });
  assert.deepStrictEqual(await api.account('Car otte', 'EUW'), { puuid: 'X' });
  await assert.rejects(api.summoner('X'), /expirent/);
  const none = new RiotApi({ getKey: () => '', getPlatform: () => 'euw1', fetchImpl: fakeFetch });
  await assert.rejects(none.status(), /Ajoute ta clé/);
});

test('collecteur : joueurs de référence → parties → statistiques', async () => {
  const db = await StatsDb.open(null);
  const calls = [];
  const api = {
    platform: 'euw1', calls: 0,
    apexLeague: async (tier) => { calls.push('league:' + tier); return { entries: tier === 'CHALLENGER' ? [{ puuid: 'A' }, { puuid: 'B' }] : [] }; },
    matchIds: async (puuid) => { calls.push('ids:' + puuid); return puuid === 'A' ? ['M1', 'M2'] : ['M2', 'M3']; },
    match: async (id) => { calls.push('match:' + id); return fakeMatch(id, [1, 2, 3, 4, 5], [6, 7, 8, 9, 10], id !== 'M2'); },
  };
  const col = new Collector({ api, db, getConfig: () => ({ collector: { tiers: ['CHALLENGER', 'MASTER'], days: 14 } }) });
  col.running = true;
  for (let i = 0; i < 8; i++) await col.step();
  const c = db.counts();
  assert.strictEqual(c.seeds, 2); assert.strictEqual(c.matches, 3); assert.strictEqual(c.picks, 30);
  assert.ok(calls.includes('ids:A') && calls.includes('ids:B'));
  assert.strictEqual(calls.filter((x) => x === 'match:M2').length, 1, 'une partie n\'est analysée qu\'une fois');
});

test('client LoL : lockfile, ligne de commande, sélection', () => {
  assert.deepStrictEqual(parseLockfile('LeagueClient:1234:54321:s3cr3t:https'), { port: 54321, password: 's3cr3t', protocol: 'https' });
  assert.deepStrictEqual(parseCommandLine('"LeagueClientUx.exe" --remoting-auth-token=AbC-12 --app-port=60000 --x'), { port: 60000, password: 'AbC-12', protocol: 'https' });
  const s = simplifySession({
    localPlayerCellId: 2,
    myTeam: [{ cellId: 0, championId: 86, assignedPosition: 'top' }, { cellId: 1, championId: 0, championPickIntent: 64, assignedPosition: 'jungle' }, { cellId: 2, championId: 0, assignedPosition: 'middle' }],
    theirTeam: [{ cellId: 5, championId: 238 }, { cellId: 6, championId: 0 }],
    bans: { myTeamBans: [], theirTeamBans: [] },
    actions: [[{ type: 'ban', completed: true, championId: 157, actorCellId: 0 }], [{ type: 'pick', actorCellId: 2, championId: 103, completed: false }]],
    timer: { phase: 'BAN_PICK', adjustedTimeLeftInPhase: 25000 },
  });
  assert.strictEqual(s.myRole, 'mid');
  assert.deepStrictEqual(s.bans, [157]);
  const me = s.myTeam.find((p) => p.isMe);
  assert.strictEqual(me.champ, 103); assert.strictEqual(me.locked, false);
  assert.strictEqual(s.myTeam[1].intent, true);
  assert.strictEqual(s.theirTeam[0].champ, 238);
  assert.strictEqual(s.timer.left, 25);
});

test('données en jeu : simplification Live Client Data', () => {
  const d = simplify({
    activePlayer: { riotId: 'Carotte#EUW', level: 9, currentGold: 1234.7, championStats: { attackDamage: 80.2, abilityPower: 0, armor: 50, magicResist: 40, moveSpeed: 345, currentHealth: 900, maxHealth: 1200 } },
    allPlayers: [
      { riotId: 'Carotte#EUW', riotIdGameName: 'Carotte', championName: 'Miss Fortune', rawChampionName: 'game_character_displayname_MissFortune', team: 'ORDER', level: 9, items: [{ itemID: 3031, slot: 0, count: 1 }], scores: { kills: 3, deaths: 1, assists: 2, creepScore: 88 }, summonerSpells: { summonerSpellOne: { displayName: 'Saut éclair', rawDisplayName: 'GeneratedTip_SummonerSpell_SummonerFlash_DisplayName' }, summonerSpellTwo: { rawDisplayName: 'GeneratedTip_SummonerSpell_SummonerHeal_DisplayName' } } },
      { riotId: 'Bad#666', championName: 'Zed', rawChampionName: 'game_character_displayname_Zed', team: 'CHAOS', level: 10, isDead: true, respawnTimer: 12.5, items: [], scores: {}, summonerSpells: { summonerSpellOne: { rawDisplayName: 'GeneratedTip_SummonerSpell_SummonerFlash_DisplayName' }, summonerSpellTwo: { rawDisplayName: 'GeneratedTip_SummonerSpell_SummonerDot_DisplayName' } } },
    ],
    events: { Events: [{ EventID: 3, EventName: 'DragonKill', EventTime: 400.5, KillerName: 'Carotte', DragonType: 'Fire', Stolen: 'False' }] },
    gameData: { gameTime: 612.3, gameMode: 'CLASSIC', mapNumber: 11 },
  });
  assert.strictEqual(d.me.champ, 'MissFortune'); assert.strictEqual(d.me.gold, 1234);
  assert.deepStrictEqual(d.players[1].spells, ['SummonerFlash', 'SummonerDot']);
  assert.strictEqual(d.players[1].dead, true);
  assert.strictEqual(d.events[0].dragon, 'Fire');
});

test('réglages : la clé n\'est jamais exposée à l\'interface', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nlc-'));
  const fakeSafe = { isEncryptionAvailable: () => true, encryptString: (s) => Buffer.from('ENC:' + s), decryptString: (b) => b.toString().slice(4) };
  const c = new Config(dir, fakeSafe);
  c.setApiKey(' RGAPI-abc ');
  assert.strictEqual(c.getApiKey(), 'RGAPI-abc');
  const pub = c.public();
  assert.strictEqual(pub.hasApiKey, true); assert.ok(!JSON.stringify(pub).includes('RGAPI'));
  assert.ok(!fs.readFileSync(path.join(dir, 'config.json'), 'utf8').includes('RGAPI-abc'), 'clé chiffrée sur le disque');
  c.set({ minimap: { crop: { x: 0.5 } }, apiKeyPlain: 'hack' });
  assert.strictEqual(c.data.minimap.crop.x, 0.5); assert.strictEqual(c.data.minimap.crop.w, 0.14);
  assert.strictEqual(c.data.apiKeyPlain, '');
});

test('client LoL : connexion HTTPS locale via lockfile', async (t) => {
  let key, cert;
  try { const p = require('selfsigned').generate([{ name: 'commonName', value: '127.0.0.1' }], { days: 1, keySize: 2048 }); key = p.private; cert = p.cert; }
  catch (e) {
    try { const pem = execSync('openssl req -x509 -newkey rsa:2048 -nodes -keyout /dev/stdout -subj /CN=127.0.0.1 -days 1 2>/dev/null', { encoding: 'utf8' }); key = pem.match(/-----BEGIN PRIVATE KEY-----[\s\S]+?-----END PRIVATE KEY-----/)[0]; cert = pem.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/)[0]; }
    catch (e2) { t.skip('ni selfsigned ni openssl'); return; }
  }
  const srv = https.createServer({ key, cert }, (req, res) => {
    if (req.headers.authorization !== 'Basic ' + Buffer.from('riot:pw').toString('base64')) { res.writeHead(401); return res.end(); }
    const routes = { '/lol-gameflow/v1/gameflow-phase': '"ChampSelect"', '/lol-summoner/v1/current-summoner': JSON.stringify({ gameName: 'Carotte', tagLine: 'EUW', puuid: 'P', summonerLevel: 42 }),
      '/lol-champ-select/v1/session': JSON.stringify({ localPlayerCellId: 0, myTeam: [{ cellId: 0, championId: 1, assignedPosition: 'utility' }], theirTeam: [], actions: [] }) };
    res.writeHead(routes[req.url] ? 200 : 404, { 'content-type': 'application/json' }); res.end(routes[req.url] || '');
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lol-'));
  fs.writeFileSync(path.join(dir, 'lockfile'), `LeagueClient:1:${srv.address().port}:pw:https`);
  const w = new LcuWatcher(() => dir, { platform: 'linux' });
  const st = await new Promise((resolve) => { w.on('state', resolve); w.start(); });
  w.stop(); srv.close();
  assert.strictEqual(st.connected, true); assert.strictEqual(st.phase, 'ChampSelect');
  assert.strictEqual(st.summoner.gameName, 'Carotte'); assert.strictEqual(st.champSelect.myRole, 'support');
});

test('chronologie : ordre d\'achat, annulation, départ, sorts, équipe adverse', async () => {
  const ev = (type, pid, t, x) => Object.assign({ type, participantId: pid, timestamp: t }, x);
  const tl = { info: { frames: [
    { events: [ev('ITEM_PURCHASED', 1, 20000, { itemId: 1055 }), ev('ITEM_PURCHASED', 1, 21000, { itemId: 2003 }), ev('ITEM_PURCHASED', 1, 22000, { itemId: 1036 }), ev('ITEM_UNDO', 1, 23000, { beforeId: 1036, afterId: 0 }),
      ev('SKILL_LEVEL_UP', 1, 90000, { skillSlot: 1, levelUpType: 'NORMAL' }), ev('SKILL_LEVEL_UP', 1, 200000, { skillSlot: 3, levelUpType: 'NORMAL' }), ev('SKILL_LEVEL_UP', 1, 300000, { skillSlot: 1, levelUpType: 'NORMAL' }), ev('SKILL_LEVEL_UP', 1, 300500, { skillSlot: 4, levelUpType: 'EVOLVE' })] },
    { events: [ev('ITEM_PURCHASED', 1, 500000, { itemId: 1001 }), ev('ITEM_PURCHASED', 1, 600000, { itemId: 3071 }), ev('ITEM_PURCHASED', 6, 610000, { itemId: 3006 }), { type: 'WARD_PLACED', timestamp: 1 }] },
  ] } };
  const p = parseTimeline(tl);
  assert.deepStrictEqual(p[1], { seq: '1055,2003,1001,3071', start: '1055,2003', skills: '131' });
  assert.strictEqual(p[6].seq, '3006');
  const db = await StatsDb.open(null);
  db.addMatch(fakeMatch('EUW1_T', [1, 2, 3, 4, 5], [6, 7, 8, 9, 10], true), { timeline: tl });
  const rows = db.builds(1, 'top');
  assert.strictEqual(rows.length, 1);
  assert.strictEqual(rows[0].seq, '1055,2003,1001,3071'); assert.strictEqual(rows[0].start, '1055,2003'); assert.strictEqual(rows[0].skills, '131');
  assert.strictEqual(rows[0].enemies, '6,7,8,9,10'); assert.strictEqual(rows[0].opp, 6);
  assert.strictEqual(db.counts().withTimeline, 2);
});

test('base de stats : mise à niveau d\'une ancienne base (sans colonnes de chronologie)', async () => {
  const initSqlJs = require('sql.js');
  const SQL = await initSqlJs();
  const old = new SQL.Database();
  old.run('CREATE TABLE picks (match_id TEXT, champ INTEGER, role TEXT, win INTEGER, opp INTEGER, runes TEXT, shards TEXT, items TEXT, spells TEXT, patch TEXT, created INTEGER, PRIMARY KEY (match_id, champ))');
  old.run("INSERT INTO picks VALUES ('X', 1, 'top', 1, 2, '', '', '', '', '16.21', ?)", [Date.now()]);
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'nlm-')), 'stats.sqlite');
  fs.writeFileSync(file, Buffer.from(old.export()));
  const db = await StatsDb.open(file);
  const r = db.builds(1, 'top');
  assert.strictEqual(r.length, 1); assert.strictEqual(r[0].seq, null);
});

test('collecteur : récupère la chronologie des parties gardées seulement', async () => {
  const db = await StatsDb.open(null);
  const tlCalls = [];
  const api = { platform: 'euw1', calls: 0, apexLeague: async () => ({ entries: [{ puuid: 'A' }] }), matchIds: async () => ['M1', 'M2'],
    match: async (id) => fakeMatch(id, [1, 2, 3, 4, 5], [6, 7, 8, 9, 10], true, id === 'M2' ? { duration: 300 } : {}),
    timeline: async (id) => { tlCalls.push(id); return { info: { frames: [{ events: [{ type: 'ITEM_PURCHASED', participantId: 1, timestamp: 10, itemId: 1055 }] }] } }; } };
  const col = new Collector({ api, db, getConfig: () => ({ collector: { tiers: ['CHALLENGER'], days: 14, timeline: true } }) });
  col.running = true;
  for (let i = 0; i < 4; i++) await col.step();
  assert.deepStrictEqual(tlCalls, ['M1']);
  assert.strictEqual(db.builds(1, 'top')[0].seq, '1055');
});

test('recommandations : runes et 2 premiers objets contre l\'adversaire, objets selon l\'équipe', () => {
  const Builds = require('../renderer/builds.js');
  const item = (name, total, tags, extra = {}) => Object.assign({ name, gold: { total }, tags, description: '' }, extra);
  const D = {
    items: { 1055: item('Lame de Doran', 450, ['Damage', 'Lane']), 2003: item('Potion', 50, ['Consumable']), 1001: item('Bottes', 300, ['Boots'], { into: ['3006'] }),
      3006: item('Jambières', 1100, ['Boots']), 3111: item('Sandales', 1100, ['Boots']), 6672: item('Kraken', 3100, ['Damage']), 3031: item('Lame d\'infini', 3450, ['CriticalStrike']),
      3036: item('Salutations', 3000, ['ArmorPenetration']), 3156: item('Gueule', 2900, ['SpellBlock', 'Damage']), 3033: item('Mortel rappel', 3000, ['ArmorPenetration'], { description: 'Applique <status>Blessures graves</status>' }) },
    champs: {}, byKey: {},
  };
  const champ = (id, key, attack, magic, tags) => { D.champs[id] = D.byKey[key] = { id, key: String(key), name: id, info: { attack, magic }, tags }; };
  champ('Jinx', 222, 9, 2, ['Marksman']); champ('Zed', 238, 9, 1, ['Assassin']); champ('Lux', 99, 2, 9, ['Mage']); champ('Syndra', 134, 2, 9, ['Mage']);
  champ('Soraka', 16, 2, 8, ['Support']); champ('Malphite', 54, 5, 7, ['Tank']); champ('Leona', 89, 4, 3, ['Tank', 'Support']); champ('Ahri', 103, 3, 8, ['Mage']);
  const row = (o) => Object.assign({ win: 1, opp: 0, runes: '8000:8008,9111,9104,8014|8100:8139,8135', shards: '5005,5008,5011', spells: '4,7', items: '', seq: '1055,2003,1001,6672,3006,3031,3036', start: '1055,2003', skills: '131213141323', enemies: '238,99,134,54,89' }, o);
  const rows = [];
  for (let i = 0; i < 20; i++) rows.push(row({ win: i % 2, opp: 99 }));
  for (let i = 0; i < 10; i++) rows.push(row({ win: i < 7 ? 1 : 0, opp: 134, runes: '8000:8010,9111,9104,8299|8400:8444,8451', seq: '1055,2003,1001,3031,3111,6672,3156', enemies: '134,99,103,16,54' }));
  /* contre Syndra : runes et 2 premiers objets spécifiques */
  const A = Builds.analyze(rows, D, { opp: 134, enemies: [134, 99, 103, 16, 54] });
  assert.strictEqual(A.games, 30); assert.strictEqual(A.vsGames, 10); assert.strictEqual(A.useVs, true);
  assert.ok(A.runes[0].runes.startsWith('8000:8010'));
  assert.deepStrictEqual(A.core[0].items, [3031, 6672]); assert.strictEqual(A.earlyVs, true);
  assert.strictEqual(A.boots[0].item, 3111);
  assert.deepStrictEqual(A.start[0].items, [1055, 2003]);
  assert.strictEqual(A.skills.order, 'Q > E > W'); assert.strictEqual(A.skills.first, 'Q E Q');
  /* équipe très magique + soigneuse : objets de résistance magique et anti-soins */
  const ids = A.situational.map((x) => x.id);
  assert.ok(ids.includes('mr') && ids.includes('heal'), ids.join(','));
  assert.strictEqual(A.situational.find((x) => x.id === 'mr').items[0].item, 3156);
  assert.strictEqual(A.situational.find((x) => x.id === 'heal').items.length, 0, 'aucun anti-soins construit → conseil générique');
  /* adversaire peu joué : retour au général */
  const B = Builds.analyze(rows, D, { opp: 238, enemies: [238, 89] });
  assert.strictEqual(B.useVs, false); assert.deepStrictEqual(B.core[0].items, [6672, 3031]);
  assert.ok(B.situational.some((x) => x.id === 'armor'));
});

test('rôles adverses : attribution la plus probable (stats + classe du champion)', () => {
  const Builds = require('../renderer/builds.js');
  const D = { byKey: {} };
  const c = (key, tags) => { D.byKey[key] = { key: String(key), tags, info: { attack: 5, magic: 5 } }; };
  c(1, ['Marksman']); c(2, ['Support', 'Mage']); c(3, ['Fighter']); c(4, ['Mage']); c(5, ['Fighter', 'Tank']);
  /* sans statistiques : la classe suffit */
  const a = Builds.assignRoles([1, 2, 3, 4, 5], D, {});
  assert.strictEqual(a[1], 'adc'); assert.strictEqual(a[2], 'support'); assert.strictEqual(a[4], 'mid');
  assert.ok(['top', 'jungle'].includes(a[3]) && ['top', 'jungle'].includes(a[5]) && a[3] !== a[5]);
  /* les statistiques départagent : 5 est surtout joué jungle */
  const b = Builds.assignRoles([1, 2, 3, 4, 5], D, { 5: { jungle: 300, top: 20 }, 3: { top: 200 } });
  assert.strictEqual(b[5], 'jungle'); assert.strictEqual(b[3], 'top');
  /* rôle fixé (attribué par le client) respecté, les autres s'adaptent */
  const f = Builds.assignRoles([1, 4], D, {}, { 4: 'adc' });
  assert.strictEqual(f[4], 'adc'); assert.notStrictEqual(f[1], 'adc');
});

test('objectifs : temps avant apparition, scores, âme, tours et inhibiteurs', () => {
  const Builds = require('../renderer/builds.js');
  const players = [{ name: 'Moi#EUW', gameName: 'Moi', team: 'ORDER' }, { name: 'Eux#1', gameName: 'Eux', team: 'CHAOS' }];
  const at = (time, events) => Builds.objectives({ time, players, events }, 'ORDER');
  const row = (o, id) => o.rows.find((r) => r.id === id);
  let o = at(120, []);
  assert.deepStrictEqual([row(o, 'drake').state, Math.round(row(o, 'drake').in)], ['spawn', 180]);
  assert.strictEqual(row(o, 'baron').in, 1080); assert.strictEqual(row(o, 'elder').state, 'locked');
  o = at(700, [{ name: 'DragonKill', t: 600, killer: 'Eux', dragon: 'Fire' }, { name: 'HordeKill', t: 500, killer: 'Moi' }, { name: 'TurretKilled', t: 650, turret: 'Turret_T2_L_03_A', killer: 'Moi' }]);
  assert.strictEqual(row(o, 'drake').in, 200); assert.deepStrictEqual(row(o, 'drake').score.them, 1);
  assert.strictEqual(o.drakeTypes.them[0], 'infernal'); assert.strictEqual(row(o, 'grubs').score.us, 1); assert.strictEqual(row(o, 'grubs').state, 'up');
  assert.deepStrictEqual(o.turret, { us: 1, them: 0 });
  /* âme puis ancestral 6 min plus tard ; Nashor tué → 6 min ; héraut disparu */
  const ev = [1, 2, 3, 4].map((i) => ({ name: 'DragonKill', t: 300 * i + 10, killer: 'Moi', dragon: 'Water' }));
  ev.push({ name: 'BaronKill', t: 1300, killer: 'Eux' }, { name: 'InhibKilled', t: 1400, inhib: 'Barracks_T1_L1', killer: 'Eux' });
  o = at(1500, ev);
  assert.strictEqual(row(o, 'drake').state, 'done'); assert.strictEqual(row(o, 'elder').in, 1210 + 360 - 1500);
  assert.strictEqual(row(o, 'baron').in, 160); assert.strictEqual(row(o, 'baron').score.them, 1);
  assert.strictEqual(row(o, 'herald').state, 'gone'); assert.deepStrictEqual(o.inhib, { us: 0, them: 1 });
});

test('fin de partie : attend la publication par Riot puis récupère partie + chronologie', async () => {
  const { PostGame } = require('../main/postgame');
  let n = 0;
  const api = { match: async (id) => { n++; if (n < 3) throw Object.assign(new Error('404'), { status: 404 }); return { metadata: { matchId: id }, info: {} }; }, timeline: async () => ({ info: { frames: [] } }) };
  const pg = new PostGame({ api, getPlatform: () => 'euw1', dir: null, wait: 5, tries: 5 });
  const states = []; pg.on('update', (d) => states.push(d.status));
  await pg.start({ gameId: 123, live: { time: 1800 }, puuid: 'P', hasKey: true });
  assert.deepStrictEqual(states, ['waiting', 'ready']);
  assert.strictEqual(pg.data.matchId, 'EUW1_123'); assert.ok(pg.data.timeline); assert.strictEqual(pg.data.live.time, 1800);
  const pg2 = new PostGame({ api, getPlatform: () => 'euw1', dir: null, wait: 5, tries: 2 });
  await pg2.start({ gameId: 9, live: { time: 60 }, hasKey: false });
  assert.strictEqual(pg2.data.status, 'live-only'); assert.strictEqual(pg2.data.reason, 'nokey');
});

test('client LoL : session de partie (équipes, puuid) et rangs', async () => {
  const { simplifyGame, LcuWatcher } = require('../main/lcu');
  const g = simplifyGame({ gameData: { gameId: 77, queue: { id: 420 }, teamOne: [{ puuid: 'a', championId: 1, gameName: 'Moi', tagLine: 'EUW' }], teamTwo: [{ puuid: 'b', championId: 2, summonerName: 'Eux' }] } });
  assert.strictEqual(g.gameId, 77); assert.strictEqual(g.players[1].team, 'CHAOS'); assert.strictEqual(g.players[1].name, 'Eux');
  const w = new LcuWatcher(() => null);
  w.get = async (p) => (p.includes('ranked-stats') ? { queueMap: { RANKED_SOLO_5x5: { tier: 'GOLD', division: 'II', leaguePoints: 45, wins: 10, losses: 8 }, RANKED_FLEX_SR: { tier: 'NONE', division: 'NA' } } } : { summonerLevel: 187, gameName: 'Moi', tagLine: 'EUW' });
  const info = await w.playerInfo('a');
  assert.deepStrictEqual(info.solo, { tier: 'GOLD', division: 'II', lp: 45, wins: 10, losses: 8 }); assert.strictEqual(info.flex, null); assert.strictEqual(info.level, 187);
});

test('fin de partie : analyse (équipes, parts de dégâts, courbe d\'or, moi contre mon adversaire, conseils)', () => {
  const Builds = require('../renderer/builds.js');
  const P = (id, team, pos, k, d, a, cs, gold, dmg, vis, puuid) => ({ participantId: id, teamId: team, teamPosition: pos, kills: k, deaths: d, assists: a, totalMinionsKilled: cs, neutralMinionsKilled: 0, goldEarned: gold, totalDamageDealtToChampions: dmg, visionScore: vis, visionWardsBoughtInGame: 0, puuid: puuid || 'x' + id, riotIdGameName: 'J' + id, item0: 1055 });
  const match = { metadata: { matchId: 'EUW1_1' }, info: { gameDuration: 1800, gameEndTimestamp: 1, queueId: 420, teams: [{ teamId: 100, win: true, objectives: { dragon: { kills: 3 } } }, { teamId: 200, win: false, objectives: { dragon: { kills: 1 } } }],
    participants: [P(1, 100, 'MIDDLE', 5, 8, 4, 120, 10000, 20000, 10, 'ME'), P(2, 100, 'TOP', 5, 2, 2, 200, 11000, 20000, 15), P(6, 200, 'MIDDLE', 3, 4, 2, 250, 12000, 15000, 20), P(7, 200, 'TOP', 1, 5, 1, 180, 9000, 10000, 8)] } };
  const tl = { info: { frames: Array.from({ length: 12 }, (_, m) => ({ participantFrames: { 1: { totalGold: 500 + m * 300, minionsKilled: m * 4 }, 2: { totalGold: 500 + m * 350, minionsKilled: m * 7 }, 6: { totalGold: 500 + m * 380, minionsKilled: m * 7 }, 7: { totalGold: 500 + m * 300, minionsKilled: m * 6 } } })) } };
  const G = Builds.postgame(match, tl, 'ME');
  assert.strictEqual(G.me.participantId, 1); assert.strictEqual(G.opp.participantId, 6);
  assert.strictEqual(G.teams[0].win, true); assert.strictEqual(G.teams[0].kills, 10); assert.strictEqual(G.me.dmgShare, 0.5); assert.strictEqual(G.me.kp, 0.9);
  assert.strictEqual(G.curve.length, 12); assert.strictEqual(G.curve[10], (650 * 10) - (680 * 10) + 0);
  assert.strictEqual(G.at10.cs, -30); assert.strictEqual(G.at10.gold, -800);
  assert.ok(G.tips.some((t) => t.startsWith('Farm')) && G.tips.some((t) => t.includes('8 morts')) && G.tips.some((t) => t.includes('3,0 CS/min')));
});

test('en jeu : prochain objet du kit conseillé', () => {
  const Builds = require('../renderer/builds.js');
  const D = { items: { 3031: { name: 'Lame d\'infini', gold: { total: 3450 }, tags: [] }, 6672: { name: 'Kraken', gold: { total: 3100 }, tags: [] }, 3006: { name: 'Jambières', gold: { total: 1100 }, tags: ['Boots'] }, 3111: { name: 'Sandales', gold: { total: 1100 }, tags: ['Boots'] } } };
  const A = { core: [{ items: [6672, 3031] }], boots: [{ item: 3006 }], later: [{ item: 3036 }] };
  assert.strictEqual(Builds.nextItem(A, [], D).item, 6672);
  assert.strictEqual(Builds.nextItem(A, [6672], D).item, 3031);
  assert.strictEqual(Builds.nextItem(A, [6672, 3031, 3111], D), null, 'déjà des bottes, objet suivant inconnu');
});

test('clé Riot : détection de l\'expiration et renouvellement assisté', async () => {
  const { KeyWatch } = require('../main/keyrenew');
  const { EventEmitter } = require('events');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nlk-'));
  const cfg = new Config(dir, null);
  cfg.setApiKey('RGAPI-00000000-0000-0000-0000-000000000000');
  const OLD = 'RGAPI-00000000-0000-0000-0000-000000000000', NEW = 'RGAPI-12345678-abcd-ef01-2345-6789abcdef01', OTHER = 'RGAPI-ffffffff-ffff-ffff-ffff-ffffffffffff';
  const api = { checkKey: async (k) => k === NEW };
  const kw = new KeyWatch({ cfg, api });
  const states = []; kw.on('change', (i) => states.push(i.state));
  api.onAuth(false, 403);
  assert.strictEqual(kw.state, 'expired');
  await kw.check(); assert.strictEqual(kw.state, 'expired');
  /* Fausse fenêtre du portail : d'abord l'ancienne clé (expirée), puis une clé invalide, puis la nouvelle */
  let page = [OLD];
  class FakeWin extends EventEmitter {
    constructor() { super(); this.destroyed = false; this.webContents = Object.assign(new EventEmitter(), { setWindowOpenHandler() {}, getURL: () => 'https://developer.riotgames.com/', executeJavaScript: async () => page }); }
    loadURL() {} isDestroyed() { return this.destroyed; } focus() {} close() { this.destroyed = true; this.emit('closed'); }
  }
  let w;
  const renewed = new Promise((r) => kw.on('renewed', r));
  kw.openRenew({ BrowserWindow: function () { w = new FakeWin(); return w; }, shell: { openExternal() {} }, parent: null });
  assert.strictEqual(kw.info().renewing, true);
  w.webContents.emit('did-finish-load');
  page = [OTHER, NEW];
  const info = await renewed;
  assert.strictEqual(cfg.getApiKey(), NEW); assert.strictEqual(info.state, 'ok'); assert.strictEqual(w.destroyed, true);
  assert.ok(cfg.data.keySavedAt > 0);
  /* toujours valide après 25 h → clé permanente */
  cfg.data.keySavedAt = Date.now() - 26 * 3600000; kw.state = 'unknown'; kw.set('ok');
  assert.strictEqual(cfg.data.keyPermanent, true);
});

test('en jeu : équipe retrouvée même quand l\'événement utilise l\'ancien nom d\'invocateur', () => {
  const Builds = require('../renderer/builds.js');
  const { simplify } = require('../main/live');
  const d = { gameData: { gameTime: 900 }, activePlayer: { riotId: 'Carotte#EUW', riotIdGameName: 'Carotte', summonerName: 'VieuxNom' },
    allPlayers: [
      { riotId: 'Carotte#EUW', riotIdGameName: 'Carotte', riotIdTagLine: 'EUW', summonerName: 'VieuxNom', team: 'CHAOS', championName: 'Swain', rawChampionName: 'game_character_displayname_Swain', items: [], scores: {}, summonerSpells: {} },
      { riotId: 'Allie#1', riotIdGameName: 'Allie', summonerName: 'AncienAllie', team: 'CHAOS', championName: 'Lux', rawChampionName: 'game_character_displayname_Lux', items: [], scores: {}, summonerSpells: {} },
      { riotId: 'Bad#2', riotIdGameName: 'Bad', summonerName: 'AncienBad', team: 'ORDER', championName: 'Zed', rawChampionName: 'game_character_displayname_Zed', items: [], scores: {}, summonerSpells: {} }],
    events: { Events: [
      { EventID: 1, EventName: 'HordeKill', EventTime: 500, KillerName: 'AncienAllie', Assisters: [] },
      { EventID: 2, EventName: 'DragonKill', EventTime: 600, KillerName: 'inconnu', Assisters: ['vieuxnom'], DragonType: 'Fire' },
      { EventID: 3, EventName: 'BaronKill', EventTime: 1300, KillerName: 'AncienBad', Assisters: [] }] } };
  const L = simplify(d);
  assert.strictEqual(L.me.team, 'CHAOS', 'je suis côté rouge');
  const o = Builds.objectives(L, L.me.team);
  const row = (id) => o.rows.find((r) => r.id === id);
  assert.deepStrictEqual([row('grubs').score.us, row('grubs').score.them], [1, 0]);
  assert.deepStrictEqual([row('drake').score.us, row('drake').score.them], [1, 0], 'retrouvé par un assistant');
  assert.deepStrictEqual([row('baron').score.us, row('baron').score.them], [0, 1]);
  assert.strictEqual(Builds.eventTeam({ killer: 'personne', assisters: [] }, L), '');
});

test('fin de partie : je suis retrouvé par Riot ID, côté rouge, avec séries détaillées', () => {
  const Builds = require('../renderer/builds.js');
  const P = (id, team, pos, name, puuid) => ({ participantId: id, teamId: team, teamPosition: pos, kills: 1, deaths: 1, assists: 1, totalMinionsKilled: 10, neutralMinionsKilled: 0, goldEarned: 5000, totalDamageDealtToChampions: 1000, visionScore: 5, puuid, riotIdGameName: name, riotIdTagline: 'EUW' });
  const match = { info: { gameDuration: 600, gameEndTimestamp: 1, teams: [{ teamId: 100, win: true }, { teamId: 200, win: false }],
    participants: [P(1, 100, 'MIDDLE', 'Bad', 'enc-1'), P(6, 200, 'MIDDLE', 'Carotte', 'enc-6')] } };
  const tl = { info: { frames: [{ participantFrames: { 1: { totalGold: 500, xp: 0 }, 6: { totalGold: 500, xp: 0 } }, events: [] },
    { participantFrames: { 1: { totalGold: 900, xp: 300 }, 6: { totalGold: 1400, xp: 500 } }, events: [
      { type: 'CHAMPION_KILL', timestamp: 70000, killerId: 6, victimId: 1, position: { x: 7000, y: 7000 } },
      { type: 'ELITE_MONSTER_KILL', timestamp: 80000, killerTeamId: 200, monsterType: 'HORDE' },
      { type: 'BUILDING_KILL', timestamp: 90000, teamId: 100, buildingType: 'TOWER_BUILDING' }] }] } };
  const G = Builds.postgame(match, tl, 'puuid-du-client-qui-ne-correspond-pas', [{ gameName: 'carotte', tagLine: 'EUW' }]);
  assert.strictEqual(G.me.participantId, 6); assert.strictEqual(G.teams[0].id, 200); assert.strictEqual(G.teams[0].win, false);
  assert.deepStrictEqual(G.T.kills.us, [0, 1]); assert.strictEqual(G.T.firsts.blood.side, 'us'); assert.strictEqual(G.T.firsts.grubs.side, 'us'); assert.strictEqual(G.T.firsts.tower.side, 'us');
  assert.deepStrictEqual(G.T.me.gold, [500, 1400]); assert.deepStrictEqual(G.T.xp, [0, 200]); assert.strictEqual(G.T.myEv[0].kind, 'kill');
});

test('en jeu : tours et inhibiteurs comptés quel que soit le format du nom', () => {
  const Builds = require('../renderer/builds.js');
  const L = { time: 1500, players: [{ name: 'Moi#EUW', gameName: 'Moi', team: 'CHAOS' }, { name: 'Bad#1', gameName: 'Bad', team: 'ORDER' }], events: [
    { name: 'TurretKilled', t: 600, turret: 'Turret_T1_R_03_A', killer: 'Moi' },
    { name: 'TurretKilled', t: 700, turret: 'Turret_T2_L_03_A', killer: 'Bad' },
    { name: 'TurretKilled', t: 800, turret: 'Turret_TOrder_C_05', killer: '' },
    { name: 'TurretKilled', t: 900, turret: '', killer: 'Minion_T200L1S12N0001' },
    { name: 'TurretKilled', t: 950, turret: '', killer: 'Moi#EUW' },
    { name: 'InhibKilled', t: 1400, inhib: 'Barracks_T1_C1', killer: 'Moi' }] };
  const o = Builds.objectives(L, 'CHAOS');
  assert.deepStrictEqual(o.turret, { us: 4, them: 1 });
  assert.deepStrictEqual(o.inhib, { us: 1, them: 0 });
});

test('historique : résumé des parties, cache sur le disque, parties inutiles écartées', async () => {
  const os = require('os'), fs = require('fs'), path = require('path');
  const { History, summarize } = require('../main/history');
  const mk = (id, map, mode, dur, extra = {}) => ({ metadata: { matchId: id }, info: Object.assign({ gameCreation: +id.split('_')[1], gameEndTimestamp: 1, gameDuration: dur, mapId: map, gameMode: mode, queueId: 420,
    participants: [{ puuid: 'ME', teamId: 100, championId: 99, teamPosition: 'MIDDLE', win: true, kills: 4, deaths: 2, assists: 6, totalMinionsKilled: 150, neutralMinionsKilled: 10, goldEarned: 9000, totalDamageDealtToChampions: 20000, visionScore: 20 },
      { puuid: 'A', teamId: 100, kills: 6, totalDamageDealtToChampions: 20000, goldEarned: 9000 }, { puuid: 'B', teamId: 200, kills: 3 }] }, extra) });
  const g = summarize(mk('EUW1_5', 11, 'CLASSIC', 1800), 'ME');
  assert.strictEqual(g.kp, 1); assert.strictEqual(g.dmgShare, 0.5); assert.strictEqual(g.cs, 160); assert.strictEqual(g.role, 'MIDDLE');
  const db = { EUW1_5: mk('EUW1_5', 11, 'CLASSIC', 1800), EUW1_4: mk('EUW1_4', 12, 'ARAM', 1200), EUW1_3: mk('EUW1_3', 11, 'CLASSIC', 300), EUW1_2: mk('EUW1_2', 11, 'CLASSIC', 1500) };
  let calls = 0;
  const api = { matchIds: async () => Object.keys(db), match: async (id) => { calls++; return db[id]; } };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nl-'));
  const h = new History({ api, dir });
  const games = await h.get('ME', 20);
  assert.deepStrictEqual(games.map((x) => x.id), ['EUW1_2', 'EUW1_5'], 'ARAM et partie de 5 min écartées, de la plus ancienne à la plus récente');
  assert.strictEqual(calls, 4);
  const h2 = new History({ api, dir });
  await h2.get('ME', 20);
  assert.strictEqual(calls, 4, 'tout vient du cache');
});

test('fin de partie : bilan des morts (zones, ganks, habitudes)', () => {
  const Builds = require('../renderer/builds.js');
  assert.strictEqual(Builds.zoneOf(7400, 7400, 100).id, 'mid');
  assert.strictEqual(Builds.zoneOf(1000, 9000, 100).id, 'top');
  assert.strictEqual(Builds.zoneOf(9000, 1000, 100).id, 'bot');
  assert.strictEqual(Builds.zoneOf(9800, 4700, 100).id, 'river');
  assert.strictEqual(Builds.zoneOf(4000, 7000, 100).id, 'myjungle');
  assert.strictEqual(Builds.zoneOf(4000, 7000, 200).id, 'enemyjungle');
  assert.strictEqual(Builds.zoneOf(14000, 14200, 100).id, 'enemybase');
  const P = (id, team, pos) => ({ participantId: id, teamId: team, teamPosition: pos, kills: 0, deaths: 0, assists: 0, totalMinionsKilled: 0, goldEarned: 1000, totalDamageDealtToChampions: 100, visionScore: 1, puuid: 'p' + id, championId: id, totalTimeSpentDead: 120 });
  const match = { info: { gameDuration: 1800, gameEndTimestamp: 1, teams: [{ teamId: 100 }, { teamId: 200 }], participants: [P(1, 100, 'MIDDLE'), P(6, 200, 'MIDDLE'), P(7, 200, 'JUNGLE'), P(8, 200, 'TOP')] } };
  const kill = (t, x, y, assists) => ({ type: 'CHAMPION_KILL', timestamp: t * 1000, killerId: 6, victimId: 1, assistingParticipantIds: assists, position: { x, y } });
  const tl = { info: { frames: [{ participantFrames: { 1: { level: 3 }, 6: { level: 4 } }, events: [] }, { participantFrames: {}, events: [kill(200, 9800, 4700, [7, 8]), kill(400, 9500, 5200, [7]), kill(500, 7400, 7400, [])] }] } };
  const G = Builds.postgame(match, tl, 'p1');
  const D = G.deaths;
  assert.strictEqual(D.rows.length, 3);
  assert.deepStrictEqual(D.rows.map((r) => r.kind), ['gank', 'duo', 'solo']);
  assert.deepStrictEqual(D.rows.map((r) => r.zone.id), ['river', 'river', 'mid']);
  assert.ok(D.tips.some((t) => t.includes('avant 10 min')) && D.tips.some((t) => t.includes('rivière')));
  assert.strictEqual(D.rows[0].lvl, 3); assert.strictEqual(D.rows[0].klvl, 4);
});

test('patch : différences entre deux fiches champion', () => {
  const vm = require('vm'), fs = require('fs');
  const ctx = { fetch: () => Promise.reject(new Error('hors ligne')), localStorage: { getItem: () => null, setItem: () => {} }, window: {}, console };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(require.resolve('../renderer/ddragon.js'), 'utf8') + '\nthis.Dd = Dd;', ctx);
  const base = { stats: { hp: 600, armor: 30, attackrange: 550 }, passive: { name: 'P', description: 'a' }, spells: [{ name: 'Q', cooldownBurn: '8/7/6', costBurn: '50', rangeBurn: '700', description: 'x' }] };
  const next = JSON.parse(JSON.stringify(base)); next.stats.hp = 620; next.stats.armor = 28; next.spells[0].cooldownBurn = '9/8/7'; next.spells[0].description = 'y';
  const d = ctx.Dd.diffChamp(base, next);
  const by = (w) => d.find((x) => x.what.includes(w));
  assert.strictEqual(by('PV').good, true); assert.strictEqual(by('Armure').good, false);
  assert.strictEqual(by('recharge').good, false); assert.strictEqual(by('recharge').after, '9/8/7');
  assert.ok(by('description')); assert.strictEqual(d.length, 4);
});
