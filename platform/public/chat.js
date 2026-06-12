/* Assistant FAQ de l'Académie Compta FR — widget autonome, sans dépendance ni cookie.
   Répond aux demandes d'informations courantes (prix, inscription, 2FA, parrainage…),
   avec repli WhatsApp / formulaire. Aucune donnée envoyée à un tiers. */
(function () {
  if (window.__ACF_CHAT_INIT__) return; window.__ACF_CHAT_INIT__ = true;
  var SC = document.currentScript || document.querySelector('script[src*="chat.js"]');
  var WA = ((SC && SC.getAttribute('data-wa')) || (window.ACF_CHAT && window.ACF_CHAT.wa) || '').replace(/\D/g, '');
  var PROMO = !!(SC && SC.getAttribute('data-promo') === '1');
  var COACH = (SC && SC.getAttribute('data-coach')) || '';
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
    '#acfc-nudge{position:fixed;left:18px;bottom:84px;z-index:9997;max-width:252px;background:#fff;color:#23303f;border:1px solid #e4eaf2;border-radius:14px;border-bottom-left-radius:4px;padding:11px 30px 11px 13px;font-size:13px;line-height:1.45;box-shadow:0 12px 34px rgba(20,40,70,.30);cursor:pointer;transition:opacity .4s;animation:acfcin .3s ease}',
    '#acfc-nudge .nx{position:absolute;top:4px;right:7px;border:none;background:none;font-size:16px;color:#9aa7b8;cursor:pointer;line-height:1;padding:0}',
    '#acfc-nudge:after{content:"";position:absolute;left:18px;bottom:-7px;width:0;height:0;border:7px solid transparent;border-top-color:#fff;border-bottom:0}',
    '#acf-install{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:9996;display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,#7c6cff,#38e8ff);color:#06121f;border:none;border-radius:30px;padding:11px 18px;font-size:13.5px;font-weight:800;cursor:pointer;box-shadow:0 10px 30px rgba(56,232,255,.45);font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;animation:acfcin .35s ease}',
    '#acf-install:hover{filter:brightness(1.06)}',
    '#acf-push{position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:9996;display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,#34d399,#38e8ff);color:#06121f;border:none;border-radius:30px;padding:11px 18px;font-size:13.5px;font-weight:800;cursor:pointer;box-shadow:0 10px 30px rgba(56,232,255,.4);font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;animation:acfcin .35s ease}',
    '#acf-push:hover{filter:brightness(1.06)}',
    '#acf-upd{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:9997;display:flex;align-items:center;gap:10px;background:#10162c;color:#e6ecfa;border:1px solid rgba(56,232,255,.35);border-radius:12px;padding:10px 14px;font-size:13.5px;box-shadow:0 12px 34px rgba(0,0,0,.5);font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;animation:acfcin .3s ease}',
    '#acf-upd button{background:linear-gradient(135deg,#7c6cff,#38e8ff);color:#06121f;border:none;border-radius:8px;padding:7px 13px;font-weight:800;cursor:pointer;font-size:13px}',
    '@media(prefers-reduced-motion:reduce){#acfc-l,.acfc-dot,.acfc-typ{animation:none}}'
  ].join('');
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  // ----- Construction du widget -----
  function robot(px) {
    return '<svg viewBox="0 0 64 64" width="' + px + '" height="' + px + '" style="display:block;filter:drop-shadow(0 2px 4px rgba(0,0,0,.30))">' +
      '<defs>' +
      '<radialGradient id="acfH" cx="40%" cy="26%" r="82%"><stop offset="0" stop-color="#ffffff"/><stop offset="68%" stop-color="#eef7f9"/><stop offset="100%" stop-color="#cde9ec"/></radialGradient>' +
      '<linearGradient id="acfT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ee3e9"/><stop offset="1" stop-color="#1fb4c0"/></linearGradient>' +
      '<radialGradient id="acfE" cx="50%" cy="38%" r="72%"><stop offset="0" stop-color="#1d3e62"/><stop offset="100%" stop-color="#0a1f38"/></radialGradient>' +
      '</defs>' +
      '<line x1="22" y1="13" x2="19" y2="5" stroke="#9fdbe0" stroke-width="2.2" stroke-linecap="round"/><circle cx="18.5" cy="4" r="2.9" fill="url(#acfT)"/>' +
      '<line x1="42" y1="13" x2="45" y2="5" stroke="#9fdbe0" stroke-width="2.2" stroke-linecap="round"/><circle cx="45.5" cy="4" r="2.9" fill="url(#acfT)"/>' +
      '<rect x="6" y="26" width="7" height="14" rx="3.5" fill="url(#acfT)"/><rect x="51" y="26" width="7" height="14" rx="3.5" fill="url(#acfT)"/>' +
      '<rect x="12" y="12" width="40" height="38" rx="15" fill="url(#acfH)" stroke="#7fcfd6" stroke-width="1.6"/>' +
      '<rect x="17" y="20" width="30" height="22" rx="11" fill="#0e2a4a"/>' +
      '<circle cx="26" cy="29" r="5.2" fill="url(#acfE)" stroke="#3ee6ee" stroke-width="1.6"/>' +
      '<circle cx="38" cy="29" r="5.2" fill="url(#acfE)" stroke="#3ee6ee" stroke-width="1.6"/>' +
      '<circle cx="27.5" cy="27.3" r="1.5" fill="#eafdff"/><circle cx="39.5" cy="27.3" r="1.5" fill="#eafdff"/>' +
      '<path d="M28 36.5 q4 3 8 0" stroke="#3ee6ee" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<circle cx="20.5" cy="35" r="1.6" fill="#5ee3e9" opacity=".7"/><circle cx="43.5" cy="35" r="1.6" fill="#5ee3e9" opacity=".7"/>' +
      '<ellipse cx="26" cy="18" rx="9" ry="3" fill="#ffffff" opacity=".55"/></svg>';
  }
  var launcher = document.createElement('button');
  launcher.id = 'acfc-l'; launcher.setAttribute('aria-label', 'Ouvrir l\'assistant'); launcher.innerHTML = robot(40) + '<span class="badge">?</span>';
  // Mascotte animée de l'accueil : on remplace l'emoji 🤖 par le même robot
  try { var _ab = document.getElementById('asstBot'); if (_ab) _ab.innerHTML = robot(42); } catch (e) {}
  var panel = document.createElement('div');
  panel.id = 'acfc-p'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Assistant d\'information');
  panel.innerHTML =
    '<div id="acfc-h"><div class="av">' + robot(26) + '</div><div><div class="ti">Assistant Compta FR · Expert</div><div class="su"><span class="acfc-dot"></span>Expert-comptable FR · 20 ans d\'expérience</div></div><button id="acfc-x" aria-label="Fermer">×</button></div>' +
    '<div id="acfc-m" aria-live="polite"></div>' +
    '<div id="acfc-chips"></div>' +
    '<div id="acfc-f"><input id="acfc-i" placeholder="TVA, écriture, bilan, liasse… votre question" autocomplete="off"><button id="acfc-s" aria-label="Envoyer">➤</button></div>' +
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
        ? 'Bonjour 👋 Je suis votre assistant <b>Compta FR</b> — un expert-comptable français (20 ans d\'expérience) à votre service.<br>🎁 <b>Offre de lancement : TOUS les modules GRATUITS pendant 3 mois&nbsp;!</b><br>Posez-moi une question sur la <b>formation</b> (inscription, accès, attestation…) <b>ou sur la comptabilité</b> (TVA, écriture, bilan, liasse…). 😊'
        : 'Bonjour 👋 Je suis votre assistant <b>Compta FR</b> — un expert-comptable français (20 ans d\'expérience).<br>Posez-moi une question sur la <b>formation</b> (prix, inscription, accès…) <b>ou sur la comptabilité française</b> (TVA, écriture, bilan, liasse…). 🎁 <b>Le Module 1 est gratuit&nbsp;!</b>',
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

  /* Coach proactif : bulle de motivation selon la progression de l'apprenant */
  if (COACH) {
    var coachShown = false;
    var showCoach = function () {
      if (coachShown || panel.classList.contains('open')) return;
      try { if (sessionStorage.getItem('acfc_coach') === '1') return; } catch (e) {}
      coachShown = true; try { sessionStorage.setItem('acfc_coach', '1'); } catch (e) {}
      var n = document.createElement('div'); n.id = 'acfc-nudge';
      n.innerHTML = '<button class="nx" aria-label="Fermer">×</button>' + escH(COACH);
      n.querySelector('.nx').onclick = function (e) { e.stopPropagation(); if (n.parentNode) n.parentNode.removeChild(n); };
      n.onclick = function () { if (n.parentNode) n.parentNode.removeChild(n); open(); };
      document.body.appendChild(n);
      setTimeout(function () { if (n.parentNode && !panel.classList.contains('open')) { n.style.opacity = '0'; setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 450); } }, 15000);
    };
    setTimeout(showCoach, 6500);
  }
})();

