"use server";
// C20 · PerbaikanController (kelas controller DPPL). Pemilik: Peran C.
// Pola tiap action: verifikasiAkses() -> validasi input -> panggil entity -> return ActionResult<T>.

import { gagal, ok, type ActionResult } from "@/lib/action-result"
import { requireRole } from "@/lib/auth";
import { pesanErrorDb } from "@/lib/error-db";
import { PESAN_BERKAS_TIDAK_VALID } from "@/lib/media";
import { createClient } from "@/lib/supabase/client";
import { cekMediaTerunggah, PESAN_TAK_LENGKAP, validasiForm } from "@/lib/validasi-perbaikan";
import type { MediaTerunggah } from "../entities/Foto";
import { simpanBukti, validasiBerkas } from "../entities/HasilPerbaikan";
import { getRincian } from "../entities/Laporan";
import { isTugasAktif } from "../entities/ListTugas";

const PESAN_TUGAS_TAK_AKTIF = "Tugas tidak ditemukan atau sudah tidak aktif. Loading ulang.."
const PESAN_GAGAL_KIRIM = "Gagal mengirim hasil perbaikan. Silakan periksa koneksi Anda lalu coba lagi";

// operasi verifikasiAkses
export async function verifikasiAkses():  Promise<boolean> {
    const hasil = await requireRole("eksekutor");
    return hasil.ok;
}

// Algo-047: unggahHasil
export async function unggahHasil(
    idTiket: string,
    catatan: string,
    foto: MediaTerunggah[],
    video: MediaTerunggah[],
): Promise<ActionResult<{ idTiket: string}>> {
    // Verifikasi Akses
    const akses = await requireRole("eksekutor");
    if (!akses.ok) return akses;

    // Validasi form
    if (typeof catatan !== "string" || !Array.isArray(foto) || !Array.isArray(video)) {
        return gagal(PESAN_TAK_LENGKAP);
    }
    if (!validasiForm(catatan, foto, video)) return gagal(PESAN_TAK_LENGKAP);
    
    const keBerkas = (m: MediaTerunggah) => ({ name: m.path, size: m.ukuran});
    if (!validasiBerkas(foto.map(keBerkas), video.map(keBerkas)) || !cekMediaTerunggah(foto, video, akses.data.id)) {
        return gagal(PESAN_BERKAS_TIDAK_VALID);
    }

    try {
        const supabase = await createClient();

        const { data: laporan, error: errorLaporan }= await getRincian(supabase, idTiket);

        if (errorLaporan) return gagal(pesanErrorDb(errorLaporan));
        if (!laporan || !isTugasAktif(laporan)) return gagal(PESAN_TUGAS_TAK_AKTIF);

        const { error } = await simpanBukti(supabase, {
            idLaporan: laporan.id,
            catatan: catatan.trim(),
            media: [...foto, ...video],
        });
        
        if (error) return gagal(pesanErrorDb(error));
        return ok({ idTiket: laporan.id_tiket });
    } catch {
        return gagal(PESAN_GAGAL_KIRIM);
    }
}