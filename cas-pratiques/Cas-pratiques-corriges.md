# MODULE 18 — Cas pratiques complets corrigés

> 10 cas progressifs reproduisant des situations réelles de cabinet. Faire chaque cas **d'abord seul**, puis comparer au corrigé. TVA 20 % sauf mention.

---

## CAS 1 — Saisie d'une facture d'achat avec TVA
**Énoncé :** Facture fournisseur DURAND : marchandises 2 400 € TTC (TVA 20 %), reçue et non payée.

**✔️ Corrigé :** HT = 2 400 / 1,20 = 2 000 ; TVA = 400.
| Compte | Débit | Crédit |
|---|---|---|
| 607 Achats de marchandises | 2 000 | |
| 44566 TVA déductible | 400 | |
| 401 DURAND | | 2 400 |

---

## CAS 2 — Saisie d'une facture sans TVA
**Énoncé :** Facture d'un prestataire en **franchise en base** (mention art. 293 B) : 500 €.

**✔️ Corrigé :** Pas de TVA déductible.
| Compte | Débit | Crédit |
|---|---|---|
| 611 Sous-traitance (ou compte de charge adapté) | 500 | |
| 401 Fournisseur | | 500 |
> Si la facture portait de la TVA à tort → ne pas la déduire, signaler.

---

## CAS 3 — Saisie banque avec affectation des opérations
**Énoncé :** Relevé du mois : (a) virement reçu client MARTIN 3 600 € ; (b) prélèvement Orange 90 € (facture présente) ; (c) frais bancaires 22 € ; (d) virement reçu non identifié 800 €.

**✔️ Corrigé :**
- (a) 512 D 3 600 / 411 MARTIN C 3 600 (+ lettrer)
- (b) 6262 D 75 / 44566 D 15 / 512 C 90
- (c) 627 D 22 / 512 C 22
- (d) 512 D 800 / **471 C 800** + commentaire + relance (nature inconnue)

---

## CAS 4 — Rapprochement bancaire complet
**Énoncé :** Solde comptable 512 = 6 000 D. Solde relevé = 6 350.
Éléments : frais bancaires 50 € non saisis ; chèque émis 500 € non débité ; encaissement client 900 € non encore crédité par la banque.

