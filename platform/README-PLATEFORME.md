# Plateforme e-learning — documentation

Application web complète : **inscription**, **conditions d'accès (BAC+2 compta)**, **profil apprenant**, **double authentification (2FA)**, **choix d'offre**, **paiement Orange Money / carte**, **accès protégé à la formation**, **espace admin**. Construite en **Node.js natif, sans aucune dépendance externe** (surface d'attaque minimale, pas de risque de chaîne d'approvisionnement).

---

## 1. Démarrage rapide
```bash
cd platform
cp .env.example .env          # puis éditez .env (voir §2)
node server.mjs               # http://localhost:3000  (ou PORT défini)
```
Prérequis : Node.js ≥ 22 (utilise `node:sqlite`, `node:crypto`). Testé sur Node 25.
La base `data.db` (SQLite) est créée automatiquement. Le compte admin est créé au 1er démarrage depuis `.env`.

Test automatique de bout en bout :
```bash
PORT=3210 node server.mjs &   # dans un terminal
PORT=3210 node test_e2e.mjs   # 18 vérifications
```

## 2. Configuration
- **`.env`** (secrets — ne jamais publier) :
  - `SESSION_SECRET` : **chaîne aléatoire longue** (signature sessions/CSRF). Générer : `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
  - `ADMIN_EMAIL` / `ADMIN_PASSWORD` : compte admin initial — **à changer**.
  - `PRODUCTION=true` en production (active cookies `Secure` + HSTS — nécessite HTTPS).
  - `OM_*` : clés Orange Money API (optionnel, §4).
- **`config.json`** (non secret) : nom de plateforme, devise, **offres et prix (en Ariary)**, et le **numéro Orange Money de réception** :
  - `numero`: **+261 32 73 622 59** · `beneficiaire`: **RANDRIAMANANTSOA HERINIANA ANTONNY**.

## 3. Fonctionnement (parcours apprenant)
1. **Inscription** : nom, prénom, email, téléphone, **niveau d'études**, auto-évaluation, **attestation BAC+2 compta (obligatoire)**, acceptation RGPD, mot de passe.
2. **2FA** : activation obligatoire (TOTP — Google Authenticator/Authy). C'est la sécurité « à double tour ».
3. **Tableau de bord** : profil, choix d'une **offre**, suivi des inscriptions.
4. **Paiement** → accès à la formation activé.
5. **Formation** : le site e-learning (`/site`) est servi **uniquement** aux apprenants ayant une inscription **active**.

## 4. Paiement
### Orange Money — mode MANUEL (actif immédiatement)
L'apprenant envoie le montant au **+261 32 73 622 59** (RANDRIAMANANTSOA HERINIANA ANTONNY) via `#144#` / app, puis **saisit la référence** de transaction. Le paiement passe en **« en vérification »**. Dans l'**espace admin**, vous **validez** → l'accès est activé.

### Orange Money — mode API (automatique, optionnel)
Pour un encaissement automatique sans validation manuelle :
1. Devenir **marchand Orange Money** (en agence) et créer une app sur https://developer.orange.com/apis/om-webpay.
2. Renseigner `OM_BASE_URL, OM_CLIENT_ID, OM_CLIENT_SECRET, OM_MERCHANT_KEY, OM_RETURN_URL, OM_CANCEL_URL, OM_NOTIF_URL` dans `.env`.
3. Passer `orange_money.mode` à `"api"` dans `config.json`.
Le flux implémenté : `token` → `mp/init` (redirection paiement) → `mp/paymentstatus` (au retour) → activation.

### Carte Visa / Mastercard (optionnel)
Brancher un PSP (Stripe, PayGreen…) : `CARD_*` dans `.env` + `carte.active=true`. Point d'intégration prévu dans `payments.mjs`.

## 5. Sécurité « double tour » (mesures implémentées)
| Risque | Mesure |
|---|---|
| Vol de mot de passe | **scrypt** salé (jamais stocké en clair), politique 10+ caractères |
| Compte compromis | **2FA TOTP obligatoire** (RFC 6238) |
| Force brute | **verrouillage de compte** (5 essais → 15 min), lié au compte (OWASP) |
| Vol de session | cookie **HttpOnly + SameSite=Strict + Secure (prod)**, id imprévisible (24 o), **signé HMAC**, **régénéré** après login (anti-fixation), expiration 8 h |
| CSRF | **jeton par session** sur tous les POST (comparaison à temps constant) |
| Injection SQL | **requêtes paramétrées** (prepared statements) partout |
| XSS | **échappement HTML** de toute donnée utilisateur + **CSP stricte** (`default-src 'none'`) |
| Clickjacking | `X-Frame-Options: DENY` + `frame-ancestors 'none'` |
| Sniffing/UI | `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS (prod) |
| Traversée de chemin | service statique **normalisé et confiné** |
| Traçabilité | **journal d'audit** (inscriptions, connexions, 2FA, paiements) |
| Chaîne d'appro. | **zéro dépendance npm** |

## 6. Mise en production (à faire côté hébergement)
1. **HTTPS obligatoire** : placer derrière **Caddy** ou **Nginx** + **Let's Encrypt** (TLS), puis `PRODUCTION=true`.
2. **Secrets** : `SESSION_SECRET` fort et unique ; changer le mot de passe admin ; activer la 2FA de l'admin.
3. **Sauvegardes** : sauvegarder `data.db` (et `data.db-wal`) régulièrement, chiffrées.
4. **Pare-feu / WAF** + limitation de débit au niveau du reverse proxy ; fail2ban.
5. **Mises à jour** Node.js régulières.
6. **RGPD** : registre des traitements, durée de conservation, droit d'accès/suppression.
7. (Recommandé) e-mails de vérification (SMTP) et reset de mot de passe — points d'extension prévus.

## 7. Fichiers
- `server.mjs` — serveur HTTP + routes + pages.
- `lib.mjs` — DB, crypto, 2FA, sécurité, validation.
- `payments.mjs` — Orange Money (manuel + API) + carte.
- `config.json` — offres, prix, **numéro Orange Money**.
- `.env` — secrets (à créer depuis `.env.example`).
- `public/app.css` — styles.
- `test_e2e.mjs` — test bout-en-bout.

> ⚠️ Le mode manuel **affiche votre numéro Orange Money** aux apprenants : c'est voulu (paiement marchand). Ne mettez **jamais** de code PIN/mot de passe Orange Money dans la config.
