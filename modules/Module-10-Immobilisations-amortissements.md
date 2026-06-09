# 3.6 — Immobilisations et amortissements

**Niveau :** Intermédiaire · **Durée estimée :** 8 h · **Prérequis :** Modules 4 et 5

---

## 🎯 Objectifs pédagogiques
- Distinguer charge et immobilisation.
- Maîtriser les comptes 20, 21, 28, 68.
- Calculer un amortissement linéaire (prorata temporis inclus).
- Traiter une cession et la TVA sur immobilisation.

## 🧩 Compétences
- Tenir un fichier des immobilisations.
- Contrôler le tableau d'amortissement.

---

## 1. Définition d'une immobilisation
Un bien **durable** (utilisé > 1 an) destiné à servir l'activité, **non consommé** dans l'exercice. Ex. : matériel, mobilier, ordinateur, véhicule, logiciel, agencements.

### Charge ou immobilisation ?
- **Charge (classe 6)** : consommée dans l'année, ou de **faible valeur**.
- **Immobilisation (classe 2)** : durable et de valeur significative.
- **Seuil pratique : 500 € HT** par bien (tolérance administrative pour le petit matériel/mobilier). En dessous → charge (6063/6068) ; au-dessus → immo.
- Le **seuil interne du cabinet** peut préciser cette règle → vérifier le dossier permanent.

---

