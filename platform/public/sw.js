/* Service Worker — Académie Compta FR (PWA installable Android/iOS)
   Stratégie sûre pour un site dynamique avec authentification :
   - GET /public/* : cache d'abord (les assets sont versionnés par ?v=, donc jamais périmés)
   - navigations (pages HTML) : réseau d'abord, repli cache hors-ligne
   - on ne touche jamais aux POST ni au cross-origin */
const CACHE = 'acf-v1';
const ASSETS = [
  '/public/app.css', '/public/chat.js', '/public/icon-192.png', '/public/icon-512.png',
  '/public/favicon.png', '/public/manifest.webmanifest', '/public/logo.jpg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                  // jamais sur POST/PUT…
  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return;   // pas de cross-origin

  // Assets statiques : cache d'abord, mise à jour en arrière-plan
  if (url.pathname.startsWith('/public/')) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => hit))
    );
    return;
  }

  // Pages : réseau d'abord (toujours frais quand en ligne), repli cache hors-ligne
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('/')))
    );
  }
});
