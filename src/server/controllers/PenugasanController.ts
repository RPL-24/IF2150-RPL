"use server";
// C19 · PenugasanController (kelas controller DPPL). Pemilik: Peran C.
// Pola tiap action: verifikasiAkses() -> validasi input -> panggil entity -> return ActionResult<T>.

import { gagal, ok, type ActionResult } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getByStatus } from "@/server/entities/Laporan";
import { ListTugas, type TugasLaporan } from "@/server/entities/ListTugas";

const PESAN_TANPA_AKSES = "Anda tidak memiliki akses ke daftar tugas Eksekutor Lapangan.";
const PESAN_GAGAL_LOAD = "Gagal memuat daftar tugas. Coba muat ulang halaman!";

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