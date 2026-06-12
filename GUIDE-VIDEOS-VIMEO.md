# 🎥 Vidéos protégées avec Vimeo (verrouillées après la promo)

**Objectif :** des vidéos qui se lisent **uniquement sur ton site** `academie-compta-fr.mg`.
Ainsi, après la promo, quand les modules redeviennent payants :
- la plateforme **n'envoie plus** l'iframe vidéo aux non-payants (déjà géré par `gateCourse`),
- **ET** même si quelqu'un a gardé l'ID, **Vimeo refuse de lire la vidéo ailleurs** → double blocage.

> ✅ Côté code : **rien à changer**. La plateforme supporte déjà Vimeo et la CSP l'autorise.

---

## 1) Compte Vimeo
Il faut un plan **Vimeo Standard ou supérieur** : la restriction « domaines spécifiques » n'existe **pas** sur le plan gratuit.
(≈ quelques € / mois — c'est ce qui protège réellement tes vidéos.)

## 2) Uploader chaque vidéo + régler la confidentialité
Sur la vidéo → **Settings → Privacy** :
| Réglage | Valeur |
|---|---|
| **Who can watch?** | *Hide from Vimeo* (ou *Private*) → invisible sur vimeo.com |
| **Where can this be embedded?** | **Specific domains** |
| Domaine à autoriser | `academie-compta-fr.mg` |
| (si tu testes sur Render) | ajoute aussi ton URL `…onrender.com` |
| **Download** | **Off** (désactivé) |

Récupère l'**ID** dans l'URL : `vimeo.com/`**`123456789`** → l'ID = `123456789`.

## 3) Renseigner `site/videos.json`
Une entrée par module (`m01`, `m02`, …, ou `accueil` pour la vidéo de présentation) :
```json
"m02": { "type": "vimeo", "src": "123456789", "title": "Module 2 — outils métier (vidéo)" }
```
- `src` accepte l'**ID** ou l'**URL complète** (les deux marchent).
- `type` doit être `vimeo`.

## 4) Reconstruire + publier
```
python site/build_site.py
git add site/index.html site/videos.json
git commit -m "Ajout videos Vimeo protegees"
git push
```
Puis déclencher le déploiement Render (hook habituel).

## 5) Vérifier que la protection marche
- Sur **academie-compta-fr.mg** (dans un module débloqué) → la vidéo se lit ✅.
- Ouvre `https://player.vimeo.com/video/123456789` **dans un onglet normal** ou colle-le sur un autre site → **« Ce lecteur n'est pas autorisé »** ❌ → la restriction fonctionne.

---

## Récapitulatif du blocage (texte + vidéo)
| Moment | Texte / simulateurs | Vidéos |
|---|---|---|
| **Pendant la promo** | lisibles + **hors-ligne** | lisibles **en ligne** (streaming) |
| **Après la promo (non-payant)** | 🔒 retirés par le serveur, cache hors-ligne expiré | 🔒 iframe non envoyée **+** Vimeo bloque hors domaine |
| **Module 1** | toujours gratuit | toujours gratuit |

> YouTube **non répertorié** = solution de départ (faible : lisible avec le lien).
> Vimeo **domaines spécifiques** = solution solide (recommandée) pour des vidéos payantes.
