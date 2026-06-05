// Convertit un fichier .md en .html lisible (à ouvrir dans le navigateur).
// Usage : node outils/md2html.mjs "chemin/vers/fichier.md"
import fs from 'node:fs';
import path from 'node:path';
import { mdToHtml } from '../platform/content.mjs';

const f = process.argv[2];
if (!f) { console.error('Usage: node outils/md2html.mjs <fichier.md>'); process.exit(1); }
const md = fs.readFileSync(f, 'utf8');
const body = mdToHtml(md);
const css = `body{font-family:Segoe UI,Arial,sans-serif;max-width:880px;margin:24px auto;padding:0 18px;color:#1c2733;line-height:1.55;background:#fff}
h1,h2,h3,h4{color:#1F4E78}h1{border-bottom:3px solid #E8A13A;padding-bottom:6px}
a{color:#2E6CA4}table{border-collapse:collapse;width:100%;margin:12px 0}
th{background:#1F4E78;color:#fff;padding:7px 9px;text-align:left}td{border:1px solid #e2e6ec;padding:6px 9px}
code{background:#eef1f5;padding:2px 6px;border-radius:5px}
pre{background:#0f2233;color:#d7e3ee;padding:12px;border-radius:8px;overflow:auto}pre code{background:none;color:inherit}
blockquote{background:#eef4fb;border-left:4px solid #2E6CA4;padding:8px 14px;border-radius:0 8px 8px 0;margin:12px 0}`;
const out = f.replace(/\.md$/i, '.html');
fs.writeFileSync(out, `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${path.basename(f)}</title><style>${css}</style></head><body>${body}</body></html>`);
console.log(out);
