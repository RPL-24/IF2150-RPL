/**
 * Dijalankan sekali sebelum semua test: kosongkan basis data test, migrasi, lalu seed.
 * Butuh PostgreSQL dari docker-compose (`npm run db:up` di folder src/).
 */
export default async function setup() {
  process.env.NODE_ENV = 'test';
  const { migrate } = await import('../../src/db/migrate.js');
  const { seed } = await import('../../src/db/seed.js');
  const { pool } = await import('../../src/db/pool.js');
  const diam = () => {};
  try {
    await migrate({ reset: true, log: diam });
    await seed({ log: diam });
  } finally {
    await pool.end();
  }
}
