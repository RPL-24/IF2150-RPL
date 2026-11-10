const cron = require('node-cron');
const NotifikasiDaruratController = require('../controllers/NotifikasiDaruratController');
const { ZONA_WAKTU } = require('../utils/waktu');

function jadwalkan(ekspresi, nama, tugas) {
  if (!cron.validate(ekspresi)) {
    console.error(`[Scheduler] Jadwal ${nama} tidak valid: ${ekspresi}`);
    return;
  }
  cron.schedule(
    ekspresi,
    async () => {
      try {
        console.log(`[Scheduler] ${nama}:`, await tugas());
      } catch (err) {
        console.error(`[Scheduler] ${nama} gagal:`, err.message);
      }
    },
    { timezone: ZONA_WAKTU }
  );
}

/** Menjadwalkan evaluasi kondisi darurat harian (KF18, KF19). */
function mulaiScheduler() {
  jadwalkan(process.env.EMERGENCY_CRON || '0 8 * * *', 'Evaluasi darurat', () =>
    NotifikasiDaruratController.jalankanEvaluasiHarian()
  );
}

module.exports = { mulaiScheduler };
