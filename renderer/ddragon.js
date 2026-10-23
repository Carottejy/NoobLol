/* Accès aux données officielles de Riot Games (Data Dragon), en français.
   Les fichiers sont gardés en cache par le service worker → l'appli marche hors connexion après un premier chargement. */
var Dd = (() => {
  'use strict';
  const BASE = 'https://ddragon.leagueoflegends.com';
  const LANG = 'fr_FR';
  const VKEY = 'nooblol.ddVersion';
  const st = { version: null, champs: null, champList: [], byKey: {}, runeById: {}, treeById: {}, summByKey: {}, items: null, itemList: [], runes: null, summs: null, summList: [], full: {}, error: null, loading: null };

  const getJSON = (url) => fetch(url).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  const cdn = (path) => `${BASE}/cdn/${st.version}/${path}`;

  async function resolveVersion() {
    let v = null;
    try { const list = await getJSON(`${BASE}/api/versions.json`); v = list[0]; st.prevVersion = list.find((x) => x.split('.').slice(0, 2).join('.') !== String(v).split('.').slice(0, 2).join('.')) || null; } catch (e) { /* hors ligne */ }
    let saved = null;
    try { saved = localStorage.getItem(VKEY); } catch (e) { /* ignoré */ }
    if (!v) v = saved;
    if (!v) throw new Error('Impossible de joindre les serveurs de Riot. Vérifie ta connexion internet au premier lancement.');
    if (v !== saved) { try { localStorage.setItem(VKEY, v); } catch (e) { /* ignoré */ } cleanOldPatches(v); }
    return v;
  }
  function cleanOldPatches(v) {
    if (!('caches' in window)) return;
    caches.open('nooblol-ddragon').then((c) => c.keys().then((reqs) => reqs.forEach((r) => {
      const m = r.url.match(/\/cdn\/(\d+\.\d+\.\d+)\//);
      if (m && m[1] !== v) c.delete(r);
    }))).catch(() => {});
  }

  function load() {
    if (st.loading) return st.loading;
    st.loading = (async () => {
      st.version = await resolveVersion();
      const [ch, it, ru, su] = await Promise.all([
        getJSON(cdn(`data/${LANG}/champion.json`)),
        getJSON(cdn(`data/${LANG}/item.json`)),
        getJSON(cdn(`data/${LANG}/runesReforged.json`)),
        getJSON(cdn(`data/${LANG}/summoner.json`)),
      ]);
      st.champs = ch.data;
      st.champList = Object.values(ch.data).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
      st.champList.forEach((c) => { st.byKey[c.key] = c; });
      st.items = it.data;
      Object.keys(it.data).forEach((id) => { it.data[id].id = id; });
      /* Boutique de la Faille : achetable, en magasin, pas réservé à un champion, sans doublon de nom. */
      const seen = new Set();
      st.itemList = Object.values(it.data).filter((x) => x.maps && x.maps['11'] && x.gold && x.gold.purchasable && x.inStore !== false && !x.requiredChampion && !x.requiredAlly && !x.hideFromAll && x.name)
        .sort((a, b) => a.gold.total - b.gold.total || a.name.localeCompare(b.name, 'fr'))
        .filter((x) => { const k = x.name.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
      st.runes = ru;
      ru.forEach((t) => { st.treeById[t.id] = t; t.slots.forEach((sl) => sl.runes.forEach((r) => { st.runeById[r.id] = r; })); });
      st.summs = su.data;
      Object.values(su.data).forEach((x) => { st.summByKey[x.key] = x; });
      st.summList = Object.values(su.data).filter((s) => (s.modes || []).includes('CLASSIC')).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
      st.error = null;
      return st;
    })().catch((e) => { const m = e.message || String(e); st.error = /fetch|network|HTTP/i.test(m) ? 'Impossible de charger les données de Riot. Vérifie ta connexion internet, puis réessaie.' : m; st.loading = null; throw e; });
    return st.loading;
  }

  function champFull(id) {
    if (st.full[id]) return Promise.resolve(st.full[id]);
    return getJSON(cdn(`data/${LANG}/champion/${id}.json`)).then((j) => (st.full[id] = j.data[id]));
  }

  /* ---------- Ce qui change pour un champion entre le patch précédent et le patch actuel ---------- */
  const STAT_FR = { hp: 'PV', hpperlevel: 'PV par niveau', mp: 'Mana', mpperlevel: 'Mana par niveau', movespeed: 'Vitesse de déplacement', armor: 'Armure', armorperlevel: 'Armure par niveau',
    spellblock: 'Résistance magique', spellblockperlevel: 'Résistance magique par niveau', attackrange: 'Portée d\'attaque', hpregen: 'Régénération de PV', hpregenperlevel: 'Régénération de PV par niveau',
    mpregen: 'Régénération de mana', mpregenperlevel: 'Régénération de mana par niveau', attackdamage: 'Dégâts d\'attaque', attackdamageperlevel: 'Dégâts d\'attaque par niveau',
    attackspeedperlevel: 'Vitesse d\'attaque par niveau (%)', attackspeed: 'Vitesse d\'attaque' };
  const nums = (b) => String(b || '').split('/').map(Number).filter((x) => !Number.isNaN(x));
  const plainTxt = (t) => String(t || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  /* Comparaison de deux fiches champion (données Riot) : utilisable aussi dans les tests */
  function diffChamp(a, b) {
    const out = [];
    if (!a || !b) return out;
    for (const k of Object.keys(STAT_FR)) {
      const x = (a.stats || {})[k], y = (b.stats || {})[k];
      if (x == null || y == null || Math.abs(x - y) < 1e-6) continue;
      out.push({ what: STAT_FR[k], before: String(x), after: String(y), good: y > x });
    }
    const sp = (c) => [Object.assign({ key: 'Passif' }, c.passive || {})].concat((c.spells || []).map((x, i) => Object.assign({ key: 'QWER'[i] }, x)));
    const A = sp(a), B = sp(b);
    B.forEach((y, i) => {
      const x = A[i]; if (!x) return;
      const lab = `${y.key} – ${y.name}`;
      for (const [f, nm, lowerIsBetter] of [['cooldownBurn', 'recharge (s)', true], ['costBurn', 'coût', true], ['rangeBurn', 'portée', false]]) {
        if (x[f] == null || y[f] == null || x[f] === y[f]) continue;
        const nx = nums(x[f]), ny = nums(y[f]);
        const sx = nx.reduce((s2, v) => s2 + v, 0), sy = ny.reduce((s2, v) => s2 + v, 0);
        out.push({ what: `${lab} : ${nm}`, before: x[f], after: y[f], good: nx.length && ny.length ? (lowerIsBetter ? sy < sx : sy > sx) : null });
      }
      const ex = JSON.stringify(x.effectBurn || []), ey = JSON.stringify(y.effectBurn || []);
      if (ex !== ey && (y.effectBurn || []).some(Boolean)) out.push({ what: `${lab} : valeurs de la compétence`, before: '', after: 'modifiées', good: null });
      if (plainTxt(x.description) !== plainTxt(y.description)) out.push({ what: `${lab} : description`, before: '', after: 'modifiée', good: null, text: plainTxt(y.description) });
    });
    return out;
  }
  function champAt(version, id) { return getJSON(`${BASE}/cdn/${version}/data/${LANG}/champion/${id}.json`).then((j) => j.data[id]); }
  async function patchDiff(ids) {
    if (!st.prevVersion) return null;
    const key = `nooblol.patch.${st.prevVersion}>${st.version}`;
    let memo = {};
    try { memo = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { memo = {}; }
    const out = {};
    for (const id of ids) {
      if (!memo[id]) {
        try { const [a, b] = await Promise.all([champAt(st.prevVersion, id).catch(() => null), champFull(id)]); memo[id] = a ? diffChamp(a, b) : 'new'; } catch (e) { continue; }
      }
      out[id] = memo[id];
    }
    try { localStorage.setItem(key, JSON.stringify(memo)); } catch (e) { /* ignoré */ }
    return { from: st.prevVersion, to: st.version, champs: out };
  }

  const img = {
    champ: (c) => cdn(`img/champion/${c.image.full}`),
    splash: (id, n = 0) => `${BASE}/cdn/img/champion/splash/${id}_${n}.jpg`,
    loading: (id, n = 0) => `${BASE}/cdn/img/champion/loading/${id}_${n}.jpg`,
    spell: (s) => cdn(`img/spell/${s.image.full}`),
    passive: (p) => cdn(`img/passive/${p.image.full}`),
    item: (it) => cdn(`img/item/${it.image.full}`),
    rune: (r) => `${BASE}/cdn/img/${r.icon}`,
  };

  /* Les descriptions de Riot contiennent des balises maison (<stats>, <passive>, <attention>…).
     On reconstruit un HTML sûr : uniquement du texte échappé + quelques balises connues. */
  const KEEP = { stats: 'dd-stats', passive: 'dd-pas', active: 'dd-act', attention: 'dd-att', rarityLegendary: 'dd-leg', rarityMythic: 'dd-leg', magicDamage: 'dd-mag', physicalDamage: 'dd-phy', trueDamage: 'dd-true', healing: 'dd-heal', shield: 'dd-shield', status: 'dd-status', keywordMajor: 'dd-kw', keywordStealth: 'dd-kw', speed: 'dd-kw', onHit: 'dd-kw', rules: 'dd-rules', flavorText: 'dd-rules', scaleAP: 'dd-mag', scaleAD: 'dd-phy', li: 'dd-li', unique: 'dd-kw', buffedStat: 'dd-att', nerfedStat: 'dd-att', ornnBonus: 'dd-att', goldGain: 'dd-kw', lifeSteal: 'dd-heal' };
  const escT = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function rich(html) {
    if (!html) return '';
    let doc;
    try { doc = new DOMParser().parseFromString('<div>' + String(html) + '</div>', 'text/html'); } catch (e) { return escT(String(html).replace(/<[^>]+>/g, ' ')); }
    const walk = (node) => {
      let out = '';
      node.childNodes.forEach((n) => {
        if (n.nodeType === 3) { out += escT(n.textContent); return; }
        if (n.nodeType !== 1) return;
        const tag = n.tagName.toLowerCase();
        if (tag === 'br') { out += '<br>'; return; }
        if (tag === 'script' || tag === 'style') return;
        const key = Object.keys(KEEP).find((k) => k.toLowerCase() === tag);
        const inner = walk(n);
        if (key === 'li') out += '<br>• ' + inner;
        else if (key) out += `<span class="${KEEP[key]}">${inner}</span>`;
        else out += inner;
      });
      return out;
    };
    return walk(doc.body.firstChild).replace(/^(\s*<br>)+/, '').replace(/(<br>\s*){3,}/g, '<br><br>');
  }
  const plain = (html) => { const t = document.createElement('div'); t.innerHTML = rich(html).replace(/<br>/g, ' '); return t.textContent.replace(/\s+/g, ' ').trim(); };

  return { st, load, champFull, img, rich, plain, diffChamp, patchDiff };
})();
