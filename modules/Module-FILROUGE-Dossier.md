# 📂 Fil rouge : un dossier complet, de la saisie au bilan

> **Le grand exercice de synthèse.** Vous allez tenir la comptabilité d'une petite entreprise **sur toute une année**, exactement comme en cabinet : vous saisissez chaque opération, vous passez les écritures de clôture, puis vous obtenez le **compte de résultat** et le **bilan**. Tous les chiffres **s'enchaînent et bouclent** — c'est ça, un vrai dossier.
>
> Pour chaque écriture : saisissez vous-même, **« ✓ Vérifier »**, et en cas de doute **📘 tutoriel** ou **👁 Corrigé**.

## 🏢 Le dossier : SARL ZenBureau
**Activité :** vente de mobilier de bureau (négoce). **Exercice :** du 01/01 au 31/12/2026. **Régime :** IS, réel.
Voici **tout ce qui s'est passé** cette année — à vous de le comptabiliser.

| Opération de l'année | Montant |
|---|---|
| Apport du capital | 10 000 € |
| Achat de marchandises | 6 000 € HT |
| Achat d'un ordinateur (immobilisation) | 1 500 € HT |
| Ventes de l'année | 15 000 € HT |
| Loyers & frais généraux | 2 000 € HT |
| Paie de l'année | brut 4 000 € |

> Chaque **achat** et chaque **vente** se comptabilise en **2 écritures** : la **facture** (journal AC/VT) puis le **règlement** en banque (journal BQ). Tout est payé/encaissé dans l'année.

**À la clôture :** stock final 2 000 € · ordinateur amorti sur 3 ans · TVA à liquider · IS.

---

## 🧾 Partie 1 — La saisie de l'année

> 🗂️ **Le bon journal pour chaque écriture :** la **facture** d'achat va au journal **AC**, la **facture** de vente au journal **VT** (via le compte **fournisseur 401** ou **client 411**), et **tout mouvement de banque (512) va au journal BQ**. C'est pourquoi chaque achat/vente se fait en **2 temps** : la **facture**, puis le **règlement** en banque.

### ① Apport du capital — journal BQ

<div class="saisie" data-ex="fr-capital"></div>

### ② Achat de marchandises — facture (journal AC)

<div class="saisie" data-ex="fr-achat"></div>

### ③ Règlement du fournisseur — journal BQ

<div class="saisie" data-ex="fr-achat-reg"></div>

### ④ Achat de l'ordinateur — facture (journal AC)

<div class="saisie" data-ex="fr-immo"></div>

### ⑤ Règlement du fournisseur d'immo — journal BQ

<div class="saisie" data-ex="fr-immo-reg"></div>

### ⑥ Les ventes de l'année — facture (journal VT)

<div class="saisie" data-ex="fr-vente"></div>

### ⑦ Encaissement des clients — journal BQ

<div class="saisie" data-ex="fr-encaiss"></div>

### ⑧ Les loyers & frais — facture (journal AC)

<div class="saisie" data-ex="fr-loyer"></div>

### ⑨ Règlement des loyers & frais — journal BQ

<div class="saisie" data-ex="fr-loyer-reg"></div>

### ⑩ L'OD de paie — journal OD

<div class="saisie" data-ex="fr-paie"></div>

### ⑪ Le paiement des salaires et cotisations — journal BQ

<div class="saisie" data-ex="fr-paie-reglt"></div>

---

## 🔒 Partie 2 — Les travaux de clôture (31/12) — journal OD

### ⑫ La dotation aux amortissements

<div class="saisie" data-ex="fr-amort"></div>

### ⑬ Le stock final (variation de stock)

<div class="saisie" data-ex="fr-stock"></div>

### ⑭ La liquidation de la TVA

<div class="saisie" data-ex="fr-tva"></div>

### ⑮ L'impôt sur les sociétés

<div class="saisie" data-ex="fr-is"></div>

---

## 📊 Partie 3 — Du grand livre au **bilan**

Une fois toutes les écritures passées, on regroupe les comptes. Voici ce que ça donne.

### 🧮 La trésorerie (compte 512)
| Mouvement | Montant |
|---|---|
| Apport du capital | +10 000 |
| Ventes encaissées (TTC) | +18 000 |
| Achats payés (TTC) | −7 200 |
| Ordinateur payé (TTC) | −1 800 |
| Loyers & frais payés (TTC) | −2 400 |
| Salaires + cotisations | −5 600 |
| **= Solde en banque au 31/12** | **11 000** |

### 📈 Compte de résultat
| | Charges | | Produits |
|---|---|---|---|
| Achats de marchandises (607) | 6 000 | Ventes de marchandises (707) | **15 000** |
| Variation de stock (6037) | −2 000 | | |
| → Achats consommés | *4 000* | | |
| Loyers & frais (613) | 2 000 | | |
| Salaires (641) | 4 000 | | |
| Charges sociales (645) | 1 600 | | |
| Dotations amortissements (6811) | 500 | | |
| **Résultat d'exploitation** | | | **2 900** |
| Impôt sur les bénéfices (695) | 435 | | |
| **🟢 Résultat net** | | | **2 465** |

### ⚖️ Bilan au 31/12
| ACTIF | Montant | PASSIF | Montant |
|---|---|---|---|
| Immobilisations (1 500 − 500 amort) | **1 000** | Capital social (101) | 10 000 |
| Stock de marchandises (37) | 2 000 | Résultat de l'exercice (12) | 2 465 |
| Disponibilités — banque (512) | 11 000 | TVA à décaisser (44551) | 1 100 |
| | | IS à payer (444) | 435 |
| **TOTAL ACTIF** | **14 000** | **TOTAL PASSIF** | **14 000** |

> ✅ **Le bilan est équilibré : ACTIF = PASSIF = 14 000 €.** C'est LE contrôle final : si ça ne boucle pas, une écriture est fausse.

### 💪 La capacité d'autofinancement (CAF)
Combien l'entreprise a-t-elle réellement « dégagé » pour investir/rembourser ? Calculez-la (entrez **résultat net 2 465** et **dotations 500**) :

<div class="calc" data-calc="caf"></div>

---

## 🎓 Ce que vous venez de faire
Vous avez tenu un dossier **du premier euro au bilan** : saisie courante → clôture (amortissement, stock, TVA, IS) → **compte de résultat** et **bilan équilibré**. C'est **exactement** le travail d'un collaborateur confirmé en cabinet d'externalisation.

> 🔁 **Pour aller plus loin :** refaites le dossier en changeant les montants dans votre tête et vérifiez que le bilan boucle toujours. Puis enchaînez sur la **liasse fiscale** (Module 5).
