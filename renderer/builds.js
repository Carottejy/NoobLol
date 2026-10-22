/* Recommandations de runes et de kits d'objets à partir des parties analysées par le collecteur.
   Entrée : lignes brutes (une par joueur ayant joué ce champion dans ce rôle), données Riot (objets, champions),
   adversaire de voie et équipe adverse actuels. Fonctions pures, sans accès au DOM. */
var Builds = (() => {
  'use strict';
  const MIN_VS = 8;       /* parties minimum contre l'adversaire pour une reco « contre lui » */
  const HEAL = new Set(['Soraka', 'Aatrox', 'Vladimir', 'Sylas', 'DrMundo', 'Warwick', 'Fiddlesticks', 'Swain', 'Yuumi', 'Sona', 'Nami', 'Briar', 'Illaoi', 'Olaf', 'Nasus', 'Trundle', 'Seraphine', 'Milio', 'Renata', 'Gwen', 'Zac', 'Samira', 'Kayn', 'Senna']);
  const SKILL = { 1: 'Q', 2: 'W', 3: 'E', 4: 'R' };

  const ids = (s) => String(s || '').split(',').filter(Boolean).map(Number);
  const isBoots = (it) => !!it && (it.tags || []).includes('Boots') && it.gold.total > 300;
  const isLegendary = (it) => !!it && !(it.into && it.into.length) && it.gold.total >= 2000 && !(it.tags || []).includes('Consumable') && !isBoots(it);
  function count(rows, keyFn, weightFn) {
    const m = new Map();
    for (const r of rows) {
      const k = keyFn(r); if (k == null || k === '') continue;
      const w = weightFn ? weightFn(r) : 1;
      const o = m.get(k) || { key: k, games: 0, wins: 0, w: 0 };
      o.games++; o.wins += r.win ? 1 : 0; o.w += w; m.set(k, o);
    }
    return [...m.values()].sort((a, b) => b.w - a.w || b.wins / b.games - a.wins / a.games);
  }

  /* Profil d'une équipe : part de dégâts magiques, tanks, soigneurs */
  function teamProfile(keys, D) {
    const cs = keys.map((k) => D.byKey[String(k)]).filter(Boolean);
    if (!cs.length) return null;
    const ap = cs.reduce((s, c) => s + (c.info.magic + 0.01) / (c.info.attack + c.info.magic + 0.02), 0) / cs.length;
    return { n: cs.length, ap, tanks: cs.filter((c) => c.tags.includes('Tank')).map((c) => c.id), healers: cs.filter((c) => HEAL.has(c.id)).map((c) => c.id) };
  }
  /* Ressemblance entre l'équipe adverse d'une partie analysée et l'équipe adverse actuelle (0 à 1+) */
  function similarity(row, cur, curKeys, D) {
    if (!cur || !row.enemies) return 0.5;
    const ks = ids(row.enemies);
    const p = teamProfile(ks, D);
    if (!p) return 0.5;
    const shared = ks.filter((k) => curKeys.includes(k)).length;
    return Math.max(0, 1 - 2 * Math.abs(p.ap - cur.ap)) + 0.25 * shared;
  }

  function legendaries(row, D) {
    const out = [];
    for (const id of ids(row.seq)) { const it = D.items[String(id)]; if (isLegendary(it) && !out.includes(id)) out.push(id); }
    return out;
  }
  function firstBoots(row, D) { for (const id of ids(row.seq)) if (isBoots(D.items[String(id)])) return id; return null; }
  function skillOrder(s) {
    if (!s || s.length < 9) return null;
    const first9 = s.slice(0, 9).split('').filter((c) => c !== '4');
    const n = { 1: 0, 2: 0, 3: 0 }; first9.forEach((c) => { n[c] = (n[c] || 0) + 1; });
    /* À égalité, le sort monté en premier passe devant */
    const firstAt = (k) => s.indexOf(k);
    return ['1', '2', '3'].sort((a, b) => n[b] - n[a] || firstAt(a) - firstAt(b)).map((k) => SKILL[k]).join(' > ');
  }

  function analyze(rows, D, { opp = 0, enemies = [] } = {}) {
    const res = { games: rows.length, wins: rows.filter((r) => r.win).length };
    if (!rows.length) return res;
    const vs = opp ? rows.filter((r) => r.opp === opp) : [];
    const useVs = vs.length >= MIN_VS;
    res.opp = opp; res.vsGames = vs.length; res.useVs = useVs;
    const cur = teamProfile(enemies, D);
    res.team = cur;

    /* Runes : contre l'adversaire si possible */
    const runeRows = useVs ? vs : rows;
    res.runes = count(runeRows.filter((r) => r.runes), (r) => r.runes + '#' + (r.shards || '')).slice(0, 3)
      .map((o) => ({ runes: o.key.split('#')[0], shards: o.key.split('#')[1], games: o.games, wins: o.wins }));
    res.runesVs = useVs;
    res.spells = count(useVs ? vs : rows, (r) => r.spells).slice(0, 2).map((o) => ({ spells: o.key, games: o.games, wins: o.wins }));

    /* Kit d'objets (nécessite la chronologie) */
    const tl = rows.filter((r) => r.seq);
    res.timelineGames = tl.length;
    if (tl.length) {
      const tlVs = opp ? tl.filter((r) => r.opp === opp) : [];
      const early = tlVs.length >= MIN_VS ? tlVs : tl;
      res.earlyVs = early === tlVs;
      res.earlyGames = early.length;
      res.start = count(early.filter((r) => r.start), (r) => r.start).slice(0, 2).map((o) => ({ items: ids(o.key), games: o.games, wins: o.wins }));
      res.boots = count(early, (r) => firstBoots(r, D)).slice(0, 2).map((o) => ({ item: +o.key, games: o.games, wins: o.wins }));
      res.core = count(early, (r) => { const l = legendaries(r, D); return l.length >= 2 ? l[0] + '>' + l[1] : null; }).slice(0, 3)
        .map((o) => ({ items: o.key.split('>').map(Number), games: o.games, wins: o.wins }));
      /* 3e objet et suivants : pondérés par la ressemblance avec l'équipe adverse actuelle */
      const sim = (r) => 0.25 + similarity(r, cur, enemies, D);
      const coreSet = new Set((res.core[0] || { items: [] }).items);
      const later = new Map();
      for (const r of tl) {
        const l = legendaries(r, D).slice(2, 5);
        const w = sim(r);
        for (const id of l) { if (coreSet.has(id)) continue; const o = later.get(id) || { item: id, games: 0, wins: 0, w: 0 }; o.games++; o.wins += r.win ? 1 : 0; o.w += w; later.set(id, o); }
      }
      res.later = [...later.values()].sort((a, b) => b.w - a.w).slice(0, 6);
      const sk = count(tl.filter((r) => r.skills), (r) => skillOrder(r.skills));
      res.skills = sk[0] ? { order: sk[0].key, games: sk[0].games, wins: sk[0].wins, share: sk[0].games / tl.filter((r) => r.skills).length } : null;
      const f3 = count(tl.filter((r) => r.skills && r.skills.length >= 3), (r) => r.skills.slice(0, 3).split('').map((c) => SKILL[c]).join(' '));
      if (res.skills && f3[0]) res.skills.first = f3[0].key;
      res.situational = situational(tl, D, cur, enemies, coreSet);
    }
    return res;
  }

  /* Objets à adapter à l'équipe adverse, choisis parmi ce que les bons joueurs construisent sur ce champion */
  function situational(tl, D, cur, enemies, coreSet) {
    if (!cur) return [];
    const rules = [];
    const desc = (it) => String(it.description || '');
    if (cur.ap >= 0.58) rules.push({ id: 'mr', why: `Équipe adverse surtout magique (${Math.round(cur.ap * 100)} % AP)`, test: (it) => (it.tags || []).includes('SpellBlock'), hint: 'un objet de résistance magique' });
    if (cur.ap <= 0.42) rules.push({ id: 'armor', why: `Équipe adverse surtout physique (${Math.round((1 - cur.ap) * 100)} % AD)`, test: (it) => (it.tags || []).includes('Armor'), hint: 'un objet d\'armure' });
    if (cur.healers.length) rules.push({ id: 'heal', why: `Soins importants en face (${cur.healers.map((id) => (D.champs[id] || {}).name || id).join(', ')})`, test: (it) => /blessures graves/i.test(desc(it)), hint: 'un objet qui applique Blessures graves (réduit les soins)' });
    if (cur.tanks.length >= 2) rules.push({ id: 'pen', why: `${cur.tanks.length} tanks en face (${cur.tanks.map((id) => (D.champs[id] || {}).name || id).join(', ')})`, test: (it) => (it.tags || []).some((t) => t === 'ArmorPenetration' || t === 'MagicPenetration') || /PV max/i.test(desc(it)), hint: 'un objet de pénétration ou de dégâts selon les PV max' });
    return rules.map((rule) => {
      const m = new Map(); let n = 0;
      for (const r of tl) {
        const w = 0.25 + similarity(r, cur, enemies, D);
        n += w;
        for (const id of legendaries(r, D)) {
          const it = D.items[String(id)];
          if (!rule.test(it)) continue;
          const o = m.get(id) || { item: id, games: 0, wins: 0, w: 0 }; o.games++; o.wins += r.win ? 1 : 0; o.w += w; m.set(id, o);
        }
      }
      const items = [...m.values()].filter((o) => o.games >= 2).sort((a, b) => b.w - a.w).slice(0, 2).map((o) => Object.assign(o, { share: n ? o.w / n : 0 }));
      return { id: rule.id, why: rule.why, hint: rule.hint, items };
    });
  }

  /* ---------- Rôles : attribuer un rôle à chaque champion d'une équipe ----------
     dist = { champKey: { top: n, jungle: n, … } } (parties analysées), fixed = { champKey: rôle connu }.
     On teste toutes les répartitions possibles (5! = 120) et on garde la plus probable. */
  const ROLES5 = ['top', 'jungle', 'mid', 'adc', 'support'];
  const TAG_PRIOR = {
    Marksman: { adc: 6, mid: 1, top: 0.5, support: 0.3, jungle: 0.3 }, Support: { support: 6, mid: 1, top: 0.3, jungle: 0.3, adc: 0.3 },
    Mage: { mid: 4, support: 2, top: 0.6, jungle: 0.5, adc: 0.6 }, Assassin: { mid: 3, jungle: 3, top: 0.8, support: 0.2, adc: 0.2 },
    Fighter: { top: 4, jungle: 3, mid: 0.8, support: 0.2, adc: 0.2 }, Tank: { top: 3, jungle: 2.5, support: 2.5, mid: 0.4, adc: 0.1 },
  };
  function roleProbs(key, D, dist) {
    const c = D.byKey[String(key)];
    const prior = { top: 0.2, jungle: 0.2, mid: 0.2, adc: 0.2, support: 0.2 };
    if (c) for (const t of c.tags || []) { const tp = TAG_PRIOR[t]; if (tp) for (const r of ROLES5) prior[r] += tp[r] || 0; }
    const pn = ROLES5.reduce((s, r) => s + prior[r], 0);
    const st = (dist || {})[key] || (dist || {})[String(key)] || {};
    const games = ROLES5.reduce((s, r) => s + (st[r] || 0), 0);
    const out = {};
    /* Les statistiques dominent dès qu'il y a des parties ; l'a priori (classe du champion) sert de base. */
    for (const r of ROLES5) out[r] = ((st[r] || 0) + 8 * prior[r] / pn) / (games + 8);
    return out;
  }
  function assignRoles(keys, D, dist, fixed = {}) {
    const ks = keys.filter(Boolean);
    const free = ROLES5.filter((r) => !Object.values(fixed).includes(r));
    const todo = ks.filter((k) => !fixed[k]);
    const probs = Object.fromEntries(todo.map((k) => [k, roleProbs(k, D, dist)]));
    let best = null, bestScore = -Infinity;
    const perm = (i, used, acc, score) => {
      if (i === todo.length) { if (score > bestScore) { bestScore = score; best = Object.assign({}, acc); } return; }
      for (const r of free) { if (used.has(r)) continue; used.add(r); acc[todo[i]] = r; perm(i + 1, used, acc, score + Math.log(probs[todo[i]][r] + 1e-6)); used.delete(r); }
    };
    if (todo.length <= free.length) perm(0, new Set(), {}, 0);
    const out = Object.assign({}, best || {});
    for (const k of Object.keys(fixed)) out[k] = fixed[k];
    return out;
  }

  /* ---------- Objectifs de la Faille (saison 2026) à partir des événements officiels du jeu ---------- */
  const OBJ = { drake: { first: 300, respawn: 300 }, elder: { respawn: 360 }, grubs: { first: 480, end: 885 }, herald: { first: 900, end: 1185 }, baron: { first: 1200, respawn: 360 } };
  const DRAKE_FR = { Fire: 'infernal', Water: 'océans', Earth: 'montagnes', Air: 'nuages', Hextech: 'hextech', Chemtech: 'chemtech' };
  function objectives(L, myTeam) {
    const t = L ? L.time : 0;
    const me = myTeam || 'ORDER';
    const teamOf = {};
    if (L) for (const p of L.players || []) { teamOf[p.name] = p.team; teamOf[p.gameName] = p.team; }
    const side = (team) => (!team ? null : team === me ? 'us' : 'them');
    const sideOfKiller = (n) => side(teamOf[n] || teamOf[String(n || '').split('#')[0]] || (/_T100|Order/i.test(n) ? 'ORDER' : /_T200|Chaos/i.test(n) ? 'CHAOS' : ''));
    const ownerSide = (name) => { const m = String(name || '').match(/_T([12])_/); if (!m) return null; return side(m[1] === '1' ? 'ORDER' : 'CHAOS'); };
    const S = { drake: { us: 0, them: 0, types: { us: [], them: [] } }, elder: { us: 0, them: 0 }, grubs: { us: 0, them: 0 }, herald: { us: 0, them: 0 }, baron: { us: 0, them: 0 }, turret: { us: 0, them: 0 }, inhib: { us: 0, them: 0 } };
    let lastDrake = null, lastElder = null, lastBaron = null, soulAt = null, heraldDone = false, grubsKilled = 0;
    for (const e of (L && L.events) || []) {
      if (e.name === 'DragonKill') {
        const sd = sideOfKiller(e.killer);
        if (/elder/i.test(e.dragon)) { lastElder = e.t; if (sd) S.elder[sd]++; }
        else { lastDrake = e.t; if (sd) { S.drake[sd]++; S.drake.types[sd].push(DRAKE_FR[e.dragon] || e.dragon); if (S.drake[sd] === 4 && soulAt == null) soulAt = e.t; } }
      } else if (e.name === 'BaronKill') { lastBaron = e.t; const sd = sideOfKiller(e.killer); if (sd) S.baron[sd]++; }
      else if (e.name === 'HeraldKill') { heraldDone = true; const sd = sideOfKiller(e.killer); if (sd) S.herald[sd]++; }
      else if (e.name === 'HordeKill') { grubsKilled++; const sd = sideOfKiller(e.killer); if (sd) S.grubs[sd]++; }
      else if (e.name === 'TurretKilled') { const o = ownerSide(e.turret); if (o) S.turret[o === 'us' ? 'them' : 'us']++; }
      else if (e.name === 'InhibKilled') { const o = ownerSide(e.inhib); if (o) S.inhib[o === 'us' ? 'them' : 'us']++; }
    }
    const timed = (next) => (t < next ? { state: 'spawn', in: next - t } : { state: 'up' });
    const rows = [];
    rows.push(Object.assign({ id: 'drake', name: 'Dragon', score: S.drake }, soulAt != null ? { state: 'done', label: 'âme prise' } : timed(lastDrake != null ? lastDrake + OBJ.drake.respawn : OBJ.drake.first)));
    rows.push(Object.assign({ id: 'grubs', name: 'Larves du Néant', score: S.grubs }, grubsKilled >= 3 ? { state: 'done', label: 'prises' } : t >= OBJ.grubs.end ? { state: 'gone', label: 'disparues' } : timed(OBJ.grubs.first)));
    rows.push(Object.assign({ id: 'herald', name: 'Héraut de la Faille', score: S.herald }, heraldDone ? { state: 'done', label: 'pris' } : t >= OBJ.herald.end ? { state: 'gone', label: 'disparu' } : timed(OBJ.herald.first)));
    rows.push(Object.assign({ id: 'baron', name: 'Baron Nashor', score: S.baron }, timed(lastBaron != null ? lastBaron + OBJ.baron.respawn : OBJ.baron.first)));
    rows.push(Object.assign({ id: 'elder', name: 'Dragon ancestral', score: S.elder }, soulAt == null ? { state: 'locked', label: 'après l\'âme' } : timed((lastElder != null && lastElder > soulAt ? lastElder : soulAt) + OBJ.elder.respawn)));
    return { rows, turret: S.turret, inhib: S.inhib, drakeTypes: S.drake.types, time: t };
  }

  return { analyze, teamProfile, skillOrder, isLegendary, isBoots, MIN_VS, assignRoles, roleProbs, objectives, ROLES5 };
})();
if (typeof module !== 'undefined') module.exports = Builds;
