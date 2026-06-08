/* Matrice de saisie interactive — style "logiciel comptable" (structure type Pennylane, RECOLORÉE
   aux couleurs de l'académie pour éviter toute ressemblance de marque).
   À gauche la pièce (facture), à droite l'écriture à saisir ; le système vérifie l'équilibre et corrige.
   Usage dans une leçon (.md) :  <div class="saisie" data-ex="ex1"></div>
   Exercices : variable globale EXOS (depuis site/exercices.json). Composant 100% original. */
(function () {
  if (window.__SAISIE_INIT__) return; window.__SAISIE_INIT__ = true;
  var EKEY = "fce_exo_v1";

  var CSS = [
    ".sx{border:1px solid #d4def0;border-radius:14px;background:#fff;margin:18px 0;overflow:hidden;box-shadow:0 3px 14px rgba(20,40,70,.10);font-size:14px}",
    ".sx-head{background:linear-gradient(135deg,#16307a,#2b56c6);color:#fff;padding:11px 16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}",
    ".sx-head .jr{background:#fff;color:#16307a;font-weight:800;padding:2px 9px;border-radius:6px;font-size:12px}",
    ".sx-head .ti{font-weight:700}",
    ".sx-head .soft{font-size:11.5px;opacity:.85;margin-left:2px}",
    ".sx-head .ok{margin-left:auto;background:#0a6b46;padding:2px 10px;border-radius:20px;font-size:12px;display:none}",
    ".sx-tuto{margin:0;background:#fff7e9;border-bottom:1px solid #f0d9ad}",
    ".sx-tuto>summary{cursor:pointer;list-style:none;padding:9px 16px;font-weight:800;color:#9a6a12}",
    ".sx-tuto>summary::-webkit-details-marker{display:none}",
    ".sx-tuto ol{margin:6px 16px 12px 34px;color:#5a4a25;line-height:1.55}",
    ".sx-en{padding:10px 16px;color:#27384a;background:#f5f8fd;border-bottom:1px solid #e6ecf7}",
    ".sx-2{display:grid;grid-template-columns:1fr 1fr;gap:0}",
    "@media(max-width:820px){.sx-2{grid-template-columns:1fr}}",
    ".sx-doc{padding:14px 16px;border-right:1px solid #eef2f8;background:#fbfdff}",
    "@media(max-width:820px){.sx-doc{border-right:none;border-bottom:1px solid #eef2f8}}",
    ".sx-doc .cap{font-size:11px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;color:#16307a;margin:0 0 8px}",
    ".sx-fac{border:1px solid #dde6f2;border-radius:10px;padding:14px;font-size:12.5px;color:#22303f;background:#fff}",
    ".sx-fac .sens{display:inline-block;background:#eef4fb;color:#16307a;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;margin-bottom:8px}",
    ".sx-fac .em{font-weight:800;font-size:14px;color:#16307a}",
    ".sx-fac .meta{color:#5a6b80;margin:5px 0}",
    ".sx-fac table{width:100%;border-collapse:collapse;margin:8px 0;font-size:12px}",
    ".sx-fac th{background:#16307a;color:#fff;text-align:left;padding:5px 7px}",
    ".sx-fac td{border-bottom:1px solid #eef2f8;padding:5px 7px}",
    ".sx-fac .tot{text-align:right;margin-top:6px}.sx-fac .tot b{display:inline-block;min-width:90px;text-align:right;font-variant-numeric:tabular-nums}",
    ".sx-fac .tot.ttc{font-weight:800;color:#16307a}",
    ".sx-mat{padding:0}",
    ".sx-mat .cap{font-size:11px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;color:#16307a;margin:12px 16px 4px}",
    ".sx-tbl{width:100%;border-collapse:collapse}",
    ".sx-tbl th{background:#eef3fb;color:#16307a;text-align:left;padding:6px 8px;font-size:12px}",
    ".sx-tbl td{border-bottom:1px solid #eef2f8;padding:4px 6px}",
    ".sx-tbl input{width:100%;border:1px solid #d6e0ee;border-radius:7px;padding:7px 8px;font-size:13.5px;font-family:inherit;background:#fffdf8}",
    ".sx-tbl input:focus{outline:none;border-color:#2b56c6;box-shadow:0 0 0 3px rgba(43,86,198,.15)}",
    ".sx-tbl input.d{color:#1554b8;text-align:right}",
    ".sx-tbl input.c{color:#9a5b00;text-align:right}",
    ".sx-tbl .col-c{width:108px}.sx-tbl .col-m{width:104px}.sx-tbl .col-x{width:32px;text-align:center}",
    ".sx-rm{border:none;background:#fbe7e7;color:#c0392b;border-radius:6px;width:26px;height:26px;cursor:pointer;font-weight:700}",
    ".sx-add{background:none;border:1px dashed #e0b266;color:#9a6a12;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12.5px;margin:6px 16px}",
    ".sx-tot{display:flex;gap:16px;align-items:center;flex-wrap:wrap;padding:8px 16px;background:#f7faf9;border-top:1px solid #e6ecf7;font-size:13px}",
    ".sx-tot b{font-variant-numeric:tabular-nums}",
    ".sx-bal{padding:2px 10px;border-radius:20px;font-weight:700;font-size:12px}",
    ".sx-bal.k{background:#e4f6ea;color:#0a7a4f}.sx-bal.x{background:#fdeceb;color:#c0392b}",
    ".sx-act{display:flex;gap:8px;flex-wrap:wrap;padding:10px 16px;border-top:1px solid #e6ecf7}",
    ".sx-btn{background:#16307a;color:#fff;border:none;padding:9px 16px;border-radius:9px;font-weight:700;cursor:pointer;font-size:13.5px}",
    ".sx-btn:hover{background:#0f2360}",
    ".sx-btn.amber{background:#E8A13A;color:#1c2733}.sx-btn.amber:hover{background:#d8912a}",
    ".sx-btn.g{background:#eef2f8;color:#16307a}.sx-btn.g:hover{background:#e0e8f3}",
    ".sx-fb{margin:0 16px 12px;padding:10px 12px;border-radius:9px;font-size:13.5px;display:none}",
    ".sx-fb.k{background:#e4f6ea;color:#0a6b46;border:1px solid #9fdcb6;display:block}",
    ".sx-fb.x{background:#fdeceb;color:#a5302a;border:1px solid #f0b9b6;display:block}",
    ".sx-cor{margin:0 16px 14px;display:none}",
    ".sx-cor table{width:100%;border-collapse:collapse;font-size:13px;border:1px solid #d4def0;border-radius:10px;overflow:hidden}",
    ".sx-cor caption{caption-side:top;text-align:left;background:#eef3fb;color:#16307a;font-weight:700;padding:7px 10px}",
    ".sx-cor th{background:#16307a;color:#fff;padding:6px 8px;text-align:left}",
    ".sx-cor td{border-bottom:1px solid #eef2f8;padding:6px 8px}",
    ".sx-cor td.d{color:#1554b8;text-align:right}.sx-cor td.c{color:#9a5b00;text-align:right}",
    ".sx-cor .as{margin-top:8px;color:#27384a;background:#fff7e9;border-left:4px solid #E8A13A;padding:8px 10px;border-radius:0 8px 8px 0;font-size:13px}"
  ].join("");
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  function num(v) { if (v == null) return 0; v = ("" + v).replace(/\s/g, "").replace(",", ".").replace(/[^0-9.\-]/g, ""); var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function fmt(n) { return (n || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function esc(t){ return ("" + (t == null ? "" : t)).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function exoDone(id) { try { return !!(JSON.parse(localStorage.getItem(EKEY) || "{}")[id]); } catch (e) { return false; } }
  function markDone(id) { try { var p = JSON.parse(localStorage.getItem(EKEY) || "{}"); p[id] = true; localStorage.setItem(EKEY, JSON.stringify(p)); } catch (e) { } }

  function facHtml(d) {
    var lignes = (d.lignes || []).map(function (l) {
      return "<tr><td>" + esc(l.designation) + "</td><td style='text-align:right'>" + (l.qte || 1) + "</td><td style='text-align:right'>" + fmt(l.puht) + " €</td></tr>";
    }).join("");
    return "<p class='cap'>📄 Pièce justificative</p><div class='sx-fac'>" +
      (d.sens ? "<span class='sens'>" + esc(d.sens) + "</span>" : "") +
      "<div class='em'>" + esc(d.emetteur) + "</div>" + (d.ville ? "<div class='meta'>" + esc(d.ville) + "</div>" : "") +
      "<div class='meta'>Facture n° <b>" + esc(d.num) + "</b>" + (d.date ? " · " + esc(d.date) : "") + (d.echeance ? " · Échéance " + esc(d.echeance) : "") + "</div>" +
      (lignes ? "<table><thead><tr><th>Désignation</th><th style='text-align:right'>Qté</th><th style='text-align:right'>PU HT</th></tr></thead><tbody>" + lignes + "</tbody></table>" : "") +
      "<div class='tot'>Total HT : <b>" + fmt(d.ht) + " €</b></div>" +
      "<div class='tot'>TVA (" + (d.taux || 0) + " %) : <b>" + fmt(d.tva) + " €</b></div>" +
      "<div class='tot ttc'>Total TTC : <b>" + fmt(d.ttc) + " €</b></div></div>";
  }

  function row(line) {
    line = line || {};
    var tr = document.createElement("tr");
    tr.innerHTML = '<td class="col-c"><input class="cpt" placeholder="Compte" value="' + esc(line.compte || "") + '"></td>' +
      '<td><input class="lib" placeholder="Libellé" value="' + esc(line.libelle || "") + '"></td>' +
      '<td class="col-m"><input class="d dbt" inputmode="decimal" placeholder="0,00"></td>' +
      '<td class="col-m"><input class="c cdt" inputmode="decimal" placeholder="0,00"></td>' +
      '<td class="col-x"><button class="sx-rm" title="Supprimer">×</button></td>';
    return tr;
  }

  function matrixHtml() {
    return "<p class='cap'>🧾 Écriture comptable (saisie)</p>" +
      "<table class='sx-tbl'><thead><tr><th>Compte</th><th>Libellé</th><th style='text-align:right'>Débit</th><th style='text-align:right'>Crédit</th><th></th></tr></thead><tbody></tbody></table>";
  }

  function render(el) {
    var id = el.getAttribute("data-ex");
    var exo = (window.EXOS || {})[id];
    if (!exo) { el.innerHTML = '<p style="color:#c0392b">Exercice introuvable : ' + esc(id) + '</p>'; return; }
    el.classList.add("sx"); el.innerHTML = "";

    var head = document.createElement("div"); head.className = "sx-head";
    head.innerHTML = '<span class="jr">' + esc(exo.journal || "OD") + '</span><span class="ti">' + esc(exo.titre) + '</span><span class="soft">· saisie comptable</span><span class="ok">✅ Réussi</span>';
    el.appendChild(head);

    if (exo.tuto && exo.tuto.length) {
      var tut = document.createElement("details"); tut.className = "sx-tuto"; tut.open = true;
      tut.innerHTML = "<summary>📘 Comment saisir cette pièce — tutoriel</summary><ol>" + exo.tuto.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>";
      el.appendChild(tut);
    }
    if (exo.enonce) { var en = document.createElement("div"); en.className = "sx-en"; en.innerHTML = "🎯 " + esc(exo.enonce); el.appendChild(en); }

    // panneau matrice (table + add + tot)
    var matWrap = document.createElement("div"); matWrap.className = "sx-mat"; matWrap.innerHTML = matrixHtml();
    var tbl = matWrap.querySelector(".sx-tbl"); var tb = tbl.querySelector("tbody");
    var nRows = Math.max((exo.lignes || []).length, 3);
    for (var i = 0; i < nRows; i++) tb.appendChild(row());
    var add = document.createElement("button"); add.className = "sx-add"; add.textContent = "➕ Ajouter une ligne"; matWrap.appendChild(add);
    var tot = document.createElement("div"); tot.className = "sx-tot";
    tot.innerHTML = 'Total débit : <b class="td">0,00</b> &nbsp;·&nbsp; Total crédit : <b class="tc">0,00</b> <span class="sx-bal x">déséquilibré</span>';
    matWrap.appendChild(tot);

    // disposition : deux panneaux si une pièce (doc) est fournie, sinon matrice pleine largeur
    if (exo.doc) {
      var two = document.createElement("div"); two.className = "sx-2";
      var docPane = document.createElement("div"); docPane.className = "sx-doc"; docPane.innerHTML = facHtml(exo.doc);
      two.appendChild(docPane); two.appendChild(matWrap);
      el.appendChild(two);
    } else {
      el.appendChild(matWrap);
    }

    var act = document.createElement("div"); act.className = "sx-act";
    act.innerHTML = '<button class="sx-btn amber verif">✓ Vérifier mon écriture</button><button class="sx-btn g corr">👁 Voir la correction</button><button class="sx-btn g raz">↺ Effacer</button>';
    var fb = document.createElement("div"); fb.className = "sx-fb";
    var cor = document.createElement("div"); cor.className = "sx-cor";
    el.appendChild(act); el.appendChild(fb); el.appendChild(cor);
    if (exoDone(id)) head.querySelector(".ok").style.display = "inline-block";

    function recompute() {
      var sd = 0, sc = 0;
      tb.querySelectorAll("tr").forEach(function (tr) { sd += num(tr.querySelector(".dbt").value); sc += num(tr.querySelector(".cdt").value); });
      tot.querySelector(".td").textContent = fmt(sd);
      tot.querySelector(".tc").textContent = fmt(sc);
      var bal = tot.querySelector(".sx-bal");
      var eq = Math.abs(sd - sc) < 0.01 && sd > 0;
      bal.className = "sx-bal " + (eq ? "k" : "x");
      bal.textContent = eq ? "équilibré ✓" : "déséquilibré";
      return { sd: sd, sc: sc, eq: eq };
    }
    function lines() {
      var out = [];
      tb.querySelectorAll("tr").forEach(function (tr) {
        var c = tr.querySelector(".cpt").value.replace(/\s/g, "").toUpperCase();
        var d = num(tr.querySelector(".dbt").value), cr = num(tr.querySelector(".cdt").value);
        if (c || d || cr) out.push({ compte: c, debit: d, credit: cr });
      });
      return out;
    }
    function verify() {
      var L = lines(); var r = recompute();
      if (!L.length) { fb.className = "sx-fb x"; fb.textContent = "Saisissez au moins une ligne."; return; }
      var exp = exo.lignes.slice(), used = [], matched = 0;
      exp.forEach(function (e) {
        for (var i = 0; i < L.length; i++) {
          if (used[i]) continue;
          var rac = (e.racine || e.compte).toUpperCase();
          if (L[i].compte.indexOf(rac) === 0 && Math.abs(L[i].debit - e.debit) < 0.01 && Math.abs(L[i].credit - e.credit) < 0.01) { used[i] = true; matched++; break; }
        }
      });
      var ok = r.eq && matched === exp.length && L.length === exp.length;
      if (ok) {
        fb.className = "sx-fb k"; fb.textContent = "✅ Écriture correcte — bravo ! Équilibrée et bien imputée.";
        markDone(id); head.querySelector(".ok").style.display = "inline-block";
      } else {
        var msg = [];
        if (!r.eq) msg.push("⚠️ Déséquilibre : total débit (" + fmt(r.sd) + ") ≠ total crédit (" + fmt(r.sc) + ").");
        else { msg.push("❌ Pas tout à fait : " + matched + " / " + exp.length + " ligne(s) correcte(s)."); if (L.length !== exp.length) msg.push("Vérifiez aussi le nombre de lignes."); }
        msg.push("Réessayez, ou cliquez « Voir la correction ».");
        fb.className = "sx-fb x"; fb.textContent = msg.join(" ");
      }
    }
    function showCorrection() {
      var rows = exo.lignes.map(function (e) {
        return "<tr><td>" + esc(e.compte) + "</td><td>" + esc(e.libelle || "") + "</td><td class='d'>" + (e.debit ? fmt(e.debit) : "") + "</td><td class='c'>" + (e.credit ? fmt(e.credit) : "") + "</td></tr>";
      }).join("");
      cor.innerHTML = "<table><caption>Correction — Journal " + esc(exo.journal || "OD") + "</caption><thead><tr><th>Compte</th><th>Libellé</th><th style='text-align:right'>Débit</th><th style='text-align:right'>Crédit</th></tr></thead><tbody>" + rows + "</tbody></table>" + (exo.astuce ? "<div class='as'>💡 " + esc(exo.astuce) + "</div>" : "");
      cor.style.display = "block";
    }
    tbl.addEventListener("input", recompute);
    tb.addEventListener("click", function (e) { if (e.target.classList.contains("sx-rm")) { if (tb.querySelectorAll("tr").length > 1) e.target.closest("tr").remove(); recompute(); } });
    add.addEventListener("click", function () { tb.appendChild(row()); });
    act.querySelector(".verif").addEventListener("click", verify);
    act.querySelector(".corr").addEventListener("click", showCorrection);
    act.querySelector(".raz").addEventListener("click", function () { tb.querySelectorAll("input").forEach(function (i) { i.value = ""; }); fb.style.display = "none"; cor.style.display = "none"; recompute(); });
    recompute();
  }

  function renderAll(root) {
    var r = root || document; if (!r.querySelectorAll) return;
    r.querySelectorAll(".saisie[data-ex]").forEach(function (el) { if (!el.__sx) { el.__sx = true; render(el); } });
  }
  function boot() {
    renderAll(document);
    var content = document.getElementById("content");
    if (content && window.MutationObserver) new MutationObserver(function () { renderAll(content); }).observe(content, { childList: true, subtree: true });
  }
  if (document.readyState !== "loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
