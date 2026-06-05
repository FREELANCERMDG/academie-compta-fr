// ===== Serveur de la plateforme e-learning (Node natif, sans dépendance) =====
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {
  DIR, ROOT, cfg, loadEnv, openDB, hashPassword, verifyPassword, rid,
  signSid, unsignSid, parseCookies, cookie, safeEqual, newTotpSecret, otpauthURI,
  verifyTOTP, esc, securityHeaders, loginGuard, loginFail, loginReset, audit, isEmail, strongPw
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
const db = openDB();
const twofaRequired = () => !(cfg.securite && cfg.securite.twofa_obligatoire === false);

// --- Paramètres fiscaux (source de vérité unique, mise à jour annuelle) ---
function loadFiscalite() { try { return JSON.parse(fs.readFileSync(path.join(DIR, 'fiscalite.json'), 'utf8')); } catch { return null; } }
function fiscaliteBadge() {
  const f = loadFiscalite(); if (!f) return '';
  return `<p class="muted" style="text-align:center">📅 Paramètres fiscaux : <b>référence ${esc(String(f.annee_reference))}</b> (${esc(f.loi_de_finances || '')}) — mis à jour le ${esc(f.date_maj || '')}. <span title="Mise à jour annuelle à la sortie de la loi de finances">Sources officielles (impots.gouv / BOFIP).</span></p>`;
}

// --- Admin initial ---
(function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL, pw = process.env.ADMIN_PASSWORD;
  if (!email || !pw) return;
  if (!db.prepare('SELECT 1 FROM users WHERE role=?').get('admin')) {
    const { hash, salt } = hashPassword(pw);
    db.prepare('INSERT INTO users(id,nom,prenom,email,pass_hash,pass_salt,email_verifie,role,cree_le) VALUES(?,?,?,?,?,?,1,?,?)')
      .run(rid(8), 'Admin', '', email.toLowerCase(), hash, salt, 'admin', new Date().toISOString());
    console.log('[init] Compte admin créé :', email);
  }
})();

