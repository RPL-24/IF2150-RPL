import { afterEach, beforeEach, expect, test, vi } from 'vitest';

// Imported from the module, not the `@/api` barrel (see client.test.ts).
import { ambilAfirmasi } from '@/api/afirmasi';

beforeEach(() => {
  vi.stubEnv('EXPO_PUBLIC_API_URL', 'http://sehati.test');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function tiruFetch(isi: unknown) {
  const fetchTiruan = vi.fn(async (_url: string) => new Response(JSON.stringify(isi), { status: 200 }));
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
