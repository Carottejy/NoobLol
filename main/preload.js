/* Pont sécurisé : l'interface n'a accès qu'à ces fonctions, jamais directement au PC. */
const { contextBridge, ipcRenderer } = require('electron');

const call = (ch, ...a) => ipcRenderer.invoke(ch, ...a).then((r) => { if (r && r.ok) return r.data; const e = new Error((r && r.error) || 'Erreur'); e.status = r && r.status; throw e; });
const on = (ch) => (cb) => { const f = (e, d) => cb(d); ipcRenderer.on(ch, f); return () => ipcRenderer.removeListener(ch, f); };

contextBridge.exposeInMainWorld('noob', {
  desktop: true,
  info: () => call('app:info'),
  config: { get: () => call('config:get'), set: (p) => call('config:set', p), setKey: (k) => call('config:setKey', k), testKey: () => call('config:testKey') },
  lcu: { state: () => call('lcu:state'), on: on('lcu'), applyRunes: (p) => call('lcu:applyRunes', p), applySpells: (s) => call('lcu:applySpells', s) },
  live: { state: () => call('live:state'), on: on('live') },
  riot: { profile: (riotId) => call('riot:profile', riotId), masteries: (puuid) => call('riot:masteries', puuid), history: (riotId) => call('riot:history', riotId) },
  stats: {
    counts: () => call('stats:counts'), roleDist: (c) => call('stats:roleDist', c), builds: (c, r, d) => call('stats:builds', c, r, d), champ: (c, r, d) => call('stats:champ', c, r, d), tier: (r, d, m) => call('stats:tier', r, d, m),
    counters: (e, r, d) => call('stats:counters', e, r, d), matchup: (c, o, r, d) => call('stats:matchup', c, o, r, d), mainRole: (c) => call('stats:mainRole', c), clear: () => call('stats:clear'),
  },
  collector: { start: () => call('collector:start'), stop: () => call('collector:stop'), status: () => call('collector:status'), on: on('collector') },
  minimap: {
    displays: () => call('minimap:displays'), source: () => call('minimap:source'), sources: () => call('minimap:sources'), open: () => call('minimap:open'), close: () => call('minimap:close'), isOpen: () => call('minimap:isOpen'),
    onState: on('minimap:state'), onConfig: on('minimap:config'),
  },
  key: { status: () => call('key:status'), renew: () => call('key:renew'), on: on('keystatus'), onRenewed: on('keyrenewed') },
  overlay: { update: (d) => call('overlay:update', d), reset: () => call('overlay:reset'), onData: on('overlay:data'), openItem: (id) => call('overlay:openItem', id), onOpenItem: on('open:item') },
  players: { info: (ids) => call('players:info', ids) },
  postgame: { get: () => call('postgame:get'), load: (id, puuid) => call('postgame:load', id, puuid), on: on('postgame') },
  openExternal: (u) => call('open:external', u), openData: () => call('app:openData'),
  onUpdate: on('update'), installUpdate: () => call('update:install'),
  update: { check: () => call('update:check'), state: () => call('update:state'), on: on('update:state') },
});
