// ===== Contenu de la formation présenté en 4 MODULES (blocs) =====
// Les leçons détaillées (fichiers .md) sont regroupées en 4 modules. Seul le Module 1 est gratuit.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, cfg, esc } from './lib.mjs';

const MODDIR = path.join(ROOT, 'modules');
const gratuits = new Set((cfg.apercu && cfg.apercu.modules_gratuits) || ['mod1']);

// Définition des 4 modules
const MACRO = [
  {
    code: 'mod1', titre: 'Module 1 — Fondamentaux de la comptabilité française',
    resume: "Comprendre l'environnement d'un cabinet français, maîtriser le Plan Comptable Général (PCG) et organiser un dossier comptable externalisé.",
    topics: [
      "Rôle du cabinet et du collaborateur · confidentialité, RGPD, secret professionnel",
      "Débit/crédit, journal, grand livre, balance, bilan · PCG et comptes clés (401, 411, 512, 445…)",
      "Réception, classement et nommage des pièces · suivi du dossier"
    ],
    files: ['Module-01-Environnement-comptable-francais.md', 'Module-02-Bases-comptabilite-PCG.md', 'Module-03-Organisation-dossier-externalise.md'],
    quiz: 'm01'
  },
  {
    code: 'mod2', titre: 'Module 2 — Saisie comptable & logiciels cabinet',
    resume: "Saisir achats, ventes, banque, caisse et OD avec la bonne TVA, et maîtriser les logiciels utilisés par les cabinets français.",
    topics: [
      "Saisie pratique : achats, ventes, banque, OD · TVA, autoliquidation, intracommunautaire",
      "Pennylane", "Tiime", "Quadra (Cegid)", "Isacompta (ISAGRI)"
    ],
    files: ['Module-04-Saisie-comptable-pratique.md', 'Module-21-Logiciel-Pennylane.md', 'Module-22-Logiciel-Tiime.md', 'Module-23-Logiciel-Quadra.md', 'Module-24-Logiciel-Isacompta.md'],
    quiz: 'm04'
  },
  {
    code: 'mod3', titre: 'Module 3 — Opérations, déclarations & contrôle',
    resume: "TVA, rapprochement bancaire, lettrage, comptes d'attente, paie, immobilisations et révision par cycle.",
    topics: [
      "TVA française (CA3 / CA12)", "Rapprochement bancaire", "Lettrage clients / fournisseurs",
      "Comptes d'attente (471) et comptes sensibles", "Paie et écritures sociales",
      "Immobilisations et amortissements", "Révision comptable continue"
    ],
    files: ['Module-05-TVA-francaise.md', 'Module-06-Rapprochement-bancaire.md', 'Module-07-Lettrage-clients-fournisseurs.md', 'Module-08-Comptes-attente-sensibles.md', 'Module-09-Paie-ecritures-sociales.md', 'Module-10-Immobilisations-amortissements.md', 'Module-11-Revision-comptable.md'],
    quiz: 'm05'
  },
  {
    code: 'mod4', titre: 'Module 4 — Fiscalité, bilan, cas pratiques & évaluation',
    resume: "Fiscalité des entreprises, travaux de clôture et bilan, outils et posture professionnelle, cas pratiques et évaluation finale certifiante.",
    topics: [
      "Fiscalité (IR/IS, BIC/BNC, liasse fiscale)", "Bilan et clôture (cut-off, FNP, CCA, FAE, PCA)",
      "Outils, communication pro, production offshore, qualité", "Carrière & freelancing",
      "10 cas pratiques complets corrigés", "Évaluation finale certifiante (/100)"
    ],
    files: ['Module-12-Fiscalite-entreprises.md', 'Module-13-Bilan-cloture.md', 'Module-14-Outils-cabinets.md', 'Module-15-Communication-professionnelle.md', 'Module-16-Production-offshore.md', 'Module-17-Qualite-controle-interne.md', 'Module-20-Carriere-freelancing.md'],
    quiz: 'final'
  }
];

export const MODULES = MACRO.map(m => ({ code: m.code, titre: m.titre, gratuit: gratuits.has(m.code) }));
export const moduleInfo = code => { const m = MACRO.find(x => x.code === code); return m ? { ...m, gratuit: gratuits.has(code) } : null; };
export const estGratuit = code => gratuits.has(code);
const lire = file => { try { return fs.readFileSync(path.join(MODDIR, file), 'utf8'); } catch { return ''; } };

// ---- Rendu Markdown -> HTML (sous-ensemble, sûr : tout est échappé) ----
function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return '\x00' + (codes.length - 1) + '\x00'; });
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/\x00(\d+)\x00/g, (_, i) => '<code>' + esc(codes[+i]) + '</code>');
  return s;
}
const SEP = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/;
const cells = l => { l = l.trim(); if (l.startsWith('|')) l = l.slice(1); if (l.endsWith('|')) l = l.slice(0, -1); return l.split('|').map(c => c.trim()); };

