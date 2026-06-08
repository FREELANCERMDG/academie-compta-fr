# 3.1 — TVA française

**Niveau :** Intermédiaire · **Durée estimée :** 12–14 h · **Prérequis :** Modules 2 et 4
**Chiffres à jour 2026** (sources : impots.gouv.fr, economie.gouv.fr, bofip.impots.gouv.fr).

---

## 🎯 Objectifs pédagogiques
- Comprendre TVA collectée, déductible, à décaisser, crédit de TVA.
- Distinguer TVA sur les débits / sur les encaissements.
- Connaître les régimes (franchise, réel simplifié, réel normal) et les déclarations CA3 / CA12.
- Préparer une déclaration de TVA contrôlée, prête à valider.

## 🧩 Compétences
- Calculer la TVA à payer / le crédit du mois.
- Contrôler la cohérence TVA avant déclaration.
- Identifier la TVA non déductible.

---

## 1. Principe général
La TVA est un impôt sur la consommation, **collecté pour l'État**. L'entreprise :
- **collecte** la TVA sur ses ventes (44571),
- **déduit** la TVA sur ses achats (44566 / 44562),
- reverse la différence : **TVA à décaisser = TVA collectée − TVA déductible** (44551), ou constate un **crédit de TVA** (44567) si déductible > collectée.

---

## 2. Les taux de TVA en vigueur (2026)
| Taux | Application principale |
|---|---|
| **20 %** | Taux normal (majorité des biens et services) |
| **10 %** | Restauration, hôtellerie, transport, travaux d'amélioration du logement, certains produits |
| **5,5 %** | Produits alimentaires de base, livres, énergie (abonnement gaz/électricité), équipements PMR, certains travaux d'amélioration énergétique |
| **2,1 %** | Médicaments remboursables, presse, certains spectacles |

> Le collaborateur applique le taux porté **sur la facture** ; en cas de doute (ex. travaux 10 % vs 20 %), signaler au chef de mission.

---

## 3. TVA sur les débits vs sur les encaissements
| Régime d'exigibilité | Quand la TVA est due | Concerne |
|---|---|---|
| **Sur les débits** | À la **facturation** | Livraisons de **biens** (par défaut) ; possible sur option pour les services |
| **Sur les encaissements** | À l'**encaissement** du règlement | **Prestations de services** (par défaut) |

**Conséquence pratique :** pour une entreprise de services à l'encaissement, la TVA collectée du mois = TVA sur les **factures payées** ce mois-ci, pas sur les factures émises. → contrôle indispensable avant la CA3.

---

## 4. Les régimes de TVA et seuils 2026

| Régime | Seuils de CA (2026) | Déclaration |
|---|---|---|
| **Franchise en base** | Ventes ≤ **85 000 €** (tolérance **93 500 €**) · Services ≤ **37 500 €** (tolérance **41 250 €**) | Pas de TVA, pas de déclaration ; mention « TVA non applicable, art. 293 B du CGI » |
| **Réel simplifié (RSI)** | Ventes ≤ **840 000 €** · Services ≤ **254 000 €** | **CA12** annuelle + 2 acomptes (juillet 55 %, décembre 40 %) |
| **Réel normal** | Au-delà des seuils du RSI, ou sur option | **CA3** mensuelle (trimestrielle si TVA due annuelle < 4 000 €) |

> ⚠️ La réforme du **seuil unique de franchise à 25 000 €** a été suspendue ; en 2026, **les seuils ci-dessus restent applicables**. Toujours vérifier le régime exact dans le dossier permanent.
> ℹ️ Dès qu'une entreprise dépasse le seuil de **tolérance** en cours d'année, elle devient redevable de la TVA dès le 1er jour du mois de dépassement.

---

## 5. Les déclarations (formulaires CERFA) — quelle case remplir ?

> En pratique on **télédéclare** (EDI via le logiciel, ou EFI sur impots.gouv) ; mais il faut connaître le **CERFA** et savoir **quelle ligne = quoi**, car les écrans de Pennylane/ACD reprennent **exactement** ces lignes.

### 🧾 CA3 — formulaire **3310‑CA3‑SD** (CERFA n° 10963) — réel normal, mensuelle/trimestrielle
Deux cadres : **Cadre A** = montant des opérations (HT) · **Cadre B** = décompte de la TVA.

<div class="cerfa" data-form="ca3"></div>

**▸ CADRE A — Montant des opérations réalisées (en € HT)**
| Ligne | Quoi y mettre | Où le trouver en compta |
|---|---|---|
| **01** | **Ventes et prestations taxables** (base **HT**) | crédit des comptes 70x |
| 02 | Autres opérations imposables (base HT) | cas particuliers |
| 0A | Achats de **prestations de services intracommunautaires** (autoliquidation) | factures de services UE |
| 03 | **Acquisitions intracommunautaires** de biens (base HT) | achats de biens UE |
| 04 | **Exportations** hors UE (exonérées) | ventes hors UE |
| 05 | Autres opérations non imposables | — |
| 06 | **Livraisons intracommunautaires** (exonérées) | ventes de biens vers l'UE |

