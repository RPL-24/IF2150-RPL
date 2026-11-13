// Fungsi murni (tanpa Supabase): validasi form masuk/daftar, dipakai AuthController.
import { gagal, ok, type ActionResult } from "@/lib/action-result";

export type DataMasuk = { email: string; password: string };
export type DataDaftar = DataMasuk & { nama: string };

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD = 8;
export const MAX_NAMA = 100;

export function validasiMasuk(input: DataMasuk): ActionResult<DataMasuk> {
  const email = input.email.trim().toLowerCase();
  if (!email) return gagal("Email wajib diisi.");
  if (!POLA_EMAIL.test(email)) return gagal("Format email tidak valid.");
  if (input.password.length < MIN_PASSWORD)
    return gagal(`Kata sandi minimal ${MIN_PASSWORD} karakter.`);
  return ok({ email, password: input.password });
}

export function validasiDaftar(input: DataDaftar): ActionResult<DataDaftar> {
  const nama = input.nama.trim();
  if (!nama) return gagal("Nama wajib diisi.");
  if (nama.length > MAX_NAMA) return gagal(`Nama maksimal ${MAX_NAMA} karakter.`);
  const hasil = validasiMasuk(input);
  return hasil.ok ? ok({ ...hasil.data, nama }) : hasil;
}
