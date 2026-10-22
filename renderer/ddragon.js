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
    try { const list = await getJSON(`${BASE}/api/versions.json`); v = list[0]; } catch (e) { /* hors ligne */ }
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

  return { st, load, champFull, img, rich, plain };
})();
