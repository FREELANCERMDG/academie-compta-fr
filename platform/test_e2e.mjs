// Test bout-en-bout de la plateforme (à lancer serveur démarré sur PORT).
import { genTOTP } from './lib.mjs';
const BASE = 'http://localhost:' + (process.env.PORT || '3210');
let ok = 0, ko = 0;
const A = (c, m) => { if (c) { ok++; console.log('  ✓', m); } else { ko++; console.log('  ✗ ÉCHEC:', m); } };

function jar() {
  const c = {};
  return {
    header: () => Object.entries(c).map(([k, v]) => `${k}=${v}`).join('; '),
    update: (resp) => { for (const sc of resp.headers.getSetCookie?.() || []) { const [kv] = sc.split(';'); const i = kv.indexOf('='); const k = kv.slice(0, i), v = kv.slice(i + 1); if (v === '') delete c[k]; else c[k] = v; } }
  };
}
async function rq(j, method, p, form) {
  const h = { Cookie: j.header() };
  let body;
  if (form) { h['Content-Type'] = 'application/x-www-form-urlencoded'; body = new URLSearchParams(form).toString(); }
  const r = await fetch(BASE + p, { method, headers: h, body, redirect: 'manual' });
  j.update(r);
  const text = (r.status >= 300 && r.status < 400) ? '' : await r.text();
  return { status: r.status, loc: r.headers.get('location'), body: text };
}
const csrf = html => (html.match(/name="_csrf" value="([^"]+)"/) || [])[1];

const run = async () => {
  console.log('E2E plateforme @', BASE);

  // 1) Inscription
  const L = jar();
  let r = await rq(L, 'GET', '/inscription');
  A(r.status === 200 && r.body.includes('Inscription'), 'page inscription servie');
  let tok = csrf(r.body); A(!!tok, 'jeton CSRF présent');
  const email = 'apprenant' + Date.now() + '@test.mg';
  r = await rq(L, 'POST', '/inscription', { _csrf: tok, nom: 'RAKOTO', prenom: 'Jean', email, tel: '+261340000000', niveau_etudes: 'BAC+2 comptabilité', niveau_intellectuel: 'Intermédiaire', diplome_bac2: '1', rgpd: '1', pw: 'MotDePasse2026' });
  A(r.status === 303 && (r.loc === '/2fa-setup-redirect' || r.loc === '/tableau-de-bord'), 'inscription OK');
  const need2fa = r.loc === '/2fa-setup-redirect';

  // Refus si pas d'attestation BAC+2
  const L2 = jar(); let r2 = await rq(L2, 'GET', '/inscription'); r2 = await rq(L2, 'POST', '/inscription', { _csrf: csrf(r2.body), nom: 'X', prenom: 'Y', email: 'x' + Date.now() + '@t.mg', niveau_etudes: 'Autre', niveau_intellectuel: 'Débutant', rgpd: '1', pw: 'MotDePasse2026' });
  A(r2.status === 200 && /BAC\+2/.test(r2.body), 'inscription REFUSÉE sans attestation BAC+2 (condition appliquée)');

  // 2) Activer 2FA (si imposée par la config)
  if (need2fa) {
    r = await rq(L, 'GET', '/2fa-setup-redirect');
    const secret = (r.body.match(/name="secret" value="([^"]+)"/) || [])[1];
    A(!!secret, 'secret TOTP généré');
    r = await rq(L, 'POST', '/2fa-activer', { _csrf: csrf(r.body), secret, code: genTOTP(secret) });
    A(r.status === 303 && r.loc === '/tableau-de-bord', '2FA activée → tableau de bord');
  } else { A(true, '2FA optionnelle (désactivée en config)'); }

  // 3) Dashboard
  r = await rq(L, 'GET', '/tableau-de-bord');
  A(r.status === 200 && r.body.includes('Mon profil'), 'tableau de bord accessible');

  // 4) Choisir offre
  r = await rq(L, 'POST', '/choisir', { _csrf: csrf(r.body), offre_code: 'PACK_COMPLET' });
  A(r.status === 303 && r.loc.startsWith('/paiement?ins='), 'offre choisie → page paiement');
  const insId = r.loc.split('ins=')[1];

  // 5) Page paiement contient le numéro Orange Money
  r = await rq(L, 'GET', '/paiement?ins=' + insId);
  A(r.body.includes('+261 32 73 622 59'), 'numéro Orange Money affiché (+261 32 73 622 59)');
  A(r.body.includes('RANDRIAMANANTSOA HERINIANA ANTONNY'), 'bénéficiaire affiché');
  A(r.body.includes('+261 38 10 417 11') && r.body.includes('MVola'), 'numéro MVola affiché (+261 38 10 417 11)');

  // 6) Accès formation refusé AVANT paiement
  r = await rq(L, 'GET', '/formation');
  A(r.status === 402, 'accès formation refusé tant que non payé (402)');

  // 7) Soumettre paiement Orange Money manuel
  r = await rq(L, 'GET', '/paiement?ins=' + insId);
  r = await rq(L, 'POST', '/paiement/manuel', { _csrf: csrf(r.body), ins: insId, methode: 'orange', reference: 'PP' + Date.now() });
  A(r.status === 200 && /v.rification/i.test(r.body), 'paiement soumis → en vérification');

  // 8) Admin valide
  const ADM = jar();
  r = await rq(ADM, 'GET', '/connexion');
  r = await rq(ADM, 'POST', '/connexion', { _csrf: csrf(r.body), email: 'admin@academie.mg', pw: 'AdminFort2026!xy' });
  A(r.status === 303, 'admin: login accepté');
  // admin sans 2FA -> forcé en setup
  if (r.loc === '/2fa-setup-redirect') {
    r = await rq(ADM, 'GET', '/2fa-setup-redirect');
    const s2 = (r.body.match(/name="secret" value="([^"]+)"/) || [])[1];
    r = await rq(ADM, 'POST', '/2fa-activer', { _csrf: csrf(r.body), secret: s2, code: genTOTP(s2) });
  }
  r = await rq(ADM, 'GET', '/admin');
  A(r.status === 200 && r.body.includes('Administration'), 'espace admin accessible');
  const pid = (r.body.match(/name="pid" value="([^"]+)"/) || [])[1];
  A(!!pid, 'paiement en attente listé côté admin');
  r = await rq(ADM, 'POST', '/admin/valider', { _csrf: csrf((await rq(ADM, 'GET', '/admin')).body), pid });
  A(r.status === 303, 'admin a validé le paiement');

  // 9) Apprenant accède à la formation
  r = await rq(L, 'GET', '/formation');
  A(r.status === 200 && r.body.length > 1000, 'apprenant accède à la formation après validation');

  // 10) CSRF rejeté si jeton manquant
  r = await rq(L, 'POST', '/choisir', { offre_code: 'PACK_COMPLET' });
  A(r.status === 403, 'POST sans jeton CSRF rejeté (403)');

  console.log(`\nRÉSULTAT : ${ok} OK, ${ko} échec(s)`);
  process.exit(ko ? 1 : 0);
};
run().catch(e => { console.error(e); process.exit(1); });
