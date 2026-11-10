"use server";
// C19 · PenugasanController (kelas controller DPPL). Pemilik: Peran C.
// Pola tiap action: verifikasiAkses() -> validasi input -> panggil entity -> return ActionResult<T>.

import { gagal, ok, type ActionResult } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getByStatus, getRincian } from "@/server/entities/Laporan";
import { isKategori, isTugasAktif, ListTugas, type EvaluasiTerakhir, type RincianTugas, type TugasLaporan } from "@/server/entities/ListTugas";

const PESAN_TANPA_AKSES = "Anda tidak memiliki akses ke daftar tugas Eksekutor Lapangan.";
const PESAN_GAGAL_LOAD = "Gagal memuat daftar tugas. Coba muat ulang halaman!";
const PESAN_KATEGORI_TAK_DIKENAL = "Kategori tidak dikenal. Pilih kategori dari daftar.";
const PESAN_TUGAS_TAK_ADA = "Tugas tidak ditemukan atau sudah tidak aktif. Muat ulang daftar tugas.";
const PESAN_GAGAL_RINCIAN = "Gagal memuat rincian tugas. Coba lagi!";

// Algo-044:
export async function verifikasiAkses(): Promise<boolean> {
    const hasil = await requireRole("eksekutor");
    return hasil.ok;
}

// Algo-045
export async function doSorting(): Promise<ActionResult<TugasLaporan[]>> {
    if (!(await verifikasiAkses())) return gagal(PESAN_TANPA_AKSES);

    try {
        const supabase = await createClient();

        const { data, error } = await getByStatus(supabase, "dikerjakan", "menunggu_eksekusi");
        if (error || !data) return gagal(PESAN_GAGAL_LOAD);
        return ok(new ListTugas(data).urutPrioritas());
    } catch {
        return gagal(PESAN_GAGAL_LOAD);
    }
}

//DPPL 5.19 UC03 Alt 1
export async function doFilter(kategori: string): Promise<ActionResult<TugasLaporan[]>> {
    if (!(await verifikasiAkses())) return gagal(PESAN_TANPA_AKSES);
    if (!isKategori(kategori)) return gagal(PESAN_KATEGORI_TAK_DIKENAL);

    try {
        const listTugas = await loadListTugas();
        if (!listTugas) return gagal(PESAN_GAGAL_LOAD);
        return ok(listTugas.filterKategori(kategori));
    } catch {
        return gagal(PESAN_GAGAL_LOAD);
    }
}


async function loadListTugas(): Promise<ListTugas | null> {
    const supabase = await createClient();
    const { data, error } = await getByStatus(supabase, "dikerjakan", "menunggu_eksekusi");

    if (error || !data) return null;
    return new ListTugas(data);
}

export async function bukaLaporan(idTiket: string): Promise<ActionResult<RincianTugas>> {
    if (!(await verifikasiAkses())) return gagal(PESAN_TANPA_AKSES);

    try {
        const supabase = await createClient();
        const { data, error } = await getRincian(supabase, idTiket);

        if (error) return gagal(PESAN_GAGAL_RINCIAN);
        if (!data || !isTugasAktif(data)) return gagal(PESAN_TUGAS_TAK_ADA);

        // DITAHAN: evaluasi menunggu ... Peran B
        const evaluasiTerakhir: EvaluasiTerakhir | null = null;

        return ok({
            id: data.id,
            id_tiket: data.id_tiket,
            kategori: data.kategori,
            deskripsi: data.deskripsi,
            latitude: data.latitude,
            longitude: data.longitude,
            jumlah_upvote: data.jumlah_upvote,
            skor_prioritas: data.skor_prioritas,
            waktu_masuk: data.waktu_masuk,
            status: data.status,
            tahap: data.tahap,
            foto: data.foto,
            video: data.video,
            evaluasiTerakhir,
        });
    } catch {
        return gagal(PESAN_GAGAL_RINCIAN);
    }
}