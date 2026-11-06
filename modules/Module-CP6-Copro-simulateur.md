# 7.6 — 🎮 Simulateur syndic : un exercice complet de A à Z

Vous êtes le collaborateur comptable du syndic de la **Résidence Les Jacarandas**. Vous allez dérouler **un exercice entier** : paramétrage de l'immeuble, budget et appels de fonds, saisie du réalisé, régularisation des charges et production des annexes pour l'AG.

## 🎯 Objectifs pédagogiques
- Relier **toutes** les étapes du module dans un seul dossier.
- Vérifier la **cohérence** : appels = budget, régularisations = réalisé − provisions, annexe 1 équilibrée.
- S'entraîner sur des **variantes** (budget modifié, impayés, nouveau taux du fonds de travaux).

---

## 1) Mode d'emploi du simulateur

| Onglet | Ce que vous faites | Ce que le simulateur calcule |
| --- | --- | --- |
| **🏢 Immeuble** | Modifier les lots et les tantièmes (généraux, ascenseur) | Contrôle : total des tantièmes de chaque clé |
| **📋 Budget & appels** | Ajuster le budget par compte, le taux du fonds de travaux, le nombre d'appels | Appels par lot, contrôle du minimum légal, **écritures d'appel** |
| **🧾 Réalisé & régularisation** | Saisir les charges réelles de l'exercice | Écart par clé, **régularisation par lot**, écriture de répartition |
| **📑 Annexes** | Saisir les impayés et les factures restant dues | Annexe 2/3 (réalisé vs budget), **annexe 1** (état financier) et contrôle d'équilibre |
| **🎯 Défi** | Calculer vous-même l'appel et la régularisation d'un lot tiré au hasard | Correction immédiate |

> 💡 Toutes les données sont **modifiables** : changez un tantième ou une charge et observez l'effet sur toute la chaîne. Le bouton **Réinitialiser** remet le cas fil rouge.

<div class="copro" data-copro="jacarandas"></div>

## 2) Le scénario à dérouler

1. **Immeuble** : vérifiez que chaque clé totalise bien **1 000** tantièmes.
2. **Budget** : le budget voté est de **24 000 €** (20 000 générales + 4 000 ascenseur), fonds de travaux **5 %**, **4 appels**.
   - Retrouvez l'appel trimestriel de DUPONT : **1 040 €** + **54 €** de fonds de travaux.
3. **Réalisé** : les charges réelles totalisent **24 900 €**.
   - Retrouvez la régularisation de DUPONT : **+178 €** à payer.
4. **Annexes** : DURAND n'a pas payé son appel du 4ᵉ trimestre (**890 €**) et la facture de nettoyage de décembre (**780 €**) reste à payer au 31/12.
   - Vérifiez que l'**annexe 1** est équilibrée.

## 3) Corrigé du fil rouge

### Appels de l'exercice (4 trimestres)

| Lot | Appel budget / trimestre | Fonds de travaux / trimestre | **Total annuel appelé** |
| --- | --- | --- | --- |
| 1 — SCI BERNARD | 800,00 | 48,00 | **3 392,00** |
| 2 — DUPONT | 1 040,00 | 54,00 | **4 376,00** |
| 3 — MARTIN | 870,00 | 45,00 | **3 660,00** |
| 4 — PETIT | 1 080,00 | 51,00 | **4 524,00** |
| 5 — DURAND | 890,00 | 42,00 | **3 728,00** |
| 6 — LEROY | 1 320,00 | 60,00 | **5 520,00** |
| **Total** | **6 000,00** | **300,00** | **25 200,00** |

### Annexe 1 — état financier au 31/12/N après répartition

| Actif (ce que le syndicat possède ou attend) | Montant | Passif (ce que le syndicat doit) | Montant |
| --- | --- | --- | --- |
| Banque — compte courant (512) | 4 990 | Avances de trésorerie (1031) | 6 000 |
| Banque — fonds de travaux (50) | 4 800 | Fonds de travaux (105) | 4 800 |
| Copropriétaires débiteurs (450) | 1 790 | Fournisseurs (401) | 780 |
| | | Copropriétaires créditeurs (450) | 0 |
| **Total** | **11 580** | **Total** | **11 580** |

**D'où vient chaque montant ?**
- **512** = 6 000 (solde d'ouverture) + 23 110 (appels budget encaissés : 24 000 − 890) − 24 120 (factures payées : 24 900 − 780) = **4 990 €**. Les cotisations du fonds de travaux transitent par le 512 puis sont virées sur le compte rémunéré (effet nul).
- **Compte fonds de travaux** = 3 600 (ouverture) + 1 200 (cotisations N) = **4 800 €** = solde du **105** ✅.
- **1031** : avances inchangées (aucune vente dans l'exercice).

> ⚠️ **Une annexe 1 déséquilibrée signale toujours une erreur** (écriture oubliée, charge non répartie, impayé mal traité). Le simulateur fait ce contrôle pour vous.

> 🧭 **Détail des copropriétaires débiteurs (1 790 €)** : régularisations à payer de tous les lots (**900 €**) + appel T4 impayé de DURAND (**890 €**). Chez DURAND : 890 + 106 = **996 €** dus.

## 4) Variantes pour s'entraîner

| Variante | À modifier | Ce qu'il faut observer |
| --- | --- | --- |
| **A** — Contrat ascenseur renégocié | 614 réalisé = 2 400 | L'excédent ascenseur passe à 900 € : **SCI BERNARD** n'est pas concernée (0 tantième ascenseur) |
| **B** — Hausse du fonds de travaux | Taux = 8 % | Cotisation annuelle 1 920 € ; le simulateur confirme que le minimum légal est respecté |
| **C** — Taux insuffisant | Taux = 3 % | Alerte : en dessous du **minimum de 5 %** du budget |
| **D** — Appels mensuels | Nombre d'appels = 12 | L'appel de DUPONT devient 346,67 € / mois |
| **E** — Nouvel impayé | Impayé MARTIN = 870 | L'annexe 1 reste équilibrée : banque **−870**, copropriétaires débiteurs **+870** |

> ✅ **Ce que vous devez savoir faire seul après ce module :** calculer une quote-part, passer un appel de fonds, saisir une facture TTC avec sa clé, traiter le fonds de travaux, calculer une régularisation par lot, passer l'écriture de répartition et contrôler l'annexe 1.
