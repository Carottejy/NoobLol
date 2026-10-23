/* Infos des joueurs affichées par-dessus l'écran de chargement du jeu (données préparées par la fenêtre principale) */
(() => {
  'use strict';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const card = (p, mine) => `<div class="p ${mine ? 'mine' : 'theirs'} ${p.me ? 'me' : ''}">
    <div class="h">${p.icon ? `<img alt="" src="${esc(p.icon)}">` : ''}<div class="n"><b>${esc(p.champ)}${p.role ? ` · ${esc(p.role)}` : ''}</b><span>${esc(p.name)}</span></div></div>
    <div class="r"><span class="tier">${esc(p.rank || 'Non classé')}</span><span class="k">${p.level ? 'niv. ' + p.level : ''}</span></div>
    <div class="r"><span class="k">10 dernières</span><span class="${p.wrClass || ''}">${esc(p.wr || '…')}</span></div>
    <div class="r"><span class="k">KDA moyen</span><span>${esc(p.kda || '…')}</span></div>
    <div class="bar"><i class="ad" style="width:${p.ad}%"></i><i class="ap" style="width:${100 - p.ad}%"></i></div>
    <div class="dmg"><span>${p.ad} % AD</span><span>${100 - p.ad} % AP</span></div></div>`;
  function draw(d) {
    const top = document.getElementById('top'), bottom = document.getElementById('bottom');
    if (!d) { top.innerHTML = bottom.innerHTML = ''; return; }
    const order = (d.teams || []).slice().sort((a, b) => (a.side === 'ORDER' ? -1 : 1) - (b.side === 'ORDER' ? -1 : 1));
    const [t1, t2] = order;
    top.innerHTML = t1 ? t1.players.map((p) => card(p, t1.mine)).join('') : '';
    bottom.innerHTML = t2 ? t2.players.map((p) => card(p, t2.mine)).join('') : '';
  }
  if (window.noob && window.noob.loadov) window.noob.loadov.onData(draw);
})();