export function mdToHtml(text) {
  const L = text.split('\n'); const o = []; let i = 0;
  while (i < L.length) {
    const s = L[i].trim();
    if (s.startsWith('```')) { const b = []; i++; while (i < L.length && !L[i].trim().startsWith('```')) b.push(L[i++]); i++; o.push('<pre><code>' + esc(b.join('\n')) + '</code></pre>'); continue; }
    if (s === '') { i++; continue; }
    if (/^-{3,}$/.test(s)) { o.push('<hr>'); i++; continue; }
    let m = s.match(/^(#{1,6})\s+(.*)$/);
    if (m) { const lv = Math.min(m[1].length + 1, 6); o.push(`<h${lv}>${inline(m[2])}</h${lv}>`); i++; continue; }
    if (L[i].includes('|') && i + 1 < L.length && SEP.test(L[i + 1])) {
      const hd = cells(L[i]); i += 2; const rows = [];
      while (i < L.length && L[i].includes('|') && L[i].trim() !== '') { rows.push(cells(L[i])); i++; }
      o.push('<div class="tbl"><table><thead><tr>' + hd.map(c => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>'
        + rows.map(r => '<tr>' + r.map(c => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>');
      continue;
    }
    if (s.startsWith('>')) { const b = []; while (i < L.length && L[i].trim().startsWith('>')) { const c = L[i].replace(/^\s*>\s?/, ''); b.push(c.trim() ? inline(c) : ''); i++; } o.push('<blockquote>' + b.join('<br>') + '</blockquote>'); continue; }
    if (/^\s*[-*]\s+/.test(L[i])) { const it = []; while (i < L.length && /^\s*[-*]\s+/.test(L[i])) { let c = L[i].replace(/^\s*[-*]\s+/, ''); const cb = c.match(/^\[([ xX])\]\s+(.*)$/); it.push('<li>' + (cb ? '&#9744; ' + inline(cb[2]) : inline(c)) + '</li>'); i++; } o.push('<ul>' + it.join('') + '</ul>'); continue; }
    if (/^\s*\d+\.\s+/.test(L[i])) { const it = []; while (i < L.length && /^\s*\d+\.\s+/.test(L[i])) { it.push('<li>' + inline(L[i].replace(/^\s*\d+\.\s+/, '')) + '</li>'); i++; } o.push('<ol>' + it.join('') + '</ol>'); continue; }
    const b = [];
    while (i < L.length && L[i].trim() !== '' && !/^\s*(#{1,6}\s|>|```|\d+\.\s|[-*]\s)/.test(L[i]) && !L[i].includes('|') && !/^-{3,}$/.test(L[i].trim())) { b.push(inline(L[i].trim())); i++; }
    if (b.length) o.push('<p>' + b.join('<br>') + '</p>'); else i++;
  }
  return o.join('\n');
}

function sectionRaw(text, reHead) {
  const L = text.split('\n'); let i = L.findIndex(l => reHead.test(l)); if (i < 0) return '';
  const out = []; i++;
  while (i < L.length && !/^##\s/.test(L[i])) { out.push(L[i]); i++; }
  return out.join('\n').trim();
}

export function moduleTitre(code) { const inf = moduleInfo(code); return inf ? inf.titre : ''; }

// Aperçu (teaser) : résumé + thèmes couverts + objectifs de la 1re leçon
export function teaserHtml(code) {
  const inf = moduleInfo(code); if (!inf) return '';
  const topics = (inf.topics || []).map(t => `<li>${esc(t)}</li>`).join('');
  let h = `<p class="lead">${esc(inf.resume)}</p><h3>Ce module couvre :</h3><ul>${topics}</ul>`;
  const first = inf.files && inf.files[0] ? lire(inf.files[0]) : '';
  const obj = first ? sectionRaw(first, /^##\s+.*Objectifs/i) : '';
  if (obj) h += '<h3>🎯 Objectifs pédagogiques (extrait)</h3>' + mdToHtml(obj);
  return h;
}

// Contenu complet (module gratuit) : concaténation des leçons
export function moduleCompletHtml(code) {
  const inf = moduleInfo(code); if (!inf) return '';
  return (inf.files || []).map(f => mdToHtml(lire(f))).join('\n<hr>\n');
}

// Quiz du module (depuis site/quizzes.json)
let _quiz = null;
export function quizFor(code) {
  if (_quiz === null) { try { _quiz = JSON.parse(fs.readFileSync(path.join(ROOT, 'site', 'quizzes.json'), 'utf8')); } catch { _quiz = {}; } }
  const inf = moduleInfo(code);
  return inf && _quiz[inf.quiz] ? _quiz[inf.quiz] : null;
}
