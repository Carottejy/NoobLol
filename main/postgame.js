/* Statistiques de fin de partie : dès que la partie se termine, on récupère la partie complète
   et sa chronologie via l'API officielle (match-v5). Riot met en général 1 à 3 minutes à la publier.
   En attendant (ou sans clé), on garde le dernier état « Live Client Data » de la partie. */
const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

class PostGame extends EventEmitter {
  constructor({ api, getPlatform, dir, wait = 30000, tries = 16 }) {
    super();
    this.api = api; this.getPlatform = getPlatform; this.wait = wait; this.tries = tries;
    this.file = dir ? path.join(dir, 'derniere-partie.json') : null;
    this.data = null; this.token = 0;
    try { if (this.file) this.data = JSON.parse(fs.readFileSync(this.file, 'utf8')); } catch (e) { /* aucune */ }
  }
  save() { try { if (this.file) fs.writeFileSync(this.file, JSON.stringify(this.data)); } catch (e) { /* ignoré */ } }
  set(d) { this.data = d; this.save(); this.emit('update', d); }
  matchIdFor(gameId) { return `${String(this.getPlatform() || 'euw1').toUpperCase()}_${gameId}`; }

  /* Fin de partie détectée */
  async start({ gameId, live, puuid, hasKey }) {
    const token = ++this.token;
    const matchId = gameId ? this.matchIdFor(gameId) : null;
    this.set({ status: matchId && hasKey ? 'waiting' : 'live-only', matchId, live: live || null, puuid: puuid || '', at: Date.now(), reason: !hasKey ? 'nokey' : !gameId ? 'nogame' : '' });
    if (!matchId || !hasKey) return;
    for (let i = 0; i < this.tries; i++) {
      if (token !== this.token) return;
      try {
        const match = await this.api.match(matchId, 5);
        const timeline = await this.api.timeline(matchId, 5).catch(() => null);
        if (token !== this.token) return;
        this.set(Object.assign({}, this.data, { status: 'ready', match, timeline }));
        return;
      } catch (e) {
        if (e.status && e.status !== 404 && e.status !== 429 && e.status < 500) { this.set(Object.assign({}, this.data, { status: 'live-only', reason: e.message })); return; }
      }
      await new Promise((r) => setTimeout(r, this.wait));
    }
    if (token === this.token) this.set(Object.assign({}, this.data, { status: 'live-only', reason: 'Riot n\'a pas publié la partie (partie personnalisée ou d\'entraînement ?)' }));
  }

  /* Ouvrir une ancienne partie (depuis « Mon compte ») */
  async load(matchId, puuid) {
    const token = ++this.token;
    const match = await this.api.match(matchId, 5);
    const timeline = await this.api.timeline(matchId, 5).catch(() => null);
    if (token !== this.token) return this.data;
    this.set({ status: 'ready', matchId, match, timeline, live: null, puuid: puuid || '', at: Date.now(), old: true });
    return this.data;
  }
}

module.exports = { PostGame };
