/* Composant CERFA interactif — illustration fidèle (non officielle) + bulle d'aide par case.
   Usage dans une leçon (.md), sur sa propre ligne :  <div class="cerfa" data-form="ca3"></div>
   Survol / focus / clic d'une case => bulle avec explication + indication de remplissage. */
(function () {
  if (window.__CERFA_INIT__) return; window.__CERFA_INIT__ = true;

  var CSS = [
    ".cerfa-doc{border:1px solid #c9d3df;border-radius:10px;background:#fcfdff;margin:18px 0;overflow:hidden;box-shadow:0 1px 6px rgba(20,40,70,.08);font-size:13px}",
    ".cerfa-head{background:#1F4E78;color:#fff;padding:9px 12px;display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}",
    ".cerfa-head .no{font-weight:800;background:#E8A13A;color:#1c2733;padding:2px 8px;border-radius:6px;font-size:12px;white-space:nowrap}",
    ".cerfa-head .ti{font-weight:700}",
    ".cerfa-intro{margin:8px 12px 0;color:#445}",
    ".cerfa-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:6px;padding:10px 12px}",
    ".cerfa-case{position:relative;border:1px solid #c9d3df;border-radius:7px;background:#fff;padding:6px 8px;cursor:help;transition:.12s;display:flex;flex-direction:column;gap:2px;min-height:56px}",
    ".cerfa-case:hover,.cerfa-case:focus{background:#fff8ec;border-color:#E8A13A;outline:none;box-shadow:0 2px 8px rgba(232,161,58,.25)}",
    ".cerfa-case .cc-code{font-weight:800;color:#1F4E78;font-size:11px}",
    ".cerfa-case .cc-lib{font-size:11.5px;color:#27384a;line-height:1.25}",
    ".cerfa-case .cc-val{margin-top:auto;border-top:1px dashed #cfd8e3;padding-top:3px;font-weight:700;color:#1f8a4c;text-align:right;min-height:14px}",
    ".cerfa-case.tot{background:#eef4fb;border-color:#1F4E78}",
    ".cerfa-case.tot .cc-val{color:#c0392b}",
    ".cerfa-note{margin:6px 12px 10px;color:#8a97a6;font-size:11.5px}",
    "#cerfa-tip{position:fixed;z-index:100000;max-width:310px;background:#0f2233;color:#eaf2fb;padding:10px 12px;border-radius:9px;font-size:12.5px;line-height:1.42;box-shadow:0 6px 20px rgba(0,0,0,.35);pointer-events:none;display:none}",
    "#cerfa-tip b{color:#E8A13A}",
    "#cerfa-tip .rmp{display:block;margin-top:6px;color:#bfe3c8}"
  ].join("");
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  var CERFA = {
    ca3: { no: "3310-CA3-SD", titre: "TVA — Régime réel normal (mensuelle/trimestrielle)",
      intro: "On déclare d'abord les bases (cadre A), puis on décompte la TVA (cadre B).",
      cases: [
        { code: "01", label: "Ventes, prestations", aide: "Cadre A — chiffre d'affaires HT taxable.", remplir: "Total HT des ventes/prestations soumises à TVA (comptes 70x)." },
        { code: "02", label: "Autres op. imposables", aide: "Opérations taxables hors ventes courantes.", remplir: "Bases autoliquidées (sous-traitance BTP, etc.)." },
        { code: "03", label: "Acquisitions intracom.", aide: "Achats de biens dans l'UE (autoliquidation).", remplir: "Base HT des acquisitions intracommunautaires." },
        { code: "04", label: "Exportations hors UE", aide: "Ventes hors UE, exonérées.", remplir: "Base HT (justifier l'exonération)." },
        { code: "05", label: "Autres op. non imposables", aide: "Opérations non soumises.", remplir: "Ex. CA du sous-traitant BTP (autoliquidée par le client)." },
        { code: "06", label: "Livraisons intracom.", aide: "Ventes de biens vers l'UE, exonérées.", remplir: "Base HT (client avec n° TVA UE valide - VIES)." },
        { code: "08", label: "Base 20 %", aide: "Taux normal.", remplir: "Total HT à 20 % ; la TVA = base × 20 % (colonne Taxe)." },
        { code: "09", label: "Base 10 %", aide: "Taux intermédiaire.", remplir: "Total HT à 10 %." },
        { code: "9B", label: "Base 5,5 %", aide: "Taux réduit.", remplir: "Total HT à 5,5 %." },
        { code: "17", label: "TVA acquisitions intracom.", aide: "TVA collectée auto-liquidée.", remplir: "TVA correspondant à la ligne 03." },
        { code: "16", label: "Total TVA brute", tot: true, aide: "Somme de la TVA collectée.", remplir: "Total des TVA des lignes 08/09/9B/17…" },
        { code: "19", label: "TVA déduct. immobilisations", aide: "TVA sur les investissements.", remplir: "TVA sur achats d'immobilisations (compte 44562)." },
        { code: "20", label: "TVA déduct. biens & services", aide: "TVA sur charges courantes.", remplir: "TVA sur achats/charges (compte 44566)." },
        { code: "22", label: "Crédit de TVA antérieur", aide: "Report du crédit.", remplir: "Crédit de TVA de la période précédente (ligne 25 N-1)." },
        { code: "23", label: "Total TVA déductible", tot: true, remplir: "Somme 19 + 20 + 22 (+ autres)." },
        { code: "28", label: "TVA nette due", tot: true, aide: "Si TVA brute > déductible.", remplir: "Ligne 16 − ligne 23 (si positif)." },
        { code: "25", label: "Crédit de TVA", aide: "Si déductible > brute.", remplir: "À reporter (ligne 22 suivante) ou demander en remboursement." },
        { code: "32", label: "Total à payer", tot: true, remplir: "Montant à télérégler à la DGFiP." }
      ] },

    ca12: { no: "3517-S-SD", titre: "TVA — Régime simplifié (déclaration annuelle CA12)",
      intro: "Déclaration annuelle ; 2 acomptes (juillet 55 % et décembre 40 %) sont versés en cours d'année.",
      cases: [
        { code: "Ventes", label: "CA HT total", aide: "Chiffre d'affaires de l'exercice.", remplir: "Total HT annuel (comptes 70x)." },
        { code: "20 %", label: "Base à 20 %", remplir: "Total HT taxé à 20 %." },
        { code: "10 %", label: "Base à 10 %", remplir: "Total HT taxé à 10 %." },
        { code: "5,5 %", label: "Base à 5,5 %", remplir: "Total HT taxé à 5,5 %." },
        { code: "TVA brute", label: "TVA collectée", tot: true, remplir: "Somme des TVA par taux." },
        { code: "0703", label: "TVA déduct. immobilisations", remplir: "TVA sur immos de l'année." },
        { code: "0702", label: "TVA déduct. biens & services", remplir: "TVA sur charges de l'année." },
        { code: "Acomptes", label: "Acomptes déjà versés", aide: "Acomptes semestriels.", remplir: "Somme des acomptes juillet + décembre." },
        { code: "Solde", label: "TVA due / crédit", tot: true, remplir: "TVA brute − déductible − acomptes." }
      ] },

    "2065": { no: "2065-SD", titre: "Déclaration de résultat — Impôt sur les sociétés (IS)",
      intro: "Récapitule le résultat fiscal et liquide l'IS (issu de la liasse 2050-2059 ou 2033).",
      cases: [
        { code: "Bénéfice", label: "Résultat fiscal (bénéfice)", aide: "Provient du 2058-A / 2033-B.", remplir: "Résultat fiscal imposable." },
        { code: "Déficit", label: "Résultat fiscal (déficit)", remplir: "Si négatif → reportable." },
        { code: "15 %", label: "Base à taux réduit", aide: "PME : 15 % jusqu'à 42 500 €.", remplir: "Fraction ≤ 42 500 € (si CA<10 M€, capital détenu 75 % PP)." },
        { code: "25 %", label: "Base à taux normal", remplir: "Fraction au-delà de 42 500 €." },
        { code: "+V LT", label: "Plus-values long terme", aide: "Taxées séparément.", remplir: "Montant des +V LT (titres de participation…)." },
        { code: "IS", label: "IS total", tot: true, remplir: "(15 % × base réduite) + (25 % × base normale)." },
        { code: "Crédits", label: "Crédits d'impôt imputés", remplir: "CICE/CIR/CIFD… à imputer sur l'IS." }
      ] },

    "2031": { no: "2031-SD", titre: "Déclaration de résultat — BIC à l'impôt sur le revenu (IR)",
      intro: "Pour les entreprises BIC à l'IR (EI, sociétés de personnes).",
      cases: [
        { code: "Résultat", label: "Résultat fiscal BIC", aide: "Issu de la liasse (2058-A / 2033-B).", remplir: "Bénéfice ou déficit fiscal." },
        { code: "Quote-part", label: "Quote-part par associé", aide: "Sociétés de personnes.", remplir: "Répartition selon les parts." },
        { code: "Exo", label: "Exonérations (ZFU/ZRR…)", remplir: "Fraction exonérée le cas échéant." },
        { code: "+V/-V", label: "Plus / moins-values", remplir: "CT (au résultat) / LT (taxées à part)." },
        { code: "Report", label: "Report sur la 2042-C-PRO", tot: true, remplir: "Le résultat est imposé à l'IR du foyer." }
      ] },

    "2058a": { no: "2058-A-SD", titre: "Détermination du résultat fiscal (réel normal)",
      intro: "Le tableau-clé : on part du résultat comptable, on ajoute (+) et on retranche (−).",
      cases: [
        { code: "WA", label: "Résultat comptable", aide: "Point de départ.", remplir: "Bénéfice (ou perte) du compte de résultat." },
        { code: "Réint.", label: "Rémunération exploitant (IR)", aide: "Réintégration (sociétés à l'IR).", remplir: "Rémunération de l'exploitant/associés, non déductible." },
        { code: "WJ", label: "Amendes & pénalités", aide: "Réintégration.", remplir: "Amendes, pénalités (compte 671)." },
        { code: "TVS", label: "Taxe sur les véhicules", aide: "Réintégration.", remplir: "Taxes annuelles sur les véhicules (ex-TVS)." },
        { code: "WE", label: "Amort. VP excédentaire", aide: "Réintégration.", remplir: "Part d'amortissement des VP au-delà du plafond." },
        { code: "Déduc.", label: "Mère-fille / +V LT", aide: "Déductions.", remplir: "Dividendes mère-fille (sauf QPFC 5 %), +V LT taxées à part." },
        { code: "XN", label: "Résultat fiscal", tot: true, remplir: "Résultat comptable + réintégrations − déductions." }
      ] },

    "2033b": { no: "2033-B-SD", titre: "Compte de résultat simplifié + résultat fiscal (RSI)",
      intro: "Au réel simplifié, un seul tableau regroupe le résultat comptable ET le passage au fiscal.",
      cases: [
        { code: "Résultat", label: "Résultat comptable", aide: "Produits − charges.", remplir: "Bénéfice/perte de l'exercice." },
        { code: "Réint.", label: "Réintégrations (+)", aide: "Charges non déductibles.", remplir: "Amendes, TVS, amort. VP excédentaire, rémunération exploitant (IR)." },
        { code: "Déduc.", label: "Déductions (−)", aide: "Produits non imposables.", remplir: "Plus-values LT, mère-fille, exonérations." },
        { code: "Fiscal", label: "Résultat fiscal", tot: true, remplir: "Comptable + réintégrations − déductions." }
      ] },

    "2035": { no: "2035-SD (A/B)", titre: "BNC — Déclaration contrôlée (professions libérales)",
      intro: "Logique de trésorerie : recettes ENCAISSÉES et dépenses PAYÉES.",
      cases: [
        { code: "AA", label: "Recettes encaissées", aide: "2035-A.", remplir: "Honoraires réellement encaissés sur l'année." },
        { code: "Achats", label: "Achats", remplir: "Fournitures/achats payés (2035-A)." },
        { code: "Personnel", label: "Frais de personnel", remplir: "Salaires nets + charges sociales." },
        { code: "Loyers", label: "Loyers & charges", remplir: "Loyer du cabinet, charges locatives." },
        { code: "Véhicule", label: "Frais de véhicule", aide: "Réel OU barème kilométrique.", remplir: "Carburant/entretien réels ou indemnités km (cohérent toute l'année)." },
        { code: "Social", label: "Cotisations sociales perso", remplir: "Cotisations obligatoires de l'exploitant." },
        { code: "Amort.", label: "Dotations amortissements", remplir: "Amortissement des immobilisations professionnelles." },
        { code: "Résultat", label: "Résultat (R − D)", tot: true, remplir: "Recettes − dépenses." },
        { code: "CSG", label: "CSG non déductible (2035-B)", aide: "Réintégration.", remplir: "Fraction de CSG non déductible." },
        { code: "Fiscal", label: "Résultat fiscal → 2042-C-PRO", tot: true, remplir: "Imposé à l'IR catégorie BNC." }
      ] },

    das2: { no: "DAS2 (n° 2460)", titre: "État des honoraires, commissions, courtages…",
      intro: "Déclaration d'information ; à déposer avec la déclaration de résultat.",
      cases: [
        { code: "Seuil", label: "Seuil 2 400 €/an", tot: true, aide: "Mise à jour : relevé de 1 200 € à 2 400 € (sommes versées dès 2024).", remplir: "Ne déclarer QUE ce qui dépasse 2 400 € par bénéficiaire/an." },
        { code: "Bénéf.", label: "Identité du bénéficiaire", aide: "Identification du tiers payé.", remplir: "Nom/dénomination, SIRET, adresse." },
        { code: "Honoraires", label: "Honoraires & vacations", remplir: "Sommes versées (compte 6226)." },
        { code: "Commissions", label: "Commissions, courtages", remplir: "Compte 6222." },
        { code: "Ristournes", label: "Ristournes", remplir: "Ristournes commerciales versées." },
        { code: "Droits", label: "Droits d'auteur", remplir: "Droits d'auteur/inventeur versés." }
      ] },

    cfe: { no: "1447-C / 1447-M-SD", titre: "CFE — Cotisation Foncière des Entreprises",
      intro: "1447-C : déclaration initiale (création). 1447-M : déclaration modificative.",
      cases: [
        { code: "1447-C", label: "Déclaration initiale", aide: "À déposer l'année de création.", remplir: "Avant le 31/12 de l'année de création." },
        { code: "1447-M", label: "Déclaration modificative", aide: "En cas de changement.", remplir: "Si modification (surface, exonération…) avant le 2e jour ouvré après le 1er mai." },
        { code: "Base", label: "Valeur locative des biens", aide: "Base de la CFE.", remplir: "Valeur locative des locaux utilisés." },
        { code: "Référence", label: "Période de référence", aide: "Année N-2.", remplir: "Biens utilisés en N-2." },
        { code: "Exo", label: "Exonérations", aide: "1re année exonérée ; année 2 base réduite de 50 %.", remplir: "Cocher l'exonération applicable." }
      ] },

    dsn: { no: "DSN (norme NEODeS)", titre: "Déclaration Sociale Nominative (mensuelle)",
      intro: "Générée par le LOGICIEL DE PAIE (pas remplie à la main) ; le collaborateur CONTRÔLE.",
      cases: [
        { code: "Individu", label: "Bloc Individu", aide: "Le salarié.", remplir: "État civil, NIR (n° sécu)." },
        { code: "Contrat", label: "Bloc Contrat", remplir: "Type de contrat, date, statut, temps de travail." },
        { code: "Rému", label: "Bloc Rémunération", remplir: "Brut, primes, heures, net imposable." },
        { code: "Cotis.", label: "Bloc Cotisations", remplir: "URSSAF, retraite, prévoyance, chômage." },
        { code: "Versement", label: "Bloc Versement organisme", aide: "Le paiement.", remplir: "Montants à verser aux organismes." },
        { code: "Échéance", label: "Échéance 5 ou 15", aide: "Date de dépôt/paiement.", remplir: "Le 5 ou le 15 du mois suivant selon l'effectif." }
      ] },

    "2139": { no: "2139-SD", titre: "Bénéfices Agricoles — réel simplifié (BA)",
      intro: "Liasse agricole simplifiée (2139-A bilan, 2139-B résultat…).",
      cases: [
        { code: "2139-A", label: "Bilan", remplir: "Actif/passif de l'exploitation." },
        { code: "2139-B", label: "Compte de résultat", remplir: "Produits/charges → résultat." },
        { code: "Stocks", label: "Stocks vivants", aide: "Animaux, récoltes.", remplir: "Valorisation (cours du jour / coût de revient)." },
        { code: "PAC", label: "Aides PAC", aide: "Subventions d'exploitation (74).", remplir: "Rattacher au bon exercice." },
        { code: "DPI/DPA", label: "Déductions invest./aléas", remplir: "DPI/DPA pratiquées." },
        { code: "Fiscal", label: "Résultat fiscal BA", tot: true, remplir: "Imposé à l'IR catégorie BA (ou IS si société)." }
      ] },

    "2072": { no: "2072-S-SD", titre: "SCI à l'IR — revenus fonciers",
      intro: "La SCI à l'IR ne paie pas l'impôt : le résultat est imposé chez les associés.",
      cases: [
        { code: "Loyers", label: "Loyers perçus", remplir: "Loyers nus encaissés." },
        { code: "Charges", label: "Charges déductibles", aide: "Foncier.", remplir: "Intérêts d'emprunt, travaux, taxe foncière, assurance, gestion." },
        { code: "Résultat", label: "Résultat foncier", tot: true, remplir: "Loyers − charges (pas d'amortissement)." },
        { code: "Quote-part", label: "Quote-part par associé", remplir: "Selon les parts détenues." },
        { code: "2044", label: "Report associé → 2044", aide: "Déclaration des associés.", remplir: "Chaque associé reporte sa part sur sa 2044." },
        { code: "Déficit", label: "Déficit foncier", aide: "Plafond.", remplir: "Imputable sur le revenu global jusqu'à 10 700 €/an." }
      ] }
  };

  function esc(t){ return (t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function escA(t){ return esc(t).replace(/"/g,"&quot;"); }

  var tip = null;
  function ensureTip(){ if(!tip){ tip=document.createElement("div"); tip.id="cerfa-tip"; document.body.appendChild(tip);} return tip; }
  function showTip(c, x, y){
    var t = ensureTip();
    t.innerHTML = "<b>" + esc(c.getAttribute("data-code")) + "</b> " + esc(c.getAttribute("data-aide"))
      + (c.getAttribute("data-rmp") ? "<span class='rmp'>✍️ À remplir : " + esc(c.getAttribute("data-rmp")) + "</span>" : "");
    t.style.display = "block";
    var w = t.offsetWidth, h = t.offsetHeight;
    t.style.left = Math.max(8, Math.min(x + 14, window.innerWidth - w - 10)) + "px";
    t.style.top = Math.max(8, Math.min(y + 14, window.innerHeight - h - 10)) + "px";
  }
  function hideTip(){ if(tip) tip.style.display = "none"; }

  function render(el){
    if(el.getAttribute("data-rendered")) return;
    el.setAttribute("data-rendered","1");
    var f = CERFA[el.getAttribute("data-form")];
    if(!f){ el.innerHTML = "<p style='color:#c0392b'>(CERFA non disponible : " + esc(el.getAttribute("data-form")) + ")</p>"; return; }
    var h = "<div class='cerfa-doc'><div class='cerfa-head'><span class='no'>" + esc(f.no) + "</span><span class='ti'>" + esc(f.titre) + "</span></div>";
    if(f.intro) h += "<div class='cerfa-intro'>" + esc(f.intro) + "</div>";
    h += "<div class='cerfa-grid'>";
    f.cases.forEach(function(c){
      h += "<div class='cerfa-case" + (c.tot ? " tot" : "") + "' tabindex='0' data-code='" + escA(c.code) + "' data-aide='" + escA(c.aide || "") + "' data-rmp='" + escA(c.remplir || "") + "'>"
        + "<span class='cc-code'>" + esc(c.code) + "</span><span class='cc-lib'>" + esc(c.label) + "</span>"
        + "<span class='cc-val'>" + esc(c.val || "") + "</span></div>";
    });
    h += "</div><div class='cerfa-note'>💡 Survolez (ou touchez) chaque case pour l'explication et l'indication de remplissage. Reproduction pédagogique simplifiée — document non officiel.</div></div>";
    el.innerHTML = h;
  }
  function renderAll(root){
    var r = root || document;
    if(!r.querySelectorAll) return;
    var list = r.querySelectorAll(".cerfa[data-form]");
    for(var i=0;i<list.length;i++) render(list[i]);
  }

  document.addEventListener("mouseover", function(e){ var c = e.target.closest ? e.target.closest(".cerfa-case") : null; if(c) showTip(c, e.clientX, e.clientY); });
  document.addEventListener("mousemove", function(e){ if(tip && tip.style.display==="block"){ var c = e.target.closest ? e.target.closest(".cerfa-case") : null; if(c) showTip(c, e.clientX, e.clientY); } });
  document.addEventListener("mouseout", function(e){ var c = e.target.closest ? e.target.closest(".cerfa-case") : null; if(c) hideTip(); });
  document.addEventListener("focusin", function(e){ var c = e.target.closest ? e.target.closest(".cerfa-case") : null; if(c){ var b=c.getBoundingClientRect(); showTip(c, b.left, b.bottom); } });
  document.addEventListener("focusout", hideTip);
  document.addEventListener("click", function(e){ var c = e.target.closest ? e.target.closest(".cerfa-case") : null; if(c){ var b=c.getBoundingClientRect(); showTip(c, b.left, b.bottom); } else { hideTip(); } });

  function boot(){
    renderAll(document);
    var content = document.getElementById("content");
    if(content && window.MutationObserver){
      new MutationObserver(function(){ renderAll(content); }).observe(content, { childList: true, subtree: true });
    }
  }
  if(document.readyState !== "loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
