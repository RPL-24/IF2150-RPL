/**
 * DataAkunBoundary (Data Access Layer): satu-satunya tempat modul akun
 * mengakses basis data, lewat Prisma (kelas Database pada DPPL).
 *
 * ASUMSI SKEMA (cocokkan dengan schema.prisma Rafiandhi):
 * - model `Akun`: `email` (unique), `nama`, `password` (hash), `peran`, `statusAkun`
 * - relasi opsional satu-satu dari Akun: `warga` (idWarga, idKomunitas,
 *   statusTerdaftar), `teknisi` (idTeknisi, kontak), `pengurus` (idPengurus)
 * Bila nama berbeda, cukup ubah berkas ini; kesalahan tipe dari Prisma akan
 * menunjukkan bagian yang perlu disesuaikan.
 *
 * Operasi lain (ambilBerdasarkanStatus, perbaruiAkun, cariWarga) ditambahkan
 * pada feat persetujuan.
 */
import type { Peran } from '@/lib/auth/konteks';
import { prisma } from '@/lib/prisma';
import {
  Akun,
  type AkunRingkas,
  type DataAkun,
  type ProfilPeran,
  type StatusAkun,
} from './entity';
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
   * Ambil akun lengkap (beserta profil perannya) sebagai entity untuk
   * autentikasi. Mengembalikan null bila email tidak ada. Profil boleh null
   * (misalnya akun yang masih menunggu persetujuan).
   */
  async ambilAkun(email: string): Promise<Akun | null> {
    const baris = await prisma.akun.findUnique({
      where: { email },
      include: { warga: true, teknisi: true, pengurus: true },
    });
    if (!baris) return null;

    let profil: ProfilPeran | null = null;
    switch (String(baris.peran).toUpperCase()) {
      case 'WARGA':
        profil = baris.warga
          ? {
              idWarga: baris.warga.idWarga,
              idKomunitas: baris.warga.idKomunitas,
              statusTerdaftar: baris.warga.statusTerdaftar,
            }
          : null;
        break;
      case 'TEKNISI':
        profil = baris.teknisi
          ? { idTeknisi: baris.teknisi.idTeknisi, kontak: baris.teknisi.kontak ?? '' }
          : null;
        break;
      case 'PENGURUS':
        profil = baris.pengurus ? { idPengurus: baris.pengurus.idPengurus } : null;
        break;
    }

    return Akun.buatAkun(
      baris.peran,
      {
        email: baris.email,
        nama: baris.nama,
        password: baris.password,
        statusAkun: baris.statusAkun as StatusAkun,
      },
      profil,
    );
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