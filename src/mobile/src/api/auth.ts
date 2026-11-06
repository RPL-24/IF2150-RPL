/**
 * Google login for I-01 (UC-11, DPPL Algo-001 / Algo-027).
 *
 * Google only redirects to http(s) URLs, so the backend relays the result:
 *   app -> GET /api/auth/google/mulai?kembali=<deep link> -> Google consent
 *       -> GET /api/auth/google/callback -> <deep link>?code=...
 *   app -> POST /api/auth/google { kodeOtorisasi } -> session token
 * The code exchange (which needs the client secret) stays on the backend.
 */
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { api, ApiError, KODE_KLIEN } from './client';
import { simpanSesi, type Pengguna, type Peran } from './sesi';

type ResponsMasuk = { token: string; waktuLogin: string; pengguna: Pengguna };

/**
 * Opens Google's consent screen and signs in with the returned code.
 * Resolves to the signed-in user, or `null` when the user closes the browser.
 * Throws `ApiError` when Google or the backend rejects the login (I-01-06).
 */
export async function masukDenganGoogle(): Promise<Pengguna | null> {
  const urlApi = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');
  if (!urlApi) {
    throw new ApiError(0, KODE_KLIEN.jaringan, 'EXPO_PUBLIC_API_URL belum diatur. Salin .env.example ke .env.');
  }

  // `sehati://` in the APK, `exp://<host>:8081/--/` in Expo Go. Both are allowed by the backend.
  const kembali = Linking.createURL('/');
  const hasil = await WebBrowser.openAuthSessionAsync(
    `${urlApi}/api/auth/google/mulai?kembali=${encodeURIComponent(kembali)}`,
    kembali,
  );
  if (hasil.type !== 'success') return null;

  const { queryParams } = Linking.parse(hasil.url);
  const kode = queryParams?.code;
  if (typeof kode !== 'string' || !kode) {
    if (queryParams?.error === 'access_denied') return null; // user pressed Cancel on Google
    throw new ApiError(401, 'TIDAK_TERAUTENTIKASI', 'Google tidak mengembalikan kode otorisasi.');
  }

  const respons = await api.post<ResponsMasuk>('/api/auth/google', { kodeOtorisasi: kode });
  await simpanSesi(respons.token, respons.pengguna);
  return respons.pengguna;
}

/**
 * Demo login: signs in as the seeded account for `peran` without Google.
 * Only works when the backend runs with `MODE_DEMO=1` (404 otherwise).
 */
export async function masukDemo(peran: Peran): Promise<Pengguna> {
  const respons = await api.post<ResponsMasuk>('/api/auth/demo', { peran });
  await simpanSesi(respons.token, respons.pengguna);
  return respons.pengguna;
}