**▸ CADRE B — Décompte de la TVA à payer**
*TVA brute (collectée), par taux :*
| Ligne | Quoi y mettre |
|---|---|
| **08** | base HT **× 20 %** (taux normal) → colonne **base** + colonne **taxe** |
| **09** | base HT **× 10 %** |
| **9B** | base HT **× 5,5 %** |
| **9C** | base HT **× 2,1 %** |
| **17** | *dont* **TVA sur acquisitions intracommunautaires** (déjà incluse au‑dessus) |
| **16** | **TOTAL TVA brute due** = somme des lignes 08 à 15 |

*TVA déductible :*
| Ligne | Quoi y mettre | Compte |
|---|---|---|
| **19** | TVA déductible sur **immobilisations** | 44562 |
| **20** | TVA déductible sur **autres biens et services (ABS)** | 44566 |
| **21** | Autre TVA à déduire (régularisations, autoliquidation déductible) | — |
| **22** | **Report du crédit de TVA** (= ligne 27 de la déclaration précédente) | 44567 |
| **23** | **TOTAL TVA déductible** = lignes 19 à 22 |

*Résultat (un seul des deux cas) :*
| Ligne | Quoi y mettre |
|---|---|
| **28** | **TVA nette DUE** = ligne 16 − ligne 23 *(si 16 > 23 → vous payez)* |
| **25** | **Crédit de TVA** = ligne 23 − ligne 16 *(si 23 > 16)* |
| **26** | Remboursement de crédit demandé (optionnel) |
| **27** | Crédit **à reporter** sur la prochaine déclaration (→ ira en ligne 22 le mois suivant) |
| **29** | Taxes assimilées (via annexe 3310‑A) |
| **32** | **TOTAL À PAYER** = ligne 28 (+ 29 − crédits) |

> 🧠 Mémo : **16** = TVA collectée totale · **23** = TVA déductible totale · **28** = à payer · **25/27** = crédit.

**▸ Exemple « où mettre quoi »** (mois, réel normal) : ventes 50 000 HT à 20 % · achats+frais 34 000 HT déductibles · immobilisation 2 000 HT · crédit antérieur 300 €.
→ **L.01** 50 000 · **L.08** base 50 000 / taxe **10 000** · **L.16** 10 000 · **L.20** **6 800** · **L.19** **400** · **L.22** **300** · **L.23** 7 500 · **L.28** **2 500** · **L.32** **2 500 à payer**.

### 🧾 CA12 — formulaire **3517‑S‑SD** (CERFA n° 11417) — réel simplifié, annuelle
Récapitule **toute l'année** et **régularise les 2 acomptes** déjà versés (juillet 55 %, décembre 40 %). Lignes clés :

<div class="cerfa" data-form="ca12"></div>
- **Bases HT par taux** (20 / 10 / 5,5 %) puis TVA brute correspondante.
- **TVA déductible** : sur **immobilisations** et sur **autres biens et services**.
- **Acomptes déjà payés** dans l'année → à **déduire**.
- **Résultat** : **TVA due** (à payer) **ou crédit** = solde annuel.

### 🔗 Lien avec le logiciel
Dans **Pennylane** (Fiscalité → TVA) ou **ACD**, ces lignes sont **pré‑remplies** depuis la compta. Votre rôle : **vérifier chaque ligne** (08 = collectée 20 %, 20 = déductible ABS, 19 = immo, 22 = crédit reporté…) **avant** validation par le chef de mission.

