# MODULE 14 — Outils utilisés par les cabinets français

**Niveau :** Transversal · **Durée estimée :** 10–14 h (pratique sur outils) · **Prérequis :** Modules 3–7

---

## 🎯 Objectifs pédagogiques
- Connaître le rôle de chaque outil et ce qu'un collaborateur offshore doit savoir y faire.
- Éviter les erreurs fréquentes propres à chaque logiciel.
- Appliquer les bonnes pratiques.

> Pour chaque outil : **rôle · à maîtriser · erreurs fréquentes · bonnes pratiques · cas pratique**.

---

## 1. Pennylane
- **Rôle :** plateforme tout-en-un (connexion bancaire, collecte de factures, saisie/lettrage, TVA, reporting client). Très répandu en cabinet moderne.
- **À maîtriser :** rapprochement des transactions bancaires aux factures, catégorisation, lettrage, gestion des justificatifs, préparation TVA, recherche de pièces.
- **Erreurs fréquentes :** valider une transaction sans pièce, mauvais compte de catégorisation, doublon (import + saisie), oublier la TVA sur encaissements.
- **Bonnes pratiques :** traiter par « to-do » bancaire, joindre systématiquement la pièce, utiliser les règles d'automatisation avec prudence.
- **Cas pratique :** rapprocher 20 transactions d'un relevé à leurs factures + signaler les pièces manquantes.

## 2. Tiime
- **Rôle :** outil orienté TPE/indépendants (facturation, banque, pré-compta, note de frais).
- **À maîtriser :** validation des écritures pré-catégorisées, association justificatifs, export vers l'outil de production du cabinet.
- **Erreurs fréquentes :** se fier à la catégorisation automatique sans contrôle.
- **Bonnes pratiques :** contrôler chaque imputation proposée ; vérifier la TVA.
- **Cas pratique :** corriger 10 écritures mal catégorisées automatiquement.

## 3. ACD (AGIRIS / iSuite Expert)
- **Rôle :** logiciel de production cabinet (compta, révision, liasse, paie). Très utilisé en France.
- **À maîtriser :** saisie par journaux, lettrage, éditions (grand livre, balance), modules de révision et liasse.
- **Erreurs fréquentes :** mauvais journal/période, oubli de validation des brouillards.
- **Bonnes pratiques :** travailler par cycle, utiliser les feuilles de révision intégrées.
- **Cas pratique :** saisir un journal d'achats + éditer la balance.

## 4. Sage (Sage Compta / Sage Génération Experts)
- **Rôle :** suite comptable historique (compta, gestion commerciale, paie).
- **À maîtriser :** plan comptable, saisie, lettrage, états, import d'écritures.
- **Erreurs fréquentes :** confusion entre sociétés/dossiers, exercices mal paramétrés.
- **Bonnes pratiques :** vérifier le dossier et l'exercice ouverts avant toute saisie.
- **Cas pratique :** saisir 5 factures + lettrer un compte fournisseur.

## 5. Cegid (Cegid Loop / Cegid Expert)
- **Rôle :** plateforme cabinet (cloud), saisie, révision, collaboration client.
- **À maîtriser :** saisie guidée, rapprochement bancaire, révision, GED intégrée.
- **Erreurs fréquentes :** doublons d'import bancaire, mauvaise affectation analytique.
- **Bonnes pratiques :** suivre le workflow de validation, contrôler les imports.
- **Cas pratique :** rapprochement bancaire d'un mois.

## 6. Coala
- **Rôle :** logiciel de production cabinet (compta, immobilisations, états financiers).
- **À maîtriser :** saisie, révision, module immobilisations.
- **Erreurs fréquentes :** fichier immo non rapproché de la compta.
- **Bonnes pratiques :** contrôler 21/28 vs tableau immo.

## 7. Quadra (Cegid Quadra / QuadraCompta)
- **Rôle :** production comptable cabinet, très répandu.
- **À maîtriser :** saisie rapide par guides d'écriture, lettrage, éditions, OD.
- **Erreurs fréquentes :** guides d'écriture mal choisis (mauvaise TVA pré-paramétrée).
- **Bonnes pratiques :** vérifier le résultat des guides automatiques.
- **Cas pratique :** créer un guide d'écriture d'achat avec TVA 20 %.

