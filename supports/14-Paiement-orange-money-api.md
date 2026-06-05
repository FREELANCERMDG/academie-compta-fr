# 💳 Activer le paiement Orange Money AUTOMATIQUE (Web Payment)

C'est la page Orange hébergée (le client saisit son **numéro + code** ou **flashe le QR**) — comme la capture que vous avez vue. **L'intégration est déjà codée** dans la plateforme : il ne manque que vos **identifiants marchand Orange**.

## Ce que ça change
| | Manuel (actuel) | Automatique (Web Payment) |
|---|---|---|
| Le client | envoie l'argent puis saisit la **référence** | est **redirigé** vers la page Orange et paie |
| Validation | **l'admin valide** à la main | **automatique** (accès activé tout seul si paiement OK) |

## 1) Obtenir le compte marchand + l'accès API (côté vous)
- Contactez **Orange Money Madagascar — service Marchand / Entreprise** pour :
  1. ouvrir un **compte marchand Orange Money**,
  2. demander l'accès à l'**API « Orange Money Web Payment »** (paiement en ligne).
- Orange vous fournira : **Merchant Key**, **Client ID**, **Client Secret**, l'**URL de base de l'API** + la **doc** (endpoints, devise, environnement de test).
- *Alternative plus rapide :* passer par un **agrégateur/PSP local** qui propose déjà Orange Money + MVola en un seul contrat.

## 2) Renseigner les variables (Render → Environment, ou `.env`)
| Variable | Valeur |
|---|---|
| `OM_BASE_URL` | URL de l'API (fournie par Orange) |
| `OM_CLIENT_ID` | fourni par Orange |
| `OM_CLIENT_SECRET` | fourni par Orange |
| `OM_MERCHANT_KEY` | clé marchand |
| `OM_CURRENCY` | devise de prod (ex. **MGA**) |
| `OM_RETURN_URL` | `https://academiecomptafr.mg/paiement/retour` |
| `OM_CANCEL_URL` | `https://academiecomptafr.mg/tableau-de-bord` |
| `OM_NOTIF_URL` | `https://academiecomptafr.mg/paiement/retour` |

## 3) Activer le mode API
Dans `platform/config.json` → `"orange_money": { "mode": "api" }` (au lieu de `"manuel"`), puis redémarrer. Le bouton **« Payer via Orange Money »** apparaît automatiquement.

## 4) Tester
1. **Sandbox** d'abord (Orange fournit un environnement de test) → faire un paiement test → vérifier que l'**accès s'active** seul.
2. Passer en **production** (vraies clés + `OM_CURRENCY=MGA`).

## ✅ Déjà fait (côté code)
- Bouton **« Payer via Orange Money (automatique) »** → `omApiInit` → **redirection** vers la page Orange.
- **Retour** : vérification du statut → si **SUCCESS**, l'**inscription passe « active »** avec **12 mois d'accès** — **sans intervention**.
- Idem possible pour **MVola** si vous obtenez son API (même principe).

## ⚠️ Honnêteté
- Les **identifiants marchand** s'obtiennent **uniquement auprès d'Orange** (contrat + KYC). Je ne peux pas les générer.
- Si l'API d'Orange Madagascar **diffère légèrement** de l'implémentation standard (Web Payment), **envoyez‑moi la doc PDF** d'Orange → j'**ajuste le code** (endpoints/champs) en quelques minutes.
