/* simdoc.js — Simulateur interactif "pré-cabinet" : tuto de remplissage + deux panneaux
   GAUCHE = données source (dossier) ; DROITE = formulaire OFFICIEL (CERFA / liasse) à remplir.
   Usage dans une leçon (.md), sur sa propre ligne :  <div class="simdoc" data-sim="das2"></div>
   Piloté par données (registre SIMS) : ajouter un cas = ajouter des données (+ une fonction de mise en page).
   Reproduction PÉDAGOGIQUE simplifiée — documents non officiels. */
(function () {
  if (window.__SIMDOC_INIT__) return; window.__SIMDOC_INIT__ = true;

  /* ---------- Styles ---------- */
  var CSS = [
    ".simdoc{--sd-navy:#1F4E78;--sd-accent:#E8A13A;border:1px solid #d3dcea;border-radius:12px;background:#f6f8fc;margin:22px 0;overflow:hidden;font-size:13px;box-shadow:0 2px 10px rgba(20,40,70,.07)}",
    ".sd-top{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 14px;background:#eef3fb;border-bottom:1px solid #dbe4f0}",
    ".sd-top .sd-ic{font-size:18px}.sd-top .sd-h{font-weight:800;color:var(--sd-navy);font-size:14px}.sd-top .sd-sub{color:#5a6b80;font-size:12px}",
    ".sd-tabs{display:flex;gap:6px;flex-wrap:wrap;padding:10px 14px 0}",
    ".sd-tab{border:1px solid #cdd8e8;background:#fff;color:#33485f;border-radius:8px 8px 0 0;padding:7px 13px;font-weight:700;font-size:12.5px;cursor:pointer;border-bottom:none}",
    ".sd-tab.on{background:var(--sd-navy);color:#fff;border-color:var(--sd-navy)}",
    ".sd-tab.soon{opacity:.55;cursor:not-allowed}",
    ".sd-tab .b{display:block;font-size:10px;font-weight:600;opacity:.85}",
    /* tuto */
    ".sd-tuto{margin:14px 14px 0;background:#fff7e9;border:1px solid #f0d9ad;border-radius:10px;overflow:hidden}",
    ".sd-tuto>summary{cursor:pointer;list-style:none;padding:10px 14px;font-weight:800;color:#9a6a12;display:flex;align-items:center;gap:8px}",
    ".sd-tuto>summary::-webkit-details-marker{display:none}",
    ".sd-tuto[open]>summary{border-bottom:1px solid #f0d9ad}",
    ".sd-tuto ol{margin:10px 14px 12px 30px;color:#5a4a25;line-height:1.6}.sd-tuto li{margin:3px 0}",
    ".sd-tuto .lien{margin:0 14px 12px;color:#6b5320;font-size:12px}",
    ".sd-panes{display:flex;gap:14px;padding:14px;align-items:flex-start;flex-wrap:wrap}",
    ".sd-pane{flex:1 1 340px;min-width:300px}.sd-pane.wide{flex:2 1 520px}",
    ".sd-pane>.sd-cap{font-weight:800;color:var(--sd-navy);font-size:12px;letter-spacing:.4px;text-transform:uppercase;margin:0 0 8px}",
    ".sd-card{background:#fff;border:1px solid #d3dcea;border-radius:10px;padding:12px}",
    ".sd-src .row{display:flex;justify-content:space-between;gap:10px;padding:4px 0;border-bottom:1px dashed #e7edf5}.sd-src .row:last-child{border-bottom:none}",
    ".sd-src .k{color:#5a6b80}.sd-src .v{font-weight:700;color:#27384a;text-align:right;white-space:nowrap}",
    ".sd-src .sec{font-weight:800;color:var(--sd-navy);font-size:11px;text-transform:uppercase;letter-spacing:.3px;margin:8px 0 2px}",
    ".sd-tbl{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px}",
    ".sd-tbl th{background:#f0f4fa;color:#34506e;text-align:left;padding:6px 8px;border:1px solid #dbe4f0;font-weight:700}",
    ".sd-tbl td{padding:6px 8px;border:1px solid #e3eaf3}.sd-tbl td.num,.sd-tbl th.num{text-align:right;white-space:nowrap}",
    ".sd-tbl tr.tot td{background:#eef4fb;font-weight:800;color:var(--sd-navy)}",
    ".sd-note{color:#8a97a6;font-size:11.5px;margin-top:8px}",
    /* formulaire officiel */
    ".cf{border:1px solid #b9c6d6;background:#fff;border-radius:6px;overflow:hidden}",
    /* en-tête Marianne / République Française */
    ".cf-mh{display:flex;align-items:stretch;border-bottom:2px solid #000a8c;padding:8px 10px;gap:10px}",
    ".cf-mar{min-width:96px;text-align:center;font-size:8.5px;color:#1c2733;line-height:1.15}",
    ".cf-mar .bb{display:block;height:8px;border-radius:1px;background:linear-gradient(90deg,#000091 0 33%,#fff 33% 66%,#e1000f 66% 100%);margin:0 0 3px;border:1px solid #d7dde8}",
    ".cf-mar .rf{font-weight:800;font-size:10px}.cf-mar .dev{font-style:italic;color:#5a6b80}",
    ".cf-mh .ti{flex:1;text-align:center}",
    ".cf-mh .ti .t{font-weight:800;color:#1c2733;font-size:13px}.cf-mh .ti .s{font-size:10px;color:#5a6b80;margin-top:2px}",
    ".cf-mh .no{text-align:right;min-width:74px}.cf-mh .no .cer{font-style:italic;font-weight:800;color:#1c2733;font-size:15px}.cf-mh .no .n{font-size:9.5px;color:#5a6b80}",
    /* en-tête DGFiP (forms anciens : DAS2) */
    ".cf-h{display:flex;align-items:stretch;border-bottom:2px solid var(--sd-navy)}",
    ".cf-logo{font-style:italic;font-weight:800;color:var(--sd-navy);font-size:17px;padding:8px 12px;display:flex;align-items:center;border-right:1px solid #d7e0ec}",
    ".cf-htxt{flex:1;padding:6px 10px;text-align:center}",
    ".cf-dgfip{background:var(--sd-navy);color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.3px;display:inline-block;padding:2px 8px;border-radius:3px;margin-bottom:3px}",
    ".cf-title{font-weight:800;color:#1c2733;font-size:12.5px;line-height:1.25}",
    ".cf-art{font-size:9.5px;color:#5a6b80;border:1px solid #cfd8e3;border-radius:4px;display:inline-block;padding:1px 6px;margin-top:3px}",
    ".cf-no{padding:6px 10px;text-align:right;border-left:1px solid #d7e0ec;min-width:78px}.cf-no .nb{font-size:9.5px;color:#5a6b80}.cf-no .form{font-weight:800;color:#1c2733;font-size:15px}.cf-no .dt{font-size:9.5px;color:#5a6b80}",
    ".cf-souscrire{font-size:9.5px;color:#5a6b80;text-align:center;padding:3px 8px;border-bottom:1px solid #e3eaf3}",
    /* sections */
    ".cf-sec{border-top:1px solid #e3eaf3}",
    ".cf-st{background:#eef3fb;color:#27384a;font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:.3px;padding:5px 10px;border-bottom:1px solid #e3eaf3}",
    ".cf-cols{display:flex;gap:0;flex-wrap:wrap}.cf-cols>.cf-col{flex:1 1 240px;min-width:220px;border-right:1px solid #eef1f6}.cf-cols>.cf-col:last-child{border-right:none}",
    ".cf-body{padding:8px 10px}",
    ".cf-line{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:5px 0}",
    ".cf-lab{color:#34506e;font-size:11.5px;flex:1;min-width:90px}",
    ".cf-code{font-weight:800;color:#1F4E78;font-size:10px;background:#eef4fb;border:1px solid #cfd8e3;border-radius:4px;padding:1px 5px}",
    ".cf-in{border:1px solid #c4cfdd;border-radius:4px;padding:4px 7px;font:inherit;font-size:12px;color:#1c2733;background:#fffdf5}",
    ".cf-in:focus{outline:none;border-color:var(--sd-accent);box-shadow:0 0 0 2px rgba(232,161,58,.2)}",
    ".cf-in.grow{flex:1;min-width:120px}.cf-in[readonly]{background:#f4f7fb;color:#34506e}",
    ".cf-boxes{display:flex;gap:3px}.cf-box{width:20px;height:24px;text-align:center;border:1px solid #c4cfdd;border-radius:3px;font:inherit;font-weight:700;color:#1c2733;background:#fffdf5;padding:0}.cf-box[readonly]{background:#f4f7fb}",
    ".cf-eur{display:inline-flex;align-items:center;gap:3px}",
    ".cf-fill{border:1px solid #c4cfdd;border-radius:4px;padding:4px 6px;font:inherit;font-size:12px;width:110px;background:#fffdf5;color:#1c2733;text-align:right}",
    ".cf-fill.wide{width:100%}",
    ".cf-fill.ok{border-color:#1f8a4c;background:#eafaf0;box-shadow:0 0 0 1px #1f8a4c}",
    ".cf-fill.ko{border-color:#c0392b;background:#fdecea;box-shadow:0 0 0 1px #c0392b}",
    ".cf-tbl{width:100%;border-collapse:collapse;margin:4px 0;font-size:11.5px}",
    ".cf-tbl th{background:#f0f4fa;border:1px solid #d7e0ec;padding:4px 6px;color:#34506e;font-weight:700;text-align:center}",
    ".cf-tbl td{border:1px solid #e3eaf3;padding:4px 6px;vertical-align:middle}",
    ".cf-chk{display:flex;align-items:center;gap:7px;font-size:11.5px;color:#27384a;margin:4px 0}",
    ".cf-hint{cursor:help;color:#5a6b80;border:1px solid #cfd8e3;border-radius:50%;width:15px;height:15px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700}",
    /* actions */
    ".sd-act{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;padding:0 14px 14px;align-items:center}",
    ".sd-msg{margin-right:auto;font-weight:700;font-size:12.5px}.sd-msg.ok{color:#1f8a4c}.sd-msg.ko{color:#c0392b}",
    ".sd-btn{border:1px solid #cdd8e8;background:#fff;color:#27384a;border-radius:8px;padding:8px 14px;font-weight:700;font-size:12.5px;cursor:pointer}.sd-btn:hover{border-color:var(--sd-navy)}",
    ".sd-btn.primary{background:var(--sd-accent);border-color:var(--sd-accent);color:#1c2733}",
    ".sd-soonbox{padding:26px 14px;text-align:center;color:#5a6b80;background:#fff;border:1px dashed #cdd8e8;border-radius:10px;margin:0 14px 14px}",
    "@media(max-width:760px){.sd-panes{flex-direction:column}.sd-tab .b{display:none}}"
  ].join("");
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  /* ---------- Helpers ---------- */
  function esc(t){ return (t==null?"":""+t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function escA(t){ return esc(t).replace(/"/g,"&quot;"); }
  function eur(n){ return Number(n).toLocaleString("fr-FR",{minimumFractionDigits:0,maximumFractionDigits:0}) + " €"; }
  function eur2(n){ return Number(n).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2}) + " €"; }
  function num(s){ if(s==null) return NaN; var t=(""+s).replace(/ /g,"").replace(/[€\s]/g,"").replace(/\./g,"").replace(/,/g,"."); return parseFloat(t); }
  function fill(key, expect, opts){ opts=opts||{}; return "<input class='cf-fill "+(opts.cls||"")+"' data-key='"+escA(key)+"' data-expect='"+escA(expect)+"' data-type='"+(opts.type||"num")+"' placeholder='"+escA(opts.ph||"…")+"'>"; }
  function hint(t){ return "<span class='cf-hint' title='"+escA(t)+"'>?</span>"; }
  function code(c){ return "<span class='cf-code'>"+esc(c)+"</span>"; }
  function boxes(str, roFlag){ var s=""+str,h="<span class='cf-boxes'>"; for(var i=0;i<s.length;i++) h+="<input class='cf-box' "+(roFlag?"readonly":"")+" maxlength='1' value='"+escA(s[i])+"'>"; return h+"</span>"; }
  function ro(val, cls){ return "<input class='cf-in "+(cls||"")+"' readonly value='"+escA(val)+"'>"; }
  function eurIn(html){ return "<span class='cf-eur'>"+html+"<span style='color:#5a6b80'>€</span></span>"; }
  function marianne(title, subtitle, cerfaNo){
    return "<div class='cf-mh'><div class='cf-mar'><span class='bb'></span><span class='rf'>RÉPUBLIQUE FRANÇAISE</span><span class='dev'>Liberté · Égalité · Fraternité</span></div>"
      + "<div class='ti'><div class='t'>"+esc(title)+"</div>"+(subtitle?"<div class='s'>"+esc(subtitle)+"</div>":"")+"</div>"
      + "<div class='no'><div class='cer'>cerfa</div><div class='n'>"+esc(cerfaNo)+"</div></div></div>";
  }
  function sec(titre, inner){ return "<div class='cf-sec'><div class='cf-st'>"+esc(titre)+"</div><div class='cf-body'>"+inner+"</div></div>"; }
  function lineFill(lab, c, key, expect, opts){ return "<div class='cf-line'><span class='cf-lab'>"+esc(lab)+"</span>"+(c?code(c):"")+eurIn(fill(key,expect,opts))+"</div>"; }
  function lineRO(lab, c, val){ return "<div class='cf-line'><span class='cf-lab'>"+esc(lab)+"</span>"+(c?code(c):"")+eurIn(ro(eur(val).replace(' €',''),"")+"")+"</div>"; }

  /* =====================================================================
     CAS 1 — DAS2 (honoraires versés à des tiers) — entreprise du bâtiment
     ===================================================================== */
  var DAS2 = {
    ent:{denom:"BÂTI SERVICES SARL",siren:"458789123",adr:"45 rue de la Construction",cp:"75012",ville:"PARIS",contact:"Rindra M.",tel:"01 42 33 44 55",mail:"contact@batiservices.fr",sign:"Rindra M., Gérant"},
    benef:[{nom:"Cabinet Expertis",nat:"Honoraires d'expertise comptable",siren:"349123456",ttc:18000},
           {nom:"Maître Dupont",nat:"Honoraires juridiques",siren:"307456789",ttc:5400},
           {nom:"Agence Communication",nat:"Prestations de communication",siren:"478963258",ttc:7200}],
    seuil:2400
  };
  DAS2.aDecl=DAS2.benef.filter(function(b){return b.ttc>=DAS2.seuil;});
  DAS2.total=DAS2.aDecl.reduce(function(s,b){return s+b.ttc;},0);
  function srcDAS2(){
    var e=DAS2.ent, rows=DAS2.benef.map(function(b){return "<tr><td>"+esc(b.nom)+"</td><td>"+esc(b.nat)+"</td><td>"+esc(b.siren)+"</td><td class='num'>"+eur(b.ttc)+"</td></tr>";}).join("");
    return "<div class='sd-card sd-src'><div class='row'><span class='k'>Dénomination</span><span class='v'>"+esc(e.denom)+"</span></div>"
      +"<div class='row'><span class='k'>SIREN</span><span class='v'>"+esc(e.siren.replace(/(\d{3})(\d{3})(\d{3})/,"$1 $2 $3"))+"</span></div>"
      +"<div class='row'><span class='k'>Adresse</span><span class='v'>"+esc(e.adr+", "+e.cp+" "+e.ville)+"</span></div></div>"
      +"<p class='sd-cap' style='margin:14px 0 6px'>Honoraires, commissions et courtages versés (année N)</p>"
      +"<table class='sd-tbl'><thead><tr><th>Bénéficiaire</th><th>Nature</th><th>SIREN</th><th class='num'>Montant TTC</th></tr></thead><tbody>"+rows
      +"<tr class='tot'><td colspan='3'>Total à déclarer</td><td class='num'>"+eur(DAS2.total)+"</td></tr></tbody></table>"
      +"<p class='sd-note'>💡 Seuil DAS2 : déclarer les bénéficiaires ayant reçu <b>2 400 € ou plus</b> sur l'année.</p>";
  }
  function formDAS2(){
    var e=DAS2.ent, h="<div class='cf'>";
    h+="<div class='cf-h'><div class='cf-logo'>cerfa</div><div class='cf-htxt'><span class='cf-dgfip'>DIRECTION GÉNÉRALE DES FINANCES PUBLIQUES</span><div class='cf-title'>DÉCLARATION DES HONORAIRES, COMMISSIONS ET COURTAGES VERSÉS À DES TIERS</div><span class='cf-art'>art. 240, 242 ter du CGI</span></div><div class='cf-no'><div class='nb'>N° 11716*24</div><div class='form'>DAS2</div><div class='dt'>(01/2024)</div></div></div>";
    h+="<div class='cf-sec'><div class='cf-st'>A · Votre identification</div><div class='cf-body'>"
      +"<div class='cf-line'><span class='cf-lab'>SIREN</span>"+boxes(e.siren,true)+"</div>"
      +"<div class='cf-line'><span class='cf-lab'>Dénomination</span>"+ro(e.denom,"grow")+"</div>"
      +"<div class='cf-line'><span class='cf-lab'>Adresse</span>"+ro(e.adr,"grow")+"</div>"
      +"<div class='cf-line'><span class='cf-lab'>Code postal</span>"+boxes(e.cp,true)+"<span class='cf-lab'>Ville</span>"+ro(e.ville,"grow")+"</div></div></div>";
    h+="<div class='cf-sec'><div class='cf-st'>B · Personne à contacter</div><div class='cf-body'>"
      +"<div class='cf-line'><span class='cf-lab'>Nom</span>"+ro(e.contact,"grow")+"<span class='cf-lab'>Tél.</span>"+ro(e.tel)+"</div>"
      +"<div class='cf-line'><span class='cf-lab'>Courriel</span>"+ro(e.mail,"grow")+"</div></div></div>";
    h+="<div class='cf-sec'><div class='cf-st'>C · Déclaration des sommes versées</div><div class='cf-body'>"
      +"<table class='cf-tbl'><thead><tr><th style='text-align:left'>Nature des sommes</th><th>Nombre de bénéficiaires "+hint("Bénéficiaires ≥ 2 400 € sur l'année.")+"</th><th>Montant total TTC "+hint("Somme des montants TTC à déclarer.")+"</th></tr></thead><tbody>"
      +"<tr><td>1° Honoraires, commissions, courtages (art. 242 ter)</td><td style='text-align:center'>"+fill("nb",DAS2.aDecl.length,{cls:"wide"})+"</td><td>"+eurIn(fill("montant",DAS2.total,{cls:"wide"}))+"</td></tr></tbody></table></div></div>";
    h+="<div class='cf-sec'><div class='cf-st'>D · Attestation</div><div class='cf-body'><div class='cf-chk'><input type='checkbox' checked disabled> J'atteste l'exactitude des renseignements.</div>"
      +"<div class='cf-line'><span class='cf-lab'>À</span>"+ro(e.ville)+"<span class='cf-lab'>Le</span>"+ro("15/01/2025")+"<span class='cf-lab'>Signataire</span>"+ro(e.sign,"grow")+"</div></div></div>";
    return h+"</div>";
  }

  /* =====================================================================
     CAS 2 — LIASSE FISCALE : Réel normal (2058-A) — société à l'IS
     ===================================================================== */
  var RN = {
    ex:"2024", denom:"SAS ATLAS INDUSTRIE", siret:"81234567800015", naf:"2562B", cloture:"31/12/2024",
    comptable:85000,
    reint:[{lib:"Charges non déductibles (amendes, pénalités…)",v:7500},{lib:"Amortissements excédentaires véhicules de tourisme",v:2000}],
    deduc:[{lib:"Quote-part de +values long terme / mère-fille",v:4300}],
    immoBrut:1250000, immoAmort:512000,
    dotAmort:38000, provDebut:18000, provDot:12000, provReprise:6000,
    creances:120000, dettesF:85000
  };
  RN.totReint=RN.reint.reduce(function(s,x){return s+x.v;},0);
  RN.totDeduc=RN.deduc.reduce(function(s,x){return s+x.v;},0);
  RN.fiscal=RN.comptable+RN.totReint-RN.totDeduc;
  RN.immoNet=RN.immoBrut-RN.immoAmort;
  RN.provFin=RN.provDebut+RN.provDot-RN.provReprise;
  function srcRN(){
    var r=RN, reint=r.reint.map(function(x){return "<div class='row'><span class='k'>↳ "+esc(x.lib)+"</span><span class='v'>"+eur(x.v)+"</span></div>";}).join("");
    var deduc=r.deduc.map(function(x){return "<div class='row'><span class='k'>↳ "+esc(x.lib)+"</span><span class='v'>"+eur(x.v)+"</span></div>";}).join("");
    return "<div class='sd-card sd-src'>"
      +"<div class='row'><span class='k'>Exercice</span><span class='v'>01/01/"+esc(r.ex)+" → "+esc(r.cloture)+"</span></div>"
      +"<div class='row'><span class='k'>Entreprise</span><span class='v'>"+esc(r.denom)+"</span></div>"
      +"<div class='row'><span class='k'>SIRET</span><span class='v'>"+esc(r.siret)+"</span></div>"
      +"<div class='sec'>Résultat & retraitements</div>"
      +"<div class='row'><span class='k'><b>Résultat comptable (avant impôt)</b></span><span class='v'>"+eur(r.comptable)+"</span></div>"
      +"<div class='row'><span class='k'><b>Réintégrations (+)</b></span><span class='v'>"+eur(r.totReint)+"</span></div>"+reint
      +"<div class='row'><span class='k'><b>Déductions (−)</b></span><span class='v'>"+eur(r.totDeduc)+"</span></div>"+deduc
      +"<div class='sec'>Postes du bilan (annexes)</div>"
      +"<div class='row'><span class='k'>Immobilisations brutes / amort.</span><span class='v'>"+eur(r.immoBrut)+" / "+eur(r.immoAmort)+"</span></div>"
      +"<div class='row'><span class='k'>Dotations amort. de l'exercice</span><span class='v'>"+eur(r.dotAmort)+"</span></div>"
      +"<div class='row'><span class='k'>Provisions : début / dot. / reprise</span><span class='v'>"+eur(r.provDebut)+" / "+eur(r.provDot)+" / "+eur(r.provReprise)+"</span></div>"
      +"<div class='row'><span class='k'>Créances clients / Dettes fournisseurs</span><span class='v'>"+eur(r.creances)+" / "+eur(r.dettesF)+"</span></div>"
      +"</div><p class='sd-note'>💡 Ces données alimentent la liasse selon le régime choisi.</p>";
  }
  function formRN(){
    var r=RN, h="<div class='cf'>";
    h+=marianne("DÉTERMINATION DU RÉSULTAT FISCAL", "Régime réel normal — liasse 2050 à 2059", "N° 2058-A");
    // I + II
    h+="<div class='cf-cols'>"
      +"<div class='cf-col'><div class='cf-st'>I · Détermination du résultat fiscal</div><div class='cf-body'>"
        +lineRO("Résultat comptable (bénéfice/déficit)","WA",r.comptable)
        +lineFill("Réintégrations","WB","wb",r.totReint,{ph:"…"})
        +lineFill("Déductions","WC","wc",r.totDeduc,{ph:"…"})
        +"<div class='cf-line' style='border-top:1px dashed #cfd8e3;padding-top:7px;margin-top:7px'><span class='cf-lab'><b>RÉSULTAT FISCAL</b></span>"+code("WD")+eurIn(fill("wd",r.fiscal,{ph:"= WA+WB−WC"}))+"</div>"
      +"</div></div>"
      +"<div class='cf-col'><div class='cf-st'>II · Affectation du résultat</div><div class='cf-body'>"
        +lineFill("Bénéfice imposable","XE","xe",r.fiscal,{ph:"…"})
        +lineRO("Déficit reportable","XD",0)
        +lineRO("Plus-values long terme","XR",0)
        +lineRO("Réserves exonérées","ZS",0)
      +"</div></div></div>";
    // III-VI (lecture, façon liasse complète)
    h+="<div class='cf-cols'>"
      +"<div class='cf-col'><div class='cf-st'>III · Immobilisations</div><div class='cf-body'>"+lineRO("Valeur brute","",r.immoBrut)+lineRO("Amortissements","",r.immoAmort)+lineRO("Valeur nette","",r.immoNet)+"</div></div>"
      +"<div class='cf-col'><div class='cf-st'>IV · Amortissements</div><div class='cf-body'>"+lineRO("Dotations de l'exercice","",r.dotAmort)+"</div></div>"
      +"<div class='cf-col'><div class='cf-st'>V · Provisions</div><div class='cf-body'>"+lineRO("Au début","",r.provDebut)+lineRO("Dotations","",r.provDot)+lineRO("Reprises","",r.provReprise)+lineRO("À la fin","",r.provFin)+"</div></div>"
      +"<div class='cf-col'><div class='cf-st'>VI · Créances / Dettes</div><div class='cf-body'>"+lineRO("Créances clients","",r.creances)+lineRO("Dettes fournisseurs","",r.dettesF)+"</div></div>"
      +"</div>";
    return h+"</div>";
  }

  /* =====================================================================
     CAS 3 — LIASSE BNC : Déclaration contrôlée (2035) — profession libérale
     ===================================================================== */
  var BNC = {
    ex:"2024", denom:"CABINET ARCHITECTURE DESIGN", adr:"15 rue de la Paix, 75002 Paris", siret:"81234567800015", naf:"7111Z", duree:"12", cloture:"31/12/2024",
    rec:{enc:85000, subv:0, autres:0},
    chg:[{lib:"Achats",code:"AE",v:5600},{lib:"Services extérieurs",code:"AF",v:12800},{lib:"Autres services extérieurs",code:"AG",v:8900},{lib:"Impôts, taxes et versements assimilés",code:"AH",v:1200},{lib:"Charges de personnel",code:"AI",v:8500},{lib:"Autres charges",code:"AJ",v:4100},{lib:"Dotations aux amortissements",code:"AK",v:5200}],
    amort:[{nat:"Matériel informatique",deb:12000,dot:2400,fin:9600},{nat:"Mobilier de bureau",deb:7000,dot:2800,fin:4200}]
  };
  BNC.totRec=BNC.rec.enc+BNC.rec.subv+BNC.rec.autres;
  BNC.totChg=BNC.chg.reduce(function(s,x){return s+x.v;},0);
  BNC.benef=BNC.totRec-BNC.totChg;
  BNC.totDot=BNC.amort.reduce(function(s,x){return s+x.dot;},0);
  function srcBNC(){
    var b=BNC, chg=b.chg.map(function(x){return "<div class='row'><span class='k'>"+esc(x.lib)+"</span><span class='v'>"+eur(x.v)+"</span></div>";}).join("");
    return "<div class='sd-card sd-src'>"
      +"<div class='row'><span class='k'>Profession</span><span class='v'>Architecte (BNC)</span></div>"
      +"<div class='row'><span class='k'>Cabinet</span><span class='v'>"+esc(b.denom)+"</span></div>"
      +"<div class='row'><span class='k'>Exercice clos</span><span class='v'>"+esc(b.cloture)+"</span></div>"
      +"<div class='sec'>Recettes encaissées (caisse)</div>"
      +"<div class='row'><span class='k'><b>Recettes encaissées</b></span><span class='v'>"+eur(b.rec.enc)+"</span></div>"
      +"<div class='sec'>Dépenses payées par nature</div>"+chg
      +"<div class='row'><span class='k'><b>Total des charges</b></span><span class='v'>"+eur(b.totChg)+"</span></div>"
      +"<div class='sec'>Amortissements (dotations)</div>"
      +b.amort.map(function(x){return "<div class='row'><span class='k'>"+esc(x.nat)+"</span><span class='v'>"+eur(x.dot)+"</span></div>";}).join("")
      +"</div><p class='sd-note'>💡 BNC = comptabilité de <b>caisse</b> : recettes <b>encaissées</b> et dépenses <b>payées</b> dans l'année.</p>";
  }
  function formBNC(){
    var b=BNC, h="<div class='cf'>";
    h+=marianne("DÉCLARATION DES BÉNÉFICES NON COMMERCIAUX","Régime de la déclaration contrôlée — art. 34 ou 92 du CGI","N° 2035");
    h+="<div class='cf-sec'><div class='cf-st'>1 · Renseignements généraux</div><div class='cf-body'>"
      +"<div class='cf-line'><span class='cf-lab'>Désignation</span>"+ro(b.denom,"grow")+"</div>"
      +"<div class='cf-line'><span class='cf-lab'>Adresse</span>"+ro(b.adr,"grow")+"</div>"
      +"<div class='cf-line'><span class='cf-lab'>SIRET</span>"+ro(b.siret)+"<span class='cf-lab'>Code NAF</span>"+ro(b.naf)+"</div>"
      +"<div class='cf-line'><span class='cf-lab'>Durée (mois)</span>"+ro(b.duree)+"<span class='cf-lab'>Clôture</span>"+ro(b.cloture)+"</div></div></div>";
    h+="<div class='cf-cols'>"
      +"<div class='cf-col'><div class='cf-st'>2 · Récapitulation des recettes</div><div class='cf-body'>"
        +lineFill("Recettes encaissées","AA","aa",b.rec.enc,{ph:"…"})+lineRO("Subventions d'exploitation","AB",b.rec.subv)+lineRO("Autres produits","AC",b.rec.autres)
        +"<div class='cf-line' style='border-top:1px dashed #cfd8e3;padding-top:7px;margin-top:7px'><span class='cf-lab'><b>TOTAL DES RECETTES</b></span>"+code("AD")+eurIn(fill("ad",b.totRec,{ph:"…"}))+"</div></div></div>"
      +"<div class='cf-col'><div class='cf-st'>3 · Récapitulation des charges</div><div class='cf-body'>"
        +b.chg.map(function(x){return lineRO(x.lib,x.code,x.v);}).join("")
        +"<div class='cf-line' style='border-top:1px dashed #cfd8e3;padding-top:7px;margin-top:7px'><span class='cf-lab'><b>TOTAL DES CHARGES</b></span>"+code("AL")+eurIn(fill("al",b.totChg,{ph:"…"}))+"</div></div></div></div>";
    h+="<div class='cf-cols'>"
      +"<div class='cf-col'><div class='cf-st'>4 · Détermination du résultat</div><div class='cf-body'>"
        +lineFill("Total des recettes (report AD)","AM","am",b.totRec,{ph:"…"})+lineFill("Total des charges (report AL)","AN","an",b.totChg,{ph:"…"})+lineFill("Bénéfice (AM − AN)","AO","ao",b.benef,{ph:"…"})+lineRO("Déficit (AN − AM)","AP",0)
        +"<div class='cf-line' style='border-top:1px dashed #cfd8e3;padding-top:7px;margin-top:7px'><span class='cf-lab'><b>RÉSULTAT FISCAL (→ 2042-C-PRO)</b></span>"+code("AQ")+eurIn(fill("aq",b.benef,{ph:"…"}))+"</div></div></div>"
      +"<div class='cf-col'><div class='cf-st'>5 · Détail des amortissements</div><div class='cf-body'><table class='cf-tbl'><thead><tr><th style='text-align:left'>Nature</th><th>Début</th><th>Dotation</th><th>Fin</th></tr></thead><tbody>"
        +b.amort.map(function(x){return "<tr><td>"+esc(x.nat)+"</td><td style='text-align:right'>"+eur(x.deb)+"</td><td style='text-align:right'>"+eur(x.dot)+"</td><td style='text-align:right'>"+eur(x.fin)+"</td></tr>";}).join("")
        +"<tr><td colspan='2' style='text-align:right;font-weight:700'>TOTAL dotations</td><td style='text-align:right;font-weight:700'>"+eur(b.totDot)+"</td><td></td></tr></tbody></table></div></div></div>";
    return h+"</div>";
  }

  /* ===== LIASSE — Réel simplifié (2033-B) — BIC ===== */
  var RS={ ex:"2024", denom:"SARL PETIT NÉGOCE", siret:"81234567800099", cloture:"31/12/2024", comptable:35000,
    reint:[{lib:"Charges non déductibles (amendes, TVS…)",v:2000},{lib:"Amortissement excédentaire VP",v:1000}],
    deduc:[{lib:"Quote-part de +values long terme",v:1000}] };
  RS.totReint=RS.reint.reduce(function(s,x){return s+x.v;},0); RS.totDeduc=RS.deduc.reduce(function(s,x){return s+x.v;},0); RS.fiscal=RS.comptable+RS.totReint-RS.totDeduc;
  function srcRS(){ var r=RS;
    return "<div class='sd-card sd-src'>"
      +"<div class='row'><span class='k'>Exercice</span><span class='v'>01/01/"+esc(r.ex)+" → "+esc(r.cloture)+"</span></div>"
      +"<div class='row'><span class='k'>Entreprise</span><span class='v'>"+esc(r.denom)+"</span></div>"
      +"<div class='sec'>Résultat & retraitements</div>"
      +"<div class='row'><span class='k'><b>Résultat comptable</b></span><span class='v'>"+eur(r.comptable)+"</span></div>"
      +"<div class='row'><span class='k'><b>Réintégrations (+)</b></span><span class='v'>"+eur(r.totReint)+"</span></div>"
      +r.reint.map(function(x){return "<div class='row'><span class='k'>↳ "+esc(x.lib)+"</span><span class='v'>"+eur(x.v)+"</span></div>";}).join("")
      +"<div class='row'><span class='k'><b>Déductions (−)</b></span><span class='v'>"+eur(r.totDeduc)+"</span></div>"
      +r.deduc.map(function(x){return "<div class='row'><span class='k'>↳ "+esc(x.lib)+"</span><span class='v'>"+eur(x.v)+"</span></div>";}).join("")
      +"</div><p class='sd-note'>💡 Réel simplifié : un seul tableau (2033-B) regroupe résultat comptable et passage au fiscal.</p>";
  }
  function formRS(){ var r=RS, h="<div class='cf'>";
    h+=marianne("RÉSULTAT FISCAL — RÉGIME RÉEL SIMPLIFIÉ","Liasse 2033-A à 2033-G","N° 2033-B");
    h+="<div class='cf-sec'><div class='cf-st'>Détermination du résultat fiscal</div><div class='cf-body'>"
      +lineRO("Résultat comptable (bénéfice/déficit)","",r.comptable)
      +lineFill("Réintégrations (+)","","rsreint",r.totReint,{ph:"…"})
      +lineFill("Déductions (−)","","rsded",r.totDeduc,{ph:"…"})
      +"<div class='cf-line' style='border-top:1px dashed #cfd8e3;padding-top:7px;margin-top:7px'><span class='cf-lab'><b>RÉSULTAT FISCAL</b></span>"+eurIn(fill("rsfiscal",r.fiscal,{ph:"= comptable + réint − déduc"}))+"</div>"
      +"</div></div>";
    return h+"</div>";
  }

  /* ===== LIASSE — Agricole (2139) — BA ===== */
  var BA={ ex:"2024", denom:"EARL DU VAL FLEURI", cloture:"31/12/2024",
    prod:[{lib:"Ventes de récoltes / animaux",v:110000},{lib:"Aides PAC (subventions)",v:10000}],
    chg:[{lib:"Achats (semences, aliments, engrais…)",v:60000},{lib:"Charges externes (carburant, entretien…)",v:20000},{lib:"Charges de personnel",v:8000},{lib:"Dotations aux amortissements",v:7000}] };
  BA.totProd=BA.prod.reduce(function(s,x){return s+x.v;},0); BA.totChg=BA.chg.reduce(function(s,x){return s+x.v;},0); BA.fiscal=BA.totProd-BA.totChg;
  function srcBA(){ var b=BA;
    return "<div class='sd-card sd-src'>"
      +"<div class='row'><span class='k'>Exploitation</span><span class='v'>"+esc(b.denom)+"</span></div>"
      +"<div class='row'><span class='k'>Exercice clos</span><span class='v'>"+esc(b.cloture)+"</span></div>"
      +"<div class='sec'>Produits</div>"+b.prod.map(function(x){return "<div class='row'><span class='k'>"+esc(x.lib)+"</span><span class='v'>"+eur(x.v)+"</span></div>";}).join("")
      +"<div class='sec'>Charges</div>"+b.chg.map(function(x){return "<div class='row'><span class='k'>"+esc(x.lib)+"</span><span class='v'>"+eur(x.v)+"</span></div>";}).join("")
      +"</div><p class='sd-note'>💡 Bénéfices agricoles (réel simplifié) : produits − charges = résultat fiscal BA (imposé à l'IR, ou IS si société).</p>";
  }
  function formBA(){ var b=BA, h="<div class='cf'>";
    h+=marianne("BÉNÉFICES AGRICOLES — RÉEL SIMPLIFIÉ","Liasse agricole 2139-A / 2139-B","N° 2139");
    h+="<div class='cf-cols'>"
      +"<div class='cf-col'><div class='cf-st'>Produits</div><div class='cf-body'>"
        +b.prod.map(function(x){return lineRO(x.lib,"",x.v);}).join("")
        +"<div class='cf-line' style='border-top:1px dashed #cfd8e3;padding-top:7px;margin-top:7px'><span class='cf-lab'><b>TOTAL PRODUITS</b></span>"+eurIn(fill("baprod",b.totProd,{ph:"…"}))+"</div></div></div>"
      +"<div class='cf-col'><div class='cf-st'>Charges</div><div class='cf-body'>"
        +b.chg.map(function(x){return lineRO(x.lib,"",x.v);}).join("")
        +"<div class='cf-line' style='border-top:1px dashed #cfd8e3;padding-top:7px;margin-top:7px'><span class='cf-lab'><b>TOTAL CHARGES</b></span>"+eurIn(fill("bachg",b.totChg,{ph:"…"}))+"</div></div></div></div>";
    h+="<div class='cf-sec'><div class='cf-st'>Résultat</div><div class='cf-body'><div class='cf-line'><span class='cf-lab'><b>RÉSULTAT FISCAL BA (produits − charges)</b></span>"+eurIn(fill("bafiscal",b.fiscal,{ph:"…"}))+"</div></div></div>";
    return h+"</div>";
  }

  /* ===== SCI à l'IR — revenus fonciers (2072) ===== */
  var SCI={ ex:"2024", denom:"SCI LES TILLEULS", cloture:"31/12/2024", loyers:24000,
    chg:[{lib:"Intérêts d'emprunt",v:5000},{lib:"Travaux d'entretien & réparation",v:2500},{lib:"Taxe foncière",v:1500}], associes:2 };
  SCI.totChg=SCI.chg.reduce(function(s,x){return s+x.v;},0); SCI.resultat=SCI.loyers-SCI.totChg; SCI.quote=Math.round(SCI.resultat/SCI.associes);
  function srcSCI(){ var s=SCI;
    return "<div class='sd-card sd-src'>"
      +"<div class='row'><span class='k'>Société</span><span class='v'>"+esc(s.denom)+" (SCI à l'IR)</span></div>"
      +"<div class='row'><span class='k'>Exercice</span><span class='v'>"+esc(s.cloture)+"</span></div>"
      +"<div class='row'><span class='k'>Associés</span><span class='v'>"+s.associes+" (50 / 50)</span></div>"
      +"<div class='sec'>Recettes</div><div class='row'><span class='k'><b>Loyers nus encaissés</b></span><span class='v'>"+eur(s.loyers)+"</span></div>"
      +"<div class='sec'>Charges déductibles</div>"+s.chg.map(function(x){return "<div class='row'><span class='k'>"+esc(x.lib)+"</span><span class='v'>"+eur(x.v)+"</span></div>";}).join("")
      +"</div><p class='sd-note'>💡 SCI à l'IR : résultat foncier = loyers − charges (pas d'amortissement). Imposé chez chaque associé (report sur sa 2044).</p>";
  }
  function formSCI(){ var s=SCI, h="<div class='cf'>";
    h+=marianne("SCI NON SOUMISE À L'IS — REVENUS FONCIERS","Déclaration des sociétés immobilières","N° 2072");
    h+="<div class='cf-sec'><div class='cf-st'>Détermination du résultat foncier</div><div class='cf-body'>"
      +lineRO("Loyers bruts encaissés","",s.loyers)
      +lineFill("Total des charges déductibles","","scichg",s.totChg,{ph:"…"})
      +"<div class='cf-line' style='border-top:1px dashed #cfd8e3;padding-top:7px;margin-top:7px'><span class='cf-lab'><b>RÉSULTAT FONCIER (loyers − charges)</b></span>"+eurIn(fill("scires",s.resultat,{ph:"…"}))+"</div></div></div>";
    h+="<div class='cf-sec'><div class='cf-st'>Répartition entre associés</div><div class='cf-body'><div class='cf-line'><span class='cf-lab'><b>Quote-part par associé (→ 2044)</b></span>"+eurIn(fill("sciquote",s.quote,{ph:"…"}))+"</div></div></div>";
    return h+"</div>";
  }

  /* ===== MODULE 4 — Liquidation de l'IS ===== */
  var IS={ denom:"SAS ATLAS INDUSTRIE", fiscal:90200, seuil:42500 };
  IS.base15=Math.min(IS.fiscal,IS.seuil); IS.base25=Math.max(0,IS.fiscal-IS.seuil);
  IS.is15=Math.round(IS.base15*0.15); IS.is25=Math.round(IS.base25*0.25); IS.isTot=IS.is15+IS.is25;
  function srcIS(){ var r=IS;
    return "<div class='sd-card sd-src'>"
      +"<div class='row'><span class='k'>Société</span><span class='v'>"+esc(r.denom)+" (IS)</span></div>"
      +"<div class='row'><span class='k'><b>Résultat fiscal</b> (issu de la liasse)</span><span class='v'>"+eur(r.fiscal)+"</span></div>"
      +"<div class='sec'>Conditions du taux réduit (PME)</div>"
      +"<div class='row'><span class='k'>CA HT &lt; 10 M€</span><span class='v'>✅</span></div>"
      +"<div class='row'><span class='k'>Capital entièrement libéré</span><span class='v'>✅</span></div>"
      +"<div class='row'><span class='k'>Détenu ≥ 75 % par des personnes physiques</span><span class='v'>✅</span></div>"
      +"</div><p class='sd-note'>💡 IS 2026 : <b>15 %</b> jusqu'à <b>42 500 €</b> (PME éligible), puis <b>25 %</b> au-delà.</p>";
  }
  function formIS(){ var r=IS, h="<div class='cf'>";
    h+=marianne("LIQUIDATION DE L'IMPÔT SUR LES SOCIÉTÉS","Taux 2026 : 15 % jusqu'à 42 500 € (PME), 25 % au-delà","N° 2065 / 2572");
    h+="<div class='cf-sec'><div class='cf-st'>Détermination de l'IS</div><div class='cf-body'>"
      +lineRO("Résultat fiscal imposable","",r.fiscal)
      +lineFill("Base au taux réduit 15 % (≤ 42 500 €)","","is_b15",r.base15,{ph:"…"})
      +lineFill("Base au taux normal 25 % (au-delà)","","is_b25",r.base25,{ph:"…"})
      +lineFill("IS à 15 % (base × 15 %)","","is_15",r.is15,{ph:"…"})
      +lineFill("IS à 25 % (base × 25 %)","","is_25",r.is25,{ph:"…"})
      +"<div class='cf-line' style='border-top:1px dashed #cfd8e3;padding-top:7px;margin-top:7px'><span class='cf-lab'><b>IS TOTAL</b></span>"+eurIn(fill("is_tot",r.isTot,{ph:"= 15 % + 25 %"}))+"</div></div></div>";
    return h+"</div>";
  }

  /* ===== MODULE 4 — Acomptes d'IS (2571) ===== */
  var AC={ isN1:18300, isN2:12000 };
  AC.a1=Math.round(AC.isN2*0.25); AC.a2=Math.round(AC.isN1*0.5-AC.a1); AC.a3=Math.round(AC.isN1*0.25); AC.a4=AC.a3;
  function srcAC(){ var r=AC;
    return "<div class='sd-card sd-src'>"
      +"<div class='row'><span class='k'><b>IS de l'exercice N-1</b> (connu en mai)</span><span class='v'>"+eur(r.isN1)+"</span></div>"
      +"<div class='row'><span class='k'><b>IS de l'exercice N-2</b></span><span class='v'>"+eur(r.isN2)+"</span></div>"
      +"<div class='sec'>Échéances des acomptes</div>"
      +"<div class='row'><span class='k'>1er acompte</span><span class='v'>15/03</span></div>"
      +"<div class='row'><span class='k'>2e acompte</span><span class='v'>15/06</span></div>"
      +"<div class='row'><span class='k'>3e acompte</span><span class='v'>15/09</span></div>"
      +"<div class='row'><span class='k'>4e acompte</span><span class='v'>15/12</span></div>"
      +"</div><p class='sd-note'>💡 Au 15/03, l'IS N-1 n'est pas encore connu → 1er acompte calculé sur <b>N-2</b>. Au 15/06 on <b>régularise</b>.</p>";
  }
  function formAC(){ var r=AC, h="<div class='cf'>";
    h+=marianne("ACOMPTE D'IMPÔT SUR LES SOCIÉTÉS","Relevé d'acompte — 4 échéances","N° 2571");
    h+="<div class='cf-sec'><div class='cf-st'>Calcul des 4 acomptes</div><div class='cf-body'>"
      +lineFill("1er acompte (15/03) = IS N-2 × 25 %","","ac_1",r.a1,{ph:"…"})
      +lineFill("2e acompte (15/06) = (IS N-1 × 2/4) − 1er acompte","","ac_2",r.a2,{ph:"régularisation"})
      +lineFill("3e acompte (15/09) = IS N-1 × 25 %","","ac_3",r.a3,{ph:"…"})
      +lineFill("4e acompte (15/12) = IS N-1 × 25 %","","ac_4",r.a4,{ph:"…"})
      +"</div></div>";
    return h+"</div>";
  }

  /* ===== MODULE 4 — CFE ===== */
  var CFE2={ denom:"SARL PETIT NÉGOCE", vl:12000, taux:25 };
  CFE2.due=Math.round(CFE2.vl*CFE2.taux/100);
  function srcCFE(){ var r=CFE2;
    return "<div class='sd-card sd-src'>"
      +"<div class='row'><span class='k'>Entreprise</span><span class='v'>"+esc(r.denom)+"</span></div>"
      +"<div class='row'><span class='k'><b>Valeur locative des locaux</b> (N-2)</span><span class='v'>"+eur(r.vl)+"</span></div>"
      +"<div class='row'><span class='k'>Taux voté par la commune</span><span class='v'>"+r.taux+" %</span></div>"
      +"</div><p class='sd-note'>💡 CFE = valeur locative × taux communal. <b>1re année : exonérée</b> ; avis en ligne, paiement le 15/12. La CVAE est supprimée progressivement (extinction prévue 2027).</p>";
  }
  function formCFE(){ var r=CFE2, h="<div class='cf'>";
    h+=marianne("COTISATION FONCIÈRE DES ENTREPRISES","Base = valeur locative · taux communal","N° 1447-C / 1447-M");
    h+="<div class='cf-sec'><div class='cf-st'>Calcul de la CFE</div><div class='cf-body'>"
      +lineRO("Valeur locative (base)","",r.vl)
      +"<div class='cf-line'><span class='cf-lab'>Taux communal</span>"+ro(r.taux+" %")+"</div>"
      +"<div class='cf-line' style='border-top:1px dashed #cfd8e3;padding-top:7px;margin-top:7px'><span class='cf-lab'><b>CFE DUE (base × taux)</b></span>"+eurIn(fill("cfe_due",r.due,{ph:"…"}))+"</div></div></div>";
    return h+"</div>";
  }

  /* ===== MODULE 4 — Crédit d'impôt formation du dirigeant ===== */
  var CIF={ heures:40, plafond:40, smic:12 };
  CIF.ret=Math.min(CIF.heures,CIF.plafond); CIF.credit=CIF.ret*CIF.smic;
  function srcCIF(){ var r=CIF;
    return "<div class='sd-card sd-src'>"
      +"<div class='row'><span class='k'>Heures de formation du dirigeant</span><span class='v'>"+r.heures+" h</span></div>"
      +"<div class='row'><span class='k'>Plafond annuel</span><span class='v'>"+r.plafond+" h</span></div>"
      +"<div class='row'><span class='k'>SMIC horaire (à actualiser)</span><span class='v'>"+r.smic.toLocaleString('fr-FR',{minimumFractionDigits:2})+" €</span></div>"
      +"</div><p class='sd-note'>⚠️ Dispositif <b>clos au 31/12/2024</b> (heures réalisées jusqu'à cette date) — à vérifier selon l'exercice. Méthode : <b>heures (plafond 40) × SMIC horaire</b>.</p>";
  }
  function formCIF(){ var r=CIF, h="<div class='cf'>";
    h+=marianne("CRÉDIT D'IMPÔT — FORMATION DU DIRIGEANT","Heures de formation × SMIC horaire (plafond 40 h)","Annexe 2069-RCI");
    h+="<div class='cf-sec'><div class='cf-st'>Calcul du crédit d'impôt</div><div class='cf-body'>"
      +"<div class='cf-line'><span class='cf-lab'>Heures de formation</span>"+ro(r.heures+" h")+"<span class='cf-lab'>Plafond</span>"+ro(r.plafond+" h")+"</div>"
      +lineFill("Heures retenues (min heures / plafond)","","cif_ret",r.ret,{ph:"h"})
      +"<div class='cf-line' style='border-top:1px dashed #cfd8e3;padding-top:7px;margin-top:7px'><span class='cf-lab'><b>CRÉDIT D'IMPÔT (heures × SMIC horaire)</b></span>"+eurIn(fill("cif_cr",r.credit,{ph:"…"}))+"</div></div></div>";
    return h+"</div>";
  }

  /* ---------- Registre des simulations ---------- */
  var SIMS = {
    das2: {
      titre:"Pratique — Simulateur interactif", sous:"Fiscalité : remplir un formulaire officiel à partir du dossier.",
      tabs:[{id:"das2",label:"DAS2",sub:"honoraires"},{id:"iris",label:"IS",sub:"2065 / 2572"},{id:"acis",label:"Acompte IS",sub:"2571"},{id:"cfe",label:"CFE",sub:"1447"},{id:"cif",label:"Crédit formation",sub:"dirigeant"}],
      active:"das2",
      panes:{ das2:{ srcCap:"Données source", src:srcDAS2, formCap:"Formulaire officiel — DAS2 (simulation)", form:formDAS2,
        tuto:["Repérez les bénéficiaires ayant reçu <b>2 400 € ou plus</b> sur l'année (seuil DAS2).",
              "Comptez-les → renseignez le <b>nombre de bénéficiaires</b> (cadre C).",
              "Additionnez leurs montants TTC → <b>montant total versé</b>.",
              "Cliquez <b>Vérifier</b> (ou <b>Voir le corrigé</b>)."] },
        iris:{ srcCap:"Données source", src:srcIS, wide:true, formCap:"Liquidation de l'IS (2065 / 2572)", form:formIS,
          tuto:["Partez du <b>résultat fiscal</b> (issu de la liasse).",
                "Découpez la base : <b>15 %</b> jusqu'à <b>42 500 €</b>, <b>25 %</b> au-delà (PME éligible).",
                "Calculez l'IS de chaque tranche, puis l'<b>IS total</b>, et <b>Vérifier</b>."],
          lien:"Taux IS 2026 : 15 % (PME, ≤ 42 500 €) puis 25 %." },
        acis:{ srcCap:"Données source", src:srcAC, wide:true, formCap:"Acompte d'IS (2571)", form:formAC,
          tuto:["1er acompte (15/03) = <b>IS N-2 × 25 %</b> (l'IS N-1 n'est pas encore connu).",
                "2e acompte (15/06, régularisé) = <b>(IS N-1 × 2/4) − 1er acompte</b>.",
                "3e et 4e acomptes = <b>IS N-1 × 25 %</b> chacun. Puis <b>Vérifier</b>."],
          lien:"4 acomptes (2571), solde au 2572 le 15/05." },
        cfe:{ srcCap:"Données source", src:srcCFE, wide:true, formCap:"CFE (1447-C / 1447-M)", form:formCFE,
          tuto:["La CFE = <b>valeur locative × taux communal</b>.",
                "1re année : <b>exonérée</b>. Calculez la CFE due, puis <b>Vérifier</b>."],
          lien:"CFE : avis en ligne, paiement le 15/12. CVAE en extinction (2027)." },
        cif:{ srcCap:"Données source", src:srcCIF, wide:true, formCap:"Crédit d'impôt formation du dirigeant", form:formCIF,
          tuto:["Heures de formation du dirigeant, <b>plafonnées à 40 h/an</b>.",
                "Crédit = <b>heures retenues × SMIC horaire</b>. Puis <b>Vérifier</b>.",
                "⚠️ Dispositif clos au 31/12/2024 — vérifier l'applicabilité selon l'exercice."],
          lien:"Crédit d'impôt formation dirigeant : 40 h max × SMIC horaire." } }
    },
    liasse: {
      titre:"Module 5 — Simulateur des liasses fiscales", sous:"La théorie d'abord, puis on remplit la liasse selon le régime du dossier.",
      tabs:[{id:"rn",label:"Réel normal",sub:"2050 → 2059"},{id:"rs",label:"Réel simplifié",sub:"2033-A→G"},{id:"bnc",label:"BNC 2035",sub:"déclaration contrôlée"},{id:"ba",label:"Agricole",sub:"2139/2143"},{id:"sci",label:"SCI / foncier",sub:"2072/2044"}],
      active:"rn",
      panes:{ rn:{ srcCap:"Données comptables source", src:srcRN, wide:true, formCap:"Liasse — 2058-A (réel normal)", form:formRN,
        tuto:["<b>Reportez le résultat comptable</b> (case <b>WA</b>) — c'est le point de départ.",
              "<b>Additionnez les réintégrations</b> (case <b>WB</b>) : charges non déductibles + amortissements excédentaires (VP)…",
              "<b>Additionnez les déductions</b> (case <b>WC</b>) : +values long terme, quote-part mère-fille…",
              "<b>Calculez le résultat fiscal</b> : <b>WD = WA + WB − WC</b>.",
              "Reportez le <b>bénéfice imposable</b> (case <b>XE</b>), puis <b>Vérifier</b>."],
        lien:"Lien fondamental : comptabilité → résultat fiscal → liasse." },
        bnc:{ srcCap:"Données du dossier (BNC)", src:srcBNC, wide:true, formCap:"Déclaration — 2035 (BNC, déclaration contrôlée)", form:formBNC,
          tuto:["BNC = <b>comptabilité de caisse</b> : ne retenez que les recettes <b>encaissées</b> et les dépenses <b>payées</b> dans l'année.",
                "Reportez les <b>recettes encaissées</b> (AA), puis le <b>total des recettes</b> (AD).",
                "Additionnez les <b>charges par nature</b> (AE → AK) → <b>total des charges</b> (AL).",
                "Calculez le <b>bénéfice</b> : AO = AD − AL ; reportez le <b>résultat fiscal</b> (AQ).",
                "Cliquez <b>Vérifier ma déclaration</b>."],
          lien:"BNC : recettes encaissées − dépenses payées = résultat fiscal (imposé à l'IR)." },
        rs:{ srcCap:"Données comptables source", src:srcRS, wide:true, formCap:"Liasse — 2033-B (réel simplifié)", form:formRS,
          tuto:["Reportez le <b>résultat comptable</b>.","Additionnez les <b>réintégrations (+)</b> puis les <b>déductions (−)</b>.","<b>Résultat fiscal = comptable + réintégrations − déductions</b>, puis <b>Vérifier</b>."] },
        ba:{ srcCap:"Données du dossier (agricole)", src:srcBA, wide:true, formCap:"Liasse — 2139 (bénéfices agricoles)", form:formBA,
          tuto:["Additionnez les <b>produits</b> (ventes + aides PAC).","Additionnez les <b>charges</b> par nature.","<b>Résultat fiscal BA = produits − charges</b>, puis <b>Vérifier</b>."] },
        sci:{ srcCap:"Données du dossier (SCI)", src:srcSCI, wide:true, formCap:"Déclaration — 2072 (SCI à l'IR)", form:formSCI,
          tuto:["Reportez les <b>loyers encaissés</b>.","Additionnez les <b>charges déductibles</b> (intérêts, travaux, taxe foncière).","<b>Résultat foncier = loyers − charges</b> ; répartissez la <b>quote-part</b> par associé, puis <b>Vérifier</b>."] } }
    }
  };

  /* ---------- Rendu + interactions ---------- */
  function buildPane(sim, tabId){
    var p=sim.panes[tabId];
    if(!p) return "<div class='sd-soonbox'>🛠️ Simulateur <b>"+esc(tabId.toUpperCase())+"</b> en préparation. Le modèle ci-contre montre le principe : on lit le dossier (à gauche) et on remplit le formulaire officiel (à droite), après le tuto.</div>";
    var tuto="";
    if(p.tuto){
      tuto="<details class='sd-tuto' open><summary>📘 Comment remplir — tutoriel (étape par étape)</summary>"
        +"<ol>"+p.tuto.map(function(s){return "<li>"+s+"</li>";}).join("")+"</ol>"
        +(p.lien?"<p class='lien'>🔗 "+esc(p.lien)+"</p>":"")+"</details>";
    }
    return tuto
      +"<div class='sd-panes'>"
      +"<div class='sd-pane'><p class='sd-cap'>"+esc(p.srcCap)+"</p>"+p.src()+"</div>"
      +"<div class='sd-pane "+(p.wide?"wide":"")+"'><p class='sd-cap'>"+esc(p.formCap)+"</p>"+p.form()+"</div>"
      +"</div>"
      +"<div class='sd-act'><span class='sd-msg'></span>"
      +"<button class='sd-btn' data-act='reset'>↺ Réinitialiser</button>"
      +"<button class='sd-btn' data-act='corrige'>👁 Voir le corrigé</button>"
      +"<button class='sd-btn primary' data-act='verif'>✓ Vérifier ma déclaration</button></div>";
  }
  function render(el){
    if(el.getAttribute("data-rendered")) return;
    var key=el.getAttribute("data-sim"), sim=SIMS[key];
    el.setAttribute("data-rendered","1");
    if(!sim){ el.innerHTML="<p style='color:#c0392b'>(Simulateur non disponible : "+esc(key)+")</p>"; return; }
    el.classList.add("simdoc");
    var initTab=el.getAttribute("data-tab"); if(initTab && sim.panes[initTab]) sim.active=initTab;
    var tabsH=sim.tabs.map(function(t){ return "<div class='sd-tab "+(t.id===sim.active?"on":"")+(t.soon?" soon":"")+"' data-tab='"+escA(t.id)+"'>"+esc(t.label)+(t.sub?"<span class='b'>"+esc(t.sub)+"</span>":"")+(t.soon?"<span class='b'>bientôt</span>":"")+"</div>"; }).join("");
    el.innerHTML="<div class='sd-top'><span class='sd-ic'>🖥️</span><span class='sd-h'>"+esc(sim.titre)+"</span><span class='sd-sub'>"+esc(sim.sous)+"</span></div>"
      +"<div class='sd-tabs'>"+tabsH+"</div><div class='sd-stage'>"+buildPane(sim,sim.active)+"</div>";
    el.addEventListener("click", function(e){
      var tab=e.target.closest(".sd-tab");
      if(tab && !tab.classList.contains("soon")){
        var id=tab.getAttribute("data-tab"); sim.active=id;
        el.querySelectorAll(".sd-tab").forEach(function(t){ t.classList.toggle("on", t.getAttribute("data-tab")===id); });
        el.querySelector(".sd-stage").innerHTML=buildPane(sim,id); return;
      }
      var btn=e.target.closest(".sd-btn"); if(!btn) return;
      var act=btn.getAttribute("data-act"), fills=el.querySelectorAll(".cf-fill"), msg=el.querySelector(".sd-msg");
      if(act==="reset"){ fills.forEach(function(f){ f.value=""; f.classList.remove("ok","ko"); }); if(msg){msg.textContent="";msg.className="sd-msg";} return; }
      if(act==="corrige"){ fills.forEach(function(f){ f.value=f.getAttribute("data-expect"); f.classList.remove("ko"); f.classList.add("ok"); }); if(msg){msg.textContent="Corrigé affiché.";msg.className="sd-msg ok";} return; }
      if(act==="verif"){
        var ok=0, tot=fills.length;
        fills.forEach(function(f){ var exp=f.getAttribute("data-expect"), type=f.getAttribute("data-type"), good;
          if(type==="txt") good=(f.value||"").trim().toLowerCase()===(""+exp).trim().toLowerCase();
          else good=Math.abs(num(f.value)-num(exp))<0.5;
          f.classList.toggle("ok",good); f.classList.toggle("ko",!good); if(good) ok++; });
        if(msg){ msg.textContent=ok+" / "+tot+" correct"+(ok===tot?" — parfait ✅":" — corrigez les cases en rouge"); msg.className="sd-msg "+(ok===tot?"ok":"ko"); }
        return;
      }
    });
  }
  function renderAll(root){ var r=root||document; if(!r.querySelectorAll) return; var l=r.querySelectorAll(".simdoc[data-sim]"); for(var i=0;i<l.length;i++) render(l[i]); }
  function boot(){ renderAll(document); var c=document.getElementById("content"); if(c&&window.MutationObserver){ new MutationObserver(function(){ renderAll(c); }).observe(c,{childList:true,subtree:true}); } }
  if(document.readyState!=="loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
