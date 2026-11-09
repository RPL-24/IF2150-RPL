// src/modules/iuran/internal/ModulIuran.ts
import type {
  ApiRespons,
  AturanTarifDTO,
  DataPemakaianDTO,
  FormatEkspor,
  PeriodeDTO,
  PratinjauIuran,
  RekapitulasiDTO,
  RingkasanPemakaian,
  TagihanDTO,
} from "@/contracts";
import { KalkulatorIuran, isPemakaianLengkap } from "./KalkulatorIuran";
import { Rekapitulasi, type TagihanDenganNama } from "./Rekapitulasi";

export interface KonteksSesiIuran {
  peran: "WARGA" | "TEKNISI" | "PENGURUS";
  idWarga?: number | null;
  idPengurus?: string | null;
  idKomunitas?: string;
}

// DataIuranBoundary (DPPL)
export interface RepositoriIuran {
  daftarPeriode(): Promise<PeriodeDTO[]>;
  ambilPeriodeById(idPeriode: string): Promise<PeriodeDTO | null>;
  ambilTagihanWarga(idWarga: number, idPeriode: string): Promise<TagihanDTO | null>;
  ambilPemakaianPeriode(idPeriode: string): Promise<DataPemakaianDTO[]>;
  ambilTarifPeriode(idPeriode: string): Promise<AturanTarifDTO | null>;
  simpanTagihanDraft(idPeriode: string, tagihanList: TagihanDTO[]): Promise<boolean>;
  tetapkanPeriodeDanTagihanFinal(idPeriode: string): Promise<PeriodeDTO | null>;
  ambilTagihanFinalPeriode(idPeriode: string): Promise<TagihanDenganNama[]>;
  simpanRekapitulasi(rekap: RekapitulasiDTO): Promise<RekapitulasiDTO | null>;
}

export class ModulIuran {
  constructor(private readonly data: RepositoriIuran) {}

  async daftarPeriode(): Promise<ApiRespons<PeriodeDTO[]>> {
    const daftar = await this.data.daftarPeriode();
    return { ok: true, data: daftar };
  }

  /**
   * UC02 - Algo-050: Ambil tagihan milik warga sesi, hanya tampil bila periode & tagihan FINAL
   */
  async lihatTagihanFinal(
    sesi: KonteksSesiIuran,
    idPeriode: string,
  ): Promise<ApiRespons<TagihanDTO>> {
    if (sesi.peran !== "WARGA" || !sesi.idWarga) {
      return { ok: false, kode: "TIDAK_BERWENANG", pesan: "Akses ditolak." };
    }
    if (!idPeriode || !idPeriode.trim()) {
      return { ok: false, kode: "VALIDASI_GAGAL", pesan: "Periode wajib dipilih." };
    }

    const periode = await this.data.ambilPeriodeById(idPeriode);
    if (!periode || !periode.statusFinal) {
      return {
        ok: false,
        kode: "TIDAK_DITEMUKAN",
        pesan: "Tagihan final untuk periode ini belum tersedia.",
      };
    }

    const tagihan = await this.data.ambilTagihanWarga(sesi.idWarga, idPeriode);
    if (!tagihan || tagihan.status !== "FINAL") {
      return {
        ok: false,
        kode: "TIDAK_DITEMUKAN",
        pesan: "Tagihan final untuk periode ini belum tersedia.",
      };
    }

    return { ok: true, data: tagihan };
  }

