# 3.15 — 🖥️ Déclarer la TVA sur impots.gouv.fr (tuto pas à pas + simulateur)

**Leçon 100 % pratique.** Vous allez faire, écran par écran, ce qu'un collaborateur fait réellement : créer l'accès du client, déposer la **CA3** en ligne, **payer**, et traiter un **crédit de TVA**. Trois simulateurs vous font cliquer, remplir et valider — avec correction immédiate.

> ⚠️ Les écrans reproduits ici sont une **reconstitution pédagogique** (le vrai site évolue), mais les **menus, les libellés de lignes et les numéros de cases** sont ceux de la déclaration officielle **3310-CA3-SD**.

## 🎯 Objectifs pédagogiques
- Savoir **créer et activer** un espace professionnel (mode simplifié / mode expert) et anticiper les **délais**.
- Mettre en place le **mandat SEPA B2B** sans lequel aucun télérèglement ne passe.
- **Déposer une CA3** en mode EFI : bon menu, bonne période, bonnes cases, validation, **accusé de réception**.
- **Payer** la TVA (télérèglement) et savoir traiter un **crédit** : report (ligne 27) ou remboursement (**3519**).
- Réagir juste en cas d'**erreur, d'oubli ou de retard**.

---

## 1) EDI ou EFI : deux canaux, deux usages

| Canal | Qui l'utilise | Comment | Quand |
| --- | --- | --- | --- |
| **EDI** (échange de données) | Le **cabinet**, depuis son logiciel (Pennylane, ACD, Quadra…) | La déclaration part automatiquement vers la DGFiP via un partenaire EDI | **Voie normale** en cabinet, pour les dossiers en portefeuille |
| **EFI** (saisie en ligne) | Le client ou le collaborateur, **directement sur impots.gouv.fr** | On saisit la déclaration dans l'espace professionnel | Petits dossiers, **dépannage** si l'EDI est indisponible, consultation du **compte fiscal** |

> 🇲🇬 **Réflexe cabinet :** le collaborateur **prépare et cadre** la TVA ; l'envoi part en EDI **après validation** du chef de mission. Mais savoir faire **toute la démarche en EFI** est indispensable — c'est ce qui vous rend autonome sur un dossier isolé ou en cas de panne.

## 2) Le parcours complet en 6 étapes

1. **Créer** l'espace professionnel (SIREN + e-mail + mot de passe) → code d'activation **par courrier**.
2. **Activer** l'espace (code valable **60 jours**) et enregistrer l'**IBAN**.
3. **Remettre le mandat SEPA B2B à la banque** — sinon prélèvement rejeté.
4. **Déclarer** : menu *Déclarer → TVA* → période → formulaire CA3 (ou CA12) → **valider**.
5. **Archiver l'accusé de réception** (preuve de dépôt) dans le dossier client.
6. **Payer** (télérèglement) et **contrôler** dans *Consulter → compte fiscal*.

---

## 3) 🖱️ Simulateur 1 — Ouvrir le dossier : espace professionnel et mandat B2B

<div class="efi" data-efi="e1"></div>

## 4) 🖱️ Simulateur 2 — Déposer la CA3 du mois, de la balance à l'accusé de réception

<div class="efi" data-efi="e2"></div>

## 5) Rappel visuel : la CA3 ligne par ligne

Passez la souris (ou cliquez) sur une case pour afficher **ce qu'on y met** — ce sont exactement les lignes que vous venez de remplir en ligne.

<div class="cerfa" data-form="ca3"></div>

## 6) 🖱️ Simulateur 3 — Crédit de TVA : reporter ou se faire rembourser

<div class="efi" data-efi="e3"></div>

## 7) 🧾 Entraînement supplémentaire — une CA3 à plusieurs taux

<div class="tvasim" data-tva="t3"></div>

---

## 8) Les échéances à connaître

| Déclaration | Échéance | Points d'attention |
| --- | --- | --- |
| **CA3 mensuelle** (réel normal) | Entre le **15 et le 24** du mois suivant | La date exacte dépend du dossier (forme juridique / SIREN) — elle est **affichée dans l'espace professionnel** |
| **CA3 trimestrielle** | Même logique, le mois suivant le trimestre | Possible si la TVA due annuelle est **inférieure à 4 000 €** |
| **CA12** (réel simplifié) | **2e jour ouvré après le 1er mai** (exercice civil) | Acomptes **juillet ≈ 55 %** et **décembre ≈ 40 %** ; dispense d'acomptes si la TVA due N‑1 est **< 1 000 €** |
| **Crédit à rembourser** | Avec la CA3 (formulaire **3519**) | Seuil **760 €** en demande mensuelle/trimestrielle ; **150 €** en demande annuelle |

