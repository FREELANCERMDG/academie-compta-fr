# 7.4 — 🏗️ Travaux hors budget et fonds de travaux

Les gros travaux (ravalement, toiture, chaudière, mise aux normes) ne passent **jamais** par le budget prévisionnel. Ils sont votés **à part**, appelés **à part**, et peuvent être financés par le **fonds de travaux** que chaque copropriété doit alimenter chaque année.

## 🎯 Objectifs pédagogiques
- Identifier les **dépenses hors budget** (art. 44 du décret de 1967).
- Comptabiliser les **appels pour travaux** (4502 / 702) et les **factures** de travaux (671).
- Maîtriser le **fonds de travaux** : obligation, montant minimum, comptabilisation (105 / 705).
- Savoir traiter des **travaux non terminés** à la clôture.

---

## 1) Quelles dépenses sont « hors budget » ?

L'article 44 du décret de 1967 liste les dépenses **non comprises** dans le budget prévisionnel :

| Catégorie | Exemples |
| --- | --- |
| Travaux de **conservation ou d'entretien** autres que la maintenance | Ravalement de façade, réfection de toiture, étanchéité |
| Travaux sur les **éléments d'équipement communs** autres que la maintenance | Remplacement de la chaudière, modernisation de l'ascenseur |
| Travaux d'**amélioration** | Pose d'un interphone, création d'un local vélos, isolation |
| **Études techniques** | Diagnostic technique global (DTG), audit énergétique, plan pluriannuel de travaux |

> 💡 **Maintenance vs travaux :** le **contrat d'entretien** de l'ascenseur (visites, petites pièces) = **budget** (614). Le **remplacement** de la machinerie = **travaux hors budget** (671).

## 2) Le circuit comptable des travaux votés

| Étape | Écriture | Débit | Crédit |
| --- | --- | --- | --- |
| ① L'AG vote les travaux et le **calendrier des appels** | — (aucune écriture) | | |
| ② **Appel de fonds travaux** à la date votée | Copropriétaires / Provisions travaux | **4502** | **702** |
| ③ **Encaissement** | Banque / Copropriétaires | 512 | 4502 |
| ④ **Facture** de l'entreprise (acompte, situation, solde) — **TTC** | Travaux décidés / Fournisseur | **671** | 401 |
| ⑤ **Paiement** de l'entreprise | Fournisseur / Banque | 401 | 512 |

**Clé de répartition :** celle prévue par la décision d'AG (souvent les **tantièmes généraux** pour un ravalement, les tantièmes **ascenseur** pour l'ascenseur…).

> ⚠️ **Travaux urgents (672)** : en cas d'urgence (fuite, péril), le syndic peut faire exécuter les travaux **sans vote préalable**, informer les copropriétaires et convoquer une AG. Il peut appeler une provision limitée (**1/3** du montant des travaux) sans attendre l'AG.

### 🧮 À vous : l'appel de fonds pour le ravalement

<div class="saisie" data-ex="cp-appel-travaux"></div>

### 🧮 À vous : la facture d'acompte de l'entreprise de ravalement

<div class="saisie" data-ex="cp-facture-travaux"></div>

## 3) Le fonds de travaux (loi ALUR → art. 14-2-1)

### Le principe
Depuis 2017, les copropriétés à destination (totale ou partielle) d'**habitation** doivent constituer un **fonds de travaux**, alimenté par une **cotisation annuelle obligatoire** des copropriétaires. Objectif : **épargner** pour financer les futurs travaux et éviter les appels massifs.

### Le montant minimum
| Situation | Cotisation annuelle minimum |
| --- | --- |
| Pas de plan pluriannuel de travaux (PPT) adopté | **5 % du budget prévisionnel** |
| PPT adopté | **2,5 % du montant des travaux prévus au PPT**, sans pouvoir être inférieur à **5 % du budget prévisionnel** |

L'AG peut voter un montant **supérieur** (majorité de l'article 25). Quand le fonds atteint un certain niveau (notamment le montant du budget prévisionnel), l'AG peut décider de **suspendre** les cotisations.

