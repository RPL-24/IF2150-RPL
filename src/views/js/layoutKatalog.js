/* Penyesuaian layout bersama (topbar & rail dari ListingUI.mulai) untuk halaman Modul C:
   menu Katalog diaktifkan dan kotak cari di topbar dijadikan pencarian sungguhan. */
const LayoutKatalog = {
  // Menandai menu Katalog sebagai aktif dan menautkannya ke /katalog.
  aktifkanMenu() {
    for (const a of document.querySelectorAll('#listing-rail nav a')) {
      const katalog = a.textContent.trim() === 'Katalog';
      a.classList.toggle('is-active', katalog);
      if (katalog) {
        a.href = '/katalog';
        a.removeAttribute('aria-disabled');
        a.removeAttribute('title');
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    }
  },

  // Mengganti kotak cari statis di topbar dengan formulir pencarian (KF25).
  // onCari(kataKunci) dipanggil saat formulir dikirim.
  pasangPencarian(nilaiAwal, onCari) {
    const lama = document.querySelector('#listing-topbar .searchbar');
    if (!lama) return null;
    const form = ListingUI.el('form', 'searchbar searchbar--aktif');
    form.setAttribute('role', 'search');
    const input = ListingUI.el('input', 'searchbar__input');
    input.type = 'search';
    input.name = 'q';
    input.maxLength = 100;
    input.placeholder = 'Cari jas praktikum, buku, kalkulator…';
    input.setAttribute('aria-label', 'Cari barang');
    input.value = nilaiAwal || '';
    form.append(ListingUI.el('span', 'ic ic--search'), input);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      onCari(input.value);
    });
    lama.replaceWith(form);
    return input;
  },
};
