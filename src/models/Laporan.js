// C36 Laporan
const crypto = require('crypto');
const db = require('../config/db');

const STATUS = Object.freeze({
  BARU: 'Baru',
  DIPROSES: 'Diproses',
  SELESAI: 'Selesai',
});

const JENIS_PELANGGARAN = Object.freeze({
  PENIPUAN: 'Penipuan',
  KONTEN_TIDAK_PANTAS: 'Konten tidak pantas',
  BUG: 'Bug atau masalah teknis',
});

const KOLOM = `id_laporan, id_pelapor, objek_dilaporkan, jenis_pelanggaran,
               teks_alasan, waktu_lapor, status_penanganan, waktu_perubahan`;

class Laporan {
  static STATUS = STATUS;
  static JENIS_PELANGGARAN = JENIS_PELANGGARAN;

  constructor(data) {
    this.idLaporan = data.idLaporan;
    this.idPelapor = data.idPelapor;
    this.objekDilaporkan = data.objekDilaporkan;
    this.jenisPelanggaran = data.jenisPelanggaran;
    this.teksAlasan = data.teksAlasan;
    this.waktuLapor = data.waktuLapor;
    this.statusPenanganan = data.statusPenanganan;
    this.waktuPerubahan = data.waktuPerubahan;
  }

  static dariBaris(baris) {
    if (!baris) return null;
    return new this({
      idLaporan: baris.id_laporan,
      idPelapor: baris.id_pelapor,
      objekDilaporkan: baris.objek_dilaporkan,
      jenisPelanggaran: baris.jenis_pelanggaran,
      teksAlasan: baris.teks_alasan,
      waktuLapor: baris.waktu_lapor,
      statusPenanganan: baris.status_penanganan,
      waktuPerubahan: baris.waktu_perubahan,
    });
  }

  // Algo-051: simpan laporan baru dengan status awal "Baru" (KF43)
  static async simpanLaporanBaru(data, client = db) {
    const idBaru = crypto.randomUUID();
    const waktuLapor = data.waktuLapor || new Date();
    const { rows } = await client.query(
      `INSERT INTO laporan (
         id_laporan, id_pelapor, objek_dilaporkan, jenis_pelanggaran,
         teks_alasan, waktu_lapor, status_penanganan, waktu_perubahan
       ) VALUES ($1, $2, $3, $4, $5, $6, 'Baru', $7)
       RETURNING id_laporan`,
      [
        idBaru,
        data.idPelapor,
        data.objekDilaporkan,
        data.jenisPelanggaran,
        data.teksAlasan,
        waktuLapor,
        waktuLapor,
      ],
    );
    return rows[0].id_laporan;
  }

  // Algo-052: mengambil seluruh laporan untuk dasbor admin (KF45)
  static async getAllLaporan() {
    const { rows } = await db.query(
      `SELECT ${KOLOM} FROM laporan ORDER BY waktu_lapor DESC`,
    );
    return rows.map((b) => this.dariBaris(b));
  }

  // Algo-053: menyaring laporan berdasarkan status penanganan (KF46)
  static async filterByStatus(status) {
    if (!['Baru', 'Diproses', 'Selesai'].includes(status)) {
      return [];
    }
    const { rows } = await db.query(
      `SELECT ${KOLOM} FROM laporan WHERE status_penanganan = $1 ORDER BY waktu_lapor DESC`,
      [status],
    );
    return rows.map((b) => this.dariBaris(b));
  }

  // Algo-054: mengambil data lengkap satu laporan (KF45)
  static async getDetailLaporan(idLaporan) {
    const { rows } = await db.query(
      `SELECT ${KOLOM} FROM laporan WHERE id_laporan = $1 LIMIT 1`,
      [idLaporan],
    );
    return this.dariBaris(rows[0]);
  }

  // Algo-055: memperbarui status penanganan beserta waktu perubahannya (KF47)
  static async updateStatusPenanganan(idLaporan, statusBaru, waktuPerubahan = new Date(), client = db) {
    if (!['Baru', 'Diproses', 'Selesai'].includes(statusBaru)) {
      return false;
    }
    const { rowCount } = await client.query(
      `UPDATE laporan
       SET status_penanganan = $1, waktu_perubahan = $2
       WHERE id_laporan = $3`,
      [statusBaru, waktuPerubahan, idLaporan],
    );
    return rowCount > 0;
  }
}

module.exports = Laporan;
