const Pelajar = require('../models/Pelajar');
const OrangTuaWali = require('../models/OrangTuaWali');
const LaporanKesehatan = require('../models/LaporanKesehatan');
const AppError = require('../utils/AppError');
const { decryptAES256 } = require('../utils/encryption');
const { hariIni, tambahHari } = require('../utils/waktu');
const { kirim, tanganiAsync } = require('../utils/respon');

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const URUTAN_POLA_MAKAN = ['Teratur', 'Kurang teratur', 'Tidak teratur'];

/** Samakan label pola makan lama/free-text ke tiga kategori resmi form check-in. */
function normalisasiPolaMakan(nilai) {
  const teks = String(nilai || '').trim().toLowerCase();
  if (teks === '') return 'Tidak diisi';
  if (teks.includes('tidak')) return 'Tidak teratur';
  if (teks.includes('kurang')) return 'Kurang teratur';
  if (teks.includes('teratur')) return 'Teratur';
  return 'Tidak diisi';
}
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function angka(nilai, digit = 1) {
  if (!Number.isFinite(nilai)) return 0;
  return Math.round(nilai * 10 ** digit) / 10 ** digit;
}

function rata(daftar) {
  if (!daftar.length) return 0;
  return daftar.reduce((total, nilai) => total + nilai, 0) / daftar.length;
}

function durasiTidur(isi) {
  return LaporanKesehatan.hitungDurasiTidur(isi.jamTidur, isi.jamBangun);
}

const PEMICU_NETRAL = ['', '-', 'tidak ada', 'tidak', 'none'];

/** Samakan nama pemicu lama ke daftar yang tampil di form check-in. */
function normalisasiPemicu(nilai) {
  const teks = String(nilai || '').trim().toLowerCase();
  if (PEMICU_NETRAL.includes(teks)) return null;
  if (teks.includes('akademik') || teks.includes('ujian') || teks.includes('tugas')) return 'Akademik';
  if (teks.includes('keluarga')) return 'Keluarga';
  if (teks.includes('relasi') || teks.includes('teman')) return 'Relasi';
  if (teks.includes('kesehatan') || teks.includes('tidur')) return 'Kesehatan';
  if (teks.includes('keuangan') || teks.includes('uang')) return 'Keuangan';
  return 'Lainnya';
}

/** Pemicu unik dalam satu hari; sinonim tidak dihitung dua kali. */
function daftarPemicu(isi) {
  const unik = new Set();
  String(isi.pemicuStres || '')
    .split(',')
    .map((teks) => teks.trim())
    .filter(Boolean)
    .forEach((teks) => {
      const nama = normalisasiPemicu(teks);
      if (nama) unik.add(nama);
    });
  return [...unik];
}

function jumlahPemicu(isi) {
  return daftarPemicu(isi).length;
}

function indeksKesehatan(rerataMood, rerataTidur) {
  if (!rerataMood && !rerataTidur) return 0;
  const skorMood = (rerataMood / 5) * 60;
  const skorTidur = (Math.min(rerataTidur, 9) / 9) * 40;
  return Math.round(skorMood + skorTidur);
}

function statusIndeks(indikator) {
  if (indikator === 'Rendah') return 'Stabil';
  if (indikator === 'Sedang') return 'Perlu Perhatian';
  if (indikator === 'Tinggi') return 'Risiko Tinggi';
  return 'Belum Ada Data';
}

/** Hitung streak hari check-in berturut-turut sampai hari ini. */
function hitungStreak(daftar) {
    const tanggal = new Set(daftar.map((isi) => isi.tanggalCheckIn));
    let streak = 0;
    let kursor = hariIni();
    while (tanggal.has(kursor)) {
        streak += 1;
        kursor = tambahHari(kursor, -1);
    }
    return streak;
}

function formatTanggalPendek(iso) {
  const [tahun, bulan, hari] = iso.split('-').map(Number);
  return `${HARI[new Date(tahun, bulan - 1, hari).getDay()]} ${hari}/${bulan}`;
}

const NAMA_MINGGU = ['Pertama', 'Kedua', 'Ketiga', 'Keempat', 'Kelima'];

