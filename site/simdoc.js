/* simdoc.js — Simulateur interactif "pré-cabinet" : deux panneaux
   GAUCHE = données source (facture / extrait / tableau) ; DROITE = formulaire OFFICIEL (CERFA) à remplir.
   Usage dans une leçon (.md), sur sa propre ligne :  <div class="simdoc" data-sim="das2"></div>
   Architecture pilotée par données : ajouter un cas = ajouter une entrée dans SIMS (+ sa fonction de rendu).
   Reproduction PÉDAGOGIQUE simplifiée — documents non officiels. */
(function () {
  if (window.__SIMDOC_INIT__) return; window.__SIMDOC_INIT__ = true;

  /* ---------- Styles ---------- */
  var CSS = [
    ".simdoc{--sd-navy:#1F4E78;--sd-accent:#E8A13A;border:1px solid #d3dcea;border-radius:12px;background:#f6f8fc;margin:22px 0;overflow:hidden;font-size:13px;box-shadow:0 2px 10px rgba(20,40,70,.07)}",
    ".sd-top{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 14px;background:#eef3fb;border-bottom:1px solid #dbe4f0}",
    ".sd-top .sd-ic{font-size:18px}",
    ".sd-top .sd-h{font-weight:800;color:var(--sd-navy);font-size:14px}",
    ".sd-top .sd-sub{color:#5a6b80;font-size:12px}",
    ".sd-tabs{display:flex;gap:6px;flex-wrap:wrap;padding:10px 14px 0}",
    ".sd-tab{border:1px solid #cdd8e8;background:#fff;color:#33485f;border-radius:8px 8px 0 0;padding:7px 13px;font-weight:700;font-size:12.5px;cursor:pointer;border-bottom:none}",
    ".sd-tab.on{background:var(--sd-navy);color:#fff;border-color:var(--sd-navy)}",
    ".sd-tab.soon{opacity:.55;cursor:not-allowed}",
    ".sd-tab .b{display:block;font-size:10px;font-weight:600;opacity:.85}",
    ".sd-panes{display:flex;gap:14px;padding:14px;align-items:flex-start;flex-wrap:wrap}",
    ".sd-pane{flex:1 1 340px;min-width:300px}",
    ".sd-pane>.sd-cap{font-weight:800;color:var(--sd-navy);font-size:12px;letter-spacing:.4px;text-transform:uppercase;margin:0 0 8px}",
    ".sd-card{background:#fff;border:1px solid #d3dcea;border-radius:10px;padding:12px}",
    /* source */
    ".sd-src .row{display:flex;justify-content:space-between;gap:10px;padding:3px 0;border-bottom:1px dashed #e7edf5}",
    ".sd-src .row:last-child{border-bottom:none}",
    ".sd-src .k{color:#5a6b80}.sd-src .v{font-weight:700;color:#27384a;text-align:right}",
    ".sd-tbl{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px}",
    ".sd-tbl th{background:#f0f4fa;color:#34506e;text-align:left;padding:6px 8px;border:1px solid #dbe4f0;font-weight:700}",
    ".sd-tbl td{padding:6px 8px;border:1px solid #e3eaf3}",
    ".sd-tbl td.num,.sd-tbl th.num{text-align:right;white-space:nowrap}",
    ".sd-tbl tr.tot td{background:#eef4fb;font-weight:800;color:var(--sd-navy)}",
    ".sd-note{color:#8a97a6;font-size:11.5px;margin-top:8px}",
    /* CERFA */
    ".cf{border:1px solid #b9c6d6;background:#fff;border-radius:6px;overflow:hidden}",
    ".cf-h{display:flex;align-items:stretch;border-bottom:2px solid var(--sd-navy)}",
    ".cf-logo{font-style:italic;font-weight:800;color:var(--sd-navy);font-size:17px;padding:8px 12px;display:flex;align-items:center;border-right:1px solid #d7e0ec}",
    ".cf-htxt{flex:1;padding:6px 10px;text-align:center}",
    ".cf-dgfip{background:var(--sd-navy);color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.3px;display:inline-block;padding:2px 8px;border-radius:3px;margin-bottom:3px}",
    ".cf-title{font-weight:800;color:#1c2733;font-size:12.5px;line-height:1.25}",
    ".cf-art{font-size:9.5px;color:#5a6b80;border:1px solid #cfd8e3;border-radius:4px;display:inline-block;padding:1px 6px;margin-top:3px}",
    ".cf-no{padding:6px 10px;text-align:right;border-left:1px solid #d7e0ec;min-width:78px}",
    ".cf-no .nb{font-size:9.5px;color:#5a6b80}.cf-no .form{font-weight:800;color:#1c2733;font-size:15px}.cf-no .dt{font-size:9.5px;color:#5a6b80}",
    ".cf-souscrire{font-size:9.5px;color:#5a6b80;text-align:center;padding:3px 8px;border-bottom:1px solid #e3eaf3}",
    ".cf-cadre{border-top:1px solid #e3eaf3}",
    ".cf-cl{display:flex;align-items:center;gap:8px;background:#eef3fb;padding:4px 8px;border-bottom:1px solid #e3eaf3}",
    ".cf-badge{background:#1c2733;color:#fff;font-weight:800;width:18px;height:18px;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:11px}",
    ".cf-clt{font-weight:700;color:#27384a;font-size:11px;text-transform:uppercase;letter-spacing:.3px}",
    ".cf-body{padding:8px 10px}",
    ".cf-line{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:5px 0}",
    ".cf-lab{color:#34506e;font-size:11.5px;min-width:78px}",
    ".cf-in{border:1px solid #c4cfdd;border-radius:4px;padding:4px 7px;font:inherit;font-size:12px;color:#1c2733;background:#fffdf5}",
    ".cf-in:focus{outline:none;border-color:var(--sd-accent);box-shadow:0 0 0 2px rgba(232,161,58,.2)}",
    ".cf-in.grow{flex:1;min-width:120px}",
    ".cf-in[readonly]{background:#f4f7fb;color:#34506e}",
    ".cf-boxes{display:flex;gap:3px}",
    ".cf-box{width:20px;height:24px;text-align:center;border:1px solid #c4cfdd;border-radius:3px;font:inherit;font-weight:700;color:#1c2733;background:#fffdf5;padding:0}",
    ".cf-box[readonly]{background:#f4f7fb}",
    ".cf-tbl{width:100%;border-collapse:collapse;margin:4px 0;font-size:11.5px}",
    ".cf-tbl th{background:#f0f4fa;border:1px solid #d7e0ec;padding:4px 6px;color:#34506e;font-weight:700;text-align:center}",
    ".cf-tbl td{border:1px solid #e3eaf3;padding:4px 6px;vertical-align:middle}",
    ".cf-fill{border:1px solid #c4cfdd;border-radius:4px;padding:4px 6px;font:inherit;font-size:12px;width:100%;background:#fffdf5;color:#1c2733;text-align:right}",
    ".cf-fill.ok{border-color:#1f8a4c;background:#eafaf0;box-shadow:0 0 0 1px #1f8a4c}",
    ".cf-fill.ko{border-color:#c0392b;background:#fdecea;box-shadow:0 0 0 1px #c0392b}",
    ".cf-chk{display:flex;align-items:center;gap:7px;font-size:11.5px;color:#27384a;margin:4px 0}",
    ".cf-hint{cursor:help;color:#5a6b80;border:1px solid #cfd8e3;border-radius:50%;width:15px;height:15px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700}",
    /* actions */
    ".sd-act{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;padding:0 14px 14px;align-items:center}",
    ".sd-msg{margin-right:auto;font-weight:700;font-size:12.5px}",
    ".sd-msg.ok{color:#1f8a4c}.sd-msg.ko{color:#c0392b}",
    ".sd-btn{border:1px solid #cdd8e8;background:#fff;color:#27384a;border-radius:8px;padding:8px 14px;font-weight:700;font-size:12.5px;cursor:pointer}",
    ".sd-btn:hover{border-color:var(--sd-navy)}",
    ".sd-btn.primary{background:var(--sd-accent);border-color:var(--sd-accent);color:#1c2733}",
    ".sd-btn.navy{background:var(--sd-navy);border-color:var(--sd-navy);color:#fff}",
    ".sd-soonbox{padding:26px 14px;text-align:center;color:#5a6b80;background:#fff;border:1px dashed #cdd8e8;border-radius:10px;margin:0 14px 14px}",
    "@media(max-width:760px){.sd-panes{flex-direction:column}.sd-tab .b{display:none}}"
  ].join("");
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  /* ---------- Helpers ---------- */
  function esc(t){ return (t==null?"":""+t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function escA(t){ return esc(t).replace(/"/g,"&quot;"); }
  function eur(n){ return Number(n).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2}) + " €"; }
  function num(s){ // normalise "30 600,00 €" -> 30600
    if (s==null) return NaN;
    var t = (""+s).replace(/ /g," ").replace(/[€\s]/g,"").replace(/\./g,"").replace(/,/g,".");
    return parseFloat(t);
  }
  // champ rempli par l'apprenti (vérifiable). type: "num" (montant/entier) ou "txt"
  function fill(key, expect, type, opts){
    opts = opts || {};
    return "<input class='cf-fill' data-key='"+escA(key)+"' data-expect='"+escA(expect)+"' data-type='"+(type||"num")+"' "
      + "placeholder='"+escA(opts.ph||"")+"' "+(opts.style?"style='"+escA(opts.style)+"'":"")+">";
  }
  function hint(t){ return "<span class='cf-hint' title='"+escA(t)+"'>?</span>"; }
  function boxes(str, ro){ // suite de cases (SIREN, CP…)
    var s=""+str, h="<span class='cf-boxes'>";
    for(var i=0;i<s.length;i++) h+="<input class='cf-box' "+(ro?"readonly":"")+" maxlength='1' value='"+escA(s[i])+"'>";
    return h+"</span>";
  }
  function ro(val, cls){ return "<input class='cf-in "+(cls||"")+"' readonly value='"+escA(val)+"'>"; }

  /* ---------- Données + rendu des simulations ---------- */
  // Chaque "sim" = un jeu d'onglets. Onglet actif -> { source(), form() } renvoyant du HTML.
  // Les champs <input class='cf-fill' data-expect> sont corrigés par Vérifier / Voir le corrigé.

  // ===== Cas Module 4.1 : fiscalité — DAS2 (entreprise du bâtiment) =====
  var DAS2 = {
    ent: { denom:"BÂTI SERVICES SARL", siren:"458789123", siret:"45878912300012", adr:"45 rue de la Construction", cp:"75012", ville:"PARIS",
           contact:"Rindra M.", tel:"01 42 33 44 55", mail:"contact@batiservices.fr", signataire:"Rindra M., Gérant" },
    benef: [
      { nom:"Cabinet Expertis",     nat:"Honoraires d'expertise comptable", siren:"349123456", ttc:18000 },
      { nom:"Maître Dupont",        nat:"Honoraires juridiques",            siren:"307456789", ttc:5400  },
      { nom:"Agence Communication", nat:"Prestations de communication",     siren:"478963258", ttc:7200  }
    ],
    seuil: 2400
  };
  DAS2.aDeclarer = DAS2.benef.filter(function(b){ return b.ttc >= DAS2.seuil; });
  DAS2.total = DAS2.aDeclarer.reduce(function(s,b){ return s + b.ttc; }, 0);

  function srcDAS2(){
    var e = DAS2.ent;
    var rows = DAS2.benef.map(function(b){
      return "<tr><td>"+esc(b.nom)+"</td><td>"+esc(b.nat)+"</td><td>"+esc(b.siren)+"</td><td class='num'>"+eur(b.ttc)+"</td></tr>";
    }).join("");
    return "<div class='sd-card sd-src'>"
      + "<div class='row'><span class='k'>Dénomination</span><span class='v'>"+esc(e.denom)+"</span></div>"
      + "<div class='row'><span class='k'>SIREN</span><span class='v'>"+esc(e.siren.replace(/(\d{3})(\d{3})(\d{3})/,"$1 $2 $3"))+"</span></div>"
      + "<div class='row'><span class='k'>Adresse</span><span class='v'>"+esc(e.adr+", "+e.cp+" "+e.ville)+"</span></div>"
      + "</div>"
      + "<p class='sd-cap' style='margin:14px 0 6px'>Honoraires, commissions et courtages versés (année N)</p>"
      + "<table class='sd-tbl'><thead><tr><th>Bénéficiaire</th><th>Nature des honoraires</th><th>SIREN</th><th class='num'>Montant TTC</th></tr></thead>"
      + "<tbody>"+rows
      + "<tr class='tot'><td colspan='3'>Total des montants à déclarer</td><td class='num'>"+eur(DAS2.total)+"</td></tr></tbody></table>"
      + "<p class='sd-note'>💡 Seuil DAS2 : ne déclarer que les bénéficiaires ayant reçu <b>2 400 € ou plus</b> dans l'année (par bénéficiaire).</p>";
  }
  function formDAS2(){
    var e = DAS2.ent;
    var h = "<div class='cf'>";
    // en-tête
    h += "<div class='cf-h'><div class='cf-logo'>cerfa</div>"
      + "<div class='cf-htxt'><span class='cf-dgfip'>DIRECTION GÉNÉRALE DES FINANCES PUBLIQUES</span>"
      + "<div class='cf-title'>DÉCLARATION DES HONORAIRES, COMMISSIONS ET COURTAGES VERSÉS À DES TIERS</div>"
      + "<span class='cf-art'>art. 240, 242 ter du CGI</span></div>"
      + "<div class='cf-no'><div class='nb'>N° 11716*24</div><div class='form'>DAS2</div><div class='dt'>(01/2024)</div></div></div>";
    h += "<div class='cf-souscrire'>À souscrire par les personnes qui versent à des tiers des honoraires, commissions, courtages…</div>";
    // Cadre A — identification
    h += "<div class='cf-cadre'><div class='cf-cl'><span class='cf-badge'>A</span><span class='cf-clt'>Votre identification</span></div><div class='cf-body'>"
      + "<div class='cf-line'><span class='cf-lab'>SIREN</span>"+boxes(e.siren,true)+"</div>"
      + "<div class='cf-line'><span class='cf-lab'>Dénomination</span>"+ro(e.denom,"grow")+"</div>"
      + "<div class='cf-line'><span class='cf-lab'>Adresse</span>"+ro(e.adr,"grow")+"</div>"
      + "<div class='cf-line'><span class='cf-lab'>Code postal</span>"+boxes(e.cp,true)+"<span class='cf-lab'>Ville</span>"+ro(e.ville,"grow")+"</div>"
      + "</div></div>";
    // Cadre B — contact
    h += "<div class='cf-cadre'><div class='cf-cl'><span class='cf-badge'>B</span><span class='cf-clt'>Personne à contacter</span></div><div class='cf-body'>"
      + "<div class='cf-line'><span class='cf-lab'>Nom et prénom</span>"+ro(e.contact,"grow")+"<span class='cf-lab'>Téléphone</span>"+ro(e.tel)+"</div>"
      + "<div class='cf-line'><span class='cf-lab'>Courriel</span>"+ro(e.mail,"grow")+"</div>"
      + "</div></div>";
    // Cadre C — sommes versées (À REMPLIR)
    h += "<div class='cf-cadre'><div class='cf-cl'><span class='cf-badge'>C</span><span class='cf-clt'>Déclaration des sommes versées</span></div><div class='cf-body'>"
      + "<table class='cf-tbl'><thead><tr><th style='text-align:left'>Nature des sommes versées</th><th>Nombre de bénéficiaires "+hint("Compter uniquement les bénéficiaires ≥ 2 400 € sur l'année.")+"</th><th>Montant total versé (TTC) "+hint("Somme des montants TTC des bénéficiaires à déclarer.")+"</th></tr></thead>"
      + "<tbody><tr><td>1° Honoraires, commissions et courtages (art. 242 ter du CGI)</td>"
      + "<td style='text-align:center'>"+fill("nb", DAS2.aDeclarer.length, "num", {ph:"…"})+"</td>"
      + "<td>"+fill("montant", DAS2.total, "num", {ph:"… €"})+"</td></tr>"
      + "<tr><td>Autres sommes (art. 240 du CGI)</td><td style='text-align:center'>"+ro("—")+"</td><td>"+ro("—")+"</td></tr>"
      + "</tbody></table></div></div>";
    // Cadre D — attestation
    h += "<div class='cf-cadre'><div class='cf-cl'><span class='cf-badge'>D</span><span class='cf-clt'>Attestation</span></div><div class='cf-body'>"
      + "<div class='cf-chk'><input type='checkbox' checked disabled> J'atteste l'exactitude des renseignements portés sur la présente déclaration.</div>"
      + "<div class='cf-line'><span class='cf-lab'>À</span>"+ro(e.ville)+"<span class='cf-lab'>Le</span>"+ro("15/01/2025")+"<span class='cf-lab'>Signataire</span>"+ro(e.signataire,"grow")+"</div>"
      + "</div></div>";
    h += "</div>";
    return h;
  }

  /* ---------- Registre des simulations ---------- */
  var SIMS = {
    das2: {
      titre: "Pratique — Simulateur interactif", sous: "Fiscalité : remplir une déclaration officielle à partir des données du dossier.",
      tabs: [
        { id:"das2",  label:"DAS2",      sub:"En cours" },
        { id:"iris",  label:"IR / IS",   sub:"Résultat fiscal", soon:true },
        { id:"acis",  label:"Acompte IS", soon:true },
        { id:"cfe",   label:"CFE / CVAE", soon:true },
        { id:"cif",   label:"Crédit formation", soon:true }
      ],
      active: "das2",
      panes: { das2: { srcCap:"Données source", src: srcDAS2, formCap:"Formulaire officiel — DAS2 (simulation)", form: formDAS2 } }
    }
  };

  /* ---------- Rendu + interactions ---------- */
  function buildPane(sim, tabId){
    var p = sim.panes[tabId];
    if(!p){
      return "<div class='sd-soonbox'>🛠️ Simulateur <b>"+esc(tabId.toUpperCase())+"</b> en préparation. Le DAS2 ci-contre montre le principe : on lit les données du dossier (à gauche) et on remplit le formulaire officiel (à droite).</div>";
    }
    return "<div class='sd-panes'>"
      + "<div class='sd-pane'><p class='sd-cap'>"+esc(p.srcCap)+"</p>"+p.src()+"</div>"
      + "<div class='sd-pane'><p class='sd-cap'>"+esc(p.formCap)+"</p>"+p.form()+"</div>"
      + "</div>"
      + "<div class='sd-act'><span class='sd-msg'></span>"
      + "<button class='sd-btn' data-act='reset'>↺ Réinitialiser</button>"
      + "<button class='sd-btn' data-act='corrige'>👁 Voir le corrigé</button>"
      + "<button class='sd-btn primary' data-act='verif'>✓ Vérifier</button></div>";
  }

  function render(el){
    if(el.getAttribute("data-rendered")) return;
    var key = el.getAttribute("data-sim");
    var sim = SIMS[key];
    el.setAttribute("data-rendered","1");
    if(!sim){ el.innerHTML="<p style='color:#c0392b'>(Simulateur non disponible : "+esc(key)+")</p>"; return; }
    el.classList.add("simdoc");
    var tabsH = sim.tabs.map(function(t){
      return "<div class='sd-tab "+(t.id===sim.active?"on":"")+(t.soon?" soon":"")+"' data-tab='"+escA(t.id)+"'>"+esc(t.label)+(t.sub?"<span class='b'>"+esc(t.sub)+"</span>":"")+(t.soon?"<span class='b'>bientôt</span>":"")+"</div>";
    }).join("");
    el.innerHTML = "<div class='sd-top'><span class='sd-ic'>🖥️</span><span class='sd-h'>"+esc(sim.titre)+"</span><span class='sd-sub'>"+esc(sim.sous)+"</span></div>"
      + "<div class='sd-tabs'>"+tabsH+"</div>"
      + "<div class='sd-stage'>"+buildPane(sim, sim.active)+"</div>";

    el.addEventListener("click", function(e){
      var tab = e.target.closest(".sd-tab");
      if(tab && !tab.classList.contains("soon")){
        var id = tab.getAttribute("data-tab");
        sim.active = id;
        el.querySelectorAll(".sd-tab").forEach(function(t){ t.classList.toggle("on", t.getAttribute("data-tab")===id); });
        el.querySelector(".sd-stage").innerHTML = buildPane(sim, id);
        return;
      }
      var btn = e.target.closest(".sd-btn"); if(!btn) return;
      var act = btn.getAttribute("data-act");
      var fills = el.querySelectorAll(".cf-fill");
      var msg = el.querySelector(".sd-msg");
      if(act==="reset"){ fills.forEach(function(f){ f.value=""; f.classList.remove("ok","ko"); }); if(msg){msg.textContent="";msg.className="sd-msg";} return; }
      if(act==="corrige"){ fills.forEach(function(f){ f.value=f.getAttribute("data-expect"); f.classList.remove("ko"); f.classList.add("ok"); }); if(msg){msg.textContent="Corrigé affiché.";msg.className="sd-msg ok";} return; }
      if(act==="verif"){
        var ok=0, tot=fills.length;
        fills.forEach(function(f){
          var exp=f.getAttribute("data-expect"), type=f.getAttribute("data-type"), good;
          if(type==="num"){ good = Math.abs(num(f.value)-num(exp))<0.005; }
          else { good = (f.value||"").trim().toLowerCase() === (""+exp).trim().toLowerCase(); }
          f.classList.toggle("ok",good); f.classList.toggle("ko",!good); if(good) ok++;
        });
        if(msg){ msg.textContent = ok+" / "+tot+" correct"+(ok===tot?" — parfait ✅":""); msg.className="sd-msg "+(ok===tot?"ok":"ko"); }
        return;
      }
    });
  }
  function renderAll(root){
    var r = root||document; if(!r.querySelectorAll) return;
    var list = r.querySelectorAll(".simdoc[data-sim]");
    for(var i=0;i<list.length;i++) render(list[i]);
  }
  function boot(){
    renderAll(document);
    var content = document.getElementById("content");
    if(content && window.MutationObserver){ new MutationObserver(function(){ renderAll(content); }).observe(content,{childList:true,subtree:true}); }
  }
  if(document.readyState!=="loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