/* === Assistant vitrine de l'accueil : il bouge et il parle === */
(function () {
  var bot = document.getElementById('asstBot'), msg = document.getElementById('asstMsg'), btn = document.getElementById('asstListen');
  if (!bot || !msg) return;
  var L = [
    'Bonjour 👋 je suis votre assistant Compta FR.',
    'Prêt à démarrer le parcours cabinet ?',
    'On commence par les bases du PCG, en douceur.',
    'Saisie, TVA, révision, préparation du bilan : je vous guide pas à pas.',
    'Une question ? Je réponds 24h/24, gratuitement.'
  ];
  var i = 0, speakOn = false;
  var _voice = null;
  function pickVoice() {
    try {
      var vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
      if (!vs.length) return null;
      var fr = vs.filter(function (v) { return /^fr/i.test(v.lang); });
      if (!fr.length) return null;
      var pref = ['google français', 'amélie', 'amelie', 'thomas', 'audrey', 'virginie', 'microsoft', 'natural'];
      for (var i = 0; i < pref.length; i++) {
        for (var j = 0; j < fr.length; j++) { if (fr[j].name.toLowerCase().indexOf(pref[i]) >= 0) return fr[j]; }
      }
      for (var k = 0; k < fr.length; k++) { if (fr[k].localService) return fr[k]; }
      return fr[0];
    } catch (e) { return null; }
  }
  function loadVoices() { _voice = pickVoice(); }
  try { if (window.speechSynthesis) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; } } catch (e) {}
  function cleanForSpeech(t) {
    try { return (t || '').replace(/[\u{1F000}-\u{1FAFF}☀-➿←-⇿️‍]/gu, '').replace(/\s+/g, ' ').trim(); }
    catch (e) { return (t || '').replace(/[^\x20-\xFF]/g, '').replace(/\s+/g, ' ').trim(); }
  }
  function speak(t) {
    if (!speakOn || !window.speechSynthesis) return;
    try {
      var u = new SpeechSynthesisUtterance(cleanForSpeech(t));
      u.lang = 'fr-FR'; u.rate = 0.97; u.pitch = 1.0; u.volume = 1;
      if (!_voice) loadVoices();
      if (_voice) u.voice = _voice;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) {}
  }
  if (btn) btn.addEventListener('click', function () {
    speakOn = !speakOn; btn.classList.toggle('on', speakOn); btn.textContent = speakOn ? '🔈' : '🔊';
    if (speakOn) speak(L[i]); else if (window.speechSynthesis) { try { speechSynthesis.cancel(); } catch (e) {} }
  });
  var reduce = false; try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reduce) { msg.textContent = L[0]; return; }
  function type(text, done) {
    bot.classList.add('talking'); msg.innerHTML = '';
    var span = document.createElement('span'), caret = document.createElement('span');
    caret.className = 'asst-caret'; msg.appendChild(span); msg.appendChild(caret);
    speak(text);
    var n = 0, iv = setInterval(function () {
      n++; span.textContent = text.slice(0, n);
      if (n >= text.length) { clearInterval(iv); bot.classList.remove('talking'); setTimeout(function () { if (caret.parentNode) caret.parentNode.removeChild(caret); }, 500); if (done) setTimeout(done, 2400); }
    }, 40);
  }
  function loop() { type(L[i], function () { i = (i + 1) % L.length; loop(); }); }
  setTimeout(loop, 700);
})();

