import { beforeEach, describe, expect, test, vi } from 'vitest';

// The native modules cannot load in Node, so each is replaced by a stub whose
// values the tests change. `vi.mock` factories run before the imports below.
const tiruan = vi.hoisted(() => ({
  platform: { OS: 'android' as 'android' | 'ios' },
  constants: { executionEnvironment: 'standalone', expoConfig: { extra: { eas: { projectId: 'proj-1' } } } },
  device: { isDevice: true },
  izin: { status: 'granted', canAskAgain: true },
  minta: vi.fn(),
  ambilToken: vi.fn(),
  daftarkan: vi.fn(),
}));

vi.mock('react-native', () => ({ Platform: tiruan.platform }));
vi.mock('expo-constants', () => ({
  default: tiruan.constants,
  ExecutionEnvironment: { Bare: 'bare', Standalone: 'standalone', StoreClient: 'storeClient' },
}));
vi.mock('expo-device', () => tiruan.device);
vi.mock('expo-notifications', () => ({
  AndroidImportance: { HIGH: 4 },
  setNotificationChannelAsync: vi.fn(),
  getPermissionsAsync: vi.fn(async () => tiruan.izin),
  requestPermissionsAsync: tiruan.minta,
  getExpoPushTokenAsync: tiruan.ambilToken,
}));
vi.mock('@/api/perangkat', () => ({ daftarkanPerangkat: tiruan.daftarkan }));

import { ambilTokenPush, daftarkanPerangkatIni, pushDidukung } from '@/lib/notifikasi';

beforeEach(() => {
  tiruan.platform.OS = 'android';
  tiruan.constants.executionEnvironment = 'standalone';
  tiruan.device.isDevice = true;
  tiruan.izin = { status: 'granted', canAskAgain: true };
  tiruan.minta.mockReset();
  tiruan.ambilToken.mockReset().mockResolvedValue({ data: 'ExponentPushToken[abc]' });
  tiruan.daftarkan.mockReset().mockResolvedValue(undefined);
});

describe('pushDidukung', () => {
  test('perangkat fisik dengan APK atau development build', () => {
    expect(pushDidukung()).toBe(true);
  });

  test('emulator atau simulator dilewati', () => {
    tiruan.device.isDevice = false;
    expect(pushDidukung()).toBe(false);
  });

  test('Expo Go di Android dilewati', () => {
    tiruan.constants.executionEnvironment = 'storeClient';
    expect(pushDidukung()).toBe(false);
  });

  test('Expo Go di iOS tetap didukung', () => {
    tiruan.platform.OS = 'ios';
    tiruan.constants.executionEnvironment = 'storeClient';
    expect(pushDidukung()).toBe(true);
  });
});

describe('ambilTokenPush', () => {
  test('tanpa dukungan push: tidak meminta izin dan tidak mengambil token', async () => {
    tiruan.device.isDevice = false;
    tiruan.izin = { status: 'undetermined', canAskAgain: true };

    await expect(ambilTokenPush()).resolves.toBeNull();
    expect(tiruan.minta).not.toHaveBeenCalled();
    expect(tiruan.ambilToken).not.toHaveBeenCalled();
  });

  test('meminta izin bila belum dijawab, lalu mengambil token dengan projectId', async () => {
    tiruan.izin = { status: 'undetermined', canAskAgain: true };
    tiruan.minta.mockResolvedValue({ status: 'granted', canAskAgain: true });

    await expect(ambilTokenPush()).resolves.toBe('ExponentPushToken[abc]');
    expect(tiruan.minta).toHaveBeenCalledTimes(1);
    expect(tiruan.ambilToken).toHaveBeenCalledWith({ projectId: 'proj-1' });
  });

  test('izin ditolak permanen: tidak meminta lagi dan mengembalikan null', async () => {
    tiruan.izin = { status: 'denied', canAskAgain: false };

    await expect(ambilTokenPush()).resolves.toBeNull();
    expect(tiruan.minta).not.toHaveBeenCalled();
  });
});

describe('daftarkanPerangkatIni', () => {
  test('mengirim token ke backend', async () => {
    await daftarkanPerangkatIni();
    expect(tiruan.daftarkan).toHaveBeenCalledWith('ExponentPushToken[abc]');
  });

  test('tanpa token tidak memanggil backend', async () => {
    tiruan.izin = { status: 'denied', canAskAgain: false };
    await daftarkanPerangkatIni();
    expect(tiruan.daftarkan).not.toHaveBeenCalled();
  });

  test('galat pengambilan token atau backend tidak dilempar', async () => {
    vi.stubGlobal('__DEV__', false);
    tiruan.ambilToken.mockRejectedValue(new Error('FirebaseApp is not initialized'));
    await expect(daftarkanPerangkatIni()).resolves.toBeUndefined();

    tiruan.ambilToken.mockResolvedValue({ data: 'ExponentPushToken[abc]' });
    tiruan.daftarkan.mockRejectedValue(new Error('JARINGAN_GAGAL'));
    await expect(daftarkanPerangkatIni()).resolves.toBeUndefined();
    vi.unstubAllGlobals();
  });
});
