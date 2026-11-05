/**
 * HTTP client for the Sehati backend (Hono on Cloudflare Workers).
 *
 * - Base URL comes from `EXPO_PUBLIC_API_URL` (see `.env.example`).
 * - Sends `Authorization: Bearer <token>` once `aturToken` has been called
 *   (LoginView sets it after `POST /api/auth/google`, issue #3).
 * - Every non-2xx response is thrown as `ApiError`, parsed from the backend's
 *   envelope `{ error: { kode, pesan, detail? } }`.
 *
 * Usage:
 *   const me = await api.get<Pengguna>('/api/me');
 *   await api.put('/api/affirmation/time', { waktu: '07:00' });
 */

const BATAS_WAKTU_MS = 15_000;

/** Error codes the client itself produces (the backend's codes come in `kode` too). */
export const KODE_KLIEN = {
  /** No response: offline, wrong URL, or backend not running. */
  jaringan: 'JARINGAN_GAGAL',
  /** No response within BATAS_WAKTU_MS. */
  batasWaktu: 'BATAS_WAKTU',
  /** Response was not the expected JSON envelope. */
  respons: 'RESPONS_TIDAK_VALID',
} as const;

export class ApiError extends Error {
  constructor(
    /** HTTP status, or 0 when no response arrived. */
    readonly status: number,
    /** Machine-readable code, e.g. `TIDAK_TERAUTENTIKASI`, `SLOT_SUDAH_DIPESAN`. */
    readonly kode: string,
    /** Human-readable message (Indonesian) that screens can show in a Banner. */
    readonly pesan: string,
    readonly detail?: unknown,
  ) {
    super(pesan);
    this.name = 'ApiError';
  }
}

let token: string | null = null;
let saatTidakTerautentikasi: (() => void) | null = null;

/** Sets the session token sent with every request; `null` after logout. */
export function aturToken(baru: string | null) {
  token = baru;
}

/**
 * Registers a callback for 401 responses (expired or ended session), e.g. to
 * clear the stored token and go back to the login screen.
 */
export function aturSaatTidakTerautentikasi(fn: (() => void) | null) {
  saatTidakTerautentikasi = fn;
}

function urlDasar(): string {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (!url) {
    throw new ApiError(0, KODE_KLIEN.jaringan, 'EXPO_PUBLIC_API_URL belum diatur. Salin .env.example ke .env.');
  }
  return url.replace(/\/+$/, '');
}

async function minta<T>(metode: string, jalur: string, isi?: unknown): Promise<T> {
  const pengendali = new AbortController();
  const timer = setTimeout(() => pengendali.abort(), BATAS_WAKTU_MS);

  let res: Response;
  try {
    res = await fetch(urlDasar() + jalur, {
      method: metode,
      headers: {
        Accept: 'application/json',
        ...(isi !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: isi !== undefined ? JSON.stringify(isi) : undefined,
      signal: pengendali.signal,
    });
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (pengendali.signal.aborted) {
      throw new ApiError(0, KODE_KLIEN.batasWaktu, 'Server tidak merespons. Coba lagi nanti.');
    }
    throw new ApiError(0, KODE_KLIEN.jaringan, 'Tidak dapat terhubung ke server. Periksa koneksi internet.');
  } finally {
    clearTimeout(timer);
  }

  const teks = await res.text();
  let data: unknown;
  try {
    data = teks ? JSON.parse(teks) : undefined;
  } catch {
    throw new ApiError(res.status, KODE_KLIEN.respons, 'Respons server tidak dapat dibaca.');
  }

  if (!res.ok) {
    const galat = (data as { error?: { kode?: string; pesan?: string; detail?: unknown } } | undefined)?.error;
    if (res.status === 401) saatTidakTerautentikasi?.();
    throw new ApiError(
      res.status,
      galat?.kode ?? KODE_KLIEN.respons,
      galat?.pesan ?? `Permintaan gagal (HTTP ${res.status}).`,
      galat?.detail,
    );
  }

  return data as T;
}

export const api = {
  get: <T>(jalur: string) => minta<T>('GET', jalur),
  post: <T>(jalur: string, isi?: unknown) => minta<T>('POST', jalur, isi),
  put: <T>(jalur: string, isi?: unknown) => minta<T>('PUT', jalur, isi),
  patch: <T>(jalur: string, isi?: unknown) => minta<T>('PATCH', jalur, isi),
  hapus: <T>(jalur: string) => minta<T>('DELETE', jalur),
};
