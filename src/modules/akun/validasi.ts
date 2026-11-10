/**
 * Validasi untuk modul akun (bagian dari kelas Validasi pada DPPL).
 * Validasi di sisi klien hanya kemudahan; server selalu memvalidasi ulang.
 */
import { PERAN } from '@/lib/auth/konteks';
import { PASSWORD_MAKS_PANJANG } from '@/lib/auth/password';

export type KolomRegistrasi = 'nama' | 'email' | 'password' | 'peran';
export type KesalahanRegistrasi = Partial<Record<KolomRegistrasi, string>>;

export const PASSWORD_MIN_PANJANG = 8;
const NAMA_MAKS_PANJANG = 100;
const EMAIL_MAKS_PANJANG = 254;
const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Validasi {
  /**
   * Kesalahan untuk nama, email, dan kata sandi. `existing` adalah akun yang
   * sudah memakai email tersebut (atau null/undefined bila belum ada).
   * Nilai diharapkan sudah dinormalisasi (nama di-trim, email huruf kecil).
   */
  private kesalahanIdentitas(
    nama: unknown,
    email: unknown,
    password: unknown,
    existing: unknown,
  ): KesalahanRegistrasi {
    const galat: KesalahanRegistrasi = {};

    if (typeof nama !== 'string' || nama.trim() === '') {
      galat.nama = 'Nama lengkap wajib diisi.';
    } else if (nama.length > NAMA_MAKS_PANJANG) {
      galat.nama = `Nama maksimal ${NAMA_MAKS_PANJANG} karakter.`;
    }

    if (typeof email !== 'string' || email.trim() === '') {
      galat.email = 'Email wajib diisi.';
    } else if (email.length > EMAIL_MAKS_PANJANG || !POLA_EMAIL.test(email)) {
      galat.email = 'Format email tidak sah.';
    } else if (existing !== null && existing !== undefined) {
      galat.email = 'Email sudah terdaftar. Gunakan email lain.';
    }

    if (typeof password !== 'string' || password === '') {
      galat.password = 'Kata sandi wajib diisi.';
    } else if (password.length < PASSWORD_MIN_PANJANG) {
      galat.password = `Kata sandi minimal ${PASSWORD_MIN_PANJANG} karakter.`;
    } else if (password.length > PASSWORD_MAKS_PANJANG) {
      galat.password = `Kata sandi maksimal ${PASSWORD_MAKS_PANJANG} karakter.`;
    }

    return galat;
  }

  /** Algo-031: true bila nama, email, dan kata sandi sah dan email belum terdaftar. */
  validasiRegistrasi(
    nama: unknown,
    email: unknown,
    password: unknown,
    existing: unknown,
  ): boolean {
    return Object.keys(this.kesalahanIdentitas(nama, email, password, existing)).length === 0;
  }

  /** Seperti validasiRegistrasi, ditambah pemeriksaan peran, dengan pesan per kolom. */
  periksaRegistrasi(
    data: { nama: unknown; email: unknown; password: unknown; peran: unknown },
    existing: unknown,
  ): KesalahanRegistrasi {
    const galat = this.kesalahanIdentitas(data.nama, data.email, data.password, existing);
    const peranSah = (PERAN as readonly unknown[]).includes(data.peran);
    if (!peranSah) {
      galat.peran = 'Peran yang diajukan tidak dikenal.';
    }
    return galat;
  }
}