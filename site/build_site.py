# -*- coding: utf-8 -*-
"""Genere un site e-learning autonome (site/index.html) a partir des .md de la formation.
- Convertit le Markdown (sous-ensemble GFM) en HTML
- Integre les quiz interactifs (quizzes.json)
- Suivi de progression + score (localStorage), recherche, responsive, impression
Aucune dependance externe. Le fichier s'ouvre par double-clic (file://)."""
import os, re, json, base64, html as _html

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)

def load_branding():
    d = {"cabinet_name": "", "course_title": "Comptabilité française externalisée",
         "subtitle": "Formation en ligne · Madagascar · 2026",
         "primary": "#1F4E78", "accent": "#E8A13A", "logo": ""}
    p = os.path.join(ROOT, "branding.json")
    if os.path.exists(p):
        try:
            with open(p, encoding="utf-8") as f: d.update(json.load(f))
        except Exception: pass
    return d
BR = load_branding()

def load_videos():
    p = os.path.join(BASE, "videos.json")
    if os.path.exists(p):
        try:
            with open(p, encoding="utf-8") as f: return json.load(f)
        except Exception: return {}
    return {}
VIDEOS = load_videos()

def yt_id(u):
    m = re.search(r'(?:youtu\.be/|youtube\.com/(?:watch\?v=|embed/|v/|shorts/))([\w-]{6,})', u or "")
    if m: return m.group(1)
    return u if re.match(r'^[\w-]{6,}$', u or "") else ""

def video_embed(entry):
    t = (entry.get("type") or "").lower(); src = entry.get("src") or ""
    title = entry.get("title") or "Vidéo explicative (malgache)"
    if not src: return ""
    if t == "youtube":
        inner = ('<iframe src="https://www.youtube-nocookie.com/embed/%s" title="%s" frameborder="0" '
                 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" '
                 'allowfullscreen></iframe>') % (yt_id(src), title)
    elif t == "vimeo":
        inner = ('<iframe src="https://player.vimeo.com/video/%s" title="%s" frameborder="0" '
                 'allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>') % (re.sub(r'\D', '', src), title)
    else:
        inner = '<video controls preload="metadata" src="%s"></video>' % src
    return ('<div class="vbox"><div class="vlabel">&#127916; %s</div>'
            '<div class="videowrap">%s</div></div>') % (title, inner)

