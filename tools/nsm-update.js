/* Régénère renderer/nsm-data.js à partir de data/nooblol_builds_par_champion.md (une fiche par champion,
   10 builds chacune, corrections en jeu) et de data/nsm-items.json (catégories et groupes exclusifs des objets).
   Utilisation : node tools/nsm-update.js [chemin du fichier .md] */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const src = process.argv[2] || path.join(ROOT, 'data', 'nooblol_builds_par_champion.md');
const items = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'nsm-items.json'), 'utf8'));
const lines = fs.readFileSync(src, 'utf8').split(/\r?\n/);

/* Noms d'objets connus, du plus long au plus court (pour ne pas confondre deux noms qui se recoupent) */
const NAMES = Object.keys(items).concat(['Health Potion', "Doran's Ring", "Doran's Blade", "Doran's Shield", 'World Atlas', 'Bramble Vest', 'Oblivion Orb', "Executioner's Calling"])
  .filter((n, i, a) => a.indexOf(n) === i).sort((a, b) => b.length - a.length);
function itemsIn(text) {
  const found = [];
  let t = text;
  for (const n of NAMES) { let i = t.indexOf(n); while (i >= 0) { found.push([i, n]); t = t.slice(0, i) + ' '.repeat(n.length) + t.slice(i + n.length); i = t.indexOf(n); } }
  return found.sort((a, b) => a[0] - b[0]).map((x) => x[1]);
}
const clean = (s) => s.replace(/\*\*/g, '').trim();
const LANE = { Top: 'top', Jungle: 'jungle', Mid: 'mid', ADC: 'adc', Support: 'support' };

const champions = {};
let cur = null, inCorr = false;
for (const raw of lines) {
  const l = raw.trimEnd();
  let m = l.match(/^### (.+)$/);
  if (m && !/^\d/.test(m[1])) { cur = { roles: [], dmg: '', res: '', range: '', kit: [], builds: [], corr: {}, notes: [] }; champions[m[1].trim()] = cur; inCorr = false; continue; }
  if (!cur) continue;
  if (/^## /.test(l)) { cur = null; continue; }
  m = l.match(/^- \*\*Rôles\*\* : (.+)$/);
  if (m) {
    const p = m[1].split(' · ');
    cur.roles = p[0].split(/\s*[/,]\s*/).map((x) => LANE[x.trim()]).filter(Boolean);
    cur.dmg = /physiques/.test(m[1]) ? 'AD' : /magiques/.test(m[1]) ? 'AP' : 'HYB';
    cur.res = /sans mana/.test(m[1]) ? 'NONE' : /énergie/.test(m[1]) ? 'ENERGY' : 'MANA';
    cur.range = /distance/.test(m[1]) ? 'R' : 'M';
    continue;
  }
  m = l.match(/^- \*\*Particularité\*\* : (.+)$/);
  if (m) { cur.notes.push(clean(m[1])); continue; }
  m = l.match(/^- \*\*Kit\*\* : (.+?)\.?$/);
  if (m) { cur.kit = m[1].split(/,\s*/).map((x) => x.trim()).filter(Boolean); continue; }
  m = l.match(/^\| (\d+) \| (.+?) \| (.+?) \| (.+?) \| (.+?) \| (\d+) \|$/);
  if (m) {
    const its = m[5].split(' → ').map((x) => x.trim());
    its.forEach((n) => { if (!items[n]) throw new Error(`Objet inconnu « ${n} » (${Object.keys(champions).pop()})`); });
    cur.builds.push({ n: +m[1], cat: m[2].trim(), lanes: m[3].split(/,\s*/).map((x) => LANE[x.trim()]).filter(Boolean), variant: m[4].trim(), items: its, cost: +m[6] });
    continue;
  }
  if (/^\*\*Corrections en jeu\*\*/.test(l)) { inCorr = true; continue; }
  m = inCorr && l.match(/^- (.+?) : (.+)$/);
  if (m) {
    const k = m[1], text = clean(m[2]), its = itemsIn(m[2]);
    const key = /\*\*AD\*\*/.test(k) ? 'ad' : /\*\*AP\*\*/.test(k) ? 'ap' : /Assassin/.test(k) ? 'assassin' : /Tank/.test(k) ? 'tank' : /Soins/.test(k) ? 'heal'
      : /Boucliers/.test(k) ? 'shields' : /Contrôles/.test(k) ? 'cc' : /En avance/.test(k) ? 'ahead' : /En retard/.test(k) ? 'behind' : /Particularit/.test(k) ? 'note' : '';
    if (key === 'note') cur.notes.push(text);
    else if (key === 'assassin') {
      const [a, b] = m[2].split(' / ');
      cur.corr.assassin = { text, ad: itemsIn(a || ''), ap: itemsIn(b || '') };
    } else if (key) cur.corr[key] = { text, items: its };
  }
}
const names = Object.keys(champions);
names.forEach((n) => { if (champions[n].builds.length < 1) throw new Error('Fiche sans builds : ' + n); });
const head = lines.join('\n').match(/consulté le (\d{2})\/(\d{2})\/(\d{4})/);
const data = { version: head ? `${head[3]}-${head[2]}-${head[1]}` : new Date().toISOString().slice(0, 10), format: 'champion', items, champions };
const out = '/* Données du moteur NoobStatMotor, générées par tools/nsm-update.js depuis data/nooblol_builds_par_champion.md. Ne pas modifier à la main. */\n'
  + 'var NSM_DATA = ' + JSON.stringify(data) + ';\nif (typeof module !== "undefined") module.exports = NSM_DATA;\n';
fs.writeFileSync(path.join(ROOT, 'renderer', 'nsm-data.js'), out);
const nb = names.reduce((t, n) => t + champions[n].builds.length, 0);
console.log(`NoobStatMotor : base du ${data.version}, ${names.length} champions, ${nb} builds.`);
