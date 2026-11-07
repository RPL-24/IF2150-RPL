// C02 · Laporan (kelas entity DPPL). Pemilik: Peran F.
// Nama fungsi mengikuti nama operasi di DPPL.
// Operasi DB menerima Supabase client sebagai parameter (file ini tidak mengimpor lib/supabase/*).

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Enums } from "@/types/database";
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