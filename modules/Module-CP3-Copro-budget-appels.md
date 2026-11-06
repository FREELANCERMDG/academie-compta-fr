# 7.3 — 📋 Budget prévisionnel, tantièmes et appels de fonds

Toute la vie financière d'une copropriété part d'un document : le **budget prévisionnel** voté par l'AG. Il est ensuite **découpé** entre les copropriétaires grâce aux **tantièmes**, puis **appelé** par trimestre.

## 🎯 Objectifs pédagogiques
- Savoir ce que contient (et ne contient pas) le **budget prévisionnel**.
- Distinguer **charges générales** et **charges spéciales**, et leurs **clés de répartition**.
- **Calculer la quote-part** d'un lot et le montant d'un **appel de fonds**.
- **Comptabiliser** un appel de provisions et son encaissement.

---

## 1) Le budget prévisionnel (art. 14-1 de la loi de 1965)

- Il couvre les **dépenses courantes** de **maintenance**, de **fonctionnement** et d'**administration** des parties communes et équipements communs : eau, électricité, nettoyage, contrats d'entretien, assurance, honoraires du syndic, salaire du gardien…
- Il est **voté chaque année par l'AG** (majorité de l'article 24), **avant le début** de l'exercice qu'il concerne.
- Les copropriétaires versent des **provisions égales au quart** du budget voté, **exigibles le 1ᵉʳ jour de chaque trimestre** (sauf modalités différentes votées par l'AG, par exemple des appels mensuels).
- Si le budget n'a pas pu être voté, le syndic peut appeler des provisions sur la base du **dernier budget voté**.

> ❌ **Ne sont pas dans le budget** : les **travaux** autres que la maintenance (ravalement, remplacement de chaudière, étanchéité de toiture…), les **études techniques** et diagnostics. Ils sont votés **à part** et appelés **à part** (leçon 7.4).

## 2) Charges générales et charges spéciales (art. 10)

| Type | Définition | Clé de répartition | Exemples |
| --- | --- | --- | --- |
| **Charges générales** | Conservation, entretien et administration des **parties communes** | **Tantièmes généraux** (valeur relative de chaque lot) | Assurance, nettoyage, honoraires du syndic, toiture |
| **Charges spéciales** | Services collectifs et **équipements communs** | Selon l'**utilité** objective de l'équipement pour chaque lot | Ascenseur, chauffage collectif, eau froide (compteurs), interphone |

> 💡 **L'utilité, pas l'usage :** un copropriétaire du 3ᵉ étage qui prend toujours l'escalier **paie quand même l'ascenseur** — l'équipement lui est **utile**. À l'inverse, le lot commercial du rez-de-chaussée sans accès à l'ascenseur est généralement **exonéré** (0 tantième ascenseur).

Les **clés de répartition** sont fixées par le **règlement de copropriété**. Le comptable ne les invente jamais : il les **paramètre** dans le logiciel à partir du règlement.

## 3) Calculer la quote-part d'un lot

> **Quote-part du lot = Montant de la clé × Tantièmes du lot ÷ Total des tantièmes de la clé**

### 🏢 Cas fil rouge : Résidence Les Jacarandas (6 lots)

| Lot | Copropriétaire | Étage | Tantièmes généraux (/1 000) | Tantièmes ascenseur (/1 000) |
| --- | --- | --- | --- | --- |
| 1 | SCI BERNARD (commerce) | RDC | 160 | 0 |
| 2 | DUPONT | 1ᵉʳ | 180 | 140 |
| 3 | MARTIN | 1ᵉʳ | 150 | 120 |
| 4 | PETIT | 2ᵉ | 170 | 230 |
| 5 | DURAND | 2ᵉ | 140 | 190 |
| 6 | LEROY | 3ᵉ | 200 | 320 |
| | **Total** | | **1 000** | **1 000** |

**Budget prévisionnel N voté : 24 000 €** → charges générales **20 000 €** + ascenseur **4 000 €**.

**Appel trimestriel (¼)** : générales 5 000 € + ascenseur 1 000 € = **6 000 €**.

| Lot | Générales (5 000 × tg/1 000) | Ascenseur (1 000 × ta/1 000) | **Appel du trimestre** |
| --- | --- | --- | --- |
| 1 — SCI BERNARD | 800,00 | 0,00 | **800,00** |
| 2 — DUPONT | 900,00 | 140,00 | **1 040,00** |
| 3 — MARTIN | 750,00 | 120,00 | **870,00** |
| 4 — PETIT | 850,00 | 230,00 | **1 080,00** |
| 5 — DURAND | 700,00 | 190,00 | **890,00** |
| 6 — LEROY | 1 000,00 | 320,00 | **1 320,00** |
| **Total** | **5 000,00** | **1 000,00** | **6 000,00** |

> ✅ **Contrôle systématique :** la somme des appels individuels doit être **exactement égale** au quart du budget. Un écart = une erreur de tantièmes dans le logiciel.

### 🧮 Simulateur : quote-part et appel de fonds d'un lot

<div class="calc" data-calc="copro-tantiemes"></div>

## 4) Comptabiliser l'appel de fonds

Le **1ᵉʳ jour du trimestre**, le syndic émet un **avis d'appel de fonds** à chaque copropriétaire. En comptabilité d'engagement, la créance naît **à l'exigibilité**, que le copropriétaire paie ou non.

| Compte | Libellé | Débit | Crédit |
| --- | --- | --- | --- |
| 4501 — SCI BERNARD | Appel T1 budget | 800,00 | |
| 4501 — DUPONT | Appel T1 budget | 1 040,00 | |
| 4501 — MARTIN | Appel T1 budget | 870,00 | |
| 4501 — PETIT | Appel T1 budget | 1 080,00 | |
| 4501 — DURAND | Appel T1 budget | 890,00 | |
| 4501 — LEROY | Appel T1 budget | 1 320,00 | |
| **701** | Provisions sur opérations courantes | | **6 000,00** |

> 🇲🇬 **Réflexe cabinet :** dans les logiciels de syndic, l'appel est **généré automatiquement** à partir du budget et des tantièmes. Votre travail : **vérifier** que le total appelé = ¼ du budget, que les nouveaux copropriétaires (ventes) sont bien pris en compte, et que les avis sont envoyés à temps.

### 🧮 À vous : passez l'appel de fonds du 1ᵉʳ trimestre

<div class="saisie" data-ex="cp-appel"></div>

## 5) L'encaissement et le suivi des copropriétaires

À la réception du virement : **Débit 512 / Crédit 4501** du copropriétaire, puis **lettrage** avec l'appel correspondant.

### 🧮 À vous : encaissement d'un copropriétaire

<div class="saisie" data-ex="cp-encaissement"></div>

**Le suivi des comptes copropriétaires** est central :
- un compte **débiteur** = le copropriétaire **doit** de l'argent (appels non payés) ;
- un compte **créditeur** = il a **trop versé** (avance, régularisation en sa faveur) ;
- les **pénalités de retard** (intérêts au taux légal après mise en demeure) se comptabilisent en **714** ;
- les **frais de recouvrement** engagés après mise en demeure sont imputés **au seul copropriétaire défaillant** (art. 10-1), jamais à l'ensemble des copropriétaires.

## 6) L'appel de l'avance de trésorerie (fonds de roulement)

Pour éviter que la trésorerie soit à zéro entre deux appels, l'AG peut voter une **avance permanente de trésorerie** (la réserve prévue au règlement de copropriété ne peut excéder **1/6ᵉ du budget prévisionnel** — art. 35 du décret de 1967). Elle est appelée **une fois** :

| Compte | Débit | Crédit |
| --- | --- | --- |
| 4503 — copropriétaire | ✔ | |
| **1031** Avances de trésorerie | | ✔ |

Elle reste au passif tant que le copropriétaire possède son lot, et lui est **remboursée lors de la vente**.

> 🔜 Leçon suivante : les **travaux hors budget** et le **fonds de travaux**.