/** Kelompokkan check-in per hari, minggu kalender dalam bulan, atau bulan. */
function kelompokkan(daftar, jenis) {
  const hasil = new Map();
  daftar.forEach((isi) => {
    const [tahun, bulan, hari] = isi.tanggalCheckIn.split('-').map(Number);
    let kunci;
    let urut;
    if (jenis === 'hari') {
      kunci = isi.tanggalCheckIn;
      urut = new Date(tahun, bulan - 1, hari).getTime();
    } else if (jenis === 'minggu') {
      const minggu = Math.ceil(hari / 7);
      kunci = `${tahun}-${bulan}-${minggu}`;
      urut = new Date(tahun, bulan - 1, (minggu - 1) * 7 + 1).getTime();
    } else {
      kunci = `${tahun}-${bulan}`;
      urut = new Date(tahun, bulan - 1, 1).getTime();
    }
    if (!hasil.has(kunci)) hasil.set(kunci, { urut, isi: [] });
    hasil.get(kunci).isi.push(isi);
  });
  return [...hasil.entries()].sort((a, b) => a[1].urut - b[1].urut);
}

function seriChart(daftar) {
  const buat = (jenis, batas) => {
    const grup = kelompokkan(daftar, jenis).slice(-batas);
    const lintasBulan = new Set(grup.map(([kunci]) => kunci.split('-').slice(0, 2).join('-'))).size > 1;
    const label = grup.map(([kunci]) => {
      if (jenis === 'hari') return formatTanggalPendek(kunci);
      if (jenis === 'minggu') {
        const [, bulan, minggu] = kunci.split('-').map(Number);
        const nama = `Minggu ${NAMA_MINGGU[minggu - 1] || minggu}`;
        return lintasBulan ? `${nama} ${BULAN[bulan - 1]}` : nama;
      }
      const [tahun, bulan] = kunci.split('-').map(Number);
      return `${BULAN[bulan - 1]} ${tahun}`;
    });
    const isi = grup.map(([, nilai]) => nilai.isi);
    return {
      label,
      mood: isi.map((harian) => angka(rata(harian.map((x) => x.skalaMood)))),
      tidur: isi.map((harian) => angka(rata(harian.map(durasiTidur)))),
      frekuensi: isi.map((harian) => angka(rata(harian.map(jumlahPemicu))))
    };
  };
  return { 7: buat('hari', 7), 30: buat('minggu', 5), 90: buat('bulan', 3) };
}

async function dataPelajar(req) {
  const pelajar = await Pelajar.findByIdPengguna(req.user.idPengguna);
  if (!pelajar) throw new AppError(404, 'Profil pelajar tidak ditemukan.');
  return pelajar;
}

async function rangkumanPelajar(pelajar, { denganCatatan = false } = {}) {
  const awal = tambahHari(hariIni(), -89);
  const daftar = await pelajar.getCheckInSejak(awal, { denganJurnal: denganCatatan });
  const tanggalTerakhir = await pelajar.getTanggalCheckInTerakhir();
  const laporan = new LaporanKesehatan();
  laporan.evaluateThreshold(
    await pelajar.getCheckInSejak(tambahHari(hariIni(), -6)),
    { tanggalTerakhir }
  );

  const isi = daftar.map((item) => item.getCheckInData());
  const rerataMood = angka(rata(isi.map((item) => item.skalaMood)));
  const rerataTidur = angka(rata(isi.map(durasiTidur)));
  const terbaru = isi[0] || null;

  const catatan = [];
  if (denganCatatan) {
    daftar.forEach((item) => {
      const data = item.getCheckInData();
      if (!data.catatanRefleksi) return;
      let teks = '';
      try {
        teks = decryptAES256(data.catatanRefleksi);
      } catch (error) {
        teks = '';
      }
      if (teks) catatan.push({ tanggal: data.tanggalCheckIn, catatan: teks });
    });
  }

  const jenisMakan = {};
  isi.forEach((item) => {
    const kunci = normalisasiPolaMakan(item.polaMakan);
    jenisMakan[kunci] = (jenisMakan[kunci] || 0) + 1;
  });

  const hitungPemicu = {};
  isi.forEach((item) => {
    daftarPemicu(item).forEach((pemicu) => {
      hitungPemicu[pemicu] = (hitungPemicu[pemicu] || 0) + 1;
    });
  });
  const totalPemicu = Object.values(hitungPemicu).reduce((total, nilai) => total + nilai, 0);
  const stres = {};
  Object.entries(hitungPemicu).forEach(([nama, nilai]) => {
    stres[nama] = Math.round((nilai / totalPemicu) * 100);
  });

  return {
    nama: pelajar.nama,
    usia: null,
    periode: laporan.periode,
    ringkasanKondisi: laporan.ringkasanKondisi,
    indikatorRisiko: laporan.indikatorRisiko,
    jumlahHariTidakCheckIn: laporan.jumlahHariTidakCheckIn,
    sudahCheckIn: Boolean(terbaru && terbaru.tanggalCheckIn === hariIni()),
    statistik: {
      streak: hitungStreak(isi),
      rerataMood,
      rerataTidur,
      polaMakan: terbaru ? normalisasiPolaMakan(terbaru.polaMakan) : '-',
      indeks: indeksKesehatan(rerataMood, rerataTidur),
      indeksStatus: statusIndeks(laporan.indikatorRisiko)
    },
    seri: seriChart(isi),
    jenisMakan: URUTAN_POLA_MAKAN.map((nama) => ({ nama, nilai: jenisMakan[nama] || 0 })),
    stres: Object.entries(stres).map(([nama, persen]) => ({ nama, persen })),
    rerataPemicu: angka(rata(isi.map(jumlahPemicu))),
    catatan
  };
}

