/* Pont sécurisé : l'interface n'a accès qu'à ces fonctions, jamais directement au PC. */
const { contextBridge, ipcRenderer } = require('electron');

const call = (ch, ...a) => ipcRenderer.invoke(ch, ...a).then((r) => { if (r && r.ok) return r.data; const e = new Error((r && r.error) || 'Erreur'); e.status = r && r.status; throw e; });
const on = (ch) => (cb) => { const f = (e, d) => cb(d); ipcRenderer.on(ch, f); return () => ipcRenderer.removeListener(ch, f); };

contextBridge.exposeInMainWorld('noob', {
  desktop: true,
  info: () => call('app:info'),
  config: { get: () => call('config:get'), set: (p) => call('config:set', p), setKey: (k) => call('config:setKey', k), testKey: () => call('config:testKey') },
  lcu: { state: () => call('lcu:state'), on: on('lcu') },
  live: { state: () => call('live:state'), on: on('live') },
  riot: { profile: (riotId) => call('riot:profile', riotId), masteries: (puuid) => call('riot:masteries', puuid) },
  stats: {
    counts: () => call('stats:counts'), champ: (c, r, d) => call('stats:champ', c, r, d), tier: (r, d, m) => call('stats:tier', r, d, m),
    counters: (e, r, d) => call('stats:counters', e, r, d), matchup: (c, o, r, d) => call('stats:matchup', c, o, r, d), mainRole: (c) => call('stats:mainRole', c), clear: () => call('stats:clear'),
  },
  collector: { start: () => call('collector:start'), stop: () => call('collector:stop'), status: () => call('collector:status'), on: on('collector') },
  minimap: {
    displays: () => call('minimap:displays'), source: () => call('minimap:source'), sources: () => call('minimap:sources'), open: () => call('minimap:open'), close: () => call('minimap:close'), isOpen: () => call('minimap:isOpen'),
    onState: on('minimap:state'), onConfig: on('minimap:config'),
  },
  openExternal: (u) => call('open:external', u),
  onUpdate: on('update'), installUpdate: () => call('update:install'),
});
