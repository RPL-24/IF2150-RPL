// C42 Kriptografi
// hash/cocokkanHash dipakai AkunController (modul A),
// enkripsi/dekripsi dipakai PercakapanController (modul D).
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const config = require('../config/env');

const PANJANG_IV = 12;
const PANJANG_TAG = 16;

class Kriptografi {
  constructor(saltRounds, kunciEnkripsi) {
    this.saltRounds = saltRounds;
    this.kunciEnkripsi = kunciEnkripsi;
  }

  // Algo-066: hash bcrypt satu arah (KF09)
  async hash(teks) {
    const garam = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(teks, garam);
  }

  // Algo-067: bandingkan teks dengan hash tersimpan (KF10)
  async cocokkanHash(teks, hash) {
    if (teks == null || hash == null) return false;
    return bcrypt.compare(teks, hash);
  }

  // Algo-068: AES-256-GCM, IV acak 12 byte per pesan (KF36)
  enkripsi(teks) {
    const iv = crypto.randomBytes(PANJANG_IV);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.ambilKunci(), iv);
    const teksSandi = Buffer.concat([cipher.update(String(teks), 'utf8'), cipher.final()]);
    return Buffer.concat([iv, cipher.getAuthTag(), teksSandi]).toString('base64');
  }

  // Algo-069: null bila kunci salah atau isi sudah diubah (tag autentikasi gagal)
  dekripsi(isiPesanTerenkripsi) {
    const kunci = this.ambilKunci();
    try {
      const data = Buffer.from(String(isiPesanTerenkripsi), 'base64');
      const iv = data.subarray(0, PANJANG_IV);
      const tag = data.subarray(PANJANG_IV, PANJANG_IV + PANJANG_TAG);
      const teksSandi = data.subarray(PANJANG_IV + PANJANG_TAG);
      const decipher = crypto.createDecipheriv('aes-256-gcm', kunci, iv);
      decipher.setAuthTag(tag);
      return Buffer.concat([decipher.update(teksSandi), decipher.final()]).toString('utf8');
    } catch {
      return null;
    }
  }

  // Kunci 32 byte dalam bentuk hex (64 karakter) dari KUNCI_ENKRIPSI_PESAN
  ambilKunci() {
    const kunci = Buffer.from(this.kunciEnkripsi || '', 'hex');
    if (kunci.length !== 32) {
      throw new Error('KUNCI_ENKRIPSI_PESAN harus 64 karakter hex (32 byte). Lihat src/README.md.');
    }
    return kunci;
  }
}

module.exports = new Kriptografi(config.bcryptSaltRounds, config.kunciEnkripsiPesan);
module.exports.Kriptografi = Kriptografi;
