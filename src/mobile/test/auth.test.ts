import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

/**
 * Unit tests for the Google login flow in `@/api/auth`.
 *
 * The Expo native modules are stubbed: `expo-linking` is mocked so
 * `createURL` returns what the real module would per environment, and
 * `expo-web-browser` so we can drive the redirect and the listener fallback.
 * Screens are not rendered here (see vitest.config.ts).
 */

const createURL = vi.fn();
const addEventListener = vi.fn();
const openAuthSessionAsync = vi.fn();
const dismissBrowser = vi.fn();

vi.mock('expo-linking', () => ({
  createURL: (jalur: string) => createURL(jalur),
  addEventListener: (jenis: string, fn: (e: { url: string }) => void) => ({
    remove: vi.fn(),
    ...addEventListener(jenis, fn),
  }),
  parse: (url: string) => {
    const u = new URL(url);
    const queryParams: Record<string, string> = {};
    u.searchParams.forEach((v, k) => (queryParams[k] = v));
    return { queryParams };
  },
}));

vi.mock('expo-web-browser', () => ({
  openAuthSessionAsync: (...a: unknown[]) => openAuthSessionAsync(...a),
  dismissBrowser: () => dismissBrowser(),
}));

const Constants = { executionEnvironment: 'storeClient', expoConfig: { hostUri: '10.0.2.2:8081' } };
vi.mock('expo-constants', () => ({ default: Constants }));

vi.mock('expo-secure-store', () => ({
  setItemAsync: vi.fn(async () => {}),
  deleteItemAsync: vi.fn(async () => {}),
  getItemAsync: vi.fn(async () => null),
}));

const { masukDenganGoogle } = await import('@/api/auth');

const URL_API = 'https://sehati.test';
const PEMBACA_121 = { idPengguna: 'u1', nama: 'Ana', email: 'ana@std.stei.itb.ac.id', peran: 'mahasiswa' };

/** Records the value passed to `openAuthSessionAsync` and the `kembali` argument. */
function panggilanBrowser() {
  const [urlOtorisasi, kembali] = openAuthSessionAsync.mock.calls[0] as [string, string];
  return { urlOtorisasi, kembali };
}

