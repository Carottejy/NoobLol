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

  /* ---------- Pages de runes : une par build, pensée pour ses objets ----------
     Runes théoriques (comme les builds) : choisies selon la catégorie du build, sa variante et le kit du champion.
     Identifiants Riot des runes (runesReforged) et des fragments. */
  const P = { PTA: 8005, LT: 8008, FLEET: 8021, CONQ: 8010, ABSORB: 9101, TRIUMPH: 9111, POM: 8009, ALAC: 9104, HASTE: 9105, BLOOD: 9103, CDG: 8014, CUT: 8017, LAST: 8299 };
  const DOM = { ELEC: 8112, DH: 8128, HOB: 9923, CHEAP: 8126, TASTE: 8139, SUDDEN: 8143, SIXTH: 8137, GRISLY: 8140, DEEP: 8141, TREASURE: 8135, RELENTLESS: 8105, ULTIMATE: 8106 };
  const SOR = { AERY: 8214, COMET: 8229, PHASE: 8230, ORB: 8224, MANAFLOW: 8226, NIMBUS: 8275, TRANS: 8210, CELER: 8234, FOCUS: 8233, SCORCH: 8237, WATER: 8232, STORM: 8236 };
  const RES = { GRASP: 8437, AFTER: 8439, GUARD: 8465, DEMOL: 8446, FONT: 8463, BASH: 8401, COND: 8429, WIND: 8444, BONE: 8473, OVER: 8451, REVIT: 8453, UNFL: 8242 };
  const INS = { GLACIAL: 8351, BOOK: 8360, FIRST: 8369, FOOT: 8304, CASH: 8321, TONIC: 8313, BISCUIT: 8345, COSMIC: 8347, VELOCITY: 8410 };
  const TREE = { 8000: [[P.PTA, P.LT, P.FLEET, P.CONQ], [P.ABSORB, P.TRIUMPH, P.POM], [P.ALAC, P.HASTE, P.BLOOD], [P.CDG, P.CUT, P.LAST]],
    8100: [[DOM.ELEC, DOM.DH, DOM.HOB], [DOM.CHEAP, DOM.TASTE, DOM.SUDDEN], [DOM.SIXTH, DOM.GRISLY, DOM.DEEP], [DOM.TREASURE, DOM.RELENTLESS, DOM.ULTIMATE]],
    8200: [[SOR.AERY, SOR.COMET, SOR.PHASE], [SOR.ORB, SOR.MANAFLOW, SOR.NIMBUS], [SOR.TRANS, SOR.CELER, SOR.FOCUS], [SOR.SCORCH, SOR.WATER, SOR.STORM]],
    8400: [[RES.GRASP, RES.AFTER, RES.GUARD], [RES.DEMOL, RES.FONT, RES.BASH], [RES.COND, RES.WIND, RES.BONE], [RES.OVER, RES.REVIT, RES.UNFL]],
    8300: [[INS.GLACIAL, INS.BOOK, INS.FIRST], [8306, INS.FOOT, INS.CASH], [INS.TONIC, 8352, INS.BISCUIT], [INS.COSMIC, INS.VELOCITY, 8316]] };
  const treeOf = (id) => +Object.keys(TREE).find((t) => TREE[t].some((row) => row.includes(id)));
  const rowOf = (id) => { const t = TREE[treeOf(id)]; return t ? t.findIndex((row) => row.includes(id)) : -1; };
  const SH = { ADAPT: 5008, AS: 5005, AH: 5007, MS: 5010, HPS: 5001, HP: 5011, TEN: 5013 };
  function famRunes(cat) {
    if (/^Support engage/.test(cat)) return 'engage';
    if (/^Support enchanteur/.test(cat)) return 'enchanter';
    if (/AP burst/.test(cat)) return 'burst';
    if (/AP continu/.test(cat)) return 'dps';
    if (/AD critique/.test(cat)) return 'adc';
    if (/à l'impact/.test(cat)) return 'onhit';
    if (/létalité/.test(cat)) return 'lethal';
    if (/^Tank/.test(cat)) return 'tank';
    if (/^Combattant/.test(cat)) return 'fighter';
    return 'adcaster';
  }
  /* Page de base : [voie principale, 4 runes], [voie secondaire, 2 runes], 3 fragments, raison */
  function basePage(e, b, alt) {
    const k = (w) => e.kit.some((x) => x.includes(w));
    const jg = /\(jungle\)/.test(b.cat), sup = /^Support/.test(b.cat), melee = e.range === 'M', fam = famRunes(b.cat);
    const attacks = k('attaques de base') || k('attaques entre les sorts') || k("effets à l'impact");
    switch (fam) {
      case 'engage': return alt ? { pri: [INS.GLACIAL, INS.FOOT, INS.BISCUIT, INS.COSMIC], sec: [RES.FONT, RES.BONE], sh: [SH.AH, SH.HPS, SH.HP], why: 'Augmentation glaciale : ralentit après tes contrôles' }
        : { pri: [RES.AFTER, RES.FONT, RES.BONE, RES.UNFL], sec: [INS.BISCUIT, INS.COSMIC], sh: [SH.AH, SH.HPS, SH.HP], why: 'Répercussion : très résistant après ton engagement' };
      case 'enchanter': return alt ? { pri: [RES.GUARD, RES.FONT, RES.BONE, RES.REVIT], sec: [SOR.MANAFLOW, SOR.TRANS], sh: [SH.AH, SH.ADAPT, SH.HP], why: 'Gardien : protège ton ADC des engagements' }
        : { pri: [SOR.AERY, SOR.MANAFLOW, SOR.TRANS, SOR.SCORCH], sec: [RES.FONT, RES.REVIT], sh: [SH.AH, SH.ADAPT, SH.HP], why: 'Invocation : Aery : soins et boucliers renforcés, harcèlement' };
      case 'burst':
        if (sup) return { pri: [SOR.COMET, SOR.MANAFLOW, SOR.TRANS, SOR.SCORCH], sec: [INS.BISCUIT, INS.COSMIC], sh: [SH.AH, SH.ADAPT, SH.HP], why: 'Comète arcanique : harcèlement depuis la voie du bas' };
        if (jg) return { pri: [DOM.DH, DOM.SUDDEN, DOM.GRISLY, DOM.TREASURE], sec: [SOR.TRANS, SOR.STORM], sh: [SH.ADAPT, SH.ADAPT, SH.HP], why: 'Moisson noire : achève les cibles basses en jungle' };
        if (alt !== !!k('poke à longue portée')) return { pri: [SOR.COMET, SOR.MANAFLOW, SOR.TRANS, SOR.SCORCH], sec: [INS.FOOT, INS.COSMIC], sh: [SH.AH, SH.ADAPT, SH.HP], why: 'Comète arcanique : harcèlement à distance' };
        return { pri: [DOM.ELEC, DOM.TASTE, DOM.GRISLY, k('ultime décisif') ? DOM.ULTIMATE : DOM.TREASURE], sec: [SOR.MANAFLOW, SOR.TRANS], sh: [SH.ADAPT, SH.ADAPT, SH.HP], why: 'Électrocution : pic de dégâts sur ton combo' };
      case 'dps':
        if (sup) return { pri: [SOR.AERY, SOR.MANAFLOW, SOR.TRANS, SOR.SCORCH], sec: [INS.BISCUIT, INS.COSMIC], sh: [SH.AH, SH.ADAPT, SH.HP], why: 'Invocation : Aery : harcèlement à chaque sort' };
        if (jg || (melee && !alt) || ((k('sorts qui montent avec les PV') || k('soins sur soi')) && !alt)) return { pri: [P.CONQ, P.TRIUMPH, P.HASTE, P.LAST], sec: [RES.WIND, RES.UNFL], sh: [SH.AH, SH.ADAPT, SH.HP], why: 'Conquérant : tes dégâts sur la durée te soignent et montent en combat long' };
        return k('très mobile') || alt ? { pri: [SOR.PHASE, SOR.MANAFLOW, SOR.TRANS, SOR.STORM], sec: [INS.FOOT, INS.COSMIC], sh: [SH.AH, SH.ADAPT, SH.HP], why: 'Ruée de phase : fuir et repositionner après tes sorts' }
          : { pri: [SOR.COMET, SOR.MANAFLOW, SOR.TRANS, SOR.STORM], sec: [INS.FOOT, INS.COSMIC], sh: [SH.AH, SH.ADAPT, SH.HP], why: 'Comète arcanique : dégâts de zone et harcèlement' };
      case 'adc':
        if (jg) return { pri: [P.LT, P.TRIUMPH, P.ALAC, P.CDG], sec: [DOM.SUDDEN, DOM.TREASURE], sh: [SH.AS, SH.ADAPT, SH.HP], why: 'Tempo mortel : enchaîne les attaques en jungle' };
        if (alt) return { pri: [P.FLEET, P.POM, P.BLOOD, P.CUT], sec: [RES.WIND, RES.BONE], sh: [SH.AS, SH.ADAPT, SH.HP], why: 'Jeu de jambes : survit au harcèlement en voie' };
        return { pri: [attacks ? P.LT : P.PTA, P.POM, P.BLOOD, P.CDG], sec: [INS.FOOT, INS.COSMIC], sh: [SH.AS, SH.ADAPT, SH.HP], why: `${attacks ? 'Tempo mortel' : 'Attaque soutenue'} : tes objets critiques profitent des attaques en chaîne` };
      case 'onhit':
        if (melee) return { pri: [P.CONQ, P.TRIUMPH, P.ALAC, P.LAST], sec: [RES.WIND, RES.UNFL], sh: [SH.AS, SH.ADAPT, SH.HP], why: 'Conquérant : tes effets à l\'impact en combat long' };
        return alt ? { pri: [DOM.HOB, DOM.TASTE, DOM.GRISLY, DOM.TREASURE], sec: [P.POM, P.ALAC], sh: [SH.AS, SH.ADAPT, SH.HP], why: 'Grêle de lames : rafale d\'attaques en début de combat' }
          : { pri: [P.LT, P.POM, P.ALAC, P.CUT], sec: [INS.FOOT, INS.COSMIC], sh: [SH.AS, SH.ADAPT, SH.HP], why: 'Tempo mortel : multiplie tes effets à l\'impact' };
      case 'lethal':
        if (sup) return { pri: [DOM.HOB, DOM.SUDDEN, DOM.GRISLY, DOM.RELENTLESS], sec: [INS.FOOT, INS.COSMIC], sh: [SH.ADAPT, SH.ADAPT, SH.HP], why: 'Grêle de lames : rafale au moment de l\'engagement' };
        return alt ? { pri: [DOM.DH, DOM.SUDDEN, DOM.GRISLY, DOM.TREASURE], sec: [P.TRIUMPH, P.CDG], sh: [SH.ADAPT, SH.ADAPT, SH.HP], why: 'Moisson noire : achève les cibles basses' }
          : { pri: [DOM.ELEC, DOM.SUDDEN, DOM.GRISLY, jg ? DOM.RELENTLESS : DOM.TREASURE], sec: [P.TRIUMPH, P.CDG], sh: [SH.ADAPT, SH.ADAPT, SH.HP], why: 'Électrocution : pic de dégâts avec tes objets de létalité' };
      case 'tank':
        if (jg || alt) return { pri: [RES.AFTER, RES.FONT, RES.BONE, RES.UNFL], sec: [INS.FOOT, INS.VELOCITY], sh: [SH.AH, SH.HPS, SH.HP], why: 'Répercussion : très résistant après ton engagement' };
        return { pri: [RES.GRASP, RES.DEMOL, RES.WIND, RES.OVER], sec: [INS.BISCUIT, INS.VELOCITY], sh: [SH.AH, SH.HPS, SH.HP], why: 'Poigne de l\'immortel : gagne les échanges en voie et prend des PV' };
      case 'fighter':
        if (!alt && k('naturellement résistant') && k('engage et contrôles') && !jg) return { pri: [RES.GRASP, RES.DEMOL, RES.WIND, RES.OVER], sec: [P.TRIUMPH, P.ALAC], sh: [SH.AH, SH.ADAPT, SH.HP], why: 'Poigne de l\'immortel : échanges courts et PV en plus' };
        if (alt && k('très mobile')) return { pri: [SOR.PHASE, SOR.NIMBUS, SOR.CELER, SOR.WATER], sec: [RES.WIND, RES.UNFL], sh: [SH.AH, SH.ADAPT, SH.HP], why: 'Ruée de phase : entrer, frapper, ressortir' };
        if (alt) return { pri: [RES.GRASP, RES.DEMOL, RES.WIND, RES.OVER], sec: [P.TRIUMPH, P.ALAC], sh: [SH.AH, SH.ADAPT, SH.HP], why: 'Poigne de l\'immortel : échanges courts en voie' };
        return { pri: [P.CONQ, P.TRIUMPH, attacks ? P.ALAC : P.HASTE, P.LAST], sec: jg ? [RES.BONE, RES.UNFL] : [RES.WIND, RES.UNFL], sh: [attacks ? SH.AS : SH.AH, SH.ADAPT, SH.HP], why: 'Conquérant : combats longs, soins sur tes dégâts' };
      default:
        if (jg) return { pri: [P.CONQ, P.TRIUMPH, P.ALAC, P.LAST], sec: [DOM.SUDDEN, DOM.TREASURE], sh: [SH.AH, SH.ADAPT, SH.HP], why: 'Conquérant : combats longs en jungle' };
        return alt ? { pri: [INS.FIRST, INS.FOOT, INS.BISCUIT, INS.COSMIC], sec: [SOR.MANAFLOW, SOR.TRANS], sh: [SH.AH, SH.ADAPT, SH.HP], why: 'Frappe préventive : or bonus en harcelant à distance' }
          : { pri: [P.CONQ, P.POM, P.HASTE, P.LAST], sec: [INS.FOOT, INS.COSMIC], sh: [SH.AH, SH.ADAPT, SH.HP], why: 'Conquérant : tes sorts répétés montent les dégâts' };
    }
  }
  /* Voie secondaire selon la variante du build (si elle diffère de la voie principale) */
  const SEC_BY_VARIANT = {
    'Contre AD / assassins': [[RES.BONE, RES.UNFL], 'Os renforcés contre le burst physique'],
    'Contre AP': [[RES.WIND, RES.UNFL], 'Second souffle contre le harcèlement magique'],
    'Contre tanks': [[P.TRIUMPH, P.CUT], 'Abattage contre les cibles à beaucoup de PV'],
    'Boule de neige': [[DOM.TASTE, DOM.TREASURE], 'Chasseur de trésors : plus d\'or sur tes éliminations'],
    'Partie longue': [[SOR.TRANS, SOR.STORM], 'Tempête menaçante : plus fort à chaque minute'],
    Sustain: [[RES.WIND, RES.REVIT], 'Second souffle et Revitalisation pour tenir'],
    Engagement: [[SOR.CELER, SOR.WATER], 'Célérité : arriver plus vite sur la cible'],
    Accélération: [[INS.FOOT, INS.COSMIC], 'Perspicacité cosmique : sorts et objets plus souvent'],
    Poke: [[SOR.MANAFLOW, SOR.SCORCH], 'Bande de flux de mana et Brûlure pour harceler'],
    'Split push': [[RES.DEMOL, RES.WIND], 'Démolition : tours plus vite en poussant seul'],
  };
  function runes(c, b) {
    const e = champ(c); if (!e || !b) return null;
    /* page écrite dans la fiche (tableau « Runes par build ») si elle existe */
    if (b.runes) return { name: String(b.variant || ''), runes: b.runes.runes, shards: b.runes.shards, why: b.runes.why };
    const variant = String(b.variant || '');
    const pg = basePage(e, b, /^Alternative/.test(variant) && (b.n % 2 === 0));
    let pri = pg.pri.slice(), sec = pg.sec.slice(), sh = pg.sh.slice();
    const why = [pg.why];
    const v = SEC_BY_VARIANT[Object.keys(SEC_BY_VARIANT).find((x) => variant.startsWith(x))];
    if (v) {
      const t = treeOf(v[0][0]);
      if (t !== treeOf(pri[0])) { sec = v[0].slice(); why.push(v[1]); }
      else {
        /* même voie : on remplace la rune de la même ligne dans la voie principale */
        v[0].forEach((id) => { const r = rowOf(id); if (r > 0) pri[r] = id; });
        why.push(v[1]);
      }
    }
    if (variant === 'Contre tanks' && treeOf(pri[0]) === 8000) pri[3] = P.CUT;
    if (variant === 'Partie longue') sh[2] = SH.HPS;
    if (variant === 'Accélération') sh[0] = SH.AH;
    if (variant.startsWith('Contre AD') || variant === 'Contre AP') sh[2] = SH.HP;
    /* validité : 2 runes secondaires de lignes différentes (1 à 3) dans une autre voie */
    const pt = treeOf(pri[0]); let st = treeOf(sec[0]);
    if (st === pt || treeOf(sec[1]) !== st || rowOf(sec[0]) === rowOf(sec[1]) || rowOf(sec[0]) < 1 || rowOf(sec[1]) < 1) { sec = pt === 8400 ? [INS.BISCUIT, INS.COSMIC] : [RES.WIND, RES.UNFL]; st = treeOf(sec[0]); }
    return { name: variant, runes: `${pt}:${pri.join(',')}|${st}:${sec.join(',')}`, shards: sh.join(','), why: why.join(' · ') };
  }

  if (typeof NSM_DATA !== 'undefined') init(NSM_DATA);
  return { init, champ, traits, situations, builds, recommend, start, corrections, flowTips, runes, isBoots, isSupport, isLegendary, item, fr, frText, norm, SIT_FR, VARIANT, get version() { return DB && DB.version; } };
})();
if (typeof module !== 'undefined') module.exports = NSM;
