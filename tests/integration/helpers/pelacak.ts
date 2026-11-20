// Pelacak data tes: catat SETIAP baris/berkas yang dibuat tes, lalu hapus HANYA itu di afterAll.
//
// Pola pakai (lihat contoh.int.test.ts):
//   const pelacak = buatPelacak();
//   afterAll(() => pelacak.bersihkan());
//   ... const { data } = await simpanLaporan(warga, ...);
//   if (data) pelacak.catat("laporan", data.id);   // catat SEBELUM expect, supaya tetap dibersihkan walau assertion gagal

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { buatClientAdmin, PENANDA } from "./supabase";

/**
 * Tabel yang boleh dicatat + kolom primary key-nya, URUT anak dulu → induk terakhir (sesuai FK di migration).
 * evaluasi → hasil_perbaikan (tanpa cascade), jadi evaluasi dihapus sebelum hasil_perbaikan.
 * Catatan: menghapus laporan juga meng-cascade anak yang dibuat trigger (riwayat_status, notifikasi),
 * jadi baris trigger itu tidak wajib dicatat satu per satu.
 */
const URUTAN_HAPUS = [
  ["evaluasi", "id_evaluasi"],
  ["foto", "id"],
  ["video", "id"],
  ["upvote", "id_upvote"],
  ["notifikasi", "id_notifikasi"],
  ["riwayat_status", "id"],
  ["hasil_perbaikan", "id_hasil"],
  ["laporan", "id"],
] as const;

export type TabelTes = (typeof URUTAN_HAPUS)[number][0];

const BUCKET = "media";

export function buatPelacak() {
  const baris = new Map<TabelTes, Set<string>>();
  const berkas = new Set<string>();

  /** Catat ID baris yang dibuat tes di tabel tertentu. */
  function catat(tabel: TabelTes, id: string) {
    if (!baris.has(tabel)) baris.set(tabel, new Set());
    baris.get(tabel)!.add(id);
  }

  /** Catat path berkas di bucket `media` yang diunggah tes. */
  function catatBerkas(path: string) {
    berkas.add(path);
  }

  /** Hapus semua yang tercatat (anak dulu), lalu berkas Storage. Melempar error di akhir kalau ada yang gagal. */
  async function bersihkan() {
    const admin = buatClientAdmin();
    const galat: string[] = [];

    for (const [tabel, kolom] of URUTAN_HAPUS) {
      let ids = [...(baris.get(tabel) ?? [])];
      if (ids.length === 0) continue;
      if (tabel === "laporan") ids = await saringLaporanBerpenanda(admin, ids, galat);
      if (ids.length === 0) continue;

      // .in() pada kolom PK, jadi yang terhapus hanya ID yang dicatat.
      const { error } = await admin.from(tabel).delete().in(kolom, ids);
      if (error) galat.push(`hapus ${tabel}: ${error.message}`);
    }

    if (berkas.size > 0) {
      const { error } = await admin.storage.from(BUCKET).remove([...berkas]);
      if (error) galat.push(`hapus berkas Storage: ${error.message}`);
    }

    baris.clear();
    berkas.clear();
    if (galat.length > 0) throw new Error(`bersihkan() tidak tuntas:\n- ${galat.join("\n- ")}`);
  }

  return { catat, catatBerkas, bersihkan };
}

/** Pengaman: laporan hanya dihapus kalau deskripsinya diawali PENANDA. Selain itu ditolak + peringatan. */
async function saringLaporanBerpenanda(admin: SupabaseClient<Database>, ids: string[], galat: string[]) {
  const { data, error } = await admin.from("laporan").select("id, id_tiket, deskripsi").in("id", ids);
  if (error) {
    galat.push(`cek penanda laporan: ${error.message}`);
    return [];
  }
  const aman: string[] = [];
  for (const l of data) {
    if (l.deskripsi.startsWith(PENANDA)) aman.push(l.id);
    else console.warn(`⚠ bersihkan() MENOLAK menghapus ${l.id_tiket} (${l.id}): deskripsi tidak diawali ${PENANDA}.`);
  }
  return aman;
}

/** Jumlah baris laporan berpenanda yang masih ada di database. Harus 0 setelah semua tes selesai. */
export async function hitungSisa(): Promise<number> {
  const { count, error } = await buatClientAdmin()
    .from("laporan")
    .select("id", { count: "exact", head: true })
    .like("deskripsi", `${PENANDA}%`);
  if (error) throw new Error(`hitungSisa() gagal: ${error.message}`);
  return count ?? 0;
}
