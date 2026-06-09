# 1.3 — Organisation d'un dossier comptable externalisé

**Niveau :** Débutant · **Durée estimée :** 6–8 h · **Prérequis :** Modules 1–2

---

## 🎯 Objectifs pédagogiques
- Organiser la réception, le classement et le nommage des pièces.
- Gérer les pièces manquantes et non conformes.
- Utiliser les outils de collecte (Dext, Pennylane, Tiime, MEG, Drive).
- Contrôler doublons et factures non conformes.
- Communiquer et suivre les demandes avec le cabinet français.

## 🧩 Compétences à maîtriser
- Tenir un dossier propre et traçable.
- Relancer efficacement les pièces manquantes.
- Tenir un tableau de suivi de dossier.

---

## 📂 0. Avant de gérer un dossier : LIRE le KBIS, les statuts et la lettre de mission
**Règle d'or du collaborateur :** on ne saisit **jamais** une seule écriture avant d'avoir lu les **3 documents fondateurs** du dossier. Ils répondent à : *qui est le client ? que fait-il ? sous quelle forme juridique (donc quel impôt et quel régime social) ? qui signe ? et jusqu'où va MA mission ?* Ces documents vivent dans le **dossier permanent** (`01_PERMANENT/`).

### 🪪 A) Le KBIS (extrait Kbis) — la carte d'identité de l'entreprise
Document officiel du greffe (à jour, **moins de 3 mois**). Pour une entreprise individuelle, l'équivalent est l'**avis de situation SIRENE**. Comment le lire :

| Ce que vous lisez | Pourquoi c'est crucial (impact compta / fiscal) |
|---|---|
| **Dénomination + n° SIREN/SIRET, RCS** | Identité exacte, à reporter partout (factures, déclarations) |
| **Forme juridique** (SARL, EURL, SAS, SASU, SCI, EI…) | Détermine l'**IS ou l'IR**, et le **statut social du dirigeant** (TNS vs assimilé salarié) |
| **Date d'immatriculation** | 1er exercice (souvent **> 12 mois**), report de l'à-nouveau |
| **Date de clôture de l'exercice** | Calendrier de **clôture, liasse, CA12** |
| **Capital social** | Compte **101** ; capital libéré ou non ; base du taux réduit d'IS |
| **Dirigeant(s) et pouvoirs** | **Qui signe / qui engage** ; gérant majoritaire = **TNS** |
| **Objet / code APE-NAF** | Cohérence de l'activité ; indices de **régime/TVA** spécifiques (BTP, immobilier…) |
| **Mentions** (procédure collective, EIRL…) | Alerte sur la situation (sauvegarde, redressement) |

### 📜 B) Les statuts — le « contrat » de la société
Ils précisent et complètent le KBIS. À extraire :

| Clause à repérer | Ce que ça change pour vous |
|---|---|
| **Objet social** | Périmètre des opérations « normales » de l'entreprise |
| **Capital & répartition des parts/actions** | Comptes **101 / 455**, **dividendes**, quote-part (SCI), associés |
| **Date de clôture** | Confirme/complète le KBIS |
| **Gérance / présidence, rémunération** | **TNS ou assimilé salarié** → traitement de la paie / cotisations |
| **Option fiscale** (ex. SCI ou EURL à l'**IS** sur option, SAS de plein droit) | **IR ou IS** : tout le traitement en dépend |
| **Comptes courants d'associés, conventions réglementées** | Compte **455**, intérêts déductibles plafonnés |

### 🤝 C) La lettre de mission — VOTRE périmètre de travail
C'est le **contrat obligatoire** (déontologie de l'expert-comptable) entre le **cabinet et le client**. Elle dit **ce que vous devez produire** et **ce que vous ne devez PAS faire**. À lire impérativement :
- **Périmètre exact** : tenue ? révision ? **TVA** ? **liasse** ? **paie** ? conseil ? — et surtout ce qui est **exclu** (limites de responsabilité).
- **Répartition des tâches** client ↔ cabinet : qui saisit, qui fournit les justificatifs, qui établit la paie.
- **Périodicité et délais** de production ; **honoraires**.
- **Interlocuteur** désigné et clause de **confidentialité / secret professionnel**.

> ⚠️ **En offshore, c'est votre boussole.** Ne sortez **jamais** du périmètre de la lettre de mission (ex. ne pas produire une paie ou un conseil fiscal non prévus) et **remontez au chef de mission** tout ce qui en sort.

