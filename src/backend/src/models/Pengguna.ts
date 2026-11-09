import prisma from '../database/prisma.js';
import {
  KontrakPekerjaan,
  STATUS_KETERSEDIAAN,
  STATUS_PEKERJAAN,
} from './KontrakPekerjaan.js';

export interface PenggunaInitData {
  idPengguna: string;
  nomorTelepon?: string;
  email?: string;
  namaPengguna?: string;
  akumulasiRating?: number;
  riwayatRating?: number[];
  username?: string;
  passwordHash?: string;
}

/**
 * Kelas DPPL C01 - Pengguna
 * Merepresentasikan entitas dasar pengguna aplikasi serta operasi konfirmasiPekerjaan (UC07, KF13, KNF21, KNF22).
 */
export class Pengguna {
  private idPengguna: string;
  private nomorTelepon: string;
  private email: string;
  private namaPengguna: string;
  private akumulasiRating: number;
  private riwayatRating: number[];
  private username: string;
  private passwordHash: string;

  constructor(data?: Partial<PenggunaInitData>) {
    this.idPengguna = data?.idPengguna ?? '';
    this.nomorTelepon = data?.nomorTelepon ?? '';
    this.email = data?.email ?? '';
    this.namaPengguna = data?.namaPengguna ?? '';
    this.akumulasiRating = data?.akumulasiRating ?? 0.0;
    this.riwayatRating = data?.riwayatRating ?? [];
    this.username = data?.username ?? '';
    this.passwordHash = data?.passwordHash ?? '';
  }

  public getId(): string {
    return this.idPengguna;
  }

  public getNomor(): string {
    return this.nomorTelepon;
  }

  public getEmail(): string {
    return this.email;
  }

  public getNama(): string {
    return this.namaPengguna;
  }

  public setNomor(nomorBaru: string): void {
    this.nomorTelepon = nomorBaru;
  }

  public setEmail(emailBaru: string): void {
    this.email = emailBaru;
  }

  public setNama(namaBaru: string): void {
    this.namaPengguna = namaBaru;
  }

  public getAkumulasiRating(): number {
    return this.akumulasiRating;
  }

  public getRiwayatRating(): number[] {
    return [...this.riwayatRating];
  }

  public addNewRatingRiwayat(nilaiRating: number): void {
    this.riwayatRating.push(nilaiRating);
    const total = this.riwayatRating.reduce((acc, val) => acc + val, 0);
    this.akumulasiRating = Number((total / this.riwayatRating.length).toFixed(2));
  }

  /**
   * Operasi C01: konfirmasiPekerjaan(idKontrak: String): Boolean
   * Mengonfirmasi bahwa pekerjaan pada kontrak terkait telah selesai dan pembayaran telah diselesaikan (UC07, KF13),
   * memverifikasi status aktif sebelumnya adalah 'On Progress' atau 'Menunggu Konfirmasi Pelanggan' (KNF22),
   * mengubah status menjadi 'Done' (Q-016), dan membuka kembali kunci ketersediaan penyedia jasa.
   */
  public async konfirmasiPekerjaan(idKontrak: string): Promise<boolean> {
    if (!idKontrak || typeof idKontrak !== 'string') {
      return false;
    }

    const kontrak = await KontrakPekerjaan.fetchKontrakPekerjaan(idKontrak);
    if (!kontrak) {
      return false;
    }

    // Jika idPengguna diset pada instance Pengguna, pastikan kontrak milik pelanggan tersebut
    if (this.idPengguna && kontrak.getIdPelanggan() !== this.idPengguna) {
      return false;
    }

    const currentStatus = kontrak.getStatusPekerjaan();
    // KNF22: Verifikasi status aktif sebelumnya ('On Progress' atau 'Menunggu Konfirmasi Pelanggan')
    if (!KontrakPekerjaan.isValidStateTransition(currentStatus, STATUS_PEKERJAAN.DONE)) {
      return false;
    }

    const idPemberiJasa = kontrak.getIdPemberiJasa();

    try {
      await prisma.$transaction(async (tx) => {
        // Q-016: UPDATE kontrak_pekerjaan SET status_pekerjaan = 'Done' WHERE id_kontrak_pekerjaan = idKontrak
        const updated = await tx.kontrakPekerjaan.updateMany({
          where: {
            idKontrakPekerjaan: idKontrak,
            statusPekerjaan: {
              in: [
                STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN,
                STATUS_PEKERJAAN.ON_PROGRESS,
                'Menunggu Konfirmasi',
              ],
            },
          },
          data: {
            statusPekerjaan: STATUS_PEKERJAAN.DONE,
          },
        });

        if (updated.count === 0) {
          throw new Error('Status kontrak tidak memenuhi syarat untuk diselesaikan');
        }

        // Buka kembali kunci ketersediaan penyedia jasa jika tidak ada kontrak aktif lain
        const remainingActive = await tx.kontrakPekerjaan.count({
          where: {
            idPemberiJasa,
            idKontrakPekerjaan: { not: idKontrak },
            statusPekerjaan: {
              in: [
                STATUS_PEKERJAAN.MENUNGGU,
                STATUS_PEKERJAAN.ON_PROGRESS,
                STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN,
              ],
            },
          },
        });

        if (remainingActive === 0) {
          await tx.pemberiJasa.update({
            where: { idPemberiJasa },
            data: {
              statusKetersediaan: STATUS_KETERSEDIAAN.AVAILABLE,
              version: { increment: 1 },
            },
          });
        }
      });

      return true;
    } catch {
      return false;
    }
  }

  public laporkanMasalah(): void {
    // Didelegasikan ke modul TiketLaporan (UC08)
  }
}

export default Pengguna;
