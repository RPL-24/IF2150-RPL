// C17 FilterController
// Memvalidasi kriteria penyaringan dan pengurutan katalog (KF27, KF28, KF29, KF30).

const UKURAN_HALAMAN = 20; // KF28: maksimal 20 listing per halaman
const PANJANG_MAKS_ID_REFERENSI = 50; // sesuai VARCHAR(50) pada barang.id_kategori/id_lokasi
const URUTAN = Object.freeze(['terbaru', 'termurah', 'termahal']);
const URUTAN_BAWAAN = 'terbaru';

function galatValidasi(pesan) {
  const galat = new Error(pesan);
  galat.status = 400;
  return galat;
}

function kosong(nilai) {
  return nilai === undefined || nilai === null || String(nilai).trim() === '';
}

function bacaHarga(nilai, label) {
  if (kosong(nilai)) return null;
  const angka = Number(String(nilai).trim());
  if (!Number.isFinite(angka) || angka < 0) {
    throw galatValidasi(`${label} harus berupa angka tidak negatif.`);
  }
  return angka;
}

function bacaReferensi(nilai, label) {
  if (kosong(nilai)) return null;
  const teks = String(nilai).trim();
  if (teks.length > PANJANG_MAKS_ID_REFERENSI) {
    throw galatValidasi(`${label} tidak valid.`);
  }
  return teks;
}

function bacaHalaman(nilai) {
  if (kosong(nilai)) return 1;
  const teks = String(nilai).trim();
  if (!/^\d+$/.test(teks) || Number(teks) < 1) {
    throw galatValidasi('Nomor halaman harus bilangan bulat mulai dari 1.');
  }
  return Number(teks);
}

function bacaUrutan(nilai) {
  if (kosong(nilai)) return URUTAN_BAWAAN;
  const teks = String(nilai).trim().toLowerCase();
  if (!URUTAN.includes(teks)) {
    throw galatValidasi(`Urutan harus salah satu dari: ${URUTAN.join(', ')}.`);
  }
  return teks;
}

// Mengubah query string katalog menjadi kriteria filter yang tervalidasi.
// Semua kriteria berlaku sekaligus (KF29).
function validasiFilter(query = {}) {
  const hargaMin = bacaHarga(query.hargaMin, 'Harga minimum');
  const hargaMaks = bacaHarga(query.hargaMaks, 'Harga maksimum');
  if (hargaMin !== null && hargaMaks !== null && hargaMin > hargaMaks) {
    throw galatValidasi('Harga minimum tidak boleh lebih besar dari harga maksimum.');
  }

  return {
    kategori: bacaReferensi(query.kategori, 'Kategori'),
    lokasi: bacaReferensi(query.lokasi, 'Lokasi COD'),
    hargaMin,
    hargaMaks,
    urut: bacaUrutan(query.urut),
    halaman: bacaHalaman(query.halaman),
  };
}

// Menghitung batas dan offset query untuk nomor halaman tertentu.
function hitungPaginasi(halaman, ukuranHalaman = UKURAN_HALAMAN) {
  return { batas: ukuranHalaman, offset: (halaman - 1) * ukuranHalaman };
}

module.exports = {
  UKURAN_HALAMAN,
  URUTAN,
  URUTAN_BAWAAN,
  validasiFilter,
  hitungPaginasi,
};
