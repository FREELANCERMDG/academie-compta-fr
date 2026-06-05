# -*- coding: utf-8 -*-
"""Genere un LIVRET unique imprimable (print/Formation-complete.html).
Ouvrir dans un navigateur puis 'Imprimer > Enregistrer en PDF'.
Convertisseur Markdown autonome (aucune dependance)."""
import os, re, json

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)

BR = {"cabinet_name": "", "course_title": "Comptabilité française externalisée",
      "primary": "#1F4E78", "accent": "#E8A13A"}
_bp = os.path.join(ROOT, "branding.json")
if os.path.exists(_bp):
    try:
        with open(_bp, encoding="utf-8") as f: BR.update(json.load(f))
    except Exception: pass

MANIFEST = [
    ("README.md", "Présentation générale"),
    ("modules/Module-01-Environnement-comptable-francais.md", "Module 1.1 — Environnement comptable français"),
    ("modules/Module-02-Bases-comptabilite-PCG.md", "Module 1.2 — Bases de comptabilité (PCG)"),
    ("modules/Module-03-Organisation-dossier-externalise.md", "Module 1.3 — Organisation du dossier"),
    ("modules/Module-04-Saisie-comptable-pratique.md", "Module 2.1 — Saisie comptable pratique"),
    ("modules/Module-21-Logiciel-Pennylane.md", "Module 2.2 — Pennylane"),
    ("modules/Module-22-Logiciel-Tiime.md", "Module 2.3 — Tiime"),
    ("modules/Module-23-Logiciel-Quadra.md", "Module 2.4 — Quadra (Cegid)"),
    ("modules/Module-24-Logiciel-Isacompta.md", "Module 2.5 — Isacompta (ISAGRI)"),
    ("modules/Module-05-TVA-francaise.md", "Module 3.1 — TVA française"),
    ("modules/Module-06-Rapprochement-bancaire.md", "Module 3.2 — Rapprochement bancaire"),
    ("modules/Module-07-Lettrage-clients-fournisseurs.md", "Module 3.3 — Lettrage clients/fournisseurs"),
    ("modules/Module-08-Comptes-attente-sensibles.md", "Module 3.4 — Comptes d'attente"),
    ("modules/Module-09-Paie-ecritures-sociales.md", "Module 3.5 — Paie et écritures sociales"),
    ("modules/Module-10-Immobilisations-amortissements.md", "Module 3.6 — Immobilisations"),
    ("modules/Module-11-Revision-comptable.md", "Module 3.7 — Révision comptable"),
    ("modules/Module-12-Fiscalite-entreprises.md", "Module 4.1 — Fiscalité des entreprises"),
    ("modules/Module-13-Bilan-cloture.md", "Module 4.2 — Bilan et clôture"),
    ("modules/Module-14-Outils-cabinets.md", "Module 4.3 — Outils des cabinets"),
    ("modules/Module-15-Communication-professionnelle.md", "Module 4.4 — Communication professionnelle"),
    ("modules/Module-16-Production-offshore.md", "Module 4.5 — Production offshore"),
    ("modules/Module-17-Qualite-controle-interne.md", "Module 4.6 — Qualité & contrôle interne"),
    ("modules/Module-20-Carriere-freelancing.md", "Module 4.7 — Carrière & freelancing"),
    ("cas-pratiques/Cas-pratiques-corriges.md", "Module 4.8 — Cas pratiques corrigés"),
    ("evaluations/Evaluation-finale.md", "Module 4.9 — Évaluation finale"),
    ("annexes/Checklists.md", "Annexe A — Checklists"),
    ("annexes/Modeles-mails.md", "Annexe B — Modèles de mails"),
    ("annexes/Tableaux-de-suivi.md", "Annexe C — Tableaux de suivi"),
    ("annexes/Attestation-modele.md", "Annexe D — Attestation"),
]

def esc(s): return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
def inline(s):
    codes=[]
    s=re.sub(r'`([^`]+)`', lambda m:(codes.append(m.group(1)) or "\x00%d\x00"%(len(codes)-1)), s)
    s=esc(s)
    s=re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', r'<a href="\2">\1</a>', s)
    s=re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
    s=re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', s)
    s=re.sub(r'\x00(\d+)\x00', lambda m:'<code>%s</code>'%esc(codes[int(m.group(1))]), s)
    return s
SEP=re.compile(r'^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$')
def row(l):
    l=l.strip()
    if l.startswith('|'):l=l[1:]
    if l.endswith('|'):l=l[:-1]
    return [c.strip() for c in l.split('|')]
