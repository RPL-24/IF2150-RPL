// Pool koneksi PostgreSQL. Hanya kelas Model yang boleh memakai modul ini.
const { Pool } = require('pg');
const config = require('./env');

const pool = config.db.connectionString
  ? new Pool({ connectionString: config.db.connectionString })
  : new Pool(config.db);

module.exports = {
  query: (teks, nilai) => pool.query(teks, nilai),
  pool,
};
