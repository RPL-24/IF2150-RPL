
(function () {
  var KUNCI = 'lawhubUsername';
  var form = document.getElementById('form-login');
  var isian = document.getElementById('username');
  var centang = document.getElementById('ingat');
  if (!form || !isian || !centang) return;

  try {
    var tersimpan = localStorage.getItem(KUNCI);
    if (tersimpan) { isian.value = tersimpan; centang.checked = true; }
  } catch (e) { /* localStorage tidak tersedia: abaikan */ }

  form.addEventListener('submit', function () {
    try {
      if (centang.checked) localStorage.setItem(KUNCI, isian.value);
      else localStorage.removeItem(KUNCI);
    } catch (e) { /* abaikan */ }
  });
})();
