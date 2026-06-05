# Mettre la plateforme en ligne & partager le lien (réseaux sociaux)

Objectif : obtenir **un lien public** (ex. `https://academie-compta.mg`) que vous partagez sur Facebook/WhatsApp/TikTok/LinkedIn ; en cliquant, l'utilisateur arrive **directement sur l'application** (inscription → paiement → formation), avec un **bel aperçu** (image + titre).

---

## 1. Comprendre
- L'application est un **serveur web** (Node). En local, elle n'est joignable que sur votre PC (`localhost`).
- Pour un **lien partageable**, il faut l'**héberger** sur un serveur public avec un **nom de domaine + HTTPS**. Ensuite, le lien fonctionne sur **tous les téléphones/PC**, sans rien installer.
- Bonus : c'est une **PWA** — sur mobile, « Ajouter à l'écran d'accueil » l'installe comme une **application**.

---

## 2. Héberger (3 options)

### Option A — Render.com (simple, gratuit pour démarrer) ✅ recommandé pour tester
1. Mettez le dossier `FORMATION-COMPLETE-2026` sur **GitHub** (dépôt privé).
2. Sur https://render.com → **New → Web Service → Build from a repository** → sélectionnez le dépôt.
3. Render détecte `render.yaml` + `Dockerfile`. Renseignez les variables :
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` (votre compte admin),
   - `BASE_URL` = l'URL fournie par Render (ex. `https://academie-compta-fr.onrender.com`),
   - `SESSION_SECRET` est généré automatiquement, `PRODUCTION=true` déjà réglé.
4. Déployez. Vous obtenez une **URL publique HTTPS** : c'est votre lien à partager.
> ⚠️ Plan gratuit : le stockage n'est pas persistant (la base `data.db` peut être réinitialisée à chaque redéploiement). Pour conserver les comptes, activez un **disque persistant** (décommenté dans `render.yaml`, plan payant) ou utilisez l'option C.

### Option B — Railway / Fly.io
Même principe (Docker). Railway : « Deploy from GitHub » ; Fly : `fly launch` (lit le Dockerfile). Définir les mêmes variables d'environnement.

### Option C — VPS (contrôle total, données persistantes) — recommandé en production
Sur un petit VPS (OVH, Contabo, DigitalOcean…) sous Linux :
1. Installer Node ≥ 22.
2. Copier `site/` et `platform/`, créer `platform/.env` (secrets), `PRODUCTION=true`.
3. Lancer via un service (systemd/pm2) : `node platform/server.mjs`.
4. Mettre **Caddy** devant (HTTPS automatique Let's Encrypt) :
   ```
   academie-compta.mg {
       reverse_proxy localhost:3000
   }
   ```
   Caddy gère le certificat TLS tout seul. `data.db` reste sur le disque (pensez aux **sauvegardes**).

---

## 3. Nom de domaine
- Achetez un domaine (ex. `.mg`, `.com`) chez un registrar.
- Pointez-le vers l'hébergeur (Render : « Custom Domain » ; VPS : enregistrement A vers l'IP).
- Mettez `BASE_URL=https://votre-domaine` puis redéployez (important pour l'aperçu social et les retours Orange Money).

---

## 4. Partage sur les réseaux (déjà intégré)
La plateforme inclut les **balises Open Graph / Twitter Card** : en partageant le lien, l'aperçu affiche automatiquement :
- **Image** : `public/og-image.png` (1200×630, déjà générée),
- **Titre** + **description** (modifiables dans `server.mjs`, fonction `layout`).

Pour vérifier l'aperçu :
- Facebook : https://developers.facebook.com/tools/debug/
- LinkedIn : https://www.linkedin.com/post-inspector/
- Aperçu générique : https://www.opengraph.xyz/
> WhatsApp/Facebook **mettent en cache** l'aperçu : après modification de l'image, utilisez le « debugger » pour forcer le rafraîchissement.

**Pour personnaliser l'image d'aperçu** : modifiez `/c/Temp/og.html` (ou recréez `platform/public/og-image.png` en 1200×630 avec votre logo/charte).

---

## 5. Orange Money en ligne
- Mode **manuel** : fonctionne tel quel (le numéro +261 32 73 622 59 s'affiche, vous validez dans l'admin).
- Mode **API** : une fois en ligne avec un domaine, renseignez dans les variables :
  `OM_RETURN_URL=https://votre-domaine/paiement/retour`, `OM_CANCEL_URL=https://votre-domaine/tableau-de-bord`, `OM_NOTIF_URL=https://votre-domaine/paiement/retour`, + clés marchand.

---

## 6. Checklist de mise en ligne
- [ ] Dépôt GitHub créé
- [ ] Service déployé (Render/Railway/VPS)
- [ ] `BASE_URL` = domaine public HTTPS
- [ ] `PRODUCTION=true`, `SESSION_SECRET` fort, mot de passe admin changé
- [ ] `/sante` répond « ok » (santé)
- [ ] Aperçu social vérifié (debugger Facebook)
- [ ] (Prod) stockage persistant de `data.db` + sauvegardes
- [ ] Lien testé sur mobile (inscription → paiement → formation)
- [ ] Lien partagé sur vos réseaux 🎉
