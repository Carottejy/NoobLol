/* Collecteur de statistiques : récupère des parties classées récentes de joueurs de haut niveau via l'API officielle
   (match-v5) et les range dans la base locale. Avec une clé de développement, environ 45 parties par 2 minutes. */
const { EventEmitter } = require('events');

class Collector extends EventEmitter {
  constructor({ api, db, getConfig }) {
    super();
    this.api = api; this.db = db; this.getConfig = getConfig;
    this.running = false; this.lastError = ''; this.added = 0; this.session = 0; this.startedAt = 0;
  }
  status() {
    return Object.assign({ running: this.running, lastError: this.lastError, session: this.session, startedAt: this.startedAt, calls: this.api.calls }, this.db.counts());
  }
  emitStatus() { this.emit('status', this.status()); }
  start() {
    if (this.running) return;
    this.running = true; this.lastError = ''; this.session = 0; this.startedAt = Date.now();
    this.emitStatus();
    this.loop().catch((e) => { this.lastError = e.message; this.running = false; this.emitStatus(); });
  }
  stop() { this.running = false; this.emitStatus(); }

  async seed() {
    const cfg = this.getConfig();
    const platform = this.api.platform;
    const list = [];
    for (const tier of cfg.collector.tiers || ['CHALLENGER']) {
      const lg = await this.api.apexLeague(tier);
      (lg.entries || []).forEach((e) => { if (e.puuid) list.push({ puuid: e.puuid, tier }); });
      if (!this.running) return;
    }
    this.db.addSeeds(list, platform);
    this.db.run('INSERT OR REPLACE INTO meta (k, v) VALUES (?, ?)', ['seeded:' + platform, String(Date.now())]);
  }

  async step() {
    const cfg = this.getConfig();
    const platform = this.api.platform;
    const seeded = +((this.db.one('SELECT v FROM meta WHERE k = ?', ['seeded:' + platform]) || {}).v || 0);
    if (!seeded || Date.now() - seeded > 3 * 86400000) await this.seed();
    const pending = this.db.pendingMatch();
    if (pending) {
      const m = await this.api.match(pending.id).catch((e) => { if (e.status === 404) return null; throw e; });
      if (m) {
        /* Chronologie : seulement pour les parties qui seront gardées (classée solo, > 15 min). */
        let tl = null;
        if (cfg.collector.timeline !== false && m.info && m.info.queueId === 420 && (m.info.gameDuration || 0) >= 900) tl = await Promise.resolve().then(() => this.api.timeline(pending.id)).catch((e) => { if (e && (e.status === 401 || e.status === 403)) throw e; return null; });
        const n = this.db.addMatch(m, { timeline: tl }); this.added += n;
      } else this.db.run('UPDATE matches SET done = 1 WHERE id = ?', [pending.id]);
      this.session++;
      return;
    }
    const s = this.db.nextSeed(platform);
    if (!s) { this.lastError = 'Aucun joueur de référence trouvé pour cette région.'; this.running = false; return; }
    const ids = await this.api.matchIds(s.puuid, { queue: 420, count: 20, startTime: Date.now() - (cfg.collector.days || 14) * 86400000 });
    this.db.addMatchIds(ids, platform);
    this.db.markSeed(s.puuid);
  }

  async loop() {
    let lastEmit = 0;
    while (this.running) {
      try {
        await this.step();
        this.lastError = '';
      } catch (e) {
        this.lastError = e.message;
        if (e.status === 401 || e.status === 403 || e.status === 0) { this.running = false; }
        else await new Promise((r) => setTimeout(r, 5000));
      }
      if (Date.now() - lastEmit > 1500 || !this.running) { lastEmit = Date.now(); this.emitStatus(); }
    }
    this.db.flush();
    this.emitStatus();
  }
}

module.exports = { Collector };
