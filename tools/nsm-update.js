/* Régénère renderer/nsm-data.js à partir de data/nooblol_builds.md (bloc JSON de l'annexe, section 8).
   Utilisation : node tools/nsm-update.js [chemin du fichier .md] */
const fs = require('fs');
const path = require('path');
const src = process.argv[2] || path.join(__dirname, '..', 'data', 'nooblol_builds.md');
const lines = fs.readFileSync(src, 'utf8').split(/\r?\n/);
const i = lines.findIndex((l) => l.trim() === '```json');
if (i < 0) throw new Error('Bloc ```json introuvable dans ' + src);
const data = JSON.parse(lines[i + 1]);
for (const k of ['items', 'archetypes', 'champions']) if (!data[k]) throw new Error('Clé manquante : ' + k);
const out = '/* Données du moteur NoobStatMotor, extraites automatiquement de data/nooblol_builds.md (annexe JSON). Ne pas modifier à la main : relancer le script de mise à jour. */\n'
  + 'var NSM_DATA = ' + JSON.stringify(data) + ';\nif (typeof module !== "undefined") module.exports = NSM_DATA;\n';
fs.writeFileSync(path.join(__dirname, '..', 'renderer', 'nsm-data.js'), out);
console.log(`NoobStatMotor : version ${data.version}, ${Object.keys(data.champions).length} champions, ${Object.keys(data.archetypes).length} profils, ${Object.keys(data.items).length} objets.`);
