/* Simulateur de rapprochement bancaire — composant 100% original (recoloré navy/ambre).
   Usage :  <div class="rappro" data-rappro="r1"></div>
   Données : variable globale window.RAPPRO.
   Pour chaque ligne, l'apprenant choisit : Pointer (présente des 2 côtés) / Comptabiliser
   (écriture manquante en compta) / En rapprochement (pas encore en banque). Objectif : écart 0. */
(function () {
  if (window.__RAPPRO_INIT__) return; window.__RAPPRO_INIT__ = true;
  var KEY = "fce_rappro_v1";

  var CSS = [
    ".rb{border:1px solid #cfdcee;border-radius:14px;background:#fff;margin:18px 0;overflow:hidden;box-shadow:0 3px 14px rgba(20,40,70,.10)}",
    ".rb-top{background:linear-gradient(135deg,#16307a,#2f6aa6);color:#fff;padding:11px 16px;font-weight:800;display:flex;align-items:center;gap:10px;flex-wrap:wrap}",
    ".rb-top .ok{margin-left:auto;background:rgba(255,255,255,.2);padding:2px 10px;border-radius:20px;font-size:12px;display:none}",
    ".rb-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:#e4eef8}",
    ".rb-st{background:#f4f8fd;padding:10px 12px;text-align:center}",
    ".rb-st .l{font-size:11px;color:#5b6b80;text-transform:uppercase;letter-spacing:.04em}",
    ".rb-st .v{font-size:18px;font-weight:800;color:#16307a;font-variant-numeric:tabular-nums}",
    ".rb-st.ec .v{color:#c0392b}.rb-st.ec.ok0 .v{color:#1f8a4c}",
    ".rb-intro{padding:10px 16px;font-size:13px;color:#33455c;background:#fff;border-bottom:1px solid #eef3f9}",
    ".rb-bd{padding:6px 10px 4px}",
    ".rb-line{border:1px solid #e6ecf2;border-radius:10px;padding:8px 11px;margin:7px 0}",
    ".rb-line .hd{display:flex;align-items:center;gap:10px;flex-wrap:wrap}",
    ".rb-line .dt{font-size:11.5px;color:#7d8aa0;min-width:42px}",
    ".rb-line .lb{flex:1;min-width:140px;font-size:13.5px;color:#22303f}",
    ".rb-line .mt{font-weight:800;font-variant-numeric:tabular-nums;font-size:13.5px}",
    ".rb-line .mt.pos{color:#1f8a4c}.rb-line .mt.neg{color:#c0392b}",
    ".rb-act{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}",
    ".rb-act button{border:1px solid #cdd7e3;background:#fff;border-radius:8px;padding:5px 10px;cursor:pointer;font-size:12px;font-weight:600;color:#33455c}",
    ".rb-act button:hover{background:#f0f4f9}",
    ".rb-act button.sel{border-color:#16307a;background:#e7eefb;color:#16307a}",
    ".rb-line.good{border-color:#9fdcb6;background:#f3fbf6}",
    ".rb-line.bad{border-color:#f3b4ad;background:#fdf3f2}",
    ".rb-tip{display:none;margin-top:6px;font-size:12px;padding:6px 9px;border-radius:7px;background:#fff8ec;color:#8a5b00}",
    ".rb-tip.show{display:block}",
    ".rb-ecr{display:none;margin-top:5px;font-size:12px;color:#16307a;background:#eef3fb;border-radius:7px;padding:6px 9px}",
    ".rb-ecr.show{display:block}",
    ".rb-act2{display:flex;gap:8px;flex-wrap:wrap;padding:8px 16px 14px}",
    ".rb-btn{background:#E8A13A;color:#3a2600;border:none;padding:9px 16px;border-radius:9px;font-weight:800;cursor:pointer;font-size:13.5px}",
    ".rb-btn:hover{background:#d9912b}.rb-btn.g{background:#eef4f1;color:#16307a}",
    ".rb-fb{margin:0 16px 14px;padding:10px 12px;border-radius:9px;font-size:13.5px;display:none}",
    ".rb-fb.k{background:#e4f6ea;color:#0a6b46;border:1px solid #9fdcb6;display:block}",
    ".rb-fb.x{background:#fff3e0;color:#9a5b00;border:1px solid #f3cf94;display:block}",
    ".rb-recap{margin:0 16px 14px;border:1px solid #d4def0;border-radius:10px;overflow:hidden;display:none}",
    ".rb-recap.show{display:block}",
    ".rb-recap .rh{background:#eef3fb;color:#16307a;font-weight:800;padding:8px 12px;font-size:13px}",
    ".rb-recap .cols{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#e4eef8}",
    ".rb-recap .col{background:#fff;padding:10px 12px;font-size:12.5px}",
    ".rb-recap .col h5{margin:0 0 6px;color:#16307a;font-size:12.5px}",
    ".rb-recap .col .r{display:flex;justify-content:space-between;gap:8px;padding:2px 0;font-variant-numeric:tabular-nums}",
    ".rb-recap .col .tot{border-top:1px solid #cfd8e3;margin-top:5px;padding-top:5px;font-weight:800}",
    "@media(max-width:560px){.rb-stats{grid-template-columns:1fr}.rb-recap .cols{grid-template-columns:1fr}}"
  ].join("");
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  function eur(n) { return (Math.round((n || 0) * 100) / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; }
  function seur(n) { return (n > 0 ? "+" : "") + eur(n); }
  function mark(id) { try { var p = JSON.parse(localStorage.getItem(KEY) || "{}"); p[id] = true; localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { } }
  function isDone(id) { try { return !!(JSON.parse(localStorage.getItem(KEY) || "{}")[id]); } catch (e) { return false; } }
  var ACTIONS = [{ k: "pointer", lab: "✓ Pointer" }, { k: "comptabiliser", lab: "🧾 Comptabiliser" }, { k: "rappro", lab: "⏳ En rapprochement" }];

  function render(el) {
    var id = el.getAttribute("data-rappro"); var ex = (window.RAPPRO || {})[id];
    if (!ex) { el.innerHTML = "<p style='color:#c0392b'>Rapprochement introuvable : " + id + "</p>"; return; }
    el.classList.add("rb");
    var choice = {}; // id -> action
    var lines = ex.lignes.map(function (l) {
      var acts = ACTIONS.map(function (a) { return "<button data-l='" + l.id + "' data-a='" + a.k + "'>" + a.lab + "</button>"; }).join("");
      return "<div class='rb-line' data-id='" + l.id + "'><div class='hd'><span class='dt'>" + l.date + "</span><span class='lb'>" + l.libelle + "</span><span class='mt " + (l.montant >= 0 ? "pos" : "neg") + "'>" + seur(l.montant) + "</span></div><div class='rb-act'>" + acts + "</div><div class='rb-tip'></div><div class='rb-ecr'></div></div>";
    }).join("");
    el.innerHTML =
      "<div class='rb-top'>🏦 Rapprochement bancaire — " + ex.compte + " · " + ex.periode + "<span class='ok'>✅ Équilibré</span></div>" +
      "<div class='rb-stats'><div class='rb-st'><div class='l'>Comptabilité (512) corrigée</div><div class='v' data-k='c'>" + eur(ex.soldeCompta) + "</div></div>" +
      "<div class='rb-st'><div class='l'>Relevé bancaire corrigé</div><div class='v' data-k='r'>" + eur(ex.soldeReleve) + "</div></div>" +
      "<div class='rb-st ec'><div class='l'>Écart</div><div class='v' data-k='e'>" + eur(ex.soldeReleve - ex.soldeCompta) + "</div></div></div>" +
      (ex.intro ? "<div class='rb-intro'>" + ex.intro + "</div>" : "") +
      "<div class='rb-bd'>" + lines + "</div>" +
      "<div class='rb-act2'><button class='rb-btn verif'>Vérifier le rapprochement</button><button class='rb-btn g sol'>Voir la correction</button><button class='rb-btn g reset'>↺ Réinitialiser</button></div>" +
      "<div class='rb-fb'></div><div class='rb-recap'></div>";
    if (isDone(id)) el.querySelector(".ok").style.display = "inline-block";

    var stC = el.querySelector("[data-k='c']"), stR = el.querySelector("[data-k='r']"), stE = el.querySelector("[data-k='e']"), ecBox = stE.parentNode;
    function recompute() {
      var adjC = 0, adjR = 0;
      ex.lignes.forEach(function (l) { var a = choice[l.id]; if (a === "comptabiliser") adjC += l.montant; else if (a === "rappro") adjR += l.montant; });
      var sc = ex.soldeCompta + adjC, sr = ex.soldeReleve + adjR, ec = sr - sc;
      stC.textContent = eur(sc); stR.textContent = eur(sr); stE.textContent = eur(ec);
      ecBox.classList.toggle("ok0", Math.abs(ec) < 0.005);
      return ec;
    }
    el.querySelectorAll(".rb-act button").forEach(function (b) {
      b.addEventListener("click", function () {
        var lid = b.getAttribute("data-l");
        var row = b.closest(".rb-line");
        row.querySelectorAll(".rb-act button").forEach(function (x) { x.classList.remove("sel"); });
        b.classList.add("sel"); choice[lid] = b.getAttribute("data-a");
        row.classList.remove("good", "bad"); row.querySelector(".rb-tip").classList.remove("show");
        recompute();
      });
    });
    var fb = el.querySelector(".rb-fb"), recap = el.querySelector(".rb-recap");

    function setChoice(l, a) { choice[l.id] = a; var row = el.querySelector(".rb-line[data-id='" + l.id + "']"); row.querySelectorAll(".rb-act button").forEach(function (x) { x.classList.toggle("sel", x.getAttribute("data-a") === a); }); }

    function showRecap(ex) {
      var compt = ex.lignes.filter(function (l) { return l.correct === "comptabiliser"; });
      var rap = ex.lignes.filter(function (l) { return l.correct === "rappro"; });
      var sc = ex.soldeCompta + compt.reduce(function (s, l) { return s + l.montant; }, 0);
      var sr = ex.soldeReleve + rap.reduce(function (s, l) { return s + l.montant; }, 0);
      var ecr = compt.filter(function (l) { return l.ecriture; }).map(function (l) { return "<div>• " + l.ecriture + "</div>"; }).join("");
      recap.innerHTML = "<div class='rh'>📋 État de rapprochement — " + ex.periode + "</div><div class='cols'>" +
        "<div class='col'><h5>Côté COMPTABILITÉ (512)</h5><div class='r'><span>Solde comptable</span><b>" + eur(ex.soldeCompta) + "</b></div>" +
        compt.map(function (l) { return "<div class='r'><span>+ écriture : " + l.libelle + "</span><b>" + seur(l.montant) + "</b></div>"; }).join("") +
        "<div class='r tot'><span>Solde corrigé</span><b>" + eur(sc) + "</b></div></div>" +
        "<div class='col'><h5>Côté BANQUE (relevé)</h5><div class='r'><span>Solde relevé</span><b>" + eur(ex.soldeReleve) + "</b></div>" +
        rap.map(function (l) { return "<div class='r'><span>" + (l.montant < 0 ? "− chèque émis" : "+ remise") + " : " + l.libelle.replace(/\(.*\)/, "").trim() + "</span><b>" + seur(l.montant) + "</b></div>"; }).join("") +
        "<div class='r tot'><span>Solde corrigé</span><b>" + eur(sr) + "</b></div></div></div>" +
        "<div class='col' style='border-top:1px solid #e4eef8'><h5>Écritures à passer en comptabilité</h5>" + (ecr || "<div>—</div>") + "</div>";
      recap.classList.add("show");
    }

    el.querySelector(".verif").addEventListener("click", function () {
      var allChosen = ex.lignes.every(function (l) { return choice[l.id]; });
      var allGood = true;
      ex.lignes.forEach(function (l) {
        var row = el.querySelector(".rb-line[data-id='" + l.id + "']"); var tip = row.querySelector(".rb-tip");
        var ok = choice[l.id] === l.correct;
        row.classList.toggle("good", ok && !!choice[l.id]); row.classList.toggle("bad", !!choice[l.id] && !ok);
        if (!ok) { allGood = false; if (choice[l.id]) { tip.textContent = "À revoir : " + l.aide; tip.classList.add("show"); } }
        else { tip.classList.remove("show"); }
      });
      var ec = recompute();
      if (!allChosen) { fb.className = "rb-fb x"; fb.innerHTML = "Traitez <b>toutes les lignes</b> (choisissez une action sur chacune)."; return; }
      if (allGood && Math.abs(ec) < 0.005) {
        fb.className = "rb-fb k"; fb.innerHTML = "✅ <b>Rapprochement équilibré !</b> Écart 0,00 € — les deux soldes corrigés sont égaux. Vous justifiez le compte 512 comme en cabinet.";
        mark(id); el.querySelector(".ok").style.display = "inline-block"; showRecap(ex);
      } else {
        fb.className = "rb-fb x"; fb.innerHTML = "❌ Écart actuel : <b>" + eur(ec) + "</b>. Corrigez les lignes en rouge (voir les indices) pour atteindre 0,00 €.";
        recap.classList.remove("show");
      }
    });
    el.querySelector(".sol").addEventListener("click", function () {
      ex.lignes.forEach(function (l) { setChoice(l, l.correct); var row = el.querySelector(".rb-line[data-id='" + l.id + "']"); row.classList.remove("bad"); row.classList.add("good"); row.querySelector(".rb-tip").classList.remove("show"); });
      recompute();
      fb.className = "rb-fb k"; fb.innerHTML = "📝 <b>Correction affichée.</b> Pointer = présent des 2 côtés ; Comptabiliser = écriture manquante en compta ; En rapprochement = pas encore passé en banque.";
      showRecap(ex);
    });
    el.querySelector(".reset").addEventListener("click", function () {
      choice = {};
      el.querySelectorAll(".rb-act button").forEach(function (x) { x.classList.remove("sel"); });
      el.querySelectorAll(".rb-line").forEach(function (row) {
        row.classList.remove("good", "bad");
        var t = row.querySelector(".rb-tip"); t.classList.remove("show"); t.textContent = "";
        row.querySelector(".rb-ecr").classList.remove("show");
      });
      fb.className = "rb-fb"; fb.innerHTML = "";
      recap.classList.remove("show"); recap.innerHTML = "";
      recompute();
    });
  }

  function renderAll(root) { var r = root || document; if (!r.querySelectorAll) return; r.querySelectorAll(".rappro[data-rappro]").forEach(function (el) { if (!el.__rb) { el.__rb = true; render(el); } }); }
  function boot() { renderAll(document); var c = document.getElementById("content"); if (c && window.MutationObserver) new MutationObserver(function () { renderAll(c); }).observe(c, { childList: true, subtree: true }); }
  if (document.readyState !== "loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
