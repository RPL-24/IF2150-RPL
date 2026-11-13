/**
 * DataAkunBoundary (Data Access Layer): satu-satunya tempat modul akun
 * mengakses basis data, lewat Prisma (kelas Database pada DPPL).
 *
 * ASUMSI SKEMA (cocokkan dengan schema.prisma Rafiandhi):
 * - model `Akun`: `email` (unique), `nama`, `password` (hash), `peran`, `statusAkun`
 * - relasi opsional satu-satu dari Akun: `warga` (idWarga, idKomunitas,
 *   statusTerdaftar), `teknisi` (idTeknisi, kontak), `pengurus` (idPengurus)
 * - model `Warga` punya relasi balik `akun`
 * Bila nama berbeda, cukup ubah berkas ini; kesalahan tipe dari Prisma akan
 * menunjukkan bagian yang perlu disesuaikan.
 */
import type { Peran } from '@/lib/auth/konteks';
import { prisma } from '@/lib/prisma';
import {
  Akun,
  Warga,
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
   * Cari warga berdasarkan idWarga untuk memeriksa keanggotaan terkini (UC03).
   * Tidak mengambil kata sandi: Warga yang dikembalikan tidak dapat dipakai
   * untuk autentikasi. Mengembalikan null bila tidak ada.
   */
  async cariWarga(idWarga: number): Promise<Warga | null> {
    const baris = await prisma.warga.findUnique({
      where: { idWarga },
      include: { akun: { select: { email: true, nama: true, statusAkun: true } } },
    });
    if (!baris) return null;
    return new Warga(
      {
        email: baris.akun.email,
        nama: baris.akun.nama,
        password: '',
        statusAkun: baris.akun.statusAkun as StatusAkun,
      },
      {
        idWarga: baris.idWarga,
        idKomunitas: baris.idKomunitas,
        statusTerdaftar: baris.statusTerdaftar,
      },
    );
  }

  /**
   * Algo-038: akun berstatus tertentu, tanpa kata sandi. Diurutkan menurut
   * nama agar tampilannya stabil.
   */
  async ambilBerdasarkanStatus(status: StatusAkun): Promise<AkunRingkas[]> {
    const baris = await prisma.akun.findMany({
      where: { statusAkun: status },
      select: { email: true, nama: true, peran: true, statusAkun: true },
      orderBy: { nama: 'asc' },
    });
    return baris.map((b) => ({
      email: b.email,
      nama: b.nama,
      peran: b.peran as Peran,
      statusAkun: b.statusAkun as StatusAkun,
    }));
  }

  /**
   * Mengubah status akun hanya bila status saat ini masih `dari` (update
   * bersyarat dalam satu perintah). Mengembalikan false bila akun tidak ada
   * atau sudah diproses pihak lain, sehingga dua Pengurus tidak bisa saling
   * menimpa keputusan. Padanan perbaruiAkun pada DPPL; catat di B.1.
   */
  async perbaruiStatusAkun(
    email: string,
    dari: StatusAkun,
    ke: StatusAkun,
  ): Promise<boolean> {
    const hasil = await prisma.akun.updateMany({
      where: { email, statusAkun: dari },
      data: { statusAkun: ke },
    });
    return hasil.count === 1;
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