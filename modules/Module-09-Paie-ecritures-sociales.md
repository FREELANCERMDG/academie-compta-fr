# MODULE 9 — Paie et écritures sociales

**Niveau :** Intermédiaire · **Durée estimée :** 8–10 h · **Prérequis :** Module 2
**Chiffres sociaux à jour 2026** (source : urssaf.fr).

---

## 🎯 Objectifs pédagogiques
- Lire un journal de paie et comptabiliser les salaires.
- Maîtriser les comptes 641, 645, 421, 431, 437.
- Comprendre URSSAF, retraite, prévoyance, mutuelle, DSN.
- Contrôler la cohérence OD de paie / bulletins / DSN / paiements.

## 🧩 Compétences
- Passer une OD de paie équilibrée.
- Justifier les charges sociales.

---

## 1. Repères sociaux 2026
- **SMIC** au 1er janvier 2026 : **12,02 €/h**, soit **1 823,03 €** brut/mois (151,67 h). *(Revalorisation au 1er juin 2026 : 12,31 €/h, 1 867,02 €/mois.)*
- **Plafond mensuel de la Sécurité sociale (PMSS) 2026** : **4 005 €** (PASS annuel **48 060 €**).
- Les cotisations se calculent en pourcentage du brut, parfois plafonné au PMSS.

---