function usiaDari(tanggalLahir) {
  if (!tanggalLahir) return null;
  const lahir = new Date(tanggalLahir);
  if (Number.isNaN(lahir.getTime())) return null;
  const sekarang = new Date();
  let usia = sekarang.getFullYear() - lahir.getFullYear();
  const belumUlangTahun =
    sekarang.getMonth() < lahir.getMonth() ||
    (sekarang.getMonth() === lahir.getMonth() && sekarang.getDate() < lahir.getDate());
  return belumUlangTahun ? usia - 1 : usia;
}

/** UC04 - ringkasan laporan kesehatan untuk pelajar atau wali. */
exports.summary = tanganiAsync(async (req, res) => {
  const peran = req.user.role;

  if (peran === 'OrangTuaWali') {
    const wali = await OrangTuaWali.findByIdPengguna(req.user.idPengguna);
    if (!wali) throw new AppError(404, 'Profil wali tidak ditemukan.');
    const ringkasan = await wali.getSummaryReport();
    const pelajar = await Pelajar.findById(
      (await wali.pilihPelajar()).idPelajar
    );
    const data = await rangkumanPelajar(pelajar, { denganCatatan: false });
    return kirim(res, 200, 'Ringkasan laporan pelajar.', {
      ...data,
      nama: data.nama,
      usia: usiaDari(pelajar.tanggalLahir),
      ringkasanKondisi: ringkasan.ringkasanKondisi,
      indikatorRisiko: ringkasan.indikatorRisiko,
      jumlahHariTidakCheckIn: ringkasan.jumlahHariTidakCheckIn,
      periode: ringkasan.periode
    });
  }

  if (peran !== 'Pelajar') {
    throw new AppError(403, 'Laporan ini hanya untuk pelajar dan orang tua/wali.');
  }

  const pelajar = await dataPelajar(req);
  const data = await rangkumanPelajar(pelajar, { denganCatatan: true });
  return kirim(res, 200, 'Ringkasan laporan kesehatan.', {
    ...data,
    usia: usiaDari(pelajar.tanggalLahir)
  });
});

/** Riwayat check-in terakhir untuk grafik dan catatan refleksi pelajar. */
exports.riwayat = tanganiAsync(async (req, res) => {
  if (req.user.role !== 'Pelajar') {
    throw new AppError(403, 'Riwayat check-in hanya untuk pelajar.');
  }
  const pelajar = await dataPelajar(req);
  const daftar = await pelajar.getCheckInHistory(30);
  const hasil = daftar.map((item) => {
    const data = item.getCheckInData();
    let catatan = '';
    if (data.catatanRefleksi) {
      try {
        catatan = decryptAES256(data.catatanRefleksi);
      } catch (error) {
        catatan = '';
      }
    }
    return {
      tanggal: data.tanggalCheckIn,
      mood: data.skalaMood,
      tidur: angka(durasiTidur(data)),
      polaMakan: data.polaMakan,
      pemicu: data.pemicuStres,
      catatan
    };
  });
  return kirim(res, 200, 'Riwayat check-in.', hasil);
});
