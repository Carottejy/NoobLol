/* Disposition de l'écran de chargement du jeu (mesurée sur le client LoL, patch 16.21, écran 1920 × 1080) :
   2 rangées de 5 cartes centrées ; tout est proportionnel à la HAUTEUR de l'écran (le jeu garde ses cartes à la même
   taille relative quelle que soit la largeur). Le nom du champion est à ~75 % de la hauteur de la carte : les infos
   de Noob LOL se posent juste au-dessus (« nameY »). Réglable dans Noob LOL (Réglages → encart de chargement). */
var LoadLayout = (() => {
  'use strict';
  const DEF = { v: 2, cardW: 0.235, cardH: 0.423, gap: 0.038, row1: 0.065, row2: 0.548, nameY: 0.735, box: 'name' };
  /* Rectangles des 10 cartes (5 par rangée) pour un écran W × H */
  function cards(W, H, L) {
    const o = Object.assign({}, DEF, L && L.v === 2 ? L : {});
    const cw = o.cardW * H, ch = o.cardH * H, gap = o.gap * H;
    const total = 5 * cw + 4 * gap, left = (W - total) / 2;
    const row = (top) => Array.from({ length: 5 }, (_, i) => ({ x: left + i * (cw + gap), y: top * H, w: cw, h: ch }));
    return { rows: [row(o.row1), row(o.row2)], o };
  }
  return { DEF, cards };
})();
if (typeof module !== 'undefined') module.exports = LoadLayout;
