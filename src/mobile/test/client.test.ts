import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// Imported from the module itself, not the `@/api` barrel: the barrel also exports the
// login/session modules, which pull in Expo native modules that cannot load in Node.
import { api, ApiError, aturSaatTidakTerautentikasi, aturToken, KODE_KLIEN } from '@/api/client';

const URL_API = 'http://sehati.test';

/** Replaces `fetch` with a mock that answers `status` with `isi` (a JSON value or raw text). */
function tiruFetch(status: number, isi?: unknown) {
  const teks = isi === undefined ? '' : typeof isi === 'string' ? isi : JSON.stringify(isi);
  const fetchTiruan = vi.fn(async () => new Response(teks || null, { status }));
  vi.stubGlobal('fetch', fetchTiruan);
  return fetchTiruan;
}

/** The URL and options of the n-th `fetch` call. */
function panggilan(fetchTiruan: ReturnType<typeof tiruFetch>, n = 0) {
  const [url, opsi] = fetchTiruan.mock.calls[n] as unknown as [string, RequestInit];
  return { url, opsi, header: opsi.headers as Record<string, string> };
}

/** Awaits `janji` and returns the `ApiError` it rejects with. */
async function galatDari(janji: Promise<unknown>): Promise<ApiError> {
  const e = await janji.then(
    () => null,
    (galat: unknown) => galat,
  );
  expect(e).toBeInstanceOf(ApiError);
  return e as ApiError;
}

beforeEach(() => {
  vi.stubEnv('EXPO_PUBLIC_API_URL', URL_API);
});

