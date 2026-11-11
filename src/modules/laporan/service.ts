// LaporanController (DPPL 5.35). Identitas selalu dari sesi server, tidak pernah dari body atau query.
import type { ApiRespons, FormLaporan, HasilLaporan } from "@/contracts";
import type { KonteksSesi } from "@/lib/auth/konteks";
import type { ModulLaporan } from "./internal/ModulLaporan";
import { periksaLaporan } from "./internal/validasi";

export type { AnggotaKomunitas, RepositoriLaporan } from "./internal/ModulLaporan";

const TIDAK_BERWENANG = { ok: false, kode: "TIDAK_BERWENANG", pesan: "Akses ditolak" } as const;
const GAGAL_INTERNAL = { ok: false, kode: "GAGAL_INTERNAL", pesan: "Terjadi kesalahan. Coba lagi." } as const;

export class LaporanController {
  constructor(
    private readonly sesi: KonteksSesi,
    private readonly modul: ModulLaporan,
  ) {}

  // Kegagalan baca atau tulis menjadi galat terkontrol, tidak pernah daftar kosong atau sukses.
  private async jalankan<T>(kerja: () => Promise<ApiRespons<T>>): Promise<ApiRespons<T>> {
    try {
      return await kerja();
    } catch (galat) {
      console.error("[laporan] operasi gagal:", galat);
      return GAGAL_INTERNAL;
    }
  }

  // Algo-025
  async kirimLaporan(form: unknown): Promise<ApiRespons<HasilLaporan>> {
    if (this.sesi.peran !== "WARGA") return TIDAK_BERWENANG;
    const { idWarga, idKomunitas } = this.sesi;
    const hasil = periksaLaporan(form);
    if (!hasil.valid) return { ok: false, kode: "VALIDASI_GAGAL", pesan: "Isian belum lengkap", galat: hasil.galat };
    // Hanya kolom yang divalidasi yang diteruskan; foto selalu kosong sampai unggah tersedia.
    const { jenisGangguan, deskripsi } = form as FormLaporan;
    return this.jalankan(() => this.modul.kirimLaporan(idWarga, idKomunitas, { jenisGangguan, deskripsi, fotoPendukung: [] }));
  }
}
