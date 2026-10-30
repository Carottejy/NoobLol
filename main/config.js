/* Réglages de l'appli, enregistrés dans le dossier de données de l'utilisateur.
   La clé Riot est chiffrée avec le coffre du système (Windows : DPAPI) via safeStorage. */
const fs = require('fs');
const path = require('path');

const DEFAULTS = {
  seedChecked: '',
  platform: 'euw1',
  lolPath: 'C:\\Riot Games\\League of Legends',
  apiKeyEnc: '',
  apiKeyPlain: '', /* seulement si le chiffrement système n'est pas disponible */
  riotId: { gameName: '', tagLine: '' },
  collector: { autoStart: false, tiers: ['CHALLENGER', 'GRANDMASTER', 'MASTER'], days: 14, timeline: true },
  minimap: { displayId: null, sourceDisplayId: null, crop: { x: 0.857, y: 0.745, w: 0.14, h: 0.25 }, alwaysOnTop: true },
  overlay: { enabled: true, loading: true, x: null, y: null, layout: null },
  autoMode: true,
};

class Config {
  constructor(dir, safeStorage) {
    this.file = path.join(dir, 'config.json');
    this.safe = safeStorage;
    this.data = JSON.parse(JSON.stringify(DEFAULTS));
    try {
      const raw = JSON.parse(fs.readFileSync(this.file, 'utf8'));
      this.data = merge(this.data, raw);
    } catch (e) { /* premier lancement */ }
  }
  save() {
    try { fs.mkdirSync(path.dirname(this.file), { recursive: true }); fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2)); } catch (e) { console.error('config', e); }
  }
  /* Ce que la fenêtre a le droit de voir : jamais la clé elle-même. */
  public() {
    const d = JSON.parse(JSON.stringify(this.data));
    delete d.apiKeyEnc; delete d.apiKeyPlain;
    d.hasApiKey = !!this.getApiKey();
    d.keyEncrypted = !!this.data.apiKeyEnc;
    d.keySavedAt = this.data.keySavedAt || 0; d.keyPermanent = !!this.data.keyPermanent;
    return d;
  }
  set(patch) {
    const allowed = ['platform', 'lolPath', 'riotId', 'collector', 'minimap', 'overlay', 'autoMode'];
    for (const k of Object.keys(patch || {})) if (allowed.includes(k)) this.data[k] = (typeof patch[k] === 'object' && patch[k] && !Array.isArray(patch[k])) ? merge(this.data[k] || {}, patch[k]) : patch[k];
    this.save();
    return this.public();
  }
  setApiKey(key) {
    key = String(key || '').trim();
    this.data.apiKeyEnc = ''; this.data.apiKeyPlain = ''; this.data.keySavedAt = key ? Date.now() : 0; this.data.keyPermanent = false;
    if (key) {
      if (this.safe && this.safe.isEncryptionAvailable()) this.data.apiKeyEnc = this.safe.encryptString(key).toString('base64');
      else this.data.apiKeyPlain = key;
    }
    this.save();
  }
  getApiKey() {
    try {
      if (this.data.apiKeyEnc && this.safe) return this.safe.decryptString(Buffer.from(this.data.apiKeyEnc, 'base64'));
    } catch (e) { return ''; }
    return this.data.apiKeyPlain || '';
  }
}

function merge(a, b) {
  const out = Array.isArray(a) ? a.slice() : Object.assign({}, a);
  for (const k of Object.keys(b || {})) {
    if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a && typeof a[k] === 'object' && a[k] && !Array.isArray(a[k])) out[k] = merge(a[k], b[k]);
    else out[k] = b[k];
  }
  return out;
}

module.exports = { Config, DEFAULTS };
