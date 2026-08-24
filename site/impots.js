/* Simulateur "impots.gouv.fr" (mode EFI) — télédéclaration de TVA pas à pas.
   Usage dans une leçon (.md), sur sa propre ligne :  <div class="efi" data-efi="e2"></div>
   Données : variable globale EFI (site/impots.json). Reconstitution pédagogique — écrans non officiels.
   Composant 100 % original, sans dépendance. */
(function () {
  if (window.__EFI_INIT__) return; window.__EFI_INIT__ = true;
  var EKEY = "fce_efi_v1";

  var CSS = [
    ".efi-box{border:1px solid #ccd6e4;border-radius:14px;background:#fff;margin:18px 0;overflow:hidden;box-shadow:0 3px 14px rgba(20,40,70,.10)}",
    ".efi-top{background:linear-gradient(135deg,#000091,#1c3a8f);color:#fff;padding:11px 16px;font-weight:800;display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:14.5px}",
    ".efi-top .ok{margin-left:auto;background:rgba(255,255,255,.22);padding:2px 10px;border-radius:20px;font-size:12px;display:none}",
    ".efi-ctx{padding:10px 16px;background:#f3f6fc;border-bottom:1px solid #e0e8f4;color:#33475f;font-size:13.5px}",
    ".efi-prog{display:flex;align-items:center;gap:10px;padding:9px 16px;font-size:12.5px;color:#5a6b80;background:#fff;border-bottom:1px solid #eef2f7}",
    ".efi-bar{flex:1;height:6px;background:#e7edf5;border-radius:6px;overflow:hidden}",
    ".efi-bar i{display:block;height:100%;background:#000091;transition:width .3s}",
    ".efi-nav{background:#22314a;color:#c9d6ea;padding:7px 12px;display:flex;align-items:center;gap:8px;font-size:12px;font-family:ui-monospace,Consolas,monospace}",
    ".efi-nav .dot{width:9px;height:9px;border-radius:50%;background:#4a5b76;flex:none}",
    ".efi-nav .u{flex:1;background:#16233a;border-radius:20px;padding:4px 11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".efi-nav .lock{color:#7fd4a0}",
    ".efi-screen{background:#fafcff;border-bottom:1px solid #e6edf6;padding:12px 16px}",
    ".efi-screen h5{margin:0 0 8px;font-size:13.5px;color:#000091;font-weight:800;border:none;padding:0}",
    ".efi-vue{list-style:none;margin:0;padding:0;font-size:13px;color:#2c3e56}",
    ".efi-vue li{padding:5px 9px;border:1px dashed #d3ddec;border-radius:7px;background:#fff;margin-bottom:5px;font-family:ui-monospace,Consolas,monospace;font-size:12.3px;white-space:pre-wrap}",
    ".efi-bd{padding:13px 16px}",
    ".efi-q{font-weight:700;color:#1c2733;font-size:14px;margin-bottom:9px}",
    ".efi-opts{display:flex;flex-direction:column;gap:7px}",
    ".efi-opt{text-align:left;border:1px solid #cdd7e3;background:#fff;border-radius:9px;padding:9px 12px;cursor:pointer;font:inherit;font-size:13.5px;color:#1c2733;transition:.12s}",
    ".efi-opt:hover{border-color:#000091;background:#f4f6ff}",
    ".efi-opt.good{border-color:#0a8f5b;background:#e4f6ea;color:#0a6b46;font-weight:700}",
    ".efi-opt.bad{border-color:#c0392b;background:#fbe7e7;color:#a5302a}",
    ".efi-opt[disabled]{cursor:default}",
    ".efi-chk{display:flex;align-items:flex-start;gap:9px;padding:7px 0;border-bottom:1px solid #eef2f7;font-size:13.5px;color:#22303f}",
    ".efi-chk input{margin-top:3px;width:16px;height:16px;flex:none}",
    ".efi-chk .mk{margin-left:auto;font-weight:800}",
    ".efi-line{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #eef2f7;font-size:13.5px}",
    ".efi-line label{flex:1;color:#22303f}",
    ".efi-line input{width:130px;border:1px solid #d6e0ec;border-radius:8px;padding:7px 8px;text-align:right;font-variant-numeric:tabular-nums;font-family:inherit}",
    ".efi-line input:focus{outline:none;border-color:#000091;box-shadow:0 0 0 3px rgba(0,0,145,.14)}",
    ".efi-line .res{width:22px;text-align:right;font-weight:800}",
    ".efi-act{display:flex;gap:8px;flex-wrap:wrap;padding:0 16px 14px}",
    ".efi-btn{background:#000091;color:#fff;border:none;padding:9px 16px;border-radius:9px;font-weight:700;cursor:pointer;font-size:13.5px;font-family:inherit}",
    ".efi-btn:hover{background:#00007a}",
    ".efi-btn.g{background:#eef1fa;color:#000091}",
    ".efi-btn.n{background:#0a8f5b}.efi-btn.n:hover{background:#0a7a4f}",
    ".efi-fb{margin:0 16px 14px;padding:10px 12px;border-radius:9px;font-size:13.5px;display:none;line-height:1.45}",
    ".efi-fb.k{background:#e4f6ea;color:#0a6b46;border:1px solid #9fdcb6;display:block}",
    ".efi-fb.x{background:#fff3e0;color:#9a5b00;border:1px solid #f3cf94;display:block}",
    ".efi-end{padding:16px;text-align:center}",
    ".efi-end .big{font-size:34px}",
    ".efi-end p{color:#33475f;font-size:13.5px;margin:8px 0 12px}",
    ".efi-mini{padding:6px 16px 12px;color:#8b98a8;font-size:11.5px}"
  ].join("");
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  function num(v) { if (v == null) return 0; v = ("" + v).replace(/\s/g, "").replace(/ /g, "").replace(",", ".").replace(/[^0-9.\-]/g, ""); var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function esc(s) { return ("" + s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function mark(id) { try { var p = JSON.parse(localStorage.getItem(EKEY) || "{}"); p[id] = true; localStorage.setItem(EKEY, JSON.stringify(p)); } catch (e) { } }
  function isDone(id) { try { return !!(JSON.parse(localStorage.getItem(EKEY) || "{}")[id]); } catch (e) { return false; } }

  function render(el) {
    var id = el.getAttribute("data-efi"); var ex = (window.EFI || {})[id];
    if (!ex || !ex.etapes || !ex.etapes.length) { el.innerHTML = "<p style='color:#c0392b'>Parcours impots.gouv.fr introuvable : " + esc(id) + "</p>"; return; }
    el.classList.add("efi-box");
    var total = ex.etapes.length, pos = 0, fini = false;

    function shell(inner, actions, mini) {
      var pct = Math.round((fini ? total : pos) / total * 100);
      return "<div class='efi-top'>🖥️ " + esc(ex.titre) + "<span class='ok'" + (isDone(id) ? " style='display:inline-block'" : "") + ">✅ Terminé</span></div>" +
        "<div class='efi-ctx'><b>Contexte :</b> " + esc(ex.contexte) + "</div>" +
        "<div class='efi-prog'><span>" + (fini ? "Parcours terminé" : "Étape " + (pos + 1) + " / " + total) + "</span><span class='efi-bar'><i style='width:" + pct + "%'></i></span></div>" +
        inner +
        "<div class='efi-act'>" + (actions || "") + "</div>" +
        "<div class='efi-fb'></div>" +
        "<div class='efi-mini'>" + (mini || "Reconstitution pédagogique des écrans d'impots.gouv.fr — non officielle. Les libellés de lignes et numéros de cases sont ceux de la 3310-CA3-SD.") + "</div>";
    }
    function browser(e) {
      var vue = (e.vue || []).map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("");
      return "<div class='efi-nav'><span class='dot'></span><span class='u'><span class='lock'>🔒</span> " + esc(e.url || "https://www.impots.gouv.fr") + "</span></div>" +
        "<div class='efi-screen'><h5>" + esc(e.ecran) + "</h5><ul class='efi-vue'>" + vue + "</ul></div>";
    }

    function paint() {
      if (fini) return paintEnd();
      var e = ex.etapes[pos];
      if (e.type === "saisie") return paintSaisie(e);
      if (e.type === "check") return paintCheck(e);
      return paintChoix(e);
    }

    /* --- Étape "où je clique ?" --- */
    function paintChoix(e) {
      var opts = e.options.map(function (o, i) { return "<button class='efi-opt' data-i='" + i + "'>" + esc(o.t) + "</button>"; }).join("");
      el.innerHTML = shell(browser(e) + "<div class='efi-bd'><div class='efi-q'>" + esc(e.consigne) + "</div><div class='efi-opts'>" + opts + "</div></div>", "");
      var fb = el.querySelector(".efi-fb"), act = el.querySelector(".efi-act");
      el.querySelectorAll(".efi-opt").forEach(function (b) {
        b.addEventListener("click", function () {
          var o = e.options[+b.getAttribute("data-i")];
          b.classList.add(o.ok ? "good" : "bad");
          fb.className = "efi-fb " + (o.ok ? "k" : "x");
          fb.innerHTML = (o.ok ? "✅ " : "❌ ") + o.why;
          if (o.ok) {
            el.querySelectorAll(".efi-opt").forEach(function (x) { x.disabled = true; });
            if (e.apres) fb.innerHTML += "<br><span style='opacity:.85'>→ " + e.apres + "</span>";
            act.innerHTML = "<button class='efi-btn n suiv'>Continuer →</button>";
            act.querySelector(".suiv").addEventListener("click", next);
          }
        });
      });
    }

    /* --- Étape "je remplis la déclaration" --- */
    function paintSaisie(e) {
      var lines = e.champs.map(function (c) {
        return "<div class='efi-line'><label>" + esc(c.label) + "</label><input data-k='" + c.key + "' inputmode='decimal' placeholder='0,00'> €<span class='res'></span></div>";
      }).join("");
      el.innerHTML = shell(browser(e) + "<div class='efi-bd'><div class='efi-q'>" + esc(e.consigne) + "</div>" + lines + "</div>",
        "<button class='efi-btn verif'>Vérifier ma déclaration</button><button class='efi-btn g sol'>Voir la solution</button>");
      var fb = el.querySelector(".efi-fb"), act = el.querySelector(".efi-act");
      function ouvrirSuite() {
        act.innerHTML = "<button class='efi-btn n suiv'>Valider et continuer →</button>";
        act.querySelector(".suiv").addEventListener("click", next);
      }
      el.querySelector(".verif").addEventListener("click", function () {
        var okAll = true;
        e.champs.forEach(function (c) {
          var inp = el.querySelector("input[data-k='" + c.key + "']"), res = inp.parentNode.querySelector(".res");
          var ok = Math.abs(num(inp.value) - c.attendu) < 0.01;
          res.textContent = ok ? "✓" : "✗"; res.style.color = ok ? "#0a7a4f" : "#c0392b"; if (!ok) okAll = false;
        });
        if (okAll) {
          fb.className = "efi-fb k";
          fb.innerHTML = "✅ <b>Déclaration correcte.</b> " + (e.apres ? "→ " + e.apres : "");
          ouvrirSuite();
        } else {
          fb.className = "efi-fb x";
          fb.innerHTML = "❌ Certaines cases sont fausses (✗). Reprenez le cadrage : collectée par taux, déductible ABS / immobilisations, puis les totaux.";
        }
      });
      el.querySelector(".sol").addEventListener("click", function () {
        e.champs.forEach(function (c) {
          var inp = el.querySelector("input[data-k='" + c.key + "']");
          inp.value = c.attendu.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          inp.parentNode.querySelector(".res").textContent = "";
        });
        fb.className = "efi-fb x";
        fb.innerHTML = "💡 <b>Corrigé :</b> " + esc(e.astuce || "");
        ouvrirSuite();
      });
    }

    /* --- Étape "les bons réflexes" (cases à cocher) --- */
    function paintCheck(e) {
      var its = e.items.map(function (it, i) {
        return "<label class='efi-chk'><input type='checkbox' data-i='" + i + "'><span>" + esc(it.t) + "</span><span class='mk'></span></label>";
      }).join("");
      el.innerHTML = shell(browser(e) + "<div class='efi-bd'><div class='efi-q'>" + esc(e.consigne) + "</div>" + its + "</div>",
        "<button class='efi-btn verif'>Vérifier mes réflexes</button>");
      var fb = el.querySelector(".efi-fb"), act = el.querySelector(".efi-act");
      el.querySelector(".verif").addEventListener("click", function () {
        var bon = 0;
        e.items.forEach(function (it, i) {
          var cb = el.querySelector("input[data-i='" + i + "']"), mk = cb.parentNode.querySelector(".mk");
          var ok = cb.checked === !!it.ok;
          mk.textContent = ok ? "✓" : "✗"; mk.style.color = ok ? "#0a7a4f" : "#c0392b";
          if (ok) bon++;
        });
        if (bon === e.items.length) {
          fb.className = "efi-fb k";
          fb.innerHTML = "✅ <b>Parfait.</b> " + (e.explication || "") + (e.apres ? "<br><span style='opacity:.85'>→ " + e.apres + "</span>" : "");
          act.innerHTML = "<button class='efi-btn n suiv'>Continuer →</button>";
          act.querySelector(".suiv").addEventListener("click", next);
        } else {
          fb.className = "efi-fb x";
          fb.innerHTML = "Score : <b>" + bon + " / " + e.items.length + "</b>. Les lignes marquées ✗ sont à revoir (cochées à tort ou oubliées).";
        }
      });
    }

    function paintEnd() {
      el.innerHTML = shell("<div class='efi-end'><div class='big'>🏁</div><h4 style='margin:6px 0;border:none'>Parcours terminé</h4><p>" + esc(ex.bilan || "") + "</p></div>",
        "<button class='efi-btn g rej'>↻ Refaire le parcours</button>");
      el.querySelector(".ok").style.display = "inline-block";
      el.querySelector(".rej").addEventListener("click", function () { pos = 0; fini = false; paint(); });
    }

    function next() { if (pos < total - 1) { pos++; paint(); } else { fini = true; mark(id); paint(); } el.scrollIntoView({ block: "nearest" }); }

    paint();
  }

  function renderAll(root) {
    var r = root || document; if (!r.querySelectorAll) return;
    r.querySelectorAll(".efi[data-efi]").forEach(function (el) { if (!el.__efi) { el.__efi = true; render(el); } });
  }
  function boot() {
    renderAll(document);
    var content = document.getElementById("content");
    if (content && window.MutationObserver) new MutationObserver(function () { renderAll(content); }).observe(content, { childList: true, subtree: true });
  }
  if (document.readyState !== "loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
