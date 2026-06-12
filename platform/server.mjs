// ===== Serveur de la plateforme e-learning (Node natif, sans dépendance) =====
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import {
  DIR, ROOT, cfg, loadEnv, openDB, hashPassword, verifyPassword, rid, genParrainCode,
  signSid, unsignSid, parseCookies, cookie, safeEqual, newTotpSecret, otpauthURI,
  verifyTOTP, esc, securityHeaders, loginGuard, loginFail, loginReset, audit, isEmail, strongPw,
  sendEmail, mailConfigured
} from './lib.mjs';
import {
  creerPaiement, setStatutPaiement, methodesManuelles, methodeManuelle, omApiActive, omApiInit, omApiStatus, carteActive
} from './payments.mjs';
import { MODULES, moduleInfo, estGratuit, teaserHtml, moduleCompletHtml, moduleTitre, quizFor } from './content.mjs';
import QRCode from 'qrcode';
const qrDataURL = async (uri) => { try { return await QRCode.toDataURL(uri, { margin: 1, width: 220 }); } catch { return ''; } };

loadEnv();
const PROD = process.env.PRODUCTION === 'true';
const PORT = parseInt(process.env.PORT || '3000', 10);
const BASE_URL = (process.env.BASE_URL || cfg.site.base_url || `http://localhost:${PORT}`).replace(/\/$/, '');
// Cache-busting des assets statiques : la valeur change à chaque démarrage/déploiement,
// donc le navigateur recharge immédiatement le CSS/JS mis à jour (plus de cache obsolète).
const ASSET_V = Date.now();
const db = openDB();
// 2FA (Google Authenticator) : obligatoire UNIQUEMENT pour l'admin. Les apprenants se connectent au mot de passe seul.
const twofaRequired = (role) => role === 'admin' && !(cfg.securite && cfg.securite.twofa_obligatoire === false);
// Émetteur 2FA en ASCII pur (certaines apps gèrent mal accents/tirets dans l'otpauth URI)
const ISSUER_2FA = 'Academie Compta FR';

// --- Paramètres fiscaux (source de vérité unique, mise à jour annuelle) ---
function loadFiscalite() { try { return JSON.parse(fs.readFileSync(path.join(DIR, 'fiscalite.json'), 'utf8')); } catch { return null; } }
function fiscaliteBadge() {
  const f = loadFiscalite(); if (!f) return '';
  return `<p class="muted" style="text-align:center">📅 Paramètres fiscaux : <b>référence ${esc(String(f.annee_reference))}</b> (${esc(f.loi_de_finances || '')}) — mis à jour le ${esc(f.date_maj || '')}. <span title="Mise à jour annuelle à la sortie de la loi de finances">Sources officielles (impots.gouv / BOFIP).</span></p>`;
}

// --- Admin initial (email piloté par config.admin_email, sinon ADMIN_EMAIL) ---
(function ensureAdmin() {
  const email = ((cfg.admin_email || process.env.ADMIN_EMAIL || '')).trim().toLowerCase();
  const pw = process.env.ADMIN_PASSWORD;
  if (!email) return;
  const existing = db.prepare("SELECT id, email FROM users WHERE role='admin' LIMIT 1").get();
  if (!existing) {
    if (!pw) return;
    const { hash, salt } = hashPassword(pw);
    db.prepare('INSERT INTO users(id,nom,prenom,email,pass_hash,pass_salt,email_verifie,role,cree_le) VALUES(?,?,?,?,?,?,1,?,?)')
      .run(rid(8), 'Admin', '', email, hash, salt, 'admin', new Date().toISOString());
    console.log('[init] Compte admin créé :', email);
  } else if (existing.email !== email) {
    try { db.prepare('UPDATE users SET email=? WHERE id=?').run(email, existing.id); console.log('[init] Email admin mis à jour :', email); } catch (e) { }
  }
})();

// --- Helpers HTTP ---
// Le site est servi derrière un Worker Cloudflare (reverse-proxy). Le Worker transmet
// l'IP et le pays réels du visiteur via x-orig-ip / x-orig-country, signés par
// x-proxy-auth = PROXY_SECRET. On ne fait confiance à ces en-têtes QUE si la signature
// correspond (sinon un accès direct à *.onrender.com pourrait usurper l'IP).
const PROXY_SECRET = process.env.PROXY_SECRET || '';
const fromProxy = req => !!PROXY_SECRET && req.headers['x-proxy-auth'] === PROXY_SECRET;
const ip = req => ((fromProxy(req) && req.headers['x-orig-ip']) || req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

// --- Limitation de débit en mémoire (anti password-spraying / anti-énumération) ---
const _rl = new Map(); // clé -> { count, reset }
function rateLimited(key, max, windowMs) {
  const now = Date.now();
  let e = _rl.get(key);
  if (!e || e.reset < now) { e = { count: 0, reset: now + windowMs }; _rl.set(key, e); }
  e.count++;
  return e.count > max;
}
try { setInterval(() => { const now = Date.now(); for (const [k, e] of _rl) if (e.reset < now) _rl.delete(k); }, 60000).unref(); } catch {}

// --- Présence "en ligne" : on note le dernier passage de l'utilisateur (au plus 1 écriture/min/user) ---
const _seen = new Map(); // uid -> ts dernier write
function touchSeen(uid) {
  if (!uid) return;
  const now = Date.now();
  if (now - (_seen.get(uid) || 0) < 60000) return;
  _seen.set(uid, now);
  try { db.prepare('UPDATE users SET vu_le=? WHERE id=?').run(new Date().toISOString(), uid); } catch {}
}

// --- Provinces de Madagascar (les 22 régions + faritany historiques → 6 provinces) ---
const MG_PROVINCES = ['Antananarivo', 'Antsiranana', 'Fianarantsoa', 'Mahajanga', 'Toamasina', 'Toliara'];
const MG_REGION_TO_PROV = {
  // Antananarivo
  analamanga: 'Antananarivo', bongolava: 'Antananarivo', itasy: 'Antananarivo', vakinankaratra: 'Antananarivo',
  // Antsiranana
  diana: 'Antsiranana', sava: 'Antsiranana',
  // Fianarantsoa
  'amoroni mania': 'Fianarantsoa', "amoron'i mania": 'Fianarantsoa', 'atsimo atsinanana': 'Fianarantsoa',
  'haute matsiatra': 'Fianarantsoa', ihorombe: 'Fianarantsoa', vatovavy: 'Fianarantsoa', fitovinany: 'Fianarantsoa', 'vatovavy fitovinany': 'Fianarantsoa',
  // Mahajanga
  betsiboka: 'Mahajanga', boeny: 'Mahajanga', melaky: 'Mahajanga', sofia: 'Mahajanga',
  // Toamasina
  'alaotra mangoro': 'Toamasina', analanjirofo: 'Toamasina', atsinanana: 'Toamasina',
  // Toliara
  androy: 'Toliara', anosy: 'Toliara', 'atsimo andrefana': 'Toliara', menabe: 'Toliara',
};
// Normalise un nom de région/ville Cloudflare vers l'une des 6 provinces malgaches
function mgProvince(raw) {
  const s = (raw || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+province$/, '').replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!s) return '';
  for (const p of MG_PROVINCES) if (s.includes(p.toLowerCase())) return p;
  if (MG_REGION_TO_PROV[s]) return MG_REGION_TO_PROV[s];
  for (const [k, v] of Object.entries(MG_REGION_TO_PROV)) if (s.includes(k)) return v;
  // Quelques grandes villes → province
  if (/antananarivo|tana|antsirabe/.test(s)) return 'Antananarivo';
  if (/antsiranana|diego|nosy be/.test(s)) return 'Antsiranana';
  if (/fianarantsoa|manakara|farafangana/.test(s)) return 'Fianarantsoa';
  if (/mahajanga|majunga/.test(s)) return 'Mahajanga';
  if (/toamasina|tamatave/.test(s)) return 'Toamasina';
  if (/toliara|tulear|fort dauphin|taolagnaro/.test(s)) return 'Toliara';
  return '';
}

// --- Géolocalisation IP → province (fallback quand Cloudflare n'envoie pas la région) ---
// Source HTTPS sans clé (ipwho.is), résultat mis en cache par IP HACHÉE (RGPD : l'IP n'est jamais stockée en clair).
const GEO_ON = (process.env.GEO_IP || '1') !== '0';   // désactivable via GEO_IP=0
const _geoMem = new Map();                              // hash IP -> province (cache mémoire)
let _geoMin = { t: 0, n: 0 };                           // throttle simple : 30 appels/min max
function ipHash(ipStr) { return createHash('sha256').update('mggeo:' + ipStr).digest('hex').slice(0, 24); }
async function geoProvince(ipStr) {
  if (!GEO_ON) return '';
  ipStr = (ipStr || '').trim();
  if (!ipStr || ipStr === '::1' || ipStr.startsWith('127.') || ipStr.startsWith('10.') || ipStr.startsWith('192.168.') || ipStr.startsWith('::ffff:127')) return '';
  const k = ipHash(ipStr);
  if (_geoMem.has(k)) return _geoMem.get(k);
  try { const row = db.prepare('SELECT region FROM ip_region WHERE k=?').get(k); if (row) { _geoMem.set(k, row.region || ''); return row.region || ''; } } catch {}
  const now = Date.now();
  if (now - _geoMin.t > 60000) _geoMin = { t: now, n: 0 };
  if (_geoMin.n >= 30) return '';                        // quota minute atteint → on réessaiera au prochain passage
  _geoMin.n++;
  let prov = '';
  try {
    const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 2500);
    const r = await fetch('https://freeipapi.com/api/json/' + encodeURIComponent(ipStr), { signal: ctrl.signal, headers: { 'Accept': 'application/json' } });
    clearTimeout(to);
    const d = await r.json().catch(() => ({}));
    if (d && (d.countryCode === 'MG')) prov = mgProvince(d.regionName || d.cityName || '');
    try { db.prepare('INSERT INTO ip_region(k,region,ts) VALUES(?,?,?) ON CONFLICT(k) DO UPDATE SET region=excluded.region,ts=excluded.ts').run(k, prov, new Date().toISOString()); } catch {}
    _geoMem.set(k, prov);
  } catch { /* réseau indisponible → on laissera vide, réessai au prochain passage non mis en cache */ }
  return prov;
}

// --- Suivi des visites (agrégé par jour + pays + province MG, sans donnée personnelle) ---
const VISIT_PAGES = new Set(['/', '/programme', '/emploi', '/apercu', '/decouverte', '/mentions-legales', '/inscription', '/connexion']);
async function trackVisit(req, p) {
  try {
    if (!VISIT_PAGES.has(p)) return;
    const jour = new Date().toISOString().slice(0, 10);
    const pays = (((fromProxy(req) && req.headers['x-orig-country']) || req.headers['cf-ipcountry'] || 'XX')).toString().toUpperCase().slice(0, 2);
    let region = '';
    if (pays === 'MG') {
      const raw = (fromProxy(req) && req.headers['x-orig-region']) || req.headers['cf-region'] || req.headers['x-orig-city'] || req.headers['cf-ipcity'] || '';
      region = mgProvince(raw);
      if (!region) region = await geoProvince(ip(req));   // fallback géoloc IP (autonome, sans Cloudflare)
    }
    db.prepare('INSERT INTO visites(jour,pays,region,n) VALUES(?,?,?,1) ON CONFLICT(jour,pays,region) DO UPDATE SET n=n+1').run(jour, pays, region);
  } catch {}
}
// Totaux de visites (réutilisés en page d'accueil + admin)
function visitesTotaux() {
  const _jour = new Date().toISOString().slice(0, 10);
  const _j7 = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
  const vTot = db.prepare('SELECT COALESCE(SUM(n),0) AS t FROM visites').get().t;
  const vToday = db.prepare('SELECT COALESCE(SUM(n),0) AS t FROM visites WHERE jour=?').get(_jour).t;
  const v7 = db.prepare('SELECT COALESCE(SUM(n),0) AS t FROM visites WHERE jour>=?').get(_j7).t;
  return { vTot, vToday, v7 };
}
// Carte publique « Visites du site » (page d'accueil, visible par tous)
function visitesPublicCard() {
  const { vTot, vToday, v7 } = visitesTotaux();
  // Détail par province (provinces localisées uniquement — on n'affiche pas le bucket « non détectée » au public)
  const vMG = db.prepare("SELECT region, SUM(n) AS t FROM visites WHERE pays='MG' AND region<>'' GROUP BY region ORDER BY t DESC").all();
  const shown = vMG.reduce((s, r) => s + r.t, 0);
  const prov = vMG.length
    ? `<h3 style="margin-bottom:6px">🇲🇬 Nos visiteurs à Madagascar — par province</h3><div class="tbl"><table><tr><th>Province</th><th>Visites</th><th>Part</th></tr>
   ${vMG.map(r => `<tr><td>📍 ${esc(r.region)}</td><td>${r.t}</td><td>${shown ? Math.round(r.t * 100 / shown) : 0} %</td></tr>`).join('')}</table></div>`
    : `<h3 style="margin-bottom:6px">🇲🇬 Nos visiteurs à Madagascar — par province</h3><p class="muted" style="font-size:13px">📍 Localisation des visiteurs en cours de collecte…</p>`;
  return `<section class="card"><h2>📊 Visites du site</h2>
  <div class="stats"><div class="stat"><b>${vTot}</b><span>visites totales</span></div><div class="stat"><b>${vToday}</b><span>aujourd'hui</span></div><div class="stat"><b>${v7}</b><span>7 derniers jours</span></div></div>
  ${prov}
  <p class="muted" style="font-size:12px">Comptage interne, sans cookie de pistage (RGPD). Localisation approximative (zone Cloudflare / géolocalisation IP).</p></section>`;
}

// --- Progression carrière (niveau calculé côté serveur, autoritatif) ---
const NIVEAUX = ['Recrue', 'Collaborateur', 'Collaborateur confirmé', 'Réviseur', 'Chef de mission'];
function computeNiveau(d) {
  d = d || {};
  const P = d.prog || {}, EX = d.exo || {}, SI = d.sim || {}, TV = d.tva || {}, AU = d.audit || {};
  const exoN = Object.values(EX).filter(Boolean).length;
  const fac = (SI.d1 || 0) >= 6;
  const tvaN = Object.values(TV).filter(Boolean).length;
  const rev = !!AU.a2, chef = !!AU.a1;
  const qz = P.quiz || {}, fin = qz.final, cert = !!(fin && fin.total && fin.score / fin.total >= 0.7);
  let lvl = 0; if (exoN >= 4 || fac) lvl = 1; if (lvl >= 1 && fac && tvaN >= 1) lvl = 2; if (lvl >= 2 && rev) lvl = 3; if (lvl >= 3 && chef && cert) lvl = 4;
  const badges = [exoN >= 4, fac, tvaN >= 1, rev, chef, cert].filter(Boolean).length;
  const lessons = Object.keys(P.done || {}).length;
  return { lvl, badges, lessons };
}
function postProgression(req, res, sess, body) {
  let d = {}; try { d = JSON.parse(body.prog || '{}'); } catch { }
  const n = computeNiveau(d);
  try {
    db.prepare('INSERT INTO progression(user_id,niveau,niveau_nom,badges,lessons,maj_le) VALUES(?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET niveau=excluded.niveau,niveau_nom=excluded.niveau_nom,badges=excluded.badges,lessons=excluded.lessons,maj_le=excluded.maj_le')
      .run(sess.user.id, n.lvl, NIVEAUX[n.lvl] || 'Recrue', n.badges, n.lessons, new Date().toISOString());
  } catch { }
  res.writeHead(204); res.end();
}
function send(res, status, html, opts = {}) {
  securityHeaders(res, { prod: PROD, quizCSP: !!opts.quiz, courseCSP: !!opts.course });
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', ...(opts.headers || {}) });
  res.end(html);
}
function redirect(res, loc, cookies = []) {
  securityHeaders(res, { prod: PROD });
  const h = { Location: loc }; if (cookies.length) h['Set-Cookie'] = cookies;
  res.writeHead(303, h); res.end();
}
function readBody(req) {
  return new Promise((resolve) => {
    let d = ''; let tooBig = false;
    req.on('data', c => { d += c; if (d.length > 1e6) { tooBig = true; req.destroy(); } });
    req.on('end', () => resolve(tooBig ? {} : Object.fromEntries(new URLSearchParams(d))));
    req.on('error', () => resolve({}));
  });
}
function getSession(req) {
  const c = parseCookies(req);
  const sid = c.sid ? unsignSid(c.sid) : null;
  if (!sid) return null;
  const s = db.prepare('SELECT * FROM sessions WHERE id=?').get(sid);
  if (!s || new Date(s.expire_le) < new Date()) return null;
  const user = s.user_id ? db.prepare('SELECT * FROM users WHERE id=?').get(s.user_id) : null;
  return { sid, row: s, user };
}
function newSession(userId, pending2fa, req) {
  const sid = rid(24), csrf = rid(16);
  const exp = new Date(Date.now() + 8 * 3600 * 1000).toISOString();
  db.prepare('INSERT INTO sessions(id,user_id,csrf,pending_2fa,cree_le,expire_le,ip,ua) VALUES(?,?,?,?,?,?,?,?)')
    .run(sid, userId || null, csrf, pending2fa ? 1 : 0, new Date().toISOString(), exp, ip(req), (req.headers['user-agent'] || '').slice(0, 200));
  return sid;
}
const cookieOpts = { maxAge: 8 * 3600, secure: PROD };
const checkCsrf = (sess, body) => sess && body._csrf && safeEqual(sess.row.csrf, body._csrf);

// --- Promo de lancement (annonce « bientôt gratuit ») ---
function promoActive() { const p = cfg.promo; if (!p || !p.actif) return false; if (p.jusqu_au) { try { return new Date().toISOString().slice(0, 10) <= p.jusqu_au; } catch { return true; } } return true; }
function promoLive() { const p = cfg.promo; if (!promoActive() || !p || !p.acces_libre) return false; if (p.debut_libre) { const d = Date.parse(p.debut_libre); if (!isNaN(d) && Date.now() < d) return false; } return true; }
function promoAccesLibre() { return promoLive(); }
function promoLabel() { return (cfg.promo && cfg.promo.label) || (promoLive() ? '🎁 GRATUIT 3 mois' : '🎁 Bientôt gratuit'); }
// Date de fin de promo formatée FR (depuis la config) — évite toute date codée en dur dans le HTML.
function fmtDateFR(iso) { const s = (iso || '').slice(0, 10); return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s.split('-').reverse().join('/') : ''; }
function promoFinFR() { return fmtDateFR(cfg.promo && cfg.promo.jusqu_au); }
// Prix mini d'un module à l'unité (dérivé des offres, jamais codé en dur).
function prixMiniModule() { const ps = (cfg.offres || []).filter(o => Array.isArray(o.modules) && o.modules.length === 1 && o.code !== 'PROMO_PACK' && o.prix > 0).map(o => o.prix); return ps.length ? Math.min(...ps) : 30000; }
function presentielPrixModule() { return (cfg.presentiel && cfg.presentiel.prix_module) || 80000; }
function visioPrix() { const o = (cfg.offres || []).find(o => o.code === 'VISIO_1H'); return (o && o.prix) || 25000; }
function joursRestantsPromo() { const j = cfg.promo && cfg.promo.jusqu_au; if (!j) return null; const ms = Date.parse(j + 'T23:59:59Z') - Date.now(); return ms > 0 ? Math.ceil(ms / 86400000) : 0; }
function promoBanText() {
  const p = cfg.promo || {};
  if (promoLive()) { const n = joursRestantsPromo(); return (p.banniere_live || p.banniere || '') + (n != null ? ' ⏳ Plus que ' + n + ' jour' + (n > 1 ? 's' : '') + ' !' : ''); }
  return p.banniere || '';
}
function promoBadgeHtml(prix) { const ref = (prix != null && prix !== '') ? `<s style="opacity:.6;font-weight:600;margin-right:5px">${esc(money(prix))}</s>` : ''; return `${ref}<b class="gratuit">${esc(promoLabel())}</b>`; }
function prixAffiche(prix) { return promoActive() ? promoBadgeHtml(prix) : money(prix); }

