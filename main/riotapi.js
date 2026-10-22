/* Client de l'API officielle de Riot Games (developer.riotgames.com).
   Respecte les limites de débit : clé de développement = 20 requêtes/seconde et 100 requêtes/2 minutes. */

const REGIONAL = { euw1: 'europe', eun1: 'europe', tr1: 'europe', ru: 'europe', me1: 'europe', na1: 'americas', br1: 'americas', la1: 'americas', la2: 'americas', kr: 'asia', jp1: 'asia', oc1: 'sea', sg2: 'sea', tw2: 'sea', vn2: 'sea' };
const ACCOUNT_REGION = { europe: 'europe', americas: 'americas', asia: 'asia', sea: 'asia' };
const PLATFORMS = { euw1: 'Europe Ouest (EUW)', eun1: 'Europe Nord & Est (EUNE)', tr1: 'Turquie', ru: 'Russie', me1: 'Moyen-Orient', na1: 'Amérique du Nord', br1: 'Brésil', la1: 'LAN', la2: 'LAS', kr: 'Corée', jp1: 'Japon', oc1: 'Océanie', sg2: 'Asie du Sud-Est', tw2: 'Taïwan', vn2: 'Vietnam' };

class RateLimiter {
  /* windows : [[nombre, millisecondes], …] */
  constructor(windows) { this.windows = windows; this.stamps = []; this.blockedUntil = 0; this.queue = []; this.running = false; }
  setWindows(w) { if (w && w.length) this.windows = w; }
  block(ms) { this.blockedUntil = Math.max(this.blockedUntil, Date.now() + ms); }
  wait(priority = 0) {
    return new Promise((resolve) => { this.queue.push({ resolve, priority }); this.queue.sort((a, b) => b.priority - a.priority); this.pump(); });
  }
  delay() {
    const now = Date.now();
    let d = Math.max(0, this.blockedUntil - now);
    for (const [n, ms] of this.windows) {
      const inWin = this.stamps.filter((t) => t > now - ms);
      if (inWin.length >= n) d = Math.max(d, inWin[inWin.length - n] + ms - now + 25);
    }
    return d;
  }
  pump() {
    if (this.running) return;
    this.running = true;
    const step = () => {
      if (!this.queue.length) { this.running = false; return; }
      const d = this.delay();
      if (d > 0) { setTimeout(step, Math.min(d, 1000)); return; }
      const now = Date.now();
      this.stamps.push(now);
      const maxMs = Math.max(...this.windows.map((w) => w[1]));
      this.stamps = this.stamps.filter((t) => t > now - maxMs);
      this.queue.shift().resolve();
      setImmediate(step);
    };
    step();
  }
}

class RiotError extends Error {
  constructor(status, msg) { super(msg); this.status = status; }
}
function errorText(status) {
  if (status === 401 || status === 403) return 'Clé Riot refusée. Les clés de développement expirent toutes les 24 h : génère-en une nouvelle sur developer.riotgames.com.';
  if (status === 404) return 'Introuvable.';
  if (status === 429) return 'Trop de requêtes, on ralentit.';
  if (status >= 500) return 'Les serveurs de Riot ne répondent pas pour le moment.';
  return 'Erreur ' + status;
}

class RiotApi {
  constructor({ getKey, getPlatform, fetchImpl }) {
    this.getKey = getKey; this.getPlatform = getPlatform;
    this.fetch = fetchImpl || ((...a) => fetch(...a));
    /* Limites prudentes de la clé de développement (ajustées automatiquement d'après les en-têtes de Riot). */
    this.limiter = new RateLimiter([[19, 1000], [98, 120000]]);
    this.calls = 0;
  }
  get platform() { return this.getPlatform() || 'euw1'; }
  get regional() { return REGIONAL[this.platform] || 'europe'; }

  async request(host, pathname, { priority = 0, retries = 2 } = {}) {
    const key = this.getKey();
    if (!key) throw new RiotError(0, 'Ajoute ta clé Riot dans les Réglages.');
    await this.limiter.wait(priority);
    this.calls++;
    let res;
    try {
      res = await this.fetch(`https://${host}.api.riotgames.com${pathname}`, { headers: { 'X-Riot-Token': key } });
    } catch (e) {
      throw new RiotError(0, 'Pas de connexion aux serveurs de Riot.');
    }
    const lim = res.headers.get('x-app-rate-limit');
    if (lim) this.limiter.setWindows(lim.split(',').map((x) => { const [n, s] = x.split(':').map(Number); return [Math.max(1, n - 1), s * 1000]; }));
    if (res.status === 429 && retries > 0) {
      this.limiter.block((+res.headers.get('retry-after') || 5) * 1000);
      return this.request(host, pathname, { priority, retries: retries - 1 });
    }
    if (res.status >= 500 && retries > 0) { this.limiter.block(2000); return this.request(host, pathname, { priority, retries: retries - 1 }); }
    if (!res.ok) throw new RiotError(res.status, errorText(res.status));
    return res.json();
  }
  platformGet(p, o) { return this.request(this.platform, p, o); }
  regionalGet(p, o) { return this.request(this.regional, p, o); }

  status() { return this.platformGet('/lol/status/v4/platform-data', { priority: 5 }); }
  account(gameName, tagLine) { return this.request(ACCOUNT_REGION[this.regional], `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`, { priority: 5 }); }
  summoner(puuid) { return this.platformGet(`/lol/summoner/v4/summoners/by-puuid/${puuid}`, { priority: 5 }); }
  leagues(puuid) { return this.platformGet(`/lol/league/v4/entries/by-puuid/${puuid}`, { priority: 5 }); }
  masteries(puuid, count = 15) { return this.platformGet(`/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`, { priority: 5 }); }
  matchIds(puuid, { queue = 420, count = 20, start = 0, startTime } = {}, priority = 0) {
    const q = new URLSearchParams({ count: String(count), start: String(start) });
    if (queue) q.set('queue', String(queue));
    if (startTime) q.set('startTime', String(Math.floor(startTime / 1000)));
    return this.regionalGet(`/lol/match/v5/matches/by-puuid/${puuid}/ids?${q}`, { priority });
  }
  match(id, priority = 0) { return this.regionalGet(`/lol/match/v5/matches/${id}`, { priority }); }
  timeline(id, priority = 0) { return this.regionalGet(`/lol/match/v5/matches/${id}/timeline`, { priority }); }
  activeGame(puuid) { return this.platformGet(`/lol/spectator/v5/active-games/by-summoner/${puuid}`, { priority: 5 }).catch((e) => { if (e.status === 404) return null; throw e; }); }
  apexLeague(tier, queue = 'RANKED_SOLO_5x5') {
    const p = { CHALLENGER: 'challengerleagues', GRANDMASTER: 'grandmasterleagues', MASTER: 'masterleagues' }[tier];
    return this.platformGet(`/lol/league/v4/${p}/by-queue/${queue}`);
  }
}

module.exports = { RiotApi, RateLimiter, RiotError, REGIONAL, PLATFORMS };
