// contracts/akun.ts -- UC12, UC13, UC14. Pemilik modul: Faiz. Pemilik kontrak: Raffi.
import type { ApiRespons, Peran, StatusAkun, WaktuISO } from "./common";

export interface FormRegistrasi {
  nama: string;
  email: string;
  password: string; // min. 8 karakter (Algo-031); tidak pernah dikembalikan
  peran: Peran;
}

export interface HasilRegistrasi {
  email: string;
  status: StatusAkun; // selalu "MENUNGGU" setelah registrasi
}

export interface FormLogin {
  email: string;
  password: string;
}

export interface HasilLogin {
  dashboardTujuan: string; // "/dashboard/warga" | "/dashboard/teknisi" | "/dashboard/pengurus"
  peran: Peran;
}

// Ringkasan akun untuk daftar persetujuan (I-16). TIDAK memuat password.
export interface AkunRingkas {
  email: string;
  nama: string;
  peranDiajukan: Peran;
  status: StatusAkun;
  waktuPengajuan: WaktuISO;
}

// Kontrak layanan yang boleh dipanggil modul lain (mis. laporan memeriksa keanggotaan).
export interface AkunService {
  daftarkan(f: FormRegistrasi): Promise<ApiRespons<HasilRegistrasi>>;
  login(f: FormLogin): Promise<ApiRespons<HasilLogin>>;
  daftarMenunggu(): Promise<ApiRespons<AkunRingkas[]>>; // hanya Pengurus
  setujui(email: string): Promise<ApiRespons<AkunRingkas>>; // hanya Pengurus
  tolak(email: string): Promise<ApiRespons<AkunRingkas>>; // hanya Pengurus
  // Dipakai UC03: keanggotaan terkini dibaca dari DB, bukan cache sesi lama.
  validasiKeanggotaan(idWarga: number, idKomunitas: string): Promise<boolean>;
}