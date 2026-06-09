/* Mini-simulateurs de calcul (theorie a cote) — composant 100% original, recolore navy/ambre.
   Usage :  <div class="calc" data-calc="ik"></div>
   Chaque calculateur est defini dans CALCS[id] = {titre, intro, inputs:[...], compute(vals)->{rows,extra}, source, exemple}.
   - inputs: {key,label,type:'number'|'select',unit?,def?,options?:[{val,lab}]}
   - compute(vals) renvoie {rows:[{l,v,b?}], extra?:htmlString}
*/
(function () {
  if (window.__CALC_INIT__) return; window.__CALC_INIT__ = true;

  var CSS = [
    ".cc{border:1px solid #cfdcee;border-radius:14px;background:#fff;margin:18px 0;overflow:hidden;box-shadow:0 3px 14px rgba(20,40,70,.10)}",
    ".cc-top{background:linear-gradient(135deg,#1F4E78,#2f6aa6);color:#fff;padding:11px 16px;font-weight:800;display:flex;align-items:center;gap:10px;flex-wrap:wrap}",
    ".cc-top .b{margin-left:auto;background:rgba(255,255,255,.2);padding:2px 10px;border-radius:20px;font-size:12px}",
    ".cc-in{padding:10px 16px;color:#33455c;background:#f4f8fd;border-bottom:1px solid #e4eef8;font-size:13.5px}",
    ".cc-bd{padding:14px 16px;display:grid;grid-template-columns:1fr 1fr;gap:10px 18px}",
    "@media(max-width:620px){.cc-bd{grid-template-columns:1fr}}",
    ".cc-f{display:flex;flex-direction:column;gap:4px}",
    ".cc-f label{font-size:12.5px;color:#22303f;font-weight:600}",
    ".cc-f input,.cc-f select{border:1px solid #cdd9e7;border-radius:8px;padding:8px 9px;font-family:inherit;font-size:13.5px;background:#fff;width:100%;box-sizing:border-box}",
    ".cc-f input{text-align:right;font-variant-numeric:tabular-nums}",
    ".cc-f input:focus,.cc-f select:focus{outline:none;border-color:#E8A13A;box-shadow:0 0 0 3px rgba(232,161,58,.2)}",
    ".cc-f .u{font-size:11px;color:#7d8aa0}",
    ".cc-act{padding:0 16px 12px}",
    ".cc-btn{background:#E8A13A;color:#3a2600;border:none;padding:10px 18px;border-radius:9px;font-weight:800;cursor:pointer;font-size:13.5px}",
    ".cc-btn:hover{background:#d9912b}",
    ".cc-out{margin:0 16px 14px;border:1px solid #e4eef8;border-radius:10px;overflow:hidden;display:none}",
    ".cc-out.on{display:block}",
    ".cc-row{display:flex;justify-content:space-between;gap:12px;padding:8px 12px;border-bottom:1px solid #eef3f9;font-size:13.5px}",
    ".cc-row:last-child{border-bottom:none}",
    ".cc-row .l{color:#33455c}",
    ".cc-row .v{font-weight:700;color:#1F4E78;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}",
    ".cc-row.big{background:#fff7ec}.cc-row.big .v{color:#b9740a;font-size:16px}",
    ".cc-row.warn{background:#fff3e0}.cc-row.warn .v{color:#9a5b00}",
    ".cc-xtra{padding:10px 12px;background:#f7faff;font-size:12.8px;color:#33455c;border-top:1px solid #e4eef8;line-height:1.5}",
    ".cc-xtra code{background:#eef3fa;padding:1px 5px;border-radius:5px;font-size:12px}",
    ".cc-ft{padding:8px 16px 12px;font-size:11.5px;color:#7d8aa0}",
    ".cc-ex{margin:0 16px 12px}",
    ".cc-ex summary{cursor:pointer;font-size:12.5px;color:#1F4E78;font-weight:600}",
    ".cc-ex .bx{margin-top:6px;padding:9px 11px;background:#f4f8fd;border:1px solid #e4eef8;border-radius:8px;font-size:12.8px;color:#33455c;line-height:1.5}"
  ].join("");
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  function num(v) { if (v == null) return 0; v = ("" + v).replace(/\s/g, "").replace(",", ".").replace(/[^0-9.\-]/g, ""); var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function eur(n) { return (Math.round((n || 0) * 100) / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; }
  function eur0(n) { return Math.round(n || 0).toLocaleString("fr-FR") + " €"; }
  function pct(n) { return (Math.round((n || 0) * 100) / 100).toLocaleString("fr-FR") + " %"; }

  // ===== Registre des calculateurs (rempli plus bas) =====
  var CALCS = {};

  function val(el, key) {
    var f = el.querySelector("[data-k='" + key + "']");
    if (!f) return "";
    return f.value;
  }

  function renderCalc(el) {
    var id = el.getAttribute("data-calc"); var c = CALCS[id];
    if (!c) { el.innerHTML = "<p style='color:#c0392b'>Simulateur introuvable : " + id + "</p>"; return; }
    el.classList.add("cc");
    var fields = c.inputs.map(function (f) {
      var ctrl;
      if (f.type === "select") {
        ctrl = "<select data-k='" + f.key + "'>" + (f.options || []).map(function (o) {
          return "<option value='" + o.val + "'" + (f.def === o.val ? " selected" : "") + ">" + o.lab + "</option>";
        }).join("") + "</select>";
      } else {
        ctrl = "<input data-k='" + f.key + "' inputmode='decimal' placeholder='0'" + (f.def != null ? " value='" + f.def + "'" : "") + ">";
      }
      return "<div class='cc-f'><label>" + f.label + (f.unit ? " <span class='u'>(" + f.unit + ")</span>" : "") + "</label>" + ctrl + "</div>";
    }).join("");
    el.innerHTML =
      "<div class='cc-top'>🧮 " + c.titre + "<span class='b'>Simulateur</span></div>" +
      (c.intro ? "<div class='cc-in'>" + c.intro + "</div>" : "") +
      "<div class='cc-bd'>" + fields + "</div>" +
      "<div class='cc-act'><button class='cc-btn'>Calculer</button></div>" +
      "<div class='cc-out'></div>" +
      (c.exemple ? "<details class='cc-ex'><summary>📊 Voir un exemple chiffré</summary><div class='bx'>" + c.exemple + "</div></details>" : "") +
      (c.source ? "<div class='cc-ft'>📚 " + c.source + "</div>" : "");
    var out = el.querySelector(".cc-out");
    function run() {
      var vals = {};
      c.inputs.forEach(function (f) { vals[f.key] = f.type === "select" ? val(el, f.key) : num(val(el, f.key)); });
      var r;
      try { r = c.compute(vals, { num: num, eur: eur, eur0: eur0, pct: pct }); }
      catch (e) { out.className = "cc-out on"; out.innerHTML = "<div class='cc-row warn'><span class='l'>Erreur</span><span class='v'>vérifiez les saisies</span></div>"; return; }
      var rows = (r.rows || []).map(function (x) {
        return "<div class='cc-row" + (x.b ? " big" : "") + (x.w ? " warn" : "") + "'><span class='l'>" + x.l + "</span><span class='v'>" + x.v + "</span></div>";
      }).join("");
      out.className = "cc-out on";
      out.innerHTML = rows + (r.extra ? "<div class='cc-xtra'>" + r.extra + "</div>" : "");
    }
    el.querySelector(".cc-btn").addEventListener("click", run);
    el.addEventListener("keydown", function (e) { if (e.key === "Enter") run(); });
  }

  function renderAll(root) {
    var r = root || document; if (!r.querySelectorAll) return;
    r.querySelectorAll(".calc[data-calc]").forEach(function (el) { if (!el.__cc) { el.__cc = true; renderCalc(el); } });
  }
  function boot() {
    renderAll(document);
    var content = document.getElementById("content");
    if (content && window.MutationObserver) new MutationObserver(function () { renderAll(content); }).observe(content, { childList: true, subtree: true });
  }

  // ============================================================
  // ===== DEFINITION DES CALCULATEURS (rempli apres specs) =====
  // ============================================================
  CALCS = {

  // ---------- 1) Indemnités kilométriques ----------
  "ik": {
    titre: "Indemnités kilométriques (barème voiture)",
    intro: "Barème fiscal 2026 (revenus 2025), voitures. Majoration +20 % pour un véhicule 100 % électrique.",
    inputs: [
      { key: "cv", label: "Puissance fiscale (case P.6 carte grise)", type: "select", def: "5", options: [
        { val: "3", lab: "3 CV et moins" }, { val: "4", lab: "4 CV" }, { val: "5", lab: "5 CV" }, { val: "6", lab: "6 CV" }, { val: "7", lab: "7 CV et plus" }] },
      { key: "km", label: "Kilométrage professionnel annuel", type: "number", unit: "km" },
      { key: "elec", label: "Véhicule 100 % électrique ?", type: "select", def: "non", options: [
        { val: "non", lab: "Non (thermique / hybride)" }, { val: "oui", lab: "Oui (100 % électrique)" }] }
    ],
    compute: function (v, h) {
      var B = { "3": { t1: 0.529, t2c: 0.316, t2f: 1065, t3: 0.370 }, "4": { t1: 0.606, t2c: 0.340, t2f: 1330, t3: 0.407 }, "5": { t1: 0.636, t2c: 0.357, t2f: 1395, t3: 0.427 }, "6": { t1: 0.665, t2c: 0.374, t2f: 1457, t3: 0.447 }, "7": { t1: 0.697, t2c: 0.394, t2f: 1515, t3: 0.470 } }[v.cv];
      var km = v.km, base, tr;
      if (km <= 5000) { base = km * B.t1; tr = "Jusqu'à 5 000 km"; }
      else if (km <= 20000) { base = km * B.t2c + B.t2f; tr = "De 5 001 à 20 000 km"; }
      else { base = km * B.t3; tr = "Au-delà de 20 000 km"; }
      var maj = v.elec === "oui" ? base * 0.20 : 0, tot = base + maj;
      return { rows: [
        { l: "Tranche appliquée", v: tr },
        { l: "Base barème", v: h.eur(base) },
        { l: "Majoration électrique (+20 %)", v: h.eur(maj) },
        { l: "Indemnité kilométrique totale", v: h.eur(tot), b: true }
      ], extra: "<b>Écriture :</b> Débit <code>625100</code> Voyages et déplacements — Crédit <code>455</code> compte courant d'associé (ou <code>108</code> en entreprise individuelle), pour " + h.eur(tot) + "." };
    },
    exemple: "Gérant, voiture 6 CV thermique, 8 400 km pro → 8 400 × 0,374 + 1 457 = <b>4 598,60 €</b>.",
    source: "Barème forfaitaire des frais de voiture (art. 6 B annexe IV du CGI) ; barème 2026 = revenus 2025 (inchangé depuis 2023). Vérifier l'arrêté annuel."
  },

  // ---------- 2) Taxes sur les véhicules de tourisme (ex-TVS) ----------
  "tvs": {
    titre: "Taxes annuelles sur les véhicules de tourisme (ex-TVS)",
    intro: "Deux taxes depuis 2022 : taxe CO2 (barème WLTP marginal) + taxe sur les polluants atmosphériques (Crit'Air). Barèmes 2025 (déclarés début 2026).",
    inputs: [
      { key: "co2", label: "Émissions de CO2 (champ V.7, WLTP)", type: "number", unit: "g/km" },
      { key: "carburant", label: "Motorisation", type: "select", def: "essence", options: [
        { val: "essence", lab: "Essence" }, { val: "diesel", lab: "Diesel / gazole" }, { val: "e85", lab: "Superéthanol E85" }, { val: "electrique", lab: "Électrique / hydrogène" }, { val: "hybride", lab: "Hybride (essence/élec)" }] },
      { key: "annee", label: "Année de 1re immatriculation", type: "number", unit: "année", def: "2022" },
      { key: "jours", label: "Jours d'affectation dans l'année", type: "number", unit: "jours", def: "365" }
    ],
    compute: function (v, h) {
      var base = v.co2;
      if (v.carburant === "e85" && v.co2 <= 250) base = v.co2 * 0.60;
      var taxeCO2 = 0;
      if (v.carburant !== "electrique") {
        var tr = [[9, 0], [50, 1], [58, 2], [90, 3], [110, 4], [130, 10], [150, 50], [170, 60], [Infinity, 65]], prec = 0;
        for (var i = 0; i < tr.length; i++) { var hb = tr[i][0], tf = tr[i][1]; if (base > prec) { taxeCO2 += (Math.min(base, hb) - prec) * tf; prec = hb; } }
      }
      var taxeP;
      if (v.carburant === "electrique") taxeP = 0;
      else if ((v.carburant === "essence" || v.carburant === "hybride" || v.carburant === "e85") && v.annee >= 2015) taxeP = 100;
      else taxeP = 500;
      var jours = v.jours > 0 ? v.jours : 365, pr = jours / 365;
      var c = Math.round(taxeCO2 * pr), p = Math.round(taxeP * pr);
      return { rows: [
        { l: "Taxe annuelle CO2 (proratisée)", v: h.eur0(c) },
        { l: "Taxe annuelle polluants (proratisée)", v: h.eur0(p) },
        { l: "TOTAL des deux taxes", v: h.eur0(c + p), b: true }
      ], extra: "À comptabiliser en <code>63512</code>. <b>Non déductible</b> du résultat si société à l'IS (réintégration extra-comptable). Électrique = exonéré de la taxe CO2. Barème CO2 renforcé chaque année jusqu'en 2027." };
    },
    exemple: "Essence 130 g/km, immat. 01/04/2025 (275 j) → CO2 433 € + polluants 100 €, prorata 275/365 ≈ <b>401 €</b>.",
    source: "CIBS art. L.421-93 s. ; barème CO2 art. L.421-120, polluants art. L.421-137 ; fiche DGFiP 2858-FC-SD. Vérifier le millésime avant chaque campagne."
  },

  // ---------- 3) Crédit d'impôt formation des dirigeants ----------
  "cifd": {
    titre: "Crédit d'impôt formation des dirigeants (CIFD)",
    intro: "Crédit = heures (plafond 40 h/an/entreprise) × SMIC horaire (×2 pour les micro-entreprises). ⚠ Dispositif supprimé depuis le 01/01/2025.",
    inputs: [
      { key: "heures", label: "Heures de formation du/des dirigeant(s)", type: "number", unit: "h" },
      { key: "smic", label: "SMIC horaire brut (au 31/12)", type: "number", unit: "€", def: "11.88" },
      { key: "micro", label: "Micro-entreprise (< 10 salariés ET ≤ 2 M€) ?", type: "select", def: "non", options: [
        { val: "non", lab: "Non — cas général (×1)" }, { val: "oui", lab: "Oui — micro-entreprise (×2)" }] }
    ],
    compute: function (v, h) {
      var hr = Math.min(v.heures, 40), coef = v.micro === "oui" ? 2 : 1, cr = Math.round(hr * v.smic * coef);
      return { rows: [
        { l: "Heures retenues (plafond 40 h)", v: hr.toLocaleString("fr-FR") + " h" },
        { l: "Coefficient", v: "×" + coef },
        { l: "Crédit d'impôt CIFD", v: h.eur(cr), b: true },
        { l: "Statut du dispositif", v: "supprimé depuis 2025", w: true }
      ], extra: "<b>⚠ Dispositif éteint</b> pour les heures effectuées à compter du 01/01/2025 (LF 2025) : calcul réservé aux exercices ≤ 2024 (régularisation / réclamation). <b>Écriture :</b> Débit <code>444</code> / Crédit <code>695</code> ; imputation sur l'impôt (2572), excédent restitué. À jour au 09/06/2026." };
    },
    exemple: "Micro-entreprise, gérant formé 48 h en 2024 → min(48 ; 40) = 40 × 11,88 € × 2 = <b>950 €</b>.",
    source: "Art. 244 quater M du CGI (I bis : doublement micro) ; BOI-BIC-RICI-10-50 ; LF 2025 (non-prorogation)."
  },

  // ---------- 4) TVA territoriale ----------
  "tva-terr": {
    titre: "TVA territoriale (UE / export / B2C)",
    intro: "Nature, sens, client, destination, montant → régime TVA, taux/exonération, mention de facture, comptes PCG et ligne CA3. À jour 2025/2026.",
    inputs: [
      { key: "nature", label: "Nature de l'opération", type: "select", def: "bien", options: [
        { val: "bien", lab: "Bien (marchandise)" }, { val: "service", lab: "Service (prestation)" }] },
      { key: "sens", label: "Sens", type: "select", def: "vente", options: [
        { val: "vente", lab: "Vente (l'entreprise FR facture)" }, { val: "achat", lab: "Achat (l'entreprise FR reçoit)" }] },
      { key: "client", label: "Partenaire", type: "select", def: "pro", options: [
        { val: "pro", lab: "Assujetti pro (B2B, n° TVA intra)" }, { val: "particulier", lab: "Particulier (B2C)" }] },
      { key: "destination", label: "Destination / origine", type: "select", def: "ue", options: [
        { val: "fr", lab: "France" }, { val: "ue", lab: "Autre pays UE" }, { val: "horsue", lab: "Hors UE" }] },
      { key: "montant_ht", label: "Montant HT", type: "number", unit: "€" },
      { key: "ca_b2c_ue_annuel", label: "CA annuel ventes à distance B2C UE (cumul)", type: "number", unit: "€", def: "0" },
      { key: "taux_fr", label: "Taux FR (si TVA française due)", type: "select", def: "0.20", options: [
        { val: "0.20", lab: "20 %" }, { val: "0.10", lab: "10 %" }, { val: "0.055", lab: "5,5 %" }, { val: "0.021", lab: "2,1 %" }] }
    ],
    compute: function (v, h) {
      var t = parseFloat(v.taux_fr), M = v.montant_ht, SEUIL = 10000, E = h.eur;
      var regime, taux, tva, mention, comptes, ca3;
      if (v.destination === "fr") {
        regime = "Opération interne France — TVA française"; taux = t; tva = M * t;
        if (v.sens === "vente") { mention = "TVA au taux " + (t * 100) + " %"; comptes = "411 (D) " + E(M * (1 + t)) + " / 70x (C) " + E(M) + " / 44571 (C) " + E(tva); ca3 = "Ligne 01 (base) + TVA collectée"; }
        else { mention = "TVA française déductible"; comptes = "6xx (D) " + E(M) + " / 44566 (D) " + E(tva) + " / 401 (C) " + E(M * (1 + t)); ca3 = "Ligne 20 (TVA déductible)"; }
      } else if (v.destination === "ue") {
        if (v.nature === "bien") {
          if (v.client === "pro") {
            if (v.sens === "vente") { regime = "Livraison intracommunautaire (LIC) — exonérée"; taux = 0; tva = 0; mention = "Exonération art. 262 ter, I du CGI (+ n° TVA intra client)"; comptes = "411 (D) / 707 (C) " + E(M); ca3 = "Ligne 06 (sans TVA) + état récapitulatif TVA"; }
            else { regime = "Acquisition intracommunautaire (AIC) — autoliquidation"; taux = t; tva = M * t; mention = "Facture fournisseur UE en HT"; comptes = "607 (D) " + E(M) + " / 445662 (D) " + E(tva) + " / 4452 (C) " + E(tva) + " / 401 (C) " + E(M); ca3 = "Ligne 03 + Ligne 17 (+" + E(tva) + ") + Ligne 20 (+" + E(tva) + ") → net 0"; }
          } else {
            if (v.sens === "vente") {
              var cumul = v.ca_b2c_ue_annuel || 0;
              if (cumul > SEUIL) { regime = "Vente à distance B2C UE — TVA du pays de destination (seuil 10 000 € dépassé)"; taux = null; tva = null; mention = "TVA du pays de destination (déclarée via OSS)"; comptes = "411 (D) / 707 (C) " + E(M) + " + 4457x (TVA pays UE)"; ca3 = "Hors CA3 → déclaration OSS trimestrielle"; }
              else { regime = "Vente à distance B2C UE sous le seuil — TVA française"; taux = t; tva = M * t; mention = "TVA française " + (t * 100) + " % (sous seuil 10 000 €)"; comptes = "411 (D) " + E(M * (1 + t)) + " / 707 (C) " + E(M) + " / 44571 (C) " + E(tva); ca3 = "Ligne 01 + TVA collectée"; }
            } else { regime = "Achat B2C à l'étranger — cas atypique pour une entreprise"; taux = null; tva = null; mention = "à analyser"; comptes = "—"; ca3 = "—"; }
          }
        } else {
          if (v.client === "pro") {
            if (v.sens === "vente") { regime = "Service B2B intra-UE — preneur redevable (art. 259-1°)"; taux = 0; tva = 0; mention = "Autoliquidation par le preneur (+ n° TVA intra)"; comptes = "411 (D) / 706 (C) " + E(M); ca3 = "Ligne 05 (base HT) + DES (Déclaration Européenne de Services)"; }
            else { regime = "Achat de service intra-UE — autoliquidation par le preneur FR"; taux = t; tva = M * t; mention = "Facture prestataire UE en HT"; comptes = "6xx (D) " + E(M) + " / 445662 (D) " + E(tva) + " / 4452 (C) " + E(tva) + " / 401 (C) " + E(M); ca3 = "Ligne 2A + Ligne 17 + Ligne 20 → net 0"; }
          } else { regime = "Service B2C UE — en principe TVA FR (sauf services électroniques > seuil → OSS)"; taux = t; tva = M * t; mention = "TVA française " + (t * 100) + " %"; comptes = "411 (D) " + E(M * (1 + t)) + " / 706 (C) " + E(M) + " / 44571 (C) " + E(tva); ca3 = "Ligne 01 (sauf bascule OSS services élec.)"; }
        }
      } else {
        if (v.nature === "bien") {
          if (v.sens === "vente") { regime = "Exportation de biens hors UE — exonérée"; taux = 0; tva = 0; mention = "Exonération art. 262, I du CGI"; comptes = "411 (D) / 707 (C) " + E(M); ca3 = "Ligne 04 (sans TVA) + preuve de sortie (DAU)"; }
          else { regime = "Importation de biens — TVA à l'import autoliquidée sur la CA3"; taux = t; tva = M * t; mention = "Déclaration douanière d'importation"; comptes = "607 (D) " + E(M) + " / 445662 (D) " + E(tva) + " / 4452 (C) " + E(tva) + " / 401 (C) " + E(M); ca3 = "TVA import autoliquidée (lignes I1/I2 + Ligne 20) → net 0"; }
        } else {
          if (v.sens === "vente") { regime = "Service B2B hors UE — hors champ TVA FR (art. 259-1°)"; taux = 0; tva = 0; mention = "TVA non applicable — art. 259-1° (preneur hors UE)"; comptes = "411 (D) / 706 (C) " + E(M); ca3 = "Ligne 05 — pas de DES (hors UE)"; }
          else { regime = "Achat de service hors UE — autoliquidation par le preneur FR"; taux = t; tva = M * t; mention = "Facture prestataire hors UE en HT"; comptes = "6xx (D) " + E(M) + " / 445662 (D) " + E(tva) + " / 4452 (C) " + E(tva) + " / 401 (C) " + E(M); ca3 = "Ligne 2A + Ligne 17 + Ligne 20 → net 0"; }
        }
      }
      var tauxTxt = taux === null ? "TVA pays de destination (OSS)" : (taux === 0 ? "Exonéré / hors champ (0 %)" : (taux * 100) + " %");
      var tvaTxt = tva === null ? "via OSS / pays dest." : (tva === 0 ? "0 €" : h.eur(tva));
      return { rows: [
        { l: "Taux / exonération", v: tauxTxt },
        { l: "Montant de TVA", v: tvaTxt, b: true }
      ], extra: "<b>Régime :</b> " + regime + "<br><b>Mention de facture :</b> " + mention + "<br><b>Comptes :</b> " + comptes + "<br><b>CA3 / annexe :</b> " + ca3 };
    },
    exemple: "Bien, vente, B2B, UE, 5 000 € → LIC <b>exonérée</b> (art. 262 ter I) ; 411/707 5 000 ; CA3 ligne 06 + état récapitulatif TVA.",
    source: "CGI art. 259, 262, 262 ter ; régime OSS (seuil unique 10 000 € depuis 01/07/2021)."
  },

  // ---------- 5) Amortissement LMNP ----------
  "lmnp-amort": {
    titre: "Amortissement déductible & report en LMNP (art. 39 C II)",
    intro: "L'amortissement ne peut pas créer de déficit : il est plafonné au loyer net des autres charges ; l'excédent est reporté sans limite de durée.",
    inputs: [
      { key: "loyers", label: "Loyers annuels encaissés", type: "number", unit: "€" },
      { key: "autresCharges", label: "Autres charges déductibles (hors amortissement)", type: "number", unit: "€" },
      { key: "amortTheorique", label: "Amortissement théorique de l'année", type: "number", unit: "€" },
      { key: "reportAnterieur", label: "Report d'amortissement antérieur (ARD)", type: "number", unit: "€", def: "0" }
    ],
    compute: function (v, h) {
      var base = v.loyers - v.autresCharges, dispo = v.amortTheorique + v.reportAnterieur;
      var deduit = base > 0 ? Math.min(dispo, base) : 0, report = dispo - deduit;
      var res = base > 0 ? base - deduit : base;
      return { rows: [
        { l: "Base de plafonnement (loyers − autres charges)", v: h.eur(base) },
        { l: "Amortissement déductible cette année", v: h.eur(deduit) },
        { l: "Nouvel amortissement reporté (ARD, illimité)", v: h.eur(report) },
        { l: "Résultat fiscal LMNP", v: h.eur(res), b: true, w: res < 0 }
      ], extra: (res < 0 ? "<b>Déficit BIC</b> (loyers < autres charges) : reportable sur les BIC non professionnels 10 ans. " : "Les loyers sont neutralisés par l'amortissement (résultat plafonné à 0). ") + "L'amortissement excédentaire (" + h.eur(report) + ") se déduira sur les exercices bénéficiaires suivants, <b>sans limite de durée</b> (art. 39 C II CGI). Terrain non amortissable ; amortir par composants." };
    },
    exemple: "Loyers 12 000, autres charges 7 000, amort. théorique 9 965, report 3 000 → base 5 000 ; déductible 5 000 ; reporté 7 965 ; résultat <b>0 €</b>.",
    source: "CGI art. 39 C II ; régime réel BIC (LMNP) ; amortissement reportable sans limite de durée."
  },

  // ---------- 6) SC / SCI à l'IR ----------
  "sc-ir": {
    titre: "SC / SCI à l'IR — résultat foncier & quote-part",
    intro: "Société semi-transparente (art. 8 CGI) : elle ne paie pas l'impôt. Loyers nus − charges (sans amortissement), réparti entre associés, imposé chez chacun (même sans distribution).",
    inputs: [
      { key: "loyers", label: "Loyers nus encaissés", type: "number", unit: "€" },
      { key: "charges", label: "Charges déductibles (dont intérêts d'emprunt)", type: "number", unit: "€" },
      { key: "partA", label: "Part de l'associé 1", type: "number", unit: "%", def: "50" },
      { key: "tmiA", label: "TMI associé 1", type: "select", def: "30", options: [
        { val: "0", lab: "0 %" }, { val: "11", lab: "11 %" }, { val: "30", lab: "30 %" }, { val: "41", lab: "41 %" }, { val: "45", lab: "45 %" }] },
      { key: "tmiB", label: "TMI associé 2", type: "select", def: "30", options: [
        { val: "0", lab: "0 %" }, { val: "11", lab: "11 %" }, { val: "30", lab: "30 %" }, { val: "41", lab: "41 %" }, { val: "45", lab: "45 %" }] }
    ],
    compute: function (v, h) {
      var PS = 0.172, rf = v.loyers - v.charges, pa = v.partA / 100, pb = (100 - v.partA) / 100;
      var qa = rf * pa, qb = rf * pb;
      var ia = Math.max(qa, 0) * (parseFloat(v.tmiA) / 100 + PS), ib = Math.max(qb, 0) * (parseFloat(v.tmiB) / 100 + PS);
      return { rows: [
        { l: "Résultat foncier de la SCI", v: h.eur(rf), b: true, w: rf < 0 },
        { l: "Quote-part associé 1 (" + v.partA + " %)", v: h.eur(qa) },
        { l: "Quote-part associé 2 (" + (100 - v.partA) + " %)", v: h.eur(qb) },
        { l: "Impôt estimé associé 1 (IR + PS)", v: h.eur(ia) },
        { l: "Impôt estimé associé 2 (IR + PS)", v: h.eur(ib) }
      ], extra: (rf < 0 ? "<b>Déficit foncier</b> : imputable sur le revenu global jusqu'à 10 700 €/an (hors intérêts), surplus reporté 10 ans. " : "") + "La SCI <b>ne paie aucun impôt</b> (pas d'IS, pas d'amortissement de l'immeuble). Chaque associé reporte sa quote-part sur sa <b>2044</b> → <b>2042</b>, imposé même sans distribution. (PS 17,2 % + TMI.)" };
    },
    exemple: "Loyers 24 000, charges 10 000 → résultat 14 000 ; associé 1 à 70 % = 9 800 € (impôt ≈ 5 704 € à 58,2 %).",
    source: "CGI art. 8 (transparence) et art. 31 (charges déductibles) ; PS 17,2 % ; barème IR 2026."
  },

  // ---------- 7) Cotisations TNS & provision ----------
  "tns": {
    titre: "Cotisations TNS & provision de régularisation (clôture)",
    intro: "Estime les cotisations sociales TNS de l'exercice et la provision de régularisation à constater. Taux global INDICATIF — à confirmer avec l'appel URSSAF du dossier.",
    inputs: [
      { key: "statut", label: "Statut du dirigeant", type: "select", def: "gerant_majo", options: [
        { val: "ei", lab: "Entrepreneur individuel (EI / BIC-BNC)" }, { val: "gerant_majo", lab: "Gérant majoritaire SARL / EURL" }, { val: "liberal", lab: "Profession libérale (BNC)" }] },
      { key: "revenu", label: "Revenu pro net / rémunération annuelle", type: "number", unit: "€" },
      { key: "deja_verse", label: "Cotisations déjà versées (provisionnelles)", type: "number", unit: "€" },
      { key: "taux", label: "Taux global indicatif des cotisations TNS", type: "number", unit: "%", def: "42" }
    ],
    compute: function (v, h) {
      var taux = v.taux > 0 ? v.taux : 42, cot = Math.round(v.revenu * taux / 100), prov = cot - v.deja_verse;
      var ecr, sens;
      if (prov > 0) { sens = "Complément à provisionner"; ecr = "Débit <code>646</code> Cotisations sociales " + h.eur(prov) + " / Crédit <code>438</code> (ou 4486) Charges sociales à payer " + h.eur(prov); }
      else if (prov < 0) { sens = "Trop-versé attendu (avoir URSSAF)"; ecr = "Débit <code>4487</code> Produits à recevoir " + h.eur(-prov) + " / Crédit <code>646</code> Cotisations sociales " + h.eur(-prov); }
      else { sens = "Rien à régulariser"; ecr = "—"; }
      var circuit = v.statut === "ei" ? "EI : décaissement réel <code>108</code> (D) / <code>512</code> (C) ; provision en 646/438." : "Société : charges en <code>646</code>.";
      var divid = v.statut === "gerant_majo" ? "<br><b>⚠ Gérant majoritaire :</b> la fraction de dividendes > 10 % du capital (+ primes + CCA) est soumise aux cotisations TNS." : "";
      return { rows: [
        { l: "Cotisations TNS estimées de l'exercice", v: h.eur0(cot) },
        { l: "Provision de régularisation", v: h.eur0(prov), b: true, w: prov !== 0 },
        { l: "Sens", v: sens }
      ], extra: "<b>Écriture :</b> " + ecr + "<br>" + circuit + divid + "<br><i>Taux global indicatif (~40-45 %, dégressif selon le revenu). PASS 2026 = 48 060 €. Chiffrage exact = appel URSSAF.</i>" };
    },
    exemple: "Gérant majoritaire, rémunération 60 000 €, déjà versé 22 000 €, taux 42 % → cotisations 25 200 € ; provision <b>3 200 €</b> (646 / 438).",
    source: "Sécurité sociale des indépendants ; assiette nette ; PASS 2026 = 48 060 €. Taux indicatif — confirmer avec l'URSSAF."
  },

  // ---------- 8) Provision à la clôture ----------
  "prov": {
    titre: "Provision à la clôture (dotation, écriture, fiscalité)",
    intro: "Calcule la dotation, propose l'écriture, rappelle la reprise et tranche la déductibilité fiscale. Comptes PCG 2025.",
    inputs: [
      { key: "type", label: "Type de provision", type: "select", def: "creance", options: [
        { val: "risque", lab: "Risque / charge (litige, garantie, gros entretien…)" }, { val: "creance", lab: "Dépréciation créance client douteuse (HT)" }, { val: "stock", lab: "Dépréciation de stock" }] },
      { key: "montant", label: "Montant HT à provisionner (base)", type: "number", unit: "€" },
      { key: "taux", label: "Taux de dépréciation (créance uniquement)", type: "number", unit: "%", def: "100" }
    ],
    compute: function (v, h) {
      var tx, dot, d, c, rep, fisc;
      if (v.type === "creance") {
        tx = v.taux; if (tx < 0) tx = 0; if (tx > 100) tx = 100; dot = v.montant * tx / 100;
        d = "68174 Dotation aux dépréciations des créances"; c = "491 Dépréciation des comptes clients (sur le HT)"; rep = "491 (D) / 78174 Reprise (C)";
        fisc = "Déductible (CGI art. 39,1-5°) si créance individualisée et risque probable. Reclasser 411 → 416. TVA récupérable seulement à l'irrécouvrabilité définitive (art. 272).";
      } else if (v.type === "risque") {
        tx = 100; dot = v.montant; d = "6815 Dotation aux provisions pour risques et charges"; c = "15x Provision (1511 litige, 1512 garantie, 1525 gros entretien…)"; rep = "15x (D) / 7815 Reprise (C)";
        fisc = "En principe déductible (CGI art. 39,1-5° : nettement précisée, probable, événement en cours). NON déductible : provision retraite / IFC (1521), propre assureur → à réintégrer.";
      } else {
        tx = 100; dot = v.montant; d = "6817 Dotation aux dépréciations de l'actif circulant"; c = "39x Dépréciation des stocks (ex. 397)"; rep = "39x (D) / 7817 Reprise (C)";
        fisc = "Déductible si évaluation fiable (valeur de réalisation nette < coût), justifiée article par article ou par catégorie.";
      }
      dot = Math.round(dot * 100) / 100;
      return { rows: [
        { l: "Montant de la dotation", v: h.eur(dot), b: true }
      ], extra: "<b>Dotation :</b> Débit <code>" + d + "</code> " + h.eur(dot) + " / Crédit <code>" + c + "</code> " + h.eur(dot) + "<br><b>Reprise (ultérieure) :</b> " + rep + "<br><b>Fiscal :</b> " + fisc };
    },
    exemple: "Créance douteuse 10 000 € HT, taux 60 % → dotation 6 000 € : 68174 (D) / 491 (C). Déductible.",
    source: "CGI art. 39,1-5° et art. 272 (TVA) ; PCG 2025 (règlement ANC 2022-06)."
  },

  // ---------- 9) Cotisations du dirigeant : SAS (assimilé salarié) vs TNS ----------
  "cotis-dir": {
    titre: "Cotisations du dirigeant — SAS vs TNS",
    intro: "Compare le coût social d'un dirigeant selon le statut : gérant majoritaire (TNS) ou président assimilé salarié (SAS/SASU). Taux indicatifs.",
    inputs: [
      { key: "rem", label: "Rémunération brute annuelle", type: "number", unit: "€" },
      { key: "capital", label: "Capital social", type: "number", unit: "€", def: "0" },
      { key: "div", label: "Dividendes distribués", type: "number", unit: "€", def: "0" }
    ],
    compute: function (v, h) {
      var TNS_R = 0.45, SAS_R = 0.67, PFU = 0.30, COT_DIV = 0.45, IR_DIV = 0.128, SEUIL = 0.10;
      var remTNS = v.rem * TNS_R, remSAS = v.rem * SAS_R;
      var seuil = v.capital * SEUIL, exc = Math.max(v.div - seuil, 0), norm = v.div - exc;
      var divTNS = norm * PFU + exc * (COT_DIV + IR_DIV);
      var divSAS = v.div * PFU;
      var totTNS = remTNS + divTNS, totSAS = remSAS + divSAS, eco = Math.abs(totTNS - totSAS);
      var verdict = eco < 1 ? "Équivalent" : (totTNS < totSAS ? "TNS (gérant majoritaire)" : "Assimilé salarié (SAS)");
      return {
        rows: [
          { l: "Coût TNS (gérant majoritaire) — total", v: h.eur(totTNS), b: true },
          { l: "Coût assimilé salarié (SAS/SASU) — total", v: h.eur(totSAS), b: true },
          { l: "Statut le moins coûteux", v: verdict + (eco >= 1 ? " (−" + h.eur(eco) + ")" : ""), w: true }
        ],
        extra: "<b>Détail (taux indicatifs)</b><table style='width:100%;border-collapse:collapse;font-size:12px;margin-top:4px'>" +
          "<tr><td></td><td style='text-align:right'><b>TNS</b></td><td style='text-align:right'><b>SAS</b></td></tr>" +
          "<tr><td>Cotisations sur rémunération</td><td style='text-align:right'>" + h.eur(remTNS) + " <small>(45 %)</small></td><td style='text-align:right'>" + h.eur(remSAS) + " <small>(67 %)</small></td></tr>" +
          "<tr><td>Dividendes : coût (cotis. + impôt)</td><td style='text-align:right'>" + h.eur(divTNS) + "</td><td style='text-align:right'>" + h.eur(divSAS) + "</td></tr>" +
          "</table>" +
          "<br>TNS : la fraction de dividendes <b>> 10 % du capital</b> (" + h.eur(exc) + ") supporte des <b>cotisations sociales</b> (~45 %) + IR ; le reste au <b>PFU 30 %</b>. SAS : dividendes au <b>PFU 30 %</b>, <b>sans</b> cotisations sociales, mais rémunération bien plus chargée." +
          "<br><i>⚠ Taux INDICATIFS : le coût réel TNS dépend du niveau de revenu et de l'appel URSSAF ; l'assimilé salarié représente ≈ 75-80 % de charges sur le net. À confirmer avec l'URSSAF / un simulateur officiel.</i>"
      };
    },
    exemple: "Rém. 40 000 €, capital 10 000 €, dividendes 20 000 € → TNS ≈ 29 282 € vs SAS ≈ 32 800 € : TNS plus avantageux ici.",
    source: "Comparaison gérant majoritaire (TNS) vs président assimilé salarié (SAS/SASU) ; dividendes TNS > 10 % du capital soumis à cotisations ; PFU 30 %. Taux indicatifs (d'après le simulateur dirigeant)."
  },

  // ---------- 10) Passage résultat comptable -> fiscal & IS ----------
  "is": {
    titre: "Du résultat comptable au résultat fiscal & IS",
    intro: "Calcule le résultat fiscal (réintégrations − déductions), impute les déficits (plafond 1 M€ + 50 %) et l'IS 2026 (15 % / 25 %).",
    inputs: [
      { key: "rc", label: "Résultat comptable avant impôt", type: "number", unit: "€" },
      { key: "reint", label: "Total des réintégrations (+)", type: "number", unit: "€", def: "0" },
      { key: "deduc", label: "Total des déductions (−)", type: "number", unit: "€", def: "0" },
      { key: "defAnt", label: "Déficits antérieurs reportables", type: "number", unit: "€", def: "0" },
      { key: "reduit", label: "Éligible au taux réduit 15 % ?", type: "select", def: "oui", options: [
        { val: "oui", lab: "Oui (CA < 10 M€, capital libéré, ≥75 % PP)" }, { val: "non", lab: "Non" }] }
    ],
    compute: function (v, h) {
      var rf = v.rc + v.reint - v.deduc, defAnt = Math.max(v.defAnt, 0);
      var imput = 0, base = 0, IS = 0, defRest = defAnt;
      if (rf <= 0) { defRest = defAnt + (-rf); }
      else {
        var plaf = 1000000 + 0.5 * Math.max(rf - 1000000, 0);
        imput = Math.min(defAnt, plaf, rf); base = rf - imput; defRest = defAnt - imput;
        if (v.reduit === "oui") { var t15 = Math.min(base, 42500); IS = t15 * 0.15 + Math.max(base - 42500, 0) * 0.25; }
        else IS = base * 0.25;
      }
      return {
        rows: [
          { l: "Résultat fiscal (avant déficits)", v: h.eur(rf), w: rf < 0 },
          { l: "Déficits imputés", v: h.eur(imput) },
          { l: "Base imposable", v: h.eur(base) },
          { l: "IS dû", v: h.eur(IS), b: true },
          { l: "Déficit reportable restant", v: h.eur(defRest), w: defRest > 0 }
        ],
        extra: "<b>Résultat fiscal</b> = résultat comptable + réintégrations (amendes, IS, TVS, amort. VP excédentaire, provisions non déductibles…) − déductions (mère‑fille, reprises de provisions déjà réintégrées…). <br><b>IS 2026 :</b> 15 % jusqu'à 42 500 € (si éligible), 25 % au‑delà. <b>Déficits :</b> report en avant illimité mais plafonné à <b>1 M€ + 50 %</b> du bénéfice au‑delà ; option carry‑back (2039). <br><b>Comptabilisation :</b> Débit <code>6951</code> IS / Crédit <code>444</code> État, impôt sur les bénéfices."
      };
    },
    exemple: "RC 100 000 € ; réintégrations 8 000 ; déductions 3 000 → résultat fiscal 105 000 €. Éligible 15 % → 42 500 × 15 % + 62 500 × 25 % = <b>22 000 €</b> d'IS.",
    source: "CGI art. 219 (taux IS), art. 209 (déficits). Taux réduit 15 % sur 42 500 € sous conditions ; 25 % standard 2026."
  },

  // ---------- 11) Plus-value LMNP à la revente (réforme LF 2025) ----------
  "pv-lmnp": {
    titre: "Plus-value LMNP à la revente (réforme 2025)",
    intro: "Depuis le 15/02/2025, les amortissements déduits sont RÉINTÉGRÉS dans la plus-value (LMNP au réel). Calcule la PV et l'impôt (régime des particuliers, abattements pour durée).",
    inputs: [
      { key: "acq", label: "Prix d'acquisition (frais inclus)", type: "number", unit: "€" },
      { key: "cess", label: "Prix de cession", type: "number", unit: "€" },
      { key: "amort", label: "Amortissements déduits (cumulés)", type: "number", unit: "€", def: "0" },
      { key: "annees", label: "Durée de détention", type: "number", unit: "ans", def: "0" }
    ],
    compute: function (v, h) {
      var n = Math.max(0, Math.floor(v.annees));
      var pvSansReint = Math.max(v.cess - v.acq, 0);
      var pv = Math.max(v.cess - (v.acq - Math.max(v.amort, 0)), 0);
      var aIR = n >= 22 ? 100 : (n >= 6 ? (n - 5) * 6 : 0);
      var aPS = n >= 30 ? 100 : (n >= 23 ? 28 + (n - 22) * 9 : (n >= 22 ? 28 : (n >= 6 ? (n - 5) * 1.65 : 0)));
      var ir = pv * (1 - aIR / 100) * 0.19, ps = pv * (1 - aPS / 100) * 0.172;
      return {
        rows: [
          { l: "PV sans réforme (ancien régime)", v: h.eur(pvSansReint) },
          { l: "Amortissements réintégrés (LF 2025)", v: h.eur(Math.max(v.amort, 0)) },
          { l: "Plus-value imposable", v: h.eur(pv), b: true },
          { l: "IR (19 % après abatt. " + Math.round(aIR) + " %)", v: h.eur(ir) },
          { l: "Prélèvements sociaux (17,2 % après abatt. " + (Math.round(aPS * 10) / 10) + " %)", v: h.eur(ps) },
          { l: "Total IR + PS", v: h.eur(ir + ps), b: true }
        ],
        extra: "<b>Réforme LF 2025 (art. 84)</b> : pour les cessions à compter du <b>15/02/2025</b>, la PV LMNP réintègre les <b>amortissements déduits</b> — PV = prix de cession − (prix d'acquisition − amortissements). <b>Exonérations pour durée :</b> IR à <b>22 ans</b>, prélèvements sociaux à <b>30 ans</b>. <b>Exclusions :</b> résidences services (étudiantes, seniors, EHPAD). <i>Indicatif (hors surtaxe PV > 50 000 € et cas particuliers).</i>"
      };
    },
    exemple: "Acquis 200 000 €, cédé 260 000 €, 40 000 € d'amortissements, 10 ans → PV imposable = 260 000 − (200 000 − 40 000) = <b>100 000 €</b> (vs 60 000 € avant la réforme).",
    source: "CGI art. 150 U s. ; LF 2025 art. 84 (réintégration des amortissements LMNP, cessions ≥ 15/02/2025). Indicatif."
  },

  // ---------- 12) Provision pour congés payés (clôture sociale) ----------
  "prov-cp": {
    titre: "Provision pour congés payés (clôture)",
    intro: "À la clôture : jours de CP acquis non pris × salaire journalier + charges patronales. Avec l'écriture comptable.",
    inputs: [
      { key: "jours", label: "Jours de CP acquis non pris (au 31/12)", type: "number", unit: "j" },
      { key: "sj", label: "Salaire journalier brut", type: "number", unit: "€" },
      { key: "taux", label: "Taux de charges patronales", type: "number", unit: "%", def: "42" }
    ],
    compute: function (v, h) {
      var base = v.jours * v.sj, ch = base * (v.taux > 0 ? v.taux : 42) / 100, tot = base + ch;
      return {
        rows: [
          { l: "Base congés payés (jours × salaire/j)", v: h.eur(base) },
          { l: "Charges patronales sur CP", v: h.eur(ch) },
          { l: "Provision totale à comptabiliser", v: h.eur(tot), b: true }
        ],
        extra: "<b>Écriture au 31/12 :</b><br>Débit <code>6412</code> Congés payés " + h.eur(base) + " · Débit <code>6452</code> Charges sociales sur CP " + h.eur(ch) + "<br>Crédit <code>4282</code> Dettes provisionnées pour CP " + h.eur(base) + " · Crédit <code>4382</code> Charges sociales sur CP " + h.eur(ch) + "<br><b>Déductible fiscalement</b> (provision certaine) ; reprise à la prise des congés. <i>Méthode alternative : 1/10 de la rémunération brute de la période de référence.</i>"
      };
    },
    exemple: "10 j non pris × 80 €/j = 800 € + 42 % (336 €) → provision <b>1 136 €</b> : 6412/6452 → 4282/4382.",
    source: "Provision pour congés payés (déductible, art. 39 CGI) ; comptes PCG 4282 / 4382."
  },

  // ---------- coût total d'un salarié ----------
  "cout-salarie": {
    titre: "Coût total d'un salarié",
    intro: "Du salaire brut au coût employeur (brut + charges patronales). Le net est approximatif (les charges salariales varient selon le statut).",
    inputs: [
      { key: "brut", label: "Salaire brut mensuel", type: "number", unit: "€" },
      { key: "tp", label: "Taux de charges patronales", type: "number", unit: "%", def: "42" }
    ],
    compute: function (v, h) {
      var tp = v.tp > 0 ? v.tp : 42;
      var patr = v.brut * tp / 100, coutM = v.brut + patr, coutA = coutM * 12, netApprox = v.brut * 0.78;
      return { rows: [
        { l: "Charges patronales (mensuelles)", v: h.eur(patr) },
        { l: "Coût total employeur (mensuel)", v: h.eur(coutM), b: true },
        { l: "Coût total employeur (annuel)", v: h.eur(coutA) },
        { l: "Net mensuel approximatif (~ −22 %)", v: h.eur(netApprox), w: true }
      ], extra: "<b>Écriture de paie :</b> Débit <code>641</code> brut " + h.eur(v.brut) + " · Débit <code>645</code> charges patronales " + h.eur(patr) + " → Crédit <code>421</code> net + <code>431</code>/<code>437</code> cotisations.<br>Règle d'or : <b>coût employeur ≈ brut × 1,42</b> · <b>net ≈ brut × 0,78</b> (ordre de grandeur ; dépend du statut et des taux réels)." };
    },
    exemple: "Brut 2 000 € × 42 % = 840 € → coût employeur <b>2 840 €/mois</b> (≈ 34 080 €/an) ; net ≈ 1 560 €.",
    source: "Taux indicatif de charges patronales (~40–45 % du brut). Vérifier les taux réels (URSSAF, retraite, prévoyance) selon la convention collective."
  },

  // ---------- Capacité d'autofinancement (CAF) ----------
  "caf": {
    titre: "Capacité d'autofinancement (CAF)",
    intro: "Méthode additive : à partir du résultat net, on réintègre les charges/produits sans incidence sur la trésorerie. La CAF = ressource dégagée par l'activité pour investir, rembourser, distribuer.",
    inputs: [
      { key: "rn", label: "Résultat net de l'exercice", type: "number", unit: "€" },
      { key: "dot", label: "Dotations aux amort. & provisions", type: "number", unit: "€" },
      { key: "rep", label: "Reprises sur amort. & provisions", type: "number", unit: "€", def: "0" },
      { key: "pc", label: "Produits de cession (compte 775)", type: "number", unit: "€", def: "0" },
      { key: "vnc", label: "VNC des éléments cédés (compte 675)", type: "number", unit: "€", def: "0" }
    ],
    compute: function (v, h) {
      var caf = v.rn + v.dot - v.rep - v.pc + v.vnc;
      return { rows: [
        { l: "Résultat net", v: h.eur(v.rn) },
        { l: "+ Dotations aux amort. & provisions", v: h.eur(v.dot) },
        { l: "− Reprises", v: h.eur(-v.rep) },
        { l: "− Produits de cession (775)", v: h.eur(-v.pc) },
        { l: "+ VNC des éléments cédés (675)", v: h.eur(v.vnc) },
        { l: "= Capacité d'autofinancement", v: h.eur(caf), b: true }
      ], extra: "La <b>CAF</b> mesure la trésorerie potentielle générée par l'exploitation (avant variation du BFR). Elle sert à <b>investir, rembourser les emprunts et distribuer des dividendes</b>. CAF − dividendes = <b>autofinancement</b>." };
    },
    exemple: "Résultat net 2 465 € + dotations 500 € (sans cession ni reprise) → CAF = <b>2 965 €</b> — cf. le fil rouge « SARL ZenBureau ».",
    source: "Méthode additive de la CAF (PCG ; liasse 2058-C). On retraite reprises et plus/moins-values de cession."
  },

  // ---------- Seuil de rentabilité (point mort) ----------
  "seuil-rentabilite": {
    titre: "Seuil de rentabilité (point mort)",
    intro: "Le chiffre d'affaires à partir duquel l'entreprise commence à gagner de l'argent (résultat = 0). On sépare charges variables (proportionnelles au CA) et charges fixes.",
    inputs: [
      { key: "ca", label: "Chiffre d'affaires annuel", type: "number", unit: "€" },
      { key: "cv", label: "Charges variables", type: "number", unit: "€" },
      { key: "cf", label: "Charges fixes", type: "number", unit: "€" }
    ],
    compute: function (v, h) {
      var mcv = v.ca - v.cv, taux = v.ca > 0 ? mcv / v.ca : 0;
      var sr = taux > 0 ? v.cf / taux : 0, pm = v.ca > 0 ? sr / v.ca * 365 : 0, res = mcv - v.cf;
      return { rows: [
        { l: "Marge sur coûts variables (MCV)", v: h.eur(mcv) },
        { l: "Taux de marge sur CV", v: h.pct(taux * 100) },
        { l: "Seuil de rentabilité (CA)", v: h.eur(sr), b: true },
        { l: "Point mort", v: Math.round(pm) + " jours (sur 365)" },
        { l: "Résultat actuel", v: h.eur(res), w: res < 0 }
      ], extra: "Au-dessus du <b>seuil de rentabilité</b>, chaque euro de CA dégage du bénéfice (au taux de MCV) ; en dessous, l'entreprise perd. Le <b>point mort</b> = la date de l'année où le seuil est atteint." };
    },
    exemple: "CA 100 000 €, charges variables 60 000 € (MCV 40 000, taux 40 %), charges fixes 30 000 € → seuil = 30 000 / 0,40 = <b>75 000 €</b> ; point mort ≈ 274 j ; résultat +10 000 €.",
    source: "Analyse coûts-volume-profit (gestion). Seuil = charges fixes / taux de marge sur coûts variables."
  }

  };

  if (document.readyState !== "loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
