# 2.11 — Préparer la liasse fiscale sur Pennylane

La période fiscale se prépare **en amont**. La plupart des champs de la **liasse fiscale** sont repris automatiquement de votre dossier Pennylane : **plus vous les complétez tôt, plus le remplissage de la liasse sera rapide**. Voici, par emplacement dans l'interface, tout ce qu'il faut vérifier ou compléter — idéalement **avant le 31 décembre**.

## ✅ Checklist liasse fiscale (vue d'ensemble)

**1. Espace cabinet** *(Entreprises → Saisie)*
- ☐ Nombre d'employés *(onglet Général)*
- ☐ Référence d'obligation fiscale – ROF *(onglet Fiscal)*

**2. Dossier permanent** *(Paramètres → Informations entreprise)*
- ☐ SIREN · ☐ Activité de l'entreprise · ☐ Exercices comptables
- ☐ Catégorie fiscale · ☐ Régime fiscal · ☐ Organisme de gestion agréé (OGA)
- ☐ Répartition du capital *(attention aux dates : début et fin d'exercice)*
- ☐ Filiales et participations · ☐ Immeubles *(si SCI à l'IR)*

**3. Modules de révision** *(Révision → module concerné)*
- ☐ Immobilisations *(financières, amortissements, sorties, dépréciations…)*
- ☐ Emprunts *(échéanciers, ventilation capital / intérêts / assurance)*
- ☐ Crédits-bail *(échéanciers, plafond annuel de déductibilité)*
- ☐ Écritures de régularisation – cut-off *(PCA, CCA, FAE, FNP)*

---

## 1) Espace cabinet
Accès : **espace cabinet → Entreprises → Saisie**, puis survolez l'entreprise et ouvrez la gestion du dossier (icône page) → onglets **Général** / **Fiscal**.

- **Général → Nombre d'employés** : la valeur saisie ici est **reprise dans la liasse**.
- **Fiscal → Référence d'obligation fiscale (ROF)** : identifiant fourni par l'administration fiscale (notamment la **ROF liasse**).

> ⚠️ La ROF liasse prend **automatiquement** en compte votre régime fiscal (BIC, BNC, IS…) et l'ajoute en **préfixe**. Vous ne saisissez donc que **l'identifiant final** (ex. `2` → `IS2`, `3` → `BNC3`).

## 2) Dossier permanent
Accès : **dossier du client → Paramètres → Informations entreprise**.

### Onglet Général
- **SIREN** (normalement déjà rempli) : une fois vérifié, cliquez sur **« Mettre à jour les informations »** pour actualiser automatiquement **adresse, forme juridique et capital social**.
- **Activité de l'entreprise** : ce champ est repris dans la liasse.

### Onglet Tenue comptable
- **Figer et valider la comptabilité** (à la date de clôture).
- **Exercices comptables** : ces dates **conditionnent tous les calculs** de la liasse.

### Onglet Fiscal
- **Catégorie fiscale**, **Régime fiscal**, **Organisme de gestion agréé (OGA)**.
- Un bon paramétrage ici fait **gagner du temps** : les **bons formulaires (CERFA)** seront générés automatiquement dans les modules de fiscalité.

### Onglet Répartition du capital
- Vérifiez et complétez la **composition du capital** et les **coordonnées des associés**, **en début ET en fin d'exercice**.

> ⚠️ Par défaut, seule la répartition **en fin d'exercice en cours** est affichée. Utilisez la flèche **« précédent »** pour contrôler les exercices antérieurs. Si la liasse concerne 2025, vérifiez bien les répartitions de **début et de fin 2025**.

> 💡 Pour plus de précision : cliquez sur un propriétaire → **Paramétrage avancé → Imposition**.
> → Ces données remontent dans les CERFA **« Composition du capital social »** de la liasse (selon le régime).

### Onglet Filiales et participations
- Renseignez les **filiales / participations détenues** → remontent dans le CERFA **« Filiales et participations »**.

### Onglet Immeubles *(SCI à l'IR uniquement)*
- Cet onglet apparaît si la **catégorie fiscale = SCI à l'IR** (Fiscal → Catégorie fiscale).
- Créez les **immeubles** → remplissage automatique du **formulaire 2072**. Pensez à **« Gérer les catégories »** et à **configurer l'analytique** correspondante (obligatoire).

> ✍️ La **catégorisation analytique** est requise : une écriture **non catégorisée n'est pas prise en compte** dans la liasse.

## 3) Modules de révision
Accès : **dossier permanent → menu Révision → module concerné**. Si vos modules sont à jour, les remplissages issus de la comptabilité fonctionnent.

| Module | À vérifier / compléter | Alimente (CERFA) |
|---|---|---|
| **Immobilisations** | financières, fiches, **dépréciations**, **sorties**, **dotations aux amortissements** | tableau immobilisations & amortissements — **2054/2055** ou **2033-C** |
| **Emprunts** | détail + **échéanciers**, ventilation **capital / intérêts / assurance** | **État des échéances — 2057** |
| **Crédits-bail** | suivi, **plafond annuel de déductibilité**, échéanciers de paiement | facilite l'**IS** → **Détermination du résultat fiscal (2058-A ou 2033-B)** |
| **Écritures de régularisation (cut-off)** | **PCA**, **CCA**, **FAE**, **FNP** | annexes **CA17PROREC, CA18CHAPAY, CA19CHAREP, CA20CHAAVA, CA21PROAVA** |

## À retenir (réflexes cabinet)
- La liasse se **prépare en amont** : remplir tôt les champs du dossier = liasse rapide en fin d'exercice.
- **Tout part du paramétrage** (régime fiscal, exercices, répartition du capital) : un mauvais réglage = mauvais formulaires.
- Les **modules de révision** (immo, emprunts, crédits-bail, cut-off) **alimentent directement les CERFA** de la liasse.
- Pensez à **figer la comptabilité** à la clôture (voir leçon suivante).
