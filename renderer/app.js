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
  /* Sbires par minute, partout à la place du total de sbires */
  const csm = (cs, sec) => ((cs || 0) / Math.max(1, (sec || 0) / 60)).toFixed(1).replace('.', ',');
  const D = Dd.st;

  /* ---------- État enregistré ---------- */
  const newEnemy = () => ({ champ: '', s: ['SummonerFlash', ''], until: [0, 0], haste: 0 });
  const newGame = () => ({ start: null, timers: {}, enemies: [0, 1, 2, 3, 4].map(newEnemy), fired: {}, seenEv: [], log: [], sig: '' });
  const defaults = () => ({
    mode: 'prep', tab: 'home', view: { champ: null, item: null }, favs: [], notes: {}, skin: {}, champRole: {},
    cf: { q: '', tag: '', range: '', diff: '', fav: false }, itf: { q: '', tag: '', stats: [], any: false, price: '', sort: 'price' }, rune: { tree: 0, sel: null }, lexQ: '', role: 'top', metaRole: 'mid',
    select: { role: '', opp: '', manualEnemies: ['', '', '', '', ''], manualMe: '' },
    goal: { metric: '', target: 0 }, goals: {}, progRole: '', targetTier: '', game: newGame(), opt: { sound: true, vibrate: true, editEnemies: false, miniEmbed: true, voice: true, reminders: true, voiceName: '', voiceRate: 1.05, voiceVol: 90 }, postTab: 'resume', lastPick: null, tipN: 0, myRunes: [], myItems: [], selItems: {}, seeded: [], gameBuild: null, ed: null,
  });
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!raw) return defaults();
      const d = defaults();
      Object.assign(d, raw);
      ['cf', 'itf', 'rune', 'opt', 'view', 'select', 'goal'].forEach((k) => { d[k] = Object.assign(defaults()[k], raw[k] || {}); });
      if (!d.selItems || typeof d.selItems !== 'object') d.selItems = {}; if (!Array.isArray(d.myRunes)) d.myRunes = []; if (!Array.isArray(d.myItems)) d.myItems = [];
      d.game = Object.assign(newGame(), raw.game || {});
      if (!Array.isArray(d.game.enemies) || d.game.enemies.length !== 5) d.game.enemies = newGame().enemies;
      return d;
    } catch (e) { return defaults(); }
  }
  let S = load();
  /* Builds préparés par Claude, ajoutés une seule fois dans « Mes builds » (si tu les supprimes, ils ne reviennent pas) */
  const PRESETS = [
    { key: 'claude-lillia-support',
      runes: { name: 'Claude Lillia Support', champ: 'Lillia', roles: ['support'], primary: 8200, perks: [8229, 8226, 8234, 8237], sub: 8300, subPerks: [{ row: 1, perk: 8304 }, { row: 3, perk: 8347 }], shards: [5008, 5010, 5011], spells: [4, 3] },
      items: { name: 'Claude Lillia Support', champ: 'Lillia', roles: ['support'], start: [3865, 3871, 2003], core: [6653, 3116], boots: 3158, situational: [3157, 3165, 3102, 3135] } },
  ];
  if (!Array.isArray(S.seeded)) S.seeded = [];
  for (const p of PRESETS) {
    if (S.seeded.includes(p.key)) continue;
    const t = Date.now();
    S.myRunes.push(Object.assign({ id: p.key + '-r', at: t }, JSON.parse(JSON.stringify(p.runes))));
    S.myItems.push(Object.assign({ id: p.key + '-i', at: t }, JSON.parse(JSON.stringify(p.items))));
    S.seeded.push(p.key);
  }
  S.tipN = Math.floor(Math.random() * GUIDE.tips.length);
  S.view = { champ: null, item: null };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* stockage plein */ } };

  /* ---------- État en direct (non enregistré) ---------- */
  const R = { lcu: { connected: false, phase: 'None', summoner: null, champSelect: null }, live: null, cfg: null, info: null, col: null, profile: null, profileErr: '', profileLoading: false, update: null, miniOpen: false, displays: null, shot: null, keyMsg: '', applied: { runes: '', spells: '' }, selPages: [], selSpells: [], prevObj: {}, pinfo: {}, pinfoPending: new Set(), post: null, liveMemo: {}, key: { state: 'unknown' }, recent: {}, recentPending: new Set(), full: {} };
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
  const PREP_TABS = [['home', '🏠', 'Accueil'], ['account', '👤', 'Mon compte'], ['champs', '🦸', 'Champions'], ['meta', '📈', 'Méta'], ['items', '🛒', 'Objets'], ['runes', '✨', 'Runes'], ['builds', '🧰', 'Mes builds'], ['guide', '📖', 'Guide'], ['lex', '💬', 'Lexique']];
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
      ${keyBanner()}
      ${R.update ? `<div class="updbar"><span>🔄 La version ${esc(R.update.version)} est prête.</span><button data-act="installUpdate">Redémarrer et mettre à jour</button></div>` : ''}`;
  }
  /* Clé Riot : expirée, bientôt expirée, renouvellement en cours */
  const keySoon = () => R.key.state === 'ok' && !R.key.permanent && R.key.savedAt && Date.now() > R.key.savedAt + 23 * 3600000;
  function keyBanner() {
    if (!NB || (S.mode === 'game' && R.live)) return '';
    if (R.key.renewing) return '<div class="keybar info"><span>🔑 Fenêtre Riot ouverte : connecte-toi, coche « Je ne suis pas un robot » puis clique « Regenerate API Key ». Noob LOL récupère la clé tout seul.</span></div>';
    if (R.key.state === 'expired') return '<div class="keybar"><span>🔑 Ta clé Riot a expiré : Mon compte, le collecteur et les statistiques de fin de partie sont en pause.</span><button data-act="renewKey">🔄 Renouveler ma clé</button></div>';
    if (keySoon()) return '<div class="keybar warn"><span>🔑 Ta clé de développement Riot expire bientôt (24 h après sa création).</span><button data-act="renewKey">🔄 Renouveler maintenant</button></div>';
    return '';
  }
  function render(keepScroll) {
    const y = window.scrollY;
    document.body.dataset.mode = S.mode;
    renderTop();
    let v;
    if (S.mode === 'select') v = viewSelect;
    else if (S.mode === 'game') v = viewGame;
    else if (S.mode === 'settings') v = viewSettings;
    else v = { home: viewHome, account: viewAccount, champs: viewChamps, meta: viewMeta, items: viewItems, runes: viewRunes, builds: viewMyBuilds, guide: viewGuide, lex: viewLex }[S.tab] || viewHome;
    $app.innerHTML = v();
    mmSync();
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
  /* ---------- Ce qui change au patch pour MES champions (favoris, maîtrises, champions joués récemment) ---------- */
  function myChampIds() {
    const ids = [...S.favs];
    ((R.profile && R.profile.mastery) || []).slice(0, 5).forEach((m) => { const c = byKey(m.championId); if (c) ids.push(c.id); });
    const cnt = {}; ((R.hist && R.hist.games) || []).forEach((g) => { const c = byKey(g.champ); if (c) cnt[c.id] = (cnt[c.id] || 0) + 1; });
    Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a]).slice(0, 5).forEach((id) => ids.push(id));
    return [...new Set(ids)].filter((id) => D.champs && D.champs[id]).slice(0, 12);
  }
  function patchCard() {
    if (!D.version) return '';
    const ids = myChampIds();
    const pv = (v) => String(v || '').split('.').slice(0, 2).join('.');
    if (!ids.length) return `<div class="card"><h2>🔧 Patch ${esc(pv(D.version))}</h2><p class="muted small">Ajoute des champions en favoris (⭐) ou joue quelques parties : Noob LOL te montrera ce qui change pour eux à chaque patch.</p></div>`;
    const key = ids.join(',') + '@' + D.version;
    if (!R.patch || R.patch.key !== key) { R.patch = { key, loading: true }; Dd.patchDiff(ids).then((d) => { R.patch = { key, d }; soon(); }).catch(() => { R.patch = { key, d: null }; }); }
    if (R.patch.loading) return `<div class="card"><h2>🔧 Patch ${esc(pv(D.version))}</h2><div class="loader small">Comparaison avec le patch précédent…</div></div>`;
    const d = R.patch.d;
    if (!d) return '';
    const entries = ids.map((id) => [id, d.champs[id]]).filter(([, v]) => v);
    const changed = entries.filter(([, v]) => v === 'new' || v.length);
    const same = entries.filter(([, v]) => v !== 'new' && !v.length);
    const line = (c) => `<li class="${c.good === true ? 'buff' : c.good === false ? 'nerf' : ''}" ${c.text ? `title="${esc(c.text)}"` : ''}>${c.good === true ? '▲' : c.good === false ? '▼' : '•'} ${esc(c.what)}${c.before ? ` : <s class="muted">${esc(c.before)}</s> → <b>${esc(c.after)}</b>` : ` ${esc(c.after)}`}</li>`;
    return `<div class="card"><h2>🔧 Patch ${esc(pv(d.to))} : ce qui change pour tes champions</h2><p class="small muted">Comparaison des données officielles de Riot avec le patch ${esc(pv(d.from))}. ▲ amélioration · ▼ affaiblissement.</p>
      ${changed.length ? changed.map(([id, v]) => { const c = D.champs[id]; return `<details class="pchg" ${changed.length <= 3 ? 'open' : ''}><summary>${cIcon(c, 'ico xs')}<b>${esc(c.name)}</b> <span class="small muted">${v === 'new' ? 'nouveau champion' : v.length + ' changement' + (v.length > 1 ? 's' : '')}</span></summary>${v === 'new' ? '' : `<ul>${v.map(line).join('')}</ul>`}</details>`; }).join('') : '<p class="small">Aucun changement visible pour tes champions dans les données de Riot.</p>'}
      ${same.length ? `<p class="small muted">Inchangés : ${same.map(([id]) => esc(D.champs[id].name)).join(', ')}.</p>` : ''}
      <p class="small muted">Les dégâts exacts ne figurent pas toujours dans ces données : pour le détail, consulte les <a href="https://www.leagueoflegends.com/fr-fr/news/tags/patch-notes/" data-ext="1">notes de patch officielles</a>.</p></div>`;
  }
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
      if (NB && R.cfg && R.cfg.hasApiKey) { if (!R.profile && !R.profileErr) loadProfile(); loadHistory(); }
      h += patchCard();
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


  /* ---------- Ma progression sur mes 40 dernières parties ---------- */
  function loadHistory(force) {
    if (!NB || R.histLoading || ((R.hist || R.histErr) && !force)) return;
    R.histLoading = true; R.histErr = '';
    const riotId = R.lcu.summoner && R.lcu.summoner.tagLine ? { gameName: R.lcu.summoner.gameName, tagLine: R.lcu.summoner.tagLine } : null;
    NB.riot.history(riotId).then((h) => { R.hist = h; }).catch((e) => { R.histErr = e.message; }).finally(() => { R.histLoading = false; render(true); });
  }
  const perMin = (v, g) => v / Math.max(1, g.dur / 60);
  const METRICS = {
    csm: { label: 'CS/min', f: (g) => perMin(g.cs, g), fmt: (v) => f1(v), up: true, def: 6, step: 0.5 },
    deaths: { label: 'Morts', f: (g) => g.d, fmt: (v) => f1(v), up: false, def: 5, step: 1 },
    vision: { label: 'Vision/min', f: (g) => perMin(g.vision, g), fmt: (v) => f1(v), up: true, def: 1, step: 0.1 },
    kp: { label: 'Participation', f: (g) => g.kp, fmt: (v) => Math.round(v * 100) + ' %', up: true, def: 0.5, step: 0.05 },
    kda: { label: 'KDA', f: (g) => (g.k + g.a) / Math.max(1, g.d), fmt: (v) => f1(v), up: true, def: 3, step: 0.5 },
    gpm: { label: 'Or/min', f: (g) => perMin(g.gold, g), fmt: (v) => String(Math.round(v)), up: true, def: 400, step: 25 },
  };
  const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  function mainRoleOf(games) { const c = {}; games.forEach((g) => { const r = MATCH_ROLE[g.role]; if (r) c[r] = (c[r] || 0) + 1; }); return Object.keys(c).sort((a, b) => c[b] - c[a])[0] || ''; }
  /* ---------- Repères par rang (valeurs typiques ESTIMÉES : Riot ne publie pas de moyennes par rang) ----------
     Une valeur par rang, de Fer à Challenger, puis un ajustement selon le rôle. */
  const TIERS = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'];
  const BENCH = {
    csm: { base: [4.5, 5.0, 5.5, 6.0, 6.4, 6.7, 7.1, 7.5, 7.8, 8.0], role: { jungle: -0.4, adc: 0.3, support: null } },
    deaths: { base: [7.0, 6.5, 6.0, 5.6, 5.3, 5.0, 4.7, 4.4, 4.2, 4.0], role: { support: 0.3 } },
    vision: { base: [0.45, 0.5, 0.55, 0.6, 0.7, 0.75, 0.85, 0.95, 1.0, 1.05], role: { jungle: 'x1.3', support: [1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.5, 2.6, 2.7] } },
    kp: { base: [0.45, 0.47, 0.49, 0.5, 0.52, 0.53, 0.55, 0.56, 0.57, 0.58], role: { jungle: 0.1, support: 0.1 } },
    kda: { base: [2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.5, 3.6], role: { support: 0.4 } },
    gpm: { base: [330, 345, 360, 375, 390, 400, 410, 420, 425, 430], role: { support: -90, jungle: -15, adc: 20 } },
  };
  function bench(metric, role, tier) {
    const B = BENCH[metric], i = Math.max(0, TIERS.indexOf(tier));
    if (!B) return null;
    const adj = role ? B.role[role] : undefined;
    if (adj === null) return null; /* pas pertinent (ex. CS/min en support) */
    if (Array.isArray(adj)) return adj[i];
    const v = B.base[i];
    if (typeof adj === 'string' && adj[0] === 'x') return Math.round(v * +adj.slice(1) * 100) / 100;
    return Math.round((v + (adj || 0)) * 100) / 100;
  }
  /* Rang actuel (classée solo/duo, sinon flexible) et rang cible (le rang au-dessus, sauf choix manuel) */
  function myRank() {
    const L2 = (R.profile && R.profile.leagues) || [];
    const q = L2.find((l) => l.queueType === 'RANKED_SOLO_5x5') || L2.find((l) => l.queueType === 'RANKED_FLEX_SR');
    return q && TIERS.includes(q.tier) ? { tier: q.tier, div: ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(q.tier) ? '' : q.rank } : null;
  }
  function targetTier() {
    if (TIERS.includes(S.targetTier)) return S.targetTier;
    const r = myRank();
    if (!r) return 'BRONZE';
    return TIERS[Math.min(TIERS.length - 1, TIERS.indexOf(r.tier) + 1)];
  }
  /* Objectif propre à chaque rôle (« all » = tous rôles confondus) */
  const goalOf = (rk) => { if (!S.goals || typeof S.goals !== 'object') S.goals = {}; if (!S.goals.all && S.goal && S.goal.metric) S.goals.all = Object.assign({}, S.goal); return S.goals[rk] || {}; };
  const DEF_METRIC = (role) => (role === 'support' ? 'vision' : role === 'jungle' ? 'kp' : 'csm');
  function currentGoal(games, rk = S.progRole || 'all') {
    const role = rk === 'all' ? mainRoleOf(games) : rk;
    const g = goalOf(rk);
    const metric = METRICS[g.metric] ? g.metric : DEF_METRIC(role);
    const M = METRICS[metric];
    const tier = targetTier();
    const ref = bench(metric, role, tier);
    const custom = !!(g.metric === metric && g.custom && g.target);
    const target = custom ? g.target : ref != null ? ref : M.def;
    return { metric, M, target, rk, role, tier, ref, custom };
  }
  /* Tableau comparatif par rôle */
  function rolesTable(all) {
    const by = {}; all.forEach((g) => { const r = MATCH_ROLE[g.role]; if (r) (by[r] = by[r] || []).push(g); });
    const roles = ROLE_ORDER.filter((r) => by[r]);
    if (roles.length < 2) return '';
    const cols = ['csm', 'deaths', 'vision', 'kp', 'kda', 'gpm'];
    const best = {}; cols.forEach((k) => { const m = METRICS[k]; const v = roles.map((r) => avg(by[r].map(m.f))); best[k] = m.up ? Math.max(...v) : Math.min(...v); });
    return `<h3>🧭 Mes rôles comparés</h3><div class="rtable"><div class="rt-h"><span>Rôle</span><span>Parties</span><span>Victoires</span>${cols.map((k) => `<span>${METRICS[k].label}</span>`).join('')}</div>
      ${roles.map((r) => { const L2 = by[r]; const wr = L2.filter((g) => g.win).length / L2.length; return `<button class="rt-r ${S.progRole === r ? 'on' : ''}" data-act="progRole" data-val="${r}"><span>${ROLE_IC[r]} ${ROLE_NAME[r]}</span><span>${L2.length}</span><span class="${wr >= 0.5 ? 'pos' : 'neg'}">${Math.round(wr * 100)} %</span>${cols.map((k) => { const v = avg(L2.map(METRICS[k].f)); return `<span class="${Math.abs(v - best[k]) < 1e-9 ? 'top1' : ''}">${METRICS[k].fmt(v)}</span>`; }).join('')}</button>`; }).join('')}</div>
      <p class="small muted">Moyennes par rôle. En jaune : ton meilleur rôle pour chaque indicateur. Clique un rôle pour suivre sa progression.</p>`;
  }
  function progressCard() {
    if (R.histLoading && !R.hist) return '<div class="card"><h2>📈 Ma progression</h2><div class="loader small">Récupération de tes 40 dernières parties (la première fois peut prendre une minute)…</div></div>';
    if (R.histErr) return `<div class="card"><h2>📈 Ma progression</h2><p class="muted small">${esc(R.histErr)}</p></div>`;
    const ALL = (R.hist && R.hist.games) || [];
    if (ALL.length < 3) return '<div class="card"><h2>📈 Ma progression</h2><p class="muted small">Il faut au moins 3 parties sur la Faille de l\'invocateur pour suivre ta progression.</p></div>';
    /* Filtre par rôle */
    const cnt = {}; ALL.forEach((g) => { const r = MATCH_ROLE[g.role]; if (r) cnt[r] = (cnt[r] || 0) + 1; });
    if (S.progRole && !cnt[S.progRole]) S.progRole = '';
    const G = S.progRole ? ALL.filter((g) => MATCH_ROLE[g.role] === S.progRole) : ALL;
    const roleChips = `<div class="chips" style="margin:6px 0 8px"><button class="chip ${!S.progRole ? 'on' : ''}" data-act="progRole" data-val="">Tous les rôles <span class="muted">${ALL.length}</span></button>${ROLE_ORDER.filter((r) => cnt[r]).map((r) => `<button class="chip ${S.progRole === r ? 'on' : ''}" data-act="progRole" data-val="${r}">${ROLE_IC[r]} ${ROLE_NAME[r]} <span class="muted">${cnt[r]}</span></button>`).join('')}</div>`;
    if (G.length < 3) return `<div class="card"><h2>📈 Ma progression</h2>${roleChips}<p class="muted small">Seulement ${G.length} partie${G.length > 1 ? 's' : ''} dans ce rôle : il en faut au moins 3.</p>${rolesTable(ALL)}</div>`;
    const { metric, M, target, tier, ref, custom, role: gr } = currentGoal(G);
    const cur = myRank();
    const vals = G.map(M.f), last5 = vals.slice(-5), prev5 = vals.slice(-10, -5);
    const ok = (v) => (M.up ? v >= target : v <= target);
    const last10 = vals.slice(-10), reached = last10.filter(ok).length;
    const a5 = avg(last5);
    const prog = M.up ? Math.min(1, a5 / (target || 1)) : Math.min(1, (target || 1) / Math.max(0.01, a5));
    const ma = vals.map((_, i) => avg(vals.slice(Math.max(0, i - 4), i + 1)));
    const gRole = currentGoal(G).role, tT = targetTier();
    const refLine = (k, l) => { const r = bench(k, gRole, tT); if (r == null) return ''; const okR = METRICS[k].up ? l >= r : l <= r; return `<br><small class="${okR ? 'pos' : 'muted'}">${okR ? '✓ ' : ''}${TIER[tT]} : ${METRICS[k].fmt(r)}</small>`; };
    const trend = (k) => { const m = METRICS[k], v = G.map(m.f), l = avg(v.slice(-5)), p = avg(v.slice(-10, -5)); if (v.length < 6 || !p) return `<div><b>${m.fmt(l)}</b><span>${m.label}${refLine(k, l)}</span></div>`; const rise = l > p * 1.03, fall = l < p * 0.97, better = m.up ? rise : fall, worse = m.up ? fall : rise; return `<div><b>${m.fmt(l)} <small class="${better ? 'pos' : worse ? 'neg' : 'muted'}" title="${better ? 'en progrès' : worse ? 'en recul' : 'stable'}">${rise ? '▲' : fall ? '▼' : '='}</small></b><span>${m.label}<br><small class="muted">avant : ${m.fmt(p)}</small>${refLine(k, l)}</span></div>`; };
    let h = `<div class="card"><div class="row sp"><h2 style="margin:0">📈 Ma progression <span class="muted small">(${G.length} partie${G.length > 1 ? 's' : ''}${S.progRole ? ' en ' + ROLE_NAME[S.progRole] : ''} sur la Faille)</span></h2></div>
      ${roleChips}
      <p class="small muted">Moyenne de tes 5 dernières parties${S.progRole ? ' dans ce rôle' : ''}, comparée aux 5 d'avant.</p>
      <div class="kpis">${Object.keys(METRICS).map(trend).join('')}</div>
      <h3>🎯 Mon objectif${S.progRole ? ' en ' + ROLE_NAME[S.progRole] : ''}</h3>
      <div class="rankgoal"><span>Rang actuel : <b>${cur ? `${TIER[cur.tier]}${cur.div ? ' ' + cur.div : ''}` : 'non classé'}</b></span><span class="arrowr">→</span><span>Rang cible : <b class="tgtrank">${TIER[tier]}</b></span>
        <div class="chips">${TIERS.map((t) => `<button class="chip ${t === tier ? 'on' : ''} ${cur && TIERS.indexOf(t) <= TIERS.indexOf(cur.tier) ? 'dim' : ''}" data-act="targetTier" data-val="${t}">${TIER[t]}</button>`).join('')}${S.targetTier ? '<button class="chip" data-act="targetTier" data-val="">↺ rang suivant</button>' : ''}</div></div>
      <div class="chips">${Object.entries(METRICS).map(([k, m]) => `<button class="chip ${k === metric ? 'on' : ''}" data-act="goalMetric" data-val="${k}">${m.label}</button>`).join('')}</div>
      <div class="goal"><div class="row nw"><button class="btn ghost small" data-act="goalStep" data-val="-1">−</button><b class="gtarget">${M.up ? 'au moins' : 'au plus'} ${M.fmt(target)} ${esc(M.label.toLowerCase())}<small class="muted">${custom ? `valeur personnalisée${ref != null ? ` · repère ${TIER[tier]} : ${M.fmt(ref)}` : ''}` : ref != null ? `repère du rang ${TIER[tier]}${gr ? ' en ' + ROLE_NAME[gr] : ''}` : 'pas de repère pour ce rôle'}</small></b>${custom && ref != null ? '<button class="btn ghost small" data-act="goalReset">↺ repère</button>' : ''}<button class="btn ghost small" data-act="goalStep" data-val="1">+</button></div>
        <div class="grow"><div class="hbar"><i class="${prog >= 1 ? 'gld' : ''}" style="width:${Math.round(prog * 100)}%"></i></div>
        <span class="small">${prog >= 1 ? '✅ Objectif atteint en moyenne sur tes 5 dernières parties !' : `Moyenne actuelle : <b>${M.fmt(a5)}</b>`} · atteint dans <b>${reached}</b> de tes ${last10.length} dernières parties</span></div></div>
      ${lineChart([{ vals, cls: 'us', label: 'par partie' }, { vals: ma, cls: 'avg', label: 'moyenne sur 5 parties' }, { vals: vals.map(() => target), cls: 'tgt', label: 'objectif', dash: true }], { title: `${M.label}, partie par partie (de la plus ancienne à la plus récente)`, fmtY: M.fmt, tickEvery: 5, tickLabel: (i) => `#${i + 1}`, min0: true })}
      <div class="gdots">${G.map((g, i) => `<span class="${g.win ? 'w' : 'l'}" title="Partie ${i + 1} : ${g.win ? 'victoire' : 'défaite'} · ${esc((byKey(g.champ) || {}).name || '')} · ${M.label} ${M.fmt(vals[i])}"></span>`).join('')}</div>
      <p class="small muted">Les repères par rang sont des <b>estimations</b> de valeurs typiques (Riot ne publie pas de moyennes par rang) : sers-t'en comme d'un cap, pas comme d'une règle.</p>
      ${rolesTable(ALL)}</div>`;
    return h;
  }
  /* ---------- Mes champions : lesquels travailler en priorité ---------- */
  function poolCard() {
    const G = (R.hist && R.hist.games) || [];
    if (G.length < 3) return '';
    const by = {};
    for (const g of G) {
      const o = by[g.champ] || (by[g.champ] = { champ: g.champ, games: 0, wins: 0, k: 0, d: 0, a: 0, csm: 0, roles: {} });
      o.games++; if (g.win) o.wins++; o.k += g.k; o.d += g.d; o.a += g.a; o.csm += perMin(g.cs, g);
      const r = MATCH_ROLE[g.role]; if (r) o.roles[r] = (o.roles[r] || 0) + 1;
    }
    const L = Object.values(by).map((o) => Object.assign(o, { wr: o.wins / o.games, kda: (o.k + o.a) / Math.max(1, o.d), csm: o.csm / o.games, role: Object.keys(o.roles).sort((a, b) => o.roles[b] - o.roles[a])[0] || '',
      /* score prudent : taux de victoire « lissé » (+1 victoire / +2 parties), bonus si le KDA est bon et si tu l'as joué souvent */
      score: (o.wins + 1) / (o.games + 2) + Math.min(0.08, (((o.k + o.a) / Math.max(1, o.d)) - 2.5) * 0.02) + Math.min(0.06, o.games * 0.01) })).sort((a, b) => b.score - a.score);
    const picks = L.filter((o) => o.games >= 2).slice(0, 3);
    const avoid = L.filter((o) => o.games >= 3 && o.wr < 0.34);
    const row = (o) => { const c = byKey(o.champ); return `<div class="pool-row">${cIcon(c, 'ico sm')}<b class="ell">${esc(c ? c.name : '?')}</b><span class="small muted">${o.role ? ROLE_IC[o.role] + ' ' + ROLE_NAME[o.role] : ''}</span><span class="small">${o.games} partie${o.games > 1 ? 's' : ''}</span><span class="small ${o.wr >= 0.5 ? 'pos' : 'neg'}">${Math.round(o.wr * 100)} % V</span><span class="small">KDA ${f1(o.kda)}</span><span class="small">${f1(o.csm)} CS/min</span></div>`; };
    let h = `<div class="card"><h2>🎯 Mes champions <span class="muted small">(${G.length} dernières parties)</span></h2>`;
    if (picks.length) h += `<p class="small">👉 À travailler en priorité : ${picks.map((o) => `<b>${esc((byKey(o.champ) || {}).name || '?')}</b>`).join(', ')}. Ce sont tes meilleurs résultats sur plusieurs parties.</p>`;
    else h += '<p class="small muted">Joue au moins 2 parties avec un champion pour qu\'il puisse être conseillé.</p>';
    if (avoid.length) h += `<p class="small">⏸️ À mettre de côté pour l'instant : ${avoid.map((o) => `<b>${esc((byKey(o.champ) || {}).name || '?')}</b> (${o.wins} V / ${o.games - o.wins} D)`).join(', ')}.</p>`;
    if (L.length > 6) h += `<p class="small warn">Tu as joué ${L.length} champions différents en ${G.length} parties. En te concentrant sur 2 ou 3, tu progresseras plus vite : tu connaîtras mieux leurs combos et leurs match-ups.</p>`;
    h += `<div class="pool">${L.map(row).join('')}</div></div>`;
    return h;
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
    if (!R.hist && !R.histLoading && !R.histErr) loadHistory();
    h += progressCard() + poolCard();
    h += `<div class="cols"><div class="card"><h2>🏅 Mes meilleures maîtrises</h2><div class="grid-ic">${(P.mastery || []).map((m) => { const c = byKey(m.championId); return c ? tile(c, `<div class="price">Niv. ${m.championLevel} · ${nf(Math.round(m.championPoints / 1000))}k</div>`) : ''; }).join('')}</div></div>`;
    h += `<div class="card"><h2>🕹️ Mes dernières parties</h2>${(P.matches || []).length ? P.matches.map((m) => { const c = byKey(m.champ);
      return `<div class="match ${m.remake ? '' : m.win ? 'win' : 'loss'}" data-act="openMatch" data-val="${esc(m.id)}" title="Voir toutes les statistiques de la partie">${cIcon(c)}<div class="grow"><b>${m.remake ? 'Annulée' : m.win ? 'Victoire' : 'Défaite'}</b> <span class="muted small">${esc(QUEUE[m.queue] || 'Mode ' + m.queue)} · ${fmt(m.duration)}${MATCH_ROLE[m.role] ? ' · ' + ROLE_NAME[MATCH_ROLE[m.role]] : ''}</span>
        <div class="small">${m.k} / ${m.d} / ${m.a} · ${csm(m.cs, m.duration)} CS/min · vision ${m.vision}</div></div><div class="items">${m.items.map((i) => (i ? itIcon(i) : '<span class="ico sm ph"></span>')).join('')}</div></div>`; }).join('') : '<p class="muted">Aucune partie récente.</p>'}</div></div>`;
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
    h += myBuildsOnChamp(c);
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

  /* =====================================================================
     MES BUILDS : pages de runes et builds d'objets personnels
     Chaque build est associé à un champion et à un ou plusieurs rôles (aucun rôle = tous).
     Pages de runes → proposées à la sélection (application en un clic).
     Builds d'objets → utilisés en partie (prochain objet, annonce vocale).
     ===================================================================== */
  const SHARD_ROWS = [[5008, 5005, 5007], [5008, 5010, 5001], [5011, 5013, 5001]];
  const SHARD_ROW_NAME = ['Attaque', 'Flexible', 'Défense'];
  const uid = () => Math.random().toString(36).slice(2, 10);
  const newRunePage = (champ) => ({ id: uid(), name: '', champ: champ || '', roles: [], primary: 0, perks: [0, 0, 0, 0], sub: 0, subPerks: [], shards: [5008, 5008, 5011], spells: [4, 0], at: Date.now() });
  const newItemBuild = (champ) => ({ id: uid(), name: '', champ: champ || '', roles: [], start: [], core: [], boots: 0, situational: [], at: Date.now() });
  const runeComplete = (p) => !!(p.primary && p.perks.every(Boolean) && p.sub && p.subPerks.length === 2 && p.shards.every(Boolean));
  const forChamp = (list, champId, role) => list.filter((b) => b.champ === champId && (!role || !b.roles.length || b.roles.includes(role)));
  const rolesLabel = (b) => (b.roles.length ? b.roles.map((r) => ROLE_IC[r] + ' ' + ROLE_NAME[r]).join(', ') : 'Tous les rôles');
  function myRunePayload(p) {
    const c = D.champs[p.champ];
    return { key: 'my-' + p.id, name: `Noob LOL ${p.name || (c ? c.name : '')}`.trim().slice(0, 50), primaryStyleId: p.primary, subStyleId: p.sub, selectedPerkIds: [...p.perks, ...p.subPerks.map((x) => x.perk), ...p.shards].map(Number) };
  }
  function myRunePreview(p) {
    const ic = (id, big) => { const x = D.runeById[id]; return x ? `<img class="rimg ${big ? 'big' : ''}" title="${esc(x.name)}" alt="" src="${Dd.img.rune(x)}">` : ''; };
    const tr = (id) => { const t = D.treeById[id]; return t ? `<img class="rimg tree" title="${esc(t.name)}" alt="" src="${Dd.img.rune(t)}">` : ''; };
    return `<span class="rprev">${tr(p.primary)}${ic(p.perks[0], true)}${p.perks.slice(1).map((x) => ic(x)).join('')}${p.sub ? '<span class="rsep"></span>' + tr(p.sub) + p.subPerks.map((x) => ic(x.perk)).join('') : ''}</span>`;
  }
  const spellsOf = (p) => (p.spells || []).filter(Boolean);
  /* Plan d'achat d'un build perso, au format attendu par Builds.nextItem */
  const itemPlan = (b) => ({ core: [{ items: b.core.slice() }], boots: b.boots ? [{ item: b.boots }] : [], situational: [], later: b.situational.map((i) => ({ item: i })) });

  function viewMyBuilds() {
    const nd = needData(); if (nd) return '<h1>Mes builds</h1>' + nd;
    if (S.ed) return S.ed.kind === 'runes' ? editRunes() : editItems();
    const group = (list, kind) => {
      if (!list.length) return `<p class="muted">${kind === 'runes' ? 'Aucune page pour l\'instant. Crée tes pages : elles seront proposées en premier pendant la sélection, et un clic les appliquera dans le client.' : 'Aucun build pour l\'instant. Crée tes builds : en partie, Noob LOL t\'indiquera ton prochain objet et t\'annoncera quand tu as assez d\'or.'}</p>`;
      return list.slice().sort((a, b) => ((D.champs[a.champ] || {}).name || '').localeCompare((D.champs[b.champ] || {}).name || '', 'fr') || b.at - a.at).map((b) => {
        const c = D.champs[b.champ];
        const prev = kind === 'runes' ? myRunePreview(b) + (spellsOf(b).length ? `<span class="rsep"></span>${spellPair(spellsOf(b).map((x) => x).join(','))}` : '') : `<span class="row nw" style="gap:2px">${b.start.map((i) => itIcon(i)).join('')}${b.start.length ? '<span class="rsep"></span>' : ''}${b.core.map((i) => itIcon(i)).join('')}${b.boots ? '<span class="rsep"></span>' + itIcon(b.boots) : ''}</span>`;
        return `<div class="mb-row">${cIcon(c, 'ico')}<div class="grow"><b class="ell">${esc(b.name || (c ? c.name : '?'))}</b><span class="small muted ell">${esc(c ? c.name : 'Champion ?')} · ${rolesLabel(b)}${kind === 'runes' && !runeComplete(b) ? ' · ⚠️ incomplète' : ''}</span><div class="mb-prev">${prev}</div></div>
          <div class="row nw mb-act"><button class="chip" data-act="edOpen" data-kind="${kind}" data-val="${b.id}" title="Modifier">✏️</button><button class="chip" data-act="edDup" data-kind="${kind}" data-val="${b.id}" title="Dupliquer">⧉</button><button class="chip" data-act="edDel" data-kind="${kind}" data-val="${b.id}" title="Supprimer">🗑️</button></div></div>`;
      }).join('');
    };
    return `<h1>🧰 Mes builds</h1><p class="muted">Tes propres pages de runes et builds d'objets, rangés par champion et par rôle (sans rôle coché = valable pour tous les rôles).</p>
      <div class="cols"><div class="card"><div class="row sp nw"><h2 style="margin:0">✨ Mes pages de runes</h2><button class="btn small" data-act="edNew" data-kind="runes">＋ Nouvelle page</button></div><p class="small muted">Proposées en premier pendant la sélection · un clic les applique dans le client (avec tes sorts d'invocateur).</p>${group(S.myRunes, 'runes')}</div>
      <div class="card"><div class="row sp nw"><h2 style="margin:0">🛒 Mes builds d'objets</h2><button class="btn small" data-act="edNew" data-kind="items">＋ Nouveau build</button></div><p class="small muted">Utilisés en partie à la place du build conseillé : prochain objet, objets déjà achetés cochés, annonce vocale.</p>${group(S.myItems, 'items')}</div></div>`;
  }
  function edHeader(title) {
    const d = S.ed.draft;
    return `<div class="row sp"><h1>${title}</h1><div class="row"><button class="btn ghost small" data-act="edCancel">Annuler</button><button class="btn small" data-act="edSave">💾 Enregistrer</button></div></div>
      <div class="card"><div class="ed-grid"><div><label>Nom du build</label><input type="text" data-ed="name" value="${esc(d.name)}" placeholder="ex. Ahri burst, Ahri contre assassin…" maxlength="40"></div>
      <div><label>Champion</label><select data-ed="champ"><option value="">— Choisir —</option>${D.champList.map((x) => `<option value="${esc(x.id)}" ${x.id === d.champ ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></div></div>
      <label style="margin-top:8px">Rôles <span class="muted">(aucun = tous les rôles)</span></label><div class="chips">${ROLES.map((r) => `<button class="chip ${d.roles.includes(r) ? 'on' : ''}" data-act="edRole" data-val="${r}">${ROLE_IC[r]} ${ROLE_NAME[r]}</button>`).join('')}</div></div>`;
  }
  function editRunes() {
    const d = S.ed.draft;
    const runeBtn = (r, on, act, extra = '') => `<button class="rune ${on ? 'sel' : ''}" data-act="${act}" data-val="${r.id}" ${extra}><img alt="" src="${Dd.img.rune(r)}"><span>${esc(r.name)}</span></button>`;
    const P = D.treeById[d.primary], Sb = D.treeById[d.sub];
    let h = edHeader('✨ Page de runes');
    h += `<div class="cols"><div class="card"><h2>Voie principale</h2><div class="chips">${D.runes.map((t) => `<button class="chip ${d.primary === t.id ? 'on' : ''}" data-act="edTree" data-val="${t.id}"><img alt="" src="${Dd.img.rune(t)}" style="width:18px;height:18px;vertical-align:-4px"> ${esc(t.name)}</button>`).join('')}</div>
      ${P ? P.slots.map((sl, i) => `<div class="muted small" style="margin-top:8px">${i ? 'Ligne ' + i : 'Rune clé'}</div><div class="rune-row">${sl.runes.map((r) => runeBtn(r, d.perks[i] === r.id, 'edPerk', `data-row="${i}"`)).join('')}</div>`).join('') : '<p class="muted small">Choisis une voie.</p>'}</div>`;
    h += `<div><div class="card"><h2>Voie secondaire <span class="muted small">(2 runes de lignes différentes)</span></h2><div class="chips">${D.runes.filter((t) => t.id !== d.primary).map((t) => `<button class="chip ${d.sub === t.id ? 'on' : ''}" data-act="edSub" data-val="${t.id}"><img alt="" src="${Dd.img.rune(t)}" style="width:18px;height:18px;vertical-align:-4px"> ${esc(t.name)}</button>`).join('')}</div>
      ${Sb ? Sb.slots.slice(1).map((sl, i) => `<div class="muted small" style="margin-top:8px">Ligne ${i + 1}</div><div class="rune-row">${sl.runes.map((r) => runeBtn(r, d.subPerks.some((x) => x.perk === r.id), 'edSubPerk', `data-row="${i + 1}"`)).join('')}</div>`).join('') : '<p class="muted small">Choisis une voie secondaire.</p>'}</div>
      <div class="card"><h2>Fragments</h2>${SHARD_ROWS.map((row, i) => `<div class="row" style="margin:4px 0"><span class="small muted" style="width:70px">${SHARD_ROW_NAME[i]}</span>${row.map((sh) => `<button class="chip ${d.shards[i] === sh ? 'on' : ''}" data-act="edShard" data-row="${i}" data-val="${sh}">${esc(SHARD[sh])}</button>`).join('')}</div>`).join('')}</div>
      <div class="card"><h2>Sorts d'invocateur <span class="muted small">(2)</span></h2><div class="chips">${D.summList.map((x) => `<button class="chip ${d.spells.includes(+x.key) ? 'on' : ''}" data-act="edSpell" data-val="${x.key}"><img alt="" src="${Dd.img.spell(x)}" style="width:18px;height:18px;vertical-align:-4px;border-radius:4px"> ${esc(x.name)}</button>`).join('')}</div></div>
      <div class="card"><h2>Aperçu</h2>${myRunePreview(d)}<p class="small ${runeComplete(d) ? 'pos' : 'warn'}" style="margin-top:6px">${runeComplete(d) ? '✅ Page complète' : '⚠️ Page incomplète : rune clé, 3 runes principales, 2 secondaires et 3 fragments nécessaires pour l\'appliquer.'}</p></div></div></div>`;
    return h;
  }
  const ED_SECS = [['start', '1. Départ'], ['core', '2. Objets principaux (dans l\'ordre)'], ['boots', 'Bottes'], ['situational', '3. Situationnels']];
  function edItemGrid() {
    const e = S.ed, q = norm(e.itQ || '');
    const boots = e.sec === 'boots';
    const list = D.itemList.filter((it) => {
      if (boots) return Builds.isBoots(it);
      if (q && !norm(it.name).includes(q) && !(it.colloq && norm(it.colloq).includes(q))) return false;
      if (e.sec === 'start') return it.gold.total <= 600;
      if (e.itTag === '_final') return Builds.isLegendary(it);
      return !e.itTag || (it.tags || []).includes(e.itTag);
    });
    return list.length ? `<div class="grid-ic">${list.map((it) => `<button class="tile" data-act="edAdd" data-val="${it.id}"><img loading="lazy" alt="" src="${Dd.img.item(it)}">${esc(it.name)}<div class="price">${it.gold.total} 🪙</div></button>`).join('')}</div>` : '<div class="empty">Aucun objet.</div>';
  }
  function editItems() {
    const d = S.ed.draft, e = S.ed;
    let h = edHeader('🛒 Build d\'objets');
    const lists = { start: d.start, core: d.core, boots: d.boots ? [d.boots] : [], situational: d.situational };
    const cost = d.core.reduce((s2, i) => s2 + ((D.items[String(i)] || { gold: { total: 0 } }).gold.total), 0) + (d.boots ? (D.items[String(d.boots)] || { gold: { total: 0 } }).gold.total : 0);
    h += '<div class="cols"><div class="card"><h2>Mon build</h2>';
    h += ED_SECS.map(([k, lb]) => `<div class="edsec ${e.sec === k ? 'on' : ''}" data-act="edSec" data-val="${k}"><div class="row sp nw"><b class="small">${lb}</b><span class="small muted">${e.sec === k ? '◀ clique un objet à droite' : 'choisir'}</span></div>
      <div class="row" style="gap:6px;margin-top:4px">${lists[k].length ? lists[k].map((id, i) => `<span class="edit-it">${itIcon(id, 'ico')}<span class="eia">${k !== 'boots' && i > 0 ? `<button data-act="edMv" data-sec="${k}" data-i="${i}" data-val="-1" title="Avancer">◀</button>` : ''}<button data-act="edRm" data-sec="${k}" data-i="${i}" title="Retirer">✕</button></span></span>`).join('') : '<span class="muted small">—</span>'}</div></div>`).join('');
    h += `<p class="small muted" style="margin-top:8px">Coût des objets principaux + bottes : <b>${nf(cost)}</b> po. En partie, Noob LOL suit cet ordre : principaux, bottes, puis situationnels.</p></div>`;
    h += `<div class="card"><h2>Ajouter des objets <span class="muted small">→ ${esc((ED_SECS.find((x) => x[0] === e.sec) || ['', ''])[1])}</span></h2>
      ${e.sec !== 'boots' ? `<input type="search" data-ed="itQ" placeholder="🔎 Rechercher un objet…" value="${esc(e.itQ || '')}" autocomplete="off">` : ''}
      ${e.sec === 'core' || e.sec === 'situational' ? `<div class="chips" style="margin:6px 0">${ITAG.filter(([t]) => t !== '_start' && t !== 'Consumable' && t !== 'Boots').map(([t, l]) => `<button class="chip ${(e.itTag || '') === t ? 'on' : ''}" data-act="edTag" data-val="${t}">${l}</button>`).join('')}</div>` : ''}
      <div id="edgrid" style="margin-top:8px">${edItemGrid()}</div></div></div>`;
    return h;
  }
  /* Bloc « Mes builds » sur la fiche d'un champion */
  function myBuildsOnChamp(c) {
    const r = forChamp(S.myRunes, c.id), it = forChamp(S.myItems, c.id);
    return `<div class="card"><div class="row sp nw"><h2 style="margin:0">🧰 Mes builds</h2><div class="row nw"><button class="chip" data-act="edNew" data-kind="runes" data-champ="${esc(c.id)}">＋ Runes</button><button class="chip" data-act="edNew" data-kind="items" data-champ="${esc(c.id)}">＋ Objets</button></div></div>
      ${r.length + it.length ? r.map((b) => `<div class="mb-mini" data-act="edOpen" data-kind="runes" data-val="${b.id}">✨ <b>${esc(b.name || 'Page de runes')}</b> <span class="small muted">${rolesLabel(b)}</span> ${myRunePreview(b)}</div>`).join('') + it.map((b) => `<div class="mb-mini" data-act="edOpen" data-kind="items" data-val="${b.id}">🛒 <b>${esc(b.name || 'Build')}</b> <span class="small muted">${rolesLabel(b)}</span> <span class="row nw" style="gap:2px">${b.core.map((i) => itIcon(i)).join('')}</span></div>`).join('') : '<p class="small muted">Aucun build perso pour ce champion.</p>'}</div>`;
  }
  /* Bloc « Mes builds » pendant la sélection */
  function myBuildsSelect(sd) {
    const c = byKey(sd.myChamp); if (!c) return '';
    const r = forChamp(S.myRunes, c.id, sd.myRole), it = forChamp(S.myItems, c.id, sd.myRole);
    if (!r.length && !it.length) return '';
    const canApply = !!(NB && sd.live);
    let h = `<div class="card gold"><div class="row sp nw"><h2 style="margin:0">⭐ Mes builds · ${esc(c.name)}</h2><span class="small muted">${sd.myRole ? ROLE_NAME[sd.myRole] : ''}</span></div>`;
    h += r.map((b) => { const done = R.applied.runes === 'my-' + b.id; const ok = runeComplete(b);
      return `<button class="rbtn ${done ? 'done' : ''}" ${canApply && ok ? `data-act="applyMyRunes" data-val="${b.id}"` : 'disabled'}><div class="row sp nw"><span class="small"><b>${esc(b.name || 'Ma page')}</b> · ${rolesLabel(b)}</span><span class="small apply">${done ? '✅ Appliquée' : !ok ? '⚠️ incomplète' : canApply ? '⤴ Appliquer runes' + (spellsOf(b).length === 2 ? ' + sorts' : '') : ''}</span></div><div class="rpage">${myRunePreview(b)}${spellsOf(b).length ? '<span class="rsep"></span>' + spellPair(spellsOf(b).join(',')) : ''}</div></button>`; }).join('');
    if (it.length) {
      const sel = it.find((b) => b.id === S.selItems[c.id]) || it[0];
      h += `<p class="small" style="margin:8px 0 4px">🛒 Build d'objets suivi en partie <span class="muted">(affiché dans l'écran « En jeu » et dans l'encart par-dessus le jeu)</span> :</p><div class="chips">${it.map((b) => `<button class="chip ibsel ${b.id === sel.id ? 'on' : ''}" data-act="selItemBuild" data-val="${esc(b.id)}" data-champ="${esc(c.id)}">${b.id === sel.id ? '✅ ' : ''}<b>${esc(b.name || 'Build perso')}</b> <span class="row nw" style="gap:2px">${b.core.map((i) => itIcon(i, 'ico sm')).join('')}</span></button>`).join('')}</div>`;
    }
    return h + '</div>';
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
  /* Filtres combinables de l'onglet Objets : type (un seul), statistiques (plusieurs : toutes ou au moins une), prix, tri */
  const ITYPE = [['', 'Tous'], ['_start', 'Départ'], ['_final', 'Objets finaux'], ['Boots', 'Bottes'], ['Consumable', 'Consommables']];
  const ISTAT = [['Damage', 'Dégâts (AD)'], ['SpellDamage', 'Puissance (AP)'], ['AttackSpeed', 'Vitesse d\'attaque'], ['CriticalStrike', 'Critique'], ['OnHit', 'À l\'impact'], ['ArmorPenetration', 'Létalité / pénétr. armure'], ['MagicPenetration', 'Pénétr. magique'],
    ['Health', 'Vie'], ['Armor', 'Armure'], ['SpellBlock', 'Résist. magique'], ['AbilityHaste', 'Accélération'], ['LifeSteal', 'Vol de vie'], ['SpellVamp', 'Omnivampirisme'], ['HealthRegen', 'Régén. PV'], ['Mana', 'Mana'], ['ManaRegen', 'Régén. mana'],
    ['NonbootsMovement', 'Vitesse'], ['Tenacity', 'Ténacité'], ['Active', 'Actif'], ['Aura', 'Aura'], ['Vision', 'Vision']];
  const IPRICE = [['lt1000', '< 1 000'], ['1000-2500', '1 000 – 2 500'], ['2500-3000', '2 500 – 3 000'], ['gt3000', '> 3 000']];
  const hasTag = (it, t) => { const tags = it.tags || []; return t === 'AbilityHaste' ? tags.includes('AbilityHaste') || tags.includes('CooldownReduction') : tags.includes(t); };
  const priceOk = (it, p) => { const g = it.gold.total; return !p || (p === 'lt1000' ? g < 1000 : p === '1000-2500' ? g >= 1000 && g <= 2500 : p === '2500-3000' ? g > 2500 && g <= 3000 : g > 3000); };
  function itemMatches() {
    const f = S.itf, q = norm(f.q), stats = f.stats || [];
    const list = D.itemList.filter((it) => {
      if (q && !norm(it.name).includes(q) && !norm(it.plaintext).includes(q) && !(it.colloq && norm(it.colloq).includes(q))) return false;
      if (stats.length && !(f.any ? stats.some((t) => hasTag(it, t)) : stats.every((t) => hasTag(it, t)))) return false;
      if (!priceOk(it, f.price)) return false;
      if (!f.tag) return true;
      if (f.tag === '_start') return (it.tags || []).some((t) => t === 'Lane' || t === 'Jungle' || t === 'GoldPer') && it.gold.total <= 600 && !it.from;
      if (f.tag === '_final') return isLegendary(it);
      return (it.tags || []).includes(f.tag);
    });
    if (f.sort === 'price-desc') list.sort((a, b) => b.gold.total - a.gold.total);
    else if (f.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    return list;
  }
  function itemGrid() { const l = itemMatches(); return l.length ? `<p class="muted small">${l.length} objet${l.length > 1 ? 's' : ''} · triés ${({ 'price-desc': 'du plus cher au moins cher', name: 'par nom' })[S.itf.sort] || 'du moins cher au plus cher'}</p><div class="grid-ic">${l.map((it) => `<button class="tile" data-act="item" data-val="${esc(it.id)}"><img loading="lazy" alt="" src="${Dd.img.item(it)}">${esc(it.name)}<div class="price">${it.gold.total} 🪙</div></button>`).join('')}</div>` : '<div class="empty">Aucun objet ne correspond.</div>'; }
  function itemFilters() {
    const f = S.itf, stats = f.stats || [];
    const active = !!(f.tag || stats.length || f.price);
    return `<div class="ifilters card">
      <div class="frow"><span class="small muted">Type</span><div class="chips">${ITYPE.map(([t, l]) => `<button class="chip ${(f.tag || '') === t ? 'on' : ''}" data-act="itag" data-val="${t}">${l}</button>`).join('')}</div></div>
      <div class="frow"><span class="small muted">Statistiques</span><div class="chips">${ISTAT.map(([t, l]) => `<button class="chip ${stats.includes(t) ? 'on' : ''}" data-act="istat" data-val="${t}">${stats.includes(t) ? '✓ ' : ''}${l}</button>`).join('')}</div></div>
      ${stats.length > 1 ? `<div class="frow"><span class="small muted">Combiner</span><div class="chips"><button class="chip ${!f.any ? 'on' : ''}" data-act="iany" data-val="0">Toutes ces stats</button><button class="chip ${f.any ? 'on' : ''}" data-act="iany" data-val="1">Au moins une</button></div></div>` : ''}
      <div class="frow"><span class="small muted">Prix</span><div class="chips">${IPRICE.map(([t, l]) => `<button class="chip ${f.price === t ? 'on' : ''}" data-act="iprice" data-val="${t}">${l} 🪙</button>`).join('')}</div></div>
      <div class="frow"><span class="small muted">Trier</span><div class="chips">${[['price', 'Prix ↑'], ['price-desc', 'Prix ↓'], ['name', 'Nom']].map(([t, l]) => `<button class="chip ${(f.sort || 'price') === t ? 'on' : ''}" data-act="isort" data-val="${t}">${l}</button>`).join('')}${active ? '<button class="chip danger" data-act="ireset">✕ Effacer les filtres</button>' : ''}</div></div></div>`;
  }
  function viewItems() {
    if (S.view.item) return viewItem(S.view.item);
    const nd = needData(); if (nd) return '<h1>Objets</h1>' + nd;
    return `<div class="search"><input type="search" placeholder="🔎 Rechercher un objet…" value="${esc(S.itf.q)}" data-in="itf.q" autocomplete="off"></div>
      ${itemFilters()}
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
  /* Ma lane : choisie dans l'appli > attribuée par le client > déduite du champion (rôle le plus joué) */
  function detectRole(assigned, champKey) {
    if (S.select.role) return [S.select.role, 'manual'];
    if (assigned) return [assigned, 'client'];
    if (champKey) {
      const main = NB ? cached('main:' + champKey, () => NB.stats.mainRole(champKey)) : '';
      const c = byKey(champKey);
      const guess = main || (c ? beginnerRole(c.id) : '');
      if (guess) return [guess, 'guess'];
    }
    return ['', ''];
  }
  /* Profil AD / AP d'un champion (sans objets : d'après ses caractéristiques Riot) */
  /* Type de dégâts du champion : officiel (données Riot du client : physique / magique / mixte), sinon estimé */
  const DMG_Q = new Set(); let dmgTimer = 0;
  function wantDmg(key) {
    if (!NB || !NB.champ || !key || (R.dmg && key in R.dmg) || DMG_Q.has(key)) return;
    DMG_Q.add(key);
    clearTimeout(dmgTimer);
    dmgTimer = setTimeout(() => {
      const keys = [...DMG_Q]; DMG_Q.clear();
      NB.champ.damage(keys).then((m) => { R.dmg = Object.assign(R.dmg || {}, m || {}); keys.forEach((k) => { if (!(k in R.dmg)) R.dmg[k] = null; }); soon(); })
        .catch(() => { keys.forEach((k) => { R.dmg[k] = null; }); });
    }, 60);
  }
  function dmgOf(c) {
    if (!c) return { t: '', official: false };
    if (!R.dmg) R.dmg = {};
    wantDmg(c.key);
    const o = R.dmg[c.key];
    if (o) return { t: o, official: true };
    const a = c.info.attack || 0, m = c.info.magic || 0;
    let v = a + m > 0 ? a / (a + m) : c.tags.includes('Marksman') ? 0.85 : c.tags.includes('Mage') ? 0.15 : 0.5;
    return { t: v >= 0.62 ? 'AD' : v <= 0.38 ? 'AP' : 'MIXED', official: false };
  }
  const champAd = (c) => { if (!c) return 0.5; const d = dmgOf(c); if (d.official) return d.t === 'AD' ? 0.85 : d.t === 'AP' ? 0.15 : 0.5; const a = c.info.attack || 0, m = c.info.magic || 0; return a + m > 0 ? (a + 0.01) / (a + m + 0.02) : d.t === 'AD' ? 0.85 : d.t === 'AP' ? 0.15 : 0.5; };
  const DMG_FR = { AD: 'AD', AP: 'AP', MIXED: 'Mixte' };
  const dmgTag = (c) => { const d = dmgOf(c); return d.t ? `<span class="dt ${d.t.toLowerCase()}" title="${d.official ? 'Type de dégâts officiel (Riot)' : 'Type de dégâts estimé'}">${d.t === 'AD' ? '⚔️' : d.t === 'AP' ? '🔮' : '⚔️🔮'} ${DMG_FR[d.t]}${d.official ? '' : ' ?'}</span>` : ''; };
  const ROLE_ORDER = ['top', 'jungle', 'mid', 'support', 'adc'];
  function selectionData() {
    const cs = R.lcu.champSelect;
    let allies, enemyKeys, enemyFixed = {}, bans = [], me = null, live = false;
    if (cs) {
      live = true; me = cs.myTeam.find((p) => p.isMe) || null;
      allies = cs.myTeam.map((p) => Object.assign({}, p));
      enemyKeys = cs.theirTeam.map((p) => p.champ).filter(Boolean);
      cs.theirTeam.forEach((p) => { if (p.champ && p.role) enemyFixed[p.champ] = p.role; });
      wantInfo(cs.myTeam.map((p) => p.puuid).concat(cs.theirTeam.map((p) => p.puuid)));
      bans = cs.bans;
    } else {
      const meC = D.champs && D.champs[S.select.manualMe];
      me = { champ: meC ? +meC.key : 0, role: '', isMe: true, locked: false, spells: [0, 0] };
      allies = [me];
      enemyKeys = S.select.manualEnemies.map((id) => (D.champs && D.champs[id] ? +D.champs[id].key : 0)).filter(Boolean);
    }
    const myChamp = me && me.champ ? me.champ : 0;
    const allKeys = allies.map((p) => p.champ).concat(enemyKeys).filter(Boolean);
    const dist = NB && allKeys.length ? cached('rd:' + allKeys.slice().sort().join(','), () => NB.stats.roleDist(allKeys)) : {};
    const allyFixed = {};
    allies.forEach((p) => { if (p.champ && p.role) allyFixed[p.champ] = p.role; });
    if (S.select.role && myChamp) allyFixed[myChamp] = S.select.role;
    const allyRoles = Builds.assignRoles(allies.map((p) => p.champ).filter(Boolean), D, dist || {}, allyFixed);
    const enemyRoles = Builds.assignRoles(enemyKeys, D, dist || {}, enemyFixed);
    let myRole = S.select.role || (me && me.role) || (myChamp ? allyRoles[myChamp] : '') || '';
    const roleSrc = S.select.role ? 'manual' : me && me.role ? 'client' : myRole ? 'guess' : '';
    if (!live && !myRole) myRole = 'mid';
    allies.forEach((p) => { p.r = p.role || (p.champ ? allyRoles[p.champ] : '') || ''; });
    const enemyPuuid = {}; if (cs) cs.theirTeam.forEach((p) => { if (p.champ) enemyPuuid[p.champ] = p.puuid || ''; });
    return { live, cs, me, myRole, roleSrc, allies, enemies: enemyKeys, enemyRoles, enemyFixed, enemyPuuid, bans, myChamp, locked: !!(me && me.locked) };
  }
  /* Adversaire de voie : celui que tu as désigné, sinon l'ennemi dont le rôle estimé est le tien */
  function laneOpponent(sd) {
    if (S.select.opp && sd.enemies.includes(+S.select.opp)) return +S.select.opp;
    if (!sd.myRole) return 0;
    return sd.enemies.find((k) => sd.enemyRoles[k] === sd.myRole) || 0;
  }
  /* Face-à-face par rôle : top / jungle / mid / support / adc */
  function faceOff(sd, opp) {
    const rows = ROLE_ORDER.map((r) => ({ r, ally: null, enemy: 0 }));
    const leftovers = [];
    sd.allies.forEach((p) => { const row = rows.find((x) => x.r === p.r && !x.ally); if (row) row.ally = p; else leftovers.push(p); });
    leftovers.forEach((p) => { const row = rows.find((x) => !x.ally); if (row) row.ally = p; });
    const eLeft = [];
    sd.enemies.forEach((k) => { const row = rows.find((x) => x.r === sd.enemyRoles[k] && !x.enemy); if (row) row.enemy = k; else eLeft.push(k); });
    eLeft.forEach((k) => { const row = rows.find((x) => !x.enemy); if (row) row.enemy = k; });
    const teamAd = (keys) => { const cs2 = keys.map(byKey).filter(Boolean); return cs2.length ? cs2.reduce((s2, c) => s2 + champAd(c), 0) / cs2.length : null; };
    const aAd = teamAd(sd.allies.map((p) => p.champ).filter(Boolean)), eAd = teamAd(sd.enemies);
    const cell = (c, cls, extra, attrs, rank) => `<div class="vs-cell ${cls}" ${attrs || ''}>${cIcon(c, 'ico')}<div class="grow"><div class="vs-name"><b class="ell">${c ? esc(c.name) : '…'}</b>${extra || ''}</div>${rank ? `<div class="vs-rank">${rank}</div>` : ''}${c ? dmgTag(c) : ''}</div></div>`;
    let h = `<div class="card vs"><div class="vs-row vs-head"><div class="vs-cell ally"><div class="grow"><b>🟦 Mon équipe</b>${aAd != null ? dmgBar(aAd) : ''}</div></div><div class="vs-role"></div><div class="vs-cell enemy"><div class="grow"><b>🟥 Adversaires</b>${eAd != null ? dmgBar(eAd) : ''}</div></div></div>`;
    h += rows.map((x) => {
      const a = x.ally, ac = a ? byKey(a.champ) : null, ec = x.enemy ? byKey(x.enemy) : null;
      const mine = a && a.isMe;
      const aTag = a ? `${a.isMe ? '<span class="tag gold">Toi</span>' : ''}${a.intent ? '<span class="muted small">intention</span>' : ''}${a.champ && !a.locked && !a.intent && sd.live ? '<span class="muted small">survol</span>' : ''}` : '';
      const guessed = ec && !sd.enemyFixed[x.enemy];
      const eTag = `${ec && +ec.key === opp ? '<span class="tag gold">adversaire</span>' : ''}${guessed ? '<span class="muted small" title="Rôle estimé d\'après les statistiques et la classe du champion">estimé</span>' : ''}`;
      const aRank = a && sd.live ? `${a.name ? `<span class="muted ell">${esc(a.name)}</span>` : ''}${rankTag(a.puuid)}` : '';
      const eRank = ec && sd.live ? rankTag(sd.enemyPuuid[x.enemy], !sd.enemyPuuid[x.enemy]) : '';
      return `<div class="vs-row ${mine ? 'me' : ''}">${cell(ac, 'ally', aTag, '', aRank)}<div class="vs-role" title="${ROLE_NAME[x.r]}">${ROLE_IC[x.r]}<span>${ROLE_NAME[x.r]}</span></div>${cell(ec, 'enemy' + (ec && +ec.key === opp ? ' opp' : ''), eTag, ec ? `data-act="selOpp" data-val="${ec.key}" title="Désigner comme adversaire de voie"` : '', eRank)}</div>`;
    }).join('');
    if (sd.bans.length) h += `<div class="row" style="margin-top:8px"><span class="muted small">🚫 Bannis :</span>${sd.bans.map((k) => cIcon(byKey(k), 'ico sm ban')).join('')}</div>`;
    return h + '</div>';
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
    if (sd.live && sd.myChamp) S.lastPick = { champ: sd.myChamp, role, opp, enemies: sd.enemies };
    let h = '';
    if (sd.live) {
      const t = sd.cs.timer;
      const left = t ? Math.max(0, t.left - Math.round((Date.now() - t.at) / 1000)) : 0;
      const TPH = { PLANNING: 'Déclaration des intentions', BAN_PICK: 'Bannissements et choix', FINALIZATION: 'Finalisation (runes et sorts)', GAME_STARTING: 'La partie démarre' };
      h += `<div class="row sp"><h1>🎯 Sélection en cours</h1><span class="pill on big">${esc(TPH[t && t.phase] || 'Sélection')}${t ? ` · <b data-sel-left="${t.at + t.left * 1000}">${left}</b> s` : ''}</span></div>`;
    } else {
      h += `<h1>🎯 Sélection des champions</h1><div class="card"><p>${NB ? (R.lcu.connected ? 'Tu n\'es pas en sélection. Dès qu\'une partie est trouvée, Noob LOL bascule ici tout seul.' : 'Lance le client League of Legends : dès que la sélection commence, Noob LOL bascule ici tout seul.') : 'Dans l\'application PC, cet écran se remplit tout seul pendant la sélection.'}</p>
        <details class="flat"><summary class="small">Simuler une sélection</summary>${(() => { const opts = (sel) => `<option value="">—</option>${D.champList.map((x) => `<option value="${esc(x.id)}" ${x.id === sel ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}`;
          return `<label>Mon champion</label><select data-sel="me">${opts(S.select.manualMe)}</select><label style="margin-top:8px">Champions adverses</label><div class="grid g2">${S.select.manualEnemies.map((id, i) => `<select data-sel="enemy" data-i="${i}">${opts(id)}</select>`).join('')}</div>`; })()}</details></div>`;
    }
    h += `<div class="card"><div class="row"><b>Mon rôle :</b>${ROLES.map((r) => `<button class="chip ${role === r ? 'on' : ''}" data-act="selRole" data-val="${r}">${ROLE_IC[r]} ${ROLE_NAME[r]}</button>`).join('')}
      ${S.select.role ? `<button class="chip" data-act="selRole" data-val="">↩ Détection automatique</button>` : (role ? `<span class="muted small">Rôle ${ROLE_SRC[sd.roleSrc] || ''}</span>` : '<span class="muted small">Rôle pas encore détecté</span>')}</div></div>`;
    h += '<div class="cols"><div>';
    h += faceOff(sd, opp);
    if (opp) { const oc = byKey(opp); const f = needFull(oc.id); if (f) h += tipsCards(f, 'enemy'); }
    if (!sd.locked) {
      const sug = suggestions(sd, opp);
      h += `<div class="card"><h2>💡 Champions conseillés ${role ? 'en ' + ROLE_NAME[role] : ''}${opp ? ' contre ' + esc(byKey(opp).name) : ''}</h2>`;
      if (!role) h += '<p class="muted">Choisis ton rôle ci-dessus.</p>';
      else if (!sug || !sug.length) h += '<div class="loader small">Calcul…</div>';
      else h += sug.map((o) => { const c = byKey(o.k); return `<button class="sug" data-act="champ" data-val="${esc(c.id)}">${cIcon(c, 'ico lg')}<div class="grow"><b>${esc(c.name)}</b><div class="small muted">${o.why.slice(0, 3).join(' · ') || 'Choix sûr pour ce rôle'}</div></div></button>`; }).join('')
        + '<p class="muted small">👉 Clique toi-même sur le champion dans le client du jeu.</p>';
      h += '</div>';
    }
    h += '</div><div>';
    if (sd.myChamp) h += myBuildsSelect(sd) + pickPanel(sd, opp);
    else h += '<div class="card"><p class="muted">Survole ou choisis ton champion dans le client : ses runes, sorts et objets conseillés apparaîtront ici.</p></div>';
    h += '</div></div>';
    return h;
  }
  /* ---------- Mon champion : runes et kit d'objets adaptés ---------- */
  const ROLE_SRC = { client: 'attribuée par le client', manual: 'choisie dans Noob LOL', guess: 'déduite de ton champion' };
  const wr = (o) => `<span class="${o.wins / o.games >= 0.5 ? 'pos' : 'neg'}">${pct(o.wins, o.games)}</span> <span class="muted">· ${nf(o.games)}</span>`;
  const itemsRow = (list) => list.map((id) => `<span class="itm" data-act="item" data-val="${id}">${itIcon(id, 'ico')}</span>`).join('');
  const pageKey = (r) => r.runes + '#' + r.shards;
  function runePayload(r, c, role) {
    const [pri, sub] = String(r.runes || '').split('|');
    const [pt, pr] = (pri || '').split(':'), [st, sr] = (sub || '').split(':');
    return { key: pageKey(r), name: `Noob LOL ${c.name} ${ROLE_NAME[role] || ''}`.trim(), primaryStyleId: +pt, subStyleId: +st,
      selectedPerkIds: [].concat(String(pr || '').split(','), String(sr || '').split(','), String(r.shards || '').split(',')).filter(Boolean).map(Number) };
  }
  function pickPanel(sd, opp) {
    const c = byKey(sd.myChamp); if (!c) return '';
    const role = sd.myRole;
    const oc = opp ? byKey(opp) : null;
    let h = `<div class="card gold"><div class="row nw">${cIcon(c, 'ico lg')}<div class="grow"><h2 style="margin:0">${esc(c.name)} ${role ? 'en ' + ROLE_IC[role] + ' ' + ROLE_NAME[role] : ''}</h2>
      <span class="muted small">${sd.locked ? '🔒 Champion verrouillé' : '👆 Champion survolé'}${role ? ` · lane ${ROLE_SRC[sd.roleSrc] || ''}` : ''}${oc ? ` · adversaire : <b>${esc(oc.name)}</b>` : ''}</span></div><button class="btn ghost small" data-act="champ" data-val="${esc(c.id)}">Fiche</button></div>`;
    if (!NB) return h + '<p class="muted small">Les builds viennent des statistiques de l\'application PC.</p></div>';
    if (!role) return h + '<p class="muted small">Choisis ta lane ci-dessus pour voir les builds.</p></div>';
    const mu = opp ? cached(`mu:${c.key}:${opp}:${role}`, () => NB.stats.matchup(+c.key, opp, role, 30)) : null;
    if (mu && mu.games) h += `<p class="tip" style="margin-top:8px">Contre <b>${esc(oc.name)}</b> : <b class="${mu.wins / mu.games >= 0.5 ? 'pos' : 'neg'}">${pct(mu.wins, mu.games)}</b> de victoires sur ${mu.games} parties analysées.</p>`;
    const rows = cached(`builds:${c.key}:${role}`, () => NB.stats.builds(+c.key, role, 30));
    if (rows === undefined) return h + '<div class="loader small">Calcul des builds…</div></div>';
    if (!rows || !rows.length) return h + `<p class="muted small">Pas encore de parties analysées pour ${esc(c.name)} en ${ROLE_NAME[role]}. Les runes « recommandées » du client sont un bon choix. ${R.col && R.col.running ? 'Le collecteur tourne : reviens plus tard.' : 'Démarre le collecteur dans les Réglages.'}</p></div>`;
    const A = Builds.analyze(rows, D, { opp, enemies: sd.enemies });
    h += `<div class="kpis"><div><b>${pct(A.wins, A.games)}</b><span>victoires</span></div><div><b>${nf(A.games)}</b><span>parties analysées</span></div><div><b>${oc ? nf(A.vsGames) : '—'}</b><span>${oc ? 'contre ' + esc(oc.name) : 'adversaire inconnu'}</span></div></div></div>`;

    /* Runes */
    const ctx = (vs, n) => (oc ? (vs ? `<span class="tag gold">contre ${esc(oc.name)} · ${n} parties</span>` : `<span class="tag">général · seulement ${A.vsGames} partie${A.vsGames > 1 ? 's' : ''} contre ${esc(oc.name)}</span>`) : '<span class="tag">général</span>');
    if (A.adapted) h = h.replace('</div></div>', '</div></div>') + `<p class="tip adapt">🎯 Runes et objets adaptés ${oc ? `au match-up contre <b>${esc(oc.name)}</b>` : ''}${oc && A.team ? ' et ' : ''}${A.team ? 'à la composition de l\'équipe adverse' : ''}.</p>`;
    h += `<div class="card"><div class="row sp"><h2 style="margin:0">✨ Runes et sorts</h2>${ctx(A.runesVs, A.vsGames)}</div>`;
    const canApply = !!(NB && sd.live);
    R.selPages = A.runes.slice(0, 3).map((r) => runePayload(r, c, role));
    R.selSpells = (A.spells || []).map((x) => x.spells);
    h += A.runes.length ? A.runes.slice(0, 3).map((r, i) => `<button class="rbtn ${R.applied.runes === pageKey(r) ? 'done' : ''}" ${canApply ? `data-act="applyRunes" data-i="${i}"` : 'disabled'}><div class="row sp nw"><span class="small">${i ? 'Alternative' : '<b>Page conseillée</b>'} · ${wr(r)}</span><span class="small apply">${R.applied.runes === pageKey(r) ? '✅ Appliquée dans le client' : canApply ? '⤴ Appliquer' : ''}</span></div>${runePage(r)}</button>`).join('') : '<p class="muted small">Pas de données de runes.</p>';
    if (A.spells && A.spells.length) h += `<h3>Sorts d'invocateur</h3><div class="row">${A.spells.map((x, i) => `<button class="pair rbtn ${R.applied.spells === x.spells ? 'done' : ''}" ${canApply ? `data-act="applySpells" data-i="${i}"` : 'disabled'}>${spellPair(x.spells)} <span class="small">${wr(x)}</span>${R.applied.spells === x.spells ? ' ✅' : ''}</button>`).join('')}</div>`;
    h += `<p class="muted small" style="margin-top:6px">${canApply ? 'Clique sur une page ou une paire de sorts : elle est créée / sélectionnée directement dans le client.' : 'Pendant une vraie sélection, un clic applique la page ou les sorts dans le client.'}</p></div>`;

    /* Kit d'objets */
    h += `<div class="card"><div class="row sp"><h2 style="margin:0">🛒 Kit d'objets</h2>${A.timelineGames ? ctx(A.earlyVs, A.earlyGames) : ''}</div>`;
    if (!A.timelineGames) {
      const st = champStats(c.key, role);
      h += '<p class="muted small">L\'ordre d\'achat arrive avec les nouvelles parties analysées (collecteur 2.2). En attendant, les objets les plus présents en fin de partie :</p>';
      if (st && st.games) h += buildBlock(st, { compact: true, items: 6 }).replace(/<h3>Runes[\s\S]*?(?=<h3>Objets)/, '');
    } else {
      h += '<div class="kit">';
      if (A.start && A.start[0]) h += `<div class="step"><span class="lab">1. Départ</span><div class="row">${itemsRow(A.start[0].items)}</div><span class="small">${wr(A.start[0])}</span></div>`;
      if (A.core && A.core[0]) h += `<div class="step main"><span class="lab">2. Deux premiers objets${oc && A.earlyVs ? ' contre ' + esc(oc.name) : ''}</span><div class="row">${itIcon(A.core[0].items[0], 'ico lg')}<span class="arrow">→</span>${itIcon(A.core[0].items[1], 'ico lg')}</div><span class="small">${wr(A.core[0])}</span></div>`;
      if (A.boots && A.boots[0]) h += `<div class="step"><span class="lab">Bottes</span><div class="row">${itemsRow([A.boots[0].item])}</div><span class="small">${wr(A.boots[0])}</span></div>`;
      if (A.later && A.later.length) h += `<div class="step"><span class="lab">3. Ensuite, selon la partie</span><div class="row">${itemsRow(A.later.slice(0, 5).map((x) => x.item))}</div><span class="small muted">classés pour cette équipe adverse</span></div>`;
      h += '</div>';
      if (A.core && A.core.length > 1) h += `<details class="flat"><summary class="small">Autres débuts possibles</summary>${A.core.slice(1).map((x) => `<div class="row" style="margin:4px 0">${itIcon(x.items[0])}<span class="arrow">→</span>${itIcon(x.items[1])}<span class="small">${wr(x)}</span></div>`).join('')}</details>`;
      if (A.skills) h += `<h3>Ordre des sorts</h3><div class="row"><span class="skillord">${esc(A.skills.order)}</span>${A.skills.first ? `<span class="small muted">niveaux 1-3 : ${esc(A.skills.first)}</span>` : ''}<span class="small muted">(${Math.round(A.skills.share * 100)} % des joueurs)</span></div>`;
    }
    h += '</div>';

    /* Contre cette équipe */
    if (A.team) {
      const T = A.team;
      h += `<div class="card"><h2>🛡️ Contre cette équipe</h2><div class="row" style="margin-bottom:6px">${sd.enemies.map((k) => cIcon(byKey(k), 'ico sm')).join('')}<span class="grow"></span>${dmgBar(1 - T.ap)}</div>
        <div class="chips small">${T.tanks.length ? `<span class="tag">🛡️ ${T.tanks.length} tank${T.tanks.length > 1 ? 's' : ''}</span>` : ''}${T.healers.length ? `<span class="tag">💚 ${T.healers.length} soigneur${T.healers.length > 1 ? 's' : ''}</span>` : ''}${T.n < 5 ? `<span class="tag">${T.n}/5 champions connus</span>` : ''}</div>`;
      const sit = A.situational || [];
      if (!A.timelineGames) h += '<p class="muted small">Les objets adaptés arrivent avec les parties analysées par le collecteur 2.2.</p>';
      else if (!sit.length) h += '<p class="small">Composition équilibrée : garde le kit standard.</p>';
      else h += sit.map((x) => `<div class="sit"><div class="small"><b>${esc(x.why)}</b></div>${x.items.length ? `<div class="row">${x.items.map((o) => `<span class="itm" data-act="item" data-val="${o.item}">${itIcon(o.item, 'ico')}<span class="small">${Math.round(o.share * 100)} %</span></span>`).join('')}<span class="small muted">→ à placer en 3e ou 4e objet</span></div>` : `<div class="small muted">Pense à ${esc(x.hint)}.</div>`}</div>`).join('');
      h += '<p class="muted small" style="margin-top:6px">% = part des joueurs qui le construisent face à des équipes qui ressemblent à celle-ci.</p></div>';
    }
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
    if (L) enrichLive(L);
    R.live = L;
    if (!L) { R.ovKey = ''; if (was) { renderTop(); if (S.mode === 'game' && !busy()) render(true); } return; }
    const g = S.game;
    const enemyTeam = L.me ? (L.me.team === 'ORDER' ? 'CHAOS' : 'ORDER') : 'CHAOS';
    const enemies = L.players.filter((p) => p.team === enemyTeam);
    const sig = enemies.map((p) => p.champ).join(',');
    if (g.sig !== sig || (g.lastTime && L.time + 5 < g.lastTime)) {
      /* Nouvelle partie détectée */
      S.game = newGame(); S.game.sig = sig; Voice.said.clear(); R.remind = null; R.coach = null; R.prevObj = {}; R.pinfo = {};
      S.game.enemies = enemies.slice(0, 5).map((p) => ({ champ: D.champs && D.champs[p.champ] ? p.champ : '', s: [p.spells[0] || '', p.spells[1] || ''], until: [0, 0], haste: 0 }));
      while (S.game.enemies.length < 5) S.game.enemies.push(newEnemy());
    }
    const G = S.game;
    G.lastTime = L.time;
    G.start = now() - L.time * 1000;
    for (const e of L.events) {
      if (G.seenEv.includes(e.id)) continue;
      G.seenEv.push(e.id);
      const team = Builds.eventTeam(e, L);
      const who = !team ? '' : (L.me && team === L.me.team ? 'Nous' : 'Eux');
      let side = who === 'Nous' ? 'us' : who === 'Eux' ? 'them' : '';
      if (/^(Turret|Inhib)/i.test(e.name)) { const st = Builds.structureTeam(e, L); side = !st ? '' : st === (L.me ? L.me.team : 'ORDER') ? 'us' : 'them'; }
      if (e.name === 'Ace') side = e.acingTeam ? (e.acingTeam === (L.me && L.me.team === 'ORDER' ? 'ORDER' : 'CHAOS') ? 'us' : 'them') : side;
      announceEvent(e, L, side);
      const ago = Math.max(0, L.time - e.t);
      const startT = (id) => { G.timers[id] = now() + (RESPAWN[id] - ago) * 1000; };
      if (e.name === 'DragonKill') { if (/elder/i.test(e.dragon)) { startT('elder'); logEv(e.t, `🔥 Dragon ancestral pris par ${who || '?'}`); } else { startT('drake'); logEv(e.t, `🐉 Dragon ${dragonName(e.dragon)} pris par ${who || '?'}${e.stolen ? ' (volé !)' : ''}`); } }
      else if (e.name === 'BaronKill') { startT('baron'); logEv(e.t, `👾 Baron Nashor pris par ${who || '?'}${e.stolen ? ' (volé !)' : ''}`); }
      else if (e.name === 'HeraldKill') logEv(e.t, `🦀 Héraut de la Faille pris par ${who || '?'}`);
      else if (e.name === 'HordeKill') logEv(e.t, `🪲 Larve du Néant prise par ${who || '?'}`);
      else if (e.name === 'FirstBlood') logEv(e.t, '🩸 Premier sang');
      else if (e.name === 'TurretKilled') logEv(e.t, side === 'us' ? '🏰 Tour ennemie détruite' : side === 'them' ? '🏰 Nous avons perdu une tour' : '🏰 Tour détruite');
      else if (e.name === 'InhibKilled') logEv(e.t, side === 'us' ? '💎 Inhibiteur ennemi détruit' : side === 'them' ? '💎 Nous avons perdu un inhibiteur' : '💎 Inhibiteur détruit');
      else if (e.name === 'Ace') logEv(e.t, '💀 Équipe entière éliminée');
    }
    if (G.seenEv.length > 400) G.seenEv = G.seenEv.slice(-300);
    /* Annonces vocales (objectifs, mort, or pour le prochain objet) */
    try {
      announce(L, G);
      const O = Builds.objectives(L, L.me ? L.me.team : 'ORDER');
      for (const r of O.rows) R.prevObj[r.id] = r.state;
    } catch (e) { /* ignoré */ }
    try { overlaySync(L); } catch (e) { /* ignoré */ }
    renderTop();
    if (S.mode === 'game' && !busy()) render(true); else save();
  }
  /* Complète les données du jeu avec celles du client LoL : autres noms des joueurs (les événements
     utilisent parfois l'ancien nom d'invocateur) et, si besoin, quel joueur tu es. */
  function enrichLive(L) {
    const gp = (R.lcu.game && R.lcu.game.players) || [];
    const keyOf = (p) => (D.champs && D.champs[p.champ] ? +D.champs[p.champ].key : 0);
    for (const p of L.players) {
      const g = gp.find((x) => x.team === p.team && +x.champ === keyOf(p));
      if (g) { p.aliases = [...new Set((p.aliases || []).concat(g.aliases || [], [g.name, g.name && g.tag ? g.name + '#' + g.tag : ''].filter(Boolean)))]; p.puuid = g.puuid; }
    }
    if ((!L.me || !L.me.team) && R.lcu.summoner && R.lcu.summoner.puuid) {
      const mine = L.players.find((p) => p.puuid && p.puuid === R.lcu.summoner.puuid);
      if (mine) L.me = Object.assign({ level: mine.level, gold: 0, stats: null }, L.me || {}, { name: mine.name, champ: mine.champ, team: mine.team });
    }
  }
  /* Qui je suis : compte du client LoL, sinon compte affiché dans « Mon compte », sinon Riot ID des réglages */
  const myPuuid = () => (R.lcu.summoner && R.lcu.summoner.puuid) || (R.profile && R.profile.account && R.profile.account.puuid) || '';
  function myIds(P) {
    const ids = [];
    if (R.lcu.summoner && R.lcu.summoner.gameName) ids.push({ gameName: R.lcu.summoner.gameName, tagLine: R.lcu.summoner.tagLine || '' });
    if (R.profile && R.profile.account) ids.push({ gameName: R.profile.account.gameName, tagLine: R.profile.account.tagLine });
    const c = (R.cfg || {}).riotId; if (c && c.gameName) ids.push({ gameName: c.gameName, tagLine: c.tagLine || '' });
    if (P && P.live && P.live.me && D.champs && D.champs[P.live.me.champ]) ids.push({ champ: +D.champs[P.live.me.champ].key });
    return ids;
  }
  const dragonName = (t) => ({ Fire: 'infernal', Water: 'des océans', Earth: 'des montagnes', Air: 'des nuages', Hextech: 'hextech', Chemtech: 'chemtech' })[t] || '';
  function logEv(t, txt) { S.game.log.unshift({ t, txt }); S.game.log = S.game.log.slice(0, 30); }

  function teamValue(players) { return players.reduce((sum, p) => sum + p.items.reduce((s, i) => s + (((D.items || {})[String(i.id)] || { gold: { total: 0 } }).gold.total * (i.count || 1)), 0), 0); }
  /* ---------- Rangs et niveaux des joueurs ---------- */
  function wantInfo(puuids) {
    if (!NB) return;
    const miss = (puuids || []).filter((id) => id && !(id in R.pinfo) && !R.pinfoPending.has(id));
    if (!miss.length) return;
    miss.forEach((id) => R.pinfoPending.add(id));
    NB.players.info(miss).then((res) => { miss.forEach((id) => { R.pinfo[id] = (res || {})[id] || null; }); })
      .catch(() => { miss.forEach((id) => { R.pinfo[id] = null; }); })
      .finally(() => { miss.forEach((id) => R.pinfoPending.delete(id)); soon(); });
  }
  const APEX = ['MASTER', 'GRANDMASTER', 'CHALLENGER'];
  function rankTag(puuid, hidden) {
    if (hidden) return '<span class="rk unr" title="Les adversaires sont masqués pendant la sélection classée">masqué</span>';
    if (!puuid) return '';
    const i = R.pinfo[puuid];
    if (i === undefined) return '<span class="rk unr">…</span>';
    if (!i) return '';
    const q = i.solo || i.flex;
    const r = q ? `<span class="rk t-${q.tier.toLowerCase()}" title="${q === i.solo ? 'Classée solo/duo' : 'Classée flexible'} · ${q.lp} LP · ${q.wins} V / ${q.losses} D">${TIER[q.tier] || q.tier}${q.division ? ' ' + q.division : ''}${APEX.includes(q.tier) ? ' ' + q.lp + ' LP' : ''}</span>` : '<span class="rk unr">Non classé</span>';
    return r + (i.level ? `<span class="slv">niv. ${i.level}</span>` : '');
  }

  /* ---------- Annonces vocales (synthèse vocale du système, en français) ---------- */
  const Voice = { said: new Set() };
  function frVoices() { try { return window.speechSynthesis.getVoices().filter((v) => /^fr/i.test(v.lang)); } catch (e) { return []; } }
  function speak(text, key) {
    if (!S.opt.voice || !window.speechSynthesis) return;
    if (key) { if (Voice.said.has(key)) return; Voice.said.add(key); }
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR';
      const all = window.speechSynthesis.getVoices();
      const v = all.find((x) => x.name === S.opt.voiceName) || frVoices()[0];
      if (v) u.voice = v;
      u.rate = S.opt.voiceRate || 1.05; u.volume = (S.opt.voiceVol == null ? 90 : S.opt.voiceVol) / 100;
      window.speechSynthesis.speak(u);
    } catch (e) { /* synthèse vocale indisponible */ }
  }
  if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = () => { if (S.mode === 'settings' && !busy()) render(true); };
  const OBJ_SAY = { drake: ['le dragon', 'Le dragon'], grubs: ['les larves du Néant', 'Les larves du Néant'], herald: ['le Héraut', 'Le Héraut'], baron: ['le Nashor', 'Le Nashor'], elder: ['le dragon ancestral', 'Le dragon ancestral'] };
  /* Ce qui se passe en jeu → phrases courtes et précises */
  function announce(L, G) {
    if (!S.opt.voice) return;
    const myTeam = L.me ? L.me.team : 'ORDER';
    const O = Builds.objectives(L, myTeam);
    for (const r of O.rows) {
      const nm = OBJ_SAY[r.id];
      if (r.state === 'spawn' && r.in <= 31 && r.in > 20) speak(`${nm[1]} dans 30 secondes.`, `warn-${r.id}-${Math.round(L.time + r.in)}`);
      if (R.prevObj[r.id] === 'spawn' && r.state === 'up') speak(`${nm[1]} ${r.id === 'grubs' ? 'sont disponibles' : 'est disponible'}.`, `up-${r.id}-${Math.round(L.time)}`);
    }
    /* Mort : temps de réapparition */
    const meP = L.me ? L.players.find((p) => p.name === L.me.name) : null;
    if (meP && meP.dead && meP.respawn > 8) speak(`Tu es mort. Réapparition dans ${Math.round(meP.respawn)} secondes. Regarde la carte en attendant.`, `death-${meP.d}`);
    /* Rappels utiles (uniquement d'après tes propres données) */
    if (S.opt.reminders !== false && meP && L.me) {
      const lvl = L.me.level || meP.level || 0;
      if (lvl >= 6) speak('Niveau 6 : ton ultime est disponible.', 'ult-6');
      if (lvl >= 11) speak('Niveau 11 : améliore ton ultime.', 'ult-11');
      if (lvl >= 16) speak('Niveau 16 : améliore ton ultime une dernière fois.', 'ult-16');
      /* Après un achat : balise de contrôle si tu n'en as pas (à partir de 6 min, au plus une fois toutes les 3 min) */
      const ids = meP.items.map((i) => i.id).sort().join(',');
      const value = meP.items.reduce((sum, i) => sum + (((D.items || {})[String(i.id)] || { gold: { total: 0 } }).gold.total * (i.count || 1)), 0);
      if (R.remind && R.remind.ids !== ids && value > R.remind.value && L.time > 360 && !meP.items.some((i) => i.id === 2055) && meP.items.filter((i) => i.slot < 6).length < 6 && L.time - (R.remind.ctrlAt || 0) > 180) {
        speak('Pense à acheter une balise de contrôle.'); R.remind.ctrlAt = L.time;
      }
      R.remind = Object.assign(R.remind || {}, { ids, value });
      /* Support : passer à la Lentille d'oracle pour détruire les balises adverses */
      const role = liveRoles(L).get(meP.name);
      if (role === 'support' && L.time > 540 && meP.items.some((i) => i.id === 3340)) speak('Pense à échanger ton trinket contre la Lentille d\'oracle, pour détruire les balises adverses.', 'oracle');
    }
    try { coachLive(L, O, meP); } catch (e) { /* ignoré */ }
    /* Or suffisant pour le prochain objet du build */
    const lb = liveBuild(L);
    if (lb && lb.next && L.me && L.me.gold >= lb.next.cost && !(meP && meP.dead)) speak(`Tu as assez d'or pour ${lb.next.name}. Rentre à la base si tu peux.`, `gold-${lb.next.item}`);
  }
  /* ---------- Coaching en direct : uniquement tes données et ce que tout joueur voit dans le tableau des scores (Tab) ---------- */
  const COACH = [['back', '🏠 Moment pour rentrer (moins de 20 % de vie et au moins 1 800 po, ou moins de 10 % de mana)'], ['lane', '⚔️ Ton adversaire de voie (avance de niveau, objets terminés) et tes objets terminés'], ['dead', '💀 Adversaires morts : fenêtre pour pousser ou prendre un objectif'], ['counter', '🛡️ Objets contre l\'équipe adverse (anti-soins, pénétration)'], ['cs', '🌾 Point farm à 10 et 20 min, plaques des tours à 14 min']];
  const coachOn = (k) => ((S.opt.coach || {})[k] !== false);
  function coachSay(L, text, key) { if (Voice.said.has(key)) return; speak(text, key); logEv(L.time, '💡 ' + text); }
  const itemName = (id) => ((D.items || {})[String(id)] || {}).name || '';
  const legendaryIds = (p) => p.items.filter((i) => i.slot < 6 && Builds.isLegendary((D.items || {})[String(i.id)])).map((i) => i.id);
  function coachLive(L, O, meP) {
    if (!meP || !L.me || !D.items) return;
    if (NB && !R.profile && !R.profileErr && !R.profileLoading && R.cfg && R.cfg.hasApiKey) loadProfile(); /* rang actuel → rang cible */
    const myTeam = L.me.team;
    const enemies = L.players.filter((p) => p.team !== myTeam);
    const LR = liveRoles(L), myRole = LR.get(meP.name) || '';
    const opp = enemies.find((p) => myRole && LR.get(p.name) === myRole) || null;
    const myLvl = L.me.level || meP.level || 0;
    /* Première lecture de la partie (ou appli ouverte en cours de partie) : on note l'existant sans rien annoncer */
    if (!R.coach) { R.coach = { mine: new Set(legendaryIds(meP)), opp: new Set(opp ? legendaryIds(opp) : []), oppName: opp ? opp.name : '' }; return; }
    if (opp && R.coach.oppName !== opp.name) { R.coach.opp = new Set(legendaryIds(opp)); R.coach.oppName = opp.name; }
    /* 2. Moment pour rentrer */
    const st = L.me.stats;
    if (coachOn('back') && st && st.maxHp && !meP.dead && st.hp / st.maxHp <= 0.2 && (L.me.gold || 0) >= 1800) {
      coachSay(L, `Moins de 20 % de vie et ${nf(L.me.gold)} pièces d'or : c'est le bon moment pour rentrer à la base.`, 'back-' + Math.floor(L.time / 90));
    }
    /* Mana presque vide (champions à mana seulement) */
    if (coachOn('back') && st && st.resType === 'MANA' && st.maxRes > 0 && !meP.dead && st.res / st.maxRes <= 0.1) {
      coachSay(L, 'Plus que 10 % de mana : rentre à la base dès que possible, ou joue prudemment.', 'mana-' + Math.floor(L.time / 90));
    }
    /* 4. Adversaire de voie et objets terminés */
    if (coachOn('lane')) {
      if (opp) {
        const oc = D.champs[opp.champ], on = oc ? oc.name : 'Ton adversaire';
        if (opp.level >= 6 && myLvl < 6) coachSay(L, `${on} est niveau 6 et pas toi : il a son ultime, sois prudent.`, 'opp-6');
        else if (opp.level - myLvl >= 2) coachSay(L, `${on} a ${opp.level - myLvl} niveaux d'avance : évite le combat et farme près de ta tour.`, 'opp-lead-' + opp.level);
        for (const id of legendaryIds(opp)) if (!R.coach.opp.has(id)) { R.coach.opp.add(id); coachSay(L, `${on} a terminé ${itemName(id)}.`, 'opp-item-' + id); }
      }
      for (const id of legendaryIds(meP)) if (!R.coach.mine.has(id)) { R.coach.mine.add(id); coachSay(L, `Tu as terminé ${itemName(id)} : tu es plus fort, cherche un combat ou un objectif.`, 'my-item-' + id); }
    } else { legendaryIds(meP).forEach((id) => R.coach.mine.add(id)); if (opp) legendaryIds(opp).forEach((id) => R.coach.opp.add(id)); }
    /* 5. Plusieurs adversaires morts en même temps */
    if (coachOn('dead') && !meP.dead) {
      const r = enemies.filter((p) => p.dead && p.respawn > 0).map((p) => p.respawn).sort((a, b) => b - a);
      if (r.length >= 3 && r[2] >= 12) {
        const up = O.rows.filter((x) => x.state === 'up').map((x) => x.id);
        const target = up.includes('baron') ? 'prenez le Nashor' : up.includes('elder') ? 'prenez le dragon ancestral' : up.includes('drake') ? 'prenez le dragon' : up.includes('herald') ? 'prenez le Héraut' : 'poussez une tour';
        coachSay(L, `${r.length} adversaires morts pendant ${Math.round(r[2])} secondes : ${target} !`, 'deadwin-' + Math.floor(L.time / 45));
      }
    }
    /* 6. Objets adaptés à l'équipe adverse (une fois chacun, après 10 min) */
    if (coachOn('counter') && L.time > 600) {
      const ad = dmgProfile(meP).ad >= 0.5;
      const pick = (f) => D.itemList.filter((it) => f(it) && (it.tags || []).includes(ad ? 'Damage' : 'SpellDamage')).sort((a, b) => a.gold.total - b.gold.total)[0];
      const owns = (f) => meP.items.some((i) => { const it = D.items[String(i.id)]; return it && f(it); });
      const gw = (it) => /blessures graves|grievous/i.test(it.description || '');
      const ekeys = enemies.map((p) => (D.champs[p.champ] ? +D.champs[p.champ].key : 0)).filter(Boolean);
      const prof = Builds.teamProfile(ekeys, D) || { healers: [] };
      const sustain = prof.healers.length + enemies.reduce((n, p) => n + p.items.filter((i) => { const it = D.items[String(i.id)]; return it && Builds.isLegendary(it) && ((it.tags || []).includes('LifeSteal') || (it.tags || []).includes('SpellVamp')); }).length, 0);
      if (sustain >= 3 && !owns(gw)) { const it = pick(gw); if (it) coachSay(L, `L'équipe adverse se soigne beaucoup : pense à un objet anti-soins, comme ${it.name}.`, 'counter-heal'); }
      const stack = (tag) => enemies.reduce((n, p) => n + p.items.filter((i) => { const it = D.items[String(i.id)]; return it && Builds.isLegendary(it) && (it.tags || []).includes(tag); }).length, 0);
      const legPen = (tag) => D.itemList.filter((it) => Builds.isLegendary(it) && (it.tags || []).includes(tag)).sort((a, b) => a.gold.total - b.gold.total)[0];
      if (ad && stack('Armor') >= 3 && !owns((it) => (it.tags || []).includes('ArmorPenetration'))) { const it = legPen('ArmorPenetration'); if (it) coachSay(L, `Les adversaires empilent l'armure : un objet de pénétration d'armure comme ${it.name} t'aidera.`, 'counter-armor'); }
      if (!ad && stack('SpellBlock') >= 3 && !owns((it) => (it.tags || []).includes('MagicPenetration'))) { const it = legPen('MagicPenetration'); if (it) coachSay(L, `Les adversaires empilent la résistance magique : un objet de pénétration magique comme ${it.name} t'aidera.`, 'counter-mr'); }
    }
    /* 7. Point farm à 10 et 20 min, plaques à 14 min */
    if (coachOn('cs')) {
      for (const m of [10, 20]) {
        if (myRole !== 'support' && L.time >= m * 60 && L.time < m * 60 + 20) {
          const rate = meP.cs / (L.time / 60);
          const gr = goalOf(myRole || 'all');
          const target = gr.metric === 'csm' && gr.custom && gr.target ? gr.target : bench('csm', myRole, targetTier()) || 6;
          coachSay(L, `${m} minutes : ${meP.cs} sbires, soit ${f1(rate)} par minute. ${rate >= target ? `Objectif de ${f1(target)} atteint, bravo !` : `Objectif pour le rang ${TIER[targetTier()]} : ${f1(target)}.`}`, 'cs-' + m);
        }
      }
      if (L.time >= 810 && L.time < 830) coachSay(L, 'Dans 30 secondes, les plaques des tours disparaissent : dernière chance de les prendre.', 'plates');
    }
  }
  function announceEvent(e, L, side) {
    if (!S.opt.voice || L.time - e.t > 15) return;
    const us = side === 'us';
    const key = 'ev-' + e.id;
    /* Équipe inconnue : on annonce sans dire qui (jamais « l'ennemi » par défaut) */
    if (!side) {
      const N = { DragonKill: /elder/i.test(e.dragon) ? 'Le dragon ancestral a été pris.' : `Le dragon ${dragonName(e.dragon)} a été pris.`, BaronKill: 'Le Nashor a été pris.', HeraldKill: 'Le Héraut a été pris.', HordeKill: 'Les larves du Néant sont attaquées.' };
      if (N[e.name]) speak(N[e.name], e.name === 'HordeKill' ? 'horde-' + Math.floor(e.t / 30) : key);
      return;
    }
    if (e.name === 'DragonKill') {
      if (/elder/i.test(e.dragon)) speak(us ? 'Nous avons pris le dragon ancestral !' : 'L\'ennemi a pris le dragon ancestral. Évitez les combats.', key);
      else speak(`${us ? 'Nous avons pris' : 'L\'ennemi a pris'} le dragon ${dragonName(e.dragon)}${e.stolen ? ', volé' : ''}.`, key);
    } else if (e.name === 'BaronKill') speak(us ? 'Nous avons le Nashor. Poussez les voies !' : 'L\'ennemi a le Nashor. Défendez vos tours.', key);
    else if (e.name === 'HeraldKill') speak(us ? 'Nous avons pris le Héraut.' : 'L\'ennemi a pris le Héraut.', key);
    else if (e.name === 'HordeKill') speak(us ? 'Nous prenons les larves du Néant.' : 'L\'ennemi prend les larves du Néant.', 'horde-' + Math.floor(e.t / 30));
    else if (e.name === 'InhibKilled' && side) speak(us ? 'Inhibiteur ennemi détruit !' : 'Notre inhibiteur est tombé. Attention aux super-sbires.', key);
    /* Pas d'annonce pour les éliminations (premier sang, équipe entière) */
  }

  /* ---------- Mon build pendant la partie ---------- */
  const LIVE_POS = { top: 'top', jungle: 'jungle', middle: 'mid', bottom: 'adc', utility: 'support' };
  function liveBuild(L) {
    if (!NB || !L || !L.me || !D.champs) return null;
    const meP = L.players.find((p) => p.name === L.me.name);
    const c = D.champs[L.me.champ];
    if (!c || !meP) return null;
    const lp = S.lastPick && S.lastPick.champ === +c.key ? S.lastPick : null;
    const LR = liveRoles(L);
    const role = LR.get(meP.name) || (lp && lp.role) || '';
    const owned0 = meP.items.map((i) => i.id);
    const gb = S.gameBuild && S.gameBuild.champ === c.id && (!R.lcu.game || !S.gameBuild.gameId || R.lcu.game.gameId === S.gameBuild.gameId) ? S.gameBuild.build : null;
    const chosen = gb || S.myItems.find((b) => b.id === S.selItems[c.id] && b.champ === c.id);
    const personal = chosen || forChamp(S.myItems, c.id, role).sort((a, b) => (b.roles.includes(role) ? 1 : 0) - (a.roles.includes(role) ? 1 : 0))[0];
    if (personal) return { c, role, personal, owned: owned0, next: Builds.nextItem(itemPlan(personal), owned0, D) };
    if (!role) return { c, role: '' };
    const enemies = L.players.filter((p) => p.team !== L.me.team);
    const oppP = enemies.find((p) => LR.get(p.name) === role);
    const opp = oppP && D.champs[oppP.champ] ? +D.champs[oppP.champ].key : (lp && lp.opp) || 0;
    const ekeys = enemies.map((p) => (D.champs[p.champ] ? +D.champs[p.champ].key : 0)).filter(Boolean);
    const rows = cached(`builds:${c.key}:${role}`, () => NB.stats.builds(+c.key, role, 30));
    if (!rows) return { c, role, opp, loading: rows === undefined };
    const mk = `${c.key}:${role}:${opp}:${ekeys.join(',')}:${rows.length}`;
    if (R.liveMemo.k !== mk) R.liveMemo = { k: mk, A: Builds.analyze(rows, D, { opp, enemies: ekeys }) };
    const A = R.liveMemo.A;
    const owned = meP.items.map((i) => i.id);
    return { c, role, opp, A, owned, next: Builds.nextItem(A, owned, D) };
  }
  /* Carte « Mon build » en jeu : compacte, tous les objets visés ; un clic ouvre la fiche boutique de l'objet */
  function buildCard(L) {
    const b = liveBuild(L);
    if (!b) return '';
    const oc = b.opp ? byKey(b.opp) : null;
    const own = new Set((b.owned || []).map(Number));
    const nextId = b.next ? +b.next.item : 0;
    const ic = (id) => { id = +id; if (!id) return ''; const it = D.items && D.items[String(id)]; return `<button class="bi ${own.has(id) ? 'own' : ''} ${id === nextId ? 'nx' : ''}" data-act="item" data-val="${id}" title="${esc(it ? `${it.name} · ${it.gold.total} po — clic : fiche boutique` : '')}">${itIcon(id, 'ico xs')}${own.has(id) ? '<i>✓</i>' : ''}</button>`; };
    const row = (label, ids, sep, boots) => { const l = (ids || []).map(Number).filter(Boolean); return l.length || boots ? `<div class="brow"><span class="small muted">${label}</span><div class="bis">${l.map(ic).join(sep || '')}${boots ? `<span class="rsep"></span>${ic(boots)}` : ''}</div></div>` : ''; };
    const nextLine = () => {
      if (!b.next) return '<div class="next sm"><span class="small pos">✅ Build terminé !</span></div>';
      const miss = b.next.cost - ((L.me && L.me.gold) || 0);
      return `<button class="next sm" data-act="item" data-val="${b.next.item}" title="Clic : fiche boutique">${itIcon(b.next.item, 'ico')}<span class="grow"><b class="ell">${esc(b.next.name)}</b><span class="small ${miss <= 0 ? 'pos' : 'muted'}">${miss <= 0 ? '✅ assez d\'or' : `il manque ${nf(miss)} po`}</span></span></button>`;
    };
    let h = `<div class="card mybuild compact"><div class="row sp nw"><h2 class="ell" style="margin:0">${b.personal ? '⭐ ' + esc(b.personal.name || 'Mon build perso') : '🛒 Mon build'}</h2><span class="small muted ell">${esc(b.c.name)}${b.role ? ' · ' + ROLE_NAME[b.role] : ''}${oc ? ' vs ' + esc(oc.name) : ''}</span></div>`;
    if (b.personal) {
      const P = b.personal;
      return h + nextLine() + row('Départ', P.start) + row('Principaux', P.core, '<span class="arrow">›</span>', P.boots) + row('Selon partie', P.situational) + '</div>';
    }
    if (!b.role) return h + '<p class="muted small">Rôle inconnu pour cette partie.</p></div>';
    if (b.loading) return h + '<div class="loader small">Calcul…</div></div>';
    if (!b.A || !b.A.games) return h + '<p class="muted small">Pas encore de parties analysées pour ce champion dans ce rôle (collecteur).</p></div>';
    const A = b.A;
    h += nextLine();
    h += row('Départ', A.start && A.start[0] ? A.start[0].items : []);
    h += row('Principaux', A.core && A.core[0] ? A.core[0].items : [], '<span class="arrow">›</span>', A.boots && A.boots[0] ? A.boots[0].item : 0);
    const sit = (A.situational || []).filter((x) => x.items.length);
    h += row('Selon partie', [...new Set(sit.flatMap((x) => x.items.map((o) => o.item)).concat((A.later || []).slice(0, 4).map((x) => x.item)))].slice(0, 8));
    if (A.skills) h += `<div class="brow"><span class="small muted">Sorts</span><span class="skillord">${esc(A.skills.order)}</span></div>`;
    return h + '</div>';
  }

  /* Encart par-dessus le jeu : seulement quand un build perso est suivi */
  function overlaySync(L) {
    if (!NB || !NB.overlay) return;
    let d = null;
    const b = L && started(L) ? liveBuild(L) : null;
    if (b && b.personal && D.items) {
      const P = b.personal, own = new Set((b.owned || []).map(Number));
      const it = (id) => { const x = D.items[String(id)]; return x ? { id: +id, src: Dd.img.item(x), name: x.name, cost: x.gold.total, own: own.has(+id) } : null; };
      const nx = b.next && D.items[String(b.next.item)];
      d = { name: P.name || 'Mon build', champ: b.c.name, core: P.core.map(it).filter(Boolean), boots: P.boots ? it(P.boots) : null, sit: (P.situational || []).map(it).filter(Boolean),
        next: nx ? { id: +b.next.item, src: Dd.img.item(nx), name: b.next.name, miss: Math.max(0, b.next.cost - ((L.me && L.me.gold) || 0)) } : null };
    }
    const k = JSON.stringify(d);
    if (k === R.ovKey) return;
    R.ovKey = k;
    NB.overlay.update(d).catch(() => {});
  }

  /* ---------- Profil de dégâts AD / AP ----------
     Estimé d'après les objets (valeur en or des statistiques offensives), mélangé au profil du champion
     tant que le joueur a peu d'objets. */
  const PHYS_TAGS = ['Damage', 'CriticalStrike', 'AttackSpeed', 'ArmorPenetration', 'OnHit'], MAG_TAGS = ['SpellDamage', 'MagicPenetration'];
  function itemDmg(it) {
    const st = it.stats || {};
    let ad = (st.FlatPhysicalDamageMod || 0) * 35 + (st.FlatCritChanceMod || 0) * 100 * 40 + (st.PercentAttackSpeedMod || 0) * 100 * 25;
    let ap = (st.FlatMagicDamageMod || 0) * 20;
    if (!ad && !ap) { const t = it.tags || []; if (t.some((x) => PHYS_TAGS.includes(x))) ad = it.gold.total * 0.6; if (t.some((x) => MAG_TAGS.includes(x))) ap = it.gold.total * 0.6; }
    return [ad, ap];
  }
  function dmgProfile(p) {
    const c = D.champs[p.champ];
    const base = c ? (c.info.attack + 0.01) / (c.info.attack + c.info.magic + 0.02) : 0.5;
    let ad = 0, ap = 0;
    p.items.forEach((i) => { const it = D.items[String(i.id)]; if (it) { const [x, y] = itemDmg(it); ad += x * (i.count || 1); ap += y * (i.count || 1); } });
    const tot = ad + ap, w = Math.min(1, tot / 2500);
    return { ad: base * (1 - w) + (tot ? ad / tot : base) * w, fromItems: w };
  }
  const dmgBar = (v, label = true) => { const a = Math.round(v * 100); return `<div class="dmg" title="${a} % AD / ${100 - a} % AP"><div class="dmgbar"><i class="phy" style="width:${a}%"></i><i class="mag" style="width:${100 - a}%"></i></div>${label ? `<span class="${a >= 50 ? 'tphy' : 'tmag'}">${a >= 50 ? a + ' % AD' : 100 - a + ' % AP'}</span>` : ''}</div>`; };
  function teamValue(players) { return players.reduce((sum, p) => sum + p.items.reduce((s, i) => s + (((D.items || {})[String(i.id)] || { gold: { total: 0 } }).gold.total * (i.count || 1)), 0), 0); }
  /* ---------- Rôles des 10 joueurs en jeu ----------
     Le jeu donne la position en partie classée ; sinon on la déduit (Châtiment = jungle, puis statistiques et classe du champion). */
  function liveRoles(L) {
    const keyOf = (p) => (D.champs && D.champs[p.champ] ? +D.champs[p.champ].key : 0);
    const keys = L.players.map(keyOf).filter(Boolean);
    const dist = NB && keys.length ? cached('rd:' + keys.slice().sort().join(','), () => NB.stats.roleDist(keys)) : null;
    const sig = L.players.map((p) => `${p.name}:${p.champ}:${p.position}:${p.spells.join('/')}`).join('|') + (dist ? ':d' : '');
    if (R.roleMemo && R.roleMemo.sig === sig) return R.roleMemo.map;
    const map = new Map();
    for (const team of ['ORDER', 'CHAOS']) {
      const ps = L.players.filter((p) => p.team === team);
      const fixed = {};
      ps.forEach((p) => { const r = LIVE_POS[p.position]; if (r && keyOf(p)) fixed[keyOf(p)] = r; });
      if (!Object.values(fixed).includes('jungle')) { const sm = ps.find((p) => keyOf(p) && !fixed[keyOf(p)] && p.spells.some((x) => /Smite/i.test(x))); if (sm) fixed[keyOf(sm)] = 'jungle'; }
      let as = {};
      try { as = Builds.assignRoles(ps.map(keyOf).filter(Boolean), D, dist || {}, fixed); } catch (e) { as = fixed; }
      const used = new Set();
      ps.forEach((p) => { const r = as[keyOf(p)]; if (r && !used.has(r)) { map.set(p.name, r); used.add(r); } });
      ps.forEach((p) => { if (!map.has(p.name)) { const r = ROLE_ORDER.find((x) => !used.has(x)); if (r) { map.set(p.name, r); used.add(r); } } });
    }
    R.roleMemo = { sig, map };
    return map;
  }
  /* Or gagné : exact pour toi (or en poche + objets), estimé pour les autres
     (le jeu ne publie pas l'or des autres joueurs : on prend le plus grand entre la valeur de leurs objets
     et une estimation d'après le temps, les sbires/monstres, kills et assistances). */
  const itemsValue = (p) => p.items.reduce((s, i) => s + (((D.items || {})[String(i.id)] || { gold: { total: 0 } }).gold.total * (i.count || 1)), 0);
  function goldOf(p, L) {
    const items = itemsValue(p);
    if (L.me && p.name === L.me.name) return { v: items + (L.me.gold || 0), exact: true, items };
    const est = 500 + Math.max(0, L.time - 65) * 2.04 + p.cs * 21 + p.k * 300 + p.a * 150;
    return { v: Math.round(Math.max(items, est)), exact: false, items };
  }
  const k1g = (n) => (Math.abs(n) >= 1000 ? (n / 1000).toFixed(1).replace('.', ',') + 'k' : String(Math.round(n)));
  /* Qui domine la voie : écart d'or + écart de niveau (1 niveau ≈ 300 po) */
  function laneLead(a, e, L) {
    if (!a || !e) return null;
    const ga = goldOf(a, L).v, ge = goldOf(e, L).v;
    const score = (ga - ge) + 300 * ((a.level || 0) - (e.level || 0));
    const m = Math.abs(score);
    const lvl = m < 400 ? 0 : m < 1200 ? 1 : 2;
    const side = lvl === 0 ? '' : score > 0 ? 'us' : 'them';
    const label = lvl === 0 ? 'Égalité' : lvl === 1 ? 'Avantage' : 'Domine';
    return { score, gold: ga - ge, lvl, side, label, pct: Math.min(50, (m / 3000) * 50) };
  }
  function playersPanel(L) {
    const myTeam = L.me ? L.me.team : 'ORDER';
    const teams = [L.players.filter((p) => p.team === myTeam), L.players.filter((p) => p.team !== myTeam)];
    const gold = teams.map((t) => t.reduce((s, p) => s + goldOf(p, L).v, 0));
    const kills = teams.map((t) => t.reduce((s, p) => s + p.k, 0));
    const diff = gold[0] - gold[1];
    const gp = (R.lcu.game && R.lcu.game.players) || [];
    const puuidOf = (p) => { const c = D.champs[p.champ]; const g = c && gp.find((x) => x.team === p.team && +x.champ === +c.key); return g ? g.puuid : ''; };
    wantInfo(L.players.map(puuidOf));
    /* Lignes par voie : top, jungle, mid, support, adc */
    const LR = liveRoles(L);
    const rows = ROLE_ORDER.map((r) => ({ r, a: teams[0].find((p) => LR.get(p.name) === r) || null, e: teams[1].find((p) => LR.get(p.name) === r) || null }));
    const half = (p, side) => {
      if (!p) return `<div class="lp ${side} empty"><span class="muted small">—</span></div>`;
      const c = D.champs[p.champ]; const pr = dmgProfile(p); const g = goldOf(p, L);
      const items = p.items.filter((i) => i.slot < 6).sort((x, y) => x.slot - y.slot);
      const trinket = p.items.find((i) => i.slot === 6);
      return `<div class="lp ${side} ${p.dead ? 'dead' : ''} ${L.me && p.name === L.me.name ? 'me' : ''}">
        <div class="pic">${cIcon(c, 'ico')}<span class="lvl">${p.level}</span>${p.dead ? `<span class="resp">${Math.ceil(p.respawn)}</span>` : ''}</div>
        <div class="pname"><b>${esc(c ? c.name : p.champName)}</b><span class="small pmeta"><span class="muted">${esc(p.gameName)}</span>${rankTag(puuidOf(p))}</span>${dmgBar(pr.ad, false)}</div>
        <div class="kda"><b>${p.k}/<span class="neg">${p.d}</span>/${p.a}</b><span class="muted small" title="${p.cs} sbires et monstres">${csm(p.cs, L.time)} CS/min</span><span class="pgold" title="${g.exact ? 'Or gagné (objets + or en poche)' : `Or gagné estimé · objets : ${nf(g.items)} po`}">${g.exact ? '' : '≈'}${k1g(g.v)} 🪙</span></div>
        <div class="build">${[0, 1, 2, 3, 4, 5].map((k) => (items[k] ? itIcon(items[k].id) : '<span class="ico sm ph"></span>')).join('')}${trinket ? itIcon(trinket.id, 'ico sm trk') : ''}</div></div>`;
    };
    const mid = (x) => {
      const d = laneLead(x.a, x.e, L);
      const meter = d ? `<div class="lead ${d.side}" title="${d.label}${d.side ? (d.side === 'us' ? ' pour nous' : ' pour eux') : ''} · écart d'or ${d.gold >= 0 ? '+' : ''}${nf(d.gold)} po (estimé)"><div class="lbar"><i style="${d.side === 'them' ? 'left' : 'right'}:50%;width:${d.side ? Math.max(6, d.pct) : 0}%"></i></div><span class="ltxt">${d.side === 'us' ? '◀ ' : ''}${d.label}${d.side === 'them' ? ' ▶' : ''}</span><span class="lgold">${d.gold >= 0 ? '+' : '−'}${k1g(Math.abs(d.gold))}</span></div>` : '';
      return `<div class="lmid"><span class="lrole" title="${ROLE_NAME[x.r]}">${ROLE_IC[x.r]} ${ROLE_NAME[x.r]}</span>${meter}</div>`;
    };
    const teamDmg = (t) => (t.length ? t.reduce((s, p) => s + dmgProfile(p).ad, 0) / t.length : 0.5);
    const advice = (v) => (v >= 0.62 ? 'surtout physique : l\'<b>armure</b> est rentable' : v <= 0.38 ? 'surtout magique : la <b>résistance magique</b> est rentable' : 'mixte : équilibre armure et résistance magique');
    const tdA = teamDmg(teams[0]), tdE = teamDmg(teams[1]);
    return `<div class="card players"><div class="row sp"><h2 style="margin:0">👥 Joueurs</h2><span class="small">Kills <b>${kills[0]}</b> – <b>${kills[1]}</b> · Or <b class="${diff >= 0 ? 'pos' : 'neg'}">${diff >= 0 ? '+' : ''}${nf(diff)}</b> po</span></div>
      <div class="lhead"><div class="lh us"><b>🟦 Mon équipe</b><span class="muted small">≈ ${nf(gold[0])} po</span>${dmgBar(tdA)}</div><div class="lmid"></div><div class="lh them"><b>🟥 Adversaires</b><span class="muted small">≈ ${nf(gold[1])} po</span>${dmgBar(tdE)}</div></div>
      ${rows.map((x) => `<div class="lane ${x.a && L.me && x.a.name === L.me.name ? 'mine' : ''}">${half(x.a, 'us')}${mid(x)}${half(x.e, 'them')}</div>`).join('')}
      <p class="small tipline">Adversaires → ${advice(tdE)}</p>
      <p class="muted small">Or des autres joueurs estimé (le jeu ne publie que le tien). Domination = écart d'or + écart de niveau.</p></div>`;
  }

  /* ---------- Mini-carte intégrée (capture de la zone de l'écran du jeu) ---------- */
  const MM = { video: null, canvas: null, stream: null, raf: 0, err: '', starting: false };
  async function mmStart() {
    if (!NB || MM.stream || MM.starting) return;
    MM.starting = true; MM.err = '';
    try {
      const src = await NB.minimap.source();
      if (!src || !src.sourceId) throw new Error('aucun écran trouvé');
      MM.stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: src.sourceId, maxWidth: 3840, maxHeight: 2160, maxFrameRate: 30 } } });
      MM.video = MM.video || Object.assign(document.createElement('video'), { muted: true, playsInline: true });
      MM.video.srcObject = MM.stream; await MM.video.play();
      cancelAnimationFrame(MM.raf); MM.raf = requestAnimationFrame(mmLoop);
    } catch (e) { MM.err = e.message || String(e); MM.stream = null; }
    MM.starting = false; mmPlace();
  }
  function mmStop() { if (MM.stream) MM.stream.getTracks().forEach((t) => t.stop()); MM.stream = null; cancelAnimationFrame(MM.raf); }
  function mmLoop() {
    const cv = MM.canvas, v = MM.video;
    if (cv && cv.isConnected && v && v.videoWidth) {
      const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      if (cv.width !== Math.round(r.width * dpr) || cv.height !== Math.round(r.height * dpr)) { cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); }
      const cr = ((R.cfg || {}).minimap || {}).crop || { x: 0.857, y: 0.745, w: 0.14, h: 0.25 };
      const sx = cr.x * v.videoWidth, sy = cr.y * v.videoHeight, sw = cr.w * v.videoWidth, sh = cr.h * v.videoHeight;
      const ctx = cv.getContext('2d'); const sc = Math.min(cv.width / sw, cv.height / sh); const dw = sw * sc, dh = sh * sc;
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cv.width, cv.height); ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(v, sx, sy, sw, sh, (cv.width - dw) / 2, (cv.height - dh) / 2, dw, dh);
    }
    MM.raf = requestAnimationFrame(mmLoop);
  }
  function mmPlaceholder() {
    if (!NB) return '<p class="muted">La mini-carte est disponible dans l\'application PC.</p>';
    /* Hors partie : image fixe de la Faille de l'invocateur */
    if (!R.live) return D.version ? `<img class="mmstatic" alt="Faille de l'invocateur" src="https://ddragon.leagueoflegends.com/cdn/${D.version}/img/map/map11.png"><span class="mmcap">La mini-carte en direct s'affichera ici pendant la partie</span>` : '<p class="muted">Faille de l\'invocateur</p>';
    if (MM.err) return `<p class="muted">Impossible de filmer l'écran du jeu : ${esc(MM.err)}.<br>Vérifie dans Réglages → Mini-carte (mode « Fenêtré sans bordure »).</p>`;
    return '<p class="muted">Connexion à l\'écran du jeu…</p>';
  }
  /* Le même canevas est replacé à chaque rafraîchissement de l'écran : pas de clignotement. */
  function mmPlace() {
    const slot = document.getElementById('mmSlot');
    if (!slot) return;
    if (MM.stream && S.opt.miniEmbed) { if (!MM.canvas) { MM.canvas = document.createElement('canvas'); MM.canvas.className = 'mmcv'; } if (MM.canvas.parentNode !== slot) { slot.innerHTML = ''; slot.appendChild(MM.canvas); } }
    else slot.innerHTML = mmPlaceholder();
  }
  function mmSync() {
    if (S.mode === 'game' && S.opt.miniEmbed && NB && R.live) { if (!MM.stream && !MM.err) mmStart(); mmPlace(); }
    else { mmStop(); MM.err = ''; mmPlace(); }
  }

  /* Écran « En jeu » : aucun bouton, tout est automatique.
     Mini-carte carrée à gauche (image fixe hors partie, capture en direct en partie), joueurs et objectifs à droite. */
  const OBJ_IC = { drake: '🐉', grubs: '🪲', herald: '🦀', baron: '👾', elder: '🔥' };
  const firstAt = { drake: '5:00', grubs: '8:00', herald: '15:00', baron: '20:00', elder: 'l\'âme' };
  function objectivesCard(L) {
    const myTeam = L && L.me ? L.me.team : 'ORDER';
    const O = Builds.objectives(L, myTeam);
    const status = (r) => {
      if (!L) return `<span class="muted">à ${firstAt[r.id]}</span>`;
      if (r.state === 'spawn') return `<span class="ocd" data-ospawn="${Date.now() + r.in * 1000}">${fmt(r.in)}</span>`;
      if (r.state === 'up') return '<span class="pos"><b>disponible</b></span>';
      return `<span class="muted">${esc(r.label || '')}</span>`;
    };

    const score = (sc) => `<span class="osc"><b class="us">${sc.us}</b><span class="muted">–</span><b class="them">${sc.them}</b></span>`;
    let h = `<div class="card objs"><div class="row sp nw"><h2 style="margin:0">🐉 Objectifs</h2><span class="small muted">apparition · pris 🟦 nous – 🟥 eux</span></div>`;
    h += O.rows.map((r) => `<div class="orow ${r.state}"><span class="oic">${OBJ_IC[r.id]}</span><div class="onm"><b>${esc(r.name)}</b>${r.id === 'drake' && (O.drakeTypes.us.length || O.drakeTypes.them.length) ? `<span class="small muted ell">🟦 ${O.drakeTypes.us.join(', ') || '—'} · 🟥 ${O.drakeTypes.them.join(', ') || '—'}</span>` : ''}</div><div class="ost">${status(r)}</div>${score(r.score)}</div>`).join('');
    h += `<div class="orow"><span class="oic">🏰</span><div class="onm"><b>Tours</b></div><div class="ost"></div>${score(O.turret)}</div>`;
    h += `<div class="orow"><span class="oic">💎</span><div class="onm"><b>Inhibiteurs</b></div><div class="ost"></div>${score(O.inhib)}</div>`;
    return h + '</div>';
  }

  /* =====================================================================
     ÉCRAN DE CHARGEMENT : les 10 joueurs, mon match-up, le build conseillé, les conseils
     ===================================================================== */
  function wantRecent(puuids) {
    if (!NB || !NB.players.recent) return;
    const miss = (puuids || []).filter((id) => id && !(id in R.recent) && !R.recentPending.has(id));
    if (!miss.length) return;
    miss.forEach((id) => R.recentPending.add(id));
    NB.players.recent(miss).then((res) => { miss.forEach((id) => { R.recent[id] = (res || {})[id] || null; }); })
      .catch(() => { miss.forEach((id) => { R.recent[id] = null; }); })
      .finally(() => { miss.forEach((id) => R.recentPending.delete(id)); soon(); });
  }
  /* La partie a vraiment commencé : le chrono tourne ou le jeu a envoyé l'événement « GameStart » (pendant l'écran
     de chargement, le jeu peut déjà répondre avec un chrono à 0) */
  const started = (L) => !!(L && (L.time > 1 || (L.events || []).some((e) => e.name === 'GameStart')));
  const isLoading = () => !started(R.live) && /GameStart|InProgress|Reconnect/.test(R.lcu.phase || '') && !!(R.lcu.game && !R.lcu.game.ended && (R.lcu.game.players || []).length);
  /* Incrustation sur l'écran de chargement : seulement quand le jeu est lancé (phase « en partie » depuis 3 s,
     ou le jeu répond déjà), pas pendant le lancement où l'écran du jeu n'est pas encore affiché */
  const loadScreenShown = () => isLoading() && (!!R.live || (R.lcu.phase !== 'GameStart' && R.inProgressAt && Date.now() - R.inProgressAt >= 3000));
  function wantFull(id) { if (!id || R.full[id] || R.full[id] === null) return; R.full[id] = null; Dd.champFull(id).then((f) => { R.full[id] = f; soon(); }).catch(() => {}); }
  function loadingData() {
    const g = R.lcu.game, sp = R.lcu.summoner;
    const meG = g.players.find((p) => sp && p.puuid && p.puuid === sp.puuid) || null;
    const myTeam = meG ? meG.team : 'ORDER';
    const teams = [g.players.filter((p) => p.team === myTeam), g.players.filter((p) => p.team !== myTeam)];
    const role = new Map();
    for (const t of teams) {
      const fixed = {};
      t.forEach((p) => {
        let r = p.role;
        if (!r && p === meG && S.lastPick && +S.lastPick.champ === +p.champ) r = S.lastPick.role;
        if (!r && (p.spells || []).includes(11)) r = 'jungle';
        if (r && p.champ) fixed[p.champ] = r;
      });
      const keys = t.map((p) => p.champ).filter(Boolean);
      const dist = NB && keys.length ? cached('rd:' + keys.slice().sort().join(','), () => NB.stats.roleDist(keys)) : {};
      let as = {};
      try { as = Builds.assignRoles(keys, D, dist || {}, fixed); } catch (e) { as = fixed; }
      t.forEach((p) => role.set(p, as[p.champ] || fixed[p.champ] || ''));
    }
    const myRole = meG ? role.get(meG) : '';
    const oppG = (R.loadOpp && teams[1].find((p) => +p.champ === +R.loadOpp)) || (myRole && teams[1].find((p) => role.get(p) === myRole)) || null;
    return { g, meG, myTeam, teams, role, myRole, oppG };
  }
  const recentTxt = (r) => (r === undefined ? '…' : !r ? 'historique indisponible' : `${r.wins} V / ${r.games - r.wins} D (${Math.round((100 * r.wins) / r.games)} %)`);
  const kdaTxt = (r) => (r === undefined ? '…' : !r ? '—' : `${f1(r.k)} / ${f1(r.d)} / ${f1(r.a)} · ${f1(r.kda)}`);
  const formOf = (r) => (!r || r.games < 5 ? '' : r.wins / r.games >= 0.7 ? 'hot' : r.wins / r.games <= 0.3 ? 'cold' : '');
  function loadCard(p, ld, enemy) {
    const c = byKey(p.champ), r = R.recent[p.puuid], role = ld.role.get(p), f = formOf(r);
    const isOpp = enemy && ld.oppG === p;
    return `<div class="ldc ${enemy ? 'enemy' : 'ally'} ${p === ld.meG ? 'me' : ''} ${isOpp ? 'opp' : ''}" ${enemy ? `data-act="loadOpp" data-val="${p.champ}" title="Désigner comme mon adversaire de voie"` : ''}>
      <div class="ldh">${cIcon(c, 'ico')}<div class="grow"><b class="ell">${esc(c ? c.name : '?')}</b><span class="small muted ell">${role ? ROLE_IC[role] + ' ' + ROLE_NAME[role] + ' · ' : ''}${esc(p.name || '')}</span></div>${isOpp ? '<span class="tag gold">adversaire</span>' : p === ld.meG ? '<span class="tag gold">toi</span>' : ''}</div>
      <div class="ldr">${rankTag(p.puuid) || '<span class="rk unr">…</span>'}</div>
      <div class="ldr"><span class="muted small">10 dernières</span><b class="${f === 'hot' ? 'pos' : f === 'cold' ? 'neg' : ''}">${recentTxt(r)}${f === 'hot' ? ' 🔥' : ''}</b></div>
      <div class="ldr"><span class="muted small">KDA moyen</span><span>${kdaTxt(r)}</span></div>
      <div class="ldr"><span class="muted small">Dégâts</span>${c ? dmgTag(c) : ''}</div></div>`;
  }
  /* ---------- Recommandations d'objets (une seule source pour le build ET les conseils) ---------- */
  const legOf = (f) => D.itemList.filter((it) => Builds.isLegendary(it) && f(it)).sort((a, b) => a.gold.total - b.gold.total);
  const okItem = (id) => { const it = D.items && D.items[String(id)]; return it && it.gold && it.gold.purchasable !== false && it.maps && it.maps['11'] ? +id : 0; };
  const firstOk = (ids, fallback) => { for (const id of ids) if (okItem(id)) return +id; const f = fallback ? fallback() : null; return f ? +f.id : 0; };
  const itemNm = (id) => ((D.items || {})[String(id)] || {}).name || '';
  /* Profil de mon champion pour choisir des objets : AP, AD tireur, AD combattant/assassin, tank, support */
  function myKit(c, role) {
    const t = dmgOf(c).t, tags = c.tags || [];
    const tank = tags.includes('Tank') && !tags.includes('Mage');
    const kind = role === 'support' && !tags.includes('Mage') && !tank ? 'enchanter' : tank ? 'tank' : t === 'AP' || (t !== 'AD' && tags.includes('Mage')) ? 'ap' : tags.includes('Marksman') ? 'marksman' : tags.includes('Assassin') ? 'assassin' : 'fighter';
    return { kind, ap: kind === 'ap' || kind === 'enchanter', tag: kind === 'tank' ? 'Health' : kind === 'ap' || kind === 'enchanter' ? 'SpellDamage' : 'Damage' };
  }
  const CORE = { ap: [6655, 4645, 3089, 6653, 3116, 3165], marksman: [6672, 3031, 3094, 3046, 3036], assassin: [3142, 6694, 6692, 3814, 6676], fighter: [3078, 3071, 3053, 6333, 3074], tank: [3068, 3075, 3065, 3143, 2502], enchanter: [6617, 3107, 2065, 3504, 3222] };
  const DEF = {
    armor: { ap: [3157], marksman: [3026, 6333], assassin: [3026, 6333], fighter: [6333, 3026], tank: [3075, 3143], enchanter: [3190, 3109] },
    mr: { ap: [3102], marksman: [3139, 3156], assassin: [3156, 3139], fighter: [3156, 3065], tank: [4401, 3065], enchanter: [3222, 3190] },
    heal: { ap: [3165], marksman: [3033], assassin: [6609, 3033], fighter: [6609, 3075], tank: [3075, 6609], enchanter: [3011, 3165] },
    pen: { ap: [3135, 4645], marksman: [3036, 6694], assassin: [6694, 3036], fighter: [3071, 6694], tank: [], enchanter: [3135] },
    burst: { ap: [3157, 3102], marksman: [3026, 3139], assassin: [3026, 3156], fighter: [3053, 6333], tank: [], enchanter: [3190] },
  };
  function teamRecos(ld, c, role) {
    const en = ld.teams[1].map((p) => byKey(p.champ)).filter(Boolean);
    if (!en.length || !c) return [];
    const K = myKit(c, role);
    const ad = en.map((x) => champAd(x)), apShare = 1 - ad.reduce((a, b) => a + b, 0) / ad.length;
    const prof = Builds.teamProfile(en.map((x) => +x.key), D) || { tanks: [], healers: [] };
    const nm = (ids) => ids.map((id) => (D.champs[id] || {}).name || id).join(', ');
    const out = [];
    const add = (id, text, ids, f) => { const items = [...new Set(ids.map(okItem).filter(Boolean))].slice(0, 2); if (!items.length && f) { const x = legOf(f)[0]; if (x) items.push(+x.id); } if (items.length) out.push({ id, text, items }); };
    if (prof.healers.length) add('heal', `Soins importants en face (${nm(prof.healers)}) : prends un objet anti-soins`, DEF.heal[K.kind], (it) => /blessures graves|grievous/i.test(it.description || ''));
    if (apShare >= 0.58) add('mr', `Équipe surtout magique (${Math.round(apShare * 100)} % AP) : de la résistance magique`, DEF.mr[K.kind], (it) => (it.tags || []).includes('SpellBlock'));
    else if (apShare <= 0.42) add('armor', `Équipe surtout physique (${Math.round((1 - apShare) * 100)} % AD) : de l'armure`, DEF.armor[K.kind], (it) => (it.tags || []).includes('Armor'));
    if (prof.tanks.length >= 2 && K.kind !== 'tank') add('pen', `${prof.tanks.length} tanks en face (${nm(prof.tanks)}) : de la pénétration`, DEF.pen[K.kind], (it) => (it.tags || []).includes(K.ap ? 'MagicPenetration' : 'ArmorPenetration'));
    const ass = en.filter((x) => x.tags.includes('Assassin'));
    if (ass.length >= 2 && K.kind !== 'tank') add('burst', `${ass.length} assassins (${ass.map((x) => x.name).join(', ')}) : un objet qui te sauve d'un burst`, DEF.burst[K.kind]);
    return out;
  }
  /* Bottes : selon les dégâts de l'équipe adverse (et de mon adversaire de voie) */
  function bootsFor(c, role, ld) {
    const K = myKit(c, role);
    if (K.kind === 'enchanter') return firstOk([3158, 3020]);
    const en = ld.teams[1].map((p) => byKey(p.champ)).filter(Boolean);
    const apShare = en.length ? 1 - en.map(champAd).reduce((a, b) => a + b, 0) / en.length : 0.5;
    if (apShare >= 0.6) return firstOk([3111]);
    if (apShare <= 0.4 && K.kind !== 'marksman') return firstOk([3047]);
    return firstOk(K.kind === 'marksman' ? [3006] : K.kind === 'ap' ? [3020, 3158] : [3047, 3111]);
  }
  function startFor(c, role, oc) {
    const K = myKit(c, role), melee = (c.stats.attackrange || 500) < 300;
    if (role === 'support') return [firstOk([3865]), 2003].filter(Boolean);
    if (role === 'jungle') return [firstOk([1102, 1101, 1103]), 2003].filter(Boolean);
    if (K.ap) return [firstOk([1056]), 2003, 2003].filter(Boolean);
    if (K.kind === 'tank' || (melee && oc && (oc.stats.attackrange || 0) >= 400)) return [firstOk([1054]), 2003].filter(Boolean);
    return [firstOk([1055]), 2003].filter(Boolean);
  }
  function loadBuild(ld) {
    if (!ld.meG || !D.champs) return null;
    const c = byKey(ld.meG.champ); if (!c) return null;
    const role = ld.myRole, oc = ld.oppG ? byKey(ld.oppG.champ) : null;
    const enemyKeys = ld.teams[1].map((p) => +p.champ).filter(Boolean);
    const rows = role && NB ? cached(`builds:${c.key}:${role}`, () => NB.stats.builds(+c.key, role, 30)) : null;
    if (rows === undefined) return { c, role, oc, loading: true };
    let A = null;
    if (rows && rows.length) {
      const mk = `load:${c.key}:${role}:${oc ? oc.key : 0}:${enemyKeys.join(',')}:${rows.length}`;
      if (R.loadMemo && R.loadMemo.k === mk) A = R.loadMemo.A; else { A = Builds.analyze(rows, D, { opp: oc ? +oc.key : 0, enemies: enemyKeys }); R.loadMemo = { k: mk, A }; }
    }
    const fromStats = !!(A && A.games);
    const K = myKit(c, role);
    const recos = teamRecos(ld, c, role);
    /* Statistiques : objets adaptés à l'équipe adverse trouvés dans les parties des bons joueurs, ajoutés aux recommandations */
    if (fromStats) (A.situational || []).forEach((x) => { const r = recos.find((y) => y.id === x.id); const ids = x.items.map((o) => o.item).filter(okItem); if (r) r.items = [...new Set(ids.concat(r.items))].slice(0, 2); else if (ids.length) recos.push({ id: x.id, text: x.why, items: ids.slice(0, 2) }); });
    const start = fromStats && A.start && A.start[0] ? A.start[0].items : startFor(c, role, oc);
    let core = fromStats && A.core && A.core[0] ? A.core[0].items.slice() : [];
    if (fromStats && A.later) A.later.forEach((x) => { if (core.length < 3 && !core.includes(x.item)) core.push(x.item); });
    if (core.length < 3) CORE[K.kind].map(okItem).filter(Boolean).forEach((id) => { if (core.length < 3 && !core.includes(id)) core.push(id); });
    if (core.length < 3) legOf((it) => (it.tags || []).includes(K.tag)).forEach((it) => { if (core.length < 3 && !core.includes(+it.id)) core.push(+it.id); });
    const boots = fromStats && A.boots && A.boots[0] ? A.boots[0].item : bootsFor(c, role, ld);
    /* Objets suivants : d'abord ceux qui répondent à l'équipe adverse, puis la suite habituelle */
    const next = [];
    recos.forEach((r) => r.items.forEach((id) => { if (!core.includes(id) && !next.includes(id)) next.push(id); }));
    (fromStats && A.later ? A.later.map((x) => x.item) : CORE[K.kind].map(okItem)).forEach((id) => { if (id && next.length < 5 && !core.includes(id) && !next.includes(id)) next.push(id); });
    return { c, role, oc, K, fromStats, games: fromStats ? A.games : 0, adapted: fromStats && A.adapted, start, core: core.slice(0, 3), boots, next: next.slice(0, 5), recos };
  }
  /* Conseils pour mon match-up : texte + objets (images) */
  function matchupTips(ld, b) {
    const c = b && b.c, oc = b && b.oc;
    if (!c || !oc) return [];
    wantFull(oc.id); wantFull(c.id);
    const fo = R.full[oc.id], tips = [], K = b.K || myKit(c, b.role);
    const T = (t, items) => tips.push({ t, items: (items || []).filter(Boolean) });
    const rc = c.stats.attackrange || 0, ro = oc.stats.attackrange || 0;
    if (rc - ro >= 150) T(`Tu as plus de portée (${rc} contre ${ro}) : touche-le avec tes attaques quand il s'approche de tes sbires pour les achever.`);
    else if (ro - rc >= 150) T(`Il a plus de portée (${ro} contre ${rc}) : échange seulement quand tes sorts sont prêts, et accepte de perdre quelques sbires plutôt que ta vie.${startFor(c, b.role, oc).includes(1054) ? ` L'${itemNm(1054)} t'aide à tenir la voie.` : ''}`, startFor(c, b.role, oc).includes(1054) ? [1054] : []);
    const od = dmgOf(oc).t;
    if (od === 'AD') { const bo = okItem(3047); T(`Ses dégâts sont physiques : prends le fragment d'armure${bo && K.kind !== 'marksman' && K.kind !== 'enchanter' ? ` et, plus tard, les ${itemNm(bo)}` : ''}.`, bo && K.kind !== 'marksman' && K.kind !== 'enchanter' ? [bo] : []); }
    else if (od === 'AP') { const bo = okItem(3111); T(`Ses dégâts sont magiques : prends le fragment de résistance magique${bo && K.kind !== 'enchanter' ? ` et, plus tard, les ${itemNm(bo)}` : ''}.`, bo && K.kind !== 'enchanter' ? [bo] : []); }
    if (oc.tags.includes('Assassin')) { const d = DEF.burst[K.kind].map(okItem).filter(Boolean)[0]; T(`C'est un assassin : il cherche à te tuer d'un coup. Garde Saut éclair pour fuir et ne reste pas à moitié de vie dans ta voie${d ? `. Contre lui, ${itemNm(d)} est très utile` : ''}.`, d ? [d] : []); }
    else if (oc.tags.includes('Tank')) T('C\'est un tank : il encaisse beaucoup. Ne t\'acharne pas sur lui, farme et va aider ailleurs quand il ne fait rien.');
    else if (oc.tags.includes('Marksman')) T('C\'est un tireur : très fort en fin de partie. Prends l\'avantage tôt, avant qu\'il ait ses objets.');
    else if (oc.tags.includes('Mage')) T('C\'est un mage : déplace-toi de côté pour esquiver ses sorts, et attaque juste après qu\'il les a utilisés.');
    else if (oc.tags.includes('Fighter')) T('C\'est un combattant : les combats longs l\'avantagent souvent. Fais des échanges courts puis recule.');
    if (fo && fo.spells && fo.spells[3]) T(`Méfie-toi à partir du niveau 6 : son ultime « ${fo.spells[3].name} » change les combats.`);
    if (fo && (fo.enemytips || []).length) fo.enemytips.slice(0, 3).forEach((t) => T('Conseil de Riot : ' + Dd.plain(t)));
    const mu = NB && b.role ? cached(`mu:${c.key}:${oc.key}:${b.role}`, () => NB.stats.matchup(+c.key, +oc.key, b.role, 30)) : null;
    if (mu && mu.games >= 5) T(`D'après le collecteur : ${c.name} gagne ${Math.round((100 * mu.wins) / mu.games)} % de ses parties contre ${oc.name} (${mu.games} parties de très bons joueurs).`);
    const r = ld.oppG && R.recent[ld.oppG.puuid];
    if (formOf(r) === 'hot') T(`Ton adversaire est en forme : ${r.wins} victoires sur ses ${r.games} dernières parties. Joue prudemment au début.`);
    if (formOf(r) === 'cold') T(`Ton adversaire est en difficulté : seulement ${r.wins} victoires sur ses ${r.games} dernières parties.`);
    return tips;
  }
  /* Conseils face à l'ensemble de l'équipe adverse : mêmes objets que dans le build conseillé */
  const SCALERS = new Set(['Kayle', 'Kassadin', 'Vayne', 'Jinx', 'Veigar', 'Nasus', 'Smolder', 'KogMaw', 'AurelionSol', 'Azir', 'Cassiopeia', 'Senna', 'Twitch', 'Viktor', 'Ryze', 'Kindred', 'Gangplank', 'Jax', 'Zeri', 'Aphelios']);
  function teamTips(ld, b) {
    const en = ld.teams[1].map((p) => ({ p, c: byKey(p.champ) })).filter((x) => x.c);
    if (!en.length) return [];
    const names = (l) => l.map((x) => x.c.name).join(', ');
    const tips = [];
    const T = (t, items) => tips.push({ t, items: (items || []).filter(Boolean) });
    (b && b.recos ? b.recos : []).forEach((r) => T(`${r.text} : ${r.items.map(itemNm).join(' ou ')}.`, r.items));
    if (!(b && b.recos && b.recos.some((r) => r.id === 'mr' || r.id === 'armor'))) T('Dégâts mixtes en face : équilibre armure et résistance magique.');
    const engage = en.filter((x) => x.c.tags.includes('Tank') && (x.c.tags.includes('Support') || x.c.tags.includes('Fighter')));
    if (engage.length) T(`Ils peuvent engager fort (${names(engage)}) : reste derrière tes tanks en combat et garde Saut éclair pour te dégager.`);
    const poke = en.filter((x) => (x.c.stats.attackrange || 0) >= 500 && (x.c.tags.includes('Mage') || x.c.tags.includes('Marksman')));
    if (poke.length >= 3) T(`Composition à distance (${names(poke)}) : évitez de rester dans leur portée ; foncez sur eux tous ensemble ou passez par les côtés.`);
    const sc = en.filter((x) => SCALERS.has(x.c.id));
    if (sc.length) T(`${names(sc)} devien${sc.length > 1 ? 'nent' : 't'} très fort${sc.length > 1 ? 's' : ''} en fin de partie : prenez de l'avance tôt et essayez de finir avant 30 min.`);
    const hot = ld.teams[1].filter((p) => formOf(R.recent[p.puuid]) === 'hot');
    if (hot.length) T(`En forme en face : ${hot.map((p) => `${(byKey(p.champ) || {}).name} (${R.recent[p.puuid].wins}/${R.recent[p.puuid].games})`).join(', ')}.`);
    const kd = ld.teams[1].filter((p) => R.recent[p.puuid]).sort((a, c2) => R.recent[c2.puuid].kda - R.recent[a.puuid].kda)[0];
    if (kd && R.recent[kd.puuid].kda >= 3.5) T(`Le joueur le plus dangereux semble être ${(byKey(kd.champ) || {}).name} (KDA moyen ${f1(R.recent[kd.puuid].kda)} sur ses dernières parties).`);
    return tips;
  }
  const tipLi = (x) => `<li>${esc(x.t)}${x.items.length ? `<span class="tipit">${x.items.map((id) => `<button class="bi" data-act="item" data-val="${id}" title="${esc(itemNm(id))}">${itIcon(id, 'ico xs')}<span>${esc(itemNm(id))}</span></button>`).join('')}</span>` : ''}</li>`;
  function viewLoading() {
    const ld = loadingData();
    wantInfo(ld.g.players.map((p) => p.puuid)); wantRecent(ld.g.players.map((p) => p.puuid));
    loadovSync(ld);
    const b = loadBuild(ld);
    const ic = (id) => (id ? `<button class="bi" data-act="item" data-val="${id}">${itIcon(id, 'ico xs')}</button>` : '');
    let h = `<div class="row sp"><h1>⏳ Chargement de la partie</h1><span class="small muted">${esc(QUEUE[ld.g.queueId] || '')}</span></div>`;
    h += `<div class="card"><h2>🟦 Mon équipe</h2><div class="ldgrid">${ld.teams[0].map((p) => loadCard(p, ld, false)).join('')}</div></div>`;
    h += `<div class="card"><h2>🟥 Adversaires <span class="small muted">· clique un adversaire pour le désigner comme ton adversaire de voie</span></h2><div class="ldgrid">${ld.teams[1].map((p) => loadCard(p, ld, true)).join('')}</div></div>`;
    h += '<div class="cols"><div>';
    if (!b) h += '<div class="card"><p class="muted">Ton champion n\'est pas encore connu.</p></div>';
    else if (b.loading) h += '<div class="card"><div class="loader small">Calcul du build…</div></div>';
    else {
      const following = S.gameBuild && S.gameBuild.gameId === ld.g.gameId && S.gameBuild.champ === b.c.id;
      h += `<div class="card gold"><div class="row sp nw"><h2 style="margin:0">🛒 Build conseillé · ${esc(b.c.name)}${b.oc ? ' vs ' + esc(b.oc.name) : ''}</h2></div>
        <p class="small muted">${b.fromStats ? `D'après ${nf(b.games)} parties de très bons joueurs (collecteur)${b.adapted ? ', adapté à ton adversaire' : ''}, complété avec les objets contre l'équipe adverse.` : 'Règles générales selon ton champion, ton adversaire de voie et l\'équipe adverse (le collecteur n\'a pas encore assez de parties pour ce champion et ce rôle).'}</p>
        <div class="mybuild compact" style="border:0;padding:0;background:none">
        <div class="brow"><span class="small muted">Départ</span><div class="bis">${b.start.map(ic).join('')}</div></div>
        <div class="brow"><span class="small muted">Principaux</span><div class="bis">${b.core.map(ic).join('<span class="arrow">›</span>')}${b.boots ? `<span class="rsep"></span>${ic(b.boots)}` : ''}</div></div>
        ${b.next.length ? `<div class="brow"><span class="small muted">Ensuite</span><div class="bis">${b.next.map(ic).join('')}</div></div>` : ''}
        ${b.recos.map((x) => `<div class="brow sub"><span></span><div class="bis small muted">↳ ${x.items.map((id) => itIcon(id, 'ico xxs')).join('')} ${esc(x.text)}</div></div>`).join('')}
        </div>
        <div class="row" style="margin-top:8px">${following ? '<span class="pill on">✅ Suivi dans l\'encart en jeu</span><button class="btn ghost small" data-act="unfollowGameBuild">Ne plus suivre</button>' : `<button class="btn small" data-act="followGameBuild">⭐ Suivre ce build dans l'encart en jeu</button>`}</div></div>`;
    }
    h += '</div><div>';
    const mt = matchupTips(ld, b);
    h += `<div class="card"><h2>🎯 Mon match-up${b && b.oc ? ` contre ${esc(b.oc.name)}` : ''}</h2>${mt.length ? `<ul class="tips">${mt.map(tipLi).join('')}</ul>` : '<p class="muted small">Adversaire de voie inconnu : clique un adversaire ci-dessus.</p>'}</div>`;
    const tt = teamTips(ld, b && !b.loading ? b : null);
    h += `<div class="card"><h2>🛡️ Face à l'équipe adverse</h2><ul class="tips">${tt.map(tipLi).join('')}</ul></div>`;
    h += '</div></div>';
    R.loadBuildCur = b;
    return h;
  }
  /* Infos envoyées à l'encart par-dessus l'écran de chargement */
  function loadovSync(ld) {
    if (!NB || !NB.loadov) return;
    let d = null;
    if (ld && loadScreenShown() && D.champs) {
      const P = (p, t) => {
        const c = byKey(p.champ), r = R.recent[p.puuid], i = R.pinfo[p.puuid], q = i && (i.solo || i.flex);
        const role = ld.role.get(p);
        return { champ: c ? c.name : '?', icon: c ? Dd.img.champ(c) : '', name: p.name || '', role: role ? ROLE_NAME[role] : '', me: p === ld.meG,
          rank: q ? `${TIER[q.tier] || q.tier}${q.division ? ' ' + q.division : ''}` : i === undefined ? '…' : 'Non classé', level: i && i.level ? i.level : 0,
          wr: r === undefined ? '…' : r ? `${r.wins} V / ${r.games - r.wins} D` : '—', wrClass: formOf(r) === 'hot' ? 'pos' : formOf(r) === 'cold' ? 'neg' : '',
          kda: r === undefined ? '…' : r ? `${f1(r.k)}/${f1(r.d)}/${f1(r.a)} (${f1(r.kda)})` : '—', dmg: c ? dmgOf(c).t : '' };
      };
      d = { teams: ld.teams.map((t, i) => ({ side: t[0] ? t[0].team : (i ? 'CHAOS' : 'ORDER'), mine: i === 0, players: t.map((p) => P(p)) })) };
    }
    const k = JSON.stringify(d);
    if (k === R.loadovKey) return;
    R.loadovKey = k;
    NB.loadov.update(d).catch(() => {});
  }
  function viewGame() {
    const nd = needData();
    const L = R.live;
    if (!nd && isLoading()) return viewLoading();
    if (!L && R.post && R.post.status && !nd) return viewPost();
    const showMap = S.opt.miniEmbed && NB;
    const mapCard = showMap ? `<div class="gm-map card"><div id="mmSlot" class="mmslot">${mmPlaceholder()}</div></div>` : '';
    if (nd) return `<div class="gm ${showMap ? '' : 'nomap'}">${mapCard}<div class="gm-side">${nd}</div></div>`;
    const players = L ? playersPanel(L) : `<div class="card players"><h2>👥 Joueurs</h2><p class="muted idle">${NB ? 'Aucune partie en cours. Dès que la partie démarre, Noob LOL bascule ici tout seul et affiche les 10 joueurs avec leur rang, leur niveau, leurs kills, morts, assistances, objets et leur profil AD / AP. À la fin de la partie, toutes les statistiques s\'affichent ici.' : 'Disponible dans l\'application PC pendant une partie.'}</p></div>`;
    let side = '';
    if (L) {
      const me = L.me && L.me.stats ? L.me : null; const c = me ? D.champs[me.champ] : null;
      side += `<div class="card gm-strip"><span class="clock">${fmt(L.time)}</span>${me ? `<div class="gm-me">${cIcon(c, 'ico')}<div class="grow"><b>${esc(c ? c.name : '')} · niv. ${me.level}</b><span class="muted small">❤️ ${me.stats.hp}/${me.stats.maxHp} · ⚔️ ${me.stats.ad} · 🔮 ${me.stats.ap} · 🛡️ ${me.stats.armor}/${me.stats.mr} · 👟 ${me.stats.ms}</span></div><span class="gold-big">${nf(me.gold)} 🪙</span></div>` : ''}</div>`;
    }
    side += players;
    const journal = S.game.log.length && L ? `<div class="card journal"><h2>📜 Journal</h2><div class="log">${S.game.log.slice(0, 14).map((l) => `<div class="small"><span class="muted">${fmt(l.t)}</span> ${esc(l.txt)}</div>`).join('')}</div></div>` : '';
    const build = L ? buildCard(L) : '';
    side += (build || journal) ? `<div class="gm-tools"><div>${objectivesCard(L)}</div><div>${build}${journal}</div></div>` : objectivesCard(L);
    return `<div class="gm ${showMap ? '' : 'nomap'}">${mapCard}<div class="gm-side">${side}</div></div>`;
  }

  /* =====================================================================
     FIN DE PARTIE : toutes les statistiques, en onglets
     ===================================================================== */
  const POST_TABS = [['resume', '🏁', 'Résumé'], ['equipe', '📈', 'Équipe'], ['moi', '🙋', 'Ma partie'], ['morts', '💀', 'Mes morts'], ['carte', '🗺️', 'Carte'], ['degats', '⚔️', 'Dégâts'], ['or', '🪙', 'Or et farm'], ['vision', '👁️', 'Vision'], ['builds', '🛒', 'Builds']];
  const k1 = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace('.', ',') + 'k' : String(Math.round(n || 0)));
  function curveSvg(vals, { title = '', unit = 'po' } = {}) {
    if (!vals || vals.length < 2) return '<p class="muted small">Courbe indisponible.</p>';
    const W = 640, H = 170, P = 26;
    const max = Math.max(1000, ...vals.map((v) => Math.abs(v)));
    const x = (i) => P + (i * (W - 2 * P)) / (vals.length - 1), y = (v) => H / 2 - (v / max) * (H / 2 - 14);
    const pts = vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const ticks = []; for (let m = 0; m < vals.length; m += 5) ticks.push(`<text x="${x(m)}" y="${H - 2}" class="tk">${m}'</text><line x1="${x(m)}" x2="${x(m)}" y1="10" y2="${H - 14}" class="gl"/>`);
    return `<figure class="curve"><figcaption class="small muted">${esc(title)}</figcaption><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${esc(title)}">
      <defs><clipPath id="cup"><rect x="0" y="0" width="${W}" height="${H / 2}"/></clipPath><clipPath id="cdn"><rect x="0" y="${H / 2}" width="${W}" height="${H / 2}"/></clipPath></defs>
      ${ticks.join('')}<line x1="${P}" x2="${W - P}" y1="${H / 2}" y2="${H / 2}" class="zero"/>
      <polygon points="${x(0)},${H / 2} ${pts} ${x(vals.length - 1)},${H / 2}" class="aup" clip-path="url(#cup)"/><polygon points="${x(0)},${H / 2} ${pts} ${x(vals.length - 1)},${H / 2}" class="adn" clip-path="url(#cdn)"/>
      <polyline points="${pts}" class="ln"/><text x="${P}" y="12" class="tk">+${k1(max)} ${unit}</text><text x="${P}" y="${H - 16}" class="tk">−${k1(max)} ${unit}</text></svg></figure>`;
  }
  /* ---------- Graphiques de fin de partie (SVG, sans bibliothèque) ---------- */
  const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');
  const pctS = (v) => `${Math.round((v || 0) * 100)} %`;
  /* Plusieurs courbes sur la même échelle, en minutes */
  function lineChart(series, { title = '', unit = '', H = 170, fmtY = k1, legend = true, tickEvery = 5, tickLabel = (m) => `${m}'`, min0 = true } = {}) {
    const ss = series.filter((x) => x.vals && x.vals.length > 1);
    if (!ss.length) return '<p class="muted small">Courbe indisponible (chronologie de la partie non publiée).</p>';
    const W = 640, P = 34, n = Math.max(...ss.map((x) => x.vals.length));
    const all = ss.flatMap((x) => x.vals); const max = Math.max(min0 ? 1 : -Infinity, ...all), min = min0 ? Math.min(0, ...all) : Math.min(...all);
    const x = (i) => P + (i * (W - P - 8)) / Math.max(1, n - 1), y = (v) => H - 16 - ((v - min) / (max - min || 1)) * (H - 30);
    const ticks = []; for (let m = 0; m < n; m += tickEvery) ticks.push(`<line x1="${x(m)}" x2="${x(m)}" y1="10" y2="${H - 16}" class="gl"/><text x="${x(m)}" y="${H - 3}" class="tk">${tickLabel(m)}</text>`);
    const lines = ss.map((sr) => `<polyline points="${sr.vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')}" class="sr ${sr.cls || ''}"${sr.dash ? ' stroke-dasharray="5 4"' : ''}/>`).join('');
    /* valeurs finales, écartées si elles se chevauchent */
    const ends = ss.map((sr) => ({ sr, v: sr.vals[sr.vals.length - 1], yy: y(sr.vals[sr.vals.length - 1]) - 4 })).sort((a, b) => a.yy - b.yy);
    for (let i = 1; i < ends.length; i++) if (ends[i].yy - ends[i - 1].yy < 13) ends[i].yy = ends[i - 1].yy + 13;
    const last = ends.map((e) => `<text x="${W - 6}" y="${Math.min(H - 18, e.yy).toFixed(1)}" class="tk end ${e.sr.cls || ''}">${esc(fmtY(e.v))}</text>`).join('');
    return `<figure class="curve chart"><figcaption class="small muted">${esc(title)}</figcaption><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${esc(title)}">${ticks.join('')}
      ${min < 0 ? `<line x1="${P}" x2="${W - 8}" y1="${y(0)}" y2="${y(0)}" class="zero"/>` : ''}<text x="2" y="16" class="tk">${esc(fmtY(max))}${unit ? ' ' + unit : ''}</text><text x="2" y="${H - 18}" class="tk">${esc(fmtY(min))}</text>${lines}${last}</svg>
      ${legend && ss.length > 1 ? `<div class="lgd">${ss.map((sr) => `<span><i class="${sr.cls || ''}"></i>${esc(sr.label || '')}</span>`).join('')}</div>` : ''}</figure>`;
  }
  /* Frise des objectifs : en haut ceux de mon équipe, en bas ceux des adversaires */
  const OBJ_EMO = { drake: '🐉', elder: '🔥', baron: '👾', herald: '🦀', grubs: '🪲', atakhan: '🦅', tower: '🏰', inhib: '💎', other: '⭐' };
  function objStrip(G) {
    const evs = G.T.objEv.concat(G.T.buildEv).filter((e) => e.side);
    if (!evs.length) return '<p class="muted small">Aucun objectif dans la chronologie.</p>';
    const W = 1100, H = 96, P = 16, x = (t) => P + (t / Math.max(60, G.dur)) * (W - 2 * P);
    const ticks = []; for (let m = 0; m * 60 <= G.dur; m += 5) ticks.push(`<line x1="${x(m * 60)}" x2="${x(m * 60)}" y1="40" y2="52" class="gl"/><text x="${x(m * 60)}" y="${H / 2 + 4}" class="tk mid">${m}'</text>`);
    /* on décale les icônes qui se chevauchent */
    const lanes = { us: [], them: [] };
    const icons = evs.sort((a, b) => a.t - b.t).map((e) => {
      const L = lanes[e.side]; let row = 0; while (L[row] != null && x(e.t) - L[row] < 15) row++; L[row] = x(e.t);
      const yy = e.side === 'us' ? 30 - row * 13 : 66 + row * 13;
      return `<text x="${x(e.t).toFixed(1)}" y="${yy}" class="emo"><title>${fmt(e.t)} · ${esc({ drake: 'Dragon ' + (e.sub || '').replace(/_DRAGON/, '').toLowerCase(), elder: 'Dragon ancestral', baron: 'Baron Nashor', herald: 'Héraut', grubs: 'Larve du Néant', atakhan: 'Atakhan', tower: 'Tour', inhib: 'Inhibiteur', other: 'Objectif' }[e.kind])} (${e.side === 'us' ? 'nous' : 'eux'})</title>${OBJ_EMO[e.kind] || '⭐'}</text>`;
    }).join('');
    return `<figure class="curve strip"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Frise des objectifs"><rect x="${P}" y="42" width="${W - 2 * P}" height="8" rx="4" class="axis"/>${ticks.join('')}<text x="${W - P}" y="10" class="tk end us">🟦 nous</text><text x="${W - P}" y="${H - 2}" class="tk end them">🟥 eux</text>${icons}</svg></figure>`;
  }
  /* Barre empilée : répartition (dégâts, or…) entre les 5 joueurs d'une équipe */
  function shareBar(t, key, side) {
    const tot = t.players.reduce((s2, p) => s2 + (p[key] || 0), 0) || 1;
    return `<div class="share ${side}">${t.players.map((p, i) => { const v = (p[key] || 0) / tot; const c = byKey(p.championId); return `<i class="s${i}" style="width:${(v * 100).toFixed(1)}%" title="${esc(c ? c.name : p.championName)} : ${pctS(v)}">${v > 0.09 ? `${esc((c ? c.name : p.championName).slice(0, 7))} ${Math.round(v * 100)}%` : ''}</i>`; }).join('')}</div>`;
  }
  /* Carte de la Faille avec les éliminations */
  function killMap(G, onlyMe) {
    const evs = onlyMe ? G.T.myEv.filter((e) => e.x != null) : G.T.killEv.filter((e) => e.x != null && e.side);
    if (!evs.length) return '<p class="muted small">Positions indisponibles (chronologie de la partie non publiée).</p>';
    const S2 = 300, X = (v) => (v / 14870) * S2, Y = (v) => S2 - (v / 14980) * S2;
    const dots = evs.map((e) => onlyMe
      ? `<circle cx="${X(e.x).toFixed(1)}" cy="${Y(e.y).toFixed(1)}" r="${e.kind === 'assist' ? 4 : 5.5}" class="ev-${e.kind}"><title>${fmt(e.t)} · ${{ kill: 'Kill', death: 'Mort', assist: 'Assistance' }[e.kind]}</title></circle>`
      : `<circle cx="${X(e.x).toFixed(1)}" cy="${Y(e.y).toFixed(1)}" r="4.5" class="k-${e.side}"><title>${fmt(e.t)} · kill ${e.side === 'us' ? 'de mon équipe' : 'des adversaires'}</title></circle>`).join('');
    return `<figure class="kmap"><svg viewBox="0 0 ${S2} ${S2}" role="img" aria-label="Carte des éliminations"><image href="https://ddragon.leagueoflegends.com/cdn/${D.version}/img/map/map11.png" x="0" y="0" width="${S2}" height="${S2}" opacity=".75"/>${dots}</svg>
      <div class="lgd">${onlyMe ? '<span><i class="ev-kill"></i>mes kills</span><span><i class="ev-death"></i>mes morts</span><span><i class="ev-assist"></i>mes assistances</span>' : '<span><i class="k-us"></i>kills de mon équipe</span><span><i class="k-them"></i>kills adverses</span>'}</div></figure>`;
  }
  /* Radar : moi contre mon adversaire de voie (chaque axe est rapporté au meilleur joueur de la partie) */
  function radar(G) {
    const me = G.me, op = G.opp; if (!me) return '';
    const all = G.teams.flatMap((t) => t.players);
    const AX = [['KDA', (p) => p.kda], ['Participation', (p) => p.kp], ['CS/min', (p) => p.csm], ['Or/min', (p) => p.gpm], ['Dégâts/min', (p) => p.dpm], ['Vision/min', (p) => (p.visionScore || 0) / G.min], ['Dégâts subis', (p) => p.totalDamageTaken || 0]];
    const R0 = 100, C = 130, n = AX.length;
    const pt = (i, r) => [C + r * Math.sin((2 * Math.PI * i) / n), C - r * Math.cos((2 * Math.PI * i) / n)];
    const poly = (p) => AX.map(([, f], i) => { const mx = Math.max(...all.map(f)) || 1; return pt(i, R0 * Math.max(0.04, f(p) / mx)).map((v) => v.toFixed(1)).join(','); }).join(' ');
    const grid = [0.25, 0.5, 0.75, 1].map((k) => `<polygon points="${AX.map((_, i) => pt(i, R0 * k).join(',')).join(' ')}" class="rg"/>`).join('');
    const labels = AX.map(([l], i) => { const [x, y] = pt(i, R0 + 18); return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" class="tk mid">${l}</text>`; }).join('');
    return `<figure class="radar"><svg viewBox="0 0 260 260" role="img" aria-label="Moi contre mon adversaire">${grid}${op ? `<polygon points="${poly(op)}" class="rp them"/>` : ''}<polygon points="${poly(me)}" class="rp us"/>${labels}</svg>
      <div class="lgd"><span><i class="us"></i>moi</span>${op ? `<span><i class="them"></i>${esc((byKey(op.championId) || {}).name || 'adversaire')}</span>` : ''}</div></figure>`;
  }
  /* Comparaison équipe contre équipe, avec barre partagée */
  const vsRow = (label, a, b, fmtV = (v) => nf(v)) => { const tot = (a || 0) + (b || 0); const pa = tot ? (100 * (a || 0)) / tot : 50; return `<div class="vsr"><b class="us">${fmtV(a || 0)}</b><div><span>${label}</span><div class="vsbar"><i class="us" style="width:${pa}%"></i><i class="them" style="width:${100 - pa}%"></i></div></div><b class="them">${fmtV(b || 0)}</b></div>`; };
  const ch = (p, k) => ((p.challenges || {})[k]);
  const bar = (v, max, cls) => `<div class="hbar"><i class="${cls || ''}" style="width:${max ? Math.max(1, (100 * v) / max) : 0}%"></i></div>`;
  function viewPost() {
    const P = R.post;
    const head = (sub) => `<div class="row sp"><h1>📊 ${P.old ? 'Partie' : 'Dernière partie'}</h1>${sub || ''}</div>`;
    if (P.status !== 'ready' || !P.match) {
      let h = head(P.status === 'waiting' ? '<span class="pill on">⏳ Riot publie les statistiques complètes (1 à 3 min)…</span>' : '');
      if (P.status === 'live-only') h += `<div class="card"><p class="muted">${P.reason === 'nokey' ? 'Ajoute ta clé Riot (Réglages) pour obtenir toutes les statistiques de fin de partie.' : esc(P.reason || 'Statistiques complètes indisponibles pour cette partie.')} Voici l'état final de la partie :</p></div>`;
      if (P.live) h += playersPanel(P.live);
      else h += '<div class="loader">Récupération…</div>';
      return h;
    }
    const G = Builds.postgame(P.match, P.timeline, P.puuid || myPuuid(), myIds(P));
    const puuid = G.me ? G.me.puuid : '';
    wantInfo(G.teams.flatMap((t) => t.players.map((p) => p.puuid)));
    const me = G.me, us = G.teams[0], them = G.teams[1];
    const tab = POST_TABS.some((t) => t[0] === S.postTab) ? S.postTab : 'resume';
    const meC = me ? byKey(me.championId) : null;
    let h = `<div class="post-hero ${us.win ? 'win' : 'loss'}" style="${meC ? `background-image:url('${Dd.img.splash(meC.id)}')` : ''}"><div>
      <h1>${us.win ? '🏆 Victoire' : '💀 Défaite'}</h1><p>${esc(QUEUE[G.queue] || 'Partie')} · ${fmt(G.dur)}${me ? ` · ${esc(meC ? meC.name : me.championName)} ${me.kills}/${me.deaths}/${me.assists}` : ''}</p>
      <div class="post-score"><b class="us">${us.kills}</b><span>kills</span><b class="them">${them.kills}</b></div></div></div>`;
    h += `<nav class="ptabs">${POST_TABS.map(([id, ic, lb]) => `<button class="${tab === id ? 'on' : ''}" data-act="postTab" data-val="${id}">${ic} ${lb}</button>`).join('')}</nav>`;
    const name = (p) => { const c = byKey(p.championId); return `<div class="pp">${cIcon(c, 'ico sm')}<div class="grow"><b class="ell">${esc(c ? c.name : p.championName)}</b><span class="small pmeta"><span class="muted ell">${esc(p.name)}</span>${rankTag(p.puuid)}</span></div></div>`; };
    const teamBlock = (t, i, cols, cells) => `<div class="pteam ${i ? 'them' : 'us'}"><div class="pth"><b>${i ? '🟥 Adversaires' : '🟦 Mon équipe'}</b> <span class="tag ${t.win ? 'gold' : ''}">${t.win ? 'Victoire' : 'Défaite'}</span></div>
      <div class="ptable" style="--cols:${cols}">${t.players.map((p) => `<div class="prow2 ${p.puuid === puuid ? 'me' : ''}">${name(p)}${cells(p, t)}</div>`).join('')}</div></div>`;
    if (tab === 'resume') {
      const obj = (k) => [us.objectives[k] ? us.objectives[k].kills : 0, them.objectives[k] ? them.objectives[k].kills : 0];
      const OBJS = [['🐉', 'Dragons', 'dragon'], ['🪲', 'Larves', 'horde'], ['🦀', 'Héraut', 'riftHerald'], ['👾', 'Nashor', 'baron'], ['🏰', 'Tours', 'tower'], ['💎', 'Inhibiteurs', 'inhibitor']];
      h += `<div class="cols"><div class="card"><h2>Équipes</h2><div class="vsstats">
        ${[['Kills', us.kills, them.kills], ['Or', k1(us.gold), k1(them.gold)], ['Dégâts aux champions', k1(us.damage), k1(them.damage)], ['Vision', us.vision, them.vision]].map(([l, a, b]) => `<div><b class="us">${a}</b><span>${l}</span><b class="them">${b}</b></div>`).join('')}
        ${OBJS.map(([ic, l, k]) => { const [a, b] = obj(k); return `<div><b class="us">${a}</b><span>${ic} ${l}</span><b class="them">${b}</b></div>`; }).join('')}</div></div>
        <div><div class="card"><h2>⭐ Les meilleurs</h2>${[['Plus de dégâts', G.best.damage, (p) => k1(p.totalDamageDealtToChampions)], ['Meilleur KDA', G.best.kda, (p) => `${p.kills}/${p.deaths}/${p.assists}`], ['Meilleure vision', G.best.vision, (p) => p.visionScore]].map(([l, p, f]) => `<div class="best">${name(p)}<span class="small muted">${l}</span><b>${f(p)}</b></div>`).join('')}</div>
        <div class="card">${curveSvg(G.curve, { title: 'Différence d\'or entre les équipes (au-dessus : mon équipe devant)' })}</div></div></div>`;
      h += `<div class="card"><h2>⏱️ Objectifs dans le temps</h2>${objStrip(G)}</div>`;
      h += `<div class="cols">${[us, them].map((t, i) => `<div class="card">${teamBlock(t, i, '64px 86px 58px 1fr', (p) => `<b>${p.kills}/<span class="neg">${p.deaths}</span>/${p.assists}</b><span title="${p.cs} sbires et monstres">${p.csm.toFixed(1).replace('.', ',')} CS/min</span><span>${k1(p.goldEarned)}</span><div class="items">${p.items.map((x) => itIcon(x)).join('')}</div>`)}</div>`).join('')}</div>`;
    } else if (tab === 'equipe') {
      const T = G.T, sum = (t, f) => t.players.reduce((s2, p) => s2 + (f(p) || 0), 0);
      const FIRST = [['blood', '🩸 Premier sang'], ['tower', '🏰 Première tour'], ['drake', '🐉 Premier dragon'], ['grubs', '🪲 Premières larves'], ['herald', '🦀 Héraut'], ['baron', '👾 Premier Nashor'], ['inhib', '💎 Premier inhibiteur']];
      h += `<div class="kpis">${[
        ['Plus grande avance', G.lead && G.lead.max ? `+${k1(G.lead.max)} <small>à ${G.lead.maxAt}'</small>` : '—'],
        ['Plus grand retard', G.lead && G.lead.min ? `−${k1(-G.lead.min)} <small>à ${G.lead.minAt}'</small>` : '—'],
        ['Kills / min', `${f1(us.kills / G.min)} – ${f1(them.kills / G.min)}`],
        ['Or / min', `${Math.round(us.gold / G.min)} – ${Math.round(them.gold / G.min)}`],
        ['Dégâts / min', `${k1(us.damage / G.min)} – ${k1(them.damage / G.min)}`],
        ['Plaques de tour', `${T.plates.us} – ${T.plates.them}`],
      ].map(([l, v]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>`;
      h += `<div class="cols"><div class="card"><h2>⚖️ Mon équipe contre les adversaires</h2><div class="vslist">
        ${vsRow('Kills', us.kills, them.kills)}${vsRow('Morts', us.deaths, them.deaths)}${vsRow('Assistances', us.assists, them.assists)}
        ${vsRow('Or gagné', us.gold, them.gold, k1)}${vsRow('Dégâts aux champions', us.damage, them.damage, k1)}${vsRow('Dégâts subis', sum(us, (p) => p.totalDamageTaken), sum(them, (p) => p.totalDamageTaken), k1)}
        ${vsRow('Dégâts aux objectifs', sum(us, (p) => p.damageDealtToObjectives), sum(them, (p) => p.damageDealtToObjectives), k1)}${vsRow('Dégâts aux bâtiments', sum(us, (p) => p.damageDealtToBuildings), sum(them, (p) => p.damageDealtToBuildings), k1)}
        ${vsRow('Sbires et monstres', sum(us, (p) => p.cs), sum(them, (p) => p.cs))}${vsRow('Contrôle infligé (s)', sum(us, (p) => p.timeCCingOthers), sum(them, (p) => p.timeCCingOthers))}
        ${vsRow('Soins', sum(us, (p) => p.totalHeal), sum(them, (p) => p.totalHeal), k1)}${vsRow('Score de vision', us.vision, them.vision)}
        ${vsRow('Balises posées', sum(us, (p) => p.wardsPlaced), sum(them, (p) => p.wardsPlaced))}${vsRow('Balises détruites', sum(us, (p) => p.wardsKilled), sum(them, (p) => p.wardsKilled))}
        ${vsRow('Balises de contrôle', sum(us, (p) => p.visionWardsBoughtInGame), sum(them, (p) => p.visionWardsBoughtInGame))}${vsRow('Temps passé mort', sum(us, (p) => p.totalTimeSpentDead), sum(them, (p) => p.totalTimeSpentDead), (v) => fmt(v))}
      </div></div><div><div class="card"><h2>🥇 Les premiers</h2><div class="firsts">${FIRST.map(([k, l]) => { const f = T.firsts[k]; return `<div class="${f ? f.side : ''}"><span>${l}</span><b>${f ? (f.side === 'us' ? '🟦 nous' : '🟥 eux') + ` <small class="muted">${fmt(f.t)}</small>` : '—'}</b></div>`; }).join('')}</div></div>
        <div class="card"><h2>🍰 Répartition</h2><p class="small muted">Part des dégâts aux champions</p>${shareBar(us, 'totalDamageDealtToChampions', 'us')}${shareBar(them, 'totalDamageDealtToChampions', 'them')}
        <p class="small muted">Part de l'or</p>${shareBar(us, 'goldEarned', 'us')}${shareBar(them, 'goldEarned', 'them')}
        <p class="small muted">Part des dégâts subis</p>${shareBar(us, 'totalDamageTaken', 'us')}${shareBar(them, 'totalDamageTaken', 'them')}</div></div></div>`;
      h += `<div class="cols"><div class="card">${lineChart([{ vals: T.kills.us, cls: 'us', label: 'Mon équipe' }, { vals: T.kills.them, cls: 'them', label: 'Adversaires' }], { title: 'Kills cumulés, minute par minute', fmtY: (v) => String(Math.round(v)) })}</div>
        <div class="card">${lineChart([{ vals: T.gold.us, cls: 'us', label: 'Mon équipe' }, { vals: T.gold.them, cls: 'them', label: 'Adversaires' }], { title: 'Or total de chaque équipe', unit: 'po' })}</div></div>`;
      h += `<div class="cols"><div class="card">${curveSvg(G.curve, { title: 'Différence d\'or entre les équipes' })}</div><div class="card">${curveSvg(T.xp, { title: 'Différence d\'expérience entre les équipes', unit: 'XP' })}</div></div>`;
      h += `<div class="card"><h2>⏱️ Objectifs dans le temps</h2>${objStrip(G)}</div>`;
    } else if (tab === 'morts') {
      const DR = G.deaths;
      if (!me) h += '<div class="card"><p class="muted">Joueur introuvable dans cette partie.</p></div>';
      else if (!P.timeline) h += '<div class="card"><p class="muted">La chronologie de cette partie n\'est pas disponible : impossible de détailler tes morts.</p></div>';
      else {
        const rows = DR.rows;
        h += `<div class="kpis">${[['Morts', me.deaths], ['Temps passé mort', fmt(DR.deadTime)], ['Part de la partie', pctS(DR.share)], ['Avant 10 min', rows.filter((r) => r.t < 600).length], ['Face à 3 ennemis ou +', rows.filter((r) => r.kind === 'gank').length], ['En 1 contre 1', rows.filter((r) => r.kind === 'solo').length]].map(([l, v]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>`;
        const S2 = 300, X = (v) => (v / 14870) * S2, Y = (v) => S2 - (v / 14980) * S2;
        const map = `<figure class="kmap"><svg viewBox="0 0 ${S2} ${S2}" role="img" aria-label="Carte de mes morts"><image href="https://ddragon.leagueoflegends.com/cdn/${D.version}/img/map/map11.png" x="0" y="0" width="${S2}" height="${S2}" opacity=".75"/>${rows.filter((r) => r.x != null).map((r, i) => `<g><circle cx="${X(r.x).toFixed(1)}" cy="${Y(r.y).toFixed(1)}" r="8" class="ev-death"/><text x="${X(r.x).toFixed(1)}" y="${(Y(r.y) + 3.5).toFixed(1)}" class="dnum">${i + 1}</text><title>${fmt(r.t)} · ${esc(r.zone.name)}</title></g>`).join('')}</svg></figure>`;
        const KIND = { gank: '👥 attaqué à plusieurs', duo: '⚔️ à 2 contre toi', solo: '🗡️ 1 contre 1', other: '🏰 tour ou monstre' };
        const list = rows.length ? rows.map((r, i) => { const kc = byKey(r.killer); return `<div class="drow"><span class="dn">${i + 1}</span><b>${fmt(r.t)}</b><span class="dz">${esc(r.zone.name)}</span>${kc ? cIcon(kc, 'ico xs') : ''}<span class="small">${kc ? esc(kc.name) : 'tour / monstre'}${r.enemies > 1 ? ` <span class="muted">+${r.enemies - 1}</span>` : ''}</span><span class="small muted">${KIND[r.kind]}</span>${r.lvl && r.klvl ? `<span class="small ${r.klvl > r.lvl ? 'neg' : 'muted'}">niv. ${r.lvl} vs ${r.klvl}</span>` : ''}</div>`; }).join('') : '<p class="muted">Aucune mort dans cette partie. Bravo !</p>';
        h += `<div class="cols"><div class="card"><h2>🗺️ Où je suis mort</h2>${map}</div><div><div class="card gold"><h2>💡 Ce que tes morts racontent</h2><ul class="tips">${DR.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
          <div class="card"><h2>📋 Détail</h2><div class="dlist">${list}</div>${Object.keys(DR.zones).length ? `<p class="small muted" style="margin-top:6px">Par zone : ${Object.entries(DR.zones).sort((a, b) => b[1] - a[1]).map(([z, c]) => `${esc(z)} ×${c}`).join(' · ')}</p>` : ''}</div></div></div>`;
      }
    } else if (tab === 'carte') {
      h += `<div class="cols"><div class="card"><h2>⚔️ Toutes les éliminations</h2>${killMap(G, false)}</div><div class="card"><h2>🙋 Mes kills, morts et assistances</h2>${me ? killMap(G, true) : '<p class="muted">Joueur introuvable dans cette partie.</p>'}</div></div>`;
      if (me && G.T.myEv.length) h += `<div class="card"><h2>🕒 Mes actions dans le temps</h2><div class="myev">${G.T.myEv.map((e) => `<span class="ev ${e.kind}"><b>${fmt(e.t)}</b> ${{ kill: '⚔️ kill', death: '💀 mort', assist: '🤝 assistance' }[e.kind]}</span>`).join('')}</div></div>`;
    } else if (tab === 'moi') {
      if (!me) h += '<div class="card"><p class="muted">Joueur introuvable dans cette partie.</p></div>';
      else {
        const oc = G.opp ? byKey(G.opp.championId) : null;
        const kp = (v) => `${Math.round(v * 100)} %`;
        const sgd = (v, min) => (v == null ? '—' : `<b class="${v >= 0 ? 'pos' : 'neg'}">${v >= 0 ? '+' : '−'}${Math.abs(v / min).toFixed(1).replace('.', ',')}</b>`);
        const sg = (v) => (v == null ? '—' : `<b class="${v >= 0 ? 'pos' : 'neg'}">${v >= 0 ? '+' : ''}${nf(v)}</b>`);
        h += `<div class="kpis big">${[['KDA', me.kda.toFixed(2).replace('.', ',')], ['Participation', kp(me.kp)], ['CS/min', f1(me.csm)], ['Or/min', Math.round(me.gpm)], ['Dégâts/min', Math.round(me.dpm)], ['Part des dégâts', kp(me.dmgShare)], ['Part de l\'or', kp(me.goldShare)], ['Vision/min', f1((me.visionScore || 0) / G.min)]].map(([l, v]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>`;
        const eff = me.goldEarned ? (me.totalDamageDealtToChampions || 0) / (me.goldEarned / 1000) : 0;
        const more = [
          ['Dégâts pour 1 000 po', Math.round(eff)], ['Kills en solo', ch(me, 'soloKills')], ['Plaques de tour', ch(me, 'turretPlatesTaken')], ['CS à 10 min', ch(me, 'laneMinionsFirst10Minutes') != null ? Math.round((ch(me, 'laneMinionsFirst10Minutes') || 0) + (ch(me, 'jungleCsBefore10Minutes') || 0)) : null],
          ['Avance max. en CS', ch(me, 'maxCsAdvantageOnLaneOpponent') != null ? Math.round(ch(me, 'maxCsAdvantageOnLaneOpponent')) : null], ['Avance max. en niveaux', ch(me, 'maxLevelLeadLaneOpponent')], ['Sorts touchés', ch(me, 'skillshotsHit')], ['Sorts esquivés', ch(me, 'skillshotsDodged')],
          ['Soins et boucliers utiles', ch(me, 'effectiveHealAndShielding') != null ? k1(ch(me, 'effectiveHealAndShielding')) : null], ['Temps mort', `${fmt(me.totalTimeSpentDead || 0)} (${pctS((me.totalTimeSpentDead || 0) / Math.max(1, G.dur))})`], ['Plus longue survie', fmt(me.longestTimeSpentLiving || 0)], ['Premier sang', me.firstBloodKill ? 'oui ⚔️' : me.firstBloodAssist ? 'assistance' : 'non'],
        ].filter(([, v]) => v != null);
        h += `<div class="kpis">${more.map(([l, v]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>`;
        h += '<div class="cols"><div>';
        h += `<div class="card"><h2>🎯 Contre ${oc ? esc(oc.name) : 'mon adversaire'}</h2>${G.opp ? `<div class="vsstats"><div><b class="us">${sg(G.at10.gold)}</b><span>Or à 10 min</span><b class="them"></b></div><div><b class="us">${sgd(G.at10.cs, 10)}</b><span>Écart CS/min à 10 min</span><b></b></div><div><b class="us">${sg(G.at15.gold)}</b><span>Or à 15 min</span><b></b></div><div><b class="us">${sgd(G.at15.cs, 15)}</b><span>Écart CS/min à 15 min</span><b></b></div></div>${curveSvg(G.meVs.gold, { title: 'Différence d\'or avec ton adversaire de voie, minute par minute' })}` : '<p class="muted">Pas d\'adversaire de voie identifié.</p>'}</div>`;
        const T = G.T, on = oc ? oc.name : 'adversaire';
        h += `<div class="card"><h2>📈 Moi contre ${esc(on)}, minute par minute</h2>
          ${lineChart([{ vals: T.me.cs, cls: 'us', label: 'moi' }, { vals: T.opp.cs, cls: 'them', label: on }], { title: 'Sbires et monstres cumulés', fmtY: (v) => String(Math.round(v)) })}
          ${lineChart([{ vals: T.me.xp, cls: 'us', label: 'moi' }, { vals: T.opp.xp, cls: 'them', label: on }], { title: 'Expérience', unit: 'XP' })}
          ${lineChart([{ vals: T.me.dmg, cls: 'us', label: 'moi' }, { vals: T.opp.dmg, cls: 'them', label: on }], { title: 'Dégâts aux champions cumulés' })}</div>`;
        h += '</div><div>';
        h += `<div class="card"><h2>🕸️ Mon profil</h2>${radar(G)}<p class="small muted">Chaque axe est comparé au meilleur joueur de la partie.</p></div>`;
        h += `<div class="card gold"><h2>💡 Pour progresser</h2><ul class="tips">${G.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`;
        h += `<div class="card"><h2>📋 Détails</h2><div class="kv">${[['Dégâts aux champions', nf(me.totalDamageDealtToChampions)], ['Dégâts subis', nf(me.totalDamageTaken)], ['Dégâts atténués', nf(me.damageSelfMitigated)], ['Dégâts aux objectifs', nf(me.damageDealtToObjectives)], ['Soins', nf(me.totalHeal)], ['Boucliers sur alliés', nf(me.totalDamageShieldedOnTeammates)], ['Contrôle infligé (s)', nf(me.timeCCingOthers)], ['Plus grosse série', me.largestKillingSpree || 0], ['Multi-kill max', me.largestMultiKill || 0], ['Temps mort', fmt(me.totalTimeSpentDead || 0)], ['Balises posées', me.wardsPlaced || 0], ['Balises détruites', me.wardsKilled || 0]].map(([l, v]) => `<div><span>${l}</span><b>${v}</b></div>`).join('')}</div></div>`;
        h += '</div></div>';
      }
    } else if (tab === 'degats') {
      const mx = Math.max(...G.teams.flatMap((t) => t.players.map((p) => Math.max(p.totalDamageDealtToChampions || 0, p.totalDamageTaken || 0))));
      h += `<div class="cols">${[us, them].map((t, i) => `<div class="card">${teamBlock(t, i, '1fr 1fr', (p) => `<div class="dcell"><span class="small">Infligés <b>${k1(p.totalDamageDealtToChampions)}</b> (${Math.round(p.dmgShare * 100)} %)</span><div class="hbar stack"><i class="phy" style="width:${(100 * (p.physicalDamageDealtToChampions || 0)) / mx}%"></i><i class="mag" style="width:${(100 * (p.magicDamageDealtToChampions || 0)) / mx}%"></i><i class="tru" style="width:${(100 * (p.trueDamageDealtToChampions || 0)) / mx}%"></i></div></div><div class="dcell"><span class="small">Subis <b>${k1(p.totalDamageTaken)}</b> · atténués ${k1(p.damageSelfMitigated)}</span>${bar(p.totalDamageTaken || 0, mx, 'tak')}</div>`)}</div>`).join('')}</div>
        <p class="muted small legend"><i class="phy"></i> physiques <i class="mag"></i> magiques <i class="tru"></i> bruts</p>`;
    } else if (tab === 'or') {
      h += `<div class="card">${curveSvg(G.curve, { title: 'Différence d\'or entre les équipes (au-dessus de la ligne : mon équipe devant)' })}</div>`;
      const mx = Math.max(...G.teams.flatMap((t) => t.players.map((p) => p.goldEarned || 0)));
      h += `<div class="cols">${[us, them].map((t, i) => `<div class="card">${teamBlock(t, i, '1fr 90px', (p) => `<div class="dcell"><span class="small"><b>${nf(p.goldEarned)}</b> po · ${Math.round(p.gpm)}/min</span>${bar(p.goldEarned || 0, mx, 'gld')}</div><span title="${p.cs} sbires et monstres"><b>${p.csm.toFixed(1).replace('.', ',')}</b> CS/min</span>`)}</div>`).join('')}</div>`;
    } else if (tab === 'vision') {
      const mx = Math.max(...G.teams.flatMap((t) => t.players.map((p) => p.visionScore || 0)));
      h += `<div class="cols">${[us, them].map((t, i) => `<div class="card">${teamBlock(t, i, '1fr 60px 60px 60px', (p) => `<div class="dcell"><span class="small">Score <b>${p.visionScore}</b></span>${bar(p.visionScore || 0, mx, 'vis')}</div><span title="Balises posées">📍 ${p.wardsPlaced || 0}</span><span title="Balises détruites">❌ ${p.wardsKilled || 0}</span><span title="Balises de contrôle achetées">🔴 ${p.visionWardsBoughtInGame || 0}</span>`)}</div>`).join('')}</div>
        <p class="muted small">📍 balises posées · ❌ balises ennemies détruites · 🔴 balises de contrôle achetées</p>`;
    } else if (tab === 'builds') {
      const runes = (p) => { const st = (p.perks || {}).styles || []; const k = st[0] && st[0].selections && st[0].selections[0] ? D.runeById[st[0].selections[0].perk] : null; const sub = st[1] ? D.treeById[st[1].style] : null; return `${k ? `<img class="rimg" title="${esc(k.name)}" alt="" src="${Dd.img.rune(k)}">` : ''}${sub ? `<img class="rimg tree" title="${esc(sub.name)}" alt="" src="${Dd.img.rune(sub)}">` : ''}`; };
      h += `<div class="cols">${[us, them].map((t, i) => `<div class="card">${teamBlock(t, i, '64px 62px 1fr', (p) => `<span class="row nw">${runes(p)}</span><span class="row nw">${spellPair([p.summoner1Id, p.summoner2Id].join(','))}</span><div class="items">${p.items.map((x) => itIcon(x)).join('')}${p.trinket ? itIcon(p.trinket, 'ico sm trk') : ''}</div>`)}</div>`).join('')}</div>`;
    }
    return head() + h;
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
    document.querySelectorAll('[data-ospawn]').forEach((el) => { el.textContent = fmt((+el.dataset.ospawn - t) / 1000); });
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
    return; /* remplacé par les annonces vocales */
    // eslint-disable-next-line no-unreachable
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
      ${c.hasApiKey ? `<div class="row keystate"><span class="small">${R.key.state === 'expired' ? '❌ <b>Clé expirée</b>' : R.key.state === 'ok' ? `✅ Clé valide${R.key.permanent ? ' (clé permanente)' : R.key.savedAt ? ` · enregistrée le ${new Date(R.key.savedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}, expire vers ${new Date(R.key.savedAt + 24 * 3600000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} si c'est une clé de développement` : ''}` : '⏳ Vérification…'}</span></div>` : ''}
      <div class="row" style="margin-top:6px"><button class="btn hex small" data-act="renewKey">🔄 ${c.hasApiKey ? 'Renouveler ma clé' : 'Obtenir ma clé'} automatiquement</button><span class="muted small">Ouvre le portail Riot : tu te connectes et tu coches le captcha, Noob LOL fait le reste.</span></div>
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
      <p class="muted small">Il récupère des parties classées récentes de joueurs Maître, Grand maître et Challenger de ton serveur (API officielle de Riot) et calcule runes, objets, sorts et match-ups par champion et par rôle. Tout est stocké sur ton PC. Avec une clé de développement (100 requêtes / 2 min, 2 requêtes par partie : résultat + chronologie des achats) : environ 1 500 parties par heure. Une clé de développement expire au bout de 24 h.</p>
      <div class="kpis"><div><b>${nf(col.matches)}</b><span>parties analysées</span></div><div><b>${nf(col.picks)}</b><span>lignes champion</span></div><div><b>${nf(col.pending)}</b><span>en attente</span></div><div><b>${nf(col.seeds)}</b><span>joueurs suivis</span></div></div>
      <p class="small">${running ? '🟢 En cours…' : '⏸️ À l\'arrêt'}${col.lastError ? ` · <span class="neg">${esc(col.lastError)}</span>` : ''}</p>
      <div class="row"><button class="btn ${running ? 'danger' : ''} small" data-act="${running ? 'colStop' : 'colStart'}" ${c.hasApiKey ? '' : 'disabled'}>${running ? '⏸️ Arrêter' : '▶ Démarrer'}</button>
      <button class="chip ${(c.collector || {}).autoStart ? 'on' : ''}" data-act="colAuto">Démarrer avec l'appli</button><button class="btn ghost small" data-act="colClear">Vider les statistiques</button></div>
      <h3>🤝 Partager mes statistiques</h3>
      <p class="muted small">« Exporter » crée un fichier <b>.nooblolstats</b> à donner à un ami. Chez lui, un double-clic sur ce fichier ouvre Noob LOL, qui lui propose de l'importer. Ses parties sont <b>ajoutées</b> aux siennes, sans doublon : rien n'est effacé. Le fichier ne contient que les statistiques du collecteur, ni ta clé Riot, ni tes builds, ni ton compte.</p>
      <div class="row"><button class="btn small" data-act="statsExport" ${col.matches ? '' : 'disabled'}>📤 Exporter mes statistiques</button><button class="btn ghost small" data-act="statsImport">📥 Importer des statistiques</button></div>
      ${importAskCard()}</div>`;
    h += voiceSettings();
    h += miniSettings();
    h += '</div></div>';
    return h;
  }
  /* Mises à jour de l'appli : vérification à la demande */
  function updBlock() {
    if (!NB || !NB.update) return '';
    const u = R.upd || { state: 'idle' };
    const when = u.checkedAt ? ` <span class="muted small">(vérifié à ${new Date(u.checkedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })})</span>` : '';
    const msg = {
      idle: '<span class="muted">Les mises à jour se vérifient toutes seules toutes les heures.</span>',
      checking: '⏳ Recherche d\'une mise à jour…',
      latest: `✅ Tu as la dernière version.${when}`,
      available: `🔄 Version ${esc(u.version)} disponible, téléchargement…`,
      downloading: `⬇️ Téléchargement de la version ${esc(u.version)}… ${u.percent || 0} %<div class="hbar" style="margin-top:4px"><i class="gld" style="width:${u.percent || 0}%"></i></div>`,
      downloaded: `🎉 La version <b>${esc(u.version)}</b> est prête.`,
      dev: '🛠️ Version de développement : pas de mise à jour automatique.',
      error: `<span class="neg">❌ Vérification impossible : ${esc(u.error || 'erreur inconnue')}</span>${when}`,
    }[u.state] || '';
    const busyU = u.state === 'checking' || u.state === 'downloading' || u.state === 'available';
    return `<div class="updbox"><div class="small">${msg}</div><div class="row" style="margin-top:6px">${u.state === 'downloaded'
      ? '<button class="btn small" data-act="installUpdate">🔄 Redémarrer et installer</button>'
      : `<button class="btn ghost small" data-act="checkUpdate" ${busyU ? 'disabled' : ''}>🔎 Vérifier les mises à jour</button>`}</div></div>`;
  }
  function infoCard() {
    return `<div class="card"><h2>ℹ️ Noob LOL</h2><p>Version <b>${esc((R.info && R.info.version) || APP_VERSION)}</b>${D.version ? ` · données du patch <b>${esc(D.version)}</b>` : ''}</p>
      ${updBlock()}
      <p class="muted small">Données des champions, objets et runes : Data Dragon (Riot Games). Compte et statistiques : API officielle de Riot. En jeu : API officielle « Live Client Data ».</p>
      <details class="flat"><summary class="small">📝 Notes de version</summary>${APP_RELEASES.map((r) => `<h3>${esc(r.v)} <span class="muted small">${esc(r.date)}</span></h3><ul>${r.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`).join('')}</details>
      <div class="row" style="margin-top:8px"><button class="btn ghost small" data-act="reloadData">🔄 Recharger les données Riot</button>${NB && NB.sim ? '<button class="btn ghost small" data-act="simOpen" title="Ouvre une fenêtre qui imite le client LoL et le jeu (sélection, chargement, partie) pour tester Noob LOL sans jouer">🧪 Simulateur de partie</button>' : ''}${NB && NB.openData ? '<button class="btn ghost small" data-act="openData" title="Contient diagnostic-evenements.json : les événements bruts de ta dernière partie">📂 Dossier de l\'appli (diagnostic)</button>' : ''}<button class="btn danger small" data-act="wipe">Effacer favoris et notes (garde mes builds)</button></div>
      <p class="muted small" style="margin-top:8px">Noob LOL n'est pas approuvé par Riot Games et ne reflète pas les opinions de Riot Games ou de quiconque officiellement impliqué dans la production ou la gestion des propriétés de Riot Games. Riot Games et toutes les propriétés associées sont des marques commerciales ou des marques déposées de Riot Games, Inc.</p></div>`;
  }
  function voiceSettings() {
    const vs = frVoices();
    return `<div class="card"><h2>🔊 Annonces vocales en jeu</h2>
      <p class="muted small">Une voix t'annonce les objectifs (30 s avant et à l'apparition), les objectifs pris par chaque équipe, les inhibiteurs, ta mort et ton temps de réapparition, et quand tu as assez d'or pour ton prochain objet.</p>
      <div class="chips"><button class="chip ${S.opt.voice ? 'on' : ''}" data-act="opt" data-val="voice">${S.opt.voice ? '🔊 Activées' : '🔇 Désactivées'}</button><button class="chip" data-act="voiceTest">▶ Tester</button></div>
      <div class="row" style="margin-top:8px"><div class="grow"><label>Voix</label><select data-voice="1">${vs.length ? vs.map((v) => `<option value="${esc(v.name)}" ${v.name === S.opt.voiceName ? 'selected' : ''}>${esc(v.name)}</option>`).join('') : '<option value="">Voix française par défaut</option>'}</select></div></div>
      <div class="row" style="margin-top:8px"><span class="small muted">Vitesse</span>${[0.9, 1.05, 1.25].map((r) => `<button class="chip ${S.opt.voiceRate === r ? 'on' : ''}" data-act="voiceRate" data-val="${r}">${r < 1 ? 'Lente' : r > 1.1 ? 'Rapide' : 'Normale'}</button>`).join('')}
      <span class="small muted">Volume</span>${[50, 75, 100].map((r) => `<button class="chip ${S.opt.voiceVol === r ? 'on' : ''}" data-act="voiceVol" data-val="${r}">${r} %</button>`).join('')}</div>
      <p class="small muted" style="margin:10px 0 4px">Coaching en direct (annoncé et noté dans le journal) :</p><div class="chips">${COACH.map(([k, l]) => `<button class="chip ${coachOn(k) ? 'on' : ''}" data-act="coachToggle" data-val="${k}">${l}</button>`).join('')}</div>
      <div class="chips" style="margin-top:8px"><button class="chip ${S.opt.reminders !== false ? 'on' : ''}" data-act="remToggle">💡 Rappels : ultime (niveaux 6, 11, 16), balise de contrôle après un achat, Lentille d'oracle pour les supports</button></div>
      ${!vs.length ? '<p class="small warn">Aucune voix française trouvée : ajoute-en une dans Windows (Paramètres → Heure et langue → Voix).</p>' : ''}</div>`;
  }
  /* Réglage fin de l'encart de chargement : caler les infos sur les cartes du jeu */
  const LAY_DEF = { v: 3, offX: -0.004, cardW: 0.2343, gap: 0.0398, row1: 0.0639, row2: 0.548 };
  const LAY_SL = [['offX', 'Centrer les cartes (décalage gauche / droite)', -0.08, 0.08, 0.0005], ['cardW', 'Largeur des cartes', 0.18, 0.3, 0.0005], ['gap', 'Écart entre les cartes', 0.01, 0.07, 0.0005], ['row1', 'Hauteur de la rangée du haut', 0, 0.2, 0.0005], ['row2', 'Hauteur de la rangée du bas', 0.4, 0.7, 0.0005]];
  const layNow = () => { const saved = ((R.cfg || {}).overlay || {}).layout; return Object.assign({}, LAY_DEF, saved && saved.v === 3 ? saved : {}, R.layDraft || {}, { v: 3 }); };
  function layoutSettings() {
    const L2 = layNow();
    return `<h3>📐 Placer les infos sur les cartes du chargement</h3>
      <p class="muted small">Réglé d'après le vrai écran de chargement et proportionnel à la hauteur de l'écran (valeurs affichées pour un écran de 1080 px de haut). Si besoin, lance <b>« Aperçu »</b> pendant un chargement : les contours calculés s'affichent en pointillés (la ligne jaune marque le nom du champion) ; ajuste les curseurs jusqu'à ce qu'ils épousent les cartes. La hauteur des cartes suit leur largeur.</p>
      <div class="laygrid">${LAY_SL.map(([k, l, mn, mx, st]) => `<label class="small">${l} <b>${Math.round(L2[k] * 1080)} px</b><input type="range" data-lay="${k}" min="${mn}" max="${mx}" step="${st}" value="${L2[k]}"></label>`).join('')}</div>
      <div class="row"><button class="btn small" data-act="layPreview">👁️ Aperçu sur l'écran du jeu (20 s)</button><button class="btn ghost small" data-act="layReset">Valeurs par défaut</button></div>`;
  }
  function layPreview() {
    if (!NB || !NB.loadov || !D.champList) return;
    const pick = D.champList.slice().sort(() => Math.random() - 0.5).slice(0, 10);
    const P = (c, i) => ({ champ: c.name, name: 'Joueur ' + (i + 1), role: ['Top', 'Jungle', 'Mid', 'ADC', 'Support'][i % 5], me: i === 2, rank: ['Or II', 'Argent I', 'Platine IV', 'Bronze I', 'Émeraude III'][i % 5], level: 30 + i * 37, wr: `${4 + (i % 5)} V / ${6 - (i % 5)} D`, wrClass: i % 3 === 0 ? 'pos' : '', kda: '5,2/4,1/7,3 (3,0)', dmg: dmgOf(c).t });
    NB.loadov.update({ preview: true, teams: [{ side: 'ORDER', mine: true, players: pick.slice(0, 5).map(P) }, { side: 'CHAOS', mine: false, players: pick.slice(5).map((c, i) => P(c, i + 5)) }] }).catch(() => {});
    clearTimeout(R.layTimer);
    R.layTimer = setTimeout(() => { R.loadovKey = ''; NB.loadov.update(null).catch(() => {}); if (isLoading()) loadovSync(loadingData()); }, 20000);
  }
  /* Import de statistiques reçues : confirmation (fichier choisi ou ouvert d'un double-clic) */
  function importAskCard() {
    const a = R.importAsk; if (!a) return '';
    const m = a.meta || {};
    return `<div class="card gold" style="margin-top:8px"><h3 style="margin-top:0">📥 Importer « ${esc(a.name)} » ?</h3>
      <p class="small">${nf(m.matches || 0)} parties analysées${m.platform ? ` · serveur ${esc(String(m.platform).toUpperCase())}` : ''}${m.patches && m.patches.length ? ` · patchs ${esc(m.patches.join(', '))}` : ''}${m.exportedAt ? ` · exporté le ${new Date(m.exportedAt).toLocaleDateString('fr-FR')}` : ''}.</p>
      <p class="small muted">Ces parties seront ajoutées aux tiennes, sans doublon.</p>
      <div class="row"><button class="btn small" data-act="statsImportOk" ${R.importBusy ? 'disabled' : ''}>${R.importBusy ? '⏳ Import en cours…' : '✅ Importer'}</button><button class="btn ghost small" data-act="statsImportNo">Annuler</button></div></div>`;
  }
  function askImport(file) {
    NB.stats.inspect(file).then((a) => { if (!a) return; R.importAsk = a; S.mode = 'settings'; render(); setTimeout(() => { const el = document.querySelector('[data-act=statsImportOk]'); if (el) el.scrollIntoView({ block: 'center' }); }, 50); })
      .catch((e) => toast('❌ ' + e.message));
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
      <div class="chips" style="margin:6px 0"><button class="chip ${S.opt.miniEmbed ? 'on' : ''}" data-act="miniEmbed">🗺️ Mini-carte dans l'écran « En jeu »</button></div>
      <div class="row"><button class="btn ghost small" data-act="miniShot">📸 Prendre une capture</button><button class="btn ghost small" data-act="miniReset">Position par défaut</button><button class="chip ${m.alwaysOnTop ? 'on' : ''}" data-act="miniTop">Toujours au premier plan</button></div>`;
    if (R.shot) h += `<div class="cropper" id="cropper"><img src="${R.shot}" alt="Capture" draggable="false"><div class="crop" id="cropBox" style="left:${crop.x * 100}%;top:${crop.y * 100}%;width:${crop.w * 100}%;height:${crop.h * 100}%"></div></div>
      <div class="row"><button class="btn small" data-act="miniSaveCrop">Enregistrer la zone</button><span class="muted small">Glisse sur l'image pour tracer la zone.</span></div>`;
    h += `<div class="row" style="margin-top:10px"><button class="btn ${R.miniOpen ? 'danger' : 'hex'}" data-act="${R.miniOpen ? 'miniClose' : 'miniOpen'}">🗺️ ${R.miniOpen ? 'Fermer la mini-carte' : 'Ouvrir la mini-carte'}</button></div></div>`;
    const ov = c.overlay || { enabled: true };
    h += `<div class="card"><h2>⭐ Encart « Mon build » par-dessus le jeu</h2>
      <p class="muted small">Quand tu suis un de tes builds d'objets (choisi pendant la sélection), un petit encart s'affiche en bas de l'écran du jeu, entre tes compétences et la mini-carte : prochain objet, or manquant et objets déjà achetés. <b>Glisse-le à la souris</b> pour le déplacer (c'est la seule action possible dessus), sa position est retenue. Il faut que League of Legends soit en mode <b>« Fenêtré sans bordure »</b>.</p>
      <div class="row"><button class="chip ${ov.enabled !== false ? 'on' : ''}" data-act="ovToggle">${ov.enabled !== false ? '✅ Activé' : 'Désactivé'}</button><button class="btn ghost small" data-act="ovReset">Remettre à sa place</button></div>
      <p class="muted small" style="margin-top:8px">Pendant l'écran de chargement, Noob LOL affiche aussi par-dessus le jeu le rang, le niveau, les victoires et le KDA moyen des 10 dernières parties de chaque joueur, et le type de dégâts de son champion.</p>
      <div class="row"><button class="chip ${ov.loading !== false ? 'on' : ''}" data-act="ovLoadToggle">${ov.loading !== false ? '✅ Infos sur l\'écran de chargement' : 'Infos sur l\'écran de chargement : désactivées'}</button></div>
      ${layoutSettings(ov)}</div>`;
    return h;
  }

  /* ---------- Navigation ---------- */
  /* Changement d'onglet : on vide les champs de recherche */
  function clearSearch() { S.cf.q = ''; S.itf.q = ''; S.lexQ = ''; if (S.ed) S.ed.itQ = ''; }
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
  function cfgSet(patch) { return NB.config.set(patch).then((c) => { R.cfg = c; if (patch.minimap && 'sourceDisplayId' in patch.minimap) mmStop(); render(true); }).catch((e) => toast(e.message)); }

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
      case 'mode': clearSearch(); S.view = { champ: null, item: null }; S.mode = v; render(); break;
      case 'tab': clearSearch(); S.view = { champ: null, item: null }; S.mode = 'prep'; S.tab = v; render(); break;
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
      case 'istat': { const L2 = S.itf.stats || (S.itf.stats = []); const i = L2.indexOf(v); if (i >= 0) L2.splice(i, 1); else L2.push(v); render(true); break; }
      case 'iany': S.itf.any = v === '1'; render(true); break;
      case 'iprice': S.itf.price = S.itf.price === v ? '' : v; render(true); break;
      case 'isort': S.itf.sort = v; render(true); break;
      case 'ireset': Object.assign(S.itf, { tag: '', stats: [], any: false, price: '' }); render(true); break;
      case 'tree': S.rune.tree = +v; S.rune.sel = null; render(true); break;
      case 'rune': S.rune.sel = S.rune.sel === +v ? null : +v; render(true); break;
      case 'profileReload': loadHistory(true); cache.clear(); loadProfile(true); render(true); break;
      case 'selRole': S.select.role = v; render(true); break;
      case 'postTab': S.postTab = v; render(true); break;
      /* ---- Mes builds ---- */
      case 'edNew': { const k = el.dataset.kind; S.ed = { kind: k, isNew: true, sec: 'core', itQ: '', itTag: '', draft: k === 'runes' ? newRunePage(el.dataset.champ) : newItemBuild(el.dataset.champ) }; S.mode = 'prep'; S.tab = 'builds'; S.view = { champ: null, item: null }; render(); break; }
      case 'edOpen': case 'edDup': {
        const k = el.dataset.kind, list = k === 'runes' ? S.myRunes : S.myItems, b = list.find((x) => x.id === v); if (!b) break;
        const draft = JSON.parse(JSON.stringify(b)); if (a === 'edDup') { draft.id = uid(); draft.name = (draft.name || '') + ' (copie)'; draft.at = Date.now(); }
        S.ed = { kind: k, isNew: a === 'edDup', sec: 'core', itQ: '', itTag: '', draft }; S.mode = 'prep'; S.tab = 'builds'; S.view = { champ: null, item: null }; render(); break;
      }
      case 'edDel': if (confirmTap(el, 'Sûr ?')) { if (el.dataset.kind === 'runes') S.myRunes = S.myRunes.filter((x) => x.id !== v); else S.myItems = S.myItems.filter((x) => x.id !== v); render(true); } break;
      case 'edCancel': S.ed = null; render(); break;
      case 'edSave': {
        const d = S.ed.draft;
        if (!d.champ) { toast('Choisis un champion.'); break; }
        const list = S.ed.kind === 'runes' ? S.myRunes : S.myItems;
        if (S.ed.kind === 'items' && !d.core.length && !d.start.length && !d.boots) { toast('Ajoute au moins un objet.'); break; }
        d.at = Date.now();
        const i = list.findIndex((x) => x.id === d.id); if (i >= 0) list[i] = d; else list.push(d);
        toast(S.ed.kind === 'runes' && !runeComplete(d) ? '💾 Enregistrée (incomplète : elle ne pourra pas être appliquée)' : '💾 Build enregistré');
        S.ed = null; render(); break;
      }
      case 'edRole': { const r = S.ed.draft.roles; S.ed.draft.roles = r.includes(v) ? r.filter((x) => x !== v) : r.concat(v); render(true); break; }
      case 'edTree': { const d = S.ed.draft; if (d.primary !== +v) { d.primary = +v; d.perks = [0, 0, 0, 0]; if (d.sub === +v) { d.sub = 0; d.subPerks = []; } } render(true); break; }
      case 'edPerk': S.ed.draft.perks[+el.dataset.row] = +v; render(true); break;
      case 'edSub': { const d = S.ed.draft; if (d.sub !== +v) { d.sub = +v; d.subPerks = []; } render(true); break; }
      case 'edSubPerk': {
        const d = S.ed.draft, row = +el.dataset.row, perk = +v;
        if (d.subPerks.some((x) => x.perk === perk)) d.subPerks = d.subPerks.filter((x) => x.perk !== perk);
        else { d.subPerks = d.subPerks.filter((x) => x.row !== row); d.subPerks.push({ row, perk }); if (d.subPerks.length > 2) d.subPerks.shift(); }
        render(true); break;
      }
      case 'edShard': S.ed.draft.shards[+el.dataset.row] = +v; render(true); break;
      case 'edSpell': { const d = S.ed.draft, k = +v; d.spells = d.spells.filter(Boolean); if (d.spells.includes(k)) d.spells = d.spells.filter((x) => x !== k); else { d.spells.push(k); if (d.spells.length > 2) d.spells.shift(); } while (d.spells.length < 2) d.spells.push(0); render(true); break; }
      case 'edSec': if (!ev.target.closest('button')) { S.ed.sec = v; S.ed.itQ = ''; render(true); } break;
      case 'edTag': S.ed.itTag = v; render(true); break;
      case 'edAdd': {
        const d = S.ed.draft, id = +v, sec = S.ed.sec;
        if (sec === 'boots') d.boots = id;
        else if (sec === 'start') { if (d.start.length < 4) d.start.push(id); }
        else { const L2 = d[sec]; if (!L2.includes(id) && L2.length < 8) L2.push(id); }
        render(true); break;
      }
      case 'edRm': { const d = S.ed.draft, sec = el.dataset.sec, i = +el.dataset.i; if (sec === 'boots') d.boots = 0; else d[sec].splice(i, 1); render(true); break; }
      case 'edMv': { const L2 = S.ed.draft[el.dataset.sec], i = +el.dataset.i; if (i > 0) [L2[i - 1], L2[i]] = [L2[i], L2[i - 1]]; render(true); break; }
      case 'selItemBuild': S.selItems[el.dataset.champ] = v; R.ovKey = ''; save(); render(true); break;
      case 'ovToggle': { const on = !(((R.cfg || {}).overlay || {}).enabled !== false); NB.config.set({ overlay: { enabled: on } }).then((c) => { R.cfg = c; R.ovKey = ''; render(true); }).catch(() => {}); break; }
      case 'layReset': R.layDraft = null; NB.config.set({ overlay: { layout: Object.assign({}, LAY_DEF) } }).then((c) => { R.cfg = c; render(true); layPreview(); }).catch(() => {}); break;
      case 'layPreview': layPreview(); break;
      case 'ovLoadToggle': { const on = ((R.cfg || {}).overlay || {}).loading === false; NB.config.set({ overlay: { loading: on } }).then((c) => { R.cfg = c; R.loadovKey = ''; render(true); }).catch(() => {}); break; }
      case 'ovReset': NB.overlay.reset().then(() => toast('Encart replacé en bas de l\'écran du jeu')).catch(() => {}); break;
      case 'applyMyRunes': {
        const b = S.myRunes.find((x) => x.id === v); if (!b) break;
        el.classList.add('busy');
        const sp = spellsOf(b);
        NB.lcu.applyRunes(myRunePayload(b)).then(() => {
          R.applied.runes = 'my-' + b.id;
          if (sp.length === 2) {
            let [x, y] = sp; const me = (R.lcu.champSelect && R.lcu.champSelect.myTeam.find((p) => p.isMe)) || {}; const cur = me.spells || [];
            if (y === 4 && cur[1] !== 4) [x, y] = [y, x]; if (x === 4 && cur[1] === 4) [x, y] = [y, x];
            return NB.lcu.applySpells([x, y]).then(() => { R.applied.spells = [x, y].sort((m, n) => m - n).join(','); toast('✅ Ta page de runes et tes sorts sont appliqués dans le client'); });
          }
          toast('✅ Ta page de runes est appliquée dans le client');
        }).catch((e) => toast('❌ ' + e.message)).finally(() => render(true));
        break;
      }
      case 'openMatch': toast('Chargement de la partie…'); NB.postgame.load(v, myPuuid()).then((d) => { R.post = d; S.mode = 'game'; S.postTab = 'resume'; render(); }).catch((e) => toast('❌ ' + e.message)); break;
      case 'voiceTest': speak('Le Nashor est disponible. Tu as assez d\'or pour Lame d\'infini.'); break;
      case 'voiceRate': S.opt.voiceRate = +v; render(true); speak('Vitesse de la voix.'); break;
      case 'voiceVol': S.opt.voiceVol = +v; render(true); speak('Volume.'); break;
      case 'selOpp': S.select.opp = S.select.opp === v ? '' : v; render(true); break;
      case 'applyRunes': {
        const pg = R.selPages[+el.dataset.i]; if (!pg) break;
        el.classList.add('busy');
        NB.lcu.applyRunes(pg).then(() => { R.applied.runes = pg.key; toast('✅ Page de runes créée et sélectionnée dans le client'); }).catch((e) => toast('❌ ' + e.message)).finally(() => render(true));
        break;
      }
      case 'applySpells': {
        const pair = R.selSpells[+el.dataset.i]; if (!pair) break;
        let [a, b] = pair.split(',').map(Number);
        /* Saut éclair reste sur la touche où tu l'as déjà (D ou F) */
        const me = (R.lcu.champSelect && R.lcu.champSelect.myTeam.find((p) => p.isMe)) || {};
        const cur = me.spells || [];
        if (b === 4 && cur[1] !== 4) [a, b] = [b, a];
        if (a === 4 && cur[1] === 4) [a, b] = [b, a];
        NB.lcu.applySpells([a, b]).then(() => { R.applied.spells = pair; toast('✅ Sorts d\'invocateur mis à jour dans le client'); }).catch((e) => toast('❌ ' + e.message)).finally(() => render(true));
        break;
      }
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
      case 'opt': S.opt[v] = !S.opt[v]; if (v === 'voice' && S.opt.voice) speak('Annonces vocales activées.'); render(true); break;
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
      case 'miniEmbed': S.opt.miniEmbed = !S.opt.miniEmbed; MM.err = ''; render(true); break;
      case 'miniRetry': MM.err = ''; mmStop(); render(true); break;
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
      case 'coachToggle': S.opt.coach = Object.assign({}, S.opt.coach || {}, { [v]: !coachOn(v) }); save(); render(true); break;
      case 'remToggle': S.opt.reminders = S.opt.reminders === false; save(); render(true); break;
      case 'progRole': S.progRole = v; save(); render(true); break;
      case 'goalMetric': goalOf('all'); S.goals[S.progRole || 'all'] = { metric: v }; save(); render(true); break;
      case 'goalReset': { goalOf('all'); const k = S.progRole || 'all'; S.goals[k] = { metric: (S.goals[k] || {}).metric }; save(); render(true); break; }
      case 'targetTier': S.targetTier = v; save(); render(true); break;
      case 'goalStep': { const G0 = ((R.hist && R.hist.games) || []).filter((g) => !S.progRole || MATCH_ROLE[g.role] === S.progRole); const g = currentGoal(G0); const t = Math.max(g.M.step, Math.round((g.target + (+v) * g.M.step) * 100) / 100); S.goals[g.rk] = { metric: g.metric, target: t, custom: true }; save(); render(true); break; }
      case 'loadOpp': R.loadOpp = +v; render(true); break;
      case 'followGameBuild': { const b = R.loadBuildCur, g = R.lcu.game; if (!b || !g) break;
        S.gameBuild = { gameId: g.gameId, champ: b.c.id, build: { id: 'game-' + g.gameId, name: `Conseillé${b.oc ? ' vs ' + b.oc.name : ''}`, champ: b.c.id, roles: b.role ? [b.role] : [], start: b.start.slice(), core: b.core.slice(), boots: b.boots || 0, situational: b.next.slice() } };
        save(); R.ovKey = ''; toast('⭐ Ce build sera suivi dans l\'encart en jeu'); render(true); break; }
      case 'unfollowGameBuild': S.gameBuild = null; save(); R.ovKey = ''; render(true); break;
      case 'statsExport': NB.stats.exportFile().then((r) => { if (r) toast(`📤 ${nf(r.matches)} parties exportées (${(r.size / 1048576).toFixed(1).replace('.', ',')} Mo) : ${r.path.split(/[\\/]/).pop()}`); }).catch((e) => toast('❌ ' + e.message)); break;
      case 'statsImport': askImport(); break;
      case 'statsImportNo': R.importAsk = null; render(true); break;
      case 'statsImportOk': { const a = R.importAsk; if (!a || R.importBusy) break; R.importBusy = true; render(true);
        NB.stats.importFile(a.file).then((r) => { toast(`✅ ${nf(r.matches)} nouvelles parties ajoutées (total : ${nf(r.total)})`); R.importAsk = null; cache.clear(); return NB.collector.status().then((c) => { R.col = c; }); })
          .catch((e) => toast('❌ ' + e.message)).finally(() => { R.importBusy = false; render(true); }); break; }
      case 'simOpen': NB.sim.open().catch((e) => toast('❌ ' + e.message)); break;
      case 'openData': NB.openData().catch(() => {}); break;
      case 'checkUpdate': R.upd = Object.assign({}, R.upd, { state: 'checking' }); render(true); NB.update.check().then((u) => { R.upd = u; render(true); }).catch((e) => { R.upd = { state: 'error', error: e.message, checkedAt: Date.now() }; render(true); }); break;
      case 'renewKey': NB.key.renew().then(() => { R.key.renewing = true; renderTop(); if (S.mode === 'settings') render(true); }).catch((e) => toast('❌ ' + e.message)); break;
      case 'reloadData': if (window.caches) window.caches.delete('nooblol-ddragon').finally(() => location.reload()); else location.reload(); break;
      case 'wipe': if (confirmTap(el, 'Tout effacer ? Clique encore')) { const keep = { myRunes: S.myRunes, myItems: S.myItems, selItems: S.selItems, seeded: S.seeded }; localStorage.setItem(KEY, JSON.stringify(Object.assign(defaults(), keep))); location.reload(); } break;
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

  /* Curseurs de l'encart de chargement : enregistrés et prévisualisés en direct */
  document.addEventListener('input', (ev) => {
    const t = ev.target; if (!t.dataset || !t.dataset.lay) return;
    R.layDraft = Object.assign({}, R.layDraft || {}, { [t.dataset.lay]: +t.value });
    const lab = t.parentElement && t.parentElement.querySelector('b'); if (lab) lab.textContent = `${Math.round(+t.value * 1080)} px`;
    clearTimeout(R.laySave);
    R.laySave = setTimeout(() => { const l = layNow(); NB.config.set({ overlay: { layout: l } }).then((c) => { R.cfg = c; R.layDraft = null; layPreview(); }).catch(() => {}); }, 150);
  });
  document.addEventListener('input', (ev) => {
    const el = ev.target;
    if (el.dataset.ed && S.ed) {
      if (el.dataset.ed === 'name') { S.ed.draft.name = el.value; return; }
      if (el.dataset.ed === 'itQ') { S.ed.itQ = el.value; const g = document.getElementById('edgrid'); if (g) g.innerHTML = edItemGrid(); return; }
    }
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
    if (el.dataset.ed === 'champ' && S.ed) { S.ed.draft.champ = el.value; el.blur(); render(true); return; }
    if (el.dataset.voice) { S.opt.voiceName = el.value; save(); speak('Voix sélectionnée.'); return; }
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
      if (st.game && (!old.game || old.game.gameId !== st.game.gameId)) { R.loadOpp = 0; R.recent = {}; }
      if (/InProgress|Reconnect/.test(st.phase) && !/InProgress|Reconnect/.test(old.phase || '')) { R.inProgressAt = Date.now(); setTimeout(() => { try { if (isLoading() && D.champs) loadovSync(loadingData()); } catch (e) { /* ignoré */ } }, 3100); }
      if (!/InProgress|Reconnect/.test(st.phase)) R.inProgressAt = 0;
      try { if (isLoading() && D.champs) { const ld = loadingData(); wantInfo(ld.g.players.map((p) => p.puuid)); wantRecent(ld.g.players.map((p) => p.puuid)); loadovSync(ld); } else loadovSync(null); } catch (e) { /* ignoré */ }
      const auto = !R.cfg || R.cfg.autoMode !== false;
      if (st.phase !== prevPhase) {
        if (st.phase === 'ChampSelect') { R.applied = { runes: '', spells: '' }; S.select.opp = ''; S.select.role = ''; }
        if (auto && st.phase === 'ChampSelect') { S.mode = 'select'; S.view = { champ: null, item: null }; }
        else if (auto && (st.phase === 'InProgress' || st.phase === 'GameStart')) S.mode = 'game';
        else if (auto && prevPhase === 'ChampSelect' && /Lobby|Matchmaking|None/.test(st.phase) && S.mode === 'select') S.mode = 'prep';
        prevPhase = st.phase;
        if (st.connected && !old.connected && R.cfg && !(R.cfg.riotId || {}).gameName && st.summoner && st.summoner.tagLine) cfgSet({ riotId: { gameName: st.summoner.gameName, tagLine: st.summoner.tagLine } });
        render(true); return;
      }
      if (S.mode === 'select' && !busy()) render(true); else renderTop();
    });
    NB.live.on((d) => { if (d && !R.live && R.cfg && R.cfg.autoMode !== false) S.mode = 'game'; onLive(d); try { if (d && started(d)) loadovSync(null); else if (isLoading() && D.champs) loadovSync(loadingData()); } catch (e) { /* ignoré */ } });
    NB.collector.on((s) => { const grew = R.col && s.picks !== R.col.picks; R.col = s; if (grew && s.picks % 50 < 10) cache.clear(); if (S.mode === 'settings' && !busy()) render(true); });
    NB.minimap.onState((open) => { R.miniOpen = open; if (!busy()) render(true); });
    NB.onUpdate((u) => { R.update = u; renderTop(); });
    if (NB.overlay && NB.overlay.onOpenItem) NB.overlay.onOpenItem((id) => { if (S.mode !== 'prep') lastMode = S.mode; openView('item', id); });
    if (NB.stats.onOpenFile) { NB.stats.onOpenFile((f) => askImport(f)); NB.stats.pendingFile().then((f) => { if (f) askImport(f); }).catch(() => {}); }
    if (NB.update) { NB.update.on((u) => { R.upd = u; if (S.mode === 'settings' && !busy()) render(true); }); NB.update.state().then((u) => { R.upd = u; }).catch(() => {}); }
    NB.postgame.on((d) => {
      const fresh = !R.post || R.post.at !== d.at;
      R.post = d;
      if (fresh && !d.old && R.cfg && R.cfg.autoMode !== false && !R.live) { S.mode = 'game'; S.postTab = 'resume'; }
      if (!busy()) render(true);
    });
    NB.key.on((k) => {
      const was = R.key.state; R.key = k;
      if (k.state === 'expired' && was !== 'expired' && !R.live) speak('Ta clé Riot a expiré. Clique sur Renouveler ma clé.', 'key-expired-' + Math.floor(Date.now() / 3600000));
      renderTop(); if (S.mode === 'settings' && !busy()) render(true);
    });
    NB.key.onRenewed((k) => {
      R.key = k; R.keyMsg = '✅ Nouvelle clé récupérée, vérifiée et enregistrée.'; R.profile = null; R.profileErr = ''; cache.clear();
      toast('✅ Nouvelle clé Riot enregistrée'); speak('Nouvelle clé Riot enregistrée.');
      NB.config.get().then((c) => { R.cfg = c; render(true); });
    });
    NB.key.status().then((k) => { R.key = k; renderTop(); }).catch(() => {});
    NB.postgame.get().then((d) => { if (d) { R.post = d; if (S.mode === 'game') render(true); } }).catch(() => {});
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
