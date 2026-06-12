# 2.1 — Saisie comptable sur Pennylane

> 🎥 Regardez la vidéo (le focus commence vers **0:52**), puis retenez les points clés ci‑dessous.

<div style="position:relative;padding-bottom:56.25%;height:0;margin:16px 0;border-radius:12px;overflow:hidden;background:#000"><iframe src="https://www.youtube-nocookie.com/embed/nFyrpgZFXZ8?start=52" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" title="Saisie comptable sur Pennylane" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>

## Ce que montre la vidéo
La **saisie d'une facture** (achat ou vente) dans Pennylane — de la pièce jusqu'à l'écriture validée.

## Les étapes clés
1. **Saisie → Factures** (fournisseurs ou clients).
2. Vérifier les données **océrisées (OCR)** : fournisseur/client, date, **HT, TVA, TTC**.
3. Choisir le bon **compte de charge/produit** (606x, 607, 611, 706, 707…) et le **taux de TVA**.
4. Contrôler le **compte de tiers** : **401** (fournisseur) / **411** (client).
5. **Joindre la pièce** justificative.
6. **Valider** → l'écriture est générée : *achat* `6xx / 44566 / 401` · *vente* `411 / 70x / 44571`.

## Exemples d'écritures (présentées comme dans le logiciel)

**Achat — facture fournisseur (TVA déductible)**

<table class="ecr"><caption>Journal ACH · 15/01/2025 · Facture fournisseur OVH n°F2025-014</caption><thead><tr><th>Compte</th><th>Libellé</th><th class="d">Débit</th><th class="c">Crédit</th></tr></thead><tbody><tr><td>613500</td><td>Location mobilière — hébergement serveur</td><td class="d">100,00</td><td class="c"></td></tr><tr><td>445660</td><td>TVA déductible 20 %</td><td class="d">20,00</td><td class="c"></td></tr><tr><td>401OVH</td><td>OVH SAS</td><td class="d"></td><td class="c">120,00</td></tr><tr class="tot"><td></td><td>Total</td><td class="d">120,00</td><td class="c">120,00</td></tr></tbody></table>

**Vente — facture client (TVA collectée)**

<table class="ecr"><caption>Journal VT · 18/01/2025 · Facture client DUPONT n°2025-007</caption><thead><tr><th>Compte</th><th>Libellé</th><th class="d">Débit</th><th class="c">Crédit</th></tr></thead><tbody><tr><td>411DUP</td><td>Client DUPONT</td><td class="d">600,00</td><td class="c"></td></tr><tr><td>706000</td><td>Prestations de services</td><td class="d"></td><td class="c">500,00</td></tr><tr><td>445710</td><td>TVA collectée 20 %</td><td class="d"></td><td class="c">100,00</td></tr><tr class="tot"><td></td><td>Total</td><td class="d">600,00</td><td class="c">600,00</td></tr></tbody></table>

**Encaissement client (banque + lettrage)**

<table class="ecr"><caption>Journal BQ · 31/01/2025 · Encaissement facture 2025-007</caption><thead><tr><th>Compte</th><th>Libellé</th><th class="d">Débit</th><th class="c">Crédit</th></tr></thead><tbody><tr><td>512000</td><td>Banque</td><td class="d">600,00</td><td class="c"></td></tr><tr><td>411DUP</td><td>Client DUPONT (lettré)</td><td class="d"></td><td class="c">600,00</td></tr><tr class="tot"><td></td><td>Total</td><td class="d">600,00</td><td class="c">600,00</td></tr></tbody></table>

> 💡 Le **Débit** (bleu) et le **Crédit** (vert) s'**équilibrent toujours** : c'est la règle de la partie double. Le total débit = total crédit.

## À retenir (réflexes cabinet)
- Beaucoup d'écritures se créent **au rapprochement bancaire** : on ne saisit à la main que ce qui n'a pas de transaction.
- **Pas de pièce → on ne valide pas** ; on relance le client.
- Vérifier la **TVA déductible** (pas sur véhicule de tourisme, attention aux frais de réception…).
