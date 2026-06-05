# Proposition : produire les vidéos avec l'IA

Objectif : créer rapidement des vidéos de cours **professionnelles** (français + explications en **malgache**) sans studio, en s'appuyant sur l'IA. Les **scripts existent déjà** (`supports/02-Scripts-video.md`).

---

## 🎯 Recommandation principale (le meilleur compromis)
**HeyGen** (présentateur IA) **+ ElevenLabs** (voix off) **+ OBS Studio** (captures logiciels) **+ CapCut** (montage & sous-titres).

| Besoin | Outil IA recommandé | Pourquoi |
|---|---|---|
| **Présentateur / avatar parlant** | **HeyGen** | Excellent en français, avatar réaliste créé **à partir de votre photo/vidéo**, bonne synchro labiale, traduction intégrée |
| **Voix off naturelle (FR)** | **ElevenLabs** | Voix françaises très naturelles ; possibilité de **cloner votre voix** pour une cohérence sur toute la formation |
| **Explication en malgache** | **Votre voix (enregistrée)** | Le malgache est peu couvert par les IA → plus authentique et fiable enregistré par vous (micro) ; ElevenLabs multilingue à tester |
| **Démos logiciels** (Pennylane, Quadra, Tiime…) | **OBS Studio** (capture écran) + voix IA | L'IA ne peut pas piloter les logiciels → on filme l'écran réel, voix off IA par-dessus |
| **Vidéos « texte → vidéo » animées** | **Pictory** ou **InVideo AI** ou **Canva (Magic Studio)** | Transforme un script en vidéo avec visuels + sous-titres |
| **Sous-titres & traduction** | **HeyGen** / **Submagic** / **CapCut** | Sous-titres FR + MG automatiques |
| **Montage final** | **CapCut** (gratuit) | Simple, sous-titres auto, export 1080p |

---

## 🧩 Deux types de vidéos, deux méthodes
1. **Cours théoriques** (Modules 1, 2, 5, 11, 12…) → **HeyGen avatar** lisant le script (FR), OU **diapositives** (déjà fournies en `.pptx`) + **voix off ElevenLabs**. Ajouter une explication **malgache** (votre voix) en complément.
2. **Démonstrations pratiques** (Modules 21–24, saisie, TVA, rapprochement) → **capture d'écran OBS** du logiciel + **voix off** (la vôtre en malgache, ou ElevenLabs en français).

---

## 🔁 Chaîne de production (pas à pas)
1. **Script** : partez de `supports/02-Scripts-video.md` (adaptez FR + MG).
2. **Voix** : générez la voix off dans **ElevenLabs** (ou enregistrez la vôtre en malgache).
3. **Image** :
   - théorie → **HeyGen** (avatar) ou diapositives `.pptx` ;
   - pratique → **OBS** (écran).
4. **Montage** : assemblez dans **CapCut**, ajoutez titres + **sous-titres bilingues**.
5. **Export** : 1080p (ou 720p pour le débit à Madagascar).
6. **Hébergement** : **YouTube (non répertorié)** ou **Vimeo**.
7. **Intégration** : collez le lien dans `site/videos.json` (cf. `supports/05-Integrer-vos-videos.md`) → la vidéo apparaît en haut du module.

---

## 💰 Budget mensuel indicatif
- HeyGen : ~24–29 $/mois · ElevenLabs : ~5–22 $/mois · Pictory/InVideo : ~19 $/mois · OBS & CapCut : **gratuits**.
- **Démarrage économique** : OBS (gratuit) + ElevenLabs (5 $) + votre voix malgache + CapCut (gratuit) ≈ **5–22 $/mois**.
- **Pack « présentateur IA »** : ajoutez HeyGen ≈ **30–50 $/mois** au total.

---

## ✅ Recommandation de démarrage (MVP)
1. **3 vidéos « présentateur » avec HeyGen** : présentation de la formation (marketing), Module 1, Module 2 (les modules gratuits → fort impact conversion).
2. **Le reste en OBS + voix off** (français ElevenLabs / malgache vous-même).
3. Sous-titres bilingues via CapCut.
4. Publier sur YouTube non répertorié → `videos.json`.

> ⚠️ Confidentialité : ne filmez que des **dossiers fictifs/anonymisés** (jamais de données client réelles), conformément au RGPD/secret professionnel.

---

## 🇲🇬 Note sur le malgache
Les IA vocales gèrent encore mal le malgache. Pour des explications **en malgache**, le plus fiable et le plus crédible reste **votre propre voix** (un bon micro suffit). Réservez l'IA (HeyGen/ElevenLabs) au **français** et à l'avatar/présentateur. Vous pouvez aussi tester la voix multilingue d'ElevenLabs sur quelques phrases pour juger.
