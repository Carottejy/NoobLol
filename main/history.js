/* Historique de mes dernières parties (API officielle match-v5) : résumé par partie, gardé sur le PC
   pour ne pas redemander à Riot les parties déjà connues. Sert à la progression et au choix des champions. */
const fs = require('fs');
const path = require('path');

/* Résumé d'une partie pour un joueur */
function summarize(m, puuid) {
  const info = (m && m.info) || {};
  const p = (info.participants || []).find((x) => x.puuid === puuid);
  if (!p) return null;
  let dur = info.gameDuration || 0;
  if (!info.gameEndTimestamp && dur > 100000) dur = Math.round(dur / 1000);
  const team = info.participants.filter((x) => x.teamId === p.teamId);
  const sum = (k) => team.reduce((s, x) => s + (x[k] || 0), 0);
  const tk = sum('kills'), td = sum('totalDamageDealtToChampions'), tg = sum('goldEarned');
  return {
    id: (m.metadata || {}).matchId || '', created: info.gameCreation || 0, queue: info.queueId || 0, mode: info.gameMode || '', map: info.mapId || 0, dur,
    champ: p.championId, role: p.teamPosition || '', win: !!p.win, remake: !!p.gameEndedInEarlySurrender,
    k: p.kills || 0, d: p.deaths || 0, a: p.assists || 0, cs: (p.totalMinionsKilled || 0) + (p.neutralMinionsKilled || 0),
    gold: p.goldEarned || 0, dmg: p.totalDamageDealtToChampions || 0, kp: tk ? ((p.kills || 0) + (p.assists || 0)) / tk : 0,
    dmgShare: td ? (p.totalDamageDealtToChampions || 0) / td : 0, goldShare: tg ? (p.goldEarned || 0) / tg : 0,
    vision: p.visionScore || 0, wards: p.wardsPlaced || 0, ctrl: p.visionWardsBoughtInGame || 0, dead: p.totalTimeSpentDead || 0,
  };
}
/* Partie utile pour la progression : Faille de l'invocateur, mode classique, pas annulée, au moins 10 min */
const useful = (s) => !!s && s.map === 11 && /CLASSIC/i.test(s.mode || 'CLASSIC') && !s.remake && s.dur >= 600;

class History {
  constructor({ api, dir }) {
    this.api = api;
    this.file = dir ? path.join(dir, 'historique.json') : null;
    this.cache = {};
    try { if (this.file) this.cache = JSON.parse(fs.readFileSync(this.file, 'utf8')) || {}; } catch (e) { this.cache = {}; }
  }
  save() { try { if (this.file) fs.writeFileSync(this.file, JSON.stringify(this.cache)); } catch (e) { /* ignoré */ } }
  /* Les `count` dernières parties utiles (on regarde jusqu'à 2× plus de parties pour écarter ARAM, annulées…) */
  async get(puuid, count = 20) {
    const mine = this.cache[puuid] || (this.cache[puuid] = {});
    const ids = await this.api.matchIds(puuid, { queue: 0, count: Math.min(100, count * 2) }, 5);
    const out = [];
    let fetched = 0;
    for (const id of ids) {
      if (out.length >= count) break;
      if (!(id in mine)) {
        try { mine[id] = summarize(await this.api.match(id, 5), puuid); fetched++; } catch (e) { if (e.status === 404) mine[id] = null; else continue; }
      }
      if (useful(mine[id])) out.push(mine[id]);
    }
    if (fetched) this.save();
    return out.sort((a, b) => a.created - b.created);
  }
}

module.exports = { History, summarize, useful };
