# 1.4 — Saisie comptable pratique

**Niveau :** Débutant → Intermédiaire · **Durée estimée :** 14–16 h · **Prérequis :** Modules 2–3

---

## 🎯 Objectifs pédagogiques
- Saisir achats, ventes, banque, caisse et OD.
- Appliquer la bonne TVA (avec, sans, autoliquidation, intracommunautaire, import/export).
- Imputer correctement les charges courantes (loyer, télécom, carburant, honoraires…).
- Traiter les cas particuliers fréquents en cabinet.

## 🧩 Compétences à maîtriser
- Trouver le bon compte de charge et le bon taux de TVA.
- Saisir un journal de banque équilibré.
- Reconnaître les opérations à autoliquider.

---

## 1. Les journaux de saisie
| Journal | Code usuel | Contenu |
|---|---|---|
| Achats | AC / HA | Factures fournisseurs |
| Ventes | VT | Factures clients |
| Banque | BQ | Mouvements bancaires |
| Caisse | CA | Espèces |
| Opérations diverses | OD | Paie, TVA, dotations, régularisations |

---

## 2. Saisie des ACHATS

**Schéma général :** `6xx (HT) + 44566 (TVA) au débit / 401 au crédit`

**Ex. 1 — Achat marchandises 1 000 € HT, TVA 20 %**

<table class="ecr"><caption>Journal AC · Facture fournisseur — marchandises</caption><thead><tr><th>Compte</th><th>Libellé</th><th class="d">Débit</th><th class="c">Crédit</th></tr></thead><tbody><tr><td>607000</td><td>Achats de marchandises</td><td class="d">1 000,00</td><td class="c"></td></tr><tr><td>445660</td><td>TVA déductible 20 %</td><td class="d">200,00</td><td class="c"></td></tr><tr><td>401FRN</td><td>Fournisseur</td><td class="d"></td><td class="c">1 200,00</td></tr><tr class="tot"><td></td><td>Total</td><td class="d">1 200,00</td><td class="c">1 200,00</td></tr></tbody></table>

**Ex. 2 — Facture sans TVA (fournisseur en franchise en base)**
| Compte | Débit | Crédit |
|---|---|---|
| 606x ou 611 (selon nature) | 300 | |
| 401 Fournisseur | | 300 |
> Mention sur la facture : « TVA non applicable, art. 293 B du CGI ». **Pas de TVA déductible.**

---

## 3. Saisie des VENTES

**Schéma général :** `411 (TTC) au débit / 70x (HT) + 44571 (TVA) au crédit`

**Ex. 3 — Vente prestation 2 000 € HT, TVA 20 %**

<table class="ecr"><caption>Journal VT · Facture client — prestation de services</caption><thead><tr><th>Compte</th><th>Libellé</th><th class="d">Débit</th><th class="c">Crédit</th></tr></thead><tbody><tr><td>411CLI</td><td>Client</td><td class="d">2 400,00</td><td class="c"></td></tr><tr><td>706000</td><td>Prestations de services</td><td class="d"></td><td class="c">2 000,00</td></tr><tr><td>445710</td><td>TVA collectée 20 %</td><td class="d"></td><td class="c">400,00</td></tr><tr class="tot"><td></td><td>Total</td><td class="d">2 400,00</td><td class="c">2 400,00</td></tr></tbody></table>

---

## 4. Saisie de la BANQUE

Règle : **512 débité = entrée d'argent**, **512 crédité = sortie**.

**Ex. 4 — Paiement fournisseur 1 200 €** : 401 D 1 200 / 512 C 1 200
**Ex. 5 — Encaissement client 2 400 €** : 512 D 2 400 / 411 C 2 400
**Ex. 6 — Frais bancaires 18 €** : 627 D 18 / 512 C 18
**Ex. 7 — Virement du compte courant vers le livret (compte interne)** : 580 puis contrepassation (cf. virements internes Module 3).

---

