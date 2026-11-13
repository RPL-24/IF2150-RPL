// ModulLaporan (DPPL 5.42).
import type {
  ApiGalat,
  ApiRespons,
  DetailLaporan,
  FormLaporan,
  HasilLaporan,
  HasilStatus,
  OpsiStatusLegal,
  RingkasanLaporan,
  RingkasanStatus,
  StatusLaporan,
} from "@/contracts";
import { LaporanGangguan, type DataLaporan, type DataLaporanPemilik, type PenyimpanLaporan } from "./LaporanGangguan";
import { PenugasanLaporan, type DataPenugasan } from "./PenugasanLaporan";
import { RiwayatStatusLaporan, type DataRiwayat } from "./RiwayatStatusLaporan";

// Galat transisi ditolak membawa daftar status sah berikutnya supaya layar bisa menampilkannya (I-11).
export type GalatTransisi = ApiGalat & { opsi: OpsiStatusLegal };

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
  // Sisi teknisi: syarat penugasan ada pada setiap query.
  cariPenugasan(idTeknisi: string, idLaporan: string): Promise<DataPenugasan | null>;
  cariDaftarTugas(idTeknisi: string): Promise<DataLaporan[]>;
  cariDetailTugas(idTeknisi: string, idLaporan: string): Promise<DataLaporanPemilik | null>;
  cariRiwayatTugas(idTeknisi: string, idLaporan: string): Promise<DataRiwayat[]>;
  // Algo-040: status dan riwayat tersimpan bersama atau tidak sama sekali. false berarti gagal atau konflik.
  simpanStatusDanRiwayat(
    laporan: DataLaporan,
    riwayat: DataRiwayat,
    idTeknisi: string,
    statusLama: StatusLaporan,
  ): Promise<boolean>;
}

const TIDAK_TERSEDIA_TUGAS = { ok: false, kode: "TIDAK_DITEMUKAN", pesan: "Tugas tidak tersedia" } as const;
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

  async daftarPenugasan(idTeknisi: string): Promise<ApiRespons<RingkasanLaporan[]>> {
    const daftar = await this.data.cariDaftarTugas(idTeknisi);
    return { ok: true, data: daftar.map((d) => LaporanGangguan.dariData(d).getRingkasan()) };
  }

  async detailTugas(idTeknisi: string, idLaporan: string): Promise<ApiRespons<DetailLaporan>> {
    const laporan = await this.data.cariDetailTugas(idTeknisi, idLaporan);
    if (!laporan) return TIDAK_TERSEDIA_TUGAS;
    return { ok: true, data: LaporanGangguan.dariData(laporan).getDetailLaporan(laporan.namaPemilik) };
  }

  // Tambahan atas DPPL: I-11 menampilkan riwayat tugas. Penugasan diperiksa dulu seperti detailTugas.
  async riwayatTugas(idTeknisi: string, idLaporan: string): Promise<ApiRespons<RingkasanStatus[]>> {
    if (!(await this.data.cariDetailTugas(idTeknisi, idLaporan))) return TIDAK_TERSEDIA_TUGAS;
    const riwayat = await this.data.cariRiwayatTugas(idTeknisi, idLaporan);
    return { ok: true, data: riwayat.map(RiwayatStatusLaporan.ringkas) };
  }

  // Algo-034 (bagian perbaruiStatus)
  async perbaruiStatus(
    idTeknisi: string,
    idLaporan: string,
    statusBaru: StatusLaporan,
  ): Promise<ApiRespons<HasilStatus> | GalatTransisi> {
    const tugas = await this.data.cariPenugasan(idTeknisi, idLaporan);
    if (!tugas || !new PenugasanLaporan(tugas).verifikasi(idTeknisi, idLaporan)) {
      return { ok: false, kode: "TIDAK_BERWENANG", pesan: "Teknisi tidak berwenang" };
    }
    const data = await this.data.cariDetailTugas(idTeknisi, idLaporan);
    if (!data) return TIDAK_TERSEDIA_TUGAS;

    const laporan = LaporanGangguan.dariData(data);
    if (!laporan.validasiTransisi(statusBaru)) {
      return {
        ok: false,
        kode: "VALIDASI_GAGAL",
        pesan: "Transisi status tidak valid",
        opsi: { statusBerikutnya: laporan.statusBerikutnya() },
      };
    }

    const statusLama = laporan.status;
    laporan.ubahStatus(statusBaru);
    const riwayat = new RiwayatStatusLaporan(idLaporan, statusBaru, new Date());
    if (!(await this.data.simpanStatusDanRiwayat(laporan.toData(), riwayat.data, idTeknisi, statusLama))) {
      return { ok: false, kode: "KONFLIK", pesan: "Status berubah atau gagal disimpan. Muat ulang halaman." };
    }
    return { ok: true, data: { idLaporan, status: statusBaru, timestamp: riwayat.data.timestamp.toISOString() } };
  }
}
