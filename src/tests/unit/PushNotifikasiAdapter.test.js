// src/tests/unit/PushNotifikasiAdapter.test.js
// Uji unit C44 PushNotifikasiAdapter (KF34, Algo-071) dengan web-push di-mock.
jest.mock('web-push');

const ENV_VAPID = ['VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY', 'VAPID_SUBJECT'];
const envAwal = Object.fromEntries(ENV_VAPID.map((k) => [k, process.env[k]]));

// Muat ulang adapter supaya config VAPID dibaca dari environment yang diatur tiap tes
function muatAdapter(env) {
  let modul;
  jest.isolateModules(() => {
    Object.assign(process.env, env);
    modul = {
      adapter: require('../../integrasi/PushNotifikasiAdapter'),
      webpush: require('web-push'),
      LanggananPush: require('../../models/LanggananPush'),
    };
  });
  return modul;
}

const VAPID_LENGKAP = { VAPID_PUBLIC_KEY: 'kunci-publik', VAPID_PRIVATE_KEY: 'kunci-privat', VAPID_SUBJECT: '' };
const langganan = (n) => ({ endpoint: `https://push.contoh.test/${n}`, p256dh: `p256dh-${n}`, auth: `auth-${n}` });

describe('PushNotifikasiAdapter (C44, Algo-071)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    for (const k of ENV_VAPID) {
      if (envAwal[k] === undefined) delete process.env[k];
      else process.env[k] = envAwal[k];
    }
  });

  test('C44-UT01 [Negatif] kirimPush: tanpa VAPID mengembalikan false tanpa mengirim dan hanya mencatat log sekali', async () => {
    const { adapter, webpush, LanggananPush } = muatAdapter({ VAPID_PUBLIC_KEY: '', VAPID_PRIVATE_KEY: '' });
    const getByAkun = jest.spyOn(LanggananPush, 'getByAkun');
    const peringatan = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(await adapter.kirimPush('akun-1', 'ITBELI', 'Halo')).toBe(false);
    expect(await adapter.kirimPush('akun-1', 'ITBELI', 'Halo lagi')).toBe(false);

    expect(getByAkun).not.toHaveBeenCalled();
    expect(webpush.sendNotification).not.toHaveBeenCalled();
    expect(peringatan).toHaveBeenCalledTimes(1);
    expect(adapter.getKunciPublik()).toBeNull();
  });

  test('C44-UT02 [Batas] kirimPush: akun tanpa langganan mengembalikan false tanpa memanggil web-push', async () => {
    const { adapter, webpush, LanggananPush } = muatAdapter(VAPID_LENGKAP);
    jest.spyOn(LanggananPush, 'getByAkun').mockResolvedValue([]);

    expect(await adapter.kirimPush('akun-1', 'ITBELI', 'Halo')).toBe(false);
    expect(webpush.sendNotification).not.toHaveBeenCalled();
  });

  test('C44-UT03 [Normal] kirimPush: mengirim payload { judul, isi, tautan } dengan kunci VAPID ke setiap langganan', async () => {
    const { adapter, webpush, LanggananPush } = muatAdapter(VAPID_LENGKAP);
    jest.spyOn(LanggananPush, 'getByAkun').mockResolvedValue([langganan(1), langganan(2)]);
    webpush.sendNotification.mockResolvedValue({ statusCode: 201 });

    expect(await adapter.kirimPush('akun-1', 'ITBELI', 'Pesan baru dari Budi', '/percakapan')).toBe(true);
    expect(webpush.sendNotification).toHaveBeenCalledTimes(2);

    const [subscription, muatan, opsi] = webpush.sendNotification.mock.calls[0];
    expect(subscription).toEqual({ endpoint: 'https://push.contoh.test/1', keys: { p256dh: 'p256dh-1', auth: 'auth-1' } });
    expect(JSON.parse(muatan)).toEqual({ judul: 'ITBELI', isi: 'Pesan baru dari Budi', tautan: '/percakapan' });
    expect(opsi.vapidDetails).toEqual({
      subject: 'mailto:admin@itbeli.local',
      publicKey: 'kunci-publik',
      privateKey: 'kunci-privat',
    });
  });

  test('C44-UT04 [Negatif] kirimPush: status 410 dari push service menghapus langganan kedaluwarsa dan tetap mengirim ke sisanya', async () => {
    const { adapter, webpush, LanggananPush } = muatAdapter(VAPID_LENGKAP);
    jest.spyOn(LanggananPush, 'getByAkun').mockResolvedValue([langganan(1), langganan(2)]);
    const hapus = jest.spyOn(LanggananPush, 'hapusByEndpoint').mockResolvedValue(true);
    webpush.sendNotification
      .mockRejectedValueOnce(Object.assign(new Error('Gone'), { statusCode: 410 }))
      .mockResolvedValueOnce({ statusCode: 201 });

    expect(await adapter.kirimPush('akun-1', 'ITBELI', 'Halo')).toBe(true);
    expect(hapus).toHaveBeenCalledTimes(1);
    expect(hapus).toHaveBeenCalledWith('https://push.contoh.test/1');
  });

  test('C44-UT05 [Negatif] kirimPush: status 404 dari push service menghapus langganan dan mengembalikan false bila tidak ada yang berhasil', async () => {
    const { adapter, webpush, LanggananPush } = muatAdapter(VAPID_LENGKAP);
    jest.spyOn(LanggananPush, 'getByAkun').mockResolvedValue([langganan(1)]);
    const hapus = jest.spyOn(LanggananPush, 'hapusByEndpoint').mockResolvedValue(true);
    webpush.sendNotification.mockRejectedValueOnce(Object.assign(new Error('Not Found'), { statusCode: 404 }));

    expect(await adapter.kirimPush('akun-1', 'ITBELI', 'Halo')).toBe(false);
    expect(hapus).toHaveBeenCalledTimes(1);
    expect(hapus).toHaveBeenCalledWith('https://push.contoh.test/1');
  });

  test('C44-UT06 [Negatif] kirimPush: galat 500 tidak menghapus langganan dan mengembalikan false', async () => {
    const { adapter, webpush, LanggananPush } = muatAdapter(VAPID_LENGKAP);
    jest.spyOn(LanggananPush, 'getByAkun').mockResolvedValue([langganan(1)]);
    const hapus = jest.spyOn(LanggananPush, 'hapusByEndpoint').mockResolvedValue(true);
    jest.spyOn(console, 'error').mockImplementation(() => {});
    webpush.sendNotification.mockRejectedValueOnce(Object.assign(new Error('Server error'), { statusCode: 500 }));

    expect(await adapter.kirimPush('akun-1', 'ITBELI', 'Halo')).toBe(false);
    expect(hapus).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  test('C44-UT07 [Negatif] kirimPush: galat saat mengambil daftar langganan ditangani tanpa melempar dan mengembalikan false', async () => {
    const { adapter, LanggananPush } = muatAdapter(VAPID_LENGKAP);
    jest.spyOn(LanggananPush, 'getByAkun').mockRejectedValue(new Error('koneksi db putus'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(await adapter.kirimPush('akun-1', 'ITBELI', 'Halo')).toBe(false);
    expect(console.error).toHaveBeenCalled();
  });

  test('C44-UT08 [Normal] getKunciPublik dan vapidTerkonfigurasi: mengembalikan kunci publik saat VAPID lengkap dan null bila salah satu kosong', () => {
    const { adapter: lengkap } = muatAdapter(VAPID_LENGKAP);
    expect(lengkap.vapidTerkonfigurasi()).toBe(true);
    expect(lengkap.getKunciPublik()).toBe('kunci-publik');

    const { adapter: parsial } = muatAdapter({ VAPID_PUBLIC_KEY: 'kunci-publik', VAPID_PRIVATE_KEY: '' });
    expect(parsial.vapidTerkonfigurasi()).toBe(false);
    expect(parsial.getKunciPublik()).toBeNull();
  });
});
