import { afterEach, beforeEach, expect, test, vi } from 'vitest';

// Imported from the module, not the `@/api` barrel (see client.test.ts).
import { ambilAfirmasi, hapusAfirmasi, simpanWaktuAfirmasi } from '@/api/afirmasi';

beforeEach(() => {
  vi.stubEnv('EXPO_PUBLIC_API_URL', 'http://sehati.test');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function tiruFetch(isi: unknown) {
  const fetchTiruan = vi.fn(async (_url: string, _init?: RequestInit) => new Response(JSON.stringify(isi), { status: 200 }));
  vi.stubGlobal('fetch', fetchTiruan);
  return fetchTiruan;
}

test('ambilAfirmasi membuka amplop { affirmation } dari GET /api/affirmation', async () => {
  const afirmasi = { idAffirmation: 'aff-1', konten: 'Semangat', waktuKirim: '07:00' };
  const fetchTiruan = tiruFetch({ affirmation: afirmasi });

  await expect(ambilAfirmasi()).resolves.toEqual(afirmasi);
  expect(fetchTiruan.mock.calls[0]?.[0]).toBe('http://sehati.test/api/affirmation');
});

test('ambilAfirmasi mengembalikan null sebelum afirmasi diatur', async () => {
  tiruFetch({ affirmation: null });
  await expect(ambilAfirmasi()).resolves.toBeNull();
});

test('simpanWaktuAfirmasi mengirim PUT { waktu } ke /api/affirmation/time', async () => {
  const fetchTiruan = tiruFetch({ ok: true, waktuKirim: '07:00' });

  await expect(simpanWaktuAfirmasi('07:00')).resolves.toBeUndefined();

  const [url, opsi] = fetchTiruan.mock.calls[0] as [string, RequestInit];
  expect(url).toBe('http://sehati.test/api/affirmation/time');
  expect(opsi.method).toBe('PUT');
  expect(JSON.parse(String(opsi.body))).toEqual({ waktu: '07:00' });
});

test('hapusAfirmasi mengirim DELETE ke /api/affirmation', async () => {
  const fetchTiruan = tiruFetch({ ok: true });

  await expect(hapusAfirmasi()).resolves.toBeUndefined();

  const [url, opsi] = fetchTiruan.mock.calls[0] as [string, RequestInit];
  expect(url).toBe('http://sehati.test/api/affirmation');
  expect(opsi.method).toBe('DELETE');
  expect(opsi.body).toBeUndefined();
});
