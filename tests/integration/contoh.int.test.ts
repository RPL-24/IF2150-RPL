// CONTOH uji integrasi (template untuk dicontek). Menembak Supabase PRODUCTION.
// Nama test di sini diawali "CONTOH". Untuk tes resmi, tulis ID di nama test dengan pola INT-TCYY
// sesuai rentang nomor masing-masing anggota, mis. it("INT-TC07 warga mengirim laporan ...").
//
// Kenapa tidak memanggil LaporanController.kirimLaporan langsung:
// controller memanggil createClient() dari lib/supabase/server (butuh cookies() dari konteks request Next.js)
// dan memverifikasi token Cloudflare Turnstile, keduanya tidak tersedia di proses Vitest.
// Jadi tes ini menjalankan langkah yang sama dengan controller memakai kode src asli:
//   validasiForm/validasiLokasi/validasiBerkas (laporan-validasi.ts) → Laporan.simpanLaporan (RPC kirim_laporan)
// dengan client WARGA (bukan service role), sehingga RLS, grant kolom, dan trigger DB ikut teruji.
// Upload berkas meniru lib/media.ts unggahMedia() (yang terikat ke client browser) dengan path yang sama.

import { afterAll, describe, expect, it } from "vitest";
import { validasiBerkas, validasiForm, validasiLokasi } from "@/server/controllers/laporan-validasi";
import type { MediaTerunggah } from "@/server/entities/Foto";
import { simpanLaporan } from "@/server/entities/Laporan";
import { buatPelacak } from "./helpers/pelacak";
import { buatClientAdmin, KOORDINAT_TES, loginSebagai, PENANDA } from "./helpers/supabase";

// PNG 1×1 piksel (68 byte): berkas bukti terkecil yang lolos MIME bucket `media`.
const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

describe("CONTOH uji integrasi UC01", () => {
  const pelacak = buatPelacak();
  // Selalu bersihkan, termasuk kalau assertion di bawah gagal.
  afterAll(() => pelacak.bersihkan());

  it("CONTOH warga membuat laporan berpenanda → tersimpan, status diterima, ID tiket LK-XXXX", async () => {
    // Pengaman: berhenti SEBELUM menulis apa pun kalau titik tes ternyata di luar wilayah.
    const galatLokasi = validasiLokasi(KOORDINAT_TES.latitude, KOORDINAT_TES.longitude);
    if (galatLokasi) throw new Error(`KOORDINAT_TES di luar BATAS_WILAYAH (${galatLokasi}). Perbaiki di helpers/supabase.ts.`);

    const { client: warga, idUser } = await loginSebagai("warga");

    // 1. Upload bukti ke bucket `media` sebagai warga (policy Storage ikut teruji).
    const path = `laporan/${idUser}/${crypto.randomUUID()}.png`;
    pelacak.catatBerkas(path); // catat dulu; menghapus path yang tidak ada aman
    const unggah = await warga.storage.from("media").upload(path, PNG_1X1, { contentType: "image/png", upsert: false });
    expect(unggah.error).toBeNull();

    // 2. Validasi yang sama dengan LaporanController.kirimLaporan.
    const media: MediaTerunggah[] = [{ path, format: "png", ukuran: PNG_1X1.length, tipe: "foto" }];
    const data = {
      kategori: "jalan_berlubang" as const,
      deskripsi: `${PENANDA} contoh uji integrasi laporan warga`,
      ...KOORDINAT_TES,
      media,
    };
    expect(validasiForm(data.kategori, data.deskripsi)).toBeNull();
    expect(validasiBerkas(data.media, idUser)).toBeNull();

    // 3. Simpan lewat entity asli dengan client warga.
    const { data: baru, error } = await simpanLaporan(warga, data);
    if (baru) pelacak.catat("laporan", baru.id); // catat SEBELUM expect
    expect(error).toBeNull();
    if (!baru) throw new Error("simpanLaporan tidak mengembalikan data");

    // 4. Baca ulang langsung dari DB dengan client admin. Assertion berdasarkan ID yang baru dibuat, bukan jumlah total.
    const admin = buatClientAdmin();
    const { data: baris, error: errBaca } = await admin
      .from("laporan")
      .select("id_tiket, id_pelapor, deskripsi, status, tahap")
      .eq("id", baru.id)
      .single();
    expect(errBaca).toBeNull();
    expect(baris).toEqual({
      id_tiket: baru.id_tiket,
      id_pelapor: idUser,
      deskripsi: data.deskripsi,
      status: "diterima",
      tahap: null,
    });
    expect(baru.id_tiket).toMatch(/^LK-\d{4,}$/);

    // Baris foto dibuat RPC dalam transaksi yang sama. Dicatat juga (contoh mencatat tabel anak).
    const { data: foto } = await admin.from("foto").select("id, path").eq("id_laporan", baru.id);
    for (const f of foto ?? []) pelacak.catat("foto", f.id);
    expect(foto?.map((f) => f.path)).toEqual([path]);
  });
});
