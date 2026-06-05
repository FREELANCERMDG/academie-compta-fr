# MODULE — Spécificités & cas particuliers du cabinet

**Niveau :** Avancé · **Durée :** 8–10 h · **Prérequis :** Modules 1 à 4
> Sujets « experts » fréquents en cabinet français, souvent sources de redressement. *(Aligné sur les documents internes du cabinet.)*

---

## 1) 🚗 Fiscalité automobile — VP vs VU
**La carte grise décide** (case **J.1**) — on ne devine pas, on demande le **certificat d'immatriculation**.

| | **VP** (tourisme — mention **VP**) | **VU** (utilitaire — mention **CTTE**) |
|---|---|---|
| TVA sur **achat** | ❌ **non récupérable** | ✅ **100 % récupérable** |
| TVA **entretien/pneus** | ❌ non récupérable | ✅ récupérable |
| **Amortissement** | **plafonné** (limite de déductibilité) | **100 % déductible** (pas de plafond) |

**Astuce :** banquette arrière ➔ **VP** (pas de TVA) ; camionnette / 2 places société ➔ **VU** (TVA OK).
**Carburant (TVA déductible) :** gazole **80 % VP / 100 % VU** ; essence alignée sur le gazole. Électricité (recharge) : 100 %.
> Plafonds d'amortissement VP selon le taux de CO₂ (de 9 900 € à 30 000 € — à vérifier chaque année). Voir aussi les **taxes sur l'affectation des véhicules** (ex‑TVS).

---

