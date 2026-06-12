# 📱 Publier l'app sur le Google Play Store (TWA)

L'app du Play Store **enveloppe la PWA** déjà en ligne (https://academie-compta-fr.mg).
Le serveur est **déjà prêt** : manifest, icônes, route `/.well-known/assetlinks.json` (activée par 2 variables).
Il reste 3 choses **à faire par toi** : (A) construire l'app sur ton PC, (B) la publier sur Play Console, (C) coller l'empreinte de signature dans Render.

---

## Décisions (à garder identiques partout)
- **Nom de l'app (Play)** : `Académie Compta FR — Madagascar`
- **Nom court (icône)** : `Compta FR`
- **Package / Application ID** (⚠️ **définitif, jamais modifiable après publication**) : `mg.academiecomptafr.app`
- **Domaine** : `academie-compta-fr.mg`

---

## A) Construire l'app (sur ton PC Windows)

### Pré-requis
1. **Node.js** (LTS) installé (https://nodejs.org).
2. Installer Bubblewrap :
   ```
   npm install -g @bubblewrap/cli
   ```
   > Au 1er lancement, Bubblewrap propose d'installer automatiquement le **JDK** et l'**Android SDK** → accepte (réponds *Yes*).

### Générer le projet
```
mkdir compta-fr-android
cd compta-fr-android
bubblewrap init --manifest https://academie-compta-fr.mg/public/manifest.webmanifest
```
Réponses aux questions :
| Question | Réponse |
|---|---|
| Domain | `academie-compta-fr.mg` |
| Application ID / package | `mg.academiecomptafr.app` |
| App name | `Académie Compta FR — Madagascar` |
| Launcher name | `Compta FR` |
| Display mode | `standalone` |
| Status bar / theme color | `#0b0f24` |
| Background color | `#0b0f24` |
| Start URL | `/` |
| Icon URL | *(laisser celui détecté)* |
| Maskable icon | *(laisser détecté)* |
| Monochrome / notification icon | *(laisser / non)* |
| Include app shortcuts | `Yes` |
| Signing key — create new? | **Yes** |

> 🔑 **Clé de signature** : Bubblewrap crée un fichier `android.keystore`.
> Il demande **un mot de passe (keystore)** + **un alias** + **un mot de passe d'alias**.
> **NOTE-LES ET SAUVEGARDE LE FICHIER `android.keystore`** dans un endroit sûr (cloud privé).
> Si tu le perds, tu ne pourras **plus jamais** mettre à jour l'app.

### Compiler
```
bubblewrap build
```
→ Produit :
- **`app-release-bundle.aab`** ← le fichier à **téléverser sur Play**
- `app-release-signed.apk` ← pour tester sur ton téléphone (transfère-le et installe-le)

---

## B) Publier sur Google Play Console

1. Crée un compte développeur (**25 $ une seule fois**) : https://play.google.com/console
2. **Créer une application** → Nom `Académie Compta FR — Madagascar`, langue **Français**, **Gratuite**.
3. Remplis la fiche (obligatoire) :
   - **Description** courte + longue (je peux te les rédiger)
   - **Icône 512×512** : `https://academie-compta-fr.mg/public/icon-512.png`
   - **Image de présentation 1024×500** (feature graphic) : je peux te la générer
   - **Captures d'écran** (téléphone) : fais-les depuis l'app
   - **Politique de confidentialité (URL)** : `https://academie-compta-fr.mg/mentions-legales`
   - **Classification du contenu**, **Public cible**, **Sécurité des données** (déclare : pas de pub, données minimales)
4. **Production → Créer une release** → téléverse le **`.aab`** → renseigne les notes de version → **Examiner & publier**.
   > Astuce : commence par **Test interne** (validation en quelques minutes), puis passe en **Production**.

---

## C) Lier l'app au site (assetlinks) + activer le bouton

> ⚠️ Google **re-signe** ton app avec sa propre clé (**Play App Signing**).
> L'empreinte à utiliser est celle **de Google**, pas celle de ton keystore.

1. Dans **Play Console → (ton app) → Intégrité de l'app → Signature de l'application** :
   copie l'**empreinte du certificat SHA-256** (format `AB:CD:EF:...`).
2. Dans **Render → ton service → Environment**, ajoute :
   | Variable | Valeur |
   |---|---|
   | `TWA_PACKAGE` | `mg.academiecomptafr.app` |
   | `TWA_SHA256` | *(l'empreinte SHA-256 de Play Console)* |
   | `PLAY_URL` | `https://play.google.com/store/apps/details?id=mg.academiecomptafr.app` |
3. Vérifie que ça répond bien :
   `https://academie-compta-fr.mg/.well-known/assetlinks.json`
   → doit afficher le JSON avec ton package + l'empreinte.

**Résultat :**
- L'app s'ouvre **en plein écran vérifié** (sans barre d'adresse).
- Le bouton du site devient **« ▶ Télécharger sur Google Play »** et redirige vers ta fiche Play.

---

## Ce que je peux faire pour toi (dis-moi)
- Rédiger la **description Play** (courte + longue) + mots-clés
- Générer l'**image de présentation 1024×500**
- Finaliser **assetlinks** dès que tu m'envoies l'empreinte SHA-256
- T'aider en direct si une commande Bubblewrap bloque (copie-colle l'erreur)
