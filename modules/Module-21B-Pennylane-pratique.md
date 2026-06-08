# Pennylane : la pratique, opération par opération (par module)

**Niveau :** Intermédiaire · **Durée :** 8–10 h (sur dossier réel anonymisé) · **Prérequis :** « Pennylane — prise en main »
> Pour **chaque thème de la formation**, voici **comment le faire concrètement dans Pennylane**, étape par étape (interface **Comptabilité**). *Les libellés exacts peuvent varier selon les mises à jour ; le principe reste le même.*

**Rappel des menus :** **Tableau de bord · Saisie · Révision · Fiscalité · États financiers · Dossier du client**.
**Avant tout :** sélectionner le bon **dossier client** et vérifier son **régime TVA** (Dossier du client).

---

## 🟢 Module 1.4 — Saisie des achats et des ventes
**Achats (factures fournisseurs)**
1. **Saisie → Factures fournisseurs**.
2. Vérifier la facture importée/océrisée (fournisseur, date, **HT, TVA, TTC**).
3. Corriger le **compte de charge** (ex. 6064, 611…) et le **taux de TVA**.
4. Vérifier le **compte fournisseur (401)** et joindre la **pièce**.
5. **Valider** → écriture 6xx / 44566 / 401.

**Ventes (factures clients)**
1. **Saisie → Factures clients** (ou import depuis l'outil de facturation / interface Gestion).
2. Contrôler **HT, taux de TVA, 707/706**, le client (411).
3. **Valider** → 411 / 70x / 44571.

> 💡 Astuce : beaucoup d'écritures se créent **automatiquement au rapprochement bancaire** (voir plus bas) — on ne saisit à la main que ce qui n'a pas de transaction.

---

## 🟢 Module 3.2 — Banque & rapprochement bancaire (le cœur)
1. **Saisie → Transactions bancaires** : la liste descend automatiquement (connexion bancaire).
2. Pour chaque ligne **« À traiter »** :
   - **Rapprocher avec une pièce** : associer la **facture/justificatif** → l'écriture se génère et le tiers se **lettre** automatiquement → statut **« Traité »**.
   - **Sinon, catégoriser** : saisir le **compte de contrepartie** (ex. 627, 6262…) + vérifier le **taux de TVA** (+ catégorie analytique) → **« Traité »**.
   - **Pas de pièce nécessaire** (frais bancaires) → marquer **« Justifié »**.
3. Créer une **règle d'automatisation** sur un libellé récurrent (ex. « ORANGE » → 6262, TVA 20 %) — puis la **contrôler**.
4. **Pièce manquante** → laisser **« À traiter »** + **relancer** le client.
5. **Objectif : 0 transaction « À traiter »**.
6. Le **rapprochement bancaire** (PDF justifiant le solde) se génère dans le module et se retrouve dans **Exports**.

<img src="img/pennylane-rapprochement.svg" alt="Flux de rapprochement bancaire Pennylane" width="820">

> **Exemple chiffré.** Solde **relevé** au 31/03 = **12 450,00 €**. Solde **comptable 512** = **12 200,00 €** → écart **250 €**.
> On retrouve : un **chèque émis non débité** de 250 € (déjà comptabilisé, pas encore passé en banque) → c'est un **élément de rapprochement normal** : `512 comptable 12 200 + 250 (chèque en circulation) = 12 450 relevé`. ✅ rapprochement justifié.
> Si l'écart venait de **frais bancaires** non saisis (ex. 15 €) → on **catégorise** la ligne (627) puis l'écart tombe à 0.

---

## 🟢 Module 3.3 — Lettrage clients / fournisseurs
1. Le lettrage est **automatique** quand une facture est rapprochée à son règlement.
2. Pour le **lettrage manuel** (avoirs, règlements partiels, écarts) : **Révision** → ouvrir le compte **401**/**411** du tiers.
3. Sélectionner les lignes qui s'équilibrent (facture + règlement + avoir) → **Lettrer**.
4. **Écart** (centimes/frais) → solder via 658/758 puis lettrer.
5. Contrôler les **401 débiteurs / 411 créditeurs** (trop‑payés, acomptes) → analyser.

---

## 🟢 Module 3.4 — Comptes d'attente (471)
1. Une transaction **non identifiée** reste **« À traiter »** (ou est passée en **471** avec commentaire).
2. Pour apurer : rechercher la **pièce**, identifier un **récurrent**, puis **rapprocher/catégoriser**.
3. Reste inconnu → **relancer** le client (note interne dans la transaction).
4. Avant la clôture : **471 = 0** (tout imputé).

---

## 🟢 Module 3.1 — Déclarer la TVA sur Pennylane (CA3) — pas à pas
1. **Prérequis** : banque rapprochée (0 « À traiter »), ventes/achats saisis, **471 apuré**.
2. **Fiscalité → TVA** : sélectionner la **période** (mois/trimestre) et le **régime** (réel normal CA3 / simplifié CA12).
3. Lancer le **cadrage de TVA** : Pennylane rapproche la **TVA comptabilisée** (comptes 4457/4456) et la **TVA déclarable**, puis **signale les écarts**.
4. Contrôler les **lignes** : collectée par taux (cadres **08/09/9B**), déductible **ABS (ligne 20)** et **immobilisations (ligne 19)**, **report de crédit (ligne 22)**.
5. Vérifier : pas de TVA sur **assurance/VP**, **TVA sur encaissements** à jour (prestations de services), autoliquidation intracom/sous‑traitance (voir plus bas).
6. **Générer le brouillon** → **transmettre au chef de mission** pour **validation**, puis **télétransmission** (Pennylane envoie à la DGFiP en EDI) → le **paiement** est prélevé.

> **Exemple chiffré (mois de mars).** Ventes 20 % : **30 000 € HT** → TVA collectée **6 000 €** (ligne 08). Achats déductibles : **2 400 €** (ligne 20). Achat d'un ordinateur (immo) : TVA **300 €** (ligne 19).
> **TVA nette due = 6 000 − 2 400 − 300 = 3 300 €** (ligne 28 / à payer ligne 32). Si le résultat était négatif → **crédit de TVA** (ligne 25), reporté (ligne 22) ou remboursé.
> Après télétransmission, **solder les comptes** : 44571 (6 000) et 44566/44562 (2 700) → **44551 « TVA à décaisser » 3 300** ; au paiement : **44551 D / 512 C**.

---

## 🟢 Cadrage de TVA — réconcilier la déclaration et la compta
Le **cadrage** vérifie que la **TVA déclarée = TVA en comptabilité** (aucune ligne oubliée).
1. **Fiscalité → TVA → Cadrage** : Pennylane confronte la **base × taux** déclarée au **solde des comptes 4457x**.
2. **Contrôle de cohérence du CA :** `CA HT déclaré (TVA) ≈ comptes 70x` ; un écart = facture oubliée, taux erroné, ou produit non soumis (export, intracom).
3. **Écarts fréquents :** TVA sur encaissements non à jour (services), avoir non pris en compte, opération en **471**, autoliquidation non déclarée.
4. **Objectif :** écart de cadrage **= 0 €** avant transmission.

> **Exemple.** Compte 707 = 30 000 € mais base TVA 20 % déclarée = 28 000 € → **écart 2 000 €** : on retrouve une **facture d'export** (exonérée, ligne 04) → c'est normal, on **justifie** l'écart dans le dossier.

---

## 🟢 Module 3.5 — Paie (OD de paie)
1. Récupérer le **journal de paie** (Silae/RCA).
2. **Saisie → Écritures / OD** : créer l'**OD de paie** (ou importer le journal s'il est connecté) → 641 / 645 / 421 / 431 / 437.
3. Vérifier l'**équilibre** (641+645 = 421+431+437).
4. **Rapprocher les paiements** : nets (421) et cotisations (431/437) avec les **transactions bancaires**.
5. Contrôler **OD = bulletins = DSN = virements** ; solder 421/431/437.

---

## 🟢 Module 3.6 — Intégrer une immobilisation sur Pennylane (pas à pas)
1. À l'achat (> **500 € HT**) : saisir en **immobilisation** (2154/2183…) au lieu d'une charge, **TVA en 44562**.
2. **Module Immobilisations → Ajouter une immobilisation** : créer la **fiche** (libellé, compte 21x, **date de mise en service**, **base HT**, **durée/mode**).
3. Pennylane calcule le **plan d'amortissement** (linéaire, **prorata temporis** la 1re année) — vérifier les annuités.
4. À la clôture : passer/valider la **dotation** (6811 / 28x) — Pennylane propose l'écriture depuis la fiche.
5. Contrôler : **fichier des immos = comptes 21/28** ; pas de TVA sur **VP**.

> **Exemple chiffré.** Ordinateur **1 500 € HT** (TVA 300 €), mis en service le **1er avril**, durée **3 ans** (linéaire).
> Acquisition : **2183 D 1 500 / 44562 D 300 / 404 C 1 800**.
> Annuité pleine = 1 500 / 3 = **500 €/an**. **Année 1 (avril→déc = 9 mois)** : 500 × 9/12 = **375 €** → `6811 D 375 / 28183 C 375`. Années 2 et 3 : 500 € ; reliquat de 125 € en année 4. La fiche Pennylane génère ce plan automatiquement.

---

## 🟢 Module 3.7 — Révision par cycle
1. **Révision** : la justification est organisée **par compte / par cycle**.
2. Pour chaque compte significatif : ouvrir, **vérifier le solde**, **joindre la justification** (rapprochement, tableau, pièce).
3. **Lettrer** 401/411, **apurer** 471/580.
4. Repérer les **soldes anormaux** (512 créditeur, 53 négatif, 455 débiteur…).
5. Marquer le compte **« révisé »** → préparer le **dossier pour le chef de mission**.

---

## 🟢 Module 4.2 — Clôture / bilan (cut‑off)
1. Passer les **OD d'inventaire** (Saisie → Écritures/OD) :
   - **FNP** (charges non facturées) : 6xx / 44586 / 408 ;
   - **FAE** (produits à facturer) : 418 / 70x / 44587 ;
   - **CCA** : 486 / 6xx · **PCA** : 70x / 487 ;
   - **stocks**, **amortissements**, **provisions** (validation EC).
2. Éditer **États financiers** : grand livre, balance, **bilan**, **compte de résultat**.
3. Contrôles finaux : TVA, banque (rapprochée), emprunts (164 = capital restant dû), paie, **471/580 = 0**.
4. Préparer le **dossier de bilan** → l'**expert‑comptable** finalise la **liasse**.

---

## 🟢 Opérations intracommunautaires (UE) sur Pennylane
**Achat intracommunautaire de biens** (fournisseur UE, ex. Allemagne) → **autoliquidation** : pas de TVA sur la facture, mais on la **collecte ET la déduit**.
1. **Saisie → Facture fournisseur** : choisir le **taux « Acquisition intracommunautaire »** (Pennylane génère la double écriture TVA).
2. **Écriture :** `607/6xx D (HT) / 401 C (HT)` **+** `4452 C (TVA collectée) / 44566 D (TVA déductible)` → impact net **0** mais **obligatoire**.
3. **CA3 :** base en **ligne 03** (acquisitions intracom), TVA collectée en **17**, déduite en **20**.
4. **Vente intracommunautaire de biens** (client UE avec n° TVA valide **VIES**) : **exonérée** → **ligne 06** ; mention « Exonération art. 262 ter I ».
5. **Déclarations douanières/fiscales :** **EMEBI/DEB** (biens) et **DES** (services) à transmettre.

> **Exemple.** Achat de marchandises **5 000 € HT** en Belgique : 607 = 5 000 D / 401 = 5 000 C ; **4452 = 1 000 C / 44566 = 1 000 D**. Net de trésorerie TVA = 0, mais la CA3 doit montrer l'opération (lignes 03/17/20).

---

## 🟢 Comptes « intercos » (opérations inter‑sociétés / groupe)
Quand un dossier appartient à un **groupe**, des opérations existent **entre sociétés liées** (refacturations, prêts, management fees, comptes courants).
1. **Comptes dédiés :** **451** (groupe), **455** (comptes courants d'associés), **4711** si non identifié.
2. **Refacturation interco** (ex. la holding refacture des frais à la fille) : `411/451 D / 706 + 44571 C` chez l'émetteur ; `6xx + 44566 D / 401/451 C` chez le destinataire.
3. **Rapprochement interco (réciprocité) :** le **solde 451/455 chez A doit être l'inverse exact chez B**. En révision : ouvrir les comptes des deux sociétés et **pointer les écarts** (facture enregistrée d'un seul côté, décalage de date).
4. **Comptes courants d'associés (455) :** vérifier le **sens** (455 débiteur = avance anormale à surveiller), les **intérêts** éventuels (taux maxi déductible), et la **convention**.

> **Exemple.** Holding H facture **2 000 € HT** de prestations à la fille F.
> Chez **H** : `451F D 2 400 / 706 C 2 000 / 44571 C 400`. Chez **F** : `622 D 2 000 / 44566 D 400 / 451H C 2 400`. **Contrôle interco :** 451F (chez H) = 451H (chez F) = **2 400 €** en sens inverse. ✅

---

## ✅ Checklist « production mensuelle d'un dossier sur Pennylane »
- [ ] Pièces collectées + OCR contrôlé
- [ ] **0 transaction bancaire « À traiter »**
- [ ] Achats/ventes saisis, pièce jointe partout
- [ ] Lettrage 401/411 fait · 471 apuré
- [ ] Cadrage **TVA** = 0 → CA3 transmise pour validation
- [ ] Intracom (autoliquidation) + **intercos** rapprochés (451/455 réciproques)
- [ ] OD de paie passée et rapprochée (si paie)
- [ ] Immobilisations intégrées (fiche + plan d'amortissement)
- [ ] Comptes révisés / soldes justifiés
- [ ] Anomalies commentées · points en suspens transmis

---

## 📝 Évaluation de fin de leçon
1. Dans quel menu traite‑t‑on les transactions bancaires ?
2. Quels sont les statuts d'une transaction ?
3. Où fait‑on le lettrage manuel ?
4. Où prépare‑t‑on la TVA, et qui la valide ?
5. Quels comptes doivent être à 0 avant la clôture ?

**Seuil : 7/10.** **Corrigé :** 1) **Saisie → Transactions bancaires**. 2) À traiter / Traité / Justifié. 3) **Révision** (compte 401/411). 4) **Fiscalité → TVA** ; validée par le **chef de mission / EC**. 5) **471 et 580**.
