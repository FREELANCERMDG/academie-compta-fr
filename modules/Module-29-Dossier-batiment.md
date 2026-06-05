# MODULE — Dossier BÂTIMENT (BTP) : fiscal, comptable & saisie des factures

**Niveau :** Avancé · **Durée :** 8–10 h · **Prérequis :** Modules 1 à 4 + leçon « Spécificités & cas particuliers »
> Le BTP est le **secteur n°1 de redressement** : TVA à taux multiples, **autoliquidation**, **retenue de garantie**, **situations de travaux**. Cette leçon couvre **tout** : aspects fiscaux, traitement comptable et **saisie des factures pas à pas**.

**Dossier permanent BTP à réunir :** contrats de **sous‑traitance** (+ DC4), **cautions** (retenue de garantie), **attestation d'assurance décennale**, devis (avec mention TVA), **situations**, **DGD** (décompte général définitif), **PV de réception**.

---

## 1) 🧱 Les comptes du BTP (à connaître par cœur)
| Compte | Usage |
|---|---|
| **604** | Sous‑traitance (achats d'études et de travaux) |
| 605 / 6063 | Achats de matériel & équipements / fournitures de chantier |
| 6135 | Locations (échafaudage, engins) |
| **704** | Travaux (ventes du BTP) |
| **4117** | Clients — **retenues de garantie** (à recevoir) |
| **4047** | Fournisseurs — retenues de garantie (sur sous‑traitants) |
| 4181 | Clients — factures à établir (situations non émises) |
| **4191** | Clients — acomptes / avances reçus |
| 33/34 · 7133 | Travaux en cours · variation |
| 44571 / 44566 | TVA collectée / déductible (par taux 20·10·5,5) |
| **4452 / 4457** | TVA due intracom / **autoliquidation** sous‑traitance |

---

## 2) 💶 La TVA dans le BTP (le cœur)
### a) Le bon taux selon le chantier
| Taux | Travaux concernés |
|---|---|
| **20 %** | Construction **neuve** / reconstruction · locaux **professionnels** · gros équipements |
| **10 %** | **Amélioration, transformation, aménagement, entretien** de **logements achevés depuis + de 2 ans** |
| **5,5 %** | **Rénovation énergétique** (isolation, chauffage performant…) de logements de + de 2 ans |

> 🆕 **Depuis le 1er mars 2025** : plus d'attestation 1300‑SD/1301‑SD. Une **simple mention** sur le **devis ou la facture**, par laquelle le client **certifie** que les conditions du taux réduit sont remplies, suffit. (Conserver les justificatifs.)
> Sources : [impots.gouv — taux TVA travaux](https://www.impots.gouv.fr/professionnel/questions/quel-taux-de-tva-appliquer-pour-les-travaux-realises-dans-les-logements) · [service‑public — la mention remplace l'attestation (2025)](https://www.service-public.fr/particuliers/actualites/A18088).

### b) Autoliquidation de la sous‑traitance (CGI art. 283‑2 nonies)
**Entre sous‑traitant et donneur d'ordre, PAS de TVA sur la facture.** C'est le **donneur d'ordre** qui autoliquide.
- **Sous‑traitant** : facture **HT**, mention *« Autoliquidation de la TVA due par le preneur »* ; compte **704**.
- **Donneur d'ordre** : charge **604** + **collecte (4457) ET déduit (44566)** la TVA simultanément → impact net 0, mais **obligatoire** sur la CA3.

### c) Exigibilité
Travaux = prestations → **TVA exigible à l'encaissement** (sauf option débits). **Acompte reçu → TVA due dès l'encaissement.**

---

## 3) 🔒 La retenue de garantie (loi n° 71‑584 du 16/07/1971)
- **Maximum 5 %** du montant du marché, retenue par le client **jusqu'à la réception**.
- **Libérée 1 an après** la réception complète (sauf réserves non levées).
- Peut être **remplacée par une caution bancaire** (l'entreprise est alors payée à 100 %).
- **Côté entreprise (on subit la retenue du client)** : la part retenue = **créance** → compte **4117**.
- **Côté sous‑traitant (on retient 5 % à notre sous‑traitant)** : la part retenue = **dette** → compte **4047** (on paiera plus tard).

---

## 4) 📑 La facturation par situations de travaux
Sur un chantier long, on facture par **situations** (avancement périodique).
- Une **situation** rend l'entreprise **immédiatement créancière** → c'est une **créance acquise** = **produit (704)**, **pas** des « travaux en cours ».
- À la clôture : les travaux **figurant sur la dernière situation** = produit ; les travaux réalisés **non encore mis en situation** = **travaux en cours (33/34)** valorisés **au coût** (FAE possible).
- En fin de chantier : **DGD** (décompte général définitif).
> Source : [BOFIP — situations de travaux = créances acquises](https://bofip.impots.gouv.fr/bofip/1483-PGP.html/identifiant=BOI-BIC-PDSTK-10-10-10-20120912).

---

## 5) ⌨️ SAISIE DES FACTURES — pas à pas (exemples chiffrés)

### A) Facture FOURNISSEUR de matériaux (achat)
*Matériaux 1 000 € HT, TVA 20 %.*
```
605/6063  Achats ............. 1 000,00  (D)
44566     TVA déductible .......  200,00  (D)
   401    Fournisseur ....................... 1 200,00 (C)
```

### B) Facture SOUS‑TRAITANT (autoliquidation) + retenue 5 %
*Sous‑traitant « PEINTURE PRO » : 5 000 € HT, pas de TVA. On lui retient 5 % de garantie.*
```
604    Sous‑traitance ...... 5 000,00 (D)
   401   Sous‑traitant ..................... 5 000,00 (C)
— Autoliquidation de la TVA (donneur d'ordre) :
44566  TVA déductible ...... 1 000,00 (D)
   4457  TVA collectée (autoliq.) .......... 1 000,00 (C)
— Retenue de garantie 5 % sur le sous‑traitant (250 €) :
401    Sous‑traitant ......... 250,00 (D)
   4047  Retenue de garantie (dette) ......... 250,00 (C)
```
*(Sur la CA3 du donneur d'ordre : base autoliquidée en ligne 02/«autres opérations imposables», TVA en 17, déduction en 20.)*

### C) SITUATION DE TRAVAUX émise au CLIENT (vente), TVA 10 % + retenue 5 %
*Situation n°3 : 10 000 € HT · TVA 10 % = 1 000 € · TTC = 11 000 € · retenue 5 % du TTC = 550 €.*
```
411    Client (net réclamé) .. 10 450,00 (D)
4117   Retenue de garantie ...... 550,00 (D)
   704   Travaux ......................... 10 000,00 (C)
   44571 TVA collectée (10 %) .............. 1 000,00 (C)
```
> La TVA (1 000 €) est **due intégralement** maintenant : la retenue ne décale **que le paiement**, pas l'exigibilité.

### D) ACOMPTE client reçu (avance de démarrage)
*Acompte de 3 300 € TTC (dont TVA 10 % = 300 €).*
```
512    Banque ............. 3 300,00 (D)
   4191  Clients — acomptes ............... 3 000,00 (C)
   44571 TVA collectée .....................  300,00 (C)
```
*(L'acompte sera **déduit** sur la 1re situation : 4191 D / 411 C.)*

### E) RÉCEPTION + libération de la retenue de garantie (1 an après)
*Encaissement de la retenue de 550 € après PV de réception sans réserve.*
```
512    Banque ............. 550,00 (D)
   4117  Retenue de garantie ............... 550,00 (C)
```
*(Si une **caution bancaire** avait remplacé la retenue, le client aurait payé les 11 000 € dès la situation : pas de 4117.)*

---

## 6) 👷 Spécificités sociales & charges BTP
- **Caisse de congés payés (CIBTP)** : l'employeur **cotise à la caisse**, qui paie ensuite les congés des salariés → on comptabilise les **cotisations** (pas de provision pour congés « classique » sur la part gérée par la caisse).
- **Chômage‑intempéries** : cotisation spécifique (CIBTP).
- **Indemnités BTP** : paniers, trajets/transport, **grands déplacements** (régime social/fiscal particulier).

---

## 7) 🧮 Travaux de clôture spécifiques BTP
- **Situations non encore facturées** → **4181 / 704** (FAE).
- **Travaux en cours** (non mis en situation) → **33/34** au coût.
- **Provision pour garanties** données aux clients (SAV/parfait achèvement) → **6815 / 1518**.
- **Provision pour pénalités de retard** si probable.
- **Dépréciation** des créances douteuses (chantiers litigieux).
- Contrôler **4117/4047** (retenues), **4191** (acomptes soldés), **autoliquidation** déclarée.

---

## ✅ Checklist « dossier bâtiment »
- [ ] **Bon taux de TVA** par chantier (20/10/5,5) + **mention** sur devis/facture
- [ ] **Sous‑traitance autoliquidée** (604 + 4457/44566) déclarée sur la CA3
- [ ] **Retenues de garantie** suivies : **4117** (clients) / **4047** (sous‑traitants)
- [ ] **Situations** comptabilisées en **704** (créances acquises), acomptes **4191** soldés
- [ ] Clôture : travaux en cours, FAE (4181), provisions garanties/pénalités
- [ ] Cotisations **CIBTP** (congés + intempéries) à jour

## 📝 Évaluation
1. Quels sont les 3 taux de TVA possibles sur un chantier et leurs conditions ?
2. Depuis 2025, qu'est‑ce qui remplace l'attestation TVA travaux ?
3. Écriture chez le **donneur d'ordre** d'une facture de sous‑traitant de 5 000 € HT.
4. Plafond et durée de la **retenue de garantie** ? Quel compte chez l'entreprise qui la subit ?
5. Une **situation de travaux** est‑elle un produit ou un « travaux en cours » ?

**Seuil : 7/10.** **Corrigé :** 1) **20 %** (neuf/pro), **10 %** (amélioration logement +2 ans), **5,5 %** (rénovation énergétique +2 ans). 2) une **simple mention** du client sur le **devis/facture**. 3) `604 = 5 000 D / 401 = 5 000 C` + autoliquidation `44566 = 1 000 D / 4457 = 1 000 C`. 4) **5 % max**, libérée **1 an** après réception ; compte **4117**. 5) un **produit** (créance acquise, compte 704), **pas** des travaux en cours.
