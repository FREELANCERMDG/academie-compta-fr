// ===== Socle: env, base de données, crypto, 2FA TOTP, sécurité =====
// Aucune dépendance externe : modules Node natifs uniquement.
import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DIR = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.dirname(DIR);

// ---- .env minimal ----
export function loadEnv() {
  const p = path.join(DIR, '.env');
  if (fs.existsSync(p)) {
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}
export const cfg = JSON.parse(fs.readFileSync(path.join(DIR, 'config.json'), 'utf8'));

// ---- Base de données ----
export function openDB() {
  // DATA_DIR (ex. disque persistant /data en production) ; sinon dossier de l'app.
  const dataDir = process.env.DATA_DIR || DIR;
  try { fs.mkdirSync(dataDir, { recursive: true }); } catch {}
  const db = new DatabaseSync(path.join(dataDir, 'data.db'));
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
  CREATE TABLE IF NOT EXISTS users(
    id TEXT PRIMARY KEY, nom TEXT, prenom TEXT, email TEXT UNIQUE, tel TEXT,
    niveau_etudes TEXT, diplome_bac2 INTEGER, niveau_intellectuel TEXT,
    pass_hash TEXT, pass_salt TEXT, totp_secret TEXT, twofa INTEGER DEFAULT 0,
    email_verifie INTEGER DEFAULT 0, verify_token TEXT, role TEXT DEFAULT 'apprenant',
    cree_le TEXT);
  CREATE TABLE IF NOT EXISTS sessions(
    id TEXT PRIMARY KEY, user_id TEXT, csrf TEXT, pending_2fa INTEGER DEFAULT 0,
    cree_le TEXT, expire_le TEXT, ip TEXT, ua TEXT);
  CREATE TABLE IF NOT EXISTS offres(code TEXT PRIMARY KEY, titre TEXT, prix INTEGER);
  CREATE TABLE IF NOT EXISTS inscriptions(
    id TEXT PRIMARY KEY, user_id TEXT, offre_code TEXT, statut TEXT DEFAULT 'en_attente', cree_le TEXT);
  CREATE TABLE IF NOT EXISTS paiements(
    id TEXT PRIMARY KEY, user_id TEXT, inscription_id TEXT, montant INTEGER,
    methode TEXT, statut TEXT DEFAULT 'initie', reference TEXT, provider_ref TEXT, cree_le TEXT, maj_le TEXT);
  CREATE TABLE IF NOT EXISTS tentatives(email TEXT PRIMARY KEY, n INTEGER DEFAULT 0, bloque_jusqu TEXT);
  CREATE TABLE IF NOT EXISTS journal(id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT, user_id TEXT, action TEXT, detail TEXT, ip TEXT);
  CREATE TABLE IF NOT EXISTS demandes(id TEXT PRIMARY KEY, user_id TEXT, sujet TEXT, message TEXT, statut TEXT DEFAULT 'nouvelle', cree_le TEXT);
  CREATE TABLE IF NOT EXISTS visites(jour TEXT, pays TEXT, n INTEGER DEFAULT 0, PRIMARY KEY(jour, pays));
  CREATE TABLE IF NOT EXISTS progression(user_id TEXT PRIMARY KEY, niveau INTEGER DEFAULT 0, niveau_nom TEXT, badges INTEGER DEFAULT 0, lessons INTEGER DEFAULT 0, maj_le TEXT);
  `);
  // migration : colonne d'expiration d'accès
  try { db.exec('ALTER TABLE inscriptions ADD COLUMN expire_le TEXT'); } catch { }
  // table : offres d'emploi internes (mini-bourse, gérée en admin)
  try { db.exec("CREATE TABLE IF NOT EXISTS offres_emploi(id TEXT PRIMARY KEY, titre TEXT, entreprise TEXT, lieu TEXT, contrat TEXT, description TEXT, lien TEXT, cree_le TEXT)"); } catch { }
  // migration : parrainage (code perso + parrain + flag récompense)
  try { db.exec('ALTER TABLE users ADD COLUMN code_parrain TEXT'); } catch { }
  try { db.exec('ALTER TABLE users ADD COLUMN parrain_id TEXT'); } catch { }
  try { db.exec('ALTER TABLE users ADD COLUMN parrain_recompense INTEGER DEFAULT 0'); } catch { }
  // migration : réponse du formateur aux demandes des apprenants
  try { db.exec('ALTER TABLE demandes ADD COLUMN reponse TEXT'); } catch { }
  try { db.exec('ALTER TABLE demandes ADD COLUMN repondu_le TEXT'); } catch { }
  // table : annonces (message du formateur affiché dans l'espace de chaque apprenant)
  try { db.exec("CREATE TABLE IF NOT EXISTS annonces(id TEXT PRIMARY KEY, message TEXT, actif INTEGER DEFAULT 1, cree_le TEXT)"); } catch { }
  // table : communauté (mur de discussion partagé entre apprenants, modéré par l'admin)
  try { db.exec("CREATE TABLE IF NOT EXISTS forum(id TEXT PRIMARY KEY, user_id TEXT, message TEXT, cree_le TEXT, supprime INTEGER DEFAULT 0)"); } catch { }
  try {
    const sans = db.prepare("SELECT id FROM users WHERE code_parrain IS NULL OR code_parrain=''").all();
    const exists = db.prepare('SELECT 1 FROM users WHERE code_parrain=?');
    const setc = db.prepare('UPDATE users SET code_parrain=? WHERE id=?');
    for (const u of sans) { let c; do { c = genParrainCode(); } while (exists.get(c)); setc.run(c, u.id); }
  } catch { }
  // seed offres (+ retrait des offres supprimées de la config, si non utilisées)
  const up = db.prepare('INSERT INTO offres(code,titre,prix) VALUES(?,?,?) ON CONFLICT(code) DO UPDATE SET titre=excluded.titre,prix=excluded.prix');
  for (const o of cfg.offres) up.run(o.code, o.titre, o.prix);
  const codes = cfg.offres.map(o => o.code);
  const ph = codes.map(() => '?').join(',');
  try { db.prepare(`DELETE FROM offres WHERE code NOT IN (${ph}) AND code NOT IN (SELECT DISTINCT offre_code FROM inscriptions)`).run(...codes); } catch { }
  return db;
}

// ---- Crypto mots de passe ----
export function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pw, salt, 64).toString('hex');
  return { hash, salt };
}
export function verifyPassword(pw, hash, salt) {
  if (!hash || !salt) return false;
  const h = crypto.scryptSync(pw, salt, 64);
  const stored = Buffer.from(hash, 'hex');
  return h.length === stored.length && crypto.timingSafeEqual(h, stored);
}
export const rid = (n = 24) => crypto.randomBytes(n).toString('hex');
// Code de parrainage court et lisible (sans I/O/0/1/L pour éviter les confusions)
const PCHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export function genParrainCode(n = 6) { const b = crypto.randomBytes(n); let s = ''; for (let i = 0; i < n; i++) s += PCHARS[b[i] % PCHARS.length]; return s; }

// ---- Cookies signés ----
function hmac(v) { return crypto.createHmac('sha256', process.env.SESSION_SECRET || 'dev-secret').update(v).digest('base64url'); }
export function signSid(sid) { return sid + '.' + hmac(sid); }
export function unsignSid(signed) {
  if (!signed || !signed.includes('.')) return null;
  const i = signed.lastIndexOf('.'); const sid = signed.slice(0, i); const sig = signed.slice(i + 1);
  const exp = hmac(sid);
  if (sig.length === exp.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(exp))) return sid;
  return null;
}
export function parseCookies(req) {
  const out = {}; const c = req.headers.cookie;
  if (c) for (const part of c.split(';')) { const i = part.indexOf('='); if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim()); }
  return out;
}
export function cookie(name, val, { maxAge = 0, secure = false } = {}) {
  let s = `${name}=${encodeURIComponent(val)}; Path=/; HttpOnly; SameSite=Strict`;
  if (secure) s += '; Secure';
  if (maxAge) s += `; Max-Age=${maxAge}`;
  return s;
}
export const safeEqual = (a, b) => { try { return a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b)); } catch { return false; } };

// ---- Base32 + TOTP (RFC 6238) ----
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function b32encode(buf) {
  let bits = 0, val = 0, out = '';
  for (const b of buf) { val = (val << 8) | b; bits += 8; while (bits >= 5) { out += B32[(val >>> (bits - 5)) & 31]; bits -= 5; } }
  if (bits > 0) out += B32[(val << (5 - bits)) & 31];
  return out;
}
function b32decode(s) {
  s = s.replace(/=+$/, '').toUpperCase(); let bits = 0, val = 0; const out = [];
  for (const ch of s) { const idx = B32.indexOf(ch); if (idx < 0) continue; val = (val << 5) | idx; bits += 5; if (bits >= 8) { out.push((val >>> (bits - 8)) & 0xff); bits -= 8; } }
  return Buffer.from(out);
}
export const newTotpSecret = () => b32encode(crypto.randomBytes(20));
export function otpauthURI(secret, label, issuer) {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}
function hotp(secret, counter) {
  const key = b32decode(secret); const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(BigInt(counter));
  const h = crypto.createHmac('sha1', key).update(buf).digest();
  const o = h[h.length - 1] & 0xf;
  const code = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return (code % 1e6).toString().padStart(6, '0');
}
export const genTOTP = (secret) => hotp(secret, Math.floor(Date.now() / 30000));
export function verifyTOTP(secret, token, window = 2) {
  if (!/^\d{6}$/.test(token || '')) return false;
  const c = Math.floor(Date.now() / 30000);
  for (let i = -window; i <= window; i++) if (safeEqual(hotp(secret, c + i), token)) return true;
  return false;
}

// ---- Échappement HTML ----
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

// ---- En-têtes de sécurité ----
export function securityHeaders(res, { courseCSP = false, quizCSP = false, prod = false } = {}) {
  const csp = courseCSP
    ? "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' https:; object-src 'self'; frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com; base-uri 'none'; frame-ancestors 'none'"
    : quizCSP
    ? "default-src 'none'; script-src 'self'; connect-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; manifest-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'"
    : "default-src 'none'; script-src 'self'; connect-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; manifest-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'";
  res.setHeader('Content-Security-Policy', csp);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  // Le cours intègre des vidéos YouTube : il faut envoyer l'origine (sinon erreur 153 "configuration"). Ailleurs : no-referrer.
  res.setHeader('Referrer-Policy', courseCSP ? 'strict-origin-when-cross-origin' : 'no-referrer');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), browsing-topics=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.removeHeader('X-Powered-By');
  if (prod) res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
}

// ---- Anti brute-force (verrouillage lié au compte) ----
export function loginGuard(db, email) {
  const r = db.prepare('SELECT n,bloque_jusqu FROM tentatives WHERE email=?').get(email);
  if (r && r.bloque_jusqu && new Date(r.bloque_jusqu) > new Date()) return { locked: true, until: r.bloque_jusqu };
  return { locked: false };
}
export function loginFail(db, email, max = 5, lockMin = 15) {
  const r = db.prepare('SELECT n FROM tentatives WHERE email=?').get(email);
  const n = (r ? r.n : 0) + 1;
  const bloque = n >= max ? new Date(Date.now() + lockMin * 60000).toISOString() : null;
  db.prepare('INSERT INTO tentatives(email,n,bloque_jusqu) VALUES(?,?,?) ON CONFLICT(email) DO UPDATE SET n=excluded.n,bloque_jusqu=excluded.bloque_jusqu').run(email, n, bloque);
}
export const loginReset = (db, email) => db.prepare('DELETE FROM tentatives WHERE email=?').run(email);

export function audit(db, userId, action, detail, ip) {
  db.prepare('INSERT INTO journal(ts,user_id,action,detail,ip) VALUES(?,?,?,?,?)').run(new Date().toISOString(), userId || null, action, detail || '', ip || '');
}

// ---- Envoi d'e-mail (API Brevo, sans dépendance ; no-op si non configuré) ----
export const mailConfigured = () => !!(process.env.BREVO_API_KEY && process.env.MAIL_FROM);
export async function sendEmail(to, subject, html) {
  const key = process.env.BREVO_API_KEY, from = process.env.MAIL_FROM;
  if (!key || !from || !to) return { ok: false, skipped: true };
  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': key, 'content-type': 'application/json', 'accept': 'application/json' },
      body: JSON.stringify({
        sender: { email: from, name: process.env.MAIL_FROM_NAME || 'Académie Compta FR' },
        to: [{ email: to }], subject, htmlContent: html
      })
    });
    return { ok: r.ok, status: r.status };
  } catch (e) { return { ok: false, error: String(e) }; }
}

// ---- Validation ----
export const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || '');
export const strongPw = p => typeof p === 'string' && p.length >= 10 && /[A-Za-z]/.test(p) && /\d/.test(p);