> 📌 **Dispenses** : elles existent (petites copropriétés sur décision unanime, diagnostic technique global ne révélant aucun besoin de travaux sur 10 ans…) mais leurs conditions ont évolué avec la loi Climat : **vérifiez le texte en vigueur** et la décision d'AG avant de supprimer la cotisation.

### Les règles à connaître
- La cotisation est **appelée** comme les provisions (en général chaque trimestre), répartie selon les **tantièmes généraux** (sauf autre clé votée).
- Les sommes sont versées sur un **compte bancaire séparé rémunéré** au nom du syndicat ; les **intérêts** sont acquis au syndicat (**716**).
- Les cotisations sont **attachées aux lots** et **définitivement acquises** au syndicat : **aucun remboursement** au vendeur lors de la vente d'un lot.
- Le fonds ne peut être utilisé **que sur décision de l'AG** (affectation à des travaux votés).

### 🧮 Simulateur : cotisation minimum au fonds de travaux

<div class="calc" data-calc="copro-fonds-travaux"></div>

## 4) Comptabiliser le fonds de travaux

| Opération | Débit | Crédit |
| --- | --- | --- |
| **Appel** de la cotisation | **4505** Copropriétaire — fonds de travaux | **105** Fonds de travaux |
| **Encaissement** | 512 (puis virement sur le compte rémunéré) | 4505 |
| **Affectation** par l'AG au financement de travaux votés | **105** Fonds de travaux | **705** Affectation du fonds de travaux |

> 💡 Pourquoi passer par **705** ? Parce que les travaux sont suivis dans le compte de gestion « travaux » : **charges 671** d'un côté, **financement** de l'autre (**702** appels + **705** fonds de travaux utilisé). Le chantier est équilibré quand 671 = 702 + 705 (+ subventions 711).

> ⚠️ **Contrôle de clôture :** le solde du compte **105** correspond aux cotisations **appelées**, pas forcément **encaissées**. Comparez-le au solde du **compte bancaire rémunéré** : l'écart doit s'expliquer par les **impayés** de cotisations.

### 🧮 À vous : l'appel trimestriel du fonds de travaux

<div class="saisie" data-ex="cp-ft-appel"></div>

### 🧮 À vous : l'AG affecte le fonds de travaux au ravalement

<div class="saisie" data-ex="cp-affect-ft"></div>

## 5) Cas complet : le ravalement de la Résidence Les Jacarandas

- L'AG vote un **ravalement de 24 000 € TTC**, clé **charges générales**.
- Financement : **4 800 €** pris sur le fonds de travaux + **19 200 €** appelés en **deux appels de 9 600 €**.
- Quote-part de DUPONT (180/1 000) par appel : 9 600 × 180 / 1 000 = **1 728 €**.

| Compte de gestion travaux | Montant |
| --- | --- |
| Charges 671 (factures de l'entreprise) | 24 000 |
| Financement 702 (deux appels) | 19 200 |
| Financement 705 (fonds de travaux affecté) | 4 800 |
| **Écart à répartir à la fin du chantier** | **0** |

> 🔁 Si le chantier coûte finalement **24 600 €** (avenant), l'écart de **600 €** sera **réparti** entre les copropriétaires (clé du ravalement) **après l'approbation des comptes** du chantier — exactement comme la régularisation des charges courantes.

## 6) Travaux non terminés à la clôture

Un chantier peut durer plus d'un exercice. À la clôture, on **ne répartit pas** un chantier en cours : l'écart entre les **appels** (702 / 705) et les **dépenses** (671) est conservé au compte **12 — Solde en attente sur travaux et opérations exceptionnelles**, et le chantier figure dans l'**annexe 5** (travaux votés non encore clôturés). La répartition définitive interviendra quand les travaux seront **terminés et leurs comptes approuvés**.

> 🔜 Leçon suivante : **clôture, régularisation des charges et annexes** de l'assemblée générale.
