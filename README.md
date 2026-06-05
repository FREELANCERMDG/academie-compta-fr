# Formation complète en comptabilité française externalisée depuis Madagascar

> Programme professionnel, progressif et opérationnel — destiné aux collaborateurs comptables basés à Madagascar travaillant pour des cabinets d'expertise comptable français.
> **Version 2026** — chiffres fiscaux et sociaux à jour des sources officielles (impots.gouv.fr, urssaf.fr, entreprendre.service-public.fr, anc.gouv.fr, bofip.impots.gouv.fr).

---

## 🚀 Accès à la formation en ligne
**Ouvrez le fichier [`site/index.html`](site/index.html) par double-clic** : c'est la plateforme e-learning complète (autonome, hors-ligne), avec navigation en **4 modules (24 leçons)**, **quiz auto-corrigés (100+ questions)**, suivi de progression et recherche. Pour la diffuser (web, LMS, vidéos), voir [`supports/00-Guide-diffusion-en-ligne.md`](supports/00-Guide-diffusion-en-ligne.md).

## 📑 Sommaire des livrables

| Dossier / fichier | Contenu |
|---|---|
| **`site/index.html`** | 🖥️ **Plateforme e-learning interactive** (quiz, progression, hors-ligne) |
| `site/build_site.py` · `quizzes.json` | Générateur du site + banque de quiz (éditables) |
| `README.md` | Présentation, objectifs, programme, planning, certification (CE FICHIER) |
| `modules/` | Les **24 leçons détaillées** regroupées en **4 modules** (théorie + procédures + cas + exercices + checklists) |
| `cas-pratiques/` | Les 10+ cas pratiques complets corrigés |
| `evaluations/` | Évaluation finale certifiante (/100, corrigée) |
| `annexes/` | Checklists, modèles de mails, tableaux de suivi |
| **`annexes/excel/Outils-Formation.xlsx`** | 📊 **10 tableaux Excel réels** (formules, listes déroulantes) |
| `supports/` | Guide de diffusion, guide formateur + syllabus, scripts vidéo, cahier de l'apprenant |
| **`print/Formation-complete.html`** | 📄 **Livret unique imprimable** (toute la formation → « Enregistrer en PDF ») |
| **`scorm/Formation-SCORM-1.2.zip`** | 🎓 **Paquet SCORM 1.2** importable dans un LMS (Moodle…) avec remontée des notes |
| **`slides/Module-XX.pptx`** | 🖼️ **18 diaporamas PowerPoint éditables** (337 slides, charte graphique) pour les visios |
| **`branding.json`** | 🎨 **Charte centralisée** (nom du cabinet, couleurs, logo) — re-thématise tout le pack ; voir `supports/04-Personnalisation-charte.md` |
| **`site/videos.json`** | 🎬 **Vos vidéos par module** (explications en malgache, YouTube/Vimeo/MP4) ; voir `supports/05-Integrer-vos-videos.md` |
| **`platform/`** | 🔐 **Plateforme en ligne** : inscription + condition BAC+2, profil, **2FA**, choix d'offre, **paiement Orange Money / carte**, accès protégé, espace admin (Node natif, sécurisé OWASP) ; voir `platform/README-PLATEFORME.md` |
| **`Dockerfile` · `render.yaml` · `Procfile`** | 🚀 **Mise en ligne** (lien public partageable) + aperçu social Open Graph ; voir `supports/06-Mettre-en-ligne-et-partager.md` |

---

## 1. Présentation générale de la formation

Cette formation transforme un comptable malgache ayant des bases en un **collaborateur comptable offshore autonome**, capable de produire pour un cabinet français un travail conforme aux normes, aux outils et aux échéances attendus.

Elle est **100 % orientée production** : chaque module contient non seulement la théorie, mais surtout les **procédures cabinet étape par étape**, des **checklists prêtes à l'emploi**, des **cas pratiques corrigés**, des **modèles de mails**, et la distinction systématique entre **ce que le collaborateur peut faire seul** et **ce qui doit être validé par le chef de mission ou l'expert-comptable**.

