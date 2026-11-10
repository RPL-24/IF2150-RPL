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
import Constants from 'expo-constants';

import { api, ApiError, KODE_KLIEN } from './client';
import { simpanSesi, type Pengguna, type Peran } from './sesi';

type ResponsMasuk = { token: string; waktuLogin: string; pengguna: Pengguna };

/**
 * Path used for the return deep link.
 *
 * `masuk` is a host, not a route: Expo Router would try to navigate to any path
 * (`exp://host:8081/--/masuk` produced its "something went wrong" screen), and a
 * hostless link (`sehati://`) is rejected by the backend because Android cannot
 * route an intent without a host. A single name satisfies both: the app only
 * needs to be foregrounded, and `tungguRedirect` reads `code` from the URL.
 */
const HOST_KEMBALI = 'masuk';

/** How long to trust `openAuthSessionAsync` before falling back to the `url` event. */
const GRACE_LISTENER_MS = 1500;

/**
 * Builds the link Google should bounce back to.
 *
 * The scheme has to match whichever app owns it right now:
 *
 * - Under Metro (Expo Go, and dev builds served by the dev server) the JS can
 *   only be reached through the dev server host, i.e. `exp://`.
 * - A production binary owns `sehati:`.
 *
 * The deciding signal is `hostUri`, not `executionEnvironment`: the latter has
 * reported values other than `storeClient` while the app was in fact running in
 * Expo Go, which made us hand Google a `sehati:` link that Expo Go cannot claim
 * and the login stalled with nothing in the browser.
 *
 * Both branches keep a host so the redirect stays routable and the backend
 * accepts it. `Linking.createURL` is not used: it returned `sehati://` and
 * `sehati:///` depending on the runtime.
 */
function tautanKembali(): string {
  const host = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;

  // Metro/Expo Go serves deep links under `/--/` on the dev-server host.
  if (host) return `exp://${host.replace(/^https?:\/\//, '')}/--/`;

  // Production binary: the scheme from app.json, with a host so it stays routable.
  return `sehati://${HOST_KEMBALI}`;
}

/** Extracts the authorization code from the deep link Google sent us back. */
function bacaHasil(url: string): { kode?: string; error?: string } {
  const { queryParams } = Linking.parse(url);
  const kode = queryParams?.code;
  const error = queryParams?.error;
  return {
    kode: typeof kode === 'string' && kode ? kode : undefined,
    error: typeof error === 'string' && error ? error : undefined,
  };
}

/**
 * Compares a received deep link against the one we expect.
 *
 * Scheme-insensitive for `exp`/`exps` (Expo Go may hand the link back over
 * `exps:` even when opened as `exp:`) and tolerant on the path, so any redirect
 * onto our scheme/host is accepted.
 */
function urlCocok(diterima: string, diharapkan: string): boolean {
  const samakan = (u: string) => u.replace(/^exps:/i, 'exp:');
  if (samakan(diterima).startsWith(samakan(diharapkan))) return true;

  try {
    return new URL(diterima).host === new URL(diharapkan).host;
  } catch {
    return false;
  }
}

/**
 * Awaits the auth browser, with a `Linking` listener as a safety net.
 *
 * `openAuthSessionAsync` is the primary path: it owns the Custom Tab and closes
 * it. The listener only exists for Android configurations where the redirect is
 * delivered solely as a `url` event and the promise never settles.
 *
 * The listener must NOT race the browser. Doing that made it win the handoff
 * and then the `finally` block dismissed the tab, so `openAuthSessionAsync`
 * resolved as a cancel and the login failed after the redirect had already
 * worked. Here the listener resolves a separate promise that is only consulted
 * after a grace period, so a working browser path is never preempted.
 */
async function tungguRedirect(
  urlOtorisasi: string,
  kembali: string,
): Promise<{ url?: string; dibatalkan: boolean }> {
  let selesaiDeepLink: (hasil: { url: string; dibatalkan: false }) => void = () => {};
  const dariDeepLink = new Promise<{ url?: string; dibatalkan: boolean }>((selesai) => {
    selesaiDeepLink = selesai;
  });

  const langganan = Linking.addEventListener('url', (peristiwa) => {
    if (urlCocok(peristiwa.url, kembali)) selesaiDeepLink({ url: peristiwa.url, dibatalkan: false });
  });

  try {
    const dariBrowser = WebBrowser.openAuthSessionAsync(urlOtorisasi, kembali).then((hasil) =>
      hasil.type === 'success' ? { url: hasil.url, dibatalkan: false } : { dibatalkan: true },
    );

    // Give the browser promise a grace period; only then fall back to the event.
    const batas = new Promise<'batas'>((selesai) => setTimeout(() => selesai('batas'), GRACE_LISTENER_MS));
    const pemenang = await Promise.race([dariBrowser, batas]);

    if (pemenang === 'batas') {
      // The promise is stuck: wait for the event, and close the tab ourselves.
      const hasil = await dariDeepLink;
      void WebBrowser.dismissBrowser?.().catch(() => {});
      return hasil;
    }
    return pemenang;
  } finally {
    langganan?.remove?.();
  }
}

/**
 * Opens Google's consent screen and signs in with the returned code.
 * Resolves to the signed-in user, or `null` when the user closes the browser.
 * Throws `ApiError` when Google or the backend rejects the login (I-01-06).
 */
export async function masukDenganGoogle(): Promise<Pengguna | null> {
  const urlApi = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');
  if (!urlApi) {
    throw new ApiError(0, KODE_KLIEN.konfigurasi, 'EXPO_PUBLIC_API_URL belum diatur. Salin .env.example ke .env.');
  }

  // `sehati://masuk` for a dev build or the APK, `exp://<host>/--/` under Metro.
  // Both carry a host, so the redirect is routable and the backend accepts it.
  const kembali = tautanKembali();
  // Printed because the correct scheme depends on the runtime; see tautanKembali.
  // `__DEV__` is a Metro global, absent under Node (unit tests).
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.log('[login] kembali =', kembali);
    console.log('[login] env =', {
      executionEnvironment: Constants.executionEnvironment,
      appOwnership: Constants.appOwnership,
      hostUri: Constants.expoConfig?.hostUri,
      debuggerHost: Constants.expoGoConfig?.debuggerHost,
      experienceUrl: (Constants as { experienceUrl?: string }).experienceUrl,
    });
  }
  console.log('[login] kembali = ', kembali);

  const urlOtorisasi = `${urlApi}/api/auth/google/mulai?kembali=${encodeURIComponent(kembali)}`;
  const hasil = await tungguRedirect(urlOtorisasi, kembali);
  if (!hasil.url) return null; // user closed the browser

  const { kode, error } = bacaHasil(hasil.url);
  if (!kode) {
    if (error === 'access_denied') return null; // user pressed Cancel on Google
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('[login] url tanpa code =', hasil.url);
    }
    throw new ApiError(401, 'TIDAK_TERAUTENTIKASI', 'Google tidak mengembalikan kode otorisasi.');
  }

  try {
    const respons = await api.post<ResponsMasuk>('/api/auth/google', { kodeOtorisasi: kode });
    await simpanSesi(respons.token, respons.pengguna);
    return respons.pengguna;
  } catch (e) {
    // The LoginView shows a generic message, so surface the real reason here.
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      const rinci = e instanceof ApiError ? `${e.status} ${e.kode}: ${e.pesan}` : String(e);
      console.log('[login] penukaran kode gagal =', rinci, e instanceof ApiError ? e.detail : '');
    }
    throw e;
  }
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
