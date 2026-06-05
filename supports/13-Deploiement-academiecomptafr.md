# 🚀 Mise en ligne définitive sur academie-compta-fr.mg

Objectif : un **lien stable et permanent** (https://academie-compta-fr.mg) avec **HTTPS** et **données conservées**.

> 3 étapes : **1)** enregistrer le domaine `.mg` · **2)** déployer la plateforme · **3)** brancher le domaine + sécuriser.
> ⚠️ Je prépare et vérifie tout le code ; **vous** réalisez l'achat du domaine et la création du compte d'hébergement (paiement/identité requis).

---

## 1) Enregistrer le domaine .mg (NIC.MG)
- Le `.mg` est géré par **NIC.MG** via des **registrars accrédités**. Coût indicatif : **~18 €/an**.
- Étapes :
  1. Choisir un **registrar accrédité** (liste officielle sur le site de NIC.MG).
  2. Vérifier la disponibilité de **academie-compta-fr.mg** (lors de notre recherche : **disponible**).
  3. Créer un compte, **payer**, fournir les informations du titulaire (**MG Consulting IT & ACT**).
  4. Vous obtiendrez l'accès à la **gestion DNS** du domaine (nécessaire à l'étape 3).

---

## 2) Déployer la plateforme (Render.com — le plus simple)
Le projet contient déjà `Dockerfile` + `render.yaml` (tout est prêt).

**A. Mettre le code sur GitHub**
Le dossier est déjà un dépôt Git. Créez un dépôt **vide** sur GitHub, puis dans le projet :
```
git add -A
git commit -m "Mise en ligne academie-compta-fr.mg"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/academie-compta-fr.git
git push -u origin main
```

**B. Créer le service sur Render**
1. Render → **New +** → **Blueprint** → connectez le dépôt GitHub → Render lit **`render.yaml`**.
2. Plan **Starter** (inclut le **disque persistant** → vos comptes/paiements sont **conservés**).
3. Renseignez les variables (marquées « à saisir ») :
   - `ADMIN_EMAIL` = votre email admin
   - `ADMIN_PASSWORD` = **mot de passe fort**
   - `BASE_URL` = au début l'URL fournie (ex. `https://academie-compta-fr.onrender.com`)
4. **Deploy**. Vérifiez que **`/sante`** répond `ok`.

*(Déjà configuré pour vous : `PRODUCTION=true`, `SESSION_SECRET` auto, `DATA_DIR=/data` + disque persistant.)*

---

## 3) Brancher le domaine + HTTPS
1. Render → votre service → **Settings → Custom Domains → Add** : ajoutez **academie-compta-fr.mg** (et **www.academie-compta-fr.mg**).
2. Render affiche la **cible DNS** à configurer.
3. Chez le **registrar (gestion DNS)**, créez :
   - `www` → **CNAME** → `votre-service.onrender.com`
   - apex `@` (academie-compta-fr.mg) → **ALIAS/ANAME** (ou **A** vers l'IP indiquée par Render)
4. **Propagation DNS** : de quelques minutes à 24‑48 h.
5. Render génère le **certificat HTTPS** automatiquement (Let's Encrypt).
6. Repassez `BASE_URL = https://academie-compta-fr.mg` → redeploy.

---

## 4) Sécurité & finitions (production)
- [ ] **Mot de passe admin fort** (variable `ADMIN_PASSWORD`).
- [ ] Réactiver la **2FA obligatoire** : dans `platform/config.json` → `securite.twofa_obligatoire = true`.
- [ ] Vérifier les **moyens de paiement** (numéros Orange Money / MVola) et les **offres/prix**.
- [ ] Compléter l'**hébergeur** dans `/mentions-legales` (ex. Render Inc.).
- [ ] **Ne jamais** committer de fichier `.env` (le secret est géré par Render).
- [ ] **Données persistantes** : `DATA_DIR=/data` + disque (déjà fait).

## 5) Sauvegardes
- Render conserve le disque entre les déploiements. Prévoyez une **copie régulière de `data.db`** (export manuel / snapshot selon le plan).

---

## 📋 Récap — variables d'environnement Render
| Variable | Valeur |
|---|---|
| `PRODUCTION` | `true` |
| `SESSION_SECRET` | (généré par Render) |
| `DATA_DIR` | `/data` |
| `ADMIN_EMAIL` | votre email |
| `ADMIN_PASSWORD` | mot de passe fort |
| `BASE_URL` | `https://academie-compta-fr.mg` |

## Alternatives d'hébergement (si besoin)
- **Railway**, **Fly.io** (Docker, simples).
- **VPS** (OVH, Contabo…) : Docker + **Caddy** (HTTPS automatique) — plus de contrôle, un peu plus technique.

> Une fois en ligne, le lien **temporaire Cloudflare** ne sera plus nécessaire : tout passe par **https://academie-compta-fr.mg**.
