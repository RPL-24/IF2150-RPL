// Membuat seluruh tabel dari database/schema.sql.
//   npm run db:init
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function main() {
  const skema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await db.query(skema);
  console.log('Skema basis data berhasil dibuat.');
}

main()
  .catch((galat) => {
    console.error('Gagal membuat skema:', galat.message);
    process.exitCode = 1;
  })
  .finally(() => db.pool.end());
