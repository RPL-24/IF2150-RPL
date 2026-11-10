import { afterEach, beforeEach, expect, test, vi } from 'vitest';

// Imported from the module, not the `@/api` barrel (see client.test.ts).
import { ambilSesiBerikutnya } from '@/api/konsultasi';

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

test('ambilSesiBerikutnya membuka amplop { session } dari GET /api/sessions/next', async () => {
  const sesi = {
    idJadwal: 'seed-jdw-1-1-4',
    waktu: '2026-11-10T04:00:00Z',
    waktuSelesai: '2026-11-10T05:00:00Z',
    nama: 'Dr. Raisa Wibowo, M.Psi.',
    spesialisasi: 'Psikologi Klinis',
  };
  const fetchTiruan = tiruFetch({ session: sesi });

  await expect(ambilSesiBerikutnya()).resolves.toEqual(sesi);
  expect(fetchTiruan.mock.calls[0]?.[0]).toBe('http://sehati.test/api/sessions/next');
});

test('ambilSesiBerikutnya mengembalikan null tanpa sesi terpesan', async () => {
  tiruFetch({ session: null });
  await expect(ambilSesiBerikutnya()).resolves.toBeNull();
});
