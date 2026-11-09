const ZONA_WAKTU = 'Asia/Jakarta';
const MILIDETIK_PER_HARI = 24 * 60 * 60 * 1000;

/** Tanggal hari ini pada zona Asia/Jakarta (Algo-C06-01), berformat 'YYYY-MM-DD'. */
function hariIni() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_WAKTU }).format(new Date());
}

function keMilidetik(tanggal) {
  return Date.parse(`${tanggal}T00:00:00Z`);
}

/** Selisih hari kalender antara dua tanggal 'YYYY-MM-DD' (tanggalAkhir dikurangi tanggalAwal). */
function selisihHari(tanggalAwal, tanggalAkhir) {
  return Math.round((keMilidetik(tanggalAkhir) - keMilidetik(tanggalAwal)) / MILIDETIK_PER_HARI);
}

/** Menggeser tanggal 'YYYY-MM-DD' sebanyak sejumlah hari. */
function tambahHari(tanggal, jumlahHari) {
  return new Date(keMilidetik(tanggal) + jumlahHari * MILIDETIK_PER_HARI).toISOString().slice(0, 10);
}

/** Memeriksa format 'YYYY-MM-DD' sekaligus keberadaan tanggalnya di kalender. */
function tanggalValid(tanggal) {
  if (typeof tanggal !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
    return false;
  }
  const hasil = new Date(`${tanggal}T00:00:00Z`);
  return !Number.isNaN(hasil.getTime()) && hasil.toISOString().slice(0, 10) === tanggal;
}

/** Memeriksa format jam 'HH:mm', 00:00 sampai 23:59. */
function jamValid(jam) {
  return typeof jam === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(jam);
}

/** Usia dalam tahun penuh pada hari ini. */
function hitungUsia(tanggalLahir, acuan = hariIni()) {
  const [tahunLahir, bulanLahir, hariLahir] = tanggalLahir.split('-').map(Number);
  const [tahun, bulan, tanggal] = acuan.split('-').map(Number);
  const sudahUlangTahun = bulan > bulanLahir || (bulan === bulanLahir && tanggal >= hariLahir);
  return tahun - tahunLahir - (sudahUlangTahun ? 0 : 1);
}

/** Menggabungkan tanggal dan jam Asia/Jakarta menjadi objek Date. */
function gabungTanggalWaktu(tanggal, waktu) {
  return new Date(`${tanggal}T${waktu.slice(0, 5)}:00+07:00`);
}

module.exports = {
  ZONA_WAKTU,
  hariIni,
  selisihHari,
  tambahHari,
  tanggalValid,
  jamValid,
  hitungUsia,
  gabungTanggalWaktu,
};
