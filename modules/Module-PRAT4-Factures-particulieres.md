# 3.11 — Saisir les factures particulières (cas réels)

Les écritures « classiques » sont faciles. Le métier se joue sur les **cas particuliers** et les **règles de TVA françaises**. Voici des **factures simulées** et leur **saisie exacte**.

---

## 1) 🧾 Recette journalière (Z de caisse) — ventilation par taux
**Pièce :** ticket Z d'une boulangerie. Pain **5,5 %** : 1 000 € HT (TVA 55) · Autres **20 %** : 500 € HT (TVA 100). Encaissé : **CB 1 200 €**, **espèces 455 €**. Total **1 655 € TTC**.

<table class="ecr"><caption>Journal CA · 31/01 · Recette du jour (Z de caisse)</caption><thead><tr><th>Compte</th><th>Libellé</th><th class="d">Débit</th><th class="c">Crédit</th></tr></thead><tbody><tr><td>511500</td><td>Cartes bancaires à l'encaissement (CB)</td><td class="d">1 200,00</td><td class="c"></td></tr><tr><td>531000</td><td>Caisse (espèces)</td><td class="d">455,00</td><td class="c"></td></tr><tr><td>707000</td><td>Ventes de marchandises</td><td class="d"></td><td class="c">1 500,00</td></tr><tr><td>445715</td><td>TVA collectée 5,5 %</td><td class="d"></td><td class="c">55,00</td></tr><tr><td>445720</td><td>TVA collectée 20 %</td><td class="d"></td><td class="c">100,00</td></tr><tr class="tot"><td></td><td>Total</td><td class="d">1 655,00</td><td class="c">1 655,00</td></tr></tbody></table>

> 🇫🇷 **Particularité :** une recette se **ventile par taux de TVA**, le **Z de caisse** est la pièce justificative, et on distingue les **modes d'encaissement**. Les **encaissements par carte** transitent par le **511 (cartes bancaires à l'encaissement)** : ils seront soldés vers le **512 (banque)** quand l'opérateur crédite le compte (souvent J+1, parfois net de commission). Les **espèces** vont en **531 (caisse)** — qui ne doit **jamais être créditrice**.

---

## 2) 🧾 Note de frais salarié
**Pièce :** note de frais d'un salarié. Train **60 €**, restaurant **33 € TTC** (TVA 10 %), péage **24 € TTC** (TVA 20 %). À rembourser : **117 €**.

<table class="ecr"><caption>Journal OD · Note de frais — M. RAKOTO</caption><thead><tr><th>Compte</th><th>Libellé</th><th class="d">Débit</th><th class="c">Crédit</th></tr></thead><tbody><tr><td>625100</td><td>Voyages et déplacements (train)</td><td class="d">60,00</td><td class="c"></td></tr><tr><td>625700</td><td>Réceptions (restaurant)</td><td class="d">30,00</td><td class="c"></td></tr><tr><td>625100</td><td>Déplacements (péage)</td><td class="d">20,00</td><td class="c"></td></tr><tr><td>445660</td><td>TVA déductible (3,00 + 4,00)</td><td class="d">7,00</td><td class="c"></td></tr><tr><td>421000</td><td>Personnel - note de frais à rembourser</td><td class="d"></td><td class="c">117,00</td></tr><tr class="tot"><td></td><td>Total</td><td class="d">117,00</td><td class="c">117,00</td></tr></tbody></table>

> 🇫🇷 **Particularité :** la **TVA sur le transport de voyageurs** (train, avion, taxi) n'est **PAS déductible** → on passe le **TTC en charge**. En revanche, **restaurant** et **péage** ouvrent droit à déduction. Le remboursement passe par un **compte de personnel** (421/425).

---

## 3) 🧾 Facture Uber (VTC = transport de personnes)
**Pièce :** reçu Uber, course **30 € TTC** (TVA 10 % incluse).

<table class="ecr"><caption>Journal BQ · Course Uber (VTC)</caption><thead><tr><th>Compte</th><th>Libellé</th><th class="d">Débit</th><th class="c">Crédit</th></tr></thead><tbody><tr><td>625100</td><td>Voyages et déplacements (Uber)</td><td class="d">30,00</td><td class="c"></td></tr><tr><td>512000</td><td>Banque</td><td class="d"></td><td class="c">30,00</td></tr><tr class="tot"><td></td><td>Total</td><td class="d">30,00</td><td class="c">30,00</td></tr></tbody></table>

