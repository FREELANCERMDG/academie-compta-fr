# Mise à jour automatique des lois de finances françaises

La plateforme doit refléter la **loi de finances** en vigueur (taux de TVA, IS, seuils micro, SMIC, PASS, etc.).

## 1) Source de vérité unique
Tous les paramètres chiffrés « réglementaires » sont centralisés dans :

```
platform/fiscalite.json
```

Ce fichier porte `annee_reference`, `loi_de_finances`, `date_maj` et `source`. La plateforme affiche un **badge** « Paramètres fiscaux : référence {annee} » sur les pages publiques (accueil / programme / aperçu). Mettre à jour ce fichier suffit à mettre à jour le badge partout.

## 2) Mise à jour annuelle — procédure
Chaque année (décembre/janvier, à la publication de la loi de finances) :

1. Vérifier sur les sources officielles : **impots.gouv.fr**, **BOFIP**, **service-public.fr**, **economie.gouv.fr**.
2. Mettre à jour `platform/fiscalite.json` (taux, seuils, SMIC, PASS, `annee_reference`, `date_maj`).
3. Mettre à jour les **chiffres dans les leçons** concernées (Modules 05 TVA, 12 Fiscalité, 26 & 27) si un taux/seuil a changé.
4. Régénérer : `python site/build_site.py && python scorm/build_scorm.py`.
5. Redémarrer le serveur.

## 3) Automatisation
Deux niveaux possibles :

- **Semi‑automatique (recommandé, fiable) :** une **tâche planifiée annuelle** déclenche l'assistant IA qui (a) recherche les nouveautés de la loi de finances sur les sources officielles, (b) met à jour `fiscalite.json` et les leçons, (c) régénère le site. Un humain **valide** avant publication (le droit fiscal exige une relecture).
- **Veille manuelle :** suivre les communiqués DGFiP / la loi de finances et appliquer la procédure §2.

> ⚠️ **Honnêteté technique :** une mise à jour **100 % automatique et sans relecture** des règles fiscales n'est pas recommandée — un texte de loi peut être ambigu ou rétroactif. Le bon réglage est **automatique pour la collecte + humain pour la validation**.

## 4) Historique
| Année | Loi de finances | Date MAJ | Par |
|---|---|---|---|
| 2026 | LF 2026 | 2026‑06‑05 | MG Consulting IT & ACT |
