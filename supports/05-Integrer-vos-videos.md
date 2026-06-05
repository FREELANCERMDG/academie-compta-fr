# Intégrer vos vidéos (explications en malgache) dans la formation

Vous pouvez ajouter **une vidéo en haut de chaque module** (et de l'accueil, des cas, de l'évaluation). Idéal pour vos explications **en malgache**. Tout passe par un seul fichier : **`site/videos.json`**.

---

## 1. Principe
Le fichier `site/videos.json` associe chaque page (ex. `m05`) à une vidéo. Au build, un **lecteur responsive** s'affiche en haut du module. Trois sources possibles :

| `type` | `src` à mettre | Quand l'utiliser |
|---|---|---|
| `youtube` | l'URL ou l'ID YouTube | Le plus simple, léger (recommandé). Mettre la vidéo en **« Non répertoriée »** |
| `vimeo` | l'URL ou l'ID Vimeo | Alternative pro |
| `mp4` | chemin local `videos/xxx.mp4` | **Hors-ligne total** (vidéo dans le dossier `site/videos/`) |

---

## 2. Méthode A — YouTube (recommandée, légère pour Madagascar)
1. Mettez votre vidéo en ligne sur YouTube en **« Non répertoriée »** (visible seulement avec le lien).
2. Copiez le lien (ex. `https://youtu.be/AbCdEf12345`).
3. Dans `site/videos.json`, renseignez le module :
```json
"m05": { "type": "youtube", "src": "https://youtu.be/AbCdEf12345", "title": "Module 5 TVA — fanazavana amin'ny teny malagasy" }
```
4. Régénérez : `python site/build_site.py` → la vidéo apparaît en haut du Module 5.

## 3. Méthode B — Fichier MP4 local (100 % hors-ligne)
1. Créez le dossier `site/videos/`.
2. Déposez-y vos fichiers, ex. `module-05.mp4`.
3. Dans `videos.json` :
```json
"m05": { "type": "mp4", "src": "videos/module-05.mp4", "title": "Module 5 — malgache" }
```
4. `python site/build_site.py`. La vidéo se lit même par double-clic (file://).
> ⚠️ Pour le **SCORM**, les MP4 locaux doivent être inclus dans le zip (volumineux). Pour un LMS, préférez **YouTube/Vimeo** (méthode A) afin de garder le paquet léger.

## 4. Identifiants des pages (clés du fichier)
`accueil` · `m01`…`m17` · `m20` · `m21` (Pennylane) · `m22` (Tiime) · `m23` (Quadra) · `m24` (Isacompta) · `cas` · `eval`.
> Laisser `src` vide = aucune vidéo affichée pour ce module.

## 5. Conseils de tournage (vidéos en malgache)
- **Durée** : 8–15 min/module. Structure : accroche → objectif → démonstration écran → points clés (cf. `supports/02-Scripts-video.md`, à traduire/adapter en malgache).
- **Enregistrement d'écran** : OBS Studio (gratuit) pour montrer Pennylane/Quadra/Excel + voix off.
- **Qualité** : 720p suffit (bande passante) ; ajoutez des **sous-titres** si possible.
- **Confidentialité** : ne filmez que des **dossiers fictifs/anonymisés** (jamais de données client réelles).
- **Hébergement** : YouTube non répertorié = simple et léger ; MP4 local = hors-ligne.

## 6. Récapitulatif (3 étapes)
1. Enregistrer la vidéo (malgache).
2. Mettre le lien/fichier dans `site/videos.json`.
3. `python site/build_site.py` (puis `python scorm/build_scorm.py` si LMS).
