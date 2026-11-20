"use server";
// C22 · StatusController (kelas controller DPPL). Pemilik: Peran D.
// Pola tiap action: verifikasiAkses() -> validasi input -> panggil entity -> return ActionResult<T>.

import { gagal, ok, type ActionResult } from "@/lib/action-result";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { pesanErrorDb } from "@/lib/error-db";
import { createClient } from "@/lib/supabase/server";
import { getDaftarPublik, getMilikSaya, getRincian, getRincianPublik } from "@/server/entities/Laporan";
import { catatUpvote, getJumlahUpvote, sudahUpvote } from "@/server/entities/Upvote";
import type { Tables } from "@/types/database";
import { getBuktiLengkap } from "../entities/HasilPerbaikan";

export type ItemRiwayat = Pick<Tables<"laporan">, "id" | "id_tiket" | "kategori" | "status" | "tahap" | "waktu_masuk">;

// Entity menyaring kolom wajib view publik yang nullable pada generated types.
export type ItemPeta = {
  [K in "id" | "id_tiket" | "kategori" | "latitude" | "longitude" | "status" | "jumlah_upvote"]: NonNullable<Tables<"laporan_publik">[K]>;
} & {
  /** null = status akun belum diketahui; tombol tidak boleh diaktifkan. */
  sudahDidukung: Awaited<ReturnType<typeof sudahUpvote>>["data"] | null;
};

// Tetap ActionResult; penanda ini mencegah insert ulang bila pembacaan counter gagal.
export type HasilUpvote = ActionResult<Tables<"laporan">["jumlah_upvote"]> & { dukunganTercatat?: boolean };

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

    const { id, id_tiket, kategori, deskripsi, waktu_masuk, status, tahap, alasan_penolakan, foto, video, riwayat } = data;

    let hasilPerbaikan: BuktiHasilPerbaikan | null | undefined;
    if (status === "berhasil") {
      const bukti = await getBuktiLengkap(supabase, id);
      hasilPerbaikan = bukti.error ? undefined : bukti.data;
    }
    
    
    return ok({
      id_tiket, kategori, deskripsi, waktu_masuk, status, tahap,
      alasan_penolakan: status === "ditolak" ? alasan_penolakan?.trim() || null : null,
      foto: foto ?? [],
      video: video ?? [],
      riwayat: riwayat ?? [],
      hasilPerbaikan,
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

    // Gangguan pembacaan sesi tidak menutup akses baca ke peta publik.
    const user = await getCurrentUser().catch(() => null);
    return ok(await Promise.all((data ?? []).map(async ({ id, id_tiket, kategori, latitude, longitude, status, jumlah_upvote }) => {
      let sudahDidukung: ItemPeta["sudahDidukung"] = null;
      if (user?.role === "warga") {
        try {
          const dukungan = await sudahUpvote(supabase, id, user.id);
          if (!dukungan.error) sudahDidukung = dukungan.data;
        } catch {
          // Peta tetap dapat dibaca; status yang belum diketahui tidak mengaktifkan tombol.
        }
      }
      return { id, id_tiket, kategori, latitude, longitude, status, jumlah_upvote: jumlah_upvote ?? 0, sudahDidukung };
    })));
  } catch {
    return gagal("Gagal memuat laporan publik. Coba lagi beberapa saat lagi.");
  }
}

/** C22 prosesUpvote (Algo-053): satu dukungan warga, counter dihitung oleh trigger DB. */
export async function prosesUpvote(idTiket: string): Promise<HasilUpvote> {
  let tersimpan = false;
  const gagalMemuatJumlah: HasilUpvote = {
    ...gagal("Dukungan sudah tersimpan, tetapi jumlah dukungan belum dapat diperbarui. Muat ulang halaman."),
    dukunganTercatat: true,
  };
  const dukunganGanda: HasilUpvote = { ...gagal("Anda sudah mendukung laporan ini."), dukunganTercatat: true };

  try {
    const akses = await verifikasiAkses();
    if (!akses.ok) return akses;
    if (typeof idTiket !== "string" || !/^LK-\d{4,19}$/.test(idTiket)) {
      return gagal("Format ID tiket tidak valid.");
    }

    const supabase = await createClient();
    const laporan = await getRincianPublik(supabase, idTiket);
    if (laporan.error) return gagal(pesanErrorDb(laporan.error));
    if (!laporan.data) return gagal("Tiket tidak ditemukan atau tidak dapat didukung.");
    if (laporan.data.status !== "diterima" && laporan.data.status !== "dikerjakan") {
      return gagal("Laporan ini sudah selesai atau tidak lagi menerima dukungan.");
    }
    const idLaporan = laporan.data.id;

    // View publik tetap anonim; kepemilikan diperiksa melalui daftar pribadi di server.
    const milikSaya = await getMilikSaya(supabase, akses.data.id);
    if (milikSaya.error) return gagal(pesanErrorDb(milikSaya.error));
    if (milikSaya.data?.some(({ id }) => id === idLaporan)) {
      return gagal("Anda tidak dapat mendukung laporan sendiri.");
    }
    const dukungan = await sudahUpvote(supabase, idLaporan, akses.data.id);
    if (dukungan.error) return gagal(pesanErrorDb(dukungan.error));
    if (dukungan.data) return dukunganGanda;

    // RLS dan unique tetap menjadi pengaman terakhir untuk permintaan bersamaan.
    const hasil = await catatUpvote(supabase, idLaporan, akses.data.id);
    if (hasil.error?.code === "23505") return dukunganGanda;
    if (hasil.error) return gagal(pesanErrorDb(hasil.error));
    tersimpan = true;

    const jumlah = await getJumlahUpvote(supabase, idLaporan);
    if (jumlah.error || jumlah.data === null) return gagalMemuatJumlah;
    return ok(jumlah.data);
  } catch {
    return tersimpan ? gagalMemuatJumlah : gagal("Gagal mengirim dukungan. Periksa koneksi lalu coba lagi.");
  }
}
