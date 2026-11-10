/* =====================================================================
   NoobStatMotor : builds par champion, d'après data/nooblol_builds_par_champion.md
   (une fiche par champion : analyse du kit, 10 builds rattachés à des voies, corrections en jeu).
   Sélection : builds de la voie du joueur, présentés par catégorie, build « Standard » par défaut,
   variante mise en avant selon la situation principale de l'équipe adverse.
   En jeu : situations recalculées (dont adversaire « très feed ») → corrections de la fiche, 2 au maximum.
   Les objets portent leur nom anglais officiel ; l'appli les traduit en objets Riot.
   ===================================================================== */
var NSM = (() => {
  'use strict';
  let DB = null, CH = null;

  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  /* Identifiants Riot qui ne ressemblent pas au nom du champion */
  const ALIAS = { monkeyking: 'wukong', nunu: 'nunuwillump', renata: 'renataglasc' };
  function init(data) {
    DB = data; CH = {};
    Object.keys(data.champions).forEach((n) => { CH[norm(n)] = Object.assign({ name: n }, data.champions[n]); });
    return DB;
  }
  /* c : champion Data Dragon ({ id, name }) ou nom anglais */
  function champ(c) {
    if (!DB || !c) return null;
    const ids = typeof c === 'string' ? [c] : [c.id, c.name];
    for (const x of ids) { const k = norm(x); if (CH[k]) return CH[k]; if (ALIAS[k] && CH[ALIAS[k]]) return CH[ALIAS[k]]; }
    return null;
  }
  const item = (n) => (DB && DB.items[n]) || null;
  const isBoots = (n) => (item(n) || {}).cat === 'boots';
  const isSupport = (n) => (item(n) || {}).cat === 'support';
  const isLegendary = (n) => (item(n) || {}).cat === 'legendary';
  const fr = (n) => (item(n) || {}).fr || n;
  /* Remplace les noms anglais des objets par leur nom français dans un texte de la fiche */
  let NAMES = null;
  function frText(t) {
    if (!DB) return t;
    if (!NAMES) NAMES = Object.keys(DB.items).filter((n) => DB.items[n].fr).sort((a, b) => b.length - a.length);
    let out = String(t || '');
    NAMES.forEach((n) => { if (out.includes(n)) out = out.split(n).join(DB.items[n].fr); });
    return out;
  }

  /* ---------- Profil des adversaires (d'après leur fiche) ---------- */
  const ASSASSINS = ['Zed', 'Talon', "Kha'Zix", 'Fizz', 'Akali', 'Evelynn', 'Katarina', 'LeBlanc', 'Qiyana', 'Naafiri', 'Rengar', 'Locke', 'Pyke', 'Shaco', 'Nocturne', 'Kayn'];
  const HEALERS = ['Soraka', 'Aatrox', 'Vladimir', 'Warwick', 'Dr. Mundo', 'Sylas', 'Swain', 'Yuumi', 'Briar'];
  const SHIELDERS = ['Lulu', 'Janna', 'Karma', 'Sett', 'Seraphine', 'Milio', 'Renata Glasc'];
  const SUPPRESSION = ['Malzahar', 'Warwick', 'Skarner', 'Urgot'];
  function traits(e) {
    if (!e) return null;
    const cats = e.builds.map((b) => b.cat);
    const kit = e.kit.join(' ');
    return {
      name: e.name, dmg: e.dmg,
      tank: cats.filter((c) => /^Tank/.test(c)).length >= 3 || (/naturellement résistant/.test(kit) && /engage/.test(kit) && !cats.some((c) => /^Dégâts/.test(c))),
      assassin: ASSASSINS.includes(e.name),
      heal: HEALERS.includes(e.name) || /soins sur soi|soins \/ boucliers aux alliés/.test(kit),
      shield: SHIELDERS.includes(e.name) || /soins \/ boucliers aux alliés/.test(kit),
      cc: /engage et contrôles/.test(kit),
      suppression: SUPPRESSION.includes(e.name),
    };
  }

  /* ---------- 1.3 Situations ---------- */
  const PRIORITY = ['feed', 'vs_cc', 'vs_heal', 'vs_assassin', 'vs_ap', 'vs_ad', 'vs_tanks', 'vs_shields', 'behind', 'ahead', 'long_game'];
  const SIT_FR = {
    feed: 'adversaire très feed', vs_cc: 'suppression ou beaucoup de contrôles en face', vs_heal: 'soins en face', vs_assassin: 'assassin en face', vs_ap: 'dégâts magiques en face',
    vs_ad: 'dégâts physiques en face', vs_tanks: 'tanks en face', vs_shields: 'boucliers en face', behind: 'tu es en retard', ahead: 'tu es en avance', long_game: 'partie longue',
  };
  /* Variante de build qui répond à chaque situation (sélection) */
  const VARIANT = { vs_heal: 'Anti-soins', vs_assassin: 'Contre AD / assassins', vs_ap: 'Contre AP', vs_ad: 'Contre AD / assassins', vs_tanks: 'Contre tanks', ahead: 'Boule de neige', long_game: 'Partie longue' };
  /* enemies : [champions] ; feed : [{ c: champion, … }] adversaires très feed (en jeu) */
  function situations(enemies, feed) {
    const T = (enemies || []).map((c) => traits(champ(c))).filter(Boolean);
    const F = (feed || []).map((f) => Object.assign({}, f, { t: traits(champ(f.c)) })).filter((f) => f.t);
    const n = (k) => T.filter((t) => t[k]).length;
    const s = new Map();
    const who = (f) => T.filter(f).map((t) => t.name);
    if (F.length) s.set('feed', F.map((f) => f.t.name));
    if (n('suppression') >= 1 || n('cc') >= 3) s.set('vs_cc', who((t) => t.suppression || t.cc));
    if (n('heal') >= 2 || F.some((f) => f.t.heal)) s.set('vs_heal', who((t) => t.heal));
    if (n('assassin') >= 1) s.set('vs_assassin', who((t) => t.assassin));
    if (T.filter((t) => t.dmg === 'AP').length >= 3 || F.some((f) => f.t.dmg === 'AP')) s.set('vs_ap', who((t) => t.dmg === 'AP'));
    if (T.filter((t) => t.dmg === 'AD').length >= 3 || F.some((f) => f.t.dmg === 'AD')) s.set('vs_ad', who((t) => t.dmg === 'AD'));
    if (n('tank') >= 2 || F.some((f) => f.t.tank)) s.set('vs_tanks', who((t) => t.tank));
    if (n('shield') >= 2) s.set('vs_shields', who((t) => t.shield));
    return s;
  }

  /* ---------- 1.1 Sélection : builds de la voie, par catégorie, variante conseillée ---------- */
  function builds(c, role) {
    const e = champ(c); if (!e) return null;
    let list = e.builds.filter((b) => !role || b.lanes.includes(role));
    if (!list.length) list = e.builds.slice(); /* voie inhabituelle : toutes les fiches */
    const cats = [];
    list.forEach((b) => { if (!cats.includes(b.cat)) cats.push(b.cat); });
    /* catégorie principale : celle qui a le plus de builds pour cette voie */
    cats.sort((a, b) => list.filter((x) => x.cat === b).length - list.filter((x) => x.cat === a).length);
    return { e, list, cats };
  }
  function recommend(c, role, enemies, state, cat) {
    const B = builds(c, role); if (!B) return null;
    const sits = situations(enemies, []);
    if (state && (state.gold || 0) >= 1500) sits.set('ahead', []);
    if (state && (state.time || 0) > 1800) sits.set('long_game', []);
    const category = cat && B.cats.includes(cat) ? cat : B.cats[0];
    const inCat = B.list.filter((b) => b.cat === category);
    const std = inCat.find((b) => b.variant === 'Standard') || inCat[0];
    let pick = std, why = null;
    for (const k of PRIORITY) {
      if (!sits.has(k) || !VARIANT[k]) continue;
      const v = inCat.find((b) => b.variant === VARIANT[k]);
      if (v) { pick = v; why = k; break; }
    }
    return { e: B.e, category, cats: B.cats, list: B.list, standard: std, pick, why, sits };
  }

  /* ---------- Objets de départ (1.4) ---------- */
  function start(cat, c, opp) {
    const e = champ(c), o = champ(opp);
    if (/\(jungle\)/.test(cat)) return [/^Tank/.test(cat) ? 'Mosstomper Seedling' : /AP/.test(cat) ? 'Scorchclaw Pup' : 'Gustwalker Hatchling', 'Health Potion'];
    if (/^Support/.test(cat)) return ['World Atlas', 'Health Potion'];
    if (/^Tank/.test(cat)) return ["Doran's Shield", 'Health Potion'];
    if (/AP/.test(cat)) return ["Doran's Ring", 'Health Potion'];
    if (/^Combattant/.test(cat)) return [o && o.range === 'R' && e && e.range === 'M' ? "Doran's Shield" : "Doran's Blade", 'Health Potion'];
    return ["Doran's Blade", 'Health Potion'];
  }

  /* ---------- 1.2 En jeu : corrections de la fiche (2 au maximum), prochain objet ---------- */
  /* ctx : { enemies: [champions], feed: [{ c, kda, gold }], state: { gold, time }, owned: [noms], build } */
  function corrections(c, ctx) {
    const e = champ(c); if (!e) return [];
    const sits = situations(ctx.enemies, ctx.feed);
    const st = ctx.state || {};
    if ((st.gold || 0) <= -1500) sits.set('behind', []);
    else if ((st.gold || 0) >= 1500) sits.set('ahead', []);
    const own = new Set(ctx.owned || []);
    const out = [];
    const add = (id, label, list, text, prio) => {
      const todo = (list || []).filter((n) => !own.has(n));
      if (todo.length) out.push({ id, label, items: todo, text: frText(text), prio });
    };
    for (const f of (ctx.feed || [])) {
      const t = traits(champ(f.c)); if (!t) continue;
      if (t.assassin && e.corr.assassin) add('feed-assassin', `${t.name} (assassin) est très feed${f.why ? ' (' + f.why + ')' : ''}`, e.corr.assassin[t.dmg === 'AP' ? 'ap' : 'ad'], e.corr.assassin.text, 0);
      else if (t.tank && e.corr.tank) add('feed-tank', `${t.name} (tank) est très feed${f.why ? ' (' + f.why + ')' : ''}`, e.corr.tank.items, e.corr.tank.text, 0);
      else if (t.dmg === 'AP' && e.corr.ap) add('feed-ap', `${t.name} (dégâts magiques) est très feed${f.why ? ' (' + f.why + ')' : ''}`, e.corr.ap.items, e.corr.ap.text, 0);
      else if (e.corr.ad) add('feed-ad', `${t.name} (dégâts physiques) est très feed${f.why ? ' (' + f.why + ')' : ''}`, e.corr.ad.items, e.corr.ad.text, 0);
    }
    const map = { vs_cc: 'cc', vs_heal: 'heal', vs_tanks: 'tank', vs_shields: 'shields', behind: 'behind', ahead: 'ahead' };
    PRIORITY.forEach((k, i) => {
      if (!sits.has(k) || k === 'feed') return;
      const w = sits.get(k), lab = SIT_FR[k] + (w && w.length ? ` (${w.join(', ')})` : '');
      if (k === 'vs_assassin' && e.corr.assassin) {
        /* « objet (AD) / objet (AP) » : selon le type de dégâts de l'assassin adverse */
        const a0 = (ctx.enemies || []).map((x) => traits(champ(x))).find((t) => t && t.assassin);
        add(k, lab, e.corr.assassin[a0 && a0.dmg === 'AP' ? 'ap' : 'ad'], e.corr.assassin.text, i);
      }
      else if (map[k] && e.corr[map[k]]) add(k, lab, e.corr[map[k]].items, e.corr[map[k]].text, i);
    });
    /* une correction par type, dans l'ordre de priorité, 2 au maximum */
    const seen = new Set();
    return out.sort((a, b) => a.prio - b.prio).filter((x) => { const k = x.items.join(); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 2);
  }
  function flowTips(c, state) {
    const e = champ(c); if (!e || !state) return [];
    const out = [];
    if ((state.gold || 0) >= 1500 && e.corr.ahead) out.push('En avance : ' + frText(e.corr.ahead.text));
    else if ((state.gold || 0) <= -1500 && e.corr.behind) out.push('En retard : ' + frText(e.corr.behind.text));
    return out;
  }

  if (typeof NSM_DATA !== 'undefined') init(NSM_DATA);
  return { init, champ, traits, situations, builds, recommend, start, corrections, flowTips, isBoots, isSupport, isLegendary, item, fr, frText, norm, SIT_FR, VARIANT, get version() { return DB && DB.version; } };
})();
if (typeof module !== 'undefined') module.exports = NSM;
