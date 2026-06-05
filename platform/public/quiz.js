// Quiz de démonstration (aperçu gratuit) — sans sauvegarde. Lit #quizdata, rend dans #quiz.
(function () {
  var el = document.getElementById('quizdata'); if (!el) return;
  var data; try { data = JSON.parse(el.textContent); } catch (e) { return; }
  var mount = document.getElementById('quiz'); if (!mount || !data.questions) return;

  data.questions.forEach(function (q, qi) {
    var qd = document.createElement('div'); qd.className = 'q'; qd.dataset.a = q.answer;
    var b = document.createElement('b'); b.textContent = (qi + 1) + '. ' + q.q; qd.appendChild(b);
    q.options.forEach(function (o, oi) {
      var lab = document.createElement('label'); lab.className = 'opt';
      var inp = document.createElement('input'); inp.type = 'radio'; inp.name = 'q' + qi; inp.value = oi;
      lab.appendChild(inp); lab.appendChild(document.createTextNode(' ' + o)); qd.appendChild(lab);
    });
    if (q.explain) { var e = document.createElement('div'); e.className = 'exp'; e.textContent = '→ ' + q.explain; qd.appendChild(e); }
    mount.appendChild(qd);
  });

  var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'btn'; btn.textContent = 'Valider le quiz';
  var res = document.createElement('div'); res.className = 'score';
  btn.addEventListener('click', function () {
    var score = 0, qs = mount.querySelectorAll('.q');
    qs.forEach(function (qd) {
      var a = +qd.dataset.a, sel = qd.querySelector('input:checked');
      var opts = qd.querySelectorAll('.opt');
      opts.forEach(function (opt, oi) { opt.classList.remove('correct', 'wrong'); if (oi === a) opt.classList.add('correct'); });
      if (sel) { var v = +sel.value; if (v === a) score++; else opts[v].classList.add('wrong'); }
      var ex = qd.querySelector('.exp'); if (ex) ex.classList.add('show');
    });
    var total = data.questions.length;
    res.textContent = 'Score : ' + score + '/' + total + (score / total >= 0.7 ? ' — réussi ! 🎉  Créez un compte pour suivre votre progression.' : ' — créez un compte pour vous entraîner sur tous les modules.');
  });
  mount.appendChild(btn); mount.appendChild(res);
})();
