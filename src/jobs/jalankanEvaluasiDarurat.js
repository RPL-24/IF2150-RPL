// Menjalankan evaluasi darurat sekali tanpa menunggu jadwal: npm run job:darurat
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const db = require('../config/db');
const NotifikasiDaruratController = require('../controllers/NotifikasiDaruratController');

NotifikasiDaruratController.jalankanEvaluasiHarian()
  .then((hasil) => console.log('[Evaluasi darurat]', hasil))
  .catch((err) => {
    console.error('[Evaluasi darurat] Gagal:', err.message);
    process.exitCode = 1;
  })
  .finally(() => db.pool.end());
