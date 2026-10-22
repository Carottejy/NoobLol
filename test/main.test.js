/* Tests des modules du processus principal (sans Electron ni serveurs Riot). Lancer : npm test */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const { StatsDb } = require('../main/db');
const { Collector } = require('../main/collector');
const { RiotApi, RateLimiter } = require('../main/riotapi');
const { parseLockfile, parseCommandLine, simplifySession, LcuWatcher } = require('../main/lcu');
const { simplify } = require('../main/live');
const { Config } = require('../main/config');

const POS = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];
function fakeMatch(id, champsBlue, champsRed, blueWins, opts = {}) {
  const part = (champ, i, teamId, win) => ({
    puuid: `p${teamId}${i}`, championId: champ, championName: 'C' + champ, teamId, teamPosition: POS[i], win,
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
