# 3.17 — 🗂️ Le Dossier de Révision (DR) complet : de la balance à la liasse

**Niveau :** vérification **expert**, guidage **débutant** · **Durée :** 3–4 h · **Prérequis :** 3.7 Révision comptable

> En cabinet, la révision se fait dans un **classeur « Dossier de Révision » (DR)** : un onglet par **cycle** (Banque, Immos, Stocks, Clients, Social, TVA, Fiscal…), chacun avec *objectif → travaux effectués → constat → conclusion*, des cases **« Fait par / Revu par »**, un **récap des cadrages** et des **points d'attention** à remonter au client. Quand tous les cycles sont justifiés, on peut **servir la liasse** — y compris ses **cases manuelles** que le logiciel ne remplit pas tout seul.

---

## 1) Le guide utilisateur du DR — comment on travaille en cabinet

1. **Ouvrir le DR** du dossier : renseigner l'en-tête (exercice, régime IS/IR, forme juridique, « préparé par / revu par »).
2. **Dérouler les cycles dans l'ordre** (chaque onglet marqué *Applicable* ou non) :
   - **F — Banque** : état de rapprochement justifié, caisse jamais créditrice ;
   - **B — Immobilisations** : fichier immos = balance, dotations recalculées (prorata) ;
   - **C/D — Stocks & Clients** : inventaire, balance âgée, dépréciations (sur HT) ;
   - **G — CCA / PCA / FNP / FAE** : le cut-off ;
   - **L — Social** : CP, charges sociales, **TNS** (dues vs payées → provision), **IK** (carte grise P.6) ;
   - **L3 — Cadrages TVA** : collectée (par taux) et déductible ;
   - **Fiscal** : réintégrations/déductions → résultat fiscal → IS ;
   - **H — Capitaux propres** : PV d'AG, affectation du résultat, capitaux < ½ capital ?
3. **Récap cadrage** : chaque point de contrôle marqué *satisfaisant / non satisfaisant*.
4. **Points d'attention** : tout ce qui doit remonter au client ou à l'expert-comptable (capital non libéré, 421 non soldé, CP négatifs, TA/FPC impayées…).
5. **Liasse** : reports automatiques du logiciel **+ cases manuelles** (§3) → revue finale de l'expert-comptable.

---

## 2) 🛠️ SIMULATEUR — déroulez un DR TYPE 2026 complet (10 cycles, un seul dossier)

Le dossier **SARL ATELIER RAVINALA** (IS, réel simplifié, clôture 31/12/2026) traverse les **10 onglets du DR** — exactement le chemin d'un débutant guidé jusqu'au travail d'expert :

**① Banque → ② Immos → ③ Cut-off → ④ Social/TNS → ⑤ Cadrage TVA → ⑥ Emprunt (ICNE) → ⑦ Capitaux propres (PV d'AG) → ⑧ Fiscal/IS → ⑨ POST-BILAN → BILAN (Actif = Passif) → ⑩ LIASSE (cases manuelles)**

Chaque cycle a son **tutoriel 📘**, ses **données**, sa **feuille de travail** et sa **vérification**. Le niveau expert est dans la cohérence : les chiffres **se recoupent d'un cycle à l'autre** (la dotation du cycle ② et la provision TNS du cycle ④ se retrouvent dans le résultat du cycle ⑧, l'ICNE du cycle ⑥ dans le bilan du cycle ⑨, le tableau d'emprunt dans la case 195 du cycle ⑩…) — et le **bilan doit tomber juste à l'euro près** avant de servir la liasse.

<div class="simdoc" data-sim="dr"></div>

---

## 3) 🔴 Les cases de la liasse à servir À LA MAIN (les « zones rouges »)

Dans les logiciels (Pennylane, ACD, Quadra…), la liasse se pré-remplit depuis la balance — **sauf ces cases**, à servir manuellement :

**Liasse réel simplifié — 2033 (BIC à l'IS ou à l'IR) :**

| Case | Quoi | D'où vient le chiffre |
|---|---|---|
| **195** (2033-A) | Dettes à **plus d'un an** | **Tableau d'emprunt** : capital restant dû − échéances N+1 |
| **199** (2033-A) | Comptes courants d'associés **débiteurs** | Balance (⚠️ anomalie à signaler en société) |
| **316–330** (2033-B) | **Réintégrations** (amort. excédentaires, impôts non déductibles…) | Feuille « IS calcul » du DR |
| **352 / 356 / 360** (2033-B) | Résultat fiscal / **déficits antérieurs** cumulés | Suivi des déficits (liasse N-1, case 870 de la 2033-D) |
| **374 / 378** (2033-D) | TVA **collectée facturée** / **déductible** de l'exercice | Cadrage TVA — ⚠️ **PAS le solde du compte** : hors à-nouveaux et hors OD de déclaration |
| **376** (2033-E) | Effectif moyen | Si dossier concerné par la **CVAE** |
| **2033-F** | Composition du **capital** | Dossier permanent (à servir à la main s'il n'est pas renseigné dans le logiciel) |

**Liasse réel normal — 2050 et suivants (BIC à l'IR) — renvois du 2053 :**

| Case | Quoi | D'où vient le chiffre |
|---|---|---|
| **A1 / A2** | Cotisations **personnelles de l'exploitant** (dont le **644 non déductible**) | Comptes 644 / 646 |
| **A5** | Cotisations sociales **obligatoires hors CSG/CRDS** | Compte 646 (obligatoires) |
| **A6 / A9** | Cotisations **facultatives** / **obligatoires** | 646 facultatif → A6 · 646 obligatoire → A9 |
| **A7 / A8** | Dont **Madelin** / dont **nouveaux PER** | Feuille Madelin du DR |

> 📌 Réflexe : pour chaque case manuelle, **noter au DR la source du chiffre** (tableau d'emprunt, cadrage TVA, feuille Madelin…) — c'est ce que vérifie le réviseur.

---

## ✅ Checklist « DR bouclé »
- [ ] Tous les cycles *Applicable* sont **justifiés** (récap cadrage tout vert).
- [ ] Provisions d'inventaire passées : CP, TNS (4386), dépréciations, FNP/FAE/CCA/PCA.
- [ ] Cadrage TVA archivé + cases **374/378** servies (facturé, hors AN/OD).
- [ ] Réintégrations/déductions documentées → **352** cohérent avec « IS calcul ».
- [ ] Case **195** = tableau d'emprunt ; **2033-F** servie si dossier permanent vide.
- [ ] **Points d'attention** rédigés pour le client ; « Fait par / Revu par » signés.

## 📝 Évaluation
1. D'où vient le montant de la case **195** ?
2. Que met-on en case **374** — le solde du 44571 ?
3. Pourquoi la dépréciation client se calcule-t-elle sur le **HT** ?
4. Provision TNS : quelle est la formule ?
5. Que contrôle-t-on à l'étape POST-BILAN avant de servir la liasse ?

**Seuil : 4/5.**
**Corrigé :** 1) du **tableau d'emprunt** (capital restant dû − part à moins d'un an). 2) **Non** : la TVA collectée **facturée sur l'exercice**, hors à-nouveaux et OD de déclaration. 3) la TVA est récupérée par ailleurs — seule la perte HT appauvrit l'entreprise. 4) cotisations **dues** sur le revenu de l'année − cotisations **payées** → 646 / 4386. 5) que le **bilan est équilibré** (TOTAL ACTIF = TOTAL PASSIF) après intégration de toutes les OD d'inventaire — sinon un cycle est faux et on y retourne.