## 2. Logique de la paie
```
Salaire BRUT
  − cotisations salariales  = NET à payer au salarié (421)
Salaire BRUT
  + cotisations patronales  = COÛT total employeur
```
- **641** = salaires **bruts** (charge).
- **645** = cotisations **patronales** (charge).
- **421** = net à payer au **salarié** (dette).
- **431** = cotisations dues à l'**URSSAF** (dette).
- **437** = autres organismes (**retraite, prévoyance, mutuelle**) (dette).
- **425** = avances/acomptes au personnel (s'il y en a).

---

## 3. Lire un journal de paie
Le logiciel de paie (**Silae**, RCA, etc.) produit un **journal de paie** = la synthèse comptable mensuelle de toutes les paies. Il indique :
- Total brut, total cotisations salariales, total cotisations patronales par organisme, net à payer.
- C'est **lui** qu'on comptabilise (pas chaque bulletin un par un).

---

## 4. L'OD de paie (écriture mensuelle)

**Étape 1 — Constatation des salaires (à partir du journal de paie)**
| Compte | Libellé | Débit | Crédit |
|---|---|---|---|
| 641 | Salaires bruts | brut | |
| 645 | Charges patronales | patronales | |
| 421 | Net à payer | | net |
| 431 | URSSAF | | cot. URSSAF (sal.+pat.) |
| 437 | Retraite/prévoyance/mutuelle | | cot. (sal.+pat.) |
| (4486 si besoin) | autres | | |

> Équilibre : `641 + 645 (D) = 421 + 431 + 437 (C)`.

**Étape 2 — Paiement des salaires** : 421 D / 512 C.
**Étape 3 — Paiement des cotisations** : 431 D + 437 D / 512 C (à l'échéance URSSAF/caisses).

---

## 5. Les organismes
- **URSSAF** : Sécurité sociale, allocations familiales, CSG/CRDS, assurance chômage (recouvrée par l'URSSAF), FNAL. → compte **431**.
- **Retraite complémentaire (Agirc-Arrco)**, **prévoyance**, **mutuelle** → compte **437** (souvent ventilé en sous-comptes 4371, 4372…).
- **DSN (Déclaration Sociale Nominative)** : déclaration mensuelle unique qui transmet aux organismes les données de paie et déclenche les prélèvements. Produite par le **gestionnaire de paie** (souvent au cabinet) ; le comptable **rapproche** la DSN des écritures.

---

## 5 bis. La DSN — comprendre et contrôler (elle ne se remplit pas « à la main »)

> ⚠️ La **DSN n'est pas un CERFA** à remplir case par case : c'est un **fichier mensuel structuré, généré automatiquement par le logiciel de paie** (Silae, RCA…) à partir des bulletins. Le collaborateur **ne la saisit pas** : il **contrôle** sa cohérence et la **rapproche** de la comptabilité. Voici sa structure pour comprendre ce qu'elle contient.

### Structure (principaux « blocs »)

<div class="cerfa" data-form="dsn"></div>

| Bloc | Contenu |
|---|---|
| **Émetteur** | Le cabinet / logiciel qui transmet |
| **Déclaration** | Type (mensuelle), mois principal déclaré |
| **Entreprise / Établissement** | SIREN, SIRET, code APE, **taux AT/MP** |
| **Individu (salarié)** | État civil, **NIR (n° de sécu)** |
| **Contrat** | Date d'embauche, nature, statut, temps de travail |
| **Rémunération** | Brut, primes, heures |
| **Bases & cotisations** | Bases (plafonnée, déplafonnée, CSG…) + cotisations **par organisme** |
| **Versement** | Montants dus **URSSAF / Agirc‑Arrco / prévoyance** + références de paiement |
| **Prélèvement à la source (PAS)** | PAS prélevé sur les salariés et reversé à la DGFiP |
| **Signalements** | Arrêts maladie, fins de contrat |

### Ce que le collaborateur CONTRÔLE (les 4 sources, cf. §6)
- **Brut DSN = brut des bulletins = compte 641**.
- **Cotisations DSN = comptes 431/437 = prélèvements bancaires**.
- **Net + PAS** cohérents avec les virements salariés.
- DSN **déposée à temps** (le **5** ou le **15** du mois suivant selon l'effectif) → sinon pénalités.
> En cas d'écart, on **ne modifie pas la DSN** soi‑même : on **signale** au gestionnaire de paie / chef de mission.

---

## 6. Contrôles de cohérence (essentiel)
Rapprocher **4 sources** :
1. **OD de paie** (comptabilité)
2. **Bulletins de paie** (total brut, net)
3. **DSN** (déclaration sociale)
4. **Paiements bancaires** (nets versés + cotisations)

Contrôles :
- Σ nets (421) = Σ virements salaires sur le relevé.
- Cotisations 431/437 = montants DSN = prélèvements bancaires.
- 421, 431, 437 **soldés** après paiement (sinon : un net non versé, une cotisation non payée → à expliquer).

---

## ✅ Checklist OD de paie
- [ ] Journal de paie reçu et lisible
- [ ] OD passée et équilibrée (641+645 = 421+431+437)
- [ ] Net (421) = virements salaires du relevé
- [ ] Cotisations = DSN = prélèvements
- [ ] 421/431/437 soldés après paiement
- [ ] Acomptes salariés (425) traités
- [ ] Écarts justifiés et commentés

---

## 🧪 Cas pratique 9.1 — OD de paie
Journal de paie du mois :
- Brut total : 10 000 €
- Cotisations salariales : 2 200 €
- Cotisations patronales : 4 200 €
- Net à payer : 7 800 €
- Répartition cotisations : URSSAF 4 800 € · Retraite/prévoyance/mutuelle 1 600 €

**Travail :** passer l'OD de paie, puis les paiements.

### ✔️ Correction 9.1
**OD de paie :**
| Compte | Débit | Crédit |
|---|---|---|
| 641 Salaires bruts | 10 000 | |
| 645 Charges patronales | 4 200 | |
| 421 Net à payer | | 7 800 |
| 431 URSSAF | | 4 800 |
| 437 Retraite/prévoyance/mutuelle | | 1 600 |

Vérification : D = 14 200 ; C = 7 800 + 4 800 + 1 600 = 14 200 ✔️
*(Contrôle : cotisations totales 2 200 + 4 200 = 6 400 = 4 800 + 1 600 ✔️)*

**Paiement des salaires :** 421 D 7 800 / 512 C 7 800
**Paiement des cotisations :** 431 D 4 800 + 437 D 1 600 / 512 C 6 400

---

## 🧪 Cas pratique 9.2 — Contrôle de cohérence
Après paiement, le compte 421 présente un solde créditeur de 300 €. Qu'est-ce que cela indique ?

### ✔️ Correction 9.2
Un **net non versé** : un salarié n'a pas été payé (ou virement en attente), ou une erreur de montant. À **rechercher** : vérifier le relevé bancaire, identifier le salarié concerné, régulariser ou commenter. Ne pas laisser le 421 non soldé sans explication.

---

## 📝 Évaluation de fin de module 9
1. Quels comptes pour : brut / patronales / net / URSSAF / autres organismes ?
2. Quelle égalité vérifie l'OD de paie ?
3. Quelles 4 sources rapprocher pour contrôler la paie ?
4. PMSS 2026 ?
5. Que signifie un 431 non soldé après paiement ?

**Seuil : 7/10.**
**Corrigé :** 1) 641 / 645 / 421 / 431 / 437. 2) 641+645 = 421+431+437. 3) OD de paie, bulletins, DSN, paiements bancaires. 4) **4 005 €/mois** (PASS 48 060 €/an). 5) une **cotisation non payée** (ou erreur) → à rechercher et justifier.

---

### 📌 Source officielle 2026
- Barèmes SMIC / plafonds — [urssaf.fr](https://www.urssaf.fr/accueil/outils-documentation/taux-baremes/plafonds-securite-sociale.html)
