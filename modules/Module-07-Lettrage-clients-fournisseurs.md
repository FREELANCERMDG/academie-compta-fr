# MODULE 7 — Lettrage clients et fournisseurs

**Niveau :** Intermédiaire · **Durée estimée :** 8 h · **Prérequis :** Modules 4 et 6

---

## 🎯 Objectifs pédagogiques
- Comprendre pourquoi et comment lettrer les comptes de tiers.
- Gérer écarts de règlement, avoirs, règlements partiels, trop-payés.
- Justifier les comptes 401 et 411 et produire une balance âgée.

## 🧩 Compétences
- Lettrer automatiquement et manuellement.
- Détecter clients douteux, fournisseurs débiteurs, clients créditeurs.

---

## 1. Pourquoi lettrer ?
Le **lettrage** associe une facture à son **règlement** dans un compte de tiers (401/411). Il permet de savoir, à tout moment :
- ce qui est **payé** (lettré),
- ce qui reste **dû** (non lettré).

Un compte 411 / 401 bien lettré = on lit immédiatement les **créances et dettes réelles**. C'est la base de la **balance âgée** et des **relances**.

---

## 2. Lettrage automatique vs manuel
- **Automatique** : l'outil rapproche facture/règlement de **même montant** (Pennylane, ACD, Sage…). Rapide mais ne gère pas bien les écarts.
- **Manuel** : nécessaire pour les **écarts**, regroupements (plusieurs factures = 1 règlement), avoirs, acomptes.

**Méthode manuelle :**
1. Ouvrir le grand livre du tiers.
2. Associer chaque règlement à sa/ses facture(s).
3. Attribuer une **lettre** (A, B, C…) aux lignes qui se compensent (total débit = total crédit pour cette lettre).
4. Les lignes **non lettrées** = restant dû / restant à encaisser.

---

## 3. Gestion des cas particuliers

| Cas | Traitement |
|---|---|
| **Écart de règlement** (centimes, frais) | Solder via 658/758 (charges/produits divers) ou 627 si frais bancaires ; lettrer ensuite |
| **Avoir** | Lettrer l'avoir avec la facture correspondante (ou le règlement net) |
| **Règlement partiel** | Lettrage partiel ; le solde reste non lettré (à suivre) |
| **Trop-payé client** | Le 411 devient **créditeur** → dette envers le client (à rembourser ou imputer) |
| **Fournisseur débiteur** | 401 **débiteur** (avoir non utilisé, acompte, double paiement) → à régulariser |
| **Escompte** accordé/obtenu | 665 (escompte accordé) / 765 (escompte obtenu) |

**Ex. — Écart de 0,50 € sur règlement client** :
512 D (montant reçu) / 411 C (montant facture) / 658 D 0,50 → puis lettrage.

---

## 4. Comptes clients douteux
Quand un client ne paie pas (litige, défaillance) :
- Reclasser la créance en **416 Clients douteux**.
- Constater une **dépréciation** (provision) si recouvrement incertain (681 / 491) — **sur instruction du chef de mission**.
- Si créance définitivement perdue : passer en **654 (créances irrécouvrables)** + régularisation TVA — **validation cabinet**.

---

## 5. Justification des comptes 401 / 411 et balance âgée
- **Justifier le 401** : le solde = factures fournisseurs **réellement dues** (rapprocher avec les relevés fournisseurs).
- **Justifier le 411** : le solde = factures clients **réellement à encaisser**.
- **Balance âgée** : classe les créances/dettes par **ancienneté** (0–30 j, 30–60 j, 60–90 j, > 90 j). Outil de relance et d'analyse du risque.

---

## ✅ Checklist lettrage
- [ ] Lettrage automatique lancé
- [ ] Règlements partiels identifiés et suivis
- [ ] Avoirs lettrés avec leur facture
- [ ] Écarts de règlement soldés (658/758/627)
- [ ] Comptes 411 créditeurs analysés (trop-payés)
- [ ] Comptes 401 débiteurs analysés (acomptes/avoirs)
- [ ] Créances anciennes signalées (clients douteux)
- [ ] Balance âgée éditée
- [ ] Comptes 401/411 justifiés (rapprochement relevés)

---

## 📊 Balance âgée (modèle Excel à créer)
| Tiers | Total dû | 0–30 j | 31–60 j | 61–90 j | > 90 j | Statut |
|---|---|---|---|---|---|---|

---

## 🧪 Cas pratique 7.1 — Lettrage fournisseur avec avoir
Compte 401 « SARL MARTIN » :
- Facture F1 : 1 200 € (crédit)
- Facture F2 : 800 € (crédit)
- Avoir A1 : 200 € (débit)
- Règlement par virement : 1 800 € (débit)

**Travail :** lettrer et indiquer le solde restant.

### ✔️ Correction 7.1
- F1 (1 200) + F2 (800) = 2 000 dus
- Avoir A1 (−200) → net dû = 1 800
- Règlement 1 800 → solde le net.
- **Lettre A** : F1 + F2 + A1 + règlement → total débit (200 + 1 800 = 2 000) = total crédit (1 200 + 800 = 2 000). ✔️ équilibré.
- **Solde du compte = 0 €**, entièrement lettré.

---

## 🧪 Cas pratique 7.2 — Client créditeur
Le compte 411 « DUPONT » présente un solde **créditeur de 150 €** après lettrage. Qu'est-ce que cela signifie et que faire ?

### ✔️ Correction 7.2
Un 411 créditeur = le client a **trop payé** (ou a versé un acompte). C'est une **dette** de l'entreprise envers lui. À : soit **rembourser**, soit **imputer** sur une prochaine facture. À signaler et **reclasser éventuellement en 4191 (clients – avoirs/acomptes)** en clôture. Ne jamais laisser sans explication.

---

## 📝 Évaluation de fin de module 7
1. À quoi sert le lettrage ?
2. Que signifie un 401 débiteur ? un 411 créditeur ?
3. Comment solder un écart de règlement de quelques centimes ?
4. Qu'est-ce qu'une balance âgée ?
5. Où reclasse-t-on un client qui ne paie plus ?

**Seuil : 7/10.**
**Corrigé :** 1) associer factures et règlements pour connaître le restant dû. 2) 401 débiteur = acompte/avoir/double paiement (le fournisseur nous doit) ; 411 créditeur = trop-payé/acompte client (on lui doit). 3) via 658/758 (ou 627 si frais), puis lettrer. 4) tableau des créances/dettes classées par ancienneté. 5) **416 Clients douteux** (+ dépréciation sur validation).
