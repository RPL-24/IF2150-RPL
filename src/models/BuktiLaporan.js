// C37 BuktiLaporan
const crypto = require('crypto');
const db = require('../config/db');

class BuktiLaporan {
  constructor(data) {
    this.idBukti = data.idBukti;
    this.idLaporan = data.idLaporan;
    this.namaBerkas = data.namaBerkas;
    this.pathBerkas = data.pathBerkas;
  }

  static dariBaris(baris) {
    if (!baris) return null;
    return new this({
      idBukti: baris.id_bukti,
      idLaporan: baris.id_laporan,
      namaBerkas: baris.nama_berkas,
      pathBerkas: baris.path_berkas,
    });
  }

  // Algo-056: memeriksa bahwa sedikitnya satu berkas bukti tangkapan layar terlampir dan tidak kosong (KF44)
  static validasiLampiranWajib(berkas) {
    if (!berkas || !Array.isArray(berkas) || berkas.length === 0) {
      return false;
    }
    for (const f of berkas) {
      const ukuran = f?.size ?? f?.ukuran ?? 0;
      if (!f || ukuran === 0) {
        return false;
      }
    }
    return true;
  }

  // Algo-057: persistensi metadata berkas bukti laporan (KF44)
  static async simpan(idLaporan, namaBerkas, pathBerkas, client = db) {
    const idBaru = crypto.randomUUID();
    const { rowCount } = await client.query(
      `INSERT INTO bukti_laporan (id_bukti, id_laporan, nama_berkas, path_berkas)
       VALUES ($1, $2, $3, $4)`,
      [idBaru, idLaporan, namaBerkas, pathBerkas],
    );
    return rowCount > 0;
  }

  static async cariByLaporan(idLaporan) {
    const { rows } = await db.query(
      `SELECT id_bukti, id_laporan, nama_berkas, path_berkas
       FROM bukti_laporan WHERE id_laporan = $1`,
      [idLaporan],
    );
    return rows.map((b) => this.dariBaris(b));
  }
}

module.exports = BuktiLaporan;
