# Guide de diffusion de la formation en ligne

Ce guide explique comment **diffuser** la formation aux apprenants à Madagascar, du plus simple au plus complet.

---

## 1. Le support principal : le site e-learning autonome
Fichier : **`site/index.html`** (260 Ko, autonome, hors-ligne).
- S'ouvre par **double-clic** dans n'importe quel navigateur (Chrome, Edge, Firefox).
- **20 modules + cas pratiques + évaluation + annexes** navigables.
- **19 quiz auto-corrigés** (100 questions), score affiché.
- **Suivi de progression** sauvegardé dans le navigateur (localStorage) : barre de progression, modules cochés, dernier score par quiz.
- **Recherche**, **impression / export PDF** (bouton « Imprimer »), responsive (mobile/tablette).

> Pour le mettre à jour après modification des cours : relancer `python site/build_site.py` (régénère `index.html` à partir des `.md`).

---

## 2. Options d'hébergement (du gratuit au pro)

| Solution | Coût | Mise en place | Pour qui |
|---|---|---|---|
| **Clé USB / fichier partagé** | 0 | Copier le dossier `site/` | Démarrage immédiat, zéro internet |
| **Google Drive (partagé)** | 0 | Déposer le dossier, partager le lien | Petite équipe |
| **GitHub Pages** | 0 | Pousser `site/` → activer Pages | Lien web public/privé |
| **Netlify / Cloudflare Pages** | 0 | Glisser-déposer le dossier `site/` | Lien web pro, rapide |
| **Google Sites / Notion** | 0 | Intégrer les contenus | Sans technique |
| **LMS (Moodle, etc.)** | variable | Voir §3 (SCORM) | Suivi des notes centralisé |

**Recommandation offshore :** commencer par **Netlify (glisser-déposer)** ou **Google Drive partagé** → un lien unique pour toute l'équipe. La progression reste locale à chaque navigateur (suffisant pour de l'auto-formation).

---

## 3. Intégrer dans un LMS (Moodle / 360Learning / TalentLMS)
Deux niveaux :
- **Simple** : héberger le site et créer dans le LMS une **activité « URL »** pointant vers `index.html`. Les quiz du site fonctionnent, mais les notes ne remontent pas au LMS.
- **Avec suivi des notes (SCORM)** : pour que le LMS enregistre les scores, il faut **emballer le site en paquet SCORM** :
  1. Ajouter un `imsmanifest.xml` (manifeste SCORM 1.2/2004).
  2. Mapper le score des quiz sur l'API SCORM (`cmi.core.score.raw`, `cmi.core.lesson_status`).
  3. Zipper le tout et l'importer comme « paquet SCORM ».
  > C'est un développement complémentaire ; me le demander si vous partez sur Moodle avec notation centralisée.

---

## 4. Volet vidéo (formation « en ligne » complète)
Les **scripts vidéo** sont fournis (`supports/02-Scripts-video.md`). Pour produire les vidéos :
1. Enregistrer l'écran (OBS Studio, gratuit) en montrant l'outil (Pennylane/ACD/Excel) + voix off depuis le script.
2. Format conseillé : **8–15 min par module**, 1080p, sous-titres.
3. Héberger sur **YouTube (non répertorié)**, **Vimeo** ou Google Drive, puis insérer les liens dans le site (section de chaque module).
4. Astuce bande passante Madagascar : proposer une **version allégée (720p)** et le **PDF du module** en téléchargement.

---

## 5. Volet évaluation & certification
- Auto-évaluation : **quiz du site** (seuil 70 % par module).
- Évaluation finale **surveillée** : `evaluations/Evaluation-finale.md` (sur 100, correction fournie).
- Délivrance de l'**attestation** : `annexes/Attestation-modele.md` selon le score.
- Suivi formateur : classeur **`annexes/excel/Outils-Formation.xlsx`** (onglet « Tableau de bord » pour les KPI, ou créer un onglet « Notes apprenants »).

---

## 6. Organisation type d'une session (cohorte)
1. **J0** : envoi du lien + identifiants outils + charte de confidentialité signée.
2. **Hebdo** : 1–2 modules/semaine (voir planning 8 semaines), + 1 visio de questions/réponses (Teams).
3. **Rendu** : cas pratiques de la semaine déposés dans le Drive partagé, corrigés par le formateur.
4. **S8** : évaluation finale surveillée + attestation.
5. **Post-formation** : suivi sur dossiers réels, KPI mensuels (Module 16).

---

## 7. Checklist de lancement
- [ ] Site testé (ouverture, quiz, impression)
- [ ] Hébergement choisi + lien diffusé
- [ ] Classeur Excel distribué
- [ ] Vidéos enregistrées (ou planifiées)
- [ ] Charte de confidentialité signée par chaque apprenant
- [ ] Planning communiqué
- [ ] Formateur identifié pour la correction des cas pratiques
- [ ] Modèle d'attestation prêt
