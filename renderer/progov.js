/* Encart « Ma progression » affiché par-dessus le jeu : chaque indicateur, ta valeur et la cible pour ton rang visé
   à ce moment de la partie. Seule interaction : on le fait glisser pour le déplacer. */
(() => {
  'use strict';
  const box = document.getElementById('box');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function draw(d) {
    if (!d || !d.rows || !d.rows.length) { box.className = 'hidden'; box.innerHTML = ''; return; }
    box.innerHTML = `<div class="ttl">📈 Objectifs ${esc(d.tier || '')}<span>${esc(d.role || '')}</span></div>` +
      d.rows.map((r) => `<div class="m"><span class="l">${esc(r.label)}</span><span></span><span class="v"><b class="${r.st}">${esc(r.cur)}</b> <i>/ ${esc(r.target)}</i></span>
        <div class="bar"><u class="${r.st}" style="width:${Math.max(3, Math.min(100, Math.round(r.pct * 100)))}%"></u></div></div>`).join('');
    box.className = '';
  }
  if (window.noob && window.noob.progov) window.noob.progov.onData(draw);
  else draw({ tier: 'Or', role: 'Mid', rows: [{ label: 'CS', cur: '85', target: '96', pct: 0.88, st: 'mid' }] });
})();
