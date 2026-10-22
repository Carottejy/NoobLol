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