> 🇫🇷 **Particularité :** **Uber / VTC / taxi = transport de personnes → TVA NON déductible.** On enregistre **tout le TTC** en charge (pas de ligne 44566).
> ⚠️ **À ne pas confondre :** une facture **Uber Eats** (repas livré) = **restauration**, TVA **déductible** → `625700 HT` + `445660 TVA`.

---

## 4) 🧾 Facture avec consigne et déconsigne (emballages)
**Pièce :** facture d'un grossiste boissons. Marchandises **1 000 € HT** (TVA 200) + **consigne** 50 palettes × 10 € = **500 €** (hors TVA). Total **1 700 €**.

<table class="ecr"><caption>Journal AC · Achat boissons + consigne palettes</caption><thead><tr><th>Compte</th><th>Libellé</th><th class="d">Débit</th><th class="c">Crédit</th></tr></thead><tbody><tr><td>607000</td><td>Achats de marchandises</td><td class="d">1 000,00</td><td class="c"></td></tr><tr><td>445660</td><td>TVA déductible 20 %</td><td class="d">200,00</td><td class="c"></td></tr><tr><td>409600</td><td>Fournisseurs - emballages à rendre (consigne)</td><td class="d">500,00</td><td class="c"></td></tr><tr><td>401GRO</td><td>Fournisseur Grossiste</td><td class="d"></td><td class="c">1 700,00</td></tr><tr class="tot"><td></td><td>Total</td><td class="d">1 700,00</td><td class="c">1 700,00</td></tr></tbody></table>

**Déconsignation** — on rend les palettes, le fournisseur rembourse 500 € :

<table class="ecr"><caption>Journal BQ · Déconsignation (retour des palettes)</caption><thead><tr><th>Compte</th><th>Libellé</th><th class="d">Débit</th><th class="c">Crédit</th></tr></thead><tbody><tr><td>512000</td><td>Banque (remboursement consigne)</td><td class="d">500,00</td><td class="c"></td></tr><tr><td>409600</td><td>Fournisseurs - emballages à rendre</td><td class="d"></td><td class="c">500,00</td></tr><tr class="tot"><td></td><td>Total</td><td class="d">500,00</td><td class="c">500,00</td></tr></tbody></table>

> 🇫🇷 **Particularité :** la **consigne n'est pas soumise à TVA** tant que l'emballage est **restituable** : on la loge en **409600** (créance à récupérer). À la **déconsignation**, on solde le 409600. **Si l'emballage n'est pas rendu** (gardé/cassé), la consigne devient un **achat d'emballage soumis à TVA** (`602600` + `445660`), et l'écart de prix génère un **boni (7588)** ou un **mali (6586)** de consignation.

---

## 🧠 Mémo : TVA déductible ou non à la saisie (pièges FR)
| Dépense | Compte | TVA déductible ? |
|---|---|---|
| Transport de personnes (train, avion, taxi, **Uber/VTC**) | 6251 | ❌ **Non** (TTC en charge) |
| Restaurant / repas d'affaires | 6257 | ✅ Oui (si professionnel) |
| Péage, parking | 6251 | ✅ Oui (20 %) |
| **Hébergement / hôtel** du dirigeant ou salarié | 6251 | ❌ **Non** |
| **Véhicule de tourisme (VP)** : achat, location, entretien | 2182/6135/615 | ❌ **Non** |
| **Gazole / essence** (VP) | 60221 | ✅ **80 %** déductible (20 % en charge) |
| Cadeaux clients | 6234 | ✅ si ≤ **73 € TTC**/an/bénéficiaire, sinon ❌ |
| Assurance | 616 | ❌ Non (exonérée) |
| Sous-traitance **BTP** | 611 | 🔁 **Autoliquidation** (collecte + déduit) |
| Frais bancaires | 627 | souvent ❌ (pas de TVA) |

## 🧰 Autres cas fréquents (rappel express)
- **Acompte** : versé → `4091`, reçu → `4191` (avant la facture définitive).
- **Avoir** : écriture **inverse** de la facture d'origine (TVA comprise).
- **Escompte de règlement** : accordé au client → `665`, obtenu d'un fournisseur → `765`.
- **Carburant VP** : la part de TVA **non déductible** se rajoute **en charge** (compte 60221).

## ✅ Réflexe à acquérir
Avant de saisir, posez‑vous **3 questions** : *Quel compte de charge/produit ? Quel taux de TVA ? La TVA est‑elle déductible ?* — c'est là que se voit un bon collaborateur.