afterEach(() => {
  aturToken(null);
  aturSaatTidakTerautentikasi(null);
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('permintaan', () => {
  test('menggabungkan URL dasar dengan jalur dan menghapus / di akhir URL dasar', async () => {
    vi.stubEnv('EXPO_PUBLIC_API_URL', `${URL_API}//`);
    const fetchTiruan = tiruFetch(200, { ok: true });

    await api.get('/api/me');

    const { url, opsi, header } = panggilan(fetchTiruan);
    expect(url).toBe(`${URL_API}/api/me`);
    expect(opsi.method).toBe('GET');
    expect(header.Accept).toBe('application/json');
    expect(header['Content-Type']).toBeUndefined();
  });

  test.each([
    ['post', 'POST'],
    ['put', 'PUT'],
    ['patch', 'PATCH'],
  ] as const)('%s mengirim isi sebagai JSON', async (metode, http) => {
    const fetchTiruan = tiruFetch(200, {});

    await api[metode]('/api/affirmation/time', { waktu: '07:00' });

    const { opsi, header } = panggilan(fetchTiruan);
    expect(opsi.method).toBe(http);
    expect(header['Content-Type']).toBe('application/json');
    expect(opsi.body).toBe('{"waktu":"07:00"}');
  });

  test('delete memakai metode DELETE tanpa isi', async () => {
    const fetchTiruan = tiruFetch(200, { ok: true });

    await api.delete('/api/faq/faq-1');

    const { opsi, header } = panggilan(fetchTiruan);
    expect(opsi.method).toBe('DELETE');
    expect(opsi.body).toBeUndefined();
    expect(header['Content-Type']).toBeUndefined();
  });
});

describe('token sesi (aturToken)', () => {
  test('tidak mengirim Authorization sebelum login', async () => {
    const fetchTiruan = tiruFetch(200, {});
    await api.get('/api/faq');
    expect(panggilan(fetchTiruan).header.Authorization).toBeUndefined();
  });

  test('mengirim Bearer token setelah aturToken, dan berhenti setelah aturToken(null)', async () => {
    const fetchTiruan = tiruFetch(200, {});

    aturToken('tok-123');
    await api.get('/api/me');
    aturToken(null);
    await api.get('/api/me');

    expect(panggilan(fetchTiruan, 0).header.Authorization).toBe('Bearer tok-123');
    expect(panggilan(fetchTiruan, 1).header.Authorization).toBeUndefined();
  });
});

describe('respons berhasil', () => {
  test('mengembalikan isi JSON', async () => {
    tiruFetch(200, { affirmation: { konten: 'Semangat' } });
    await expect(api.get('/api/affirmation')).resolves.toEqual({ affirmation: { konten: 'Semangat' } });
  });

  test('isi kosong menjadi undefined', async () => {
    tiruFetch(204);
    await expect(api.post('/api/auth/logout')).resolves.toBeUndefined();
  });
});

describe('respons galat', () => {
  test('mengubah amplop { error: { kode, pesan, detail } } menjadi ApiError', async () => {
    tiruFetch(409, {
      error: { kode: 'SLOT_SUDAH_DIPESAN', pesan: 'Slot sudah dipesan orang lain', detail: { idJadwal: 'j1' } },
    });

    const e = await galatDari(api.post('/api/sessions', { idJadwal: 'j1' }));

    expect(e.status).toBe(409);
    expect(e.kode).toBe('SLOT_SUDAH_DIPESAN');
    expect(e.pesan).toBe('Slot sudah dipesan orang lain');
    expect(e.message).toBe(e.pesan);
    expect(e.detail).toEqual({ idJadwal: 'j1' });
  });

  test('galat tanpa amplop menjadi RESPONS_TIDAK_VALID dengan status HTTP', async () => {
    tiruFetch(500, { pesan: 'bukan amplop' });

    const e = await galatDari(api.get('/api/faq'));

    expect(e.status).toBe(500);
    expect(e.kode).toBe(KODE_KLIEN.respons);
    expect(e.pesan).toContain('HTTP 500');
  });

  test('isi yang bukan JSON menjadi RESPONS_TIDAK_VALID', async () => {
    tiruFetch(200, '<html>502 Bad Gateway</html>');

    const e = await galatDari(api.get('/api/faq'));

    expect(e.status).toBe(200);
    expect(e.kode).toBe(KODE_KLIEN.respons);
  });

  test('401 memanggil callback aturSaatTidakTerautentikasi', async () => {
    const saat401 = vi.fn();
    aturSaatTidakTerautentikasi(saat401);
    tiruFetch(401, { error: { kode: 'TIDAK_TERAUTENTIKASI', pesan: 'Sesi tidak valid atau sudah berakhir' } });

    const e = await galatDari(api.get('/api/me'));

    expect(e.kode).toBe('TIDAK_TERAUTENTIKASI');
    expect(saat401).toHaveBeenCalledTimes(1);
  });

  test('403 tidak memanggil callback 401', async () => {
    const saat401 = vi.fn();
    aturSaatTidakTerautentikasi(saat401);
    tiruFetch(403, { error: { kode: 'PERAN_TIDAK_DIIZINKAN', pesan: 'Rute ini hanya untuk administrator' } });

    await galatDari(api.post('/api/faq', {}));

    expect(saat401).not.toHaveBeenCalled();
  });
});

describe('galat dari klien (status 0)', () => {
  test('tanpa EXPO_PUBLIC_API_URL: KONFIGURASI_TIDAK_VALID dan tidak ada permintaan', async () => {
    vi.stubEnv('EXPO_PUBLIC_API_URL', '');
    const fetchTiruan = tiruFetch(200, {});

    const e = await galatDari(api.get('/api/me'));

    expect(e.status).toBe(0);
    expect(e.kode).toBe(KODE_KLIEN.konfigurasi);
    expect(e.pesan).toContain('EXPO_PUBLIC_API_URL');
    expect(fetchTiruan).not.toHaveBeenCalled();
  });

  test('fetch gagal (offline, alamat salah): JARINGAN_GAGAL', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Network request failed');
      }),
    );

    const e = await galatDari(api.get('/api/me'));

    expect(e.status).toBe(0);
    expect(e.kode).toBe(KODE_KLIEN.jaringan);
  });

  test('tidak ada respons dalam 15 detik: permintaan dibatalkan dengan BATAS_WAKTU', async () => {
    vi.useFakeTimers();
    let sinyal: AbortSignal | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, opsi: RequestInit) =>
          new Promise<Response>((_, tolak) => {
            sinyal = opsi.signal ?? undefined;
            sinyal?.addEventListener('abort', () => tolak(new DOMException('Aborted', 'AbortError')));
          }),
      ),
    );

    const janji = galatDari(api.get('/api/me'));
    await vi.advanceTimersByTimeAsync(14_999);
    expect(sinyal?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    const e = await janji;

    expect(sinyal?.aborted).toBe(true);
    expect(e.status).toBe(0);
    expect(e.kode).toBe(KODE_KLIEN.batasWaktu);
  });
});
