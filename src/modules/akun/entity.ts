/**
 * Entity modul akun (Business Layer).
 *
 * Berisi bagian yang dibutuhkan registrasi (UC12): C06 StatusAkun dan
 * C05 CalonPengguna. Entity Akun/Warga/Teknisi/Pengurus (C01-C04) dan
 * dashboardTujuan() ditambahkan pada feat login.
 */
import type { Peran } from '@/lib/auth/konteks';
import { hashPassword } from '@/lib/auth/password';

/** C06 StatusAkun */
export const STATUS_AKUN = ['MENUNGGU', 'DISETUJUI'] as const;
export type StatusAkun = (typeof STATUS_AKUN)[number];

/** Data akun tersimpan. `password` berisi hash scrypt, bukan kata sandi asli. */
export type DataAkun = {
  email: string;
  nama: string;
  password: string;
  peran: Peran;
  statusAkun: StatusAkun;
};

/** Akun tanpa kredensial, aman untuk dikembalikan antarlapisan. */
export type AkunRingkas = Omit<DataAkun, 'password'>;

/** C05 CalonPengguna */
export class CalonPengguna {
  private readonly nama: string;
  private readonly email: string;
  private readonly password: string;
  private readonly peranPilihan: Peran;

  constructor(nama: string, email: string, password: string, peranPilihan: Peran) {
    this.nama = nama;
    this.email = email;
    this.password = password;
    this.peranPilihan = peranPilihan;
  }

  /**
   * Algo-008: membuat akun berstatus MENUNGGU dengan kata sandi ter-hash.
   * Peran yang diajukan tidak memberi hak akses sebelum akun disetujui.
   */
  async daftarkan(): Promise<DataAkun> {
    return {
      email: this.email,
      nama: this.nama,
      password: await hashPassword(this.password),
      peran: this.peranPilihan,
      statusAkun: 'MENUNGGU',
    };
  }
}