**✔️ Corrigé :**
1. Saisir les frais : 627 D 50 / 512 C 50 → solde comptable corrigé = **5 950**.
2. État de rapprochement (partir du relevé pour retrouver la compta) :
   - Relevé 6 350
   - **+ chèque émis non débité 500** (compta l'a déjà retiré) → 6 850
   - **− encaissement non crédité 900** (compta l'a déjà ajouté) → **5 950**
3. **5 950 (banque corrigé) = 5 950 (compta corrigé)** ✔️ rapprochement équilibré.

---

## CAS 5 — Lettrage fournisseur avec avoir
**Énoncé :** Compte 401 LEROY : F1 1 500 (C), F2 600 (C), Avoir 100 (D), règlement 2 000 (D).

**✔️ Corrigé :**
- Total dû = 1 500 + 600 − 100 = 2 000.
- Règlement 2 000 → solde tout.
- **Lettre A** : F1 + F2 + Avoir + règlement → D = 100 + 2 000 = 2 100 ; C = 1 500 + 600 = 2 100 ✔️.
- **Solde 401 = 0**, entièrement lettré.

---

## CAS 6 — Préparation TVA mensuelle (réel normal, débits)
**Énoncé :** Mois : ventes 80 000 € HT ; achats marchandises 45 000 € HT ; frais généraux 6 000 € HT ; immo 3 000 € HT ; crédit TVA antérieur 500 €.

**✔️ Corrigé :**
- Collectée : 80 000 × 20 % = 16 000
- Déductible ABS : (45 000 + 6 000) × 20 % = 10 200
- Déductible immo : 3 000 × 20 % = 600
- Crédit antérieur : 500
- **TVA à payer = 16 000 − 10 200 − 600 − 500 = 4 700 €**

Écriture (OD) : 44571 D 16 000 / 44566 C 10 200 / 44562 C 600 / 44567 C 500 / 44551 C 4 700.

---

## CAS 7 — Apurement du compte 471
**Énoncé :** 471 : (a) D 300 « PRLV GAN » (assurance, facture trouvée) ; (b) C 1 200 « VIR REÇU » client connu DUBOIS ; (c) D 150 « FRAIS » inconnu.

**✔️ Corrigé :**
- (a) 616 D 300 / 471 C 300 (assurance, sans TVA)
- (b) 471 D 1 200 / 411 DUBOIS C 1 200 + lettrer
- (c) **rester en 471** (150) + commentaire + relance.
- 471 résiduel = 150 → transmis au chef de mission.

---

## CAS 8 — OD de paie
**Énoncé :** Journal de paie : brut 8 000 ; cotisations salariales 1 800 ; patronales 3 400 ; net 6 200 ; URSSAF 3 800 ; retraite/prév./mutuelle 1 400.

**✔️ Corrigé :**
| Compte | Débit | Crédit |
|---|---|---|
| 641 Salaires bruts | 8 000 | |
| 645 Charges patronales | 3 400 | |
| 421 Net à payer | | 6 200 |
| 431 URSSAF | | 3 800 |
| 437 Autres organismes | | 1 400 |

Contrôle : D 11 400 = C 11 400 ✔️ ; cotisations 1 800 + 3 400 = 5 200 = 3 800 + 1 400 ✔️.
Paiements : 421 D 6 200 / 512 C 6 200 ; 431 D 3 800 + 437 D 1 400 / 512 C 5 200.

---

## CAS 9 — Immobilisation avec amortissement
**Énoncé :** Achat machine le **01/07/2026** : 6 000 € HT, TVA 20 %, durée 5 ans, clôture 31/12/2026.

**✔️ Corrigé :**
- Achat : 2154 D 6 000 / 44562 D 1 200 / 404 C 7 200
- Dotation annuelle pleine : 6 000 / 5 = 1 200 €/an
- Prorata 2026 (6 mois) : 1 200 × 6/12 = **600 €**
- Dotation 31/12/2026 : 6811 D 600 / 28154 C 600
- VNC au 31/12/2026 = 6 000 − 600 = **5 400 €**

---

## CAS 10 — Préparation d'un dossier bilan simple
**Énoncé :** Au 31/12/2026, à régulariser : (a) facture EDF de décembre non reçue, 500 € HT ; (b) assurance 1 200 € payée le 01/07/2026 pour 12 mois ; (c) prestation de décembre facturée en janvier, 4 000 € HT ; (d) dotation amortissement annuelle 600 € (cas 9) ; (e) 471 = 0, banque rapprochée.

**✔️ Corrigé :**
- (a) **FNP** : 60612 D 500 / 44586 D 100 / 408 C 600
- (b) **CCA** : part 2027 = 6 mois = 1 200 × 6/12 = 600 → 486 D 600 / 616 C 600
- (c) **FAE** : 418 D 4 800 / 706 C 4 000 / 44587 C 800
- (d) Amortissement : 6811 D 600 / 28154 C 600
- (e) Contrôles finaux : 471 = 0 ✔️, 512 justifié ✔️, lettrage fait, comptes anormaux vérifiés.

**Dossier bilan à transmettre :** balance révisée + feuilles de travail + rapprochements + fichier immo + détail FNP/FAE/CCA + points en suspens → **validation chef de mission / expert-comptable**.

---

## 🎓 Bonus — Cas transversal « dossier mensuel complet »
**Énoncé :** Boucler le mois de mars d'un dossier TPE (services, réel normal, à l'encaissement). Pièces : 15 factures d'achats, 8 factures de ventes, relevé bancaire, 1 prélèvement sans facture.

**Démarche attendue (procédure cabinet) :**
1. Vérifier régime (services, encaissements) dans le dossier permanent.
2. Saisir achats (bon compte + TVA), ventes.
3. Saisir/rapprocher la banque ; prélèvement sans facture → 471 + relance.
4. Lettrer 401/411.
5. Apurer 471 (ce qui peut l'être).
6. Préparer la **CA3** sur les **encaissements** (TVA collectée = factures payées).
7. Passer la checklist qualité (Module 17).
8. Livrer avec mail « dossier terminé » + brouillon CA3 à valider (Module 15).
