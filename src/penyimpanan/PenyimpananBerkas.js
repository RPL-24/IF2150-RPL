// C45 PenyimpananBerkas
// Sesuai panduan M9 (bagian 2.2), implementasi menggunakan penyimpanan lokal
// pada folder src/uploads/ yang disajikan secara statis, dengan antarmuka
// simpan() dan hapus() yang tetap konsisten dengan DPPL.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DIR_UPLOADS = path.join(__dirname, '..', 'uploads');

class PenyimpananBerkas {
  constructor(direktoriBasis = DIR_UPLOADS) {
    this.direktoriBasis = direktoriBasis;
    this.pastikanDirektoriAda(this.direktoriBasis);
  }

  pastikanDirektoriAda(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Algo-072: mengunggah berkas foto/bukti dan mengembalikan daftar path berkas (KF23, KF44)
  async simpan(idObjek, daftarBerkas) {
    if (!daftarBerkas || !Array.isArray(daftarBerkas) || daftarBerkas.length === 0) {
      return [];
    }

    const targetDir = path.join(this.direktoriBasis, String(idObjek));
    this.pastikanDirektoriAda(targetDir);

    const daftarPath = [];
    const daftarPathAbsolut = [];

    try {
      for (const berkas of daftarBerkas) {
        const ekstensi = path.extname(berkas.originalname || berkas.name || '').toLowerCase() || '.png';
        const namaUnik = `${crypto.randomUUID()}${ekstensi}`;
        const pathTujuan = path.join(targetDir, namaUnik);

        if (berkas.buffer) {
          await fs.promises.writeFile(pathTujuan, berkas.buffer);
        } else if (berkas.path) {
          // Jika multer menyimpan sementara di disk
          await fs.promises.copyFile(berkas.path, pathTujuan);
          await fs.promises.unlink(berkas.path).catch(() => {});
        } else {
          throw new Error('Format berkas tidak didukung');
        }

        const pathRelatif = `/uploads/${idObjek}/${namaUnik}`;
        daftarPath.push(pathRelatif);
        daftarPathAbsolut.push(pathTujuan);
      }
      return daftarPath;
    } catch (galat) {
      // Rollback berkas yang sempat tersimpan jika terjadi kegagalan
      for (const p of daftarPathAbsolut) {
        await fs.promises.unlink(p).catch(() => {});
      }
      console.error('Unggah berkas gagal:', galat);
      return null;
    }
  }

  // Algo-073: menghapus berkas berdasarkan daftar path (KF21, KF50)
  async hapus(daftarPath) {
    if (!daftarPath || (Array.isArray(daftarPath) && daftarPath.length === 0)) {
      return true;
    }

    const arr = Array.isArray(daftarPath) ? daftarPath : [daftarPath];
    try {
      for (const p of arr) {
        if (!p) continue;
        // Bersihkan prefix /uploads/ untuk memperoleh path absolut
        const pBersih = p.startsWith('/uploads/') ? p.slice('/uploads/'.length) : p;
        const absolut = path.join(this.direktoriBasis, pBersih);
        if (fs.existsSync(absolut)) {
          await fs.promises.unlink(absolut).catch(() => {});
        }
      }
      return true;
    } catch (galat) {
      console.error('Hapus berkas gagal:', galat);
      return false;
    }
  }
}

module.exports = new PenyimpananBerkas();
