// C02 · Laporan (kelas entity DPPL). Pemilik: Peran F.
// Nama fungsi mengikuti nama operasi di DPPL.
// Operasi DB menerima Supabase client sebagai parameter (file ini tidak mengimpor lib/supabase/*).

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Enums, Tables } from "@/types/database";
import type { MediaTerunggah } from "./Foto";

export type DataLaporanBaru = {
  kategori: Enums<"kategori_kerusakan">;
  deskripsi: string;
  latitude: number;
  longitude: number;
  media: MediaTerunggah[];
};

/**
 * Algo-002 (Q-001..Q-004): simpan laporan + foto/video dalam satu transaksi lewat RPC `kirim_laporan`.
 * Riwayat status (Q-004) dan notifikasi diisi trigger DB.
 * Kalau satu media ditolak (RLS/CHECK), laporan ikut batal. Error RPC berbahasa Indonesia.
 */

export async function simpanLaporan(supabase: SupabaseClient<Database>, data: DataLaporanBaru) {
  const { data: baris, error } = await supabase
    .rpc("kirim_laporan", {
      p_kategori: data.kategori,
      p_deskripsi: data.deskripsi,
      p_latitude: data.latitude,
      p_longitude: data.longitude,
      p_media: data.media,
    })
    .single();
  return { data: baris, error };
}

// ── Operasi baca (UC02–UC06) ────────────────────────────────────────────────
// Kolom dipilih eksplisit. RLS tetap berlaku: baris yang tidak boleh dilihat tidak ikut kembali.

const KOLOM_RINGKAS =
  "id, id_tiket, kategori, deskripsi, latitude, longitude, status, tahap, jumlah_upvote, skor_prioritas, waktu_masuk";

/** Daftar tugas/antrean: laporan per status (dan tahap), terbaru dulu. Dipakai UC02, UC03, UC05. */
export async function getByStatus(
  supabase: SupabaseClient<Database>,
  status: Enums<"status_laporan">,
  tahap?: Enums<"tahap_penanganan">,
) {
  let query = supabase.from("laporan").select(KOLOM_RINGKAS).eq("status", status);
  if (tahap) query = query.eq("tahap", tahap);
  return query.order("waktu_masuk", { ascending: false });
}

/** C22 Q-001: riwayat laporan milik warga, terbaru dulu (I02-05). */
export async function getMilikSaya(supabase: SupabaseClient<Database>, idPelapor: string) {
  return supabase
    .from("laporan")
    .select("id, id_tiket, kategori, deskripsi, status, tahap, alasan_penolakan, waktu_masuk, waktu_selesai")
    .eq("id_pelapor", idPelapor)
    .order("waktu_masuk", { ascending: false });
}

/**
 * C02 getRincian: rincian lengkap untuk pelapor, admin, dan eksekutor (sesuai RLS), beserta foto/video
 * laporan dan linimasa riwayat status. `pelapor` null bila RLS profiles tidak mengizinkan (eksekutor).
 * `data` null bila tiket tidak ada atau tidak boleh dilihat.
 */
export async function getRincian(supabase: SupabaseClient<Database>, idTiket: string) {
  return supabase
    .from("laporan")
    .select(
      `${KOLOM_RINGKAS}, alasan_penolakan, waktu_selesai,
       pelapor:profiles!laporan_id_pelapor_fkey(nama),
       foto!foto_id_laporan_fkey(path),
       video!video_id_laporan_fkey(path),
       riwayat:riwayat_status!riwayat_status_id_laporan_fkey(status, tahap, catatan, waktu)`,
    )
    .eq("id_tiket", idTiket)
    .order("waktu", { referencedTable: "riwayat", ascending: true })
    .maybeSingle();
}

const KOLOM_PUBLIK =
  "id, id_tiket, kategori, deskripsi, latitude, longitude, status, tahap, jumlah_upvote, waktu_masuk, waktu_selesai";

/** C22 Q-002: semua laporan publik (≠ ditolak, tanpa identitas pelapor) untuk peta sebaran (I02-10). Boleh anon. */
export async function getDaftarPublik(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("laporan_publik").select(KOLOM_PUBLIK);
  return { data: data?.filter(lengkap) ?? null, error };
}

/** C02 getRincianPublik (Algo-003): satu laporan publik + foto/video, tanpa identitas pelapor (I02-13). Boleh anon. */
export async function getRincianPublik(supabase: SupabaseClient<Database>, idTiket: string) {
  const { data, error } = await supabase
    .from("laporan_publik")
    .select(`${KOLOM_PUBLIK}, foto!foto_id_laporan_fkey(path), video!video_id_laporan_fkey(path)`)
    .eq("id_tiket", idTiket)
    .maybeSingle();
  return { data: data && lengkap(data) ? data : null, error };
}

// Kolom view selalu nullable di tipe hasil generate; di DB kolom-kolom ini NOT NULL.
type Publik = Pick<Tables<"laporan_publik">, "id" | "id_tiket" | "kategori" | "latitude" | "longitude" | "status" | "waktu_masuk">;
type PublikLengkap = { [K in keyof Publik]: NonNullable<Publik[K]> };

function lengkap<T extends Publik>(baris: T): baris is T & PublikLengkap {
  return (
    baris.id !== null && baris.id_tiket !== null && baris.kategori !== null && baris.latitude !== null &&
    baris.longitude !== null && baris.status !== null && baris.waktu_masuk !== null
  );
}

// ── Fungsi murni (aman dipakai di client) ──────────────────────────────────

/** C07 urutPrioritas (Algo-012): skor prioritas tertinggi dulu; seri → waktu masuk paling lama dulu. Tidak mengubah input. */
export function urutPrioritas<T extends { skor_prioritas: number; waktu_masuk: string }>(daftar: readonly T[]): T[] {
  return [...daftar].sort(
    (a, b) => b.skor_prioritas - a.skor_prioritas || Date.parse(a.waktu_masuk) - Date.parse(b.waktu_masuk),
  );
}

/** C07 filterKategori (Algo-013). `null` = "Semua kategori" (I03-04, I05-02). */
export function filterKategori<T extends { kategori: Enums<"kategori_kerusakan"> }>(
  daftar: readonly T[],
  kategori: Enums<"kategori_kerusakan"> | null,
): T[] {
  return kategori ? daftar.filter((l) => l.kategori === kategori) : [...daftar];
}
