/* Type de dégâts OFFICIEL de chaque champion (physique, magique ou mixte), tel que Riot l'indique dans les données
   du client (fiche du champion : « tacticalInfo.damageType »). Source : le client LoL lancé (API locale), sinon la copie
   publique de ces mêmes données (CommunityDragon). Gardé sur le PC : ces données changent très rarement. */
const fs = require('fs');
const path = require('path');
const https = require('https');

const MAP = { kPhysical: 'AD', kMagic: 'AP', kMixed: 'MIXED' };
const parse = (j) => (j && j.tacticalInfo && MAP[j.tacticalInfo.damageType]) || null;

function getJson(url, timeout = 6000) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout, headers: { Accept: 'application/json' } }, (res) => {
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP ' + res.statusCode)); }
      let b = ''; res.setEncoding('utf8'); res.on('data', (c) => { b += c; }); res.on('end', () => { try { resolve(JSON.parse(b)); } catch (e) { reject(e); } });
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}

class DamageTypes {
  constructor({ dir, lcu }) {
    this.lcu = lcu;
    this.file = dir ? path.join(dir, 'types-degats.json') : null;
    this.map = {};
    try { if (this.file) this.map = JSON.parse(fs.readFileSync(this.file, 'utf8')) || {}; } catch (e) { this.map = {}; }
  }
  save() { try { if (this.file) fs.writeFileSync(this.file, JSON.stringify(this.map)); } catch (e) { /* ignoré */ } }
  async one(key) {
    key = String(key);
    if (this.map[key]) return this.map[key];
    let t = null;
    if (this.lcu && this.lcu.creds) t = parse(await this.lcu.get(`/lol-game-data/assets/v1/champions/${key}.json`).catch(() => null));
    if (!t) t = parse(await getJson(`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${key}.json`).catch(() => null));
    if (t) { this.map[key] = t; this.save(); }
    return t;
  }
  async get(keys) {
    const out = {};
    for (const k of (keys || []).filter(Boolean).slice(0, 20)) out[k] = await this.one(k);
    return out;
  }
}

module.exports = { DamageTypes, parse };