def md(text):
    L=text.split('\n');o=[];i=0;n=len(L)
    while i<n:
        s=L[i].strip()
        if s.startswith('```'):
            b=[];i+=1
            while i<n and not L[i].strip().startswith('```'):b.append(L[i]);i+=1
            i+=1;o.append('<pre><code>%s</code></pre>'%esc('\n'.join(b)));continue
        if s=='':i+=1;continue
        if s.startswith('<') and s.endswith('>'):o.append(L[i]);i+=1;continue
        if s=='\\':o.append('<br>');i+=1;continue
        if re.match(r'^-{3,}$',s) or re.match(r'^\*{3,}$',s):o.append('<hr>');i+=1;continue
        m=re.match(r'^(#{1,6})\s+(.*)$',s)
        if m:l=len(m.group(1));o.append('<h%d>%s</h%d>'%(l,inline(m.group(2)),l));i+=1;continue
        if '|' in L[i] and i+1<n and SEP.match(L[i+1]):
            hd=row(L[i]);i+=2;rs=[]
            while i<n and '|' in L[i] and L[i].strip()!='':rs.append(row(L[i]));i+=1
            t=['<table><thead><tr>']+['<th>%s</th>'%inline(c) for c in hd]+['</tr></thead><tbody>']
            for r in rs:t+=['<tr>']+['<td>%s</td>'%inline(c) for c in r]+['</tr>']
            t.append('</tbody></table>');o.append(''.join(t));continue
        if s.startswith('>'):
            b=[]
            while i<n and L[i].strip().startswith('>'):
                c=re.sub(r'^\s*>\s?','',L[i]);b.append(inline(c) if c.strip() else '');i+=1
            o.append('<blockquote>%s</blockquote>'%'<br>'.join(b));continue
        if re.match(r'^\s*[-*]\s+',L[i]):
            it=[]
            while i<n and re.match(r'^\s*[-*]\s+',L[i]):
                c=re.sub(r'^\s*[-*]\s+','',L[i]);cb=re.match(r'^\[([ xX])\]\s+(.*)$',c)
                it.append('<li>&#9744; %s</li>'%inline(cb.group(2)) if cb else '<li>%s</li>'%inline(c));i+=1
            o.append('<ul>%s</ul>'%''.join(it));continue
        if re.match(r'^\s*\d+\.\s+',L[i]):
            it=[]
            while i<n and re.match(r'^\s*\d+\.\s+',L[i]):
                c=re.sub(r'^\s*\d+\.\s+','',L[i]);it.append('<li>%s</li>'%inline(c));i+=1
            o.append('<ol>%s</ol>'%''.join(it));continue
        b=[]
        while i<n and L[i].strip()!='' and not L[i].strip().startswith(('#','>','```','|')) and not re.match(r'^\s*[-*]\s+',L[i]) and not re.match(r'^\s*\d+\.\s+',L[i]) and not re.match(r'^-{3,}$',L[i].strip()):
            b.append(inline(L[i].strip()));i+=1
        if b:o.append('<p>%s</p>'%'<br>'.join(b))
        else:i+=1
    return '\n'.join(o)

toc=[];body=[]
for k,(rel,label) in enumerate(MANIFEST):
    with open(os.path.join(ROOT,rel),'r',encoding='utf-8') as f:html=md(f.read())
    aid="sec%d"%k
    toc.append('<li><a href="#%s">%s</a></li>'%(aid,label))
    body.append('<section id="%s" class="sec">%s</section>'%(aid,html))

DOC="""<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<title>Formation comptabilite francaise externalisee - Livret complet 2026</title>
<style>
@page{size:A4;margin:18mm 16mm;}
body{font-family:Georgia,'Times New Roman',serif;color:#1c2733;line-height:1.5;font-size:11.5pt;max-width:900px;margin:0 auto;padding:20px;}
h1{color:#1F4E78;font-size:20pt;border-bottom:3px solid #E8A13A;padding-bottom:6px;}
h2{color:#1F4E78;font-size:15pt;margin-top:20px;}
h3{color:#2E6CA4;font-size:12.5pt;}
h4{font-size:11.5pt;}
a{color:#2E6CA4;text-decoration:none;}
table{border-collapse:collapse;width:100%;font-size:10pt;margin:10px 0;}
th{background:#1F4E78;color:#fff;text-align:left;padding:5px 7px;}
td{border:1px solid #c9d2dd;padding:4px 7px;vertical-align:top;}
tbody tr:nth-child(even){background:#f4f7fb;}
blockquote{background:#eef4fb;border-left:4px solid #2E6CA4;padding:6px 12px;margin:10px 0;}
code{background:#eef1f5;padding:1px 4px;border-radius:3px;font-family:Consolas,monospace;font-size:9.5pt;}
pre{background:#0f2233;color:#d7e3ee;padding:10px;border-radius:6px;overflow:auto;font-size:9pt;}
pre code{background:none;color:inherit;}
hr{border:none;border-top:1px solid #d6dde6;margin:16px 0;}
.cover{text-align:center;padding:60px 0;page-break-after:always;}
.cover h1{border:none;font-size:30pt;}
.cover p{font-size:13pt;color:#555;}
.toc{page-break-after:always;}
.toc h2{border-bottom:2px solid #E8A13A;}
.toc ol{font-size:12pt;line-height:1.9;}
.sec{page-break-before:always;}
@media screen{body{background:#fff;}}
</style></head><body>
<div class="cover">
  <h1>Comptabilite francaise externalisee</h1>
  <p><b>Formation complete &middot; Madagascar &rarr; cabinets francais</b></p>
  <p>Livret integral &middot; 20 modules + cas pratiques + evaluation + annexes</p>
  <p>Edition 2026 &middot; chiffres fiscaux et sociaux a jour (sources officielles)</p>
  <p style="margin-top:40px;font-size:11pt;color:#888;">Astuce : Fichier &rarr; Imprimer &rarr; Destination &laquo; Enregistrer au format PDF &raquo;</p>
</div>
<div class="toc"><h2>Sommaire</h2><ol>__TOC__</ol></div>
__BODY__
</body></html>"""

out=DOC.replace("__TOC__","".join(toc)).replace("__BODY__","\n".join(body))
# charte
_nm=(BR.get("cabinet_name") or "").strip()
_cover=(_nm+" &middot; " if _nm else "")+(BR.get("course_title") or "Comptabilite francaise externalisee")
out=out.replace("<h1>Comptabilite francaise externalisee</h1>","<h1>"+_cover+"</h1>")
out=out.replace("#1F4E78",BR["primary"]).replace("#E8A13A",BR["accent"])
with open(os.path.join(BASE,"Formation-complete.html"),"w",encoding="utf-8") as f:f.write(out)
print("sections:",len(MANIFEST),"| charte:",BR["primary"],BR["accent"],"| cabinet:",_nm or "(generique)")
