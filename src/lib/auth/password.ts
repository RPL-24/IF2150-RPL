/**
 * Hash dan verifikasi kata sandi dengan scrypt bawaan Node (tanpa dependensi baru).
 * Hanya untuk server (route handler / server action / seed). JANGAN diimpor
 * dari middleware karena memakai node:crypto.
 *
 * Format tersimpan: scrypt$N$r$p$<salt base64>$<hash base64>
 */
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';

const N = 16384;
const R = 8;
const P = 1;
const PANJANG_HASH = 64;
const PANJANG_GARAM = 16;

/** Batas panjang agar scrypt tidak dipakai untuk membebani server. */
export const PASSWORD_MAKS_PANJANG = 128;

function scrypt(
  password: string,
  garam: Buffer,
  panjang: number,
  opsi: { N: number; r: number; p: number },
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(password, garam, panjang, opsi, (galat, kunci) =>
      galat ? reject(galat) : resolve(kunci),
    );
  });
}

export async function hashPassword(plain: string): Promise<string> {
  if (plain.length === 0 || plain.length > PASSWORD_MAKS_PANJANG) {
    throw new RangeError(
      `Panjang kata sandi harus 1 sampai ${PASSWORD_MAKS_PANJANG} karakter.`,
    );
  }
  const garam = randomBytes(PANJANG_GARAM);
  const hash = await scrypt(plain.normalize('NFKC'), garam, PANJANG_HASH, {
    N,
    r: R,
    p: P,
  });
  return `scrypt$${N}$${R}$${P}$${garam.toString('base64')}$${hash.toString('base64')}`;
}

/** Mengembalikan false untuk format rusak, bukan melempar galat. */
export async function verifyPassword(
  plain: string,
  tersimpan: string,
): Promise<boolean> {
  if (plain.length === 0 || plain.length > PASSWORD_MAKS_PANJANG) return false;

  const bagian = tersimpan.split('$');
  if (bagian.length !== 6 || bagian[0] !== 'scrypt') return false;

  const n = Number(bagian[1]);
  const r = Number(bagian[2]);
  const p = Number(bagian[3]);
  if (![n, r, p].every((x) => Number.isInteger(x) && x > 0)) return false;

  const garam = Buffer.from(bagian[4], 'base64');
  const diharapkan = Buffer.from(bagian[5], 'base64');
  if (garam.length === 0 || diharapkan.length === 0) return false;

  try {
    const hasil = await scrypt(plain.normalize('NFKC'), garam, diharapkan.length, {
      N: n,
      r,
      p,
    });
    return hasil.length === diharapkan.length && timingSafeEqual(hasil, diharapkan);
  } catch {
    return false;
  }
}