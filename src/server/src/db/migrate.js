/**
 * Runner migrasi SQL sederhana.
 *   npm run db:migrate   -> jalankan file migrations/*.sql yang belum pernah dijalankan (urut nama)
 *   npm run db:reset     -> hapus seluruh skema public lalu migrasi ulang dari nol
 *
 * Aturan penamaan (anti bentrok): NNN_<pemilik>_<deskripsi>.sql
 *   001       = starter (jangan diubah setelah di-merge; buat file baru)
 *   100-199   = P1, 200-299 = P2, 300-399 = P3, 400-499 = P4, 500-599 = P5
 * Pemilik: P1.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

export async function migrate({ reset = false, log = console.log } = {}) {
  const client = await pool.connect();
  try {
    if (reset) {
      await client.query('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
      log('Skema public dikosongkan.');
    }
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        nama TEXT PRIMARY KEY,
        dijalankan_pada TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`);
    const { rows } = await client.query('SELECT nama FROM schema_migrations');
    const sudah = new Set(rows.map((r) => r.nama));
    const files = (await fs.readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort();

    for (const file of files) {
      if (sudah.has(file)) continue;
      const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (nama) VALUES ($1)', [file]);
        await client.query('COMMIT');
        log(`Migrasi dijalankan: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Migrasi ${file} gagal: ${err.message}`);
      }
    }
    log('Migrasi selesai.');
  } finally {
    client.release();
  }
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  migrate({ reset: process.argv.includes('--reset') })
    .catch((err) => {
      console.error(err.message);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}
