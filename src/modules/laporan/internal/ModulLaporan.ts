// ModulLaporan (DPPL 5.42).
import type { ApiRespons, DetailLaporan, FormLaporan, HasilLaporan, RingkasanLaporan, RingkasanStatus } from "@/contracts";
import { LaporanGangguan, type DataLaporan, type DataLaporanPemilik, type PenyimpanLaporan } from "./LaporanGangguan";
import { RiwayatStatusLaporan, type DataRiwayat } from "./RiwayatStatusLaporan";

// Bagian ModulAkun yang dipakai UC03 (Algo-003): keanggotaan dibaca dari basis data setiap kali.
export interface AnggotaKomunitas {
  validasiKeanggotaan(idWarga: number, idKomunitas: string): Promise<boolean>;
}

// Bagian DataLaporanBoundary (DPPL 5.48).
// Setiap pembacaan memuat predikat pemilik (id_warga), bukan hanya id laporan.
export interface RepositoriLaporan extends PenyimpanLaporan {
  cariMilikWarga(idWarga: number): Promise<DataLaporan[]>;
  cariDetailMilik(idWarga: number, idLaporan: string): Promise<DataLaporanPemilik | null>;
  cariRiwayatMilik(idWarga: number, idLaporan: string): Promise<DataRiwayat[]>;
}

const TIDAK_TERSEDIA = { ok: false, kode: "TIDAK_DITEMUKAN", pesan: "Laporan tidak tersedia untuk akun ini" } as const;

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

  // Daftar kosong adalah hasil sah; galat baca diteruskan oleh pemanggil.
  async daftarMilikWarga(idWarga: number): Promise<ApiRespons<RingkasanLaporan[]>> {
    const daftar = await this.data.cariMilikWarga(idWarga);
    return { ok: true, data: daftar.map((d) => LaporanGangguan.dariData(d).getRingkasan()) };
  }

  async detailMilikWarga(idWarga: number, idLaporan: string): Promise<ApiRespons<DetailLaporan>> {
    const laporan = await this.data.cariDetailMilik(idWarga, idLaporan);
    if (!laporan) return TIDAK_TERSEDIA;
    return { ok: true, data: LaporanGangguan.dariData(laporan).getDetailLaporan(laporan.namaPemilik) };
  }

  // Kepemilikan diperiksa lewat detail pada permintaan yang sama sebelum riwayat dibaca.
  async riwayatMilikWarga(idWarga: number, idLaporan: string): Promise<ApiRespons<RingkasanStatus[]>> {
    if (!(await this.data.cariDetailMilik(idWarga, idLaporan))) return TIDAK_TERSEDIA;
    const riwayat = await this.data.cariRiwayatMilik(idWarga, idLaporan);
    return { ok: true, data: riwayat.map(RiwayatStatusLaporan.ringkas) };
  }
}
