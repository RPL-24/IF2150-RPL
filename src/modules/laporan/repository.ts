// DataLaporanBoundary (DPPL 5.48) di atas Prisma. Semua query memakai parameter terikat.
import { prisma } from "@/lib/prisma";
import type { DataLaporan } from "./internal/LaporanGangguan";
import type { RepositoriLaporan } from "./internal/ModulLaporan";

type BarisLaporan = {
  idLaporan: string;
  idWarga: number;
  jenisGangguan: string;
  deskripsi: string;
  foto: string[];
  waktuDibuat: Date;
  status: DataLaporan["status"];
};

const keData = (b: BarisLaporan): DataLaporan => ({
  idLaporan: b.idLaporan,
  idWarga: b.idWarga,
  jenisGangguan: b.jenisGangguan,
  deskripsi: b.deskripsi,
  fotoPendukung: b.foto,
  waktuDibuat: b.waktuDibuat,
  status: b.status,
});

export const repositoriLaporan: RepositoriLaporan = {
  // true hanya setelah INSERT berhasil; galat database menjadi false dan modul melaporkannya sebagai GAGAL_SIMPAN.
  async simpanLaporan(laporan) {
    try {
      await prisma.laporanGangguan.create({
        data: {
          idLaporan: laporan.idLaporan,
          idWarga: laporan.idWarga,
          jenisGangguan: laporan.jenisGangguan,
          deskripsi: laporan.deskripsi,
          foto: laporan.fotoPendukung,
          waktuDibuat: laporan.waktuDibuat,
          status: laporan.status,
        },
      });
      return true;
    } catch (galat) {
      console.error("[laporan] INSERT laporan gagal:", galat);
      return false;
    }
  },

  // Terbaru dulu; id sebagai pembeda urutan bila waktu sama.
  async cariMilikWarga(idWarga) {
    const baris = await prisma.laporanGangguan.findMany({
      where: { idWarga },
      orderBy: [{ waktuDibuat: "desc" }, { idLaporan: "asc" }],
    });
    return baris.map(keData);
  },

  async cariDetailMilik(idWarga, idLaporan) {
    const baris = await prisma.laporanGangguan.findFirst({
      where: { idWarga, idLaporan },
      include: { warga: { select: { akun: { select: { nama: true } } } } },
    });
    return baris ? { ...keData(baris), namaPemilik: baris.warga.akun.nama } : null;
  },

  async cariRiwayatMilik(idWarga, idLaporan) {
    const baris = await prisma.riwayatStatusLaporan.findMany({
      where: { idLaporan, laporan: { idWarga } },
      orderBy: [{ timestamp: "asc" }, { idRiwayat: "asc" }],
    });
    return baris.map((b) => ({ idRiwayat: b.idRiwayat, idLaporan: b.idLaporan, status: b.status, timestamp: b.timestamp }));
  },
};