## 2) 🧾 La DAS2 (déclaration des honoraires)
**Déclaration d'information** (pas de paiement) : si la société verse des **honoraires/commissions/courtages** à un tiers (avocat, expert, consultant…), elle doit le déclarer.
- 🆕 **Seuil : 2 400 € par an et par bénéficiaire** — **relevé** de 1 200 € à **2 400 €** pour les sommes **versées à partir de 2024** (déclarées en 2025), CGI art. **240/241**. On ne déclare **que ce qui dépasse 2 400 €**.
- **Pratique cabinet (révision) :** éditer le **grand livre des comptes 6226 (honoraires)** et **6222 (commissions)** → lister les bénéficiaires **> 2 400 €/an** → vérifier **Nom, SIRET, adresse, montant** → déclarer.
- **Quand & comment :** en principe en **mai**, **avec la déclaration de résultats** (la DAS2 y est largement intégrée). **Télédéclaration obligatoire** (EDI/EFI) depuis 2018.
- ⚠️ **Sanction (CGI art. 1736)** : amende possible, mais **tolérance** en cas de **1re infraction / bonne foi** si l'omission est **régularisée** (et si le bénéficiaire a bien déclaré les sommes). → rester rigoureux malgré tout.
> Source : [BOFIP — relèvement du seuil à 2 400 €](https://bofip.impots.gouv.fr/bofip/14327-PGP.html/ACTU-2024-00154) · [service‑public — déclaration d'honoraires](https://entreprendre.service-public.fr/actualites/A18083).

<div class="cerfa" data-form="das2"></div>

---

## 3) ☀️ TVA en période de congés payés (acompte)
Entreprise fermée un mois l'été → possibilité de **télédéclarer un acompte** au lieu de la déclaration détaillée.
- L'acompte doit être **≥ 80 %** de la somme acquittée le mois précédent **ou** de la somme réellement exigible.
- En cas de **crédit de TVA** le mois précédent : il suffit de **reporter le crédit**.
- **Régularisation** au retour des congés (déclaration suivante).

---

## 4) 💶 Intérêts courus (ICNE) — écriture d'inventaire
À la clôture, des **intérêts d'emprunt** courent entre le dernier règlement et la date de clôture mais ne sont pas encore comptabilisés.
- **À la clôture :** **661** (charges d'intérêts) **D** / **1688** (intérêts courus) **C**.
- **À l'ouverture N+1 :** **extourne** (contrepassation) de l'écriture.
> Même logique pour les **intérêts courus à recevoir** sur placements (au crédit du 76 / débit du 5088).

---

## 5) 🔻 Créances douteuses & irrécouvrables
1. **Client qui ne paie plus** → reclasser **411 → 416** (clients douteux).
2. **Dépréciation** (sur le **HT**, si recouvrement incertain) : **6817 D / 491 C** *(validation EC)*.
3. **Créance définitivement perdue (irrécouvrable)** :
   - **654** (pertes sur créances) **D** (HT) + **44571** (récupération de la **TVA collectée**) **D** / **416** (ou 411) **C** (TTC) ;
   - **reprise de la dépréciation** : **491 D / 7817 C**.
> Il faut un **justificatif** (PV de carence, liquidation…) pour récupérer la TVA. Décision **EC**.

---

## 6) ↔️ Frais & débours (compte 461)
La société **avance des frais pour le compte de son client** (ex. frais de greffe) puis les **refacture au centime près**.
- Ce **n'est pas une charge** (pas de TVA déductible) ni du **chiffre d'affaires** (pas de TVA collectée).
- **Paiement pour le client :** **461 D / 512 C** (montant **TTC**).
- **Refacturation au client :** **411 D / 461 C** (même montant).
- Seule la **prestation réalisée** est du **CA avec TVA** (706 / 44571).

---

## 7) 🎓 CIFD — Crédit d'Impôt Formation du Dirigeant
- **Calcul :** **nombre d'heures de formation (max 40 h/an) × taux horaire du SMIC** de l'année.
- **Condition :** organisme avec **agrément formation** (mention sur la facture).
- **Société à l'IS :** écriture **695xx D / 444 C** ; le crédit est **réintégré fiscalement**.
- **Société à l'IR :** **pas d'écriture** ; on **indique le montant dans le rapport** (les associés l'imputent sur leur déclaration personnelle).

---

## 8) 🏭 Comptabilité par secteur (les réflexes)
**Négoce / commerce de détail :** achats **607**, ventes **707**, **variation de stock 6037** ; saisir le **« Z » de caisse** (récapitulatif journalier) ; surveiller la **marge** et le **taux de TVA** (20 %, 5,5 % alimentaire).
**Prestations de services :** achats sous‑traitance **604**, ventes **706** ; point critique = **cut‑off / travaux en cours** ; TVA souvent sur **encaissements**.
**BTP (bâtiment) :** voir §9 (autoliquidation, retenue de garantie, caisse de congés).

---

## 9) 🏗️ BTP — autoliquidation de la sous‑traitance (point n°1 de redressement)
Depuis 2014, **pas de TVA facturée entre le sous‑traitant et le donneur d'ordre** : c'est le **donneur d'ordre qui autoliquide** (CGI **art. 283‑2 nonies**).
- **Sous‑traitant (fait le travail)** : facture **HT**, **mention « Autoliquidation de la TVA due par le preneur »** ; compta **704 (travaux)** ; sur la **CA3**, le CA va en **ligne 05** (autres opérations non imposables).
- **Donneur d'ordre (entreprise principale)** : reçoit une facture **HT** → **danger** : il ne faut pas « ne rien faire ».
  - **Écriture :** charge **604/605 D** ; **collecter la TVA 4457 C** **et** la **déduire 44566 D** simultanément.
  - *Ex. sous‑traitant 1 000 € HT :* 604 = 1 000 D / 401 = 1 000 C ; 44566 = 200 D / 4457 = 200 C (neutre, mais **obligatoire** sur la CA3).
- **Retenue de garantie** (souvent 5 %) : retenue par le client sur les situations de travaux → compte **4117** (clients – retenues de garantie), libérée à la levée des réserves.
- **Caisse de congés payés du BTP** : les congés sont gérés par une caisse → cotisations spécifiques (pas de provision congés classique).

---

## 10) 🩺 BNC (professions libérales) — logique de trésorerie
- **Règle d'or :** « si ce n'est pas sur le relevé bancaire, ça n'existe pas » (**recettes encaissées / dépenses payées**). *(Exception : chèque reçu le 28/12 = imposable en N.)*
- **Micro‑BNC** : CA ≤ **83 600 €** (2026) → abattement **34 %**, pas de liasse.
- **Déclaration contrôlée (réel)** : liasse **2035** (2035‑A / 2035‑B).
- **Plan comptable spécifique** : **compte de l'exploitant 108** (pas de « salaire » du praticien : ses prélèvements passent en 108).

---

## ✅ Checklist « réflexes cas particuliers »
- [ ] Véhicule : carte grise vérifiée (VP→pas de TVA / VU→TVA) ; carburant au bon %
- [ ] Honoraires > 2 400 €/an/bénéficiaire recensés pour la **DAS2**
- [ ] BTP : **autoliquidation** sous‑traitance déclarée (donneur d'ordre)
- [ ] Clôture : **intérêts courus** (661/1688) passés et extournés à l'ouverture
- [ ] Créances : douteux (416) + dépréciation, irrécouvrables (654 + TVA) avec justificatif
- [ ] Débours refacturés en **461** (ni charge, ni CA)
- [ ] **CIFD** calculé si formation dirigeant (max 40 h × SMIC)

---

## 📝 Évaluation
1. Comment savoir si un véhicule est VP ou VU ? TVA sur l'achat d'un VP ?
2. Seuil et comptes de la DAS2 ?
3. Écriture des intérêts courus à la clôture ?
4. Écriture d'une créance irrécouvrable ?
5. BTP : que fait le **donneur d'ordre** en recevant une facture de sous‑traitant ?

**Seuil : 7/10.** **Corrigé :** 1) **carte grise case J.1** (VP/CTTE) ; VP = TVA **non récupérable**. 2) **2 400 €/an/bénéficiaire** (depuis 2024) ; comptes **6226/6222**. 3) **661 D / 1688 C** (extourné à l'ouverture). 4) **654 (HT) + 44571 (TVA) D / 411‑416 (TTC) C** + reprise dépréciation. 5) charge **604/605** + **collecter (4457) ET déduire (44566)** la TVA (autoliquidation).
