# Mise en ligne — academiecomptafr.mg (pas à pas)

Objectif : publier la plateforme sur **https://academiecomptafr.mg**.
Le projet est **déjà prêt** (dépôt Git créé, Dockerfile + render.yaml inclus, config domaine faite). Il reste 3 actions qui nécessitent **vos comptes** (je ne peux pas les faire à votre place) : enregistrer le domaine, créer l'hébergement, pointer le DNS.

---

## Étape 0 — Avant de publier (production)
À régler dans `platform/config.json` puis commiter :
- `securite.twofa_obligatoire` → **true** (réactive la 2FA + QR code).
- (option) `acces.duree_jours` → la durée d'accès voulue (365 = 12 mois).
Variables d'environnement à définir sur l'hébergeur :
- `PRODUCTION=true`, `BASE_URL=https://academiecomptafr.mg`
- `ADMIN_EMAIL` + `ADMIN_PASSWORD` (changez le mot de passe admin)
- `SESSION_SECRET` (chaîne aléatoire longue ; Render peut la générer)

---

## Étape 1 — Enregistrer le domaine (~18 €/an)
1. Aller chez un bureau .mg : **madagascar-internet.mg** ou **nic.mg/enregistrer**.
2. Chercher **academiecomptafr.mg** → confirmer « disponible » → commander.
3. Récupérer l'accès à la **zone DNS** du domaine.

## Étape 2 — Mettre le code sur GitHub
Le dépôt local est déjà prêt. Créez un dépôt **privé** sur github.com (ex. `academie-compta`), puis dans un terminal, à la racine du projet :
```
git remote add origin https://github.com/VOTRE-COMPTE/academie-compta.git
git branch -M main
git push -u origin main
```
(Authentification GitHub requise : token ou GitHub CLI.)

## Étape 3 — Déployer sur Render (gratuit pour tester)
1. Compte sur **render.com** → **New → Blueprint** (il lit `render.yaml`) **ou** **New → Web Service** (runtime **Docker**, il lit le `Dockerfile`).
2. Sélectionner votre dépôt GitHub.
3. Variables d'environnement :
   - `PRODUCTION=true`
   - `BASE_URL=https://academiecomptafr.mg`
   - `ADMIN_EMAIL=...`  `ADMIN_PASSWORD=...`
   - `SESSION_SECRET` = généré automatiquement (Blueprint) ou collez une longue chaîne aléatoire.
4. **Health check** : `/sante`. Déployer → vous obtenez une URL `…onrender.com` (testez‑la).
5. **Persistance des comptes** (important) : le plan gratuit efface les données à chaque redéploiement. Pour garder les comptes/paiements, ajoutez un **disque persistant** monté sur **`/app/platform`** (plan payant Render), ou utilisez un **VPS** (voir guide 06). Sinon, la base se réinitialise.

## Étape 4 — Brancher le domaine academiecomptafr.mg
1. Sur Render : **Settings → Custom Domains → Add** `academiecomptafr.mg` (et éventuellement `www.academiecomptafr.mg`).
2. Render affiche les **enregistrements DNS** à créer (un **A** pour le domaine racine + un **CNAME** pour `www`).
3. Dans la **zone DNS** du domaine (chez votre registrar .mg), créez ces enregistrements.
4. Attendez la propagation (quelques minutes à quelques heures). Render génère le **certificat HTTPS automatiquement**.
   → **https://academiecomptafr.mg** est en ligne. 🎉

## Étape 5 — Vérifications finales
- [ ] Le lien `https://academiecomptafr.mg` s'ouvre (cadenas HTTPS).
- [ ] `/sante` répond « ok ».
- [ ] Aperçu social OK (partagez le lien sur WhatsApp/Facebook → vignette).
- [ ] Connexion admin + 2FA (QR code) opérationnelle.
- [ ] Paiement test (Orange Money / MVola) → validation admin → accès.
- [ ] Mot de passe admin changé, `SESSION_SECRET` fort.
- [ ] Sauvegarde de `data.db` planifiée.

---

## Alternative : VPS (données persistantes, contrôle total)
Sur un petit VPS Linux (OVH/Contabo…) : installer Node ≥ 22, copier `site/` + `platform/`, `npm install` dans `platform/`, créer `platform/.env` (PRODUCTION=true, secrets), lancer avec **pm2**, mettre **Caddy** devant (HTTPS auto) :
```
academiecomptafr.mg {
    reverse_proxy localhost:3000
}
```
`data.db` reste sur le disque (pensez aux sauvegardes).

---

### Ce que je peux faire dès que c'est en place
Donnez‑moi : (1) le domaine enregistré, (2) l'hébergeur choisi, (3) l'URL `…onrender.com` ou l'IP du VPS → je vous donne les **enregistrements DNS exacts** et je vérifie chaque point de l'Étape 5 avec vous.
