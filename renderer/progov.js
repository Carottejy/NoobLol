/* Encart « Ma progression » affiché par-dessus le jeu : chaque indicateur, ta valeur et la cible pour ton rang visé
   à ce moment de la partie. Seule interaction : on le fait glisser pour le déplacer. */
(() => {
  'use strict';
  const box = document.getElementById('box');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /* Symboles des indicateurs (dessinés ici : l'encart n'a pas le droit de charger d'images extérieures) */
  const MINION = '<svg viewBox="0 0 32 32"><path d="M16 3c-6 0-10 4.5-10 10v3h20v-3c0-5.5-4-10-10-10z" fill="#5b8fd8"/><path d="M6 15h20l-2 3H8z" fill="#3d6bb0"/><rect x="9" y="17" width="14" height="9" rx="3" fill="#c9a77a"/><circle cx="13" cy="21" r="1.6" fill="#1a1a1a"/><circle cx="19" cy="21" r="1.6" fill="#1a1a1a"/><path d="M16 3v5" stroke="#f0d58c" stroke-width="2.4" stroke-linecap="round"/><path d="M10 26h12v3H10z" fill="#3d6bb0"/></svg>';
  const COIN = '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="#e2b13c"/><circle cx="16" cy="16" r="10" fill="#f5cf5b" stroke="#b8861b" stroke-width="1.6"/><path d="M13 11h6M16 11v10M13 21h6" stroke="#9a6d10" stroke-width="2.4" stroke-linecap="round"/></svg>';
  const ICON = { cs: MINION, gold: COIN, vision: '👁️', kp: '🤝', deaths: '💀', kda: '⚔️' };
  const TIP = { cs: 'CS par minute', gold: 'Or gagné', vision: 'Score de vision', kp: 'Participation aux kills', deaths: 'Morts', kda: 'KDA' };
  function draw(d) {
    if (!d || !d.rows || !d.rows.length) { box.className = 'hidden'; box.innerHTML = ''; return; }
    box.innerHTML = `<div class="ttl">📈 ${esc(d.tier || '')}<span>${esc(d.role || '')}</span></div>` +
      d.rows.map((r) => `<div class="m"><span class="l" title="${esc(TIP[r.label] || r.label)}">${ICON[r.label] || esc(r.label)}</span><span class="v"><b class="${r.st}">${esc(r.cur)}</b> <i>/ ${esc(r.target)}</i></span>
        <div class="bar"><u class="${r.st}" style="width:${Math.max(3, Math.min(100, Math.round(r.pct * 100)))}%"></u></div></div>`).join('');
    box.className = '';
  }
  if (window.noob && window.noob.progov) window.noob.progov.onData(draw);
  else draw({ tier: 'Or', role: 'Mid', rows: [{ label: 'cs', cur: '6,4', target: '5,0', pct: 0.88, st: 'mid' }] });
})();
