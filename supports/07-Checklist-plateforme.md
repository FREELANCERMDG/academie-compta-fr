# Checklist — « Avons-nous à peu près tout ? » (audit vs cahier des charges)

Légende : ✅ fait · 🟡 partiel / prêt mais à compléter · ❌ pas encore · ➖ à votre charge (matériel/abonnement)

**Verdict global : ~85 % en place.** Tout le **contenu pédagogique** et la **plateforme applicative** (espace apprenant, admin, paiement Orange Money, aperçu gratuit, sécurité, déploiement prêt) existent. Restent surtout : **mise en ligne réelle (domaine+hébergement)**, **enregistrement des vidéos**, **communication automatisée (e-mails/WhatsApp)**, **devoirs**, **certificat auto-généré**.

---

## 1A. Espace apprenant
| Élément | Statut | Détail |
|---|---|---|
| Compte utilisateur | ✅ | Inscription (condition BAC+2), connexion, **2FA** |
| Tableau de bord | ✅ | Profil, offres, inscriptions, accès |
| Modules de cours | ✅ | **24 modules** servis derrière login+paiement |
| Vidéos | 🟡 | Système d'intégration prêt (`videos.json`) — **vidéos à enregistrer** |
| Supports PDF | ✅ | Livret PDF complet + cahier apprenant + checklists + modèles mails |
| Modèles Excel | ✅ | `Outils-Formation.xlsx` (10 tableaux) |
| Exercices | ✅ | Exercices corrigés dans chaque module |
| Quiz | ✅ | **23 quiz interactifs** (100+ questions), auto-corrigés |
| Devoirs à rendre | ❌ | Pas de dépôt/upload de devoirs à corriger |
| Suivi de progression | ✅ (local) 🟡 (centralisé) | Barre + modules cochés (navigateur) ; centralisé via SCORM dans un LMS |
| Certificats / attestations | 🟡 | **Modèle MG CONSULTING IT&ACT** prêt ; génération auto par apprenant à faire |
| Espace discussion / support | ❌ | À relier (WhatsApp/Telegram) |