/* === PWA : service worker + bouton « Installer l'application » (Android/iOS) === */
(function () {
  function showUpdateToast() {
    if (document.getElementById('acf-upd')) return;
    var d = document.createElement('div'); d.id = 'acf-upd';
    d.innerHTML = '🔄 Nouvelle version disponible <button type="button">Mettre à jour</button>';
    d.querySelector('button').onclick = function () { try { location.reload(); } catch (e) {} };
    document.body.appendChild(d);
    setTimeout(function () { if (d.parentNode) { d.style.transition = 'opacity .4s'; d.style.opacity = '0'; setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 450); } }, 20000);
  }
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      try {
        navigator.serviceWorker.register('/sw.js').then(function (reg) {
          reg.addEventListener('updatefound', function () {
            var nw = reg.installing; if (!nw) return;
            nw.addEventListener('statechange', function () {
              if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdateToast();
            });
          });
        });
      } catch (e) {}
    });
  }
  var deferred = null;
  function isStandalone() { try { return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; } catch (e) { return false; } }
  function showInstall() {
    if (document.getElementById('acf-install') || isStandalone()) return;
    try { if (localStorage.getItem('acf_install_off') === '1') return; } catch (e) {}
    var b = document.createElement('button'); b.id = 'acf-install'; b.type = 'button';
    b.textContent = '📲 Installer l\'application';
    b.onclick = function () {
      if (!deferred) return;
      deferred.prompt();
      deferred.userChoice.then(function () { deferred = null; if (b.parentNode) b.parentNode.removeChild(b); });
    };
    document.body.appendChild(b);
    setTimeout(function () {
      if (b.parentNode && !isStandalone()) { b.style.transition = 'opacity .4s'; b.style.opacity = '0'; setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 450); }
    }, 14000);
  }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent || ''); }
  function showInstallHelp() {
    var h = document.getElementById('installHint');
    var msg = isIOS()
      ? '📲 Sur iPhone : touchez le bouton <b>Partager</b> (carré avec une flèche ↑) en bas de Safari, puis <b>« Sur l\'écran d\'accueil »</b>.'
      : '📲 Dans <b>Chrome</b> : touchez le menu <b>⋮</b> (en haut à droite), puis <b>« Installer l\'application »</b> (ou « Ajouter à l\'écran d\'accueil »).';
    if (h) {
      h.innerHTML = msg;
      h.style.cssText = 'display:block;margin-top:10px;background:rgba(56,232,255,.10);border:1px solid rgba(56,232,255,.35);border-radius:10px;padding:11px 13px;color:#e6f2fb;font-size:13.5px;line-height:1.55';
      try { h.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
    } else { alert(isIOS() ? 'Sur iPhone : Partager → Sur l\'écran d\'accueil' : 'Chrome : menu ⋮ → Installer l\'application'); }
  }
  function wireCard() {
    var btn = document.getElementById('installApp');
    if (!btn) return;
    if (isStandalone()) {
      var arr = document.querySelectorAll('.pwa-only'); for (var i = 0; i < arr.length; i++) arr[i].style.display = 'none';
      return;
    }
    btn.addEventListener('click', function () {
      if (deferred) { deferred.prompt(); deferred.userChoice.then(function () { deferred = null; }); }
      else { showInstallHelp(); }
    });
  }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; showInstall(); });
  window.addEventListener('appinstalled', function () { try { localStorage.setItem('acf_install_off', '1'); } catch (e) {} var b = document.getElementById('acf-install'); if (b && b.parentNode) b.parentNode.removeChild(b); var c = document.getElementById('installCard'); if (c) c.style.display = 'none'; });
  // Mode application installée : active la barre du bas + surligne l'onglet actif
  function appMode() {
    if (isStandalone()) document.documentElement.classList.add('pwa-standalone');
    try {
      var pth = location.pathname, links = document.querySelectorAll('.appbar a[data-p]');
      for (var i = 0; i < links.length; i++) {
        var pp = links[i].getAttribute('data-p');
        if (pp === '/' ? pth === '/' : pth.indexOf(pp) === 0) links[i].classList.add('on');
      }
    } catch (e) {}
  }
  try { appMode(); wireCard(); } catch (e) {}

  // --- Notifications push ---
  var SCp = document.currentScript || document.querySelector('script[src*="chat.js"]');
  var VAPID = (SCp && SCp.getAttribute('data-vapid')) || '';
  var AUTHED = !!(SCp && SCp.getAttribute('data-auth') === '1');
  function urlB64ToUint8(base64) {
    var pad = '='.repeat((4 - base64.length % 4) % 4);
    var b64 = (base64 + pad).replace(/-/g, '+').replace(/_/g, '/');
    var raw = atob(b64), arr = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
  }
  function subscribePush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !VAPID) return Promise.resolve(false);
    return navigator.serviceWorker.ready.then(function (reg) {
      return reg.pushManager.getSubscription().then(function (sub) {
        if (sub) return sub;
        return Notification.requestPermission().then(function (perm) {
          if (perm !== 'granted') return null;
          return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToUint8(VAPID) });
        });
      });
    }).then(function (sub) {
      if (!sub) return false;
      return fetch('/api/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'sub=' + encodeURIComponent(JSON.stringify(sub)) })
        .then(function () { try { localStorage.setItem('acf_push', '1'); } catch (e) {} return true; });
    }).catch(function () { return false; });
  }
  function maybeShowPushBtn() {
    if (!AUTHED || !VAPID || !('PushManager' in window) || !('Notification' in window)) return;
    if (Notification.permission === 'granted') { subscribePush(); return; }   // déjà autorisé → resynchronise
    if (Notification.permission === 'denied') return;
    try { if (localStorage.getItem('acf_push') === '1') return; } catch (e) {}
    if (document.getElementById('acf-push')) return;
    var b = document.createElement('button'); b.id = 'acf-push'; b.type = 'button';
    b.textContent = '🔔 Activer les rappels';
    b.onclick = function () { subscribePush().then(function (ok) { if (ok && b.parentNode) b.parentNode.removeChild(b); }); };
    document.body.appendChild(b);
    setTimeout(function () { if (b.parentNode) { b.style.transition = 'opacity .4s'; b.style.opacity = '0'; setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 450); } }, 16000);
  }
  setTimeout(maybeShowPushBtn, 9000);
})();
