# Version Desktop Windows

La plateforme existe en **Web** (navigateur) et en **application bureau Windows**. (La version Android a été retirée — le web suffit et fonctionne déjà sur mobile.)

Il y a **2 façons** d'avoir l'app sur Windows :

---

## ① Mode « application » immédiat (recommandé, sans installation)
Ouvre la plateforme dans une **fenêtre dédiée** (sans barre d'adresse), comme un logiciel.

### a) En local (sur le PC du formateur, fonctionne hors-ligne)
1. Double-cliquez sur **`Lancer-MG-Compta.bat`**.
   → Il démarre le serveur (Node) et ouvre la fenêtre de l'application.
2. (Option) Double-cliquez sur **`Creer-raccourci-Bureau.ps1`** (clic droit → « Exécuter avec PowerShell ») pour créer une **icône sur le Bureau**.
- Prérequis : **Node.js ≥ 22** installé, et **Microsoft Edge** (présent par défaut sur Windows).

### b) Vers la version en ligne (après hébergement)
1. Ouvrez **`Lancer-en-ligne.bat`** dans un éditeur, remplacez `https://VOTRE-DOMAINE` par votre adresse.
2. Double-cliquez dessus → la plateforme hébergée s'ouvre en fenêtre dédiée.

---

## ② Vrai installateur `.exe` (Electron)
Pour distribuer un **programme d'installation Windows** (icône menu Démarrer + Bureau) pointant vers votre plateforme en ligne.

Dans `desktop/electron/` :
1. Mettez votre URL dans `main.js` (`APP_URL`) ou via la variable d'environnement `APP_URL`.
2. Installez et compilez :
   ```
   cd desktop/electron
   npm install
   npm run dist
   ```
3. L'installateur `.exe` est généré dans `desktop/electron/dist/`.
- Prérequis : Node.js + connexion internet (Electron ~150 Mo se télécharge à `npm install`).
- Résultat : application Windows « Académie Compta FR » qui ouvre la plateforme.

> Recommandation : commencez par le **mode ① (b)** vers l'URL en ligne (zéro build). Passez au **.exe Electron** si vous voulez un installateur à distribuer.

---

## Icône
`app.ico` (générée depuis le logo) est utilisée pour le raccourci Bureau et l'installateur Electron.

## Sécurité
La version desktop affiche exactement la même plateforme sécurisée (connexion, 2FA, paiement, RGPD). Aucune donnée supplémentaire n'est stockée par la fenêtre desktop.
