const { hariIni, selisihHari } = require('../utils/waktu');

const BATAS_MOOD_RENDAH = 2;
const HARI_MOOD_RENDAH_BERUNTUN = 3;
const BATAS_RATA_MOOD_SEDANG = 2.5;
const BATAS_RATA_TIDUR_JAM = 5;
const BATAS_HARI_TIDAK_CHECKIN = 3;

function keMenit(jam) {
  const [hh, mm] = jam.split(':').map(Number);
  return hh * 60 + mm;
}

/** Durasi tidur dalam jam, termasuk yang melewati tengah malam. */
function hitungDurasiTidur(jamTidur, jamBangun) {
  let durasi = keMenit(jamBangun) - keMenit(jamTidur);
  if (durasi <= 0) {
    durasi += 24 * 60;
  }
  return durasi / 60;
}

function bulatkan(nilai) {
  return Math.round(nilai * 10) / 10;
}

/** C07 - Hasil olahan check-in, dihitung ulang setiap kali dipanggil dan tidak disimpan sebagai tabel. */
class LaporanKesehatan {
  constructor() {
    this.periode = null;
    this.ringkasanKondisi = null;
    this.indikatorRisiko = null;
    this.jumlahHariTidakCheckIn = null;
  }

  /**
   * Algo-C07-01. tanggalTerakhir adalah check-in terakhir sepanjang riwayat, dipakai saat
   * periode yang dilaporkan kosong agar pelajar yang lama berhenti tidak terhitung 0 hari.
   */
  evaluateThreshold(data, { tanggalTerakhir = null, acuan = hariIni() } = {}) {
    if (data.length === 0) {
      this.periode = 'Mingguan';
      this.ringkasanKondisi = 'Belum ada data check-in pada periode ini.';
      this.indikatorRisiko = 'Belum Dapat Dinilai';
      this.jumlahHariTidakCheckIn = tanggalTerakhir ? selisihHari(tanggalTerakhir, acuan) : 0;
      return this.hasil(false);
    }

    const urut = data
      .map((checkIn) => checkIn.getCheckInData())
      .sort((a, b) => (a.tanggalCheckIn < b.tanggalCheckIn ? 1 : -1));
    const terbaru = urut[0].tanggalCheckIn;
    const rentangHari = selisihHari(urut[urut.length - 1].tanggalCheckIn, terbaru) + 1;
    this.periode = rentangHari <= 7 ? 'Mingguan' : 'Bulanan';
    this.jumlahHariTidakCheckIn = selisihHari(terbaru, acuan);

    let totalMood = 0;
    let totalTidur = 0;
    let moodRendahBeruntun = 0;
    let masihBeruntun = true;
    let tanggalSebelumnya = null;
    urut.forEach((isi) => {
      totalMood += isi.skalaMood;
      totalTidur += hitungDurasiTidur(isi.jamTidur, isi.jamBangun);
      const berurutan =
        tanggalSebelumnya === null || selisihHari(isi.tanggalCheckIn, tanggalSebelumnya) === 1;
      if (masihBeruntun && berurutan && isi.skalaMood <= BATAS_MOOD_RENDAH) {
        moodRendahBeruntun += 1;
      } else {
        masihBeruntun = false;
      }
      tanggalSebelumnya = isi.tanggalCheckIn;
    });
    const rataMood = totalMood / urut.length;
    const rataTidur = totalTidur / urut.length;

    if (moodRendahBeruntun >= HARI_MOOD_RENDAH_BERUNTUN) {
      this.indikatorRisiko = 'Tinggi';
    } else if (rataMood <= BATAS_RATA_MOOD_SEDANG || rataTidur < BATAS_RATA_TIDUR_JAM) {
      this.indikatorRisiko = 'Sedang';
    } else {
      this.indikatorRisiko = 'Rendah';
    }

    this.ringkasanKondisi =
      `Rata-rata mood ${bulatkan(rataMood)} dari 5, rata-rata tidur ${bulatkan(rataTidur)} jam, ` +
      `${this.jumlahHariTidakCheckIn} hari tanpa check-in.`;

    return this.hasil(
      this.indikatorRisiko === 'Tinggi' || this.jumlahHariTidakCheckIn >= BATAS_HARI_TIDAK_CHECKIN
    );
  }

  hasil(ambangTerlampaui) {
    return {
      periode: this.periode,
      ringkasanKondisi: this.ringkasanKondisi,
      indikatorRisiko: this.indikatorRisiko,
      jumlahHariTidakCheckIn: this.jumlahHariTidakCheckIn,
      ambangTerlampaui,
    };
  }

  /** Algo-C07-02 */
  detectEmergency() {
    if (!this.indikatorRisiko || this.indikatorRisiko === 'Belum Dapat Dinilai') {
      return false;
    }
    const tidakAktif = this.jumlahHariTidakCheckIn >= BATAS_HARI_TIDAK_CHECKIN;
    const memburuk = this.indikatorRisiko === 'Tinggi' || this.indikatorRisiko === 'Sedang';
    return tidakAktif && memburuk;
  }
}

LaporanKesehatan.hitungDurasiTidur = hitungDurasiTidur;

module.exports = LaporanKesehatan;