## 5. Saisie de la CAISSE
- Journal CA : entrées (ventes espèces) au débit du 53, sorties (achats espèces) au crédit.
- **Contrôle clé :** le solde 53 ne peut **jamais être créditeur**. Si négatif → erreur (souvent un apport en espèces non saisi ou une dépense en double).

---

## 6. Saisie des OD (opérations diverses)
Servent aux écritures qui ne passent pas par achats/ventes/banque : **paie, TVA, dotations aux amortissements, régularisations, à-nouveaux, reclassements**.

---

## 7. La TVA selon les cas (synthèse — détail Module 3)

| Situation | Traitement |
|---|---|
| **Facture avec TVA** (FR) | TVA déductible (44566) ou collectée (44571) selon achat/vente |
| **Facture sans TVA** | Fournisseur en franchise / opération exonérée → pas de TVA |
| **Autoliquidation** (sous-traitance BTP, certains achats) | Pas de TVA sur la facture ; l'entreprise **collecte ET déduit** elle-même |
| **Intracommunautaire (achat de biens UE)** | Autoliquidation : 4452 TVA due intracom + 44566 déductible |
| **Importation (hors UE)** | TVA à l'import autoliquidée sur la CA3 depuis 2022 |
| **Exportation / livraison intracom** | Exonérée de TVA (mentions + justificatifs obligatoires) |

**Ex. 8 — Autoliquidation sous-traitance BTP 5 000 € HT**
| Compte | Débit | Crédit |
|---|---|---|
| 611 Sous-traitance | 5 000 | |
| 401 Fournisseur | | 5 000 |
| 445662 TVA déductible autoliquidée | 1 000 | |
| 4452 TVA due intracom./autoliq. | | 1 000 |
> La facture du sous-traitant porte la mention « Autoliquidation ». Neutre en trésorerie de TVA mais **obligatoire** sur la CA3.

**Ex. 9 — Achat intracommunautaire de biens 3 000 € (fournisseur allemand)**
| Compte | Débit | Crédit |
|---|---|---|
| 607 Achats | 3 000 | |
| 445662 TVA déductible intracom. | 600 | |
| 4452 TVA due intracommunautaire | | 600 |

---

## 8. Imputation des charges courantes (mémo cabinet)

| Dépense | Compte | TVA |
|---|---|---|
| Loyer local professionnel | 6132 | 20 % (si bail soumis) — sinon exonéré |
| Location matériel/véhicule | 6135 | 20 % |
| Assurances | 616 | **Pas de TVA** (exonérée) |
| Téléphone / Internet | 6262 | 20 % |
| Carburant essence/gazole | 60622 (ou 6061) | TVA : voir Module 3 (gazole 80 %, essence alignée) |
| Restaurant / repas d'affaires | 6257 | 20 % récupérable si justifié pro |
| Déplacements (train, avion, péage, hôtel) | 6251 | train/avion exonérés ; hôtel 10 % ; péage 20 % |
| Honoraires (EC, avocat) | 6226 | 20 % |
| Sous-traitance | 611 | 20 % (ou autoliquidation BTP) |
| Abonnements / logiciels SaaS | 6262 ou 6063 | 20 % (vérifier si fournisseur UE → autoliq.) |
| Électricité / gaz | 60612 | 20 % (+ accises) |
| Petit équipement (< 500 € HT) | 6063 / 6068 | 20 % |
| Fournitures de bureau | 6064 | 20 % |
| Frais postaux | 6261 | timbres exonérés ; affranchissement pro variable |
| Frais bancaires | 627 | souvent sans TVA ; commissions parfois avec TVA |
| Cotisations / adhésions | 6281 | selon nature |
| Publicité | 6231 | 20 % |
| Entretien et réparations | 615 | 20 % |

> ⚠️ **Véhicules de tourisme (VP)** : TVA sur l'achat et l'entretien **non déductible** ; carburant partiellement déductible. Détail Module 3.

---

