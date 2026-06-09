# 1.5 — Les principes & particularités de la comptabilité française

Pour bien travailler pour des cabinets français, il faut comprendre **les règles du jeu** : les grands principes comptables (PCG) et ce qui rend la compta française **spécifique**.

## 📜 Les grands principes comptables (PCG actuel)
| Principe | Ce qu'il signifie en pratique |
|---|---|
| **Image fidèle** (régularité + sincérité) | Les comptes doivent refléter la réalité de l'entreprise, en respectant les règles. |
| **Continuité d'exploitation** | On suppose que l'entreprise poursuit son activité (sinon, autres règles d'évaluation). |
| **Indépendance des exercices** | Chaque charge/produit est rattaché à **son** exercice → d'où le **cut‑off** (FNP, FAE, CCA, PCA). |
| **Coûts historiques** | Les biens sont enregistrés à leur **coût d'acquisition**, pas à leur valeur de marché. |
| **Prudence** | On anticipe les **pertes probables** (provisions, dépréciations), jamais les gains incertains. |
| **Permanence des méthodes** | On garde les **mêmes méthodes** d'un exercice à l'autre (comparabilité). |
| **Non‑compensation** | On ne compense pas une dette avec une créance, ni une charge avec un produit. |
| **Comptabilité d'engagement** | On enregistre à la **facture** (et non au paiement) — ≠ comptabilité de trésorerie. |
| **Importance relative** | L'information significative doit apparaître clairement. |

> 💡 Ces principes guident **chaque décision** de saisie et de clôture : « à quel exercice rattacher ? », « faut‑il provisionner ? », etc.

## 🇫🇷 Ce qui rend la compta française **spécifique**
- **Le Plan Comptable Général (PCG)** : un plan de comptes **normalisé** par classes (1 à 7) — très codifié (chaque opération a « son » compte).
- **La TVA** très encadrée : taux multiples (20 / 10 / 5,5 / 2,1 %), règles de **déductibilité** strictes, déclarations **CA3 / CA12**.
- **La liasse fiscale** : passage du **résultat comptable au résultat fiscal** (réintégrations / déductions) — propre à la France.
- **Le FEC** (Fichier des Écritures Comptables) : format **obligatoire** et normalisé, exigé par l'administration.
- **Conservation 10 ans** des pièces (Code de commerce).
- **Le rôle de l'expert‑comptable** (Ordre des experts‑comptables) : il **valide et engage sa responsabilité** sur les comptes.
- Des **documents types** : Kbis, statuts, PV d'AG, liasse, plaquette…

## 🌍 TVA territoriale : intracommunautaire, export & ventes à distance

En cabinet, dès qu'une facture sort des frontières françaises, le réflexe « TVA 20 % » saute. **Quatre questions** déterminent le régime applicable :
1. **Nature** : bien ou service ?
2. **Client** : assujetti pro (B2B, avec n° TVA intra valide) ou particulier (B2C) ?
3. **Destination** : France, autre pays UE, ou hors UE ?
4. **Montant HT** (utile pour le seuil ventes à distance).

> 💡 Le mot-clé partout : **autoliquidation** (reverse charge). Quand l'opération est exonérée chez le vendeur FR, c'est le **client** qui « autoliquide » la TVA dans son pays. Aucune TVA ne transite, mais l'opération doit être **tracée** (mention de facture + déclarations spécifiques).

### 🔑 Vérifier le n° de TVA intracommunautaire (VIES)

Avant toute facturation B2B intra-UE en exonération, on **valide le n° de TVA intra du client** sur la base **VIES** (ec.europa.eu). Un n° invalide = exonération **refusée** par l'administration → la TVA française devient exigible. On conserve la **preuve de validation** dans le dossier.

### 1) Livraison intracommunautaire de biens (LIC) — vente B2B vers l'UE

**Régime : exonération de TVA française** (art. **262 ter, I du CGI**), à 3 conditions cumulatives :
- le client est un **assujetti** identifié à la TVA dans un autre État membre (n° intra valide VIES),
- le bien est **physiquement expédié/transporté** hors de France (preuves de transport conservées),
- le **n° de TVA du client figure** sur la facture.

**Mention de facture obligatoire** : « *Exonération de TVA, article 262 ter, I du CGI* » + n° de TVA intra du vendeur **et** du client.

**Le client UE autoliquide** la TVA (acquisition intracommunautaire) dans son pays.

**Comptabilisation (vente HT, pas de TVA collectée FR) :**

| Compte | Libellé | Débit | Crédit |
|---|---|---|---|
| 411 | Clients | montant HT | |
| 707 | Ventes de marchandises (ou 701) | | montant HT |

**Obligations déclaratives** (depuis janvier 2022, la DEB est scindée en deux) :
- **État récapitulatif TVA** (fiscal, obligatoire pour **toute** LIC) : liste clients + montants, déposé sur le service en ligne **DEBWEB2** au plus tard le **10e jour ouvrable** du mois suivant.
- **EMEBI** (enquête statistique mensuelle) : due **uniquement si l'entreprise est interrogée** par la douane (au-dessus du seuil statistique).

**CA3** : la LIC va en **ligne 06 « Livraisons intracommunautaires »** (cadre opérations non imposables / exonérées) — montant HT, **pas de TVA**.

### 2) Acquisition intracommunautaire de biens (AIC) — achat B2B auprès de l'UE

L'entreprise FR achète un bien auprès d'un fournisseur UE → **autoliquidation** par l'acheteur (art. 256 bis CGI). Le fournisseur facture **HT** (sa LIC est exonérée chez lui) ; l'acheteur FR **collecte ET déduit** la même TVA → **opération neutre en trésorerie**.

**Comptabilisation (achat 1 000 € HT, TVA 20 %) :**

| Compte | Libellé | Débit | Crédit |
|---|---|---|---|
| 607 (ou 6xx) | Achats de marchandises | 1 000 | |
| 445662 | TVA déductible sur acquisitions intracom. | 200 | |
| 4452 | TVA due intracommunautaire | | 200 |
| 401 | Fournisseurs | | 1 000 |

**CA3** : base **ligne 03 « Acquisitions intracommunautaires »** → la TVA collectée remonte en **ligne 17** ; la TVA déductible est portée en **ligne 20** (ou 19 si immobilisation). Les deux s'annulent.

> ⚠️ Si le fournisseur UE a quand même facturé de la TVA étrangère (n° intra FR non communiqué), **on n'autoliquide pas sur cette TVA** : on régularise avec le fournisseur. L'autoliquidation se fait **toujours sur le montant HT**.

### 3) Prestation de services B2B intra-UE (preneur redevable)

**Règle générale (art. 259-1° CGI)** : pour un service B2B, le lieu d'imposition est **le pays du preneur**. Un prestataire FR qui facture un client assujetti UE **ne facture pas de TVA française** → le **preneur** est redevable et **autoliquide** chez lui.

**Mention de facture** : « *Autoliquidation* » (art. 283-2 CGI / art. 196 directive 2006/112/CE) + n° de TVA intra des deux parties.

**Comptabilisation côté prestataire FR (vente de service 2 000 € HT) :**

| Compte | Libellé | Débit | Crédit |
|---|---|---|---|
| 411 | Clients | 2 000 | |
| 706 | Prestations de services | | 2 000 |

**Déclaration spécifique** : **DES** (Déclaration Européenne de Services) — distincte de l'état récapitulatif des biens — déposée sur **DEBWEB2** au plus tard le **10e jour ouvrable** du mois suivant. **CA3** : ligne **05 « Autres opérations non imposables »** (HT, sans TVA).

> 💡 Sens inverse (service acheté à un prestataire UE) : l'entreprise FR **autoliquide** comme pour une AIC → 445662 au débit, **44566 ou 4452** au crédit selon le paramétrage, base en **ligne 2A « Achats de prestations de services intracom. »** de la CA3.

### 4) Exportations de biens hors UE & services hors UE

**Exportation de biens (vers pays tiers)** : **exonération** (art. **262, I du CGI**), sous preuve de sortie du territoire de l'UE (**DAU / document douanier électronique visé**). Peu importe que le client soit pro ou particulier.

**Mention de facture** : « *Exonération de TVA, article 262, I du CGI* ».

**Comptabilisation** : 411 au débit / **707 (ou 701)** au crédit, **HT, sans TVA**. **CA3** : **ligne 04 « Exportations hors UE »** (HT). Pas d'EMEBI ni d'état récapitulatif (formalités **douanières d'export** à la place).

**Services hors UE B2B** : même logique que l'intra (art. 259-1°), service **hors champ** TVA FR, **sans DES** (la DES ne vise que l'UE). CA3 ligne 05.

### 5) Ventes à distance de biens B2C (particuliers UE) — guichet OSS

Vente de biens à des **particuliers** d'autres pays UE (e-commerce). Règle depuis le **1er juillet 2021** :

- **Seuil unique UE de 10 000 € HT / an** (toutes ventes à distance B2C + services électroniques B2C **cumulés**, tous pays UE confondus).
- **Sous 10 000 €** : TVA **française** (taux FR), comme une vente locale.
- **Au-dessus de 10 000 €** : TVA **du pays de destination** (taux local du client). Deux options :
  - s'immatriculer à la TVA dans **chaque** pays de consommation, **ou**
  - utiliser le **guichet unique OSS** (One-Stop-Shop) : une **seule déclaration trimestrielle** centralise la TVA due dans tous les pays UE, payée à la DGFiP qui reverse aux États.

**IOSS** (Import One-Stop-Shop) : variante pour les **biens importés de pays tiers** en envois **≤ 150 €** vendus à des particuliers UE.

> ⚠️ Le **CA déclaré via l'OSS ne figure pas sur la CA3** classique (déclaration OSS séparée). En compta, la TVA OSS étrangère se ventile par pays (sous-comptes de **4457x**). Sous le seuil, la vente B2C UE reste une **vente franco-française** ordinaire (TVA 20 % en ligne 01, compte 44571).

### 🧭 Tableau de synthèse

| Opération | Régime TVA FR | Mention facture | CA3 | Déclaration annexe |
|---|---|---|---|---|
| Bien → assujetti UE (LIC) | Exonéré 262 ter I | « Exonération art. 262 ter, I CGI » | L. 06 | État récap. TVA (+EMEBI si interrogé) |
| Bien ← fournisseur UE (AIC) | Autoliquidation FR | (facture frs HT) | L. 03 + 17 + 20 | — |
| Service B2B → assujetti UE | Hors champ (preneur redevable) | « Autoliquidation » | L. 05 | DES |
| Service B2B ← prestataire UE | Autoliquidation FR | (facture HT) | L. 2A + 17 + 20 | — |
| Bien → hors UE (export) | Exonéré 262 I | « Exonération art. 262, I CGI » | L. 04 | Déclaration douanière export |
| Bien B2C UE < 10 000 € | TVA FR (20 %…) | TVA FR normale | L. 01 | — |
| Bien B2C UE > 10 000 € | TVA pays destination | TVA locale | hors CA3 | OSS (trimestriel) |

### 🧮 EXEMPLE CONCRET — à saisir vous-même dans le journal

> 🇲🇬 **À lire d'abord.** Avant, on vous donnait l'écriture toute faite. Maintenant **c'est vous qui la saisissez** dans le **journal interactif** (comme dans le vrai logiciel), puis vous cliquez sur **« ✓ Vérifier l'écriture »**. Bloqué ? Ouvrez le **tutoriel 📘** ou cliquez sur **« 👁 Corrigé »**. On apprend en faisant.

Le cabinet s'occupe de **SARL TechPro**, une entreprise française qui **vend du matériel informatique**. En mars 2026, il y a **4 opérations**. On va saisir les 3 premières.

#### 🅰️ Opération A — Vendre un bien à une entreprise d'Allemagne

**En mots simples :** TechPro vend des serveurs (**5 000 €**) à une **entreprise** allemande qui a un **numéro de TVA valide**.
👉 **Règle :** quand on **vend un bien à une entreprise d'un autre pays de l'UE**, on **ne met pas de TVA** sur la facture (on dit que c'est **exonéré**). C'est le client allemand qui paiera la TVA chez lui.

<div class="saisie" data-ex="techpro-a"></div>

#### 🅱️ Opération B — Acheter à un fournisseur d'Italie (autoliquidation)

**En mots simples :** TechPro achète des composants (**3 000 €**) à un fournisseur italien. La facture italienne est **sans TVA**.
👉 **Règle :** l'État français veut quand même « voir » la TVA. On la calcule nous-mêmes (**3 000 × 20 % = 600 €**) et on l'écrit **deux fois** : une fois **« à payer »** et une fois **« à récupérer »**. Les deux **s'annulent** → **on ne paie rien de plus**. Ce mécanisme s'appelle l'**autoliquidation**.

<div class="saisie" data-ex="techpro-b"></div>

#### 🅲 Opération C — Vendre un service à l'entreprise allemande

**En mots simples :** TechPro facture une **installation à distance** (**2 000 €**) à l'entreprise allemande.
👉 **Règle :** pour un **service vendu à une entreprise de l'UE**, c'est comme pour un bien : **0 € de TVA** sur notre facture (mention « Autoliquidation »). Le client s'en occupe chez lui.

<div class="saisie" data-ex="techpro-c"></div>

#### 🅳 Opération D — Vendre à des particuliers (pas une entreprise)

**En mots simples :** TechPro vend des claviers en ligne à des **particuliers** (des gens, pas des entreprises) en Belgique et en Espagne : **12 000 €** sur l'année.
👉 **Règle :** dès qu'on dépasse **10 000 € / an** de ventes vers des particuliers de l'UE, on applique **la TVA du pays du client** (ex. Belgique = 21 %) et on la déclare dans un guichet spécial, l'**OSS**. *(Pas d'écriture à saisir ici : ce flux se déclare à part, pas sur la CA3 française.)*

---

**🧾 Et sur la déclaration de TVA (CA3) du mois, ça donne quoi ?**

| Ligne CA3 | Opération | Base HT | TVA |
|---|---|---|---|
| 06 | Vente de bien à une entreprise UE (A) | 5 000 € | — |
| 05 | Service vendu à une entreprise UE (C) | 2 000 € | — |
| 03 | Achat à une entreprise UE (B) | 3 000 € | — |
| 17 | TVA « à payer » sur l'achat UE (B) | | 600 € |
| 20 | TVA « à récupérer » sur l'achat UE (B) | | 600 € |

→ **TVA à payer pour ces opérations = 0 €** (l'achat UE s'autoliquide ; les ventes UE sont exonérées). La TVA belge des particuliers (≈ 210 € pour 1 000 € vendus) se paie **à part**, via l'**OSS**.

> ✅ **À retenir — 3 questions simples** avant de choisir le traitement :
> 1. **QUI** est le client ? → une **entreprise** (avec n° de TVA) ou un **particulier** ?
> 2. **QUOI** ? → un **bien** ou un **service** ?
> 3. **OÙ** est-il ? → en **France**, dans l'**UE**, ou **hors UE** ?
>
> 👉 Entreprise UE (bien **ou** service) = **0 € de TVA** chez nous (le client autoliquide). · Particulier UE = TVA du **pays d'arrivée** via **OSS** (après 10 000 €/an). · Hors UE = **export exonéré** (avec preuve de sortie).

<div class="calc" data-calc="tva-terr"></div>

## 🚗 Les indemnités kilométriques : barème fiscal des frais de voiture

Le **barème kilométrique** (BK) est un barème forfaitaire publié chaque année par l'administration fiscale. Il permet d'évaluer le coût d'utilisation d'un véhicule **personnel** pour des déplacements **professionnels**, sans avoir à justifier les frais réels poste par poste (carburant, entretien, assurance, dépréciation, pneus…). En cabinet, c'est l'outil de référence pour deux usages quotidiens : la **note de frais** d'un dirigeant ou d'un salarié, et l'option **frais réels** d'un salarié sur sa déclaration de revenus.

> 💡 Le barème **couvre** : dépréciation du véhicule, entretien/réparations, pneumatiques, carburant, primes d'assurance. Il **ne couvre PAS** : frais de péage, de parking et **intérêts d'emprunt** (achat à crédit du véhicule) — ces frais s'ajoutent en plus, au réel, au prorata professionnel.

### 🔑 Les notions de base
- **Puissance fiscale (CV)** : indiquée sur la carte grise (case **P.6**). Le barème est plafonné à **7 CV et plus** (au-delà, on applique toujours la ligne « 7 CV et plus »).
- **Distance annuelle (d)** : kilométrage **professionnel** parcouru dans l'année avec le véhicule. Trois tranches : **≤ 5 000 km**, **5 001 à 20 000 km**, **> 20 000 km**.
- **Le véhicule** doit appartenir au contribuable (ou à son foyer fiscal) — pour un salarié en frais réels — ou être le véhicule **personnel** du dirigeant utilisé pour la société.

### 📊 Barème kilométrique voitures — barème 2026 (revenus 2025)
*d = distance professionnelle annuelle en km. Barème non revalorisé depuis 2023 → identique en 2024, 2025 et 2026.*

| Puissance fiscale | Jusqu'à 5 000 km | De 5 001 à 20 000 km | Au-delà de 20 000 km |
|---|---|---|---|
| **3 CV et moins** | d × 0,529 | (d × 0,316) + 1 065 | d × 0,370 |
| **4 CV** | d × 0,606 | (d × 0,340) + 1 330 | d × 0,407 |
| **5 CV** | d × 0,636 | (d × 0,357) + 1 395 | d × 0,427 |
| **6 CV** | d × 0,665 | (d × 0,374) + 1 457 | d × 0,447 |
| **7 CV et plus** | d × 0,697 | (d × 0,394) + 1 515 | d × 0,470 |

> ⚡ **Véhicules 100 % électriques** : le montant obtenu via le barème ci-dessus est **majoré de +20 %** (on multiplie le résultat par **1,20**). Cette majoration ne concerne **pas** les hybrides ni les véhicules thermiques/hydrogène — uniquement le 100 % électrique.

**À quoi sert le montant fixe de la tranche du milieu ?** Pour la tranche 5 001–20 000 km, la formule comprend une **partie fixe** (ex. 1 395 € en 5 CV) qui « lisse » le passage de tranche : elle évite qu'un kilomètre supplémentaire au-delà de 5 000 km fasse chuter brutalement l'indemnité. C'est une formule affine, pas un simple coefficient.

### 🏢 L'usage en cabinet
**1) Note de frais du dirigeant (le cas le plus fréquent)**
Le gérant/président utilise sa voiture **personnelle** pour la société (RDV clients, fournisseurs, banque, déplacements professionnels). On établit un **état kilométrique** (date, trajet, objet, km), on applique le barème et la société **rembourse** le dirigeant. Pour la société, c'est une **charge déductible** ; pour le dirigeant, le remboursement n'est **pas imposable** (c'est un remboursement de frais réellement engagés, justifié).

**2) Note de frais du salarié**
Même logique : le salarié avance des déplacements pro avec sa voiture, l'employeur rembourse selon barème. Le remboursement est **exonéré** de cotisations sociales et d'impôt dans la limite du barème (URSSAF admet le barème fiscal comme plafond).