  /**
   * UC09 - Algo-036: Hitung agregat pemakaian komunal (tolak non-Pengurus SEBELUM query)
   */
  async analisisPemakaian(
    sesi: KonteksSesiIuran,
    idPeriode: string,
  ): Promise<ApiRespons<RingkasanPemakaian>> {
    if (sesi.peran !== "PENGURUS") {
      return { ok: false, kode: "TIDAK_BERWENANG", pesan: "Akses ditolak." };
    }
    if (!idPeriode || !idPeriode.trim()) {
      return { ok: false, kode: "VALIDASI_GAGAL", pesan: "Periode wajib dipilih." };
    }

    const periode = await this.data.ambilPeriodeById(idPeriode);
    if (!periode) {
      return { ok: false, kode: "TIDAK_DITEMUKAN", pesan: "Periode tidak ditemukan." };
    }

    const daftarPemakaian = await this.data.ambilPemakaianPeriode(idPeriode);
    const ringkasan = KalkulatorIuran.hitungAgregat(periode, daftarPemakaian);

    return { ok: true, data: ringkasan };
  }

  /**
   * UC10 - Algo-013, 014, 015: Hitung dan simpan pratinjau iuran (DRAFT)
   */
  async hitungPratinjau(
    sesi: KonteksSesiIuran,
    idPeriode: string,
  ): Promise<ApiRespons<PratinjauIuran>> {
    if (sesi.peran !== "PENGURUS") {
      return { ok: false, kode: "TIDAK_BERWENANG", pesan: "Akses ditolak." };
    }
    if (!idPeriode || !idPeriode.trim()) {
      return { ok: false, kode: "VALIDASI_GAGAL", pesan: "Periode wajib dipilih." };
    }

    const periode = await this.data.ambilPeriodeById(idPeriode);
    if (!periode) {
      return { ok: false, kode: "TIDAK_DITEMUKAN", pesan: "Periode tidak ditemukan." };
    }
    if (periode.statusFinal) {
      return { ok: false, kode: "KONFLIK", pesan: "Periode sudah berstatus FINAL." };
    }

    const [daftarPemakaian, tarif] = await Promise.all([
      this.data.ambilPemakaianPeriode(idPeriode),
      this.data.ambilTarifPeriode(idPeriode),
    ]);

    if (!tarif) {
      return {
        ok: false,
        kode: "DATA_BELUM_LENGKAP",
        pesan: "Aturan tarif untuk periode ini belum diatur.",
      };
    }

    if (daftarPemakaian.length === 0 || daftarPemakaian.some((p) => !isPemakaianLengkap(p))) {
      return {
        ok: false,
        kode: "DATA_BELUM_LENGKAP",
        pesan: "Data pemakaian sebagian warga belum lengkap.",
      };
    }

    const { daftarTagihan, totalIuran } = KalkulatorIuran.hitungPratinjauKolektif(
      idPeriode,
      daftarPemakaian,
      tarif,
    );

    const tersimpan = await this.data.simpanTagihanDraft(idPeriode, daftarTagihan);
    if (!tersimpan) {
      return { ok: false, kode: "GAGAL_SIMPAN", pesan: "Gagal menyimpan pratinjau tagihan." };
    }

    return {
      ok: true,
      data: {
        periode,
        tarif,
        tagihan: daftarTagihan,
        totalIuran,
      },
    };
  }

