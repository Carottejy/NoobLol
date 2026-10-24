/* Simulateur de partie : joue le rôle du client League of Legends et du jeu pour tester Noob LOL.
   1. Salon (ton compte, ton rôle, la file)  2. Sélection des champions  3. Écran de chargement
   4. Partie (temps accéléré, événements automatiques ou déclenchés à la main)  5. Fin de partie.
   L'état est envoyé au processus principal, qui le sert à Noob LOL au format exact des API de Riot. */
(() => {
  'use strict';
  const NB = window.noob;
  const D = Dd.st;
  const app = document.getElementById('app'), top = document.getElementById('top');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rnd = (n) => Math.floor(Math.random() * n);
  const pickOne = (a) => a[rnd(a.length)];
  const fmt = (s) => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const nf = (n) => Number(n || 0).toLocaleString('fr-FR');

  const ROLES = ['top', 'jungle', 'middle', 'bottom', 'utility'];
  const ROLE_FR = { top: '🛡️ Top', jungle: '🌲 Jungle', middle: '✨ Mid', bottom: '🏹 ADC', utility: '💖 Support' };
  const LIVEPOS = { top: 'TOP', jungle: 'JUNGLE', middle: 'MIDDLE', bottom: 'BOTTOM', utility: 'UTILITY' };
  const TIERS = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'];
  const TIER_FR = { IRON: 'Fer', BRONZE: 'Bronze', SILVER: 'Argent', GOLD: 'Or', PLATINUM: 'Platine', EMERALD: 'Émeraude', DIAMOND: 'Diamant', MASTER: 'Maître', GRANDMASTER: 'Grand maître', CHALLENGER: 'Challenger' };
  const QUEUES = { 420: 'Classée solo/duo', 440: 'Classée flexible', 400: 'Normale (draft)', 430: 'Normale (aveugle)' };
  const NAMES = ['Brindille', 'Moustik', 'Kaelith', 'Pastèque', 'Zorglub', 'NuitBlanche', 'Tartiflette', 'Grizou', 'Lumen', 'Patate', 'Cactus', 'Orion', 'Mirabelle', 'Tonnerre', 'Pixel', 'Saphir', 'Biscotte', 'Volcan'];
  const DRAKES = ['Fire', 'Water', 'Earth', 'Air', 'Hextech', 'Chemtech'];
  const POOL_TAGS = { top: ['Fighter', 'Tank'], jungle: ['Fighter', 'Assassin', 'Tank'], middle: ['Mage', 'Assassin'], bottom: ['Marksman'], utility: ['Support'] };
  const DEF_SPELLS = { top: [4, 12], jungle: [4, 11], middle: [4, 14], bottom: [4, 7], utility: [4, 3] };

  /* ---------------- État ---------------- */
  const SIM = {
    layout: null, step: 'lobby', queue: 420, positions: true, nameMode: 'legacy', auto: true, autoBuy: true, speed: 10,
    me: { gameName: 'Carotte', tagLine: 'EUW', level: 87, tier: 'SILVER', division: 'II', role: 'middle' },
    players: [], bans: [], timerEnd: 0, gameId: 0,
    applied: { runes: null, spells: null }, load: null, game: null, log: [],
  };
  const meP = () => SIM.players.find((p) => p.isMe);
  const champ = (key) => (key && D.byKey ? D.byKey[String(key)] : null);
  const champName = (key) => (champ(key) || {}).name || '—';
  const icon = (key, cls = 'ic') => { const c = champ(key); return c ? `<img class="${cls}" alt="" src="${Dd.img.champ(c)}">` : `<span class="${cls} ph"></span>`; };
  const itemIcon = (id) => { const it = D.items && D.items[String(id)]; return it ? `<img class="it" alt="" title="${esc(it.name)}" src="${Dd.img.item(it)}">` : ''; };
  const spellIcon = (key) => { const s = D.summByKey && D.summByKey[String(key)]; return s ? `<img class="sp" alt="" title="${esc(s.name)}" src="${Dd.img.spell(s)}">` : '<span class="sp ph"></span>'; };
  const ranked = () => SIM.queue === 420 || SIM.queue === 440;

  function newLobby() {
    const names = NAMES.slice().sort(() => Math.random() - 0.5);
    SIM.players = [];
    SIM.gameId = 7000000000 + rnd(99999999);
    for (let i = 0; i < 10; i++) {
      const team = i < 5 ? 'ORDER' : 'CHAOS', role = ROLES[i % 5];
      const isMe = team === 'ORDER' && role === SIM.me.role;
      const nm = isMe ? SIM.me.gameName : names[i];
      const ti = Math.max(0, Math.min(TIERS.length - 1, TIERS.indexOf(SIM.me.tier) + rnd(3) - 1));
      SIM.players.push({ cell: i, team, role, isMe, champ: 0, hover: 0, locked: false, spells: DEF_SPELLS[role].slice(),
        gameName: nm, tagLine: isMe ? SIM.me.tagLine : pickOne(['EUW', 'FR1', '1234', 'LOL']), legacy: isMe ? 'Ancien' + nm : 'Old' + nm + rnd(99),
        puuid: isMe ? 'sim-moi-0000' : `sim-joueur-${i}-${rnd(1e6)}`, level: isMe ? SIM.me.level : 30 + rnd(400),
        tier: isMe ? SIM.me.tier : TIERS[ti], division: isMe ? SIM.me.division : pickOne(['I', 'II', 'III', 'IV']), lp: rnd(100), wins: 20 + rnd(80), losses: 20 + rnd(80),
        /* Historique des 20 dernières parties (forme du moment : plus ou moins bonne selon le joueur) */
        history: (() => { const form = 0.3 + Math.random() * 0.45, skill = 0.6 + Math.random() * 1.2; return Array.from({ length: 20 }, () => { const win = Math.random() < form; return { win, k: rnd(Math.round(8 * skill)) + (win ? 2 : 0), d: 1 + rnd(8), a: rnd(12) + (win ? 3 : 0), dur: 1300 + rnd(1000), champ: 0 }; }); })() });
    }
    SIM.bans = []; SIM.applied = { runes: null, spells: null }; SIM.load = null; SIM.game = null; SIM.log = [];
  }
  const pickOrder = () => [0, 5, 6, 1, 2, 7, 8, 3, 4, 9].map((c) => SIM.players[c]);
  function poolFor(role) {
    const taken = new Set(SIM.players.map((p) => p.champ || p.hover).concat(SIM.bans).filter(Boolean).map(Number));
    const tags = POOL_TAGS[role];
    const list = D.champList.filter((c) => !taken.has(+c.key) && c.tags.some((t) => tags.includes(t)));
    if (list.length) return list;
    const any = D.champList.filter((c) => !taken.has(+c.key));
    if (any.length) return any;
    /* Plus rien de libre (ex. peu de champions) : on ignore les bannissements */
    const used = new Set(SIM.players.map((p) => p.champ || p.hover).filter(Boolean).map(Number));
    return D.champList.filter((c) => !used.has(+c.key));
  }
  function autoPick(p) { const c = pickOne(poolFor(p.role)); if (c) { p.champ = +c.key; p.hover = 0; p.locked = true; } }
  function nextPicker() { return pickOrder().find((p) => !p.locked); }

  /* ---------------- Formats des API de Riot ---------------- */
  const ZERO = '00000000-0000-0000-0000-000000000000';
  function session() {
    const me = meP();
    const cell = (p, enemy) => {
      const hide = enemy && ranked();
      return { cellId: p.cell, championId: p.locked ? p.champ : 0, championPickIntent: !p.locked && !enemy ? p.hover : 0,
        assignedPosition: SIM.positions && !enemy ? p.role : '', spell1Id: p.spells[0], spell2Id: p.spells[1],
        puuid: hide ? ZERO : p.puuid, gameName: hide ? '' : p.gameName, tagLine: hide ? '' : p.tagLine, team: enemy ? 2 : 1 };
    };
    const left = Math.max(0, SIM.timerEnd - Date.now());
    return {
      localPlayerCellId: me.cell, isCustomGame: false, benchEnabled: false,
      myTeam: SIM.players.filter((p) => p.team === 'ORDER').map((p) => cell(p, false)),
      theirTeam: SIM.players.filter((p) => p.team === 'CHAOS').map((p) => cell(p, true)),
      bans: { myTeamBans: SIM.bans.slice(0, 5), theirTeamBans: SIM.bans.slice(5) },
      actions: [SIM.bans.map((b, i) => ({ actorCellId: i, type: 'ban', championId: b, completed: true })), [{ actorCellId: me.cell, type: 'pick', championId: me.locked ? me.champ : me.hover, completed: me.locked, isInProgress: !me.locked }]],
      timer: { phase: SIM.players.every((p) => p.locked) ? 'FINALIZATION' : 'BAN_PICK', adjustedTimeLeftInPhase: left },
    };
  }
  function gameflow() {
    const m = (p) => ({ puuid: p.puuid, championId: p.champ, gameName: p.gameName, tagLine: p.tagLine, summonerName: p.legacy, internalName: p.legacy, selectedPosition: SIM.positions ? p.role.toUpperCase() : '', spell1Id: p.spells[0], spell2Id: p.spells[1] });
    return { gameData: { gameId: SIM.gameId, queue: { id: SIM.queue }, teamOne: SIM.players.filter((p) => p.team === 'ORDER').map(m), teamTwo: SIM.players.filter((p) => p.team === 'CHAOS').map(m) } };
  }
  /* Nom d'un joueur dans les événements du jeu, selon le format choisi */
  const evName = (p) => (SIM.nameMode === 'legacy' ? p.legacy : SIM.nameMode === 'riotid' ? `${p.gameName}#${p.tagLine}` : p.gameName);
  const spellObj = (key) => { const s = D.summByKey[String(key)]; return s ? { displayName: s.name, rawDisplayName: `GeneratedTip_SummonerSpell_${s.id}_DisplayName` } : {}; };
  function liveData() {
    const G = SIM.game;
    const players = SIM.players.map((p) => {
      const st = G.st[p.cell], c = champ(p.champ) || { id: 'Unknown', name: '?' };
      return { riotId: `${p.gameName}#${p.tagLine}`, riotIdGameName: p.gameName, riotIdTagLine: p.tagLine, summonerName: `${p.gameName}#${p.tagLine}`,
        championName: c.name, rawChampionName: `game_character_displayname_${c.id}`, team: p.team, position: SIM.positions ? LIVEPOS[p.role] : '',
        level: st.level, isDead: st.deadUntil > G.t, respawnTimer: Math.max(0, st.deadUntil - G.t), isBot: false,
        items: st.items.map((id, slot) => ({ itemID: id, slot, count: 1 })).concat([{ itemID: st.trinket, slot: 6, count: 1 }]),
        scores: { kills: st.k, deaths: st.d, assists: st.a, creepScore: Math.round(st.cs), wardScore: Math.round(st.ward) },
        summonerSpells: { summonerSpellOne: spellObj(p.spells[0]), summonerSpellTwo: spellObj(p.spells[1]) } };
    });
    const me = meP(), ms = G.st[me.cell], c = champ(me.champ) || { stats: {}, partype: 'Mana' };
    const S = c.stats || {};
    const maxHp = Math.round((S.hp || 600) + (S.hpperlevel || 100) * (ms.level - 1) + ms.items.length * 150);
    const maxRes = Math.round((S.mp || 400) + (S.mpperlevel || 30) * (ms.level - 1));
    const resType = /mana/i.test(c.partype || '') ? 'MANA' : /energ/i.test(c.partype || '') ? 'ENERGY' : 'NONE';
    return {
      activePlayer: { riotId: `${me.gameName}#${me.tagLine}`, riotIdGameName: me.gameName, summonerName: `${me.gameName}#${me.tagLine}`, level: ms.level, currentGold: Math.max(0, ms.gold - ms.spent),
        championStats: { attackDamage: (S.attackdamage || 60) + 3 * ms.level, abilityPower: ms.items.length * 70, armor: (S.armor || 30) + 4 * ms.level, magicResist: (S.spellblock || 30) + 1.5 * ms.level, moveSpeed: S.movespeed || 340,
          currentHealth: ms.deadUntil > G.t ? 0 : Math.round(maxHp * G.hp), maxHealth: maxHp, resourceValue: Math.round(maxRes * G.mana), resourceMax: resType === 'NONE' ? 0 : maxRes, resourceType: resType } },
      allPlayers: players, events: { Events: G.events }, gameData: { gameMode: 'CLASSIC', gameTime: G.t, mapName: 'Map11', mapNumber: 11, mapTerrain: 'Default' },
    };
  }
  function push() {
    if (!NB || !NB.sim) return;
    /* Comme le vrai client : « GameStart » pendant le lancement du jeu (2 s), puis « InProgress » dès que le jeu tourne */
    const launching = SIM.step === 'loading' && SIM.load && Date.now() - SIM.load.t0 < 2000;
    const phase = { lobby: 'Lobby', select: 'ChampSelect', loading: launching ? 'GameStart' : 'InProgress', game: 'InProgress', end: 'EndOfGame' }[SIM.step] || 'None';
    /* Pendant l'écran de chargement (après le lancement), le jeu répond déjà : chrono à 0, aucun événement */
    const loadingLive = SIM.step === 'loading' && SIM.load && Date.now() - SIM.load.t0 >= 4000 && SIM.game;
    const players = {}; SIM.players.forEach((p) => { players[p.puuid] = p; });
    const me = meP() || {};
    NB.sim.push({
      phase, players,
      summoner: { gameName: SIM.me.gameName, tagLine: SIM.me.tagLine, displayName: SIM.me.gameName, puuid: me.puuid || 'sim-moi-0000', summonerLevel: SIM.me.level, profileIconId: 29 },
      session: SIM.step === 'select' ? session() : null,
      gameflow: /loading|game|end/.test(SIM.step) ? gameflow() : null,
      live: (SIM.step === 'game' || loadingLive) && SIM.game ? liveData() : null,
    }).catch(() => {});
  }

  /* ---------------- Partie : progression des joueurs ---------------- */
  const isLeg = (it) => !!it && !(it.into && it.into.length) && it.gold && it.gold.total >= 2000 && it.gold.purchasable !== false && !(it.tags || []).includes('Consumable') && !(it.tags || []).includes('Boots') && it.maps && it.maps['11'] && !it.requiredAlly && !it.requiredChampion;
  function buildFor(p) {
    const c = champ(p.champ) || { tags: [], info: { attack: 5, magic: 5 } };
    const ap = c.info.magic > c.info.attack, tank = c.tags.includes('Tank');
    const has = (id) => D.items[String(id)];
    const leg = D.itemList.filter(isLeg);
    const want = p.role === 'utility' ? ['AbilityHaste', 'Health'] : tank ? ['Health', 'Armor'] : ap ? ['SpellDamage'] : ['Damage'];
    const pool = leg.filter((it) => want.every((t) => (it.tags || []).includes(t) || (t === 'AbilityHaste' && (it.tags || []).includes('CooldownReduction'))));
    const core = pool.sort(() => Math.random() - 0.5).slice(0, 5).map((it) => +it.id);
    const starter = [p.role === 'utility' ? 3865 : p.role === 'jungle' ? 1103 : ap ? 1056 : tank ? 1054 : 1055].filter(has);
    const boots = [p.role === 'utility' ? 3158 : ap ? 3020 : tank ? 3047 : 3006].filter(has);
    return { starter, plan: boots.concat(core) };
  }
  /* Prépare la partie dès le chargement (le jeu répond déjà, chrono à 0, sans événement « GameStart ») */
  function initGame() {
    const st = {};
    SIM.players.forEach((p) => {
      const b = buildFor(p);
      st[p.cell] = { level: 1, cs: 0, k: 0, d: 0, a: 0, gold: 500, spent: 0, items: b.starter.slice(), plan: b.plan, trinket: 3340, deadUntil: 0, ward: 0, lvlOff: Math.random() * 0.6 - 0.3 };
      st[p.cell].spent = b.starter.reduce((s, id) => s + ((D.items[String(id)] || { gold: { total: 0 } }).gold.total), 0);
    });
    SIM.game = { t: 0, running: false, st, events: [], evId: 0, hp: 1, mana: 1, drakeAt: 300, drakes: { ORDER: 0, CHAOS: 0 }, elderAt: 0, grubs: 3, herald: false, baronAt: 1200, first: false, turrets: { ORDER: 0, CHAOS: 0 }, inhibs: { ORDER: 0, CHAOS: 0 } };
  }
  function startGame() {
    if (!SIM.game) initGame();
    SIM.game.running = true;
    SIM.game.events.push({ EventID: SIM.game.evId++, EventName: 'GameStart', EventTime: 0 });
    SIM.step = 'game';
    logLine('🎮 La partie commence.');
  }
  const RATE = { top: 0.115, jungle: 0.1, middle: 0.12, bottom: 0.13, utility: 0.015 };
  const levelAt = (t, off) => Math.max(1, Math.min(18, Math.floor(1 + 9 * Math.pow(Math.max(0, t) / 600, 0.75) + off)));
  const respawnFor = (lvl, t) => Math.round(6 + lvl * 2.2 + (t > 1800 ? 8 : t > 1200 ? 4 : 0));
  const byTeam = (team) => SIM.players.filter((p) => p.team === team);
  const alive = (team) => byTeam(team).filter((p) => SIM.game.st[p.cell].deadUntil <= SIM.game.t);
  const other = (team) => (team === 'ORDER' ? 'CHAOS' : 'ORDER');
  const jungler = (team) => byTeam(team).find((p) => p.role === 'jungle') || byTeam(team)[0];
  function ev(name, extra) { const G = SIM.game; G.events.push(Object.assign({ EventID: G.evId++, EventName: name, EventTime: Math.round(G.t * 100) / 100 }, extra)); }
  function logLine(txt) { SIM.log.unshift({ t: SIM.game ? SIM.game.t : 0, txt }); SIM.log = SIM.log.slice(0, 60); }
  const pName = (p) => `${champName(p.champ)} (${p.team === 'ORDER' ? 'nous' : 'eux'})`;

  function kill(team, opts = {}) {
    const G = SIM.game;
    const killers = opts.killer ? [opts.killer] : alive(team);
    const victims = opts.victim ? [opts.victim] : alive(other(team));
    if (!killers.length || !victims.length) return;
    const k = opts.killer || pickOne(killers), v = opts.victim || pickOne(victims);
    const ass = alive(team).filter((p) => p !== k).sort(() => Math.random() - 0.5).slice(0, rnd(3));
    const S = G.st;
    S[k.cell].k++; S[v.cell].d++; ass.forEach((p) => { S[p.cell].a++; });
    S[v.cell].deadUntil = G.t + respawnFor(S[v.cell].level, G.t);
    ev('ChampionKill', { KillerName: evName(k), VictimName: evName(v), Assisters: ass.map(evName) });
    if (!G.first) { G.first = true; ev('FirstBlood', { Recipient: evName(k) }); }
    logLine(`⚔️ ${pName(k)} tue ${pName(v)}${ass.length ? ` (+${ass.length})` : ''}`);
    if (!alive(other(team)).length) { ev('Ace', { Acer: evName(k), AcingTeam: team }); logLine(`💀 Équipe ${team === 'ORDER' ? 'adverse' : 'alliée'} entièrement éliminée`); }
  }
  function objective(kind, team) {
    const G = SIM.game, j = alive(team).find((p) => p.role === 'jungle') || alive(team)[0] || jungler(team);
    const ass = alive(team).filter((p) => p !== j).slice(0, 2).map(evName);
    const who = team === 'ORDER' ? 'nous' : 'eux';
    if (kind === 'drake') {
      const soul = G.drakes.ORDER >= 4 || G.drakes.CHAOS >= 4;
      const type = soul ? 'Elder' : pickOne(DRAKES);
      ev('DragonKill', { DragonType: type, Stolen: 'False', KillerName: evName(j), Assisters: ass });
      if (!soul) { G.drakes[team]++; G.drakeAt = G.t + 300; if (G.drakes[team] >= 4) G.elderAt = G.t + 360; } else G.elderAt = G.t + 360;
      logLine(`🐉 Dragon ${type} pris par ${who}`);
    } else if (kind === 'grubs') { if (G.grubs <= 0) return; G.grubs--; ev('HordeKill', { KillerName: evName(j), Assisters: ass }); logLine(`🪲 Larve du Néant pour ${who}`); }
    else if (kind === 'herald') { G.herald = true; ev('HeraldKill', { KillerName: evName(j), Assisters: ass, Stolen: 'False' }); logLine(`🦀 Héraut pour ${who}`); }
    else if (kind === 'baron') { G.baronAt = G.t + 360; ev('BaronKill', { KillerName: evName(j), Assisters: ass, Stolen: 'False' }); logLine(`👾 Nashor pour ${who}`); }
    else if (kind === 'turret') {
      const victim = other(team), n = G.turrets[victim]++;
      const lane = pickOne(['L', 'C', 'R']);
      ev('TurretKilled', { TurretKilled: `Turret_T${victim === 'ORDER' ? 1 : 2}_${lane}_0${3 - Math.min(2, Math.floor(n / 3))}_A`, KillerName: evName(pickOne(alive(team).length ? alive(team) : byTeam(team))), Assisters: [] });
      logLine(`🏰 Tour ${team === 'ORDER' ? 'adverse détruite' : 'alliée perdue'}`);
    } else if (kind === 'inhib') {
      const victim = other(team); G.inhibs[victim]++;
      ev('InhibKilled', { InhibKilled: `Barracks_T${victim === 'ORDER' ? 1 : 2}_${pickOne(['L1', 'C1', 'R1'])}`, KillerName: evName(pickOne(byTeam(team))), Assisters: [] });
      logLine(`💎 Inhibiteur ${team === 'ORDER' ? 'adverse détruit' : 'allié perdu'}`);
    }
  }
  function buyNext(p) {
    const s = SIM.game.st[p.cell];
    const id = s.plan[0]; if (!id) return false;
    const it = D.items[String(id)]; if (!it) { s.plan.shift(); return false; }
    if (s.gold - s.spent < it.gold.total) return false;
    s.plan.shift(); s.spent += it.gold.total;
    const legs = s.items.filter((x) => isLeg(D.items[String(x)])).length;
    if (s.items.length >= 6 || (legs >= 2 && s.items.some((x) => [1054, 1055, 1056, 1103].includes(x)))) s.items = s.items.filter((x) => ![1054, 1055, 1056, 1103].includes(x));
    if (s.items.length < 6) s.items.push(id);
    if (p.isMe || isLeg(it)) logLine(`🛒 ${pName(p)} achète ${it.name}`);
    return true;
  }
  function tick() {
    const G = SIM.game;
    if (!G || !G.running || SIM.step !== 'game') return;
    const dt = SIM.speed;
    for (let i = 0; i < dt; i++) step1();
    refreshGame(); push();
  }
  function step1() {
    const G = SIM.game; G.t += 1;
    for (const p of SIM.players) {
      const s = G.st[p.cell], dead = s.deadUntil > G.t;
      if (!dead && G.t > 90) s.cs += RATE[p.role] * (0.75 + Math.random() * 0.5);
      s.level = Math.max(s.level, levelAt(G.t, s.lvlOff - (p.role === 'utility' ? 1 : 0)));
      s.gold = 500 + Math.max(0, G.t - 65) * 2.04 + s.cs * 21 + s.k * 300 + s.a * 150 + (s.bonus || 0);
      s.ward += p.role === 'utility' ? 0.03 : 0.01;
      /* Achats lors des retours à la base (environ toutes les 4 minutes) */
      if ((!p.isMe || SIM.autoBuy) && G.t % 240 === (p.cell * 23) % 240) while (buyNext(p)) { /* achète tout ce qui est possible */ }
    }
    /* Ma vie et mon mana remontent doucement */
    G.hp = Math.min(1, G.hp + 0.0015); G.mana = Math.min(1, G.mana + 0.0015);
    if (!SIM.auto) return;
    const r = Math.random;
    if (G.t > 120 && r() < 0.014) kill(r() < 0.5 ? 'ORDER' : 'CHAOS');
    if (G.t >= G.drakeAt && r() < 0.008) objective('drake', r() < 0.5 ? 'ORDER' : 'CHAOS');
    if (G.elderAt && G.t >= G.elderAt && r() < 0.01) objective('drake', r() < 0.5 ? 'ORDER' : 'CHAOS');
    if (G.t >= 480 && G.t < 885 && G.grubs > 0 && r() < 0.01) { const tm = r() < 0.5 ? 'ORDER' : 'CHAOS'; while (G.grubs > 0) objective('grubs', tm); }
    if (G.t >= 900 && G.t < 1185 && !G.herald && r() < 0.006) objective('herald', r() < 0.5 ? 'ORDER' : 'CHAOS');
    if (G.t >= G.baronAt && r() < 0.004) objective('baron', r() < 0.5 ? 'ORDER' : 'CHAOS');
    if (G.t > 600 && r() < 0.005) objective('turret', r() < 0.5 ? 'ORDER' : 'CHAOS');
    if (G.t > 1500 && r() < 0.0015) objective('inhib', r() < 0.5 ? 'ORDER' : 'CHAOS');
  }

  /* ---------------- Affichage ---------------- */
  const STEPS = [['lobby', '1. Salon'], ['select', '2. Sélection'], ['loading', '3. Chargement'], ['game', '4. Partie'], ['end', '5. Fin']];
  let status = '';
  function renderTop() {
    top.innerHTML = `<b class="brand">🧪 Simulateur Noob LOL</b><nav>${STEPS.map(([k, l]) => `<span class="st ${SIM.step === k ? 'on' : ''}">${l}</span>`).join('<i>›</i>')}</nav><span class="status">${status}</span>`;
  }
  function viewLobby() {
    const m = SIM.me;
    return `<div class="card"><h2>Ton compte et la file</h2>
      <div class="grid">
        <label>Nom de jeu<input data-me="gameName" value="${esc(m.gameName)}"></label>
        <label>Tag<input data-me="tagLine" value="${esc(m.tagLine)}"></label>
        <label>Niveau<input data-me="level" type="number" value="${m.level}"></label>
        <label>Rang<select data-me="tier">${TIERS.map((t) => `<option value="${t}" ${t === m.tier ? 'selected' : ''}>${TIER_FR[t]}</option>`).join('')}</select></label>
        <label>Division<select data-me="division">${['I', 'II', 'III', 'IV'].map((d) => `<option ${d === m.division ? 'selected' : ''}>${d}</option>`).join('')}</select></label>
        <label>Mon rôle<select data-me="role">${ROLES.map((r) => `<option value="${r}" ${r === m.role ? 'selected' : ''}>${ROLE_FR[r]}</option>`).join('')}</select></label>
        <label>File<select data-sim="queue">${Object.entries(QUEUES).map(([q, l]) => `<option value="${q}" ${+q === SIM.queue ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        <label>Rôles fournis par le jeu<select data-sim="positions"><option value="1" ${SIM.positions ? 'selected' : ''}>Oui (classée, draft)</option><option value="0" ${!SIM.positions ? 'selected' : ''}>Non (aveugle) : Noob LOL doit deviner</option></select></label>
        <label>Noms dans les événements du jeu<select data-sim="nameMode"><option value="legacy" ${SIM.nameMode === 'legacy' ? 'selected' : ''}>Ancien nom d'invocateur (cas le plus difficile)</option><option value="game" ${SIM.nameMode === 'game' ? 'selected' : ''}>Nom de jeu</option><option value="riotid" ${SIM.nameMode === 'riotid' ? 'selected' : ''}>Riot ID complet</option></select></label>
      </div>
      <p class="muted">Tant que cette fenêtre est ouverte, Noob LOL se connecte au simulateur au lieu du vrai client League of Legends. Ferme-la pour revenir à la normale.</p>
      <div class="row"><button class="btn" data-act="toSelect">▶ Démarrer la sélection des champions</button></div></div>`;
  }
  function slotRow(p) {
    const enemy = p.team === 'CHAOS';
    const opts = (sel) => `<option value="0">— Choisir —</option>${D.champList.map((c) => `<option value="${c.key}" ${+c.key === sel ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}`;
    const cur = p.locked ? p.champ : p.hover;
    return `<div class="slot ${p.isMe ? 'me' : ''} ${p.locked ? 'locked' : ''} ${enemy ? 'enemy' : ''}">
      ${icon(cur)}<div class="grow"><b>${p.isMe ? '⭐ Toi · ' : ''}${ROLE_FR[p.role]}</b><span class="muted">${esc(p.gameName)} · ${TIER_FR[p.tier]} ${p.division}</span>
      <div class="row nw"><select data-pick="${p.cell}" ${p.locked ? 'disabled' : ''}>${opts(cur)}</select>${p.locked ? '<span class="tag">verrouillé</span>' : `<button class="btn sm" data-act="lock" data-val="${p.cell}" ${cur ? '' : 'disabled'}>Verrouiller</button>`}</div></div>
      <div class="sps">${spellIcon(p.spells[0])}${spellIcon(p.spells[1])}</div></div>`;
  }
  function viewSelect() {
    const left = Math.max(0, Math.round((SIM.timerEnd - Date.now()) / 1000));
    const all = SIM.players.every((p) => p.locked);
    const runes = SIM.applied.runes;
    const perkName = (id) => (D.runeById[id] || {}).name || id;
    return `<div class="cols">
      <div class="card"><h2>🟦 Mon équipe</h2>${SIM.players.filter((p) => p.team === 'ORDER').map(slotRow).join('')}</div>
      <div class="card"><h2>🟥 Adversaires ${ranked() ? '<span class="muted">(noms masqués côté Noob LOL en classée)</span>' : ''}</h2>${SIM.players.filter((p) => p.team === 'CHAOS').map(slotRow).join('')}</div>
      </div>
      <div class="card"><div class="row sp"><h2>Contrôles</h2><span class="timer">⏱️ ${left} s</span></div>
        <div class="row"><b>Bannissements :</b>${SIM.bans.length ? SIM.bans.map((k) => icon(k, 'ic sm')).join('') : '<span class="muted">aucun</span>'}<button class="btn sm ghost" data-act="bans">🎲 10 bannissements au hasard</button></div>
        <div class="row"><button class="btn" data-act="nextPick" ${all ? 'disabled' : ''}>⏭ Pick suivant (ordre officiel)</button><button class="btn ghost" data-act="allButMe" ${all ? 'disabled' : ''}>⏩ Tout le monde sauf moi</button><button class="btn ghost" data-act="allPicks" ${all ? 'disabled' : ''}>⏩ Tout compléter</button><button class="btn ghost" data-act="toLobby">↺ Revenir au salon</button>
        <button class="btn hex" data-act="toLoading" ${all ? '' : 'disabled'}>▶ Lancer la partie</button></div>
        <h3>Ce que Noob LOL a fait dans le « client »</h3>
        <p>${runes ? `✅ Page de runes créée : <b>${esc(runes.name)}</b> · ${(runes.selectedPerkIds || []).slice(0, 6).map(perkName).map(esc).join(', ')}` : '<span class="muted">Aucune page de runes appliquée pour l\'instant.</span>'}</p>
        <p>${SIM.applied.spells ? `✅ Sorts choisis : ${spellIcon(SIM.applied.spells[0])}${spellIcon(SIM.applied.spells[1])}` : '<span class="muted">Aucun sort d\'invocateur appliqué pour l\'instant.</span>'}</p></div>`;
  }
  /* Écran de chargement plein écran, disposé comme celui du jeu (mêmes proportions que l'encart de Noob LOL) */
  function viewLoading() {
    const L = SIM.load, W = window.innerWidth, H = window.innerHeight;
    const { rows, o } = LoadLayout.cards(W, H, SIM.layout);
    /* Carte comme dans le jeu : illustration en haut, nom du champion vers 75 %, plaque runes/sorts, nom du joueur */
    const card = (p, r) => { const c = champ(p.champ); const pr = Math.min(100, Math.round(L.prog[p.cell]));
      return `<div class="lcard ${p.isMe ? 'me' : ''}" data-cell="${p.cell}" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;font-size:${(r.w * 0.058).toFixed(1)}px">${c ? `<img class="art" alt="" src="${Dd.img.loading(c.id)}">` : ''}
        <b class="cname" style="top:${(o.nameY * 100 + 1).toFixed(1)}%">${esc(c ? c.name : '?')}</b>
        <div class="plate"><span class="lsp">${spellIcon(p.spells[0])}${spellIcon(p.spells[1])}</span></div>
        <span class="pname ${p.isMe ? 'me' : ''}">${esc(p.gameName)}</span>
        <div class="lbar"><i style="width:${pr}%"></i></div><span class="lpct">${pr} %</span></div>`; };
    const midY = ((o.row1 + o.cardH) * H + o.row2 * H) / 2;
    return `<div class="lscreen">${byTeam('ORDER').map((p, i) => card(p, rows[0][i])).join('')}${byTeam('CHAOS').map((p, i) => card(p, rows[1][i])).join('')}
      <div class="lmid" style="top:${Math.round(midY)}px">${L.done ? '<span class="ready">✅ Tout le monde est prêt.</span>' : '<button class="btn ghost sm" data-act="fillLoading">⏩ Terminer le chargement</button>'}<button class="btn hex sm" data-act="skipLoading">▶ Lancer la partie</button>
      <span class="muted">${Date.now() - L.t0 < 2000 ? 'Lancement du jeu (phase « GameStart »)' : Date.now() - L.t0 < 4000 ? 'Jeu lancé (phase « InProgress »)' : 'Jeu lancé : il répond déjà (chrono à 0)'} · F11 pour le plein écran</span></div></div>`;
  }
  function boardHtml() {
    const G = SIM.game, S = G.st;
    const row = (p) => { const s = S[p.cell], dead = s.deadUntil > G.t; return `<div class="prow ${p.isMe ? 'me' : ''} ${dead ? 'dead' : ''}">${icon(p.champ, 'ic sm')}<span class="lvl">${s.level}</span><b class="ell">${esc(champName(p.champ))}</b><span>${s.k}/${s.d}/${s.a}</span><span>${Math.round(s.cs)} CS</span><span>${nf(Math.round(s.gold - s.spent))} po</span><span class="items">${s.items.map(itemIcon).join('')}</span>${dead ? `<span class="dead">💀 ${Math.ceil(s.deadUntil - G.t)} s</span>` : ''}</div>`; };
    return `<h2>🟦 Mon équipe</h2>${byTeam('ORDER').map(row).join('')}<h2 style="margin-top:10px">🟥 Adversaires</h2>${byTeam('CHAOS').map(row).join('')}`;
  }
  const logHtml = () => SIM.log.map((l) => `<div><span class="muted">${fmt(l.t)}</span> ${esc(l.txt)}</div>`).join('');
  function viewGame() {
    const G = SIM.game;
    const B = (act, val, txt, cls = '') => `<button class="btn sm ${cls}" data-act="${act}" data-val="${val}">${txt}</button>`;
    return `<div class="cols g">
      <div><div class="card"><h2 id="gclock" class="clock">⏱️ ${fmt(G.t)}</h2><div class="ctrls"><span class="muted">Vitesse</span>${[1, 5, 10, 30].map((v) => `<button class="chip ${SIM.speed === v ? 'on' : ''}" data-act="speed" data-val="${v}">×${v}</button>`).join('')}<button class="btn sm" data-act="pause">${G.running ? '⏸ Pause' : '▶ Reprendre'}</button>${B('skip', 60, '+1 min', 'ghost')}${B('skip', 300, '+5 min', 'ghost')}</div>
        <label class="chk"><input type="checkbox" data-sim="auto" ${SIM.auto ? 'checked' : ''}> Événements automatiques (kills, objectifs, tours)</label>
        <label class="chk"><input type="checkbox" data-sim="autoBuy" ${SIM.autoBuy ? 'checked' : ''}> Mes achats automatiques</label></div>
        <div class="card" id="gboard">${boardHtml()}</div></div>
      <div><div class="card"><h2>Déclencher</h2>
        <div class="trg"><span>Moi</span>${B('me', 'hp', '❤️ Vie à 15 %')}${B('me', 'mana', '💧 Mana à 5 %')}${B('me', 'gold', '🪙 +2 000 po')}${B('me', 'buy', '🛒 Acheter mon prochain objet')}${B('me', 'die', '💀 Je meurs')}${B('me', 'level', '⬆️ +1 niveau')}</div>
        <div class="trg"><span>Kills</span>${B('kill', 'ORDER', '⚔️ Kill pour nous')}${B('kill', 'CHAOS', '⚔️ Kill pour eux')}${B('dead3', '', '💀 3 adversaires morts')}</div>
        <div class="trg"><span>Adversaire de voie</span>${B('opp', 'level', '⬆️ +2 niveaux')}${B('opp', 'item', '🛒 Finit un objet')}</div>
        ${['drake', 'grubs', 'herald', 'baron', 'turret', 'inhib'].map((k) => `<div class="trg"><span>${{ drake: '🐉 Dragon', grubs: '🪲 Larve', herald: '🦀 Héraut', baron: '👾 Nashor', turret: '🏰 Tour', inhib: '💎 Inhibiteur' }[k]}</span>${B('obj', k + ':ORDER', 'pour nous')}${B('obj', k + ':CHAOS', 'pour eux')}</div>`).join('')}
        <div class="trg"><span>Noms des événements</span><select data-sim="nameMode"><option value="legacy" ${SIM.nameMode === 'legacy' ? 'selected' : ''}>Ancien nom d'invocateur</option><option value="game" ${SIM.nameMode === 'game' ? 'selected' : ''}>Nom de jeu</option><option value="riotid" ${SIM.nameMode === 'riotid' ? 'selected' : ''}>Riot ID</option></select></div>
        <div class="row"><button class="btn danger" data-act="toEnd">🏁 Fin de partie</button></div></div>
        <div class="card"><h2>📜 Ce qui s'est passé</h2><div class="log" id="glog">${logHtml()}</div></div></div></div>`;
  }
  function viewEnd() {
    const G = SIM.game;
    return `<div class="card"><h2>🏁 Partie terminée (${fmt(G ? G.t : 0)})</h2><p>Noob LOL voit la phase « EndOfGame » et affiche l'état final de la partie (une partie simulée n'a pas de statistiques complètes chez Riot).</p>
      <div class="row"><button class="btn" data-act="toLobby">↺ Nouvelle partie</button></div></div>`;
  }
  /* Mise à jour partielle (horloge, tableau, journal) : les boutons ne sont pas recréés, les clics ne se perdent pas */
  function refreshGame() {
    const c = document.getElementById('gclock'), b = document.getElementById('gboard'), l = document.getElementById('glog');
    if (!c || !b || !l) return render();
    c.textContent = `⏱️ ${fmt(SIM.game.t)}`; b.innerHTML = boardHtml(); l.innerHTML = logHtml();
    renderTop();
  }
  let busyInput = false;
  function render() {
    renderTop();
    if (busyInput) return;
    if (!D.champList || !D.champList.length) return;
    const y = window.scrollY;
    app.innerHTML = SIM.step === 'lobby' ? viewLobby() : SIM.step === 'select' ? viewSelect() : SIM.step === 'loading' ? viewLoading() : SIM.step === 'game' ? viewGame() : viewEnd();
    window.scrollTo(0, y);
  }

  /* ---------------- Actions ---------------- */
  document.addEventListener('focusin', (e) => { if (e.target.matches('input:not([type=checkbox]), select')) busyInput = true; });
  document.addEventListener('focusout', () => { busyInput = false; });
  document.addEventListener('change', (e) => {
    const t = e.target;
    busyInput = false;
    if (t.dataset.me) { SIM.me[t.dataset.me] = t.type === 'number' ? +t.value : t.value; }
    else if (t.dataset.sim) {
      const k = t.dataset.sim;
      SIM[k] = t.type === 'checkbox' ? t.checked : k === 'queue' ? +t.value : k === 'positions' ? t.value === '1' : t.value;
      if (k === 'queue') SIM.positions = +t.value !== 430;
    } else if (t.dataset.pick) {
      const p = SIM.players[+t.dataset.pick]; if (!p || p.locked) return;
      p.hover = +t.value; SIM.timerEnd = Date.now() + 30000;
    }
    render(); push();
  });
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
    const a = el.dataset.act, v = el.dataset.val;
    const G = SIM.game;
    if (a === 'toSelect') { newLobby(); SIM.step = 'select'; SIM.timerEnd = Date.now() + 30000; }
    else if (a === 'toLobby') { SIM.step = 'lobby'; SIM.game = null; }
    else if (a === 'bans') { SIM.bans = D.champList.slice().sort(() => Math.random() - 0.5).filter((c) => !SIM.players.some((p) => +c.key === p.champ || +c.key === p.hover)).slice(0, 10).map((c) => +c.key); }
    else if (a === 'lock') { const p = SIM.players[+v]; if (p && p.hover) { p.champ = p.hover; p.hover = 0; p.locked = true; SIM.timerEnd = Date.now() + 30000; } }
    else if (a === 'nextPick') { const p = nextPicker(); if (p) { if (p.isMe && !p.hover) autoPick(p); else if (p.isMe) { p.champ = p.hover; p.hover = 0; p.locked = true; } else autoPick(p); SIM.timerEnd = Date.now() + 30000; } }
    else if (a === 'allButMe') { pickOrder().filter((p) => !p.isMe && !p.locked).forEach(autoPick); }
    else if (a === 'allPicks') { pickOrder().filter((p) => !p.locked).forEach((p) => { if (p.hover) { p.champ = p.hover; p.hover = 0; p.locked = true; } else autoPick(p); }); }
    else if (a === 'toLoading') { SIM.step = 'loading'; initGame(); SIM.load = { prog: {}, speed: {}, t0: Date.now() }; SIM.players.forEach((p) => { SIM.load.prog[p.cell] = 0; SIM.load.speed[p.cell] = 6 + Math.random() * 10; }); }
    else if (a === 'skipLoading') { startGame(); }
    else if (a === 'fillLoading' && SIM.load) { SIM.players.forEach((p) => { SIM.load.prog[p.cell] = 100; }); SIM.load.done = true; }
    else if (a === 'speed') SIM.speed = +v;
    else if (a === 'pause' && G) G.running = !G.running;
    else if (a === 'skip' && G) { for (let i = 0; i < +v; i++) step1(); }
    else if (a === 'kill' && G) kill(v);
    else if (a === 'dead3' && G) { alive('CHAOS').slice(0, 3).forEach((p) => kill('ORDER', { victim: p })); }
    else if (a === 'obj' && G) { const [k, tm] = v.split(':'); objective(k, tm); }
    else if (a === 'me' && G) {
      const me = meP(), s = G.st[me.cell];
      if (v === 'hp') { G.hp = 0.15; logLine('❤️ Ta vie tombe à 15 %'); }
      if (v === 'mana') { G.mana = 0.05; logLine('💧 Ton mana tombe à 5 %'); }
      if (v === 'gold') { s.bonus = (s.bonus || 0) + 2000; s.gold += 2000; logLine('🪙 +2 000 po'); }
      if (v === 'buy') { if (!buyNext(me)) logLine('🛒 Pas assez d\'or pour le prochain objet'); }
      if (v === 'die') { const k = pickOne(alive('CHAOS')); if (k) kill('CHAOS', { killer: k, victim: me }); }
      if (v === 'level') { s.lvlOff += 1; s.level = Math.min(18, s.level + 1); }
    }
    else if (a === 'opp' && G) {
      const me = meP(), opp = SIM.players.find((p) => p.team === 'CHAOS' && p.role === me.role), s = opp && G.st[opp.cell];
      if (s && v === 'level') { s.lvlOff += 2; s.level = Math.min(18, s.level + 2); logLine(`⬆️ ${champName(opp.champ)} prend 2 niveaux`); }
      if (s && v === 'item') { const id = s.plan.find((x) => isLeg(D.items[String(x)])); if (id) { s.plan = s.plan.filter((x) => x !== id); if (s.items.length >= 6) s.items.shift(); s.items.push(id); s.spent += D.items[String(id)].gold.total; logLine(`🛒 ${champName(opp.champ)} termine ${D.items[String(id)].name}`); } }
    }
    else if (a === 'toEnd') { SIM.step = 'end'; if (G) G.running = false; }
    if (SIM.step === 'game' && ['kill', 'dead3', 'obj', 'me', 'opp', 'skip'].includes(a)) refreshGame(); else render();
    push();
  });

  /* Ce que Noob LOL fait dans le « client » : page de runes, sorts d'invocateur */
  if (NB && NB.sim) NB.sim.onAction((act) => {
    if (act.type === 'runes') SIM.applied.runes = act.page;
    if (act.type === 'spells') { SIM.applied.spells = act.spells; const me = meP(); if (me) me.spells = act.spells.slice(); }
    render(); push();
  });

  /* Boucles : partie (1 s), chargement (250 ms), état de la connexion de Noob LOL (2 s) */
  setInterval(tick, 1000);
  setInterval(() => {
    if (SIM.step === 'select') { renderTop(); const tEl = document.querySelector('.timer'); if (tEl) tEl.textContent = `⏱️ ${Math.max(0, Math.round((SIM.timerEnd - Date.now()) / 1000))} s`; }
    if (SIM.step !== 'loading' || !SIM.load) return;
    let done = true;
    SIM.players.forEach((p) => { SIM.load.prog[p.cell] = Math.min(100, SIM.load.prog[p.cell] + SIM.load.speed[p.cell] * 0.25 * (0.6 + Math.random() * 0.8)); if (SIM.load.prog[p.cell] < 100) done = false; });
    /* Chargement fini : la partie ne démarre que sur un clic (le temps de tester l'écran « partie trouvée ») */
    if (done && !SIM.load.done) { SIM.load.done = true; render(); push(); return; }
    if (done) return;
    let ok = true;
    SIM.players.forEach((p) => { const el = document.querySelector(`.lcard[data-cell="${p.cell}"]`); if (!el) { ok = false; return; } const pr = Math.min(100, Math.round(SIM.load.prog[p.cell])); el.querySelector('.lbar i').style.width = pr + '%'; el.querySelector('.lpct').textContent = pr + ' %'; });
    if (!ok) render();
    push();
  }, 250);
  setInterval(() => {
    if (!NB || !NB.sim) return;
    NB.sim.ports().then((p) => {
      if (!p) return;
      const ago = (t) => (t ? Math.round((Date.now() - t) / 1000) : null);
      const l = ago(p.seen && p.seen.lcu), g = ago(p.seen && p.seen.live);
      status = `${l != null && l < 6 ? '🟢 Noob LOL connecté' : '🟠 En attente de Noob LOL…'}${g != null && g < 6 ? ' · lit la partie' : ''}`;
      renderTop();
    }).catch(() => {});
  }, 2000);

  /* Même disposition des cartes que celle réglée dans Noob LOL */
  const syncLayout = () => { if (NB && NB.config) NB.config.get().then((c) => { const l = (c && c.overlay && c.overlay.layout) || null; if (JSON.stringify(l) !== JSON.stringify(SIM.layout)) { SIM.layout = l; if (SIM.step === 'loading') render(); } }).catch(() => {}); };
  syncLayout(); setInterval(syncLayout, 3000);
  window.addEventListener('resize', () => { if (SIM.step === 'loading') render(); });
  Dd.load().then(() => { render(); push(); }).catch((e) => { app.innerHTML = `<div class="card"><h2>Données Riot indisponibles</h2><p>${esc(e.message)}</p></div>`; });
  render(); push();
})();
