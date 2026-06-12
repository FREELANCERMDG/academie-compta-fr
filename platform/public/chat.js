/* Assistant FAQ de l'Académie Compta FR — widget autonome, sans dépendance ni cookie.
   Répond aux demandes d'informations courantes (prix, inscription, 2FA, parrainage…),
   avec repli WhatsApp / formulaire. Aucune donnée envoyée à un tiers. */
(function () {
  if (window.__ACF_CHAT_INIT__) return; window.__ACF_CHAT_INIT__ = true;
  var SC = document.currentScript || document.querySelector('script[src*="chat.js"]');
  var WA = ((SC && SC.getAttribute('data-wa')) || (window.ACF_CHAT && window.ACF_CHAT.wa) || '').replace(/\D/g, '');
  var PROMO = !!(SC && SC.getAttribute('data-promo') === '1');
  var waUrl = function (t) { return WA ? ('https://wa.me/' + WA + '?text=' + encodeURIComponent(t || 'Bonjour, je souhaite des informations sur la formation.')) : '/programme'; };

  // ----- Base de connaissances (intentions) -----
  var FAQ = [
    { key: 'prix', chip: '💰 Prix & offres', kw: ['prix', 'tarif', 'coute', 'coût', 'cout', 'combien', 'offre', 'pack', 'cher', 'ariary', 'ar '],
      a: (PROMO
        ? '🎁 <b>Offre de lancement : TOUS les modules sont GRATUITS pendant 3 mois&nbsp;!</b> Inscrivez-vous et accédez à toute la formation (+ attestation). <a href="/programme">Voir le programme</a>.'
        : 'Le <b>Module 1 est 100&nbsp;% gratuit</b> (après inscription). Les autres modules sont <b>payants à partir de 30&nbsp;000&nbsp;Ar</b>, et il existe un <b>pack complet</b> avantageux. Détail et aperçu de chaque module : <a href="/programme">page Programme</a>.') },
    { key: 'inscription', chip: '🎓 S\'inscrire', kw: ['inscri', 'compte', 'creer', 'créer', 's\'inscrire', 'rejoindre', 'commencer'],
      a: 'Cliquez sur <a href="/inscription"><b>S\'inscrire</b></a>, remplissez le formulaire (prérequis&nbsp;: <b>BAC+2 en comptabilité</b>, attestation sur l\'honneur). Vous pourrez ensuite lire le <b>Module&nbsp;1 gratuitement</b>' + (PROMO ? ' — et pendant la promo, TOUS les modules sont débloqués !' : '') + '.' },
    { key: 'module1', chip: '🎁 Module 1 gratuit', kw: ['gratuit', 'module 1', 'module1', 'essai', 'tester', 'découvrir', 'decouvrir'],
      a: (PROMO ? '🎁 Pendant la promo, <b>TOUS les modules (1 à 6)</b> sont offerts après une inscription gratuite. <a href="/apercu?m=mod1">Commencer →</a>' : 'Le <b>Module&nbsp;1 — Fondamentaux de la comptabilité française</b> est <b>offert en intégralité</b> après une inscription gratuite. <a href="/apercu?m=mod1">Lire le Module&nbsp;1 →</a>') },
    { key: '2fa', chip: '🔐 Sécurité', kw: ['2fa', 'authenticator', 'securit', 'sécurit', 'mot de passe', 'connexion', 'appareil', 'piratage'],
      a: 'Votre espace est protégé&nbsp;: <b>connexion par email et mot de passe</b> et <b>une seule session active à la fois</b> (anti-partage de compte). Pas de blocage par adresse IP. La double authentification est réservée à l\'administrateur.' },
    { key: 'parrainage', chip: '🤝 Parrainage', kw: ['parrain', 'filleul', 'parainage', 'code', 'inviter', 'cadeau'],
      a: 'Parrainez vos collègues&nbsp;! Dans votre espace, vous avez un <b>code de parrainage</b> et un lien à partager. Dès qu\'un filleul <b>débloque un accès payant</b>, vous recevez <b>+30 jours d\'accès offerts</b>.' },
    { key: 'duree', chip: '⏳ Durée d\'accès', kw: ['duree', 'durée', 'combien de temps', 'expire', 'acces', 'accès', '12 mois', 'an '],
      a: 'L\'accès aux modules payés dure <b>12 mois</b> (sauf accès illimité). Un <b>compte à rebours</b> est affiché dans votre espace.' },
    { key: 'paiement', chip: '💳 Paiement', kw: ['paie', 'payer', 'paiement', 'orange', 'mvola', 'carte', 'visa', 'regler', 'régler'],
      a: 'Paiement par <b>Orange&nbsp;Money</b> ou <b>MVola</b>. L\'accès est activé dès la validation du paiement. Vous choisissez vos modules depuis votre espace après inscription.' },
    { key: 'pratique', chip: '🛠️ C\'est pratique ?', kw: ['pratique', 'simulateur', 'exercice', 'pennylane', 'logiciel', 'cerfa', 'cas pratique'],
      a: 'Oui, la formation est <b>100&nbsp;% pratique</b>&nbsp;: simulateurs interactifs façon <b>logiciel comptable</b> (interface inspirée de Pennylane), <b>CERFA réels</b> à remplir, écritures et cas concrets de cabinet.' },
    { key: 'attestation', chip: '🏅 Attestation', kw: ['attestation', 'certificat', 'diplome', 'diplôme', 'certification', 'reconnu'],
      a: 'Une <b>attestation de fin de formation</b> est délivrée après l\'<b>évaluation finale</b> (notée sur 100) et un <b>test final en visio</b> avec le formateur. Attestation interne (sans valeur de diplôme d\'État), signée et tamponnée, attestant votre niveau opérationnel.' },
    { key: 'debouches', chip: '📈 Débouchés', kw: ['debouch', 'débouch', 'emploi', 'travail', 'salaire', 'freelance', 'cabinet', 'metier', 'métier', 'embauche'],
      a: 'La formation prépare à devenir <b>collaborateur, réviseur ou chef de mission</b> pour des cabinets français, en <b>cabinet d\'externalisation</b> à Madagascar ou en <b>freelance payé en euros</b>. Détails sur la <a href="/programme">page Programme</a>.' },
    { key: 'contact', chip: '📞 Contact', kw: ['contact', 'whatsapp', 'parler', 'humain', 'conseiller', 'telephone', 'téléphone', 'appeler', 'joindre', 'mail', 'email'],
      a: 'Vous pouvez parler à un conseiller sur <a href="' + waUrl('Bonjour, je souhaite des informations sur la formation.') + '" target="_blank" rel="noopener"><b>WhatsApp</b></a>, ou demander un rendez-vous depuis votre espace après inscription. Nous répondons rapidement 🙂' }
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
    '@keyframes acfcblink{0%,100%{opacity:.25}50%{opacity:.7}}',
    '#acfc-l{animation:acfcpulse 2.6s infinite}',
    '@keyframes acfcpulse{0%{box-shadow:0 6px 20px rgba(20,40,70,.35),0 0 0 0 rgba(46,108,164,.45)}70%{box-shadow:0 6px 20px rgba(20,40,70,.35),0 0 0 13px rgba(46,108,164,0)}100%{box-shadow:0 6px 20px rgba(20,40,70,.35),0 0 0 0 rgba(46,108,164,0)}}',
    '#acfc-p.open{animation:acfcin .22s ease}',
    '@keyframes acfcin{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}',
    '.acfc-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#46d17a;margin-right:5px;vertical-align:middle;animation:acfcblip 1.9s infinite}',
    '@keyframes acfcblip{0%{box-shadow:0 0 0 0 rgba(70,209,122,.6)}70%{box-shadow:0 0 0 6px rgba(70,209,122,0)}100%{box-shadow:0 0 0 0 rgba(70,209,122,0)}}',
    '@media(prefers-reduced-motion:reduce){#acfc-l,.acfc-dot,.acfc-typ{animation:none}}'
  ].join('');
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  // ----- Construction du widget -----
  function robot(px) {
    return '<svg viewBox="0 0 64 64" width="' + px + '" height="' + px + '" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">' +
      '<defs><radialGradient id="acfrH" cx="38%" cy="26%" r="85%"><stop offset="0" stop-color="#ffffff"/><stop offset="55%" stop-color="#dbe7f5"/><stop offset="100%" stop-color="#a6bedb"/></radialGradient>' +
      '<linearGradient id="acfrE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8defff"/><stop offset="1" stop-color="#17a3d4"/></linearGradient></defs>' +
      '<line x1="32" y1="6" x2="32" y2="15" stroke="#dbe7f5" stroke-width="2.4"/><circle cx="32" cy="5" r="3.3" fill="#E8A13A"/>' +
      '<rect x="7" y="29" width="6" height="13" rx="3" fill="#9bb4d0"/><rect x="51" y="29" width="6" height="13" rx="3" fill="#9bb4d0"/>' +
      '<rect x="13" y="16" width="38" height="34" rx="12" fill="url(#acfrH)" stroke="#8aa6c6" stroke-width="1"/>' +
      '<rect x="18" y="23" width="28" height="15" rx="7.5" fill="#16307a"/>' +
      '<circle cx="26" cy="30.5" r="3.6" fill="url(#acfrE)"/><circle cx="38" cy="30.5" r="3.6" fill="url(#acfrE)"/>' +
      '<circle cx="24.8" cy="29.3" r="1.05" fill="#fff"/><circle cx="36.8" cy="29.3" r="1.05" fill="#fff"/>' +
      '<path d="M25 43 q7 4.5 14 0" stroke="#8aa0bd" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="27" cy="21" rx="10" ry="3.4" fill="#ffffff" opacity=".5"/></svg>';
  }
  var launcher = document.createElement('button');
  launcher.id = 'acfc-l'; launcher.setAttribute('aria-label', 'Ouvrir l\'assistant'); launcher.innerHTML = robot(40) + '<span class="badge">?</span>';
  var panel = document.createElement('div');
  panel.id = 'acfc-p'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Assistant d\'information');
  panel.innerHTML =
    '<div id="acfc-h"><div class="av">' + robot(26) + '</div><div><div class="ti">Assistant Académie Compta FR</div><div class="su"><span class="acfc-dot"></span>En ligne · réponses immédiates</div></div><button id="acfc-x" aria-label="Fermer">×</button></div>' +
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
  function renderChips() {
    chips.innerHTML = '';
    var order = ['prix', 'inscription', 'module1', 'parrainage', '2fa', 'contact'];
    var pick = order.map(function (k) { for (var i = 0; i < FAQ.length; i++) if (FAQ[i].key === k) return FAQ[i]; return null; }).filter(Boolean);
    pick.forEach(function (f) { var b = document.createElement('button'); b.textContent = f.chip; b.onclick = function () { add(f.chip, 'me'); history.push({ role: 'user', content: stripH(f.chip) }); setTimeout(function () { add(f.a, 'bot'); history.push({ role: 'assistant', content: stripH(f.a) }); }, 150); }; chips.appendChild(b); });
  }
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
    if (!greeted) {
      greeted = true;
      add(PROMO
        ? 'Bonjour 👋 Je suis l\'assistant de l\'<b>Académie Compta FR</b>.<br>🎁 <b>Offre de lancement : TOUS les modules sont GRATUITS pendant 3 mois&nbsp;!</b> Profitez-en. Une question ou besoin d\'aide (inscription, accès, modules, attestation…) ? Je suis là 😊'
        : 'Bonjour 👋 Je suis l\'assistant de l\'<b>Académie Compta FR</b>.<br>Posez votre question (prix, inscription, accès…) ou choisissez un sujet ci-dessous. 🎁 <b>Le Module 1 est gratuit&nbsp;!</b>',
        'bot');
      renderChips();
    }
    setTimeout(function () { input.focus(); }, 100);
  }
  function close() { panel.classList.remove('open'); launcher.style.display = 'flex'; }
  launcher.onclick = open;
  panel.querySelector('#acfc-x').onclick = close;
  panel.querySelector('#acfc-s').onclick = send;
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
})();
