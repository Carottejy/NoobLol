/* Base de statistiques locale (SQLite dans un simple fichier sur le PC, via sql.js : aucune installation).
   Une ligne « pick » = un joueur d'une partie classée analysée : champion, rôle, victoire, adversaire de voie, runes, objets, sorts. */
const fs = require('fs');
const path = require('path');

const ROLES = ['top', 'jungle', 'mid', 'adc', 'support'];

class StatsDb {
  static async open(file, initSqlJs) {
    initSqlJs = initSqlJs || require('sql.js');
    const SQL = await initSqlJs({ locateFile: (f) => path.join(path.dirname(require.resolve('sql.js')), f) });
    let buf = null;
    try { if (file) buf = fs.readFileSync(file); } catch (e) { /* nouvelle base */ }
    const db = new StatsDb(file, buf ? new SQL.Database(buf) : new SQL.Database());
    db.migrate();
    return db;
  }
  constructor(file, db) { this.file = file; this.db = db; this.dirty = false; this.saveT = null; }
  migrate() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT);
      CREATE TABLE IF NOT EXISTS seeds (puuid TEXT PRIMARY KEY, tier TEXT, platform TEXT, fetched INTEGER DEFAULT 0);
      CREATE TABLE IF NOT EXISTS matches (id TEXT PRIMARY KEY, platform TEXT, patch TEXT, created INTEGER, done INTEGER DEFAULT 0);
      CREATE TABLE IF NOT EXISTS picks (match_id TEXT, champ INTEGER, role TEXT, win INTEGER, opp INTEGER, runes TEXT, shards TEXT, items TEXT, spells TEXT, patch TEXT, created INTEGER, PRIMARY KEY (match_id, champ));
      CREATE INDEX IF NOT EXISTS picks_cr ON picks (champ, role);
      CREATE INDEX IF NOT EXISTS picks_ro ON picks (role, opp);
      CREATE INDEX IF NOT EXISTS matches_done ON matches (done);
    `);
    /* v2.2 : chronologie (ordre d'achat, montée des sorts) et composition adverse */
    const cols = this.all('PRAGMA table_info(picks)').map((c) => c.name);
    for (const c of ['seq', 'start', 'skills', 'enemies']) if (!cols.includes(c)) this.db.run(`ALTER TABLE picks ADD COLUMN ${c} TEXT`);
  }
  all(sql, params = []) {
    const st = this.db.prepare(sql); st.bind(params);
    const rows = []; while (st.step()) rows.push(st.getAsObject());
    st.free(); return rows;
  }
  one(sql, params = []) { return this.all(sql, params)[0] || null; }
  run(sql, params = []) { this.db.run(sql, params); this.touch(); }
  touch() { this.dirty = true; clearTimeout(this.saveT); this.saveT = setTimeout(() => this.flush(), 4000); }
  flush() {
    if (!this.dirty || !this.file) return;
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      const tmp = this.file + '.tmp';
      fs.writeFileSync(tmp, Buffer.from(this.db.export()));
      fs.renameSync(tmp, this.file);
      this.dirty = false;
    } catch (e) { console.error('db save', e); }
  }
  close() { this.flush(); this.db.close(); }
  clearStats() { this.db.run('DELETE FROM picks; DELETE FROM matches; DELETE FROM seeds;'); this.touch(); }

  /* ---------- Écriture (collecteur) ---------- */
  addSeeds(list, platform) {
    this.db.run('BEGIN');
    for (const s of list) this.db.run('INSERT OR IGNORE INTO seeds (puuid, tier, platform) VALUES (?, ?, ?)', [s.puuid, s.tier, platform]);
    this.db.run('COMMIT'); this.touch();
  }
  nextSeed(platform) { return this.one('SELECT puuid, tier, fetched FROM seeds WHERE platform = ? ORDER BY fetched ASC LIMIT 1', [platform]); }
  markSeed(puuid) { this.run('UPDATE seeds SET fetched = ? WHERE puuid = ?', [Date.now(), puuid]); }
  addMatchIds(ids, platform) {
    let n = 0;
    this.db.run('BEGIN');
    for (const id of ids) { this.db.run('INSERT OR IGNORE INTO matches (id, platform) VALUES (?, ?)', [id, platform]); n += this.db.getRowsModified(); }
    this.db.run('COMMIT'); this.touch();
    return n;
  }
  pendingMatch() { return this.one('SELECT id FROM matches WHERE done = 0 ORDER BY id DESC LIMIT 1'); }
  /* Enregistre une partie de match-v5. Renvoie le nombre de lignes ajoutées. */
  addMatch(m, { minDuration = 900, timeline = null } = {}) {
    const id = m.metadata.matchId, info = m.info;
    const patch = String(info.gameVersion || '').split('.').slice(0, 2).join('.');
    const ok = info.queueId === 420 && (info.gameDuration || 0) >= minDuration && !(info.participants || []).some((p) => p.gameEndedInEarlySurrender);
    let rows = 0;
    this.db.run('BEGIN');
    if (ok) {
      const ps = (info.participants || []).map((p) => Object.assign({}, p, { role: ({ TOP: 'top', JUNGLE: 'jungle', MIDDLE: 'mid', BOTTOM: 'adc', UTILITY: 'support' })[p.teamPosition] || '' }));
      const tl = timeline ? parseTimeline(timeline) : {};
      for (const p of ps) {
        if (!p.role) continue;
        const opp = ps.find((o) => o.teamId !== p.teamId && o.role === p.role);
        const styles = (p.perks || {}).styles || [];
        const pri = styles.find((s) => s.description === 'primaryStyle') || styles[0];
        const sub = styles.find((s) => s.description === 'subStyle') || styles[1];
        const runes = pri && sub ? `${pri.style}:${pri.selections.map((s) => s.perk).join(',')}|${sub.style}:${sub.selections.map((s) => s.perk).join(',')}` : '';
        const sp = (p.perks || {}).statPerks || {};
        const shards = [sp.offense, sp.flex, sp.defense].filter(Boolean).join(',');
        const items = [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5].filter(Boolean).join(',');
        const spells = [p.summoner1Id, p.summoner2Id].sort((a, b) => a - b).join(',');
        const t = tl[p.participantId] || {};
        const enemies = ps.filter((o) => o.teamId !== p.teamId).map((o) => o.championId).join(',');
        this.db.run('INSERT OR REPLACE INTO picks (match_id, champ, role, win, opp, runes, shards, items, spells, patch, created, seq, start, skills, enemies) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [id, p.championId, p.role, p.win ? 1 : 0, opp ? opp.championId : 0, runes, shards, items, spells, patch, info.gameCreation || 0, t.seq || null, t.start || null, t.skills || null, enemies]);
        rows++;
      }
    }
    this.db.run('INSERT OR REPLACE INTO matches (id, platform, patch, created, done) VALUES (?, (SELECT platform FROM matches WHERE id = ?), ?, ?, 1)', [id, id, patch, info.gameCreation || 0]);
    this.db.run('COMMIT'); this.touch();
    return rows;
  }

  /* ---------- Lecture (interface) ---------- */
  since(days) { return days ? Date.now() - days * 86400000 : 0; }
  counts() {
    return {
      picks: (this.one('SELECT COUNT(*) n FROM picks') || {}).n || 0,
      withTimeline: (this.one('SELECT COUNT(*) n FROM picks WHERE seq IS NOT NULL') || {}).n || 0,
      matches: (this.one('SELECT COUNT(*) n FROM matches WHERE done = 1') || {}).n || 0,
      pending: (this.one('SELECT COUNT(*) n FROM matches WHERE done = 0') || {}).n || 0,
      seeds: (this.one('SELECT COUNT(*) n FROM seeds') || {}).n || 0,
      patches: this.all('SELECT patch, COUNT(*) n FROM picks GROUP BY patch ORDER BY patch DESC LIMIT 4'),
    };
  }
  /* Taux de victoire « lissé » : évite qu'un champion à 3 parties / 3 victoires passe devant tout le monde. */
  static score(wins, games, prior = 10) { return (wins + prior * 0.5) / (games + prior); }

  champ(champ, role, days = 30) {
    const t = this.since(days);
    const roles = this.all('SELECT role, COUNT(*) games, SUM(win) wins FROM picks WHERE champ = ? AND created >= ? GROUP BY role ORDER BY games DESC', [champ, t]);
    if (!role) role = roles[0] ? roles[0].role : '';
    if (!role) return { roles, role: '', games: 0 };
    const base = this.one('SELECT COUNT(*) games, SUM(win) wins FROM picks WHERE champ = ? AND role = ? AND created >= ?', [champ, role, t]) || { games: 0, wins: 0 };
    const roleTotal = (this.one('SELECT COUNT(*) n FROM picks WHERE role = ? AND created >= ?', [role, t]) || {}).n || 0;
    const runes = this.all("SELECT runes, shards, COUNT(*) games, SUM(win) wins FROM picks WHERE champ = ? AND role = ? AND created >= ? AND runes != '' GROUP BY runes, shards ORDER BY games DESC LIMIT 4", [champ, role, t]);
    const spells = this.all('SELECT spells, COUNT(*) games, SUM(win) wins FROM picks WHERE champ = ? AND role = ? AND created >= ? GROUP BY spells ORDER BY games DESC LIMIT 3', [champ, role, t]);
    /* Objets : fréquence de chaque objet présent en fin de partie */
    const itemCount = {};
    this.all('SELECT items, win FROM picks WHERE champ = ? AND role = ? AND created >= ?', [champ, role, t]).forEach((r) => {
      String(r.items || '').split(',').filter(Boolean).forEach((i) => { const o = itemCount[i] || (itemCount[i] = { item: +i, games: 0, wins: 0 }); o.games++; o.wins += r.win; });
    });
    const items = Object.values(itemCount).sort((a, b) => b.games - a.games).slice(0, 25);
    const vs = this.all('SELECT opp, COUNT(*) games, SUM(win) wins FROM picks WHERE champ = ? AND role = ? AND opp > 0 AND created >= ? GROUP BY opp', [champ, role, t]);
    return { roles, role, games: base.games, wins: base.wins || 0, pickRate: roleTotal ? base.games / (roleTotal / 2) : 0, runes, spells, items, matchups: vs };
  }
  /* Lignes brutes pour construire runes / kits d'objets dans l'interface (qui connaît les objets). */
  builds(champ, role, days = 30, limit = 4000) {
    return this.all('SELECT win, opp, runes, shards, spells, items, seq, start, skills, enemies FROM picks WHERE champ = ? AND role = ? AND created >= ? ORDER BY created DESC LIMIT ?', [champ, role, this.since(days), limit]);
  }
  tier(role, days = 30, minGames = 20) {
    const t = this.since(days);
    const total = (this.one('SELECT COUNT(*) n FROM picks WHERE role = ? AND created >= ?', [role, t]) || {}).n || 0;
    return this.all('SELECT champ, COUNT(*) games, SUM(win) wins FROM picks WHERE role = ? AND created >= ? GROUP BY champ HAVING games >= ?', [role, t, minGames])
      .map((r) => Object.assign(r, { pickRate: total ? r.games / (total / 2) : 0, score: StatsDb.score(r.wins, r.games) }))
      .sort((a, b) => b.score - a.score);
  }
  /* Qui gagne le plus souvent contre « enemy » dans ce rôle ? */
  counters(enemy, role, days = 30, minGames = 5) {
    const t = this.since(days);
    return this.all('SELECT champ, COUNT(*) games, SUM(win) wins FROM picks WHERE opp = ? AND role = ? AND created >= ? GROUP BY champ HAVING games >= ?', [enemy, role, t, minGames])
      .map((r) => Object.assign(r, { score: StatsDb.score(r.wins, r.games, 6) })).sort((a, b) => b.score - a.score);
  }
  matchup(champ, opp, role, days = 30) {
    return this.one('SELECT COUNT(*) games, SUM(win) wins FROM picks WHERE champ = ? AND opp = ? AND role = ? AND created >= ?', [champ, opp, role, this.since(days)]) || { games: 0, wins: 0 };
  }
  /* Répartition des rôles joués pour une liste de champions (pour deviner les rôles adverses) */
  roleDist(champs, days = 30) {
    const ks = (champs || []).map(Number).filter(Boolean);
    if (!ks.length) return {};
    const out = {};
    this.all(`SELECT champ, role, COUNT(*) games FROM picks WHERE created >= ? AND champ IN (${ks.map(() => '?').join(',')}) GROUP BY champ, role`, [this.since(days), ...ks])
      .forEach((r) => { (out[r.champ] = out[r.champ] || {})[r.role] = r.games; });
    return out;
  }
  mainRole(champ, days = 30) {
    const r = this.one('SELECT role, COUNT(*) games FROM picks WHERE champ = ? AND created >= ? GROUP BY role ORDER BY games DESC LIMIT 1', [champ, this.since(days)]);
    return r ? r.role : '';
  }
}

/* Chronologie d'une partie → pour chaque participant : ordre des achats, achats de départ, ordre de montée des sorts. */
function parseTimeline(tl) {
  const out = {};
  const get = (pid) => out[pid] || (out[pid] = { buys: [], skills: '' });
  for (const f of ((tl || {}).info || {}).frames || []) {
    for (const e of f.events || []) {
      if (!e.participantId) continue;
      if (e.type === 'ITEM_PURCHASED') get(e.participantId).buys.push({ id: e.itemId, t: e.timestamp });
      else if (e.type === 'ITEM_UNDO' && e.beforeId) { const b = get(e.participantId).buys; for (let i = b.length - 1; i >= 0; i--) if (b[i].id === e.beforeId) { b.splice(i, 1); break; } }
      else if (e.type === 'SKILL_LEVEL_UP' && e.levelUpType !== 'EVOLVE' && e.skillSlot >= 1 && e.skillSlot <= 4) { const p = get(e.participantId); if (p.skills.length < 18) p.skills += String(e.skillSlot); }
    }
  }
  const res = {};
  for (const pid of Object.keys(out)) {
    const o = out[pid];
    res[pid] = { seq: o.buys.slice(0, 40).map((b) => b.id).join(','), start: o.buys.filter((b) => b.t < 75000).map((b) => b.id).sort((a, b) => a - b).join(','), skills: o.skills };
  }
  return res;
}

module.exports = { StatsDb, ROLES, parseTimeline };