# (chemin relatif depuis ROOT, id, groupe, titre nav, cle quiz)
MANIFEST = [
    ("site/accueil-cours.md", "accueil", "Présentation", "Bienvenue", None),

    ("modules/Module-00-Pourquoi-compta-francaise.md", "m00", "Module 1 — Fondamentaux de la comptabilité française", "1.0 🚀 Pourquoi la compta française (depuis Madagascar)", None),
    ("modules/Module-01-Environnement-comptable-francais.md", "m01", "Module 1 — Fondamentaux de la comptabilité française", "1.1 Environnement comptable FR", "m01"),
    ("modules/Module-02-Bases-comptabilite-PCG.md", "m02", "Module 1 — Fondamentaux de la comptabilité française", "1.2 Bases de comptabilité (PCG)", "m02"),
    ("modules/Module-03-Organisation-dossier-externalise.md", "m03", "Module 1 — Fondamentaux de la comptabilité française", "1.3 Organisation du dossier", "m03"),
    ("modules/Module-04-Saisie-comptable-pratique.md", "m04", "Module 1 — Fondamentaux de la comptabilité française", "1.4 Saisie comptable pratique", "m04"),
    ("modules/Module-1P-Principes-particularites.md", "m1pr", "Module 1 — Fondamentaux de la comptabilité française", "1.5 Principes & particularités de la compta FR", None),
    ("modules/Module-1F-Externalisation-FacturX.md", "m1fx", "Module 1 — Fondamentaux de la comptabilité française", "1.6 Externalisation à Madagascar & Factur-X", None),

    ("modules/Module-PL1-Saisie.md", "m21", "Module 2 — Prise en main du logiciel Pennylane", "2.1 Saisie comptable (vidéo)", "m21"),
    ("modules/Module-PL2-Categorisation.md", "m21b", "Module 2 — Prise en main du logiciel Pennylane", "2.2 Règles de catégorisation (vidéo)", None),
    ("modules/Module-PL3-Import-FEC.md", "m21c", "Module 2 — Prise en main du logiciel Pennylane", "2.3 Import du FEC (vidéo)", None),
    ("modules/Module-PL4-Reprise-immo.md", "m21d", "Module 2 — Prise en main du logiciel Pennylane", "2.4 Reprise des immobilisations (vidéo)", None),
    ("modules/Module-PL5-TVA.md", "m21e", "Module 2 — Prise en main du logiciel Pennylane", "2.5 La TVA sur Pennylane", None),
    ("modules/Module-PL6-Preparation-TVA.md", "m21f", "Module 2 — Prise en main du logiciel Pennylane", "2.6 Préparation TVA sur Pennylane (vidéo)", None),
    ("modules/Module-PL7-Services.md", "m21g", "Module 2 — Prise en main du logiciel Pennylane", "2.7 Achats & ventes de services (illustré)", None),
    ("modules/Module-PL8-Cadrage-TVA.md", "m21h", "Module 2 — Prise en main du logiciel Pennylane", "2.8 Cadrage TVA sur Pennylane (vidéo)", None),
    ("modules/Module-PL9-CA3-CA12.md", "m21i", "Module 2 — Prise en main du logiciel Pennylane", "2.9 Formulaire CA3/CA12 sur Pennylane (vidéo)", None),
    ("modules/Module-PL10-Basculer.md", "m21j", "Module 2 — Prise en main du logiciel Pennylane", "2.10 📌 Basculer sa compta sur Pennylane (PDF)", None),
    ("modules/Module-PL11-Liasse.md", "m21k", "Module 2 — Prise en main du logiciel Pennylane", "2.11 Préparer la liasse fiscale sur Pennylane", None),
    ("modules/Module-PL12-Figer.md", "m21l", "Module 2 — Prise en main du logiciel Pennylane", "2.12 Figer la comptabilité sur Pennylane (vidéo)", None),

    ("modules/Module-05-TVA-francaise.md", "m05", "Module 3 — Opérations & révision", "3.1 TVA française", "m05"),
    ("modules/Module-06-Rapprochement-bancaire.md", "m06", "Module 3 — Opérations & révision", "3.2 Rapprochement bancaire", "m06"),
    ("modules/Module-07-Lettrage-clients-fournisseurs.md", "m07", "Module 3 — Opérations & révision", "3.3 Lettrage clients/fournisseurs", "m07"),
    ("modules/Module-08-Comptes-attente-sensibles.md", "m08", "Module 3 — Opérations & révision", "3.4 Comptes d'attente", "m08"),
    ("modules/Module-09-Paie-ecritures-sociales.md", "m09", "Module 3 — Opérations & révision", "3.5 Paie et écritures sociales", "m09"),
    ("modules/Module-10-Immobilisations-amortissements.md", "m10", "Module 3 — Opérations & révision", "3.6 Immobilisations", "m10"),
    ("modules/Module-11-Revision-comptable.md", "m11", "Module 3 — Opérations & révision", "3.7 Révision comptable", "m11"),
    ("modules/Module-28-Revision-par-classe.md", "m28", "Module 3 — Opérations & révision", "3.8 Révision par défilement (classes 1 à 7)", None),
    ("modules/Module-PRAT1-Quotidien.md", "pr1", "Module 3 — Opérations & révision", "3.9 🛠️ Le quotidien du collaborateur (pratique)", None),
    ("modules/Module-PRAT2-Justification-cycles.md", "pr2", "Module 3 — Opérations & révision", "3.10 🛠️ Justifier les comptes par cycle (pratique)", None),
    ("modules/Module-PRAT4-Factures-particulieres.md", "pr4", "Module 3 — Opérations & révision", "3.11 🛠️ Saisir les factures particulières (cas réels)", None),
    ("modules/Module-PRAT5-Entrainement-saisie.md", "pr5", "Module 3 — Opérations & révision", "3.12 🧮 Entraînement : matrice de saisie (interactif)", None),
    ("modules/Module-PRAT6-Simulateur.md", "pr6", "Module 3 — Opérations & révision", "3.13 🏢 Simulateur Cabinet : traiter les factures (interactif)", None),
    ("modules/Module-PRAT7-TVA-CA3.md", "pr7", "Module 3 — Opérations & révision", "3.14 🧾 Déclarer la TVA (CA3) — simulateur", None),

    ("modules/Module-12-Fiscalite-entreprises.md", "m12", "Module 4 — Fiscalité, clôture & dossiers spécifiques", "4.1 Fiscalité des entreprises", "m12"),
    ("modules/Module-13-Bilan-cloture.md", "m13", "Module 4 — Fiscalité, clôture & dossiers spécifiques", "4.2 Bilan et clôture", "m13"),
    ("modules/Module-26-Specificites-cas-particuliers.md", "m26", "Module 4 — Fiscalité, clôture & dossiers spécifiques", "4.3 Spécificités & cas particuliers", None),
    ("modules/Module-27-Specificites-par-activite.md", "m27", "Module 4 — Fiscalité, clôture & dossiers spécifiques", "4.4 Spécificités par activité (BNC, LMNP, SCI, TABAC…)", None),
    ("modules/Module-29-Dossier-batiment.md", "m29", "Module 4 — Fiscalité, clôture & dossiers spécifiques", "4.5 Dossier bâtiment (BTP) : fiscal, compta & saisie", None),
    ("modules/Module-PRAT3-Cloture-cas-fil-rouge.md", "pr3", "Module 4 — Fiscalité, clôture & dossiers spécifiques", "4.6 🛠️ Clôture pas à pas — dossier fil rouge (pratique)", None),

    ("modules/Module-30-Liasse-vue-ensemble.md", "m30", "Module 5 — Liasse fiscale & déclarations par régime", "5.1 Vue d'ensemble & quel régime dépose quoi", None),
    ("modules/Module-31-Liasse-reel-normal.md", "m31", "Module 5 — Liasse fiscale & déclarations par régime", "5.2 Réel normal (2050 → 2059)", None),
    ("modules/Module-32-Liasse-reel-simplifie.md", "m32", "Module 5 — Liasse fiscale & déclarations par régime", "5.3 Réel simplifié (2033‑A → G)", None),
    ("modules/Module-33-Liasse-BNC-2035.md", "m33", "Module 5 — Liasse fiscale & déclarations par régime", "5.4 BNC — déclaration contrôlée (2035)", None),
    ("modules/Module-34-Liasse-agricole-fonciere.md", "m34", "Module 5 — Liasse fiscale & déclarations par régime", "5.5 Agricole (2139/2143) & SCI/foncier (2072/2044)", None),

    ("modules/Module-14-Outils-cabinets.md", "m14", "Module 6 — Pratique métier, qualité, carrière & certification", "6.1 Outils des cabinets", "m14"),
    ("modules/Module-15-Communication-professionnelle.md", "m15", "Module 6 — Pratique métier, qualité, carrière & certification", "6.2 Communication pro", "m15"),
    ("modules/Module-16-Production-offshore.md", "m16", "Module 6 — Pratique métier, qualité, carrière & certification", "6.3 Production offshore", "m16"),
    ("modules/Module-17-Qualite-controle-interne.md", "m17", "Module 6 — Pratique métier, qualité, carrière & certification", "6.4 Qualité & contrôle", "m17"),
    ("modules/Module-20-Carriere-freelancing.md", "m20", "Module 6 — Pratique métier, qualité, carrière & certification", "6.5 Carrière & freelancing", "m20"),
    ("cas-pratiques/Cas-pratiques-corriges.md", "cas", "Module 6 — Pratique métier, qualité, carrière & certification", "6.6 Cas pratiques corrigés", None),
    ("evaluations/Evaluation-finale.md", "eval", "Module 6 — Pratique métier, qualité, carrière & certification", "6.7 Évaluation finale", "final"),
    ("modules/Module-25-Simulations-entretien.md", "m25", "Module 6 — Pratique métier, qualité, carrière & certification", "6.8 Simulations d'entretien", None),
    ("modules/Module-PRAT8-ChefMission.md", "pr8", "Module 6 — Pratique métier, qualité, carrière & certification", "6.9 🔍 Réviseur & Chef de mission (simulateur)", None),

    ("annexes/Checklists.md", "a_check", "Annexes", "Checklists", None),
    ("annexes/Modeles-mails.md", "a_mails", "Annexes", "Modèles de mails", None),
    ("annexes/Tableaux-de-suivi.md", "a_tab", "Annexes", "Tableaux de suivi", None),
    ("annexes/Attestation-modele.md", "a_attest", "Annexes", "Attestation", None),
]

