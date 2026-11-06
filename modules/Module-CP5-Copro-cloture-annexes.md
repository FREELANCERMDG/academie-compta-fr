# 7.5 — 📑 Clôture, régularisation des charges et annexes de l'AG

La fin d'exercice est le moment le plus technique : il faut **arrêter les comptes**, calculer l'**écart** entre les charges réelles et les provisions appelées, le **répartir** entre les copropriétaires et présenter le tout dans les **5 annexes** jointes à la convocation de l'AG.

## 🎯 Objectifs pédagogiques
- Dérouler la **check-list de clôture** d'une copropriété.
- Calculer et comptabiliser la **régularisation** des charges (répartition).
- Connaître le contenu des **5 annexes** comptables.
- Traiter les **impayés** et la **vente d'un lot** (mutation).

---

## 1) Check-list de clôture

| ✔ | Contrôle | Écriture éventuelle |
| --- | --- | --- |
| ☐ | **Rapprochement bancaire** du compte courant **et** du compte rémunéré du fonds de travaux | Frais et intérêts non saisis |
| ☐ | **Factures non parvenues** : prestations de l'exercice non encore facturées (énergie, nettoyage de décembre…) | 6xx / **408** |
| ☐ | **Charges payées d'avance** : prime d'assurance couvrant en partie l'exercice suivant | **486** / 6xx |
| ☐ | **Comptes copropriétaires** : lettrage, soldes anormaux, copropriétaires vendeurs à solder | — |
| ☐ | **Impayés** : passage en créances douteuses, dépréciation | **459** / 450 ; **681** / **491** |
| ☐ | **Compte 105** vs compte bancaire du fonds de travaux | Explication de l'écart |
| ☐ | **Comptes d'attente** (47) soldés | Reclassement |
| ☐ | **Travaux en cours** identifiés (annexe 5) | Compte 12 |
| ☐ | **Imputation** de chaque charge à la **bonne clé** de répartition | Reclassement de clé |

### 🧮 À vous : la facture d'électricité non parvenue

<div class="saisie" data-ex="cp-fnp"></div>

## 2) Le compte de gestion : charges réelles vs provisions

On compare, **clé par clé**, les charges réellement engagées et les provisions appelées.

**Résidence Les Jacarandas — exercice N**

| Compte | Charge | Clé | Budget voté | Réalisé |
| --- | --- | --- | --- | --- |
| 601 | Eau | Générales | 3 000 | 3 200 |
| 602 | Électricité parties communes | Générales | 2 000 | 1 900 |
| 611 | Nettoyage | Générales | 9 000 | 9 360 |
| 615 | Entretien et petites réparations | Générales | 600 | 1 240 |
| 616 | Assurance multirisque | Générales | 2 400 | 2 600 |
| 621 | Rémunération du syndic | Générales | 3 000 | 3 000 |
| | **Sous-total charges générales** | | **20 000** | **21 300** |
| 614 | Contrat d'entretien ascenseur | Ascenseur | 3 000 | 2 900 |
| 602 | Électricité ascenseur | Ascenseur | 1 000 | 700 |
| | **Sous-total ascenseur** | | **4 000** | **3 600** |
| | **TOTAL** | | **24 000** | **24 900** |

- Charges générales : **insuffisance de 1 300 €** (21 300 − 20 000) → à **rappeler** aux copropriétaires.
- Ascenseur : **excédent de 400 €** (3 600 − 4 000) → à **rembourser** (aux seuls lots concernés).
- Global : **900 €** à rappeler.

## 3) La régularisation individuelle

> **Régularisation du lot = Σ (charges réelles de la clé × tantièmes du lot ÷ total de la clé) − provisions appelées au lot**

| Lot | Générales (+1 300 × tg) | Ascenseur (−400 × ta) | **Régularisation** |
| --- | --- | --- | --- |
| 1 — SCI BERNARD | +208,00 | 0,00 | **+208,00** à payer |
| 2 — DUPONT | +234,00 | −56,00 | **+178,00** à payer |
| 3 — MARTIN | +195,00 | −48,00 | **+147,00** à payer |
| 4 — PETIT | +221,00 | −92,00 | **+129,00** à payer |
| 5 — DURAND | +182,00 | −76,00 | **+106,00** à payer |
| 6 — LEROY | +260,00 | −128,00 | **+132,00** à payer |
| **Total** | **+1 300,00** | **−400,00** | **+900,00** |

> 💡 Un lot peut **devoir** sur une clé et **récupérer** sur une autre. Toujours calculer **clé par clé**, jamais sur le total.

### 🧮 Simulateur : régularisation des charges d'un lot

<div class="calc" data-calc="copro-regul"></div>

## 4) Comptabiliser la répartition

