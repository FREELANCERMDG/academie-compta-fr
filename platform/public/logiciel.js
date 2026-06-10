/* Logiciel comptable — saisie d'écriture : lignes dynamiques + équilibre en direct.
   Les lignes sont sérialisées en JSON dans le champ caché #cpta-json à l'envoi. */
(function () {
  var form = document.getElementById('cpta-form'); if (!form) return;
  var body = document.getElementById('cpta-lines');
  var json = document.getElementById('cpta-json');
  var totD = document.getElementById('cpta-td'), totC = document.getElementById('cpta-tc'), bal = document.getElementById('cpta-bal');
  function num(v) { v = ('' + (v || '')).replace(/\s/g, '').replace(',', '.').replace(/[^0-9.\-]/g, ''); var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function fmt(n) { return (Math.round(n * 100) / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function newRow() {
    var tr = document.createElement('tr');
    tr.innerHTML = '<td><input class="cc" placeholder="ex. 607" autocomplete="off" style="width:100%"></td><td><input class="cl" placeholder="libellé" style="width:100%"></td><td><input class="cd" inputmode="decimal" placeholder="0,00" style="width:100%;text-align:right"></td><td><input class="cr" inputmode="decimal" placeholder="0,00" style="width:100%;text-align:right"></td><td style="text-align:center"><button type="button" class="rm" title="Supprimer" style="border:none;background:#fbe7e7;color:#c0392b;border-radius:6px;width:26px;height:26px;cursor:pointer">×</button></td>';
    body.appendChild(tr);
  }
  function recompute() {
    var d = 0, c = 0;
    body.querySelectorAll('tr').forEach(function (tr) { d += num(tr.querySelector('.cd').value); c += num(tr.querySelector('.cr').value); });
    totD.textContent = fmt(d); totC.textContent = fmt(c);
    var eq = Math.abs(d - c) < 0.005 && d > 0;
    bal.textContent = eq ? 'équilibré ✓' : ('déséquilibré (écart ' + fmt(Math.abs(d - c)) + ')');
    bal.style.color = eq ? '#1f8a4c' : '#c0392b';
  }
  var addBtn = document.getElementById('cpta-add');
  if (addBtn) addBtn.addEventListener('click', function () { newRow(); });
  body.addEventListener('click', function (e) { if (e.target.classList.contains('rm')) { if (body.querySelectorAll('tr').length > 1) e.target.closest('tr').remove(); recompute(); } });
  body.addEventListener('input', recompute);
  form.addEventListener('submit', function () {
    var lignes = [];
    body.querySelectorAll('tr').forEach(function (tr) {
      var cpt = tr.querySelector('.cc').value.replace(/\s/g, '');
      var d = num(tr.querySelector('.cd').value), c = num(tr.querySelector('.cr').value);
      if (cpt && (d || c)) lignes.push({ compte: cpt, libelle: tr.querySelector('.cl').value, debit: d, credit: c });
    });
    json.value = JSON.stringify(lignes);
  });
  recompute();
})();