## 9. Cas particuliers fréquents en cabinet
- **Avoir fournisseur** : écriture inverse de l'achat (401 D / 6xx C + TVA C).
- **Acompte versé** : 4091 (fournisseur débiteur) avant la facture définitive.
- **Facture à cheval sur 2 exercices** : rattachement (CCA/FNP, Module 4).
- **Paiement CB différé** : débit bancaire postérieur (rapprochement, Module 3).
- **Note de frais salarié** : charges par nature + 425/455 selon remboursement.
- **Prélèvement sans facture** (abonnement) : passer en 471 ou en charge avec relance pièce.

---

## ✅ Checklist de saisie (par pièce)
- [ ] Pièce conforme et lisible
- [ ] Bon **journal** (AC/VT/BQ/CA/OD)
- [ ] Bon **tiers** (401/411, le bon)
- [ ] Bon **compte de charge/produit**
- [ ] Bon **taux de TVA** et **bon compte de TVA**
- [ ] Montant HT + TVA = TTC (recalcul)
- [ ] Date et n° de pièce corrects
- [ ] Pas de doublon
- [ ] Commentaire si opération inhabituelle

---

## 🧪 Cas pratique 4.1 — Lot de 8 saisies
Saisir (TVA 20 % sauf mention) :
1. Facture EDF électricité 240 € TTC.
2. Facture assurance local 600 €.
3. Facture client prestation 4 800 € TTC.
4. Carburant gazole 60 € TTC (TVA déductible 80 %).
5. Honoraires avocat 1 200 € HT.
6. Sous-traitance BTP 2 000 € HT (autoliquidation).
7. Achat fournitures Amazon UE (vendeur établi en UE) 100 € (intracom. biens).
8. Frais bancaires 12 € (sans TVA).

### ✔️ Correction 4.1
1. 60612 = 200 / 44566 = 40 / 401 = 240
2. 616 = 600 / 401 = 600 *(pas de TVA sur assurance)*
3. 411 = 4 800 / 706 = 4 000 / 44571 = 800
4. 60622 = 50 + (TVA non déductible 20 %×0,20×... ) → pratique : 60622 = 50 ; TVA totale = 10, déductible 8 (44566), non déductible 2 (en 60622). Donc **60622 = 52 / 44566 = 8 / 401 = 60**
5. 6226 = 1 200 / 44566 = 240 / 401 = 1 440
6. 611 = 2 000 / 401 = 2 000 ; 445662 = 400 / 4452 = 400
7. 6064 (ou 607) = 100 / 445662 = 20 / 4452 = 20 ; 401 = 100
8. 627 = 12 / 512 = 12

---

## 🧮 Entraînement interactif — matrice de saisie (pièce → écriture)
Place‑toi comme en cabinet : à **gauche la pièce** (facture, reçu…), à **droite l'écriture** à saisir. Le système vérifie l'**équilibre** (débit = crédit) et l'**imputation**. Suis le **tutoriel** en tête, puis « Vérifier ».

**Achat fournisseur (facture)**

<div class="saisie" data-ex="ex1"></div>

**Vente de prestation (facture client)**

<div class="saisie" data-ex="ex2"></div>

**Course Uber — piège TVA (reçu, payé en CB)**

<div class="saisie" data-ex="ex3"></div>

**Encaissement d'un client (virement)**

<div class="saisie" data-ex="ex4"></div>

---

## 📝 Évaluation de fin de chapitre
**A — 6 écritures à passer** (mélange achats/ventes/banque, dont 1 autoliquidation et 1 intracom).
**B — QCM (4 pts) :**
1. La TVA sur assurance est : a) 20 % b) **non déductible (exonéré)**
2. Une facture en franchise en base : a) TVA 20 % b) **pas de TVA**
3. Le 512 crédité signifie : a) entrée d'argent b) **sortie d'argent**
4. L'autoliquidation est : a) neutre en TVA mais obligatoire sur la CA3 b) une exonération

**Seuil : 14/20.**
**Corrigé B :** 1b · 2b · 3b · 4a.
