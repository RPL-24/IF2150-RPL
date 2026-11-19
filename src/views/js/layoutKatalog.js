/* Penyesuaian layout bersama (topbar dari Kerangka.js) untuk halaman Modul C:
   kotak cari di topbar dijadikan pencarian sungguhan tanpa memuat ulang halaman. */
const LayoutKatalog = {
  // Mengganti kotak cari statis di topbar dengan formulir pencarian (KF25).
  // onCari(kataKunci) dipanggil saat formulir dikirim.
  pasangPencarian(nilaiAwal, onCari) {
    const lama = document.querySelector('.topbar .searchbar');
    if (!lama) return null;
    const form = ListingUI.el('form', 'searchbar searchbar--aktif');
    form.setAttribute('role', 'search');
    const input = ListingUI.el('input', 'searchbar__input');
    input.type = 'search';
    input.name = 'q';
    input.maxLength = 100;
    input.placeholder = 'Cari di ITBELI';
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
