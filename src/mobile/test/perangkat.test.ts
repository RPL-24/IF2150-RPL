import { afterEach, beforeEach, expect, test, vi } from 'vitest';

// Imported from the modules, not the `@/api` barrel (see client.test.ts).
import { aturToken } from '@/api/client';
import { daftarkanPerangkat } from '@/api/perangkat';

beforeEach(() => {
  vi.stubEnv('EXPO_PUBLIC_API_URL', 'http://sehati.test');
});

afterEach(() => {
  aturToken(null);
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

test('daftarkanPerangkat mengirim tokenPush ke POST /api/auth/device dengan token sesi', async () => {
  const fetchTiruan = vi.fn(
    async (_url: string, _opsi: RequestInit) => new Response(JSON.stringify({ ok: true }), { status: 200 }),
  );
  vi.stubGlobal('fetch', fetchTiruan);
  aturToken('tok-sesi');

  await daftarkanPerangkat('ExponentPushToken[abc123]');

  const [url, opsi] = fetchTiruan.mock.calls[0]!;
  expect(url).toBe('http://sehati.test/api/auth/device');
  expect(opsi.method).toBe('POST');
  expect(opsi.body).toBe('{"tokenPush":"ExponentPushToken[abc123]"}');
  expect((opsi.headers as Record<string, string>).Authorization).toBe('Bearer tok-sesi');
});
