// ===== Paiements : Orange Money (manuel + API) et carte =====
import { cfg, rid } from './lib.mjs';

// Crée un paiement en base et renvoie son id
export function creerPaiement(db, userId, inscriptionId, montant, methode) {
  const id = rid(12);
  db.prepare('INSERT INTO paiements(id,user_id,inscription_id,montant,methode,statut,cree_le) VALUES(?,?,?,?,?,?,?)')
    .run(id, userId, inscriptionId, montant, methode, 'initie', new Date().toISOString());
  return id;
}

export function setStatutPaiement(db, id, statut, ref, providerRef) {
  db.prepare('UPDATE paiements SET statut=?, reference=COALESCE(?,reference), provider_ref=COALESCE(?,provider_ref), maj_le=? WHERE id=?')
    .run(statut, ref || null, providerRef || null, new Date().toISOString(), id);
}

// --- Paiements MANUELS multi-méthodes (Orange Money, MVola, Airtel, virement) ---
// Une méthode est proposée si actif=true ET qu'au moins un detail est renseigné.
export function methodesManuelles() {
  return (cfg.paiements_manuels || []).filter(m => m.actif && Object.values(m.details || {}).some(v => v && String(v).trim()));
}
export function methodeManuelle(code) {
  return methodesManuelles().find(m => m.code === code) || null;
}

// --- Orange Money API (Web Payment) : activé si OM_* présents dans .env ---
export function omApiActive() {
  return !!(process.env.OM_BASE_URL && process.env.OM_CLIENT_ID && process.env.OM_CLIENT_SECRET && process.env.OM_MERCHANT_KEY);
}

async function omToken() {
  const auth = Buffer.from(`${process.env.OM_CLIENT_ID}:${process.env.OM_CLIENT_SECRET}`).toString('base64');
  const r = await fetch(`${process.env.OM_BASE_URL}/oauth/v3/token`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  if (!r.ok) throw new Error('OM token HTTP ' + r.status);
  return (await r.json()).access_token;
}

// Initialise un paiement Web Payment et renvoie l'URL de redirection + payToken
export async function omApiInit(montant, orderId) {
  const token = await omToken();
  const body = {
    merchant_key: process.env.OM_MERCHANT_KEY,
    currency: 'OUV', // bac à sable Orange ; en prod : devise réelle (ex. MGA)
    order_id: orderId,
    amount: montant,
    return_url: process.env.OM_RETURN_URL,
    cancel_url: process.env.OM_CANCEL_URL,
    notif_url: process.env.OM_NOTIF_URL,
    lang: 'fr', reference: 'Formation'
  };
  const r = await fetch(`${process.env.OM_BASE_URL}/omcoreapis/1.0.2/mp/init`, {
    method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error('OM init HTTP ' + r.status);
  const d = await r.json();
  return { payToken: d.pay_token, paymentUrl: d.payment_url };
}

export async function omApiStatus(payToken) {
  const token = await omToken();
  const r = await fetch(`${process.env.OM_BASE_URL}/omcoreapis/1.0.2/mp/paymentstatus/${payToken}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!r.ok) throw new Error('OM status HTTP ' + r.status);
  return (await r.json()).status; // ex. SUCCESS / PENDING / FAILED
}

// --- Carte (Visa/Mastercard) : à brancher sur un PSP (Stripe, PayGreen...) ---
export function carteActive() { return cfg.carte.active && !!process.env.CARD_SECRET_KEY; }
