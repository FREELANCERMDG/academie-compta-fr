# 🎬 Vidéo promotionnelle (60 s) — Kit de production prêt à l'emploi

**Objectif :** promouvoir la plateforme **Académie Compta FR** (formation comptabilité française externalisée depuis Madagascar).
**Formats :** 9:16 vertical (TikTok/Reels/WhatsApp Statut) **et** 16:9 (site/YouTube/LinkedIn).
**Charte :** bleu marine `#1F4E78`, accent orange `#E8A13A`, police sans‑serif. Logo MG Consulting IT & ACT.

> Outils recommandés : **HeyGen** (avatar IA qui parle) + **ElevenLabs** (voix off FR premium) — ou la voix native HeyGen. Les deux configs sont fournies.

---

## 1) Script voix‑off (≈ 155 mots / 60 s)
> *(Ton : chaleureux, confiant, dynamique. Débit ~2,6 mots/s.)*

**[0–6 s — Accroche]**
« Vous êtes comptable à Madagascar et vous rêvez de travailler sur des **dossiers français** ? »

**[6–16 s — Problème]**
« Le problème : les cabinets français recherchent des collaborateurs **opérationnels tout de suite** — TVA, Pennylane, liasse, révision. »

**[16–30 s — Solution]**
« L'**Académie Compta FR** vous forme exactement à ça : **4 modules** complets, le **logiciel Pennylane** pas à pas, des **cas pratiques réels** et des **simulations d'entretien**. »

**[30–42 s — Bénéfices / preuve]**
« Formé par un professionnel de **10 ans d'expérience**, avec quiz, vidéos en **malgache**, **attestation** à la clé — et le **Module 1 est gratuit**. »

**[42–54 s — Réassurance]**
« Accès sécurisé 12 mois, paiement **Orange Money** ou **MVola**, contenu **à jour** des dernières lois de finances. »

**[54–60 s — Appel à l'action]**
« Lancez votre carrière dès aujourd'hui. **academiecomptafr.mg** — votre place vous attend. »

---

## 2) Storyboard (scène par scène)

| Temps | Visuel à l'écran | Texte incrusté | B‑roll / animation |
|---|---|---|---|
| 0–6 s | Avatar IA souriant, fond marine | « Travailler sur des dossiers FRANÇAIS 🇫🇷 » | zoom léger |
| 6–16 s | Split‑screen cabinet FR / bureau Mada | « Être opérationnel tout de suite » | logos TVA · Pennylane |
| 16–30 s | Captures floutées des modules + Pennylane | « 4 modules · Pennylane · Cas pratiques » | défilement des leçons |
| 30–42 s | Photo formateur + badges | « 10 ans d'expérience · Module 1 GRATUIT » | étoiles, check verts |
| 42–54 s | Cadenas + logos Orange Money / MVola | « Sécurisé · 12 mois · MAJ lois de finances » | icônes paiement |
| 54–60 s | Logo + URL plein écran, CTA | « academiecomptafr.mg — S'inscrire » | bouton orange pulsé |

---

## 3) Réglages HeyGen
- **Avatar :** présentateur(trice) professionnel(le), tenue business.
- **Langue / Locale :** Français (France).
- **Script :** coller la section 1 (les balises `[..]` servent au minutage, à retirer du champ texte).
- **Background :** uni `#1F4E78` ou bureau moderne ; insérer **captures de la plateforme** + **logo** en overlay (PNG transparent).
- **Captions :** activer, police bold, surlignage orange `#E8A13A`.
- **Ratio :** générer en **9:16** (réseaux) puis dupliquer en **16:9** (site).
- **Musique :** légère, corporate, volume −18 dB sous la voix.

## 4) Réglages ElevenLabs (si voix off séparée)
- **Voice :** une voix **française** naturelle (ex. profil masculin chaleureux ou féminin clair).
- **Model :** *Multilingual v2*. **Stability** 45 % · **Similarity** 80 % · **Style** 10 % · **Speaker boost** ON.
- Générer le MP3, l'importer dans HeyGen/CapCut, **caler sur le storyboard**.

## 5) Sous‑titres (SRT prêt)
```
1
00:00:00,000 --> 00:00:06,000
Vous êtes comptable à Madagascar et rêvez de dossiers français ?

2
00:00:06,000 --> 00:00:16,000
Les cabinets français cherchent des collaborateurs opérationnels tout de suite.

3
00:00:16,000 --> 00:00:30,000
L'Académie Compta FR : 4 modules, Pennylane pas à pas, cas pratiques, entretiens.

4
00:00:30,000 --> 00:00:42,000
Formé par un pro de 10 ans, quiz, vidéos en malgache, attestation — Module 1 gratuit.

5
00:00:42,000 --> 00:00:54,000
Accès sécurisé 12 mois, paiement Orange Money ou MVola, contenu à jour.

6
00:00:54,000 --> 00:00:60,000
academiecomptafr.mg — votre place vous attend.
```

## 6) Specs d'export
- **9:16 :** 1080×1920, H.264, 30 fps, < 30 Mo (WhatsApp/TikTok).
- **16:9 :** 1920×1080, H.264, 30 fps (site/YouTube).
- **Vignette (thumbnail) :** logo + « Module 1 GRATUIT » sur fond marine.

## 7) Brancher la vidéo dans la plateforme
Une fois le MP4 prêt :
1. Déposer le fichier dans `platform/public/` (ex. `promo.mp4`).
2. Dans `platform/config.json`, renseigner `"video_decouverte": "/public/promo.mp4"`.
3. Redémarrer le serveur → la vidéo s'affiche automatiquement sur la page **Visite guidée (1 min)** `/decouverte`.

## 8) Déclinaisons promo (réseaux)
- **Légende WhatsApp/Facebook :** « 🎓 Deviens collaborateur comptable pour cabinets français — depuis Mada ! Module 1 GRATUIT. 👉 academiecomptafr.mg »
- **3 hooks A/B à tester (3 s) :** « Gagne en € depuis Mada » · « Pennylane de A à Z » · « Réussis ton entretien en cabinet FR ».
