/* Assistant FAQ de l'Académie Compta FR — widget autonome, sans dépendance ni cookie.
   Répond aux demandes d'informations courantes (prix, inscription, 2FA, parrainage…),
   avec repli WhatsApp / formulaire. Aucune donnée envoyée à un tiers. */
(function () {
  if (window.__ACF_CHAT_INIT__) return; window.__ACF_CHAT_INIT__ = true;
  var SC = document.currentScript || document.querySelector('script[src*="chat.js"]');
  var WA = ((SC && SC.getAttribute('data-wa')) || (window.ACF_CHAT && window.ACF_CHAT.wa) || '').replace(/\D/g, '');
  var waUrl = function (t) { return WA ? ('https://wa.me/' + WA + '?text=' + encodeURIComponent(t || 'Bonjour, je souhaite des informations sur la formation.')) : '/programme'; };

  // ----- Base de connaissances (intentions) -----
  var FAQ = [
    { key: 'prix', chip: '💰 Prix & offres', kw: ['prix', 'tarif', 'coute', 'coût', 'cout', 'combien', 'offre', 'pack', 'cher', 'ariary', 'ar '],
      a: 'Le <b>Module 1 est 100&nbsp;% gratuit</b> (après inscription). Les autres modules sont <b>payants à partir de 30&nbsp;000&nbsp;Ar</b>, et il existe un <b>pack complet</b> avantageux. Détail et aperçu de chaque module : <a href="/programme">page Programme</a>.' },
    { key: 'inscription', chip: '🎓 S\'inscrire', kw: ['inscri', 'compte', 'creer', 'créer', 's\'inscrire', 'rejoindre', 'commencer'],
      a: 'Cliquez sur <a href="/inscription"><b>S\'inscrire</b></a>, remplissez le formulaire (prérequis&nbsp;: <b>BAC+2 en comptabilité</b>, attestation sur l\'honneur) et installez <b>Google&nbsp;Authenticator</b> (2FA). Vous pourrez ensuite lire le <b>Module&nbsp;1 gratuitement</b>.' },
    { key: 'module1', chip: '🎁 Module 1 gratuit', kw: ['gratuit', 'module 1', 'module1', 'essai', 'tester', 'découvrir', 'decouvrir'],
      a: 'Le <b>Module&nbsp;1 — Fondamentaux de la comptabilité française</b> est <b>offert en intégralité</b> après une inscription gratuite. <a href="/apercu?m=mod1">Lire le Module&nbsp;1 →</a>' },
    { key: '2fa', chip: '🔐 Sécurité (2FA)', kw: ['2fa', 'authenticator', 'securit', 'sécurit', 'mot de passe', 'connexion', 'appareil', 'piratage'],
      a: 'Votre espace est protégé&nbsp;: <b>double authentification</b> (Google&nbsp;Authenticator) et <b>une seule session active à la fois</b> (anti-partage de compte). Installez l\'application <b>gratuite</b> avant de vous inscrire&nbsp;; réglez l\'heure du téléphone en automatique.' },
    { key: 'parrainage', chip: '🤝 Parrainage', kw: ['parrain', 'filleul', 'parainage', 'code', 'inviter', 'cadeau'],
      a: 'Parrainez vos collègues&nbsp;! Dans votre espace, vous avez un <b>code de parrainage</b> et un lien à partager. Dès qu\'un filleul <b>débloque un accès payant</b>, vous recevez <b>+30 jours d\'accès offerts</b>.' },
    { key: 'duree', chip: '⏳ Durée d\'accès', kw: ['duree', 'durée', 'combien de temps', 'expire', 'acces', 'accès', '12 mois', 'an '],
      a: 'L\'accès aux modules payés dure <b>12 mois</b> (sauf accès illimité). Un <b>compte à rebours</b> est affiché dans votre espace.' },
    { key: 'paiement', chip: '💳 Paiement', kw: ['paie', 'payer', 'paiement', 'orange', 'mvola', 'carte', 'visa', 'regler', 'régler'],
      a: 'Paiement par <b>Orange&nbsp;Money</b> ou <b>carte bancaire</b>. L\'accès est activé dès la validation du paiement. Vous choisissez vos modules depuis votre espace après inscription.' },
    { key: 'pratique', chip: '🛠️ C\'est pratique ?', kw: ['pratique', 'simulateur', 'exercice', 'pennylane', 'logiciel', 'cerfa', 'cas pratique'],
      a: 'Oui, la formation est <b>100&nbsp;% pratique</b>&nbsp;: simulateurs interactifs façon <b>logiciel comptable</b> (interface inspirée de Pennylane), <b>CERFA réels</b> à remplir, écritures et cas concrets de cabinet.' },
    { key: 'attestation', chip: '🏅 Attestation', kw: ['attestation', 'certificat', 'diplome', 'diplôme', 'certification', 'reconnu'],
      a: 'Une <b>attestation de fin de formation</b> est délivrée après l\'<b>évaluation finale</b> (notée sur 100). C\'est une attestation interne (sans valeur de diplôme d\'État) qui atteste votre niveau opérationnel.' },
    { key: 'debouches', chip: '📈 Débouchés', kw: ['debouch', 'débouch', 'emploi', 'travail', 'salaire', 'freelance', 'cabinet', 'metier', 'métier', 'embauche'],
      a: 'La formation prépare à devenir <b>collaborateur, réviseur ou chef de mission</b> pour des cabinets français, en <b>cabinet d\'externalisation</b> à Madagascar ou en <b>freelance payé en euros</b>. Détails sur la <a href="/programme">page Programme</a>.' }
  ];

  function answer(text) {
    var t = (' ' + text.toLowerCase() + ' ').normalize ? (' ' + text.toLowerCase() + ' ') : (' ' + text.toLowerCase() + ' ');
    var best = null, score = 0;
    for (var i = 0; i < FAQ.length; i++) {
      var s = 0; for (var k = 0; k < FAQ[i].kw.length; k++) if (t.indexOf(FAQ[i].kw[k]) > -1) s++;
      if (s > score) { score = s; best = FAQ[i]; }
    }
    if (best) return best.a;
    return 'Je n\'ai pas la réponse exacte à cette question 🤔. Posez-la directement à un conseiller sur <a href="' + waUrl('Bonjour, j\'ai une question sur la formation : ') + '" target="_blank" rel="noopener"><b>WhatsApp</b></a>, ou consultez la <a href="/programme">page Programme</a>. Vous pouvez aussi essayer&nbsp;: <i>prix, inscription, parrainage, 2FA</i>.';
  }

  // ----- Styles -----
  var CSS = [
    '#acfc-l{position:fixed;left:18px;bottom:18px;z-index:9998;width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;background:linear-gradient(135deg,#1F4E78,#2E6CA4);color:#fff;font-size:26px;box-shadow:0 6px 20px rgba(20,40,70,.35);display:flex;align-items:center;justify-content:center;transition:transform .15s}',
    '#acfc-l:hover{transform:scale(1.06)}',
    '#acfc-l .badge{position:absolute;top:-3px;right:-3px;background:#E8A13A;color:#3a2600;font-size:11px;font-weight:800;border-radius:10px;padding:1px 6px;border:2px solid #fff}',
    '#acfc-p{position:fixed;left:18px;bottom:84px;z-index:9999;width:340px;max-width:calc(100vw - 36px);height:480px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;box-shadow:0 16px 48px rgba(20,40,70,.32);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif}',
    '#acfc-p.open{display:flex}',
    '#acfc-h{background:linear-gradient(135deg,#1F4E78,#2E6CA4);color:#fff;padding:13px 15px;display:flex;align-items:center;gap:9px}',
    '#acfc-h .av{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:18px}',
    '#acfc-h .ti{font-weight:800;font-size:14px;line-height:1.1}#acfc-h .su{font-size:11px;opacity:.85}',
    '#acfc-x{margin-left:auto;background:none;border:none;color:#fff;font-size:22px;cursor:pointer;line-height:1;opacity:.9}',
    '#acfc-m{flex:1;overflow-y:auto;padding:14px;background:#f4f7fb}',
    '.acfc-b{max-width:86%;padding:9px 12px;border-radius:13px;margin:7px 0;font-size:13.5px;line-height:1.5;box-shadow:0 1px 2px rgba(20,40,70,.06)}',
    '.acfc-bot{background:#fff;border:1px solid #e4eaf2;border-bottom-left-radius:4px;color:#23303f}',
    '.acfc-me{background:#1F4E78;color:#fff;border-bottom-right-radius:4px;margin-left:auto}',
    '.acfc-b a{color:#2E6CA4;font-weight:600}.acfc-me a{color:#fff}',
    '#acfc-chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px;background:#f4f7fb;border-top:1px solid #e9eef5}',
    '#acfc-chips button{background:#eaf1f9;color:#1F4E78;border:1px solid #d6e2f0;border-radius:16px;padding:5px 10px;font-size:12px;font-weight:600;cursor:pointer}',
    '#acfc-chips button:hover{background:#dce8f5}',
    '#acfc-f{display:flex;gap:6px;padding:10px;border-top:1px solid #e9eef5;background:#fff}',
    '#acfc-i{flex:1;border:1px solid #cdd9e7;border-radius:10px;padding:9px 10px;font-size:13.5px;font-family:inherit}',
    '#acfc-i:focus{outline:none;border-color:#E8A13A;box-shadow:0 0 0 3px rgba(232,161,58,.2)}',
    '#acfc-s{background:#E8A13A;color:#3a2600;border:none;border-radius:10px;padding:0 14px;font-weight:800;cursor:pointer;font-size:15px}',
    '#acfc-foot{font-size:10.5px;color:#8a97a6;text-align:center;padding:0 0 7px;background:#fff}',
    '.acfc-typ{letter-spacing:2px;opacity:.55;animation:acfcblink 1.1s infinite}',
    '@keyframes acfcblink{0%,100%{opacity:.25}50%{opacity:.7}}'
  ].join('');
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  // ----- Construction du widget -----
  var launcher = document.createElement('button');
  launcher.id = 'acfc-l'; launcher.setAttribute('aria-label', 'Ouvrir l\'assistant'); launcher.innerHTML = '💬<span class="badge">?</span>';
  var panel = document.createElement('div');
  panel.id = 'acfc-p'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Assistant d\'information');
  panel.innerHTML =
    '<div id="acfc-h"><div class="av">🎓</div><div><div class="ti">Assistant Académie Compta FR</div><div class="su">Réponses immédiates · gratuit</div></div><button id="acfc-x" aria-label="Fermer">×</button></div>' +
    '<div id="acfc-m" aria-live="polite"></div>' +
    '<div id="acfc-chips"></div>' +
    '<div id="acfc-f"><input id="acfc-i" placeholder="Votre question…" autocomplete="off"><button id="acfc-s" aria-label="Envoyer">➤</button></div>' +
    '<div id="acfc-foot">🔒 Sans cookie de pistage · vos messages restent sur cette page</div>';
  document.body.appendChild(launcher); document.body.appendChild(panel);

  var msgs = panel.querySelector('#acfc-m'), chips = panel.querySelector('#acfc-chips'), input = panel.querySelector('#acfc-i');
  var history = [];
  function add(html, who) { var d = document.createElement('div'); d.className = 'acfc-b ' + (who === 'me' ? 'acfc-me' : 'acfc-bot'); d.innerHTML = html; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d; }
  function escH(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function stripH(s) { var t = document.createElement('div'); t.innerHTML = s; return (t.textContent || '').trim(); }
  function addTyping() { var d = add('<span class="acfc-typ">●●●</span>', 'bot'); return d; }
  function renderChips() { chips.innerHTML = ''; FAQ.forEach(function (f) { var b = document.createElement('button'); b.textContent = f.chip; b.onclick = function () { add(f.chip, 'me'); history.push({ role: 'user', content: stripH(f.chip) }); setTimeout(function () { add(f.a, 'bot'); history.push({ role: 'assistant', content: stripH(f.a) }); }, 160); }; chips.appendChild(b); }); }
  function send() {
    var v = input.value.trim(); if (!v) return;
    add(escH(v), 'me'); history.push({ role: 'user', content: v }); input.value = '';
    var typ = addTyping();
    var form = 'q=' + encodeURIComponent(v) + '&hist=' + encodeURIComponent(JSON.stringify(history.slice(-6)));
    fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (typ && typ.parentNode) typ.parentNode.removeChild(typ);
        if (d && d.reply) { add(escH(d.reply).replace(/\n/g, '<br>'), 'bot'); history.push({ role: 'assistant', content: d.reply }); }
        else { var a = answer(v); add(a, 'bot'); history.push({ role: 'assistant', content: stripH(a) }); }
      })
      .catch(function () { if (typ && typ.parentNode) typ.parentNode.removeChild(typ); add(answer(v), 'bot'); });
  }

  var greeted = false;
  function open() {
    panel.classList.add('open'); launcher.style.display = 'none';
    if (!greeted) { greeted = true; add('Bonjour 👋 Je suis l\'assistant de l\'<b>Académie Compta FR</b>. Posez votre question ou choisissez un sujet ci-dessous.', 'bot'); renderChips(); }
    setTimeout(function () { input.focus(); }, 100);
  }
  function close() { panel.classList.remove('open'); launcher.style.display = 'flex'; }
  launcher.onclick = open;
  panel.querySelector('#acfc-x').onclick = close;
  panel.querySelector('#acfc-s').onclick = send;
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
})();