// --- Helpers HTTP ---
const ip = req => (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
function send(res, status, html, opts = {}) {
  securityHeaders(res, { prod: PROD, quizCSP: !!opts.quiz });
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

// --- Gabarit ---
function layout(title, body, sess) {
  const u = sess?.user;
  const soc = cfg.societe || {};
  const rcs = soc.immat || [soc.rcs_numero ? ('RCS ' + soc.rcs_numero) : '', soc.rcs || ''].filter(Boolean).join(' · ');
  const wa = (soc.whatsapp || '').replace(/\D/g, '');
  const waBtn = wa ? `<a class="wa" href="https://wa.me/${wa}?text=${encodeURIComponent('Bonjour, je souhaite des informations sur la formation en comptabilité française externalisée.')}" target="_blank" rel="noopener" title="Contact WhatsApp" aria-label="WhatsApp"><svg viewBox="0 0 24 24" width="30" height="30" fill="#fff" aria-hidden="true"><path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02zm-7.01 15.22h-.004a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z"/></svg></a>` : '';
  const nav = u
    ? `<a href="/programme">Programme</a><a href="/tableau-de-bord">Mon espace</a>${u.role === 'admin' ? '<a href="/formation">Formation</a><a href="/admin">Admin</a>' : ''}<a href="/deconnexion">Déconnexion</a>`
    : `<a href="/programme">Programme</a><a href="/connexion">Connexion</a><a class="cta" href="/inscription">S'inscrire</a>`;
  const desc = 'Formation en ligne de comptabilité française externalisée — Madagascar. Cours, quiz, vidéos en malgache, certification. Paiement Orange Money ou carte.';
  const og = `${BASE_URL}/public/og-image.png`;
  const backBtn = (title === 'Accueil') ? '' : `<div class="backbar"><a class="btn ghost small" href="/" onclick="if(history.length>1){history.back();return false;}">← Retour</a> <a class="btn ghost small" href="/">🏠 Accueil</a></div>`;
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
<link rel="stylesheet" href="/public/app.css"></head>
<body><header class="top"><a class="brand" href="/">${esc(cfg.site.nom_plateforme)}</a><nav>${nav}</nav></header>
<main class="wrap">${backBtn}${body}</main>
${waBtn}<footer class="foot">${soc.nom ? `<b>${esc(soc.nom)}</b>${rcs ? ' — ' + esc(rcs) : ''}<br>Attestations de fin de formation délivrées par ${esc(soc.nom)}. ` : ''}Plateforme sécurisée — RGPD / secret professionnel. © 2026 · <a href="/mentions-legales">Mentions légales</a></footer></body></html>`;
}
const csrfField = sess => `<input type="hidden" name="_csrf" value="${esc(sess.row.csrf)}">`;
const money = n => Number(n).toLocaleString('fr-FR') + ' ' + esc(cfg.site.devise);
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
  const cards = MODULES.map(m => {
    const inf = moduleInfo(m.code) || {};
    const topics = (inf.topics || []).map(t => `<li>${esc(t)}</li>`).join('');
    const badge = m.gratuit ? '<b class="gratuit">Gratuit</b>' : '<b class="lock">Aperçu</b>';
    return `<section class="card${m.gratuit ? '' : ' lockcard'}">
      <div class="row2" style="border:0;padding:0"><h2 style="margin:0">${esc(m.titre)}</h2>${badge}</div>
      <p class="muted">${esc(inf.resume || '')}</p>
      <ul>${topics}</ul>
      <a class="btn ${m.gratuit ? '' : 'ghost'}" href="/apercu?m=${esc(m.code)}">${m.gratuit ? 'Lire le module (gratuit)' : 'Voir l\'aperçu du programme'}</a></section>`;
  }).join('');
  return `<h2 style="text-align:center;color:var(--navy)">Le programme — aperçu des 4 modules</h2>${cards}`;
}
function pageAccueil(sess) {
  const offres = db.prepare('SELECT * FROM offres').all();
  return layout('Accueil', `
  <section class="hero"><h1>Formation en comptabilité française externalisée</h1>
  <p class="lead">Plateforme en ligne pour collaborateurs comptables à Madagascar. Cours, quiz, vidéos en malgache, suivi et certification.</p>
  <img class="illus" src="/public/photos/hero.png" alt="Cabinet comptable externalisé — expertise, fiabilité, performance" width="1672" height="941" loading="lazy">
  <p><a class="btn" href="/inscription">Créer mon compte</a> <a class="btn ghost" href="/programme">Voir le programme (gratuit)</a> <a class="btn ghost" href="/decouverte">▶ Visite guidée (1 min)</a></p>
  ${fiscaliteBadge()}</section>
  <section class="card"><h2>Conditions d'accès</h2>
  <ul><li><b>Diplôme requis :</b> ${esc(cfg.conditions.diplome_requis)}.</li>
  <li>Attestation sur l'honneur du diplôme à l'inscription.</li>
  <li>Engagement de confidentialité (RGPD / secret professionnel).</li></ul></section>
  ${apercuModulesSection()}
  ${formateurCard()}
  <section class="card"><h2>Nos offres</h2><div class="grid">${offres.map(o => `<div class="offre"><h3>${esc(o.titre)}</h3><p class="prix">${money(o.prix)}</p></div>`).join('')}</div>
  <p class="muted">Paiement par <b>Orange Money</b> ou carte. Inscrivez-vous pour choisir vos modules.</p></section>`, sess);
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
  <ul><li>📚 <b>4 modules</b> (24 leçons), dont le <b>Module 1 gratuit</b> tout de suite</li>
  <li>🧮 Logiciel <b>Pennylane</b> : déclarer la TVA, rapprochement, immobilisations, cadrage, intracom/intercos — pas à pas avec exemples</li>
  <li>📝 <b>100+ questions de quiz</b>, <b>10 cas pratiques</b> corrigés, <b>évaluation finale</b> (/100)</li>
  <li>🎤 <b>Simulations d'entretien</b> (collaborateur, réviseur, chef de mission, superviseur)</li>
  <li>🏅 <b>Attestation</b> de fin de formation · 💬 <b>demande de rendez-vous</b> intégrée</li>
  <li>⏱️ Accès : <b>${esc(duree)}</b> · 1 appareil · contenu protégé (filigrane personnalisé)</li></ul></section>
  <section class="card"><h2>On commence ?</h2>
  <p><a class="btn" href="/apercu?m=mod1">Lire le Module 1 (gratuit)</a> <a class="btn ghost" href="/tableau-de-bord">Mon espace</a></p></section>`, sess);
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
  <section class="card"><h2>Propriété intellectuelle</h2><p>L'ensemble des contenus (cours, vidéos, supports, quiz) est la propriété de <b>${esc(s.nom)}</b>. Toute reproduction ou diffusion non autorisée est interdite.</p></section>
  <section class="card"><h2>Attestation</h2><p>Les attestations de fin de formation sont délivrées par <b>${esc(s.nom)}</b> (${esc(s.immat || '')}). Attestations internes, sans valeur de diplôme d'État.</p></section>
  <p><a class="btn ghost" href="/">← Accueil</a></p>`, sess);
}

function pageProgramme(sess) {
  const offres = db.prepare('SELECT * FROM offres').all();
  const modulesSection = `<section class="card"><h2>Les 4 modules</h2><div class="prog">${MODULES.map(m => `<a class="pitem" href="/apercu?m=${esc(m.code)}"><span>${esc(m.titre)}</span>${m.gratuit ? '<b class="gratuit">Gratuit</b>' : '<b class="lock">Aperçu</b>'}</a>`).join('')}</div></section>`;
  const n = db.prepare("SELECT COUNT(*) c FROM users WHERE role='apprenant'").get().c + (cfg.compteur_base || 0);
  const compteur = (cfg.afficher_compteur_inscrits && n > 0) ? `<div class="stat"><b>${n}</b><span>apprenant${n > 1 ? 's' : ''} inscrit${n > 1 ? 's' : ''}</span></div>` : '';
  const f = cfg.formateur || {};
  const fstats = (f.annees ? `<div class="stat"><b>${esc(String(f.annees))} ans</b><span>d'expérience</span></div>` : '') + (f.formes ? `<div class="stat"><b>${esc(String(f.formes))}+</b><span>personnes formées</span></div>` : '');
  const stats = `<div class="stats">${fstats}<div class="stat"><b>4</b><span>modules</span></div><div class="stat"><b>100+</b><span>questions de quiz</span></div><div class="stat"><b>10</b><span>cas pratiques</span></div><div class="stat"><b>✓</b><span>attestation</span></div>${compteur}</div>`;
  const temoins = cfg.temoignages || [];
  const tHtml = temoins.length ? `<section class="card"><h2>Ils témoignent</h2><div class="temoins">${temoins.map(t => `<div class="temoin"><p>« ${esc(t.texte)} »</p><div class="who">${esc(t.nom)}</div><div class="role">${esc(t.role)}</div></div>`).join('')}</div></section>` : '';
  return layout('Programme', `
  <section class="hero"><h1>Programme de la formation</h1>
  <p class="lead">Découvrez le contenu <b>gratuitement</b>. Seul le <b>Module 1</b> est offert en intégralité ; les modules 2, 3 et 4 sont consultables en aperçu (objectifs).</p>
  <img class="illus" src="/public/photos/programme.png" alt="Formation en comptabilité française — PCG, écritures, clôture, fiscalité, cas pratiques" width="1536" height="1024" loading="lazy">
  <p><a class="btn" href="/apercu?m=mod1">Lire le Module 1 (gratuit)</a> <a class="btn ghost" href="/inscription">S'inscrire</a></p>${stats}${fiscaliteBadge()}</section>
  ${formateurCard()}
  ${modulesSection}
  <section class="card"><h2>Inclus également</h2><ul><li>10 cas pratiques complets corrigés</li><li>Évaluation finale certifiante (/100)</li><li>Quiz interactifs, vidéos en malgache</li><li><b>Attestation de fin de formation</b> délivrée par <b>${esc((cfg.societe || {}).nom || '')}</b>${(cfg.societe || {}).rcs ? ` (${esc(cfg.societe.rcs)})` : ''}</li></ul></section>
  ${tHtml}
  <section class="card"><h2>Tarifs</h2><div class="grid">${offres.map(o => `<div class="offre"><h3>${esc(o.titre)}</h3><p class="prix">${money(o.prix)}</p></div>`).join('')}</div>
  <p><a class="btn" href="/inscription">Créer mon compte</a></p></section>`, sess);
}

function pageApercu(sess, code) {
  const inf = moduleInfo(code);
  if (!inf) return layout('Aperçu', '<h1>Module introuvable</h1><p><a class="btn" href="/programme">← Programme</a></p>', sess);
  if (inf.gratuit) {
    const q = quizFor(code);
    const quizHtml = q ? `<section class="card"><h2>📝 Quiz du module (démo gratuite)</h2>
    <p class="muted">Testez-vous — résultat non enregistré. Créez un compte pour suivre votre score sur tous les modules.</p>
    <script type="application/json" id="quizdata">${JSON.stringify(q).replace(/</g, '\\u003c')}</script>
    <div id="quiz"></div><script src="/public/quiz.js"></script></section>` : '';
    return layout('Aperçu — ' + inf.titre, `<p class="muted"><a href="/programme">← Programme</a> &middot; <b class="gratuit">Module gratuit</b></p>
    <article class="prose">${moduleCompletHtml(code)}</article>
    ${quizHtml}
    <section class="card"><h2>La suite vous intéresse ?</h2><p>Débloquez les <b>Modules 2, 3 et 4</b> (saisie & logiciels, TVA/rapprochement/lettrage/paie/révision, fiscalité/bilan/cas pratiques) — avec quiz et vidéos.</p><a class="btn" href="/inscription">S'inscrire</a></section>`, sess);
  }
  return layout('Aperçu — ' + inf.titre, `<p class="muted"><a href="/programme">← Programme</a></p>
  <h1>${esc(moduleTitre(code))}</h1>
  <article class="prose">${teaserHtml(code)}</article>
  <section class="card lockcard"><h2>🔒 Contenu complet réservé aux inscrits</h2>
  <p>Le cours détaillé, les procédures pas-à-pas, cas pratiques, checklists et le quiz de ce module sont accessibles après inscription et paiement.</p>
  <a class="btn" href="/inscription">S'inscrire pour débloquer</a> <a class="btn ghost" href="/apercu?m=mod1">Voir un module gratuit</a></section>`, sess);
}

function pageInscription(sess, err, val = {}) {
  return layout('Inscription', `
  <h1>Inscription</h1>
  <p class="muted">Conditions : ${esc(cfg.conditions.diplome_requis)}.</p>
  ${err ? `<p class="err">${esc(err)}</p>` : ''}
  <form method="post" action="/inscription" class="card form" autocomplete="off">
    ${sess ? csrfField(sess) : ''}
    <div class="row"><label>Nom<input name="nom" required value="${esc(val.nom)}"></label>
    <label>Prénom<input name="prenom" required value="${esc(val.prenom)}"></label></div>
    <label>Email<input type="email" name="email" required value="${esc(val.email)}"></label>
    <label>Téléphone<input name="tel" placeholder="+261 ..." value="${esc(val.tel)}"></label>
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
  </form><p class="muted"><a href="/inscription">Créer un compte</a></p>`, sess);
}

function page2faSetup(sess, secret, uri, err, qr) {
  return layout('Activer la double authentification', `<h1>Double authentification (2FA)</h1>
  <p>Sécurisez votre compte « à double tour ». <b>Scannez ce QR code</b> avec <b>Google Authenticator</b> / <b>Authy</b> :</p>
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
  const offres = db.prepare('SELECT * FROM offres').all();
  const ins = db.prepare('SELECT i.*, o.titre, o.prix FROM inscriptions i JOIN offres o ON o.code=i.offre_code WHERE i.user_id=? ORDER BY i.cree_le DESC').all(u.id);
  const active = u.role === 'admin' || hasActive(u.id);
  const fmtDate = s => s ? esc(String(s).slice(0, 10)) : '';
  const expActive = (ins.find(i => i.statut === 'active') || {}).expire_le;
  return layout('Mon espace', `<h1>Bonjour ${esc(u.prenom || u.nom)}</h1>
  <section class="card"><h2>Mon profil</h2>
  <p>Email : ${esc(u.email)} · Tél : ${esc(u.tel || '—')}</p>
  <p>Niveau d'études : ${esc(u.niveau_etudes)} · Auto-évaluation : ${esc(u.niveau_intellectuel)}</p>
  <p>2FA : ${u.twofa ? '✅ activée' : '⚠️ non activée'}</p></section>
  <section class="card"><h2>Accès à la formation</h2>
  ${active ? `<p class="ok">Accès actif ✅${(u.role !== 'admin' && expActive) ? ` — jusqu'au <b>${fmtDate(expActive)}</b>` : (u.role === 'admin' ? ' (admin, illimité)' : '')}</p><a class="btn" href="/formation">Ouvrir la formation</a> <a class="btn ghost" href="/decouverte">▶ Visite guidée (1 min)</a>`
            : `<p class="muted">Aucune offre active (non payée ou durée expirée). Choisissez une offre ci-dessous.</p><a class="btn ghost" href="/decouverte">▶ Visite guidée (1 min)</a>`}</section>
  <section class="card"><h2>Choisir une offre</h2>
  <form method="post" action="/choisir" class="form">${csrfField(sess)}
    <select name="offre_code" required>${offres.map(o => `<option value="${esc(o.code)}">${esc(o.titre)} — ${money(o.prix)}</option>`).join('')}</select>
    <button class="btn" type="submit">Continuer vers le paiement</button></form></section>
  <section class="card"><h2>Une question sur la formation ? 💬</h2>
  <p class="muted">Posez votre question ou demandez un rendez-vous — le formateur vous répond. (Ou via le bouton WhatsApp en bas à droite.)</p>
  <form method="post" action="/demande" class="form">${csrfField(sess)}
    <label>Sujet<input name="sujet" required maxlength="120" placeholder="Ex. Question sur le Module 3, demande de rendez-vous…"></label>
    <label>Votre message<textarea name="message" required rows="4" maxlength="2000" placeholder="Décrivez votre question…"></textarea></label>
    <button class="btn" type="submit">Envoyer ma demande</button></form></section>
  <section class="card"><h2>Mes inscriptions</h2>
  ${ins.length ? `<table><tr><th>Offre</th><th>Montant</th><th>Statut</th><th>Accès jusqu'au</th></tr>${ins.map(i => `<tr><td>${esc(i.titre)}</td><td>${money(i.prix)}</td><td>${esc(i.statut)}</td><td>${i.statut === 'active' ? (i.expire_le ? fmtDate(i.expire_le) : 'illimité') : '—'}</td></tr>`).join('')}</table>` : '<p class="muted">Aucune inscription.</p>'}</section>`, sess);
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

function pageAdmin(sess) {
  const users = db.prepare('SELECT id,nom,prenom,email,niveau_etudes,twofa,cree_le FROM users WHERE role!=? ORDER BY cree_le DESC LIMIT 200').all('admin');
  const pend = db.prepare(`SELECT p.*, u.email, o.titre FROM paiements p JOIN users u ON u.id=p.user_id JOIN inscriptions i ON i.id=p.inscription_id JOIN offres o ON o.code=i.offre_code WHERE p.statut='en_verification' ORDER BY p.cree_le DESC`).all();
  const dem = db.prepare(`SELECT d.*, u.email FROM demandes d JOIN users u ON u.id=d.user_id WHERE d.statut='nouvelle' ORDER BY d.cree_le DESC`).all();
  return layout('Admin', `<h1>Administration</h1>
  <section class="card"><h2>📚 Supports &amp; guides</h2>
  <p class="muted">Tous les guides (diffusion, charte, intégrer vidéos, vidéo promo, réseaux sociaux, checklist, mise en ligne, lois de finances…) — version lisible.</p>
  <p><a class="btn" href="/public/supports/index.html" target="_blank" rel="noopener">Ouvrir tous les supports</a>
     <a class="btn ghost" href="/public/supports/11-Video-promo-script.html" target="_blank" rel="noopener">🎬 Script vidéo</a>
     <a class="btn ghost" href="/public/supports/12-Promo-reseaux-sociaux.html" target="_blank" rel="noopener">📣 Promo réseaux</a></p></section>
  <section class="card"><h2>Contenu de la formation — tous les modules</h2>
  <p class="muted">Accès complet (admin), sans paiement.</p>
  <p><a class="btn" href="/formation">Ouvrir la formation (tous les modules)</a></p>
  <ul>${MODULES.map(m => `<li>${esc(m.titre)}</li>`).join('')}</ul></section>
  <section class="card"><h2>Paiements à valider (${pend.length})</h2>
  ${pend.length ? pend.map(p => `<div class="row2"><span>${esc(p.email)} — ${esc(p.titre)} — ${money(p.montant)} — réf <code>${esc(p.reference || '')}</code></span>
    <form method="post" action="/admin/valider" class="inline">${csrfField(sess)}<input type="hidden" name="pid" value="${esc(p.id)}"><button class="btn small">Valider</button></form></div>`).join('') : '<p class="muted">Aucun paiement en attente.</p>'}</section>
  <section class="card"><h2>Demandes / questions des apprenants (${dem.length})</h2>
  ${dem.length ? dem.map(d => `<div class="row2"><span><b>${esc(d.email)}</b> — ${esc(d.sujet)}<br><span class="muted">${esc(d.message)}</span> <span class="muted">(${esc((d.cree_le || '').slice(0, 10))})</span></span>
    <form method="post" action="/admin/demande-traitee" class="inline">${csrfField(sess)}<input type="hidden" name="id" value="${esc(d.id)}"><button class="btn small">Marquer traitée</button></form></div>`).join('') : '<p class="muted">Aucune demande en attente.</p>'}</section>
  <section class="card"><h2>Apprenants (${users.length})</h2>
  <table><tr><th>Nom</th><th>Email</th><th>Études</th><th>2FA</th><th>Inscrit le</th></tr>
  ${users.map(u => `<tr><td>${esc(u.prenom)} ${esc(u.nom)}</td><td>${esc(u.email)}</td><td>${esc(u.niveau_etudes)}</td><td>${u.twofa ? 'oui' : 'non'}</td><td>${esc((u.cree_le || '').slice(0, 10))}</td></tr>`).join('')}</table></section>`, sess);
}

// --- Service de fichiers statiques sécurisé ---
function serveStatic(res, baseDir, relPath, { course = false } = {}) {
  const safe = path.normalize(relPath).replace(/^(\.\.[\/\\])+/, '');
  const fp = path.join(baseDir, safe);
  if (!fp.startsWith(baseDir) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { send(res, 404, '404'); return; }
  const ext = path.extname(fp).toLowerCase();
  const types = { '.css': 'text/css', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp4': 'video/mp4', '.json': 'application/json', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon' };
  securityHeaders(res, { courseCSP: course, prod: PROD });
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(fp).pipe(res);
}

// --- Cours protégé : filigrane personnalisé + anti-copie + blocage impression ---
function serveCourseIndex(res, sess) {
  let html;
  try { html = fs.readFileSync(path.join(ROOT, 'site', 'index.html'), 'utf8'); }
  catch { return send(res, 500, layout('Erreur', '<h1>Contenu indisponible</h1>', sess)); }
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
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

// --- Routeur ---
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    const p = url.pathname;
    const sess = getSession(req);

    if (req.method === 'GET') {
      if (p === '/sante') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('ok'); }
      if (p === '/') return send(res, 200, pageAccueil(sess));
      if (p === '/programme') return send(res, 200, pageProgramme(sess));
      if (p === '/decouverte') return send(res, 200, pageDecouverte(sess));
      if (p === '/mentions-legales') return send(res, 200, pageMentions(sess));
      if (p === '/apercu') { const code = url.searchParams.get('m') || 'm01'; return send(res, 200, pageApercu(sess, code), { quiz: estGratuit(code) }); }
      if (p.startsWith('/public/')) return serveStatic(res, path.join(DIR, 'public'), p.slice('/public/'.length));
      if (p === '/inscription') return send(res, 200, pageInscription(sess || ensureGuestSession(res, req), null));
      if (p === '/connexion') return send(res, 200, pageConnexion(sess || ensureGuestSession(res, req), null));
      if (p === '/2fa') { if (!authed0(sess) || !sess.row.pending_2fa || !sess.user.twofa) return redirect(res, '/connexion'); return send(res, 200, page2faVerify(sess)); }
      if (p === '/2fa-setup-redirect') { if (!authed0(sess)) return redirect(res, '/connexion'); const secret = newTotpSecret(); const uri = otpauthURI(secret, sess.user.email, cfg.site.nom_plateforme); return send(res, 200, page2faSetup(sess, secret, uri, null, await qrDataURL(uri))); }
      if (p === '/deconnexion') { if (sess) db.prepare('DELETE FROM sessions WHERE id=?').run(sess.sid); return redirect(res, '/', [cookie('sid', '', { maxAge: 0 })]); }

      // espace authentifié
      if (p === '/tableau-de-bord') { if (!authed(sess)) return redirect(res, '/connexion'); return send(res, 200, pageDashboard(sess)); }
      if (p === '/admin') { if (!authed(sess) || sess.user.role !== 'admin') return send(res, 403, layout('403', '<h1>Accès refusé</h1>', sess)); return send(res, 200, pageAdmin(sess)); }
      if (p === '/paiement') {
        if (!authed(sess)) return redirect(res, '/connexion');
        const ins = insOf(url.searchParams.get('ins'), sess.user.id); if (!ins) return send(res, 404, layout('404', '<h1>Introuvable</h1>', sess));
        return send(res, 200, pagePaiement(sess, ins));
      }
      if (p === '/paiement/retour') return paiementRetour(req, res, sess, url);
      // formation protégée
      if (p === '/formation' || p.startsWith('/formation/')) {
        if (!authed(sess)) return redirect(res, '/connexion');
        if (sess.user.role !== 'admin' && !hasActive(sess.user.id)) return send(res, 402, layout('Accès', '<h1>Accès non activé ou expiré</h1><p>Votre accès n\'est pas actif (offre non payée ou durée expirée). Choisissez ou renouvelez une offre.</p><a class="btn" href="/tableau-de-bord">Mon espace</a>', sess));
        const rel = p === '/formation' ? 'index.html' : p.slice('/formation/'.length);
        if (rel === '' || rel === 'index.html') return serveCourseIndex(res, sess);
        return serveStatic(res, path.join(ROOT, 'site'), rel, { course: true });
      }
      return send(res, 404, layout('404', '<h1>Page introuvable</h1>', sess));
    }

    if (req.method === 'POST') {
      const body = await readBody(req);
      // CSRF obligatoire (sauf création de session initiale gérée plus bas)
      if (p === '/inscription') return postInscription(req, res, sess, body);
      if (p === '/connexion') return postConnexion(req, res, sess, body);
      if (!authed0(sess)) return redirect(res, '/connexion');
      if (!checkCsrf(sess, body)) return send(res, 403, layout('403', '<h1>Jeton invalide</h1>', sess));
      if (p === '/2fa-activer') return post2faActiver(req, res, sess, body);
      if (p === '/2fa') return post2fa(req, res, sess, body);
      if (!authed(sess)) return redirect(res, '/connexion');
      if (p === '/choisir') return postChoisir(req, res, sess, body);
      if (p === '/demande') return postDemande(req, res, sess, body);
      if (p === '/admin/demande-traitee') return postDemandeTraitee(req, res, sess, body);
      if (p === '/paiement/manuel') return postManuel(req, res, sess, body);
      if (p === '/paiement/orange-api') return postOrangeApi(req, res, sess, body);
      if (p === '/admin/valider') return postAdminValider(req, res, sess, body);
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
  if (!checkCsrf(sess, body)) return send(res, 403, pageInscription(sess, 'Session expirée, réessayez.'));
  const v = { nom: body.nom?.trim(), prenom: body.prenom?.trim(), email: (body.email || '').trim().toLowerCase(), tel: body.tel?.trim(), niveau_etudes: body.niveau_etudes, niveau_intellectuel: body.niveau_intellectuel };
  if (!v.nom || !v.prenom) return send(res, 200, pageInscription(sess, 'Nom et prénom obligatoires.', v));
  if (!isEmail(v.email)) return send(res, 200, pageInscription(sess, 'Email invalide.', v));
  if (!strongPw(body.pw)) return send(res, 200, pageInscription(sess, 'Mot de passe trop faible (10+ caractères, lettres et chiffres).', v));
  if (cfg.conditions.attestation_obligatoire && body.diplome_bac2 !== '1') return send(res, 200, pageInscription(sess, `Condition non remplie : ${cfg.conditions.diplome_requis} (attestation obligatoire).`, v));
  if (body.rgpd !== '1') return send(res, 200, pageInscription(sess, 'Vous devez accepter la confidentialité (RGPD).', v));
  if (db.prepare('SELECT 1 FROM users WHERE email=?').get(v.email)) return send(res, 200, pageInscription(sess, 'Un compte existe déjà avec cet email.', v));
  const { hash, salt } = hashPassword(body.pw);
  const id = rid(8);
  db.prepare('INSERT INTO users(id,nom,prenom,email,tel,niveau_etudes,diplome_bac2,niveau_intellectuel,pass_hash,pass_salt,email_verifie,role,cree_le) VALUES(?,?,?,?,?,?,1,?,?,?,1,?,?)')
    .run(id, v.nom, v.prenom, v.email, v.tel || '', v.niveau_etudes, v.niveau_intellectuel, hash, salt, 'apprenant', new Date().toISOString());
  audit(db, id, 'inscription', v.email, ip(req));
  if (twofaRequired()) {
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
  if (u.twofa) { db.prepare('UPDATE sessions SET user_id=?, pending_2fa=1 WHERE id=?').run(u.id, sess.sid); audit(db, u.id, 'login_ok_2fa', '', ip(req)); return redirect(res, '/2fa'); }
  if (twofaRequired()) {
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
  const secret = body.secret;
  if (!verifyTOTP(secret, body.code)) { const uri = otpauthURI(secret, sess.user.email, cfg.site.nom_plateforme); return send(res, 200, page2faSetup(sess, secret, uri, 'Code incorrect, réessayez.', await qrDataURL(uri))); }
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
  if (!o) return redirect(res, '/tableau-de-bord');
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
function postDemandeTraitee(req, res, sess, body) {
  if (sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  db.prepare("UPDATE demandes SET statut='traitee' WHERE id=?").run(body.id);
  return redirect(res, '/admin');
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
    if (st === 'SUCCESS') { setStatutPaiement(db, pay.id, 'paye'); db.prepare("UPDATE inscriptions SET statut='active', expire_le=? WHERE id=?").run(calcExpiry(), pay.inscription_id); audit(db, sess.user.id, 'paiement_ok', pay.id, ip(req)); }
    else setStatutPaiement(db, pay.id, st === 'FAILED' ? 'echec' : 'en_cours');
  } catch { }
  return redirect(res, '/tableau-de-bord');
}

function postAdminValider(req, res, sess, body) {
  if (sess.user.role !== 'admin') return send(res, 403, 'forbidden');
  const pay = db.prepare('SELECT * FROM paiements WHERE id=?').get(body.pid);
  if (pay && pay.statut === 'en_verification') {
    setStatutPaiement(db, pay.id, 'paye');
    db.prepare("UPDATE inscriptions SET statut='active', expire_le=? WHERE id=?").run(calcExpiry(), pay.inscription_id);
    audit(db, sess.user.id, 'paiement_valide_admin', pay.id, ip(req));
  }
  return redirect(res, '/admin');
}

server.listen(PORT, () => console.log(`Plateforme en écoute : http://localhost:${PORT}  (PROD=${PROD})`));