Après l'**approbation des comptes** par l'AG (majorité de l'article 24), le syndic **solde les comptes de charges (classe 6) et de provisions (701)** par les comptes individuels des copropriétaires :

| Compte | Libellé | Débit | Crédit |
| --- | --- | --- | --- |
| 701 | Annulation des provisions appelées | 24 000 | |
| 450 | Copropriétaires — régularisation (détail par lot) | 900 | |
| 601 | Eau | | 3 200 |
| 602 | Électricité | | 2 600 |
| 611 | Nettoyage | | 9 360 |
| 614 | Contrat ascenseur | | 2 900 |
| 615 | Entretien et petites réparations | | 1 240 |
| 616 | Assurance | | 2 600 |
| 621 | Rémunération du syndic | | 3 000 |

> 🇲🇬 **Réflexe cabinet :** le logiciel génère cette écriture **lot par lot** (« répartition des charges ») et édite pour chaque copropriétaire son **relevé individuel de charges**. Vous vérifiez que le total des régularisations = **charges réelles − provisions appelées**.

> 🏠 **Et en cas de vente en cours d'année ?** La régularisation révélée par l'approbation des comptes est portée au compte de **celui qui est copropriétaire au jour de l'approbation** (art. 6-2 du décret de 1967), sauf convention contraire entre vendeur et acquéreur, qui ne concerne qu'eux.

### 🧮 À vous : passez l'écriture de répartition

<div class="saisie" data-ex="cp-repartition"></div>

## 5) Les 5 annexes comptables (arrêté du 14 mars 2005)

| Annexe | Contenu | Ce qu'on y lit |
| --- | --- | --- |
| **Annexe 1** | **État financier après répartition** de l'exercice clos | Trésorerie, **copropriétaires débiteurs/créditeurs**, fournisseurs, fonds de travaux (105), avances (103) — c'est le « bilan » de la copropriété |
| **Annexe 2** | **Compte de gestion général** de l'exercice clos et budgets | Total des charges et produits : **opérations courantes** et **travaux**, réalisé N, budget N, budget N+1, budget N+2 |
| **Annexe 3** | **Compte de gestion pour opérations courantes** | Le détail **compte par compte** et **clé par clé** : réalisé N vs budget N, budgets N+1 et N+2 |
| **Annexe 4** | **Compte de gestion pour travaux et opérations exceptionnelles** | Les travaux hors budget de l'exercice : dépenses et financements |
| **Annexe 5** | **État des travaux et opérations exceptionnelles votés, non encore clôturés** | Les chantiers en cours : montant voté, appelé, dépensé, solde en attente |

> ✅ **Cohérence à vérifier :** l'annexe 1 doit être **équilibrée** (actif = passif). Les régularisations de l'annexe 3 doivent se retrouver dans les soldes copropriétaires de l'annexe 1.

## 6) Les impayés

1. **Relance amiable**, puis **mise en demeure** (lettre recommandée).
2. Les **frais de recouvrement** à partir de la mise en demeure sont imputés **au seul copropriétaire défaillant** (art. 10-1).
3. Si le recouvrement devient incertain : **créance douteuse** et **dépréciation**.

| Opération | Débit | Crédit |
| --- | --- | --- |
| Transfert en créance douteuse | **459** | 4501 |
| Dépréciation (part jugée irrécouvrable) | **681** | **491** |
| Créance définitivement perdue | **677** | 459 (et reprise de la dépréciation) |

> ⚠️ Une créance perdue est une **charge de tous les copropriétaires** : elle sera répartie sur les autres lots. D'où l'importance d'un **recouvrement rapide** (procédure accélérée, hypothèque légale du syndicat, opposition lors d'une vente).

### 🧮 À vous : un copropriétaire en difficulté

<div class="saisie" data-ex="cp-impaye"></div>

## 7) La vente d'un lot (mutation)

| Étape | Rôle du syndic / du comptable |
| --- | --- |
| **Pré-état daté** | Informations financières fournies au vendeur pour le compromis |
| **État daté** (art. 5 du décret) | Document officiel demandé par le notaire : sommes dues par le vendeur, sommes dues au vendeur, sommes qui incomberont à l'acquéreur. Honoraires **plafonnés à 380 € TTC**, à la charge du **vendeur** |
| **Provisions** | La provision **exigible** avant la vente reste due par le **vendeur** |
| **Avance de trésorerie (103)** | **Remboursée** au vendeur, **appelée** à l'acquéreur |
| **Fonds de travaux (105)** | **Non remboursé** : il reste attaché au lot |
| **Opposition** (art. 20 de la loi) | Si le vendeur doit de l'argent, le syndic peut faire **opposition** sur le prix de vente auprès du notaire |
| **Comptabilité** | Clôture du compte du **vendeur**, ouverture du compte de l'**acquéreur** |

> 🔜 Leçon suivante : le **simulateur syndic** — vous déroulez un exercice complet, de l'appel de fonds aux annexes.