# ----------------- Convertisseur Markdown -> HTML -----------------
def esc(s):
    return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')

def inline(s):
    # proteger le code inline
    codes = []
    def stash(m):
        codes.append(m.group(1)); return "\x00%d\x00" % (len(codes)-1)
    s = re.sub(r'`([^`]+)`', stash, s)
    s = esc(s)
    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', s)
    def restore(m):
        return '<code>%s</code>' % esc(codes[int(m.group(1))])
    s = re.sub(r'\x00(\d+)\x00', restore, s)
    return s

SEP_RE = re.compile(r'^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$')

def split_row(line):
    line = line.strip()
    if line.startswith('|'): line = line[1:]
    if line.endswith('|'): line = line[:-1]
    return [c.strip() for c in line.split('|')]

def md_to_html(text):
    lines = text.split('\n')
    out = []
    i, n = 0, len(lines)
    while i < n:
        line = lines[i]
        st = line.strip()
        # fenced code
        if st.startswith('```'):
            buf = []; i += 1
            while i < n and not lines[i].strip().startswith('```'):
                buf.append(lines[i]); i += 1
            i += 1
            out.append('<pre><code>%s</code></pre>' % esc('\n'.join(buf)))
            continue
        # blank
        if st == '':
            i += 1; continue
        # raw html line
        if st.startswith('<') and (st.endswith('>')):
            out.append(line); i += 1; continue
        # standalone backslash -> line break
        if st == '\\':
            out.append('<br>'); i += 1; continue
        # hr
        if re.match(r'^-{3,}$', st) or re.match(r'^\*{3,}$', st):
            out.append('<hr>'); i += 1; continue
        # heading
        m = re.match(r'^(#{1,6})\s+(.*)$', st)
        if m:
            lvl = len(m.group(1))
            out.append('<h%d>%s</h%d>' % (lvl, inline(m.group(2)), lvl))
            i += 1; continue
        # table
        if '|' in line and i + 1 < n and SEP_RE.match(lines[i+1]):
            header = split_row(line); i += 2
            rows = []
            while i < n and '|' in lines[i] and lines[i].strip() != '':
                rows.append(split_row(lines[i])); i += 1
            t = ['<div class="tbl"><table><thead><tr>']
            for c in header: t.append('<th>%s</th>' % inline(c))
            t.append('</tr></thead><tbody>')
            for r in rows:
                t.append('<tr>')
                for c in r: t.append('<td>%s</td>' % inline(c))
                t.append('</tr>')
            t.append('</tbody></table></div>')
            out.append(''.join(t)); continue
        # blockquote
        if st.startswith('>'):
            buf = []
            while i < n and lines[i].strip().startswith('>'):
                content = re.sub(r'^\s*>\s?', '', lines[i])
                buf.append(inline(content) if content.strip() else '')
                i += 1
            out.append('<blockquote>%s</blockquote>' % '<br>'.join(buf))
            continue
        # unordered / checkbox list
        if re.match(r'^\s*[-*]\s+', line):
            items = []
            while i < n and re.match(r'^\s*[-*]\s+', lines[i]):
                content = re.sub(r'^\s*[-*]\s+', '', lines[i])
                cb = re.match(r'^\[([ xX])\]\s+(.*)$', content)
                if cb:
                    chk = ' checked' if cb.group(1).lower() == 'x' else ''
                    items.append('<li class="task"><label><input type="checkbox"%s> %s</label></li>' % (chk, inline(cb.group(2))))
                else:
                    items.append('<li>%s</li>' % inline(content))
                i += 1
            out.append('<ul>%s</ul>' % ''.join(items)); continue
        # ordered list
        if re.match(r'^\s*\d+\.\s+', line):
            items = []
            while i < n and re.match(r'^\s*\d+\.\s+', lines[i]):
                content = re.sub(r'^\s*\d+\.\s+', '', lines[i])
                items.append('<li>%s</li>' % inline(content))
                i += 1
            out.append('<ol>%s</ol>' % ''.join(items)); continue
        # paragraph
        buf = []
        while i < n and lines[i].strip() != '' and not lines[i].strip().startswith(('#', '>', '```', '|')) \
              and not re.match(r'^\s*[-*]\s+', lines[i]) and not re.match(r'^\s*\d+\.\s+', lines[i]) \
              and not re.match(r'^-{3,}$', lines[i].strip()):
            buf.append(inline(lines[i].strip())); i += 1
        if buf:
            out.append('<p>%s</p>' % '<br>'.join(buf))
        else:
            i += 1
    return '\n'.join(out)

