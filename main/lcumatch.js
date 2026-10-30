/* Historique et statistiques de fin de partie SANS clé Riot : lus dans l'historique du client League of Legends
   (API locale officielle du client, la même que l'onglet « Historique » du client). Les parties du client sont
   converties au format de l'API Riot (match-v5) pour que le reste de l'appli les lise de la même façon. */

const LANE = { TOP: 'TOP', JUNGLE: 'JUNGLE', MIDDLE: 'MIDDLE', MID: 'MIDDLE', BOTTOM: 'BOTTOM', BOT: 'BOTTOM' };

/* Poste d'un joueur d'après les infos du client (voie + rôle), sinon Châtiment = jungle */
function positionOf(p) {
  const t = p.timeline || {}, lane = LANE[String(t.lane || '').toUpperCase()] || '', role = String(t.role || '').toUpperCase();
  if (p.teamPosition) return p.teamPosition;
  if (p.spell1Id === 11 || p.spell2Id === 11) return 'JUNGLE';
  if (lane === 'BOTTOM') return /SUPPORT/.test(role) ? 'UTILITY' : 'BOTTOM';
  return lane;
}

function perksOf(s) {
  if (!s || !s.perkPrimaryStyle) return undefined;
  const sel = (ids) => ids.filter(Boolean).map((perk) => ({ perk }));
  return {
    statPerks: { offense: s.statPerk0 || 0, flex: s.statPerk1 || 0, defense: s.statPerk2 || 0 },
    styles: [
      { description: 'primaryStyle', style: s.perkPrimaryStyle, selections: sel([s.perk0, s.perk1, s.perk2, s.perk3]) },
      { description: 'subStyle', style: s.perkSubStyle, selections: sel([s.perk4, s.perk5]) },
    ],
  };
}

const matchIdOf = (g, platform) => `${String(g.platformId || platform || 'EUW1').toUpperCase()}_${g.gameId}`;

/* Partie complète du client → format match-v5 */
function toV5(g, platform) {
  if (!g || !g.gameId) return null;
  const ids = g.participantIdentities || [];
  const participants = (g.participants || []).map((p) => {
    const pl = (ids.find((x) => x.participantId === p.participantId) || {}).player || {};
    const s = p.stats || {};
    return Object.assign({}, s, {
      participantId: p.participantId, teamId: p.teamId, championId: p.championId, championName: '',
      puuid: pl.puuid || '', riotIdGameName: pl.gameName || pl.summonerName || '', riotIdTagline: pl.tagLine || '', summonerName: pl.summonerName || pl.gameName || '',
      summoner1Id: p.spell1Id, summoner2Id: p.spell2Id, teamPosition: positionOf(p), individualPosition: positionOf(p),
      win: !!s.win, perks: perksOf(s), gameEndedInEarlySurrender: !!s.gameEndedInEarlySurrender,
    });
  });
  const obj = (t, k, first) => ({ first: !!t[first], kills: t[k] || 0 });
  const teams = (g.teams || []).map((t) => ({
    teamId: t.teamId, win: t.win === 'Win' || t.win === true,
    bans: (t.bans || []).map((b) => ({ championId: b.championId, pickTurn: b.pickTurn })),
    objectives: {
      baron: obj(t, 'baronKills', 'firstBaron'), dragon: { first: !!(t.firstDargon || t.firstDragon), kills: t.dragonKills || 0 }, riftHerald: obj(t, 'riftHeraldKills', 'firstRiftHerald'),
      horde: obj(t, 'hordeKills', 'firstHorde'), tower: obj(t, 'towerKills', 'firstTower'), inhibitor: obj(t, 'inhibitorKills', 'firstInhibitor'),
      champion: { first: !!t.firstBlood, kills: participants.filter((p) => p.teamId === t.teamId).reduce((a, p) => a + (p.kills || 0), 0) },
    },
  }));
  return {
    metadata: { matchId: matchIdOf(g, platform), participants: participants.map((p) => p.puuid), source: 'client' },
    info: { gameId: g.gameId, gameCreation: g.gameCreation || 0, gameDuration: g.gameDuration || 0, gameMode: g.gameMode || '', gameType: g.gameType || '', mapId: g.mapId || 0,
      queueId: g.queueId || 0, gameVersion: g.gameVersion || '', platformId: g.platformId || '', participants, teams },
  };
}

/* Chronologie du client → format match-v5 (équipe du tueur ajoutée pour les monstres) */
function timelineToV5(tl, match) {
  const frames = (tl && tl.frames) || null;
  if (!frames || !frames.length) return null;
  const teamOf = {};
  ((match && match.info && match.info.participants) || []).forEach((p) => { teamOf[p.participantId] = p.teamId; });
  return {
    metadata: { source: 'client' },
    info: {
      frameInterval: 60000,
      frames: frames.map((f) => ({
        timestamp: f.timestamp || 0,
        participantFrames: f.participantFrames || {},
        events: (f.events || []).map((e) => Object.assign({}, e, e.killerId && !e.killerTeamId && teamOf[e.killerId] ? { killerTeamId: teamOf[e.killerId] } : {})),
      })),
    },
  };
}

/* Les fonctions de l'API Riot utilisées par l'historique et la fin de partie, lues dans le client */
function clientMatchApi(lcu, getPlatform) {
  const gameIdOf = (matchId) => String(matchId).split('_').pop();
  const notFound = () => Object.assign(new Error('Partie introuvable dans l\'historique du client.'), { status: 404 });
  const need = () => { if (!lcu.creds) throw Object.assign(new Error('Lance le client League of Legends (ou ajoute une clé Riot dans les Réglages).'), { status: 503 }); };
  const api = {
    source: 'client',
    async matchIds(puuid, opts = {}) {
      need();
      const n = Math.min(100, (opts && opts.count) || 20);
      const j = await lcu.get(`/lol-match-history/v1/products/lol/${encodeURIComponent(puuid)}/matches?begIndex=0&endIndex=${n - 1}`);
      const games = (j && j.games && j.games.games) || (j && j.games) || [];
      return games.filter((g) => g && g.gameId).sort((a, b) => (b.gameCreation || 0) - (a.gameCreation || 0)).map((g) => matchIdOf(g, getPlatform && getPlatform()));
    },
    async match(matchId) {
      need();
      const g = await lcu.get(`/lol-match-history/v1/games/${gameIdOf(matchId)}`);
      const m = toV5(g, getPlatform && getPlatform());
      if (!m) throw notFound();
      return m;
    },
    async timeline(matchId) {
      need();
      const [g, tl] = await Promise.all([lcu.get(`/lol-match-history/v1/games/${gameIdOf(matchId)}`), lcu.get(`/lol-match-history/v1/game-timelines/${gameIdOf(matchId)}`)]);
      const t = timelineToV5(tl, toV5(g));
      if (!t) throw notFound();
      return t;
    },
  };
  return api;
}

/* Clé Riot si elle marche, sinon le client : même interface que l'API Riot */
function withFallback(riot, client, hasKey) {
  const pick = (name) => async (...a) => {
    if (hasKey()) {
      try { return await riot[name](...a); } catch (e) { if (e.status === 404 && name !== 'matchIds') throw e; if (!client) throw e; }
    }
    return client[name](...a);
  };
  return { matchIds: pick('matchIds'), match: pick('match'), timeline: pick('timeline') };
}

module.exports = { toV5, timelineToV5, clientMatchApi, withFallback, positionOf };
