/* Lecture (seule) du client League of Legends lancé sur ce PC.
   Le client expose une API locale protégée par un mot de passe écrit dans son fichier « lockfile ».
   Noob LOL ne fait que LIRE : phase de jeu, joueur connecté, sélection des champions. Aucun clic n'est fait à ta place. */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFile } = require('child_process');
const { EventEmitter } = require('events');

/* Le certificat du client est auto-signé : on ne l'accepte QUE pour 127.0.0.1. */
const localAgent = new https.Agent({ rejectUnauthorized: false, keepAlive: true });

function localGet(port, pathname, auth, timeout = 2500) { return localRequest(port, 'GET', pathname, auth, undefined, timeout); }
function localRequest(port, method, pathname, auth, body, timeout = 4000) {
  return new Promise((resolve, reject) => {
    const data = body === undefined ? null : Buffer.from(JSON.stringify(body));
    const req = https.request({ host: '127.0.0.1', port, path: pathname, method, agent: localAgent, timeout,
      headers: Object.assign({ Accept: 'application/json' }, data ? { 'Content-Type': 'application/json', 'Content-Length': data.length } : {}, auth ? { Authorization: 'Basic ' + Buffer.from('riot:' + auth).toString('base64') } : {}) }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (c) => { body += c; });
      res.on('end', () => {
        if (res.statusCode === 404 && method === 'GET') return resolve(null);
        if (res.statusCode >= 400) { let msg = ''; try { msg = JSON.parse(body).message || ''; } catch (e) { /* ignoré */ } return reject(Object.assign(new Error(msg || 'HTTP ' + res.statusCode), { status: res.statusCode })); }
        try { resolve(body ? JSON.parse(body) : null); } catch (e) { resolve(body); }
      });
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function parseLockfile(txt) {
  const p = String(txt || '').trim().split(':');
  if (p.length < 5) return null;
  return { port: +p[2], password: p[3], protocol: p[4] };
}
function parseCommandLine(cmd) {
  const port = (String(cmd).match(/--app-port=(\d+)/) || [])[1];
  const pass = (String(cmd).match(/--remoting-auth-token=([\w-]+)/) || [])[1];
  return port && pass ? { port: +port, password: pass, protocol: 'https' } : null;
}

const POS = { top: 'top', jungle: 'jungle', middle: 'mid', bottom: 'adc', utility: 'support' };

/* Simplifie la session de sélection renvoyée par le client. */
function simplifySession(s) {
  if (!s) return null;
  const me = s.localPlayerCellId;
  const pick = (p) => ({ cellId: p.cellId, champ: p.championId || p.championPickIntent || 0, locked: !!p.championId, intent: !p.championId && !!p.championPickIntent,
    role: POS[p.assignedPosition] || '', spells: [p.spell1Id || 0, p.spell2Id || 0], isMe: p.cellId === me });
  const bans = [].concat(((s.bans || {}).myTeamBans) || [], ((s.bans || {}).theirTeamBans) || []);
  (s.actions || []).flat().forEach((a) => { if (a.type === 'ban' && a.completed && a.championId) bans.push(a.championId); });
  /* Champion actuellement survolé par moi (avant validation) */
  let hover = 0;
  (s.actions || []).flat().forEach((a) => { if (a.actorCellId === me && a.type === 'pick' && a.championId) hover = a.championId; });
  const myTeam = (s.myTeam || []).map(pick);
  const mine = myTeam.find((p) => p.isMe);
  if (mine && !mine.champ && hover) mine.champ = hover;
  return {
    myTeam, theirTeam: (s.theirTeam || []).map(pick), bans: Array.from(new Set(bans.filter(Boolean))),
    timer: s.timer ? { phase: s.timer.phase, left: Math.round((s.timer.adjustedTimeLeftInPhase || 0) / 1000), at: Date.now() } : null,
    myRole: mine ? mine.role : '', benchEnabled: !!s.benchEnabled, isCustom: !!s.isCustomGame,
  };
}

class LcuWatcher extends EventEmitter {
  constructor(getPath, opts = {}) {
    super();
    this.getPath = getPath;
    this.creds = null;
    this.state = { connected: false, phase: 'None', summoner: null, champSelect: null };
    this.timer = null;
    this.platform = opts.platform || process.platform;
  }
  start() { if (!this.timer) this.loop(); }
  stop() { clearTimeout(this.timer); this.timer = null; }
  emitState() { this.emit('state', this.state); }

  async findCreds() {
    const dirs = [this.getPath(), 'C:\\Riot Games\\League of Legends', 'D:\\Riot Games\\League of Legends', 'E:\\Riot Games\\League of Legends', '/Applications/League of Legends.app/Contents/LoL'].filter(Boolean);
    for (const d of dirs) {
      try { const c = parseLockfile(fs.readFileSync(path.join(d, 'lockfile'), 'utf8')); if (c) return c; } catch (e) { /* pas ici */ }
    }
    if (this.platform !== 'win32') return null;
    /* Secours : lire la ligne de commande du client (installation non standard). */
    return new Promise((resolve) => {
      execFile('powershell.exe', ['-NoProfile', '-Command', "(Get-CimInstance Win32_Process -Filter \"name='LeagueClientUx.exe'\").CommandLine"], { windowsHide: true, timeout: 5000 },
        (err, out) => resolve(err ? null : parseCommandLine(out)));
    });
  }
  get(p) { return localGet(this.creds.port, p, this.creds.password); }
  req(method, p, body) { if (!this.creds) throw new Error('Client LoL non détecté.'); return localRequest(this.creds.port, method, p, this.creds.password, body); }

  /* ---- Actions déclenchées par un clic de l'utilisateur (comme Blitz / Porofessor) ----
     Créer une page de runes et choisir les sorts d'invocateur. Jamais de choix de champion. */
  async applyRunes(page) {
    const ids = (page.selectedPerkIds || []).map(Number).filter(Boolean);
    if (!page.primaryStyleId || !page.subStyleId || ids.length !== 9) throw new Error('Page de runes incomplète.');
    const body = { name: String(page.name || 'Noob LOL').slice(0, 50), primaryStyleId: +page.primaryStyleId, subStyleId: +page.subStyleId, selectedPerkIds: ids, current: true };
    const pages = (await this.req('GET', '/lol-perks/v1/pages')) || [];
    /* On remplace d'abord une ancienne page Noob LOL */
    for (const p of pages) if (p.isDeletable && /^Noob LOL/.test(p.name || '')) await this.req('DELETE', `/lol-perks/v1/pages/${p.id}`).catch(() => {});
    try { return await this.req('POST', '/lol-perks/v1/pages', body); } catch (e) {
      /* Plus de place : on remplace la page actuellement sélectionnée si elle est modifiable */
      const cur = await this.req('GET', '/lol-perks/v1/currentpage').catch(() => null);
      if (cur && cur.isDeletable) { await this.req('DELETE', `/lol-perks/v1/pages/${cur.id}`); return this.req('POST', '/lol-perks/v1/pages', body); }
      throw new Error('Impossible de créer la page de runes : ' + e.message);
    }
  }
  async applySpells(spells) {
    if (this.state.phase !== 'ChampSelect') throw new Error('Possible uniquement pendant la sélection des champions.');
    const [a, b] = spells.map(Number);
    if (!a || !b) throw new Error('Sorts incomplets.');
    return this.req('PATCH', '/lol-champ-select/v1/session/my-selection', { spell1Id: a, spell2Id: b });
  }

  async loop() {
    let delay = 3000;
    try {
      if (!this.creds) this.creds = await this.findCreds();
      if (!this.creds) { if (this.state.connected) { this.state = { connected: false, phase: 'None', summoner: null, champSelect: null }; this.emitState(); } }
      else {
        const phase = await this.get('/lol-gameflow/v1/gameflow-phase');
        const changed = !this.state.connected || phase !== this.state.phase;
        this.state.connected = true;
        this.state.phase = phase || 'None';
        if (!this.state.summoner || changed) {
          const s = await this.get('/lol-summoner/v1/current-summoner').catch(() => null);
          if (s) this.state.summoner = { gameName: s.gameName || s.displayName || '', tagLine: s.tagLine || '', puuid: s.puuid, level: s.summonerLevel, icon: s.profileIconId };
        }
        if (this.state.phase === 'ChampSelect') {
          this.state.champSelect = simplifySession(await this.get('/lol-champ-select/v1/session').catch(() => null));
          delay = 1000;
        } else this.state.champSelect = null;
        this.emitState();
      }
    } catch (e) {
      /* Client fermé ou redémarré : on oublie le mot de passe et on recherche. */
      this.creds = null;
      if (this.state.connected) { this.state = { connected: false, phase: 'None', summoner: null, champSelect: null }; this.emitState(); }
    }
    this.timer = setTimeout(() => this.loop(), delay);
  }
}

module.exports = { LcuWatcher, localGet, localRequest, parseLockfile, parseCommandLine, simplifySession };
