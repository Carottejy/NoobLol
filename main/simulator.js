/* Simulateur de partie (outil de test) : deux petits serveurs HTTPS locaux qui imitent
   - l'API locale du client League of Legends (salon, sélection des champions, runes, sorts, rangs),
   - l'API « Live Client Data » du jeu (données de la partie en cours).
   Noob LOL s'y connecte exactement comme au vrai client : on peut tout tester sans lancer le jeu.
   Toute la simulation (équipes, picks, partie…) est calculée dans la fenêtre du simulateur, qui envoie
   ici l'état à servir ; les actions de Noob LOL (page de runes, sorts) sont renvoyées à la fenêtre. */
const https = require('https');
const crypto = require('crypto');
const { EventEmitter } = require('events');

let CERT = null;
function cert() {
  if (CERT) return CERT;
  const selfsigned = require('selfsigned');
  const p = selfsigned.generate([{ name: 'commonName', value: '127.0.0.1' }], { days: 3650, keySize: 2048 });
  CERT = { key: p.private, cert: p.cert };
  return CERT;
}

class SimServer extends EventEmitter {
  constructor() {
    super();
    this.password = crypto.randomBytes(12).toString('hex');
    this.state = { phase: 'None', summoner: null, session: null, gameflow: null, live: null, players: {} };
    this.perks = [{ id: 1, name: 'Page de base', isDeletable: true, current: true, primaryStyleId: 8000, subStyleId: 8100, selectedPerkIds: [] }];
    this.nextPerk = 2;
    this.lcu = null; this.live = null;
    this.lcuPort = 0; this.livePort = 0;
  }
  push(state) { this.state = Object.assign({}, this.state, state || {}); }

  async start() {
    const c = cert();
    this.lcu = https.createServer(c, (req, res) => this.handleLcu(req, res));
    this.live = https.createServer(c, (req, res) => this.handleLive(req, res));
    await new Promise((r) => this.lcu.listen(0, '127.0.0.1', r));
    await new Promise((r) => this.live.listen(0, '127.0.0.1', r));
    this.lcuPort = this.lcu.address().port; this.livePort = this.live.address().port;
    return { lcu: { port: this.lcuPort, password: this.password, protocol: 'https' }, livePort: this.livePort };
  }
  stop() { try { this.lcu && this.lcu.close(); } catch (e) { /* ignoré */ } try { this.live && this.live.close(); } catch (e) { /* ignoré */ } this.lcu = this.live = null; }

  send(res, code, body) {
    const data = body === undefined ? '' : JSON.stringify(body);
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(data);
  }
  readBody(req) { return new Promise((resolve) => { let b = ''; req.on('data', (c) => { b += c; }); req.on('end', () => { try { resolve(b ? JSON.parse(b) : null); } catch (e) { resolve(null); } }); }); }