beforeEach(() => {
  Constants.executionEnvironment = 'storeClient';
  Constants.expoConfig.hostUri = '10.0.2.2:8081';
  vi.stubEnv('EXPO_PUBLIC_API_URL', URL_API);
  createURL.mockReturnValue('sehati://masuk');
  dismissBrowser.mockResolvedValue(undefined);
  // Default: fetch answers the code exchange.
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify({ token: 'tok', waktuLogin: 'x', pengguna: PEMBACA_121 }), { status: 200 })),
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('deep link kembali', () => {
  test('di Expo Go memakai host dev server, bukan skema sehati:', async () => {
    // Regression: createURL returned `sehati://masuk` inside Expo Go, which does
    // not own the `sehati:` scheme, so the Custom Tab opened nothing and hung.
    Constants.executionEnvironment = 'storeClient';
    Constants.expoConfig.hostUri = '10.0.2.2:8081';
    openAuthSessionAsync.mockResolvedValue({ type: 'cancel' });

    await masukDenganGoogle();

    // No path: Expo Router would try to navigate to it and fail.
    expect(panggilanBrowser().kembali).toBe('exp://10.0.2.2:8081/--/');
  });

  test('hostUri ada meski executionEnvironment bukan storeClient -> tetap exp://', async () => {
    // Regression: the app reported a non-storeClient environment while running in
    // Expo Go, so it sent `sehati://masuk`, which Expo Go cannot claim.
    Constants.executionEnvironment = 'bare';
    Constants.expoConfig.hostUri = '10.0.2.2:8081';
    openAuthSessionAsync.mockResolvedValue({ type: 'cancel' });

    await masukDenganGoogle();

    expect(panggilanBrowser().kembali).toBe('exp://10.0.2.2:8081/--/');
  });

  test('di Expo Go dengan hostUri bertanda https tetap menghasilkan exp://', async () => {
    Constants.executionEnvironment = 'storeClient';
    Constants.expoConfig.hostUri = 'https://abc.exp.direct';
    openAuthSessionAsync.mockResolvedValue({ type: 'cancel' });

    await masukDenganGoogle();

    expect(panggilanBrowser().kembali).toBe('exp://abc.exp.direct/--/');
  });

  test('executionEnvironment tidak menentukan: hostUri yang menentukan', async () => {
    Constants.executionEnvironment = 'storeClient';
    Constants.expoConfig.hostUri = undefined as unknown as string;
    openAuthSessionAsync.mockResolvedValue({ type: 'cancel' });

    await masukDenganGoogle();

    // Never fall back to a hostless link: the backend rejects those.
    expect(panggilanBrowser().kembali).toBe('sehati://masuk');
  });

  test('tanpa hostUri (binary produksi) memakai sehati://masuk', async () => {
    Constants.expoConfig.hostUri = undefined as unknown as string;
    openAuthSessionAsync.mockResolvedValue({ type: 'cancel' });

    await masukDenganGoogle();

    // A hostless `sehati://` is rejected by the backend; `/masuk` is not a route.
    expect(panggilanBrowser().kembali).toBe('sehati://masuk');
  });

  test('tidak memakai createURL sehingga tidak bisa menghasilkan sehati://', async () => {
    Constants.expoConfig.hostUri = undefined as unknown as string;
    createURL.mockReturnValue('sehati://');
    openAuthSessionAsync.mockResolvedValue({ type: 'cancel' });

    await masukDenganGoogle();

    expect(panggilanBrowser().kembali).not.toBe('sehati://');
    expect(createURL).not.toHaveBeenCalled();
  });

  test('menyertakan kembali ter-encode di URL otorisasi', async () => {
    openAuthSessionAsync.mockResolvedValue({ type: 'cancel' });

    await masukDenganGoogle();

    const { urlOtorisasi, kembali } = panggilanBrowser();
    expect(urlOtorisasi).toContain('/api/auth/google/mulai?kembali=');
    expect(urlOtorisasi).toContain(encodeURIComponent(kembali));
  });

});

describe('hasil login', () => {
  test('menukar code menjadi sesi', async () => {
    openAuthSessionAsync.mockResolvedValue({
      type: 'success',
      url: 'sehati://masuk?code=4%2Fkode',
    });

    const pengguna = await masukDenganGoogle();

    expect(pengguna).toMatchObject({ idPengguna: 'u1' });
    const [url, opsi] = (globalThis.fetch as any).mock.calls[0];
    expect(url).toBe(`${URL_API}/api/auth/google`);
    expect(opsi.method).toBe('POST');
    expect(JSON.parse(opsi.body)).toEqual({ kodeOtorisasi: '4/kode' });
  });

  test('mengembalikan null saat pengguna menutup browser', async () => {
    openAuthSessionAsync.mockResolvedValue({ type: 'cancel' });
    expect(await masukDenganGoogle()).toBeNull();
  });

  test('mengembalikan null saat Google membalas access_denied', async () => {
    openAuthSessionAsync.mockResolvedValue({
      type: 'success',
      url: 'sehati://masuk?error=access_denied',
    });
    expect(await masukDenganGoogle()).toBeNull();
  });

  test('melempar ApiError saat tidak ada code maupun error', async () => {
    openAuthSessionAsync.mockResolvedValue({ type: 'success', url: 'sehati://masuk' });
    await expect(masukDenganGoogle()).rejects.toMatchObject({ status: 401 });
  });

  test('melempar ApiError konfigurasi tanpa EXPO_PUBLIC_API_URL', async () => {
    vi.stubEnv('EXPO_PUBLIC_API_URL', '');
    await expect(masukDenganGoogle()).rejects.toMatchObject({ status: 0 });
    expect(openAuthSessionAsync).not.toHaveBeenCalled();
  });
});

