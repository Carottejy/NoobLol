/* Encart « Mon build » affiché par-dessus le jeu. Il reçoit les données toutes prêtes de la fenêtre principale.
   On le déplace en le faisant glisser ; un clic sur un objet ouvre sa fiche boutique dans Noob LOL. */
(() => {
  'use strict';
  const box = document.getElementById('box');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nf = (n) => Number(n || 0).toLocaleString('fr-FR');
  const icon = (it, nextId, cls) => (it ? `<button class="it ${cls || ''} ${it.own ? 'own' : ''} ${!it.own && it.id === nextId ? 'next' : ''}" data-id="${it.id}" title="${esc(it.name)}${it.cost ? ' · ' + nf(it.cost) + ' po' : ''} — clic : fiche boutique"><img alt="" src="${esc(it.src)}">${it.own ? '<i>✓</i>' : ''}</button>` : '');
  function draw(d) {
    if (!d) { box.className = 'hidden'; box.innerHTML = ''; return; }
    const n = d.next, nextId = n ? n.id : 0;
    box.innerHTML = `
      <div class="ttl"><b>⭐ ${esc(d.name)}</b><span>${esc(d.champ || '')}</span><span class="grip" title="Glisse pour déplacer">⋮⋮</span></div>
      <div class="nm">${n ? `${icon({ id: n.id, src: n.src, name: n.name }, -1, 'big')}<b>${esc(n.name)}</b>${n.miss <= 0 ? '<span class="ok">assez d\'or !</span>' : `<span class="miss">−${nf(n.miss)} po</span>`}` : '<span class="ok">✅ Build terminé</span>'}</div>
      <div class="row">${(d.core || []).map((it) => icon(it, nextId)).join('<span class="ar">›</span>')}${d.boots ? '<span class="sep"></span>' + icon(d.boots, nextId) : ''}</div>
      ${d.sit && d.sit.length ? `<div class="row sit">${d.sit.map((it) => icon(it, nextId, 'sm')).join('')}</div>` : ''}`;
    box.className = '';
  }
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-id]');
    if (b && window.noob && window.noob.overlay && window.noob.overlay.openItem) window.noob.overlay.openItem(b.dataset.id);
  });
  if (window.noob && window.noob.overlay) window.noob.overlay.onData(draw);
  else draw({ name: 'Aperçu', champ: '', next: null, core: [] });
})();
