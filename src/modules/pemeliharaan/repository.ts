// Bagian DataPerangkatBoundary untuk UC08 (DPPL 5.47, Algo-046 dan Algo-047).
import { prisma } from "@/lib/prisma";
import type { RepositoriPemeliharaan } from "./internal/ModulPemeliharaan";

export const repositoriPemeliharaan: RepositoriPemeliharaan = {
  async cariPerangkatTeknisi(idTeknisi, idPerangkat) {
    return prisma.perangkat.findFirst({
      where: { idPerangkat, penugasan: { some: { idTeknisi } } },
      select: { idPerangkat: true, nama: true },
    });
  },

  async daftarPerangkatTeknisi(idTeknisi) {
    return prisma.perangkat.findMany({
      where: { penugasan: { some: { idTeknisi } } },
      select: { idPerangkat: true, nama: true },
      orderBy: { idPerangkat: "asc" },
    });
  },

  // Algo-047: kegagalan database menjadi false, dan modul melaporkannya sebagai GAGAL_SIMPAN.
  async simpanCatatan(catatan) {
    try {
      await prisma.catatanPemeliharaan.create({ data: catatan });
      return true;
    } catch (galat) {
      console.error("[pemeliharaan] INSERT catatan gagal:", galat);
      return false;
    }
  },
};
