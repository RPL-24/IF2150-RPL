/**
 * Adapter Google Sign-In (SKPL 2.4 butir 1, komponen Autentikasi): memverifikasi ID token Google.
 * Pemilik: P1.
 *
 * Aktif bila GOOGLE_CLIENT_IDS diisi (client ID OAuth web/android/ios, dipisah koma).
 * Kosong -> login Google dinonaktifkan dan aplikasi memakai akun email + kata sandi (gap G5).
 */
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config.js';
import { HttpError } from '../utils/http.js';

let klien;

export function googleSignInAktif() {
  return config.googleClientIds.length > 0;
}

/**
 * @param {string} idToken  ID token dari aplikasi (expo-auth-session)
 * @returns {Promise<{ googleSub: string, email: string, nama: string }>}
 * @throws HttpError 401 bila token tidak sah / email belum terverifikasi
 */
export async function verifikasiIdTokenGoogle(idToken) {
  klien ??= new OAuth2Client();
  let payload;
  try {
    const tiket = await klien.verifyIdToken({ idToken, audience: config.googleClientIds });
    payload = tiket.getPayload();
  } catch {
    throw new HttpError(401, 'Token Google tidak sah atau sudah kedaluwarsa');
  }
  if (!payload?.sub || !payload.email || payload.email_verified === false) {
    throw new HttpError(401, 'Akun Google belum memiliki email terverifikasi');
  }
  return { googleSub: payload.sub, email: payload.email, nama: payload.name ?? payload.email.split('@')[0] };
}
