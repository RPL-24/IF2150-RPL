"use server";
// C19 · PenugasanController (kelas controller DPPL). Pemilik: Peran C.
// Pola tiap action: verifikasiAkses() -> validasi input -> panggil entity -> return ActionResult<T>.

import { gagal, ok, type ActionResult } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getByStatus } from "@/server/entities/Laporan";
import { isKategori, ListTugas, type TugasLaporan } from "@/server/entities/ListTugas";

const PESAN_TANPA_AKSES = "Anda tidak memiliki akses ke daftar tugas Eksekutor Lapangan.";
const PESAN_GAGAL_LOAD = "Gagal memuat daftar tugas. Coba muat ulang halaman!";
const PESAN_KATEGORI_TAK_DIKENAL = "Kategori tidak dikenal. Pilih kategori dari daftar.";

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