## 8. Dext (ex-Receipt Bank)
- **Rôle :** collecte et **océrisation** des factures/tickets, export vers l'outil compta.
- **À maîtriser :** vérifier les données OCR (montant, TVA, date, fournisseur), publier vers la compta, détecter doublons.
- **Erreurs fréquentes :** publier une donnée OCR fausse sans contrôle, doublons.
- **Bonnes pratiques :** **toujours** contrôler l'OCR avant publication.
- **Cas pratique :** traiter 15 pièces Dext et corriger les OCR erronés.

## 9. MEG (My Expert Group)
- **Rôle :** collecte de pièces + GED + pré-saisie collaborative client/cabinet.
- **À maîtriser :** classement des pièces, suivi des demandes, échanges client.
- **Erreurs fréquentes :** pièces non classées, demandes non suivies.
- **Bonnes pratiques :** tenir le suivi des pièces manquantes à jour.

## 10. Silae
- **Rôle :** logiciel de **paie** leader en cabinet (bulletins, DSN).
- **À maîtriser (côté comptable) :** **lire le journal de paie**, récupérer l'OD de paie, rapprocher avec la compta et la DSN.
- **Erreurs fréquentes :** comptabiliser des montants ne correspondant pas au journal de paie.
- **Bonnes pratiques :** rapprocher OD = bulletins = DSN = paiements (Module 9).
- **Cas pratique :** comptabiliser une OD à partir d'un journal de paie Silae.

## 11. RCA
- **Rôle :** suite cabinet (révision, production de la liasse, prévisionnel, paie selon modules).
- **À maîtriser :** **module révision** (justification des comptes), génération de la **liasse fiscale**.
- **Erreurs fréquentes :** valider une révision sans justifier les soldes.
- **Bonnes pratiques :** rattacher une justification à chaque compte révisé.

## 12. Excel / Google Sheets
- **Rôle :** outil universel de contrôle (rapprochements, balance âgée, tableaux de suivi, immo).
- **À maîtriser :** formules `SOMME`, `RECHERCHEV`/`RECHERCHEX`, `SI`, **tableaux croisés dynamiques**, filtres, mise en forme conditionnelle.
- **Erreurs fréquentes :** formules cassées, totaux faux, écrasement de données.
- **Bonnes pratiques :** figer les en-têtes, contrôler les totaux, ne jamais écraser une source.
- **Cas pratique :** construire un état de rapprochement et une balance âgée.

## 13. Google Drive
- **Rôle :** stockage/partage de pièces (GED simple).
- **À maîtriser :** arborescence, droits d'accès, nommage.
- **Bonnes pratiques :** respecter la structure de dossiers + confidentialité (Module 1).

## 14. Teams / Slack
- **Rôle :** communication avec le cabinet (messages, appels, partage).
- **Bonnes pratiques :** canaux dédiés par client, messages clairs, **pas de pièces confidentielles** dans des canaux non sécurisés.

## 15. Trello / Notion
- **Rôle :** suivi des tâches et des dossiers (kanban, bases de données).
- **Bonnes pratiques :** colonnes `À faire / En cours / À valider / Terminé`, une carte par dossier/échéance.

---

## 🧭 Plan d'apprentissage des outils (offshore)
1. **Dext / MEG** (collecte + OCR) → 2. **Pennylane / Tiime** (saisie web) → 3. **un outil cabinet** (ACD ou Sage ou Cegid/Quadra) → 4. **Excel** (contrôle) → 5. **Silae** (lecture paie) → 6. **RCA** (révision/liasse).

## ✅ Checklist « prise en main d'un nouvel outil »
- [ ] Je sais ouvrir le bon dossier/exercice
- [ ] Je sais saisir dans le bon journal
- [ ] Je sais joindre une pièce à une écriture
- [ ] Je sais lettrer
- [ ] Je sais faire un rapprochement bancaire
- [ ] Je sais éditer grand livre / balance
- [ ] Je sais détecter les doublons
- [ ] Je connais les exports vers la production cabinet

---

## 📝 Évaluation de fin de module 14
1. Quel outil sert à l'OCR des factures ?
2. Quel logiciel de paie est leader en cabinet ?
3. Que doit-on toujours faire avant de publier une pièce Dext ?
4. Quel est le bon ordre d'apprentissage des outils ?
5. Citez 3 fonctions Excel utiles au comptable.

**Seuil : 7/10.**
**Corrigé :** 1) Dext (ou MEG/Pennylane). 2) Silae. 3) contrôler l'OCR (montant, TVA, date, fournisseur). 4) collecte → saisie web → outil cabinet → Excel → paie → révision. 5) RECHERCHEX, SI, tableaux croisés dynamiques (SOMME, filtres…).
