jest.mock('node-cron', () => ({
  validate: jest.requireActual('node-cron').validate,
  schedule: jest.fn(),
}));
jest.mock('../controllers/NotifikasiDaruratController', () => ({
  jalankanEvaluasiHarian: jest.fn().mockResolvedValue({ jumlahDarurat: 0 }),
}));

const cron = require('node-cron');
const NotifikasiDaruratController = require('../controllers/NotifikasiDaruratController');
const { mulaiScheduler } = require('../jobs/scheduler');

describe('Scheduler evaluasi darurat', () => {
  const awal = process.env.EMERGENCY_CRON;

  afterEach(() => {
    process.env.EMERGENCY_CRON = awal;
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('memakai jadwal bawaan pukul 08.00 zona Asia/Jakarta dan menjalankan evaluasi', async () => {
    delete process.env.EMERGENCY_CRON;
    jest.spyOn(console, 'log').mockImplementation(() => {});
    mulaiScheduler();

    expect(cron.schedule).toHaveBeenCalledWith('0 8 * * *', expect.any(Function), {
      timezone: 'Asia/Jakarta',
    });
    await cron.schedule.mock.calls[0][1]();
    expect(NotifikasiDaruratController.jalankanEvaluasiHarian).toHaveBeenCalledTimes(1);
  });

  test('jadwal dari EMERGENCY_CRON dipakai bila valid', () => {
    process.env.EMERGENCY_CRON = '30 7 * * *';
    mulaiScheduler();
    expect(cron.schedule.mock.calls[0][0]).toBe('30 7 * * *');
  });

  test('jadwal tidak valid tidak didaftarkan dan dicatat sebagai galat', () => {
    process.env.EMERGENCY_CRON = 'setiap pagi';
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mulaiScheduler();

    expect(cron.schedule).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('tidak valid'));
  });

  test('galat saat evaluasi dicatat tanpa menghentikan server', async () => {
    delete process.env.EMERGENCY_CRON;
    jest.spyOn(console, 'error').mockImplementation(() => {});
    NotifikasiDaruratController.jalankanEvaluasiHarian.mockRejectedValueOnce(new Error('koneksi putus'));
    mulaiScheduler();

    await expect(cron.schedule.mock.calls[0][1]()).resolves.toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('gagal'), 'koneksi putus');
  });
});
