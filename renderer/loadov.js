/* Infos des joueurs affichées SUR chaque carte de l'écran de chargement du jeu (données préparées par la fenêtre principale).
   Les cartes du jeu sont calculées avec LoadLayout (même disposition que le jeu, réglable dans Noob LOL). */
(() => {
  'use strict';
  const root = document.getElementById('root');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const DT = { AD: ['ad', '⚔️ AD'], AP: ['ap', '🔮 AP'], MIXED: ['mixed', 'Mixte'] };
  let last = null;
  function draw(d) {
    last = d;
    if (!d) { root.innerHTML = ''; return; }
    const W = window.innerWidth, H = window.innerHeight;
    const { rows, o } = LoadLayout.cards(W, H, d.layout);
    const order = (d.teams || []).slice().sort((a, b) => (a.side === 'ORDER' ? -1 : 1) - (b.side === 'ORDER' ? -1 : 1));
    let h = '';
    order.forEach((t, ri) => (t.players || []).slice(0, 5).forEach((p, i) => {
      const c = rows[ri][i]; if (!c) return;
      /* Taille du texte proportionnelle à la carte : lisible de 720p à la 4K */
      const fs = Math.max(9, Math.min(18, c.w * 0.047));
      const w = c.w * 0.88, x = c.x + (c.w - w) / 2;
      /* Par défaut : posé juste au-dessus du nom du champion (bas de l'image) ; sinon en haut de la carte */
      const pos = o.box === 'top' ? `top:${Math.round(c.y + c.h * 0.03)}px` : `top:${Math.round(c.y + c.h * o.nameY)}px;transform:translateY(-100%)`;
      const dt = DT[p.dmg];
      h += `<div class="p ${t.mine ? 'mine' : 'theirs'} ${p.me ? 'me' : ''}" style="left:${Math.round(x)}px;${pos};width:${Math.round(w)}px;font-size:${fs.toFixed(1)}px">
        <div class="r"><span class="tier">${esc(p.rank || 'Non classé')}</span><span class="k">${p.level ? 'niv. ' + p.level : ''}</span></div>
        <div class="r"><span class="k">10 parties</span><span class="${p.wrClass || ''}">${esc(p.wr || '…')}</span></div>
        <div class="r"><span class="k">KDA</span><span>${esc(p.kda || '…')}</span></div>
        <div class="r"><span class="k">${esc(p.role || '')}</span>${dt ? `<span class="dt ${dt[0]}">${dt[1]}</span>` : ''}</div></div>`;
    }));
    /* Mode réglage : contour des cartes calculées, pour les caler sur le jeu */
    if (d.preview) h += `<div class="grid">${rows.flat().map((c) => `<i style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px"></i><b style="left:${c.x}px;top:${c.y + c.h * o.nameY}px;width:${c.w}px"></b>`).join('')}</div>`;
    root.innerHTML = h;
  }
  window.addEventListener('resize', () => draw(last));
  if (window.noob && window.noob.loadov) window.noob.loadov.onData(draw);
})();
