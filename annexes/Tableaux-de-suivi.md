# ANNEXE C — Tableaux de suivi & modèles Excel à créer

> Recréer ces tableaux dans Excel / Google Sheets. Colonnes données ci-dessous. 💡 Astuce : 1 onglet par tableau, en-têtes figés, mise en forme conditionnelle sur les statuts/retards.

---

## C1. Suivi de dossier mensuel
| Client | Mois | Pièces reçues (O/N) | Relevés complets (O/N) | Saisie achats | Saisie ventes | Banque | Rapprochement | Lettrage | TVA préparée | TVA validée | Pièces manquantes | Anomalies | Statut | Date livraison |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

Statuts : `À FAIRE / EN COURS / BLOQUÉ / À VALIDER / TERMINÉ`.
Mise en forme : rouge si BLOQUÉ, orange si échéance < 3 jours, vert si TERMINÉ.

---

## C2. Tableau de bord de production (KPI)
| Client | Échéance TVA | Pièces reçues le | Saisie | Banque | TVA | Livré le | Validé | Retour (O/N) | Anomalies | Temps passé |
|---|---|---|---|---|---|---|---|---|---|---|

KPI à calculer (synthèse en bas) :
- **Dossiers traités** : `NB.SI(Statut;"TERMINÉ")`
- **% TVA à l'heure** : livraisons avant échéance / total
- **Taux de retour** : `NB.SI(Retour;"O") / total dossiers` → **cible < 5 %**

---

## C3. État de rapprochement bancaire
| | Côté COMPTA (512) | Côté BANQUE (relevé) |
|---|---|---|
| Solde de départ | | |
| (+) Encaissements non crédités | | |
| (−) Chèques émis non débités | | |
| (+) Opérations sur relevé non saisies | | |
| **Solde corrigé** | `=` | `=` |
Contrôle (cellule) : `=SI(SoldeComptaCorrigé=SoldeBanqueCorrigé;"OK";"ÉCART À CHERCHER")`.

---

## C4. Balance âgée (clients / fournisseurs)
| Tiers | Total dû | 0–30 j | 31–60 j | 61–90 j | > 90 j | Statut |
|---|---|---|---|---|---|---|
Mise en forme : rouge sur la colonne > 90 j ; statut `À RELANCER` si > 60 j.

---

## C5. Suivi des pièces manquantes
| Client | Date détection | Opération (montant/tiers/date) | Type de pièce | Demandé le | Relancé le | Reçu (O/N) | Statut |
|---|---|---|---|---|---|---|---|

---

## C6. Fichier des immobilisations
| Bien | Date mise en service | Base HT | Durée | Taux | Dotation N | Amort. cumulés | VNC |
|---|---|---|---|---|---|---|---|
Contrôles (bas de tableau) :
- `Σ Base HT` = soldes comptes 21/20
- `Σ Amort. cumulés` = soldes comptes 28
- `Σ Dotation N` = compte 6811

---

## C7. Suivi des comptes d'attente (471)
| Date | Montant | Sens (D/C) | Libellé banque | Nature présumée | Action | Relancé le | Statut |
|---|---|---|---|---|---|---|---|
Statut : `EN ATTENTE / IMPUTÉ / À VALIDER`. Objectif : tout passer à IMPUTÉ avant clôture.

---

## C8. Contrôle paie (rapprochement 4 sources)
| Mois | Brut (OD) | Brut (bulletins) | Brut (DSN) | Net (OD) | Net versé (banque) | Cotisations (OD) | Cotisations (DSN) | Cotisations payées | Écart | OK ? |
|---|---|---|---|---|---|---|---|---|---|---|

---

## C9. Carnet d'erreurs personnel (progression)
| Date | Dossier | Erreur | Cause | Correction | Action préventive |
|---|---|---|---|---|---|

> Outil n°1 de montée en compétence : on n'y inscrit chaque retour du cabinet qu'une seule fois.

---

## C10. Planning mensuel multi-clients
| Client | Régime TVA | Échéance | Date réception pièces cible | Date livraison cible | Charge estimée (h) | Semaine |
|---|---|---|---|---|---|---|
But : lisser la charge sur le mois, éviter l'embouteillage de fin de période.
