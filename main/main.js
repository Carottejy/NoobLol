/* Noob LOL — processus principal Electron */
const { app, BrowserWindow, ipcMain, shell, screen, desktopCapturer, safeStorage, session, Menu } = require('electron');
const path = require('path');
const { Config } = require('./config');
const { LcuWatcher } = require('./lcu');
const { LiveWatcher } = require('./live');
const { RiotApi, PLATFORMS } = require('./riotapi');
const { StatsDb } = require('./db');
const { Collector } = require('./collector');

if (!app.requestSingleInstanceLock()) { app.quit(); }

let win = null, mini = null, cfg, api, db, collector;
const lcu = new LcuWatcher(() => cfg && cfg.data.lolPath);
const live = new LiveWatcher();
const RENDERER = path.join(__dirname, '..', 'renderer');

function send(ch, data) { if (win && !win.isDestroyed()) win.webContents.send(ch, data); }
const secureWebPrefs = () => ({ preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false });

function createWindow() {
  win = new BrowserWindow({
    width: 1320, height: 860, minWidth: 900, minHeight: 600, backgroundColor: '#070d18', title: 'Noob LOL',
    icon: path.join(RENDERER, 'icons', 'icon-512.png'), autoHideMenuBar: true, show: false, webPreferences: secureWebPrefs(),
  });
  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(RENDERER, 'index.html'));
  /* Les liens externes s'ouvrent dans le navigateur, jamais dans l'appli. */
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https:\/\//.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file://')) { e.preventDefault(); if (/^https:\/\//.test(url)) shell.openExternal(url); } });
  win.on('closed', () => { win = null; if (mini && !mini.isDestroyed()) mini.close(); });
}

/* ---------- Mini-carte sur un deuxième écran ---------- */
async function screenSources(withThumb) {
  const size = withThumb ? { width: 1600, height: 900 } : { width: 1, height: 1 };
  const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: size });
  return sources.map((s) => ({ id: s.id, name: s.name, displayId: s.display_id, thumb: withThumb ? s.thumbnail.toDataURL() : '' }));
}
function displays() {
  const primary = screen.getPrimaryDisplay().id;
  return screen.getAllDisplays().map((d, i) => ({ id: d.id, label: d.label || `Écran ${i + 1}`, primary: d.id === primary, bounds: d.bounds, scale: d.scaleFactor }));
}
async function miniConfig() {
  const m = cfg.data.minimap;
  const srcs = await screenSources(false);
  const primary = String(screen.getPrimaryDisplay().id);
  const src = srcs.find((s) => s.displayId === String(m.sourceDisplayId || primary)) || srcs[0];
  return { sourceId: src ? src.id : null, crop: m.crop };
}
async function openMinimap() {
  const ds = screen.getAllDisplays();
  const primary = screen.getPrimaryDisplay();
  const target = ds.find((d) => d.id === cfg.data.minimap.displayId) || ds.find((d) => d.id !== primary.id) || primary;
  if (mini && !mini.isDestroyed()) { mini.setBounds(target.workArea); mini.webContents.send('minimap:config', await miniConfig()); mini.focus(); return true; }
  mini = new BrowserWindow({
    x: target.workArea.x, y: target.workArea.y, width: target.workArea.width, height: target.workArea.height,
    backgroundColor: '#000000', title: 'Noob LOL — Mini-carte', frame: false, alwaysOnTop: !!cfg.data.minimap.alwaysOnTop, autoHideMenuBar: true,
    icon: path.join(RENDERER, 'icons', 'icon-512.png'), webPreferences: secureWebPrefs(),
  });
  mini.loadFile(path.join(RENDERER, 'minimap.html'));
  mini.webContents.on('did-finish-load', async () => mini.webContents.send('minimap:config', await miniConfig()));
  mini.on('closed', () => { mini = null; send('minimap:state', false); });
  send('minimap:state', true);
  return true;
}

