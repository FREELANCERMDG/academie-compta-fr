# -*- coding: utf-8 -*-
"""Convertit tous les documents .md en HTML lisibles (double-clic) dans _DOCUMENTS_HTML/
avec un index unique. Aucune dépendance."""
import os, re, html as _h

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)
OUT = os.path.join(ROOT, "_DOCUMENTS_HTML")
os.makedirs(OUT, exist_ok=True)

GROUPES = [
    ("Présentation", ["README.md"]),
    ("Supports", ["supports"]),
    ("Annexes", ["annexes"]),
    ("Modules", ["modules"]),
    ("Cas pratiques", ["cas-pratiques"]),
    ("Évaluation", ["evaluations"]),
]

def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
def inline(s):
    codes = []
    s = re.sub(r'`([^`]+)`', lambda m: (codes.append(m.group(1)) or "\x00%d\x00" % (len(codes)-1)), s)
    s = esc(s)
    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', r'<a href="\2">\1</a>', s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', s)
    s = re.sub(r'\x00(\d+)\x00', lambda m: '<code>%s</code>' % esc(codes[int(m.group(1))]), s)
    return s
SEP = re.compile(r'^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$')
def row(l):
    l = l.strip()
    if l.startswith('|'): l = l[1:]
    if l.endswith('|'): l = l[:-1]
    return [c.strip() for c in l.split('|')]
def md(text):
    L = text.split('\n'); o = []; i = 0; n = len(L)
    while i < n:
        s = L[i].strip()
        if s.startswith('```'):
            b = []; i += 1
            while i < n and not L[i].strip().startswith('```'): b.append(L[i]); i += 1
            i += 1; o.append('<pre><code>%s</code></pre>' % esc('\n'.join(b))); continue
        if s == '': i += 1; continue
        if s.startswith('<') and s.endswith('>'): o.append(L[i]); i += 1; continue
        if s == '\\': o.append('<br>'); i += 1; continue
        if re.match(r'^-{3,}$', s): o.append('<hr>'); i += 1; continue
        m = re.match(r'^(#{1,6})\s+(.*)$', s)
        if m: lv = len(m.group(1)); o.append('<h%d>%s</h%d>' % (lv, inline(m.group(2)), lv)); i += 1; continue
        if '|' in L[i] and i+1 < n and SEP.match(L[i+1]):
            hd = row(L[i]); i += 2; rs = []
            while i < n and '|' in L[i] and L[i].strip() != '': rs.append(row(L[i])); i += 1
            t = ['<table><thead><tr>'] + ['<th>%s</th>' % inline(c) for c in hd] + ['</tr></thead><tbody>']
            for r in rs: t += ['<tr>'] + ['<td>%s</td>' % inline(c) for c in r] + ['</tr>']
            t.append('</tbody></table>'); o.append(''.join(t)); continue
        if s.startswith('>'):
            b = []
            while i < n and L[i].strip().startswith('>'):
                c = re.sub(r'^\s*>\s?', '', L[i]); b.append(inline(c) if c.strip() else ''); i += 1
            o.append('<blockquote>%s</blockquote>' % '<br>'.join(b)); continue
        if re.match(r'^\s*[-*]\s+', L[i]):
            it = []
            while i < n and re.match(r'^\s*[-*]\s+', L[i]):
                c = re.sub(r'^\s*[-*]\s+', '', L[i]); cb = re.match(r'^\[([ xX])\]\s+(.*)$', c)
                it.append('<li>&#9744; %s</li>' % inline(cb.group(2)) if cb else '<li>%s</li>' % inline(c)); i += 1
            o.append('<ul>%s</ul>' % ''.join(it)); continue
        if re.match(r'^\s*\d+\.\s+', L[i]):
            it = []
            while i < n and re.match(r'^\s*\d+\.\s+', L[i]):
                it.append('<li>%s</li>' % inline(re.sub(r'^\s*\d+\.\s+', '', L[i]))); i += 1
            o.append('<ol>%s</ol>' % ''.join(it)); continue
        b = []
        while i < n and L[i].strip() != '' and not L[i].strip().startswith(('#', '>', '```', '|')) and not re.match(r'^\s*[-*]\s+', L[i]) and not re.match(r'^\s*\d+\.\s+', L[i]) and not re.match(r'^-{3,}$', L[i].strip()):
            b.append(inline(L[i].strip())); i += 1
        if b: o.append('<p>%s</p>' % '<br>'.join(b))
        else: i += 1
    return '\n'.join(o)

CSS = """<style>
body{font-family:Segoe UI,Roboto,Arial,sans-serif;max-width:900px;margin:0 auto;padding:24px;color:#1c2733;line-height:1.55}
h1{color:#1F4E78;border-bottom:3px solid #E8A13A;padding-bottom:6px}h2{color:#1F4E78;margin-top:24px}h3{color:#2E6CA4}
a{color:#2E6CA4}table{border-collapse:collapse;width:100%;font-size:14px;margin:10px 0}
th{background:#1F4E78;color:#fff;text-align:left;padding:6px 9px}td{border:1px solid #c9d2dd;padding:5px 9px}
tbody tr:nth-child(even){background:#f4f7fb}blockquote{background:#eef4fb;border-left:4px solid #2E6CA4;padding:6px 12px}
code{background:#eef1f5;padding:1px 5px;border-radius:4px}pre{background:#0f2233;color:#d7e3ee;padding:12px;border-radius:8px;overflow:auto}
pre code{background:none;color:inherit}hr{border:none;border-top:1px solid #d6dde6;margin:18px 0}
.back{display:inline-block;margin-bottom:14px;font-weight:600}
</style>"""

def page(title, body, back=True):
    b = '<a class="back" href="index.html">← Tous les documents</a>' if back else ''
    return f"<!DOCTYPE html><html lang=fr><head><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><title>{esc(title)}</title>{CSS}</head><body>{b}{body}</body></html>"

def slug(p): return re.sub(r'[^a-zA-Z0-9]+', '-', p).strip('-')

index_items = []
for gname, paths in GROUPES:
    files = []
    for p in paths:
        full = os.path.join(ROOT, p)
        if os.path.isfile(full): files.append(full)
        elif os.path.isdir(full):
            files += [os.path.join(full, f) for f in sorted(os.listdir(full)) if f.endswith('.md')]
    links = []
    for f in files:
        rel = os.path.relpath(f, ROOT)
        with open(f, 'r', encoding='utf-8') as fh: txt = fh.read()
        title = (re.search(r'^#\s+(.*)$', txt, re.M) or [None, os.path.basename(f)])[1]
        out_name = slug(rel) + '.html'
        with open(os.path.join(OUT, out_name), 'w', encoding='utf-8') as fh:
            fh.write(page(title, md(txt)))
        links.append(f'<li><a href="{out_name}">{esc(title)}</a></li>')
    if links:
        index_items.append(f'<section><h2>{esc(gname)}</h2><ul>{"".join(links)}</ul></section>')

index_body = ('<h1>Documents de la formation — MG CONSULTING IT&amp;ACT</h1>'
              '<p>Cliquez pour ouvrir un document (lisible dans le navigateur).</p>' + ''.join(index_items))
with open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8') as fh:
    fh.write(page('Documents', index_body, back=False))
print('Documents HTML générés dans:', OUT)
