/**
 * AkunController (Business Layer): menerima permintaan dari View/route,
 * memvalidasi, lalu mendelegasikan ke ModulAkun.
 */
import { GalatAuth, type KonteksSesi, type Peran } from '@/lib/auth/konteks';
import { PASSWORD_MAKS_PANJANG } from '@/lib/auth/password';
import { CalonPengguna, Pengurus, type AkunRingkas } from './entity';
import { AkunTidakLengkap, EmailSudahTerdaftar } from './galat';
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

/**
 * `sesi` dipakai route untuk membuat cookie dan TIDAK boleh dikirim ke klien.
 */
export type HasilLogin =
  | { berhasil: true; tujuan: string; sesi: KonteksSesi }
  | {
      berhasil: false;
      kode: 'KREDENSIAL_SALAH' | 'MENUNGGU_PERSETUJUAN' | 'DITOLAK' | 'AKUN_TIDAK_LENGKAP';
      pesan: string;
    };

export type HasilPersetujuan =
  | { berhasil: true; email: string; status: 'DISETUJUI' | 'DITOLAK' }
  | { berhasil: false; kode: 'TIDAK_DITEMUKAN' | 'SUDAH_DIPROSES'; pesan: string };

const PESAN_GAGAL_REGISTRASI = 'Email sudah terdaftar atau data tidak valid';

// Pesan login mengikuti skenario alternatif pada antarmuka I-01.
const PESAN_KREDENSIAL_SALAH = 'Email atau password salah';
const PESAN_MENUNGGU = 'Akun masih menunggu persetujuan pengurus';
const PESAN_DITOLAK = 'Akun tidak memperoleh persetujuan';
const PESAN_TIDAK_LENGKAP = 'Akun belum dapat digunakan. Hubungi Pengurus.';

// Pesan persetujuan mengikuti antarmuka I-16.
const PESAN_TIDAK_DITEMUKAN = 'Pengajuan tidak ditemukan';
const PESAN_SUDAH_DIPROSES = 'Pengajuan sudah diproses atau berubah. Muat ulang daftar.';

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
    // Normalisasi: login memakai email huruf kecil yang sama.
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
        pesan: PESAN_GAGAL_REGISTRASI,
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
          pesan: PESAN_GAGAL_REGISTRASI,
          galat: { email: 'Email sudah terdaftar. Gunakan email lain.' },
        };
      }
      throw kesalahan;
    }
  }

  /**
   * UC13, Algo-030. Email tidak ditemukan dan kata sandi salah menghasilkan
   * hasil yang sama persis. Status akun baru diperiksa setelah kredensial
   * terbukti benar. Dasbor tujuan ditentukan dari akun di server.
   */
  async login(email: unknown, password: unknown): Promise<HasilLogin> {
    const emailBersih = teksAtauKosong(email).trim().toLowerCase();
    const kataSandi = typeof password === 'string' ? password : '';

    if (emailBersih === '' || kataSandi === '' || kataSandi.length > PASSWORD_MAKS_PANJANG) {
      return { berhasil: false, kode: 'KREDENSIAL_SALAH', pesan: PESAN_KREDENSIAL_SALAH };
    }

    const akun = await this.modulAkun.autentikasi(emailBersih, kataSandi);
    if (!akun) {
      return { berhasil: false, kode: 'KREDENSIAL_SALAH', pesan: PESAN_KREDENSIAL_SALAH };
    }

    if (akun.statusAkun === 'DITOLAK') {
      return { berhasil: false, kode: 'DITOLAK', pesan: PESAN_DITOLAK };
    }
    if (!akun.sudahDisetujui()) {
      return { berhasil: false, kode: 'MENUNGGU_PERSETUJUAN', pesan: PESAN_MENUNGGU };
    }

    try {
      return { berhasil: true, tujuan: akun.dashboardTujuan(), sesi: akun.konteksSesi() };
    } catch (kesalahan) {
      if (kesalahan instanceof AkunTidakLengkap) {
        return { berhasil: false, kode: 'AKUN_TIDAK_LENGKAP', pesan: PESAN_TIDAK_LENGKAP };
      }
      throw kesalahan;
    }
  }

  /**
   * Algo-006 (Pengurus.verifikasiKewenangan) terhadap data TERKINI di basis
   * data, bukan hanya sesi, sehingga Pengurus yang statusnya sudah berubah
   * tidak lagi berwenang. Melempar GalatAuth (403) bila tidak berwenang.
   * Dipanggil sebelum membaca atau mengubah data apa pun.
   */
  private async pastikanPengurus(sesi: KonteksSesi): Promise<void> {
    if (sesi.peran !== 'PENGURUS') throw new GalatAuth('DILARANG');

    const akun = await this.modulAkun.cariEmail(sesi.email);
    if (!akun || akun.peran !== 'PENGURUS') throw new GalatAuth('DILARANG');

    const pengurus = new Pengurus(
      { email: akun.email, nama: akun.nama, password: '', statusAkun: akun.statusAkun },
      { idPengurus: sesi.idPengurus },
    );
    if (!pengurus.verifikasiKewenangan()) throw new GalatAuth('DILARANG');
  }

  /** UC14: daftar akun MENUNGGU. Hanya Pengurus yang berwenang (I-16, A2). */
  async ambilAkunMenunggu(sesi: KonteksSesi): Promise<AkunRingkas[]> {
    await this.pastikanPengurus(sesi);
    return this.modulAkun.daftarAkunMenunggu();
  }

  /** UC14: menyetujui pengajuan yang masih MENUNGGU. */
  setujuiAkun(sesi: KonteksSesi, email: unknown): Promise<HasilPersetujuan> {
    return this.prosesPersetujuan(sesi, email, 'DISETUJUI');
  }

  /** UC14: menolak pengajuan yang masih MENUNGGU. */
  tolakAkun(sesi: KonteksSesi, email: unknown): Promise<HasilPersetujuan> {
    return this.prosesPersetujuan(sesi, email, 'DITOLAK');
  }

  /**
   * Keberhasilan hanya dilaporkan setelah perubahan benar-benar tersimpan.
   * Bila pengajuan sudah diproses pihak lain, hasilnya SUDAH_DIPROSES dan
   * status tidak diubah. Galat penyimpanan dibiarkan naik.
   */
  private async prosesPersetujuan(
    sesi: KonteksSesi,
    email: unknown,
    status: 'DISETUJUI' | 'DITOLAK',
  ): Promise<HasilPersetujuan> {
    await this.pastikanPengurus(sesi);

    const emailBersih = teksAtauKosong(email).trim().toLowerCase();
    if (emailBersih === '') {
      return { berhasil: false, kode: 'TIDAK_DITEMUKAN', pesan: PESAN_TIDAK_DITEMUKAN };
    }

    const berubah = await this.modulAkun.ubahStatusPersetujuan(emailBersih, status);
    if (berubah) return { berhasil: true, email: emailBersih, status };

    const akun = await this.modulAkun.cariEmail(emailBersih);
    return akun
      ? { berhasil: false, kode: 'SUDAH_DIPROSES', pesan: PESAN_SUDAH_DIPROSES }
      : { berhasil: false, kode: 'TIDAK_DITEMUKAN', pesan: PESAN_TIDAK_DITEMUKAN };
  }
}