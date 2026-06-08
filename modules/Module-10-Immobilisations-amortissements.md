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
| **404** Fournisseurs d'immobilisations | Dette d'achat d'immo |

---

## 3. Acquisition d'une immobilisation
**Ex. — Achat machine 5 000 € HT, TVA 20 %**
| Compte | Débit | Crédit |
|---|---|---|
| 2154 Matériel | 5 000 | |
| 44562 TVA déductible immo | 1 000 | |
| 404 Fournisseur d'immo | | 6 000 |

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
`Dotation 1re année = (Base ÷ durée) × (jours d'utilisation ÷ 360)`

---

## 5. Cession d'une immobilisation
À la vente d'un bien :
1. Constater le **prix de cession** : 462 (ou 512) D / 775 Produits de cession C + TVA si applicable.
2. **Sortir** le bien : reprendre les amortissements (28x D) et la valeur d'origine (21x C), constater la **VNC** en 675 (valeur comptable des éléments cédés).
3. Résultat de cession = 775 − 675.

**TVA sur cession** : la vente d'une immo soumise à TVA est en principe taxable (à valider selon le cas).

---

## 6. Le fichier des immobilisations (tableau d'amortissement)
Document de suivi indispensable : liste de tous les biens, leur valeur, durée, amortissements cumulés et VNC.

**Contrôles :**
- Σ valeurs brutes = soldes des comptes 21/20.
- Σ amortissements = soldes des comptes 28.
- Dotation de l'exercice = 6811.
- VNC = brut − amortissements cumulés.

---

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
**Achat :** 2183 D 1 200 / 44562 D 240 / 404 C 1 440
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
