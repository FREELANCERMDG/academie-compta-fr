# 2.8 — Cadrage TVA sur Pennylane

> 🎥 Vidéo de démonstration — le **cadrage de la TVA** dans Pennylane.

<div style="margin:16px 0;border-radius:12px;overflow:hidden;background:#000"><video controls preload="metadata" style="width:100%;height:auto;display:block;border-radius:12px" src="/formation/videos/cadrage-tva-pennylane.mp4"></video></div>

## Ce que montre la vidéo
Le **cadrage de la TVA** : vérifier que la **TVA déclarée** est cohérente avec les **comptes de TVA de la balance** et avec le **chiffre d'affaires** / les **achats**, avant de valider la déclaration.

## Pourquoi cadrer la TVA ?
Le cadrage est un **contrôle de cohérence** indispensable : il garantit qu'aucune TVA n'a été oubliée, mal imputée ou comptée deux fois.

## Les étapes clés
1. **TVA collectée** : rapprocher la TVA des comptes **44571XXX** avec le **chiffre d'affaires** (706, 707…) × taux.
2. **TVA déductible** : rapprocher les comptes **44566 / 44562** avec les **achats et immobilisations**.
3. Vérifier les **comptes d'attente** (44574 / 44564) : la TVA sur encaissements non encore exigible **ne doit pas** figurer dans la déclaration.
4. Contrôler le **solde de TVA à payer / crédit** et le rapprocher de la **CA3**.
5. Justifier tout **écart** avant de valider.

## Historique, base par taux et cadrage annuel

Trois cadrages complémentaires viennent compléter l'analyse des comptes clients : le **cadrage historique**, le **cadrage base par taux** et le **cadrage annuel**.

### Cadrage 2 — Historique des déclarations
Une **vue synthétique** des montants déclarés par **cellule de la CA3**, mois par mois, sur l'exercice en cours. Utile pour vérifier la **cohérence avec les déclarations passées** et s'assurer que les **OD antérieures** ont bien été intégrées.

> ⚠️ Disponible uniquement pour les déclarations **CA3**.

### Cadrage 3 — Base par taux
Ce cadrage analyse **toutes les écritures** du dossier **par taux de TVA** et met en évidence les **incohérences** : TVA manquante, mauvaise imputation de compte, étiquette erronée. Vous pouvez **corriger les écritures directement** depuis ce cadrage.

> 💡 **Conseil :** effectuez ce cadrage **régulièrement en cours d'exercice** — cela réduit considérablement le travail au moment du cadrage annuel.

### Cadrage 4 — Annuel
Le cadrage annuel **compare la TVA réellement comptabilisée** avec la **TVA théorique** calculée sur l'ensemble des **comptes de produits (701 à 709, 775, 791)**, par taux. Il intègre les **retraitements N‑1 / N** pour isoler la TVA exigible sur la période.

> ⚠️ **Première année sur Pennylane :** si vous n'avez pas encore réalisé de clôture sur Pennylane, les **à‑nouveaux importés** peuvent manquer de granularité et les **étiquettes TVA** peuvent être absentes des fichiers **FEC**. Ce n'est **pas une anomalie** : vous pouvez **exporter le tableau en Excel**, le corriger manuellement, puis le **réimporter** dans votre dossier de travail.

> 🎥 **Dans la vidéo ci‑dessus :** les trois cadrages sont présentés, dont le **cadrage annuel** et ses spécificités pour une **première année sur Pennylane** — Guillaume vous guide jusqu'au bout du processus.

## À retenir (réflexes cabinet)
- Pas de validation de TVA **sans cadrage** : c'est le point de contrôle qui évite les redressements.
- Un écart vient souvent d'une **transaction non traitée**, d'un **mauvais taux** ou d'un **compte d'attente** mal soldé.
- Conserver le **tableau de cadrage** comme justificatif du dossier.

## 🛠️ Simulateur — faites le cadrage du dossier

À partir de l'**extrait de balance** (à gauche), remplissez la **feuille de cadrage** (à droite) : TVA théorique par taux, écart avec le 44571, OD de correction et TVA à décaisser. Suivez le **tutoriel 📘**, puis **Vérifier** (le corrigé se débloque après).

<div class="simdoc" data-sim="cadrage"></div>

## 🧪 À vous de jouer — faites VOTRE cadrage dans le Logiciel

La plateforme intègre un **outil de cadrage TVA comme en cabinet**, branché sur **vos propres écritures** du logiciel sandbox :

1. Saisissez quelques ventes (et la TVA collectée) dans le **🧪 Logiciel** (menu du haut) → **Saisie**.
2. Ouvrez [🧾 **Cadrage TVA**](/logiciel/cadrage-tva) : affectez un **taux** à chaque compte de produits, l'outil calcule la **TVA théorique**, la compare au **4457x comptabilisé** et vous donne l'**écart à justifier** + la **TVA à décaisser** théorique.
3. Provoquez un écart exprès (une vente saisie sans TVA) et observez le diagnostic — c'est exactement le contrôle fait chaque mois en cabinet avant la CA3.