- **Durée** : 8 semaines (rythme intensif possible en 4 semaines, voir planning).
- **Volume** : ~120 à 150 h de travail apprenant (cours + pratique + évaluations).
- **Format** : auto-formation guidée + cas pratiques sur outils réels + évaluations corrigées.
- **Résultat** : attestation interne de niveau (Débutant validé / Intermédiaire / Avancé-Autonome).

### Philosophie : la « posture offshore »
Un collaborateur à Madagascar ne « tape pas des écritures ». Il est le **premier maillon qualité** d'un cabinet français qu'il ne voit jamais. Ses 4 mots d'ordre :
1. **Rigueur** — zéro à-peu-près, tout est justifié par une pièce.
2. **Fiabilité** — ce qui est livré « terminé » est réellement terminé et contrôlé.
3. **Anticipation** — les pièces manquantes et anomalies sont signalées avant l'échéance, pas après.
4. **Traçabilité** — tout est documenté : qui a fait quoi, quand, et pourquoi (commentaires, comptes d'attente justifiés).

---

## 2. Public cible

- Comptables malgaches débutants ayant des **bases comptables** (notion de débit/crédit).
- Comptables expérimentés à Madagascar souhaitant **basculer vers les normes françaises**.
- Assistants comptables **freelance** visant les cabinets français.
- Équipes **offshore** spécialisées : saisie, révision, TVA, lettrage, rapprochement bancaire, préparation bilan.
- Collaborateurs utilisant **Pennylane, Tiime, ACD, Sage, Cegid, Coala, Quadra, Dext, MEG, Silae, RCA, Excel**.

---

## 3. Prérequis

- Comprendre le mécanisme **débit / crédit** (la partie double).
- Savoir lire une **facture** (HT, TVA, TTC).
- Maîtrise correcte du **français écrit** (communication avec le cabinet).
- Bureautique de base : **Excel/Google Sheets**, navigation web, gestion de fichiers, PDF.
- Connexion internet stable + poste de travail confidentiel (cf. Module 1 — RGPD).

> Pas de prérequis en fiscalité française : tout est repris depuis la base.

---

## 4. Objectifs pédagogiques

À la fin de la formation, l'apprenant est capable de :

1. Situer son rôle dans la **chaîne de production** d'un cabinet français.
2. Maîtriser le **Plan Comptable Général (PCG)** et les comptes les plus utilisés.
3. **Saisir** achats, ventes, banque, caisse et OD avec la bonne TVA.
4. Préparer une **déclaration de TVA** (CA3 / CA12) pour validation.
5. Réaliser un **rapprochement bancaire** complet et justifier le solde 512.
6. **Lettrer** les comptes clients (411) et fournisseurs (401) et sortir une balance âgée.
7. Analyser et **apurer les comptes d'attente** (471) et comptes sensibles.
8. Comptabiliser une **OD de paie** et justifier les charges sociales.
9. Gérer les **immobilisations** et tableaux d'amortissement.
10. Mener une **révision par cycle** et préparer un dossier pour le chef de mission.
11. Comprendre la **fiscalité** des entreprises (IR/IS, BIC/BNC, liasse) et préparer les éléments **sans se substituer à l'expert-comptable**.
12. Participer aux **travaux de clôture / bilan** (cut-off, FNP, CCA, FAE, PCA).
13. Travailler efficacement sur les **outils** du cabinet.
14. **Communiquer** de façon professionnelle (mails, relances, remontée d'anomalies).
15. Organiser une **production offshore** fiable (reporting, priorisation, contrôle qualité).

---

## 5. Compétences obtenues (référentiel)

| Domaine | Compétence opérationnelle |
|---|---|
| Saisie | Saisir 100 % des pièces courantes, TVA correcte, sans doublon |
| TVA | Préparer une CA3/CA12 contrôlée, prête à valider |
| Trésorerie | Rapprochement bancaire justifié, solde 512 prouvé |
| Tiers | Lettrage complet, balance âgée, comptes 401/411 justifiés |
| Attente | 471/455/467 analysés et apurés, anomalies documentées |
| Social | OD de paie comptabilisée et rapprochée (bulletins/DSN/paiements) |
| Immobilisations | Fichier immo tenu, amortissements contrôlés |
| Révision | Cycles révisés, soldes justifiés, feuilles de travail produites |
| Fiscalité | Éléments de liasse préparés pour l'expert-comptable |
| Bilan | Dossier de clôture préparé (cut-off, FNP/CCA/FAE/PCA) |
| Outils | Autonomie sur Pennylane/Tiime/Dext + 1 outil « cabinet » (ACD/Sage/Cegid…) |
| Soft skills | Mails pro, reporting, anticipation, confidentialité |

---

## 6. Programme détaillé — 4 modules (24 leçons)

> La formation est **présentée en 4 modules** ; le tableau ci-dessous détaille les **24 leçons** qui les composent (Module 1 = leçons 1–3 · Module 2 = saisie + logiciels · Module 3 = TVA→révision · Module 4 = fiscalité, bilan, cas, évaluation).

| # | Module | Niveau | Lien |
|---|---|---|---|
| 1 | Comprendre l'environnement comptable français | Débutant | [modules/Module-01...](modules/Module-01-Environnement-comptable-francais.md) |
| 2 | Bases de comptabilité française (PCG) | Débutant | [Module-02](modules/Module-02-Bases-comptabilite-PCG.md) |
| 3 | Organisation d'un dossier externalisé | Débutant | [Module-03](modules/Module-03-Organisation-dossier-externalise.md) |
| 4 | Saisie comptable pratique | Débutant→Inter. | [Module-04](modules/Module-04-Saisie-comptable-pratique.md) |
| 5 | TVA française | Intermédiaire | [Module-05](modules/Module-05-TVA-francaise.md) |
| 6 | Rapprochement bancaire | Intermédiaire | [Module-06](modules/Module-06-Rapprochement-bancaire.md) |
| 7 | Lettrage clients / fournisseurs | Intermédiaire | [Module-07](modules/Module-07-Lettrage-clients-fournisseurs.md) |
| 8 | Comptes d'attente et comptes sensibles | Intermédiaire | [Module-08](modules/Module-08-Comptes-attente-sensibles.md) |
| 9 | Paie et écritures sociales | Intermédiaire | [Module-09](modules/Module-09-Paie-ecritures-sociales.md) |
| 10 | Immobilisations et amortissements | Intermédiaire | [Module-10](modules/Module-10-Immobilisations-amortissements.md) |
| 11 | Révision comptable continue | Avancé | [Module-11](modules/Module-11-Revision-comptable.md) |
| 12 | Fiscalité des entreprises | Avancé | [Module-12](modules/Module-12-Fiscalite-entreprises.md) |
| 13 | Bilan et clôture | Avancé | [Module-13](modules/Module-13-Bilan-cloture.md) |
| 14 | Outils des cabinets français | Transversal | [Module-14](modules/Module-14-Outils-cabinets.md) |
| 15 | Communication professionnelle | Transversal | [Module-15](modules/Module-15-Communication-professionnelle.md) |
| 16 | Méthode de production offshore | Transversal | [Module-16](modules/Module-16-Production-offshore.md) |
| 17 | Qualité, erreurs fréquentes, contrôle interne | Transversal | [Module-17](modules/Module-17-Qualite-controle-interne.md) |
| 18 | Cas pratiques complets | Tous | [cas-pratiques/](cas-pratiques/Cas-pratiques-corriges.md) |
| 19 | Évaluation finale | Tous | [evaluations/](evaluations/Evaluation-finale.md) |
| 20 | Parcours carrière et freelancing | Tous | [Module-20](modules/Module-20-Carriere-freelancing.md) |
| 21 | **Logiciel : Pennylane** | Inter. | [Module-21](modules/Module-21-Logiciel-Pennylane.md) |
| 22 | **Logiciel : Tiime** | Inter. | [Module-22](modules/Module-22-Logiciel-Tiime.md) |
| 23 | **Logiciel : Quadra (Cegid)** | Inter.→Av. | [Module-23](modules/Module-23-Logiciel-Quadra.md) |
| 24 | **Logiciel : Isacompta (ISAGRI)** | Inter.→Av. | [Module-24](modules/Module-24-Logiciel-Isacompta.md) |

---

## 7. Planning recommandé sur 8 semaines

> Rythme conseillé : ~15–18 h/semaine. Chaque semaine = cours + cas pratiques + mini-évaluation.

| Semaine | Modules | Objectif de la semaine | Livrable de contrôle |
|---|---|---|---|
| **S1** | 1, 2 | Comprendre le cabinet + maîtriser le PCG | QCM PCG + 10 écritures simples |
| **S2** | 3, 4 (achats/ventes) | Organiser un dossier + saisir achats/ventes | Saisie d'un lot de 20 factures |
| **S3** | 4 (banque/caisse/OD), 5 | Saisie banque + bases TVA | Journal de banque + brouillon CA3 |
| **S4** | 5 (suite), 6 | TVA avancée + rapprochement bancaire | CA3 contrôlée + rapprochement complet |
| **S5** | 7, 8 | Lettrage + comptes d'attente | Lettrage 401/411 + apurement 471 |
| **S6** | 9, 10 | Paie + immobilisations | OD de paie + tableau d'amortissement |
| **S7** | 11, 12 | Révision par cycle + fiscalité | Dossier de révision d'un cycle |
| **S8** | 13, 14, 15, 16, 17 | Bilan + outils + soft skills + qualité | Mini-dossier bilan + **évaluation finale** |

### Variante intensive 4 semaines (plein temps, ~35 h/sem)
- **S1** : Modules 1→4 · **S2** : Modules 5→8 · **S3** : Modules 9→13 · **S4** : Modules 14→20 + évaluation finale.

---

## 🧰 Liste des outils à maîtriser (détail au Module 14)

| Catégorie | Outils |
|---|---|
| Production comptable (full web) | **Pennylane**, **Tiime** |
| Production comptable (cabinet) | **ACD**, **Sage**, **Cegid**, **Coala**, **Quadra** |
| Pré-compta / collecte de pièces | **Dext**, **MEG**, Pennylane (océrisation) |
| Paie | **Silae**, RCA Paie |
| Révision / fiscalité | **RCA** (révision, liasse), Excel |
| Bureautique & GED | **Excel / Google Sheets**, **Google Drive**, PDF |
| Communication & suivi | **Teams**, **Slack**, **Trello / Notion** |

**Priorité d'apprentissage offshore** : 1) Dext/MEG (collecte) → 2) Pennylane/Tiime (saisie web) → 3) un outil cabinet (ACD ou Sage ou Cegid) → 4) Excel (révision) → 5) Silae (lecture journal de paie).

---

## 🎚️ Les trois niveaux de compétence

| Niveau | Ce que la personne sait faire | Modules clés | Supervision |
|---|---|---|---|
| **Débutant validé** | Saisie achats/ventes/banque conforme, classement des pièces, relance pièces | 1–4 | Tout est revu |
| **Intermédiaire** | TVA, rapprochement, lettrage, attente, paie, immo | 5–10 | Contrôle par sondage |
| **Avancé / Autonome** | Révision par cycle, préparation liasse et dossier bilan | 11–13 | Validation finale uniquement |

---

## 🪜 Méthode de montée en compétence (devenir autonome en cabinet français)

1. **Apprendre la procédure, pas seulement la théorie** : chaque tâche a une checklist ; on la suit jusqu'à ce qu'elle soit automatique.
2. **Travailler sur dossier réel anonymisé** dès que possible (sous supervision).
3. **Boucle de feedback** : chaque livraison revue → noter les retours → corriger la checklist personnelle (« mes erreurs récurrentes »).
4. **Mesurer** : suivre ses indicateurs (taux de retour, délais, anomalies) — cf. Module 16.
5. **Réduire progressivement la supervision** : passer du « 100 % revu » au « revu par sondage » puis « validation finale ».
6. **Spécialiser puis élargir** : maîtriser un cycle (ex. trésorerie) avant d'en ajouter un autre.
7. **Critère d'autonomie** : 3 dossiers consécutifs livrés avec **taux de retour < 5 %** sur un cycle donné.

---

## 15. Certification interne / attestation de fin de formation

À l'issue, délivrance d'une **attestation de fin de formation par MG CONSULTING IT&ACT** (société légalement enregistrée au Registre de Commerce et des Sociétés d'Antananarivo), selon le score à l'évaluation finale (cf. `evaluations/Evaluation-finale.md`) :

| Score final | Niveau délivré | Signification opérationnelle |
|---|---|---|
| ≥ 85 % | **Avancé – Collaborateur autonome** | Peut tenir un portefeuille avec validation finale du chef de mission |
| 70–84 % | **Intermédiaire confirmé** | Saisie + TVA + lettrage + rapprochement en autonomie, révision supervisée |
| 55–69 % | **Débutant validé** | Saisie et organisation de dossier en autonomie, reste supervisé |
| < 55 % | Non validé | Reprise des modules ciblés + nouvelle évaluation |

Modèle d'attestation fourni en annexe (`annexes/`).

---

## 16. Plan de progression après la formation

- **Mois 1–3** : consolidation sur dossiers réels, 1 cycle maîtrisé (trésorerie ou achats).
- **Mois 4–6** : élargissement TVA + lettrage + attente sur plusieurs dossiers ; baisse de la supervision.
- **Mois 7–12** : révision par cycle, préparation de bilans simples ; passage « Intermédiaire confirmé ».
- **An 2** : prise en charge d'un portefeuille, préparation de liasses, rôle de **réviseur junior**.
- **An 3+** : **réviseur confirmé / chef de mission offshore**, encadrement d'une équipe (cf. Module 20).

---

## 17. Conseils pour travailler avec des cabinets français depuis Madagascar

1. **Décalage horaire** : Madagascar = UTC+3 (été FR UTC+2, hiver FR UTC+1), soit **1 à 2 h d'avance** sur la France. Avantage : livrer en fin de journée Mada = disponible le matin pour le cabinet. Caler 1 créneau de recouvrement chaque jour.
2. **Confidentialité d'abord** : poste dédié, écran non visible, pas de pièces clients sur messageries perso, respect RGPD (Module 1). C'est éliminatoire pour un cabinet.
3. **Sur-communiquer les blocages** : un cabinet préfère 1 mail « il me manque X » à un dossier bloqué silencieusement.
4. **Tenir les échéances fiscales** : la TVA est sacrée ; anticiper, jamais livrer au dernier moment.
5. **Standardiser** : nommage des fichiers, structure de dossier, modèles de mails — la régularité rassure le cabinet.
6. **Ne jamais valider à la place de l'expert-comptable** : préparer, proposer, signaler — la validation fiscale/juridique reste au cabinet.
7. **Soigner le reporting** : un point quotidien clair (fait / en cours / bloqué) crée la confiance et fidélise le client cabinet.
8. **Investir dans 1 outil cabinet** : maîtriser ACD ou Sage ou Cegid en plus de Pennylane/Tiime augmente fortement la valeur (et le tarif).

---

*Formation conçue comme un référentiel vivant : mettre à jour chaque année les taux et seuils fiscaux/sociaux depuis les sources officielles citées en tête de document.*
