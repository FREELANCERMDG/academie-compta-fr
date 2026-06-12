/* Service Worker — Académie Compta FR (PWA installable Android/iOS)
   Stratégie :
   - GET /public/* : cache d'abord (assets versionnés par ?v=, jamais périmés)
   - /formation (cours) : hors-ligne autorisé UNIQUEMENT pendant la promo gratuite (en-tête X-Promo-Until),
     et le cache EXPIRE automatiquement à l'échéance (même sans reconnexion) → contenu bloqué après la promo
   - autres routes protégées (espace, cabinet, admin…) : réseau uniquement (jamais hors-ligne)
   - pages publiques : réseau d'abord, repli cache hors-ligne
   - jamais de POST ni de cross-origin */
const CACHE = 'acf-v3';
const META_KEY = '/__promo_until__';
const COURSE_KEY = '/__course__';
// Routes protégées (hors /formation, géré à part) : jamais mises en cache
const PROTECTED = /^\/(tableau-de-bord|logiciel|cabinet|admin|communaute|api|deconnexion|reinitialiser|connexion|2fa)\b/;
const IS_COURSE = (p) => /^\/formation(\/(index\.html)?)?$/.test(p);
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

// Cours : en ligne on (re)cache si promo active, on purge sinon ; hors-ligne on sert le cache si la promo n'est pas expirée
async function handleCourse(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    const until = parseInt(res.headers.get('X-Promo-Until') || '0', 10) || 0;
    if (until > Date.now()) {
      cache.put(COURSE_KEY, res.clone());
      cache.put(META_KEY, new Response(String(until)));
    } else {
      await cache.delete(COURSE_KEY);
      await cache.delete(META_KEY);
    }
    return res;
  } catch (_) {
    // hors-ligne : autorisé seulement si la promo gratuite n'est pas terminée
    const metaRes = await cache.match(META_KEY);
    const until = metaRes ? (parseInt(await metaRes.text(), 10) || 0) : 0;
    if (until > Date.now()) {
      const hit = await cache.match(COURSE_KEY);
      if (hit) return hit;
    } else {
      await cache.delete(COURSE_KEY);
      await cache.delete(META_KEY);
    }
    return new Response(
      '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:520px;margin:16vh auto;padding:26px;text-align:center;color:#dfe7f5;background:#10162c;border:1px solid rgba(56,232,255,.3);border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.5)">' +
      '<div style="font-size:46px">🔒</div><h2 style="color:#fff;margin:.2em 0">Contenu non disponible hors-ligne</h2>' +
      '<p>Reconnectez-vous à Internet pour accéder à la formation.</p>' +
      '<p style="opacity:.7;font-size:13px">L\'accès hors-ligne n\'est possible que pendant la période gratuite.</p>' +
      '<p><a href="/" style="display:inline-block;background:linear-gradient(135deg,#7c6cff,#38e8ff);color:#06121f;font-weight:800;text-decoration:none;padding:11px 20px;border-radius:10px">Accueil</a></p></div>',
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

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

  if (req.mode !== 'navigate') return;               // on ne gère que les pages (navigations)

  // Cours : hors-ligne limité à la promo, expire à l'échéance
  if (IS_COURSE(url.pathname)) { e.respondWith(handleCourse(req)); return; }

  // Autres routes protégées : réseau uniquement (jamais hors-ligne)
  if (PROTECTED.test(url.pathname)) { e.respondWith(fetch(req)); return; }

  // Pages publiques : réseau d'abord, repli cache hors-ligne
  e.respondWith(
    fetch(req)
      .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); return res; })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('/')))
  );
});
