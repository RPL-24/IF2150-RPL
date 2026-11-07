// Upload foto/video langsung dari browser ke bucket `media` (AGENTS.md bagian 7).
// Dipanggil View saat submit, SEBELUM Server Action; hasilnya (path/format/ukuran/tipe) dikirim ke controller,
// yang meneruskannya ke RPC kirim_laporan / kirim_hasil_perbaikan.

import { type ActionResult, gagal, ok } from "@/lib/action-result";
import { FORMAT_FOTO, FORMAT_VIDEO } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { formatDariNama, isFotoValid, type MediaTerunggah } from "@/server/entities/Foto";
import { isVideoValid } from "@/server/entities/Video";

export const PESAN_BERKAS_TIDAK_VALID = "Foto harus JPG/PNG, video MP4/MOV/MKV, maks. 10 MB"; // Algo-019

export async function unggahMedia(
  files: File[],
  jenis: "laporan" | "hasil",
  userId: string,
): Promise<ActionResult<MediaTerunggah[]>> {
  // Validasi semua dulu supaya tidak ada berkas yang terlanjur ter-upload.
  if (!files.every((f) => isFotoValid(f) || isVideoValid(f))) return gagal(PESAN_BERKAS_TIDAK_VALID);

  const supabase = createClient();
  const hasil: MediaTerunggah[] = [];
  // Catatan: berurutan & tanpa rollback (tidak ada policy DELETE). Berkas yang sudah ter-upload
  // sebelum kegagalan jadi yatim di bucket; bersihkan lewat job server jika jadi masalah.
  for (const file of files) {
    const format = formatDariNama(file.name);
    const tipe = isFotoValid(file) ? "foto" : "video";
    // contentType eksplisit: browser sering memberi MIME kosong untuk .mkv, dan bucket mengecek MIME.
    const contentType = tipe === "foto"
      ? FORMAT_FOTO[format as keyof typeof FORMAT_FOTO]
      : FORMAT_VIDEO[format as keyof typeof FORMAT_VIDEO];
    const path = `${jenis}/${userId}/${crypto.randomUUID()}.${format}`;

    const { error } = await supabase.storage.from("media").upload(path, file, { contentType, upsert: false });
    if (error) return gagal(`Gagal mengunggah ${file.name}. Periksa koneksi lalu coba kirim lagi.`);
    hasil.push({ path, format, ukuran: file.size, tipe });
  }
  return ok(hasil);
}
