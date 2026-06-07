// ===== Contenu de la formation présenté en 4 MODULES (blocs) =====
// Les leçons détaillées (fichiers .md) sont regroupées en 4 modules. Seul le Module 1 est gratuit.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, cfg, esc } from './lib.mjs';

const MODDIR = path.join(ROOT, 'modules');
const gratuits = new Set((cfg.apercu && cfg.apercu.modules_gratuits) || ['mod1']);

// Définition des 6 modules (mod1 gratuit ; mod2→mod6 payants 30 000 Ar/module)
const MACRO = [
  {
    code: 'mod1', titre: 'Module 1 — Fondamentaux de la comptabilité française',
    resume: "Comprendre l'environnement d'un cabinet français, maîtriser le Plan Comptable Général (PCG), organiser un dossier et saisir les écritures de base.",
    topics: [
      "Rôle du cabinet et du collaborateur · confidentialité, RGPD, secret professionnel",
      "Débit/crédit, journal, grand livre, balance, bilan · PCG et comptes clés (401, 411, 512, 445…)",
      "Réception, classement et nommage des pièces · suivi du dossier",
      "Saisie pratique : achats, ventes, banque, OD · TVA, autoliquidation, intracommunautaire"
    ],
    files: ['Module-00-Pourquoi-compta-francaise.md', 'Module-01-Environnement-comptable-francais.md', 'Module-02-Bases-comptabilite-PCG.md', 'Module-03-Organisation-dossier-externalise.md', 'Module-04-Saisie-comptable-pratique.md', 'Module-1P-Principes-particularites.md', 'Module-1F-Externalisation-FacturX.md'],
    quiz: 'm01'
  },
  {
    code: 'mod2', titre: 'Module 2 — Prise en main du logiciel Pennylane',
    resume: "Pennylane en vidéo (lecteur intégré) : la saisie comptable, les règles de catégorisation des transactions, l'import d'un FEC et la reprise des immobilisations — chaque vidéo est expliquée pas à pas.",
    topics: [
      "🎥 Saisie comptable sur Pennylane (vidéo + explication)",
      "🎥 Créer des règles de catégorisation des transactions (vidéo + explication)",
      "🎥 Importer un FEC pour reprendre une compta existante (vidéo + explication)",
      "🎥 Reprise des immobilisations / à-nouveaux (vidéo + explication)",
      "Comment fonctionne la TVA sur Pennylane (comptes automatiques, biens vs services, débits/encaissements)",
      "🎥 Préparation de la déclaration de TVA sur Pennylane (vidéo + explication)",
      "Achats & ventes de services : exigibilité à l'encaissement, comptes d'attente 44574/44564, journal RT (illustré en images)",
      "🎥 Cadrage de la TVA sur Pennylane : cadrage + historique, base par taux et cadrage annuel (vidéo + explication)",
      "🎥 Formulaire CA3 / CA12 sur Pennylane (nouveaux formulaires, vidéo + explication)",
      "📌 Guide PDF épinglé : comment basculer sa comptabilité sur Pennylane (reprise d'un dossier)",
      "Préparer la liasse fiscale sur Pennylane (checklist complète : espace cabinet, dossier permanent, modules de révision)",
      "🎥 Figer la comptabilité sur Pennylane (vidéo + explication)"
    ],
    files: ['Module-PL1-Saisie.md', 'Module-PL2-Categorisation.md', 'Module-PL3-Import-FEC.md', 'Module-PL4-Reprise-immo.md', 'Module-PL5-TVA.md', 'Module-PL6-Preparation-TVA.md', 'Module-PL7-Services.md', 'Module-PL8-Cadrage-TVA.md', 'Module-PL9-CA3-CA12.md', 'Module-PL10-Basculer.md', 'Module-PL11-Liasse.md', 'Module-PL12-Figer.md'],
    quiz: 'm21'
  },
  {
    code: 'mod3', titre: 'Module 3 — Opérations, déclarations & révision',
    resume: "Toutes les opérations courantes et déclarations : TVA (CA3/CA12), rapprochement bancaire, lettrage, paie, immobilisations et révision par cycle — avec des leçons 100 % pratiques et des simulateurs interactifs pour s'entraîner comme en cabinet.",
    topics: [
      "TVA française : déclaration CA3 / CA12 + cadrage",
      "Rapprochement bancaire & lettrage clients / fournisseurs",
      "Comptes d'attente (471), paie et écritures sociales",
      "Immobilisations & amortissements",
      "Révision comptable : par cycle et par défilement (classes 1 à 7) — capital/KBIS/PVAGO, réserve légale, emprunts & tableau d'amortissement",
      "🛠️ Pratique métier : le quotidien du collaborateur + justifier les comptes par cycle",
      "🛠️ Saisir les factures particulières (recette/Z de caisse, note de frais, Uber, consigne/déconsigne…)",
      "🧮 Simulateurs interactifs : matrice de saisie, traitement de factures (cabinet) et déclaration de TVA"
    ],
    files: ['Module-05-TVA-francaise.md', 'Module-06-Rapprochement-bancaire.md', 'Module-07-Lettrage-clients-fournisseurs.md', 'Module-08-Comptes-attente-sensibles.md', 'Module-09-Paie-ecritures-sociales.md', 'Module-10-Immobilisations-amortissements.md', 'Module-11-Revision-comptable.md', 'Module-28-Revision-par-classe.md', 'Module-PRAT1-Quotidien.md', 'Module-PRAT2-Justification-cycles.md', 'Module-PRAT4-Factures-particulieres.md', 'Module-PRAT5-Entrainement-saisie.md', 'Module-PRAT6-Simulateur.md', 'Module-PRAT7-TVA-CA3.md'],
    quiz: 'm05'
  },
  {
    code: 'mod4', titre: 'Module 4 — Fiscalité, clôture & dossiers spécifiques',
    resume: "Maîtriser les règles fiscales essentielles, préparer les travaux de clôture, établir le bilan et traiter les spécificités comptables selon l'activité du client.",
    topics: [
      "Fiscalité des entreprises : IR/IS, BIC/BNC, acomptes, CFE/CVAE, DAS2 et crédit d'impôt formation du dirigeant",
      "Travaux de clôture et préparation du bilan : cut-off, FNP, CCA, FAE, PCA, intérêts courus, créances à contrôler, débours et régularisations de fin d'exercice",
      "Contrôles comptables de fin d'année : comptes sensibles, justification des soldes, cohérence fiscale, charges et produits rattachés à l'exercice",
      "Spécificités par activité : BNC, LMNP/LMP, SCI, SNC, services à la personne, tabac, auto-entrepreneur, association loi 1901, activité agricole (BA) et pharmacie",
      "Cas particuliers comptables et fiscaux : véhicules VP/VU, autoliquidation, retenue de garantie, situations de travaux, créances douteuses, régularisations et retraitements spécifiques",
      "Dossier Bâtiment / BTP : TVA sur travaux, autoliquidation, factures d'avancement, situations de travaux, retenues de garantie et contrôle des factures fournisseurs/clients"
    ],
    files: ['Module-12-Fiscalite-entreprises.md', 'Module-13-Bilan-cloture.md', 'Module-26-Specificites-cas-particuliers.md', 'Module-27-Specificites-par-activite.md', 'Module-29-Dossier-batiment.md', 'Module-PRAT3-Cloture-cas-fil-rouge.md'],
    quiz: 'm12'
  },
  {
    code: 'mod5', titre: 'Module 5 — Liasse fiscale & déclarations par régime',
    resume: "Comprendre, préparer et contrôler la liasse fiscale selon le régime d'imposition du client : réel normal, réel simplifié, BNC, agricole, SCI et revenus fonciers.",
    topics: [
      "Vue d'ensemble des régimes fiscaux : identifier le régime applicable, les obligations déclaratives et le lien comptabilité → résultat fiscal → liasse",
      "Passage du résultat comptable au résultat fiscal : réintégrations, déductions, charges non déductibles, produits non imposables, amortissements, provisions et retraitements",
      "Régime réel normal — tableaux 2050 à 2059 : bilan, compte de résultat, immobilisations, amortissements, provisions, créances et dettes (focus 2058-A)",
      "Régime réel simplifié — tableaux 2033-A à 2033-G : bilan et compte de résultat simplifiés, immobilisations, amortissements, provisions, plus-values et résultat fiscal",
      "BNC — déclaration contrôlée 2035 : recettes, dépenses professionnelles, immobilisations, amortissements et détermination du résultat non commercial",
      "Régime agricole — déclarations 2139 / 2143 : bénéfices agricoles, produits, charges, immobilisations et obligations déclaratives",
      "SCI et revenus fonciers — déclarations 2072 / 2044 : revenus locatifs, charges déductibles, intérêts d'emprunt et répartition entre associés"
    ],
    files: ['Module-30-Liasse-vue-ensemble.md', 'Module-31-Liasse-reel-normal.md', 'Module-32-Liasse-reel-simplifie.md', 'Module-33-Liasse-BNC-2035.md', 'Module-34-Liasse-agricole-fonciere.md'],
    quiz: null
  },
  {
    code: 'mod6', titre: 'Module 6 — Pratique métier, qualité, carrière & certification',
    resume: "Mettre en application les compétences acquises, adopter les méthodes de travail des cabinets comptables français, préparer son insertion professionnelle et valider son niveau par des cas pratiques et une évaluation finale.",
    topics: [
      "Outils et méthodes des cabinets comptables : logiciels, organisation des dossiers, méthodes de travail, respect des échéances et bonnes pratiques de production",
      "Communication professionnelle : mails clients, relances, demandes de pièces, échanges avec le chef de mission et posture professionnelle en cabinet",
      "Production offshore et qualité comptable : travail à distance, contrôle interne, suivi des tâches, traçabilité et exigences qualité des cabinets français",
      "Carrière, freelance et évolution professionnelle : collaborateur comptable, réviseur, superviseur, chef de mission junior, freelance ou prestataire offshore",
      "10 cas pratiques complets corrigés : saisie, TVA, rapprochement bancaire, lettrage, comptes d'attente, paie, révision, clôture, bilan et liasse fiscale",
      "Évaluation finale certifiante : test noté sur 100 points (compétences techniques, rigueur comptable, traitement d'un dossier client)",
      "Simulations d'entretien professionnel : collaborateur comptable, réviseur, chef de mission junior et superviseur comptable"
    ],
    files: ['Module-14-Outils-cabinets.md', 'Module-15-Communication-professionnelle.md', 'Module-16-Production-offshore.md', 'Module-17-Qualite-controle-interne.md', 'Module-20-Carriere-freelancing.md', 'Module-25-Simulations-entretien.md', 'Module-PRAT8-ChefMission.md'],
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
    if (s.startsWith('<') && s.endsWith('>')) { o.push(L[i]); i++; continue; }
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
