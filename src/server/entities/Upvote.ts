// C06 · Upvote (kelas entity DPPL). Pemilik: Peran F.
// Nama fungsi mengikuti nama operasi di DPPL.
// Counter jumlah_upvote + skor_prioritas diurus trigger tambah_upvote (C02 tambahUpvote/hitungPrioritas).
// Aturan dukung (warga, bukan pelapor, laporan aktif, satu per akun) dijaga RLS + unique.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/** C06 catatUpvote (Algo-011). Dukungan ganda → error 23505, ditolak RLS → 42501 (pakai pesanErrorDb). */
export async function catatUpvote(supabase: SupabaseClient<Database>, idLaporan: string, idUser: string) {
  return supabase.from("upvote").insert({ id_laporan: idLaporan, id_user: idUser });
}

/**
 * C06 getJumlahUpvote. Dibaca dari kolom jumlah_upvote (view publik), bukan COUNT(*) tabel upvote:
 * RLS upvote hanya memperlihatkan dukungan milik sendiri. `data` null bila laporan tidak publik.
 */
export async function getJumlahUpvote(supabase: SupabaseClient<Database>, idLaporan: string) {
  const { data, error } = await supabase
    .from("laporan_publik")
    .select("jumlah_upvote")
    .eq("id", idLaporan)
    .maybeSingle();
  return { data: data?.jumlah_upvote ?? null, error };
}

/** Di luar DPPL: apakah user sudah mendukung laporan ini (untuk menonaktifkan tombol "Dukung", I02-14). */
export async function sudahUpvote(supabase: SupabaseClient<Database>, idLaporan: string, idUser: string) {
  const { count, error } = await supabase
    .from("upvote")
    .select("id_upvote", { count: "exact", head: true })
    .eq("id_laporan", idLaporan)
    .eq("id_user", idUser);
  return { data: (count ?? 0) > 0, error };
}
