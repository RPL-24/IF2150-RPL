// C05 · Video (kelas entity DPPL). Pemilik: Peran F.
// Nama fungsi mengikuti nama operasi di DPPL.
// Fungsi murni: JANGAN impor lib/supabase/* di file ini (dipakai juga di client).
// Baris foto/video disimpan oleh RPC kirim_laporan / kirim_hasil_perbaikan (satu transaksi dengan induknya).

import { FORMAT_VIDEO } from "@/lib/constants";
import { formatDariNama, ukuranValid, type Berkas } from "./Foto";

/** Algo-010: format MP4/MOV/MKV dan ukuran ≤ 10 MB. Dinilai dari ekstensi, bukan MIME. */
export function isVideoValid(berkas: Berkas): boolean {
  return Object.hasOwn(FORMAT_VIDEO, formatDariNama(berkas.name)) && ukuranValid(berkas.size);
}
