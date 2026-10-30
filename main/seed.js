/* Statistiques fournies avec l'appli (« seed/stats.nooblolstats ») : à la première ouverture d'une nouvelle version,
   si la base locale contient moins de lignes (parties de joueurs analysées) que ce fichier, elle est remplacée par lui.
   L'ancienne base est gardée à côté (« stats.sqlite.avant-maj.bak »). */
const fs = require('fs');
const path = require('path');
const statsFile = require('./statsfile');

function seedPath(resourcesPath) {
  return [resourcesPath && path.join(resourcesPath, 'seed', 'stats.nooblolstats'), path.join(__dirname, '..', 'seed', 'stats.nooblolstats')]
    .filter(Boolean).find((p) => { try { return fs.statSync(p).isFile(); } catch (e) { return false; } }) || null;
}

/* Renvoie { replaced, local, seed } ; reopen() rouvre la base une fois le fichier remplacé */
async function applySeed({ db, dbFile, seedFile, reopen }) {
  if (!seedFile) return { db, replaced: false, reason: 'pas de fichier fourni' };
  const raw = fs.readFileSync(seedFile);
  const { meta } = statsFile.readMeta(raw);
  const local = db.counts().picks;
  if (local >= (meta.picks || 0)) return { db, replaced: false, local, seed: meta.picks || 0 };
  const { db: buf } = statsFile.unpack(raw);
  /* Vérifie le contenu réel avant de remplacer quoi que ce soit */
  const src = new db.SQL.Database(buf);
  let n = 0;
  try { const st = src.prepare('SELECT COUNT(*) FROM picks'); st.step(); n = st.get()[0]; st.free(); } finally { src.close(); }
  if (n <= local) return { db, replaced: false, local, seed: n };
  db.close();
  try { if (fs.existsSync(dbFile)) fs.copyFileSync(dbFile, dbFile + '.avant-maj.bak'); } catch (e) { /* sauvegarde impossible : on continue */ }
  fs.mkdirSync(path.dirname(dbFile), { recursive: true });
  fs.writeFileSync(dbFile + '.tmp', buf);
  fs.renameSync(dbFile + '.tmp', dbFile);
  return { db: await reopen(), replaced: true, local, seed: n };
}

module.exports = { seedPath, applySeed };
