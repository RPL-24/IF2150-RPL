/**
 * Device side of `SesiAutentikasi` (DPPL C-04, Algo-002).
 *
 * The session token and the signed-in user are kept in SecureStore (iOS Keychain /
 * Android Keystore), so a login survives an app restart until the backend ends the
 * session (logout, or BATAS_SESI of 30 days).
 */
import * as SecureStore from 'expo-secure-store';

import { api, ApiError, aturToken } from './client';

export type Peran = 'mahasiswa' | 'administrator';

export type Pengguna = {
  idPengguna: string;
  nama: string;
  email: string;
  peran: Peran;
};

type SesiTersimpan = { token: string; pengguna: Pengguna };

const KUNCI = 'sehati.sesi';

/** Starts using `token` for requests and remembers it on the device. */
export async function simpanSesi(token: string, pengguna: Pengguna) {
  aturToken(token);
  try {
    await SecureStore.setItemAsync(KUNCI, JSON.stringify({ token, pengguna } satisfies SesiTersimpan));
  } catch {
    // Not persisted (e.g. web): the session still works until the app closes.
  }
}

/** Forgets the session on this device only. */
export async function hapusSesi() {
  aturToken(null);
  try {
    await SecureStore.deleteItemAsync(KUNCI);
  } catch {
    // Nothing stored.
  }
}

async function bacaSesi(): Promise<SesiTersimpan | null> {
  try {
    const isi = await SecureStore.getItemAsync(KUNCI);
    return isi ? (JSON.parse(isi) as SesiTersimpan) : null;
  } catch {
    return null;
  }
}

/**
 * `verifikasiToken` at app start: checks the stored token with `GET /api/me`.
 * Returns the user when the session is still active, `null` when there is none or
 * the backend ended it. Offline, it trusts the stored user so the app still opens;
 * the first request that gets a 401 sends the user back to I-01.
 * Never throws.
 */
export async function pulihkanSesi(): Promise<Pengguna | null> {
  const sesi = await bacaSesi();
  if (!sesi) return null;

  aturToken(sesi.token);
  try {
    const pengguna = await api.get<Pengguna>('/api/me');
    await simpanSesi(sesi.token, pengguna); // name or role may have changed
    return pengguna;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      await hapusSesi();
      return null;
    }
    return sesi.pengguna;
  }
}

/** `SesiAutentikasi.logout()`: ends the session on the backend (Q-003), then on the device. */
export async function keluar() {
  try {
    await api.post('/api/auth/logout');
  } catch {
    // Offline or already ended: still sign out locally.
  }
  await hapusSesi();
}
