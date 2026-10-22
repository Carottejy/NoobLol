/* Noob LOL — compagnon de jeu League of Legends pour débutants (application PC)
   Trois parties : Préparation, Sélection des champions, En jeu (+ Réglages). */
(() => {
  'use strict';
  const KEY = 'nooblol.state.v2';
  const $app = document.getElementById('app');
  const $top = document.getElementById('top');
  const NB = window.noob || null; /* pont vers le PC (absent si ouvert dans un simple navigateur) */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’.\s-]/g, '');
  const pct = (w, g) => (g ? (100 * w / g).toFixed(1).replace('.', ',') + ' %' : '—');
  const nf = (n) => Number(n || 0).toLocaleString('fr-FR');
  const D = Dd.st;

  /* ---------- État enregistré ---------- */
  const newEnemy = () => ({ champ: '', s: ['SummonerFlash', ''], until: [0, 0], haste: 0 });
  const newGame = () => ({ start: null, timers: {}, enemies: [0, 1, 2, 3, 4].map(newEnemy), fired: {}, seenEv: [], log: [], sig: '' });
  const defaults = () => ({
    mode: 'prep', tab: 'home', view: { champ: null, item: null }, favs: [], notes: {}, skin: {}, champRole: {},
    cf: { q: '', tag: '', range: '', diff: '', fav: false }, itf: { q: '', tag: '' }, rune: { tree: 0, sel: null }, lexQ: '', role: 'top', metaRole: 'mid',
    select: { role: '', opp: '', manualEnemies: ['', '', '', '', ''], manualMe: '' },
    game: newGame(), opt: { sound: true, vibrate: true, editEnemies: false }, tipN: 0,
  });
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!raw) return defaults();
      const d = defaults();
      Object.assign(d, raw);
      ['cf', 'itf', 'rune', 'opt', 'view', 'select'].forEach((k) => { d[k] = Object.assign(defaults()[k], raw[k] || {}); });
      d.game = Object.assign(newGame(), raw.game || {});
      if (!Array.isArray(d.game.enemies) || d.game.enemies.length !== 5) d.game.enemies = newGame().enemies;
      return d;
    } catch (e) { return defaults(); }
  }
  let S = load();
  S.tipN = Math.floor(Math.random() * GUIDE.tips.length);
  S.view = { champ: null, item: null };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* stockage plein */ } };

  /* ---------- État en direct (non enregistré) ---------- */
  const R = { lcu: { connected: false, phase: 'None', summoner: null, champSelect: null }, live: null, cfg: null, info: null, col: null, profile: null, profileErr: '', profileLoading: false, update: null, miniOpen: false, displays: null, shot: null, keyMsg: '' };
  const cache = new Map(); /* résultats de statistiques (requêtes vers la base locale) */
  function cached(key, fn) {
    if (cache.has(key)) { const v = cache.get(key); return v === PENDING ? undefined : v; }
    cache.set(key, PENDING);
    Promise.resolve().then(fn).then((v) => { cache.set(key, v); soon(); }).catch(() => { cache.set(key, null); soon(); });
    return undefined;
  }
  const PENDING = Symbol('pending');
  let soonT = null;
  const soon = () => { clearTimeout(soonT); soonT = setTimeout(() => render(true), 60); };

  /* ---------- Libellés ---------- */
  const CTAG = { Fighter: 'Combattant', Tank: 'Tank', Mage: 'Mage', Assassin: 'Assassin', Marksman: 'Tireur', Support: 'Support' };
  const CTAG_IC = { Fighter: '⚔️', Tank: '🛡️', Mage: '🔮', Assassin: '🗡️', Marksman: '🏹', Support: '💖' };
  const ITAG = [['', 'Tous'], ['_start', 'Départ'], ['_final', 'Objets finaux'], ['Boots', 'Bottes'], ['Damage', 'Dégâts (AD)'], ['CriticalStrike', 'Critique'], ['AttackSpeed', 'Vitesse d\'attaque'],
    ['SpellDamage', 'Puissance (AP)'], ['Health', 'Vie'], ['Armor', 'Armure'], ['SpellBlock', 'Résist. magique'], ['AbilityHaste', 'Accélération'], ['LifeSteal', 'Vol de vie'], ['Mana', 'Mana'], ['NonbootsMovement', 'Vitesse'], ['Vision', 'Vision'], ['Consumable', 'Consommables']];
  const ROLES = ['top', 'jungle', 'mid', 'adc', 'support'];
  const ROLE_NAME = { top: 'Top', jungle: 'Jungle', mid: 'Mid', adc: 'ADC', support: 'Support' };
  const ROLE_IC = { top: '🛡️', jungle: '🌲', mid: '✨', adc: '🏹', support: '💖' };
  const MATCH_ROLE = { TOP: 'top', JUNGLE: 'jungle', MIDDLE: 'mid', BOTTOM: 'adc', UTILITY: 'support' };
  const QUEUE = { 420: 'Classée solo/duo', 440: 'Classée flexible', 400: 'Normale (draft)', 430: 'Normale', 490: 'Partie rapide', 480: 'Partie rapide', 450: 'ARAM', 1700: 'Arena', 1900: 'URF', 900: 'ARURF', 830: 'Coop vs IA', 840: 'Coop vs IA', 850: 'Coop vs IA', 870: 'Coop vs IA', 880: 'Coop vs IA', 890: 'Coop vs IA' };
  const TIER = { IRON: 'Fer', BRONZE: 'Bronze', SILVER: 'Argent', GOLD: 'Or', PLATINUM: 'Platine', EMERALD: 'Émeraude', DIAMOND: 'Diamant', MASTER: 'Maître', GRANDMASTER: 'Grand maître', CHALLENGER: 'Challenger' };
  const PHASE = { None: 'Dans le client', Lobby: 'Dans le salon', Matchmaking: 'En recherche de partie', ReadyCheck: 'Partie trouvée !', ChampSelect: 'Sélection des champions', GameStart: 'Lancement de la partie', InProgress: 'Partie en cours', Reconnect: 'Reconnexion', WaitingForStats: 'Fin de partie', PreEndOfGame: 'Fin de partie', EndOfGame: 'Fin de partie' };
  const SHARD = { 5008: 'Force adaptative', 5005: 'Vitesse d\'attaque', 5007: 'Accélération de compétence', 5010: 'Vitesse de déplacement', 5001: 'PV selon le niveau', 5011: 'PV', 5013: 'Ténacité', 5002: 'Armure', 5003: 'Résist. magique' };
  const diffOf = (c) => { const d = (c.info || {}).difficulty || 0; return d <= 3 ? 'easy' : d <= 6 ? 'mid' : 'hard'; };
  const DIFF = { easy: ['Facile', '🟢'], mid: ['Moyen', '🟡'], hard: ['Difficile', '🔴'] };
  const isMelee = (c) => ((c.stats || {}).attackrange || 0) <= 300;
  const beginnerRole = (id) => Object.keys(GUIDE.beginners).find((r) => GUIDE.beginners[r].includes(id));
  const fmt = (sec) => { sec = Math.max(0, Math.round(sec)); const m = Math.floor(sec / 60), s = sec % 60; return `${m}:${String(s).padStart(2, '0')}`; };
  const parseMS = (t) => { const m = String(t || '').trim().match(/^(\d{1,3})(?:[:h.,\s](\d{1,2}))?$/); if (!m) return null; return (+m[1]) * 60 + (+(m[2] || 0)); };
  const byKey = (k) => D.byKey[String(k)] || null;
  const cIcon = (c, cls = 'ico') => (c ? `<img class="${cls}" alt="" title="${esc(c.name)}" src="${Dd.img.champ(c)}">` : `<span class="${cls} ph"></span>`);
  const itIcon = (id, cls = 'ico sm') => { const it = D.items && D.items[String(id)]; return it ? `<img class="${cls}" alt="" title="${esc(it.name)} (${it.gold.total} po)" src="${Dd.img.item(it)}">` : `<span class="${cls} ph"></span>`; };
  const isLegendary = (it) => it && !(it.into && it.into.length) && it.gold.total >= 2000 && !(it.tags || []).includes('Consumable');
  const isBoots = (it) => it && (it.tags || []).includes('Boots') && it.gold.total > 300;

  /* ---------- Rendu principal ---------- */
  const MODES = [['prep', '📚', 'Préparation'], ['select', '🎯', 'Sélection'], ['game', '⚔️', 'En jeu'], ['settings', '⚙️', 'Réglages']];
  const PREP_TABS = [['home', '🏠', 'Accueil'], ['account', '👤', 'Mon compte'], ['champs', '🦸', 'Champions'], ['meta', '📈', 'Méta'], ['items', '🛒', 'Objets'], ['runes', '✨', 'Runes'], ['guide', '📖', 'Guide'], ['lex', '💬', 'Lexique']];
  function statusPill() {
    if (!NB) return '<span class="pill off">Version navigateur : connexion au jeu indisponible</span>';
    const L = R.lcu;
    if (R.live) return `<span class="pill live">● Partie en cours ${fmt(R.live.time)}</span>`;
    if (!L.connected) return '<span class="pill off">○ Client LoL non détecté</span>';
    const who = L.summoner ? `${esc(L.summoner.gameName)}${L.summoner.tagLine ? '#' + esc(L.summoner.tagLine) : ''}` : '';
    return `<span class="pill on">● ${who ? who + ' · ' : ''}${esc(PHASE[L.phase] || L.phase)}</span>`;
  }
  function renderTop() {
    const badge = (m) => (m === 'select' && R.lcu.phase === 'ChampSelect') || (m === 'game' && R.live) ? '<i class="dot"></i>' : '';
    $top.innerHTML = `<div class="topbar"><div class="brand"><img src="icons/icon-192.png" alt=""><b>Noob LOL</b></div>
      <div class="modes">${MODES.map(([id, ic, lb]) => `<button class="mode ${S.mode === id ? 'on' : ''}" data-act="mode" data-val="${id}">${ic} <span>${lb}</span>${badge(id)}</button>`).join('')}</div>
      <div class="status">${statusPill()}</div></div>
      ${S.mode === 'prep' ? `<nav class="subtabs">${PREP_TABS.map(([id, ic, lb]) => `<button class="${S.tab === id ? 'on' : ''}" data-act="tab" data-val="${id}">${ic} ${lb}</button>`).join('')}</nav>` : ''}
      ${R.update ? `<div class="updbar"><span>🔄 La version ${esc(R.update.version)} est prête.</span><button data-act="installUpdate">Redémarrer et mettre à jour</button></div>` : ''}`;
  }
  function render(keepScroll) {
    const y = window.scrollY;
    renderTop();
    let v;
    if (S.mode === 'select') v = viewSelect;
    else if (S.mode === 'game') v = viewGame;
    else if (S.mode === 'settings') v = viewSettings;
    else v = { home: viewHome, account: viewAccount, champs: viewChamps, meta: viewMeta, items: viewItems, runes: viewRunes, guide: viewGuide, lex: viewLex }[S.tab] || viewHome;
    $app.innerHTML = v();
    window.scrollTo(0, keepScroll ? y : 0);
    tick();
    save();
  }
  const busy = () => { const a = document.activeElement; return a && /INPUT|SELECT|TEXTAREA/.test(a.tagName); };
  function needData() {
    if (D.champs) return '';
    if (D.error) return `<div class="card"><h2>Données indisponibles</h2><p class="muted">${esc(D.error)}</p><button class="btn" data-act="retry">Réessayer</button></div>`;
    Dd.load().then(() => render(true)).catch(() => render(true));
    return '<div class="loader">Chargement des données de Riot…</div>';
  }
  const tile = (c, extra = '') => `<button class="tile" data-act="champ" data-val="${esc(c.id)}">${S.favs.includes(c.id) ? '<span class="fav">⭐</span>' : ''}<img loading="lazy" alt="" src="${Dd.img.champ(c)}">${esc(c.name)}${extra}</button>`;
  const desktopOnly = (what) => `<div class="card"><h2>Fonction de l'application PC</h2><p class="muted">${what} nécessite l'application Noob LOL installée sur le PC où tourne League of Legends.</p></div>`;

  /* =====================================================================
     PRÉPARATION
     ===================================================================== */
  function viewHome() {
    const nd = needData();
    const favs = D.champs ? S.favs.map((id) => D.champs[id]).filter(Boolean) : [];
    const heroId = favs.length ? favs[Math.floor(Date.now() / 86400000) % favs.length].id : 'Ahri';
    let h = `<div class="hero" style="background-image:url('${Dd.img.splash(heroId)}')"><div>
      <h1>Noob LOL</h1><p>Prépare tes parties, choisis le bon champion pendant la sélection, et garde un œil sur tout en jeu.</p>
      ${D.version ? `<span class="tag gold">Patch ${esc(D.version.split('.').slice(0, 2).join('.'))}</span>` : ''}</div></div>`;
    h += '<div class="cols">';
    h += `<div><div class="card"><div class="row sp"><h2 style="margin:0">💡 Conseil</h2><button class="chip" data-act="tipNext">Un autre</button></div>
      <p class="tip" style="margin-top:8px">${esc(GUIDE.tips[S.tipN % GUIDE.tips.length])}</p></div>`;
    h += setupCard();
    h += `</div><div>`;
    if (nd) h += nd;
    else {
      h += `<div class="card"><h2>⭐ Mes champions</h2>${favs.length ? `<div class="grid-ic">${favs.map((c) => tile(c)).join('')}</div>` : '<p class="muted">Ajoute tes champions préférés avec l\'étoile sur leur fiche : ils apparaîtront ici.</p>'}</div>`;
      const ids = GUIDE.beginners[S.role] || [];
      h += `<div class="card"><h2>🎓 Par qui commencer ?</h2><p class="muted">Des champions simples et efficaces, conseillés pour débuter dans chaque rôle.</p>
        <div class="chips" style="margin:8px 0">${ROLES.map((r) => `<button class="chip ${S.role === r ? 'on' : ''}" data-act="role" data-val="${r}">${ROLE_IC[r]} ${ROLE_NAME[r]}</button>`).join('')}</div>
        <div class="grid-ic">${ids.map((id) => D.champs[id]).filter(Boolean).map((c) => tile(c)).join('')}</div>
        <p class="small muted" style="margin-top:8px">${esc((GUIDE.roles.find((r) => r.id === S.role) || {}).who || '')}</p></div>`;
    }
    h += '</div></div>';
    return h;
  }
  /* Ce qu'il reste à configurer pour profiter de tout */
  function setupCard() {
    if (!NB) return '';
    const c = R.cfg || {};
    const steps = [
      [R.lcu.connected, 'Lance le client League of Legends : Noob LOL le détecte tout seul.'],
      [c.hasApiKey, 'Ajoute ta clé Riot (gratuite) dans Réglages pour voir ton compte et les statistiques.'],
      [R.col && R.col.picks > 0, 'Démarre le collecteur de statistiques dans Réglages (runes, objets, match-ups).'],
    ];
    if (steps.every((s) => s[0])) return '';
    return `<div class="card gold"><h2>🚀 Pour bien démarrer</h2><ul class="checks">${steps.map(([ok, t]) => `<li class="${ok ? 'ok' : ''}">${ok ? '✅' : '⬜'} ${esc(t)}</li>`).join('')}</ul>
      <button class="btn small" data-act="mode" data-val="settings">Ouvrir les Réglages</button></div>`;
  }

  /* ---------- Mon compte ---------- */
  function loadProfile(force) {
    if (!NB || R.profileLoading) return;
    if (R.profile && !force) return;
    R.profileLoading = true; R.profileErr = '';
    const riotId = R.lcu.summoner && R.lcu.summoner.tagLine ? { gameName: R.lcu.summoner.gameName, tagLine: R.lcu.summoner.tagLine } : null;
    NB.riot.profile(riotId).then((p) => { R.profile = p; }).catch((e) => { R.profileErr = e.message; }).finally(() => { R.profileLoading = false; render(true); });
  }
  function viewAccount() {
    if (!NB) return '<h1>Mon compte</h1>' + desktopOnly('Ton profil');
    const nd = needData(); if (nd) return '<h1>Mon compte</h1>' + nd;
    if (!R.profile && !R.profileLoading && !R.profileErr) loadProfile();
    let h = `<div class="row sp"><h1>Mon compte</h1><button class="btn ghost small" data-act="profileReload">🔄 Actualiser</button></div>`;
    if (R.profileLoading && !R.profile) return h + '<div class="loader">Récupération de ton profil chez Riot…</div>';
    if (R.profileErr) return h + `<div class="card"><h2>Impossible de charger ton profil</h2><p class="muted">${esc(R.profileErr)}</p><button class="btn small" data-act="mode" data-val="settings">Ouvrir les Réglages</button></div>`;
    const P = R.profile; if (!P) return h;
    const solo = (P.leagues || []).find((l) => l.queueType === 'RANKED_SOLO_5x5'), flex = (P.leagues || []).find((l) => l.queueType === 'RANKED_FLEX_SR');
    const rank = (l, name) => `<div class="stat"><span class="muted small">${name}</span><b>${l ? `${TIER[l.tier] || l.tier} ${['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(l.tier) ? '' : l.rank}` : 'Non classé'}</b>${l ? `<span class="small">${l.leaguePoints} LP · ${l.wins} V / ${l.losses} D (${pct(l.wins, l.wins + l.losses)})</span>` : '<span class="small muted">10 parties de placement</span>'}</div>`;
    h += `<div class="card gold"><div class="row nw"><img class="ico lg round" alt="" src="${D.version ? `https://ddragon.leagueoflegends.com/cdn/${D.version}/img/profileicon/${P.summoner.profileIconId}.png` : ''}"><div class="grow"><h2 style="margin:0">${esc(P.account.gameName)}<span class="muted">#${esc(P.account.tagLine)}</span></h2><span class="muted">Niveau ${P.summoner.summonerLevel}</span></div></div>
      <div class="stat-row" style="margin-top:10px">${rank(solo, 'Classée solo/duo')}${rank(flex, 'Classée flexible')}</div></div>`;
    h += `<div class="cols"><div class="card"><h2>🏅 Mes meilleures maîtrises</h2><div class="grid-ic">${(P.mastery || []).map((m) => { const c = byKey(m.championId); return c ? tile(c, `<div class="price">Niv. ${m.championLevel} · ${nf(Math.round(m.championPoints / 1000))}k</div>`) : ''; }).join('')}</div></div>`;
    h += `<div class="card"><h2>🕹️ Mes dernières parties</h2>${(P.matches || []).length ? P.matches.map((m) => { const c = byKey(m.champ);
      return `<div class="match ${m.remake ? '' : m.win ? 'win' : 'loss'}">${cIcon(c)}<div class="grow"><b>${m.remake ? 'Annulée' : m.win ? 'Victoire' : 'Défaite'}</b> <span class="muted small">${esc(QUEUE[m.queue] || 'Mode ' + m.queue)} · ${fmt(m.duration)}${MATCH_ROLE[m.role] ? ' · ' + ROLE_NAME[MATCH_ROLE[m.role]] : ''}</span>
        <div class="small">${m.k} / ${m.d} / ${m.a} · ${m.cs} CS (${(m.cs / Math.max(1, m.duration / 60)).toFixed(1).replace('.', ',')}/min) · vision ${m.vision}</div></div><div class="items">${m.items.map((i) => (i ? itIcon(i) : '<span class="ico sm ph"></span>')).join('')}</div></div>`; }).join('') : '<p class="muted">Aucune partie récente.</p>'}</div></div>`;
    return h;
  }

  /* ---------- Champions ---------- */
  function champMatches() {
    const f = S.cf, q = norm(f.q);
    return D.champList.filter((c) => (!q || norm(c.name).includes(q) || norm(c.id).includes(q) || norm(c.title).includes(q))
      && (!f.tag || c.tags.includes(f.tag)) && (!f.range || (f.range === 'melee') === isMelee(c)) && (!f.diff || diffOf(c) === f.diff) && (!f.fav || S.favs.includes(c.id)));
  }
  function champGrid() { const l = champMatches(); return l.length ? `<p class="muted small">${l.length} champion${l.length > 1 ? 's' : ''}</p><div class="grid-ic">${l.map((c) => tile(c)).join('')}</div>` : '<div class="empty">Aucun champion ne correspond.</div>'; }
  function viewChamps() {
    if (S.view.champ) return viewChamp(S.view.champ);
    const nd = needData(); if (nd) return '<h1>Champions</h1>' + nd;
    const f = S.cf;
    const c = (path, val, label) => `<button class="chip ${f[path] === val ? 'on' : ''}" data-act="cf" data-path="${path}" data-val="${val}">${label}</button>`;
    return `<div class="search"><input type="search" placeholder="🔎 Rechercher un champion…" value="${esc(f.q)}" data-in="cf.q" autocomplete="off"></div>
      <div class="chips">${c('tag', '', 'Toutes classes')}${Object.keys(CTAG).map((t) => c('tag', t, CTAG_IC[t] + ' ' + CTAG[t])).join('')}
      <span class="sep"></span>${c('fav', true, '⭐ Favoris')}${c('range', 'melee', 'Mêlée')}${c('range', 'ranged', 'Distance')}${Object.keys(DIFF).map((d) => c('diff', d, DIFF[d][1] + ' ' + DIFF[d][0])).join('')}</div>
      <div id="clist" style="margin-top:10px">${champGrid()}</div>`;
  }
  let fullLoading = null;
  function needFull(id) {
    if (D.full[id] || fullLoading === id) return D.full[id];
    fullLoading = id;
    Dd.champFull(id).then(() => { fullLoading = null; soon(); }).catch(() => { fullLoading = null; });
    return null;
  }
  function viewChamp(id) {
    const nd = needData(); if (nd) return nd;
    const c = D.champs[id];
    if (!c) { S.view.champ = null; return viewChamps(); }
    const full = needFull(id);
    const skin = S.skin[id] || 0;
    const fav = S.favs.includes(id);
    const br = beginnerRole(id);
    let h = `<div class="splash" style="background-image:url('${Dd.img.splash(id, skin)}')"><button class="btn ghost small back" data-act="back">← Retour</button>
      <div class="t"><div class="row sp nw"><div class="grow"><h1>${esc(c.name)}</h1><div class="sub">${esc(c.title.charAt(0).toUpperCase() + c.title.slice(1))}</div></div>
      <button class="btn ${fav ? '' : 'ghost'} small" data-act="fav" data-val="${esc(id)}">${fav ? '⭐ Favori' : '☆ Favori'}</button></div></div></div>`;
    h += '<div class="cols"><div>';
    h += `<div class="card"><div>${c.tags.map((t) => `<span class="tag">${CTAG_IC[t] || ''} ${CTAG[t] || t}</span>`).join('')}<span class="tag">${isMelee(c) ? 'Mêlée' : 'Distance'}</span><span class="tag">${esc(c.partype || 'Sans ressource')}</span>${br ? `<span class="tag gold">🎓 Conseillé pour débuter (${ROLE_NAME[br]})</span>` : ''}</div>
      <div class="meters" style="margin-top:10px">
        ${[['Attaque', c.info.attack], ['Défense', c.info.defense], ['Magie', c.info.magic], ['Difficulté', c.info.difficulty]].map(([l, v]) => `<span class="muted">${l}</span><div class="bar"><i style="width:${(v || 0) * 10}%"></i></div>`).join('')}
      </div><p class="muted small" style="margin-top:8px">${DIFF[diffOf(c)][1]} Difficulté : ${DIFF[diffOf(c)][0]} (${c.info.difficulty}/10)</p></div>`;
    h += statsBlock(c, S.champRole[id] || '');
    h += `<div class="card"><h2>📝 Mes notes</h2><textarea placeholder="Combos, objets qui marchent, erreurs à éviter…" data-note="${esc(id)}">${esc(S.notes[id] || '')}</textarea><p class="muted small">Enregistré automatiquement sur ce PC.</p></div>`;
    h += '</div><div>';
    if (!full) return h + '<div class="loader">Chargement des sorts…</div></div></div>';
    h += spellsCard(full);
    h += tipsCards(full);
    const st = full.stats;
    h += `<details><summary>📊 Statistiques de base (niveau 1)</summary><div class="in"><div class="kv">
      ${[['Vie', st.hp, st.hpperlevel], ['Mana / ressource', st.mp, st.mpperlevel], ['Armure', st.armor, st.armorperlevel], ['Résist. magique', st.spellblock, st.spellblockperlevel], ['Dégâts d\'attaque', st.attackdamage, st.attackdamageperlevel], ['Vitesse d\'attaque', st.attackspeed, null], ['Portée', st.attackrange, null], ['Vitesse de déplacement', st.movespeed, null]]
        .map(([l, v, p]) => `<div><span>${l}</span><b>${Math.round(v * 1000) / 1000}${p ? ` <span class="muted small">+${Math.round(p * 100) / 100}/niv</span>` : ''}</b></div>`).join('')}
      </div></div></details>`;
    if (full.skins && full.skins.length > 1) h += `<details><summary>🎨 Skins (${full.skins.length})</summary><div class="in"><div class="chips">${full.skins.map((s) => `<button class="chip ${skin === s.num ? 'on' : ''}" data-act="skin" data-id="${esc(id)}" data-val="${s.num}">${esc(s.name === 'default' ? 'Classique' : s.name)}</button>`).join('')}</div></div></details>`;
    h += `<details><summary>📜 Histoire</summary><div class="in desc">${esc(full.lore || c.blurb)}</div></details>`;
    return h + '</div></div>';
  }
  function spellsCard(full) {
    const keys = ['Q', 'W', 'E', 'R'];
    return `<div class="card"><h2>Compétences</h2>
      <div class="spell"><img class="ico lg" alt="" src="${Dd.img.passive(full.passive)}"><div class="grow"><b><span class="key">P</span>${esc(full.passive.name)}</b><div class="desc">${Dd.rich(full.passive.description)}</div></div></div>
      ${full.spells.map((s, i) => {
        const cost = s.costBurn && s.costBurn !== '0' ? `${esc(s.costBurn)} ${esc(full.partype || '')}` : '';
        const range = s.rangeBurn && !/self|25000/.test(s.rangeBurn) ? esc(s.rangeBurn) : '';
        return `<div class="spell"><img class="ico lg" alt="" src="${Dd.img.spell(s)}"><div class="grow"><b><span class="key">${keys[i]}</span>${esc(s.name)}</b>
        <div class="muted small">⏳ Recharge : ${esc(s.cooldownBurn)} s${cost ? ` · 💧 Coût : ${cost}` : ''}${range ? ` · 📏 Portée : ${range}` : ''}</div>
        <div class="desc">${Dd.rich(s.description)}</div></div></div>`;
      }).join('')}</div>`;
  }
  function tipsCards(full, only) {
    const ally = full.allytips || [], enemy = full.enemytips || [];
    const none = '<p class="muted">Riot n\'a pas publié de conseils pour ce champion.</p>';
    let h = '';
    if (only !== 'enemy') h += `<div class="card"><h2>🎮 Conseils pour jouer ${esc(full.name)}</h2>${ally.length ? `<ul class="tips">${ally.map((t) => `<li>${Dd.rich(t)}</li>`).join('')}</ul>` : none}</div>`;
    if (only !== 'ally') h += `<div class="card"><h2>🛡️ Comment contrer ${esc(full.name)}</h2>${enemy.length ? `<ul class="tips">${enemy.map((t) => `<li>${Dd.rich(t)}</li>`).join('')}</ul>` : none}</div>`;
    return h;
  }

  /* Statistiques calculées par le collecteur : runes, sorts, objets, match-ups */
  function champStats(key, role) { return NB ? cached(`champ:${key}:${role}`, () => NB.stats.champ(+key, role || '', 30)) : null; }
  function runePage(r) {
    const [pri, sub] = String(r.runes || '').split('|');
    if (!pri || !sub) return '';
    const [pt, pr] = pri.split(':'), [stree, sr] = sub.split(':');
    const ic = (id, big) => { const x = D.runeById[id]; return x ? `<img class="rimg ${big ? 'big' : ''}" alt="" title="${esc(x.name)}" src="${Dd.img.rune(x)}">` : ''; };
    const tr = (id) => { const t = D.treeById[id]; return t ? `<img class="rimg tree" alt="" title="${esc(t.name)}" src="${Dd.img.rune(t)}">` : ''; };
    const prs = pr.split(','), srs = sr.split(',');
    const names = [prs[0]].map((id) => (D.runeById[id] || {}).name).filter(Boolean).join('');
    return `<div class="rpage" title="${esc(names)}">${tr(pt)}${ic(prs[0], true)}${prs.slice(1).map((x) => ic(x)).join('')}<span class="rsep"></span>${tr(stree)}${srs.map((x) => ic(x)).join('')}
      <span class="shards">${String(r.shards || '').split(',').filter(Boolean).map((s) => `<span class="tag">${esc(SHARD[s] || s)}</span>`).join('')}</span></div>`;
  }
  function spellPair(str) { return String(str || '').split(',').map((k) => { const s = D.summByKey[k]; return s ? `<img class="ico sm" alt="" title="${esc(s.name)}" src="${Dd.img.spell(s)}">` : ''; }).join(''); }
  function buildBlock(st, opts = {}) {
    if (!st || !st.games) return '';
    const items = (st.items || []).map((x) => Object.assign({ it: D.items[String(x.item)] }, x)).filter((x) => x.it);
    const boots = items.filter((x) => isBoots(x.it)).slice(0, 2);
    const core = items.filter((x) => isLegendary(x.it) && !isBoots(x.it)).slice(0, opts.items || 6);
    const best = st.runes && st.runes[0];
    let h = `<div class="kpis"><div><b>${pct(st.wins, st.games)}</b><span>victoires</span></div><div><b>${nf(st.games)}</b><span>parties analysées</span></div><div><b>${(100 * (st.pickRate || 0)).toFixed(1).replace('.', ',')} %</b><span>choisi</span></div></div>`;
    if (best) h += `<h3>Runes les plus jouées <span class="muted small">${pct(best.wins, best.games)} sur ${nf(best.games)} parties</span></h3>${runePage(best)}`;
    if (st.runes && st.runes.length > 1 && !opts.compact) h += `<details class="flat"><summary class="small">Autres pages de runes</summary>${st.runes.slice(1).map((r) => `<div class="small muted">${pct(r.wins, r.games)} sur ${nf(r.games)} parties</div>${runePage(r)}`).join('')}</details>`;
    if (st.spells && st.spells.length) h += `<h3>Sorts d'invocateur</h3><div class="row">${st.spells.slice(0, 2).map((s) => `<span class="pair">${spellPair(s.spells)} <span class="small muted">${pct(s.wins, s.games)} · ${nf(s.games)}</span></span>`).join('')}</div>`;
    if (core.length) h += `<h3>Objets clés <span class="muted small">(présents en fin de partie)</span></h3><div class="row">${core.map((x) => `<span class="itm" data-act="item" data-val="${x.item}">${itIcon(x.item, 'ico')}<span class="small">${Math.round(100 * x.games / st.games)} %</span></span>`).join('')}${boots.length ? '<span class="rsep"></span>' + boots.map((x) => `<span class="itm" data-act="item" data-val="${x.item}">${itIcon(x.item, 'ico')}<span class="small">${Math.round(100 * x.games / st.games)} %</span></span>`).join('') : ''}</div>`;
    return h;
  }
  function matchupLists(st, min = 5) {
    const mu = (st.matchups || []).filter((m) => m.games >= min).map((m) => Object.assign({ c: byKey(m.opp), wr: m.wins / m.games }, m)).filter((m) => m.c);
    if (!mu.length) return '<p class="muted small">Pas encore assez de parties pour les match-ups (au moins ' + min + ' par adversaire).</p>';
    const row = (m) => `<button class="mu" data-act="champ" data-val="${esc(m.c.id)}">${cIcon(m.c, 'ico sm')}<span class="grow">${esc(m.c.name)}</span><b class="${m.wr >= 0.5 ? 'pos' : 'neg'}">${pct(m.wins, m.games)}</b><span class="muted small">${m.games}</span></button>`;
    const easy = mu.filter((m) => m.wr >= 0.5).sort((a, b) => b.wr - a.wr).slice(0, 6), hard = mu.filter((m) => m.wr < 0.5).sort((a, b) => a.wr - b.wr).slice(0, 6);
    const none = '<p class="muted small">Aucun pour l\'instant.</p>';
    return `<div class="cols2"><div><h3>😀 Match-ups faciles</h3>${easy.map(row).join('') || none}</div><div><h3>😰 Match-ups difficiles</h3>${hard.map(row).join('') || none}</div></div>`;
  }
  function statsBlock(c, role) {
    if (!NB) return '';
    const st = champStats(c.key, role);
    let h = `<div class="card"><h2>📈 Statistiques Noob LOL</h2>`;
    if (st === undefined) return h + '<div class="loader small">Calcul…</div></div>';
    if (!st || !st.roles || !st.roles.length) return h + `<p class="muted">Aucune partie analysée pour ${esc(c.name)} pour l'instant. Lance le collecteur dans les Réglages : il analyse des parties classées de joueurs Maître et plus.</p></div>`;
    h += `<div class="chips">${st.roles.map((r) => `<button class="chip ${st.role === r.role ? 'on' : ''}" data-act="champRole" data-id="${esc(c.id)}" data-val="${r.role}">${ROLE_IC[r.role]} ${ROLE_NAME[r.role]} <span class="muted">${nf(r.games)}</span></button>`).join('')}</div>`;
    h += buildBlock(st);
    h += matchupLists(st);
    return h + `<p class="muted small" style="margin-top:8px">Calculé sur les parties classées solo/duo des 30 derniers jours collectées par ton PC.</p></div>`;
  }

  /* ---------- Méta (tier list maison) ---------- */
  function viewMeta() {
    let h = `<h1>Méta</h1><p class="muted">Les champions qui gagnent le plus, d'après les parties analysées par ton collecteur (classées solo/duo, joueurs Maître et plus, 30 derniers jours).</p>
      <div class="chips" style="margin:8px 0 12px">${ROLES.map((r) => `<button class="chip ${S.metaRole === r ? 'on' : ''}" data-act="metaRole" data-val="${r}">${ROLE_IC[r]} ${ROLE_NAME[r]}</button>`).join('')}</div>`;
    if (!NB) return h + desktopOnly('La méta');
    const nd = needData(); if (nd) return h + nd;
    const list = cached('tier:' + S.metaRole, () => NB.stats.tier(S.metaRole, 30, 20));
    if (list === undefined) return h + '<div class="loader">Calcul…</div>';
    if (!list || !list.length) return h + `<div class="card"><p>Pas encore assez de parties (il faut au moins 20 parties par champion).</p><button class="btn small" data-act="mode" data-val="settings">Démarrer le collecteur</button></div>`;
    h += `<div class="card"><table class="tbl"><thead><tr><th>#</th><th>Champion</th><th>Victoires</th><th>Choisi</th><th>Parties</th></tr></thead><tbody>
      ${list.slice(0, 60).map((r, i) => { const c = byKey(r.champ); return c ? `<tr data-act="champ" data-val="${esc(c.id)}"><td class="muted">${i + 1}</td><td><span class="row nw">${cIcon(c, 'ico sm')} ${esc(c.name)}</span></td><td class="${r.wins / r.games >= 0.5 ? 'pos' : 'neg'}">${pct(r.wins, r.games)}</td><td>${(100 * r.pickRate).toFixed(1).replace('.', ',')} %</td><td class="muted">${nf(r.games)}</td></tr>` : ''; }).join('')}
      </tbody></table><p class="muted small">Classement par taux de victoire « lissé » : un champion avec peu de parties est ramené vers 50 %.</p></div>`;
    return h;
  }

  /* ---------- Objets ---------- */
  function itemMatches() {
    const f = S.itf, q = norm(f.q);
    return D.itemList.filter((it) => {
      if (q && !norm(it.name).includes(q) && !norm(it.plaintext).includes(q) && !(it.colloq && norm(it.colloq).includes(q))) return false;
      if (!f.tag) return true;
      if (f.tag === '_start') return (it.tags || []).some((t) => t === 'Lane' || t === 'Jungle' || t === 'GoldPer') && it.gold.total <= 600 && !it.from;
      if (f.tag === '_final') return isLegendary(it);
      return (it.tags || []).includes(f.tag);
    });
  }
  function itemGrid() { const l = itemMatches(); return l.length ? `<p class="muted small">${l.length} objet${l.length > 1 ? 's' : ''} · triés par prix</p><div class="grid-ic">${l.map((it) => `<button class="tile" data-act="item" data-val="${esc(it.id)}"><img loading="lazy" alt="" src="${Dd.img.item(it)}">${esc(it.name)}<div class="price">${it.gold.total} 🪙</div></button>`).join('')}</div>` : '<div class="empty">Aucun objet ne correspond.</div>'; }
  function viewItems() {
    if (S.view.item) return viewItem(S.view.item);
    const nd = needData(); if (nd) return '<h1>Objets</h1>' + nd;
    return `<div class="search"><input type="search" placeholder="🔎 Rechercher un objet…" value="${esc(S.itf.q)}" data-in="itf.q" autocomplete="off"></div>
      <div class="chips" style="margin-bottom:10px">${ITAG.map(([t, l]) => `<button class="chip ${S.itf.tag === t ? 'on' : ''}" data-act="itag" data-val="${t}">${l}</button>`).join('')}</div>
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
    const sel = D.runeById[S.rune.sel] || null;
    let h = `<div class="cols"><div><h1>Runes</h1><p class="muted">Avant la partie, tu choisis une <b>voie principale</b> (1 rune clé + 3 runes) et une <b>voie secondaire</b> (2 runes). Pendant la sélection, Noob LOL te montre les pages les plus jouées pour ton champion.</p>
      <div class="chips" style="margin:8px 0 10px">${trees.map((tr, i) => `<button class="chip ${tr === t ? 'on' : ''}" data-act="tree" data-val="${i}"><img alt="" src="${Dd.img.rune(tr)}" style="width:18px;height:18px;vertical-align:-4px"> ${esc(tr.name)}</button>`).join('')}</div>
      <div class="card tree">${t.slots.map((sl, i) => `<div class="muted small" style="margin-top:${i ? 10 : 0}px">${i === 0 ? 'Runes clés (une seule)' : 'Ligne ' + i}</div><div class="rune-row">${sl.runes.map((r) => `<button class="rune ${i === 0 ? 'key' : ''} ${S.rune.sel === r.id ? 'sel' : ''}" data-act="rune" data-val="${r.id}"><img alt="" src="${Dd.img.rune(r)}"><span>${esc(r.name)}</span></button>`).join('')}</div>`).join('')}
      ${sel ? `<div class="tip" style="margin-top:10px"><b>${esc(sel.name)}</b><div class="desc">${Dd.rich(sel.longDesc || sel.shortDesc)}</div></div>` : '<p class="muted small" style="margin-top:8px">Clique sur une rune pour lire sa description.</p>'}</div></div>`;
    h += `<div><h1>Sorts d'invocateur</h1><p class="muted">Deux sorts au choix (touches <kbd>D</kbd> et <kbd>F</kbd>). Presque tout le monde prend <b>Saut éclair</b>.</p>`;
    h += D.summList.map((s) => `<div class="list-item"><img class="ico lg" alt="" src="${Dd.img.spell(s)}"><div class="grow"><b>${esc(s.name)} <span class="muted small">· ${esc(s.cooldownBurn)} s</span></b><div class="desc small">${Dd.rich(s.description)}</div></div></div>`).join('');
    return h + '</div></div>';
  }

  /* ---------- Guide & lexique ---------- */
  const sec = (s) => `<details><summary>${s.icon} ${esc(s.title)}</summary><div class="in">${s.html}</div></details>`;
  function viewGuide() {
    let h = `<h1>Guide du débutant</h1><p class="muted">L'essentiel pour bien démarrer sur la Faille de l'invocateur.</p><div class="cols"><div>`;
    h += GUIDE.sections.slice(0, 1).map(sec).join('');
    h += `<details open><summary>🧭 Les 5 rôles</summary><div class="in">${GUIDE.roles.map((r) => `<h3>${r.icon} ${esc(r.name)}</h3><p class="muted">${esc(r.who)}</p><ul>${r.todo.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      ${D.champs ? `<div class="chips">${GUIDE.beginners[r.id].map((id) => D.champs[id]).filter(Boolean).map((c) => `<button class="chip" data-act="champ" data-val="${esc(c.id)}"><img alt="" src="${Dd.img.champ(c)}" style="width:20px;height:20px;border-radius:4px;vertical-align:-5px"> ${esc(c.name)}</button>`).join('')}</div>` : ''}`).join('')}</div></details>`;
    h += '</div><div>' + GUIDE.sections.slice(1).map(sec).join('') + '</div></div>';
    if (!D.champs) needData();
    return h;
  }
  function lexList() {
    const q = norm(S.lexQ);
    const l = GUIDE.lexicon.filter(([t, d]) => !q || norm(t).includes(q) || norm(d).includes(q));
    return l.length ? `<dl class="lex">${l.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>` : '<div class="empty">Aucun mot trouvé.</div>';
  }
  function viewLex() {
    return `<h1>Lexique</h1><p class="muted">Le jargon que tu verras dans le chat et les vidéos.</p>
      <div class="search"><input type="search" placeholder="🔎 Chercher un mot (gank, CS, peel…)" value="${esc(S.lexQ)}" data-in="lexQ" autocomplete="off"></div>
      <div class="card" id="llist">${lexList()}</div>`;
  }

  /* =====================================================================
     SÉLECTION DES CHAMPIONS
     Noob LOL lit la sélection et te conseille. C'est toujours toi qui cliques dans le client.
     ===================================================================== */
  function selectionData() {
    const cs = R.lcu.champSelect;
    if (cs) {
      const me = cs.myTeam.find((p) => p.isMe) || null;
      return { live: true, cs, me, myRole: S.select.role || cs.myRole || '', allies: cs.myTeam, enemies: cs.theirTeam.map((p) => p.champ).filter(Boolean), bans: cs.bans, myChamp: me && me.champ ? me.champ : 0, locked: !!(me && me.locked) };
    }
    const meC = D.champs && D.champs[S.select.manualMe];
    return { live: false, cs: null, me: null, myRole: S.select.role || 'mid', allies: [], enemies: S.select.manualEnemies.map((id) => (D.champs && D.champs[id] ? +D.champs[id].key : 0)).filter(Boolean), bans: [], myChamp: meC ? +meC.key : 0, locked: false };
  }
  /* Adversaire de voie : choisi par toi, sinon deviné (rôle le plus joué d'après les statistiques). */
  function laneOpponent(sd) {
    const role = sd.myRole;
    if (S.select.opp && sd.enemies.includes(+S.select.opp)) return +S.select.opp;
    if (!role) return 0;
    for (const k of sd.enemies) {
      const main = NB ? cached('main:' + k, () => NB.stats.mainRole(k)) : '';
      const c = byKey(k);
      const guess = main || (c ? beginnerRole(c.id) : '');
      if (guess === role) return k;
    }
    return 0;
  }
  function suggestions(sd, opp) {
    const role = sd.myRole;
    if (!role) return null;
    const taken = new Set([].concat(sd.bans, sd.enemies, sd.allies.filter((p) => !p.isMe && p.champ).map((p) => p.champ)));
    const cand = new Map();
    const add = (k, why) => { k = +k; if (!k || taken.has(k) || !byKey(k)) return; const o = cand.get(k) || { k, why: [], mastery: 0 }; if (why) o.why.push(why); cand.set(k, o); };
    const mastery = R.profile ? R.profile.mastery : (NB && R.lcu.summoner && R.cfg && R.cfg.hasApiKey ? cached('mast:' + R.lcu.summoner.puuid, () => NB.riot.masteries(R.lcu.summoner.puuid)) : null);
    (mastery || []).forEach((m) => { add(m.championId); const o = cand.get(+m.championId); if (o) o.mastery = m.championPoints; });
    (GUIDE.beginners[role] || []).forEach((id) => { const c = D.champs[id]; if (c) add(c.key, '🎓 Conseillé pour débuter'); });
    const tier = NB ? cached('tier:' + role, () => NB.stats.tier(role, 30, 20)) : null;
    (tier || []).slice(0, 12).forEach((t) => add(t.champ));
    const counters = NB && opp ? cached(`counters:${opp}:${role}`, () => NB.stats.counters(opp, role, 30)) : null;
    (counters || []).slice(0, 10).forEach((t) => add(t.champ));
    const tierMap = new Map((tier || []).map((t) => [t.champ, t]));
    const ctrMap = new Map((counters || []).map((t) => [t.champ, t]));
    const list = [...cand.values()].map((o) => {
      const t = tierMap.get(o.k), m = ctrMap.get(o.k);
      let score = 0.5;
      if (t) { score = t.score; o.why.unshift(`${pct(t.wins, t.games)} de victoires en ${ROLE_NAME[role]}`); }
      if (m) { score = 0.4 * score + 0.6 * m.score; o.why.unshift(`${pct(m.wins, m.games)} contre ${esc((byKey(opp) || {}).name || '')} (${m.games} parties)`); }
      if (o.mastery) { score += Math.min(o.mastery / 200000, 1) * 0.04; o.why.push(`⭐ Tu le maîtrises (${nf(Math.round(o.mastery / 1000))}k pts)`); }
      if (o.why.some((w) => w.startsWith('🎓'))) score += 0.01;
      return Object.assign(o, { score });
    }).sort((a, b) => b.score - a.score);
    return list.slice(0, 8);
  }
  function viewSelect() {
    const nd = needData(); if (nd) return '<h1>Sélection des champions</h1>' + nd;
    const sd = selectionData();
    const role = sd.myRole;
    const opp = laneOpponent(sd);
    let h = '';
    if (sd.live) {
      const t = sd.cs.timer;
      const left = t ? Math.max(0, t.left - Math.round((Date.now() - t.at) / 1000)) : 0;
      const TPH = { PLANNING: 'Déclaration des intentions', BAN_PICK: 'Bannissements et choix', FINALIZATION: 'Finalisation (runes et sorts)', GAME_STARTING: 'La partie démarre' };
      h += `<div class="row sp"><h1>🎯 Sélection en cours</h1><span class="pill on big">${esc(TPH[t && t.phase] || 'Sélection')}${t ? ` · <b data-sel-left="${t.at + t.left * 1000}">${left}</b> s` : ''}</span></div>`;
    } else {
      h += `<h1>🎯 Sélection des champions</h1><div class="card"><p>${NB ? (R.lcu.connected ? 'Tu n\'es pas en sélection. Dès qu\'une partie est trouvée, cet écran se remplit tout seul avec les champions des deux équipes.' : 'Lance le client League of Legends : dès que la sélection commence, cet écran se remplit tout seul.') : 'Dans l\'application PC, cet écran se remplit tout seul pendant la sélection.'}</p>
        <p class="muted small">En attendant, tu peux simuler une sélection : choisis ton rôle et les champions adverses ci-dessous.</p></div>`;
    }
    h += `<div class="card"><div class="row"><b>Mon rôle :</b>${ROLES.map((r) => `<button class="chip ${role === r ? 'on' : ''}" data-act="selRole" data-val="${r}">${ROLE_IC[r]} ${ROLE_NAME[r]}</button>`).join('')}
      ${sd.live && sd.cs.myRole && S.select.role && S.select.role !== sd.cs.myRole ? `<button class="chip" data-act="selRole" data-val="">↩ Rôle attribué (${ROLE_NAME[sd.cs.myRole]})</button>` : ''}</div></div>`;
    h += '<div class="cols">';
    /* Équipes */
    h += '<div>';
    if (sd.live) {
      h += `<div class="card"><h2>🟦 Mon équipe</h2>${sd.allies.map((p) => { const c = byKey(p.champ); return `<div class="slot ${p.isMe ? 'me' : ''} ${p.intent ? 'intent' : ''}">${cIcon(c)}<div class="grow"><b>${c ? esc(c.name) : '…'}</b>${p.isMe ? ' <span class="tag gold">Toi</span>' : ''}${p.intent ? ' <span class="muted small">(intention)</span>' : ''}${!p.locked && p.champ && !p.intent ? ' <span class="muted small">(survol)</span>' : ''}<div class="muted small">${p.role ? ROLE_IC[p.role] + ' ' + ROLE_NAME[p.role] : ''}</div></div></div>`; }).join('')}</div>`;
      h += `<div class="card"><h2>🟥 Équipe adverse</h2><p class="muted small">Clique sur ton adversaire de voie pour des conseils précis.</p>${sd.cs.theirTeam.map((p) => { const c = byKey(p.champ); return `<button class="slot btnlike ${c && +c.key === opp ? 'opp' : ''}" ${c ? `data-act="selOpp" data-val="${c.key}"` : 'disabled'}>${cIcon(c)}<div class="grow"><b>${c ? esc(c.name) : 'Pas encore choisi'}</b>${c && +c.key === opp ? ' <span class="tag gold">Mon adversaire</span>' : ''}</div></button>`; }).join('')}</div>`;
      if (sd.bans.length) h += `<div class="card"><h2>🚫 Bannis</h2><div class="row">${sd.bans.map((k) => cIcon(byKey(k), 'ico sm ban')).join('')}</div></div>`;
    } else {
      const opts = (sel) => `<option value="">—</option>${D.champList.map((x) => `<option value="${esc(x.id)}" ${x.id === sel ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}`;
      h += `<div class="card"><h2>Simulation</h2><label>Mon champion (facultatif)</label><select data-sel="me">${opts(S.select.manualMe)}</select>
        <label style="margin-top:8px">Champions adverses</label>${S.select.manualEnemies.map((id, i) => `<select data-sel="enemy" data-i="${i}" style="margin-bottom:6px">${opts(id)}</select>`).join('')}
        ${sd.enemies.length ? `<label>Mon adversaire de voie</label><div class="row">${sd.enemies.map((k) => { const c = byKey(k); return `<button class="chip ${k === opp ? 'on' : ''}" data-act="selOpp" data-val="${k}">${esc(c.name)}</button>`; }).join('')}</div>` : ''}</div>`;
    }
    h += '</div><div>';
    /* Conseils */
    if (sd.myChamp) h += pickPanel(sd, opp);
    if (!sd.locked) {
      const sug = suggestions(sd, opp);
      h += `<div class="card gold"><h2>💡 Champions conseillés ${role ? 'en ' + ROLE_NAME[role] : ''}${opp ? ' contre ' + esc(byKey(opp).name) : ''}</h2>`;
      if (!role) h += '<p class="muted">Choisis ton rôle ci-dessus.</p>';
      else if (!sug || !sug.length) h += '<div class="loader small">Calcul…</div>';
      else h += sug.map((o) => { const c = byKey(o.k); return `<button class="sug" data-act="champ" data-val="${esc(c.id)}">${cIcon(c, 'ico lg')}<div class="grow"><b>${esc(c.name)}</b><div class="small muted">${o.why.slice(0, 3).join(' · ') || 'Choix sûr pour ce rôle'}</div></div></button>`; }).join('')
        + `<p class="muted small">👉 Clique toi-même sur le champion dans le client du jeu. ${R.col && R.col.picks ? '' : 'Démarre le collecteur (Réglages) pour des conseils basés sur les statistiques.'}</p>`;
      h += '</div>';
    }
    if (opp) {
      const oc = byKey(opp); const f = needFull(oc.id);
      if (f) h += tipsCards(f, 'enemy');
    }
    h += '</div></div>';
    return h;
  }
  function pickPanel(sd, opp) {
    const c = byKey(sd.myChamp); if (!c) return '';
    const role = sd.myRole;
    const st = NB ? champStats(c.key, role) : null;
    const mu = NB && opp ? cached(`mu:${c.key}:${opp}:${role}`, () => NB.stats.matchup(+c.key, opp, role, 30)) : null;
    let h = `<div class="card gold"><div class="row nw">${cIcon(c, 'ico lg')}<div class="grow"><h2 style="margin:0">${esc(c.name)} ${role ? 'en ' + ROLE_NAME[role] : ''}</h2>
      <span class="muted small">${sd.locked ? 'Champion verrouillé : prépare tes runes et tes sorts.' : 'Tu survoles ce champion.'}</span></div><button class="btn ghost small" data-act="champ" data-val="${esc(c.id)}">Fiche</button></div>`;
    if (mu && mu.games) h += `<p class="tip" style="margin-top:8px">Contre <b>${esc(byKey(opp).name)}</b> : <b class="${mu.wins / mu.games >= 0.5 ? 'pos' : 'neg'}">${pct(mu.wins, mu.games)}</b> de victoires sur ${mu.games} parties analysées.</p>`;
    if (st === undefined) h += '<div class="loader small">Calcul…</div>';
    else if (st && st.games) h += buildBlock(st, { compact: true, items: 5 });
    else h += `<p class="muted small">${NB ? 'Pas encore de statistiques pour ce champion dans ce rôle.' : ''} Les runes « recommandées » du client sont un bon choix.</p>`;
    h += '</div>';
    const f = needFull(c.id);
    if (f) h += tipsCards(f, 'ally');
    return h;
  }

  /* =====================================================================
     EN JEU
     ===================================================================== */
  const now = () => Date.now();
  const gameSec = (ts = now()) => (S.game.start ? (ts - S.game.start) / 1000 : null);
  const summ = (id) => (D.summs && D.summs[id]) || null;
  const summCd = (id, haste) => { const s = summ(id); const base = s ? s.cooldown[0] : 300; return base * 100 / (100 + (haste || 0)); };
  const atGame = (until) => (S.game.start ? fmt(gameSec(until)) : null);
  const champName = (id) => (D.champs && D.champs[id] ? D.champs[id].name : '');
  const RESPAWN = { drake: 300, baron: 360, elder: 360 };

  /* Données officielles du jeu en direct : horloge, ennemis, objectifs tués. */
  function onLive(L) {
    const was = R.live;
    R.live = L;
    if (!L) { if (was) { renderTop(); if (S.mode === 'game' && !busy()) render(true); } return; }
    const g = S.game;
    const enemyTeam = L.me ? (L.me.team === 'ORDER' ? 'CHAOS' : 'ORDER') : 'CHAOS';
    const enemies = L.players.filter((p) => p.team === enemyTeam);
    const sig = enemies.map((p) => p.champ).join(',');
    if (g.sig !== sig || (g.lastTime && L.time + 5 < g.lastTime)) {
      /* Nouvelle partie détectée */
      S.game = newGame(); S.game.sig = sig;
      S.game.enemies = enemies.slice(0, 5).map((p) => ({ champ: D.champs && D.champs[p.champ] ? p.champ : '', s: [p.spells[0] || '', p.spells[1] || ''], until: [0, 0], haste: 0 }));
      while (S.game.enemies.length < 5) S.game.enemies.push(newEnemy());
    }
    const G = S.game;
    G.lastTime = L.time;
    G.start = now() - L.time * 1000;
    const nameTeam = {}; L.players.forEach((p) => { nameTeam[p.name] = p.team; nameTeam[p.gameName] = p.team; });
    for (const e of L.events) {
      if (G.seenEv.includes(e.id)) continue;
      G.seenEv.push(e.id);
      const team = nameTeam[e.killer] || nameTeam[String(e.killer).split('#')[0]];
      const who = !team ? '' : (L.me && team === L.me.team ? 'Nous' : 'Eux');
      const ago = Math.max(0, L.time - e.t);
      const startT = (id) => { G.timers[id] = now() + (RESPAWN[id] - ago) * 1000; };
      if (e.name === 'DragonKill') { if (/elder/i.test(e.dragon)) { startT('elder'); logEv(e.t, `🔥 Dragon ancestral pris par ${who || '?'}`); } else { startT('drake'); logEv(e.t, `🐉 Dragon ${dragonName(e.dragon)} pris par ${who || '?'}${e.stolen ? ' (volé !)' : ''}`); } }
      else if (e.name === 'BaronKill') { startT('baron'); logEv(e.t, `👾 Baron Nashor pris par ${who || '?'}${e.stolen ? ' (volé !)' : ''}`); }
      else if (e.name === 'HeraldKill') logEv(e.t, `🦀 Héraut de la Faille pris par ${who || '?'}`);
      else if (e.name === 'HordeKill') logEv(e.t, `🪲 Larve du Néant prise par ${who || '?'}`);
      else if (e.name === 'FirstBlood') logEv(e.t, '🩸 Premier sang');
      else if (e.name === 'TurretKilled') logEv(e.t, `🏰 Tour détruite par ${who || '?'}`);
      else if (e.name === 'InhibKilled') logEv(e.t, `💎 Inhibiteur détruit par ${who || '?'}`);
      else if (e.name === 'Ace') logEv(e.t, '💀 Équipe entière éliminée');
    }
    if (G.seenEv.length > 400) G.seenEv = G.seenEv.slice(-300);
    renderTop();
    if (S.mode === 'game' && !busy()) render(true); else save();
  }
  const dragonName = (t) => ({ Fire: 'infernal', Water: 'des océans', Earth: 'des montagnes', Air: 'des nuages', Hextech: 'hextech', Chemtech: 'chemtech' })[t] || '';
  function logEv(t, txt) { S.game.log.unshift({ t, txt }); S.game.log = S.game.log.slice(0, 30); }

  function teamValue(players) { return players.reduce((sum, p) => sum + p.items.reduce((s, i) => s + (((D.items || {})[String(i.id)] || { gold: { total: 0 } }).gold.total * (i.count || 1)), 0), 0); }
  function scoreboard(L) {
    const myTeam = L.me ? L.me.team : 'ORDER';
    const teams = [L.players.filter((p) => p.team === myTeam), L.players.filter((p) => p.team !== myTeam)];
    const val = teams.map(teamValue);
    const kills = teams.map((t) => t.reduce((s, p) => s + p.k, 0));
    const diff = val[0] - val[1];
    const row = (p) => { const c = D.champs[p.champ]; return `<tr class="${p.dead ? 'dead' : ''} ${L.me && p.name === L.me.name ? 'me' : ''}"><td>${cIcon(c, 'ico sm')}</td><td><b>${esc(c ? c.name : p.champName)}</b><div class="muted small">${esc(p.gameName)}</div></td><td>${p.level}</td><td>${p.k}/${p.d}/${p.a}</td><td>${p.cs}</td><td><div class="items">${p.items.filter((i) => i.slot < 6).map((i) => itIcon(i.id)).join('')}</div></td><td>${p.dead ? `<span class="pill off">💀 ${Math.ceil(p.respawn)} s</span>` : ''}</td></tr>`; };
    return `<div class="card"><div class="row sp"><h2 style="margin:0">📋 Tableau des scores</h2><span>Kills <b>${kills[0]}</b> – <b>${kills[1]}</b> · Valeur des objets <b class="${diff >= 0 ? 'pos' : 'neg'}">${diff >= 0 ? '+' : ''}${nf(diff)}</b> po</span></div>
      ${teams.map((t, i) => `<h3>${i ? '🟥 Adversaires' : '🟦 Mon équipe'} <span class="muted small">${nf(val[i])} po d'objets</span></h3><table class="tbl sb"><tbody>${t.map(row).join('')}</tbody></table>`).join('')}</div>`;
  }
  function viewGame() {
    const nd = needData();
    const g = S.game, L = R.live;
    let h = `<div class="row sp"><h1>⚔️ En jeu</h1>${NB ? `<div class="row"><button class="btn ${R.miniOpen ? 'danger' : 'hex'} small" data-act="${R.miniOpen ? 'miniClose' : 'miniOpen'}">🗺️ ${R.miniOpen ? 'Fermer la mini-carte' : 'Mini-carte sur l\'écran 2'}</button></div>` : ''}</div>`;
    if (nd) return h + nd;
    h += '<div class="cols"><div>';
    /* Horloge */
    h += `<div class="card gold"><div class="row sp"><h2 style="margin:0">🕒 Horloge de jeu</h2>${L ? '<span class="pill live">● Synchronisée avec le jeu</span>' : ''}</div>`;
    if (g.start) {
      h += `<div class="clock" data-clock>${fmt(gameSec())}</div>`;
      if (!L) h += `<div class="row"><input type="text" placeholder="Corriger (ex. 12:30)" id="clockFix" class="grow" style="min-height:40px"><button class="btn ghost small" data-act="clockFix">Caler</button><button class="btn danger small" data-act="newGame">Nouvelle partie</button></div>`;
    } else {
      h += `<p class="muted">${NB ? 'Pendant une partie, l\'horloge se synchronise toute seule avec le jeu.' : ''} Sans le jeu, lance-la à 0:00 ou entre l'heure affichée en jeu.</p>
        <div class="row"><button class="btn" data-act="clockStart">▶ Lancer à 0:00</button><input type="text" placeholder="ou heure actuelle, ex. 3:45" id="clockFix" class="grow" style="min-height:44px"><button class="btn ghost" data-act="clockFix">OK</button></div>`;
    }
    h += '</div>';
    if (L && L.me && L.me.stats) {
      const st = L.me.stats; const c = D.champs[L.me.champ];
      h += `<div class="card"><div class="row nw">${cIcon(c, 'ico lg')}<div class="grow"><h2 style="margin:0">${esc(c ? c.name : '')} · niveau ${L.me.level}</h2><span class="muted small">❤️ ${st.hp}/${st.maxHp} · ⚔️ ${st.ad} AD · 🔮 ${st.ap} AP · 🛡️ ${st.armor}/${st.mr} · 👟 ${st.ms}</span></div><div class="gold-big">${nf(L.me.gold)} 🪙</div></div></div>`;
    }
    /* Sorts adverses */
    h += `<div class="card"><div class="row sp"><h2 style="margin:0">⚔️ Sorts d'invocateur adverses</h2><button class="chip ${S.opt.editEnemies ? 'on' : ''}" data-act="toggleEdit">${S.opt.editEnemies ? '✔ Terminé' : '✏️ Modifier'}</button></div>
      <p class="muted small">Un ennemi utilise son Saut éclair ? Clique sur l'icône : le compte à rebours démarre. Clique à nouveau pour annuler.${L ? ' Champions et sorts remplis automatiquement depuis le jeu.' : ''}</p>`;
    h += g.enemies.map((e, i) => {
      const c = D.champs[e.champ];
      const head = S.opt.editEnemies || !c
        ? `<select data-enemy="${i}" data-field="champ"><option value="">— Ennemi ${i + 1} —</option>${D.champList.map((x) => `<option value="${esc(x.id)}" ${x.id === e.champ ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>`
        : `<div class="row nw">${cIcon(c)}<b>${esc(c.name)}</b></div>`;
      const btns = [0, 1].map((k) => {
        const sid = e.s[k], s = summ(sid), run = e.until[k] > now();
        return `<button class="sspell ${run ? 'run' : ''}" data-act="sspell" data-i="${i}" data-k="${k}" title="${esc(s ? s.name : 'Choisir un sort')}">${s ? `<img alt="" src="${Dd.img.spell(s)}">` : '<span class="none">choisir</span>'}${run ? `<span class="cdv" data-until="${e.until[k]}">${fmt((e.until[k] - now()) / 1000)}</span>` : ''}</button>`;
      }).join('');
      let edit = '';
      if (S.opt.editEnemies) {
        edit = `<div class="row" style="margin-top:6px">${[0, 1].map((k) => `<select class="grow" data-enemy="${i}" data-field="s${k}"><option value="">— Sort ${k ? 'F' : 'D'} —</option>${D.summList.map((s) => `<option value="${esc(s.id)}" ${s.id === e.s[k] ? 'selected' : ''}>${esc(s.name)} (${s.cooldownBurn} s)</option>`).join('')}</select>`).join('')}</div>
          <div class="row" style="margin-top:6px"><span class="muted small">Accélération des sorts d'invocateur :</span>${[0, 10, 18, 28].map((v) => `<button class="chip ${e.haste === v ? 'on' : ''}" data-act="haste" data-i="${i}" data-val="${v}">${v ? '+' + v : 'Aucune'}</button>`).join('')}</div>`;
      }
      const info = [0, 1].filter((k) => e.until[k] > now()).map((k) => { const s = summ(e.s[k]); const at = atGame(e.until[k]); return `${esc(s ? s.name : '?')} ${at ? 'à ' + at : ''}`; }).join(' · ');
      return `<div class="enemy"><div class="row nw"><div class="grow">${head}${info ? `<div class="muted small" style="margin-top:4px">⏳ ${info}</div>` : ''}</div>${btns}</div>${edit}</div>`;
    }).join('');
    h += `<div class="row" style="margin-top:6px"><button class="btn hex small" data-act="copyChat">📋 Copier pour le chat</button>${L ? '' : '<button class="btn ghost small" data-act="resetEnemies">Vider les ennemis</button>'}</div>
      ${S.opt.editEnemies ? '<p class="muted small">Exemple : la rune « Perspicacité cosmique » donne +18 d\'accélération des sorts d\'invocateur.</p>' : ''}</div>`;
    h += '</div><div>';
    /* Objectifs */
    h += `<div class="card"><h2>🐉 Objectifs et buffs</h2><p class="muted small">${L ? 'Dragons et Nashor se lancent tout seuls quand le jeu les annonce. ' : ''}Pour le reste, clique sur « Tué » quand le monstre meurt.</p>
      ${GUIDE.timers.map((t) => {
        const u = g.timers[t.id] || 0, run = u > now();
        return `<div class="timer ${run ? 'run' : ''}"><span style="font-size:1.3rem">${t.icon}</span><div class="nm"><b>${esc(t.name)}</b><div class="muted small">${run && g.start ? 'revient à ' + atGame(u) : 'réapparition ' + fmt(t.respawn)}</div></div>
          <span class="cd" ${run ? `data-until="${u}"` : ''}>${run ? fmt((u - now()) / 1000) : '—'}</span>
          ${run ? `<button class="chip" data-act="timerStop" data-val="${t.id}">✕</button>` : `<button class="btn small" data-act="timerGo" data-val="${t.id}">Tué</button>`}</div>`;
      }).join('')}
      <p class="muted small">Le Baron Nashor apparaît la première fois à 20:00. Repères indicatifs : Riot peut les ajuster selon les patchs.</p></div>`;
    if (g.log.length) h += `<div class="card"><h2>📜 Journal de la partie</h2>${g.log.slice(0, 12).map((l) => `<div class="small"><span class="muted">${fmt(l.t)}</span> ${esc(l.txt)}</div>`).join('')}</div>`;
    h += `<div class="card"><h2>⚙️ Alarmes</h2><div class="chips"><button class="chip ${S.opt.sound ? 'on' : ''}" data-act="opt" data-val="sound">🔔 Son</button></div><p class="muted small" style="margin-top:6px">Une alarme sonne quand un sort ou un objectif revient.</p></div>`;
    h += '</div></div>';
    if (L) h += scoreboard(L);
    else if (NB) h += `<div class="card"><p class="muted">Aucune partie détectée. Pendant une partie, Noob LOL affiche ici le tableau des scores, la valeur des objets de chaque équipe et lance les timers tout seul (données officielles « Live Client Data » de Riot).</p></div>`;
    return h;
  }
  function chatLine() {
    const parts = [];
    S.game.enemies.forEach((e) => [0, 1].forEach((k) => {
      if (e.until[k] > now()) { const s = summ(e.s[k]); parts.push(`${champName(e.champ) || 'Ennemi'} ${s ? s.name : 'sort'} ${S.game.start ? atGame(e.until[k]) : 'dans ' + fmt((e.until[k] - now()) / 1000)}`); }
    }));
    return parts.join(' | ');
  }

  /* Rafraîchissement des chronos sans tout redessiner */
  function tick() {
    const t = now();
    document.querySelectorAll('[data-until]').forEach((el) => { el.textContent = fmt((+el.dataset.until - t) / 1000); });
    document.querySelectorAll('[data-sel-left]').forEach((el) => { el.textContent = Math.max(0, Math.round((+el.dataset.selLeft - t) / 1000)); });
    const ck = document.querySelector('[data-clock]'); if (ck) ck.textContent = fmt(gameSec(t));
    let ended = false;
    const fire = (key) => { if (!S.game.fired[key]) { S.game.fired[key] = 1; ended = key; } };
    Object.keys(S.game.timers).forEach((id) => { const u = S.game.timers[id]; if (u && u <= t && u > t - 60000) fire('t:' + id + ':' + u); });
    S.game.enemies.forEach((e, i) => [0, 1].forEach((k) => { if (e.until[k] && e.until[k] <= t && e.until[k] > t - 60000) fire('e:' + i + ':' + k + ':' + e.until[k]); }));
    if (ended) {
      alarm();
      const label = ended.startsWith('t:') ? (GUIDE.timers.find((x) => x.id === ended.split(':')[1]) || {}).name + ' est de retour !' : (() => { const [, i, k] = ended.split(':'); const e = S.game.enemies[+i]; const s = summ(e.s[+k]); return `${champName(e.champ) || 'Ennemi ' + (+i + 1)} : ${s ? s.name : 'sort'} de nouveau disponible`; })();
      toast('🔔 ' + label);
      if (S.mode === 'game' && !busy()) render(true); else save();
    }
  }
  setInterval(tick, 500);
  let actx = null;
  function alarm() {
    if (!S.opt.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.22].forEach((d) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.value = 880; g.gain.setValueAtTime(0.0001, actx.currentTime + d); g.gain.exponentialRampToValueAtTime(0.25, actx.currentTime + d + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + d + 0.18); o.connect(g).connect(actx.destination); o.start(actx.currentTime + d); o.stop(actx.currentTime + d + 0.2); });
    } catch (e) { /* audio indisponible */ }
  }

  /* =====================================================================
     RÉGLAGES
     ===================================================================== */
  function viewSettings() {
    if (!NB) return '<h1>Réglages</h1>' + desktopOnly('Les réglages') + infoCard();
    const c = R.cfg || {}, col = R.col || {};
    const plats = (R.info && R.info.platforms) || {};
    let h = '<h1>⚙️ Réglages</h1><div class="cols"><div>';
    h += `<div class="card gold"><h2>🔑 Clé API Riot</h2>
      <p class="muted small">Gratuite, elle permet de lire ton compte et d'analyser des parties pour les statistiques. Crée-la sur <a href="https://developer.riotgames.com" data-ext="1">developer.riotgames.com</a> (connexion avec ton compte Riot) et colle-la ici. Une clé de développement expire au bout de 24 h : pour ne plus la renouveler, demande une clé « Personal » sur le même site.</p>
      <div class="row"><input type="password" id="apiKey" class="grow" placeholder="${c.hasApiKey ? '•••••••• (clé enregistrée)' : 'RGAPI-xxxxxxxx-xxxx-…'}" autocomplete="off"><button class="btn small" data-act="saveKey">Enregistrer</button>${c.hasApiKey ? '<button class="btn ghost small" data-act="testKey">Tester</button>' : ''}</div>
      ${R.keyMsg ? `<p class="small">${esc(R.keyMsg)}</p>` : ''}
      <p class="muted small">${c.keyEncrypted ? '🔒 Clé chiffrée par Windows sur ce PC.' : ''} Elle n'est jamais envoyée ailleurs que chez Riot.</p></div>`;
    h += `<div class="card"><h2>👤 Mon compte</h2>
      <label>Serveur</label><select data-cfg="platform">${Object.keys(plats).map((p) => `<option value="${p}" ${c.platform === p ? 'selected' : ''}>${esc(plats[p])}</option>`).join('')}</select>
      <div class="row" style="margin-top:8px"><div class="grow"><label>Riot ID</label><input type="text" data-cfg="riotId.gameName" value="${esc((c.riotId || {}).gameName)}" placeholder="Pseudo"></div><div style="width:110px"><label>Tag</label><input type="text" data-cfg="riotId.tagLine" value="${esc((c.riotId || {}).tagLine)}" placeholder="EUW"></div></div>
      ${R.lcu.summoner && R.lcu.summoner.tagLine ? `<button class="btn ghost small" style="margin-top:8px" data-act="useClientId">Utiliser le compte du client (${esc(R.lcu.summoner.gameName)}#${esc(R.lcu.summoner.tagLine)})</button>` : ''}
      <label style="margin-top:8px">Dossier de League of Legends</label><input type="text" data-cfg="lolPath" value="${esc(c.lolPath)}">
      <p class="muted small">Client : ${R.lcu.connected ? '🟢 détecté' : '⚪ non détecté'}. Noob LOL lit le client (phase, sélection) sans jamais cliquer à ta place.</p>
      <div class="chips"><button class="chip ${c.autoMode ? 'on' : ''}" data-act="cfgToggle" data-val="autoMode">Changer d'écran automatiquement (sélection → en jeu)</button></div></div>`;
    h += infoCard();
    h += '</div><div>';
    const running = col.running;
    h += `<div class="card"><h2>📊 Collecteur de statistiques</h2>
      <p class="muted small">Il récupère des parties classées récentes de joueurs Maître, Grand maître et Challenger de ton serveur (API officielle de Riot) et calcule runes, objets, sorts et match-ups par champion et par rôle. Tout est stocké sur ton PC. Avec une clé de développement : environ 2 000 parties par jour si le PC reste allumé.</p>
      <div class="kpis"><div><b>${nf(col.matches)}</b><span>parties analysées</span></div><div><b>${nf(col.picks)}</b><span>lignes champion</span></div><div><b>${nf(col.pending)}</b><span>en attente</span></div><div><b>${nf(col.seeds)}</b><span>joueurs suivis</span></div></div>
      <p class="small">${running ? '🟢 En cours…' : '⏸️ À l\'arrêt'}${col.lastError ? ` · <span class="neg">${esc(col.lastError)}</span>` : ''}</p>
      <div class="row"><button class="btn ${running ? 'danger' : ''} small" data-act="${running ? 'colStop' : 'colStart'}" ${c.hasApiKey ? '' : 'disabled'}>${running ? '⏸️ Arrêter' : '▶ Démarrer'}</button>
      <button class="chip ${(c.collector || {}).autoStart ? 'on' : ''}" data-act="colAuto">Démarrer avec l'appli</button><button class="btn ghost small" data-act="colClear">Vider les statistiques</button></div></div>`;
    h += miniSettings();
    h += '</div></div>';
    return h;
  }
  function infoCard() {
    return `<div class="card"><h2>ℹ️ Noob LOL</h2><p>Version <b>${esc((R.info && R.info.version) || APP_VERSION)}</b>${D.version ? ` · données du patch <b>${esc(D.version)}</b>` : ''}</p>
      <p class="muted small">Données des champions, objets et runes : Data Dragon (Riot Games). Compte et statistiques : API officielle de Riot. En jeu : API officielle « Live Client Data ». Les mises à jour de l'appli s'installent toutes seules.</p>
      <details class="flat"><summary class="small">📝 Notes de version</summary>${APP_RELEASES.map((r) => `<h3>${esc(r.v)} <span class="muted small">${esc(r.date)}</span></h3><ul>${r.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`).join('')}</details>
      <div class="row" style="margin-top:8px"><button class="btn ghost small" data-act="reloadData">🔄 Recharger les données Riot</button><button class="btn danger small" data-act="wipe">Effacer mes favoris et notes</button></div>
      <p class="muted small" style="margin-top:8px">Noob LOL n'est pas approuvé par Riot Games et ne reflète pas les opinions de Riot Games ou de quiconque officiellement impliqué dans la production ou la gestion des propriétés de Riot Games. Riot Games et toutes les propriétés associées sont des marques commerciales ou des marques déposées de Riot Games, Inc.</p></div>`;
  }
  function miniSettings() {
    const c = R.cfg || {}, m = c.minimap || {};
    if (!R.displays) { R.displays = []; NB.minimap.displays().then((d) => { R.displays = d; soon(); }).catch(() => {}); }
    const ds = R.displays;
    const crop = m.crop || { x: 0.857, y: 0.745, w: 0.14, h: 0.25 };
    let h = `<div class="card"><h2>🗺️ Mini-carte sur un deuxième écran</h2>
      <p class="muted small">Noob LOL filme la zone de la mini-carte sur l'écran du jeu et l'affiche en grand. Règle League of Legends en mode <b>« Fenêtré sans bordure »</b> (le plein écran exclusif ne peut pas être filmé).</p>
      <div class="row"><div class="grow"><label>Écran du jeu</label><select data-cfg="minimap.sourceDisplayId">${ds.map((d) => `<option value="${d.id}" ${String(m.sourceDisplayId || (ds.find((x) => x.primary) || {}).id) === String(d.id) ? 'selected' : ''}>${esc(d.label)} ${d.bounds.width}×${d.bounds.height}${d.primary ? ' (principal)' : ''}</option>`).join('')}</select></div>
      <div class="grow"><label>Afficher sur</label><select data-cfg="minimap.displayId">${ds.map((d) => `<option value="${d.id}" ${String(m.displayId || (ds.find((x) => !x.primary) || ds[0] || {}).id) === String(d.id) ? 'selected' : ''}>${esc(d.label)} ${d.bounds.width}×${d.bounds.height}${d.primary ? ' (principal)' : ''}</option>`).join('')}</select></div></div>
      ${ds.length < 2 ? '<p class="small warn">Un seul écran détecté : la mini-carte s\'ouvrira dans une fenêtre.</p>' : ''}
      <h3>Zone de la mini-carte</h3><p class="muted small">Prends une capture pendant une partie (ou l'Outil d'entraînement), puis trace un rectangle autour de la mini-carte.</p>
      <div class="row"><button class="btn ghost small" data-act="miniShot">📸 Prendre une capture</button><button class="btn ghost small" data-act="miniReset">Position par défaut</button><button class="chip ${m.alwaysOnTop ? 'on' : ''}" data-act="miniTop">Toujours au premier plan</button></div>`;
    if (R.shot) h += `<div class="cropper" id="cropper"><img src="${R.shot}" alt="Capture" draggable="false"><div class="crop" id="cropBox" style="left:${crop.x * 100}%;top:${crop.y * 100}%;width:${crop.w * 100}%;height:${crop.h * 100}%"></div></div>
      <div class="row"><button class="btn small" data-act="miniSaveCrop">Enregistrer la zone</button><span class="muted small">Glisse sur l'image pour tracer la zone.</span></div>`;
    h += `<div class="row" style="margin-top:10px"><button class="btn ${R.miniOpen ? 'danger' : 'hex'}" data-act="${R.miniOpen ? 'miniClose' : 'miniOpen'}">🗺️ ${R.miniOpen ? 'Fermer la mini-carte' : 'Ouvrir la mini-carte'}</button></div></div>`;
    return h;
  }

  /* ---------- Navigation ---------- */
  function openView(kind, id) {
    S.view = { champ: null, item: null }; S.view[kind] = id;
    S.mode = 'prep';
    S.tab = kind === 'champ' ? 'champs' : 'items';
    render();
  }
  let lastMode = null;
  function closeView() { S.view = { champ: null, item: null }; if (lastMode && lastMode !== 'prep') { S.mode = lastMode; lastMode = null; } render(); }

  let toastT = null;
  function toast(msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.style.display = 'block';
    clearTimeout(toastT); toastT = setTimeout(() => { t.style.display = 'none'; }, 3500);
  }
  function cfgSet(patch) { return NB.config.set(patch).then((c) => { R.cfg = c; render(true); }).catch((e) => toast(e.message)); }

  /* ---------- Actions ---------- */
  document.addEventListener('click', (ev) => {
    const ext = ev.target.closest('a[data-ext]');
    if (ext) { ev.preventDefault(); if (NB) NB.openExternal(ext.href); else window.open(ext.href, '_blank', 'noopener'); return; }
    const el = ev.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const a = el.dataset.act, v = el.dataset.val;
    if (el.tagName === 'A') ev.preventDefault();
    const g = S.game;
    switch (a) {
      case 'mode': S.view = { champ: null, item: null }; S.mode = v; render(); break;
      case 'tab': S.view = { champ: null, item: null }; S.mode = 'prep'; S.tab = v; render(); break;
      case 'retry': D.error = null; render(); break;
      case 'champ': if (S.mode !== 'prep') lastMode = S.mode; openView('champ', v); break;
      case 'item': if (S.mode !== 'prep') lastMode = S.mode; openView('item', v); break;
      case 'back': closeView(); break;
      case 'fav': S.favs = S.favs.includes(v) ? S.favs.filter((x) => x !== v) : S.favs.concat(v); render(true); break;
      case 'skin': S.skin[el.dataset.id] = +v; render(true); break;
      case 'champRole': S.champRole[el.dataset.id] = v; render(true); break;
      case 'role': S.role = v; render(true); break;
      case 'metaRole': S.metaRole = v; render(true); break;
      case 'tipNext': S.tipN = (S.tipN + 1 + Math.floor(Math.random() * (GUIDE.tips.length - 1))) % GUIDE.tips.length; render(true); break;
      case 'cf': { const p = el.dataset.path; const val = p === 'fav' ? true : v; S.cf[p] = S.cf[p] === val ? (p === 'fav' ? false : '') : val; render(true); break; }
      case 'itag': S.itf.tag = v; render(true); break;
      case 'tree': S.rune.tree = +v; S.rune.sel = null; render(true); break;
      case 'rune': S.rune.sel = S.rune.sel === +v ? null : +v; render(true); break;
      case 'profileReload': cache.clear(); loadProfile(true); render(true); break;
      case 'selRole': S.select.role = v; render(true); break;
      case 'selOpp': S.select.opp = S.select.opp === v ? '' : v; render(true); break;
      case 'clockStart': g.start = now(); render(true); break;
      case 'clockFix': { const s = parseMS((document.getElementById('clockFix') || {}).value); if (s == null) { toast('Format attendu : minutes:secondes, ex. 12:30'); break; } g.start = now() - s * 1000; render(true); break; }
      case 'newGame': if (confirmTap(el, 'Sûr ? Clique encore')) { S.game = newGame(); render(true); } break;
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
      case 'resetEnemies': if (confirmTap(el, 'Sûr ? Clique encore')) { g.enemies = newGame().enemies; render(true); } break;
      case 'copyChat': {
        const line = chatLine();
        if (!line) { toast('Aucun sort adverse en recharge pour l\'instant.'); break; }
        (navigator.clipboard ? navigator.clipboard.writeText(line) : Promise.reject()).then(() => toast('Copié : ' + line)).catch(() => toast(line));
        break;
      }
      case 'opt': S.opt[v] = !S.opt[v]; if (v === 'sound' && S.opt.sound) { unlockAudio(); alarm(); } render(true); break;
      /* Réglages */
      case 'saveKey': {
        const k = (document.getElementById('apiKey') || {}).value || '';
        R.keyMsg = 'Vérification…'; render(true);
        NB.config.setKey(k.trim()).then(() => { R.keyMsg = k.trim() ? '✅ Clé valide et enregistrée.' : 'Clé supprimée.'; R.profile = null; R.profileErr = ''; }).catch((e) => { R.keyMsg = '❌ ' + e.message; })
          .finally(() => NB.config.get().then((c) => { R.cfg = c; render(true); }));
        break;
      }
      case 'testKey': R.keyMsg = 'Vérification…'; render(true); NB.config.testKey().then(() => { R.keyMsg = '✅ La clé fonctionne.'; }).catch((e) => { R.keyMsg = '❌ ' + e.message; }).finally(() => render(true)); break;
      case 'useClientId': cfgSet({ riotId: { gameName: R.lcu.summoner.gameName, tagLine: R.lcu.summoner.tagLine } }); R.profile = null; break;
      case 'cfgToggle': cfgSet({ [v]: !(R.cfg || {})[v] }); break;
      case 'colStart': NB.collector.start().then((s) => { R.col = s; render(true); }); break;
      case 'colStop': NB.collector.stop().then((s) => { R.col = s; render(true); }); break;
      case 'colAuto': cfgSet({ collector: { autoStart: !((R.cfg || {}).collector || {}).autoStart } }); break;
      case 'colClear': if (confirmTap(el, 'Tout effacer ? Clique encore')) NB.stats.clear().then(() => { cache.clear(); return NB.collector.status(); }).then((s) => { R.col = s; render(true); }); break;
      case 'miniOpen': NB.minimap.open().then(() => { R.miniOpen = true; render(true); }).catch((e) => toast(e.message)); break;
      case 'miniClose': NB.minimap.close().then(() => { R.miniOpen = false; render(true); }); break;
      case 'miniTop': cfgSet({ minimap: { alwaysOnTop: !((R.cfg || {}).minimap || {}).alwaysOnTop } }); break;
      case 'miniReset': cfgSet({ minimap: { crop: { x: 0.857, y: 0.745, w: 0.14, h: 0.25 } } }); break;
      case 'miniShot': NB.minimap.sources().then((list) => {
        const m = (R.cfg || {}).minimap || {}; const prim = (R.displays.find((d) => d.primary) || {}).id;
        const src = list.find((s) => String(s.displayId) === String(m.sourceDisplayId || prim)) || list[0];
        R.shot = src ? src.thumb : null; if (!R.shot) toast('Aucun écran trouvé.'); render(true);
      }).catch((e) => toast(e.message)); break;
      case 'miniSaveCrop': if (pendingCrop) cfgSet({ minimap: { crop: pendingCrop } }).then(() => toast('Zone enregistrée.')); break;
      case 'installUpdate': NB.installUpdate(); break;
      case 'reloadData': if (window.caches) window.caches.delete('nooblol-ddragon').finally(() => location.reload()); else location.reload(); break;
      case 'wipe': if (confirmTap(el, 'Tout effacer ? Clique encore')) { localStorage.removeItem(KEY); location.reload(); } break;
      default: break;
    }
  });
  function confirmTap(el, msg) {
    if (el.dataset.armed) return true;
    el.dataset.armed = '1'; const old = el.textContent; el.textContent = msg;
    setTimeout(() => { if (el.isConnected) { delete el.dataset.armed; el.textContent = old; } }, 3000);
    return false;
  }
  function unlockAudio() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { /* ignoré */ } }

  /* Tracé de la zone de la mini-carte sur la capture */
  let pendingCrop = null, dragStart = null;
  document.addEventListener('mousedown', (ev) => {
    const box = ev.target.closest('#cropper'); if (!box) return;
    ev.preventDefault();
    const r = box.getBoundingClientRect();
    dragStart = { x: (ev.clientX - r.left) / r.width, y: (ev.clientY - r.top) / r.height, r };
  });
  document.addEventListener('mousemove', (ev) => {
    if (!dragStart) return;
    const r = dragStart.r;
    const x = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)), y = Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height));
    pendingCrop = { x: Math.min(x, dragStart.x), y: Math.min(y, dragStart.y), w: Math.abs(x - dragStart.x), h: Math.abs(y - dragStart.y) };
    const b = document.getElementById('cropBox');
    if (b) Object.assign(b.style, { left: pendingCrop.x * 100 + '%', top: pendingCrop.y * 100 + '%', width: pendingCrop.w * 100 + '%', height: pendingCrop.h * 100 + '%' });
  });
  document.addEventListener('mouseup', () => { if (dragStart && pendingCrop && (pendingCrop.w < 0.01 || pendingCrop.h < 0.01)) pendingCrop = null; dragStart = null; });

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
    if (el.dataset.cfg) {
      const path = el.dataset.cfg.split('.'); let val = el.value;
      if (/displayId|sourceDisplayId/.test(path[1] || '')) val = +val;
      const patch = path.length === 2 ? { [path[0]]: { [path[1]]: val } } : { [path[0]]: val };
      if (path[0] === 'riotId' || path[0] === 'platform') { R.profile = null; R.profileErr = ''; cache.clear(); }
      cfgSet(patch);
      return;
    }
    if (el.dataset.sel) {
      if (el.dataset.sel === 'me') S.select.manualMe = el.value; else S.select.manualEnemies[+el.dataset.i] = el.value;
      el.blur(); render(true); return;
    }
    if (el.dataset.enemy == null) return;
    const e = S.game.enemies[+el.dataset.enemy], f = el.dataset.field;
    if (f === 'champ') e.champ = el.value;
    else { const k = +f.slice(1); e.s[k] = el.value; e.until[k] = 0; }
    el.blur(); render(true);
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && ev.target.id === 'clockFix') document.querySelector('[data-act="clockFix"]').click();
    if (ev.key === 'Enter' && ev.target.id === 'apiKey') document.querySelector('[data-act="saveKey"]').click();
    if (ev.key === 'Escape' && (S.view.champ || S.view.item)) closeView();
  });

  /* ---------- Connexion au PC (application) ---------- */
  if (NB) {
    let prevPhase = 'None';
    NB.lcu.on((st) => {
      const old = R.lcu; R.lcu = st;
      const auto = !R.cfg || R.cfg.autoMode !== false;
      if (st.phase !== prevPhase) {
        if (auto && st.phase === 'ChampSelect') { S.mode = 'select'; S.view = { champ: null, item: null }; S.select.opp = ''; S.select.role = ''; }
        else if (auto && (st.phase === 'InProgress' || st.phase === 'GameStart')) S.mode = 'game';
        else if (auto && prevPhase === 'ChampSelect' && /Lobby|Matchmaking|None/.test(st.phase) && S.mode === 'select') S.mode = 'prep';
        prevPhase = st.phase;
        if (st.connected && !old.connected && R.cfg && !(R.cfg.riotId || {}).gameName && st.summoner && st.summoner.tagLine) cfgSet({ riotId: { gameName: st.summoner.gameName, tagLine: st.summoner.tagLine } });
        render(true); return;
      }
      if (S.mode === 'select' && !busy()) render(true); else renderTop();
    });
    NB.live.on((d) => { if (d && !R.live && R.cfg && R.cfg.autoMode !== false) S.mode = 'game'; onLive(d); });
    NB.collector.on((s) => { const grew = R.col && s.picks !== R.col.picks; R.col = s; if (grew && s.picks % 50 < 10) cache.clear(); if (S.mode === 'settings' && !busy()) render(true); });
    NB.minimap.onState((open) => { R.miniOpen = open; if (!busy()) render(true); });
    NB.onUpdate((u) => { R.update = u; renderTop(); });
    Promise.all([NB.config.get(), NB.info(), NB.lcu.state(), NB.collector.status(), NB.minimap.isOpen(), NB.live.state()]).then(([c, i, l, col, mo, lv]) => {
      R.cfg = c; R.info = i; R.lcu = l || R.lcu; R.col = col; R.miniOpen = mo; prevPhase = R.lcu.phase;
      if (lv) onLive(lv);
      if (R.lcu.phase === 'ChampSelect') S.mode = 'select';
      render(true);
    }).catch(() => {});
  }

  Dd.load().then(() => render(true)).catch(() => render(true));
  render();
})();
