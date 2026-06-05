# -*- coding: utf-8 -*-
"""Emballe le site e-learning en paquet SCORM 1.2 (pour Moodle, etc.).
Lit site/index.html, injecte un adaptateur SCORM (remontee progression + score),
ecrit scorm/index.html + scorm/imsmanifest.xml, et cree le .zip importable."""
import os, zipfile

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)
SRC = os.path.join(ROOT, "site", "index.html")

with open(SRC, "r", encoding="utf-8") as f:
    site = f.read()

SCORM_JS = r"""
<script>
/* Adaptateur SCORM 1.2 - no-op si ouvert hors LMS (file://) */
(function(){
  function findAPI(w){var n=0;while(w&&!w.API&&w.parent&&w.parent!=w&&n<12){w=w.parent;n++;}return w?w.API:null;}
  var api=findAPI(window)||(window.opener?findAPI(window.opener):null);
  if(!api){return;}
  try{api.LMSInitialize("");}catch(e){return;}
  function get(k){try{return api.LMSGetValue(k);}catch(e){return"";}}
  function set(k,v){try{api.LMSSetValue(k,String(v));}catch(e){}}
  var st=get("cmi.core.lesson_status");
  if(!st||st==="not attempted"||st==="unknown"||st===""){set("cmi.core.lesson_status","incomplete");}
  set("cmi.core.score.min","0");set("cmi.core.score.max","100");
  function report(){
    try{
      var prog=JSON.parse(localStorage.getItem("fce_progress_v1")||'{"done":{},"quiz":{}}');
      var total=(typeof ORDER!=="undefined"&&ORDER.length)?ORDER.length:25;
      var done=0;for(var i=0;i<total;i++){if(prog.done[ORDER[i]])done++;}
      var pct=Math.round(done/total*100);
      set("cmi.core.score.raw",pct);
      var qs=Object.keys(prog.quiz||{}).map(function(k){return prog.quiz[k];});
      var sc=0,tot=0;qs.forEach(function(q){sc+=q.score;tot+=q.total;});
      var qavg=tot?sc/tot:0;
      if(pct>=100){set("cmi.core.lesson_status",qavg>=0.7?"passed":"completed");}
      else{set("cmi.core.lesson_status","incomplete");}
      api.LMSCommit("");
    }catch(e){}
  }
  report();setInterval(report,5000);
  function fin(){try{report();api.LMSFinish("");}catch(e){}}
  window.addEventListener("beforeunload",fin);
  window.addEventListener("pagehide",fin);
})();
</script>
"""

site_scorm = site.replace("</body>", SCORM_JS + "\n</body>")
with open(os.path.join(BASE, "index.html"), "w", encoding="utf-8") as f:
    f.write(site_scorm)

MANIFEST = """<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="FCE_MADA_2026" version="1.2"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="ORG1">
    <organization identifier="ORG1">
      <title>Comptabilite francaise externalisee - Madagascar 2026</title>
      <item identifier="ITEM1" identifierref="RES1" isvisible="true">
        <title>Formation complete (20 modules + 19 quiz)</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>
"""
with open(os.path.join(BASE, "imsmanifest.xml"), "w", encoding="utf-8") as f:
    f.write(MANIFEST)

ZIP = os.path.join(BASE, "Formation-SCORM-1.2.zip")
XSDS = ["imscp_rootv1p1p2.xsd", "adlcp_rootv1p2.xsd", "imsmd_rootv1p2p1.xsd", "ims_xml.xsd"]
sch_dir = os.path.join(BASE, "schemas")
with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as z:
    z.write(os.path.join(BASE, "imsmanifest.xml"), "imsmanifest.xml")
    z.write(os.path.join(BASE, "index.html"), "index.html")
    for x in XSDS:
        p = os.path.join(sch_dir, x)
        if os.path.exists(p):
            z.write(p, x)  # XSD a la racine du zip (references dans schemaLocation)
print("SCORM zip cree | XSD inclus:", [x for x in XSDS if os.path.exists(os.path.join(sch_dir, x))])