# ----------------- Construction des donnees -----------------
# Groupe -> code module (verrouillage par paiement). "free" = toujours accessible.
GROUP_MOD = {
    "Présentation": "free",
    "Module 1 — Fondamentaux de la comptabilité française": "mod1",
    "Module 2 — Prise en main du logiciel Pennylane": "mod2",
    "Module 3 — Opérations & révision": "mod3",
    "Module 4 — Fiscalité, clôture & dossiers spécifiques": "mod4",
    "Module 5 — Liasse fiscale & déclarations par régime": "mod5",
    "Module 6 — Pratique métier, qualité, carrière & certification": "mod6",
    "Annexes": "free",
}
CONTENT, NAV, ORDER, MODID = {}, [], [], {}
groups = {}
for rel, pid, grp, title, qk in MANIFEST:
    fp = os.path.join(ROOT, rel)
    with open(fp, 'r', encoding='utf-8') as f:
        body_html = md_to_html(f.read())
    if pid in VIDEOS:
        body_html = video_embed(VIDEOS[pid]) + body_html
    CONTENT[pid] = body_html
    MODID[pid] = GROUP_MOD.get(grp, "free")
    groups.setdefault(grp, []).append({"id": pid, "title": title, "quiz": qk})
    ORDER.append(pid)
for grp in ["Présentation", "Module 1 — Fondamentaux de la comptabilité française", "Module 2 — Prise en main du logiciel Pennylane", "Module 3 — Opérations & révision", "Module 4 — Fiscalité, clôture & dossiers spécifiques", "Module 5 — Liasse fiscale & déclarations par régime", "Module 6 — Pratique métier, qualité, carrière & certification", "Annexes"]:
    if grp in groups:
        NAV.append({"group": grp, "items": groups[grp]})

with open(os.path.join(BASE, "quizzes.json"), "r", encoding="utf-8") as f:
    QUIZ = json.load(f)

# Exercices de saisie interactifs (matrice façon logiciel)
try:
    with open(os.path.join(BASE, "exercices.json"), "r", encoding="utf-8") as f:
        EXOS = json.load(f)
