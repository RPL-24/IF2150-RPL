// C40 DokumenLegal
const db = require('../config/db');

const JENIS = Object.freeze({
  KEBIJAKAN_PRIVASI: 'kebijakan-privasi',
  KETENTUAN_PENGGUNAAN: 'ketentuan-penggunaan',
});

class DokumenLegal {
  static JENIS = JENIS;

  constructor(data) {
    this.idDokumen = data.idDokumen;
    this.jenisDokumen = data.jenisDokumen;
    this.judul = data.judul;
    this.isi = data.isi;
    this.klausaPrivasiPesan = data.klausaPrivasiPesan;
    this.versi = data.versi;
    this.tanggalBerlaku = data.tanggalBerlaku;
    this.statusPublikasi = data.statusPublikasi;
    this.tautan = data.tautan;
  }

  static dariBaris(baris) {
    if (!baris) return null;
    return new DokumenLegal({
      idDokumen: baris.id_dokumen,
      jenisDokumen: baris.jenis_dokumen,
      judul: baris.judul,
      isi: baris.isi,
      klausaPrivasiPesan: baris.klausa_privasi_pesan,
      versi: baris.versi,
      tanggalBerlaku: baris.tanggal_berlaku,
      statusPublikasi: baris.status_publikasi,
      tautan: baris.tautan,
    });
  }

  // Algo-063: versi terbaru yang terpublikasi dan sudah berlaku (KF13, KF38)
  static async getVersiTerbaru(jenis) {
    const { rows } = await db.query(
      `SELECT id_dokumen, jenis_dokumen, judul, isi, klausa_privasi_pesan, versi,
              TO_CHAR(tanggal_berlaku, 'YYYY-MM-DD') AS tanggal_berlaku, status_publikasi, tautan
       FROM dokumen_legal
       WHERE jenis_dokumen = $1
         AND status_publikasi = true
         AND tanggal_berlaku <= CURRENT_DATE
       ORDER BY tanggal_berlaku DESC, versi DESC
       LIMIT 1`,
      [jenis],
    );
    return DokumenLegal.dariBaris(rows[0]);
  }

  // KF13, KF39
  getTautan() {
    return this.tautan;
  }

  // KF13, KF38
  getIsi() {
    return this.isi;
  }
}

module.exports = DokumenLegal;
