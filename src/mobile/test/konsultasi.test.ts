import { afterEach, beforeEach, expect, test, vi } from 'vitest';

// Imported from the module, not the `@/api` barrel (see client.test.ts).
import { ambilDaftarKonsultan, ambilSlotKonsultan, ambilSesiBerikutnya, pesanSesi } from '@/api/konsultasi';

beforeEach(() => {
  process.env.EXPO_PUBLIC_API_URL = 'http://sehati.test';
});

afterEach(() => {
  vi.restoreAllMocks();
  globalThis.fetch = fetchAsli;
});
const fetchAsli = globalThis.fetch;

function tiruFetch(isi: unknown) {
  const fetchTiruan = vi.fn(
    async (url: string, options?: RequestInit) =>
      new Response(JSON.stringify(isi), { status: 200 })
  );

  globalThis.fetch = fetchTiruan as typeof fetch;

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


test('ambilDaftarKonsultan membuka amplop consultants dari GET /api/consultants', async () => {
  const daftar = [{ idKonsultan: 'k1', nama: 'Dr. Raisa', spesialisasi: 'Psikologi Klinis' }];
  const fetchTiruan = tiruFetch({ consultants: daftar });
  await expect(ambilDaftarKonsultan()).resolves.toEqual(daftar);
  expect(fetchTiruan.mock.calls[0]?.[0]).toBe('http://sehati.test/api/consultants');
});

test('ambilSlotKonsultan meminta slot konsultan tertentu', async () => {
  const slots = [{ idJadwal: 'j1', waktu: '2031-06-01T03:00:00Z', waktuSelesai: '2031-06-01T04:00:00Z', status: 'tersedia' }];
  const fetchTiruan = tiruFetch({ slots });
  await expect(ambilSlotKonsultan('k 1')).resolves.toEqual(slots);
  expect(fetchTiruan.mock.calls[0]?.[0]).toBe('http://sehati.test/api/consultants/k%201/slots');
});

test('pesanSesi mengirim POST ke endpoint booking slot', async () => {
  const fetchTiruan = tiruFetch({ ok: true });
  await expect(pesanSesi('jadwal/1')).resolves.toBeUndefined();
  expect(fetchTiruan.mock.calls[0]?.[0]).toBe('http://sehati.test/api/slots/jadwal%2F1/book');
  expect(fetchTiruan.mock.calls[0]?.[1]).toMatchObject({ method: 'POST' });
});
