// C10 · Notifikasi (kelas entity DPPL). Pemilik: Peran F.
// Nama fungsi mengikuti nama operasi di DPPL.
// createNotifikasi / createNotifikasiSelesai / buatPesan TIDAK ada di sini: notifikasi dibuat trigger DB
// (catat_perubahan_status, terapkan_evaluasi). User hanya boleh mengubah kolom status_baca (grant kolom).

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export const KOLOM_NOTIFIKASI = "id_notifikasi, id_laporan, isi_pesan, waktu_kirim, status_baca" as const;

/** Di luar DPPL: notifikasi milik user, terbaru dulu (I02-02). `laporan` null bila tiket tidak lagi terlihat (RLS). */
export async function getMilikSaya(supabase: SupabaseClient<Database>, idUser: string, limit = 20) {
  return supabase
    .from("notifikasi")
    .select(`${KOLOM_NOTIFIKASI}, laporan:laporan!notifikasi_id_laporan_fkey(id_tiket)`)
    .eq("id_user", idUser)
    .order("waktu_kirim", { ascending: false })
    .limit(limit);
}

/** Di luar DPPL: jumlah notifikasi belum dibaca (badge I02-02). */
export async function jumlahBelumDibaca(supabase: SupabaseClient<Database>, idUser: string) {
  const { count, error } = await supabase
    .from("notifikasi")
    .select("id_notifikasi", { count: "exact", head: true })
    .eq("id_user", idUser)
    .eq("status_baca", false);
  return { data: count ?? 0, error };
}

/** C10 tandaiDibaca (Algo-018). `data` false bila 0 baris berubah (bukan milik user / tidak ada). */
export async function tandaiDibaca(supabase: SupabaseClient<Database>, idNotifikasi: string) {
  const { data, error } = await supabase
    .from("notifikasi")
    .update({ status_baca: true })
    .eq("id_notifikasi", idNotifikasi)
    .select("id_notifikasi");
  return { data: (data?.length ?? 0) > 0, error };
}
