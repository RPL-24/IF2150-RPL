import { beforeEach, describe, expect, it, vi } from 'vitest';

// Unit test kelas C18 PushNotificationUI. expo-notifications dan
// react-native diganti mock karena hanya tersedia di perangkat.

const n = vi.hoisted(() => ({
  setNotificationHandler: vi.fn(),
  setNotificationChannelAsync: vi.fn(),
  setNotificationCategoryAsync: vi.fn(),
  getPermissionsAsync: vi.fn(),
  requestPermissionsAsync: vi.fn(),
  scheduleNotificationAsync: vi.fn(),
  addNotificationResponseReceivedListener: vi.fn(),
  getLastNotificationResponseAsync: vi.fn(),
}));
const rn = vi.hoisted(() => ({
  Platform: { OS: 'android' as string },
  Linking: { openSettings: vi.fn() },
}));

vi.mock('expo-notifications', () => ({ ...n, AndroidImportance: { MAX: 5 } }));
vi.mock('react-native', () => rn);

import {
  AKSI_TINJAU,
  parseDataNotifikasi,
  PushNotificationUI,
} from '../services/PushNotificationUI';

const izin = (status: string) => Promise.resolve({ status });
const respons = (data: unknown) => ({ notification: { request: { content: { data } } } });

beforeEach(() => {
  for (const f of Object.values(n)) f.mockReset();
  rn.Linking.openSettings.mockReset();
  rn.Platform.OS = 'android';
});

describe('C18 PushNotificationUI.inisialisasi()', () => {
  it('C18-UT01 normal: izin sudah diberikan, notifikasi aktif', async () => {
    n.getPermissionsAsync.mockReturnValueOnce(izin('granted'));
    const push = new PushNotificationUI();

    await expect(push.inisialisasi()).resolves.toBe(true);

    expect(push.isNotifikasiAktif()).toBe(true);
    expect(n.setNotificationChannelAsync).toHaveBeenCalledWith(
      'default',
      expect.objectContaining({ importance: 5 }),
    );
    expect(n.setNotificationCategoryAsync).toHaveBeenCalledWith('kerugian', [
      expect.objectContaining({ identifier: AKSI_TINJAU }),
    ]);
    expect(n.requestPermissionsAsync).not.toHaveBeenCalled();

    const handler = n.setNotificationHandler.mock.calls[0][0];
    await expect(handler.handleNotification()).resolves.toEqual(
      expect.objectContaining({ shouldShowBanner: true }),
    );
  });

  it('C18-UT02 negatif: pengguna menolak izin, notifikasi tidak aktif', async () => {
    rn.Platform.OS = 'ios';
    n.getPermissionsAsync.mockReturnValueOnce(izin('undetermined'));
    n.requestPermissionsAsync.mockReturnValueOnce(izin('denied'));
    const push = new PushNotificationUI();

    await expect(push.inisialisasi()).resolves.toBe(false);

    expect(push.isNotifikasiAktif()).toBe(false);
    expect(n.setNotificationChannelAsync).not.toHaveBeenCalled();
  });
});

describe('C18 PushNotificationUI.tampilkanNotifikasi()', () => {
  it('C18-UT03 normal: notifikasi kerugian ditampilkan bila izin aktif', async () => {
    n.getPermissionsAsync.mockReturnValueOnce(izin('granted'));
    const push = new PushNotificationUI();
    await push.periksaIzin();

    await push.tampilkanNotifikasi('Margin Negatif!', 'Nasi Goreng rugi', {
      tipe: 'kerugian',
      idProduk: 'p1',
    });

    expect(n.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: 'Margin Negatif!',
        body: 'Nasi Goreng rugi',
        data: { tipe: 'kerugian', idProduk: 'p1' },
        categoryIdentifier: 'kerugian',
      },
      trigger: null,
    });
  });

  it('C18-UT04 negatif: notifikasi tidak ditampilkan bila izin tidak aktif', async () => {
    const push = new PushNotificationUI();

    await push.tampilkanNotifikasi('Judul', 'Pesan', { tipe: 'harga_bahan' });

    expect(n.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});

describe('C18 PushNotificationUI.onClickNotification()', () => {
  it('C18-UT05 normal: ketukan notifikasi meneruskan data ke handler', () => {
    const remove = vi.fn();
    n.addNotificationResponseReceivedListener.mockReturnValueOnce({ remove });
    const handler = vi.fn();

    const berhenti = new PushNotificationUI().onClickNotification(handler);
    const listener = n.addNotificationResponseReceivedListener.mock.calls[0][0];
    listener(respons({ tipe: 'kerugian', idProduk: 'p1' }));
    listener(respons({ tipe: 'lain' }));
    berhenti();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ tipe: 'kerugian', idProduk: 'p1' });
    expect(remove).toHaveBeenCalled();
  });
});

describe('C18 operasi pendukung', () => {
  it('C18-UT06 normal: periksaIzin dan bukaPengaturan', async () => {
    n.getPermissionsAsync.mockReturnValueOnce(izin('denied'));
    const push = new PushNotificationUI();

    await expect(push.periksaIzin()).resolves.toBe('ditolak');
    await push.bukaPengaturan();

    expect(rn.Linking.openSettings).toHaveBeenCalled();
  });

  it('C18-UT07 normal dan batas: ambilKetukanTerakhir', async () => {
    const push = new PushNotificationUI();
    n.getLastNotificationResponseAsync.mockResolvedValueOnce(respons({ tipe: 'harga_bahan' }));
    n.getLastNotificationResponseAsync.mockResolvedValueOnce(null);

    await expect(push.ambilKetukanTerakhir()).resolves.toEqual({
      tipe: 'harga_bahan',
      idProduk: undefined,
    });
    await expect(push.ambilKetukanTerakhir()).resolves.toBeNull();
  });

  it('C18-UT08 negatif: parseDataNotifikasi menolak data tidak valid', () => {
    expect(parseDataNotifikasi(null)).toBeNull();
    expect(parseDataNotifikasi('kerugian')).toBeNull();
    expect(parseDataNotifikasi({ tipe: 'promo' })).toBeNull();
    expect(parseDataNotifikasi({ tipe: 'kerugian', idProduk: 12 })).toEqual({
      tipe: 'kerugian',
      idProduk: undefined,
    });
  });
});
