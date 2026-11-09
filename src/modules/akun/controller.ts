/**
 * AkunController (Business Layer): menerima permintaan dari View/route,
 * memvalidasi, lalu mendelegasikan ke ModulAkun.
 *
 * Operasi lain (login, ambilAkunMenunggu, setujuiAkun, tolakAkun)
 * ditambahkan pada feat login dan persetujuan.
 */
import type { Peran } from '@/lib/auth/konteks';
import { CalonPengguna } from './entity';
import { EmailSudahTerdaftar } from './galat';
import type { ModulAkun } from './modul';
import type { KesalahanRegistrasi, Validasi } from './validasi';

export type HasilRegistrasi =
  | { berhasil: true; email: string }
  | {
      berhasil: false;
      kode: 'DATA_TIDAK_VALID' | 'EMAIL_TERDAFTAR';
      pesan: string;
      galat: KesalahanRegistrasi;
    };

const PESAN_GAGAL = 'Email sudah terdaftar atau data tidak valid';

function teksAtauKosong(nilai: unknown): string {
  return typeof nilai === 'string' ? nilai : '';
}

export class AkunController {
  private readonly modulAkun: ModulAkun;
  private readonly validasi: Validasi;

  constructor(modulAkun: ModulAkun, validasi: Validasi) {
    this.modulAkun = modulAkun;
    this.validasi = validasi;
  }

  /**
   * UC12, Algo-029. Nilai diterima sebagai `unknown` karena berasal dari
   * body permintaan yang belum tentu bertipe benar.
   * Galat penyimpanan tidak ditangkap di sini: dibiarkan naik agar pendaftaran
   * tidak pernah dilaporkan berhasil bila penyimpanan gagal.
   */
  async daftarkan(
    nama: unknown,
    email: unknown,
    password: unknown,
    peran: unknown,
  ): Promise<HasilRegistrasi> {
    // Normalisasi: login nanti harus memakai email huruf kecil yang sama.
    const namaBersih = teksAtauKosong(nama).trim();
    const emailBersih = teksAtauKosong(email).trim().toLowerCase();
    const peranBersih = teksAtauKosong(peran).trim().toUpperCase();

    const existing = emailBersih ? await this.modulAkun.cariEmail(emailBersih) : null;

    const galat = this.validasi.periksaRegistrasi(
      { nama: namaBersih, email: emailBersih, password, peran: peranBersih },
      existing,
    );
    if (Object.keys(galat).length > 0) {
      return {
        berhasil: false,
        kode: existing ? 'EMAIL_TERDAFTAR' : 'DATA_TIDAK_VALID',
        pesan: PESAN_GAGAL,
        galat,
      };
    }

    const calon = new CalonPengguna(
      namaBersih,
      emailBersih,
      password as string,
      peranBersih as Peran,
    );

    try {
      const akun = await this.modulAkun.registrasiCalon(calon);
      return { berhasil: true, email: akun.email };
    } catch (kesalahan) {
      if (kesalahan instanceof EmailSudahTerdaftar) {
        return {
          berhasil: false,
          kode: 'EMAIL_TERDAFTAR',
          pesan: PESAN_GAGAL,
          galat: { email: 'Email sudah terdaftar. Gunakan email lain.' },
        };
      }
      throw kesalahan;
    }
  }
}