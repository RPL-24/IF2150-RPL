// DataLaporanBoundary (DPPL 5.48) di atas Prisma. Semua query memakai parameter terikat.
import { prisma } from "@/lib/prisma";
import type { RepositoriLaporan } from "./internal/ModulLaporan";

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
};