## 1B. Espace formateur / admin
| Élément | Statut | Détail |
|---|---|---|
| Créer les cours | 🟡 | Cours en fichiers + générateurs (pas d'éditeur visuel) |
| Ajouter les vidéos | ✅ | Via `videos.json` (1 ligne par module) |
| Publier des documents | 🟡 | Par fichiers (pas d'upload via interface) |
| Corriger les devoirs | ❌ | Lié à l'absence de système de devoirs |
| Suivre les apprenants | ✅ | Liste des apprenants dans l'admin |
| Voir qui a terminé | 🟡 | Via SCORM (LMS) ; suivi fin par apprenant à enrichir côté admin maison |
| Gérer les paiements | ✅ | **Validation manuelle Orange Money** dans l'admin |
| E-mails automatiques | ❌ | À ajouter (SMTP) |
| Gérer les certificats | 🟡 | Modèle prêt ; émission auto à faire |
| Promotions / codes | ❌ | Offres configurables, mais pas de codes promo |

## 1C. Système de paiement
| Élément | Statut | Détail |
|---|---|---|
| Modèles de vente (complet, par module, packs) | ✅ | 4 offres configurables |
| Orange Money | ✅ | **Manuel actif (+261 32 73 622 59)** + API prête |
| Mvola | ❌ | Ajoutable facilement (même flux manuel) |
| Airtel Money | ❌ | Idem |
| Virement bancaire | 🟡 | Ajoutable comme méthode manuelle |
| Carte (Stripe) | 🟡 | Point d'intégration + doc (PSP requis) |
| PayPal / Wise / Payoneer | ❌ | Non intégrés |
| Paiement manuel confirmé admin | ✅ | C'est le cœur du flux Orange Money manuel |

## 1D. Système vidéo
| Élément | Statut | Détail |
|---|---|---|
| YouTube non répertorié | ✅ | Supporté |
| Vimeo | ✅ | Supporté |
| MP4 local (hors-ligne) | ✅ | Supporté |
| Éviter Google Drive comme principal | ✅ | Respecté (YouTube/Vimeo/MP4 recommandés) |
| Bunny.net / AWS S3 | 🟡 | Via URL MP4 ; pas d'intégration dédiée |

## 1E. Communication
| Élément | Statut |
|---|---|
| E-mails automatiques (bienvenue, reçu, relance) | ❌ |
| Notifications | 🟡 (in-app minimal) |
| WhatsApp / Telegram / Discord | ❌ (à relier — lien) |
| Support client | ❌ (WhatsApp recommandé) |
| Relances / rappels automatiques | ❌ |
| Annonces de cours | ❌ |
| Suivi individuel | 🟡 |

---

## 2A. Moyens techniques
| Élément | Statut | Détail |
|---|---|---|
| Nom de domaine | ➖❌ | À acquérir (ex. `formation.mgconsulting.mg`) |
| Hébergement web | ➖🟡 | **À souscrire** ; Docker/Render/Procfile **prêts** |
| LMS / outil de formation | ✅✅ | On a **mieux** : une **plateforme sur-mesure** (Node) **+** un **paquet SCORM** pour Moodle/Systeme.io/Teachable |

## 2B. Moyens pédagogiques
| Élément | Statut | Détail |
|---|---|---|
| Programme de formation | ✅ | 24 modules (dépasse l'exemple à 10) |
| Vidéos | 🟡 | **Scripts prêts** ; tournage à faire |
| Supports PDF | ✅ | Fiches, checklists, exercices, corrigés, modèles Excel/mails, plan comptable, cas |
| Exercices pratiques | ✅ | Saisie achats/ventes, rapprochement, TVA, lettrage, **471**, révision, contrôle **401/411/512/445/641** : tout couvert |

## 2C. Moyens humains
| Rôle | Statut |
|---|---|
| Formateur principal | ✅ (M. RANDRIAMANANTSOA Heriniaina Anthony, intégré) |
| Support administratif | 🟡 (outil prêt ; personne à désigner) |
| Support technique | 🟡 (à désigner) |
| Community manager | ❌ (à prévoir pour la pub) |

## 2D. Moyens matériels
➖ À votre charge : PC, internet stable, **micro**, casque, webcam/smartphone, éclairage. (Logiciels de capture conseillés : OBS, Loom — voir `supports/02-Scripts-video.md`.)

---

## 3. Fonctionnalités « bonne plateforme »
| Fonction | Statut |
|---|---|
| Connexion apprenant | ✅ |
| Progression | ✅ (local) / 🟡 (centralisé via SCORM) |
| Vidéos protégées | 🟡 (derrière login+paiement ; YouTube non répertorié) |
| Quiz | ✅ |
| Exercices | ✅ |
| Certificat | 🟡 (modèle ; auto à finaliser) |
| Paiement intégré | ✅ (Orange Money) |
| E-mails automatiques | ❌ |
| Forum / groupe | ❌ (WhatsApp à relier) |
| Dashboard admin | ✅ |
| Support | ❌ |

---

## 4. Budget (situation)
- Développement de la plateforme : **0 €** (Node natif, sans dépendance — déjà réalisé).
- À prévoir : **domaine** (~10–20 €/an) + **hébergement** (~50–150 €/an, ou Render free pour tester) + **matériel vidéo** (~30–200 €) + éventuel **hébergement vidéo** (Vimeo/Bunny ~5–20 €/mois).
> On est sur une **plateforme sur-mesure**, mais réalisée sans le coût habituel (1 500–10 000 €).

## 5–7. MVP / composition minimale pour lancer
| Élément minimal | Statut |
|---|---|
| 1 nom de domaine | ❌ (à acheter) |
| 1 page de vente | 🟡 (accueil + page **programme** font office ; landing marketing dédiée possible) |
| 1 formulaire d'inscription | ✅ |
| 1 moyen de paiement | ✅ (Orange Money) |
| 1 groupe WhatsApp | ❌ (à créer + lier) |
| 1 espace cours simple | ✅ (bien plus complet) |
| 10 vidéos | 🟡 (à enregistrer) |
| 10 supports PDF | ✅ (largement) |
| 5 cas pratiques | ✅ (10 fournis) |
| 1 certificat | ✅ (modèle MG CONSULTING IT&ACT) |
| 1 fichier de suivi des élèves | ✅ (Excel + admin) |

---

## 🎯 Ce qu'il reste à faire (par priorité)

**Bloquant pour aller en ligne**
1. **Domaine + hébergement** → suivre `supports/06-Mettre-en-ligne-et-partager.md`. *(à votre charge)*
2. **Enregistrer les vidéos** (scripts prêts) et les coller dans `videos.json`. *(à votre charge)*

**Fort impact, réalisable côté plateforme (je peux le faire)**
3. **Lien/bouton WhatsApp + Telegram** (support & communauté) — rapide.
4. **Autres paiements** : Mvola, Airtel Money, virement bancaire (même flux manuel) — rapide.
5. **Certificat auto-généré** (PDF/printable au nom de l'apprenant, score, MG CONSULTING IT&ACT) — moyen.
6. **Page de vente (landing) marketing** dédiée — moyen.
7. **Devoirs à rendre** (upload + correction admin) — moyen.

**Nécessite un compte externe de votre part**
8. **E-mails automatiques** (bienvenue, reçu, relance, mot de passe oublié) → SMTP (Gmail/SendGrid/Brevo).
9. **Orange Money API** (encaissement auto) / **Stripe** (carte).

**Organisation (humain)**
10. Désigner support admin/technique + community manager (pub Facebook/LinkedIn/TikTok).
