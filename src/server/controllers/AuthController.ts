"use server";
// AuthController: di luar DPPL (lihat docs/implementasi/perubahan-dppl.md). Pemilik: Fondasi (F).
// redirect() melempar error khusus, jadi dipanggil di luar try/catch dan setelah semua cek.
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { gagal, type ActionResult } from "@/lib/action-result";
import { BERANDA_ROLE } from "@/lib/constants";
import { nextAman } from "@/lib/navigasi";
import { validasiDaftar, validasiMasuk } from "@/lib/validasi-auth";

/** Isian yang dikembalikan saat gagal agar form tidak kosong. Password TIDAK pernah dikembalikan. */
export type NilaiForm = { nama?: string; email?: string };

/** State useActionState: null (awal) atau error + isian. Sukses selalu redirect. */
export type StateAuth = (ActionResult<never> & { nilai: NilaiForm }) | null;

const teks = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");

const PESAN_RATE_LIMIT = "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.";
const kenaRateLimit = (e: { status?: number; code?: string }) =>
  e.status === 429 || e.code === "over_request_rate_limit" || e.code === "over_email_send_rate_limit";

export async function masuk(_prev: StateAuth, formData: FormData): Promise<StateAuth> {
  const nilai = { email: teks(formData.get("email")) };
  const input = validasiMasuk({ ...nilai, password: teks(formData.get("password")) });
  if (!input.ok) return { ...input, nilai };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(input.data);
  if (error) {
    const pesan = kenaRateLimit(error) ? PESAN_RATE_LIMIT : "Email atau kata sandi salah.";
    return { ...gagal(pesan), nilai };
  }

  const { data: profil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  // Profil hilang seharusnya tidak terjadi (dibuat trigger); /status aman tanpa role.
  const beranda = profil ? BERANDA_ROLE[profil.role] : "/status";
  redirect(nextAman(teks(formData.get("next"))) ?? beranda);
}

export async function daftar(_prev: StateAuth, formData: FormData): Promise<StateAuth> {
  const nilai = { nama: teks(formData.get("nama")), email: teks(formData.get("email")) };
  const input = validasiDaftar({ ...nilai, password: teks(formData.get("password")) });
  if (!input.ok) return { ...input, nilai };

  const { nama, email, password } = input.data;
  const supabase = await createClient();
  // Hanya `nama` di metadata. Role SELALU 'warga' dari default kolom (handle_new_user).
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { nama } } });

  if (error && kenaRateLimit(error)) return { ...gagal(PESAN_RATE_LIMIT), nilai };
  // identities kosong = email sudah terdaftar saat Confirm email aktif (Supabase menyamarkan error).
  if (error?.code === "user_already_exists" || data.user?.identities?.length === 0)
    return { ...gagal("Email sudah terdaftar."), nilai };
  if (error) return { ...gagal("Pendaftaran gagal. Coba lagi beberapa saat lagi."), nilai };

  redirect(nextAman(teks(formData.get("next"))) ?? BERANDA_ROLE.warga);
}

export async function keluar(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
