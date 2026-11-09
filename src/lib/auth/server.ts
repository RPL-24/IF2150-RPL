/**
 * Helper sesi sisi server (route handler, server action, server component).
 * JANGAN diimpor dari middleware: pakai './session' dan './konteks' di sana.
 */
import { cookies } from 'next/headers';
import {
  COOKIE_SESI,
  GalatAuth,
  SESI_MAKS_UMUR_DETIK,
  type KonteksSesi,
  type Peran,
} from './konteks';
import { bacaToken, buatToken } from './session';

/** Dipanggil setelah login berhasil dan akun berstatus DISETUJUI. */
export async function buatSesi(konteks: KonteksSesi): Promise<void> {
  const token = await buatToken(konteks);
  const jar = await cookies();
  jar.set(COOKIE_SESI, token, {
    httpOnly: true,
    sameSite: 'lax',
    // Aktifkan hanya bila aplikasi dilayani lewat HTTPS.
    secure: process.env.SESSION_COOKIE_SECURE === 'true',
    path: '/',
    maxAge: SESI_MAKS_UMUR_DETIK,
  });
}

export async function hapusSesi(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_SESI);
}

/** KonteksSesi dari cookie, atau null bila belum login / token tidak sah. */
export async function getSesi(): Promise<KonteksSesi | null> {
  const jar = await cookies();
  return bacaToken(jar.get(COOKIE_SESI)?.value);
}

/** Melempar GalatAuth (401) bila belum login. */
export async function wajibSesi(): Promise<KonteksSesi> {
  const sesi = await getSesi();
  if (!sesi) throw new GalatAuth('TIDAK_LOGIN');
  return sesi;
}

/**
 * Melempar GalatAuth (403) bila peran sesi tidak diizinkan.
 * Tipe hasilnya menyempit sesuai peran, contoh:
 *   const sesi = await wajibPeran('WARGA');  // sesi.idWarga bertipe number
 */
export async function wajibPeran<P extends Peran>(
  ...diizinkan: P[]
): Promise<Extract<KonteksSesi, { peran: P }>> {
  const sesi = await wajibSesi();
  if (!(diizinkan as Peran[]).includes(sesi.peran)) {
    throw new GalatAuth('DILARANG');
  }
  return sesi as Extract<KonteksSesi, { peran: P }>;
}