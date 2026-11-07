const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'mahasehat_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    };

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('[Database] Unexpected error on idle PostgreSQL client:', err.message);
});

/**
 * Menjalankan satu query SQL dengan parameterisasi ($1, $2, ...).
 * @param {string} text - Query SQL
 * @param {Array} params - Parameter query
 */
async function query(text, params = []) {
  return pool.query(text, params);
}

/**
 * Mengambil satu client dari pool untuk transaksi (BEGIN / COMMIT / ROLLBACK),
 * misalnya pada JadwalKonsultasi.reservasi() (Algo-C09-03).
 */
async function getClient() {
  return pool.connect();
}

module.exports = {
  pool,
  query,
  getClient,
};

