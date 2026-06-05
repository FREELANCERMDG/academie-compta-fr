# Personnalisation à votre charte (logo, couleurs, nom)

Toute l'identité visuelle du pack est pilotée par **un seul fichier : `branding.json`** (à la racine du projet).

## 1. Le fichier `branding.json`
```json
{
  "cabinet_name": "Mon Cabinet",
  "course_title": "Comptabilité française externalisée",
  "subtitle": "Formation en ligne · Madagascar · 2026",
  "primary": "#1F4E78",
  "accent": "#E8A13A",
  "logo": "branding/logo.png"
}
```
| Clé | Effet |
|---|---|
| `cabinet_name` | Nom affiché dans l'en-tête du site, sur la couverture du livret et des diapositives. Laisser vide = version générique. |
| `course_title` | Titre principal de la formation. |
| `subtitle` | Sous-titre (en-tête site / couverture). |
| `primary` | Couleur principale (bandeaux, titres) — code hexadécimal `#RRGGBB`. |
| `accent` | Couleur d'accent (barres, puces, surlignages). |
| `logo` | Chemin du logo (PNG/JPG) relatif à la racine du projet ; intégré automatiquement dans l'en-tête du site. Laisser vide = pas de logo. |

## 2. Appliquer la charte (1 commande par support)
Après avoir modifié `branding.json` :
```
python site/build_site.py      # site e-learning (couleurs + logo + nom)
python scorm/build_scorm.py    # re-emballe le SCORM avec le site re-thémé
python slides/build_slides.py  # 18 diaporamas (couleurs + sous-titre)
python print/build_booklet.py  # livret PDF (couleurs + couverture)
```
> Le classeur Excel (`annexes/excel/Outils-Formation.xlsx`) garde sa charte par défaut ; pour le re-thémer, modifier `HEAD_FILL`/`TITLE_FONT` dans `annexes/build_xlsx.py` puis relancer.

## 3. Conseils couleurs
- `primary` = une couleur foncée et lisible (le texte par-dessus est blanc).
- `accent` = une couleur vive et contrastée (barres, puces).
- Exemples de palettes :
  | Style | primary | accent |
  |---|---|---|
  | Bleu marine (défaut) | `#1F4E78` | `#E8A13A` |
  | Vert sapin | `#0F6E4F` | `#E0A526` |
  | Bordeaux | `#7A1F2B` | `#C9A227` |
  | Anthracite | `#2B2F36` | `#2E9BD6` |

## 4. Logo
1. Placez votre logo (fond transparent de préférence) dans `branding/logo.png`.
2. Renseignez `"logo": "branding/logo.png"` dans `branding.json`.
3. Relancez `python site/build_site.py` : le logo est encodé dans le fichier (toujours hors-ligne).
