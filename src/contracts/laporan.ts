// contracts/laporan.ts -- UC03, UC04, UC07. Pemilik modul: Rionaldo. Pemilik kontrak: Raffi.
import type { ApiRespons, StatusLaporan, WaktuISO } from "./common";

// idWarga, status, dan idKomunitas TIDAK ada di form: semuanya dari KonteksSesi / server.
export interface FormLaporan {
  jenisGangguan: string; // wajib, dari daftar jenis komunitas
  deskripsi: string; // wajib, di-trim
  fotoPendukung: string[]; // opsional; URI hanya dari unggahan terotorisasi
}

export interface HasilLaporan {
  idLaporan: string;
  status: "MENUNGGU"; // status awal selalu MENUNGGU
}

export interface RingkasanLaporan {
  idLaporan: string;
  jenisGangguan: string;
  status: StatusLaporan;
  waktuDibuat: WaktuISO;
}

export interface DetailLaporan extends RingkasanLaporan {
  deskripsi: string;
  fotoPendukung: string[];
  namaPemilik: string; // dari hasil terotorisasi, bukan parameter klien
}

export interface RingkasanStatus {
  status: StatusLaporan;
  timestamp: WaktuISO;
}

export interface HasilStatus {
  idLaporan: string;
  status: StatusLaporan;
  timestamp: WaktuISO; // waktu server setelah COMMIT
}

// Dikembalikan bersama galat KONFLIK / VALIDASI_GAGAL saat transisi ditolak.
export interface OpsiStatusLegal {
  statusBerikutnya: StatusLaporan[];
}

export interface LaporanService {
  // UC03
  kirimLaporan(f: FormLaporan): Promise<ApiRespons<HasilLaporan>>;
  // UC04 (hanya laporan milik warga sesi)
  daftarMilikWarga(): Promise<ApiRespons<RingkasanLaporan[]>>;
  detailMilikWarga(idLaporan: string): Promise<ApiRespons<DetailLaporan>>;
  riwayatMilikWarga(idLaporan: string): Promise<ApiRespons<RingkasanStatus[]>>; // timestamp ASC
  // UC07 (hanya tugas milik teknisi sesi)
  daftarPenugasan(): Promise<ApiRespons<RingkasanLaporan[]>>;
  detailTugas(idLaporan: string): Promise<ApiRespons<DetailLaporan>>;
  perbaruiStatus(idLaporan: string, statusBaru: StatusLaporan): Promise<ApiRespons<HasilStatus>>;
}