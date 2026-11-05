// contracts/common.ts
// Tipe bersama lintas modul. FILE FASE 0: BEKU setelah Kam 5 Nov 18.00 WIB.
// Mau ubah? Buat Issue, pemilik (Raffi) yang membuat PR.
// Sumber: DPPL BAB 4-5 (registri tipe M7).

// ---- Enumerasi (C06, C18, C21) ----
export type Peran = "WARGA" | "TEKNISI" | "PENGURUS";

export type StatusAkun = "MENUNGGU" | "DISETUJUI" | "DITOLAK"; // C06
export type StatusTagihan = "DRAFT" | "FINAL"; // C18
export type StatusLaporan = "MENUNGGU" | "SEDANG_DIPERBAIKI" | "SELESAI"; // C21

// ---- Konteks sesi (berasal dari SERVER, bukan dari form/request) ----
export interface KonteksSesi {
  idWarga: number | null; // hanya terisi untuk peran WARGA
  idTeknisi: string | null; // hanya terisi untuk peran TEKNISI
  idPengurus: string | null; // hanya terisi untuk peran PENGURUS
  idKomunitas: string;
  peran: Peran;
  statusAkun: StatusAkun;
}

// ---- Bentuk respons API (lihat API-KONVENSI.md) ----
export type KodeGalat =
  | "VALIDASI_GAGAL" // 400
  | "TIDAK_TERAUTENTIKASI" // 401
  | "TIDAK_BERWENANG" // 403
  | "TIDAK_DITEMUKAN" // 404 (juga untuk ID milik pihak lain)
  | "KONFLIK" // 409
  | "DATA_BELUM_LENGKAP" // 422
  | "GAGAL_SIMPAN" // 500
  | "GAGAL_INTERNAL"; // 500

export interface GalatKolom {
  kolom: string;
  pesan: string;
}

export interface ApiSukses<T> {
  ok: true;
  data: T;
}

export interface ApiGalat {
  ok: false;
  kode: KodeGalat;
  pesan: string; // aman ditampilkan; tanpa SQL, kata sandi, atau data pengguna lain
  galat?: GalatKolom[]; // untuk galat per kolom formulir
}

export type ApiRespons<T> = ApiSukses<T> | ApiGalat;

// ---- Hasil validasi (Validasi.periksaLaporan / periksaPemeliharaan) ----
export interface HasilValidasi {
  valid: boolean;
  galat: GalatKolom[];
}

// Waktu selalu string ISO 8601 dengan zona waktu (mis. "2026-10-28T08:10:00+07:00").
export type WaktuISO = string;