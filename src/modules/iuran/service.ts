// src/modules/iuran/service.ts
// Kelas Perancangan: IuranController (DPPL). Pemanggil wajib mengambil KonteksSesi dari sesi server.
import type {
  ApiRespons,
  FormatEkspor,
  IuranService,
  PeriodeDTO,
  PratinjauIuran,
  RekapitulasiDTO,
  RingkasanPemakaian,
  TagihanDTO,
} from "@/contracts";
import {
  ModulIuran,
  type KonteksSesiIuran,
  type RepositoriIuran,
} from "./internal/ModulIuran";

export type { KonteksSesiIuran, RepositoriIuran } from "./internal/ModulIuran";

export function buatIuranService(
  sesi: KonteksSesiIuran,
  data: RepositoriIuran,
): IuranService {
  const modul = new ModulIuran(data);

  return {
    async daftarPeriode(): Promise<ApiRespons<PeriodeDTO[]>> {
      try {
        return await modul.daftarPeriode();
      } catch (galat) {
        console.error("[iuran] daftarPeriode gagal:", galat);
        return { ok: false, kode: "GAGAL_INTERNAL", pesan: "Terjadi kesalahan. Coba lagi." };
      }
    },

    async lihatTagihanFinal(idPeriode: string): Promise<ApiRespons<TagihanDTO>> {
      try {
        return await modul.lihatTagihanFinal(sesi, idPeriode);
      } catch (galat) {
        console.error("[iuran] lihatTagihanFinal gagal:", galat);
        return { ok: false, kode: "GAGAL_INTERNAL", pesan: "Terjadi kesalahan. Coba lagi." };
      }
    },

    async analisisPemakaian(idPeriode: string): Promise<ApiRespons<RingkasanPemakaian>> {
      try {
        return await modul.analisisPemakaian(sesi, idPeriode);
      } catch (galat) {
        console.error("[iuran] analisisPemakaian gagal:", galat);
        return { ok: false, kode: "GAGAL_INTERNAL", pesan: "Terjadi kesalahan. Coba lagi." };
      }
    },

    async hitungPratinjau(idPeriode: string): Promise<ApiRespons<PratinjauIuran>> {
      try {
        return await modul.hitungPratinjau(sesi, idPeriode);
      } catch (galat) {
        console.error("[iuran] hitungPratinjau gagal:", galat);
        return { ok: false, kode: "GAGAL_INTERNAL", pesan: "Terjadi kesalahan. Coba lagi." };
      }
    },

    async tetapkanFinal(idPeriode: string): Promise<ApiRespons<PeriodeDTO>> {
      try {
        return await modul.tetapkanFinal(sesi, idPeriode);
      } catch (galat) {
        console.error("[iuran] tetapkanFinal gagal:", galat);
        return { ok: false, kode: "GAGAL_INTERNAL", pesan: "Terjadi kesalahan. Coba lagi." };
      }
    },

    async buatRekapitulasi(idPeriode: string): Promise<ApiRespons<RekapitulasiDTO>> {
      try {
        return await modul.buatRekapitulasi(sesi, idPeriode);
      } catch (galat) {
        console.error("[iuran] buatRekapitulasi gagal:", galat);
        return { ok: false, kode: "GAGAL_INTERNAL", pesan: "Terjadi kesalahan. Coba lagi." };
      }
    },

    async ekspor(
      idPeriode: string,
      format: FormatEkspor,
    ): Promise<ApiRespons<{ namaBerkas: string; url: string }>> {
      try {
        return await modul.ekspor(sesi, idPeriode, format);
      } catch (galat) {
        console.error("[iuran] ekspor gagal:", galat);
        return { ok: false, kode: "GAGAL_INTERNAL", pesan: "Terjadi kesalahan. Coba lagi." };
      }
    },
  };
}