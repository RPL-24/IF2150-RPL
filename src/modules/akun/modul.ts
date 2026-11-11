/**
 * ModulAkun (Business Layer): fasad modul akun di atas DataAkunBoundary.
 * Boundary diberikan lewat konstruktor agar mudah diganti dengan palsu pada tes.
 *
 * Operasi lain (daftarAkunMenunggu, ubahStatusPersetujuan, ambilWarga)
 * ditambahkan pada feat persetujuan.
 */
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import type { DataAkunBoundary } from './boundary';
import type { Akun, AkunRingkas, CalonPengguna } from './entity';

/**
 * Hash palsu untuk menyamakan waktu respons saat email tidak ditemukan,
 * supaya keberadaan email tidak bisa ditebak dari lamanya respons.
 */
let hashPalsu: Promise<string> | null = null;
function ambilHashPalsu(): Promise<string> {
  if (!hashPalsu) hashPalsu = hashPassword('kata-sandi-palsu-penyama-waktu');
  return hashPalsu;
}

export class ModulAkun {
  private readonly data: DataAkunBoundary;

  constructor(data: DataAkunBoundary) {
    this.data = data;
  }

  /**
   * Menambah satu operasi dibanding DPPL: pada Algo-029 controller memanggil
   * DataAkunBoundary.cariEmail langsung; di sini dilewatkan lewat modul agar
   * jalur View -> Controller -> Modul -> Boundary konsisten. Catat di B.1.
   */
  cariEmail(email: string): Promise<AkunRingkas | null> {
    return this.data.cariEmail(email);
  }

  /**
   * Membuat akun berstatus MENUNGGU dari calon pengguna lalu menyimpannya.
   * Melempar EmailSudahTerdaftar atau galat penyimpanan; tidak mengembalikan
   * kata sandi (hash) ke lapisan atas.
   */
  async registrasiCalon(calon: CalonPengguna): Promise<AkunRingkas> {
    const akun = await calon.daftarkan();
    await this.data.simpanAkun(akun);
    return {
      email: akun.email,
      nama: akun.nama,
      peran: akun.peran,
      statusAkun: akun.statusAkun,
    };
  }

  /**
   * Algo-032: akun bila email dan kata sandi cocok, selain itu null.
   * Status akun diperiksa oleh pemanggil setelah kredensial terbukti benar,
   * sehingga status tidak bocor kepada pihak yang tidak tahu kata sandinya.
   */
  async autentikasi(email: string, password: string): Promise<Akun | null> {
    const akun = await this.data.ambilAkun(email);
    if (!akun) {
      await verifyPassword(password, await ambilHashPalsu());
      return null;
    }
    return (await akun.cocokKredensial(email, password)) ? akun : null;
  }
}