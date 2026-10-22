/* API officielle « Live Client Data » de Riot : pendant une partie, le jeu publie l'état visible
   (temps de jeu, joueurs, objets, scores, événements) sur https://127.0.0.1:2999. Lecture seule. */
const { EventEmitter } = require('events');
const { localGet } = require('./lcu');

const idFromRaw = (raw, re) => { const m = String(raw || '').match(re); return m ? m[1] : ''; };
const champId = (p) => idFromRaw(p.rawChampionName, /displayname_(\w+)$/i) || String(p.championName || '').replace(/[^A-Za-z]/g, '');
const spellId = (s) => idFromRaw(s && s.rawDisplayName, /SummonerSpell_(\w+?)_DisplayName/i);

function simplify(d) {
  if (!d || !d.gameData) return null;
  const meName = (d.activePlayer || {}).riotId || (d.activePlayer || {}).summonerName || '';
  const players = (d.allPlayers || []).map((p) => ({
    name: p.riotId || p.summonerName || '', gameName: p.riotIdGameName || (p.riotId || p.summonerName || '').split('#')[0],
    champ: champId(p), champName: p.championName, team: p.team, position: (p.position || '').toLowerCase(), level: p.level,
    dead: !!p.isDead, respawn: p.respawnTimer || 0, bot: !!p.isBot,
    items: (p.items || []).map((i) => ({ id: i.itemID, slot: i.slot, count: i.count })).sort((a, b) => a.slot - b.slot),
    k: (p.scores || {}).kills || 0, d: (p.scores || {}).deaths || 0, a: (p.scores || {}).assists || 0, cs: (p.scores || {}).creepScore || 0, ward: Math.round((p.scores || {}).wardScore || 0),
    spells: [spellId((p.summonerSpells || {}).summonerSpellOne), spellId((p.summonerSpells || {}).summonerSpellTwo)],
    spellNames: [((p.summonerSpells || {}).summonerSpellOne || {}).displayName || '', ((p.summonerSpells || {}).summonerSpellTwo || {}).displayName || ''],
  }));
  const me = players.find((p) => p.name === meName) || null;
  const ap = d.activePlayer || {};
  return {
    time: (d.gameData || {}).gameTime || 0, mode: (d.gameData || {}).gameMode, map: (d.gameData || {}).mapNumber,
    me: me ? { name: me.name, champ: me.champ, team: me.team, level: ap.level, gold: Math.floor(ap.currentGold || 0),
      stats: ap.championStats ? { ad: Math.round(ap.championStats.attackDamage), ap: Math.round(ap.championStats.abilityPower), armor: Math.round(ap.championStats.armor), mr: Math.round(ap.championStats.magicResist), ms: Math.round(ap.championStats.moveSpeed), hp: Math.round(ap.championStats.currentHealth), maxHp: Math.round(ap.championStats.maxHealth) } : null } : null,
    players,
    events: ((d.events || {}).Events || []).map((e) => ({ id: e.EventID, name: e.EventName, t: e.EventTime, killer: e.KillerName || '', victim: e.VictimName || '', dragon: e.DragonType || '', stolen: e.Stolen === 'True' || e.Stolen === true, turret: e.TurretKilled || '', inhib: e.InhibKilled || '', acingTeam: e.AcingTeam || '' })),
  };
}

class LiveWatcher extends EventEmitter {
  constructor(port = 2999) { super(); this.port = port; this.timer = null; this.active = false; this.last = null; }
  start() { if (!this.timer) this.loop(); }
  stop() { clearTimeout(this.timer); this.timer = null; }
  async loop() {
    let delay = 4000;
    try {
      const d = await localGet(this.port, '/liveclientdata/allgamedata', null, 1500);
      const s = simplify(d);
      if (s) { this.active = true; this.last = s; this.emit('data', s); delay = 1000; }
      else if (this.active) { this.active = false; this.emit('data', null); }
    } catch (e) {
      if (this.active) { this.active = false; this.last = null; this.emit('data', null); }
    }
    this.timer = setTimeout(() => this.loop(), delay);
  }
}

module.exports = { LiveWatcher, simplify };
