const { randomUUID } = require('crypto');

class CheckIn {
    constructor(baris) {
        this.idCheckIn = baris.id_check_in;
        this.idPelajar = baris.id_pelajar;
        this.tanggalCheckIn = baris.tanggal_check_in;
        this.skalaMood = baris.skala_mood;
        this.jamTidur = baris.jam_tidur;
        this.jamBangun = baris.jam_bangun;
        this.polaMakan = baris.pola_makan;
        this.pemicuStres = baris.pemicu_stres;
        this.catatanRefleksi = baris.catatan_refleksi;
    }

    static createCheckIn(data) {
        return new CheckIn({
            id_check_in: `CHK-${randomUUID()}`,
            id_pelajar: data.idPelajar || null,
            tanggal_check_in: data.tanggalCheckIn,
            skala_mood: data.skalaMood,
            jam_tidur: data.jamTidur,
            jam_bangun: data.jamBangun,
            pola_makan: data.polaMakan,
            pemicu_stres: data.pemicuStres,
            catatan_refleksi: data.catatanRefleksi
        });
    }

    getCheckInData() {
        return {
            idCheckIn: this.idCheckIn,
            tanggalCheckIn: this.tanggalCheckIn,
            skalaMood: this.skalaMood,
            jamTidur: this.jamTidur,
            jamBangun: this.jamBangun,
            polaMakan: this.polaMakan,
            pemicuStres: this.pemicuStres,
            catatanRefleksi: this.catatanRefleksi
        };
    }
}

module.exports = CheckIn;
const AppError = require('../utils/AppError');
const { hariIni, jamValid } = require('../utils/waktu');

/** C06 - Satu pengisian daily check-in. */
class CheckIn {
  constructor(baris = {}) {
    this.idCheckIn = baris.id_check_in;
    this.tanggalCheckIn = baris.tanggal_check_in;
    this.skalaMood = baris.skala_mood;
    this.jamTidur = baris.jam_tidur ? baris.jam_tidur.slice(0, 5) : baris.jam_tidur;
    this.jamBangun = baris.jam_bangun ? baris.jam_bangun.slice(0, 5) : baris.jam_bangun;
    this.polaMakan = baris.pola_makan;
    this.pemicuStres = baris.pemicu_stres;
    this.catatanRefleksi = baris.catatan_refleksi ?? null;
  }

  /** Algo-C06-01. data.catatanRefleksi sudah berupa ciphertext, atau null tanpa refleksi. */
  static createCheckIn(data) {
    const checkIn = new CheckIn();
    checkIn.idCheckIn = randomUUID();
    checkIn.tanggalCheckIn = hariIni();
    checkIn.skalaMood = data.skalaMood;
    checkIn.jamTidur = data.jamTidur;
    checkIn.jamBangun = data.jamBangun;
    checkIn.polaMakan = String(data.polaMakan ?? '').trim();
    checkIn.pemicuStres = String(data.pemicuStres ?? '').trim();
    checkIn.catatanRefleksi = data.catatanRefleksi ?? null;

    if (!checkIn.validateData()) {
      throw new AppError(400, 'Data check-in tidak valid.');
    }
    return checkIn;
  }

  getCheckInData() {
    return {
      idCheckIn: this.idCheckIn,
      tanggalCheckIn: this.tanggalCheckIn,
      skalaMood: this.skalaMood,
      jamTidur: this.jamTidur,
      jamBangun: this.jamBangun,
      polaMakan: this.polaMakan,
      pemicuStres: this.pemicuStres,
      catatanRefleksi: this.catatanRefleksi,
    };
  }

  /** Algo-C06-02 */
  validateData() {
    if (!Number.isInteger(this.skalaMood) || this.skalaMood < 1 || this.skalaMood > 5) {
      return false;
    }
    if (!jamValid(this.jamTidur) || !jamValid(this.jamBangun)) {
      return false;
    }
    if (this.jamTidur === this.jamBangun) {
      return false;
    }
    if (this.polaMakan === '') {
      return false;
    }
    if (this.tanggalCheckIn > hariIni()) {
      return false;
    }
    return this.catatanRefleksi !== '';
  }
}

module.exports = CheckIn;
