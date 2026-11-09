"use server";
// C22 · StatusController (kelas controller DPPL). Pemilik: Peran D.
// Pola tiap action: verifikasiAkses() -> validasi input -> panggil entity -> return ActionResult<T>.

import { gagal, ok, type ActionResult } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { pesanErrorDb } from "@/lib/error-db";
import { createClient } from "@/lib/supabase/server";
import { getDaftarPublik, getMilikSaya, getRincian } from "@/server/entities/Laporan";
import type { Tables } from "@/types/database";

export type ItemRiwayat = Pick<Tables<"laporan">, "id" | "id_tiket" | "kategori" | "status" | "tahap" | "waktu_masuk">;

// Entity menyaring kolom wajib view publik yang nullable pada generated types.
export type ItemPeta = {
  [K in "id" | "id_tiket" | "latitude" | "longitude" | "status"]: NonNullable<Tables<"laporan_publik">[K]>;
};

/** Kontrak bukti KF19 untuk penyambungan HasilPerbaikan.getBuktiLengkap() milik Peran C. */
export type BuktiHasilPerbaikan = Pick<Tables<"hasil_perbaikan">, "id_hasil" | "catatan" | "waktu_unggah"> & {
  foto: Pick<Tables<"foto">, "path">[];
};

export type DetailStatus = Pick<
  Tables<"laporan">,
  "id_tiket" | "kategori" | "deskripsi" | "waktu_masuk" | "status" | "tahap" | "alasan_penolakan"
> & {
  foto: Pick<Tables<"foto">, "path">[];
  video: Pick<Tables<"video">, "path">[];
  riwayat: Pick<Tables<"riwayat_status">, "status" | "tahap" | "catatan" | "waktu">[];
  /** undefined = pembacaan bukti belum tersambung; null = sudah dibaca tetapi tidak ditemukan. */
  hasilPerbaikan?: BuktiHasilPerbaikan | null;
};

async function verifikasiAkses() {
  return requireRole("warga");
}

/** C22 Algo-051: riwayat akun warga yang terverifikasi, terbaru terlebih dahulu. */
export async function ambilRiwayatWarga(): Promise<ActionResult<ItemRiwayat[]>> {
  try {
    const akses = await verifikasiAkses();
    if (!akses.ok) return akses;

    const supabase = await createClient();
    const { data, error } = await getMilikSaya(supabase, akses.data.id);
    if (error) return gagal(pesanErrorDb(error));

    return ok((data ?? []).map(({ id, id_tiket, kategori, status, tahap, waktu_masuk }) => ({
      id, id_tiket, kategori, status, tahap, waktu_masuk,
    })));
  } catch {
    return gagal("Gagal memuat riwayat laporan. Coba lagi beberapa saat lagi.");
  }
}

/** C22 ambilDetailStatus (Q-004): rincian tiket pribadi, dibatasi role warga dan RLS laporan. */
export async function ambilDetailStatus(idTiket: string): Promise<ActionResult<DetailStatus>> {
  try {
    const akses = await verifikasiAkses();
    if (!akses.ok) return akses;

    // format_tiket() di migration mendukung nomor di atas 9999 hingga batas bigint.
    if (typeof idTiket !== "string" || !/^LK-\d{4,19}$/.test(idTiket)) {
      return gagal("Format ID tiket tidak valid.");
    }

    const supabase = await createClient();
    const { data, error } = await getRincian(supabase, idTiket);
    if (error) return gagal(pesanErrorDb(error));
    // RLS mengembalikan null juga saat tiket milik warga lain; jangan membocorkan keberadaannya.
    if (!data) return gagal("Tiket tidak ditemukan atau tidak dapat diakses.");

    const { id_tiket, kategori, deskripsi, waktu_masuk, status, tahap, alasan_penolakan, foto, video, riwayat } = data;
    return ok({
      id_tiket, kategori, deskripsi, waktu_masuk, status, tahap,
      alasan_penolakan: status === "ditolak" ? alasan_penolakan?.trim() || null : null,
      foto: foto ?? [],
      video: video ?? [],
      riwayat: riwayat ?? [],
      // KF19 belum tersambung: getBuktiLengkap() belum ada pada entity milik C.
      // Setelah tersedia, isi hasilPerbaikan hanya untuk status "berhasil" dengan bukti
      // yang sesuai evaluasi selesai. Foto laporan awal tidak boleh dijadikan foto hasil.
    });
  } catch {
    return gagal("Gagal memuat detail tiket. Coba lagi beberapa saat lagi.");
  }
}

/** C22 Algo-052: peta anonim boleh diakses tanpa login, hanya melalui laporan_publik. */
export async function ambilLaporanPublik(): Promise<ActionResult<ItemPeta[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await getDaftarPublik(supabase);
    if (error) return gagal(pesanErrorDb(error));

    return ok((data ?? []).map(({ id, id_tiket, latitude, longitude, status }) => ({
      id, id_tiket, latitude, longitude, status,
    })));
  } catch {
    return gagal("Gagal memuat laporan publik. Coba lagi beberapa saat lagi.");
  }
}
