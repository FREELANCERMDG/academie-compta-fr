/* Simulateur Cabinet — l'apprenant traite une pile de factures comme un vrai collaborateur.
   Usage dans une leçon (.md) :  <div class="simcab" data-dossier="d1"></div>
   Données : variable globale DOSSIERS (depuis site/dossiers.json). Composant 100% original. */
(function () {
  if (window.__SIM_INIT__) return; window.__SIM_INIT__ = true;
  var SKEY = "fce_sim_v1";

  var CSS = [
    ".sc{border:1px solid #d4def0;border-radius:14px;background:#fff;margin:18px 0;overflow:hidden;box-shadow:0 3px 14px rgba(20,40,70,.10)}",
    ".sc-top{background:linear-gradient(135deg,#16307a,#2b56c6);color:#fff;padding:12px 16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}",
    ".sc-top .dossier{font-weight:800}",
    ".sc-top .pos{margin-left:auto;background:rgba(255,255,255,.18);padding:3px 12px;border-radius:20px;font-size:13px;font-weight:700}",
    ".sc-bar{height:6px;background:#e6ecf7}.sc-bar i{display:block;height:100%;background:#34d399;width:0;transition:width .3s}",
    ".sc-intro{padding:10px 16px;color:#37485f;background:#f5f8fd;border-bottom:1px solid #e6ecf7;font-size:13.5px}",
    ".sc-body{display:grid;grid-template-columns:1fr 1fr;gap:0}",
    "@media(max-width:760px){.sc-body{grid-template-columns:1fr}}",
    ".sc-doc{padding:16px;border-right:1px solid #eef2f8;background:#fbfdff}",
    ".sc-doc .fac{border:1px solid #dde6f2;border-radius:10px;padding:14px;font-size:12.5px;color:#22303f;background:#fff}",
    ".sc-doc .sens{display:inline-block;background:#eef4fb;color:#16307a;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;margin-bottom:8px}",
    ".sc-doc .em{font-weight:800;font-size:14px;color:#16307a}",
    ".sc-doc .meta{color:#5a6b80;margin:6px 0}",
    ".sc-doc table{width:100%;border-collapse:collapse;margin:8px 0;font-size:12px}",
    ".sc-doc th{background:#16307a;color:#fff;text-align:left;padding:5px 7px}",
    ".sc-doc td{border-bottom:1px solid #eef2f8;padding:5px 7px}",
    ".sc-doc .tot{text-align:right;margin-top:8px}.sc-doc .tot b{display:inline-block;min-width:90px;text-align:right;font-variant-numeric:tabular-nums}",
    ".sc-form{padding:16px}",
    ".sc-form label{display:block;font-size:12px;font-weight:700;color:#37485f;margin:10px 0 4px}",
    ".sc-form input,.sc-form select{width:100%;border:1px solid #d6e0ee;border-radius:8px;padding:8px 9px;font-size:13.5px;font-family:inherit;background:#fff}",
    ".sc-form input:focus,.sc-form select:focus{outline:none;border-color:#2b56c6;box-shadow:0 0 0 3px rgba(43,86,198,.15)}",
    ".sc-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}",
    ".sc-grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}",
    ".sc-form .num{text-align:right;font-variant-numeric:tabular-nums}",
    ".sc-cut{display:flex;gap:14px;align-items:center;margin-top:8px;font-size:13px;color:#37485f}",
    ".sc-cut label{display:inline-flex;gap:5px;align-items:center;margin:0;font-weight:600}",
    ".sc-cut input{width:auto}",
    ".sc-act{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}",
    ".sc-btn{background:#16307a;color:#fff;border:none;padding:10px 18px;border-radius:9px;font-weight:700;cursor:pointer;font-size:14px}",
    ".sc-btn:hover{background:#0f2360}.sc-btn.g{background:#eef2f8;color:#16307a}.sc-btn.g:hover{background:#e0e8f3}",
    ".sc-fb{margin-top:12px;padding:10px 12px;border-radius:9px;font-size:13.5px;display:none}",
    ".sc-fb.k{background:#e4f6ea;color:#0a6b46;border:1px solid #9fdcb6;display:block}",
    ".sc-fb.x{background:#fff3e0;color:#9a5b00;border:1px solid #f3cf94;display:block}",
    ".sc-fb ul{margin:6px 0 0;padding-left:18px}",
    ".sc-done{padding:30px 16px;text-align:center}",
    ".sc-done .big{font-size:42px}.sc-done h3{margin:6px 0;color:#16307a}",
    ".sc-badge{display:inline-block;background:#e4f6ea;color:#0a6b46;font-weight:700;padding:6px 14px;border-radius:20px;margin-top:8px}"
  ].join("");
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  function num(v) { if (v == null) return 0; v = ("" + v).replace(/\s/g, "").replace(",", ".").replace(/[^0-9.\-]/g, ""); var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function fmt(n) { return (n || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function getProg() { try { return JSON.parse(localStorage.getItem(SKEY) || "{}"); } catch (e) { return {}; } }
  function setProg(id, n) { try { var p = getProg(); p[id] = Math.max(n, p[id] || 0); localStorage.setItem(SKEY, JSON.stringify(p)); } catch (e) { } }

  function facHtml(d) {
    var lignes = (d.lignes || []).map(function (l) {
      return "<tr><td>" + l.designation + "</td><td style='text-align:right'>" + (l.qte || 1) + "</td><td style='text-align:right'>" + fmt(l.puht) + " €</td></tr>";
    }).join("");
    return "<div class='fac'><span class='sens'>" + d.sens + "</span>" +
      "<div class='em'>" + d.emetteur + "</div><div class='meta'>" + (d.ville || "") + "</div>" +
      "<div class='meta'>Facture n° <b>" + d.num + "</b> · Émise le " + d.date + " · Échéance " + d.echeance + "</div>" +
      "<table><thead><tr><th>Désignation</th><th style='text-align:right'>Qté</th><th style='text-align:right'>PU HT</th></tr></thead><tbody>" + lignes + "</tbody></table>" +
      "<div class='tot'>Total HT : <b>" + fmt(d.ht) + " €</b></div>" +
      "<div class='tot'>TVA (" + (d.taux || 0) + " %) : <b>" + fmt(d.tva) + " €</b></div>" +
      "<div class='tot' style='font-weight:800'>Total TTC : <b>" + fmt(d.ttc) + " €</b></div></div>";
  }

  function render(el) {
    var id = el.getAttribute("data-dossier");
    var dos = (window.DOSSIERS || {})[id];
    if (!dos) { el.innerHTML = "<p style='color:#c0392b'>Dossier introuvable : " + id + "</p>"; return; }
    el.classList.add("sc"); el.innerHTML = "";
    var pieces = dos.pieces || [];
    var idx = Math.min(getProg()[id] || 0, pieces.length);
    var top = document.createElement("div"); top.className = "sc-top";
    var bar = document.createElement("div"); bar.className = "sc-bar"; bar.innerHTML = "<i></i>";
    var stage = document.createElement("div");
    el.appendChild(top); el.appendChild(bar); el.appendChild(stage);

    function setBar() { bar.querySelector("i").style.width = Math.round(idx / pieces.length * 100) + "%"; }

    function done() {
      top.innerHTML = "<span class='dossier'>🏢 " + dos.client + "</span><span class='pos'>Dossier traité</span>";
      setBar();
      stage.innerHTML = "<div class='sc-done'><div class='big'>🎉</div><h3>Dossier traité — comme un vrai collaborateur !</h3>" +
        "<p>Vous avez traité <b>" + pieces.length + " pièces</b> : type de tiers, imputation, TVA et validation.</p>" +
        "<div class='sc-badge'>✅ Mise en situation réussie</div>" +
        "<p style='margin-top:14px'><button class='sc-btn g restart'>↻ Recommencer le dossier</button></p></div>";
      stage.querySelector(".restart").addEventListener("click", function () { idx = 0; setProg(id, 0); try { var p = getProg(); p[id] = 0; localStorage.setItem(SKEY, JSON.stringify(p)); } catch (e) { } showPiece(); });
    }

    function showPiece() {
      if (idx >= pieces.length) { done(); return; }
      var pc = pieces[idx], d = pc.doc, a = pc.attendu;
      top.innerHTML = "<span class='dossier'>🏢 " + dos.client + "</span><span class='pos'>Pièce " + (idx + 1) + " / " + pieces.length + "</span>";
      setBar();
      stage.innerHTML = "";
      if (idx === 0 && dos.intro) { var intro = document.createElement("div"); intro.className = "sc-intro"; intro.textContent = "🎯 " + dos.intro; stage.appendChild(intro); }
      var body = document.createElement("div"); body.className = "sc-body";
      var doc = document.createElement("div"); doc.className = "sc-doc"; doc.innerHTML = facHtml(d);
      var form = document.createElement("div"); form.className = "sc-form";
      form.innerHTML =
        "<label>Type de tiers</label><select class='f-tiers'><option value=''>— choisir —</option><option value='fournisseur'>Fournisseur</option><option value='client'>Client</option></select>" +
        "<label>Compte de contrepartie (imputation)</label><input class='f-compte' placeholder='ex. 6226, 706, 616…'>" +
        "<div class='sc-grid3'><div><label>Montant HT</label><input class='f-ht num' inputmode='decimal' placeholder='0,00'></div>" +
        "<div><label>Montant TVA</label><input class='f-tva num' inputmode='decimal' placeholder='0,00'></div>" +
        "<div><label>Total TTC</label><input class='f-ttc num' inputmode='decimal' placeholder='0,00'></div></div>" +
        "<label>Taux de TVA</label><select class='f-taux'><option value=''>— choisir —</option><option value='20'>20 %</option><option value='10'>10 %</option><option value='5.5'>5,5 %</option><option value='0'>0 % / exonéré</option></select>" +
        "<div class='sc-cut'>Cut-off : <label><input type='radio' name='cut" + idx + "' value='' checked> Aucun</label><label><input type='radio' name='cut" + idx + "' value='CCA'> CCA</label><label><input type='radio' name='cut" + idx + "' value='FNP'> FNP</label></div>" +
        "<div class='sc-act'><button class='sc-btn valider'>✓ Valider la pièce</button><button class='sc-btn g indice'>💡 Indice</button><button class='sc-btn g passer'>Voir la correction</button></div>" +
        "<div class='sc-fb'></div>";
      body.appendChild(doc); body.appendChild(form); stage.appendChild(body);
      var fb = form.querySelector(".sc-fb");

      function val() {
        var errs = [];
        if (form.querySelector(".f-tiers").value !== a.tiers) errs.push("Type de tiers incorrect (Fournisseur ou Client ?).");
        var cpt = form.querySelector(".f-compte").value.replace(/\s/g, "").toUpperCase();
        if (cpt.indexOf((a.racine || a.compte).toUpperCase()) !== 0) errs.push("Compte d'imputation incorrect (attendu vers <b>" + a.compte + "</b>).");
        if (Math.abs(num(form.querySelector(".f-ht").value) - a.ht) > 0.01) errs.push("Montant HT incorrect.");
        if (Math.abs(num(form.querySelector(".f-tva").value) - a.tva) > 0.01) errs.push("Montant TVA incorrect.");
        if (Math.abs(num(form.querySelector(".f-ttc").value) - a.ttc) > 0.01) errs.push("Total TTC incorrect.");
        var taux = (form.querySelector(".f-taux").value || "");
        if (taux === "" || Math.abs(parseFloat(taux) - a.taux) > 0.001) errs.push("Taux de TVA incorrect.");
        var cut = (form.querySelector("input[name='cut" + idx + "']:checked") || {}).value || "";
        if (cut !== (a.cutoff || "")) errs.push("Cut-off incorrect.");
        if (!errs.length) {
          fb.className = "sc-fb k"; fb.innerHTML = "✅ <b>Pièce validée !</b> Imputation correcte. Passage à la pièce suivante…";
          idx++; setProg(id, idx); setBar();
          setTimeout(showPiece, 900);
        } else {
          fb.className = "sc-fb x"; fb.innerHTML = "À corriger :<ul><li>" + errs.join("</li><li>") + "</li></ul>";
        }
      }
      function correction() {
        form.querySelector(".f-tiers").value = a.tiers;
        form.querySelector(".f-compte").value = a.compte;
        form.querySelector(".f-ht").value = fmt(a.ht);
        form.querySelector(".f-tva").value = fmt(a.tva);
        form.querySelector(".f-ttc").value = fmt(a.ttc);
        form.querySelector(".f-taux").value = "" + a.taux;
        var r = form.querySelector("input[name='cut" + idx + "'][value='" + (a.cutoff || "") + "']"); if (r) r.checked = true;
        fb.className = "sc-fb k"; fb.innerHTML = "📝 <b>Correction affichée.</b> " + (pc.astuce ? pc.astuce + " " : "") + "Cliquez « Valider » pour continuer.";
      }
      form.querySelector(".valider").addEventListener("click", val);
      form.querySelector(".passer").addEventListener("click", correction);
      form.querySelector(".indice").addEventListener("click", function () { fb.className = "sc-fb x"; fb.innerHTML = "💡 " + (pc.astuce || "Identifiez la nature de la dépense/vente, puis le compte et le taux de TVA."); });
    }
    showPiece();
  }

  function renderAll(root) {
    var r = root || document; if (!r.querySelectorAll) return;
    r.querySelectorAll(".simcab[data-dossier]").forEach(function (el) { if (!el.__sc) { el.__sc = true; render(el); } });
  }
  function boot() {
    renderAll(document);
    var content = document.getElementById("content");
    if (content && window.MutationObserver) new MutationObserver(function () { renderAll(content); }).observe(content, { childList: true, subtree: true });
  }
  if (document.readyState !== "loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
