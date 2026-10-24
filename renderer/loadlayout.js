/* Disposition de l'écran de chargement du jeu (mesurée sur le client LoL, patch 16.21, écran 1920 × 1080) :
   2 rangées de 5 cartes ; tout est proportionnel à la HAUTEUR de l'écran. Une carte fait 253 × 457 px en 1080p
   (rapport hauteur / largeur fixe) et le nom du champion est à 73,5 % de sa hauteur : les infos de Noob LOL se posent
   juste au-dessus. Réglages (5 curseurs) : décalage horizontal, largeur, écart, rangée du haut, rangée du bas. */
var LoadLayout = (() => {
  'use strict';
  const RATIO = 457 / 253, NAME_Y = 0.735;
  const DEF = { v: 3, offX: -0.004, cardW: 0.2343, gap: 0.0398, row1: 0.0639, row2: 0.548 };
  function cards(W, H, L) {
    const o = Object.assign({}, DEF, L && L.v === 3 ? L : {});
    const cw = o.cardW * H, ch = cw * RATIO, gap = o.gap * H;
    const total = 5 * cw + 4 * gap, left = (W - total) / 2 + o.offX * H;
    const row = (top) => Array.from({ length: 5 }, (_, i) => ({ x: left + i * (cw + gap), y: top * H, w: cw, h: ch }));
    return { rows: [row(o.row1), row(o.row2)], o: Object.assign({}, o, { nameY: NAME_Y, box: 'name' }) };
  }
  return { DEF, RATIO, NAME_Y, cards };
})();
if (typeof module !== 'undefined') module.exports = LoadLayout;