### 🧭 Réflexe : créer la « fiche d'identité du dossier »
Avant de saisir, remplissez une fiche (dans le dossier permanent) à partir des 3 documents :

| Champ | Source | Exemple |
|---|---|---|
| Forme juridique | KBIS / statuts | SARL |
| Régime d'imposition | Statuts / option | **IS** |
| Régime de TVA | Lettre de mission / dossier | Réel normal — CA3 mensuelle |
| Date de clôture | KBIS / statuts | 31/12 |
| Dirigeant & statut social | KBIS / statuts | Gérant majoritaire → **TNS** |
| Associés & parts | Statuts | 2 associés (60 / 40) |
| Périmètre de ma mission | Lettre de mission | Tenue + TVA + liasse (paie exclue) |

> ✅ Cette fiche évite 90 % des erreurs de débutant : appliquer le bon impôt, le bon régime social, la bonne TVA, et rester **dans son périmètre**.

### 🧪 Mini cas pratique 3.0
Vous recevez un nouveau dossier « SCI DURAND ». Le KBIS indique *forme : SCI*, les statuts mentionnent *option à l'IS*, la lettre de mission couvre *tenue + liasse, sans TVA*.
**Questions :** (1) IR ou IS ? (2) Amortit-on l'immeuble ? (3) Doit-on préparer une CA3 ?
**Réponse :** (1) **IS** (option dans les statuts). (2) **Oui**, l'immeuble s'amortit (SCI à l'IS, contrairement à la SCI à l'IR). (3) **Non** : la TVA n'est **pas** dans la lettre de mission → ne pas la traiter, le signaler si une opération taxable apparaît.

---

## 1. La réception des pièces
Les pièces arrivent par : **Dext / MEG** (photo, mail dédié), **Pennylane / Tiime** (upload, connexion bancaire), **Google Drive / Teams** (dépôt de fichiers), **mail du cabinet**.

**Première règle :** une pièce = une **image lisible, complète, non rognée**. On refuse une photo floue, coupée ou en double.

---

## 2. Classement et nommage des fichiers

### Structure de dossier recommandée (GED)
```
CLIENT_X/
  01_PERMANENT/        (Kbis, statuts, bail, emprunts, immo)
  02_BANQUE/           (relevés par mois : 2026-01_releve.pdf)
  03_ACHATS/           (factures fournisseurs par mois)
  04_VENTES/           (factures clients par mois)
  05_PAIE/             (bulletins, journaux de paie, DSN)
  06_TVA/              (déclarations CA3/CA12)
  07_OD_DIVERS/
  08_A_TRAITER/        (pièces non encore identifiées)
```

### Convention de nommage (à imposer)
`AAAA-MM-JJ_TYPE_TIERS_MONTANT.pdf`
- Exemple : `2026-03-12_ACH_ORANGE_59,90.pdf`
- Types : ACH (achat), VTE (vente), BQ (banque), OD, IMMO, PAIE.

> ✅ Un nommage régulier = recherche instantanée + zéro perte de pièce. C'est un marqueur de professionnalisme offshore.

---

