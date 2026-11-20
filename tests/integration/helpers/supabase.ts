// Helper client Supabase untuk uji integrasi. Uji integrasi menembak database PRODUCTION:
// baca aturan di src/README.md bagian "Pengujian" sebelum menulis tes baru.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Koordinat } from "@/server/entities/Lokasi";
import type { Database, Enums } from "@/types/database";

/** Awalan WAJIB untuk setiap teks data tes (mis. deskripsi laporan). Dipakai pengaman bersihkan() dan hitungSisa(). */
export const PENANDA = "[TEST-INT]";

/**
 * Titik lokasi WAJIB untuk semua laporan tes integrasi (Rancasari, tenggara Kota Bandung).
 * Alasan: (1) jauh dari laporan asli, supaya RPC cari_laporan_duplikat (radius 20 m) tidak pernah
 * mencocokkan laporan tes dengan laporan warga sungguhan, dan sebaliknya; (2) tidak muncul di tengah
 * peta publik (PUSAT_PETA) selama tes berjalan.
 * Dipilih 2026-11-18: di dalam BATAS_WILAYAH (±1,4 km dari tepi), ±4,6 km dari laporan seed terdekat
 * (scripts/seed.ts), ±9,9 km dari PUSAT_PETA.
 */
export const KOORDINAT_TES: Koordinat = { latitude: -6.955, longitude: 107.7 };

export type Peran = Enums<"peran_user">;

/** Variabel env yang wajib ada sebelum uji integrasi jalan (dicek di global-setup.ts). */
export const ENV_WAJIB = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SECRET_KEY",
  "TEST_INT_WARGA_EMAIL",
  "TEST_INT_ADMIN_EMAIL",
  "TEST_INT_EKSEKUTOR_EMAIL",
  "TEST_INT_PASSWORD",
] as const;

const ENV_EMAIL: Record<Peran, (typeof ENV_WAJIB)[number]> = {
  warga: "TEST_INT_WARGA_EMAIL",
  admin: "TEST_INT_ADMIN_EMAIL",
  eksekutor: "TEST_INT_EKSEKUTOR_EMAIL",
};

function env(nama: (typeof ENV_WAJIB)[number]): string {
  const nilai = process.env[nama];
  if (!nilai) throw new Error(`Env ${nama} kosong. Isi di .env.local (lihat .env.example).`);
  return nilai;
}

// Tanpa simpan sesi ke disk/localStorage: sesi cukup di memori selama tes.
const OPSI_AUTH = { auth: { persistSession: false, autoRefreshToken: false } };

/**
 * Client SERVICE ROLE (melewati RLS). HANYA untuk setup, membaca ulang hasil, dan bersih-bersih.
 * Aksi yang sedang diuji WAJIB memakai client peran dari loginSebagai(), supaya RLS ikut teruji.
 */
export function buatClientAdmin(): SupabaseClient<Database> {
  return createClient<Database>(env("NEXT_PUBLIC_SUPABASE_URL"), env("SUPABASE_SECRET_KEY"), OPSI_AUTH);
}

/**
 * Login sebagai akun tes untuk peran tertentu → client terautentikasi (publishable key + sesi user).
 * Gagal keras kalau role akun di tabel profiles tidak sama dengan peran yang diminta
 * (mencegah salah isi env, mis. email admin terisi akun warga).
 */
export async function loginSebagai(peran: Peran): Promise<{ client: SupabaseClient<Database>; idUser: string }> {
  const client = createClient<Database>(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    OPSI_AUTH,
  );
  const { data, error } = await client.auth.signInWithPassword({
    email: env(ENV_EMAIL[peran]),
    password: env("TEST_INT_PASSWORD"),
  });
  if (error) throw new Error(`Login akun tes ${peran} gagal: ${error.message}`);

  const idUser = data.user.id;
  const { data: profil, error: errProfil } = await client.from("profiles").select("role").eq("id", idUser).single();
  if (errProfil) throw new Error(`Gagal membaca profil akun tes ${peran}: ${errProfil.message}`);
  if (profil.role !== peran) {
    throw new Error(`Akun ${ENV_EMAIL[peran]} ber-role "${profil.role}", bukan "${peran}". Periksa .env.local.`);
  }
  return { client, idUser };
}
