/* Infobulles détaillées : au survol (plus d'1 seconde) de n'importe quelle icône d'objet, de rune
   ou de sort d'invocateur, on affiche sa fiche complète. L'icône est reconnue d'après son image
   (Data Dragon), donc tous les écrans en profitent sans rien changer. */
(() => {
  'use strict';
  const DELAY = 1000;
  const D = Dd.st;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let tip = null, timer = null, target = null, mx = 0, my = 0, startAt = 0;
  let byIcon = null;

  function iconIndex() {
    if (byIcon || !D.runes) return byIcon;
    byIcon = {};
    for (const t of D.runes) {
      byIcon[t.icon.toLowerCase()] = { kind: 'tree', x: t };
      t.slots.forEach((sl, i) => sl.runes.forEach((r) => { byIcon[r.icon.toLowerCase()] = { kind: 'rune', x: r, tree: t, row: i }; }));
    }
    return byIcon;
  }
  /* Que représente cette image ? */
  function identify(img) {
    const src = String(img.getAttribute('src') || '');
    let m = src.match(/\/img\/item\/(\d+)\.png/);
    if (m && D.items && D.items[m[1]]) return { kind: 'item', x: D.items[m[1]], id: m[1] };
    m = src.match(/\/img\/spell\/(Summoner\w+)\.png/);
    if (m && D.summs && D.summs[m[1]]) return { kind: 'summ', x: D.summs[m[1]] };
    m = src.match(/\/cdn\/img\/(.+\.png)$/i);
    if (m) { const idx = iconIndex(); if (idx && idx[m[1].toLowerCase()]) return idx[m[1].toLowerCase()]; }
    return null;
  }
  /* Élément survolé → image d'icône concernée */
  function findImg(el) {
    if (!el || !el.closest) return null;
    if (el.tagName === 'IMG') return el;
    const host = el.closest('.tile, .rune, .itm, .bi, .edit-it, .chip, .next');
    if (host) { const imgs = host.querySelectorAll('img'); if (imgs.length === 1) return imgs[0]; }
    return null;
  }

  const smallIcon = (id) => { const it = D.items[String(id)]; return it ? `<img class="tt-mini" alt="" src="${Dd.img.item(it)}" title="">` : ''; };
  function render(info) {
    const x = info.x;
    if (info.kind === 'item') {
      const g = x.gold || {};
      const from = (x.from || []).filter((i) => D.items[i]);
      const into = (x.into || []).filter((i) => D.items[i] && D.items[i].maps && D.items[i].maps['11'] && !D.items[i].requiredAlly).slice(0, 6);
      return `<div class="tt-head"><img alt="" src="${Dd.img.item(x)}"><div><b>${esc(x.name)}</b><span class="tt-gold">${g.total || 0} 🪙${x.from && x.from.length ? ` <span class="tt-muted">(recette ${g.base} · revente ${g.sell})</span>` : g.sell ? ` <span class="tt-muted">(revente ${g.sell})</span>` : ''}</span></div></div>
        ${x.plaintext ? `<div class="tt-plain">${esc(x.plaintext)}</div>` : ''}
        <div class="tt-desc">${Dd.rich(x.description)}</div>
        ${from.length ? `<div class="tt-row"><span class="tt-muted">Se construit avec</span>${from.map(smallIcon).join('')}</div>` : ''}
        ${into.length ? `<div class="tt-row"><span class="tt-muted">Mène à</span>${into.map(smallIcon).join('')}</div>` : ''}`;
    }
    if (info.kind === 'rune') {
      return `<div class="tt-head"><img class="round" alt="" src="${Dd.img.rune(x)}"><div><b>${esc(x.name)}</b><span class="tt-muted">${esc(info.tree.name)} · ${info.row === 0 ? 'rune clé' : 'ligne ' + info.row}</span></div></div>
        <div class="tt-desc">${Dd.rich(x.longDesc || x.shortDesc)}</div>`;
    }
    if (info.kind === 'tree') {
      const keys = (x.slots[0] || { runes: [] }).runes;
      return `<div class="tt-head"><img alt="" src="${Dd.img.rune(x)}"><div><b>Voie : ${esc(x.name)}</b><span class="tt-muted">Runes clés</span></div></div>
        ${keys.map((r) => `<div class="tt-row"><img class="tt-mini round" alt="" src="${Dd.img.rune(r)}"><span><b>${esc(r.name)}</b> — ${esc(Dd.plain(r.shortDesc))}</span></div>`).join('')}`;
    }
    if (info.kind === 'summ') {
      return `<div class="tt-head"><img alt="" src="${Dd.img.spell(x)}"><div><b>${esc(x.name)}</b><span class="tt-muted">Sort d'invocateur · recharge ${esc(x.cooldownBurn)} s${x.summonerLevel ? ` · niveau ${x.summonerLevel}` : ''}</span></div></div>
        <div class="tt-desc">${Dd.rich(x.description)}</div>`;
    }
    return '';
  }

  function place() {
    if (!tip) return;
    const W = window.innerWidth, H = window.innerHeight, r = tip.getBoundingClientRect();
    let x = mx + 16, y = my + 18;
    if (x + r.width > W - 8) x = Math.max(8, mx - r.width - 12);
    if (y + r.height > H - 8) y = Math.max(8, H - r.height - 8);
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  function show(img) {
    const info = identify(img);
    if (!info) return;
    const html = render(info);
    if (!html) return;
    if (!tip) { tip = document.createElement('div'); tip.className = 'tt'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip); }
    tip.innerHTML = html;
    tip.style.display = 'block';
    place();
  }
  function hide() { clearTimeout(timer); timer = null; target = null; if (tip) tip.style.display = 'none'; }

  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; if (tip && tip.style.display === 'block') place(); }, { passive: true });
  document.addEventListener('mouseover', (e) => {
    const img = findImg(e.target);
    if (img === target) return;
    hide();
    if (!img || !identify(img)) return;
    target = img; startAt = Date.now();
    /* L'infobulle native du navigateur ferait doublon */
    [img, img.closest('[title]')].forEach((n) => { if (n && n.getAttribute('title')) { n.dataset.ttl = n.getAttribute('title'); n.removeAttribute('title'); } });
    timer = setTimeout(() => { if (target === img && img.isConnected) show(img); }, DELAY);
  });
  document.addEventListener('mouseout', (e) => { if (target && !(e.relatedTarget && (e.relatedTarget === target || target.contains(e.relatedTarget) || (findImg(e.relatedTarget) === target)))) hide(); });
  ['mousedown', 'wheel', 'keydown'].forEach((t) => document.addEventListener(t, hide, { passive: true }));
  window.addEventListener('blur', hide);
  /* Si l'écran se redessine sous la souris (ex. en jeu, chaque seconde), l'icône survolée est remplacée :
     on garde l'infobulle tant que la souris reste sur la même icône. */
  new MutationObserver(() => {
    if (!target || target.isConnected) return;
    const el = document.elementFromPoint(mx, my);
    const img = findImg(el);
    if (img && identify(img) && img.getAttribute('src') === target.getAttribute('src')) {
      const shown = tip && tip.style.display === 'block';
      target = img;
      if (img.getAttribute('title')) { img.dataset.ttl = img.getAttribute('title'); img.removeAttribute('title'); }
      if (!shown) { clearTimeout(timer); timer = setTimeout(() => { if (target === img && img.isConnected) show(img); }, Math.max(0, DELAY - (Date.now() - startAt))); }
    } else hide();
  }).observe(document.getElementById('app'), { childList: true, subtree: true });
})();