// --- Gabarit ---
function layout(title, body, sess) {
  const u = sess?.user;
  const soc = cfg.societe || {};
  const rcs = soc.immat || [soc.rcs_numero ? ('RCS ' + soc.rcs_numero) : '', soc.rcs || ''].filter(Boolean).join(' · ');
  const wa = (soc.whatsapp || '').replace(/\D/g, '');
  const waBtn = wa ? `<a class="wa" href="https://wa.me/${wa}?text=${encodeURIComponent('Bonjour, je souhaite des informations sur la formation en comptabilité française externalisée.')}" target="_blank" rel="noopener" title="Contact WhatsApp" aria-label="WhatsApp"><svg viewBox="0 0 24 24" width="30" height="30" fill="#fff" aria-hidden="true"><path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02zm-7.01 15.22h-.004a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z"/></svg></a>` : '';
  const nav = u
    ? `<a href="/programme">Programme</a><a href="/presentiel">Présentiel</a><a href="/emploi">Emploi</a><a href="/communaute">Communauté</a><a href="/cabinet">🏢 Cabinet</a><a href="/logiciel">🧪 Logiciel</a><a href="/tableau-de-bord">Mon espace</a>${u.role === 'admin' ? '<a href="/formation">Formation</a><a href="/admin">Admin</a>' : ''}<a href="/deconnexion">Déconnexion</a>`
    : `<a href="/programme">Programme</a><a href="/presentiel">Présentiel</a><a href="/emploi">Emploi</a><a href="/connexion">Connexion</a><a class="cta" href="/inscription">S'inscrire</a>`;
  const desc = 'Plateforme de formation en ligne pour futurs collaborateurs, réviseurs et superviseurs externalisés en comptabilité française, partout à Madagascar — Antananarivo, Tamatave, Antsirabe, Majunga. Cours, quiz, cas pratiques, certification.';
  const og = `${BASE_URL}/public/og-image.png`;
  const backBtn = (title === 'Accueil') ? '' : `<div class="backbar"><a class="btn ghost small" href="/" onclick="if(history.length>1){history.back();return false;}">← Retour</a> <a class="btn ghost small" href="/">🏠 Accueil</a></div>`;
  const promoBan = promoActive() ? `<div style="background:linear-gradient(90deg,#E8A13A,#f6c172);color:#3a2600;text-align:center;padding:8px 14px;font-weight:700;font-size:13.5px;line-height:1.45">${esc(promoBanText())}${u ? '' : ' <a href="/inscription" style="color:#16307a;font-weight:800;text-decoration:underline">S\'inscrire →</a>'}</div>` : '';
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} — ${esc(cfg.site.nom_plateforme)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#1F4E78">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(cfg.site.nom_plateforme)}">
<meta property="og:title" content="${esc(cfg.site.nom_plateforme)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(BASE_URL)}/">
<meta property="og:image" content="${esc(og)}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(cfg.site.nom_plateforme)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(og)}">
<link rel="icon" href="/public/favicon.png">
<link rel="apple-touch-icon" href="/public/icon-512.png">
<link rel="manifest" href="/public/manifest.webmanifest">
<link rel="stylesheet" href="/public/app.css?v=${ASSET_V}"></head>
<body><div class="topbar"><header class="top"><a class="brand" href="/">${esc(cfg.site.nom_plateforme)}</a><nav>${nav}</nav></header>${promoBan}
${(sess && sess.user) ? '' : `<div class="ticker"><div class="ticker-track"><span>🎁 Inscription 100&nbsp;% GRATUITE — créez votre compte dès aujourd'hui&nbsp;&nbsp;·&nbsp;&nbsp;🎓 Tous les modules + attestation de fin de formation à la clé&nbsp;&nbsp;·&nbsp;&nbsp;🎥 Terminez tous les modules puis passez le test final en VISIO (Google&nbsp;Meet) avec le formateur — attestation signée et tamponnée&nbsp;&nbsp;·&nbsp;&nbsp;${promoLive() ? '🎁 TOUS les modules GRATUITS jusqu’au ' + promoFinFR() : '🎁 Module&nbsp;1 100&nbsp;% gratuit'}&nbsp;&nbsp;·&nbsp;&nbsp;</span><span>🎁 Inscription 100&nbsp;% GRATUITE — créez votre compte dès aujourd'hui&nbsp;&nbsp;·&nbsp;&nbsp;🎓 Tous les modules + attestation de fin de formation à la clé&nbsp;&nbsp;·&nbsp;&nbsp;🎥 Terminez tous les modules puis passez le test final en VISIO (Google&nbsp;Meet) avec le formateur — attestation signée et tamponnée&nbsp;&nbsp;·&nbsp;&nbsp;${promoLive() ? '🎁 TOUS les modules GRATUITS jusqu’au ' + promoFinFR() : '🎁 Module&nbsp;1 100&nbsp;% gratuit'}&nbsp;&nbsp;·&nbsp;&nbsp;</span></div></div>`}
</div><main class="wrap">${backBtn}${body}</main>
${waBtn}<footer class="foot">${soc.nom ? `<b>${esc(soc.nom)}</b>${rcs ? ' — ' + esc(rcs) : ''}<br>Attestations de fin de formation délivrées par ${esc(soc.nom)}. ` : ''}Plateforme sécurisée — RGPD / secret professionnel. © 2026 · <a href="/mentions-legales">Mentions légales</a></footer>
<script src="/public/chat.js?v=${ASSET_V}" data-wa="${esc(wa)}" data-promo="${promoLive() ? '1' : ''}" defer></script></body></html>`;
}
const csrfField = sess => `<input type="hidden" name="_csrf" value="${esc(sess.row.csrf)}">`;
const money = n => Number(n).toLocaleString('fr-FR') + ' ' + esc(cfg.site.devise);
const waDigits = ((cfg.societe && cfg.societe.whatsapp) || '').replace(/\D/g, '');
const waLink = (t) => `https://wa.me/${waDigits}?text=${encodeURIComponent(t || 'Bonjour, je vous contacte au sujet de la formation.')}`;
const initiales = nom => (nom || '').split(/\s+/).filter(w => w && !w.endsWith('.')).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
function formateurCard() {
  const f = cfg.formateur; if (!f) return '';
  const pts = (f.points || []).map(p => `<li>${esc(p)}</li>`).join('');
  const photoFs = f.photo ? path.join(DIR, f.photo.replace(/^\//, '')) : null;
  const hasPhoto = photoFs && fs.existsSync(photoFs);
  const avatar = hasPhoto
    ? `<img class="favatar fphoto" src="${esc(f.photo)}" alt="${esc(f.nom)}" width="74" height="74">`
    : `<div class="favatar">${esc(initiales(f.nom))}</div>`;
  return `<section class="card formateur"><h2>Votre formateur</h2>
  <div class="fbody">${avatar}
  <div class="fmeta"><div class="fname">${esc(f.nom)}</div><div class="ftitre">${esc(f.titre || '')}</div>
  <p class="fexp">${esc(f.experience || '')}</p><ul>${pts}</ul></div></div></section>`;
}

// --- Pages ---
// Aperçu du programme : une carte par module avec son résumé + thèmes + lien aperçu
function apercuModulesSection() {
  const prixMod = (code) => { const o = (cfg.offres || []).find(x => Array.isArray(x.modules) && x.modules.length === 1 && x.modules[0] === code); return o ? money(o.prix) : ''; };
  const prixModRaw = (code) => { const o = (cfg.offres || []).find(x => Array.isArray(x.modules) && x.modules.length === 1 && x.modules[0] === code); return o ? o.prix : null; };
  const rows = MODULES.map(m => {
    const inf = moduleInfo(m.code) || {};
    const topics = (inf.topics || []).map(t => `<li>${esc(t)}</li>`).join('');
    const badge = m.gratuit ? '<b class="gratuit">Gratuit</b>' : (promoActive() ? promoBadgeHtml(prixModRaw(m.code)) : `<b class="tarif">${esc(prixMod(m.code))}</b>`);
    const cta = m.gratuit ? `<a class="btn" href="/apercu?m=${esc(m.code)}">Lire le Module 1 (inscription gratuite)</a>` : `<a class="btn ghost" href="/apercu?m=${esc(m.code)}">Voir l'aperçu détaillé →</a>`;
    return `<details class="macc"><summary class="pitem"><span>✅ ${esc(m.titre)}<br><span style="display:inline-block;margin-top:3px;font-size:11.5px;font-weight:700;color:#1e7d46;background:#e9f7ef;border:1px solid #bfe6cd;border-radius:20px;padding:1px 9px">${({mod2:"🎥 100 % pratique sur <b>Pennylane</b> — le logiciel phare des cabinets français (vidéos pas à pas)",mod6:"🛠️ 100 % pratique · cas pratiques corrigés, <b>simulateurs d'entretien</b> et évaluation certifiante"})[m.code]||"🛠️ 100 % pratique · <b>simulateur intégré</b> (interface type logiciel, inspirée de Pennylane)"}</span></span>${badge}</summary><div class="macc-body"><p>${esc(inf.resume || '')}</p><ul>${topics}</ul>${cta}</div></details>`;
  }).join('');
  return `<section class="card"><h2 style="text-align:center;color:#fff;margin-top:0">Le programme — <span style="color:var(--navy2)">cliquez un module</span> pour voir le détail</h2><p style="text-align:center;color:#d7e3ee;margin:0 0 14px;font-size:14px">Formation <b style="color:#fff">100 % pratique</b> : chaque module s'appuie sur des <b style="color:#fff">simulateurs interactifs façon logiciel comptable</b> (interface inspirée de Pennylane, recolorée), des <b style="color:#fff">CERFA réels</b> et des écritures à compléter.</p><div class="prog">${rows}</div></section>`;
}
function pageAccueil(sess) {
  const offres = db.prepare("SELECT * FROM offres WHERE code != 'PROMO_PACK'").all();
  const lsoc = cfg.societe || {};
  const ld = JSON.stringify({ "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "name": lsoc.nom || "MG CONSULTING IT&ACT", "url": BASE_URL, "logo": BASE_URL + "/public/logo.jpg", "areaServed": [{ "@type": "Country", "name": "Madagascar" }, { "@type": "City", "name": "Antananarivo" }, { "@type": "City", "name": "Tamatave (Toamasina)" }, { "@type": "City", "name": "Antsirabe" }, { "@type": "City", "name": "Majunga (Mahajanga)" }] },
    { "@type": "Course", "name": "Formation en comptabilité française externalisée — Académie Compta FR", "description": "Formation en ligne pour devenir collaborateur, réviseur ou superviseur comptable externalisé pour des cabinets français, depuis Madagascar. 6 modules, logiciel Pennylane, TVA, liasse fiscale, simulateurs et certification. Module 1 gratuit.", "inLanguage": "fr", "provider": { "@type": "Organization", "name": lsoc.nom || "MG CONSULTING IT&ACT", "url": BASE_URL } }
  ] }).replace(/</g, '\\u003c');
  return layout('Accueil', `<script type="application/ld+json">${ld}</script>
  ${(function () { const b = annonceAccueil(); return b ? `<div style="background:linear-gradient(135deg,rgba(232,161,58,.16),rgba(22,48,122,.10));border:1px solid var(--accent);border-radius:12px;padding:14px 20px;margin:0 0 18px;display:flex;gap:12px;align-items:center"><span style="font-size:22px;line-height:1">📣</span><p style="margin:0;white-space:pre-wrap;font-weight:600;font-size:15.5px;line-height:1.5">${esc(b.message)}</p></div>` : ''; })()}
  <section class="hero"><h1>Formation en comptabilité française externalisée</h1>
  <p class="lead">Plateforme de formation en ligne pour <b>futurs collaborateurs, réviseurs et superviseurs</b> externalisés en <b>comptabilité française</b>. Cours, quiz, cas pratiques, suivi et certification. <b>Passez les étapes d'évaluation et obtenez votre attestation de fin de formation.</b></p>
  <img class="illus" src="/public/photos/hero.png" alt="Cabinet comptable externalisé — expertise, fiabilité, performance" width="1672" height="941" loading="lazy">
  <p><a class="btn" href="/inscription">Créer mon compte</a> <a class="btn ghost" href="/programme">Voir le programme (gratuit)</a> <a class="btn ghost" href="/decouverte">▶ Visite guidée (1 min)</a></p>
  ${fiscaliteBadge()}</section>
  ${visitesPublicCard()}
  ${formateurCard()}
  <section class="card"><h2>Conditions d'accès</h2>
  <ul><li><b>Diplôme requis :</b> ${esc(cfg.conditions.diplome_requis)}.</li>
  <li>Attestation sur l'honneur du diplôme à l'inscription.</li>
  <li>Engagement de confidentialité (RGPD / secret professionnel).</li>
  <li>🔐 <b>Connexion sécurisée</b> par email et mot de passe.</li></ul></section>
  ${apercuModulesSection()}
  <section class="card" style="border-left:4px solid var(--accent)"><h2>🏫 Aussi en présentiel à Antananarivo (renforcement)</h2>
  <p>En complément de la formation en ligne : séances <b>en présentiel dans nos bureaux</b> (Antananarivo), <b>petit groupe (4 pers. max)</b>, sur <b>Pennylane</b>, <b>Silae</b> &amp; <b>Sage 50</b> — de la saisie à la préparation du bilan. <b>2 h/jour</b> (lun.–ven.) · <b>${money(presentielPrixModule())}/module</b>.</p>
  <p><a class="btn" href="/presentiel">Découvrir le présentiel</a> <a class="btn ghost" href="tel:0327362259">📞 032 73 622 59</a></p></section>
  ${promoLive() ? `<section class="card" style="border-left:4px solid var(--accent)"><h2>🎁 Tout est GRATUIT pendant 3 mois</h2>
  <p class="lead">Accès complet et gratuit à <b>toute la formation</b> (les 6 modules) jusqu’au <b>${promoFinFR()}</b> — sans aucun paiement.</p>
  <ol style="line-height:1.9;margin:8px 0 12px">
  <li><b>Inscrivez-vous gratuitement</b> (2 min).</li>
  <li><b>Suivez les 6 modules</b> : Pennylane, TVA, liasse, simulateurs… de la saisie au bilan des PME françaises.</li>
  <li><b>Passez l'évaluation</b> et obtenez votre <b>attestation de fin de formation</b>.</li>
  </ol>
  <p><a class="btn" href="/inscription">Créer mon compte gratuit →</a> <a class="btn ghost" href="/apercu?m=mod1">Découvrir le Module 1</a></p></section>` : `<section class="card"><h2>Nos offres</h2><div class="grid">${offres.map(o => `<div class="offre"><h3>${esc(o.titre)}</h3><p class="prix">${prixAffiche(o.prix)}</p></div>`).join('')}</div>
  <p class="muted">Paiement par <b>Orange Money</b> ou carte. Inscrivez-vous pour choisir vos modules.</p></section>`}`, sess);
}

// Visite guidée (1 minute) — montrée à tout nouvel inscrit : tout l'accès en un coup d'œil
function pageDecouverte(sess) {
  let v = (cfg.video_decouverte || '').trim();
  if (!v && fs.existsSync(path.join(DIR, 'public', 'decouverte.mp4'))) v = '/public/decouverte.mp4';
  const a = cfg.acces || {};
  const duree = a.illimite ? 'illimité' : `${a.duree_jours || 365} jours (12 mois)`;
  const videoBloc = v
    ? `<div class="card"><video controls width="100%" style="border-radius:10px" src="${esc(v)}" poster="/public/icon-512.png"></video><p class="muted">Vidéo de présentation (≈ 1 min).</p></div>`
    : `<div class="card" style="text-align:center;background:#0f2233;color:#d7e3ee"><div style="font-size:46px">▶</div><p><b>Visite guidée — 1 minute</b></p><p class="muted" style="color:#aac0d4">La vidéo de présentation sera ajoutée ici. En attendant, voici tout ce que vous avez débloqué :</p></div>`;
  const steps = MODULES.map((m, i) => {
    const inf = moduleInfo(m.code) || {};
    return `<div class="row2"><span><b>Étape ${i + 1} — ${esc(m.titre)}</b><br><span class="muted">${esc(inf.resume || '')}</span></span>${m.gratuit ? '<b class="gratuit">Gratuit</b>' : '<b class="lock">Inclus</b>'}</div>`;
  }).join('');
  return layout('Visite guidée', `
  <section class="hero"><h1>Bienvenue ! 🎉</h1>
  <p class="lead">En 1 minute, découvrez <b>tout l'accès</b> de votre formation.</p></section>
  <img class="illus" src="/public/photos/programme.png" alt="Formation en comptabilité française — votre parcours" width="1536" height="1024" loading="lazy">
  ${videoBloc}
  <section class="card"><h2>Votre parcours en 4 étapes</h2><div class="prog">${steps}</div></section>
  <section class="card"><h2>Ce qui est inclus</h2>
  <ul><li>📚 <b>6 modules</b>, dont le <b>Module 1 gratuit</b> tout de suite${promoLive() ? ' — et TOUS les modules gratuits pendant la promo' : ' (à partir de ' + money(prixMiniModule()) + ' / module)'}</li>
  <li>🧮 Logiciel <b>Pennylane</b> : déclarer la TVA, rapprochement, immobilisations, cadrage, intracom/intercos — pas à pas avec exemples</li>
  <li>📝 <b>100+ questions de quiz</b>, <b>10 cas pratiques</b> corrigés, <b>évaluation finale</b> (/100)</li>
  <li>🎤 <b>Simulations d'entretien</b> (collaborateur, réviseur, chef de mission, superviseur)</li>
  <li>🏅 <b>Attestation</b> de fin de formation · 💬 <b>demande de rendez-vous</b> intégrée</li>
  <li>⏱️ Accès : <b>${esc(duree)}</b> · 1 appareil · contenu protégé (filigrane personnalisé)</li></ul></section>
  <section class="card"><h2>On commence ?</h2>
  <p><a class="btn" href="/apercu?m=mod1">Lire le Module 1 (inscription gratuite)</a> <a class="btn ghost" href="/tableau-de-bord">Mon espace</a></p></section>`, sess);
}

function pageMentions(sess) {
  const s = cfg.societe || {};
  const row = (k, v) => v ? `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>` : '';
  return layout('Mentions légales', `<h1>Mentions légales</h1>
  <section class="card"><h2>Éditeur</h2><div class="tbl"><table>
  ${row('Dénomination sociale', s.denomination || s.nom)}
  ${row('Sigle', s.sigle)}
  ${row('Forme juridique', s.forme)}
  ${row('Capital social', s.capital)}
  ${row('Immatriculation', s.immat)}
  ${row("Date d'immatriculation", s.date_immat)}
  ${row('Registre', s.rcs)}
  ${row('Siège social', s.siege)}
  ${row('Activité', s.activite)}
  ${row('Gérant', s.gerant)}
  ${row('Co-gérant', s.cogerant)}
  ${row('Téléphone', s.telephone)}
  ${row('Email', s.email)}
  </table></div></section>
  <section class="card"><h2>Hébergement</h2><p class="muted">[À compléter : nom et adresse de l'hébergeur du site une fois la mise en ligne effectuée.]</p></section>
  <section class="card"><h2>Données personnelles (RGPD) & secret professionnel</h2>
  <p>Les données des apprenants (identité, contact, niveau d'études, paiements) sont collectées uniquement pour la gestion de la formation et de la certification, conservées de manière sécurisée et non communiquées à des tiers non autorisés. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression en contactant <b>${esc(s.nom)}</b>${s.telephone ? ' (' + esc(s.telephone) + ')' : ''}.</p>
  <p>Le formateur et l'équipe sont tenus au secret professionnel sur toute donnée traitée.</p></section>
  <section class="card"><h2>Conditions d'utilisation & propriété intellectuelle</h2>
  <p>L'ensemble des contenus (cours, vidéos, supports, quiz, <b>simulateurs interactifs</b>) est la <b>propriété exclusive</b> de <b>${esc(s.nom)}</b> et protégé par le droit d'auteur.</p>
  <ul>
  <li>L'accès est <b>strictement personnel et nominatif</b> : une seule personne, un seul appareil actif à la fois.</li>
  <li>Sont <b>interdits</b> : la reproduction, la copie, la capture, le téléchargement, la diffusion, le partage de compte ou d'identifiants, la revente ou la mise à disposition de tout ou partie du contenu.</li>
  <li>Les pages de cours sont <b>filigranées</b> (email de l'apprenant) : toute fuite est <b>traçable</b>.</li>
  <li>Tout manquement entraîne la <b>révocation immédiate de l'accès</b>, sans remboursement, et peut donner lieu à des poursuites.</li>
  </ul>
  <p class="muted">En créant un compte, l'apprenant accepte ces conditions d'utilisation.</p></section>
  <section class="card"><h2>Attestation</h2><p>Les attestations de fin de formation sont délivrées par <b>${esc(s.nom)}</b> (${esc(s.immat || '')}). Attestations internes, sans valeur de diplôme d'État.</p></section>
  <p><a class="btn ghost" href="/">← Accueil</a></p>`, sess);
}

function pagePresentiel(sess) {
  const tel = '032 73 622 59';
  const telLink = 'tel:0327362259';
  const wa = '261327362259';
  const waLink = 'https://wa.me/' + wa + '?text=' + encodeURIComponent('Bonjour, je suis intéressé(e) par la formation en présentiel (renforcement) en comptabilité française. Pouvez-vous me donner les prochaines dates ?');
  const mod = (color, bg, num, titre, points) => `<section class="card" style="border-left:5px solid ${color};background:${bg}">
    <h2 style="color:${color};margin-top:0">MODULE ${num} — ${titre}</h2>
    <ul style="line-height:1.7;margin:0">${points.map(p => `<li>${p}</li>`).join('')}</ul></section>`;
  return layout('Présentiel', `
  <section class="hero"><h1>Formation en présentiel — Comptabilité française</h1>
  <p class="lead"><b>De la saisie à la préparation du bilan.</b> Traitement externalisé avec les cabinets comptables français.</p>
  <p>Vous suivez la formation en ligne et vous voulez <b>renforcer votre pratique</b> ? Profitez de séances <b>en présentiel dans nos bureaux à Antananarivo</b>, en <b>petit groupe (4 personnes max)</b>, sur les logiciels réellement utilisés en cabinet.</p>
  <p><a class="btn" href="${telLink}">📞 ${tel}</a> <a class="btn ghost" href="${waLink}" target="_blank" rel="noopener">💬 WhatsApp</a></p></section>

  ${mod('#d9822b', 'rgba(232,161,58,.08)', '1', 'SAISIE &amp; TRAVAUX JOURNALIERS', [
    'Saisie des achats, ventes, banques',
    'Rapprochement bancaire et suivi de trésorerie',
    'Lettrage et justification des comptes clients et fournisseurs',
    'Préparation des déclarations de TVA (CA12, CA3)',
    'Simulation et intégration des écritures de paie via <b>Sage 50</b>'])}

  ${mod('#5a8f3c', 'rgba(106,168,79,.08)', '2', 'TRAVAUX PÉRIODIQUES &amp; FISCAUX', [
    'Révision des comptes (FNP, CCA, FAE, PCA)',
    'Déclaration de résultats et TVA',
    'Tableaux de bord et reporting périodiques',
    'Déclarations fiscales : IS, CFE, CVAE, etc.'])}

  ${mod('#c0392b', 'rgba(192,57,43,.07)', '3', 'PRÉPARATION &amp; FINALISATION DU BILAN', [
    'Préparation du bilan et du compte de résultat',
    'Calcul et validation des provisions',
    'Justification des comptes et contrôle des soldes',
    'Élaboration de la liasse fiscale et échanges avec le CAC'])}

  <section class="card" style="text-align:center">
  <h2>🖥️ Pratique sur les logiciels du métier</h2>
  <p style="font-size:17px"><b>Pratique sur</b> <span style="color:#1F4E78;font-weight:800">Pennylane</span></p>
  <p><b>Intégration des écritures</b> sur <b style="color:#0a7">Silae</b> &amp; <b style="color:#5a8f3c">Sage 50</b></p>
  <p class="muted">Simulation via Silae &amp; Sage 50</p></section>

  <section class="card" style="border:1px solid var(--line)">
  <h2>📋 Infos pratiques</h2>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px">
    <div class="offre" style="text-align:center"><div style="font-size:24px">⏰</div><b>2 h / jour</b><div class="muted" style="font-size:13px">Lundi → Vendredi<br>8h30 – 10h30</div></div>
    <div class="offre" style="text-align:center"><div style="font-size:24px">💰</div><b>${money(presentielPrixModule())}</b><div class="muted" style="font-size:13px">par module</div></div>
    <div class="offre" style="text-align:center"><div style="font-size:24px">👥</div><b>4 personnes</b><div class="muted" style="font-size:13px">par module (petit groupe)</div></div>
    <div class="offre" style="text-align:center"><div style="font-size:24px">📍</div><b>Dans nos bureaux</b><div class="muted" style="font-size:13px">Ambobibao (Antananarivo), près de MCB Banque, à côté de la station Total</div></div>
  </div></section>

  <section class="card" style="text-align:center;border-left:4px solid var(--accent)">
  <h2>📞 Réserver votre place</h2>
  <p>Places limitées à <b>4 personnes par module</b>. Contactez-nous pour les prochaines dates :</p>
  <p style="font-size:22px;font-weight:800;letter-spacing:.5px"><a href="${telLink}" style="color:#16307a;text-decoration:none">${tel}</a></p>
  <p><a class="btn" href="${telLink}">📞 Appeler</a> <a class="btn ghost" href="${waLink}" target="_blank" rel="noopener">💬 WhatsApp</a></p>
  <p class="muted" style="font-size:12px">Formation complémentaire en présentiel à Antananarivo — en plus de votre formation en ligne.</p></section>
  `, sess);
}

function pageProgramme(sess) {
  const offres = db.prepare("SELECT * FROM offres WHERE code != 'PROMO_PACK'").all();
  const modulesSection = apercuModulesSection();
  const n = db.prepare("SELECT COUNT(*) c FROM users WHERE role='apprenant'").get().c + (cfg.compteur_base || 0);
  const compteur = (cfg.afficher_compteur_inscrits && n > 0 && sess && sess.user && sess.user.role === 'admin') ? `<div class="stat"><b>${n}</b><span>apprenant${n > 1 ? 's' : ''} inscrit${n > 1 ? 's' : ''} <em style="font-size:10px;opacity:.7">(admin)</em></span></div>` : '';
  const f = cfg.formateur || {};
  const fstats = (f.annees ? `<div class="stat"><b>${esc(String(f.annees))} ans</b><span>d'expérience</span></div>` : '') + (f.formes ? `<div class="stat"><b>${esc(String(f.formes))}+</b><span>personnes formées</span></div>` : '');
  const stats = `<div class="stats">${fstats}<div class="stat"><b>6</b><span>modules</span></div><div class="stat"><b>100+</b><span>questions de quiz</span></div><div class="stat"><b>10</b><span>cas pratiques</span></div><div class="stat"><b>✓</b><span>attestation</span></div>${compteur}</div>`;
  const temoins = cfg.temoignages || [];
  const tHtml = temoins.length ? `<section class="card"><h2>Ils témoignent</h2><div class="temoins">${temoins.map(t => `<div class="temoin"><p>« ${esc(t.texte)} »</p><div class="who">${esc(t.nom)}</div><div class="role">${esc(t.role)}</div></div>`).join('')}</div></section>` : '';
  return layout('Programme', `
  <section class="hero"><h1>Programme de la formation</h1>
  <p class="lead">Découvrez le contenu <b>gratuitement</b>. ${promoLive() ? '🎁 <b>Pendant la promo, TOUS les modules sont offerts</b> (jusqu’au ' + promoFinFR() + ') — inscrivez-vous gratuitement et accédez à tout.' : 'Seul le <b>Module 1</b> est offert en intégralité ; les modules 2 à 6 sont consultables en aperçu (objectifs).'}</p>
  <img class="illus" src="/public/photos/programme.png" alt="Formation en comptabilité française — PCG, écritures, clôture, fiscalité, cas pratiques" width="1536" height="1024" loading="lazy">
  <p><a class="btn" href="/apercu?m=mod1">Lire le Module 1 (inscription gratuite)</a> <a class="btn ghost" href="/inscription">S'inscrire</a></p>${stats}${fiscaliteBadge()}</section>
  ${formateurCard()}
  ${modulesSection}
  <section class="card"><h2>Inclus également</h2><ul><li>10 cas pratiques complets corrigés</li><li>Évaluation finale certifiante (/100)</li><li>Quiz interactifs et cas pratiques corrigés</li><li><b>Attestation de fin de formation</b> délivrée par <b>${esc((cfg.societe || {}).nom || '')}</b>${(cfg.societe || {}).rcs ? ` (${esc(cfg.societe.rcs)})` : ''}</li></ul></section>
  ${tHtml}
  <section class="card"><h2>💻 Une vraie plateforme e-learning (LMS)</h2>
  <p class="muted">Académie Compta FR est un <b>LMS complet</b> (Learning Management System), conçu selon les standards des outils e-learning du marché (type Teach Up, Didask…) :</p>
  <div class="grid">
    <div class="offre"><h3>🧩 Microlearning</h3><p class="muted">Des leçons courtes et progressives, organisées en 6 modules — on avance pas à pas.</p></div>
    <div class="offre"><h3>🛠️ Learning by doing</h3><p class="muted">Simulateurs, logiciel comptable intégré, CERFA réels : on apprend en FAISANT.</p></div>
    <div class="offre"><h3>📊 Suivi & badges</h3><p class="muted">Progression en temps réel, quiz auto-corrigés (corrigés débloqués après l'essai), parcours « cabinet » avec niveaux.</p></div>
    <div class="offre"><h3>🎓 Évaluation certifiante</h3><p class="muted">Évaluation finale + test en visio avec le formateur → attestation signée et tamponnée.</p></div>
  </div>
  <p class="muted" style="font-size:13px">💼 Bonus carrière : les offres d'emploi demandent souvent une « expérience e-learning / maîtrise des outils LMS » — suivre cette formation 100 % en ligne vous donne précisément cette expérience, à valoriser sur votre CV (on vous montre comment dans le module Carrière).</p></section>
  <section class="card"><h2>🧮 Notre système : des simulateurs interactifs</h2>
  <p class="muted">Ici, pas de théorie sèche : vous vous entraînez sur des <b>simulateurs intégrés</b>, exactement comme dans un vrai cabinet d'externalisation — rapprochement bancaire, CERFA réels, calculateurs fiscaux &amp; sociaux et matrice de saisie.</p>
  <img src="/public/img/simulateurs-systeme.svg?v=${ASSET_V}" alt="Aperçu de nos simulateurs : rapprochement bancaire, CERFA réels et calculateurs" loading="lazy" style="width:100%;height:auto;display:block;border-radius:14px;border:1px solid rgba(255,255,255,.12);margin:6px 0 16px">
  <div class="grid">
    <div class="offre"><h3>🏦 Rapprochement bancaire</h3><p class="muted">Pointer · comptabiliser · en rapprochement → écart 0, comme sur Pennylane.</p></div>
    <div class="offre"><h3>🧾 CERFA réels</h3><p class="muted">2031 · 2058‑A · 2035 · DAS2 remplis pas à pas, case par case.</p></div>
    <div class="offre"><h3>🧮 12 calculateurs</h3><p class="muted">TVA, IS, cotisations dirigeant, IK, TVS, LMNP, provisions…</p></div>
    <div class="offre"><h3>⌨️ Matrice de saisie</h3><p class="muted">Écritures débit/crédit auto-vérifiées (équilibre en direct).</p></div>
  </div>
  <p><a class="btn" href="/inscription">Créer mon compte${promoLive() ? ' gratuit' : ''} →</a></p></section>`, sess);
}

function pageApercu(sess, code) {
  const inf = moduleInfo(code);
  if (!inf) return layout('Aperçu', '<h1>Module introuvable</h1><p><a class="btn" href="/programme">← Programme</a></p>', sess);
  if (inf.gratuit) {
    // Le Module 1 est gratuit MAIS réservé aux inscrits : il faut créer un compte pour lire le cours complet.
    if (!authed0(sess)) {
      return layout('Module 1 gratuit — ' + inf.titre, `<p class="muted"><a href="/programme">← Programme</a> &middot; <b class="gratuit">Module 100 % gratuit</b></p>
      <h1>${esc(moduleTitre(code))}</h1>
      <article class="prose">${teaserHtml(code)}</article>
      <section class="card lockcard"><h2>🎁 Module 1 offert — créez votre compte gratuit pour le lire</h2>
      <p>Le cours complet du Module 1 (leçons détaillées, cas pratiques et quiz) est <b>100 % gratuit</b>. Il vous suffit de <b>créer votre compte</b> (2 minutes, sans engagement) pour y accéder.</p>
      <p><a class="btn" href="/inscription">Créer mon compte gratuit →</a> <a class="btn ghost" href="/connexion">J'ai déjà un compte</a></p></section>`, sess);
    }
    const q = quizFor(code);
    const quizHtml = q ? `<section class="card"><h2>📝 Quiz du module</h2>
    <p class="muted">Testez-vous sur le Module 1.</p>
    <script type="application/json" id="quizdata">${JSON.stringify(q).replace(/</g, '\\u003c')}</script>
    <div id="quiz"></div><script src="/public/quiz.js"></script></section>` : '';
    return layout('Aperçu — ' + inf.titre, `<p class="muted"><a href="/programme">← Programme</a> &middot; <b class="gratuit">Module gratuit</b></p>
    <article class="prose">${moduleCompletHtml(code)}</article>
    ${quizHtml}
    <section class="card"><h2>La suite vous intéresse ?</h2><p>${promoLive() ? '<b>🎁 Pendant la promo, les Modules 2 à 6 sont GRATUITS</b> — débloqués dès votre inscription, jusqu’au ' + promoFinFR() + '.' : 'Débloquez les <b>Modules 2 à 6</b> (Pennylane, opérations & révision, fiscalité & clôture, liasse fiscale, métier & certification) — <b>à partir de ' + money(prixMiniModule()) + ' / module</b>.'}</p><a class="btn" href="/formation">Continuer la formation →</a></section>`, sess);
  }
  return layout('Aperçu — ' + inf.titre, `<p class="muted"><a href="/programme">← Programme</a></p>
  <h1>${esc(moduleTitre(code))}</h1>
  <article class="prose">${teaserHtml(code)}</article>
  <section class="card lockcard"><h2>🔒 Contenu complet réservé aux inscrits</h2>
  <p>Le cours détaillé, les procédures pas-à-pas, cas pratiques, checklists et le quiz de ce module sont accessibles ${promoLive() ? 'GRATUITEMENT après une simple inscription (promo jusqu’au ' + promoFinFR() + ')' : 'après inscription et paiement'}.</p>
  <a class="btn" href="/inscription">S'inscrire pour débloquer</a> <a class="btn ghost" href="/apercu?m=mod1">Voir un module gratuit</a></section>`, sess);
}

function pageInscription(sess, err, val = {}) {
  return layout('Inscription', `
  <h1>Inscription</h1>
  <p class="muted">Conditions : ${esc(cfg.conditions.diplome_requis)}.</p>
  ${promoLive() ? `<section class="card" style="border-left:4px solid var(--accent);background:rgba(232,161,58,.08)"><h2 style="margin:0 0 4px">🎁 Votre inscription débloque TOUS les modules — gratuitement</h2><p style="margin:0">En créant votre compte maintenant, vous accédez à <b>l'intégralité de la formation (Modules 1 à 6)</b> <b>gratuitement, jusqu’au ${esc((((cfg.promo) || {}).jusqu_au || '').slice(0, 10))}</b>. Aucun paiement requis pendant la promo.</p></section>` : ''}
  <p class="muted" style="font-size:13px">🔐 Connexion simple et sécurisée par <b>email + mot de passe</b> — aucune application à installer.</p>
  ${err ? `<p class="err">${esc(err)}</p>` : ''}
  <form method="post" action="/inscription" class="card form" autocomplete="off">
    ${sess ? csrfField(sess) : ''}
    <div class="row"><label>Nom<input name="nom" required value="${esc(val.nom)}"></label>
    <label>Prénom<input name="prenom" required value="${esc(val.prenom)}"></label></div>
    <label>Email<input type="email" name="email" required value="${esc(val.email)}"></label>
    <label>Téléphone<input name="tel" placeholder="+261 ..." value="${esc(val.tel)}"></label>
    <label>Code de parrainage <span class="muted">(facultatif — 🎁 un cadeau de temps d'accès pour votre parrain)</span><input name="parrain" value="${esc(val.parrain || '')}" placeholder="ex. ABC234" maxlength="12" style="text-transform:uppercase"></label>
    <label>Niveau d'études
      <select name="niveau_etudes" required>
        <option value="">— choisir —</option>
        <option>BAC+2 comptabilité</option><option>BAC+3 comptabilité/gestion</option>
        <option>BAC+5 (master)</option><option>Autre</option>
      </select></label>
    <label>Auto-évaluation du niveau (comptabilité)
      <select name="niveau_intellectuel" required>
        <option value="">— choisir —</option><option>Débutant</option><option>Intermédiaire</option><option>Avancé</option>
      </select></label>
    <label class="check"><input type="checkbox" name="diplome_bac2" value="1"> J'atteste sur l'honneur être titulaire d'un <b>${esc(cfg.conditions.diplome_requis)}</b>.</label>
    <label class="check"><input type="checkbox" name="rgpd" value="1"> J'accepte la politique de confidentialité (RGPD) et l'engagement de secret professionnel.</label>
    <label class="check"><input type="checkbox" name="cgu" value="1"> J'accepte les <a href="/mentions-legales" target="_blank" rel="noopener">conditions d'utilisation</a> : le contenu et les simulateurs sont <b>strictement personnels</b> — toute <b>reproduction, diffusion, partage de compte ou revente est interdite</b>.</label>
    <label>Mot de passe (10+ caractères, lettres et chiffres)<input type="password" name="pw" required minlength="10"></label>
    <button class="btn" type="submit">Créer mon compte</button>
  </form>`, sess);
}

function pageConnexion(sess, err, email = '') {
  return layout('Connexion', `<h1>Connexion</h1>${err ? `<p class="err">${esc(err)}</p>` : ''}
  <img class="illus sm" src="/public/photos/office.png" alt="Cabinet comptable externalisé" width="1448" height="1086" loading="lazy">
  <form method="post" action="/connexion" class="card form">
    ${sess ? csrfField(sess) : ''}
    <label>Email<input type="email" name="email" required value="${esc(email)}"></label>
    <label>Mot de passe<input type="password" name="pw" required></label>
    <button class="btn" type="submit">Se connecter</button>
  </form><p class="muted"><a href="/mot-de-passe-oublie">Mot de passe oublié ?</a> · <a href="/inscription">Créer un compte</a></p>`, sess);
}

// ===== Mot de passe oublié / réinitialisation =====
function pageMotDePasseOublie(sess, msg) {
  return layout('Mot de passe oublié', `<h1>Mot de passe oublié</h1>
  ${msg ? `<p class="ok">${esc(msg)}</p>` : ''}
  <p class="muted">Saisissez votre email : si un compte existe, vous recevrez un <b>lien</b> pour choisir un nouveau mot de passe (valable <b>1 heure</b>).</p>
  <form method="post" action="/mot-de-passe-oublie" class="card form">${sess ? csrfField(sess) : ''}
    <label>Email<input type="email" name="email" required autocomplete="email"></label>
    <button class="btn" type="submit">Envoyer le lien de réinitialisation</button></form>
  <p class="muted"><a href="/connexion">← Retour à la connexion</a>${!mailConfigured() ? ' · <span style="color:#9a5b00">Si vous ne recevez pas l\'email, contactez le formateur via WhatsApp.</span>' : ''}</p>`, sess);
}
function pageReinitialiser(sess, token, err) {
  const u = token ? db.prepare('SELECT id FROM users WHERE reset_token=? AND reset_exp > ?').get(token, new Date().toISOString()) : null;
  if (!u) return layout('Réinitialisation', `<h1>Lien invalide ou expiré</h1>
  <p class="muted">Ce lien de réinitialisation n'est plus valide (expiré ou déjà utilisé). Refaites une demande.</p>
  <p><a class="btn" href="/mot-de-passe-oublie">Nouvelle demande</a></p>`, sess);
  return layout('Réinitialisation', `<h1>Choisir un nouveau mot de passe</h1>
  ${err ? `<p class="err" style="color:#c0392b">${esc(err)}</p>` : ''}
  <form method="post" action="/reinitialiser" class="card form">${sess ? csrfField(sess) : ''}<input type="hidden" name="token" value="${esc(token)}">
    <label>Nouveau mot de passe <span class="muted">(10+ caractères, lettres et chiffres)</span><input type="password" name="pw" required autocomplete="new-password"></label>
    <label>Confirmer le mot de passe<input type="password" name="pw2" required autocomplete="new-password"></label>
    <button class="btn" type="submit">Enregistrer le nouveau mot de passe</button></form>`, sess);
}
function postMotDePasseOublie(req, res, sess, body) {
  sess = sess || getSession(req);
  if (!sess) { const sid = newSession(null, false, req); return redirect(res, '/mot-de-passe-oublie', [cookie('sid', signSid(sid), cookieOpts)]); }
  if (!checkCsrf(sess, body)) return send(res, 403, pageMotDePasseOublie(sess, ''));
  if (rateLimited('pwreset:' + ip(req), 5, 15 * 60000)) return send(res, 429, pageMotDePasseOublie(sess, ''));
  const email = (body.email || '').trim().toLowerCase();
  const u = isEmail(email) ? db.prepare('SELECT * FROM users WHERE email=?').get(email) : null;
  if (u) {
    const token = rid(28), exp = new Date(Date.now() + 3600000).toISOString();
    db.prepare('UPDATE users SET reset_token=?, reset_exp=? WHERE id=?').run(token, exp, u.id);
    audit(db, u.id, 'pwreset_demande', email, ip(req));
    if (mailConfigured()) {
      const link = BASE_URL + '/reinitialiser?token=' + token;
      const html = `<p>Bonjour ${esc(u.prenom || '')},</p><p>Vous avez demandé à réinitialiser votre mot de passe sur <b>${esc(cfg.site.nom_plateforme)}</b>.</p>`
        + `<p><a href="${link}" style="display:inline-block;background:#16307a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Choisir un nouveau mot de passe</a></p>`
        + `<p>Ou copiez ce lien dans votre navigateur :<br>${link}</p>`
        + `<p style="color:#777;font-size:12px">Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail (votre mot de passe reste inchangé).</p>`;
      sendEmail(u.email, 'Réinitialisation de votre mot de passe', html).catch(() => { });
    }
  }
  return send(res, 200, pageMotDePasseOublie(sess, "Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé. Vérifiez votre boîte de réception (et les indésirables)."));
}
function postReinitialiser(req, res, sess, body) {
  sess = sess || getSession(req);
  if (!sess) { const sid = newSession(null, false, req); return redirect(res, '/reinitialiser?token=' + encodeURIComponent(body.token || ''), [cookie('sid', signSid(sid), cookieOpts)]); }
  if (!checkCsrf(sess, body)) return send(res, 403, pageReinitialiser(sess, body.token || '', 'Session expirée, réessayez.'));
  const token = String(body.token || '');
  const u = db.prepare('SELECT * FROM users WHERE reset_token=? AND reset_exp > ?').get(token, new Date().toISOString());
  if (!u) return send(res, 200, pageReinitialiser(sess, token, null));
  if (!strongPw(body.pw)) return send(res, 200, pageReinitialiser(sess, token, 'Mot de passe trop faible (10+ caractères, lettres et chiffres).'));
  if (body.pw !== body.pw2) return send(res, 200, pageReinitialiser(sess, token, 'Les deux mots de passe ne correspondent pas.'));
  const { hash, salt } = hashPassword(body.pw);
  db.prepare('UPDATE users SET pass_hash=?, pass_salt=?, reset_token=NULL, reset_exp=NULL WHERE id=?').run(hash, salt, u.id);
  audit(db, u.id, 'pwreset_ok', u.email, ip(req));
  return send(res, 200, layout('Mot de passe modifié', `<h1>✅ Mot de passe modifié</h1><p>Votre nouveau mot de passe est enregistré. Vous pouvez maintenant vous connecter.</p><p><a class="btn" href="/connexion">Se connecter</a></p>`, sess));
}

function page2faSetup(sess, secret, uri, err, qr) {
  return layout('Activer la double authentification', `<h1>Double authentification (2FA)</h1>
  <p>Sécurisez votre compte « à double tour ». <b>Scannez ce QR code</b> avec <b>Google Authenticator</b> / <b>Authy</b> :</p>
  <p class="muted">📱 Pas encore l'application ? <a target="_blank" rel="noopener" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"><b>Installer Google Authenticator sur Google Play</b></a> · <a target="_blank" rel="noopener" href="https://apps.apple.com/app/google-authenticator/id388497605">iPhone (App Store)</a></p>
  <div class="card">${qr ? `<img class="qr" src="${qr}" alt="QR code 2FA" width="220" height="220">` : ''}
  <p class="muted">Si vous ne pouvez pas scanner, saisissez la clé manuellement : <code>${esc(secret)}</code></p></div>
  ${err ? `<p class="err">${esc(err)}</p>` : ''}
  <form method="post" action="/2fa-activer" class="card form">${csrfField(sess)}
    <input type="hidden" name="secret" value="${esc(secret)}">
    <label>Code à 6 chiffres de l'application<input name="code" inputmode="numeric" pattern="\\d{6}" required></label>
    <button class="btn" type="submit">Activer et continuer</button></form>`, sess);
}

function page2faVerify(sess, err) {
  return layout('Vérification', `<h1>Code de vérification</h1>
  <p>Saisissez le code à 6 chiffres de votre application d'authentification.</p>
  ${err ? `<p class="err">${esc(err)}</p>` : ''}
  <form method="post" action="/2fa" class="card form">${csrfField(sess)}
    <label>Code<input name="code" inputmode="numeric" pattern="\\d{6}" required autofocus></label>
    <button class="btn" type="submit">Valider</button></form>`, sess);
}

function pageDashboard(sess) {
  const u = sess.user;
  const ent = entitledModules(u);
  const offres = db.prepare("SELECT * FROM offres WHERE code != 'PROMO_PACK'").all();
  const ins = db.prepare('SELECT i.*, o.titre, o.prix FROM inscriptions i JOIN offres o ON o.code=i.offre_code WHERE i.user_id=? ORDER BY i.cree_le DESC').all(u.id);
  const mesDem = db.prepare('SELECT * FROM demandes WHERE user_id=? ORDER BY cree_le DESC').all(u.id);
  const active = u.role === 'admin' || hasActive(u.id);
  const fmtDate = s => s ? esc(String(s).slice(0, 10)) : '';
  const expActive = (ins.find(i => i.statut === 'active') || {}).expire_le;
  return layout('Mon espace', `<h1>Bonjour ${esc(u.prenom || u.nom)}</h1>
  ${(function () { const a = annonceActive(); return a ? `<section class="card" style="border-left:4px solid var(--accent);background:rgba(232,161,58,.10)"><h2 style="margin:0 0 6px">📣 Annonce</h2><p style="margin:0;white-space:pre-wrap;font-size:15px">${esc(a.message)}</p></section>` : ''; })()}
  <section class="card"><div class="fbody"><div class="favatar">${esc(initiales((u.prenom || '') + ' ' + (u.nom || '')) || '👤')}</div>
  <div class="fmeta"><div class="fname">${esc(u.prenom || '')} ${esc(u.nom || '')}</div>
  <p class="muted" style="margin:6px 0">${esc(u.email)} · ${esc(u.tel || '—')}</p>
  <p class="muted" style="margin:6px 0">Niveau d'études : ${esc(u.niveau_etudes || '—')} · Auto-évaluation : ${esc(u.niveau_intellectuel || '—')}</p>
  <p class="muted" style="margin:6px 0">${u.role === 'admin' ? `2FA : ${u.twofa ? '✅ activée' : '⚠️ non activée'} · <b>Admin</b>` : 'Connexion : email + mot de passe'}</p></div></div></section>
  ${(u.role !== 'admin' && expActive) ? `<section class="card" style="border:1px solid var(--line)">
  <h2>⏳ Temps d'accès restant</h2>
  <div id="cdwn" data-exp="${esc(expActive)}" style="font-size:28px;font-weight:800;letter-spacing:.5px">…</div>
  <p class="muted" style="margin:6px 0 0">Votre accès aux modules débloqués expire le <b>${fmtDate(expActive)}</b>. Pensez à le prolonger avant la fin.</p>
  <script>(function(){var el=document.getElementById('cdwn');if(!el)return;var t=new Date(el.getAttribute('data-exp')).getTime();function tick(){if(isNaN(t)){el.textContent='—';return;}var d=t-Date.now();if(d<=0){el.textContent='⛔ Accès expiré';el.style.color='#c0392b';return;}var j=Math.floor(d/864e5),h=Math.floor(d/36e5%24),m=Math.floor(d/6e4%60),s=Math.floor(d/1e3%60);el.textContent=j+' j  '+h+' h  '+m+' m  '+s+' s';el.style.color=j<7?'#c0392b':(j<30?'#E8A13A':'#1f8a4c');}tick();setInterval(tick,1000);})();</script>
  </section>` : ''}
  ${(cfg.parrainage && cfg.parrainage.actif && u.role !== 'admin' && u.code_parrain) ? `<section class="card" style="border-left:4px solid var(--accent)">
  <h2>🎁 Parrainez et gagnez du temps d'accès</h2>
  <p>Partagez votre code : dès qu'un filleul s'inscrit avec et <b>débloque un accès payant</b>, vous recevez <b>${(cfg.parrainage.bonus_jours || 30)} jours d'accès offerts</b> (ajoutés automatiquement).</p>
  <p>Votre code de parrainage : <code style="font-size:18px;font-weight:800;letter-spacing:1px">${esc(u.code_parrain)}</code></p>
  <p class="muted" style="font-size:13px;margin:4px 0">Lien à partager : <input readonly onclick="this.select()" value="${esc(BASE_URL)}/inscription?p=${esc(u.code_parrain)}" style="width:100%;max-width:440px;padding:6px;border:1px solid var(--line);border-radius:6px;font-size:12px"></p>
  ${(function () { const n = db.prepare('SELECT COUNT(*) c FROM users WHERE parrain_id=?').get(u.id).c; const np = db.prepare('SELECT COUNT(*) c FROM users WHERE parrain_id=? AND parrain_recompense=1').get(u.id).c; return n ? `<p class="muted" style="font-size:13px">👥 ${n} filleul(s) inscrit(s) · ${np} accès payant(s) validé(s) → <b>${np * (cfg.parrainage.bonus_jours || 30)} j</b> gagnés.</p>` : '<p class="muted" style="font-size:13px">Aucun filleul pour l\'instant — partagez votre code !</p>'; })()}
  </section>` : ''}
  <section class="card"><h2>📈 Ma progression</h2>
  <div style="background:rgba(255,255,255,.08);border-radius:99px;height:16px;overflow:hidden;margin:12px 0"><div id="pgbar" style="height:100%;width:0;background:var(--grad);transition:width .7s ease"></div></div>
  <p id="pgtxt" class="muted">Chargement de votre progression…</p>
  <p class="muted">🧪 <span id="pgquiz">—</span> · 🎯 <span id="pgfinal">—</span></p>
  <p class="muted" style="font-size:12px">Suivi enregistré au fil des leçons et quiz (sur cet appareil). Reprenez où vous en étiez via « Ouvrir la formation ».</p>
  <script>(function(){try{var p=JSON.parse(localStorage.getItem('fce_progress_v1')||'{}');var done=Object.keys(p.done||{}).length,total=${courseLessonCount()};var pct=Math.min(100,Math.round(done/Math.max(total,1)*100));var b=document.getElementById('pgbar');if(b)b.style.width=pct+'%';var t=document.getElementById('pgtxt');if(t)t.textContent=pct+'% — '+done+' / '+total+' leçons terminées';var qz=p.quiz||{},ks=Object.keys(qz),ok=ks.filter(function(k){var q=qz[k];return q&&q.total&&q.score/q.total>=0.7;}).length;var eq=document.getElementById('pgquiz');if(eq)eq.textContent=ok+' / '+ks.length+' quiz réussis';var f=qz.final,ef=document.getElementById('pgfinal');if(ef)ef.textContent=(f&&f.total)?('Évaluation finale : '+Math.round(f.score/f.total*100)+'/100'):'Évaluation finale : à passer';}catch(e){}})();</script></section>
  <section class="card"><h2>🎖️ Parcours Cabinet — niveaux &amp; badges</h2>
  <div id="career"><p class="muted">Chargement de votre parcours…</p></div>
  <p class="muted" style="font-size:12px">Montez en niveau en réussissant les simulateurs (saisie, factures, TVA, révision, chef de mission). Suivi sur cet appareil.</p>
  <script>(function(){function g(k){try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(e){return {}}}var P=g('fce_progress_v1'),EX=g('fce_exo_v1'),SI=g('fce_sim_v1'),TV=g('fce_tva_v1'),AU=g('fce_audit_v1');var exoN=Object.keys(EX).filter(function(k){return EX[k]}).length;var fac=(SI.d1||0)>=6;var tvaN=Object.keys(TV).filter(function(k){return TV[k]}).length;var rev=!!AU.a2,chef=!!AU.a1;var qz=P.quiz||{},fin=qz.final,cert=!!(fin&&fin.total&&fin.score/fin.total>=0.7);var B=[{k:'🧮',n:'Saisie',ok:exoN>=4},{k:'🏢',n:'Factures',ok:fac},{k:'🧾',n:'TVA',ok:tvaN>=1},{k:'🔍',n:'Révision',ok:rev},{k:'👔',n:'Chef de mission',ok:chef},{k:'🏅',n:'Certifié',ok:cert}];var L=['Recrue','Collaborateur','Collaborateur confirmé','Réviseur','Chef de mission'];var lvl=0;if(exoN>=4||fac)lvl=1;if(lvl>=1&&fac&&tvaN>=1)lvl=2;if(lvl>=2&&rev)lvl=3;if(lvl>=3&&chef&&cert)lvl=4;var nxt=['Validez 4 exercices de saisie (Module 3.12).','Terminez le Simulateur Cabinet (3.13) et la déclaration de TVA (3.14).','Détectez les anomalies de révision (6.9).','Validez le travail du collaborateur (6.9) et réussissez le quiz final.'];var c=document.getElementById('career');try{fetch('/progression',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'_csrf=${sess.row.csrf}&prog='+encodeURIComponent(JSON.stringify({prog:P,exo:EX,sim:SI,tva:TV,audit:AU}))});}catch(e){}if(!c)return;var h='<div style=\"font-size:22px;font-weight:800;color:#fff\">'+L[lvl]+' <span class=\"muted\" style=\"font-size:14px;font-weight:400\">(niveau '+(lvl+1)+'/5)</span></div>';h+='<div style=\"background:rgba(255,255,255,.08);border-radius:99px;height:14px;overflow:hidden;margin:10px 0\"><div style=\"height:100%;width:'+(lvl/4*100)+'%;background:var(--grad);transition:width .7s\"></div></div>';h+='<div class=\"grid\" style=\"grid-template-columns:repeat(auto-fit,minmax(120px,1fr))\">'+B.map(function(b){return '<div class=\"offre\" style=\"text-align:center;opacity:'+(b.ok?'1':'.4')+'\"><div style=\"font-size:28px\">'+b.k+'</div><div style=\"font-weight:700;font-size:13px;color:#fff\">'+b.n+'</div><div class=\"muted\" style=\"font-size:11px\">'+(b.ok?'✅ obtenu':'🔒 à débloquer')+'</div></div>'}).join('')+'</div>';h+=(lvl<4)?'<p class=\"muted\" style=\"margin-top:10px\">🎯 Prochain objectif : '+nxt[lvl]+'</p>':'<p class=\"ok\" style=\"margin-top:10px\">🏆 Niveau maximum atteint — prêt pour le cabinet !</p>';c.innerHTML=h;})();</script></section>
  <section class="card"><h2>Accès à la formation</h2>
  <p>${promoLive() ? '🎁 <b>Pendant la promo, TOUS les modules sont débloqués gratuitement</b> (jusqu’au ' + promoFinFR() + ') — rien à payer.' : 'Le <b>Module 1 est gratuit</b>. Les autres modules se débloquent à partir de <b>' + money(prixMiniModule()) + '</b> après paiement.'}</p>
  <div class="prog">${MODULES.map(m => `<div class="pitem"><span>${ent.has(m.code) ? '✅' : '🔒'} ${esc(m.titre)}</span>${m.gratuit ? '<b class="gratuit">Gratuit</b>' : (ent.has(m.code) ? '<b class="gratuit">Débloqué</b>' : '<b class="lock">Verrouillé</b>')}</div>`).join('')}</div>
  <p style="margin-top:12px"><a class="btn" href="/formation">Ouvrir la formation</a> <a class="btn ghost" href="/attestation">🎓 ${(u.role === 'admin' || u.attestation_ok) ? 'Mon attestation' : 'Attestation (entretien final)'}</a> <a class="btn ghost" href="/decouverte">▶ Visite guidée (1 min)</a></p>
  ${(u.role !== 'admin') ? (u.attestation_ok
    ? `<p class="ok" style="font-size:13px;margin:8px 0 0">✅ Attestation débloquée — vous pouvez la télécharger (signée/tamponnée).</p>`
    : `<p class="muted" style="font-size:13px;margin:8px 0 0">🎓 Votre attestation sera délivrée <b>après un entretien/test final</b> avec le formateur. Terminez l'évaluation finale puis demandez votre entretien depuis la page Attestation.</p>`) : ''}</section>
  <section class="card"><h2>🎥 Visio formation complémentaire</h2>
  <p>Séance individuelle avec le formateur en visioconférence — <b>${money(visioPrix())} / heure</b>.</p>
  ${hasVisio(u.id) ? `<p class="ok">Accès visio actif ✅</p>${(cfg.visio && cfg.visio.lien) ? `<a class="btn" target="_blank" rel="noopener" href="${esc(cfg.visio.lien)}">Rejoindre la visio</a> ` : ''}<a class="btn ghost" target="_blank" rel="noopener" href="${esc(waLink('Bonjour, ma visio est réglée — je souhaite planifier une séance de formation complémentaire.'))}">📅 Planifier via WhatsApp</a>` : `<form method="post" action="/choisir" class="form" style="margin:0">${csrfField(sess)}<input type="hidden" name="offre_code" value="VISIO_1H"><button class="btn" type="submit">Réserver 1 h de visio (${money(visioPrix())})</button></form>`}
  </section>
  <section class="card" style="border-left:4px solid var(--accent)"><h2>🏫 Renforcez votre formation en présentiel</h2>
  <p>Séances <b>en présentiel dans nos bureaux à Antananarivo</b>, en <b>petit groupe (4 personnes max)</b>, sur les logiciels du métier (<b>Pennylane</b>, <b>Silae</b>, <b>Sage 50</b>) : saisie & travaux journaliers, travaux périodiques & fiscaux, préparation du bilan. <b>2 h/jour</b> (lun.–ven., 8h30–10h30) · <b>${money(presentielPrixModule())}/module</b>.</p>
  <p><a class="btn" href="/presentiel">Voir le détail</a> <a class="btn ghost" href="tel:0327362259">📞 032 73 622 59</a></p></section>
  <section class="card"><h2>Débloquer un module (paiement)</h2>
  <form method="post" action="/choisir" class="form">${csrfField(sess)}
    <select name="offre_code" required>${offres.map(o => `<option value="${esc(o.code)}">${esc(o.titre)} — ${money(o.prix)}</option>`).join('')}</select>
    <button class="btn" type="submit">Continuer vers le paiement</button></form></section>
  <section class="card"><h2>Une question sur la formation ? 💬</h2>
  <p class="muted">Posez votre question ou demandez un rendez-vous — le formateur vous répond. (Ou via le bouton WhatsApp en bas à droite.)</p>
  <form method="post" action="/demande" class="form">${csrfField(sess)}
    <label>Sujet<input name="sujet" required maxlength="120" placeholder="Ex. Question sur le Module 3, demande de rendez-vous…"></label>
    <label>Votre message<textarea name="message" required rows="4" maxlength="2000" placeholder="Décrivez votre question…"></textarea></label>
    <button class="btn" type="submit">Envoyer ma demande</button></form></section>
  <section class="card"><h2>📨 Mes demandes &amp; réponses</h2>
  ${mesDem.length ? mesDem.map(d => `<div class="offre" style="margin-bottom:10px"><b>${esc(d.sujet)}</b> <span class="muted" style="font-size:12px">(${esc((d.cree_le || '').slice(0, 10))})</span>
    <p class="muted" style="margin:4px 0;font-size:13px;white-space:pre-wrap">${esc(d.message)}</p>
    ${d.reponse ? `<div style="border-left:3px solid var(--accent);background:rgba(255,255,255,.05);padding:8px 11px;border-radius:0 8px 8px 0;margin-top:6px"><b style="color:var(--accent)">↳ Réponse du formateur</b> <span class="muted" style="font-size:11px">${esc((d.repondu_le || '').slice(0, 10))}</span><p style="margin:5px 0 0;white-space:pre-wrap">${esc(d.reponse)}</p></div>` : '<p class="muted" style="font-size:12px;margin:4px 0 0">⏳ En attente de réponse du formateur.</p>'}</div>`).join('') : '<p class="muted">Vous n\'avez pas encore posé de question.</p>'}</section>
  <section class="card"><h2>Mes inscriptions</h2>
  ${ins.length ? `<table><tr><th>Offre</th><th>Montant</th><th>Statut</th><th>Accès jusqu’au</th></tr>${ins.map(i => `<tr><td>${esc(i.titre)}</td><td>${money(i.prix)}</td><td>${esc(i.statut)}</td><td>${i.statut === 'active' ? (i.expire_le ? fmtDate(i.expire_le) : 'illimité') : '—'}</td></tr>`).join('')}</table>` : '<p class="muted">Aucune inscription.</p>'}</section>`, sess);
}

function pagePaiement(sess, ins, err) {
  const methodes = methodesManuelles();
  const blocs = methodes.map(m => {
    const det = Object.entries(m.details || {}).filter(([, v]) => v && String(v).trim())
      .map(([k, v]) => `<p>${esc(k)} : <b class="big">${esc(v)}</b></p>`).join('');
    return `<section class="card"><h2>${esc(m.nom)}</h2>
      <p><b>1.</b> Envoyez exactement <b>${money(ins.prix)}</b> :</p>${det}
      <p class="muted">${esc(m.instructions || '')}</p>
      <form method="post" action="/paiement/manuel" class="form">${csrfField(sess)}
        <input type="hidden" name="ins" value="${esc(ins.id)}">
        <input type="hidden" name="methode" value="${esc(m.code)}">
        <label><b>2.</b> Référence de transaction (SMS / bordereau)<input name="reference" required placeholder="ex. PP24..."></label>
        <button class="btn" type="submit">J'ai payé via ${esc(m.nom)} — soumettre</button></form></section>`;
  }).join('');
  const apiBloc = (cfg.orange_money && cfg.orange_money.mode === 'api' && omApiActive())
    ? `<section class="card"><h2>Orange Money (paiement automatique)</h2><form method="post" action="/paiement/orange-api" class="form">${csrfField(sess)}<input type="hidden" name="ins" value="${esc(ins.id)}"><button class="btn" type="submit">Payer via Orange Money</button></form></section>`
    : '';
  const carteBloc = carteActive()
    ? `<section class="card"><h2>Carte Visa / Mastercard</h2><form method="post" action="/paiement/carte" class="form">${csrfField(sess)}<input type="hidden" name="ins" value="${esc(ins.id)}"><button class="btn" type="submit">Payer par carte</button></form></section>`
    : '';
  return layout('Paiement', `<h1>Paiement — ${esc(ins.titre)}</h1>
  <p class="lead">Montant à régler : <b>${money(ins.prix)}</b></p>
  ${err ? `<p class="err">${esc(err)}</p>` : ''}
  ${blocs || '<p class="err">Aucun moyen de paiement actif pour le moment. Contactez-nous via WhatsApp.</p>'}
  ${apiBloc}${carteBloc}`, sess);
}

const COUNTRY_NAMES = { FR: 'France', MG: 'Madagascar', BE: 'Belgique', CH: 'Suisse', CA: 'Canada', LU: 'Luxembourg', US: 'États-Unis', GB: 'Royaume-Uni', MA: 'Maroc', DZ: 'Algérie', TN: 'Tunisie', CI: "Côte d'Ivoire", SN: 'Sénégal', CM: 'Cameroun', BJ: 'Bénin', TG: 'Togo', BF: 'Burkina Faso', ML: 'Mali', GA: 'Gabon', CD: 'RD Congo', CG: 'Congo', NE: 'Niger', GN: 'Guinée', RW: 'Rwanda', BI: 'Burundi', KM: 'Comores', DJ: 'Djibouti', MU: 'Maurice', RE: 'La Réunion', YT: 'Mayotte', MC: 'Monaco', DE: 'Allemagne', ES: 'Espagne', IT: 'Italie', PT: 'Portugal', NL: 'Pays-Bas', XX: 'Inconnu', T1: 'Réseau Tor' };
const paysNom = c => COUNTRY_NAMES[c] || c || 'Inconnu';
const paysFlag = c => (/^[A-Z]{2}$/.test(c) && c !== 'XX' && c !== 'T1') ? String.fromCodePoint(...[...c].map(ch => 0x1F1E6 + ch.charCodeAt(0) - 65)) : '🌍';

function pageAdmin(sess, notif, acces, accesEmail) {
  const users = db.prepare("SELECT u.id,u.nom,u.prenom,u.email,u.niveau_etudes,u.twofa,u.cree_le,u.vu_le,u.attestation_ok,u.attestation_le, p.niveau_nom, p.badges FROM users u LEFT JOIN progression p ON p.user_id=u.id WHERE u.role!=? ORDER BY u.cree_le DESC LIMIT 200").all('admin');
  const _cut5 = new Date(Date.now() - 5 * 60000).toISOString(), _cut30 = new Date(Date.now() - 30 * 60000).toISOString();
  const enLigne = users.filter(u => u.vu_le && u.vu_le > _cut5);
  const vusRecent = users.filter(u => u.vu_le && u.vu_le > _cut30 && u.vu_le <= _cut5);
  const grantOffres = (cfg.offres || []).filter(o => Array.isArray(o.modules) && o.modules.length > 0 && o.code !== 'PROMO_PACK');
  const offresOpts = grantOffres.map(o => `<option value="${esc(o.code)}">${esc(o.titre)} (${o.modules.length === 1 ? '1 module' : o.modules.length + ' modules'})</option>`).join('');
  const accesMsg = acces === 'ok' ? `<p class="ok">✅ Accès accordé à <b>${esc(accesEmail || '')}</b>.</p>` : acces === 'nouser' ? '<p class="err" style="color:#c0392b">❌ Aucun compte inscrit avec cet email.</p>' : acces === 'err' ? '<p class="err" style="color:#c0392b">❌ Erreur : offre invalide.</p>' : acces === 'promo' ? `<p class="ok">🎁 Promo : tous les modules débloqués pour <b>${esc(accesEmail || '0')}</b> apprenant(s) qui n'en avaient pas encore.</p>` : acces === 'annonce' ? '<p class="ok">📣 Annonce publiée — visible par tous les apprenants dans leur espace.</p>' : acces === 'annonce_off' ? '<p class="ok">Annonce désactivée.</p>' : acces === 'att_ok' ? '<p class="ok">🎓 Attestation validée — l\'apprenant peut désormais la télécharger (signée/tamponnée).</p>' : acces === 'att_off' ? '<p class="ok">🎓 Validation d\'attestation annulée — l\'attestation n\'est plus téléchargeable.</p>' : acces === 'banniere' ? '<p class="ok">🌐 Bannière publiée sur la page d\'accueil — visible par tous les visiteurs.</p>' : acces === 'banniere_off' ? '<p class="ok">Bannière d\'accueil retirée.</p>' : acces === 'google_ok' ? '<p class="ok">📅 Google Agenda connecté — les RDV de test créent maintenant le Meet automatiquement.</p>' : acces === 'google_err' ? '<p class="err" style="color:#c0392b">❌ Connexion Google échouée — vérifiez l\'URI de redirection et réessayez.</p>' : acces === 'google_noenv' ? '<p class="err" style="color:#c0392b">❌ GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET manquants dans Render.</p>' : acces === 'google_off' ? '<p class="ok">Google Agenda déconnecté.</p>' : '';
  const pend = db.prepare(`SELECT p.*, u.email, o.titre FROM paiements p JOIN users u ON u.id=p.user_id JOIN inscriptions i ON i.id=p.inscription_id JOIN offres o ON o.code=i.offre_code WHERE p.statut='en_verification' ORDER BY p.cree_le DESC`).all();
  const dem = db.prepare(`SELECT d.*, u.email, u.tel FROM demandes d JOIN users u ON u.id=d.user_id WHERE d.statut='nouvelle' ORDER BY d.cree_le DESC`).all();
  // --- Statistiques de visites ---
  const _jour = new Date().toISOString().slice(0, 10);
  const _j7 = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
  const vTot = db.prepare('SELECT COALESCE(SUM(n),0) AS t FROM visites').get().t;
  const vToday = db.prepare('SELECT COALESCE(SUM(n),0) AS t FROM visites WHERE jour=?').get(_jour).t;
  const v7 = db.prepare('SELECT COALESCE(SUM(n),0) AS t FROM visites WHERE jour>=?').get(_j7).t;
  // Madagascar détaillé par province ; les autres pays sont masqués (agrégés)
  const vMG = db.prepare("SELECT region, SUM(n) AS t FROM visites WHERE pays='MG' GROUP BY region ORDER BY t DESC").all();
  const vMGtot = vMG.reduce((s, r) => s + r.t, 0);
  const vAutres = db.prepare("SELECT COALESCE(SUM(n),0) AS t FROM visites WHERE pays<>'MG'").get().t;
  const nInscr = db.prepare("SELECT COUNT(*) c FROM users WHERE role='apprenant'").get().c;
  const provLabel = r => r ? `📍 ${esc(r)}` : '📍 Province non détectée';
  const visitesHtml = `<section class="card"><h2>📊 Visites du site &amp; inscrits</h2>
  <div class="stats"><div class="stat"><b>${vTot}</b><span>visites totales</span></div><div class="stat"><b>${vToday}</b><span>aujourd'hui</span></div><div class="stat"><b>${v7}</b><span>7 derniers jours</span></div><div class="stat"><b>${nInscr}</b><span>apprenants inscrits</span></div></div>
  ${vMGtot ? `<h3>🇲🇬 Visiteurs à Madagascar — par province</h3><div class="tbl"><table><tr><th>Province</th><th>Visites</th><th>Part MG</th></tr>
  ${vMG.map(r => `<tr><td>${provLabel(r.region)}</td><td>${r.t}</td><td>${vMGtot ? Math.round(r.t * 100 / vMGtot) : 0} %</td></tr>`).join('')}
  <tr style="font-weight:800;border-top:2px solid #16307a"><td>Total Madagascar</td><td>${vMGtot}</td><td>${vTot ? Math.round(vMGtot * 100 / vTot) : 0} % du total</td></tr></table></div>
  <p class="muted" style="font-size:12px">🌍 Autres pays (masqués) : <b>${vAutres}</b> visite${vAutres > 1 ? 's' : ''}.</p>` : '<p class="muted">Aucune visite Madagascar enregistrée pour l\'instant — le comptage démarre maintenant (pages publiques).</p>'}
  <p class="muted" style="font-size:12px">Comptage interne, sans cookie de pistage (RGPD). La province provient de Cloudflare (<code>cf-region</code>) ou, à défaut, d'une <b>géolocalisation de l'adresse IP</b> (IP <b>hachée</b>, jamais conservée en clair). À Madagascar, le trafic mobile est souvent rattaché par l'opérateur à Antananarivo : la province reste donc <b>approximative</b>. Le comptage par province ne démarre que <b>maintenant</b> — les visites passées restent en « non détectée ».</p></section>`;
  // --- Sécurité : détection de partage de compte (IP distinctes / 30 jours) ---
  const _j30 = new Date(Date.now() - 30 * 86400000).toISOString();
  const partage = db.prepare(`SELECT u.email, COUNT(DISTINCT j.ip) AS nip, COUNT(*) AS nlog, MAX(j.ts) AS last
    FROM journal j JOIN users u ON u.id=j.user_id
    WHERE j.action IN ('login_complet','login_ok_2fa') AND j.ip IS NOT NULL AND j.ip!='' AND j.ts >= ? AND u.role='apprenant'
    GROUP BY j.user_id HAVING nip >= 2 ORDER BY nip DESC, nlog DESC LIMIT 50`).all(_j30);
  const _seul = !!(cfg.acces && cfg.acces.un_seul_appareil);
  const partageHtml = `<section class="card"><h2>🛡️ Sécurité — partage de compte (anti-duplication)</h2>
  <p class="muted" style="font-size:13px">Protection active : <b>${_seul ? '✅ 1 seul appareil à la fois' : '⚠️ multi-appareils autorisés'}</b> · <b>🔐 2FA réservée à l'admin</b> (apprenants : email + mot de passe). <span title="L'IP change souvent sur les réseaux mobiles malgaches : un blocage par IP déconnecterait les vrais apprenants.">On ne bloque pas par adresse IP (trop instable sur mobile).</span></p>
  ${partage.length ? `<p>Comptes vus depuis <b>plusieurs adresses IP</b> sur 30 jours (à surveiller) :</p>
  <div class="tbl"><table><tr><th>Email</th><th>IP distinctes</th><th>Connexions</th><th>Dernière</th></tr>
  ${partage.map(r => { const col = r.nip >= 4 ? '#c0392b' : '#E8A13A'; return `<tr><td>${esc(r.email)}</td><td><b style="color:${col}">${r.nip}</b></td><td>${r.nlog}</td><td>${esc((r.last || '').slice(0, 10))}</td></tr>`; }).join('')}</table></div>
  <p class="muted" style="font-size:12px">Plusieurs IP ≠ fraude (mobile + bureau, 4G changeante). Un nombre élevé (≥ 4) sur peu de jours peut signaler un <b>partage d'identifiants</b> : retirez l'accès ci-dessous ou demandez une réinitialisation du compte.</p>` : '<p class="muted">✅ Aucun compte suspect : pas de connexion multi-IP anormale sur 30 jours.</p>'}</section>`;
  // --- Modules accessibles par apprenant (inscriptions actives) ---
  const _nowISO = new Date().toISOString();
  const _insAll = db.prepare("SELECT user_id, offre_code, expire_le FROM inscriptions WHERE statut='active' AND (expire_le IS NULL OR expire_le > ?)").all(_nowISO);
  const _insByUser = {};
  for (const r of _insAll) { (_insByUser[r.user_id] || (_insByUser[r.user_id] = [])).push(r); }
  const _chip = c => { const free = FREE_MODS.has(c); return `<span style="display:inline-block;padding:1px 7px;margin:1px;border-radius:8px;font-size:11px;font-weight:700;${free ? 'background:#fff3df;color:#9a5b00;border:1px solid #f0d9b5' : 'background:#e7ecff;color:#16307a;border:1px solid #c5d2f5'}" title="${free ? 'Module 1 — gratuit' : 'Accès payé ou accordé par l’admin'}">${esc(c.replace('mod', 'M'))}</span>`; };
  function modulesCell(u) {
    const set = new Set(FREE_MODS);
    const codes = [];
    let exp = null, visio = false;
    for (const r of (_insByUser[u.id] || [])) {
      const mods = offerModules(r.offre_code);
      if (mods.length === 0) visio = true;
      for (const c of mods) set.add(c);
      if (r.expire_le && (!exp || r.expire_le < exp)) exp = r.expire_le;
    }
    for (const m of MODULES) if (set.has(m.code)) codes.push(m.code);
    const paid = codes.filter(c => !FREE_MODS.has(c));
    const chips = codes.map(_chip).join(' ') + (visio ? ` <span style="display:inline-block;padding:1px 7px;margin:1px;border-radius:8px;font-size:11px;font-weight:700;background:#e9f7ef;color:#1e7d46;border:1px solid #bfe6cd">Visio</span>` : '');
    const note = paid.length ? (exp ? `<br><span class="muted" style="font-size:11px">expire ${esc(exp.slice(0, 10))}</span>` : '<br><span class="muted" style="font-size:11px">sans limite</span>') : '<br><span class="muted" style="font-size:11px">gratuit seul</span>';
    return chips + note;
  }
  // --- Accès accordés/payés : modifier la durée ou retirer ---
  const accesMsg2 = acces === 'retire' ? '<p class="ok">✅ Accès retiré.</p>' : acces === 'modif' ? '<p class="ok">✅ Durée d\'accès mise à jour.</p>' : acces === 'noid' ? '<p class="err" style="color:#c0392b">❌ Accès introuvable.</p>' : '';
  const grants = db.prepare(`SELECT i.id,i.expire_le,u.email,o.titre FROM inscriptions i JOIN users u ON u.id=i.user_id JOIN offres o ON o.code=i.offre_code WHERE i.statut='active' ORDER BY i.cree_le DESC LIMIT 300`).all();
  const gererAcces = `<section class="card"><h2>✏️ Accès accordés / payés — modifier ou retirer</h2>${accesMsg2}
  ${grants.length ? `<div class="tbl"><table><tr><th>Email</th><th>Accès</th><th>Expire</th><th>Compte à rebours</th><th>Fixer la durée (jours)</th><th>Retirer</th></tr>
  ${grants.map(g => `<tr><td>${esc(g.email)}</td><td>${esc(g.titre)}</td><td>${g.expire_le ? esc(g.expire_le.slice(0, 10)) : 'illimité'}</td>
    ${(function(){ if(!g.expire_le) return '<td><b style="color:#1f8a4c">∞ illimité</b></td>'; const j=Math.ceil((new Date(g.expire_le).getTime()-Date.now())/86400000); const col=j<7?'#c0392b':(j<30?'#E8A13A':'#1f8a4c'); const txt=j<0?('expiré (il y a '+(-j)+' j)'):(j+' j restants'); return '<td><b style="color:'+col+'">'+txt+'</b></td>'; })()}
    <td><form method="post" action="/admin/acces-modifier" class="inline">${csrfField(sess)}<input type="hidden" name="id" value="${esc(g.id)}"><input name="jours" type="number" min="0" max="3650" value="30" style="width:74px"><button class="btn small">Fixer</button></form></td>
    <td><form method="post" action="/admin/acces-retirer" class="inline" onsubmit="return confirm('Retirer cet accès ?')">${csrfField(sess)}<input type="hidden" name="id" value="${esc(g.id)}"><button class="btn small" style="background:#c0392b">Retirer</button></form></td></tr>`).join('')}</table></div>
  <p class="muted" style="font-size:12px">« Fixer » : l'accès expirera dans N jours à compter d'aujourd'hui (petit nombre = réduire ; <b>0 = expire aujourd'hui</b>). « Retirer » : révoque immédiatement le module/pack.</p>` : '<p class="muted">Aucun accès actif (payé ou accordé) pour le moment.</p>'}</section>`;
  // --- Parrainage : vue d'ensemble ---
  const _bj = (cfg.parrainage && cfg.parrainage.bonus_jours) || 30;
  const parr = (cfg.parrainage && cfg.parrainage.actif) ? db.prepare(`SELECT p.email, p.code_parrain,
    (SELECT COUNT(*) FROM users f WHERE f.parrain_id=p.id) AS nf,
    (SELECT COUNT(*) FROM users f WHERE f.parrain_id=p.id AND f.parrain_recompense=1) AS nr
    FROM users p WHERE EXISTS (SELECT 1 FROM users f WHERE f.parrain_id=p.id) ORDER BY nf DESC LIMIT 50`).all() : [];
  const parrainageHtml = (cfg.parrainage && cfg.parrainage.actif) ? `<section class="card"><h2>🎁 Parrainage</h2>
  <p class="muted" style="font-size:13px">Bonus : <b>+${_bj} j</b> d'accès au parrain dès qu'un filleul débloque un accès payant. Chaque inscrit a un code (visible dans son espace).</p>
  ${parr.length ? `<div class="tbl"><table><tr><th>Parrain</th><th>Code</th><th>Filleuls</th><th>Accès payants validés</th><th>Jours offerts</th></tr>
  ${parr.map(r => `<tr><td>${esc(r.email)}</td><td><code>${esc(r.code_parrain || '')}</code></td><td>${r.nf}</td><td>${r.nr}</td><td><b>${r.nr * _bj} j</b></td></tr>`).join('')}</table></div>` : '<p class="muted">Aucun parrainage pour le moment.</p>'}</section>` : '';
  // --- Offres d'emploi (admin) ---
  let _emp = []; try { _emp = db.prepare('SELECT * FROM offres_emploi ORDER BY cree_le DESC LIMIT 100').all(); } catch { }
  const emploiHtml = `<section class="card"><h2>💼 Offres d'emploi (mini-bourse)</h2>
  <form method="post" action="/admin/emploi-ajouter" class="form">${csrfField(sess)}
    <div class="row"><label>Titre du poste<input name="titre" required placeholder="Collaborateur comptable"></label>
    <label>Entreprise<input name="entreprise" placeholder="Cabinet X"></label></div>
    <div class="row"><label>Lieu<input name="lieu" placeholder="Antananarivo / télétravail"></label>
    <label>Contrat<input name="contrat" placeholder="CDI / Freelance / Stage"></label></div>
    <label>Description<textarea name="description" rows="3" placeholder="Missions, profil recherché…"></textarea></label>
    <label>Lien pour postuler (https://…)<input name="lien" type="url" placeholder="https://…"></label>
    <button class="btn" type="submit">Publier l'offre</button></form>
  ${_emp.length ? `<div class="tbl"><table><tr><th>Poste</th><th>Entreprise</th><th>Publiée</th><th>Retirer</th></tr>
  ${_emp.map(o => `<tr><td>${esc(o.titre)}</td><td>${esc(o.entreprise || '')}</td><td>${esc((o.cree_le || '').slice(0, 10))}</td>
    <td><form method="post" action="/admin/emploi-retirer" class="inline" onsubmit="return confirm('Retirer cette offre ?')">${csrfField(sess)}<input type="hidden" name="id" value="${esc(o.id)}"><button class="btn small" style="background:#c0392b">Retirer</button></form></td></tr>`).join('')}</table></div>` : '<p class="muted">Aucune offre publiée.</p>'}
  <p class="muted" style="font-size:12px">Les offres apparaissent sur la page publique <b>/emploi</b>.</p></section>`;
  return layout('Admin', `<h1>Administration</h1>
  <section class="card" style="border-left:4px solid #1e7d46;background:rgba(30,125,70,.08)"><h2 style="margin:0 0 6px">🟢 En ligne maintenant — ${enLigne.length} apprenant${enLigne.length > 1 ? 's' : ''}</h2>
  ${enLigne.length ? `<div class="prog">${enLigne.map(u => `<div class="pitem"><span>🟢 <b>${esc(u.prenom)} ${esc((u.nom || '').slice(0, 1))}.</b> <span class="muted" style="font-size:11px">${esc(u.email)}</span></span><b class="gratuit">${esc(dateMG(u.vu_le).slice(11))}</b></div>`).join('')}</div>` : '<p class="muted">Personne en ligne à l\'instant.</p>'}
  ${vusRecent.length ? `<p class="muted" style="font-size:12px;margin-top:8px">🕒 Vus il y a moins de 30 min : ${vusRecent.map(u => esc(u.prenom) + ' ' + esc((u.nom || '').slice(0, 1)) + '.').join(' · ')}</p>` : ''}
  <p class="muted" style="font-size:11px">« En ligne » = activité dans les 5 dernières minutes (heure de Madagascar). Le détail « Dernier vu » de chacun est dans le tableau des apprenants plus bas. Actualisez pour rafraîchir.</p></section>
  ${mailConfigured() ? `${notif != null ? `<p class="ok">📣 Notification envoyée à ${esc(notif)} apprenant(s).</p>` : ''}
  <section class="card"><h2>📣 Notifier les apprenants d'une mise à jour</h2>
  <form method="post" action="/admin/notifier" class="form">${csrfField(sess)}
    <label>Objet<input name="sujet" value="Nouvelle mise à jour de votre formation"></label>
    <label>Message<textarea name="message" rows="4" placeholder="Décrivez la mise à jour / amélioration apportée…" required></textarea></label>
    <button class="btn" type="submit">Envoyer la notification à tous les apprenants</button></form>
  <p class="muted" style="font-size:12px">Envoie un e-mail à tous les inscrits.</p></section>` : ''}
  ${visitesHtml}
  ${partageHtml}
  <section class="card"><h2>💾 Sauvegarde des données</h2>
  <p class="muted" style="font-size:13px">Téléchargez une copie complète et cohérente de la base (comptes, accès, progression, offres d'emploi). À faire <b>régulièrement</b> et à conserver <b>hors du serveur</b> (Google Drive, disque…).</p>
  <p><a class="btn" href="/admin/backup">💾 Télécharger une sauvegarde (.db)</a></p></section>
  <section class="card"><h2>📚 Supports &amp; guides</h2>
  <p class="muted">Tous les guides (diffusion, charte, intégrer vidéos, vidéo promo, réseaux sociaux, checklist, mise en ligne, lois de finances…) — version lisible.</p>
  <p><a class="btn" href="/public/supports/index.html" target="_blank" rel="noopener">Ouvrir tous les supports</a>
     <a class="btn ghost" href="/public/supports/11-Video-promo-script.html" target="_blank" rel="noopener">🎬 Script vidéo</a>
     <a class="btn ghost" href="/public/supports/12-Promo-reseaux-sociaux.html" target="_blank" rel="noopener">📣 Promo réseaux</a></p></section>
  <section class="card"><h2>Contenu de la formation — tous les modules</h2>
  <p class="muted">Accès complet (admin), sans paiement.</p>
  <p><a class="btn" href="/formation">Ouvrir la formation (tous les modules)</a></p>
  <ul>${MODULES.map(m => `<li>${esc(m.titre)}</li>`).join('')}</ul></section>
  <section class="card"><h2>📄 Aperçu des attestations</h2>
  <p class="muted" style="font-size:13px">Prévisualisez le document tel qu'il sera remis (votre nom d'admin sert d'exemple). Bouton « 🖨️ Imprimer / PDF » en haut du document.</p>
  <p><a class="btn" href="/attestation?type=fin" target="_blank" rel="noopener">🎓 Aperçu — Attestation de fin de formation</a>
     <a class="btn ghost" href="/attestation?type=stage" target="_blank" rel="noopener">🧑‍💼 Aperçu — Attestation de stage</a></p>
  <p class="muted" style="font-size:12px">L'attestation de stage affiche les mentions DCG/DGC (lieu &amp; adresse, période à compléter, durée <b>3 mois ≈ 13 semaines</b>, missions, signature + cachet). Elle est délivrée automatiquement aux comptes dont l'e-mail est dans <code>attestation_stage</code> (config).</p></section>
  <section class="card"><h2>🎁 Donner un accès (gratuit, sans paiement)</h2>
  <p class="muted">Accorde l'accès à un module (ou au pack complet) à un email <b>déjà inscrit</b>, immédiatement et sans paiement, pour la durée choisie.</p>
  ${accesMsg}
  <form method="post" action="/admin/acces" class="form">${csrfField(sess)}
    <label>Email de l'inscrit<input name="email" type="email" placeholder="prenom@exemple.com" required></label>
    <label>Accès à<select name="offre">${offresOpts}</select></label>
    <label>Durée d'accès (jours)<input name="jours" type="number" min="1" max="3650" value="365"></label>
    <button class="btn" type="submit">Accorder l'accès</button></form>
  <p class="muted" style="font-size:12px">L'email doit déjà avoir un compte (inscription gratuite). « Tout » = <b>Pack complet</b> (Modules 2 à 6). Le Module 1 est déjà gratuit pour tous les inscrits. Vous pouvez ré-accorder pour prolonger.</p></section>
  ${gererAcces}
  ${parrainageHtml}
  ${emploiHtml}
  <section class="card"><h2>Paiements à valider (${pend.length})</h2>
  ${pend.length ? pend.map(p => `<div class="row2"><span>${esc(p.email)} — ${esc(p.titre)} — ${money(p.montant)} — réf <code>${esc(p.reference || '')}</code></span>
    <form method="post" action="/admin/valider" class="inline">${csrfField(sess)}<input type="hidden" name="pid" value="${esc(p.id)}"><button class="btn small">Valider</button></form></div>`).join('') : '<p class="muted">Aucun paiement en attente.</p>'}</section>
  ${(function () { const a = annonceActive(); const suggestion = "🎁 Bonne nouvelle ! Pendant la promo, TOUS les modules (1 à 6) sont GRATUITS jusqu’au " + ((((cfg.promo) || {}).jusqu_au || '').slice(0, 10)) + ". Connectez-vous et profitez-en — attestation de fin de formation à la clé !"; return `<section class="card"><h2>📣 Message aux apprenants (annonce dans leur espace)</h2>
  ${a ? `<p class="muted" style="font-size:12px">Annonce actuellement affichée à tous les apprenants (publiée le ${esc((a.cree_le || '').slice(0, 10))}) :</p><div class="offre" style="margin:6px 0"><p style="margin:0;white-space:pre-wrap">${esc(a.message)}</p></div><form method="post" action="/admin/annonce-off" class="inline" style="margin:0 0 10px">${csrfField(sess)}<button class="btn small ghost" type="submit">Désactiver l'annonce</button></form>` : '<p class="muted">Aucune annonce active pour le moment.</p>'}
  <form method="post" action="/admin/annonce" class="form" style="margin:0">${csrfField(sess)}
    <textarea name="message" rows="4" maxlength="2000" required placeholder="Votre message aux apprenants…" style="width:100%">${esc(a ? a.message : suggestion)}</textarea>
    <p style="margin:6px 0 0"><button class="btn small" type="submit">📣 Publier l'annonce</button> <span class="muted" style="font-size:12px">— s'affiche en haut de l'espace de chaque apprenant à sa connexion.</span></p></form></section>`; })()}
  ${(function () { const b = annonceAccueil(); const suggestion = "🎓 L'attestation de fin de formation n'est délivrée qu'après réussite d'une évaluation finale avec le formateur."; return `<section class="card"><h2>🌐 Bannière sur la page d'accueil (visiteurs)</h2>
  <p class="muted" style="font-size:12px">Ce message s'affiche en haut de la <b>page d'accueil publique</b> (visible par tous les visiteurs, même non inscrits).</p>
  ${b ? `<p class="muted" style="font-size:12px">Bannière actuellement en ligne (publiée le ${esc((b.cree_le || '').slice(0, 10))}) :</p><div class="offre" style="margin:6px 0"><p style="margin:0;white-space:pre-wrap">${esc(b.message)}</p></div><form method="post" action="/admin/annonce-off" class="inline" style="margin:0 0 10px">${csrfField(sess)}<input type="hidden" name="cible" value="accueil"><button class="btn small ghost" type="submit">Retirer la bannière</button></form>` : '<p class="muted">Aucune bannière affichée sur l\'accueil.</p>'}
  <form method="post" action="/admin/annonce" class="form" style="margin:0">${csrfField(sess)}<input type="hidden" name="cible" value="accueil">
    <textarea name="message" rows="3" maxlength="2000" required placeholder="Message affiché sur l'accueil du site…" style="width:100%">${esc(b ? b.message : suggestion)}</textarea>
    <p style="margin:6px 0 0"><button class="btn small" type="submit">🌐 Publier sur l'accueil</button> <span class="muted" style="font-size:12px">— remplace la bannière précédente. « Retirer » la masque.</span></p></form></section>`; })()}
  <section class="card"><h2>📅 Google Agenda / Meet — RDV de test final</h2>
  <p class="muted" style="font-size:13px">Quand un apprenant programme son <b>test final en visio</b>, la plateforme crée l'événement <b>directement dans votre Google Agenda</b> (${esc(FORMATEUR_EMAIL)}) avec le <b>lien Meet généré automatiquement</b> et l'invitation envoyée aux deux parties.</p>
  ${googleConnected() ? `<p class="ok">✅ Google Agenda <b>connecté</b> — création automatique des Meet active.</p>
    <form method="post" action="/admin/google/off" class="inline" onsubmit="return confirm('Déconnecter Google Agenda ? Les RDV repasseront en mode manuel (e-mail).')">${csrfField(sess)}<button class="btn small ghost" type="submit">Déconnecter</button></form>`
    : googleEnvOk() ? `<p style="margin:6px 0"><a class="btn" href="/admin/google/connect">🔗 Connecter mon Google Agenda</a> <span class="muted" style="font-size:12px">— autorisez l'accès « Agenda » avec le compte ${esc(FORMATEUR_EMAIL)} (une seule fois).</span></p>`
    : `<p class="muted" style="font-size:13px">⚙️ <b>Configuration requise (une fois, ~5 min)</b> :</p>
    <ol class="muted" style="font-size:13px;line-height:1.7">
      <li>Sur <b>console.cloud.google.com</b> : créez un projet → activez l'API <b>Google Calendar</b>.</li>
      <li><b>Écran de consentement OAuth</b> : type Externe, ajoutez votre compte, puis passez en <b>Production</b> (sinon la connexion expire tous les 7 jours).</li>
      <li><b>Identifiants → Créer → ID client OAuth → Application Web</b> ; URI de redirection : <code>${esc(BASE_URL)}/admin/google/callback</code></li>
      <li>Copiez l'<b>ID client</b> et le <b>secret</b> dans Render → Environment : <code>GOOGLE_CLIENT_ID</code> et <code>GOOGLE_CLIENT_SECRET</code> → Save (redéploiement).</li>
      <li>Revenez ici et cliquez <b>Connecter mon Google Agenda</b>.</li>
    </ol>
    <p class="muted" style="font-size:12px">Sans cette connexion, les RDV restent enregistrés ici et notifiés par e-mail (mode manuel).</p>`}
  </section>
  <section class="card"><h2>Demandes / questions des apprenants (${dem.length})</h2>
  ${dem.length ? dem.map(d => `<div class="row2" style="flex-direction:column;align-items:stretch;gap:8px">
    <div><b>${esc(d.email)}</b>${d.tel ? ` · <span class="muted">${esc(d.tel)}</span>` : ''} — <b>${esc(d.sujet)}</b><br><span class="muted">${esc(d.message)}</span> <span class="muted">(${esc((d.cree_le || '').slice(0, 10))})</span></div>
    <form method="post" action="/admin/demande-repondre" class="form" style="margin:0">${csrfField(sess)}<input type="hidden" name="id" value="${esc(d.id)}">
      <textarea name="reponse" rows="3" required maxlength="3000" placeholder="Votre réponse à l'apprenant (s'affichera dans son espace)…" style="width:100%"></textarea>
      <div class="inline" style="margin-top:6px;gap:8px;flex-wrap:wrap"><button class="btn small" type="submit">✉️ Répondre</button>${d.tel ? `<a class="btn small ghost" target="_blank" rel="noopener" href="https://wa.me/${esc(String(d.tel).replace(/[^0-9]/g, ''))}?text=${encodeURIComponent('Bonjour, au sujet de votre question « ' + (d.sujet || '') + ' » : ')}">WhatsApp l'apprenant</a>` : ''}</div>
    </form>
    <form method="post" action="/admin/demande-traitee" class="inline" style="margin:0">${csrfField(sess)}<input type="hidden" name="id" value="${esc(d.id)}"><button class="btn small ghost" type="submit">Marquer traitée (sans réponse écrite)</button></form>
  </div>`).join('') : '<p class="muted">Aucune demande en attente.</p>'}</section>
  <section class="card"><h2>Apprenants (${users.length})</h2>
  <p class="muted" style="font-size:12px">Colonne <b>Modules (accès)</b> : <span style="color:#9a5b00">M1</span> = gratuit (tous les inscrits) · <span style="color:#16307a">M2–M6</span> = accès payé ou accordé · <span style="color:#1e7d46">Visio</span> = séance complémentaire · « expire » = fin d'accès.</p>
  ${promoLive() ? `<form method="post" action="/admin/promo-debloquer-tous" class="inline" style="margin:0 0 10px">${csrfField(sess)}<button class="btn small" type="submit">🎁 Débloquer TOUS les modules (promo) à tous les apprenants</button> <span class="muted" style="font-size:12px">— gratuit jusqu’au ${esc((((cfg.promo) || {}).jusqu_au || '').slice(0, 10))}. Les nouveaux inscrits sont débloqués automatiquement.</span></form>` : ''}
  <p class="muted" style="font-size:12px"><b>🎓 Attestation</b> : l'apprenant ne peut télécharger son attestation (signée/tamponnée) qu'<b>après votre validation</b> ci-dessous — à faire une fois l'<b>entretien/test final</b> réussi.</p>
  <table><tr><th>Nom</th><th>Email</th><th>Études</th><th>Niveau cabinet</th><th>Modules (accès)</th><th>2FA</th><th>Inscrit le</th><th>Dernier vu</th><th>🎓 Attestation</th></tr>
  ${users.map(u => `<tr><td>${(u.vu_le && u.vu_le > _cut5) ? '🟢 ' : ''}${esc(u.prenom)} ${esc(u.nom)}</td><td>${esc(u.email)}</td><td>${esc(u.niveau_etudes)}</td><td>${u.niveau_nom ? esc(u.niveau_nom) + (u.badges ? ` · ${u.badges}🎖️` : '') : '—'}</td><td>${modulesCell(u)}</td><td>${u.twofa ? 'oui' : 'non'}</td><td>${esc((u.cree_le || '').slice(0, 10))}</td><td>${u.vu_le ? esc(dateMG(u.vu_le)) : '—'}</td>
    <td>${u.attestation_ok
      ? `<span style="color:#1e7d46;font-weight:700;white-space:nowrap">✅ Validée</span>${u.attestation_le ? `<br><span class="muted" style="font-size:11px">le ${esc(u.attestation_le.slice(0, 10))}</span>` : ''}<br><form method="post" action="/admin/attestation" class="inline" onsubmit="return confirm('Annuler la validation de l\\'attestation ? L\\'apprenant ne pourra plus la télécharger.')" style="margin-top:4px">${csrfField(sess)}<input type="hidden" name="id" value="${esc(u.id)}"><input type="hidden" name="action" value="annuler"><button class="btn small ghost" type="submit">Annuler</button></form>`
      : `<form method="post" action="/admin/attestation" class="inline" onsubmit="return confirm('Confirmer : l\\'entretien/test final est réussi ? L\\'attestation deviendra téléchargeable.')">${csrfField(sess)}<input type="hidden" name="id" value="${esc(u.id)}"><input type="hidden" name="action" value="valider"><button class="btn small" type="submit">Valider</button></form>`}</td></tr>`).join('')}</table></section>`, sess);
}

// --- Service de fichiers statiques sécurisé ---
function serveStatic(res, baseDir, relPath, { course = false } = {}) {
  const safe = path.normalize(relPath).replace(/^(\.\.[\/\\])+/, '');
  const fp = path.join(baseDir, safe);
  if (!fp.startsWith(baseDir) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { send(res, 404, '404'); return; }
  const ext = path.extname(fp).toLowerCase();
  const types = { '.css': 'text/css', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp4': 'video/mp4', '.json': 'application/json', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon', '.pdf': 'application/pdf' };
  securityHeaders(res, { courseCSP: course, prod: PROD });
  // Cache : fichiers statiques mis en cache (CDN + navigateur) ; HTML jamais caché.
  const cc = ext === '.html' ? 'no-cache' : 'public, max-age=86400, stale-while-revalidate=604800';
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': cc });
  fs.createReadStream(fp).pipe(res);
}

// --- Cours protégé : filigrane personnalisé + anti-copie + blocage impression ---
// --- Droits d'accès par module (paywall : mod1 gratuit, mod2→mod6 payants) ---
const FREE_MODS = new Set((cfg.apercu && cfg.apercu.modules_gratuits) || ['mod1']);
function offerModules(code) { const o = (cfg.offres || []).find(x => x.code === code); return (o && o.modules) || []; }
function entitledModules(user) {
  const set = new Set(FREE_MODS);
  if (!user) return set;
  if (promoAccesLibre()) { MODULES.forEach(m => set.add(m.code)); return set; }
  if (user.role === 'admin') { MODULES.forEach(m => set.add(m.code)); return set; }
  const rows = db.prepare("SELECT offre_code FROM inscriptions WHERE user_id=? AND statut='active' AND (expire_le IS NULL OR expire_le > ?)").all(user.id, new Date().toISOString());
  for (const r of rows) offerModules(r.offre_code).forEach(c => set.add(c));
  return set;
}
function hasVisio(uid) { return !!db.prepare("SELECT 1 FROM inscriptions WHERE user_id=? AND offre_code='VISIO_1H' AND statut='active' AND (expire_le IS NULL OR expire_le > ?)").get(uid, new Date().toISOString()); }
let _lessonCount = null;
function courseLessonCount() {
  if (_lessonCount != null) return _lessonCount;
  try { const h = fs.readFileSync(path.join(ROOT, 'site', 'index.html'), 'utf8'); const lit = _extractLiteral(h, 'const MODID='); _lessonCount = lit ? Object.keys(JSON.parse(lit.json)).length : 30; }
  catch { _lessonCount = 30; }
  return _lessonCount;
}
function _extractLiteral(html, marker) {
  const m = html.indexOf(marker); if (m < 0) return null;
  let i = html.indexOf('{', m); if (i < 0) return null;
  const start = i; let d = 0, inS = false, esc2 = false;
  for (; i < html.length; i++) { const ch = html[i];
    if (inS) { if (esc2) esc2 = false; else if (ch === '\\') esc2 = true; else if (ch === '"') inS = false; continue; }
    if (ch === '"') inS = true; else if (ch === '{') d++; else if (ch === '}') { d--; if (d === 0) return { start, end: i + 1, json: html.slice(start, i + 1) }; }
  }
  return null;
}
// Remplace côté serveur le contenu des leçons des modules non débloqués (sécurité : le contenu n'est pas envoyé).
function gateCourse(html, entitled) {
  const conLit = _extractLiteral(html, 'const CONTENT=');
  const modLit = _extractLiteral(html, 'const MODID=');
  if (!conLit || !modLit) return html;
  let CONTENT, MODID;
  try { CONTENT = JSON.parse(conLit.json); MODID = JSON.parse(modLit.json); } catch { return html; }
  const lock = "<div style=\"text-align:center;padding:48px 20px\"><div style=\"font-size:48px\">🔒</div><h1 style=\"border:none\">Module verrouillé</h1><p>Cette leçon fait partie d'un module payant. Débloquez‑le depuis votre espace (Orange Money / MVola).</p><p><a href=\"/tableau-de-bord\" target=\"_top\" style=\"display:inline-block;background:#E8A13A;color:#1c2733;font-weight:700;padding:12px 20px;border-radius:9px;text-decoration:none\">Débloquer ce module →</a></p></div>";
  let changed = false;
  for (const id in MODID) { const code = MODID[id]; if (code && code !== 'free' && !entitled.has(code) && CONTENT[id] !== undefined) { CONTENT[id] = lock; changed = true; } }
  if (!changed) return html;
  return html.slice(0, conLit.start) + JSON.stringify(CONTENT) + html.slice(conLit.end);
}

function serveCourseIndex(res, sess) {
  let html;
  try { html = fs.readFileSync(path.join(ROOT, 'site', 'index.html'), 'utf8'); }
  catch { return send(res, 500, layout('Erreur', '<h1>Contenu indisponible</h1>', sess)); }
  html = gateCourse(html, entitledModules(sess && sess.user));
  // Base href pour que les chemins relatifs (img/..., cerfa.js) résolvent sous /formation/ même sans slash final.
  html = html.replace('<head>', '<head><base href="/formation/">');
  const email = esc(sess?.user?.email || '');
  const date = new Date().toISOString().slice(0, 10);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='370' height='210'><text x='8' y='120' transform='rotate(-30 185 105)' fill='rgba(20,40,70,0.10)' font-size='15' font-family='Arial'>${email} &#183; ${date}</text></svg>`;
  const wm = 'data:image/svg+xml,' + encodeURIComponent(svg);
  const inject = `
<style>html,body{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}
#__wm{position:fixed;inset:0;z-index:99998;pointer-events:none;background-image:url("${wm}");background-repeat:repeat}
@media print{html,body{display:none!important}}</style>
<div id="__wm"></div>
<script>(function(){var p=function(e){e.preventDefault();};['contextmenu','selectstart','copy','cut','dragstart'].forEach(function(ev){document.addEventListener(ev,p);});
document.addEventListener('keydown',function(e){var k=(e.key||'').toLowerCase();if((e.ctrlKey||e.metaKey)&&['c','x','s','p','u'].indexOf(k)>-1){e.preventDefault();}if(k==='printscreen'){try{navigator.clipboard&&navigator.clipboard.writeText(' ');}catch(_){}}});
window.addEventListener('beforeprint',function(){try{document.body.style.display='none';}catch(_){}});
window.addEventListener('afterprint',function(){try{document.body.style.display='';}catch(_){}});})();</script>
`;
  const courseBack = `<a href="/tableau-de-bord" title="Retour à mon espace" style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.18);color:#fff;padding:6px 11px;border-radius:7px;font:600 13px -apple-system,Segoe UI,Arial,sans-serif;text-decoration:none;white-space:nowrap;margin-right:4px">&#8592; Mon espace</a>`;
  html = html.replace('<header>', '<header>' + courseBack);
  html = html.replace('</body>', inject + '</body>');
  securityHeaders(res, { courseCSP: true, prod: PROD });
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache, must-revalidate' });
  res.end(html);
}

// --- Attestation personnalisée (générée par la plateforme) ---
function serveAttestation(res, sess, forceType) {
  const u = sess.user; const s = cfg.societe || {};
  const formateur = (cfg.formateur && cfg.formateur.nom) || s.cogerant || s.gerant || '';
  const fmt = d => d ? String(d).slice(0, 10).split('-').reverse().join('/') : '—';
  const today = new Date().toISOString().slice(0, 10).split('-').reverse().join('/');
  const nom = esc(((u.prenom || '') + ' ' + (u.nom || '')).trim()) || '[Apprenant]';
  // forceType ('stage' | 'fin') : aperçu admin ; sinon déterminé par la liste attestation_stage (email du stagiaire)
  const isStage = forceType === 'stage' ? true : forceType === 'fin' ? false : (cfg.attestation_stage || []).map(e => String(e).toLowerCase().trim()).includes((u.email || '').toLowerCase().trim());
  const aTitre = isStage ? 'ATTESTATION DE STAGE' : 'ATTESTATION DE FIN DE FORMATION';
  const aSub = isStage ? 'Stage de formation pratique en comptabilité française externalisée' : 'Formation complète en comptabilité française externalisée depuis Madagascar';
  const aNarr = isStage ? 'a effectué un <b>stage de formation pratique</b> en « <b>Comptabilité française externalisée</b> » (6 modules).' : 'a suivi la formation « <b>Comptabilité française externalisée depuis Madagascar</b> » (6 modules).';
  const aLegal = isStage ? ('Attestation de stage interne délivrée par ' + esc(s.nom || '') + ', attestant la réalisation d\'un stage pratique de formation ; sans valeur de diplôme d\'État.') : ('Attestation de fin de formation interne, sans valeur de diplôme d\'État ; elle atteste du suivi de la formation et du niveau opérationnel constaté à l\'évaluation finale.');
  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Attestation — ${esc(s.nom || '')}</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#eef1f5;font-family:Georgia,'Times New Roman',serif;color:#1c2733}
.sheet{max-width:820px;margin:24px auto;background:#fff;padding:48px 56px;border:1px solid #d8dee6;box-shadow:0 4px 18px rgba(20,40,70,.12);position:relative}
.sheet::before{content:'';position:absolute;inset:14px;border:2px solid #1F4E78;pointer-events:none}
.logo{display:block;margin:0 auto 6px;max-width:230px;height:auto}
h1{color:#1F4E78;text-align:center;font-size:26px;letter-spacing:1px;margin:10px 0 2px}
.sub{text-align:center;color:#555;font-style:italic;margin:0 0 22px}
p{line-height:1.7;margin:10px 0;font-size:16px}
.name{text-align:center;font-size:24px;font-weight:bold;color:#1F4E78;margin:18px 0;text-transform:uppercase;letter-spacing:1px}
.grid{display:flex;gap:24px;flex-wrap:wrap;margin:16px 0}
.box{flex:1;min-width:200px;background:#f4f7fb;border:1px solid #dbe4ee;border-radius:8px;padding:12px 16px}
.box .lbl{font-size:12px;color:#6b7785;text-transform:uppercase;letter-spacing:.5px}
.box .val{font-size:18px;font-weight:bold;color:#1F4E78}
.sig{margin-top:36px;font-weight:bold}
.legal{font-size:11px;color:#7a8694;font-style:italic;margin-top:26px;line-height:1.5}
.bar{text-align:center;margin:18px 0}
.btn{background:#E8A13A;color:#1c2733;border:none;padding:11px 20px;border-radius:9px;font-weight:bold;cursor:pointer;font-size:15px;font-family:Arial,sans-serif}
@media print{@page{size:A4;margin:0}body{background:#fff}.sheet{box-shadow:none;border:none;margin:0;max-width:none;padding:14mm 16mm}.noprint{display:none!important}}
</style></head><body>
<div class="bar noprint" style="max-width:820px;margin:14px auto 0"><button class="btn" onclick="window.print()">🖨️ Imprimer / Enregistrer en PDF</button> <a class="btn" style="text-decoration:none;background:#fff;border:1px solid #cfd8e3;color:#1F4E78" href="/tableau-de-bord">← Mon espace</a></div>
<div class="sheet">
  <img class="logo" src="/public/logo.jpg" alt="${esc(s.nom || '')}">
  <h1>${aTitre}</h1>
  <p class="sub">${aSub}</p>
  <p>Je soussigné <b>${esc(formateur)}</b>, formateur agissant pour la société <b>${esc(s.nom || '')}</b>, atteste que :</p>
  <p class="name">${nom}</p>
  <p style="text-align:center">${aNarr}</p>
  ${isStage ? `<div style="max-width:680px;margin:14px auto 4px;background:#f4f7fb;border:1px solid #dbe4ee;border-radius:8px;padding:16px 22px">
    <p style="margin:0 0 10px;text-align:center;color:#1F4E78;font-weight:bold;font-size:15px">Mentions de l'attestation de stage</p>
    <p style="margin:7px 0"><b>Lieu et adresse du stage :</b> ${esc(s.siege || 'Analamanga 105')}</p>
    <p style="margin:7px 0"><b>Période du stage :</b> du <b>__________________</b> au <b>__________________</b></p>
    <p style="margin:7px 0"><b>Durée totale :</b> <b>3 mois</b> <span style="font-size:13px;color:#6b7785">(soit 13 semaines — supérieure au minimum de 8 semaines requis)</span></p>
    <p style="margin:10px 0 4px"><b>Nature des missions confiées :</b></p>
    <ul style="margin:0;padding-left:20px;line-height:1.55;font-size:14px">
      <li>Saisie des achats, ventes, banque et OD selon le <b>PCG</b> ;</li>
      <li><b>TVA</b> française (CA3 / CA12), rapprochement bancaire et lettrage ;</li>
      <li>Travaux de <b>révision</b> : immobilisations, paie, comptes d'attente, clôture ;</li>
      <li>Préparation du <b>bilan</b>, du compte de résultat et de la <b>liasse fiscale</b> ;</li>
      <li>Pratique sur logiciel (<b>Pennylane</b>, Silae, Sage 50).</li>
    </ul>
    <p style="margin:10px 0 0;font-size:12px;color:#6b7785">Complétez les dates exactes de la période avant signature. Attestation à établir sur papier à en-tête de l'entreprise, signée et tamponnée (mentions conformes aux exigences DCG/DGC — UE 123 / UE 13).</p>
  </div>` : `<div style="max-width:660px;margin:14px auto 4px;background:#f4f7fb;border:1px solid #dbe4ee;border-radius:8px;padding:14px 20px">
    <p style="margin:0 0 6px;text-align:center;color:#1F4E78;font-weight:bold;font-size:15px">Compétences maîtrisées (résumé)</p>
    <ul style="margin:0;padding-left:20px;line-height:1.55;font-size:14px">
      <li>Tenue d'un dossier client : saisie achats, ventes, banque, OD selon le <b>PCG</b>.</li>
      <li><b>TVA</b> française : régimes, déclarations <b>CA3 / CA12</b>, rapprochement et lettrage.</li>
      <li>Logiciel <b>Pennylane</b> : saisie, import FEC, TVA et préparation de la liasse.</li>
      <li>Travaux de <b>révision</b> : immobilisations, paie, comptes d'attente, clôture.</li>
      <li><b>Fiscalité &amp; liasse</b> : IS/IR, BIC/BNC, CFE, bilan et liasse par régime.</li>
      <li>Posture <b>cabinet offshore</b> : justification des comptes, qualité, relation client.</li>
    </ul>
  </div>
  <div class="grid">
    <div class="box"><div class="lbl">Date d'inscription</div><div class="val">${fmt(u.cree_le)}</div></div>
    <div class="box"><div class="lbl">Résultat à l'évaluation finale</div><div class="val" id="result">…</div></div>
    <div class="box"><div class="lbl">Niveau délivré</div><div class="val" id="niveau">…</div></div>
  </div>
  <p id="warn" style="display:none;color:#c0392b;font-size:14px">⚠️ L'évaluation finale n'a pas encore été validée sur cet appareil. Passez le quiz final (Module 4) puis revenez ici.</p>`}
  ${u.attestation_le ? `<p style="text-align:center;color:#1e7d46;font-weight:bold;margin:16px 0 0">✔ Niveau opérationnel validé lors de l'entretien/test final du ${fmt(u.attestation_le)}.</p>` : ''}
  <p>Fait à <b>Analamanga 105</b>, le <b>${today}</b>.</p>
  <div style="display:flex;gap:28px;flex-wrap:wrap;align-items:flex-end;margin-top:18px">
    <div style="flex:1;min-width:220px">
      <p class="sig" style="margin:0">${esc(formateur)}</p>
      <p style="margin:2px 0 0;font-size:13px;color:#555">Formateur, ${esc(s.nom || '')}</p>
      <p style="margin:24px 0 0;border-top:1px solid #9aa6b2;width:200px;font-size:11px;color:#7a8694">Signature</p>
    </div>
    <div style="width:170px;height:110px;border:1.5px dashed #9aa6b2;border-radius:8px;display:flex;align-items:center;justify-content:center;text-align:center;color:#9aa6b2;font-size:12px;font-style:italic">Cachet de<br>l'organisme</div>
  </div>
  <p class="legal">${esc(s.denomination || s.nom || '')} — ${esc(s.forme || '')} au capital de ${esc(s.capital || '')} — ${esc(s.immat || '')}${s.siege ? ', ' + esc(s.siege) : ''}. ${aLegal}</p>
</div>
<script>(function(){try{var p=JSON.parse(localStorage.getItem('fce_progress_v1')||'{}');var f=p.quiz&&p.quiz.final;var el=document.getElementById('result'),nv=document.getElementById('niveau');if(f&&f.total){var pct=Math.round(f.score/f.total*100);el.textContent=pct+' / 100';nv.textContent=pct>=85?'Avancé — Collaborateur autonome':(pct>=70?'Intermédiaire confirmé':(pct>=55?'Débutant validé':'À repasser (seuil 55)'));}else{el.textContent='—';nv.textContent='—';document.getElementById('warn').style.display='block';}}catch(e){}})();</script>
</body></html>`;
  securityHeaders(res, { courseCSP: true, prod: PROD });
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache, must-revalidate' });
  res.end(html);
}

// --- Assistant IA (agent Claude) : base de connaissance + route /api/chat ---
function chatSystemPrompt() {
  const s = cfg.societe || {}, wa = s.whatsapp || '';
  const off = (cfg.offres || []).map(o => `- ${o.titre} : ${o.prix ? money(o.prix) : 'inclus'}`).join('\n');
  const acc = cfg.acces || {};
  const bonus = (cfg.parrainage && cfg.parrainage.bonus_jours) || 30;
  const dipl = (cfg.conditions && cfg.conditions.diplome_requis) || 'BAC+2 en comptabilité';
  return [
    "Tu es l'assistant virtuel d'« Académie Compta FR », qui prépare des Malgaches à devenir collaborateurs / réviseurs comptables pour des cabinets français (comptabilité externalisée), en cabinet à Madagascar ou en freelance payé en euros. La formation existe en DEUX formats : EN LIGNE (plateforme, accessible partout à Madagascar et à distance) et EN PRÉSENTIEL dans nos bureaux à Antananarivo (en renforcement).",
    "RÔLE : répondre aux DEMANDES D'INFORMATION des visiteurs (prospects) sur la formation (en ligne ET en présentiel), l'inscription, l'accès, le paiement et le parrainage.",
    "CHOIX DU FORMAT : si le visiteur demande comment se former, hésite, ou demande s'il y a du présentiel, présente brièvement les DEUX options et aide-le à choisir — EN LIGNE (à son rythme, partout, Module 1 gratuit, attestation après validation) ou EN PRÉSENTIEL dans nos bureaux à Antananarivo (petit groupe, accompagnement en personne sur les logiciels). Les deux sont complémentaires.",
    "LANGUE : réponds dans la langue du visiteur (français par défaut, malgache s'il écrit en malgache). Ton chaleureux, CONCIS (2 à 5 phrases), concret.",
    "PÉRIMÈTRE STRICT : tu parles UNIQUEMENT de cette formation et de son fonctionnement. Pour toute question hors sujet (actualité, code informatique, devoirs, conseil fiscal/juridique PERSONNALISÉ d'un dossier...), refuse poliment et propose de contacter un conseiller sur WhatsApp " + wa + ". Ne donne JAMAIS de conseil fiscal ou juridique personnalisé.",
    "N'INVENTE JAMAIS de prix ni de chiffres : utilise uniquement les informations ci-dessous. Si tu ne sais pas, dis-le simplement et renvoie vers WhatsApp " + wa + " ou la page Programme.",
    "INFORMATIONS OFFICIELLES :",
    promoLive() ? "- 🎁 PROMO EN COURS : TOUS les modules (1 à 6) sont GRATUITS jusqu’au " + promoFinFR() + " — il suffit de s'inscrire gratuitement, aucun paiement. Mets cette info en avant. L'attestation reste à la clé." : "- 6 modules. Le Module 1 (Fondamentaux) est 100 % GRATUIT après une inscription gratuite.",
    promoLive() ? "- Tarifs HORS PROMO (à titre indicatif seulement, NE PAS demander de payer pendant la promo) :" : "- Offres payantes :",
    off,
    "- Accès : " + (acc.illimite ? "illimité" : ((acc.duree_jours || 365) + " jours (12 mois)")) + " après paiement. Le Module 1 reste gratuit.",
    "- Sécurité : connexion par email + mot de passe (double authentification réservée à l'admin) + une seule session active à la fois (anti-partage de compte). Pas de blocage par adresse IP.",
    "- Parrainage : chaque inscrit a un code ; quand un filleul débloque un accès payant, le parrain gagne " + bonus + " jours d'accès offerts.",
    "- Paiement : " + (((cfg.paiements_manuels || []).filter(m => m.actif).map(m => m.nom).join(', ') || 'Orange Money') + (carteActive() ? ', ou carte bancaire' : '')) + " ; l'accès est activé après validation.",
    "- Prérequis : " + dipl + " (attestation sur l'honneur).",
    "- 100 % pratique : simulateurs interactifs type logiciel (interface inspirée de Pennylane, recolorée), CERFA réels à remplir, cas pratiques de cabinet. Attestation de fin de formation délivrée après un entretien/test final validé par le formateur.",
    "OPTION EN PRÉSENTIEL (page /presentiel) — formation complémentaire en personne :",
    "- Lieu : dans nos bureaux à Antananarivo (Ambobibao, près de MCB Banque, à côté de la station Total).",
    "- 3 modules : (1) Saisie & travaux journaliers, (2) Travaux périodiques & fiscaux, (3) Préparation & finalisation du bilan.",
    "- Pratique sur Pennylane ; intégration des écritures sur Silae & Sage 50.",
    "- Rythme : 2 h par jour, du lundi au vendredi, de 8h30 à 10h30. Petit groupe : 4 personnes maximum par module.",
    "- Tarif présentiel : " + money(presentielPrixModule()) + " par module (différent des tarifs en ligne ci-dessus).",
    "- Contact présentiel (inscription / dates) : 032 73 622 59 (appel ou WhatsApp). Détails sur la page /presentiel.",
    "- Contact humain (en ligne) : WhatsApp " + wa + ".",
    "FORMAT : texte simple (pas de markdown lourd, pas de tableaux). Termine si utile par une invitation à s'inscrire ou à contacter sur WhatsApp."
  ].join('\n');
}

// Clé API de l'assistant : variable d'env LLM_API_KEY, sinon "Secret File" Render (fichier monté à la racine ou /etc/secrets/).
function llmApiKey() {
  const env = (process.env.LLM_API_KEY || '').trim();
  if (env) return env;
  const cands = ['/etc/secrets/LLM_API_KEY', path.join(ROOT, 'LLM_API_KEY'), path.join(DIR || ROOT, 'LLM_API_KEY'), '/app/LLM_API_KEY', '/app/platform/LLM_API_KEY'];
  for (const p of cands) { try { const v = fs.readFileSync(p, 'utf8').trim(); if (v) return v; } catch { } }
  return '';
}

async function postApiChat(req, res, body) {
  const J = (obj, code) => { try { res.writeHead(code || 200, { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); } catch { } };
  try {
    const KEY = llmApiKey();
    if (!KEY || typeof fetch !== 'function') return J({ disabled: true });
    if (rateLimited('chat:' + ip(req), 25, 10 * 60000)) return J({ reply: "Vous avez envoyé beaucoup de messages 🙂 Patientez quelques minutes, ou écrivez-nous sur WhatsApp." });
    const q = (body.q || '').toString().slice(0, 1000).trim();
    if (!q) return J({ reply: "Posez votre question 🙂" });
    let hist = []; try { hist = JSON.parse(body.hist || '[]'); } catch { }
    if (!Array.isArray(hist)) hist = [];
    const msgs = hist.filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-6).map(m => ({ role: m.role, content: m.content.slice(0, 800) }));
    msgs.push({ role: 'user', content: q });
    const model = process.env.LLM_MODEL || 'claude-haiku-4-5';
    const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 20000);
    let r;
    try {
      r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model, max_tokens: 400, system: chatSystemPrompt(), messages: msgs }),
        signal: ctl.signal
      });
    } finally { clearTimeout(to); }
    if (!r.ok) { let etype = ''; try { const ed = await r.json(); etype = (ed && ed.error && (ed.error.message || ed.error.type)) || ''; } catch { } try { audit(db, null, 'chat_api_err', 'http ' + r.status + ' ' + etype, ip(req)); } catch { } return J({ error: true }); }
    const data = await r.json();
    const text = (data && Array.isArray(data.content) && data.content[0] && data.content[0].text) ? data.content[0].text.trim() : '';
    return text ? J({ reply: text }) : J({ error: true });
  } catch (e) { return J({ error: true }); }
}

// --- Offres d'emploi : mini-bourse interne + liens curés + agrégation RSS (optionnelle) ---
const _httpUrl = u => typeof u === 'string' && /^https?:\/\//i.test(u);
let _rssJobs = [];
function _stripTags(s) { return (s || '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim(); }
async function refreshRssJobs() {
  try {
    const flux = (cfg.emploi && cfg.emploi.flux_rss) || [];
    if (!flux.length || typeof fetch !== 'function') { _rssJobs = []; return; }
    const kw = /(comptab|compta|financ|fiscal|paie|audit|gestion)/i; const out = [];
    for (const url of flux) {
      try {
        const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 12000);
        const r = await fetch(url, { signal: ctl.signal, headers: { 'User-Agent': 'AcademieComptaFR/1.0' } }); clearTimeout(to);
        if (!r.ok) continue;
        const xml = await r.text();
        for (const it of xml.split(/<item[ >]/i).slice(1, 31)) {
          const t = _stripTags((it.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]);
          const lk = _stripTags((it.match(/<link>([\s\S]*?)<\/link>/i) || [])[1]);
          const ds = _stripTags((it.match(/<description>([\s\S]*?)<\/description>/i) || [])[1]).slice(0, 160);
          if (t && _httpUrl(lk) && (kw.test(t) || kw.test(ds))) out.push({ titre: t, lien: lk, desc: ds, source: ((url.match(/\/\/([^/]+)/) || [])[1] || '').replace(/^www\./, '') });
        }
      } catch { }
    }
    _rssJobs = out.slice(0, 30);
  } catch { _rssJobs = []; }
}
try { if (cfg.emploi && ((cfg.emploi.flux_rss) || []).length) { refreshRssJobs(); setInterval(refreshRssJobs, 30 * 60000).unref(); } } catch { }

function pageEmploi(sess) {
  const e = cfg.emploi || {};
  let internes = []; try { internes = db.prepare('SELECT * FROM offres_emploi ORDER BY cree_le DESC LIMIT 100').all(); } catch { }
  const intHtml = internes.length
    ? `<div class="grid">${internes.map(o => `<div class="offre"><h3>${esc(o.titre)}</h3><p class="muted" style="margin:2px 0">${esc(o.entreprise || '')}${o.lieu ? ' · ' + esc(o.lieu) : ''}${o.contrat ? ' · <b>' + esc(o.contrat) + '</b>' : ''}</p>${o.description ? `<p style="font-size:13.5px">${esc(o.description)}</p>` : ''}${_httpUrl(o.lien) ? `<p><a class="btn small" href="${esc(o.lien)}" target="_blank" rel="noopener">Postuler / en savoir plus →</a></p>` : ''}</div>`).join('')}</div>`
    : '<p class="muted">Aucune offre partenaire publiée pour le moment — consultez les portails ci-dessous, ou revenez bientôt.</p>';
  const rssHtml = _rssJobs.length
    ? `<section class="card"><h2>🌐 Offres récentes (portails)</h2><div class="tbl"><table><tr><th>Offre</th><th>Source</th></tr>${_rssJobs.map(j => `<tr><td><a href="${esc(j.lien)}" target="_blank" rel="noopener">${esc(j.titre)}</a></td><td class="muted">${esc(j.source)}</td></tr>`).join('')}</table></div></section>`
    : '';
  const liens = (e.liens || []).filter(l => _httpUrl(l.url)).map(l => `<a class="btn ghost" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.nom)} →</a>`).join(' ');
  return layout('Offres d\'emploi', `
  <section class="hero"><h1>💼 Offres d'emploi — comptabilité</h1>
  <p class="lead">Trouvez un poste en <b>cabinet d'externalisation à Madagascar</b> ou une <b>mission freelance</b> pour des cabinets français. Formez-vous, puis décrochez votre emploi.</p></section>
  <section class="card"><h2>🤝 Offres de nos partenaires</h2>${intHtml}</section>
  ${rssHtml}
  <section class="card"><h2>🔎 Chercher sur les portails (déjà filtrés « comptabilité »)</h2>
  <p>${liens || '<span class="muted">—</span>'}</p>
  <p class="muted" style="font-size:12px">Liens externes vers des sites partenaires (PortalJob, Asako, LinkedIn…). L'Académie Compta FR n'est pas responsable du contenu de ces sites.</p></section>`, sess);
}
function postEmploiAjouter(req, res, sess, body) {
  if (sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  const t = (body.titre || '').trim().slice(0, 120); if (t.length < 2) return redirect(res, '/admin');
  db.prepare('INSERT INTO offres_emploi(id,titre,entreprise,lieu,contrat,description,lien,cree_le) VALUES(?,?,?,?,?,?,?,?)')
    .run(rid(8), t, (body.entreprise || '').trim().slice(0, 100), (body.lieu || '').trim().slice(0, 80), (body.contrat || '').trim().slice(0, 40), (body.description || '').trim().slice(0, 1000), (body.lien || '').trim().slice(0, 300), new Date().toISOString());
  audit(db, sess.user.id, 'emploi_ajout', t, ip(req)); return redirect(res, '/admin');
}
function postEmploiRetirer(req, res, sess, body) {
  if (sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  db.prepare('DELETE FROM offres_emploi WHERE id=?').run((body.id || '').trim());
  return redirect(res, '/admin');
}

// --- Routeur ---
// ============================================================
// === LOGICIEL COMPTABLE — sandbox pédagogique (partie double) ===
// ============================================================
let _pcgL = null;
function pcgL() { if (!_pcgL) { try { _pcgL = JSON.parse(fs.readFileSync(path.join(ROOT, 'site', 'pcg.json'), 'utf8')); } catch { _pcgL = []; } } return _pcgL; }
function pcgNom(num) { const c = String(num || '').replace(/\s/g, ''); if (!c) return ''; let best = null; for (const a of pcgL()) { const nn = String(a.num); if (c.indexOf(nn) === 0) { if (!best || nn.length > best.n.length) best = { n: nn, nom: a.nom }; } } return best ? best.nom : ''; }
function eurf(n) { return (Math.round((n || 0) * 100) / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
const CPTA_JX = [['AC', 'Achats'], ['VT', 'Ventes'], ['BQ', 'Banque'], ['CA', 'Caisse'], ['OD', 'Opérations diverses']];
function ensureDossier(uid) {
  let d = db.prepare('SELECT * FROM cpta_dossiers WHERE user_id=? ORDER BY cree_le LIMIT 1').get(uid);
  if (!d) { const id = rid(10); db.prepare('INSERT INTO cpta_dossiers(id,user_id,nom,ex_debut,ex_fin,cree_le) VALUES(?,?,?,?,?,?)').run(id, uid, "Ma société d'entraînement", '2026-01-01', '2026-12-31', new Date().toISOString()); d = db.prepare('SELECT * FROM cpta_dossiers WHERE id=?').get(id); }
  return d;
}
// Dossier « actif » du collaborateur (sélection persistée) — sinon le premier (sandbox historique)
function currentDossier(uid) {
  const sel = db.prepare('SELECT cab_dossier FROM users WHERE id=?').get(uid);
  if (sel && sel.cab_dossier) { const d = db.prepare('SELECT * FROM cpta_dossiers WHERE id=? AND user_id=?').get(sel.cab_dossier, uid); if (d) return d; }
  return ensureDossier(uid);
}
function cptaBalance(did) { return db.prepare('SELECT compte, SUM(debit) d, SUM(credit) c FROM cpta_lignes WHERE dossier_id=? GROUP BY compte ORDER BY compte').all(did).map(r => ({ compte: r.compte, nom: pcgNom(r.compte), debit: r.d || 0, credit: r.c || 0, solde: (r.d || 0) - (r.c || 0) })); }
function cptaResultat(did) { const b = cptaBalance(did); let ch = 0, pr = 0; for (const r of b) { const cl = r.compte.charAt(0); if (cl === '6') ch += r.debit - r.credit; else if (cl === '7') pr += r.credit - r.debit; } return { charges: ch, produits: pr, resultat: pr - ch }; }
function cptaNav(active) { const items = [['/cabinet', '🏢 Cabinet'], ['/logiciel', 'Accueil'], ['/logiciel/saisie', '🖊️ Saisie'], ['/logiciel/grand-livre', '📒 Grand livre'], ['/logiciel/balance', '⚖️ Balance'], ['/logiciel/cadrage-tva', '🧾 Cadrage TVA'], ['/logiciel/etats', '📊 États']]; return '<p style="margin:0 0 12px">' + items.map(i => i[0] === active ? `<b>${esc(i[1])}</b>` : `<a href="${i[0]}">${esc(i[1])}</a>`).join(' &nbsp;·&nbsp; ') + '</p>'; }

function pageLogiciel(sess) {
  const u = sess.user, d = currentDossier(u.id);
  const nbE = db.prepare('SELECT COUNT(*) c FROM cpta_ecritures WHERE dossier_id=?').get(d.id).c;
  const tot = db.prepare('SELECT SUM(debit) d, SUM(credit) c FROM cpta_lignes WHERE dossier_id=?').get(d.id);
  const r = cptaResultat(d.id), eq = Math.abs((tot.d || 0) - (tot.c || 0)) < 0.005;
  return layout('Logiciel', `<h1>🧪 Logiciel comptable <span class="muted" style="font-size:13px;font-weight:400">· sandbox d'entraînement</span></h1>
  <p class="muted">Dossier actif : <b>${esc(d.nom)}</b> · exercice ${esc(d.ex_debut)} → ${esc(d.ex_fin)}. <a href="/cabinet">🏢 Changer de dossier / Espace cabinet →</a></p>
  <p class="muted">Saisissez de <b>vraies écritures</b> et voyez le <b>grand livre</b>, la <b>balance</b> et le <b>bilan</b> se calculer tout seuls.</p>
  <div class="grid">
   <a class="offre" href="/logiciel/saisie" style="text-decoration:none"><h3>🖊️ Saisie</h3><p class="muted">Passer une écriture par journal</p></a>
   <a class="offre" href="/logiciel/grand-livre" style="text-decoration:none"><h3>📒 Grand livre</h3><p class="muted">Le détail compte par compte</p></a>
   <a class="offre" href="/logiciel/balance" style="text-decoration:none"><h3>⚖️ Balance générale</h3><p class="muted">Soldes de tous les comptes</p></a>
   <a class="offre" href="/logiciel/etats" style="text-decoration:none"><h3>📊 États de synthèse</h3><p class="muted">Bilan & compte de résultat</p></a>
  </div>
  <section class="card"><h2>Synthèse</h2>
   <div class="stats"><div class="stat"><b>${nbE}</b><span>écriture${nbE > 1 ? 's' : ''}</span></div><div class="stat"><b>${eurf(tot.d || 0)}</b><span>total débit</span></div><div class="stat"><b>${eurf(tot.c || 0)}</b><span>total crédit</span></div><div class="stat"><b style="color:${r.resultat >= 0 ? '#1f8a4c' : '#c0392b'}">${eurf(r.resultat)}</b><span>résultat</span></div></div>
   <p class="muted" style="font-size:12px">Comptabilité ${eq ? '✅ équilibrée' : '⚠️ déséquilibrée'} (Σ débit = Σ crédit).</p>
   <p><a class="btn" href="/logiciel/saisie">+ Nouvelle écriture</a> ${nbE ? `<form method="post" action="/logiciel/reset" class="inline" style="margin:0" onsubmit="return confirm('Effacer TOUTES les écritures de votre société d\\'entraînement ?')">${csrfField(sess)}<button class="btn ghost" type="submit">↺ Réinitialiser le dossier</button></form>` : ''}</p>
  </section>`, sess);
}
function pageLogicielSaisie(sess, msg) {
  const d = currentDossier(sess.user.id);
  const recent = db.prepare('SELECT * FROM cpta_ecritures WHERE dossier_id=? ORDER BY cree_le DESC LIMIT 15').all(d.id);
  const lineRow = '<tr><td><input class="cc" placeholder="ex. 607" autocomplete="off" style="width:100%"></td><td><input class="cl" placeholder="libellé" style="width:100%"></td><td><input class="cd" inputmode="decimal" placeholder="0,00" style="width:100%;text-align:right"></td><td><input class="cr" inputmode="decimal" placeholder="0,00" style="width:100%;text-align:right"></td><td style="text-align:center"><button type="button" class="rm" title="Supprimer" style="border:none;background:#fbe7e7;color:#c0392b;border-radius:6px;width:26px;height:26px;cursor:pointer">×</button></td></tr>';
  return layout('Saisie', `<h1>🖊️ Nouvelle écriture</h1>${cptaNav('/logiciel/saisie')}
  ${msg ? `<p style="${/non|déséqu|erreur/i.test(msg) ? 'color:#c0392b' : 'color:#1f8a4c'};font-weight:600">${esc(msg)}</p>` : ''}
  <section class="card">
   <form method="post" action="/logiciel/saisie" id="cpta-form">${csrfField(sess)}<input type="hidden" name="lignes" id="cpta-json">
    <div class="row"><label>Journal<select name="journal">${CPTA_JX.map(j => `<option value="${j[0]}">${j[0]} — ${j[1]}</option>`).join('')}</select></label>
    <label>Date<input type="date" name="date" value="${esc(d.ex_debut)}"></label>
    <label>N° pièce<input name="piece" placeholder="facultatif"></label></div>
    <label>Libellé de l'écriture<input name="libelle" placeholder="ex. Achat de fournitures" required maxlength="160"></label>
    <table style="width:100%;border-collapse:collapse;margin:8px 0"><thead><tr><th style="text-align:left">Compte</th><th style="text-align:left">Libellé</th><th>Débit</th><th>Crédit</th><th></th></tr></thead><tbody id="cpta-lines">${lineRow + lineRow + lineRow + lineRow}</tbody></table>
    <p><button type="button" class="btn ghost small" id="cpta-add">+ Ligne</button></p>
    <p>Total débit : <b id="cpta-td">0,00</b> &nbsp;·&nbsp; Total crédit : <b id="cpta-tc">0,00</b> &nbsp;·&nbsp; <span id="cpta-bal" style="font-weight:700">déséquilibré</span></p>
    <button class="btn" type="submit">Enregistrer l'écriture</button></form>
  </section>
  <section class="card"><h2>Dernières écritures</h2>
   ${recent.length ? recent.map(e => { const ls = db.prepare('SELECT * FROM cpta_lignes WHERE ecriture_id=? ORDER BY debit DESC').all(e.id); const td = ls.reduce((s, l) => s + l.debit, 0); return `<div class="offre" style="margin-bottom:8px"><p style="margin:0 0 4px"><form method="post" action="/logiciel/ecriture-suppr" class="inline" style="float:right;margin:0">${csrfField(sess)}<input type="hidden" name="id" value="${esc(e.id)}"><button class="btn small ghost" title="Supprimer">🗑</button></form><b>${esc(e.journal)}</b> · ${esc(e.date)} · ${esc(e.libelle)} <span class="muted" style="font-size:11px">${eurf(td)} €</span></p><table style="width:100%;border-collapse:collapse;font-size:12.5px">${ls.map(l => `<tr><td style="padding:2px 6px">${esc(l.compte)}</td><td style="padding:2px 6px;color:#5a6b80">${esc(pcgNom(l.compte))}</td><td style="padding:2px 6px;text-align:right;color:#1554b8">${l.debit ? eurf(l.debit) : ''}</td><td style="padding:2px 6px;text-align:right;color:#9a5b00">${l.credit ? eurf(l.credit) : ''}</td></tr>`).join('')}</table></div>`; }).join('') : '<p class="muted">Aucune écriture — saisissez la première !</p>'}
  </section>
  <script src="/public/logiciel.js?v=${ASSET_V}" defer></script>`, sess);
}
function pageBalance(sess) {
  const d = currentDossier(sess.user.id), b = cptaBalance(d.id);
  const td = b.reduce((s, r) => s + r.debit, 0), tc = b.reduce((s, r) => s + r.credit, 0);
  return layout('Balance', `<h1>⚖️ Balance générale</h1>${cptaNav('/logiciel/balance')}
  <section class="card">${b.length ? `<table style="width:100%;border-collapse:collapse"><tr><th style="text-align:left">Compte</th><th style="text-align:left">Intitulé</th><th style="text-align:right">Débit</th><th style="text-align:right">Crédit</th><th style="text-align:right">Solde</th></tr>${b.map(r => `<tr><td><a href="/logiciel/grand-livre?c=${esc(r.compte)}">${esc(r.compte)}</a></td><td>${esc(r.nom)}</td><td style="text-align:right">${eurf(r.debit)}</td><td style="text-align:right">${eurf(r.credit)}</td><td style="text-align:right">${eurf(r.solde)}</td></tr>`).join('')}<tr style="font-weight:800;border-top:2px solid #16307a"><td colspan="2">TOTAUX</td><td style="text-align:right">${eurf(td)}</td><td style="text-align:right">${eurf(tc)}</td><td style="text-align:right">${eurf(td - tc)}</td></tr></table><p class="muted" style="font-size:12px">${Math.abs(td - tc) < 0.005 ? '✅ Balance équilibrée.' : '⚠️ Déséquilibre de ' + eurf(td - tc) + ' € — une écriture est fausse.'}</p>` : '<p class="muted">Aucune écriture. <a href="/logiciel/saisie">Saisir une écriture →</a></p>'}</section>`, sess);
}
function pageGrandLivre(sess, compte) {
  const d = currentDossier(sess.user.id);
  if (compte) {
    const ls = db.prepare('SELECT l.*, e.date d, e.journal j, e.libelle el FROM cpta_lignes l JOIN cpta_ecritures e ON e.id=l.ecriture_id WHERE l.dossier_id=? AND l.compte=? ORDER BY e.date, e.cree_le').all(d.id, compte);
    let s = 0; const rows = ls.map(l => { s += l.debit - l.credit; return `<tr><td>${esc(l.d)}</td><td>${esc(l.j)}</td><td>${esc(l.el || l.libelle)}</td><td style="text-align:right;color:#1554b8">${l.debit ? eurf(l.debit) : ''}</td><td style="text-align:right;color:#9a5b00">${l.credit ? eurf(l.credit) : ''}</td><td style="text-align:right;font-weight:700">${eurf(s)}</td></tr>`; }).join('');
    return layout('Grand livre', `<h1>📒 ${esc(compte)} <span class="muted" style="font-size:14px;font-weight:400">${esc(pcgNom(compte))}</span></h1>${cptaNav('/logiciel/grand-livre')}<section class="card">${ls.length ? `<table style="width:100%;border-collapse:collapse"><tr><th style="text-align:left">Date</th><th>Jl</th><th style="text-align:left">Libellé</th><th style="text-align:right">Débit</th><th style="text-align:right">Crédit</th><th style="text-align:right">Solde</th></tr>${rows}</table>` : '<p class="muted">Aucun mouvement sur ce compte.</p>'}</section>`, sess);
  }
  const b = cptaBalance(d.id);
  return layout('Grand livre', `<h1>📒 Grand livre</h1>${cptaNav('/logiciel/grand-livre')}<section class="card"><p class="muted">Choisissez un compte :</p>${b.length ? `<div class="prog">${b.map(r => `<div class="pitem"><span><a href="/logiciel/grand-livre?c=${esc(r.compte)}">${esc(r.compte)} ${esc(r.nom)}</a></span><b>${eurf(r.solde)}</b></div>`).join('')}</div>` : '<p class="muted">Aucune écriture.</p>'}</section>`, sess);
}
function pageEtats(sess) {
  const d = currentDossier(sess.user.id), b = cptaBalance(d.id), r = cptaResultat(d.id);
  const charges = b.filter(x => x.compte.charAt(0) === '6'), produits = b.filter(x => x.compte.charAt(0) === '7');
  const actif = b.filter(x => x.solde > 0.005 && '2345'.includes(x.compte.charAt(0)));
  const passif = b.filter(x => x.solde < -0.005 && '145'.includes(x.compte.charAt(0)));
  const totA = actif.reduce((s, x) => s + x.solde, 0), totPh = passif.reduce((s, x) => s - x.solde, 0), totP = totPh + r.resultat;
  const liR = (arr, sens) => arr.map(x => `<tr><td>${esc(x.compte)} ${esc(x.nom)}</td><td style="text-align:right">${eurf(sens === 'd' ? x.solde : -x.solde)}</td></tr>`).join('');
  return layout('États', `<h1>📊 États de synthèse</h1>${cptaNav('/logiciel/etats')}
  <section class="card"><h2>📈 Compte de résultat</h2>
   <div class="grid"><div><h3 style="color:#9a5b00">Charges (classe 6)</h3><table style="width:100%;border-collapse:collapse">${charges.length ? charges.map(x => `<tr><td>${esc(x.compte)} ${esc(x.nom)}</td><td style="text-align:right">${eurf(x.debit - x.credit)}</td></tr>`).join('') : '<tr><td class="muted">—</td></tr>'}<tr style="font-weight:800;border-top:1px solid #ccc"><td>Total charges</td><td style="text-align:right">${eurf(r.charges)}</td></tr></table></div>
   <div><h3 style="color:#1f8a4c">Produits (classe 7)</h3><table style="width:100%;border-collapse:collapse">${produits.length ? produits.map(x => `<tr><td>${esc(x.compte)} ${esc(x.nom)}</td><td style="text-align:right">${eurf(x.credit - x.debit)}</td></tr>`).join('') : '<tr><td class="muted">—</td></tr>'}<tr style="font-weight:800;border-top:1px solid #ccc"><td>Total produits</td><td style="text-align:right">${eurf(r.produits)}</td></tr></table></div></div>
   <p style="font-size:17px;margin-top:10px"><b>Résultat de l'exercice : <span style="color:${r.resultat >= 0 ? '#1f8a4c' : '#c0392b'}">${eurf(r.resultat)} €</span></b> (${r.resultat >= 0 ? 'bénéfice' : 'perte'})</p></section>
  <section class="card"><h2>⚖️ Bilan</h2>
   <div class="grid"><div><h3>ACTIF</h3><table style="width:100%;border-collapse:collapse">${liR(actif, 'd') || '<tr><td class="muted">—</td></tr>'}<tr style="font-weight:800;border-top:2px solid #16307a"><td>TOTAL ACTIF</td><td style="text-align:right">${eurf(totA)}</td></tr></table></div>
   <div><h3>PASSIF</h3><table style="width:100%;border-collapse:collapse">${liR(passif, 'c')}<tr><td>Résultat de l'exercice</td><td style="text-align:right">${eurf(r.resultat)}</td></tr><tr style="font-weight:800;border-top:2px solid #16307a"><td>TOTAL PASSIF</td><td style="text-align:right">${eurf(totP)}</td></tr></table></div></div>
   <p class="muted" style="font-size:12px">${Math.abs(totA - totP) < 0.01 ? '✅ Bilan équilibré : ACTIF = PASSIF.' : '⚠️ Bilan déséquilibré (vérifiez vos écritures).'}</p></section>`, sess);
}
// Cadrage TVA « comme en cabinet » : base HT par taux (comptes 7x) → TVA collectée théorique,
// comparée au 4457x comptabilisé ; écart, diagnostic et TVA à décaisser théorique.
function pageCadrageTva(sess, url) {
  const d = currentDossier(sess.user.id), b = cptaBalance(d.id);
  const produits = b.filter(x => x.compte.charAt(0) === '7' && Math.abs(x.credit - x.debit) > 0.004);
  const TAUX = ['20', '10', '5.5', '2.1', '0'];
  const sel = {};
  for (const r of produits) { let t = url.searchParams.get('t_' + r.compte) || '20'; if (!TAUX.includes(t)) t = '20'; sel[r.compte] = t; }
  let totBase = 0, totTheo = 0;
  const rows = produits.map(r => {
    const base = r.credit - r.debit, tx = parseFloat(sel[r.compte]), theo = Math.round(base * tx) / 100;
    totBase += base; totTheo += theo;
    return `<tr><td><a href="/logiciel/grand-livre?c=${esc(r.compte)}">${esc(r.compte)}</a></td><td>${esc(r.nom)}</td><td style="text-align:right">${eurf(base)}</td>
      <td style="text-align:center"><select name="t_${esc(r.compte)}" style="padding:4px 6px;border-radius:6px">${TAUX.map(t => `<option value="${t}"${sel[r.compte] === t ? ' selected' : ''}>${t.replace('.', ',')} %${t === '0' ? ' (exo)' : ''}</option>`).join('')}</select></td>
      <td style="text-align:right;font-weight:600">${eurf(theo)}</td></tr>`;
  }).join('');
  const coll = b.filter(x => x.compte.startsWith('4457')).reduce((s, x) => s + (x.credit - x.debit), 0);
  const ded = b.filter(x => x.compte.startsWith('44562') || x.compte.startsWith('44566')).reduce((s, x) => s + (x.debit - x.credit), 0);
  const autoliq = b.filter(x => x.compte.startsWith('4452')).reduce((s, x) => s + (x.credit - x.debit), 0);
  const ecart = totTheo - coll, ok = Math.abs(ecart) <= 1;
  const aDecaisser = coll - ded;
  return layout('Cadrage TVA', `<h1>🧾 Cadrage de TVA collectée</h1>${cptaNav('/logiciel/cadrage-tva')}
  <section class="card"><p class="muted" style="font-size:13px;margin-top:0"><b>La méthode cabinet :</b> ① ventiler le chiffre d'affaires (classe 7) par <b>taux de TVA</b> → ② calculer la <b>TVA théorique</b> (base × taux) → ③ la comparer à la <b>TVA collectée comptabilisée</b> (comptes 4457x) → ④ <b>justifier tout écart</b> avant de préparer la CA3.</p>
  ${produits.length ? `<form method="get" action="/logiciel/cadrage-tva">
  <table style="width:100%;border-collapse:collapse"><tr><th style="text-align:left">Compte</th><th style="text-align:left">Intitulé</th><th style="text-align:right">Base HT (solde)</th><th>Taux</th><th style="text-align:right">TVA théorique</th></tr>
  ${rows}
  <tr style="font-weight:800;border-top:2px solid #16307a"><td colspan="2">TOTAL</td><td style="text-align:right">${eurf(totBase)}</td><td></td><td style="text-align:right">${eurf(totTheo)}</td></tr></table>
  <p style="margin:10px 0 0"><button class="btn small" type="submit">🔄 Recalculer avec ces taux</button> <span class="muted" style="font-size:12px">— choisissez le taux applicable à chaque compte de produits (comme dans le tableur de cadrage du cabinet).</span></p></form>
  <div class="offre" style="margin-top:14px;border-left:4px solid ${ok ? '#1e7d46' : '#c0392b'}">
    <table style="width:100%;border-collapse:collapse">
      <tr><td>TVA collectée <b>théorique</b> (CA × taux)</td><td style="text-align:right;font-weight:700">${eurf(totTheo)}</td></tr>
      <tr><td>TVA collectée <b>comptabilisée</b> (4457x)</td><td style="text-align:right;font-weight:700">${eurf(coll)}</td></tr>
      <tr style="border-top:1px solid var(--line)"><td><b>Écart de cadrage</b></td><td style="text-align:right;font-weight:800;color:${ok ? '#1f8a4c' : '#c0392b'}">${eurf(ecart)}</td></tr>
    </table>
    <p style="margin:8px 0 0;font-weight:700">${ok ? '✅ TVA cadrée (écart ≤ 1 € : arrondis).' : '⚠️ Écart à justifier AVANT la déclaration.'}</p>
    ${ok ? '' : `<p class="muted" style="font-size:13px;margin:6px 0 0"><b>Causes classiques :</b> taux mal affecté ci-dessus (vente à 10 % taxée à 20 %…) · écriture de vente passée <b>sans TVA</b> (ou l'inverse) · <b>avoir</b> non ventilé · OD de TVA manquante · produits <b>hors champ</b> (75/76/77) à mettre à 0 % · décalage <b>encaissements/débits</b> (prestations). Ouvrez le <a href="/logiciel/grand-livre?c=44571">grand livre du 44571</a> et pointez ligne à ligne.</p>`}
  </div>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:14px">
    <div class="offre"><div class="muted" style="font-size:12px">TVA déductible comptabilisée (44562 + 44566)</div><b style="font-size:18px">${eurf(ded)}</b></div>
    ${Math.abs(autoliq) > 0.004 ? `<div class="offre"><div class="muted" style="font-size:12px">TVA autoliquidée (4452x) — neutre si reprise en déductible</div><b style="font-size:18px">${eurf(autoliq)}</b></div>` : ''}
    <div class="offre"><div class="muted" style="font-size:12px">${aDecaisser >= 0 ? 'TVA à décaisser théorique (→ 44551)' : 'Crédit de TVA théorique (→ 44567)'}</div><b style="font-size:18px;color:${aDecaisser >= 0 ? '#9a5b00' : '#1f8a4c'}">${eurf(Math.abs(aDecaisser))}</b></div>
  </div>
  <p class="muted" style="font-size:12px;margin-top:12px">📌 <b>Réflexe cabinet :</b> on <b>cadre la TVA chaque mois AVANT la CA3</b> et on archive le cadrage au dossier de révision (cycle TVA). Un écart non justifié = risque de rappel en cas de contrôle.</p>`
    : `<p class="muted">Aucun produit (classe 7) saisi pour l'instant. <a href="/logiciel/saisie">Saisissez d'abord des ventes →</a> puis revenez cadrer la TVA.</p>`}
  </section>`, sess);
}
function postLogicielSaisie(req, res, sess, body) {
  if (!authed(sess)) return redirect(res, '/connexion');
  const d = currentDossier(sess.user.id);
  const journal = String(body.journal || 'OD').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'OD';
  const date = (String(body.date || '').slice(0, 10)) || new Date().toISOString().slice(0, 10);
  const lib = String(body.libelle || '').trim().slice(0, 160);
  const piece = String(body.piece || '').trim().slice(0, 40);
  let raw = []; try { raw = JSON.parse(body.lignes || '[]'); } catch { raw = []; }
  const numv = v => { v = ('' + (v == null ? '' : v)).replace(/\s/g, '').replace(',', '.').replace(/[^0-9.\-]/g, ''); const n = parseFloat(v); return isNaN(n) ? 0 : n; };
  const lignes = [];
  for (const l of (Array.isArray(raw) ? raw : [])) { const cpt = String(l.compte || '').replace(/\s/g, '').toUpperCase().slice(0, 12); const dd = numv(l.debit), cc = numv(l.credit); if (cpt && (dd || cc)) lignes.push({ compte: cpt, libelle: String(l.libelle || '').slice(0, 120), debit: dd, credit: cc }); }
  const sd = lignes.reduce((s, l) => s + l.debit, 0), sc = lignes.reduce((s, l) => s + l.credit, 0);
  if (!lib || lignes.length < 2 || sd <= 0 || Math.abs(sd - sc) >= 0.005) return send(res, 200, pageLogicielSaisie(sess, 'Écriture non enregistrée : libellé + au moins 2 lignes équilibrées (Σ débit = Σ crédit > 0).'));
  const eid = rid(10), now = new Date().toISOString();
  db.prepare('INSERT INTO cpta_ecritures(id,dossier_id,journal,date,libelle,piece,cree_le) VALUES(?,?,?,?,?,?,?)').run(eid, d.id, journal, date, lib, piece, now);
  const ins = db.prepare('INSERT INTO cpta_lignes(id,ecriture_id,dossier_id,compte,libelle,debit,credit) VALUES(?,?,?,?,?,?,?)');
  for (const l of lignes) ins.run(rid(10), eid, d.id, l.compte, l.libelle, l.debit, l.credit);
  audit(db, sess.user.id, 'cpta_ecriture', journal + ' ' + eurf(sd), ip(req));
  return send(res, 200, pageLogicielSaisie(sess, 'Écriture enregistrée ✅'));
}
function postLogicielSuppr(req, res, sess, body) {
  if (!authed(sess)) return redirect(res, '/connexion');
  const d = currentDossier(sess.user.id);
  const e = db.prepare('SELECT id FROM cpta_ecritures WHERE id=? AND dossier_id=?').get(body.id, d.id);
  if (e) { db.prepare('DELETE FROM cpta_lignes WHERE ecriture_id=?').run(e.id); db.prepare('DELETE FROM cpta_ecritures WHERE id=?').run(e.id); }
  return redirect(res, '/logiciel/saisie');
}
function postLogicielReset(req, res, sess, body) {
  if (!authed(sess)) return redirect(res, '/connexion');
  const d = currentDossier(sess.user.id);
  db.prepare('DELETE FROM cpta_lignes WHERE dossier_id=?').run(d.id);
  db.prepare('DELETE FROM cpta_ecritures WHERE dossier_id=?').run(d.id);
  audit(db, sess.user.id, 'cpta_reset', '', ip(req));
  return redirect(res, '/logiciel');
}

// ============================================================
// === ESPACE CABINET — cockpit multi-dossiers (chef de mission) ===
// ============================================================
const CAB_FORMES = ['Micro-entreprise', 'Entreprise individuelle', 'EURL', 'SARL', 'SAS', 'SASU', 'SA', 'SNC', 'SCI', 'Association', 'Autre'];
const CAB_FISC = ['IR', 'IS'];
const CAB_TVA = ['Franchise en base', 'Réel simplifié', 'Réel normal mensuel', 'Réel normal trimestriel'];
const CAB_ACTIV = ['BIC — commercial', 'BIC — prestations de services', 'BNC — libéral', 'BA — agricole', 'LMNP / LMP', 'SCI', "Services à la personne", 'Autre'];
const CAB_STATUTS = [['actif', '🟢 Actif'], ['ajour', '✅ À jour'], ['retard', '🔴 En retard'], ['attente', '⏳ Attente client'], ['archive', '📦 Archivé']];
const cabStatutLabel = s => (CAB_STATUTS.find(x => x[0] === s) || CAB_STATUTS[0])[1];
const CAB_CHECK = [
  ['pieces', '📥 Pièces du mois collectées (achats, ventes, banque)'],
  ['banque', '🏦 Banque saisie & rapprochée'],
  ['tva', '🧾 TVA cadrée (collectée / déductible)'],
  ['c471', "🟠 Compte 471 d'attente soldé"],
  ['lettrage', '🔗 Clients / fournisseurs lettrés'],
  ['paie', '👥 Paie & charges sociales saisies'],
  ['od', '🧮 OD du mois (abonnements, FNP/FAE, OD de TVA)'],
  ['revue', '🔍 Revue & validation chef de mission'],
];
function cabPeriode() { return new Date().toISOString().slice(0, 7); }
function cabPeriodeFR(per) { const [y, m] = (per || '').split('-'); const MN = ['', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']; return (MN[+m] || '') + ' ' + (y || ''); }
function cabChecklist(did, per) {
  const rows = db.prepare('SELECT cle, fait FROM cab_taches WHERE dossier_id=? AND periode=?').all(did, per);
  const m = {}; for (const r of rows) m[r.cle] = r.fait;
  return CAB_CHECK.map(([cle, lib]) => ({ cle, libelle: lib, fait: !!m[cle] }));
}
function cptaSoldePrefix(did, prefix) { const r = db.prepare('SELECT COALESCE(SUM(debit-credit),0) s FROM cpta_lignes WHERE dossier_id=? AND compte LIKE ?').get(did, prefix + '%'); return r.s || 0; }
function cabHealth(did) {
  const tot = db.prepare('SELECT COALESCE(SUM(debit),0) d, COALESCE(SUM(credit),0) c FROM cpta_lignes WHERE dossier_id=?').get(did);
  const eq = Math.abs((tot.d || 0) - (tot.c || 0)) < 0.005;
  const s471 = cptaSoldePrefix(did, '471');
  const tvaColl = -cptaSoldePrefix(did, '4457');   // crédit → collectée
  const tvaDed = cptaSoldePrefix(did, '4456');     // débit → déductible
  const nbEcr = db.prepare('SELECT COUNT(*) c FROM cpta_ecritures WHERE dossier_id=?').get(did).c;
  const per = cabPeriode(), ch = cabChecklist(did, per), done = ch.filter(t => t.fait).length;
  const r = cptaResultat(did);
  return { eq, s471, tvaColl, tvaDed, tvaNet: tvaColl - tvaDed, nbEcr, per, done, total: ch.length, resultat: r.resultat };
}
function dossiersOf(uid) { return db.prepare("SELECT * FROM cpta_dossiers WHERE user_id=? ORDER BY (COALESCE(statut,'actif')='archive'), cree_le").all(uid); }
function cabOwnDossier(uid, id) { return db.prepare('SELECT * FROM cpta_dossiers WHERE id=? AND user_id=?').get(id, uid); }
const selOpts = (arr, cur) => arr.map(o => { const v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o; return `<option value="${esc(v)}"${v === cur ? ' selected' : ''}>${esc(l)}</option>`; }).join('');

function pageCabinet(sess) {
  const uid = sess.user.id, ds = dossiersOf(uid), actifId = currentDossier(uid).id;
  const H = ds.map(d => ({ d, h: cabHealth(d.id) }));
  const aTraiter = H.filter(x => (x.d.statut || 'actif') !== 'archive' && (x.h.done < x.h.total || (x.h.nbEcr > 0 && !x.h.eq) || Math.abs(x.h.s471) > 0.005));
  const nbActifs = ds.filter(d => (d.statut || 'actif') !== 'archive').length;
  const desequ = H.filter(x => x.h.nbEcr > 0 && !x.h.eq).length;
  const a471 = H.filter(x => Math.abs(x.h.s471) > 0.005).length;
  const card = (d, h) => `<div class="offre"${d.id === actifId ? ' style="border-color:rgba(56,232,255,.45);box-shadow:0 0 0 1px rgba(56,232,255,.25),0 0 22px rgba(56,232,255,.10)"' : ''}>
     <p style="margin:0 0 6px;display:flex;justify-content:space-between;gap:8px;align-items:center"><b style="font-size:15px;color:#fff">${esc(d.nom)}</b><span class="pill" style="padding:3px 10px;font-size:11px">${cabStatutLabel(d.statut || 'actif')}</span></p>
     <p class="muted" style="font-size:12px;margin:0 0 8px">${esc(d.forme || '—')} · ${esc(d.regime_fiscal || '?')} · TVA ${esc(d.regime_tva || '—')}${d.id === actifId ? ' · <span style="color:#38e8ff">● dossier actif</span>' : ''}</p>
     <div style="display:flex;flex-wrap:wrap;gap:6px;font-size:11.5px;margin-bottom:10px">
       <span class="pill" style="padding:3px 9px">📒 ${h.nbEcr} écr.</span>
       <span class="pill" style="padding:3px 9px">${h.eq ? '⚖️ équilibré' : '⚠️ déséquilibré'}</span>
       <span class="pill" style="padding:3px 9px">${Math.abs(h.s471) > 0.005 ? '🟠 471 = ' + eurf(h.s471) + ' €' : '🟠 471 soldé'}</span>
       <span class="pill" style="padding:3px 9px">✔️ ${h.done}/${h.total}</span>
     </div>
     <p style="margin:0;display:flex;gap:6px;flex-wrap:wrap">
       <a class="btn small" href="/cabinet/dossier?id=${esc(d.id)}">Ouvrir</a>
       <form method="post" action="/cabinet/ouvrir" class="inline" style="margin:0">${csrfField(sess)}<input type="hidden" name="id" value="${esc(d.id)}"><input type="hidden" name="next" value="/logiciel/saisie"><button class="btn small ghost" type="submit">🖊️ Saisir</button></form>
     </p></div>`;
  return layout('Espace cabinet', `<h1>🏢 Espace cabinet <span class="muted" style="font-size:13px;font-weight:400">· cockpit chef de mission</span></h1>
  <p class="muted">Gérez <b>tous vos dossiers clients</b> comme en cabinet d'externalisation : tableau de bord, checklist mensuelle, suivi du compte 471, cadrage TVA — puis basculez dans le moteur comptable pour saisir.</p>
  <section class="card"><h2>📊 Tableau de bord chef de mission</h2>
   <div class="stats">
     <div class="stat"><b>${nbActifs}</b><span>dossiers actifs</span></div>
     <div class="stat"><b>${aTraiter.length}</b><span>à traiter ce mois</span></div>
     <div class="stat"><b>${desequ}</b><span>déséquilibrés</span></div>
     <div class="stat"><b>${a471}</b><span>471 à solder</span></div>
   </div>
   ${aTraiter.length ? `<h3 style="margin-bottom:6px">🗂️ Dossiers à traiter (${cabPeriodeFR(cabPeriode())})</h3><div class="tbl"><table><tr><th>Dossier</th><th>Checklist</th><th>Équilibre</th><th>471</th><th></th></tr>
   ${aTraiter.map(x => `<tr><td>${esc(x.d.nom)}</td><td>${x.h.done}/${x.h.total}</td><td>${x.h.eq ? '✅' : '⚠️'}</td><td>${Math.abs(x.h.s471) > 0.005 ? '🟠 ' + eurf(x.h.s471) + ' €' : '✅'}</td><td><a href="/cabinet/dossier?id=${esc(x.d.id)}">Traiter →</a></td></tr>`).join('')}</table></div>` : (ds.length ? '<p class="ok">✅ Tous les dossiers sont à jour ce mois-ci.</p>' : '<p class="muted">Aucun dossier pour l\'instant — créez votre premier dossier client ci-dessous.</p>')}
  </section>
  <section class="card"><h2>📁 Mes dossiers</h2>
   <p><a class="btn" href="/cabinet/nouveau">+ Nouveau dossier client</a></p>
   ${ds.length ? `<div class="grid">${ds.map(d => card(d, cabHealth(d.id))).join('')}</div>` : ''}
  </section>`, sess);
}

function cabDossierForm(sess, d) {
  d = d || {};
  const isNew = !d.id;
  return `<form method="post" action="/cabinet/dossier" class="form">${csrfField(sess)}${isNew ? '' : `<input type="hidden" name="id" value="${esc(d.id)}">`}
   <label>Nom du dossier / société<input name="nom" required maxlength="80" value="${esc(d.nom || '')}" placeholder="ex. ABC TRANSPORT"></label>
   <div class="row"><label>Forme juridique<select name="forme">${selOpts(CAB_FORMES, d.forme || 'SARL')}</select></label>
   <label>Régime fiscal<select name="regime_fiscal">${selOpts(CAB_FISC, d.regime_fiscal || 'IS')}</select></label></div>
   <div class="row"><label>Régime de TVA<select name="regime_tva">${selOpts(CAB_TVA, d.regime_tva || 'Réel normal mensuel')}</select></label>
   <label>Activité<select name="activite">${selOpts(CAB_ACTIV, d.activite || 'BIC — commercial')}</select></label></div>
   <div class="row"><label>Début d'exercice<input type="date" name="ex_debut" value="${esc(d.ex_debut || '2026-01-01')}"></label>
   <label>Clôture<input type="date" name="ex_fin" value="${esc(d.ex_fin || '2026-12-31')}"></label></div>
   <div class="row"><label>Collaborateur affecté<input name="collaborateur" maxlength="60" value="${esc(d.collaborateur || ((sess.user.prenom || '') + ' ' + (sess.user.nom || '')).trim())}"></label>
   <label>SIREN/SIRET (facultatif)<input name="siren" maxlength="20" value="${esc(d.siren || '')}"></label></div>
   ${isNew ? '' : `<label>Statut du dossier<select name="statut">${selOpts(CAB_STATUTS, d.statut || 'actif')}</select></label>`}
   <p style="margin-top:14px"><button class="btn" type="submit">${isNew ? 'Créer le dossier' : 'Enregistrer'}</button> <a class="btn ghost" href="/cabinet">Annuler</a></p>
  </form>`;
}
function pageCabinetNew(sess) {
  return layout('Nouveau dossier', `<h1>➕ Nouveau dossier client</h1>
  <p style="margin:0 0 12px"><a href="/cabinet">← Espace cabinet</a></p>
  <section class="card">${cabDossierForm(sess, null)}</section>`, sess);
}
function pageCabinetDossier(sess, id, per) {
  const uid = sess.user.id, d = cabOwnDossier(uid, id);
  if (!d) return layout('Dossier', '<h1>Dossier introuvable</h1><p><a href="/cabinet">← Espace cabinet</a></p>', sess);
  per = /^\d{4}-\d{2}$/.test(per || '') ? per : cabPeriode();
  const h = cabHealth(d.id), ch = cabChecklist(d.id, per), actif = currentDossier(uid).id === d.id;
  const l471 = db.prepare("SELECT e.date dt, e.libelle el, l.libelle ll, l.compte, l.debit, l.credit FROM cpta_lignes l JOIN cpta_ecritures e ON e.id=l.ecriture_id WHERE l.dossier_id=? AND l.compte LIKE '471%' ORDER BY e.date, e.cree_le").all(d.id);
  const checkRow = t => `<label class="row2" style="cursor:pointer"><span style="display:flex;align-items:center;gap:10px"><form method="post" action="/cabinet/tache" class="inline" style="margin:0">${csrfField(sess)}<input type="hidden" name="id" value="${esc(d.id)}"><input type="hidden" name="per" value="${esc(per)}"><input type="hidden" name="cle" value="${esc(t.cle)}"><button type="submit" title="Cocher/décocher" style="width:24px;height:24px;border-radius:7px;border:1px solid var(--line);background:${t.fait ? 'var(--ok)' : 'rgba(255,255,255,.05)'};color:#04210f;font-weight:900;cursor:pointer">${t.fait ? '✓' : ''}</button></form><span style="${t.fait ? 'opacity:.55;text-decoration:line-through' : ''}">${esc(t.libelle)}</span></span></label>`;
  const shift = (sg) => { const [y, m] = per.split('-').map(Number); let nm = m + sg, ny = y; if (nm < 1) { nm = 12; ny--; } if (nm > 12) { nm = 1; ny++; } return ny + '-' + String(nm).padStart(2, '0'); };
  const prevPer = shift(-1), nextPer = shift(1);
  return layout('Dossier ' + d.nom, `<h1>📁 ${esc(d.nom)} <span class="pill" style="font-size:12px">${cabStatutLabel(d.statut || 'actif')}</span></h1>
  <p style="margin:0 0 12px"><a href="/cabinet">← Espace cabinet</a> · ${esc(d.forme || '—')} · ${esc(d.regime_fiscal || '?')} · TVA ${esc(d.regime_tva || '—')} · exercice ${esc(d.ex_debut)} → ${esc(d.ex_fin)} · 👤 ${esc(d.collaborateur || '—')}</p>
  <section class="card"><h2>📊 Santé du dossier</h2>
   <div class="stats">
     <div class="stat"><b>${h.nbEcr}</b><span>écritures</span></div>
     <div class="stat"><b style="color:${h.eq ? '#34d399' : '#f87171'}">${h.eq ? '✅' : '⚠️'}</b><span>équilibre</span></div>
     <div class="stat"><b style="color:${Math.abs(h.s471) > 0.005 ? '#f59e0b' : '#34d399'}">${eurf(h.s471)}</b><span>compte 471</span></div>
     <div class="stat"><b>${eurf(h.tvaNet)}</b><span>TVA nette (estim.)</span></div>
     <div class="stat"><b style="color:${h.resultat >= 0 ? '#34d399' : '#f87171'}">${eurf(h.resultat)}</b><span>résultat</span></div>
   </div>
   <p style="margin:6px 0 0;display:flex;gap:8px;flex-wrap:wrap">
     <form method="post" action="/cabinet/ouvrir" class="inline" style="margin:0">${csrfField(sess)}<input type="hidden" name="id" value="${esc(d.id)}"><input type="hidden" name="next" value="/logiciel/saisie"><button class="btn" type="submit">🖊️ Saisir des écritures</button></form>
     <form method="post" action="/cabinet/ouvrir" class="inline" style="margin:0">${csrfField(sess)}<input type="hidden" name="id" value="${esc(d.id)}"><input type="hidden" name="next" value="/logiciel/cadrage-tva"><button class="btn ghost" type="submit">🧾 Cadrer la TVA</button></form>
     <form method="post" action="/cabinet/ouvrir" class="inline" style="margin:0">${csrfField(sess)}<input type="hidden" name="id" value="${esc(d.id)}"><input type="hidden" name="next" value="/logiciel/etats"><button class="btn ghost" type="submit">📊 Bilan & résultat</button></form>
     ${actif ? '<span class="pill" style="align-self:center">● dossier actif dans le moteur</span>' : ''}
   </p></section>
  <section class="card"><h2>✔️ Checklist mensuelle <span class="muted" style="font-size:13px;font-weight:400">— ${cabPeriodeFR(per)}</span></h2>
   <p style="margin:0 0 8px"><a class="btn ghost small" href="/cabinet/dossier?id=${esc(d.id)}&per=${prevPer}">← ${esc(cabPeriodeFR(prevPer))}</a> <a class="btn ghost small" href="/cabinet/dossier?id=${esc(d.id)}&per=${nextPer}">${esc(cabPeriodeFR(nextPer))} →</a> <span class="muted" style="font-size:12px">avancement ${ch.filter(t => t.fait).length}/${ch.length}</span></p>
   <div>${ch.map(checkRow).join('')}</div>
   <p class="muted" style="font-size:12px;margin-top:10px">📌 Réflexe cabinet : on coche au fur et à mesure ; un dossier n'est « bon à réviser » que lorsque la checklist du mois est complète.</p></section>
  <section class="card"><h2>🟠 Suivi du compte 471 (attente)</h2>
   ${l471.length ? `<div class="tbl"><table><tr><th>Date</th><th>Libellé</th><th style="text-align:right">Débit</th><th style="text-align:right">Crédit</th></tr>
   ${l471.map(l => `<tr><td>${esc(l.dt)}</td><td>${esc(l.ll || l.el)}</td><td style="text-align:right">${l.debit ? eurf(l.debit) : ''}</td><td style="text-align:right">${l.credit ? eurf(l.credit) : ''}</td></tr>`).join('')}
   <tr style="font-weight:800;border-top:2px solid #16307a"><td colspan="2">Solde 471</td><td colspan="2" style="text-align:right">${eurf(h.s471)} €</td></tr></table></div>
   <p class="muted" style="font-size:12px;margin-top:8px">${Math.abs(h.s471) > 0.005 ? "⚠️ Le 471 doit être <b>soldé</b> avant la révision : chaque ligne d'attente doit être reclassée dans le bon compte (OD)." : '✅ Compte 471 soldé.'}</p>`
    : '<p class="muted">Aucun mouvement sur un compte 471 — rien en attente. 👍</p>'}</section>
  <details class="card"><summary style="font-weight:700;color:#fff;cursor:pointer">⚙️ Modifier la fiche du dossier</summary><div style="margin-top:12px">${cabDossierForm(sess, d)}
   <form method="post" action="/cabinet/suppr" onsubmit="return confirm('Supprimer définitivement ce dossier et toutes ses écritures ?')" style="margin-top:10px">${csrfField(sess)}<input type="hidden" name="id" value="${esc(d.id)}"><button class="btn ghost small" type="submit" style="color:#f87171">🗑 Supprimer ce dossier</button></form></div></details>`, sess);
}
function postCabinetDossier(req, res, sess, body) {
  if (!authed(sess)) return redirect(res, '/connexion');
  const uid = sess.user.id;
  const v = (k, max) => String(body[k] || '').trim().slice(0, max || 80);
  const nom = v('nom', 80); if (!nom) return redirect(res, '/cabinet/nouveau');
  const fields = { forme: v('forme'), regime_fiscal: v('regime_fiscal'), regime_tva: v('regime_tva'), activite: v('activite'), collaborateur: v('collaborateur', 60), siren: v('siren', 20), ex_debut: v('ex_debut', 10) || '2026-01-01', ex_fin: v('ex_fin', 10) || '2026-12-31' };
  const statut = (CAB_STATUTS.find(s => s[0] === v('statut')) || ['actif'])[0];
  if (body.id) {
    const d = cabOwnDossier(uid, body.id); if (!d) return redirect(res, '/cabinet');
    db.prepare('UPDATE cpta_dossiers SET nom=?,forme=?,regime_fiscal=?,regime_tva=?,activite=?,collaborateur=?,siren=?,ex_debut=?,ex_fin=?,statut=? WHERE id=? AND user_id=?')
      .run(nom, fields.forme, fields.regime_fiscal, fields.regime_tva, fields.activite, fields.collaborateur, fields.siren, fields.ex_debut, fields.ex_fin, statut, body.id, uid);
    return redirect(res, '/cabinet/dossier?id=' + encodeURIComponent(body.id));
  }
  const id = rid(10);
  db.prepare('INSERT INTO cpta_dossiers(id,user_id,nom,ex_debut,ex_fin,cree_le,forme,regime_fiscal,regime_tva,activite,collaborateur,siren,statut) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)')
    .run(id, uid, nom, fields.ex_debut, fields.ex_fin, new Date().toISOString(), fields.forme, fields.regime_fiscal, fields.regime_tva, fields.activite, fields.collaborateur, fields.siren, 'actif');
  audit(db, uid, 'cab_dossier_new', nom, ip(req));
  return redirect(res, '/cabinet/dossier?id=' + encodeURIComponent(id));
}
function postCabinetOpen(req, res, sess, body) {
  if (!authed(sess)) return redirect(res, '/connexion');
  const d = cabOwnDossier(sess.user.id, body.id);
  if (d) db.prepare('UPDATE users SET cab_dossier=? WHERE id=?').run(d.id, sess.user.id);
  const next = /^\/logiciel(\/[a-z-]*)?$/.test(body.next || '') ? body.next : '/logiciel';
  return redirect(res, next);
}
function postCabinetTache(req, res, sess, body) {
  if (!authed(sess)) return redirect(res, '/connexion');
  const uid = sess.user.id, d = cabOwnDossier(uid, body.id);
  const per = /^\d{4}-\d{2}$/.test(body.per || '') ? body.per : cabPeriode();
  const cle = String(body.cle || '').slice(0, 20);
  if (d && CAB_CHECK.some(c => c[0] === cle)) {
    const ex = db.prepare('SELECT id, fait FROM cab_taches WHERE dossier_id=? AND periode=? AND cle=?').get(d.id, per, cle);
    if (ex) db.prepare('UPDATE cab_taches SET fait=?, maj_le=? WHERE id=?').run(ex.fait ? 0 : 1, new Date().toISOString(), ex.id);
    else db.prepare('INSERT INTO cab_taches(id,dossier_id,periode,cle,libelle,fait,maj_le) VALUES(?,?,?,?,?,1,?)').run(rid(10), d.id, per, cle, '', new Date().toISOString());
  }
  return redirect(res, '/cabinet/dossier?id=' + encodeURIComponent(body.id) + '&per=' + encodeURIComponent(per));
}
function postCabinetSuppr(req, res, sess, body) {
  if (!authed(sess)) return redirect(res, '/connexion');
  const uid = sess.user.id, d = cabOwnDossier(uid, body.id);
  if (d) {
    db.prepare('DELETE FROM cpta_lignes WHERE dossier_id=?').run(d.id);
    db.prepare('DELETE FROM cpta_ecritures WHERE dossier_id=?').run(d.id);
    db.prepare('DELETE FROM cab_taches WHERE dossier_id=?').run(d.id);
    db.prepare('DELETE FROM cpta_dossiers WHERE id=? AND user_id=?').run(d.id, uid);
    db.prepare('UPDATE users SET cab_dossier=NULL WHERE id=? AND cab_dossier=?').run(uid, d.id);
    audit(db, uid, 'cab_dossier_suppr', d.nom, ip(req));
  }
  return redirect(res, '/cabinet');
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    const p = url.pathname;
    const sess = getSession(req);
    if (sess && sess.user && !sess.row.pending_2fa) touchSeen(sess.user.id); // présence "en ligne"

    if (req.method === 'GET') {
      trackVisit(req, p).catch(() => {});
      if (p === '/sante') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('ok'); }
      // Icônes demandées automatiquement par les navigateurs/iOS à la racine (évite des 404)
      if (p === '/favicon.ico') return serveStatic(res, path.join(DIR, 'public'), 'favicon.png');
      if (p === '/apple-touch-icon.png' || p === '/apple-touch-icon-precomposed.png') return serveStatic(res, path.join(DIR, 'public'), 'icon-512.png');
      if (p === '/robots.txt') { res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /tableau-de-bord\nDisallow: /formation\nDisallow: /communaute\nDisallow: /logiciel\nDisallow: /cabinet\nDisallow: /reinitialiser\nSitemap: https://academie-compta-fr.mg/sitemap.xml\n'); }
      if (p === '/sitemap.xml') {
        const urls = ['/', '/programme', '/emploi', '/decouverte', '/mentions-legales', '/inscription', '/connexion'].concat(MODULES.map(m => '/apercu?m=' + m.code));
        const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(u => `<url><loc>https://academie-compta-fr.mg${u.replace(/&/g, '&amp;')}</loc></url>`).join('\n') + '\n</urlset>';
        res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' }); return res.end(xml);
      }
      if (p === '/.well-known/security.txt') {
        const contact = (cfg.admin_email || (cfg.societe && cfg.societe.email) || 'security@academie-compta-fr.mg');
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end(`Contact: mailto:${contact}\nPreferred-Languages: fr, en\nCanonical: https://academie-compta-fr.mg/.well-known/security.txt\nExpires: 2027-12-31T23:59:59Z\n`);
      }
      if (p === '/') return send(res, 200, pageAccueil(sess));
      if (p === '/programme') return send(res, 200, pageProgramme(sess));
      if (p === '/presentiel') return send(res, 200, pagePresentiel(sess));
      if (p === '/emploi') return send(res, 200, pageEmploi(sess));
      if (p === '/decouverte') return send(res, 200, pageDecouverte(sess));
      if (p === '/mentions-legales') return send(res, 200, pageMentions(sess));
      if (p === '/apercu') { const code = url.searchParams.get('m') || 'm01'; return send(res, 200, pageApercu(sess, code), { quiz: estGratuit(code) }); }
      if (p.startsWith('/public/')) return serveStatic(res, path.join(DIR, 'public'), p.slice('/public/'.length));
      if (p === '/inscription') return send(res, 200, pageInscription(sess || ensureGuestSession(res, req), null, { parrain: (url.searchParams.get('p') || '').toUpperCase().slice(0, 12) }));
      if (p === '/connexion') return send(res, 200, pageConnexion(sess || ensureGuestSession(res, req), null));
      if (p === '/mot-de-passe-oublie') return send(res, 200, pageMotDePasseOublie(sess || ensureGuestSession(res, req), null));
      if (p === '/reinitialiser') return send(res, 200, pageReinitialiser(sess || ensureGuestSession(res, req), url.searchParams.get('token') || '', null));
      if (p === '/2fa') { if (!authed0(sess) || !sess.row.pending_2fa || !sess.user.twofa) return redirect(res, '/connexion'); return send(res, 200, page2faVerify(sess)); }
      if (p === '/2fa-setup-redirect') {
        if (!authed0(sess)) return redirect(res, '/connexion');
        // Secret STABLE : on réutilise le secret en attente s'il existe (sinon le QR scanné ne correspondrait plus après un rechargement)
        let secret = (!sess.user.twofa && sess.user.totp_secret) ? sess.user.totp_secret : null;
        if (!secret) { secret = newTotpSecret(); db.prepare('UPDATE users SET totp_secret=?, twofa=0 WHERE id=?').run(secret, sess.user.id); }
        const uri = otpauthURI(secret, sess.user.email, ISSUER_2FA);
        return send(res, 200, page2faSetup(sess, secret, uri, null, await qrDataURL(uri)));
      }
      if (p === '/deconnexion') { if (sess) db.prepare('DELETE FROM sessions WHERE id=?').run(sess.sid); return redirect(res, '/', [cookie('sid', '', { maxAge: 0 })]); }

      // espace authentifié
      if (p === '/tableau-de-bord') { if (!authed(sess)) return redirect(res, '/connexion'); return send(res, 200, pageDashboard(sess), { course: true }); }
      if (p === '/attestation') {
        if (!authed(sess)) return redirect(res, '/connexion');
        if (sess.user.role !== 'admin') {
          if (!hasActive(sess.user.id)) return send(res, 402, layout('Attestation', '<h1>Attestation indisponible</h1><p>Votre attestation sera disponible après activation de votre accès à la formation.</p><a class="btn" href="/tableau-de-bord">Mon espace</a>', sess));
          if (!sess.user.attestation_ok) {
            const rdvOk = url.searchParams.get('rdv') === 'ok';
            const em = esc(sess.user.email || '');
            const calLink = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('Test final visio — Académie Compta FR') + '&details=' + encodeURIComponent('Test/entretien final pour l\'attestation. Le formateur ajoute le lien Google Meet et envoie l\'invitation.') + '&add=' + encodeURIComponent((sess.user.email || '') + ',' + FORMATEUR_EMAIL);
            return send(res, 200, layout('Attestation', `<h1>🎓 Attestation — dernière étape</h1>
            <section class="card" style="border-left:4px solid var(--accent)">
            ${rdvOk ? `<div style="background:#e9f7ef;border:1px solid #bfe6cd;border-radius:10px;padding:14px 16px;margin-bottom:14px">
              <p style="margin:0;font-weight:700;color:#1e7d46;font-size:16px">✅ Votre rendez-vous de test est programmé.</p>
              <p style="margin:6px 0 0;font-size:14px">Le formateur vous enverra le <b>lien Google Meet</b> et l'horaire par e-mail à <b>${em}</b>. Ajoutez le rendez-vous à votre agenda :</p>
              <p style="margin:8px 0 0"><a class="btn small" target="_blank" rel="noopener" href="${calLink}">📅 Ajouter à Google Agenda (visio)</a></p></div>` : ''}
            <p><b>Votre attestation n'est pas encore débloquée.</b> Elle vous sera remise <b>signée et tamponnée</b> après un <b>test final en visio</b> (Google Meet) avec le formateur.</p>
            <p>👉 <b>Comment l'obtenir :</b></p>
            <ol style="line-height:1.7">
              <li><b>Terminez TOUS les modules</b> dans la formation : cliquez sur <b>« Marquer comme terminé »</b> en bas de chaque module (la <b>barre de progression</b> doit atteindre <b>100 %</b>) et passez l'<b>évaluation finale</b>.</li>
              <li><b>Programmez votre test final en visio</b> ci-dessous (rendez-vous Google Meet avec le formateur).</li>
              <li>Test réussi → le formateur <b>valide</b> votre dossier → l'attestation devient <b>téléchargeable</b> ici.</li>
            </ol>
            ${rdvOk ? '<p style="margin-top:14px"><a class="btn ghost" href="/tableau-de-bord">← Mon espace</a></p>' : `<form method="post" action="/attestation/rdv" class="form" style="margin-top:14px">${csrfField(sess)}
              <div class="row"><label>Votre e-mail (pour l'invitation Google Meet)<input name="email" type="email" required value="${em}"></label>
              <label>Date et heure souhaitées (heure de Madagascar)<input name="quand" type="datetime-local" required min="${new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 16)}"></label></div>
              <p style="margin:8px 0 0"><button class="btn" type="submit">📅 Programmer mon rendez-vous de test (visio)</button> <a class="btn ghost" href="/tableau-de-bord">← Mon espace</a></p>
              <p class="muted" style="font-size:12px;margin:6px 0 0">Durée : 1 h. Vous recevrez l'invitation Google Agenda avec le lien Meet par e-mail.</p></form>`}
            <p class="muted" style="font-size:12px;margin-top:10px">Attestation interne de fin de formation, délivrée après validation du niveau opérationnel par le formateur.</p>
            </section>`, sess));
          }
        }
        return serveAttestation(res, sess, sess.user.role === 'admin' ? (url.searchParams.get('type') || '') : '');
      }
      if (p === '/communaute') { if (!authed(sess)) return redirect(res, '/connexion'); return send(res, 200, pageForum(sess)); }
      if (p === '/logiciel') { if (!authed(sess)) return redirect(res, '/connexion'); return send(res, 200, pageLogiciel(sess)); }
      if (p === '/logiciel/saisie') { if (!authed(sess)) return redirect(res, '/connexion'); return send(res, 200, pageLogicielSaisie(sess, '')); }
      if (p === '/logiciel/grand-livre') { if (!authed(sess)) return redirect(res, '/connexion'); return send(res, 200, pageGrandLivre(sess, (url.searchParams.get('c') || '').replace(/\s/g, ''))); }
      if (p === '/logiciel/balance') { if (!authed(sess)) return redirect(res, '/connexion'); return send(res, 200, pageBalance(sess)); }
      if (p === '/logiciel/etats') { if (!authed(sess)) return redirect(res, '/connexion'); return send(res, 200, pageEtats(sess)); }
      if (p === '/logiciel/cadrage-tva') { if (!authed(sess)) return redirect(res, '/connexion'); return send(res, 200, pageCadrageTva(sess, url)); }
      if (p === '/cabinet') { if (!authed(sess)) return redirect(res, '/connexion'); return send(res, 200, pageCabinet(sess)); }
      if (p === '/cabinet/nouveau') { if (!authed(sess)) return redirect(res, '/connexion'); return send(res, 200, pageCabinetNew(sess)); }
      if (p === '/cabinet/dossier') { if (!authed(sess)) return redirect(res, '/connexion'); return send(res, 200, pageCabinetDossier(sess, (url.searchParams.get('id') || ''), url.searchParams.get('per') || '')); }
      if (p === '/communaute/messages') {
        if (!authed(sess) || !forumAccess(sess)) { res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); return res.end('[]'); }
        const out = forumMsgsSince(url.searchParams.get('since') || '').map(forumMsgJSON);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); return res.end(JSON.stringify(out));
      }
      if (p === '/admin') { if (!authed(sess) || sess.user.role !== 'admin') return send(res, 403, layout('403', '<h1>Accès refusé</h1>', sess)); return send(res, 200, pageAdmin(sess, url.searchParams.get('notif'), url.searchParams.get('acces'), url.searchParams.get('e'))); }
      if (p === '/admin/google/connect') {
        if (!authed(sess) || sess.user.role !== 'admin') return send(res, 403, layout('403', '<h1>Accès refusé</h1>', sess));
        if (!googleEnvOk()) return redirect(res, '/admin?acces=google_noenv');
        const st = rid(24); setSetting('google_oauth_state', st);
        return redirect(res, 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID, redirect_uri: BASE_URL + '/admin/google/callback',
          response_type: 'code', scope: 'https://www.googleapis.com/auth/calendar.events',
          access_type: 'offline', prompt: 'consent', state: st
        }).toString());
      }
      if (p === '/admin/google/callback') {
        if (!authed(sess) || sess.user.role !== 'admin') return send(res, 403, layout('403', '<h1>Accès refusé</h1>', sess));
        return (async () => {
          try {
            const st = getSetting('google_oauth_state'); delSetting('google_oauth_state');
            if (!st || url.searchParams.get('state') !== st || !url.searchParams.get('code')) return redirect(res, '/admin?acces=google_err');
            const r = await fetch('https://oauth2.googleapis.com/token', {
              method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({ code: url.searchParams.get('code'), client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: BASE_URL + '/admin/google/callback', grant_type: 'authorization_code' }).toString()
            });
            const d = await r.json().catch(() => ({}));
            if (!r.ok || !d.refresh_token) { try { audit(db, sess.user.id, 'google_connect_err', 'http ' + r.status, ip(req)); } catch { } return redirect(res, '/admin?acces=google_err'); }
            setSetting('google_refresh_token', d.refresh_token);
            audit(db, sess.user.id, 'google_connecte', 'agenda', ip(req));
            return redirect(res, '/admin?acces=google_ok');
          } catch { return redirect(res, '/admin?acces=google_err'); }
        })();
      }
      if (p === '/admin/backup') {
        if (!authed(sess) || sess.user.role !== 'admin') return send(res, 403, layout('403', '<h1>Accès refusé</h1>', sess));
        try {
          const dir = process.env.DATA_DIR || DIR;
          const tmp = path.join(dir, '_backup_tmp.db');
          try { fs.unlinkSync(tmp); } catch { }
          db.exec("VACUUM INTO '" + tmp.replace(/'/g, "''") + "'");
          const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
          res.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Disposition': 'attachment; filename="academie-backup-' + stamp + '.db"', 'Cache-Control': 'no-store' });
          const stream = fs.createReadStream(tmp);
          stream.pipe(res);
          stream.on('close', () => { try { fs.unlinkSync(tmp); } catch { } });
          audit(db, sess.user.id, 'backup_db', '', ip(req));
        } catch (e) { return send(res, 500, layout('Erreur', '<h1>Sauvegarde impossible</h1><p>' + esc(String(e && e.message || e)) + '</p><a class="btn" href="/admin">Retour</a>', sess)); }
        return;
      }
      if (p === '/paiement') {
        if (!authed(sess)) return redirect(res, '/connexion');
        const ins = insOf(url.searchParams.get('ins'), sess.user.id); if (!ins) return send(res, 404, layout('404', '<h1>Introuvable</h1>', sess));
        return send(res, 200, pagePaiement(sess, ins));
      }
      if (p === '/paiement/retour') return paiementRetour(req, res, sess, url);
      // formation protégée
      if (p === '/formation' || p.startsWith('/formation/')) {
        if (!authed(sess)) return redirect(res, '/connexion');
        // Accès ouvert à tout inscrit : le Module 1 est gratuit, les autres modules sont verrouillés tant que non payés (gating par module dans le contenu).
        const rel = p === '/formation' ? 'index.html' : p.slice('/formation/'.length);
        if (rel === '' || rel === 'index.html') return serveCourseIndex(res, sess);
        return serveStatic(res, path.join(ROOT, 'site'), rel, { course: true });
      }
      return send(res, 404, layout('404', '<h1>Page introuvable</h1>', sess));
    }

    if (req.method === 'POST') {
      const body = await readBody(req);
      if (p === '/api/chat') return postApiChat(req, res, body);
      // CSRF obligatoire (sauf création de session initiale gérée plus bas)
      if (p === '/inscription') return postInscription(req, res, sess, body);
      if (p === '/connexion') return postConnexion(req, res, sess, body);
      if (p === '/mot-de-passe-oublie') return postMotDePasseOublie(req, res, sess, body);
      if (p === '/reinitialiser') return postReinitialiser(req, res, sess, body);
      if (!authed0(sess)) return redirect(res, '/connexion');
      if (!checkCsrf(sess, body)) return send(res, 403, layout('403', '<h1>Jeton invalide</h1>', sess));
      if (p === '/2fa-activer') return post2faActiver(req, res, sess, body);
      if (p === '/2fa') return post2fa(req, res, sess, body);
      if (!authed(sess)) return redirect(res, '/connexion');
      if (p === '/choisir') return postChoisir(req, res, sess, body);
      if (p === '/progression') return postProgression(req, res, sess, body);
      if (p === '/demande') return postDemande(req, res, sess, body);
      if (p === '/attestation/rdv') return postAttestationRdv(req, res, sess, body);
      if (p === '/admin/demande-traitee') return postDemandeTraitee(req, res, sess, body);
      if (p === '/admin/demande-repondre') return postDemandeRepondre(req, res, sess, body);
      if (p === '/paiement/manuel') return postManuel(req, res, sess, body);
      if (p === '/paiement/orange-api') return postOrangeApi(req, res, sess, body);
      if (p === '/admin/valider') return postAdminValider(req, res, sess, body);
      if (p === '/admin/attestation') return postAdminAttestation(req, res, sess, body);
      if (p === '/admin/google/off') { if (sess.user.role !== 'admin') return send(res, 403, 'forbidden'); delSetting('google_refresh_token'); audit(db, sess.user.id, 'google_deconnecte', '', ip(req)); return redirect(res, '/admin?acces=google_off'); }
      if (p === '/admin/promo-debloquer-tous') return postPromoDebloquerTous(req, res, sess, body);
      if (p === '/admin/annonce') return postAnnonce(req, res, sess, body);
      if (p === '/admin/annonce-off') return postAnnonceOff(req, res, sess, body);
      if (p === '/communaute') return postForum(req, res, sess, body);
      if (p === '/communaute/supprimer') return postForumSupprimer(req, res, sess, body);
      if (p === '/logiciel/saisie') return postLogicielSaisie(req, res, sess, body);
      if (p === '/logiciel/ecriture-suppr') return postLogicielSuppr(req, res, sess, body);
      if (p === '/logiciel/reset') return postLogicielReset(req, res, sess, body);
      if (p === '/cabinet/dossier') return postCabinetDossier(req, res, sess, body);
      if (p === '/cabinet/ouvrir') return postCabinetOpen(req, res, sess, body);
      if (p === '/cabinet/tache') return postCabinetTache(req, res, sess, body);
      if (p === '/cabinet/suppr') return postCabinetSuppr(req, res, sess, body);
      if (p === '/admin/notifier') return postAdminNotifier(req, res, sess, body);
      if (p === '/admin/acces') return postAdminAcces(req, res, sess, body);
      if (p === '/admin/acces-retirer') return postAdminAccesRetirer(req, res, sess, body);
      if (p === '/admin/acces-modifier') return postAdminAccesModifier(req, res, sess, body);
      if (p === '/admin/emploi-ajouter') return postEmploiAjouter(req, res, sess, body);
      if (p === '/admin/emploi-retirer') return postEmploiRetirer(req, res, sess, body);
      return send(res, 404, 'not found');
    }
    send(res, 405, 'method not allowed');
  } catch (e) {
    console.error(e); send(res, 500, layout('Erreur', '<h1>Erreur serveur</h1>', null));
  }
});

// --- États session ---
const authed0 = sess => !!(sess && sess.user); // connecté (éventuellement 2fa en attente)
const authed = sess => !!(sess && sess.user && !sess.row.pending_2fa);
function hasActive(uid) { return !!db.prepare("SELECT 1 FROM inscriptions WHERE user_id=? AND statut='active' AND (expire_le IS NULL OR expire_le > ?)").get(uid, new Date().toISOString()); }
// Promo « gratuit » : on octroie EXPLICITEMENT tous les modules (PACK_COMPLET) à l'apprenant,
// avec une expiration calée sur la fin de la promo. Idempotent + actif seulement si la promo est ouverte.
function promoExpiryISO() { const p = cfg.promo; return (p && p.jusqu_au) ? (p.jusqu_au + 'T23:59:59.999Z') : null; }
function grantPromoModules(uid, ipStr) {
  if (!uid || !promoLive()) return false;
  const exp = promoExpiryISO(); if (!exp) return false;
  // Octroi promo via un code DÉDIÉ (PROMO_PACK) : ne se confond jamais avec un PACK_COMPLET payé/accordé manuellement.
  const ex = db.prepare("SELECT id, expire_le FROM inscriptions WHERE user_id=? AND offre_code='PROMO_PACK' AND statut='active'").get(uid);
  if (ex) {
    // Resynchronise l'expiration sur la fin de promo en config (prolongation/raccourcissement de jusqu_au se propage).
    if (ex.expire_le !== exp) db.prepare('UPDATE inscriptions SET expire_le=? WHERE id=?').run(exp, ex.id);
    return false;
  }
  db.prepare('INSERT INTO inscriptions(id,user_id,offre_code,statut,cree_le,expire_le) VALUES(?,?,?,?,?,?)').run(rid(10), uid, 'PROMO_PACK', 'active', new Date().toISOString(), exp);
  audit(db, uid, 'promo_grant', 'PROMO_PACK jusqu_au ' + ((cfg.promo && cfg.promo.jusqu_au) || ''), ipStr || '');
  return true;
}
// Annonce active (message du formateur affiché dans l'espace des apprenants)
function annonceActive() { try { return db.prepare("SELECT * FROM annonces WHERE actif=1 AND (cible IS NULL OR cible='apprenants') ORDER BY cree_le DESC LIMIT 1").get() || null; } catch { return null; } }
function annonceAccueil() { try { return db.prepare("SELECT * FROM annonces WHERE actif=1 AND cible='accueil' ORDER BY cree_le DESC LIMIT 1").get() || null; } catch { return null; } }
// Accès Communauté : réservé aux apprenants à accès actif (admin, ou promo en cours, ou inscription active).
function forumAccess(sess) { return !!(sess && sess.user && (sess.user.role === 'admin' || promoLive() || hasActive(sess.user.id))); }

// Parrainage : quand un FILLEUL obtient son 1er accès payé, on prolonge l'accès de son PARRAIN de bonus_jours.
function rewardParrain(filleulId) {
  try {
    const P = cfg.parrainage || {};
    if (!P.actif) return;
    const bonus = Math.max(1, parseInt(P.bonus_jours, 10) || 30);
    const f = db.prepare('SELECT id, parrain_id, parrain_recompense FROM users WHERE id=?').get(filleulId);
    if (!f || f.parrain_recompense || !f.parrain_id) return;
    const parrain = db.prepare('SELECT id FROM users WHERE id=?').get(f.parrain_id);
    if (!parrain || parrain.id === f.id) { db.prepare('UPDATE users SET parrain_recompense=1 WHERE id=?').run(f.id); return; }
    // Prolonger toutes les inscriptions actives DATÉES du parrain (les accès illimités n'ont rien à prolonger)
    const act = db.prepare("SELECT id, expire_le FROM inscriptions WHERE user_id=? AND statut='active' AND expire_le IS NOT NULL").all(parrain.id);
    let applied = 0;
    for (const r of act) {
      const base = Math.max(Date.parse(r.expire_le) || Date.now(), Date.now());
      const ne = new Date(base + bonus * 86400000).toISOString();
      db.prepare('UPDATE inscriptions SET expire_le=? WHERE id=?').run(ne, r.id);
      applied++;
    }
    db.prepare('UPDATE users SET parrain_recompense=1 WHERE id=?').run(f.id);
    audit(db, parrain.id, 'parrainage_recompense', 'filleul ' + f.id + ' · +' + bonus + 'j · ' + applied + ' acces prolonge(s)', '');
  } catch { }
}
function calcExpiry() { const a = cfg.acces || {}; if (a.illimite) return null; const d = a.duree_jours || 365; return new Date(Date.now() + d * 86400000).toISOString(); }
function unSeulAppareil(user, keepSid) { if (cfg.acces && cfg.acces.un_seul_appareil && user.role !== 'admin') db.prepare('DELETE FROM sessions WHERE user_id=? AND id!=?').run(user.id, keepSid); }
function insOf(id, uid) { return id ? db.prepare('SELECT i.*, o.titre, o.prix FROM inscriptions i JOIN offres o ON o.code=i.offre_code WHERE i.id=? AND i.user_id=?').get(id, uid) : null; }

// Pour les formulaires anonymes (inscription/connexion) il faut un jeton CSRF -> session "invitée"
function ensureGuestSession(res, req) {
  const sess = getSession(req);
  if (sess) return sess;
  const sid = newSession(null, false, req);
  res.setHeader('Set-Cookie', cookie('sid', signSid(sid), cookieOpts));
  return { sid, row: db.prepare('SELECT * FROM sessions WHERE id=?').get(sid), user: null };
}

// --- Handlers POST ---
function postInscription(req, res, sess, body) {
  sess = sess || getSession(req);
  if (!sess) { // créer session invitée puis réafficher (le jeton CSRF est requis)
    const sid = newSession(null, false, req);
    return redirect(res, '/inscription', [cookie('sid', signSid(sid), cookieOpts)]);
  }
  if (rateLimited('signup:' + ip(req), 8, 10 * 60000)) { audit(db, null, 'rate_limit', 'signup ' + ip(req), ip(req)); return send(res, 429, pageInscription(sess, 'Trop de tentatives depuis votre réseau. Réessayez dans quelques minutes.')); }
  if (!checkCsrf(sess, body)) return send(res, 403, pageInscription(sess, 'Session expirée, réessayez.'));
  const v = { nom: body.nom?.trim(), prenom: body.prenom?.trim(), email: (body.email || '').trim().toLowerCase(), tel: body.tel?.trim(), niveau_etudes: body.niveau_etudes, niveau_intellectuel: body.niveau_intellectuel, parrain: (body.parrain || '').trim().toUpperCase().slice(0, 12) };
  if (!v.nom || !v.prenom) return send(res, 200, pageInscription(sess, 'Nom et prénom obligatoires.', v));
  if (!isEmail(v.email)) return send(res, 200, pageInscription(sess, 'Email invalide.', v));
  if (!strongPw(body.pw)) return send(res, 200, pageInscription(sess, 'Mot de passe trop faible (10+ caractères, lettres et chiffres).', v));
  if (cfg.conditions.attestation_obligatoire && body.diplome_bac2 !== '1') return send(res, 200, pageInscription(sess, `Condition non remplie : ${cfg.conditions.diplome_requis} (attestation obligatoire).`, v));
  if (body.rgpd !== '1') return send(res, 200, pageInscription(sess, 'Vous devez accepter la confidentialité (RGPD).', v));
  if (body.cgu !== '1') return send(res, 200, pageInscription(sess, 'Vous devez accepter les conditions d\'utilisation (contenu personnel, reproduction et partage interdits).', v));
  if (db.prepare('SELECT 1 FROM users WHERE email=?').get(v.email)) return send(res, 200, pageInscription(sess, 'Un compte existe déjà avec cet email.', v));
  // Limite de places (offre de lancement) : on bloque les nouvelles inscriptions au-delà du quota.
  if (cfg.promo && cfg.promo.places_max > 0) {
    const _nbInscrits = db.prepare("SELECT COUNT(*) c FROM users WHERE role='apprenant'").get().c;
    if (_nbInscrits >= cfg.promo.places_max) return send(res, 200, pageInscription(sess, 'Inscriptions complètes : la limite de ' + cfg.promo.places_max + ' places a été atteinte. Merci de votre intérêt — contactez-nous pour être informé(e) de la prochaine session.', v));
  }
  const { hash, salt } = hashPassword(body.pw);
  const id = rid(8);
  db.prepare('INSERT INTO users(id,nom,prenom,email,tel,niveau_etudes,diplome_bac2,niveau_intellectuel,pass_hash,pass_salt,email_verifie,role,cree_le) VALUES(?,?,?,?,?,?,1,?,?,?,1,?,?)')
    .run(id, v.nom, v.prenom, v.email, v.tel || '', v.niveau_etudes, v.niveau_intellectuel, hash, salt, 'apprenant', new Date().toISOString());
  audit(db, id, 'inscription', v.email, ip(req));
  // Parrainage : code perso unique + résolution du parrain (code saisi ou lien ?p=)
  try {
    let cp; do { cp = genParrainCode(); } while (db.prepare('SELECT 1 FROM users WHERE code_parrain=?').get(cp));
    const parr = v.parrain ? db.prepare('SELECT id FROM users WHERE code_parrain=?').get(v.parrain) : null;
    db.prepare('UPDATE users SET code_parrain=?, parrain_id=? WHERE id=?').run(cp, (parr && parr.id !== id) ? parr.id : null, id);
  } catch { }
  // Promo en cours : on débloque TOUS les modules gratuitement dès l'inscription (jusqu'à la fin de la promo).
  grantPromoModules(id, ip(req));
  // E-mail de bienvenue automatique (si Brevo configuré) — n'interrompt jamais l'inscription en cas d'échec.
  if (mailConfigured()) {
    const waS = ((cfg.societe || {}).whatsapp || '');
    sendEmail(v.email, 'Bienvenue sur Académie Compta FR 🎓', `<div style="font-family:Arial,Helvetica,sans-serif;color:#1c2733;max-width:560px">
      <h2 style="color:#16307a">Bienvenue ${esc(v.prenom || '')} ! 🎉</h2>
      <p>Votre compte est créé. Vous pouvez commencer <b>tout de suite</b> :</p>
      <ol style="line-height:1.8">
        <li>Connectez-vous et ouvrez la <b>formation</b> — le <b>Module 1 est gratuit</b>${promoLive() ? ' (et pendant la promo, TOUS les modules sont débloqués !)' : ''}.</li>
        <li>Avancez leçon par leçon : cours, <b>simulateurs interactifs</b>, quiz auto-corrigés, suivi de progression.</li>
        <li>Terminez <b>tous les modules</b> puis passez le <b>test final en visio</b> avec le formateur → <b>attestation signée et tamponnée</b>.</li>
      </ol>
      <p><a href="${BASE_URL}/connexion" style="display:inline-block;background:#16307a;color:#fff;padding:11px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Commencer ma formation →</a></p>
      ${waS ? `<p style="font-size:13px;color:#555">Une question ? WhatsApp : <b>${esc(waS)}</b></p>` : ''}
      <hr style="border:none;border-top:1px solid #eee;margin:18px 0">
      <p style="color:#888;font-size:12px">${esc((cfg.societe || {}).nom || 'Académie Compta FR')} — academie-compta-fr.mg</p></div>`).catch(() => { });
  }
  if (twofaRequired('apprenant')) { // 2FA non requise pour les apprenants : connexion directe
    db.prepare('UPDATE sessions SET user_id=?, pending_2fa=1 WHERE id=?').run(id, sess.sid);
    return redirect(res, '/2fa-setup-redirect');
  }
  const sid = newSession(id, false, req);
  db.prepare('DELETE FROM sessions WHERE id=?').run(sess.sid);
  unSeulAppareil({ id, role: 'apprenant' }, sid);
  return redirect(res, '/decouverte', [cookie('sid', signSid(sid), cookieOpts)]);
}

function postConnexion(req, res, sess, body) {
  sess = sess || getSession(req);
  if (!sess) { const sid = newSession(null, false, req); return redirect(res, '/connexion', [cookie('sid', signSid(sid), cookieOpts)]); }
  if (rateLimited('login:' + ip(req), 12, 10 * 60000)) { audit(db, null, 'rate_limit', 'login ' + ip(req), ip(req)); return send(res, 429, pageConnexion(sess, 'Trop de tentatives depuis votre réseau. Réessayez dans quelques minutes.', (body.email || '').trim().toLowerCase())); }
  if (!checkCsrf(sess, body)) return send(res, 403, pageConnexion(sess, 'Session expirée, réessayez.'));
  const email = (body.email || '').trim().toLowerCase();
  const g = loginGuard(db, email);
  if (g.locked) return send(res, 429, pageConnexion(sess, 'Compte temporairement verrouillé (trop de tentatives). Réessayez plus tard.', email));
  const u = db.prepare('SELECT * FROM users WHERE email=?').get(email);
  if (!u || !verifyPassword(body.pw || '', u.pass_hash, u.pass_salt)) {
    loginFail(db, email); audit(db, u?.id, 'login_echec', email, ip(req));
    return send(res, 401, pageConnexion(sess, 'Identifiants incorrects.', email));
  }
  loginReset(db, email);
  if (u.role === 'apprenant') grantPromoModules(u.id, ip(req)); // promo : débloque tous les modules si pas déjà fait
  if (u.role === 'admin' && u.twofa) { db.prepare('UPDATE sessions SET user_id=?, pending_2fa=1 WHERE id=?').run(u.id, sess.sid); audit(db, u.id, 'login_ok_2fa', '', ip(req)); return redirect(res, '/2fa'); }
  if (twofaRequired(u.role)) {
    db.prepare('UPDATE sessions SET user_id=?, pending_2fa=1 WHERE id=?').run(u.id, sess.sid);
    return redirect(res, '/2fa-setup-redirect');
  }
  const sid = newSession(u.id, false, req);
  db.prepare('DELETE FROM sessions WHERE id=?').run(sess.sid);
  audit(db, u.id, 'login_complet', '', ip(req));
  unSeulAppareil(u, sid);
  return redirect(res, '/tableau-de-bord', [cookie('sid', signSid(sid), cookieOpts)]);
}

async function post2faActiver(req, res, sess, body) {
  // Secret de référence = celui conservé en base (stable) ; repli sur le champ caché si besoin
  const secret = sess.user.totp_secret || body.secret;
  if (!verifyTOTP(secret, body.code)) { const uri = otpauthURI(secret, sess.user.email, ISSUER_2FA); return send(res, 200, page2faSetup(sess, secret, uri, 'Code incorrect. Vérifiez que l\'heure de votre téléphone est en réglage automatique, puis réessayez.', await qrDataURL(uri))); }
  db.prepare('UPDATE users SET totp_secret=?, twofa=1 WHERE id=?').run(secret, sess.user.id);
  db.prepare('UPDATE sessions SET pending_2fa=0 WHERE id=?').run(sess.sid);
  audit(db, sess.user.id, '2fa_active', '', ip(req));
  return redirect(res, '/tableau-de-bord');
}

function post2fa(req, res, sess, body) {
  if (!verifyTOTP(sess.user.totp_secret, body.code)) { audit(db, sess.user.id, '2fa_echec', '', ip(req)); return send(res, 401, page2faVerify(sess, 'Code incorrect.')); }
  // régénérer l'identifiant de session (anti-fixation)
  const sid = newSession(sess.user.id, false, req);
  db.prepare('DELETE FROM sessions WHERE id=?').run(sess.sid);
  audit(db, sess.user.id, 'login_complet', '', ip(req));
  unSeulAppareil(sess.user, sid);
  return redirect(res, '/tableau-de-bord', [cookie('sid', signSid(sid), cookieOpts)]);
}

function postChoisir(req, res, sess, body) {
  const o = db.prepare('SELECT * FROM offres WHERE code=?').get(body.offre_code);
  if (!o || o.code === 'PROMO_PACK') return redirect(res, '/tableau-de-bord'); // PROMO_PACK = octroi automatique promo, non sélectionnable
  const id = rid(10);
  db.prepare('INSERT INTO inscriptions(id,user_id,offre_code,statut,cree_le) VALUES(?,?,?,?,?)').run(id, sess.user.id, o.code, 'en_attente', new Date().toISOString());
  audit(db, sess.user.id, 'choix_offre', o.code, ip(req));
  return redirect(res, '/paiement?ins=' + id);
}

function postDemande(req, res, sess, body) {
  const sujet = (body.sujet || '').trim().slice(0, 120);
  const message = (body.message || '').trim().slice(0, 2000);
  if (sujet.length < 2 || message.length < 5) return redirect(res, '/tableau-de-bord');
  db.prepare('INSERT INTO demandes(id,user_id,sujet,message,statut,cree_le) VALUES(?,?,?,?,?,?)').run(rid(10), sess.user.id, sujet, message, 'nouvelle', new Date().toISOString());
  audit(db, sess.user.id, 'demande_rdv', sujet, ip(req));
  return send(res, 200, layout('Demande envoyée', `<h1>Demande envoyée ✅</h1><p>Votre demande « ${esc(sujet)} » a été transmise au formateur. Vous serez recontacté(e).</p><a class="btn" href="/tableau-de-bord">Retour à mon espace</a>`, sess));
}
// --- Réglages clé/valeur (jeton Google Agenda, etc.) ---
function getSetting(k) { try { const r = db.prepare('SELECT value FROM settings WHERE key=?').get(k); return r ? r.value : null; } catch { return null; } }
function setSetting(k, v) { try { db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(k, v); } catch { } }
function delSetting(k) { try { db.prepare('DELETE FROM settings WHERE key=?').run(k); } catch { } }

// --- Google Agenda / Meet (RDV de test final) ---
const FORMATEUR_EMAIL = 'freelancecomptafr@anthonyfreecomptafr.net';
const googleEnvOk = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const googleConnected = () => googleEnvOk() && !!getSetting('google_refresh_token');
async function googleAccessToken() {
  const rt = getSetting('google_refresh_token');
  if (!googleEnvOk() || !rt || typeof fetch !== 'function') return null;
  try {
    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, refresh_token: rt, grant_type: 'refresh_token' }).toString()
    });
    if (!r.ok) { try { audit(db, null, 'google_token_err', 'http ' + r.status, ''); } catch { } return null; }
    const d = await r.json(); return d.access_token || null;
  } catch { return null; }
}
// Crée l'événement (1 h) dans l'agenda du formateur avec lien Meet auto + invitation envoyée par Google aux deux parties.
// quand = "YYYY-MM-DDTHH:MM" en heure de Madagascar (UTC+3).
async function googleCreateMeetEvent(emailApprenant, apprenantNom, quand) {
  const tok = await googleAccessToken();
  if (!tok) return { ok: false };
  const startMs = Date.parse(quand + ':00+03:00');
  if (isNaN(startMs)) return { ok: false };
  const endLocal = new Date(startMs + 3600000 + 3 * 3600000).toISOString().slice(0, 19);
  try {
    const r = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all', {
      method: 'POST', headers: { 'Authorization': 'Bearer ' + tok, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary: 'Test final visio — ' + apprenantNom + ' (Académie Compta FR)',
        description: "Test/entretien final pour l'attestation de fin de formation — Académie Compta FR.",
        start: { dateTime: quand + ':00+03:00' },
        end: { dateTime: endLocal + '+03:00' },
        attendees: [{ email: emailApprenant }],
        conferenceData: { createRequest: { requestId: rid(16), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
        reminders: { useDefault: true }
      })
    });
    if (!r.ok) { let m = ''; try { const e2 = await r.json(); m = (e2.error && e2.error.message) || ''; } catch { } try { audit(db, null, 'google_event_err', 'http ' + r.status + ' ' + m, ''); } catch { } return { ok: false }; }
    const ev = await r.json();
    return { ok: true, meet: ev.hangoutLink || '', lien: ev.htmlLink || '' };
  } catch { return { ok: false }; }
}

// Prise de rendez-vous pour le test final en visio (Google Meet avec le formateur)
async function postAttestationRdv(req, res, sess, body) {
  const email = (body.email || sess.user.email || '').trim().slice(0, 160);
  if (!isEmail(email)) return redirect(res, '/attestation');
  const quand = (body.quand || '').trim();
  const quandOk = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(quand) && Date.parse(quand + ':00+03:00') > Date.now();
  const apprenant = ((sess.user.prenom || '') + ' ' + (sess.user.nom || '')).trim() || email;
  const quandTxt = quandOk ? quand.slice(0, 10).split('-').reverse().join('/') + ' à ' + quand.slice(11) : '';
  audit(db, sess.user.id, 'rdv_test_final', email + (quandOk ? ' · ' + quand : ''), ip(req));

  // 1) Création AUTOMATIQUE de l'événement Google Agenda + lien Meet (si Google connecté dans l'admin)
  let meet = null;
  if (quandOk && googleConnected()) {
    const g = await googleCreateMeetEvent(email, apprenant, quand);
    if (g.ok) meet = g;
  }
  try {
    db.prepare('INSERT INTO demandes(id,user_id,sujet,message,statut,cree_le) VALUES(?,?,?,?,?,?)').run(
      rid(10), sess.user.id, 'RDV test final (visio)',
      'RDV test final ' + (quandOk ? 'le ' + quandTxt + ' (heure MG)' : 'demandé') + '. E-mail : ' + email + (meet && meet.meet ? '. Google Meet créé automatiquement : ' + meet.meet : '. (Lien Meet à envoyer manuellement)'),
      meet ? 'traitee' : 'nouvelle', new Date().toISOString());
  } catch { }

  if (meet) {
    return send(res, 200, layout('Rendez-vous programmé', `<h1>✅ Votre rendez-vous de test est programmé</h1>
      <section class="card" style="border-left:4px solid #1e7d46">
      <p style="font-size:17px"><b>📅 ${esc(quandTxt)}</b> (heure de Madagascar) — <b>test final en visio</b> avec le formateur.</p>
      <p>L'invitation <b>Google Agenda</b> vient d'être envoyée à <b>${esc(email)}</b> (vérifiez aussi les spams). Le lien de la visio :</p>
      <p>${meet.meet ? `<a class="btn" target="_blank" rel="noopener" href="${esc(meet.meet)}">🎥 Rejoindre le Google Meet</a>` : ''} ${meet.lien ? `<a class="btn ghost" target="_blank" rel="noopener" href="${esc(meet.lien)}">📅 Voir dans Google Agenda</a>` : ''}</p>
      <p class="muted" style="font-size:13px">D'ici le rendez-vous : <b>terminez tous les modules</b> (progression 100 %) et l'<b>évaluation finale</b>. En cas d'empêchement, prévenez le formateur (WhatsApp) — le rendez-vous peut être déplacé.</p>
      <p><a class="btn ghost" href="/tableau-de-bord">← Mon espace</a></p></section>`, sess));
  }

  // 2) Repli (Google non connecté ou erreur API) : demande enregistrée + e-mails via Brevo
  if (mailConfigured()) {
    const calLink = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('Test final visio — ' + apprenant) + '&dates=' + (quandOk ? encodeURIComponent(quand.replace(/[-:]/g, '') + '00/' + new Date(Date.parse(quand + ':00+03:00') + 3600000 + 3 * 3600000).toISOString().slice(0, 19).replace(/[-:]/g, '')) : '') + '&details=' + encodeURIComponent('Test/entretien final attestation. Apprenant : ' + apprenant + ' (' + email + '). Ajouter le lien Google Meet, puis envoyer l\'invitation.') + '&add=' + encodeURIComponent(email + ',' + FORMATEUR_EMAIL);
    sendEmail(FORMATEUR_EMAIL, 'Nouveau RDV test final — ' + apprenant + (quandTxt ? ' (' + quandTxt + ')' : ''), `<div style="font-family:Arial,Helvetica,sans-serif;color:#1c2733"><h2 style="color:#16307a">Demande de test final (visio)</h2><p>Apprenant : <b>${esc(apprenant)}</b><br>E-mail : <b>${esc(email)}</b>${quandTxt ? '<br>Créneau souhaité : <b>' + esc(quandTxt) + '</b> (heure MG)' : ''}</p><p><a href="${calLink}">📅 Créer l'événement Google Agenda + Meet</a> — ajoutez « Google Meet » puis envoyez l'invitation.</p></div>`).catch(() => { });
    sendEmail(email, 'Votre rendez-vous de test est programmé', `<div style="font-family:Arial,Helvetica,sans-serif;color:#1c2733"><h2 style="color:#16307a">✅ Votre rendez-vous de test est programmé</h2><p>Bonjour ${esc(sess.user.prenom || '')},</p><p>Votre demande de <b>test final en visio</b>${quandTxt ? ' pour le <b>' + esc(quandTxt) + '</b> (heure de Madagascar)' : ''} est enregistrée. Le formateur vous confirmera le <b>lien Google Meet</b> par e-mail.</p><p>D'ici là, pensez à <b>terminer tous les modules</b> (progression 100 %) et l'<b>évaluation finale</b>.</p><p>— ${esc((cfg.societe || {}).nom || 'Académie Compta FR')}</p></div>`).catch(() => { });
  }
  return redirect(res, '/attestation?rdv=ok');
}
function postDemandeTraitee(req, res, sess, body) {
  if (sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  db.prepare("UPDATE demandes SET statut='traitee' WHERE id=?").run(body.id);
  return redirect(res, '/admin');
}
function postDemandeRepondre(req, res, sess, body) {
  if (sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  const reponse = String(body.reponse || '').trim().slice(0, 3000);
  if (!body.id || reponse.length < 2) return redirect(res, '/admin');
  db.prepare("UPDATE demandes SET reponse=?, repondu_le=?, statut='traitee' WHERE id=?").run(reponse, new Date().toISOString(), body.id);
  audit(db, sess.user.id, 'demande_reponse', String(body.id), ip(req));
  return redirect(res, '/admin');
}
function postPromoDebloquerTous(req, res, sess, body) {
  if (!sess || sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  if (!checkCsrf(sess, body)) return send(res, 403, 'forbidden');
  if (!promoLive()) return redirect(res, '/admin');
  let n = 0;
  for (const a of db.prepare("SELECT id FROM users WHERE role='apprenant'").all()) { if (grantPromoModules(a.id, ip(req))) n++; }
  audit(db, sess.user.id, 'promo_grant_tous', n + ' apprenant(s)', ip(req));
  return redirect(res, '/admin?acces=promo&e=' + n);
}
function postAnnonce(req, res, sess, body) {
  if (!sess || sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  if (!checkCsrf(sess, body)) return send(res, 403, 'forbidden');
  const cible = (body.cible === 'accueil') ? 'accueil' : 'apprenants';
  const msg = String(body.message || '').trim().slice(0, 2000);
  if (msg.length < 2) return redirect(res, '/admin');
  db.prepare("UPDATE annonces SET actif=0 WHERE actif=1 AND (cible=? OR (? = 'apprenants' AND cible IS NULL))").run(cible, cible);
  db.prepare("INSERT INTO annonces(id,message,actif,cree_le,cible) VALUES(?,?,1,?,?)").run(rid(10), msg, new Date().toISOString(), cible);
  audit(db, sess.user.id, 'annonce_publiee', cible + ' · ' + msg.slice(0, 60), ip(req));
  return redirect(res, '/admin?acces=' + (cible === 'accueil' ? 'banniere' : 'annonce'));
}
function postAnnonceOff(req, res, sess, body) {
  if (!sess || sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  if (!checkCsrf(sess, body)) return send(res, 403, 'forbidden');
  const cible = (body.cible === 'accueil') ? 'accueil' : 'apprenants';
  db.prepare("UPDATE annonces SET actif=0 WHERE actif=1 AND (cible=? OR (? = 'apprenants' AND cible IS NULL))").run(cible, cible);
  audit(db, sess.user.id, 'annonce_off', cible, ip(req));
  return redirect(res, '/admin?acces=' + (cible === 'accueil' ? 'banniere_off' : 'annonce_off'));
}
// --- Communauté : mur de discussion partagé (modéré par l'admin) ---
function forumNom(prenom, nom, role) { return role === 'admin' ? '👨‍🏫 Formateur' : (esc(prenom || '') + ' ' + esc((nom || '').slice(0, 1)) + '.'); }
// Heure de Madagascar (UTC+3, pas de changement d'heure) à partir d'un horodatage ISO UTC -> "AAAA-MM-JJ HH:MM"
function dateMG(iso) {
  if (!iso) return '';
  const d = new Date(iso); if (isNaN(d.getTime())) return String(iso).slice(0, 16).replace('T', ' ');
  return new Date(d.getTime() + 3 * 3600000).toISOString().slice(0, 16).replace('T', ' ');
}
function forumMsgsSince(since) {
  return db.prepare("SELECT f.id,f.message,f.cree_le,u.prenom,u.nom,u.role FROM forum f JOIN users u ON u.id=f.user_id WHERE f.supprime=0 AND f.cree_le > ? ORDER BY f.cree_le ASC LIMIT 100").all(since || '');
}
function forumMsgJSON(m) {
  return { id: m.id, auteur: m.role === 'admin' ? '👨‍🏫 Formateur' : (((m.prenom || '') + ' ' + (m.nom || '').slice(0, 1) + '.').trim()), role: m.role, message: m.message, t: dateMG(m.cree_le), cree_le: m.cree_le };
}
function pageForum(sess) {
  if (!forumAccess(sess)) {
    return layout('Communauté', `<h1>💬 Communauté des apprenants</h1>
    <section class="card"><p>L'espace <b>Communauté</b> est réservé aux apprenants ayant un <b>accès actif</b> à la formation.</p>
    ${promoLive() ? '<p class="muted">🎁 Pendant la promo, débloquez gratuitement tous les modules depuis votre espace — vous aurez alors accès à la communauté.</p>' : ''}
    <p><a class="btn" href="/tableau-de-bord">Mon espace</a></p></section>`, sess);
  }
  const isAdmin = sess.user.role === 'admin';
  const rows = db.prepare("SELECT f.id,f.message,f.cree_le,u.prenom,u.nom,u.role FROM forum f JOIN users u ON u.id=f.user_id WHERE f.supprime=0 ORDER BY f.cree_le DESC LIMIT 50").all().reverse();
  const last = rows.length ? rows[rows.length - 1].cree_le : '';
  const item = m => `<div class="offre" id="m-${esc(m.id)}" style="margin-bottom:8px${m.role === 'admin' ? ';border-left:3px solid var(--accent)' : ''}"><p style="margin:0 0 4px">${isAdmin ? `<form method="post" action="/communaute/supprimer" class="inline" style="margin:0;float:right">${csrfField(sess)}<input type="hidden" name="id" value="${esc(m.id)}"><button class="btn small ghost" type="submit" title="Supprimer">🗑</button></form>` : ''}<b>${forumNom(m.prenom, m.nom, m.role)}</b> <span class="muted" style="font-size:11px">${esc(dateMG(m.cree_le))}</span></p><p style="margin:0;white-space:pre-wrap">${esc(m.message)}</p></div>`;
  return layout('Communauté', `<h1>💬 Communauté des apprenants <span class="muted" style="font-size:13px;font-weight:400">· 🟢 en direct · 🕒 heure de Madagascar</span></h1>
  <p class="muted">Échangez entre apprenants : questions, astuces, entraide. Le formateur participe aussi. <b>Charte :</b> restez courtois ; <b>pas</b> de partage du contenu de la formation, ni de coordonnées commerciales. Tout abus peut être supprimé.</p>
  <section class="card" id="forum-box" data-admin="${isAdmin ? '1' : '0'}" data-last="${esc(last)}">
    <div id="forum-list" style="max-height:55vh;overflow-y:auto;padding-right:4px">${rows.map(item).join('') || '<p class="muted" id="forum-empty">Aucun message — lancez la discussion !</p>'}</div>
    <form method="post" action="/communaute" id="forum-form" class="form" style="margin:12px 0 0">${csrfField(sess)}
      <label>Votre message<textarea name="message" required rows="2" maxlength="1000" placeholder="Écrivez à la communauté…"></textarea></label>
      <p style="margin:6px 0 0"><button class="btn" type="submit">Publier</button> <span class="muted" id="forum-status" style="font-size:12px"></span></p></form>
  </section>
  <script src="/public/communaute.js?v=${ASSET_V}" defer></script>`, sess);
}
function postForum(req, res, sess, body) {
  const ajax = body && body._ajax === '1';
  const fail = (m) => { if (ajax) { res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); return res.end(JSON.stringify({ ok: false, error: m })); } return redirect(res, '/communaute'); };
  if (!authed(sess)) return ajax ? fail('Session expirée.') : redirect(res, '/connexion');
  if (!checkCsrf(sess, body)) return fail('Session expirée — rechargez la page.');
  if (!forumAccess(sess)) return fail('Réservé aux apprenants ayant un accès actif.');
  const msg = String(body.message || '').trim().slice(0, 1000);
  if (msg.length < 2) return fail('Message trop court.');
  // Anti-flood basé en base (robuste au redémarrage) : max 6 messages / 5 min par apprenant.
  const cutoff = new Date(Date.now() - 5 * 60000).toISOString();
  const cnt = db.prepare("SELECT COUNT(*) c FROM forum WHERE user_id=? AND cree_le > ?").get(sess.user.id, cutoff).c;
  if (cnt >= 6) return fail('Trop de messages — patientez quelques minutes.');
  const lastByUser = db.prepare("SELECT message FROM forum WHERE user_id=? ORDER BY cree_le DESC LIMIT 1").get(sess.user.id);
  if (lastByUser && lastByUser.message === msg) return fail('Message identique au précédent.');
  db.prepare("INSERT INTO forum(id,user_id,message,cree_le,supprime) VALUES(?,?,?,?,0)").run(rid(10), sess.user.id, msg, new Date().toISOString());
  audit(db, sess.user.id, 'forum_post', msg.slice(0, 50), ip(req));
  if (ajax) { res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); return res.end(JSON.stringify({ ok: true })); }
  return redirect(res, '/communaute');
}
function postForumSupprimer(req, res, sess, body) {
  if (!sess || sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  if (!checkCsrf(sess, body)) return send(res, 403, 'forbidden');
  db.prepare("UPDATE forum SET supprime=1 WHERE id=?").run(body.id);
  audit(db, sess.user.id, 'forum_suppr', String(body.id), ip(req));
  return redirect(res, '/communaute');
}
function postManuel(req, res, sess, body) {
  const ins = insOf(body.ins, sess.user.id); if (!ins) return redirect(res, '/tableau-de-bord');
  const m = methodeManuelle(body.methode); if (!m) return send(res, 200, pagePaiement(sess, ins, 'Moyen de paiement invalide.'));
  const ref = (body.reference || '').trim().slice(0, 60);
  if (ref.length < 3) return send(res, 200, pagePaiement(sess, ins, 'Référence de transaction invalide.'));
  const pid = creerPaiement(db, sess.user.id, ins.id, ins.prix, 'manuel_' + m.code);
  setStatutPaiement(db, pid, 'en_verification', ref);
  db.prepare("UPDATE inscriptions SET statut='en_verification' WHERE id=?").run(ins.id);
  audit(db, sess.user.id, 'paiement_' + m.code, ref, ip(req));
  return send(res, 200, layout('Merci', `<h1>Paiement soumis ✅</h1>
  <p>Votre paiement <b>${esc(m.nom)}</b> (réf. <code>${esc(ref)}</code>) est <b>en cours de vérification</b>. Vous recevrez l'accès dès validation.</p>
  <a class="btn" href="/tableau-de-bord">Retour à mon espace</a>`, sess));
}

async function postOrangeApi(req, res, sess, body) {
  const ins = insOf(body.ins, sess.user.id); if (!ins) return redirect(res, '/tableau-de-bord');
  if (!omApiActive()) return send(res, 200, pagePaiement(sess, ins, 'Orange Money API non configuré.'));
  const pid = creerPaiement(db, sess.user.id, ins.id, ins.prix, 'orange_money_api');
  try {
    const { payToken, paymentUrl } = await omApiInit(ins.prix, pid);
    setStatutPaiement(db, pid, 'en_cours', null, payToken);
    db.prepare("UPDATE inscriptions SET statut='en_verification' WHERE id=?").run(ins.id);
    return redirect(res, paymentUrl);
  } catch (e) {
    setStatutPaiement(db, pid, 'echec');
    return send(res, 200, pagePaiement(sess, ins, 'Échec de l’initialisation Orange Money : ' + esc(e.message)));
  }
}

async function paiementRetour(req, res, sess, url) {
  if (!authed(sess)) return redirect(res, '/connexion');
  const pid = url.searchParams.get('paiement');
  const pay = pid ? db.prepare('SELECT * FROM paiements WHERE id=? AND user_id=?').get(pid, sess.user.id) : null;
  if (!pay) return redirect(res, '/tableau-de-bord');
  try {
    const st = await omApiStatus(pay.provider_ref);
    if (st === 'SUCCESS') { setStatutPaiement(db, pay.id, 'paye'); db.prepare("UPDATE inscriptions SET statut='active', expire_le=? WHERE id=?").run(calcExpiry(), pay.inscription_id); audit(db, sess.user.id, 'paiement_ok', pay.id, ip(req)); rewardParrain(sess.user.id); }
    else setStatutPaiement(db, pay.id, st === 'FAILED' ? 'echec' : 'en_cours');
  } catch { }
  return redirect(res, '/tableau-de-bord');
}

// Accès offert (admin) : accorde un module / un pack à un email inscrit, sans paiement, pour N jours.
function postAdminAcces(req, res, sess, body) {
  if (sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  const email = (body.email || '').trim().toLowerCase();
  const code = (body.offre || '').trim();
  const jours = Math.max(1, Math.min(3650, parseInt(body.jours, 10) || 365));
  const user = db.prepare('SELECT id FROM users WHERE email=?').get(email);
  if (!user) return redirect(res, '/admin?acces=nouser');
  const offre = (cfg.offres || []).find(o => o.code === code && Array.isArray(o.modules) && o.modules.length > 0);
  if (!offre) return redirect(res, '/admin?acces=err');
  const expire = new Date(Date.now() + jours * 86400000).toISOString();
  db.prepare('INSERT INTO inscriptions(id,user_id,offre_code,statut,cree_le,expire_le) VALUES(?,?,?,?,?,?)')
    .run(rid(8), user.id, offre.code, 'active', new Date().toISOString(), expire);
  audit(db, sess.user.id, 'acces_offert', email + ' · ' + offre.code + ' · ' + jours + 'j', ip(req));
  rewardParrain(user.id);
  return redirect(res, '/admin?acces=ok&e=' + encodeURIComponent(email) + '&o=' + encodeURIComponent(offre.code) + '&j=' + jours);
}

// Retirer un accès accordé/payé (révocation immédiate).
function postAdminAccesRetirer(req, res, sess, body) {
  if (sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  const id = (body.id || '').trim();
  const ins = db.prepare("SELECT id,user_id,offre_code FROM inscriptions WHERE id=? AND statut='active'").get(id);
  if (!ins) return redirect(res, '/admin?acces=noid');
  db.prepare("UPDATE inscriptions SET statut='retire' WHERE id=?").run(id);
  audit(db, sess.user.id, 'acces_retire', ins.offre_code + ' · user ' + ins.user_id, ip(req));
  return redirect(res, '/admin?acces=retire');
}

// Modifier la durée d'un accès : expire dans N jours à partir d'aujourd'hui (0 = expire aujourd'hui).
function postAdminAccesModifier(req, res, sess, body) {
  if (sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  const id = (body.id || '').trim();
  const jours = Math.max(0, Math.min(3650, parseInt(body.jours, 10) || 0));
  const ins = db.prepare("SELECT id,user_id,offre_code FROM inscriptions WHERE id=? AND statut='active'").get(id);
  if (!ins) return redirect(res, '/admin?acces=noid');
  const expire = new Date(Date.now() + jours * 86400000).toISOString();
  db.prepare("UPDATE inscriptions SET expire_le=? WHERE id=?").run(expire, id);
  audit(db, sess.user.id, 'acces_modifie', ins.offre_code + ' · user ' + ins.user_id + ' · ' + jours + 'j', ip(req));
  return redirect(res, '/admin?acces=modif');
}

// Valider / annuler l'attestation d'un apprenant (après entretien/test final avec le formateur).
function postAdminAttestation(req, res, sess, body) {
  if (sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  const id = (body.id || '').trim();
  const on = (body.action || '') === 'valider';
  const u = db.prepare("SELECT id,email FROM users WHERE id=? AND role='apprenant'").get(id);
  if (!u) return redirect(res, '/admin?acces=noid');
  if (on) db.prepare('UPDATE users SET attestation_ok=1, attestation_le=? WHERE id=?').run(new Date().toISOString(), id);
  else db.prepare('UPDATE users SET attestation_ok=0, attestation_le=NULL WHERE id=?').run(id);
  audit(db, sess.user.id, on ? 'attestation_validee' : 'attestation_annulee', u.email, ip(req));
  return redirect(res, '/admin?acces=' + (on ? 'att_ok' : 'att_off'));
}

function postAdminValider(req, res, sess, body) {
  if (sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  const pay = db.prepare('SELECT * FROM paiements WHERE id=?').get(body.pid);
  if (pay && pay.statut === 'en_verification') {
    setStatutPaiement(db, pay.id, 'paye');
    db.prepare("UPDATE inscriptions SET statut='active', expire_le=? WHERE id=?").run(calcExpiry(), pay.inscription_id);
    audit(db, sess.user.id, 'paiement_valide_admin', pay.id, ip(req));
    rewardParrain(pay.user_id);
  }
  return redirect(res, '/admin');
}

async function postAdminNotifier(req, res, sess, body) {
  if (sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  const sujet = (body.sujet || '').trim() || 'Mise à jour de votre formation';
  const message = (body.message || '').trim();
  const users = db.prepare("SELECT email FROM users WHERE role!='admin' AND email IS NOT NULL AND email!=''").all();
  let sent = 0;
  if (mailConfigured() && message && users.length) {
    const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#1c2733;max-width:560px">
      <h2 style="color:#16307a">${esc(sujet)}</h2>
      <p>${esc(message).replace(/\n/g, '<br>')}</p>
      <p><a href="${BASE_URL}/tableau-de-bord" style="display:inline-block;background:#16307a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Accéder à ma formation</a></p>
      <hr style="border:none;border-top:1px solid #eee;margin:18px 0">
      <p style="color:#888;font-size:12px">${esc((cfg.societe || {}).nom || '')} — academie-compta-fr.mg</p></div>`;
    const results = await Promise.all(users.map(u => sendEmail(u.email, sujet, html).catch(() => ({ ok: false }))));
    sent = results.filter(r => r && r.ok).length;
    audit(db, sess.user.id, 'notif_maj', sent + '/' + users.length + ' e-mails', ip(req));
  }
  return redirect(res, '/admin?notif=' + sent);
}

server.listen(PORT, () => console.log(`Plateforme en écoute : http://localhost:${PORT}  (PROD=${PROD})`));
