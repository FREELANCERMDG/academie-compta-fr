# 4.10 — SAP — Services À la Personne

**Niveau :** Intermédiaire · **Durée estimée :** 1 h 30 · **Prérequis :** Bases TVA (taux réduits), facturation client, notions de paie

> ⚠️ **Posture offshore :** le collaborateur PRÉPARE et rassemble ; l'expert-comptable VALIDE et SIGNE.

Le SAP est un **secteur réglementé** : un client peut perdre son crédit d'impôt si l'entreprise n'a pas le bon statut ou émet une attestation erronée. Votre rôle en cabinet = sécuriser le triptyque **statut NOVA → bon taux de TVA → attestation fiscale juste**.

## 1. Périmètre et statuts (la base à vérifier en premier)

Deux régimes coexistent, **à ne jamais confondre** car ils conditionnent la TVA et le crédit d'impôt.

| Statut | Comment l'obtenir | Conséquence |
|---|---|---|
| **Déclaration** | Simple enregistrement sur le téléservice **NOVA** (gratuit, dématérialisé) | Ouvre le **crédit d'impôt** au client + **TVA 10 %** sur les activités éligibles |
| **Agrément** | Demande auprès de la **DDETS** (préfecture), valable **5 ans**, obligatoire pour activités « publics fragiles » | Ouvre **TVA 5,5 %** + crédit d'impôt sur ces activités |
| **Autorisation** (Conseil départemental) | Pour aide à domicile des personnes âgées/handicapées (mode prestataire) | Équivalent agrément côté médico-social |

**Règle d'or :** pas de déclaration NOVA active = pas d'attestation fiscale valable = client perd son crédit d'impôt. C'est le **premier contrôle** à faire sur le dossier.

### Activités éligibles (les principales)

| Activité | TVA | Statut requis |
|---|---|---|
| Ménage, repassage, petit jardinage, petit bricolage | **10 %** | Déclaration |
| Soutien scolaire / cours à domicile | **Exonéré** (org. agréé) ou 10 % | Déclaration/Agrément |
| Garde d'enfants **+ de 3 ans** | **10 %** | Déclaration |
| Garde d'enfants **– de 3 ans** | **5,5 %** | Agrément obligatoire |
| Assistance aux **personnes âgées / handicapées / dépendantes** | **5,5 %** | Agrément / Autorisation |

> Le **plafond de jardinage** (5 000 €/an/foyer) et **bricolage** (500 €) limitent l'assiette du crédit d'impôt côté client, pas la TVA.

## 2. La TVA en pratique (le piège du multi-taux)

Une entreprise SAP applique souvent **plusieurs taux sur la même facture**. Le réflexe cabinet : créer **un compte 706 (ou 707) par taux** pour fiabiliser la CA3.

| Taux | Activités | Compte produit suggéré |
|---|---|---|
| **5,5 %** | Public fragile (séniors, handicap, garde – 3 ans) | 706100 |
| **10 %** | Confort (ménage, jardinage, garde + 3 ans) | 706200 |
| **Exonéré** (art. 261-7 CGI) | Certains org. agréés, soutien scolaire | 706300 |

**Attention :** taux réduit = uniquement si l'activité est **rendue au domicile** du client et **facturée par l'entité déclarée/agréée**. Sous-traitance mal cadrée = redressement TVA.

## 3. Le crédit d'impôt client (le vrai argument commercial)

Le **client particulier** bénéficie d'un **crédit d'impôt de 50 %** des sommes versées (art. 199 sexdecies CGI).

- **Plafond général :** 12 000 € de dépenses/an → **6 000 € de crédit max**.
- **Majorations :** +1 500 € par enfant à charge / par membre du foyer > 65 ans, **plafond max 15 000 €** (voire 20 000 € si invalidité).
- C'est un **crédit** (et non une réduction) : remboursé même si le client n'est pas imposable.

> Le collaborateur ne calcule PAS l'IR du client ; il garantit que **les montants figurant sur l'attestation sont exacts et éligibles**, car c'est cette attestation qui alimente la déclaration du client.

### L'avance immédiate (URSSAF) — le dispositif phare 2026

Le client n'attend plus l'année suivante : le **crédit d'impôt est déduit en temps réel**.

| Sans avance immédiate | Avec avance immédiate |
|---|---|
| Client paie **100 %** de la facture | Client paie **50 %** seulement |
| Crédit perçu **N+1** (été) | 50 % **versé directement** à l'entreprise par l'URSSAF |
| Trésorerie client tendue | Reste à charge réel immédiat |

**Mécanique cabinet :** l'entreprise s'inscrit à l'**API Tiers de prestation URSSAF**, déclare chaque prestation, l'URSSAF prélève le client (sa part) et **verse les 50 % restants** à l'entreprise. Côté compta : la créance client se solde en **2 encaissements** (client + URSSAF).

## 4. L'attestation fiscale annuelle (le livrable récurrent)