## 3. Gestion des pièces manquantes
1. Identifier le manque (souvent au rapprochement bancaire : un débit sans facture).
2. Le **lister** dans le tableau de suivi.
3. **Relancer** (le client ou le cabinet selon l'organisation) — modèle de mail en annexe.
4. En attendant : passer l'opération en **471** ou laisser le règlement non lettré, **avec commentaire**.
5. Ne jamais « inventer » une imputation : une dépense sans justificatif n'est pas déductible (TVA + charge).

---

## 4. Contrôle des doublons
Causes fréquentes : pièce importée 2 fois dans Dext **et** saisie manuellement, ou facture + relevé bancaire comptabilisés séparément.

**Méthode anti-doublon :**
- Trier le journal d'achats par **fournisseur + montant + date**.
- Vérifier les **n° de facture** identiques.
- Dans Pennylane/Dext, surveiller l'alerte « doublon potentiel ».
- Contrôle : un même montant, même tiers, même jour → vérifier.

---

## 5. Factures non conformes (ne pas saisir telles quelles)
Une facture française doit comporter : identité et **SIREN** du fournisseur, date, **n° de facture**, détail HT, **taux et montant de TVA**, **n° de TVA intracommunautaire** (si applicable), mentions légales.

**Cas non conformes courants :**
- Ticket de caisse sans TVA détaillée → TVA non récupérable (saisir en TTC, signaler).
- « Facture » au nom du dirigeant et non de la société → charge personnelle potentielle (signaler, ne pas déduire la TVA).
- Bon de commande / devis pris pour une facture → refuser.
- Facture en devise → convertir + justifier le taux.

---

## 6. Tickets, notes de frais, relevés bancaires
- **Tickets restaurant / carburant** : justificatif obligatoire ; TVA récupérable selon nature (cf. Module 3).
- **Notes de frais** : rapprocher de la pièce ; salarié remboursé via 425 ou compte associé.
- **Relevés bancaires** : base du rapprochement ; vérifier que **tous les mois** sont présents et complets (pas de page manquante).

---

## 7. Outils de collecte (vue rapide — détail Module 6)
| Outil | Rôle dans la collecte |
|---|---|
| **Dext** | Photo/scan + océrisation des factures, export vers l'outil compta |
| **MEG** | Collecte + pré-saisie, GED collaborative |
| **Pennylane** | Connexion bancaire + import factures + saisie web |
| **Tiime** | Idem, orienté TPE/indépendants |
| **Google Drive** | Dépôt brut de pièces (à ranger ensuite) |

---

## 8. Communication et suivi avec le cabinet français
- Un **point quotidien** : ce qui est fait, en cours, bloqué.
- Toute pièce manquante / anomalie → **tracée** (pas de mémoire orale).
- Les questions sont **regroupées** (1 mail clair vaut mieux que 10 messages).

---

## ✅ Checklist « ouverture / tenue de dossier mensuel »
- [ ] Tous les relevés bancaires du mois reçus et complets
- [ ] Pièces d'achats et de ventes du mois reçues
- [ ] Pièces rangées et nommées selon la convention
- [ ] Doublons contrôlés
- [ ] Factures non conformes identifiées et signalées
- [ ] Liste des pièces manquantes établie et relancée
- [ ] Tableau de suivi de dossier mis à jour
- [ ] Régime TVA et régime fiscal du dossier vérifiés (dossier permanent)

---

## 📊 Tableau de suivi de dossier (modèle Excel à créer)
Colonnes recommandées :

| Client | Mois | Pièces reçues (O/N) | Relevés complets (O/N) | Saisie achats | Saisie ventes | Banque saisie | Rapprochement | Lettrage | TVA préparée | TVA validée | Pièces manquantes | Anomalies | Statut | Date livraison |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

Statuts : `À FAIRE / EN COURS / BLOQUÉ / À VALIDER / TERMINÉ`.

---

## 🧪 Cas pratique 3.1 — Tri de pièces
On reçoit en vrac : (a) un devis, (b) une facture Orange 59,90 €, (c) une photo floue d'un ticket carburant, (d) deux fois la même facture EDF, (e) une facture au nom personnel du gérant.
Que faire de chacune ?

### ✔️ Correction 3.1
- (a) Devis → **ne pas saisir**, ce n'est pas une pièce comptable. Classer ou écarter.
- (b) Facture Orange → saisir (6262 + TVA + 401), nommer `2026-..._ACH_ORANGE_59,90`.
- (c) Ticket flou → **redemander une photo nette** (relance), en attente.
- (d) Doublon EDF → **n'en garder qu'une**, supprimer l'autre, vérifier qu'elle n'est pas saisie 2 fois.
- (e) Facture au nom du gérant → **signaler** : possible charge personnelle ; ne pas récupérer la TVA sans validation du chef de mission.

---

## 📝 Évaluation de fin de chapitre
1. Citez 4 mentions obligatoires d'une facture conforme.
2. Donnez la règle de nommage d'un fichier et un exemple.
3. Que faire d'une dépense sans justificatif au rapprochement ?
4. Citez 3 causes de doublon.
5. Quelles colonnes minimales pour un tableau de suivi de dossier ?

**Seuil : 7/10.**
**Corrigé synthétique :** 1) SIREN, date, n° facture, TVA détaillée (+ mentions légales). 2) `AAAA-MM-JJ_TYPE_TIERS_MONTANT.pdf`, ex. `2026-03-12_ACH_ORANGE_59,90.pdf`. 3) la passer en 471 ou laisser non lettrée **avec commentaire** + relancer la pièce ; ne pas déduire la TVA. 4) import + saisie manuelle, facture + relevé, double import Dext. 5) client, mois, statut saisie/banque/rapprochement/TVA, pièces manquantes, anomalies, statut, date livraison.
