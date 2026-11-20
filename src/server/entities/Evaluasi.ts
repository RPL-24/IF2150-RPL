import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Enums, Tables } from "@/types/database";

type Berkas = { path: string };

export type ItemSiapEvaluasi = Pick<Tables<"laporan">, "id" | "id_tiket" | "kategori" | "waktu_masuk"> & {
  id_hasil: string;
  waktu_unggah: string;
  nama_eksekutor: string | null;
};

export type HasilPerbaikanEvaluasi = Pick<Tables<"hasil_perbaikan">, "id_hasil" | "catatan" | "waktu_unggah"> & {
  nama_eksekutor: string | null;
  foto: Berkas[];
  video: Berkas[];
};

export type LaporanEvaluasi = Pick<
  Tables<"laporan">,
  "id" | "id_tiket" | "kategori" | "deskripsi" | "latitude" | "longitude" | "status" | "tahap" | "waktu_masuk"
> & {
  nama_pelapor: string | null;
  foto: Berkas[];
  video: Berkas[];
};

export type DetailEvaluasi = {
  laporan: LaporanEvaluasi;
  hasilPerbaikan: HasilPerbaikanEvaluasi | null;
};

export type DataEvaluasiBaru = {
  id_laporan: string;
  id_hasil: string;
  id_admin: string;
  keputusan: Enums<"keputusan_evaluasi">;
  catatan: string | null;
};

export async function ambilDaftarSiapEvaluasi(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("laporan")
    .select(
      `id, id_tiket, kategori, waktu_masuk,
       hasil:hasil_perbaikan!hasil_perbaikan_id_laporan_fkey(
         id_hasil, waktu_unggah,
         eksekutor:profiles!hasil_perbaikan_id_eksekutor_fkey(nama)
       )`,
    )
    .eq("status", "dikerjakan")
    .eq("tahap", "menunggu_evaluasi")
    .order("waktu_masuk", { ascending: false })
    .order("waktu_unggah", { referencedTable: "hasil", ascending: false });
  if (error) return { data: null, error };

  const daftar: ItemSiapEvaluasi[] = data.flatMap(({ hasil, ...laporan }) => {
    const terbaru = hasil[0];
    if (!terbaru) return [];
    return [
      {
        ...laporan,
        id_hasil: terbaru.id_hasil,
        waktu_unggah: terbaru.waktu_unggah,
        nama_eksekutor: terbaru.eksekutor?.nama ?? null,
      },
    ];
  });
  return { data: daftar, error: null };
}

export async function ambilDetailEvaluasi(supabase: SupabaseClient<Database>, idTiket: string) {
  const { data, error } = await supabase
    .from("laporan")
    .select(
      `id, id_tiket, kategori, deskripsi, latitude, longitude, status, tahap, waktu_masuk,
       pelapor:profiles!laporan_id_pelapor_fkey(nama),
       foto!foto_id_laporan_fkey(path),
       video!video_id_laporan_fkey(path),
       hasil:hasil_perbaikan!hasil_perbaikan_id_laporan_fkey(
         id_hasil, catatan, waktu_unggah,
         eksekutor:profiles!hasil_perbaikan_id_eksekutor_fkey(nama),
         foto!foto_id_hasil_fkey(path),
         video!video_id_hasil_fkey(path)
       )`,
    )
    .eq("id_tiket", idTiket)
    .order("waktu_unggah", { referencedTable: "hasil", ascending: false })
    .limit(1, { referencedTable: "hasil" })
    .maybeSingle();
  if (error || !data) return { data: null, error };

  const { pelapor, hasil, ...laporan } = data;
  const terbaru = hasil[0];
  const detail: DetailEvaluasi = {
    laporan: { ...laporan, nama_pelapor: pelapor?.nama ?? null },
    hasilPerbaikan: terbaru
      ? {
          id_hasil: terbaru.id_hasil,
          catatan: terbaru.catatan,
          waktu_unggah: terbaru.waktu_unggah,
          nama_eksekutor: terbaru.eksekutor?.nama ?? null,
          foto: terbaru.foto,
          video: terbaru.video,
        }
      : null,
  };
  return { data: detail, error: null };
}

export async function cariIdLaporan(supabase: SupabaseClient<Database>, idTiket: string) {
  const { data, error } = await supabase.from("laporan").select("id").eq("id_tiket", idTiket).maybeSingle();
  return { data: data?.id ?? null, error };
}

export async function simpanEvaluasi(supabase: SupabaseClient<Database>, data: DataEvaluasiBaru) {
  return supabase.from("evaluasi").insert(data).select("id_evaluasi").single();
}

export async function getEvaluasiTerakhir(supabase: SupabaseClient<Database>, idLaporan: string) {
  return supabase
    .from("evaluasi")
    .select("keputusan, catatan, waktu_evaluasi")
    .eq("id_laporan", idLaporan)
    .order("waktu_evaluasi", { ascending: false})
    .limit(1)
    .maybeSingle();
}