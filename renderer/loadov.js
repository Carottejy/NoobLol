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
    const fs = Math.max(10, Math.min(16, H * 0.0115));
    const order = (d.teams || []).slice().sort((a, b) => (a.side === 'ORDER' ? -1 : 1) - (b.side === 'ORDER' ? -1 : 1));
    let h = '';
    order.forEach((t, ri) => (t.players || []).slice(0, 5).forEach((p, i) => {
      const c = rows[ri][i]; if (!c) return;
      const m = Math.max(4, c.w * 0.03);
      const top = o.box === 'bottom' ? `top:${Math.round(c.y + c.h * 0.58)}px` : `top:${Math.round(c.y + m)}px`;
      const dt = DT[p.dmg];
      h += `<div class="p ${t.mine ? 'mine' : 'theirs'} ${p.me ? 'me' : ''}" style="left:${Math.round(c.x + m)}px;${top};width:${Math.round(c.w - 2 * m)}px;font-size:${fs.toFixed(1)}px">
        <div class="r"><span class="tier">${esc(p.rank || 'Non classé')}</span><span class="k">${p.level ? 'niv. ' + p.level : ''}</span></div>
        <div class="r"><span class="k">10 dernières</span><span class="${p.wrClass || ''}">${esc(p.wr || '…')}</span></div>
        <div class="r"><span class="k">KDA</span><span>${esc(p.kda || '…')}</span></div>
        <div class="r"><span class="k">${esc(p.role || '')}</span>${dt ? `<span class="dt ${dt[0]}">${dt[1]}</span>` : ''}</div></div>`;
    }));
    /* Mode réglage : contour des cartes calculées, pour les caler sur le jeu */
    if (d.preview) h += `<div class="grid">${rows.flat().map((c) => `<i style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px"></i>`).join('')}</div>`;
    root.innerHTML = h;
  }
  window.addEventListener('resize', () => draw(last));
  if (window.noob && window.noob.loadov) window.noob.loadov.onData(draw);
})();