### 📎 Formulaires officiels (impots.gouv.fr)
- **CA3** : [formulaire 3310‑CA3‑SD + notice](https://www.impots.gouv.fr/formulaire/3310-ca3-sd/tva-et-taxes-assimilees-regime-du-reel-normal-mini-reel)
- **CA12** : 3517‑S‑SD (régime simplifié) — sur impots.gouv.fr

---

## 6. Cas particuliers de TVA

- **Autoliquidation** (sous-traitance BTP, achats à un fournisseur étranger) : l'acheteur **collecte ET déduit**. Neutre, mais à déclarer.
- **TVA intracommunautaire** (achat de biens UE) : autoliquidation (TVA due + TVA déductible). Vente intracom = exonérée (avec n° TVA client + DEB/état récapitulatif).
- **Importation hors UE** : TVA à l'import **autoliquidée sur la CA3** (réforme 2022) — plus de paiement en douane.
- **TVA sur immobilisations** : déductible (44562) si bien affecté à l'activité taxable ; **non déductible** sur les véhicules de tourisme.
- **TVA non déductible** :
  - Véhicules de tourisme (achat, entretien) ;
  - Carburant : **gazole/essence déductibles à 80 %** pour les VP, **100 %** pour les VU ;
  - Dépenses de logement des dirigeants/salariés ;
  - Cadeaux > seuil unitaire (au-delà du plafond légal) ;
  - Dépenses sans facture conforme.

---

## 7. Contrôles AVANT déclaration (procédure cabinet)
1. **Lettrer / pointer** la banque du mois (TVA encaissements = factures payées).
2. Vérifier que **toutes les ventes** du mois sont saisies (n° de factures continus).
3. Vérifier la **cohérence collectée** : CA HT × taux ≈ TVA collectée.
4. Vérifier la **TVA déductible** : pas de TVA sur assurance, sur VP, sur factures non conformes.
5. Contrôler les comptes **44571 / 44566 / 44562** au grand livre.
6. Vérifier les **autoliquidations / intracom** déclarées.
7. Rapprocher avec la **CA3 du mois précédent** (cohérence, crédit reporté).
8. Éditer un **brouillon** et le faire **valider par le chef de mission** avant télétransmission.

> 🔑 Le collaborateur **prépare** la déclaration ; **la validation et l'envoi** relèvent du chef de mission / expert-comptable.

---

## 8. Erreurs fréquentes à éviter
- Déduire la TVA sur une **assurance** (exonérée) ou sur un **VP**.
- Oublier la TVA sur **encaissements** (déclarer sur factures émises au lieu d'encaissées).
- Doublon de TVA (facture saisie 2 fois).
- Mauvais taux (10 % vs 20 % sur travaux).
- Oublier d'autoliquider un achat intracom / sous-traitance BTP.
- Ne pas reporter le **crédit de TVA** du mois précédent.
- Confondre **HT / TTC** (TVA recalculée à l'envers fausse).

---

## 🧪 Cas pratique 5.1 — Préparer une CA3 mensuelle (réel normal, débits)
Données du mois (TVA 20 %) :
- Ventes de marchandises : 50 000 € HT.
- Achats de marchandises : 30 000 € HT.
- Frais généraux déductibles : 4 000 € HT.
- Achat d'un ordinateur (immo) : 2 000 € HT.
- Crédit de TVA reporté du mois précédent : 300 €.

**Travail :** calculez la TVA à payer.

### ✔️ Correction 5.1
- TVA collectée : 50 000 × 20 % = **10 000 €**
- TVA déductible ABS : (30 000 + 4 000) × 20 % = **6 800 €**
- TVA déductible immobilisations : 2 000 × 20 % = **400 €**
- Crédit antérieur : **300 €**
- **TVA à payer = 10 000 − 6 800 − 400 − 300 = 2 500 €**

Écriture de la déclaration (OD) :
| Compte | Débit | Crédit |
|---|---|---|
| 44571 TVA collectée | 10 000 | |
| 44566 TVA déductible ABS | | 6 800 |
| 44562 TVA déductible immo | | 400 |
| 44567 Crédit de TVA reporté | | 300 |
| 44551 TVA à décaisser | | 2 500 |

Au paiement : 44551 D 2 500 / 512 C 2 500.

---

## 🧪 Cas pratique 5.2 — TVA sur encaissements
Une société de services (à l'encaissement) a émis 12 000 € HT de factures en mars, mais seulement 7 000 € HT ont été **encaissés** en mars. Quelle TVA collectée déclarer sur la CA3 de mars ?

### ✔️ Correction 5.2
TVA collectée mars = sur les **encaissements** = 7 000 × 20 % = **1 400 €** (et non 12 000 × 20 %). Le solde sera collecté au fur et à mesure des encaissements.

---

## 📝 Évaluation de fin de chapitre
**A — QCM (5 pts)**
1. La TVA à décaisser = a) collectée + déductible b) **collectée − déductible**
2. Les prestations de services sont par défaut taxables : a) sur les débits b) **sur les encaissements**
3. Seuil franchise en base **services** 2026 : a) 85 000 € b) **37 500 €**
4. La TVA sur un véhicule de tourisme est : a) déductible b) **non déductible**
5. La déclaration du réel normal est la : a) CA12 b) **CA3**

**B — Cas pratique** : refaire un calcul de CA3 (type 5.1) + écriture.

**Seuil : 14/20.**
**Corrigé A :** 1b · 2b · 3b · 4b · 5b.

---

### 📌 Sources officielles 2026
- Régimes et seuils TVA — [impots.gouv.fr](https://www.impots.gouv.fr/professionnel/les-regimes-dimposition-la-tva)
- Franchise en base — [impots.gouv.fr](https://www.impots.gouv.fr/pro-30042026-tva-franchise-en-base)
- TVA (taux, déclarations) — [impots.gouv.fr/professionnel/tva](https://www.impots.gouv.fr/professionnel/tva)