describe('fallback listener Linking', () => {
  /**
   * On some Android setups `openAuthSessionAsync` never resolves and the redirect
   * only arrives as a `url` event; without the listener that looked like a cancel.
   */
  test('menerima redirect exp: meski diharapkan exp://', async () => {
    let pendengar: ((e: { url: string }) => void) | undefined;
    addEventListener.mockImplementation((_jenis: string, fn: typeof pendengar) => {
      pendengar = fn;
      return { remove: vi.fn() };
    });
    // The browser promise never settles, mimicking the stuck promise.
    openAuthSessionAsync.mockReturnValue(new Promise(() => {}));

    const janji = masukDenganGoogle();
    await Promise.resolve();

    pendengar?.({ url: 'exp://10.0.2.2:8081/--/?code=4%2Fkode' });

    await expect(janji).resolves.toMatchObject({ idPengguna: 'u1' });
  });

  test('menerima skema exps: dari Expo Go', async () => {
    let pendengar: ((e: { url: string }) => void) | undefined;
    addEventListener.mockImplementation((_jenis: string, fn: typeof pendengar) => {
      pendengar = fn;
      return { remove: vi.fn() };
    });
    openAuthSessionAsync.mockReturnValue(new Promise(() => {}));

    const janji = masukDenganGoogle();
    await Promise.resolve();

    pendengar?.({ url: 'exps://10.0.2.2:8081/--/?code=4%2Fkode' });

    await expect(janji).resolves.toMatchObject({ idPengguna: 'u1' });
  });

  test('mengabaikan event url yang bukan deep link kita', async () => {
    let pendengar: ((e: { url: string }) => void) | undefined;
    addEventListener.mockImplementation((_jenis: string, fn: typeof pendengar) => {
      pendengar = fn;
      return { remove: vi.fn() };
    });
    openAuthSessionAsync.mockReturnValue(new Promise(() => {}));

    let selesai = false;
    const janji = masukDenganGoogle().then((r) => {
      selesai = true;
      return r;
    });
    await Promise.resolve();

    // A different path or scheme must not resolve the flow.
    pendengar?.({ url: 'exp://10.0.0.9:8081/--/?code=salah' });
    pendengar?.({ url: 'https://jahat.example?code=salah' });
    await Promise.resolve();
    await Promise.resolve();

    expect(selesai).toBe(false);
    expect((globalThis.fetch as any).mock.calls).toHaveLength(0);

    // The real deep link still completes it afterwards.
    pendengar?.({ url: 'exp://10.0.2.2:8081/--/?code=4%2Fkode' });
    await expect(janji).resolves.toMatchObject({ idPengguna: 'u1' });
  });

  test('listener tidak mendahului browser yang berhasil', async () => {
    // Regression: racing the listener against openAuthSessionAsync made the
    // listener win, then the tab was dismissed and the login failed after a
    // successful redirect. The browser path must complete undisturbed.
    let pendengar: ((e: { url: string }) => void) | undefined;
    addEventListener.mockImplementation((_jenis: string, fn: typeof pendengar) => {
      pendengar = fn;
      return { remove: vi.fn() };
    });
    openAuthSessionAsync.mockImplementation(
      () =>
        new Promise((selesai) => {
          // Emit the deep link first, then resolve the browser as success.
          pendengar?.({ url: 'exp://10.0.2.2:8081/--/?code=4%2Fkode' });
          setTimeout(() => selesai({ type: 'success', url: 'exp://10.0.2.2:8081/--/?code=4%2Fkode' }), 0);
        }),
    );

    await expect(masukDenganGoogle()).resolves.toMatchObject({ idPengguna: 'u1' });
    // Only one exchange: the code is used once.
    expect((globalThis.fetch as any).mock.calls).toHaveLength(1);
  });

  test('melepas listener setelah selesai', async () => {
    const remove = vi.fn();
    addEventListener.mockReturnValue({ remove });
    openAuthSessionAsync.mockResolvedValue({ type: 'cancel' });

    await masukDenganGoogle();

    expect(remove).toHaveBeenCalled();
  });
});
