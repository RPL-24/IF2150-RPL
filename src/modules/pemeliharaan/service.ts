// PemeliharaanController (DPPL 5.36). Pemanggil wajib mengambil idTeknisi dari sesi server.
import type { ApiRespons, FormPemeliharaan, HasilPemeliharaan, PemeliharaanService } from "@/contracts";
import { ModulPemeliharaan, type RepositoriPemeliharaan } from "./internal/ModulPemeliharaan";
import { periksaPemeliharaan } from "./internal/validasi";

export type { PerangkatRingkas, RepositoriPemeliharaan } from "./internal/ModulPemeliharaan";

// riwayatPerangkat menyusul pada tugas Sab 7 Nov.
export function buatPemeliharaanService(
  idTeknisi: string,
  data: RepositoriPemeliharaan,
): Pick<PemeliharaanService, "simpanCatatan"> {
  const modul = new ModulPemeliharaan(data);

  return {
    // Algo-026
    async simpanCatatan(form: FormPemeliharaan): Promise<ApiRespons<HasilPemeliharaan>> {
      const hasil = periksaPemeliharaan(form);
      if (!hasil.valid) {
        return { ok: false, kode: "VALIDASI_GAGAL", pesan: "Isian belum lengkap", galat: hasil.galat };
      }
      try {
        return await modul.simpanCatatan(idTeknisi, form);
      } catch (galat) {
        console.error("[pemeliharaan] simpanCatatan gagal:", galat);
        return { ok: false, kode: "GAGAL_INTERNAL", pesan: "Terjadi kesalahan. Coba lagi." };
      }
    },
  };
}
