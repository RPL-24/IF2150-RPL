// contracts/iuran.ts -- UC02, UC09, UC10, UC11. Pemilik modul DAN kontrak: Raffi.
import type { ApiRespons, StatusTagihan } from "./common";

export interface PeriodeDTO {
  idPeriode: string;
  bulan: number; // 1-12
  tahun: number;
  statusFinal: boolean;
}

export interface DataPemakaianDTO {
  idPemakaian: string;
  idWarga: number;
  idPeriode: string;
  volumeAirM3: number | null;
  energiKWh: number | null;
  waktuCatat: string | null;
}

export interface AturanTarifDTO {
  idAturan: string;
  idPeriode: string;
  tarifAirPerM3: number;
  tarifEnergiPerKWh: number;
  biayaTetap: number;
}

// Total = biayaTetap + volume * tarifAir + energi * tarifEnergi (Algo-013)
export interface TagihanDTO {
  idTagihan: string;
  idWarga: number;
  idPeriode: string;
  jumlahIuran: number;
  status: StatusTagihan;
  rincian: {
    volumeAirM3: number;
    energiKWh: number;
    biayaTetap: number;
    subtotalAir: number;
    subtotalEnergi: number;
  };
}

// ---- UC09 ----
export interface TitikPemakaianPekan {
  label: string; // "M1".."M4"
  airM3: number;
  energiKWh: number;
}

export interface RingkasanPemakaian {
  periode: PeriodeDTO;
  totalAirM3: number;
  totalEnergiKWh: number;
  rincianPekanan: TitikPemakaianPekan[];
}

// ---- UC10 ----
export interface PratinjauIuran {
  periode: PeriodeDTO;
  tarif: AturanTarifDTO; // satu tarif per periode untuk seluruh warga
  tagihan: TagihanDTO[]; // status DRAFT
  totalIuran: number;
}

// ---- UC11 ----
export type FormatEkspor = "PDF" | "CSV";

export interface BarisRekap {
  idWarga: number;
  namaWarga: string;
  volumeAirM3: number;
  energiKWh: number;
  jumlahIuran: number;
}

export interface RekapitulasiDTO {
  idRekap: string;
  idPeriode: string;
  totalPemakaianAir: number;
  totalPemakaianEnergi: number;
  totalIuran: number;
  baris: BarisRekap[];
}

export interface IuranService {
  // UC02: null-kan jika periode atau tagihan belum FINAL (Algo-050)
  lihatTagihanFinal(idPeriode: string): Promise<ApiRespons<TagihanDTO>>;
  daftarPeriode(): Promise<ApiRespons<PeriodeDTO[]>>;
  // UC09 (hanya Pengurus)
  analisisPemakaian(idPeriode: string): Promise<ApiRespons<RingkasanPemakaian>>;
  // UC10 (hanya Pengurus)
  hitungPratinjau(idPeriode: string): Promise<ApiRespons<PratinjauIuran>>;
  tetapkanFinal(idPeriode: string): Promise<ApiRespons<PeriodeDTO>>;
  // UC11 (hanya Pengurus, hanya periode FINAL)
  buatRekapitulasi(idPeriode: string): Promise<ApiRespons<RekapitulasiDTO>>;
  ekspor(idPeriode: string, format: FormatEkspor): Promise<ApiRespons<{ namaBerkas: string; url: string }>>;
}