/**
 * Koneksi PostgreSQL (komponen "Database" pada DPPL Tabel 2.3).
 * Pemilik: P1.
 *
 * - query(sql, params)        : satu query lepas.
 * - withTransaction(fn)       : jalankan beberapa query dalam satu transaksi; fn menerima `client`.
 *
 * Semua fungsi model menerima `db` sebagai argumen pertama (boleh `pool` atau `client` transaksi),
 * jadi controller bisa menggabungkan beberapa operasi model ke satu transaksi.
 */
import pg from 'pg';
import { config } from '../config.js';

// Kembalikan COUNT(*) / BIGINT sebagai number, bukan string.
pg.types.setTypeParser(20, (v) => Number(v));
// NUMERIC (latitude/longitude) sebagai number.
pg.types.setTypeParser(1700, (v) => Number(v));

export const pool = new pg.Pool({ connectionString: config.databaseUrl, max: 10 });

export function query(text, params) {
  return pool.query(text, params);
}

export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
