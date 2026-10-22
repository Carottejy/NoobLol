/* Noob LOL — compagnon de jeu League of Legends pour débutants (PWA) */
(() => {
  'use strict';
  const KEY = 'nooblol.state.v1';
  const $app = document.getElementById('app');
  const $tabs = document.getElementById('tabs');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’.\s-]/g, '');
  const D = Dd.st;

  /* ---------- État ---------- */
  const newEnemy = () => ({ champ: '', s: ['SummonerFlash', ''], until: [0, 0], haste: 0 });
  const newGame = () => ({ start: null, timers: {}, enemies: [0, 1, 2, 3, 4].map(newEnemy), fired: {} });
  const defaults = () => ({
    tab: 'home', view: { champ: null, item: null }, favs: [], notes: {}, skin: {},
    cf: { q: '', tag: '', range: '', diff: '', fav: false }, itf: { q: '', tag: '' }, rune: { tree: 0, sel: null }, lexQ: '', role: 'top',
    game: newGame(), opt: { sound: true, vibrate: true, wake: false, editEnemies: false }, tipN: 0,
  });
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!raw) return defaults();
      const d = defaults();
      Object.assign(d, raw);
      ['cf', 'itf', 'rune', 'opt', 'view'].forEach((k) => { d[k] = Object.assign(defaults()[k], raw[k] || {}); });
      d.game = Object.assign(newGame(), raw.game || {});
      if (!Array.isArray(d.game.enemies) || d.game.enemies.length !== 5) d.game.enemies = newGame().enemies;
      return d;
    } catch (e) { return defaults(); }
  }
  let S = load();
  S.tipN = Math.floor(Math.random() * GUIDE.tips.length);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* stockage plein/bloqué */ } };

  /* ---------- Libellés ---------- */
  const CTAG = { Fighter: 'Combattant', Tank: 'Tank', Mage: 'Mage', Assassin: 'Assassin', Marksman: 'Tireur', Support: 'Support' };
  const CTAG_IC = { Fighter: '⚔️', Tank: '🛡️', Mage: '🔮', Assassin: '🗡️', Marksman: '🏹', Support: '💖' };
  const ITAG = [['', 'Tous'], ['_start', 'Départ'], ['_final', 'Objets finaux'], ['Boots', 'Bottes'], ['Damage', 'Dégâts (AD)'], ['CriticalStrike', 'Critique'], ['AttackSpeed', 'Vitesse d\'attaque'],
    ['SpellDamage', 'Puissance (AP)'], ['Health', 'Vie'], ['Armor', 'Armure'], ['SpellBlock', 'Résist. magique'], ['AbilityHaste', 'Accélération'], ['LifeSteal', 'Vol de vie'], ['Mana', 'Mana'], ['NonbootsMovement', 'Vitesse'], ['Vision', 'Vision'], ['Consumable', 'Consommables']];
  const ROLE_NAME = { top: 'Top', jungle: 'Jungle', mid: 'Mid', adc: 'ADC', support: 'Support' };
  const diffOf = (c) => { const d = (c.info || {}).difficulty || 0; return d <= 3 ? 'easy' : d <= 6 ? 'mid' : 'hard'; };
  const DIFF = { easy: ['Facile', '🟢'], mid: ['Moyen', '🟡'], hard: ['Difficile', '🔴'] };
  const isMelee = (c) => ((c.stats || {}).attackrange || 0) <= 300;
  const beginnerRole = (id) => Object.keys(GUIDE.beginners).find((r) => GUIDE.beginners[r].includes(id));
  const fmt = (sec) => { sec = Math.max(0, Math.round(sec)); const m = Math.floor(sec / 60), s = sec % 60; return `${m}:${String(s).padStart(2, '0')}`; };
  const parseMS = (t) => { const m = String(t || '').trim().match(/^(\d{1,3})(?:[:h.,\s](\d{1,2}))?$/); if (!m) return null; return (+m[1]) * 60 + (+(m[2] || 0)); };

  /* ---------- Rendu principal ---------- */
  const TABS = [['home', '🏠', 'Accueil'], ['champs', '🦸', 'Champions'], ['items', '🛒', 'Objets'], ['game', '⏱️', 'Partie'], ['runes', '✨', 'Runes'], ['guide', '📖', 'Guide'], ['lex', '💬', 'Lexique'], ['info', 'ℹ️', 'Infos']];
  function render(keepScroll) {
    $tabs.innerHTML = TABS.map(([id, ic, lb]) => `<button class="${S.tab === id ? 'on' : ''}" data-act="tab" data-val="${id}"><span>${ic}</span>${lb}</button>`).join('');
    const v = { home: viewHome, champs: viewChamps, items: viewItems, game: viewGame, runes: viewRunes, guide: viewGuide, lex: viewLex, info: viewInfo }[S.tab] || viewHome;
    const y = window.scrollY;
    $app.innerHTML = v();
    window.scrollTo(0, keepScroll ? y : 0);
    tick();
    save();
  }
  /* Les vues qui ont besoin des données Riot affichent un chargement puis se redessinent. */
  function needData() {
    if (D.champs) return '';
    if (D.error) return `<div class="card"><h2>Données indisponibles</h2><p class="muted">${esc(D.error)}</p><button class="btn" data-act="retry">Réessayer</button></div>`;
    Dd.load().then(() => render(true)).catch(() => render(true));
    return '<div class="loader">Chargement des données de Riot…</div>';
  }
  const tile = (c) => `<button class="tile" data-act="champ" data-val="${esc(c.id)}">${S.favs.includes(c.id) ? '<span class="fav">⭐</span>' : ''}<img loading="lazy" alt="" src="${Dd.img.champ(c)}">${esc(c.name)}</button>`;

  /* ---------- Accueil ---------- */
  function viewHome() {
    const nd = needData();
    const favs = D.champs ? S.favs.map((id) => D.champs[id]).filter(Boolean) : [];
    const heroId = favs.length ? favs[Math.floor(Date.now() / 86400000) % favs.length].id : 'Ahri';
    let h = `<div class="hero" style="background-image:url('${Dd.img.splash(heroId)}')"><div>
      <h1>Noob LOL</h1><p>Ton compagnon pour apprendre et progresser sur League of Legends.</p>
      ${D.version ? `<span class="tag gold">Patch ${esc(D.version.split('.').slice(0, 2).join('.'))}</span>` : ''}</div></div>`;
    h += `<div class="card"><div class="row sp"><h2 style="margin:0">💡 Conseil</h2><button class="chip" data-act="tipNext">Un autre</button></div>
      <p class="tip" style="margin-top:8px">${esc(GUIDE.tips[S.tipN % GUIDE.tips.length])}</p></div>`;
    h += installCard();
    if (nd) return h + nd;
    h += `<div class="card"><h2>⭐ Mes champions</h2>${favs.length ? `<div class="grid-ic">${favs.map(tile).join('')}</div>` : '<p class="muted">Ajoute tes champions préférés avec l\'étoile sur leur fiche : ils apparaîtront ici.</p>'}</div>`;
    const ids = GUIDE.beginners[S.role] || [];
    h += `<div class="card"><h2>🎓 Par qui commencer ?</h2><p class="muted">Des champions simples et efficaces, conseillés pour débuter dans chaque rôle.</p>
      <div class="chips scroll" style="margin:8px 0">${Object.keys(ROLE_NAME).map((r) => `<button class="chip ${S.role === r ? 'on' : ''}" data-act="role" data-val="${r}">${ROLE_NAME[r]}</button>`).join('')}</div>
      <div class="grid-ic">${ids.map((id) => D.champs[id]).filter(Boolean).map(tile).join('')}</div>
      <p class="small muted" style="margin-top:8px">${esc((GUIDE.roles.find((r) => r.id === S.role) || {}).who || '')} <a href="#" data-act="tab" data-val="guide">Voir le guide des rôles</a></p></div>`;
    h += `<div class="stat-row"><button class="stat btn ghost" data-act="tab" data-val="game"><b>⏱️</b>Timers de partie</button><button class="stat btn ghost" data-act="tab" data-val="guide"><b>📖</b>Guide débutant</button><button class="stat btn ghost" data-act="tab" data-val="lex"><b>💬</b>Lexique</button></div>`;
    return h;
  }
  let installEvt = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvt = e; if (S.tab === 'home' && !S.view.champ) render(true); });
  function installCard() {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    if (standalone || S.opt.hideInstall) return '';
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (!installEvt && !ios) return '';
    return `<div class="card gold"><div class="row sp nw"><div class="grow"><b>📲 Installe Noob LOL</b><div class="muted small">${ios ? 'Dans Safari : bouton Partager, puis « Sur l\'écran d\'accueil ».' : 'Ajoute l\'appli à ton écran d\'accueil, elle marchera même hors connexion.'}</div></div>
      ${installEvt ? '<button class="btn small" data-act="install">Installer</button>' : ''}<button class="chip" data-act="hideInstall" aria-label="Masquer">✕</button></div></div>`;
  }

  /* ---------- Champions ---------- */
  function champMatches() {
    const f = S.cf, q = norm(f.q);
    return D.champList.filter((c) => (!q || norm(c.name).includes(q) || norm(c.id).includes(q) || norm(c.title).includes(q))
      && (!f.tag || c.tags.includes(f.tag)) && (!f.range || (f.range === 'melee') === isMelee(c)) && (!f.diff || diffOf(c) === f.diff) && (!f.fav || S.favs.includes(c.id)));
  }
  function champGrid() { const l = champMatches(); return l.length ? `<p class="muted small">${l.length} champion${l.length > 1 ? 's' : ''}</p><div class="grid-ic">${l.map(tile).join('')}</div>` : '<div class="empty">Aucun champion ne correspond.</div>'; }
  function viewChamps() {
    if (S.view.champ) return viewChamp(S.view.champ);
    const nd = needData(); if (nd) return '<h1>Champions</h1>' + nd;
    const f = S.cf;
    const c = (path, val, label) => `<button class="chip ${f[path] === val ? 'on' : ''}" data-act="cf" data-path="${path}" data-val="${val}">${label}</button>`;
    return `<div class="search"><input type="search" placeholder="🔎 Rechercher un champion…" value="${esc(f.q)}" data-in="cf.q" autocomplete="off"></div>
      <div class="chips scroll">${c('tag', '', 'Toutes classes')}${Object.keys(CTAG).map((t) => c('tag', t, CTAG_IC[t] + ' ' + CTAG[t])).join('')}</div>
      <div class="chips scroll" style="margin:6px 0 10px">${c('fav', true, '⭐ Favoris')}${c('range', 'melee', 'Mêlée')}${c('range', 'ranged', 'Distance')}${Object.keys(DIFF).map((d) => c('diff', d, DIFF[d][1] + ' ' + DIFF[d][0])).join('')}</div>
      <div id="clist">${champGrid()}</div>`;
  }
  let fullLoading = null;
  function viewChamp(id) {
    const nd = needData(); if (nd) return nd;
    const c = D.champs[id];
    if (!c) { S.view.champ = null; return viewChamps(); }
    const full = D.full[id];
    if (!full && fullLoading !== id) { fullLoading = id; Dd.champFull(id).then(() => { fullLoading = null; if (S.view.champ === id) render(true); }).catch(() => { fullLoading = null; toast('Impossible de charger la fiche (connexion ?)'); }); }
    const skin = S.skin[id] || 0;
    const fav = S.favs.includes(id);
    const br = beginnerRole(id);
    let h = `<div class="splash" style="background-image:url('${Dd.img.splash(id, skin)}')"><button class="btn ghost small back" data-act="back">← Retour</button>
      <div class="t"><div class="row sp nw"><div class="grow"><h1>${esc(c.name)}</h1><div class="sub">${esc(c.title.charAt(0).toUpperCase() + c.title.slice(1))}</div></div>
      <button class="btn ${fav ? '' : 'ghost'} small" data-act="fav" data-val="${esc(id)}">${fav ? '⭐ Favori' : '☆ Favori'}</button></div></div></div>`;
    h += `<div class="card"><div>${c.tags.map((t) => `<span class="tag">${CTAG_IC[t] || ''} ${CTAG[t] || t}</span>`).join('')}<span class="tag">${isMelee(c) ? 'Mêlée' : 'Distance'}</span><span class="tag">${esc(c.partype || 'Sans ressource')}</span>${br ? `<span class="tag gold">🎓 Conseillé pour débuter (${ROLE_NAME[br]})</span>` : ''}</div>
      <div class="meters" style="margin-top:10px">
        ${[['Attaque', c.info.attack], ['Défense', c.info.defense], ['Magie', c.info.magic], ['Difficulté', c.info.difficulty]].map(([l, v]) => `<span class="muted">${l}</span><div class="bar"><i style="width:${(v || 0) * 10}%"></i></div>`).join('')}
      </div><p class="muted small" style="margin-top:8px">${DIFF[diffOf(c)][1]} Difficulté : ${DIFF[diffOf(c)][0]} (${c.info.difficulty}/10)</p></div>`;
    if (!full) return h + '<div class="loader">Chargement des sorts…</div>';
    const keys = ['Q', 'W', 'E', 'R'];
    h += `<div class="card"><h2>Compétences</h2>
      <div class="spell"><img class="ico lg" alt="" src="${Dd.img.passive(full.passive)}"><div class="grow"><b><span class="key">P</span>${esc(full.passive.name)}</b><div class="desc">${Dd.rich(full.passive.description)}</div></div></div>
      ${full.spells.map((s, i) => {
        const cost = s.costBurn && s.costBurn !== '0' && s.costType !== 'Sans coût' ? `${esc(s.costBurn)} ${esc(full.partype || '')}` : '';
        const range = s.rangeBurn && !/self|25000/.test(s.rangeBurn) ? esc(s.rangeBurn) : '';
        return `<div class="spell"><img class="ico lg" alt="" src="${Dd.img.spell(s)}"><div class="grow"><b><span class="key">${keys[i]}</span>${esc(s.name)}</b>
        <div class="muted small">⏳ Recharge : ${esc(s.cooldownBurn)} s${cost ? ` · 💧 Coût : ${cost}` : ''}${range ? ` · 📏 Portée : ${range}` : ''}</div>
        <div class="desc">${Dd.rich(s.description)}</div></div></div>`;
      }).join('')}</div>`;
    const ally = full.allytips || [], enemy = full.enemytips || [];
    h += `<div class="card"><h2>🎮 Conseils pour le jouer</h2>${ally.length ? `<ul class="tips">${ally.map((t) => `<li>${Dd.rich(t)}</li>`).join('')}</ul>` : '<p class="muted">Riot n\'a pas publié de conseils pour ce champion.</p>'}</div>`;
    h += `<div class="card"><h2>🛡️ Comment le contrer</h2>${enemy.length ? `<ul class="tips">${enemy.map((t) => `<li>${Dd.rich(t)}</li>`).join('')}</ul>` : '<p class="muted">Riot n\'a pas publié de conseils pour ce champion.</p>'}</div>`;
    const st = full.stats;
    h += `<details><summary>📊 Statistiques de base (niveau 1)</summary><div class="in"><div class="kv">
      ${[['Vie', st.hp, st.hpperlevel], ['Mana / ressource', st.mp, st.mpperlevel], ['Armure', st.armor, st.armorperlevel], ['Résist. magique', st.spellblock, st.spellblockperlevel], ['Dégâts d\'attaque', st.attackdamage, st.attackdamageperlevel], ['Vitesse d\'attaque', st.attackspeed, null], ['Portée', st.attackrange, null], ['Vitesse de déplacement', st.movespeed, null]]
        .map(([l, v, p]) => `<div><span>${l}</span><b>${Math.round(v * 1000) / 1000}${p ? ` <span class="muted small">+${Math.round(p * 100) / 100}/niv</span>` : ''}</b></div>`).join('')}
      </div></div></details>`;
    if (full.skins && full.skins.length > 1) {
      h += `<details><summary>🎨 Skins (${full.skins.length})</summary><div class="in"><div class="chips">${full.skins.map((s) => `<button class="chip ${skin === s.num ? 'on' : ''}" data-act="skin" data-id="${esc(id)}" data-val="${s.num}">${esc(s.name === 'default' ? 'Classique' : s.name)}</button>`).join('')}</div></div></details>`;
    }
    h += `<details><summary>📜 Histoire</summary><div class="in desc">${esc(full.lore || c.blurb)}</div></details>`;
    h += `<div class="card"><h2>📝 Mes notes</h2><textarea placeholder="Combos, objets qui marchent, erreurs à éviter…" data-note="${esc(id)}">${esc(S.notes[id] || '')}</textarea><p class="muted small">Enregistré automatiquement sur ce téléphone.</p></div>`;
    return h;
  }

  /* ---------- Objets ---------- */
  function itemMatches() {
    const f = S.itf, q = norm(f.q);
    return D.itemList.filter((it) => {
      if (q && !norm(it.name).includes(q) && !norm(it.plaintext).includes(q) && !(it.colloq && norm(it.colloq).includes(q))) return false;
      if (!f.tag) return true;
      if (f.tag === '_start') return (it.tags || []).some((t) => t === 'Lane' || t === 'Jungle' || t === 'GoldPer') && it.gold.total <= 600 && !it.from;
      if (f.tag === '_final') return !(it.into && it.into.length) && it.gold.total >= 2000;
      return (it.tags || []).includes(f.tag);
    });
  }
  function itemGrid() { const l = itemMatches(); return l.length ? `<p class="muted small">${l.length} objet${l.length > 1 ? 's' : ''} · triés par prix</p><div class="grid-ic">${l.map((it) => `<button class="tile" data-act="item" data-val="${esc(it.id)}"><img loading="lazy" alt="" src="${Dd.img.item(it)}">${esc(it.name)}<div class="price">${it.gold.total} 🪙</div></button>`).join('')}</div>` : '<div class="empty">Aucun objet ne correspond.</div>'; }
  function viewItems() {
    if (S.view.item) return viewItem(S.view.item);
    const nd = needData(); if (nd) return '<h1>Objets</h1>' + nd;
    return `<div class="search"><input type="search" placeholder="🔎 Rechercher un objet…" value="${esc(S.itf.q)}" data-in="itf.q" autocomplete="off"></div>
      <div class="chips scroll" style="margin-bottom:10px">${ITAG.map(([t, l]) => `<button class="chip ${S.itf.tag === t ? 'on' : ''}" data-act="itag" data-val="${t}">${l}</button>`).join('')}</div>
      <div id="ilist">${itemGrid()}</div>`;
  }
  function viewItem(id) {
    const nd = needData(); if (nd) return nd;
    const it = D.items[id];
    if (!it) { S.view.item = null; return viewItems(); }
    const link = (iid) => { const x = D.items[iid]; return x ? `<button class="tile" data-act="item" data-val="${esc(iid)}"><img loading="lazy" alt="" src="${Dd.img.item(x)}">${esc(x.name)}<div class="price">${x.gold.total} 🪙</div></button>` : ''; };
    const into = (it.into || []).filter((x) => D.items[x] && D.items[x].maps && D.items[x].maps['11'] && !D.items[x].requiredAlly);
    let h = `<div class="row" style="margin:6px 0 12px"><button class="btn ghost small" data-act="back">← Retour</button></div>
      <div class="card gold"><div class="row nw"><img class="ico lg" alt="" src="${Dd.img.item(it)}" style="width:64px;height:64px"><div class="grow"><h1 style="margin:0">${esc(it.name)}</h1>
      <div class="muted">${esc(it.plaintext || '')}</div></div></div>
      <div class="row" style="margin-top:10px"><span class="tag gold">Prix : ${it.gold.total} 🪙</span>${it.from ? `<span class="tag">Recette : ${it.gold.base} 🪙</span>` : ''}<span class="tag">Revente : ${it.gold.sell} 🪙</span></div>
      <div class="desc" style="margin-top:10px">${Dd.rich(it.description)}</div></div>`;
    if (it.from && it.from.length) h += `<div class="card"><h2>🧩 Se construit avec</h2><div class="grid-ic">${it.from.map(link).join('')}</div></div>`;
    if (into.length) h += `<div class="card"><h2>⬆️ Sert à construire</h2><div class="grid-ic">${into.map(link).join('')}</div></div>`;
    return h;
  }

  /* ---------- Runes & sorts d'invocateur ---------- */
  function viewRunes() {
    const nd = needData(); if (nd) return '<h1>Runes</h1>' + nd;
    const trees = D.runes;
    const t = trees[S.rune.tree] || trees[0];
    let sel = null;
    trees.forEach((tr) => tr.slots.forEach((sl) => sl.runes.forEach((r) => { if (r.id === S.rune.sel) sel = r; })));
    let h = `<h1>Runes</h1><p class="muted">Avant la partie, tu choisis une <b>voie principale</b> (1 rune clé + 3 runes) et une <b>voie secondaire</b> (2 runes). Débutant ? Les pages de runes <b>recommandées</b> du jeu sont un très bon choix.</p>
      <div class="chips scroll" style="margin:8px 0 10px">${trees.map((tr, i) => `<button class="chip ${tr === t ? 'on' : ''}" data-act="tree" data-val="${i}"><img alt="" src="${Dd.img.rune(tr)}" style="width:18px;height:18px;vertical-align:-4px"> ${esc(tr.name)}</button>`).join('')}</div>
      <div class="card tree">${t.slots.map((sl, i) => `<div class="muted small" style="margin-top:${i ? 10 : 0}px">${i === 0 ? 'Runes clés (une seule)' : 'Ligne ' + i}</div><div class="rune-row">${sl.runes.map((r) => `<button class="rune ${i === 0 ? 'key' : ''} ${S.rune.sel === r.id ? 'sel' : ''}" data-act="rune" data-val="${r.id}"><img alt="" src="${Dd.img.rune(r)}"><span>${esc(r.name)}</span></button>`).join('')}</div>`).join('')}
      ${sel ? `<div class="tip" style="margin-top:10px"><b>${esc(sel.name)}</b><div class="desc">${Dd.rich(sel.longDesc || sel.shortDesc)}</div></div>` : '<p class="muted small" style="margin-top:8px">Touche une rune pour lire sa description.</p>'}</div>`;
    h += `<h1 style="margin-top:18px">Sorts d'invocateur</h1><p class="muted">Deux sorts au choix (touches <kbd>D</kbd> et <kbd>F</kbd>), en plus de ceux de ton champion. Presque tout le monde prend <b>Saut éclair</b>.</p>`;
    h += D.summList.map((s) => `<div class="list-item" style="cursor:default"><img class="ico lg" alt="" src="${Dd.img.spell(s)}"><div class="grow"><b>${esc(s.name)} <span class="muted small">· ${esc(s.cooldownBurn)} s</span></b><div class="desc small">${Dd.rich(s.description)}</div></div></div>`).join('');
    return h;
  }

  /* ---------- En partie : horloge, timers, sorts adverses ---------- */
  const now = () => Date.now();
  const gameSec = (ts = now()) => (S.game.start ? (ts - S.game.start) / 1000 : null);
  const summ = (id) => (D.summs && D.summs[id]) || null;
  const summCd = (id, haste) => { const s = summ(id); const base = s ? s.cooldown[0] : 300; return base * 100 / (100 + (haste || 0)); };
  const atGame = (until) => (S.game.start ? fmt(gameSec(until)) : null);
  const champName = (id) => (D.champs && D.champs[id] ? D.champs[id].name : '');
  function viewGame() {
    const nd = needData();
    const g = S.game;
    let h = `<h1>En partie</h1>`;
    h += `<div class="card gold"><h2>🕒 Horloge de jeu</h2>`;
    if (g.start) {
      h += `<div class="clock" data-clock>${fmt(gameSec())}</div>
        <div class="row"><input type="text" inputmode="numeric" placeholder="Corriger (ex. 12:30)" id="clockFix" class="grow" style="min-height:40px"><button class="btn ghost small" data-act="clockFix">Caler</button><button class="btn danger small" data-act="newGame">Nouvelle partie</button></div>
        <p class="muted small">Recopie l'heure affichée en haut à droite du jeu si l'horloge dérive.</p>`;
    } else {
      h += `<p class="muted">Lance l'horloge au début de la partie (quand le chrono du jeu affiche 0:00), ou entre l'heure du jeu si elle a déjà démarré. Elle sert à annoncer « Flash à 12:34 » à ton équipe.</p>
        <div class="row"><button class="btn" data-act="clockStart">▶ Lancer à 0:00</button><input type="text" inputmode="numeric" placeholder="ou heure actuelle, ex. 3:45" id="clockFix" class="grow" style="min-height:44px"><button class="btn ghost" data-act="clockFix">OK</button></div>`;
    }
    h += `</div>`;
    h += `<div class="card"><div class="row sp"><h2 style="margin:0">⚔️ Sorts d'invocateur adverses</h2><button class="chip ${S.opt.editEnemies ? 'on' : ''}" data-act="toggleEdit">${S.opt.editEnemies ? '✔ Terminé' : '✏️ Modifier'}</button></div>
      <p class="muted small">Un ennemi utilise son Saut éclair ? Touche l'icône : le compte à rebours démarre. Touche à nouveau pour annuler.</p>`;
    if (nd) h += nd;
    else {
      h += g.enemies.map((e, i) => {
        const c = D.champs[e.champ];
        const head = S.opt.editEnemies || !c
          ? `<select data-enemy="${i}" data-field="champ"><option value="">— Ennemi ${i + 1} —</option>${D.champList.map((x) => `<option value="${esc(x.id)}" ${x.id === e.champ ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>`
          : `<div class="row nw"><img class="ico" alt="" src="${Dd.img.champ(c)}"><b>${esc(c.name)}</b></div>`;
        const btns = [0, 1].map((k) => {
          const sid = e.s[k], s = summ(sid), run = e.until[k] > now();
          return `<button class="sspell ${run ? 'run' : ''}" data-act="sspell" data-i="${i}" data-k="${k}" aria-label="${esc(s ? s.name : 'Choisir un sort')}">${s ? `<img alt="" src="${Dd.img.spell(s)}">` : '<span class="none">choisir</span>'}${run ? `<span class="cdv" data-until="${e.until[k]}">${fmt((e.until[k] - now()) / 1000)}</span>` : ''}</button>`;
        }).join('');
        let edit = '';
        if (S.opt.editEnemies) {
          edit = `<div class="row" style="margin-top:6px">${[0, 1].map((k) => `<select class="grow" data-enemy="${i}" data-field="s${k}"><option value="">— Sort ${k ? 'F' : 'D'} —</option>${D.summList.map((s) => `<option value="${esc(s.id)}" ${s.id === e.s[k] ? 'selected' : ''}>${esc(s.name)} (${s.cooldownBurn} s)</option>`).join('')}</select>`).join('')}</div>
            <div class="row" style="margin-top:6px"><span class="muted small">Accélération des sorts d'invocateur :</span>${[0, 10, 18, 28].map((v) => `<button class="chip ${e.haste === v ? 'on' : ''}" data-act="haste" data-i="${i}" data-val="${v}">${v ? '+' + v : 'Aucune'}</button>`).join('')}</div>`;
        }
        const info = [0, 1].filter((k) => e.until[k] > now()).map((k) => { const s = summ(e.s[k]); const at = atGame(e.until[k]); return `${esc(s ? s.name : '?')} ${at ? 'à ' + at : ''}`; }).join(' · ');
        return `<div class="enemy"><div class="row nw"><div class="grow">${head}${info ? `<div class="muted small" style="margin-top:4px">⏳ ${info}</div>` : ''}</div>${btns}</div>${edit}</div>`;
      }).join('');
      h += `<div class="row" style="margin-top:6px"><button class="btn hex small" data-act="copyChat">📋 Copier pour le chat</button><button class="btn ghost small" data-act="resetEnemies">Vider les ennemis</button></div>
        ${S.opt.editEnemies ? '<p class="muted small">Exemple : la rune « Perspicacité cosmique » donne +18 d\'accélération des sorts d\'invocateur.</p>' : ''}`;
    }
    h += `</div>`;
    h += `<div class="card"><h2>🐉 Objectifs et buffs</h2><p class="muted small">Touche « Tué » quand le monstre meurt : le temps de réapparition s'affiche.</p>
      ${GUIDE.timers.map((t) => {
        const u = g.timers[t.id] || 0, run = u > now();
        return `<div class="timer ${run ? 'run' : ''}" data-tid="${t.id}"><span style="font-size:1.3rem">${t.icon}</span><div class="nm"><b>${esc(t.name)}</b><div class="muted small">${run && g.start ? 'revient à ' + atGame(u) : 'réapparition ' + fmt(t.respawn)}</div></div>
          <span class="cd" ${run ? `data-until="${u}"` : ''}>${run ? fmt((u - now()) / 1000) : '—'}</span>
          ${run ? `<button class="chip" data-act="timerStop" data-val="${t.id}">✕</button>` : `<button class="btn small" data-act="timerGo" data-val="${t.id}">Tué</button>`}</div>`;
      }).join('')}
      <p class="muted small">Le Baron Nashor apparaît la première fois à 20:00. Repères indicatifs : Riot peut les ajuster selon les patchs.</p></div>`;
    h += `<div class="card"><h2>⚙️ Options</h2><div class="chips">
      <button class="chip ${S.opt.sound ? 'on' : ''}" data-act="opt" data-val="sound">🔔 Son</button>
      <button class="chip ${S.opt.vibrate ? 'on' : ''}" data-act="opt" data-val="vibrate">📳 Vibration</button>
      <button class="chip ${S.opt.wake ? 'on' : ''}" data-act="opt" data-val="wake">💡 Écran toujours allumé</button></div>
      <p class="muted small" style="margin-top:6px">Une alarme sonne quand un sort ou un objectif revient.</p></div>`;
    h += `<details><summary>✅ Check-list avant de lancer</summary><div class="in"><ul>
      <li>Mon rôle et mon champion sont choisis, je connais ses 4 sorts.</li>
      <li>Ma page de runes est prête (les runes recommandées vont très bien).</li>
      <li>Saut éclair + le bon 2ᵉ sort (Châtiment si je suis jungler).</li>
      <li>Je regarde les champions adverses dans l'onglet Champions → « Comment le contrer ».</li>
      <li>Je coupe le chat si besoin : <code>/mute all</code>.</li></ul></div></details>`;
    return h;
  }
  function chatLine() {
    const parts = [];
    S.game.enemies.forEach((e) => [0, 1].forEach((k) => {
      if (e.until[k] > now()) {
        const s = summ(e.s[k]); const nm = champName(e.champ) || 'Ennemi';
        parts.push(`${nm} ${s ? s.name : 'sort'} ${S.game.start ? atGame(e.until[k]) : 'dans ' + fmt((e.until[k] - now()) / 1000)}`);
      }
    }));
    return parts.join(' | ');
  }

  /* Rafraîchissement des chronos sans tout redessiner */
  function tick() {
    const t = now();
    document.querySelectorAll('[data-until]').forEach((el) => { el.textContent = fmt((+el.dataset.until - t) / 1000); });
    const ck = document.querySelector('[data-clock]'); if (ck) ck.textContent = fmt(gameSec(t));
    let ended = false;
    const fire = (key) => { if (!S.game.fired[key]) { S.game.fired[key] = 1; ended = key; } };
    Object.keys(S.game.timers).forEach((id) => { const u = S.game.timers[id]; if (u && u <= t) { fire('t:' + id + ':' + u); } });
    S.game.enemies.forEach((e, i) => [0, 1].forEach((k) => { if (e.until[k] && e.until[k] <= t) fire('e:' + i + ':' + k + ':' + e.until[k]); }));
    if (ended) {
      alarm();
      const label = ended.startsWith('t:') ? (GUIDE.timers.find((x) => x.id === ended.split(':')[1]) || {}).name + ' est de retour !' : (() => { const [, i, k] = ended.split(':'); const e = S.game.enemies[+i]; const s = summ(e.s[+k]); return `${champName(e.champ) || 'Ennemi ' + (+i + 1)} : ${s ? s.name : 'sort'} de nouveau disponible`; })();
      toast('🔔 ' + label);
      if (S.tab === 'game' && !document.activeElement.matches('input,select,textarea')) render(true);
      else save();
    }
  }
  setInterval(tick, 500);
  let actx = null;
  function alarm() {
    if (S.opt.vibrate && navigator.vibrate) { try { navigator.vibrate([200, 100, 200]); } catch (e) { /* ignoré */ } }
    if (!S.opt.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.22].forEach((d) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.value = 880; g.gain.setValueAtTime(0.0001, actx.currentTime + d); g.gain.exponentialRampToValueAtTime(0.3, actx.currentTime + d + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + d + 0.18); o.connect(g).connect(actx.destination); o.start(actx.currentTime + d); o.stop(actx.currentTime + d + 0.2); });
    } catch (e) { /* audio indisponible */ }
  }
  let wakeLock = null;
  async function applyWake() {
    try {
      if (S.opt.wake && S.tab === 'game' && 'wakeLock' in navigator && document.visibilityState === 'visible') { if (!wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } }
      else if (wakeLock) { await wakeLock.release(); wakeLock = null; }
    } catch (e) { wakeLock = null; }
  }

  /* ---------- Guide ---------- */
  function viewGuide() {
    let h = `<h1>Guide du débutant</h1><p class="muted">L'essentiel pour bien démarrer sur la Faille de l'invocateur.</p>`;
    h += GUIDE.sections.slice(0, 1).map(sec).join('');
    h += `<details><summary>🧭 Les 5 rôles</summary><div class="in">${GUIDE.roles.map((r) => `<h3>${r.icon} ${esc(r.name)}</h3><p class="muted">${esc(r.who)}</p><ul>${r.todo.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      ${D.champs ? `<div class="chips">${GUIDE.beginners[r.id].map((id) => D.champs[id]).filter(Boolean).map((c) => `<button class="chip" data-act="champ" data-val="${esc(c.id)}"><img alt="" src="${Dd.img.champ(c)}" style="width:20px;height:20px;border-radius:4px;vertical-align:-5px"> ${esc(c.name)}</button>`).join('')}</div>` : ''}`).join('')}</div></details>`;
    h += GUIDE.sections.slice(1).map(sec).join('');
    if (!D.champs) needData();
    return h;
  }
  const sec = (s) => `<details><summary>${s.icon} ${esc(s.title)}</summary><div class="in">${s.html}</div></details>`;

  /* ---------- Lexique ---------- */
  function lexList() {
    const q = norm(S.lexQ);
    const l = GUIDE.lexicon.filter(([t, d]) => !q || norm(t).includes(q) || norm(d).includes(q));
    return l.length ? `<dl class="lex">${l.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join('')}</dl>` : '<div class="empty">Aucun mot trouvé.</div>';
  }
  function viewLex() {
    return `<h1>Lexique</h1><p class="muted">Le jargon que tu verras dans le chat et les vidéos.</p>
      <div class="search"><input type="search" placeholder="🔎 Chercher un mot (gank, CS, peel…)" value="${esc(S.lexQ)}" data-in="lexQ" autocomplete="off"></div>
      <div class="card" id="llist">${lexList()}</div>`;
  }

  /* ---------- Infos ---------- */
  function viewInfo() {
    return `<h1>Infos</h1>
      <div class="card"><h2>Noob LOL</h2><p>Version <b>${esc(APP_VERSION)}</b>${D.version ? ` · données du patch <b>${esc(D.version)}</b>` : ''}</p>
        <p class="muted">Les champions, objets, runes et sorts viennent des données officielles de Riot Games (Data Dragon), en français. Ils se mettent à jour tout seuls à chaque nouveau patch et restent disponibles hors connexion.</p>
        <div class="row"><button class="btn ghost small" data-act="reloadData">🔄 Recharger les données</button><button class="btn danger small" data-act="wipe">Effacer mes données</button></div></div>
      <div class="card"><h2>📲 Installer l'appli</h2><ul><li><b>Android (Chrome)</b> : menu ⋮ → « Installer l'application ».</li><li><b>iPhone (Safari)</b> : bouton Partager → « Sur l'écran d'accueil ».</li></ul></div>
      <details><summary>📝 Notes de version</summary><div class="in">${APP_RELEASES.map((r) => `<h3>${esc(r.v)} <span class="muted small">${esc(r.date)}</span></h3><ul>${r.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`).join('')}</div></details>
      <div class="card"><p class="muted small">Noob LOL n'est pas approuvé par Riot Games et ne reflète pas les opinions de Riot Games ou de quiconque officiellement impliqué dans la production ou la gestion des propriétés de Riot Games. Riot Games et toutes les propriétés associées sont des marques commerciales ou des marques déposées de Riot Games, Inc.</p></div>`;
  }

  /* ---------- Navigation (bouton retour du téléphone compris) ---------- */
  function openView(kind, id) {
    const wasOpen = S.view.champ || S.view.item;
    S.view = { champ: null, item: null }; S.view[kind] = id;
    if (kind === 'champ' && S.tab !== 'champs') S.tab = 'champs';
    if (kind === 'item' && S.tab !== 'items') S.tab = 'items';
    try { if (wasOpen) history.replaceState({ v: 1 }, ''); else history.pushState({ v: 1 }, ''); } catch (e) { /* ignoré */ }
    render();
  }
  function closeView() { S.view = { champ: null, item: null }; render(); }
  window.addEventListener('popstate', () => { if (S.view.champ || S.view.item) closeView(); });

  let toastT = null;
  function toast(msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.style.display = 'block';
    clearTimeout(toastT); toastT = setTimeout(() => { t.style.display = 'none'; }, 3200);
  }

  /* ---------- Actions ---------- */
  document.addEventListener('click', (ev) => {
    const el = ev.target.closest('[data-act]');
    if (!el) return;
    const a = el.dataset.act, v = el.dataset.val;
    if (el.tagName === 'A') ev.preventDefault();
    const g = S.game;
    switch (a) {
      case 'tab': if (S.view.champ || S.view.item) { S.view = { champ: null, item: null }; } S.tab = v; render(); applyWake(); break;
      case 'retry': D.error = null; render(); break;
      case 'champ': openView('champ', v); break;
      case 'item': openView('item', v); break;
      case 'back': if (history.state && history.state.v) history.back(); else closeView(); break;
      case 'fav': S.favs = S.favs.includes(v) ? S.favs.filter((x) => x !== v) : S.favs.concat(v); render(true); break;
      case 'skin': S.skin[el.dataset.id] = +v; render(true); break;
      case 'role': S.role = v; render(true); break;
      case 'tipNext': S.tipN = (S.tipN + 1 + Math.floor(Math.random() * (GUIDE.tips.length - 1))) % GUIDE.tips.length; render(true); break;
      case 'cf': { const p = el.dataset.path; const val = p === 'fav' ? true : v; S.cf[p] = S.cf[p] === val ? (p === 'fav' ? false : '') : val; render(true); break; }
      case 'itag': S.itf.tag = v; render(true); break;
      case 'tree': S.rune.tree = +v; S.rune.sel = null; render(true); break;
      case 'rune': S.rune.sel = S.rune.sel === +v ? null : +v; render(true); break;
      case 'clockStart': g.start = now(); render(true); break;
      case 'clockFix': { const s = parseMS((document.getElementById('clockFix') || {}).value); if (s == null) { toast('Format attendu : minutes:secondes, ex. 12:30'); break; } g.start = now() - s * 1000; render(true); break; }
      case 'newGame': if (confirmTap(el, 'Sûr ? Touche encore')) { S.game = newGame(); render(true); } break;
      case 'timerGo': { const t = GUIDE.timers.find((x) => x.id === v); g.timers[v] = now() + t.respawn * 1000; unlockAudio(); render(true); break; }
      case 'timerStop': delete g.timers[v]; render(true); break;
      case 'sspell': {
        const e = g.enemies[+el.dataset.i], k = +el.dataset.k;
        if (!e.s[k]) { S.opt.editEnemies = true; render(true); break; }
        if (e.until[k] > now()) e.until[k] = 0; else e.until[k] = now() + summCd(e.s[k], e.haste) * 1000;
        unlockAudio(); render(true); break;
      }
      case 'haste': g.enemies[+el.dataset.i].haste = +v; render(true); break;
      case 'toggleEdit': S.opt.editEnemies = !S.opt.editEnemies; render(true); break;
      case 'resetEnemies': if (confirmTap(el, 'Sûr ? Touche encore')) { g.enemies = newGame().enemies; render(true); } break;
      case 'copyChat': {
        const line = chatLine();
        if (!line) { toast('Aucun sort adverse en recharge pour l\'instant.'); break; }
        (navigator.clipboard ? navigator.clipboard.writeText(line) : Promise.reject()).then(() => toast('Copié : ' + line)).catch(() => toast(line));
        break;
      }
      case 'opt': S.opt[v] = !S.opt[v]; if (v === 'sound' && S.opt.sound) { unlockAudio(); alarm(); } render(true); applyWake(); break;
      case 'install': if (installEvt) { installEvt.prompt(); installEvt.userChoice.finally(() => { installEvt = null; render(true); }); } break;
      case 'hideInstall': S.opt.hideInstall = true; render(true); break;
      case 'reloadData':
        if ('caches' in window) caches.delete('nooblol-ddragon').finally(() => location.reload()); else location.reload();
        break;
      case 'wipe': if (confirmTap(el, 'Tout effacer ? Touche encore')) { localStorage.removeItem(KEY); location.reload(); } break;
      default: break;
    }
  });
  /* Confirmation en deux appuis (pas de fenêtre bloquante). */
  function confirmTap(el, msg) {
    if (el.dataset.armed) return true;
    el.dataset.armed = '1'; const old = el.textContent; el.textContent = msg;
    setTimeout(() => { if (el.isConnected) { delete el.dataset.armed; el.textContent = old; } }, 3000);
    return false;
  }
  function unlockAudio() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { /* ignoré */ } }

  document.addEventListener('input', (ev) => {
    const el = ev.target;
    if (el.dataset.in) {
      const [o, k] = el.dataset.in.split('.');
      if (k) S[o][k] = el.value; else S[o] = el.value;
      const box = { 'cf.q': ['clist', champGrid], 'itf.q': ['ilist', itemGrid], lexQ: ['llist', lexList] }[el.dataset.in];
      if (box) { const b = document.getElementById(box[0]); if (b) b.innerHTML = box[1](); }
      save();
    } else if (el.dataset.note) {
      const id = el.dataset.note;
      if (el.value.trim()) S.notes[id] = el.value; else delete S.notes[id];
      save();
    }
  });
  document.addEventListener('change', (ev) => {
    const el = ev.target;
    if (el.dataset.enemy == null) return;
    const e = S.game.enemies[+el.dataset.enemy], f = el.dataset.field;
    if (f === 'champ') e.champ = el.value;
    else { const k = +f.slice(1); e.s[k] = el.value; e.until[k] = 0; }
    render(true);
  });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && ev.target.id === 'clockFix') document.querySelector('[data-act="clockFix"]').click(); });
  document.addEventListener('visibilitychange', applyWake);

  /* ---------- Mise à jour automatique ---------- */
  function updateBanner(reg) {
    if (document.getElementById('updBar')) return;
    const d = document.createElement('div'); d.id = 'updBar'; d.className = 'updbar';
    d.innerHTML = '<span>🔄 Nouvelle version disponible</span><button id="updGo">Mettre à jour</button><button id="updLater" class="ghost" aria-label="Plus tard">✕</button>';
    document.body.appendChild(d);
    document.getElementById('updLater').onclick = () => d.remove();
    document.getElementById('updGo').onclick = () => { d.querySelector('span').textContent = 'Mise à jour…'; if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING'); else location.reload(); };
  }
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      const watch = (w) => w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) updateBanner(reg); });
      if (reg.waiting && navigator.serviceWorker.controller) updateBanner(reg);
      reg.addEventListener('updatefound', () => watch(reg.installing));
      const check = () => reg.update().catch(() => {});
      setInterval(check, 30 * 60 * 1000);
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
      let reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloading) return; reloading = true; location.reload(); });
    }).catch(() => {});
  }

  /* Au démarrage : on ne rouvre pas une fiche laissée ouverte (le bouton retour n'aurait plus d'historique). */
  S.view = { champ: null, item: null };
  Dd.load().then(() => render(true)).catch(() => render(true));
  render();
  applyWake();
})();
