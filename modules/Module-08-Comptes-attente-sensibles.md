# 3.4 — Comptes d'attente et comptes sensibles

**Niveau :** Intermédiaire · **Durée estimée :** 6–8 h · **Prérequis :** Modules 4, 6, 7

---

## 🎯 Objectifs pédagogiques
- Maîtriser l'usage et l'apurement du 471 et des comptes sensibles (467, 455, 580, 512, TVA, paie).
- Savoir analyser une opération inconnue et décider : imputer, attendre, ou demander.
- Documenter une anomalie de façon traçable.

## 🧩 Compétences
- Apurer le 471 avant clôture.
- Justifier les comptes sensibles.

---

## 1. Le compte 471 — Compte d'attente
Le **471** sert à enregistrer **temporairement** une opération qu'on ne sait pas (encore) imputer : un prélèvement sans facture, un virement reçu non identifié, un montant douteux.

**Règles d'or :**
- Le 471 est une **salle d'attente**, pas une poubelle.
- Chaque ligne en 471 doit avoir un **commentaire** (date, montant, nature présumée, action en cours).
- Le 471 doit être **soldé (= 0)** avant toute clôture/bilan.

---

## 2. Les autres comptes sensibles

| Compte | Nature | Point de vigilance |
|---|---|---|
| **467** Autres comptes débiteurs/créditeurs | Tiers divers (ni client, ni fournisseur classique) | Justifier chaque solde, ne pas en faire un 2e compte d'attente |
| **455** Compte courant d'associé | Apports/retraits de l'associé | Doit être justifié ; un solde **débiteur** en société (SARL/SAS) peut être interdit (abus de biens) → **signaler** |
| **580** Virements internes | Transferts entre comptes financiers | Doit se **solder à 0** ; un solde ≠ 0 = un côté manquant |
| **512** Banque | — | Doit être **rapproché** et justifié (Module 6) |
| **445x** TVA | — | Soldes cohérents avec les déclarations (Module 5) |
| **421/431/437** Paie | — | Doivent correspondre aux bulletins/DSN/paiements (Module 9) |

---

## 3. Méthode : analyser une opération inconnue
Face à une opération non identifiée (souvent au rapprochement bancaire) :
1. **Lire le libellé** bancaire (tiers, référence).
2. **Chercher la pièce** (facture, contrat, échéancier).
3. **Reconnaître un récurrent** (même prélèvement chaque mois ?).
4. **Imputer** si certain ; sinon **471 + commentaire**.
5. **Demander au client / cabinet** si toujours inconnu après recherche.

### Quand imputer / attendre / demander ?
| Situation | Décision |
|---|---|
| Pièce trouvée, nature claire | **Imputer** directement |
| Récurrent identifié (abonnement connu) | Imputer + relancer la facture |
| Montant inconnu, pas de pièce | **471** + commentaire + relance |
| Toujours inconnu après recherche | **Demander** au client (via cabinet) |

---

## 4. Affecter une opération bancaire (arbre de décision)
```
Opération bancaire non saisie ?
 ├─ C'est un encaissement client connu ? → 512 / 411 + lettrer
 ├─ C'est un paiement fournisseur connu ? → 401 / 512 + lettrer
 ├─ C'est une charge avec facture ? → 6xx + TVA / 512
 ├─ C'est un virement entre comptes ? → 580
 ├─ C'est l'associé ? → 455
 └─ Inconnu ? → 471 + commentaire + relance
```

---

## 5. Documenter une anomalie (traçabilité)
Format recommandé du commentaire d'écriture / du fichier de suivi :
`[DATE] [MONTANT] [LIBELLÉ BANQUE] – nature présumée : … – action : pièce demandée le …/relance le … – statut : EN ATTENTE`

> Une anomalie **documentée** est à moitié résolue : le chef de mission voit ce qui a été fait et peut trancher vite.

---

## ✅ Checklist d'apurement du 471
- [ ] Éditer le grand livre 471
- [ ] Chaque ligne a un commentaire
- [ ] Recherche de pièce effectuée pour chaque ligne
- [ ] Opérations récurrentes identifiées
- [ ] Imputations possibles passées
- [ ] Lignes restantes : relance client/cabinet envoyée
- [ ] 580 vérifié (= 0)
- [ ] 455 justifié (alerte si débiteur en société)
- [ ] **471 ramené à 0** (ou liste des restes transmise au chef de mission)

---

## 🧪 Cas pratique 8.1 — Apurement du 471
Le grand livre 471 contient :
- 471 D 250 € — libellé « PRLV ASSURANCE AXA » (facture retrouvée : assurance local)
- 471 D 1 200 € — libellé « VIR » sans précision
- 471 C 3 000 € — libellé « VIR RECU DUPONT » (client connu)
- 471 D 90 € — libellé « PRLV ORANGE » (facture présente)

**Travail :** apurer le compte.

### ✔️ Correction 8.1
- AXA 250 → 616 D 250 / 471 C 250 *(assurance, pas de TVA)*
- ORANGE 90 → 6262 D 75 / 44566 D 15 / 471 C 90
- VIR REÇU DUPONT 3 000 → 471 D 3 000 / 411 C 3 000 + lettrer (encaissement client)
- VIR 1 200 inconnu → **rester en 471**, commentaire + **relance** (demander au client la nature)

Après apurement, il reste **1 200 € en 471** à justifier → transmis au chef de mission avec la relance en cours. Les autres lignes sont soldées.

---

## 🧪 Cas pratique 8.2 — Compte 455 débiteur
En révision, le compte 455 d'une SARL est **débiteur de 8 000 €**. Que faites-vous ?

### ✔️ Correction 8.2
Un compte courant d'associé **débiteur** dans une SARL/SAS signifie que la société a prêté de l'argent à l'associé → potentiellement un **abus de biens sociaux / avance interdite**. Le collaborateur **ne corrige pas seul** : il **documente** (montant, mouvements) et **signale immédiatement au chef de mission / expert-comptable** pour décision (régularisation, requalification).

---

## 📝 Évaluation de fin de chapitre
1. Le 471 doit-il être nul au bilan ? Pourquoi ?
2. Que doit-on toujours mettre sur une ligne en 471 ?
3. À quoi sert le 580 et quel doit être son solde ?
4. Que faire d'un 455 débiteur en SARL ?
5. Donnez l'arbre de décision pour une opération bancaire inconnue.

**Seuil : 7/10.**
**Corrigé :** 1) oui, sinon des comptes sont faux ; il faut tout imputer. 2) un **commentaire** (date, nature présumée, action). 3) virements internes ; solde = **0**. 4) documenter et **signaler au chef de mission** (avance interdite possible). 5) chercher pièce → imputer si certain → sinon 471 + commentaire → demander au client.