  async handleLcu(req, res) {
    const auth = req.headers.authorization || '';
    if (auth !== 'Basic ' + Buffer.from('riot:' + this.password).toString('base64')) return this.send(res, 401, { message: 'Non autorisé' });
    const url = (req.url || '').split('?')[0];
    const S = this.state, m = req.method;
    this.emit('request', { kind: 'lcu', method: m, url });
    if (m === 'GET' && url === '/lol-gameflow/v1/gameflow-phase') return this.send(res, 200, S.phase || 'None');
    if (m === 'GET' && url === '/lol-summoner/v1/current-summoner') return S.summoner ? this.send(res, 200, S.summoner) : this.send(res, 404, { message: 'introuvable' });
    if (m === 'GET' && url === '/lol-champ-select/v1/session') return S.phase === 'ChampSelect' && S.session ? this.send(res, 200, S.session) : this.send(res, 404, { message: 'Pas de sélection en cours' });
    if (m === 'GET' && url === '/lol-gameflow/v1/session') return S.gameflow ? this.send(res, 200, S.gameflow) : this.send(res, 404, { message: 'Pas de partie' });
    let mm = url.match(/^\/lol-ranked\/v1\/ranked-stats\/(.+)$/);
    if (m === 'GET' && mm) { const p = S.players[decodeURIComponent(mm[1])]; return p ? this.send(res, 200, { queueMap: { RANKED_SOLO_5x5: p.tier ? { tier: p.tier, division: p.division || 'NA', leaguePoints: p.lp || 0, wins: p.wins || 0, losses: p.losses || 0 } : { tier: 'NONE', division: 'NA' }, RANKED_FLEX_SR: { tier: 'NONE', division: 'NA' } } }) : this.send(res, 404, {}); }
    mm = url.match(/^\/lol-summoner\/v2\/summoners\/puuid\/(.+)$/);
    if (m === 'GET' && mm) { const p = S.players[decodeURIComponent(mm[1])]; return p ? this.send(res, 200, { summonerLevel: p.level, gameName: p.gameName, tagLine: p.tagLine, puuid: decodeURIComponent(mm[1]) }) : this.send(res, 404, {}); }
    /* Historique des parties d'un joueur (format du client) */
    mm = url.match(/^\/lol-match-history\/v1\/products\/lol\/([^/]+)\/matches$/);
    if (m === 'GET' && mm) {
      const id = decodeURIComponent(mm[1]), p = S.players[id];
      if (!p) return this.send(res, 404, {});
      const games = (p.history || []).map((g, i) => ({ gameId: 9000 + i, gameCreation: Date.now() - (i + 1) * 3600000, gameDuration: g.dur || 1800, queueId: 420, gameMode: 'CLASSIC',
        participantIdentities: [{ participantId: 1, player: { puuid: id, gameName: p.gameName, tagLine: p.tagLine } }],
        participants: [{ participantId: 1, championId: g.champ || 0, stats: { win: !!g.win, kills: g.k, deaths: g.d, assists: g.a } }] }));
      return this.send(res, 200, { accountId: 0, games: { gameCount: games.length, games } });
    }
    /* Données de jeu d'un champion (type de dégâts officiel), fournies par la fenêtre du simulateur */
    mm = url.match(/^\/lol-game-data\/assets\/v1\/champions\/(\d+)\.json$/);
    if (m === 'GET' && mm) { const t = (S.damage || {})[mm[1]]; return t ? this.send(res, 200, { id: +mm[1], tacticalInfo: { damageType: t } }) : this.send(res, 404, {}); }
    /* Pages de runes */
    if (m === 'GET' && url === '/lol-perks/v1/pages') return this.send(res, 200, this.perks);
    if (m === 'GET' && url === '/lol-perks/v1/currentpage') return this.send(res, 200, this.perks.find((p) => p.current) || null);
    if (m === 'POST' && url === '/lol-perks/v1/pages') {
      const body = (await this.readBody(req)) || {};
      if (this.perks.length >= 3) return this.send(res, 400, { message: 'Nombre maximum de pages atteint' });
      this.perks.forEach((p) => { p.current = false; });
      const page = Object.assign({ id: this.nextPerk++, isDeletable: true, current: true }, body);
      this.perks.push(page);
      this.emit('action', { type: 'runes', page });
      return this.send(res, 200, page);
    }
    mm = url.match(/^\/lol-perks\/v1\/pages\/(\d+)$/);
    if (m === 'DELETE' && mm) { this.perks = this.perks.filter((p) => p.id !== +mm[1]); return this.send(res, 204); }
    /* Sorts d'invocateur pendant la sélection */
    if (m === 'PATCH' && url === '/lol-champ-select/v1/session/my-selection') {
      if (S.phase !== 'ChampSelect') return this.send(res, 404, { message: 'Pas de sélection en cours' });
      const body = (await this.readBody(req)) || {};
      this.emit('action', { type: 'spells', spells: [body.spell1Id || 0, body.spell2Id || 0] });
      return this.send(res, 204);
    }
    return this.send(res, 404, { message: 'Point d\'accès non simulé : ' + url });
  }

  handleLive(req, res) {
    const url = (req.url || '').split('?')[0];
    this.emit('request', { kind: 'live', url });
    const L = this.state.live;
    if (!L) return this.send(res, 404, { message: 'Pas de partie en cours' });
    if (url === '/liveclientdata/allgamedata') return this.send(res, 200, L);
    if (url === '/liveclientdata/eventdata') return this.send(res, 200, L.events || { Events: [] });
    if (url === '/liveclientdata/activeplayer') return this.send(res, 200, L.activePlayer || {});
    if (url === '/liveclientdata/playerlist') return this.send(res, 200, L.allPlayers || []);
    return this.send(res, 404, {});
  }
}

module.exports = { SimServer };