**3) Frais réels du salarié (déclaration d'impôt)**
Le salarié peut **renoncer** à la déduction forfaitaire de 10 % et opter pour les **frais réels** : il déduit alors notamment ses frais kilométriques domicile-travail (en principe **un aller-retour/jour, dans la limite de 40 km** de trajet simple, sauf circonstances particulières justifiées). Le cabinet calcule l'option la plus avantageuse (réels vs 10 %).

> ⚠️ **Pièces justificatives indispensables** : copie de la **carte grise** (au nom du bénéficiaire), un **état détaillé** des déplacements (date, motif, trajet, km), et idéalement une **note de frais** mensuelle signée. Sans justificatif, le remboursement risque d'être requalifié en **rémunération** (charges sociales + impôt).

### 🧾 Le traitement comptable
Deux schémas selon **qui** engage la dépense.

**Cas A — Indemnités kilométriques du dirigeant (véhicule personnel)**
La société constate la charge en contrepartie du **compte courant d'associé** (la dette envers le dirigeant), puis solde par le paiement.

| Compte | Libellé | Débit | Crédit |
|---|---|---|---|
| **625100** | Voyages et déplacements (ou frais kilométriques) | X | |
| **455000** *(ou 108)* | Compte courant d'associé / Compte de l'exploitant | | X |

> 📌 **455 vs 108** : en **société** (SARL/SAS…), on utilise le **compte courant d'associé 455** (ou 4551/4552). En **entreprise individuelle / BNC**, le dirigeant n'a pas de compte courant : on emploie le **compte 108 « Compte de l'exploitant »**. Au paiement : **455/108 → 512 Banque**.

**Cas B — Remboursement de frais à un salarié**
La note de frais transite généralement par le compte **421 « Personnel – rémunérations dues »** ou directement par la banque si remboursement immédiat :

| Compte | Libellé | Débit | Crédit |
|---|---|---|---|
| **625100** | Voyages et déplacements | X | |
| **421000** *(ou 512)* | Personnel – rémunérations dues / Banque | | X |

**Quel compte de charge ? 625100 ou 625600 ?**
- **625100 — Voyages et déplacements** : compte le plus large, utilisé en pratique pour les **indemnités kilométriques** et déplacements professionnels. C'est le choix courant en cabinet.
- **625600 — Missions** : frais de mission (déplacements + repas/hébergement liés à une mission). Certains cabinets ventilent les IK en 625100 et les frais de mission « tout compris » en 625600.
- 🔎 L'essentiel est la **cohérence** du plan comptable du client d'un exercice à l'autre (principe de **permanence des méthodes**, vu en 1.5).

> 💡 **TVA** : les indemnités kilométriques calculées au barème **n'ouvrent pas droit à déduction de TVA** (le barème est un forfait, sans facture de carburant individualisée). Pour récupérer la TVA sur le carburant, il faut passer par les **frais réels** avec factures — autre logique de saisie.

### 🧮 EXEMPLE CHIFFRÉ DÉTAILLÉ
**Contexte :** M. Martin, gérant de SARL, utilise sa voiture **personnelle 6 CV** (thermique) pour la société. Sur l'année 2025, il a parcouru **8 400 km** à titre professionnel. Le cabinet établit l'indemnité de fin d'année.

**Étape 1 — Identifier la tranche.** 8 400 km → tranche **5 001 à 20 000 km**.

**Étape 2 — Appliquer la formule 6 CV de cette tranche :** (d × 0,374) + 1 457
- (8 400 × 0,374) + 1 457 = 3 141,60 + 1 457 = **4 598,60 €**

**Étape 3 — Véhicule électrique ?** Non (thermique) → **pas de majoration**.
👉 **Indemnité kilométrique = 4 598,60 €**

**Variante — même cas mais véhicule 100 % électrique :**
- 4 598,60 × 1,20 = **5 518,32 €**

**Écriture comptable (SARL, véhicule thermique, 4 598,60 €) :**

| Compte | Libellé | Débit | Crédit |
|---|---|---|---|
| 625100 | Voyages et déplacements – IK gérant 2025 | 4 598,60 | |
| 455000 | Compte courant d'associé – M. Martin | | 4 598,60 |

Lors du remboursement par virement :

| Compte | Libellé | Débit | Crédit |
|---|---|---|---|
| 455000 | Compte courant d'associé – M. Martin | 4 598,60 | |
| 512000 | Banque | | 4 598,60 |

> ✅ **Réflexe cabinet** : toujours vérifier la **puissance sur la carte grise (case P.6)**, additionner le **kilométrage pro de l'année** pour caler la bonne tranche, appliquer la **majoration de 20 %** si électrique, et **conserver l'état kilométrique** justificatif. Charge en **625100**, contrepartie **455** (société) ou **108** (entreprise individuelle).

> 📅 *Chiffres à jour au barème **2026 applicable aux revenus 2025** (déclaration 2026). Barème **non revalorisé** depuis 2023 → vérifier chaque printemps la parution de l'arrêté annuel sur impots.gouv.fr / BOFiP, car les coefficients peuvent évoluer.*

<div class="calc" data-calc="ik"></div>

## 🚗 Les taxes sur l'affectation des véhicules de tourisme (ex‑TVS)

Depuis le **1ᵉʳ janvier 2022**, l'ancienne **TVS** (Taxe sur les Véhicules de Société) a disparu en tant que taxe unique. Elle est remplacée par **deux taxes annuelles distinctes et cumulatives**, codifiées dans le **CIBS** (Code des impositions sur les biens et services, art. **L.421‑93 et suivants**) :

1. **La taxe annuelle sur les émissions de CO2** (barème au g/km, méthode WLTP) ;
2. **La taxe annuelle sur les émissions de polluants atmosphériques** (forfait selon la catégorie de motorisation, inspiré des vignettes Crit'Air).

> 💡 En cabinet, on continue souvent de dire « la TVS » par habitude. Mais sur la liasse et dans les écritures, on parle bien de **deux taxes** : il faut calculer les deux séparément puis additionner.

### 👤 Qui est redevable ?

Sont redevables les **entreprises** (le plus souvent les **sociétés**) qui **affectent à des fins économiques** des véhicules de tourisme, c'est‑à‑dire qui :
- **détiennent** un véhicule de tourisme immatriculé en France (en pleine propriété) ; **ou**
- **disposent** d'un véhicule dans le cadre d'une **location de longue durée** (LLD/LOA > 30 jours consécutifs) ; **ou**
- **prennent en charge les frais** d'un véhicule (ex. : **remboursement d'indemnités kilométriques** à un salarié/dirigeant pour son véhicule personnel).

> ⚠️ Piège fréquent : un **gérant qui se fait rembourser des frais kilométriques** avec son véhicule perso peut rendre la **société redevable** au‑delà d'un certain kilométrage (coefficient pondéré + abattement de 15 000 €). À ne pas oublier en révision.

### 🚙 Quels véhicules sont concernés ?

| Catégorie | Concerné ? |
|---|---|
| **M1** (voitures particulières) | ✅ Oui |
| **N1** « camion pick‑up » à ≥ 5 places, ou avec ≥ 3 rangs de sièges | ✅ Oui |
| Véhicules **utilitaires** (fourgon, camionnette N1 sans places arrière) | ❌ Non |
| **2 roues**, engins agricoles | ❌ Non |

### 📅 Période, déclaration et paiement

- **Période d'imposition = année civile** (du 1ᵉʳ janvier au 31 décembre).
- **Déclaration l'année suivante** : pour 2025, dépôt **en janvier 2026**.
- **Support déclaratif** :
  - Redevables **TVA au réel normal** → annexe **n° 3310‑A‑SD** à la CA3 (janvier) ;
  - Redevables **TVA au réel simplifié** → formulaire **n° 3517** (au plus tard début mai) ;
  - **Non redevables de la TVA** → formulaire **n° 3310‑A‑SD** (janvier).
- Une **fiche d'aide au calcul n° 2858‑FC‑SD** est publiée chaque année sur impots.gouv.fr.

> 💡 L'entreprise doit aussi tenir un **état récapitulatif annuel** des véhicules affectés, **même pour les véhicules exonérés** (notamment les électriques) — il doit pouvoir être présenté en cas de contrôle.

### 1️⃣ Taxe annuelle sur les émissions de CO2 — barème WLTP 2025

Barème **progressif et marginal par tranches** (comme l'IR) : on découpe les émissions en fractions et on applique à chaque fraction son tarif marginal, puis on additionne.

| Fraction des émissions (g/km, WLTP) | Tarif marginal (€/g) |
|---|---|
| Jusqu'à 9 | 0 |
| De 10 à 50 | 1 |
| De 51 à 58 | 2 |
| De 59 à 90 | 3 |
| De 91 à 110 | 4 |
| De 111 à 130 | 10 |
| De 131 à 150 | 50 |
| De 151 à 170 | 60 |
| À partir de 171 | 65 |

*Source : art. L.421‑120 du CIBS, barème en vigueur du 01/01/2025 au 31/12/2025 (renforcement programmé chaque année jusqu'en 2027).*

> ⚠️ Pour les véhicules **anciens** (1ʳᵉ immatriculation **avant le 1ᵉʳ mars 2020** ou réception **NEDC/hors UE**), on n'utilise PAS le barème WLTP : on applique le **barème selon la puissance administrative (CV fiscaux)** — forfait par tranche : ≤ 3 CV = 1 750 € ; 4‑6 CV = 2 500 € ; 7‑10 CV = 4 250 € ; 11‑15 CV = 5 000 € ; ≥ 16 CV = 6 250 €.

**Exonérations de la taxe CO2 :**
- **Véhicules 100 % électriques** ou à **hydrogène** (émissions = 0) → **exonérés** (taxe CO2 = 0 €) ;
- **Abattement E85** : pour les véhicules roulant **au superéthanol E85**, abattement de **40 % sur les émissions de CO2** (et **‑2 CV** sur la base PA), sauf émissions > 250 g/km ;
- Exonérations liées à l'**activité** : véhicules destinés à la **location**, au **transport public** de personnes, à l'**enseignement de la conduite**, aux **compétitions sportives**, ou à un **usage agricole**.

### 2️⃣ Taxe annuelle sur les émissions de polluants atmosphériques — barème 2025

Forfait annuel selon la **catégorie de motorisation** (logique Crit'Air) :

| Catégorie | Critère | Tarif annuel |
|---|---|---|
| **E** | 100 % **électrique** / **hydrogène** | **0 €** |
| **1** | **Essence**, **hybride** ou gaz, conforme aux normes **Euro 5 et Euro 6** | **100 €** |
| **Polluants** | Tous les autres : **diesel**, véhicules anciens, non classés Crit'Air | **500 €** |

*Source : art. L.421‑137 du CIBS, barème 2025.*

> ⚠️ Le **diesel** est quasi systématiquement dans la catégorie « **polluants » à 500 €**, même récent. C'est la motorisation la plus pénalisée par cette seconde taxe.

### 🧮 Le calcul au prorata

Chaque taxe est due **au prorata de la durée d'affectation** du véhicule dans l'année :

> **Taxe due = Tarif annuel × (Nombre de jours d'affectation ÷ 365)**

- On compte les **jours de disponibilité** pour l'activité (peu importe les km parcourus ou les jours à l'arrêt) ;
- Pour une **acquisition ou cession en cours d'année**, on proratise sur la fraction de jours concernée ;
- Pour les **locations courtes** et les **remboursements de frais kilométriques**, un **coefficient pondéré** (barème de réfaction selon les km) s'applique, avec un **abattement de 15 000 €** sur le montant total.

### 📒 Traitement comptable et fiscal

**Comptabilisation de la charge** (à la clôture, en charge à payer puis au paiement) :

| Compte | Libellé |
|---|---|
| **63512** | Taxes sur les véhicules de société (sous‑compte dédié, le plus courant) |
| **6358** | Autres droits et impôts (variante selon le plan de comptes du cabinet) |
| **447** | État – autres impôts, taxes et versements assimilés (contrepartie / dette) |
| **512** | Banque (au paiement) |

**Écriture type (constatation de la charge) :**
- Débit **63512** « Taxes sur les véhicules de société »
- Crédit **447** « État – autres impôts et taxes »

> 💡 Beaucoup de cabinets ouvrent un **63512** par taxe (CO2 / polluants) pour faciliter la révision et le contrôle du calcul.

**⚠️ Déductibilité du résultat — LE point de vigilance :**

| Forme juridique | Déductible du résultat fiscal ? |
|---|---|
| **Société à l'IS** | **❌ NON déductible** → **réintégration extra‑comptable** sur la liasse (tableau 2058‑A) |
| **Entreprise à l'IR** (BIC/BNC : EI, EURL IR, SNC…) | **✅ Déductible** (charge d'exploitation normale) |

> ⚠️ Pour une **société à l'IS**, la charge est bien **comptabilisée en 63512** mais doit être **réintégrée** au résultat fiscal (art. 39 du CGI). Oublier cette réintégration est une **erreur classique** qui fausse le résultat fiscal et l'IS.

### 💼 EXEMPLE CHIFFRÉ détaillé

**Contexte.** La SARL **MARTIN** (soumise à l'**IS**) détient une **voiture de fonction essence**, immatriculée le **1ᵉʳ avril 2025**, émettant **130 g/km de CO2** (WLTP), conforme à la norme **Euro 6**. Calculons les deux taxes dues au titre de **2025**.

**Étape 1 — Taxe CO2 (barème WLTP marginal) pour 130 g/km :**

| Fraction | Calcul | Montant |
|---|---|---|
| 0 → 9 g | 9 × 0 | 0 € |
| 10 → 50 g | (50 − 9) × 1 | 41 € |
| 51 → 58 g | (58 − 50) × 2 | 16 € |
| 59 → 90 g | (90 − 58) × 3 | 96 € |
| 91 → 110 g | (110 − 90) × 4 | 80 € |
| 111 → 130 g | (130 − 110) × 10 | 200 € |
| **Total tarif annuel CO2** | | **433 €** |

**Étape 2 — Taxe polluants atmosphériques :**
Véhicule **essence Euro 6** → **catégorie 1** → tarif annuel = **100 €**.

**Étape 3 — Prorata d'affectation.**
Véhicule disponible du **1ᵉʳ avril au 31 décembre 2025**, soit **275 jours** sur 365.
Coefficient = 275 ÷ 365 = **0,7534**.

- Taxe CO2 proratisée = 433 € × 0,7534 = **326,24 €** ≈ **326 €**
- Taxe polluants proratisée = 100 € × 0,7534 = 75,34 € ≈ **75 €**

**Étape 4 — Total dû au titre de 2025 :**
> **326 € + 75 € = 401 €** (arrondi)

**Étape 5 — Comptabilisation (charge à payer au 31/12/2025) :**
- Débit **63512** « Taxes sur les véhicules de société » : **401 €**
- Crédit **447** « État – autres impôts et taxes » : **401 €**

**Étape 6 — Retraitement fiscal (société à l'IS) :**
La SARL MARTIN étant à l'**IS**, ces **401 €** sont **non déductibles** → **réintégration extra‑comptable de 401 €** sur le tableau **2058‑A** de la liasse fiscale.

> 💡 Si la même voiture avait été **100 % électrique** : taxe CO2 = **0 €** (exonérée) **et** taxe polluants = **0 €** (catégorie E) → **aucune taxe**, mais le véhicule doit quand même figurer sur l'**état récapitulatif annuel**.

### ✅ À retenir
- **Deux taxes** depuis 2022 : **CO2** (barème WLTP marginal) **+ polluants** (forfait 0 / 100 / 500 €).
- **Électrique / hydrogène = exonéré** des deux taxes (mais à déclarer dans l'état récapitulatif).
- Calcul **au prorata des jours** d'affectation ÷ 365.
- Comptabilisation en **63512** (ou 6358).
- **Non déductible à l'IS** (réintégration) — **déductible à l'IR**.

> 📌 *Barèmes à jour au titre de l'année 2025 (déclarés en janvier 2026). Sources : CIBS art. L.421‑93 s., BOI‑AIS‑MOB‑10‑30‑20. Vérifier le millésime de la fiche 2858‑FC‑SD chaque année (renforcement du barème CO2 programmé jusqu'en 2027).*

<div class="calc" data-calc="tvs"></div>

## ✅ À retenir
- La compta française est **codifiée et fiscalisée** : on suit le PCG + des règles fiscales précises.
- Les **principes** (prudence, indépendance des exercices…) se traduisent par des **écritures concrètes** (provisions, cut‑off).
- Maîtriser ces fondamentaux = parler le **même langage** qu'un cabinet français.