except Exception:
    EXOS = {}

# Dossiers du Simulateur Cabinet (traitement de factures)
try:
    with open(os.path.join(BASE, "dossiers.json"), "r", encoding="utf-8") as f:
        DOSSIERS = json.load(f)
except Exception:
    DOSSIERS = {}

# Simulateurs pro : déclaration TVA (CA3) + audits (valider/anomalies)
try:
    with open(os.path.join(BASE, "tva.json"), "r", encoding="utf-8") as f:
        TVASIM = json.load(f)
except Exception:
    TVASIM = {}
try:
    with open(os.path.join(BASE, "audits.json"), "r", encoding="utf-8") as f:
        AUDITS = json.load(f)
except Exception:
    AUDITS = {}

# Base de factures (mode serie : 20 achats + 20 ventes) + Plan comptable (lookup)
try:
    with open(os.path.join(BASE, "factures.json"), "r", encoding="utf-8") as f:
        FACTURES = json.load(f)
except Exception:
    FACTURES = []
try:
    with open(os.path.join(BASE, "pcg.json"), "r", encoding="utf-8") as f:
        PCG = json.load(f)
except Exception:
    PCG = []

# ----------------- Template HTML -----------------
TPL = r"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Formation comptabilite francaise externalisee - Madagascar</title>
<style>
:root{--navy:#1F4E78;--navy2:#2E6CA4;--accent:#E8A13A;--bg:#f4f6f9;--card:#fff;--ok:#1f8a4c;--ko:#c0392b;--bd:#e2e6ec;}
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:var(--bg);color:#1c2733;line-height:1.55}
a{color:var(--navy2)}
header{position:sticky;top:0;z-index:20;background:var(--navy);color:#fff;display:flex;align-items:center;gap:14px;padding:10px 16px;box-shadow:0 2px 8px rgba(0,0,0,.15)}
header .logo{font-weight:700;font-size:15px;line-height:1.2}
header .logo span{display:block;font-weight:400;font-size:11px;opacity:.8}
header .grow{flex:1}
#search{padding:7px 10px;border-radius:8px;border:none;width:220px;max-width:40vw}
.progwrap{display:flex;align-items:center;gap:8px;font-size:12px}
.progbar{width:120px;height:8px;background:rgba(255,255,255,.25);border-radius:6px;overflow:hidden}
.progbar i{display:block;height:100%;background:var(--accent);width:0}
.btn{background:var(--accent);color:#1c2733;border:none;padding:8px 12px;border-radius:8px;font-weight:600;cursor:pointer}
.btn.sec{background:#fff;color:var(--navy);border:1px solid var(--bd)}
.btn:hover{filter:brightness(.97)}
.hamb{display:none;background:none;border:none;color:#fff;font-size:22px;cursor:pointer}
.layout{display:flex;min-height:calc(100vh - 52px)}
.sidebar{width:300px;background:#fff;border-right:1px solid var(--bd);overflow-y:auto;max-height:calc(100vh - 52px);position:sticky;top:52px}
.sidebar .grp{padding:12px 16px 4px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#8a97a6;font-weight:700}
.sidebar a.item{display:flex;align-items:center;gap:8px;padding:8px 16px;color:#27384a;text-decoration:none;font-size:13.5px;border-left:3px solid transparent}
.sidebar a.item:hover{background:#f0f4f9}
.sidebar a.item.active{background:#eaf1f9;border-left-color:var(--accent);font-weight:600;color:var(--navy)}
.sidebar a.item .dot{width:16px;height:16px;border-radius:50%;border:2px solid #cfd8e3;flex:none;display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff}
.sidebar a.item.done .dot{background:var(--ok);border-color:var(--ok)}
.main{flex:1;min-width:0;padding:26px 34px 80px;max-width:980px;margin:0 auto}
.crumbs{font-size:12px;color:#8a97a6;margin-bottom:6px}
.content h1{color:var(--navy);font-size:26px;border-bottom:3px solid var(--accent);padding-bottom:8px;margin-top:6px}
.content h2{color:var(--navy);font-size:20px;margin-top:26px}
.content h3{color:var(--navy2);font-size:16px;margin-top:20px}
.content h4{font-size:14px;margin-top:16px}
.content p{margin:10px 0}
.content ul,.content ol{margin:8px 0 8px 4px;padding-left:22px}
.content li{margin:3px 0}
.content li.task{list-style:none;margin-left:-18px}
.content li.task label{cursor:pointer}
.content blockquote{background:#eef4fb;border-left:4px solid var(--navy2);margin:12px 0;padding:10px 14px;border-radius:0 8px 8px 0}
.content code{background:#eef1f5;padding:1px 5px;border-radius:4px;font-size:90%}
.content pre{background:#0f2233;color:#d7e3ee;padding:14px;border-radius:10px;overflow:auto;font-size:13px}
.content pre code{background:none;color:inherit;padding:0}
.content hr{border:none;border-top:1px solid var(--bd);margin:22px 0}
.content img{max-width:100%;height:auto;display:block;margin:14px auto;border:1px solid var(--bd);border-radius:10px;box-shadow:0 1px 6px rgba(20,40,70,.08)}
.content figure{margin:14px 0}.content figcaption{font-size:12px;color:#8a97a6;text-align:center;margin-top:4px}
.tbl{overflow-x:auto;margin:12px 0}
.content table{border-collapse:collapse;width:100%;font-size:13.5px}
.content th{background:var(--navy);color:#fff;text-align:left;padding:8px 10px}
.content td{border:1px solid var(--bd);padding:7px 10px;vertical-align:top}
.content tbody tr:nth-child(even){background:#f7fafd}
/* Écriture comptable illustrée (style logiciel) */
.content table.ecr{border:1px solid #cfe8dc;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(20,40,70,.08);margin:18px 0}
.content table.ecr caption{caption-side:top;text-align:left;background:#eef3fb;color:#16307a;font-weight:700;padding:10px 14px;border-bottom:1px solid #d4def0;border-radius:12px 12px 0 0}
.content table.ecr th{background:#16307a;color:#fff;border:none}
.content table.ecr td{border:none;border-bottom:1px solid #eef2f8;vertical-align:middle}
.content table.ecr td:first-child{font-weight:700;color:#16307a;font-variant-numeric:tabular-nums}
.content table.ecr th.d,.content table.ecr td.d{text-align:right;color:#1554b8;font-variant-numeric:tabular-nums}
.content table.ecr th.c,.content table.ecr td.c{text-align:right;color:#9a5b00;font-variant-numeric:tabular-nums}
.content table.ecr tbody tr:nth-child(even){background:#fafbfe}
.content table.ecr tr.tot td{background:#f7faf9;font-weight:800;border-top:2px solid #16307a;border-bottom:none}
.content .docrow{display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap;margin:18px 0}
.content .docrow>.pj{flex:0 0 250px}
.content .docrow>table.ecr{flex:1;margin:0;min-width:300px}
@media(max-width:760px){.content .docrow>.pj,.content .docrow>table.ecr{flex:1 1 100%}}
.content .pj{border:1px solid #d4def0;border-radius:10px;background:#fff;padding:12px 13px;font-size:12px;box-shadow:0 2px 8px rgba(20,40,70,.06);color:#27384a}
.content .pj .pj-tag{display:inline-block;background:#eef3fb;color:#16307a;font-weight:800;font-size:10px;letter-spacing:.4px;padding:2px 8px;border-radius:5px;margin-bottom:7px}
.content .pj .pj-h{font-weight:800;color:#16307a;font-size:13px}
.content .pj .pj-m{color:#5a6b80;font-size:11px;margin:2px 0 7px}
.content .pj .pj-r{display:flex;justify-content:space-between;gap:8px;padding:2px 0;border-bottom:1px dashed #eef2f8}
.content .pj .pj-r:last-child{border-bottom:none}
.content .pj .pj-r b{font-variant-numeric:tabular-nums}
.content .pj .pj-tot{border-top:1px solid #cfd8e3;margin-top:5px;padding-top:6px;font-weight:800;color:#16307a}
.pagebar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:22px 0;padding-top:16px;border-top:1px solid var(--bd)}
.card{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:22px;box-shadow:0 1px 3px rgba(20,40,70,.05)}
/* Video */
.vbox{margin:0 0 20px}
.vlabel{font-weight:700;color:var(--navy);font-size:13px;margin-bottom:6px}
.videowrap{position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;background:#000;box-shadow:0 2px 10px rgba(0,0,0,.18)}
.videowrap iframe,.videowrap video{position:absolute;top:0;left:0;width:100%;height:100%;border:0}
/* Quiz */
.quiz{margin-top:30px;background:#fff;border:1px solid var(--bd);border-radius:14px;padding:22px}
.quiz h3{margin-top:0;color:var(--navy)}
.q{margin:16px 0;padding:14px;border:1px solid var(--bd);border-radius:10px}
.q .opt{display:block;padding:8px 10px;border:1px solid var(--bd);border-radius:8px;margin:6px 0;cursor:pointer}
.q .opt:hover{background:#f3f7fb}
.q .opt.correct{background:#e4f6ea;border-color:var(--ok)}
.q .opt.wrong{background:#fbe7e7;border-color:var(--ko)}
.q .exp{font-size:13px;color:#445;margin-top:8px;display:none}
.score{font-size:18px;font-weight:700;margin:10px 0}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700}
.badge.ok{background:#e4f6ea;color:var(--ok)} .badge.ko{background:#fbe7e7;color:var(--ko)}
@media(max-width:860px){
 .sidebar{position:fixed;left:-320px;top:52px;height:calc(100vh - 52px);transition:.2s;z-index:30}
 .sidebar.open{left:0;box-shadow:6px 0 18px rgba(0,0,0,.2)}
 .hamb{display:block}.main{padding:18px}
 #search{width:140px}
}
@media print{header,.sidebar,.pagebar,.hamb,.quiz .btn{display:none!important}.main{max-width:none}}
</style>
</head>
<body>
<header>
  <button class="hamb" onclick="document.querySelector('.sidebar').classList.toggle('open')">&#9776;</button>
  <div class="logo">Comptabilite FR externalisee<span>Formation en ligne &middot; Madagascar &middot; 2026</span></div>
  <div class="grow"></div>
  <input id="search" placeholder="Rechercher un module...">
  <div class="progwrap">Progression <div class="progbar"><i id="progi"></i></div><b id="progt">0%</b></div>
</header>
<div class="layout">
  <nav class="sidebar" id="nav"></nav>
  <main class="main">
     <div class="crumbs" id="crumbs"></div>
     <div class="content card" id="content"></div>
     <div id="quizmount"></div>
     <div class="pagebar">
        <button class="btn sec" id="prevb">&#8592; Precedent</button>
        <button class="btn" id="doneb">Marquer comme termine</button>
        <button class="btn sec" id="nextb">Suivant &#8594;</button>
     </div>
  </main>
</div>
<script>
const CONTENT=__CONTENT__;
const NAV=__NAV__;
const ORDER=__ORDER__;
const MODID=__MODID__;
const QUIZ=__QUIZ__;
window.EXOS=__EXOS__;
window.DOSSIERS=__DOSSIERS__;
window.TVASIM=__TVASIM__;
window.AUDITS=__AUDITS__;
window.FACTURES=__FACTURES__;
window.PCG=__PCG__;
const KEY="fce_progress_v1";
let prog=JSON.parse(localStorage.getItem(KEY)||'{"done":{},"quiz":{}}');
function save(){localStorage.setItem(KEY,JSON.stringify(prog));}
function titleOf(id){for(const g of NAV)for(const it of g.items)if(it.id===id)return it.title;return id;}
function quizOf(id){for(const g of NAV)for(const it of g.items)if(it.id===id)return it.quiz;return null;}
function renderNav(){
  const nav=document.getElementById('nav');nav.innerHTML='';
  for(const g of NAV){
    const h=document.createElement('div');h.className='grp';h.textContent=g.group;nav.appendChild(h);
    for(const it of g.items){
      const a=document.createElement('a');a.className='item'+(prog.done[it.id]?' done':'');a.href='#'+it.id;a.dataset.id=it.id;
      a.innerHTML='<span class="dot">'+(prog.done[it.id]?'&#10003;':'')+'</span><span class="t">'+it.title+'</span>';
      nav.appendChild(a);
    }
  }
  updateProgress();
}
function updateProgress(){
  const total=ORDER.length;let d=0;for(const id of ORDER)if(prog.done[id])d++;
  const pct=Math.round(d/total*100);
  document.getElementById('progi').style.width=pct+'%';
  document.getElementById('progt').textContent=pct+'%';
}
function show(id){
  if(!CONTENT[id])id=ORDER[0];
  document.getElementById('content').innerHTML=CONTENT[id];
  document.getElementById('crumbs').textContent=titleOf(id);
  document.querySelectorAll('.sidebar a.item').forEach(a=>a.classList.toggle('active',a.dataset.id===id));
  // boutons prev/next
  const idx=ORDER.indexOf(id);
  document.getElementById('prevb').onclick=()=>{if(idx>0)location.hash=ORDER[idx-1];};
  document.getElementById('nextb').onclick=()=>{if(idx<ORDER.length-1)location.hash=ORDER[idx+1];};
  const db=document.getElementById('doneb');
  function refreshDone(){db.textContent=prog.done[id]?'✓ Termine':'Marquer comme termine';db.classList.toggle('sec',!!prog.done[id]);}
  db.onclick=()=>{prog.done[id]=!prog.done[id];save();renderNav();refreshDone();};
  refreshDone();
  // quiz
  const qk=quizOf(id);const qm=document.getElementById('quizmount');qm.innerHTML='';
  if(qk&&QUIZ[qk])qm.appendChild(buildQuiz(qk));
  window.scrollTo(0,0);
  document.querySelector('.sidebar').classList.remove('open');
}
function buildQuiz(qk){
  const data=QUIZ[qk];const wrap=document.createElement('div');wrap.className='quiz';
  const prev=prog.quiz[qk];
  let head='<h3>&#128221; Quiz - '+data.title+'</h3>';
  if(prev)head+='<p>Dernier score : <span class="badge '+(prev.score/prev.total>=0.7?'ok':'ko')+'">'+prev.score+'/'+prev.total+'</span></p>';
  wrap.innerHTML=head;
  const form=document.createElement('div');
  data.questions.forEach((q,qi)=>{
    const qd=document.createElement('div');qd.className='q';qd.dataset.a=q.answer;
    qd.innerHTML='<b>'+(qi+1)+'. '+q.q+'</b>';
    q.options.forEach((o,oi)=>{
      const lab=document.createElement('label');lab.className='opt';
      lab.innerHTML='<input type="radio" name="q'+qi+'" value="'+oi+'"> '+o;
      qd.appendChild(lab);
    });
    if(q.explain){const e=document.createElement('div');e.className='exp';e.textContent='→ '+q.explain;qd.appendChild(e);}
    form.appendChild(qd);
  });
  wrap.appendChild(form);
  const res=document.createElement('div');res.className='score';
  const btn=document.createElement('button');btn.className='btn';btn.textContent='Valider le quiz';
  btn.onclick=()=>{
    let score=0;
    wrap.querySelectorAll('.q').forEach((qd)=>{
      const a=+qd.dataset.a;const sel=qd.querySelector('input:checked');
      qd.querySelectorAll('.opt').forEach((opt,oi)=>{opt.classList.remove('correct','wrong');if(oi===a)opt.classList.add('correct');});
      if(sel){const v=+sel.value;if(v===a)score++;else qd.querySelectorAll('.opt')[v].classList.add('wrong');}
      const exp=qd.querySelector('.exp');if(exp)exp.style.display='block';
    });
    const total=data.questions.length;
    res.innerHTML='Score : <span class="badge '+(score/total>=0.7?'ok':'ko')+'">'+score+'/'+total+'</span> '+(score/total>=0.7?'- Reussi !':'- Seuil 70% non atteint, revoyez le module.');
    prog.quiz[qk]={score,total};if(score/total>=0.7)prog.done[curId()]=true;save();renderNav();
  };
  wrap.appendChild(btn);wrap.appendChild(res);
  return wrap;
}
function curId(){return location.hash.slice(1)||ORDER[0];}
window.addEventListener('hashchange',()=>show(curId()));
document.getElementById('search').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase();
  document.querySelectorAll('.sidebar a.item').forEach(a=>{a.style.display=a.textContent.toLowerCase().includes(q)?'':'none';});
});
renderNav();show(curId());
</script>
<script src="/formation/cerfa.js"></script>
<script src="/formation/saisie.js"></script>
<script src="/formation/sim.js"></script>
<script src="/formation/pro.js"></script>
<script src="/formation/simdoc.js"></script>
</body>
</html>"""

html_out = (TPL
    .replace("__CONTENT__", json.dumps(CONTENT, ensure_ascii=False))
    .replace("__NAV__", json.dumps(NAV, ensure_ascii=False))
    .replace("__ORDER__", json.dumps(ORDER, ensure_ascii=False))
    .replace("__MODID__", json.dumps(MODID, ensure_ascii=False))
    .replace("__QUIZ__", json.dumps(QUIZ, ensure_ascii=False))
    .replace("__EXOS__", json.dumps(EXOS, ensure_ascii=False))
    .replace("__DOSSIERS__", json.dumps(DOSSIERS, ensure_ascii=False))
    .replace("__TVASIM__", json.dumps(TVASIM, ensure_ascii=False))
    .replace("__AUDITS__", json.dumps(AUDITS, ensure_ascii=False))
    .replace("__FACTURES__", json.dumps(FACTURES, ensure_ascii=False))
    .replace("__PCG__", json.dumps(PCG, ensure_ascii=False)))

# ----- Application de la charte (branding.json) -----
name = (BR.get("cabinet_name") or "").strip()
brandline = (name + " &middot; " if name else "") + (BR.get("course_title") or "")
logo_html = ""
logo = (BR.get("logo") or "").strip()
if logo:
    lp = logo if os.path.isabs(logo) else os.path.join(ROOT, logo)
    if os.path.exists(lp):
        ext = (os.path.splitext(lp)[1].lstrip(".").lower() or "png").replace("jpg", "jpeg")
        with open(lp, "rb") as f: b64 = base64.b64encode(f.read()).decode()
        logo_html = '<img src="data:image/%s;base64,%s" alt="logo" style="height:36px;margin-right:8px;border-radius:4px;background:#fff;padding:2px">' % (ext, b64)
header = ('<div class="logo" style="display:flex;align-items:center">' + logo_html +
          '<div>' + brandline + '<span>' + (BR.get("subtitle") or "") + '</span></div></div>')
html_out = html_out.replace(
    '<div class="logo">Comptabilite FR externalisee<span>Formation en ligne &middot; Madagascar &middot; 2026</span></div>', header)
html_out = html_out.replace("--navy:#1F4E78", "--navy:" + BR["primary"]).replace("--accent:#E8A13A", "--accent:" + BR["accent"])

with open(os.path.join(BASE, "index.html"), "w", encoding="utf-8") as f:
    f.write(html_out)
print("pages:", len(CONTENT), "| quizzes:", len(QUIZ), "| charte:", BR["primary"], BR["accent"], "| cabinet:", name or "(generique)")