> 📅 **Déclaration « néant » :** même sans activité, la déclaration **doit être déposée** (cases à zéro). Un silence = défaut de déclaration.

## 9) Erreurs fréquentes — et le bon réflexe

| Erreur constatée | Conséquence | Le bon réflexe |
| --- | --- | --- |
| Mandat B2B non remis à la banque | Prélèvement **rejeté**, majoration de retard | Contrôler le mandat **dès l'ouverture** du dossier |
| Espace pro créé la veille de l'échéance | Code d'activation **pas encore arrivé** (courrier) | Lancer la création **2 semaines avant** |
| TVA déductible sur immobilisation mise en ligne 20 | Ligne 19 fausse → contrôle DGFiP, remboursement retardé | **19 = immobilisations**, **20 = autres biens et services** |
| Crédit reporté oublié (ligne 22) | On paie une TVA déjà avancée | Reprendre la **ligne 27** de la déclaration précédente |
| Accusé de réception non archivé | Aucune **preuve de dépôt** en cas de litige | Enregistrer le PDF au dossier, **à chaque dépôt** |
| Déclaration déposée en retard | Majoration **10 %** (portée à **40 %** après mise en demeure non suivie) + **intérêt de retard 0,20 %/mois** | Alerter le chef de mission **avant** l'échéance, jamais après |
| Paiement en retard | Majoration de **5 %** du montant dû | Ordonner le télérèglement **dans la foulée** du dépôt |
| Erreur découverte après dépôt | Déclaration fausse dans le compte fiscal | Déposer une **déclaration rectificative**, ou régulariser sur la période suivante si l'écart est faible |

## 10) ✅ Checklist du collaborateur

**Avant de déclarer**
- [ ] Banque **rapprochée** et saisie du mois terminée
- [ ] **Cadrage TVA** fait : TVA collectée = CA × taux ; déductible = achats
- [ ] Comptes 44571 / 44566 / 44562 / 4458x **justifiés**
- [ ] Crédit de la période précédente **repris** (ligne 22)

**Pendant la saisie en ligne**
- [ ] Bonne **période** sélectionnée
- [ ] Bases par **taux** au cadre A, TVA au cadre B
- [ ] **19 = immobilisations**, **20 = autres biens et services**
- [ ] Total ligne **32** cohérent avec le compte **44551**

**Après le dépôt**
- [ ] **Accusé de réception** enregistré au dossier
- [ ] **Télérèglement** ordonné
- [ ] Écriture de **liquidation de TVA** passée en compta
- [ ] Point de contrôle dans *Consulter → compte fiscal*

---

## 11) 🧠 Mini-quiz de fin de leçon

1. Le code d'activation de l'espace professionnel arrive : a) par e-mail b) **par courrier postal** c) par SMS
2. Pour déposer la CA3, on va dans : a) Payer → TVA b) **Déclarer → TVA** c) Demander → TVA
3. La TVA sur l'achat d'une camionnette se déclare : a) ligne 20 b) **ligne 19** c) ligne 22
4. Un crédit de TVA de 500 € en CA3 mensuelle : a) **se reporte (ligne 27), le seuil de remboursement de 760 € n'est pas atteint** b) se rembourse immédiatement c) se perd
5. Sans mandat SEPA B2B remis à la banque : a) le paiement passe quand même b) **le prélèvement est rejeté** c) la DGFiP appelle le client
6. Sans activité sur le mois : a) on ne déclare rien b) **on dépose une déclaration à zéro** c) on attend la CA12

**Corrigé :** 1b · 2b · 3b · 4a · 5b · 6b.

---

## 📎 Liens officiels

- [Votre espace professionnel — impots.gouv.fr](https://www.impots.gouv.fr/professionnel/creation-de-mon-espace-professionnel)
- [TVA — déclarations et paiement](https://www.impots.gouv.fr/professionnel/tva)
- [Formulaire 3310-CA3-SD + notice](https://www.impots.gouv.fr/formulaire/3310-ca3-sd/tva-et-taxes-assimilees-regime-du-reel-normal-mini-reel)
- [Formulaire 3519-SD — remboursement de crédit de TVA](https://www.impots.gouv.fr/formulaire/3519-sd/demande-de-remboursement-de-credits-de-taxes)

> 🔁 **Pour aller plus loin :** la même déclaration vue **depuis le logiciel** est traitée en Module 2 (préparation, cadrage et formulaire CA3/CA12 sur Pennylane) ; la **théorie complète de la TVA** est en leçon 3.1.
