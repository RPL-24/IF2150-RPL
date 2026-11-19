// C45 PenyimpananBerkas
// Dua mode dengan antarmuka simpan() dan hapus() yang sama sesuai DPPL:
// - Lokal (bawaan): berkas disimpan di src/uploads/ dan disajikan app.js lewat /uploads/... (panduan M9 bagian 2.2).
// - Vercel Blob: aktif bila BLOB_READ_WRITE_TOKEN diisi. Dipakai saat deploy ke Vercel, karena disk serverless
//   hanya bisa dibaca dan tidak permanen. Path yang dikembalikan berupa URL publik Blob.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const config = require('../config/env');

const DIR_UPLOADS = path.join(__dirname, '..', 'uploads');

class PenyimpananBerkas {
  constructor(direktoriBasis = DIR_UPLOADS, blobToken = config.blobToken) {
    this.direktoriBasis = direktoriBasis;
    this.blobToken = blobToken;
  }

  // Folder dibuat saat pertama kali menyimpan, bukan saat modul dimuat:
  // pada Vercel, membuat folder saat server menyala akan menggagalkan seluruh aplikasi.
  pastikanDirektoriAda(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  modeBlob() {
    return Boolean(this.blobToken);
  }

  // Algo-072: mengunggah berkas foto/bukti dan mengembalikan daftar path berkas (KF23, KF44)
  async simpan(idObjek, daftarBerkas) {
    if (!daftarBerkas || !Array.isArray(daftarBerkas) || daftarBerkas.length === 0) {
      return [];
    }
    return this.modeBlob() ? this.simpanKeBlob(idObjek, daftarBerkas) : this.simpanKeDisk(idObjek, daftarBerkas);
  }

  async simpanKeDisk(idObjek, daftarBerkas) {
    const targetDir = path.join(this.direktoriBasis, String(idObjek));
    this.pastikanDirektoriAda(targetDir);

    const daftarPath = [];
    const daftarPathAbsolut = [];

    try {
      for (const berkas of daftarBerkas) {
        const namaUnik = `${crypto.randomUUID()}${PenyimpananBerkas.ekstensi(berkas)}`;
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

        daftarPath.push(`/uploads/${idObjek}/${namaUnik}`);
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

  async simpanKeBlob(idObjek, daftarBerkas) {
    const { put, del } = require('@vercel/blob');
    const daftarUrl = [];

    try {
      for (const berkas of daftarBerkas) {
        const isi = berkas.buffer || (berkas.path ? await fs.promises.readFile(berkas.path) : null);
        if (!isi) throw new Error('Format berkas tidak didukung');

        const hasil = await put(`${idObjek}/${crypto.randomUUID()}${PenyimpananBerkas.ekstensi(berkas)}`, isi, {
          access: 'public',
          token: this.blobToken,
          contentType: berkas.mimetype || undefined,
        });
        daftarUrl.push(hasil.url);
      }
      return daftarUrl;
    } catch (galat) {
      // Rollback berkas yang sempat terunggah jika terjadi kegagalan
      if (daftarUrl.length > 0) await del(daftarUrl, { token: this.blobToken }).catch(() => {});
      console.error('Unggah berkas ke Vercel Blob gagal:', galat);
      return null;
    }
  }

  // Algo-073: menghapus berkas berdasarkan daftar path (KF21, KF50)
  async hapus(daftarPath) {
    if (!daftarPath || (Array.isArray(daftarPath) && daftarPath.length === 0)) {
      return true;
    }

    const arr = (Array.isArray(daftarPath) ? daftarPath : [daftarPath]).filter(Boolean);
    // URL Blob dihapus lewat Blob; path /uploads/ dihapus dari disk, termasuk data lama sebelum pindah ke Blob
    const daftarUrl = arr.filter((p) => /^https?:\/\//i.test(p));
    const daftarLokal = arr.filter((p) => !/^https?:\/\//i.test(p));

    try {
      if (daftarUrl.length > 0) {
        if (!this.modeBlob()) {
          console.warn('URL Blob tidak dihapus karena BLOB_READ_WRITE_TOKEN tidak diisi:', daftarUrl);
        } else {
          const { del } = require('@vercel/blob');
          await del(daftarUrl, { token: this.blobToken });
        }
      }
      for (const p of daftarLokal) {
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

  static ekstensi(berkas) {
    return path.extname(berkas.originalname || berkas.name || '').toLowerCase() || '.png';
  }
}

module.exports = new PenyimpananBerkas();
