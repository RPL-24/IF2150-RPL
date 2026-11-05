const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');
const { encryptAES256 } = require('../utils/encryption');

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

      // Pastikan seluruh akun uji memiliki hash bcrypt valid (cost factor 12 sesuai Algo-C01-04) untuk 'Password123!'
      const defaultPasswordHash = await bcrypt.hash('Password123!', 12);
      await db.query('UPDATE pengguna SET password_hash = $1;', [defaultPasswordHash]);

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

