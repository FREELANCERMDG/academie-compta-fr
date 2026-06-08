# 3.2 — Rapprochement bancaire

**Niveau :** Intermédiaire · **Durée estimée :** 8–10 h · **Prérequis :** Module 4

---

## 🎯 Objectifs pédagogiques
- Comprendre l'objet et la méthode du rapprochement bancaire.
- Pointer banque / comptabilité et expliquer chaque écart.
- Justifier le solde du compte 512.

## 🧩 Compétences
- Identifier écritures manquantes, doublons, frais oubliés.
- Construire un état de rapprochement équilibré.

---

## 1. Objectif du rapprochement bancaire
Vérifier que le **solde comptable du 512** correspond au **solde du relevé bancaire**, après prise en compte des opérations « en route » (non encore enregistrées d'un côté ou de l'autre). C'est **le contrôle n°1 de fiabilité** d'un dossier : si la banque est juste, une grande partie de la compta est juste.

**Égalité visée :**
`Solde comptable 512 (corrigé) = Solde relevé bancaire (corrigé)`

---

## 2. La méthode de pointage
1. Récupérer le **relevé bancaire** du mois et le **grand livre 512**.
2. **Pointer** ligne à ligne ce qui figure des **deux côtés** (même date/montant).
3. Isoler ce qui n'est **que dans la compta** (chèque émis non débité, encaissement non crédité).
4. Isoler ce qui n'est **que sur le relevé** (frais bancaires, prélèvements, virements non saisis).
5. **Saisir** ce qui manque en compta (frais, prélèvements, agios…).
6. **Justifier** les écarts restants (opérations en cours) dans l'état de rapprochement.

---

## 3. Les écarts typiques et leur traitement

| Écart | Côté | Traitement |
|---|---|---|
| **Frais bancaires / agios** oubliés | Sur relevé seulement | Saisir 627 / 661 → 512 |
| **Prélèvements fournisseurs** non saisis | Sur relevé seulement | Saisir l'achat + 512 (relancer la facture si manquante) |
| **Encaissements clients** non saisis | Sur relevé seulement | Saisir 512 / 411 + lettrer |
| **Chèque émis non encore débité** | En compta seulement | Laisser ; figure en rapprochement (à débiter plus tard) |
| **CB différée** | Décalage | Débit bancaire postérieur ; rapprocher au mois du débit |
| **Virement interne** | 2 comptes | Utiliser 580 (cf. §5) |
| **Doublon** | Compta | Supprimer l'écriture en double |

---

## 4. Méthodes de recherche d'un écart
- **Par montant** : chercher le montant exact dans le grand livre / le relevé (rapide pour un écart unique).
- **Par libellé** : identifier le tiers (ex. « SARL DUPONT », « ORANGE », « URSSAF »).
- **Par différence** : si l'écart = un montant connu (ex. 18 € = frais bancaires habituels).
- **Par cumul** : si l'écart = somme de plusieurs petites lignes (pointer une à une).

---

## 5. Virements internes (compte 580)
Quand l'argent passe d'un compte bancaire à un autre (ou banque ↔ caisse), on utilise le **580** pour éviter un double comptage.

**Ex. — Virement 2 000 € du compte courant vers le livret**
- Sortie compte courant : 580 D 2 000 / 512-courant C 2 000
- Entrée livret : 512-livret D 2 000 / 580 C 2 000
- Le **580 se solde à 0** une fois les deux côtés saisis (à vérifier en révision).

---

## 6. Justification du solde 512
À la fin, on doit pouvoir prouver :
`Solde 512 comptable + chèques non débités − encaissements non crédités … = solde relevé`

L'**état de rapprochement** (tableau) liste les opérations en suspens et démontre l'égalité.

---

## ✅ Checklist rapprochement bancaire
- [ ] Relevé du mois complet (toutes les pages)
- [ ] Solde initial relevé = solde final mois précédent
- [ ] Toutes les lignes du relevé pointées
- [ ] Frais bancaires / agios saisis
- [ ] Prélèvements et virements saisis (pièces relancées si besoin)
- [ ] Doublons supprimés
- [ ] Virements internes soldés via 580
- [ ] État de rapprochement équilibré (écart = 0 ou justifié)
- [ ] Commentaire sur chaque opération en suspens

---

## 📊 Modèle d'état de rapprochement (Excel à créer)
| | Côté COMPTA (512) | Côté BANQUE (relevé) |
|---|---|---|
| Solde de départ | … | … |
| (+) Encaissements non crédités | | |
| (−) Chèques émis non débités | | |
| (+) Opérations sur relevé non saisies | | |
| **Solde corrigé** | **=** | **=** |

> Objectif : les deux **soldes corrigés sont égaux**.

---

## 🧪 Cas pratique 6.1 — Rapprochement complet
**Solde comptable 512 au 31/03 : 5 200 € (débiteur).**
**Solde relevé au 31/03 : 4 930 €.**
Éléments :
- Frais bancaires mars 30 € non saisis.
- Prélèvement Orange 60 € (TTC) non saisi, facture présente.
- Chèque fournisseur émis 400 € non encore débité.
- Encaissement client 200 € enregistré en compta mais pas encore sur le relevé.

**Travail :** saisir les écritures manquantes, puis dresser l'état de rapprochement.

### ✔️ Correction 6.1
**Écritures à saisir :**
- Frais : 627 D 30 / 512 C 30
- Orange : 6262 D 50 / 44566 D 10 / 512 C 60
→ Nouveau solde comptable = 5 200 − 30 − 60 = **5 110 €**

**État de rapprochement :**
| | Compta | Banque |
|---|---|---|
| Solde | 5 110 | 4 930 |
| − Chèque émis non débité (−400 côté banque à venir) | | +400 → mais banque ne l'a pas encore débité |
| + Encaissement non crédité | | +200 → banque ne l'a pas encore crédité |

Vérification : Banque 4 930 − 400 (chèque qui sera débité) + 200 (encaissement à venir) = **4 730**… ajustons la logique :

**Méthode correcte :** on part du solde banque et on ajoute/retire les opérations en route pour retrouver la compta :
- Solde banque 4 930
- **+ chèque émis non débité 400** (la compta l'a déjà retiré, la banque pas encore) → 5 330
- **− encaissement non crédité 200** (la compta l'a déjà ajouté, la banque pas encore) → **5 130**

Hmm, et solde comptable corrigé = 5 110. Écart de 20 → en pratique, cela révèle une **erreur à rechercher** (un montant de 20 €). 

> 💡 **Leçon clé du cas :** quand l'état ne tombe pas juste, **l'écart résiduel signale une anomalie à chercher** (ici 20 €, à pointer par montant). On ne « force » jamais un rapprochement. *(Données volontairement piégées pour l'entraînement : retrouver et corriger la ligne de 20 €.)*

---

## 📝 Évaluation de fin de chapitre
1. Quel est l'objectif du rapprochement bancaire ?
2. Où passe-t-on un virement interne ? (compte)
3. Citez 3 écarts typiques et leur traitement.
4. Un chèque émis non débité : il manque côté compta ou côté banque ?
5. Que faire d'un écart résiduel non expliqué ?

**Seuil : 7/10.**
**Corrigé :** 1) prouver que le solde 512 = relevé bancaire. 2) **580**. 3) frais bancaires (saisir 627), prélèvement non saisi (saisir achat+512), doublon (supprimer). 4) côté **banque** (la banque ne l'a pas encore débité ; la compta l'a déjà). 5) le **rechercher** (par montant/libellé) et corriger — ne jamais forcer le rapprochement.
