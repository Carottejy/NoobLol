/* Renouvellement de la clé Riot, assisté :
   - on surveille la validité de la clé (refus 401/403 de Riot + vérification régulière) ;
   - « Renouveler » ouvre le portail développeur de Riot dans une fenêtre de l'appli (session mémorisée).
     L'utilisateur se connecte, coche lui-même le captcha et clique « Regenerate API Key » ;
     l'appli lit la clé affichée, la teste, l'enregistre et ferme la fenêtre. */
const { EventEmitter } = require('events');

const KEY_RE = /RGAPI-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
/* Script exécuté dans la page du portail : renvoie les clés visibles (champs et texte) */
const PAGE_SCAN = `(() => { const out = new Set(); const re = /RGAPI-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig;
  document.querySelectorAll('input, textarea').forEach((i) => { (String(i.value || '').match(re) || []).forEach((k) => out.add(k)); });
  (String(document.body ? document.body.innerText : '').match(re) || []).forEach((k) => out.add(k));
  return [...out]; })()`;

class KeyWatch extends EventEmitter {
  constructor({ cfg, api }) {
    super();
    this.cfg = cfg; this.api = api;
    this.state = cfg.getApiKey() ? 'unknown' : 'missing';
    this.win = null;
    api.onAuth = (ok) => this.set(ok ? 'ok' : 'expired');
  }
  info() { return { state: this.state, savedAt: this.cfg.data.keySavedAt || 0, permanent: !!this.cfg.data.keyPermanent, renewing: !!(this.win && !this.win.isDestroyed()) }; }
  set(state) {
    if (state === 'ok' && this.cfg.data.keySavedAt && !this.cfg.data.keyPermanent && Date.now() - this.cfg.data.keySavedAt > 25 * 3600000) {
      /* Toujours valide après 25 h : c'est une clé « Personal », elle n'expire pas */
      this.cfg.data.keyPermanent = true; this.cfg.save();
    }
    if (state === this.state) return;
    this.state = state;
    this.emit('change', this.info());
  }
  async check() {
    const key = this.cfg.getApiKey();
    if (!key) return this.set('missing');
    const ok = await this.api.checkKey(key);
    if (ok === null) return; /* pas de réseau : on garde l'état connu */
    this.set(ok ? 'ok' : 'expired');
  }
  startTimer() { this.check(); this.timer = setInterval(() => this.check(), 20 * 60000); }

  /* Fenêtre du portail Riot */
  openRenew({ BrowserWindow, shell, parent }) {
    if (this.win && !this.win.isDestroyed()) { this.win.focus(); return; }
    const win = new BrowserWindow({ width: 1100, height: 820, parent, title: 'Renouveler ma clé Riot — Noob LOL', autoHideMenuBar: true, backgroundColor: '#ffffff',
      webPreferences: { partition: 'persist:riotdev', contextIsolation: true, nodeIntegration: false, sandbox: true } });
    this.win = win;
    this.emit('change', this.info());
    win.webContents.setWindowOpenHandler(({ url }) => { if (/^https:\/\//.test(url)) shell.openExternal(url); return { action: 'deny' }; });
    win.loadURL('https://developer.riotgames.com/');
    const tried = new Set();
    const scan = async () => {
      if (win.isDestroyed()) return;
      if (!/^https:\/\/developer\.riotgames\.com/.test(win.webContents.getURL())) return;
      let keys = [];
      try { keys = await win.webContents.executeJavaScript(PAGE_SCAN, true); } catch (e) { return; }
      for (const k of keys || []) {
        if (!KEY_RE.test(k) || tried.has(k) || k === this.cfg.getApiKey()) continue;
        tried.add(k);
        if ((await this.api.checkKey(k)) === true) {
          this.cfg.setApiKey(k);
          this.set('ok');
          this.emit('renewed', this.info());
          if (!win.isDestroyed()) win.close();
          return;
        }
      }
    };
    const iv = setInterval(scan, 1500);
    win.webContents.on('did-finish-load', scan);
    win.on('closed', () => { clearInterval(iv); this.win = null; this.emit('change', this.info()); });
  }
}

module.exports = { KeyWatch, KEY_RE, PAGE_SCAN };
