// contracts/pemeliharaan.ts -- UC08. Pemilik modul: Rafiandhi. Pemilik kontrak: Raffi.
import type { ApiRespons, WaktuISO } from "./common";

// idTeknisi TIDAK ada di form: dari KonteksSesi.
export interface FormPemeliharaan {
  idPerangkat: string; // wajib, harus perangkat terdaftar
  waktuPelaksanaan: WaktuISO; // wajib
  tindakan: string; // wajib
  catatanHasil: string; // wajib (I-12)
}

export interface HasilPemeliharaan {
  idCatatan: string;
}

export interface CatatanPemeliharaanDTO {
  idCatatan: string;
  idPerangkat: string;
  idTeknisi: string;
  waktuPelaksanaan: WaktuISO;
  tindakan: string;
  catatanHasil: string;
}

export interface PemeliharaanService {
  simpanCatatan(f: FormPemeliharaan): Promise<ApiRespons<HasilPemeliharaan>>;
  riwayatPerangkat(idPerangkat: string): Promise<ApiRespons<CatatanPemeliharaanDTO[]>>;
}