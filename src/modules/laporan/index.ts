// Titik rakit modul laporan (hanya server). Route dan layar memanggil buatLaporanController(sesi).
import type { KonteksSesi } from "@/lib/auth/konteks";
import { DataAkunBoundary } from "@/modules/akun/boundary";
import { ModulAkun } from "@/modules/akun/modul";
import { ModulLaporan, type AnggotaKomunitas } from "./internal/ModulLaporan";
import { repositoriLaporan } from "./repository";
import { LaporanController } from "./service";

const modulAkun = new ModulAkun(new DataAkunBoundary());

const anggota: AnggotaKomunitas = {
  async validasiKeanggotaan(idWarga, idKomunitas) {
    const warga = await modulAkun.ambilWarga(idWarga);
    return warga?.validasiKeanggotaan(idKomunitas) ?? false;
  },
};

export function buatLaporanController(sesi: KonteksSesi): LaporanController {
  return new LaporanController(sesi, new ModulLaporan(repositoriLaporan, anggota));
}