**Obligation légale :** émettre **avant le 31 mars** une attestation pour **chaque client** (CERFA 11620, dit « attestation de l'année N-1 »).

Mentions obligatoires :
- Identité prestataire + **n° de déclaration/agrément NOVA**
- Nom + adresse du client
- **Montant total payé** sur l'année (TTC, hors avance immédiate déjà déduite)
- Nature des prestations
- Mention des sommes ouvrant droit au crédit d'impôt

> Avec l'avance immédiate, l'attestation ne reprend **que la part réellement payée par le client** (l'URSSAF ayant déjà géré sa moitié) → **erreur fréquente** : ne pas double-compter.

## 5. Spécificités PAIE (à connaître, pas forcément à produire)

| Point | Règle |
|---|---|
| **Convention collective** | CCN des **entreprises de services à la personne** (IDCC 3127) |
| **Mode mandataire vs prestataire** | Prestataire = entreprise = employeur ; Mandataire = particulier = employeur (CESU) |
| **CESU** | Le particulier-employeur paie via **CESU déclaratif** ; l'entreprise n'est PAS sur la paie classique |
| **Temps de trajet** | Souvent rémunéré entre 2 interventions (CCN) |
| **Modulation** | Annualisation fréquente (temps partiel multi-clients) |

Voici une matrice de saisie pour t'entraîner à comptabiliser une facture SAP avec avance immédiate.

<div class="saisie" data-ex="ex1"></div>

## 🧪 Cas pratique

**Contexte :** L'entreprise « DomiPlus » (statut NOVA déclaré + agrément) facture Mme Martin pour juin 2026 :
- Ménage : 20 h × 25 € HT = **500 € HT** (TVA 10 %)
- Aide à sa mère âgée dépendante : 10 h × 28 € HT = **280 € HT** (TVA 5,5 %)
- Mme Martin a opté pour l'**avance immédiate**.

**Travail demandé :** 1) Calculer la facture TTC. 2) Déterminer la part payée par Mme Martin et la part URSSAF. 3) Comptabiliser. 4) Montant à reporter sur l'attestation fiscale.

### Correction

**1) Facture TTC**

| Ligne | HT | Taux | TVA | TTC |
|---|---|---|---|---|
| Ménage | 500,00 | 10 % | 50,00 | 550,00 |
| Aide séniors | 280,00 | 5,5 % | 15,40 | 295,40 |
| **Total** | **780,00** | — | **65,40** | **845,40** |

**2) Avance immédiate (50 %)**

- Total TTC = **845,40 €**
- Part Mme Martin (50 %) = **422,70 €**
- Part URSSAF (50 %) = **422,70 €**

**3) Comptabilisation (chez DomiPlus)**

À la facturation :

| Compte | Libellé | Débit | Crédit |
|---|---|---|---|
| 411 Martin | Client | 845,40 | |
| 706200 | Ventes SAP 10 % | | 500,00 |
| 706100 | Ventes SAP 5,5 % | | 280,00 |
| 44571 10 % | TVA collectée 10 % | | 50,00 |
| 44571 5,5 % | TVA collectée 5,5 % | | 15,40 |

Aux encaissements :

| Compte | Libellé | Débit | Crédit |
|---|---|---|---|
| 512 Banque | Reçu de Mme Martin | 422,70 | |
| 512 Banque | Reçu de l'URSSAF | 422,70 | |
| 411 Martin | Solde client | | 845,40 |

**4) Attestation fiscale**

Montant total payé par le client sur l'année = base du crédit d'impôt. Pour ce mois, la part réellement supportée par Mme Martin (avance déjà déduite) est **422,70 €**. Sur l'attestation annuelle, on cumule **les sommes effectivement payées par le client** ; l'avance immédiate ayant déjà matérialisé la moitié du crédit, **on ne reporte pas les 422,70 € URSSAF** pour éviter le double avantage.

> Crédit d'impôt « théorique » du mois : 50 % × 845,40 = 422,70 € — **déjà obtenu** via l'avance. D'où l'importance de ne pas le recompter sur l'IR.

## ✅ Checklist collaborateur SAP

- [ ] **Statut vérifié** : déclaration NOVA active + agrément/autorisation si public fragile.
- [ ] **N° de déclaration** présent sur factures ET attestations.
- [ ] **Bon taux de TVA** par activité (5,5 / 10 / exo) — comptes 706 séparés.
- [ ] Activité **rendue au domicile** (condition du taux réduit).
- [ ] Si **avance immédiate** : rapprochement encaissements client + URSSAF, créance 411 soldée.
- [ ] **Attestations émises avant le 31/03** pour tous les clients.
- [ ] Attestation = **montant réellement payé par le client** (pas la part URSSAF).
- [ ] Plafonds spécifiques tracés (jardinage 5 000 €, bricolage 500 €).
- [ ] Paie : bonne **CCN (IDCC 3127)**, distinction prestataire / mandataire (CESU).

## 📝 Évaluation

1. Quelle démarche ouvre le crédit d'impôt et la TVA 10 % : déclaration NOVA ou agrément ?
2. Quel taux de TVA pour la garde d'un enfant de 2 ans ? Et pour du ménage simple ?
3. Avec l'avance immédiate, quelle part la facture le client paie-t-il directement ?
4. Quel montant reporter sur l'attestation fiscale annuelle quand le client a utilisé l'avance immédiate ?
5. Date limite d'émission de l'attestation fiscale ?

### Corrigé

1. La **déclaration NOVA** suffit pour le crédit d'impôt et la TVA 10 %. L'**agrément** (DDETS) est requis en plus pour le taux **5,5 %** des publics fragiles.
2. Garde d'un enfant de 2 ans (− 3 ans) = **5,5 %** (agrément obligatoire) ; ménage simple = **10 %**.
3. **50 %** du montant TTC (l'URSSAF verse l'autre moitié directement à l'entreprise).
4. Uniquement la **part réellement payée par le client** (hors part URSSAF déjà déduite), pour éviter le double avantage fiscal.
5. Avant le **31 mars** de l'année N (au titre des sommes payées en N-1).