## 2. Les comptes
| Compte | Usage |
|---|---|
| **20** Immobilisations incorporelles | 205 logiciels/licences, 207 fonds commercial |
| **21** Immobilisations corporelles | 2154 matériel industriel, 2183 matériel info/bureau, 2184 mobilier, 2182 matériel de transport, 213 constructions |
| **28** Amortissements | 2805, 28154, 28183… (amortissements cumulés, au passif en moins de l'actif) |
| **68** Dotations aux amortissements | 6811 (charge annuelle d'amortissement) |
| **44562** TVA déductible sur immobilisations | TVA récupérable (sauf VP) |
| **401IMMO** Fournisseurs d'immobilisations | Dette d'achat d'immo — **compte fournisseur auxiliaire dédié** (pratique cabinet, au lieu du 404) |

---

## 3. Acquisition d'une immobilisation
**Ex. — Achat machine 5 000 € HT, TVA 20 %**
| Compte | Débit | Crédit |
|---|---|---|
| 2154 Matériel | 5 000 | |
| 44562 TVA déductible immo | 1 000 | |
| 401IMMO Fournisseur d'immo | | 6 000 |

> **Mise en service** : l'amortissement démarre à la **date de mise en service**, pas forcément à la date d'achat.

---

## 4. L'amortissement linéaire
Répartit le coût du bien sur sa **durée d'utilisation**.

`Dotation annuelle = Base amortissable (HT) ÷ durée (années)`

**Durées d'usage indicatives :**
| Bien | Durée |
|---|---|
| Matériel informatique | 3 ans |
| Mobilier | 10 ans |
| Matériel/outillage | 5–10 ans |
| Agencements | 10 ans |
| Véhicule | 5 ans |
| Logiciel | 1–3 ans |

**Écriture de dotation (en OD, à la clôture) :** 6811 D / 28x C.

### Prorata temporis (1re année)
La 1re année, on amortit **au prorata des jours/mois** depuis la mise en service.
`Dotation 1re année = (Base ÷ durée) × (mois d'utilisation ÷ 12)`

---

## 5. Cession d'une immobilisation
À la vente d'un bien :
1. Constater le **prix de cession** : 462 (ou 512) D / 775 Produits de cession C + TVA si applicable.
2. **Sortir** le bien : reprendre les amortissements (28x D) et la valeur d'origine (21x C), constater la **VNC** en 675 (valeur comptable des éléments cédés).
3. Résultat de cession = 775 − 675.

**TVA sur cession** : la vente d'une immo soumise à TVA est en principe taxable (à valider selon le cas).

### 🧮 À vous : passez l'écriture de cession

<div class="saisie" data-ex="cession-immo"></div>

---

## 6. Le fichier des immobilisations (tableau d'amortissement)
Document de suivi indispensable : liste de tous les biens, leur valeur, durée, amortissements cumulés et VNC.

**Contrôles :**
- Σ valeurs brutes = soldes des comptes 21/20.
- Σ amortissements = soldes des comptes 28.
- Dotation de l'exercice = 6811.
- VNC = brut − amortissements cumulés.

---

## 🏠 7. Amortissement excédentaire en LMNP (art. 39 C II CGI)

La **location meublée non professionnelle (LMNP)** au régime réel BIC est l'un des montages les plus demandés en cabinet : il permet de **neutraliser quasi totalement** les loyers grâce à l'amortissement de l'immeuble et du mobilier. Mais ce levier est encadré par une règle clé : **l'amortissement ne peut jamais créer ni aggraver un déficit**. Cette section explique le plafonnement, le report illimité, la décomposition par composants et le calcul pratique.

> **À retenir d'emblée :** en LMNP, l'amortissement est un outil de **différé d'impôt**, pas d'effacement. Il abaisse le résultat à 0, et ce qui dépasse est mis « en réserve » pour les années suivantes.

---

### 7.1 La règle de l'article 39 C II du CGI

L'article **39 C II du CGI** limite l'amortissement déductible des biens loués par une personne physique. Le texte pose deux mécanismes :

1. **Plafonnement (39 C II-2) :** l'amortissement est déductible *« dans la limite du montant du loyer acquis […] diminué du montant des autres charges afférentes à ces biens »*. Autrement dit :

`Amortissement déductible de l'année ≤ Loyers encaissés − Autres charges (hors amortissement)`

2. **Report illimité (39 C II-3) :** la fraction d'amortissement **régulièrement comptabilisée** mais **non déduite** (car plafonnée) est **reportable sur les exercices suivants, sans limite de durée**, dès qu'un bénéfice locatif redevient disponible.

**Conséquence pratique :** au régime réel, le résultat fiscal LMNP ne peut **jamais devenir négatif du seul fait de l'amortissement**. Au pire, l'amortissement ramène le résultat à **zéro**.

> ⚠️ **Ne pas confondre deux notions distinctes :**
> | Notion | Origine | Report |
> |---|---|---|
> | **Déficit BIC** | Charges courantes (hors amortissement) > loyers | **10 ans**, sur BIC LMNP uniquement |
> | **Amortissement réputé différé (ARD)** | Amortissement bloqué par le plafond 39 C II | **Illimité dans le temps** |
>
> Le déficit BIC naît *avant* amortissement ; l'ARD est l'amortissement *qui n'a pas pu passer*. Les deux ne s'imputent **jamais sur le revenu global** : ils restent cantonnés aux bénéfices de location meublée non professionnelle.

---

### 7.2 Pourquoi le LMNP réel neutralise l'impôt

Le résultat fiscal LMNP se construit en deux temps :

`Résultat avant amortissement = Loyers − Charges déductibles (intérêts, taxe foncière, assurance, copro, entretien, honoraires comptables, CFE…)`

`Résultat fiscal = Résultat avant amortissement − Amortissement déductible (plafonné)`

Comme l'amortissement d'un immeuble est **élevé** (souvent 2 à 4 % de la valeur du bâti par an, plus le mobilier sur 5–10 ans), il **absorbe la quasi-totalité** du résultat avant amortissement. Résultat : **0 € d'impôt et 0 € de prélèvements sociaux** sur les loyers pendant de nombreuses années, et le surplus d'amortissement est mis en report.

---

### 7.3 La décomposition par composants de l'immeuble

On n'amortit **jamais** un immeuble « en bloc » : le PCG (art. 214-9) et la doctrine BOFiP imposent la **décomposition par composants**. Chaque composant a sa propre durée d'usure.

**Règle préalable — le terrain n'est pas amortissable :** le terrain ne se déprécie pas. Il faut donc **isoler la quote-part terrain** (en pratique **10 à 20 %** du prix global, à justifier ; à défaut, ventilation par l'acte ou par comparaison locale). Seul le **bâti** s'amortit.

**Ventilation type d'un immeuble d'habitation** (clés indicatives, à adapter au bien) :

| Composant | Quote-part du bâti | Durée d'amortissement | Taux annuel |
|---|---|---|---|
| **Gros œuvre** (structure, murs porteurs, fondations) | ~40 % | 50 à 80 ans | ~1,25 à 2 % |
| **Toiture / couverture** | ~10 % | 25 ans | ~4 % |
| **Étanchéité** | ~10 % | 15 ans | ~6,7 % |
| **Façades / ravalement** | ~10 % | 20 ans | ~5 % |
| **Installations techniques** (électricité, plomberie, chauffage) | ~15 % | 20 ans | ~5 % |
| **Agencements / aménagements intérieurs** | ~15 % | 15 ans | ~6,7 % |

> 💡 La durée d'usage **plus courte** des composants secondaires (étanchéité, agencements) génère un amortissement annuel **plus fort les premières années** → c'est ce qui rend le LMNP fiscalement si efficace au démarrage.

**Le mobilier** (lits, électroménager, cuisine équipée, literie…) s'amortit **à part**, sur **5 à 10 ans**, et entre lui aussi dans le total d'amortissement soumis au plafond 39 C II.

---

### 7.4 Comptes PCG et écritures

| Compte | Usage en LMNP |
|---|---|
| **2131 / 213** Constructions (par composant) | Valeur du bâti ventilée par composant |
| **2111** Terrains | Quote-part terrain (non amortie) |
| **2184 / 2188** Mobilier, autres immo corporelles | Mobilier meublant |
| **6811** Dotations aux amortissements | Charge annuelle d'amortissement |
| **28131 / 2818** Amortissements | Amortissements cumulés |

**Écriture de dotation (clôture, en OD) :** `6811 D / 281x C` — pour le **montant comptabilisé total** (toujours la dotation théorique pleine).

> ⚠️ **Point d'attention cabinet :** la dotation se **comptabilise en totalité** (6811 pour le montant théorique plein). Le plafonnement 39 C II est un **retraitement extra-comptable** opéré sur la **liasse fiscale (2033)** : la part non déductible est neutralisée fiscalement et **suivie dans un tableau des amortissements différés** à joindre à la déclaration. Ne jamais « brider » la comptabilité elle-même.

---

### 7.5 Attention : la réforme plus-value (LF 2025)

Depuis l'**article 84 de la loi de finances 2025** (loi n° 2025-127 du 14/02/2025, modifiant l'**art. 150 VB III du CGI**), pour les **cessions à compter du 15/02/2025**, les amortissements **effectivement déduits** sont **réintégrés** au calcul de la plus-value immobilière des particuliers (le prix d'acquisition est minoré des amortissements admis en déduction). Cela **augmente la plus-value taxable** à la revente.

> 📌 Conséquences à connaître :
> - Les amortissements **différés** (jamais déduits, art. 39 C II) ne sont **pas** réintégrés : seuls les amortissements **réellement déduits** le sont.
> - **Exemption expresse** pour les **résidences services** : étudiantes (L. 631-12 CCH), seniors (L. 631-13 CCH) et EHPAD/médicalisées (L. 312-1 CASF).
> - L'abattement pour durée de détention (exonération totale d'IR à 22 ans, de PS à 30 ans) continue de s'appliquer sur la plus-value ainsi recalculée.

