/* Encart « Mon build » affiché par-dessus le jeu. Il reçoit les données toutes prêtes de la fenêtre principale. */
(() => {
  'use strict';
  const box = document.getElementById('box');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nf = (n) => Number(n || 0).toLocaleString('fr-FR');
  const icon = (it, nextName) => (it ? `<span class="it ${it.own ? 'own' : ''} ${!it.own && it.name === nextName ? 'next' : ''}" title="${esc(it.name)}"><img alt="" src="${esc(it.src)}">${it.own ? '<i>✓</i>' : ''}</span>` : '');
  function draw(d) {
    if (!d) { box.className = 'hidden'; box.innerHTML = ''; return; }
    const n = d.next;
    const nextName = n ? n.name : '';
    box.innerHTML = `
      <div class="nx ${n && n.miss <= 0 ? 'ok' : ''}">${n ? `<img alt="" src="${esc(n.src)}">` : '<span style="font-size:30px">✅</span>'}</div>
      <div class="ttl"><b>⭐ ${esc(d.name)}</b><span>${esc(d.champ || '')}</span></div>
      <div class="nm">${n ? `<b>${esc(n.name)}</b>${n.miss <= 0 ? '<span class="ok">assez d\'or !</span>' : `<span class="miss">−${nf(n.miss)} po</span>`}` : '<span class="ok">Build terminé</span>'}</div>
      <div class="row">${(d.core || []).map((it) => icon(it, nextName)).join('<span class="ar">›</span>')}${d.boots ? '<span class="sep"></span>' + icon(d.boots, nextName) : ''}<span class="grip" title="Glisse pour déplacer">⋮⋮</span></div>`;
    box.className = '';
  }
  if (window.noob && window.noob.overlay) window.noob.overlay.onData(draw);
  else draw({ name: 'Aperçu', champ: '', next: null, core: [] });
})();
