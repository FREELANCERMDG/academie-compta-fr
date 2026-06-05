# Paquet SCORM 1.2 — mode d'emploi

Fichier à importer : **`Formation-SCORM-1.2.zip`**

## Contenu
- `imsmanifest.xml` (à la racine du zip — obligatoire SCORM)
- `index.html` (le site e-learning complet + adaptateur SCORM)

## Ce que le LMS enregistre
- **Score** (`cmi.core.score.raw`) = pourcentage de progression (0–100).
- **Statut** (`cmi.core.lesson_status`) :
  - `incomplete` tant que tous les modules ne sont pas terminés ;
  - `completed` quand 100 % des pages sont cochées ;
  - `passed` si, en plus, la moyenne des quiz ≥ 70 %.
- Remontée automatique toutes les 5 s et à la fermeture.

## Import dans Moodle
1. Activer/créer un cours → **Ajouter une activité → Paquetage SCORM**.
2. Déposer `Formation-SCORM-1.2.zip` → Enregistrer.
3. Les apprenants lancent l'activité ; notes et progression apparaissent dans le carnet de notes.

> Autres LMS (360Learning, TalentLMS, iSpring, Rise…) : importer le zip comme « contenu SCORM 1.2 ».

## Notes
- Ouvert **hors LMS** (double-clic / file://), l'adaptateur ne fait rien : le site fonctionne quand même (progression locale).
- Si votre LMS est **strict sur les schémas**, ajoutez les XSD ADL SCORM 1.2 (`imscp_rootv1p1p2.xsd`, `adlcp_rootv1p2.xsd`, `imsmd_rootv1p2p1.xsd`, `ims_xml.xsd`) à la racine du zip. La plupart des LMS (dont Moodle) les acceptent sans.
- Pour régénérer après modification des cours : `python site/build_site.py` puis `python scorm/build_scorm.py`.