---

### 7.6 Rappel régimes : micro-BIC vs réel (millésime 2026)

| Régime | Seuil de recettes | Imposition |
|---|---|---|
| **Micro-BIC** (meublé classique) | ≤ **83 600 €** | Abattement forfaitaire **50 %** (pas d'amortissement) |
| **Réel BIC** | de plein droit au-delà, ou sur option | Charges réelles **+ amortissement** (art. 39 C II) |

> Le réel est quasi systématiquement plus favorable dès qu'il y a un emprunt et/ou un bien de valeur, grâce à l'amortissement. *(Seuils micro-BIC à jour pour les revenus 2025 déclarés en 2026 ; vérifier chaque loi de finances.)*

---

### 🧪 Cas pratique 10.3 — Amortissement plafonné et reporté en LMNP

**Données du dossier (exercice 2026) :**
- Appartement meublé acquis **250 000 €** frais inclus, dont **terrain 15 %** = 37 500 € (non amortissable) → **bâti = 212 500 €**.
- Mobilier : **15 000 €** amorti sur 10 ans.
- **Loyers encaissés 2026 : 12 000 €**.
- **Autres charges déductibles (hors amortissement) : 7 000 €** (intérêts d'emprunt, taxe foncière, assurance, copropriété, honoraires comptables, CFE).
- **Report d'amortissement antérieur (ARD au 31/12/2025) : 3 000 €**.

**Étape 1 — Amortissement théorique 2026 (par composants) :**
| Composant | Base | Durée | Dotation |
|---|---|---|---|
| Gros œuvre (40 %) | 85 000 | 60 ans | 1 417 |
| Toiture (10 %) | 21 250 | 25 ans | 850 |
| Étanchéité (10 %) | 21 250 | 15 ans | 1 417 |
| Façades (10 %) | 21 250 | 20 ans | 1 062 |
| Installations techniques (15 %) | 31 875 | 20 ans | 1 594 |
| Agencements (15 %) | 31 875 | 15 ans | 2 125 |
| **Mobilier** | 15 000 | 10 ans | 1 500 |
| **Total amortissement théorique** | | | **≈ 9 965 €** |

**Étape 2 — Plafond de déduction (art. 39 C II) :**
`Base = Loyers − Autres charges = 12 000 − 7 000 = 5 000 €`
L'amortissement déductible est plafonné à **5 000 €** (la base positive).

**Étape 3 — Amortissement « disponible » à imputer cette année :**
`Amortissement théorique 2026 + Report antérieur = 9 965 + 3 000 = 12 965 €`

**Étape 4 — Amortissement réellement déduit en 2026 :**
On déduit dans la limite du plafond → **5 000 €** déduits.

**Étape 5 — Nouvel amortissement reporté (ARD au 31/12/2026) :**
`12 965 − 5 000 = 7 965 €` → reportés **sans limite de durée**.

**Étape 6 — Résultat fiscal LMNP 2026 :**
`5 000 (base) − 5 000 (amort. déduit) = 0 €` → **0 € d'impôt, 0 € de prélèvements sociaux.**

**Lecture cabinet :** les **12 000 €** de loyers sont **intégralement neutralisés**. Le stock d'ARD passe de 3 000 € à **7 965 €** : il servira à effacer les bénéfices des prochaines années. Comptablement, on passe bien `6811 D 9 965 / 281x C 9 965` (dotation pleine) ; le bridage à 5 000 € est extra-comptable sur la liasse, avec mise à jour du tableau de suivi des amortissements différés.

> ✅ **Réflexe de contrôle :** toujours vérifier que **dotation comptabilisée (6811) = dotation théorique pleine**, et que **amortissement déduit fiscalement ≤ (loyers − autres charges)**. L'écart alimente le report d'ARD à reconduire d'un exercice sur l'autre.

<div class="calc" data-calc="lmnp-amort"></div>

## ✅ Checklist immobilisations
- [ ] Distinction charge/immo respectée (seuil 500 € HT)
- [ ] TVA bien traitée (non déductible sur VP)
- [ ] Date de mise en service identifiée
- [ ] Durée d'amortissement conforme à la politique cabinet
- [ ] Prorata temporis appliqué la 1re année
- [ ] Dotation passée (6811 / 28x)
- [ ] Fichier immo à jour et rapproché de la compta (21/20/28)
- [ ] Cessions traitées (775/675, sortie des amortissements)

---

## 📊 Tableau d'amortissement (modèle Excel à créer)
| Bien | Date mise en service | Base HT | Durée | Taux | Dotation N | Amort. cumulés | VNC |
|---|---|---|---|---|---|---|---|

---

## 🧪 Cas pratique 10.1 — Immobilisation avec amortissement
Achat d'un ordinateur le **01/04/2026** : 1 200 € HT, TVA 20 %. Durée 3 ans. Clôture au 31/12/2026.

**Travail :** écriture d'achat + dotation prorata temporis.

### ✔️ Correction 10.1
**Achat :** 2183 D 1 200 / 44562 D 240 / 401IMMO C 1 440
**Dotation annuelle pleine :** 1 200 ÷ 3 = 400 €/an
**Prorata 2026** (du 01/04 au 31/12 = 9 mois) : 400 × 9/12 = **300 €**
**Écriture dotation au 31/12/2026 :** 6811 D 300 / 28183 C 300
**VNC au 31/12/2026 :** 1 200 − 300 = **900 €**

---

## 🧪 Cas pratique 10.2 — Charge ou immo ?
Le client achète : (a) une imprimante 90 € HT, (b) un photocopieur 1 500 € HT, (c) une rame de papier 8 €. Classez.

### ✔️ Correction 10.2
- (a) 90 € < 500 € → **charge** (6063 / 6068).
- (b) 1 500 € > 500 € + durable → **immobilisation** (2183), amortie sur 3–5 ans.
- (c) consommable → **charge** (6064).

---

## 📝 Évaluation de fin de chapitre
1. Seuil pratique charge/immo ?
2. Formule de la dotation linéaire ?
3. Quand démarre l'amortissement ?
4. Écriture de la dotation annuelle ?
5. La TVA sur un véhicule de tourisme est-elle déductible ?

**Seuil : 7/10.**
**Corrigé :** 1) **500 € HT**. 2) base ÷ durée. 3) à la **mise en service** (prorata la 1re année). 4) **6811 D / 28x C**. 5) **non** (VP).
