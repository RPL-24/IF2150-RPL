// C08 · HasilPerbaikan (kelas entity DPPL). Pemilik: Peran C.
// Nama fungsi mengikuti nama operasi di DPPL.

import type { SupabaseClient } from "@supabase/supabase-js";
import { isFotoValid, type Berkas, type MediaTerunggah } from "./Foto";
import { isVideoValid } from "./Video";
import type { Database, Enums, Tables } from "@/types/database";

// Algo-014
export function validasiBerkas(foto: readonly Berkas[], video: readonly Berkas[]): boolean {
    return foto.every((f) => isFotoValid(f)) && video.every((v) => isVideoValid(v));
}

export type DataHasilBaru = { idLaporan: string; catatan: string; media: MediaTerunggah[]};

// Algo-015: simpan hasil perbaikan
export async function simpanBukti (supabase: SupabaseClient<Database>, data: DataHasilBaru) {
    return supabase.rpc("kirim_hasil_perbaikan", {
        p_id_laporan: data.idLaporan,
        p_catatan: data.catatan,
        p_media: data.media,
    });
}

type Media = Pick<Tables<"foto">, "path">;

export type BuktiLengkap = Pick<Tables<"hasil_perbaikan">, "id_hasil" | "catatan" | "waktu_unggah"> & {
    foto: Media[];
    video: Media[];
};

export type BarisHasil = BuktiLengkap & { evaluasi: { keputusan: Enums<"keputusan_evaluasi">}[] };

// NEW: operasi pilihBuktiSelesai
// Memilih hasil perbaikan terakhir yang sudah dikonfirmasi admin
export function pilihBuktiSelesai(daftar: readonly BarisHasil[]): BuktiLengkap | null {
    const terpilih = [...daftar].sort((a,b) => Date.parse(b.waktu_unggah) - Date.parse(a.waktu_unggah)).find((hasil) => hasil.evaluasi.some((e) => e.keputusan === "selesai"));

    if (!terpilih) return null;

    const {id_hasil, catatan, waktu_unggah, foto, video } = terpilih;
    return {id_hasil, catatan, waktu_unggah, foto, video };
}

// operasi getBuktiLengkap
export async function getBuktiLengkap(supabase: SupabaseClient<Database>, idLaporan: string) {
    const { data, error } = await supabase.from("hasil_perbaikan").select(
        `id_hasil, catatan, waktu_unggah,
        foto!foto_id_hasil_fkey(path),
        video!video_id_hasil_fkey(path),
        evaluasi!evaluasi_id_hasil_fkey(keputusan)`,
    ).eq("id_laporan", idLaporan);

    if (error) return { data: null, error};
    return { data: pilihBuktiSelesai(data ?? []), error: null };
}