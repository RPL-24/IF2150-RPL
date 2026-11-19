// C16 PencarianController
// Menormalisasi kata kunci pencarian sebelum dicocokkan ke judul dan deskripsi listing (KF25, KF26).

const PANJANG_MAKS_KATA_KUNCI = 100;
const JUMLAH_MAKS_KATA = 5;

// Merapikan kata kunci: huruf kecil, spasi berlebih dibuang, panjang dibatasi.
function normalisasiKataKunci(kataKunci) {
  if (kataKunci === undefined || kataKunci === null) return '';
  return String(kataKunci)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, PANJANG_MAKS_KATA_KUNCI)
    .trim();
}

// Memecah kata kunci menjadi kata-kata unik. Setiap kata harus muncul di judul atau
// deskripsi, sehingga "meja belajar" juga menemukan "Meja kayu untuk belajar".
function pecahKataKunci(kataKunciNormal) {
  if (!kataKunciNormal) return [];
  const unik = [...new Set(kataKunciNormal.split(' ').filter(Boolean))];
  return unik.slice(0, JUMLAH_MAKS_KATA);
}

// Menyiapkan kriteria pencarian dari kata kunci mentah yang dikirim pengguna.
function siapkanPencarian(kataKunci) {
  const normal = normalisasiKataKunci(kataKunci);
  return { kataKunci: normal, daftarKata: pecahKataKunci(normal) };
}

module.exports = {
  PANJANG_MAKS_KATA_KUNCI,
  JUMLAH_MAKS_KATA,
  normalisasiKataKunci,
  pecahKataKunci,
  siapkanPencarian,
};
