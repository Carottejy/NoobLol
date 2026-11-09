/* =====================================================================
   NoobStatMotor : moteur de builds par règles, d'après data/nooblol_builds.md
   (profils de champions, 10 builds par profil, situations détectées dans l'équipe adverse,
   ajustements objet par objet, déroulé de la partie, match-up de voie).
   Travaille sur les noms anglais des objets (comme le fichier) ; l'appli les traduit en objets Riot.
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
  const ROLE = { top: 'TOP', jungle: 'JGL', mid: 'MID', adc: 'ADC', support: 'SUP' };
  function profileOf(e, role) {
    if (!e) return null;
    const r = ROLE[role] || role;
    const p = e.roles[r] || e.roles[Object.keys(e.roles)[0]];
    return p && DB.archetypes[p] ? p : null;
  }
  const item = (n) => DB.items[n] || null;
  const isBoots = (n) => (item(n) || {}).cat === 'boots';
  const isSupport = (n) => (item(n) || {}).cat === 'support';
  const groupsOf = (n) => (item(n) || {}).groups || [];
  const fr = (n) => (item(n) || {}).fr || n;

  /* Familles de profils pour les ajustements (section 4.3) */
  const FAM = {
    MAGE: ['MAGE_BURST', 'MAGE_BATTLE', 'MAGE_ARTILLERY', 'AP_ASSASSIN', 'AP_BRUISER', 'AP_ONHIT', 'SUPPORT_MAGE'],
    FIGHTER: ['AD_JUGGERNAUT', 'AD_DIVER', 'AD_SKIRMISHER', 'AD_CRIT_SKIRMISHER'],
    ASSASSIN_AD: ['AD_ASSASSIN'],
    ADC: ['ADC_CRIT', 'ADC_ONHIT', 'ADC_CASTER'],
    TANK: ['TANK', 'TANK_SUPPORT', 'AP_TANK'],
    ENCHANTER: ['ENCHANTER'],
  };
  const famOf = (p) => Object.keys(FAM).find((f) => FAM[f].includes(p)) || 'MAGE';

  /* ---------- 4.2 Situations détectées dans l'équipe adverse ---------- */
  const HEAL_LIST = ['Soraka', 'Aatrox', 'Vladimir', 'Warwick', 'Dr. Mundo', 'Yuumi', 'Sylas', 'Swain', 'Briar'];
  const PRIORITY = ['vs_suppression', 'vs_heal', 'vs_assassin', 'vs_ap', 'vs_ad', 'vs_tanks', 'vs_shields', 'vs_cc', 'vs_dive', 'vs_autoattack', 'vs_squishy', 'ahead', 'behind', 'long_game'];
  const SIT_FR = {
    vs_suppression: 'suppression en face', vs_heal: 'beaucoup de soins en face', vs_assassin: 'assassin en face', vs_ap: 'au moins 3 dégâts magiques en face',
    vs_ad: 'au moins 3 dégâts physiques en face', vs_tanks: 'au moins 2 tanks en face', vs_shields: 'beaucoup de boucliers en face', vs_cc: 'beaucoup de contrôles en face',
    vs_dive: 'plongeurs et engageurs en face', vs_autoattack: 'des attaques de base dangereuses en face', vs_squishy: 'aucun tank en face', vs_stealth: 'camouflage en face',
    vs_poke: 'harcèlement à distance en face', vs_true: 'dégâts bruts en face', ahead: 'tu es en avance', behind: 'tu es en retard', long_game: 'partie longue',
  };
  function situations(enemies) {
    const E = (enemies || []).map(champ).filter(Boolean);
    const n = (t) => E.filter((e) => e.tags.includes(t)).length;
    const dmg = (d) => E.filter((e) => e.dmg === d).length;
    const s = new Set();
    if (n('heal') >= 2 || E.some((e) => HEAL_LIST.includes(e.name))) s.add('vs_heal');
    if (n('shield') >= 2) s.add('vs_shields');
    if (dmg('AD') >= 3) s.add('vs_ad');
    if (dmg('AP') >= 3) s.add('vs_ap');
    if (n('tank') >= 2) s.add('vs_tanks');
    if (E.length >= 3 && n('tank') === 0) s.add('vs_squishy');
    if (n('assassin') >= 1) s.add('vs_assassin');
    if (n('dive') + n('engage') >= 2) s.add('vs_dive');
    if (n('aa') >= 2) s.add('vs_autoattack');
    if (n('cc') >= 3) s.add('vs_cc');
    if (n('suppression') >= 1) s.add('vs_suppression');
    if (n('stealth') >= 1) s.add('vs_stealth');
    if (n('poke') >= 2) s.add('vs_poke');
    if (n('true') >= 2) s.add('vs_true');
    const who = (f) => E.filter(f).map((e) => e.name);
    const detail = {
      vs_heal: who((e) => e.tags.includes('heal') || HEAL_LIST.includes(e.name)), vs_shields: who((e) => e.tags.includes('shield')), vs_ad: who((e) => e.dmg === 'AD'), vs_ap: who((e) => e.dmg === 'AP'),
      vs_tanks: who((e) => e.tags.includes('tank')), vs_assassin: who((e) => e.tags.includes('assassin')), vs_dive: who((e) => e.tags.includes('dive') || e.tags.includes('engage')),
      vs_autoattack: who((e) => e.tags.includes('aa')), vs_cc: who((e) => e.tags.includes('cc')), vs_suppression: who((e) => e.tags.includes('suppression')), vs_stealth: who((e) => e.tags.includes('stealth')),
      vs_poke: who((e) => e.tags.includes('poke')), vs_true: who((e) => e.tags.includes('true')),
    };
    return { set: s, detail, known: E.length };
  }

  /* ---------- 4.1 étape 3 : build de base ---------- */
  function chooseBuild(profile, active) {
    const builds = DB.archetypes[profile].builds;
    let best = null;
    builds.forEach((b, i) => {
      const hit = b.tags.filter((t) => active.has(t));
      const rank = hit.length ? Math.min(...hit.map((t) => (PRIORITY.indexOf(t) < 0 ? 99 : PRIORITY.indexOf(t)))) : 999;
      const sc = [hit.length, -rank, -i];
      if (!best || sc[0] > best.sc[0] || (sc[0] === best.sc[0] && (sc[1] > best.sc[1] || (sc[1] === best.sc[1] && sc[2] > best.sc[2])))) best = { b, hit, sc };
    });
    if (!best || !best.hit.length) { const d = builds.find((b) => b.tags.includes('default')) || builds[0]; return { b: d, hit: [] }; }
    return best;
  }

  /* ---------- 4.3 Ajustements et 4.1 étape 6 : validation ---------- */
  const ANTIHEAL = ['Morellonomicon', 'Chempunk Chainsword', 'Mortal Reminder', 'Thornmail', 'Executioner\'s Calling', 'Oblivion Orb', 'Bramble Vest'];
  const NO_MANA = { "Luden's Companion": 'Stormsurge', Malignance: "Liandry's Torment", 'Blackfire Torch': 'Riftmaker', 'Frozen Heart': "Randuin's Omen" };
  const SUP_ITEM = { MAGE: "Zaz'Zak's Realmspike", FIGHTER: 'Bloodsong', ASSASSIN_AD: 'Bloodsong', ADC: "Zaz'Zak's Realmspike", TANK: 'Celestial Opposition', ENCHANTER: 'Dream Maker' };

  function conflicts(list, name) { const g = groupsOf(name); return g.length ? list.filter((x) => x !== name && groupsOf(x).some((y) => g.includes(y))) : []; }
  /* Remplace l'objet le moins utile (le dernier objet légendaire) ou celui du même groupe exclusif */
  /* rank : place parmi les objets légendaires (2 = 3e objet légendaire acheté) ; 0 = tout début de la liste */
  function putItem(list, name, rank) {
    if (list.includes(name)) return false;
    const cf = conflicts(list, name);
    if (cf.length) list.splice(list.indexOf(cf[0]), 1);
    else {
      let idx = -1;
      for (let i = list.length - 1; i >= 0; i--) if (!isBoots(list[i]) && !isSupport(list[i])) { idx = i; break; }
      if (idx < 0) return false;
      list.splice(idx, 1);
    }
    let at = list.length;
    if (rank === 0) at = 0;
    else if (rank != null) { let leg = 0; at = list.length; for (let i = 0; i < list.length; i++) { if (isBoots(list[i]) || isSupport(list[i])) continue; if (leg === rank) { at = i; break; } leg++; } }
    list.splice(at, 0, name);
    return true;
  }
  function validate(list, e, profile, notes) {
    const mana = e.res === 'MANA';
    /* objets « mana uniquement » pour un champion sans mana */
    if (!mana) list.forEach((n, i) => { if ((item(n) || {}).mana_only) { const r = NO_MANA[n]; list[i] = r && !list.includes(r) ? r : null; notes.push(`${e.name} n'utilise pas de mana : ${fr(n)} ${r ? '→ ' + fr(r) : 'retiré'}`); } });
    /* Cassiopeia : pas de bottes */
    if (e.name === 'Cassiopeia') list.forEach((n, i) => { if (n && isBoots(n)) { const r = ["Rylai's Crystal Scepter", "Zhonya's Hourglass", "Liandry's Torment"].find((x) => !list.includes(x)); list[i] = r || null; notes.push('Cassiopeia ne peut pas acheter de bottes : ' + (r ? fr(r) + ' à la place' : 'un autre objet à la place')); } });
    /* une seule paire de bottes, un seul objet de support, un objet par groupe exclusif */
    let boots = 0, sup = 0; const used = new Set();
    for (let i = 0; i < list.length; i++) {
      const n = list[i]; if (!n) continue;
      if (isBoots(n) && boots++) { list[i] = null; continue; }
      if (isSupport(n) && sup++) { list[i] = null; continue; }
      const g = groupsOf(n);
      if (g.some((x) => used.has(x))) { list[i] = null; continue; }
      g.forEach((x) => used.add(x));
    }
    let out = list.filter(Boolean);
    out = out.filter((n, i) => out.indexOf(n) === i);
    /* compléter jusqu'à 6 avec les objets des autres builds du profil (standard d'abord) */
    const pool = [].concat(...DB.archetypes[profile].builds.map((b) => b.items));
    for (const n of pool) {
      if (out.length >= 6) break;
      if (out.includes(n) || isBoots(n) || isSupport(n) || (!mana && (item(n) || {}).mana_only)) continue;
      if (conflicts(out, n).length) continue;
      if (e.name === 'Cassiopeia' && isBoots(n)) continue;
      out.push(n);
    }
    return out.slice(0, 6);
  }

  /* ---------- Le build complet ---------- */
  /* ctx : { role, enemies: [champions], opp: champion, state: { gold, time, laneKills } } */
  function build(c, ctx = {}) {
    if (!DB) return null;
    const e = champ(c); if (!e) return { unknown: true, name: c && c.name };
    const role = ctx.role || '';
    const profile = profileOf(e, role); if (!profile) return { unknown: true, name: e.name };
    const fam = famOf(profile);
    const S = situations(ctx.enemies);
    const active = new Set(S.set);
    const st = ctx.state || null;
    if (st) {
      if ((st.gold || 0) > 1500 || (st.laneKills || 0) >= 2) active.add('ahead');
      else if ((st.gold || 0) < -1500) active.add('behind');
      if ((st.time || 0) > 1800) active.add('long_game');
    }
    const base = chooseBuild(profile, active);
    const list = base.b.items.slice();
    const notes = [], changes = [];
    const has = (n) => list.includes(n);
    const tryAdd = (n, why, pos) => { if (changes.length >= 2 || has(n) || !item(n)) return; if (putItem(list, n, pos)) changes.push(`${why} : ${fr(n)}`); };
    const setBoots = (n, why) => { if (changes.length >= 2 || has(n) || e.name === 'Cassiopeia') return; const i = list.findIndex(isBoots); if (i >= 0) { list[i] = n; changes.push(`${why} : ${fr(n)}`); } };
    const covered = (t) => base.b.tags.includes(t);
    const majAD = S.detail.vs_ad.length >= S.detail.vs_ap.length;
    /* Ajustements dans l'ordre de priorité des situations (2 changements au maximum) */
    for (const sit of PRIORITY.filter((t) => active.has(t))) {
      if (covered(sit)) continue;
      if (sit === 'vs_suppression') { if (fam === 'ADC' || profile === 'AD_CRIT_SKIRMISHER' || profile === 'AD_SKIRMISHER') tryAdd('Mercurial Scimitar', 'Suppression en face'); else setBoots("Mercury's Treads", 'Suppression en face'); }
      if (sit === 'vs_heal' && !list.some((n) => ANTIHEAL.includes(n))) {
        const ah = { MAGE: 'Morellonomicon', FIGHTER: 'Chempunk Chainsword', ASSASSIN_AD: 'Chempunk Chainsword', ADC: 'Mortal Reminder', TANK: majAD ? 'Thornmail' : 'Hollow Radiance' }[fam];
        if (ah) tryAdd(ah, 'Anti-soins (à acheter en 2e ou 3e objet)', 2); else notes.push('Anti-soins : laisse un équipier mieux placé l\'acheter.');
      }
      if (sit === 'vs_assassin') { if (fam === 'MAGE') tryAdd("Zhonya's Hourglass", 'Contre les assassins'); else if (fam === 'ADC') tryAdd('Guardian Angel', 'Contre les assassins'); }
      if (sit === 'vs_ap' && !list.some((n) => ((item(n) || {}).stats || {}).mr)) setBoots("Mercury's Treads", 'Contre les dégâts magiques');
      if (sit === 'vs_ad' && !list.some((n) => ((item(n) || {}).stats || {}).arm)) setBoots('Plated Steelcaps', 'Contre les dégâts physiques');
      if (sit === 'vs_tanks') {
        const pen = { MAGE: 'Void Staff', ADC: "Lord Dominik's Regards", FIGHTER: 'Black Cleaver', ASSASSIN_AD: "Serylda's Grudge" }[fam];
        if (pen && !list.some((n) => groupsOf(n).includes('Fatality') || n === 'Void Staff')) tryAdd(pen, 'Contre les tanks');
      }
      if (sit === 'vs_shields' && (fam === 'ADC' || fam === 'ASSASSIN_AD')) tryAdd("Serpent's Fang", 'Contre les boucliers');
      if (sit === 'vs_cc' && fam !== 'ADC' && !list.includes("Mercury's Treads")) setBoots("Mercury's Treads", 'Beaucoup de contrôles en face');
    }
    /* Supports : l'objet de support (quête) au 1er emplacement */
    if (role === 'support' && !list.some(isSupport)) {
      const si = e.name === 'Pyke' || e.name === 'Pantheon' ? 'Bloodsong' : SUP_ITEM[fam];
      putItem(list, si, 0); notes.push(`Support : ${fr(si)} en 1er emplacement (évolution de l'objet de support)`);
    } else if (e.name === 'Pyke' && role === 'support') { const i = list.findIndex(isSupport); if (i >= 0) list[i] = 'Bloodsong'; }
    const items = validate(list, e, profile, notes);
    if (active.has('vs_stealth')) notes.push('Camouflage en face : achète des Balises de contrôle et prends la Lentille d\'oracle.');
    if (active.has('vs_poke')) notes.push('Harcèlement en face : objets de régénération ou bouclier magique (Rookern de Kaenic, Visage spirituel) et engage vite plutôt que subir.');
    if (active.has('vs_true')) notes.push('Dégâts bruts en face : privilégie les PV aux résistances.');
    return {
      champ: e.name, profile, profileLabel: DB.archetypes[profile].label, fam, base: base.b.name, baseTags: base.b.tags,
      situations: PRIORITY.concat(['vs_stealth', 'vs_poke', 'vs_true']).filter((t) => active.has(t)).map((t) => ({ id: t, fr: SIT_FR[t] || t, who: S.detail[t] || [] })),
      matched: base.hit, changes, notes, items, res: e.res, range: e.range, version: DB.version,
    };
  }

  /* ---------- 4.4 Départ ---------- */
  function start(c, role, opp) {
    const e = champ(c); const p = e && profileOf(e, role); if (!p) return [];
    const fam = famOf(p), o = champ(opp);
    if (role === 'support') return ['World Atlas', 'Health Potion'];
    if (role === 'jungle') return ['Gustwalker Hatchling', 'Health Potion'];
    if (fam === 'MAGE' || fam === 'ENCHANTER') return ["Doran's Ring", 'Health Potion'];
    if (fam === 'TANK') return ["Doran's Shield", 'Health Potion'];
    if (fam === 'ADC') return ["Doran's Blade", 'Health Potion'];
    return [o && o.range === 'R' && e.range === 'M' ? "Doran's Shield" : "Doran's Blade", 'Health Potion'];
  }

  /* ---------- 4.5 Match-up de voie : conseils et composants à acheter tôt ---------- */
  function lane(c, role, opp) {
    const e = champ(c), o = champ(opp); const p = e && profileOf(e, role);
    if (!e || !o || !p) return [];
    const fam = famOf(p), ap = e.dmg === 'AP' || fam === 'MAGE', out = [];
    const T = (text, items) => out.push({ text, items: items || [] });
    if (o.tags.includes('poke') && e.range === 'M') T(`${o.name} harcèle à distance et tu es au corps à corps : Bouclier de Doran au départ, Second souffle dans les runes, et des PV tôt`, ["Doran's Shield"]);
    if (o.tags.includes('assassin')) T(`${o.name} est un assassin : un composant défensif tôt`, [ap ? "Seeker's Armguard" : o.dmg === 'AP' ? 'Null-Magic Mantle' : 'Cloth Armor']);
    if (o.tags.includes('tank') && fam !== 'TANK' && fam !== 'ENCHANTER') T(`${o.name} est un tank : de la pénétration en % tôt`, [ap ? 'Void Staff' : fam === 'ADC' ? 'Blade of the Ruined King' : 'Black Cleaver']);
    if (o.tags.includes('heal')) T(`${o.name} se soigne : un composant anti-soins avant ton 1er objet`, [fam === 'TANK' ? 'Bramble Vest' : ap ? 'Oblivion Orb' : "Executioner's Calling"]);
    if (o.tags.includes('split')) T(`${o.name} pousse seul sur les côtés : Brise-coque ou Hydre titanesque pour le contrer (côté AD), ou Téléportation`, ap ? [] : ['Hullbreaker', 'Titanic Hydra']);
    if (o.tags.includes('suppression')) T(`${o.name} a une suppression : garde Purge ou les Sandales de Mercure${fam === 'ADC' ? ', et le Cimeterre mercuriel' : ''}`, fam === 'ADC' ? ['Mercurial Scimitar'] : ["Mercury's Treads"]);
    if (o.dmg === 'AP') T(`${o.name} fait des dégâts magiques : Manteau anti-magie ou Sandales de Mercure tôt`, ['Null-Magic Mantle']);
    else if (o.dmg === 'AD') T(`${o.name} fait des dégâts physiques : Cotte de mailles ou Coques en acier tôt`, ['Cloth Armor']);
    return out;
  }

  /* ---------- 4.4 Déroulé : conseil selon l'état de la partie ---------- */
  function flow(state) {
    const out = [];
    if (!state) return out;
    if ((state.gold || 0) > 1500 || (state.laneKills || 0) >= 2) out.push('En avance : finis d\'abord ton objet offensif (build « Boule de neige ») ; le Voleur d\'âmes de Mejai est possible si tu survis facilement.');
    else if ((state.gold || 0) < -1500) out.push('En retard : achète d\'abord des composants défensifs bon marché (Brassard du chercheur, Hexdrinker, Cotte de mailles) et vise les objets à moins de 2 600 or qui donnent des résistances.');
    if ((state.time || 0) > 1800) out.push('Partie longue : objets à multiplicateur (Coiffe de Rabadon, Lame d\'infini, Cœur d\'acier), revends ton objet de départ, 6e objet défensif.');
    return out;
  }

  /* ---------- En jeu : prochain objet et objet à remplacer ---------- */
  function next(b, ownedNames) {
    if (!b || !b.items) return null;
    const own = new Set(ownedNames || []);
    const todo = b.items.filter((n) => !own.has(n) && !isSupport(n));
    const legOwned = (ownedNames || []).filter((n) => (item(n) || {}).cat === 'legendary');
    const off = legOwned.filter((n) => !b.items.includes(n));
    return { next: todo[0] || null, todo, replace: legOwned.length >= 5 && off.length && todo[0] ? { out: off[off.length - 1], by: todo[0] } : null };
  }

  if (typeof NSM_DATA !== 'undefined') init(NSM_DATA);
  return { init, champ, profileOf, situations, chooseBuild, build, start, lane, flow, next, isBoots, isSupport, item, norm, SIT_FR, get version() { return DB && DB.version; } };
})();
if (typeof module !== 'undefined') module.exports = NSM;
