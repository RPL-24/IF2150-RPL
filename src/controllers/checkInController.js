const Pelajar = require('../models/Pelajar');
const CheckIn = require('../models/CheckIn');
const AppError = require('../utils/AppError');
const { encryptAES256 } = require('../utils/encryption');
const { kirim, tanganiAsync } = require('../utils/respon');
const { hariIni } = require('../utils/waktu');

const POLA_MAKAN_BAWAAN = 'Teratur';
const JAM_TIDUR_BAWAAN = '22:30';
const JAM_BANGUN_BAWAAN = '06:00';

/** Skala mood wajib berupa angka 1-5. */
exports.validateCheckInFormat = (data = {}) => {
  const moodValue = data.mood !== undefined ? data.mood : data.skalaMood;
  if (moodValue === undefined || moodValue === null || moodValue === '') {
    return false;
  }
  const moodNum = Number(moodValue);
  return Number.isInteger(moodNum) && moodNum >= 1 && moodNum <= 5;
};

/**
 * KNF01: catatan refleksi wajib tersimpan terenkripsi AES-256.
 * Menerima string biasa maupun objek hasil enkripsi sisi klien ({ cipher, iv, key }).
 */
exports.encryptJournal = (catatan) => {
  if (catatan === null || catatan === undefined) return null;
  const teks = typeof catatan === 'string' ? catatan : JSON.stringify(catatan);
  if (teks.trim() === '') return null;
  return encryptAES256(teks);
};

function ambilIdPengguna(req) {
  return req.user.idPengguna;
}

/** Ambil profil pelajar milik pengguna yang sedang masuk. */
async function pelajarDariSesi(req) {
  const pelajar = await Pelajar.findByIdPengguna(ambilIdPengguna(req));
  if (!pelajar) {
    throw new AppError(404, 'Profil pelajar tidak ditemukan.');
  }
  return pelajar;
}

exports.submitCheckIn = tanganiAsync(async (req, res) => {
  const pelajar = await pelajarDariSesi(req);

  const { mood, sleep = {}, meal, triggers = [], note } = req.body || {};

  if (!exports.validateCheckInFormat({ mood })) {
    throw new AppError(400, 'Skala mood wajib diisi (1-5).');
  }

  const pemicu = Array.isArray(triggers) ? triggers.join(', ') : String(triggers || '');

  const checkInData = CheckIn.createCheckIn({
    idPelajar: pelajar.idPelajar || pelajar.id_pelajar,
    skalaMood: Number(mood),
    jamTidur: sleep.bed || JAM_TIDUR_BAWAAN,
    jamBangun: sleep.wake || JAM_BANGUN_BAWAAN,
    polaMakan: meal || POLA_MAKAN_BAWAAN,
    pemicuStres: pemicu,
    catatanRefleksi: exports.encryptJournal(note),
  });

  await pelajar.setCheckIn(checkInData);

  return kirim(res, 201, 'Daily check-in berhasil disimpan.', checkInData.getCheckInData());
});

exports.getHistory = tanganiAsync(async (req, res) => {
  const pelajar = await pelajarDariSesi(req);
  const history = await pelajar.getCheckInHistory();
  return kirim(res, 200, 'Riwayat daily check-in.', history);
});

exports.getTodayStatus = tanganiAsync(async (req, res) => {
  const pelajar = await pelajarDariSesi(req);

  const checkInHariIni = await pelajar.getCheckInSejak(hariIni());
  const sudahCheckIn = checkInHariIni.length > 0;

  return kirim(res, 200, 'Status daily check-in hari ini.', {
    sudahCheckIn,
    checkIn: sudahCheckIn ? checkInHariIni[0] : null,
  });
});
