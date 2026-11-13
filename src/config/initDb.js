const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');
const { encryptAES256 } = require('../utils/encryption');

// Penanda hash pada seed.sql untuk akun uji. Hanya akun dengan penanda ini yang passwordnya diatur ulang.
const HASH_PENANDA_SEED = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5u4n2M1x0v8z5e7a9K1b2c3d';

/**
 * Mengganti penanda hash akun uji dengan hash bcrypt valid untuk 'Password123!'
 * (cost factor 12 sesuai Algo-C01-04). Akun lain tidak tersentuh.
 * @returns {Promise<number>} jumlah akun uji yang diperbarui
 */
async function aturPasswordAkunUji(executor = db) {
  const passwordHash = await bcrypt.hash('Password123!', 12);
  const { rowCount } = await executor.query(
    'UPDATE pengguna SET password_hash = $1 WHERE password_hash = $2;',
    [passwordHash, HASH_PENANDA_SEED]
  );
  return rowCount;
}

async function initializeDatabase() {
  const shouldSeed = process.argv.includes('--seed');

  try {
    console.log('[DB Init] Membaca dan menjalankan schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await db.query(schemaSql);
    console.log('[DB Init] Skema basis data berhasil dibuat.');

    if (shouldSeed) {
      console.log('[DB Init] Membaca dan menjalankan seed.sql...');
      const seedPath = path.join(__dirname, 'seed.sql');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await db.query(seedSql);

      await aturPasswordAkunUji();

      // Tambahkan contoh riwayat kesehatan & catatan refleksi terenkripsi AES-256 (KNF01)
      const encryptedRiwayat = encryptAES256('Pernah mengalami kecemasan akademik ringan saat semester 1.');
      await db.query(
        'INSERT INTO riwayat_kesehatan (id_pelajar, riwayat_kesehatan) VALUES ($1, $2);',
        ['PLJ-001', encryptedRiwayat]
      );

      const encryptedJournal = encryptAES256(
        'Hari ini merasa jauh lebih tenang setelah menyelesaikan tugas besar dan tidur cukup.'
      );
      await db.query(
        'UPDATE check_in SET catatan_refleksi = $1 WHERE id_check_in = $2;',
        [encryptedJournal, 'CHK-005']
      );

      console.log('[DB Init] Seed data berhasil dimasukkan (Password akun uji: Password123!).');
    }
  } catch (err) {
    console.error('[DB Init] Gagal menginisialisasi basis data:', err.message);
    process.exitCode = 1;
  } finally {
    await db.pool.end();
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
module.exports.aturPasswordAkunUji = aturPasswordAkunUji;
module.exports.HASH_PENANDA_SEED = HASH_PENANDA_SEED;

