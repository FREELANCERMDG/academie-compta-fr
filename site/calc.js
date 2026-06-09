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
  // __CALCS_PLACEHOLDER__

  if (document.readyState !== "loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
