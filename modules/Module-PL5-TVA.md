# 2.5 — Comment fonctionne la TVA sur Pennylane

Sur Pennylane, vous **ne choisissez pas** les comptes de TVA : ils sont **attribués automatiquement** en fonction du **taux** sélectionné.

Ces comptes sont **reliés à la déclaration de TVA** et l'**alimentent automatiquement**. Concrètement, vous n'avez rien à gérer manuellement : laissez l'outil travailler.

## Les comptes de TVA générés par Pennylane

Quelques comptes que vous rencontrerez dans les modules suivants :

| Compte | Libellé |
|---|---|
| **44571009** | TVA collectée à 20 % |
| **44571008** | TVA collectée à 10 % |
| **44574** | TVA collectée sur encaissements |
| **44566** | TVA déductible sur autres biens et services |
| **44564** | TVA déductible sur encaissements |

> ✨ **Rassurez‑vous :** vous n'avez **pas besoin de les retenir**. Mais au moins, vous ne serez pas surpris de voir ces numéros apparaître.

## Biens ou services : une exigibilité différente

Dans le cadre de la TVA, Pennylane traite différemment les **biens** et les **services** — c'est logique, car la règle d'exigibilité n'est pas la même :

| Type d'opération | La TVA est exigible… |
|---|---|
| **Biens (marchandises)** | à la **date d'émission de la facture** |
| **Services (prestations)** | à l'**encaissement** de la prestation |

C'est pour cela qu'il existe des comptes distincts (ex. **44574 / 44564** « sur encaissements »).

> 💡 **À savoir — régime « TVA sur les débits »**
> Si l'entreprise a opté pour la **TVA sur les débits**, cochez l'option dans **Paramètres → Régime fiscal**. Pennylane considérera alors la TVA sur les **prestations de services** comme exigible **dès l'émission de la facture**.
> 👉 Cette option peut aussi être définie **par fournisseur**.

## À retenir

- Les comptes de TVA sont **automatiques** (selon le taux) — vous ne les saisissez pas à la main.
- Ils sont **connectés à la déclaration de TVA** : la CA3 se remplit toute seule.
- **Biens → exigibilité à la facture** · **Services → exigibilité à l'encaissement** (sauf option « débits »).