  /**
   * UC10 - Algo-016, 028: Tetapkan periode dan seluruh tagihan menjadi FINAL secara atomik
   */
  async tetapkanFinal(
    sesi: KonteksSesiIuran,
    idPeriode: string,
  ): Promise<ApiRespons<PeriodeDTO>> {
    if (sesi.peran !== "PENGURUS") {
      return { ok: false, kode: "TIDAK_BERWENANG", pesan: "Akses ditolak." };
    }
    if (!idPeriode || !idPeriode.trim()) {
      return { ok: false, kode: "VALIDASI_GAGAL", pesan: "Periode wajib dipilih." };
    }

    const periode = await this.data.ambilPeriodeById(idPeriode);
    if (!periode) {
      return { ok: false, kode: "TIDAK_DITEMUKAN", pesan: "Periode tidak ditemukan." };
    }
    if (periode.statusFinal) {
      return { ok: false, kode: "KONFLIK", pesan: "Periode sudah berstatus FINAL." };
    }

    const [daftarPemakaian, tarif] = await Promise.all([
      this.data.ambilPemakaianPeriode(idPeriode),
      this.data.ambilTarifPeriode(idPeriode),
    ]);

    if (!tarif || daftarPemakaian.length === 0 || daftarPemakaian.some((p) => !isPemakaianLengkap(p))) {
      return {
        ok: false,
        kode: "DATA_BELUM_LENGKAP",
        pesan: "Data pemakaian atau aturan tarif belum lengkap untuk difinalisasi.",
      };
    }

    // Pastikan tagihan terhitung sebelum difinalisasi
    const { daftarTagihan } = KalkulatorIuran.hitungPratinjauKolektif(
      idPeriode,
      daftarPemakaian,
      tarif,
    );
    const draftOk = await this.data.simpanTagihanDraft(idPeriode, daftarTagihan);
    if (!draftOk) {
      return { ok: false, kode: "GAGAL_SIMPAN", pesan: "Gagal menyiapkan tagihan." };
    }

    const periodeFinal = await this.data.tetapkanPeriodeDanTagihanFinal(idPeriode);
    if (!periodeFinal) {
      return { ok: false, kode: "GAGAL_SIMPAN", pesan: "Gagal menetapkan status FINAL." };
    }

    return { ok: true, data: periodeFinal };
  }

  /**
   * UC11 - Algo-022: Buat rekapitulasi dari data FINAL
   */
  async buatRekapitulasi(
    sesi: KonteksSesiIuran,
    idPeriode: string,
  ): Promise<ApiRespons<RekapitulasiDTO>> {
    if (sesi.peran !== "PENGURUS") {
      return { ok: false, kode: "TIDAK_BERWENANG", pesan: "Akses ditolak." };
    }
    if (!idPeriode || !idPeriode.trim()) {
      return { ok: false, kode: "VALIDASI_GAGAL", pesan: "Periode wajib dipilih." };
    }

    const periode = await this.data.ambilPeriodeById(idPeriode);
    if (!periode) {
      return { ok: false, kode: "TIDAK_DITEMUKAN", pesan: "Periode tidak ditemukan." };
    }
    if (!periode.statusFinal) {
      return {
        ok: false,
        kode: "VALIDASI_GAGAL",
        pesan: "Rekapitulasi hanya dapat dibuat untuk periode yang sudah FINAL.",
      };
    }

    const daftarTagihan = await this.data.ambilTagihanFinalPeriode(idPeriode);
    if (daftarTagihan.length === 0) {
      return {
        ok: false,
        kode: "DATA_BELUM_LENGKAP",
        pesan: "Belum ada tagihan FINAL pada periode ini.",
      };
    }

    const rekap = Rekapitulasi.generate(idPeriode, daftarTagihan);
    const tersimpan = await this.data.simpanRekapitulasi(rekap);
    if (!tersimpan) {
      return { ok: false, kode: "GAGAL_SIMPAN", pesan: "Gagal menyimpan rekapitulasi." };
    }

    return { ok: true, data: tersimpan };
  }

  /**
   * UC11: Ekspor rekapitulasi ke CSV atau PDF
   */
  async ekspor(
    sesi: KonteksSesiIuran,
    idPeriode: string,
    format: FormatEkspor,
  ): Promise<ApiRespons<{ namaBerkas: string; url: string }>> {
    const hasilRekap = await this.buatRekapitulasi(sesi, idPeriode);
    if (!hasilRekap.ok) {
      return hasilRekap;
    }

    const ekstensi = format === "PDF" ? "pdf" : "csv";
    const namaBerkas = `rekapitulasi-${idPeriode}.${ekstensi}`;
    const url = `/api/iuran/rekapitulasi/ekspor?idPeriode=${encodeURIComponent(idPeriode)}&format=${format}&unduh=1`;

    return {
      ok: true,
      data: { namaBerkas, url },
    };
  }
}