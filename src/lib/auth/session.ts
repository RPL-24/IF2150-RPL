/**
 * Token sesi bertanda tangan HMAC-SHA256 memakai Web Crypto.
 * Berjalan di Edge (middleware) maupun Node, tanpa dependensi baru.
 *
 * Format token: <payload base64url>.<tanda tangan base64url>
 * Payload = KonteksSesi + exp (detik epoch).
 *
 * Butuh env SESSION_SECRET (minimal 32 karakter).
 */
import {
  bentukKonteks,
  SESI_MAKS_UMUR_DETIK,
  type KonteksSesi,
} from './konteks';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function ambilSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'SESSION_SECRET belum diatur atau kurang dari 32 karakter (lihat src/.env.example).',
    );
  }
  return secret;
}

function kunciHmac() {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(ambilSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function keBase64Url(bytes: Uint8Array): string {
  let biner = '';
  for (const b of bytes) biner += String.fromCharCode(b);
  return btoa(biner).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function dariBase64Url(teks: string) {
  try {
    const b64 = teks.replace(/-/g, '+').replace(/_/g, '/');
    const berisi = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const biner = atob(berisi);
    const keluar = new Uint8Array(biner.length);
    for (let i = 0; i < biner.length; i++) keluar[i] = biner.charCodeAt(i);
    return keluar;
  } catch {
    return null;
  }
}

export async function buatToken(
  konteks: KonteksSesi,
  maksUmurDetik: number = SESI_MAKS_UMUR_DETIK,
  sekarang: number = Date.now(),
): Promise<string> {
  const exp = Math.floor(sekarang / 1000) + maksUmurDetik;
  const isi = keBase64Url(encoder.encode(JSON.stringify({ ...konteks, exp })));
  const tanda = await crypto.subtle.sign('HMAC', await kunciHmac(), encoder.encode(isi));
  return `${isi}.${keBase64Url(new Uint8Array(tanda))}`;
}

/** Mengembalikan KonteksSesi bila token sah dan belum kedaluwarsa, selain itu null. */
export async function bacaToken(
  token: string | null | undefined,
  sekarang: number = Date.now(),
): Promise<KonteksSesi | null> {
  if (!token) return null;

  const bagian = token.split('.');
  if (bagian.length !== 2) return null;
  const [isi, tanda] = bagian;

  const tandaBytes = dariBase64Url(tanda);
  if (!tandaBytes) return null;

  const sah = await crypto.subtle.verify(
    'HMAC',
    await kunciHmac(),
    tandaBytes,
    encoder.encode(isi),
  );
  if (!sah) return null;

  const mentah = dariBase64Url(isi);
  if (!mentah) return null;

  let data: unknown;
  try {
    data = JSON.parse(decoder.decode(mentah));
  } catch {
    return null;
  }
  if (typeof data !== 'object' || data === null) return null;

  const exp = (data as { exp?: unknown }).exp;
  if (typeof exp !== 'number' || exp <= Math.floor(sekarang / 1000)) return null;

  return bentukKonteks(data);
}