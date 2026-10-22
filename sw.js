importScripts('./version.js');
const CACHE = 'nooblol-' + APP_VERSION;
const DD_CACHE = 'nooblol-ddragon';
const ASSETS = ['./', './index.html', './style.css', './version.js', './guide.js', './ddragon.js', './app.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});
self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== DD_CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  /* Données Riot (Data Dragon) : les fichiers d'un patch ne changent jamais → cache d'abord.
     La liste des versions, elle, est demandée au réseau d'abord pour détecter les nouveaux patchs. */
  if (url.hostname === 'ddragon.leagueoflegends.com') {
    if (url.pathname.endsWith('/versions.json')) {
      e.respondWith(fetch(e.request).then((res) => { if (res.ok) { const c = res.clone(); caches.open(DD_CACHE).then((x) => x.put(e.request, c)); } return res; })
        .catch(() => caches.match(e.request)));
      return;
    }
    e.respondWith(caches.open(DD_CACHE).then((c) => c.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) c.put(e.request, res.clone()).catch(() => {});
      return res;
    }))));
    return;
  }

  if (url.origin !== self.location.origin) return;
  /* Réseau d'abord (toujours la dernière version en ligne), cache en secours hors connexion. */
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {}); }
      return res;
    }).catch(() => caches.match(e.request).then((hit) => hit || caches.match('./index.html')))
  );
});
