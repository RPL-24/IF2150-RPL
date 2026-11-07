// C02 · Laporan (kelas entity DPPL). Pemilik: Peran F.
// Nama fungsi mengikuti nama operasi di DPPL.
import { createClient } from "@/lib/supabase/server";
import { TugasLaporan } from "./ListTugas";
export {};

// UC03
export async function getTugasAktif(): Promise<TugasLaporan[] | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
    .from("laporan")
    .select("id, id_tiket, kategori, deskripsi, latitude, longitude, jumlah_upvote, skor_prioritas, waktu_masuk")
    .eq("status", "dikerjakan")
    .eq("tahap", "menunggu_eksekusi");
    
    if (error) return null;
    return data;
}