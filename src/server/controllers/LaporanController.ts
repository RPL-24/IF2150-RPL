"use server";
// C17 · LaporanController (kelas controller DPPL). Pemilik: Peran A.
// Pola tiap action: verifikasiAkses() -> validasi input -> panggil entity -> return ActionResult<T>.

import { gagal, ok, type ActionResult } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { PESAN_UMUM, pesanErrorDb } from "@/lib/error-db";
import { createClient } from "@/lib/supabase/server";
import { getRincianPublik, simpanLaporan, type DataLaporanBaru } from "@/server/entities/Laporan";
import { catatUpvote } from "@/server/entities/Upvote";
import { PESAN_ANTIBOT_GAGAL, validasiBerkas, validasiForm, validasiLokasi } from "./laporan-validasi";

const URL_SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Hasil kirimLaporan: laporan baru tersimpan, atau ditemukan laporan serupa (KF05). */
export type HasilKirim = { jenis: "terkirim"; idTiket: string } | { jenis: "duplikat"; idTiket: string };

/**
 * DPPL verifikasiAntiBot (Algo-038): tanyakan ke Cloudflare apakah token Turnstile sah.
 * Tidak diekspor (private di DPPL), jadi tidak bisa dipanggil langsung dari browser.
 */
async function verifikasiAntiBot(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || typeof token !== "string" || token === "") return false;
  try {
    const respons = await fetch(URL_SITEVERIFY, {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
    });
    if (!respons.ok) return false;
    const hasil: { success?: boolean } = await respons.json();
    return hasil.success === true;
  } catch {
    // Cloudflare tidak bisa dihubungi: anggap gagal supaya laporan tidak lolos tanpa verifikasi.
    return false;
  }
}

/** DPPL kirimLaporan (Algo-036). `data.media` adalah hasil unggahMedia(), `token` dari widget Turnstile. */
export async function kirimLaporan(data: DataLaporanBaru, token: string): Promise<ActionResult<HasilKirim>> {
  // 1. verifikasiAkses: hanya warga yang boleh melapor.
  const akses = await requireRole("warga");
  if (!akses.ok) return akses;

  // 2. verifikasiAntiBot (KNF04): tahan penyimpanan sampai token terbukti dari manusia (KF08).
  if (!(await verifikasiAntiBot(token))) return gagal(PESAN_ANTIBOT_GAGAL);

  // 3. Validasi ulang di server.
  const pesan =
    validasiForm(data.kategori, data.deskripsi) ??
    validasiLokasi(data.latitude, data.longitude) ??
    validasiBerkas(data.media, akses.data.id);
  if (pesan) return gagal(pesan);

  const supabase = await createClient();

  // 4. cekDuplikat (KF05): laporan aktif sekategori dalam radius 20 m.
  const { data: mirip, error: errorDuplikat } = await supabase.rpc("cari_laporan_duplikat", {
    p_kategori: data.kategori,
    p_lat: data.latitude,
    p_lng: data.longitude,
  });
  if (errorDuplikat) return gagal(pesanErrorDb(errorDuplikat));
  if (mirip && mirip.length > 0) return ok({ jenis: "duplikat", idTiket: mirip[0].id_tiket });

  // 5. simpanLaporan: ID tiket LK-xxxx diterbitkan DB; riwayat & notifikasi diisi trigger.
  const { data: baru, error } = await simpanLaporan(supabase, { ...data, deskripsi: data.deskripsi.trim() });
  if (error) return gagal(pesanErrorDb(error));
  if (!baru) return gagal(PESAN_UMUM);
  return ok({ jenis: "terkirim", idTiket: baru.id_tiket });
}

/** DPPL dukungLaporanDuplikat: warga mendukung laporan serupa alih-alih membuat laporan baru. */
export async function dukungLaporanDuplikat(idTiket: string): Promise<ActionResult<{ idTiket: string }>> {
  const akses = await requireRole("warga");
  if (!akses.ok) return akses;

  const supabase = await createClient();
  const { data: laporan, error } = await getRincianPublik(supabase, idTiket);
  if (error) return gagal(pesanErrorDb(error));
  if (!laporan) return gagal("Laporan tidak ditemukan.");

  // Counter upvote & skor prioritas diurus trigger. Dukungan ganda / laporan milik sendiri ditolak DB.
  const { error: errorUpvote } = await catatUpvote(supabase, laporan.id, akses.data.id);
  if (errorUpvote) return gagal(pesanErrorDb(errorUpvote));
  return ok({ idTiket });
}