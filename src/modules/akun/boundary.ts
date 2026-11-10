/**
 * DataAkunBoundary (Data Access Layer): satu-satunya tempat modul akun
 * mengakses basis data, lewat Prisma (kelas Database pada DPPL).
 *
 * ASUMSI SKEMA (cocokkan dengan schema.prisma Rafiandhi): model `Akun` dengan
 * field `email` (unique), `nama`, `password` (hash), `peran`, `statusAkun`.
 * Bila nama berbeda, cukup ubah berkas ini.
 *
 * Operasi lain (ambilAkun, ambilBerdasarkanStatus, perbaruiAkun, cariWarga)
 * ditambahkan pada feat login dan persetujuan.
 */
import type { Peran } from '@/lib/auth/konteks';
import { prisma } from '@/lib/prisma';
import type { AkunRingkas, DataAkun, StatusAkun } from './entity';
import { EmailSudahTerdaftar } from './galat';

function adalahPelanggaranUnik(galat: unknown): boolean {
  return (
    typeof galat === 'object' &&
    galat !== null &&
    (galat as { code?: unknown }).code === 'P2002'
  );
}

export class DataAkunBoundary {
  /** Cari akun berdasarkan email. Tidak membaca kata sandi. */
  async cariEmail(email: string): Promise<AkunRingkas | null> {
    const baris = await prisma.akun.findUnique({
      where: { email },
      select: { email: true, nama: true, peran: true, statusAkun: true },
    });
    if (!baris) return null;
    return {
      email: baris.email,
      nama: baris.nama,
      peran: baris.peran as Peran,
      statusAkun: baris.statusAkun as StatusAkun,
    };
  }

  /**
   * Simpan akun baru. Melempar EmailSudahTerdaftar bila email sudah dipakai
   * (menangani kondisi balapan antara pengecekan dan penyimpanan), dan
   * meneruskan galat lain agar pendaftaran tidak pernah dilaporkan berhasil
   * bila penyimpanan gagal.
   */
  async simpanAkun(akun: DataAkun): Promise<boolean> {
    try {
      await prisma.akun.create({
        data: {
          email: akun.email,
          nama: akun.nama,
          password: akun.password,
          peran: akun.peran,
          statusAkun: akun.statusAkun,
        },
      });
      return true;
    } catch (galat) {
      if (adalahPelanggaranUnik(galat)) throw new EmailSudahTerdaftar(akun.email);
      throw galat;
    }
  }
}