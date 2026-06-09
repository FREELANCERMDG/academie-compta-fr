/* Communauté — mur de discussion "live" par sondage court (3 s) + envoi sans rechargement.
   Sécurité : tout le contenu est inséré via textContent (jamais innerHTML) -> aucune injection HTML. */
(function () {
  var box = document.getElementById('forum-box'); if (!box) return;
  var list = document.getElementById('forum-list');
  var form = document.getElementById('forum-form');
  var ta = form ? form.querySelector('textarea[name=message]') : null;
  var csrfEl = form ? form.querySelector('[name=_csrf]') : null;
  var status = document.getElementById('forum-status');
  var last = box.getAttribute('data-last') || '';
  var busy = false;

  function nearBottom() { return (list.scrollHeight - list.scrollTop - list.clientHeight) < 80; }
  function scrollBottom() { try { list.scrollTop = list.scrollHeight; } catch (e) { } }

  function addMsg(m) {
    if (!m || !m.id || document.getElementById('m-' + m.id)) return;
    var empty = document.getElementById('forum-empty'); if (empty) empty.remove();
    var div = document.createElement('div'); div.className = 'offre'; div.id = 'm-' + m.id; div.style.marginBottom = '8px';
    if (m.role === 'admin') div.style.borderLeft = '3px solid var(--accent)';
    var h = document.createElement('p'); h.style.margin = '0 0 4px';
    var b = document.createElement('b'); b.textContent = m.auteur || ''; h.appendChild(b);
    var t = document.createElement('span'); t.className = 'muted'; t.style.fontSize = '11px'; t.textContent = ' ' + (m.t || ''); h.appendChild(t);
    var p = document.createElement('p'); p.style.margin = '0'; p.style.whiteSpace = 'pre-wrap'; p.textContent = m.message || '';
    div.appendChild(h); div.appendChild(p); list.appendChild(div);
    if (m.cree_le && m.cree_le > last) last = m.cree_le;
  }

  function poll() {
    fetch('/communaute/messages?since=' + encodeURIComponent(last), { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (arr) { if (arr && arr.length) { var atBottom = nearBottom(); arr.forEach(addMsg); if (atBottom) scrollBottom(); } })
      .catch(function () { });
  }

  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy || !ta) return;
    var msg = ta.value.trim();
    if (msg.length < 2) { if (status) status.textContent = 'Message trop court.'; return; }
    busy = true; if (status) status.textContent = 'Envoi…';
    var body = 'message=' + encodeURIComponent(msg) + '&_ajax=1&_csrf=' + encodeURIComponent(csrfEl ? csrfEl.value : '');
    fetch('/communaute', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body, credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: 'Erreur.' }; }); })
      .then(function (res) {
        busy = false;
        if (res && res.ok) { ta.value = ''; if (status) status.textContent = ''; poll(); setTimeout(scrollBottom, 120); }
        else { if (status) status.textContent = (res && res.error) ? res.error : 'Erreur, réessayez.'; }
      })
      .catch(function () { busy = false; if (status) status.textContent = 'Erreur réseau.'; });
  });

  scrollBottom();
  setInterval(poll, 3000);
})();
