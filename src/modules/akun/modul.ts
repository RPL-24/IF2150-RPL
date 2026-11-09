/**
 * ModulAkun (Business Layer): fasad modul akun di atas DataAkunBoundary.
 * Boundary diberikan lewat konstruktor agar mudah diganti dengan palsu pada tes.
 *
 * Operasi lain (autentikasi, daftarAkunMenunggu, ubahStatusPersetujuan,
 * ambilWarga) ditambahkan pada feat login dan persetujuan.
 */
import type { DataAkunBoundary } from './boundary';
import type { AkunRingkas, CalonPengguna } from './entity';

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
}