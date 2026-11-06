/* Simulateur syndic de copropriété — composant 100% original, couleurs navy/ambre.
   Usage :  <div class="copro" data-copro="jacarandas"></div>
   Données : window.COPRO[id] (injecté par build_site.py depuis site/copro.json)
   Onglets : Immeuble · Budget & appels · Réalisé & régularisation · Annexes · Défi
   Hypothèses : provisions appelées = budget voté ; fonds de travaux réparti sur la 1re clé
   et intégralement encaissé ; « impayés » = appels budget non réglés au 31/12.
*/
(function () {
  if (window.__COPRO_INIT__) return; window.__COPRO_INIT__ = true;

  var CSS = [
    ".cpx{border:1px solid #cfdcee;border-radius:14px;background:#fff;margin:18px 0;overflow:hidden;box-shadow:0 3px 14px rgba(20,40,70,.10)}",
    ".cpx-top{background:linear-gradient(135deg,#1F4E78,#2f6aa6);color:#fff;padding:11px 16px;font-weight:800;display:flex;align-items:center;gap:10px;flex-wrap:wrap}",
    ".cpx-top .b{margin-left:auto;background:rgba(255,255,255,.2);padding:2px 10px;border-radius:20px;font-size:12px}",
    ".cpx-tabs{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px;background:#f4f8fd;border-bottom:1px solid #e4eef8}",
    ".cpx-tab{border:1px solid #cdd9e7;background:#fff;color:#1F4E78;border-radius:20px;padding:6px 12px;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit}",
    ".cpx-tab.on{background:#1F4E78;color:#fff;border-color:#1F4E78}",
    ".cpx-tab.rs{margin-left:auto;color:#9a5b00;border-color:#f3d3a1;background:#fff7ec}",
    ".cpx-pane{padding:12px 14px}",
    ".cpx-wrap{overflow-x:auto}",
    ".cpx table{width:100%;border-collapse:collapse;font-size:13px;margin:6px 0 10px}",
    ".cpx th{background:#eef3fa;color:#1F4E78;text-align:left;padding:6px 8px;font-size:12px;white-space:nowrap}",
    ".cpx td{padding:5px 8px;border-bottom:1px solid #eef3f9;color:#22303f}",
    ".cpx td.n,.cpx th.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}",
    ".cpx tr.tot td{font-weight:800;background:#fff7ec;color:#7a4b00}",
    ".cpx tr.sub td{font-weight:700;background:#f4f8fd;color:#1F4E78}",
    ".cpx input,.cpx select{border:1px solid #cdd9e7;border-radius:7px;padding:5px 7px;font-family:inherit;font-size:13px;width:100%;box-sizing:border-box;background:#fff;min-width:60px}",
    ".cpx input.n{text-align:right;font-variant-numeric:tabular-nums}",
    ".cpx input:focus,.cpx select:focus{outline:none;border-color:#E8A13A;box-shadow:0 0 0 3px rgba(232,161,58,.2)}",
    ".cpx-btn{background:#E8A13A;color:#3a2600;border:none;padding:7px 14px;border-radius:9px;font-weight:800;cursor:pointer;font-size:13px;font-family:inherit;margin:4px 6px 4px 0}",
    ".cpx-btn:hover{background:#d9912b}",
    ".cpx-btn.s{background:#eef3fa;color:#1F4E78}",
    ".cpx-x{background:none;border:none;color:#c0392b;cursor:pointer;font-size:15px;padding:2px 6px}",
    ".cpx-h{font-weight:800;color:#1F4E78;margin:14px 0 4px;font-size:14px}",
    ".cpx-ok,.cpx-ko,.cpx-note{padding:8px 10px;border-radius:8px;font-size:13px;margin:8px 0;line-height:1.5}",
    ".cpx-ok{background:#e8f6ee;border:1px solid #bfe5cf;color:#1d6b3f}",
    ".cpx-ko{background:#fff3e0;border:1px solid #f3d3a1;color:#9a5b00}",
    ".cpx-note{color:#33455c;background:#f7faff;border:1px solid #e4eef8}",
    ".cpx code{background:#eef3fa;padding:1px 5px;border-radius:5px;font-size:12px}",
    ".cpx-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px 14px;margin:6px 0 10px}",
    ".cpx-grid label{font-size:12px;font-weight:600;color:#22303f;display:block;margin-bottom:3px}",
    ".cpx-a1{display:grid;grid-template-columns:1fr 1fr;gap:12px}",
    "@media(max-width:640px){.cpx-a1{grid-template-columns:1fr}}",
    ".cpx-kpi{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}",
    ".cpx-kpi div{background:#f4f8fd;border:1px solid #e4eef8;border-radius:9px;padding:6px 10px;font-size:12px;color:#33455c}",
    ".cpx-kpi b{display:block;color:#1F4E78;font-size:15px}",
    ".cpx-ft{padding:8px 14px 12px;font-size:11.5px;color:#7d8aa0;border-top:1px solid #eef3f9}"
  ].join("");
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  // ---------- utilitaires ----------
  function num(v) { if (v == null) return 0; if (typeof v === "number") return v; v = ("" + v).replace(/\s/g, "").replace(",", ".").replace(/[^0-9.\-]/g, ""); var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function r2(n) { return Math.round((n || 0) * 100) / 100; }
  function fmt(n) { var x = r2(n); if (Math.abs(x) < 0.005) x = 0; return x.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function fmtN(n) { return (Math.round((n || 0) * 100) / 100).toLocaleString("fr-FR"); }
  function eur(n) { return fmt(n) + " €"; }
  function sgn(n) { return (r2(n) > 0 ? "+" : "") + fmt(n); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function sum(a, f) { var s = 0; a.forEach(function (x) { s += f ? f(x) : x; }); return s; }
  function keyLab(S, id) { for (var i = 0; i < S.cles.length; i++) if (S.cles[i].id === id) return S.cles[i].lib; return id; }
  function cpt(prefix, l, i) { return prefix + "-" + String(l.nom || ("LOT" + (i + 1))).toUpperCase().replace(/\s+/g, ""); }
  function inp(f, v, isNum) { return "<input " + (isNum ? "class='n' inputmode='decimal' " : "") + "data-f='" + f + "' value='" + esc(v) + "'>"; }

  // ---------- moteur de calcul ----------
  function calc(S) {
    var keys = S.cles.map(function (k) { return k.id; });
    var T = {}, B = {}, R = {};
    keys.forEach(function (k) { T[k] = 0; B[k] = 0; R[k] = 0; });
    S.lots.forEach(function (l) { keys.forEach(function (k) { T[k] += num(l.t[k]); }); });
    S.charges.forEach(function (c) { if (!(c.cle in B)) return; B[c.cle] += num(c.budget); R[c.cle] += num(c.reel); });
    var BT = sum(keys, function (k) { return B[k]; }), RT = sum(keys, function (k) { return R[k]; });
    var na = Math.max(1, parseInt(S.nb_appels, 10) || 4), ftKey = keys[0], FT = BT * num(S.ft_taux) / 100;
    var lots = S.lots.map(function (l) {
      var prov = 0, reg = {}, regT = 0;
      keys.forEach(function (k) { var q = T[k] > 0 ? num(l.t[k]) / T[k] : 0; prov += B[k] * q; reg[k] = (R[k] - B[k]) * q; regT += reg[k]; });
      var ft = T[ftKey] > 0 ? FT * num(l.t[ftKey]) / T[ftKey] : 0, imp = num(l.imp);
      return { l: l, provAn: prov, appel: prov / na, ftAn: ft, ftAppel: ft / na, reg: reg, regT: regT, imp: imp, solde: imp + regT };
    });
    var orphan = keys.filter(function (k) { return T[k] <= 0 && (B[k] || R[k]); });
    var impT = sum(lots, function (x) { return x.imp; });
    var deb = sum(lots, function (x) { return x.solde > 0 ? x.solde : 0; });
    var cre = sum(lots, function (x) { return x.solde < 0 ? -x.solde : 0; });
    var o = S.ouv, fd = num(S.fd);
    var b512 = num(o.banque) + (BT - impT) - (RT - fd), bft = num(o.banque_ft) + FT, f105 = num(o.fonds_travaux) + FT;
    return { keys: keys, T: T, B: B, R: R, BT: BT, RT: RT, na: na, FT: FT, ftKey: ftKey, lots: lots, orphan: orphan, impT: impT,
      deb: deb, cre: cre, fd: fd, b512: b512, bft: bft, f105: f105, avances: num(o.avances),
      ouvOk: Math.abs(num(o.banque) + num(o.banque_ft) - num(o.avances) - num(o.fonds_travaux)) < 0.01,
      actif: b512 + bft + deb, passif: num(o.avances) + f105 + fd + cre };
  }

  function journal(title, lines) {
    var d = 0, c = 0;
    var rows = lines.map(function (x) {
      d += x.d || 0; c += x.c || 0;
      return "<tr><td>" + esc(x.a) + "</td><td>" + esc(x.l) + "</td><td class='n'>" + (x.d ? fmt(x.d) : "") + "</td><td class='n'>" + (x.c ? fmt(x.c) : "") + "</td></tr>";
    }).join("");
    var ok = Math.abs(d - c) < 0.01;
    return "<div class='cpx-h'>" + title + "</div><div class='cpx-wrap'><table><thead><tr><th>Compte</th><th>Libellé</th><th class='n'>Débit</th><th class='n'>Crédit</th></tr></thead><tbody>" + rows +
      "<tr class='tot'><td colspan='2'>Total " + (ok ? "✅ équilibré" : "⚠️ déséquilibré") + "</td><td class='n'>" + fmt(d) + "</td><td class='n'>" + fmt(c) + "</td></tr></tbody></table></div>";
  }

  // ---------- Onglet 1 : Immeuble ----------
  function inImm(S) {
    var h = "<div class='cpx-note'>Les <b>tantièmes</b> sont fixés par le <b>règlement de copropriété</b>. Modifiez-les (ou ajoutez un lot) et observez l'effet sur les appels, la régularisation et l'annexe 1.</div>";
    h += "<div class='cpx-wrap'><table><thead><tr><th>Lot</th><th>Copropriétaire</th><th>Description</th>" +
      S.cles.map(function (k) { return "<th class='n'>Tantièmes " + esc(k.lib) + "</th>"; }).join("") + "<th></th></tr></thead><tbody>";
    S.lots.forEach(function (l, i) {
      h += "<tr><td>" + (i + 1) + "</td><td>" + inp("lot:" + i + ":nom", l.nom) + "</td><td>" + inp("lot:" + i + ":desc", l.desc || "") + "</td>" +
        S.cles.map(function (k) { return "<td>" + inp("lot:" + i + ":t:" + k.id, l.t[k.id], true) + "</td>"; }).join("") +
        "<td><button class='cpx-x' data-act='dellot:" + i + "' title='Supprimer ce lot'>✕</button></td></tr>";
    });
    return h + "</tbody></table></div><button class='cpx-btn s' data-act='addlot'>+ Ajouter un lot</button>";
  }
  function outImm(S, C) {
    var h = "<div class='cpx-kpi'>" + C.keys.map(function (k) { return "<div>Total tantièmes — " + esc(keyLab(S, k)) + "<b>" + fmtN(C.T[k]) + "</b></div>"; }).join("") +
      "<div>Nombre de lots<b>" + S.lots.length + "</b></div></div>";
    if (C.orphan.length) h += "<div class='cpx-ko'>⚠️ Clé sans aucun tantième : <b>" + C.orphan.map(function (k) { return esc(keyLab(S, k)); }).join(", ") + "</b> — ses charges ne pourront pas être réparties (l'annexe 1 sera déséquilibrée).</div>";
    else h += "<div class='cpx-ok'>✅ Chaque clé porte des tantièmes : toutes les charges pourront être réparties.</div>";
    return h + "<div class='cpx-note'>💡 Un lot à <b>0 tantième</b> sur une clé (ex. le commerce du RDC pour l'ascenseur) ne paie <b>rien</b> sur cette clé — ni provisions, ni régularisation.</div>";
  }

  // ---------- Onglet 2 : Budget & appels ----------
  function inBud(S) {
    var h = "<div class='cpx-grid'><div><label>Fonds de travaux (% du budget)</label>" + inp("g:ft_taux", S.ft_taux, true) + "</div>" +
      "<div><label>Nombre d'appels par an</label><select data-f='g:nb_appels'>" + [["4", "4 — trimestriels"], ["12", "12 — mensuels"], ["2", "2 — semestriels"], ["1", "1 — annuel"]].map(function (o) {
        return "<option value='" + o[0] + "'" + (String(S.nb_appels) === o[0] ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select></div></div>";
    h += "<div class='cpx-h'>Budget prévisionnel voté (charges TTC)</div><div class='cpx-wrap'><table><thead><tr><th>Compte</th><th>Libellé</th><th>Clé</th><th class='n'>Budget N</th><th></th></tr></thead><tbody>";
    S.charges.forEach(function (c, i) {
      h += "<tr><td style='width:80px'>" + inp("ch:" + i + ":compte", c.compte) + "</td><td>" + inp("ch:" + i + ":lib", c.lib) + "</td><td><select data-f='ch:" + i + ":cle'>" +
        S.cles.map(function (k) { return "<option value='" + esc(k.id) + "'" + (k.id === c.cle ? " selected" : "") + ">" + esc(k.lib) + "</option>"; }).join("") + "</select></td><td>" + inp("ch:" + i + ":budget", c.budget, true) +
        "</td><td><button class='cpx-x' data-act='delch:" + i + "' title='Supprimer cette charge'>✕</button></td></tr>";
    });
    return h + "</tbody></table></div><button class='cpx-btn s' data-act='addch'>+ Ajouter une charge</button>";
  }
  function outBud(S, C) {
    var h = "<div class='cpx-kpi'>" + C.keys.map(function (k) { return "<div>Budget " + esc(keyLab(S, k)) + "<b>" + eur(C.B[k]) + "</b></div>"; }).join("") +
      "<div>Budget total<b>" + eur(C.BT) + "</b></div><div>Appel budget / échéance<b>" + eur(C.BT / C.na) + "</b></div><div>Fonds de travaux / an<b>" + eur(C.FT) + "</b></div></div>";
    var mini = C.BT * 0.05;
    h += C.FT + 0.005 >= mini ? "<div class='cpx-ok'>✅ Fonds de travaux : " + eur(C.FT) + " ≥ minimum légal de 5 % du budget (" + eur(mini) + ").</div>"
      : "<div class='cpx-ko'>⚠️ Fonds de travaux : " + eur(C.FT) + " &lt; minimum légal de 5 % du budget (" + eur(mini) + "). Si un plan pluriannuel de travaux est adopté, le minimum est aussi d'au moins 2,5 % des travaux prévus.</div>";
    h += "<div class='cpx-h'>Appels de fonds par lot</div><div class='cpx-wrap'><table><thead><tr><th>Lot</th><th>Copropriétaire</th><th class='n'>Provisions / an</th><th class='n'>Appel budget / échéance</th><th class='n'>Fonds de travaux / échéance</th><th class='n'>Total / échéance</th><th class='n'>Total annuel</th></tr></thead><tbody>";
    C.lots.forEach(function (x, i) {
      h += "<tr><td>" + (i + 1) + "</td><td>" + esc(x.l.nom) + "</td><td class='n'>" + fmt(x.provAn) + "</td><td class='n'>" + fmt(x.appel) + "</td><td class='n'>" + fmt(x.ftAppel) + "</td><td class='n'><b>" + fmt(x.appel + x.ftAppel) + "</b></td><td class='n'>" + fmt(x.provAn + x.ftAn) + "</td></tr>";
    });
    var sA = sum(C.lots, function (x) { return x.appel; }), sF = sum(C.lots, function (x) { return x.ftAppel; });
    h += "<tr class='tot'><td colspan='2'>Total</td><td class='n'>" + fmt(sum(C.lots, function (x) { return x.provAn; })) + "</td><td class='n'>" + fmt(sA) + "</td><td class='n'>" + fmt(sF) + "</td><td class='n'>" + fmt(sA + sF) + "</td><td class='n'>" + fmt(sum(C.lots, function (x) { return x.provAn + x.ftAn; })) + "</td></tr></tbody></table></div>";
    h += Math.abs(sA - C.BT / C.na) < 0.01 ? "<div class='cpx-ok'>✅ Contrôle : Σ des appels (" + eur(sA) + ") = budget ÷ " + C.na + " (" + eur(C.BT / C.na) + ").</div>"
      : "<div class='cpx-ko'>⚠️ Σ des appels (" + eur(sA) + ") ≠ budget ÷ " + C.na + " (" + eur(C.BT / C.na) + ") : une clé n'a pas de tantièmes.</div>";
    var j1 = C.lots.map(function (x, i) { return { a: cpt("4501", x.l, i), l: "Appel provisions — échéance 1", d: x.appel }; });
    j1.push({ a: "701", l: "Provisions sur opérations courantes", c: sA });
    h += journal("Écriture d'appel — 1re échéance (journal OD / appels de fonds)", j1);
    if (C.FT > 0) {
      var j2 = C.lots.map(function (x, i) { return { a: cpt("4505", x.l, i), l: "Cotisation fonds de travaux — échéance 1", d: x.ftAppel }; });
      j2.push({ a: "105", l: "Fonds de travaux", c: sF });
      h += journal("Écriture d'appel du fonds de travaux — 1re échéance", j2);
    }
    return h;
  }

  // ---------- Onglet 3 : Réalisé & régularisation ----------
  function inReal(S) {
    var h = "<div class='cpx-note'>Saisissez les <b>charges réelles TTC</b> de l'exercice (factures + factures non parvenues). Le budget se modifie dans l'onglet « Budget & appels ».</div>";
    h += "<div class='cpx-wrap'><table><thead><tr><th>Compte</th><th>Libellé</th><th>Clé</th><th class='n'>Budget N</th><th class='n'>Réalisé N</th></tr></thead><tbody>";
    S.charges.forEach(function (c, i) {
      h += "<tr><td>" + esc(c.compte) + "</td><td>" + esc(c.lib) + "</td><td>" + esc(keyLab(S, c.cle)) + "</td><td class='n'>" + fmt(num(c.budget)) + "</td><td style='width:130px'>" + inp("ch:" + i + ":reel", c.reel, true) + "</td></tr>";
    });
    return h + "</tbody></table></div>";
  }
  function outReal(S, C) {
    var h = "<div class='cpx-h'>Compte de gestion par clé</div><div class='cpx-wrap'><table><thead><tr><th>Clé</th><th class='n'>Provisions (budget)</th><th class='n'>Charges réelles</th><th class='n'>Écart</th><th>Sens</th></tr></thead><tbody>";
    C.keys.forEach(function (k) {
      var e = C.R[k] - C.B[k];
      h += "<tr><td>" + esc(keyLab(S, k)) + "</td><td class='n'>" + fmt(C.B[k]) + "</td><td class='n'>" + fmt(C.R[k]) + "</td><td class='n'>" + sgn(e) + "</td><td>" + (r2(e) > 0 ? "insuffisance → à rappeler" : r2(e) < 0 ? "excédent → à rembourser" : "équilibre") + "</td></tr>";
    });
    h += "<tr class='tot'><td>Total</td><td class='n'>" + fmt(C.BT) + "</td><td class='n'>" + fmt(C.RT) + "</td><td class='n'>" + sgn(C.RT - C.BT) + "</td><td></td></tr></tbody></table></div>";
    h += "<div class='cpx-h'>Régularisation par lot</div><div class='cpx-wrap'><table><thead><tr><th>Lot</th><th>Copropriétaire</th>" +
      C.keys.map(function (k) { return "<th class='n'>" + esc(keyLab(S, k)) + "</th>"; }).join("") + "<th class='n'>Régularisation</th><th>Sens</th></tr></thead><tbody>";
    C.lots.forEach(function (x, i) {
      h += "<tr><td>" + (i + 1) + "</td><td>" + esc(x.l.nom) + "</td>" + C.keys.map(function (k) { return "<td class='n'>" + sgn(x.reg[k]) + "</td>"; }).join("") +
        "<td class='n'><b>" + sgn(x.regT) + "</b></td><td>" + (r2(x.regT) > 0 ? "à payer" : r2(x.regT) < 0 ? "à rembourser" : "—") + "</td></tr>";
    });
    var sR = sum(C.lots, function (x) { return x.regT; });
    h += "<tr class='tot'><td colspan='2'>Total</td>" + C.keys.map(function (k) { return "<td class='n'>" + sgn(sum(C.lots, function (x) { return x.reg[k]; })) + "</td>"; }).join("") + "<td class='n'>" + sgn(sR) + "</td><td></td></tr></tbody></table></div>";
    h += Math.abs(sR - (C.RT - C.BT)) < 0.01 ? "<div class='cpx-ok'>✅ Contrôle : Σ des régularisations (" + sgn(sR) + ") = charges réelles − provisions (" + sgn(C.RT - C.BT) + ").</div>"
      : "<div class='cpx-ko'>⚠️ Σ des régularisations ≠ charges réelles − provisions : une clé n'a pas de tantièmes.</div>";
    var agg = [], idx = {};
    S.charges.forEach(function (c) { var k = String(c.compte); if (!(k in idx)) { idx[k] = agg.length; agg.push({ a: k, l: c.lib, v: 0 }); } agg[idx[k]].v += num(c.reel); });
    var j = [{ a: "701", l: "Annulation des provisions appelées", d: C.BT }];
    C.lots.forEach(function (x, i) { if (r2(x.regT) > 0) j.push({ a: cpt("450", x.l, i), l: "Régularisation N — à payer", d: x.regT }); });
    agg.forEach(function (g) { if (g.v) j.push({ a: g.a, l: g.l, c: g.v }); });
    C.lots.forEach(function (x, i) { if (r2(x.regT) < 0) j.push({ a: cpt("450", x.l, i), l: "Régularisation N — à rembourser", c: -x.regT }); });
    return h + journal("Écriture de répartition (après approbation des comptes par l'AG)", j);
  }

  // ---------- Onglet 4 : Annexes ----------
  function inAnx(S) {
    var o = S.ouv;
    var h = "<div class='cpx-h'>Soldes d'ouverture et situation au 31/12</div><div class='cpx-grid'>" +
      "<div><label>Banque — compte courant à l'ouverture</label>" + inp("o:banque", o.banque, true) + "</div>" +
      "<div><label>Compte fonds de travaux à l'ouverture</label>" + inp("o:banque_ft", o.banque_ft, true) + "</div>" +
      "<div><label>Avances de trésorerie (1031)</label>" + inp("o:avances", o.avances, true) + "</div>" +
      "<div><label>Fonds de travaux (105) à l'ouverture</label>" + inp("o:fonds_travaux", o.fonds_travaux, true) + "</div>" +
      "<div><label>Factures fournisseurs non payées au 31/12</label>" + inp("g:fd", S.fd, true) + "</div></div>";
    h += "<div class='cpx-h'>Appels budget impayés au 31/12</div><div class='cpx-wrap'><table><thead><tr><th>Lot</th><th>Copropriétaire</th><th class='n'>Impayé</th></tr></thead><tbody>";
    S.lots.forEach(function (l, i) { h += "<tr><td>" + (i + 1) + "</td><td>" + esc(l.nom) + "</td><td style='width:140px'>" + inp("lot:" + i + ":imp", l.imp || 0, true) + "</td></tr>"; });
    return h + "</tbody></table></div>";
  }
  function outAnx(S, C) {
    var h = "";
    if (!C.ouvOk) h += "<div class='cpx-ko'>⚠️ Bilan d'ouverture déséquilibré : banque + compte fonds de travaux ≠ avances + fonds de travaux.</div>";
    var A = [["512", "Banque — compte courant" + (C.b512 < 0 ? " (découvert !)" : ""), C.b512], ["50", "Compte séparé — fonds de travaux", C.bft], ["450", "Copropriétaires débiteurs", C.deb]];
    var P = [["1031", "Avances de trésorerie", C.avances], ["105", "Fonds de travaux", C.f105], ["401", "Fournisseurs", C.fd], ["450", "Copropriétaires créditeurs", C.cre]];
    function side(t, L, tot) {
      return "<div class='cpx-wrap'><table><thead><tr><th colspan='2'>" + t + "</th><th class='n'>Montant</th></tr></thead><tbody>" +
        L.map(function (x) { return "<tr><td>" + x[0] + "</td><td>" + x[1] + "</td><td class='n'>" + fmt(x[2]) + "</td></tr>"; }).join("") +
        "<tr class='tot'><td colspan='2'>Total</td><td class='n'>" + fmt(tot) + "</td></tr></tbody></table></div>";
    }
    h += "<div class='cpx-h'>Annexe 1 — État financier après répartition au 31/12</div><div class='cpx-a1'>" + side("Actif (trésorerie et créances)", A, C.actif) + side("Passif (ressources et dettes)", P, C.passif) + "</div>";
    h += Math.abs(C.actif - C.passif) < 0.01 ? "<div class='cpx-ok'>✅ Annexe 1 équilibrée : actif = passif = " + eur(C.actif) + ".</div>"
      : "<div class='cpx-ko'>⚠️ Annexe 1 déséquilibrée (écart " + eur(C.actif - C.passif) + ") : vérifiez le bilan d'ouverture et les tantièmes.</div>";
    h += "<div class='cpx-note'><b>512</b> = " + fmt(num(S.ouv.banque)) + " (ouverture) + " + fmt(C.BT - C.impT) + " (appels budget encaissés : " + fmt(C.BT) + " − " + fmt(C.impT) + " impayés) − " + fmt(C.RT - C.fd) +
      " (factures payées : " + fmt(C.RT) + " − " + fmt(C.fd) + " restant dues) = <b>" + eur(C.b512) + "</b>. Les cotisations au fonds de travaux transitent par le 512 puis sont virées sur le compte séparé (effet nul). <b>Compte fonds de travaux</b> = solde du <b>105</b> = " + eur(C.f105) + ".</div>";
    h += "<div class='cpx-h'>Détail des comptes copropriétaires après répartition</div><div class='cpx-wrap'><table><thead><tr><th>Lot</th><th>Copropriétaire</th><th class='n'>Appels impayés</th><th class='n'>Régularisation</th><th class='n'>Solde</th><th>Position</th></tr></thead><tbody>";
    C.lots.forEach(function (x, i) {
      h += "<tr><td>" + (i + 1) + "</td><td>" + esc(x.l.nom) + "</td><td class='n'>" + fmt(x.imp) + "</td><td class='n'>" + sgn(x.regT) + "</td><td class='n'><b>" + fmt(x.solde) + "</b></td><td>" + (r2(x.solde) > 0 ? "débiteur" : r2(x.solde) < 0 ? "créditeur" : "soldé") + "</td></tr>";
    });
    h += "</tbody></table></div>";
    h += "<div class='cpx-h'>Annexe 2 — Compte de gestion général</div><div class='cpx-wrap'><table><thead><tr><th>Opérations courantes</th><th class='n'>Budget N</th><th class='n'>Réalisé N</th></tr></thead><tbody>" +
      "<tr><td>Charges (classe 6)</td><td class='n'>" + fmt(C.BT) + "</td><td class='n'>" + fmt(C.RT) + "</td></tr>" +
      "<tr><td>Provisions appelées (701)</td><td class='n'>" + fmt(C.BT) + "</td><td class='n'>" + fmt(C.BT) + "</td></tr>" +
      "<tr class='tot'><td>Solde réparti entre les copropriétaires</td><td class='n'>" + fmt(0) + "</td><td class='n'>" + sgn(C.RT - C.BT) + "</td></tr></tbody></table></div>" +
      "<div class='cpx-note'>Dans ce scénario, aucun travaux hors budget : les <b>annexes 4</b> (travaux et opérations exceptionnelles) et <b>5</b> (travaux votés non clôturés) sont vides. En pratique, l'annexe 2 présente aussi les budgets <b>N+1</b> et <b>N+2</b>.</div>";
    h += "<div class='cpx-h'>Annexe 3 — Compte de gestion des opérations courantes</div><div class='cpx-wrap'><table><thead><tr><th>Compte</th><th>Libellé</th><th class='n'>Budget N</th><th class='n'>Réalisé N</th><th class='n'>Écart</th></tr></thead><tbody>";
    C.keys.forEach(function (k) {
      h += "<tr class='sub'><td colspan='5'>Clé : " + esc(keyLab(S, k)) + "</td></tr>";
      S.charges.forEach(function (c) { if (c.cle !== k) return; h += "<tr><td>" + esc(c.compte) + "</td><td>" + esc(c.lib) + "</td><td class='n'>" + fmt(num(c.budget)) + "</td><td class='n'>" + fmt(num(c.reel)) + "</td><td class='n'>" + sgn(num(c.reel) - num(c.budget)) + "</td></tr>"; });
      h += "<tr class='sub'><td colspan='2'>Sous-total " + esc(keyLab(S, k)) + "</td><td class='n'>" + fmt(C.B[k]) + "</td><td class='n'>" + fmt(C.R[k]) + "</td><td class='n'>" + sgn(C.R[k] - C.B[k]) + "</td></tr>";
    });
    return h + "<tr class='tot'><td colspan='2'>Total des charges courantes</td><td class='n'>" + fmt(C.BT) + "</td><td class='n'>" + fmt(C.RT) + "</td><td class='n'>" + sgn(C.RT - C.BT) + "</td></tr></tbody></table></div>";
  }

  // ---------- Onglet 5 : Défi ----------
  function newDefi(S) {
    if (!S.lots.length) return null;
    var nas = [4, 4, 4, 12, 2], B = {}, R = {};
    S.cles.forEach(function (k, j) {
      var b = (j === 0 ? 150 + Math.floor(Math.random() * 151) : 20 + Math.floor(Math.random() * 41)) * 100;
      B[k.id] = b; R[k.id] = Math.round(b * (0.88 + Math.random() * 0.24) / 10) * 10;
    });
    return { i: Math.floor(Math.random() * S.lots.length), na: nas[Math.floor(Math.random() * nas.length)], B: B, R: R };
  }
  function solveDefi(S, D) {
    var appel = 0, reg = 0, steps = [];
    S.cles.forEach(function (k) {
      var T = sum(S.lots, function (l) { return num(l.t[k.id]); }), t = num(S.lots[D.i].t[k.id]), q = T > 0 ? t / T : 0;
      appel += D.B[k.id] * q; reg += (D.R[k.id] - D.B[k.id]) * q;
      steps.push("<b>" + esc(k.lib) + "</b> : provisions " + fmtN(D.B[k.id]) + " × " + fmtN(t) + "/" + fmtN(T) + " = " + fmt(D.B[k.id] * q) + " € ; écart (" + fmtN(D.R[k.id]) + " − " + fmtN(D.B[k.id]) + ") × " + fmtN(t) + "/" + fmtN(T) + " = " + sgn((D.R[k.id] - D.B[k.id]) * q) + " €");
    });
    return { appel: appel / D.na, reg: reg, steps: steps };
  }
  function inDefi(S, D) {
    if (!D) return "<div class='cpx-ko'>Ajoutez au moins un lot dans l'onglet Immeuble.</div>";
    var l = S.lots[D.i];
    var h = "<div class='cpx-note'>🎯 <b>À vous de jouer !</b> Calculez pour le lot <b>" + (D.i + 1) + " — " + esc(l.nom) + "</b> : (1) l'<b>appel budget par échéance</b> (" + D.na + " appels par an) et (2) la <b>régularisation</b> de l'exercice (positive si le copropriétaire doit payer, négative s'il doit être remboursé). Tantièmes : ceux de l'onglet Immeuble.</div>";
    h += "<div class='cpx-wrap'><table><thead><tr><th>Clé</th><th class='n'>Tantièmes du lot</th><th class='n'>Total tantièmes</th><th class='n'>Budget voté</th><th class='n'>Charges réelles</th></tr></thead><tbody>";
    S.cles.forEach(function (k) {
      h += "<tr><td>" + esc(k.lib) + "</td><td class='n'>" + fmtN(num(l.t[k.id])) + "</td><td class='n'>" + fmtN(sum(S.lots, function (x) { return num(x.t[k.id]); })) + "</td><td class='n'>" + fmt(D.B[k.id]) + "</td><td class='n'>" + fmt(D.R[k.id]) + "</td></tr>";
    });
    h += "</tbody></table></div><div class='cpx-grid'><div><label>(1) Appel budget par échéance (€)</label><input class='n' inputmode='decimal' data-f='defi:appel'></div><div><label>(2) Régularisation (€, signe compris)</label><input class='n' inputmode='decimal' data-f='defi:reg'></div></div>";
    return h + "<button class='cpx-btn' data-act='dchk'>Vérifier</button><button class='cpx-btn s' data-act='dsol'>Corrigé</button><button class='cpx-btn s' data-act='dnew'>🎲 Nouveau défi</button>";
  }

  var TABS = [["imm", "🏢 Immeuble"], ["bud", "📋 Budget & appels"], ["real", "🧾 Réalisé & régularisation"], ["anx", "📑 Annexes"], ["defi", "🎯 Défi"]];
  var IN = { imm: inImm, bud: inBud, real: inReal, anx: inAnx };
  var OUT = { imm: outImm, bud: outBud, real: outReal, anx: outAnx };

  function mount(el) {
    var id = el.getAttribute("data-copro"), data = (window.COPRO || {})[id];
    if (!data) { el.innerHTML = "<p style='color:#c0392b'>Simulateur copropriété introuvable : " + esc(id) + "</p>"; return; }
    el.classList.add("cpx");
    var S = clone(data), tab = "imm", D = null;
    el.innerHTML = "<div class='cpx-top'>🏢 Simulateur syndic — " + esc(data.titre) + "<span class='b'>Exercice " + esc(data.exercice || "N") + "</span></div>" +
      "<div class='cpx-tabs'>" + TABS.map(function (t) { return "<button class='cpx-tab' data-act='tab:" + t[0] + "'>" + t[1] + "</button>"; }).join("") +
      "<button class='cpx-tab rs' data-act='reset'>↺ Réinitialiser</button></div><div class='cpx-pane'></div>" +
      "<div class='cpx-ft'>📚 Plan comptable des copropriétés (arrêté du 14 mars 2005 modifié) · loi du 10 juillet 1965, art. 10, 14-1 et 14-2-1. Hypothèses : provisions appelées = budget voté ; fonds de travaux réparti sur la 1re clé et entièrement encaissé ; impayés = appels budget non réglés.</div>";
    var pane = el.querySelector(".cpx-pane");

    function out() { var o = pane.querySelector(".cpx-out"); if (o && OUT[tab]) o.innerHTML = OUT[tab](S, calc(S)); }
    function render() {
      el.querySelectorAll(".cpx-tab").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-act") === "tab:" + tab); });
      if (tab === "defi") {
        if (!D || D.i >= S.lots.length) D = newDefi(S);
        pane.innerHTML = inDefi(S, D) + "<div class='cpx-out'></div>";
      } else {
        pane.innerHTML = "<div class='cpx-inp'>" + IN[tab](S) + "</div><div class='cpx-out'></div>";
        out();
      }
    }
    function checkDefi(showSol) {
      if (!D) return;
      var o = pane.querySelector(".cpx-out"), s = solveDefi(S, D);
      var ua = pane.querySelector("[data-f='defi:appel']").value, ur = pane.querySelector("[data-f='defi:reg']").value;
      var okA = ua !== "" && Math.abs(num(ua) - r2(s.appel)) <= 0.011, okR = ur !== "" && Math.abs(num(ur) - r2(s.reg)) <= 0.011;
      var h = "";
      if (!showSol) {
        h += okA ? "<div class='cpx-ok'>✅ Appel par échéance correct : " + eur(s.appel) + ".</div>" : "<div class='cpx-ko'>❌ Appel par échéance : pas encore. Rappel : Σ (budget de la clé × tantièmes du lot ÷ total) ÷ nombre d'appels.</div>";
        h += okR ? "<div class='cpx-ok'>✅ Régularisation correcte : " + sgn(s.reg) + " €.</div>" : "<div class='cpx-ko'>❌ Régularisation : pas encore. Rappel : Σ ((réel − budget) × tantièmes du lot ÷ total), clé par clé.</div>";
        if (okA && okR) h += "<div class='cpx-ok'>🏆 Bravo ! Lancez un nouveau défi pour vous entraîner encore.</div>";
      }
      if (showSol || (okA && okR)) h += "<div class='cpx-note'><b>Corrigé</b><br>" + s.steps.join("<br>") + "<br>→ Appel par échéance = " + fmt(s.appel * D.na) + " ÷ " + D.na + " = <b>" + eur(s.appel) + "</b><br>→ Régularisation = <b>" + sgn(s.reg) + " €</b> (" + (r2(s.reg) > 0 ? "à payer" : r2(s.reg) < 0 ? "à rembourser" : "aucune") + ")</div>";
      o.innerHTML = h;
    }

    function onF(e) {
      var f = e.target && e.target.getAttribute ? e.target.getAttribute("data-f") : null; if (!f) return;
      var p = f.split(":"), v = e.target.value;
      if (p[0] === "defi") return;
      if (p[0] === "lot") { var l = S.lots[+p[1]]; if (!l) return; if (p[2] === "t") l.t[p[3]] = v; else l[p[2]] = v; }
      else if (p[0] === "ch") { var c = S.charges[+p[1]]; if (!c) return; c[p[2]] = v; }
      else if (p[0] === "g") S[p[1]] = v;
      else if (p[0] === "o") S.ouv[p[1]] = v;
      out();
    }
    el.addEventListener("input", onF);
    el.addEventListener("change", onF);
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" && tab === "defi" && e.target.getAttribute && e.target.getAttribute("data-f")) checkDefi(false); });
    el.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-act]") : null; if (!b || !el.contains(b)) return;
      var a = b.getAttribute("data-act").split(":");
      if (a[0] === "tab") tab = a[1];
      else if (a[0] === "reset") { S = clone(data); D = null; }
      else if (a[0] === "addlot") { var t = {}; S.cles.forEach(function (k) { t[k.id] = 0; }); S.lots.push({ nom: "NOUVEAU", desc: "", t: t, imp: 0 }); }
      else if (a[0] === "dellot") { S.lots.splice(+a[1], 1); D = null; }
      else if (a[0] === "addch") S.charges.push({ compte: "6", lib: "Nouvelle charge", cle: S.cles[0].id, budget: 0, reel: 0 });
      else if (a[0] === "delch") S.charges.splice(+a[1], 1);
      else if (a[0] === "dnew") D = newDefi(S);
      else if (a[0] === "dchk") { checkDefi(false); return; }
      else if (a[0] === "dsol") { checkDefi(true); return; }
      render();
    });
    render();
  }

  function renderAll(root) {
    var r = root || document; if (!r.querySelectorAll) return;
    r.querySelectorAll(".copro[data-copro]").forEach(function (el) { if (!el.__cpx) { el.__cpx = true; mount(el); } });
  }
  function boot() {
    renderAll(document);
    var content = document.getElementById("content");
    if (content && window.MutationObserver) new MutationObserver(function () { renderAll(content); }).observe(content, { childList: true, subtree: true });
  }
  if (document.readyState !== "loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
