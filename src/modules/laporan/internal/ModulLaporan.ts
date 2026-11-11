// ModulLaporan (DPPL 5.42).
import type { ApiRespons, FormLaporan, HasilLaporan } from "@/contracts";
import { LaporanGangguan, type PenyimpanLaporan } from "./LaporanGangguan";

// Bagian ModulAkun yang dipakai UC03 (Algo-003): keanggotaan dibaca dari basis data setiap kali.
export interface AnggotaKomunitas {
  validasiKeanggotaan(idWarga: number, idKomunitas: string): Promise<boolean>;
}

// Bagian DataLaporanBoundary (DPPL 5.48).
export interface RepositoriLaporan extends PenyimpanLaporan {}

export class ModulLaporan {
  constructor(
    private readonly data: RepositoriLaporan,
    private readonly akun: AnggotaKomunitas,
  ) {}

  // Algo-034: keanggotaan diperiksa sebelum objek laporan dibuat, jadi penolakan tidak menyentuh basis data.
  async kirimLaporan(idWarga: number, idKomunitas: string, form: FormLaporan): Promise<ApiRespons<HasilLaporan>> {
    if (!(await this.akun.validasiKeanggotaan(idWarga, idKomunitas))) {
      return { ok: false, kode: "TIDAK_BERWENANG", pesan: "Tidak memiliki otorisasi" };
    }
    const laporan = LaporanGangguan.baru(form, idWarga, new Date());
    if (await laporan.simpan(this.data)) {
      return { ok: true, data: { idLaporan: laporan.idLaporan, status: "MENUNGGU" } };
    }
    return { ok: false, kode: "GAGAL_SIMPAN", pesan: "Penyimpanan gagal" };
  }
}
