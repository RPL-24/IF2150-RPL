// LaporanController (DPPL 5.35). Identitas selalu dari sesi server, tidak pernah dari body atau query.
import type {
  ApiRespons,
  DetailLaporan,
  FormLaporan,
  HasilLaporan,
  HasilStatus,
  RingkasanLaporan,
  RingkasanStatus,
} from "@/contracts";
import type { KonteksSesi } from "@/lib/auth/konteks";
import type { GalatTransisi, ModulLaporan } from "./internal/ModulLaporan";
import { adalahStatus } from "./internal/StatusLaporan";
import { periksaLaporan } from "./internal/validasi";

export type { AnggotaKomunitas, GalatTransisi, RepositoriLaporan } from "./internal/ModulLaporan";

const TIDAK_BERWENANG = { ok: false, kode: "TIDAK_BERWENANG", pesan: "Akses ditolak" } as const;
const ID_TIDAK_VALID = { ok: false, kode: "VALIDASI_GAGAL", pesan: "ID laporan tidak valid" } as const;
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

  // ID dari URL bukan bukti kewenangan; hanya bentuknya yang diperiksa sebelum query pemilik.
  private idValid(id: unknown): id is string {
    return typeof id === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(id);
  }

  async daftarMilikWarga(): Promise<ApiRespons<RingkasanLaporan[]>> {
    if (this.sesi.peran !== "WARGA") return TIDAK_BERWENANG;
    const { idWarga } = this.sesi;
    return this.jalankan(() => this.modul.daftarMilikWarga(idWarga));
  }

  async detailMilikWarga(idLaporan: unknown): Promise<ApiRespons<DetailLaporan>> {
    if (this.sesi.peran !== "WARGA") return TIDAK_BERWENANG;
    if (!this.idValid(idLaporan)) return ID_TIDAK_VALID;
    const { idWarga } = this.sesi;
    return this.jalankan(() => this.modul.detailMilikWarga(idWarga, idLaporan));
  }

  async riwayatMilikWarga(idLaporan: unknown): Promise<ApiRespons<RingkasanStatus[]>> {
    if (this.sesi.peran !== "WARGA") return TIDAK_BERWENANG;
    if (!this.idValid(idLaporan)) return ID_TIDAK_VALID;
    const { idWarga } = this.sesi;
    return this.jalankan(() => this.modul.riwayatMilikWarga(idWarga, idLaporan));
  }

  async daftarPenugasan(): Promise<ApiRespons<RingkasanLaporan[]>> {
    if (this.sesi.peran !== "TEKNISI") return TIDAK_BERWENANG;
    const { idTeknisi } = this.sesi;
    return this.jalankan(() => this.modul.daftarPenugasan(idTeknisi));
  }

  async detailTugas(idLaporan: unknown): Promise<ApiRespons<DetailLaporan>> {
    if (this.sesi.peran !== "TEKNISI") return TIDAK_BERWENANG;
    if (!this.idValid(idLaporan)) return ID_TIDAK_VALID;
    const { idTeknisi } = this.sesi;
    return this.jalankan(() => this.modul.detailTugas(idTeknisi, idLaporan));
  }

  async riwayatTugas(idLaporan: unknown): Promise<ApiRespons<RingkasanStatus[]>> {
    if (this.sesi.peran !== "TEKNISI") return TIDAK_BERWENANG;
    if (!this.idValid(idLaporan)) return ID_TIDAK_VALID;
    const { idTeknisi } = this.sesi;
    return this.jalankan(() => this.modul.riwayatTugas(idTeknisi, idLaporan));
  }

  async perbaruiStatus(idLaporan: unknown, statusBaru: unknown): Promise<ApiRespons<HasilStatus> | GalatTransisi> {
    if (this.sesi.peran !== "TEKNISI") return TIDAK_BERWENANG;
    if (!this.idValid(idLaporan)) return ID_TIDAK_VALID;
    if (!adalahStatus(statusBaru)) {
      return { ok: false, kode: "VALIDASI_GAGAL", pesan: "Status tidak dikenal", galat: [{ kolom: "status", pesan: "Status tidak dikenal" }] };
    }
    const { idTeknisi } = this.sesi;
    try {
      return await this.modul.perbaruiStatus(idTeknisi, idLaporan, statusBaru);
    } catch (galat) {
      console.error("[laporan] perbaruiStatus gagal:", galat);
      return GAGAL_INTERNAL;
    }
  }
}
