// contracts/monitoring.ts -- UC01, UC05, UC06. Pemilik modul: Andro. Pemilik kontrak: Raffi.
import type { ApiRespons, WaktuISO } from "./common";

export type KondisiAir = "Normal" | "Rendah" | "Kritis"; // TangkiAir.statusAir (Algo-009)

export interface StatusTangki {
  volumeLiter: number | null;
  kapasitasLiter: number | null;
  persen: number | null;
  kondisi: KondisiAir | null;
  waktuPembacaan: WaktuISO | null;
}

export interface StatusBaterai {
  kapasitasPersen: number | null;
  kritis: boolean | null; // Baterai.cekKapasitas (Algo-010)
  waktuPembacaan: WaktuISO | null;
}

export interface StatusPanel {
  dayaWatt: number | null; // daya sesaat (W), BUKAN energi kumulatif (kWh)
  waktuPembacaan: WaktuISO | null;
}

// null berarti "belum ada pembacaan", bukan nol (lihat I-03).
export interface StatusInfrastruktur {
  tangki: StatusTangki;
  baterai: StatusBaterai;
  panel: StatusPanel;
  dataUsang: boolean; // true bila data terbaru belum tersedia (UC01 Alt 1)
}

// ---- Telemetri dari perangkat IoT (TelemetriAPI, Algo-023) ----
export interface MasukanTelemetri {
  idPerangkat: string;
  nilai: number;
  satuan: string;
  waktu: WaktuISO;
}

export interface ResponTelemetri {
  diterima: boolean;
}

// ---- Riwayat panel (UC06) ----
export interface RentangWaktu {
  waktuMulai: WaktuISO;
  waktuSelesai: WaktuISO; // validasi: waktuMulai <= waktuSelesai (Algo-011)
}

export interface TitikKinerja {
  waktu: WaktuISO;
  dayaDihasilkan: number; // W
  energi: number; // kWh
}

// ---- Peringatan daya kritis (UC05) ----
export type StatusPengiriman = "TERKIRIM" | "PENDING";

export interface PeringatanDayaKritisDTO {
  idNotifikasi: string;
  idPerangkat: string;
  pesan: string;
  level: "KRITIS";
  kapasitasSaatIni: number;
  waktu: WaktuISO;
  statusPengiriman: StatusPengiriman;
  statusBaca: boolean;
}

export interface MonitoringService {
  ambilStatusInfrastruktur(): Promise<ApiRespons<StatusInfrastruktur>>;
  terimaTelemetri(m: MasukanTelemetri): Promise<ApiRespons<ResponTelemetri>>;
  ambilRiwayatPanel(r: RentangWaktu): Promise<ApiRespons<TitikKinerja[]>>;
  daftarPeringatanTeknisi(): Promise<ApiRespons<PeringatanDayaKritisDTO[]>>;
}