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
    ca3: { no: "3310-CA3-SD", titre: "TVA — Régime réel normal (CA3, mensuelle/trimestrielle)",
      intro: "Cadre A = montant des opérations ; Cadre B = décompte de la TVA. Codes officiels de la 3310-CA3-SD (n° de ligne + n° de case).",
      cases: [
        { code: "A1", label: "Ventes, prestations de services", aide: "Cadre A · case 0979 (base HT taxable).", remplir: "Total HT des ventes/prestations soumises à TVA (comptes 70x)." },
        { code: "A2", label: "Autres opérations imposables", aide: "Cadre A · case 0981.", remplir: "Autres produits HT taxables." },
        { code: "A3", label: "Prestations — prestataire non établi en France", aide: "Cadre A · case 0044 (art. 283-2, autoliquidation).", remplir: "Base HT des prestations reçues d'un prestataire étranger." },
        { code: "B2", label: "Acquisitions intracommunautaires", aide: "Cadre A · case 0031 (autoliquidation).", remplir: "Base HT des biens achetés dans l'UE." },
        { code: "E1", label: "Exportations hors UE", aide: "Cadre A · case 0032 — opération NON taxée.", remplir: "Base HT exonérée (justifier l'export)." },
        { code: "F2", label: "Livraisons intracommunautaires", aide: "Cadre A · case 0034 — NON taxée.", remplir: "Ventes de biens vers l'UE (client avec n° TVA valide - VIES)." },
        { code: "08", label: "Base 20 % (taux normal)", aide: "Cadre B · case 0207. Colonnes : Base HT + Taxe due.", remplir: "Total HT à 20 % ; Taxe due = base × 20 %." },
        { code: "09", label: "Base 5,5 %", aide: "Cadre B · case 0105.", remplir: "Total HT à 5,5 %." },
        { code: "9B", label: "Base 10 %", aide: "Cadre B · case 0151.", remplir: "Total HT à 10 %." },
        { code: "16", label: "Total de la TVA brute due", tot: true, aide: "Lignes 08 à 5B.", remplir: "Somme des TVA collectées (08, 09, 9B…)." },
        { code: "17", label: "Dont TVA sur acquisitions intracom.", aide: "Case 0035.", remplir: "TVA auto-liquidée sur les acquisitions UE." },
        { code: "19", label: "TVA déductible / immobilisations", aide: "Case 0703.", remplir: "TVA sur les achats d'immobilisations (compte 44562)." },
        { code: "20", label: "TVA déductible / autres biens et services", aide: "Case 0702.", remplir: "TVA sur les achats et charges courantes (compte 44566)." },
        { code: "22", label: "Report du crédit (ligne 27 décl. précédente)", aide: "Case 8001.", remplir: "Crédit de TVA reporté de la période précédente." },
        { code: "23", label: "Total TVA déductible", tot: true, aide: "Lignes 19 à 2C.", remplir: "Somme 19 + 20 + 22 (+ …)." },
        { code: "28", label: "TVA nette due (TD)", tot: true, aide: "Case 8901 = ligne 16 − ligne 23.", remplir: "Si TVA brute > déductible." },
        { code: "25", label: "Crédit de TVA", aide: "Case 0705 = ligne 23 − ligne 16.", remplir: "Si déductible > brute : à reporter (ligne 27) ou rembourser (formulaire 3519)." },
        { code: "27", label: "Crédit de TVA à reporter", aide: "Case 8003.", remplir: "Crédit reporté → ligne 22 de la déclaration suivante." },
        { code: "32", label: "Total à payer", tot: true, aide: "Case 9992 = lignes 28 + 29 + Z5 − AB.", remplir: "Montant à télérégler à la DGFiP." }
      ] },

    ca12: { no: "3517-S-SD", titre: "TVA — Régime simplifié (CA12, déclaration annuelle)",
      intro: "Déclaration annuelle ; 2 acomptes versés en cours d'année (juillet ≈ 55 %, décembre ≈ 40 %). Codes officiels de la 3517-S-SD.",
      cases: [
        { code: "01", label: "Achats en franchise", aide: "I · case 0037 — non taxé.", remplir: "Achats en franchise de TVA (le cas échéant)." },
        { code: "02", label: "Exportations hors UE", aide: "I · case 0032 — non taxé.", remplir: "Base HT exonérée." },
        { code: "5A", label: "Base 20 % (taux normal)", aide: "I · case 0207.", remplir: "Total HT annuel taxé à 20 %." },
        { code: "06", label: "Base 5,5 %", aide: "I · case 0105.", remplir: "Total HT à 5,5 %." },
        { code: "6C", label: "Base 10 %", aide: "I · case 0151.", remplir: "Total HT à 10 %." },
        { code: "11", label: "Cessions d'immobilisations", aide: "I · case 0970.", remplir: "Cessions taxables d'immobilisations." },
        { code: "16", label: "Total de la taxe due", tot: true, aide: "I · lignes 5A à 13.", remplir: "Somme des TVA collectées par taux." },
        { code: "19", label: "Total de la TVA brute due", tot: true, aide: "I · lignes 16 + 17 + 18 + AD.", remplir: "TVA brute totale de l'exercice." },
        { code: "20", label: "TVA déductible — biens & services (factures)", aide: "II · case 0702.", remplir: "TVA sur achats et charges de l'année." },
        { code: "23", label: "TVA déductible sur immobilisations", aide: "II · case 0703.", remplir: "TVA sur les immobilisations de l'année." },
        { code: "24", label: "Crédit antérieur non imputé/non remboursé", aide: "II · case 0058.", remplir: "Crédit de TVA reporté de l'an passé." },
        { code: "26", label: "Total de la TVA déductible", tot: true, aide: "II · lignes 22 + 23 + 24 + 25 + AE.", remplir: "TVA déductible totale." },
        { code: "28", label: "TVA due (ligne 19 − ligne 26)", tot: true, aide: "III · case 8900.", remplir: "Si TVA brute > déductible." },
        { code: "29", label: "Crédit (ligne 26 − ligne 19)", aide: "III · case 0705.", remplir: "Si déductible > brute." },
        { code: "30", label: "Acomptes payés (Acompte 1 + Acompte 2)", aide: "III · case 0018.", remplir: "Somme des acomptes semestriels déjà versés." },
        { code: "33", label: "Solde dû", tot: true, aide: "III · ligne 28 − (29 + 30).", remplir: "TVA restant à payer après acomptes." },
        { code: "35", label: "Solde excédentaire", aide: "III · case 0020 = lignes 29 + 34.", remplir: "Trop-versé → remboursement ou report." }
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
