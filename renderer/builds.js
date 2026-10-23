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

    /* Poids d'une partie analysée : adversaire de voie identique (×4) et équipe adverse qui ressemble à l'actuelle */
    const W = (r) => (opp && r.opp === opp ? 4 : 1) * (0.25 + similarity(r, cur, enemies, D));
    res.adapted = !!(opp || cur);
    /* Runes : parmi les parties contre l'adversaire si possible, classées selon la composition adverse */
    const runeRows = useVs ? vs : rows;
    res.runes = count(runeRows.filter((r) => r.runes), (r) => r.runes + '#' + (r.shards || ''), W).slice(0, 3)
      .map((o) => ({ runes: o.key.split('#')[0], shards: o.key.split('#')[1], games: o.games, wins: o.wins }));
    res.runesVs = useVs;
    res.spells = count(useVs ? vs : rows, (r) => r.spells, W).slice(0, 2).map((o) => ({ spells: o.key, games: o.games, wins: o.wins }));

    /* Kit d'objets (nécessite la chronologie) */
    const tl = rows.filter((r) => r.seq);
    res.timelineGames = tl.length;
    if (tl.length) {
      const tlVs = opp ? tl.filter((r) => r.opp === opp) : [];
      const early = tlVs.length >= MIN_VS ? tlVs : tl;
      res.earlyVs = early === tlVs;
      res.earlyGames = early.length;
      res.start = count(early.filter((r) => r.start), (r) => r.start, W).slice(0, 2).map((o) => ({ items: ids(o.key), games: o.games, wins: o.wins }));
      res.boots = count(early, (r) => firstBoots(r, D), W).slice(0, 2).map((o) => ({ item: +o.key, games: o.games, wins: o.wins }));
      res.core = count(early, (r) => { const l = legendaries(r, D); return l.length >= 2 ? l[0] + '>' + l[1] : null; }, W).slice(0, 3)
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
  /* Équipe d'un joueur d'après son nom, quel que soit le format (Riot ID, nom de jeu, ancien nom d'invocateur) */
  const normName = (s) => String(s || '').toLowerCase().replace(/\s+/g, '');
  const resolvers = new WeakMap();
  function teamResolver(L) {
    if (L && resolvers.has(L)) return resolvers.get(L);
    const m = {};
    for (const p of (L && L.players) || []) for (const a of [p.name, p.gameName].concat(p.aliases || [])) { if (!a) continue; const k = normName(a); m[k] = p.team; m[k.split('#')[0]] = p.team; }
    const f = (n) => { if (!n) return ''; const k = normName(n); return m[k] || m[k.split('#')[0]] || (/_t100|^order$/.test(k) ? 'ORDER' : /_t200|^chaos$/.test(k) ? 'CHAOS' : ''); };
    if (L) resolvers.set(L, f);
    return f;
  }
  /* Équipe qui a réalisé un événement : le tueur, sinon un des joueurs qui ont aidé */
  function eventTeam(e, L) {
    const r = teamResolver(L);
    let t = r(e.killer);
    if (!t) for (const a of e.assisters || []) { t = r(a); if (t) break; }
    return t;
  }
  function objectives(L, myTeam) {
    const t = L ? L.time : 0;
    const me = myTeam || 'ORDER';
    const side = (team) => (!team ? null : team === me ? 'us' : 'them');
    const sideOf = (e) => side(eventTeam(e, L));
    const ownerSide = (name) => { const m = String(name || '').match(/_T([12])_/); if (!m) return null; return side(m[1] === '1' ? 'ORDER' : 'CHAOS'); };
    const S = { drake: { us: 0, them: 0, types: { us: [], them: [] } }, elder: { us: 0, them: 0 }, grubs: { us: 0, them: 0 }, herald: { us: 0, them: 0 }, baron: { us: 0, them: 0 }, turret: { us: 0, them: 0 }, inhib: { us: 0, them: 0 } };
    let lastDrake = null, lastElder = null, lastBaron = null, soulAt = null, heraldDone = false, grubsKilled = 0;
    for (const e of (L && L.events) || []) {
      if (e.name === 'DragonKill') {
        const sd = sideOf(e);
        if (/elder/i.test(e.dragon)) { lastElder = e.t; if (sd) S.elder[sd]++; }
        else { lastDrake = e.t; if (sd) { S.drake[sd]++; S.drake.types[sd].push(DRAKE_FR[e.dragon] || e.dragon); if (S.drake[sd] === 4 && soulAt == null) soulAt = e.t; } }
      } else if (e.name === 'BaronKill') { lastBaron = e.t; const sd = sideOf(e); if (sd) S.baron[sd]++; }
      else if (e.name === 'HeraldKill') { heraldDone = true; const sd = sideOf(e); if (sd) S.herald[sd]++; }
      else if (e.name === 'HordeKill') { grubsKilled++; const sd = sideOf(e); if (sd) S.grubs[sd]++; }
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

  /* ---------- En jeu : prochain objet à acheter d'après le kit conseillé ---------- */
  function nextItem(A, owned, D) {
    if (!A || !A.core || !A.core[0]) return null;
    const have = new Set((owned || []).map(Number));
    const plan = [].concat(A.core[0].items, A.boots && A.boots[0] ? [A.boots[0].item] : [], (A.situational || []).flatMap((x) => (x.items || []).map((o) => o.item)), (A.later || []).map((x) => x.item));
    const seen = new Set();
    for (const id of plan) {
      if (seen.has(id)) continue; seen.add(id);
      if (have.has(id)) continue;
      const it = D.items[String(id)];
      if (!it) continue;
      /* Bottes déjà améliorées ? on passe */
      if (isBoots(it) && [...have].some((h) => isBoots(D.items[String(h)]))) continue;
      return { item: id, name: it.name, cost: it.gold.total };
    }
    return null;
  }

  /* ---------- Fin de partie : analyse complète d'une partie match-v5 (+ chronologie) ---------- */
  const POS_ORDER = { TOP: 0, JUNGLE: 1, MIDDLE: 2, BOTTOM: 3, UTILITY: 4 };
  function postgame(match, timeline, puuid, ids) {
    const info = match.info || {};
    let dur = info.gameDuration || 0;
    if (!info.gameEndTimestamp && dur > 100000) dur = Math.round(dur / 1000);
    const min = Math.max(1, dur / 60);
    const ps = (info.participants || []).map((p) => Object.assign({}, p, {
      cs: (p.totalMinionsKilled || 0) + (p.neutralMinionsKilled || 0),
      items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5].filter(Boolean), trinket: p.item6 || 0,
      name: p.riotIdGameName || p.summonerName || '', tag: p.riotIdTagline || '',
    }));
    /* Moi : par identifiant de compte, sinon par Riot ID, sinon par champion joué (partie qui vient de finir) */
    const n = (s) => String(s || '').toLowerCase().replace(/\s+/g, '');
    let me = (puuid && ps.find((p) => p.puuid === puuid)) || null;
    for (const id of ids || []) {
      if (me) break;
      if (id.gameName) me = ps.find((p) => n(p.riotIdGameName || p.summonerName) === n(id.gameName) && (!id.tagLine || !p.riotIdTagline || n(p.riotIdTagline) === n(id.tagLine))) || null;
      else if (id.champ) { const c = ps.filter((p) => p.championId === id.champ); if (c.length === 1) me = c[0]; }
    }
    const myTeamId = me ? me.teamId : 100;
    const teamIds = [myTeamId, myTeamId === 100 ? 200 : 100];
    const teams = teamIds.map((id) => {
      const pl = ps.filter((p) => p.teamId === id).sort((a, b) => (POS_ORDER[a.teamPosition] ?? 9) - (POS_ORDER[b.teamPosition] ?? 9));
      const t = (info.teams || []).find((x) => x.teamId === id) || {};
      const sum = (k) => pl.reduce((s2, p) => s2 + (p[k] || 0), 0);
      return { id, win: !!t.win, players: pl, kills: sum('kills'), deaths: sum('deaths'), assists: sum('assists'), gold: sum('goldEarned'), damage: sum('totalDamageDealtToChampions'), vision: sum('visionScore'), objectives: t.objectives || {} };
    });
    for (const t of teams) for (const p of t.players) {
      p.kp = t.kills ? (p.kills + p.assists) / t.kills : 0;
      p.dmgShare = t.damage ? (p.totalDamageDealtToChampions || 0) / t.damage : 0;
      p.csm = p.cs / min; p.gpm = (p.goldEarned || 0) / min; p.dpm = (p.totalDamageDealtToChampions || 0) / min;
      p.kda = (p.kills + p.assists) / Math.max(1, p.deaths);
    }
    const opp = me ? ps.find((p) => p.teamId !== myTeamId && p.teamPosition && p.teamPosition === me.teamPosition) : null;
    /* Courbes : différence d'or entre équipes, minute par minute ; moi contre mon adversaire */
    const curve = []; const meVs = { gold: [], cs: [] };
    for (const f of ((timeline || {}).info || {}).frames || []) {
      const pf = f.participantFrames || {};
      let a = 0, b = 0;
      for (const p of ps) { const x = pf[p.participantId]; if (!x) continue; if (p.teamId === myTeamId) a += x.totalGold || 0; else b += x.totalGold || 0; }
      curve.push(a - b);
      if (me && opp && pf[me.participantId] && pf[opp.participantId]) {
        const m = pf[me.participantId], o = pf[opp.participantId];
        meVs.gold.push((m.totalGold || 0) - (o.totalGold || 0));
        meVs.cs.push(((m.minionsKilled || 0) + (m.jungleMinionsKilled || 0)) - ((o.minionsKilled || 0) + (o.jungleMinionsKilled || 0)));
      }
    }
    const at = (arr, m) => (arr.length > m ? arr[m] : null);
    /* Séries détaillées issues de la chronologie (minute par minute + événements) */
    const sideOfTeam = (tid) => (tid === myTeamId ? 'us' : 'them');
    const byPid = {}; ps.forEach((p) => { byPid[p.participantId] = p; });
    const frames = ((timeline || {}).info || {}).frames || [];
    const T = { xp: [], kills: { us: [], them: [] }, gold: { us: [], them: [] }, me: { gold: [], cs: [], xp: [], lvl: [], dmg: [] }, opp: { gold: [], cs: [], xp: [], lvl: [], dmg: [] },
      killEv: [], objEv: [], buildEv: [], myEv: [], plates: { us: 0, them: 0 }, wards: { us: 0, them: 0 }, firsts: {} };
    let kUs = 0, kThem = 0;
    const csOf = (x) => (x.minionsKilled || 0) + (x.jungleMinionsKilled || 0);
    const firstOf = (k, side, t) => { if (!T.firsts[k]) T.firsts[k] = { side, t }; };
    for (const f of frames) {
      const pf = f.participantFrames || {};
      for (const e of f.events || []) {
        const t = (e.timestamp || 0) / 1000;
        if (e.type === 'CHAMPION_KILL') {
          const k = byPid[e.killerId], v = byPid[e.victimId];
          const side = k ? sideOfTeam(k.teamId) : v ? (sideOfTeam(v.teamId) === 'us' ? 'them' : 'us') : '';
          if (side === 'us') kUs++; else if (side === 'them') kThem++;
          if (side) firstOf('blood', side, t);
          const ev = { t, side, x: e.position ? e.position.x : null, y: e.position ? e.position.y : null, killer: e.killerId, victim: e.victimId, assists: e.assistingParticipantIds || [] };
          T.killEv.push(ev);
          if (me) {
            const id = me.participantId;
            if (e.killerId === id) T.myEv.push({ t, kind: 'kill', x: ev.x, y: ev.y });
            else if (e.victimId === id) T.myEv.push({ t, kind: 'death', x: ev.x, y: ev.y });
            else if ((e.assistingParticipantIds || []).includes(id)) T.myEv.push({ t, kind: 'assist', x: ev.x, y: ev.y });
          }
        } else if (e.type === 'ELITE_MONSTER_KILL') {
          const side = e.killerTeamId ? sideOfTeam(e.killerTeamId) : byPid[e.killerId] ? sideOfTeam(byPid[e.killerId].teamId) : '';
          const kind = { DRAGON: /ELDER/.test(e.monsterSubType || '') ? 'elder' : 'drake', BARON_NASHOR: 'baron', RIFTHERALD: 'herald', HORDE: 'grubs', ATAKHAN: 'atakhan' }[e.monsterType] || 'other';
          T.objEv.push({ t, side, kind, sub: e.monsterSubType || '' });
          if (side) firstOf(kind, side, t);
        } else if (e.type === 'BUILDING_KILL') {
          const side = e.teamId ? (sideOfTeam(e.teamId) === 'us' ? 'them' : 'us') : '';
          const kind = e.buildingType === 'INHIBITOR_BUILDING' ? 'inhib' : 'tower';
          T.buildEv.push({ t, side, kind, lane: e.laneType || '' });
          if (side) firstOf(kind, side, t);
        } else if (e.type === 'TURRET_PLATE_DESTROYED') {
          if (e.teamId) T.plates[sideOfTeam(e.teamId) === 'us' ? 'them' : 'us']++;
        } else if (e.type === 'WARD_PLACED') {
          const c = byPid[e.creatorId]; if (c) T.wards[sideOfTeam(c.teamId)]++;
        }
      }
      let xa = 0, xb = 0, ga = 0, gb = 0;
      for (const p of ps) { const x = pf[p.participantId]; if (!x) continue; if (p.teamId === myTeamId) { xa += x.xp || 0; ga += x.totalGold || 0; } else { xb += x.xp || 0; gb += x.totalGold || 0; } }
      T.xp.push(xa - xb); T.gold.us.push(ga); T.gold.them.push(gb);
      T.kills.us.push(kUs); T.kills.them.push(kThem);
      for (const [who, p] of [['me', me], ['opp', opp]]) {
        const x = p && pf[p.participantId]; if (!x) continue;
        T[who].gold.push(x.totalGold || 0); T[who].cs.push(csOf(x)); T[who].xp.push(x.xp || 0); T[who].lvl.push(x.level || 0);
        T[who].dmg.push(((x.damageStats || {}).totalDamageDoneToChampions) || 0);
      }
    }
    const goldDiff = curve;
    const lead = goldDiff.length ? { max: Math.max(0, ...goldDiff), min: Math.min(0, ...goldDiff), maxAt: goldDiff.indexOf(Math.max(0, ...goldDiff)), minAt: goldDiff.indexOf(Math.min(0, ...goldDiff)) } : null;
    /* Conseils simples pour progresser */
    const tips = [];
    if (me) {
      const role = me.teamPosition;
      if (role !== 'UTILITY' && me.csm < 6) tips.push(`Farm : ${me.csm.toFixed(1).replace('.', ',')} sbires/min. Vise 6 à 7 : entraîne le dernier coup dans l'Outil d'entraînement.`);
      if (me.deaths >= 7) tips.push(`${me.deaths} morts : avant d'avancer, regarde la mini-carte et où sont les ennemis. Recule quand tu ne les vois pas.`);
      if (me.kp < 0.4 && teams[0].kills >= 10) tips.push(`Participation aux kills : ${Math.round(me.kp * 100)} %. Rejoins ton équipe pour les combats et les objectifs.`);
      if ((me.visionWardsBoughtInGame || 0) === 0 && dur > 900) tips.push('Aucune balise de contrôle achetée : prends-en une à chaque retour à la base (75 po).');
      if (me.visionScore / min < (role === 'UTILITY' ? 1.5 : 0.6)) tips.push(`Score de vision faible (${me.visionScore}) : utilise ton trinket dès qu'il est rechargé.`);
      if (at(meVs.cs, 10) != null && at(meVs.cs, 10) <= -15) tips.push(`À 10 min, tu avais ${(-at(meVs.cs, 10) / 10).toFixed(1).replace('.', ',')} CS/min de moins que ton adversaire.`);
      if (!tips.length) tips.push('Belle partie, rien de flagrant à corriger. Continue comme ça !');
    }
    for (const t of teams) { const g = t.gold || 1; for (const p of t.players) p.goldShare = (p.goldEarned || 0) / g; }
    return { matchId: (match.metadata || {}).matchId, queue: info.queueId, dur, created: info.gameCreation, me, opp, teams, curve, meVs, T, lead, min,
      at10: { gold: at(meVs.gold, 10), cs: at(meVs.cs, 10) }, at15: { gold: at(meVs.gold, 15), cs: at(meVs.cs, 15) }, tips,
      best: { damage: ps.slice().sort((a, b) => (b.totalDamageDealtToChampions || 0) - (a.totalDamageDealtToChampions || 0))[0], vision: ps.slice().sort((a, b) => b.visionScore - a.visionScore)[0], kda: ps.slice().sort((a, b) => b.kda - a.kda)[0] } };
  }

  return { analyze, teamProfile, skillOrder, isLegendary, isBoots, MIN_VS, assignRoles, roleProbs, objectives, teamResolver, eventTeam, ROLES5, nextItem, postgame };
})();
if (typeof module !== 'undefined') module.exports = Builds;