/* ---------- IPC (seul pont entre l'interface et le PC) ---------- */
function handlers() {
  const h = (ch, fn) => ipcMain.handle(ch, async (e, ...a) => {
    try { return { ok: true, data: await fn(...a) }; } catch (err) { return { ok: false, error: err.message || String(err), status: err.status }; }
  });
  h('app:info', () => ({ version: app.getVersion(), platforms: PLATFORMS, packaged: app.isPackaged }));
  h('config:get', () => cfg.public());
  h('config:set', (patch) => {
    const before = cfg.data.platform;
    const out = cfg.set(patch);
    if (mini && patch && patch.minimap) miniConfig().then((c) => mini && mini.webContents.send('minimap:config', c));
    if (patch && patch.minimap && 'alwaysOnTop' in patch.minimap && mini) mini.setAlwaysOnTop(!!patch.minimap.alwaysOnTop);
    if (patch && patch.platform && patch.platform !== before && collector.running) { collector.stop(); }
    return out;
  });
  h('config:setKey', async (key) => { cfg.setApiKey(key); if (!key) return { valid: false }; await api.status(); return { valid: true }; });
  h('config:testKey', async () => { await api.status(); return { valid: true }; });
  h('lcu:state', () => lcu.state);
  h('live:state', () => live.last);

  h('riot:profile', async (riotId) => {
    const id = riotId && riotId.gameName ? riotId : cfg.data.riotId;
    if (!id || !id.gameName || !id.tagLine) throw new Error('Indique ton Riot ID (ex. Carotte#EUW) dans les Réglages, ou lance le client du jeu.');
    const acc = await api.account(id.gameName, id.tagLine);
    const [summ, leagues, mastery, ids] = await Promise.all([api.summoner(acc.puuid), api.leagues(acc.puuid), api.masteries(acc.puuid, 15), api.matchIds(acc.puuid, { queue: 0, count: 10 }, 5)]);
    const matches = [];
    for (const mid of ids) {
      try {
        const m = await api.match(mid, 5);
        const p = m.info.participants.find((x) => x.puuid === acc.puuid);
        if (p) matches.push({ id: mid, queue: m.info.queueId, created: m.info.gameCreation, duration: m.info.gameDuration, champ: p.championId, champName: p.championName, role: p.teamPosition, win: p.win, k: p.kills, d: p.deaths, a: p.assists, cs: (p.totalMinionsKilled || 0) + (p.neutralMinionsKilled || 0), items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6], vision: p.visionScore, remake: !!p.gameEndedInEarlySurrender });
      } catch (e) { /* partie illisible : on passe */ }
    }
    return { account: acc, summoner: summ, leagues, mastery, matches };
  });
  h('riot:masteries', async (puuid) => api.masteries(puuid, 30));

  h('stats:counts', () => db.counts());
  h('stats:champ', (champ, role, days) => db.champ(champ, role, days));
  h('stats:tier', (role, days, minGames) => db.tier(role, days, minGames));
  h('stats:counters', (enemy, role, days) => db.counters(enemy, role, days));
  h('stats:matchup', (champ, opp, role, days) => db.matchup(champ, opp, role, days));
  h('stats:mainRole', (champ) => db.mainRole(champ));
  h('stats:clear', () => { collector.stop(); db.clearStats(); return db.counts(); });
  h('collector:start', () => { collector.start(); return collector.status(); });
  h('collector:stop', () => { collector.stop(); return collector.status(); });
  h('collector:status', () => collector.status());

  h('minimap:displays', () => displays());
  h('minimap:sources', () => screenSources(true));
  h('minimap:open', () => openMinimap());
  h('minimap:close', () => { if (mini && !mini.isDestroyed()) mini.close(); return true; });
  h('minimap:isOpen', () => !!(mini && !mini.isDestroyed()));
  h('open:external', (url) => { if (/^https:\/\//.test(url)) shell.openExternal(url); return true; });
  h('update:install', () => { try { require('electron-updater').autoUpdater.quitAndInstall(); } catch (e) { /* ignoré */ } return true; });
}

function autoUpdate() {
  if (!app.isPackaged) return;
  try {
    const { autoUpdater } = require('electron-updater');
    autoUpdater.on('update-downloaded', (info) => send('update', { version: info.version }));
    autoUpdater.checkForUpdates().catch(() => {});
    setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), 60 * 60 * 1000);
  } catch (e) { /* mise à jour indisponible */ }
}

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  cfg = new Config(app.getPath('userData'), safeStorage);
  api = new RiotApi({ getKey: () => cfg.getApiKey(), getPlatform: () => cfg.data.platform });
  db = await StatsDb.open(path.join(app.getPath('userData'), 'stats.sqlite'));
  collector = new Collector({ api, db, getConfig: () => cfg.data });
  collector.on('status', (s) => send('collector', s));
  lcu.on('state', (s) => send('lcu', s));
  live.on('data', (d) => send('live', d));
  /* Capture d'écran (mini-carte) autorisée uniquement pour nos propres pages. */
  session.defaultSession.setPermissionRequestHandler((wc, perm, cb, details) => cb(perm === 'media' && String(details.requestingUrl || wc.getURL()).startsWith('file://')));
  session.defaultSession.setPermissionCheckHandler((wc, perm, origin) => perm === 'media' && String(origin || '').startsWith('file://'));
  handlers();
  createWindow();
  lcu.start(); live.start();
  if (cfg.data.collector.autoStart && cfg.getApiKey()) collector.start();
  autoUpdate();
});
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.on('window-all-closed', () => { lcu.stop(); live.stop(); if (collector) collector.stop(); if (db) db.close(); app.quit(); });
