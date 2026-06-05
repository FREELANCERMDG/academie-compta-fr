# 2.7 — Les achats et ventes de services en France

Prenons maintenant le cas des **ventes ou achats de prestations de services**.

<img src="/formation/img/pl-services-1.png" alt="Achats et ventes de services - exigibilité de la TVA" style="max-width:100%;height:auto;display:block;margin:16px auto;border-radius:10px;border:1px solid var(--line)">

Ici, c'est **différent** : la **date du fait générateur** n'est pas la même que la **date d'exigibilité** de la TVA. L'exigibilité dépend de **l'encaissement** de la prestation de service.

À la saisie d'une facture, on ne doit donc **pas déverser automatiquement** le montant de la TVA dans la déclaration **si la facture n'a pas encore été payée**.

> 💡 **L'astuce Pennylane**
> En attendant l'encaissement, le logiciel enregistre le montant de la TVA saisie dans un **compte spécifique** : le **44574** pour les **ventes**, ou le **44564** pour les **achats**. Ces comptes **ne sont pas reliés** à la déclaration de TVA.

<img src="/formation/img/pl-services-2.png" alt="TVA enregistrée dans un compte d'attente jusqu'à l'encaissement" style="max-width:100%;height:auto;display:block;margin:16px auto;border-radius:10px;border:1px solid var(--line)">

La TVA est enregistrée dans un **compte d'attente de TVA** jusqu'à l'encaissement.

<img src="/formation/img/pl-services-3.png" alt="Saisie d'une facture de prestation de services - compte 706" style="max-width:100%;height:auto;display:block;margin:16px auto;border-radius:10px;border:1px solid var(--line)">

<img src="/formation/img/pl-services-4.png" alt="TVA en attente sur le compte 44574" style="max-width:100%;height:auto;display:block;margin:16px auto;border-radius:10px;border:1px solid var(--line)">

Si un **compte de prestation de services** est renseigné (ici le **706**), Pennylane en déduit que la **TVA est exigible à l'encaissement**. La TVA est donc enregistrée automatiquement dans le **compte d'attente 44574**.

## Et ensuite ?

Une fois vos factures saisies, vous allez les **réconcilier** avec des transactions, n'est‑ce pas ?

Eh oui : si vous **réconciliez** une facture (ou **lettrez** une écriture de ventes — journal **OD** ou **VT**) avec la transaction qui lui correspond, vous indiquez par la même occasion à Pennylane que la **TVA est désormais exigible, à la date du paiement**. Aussitôt dit, le montant de TVA jusque‑là logé dans le **compte d'attente 44574** est **transféré** dans le compte de **TVA collectée 44571XXX** adapté.

Cette **écriture de récupération de la TVA**, passée **automatiquement** par le logiciel, suit le schéma suivant :

| Date | Compte | Libellé | Débit | Crédit |
|---|---|---|---|---|
| Paiement | **44574** | TVA en attente (encaissements) | X | |
| Paiement | **44571XXX** | TVA collectée (taux adapté) | | X |

> 🧐 **Le saviez‑vous ?** Les écritures de récupération de la TVA sur les encaissements sont enregistrées dans un journal spécifique appelé **RT**. À votre avis, que signifie « RT » ? → **Récupération de TVA**.

Et que se passe‑t‑il pour les montants déversés dans les comptes **44571XXX** ? Comme nous l'avons vu plus tôt, ils sont **automatiquement pris en compte dans la déclaration de TVA**.

## À retenir
- **Biens** → TVA exigible à la **facture** · **Services** → TVA exigible à l'**encaissement**.
- En attendant le paiement, la TVA des services « dort » dans un **compte d'attente** : **44574** (ventes) / **44564** (achats), non reliés à la déclaration.
- À la **réconciliation / au lettrage**, la TVA bascule du compte d'attente vers le **44571XXX** (collectée) via le **journal RT** → elle entre alors dans la déclaration de TVA.
