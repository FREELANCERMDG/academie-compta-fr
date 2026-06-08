/* Matrice de saisie interactive — style "logiciel comptable" (structure type Pennylane, RECOLORÉE
   aux couleurs de l'académie). Pièce à gauche, écriture à droite ; vérif équilibre + imputation.
   Modes :
     <div class="saisie" data-ex="ex1"></div>            -> un exercice (EXOS)
     <div class="saisie" data-serie="fournisseur"></div>  -> SÉRIE de factures (FACTURES), auto-passage au suivant
   Lookup plan comptable : un clic sur 📖 (ou sur un compte) ouvre le PCG (window.PCG). Composant 100% original. */
(function () {
  if (window.__SAISIE_INIT__) return; window.__SAISIE_INIT__ = true;
  var EKEY = "fce_exo_v1", SKEY = "fce_serie_v1";

  var CSS = [
    ".sx{border:1px solid #d4def0;border-radius:14px;background:#fff;margin:18px 0;overflow:hidden;box-shadow:0 3px 14px rgba(20,40,70,.10);font-size:14px}",
    ".sx-head{background:linear-gradient(135deg,#16307a,#2b56c6);color:#fff;padding:11px 16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}",
    ".sx-head .jr{background:#fff;color:#16307a;font-weight:800;padding:2px 9px;border-radius:6px;font-size:12px}",
    ".sx-head .ti{font-weight:700}.sx-head .soft{font-size:11.5px;opacity:.85}",
    ".sx-head .act-badge{background:rgba(255,255,255,.18);padding:2px 9px;border-radius:20px;font-size:11.5px;font-weight:700}",
    ".sx-head .pos{margin-left:auto;background:rgba(255,255,255,.18);padding:3px 11px;border-radius:20px;font-size:12px;font-weight:700}",
    ".sx-head .ok{background:#0a6b46;padding:2px 10px;border-radius:20px;font-size:12px;display:none}",
    ".sx-bar{height:6px;background:#e6ecf7}.sx-bar i{display:block;height:100%;background:#E8A13A;width:0;transition:width .3s}",
    ".sx-pcg{display:flex;justify-content:flex-end;padding:6px 16px 0}",
    ".sx-pcgbtn{background:#eef3fb;border:1px solid #cdd8e8;color:#16307a;border-radius:8px;padding:5px 11px;font-size:12px;font-weight:700;cursor:pointer}",
    ".sx-pcgbtn:hover{background:#e0e8f3}",
    ".sx-tuto{margin:0;background:#fff7e9;border-bottom:1px solid #f0d9ad}",
    ".sx-tuto>summary{cursor:pointer;list-style:none;padding:9px 16px;font-weight:800;color:#9a6a12}",
    ".sx-tuto>summary::-webkit-details-marker{display:none}",
    ".sx-tuto ol{margin:6px 16px 12px 34px;color:#5a4a25;line-height:1.55}",
    ".sx-en{padding:10px 16px;color:#27384a;background:#f5f8fd;border-bottom:1px solid #e6ecf7}",
    ".sx-en .cas{display:inline-block;background:#eef3fb;color:#16307a;border:1px solid #d4def0;border-radius:6px;padding:1px 7px;font-size:11px;font-weight:700;margin-left:6px}",
    ".sx-2{display:grid;grid-template-columns:1fr 1fr;gap:0}",
    "@media(max-width:820px){.sx-2{grid-template-columns:1fr}}",
    ".sx-doc{padding:14px 16px;border-right:1px solid #eef2f8;background:#fbfdff}",
    "@media(max-width:820px){.sx-doc{border-right:none;border-bottom:1px solid #eef2f8}}",
    ".sx-doc .cap{font-size:11px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;color:#16307a;margin:0 0 8px}",
    ".sx-fac{border:1px solid #dde6f2;border-radius:10px;padding:14px;font-size:12.5px;color:#22303f;background:#fff}",
    ".sx-fac .sens{display:inline-block;background:#eef4fb;color:#16307a;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;margin-bottom:8px}",
    ".sx-fac .em{font-weight:800;font-size:14px;color:#16307a}.sx-fac .meta{color:#5a6b80;margin:5px 0}",
    ".sx-fac table{width:100%;border-collapse:collapse;margin:8px 0;font-size:12px}",
    ".sx-fac th{background:#16307a;color:#fff;text-align:left;padding:5px 7px}.sx-fac td{border-bottom:1px solid #eef2f8;padding:5px 7px}",
    ".sx-fac .tot{text-align:right;margin-top:6px}.sx-fac .tot b{display:inline-block;min-width:90px;text-align:right;font-variant-numeric:tabular-nums}",
    ".sx-fac .tot.ttc{font-weight:800;color:#16307a}",
    ".sx-mat .cap{font-size:11px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;color:#16307a;margin:12px 16px 4px}",
    ".sx-tbl{width:100%;border-collapse:collapse}",
    ".sx-tbl th{background:#eef3fb;color:#16307a;text-align:left;padding:6px 8px;font-size:12px}",
    ".sx-tbl td{border-bottom:1px solid #eef2f8;padding:4px 6px;vertical-align:top}",
    ".sx-tbl input{width:100%;border:1px solid #d6e0ee;border-radius:7px;padding:7px 8px;font-size:13.5px;font-family:inherit;background:#fffdf8}",
    ".sx-tbl input:focus{outline:none;border-color:#2b56c6;box-shadow:0 0 0 3px rgba(43,86,198,.15)}",
    ".sx-tbl input.d{color:#1554b8;text-align:right}.sx-tbl input.c{color:#9a5b00;text-align:right}",
    ".sx-tbl .col-c{width:120px}.sx-tbl .col-m{width:104px}.sx-tbl .col-x{width:32px;text-align:center}",
    ".sx-cpt{position:relative}.sx-cptn{font-size:10.5px;color:#5a6b80;margin-top:2px;line-height:1.2;cursor:pointer}.sx-cptn:hover{color:#16307a;text-decoration:underline}",
    ".sx-rm{border:none;background:#fbe7e7;color:#c0392b;border-radius:6px;width:26px;height:26px;cursor:pointer;font-weight:700}",
    ".sx-add{background:none;border:1px dashed #e0b266;color:#9a6a12;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12.5px;margin:6px 16px}",
    ".sx-tot{display:flex;gap:16px;align-items:center;flex-wrap:wrap;padding:8px 16px;background:#f7faf9;border-top:1px solid #e6ecf7;font-size:13px}",
    ".sx-tot b{font-variant-numeric:tabular-nums}",
    ".sx-bal{padding:2px 10px;border-radius:20px;font-weight:700;font-size:12px}",
    ".sx-bal.k{background:#e4f6ea;color:#0a7a4f}.sx-bal.x{background:#fdeceb;color:#c0392b}",
    ".sx-act{display:flex;gap:8px;flex-wrap:wrap;padding:10px 16px;border-top:1px solid #e6ecf7;align-items:center}",
    ".sx-btn{background:#16307a;color:#fff;border:none;padding:9px 16px;border-radius:9px;font-weight:700;cursor:pointer;font-size:13.5px}",
    ".sx-btn:hover{background:#0f2360}",
    ".sx-btn.amber{background:#E8A13A;color:#1c2733}.sx-btn.amber:hover{background:#d8912a}",
    ".sx-btn.g{background:#eef2f8;color:#16307a}.sx-btn.g:hover{background:#e0e8f3}",
    ".sx-nav{margin-left:auto;display:flex;gap:6px}",
    ".sx-fb{margin:0 16px 12px;padding:10px 12px;border-radius:9px;font-size:13.5px;display:none}",
    ".sx-fb.k{background:#e4f6ea;color:#0a6b46;border:1px solid #9fdcb6;display:block}",
    ".sx-fb.x{background:#fdeceb;color:#a5302a;border:1px solid #f0b9b6;display:block}",
    ".sx-cor{margin:0 16px 14px;display:none}",
    ".sx-cor table{width:100%;border-collapse:collapse;font-size:13px;border:1px solid #d4def0;border-radius:10px;overflow:hidden}",
    ".sx-cor caption{caption-side:top;text-align:left;background:#eef3fb;color:#16307a;font-weight:700;padding:7px 10px}",
    ".sx-cor th{background:#16307a;color:#fff;padding:6px 8px;text-align:left}",
    ".sx-cor td{border-bottom:1px solid #eef2f8;padding:6px 8px}",
    ".sx-cor td.d{color:#1554b8;text-align:right}.sx-cor td.c{color:#9a5b00;text-align:right}",
    ".sx-cor .as{margin-top:8px;color:#27384a;background:#fff7e9;border-left:4px solid #E8A13A;padding:8px 10px;border-radius:0 8px 8px 0;font-size:13px}",
    ".sx-done{padding:30px 16px;text-align:center}.sx-done .big{font-size:42px}.sx-done h3{margin:6px 0;color:#16307a}",
    ".sx-done .badge{display:inline-block;background:#e4f6ea;color:#0a6b46;font-weight:700;padding:6px 14px;border-radius:20px;margin-top:8px}",
    /* PCG modal */
    ".pcg-ov{position:fixed;inset:0;background:rgba(15,34,51,.55);z-index:100000;display:flex;align-items:center;justify-content:center;padding:18px}",
    ".pcg-bx{background:#fff;border-radius:14px;max-width:560px;width:100%;max-height:80vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.4)}",
    ".pcg-h{background:#16307a;color:#fff;padding:12px 16px;display:flex;align-items:center;gap:10px}",
    ".pcg-h b{font-size:15px}.pcg-h .x{margin-left:auto;cursor:pointer;font-size:20px;line-height:1;background:none;border:none;color:#fff}",
    ".pcg-s{padding:10px 16px;border-bottom:1px solid #eef2f8}",
    ".pcg-s input{width:100%;border:1px solid #d6e0ee;border-radius:9px;padding:9px 11px;font-size:14px;font-family:inherit}",
    ".pcg-l{overflow:auto;padding:4px 0}",
    ".pcg-r{display:flex;gap:10px;padding:8px 16px;border-bottom:1px solid #f2f5fa;cursor:pointer;align-items:baseline}",
    ".pcg-r:hover{background:#f5f8fd}",
    ".pcg-r .num{font-weight:800;color:#16307a;min-width:64px;font-variant-numeric:tabular-nums}",
    ".pcg-r .nom{color:#27384a;font-size:13px}.pcg-r .cl{margin-left:auto;color:#9aa7b6;font-size:11px}",
    ".pcg-cl{padding:7px 16px;background:#eef3fb;color:#16307a;font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:.3px;position:sticky;top:0}",
    ".pcg-f{padding:9px 16px;color:#5a6b80;font-size:11.5px;border-top:1px solid #eef2f8}"
  ].join("");
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  function num(v) { if (v == null) return 0; v = ("" + v).replace(/\s/g, "").replace(",", ".").replace(/[^0-9.\-]/g, ""); var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function fmt(n) { return (n || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function esc(t) { return ("" + (t == null ? "" : t)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch (e) { return {}; } }
  function lsSet(k, o) { try { localStorage.setItem(k, JSON.stringify(o)); } catch (e) { } }

  /* ---------- Plan comptable (window.PCG) ---------- */
  var CLASSES = { "1": "Classe 1 — Capitaux", "2": "Classe 2 — Immobilisations", "3": "Classe 3 — Stocks", "4": "Classe 4 — Tiers", "5": "Classe 5 — Financiers", "6": "Classe 6 — Charges", "7": "Classe 7 — Produits", "8": "Classe 8 — Spéciaux" };
  function pcgAll() { return (window.PCG && window.PCG.length) ? window.PCG : []; }
  function pcgName(numStr) {
    var c = ("" + numStr).replace(/\s/g, ""); if (!c) return "";
    var list = pcgAll(), best = null;
    for (var i = 0; i < list.length; i++) { var n = ("" + list[i].num); if (c.indexOf(n) === 0 || n.indexOf(c) === 0) { if (!best || n.length > best.num.length) best = list[i]; } }
    return best ? best.nom : "";
  }
  var pcgOv = null;
  function openPcg(onPick) {
    var list = pcgAll();
    if (!list.length) { return; }
    if (pcgOv) pcgOv.remove();
    var ov = document.createElement("div"); ov.className = "pcg-ov"; pcgOv = ov;
    ov.innerHTML = "<div class='pcg-bx'><div class='pcg-h'><b>📖 Plan comptable général</b><button class='x' title='Fermer'>×</button></div>"
      + "<div class='pcg-s'><input type='text' placeholder='Rechercher un compte (n° ou intitulé)…' autofocus></div>"
      + "<div class='pcg-l'></div><div class='pcg-f'>Cliquez un compte pour l'insérer dans la ligne en cours. " + list.length + " comptes.</div></div>";
    document.body.appendChild(ov);
    var inp = ov.querySelector(".pcg-s input"), lst = ov.querySelector(".pcg-l");
    function drawText(q) {
      q = (q || "").toLowerCase();
      var rows = list.filter(function (a) { return !q || ("" + a.num).indexOf(q.replace(/\D/g, "")) === 0 && /\d/.test(q) || (a.nom || "").toLowerCase().indexOf(q) >= 0 || ("" + a.num).indexOf(q) === 0; });
      rows.sort(function (a, b) { return ("" + a.num).localeCompare("" + b.num); });
      var h = "", cur = "";
      rows.forEach(function (a) { var cl = ("" + a.num).charAt(0); if (cl !== cur) { cur = cl; h += "<div class='pcg-cl'>" + esc(CLASSES[cl] || ("Classe " + cl)) + "</div>"; } h += "<div class='pcg-r' data-num='" + esc(a.num) + "'><span class='num'>" + esc(a.num) + "</span><span class='nom'>" + esc(a.nom) + "</span></div>"; });
      lst.innerHTML = h || "<div class='pcg-r'><span class='nom'>Aucun compte trouvé.</span></div>";
    }
    drawText("");
    inp.addEventListener("input", function () { drawText(inp.value); });
    lst.addEventListener("click", function (e) { var r = e.target.closest(".pcg-r"); if (r && r.getAttribute("data-num")) { if (onPick) onPick(r.getAttribute("data-num")); ov.remove(); pcgOv = null; } });
    ov.addEventListener("click", function (e) { if (e.target === ov || e.target.classList.contains("x")) { ov.remove(); pcgOv = null; } });
    setTimeout(function () { try { inp.focus(); } catch (e) { } }, 30);
  }

  /* ---------- Pièce (facture) ---------- */
  function facHtml(d) {
    if (!d) return "";
    var lignes = (d.lignes || []).map(function (l) { return "<tr><td>" + esc(l.designation) + "</td><td style='text-align:right'>" + (l.qte || 1) + "</td><td style='text-align:right'>" + fmt(l.puht) + " €</td></tr>"; }).join("");
    return "<p class='cap'>📄 Pièce justificative</p><div class='sx-fac'>" +
      (d.sens ? "<span class='sens'>" + esc(d.sens) + "</span>" : "") +
      "<div class='em'>" + esc(d.emetteur) + "</div>" + (d.ville ? "<div class='meta'>" + esc(d.ville) + "</div>" : "") +
      "<div class='meta'>Facture n° <b>" + esc(d.num) + "</b>" + (d.date ? " · " + esc(d.date) : "") + (d.echeance ? " · Éch. " + esc(d.echeance) : "") + "</div>" +
      (lignes ? "<table><thead><tr><th>Désignation</th><th style='text-align:right'>Qté</th><th style='text-align:right'>PU HT</th></tr></thead><tbody>" + lignes + "</tbody></table>" : "") +
      "<div class='tot'>Total HT : <b>" + fmt(d.ht) + " €</b></div>" +
      "<div class='tot'>TVA (" + (d.taux || 0) + " %) : <b>" + fmt(d.tva) + " €</b></div>" +
      "<div class='tot ttc'>Total TTC : <b>" + fmt(d.ttc) + " €</b></div></div>";
  }

  function row(line) {
    line = line || {};
    var tr = document.createElement("tr");
    tr.innerHTML = '<td class="col-c"><div class="sx-cpt"><input class="cpt" placeholder="Compte" value="' + esc(line.compte || "") + '"><div class="sx-cptn"></div></div></td>' +
      '<td><input class="lib" placeholder="Libellé" value="' + esc(line.libelle || "") + '"></td>' +
      '<td class="col-m"><input class="d dbt" inputmode="decimal" placeholder="0,00"></td>' +
      '<td class="col-m"><input class="c cdt" inputmode="decimal" placeholder="0,00"></td>' +
      '<td class="col-x"><button class="sx-rm" title="Supprimer">×</button></td>';
    return tr;
  }

  /* ---------- Rendu d'un item (exercice ou facture de série) ---------- */
  function renderItem(host, exo, opts) {
    opts = opts || {};
    host.innerHTML = "";
    if (window.PCG && window.PCG.length) {
      var pc = document.createElement("div"); pc.className = "sx-pcg";
      pc.innerHTML = "<button class='sx-pcgbtn' type='button'>📖 Plan comptable</button>";
      host.appendChild(pc);
      pc.querySelector(".sx-pcgbtn").addEventListener("click", function () { openPcg(insertCompte); });
    }
    if (exo.tuto && exo.tuto.length) {
      var tut = document.createElement("details"); tut.className = "sx-tuto"; tut.open = !!opts.tutoOpen;
      tut.innerHTML = "<summary>📘 Comment saisir cette pièce — tutoriel</summary><ol>" + exo.tuto.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>";
      host.appendChild(tut);
    }
    if (exo.enonce) { var en = document.createElement("div"); en.className = "sx-en"; en.innerHTML = "🎯 " + esc(exo.enonce) + (exo.cas ? "<span class='cas'>" + esc(exo.cas) + "</span>" : ""); host.appendChild(en); }

    var matWrap = document.createElement("div"); matWrap.className = "sx-mat";
    matWrap.innerHTML = "<p class='cap'>🧾 Écriture comptable — saisissez puis « Vérifier »</p><table class='sx-tbl'><thead><tr><th>Compte</th><th>Libellé</th><th style='text-align:right'>Débit</th><th style='text-align:right'>Crédit</th><th></th></tr></thead><tbody></tbody></table>";
    var tbl = matWrap.querySelector(".sx-tbl"), tb = tbl.querySelector("tbody");
    var nRows = Math.max((exo.lignes || []).length, 3);
    for (var i = 0; i < nRows; i++) tb.appendChild(row());
    var add = document.createElement("button"); add.className = "sx-add"; add.textContent = "➕ Ajouter une ligne"; matWrap.appendChild(add);
    var tot = document.createElement("div"); tot.className = "sx-tot";
    tot.innerHTML = 'Total débit : <b class="td">0,00</b> &nbsp;·&nbsp; Total crédit : <b class="tc">0,00</b> <span class="sx-bal x">déséquilibré</span>';
    matWrap.appendChild(tot);

    if (exo.doc) {
      var two = document.createElement("div"); two.className = "sx-2";
      var docPane = document.createElement("div"); docPane.className = "sx-doc"; docPane.innerHTML = facHtml(exo.doc);
      two.appendChild(docPane); two.appendChild(matWrap); host.appendChild(two);
    } else { host.appendChild(matWrap); }

    var act = document.createElement("div"); act.className = "sx-act";
    act.innerHTML = '<button class="sx-btn amber verif">✓ Vérifier l\'écriture</button><button class="sx-btn g corr">👁 Corrigé</button><button class="sx-btn g raz">↺ Effacer</button>' + (opts.nav ? '<span class="sx-nav"><button class="sx-btn g prev">← Précédent</button><button class="sx-btn next">Suivant →</button></span>' : '');
    var fb = document.createElement("div"); fb.className = "sx-fb";
    var cor = document.createElement("div"); cor.className = "sx-cor";
    host.appendChild(act); host.appendChild(fb); host.appendChild(cor);

    var lastCompte = null;
    function insertCompte(n) { var t = lastCompte || tb.querySelector(".cpt"); if (t) { t.value = n; t.dispatchEvent(new Event("input", { bubbles: true })); t.focus(); } }
    tb.addEventListener("focusin", function (e) { if (e.target.classList.contains("cpt")) lastCompte = e.target; });

    function refreshNames() {
      tb.querySelectorAll("tr").forEach(function (tr) { var c = tr.querySelector(".cpt"), nm = tr.querySelector(".sx-cptn"); if (!c || !nm) return; var name = pcgName(c.value); nm.textContent = name ? "↳ " + name : ""; nm.setAttribute("data-num", c.value || ""); });
    }
    tb.addEventListener("click", function (e) { if (e.target.classList.contains("sx-cptn")) { openPcg(insertCompte); } });

    function recompute() {
      var sd = 0, sc = 0;
      tb.querySelectorAll("tr").forEach(function (tr) { sd += num(tr.querySelector(".dbt").value); sc += num(tr.querySelector(".cdt").value); });
      tot.querySelector(".td").textContent = fmt(sd); tot.querySelector(".tc").textContent = fmt(sc);
      var bal = tot.querySelector(".sx-bal"), eq = Math.abs(sd - sc) < 0.01 && sd > 0;
      bal.className = "sx-bal " + (eq ? "k" : "x"); bal.textContent = eq ? "équilibré ✓" : "déséquilibré";
      return { sd: sd, sc: sc, eq: eq };
    }
    function lines() {
      var out = [];
      tb.querySelectorAll("tr").forEach(function (tr) { var c = tr.querySelector(".cpt").value.replace(/\s/g, "").toUpperCase(); var d = num(tr.querySelector(".dbt").value), cr = num(tr.querySelector(".cdt").value); if (c || d || cr) out.push({ compte: c, debit: d, credit: cr }); });
      return out;
    }
    function verify() {
      var L = lines(), r = recompute();
      if (!L.length) { fb.className = "sx-fb x"; fb.textContent = "Saisissez au moins une ligne."; return false; }
      var exp = exo.lignes.slice(), used = [], matched = 0;
      exp.forEach(function (e) { for (var i = 0; i < L.length; i++) { if (used[i]) continue; var rac = (e.racine || e.compte).toUpperCase(); if (L[i].compte.indexOf(rac) === 0 && Math.abs(L[i].debit - e.debit) < 0.01 && Math.abs(L[i].credit - e.credit) < 0.01) { used[i] = true; matched++; break; } } });
      var ok = r.eq && matched === exp.length && L.length === exp.length;
      if (ok) { fb.className = "sx-fb k"; fb.textContent = "✅ Écriture correcte — équilibrée et bien imputée !"; if (opts.onSolved) { fb.textContent += " Passage à la suivante…"; setTimeout(opts.onSolved, 1000); } }
      else { var msg = []; if (!r.eq) msg.push("⚠️ Déséquilibre : débit (" + fmt(r.sd) + ") ≠ crédit (" + fmt(r.sc) + ")."); else { msg.push("❌ Pas tout à fait : " + matched + " / " + exp.length + " ligne(s) correcte(s)."); if (L.length !== exp.length) msg.push("Vérifiez le nombre de lignes."); } msg.push("Réessayez ou « Corrigé »."); fb.className = "sx-fb x"; fb.textContent = msg.join(" "); }
      return ok;
    }
    function showCorrection() {
      var rows = exo.lignes.map(function (e) { return "<tr><td>" + esc(e.compte) + "</td><td>" + esc(e.libelle || "") + "</td><td class='d'>" + (e.debit ? fmt(e.debit) : "") + "</td><td class='c'>" + (e.credit ? fmt(e.credit) : "") + "</td></tr>"; }).join("");
      cor.innerHTML = "<table><caption>Correction — Journal " + esc(exo.journal || "OD") + "</caption><thead><tr><th>Compte</th><th>Libellé</th><th style='text-align:right'>Débit</th><th style='text-align:right'>Crédit</th></tr></thead><tbody>" + rows + "</tbody></table>" + (exo.astuce ? "<div class='as'>💡 " + esc(exo.astuce) + "</div>" : "");
      cor.style.display = "block";
    }
    tbl.addEventListener("input", function () { recompute(); refreshNames(); });
    tb.addEventListener("click", function (e) { if (e.target.classList.contains("sx-rm")) { if (tb.querySelectorAll("tr").length > 1) e.target.closest("tr").remove(); recompute(); } });
    add.addEventListener("click", function () { tb.appendChild(row()); });
    act.querySelector(".verif").addEventListener("click", function () { var ok = verify(); if (ok && opts.onVerified) opts.onVerified(); });
    act.querySelector(".corr").addEventListener("click", showCorrection);
    act.querySelector(".raz").addEventListener("click", function () { tb.querySelectorAll("input").forEach(function (i) { i.value = ""; }); refreshNames(); fb.style.display = "none"; cor.style.display = "none"; recompute(); });
    if (opts.nav) { act.querySelector(".next").addEventListener("click", opts.next); act.querySelector(".prev").addEventListener("click", opts.prev); }
    recompute(); refreshNames();
  }

  /* ---------- Mode exercice unique (EXOS) ---------- */
  function renderExo(el) {
    var id = el.getAttribute("data-ex"), exo = (window.EXOS || {})[id];
    if (!exo) { el.innerHTML = '<p style="color:#c0392b">Exercice introuvable : ' + esc(id) + '</p>'; return; }
    el.classList.add("sx"); el.innerHTML = "";
    var head = document.createElement("div"); head.className = "sx-head";
    head.innerHTML = '<span class="jr">' + esc(exo.journal || "OD") + '</span><span class="ti">' + esc(exo.titre || "") + '</span><span class="soft">· saisie comptable</span>';
    el.appendChild(head);
    var host = document.createElement("div"); el.appendChild(host);
    renderItem(host, exo, { tutoOpen: true });
  }

  /* ---------- Mode série (FACTURES) : auto-passage au suivant ---------- */
  function renderSerie(el) {
    var serie = el.getAttribute("data-serie");
    var all = (window.FACTURES || []).filter(function (f) { return !serie || serie === "all" || f.sens === serie; });
    if (!all.length) { el.innerHTML = '<p style="color:#c0392b">Série introuvable : ' + esc(serie) + ' (base de factures non chargée)</p>'; return; }
    el.classList.add("sx"); el.innerHTML = "";
    var prog = lsGet(SKEY); var idx = Math.min(prog[serie] || 0, all.length - 1); if (typeof prog[serie] !== "number") idx = 0;
    var head = document.createElement("div"); head.className = "sx-head";
    var bar = document.createElement("div"); bar.className = "sx-bar"; bar.innerHTML = "<i></i>";
    var host = document.createElement("div");
    el.appendChild(head); el.appendChild(bar); el.appendChild(host);

    function save() { var p = lsGet(SKEY); p[serie] = idx; lsSet(SKEY, p); }
    function setBar() { bar.querySelector("i").style.width = Math.round((idx) / all.length * 100) + "%"; }
    function done() {
      head.innerHTML = '<span class="ti">📁 Série terminée</span><span class="pos">' + all.length + ' / ' + all.length + '</span>';
      bar.querySelector("i").style.width = "100%";
      host.innerHTML = "<div class='sx-done'><div class='big'>🎉</div><h3>Série terminée — bravo !</h3><p>Vous avez saisi <b>" + all.length + " factures</b> avec leurs cas particuliers, comme en cabinet.</p><div class='badge'>✅ Mise en situation réussie</div><p style='margin-top:14px'><button class='sx-btn g restart'>↻ Recommencer</button></p></div>";
      host.querySelector(".restart").addEventListener("click", function () { idx = 0; save(); show(); });
    }
    function show() {
      if (idx >= all.length) { done(); return; }
      var f = all[idx];
      head.innerHTML = '<span class="jr">' + esc(f.journal || "OD") + '</span><span class="act-badge">🏢 ' + esc(f.activite || "") + '</span><span class="soft">' + esc(f.cas || "") + '</span><span class="pos">Facture ' + (idx + 1) + ' / ' + all.length + '</span>';
      setBar();
      renderItem(host, f, {
        nav: true,
        next: function () { if (idx < all.length - 1) { idx++; save(); show(); } else { idx = all.length; done(); } },
        prev: function () { if (idx > 0) { idx--; save(); show(); } },
        onSolved: function () { idx++; save(); show(); }
      });
    }
    show();
  }

  function render(el) {
    if (el.__sx) return; el.__sx = true;
    if (el.getAttribute("data-serie")) return renderSerie(el);
    return renderExo(el);
  }
  function renderAll(root) {
    var r = root || document; if (!r.querySelectorAll) return;
    r.querySelectorAll(".saisie[data-ex],.saisie[data-serie]").forEach(function (el) { render(el); });
  }
  function boot() {
    renderAll(document);
    var content = document.getElementById("content");
    if (content && window.MutationObserver) new MutationObserver(function () { renderAll(content); }).observe(content, { childList: true, subtree: true });
  }
  if (document.readyState !== "loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
