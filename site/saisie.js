/* Matrice de saisie interactive — l'apprenant saisit l'écriture, le système vérifie l'équilibre et corrige.
   Usage dans une leçon (.md), sur sa propre ligne :  <div class="saisie" data-ex="ex1"></div>
   Les exercices sont fournis par la variable globale EXOS (depuis site/exercices.json). */
(function () {
  if (window.__SAISIE_INIT__) return; window.__SAISIE_INIT__ = true;
  var EKEY = "fce_exo_v1";

  var CSS = [
    ".sx{border:1px solid #cfe8dc;border-radius:12px;background:#fff;margin:18px 0;overflow:hidden;box-shadow:0 2px 10px rgba(20,40,70,.08);font-size:14px}",
    ".sx-head{background:#0a8f5b;color:#fff;padding:10px 14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}",
    ".sx-head .jr{background:#fff;color:#0a7a4f;font-weight:800;padding:2px 8px;border-radius:6px;font-size:12px}",
    ".sx-head .ti{font-weight:700}",
    ".sx-head .ok{margin-left:auto;background:#0a6b46;padding:2px 9px;border-radius:20px;font-size:12px;display:none}",
    ".sx-en{padding:10px 14px;color:#1c3326;background:#f1f8f4;border-bottom:1px solid #e3efe8}",
    ".sx-tbl{width:100%;border-collapse:collapse}",
    ".sx-tbl th{background:#eef4f1;color:#0a3d2c;text-align:left;padding:6px 8px;font-size:12px}",
    ".sx-tbl td{border-bottom:1px solid #eef3f1;padding:4px 6px}",
    ".sx-tbl input{width:100%;border:1px solid #d6e2db;border-radius:7px;padding:7px 8px;font-size:13.5px;font-family:inherit;background:#fcfffe}",
    ".sx-tbl input:focus{outline:none;border-color:#0a8f5b;box-shadow:0 0 0 3px rgba(10,143,91,.15)}",
    ".sx-tbl input.d{color:#1554b8;text-align:right}",
    ".sx-tbl input.c{color:#0a7a4f;text-align:right}",
    ".sx-tbl .col-c{width:120px}.sx-tbl .col-m{width:120px}.sx-tbl .col-x{width:34px;text-align:center}",
    ".sx-rm{border:none;background:#fbe7e7;color:#c0392b;border-radius:6px;width:26px;height:26px;cursor:pointer;font-weight:700}",
    ".sx-tot{display:flex;gap:16px;align-items:center;flex-wrap:wrap;padding:8px 14px;background:#f7faf9;border-top:1px solid #e3efe8;font-size:13px}",
    ".sx-tot b{font-variant-numeric:tabular-nums}",
    ".sx-bal{padding:2px 10px;border-radius:20px;font-weight:700;font-size:12px}",
    ".sx-bal.k{background:#e4f6ea;color:#0a7a4f}.sx-bal.x{background:#fbe7e7;color:#c0392b}",
    ".sx-act{display:flex;gap:8px;flex-wrap:wrap;padding:10px 14px;border-top:1px solid #e3efe8}",
    ".sx-btn{background:#0a8f5b;color:#fff;border:none;padding:9px 16px;border-radius:9px;font-weight:700;cursor:pointer;font-size:13.5px}",
    ".sx-btn:hover{background:#0a7a4f}",
    ".sx-btn.g{background:#eef4f1;color:#0a3d2c}.sx-btn.g:hover{background:#e0ebe5}",
    ".sx-add{background:none;border:1px dashed #9fc7b4;color:#0a7a4f;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12.5px;margin:6px 14px}",
    ".sx-fb{margin:0 14px 12px;padding:10px 12px;border-radius:9px;font-size:13.5px;display:none}",
    ".sx-fb.k{background:#e4f6ea;color:#0a6b46;border:1px solid #9fdcb6;display:block}",
    ".sx-fb.x{background:#fbe7e7;color:#a5302a;border:1px solid #f0b9b6;display:block}",
    ".sx-cor{margin:0 14px 14px;display:none}",
    ".sx-cor table{width:100%;border-collapse:collapse;font-size:13px;border:1px solid #cfe8dc;border-radius:10px;overflow:hidden}",
    ".sx-cor caption{caption-side:top;text-align:left;background:#e8f7ef;color:#0a7a4f;font-weight:700;padding:7px 10px}",
    ".sx-cor th{background:#0a8f5b;color:#fff;padding:6px 8px;text-align:left}",
    ".sx-cor td{border-bottom:1px solid #eef3f1;padding:6px 8px}",
    ".sx-cor td.d{color:#1554b8;text-align:right}.sx-cor td.c{color:#0a7a4f;text-align:right}",
    ".sx-cor .as{margin-top:8px;color:#1c3326;background:#f1f8f4;border-left:4px solid #0a8f5b;padding:8px 10px;border-radius:0 8px 8px 0;font-size:13px}"
  ].join("");
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  function num(v) { if (v == null) return 0; v = ("" + v).replace(/\s/g, "").replace(",", ".").replace(/[^0-9.\-]/g, ""); var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function fmt(n) { return (n || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function exoDone(id) { try { return !!(JSON.parse(localStorage.getItem(EKEY) || "{}")[id]); } catch (e) { return false; } }
  function markDone(id) { try { var p = JSON.parse(localStorage.getItem(EKEY) || "{}"); p[id] = true; localStorage.setItem(EKEY, JSON.stringify(p)); } catch (e) { } }

  function row(line) {
    line = line || {};
    var tr = document.createElement("tr");
    tr.innerHTML = '<td class="col-c"><input class="cpt" placeholder="Compte" value="' + (line.compte || "") + '"></td>' +
      '<td><input class="lib" placeholder="Libellé" value="' + (line.libelle || "") + '"></td>' +
      '<td class="col-m"><input class="d dbt" inputmode="decimal" placeholder="0,00"></td>' +
      '<td class="col-m"><input class="c cdt" inputmode="decimal" placeholder="0,00"></td>' +
      '<td class="col-x"><button class="sx-rm" title="Supprimer">×</button></td>';
    return tr;
  }

  function render(el) {
    var id = el.getAttribute("data-ex");
    var exo = (window.EXOS || {})[id];
    if (!exo) { el.innerHTML = '<p style="color:#c0392b">Exercice introuvable : ' + id + '</p>'; return; }
    el.classList.add("sx"); el.innerHTML = "";

    var head = document.createElement("div"); head.className = "sx-head";
    head.innerHTML = '<span class="jr">' + (exo.journal || "OD") + '</span><span class="ti">' + exo.titre + '</span><span class="ok">✅ Réussi</span>';
    var en = document.createElement("div"); en.className = "sx-en"; en.textContent = exo.enonce;

    var tbl = document.createElement("table"); tbl.className = "sx-tbl";
    tbl.innerHTML = "<thead><tr><th>Compte</th><th>Libellé</th><th style='text-align:right'>Débit</th><th style='text-align:right'>Crédit</th><th></th></tr></thead>";
    var tb = document.createElement("tbody"); tbl.appendChild(tb);
    var nRows = Math.max((exo.lignes || []).length, 3);
    for (var i = 0; i < nRows; i++) tb.appendChild(row());

    var add = document.createElement("button"); add.className = "sx-add"; add.textContent = "➕ Ajouter une ligne";

    var tot = document.createElement("div"); tot.className = "sx-tot";
    tot.innerHTML = 'Total débit : <b class="td">0,00</b> &nbsp;·&nbsp; Total crédit : <b class="tc">0,00</b> <span class="sx-bal x">déséquilibré</span>';

    var act = document.createElement("div"); act.className = "sx-act";
    act.innerHTML = '<button class="sx-btn verif">Vérifier mon écriture</button><button class="sx-btn g corr">Voir la correction</button><button class="sx-btn g raz">Effacer</button>';

    var fb = document.createElement("div"); fb.className = "sx-fb";
    var cor = document.createElement("div"); cor.className = "sx-cor";

    el.appendChild(head); el.appendChild(en); el.appendChild(tbl); el.appendChild(add); el.appendChild(tot); el.appendChild(act); el.appendChild(fb); el.appendChild(cor);
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
        fb.className = "sx-fb k"; fb.textContent = "✅ Écriture correcte — bravo ! L'écriture est équilibrée et bien imputée.";
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
        return "<tr><td>" + e.compte + "</td><td>" + (e.libelle || "") + "</td><td class='d'>" + (e.debit ? fmt(e.debit) : "") + "</td><td class='c'>" + (e.credit ? fmt(e.credit) : "") + "</td></tr>";
      }).join("");
      cor.innerHTML = "<table><caption>Correction — Journal " + (exo.journal || "OD") + "</caption><thead><tr><th>Compte</th><th>Libellé</th><th style='text-align:right'>Débit</th><th style='text-align:right'>Crédit</th></tr></thead><tbody>" + rows + "</tbody></table>" + (exo.astuce ? "<div class='as'>💡 " + exo.astuce + "</div>" : "");
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
    var r = root || document;
    if (!r.querySelectorAll) return;
    r.querySelectorAll(".saisie[data-ex]").forEach(function (el) { if (!el.__sx) { el.__sx = true; render(el); } });
  }

  function boot() {
    renderAll(document);
    var content = document.getElementById("content");
    if (content && window.MutationObserver) {
      new MutationObserver(function () { renderAll(content); }).observe(content, { childList: true, subtree: true });
    }
  }
  if (document.readyState !== "loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
