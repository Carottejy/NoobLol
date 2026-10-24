/* Fichier de partage des statistiques du collecteur (« .nooblolstats ») :
   une en-tête lisible (format, serveur, nombre de parties, date) puis la base compressée. */
const zlib = require('zlib');
const MAGIC = 'NOOBLOLSTATS1\n';

function pack(dbBuf, meta) {
  return Buffer.concat([Buffer.from(MAGIC + JSON.stringify(meta) + '\n', 'utf8'), zlib.gzipSync(dbBuf, { level: 9 })]);
}
function readMeta(buf) {
  if (!buf || buf.length < MAGIC.length || buf.slice(0, MAGIC.length).toString('utf8') !== MAGIC) throw new Error('Ce fichier n\'est pas un fichier de statistiques Noob LOL.');
  const end = buf.indexOf(0x0a, MAGIC.length);
  if (end < 0) throw new Error('Fichier de statistiques abîmé.');
  return { meta: JSON.parse(buf.slice(MAGIC.length, end).toString('utf8')), body: buf.slice(end + 1) };
}
function unpack(buf) { const { meta, body } = readMeta(buf); return { meta, db: zlib.gunzipSync(body) }; }

module.exports = { pack, unpack, readMeta, MAGIC };
