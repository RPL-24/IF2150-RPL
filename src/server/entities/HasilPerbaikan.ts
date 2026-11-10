// C08 · HasilPerbaikan (kelas entity DPPL). Pemilik: Peran C.
// Nama fungsi mengikuti nama operasi di DPPL.

import type { SupabaseClient } from "@supabase/supabase-js";
import { isFotoValid, type Berkas, type MediaTerunggah } from "./Foto";
import { isVideoValid } from "./Video";
import type { Database } from "@/types/database";

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