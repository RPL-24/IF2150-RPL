"use server";
// C23 · NotifikasiController (kelas controller DPPL). Pemilik: Peran F.
// Pola tiap action: verifikasiAkses() -> validasi input -> panggil entity -> return ActionResult<T>.
//
// PENGIRIMAN notifikasi (DPPL kirimNotifikasi / kirimNotifikasiSelesai / susunPesanNotifikasi) TIDAK ada
// di sini: notifikasi dibuat trigger DB catat_perubahan_status (ke pelapor) dan terapkan_evaluasi
// (ke eksekutor) dalam transaksi yang sama dengan perubahan status. Siaran real-time = Supabase Realtime
// postgres_changes pada tabel notifikasi (lihat useNotifikasi). Controller lain JANGAN membuat notifikasi.

import { gagal, ok, type ActionResult } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { pesanErrorDb } from "@/lib/error-db";
import { createClient } from "@/lib/supabase/server";
import { getMilikSaya, jumlahBelumDibaca, tandaiDibaca } from "@/server/entities/Notifikasi";
import type { Tables } from "@/types/database";

export type ItemNotifikasi = Pick<
  Tables<"notifikasi">,
  "id_notifikasi" | "id_laporan" | "isi_pesan" | "waktu_kirim" | "status_baca"
> & { id_tiket: string | null };

const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Semua peran yang login boleh membaca notifikasinya sendiri (RLS membatasi ke milik sendiri). */
async function verifikasiAkses() {
  return requireRole("warga", "admin", "eksekutor");
}

/** Di luar DPPL: 20 notifikasi terbaru + jumlah belum dibaca (I02-02). */
export async function ambilNotifikasi(): Promise<ActionResult<{ daftar: ItemNotifikasi[]; belumDibaca: number }>> {
  const akses = await verifikasiAkses();
  if (!akses.ok) return akses;

  const supabase = await createClient();
  const [daftar, jumlah] = await Promise.all([
    getMilikSaya(supabase, akses.data.id),
    jumlahBelumDibaca(supabase, akses.data.id),
  ]);
  const error = daftar.error ?? jumlah.error;
  if (error) return gagal(pesanErrorDb(error));

  return ok({
    daftar: (daftar.data ?? []).map(({ laporan, ...n }) => ({ ...n, id_tiket: laporan?.id_tiket ?? null })),
    belumDibaca: jumlah.data,
  });
}

/** C23 updateStatusBaca (Algo-056). */
export async function updateStatusBaca(idNotifikasi: string): Promise<ActionResult<null>> {
  const akses = await verifikasiAkses();
  if (!akses.ok) return akses;
  if (typeof idNotifikasi !== "string" || !POLA_UUID.test(idNotifikasi)) return gagal("Notifikasi tidak ditemukan.");

  const supabase = await createClient();
  const { data: berubah, error } = await tandaiDibaca(supabase, idNotifikasi);
  if (error) return gagal(pesanErrorDb(error));
  if (!berubah) return gagal("Notifikasi tidak ditemukan.");
  return ok(null);
}
