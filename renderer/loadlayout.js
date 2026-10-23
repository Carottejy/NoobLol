/* Disposition de l'écran de chargement du jeu : 2 rangées de 5 cartes, centrées, dont la taille suit la HAUTEUR de l'écran.
   Valeurs exprimées en fraction de la hauteur de l'écran ; réglables dans Noob LOL (Réglages → encart de chargement). */
var LoadLayout = (() => {
  'use strict';
  const DEF = { cardW: 0.23, cardH: 0.42, gap: 0.018, row1: 0.05, row2: 0.52, box: 'top' };
  /* Rectangles des 10 cartes (5 par rangée) pour un écran W × H */
  function cards(W, H, L) {
    const o = Object.assign({}, DEF, L || {});
    const cw = o.cardW * H, ch = o.cardH * H, gap = o.gap * H;
    const total = 5 * cw + 4 * gap, left = (W - total) / 2;
    const row = (top) => Array.from({ length: 5 }, (_, i) => ({ x: left + i * (cw + gap), y: top * H, w: cw, h: ch }));
    return { rows: [row(o.row1), row(o.row2)], o };
  }
  return { DEF, cards };
})();
if (typeof module !== 'undefined') module.exports = LoadLayout;
