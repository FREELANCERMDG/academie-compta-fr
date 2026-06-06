/* Simulateurs "pro" : déclaration TVA (CA3) + audit (valider le travail / détecter les anomalies).
   Usage :  <div class="tvasim" data-tva="t1"></div>   et   <div class="audit" data-audit="a1"></div>
   Données : variables globales TVASIM et AUDITS. Composant 100% original. */
(function () {
  if (window.__PRO_INIT__) return; window.__PRO_INIT__ = true;
  var TKEY = "fce_tva_v1", AKEY = "fce_audit_v1";

  var CSS = [
    ".pr{border:1px solid #d4def0;border-radius:14px;background:#fff;margin:18px 0;overflow:hidden;box-shadow:0 3px 14px rgba(20,40,70,.10)}",
    ".pr-top{background:linear-gradient(135deg,#0a6b46,#0a8f5b);color:#fff;padding:11px 16px;font-weight:800;display:flex;align-items:center;gap:10px;flex-wrap:wrap}",
    ".pr-top .ok{margin-left:auto;background:rgba(255,255,255,.2);padding:2px 10px;border-radius:20px;font-size:12px;display:none}",
    ".pr-en{padding:10px 16px;color:#37485f;background:#f5fbf8;border-bottom:1px solid #e3efe8;font-size:13.5px}",
    ".pr-bd{padding:14px 16px}",
    ".pr-line{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #eef3f1;font-size:13.5px}",
    ".pr-line label{flex:1;color:#22303f}",
    ".pr-line input{width:130px;border:1px solid #d6e2db;border-radius:8px;padding:7px 8px;text-align:right;font-variant-numeric:tabular-nums;font-family:inherit}",
    ".pr-line input:focus{outline:none;border-color:#0a8f5b;box-shadow:0 0 0 3px rgba(10,143,91,.15)}",
    ".pr-line .res{width:120px;text-align:right;font-size:12px}",
    ".pr-it{border:1px solid #e6ecf2;border-radius:10px;padding:10px 12px;margin:10px 0}",
    ".pr-it .tx{font-size:13.5px;color:#22303f;margin-bottom:8px}",
    ".pr-ch{display:flex;gap:8px;flex-wrap:wrap}",
    ".pr-ch button{border:1px solid #cdd7e3;background:#fff;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:13px;font-weight:600}",
    ".pr-ch button.sel{border-color:#0a8f5b;background:#e4f6ea;color:#0a6b46}",
    ".pr-ch button.bad.sel{border-color:#c0392b;background:#fbe7e7;color:#a5302a}",
    ".pr-exp{display:none;margin-top:8px;font-size:12.5px;padding:8px 10px;border-radius:8px}",
    ".pr-exp.k{display:block;background:#e4f6ea;color:#0a6b46}.pr-exp.x{display:block;background:#fff3e0;color:#9a5b00}",
    ".pr-act{display:flex;gap:8px;flex-wrap:wrap;padding:0 16px 14px}",
    ".pr-btn{background:#0a8f5b;color:#fff;border:none;padding:9px 16px;border-radius:9px;font-weight:700;cursor:pointer;font-size:13.5px}",
    ".pr-btn:hover{background:#0a7a4f}.pr-btn.g{background:#eef4f1;color:#0a3d2c}",
    ".pr-fb{margin:0 16px 14px;padding:10px 12px;border-radius:9px;font-size:13.5px;display:none}",
    ".pr-fb.k{background:#e4f6ea;color:#0a6b46;border:1px solid #9fdcb6;display:block}",
    ".pr-fb.x{background:#fff3e0;color:#9a5b00;border:1px solid #f3cf94;display:block}"
  ].join("");
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  function num(v) { if (v == null) return 0; v = ("" + v).replace(/\s/g, "").replace(",", ".").replace(/[^0-9.\-]/g, ""); var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function fmt(n) { return (n || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function mark(key, id) { try { var p = JSON.parse(localStorage.getItem(key) || "{}"); p[id] = true; localStorage.setItem(key, JSON.stringify(p)); } catch (e) { } }
  function isDone(key, id) { try { return !!(JSON.parse(localStorage.getItem(key) || "{}")[id]); } catch (e) { return false; } }

  /* ---------- TVA CA3 ---------- */
  function renderTva(el) {
    var id = el.getAttribute("data-tva"); var ex = (window.TVASIM || {})[id];
    if (!ex) { el.innerHTML = "<p style='color:#c0392b'>Exercice TVA introuvable : " + id + "</p>"; return; }
    el.classList.add("pr"); el.innerHTML = "";
    var lines = ex.champs.map(function (c) {
      return "<div class='pr-line'><label>" + c.label + "</label><input data-k='" + c.key + "' inputmode='decimal' placeholder='0,00'> €<span class='res'></span></div>";
    }).join("");
    el.innerHTML = "<div class='pr-top'>🧾 " + ex.titre + "<span class='ok'>✅ Réussi</span></div>" +
      "<div class='pr-en'>" + ex.enonce + "</div><div class='pr-bd'>" + lines + "</div>" +
      "<div class='pr-act'><button class='pr-btn verif'>Vérifier la CA3</button><button class='pr-btn g sol'>Voir la solution</button></div><div class='pr-fb'></div>";
    if (isDone(TKEY, id)) el.querySelector(".ok").style.display = "inline-block";
    var fb = el.querySelector(".pr-fb");
    el.querySelector(".verif").addEventListener("click", function () {
      var okAll = true;
      ex.champs.forEach(function (c) {
        var inp = el.querySelector("input[data-k='" + c.key + "']"); var res = inp.parentNode.querySelector(".res");
        var ok = Math.abs(num(inp.value) - c.attendu) < 0.01;
        res.textContent = ok ? "✓" : "✗"; res.style.color = ok ? "#0a7a4f" : "#c0392b"; if (!ok) okAll = false;
      });
      if (okAll) { fb.className = "pr-fb k"; fb.innerHTML = "✅ <b>CA3 correcte !</b> " + (ex.astuce || ""); mark(TKEY, id); el.querySelector(".ok").style.display = "inline-block"; }
      else { fb.className = "pr-fb x"; fb.innerHTML = "❌ Certaines cases sont fausses (voir ✗). Vérifiez vos calculs, ou cliquez « Voir la solution »."; }
    });
    el.querySelector(".sol").addEventListener("click", function () {
      ex.champs.forEach(function (c) { var inp = el.querySelector("input[data-k='" + c.key + "']"); inp.value = fmt(c.attendu); inp.parentNode.querySelector(".res").textContent = ""; });
      fb.className = "pr-fb k"; fb.innerHTML = "📝 <b>Solution affichée.</b> " + (ex.astuce || "");
    });
  }

  /* ---------- AUDIT (valider / anomalies) ---------- */
  function renderAudit(el) {
    var id = el.getAttribute("data-audit"); var ex = (window.AUDITS || {})[id];
    if (!ex) { el.innerHTML = "<p style='color:#c0392b'>Audit introuvable : " + id + "</p>"; return; }
    el.classList.add("pr"); el.innerHTML = "";
    var items = ex.items.map(function (it, i) {
      return "<div class='pr-it' data-i='" + i + "'><div class='tx'>" + it.texte + "</div>" +
        "<div class='pr-ch'><button data-v='ok'>✅ Correct / OK</button><button data-v='pb' class='bad'>⚠️ Problème</button></div>" +
        "<div class='pr-exp'></div></div>";
    }).join("");
    el.innerHTML = "<div class='pr-top'>🔍 " + ex.titre + "<span class='ok'>✅ Réussi</span></div>" +
      "<div class='pr-en'>" + ex.enonce + "</div><div class='pr-bd'>" + items + "</div>" +
      "<div class='pr-act'><button class='pr-btn verif'>Vérifier mes réponses</button></div><div class='pr-fb'></div>";
    if (isDone(AKEY, id)) el.querySelector(".ok").style.display = "inline-block";
    var fb = el.querySelector(".pr-fb");
    el.querySelectorAll(".pr-it").forEach(function (it) {
      it.querySelectorAll(".pr-ch button").forEach(function (b) {
        b.addEventListener("click", function () { it.querySelectorAll(".pr-ch button").forEach(function (x) { x.classList.remove("sel"); }); b.classList.add("sel"); it.dataset.rep = b.getAttribute("data-v"); });
      });
    });
    el.querySelector(".verif").addEventListener("click", function () {
      var good = 0, total = ex.items.length, answered = 0;
      el.querySelectorAll(".pr-it").forEach(function (it) {
        var i = +it.getAttribute("data-i"); var rep = it.dataset.rep; var exp = it.querySelector(".pr-exp");
        if (!rep) { return; }
        answered++;
        var correct = (rep === "pb") === !!ex.items[i].probleme;
        if (correct) good++;
        exp.className = "pr-exp " + (correct ? "k" : "x");
        exp.innerHTML = (correct ? "✅ Exact. " : "❌ À revoir. ") + ex.items[i].explication;
      });
      if (answered < total) { fb.className = "pr-fb x"; fb.innerHTML = "Répondez à toutes les lignes (" + answered + "/" + total + ")."; return; }
      if (good === total) { fb.className = "pr-fb k"; fb.innerHTML = "✅ <b>Parfait : " + good + "/" + total + ".</b> Vous validez/révisez comme un chef de mission !"; mark(AKEY, id); el.querySelector(".ok").style.display = "inline-block"; }
      else { fb.className = "pr-fb x"; fb.innerHTML = "Score : <b>" + good + "/" + total + "</b>. Lisez les explications et réessayez pour atteindre 100 %."; }
    });
  }

  function renderAll(root) {
    var r = root || document; if (!r.querySelectorAll) return;
    r.querySelectorAll(".tvasim[data-tva]").forEach(function (el) { if (!el.__pr) { el.__pr = true; renderTva(el); } });
    r.querySelectorAll(".audit[data-audit]").forEach(function (el) { if (!el.__pr) { el.__pr = true; renderAudit(el); } });
  }
  function boot() {
    renderAll(document);
    var content = document.getElementById("content");
    if (content && window.MutationObserver) new MutationObserver(function () { renderAll(content); }).observe(content, { childList: true, subtree: true });
  }
  if (document.readyState !== "loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
