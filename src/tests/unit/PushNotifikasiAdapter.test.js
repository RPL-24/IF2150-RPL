// src/tests/unit/PushNotifikasiAdapter.test.js
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

  test('tanpa VAPID: mengembalikan false tanpa mengirim, dan hanya mencatat log sekali', async () => {
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

  test('tanpa langganan: mengembalikan false', async () => {
    const { adapter, webpush, LanggananPush } = muatAdapter(VAPID_LENGKAP);
    jest.spyOn(LanggananPush, 'getByAkun').mockResolvedValue([]);

    expect(await adapter.kirimPush('akun-1', 'ITBELI', 'Halo')).toBe(false);
    expect(webpush.sendNotification).not.toHaveBeenCalled();
  });

  test('mengirim payload { judul, isi, tautan } dengan kunci VAPID ke setiap langganan', async () => {
    const { adapter, webpush, LanggananPush } = muatAdapter(VAPID_LENGKAP);
    jest.spyOn(LanggananPush, 'getByAkun').mockResolvedValue([langganan(1), langganan(2)]);
    webpush.sendNotification.mockResolvedValue({ statusCode: 201 });

    expect(await adapter.kirimPush('akun-1', 'ITBELI', 'Budi: halo', '/percakapan')).toBe(true);
    expect(webpush.sendNotification).toHaveBeenCalledTimes(2);

    const [subscription, muatan, opsi] = webpush.sendNotification.mock.calls[0];
    expect(subscription).toEqual({ endpoint: 'https://push.contoh.test/1', keys: { p256dh: 'p256dh-1', auth: 'auth-1' } });
    expect(JSON.parse(muatan)).toEqual({ judul: 'ITBELI', isi: 'Budi: halo', tautan: '/percakapan' });
    expect(opsi.vapidDetails).toEqual({
      subject: 'mailto:admin@itbeli.local',
      publicKey: 'kunci-publik',
      privateKey: 'kunci-privat',
    });
  });

  test('status 410 dari push service: langganan kedaluwarsa dihapus', async () => {
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

  test('galat lain tidak menghapus langganan dan tidak melempar; false bila tidak ada yang terkirim', async () => {
    const { adapter, webpush, LanggananPush } = muatAdapter(VAPID_LENGKAP);
    jest.spyOn(LanggananPush, 'getByAkun').mockResolvedValue([langganan(1)]);
    const hapus = jest.spyOn(LanggananPush, 'hapusByEndpoint').mockResolvedValue(true);
    jest.spyOn(console, 'error').mockImplementation(() => {});
    webpush.sendNotification.mockRejectedValueOnce(Object.assign(new Error('Server error'), { statusCode: 500 }));

    expect(await adapter.kirimPush('akun-1', 'ITBELI', 'Halo')).toBe(false);
    expect(hapus).not.toHaveBeenCalled();
  });
});
