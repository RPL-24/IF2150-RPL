// Uji integrasi Peran A (UC01 Mengirim Laporan Kerusakan). Menembak Supabase PRODUCTION dan Cloudflare Turnstile.
// Mengikuti aturan src/README.md "Pengujian": akun tes, penanda [TEST-INT], KOORDINAT_TES, assertion per ID,
// dan pelacak.bersihkan() yang menghapus HANYA ID/berkas yang dicatat.
//
// Komponen nyata: LaporanController -> entity Laporan -> RPC kirim_laporan / cari_laporan_duplikat -> trigger DB,
// Storage bucket `media`, dan endpoint siteverify Cloudflare. Satu-satunya pengganti: createClient() dari
// lib/supabase/server (butuh cookies() Next.js) diganti client supabase-js asli yang login sebagai warga tes.
// Key Turnstile memakai key uji resmi Cloudflare: 1x... selalu lolos, 2x... selalu gagal.

import type { SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import { kirimLaporan } from "@/server/controllers/LaporanController";
import {
  PESAN_ANTIBOT_GAGAL,
  validasiBerkas,
  validasiForm,
  validasiLokasi,
} from "@/server/controllers/laporan-validasi";
import type { MediaTerunggah } from "@/server/entities/Foto";
import { simpanLaporan, type DataLaporanBaru } from "@/server/entities/Laporan";
import type { Database, Enums } from "@/types/database";
import { buatPelacak } from "./helpers/pelacak";
import { buatClientAdmin, KOORDINAT_TES, loginSebagai, PENANDA } from "./helpers/supabase";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const SECRET_SELALU_LOLOS = "1x0000000000000000000000000000000AA";
const SECRET_SELALU_GAGAL = "2x0000000000000000000000000000000AA";
const TOKEN_DUMMY = "XXXX.DUMMY.TOKEN.XXXX"; // token yang diberi widget saat memakai site key uji

// PNG 1×1 piksel (68 byte): berkas bukti terkecil yang lolos MIME bucket `media`.
const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

// Titik kedua ±55 m dari KOORDINAT_TES, supaya laporan lewat controller tidak dianggap duplikat laporan INT-TC01.
const TITIK_CONTROLLER = { latitude: KOORDINAT_TES.latitude + 0.0005, longitude: KOORDINAT_TES.longitude };

describe("Integrasi Peran A (UC01) di production", () => {
  const pelacak = buatPelacak();
  const admin = buatClientAdmin();
  let warga: SupabaseClient<Database>;
  let idWarga = "";
  let laporanTc01: { id: string; id_tiket: string } | null = null;
  let pathTc01 = "";
  let idTiketController = "";

  /** Upload PNG 1×1 ke laporan/<idFolder>/ sebagai warga tes. Path selalu dicatat untuk dibersihkan. */
  async function unggahPng(idFolder = idWarga) {
    const path = `laporan/${idFolder}/${crypto.randomUUID()}.png`;
    pelacak.catatBerkas(path);
    const hasil = await warga.storage.from("media").upload(path, PNG_1X1, { contentType: "image/png", upsert: false });
    const media: MediaTerunggah = { path, format: "png", ukuran: PNG_1X1.length, tipe: "foto" };
    return { path, error: hasil.error, media };
  }

  /** Cari laporan berdasarkan id_tiket lalu catat ID-nya supaya ikut dibersihkan. */
  async function catatTiket(idTiket: string) {
    const { data } = await admin.from("laporan").select("id").eq("id_tiket", idTiket).maybeSingle();
    if (data) pelacak.catat("laporan", data.id);
    return data?.id ?? null;
  }

  beforeAll(async () => {
    // Pengaman: berhenti SEBELUM menulis apa pun kalau titik tes ternyata di luar wilayah.
    for (const t of [KOORDINAT_TES, TITIK_CONTROLLER]) {
      const galat = validasiLokasi(t.latitude, t.longitude);
      if (galat) throw new Error(`Titik tes ${t.latitude},${t.longitude} di luar BATAS_WILAYAH: ${galat}`);
    }
    ({ client: warga, idUser: idWarga } = await loginSebagai("warga"));
    // Semua createClient() di controller (termasuk requireRole) memakai sesi warga tes.
    vi.mocked(createClient).mockResolvedValue(warga);
  });

  afterAll(async () => {
    vi.unstubAllEnvs();
    await pelacak.bersihkan();
  });

  it("INT-TC01 simpanLaporan → DB: laporan tersimpan berstatus diterima, ID tiket LK-xxxx, riwayat & notifikasi dibuat trigger", async () => {
    const unggah = await unggahPng();
    expect(unggah.error).toBeNull();
    pathTc01 = unggah.path;

    const data: DataLaporanBaru = {
      kategori: "jalan_berlubang",
      deskripsi: `${PENANDA} INT-TC01 laporan uji Peran A`,
      ...KOORDINAT_TES,
      media: [unggah.media],
    };
    expect(validasiForm(data.kategori, data.deskripsi)).toBeNull();
    expect(validasiBerkas(data.media, idWarga)).toBeNull();

    const { data: baru, error } = await simpanLaporan(warga, data);
    if (baru) pelacak.catat("laporan", baru.id); // catat SEBELUM expect
    expect(error).toBeNull();
    if (!baru) throw new Error("simpanLaporan tidak mengembalikan data");
    laporanTc01 = baru;

    const { data: baris } = await admin
      .from("laporan")
      .select("id_tiket, id_pelapor, kategori, status, tahap, jumlah_upvote")
      .eq("id", baru.id)
      .single();
    expect(baris).toEqual({
      id_tiket: baru.id_tiket,
      id_pelapor: idWarga,
      kategori: "jalan_berlubang",
      status: "diterima",
      tahap: null,
      jumlah_upvote: 0,
    });
    expect(baru.id_tiket).toMatch(/^LK-\d{4,}$/);

    const { data: riwayat } = await admin.from("riwayat_status").select("status").eq("id_laporan", baru.id);
    expect(riwayat?.map((r) => r.status)).toEqual(["diterima"]);
    const { data: notif } = await admin.from("notifikasi").select("id_user").eq("id_laporan", baru.id);
    expect(notif?.some((n) => n.id_user === idWarga)).toBe(true);
  });

  it("INT-TC02 Storage → tabel foto: berkas ada di bucket media dan baris foto menunjuk path yang sama", async () => {
    if (!laporanTc01) throw new Error("INT-TC01 gagal, laporan tes tidak ada");
    const { data: foto } = await admin.from("foto").select("id, path, format, ukuran").eq("id_laporan", laporanTc01.id);
    for (const f of foto ?? []) pelacak.catat("foto", f.id);
    expect(foto?.map(({ path, format, ukuran }) => ({ path, format, ukuran }))).toEqual([
      { path: pathTc01, format: "png", ukuran: PNG_1X1.length },
    ]);

    const { data: berkas, error } = await admin.storage.from("media").download(pathTc01);
    expect(error).toBeNull();
    expect(berkas?.size).toBe(PNG_1X1.length);
  });

  it("INT-TC03 Storage (gagal): warga mengunggah ke folder laporan/ milik user lain → ditolak policy", async () => {
    const unggah = await unggahPng(crypto.randomUUID());
    expect(unggah.error).not.toBeNull();
  });

  it("INT-TC04 RPC kirim_laporan (gagal): tanpa media → ditolak DB, tidak ada laporan tersimpan", async () => {
    const deskripsi = `${PENANDA} INT-TC04 tanpa media ${Date.now()}`;
    const { data, error } = await simpanLaporan(warga, {
      kategori: "trotoar_rusak",
      deskripsi,
      ...KOORDINAT_TES,
      media: [],
    });
    if (data) pelacak.catat("laporan", data.id);
    expect(data).toBeNull();
    expect(error?.message).toBe("Lampirkan minimal satu foto atau video.");
    const { data: sisa } = await admin.from("laporan").select("id").eq("deskripsi", deskripsi);
    expect(sisa).toEqual([]);
  });

  it("INT-TC05 RPC cari_laporan_duplikat: titik & kategori sama menemukan laporan INT-TC01 (≤ 20 m); kategori lain tidak", async () => {
    if (!laporanTc01) throw new Error("INT-TC01 gagal, laporan tes tidak ada");
    const sama = await warga.rpc("cari_laporan_duplikat", {
      p_lat: KOORDINAT_TES.latitude,
      p_lng: KOORDINAT_TES.longitude,
      p_kategori: "jalan_berlubang",
    });
    expect(sama.error).toBeNull();
    const cocok = sama.data?.find((d) => d.id_tiket === laporanTc01?.id_tiket);
    expect(cocok?.jarak_m).toBeLessThanOrEqual(20);

    const lain = await warga.rpc("cari_laporan_duplikat", {
      p_lat: KOORDINAT_TES.latitude,
      p_lng: KOORDINAT_TES.longitude,
      p_kategori: "lampu_jalan_mati" satisfies Enums<"kategori_kerusakan">,
    });
    expect(lain.data?.some((d) => d.id_tiket === laporanTc01?.id_tiket)).toBe(false);
  });

  it("INT-TC06 kirimLaporan + Turnstile (lolos): controller → Cloudflare siteverify → RPC → DB, jenis terkirim", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", SECRET_SELALU_LOLOS);
    const unggah = await unggahPng();
    const hasil = await kirimLaporan(
      {
        kategori: "saluran_air_tersumbat",
        deskripsi: `${PENANDA} INT-TC06 lewat controller`,
        ...TITIK_CONTROLLER,
        media: [unggah.media],
      },
      TOKEN_DUMMY,
    );
    if (hasil.ok) idTiketController = hasil.data.idTiket;
    if (idTiketController) await catatTiket(idTiketController); // catat SEBELUM expect
    expect(hasil).toEqual({ ok: true, data: { jenis: "terkirim", idTiket: expect.stringMatching(/^LK-\d{4,}$/) } });
  });

  it("INT-TC07 kirimLaporan (duplikat): laporan kedua di titik & kategori sama → jenis duplikat dengan ID tiket INT-TC06", async () => {
    if (!idTiketController) throw new Error("INT-TC06 gagal, laporan tes tidak ada");
    vi.stubEnv("TURNSTILE_SECRET_KEY", SECRET_SELALU_LOLOS);
    const unggah = await unggahPng();
    const deskripsi = `${PENANDA} INT-TC07 duplikat ${Date.now()}`;
    const hasil = await kirimLaporan(
      { kategori: "saluran_air_tersumbat", deskripsi, ...TITIK_CONTROLLER, media: [unggah.media] },
      TOKEN_DUMMY,
    );
    if (hasil.ok && hasil.data.jenis === "terkirim") await catatTiket(hasil.data.idTiket);
    expect(hasil).toEqual({ ok: true, data: { jenis: "duplikat", idTiket: idTiketController } });
    const { data: baru } = await admin.from("laporan").select("id").eq("deskripsi", deskripsi);
    expect(baru).toEqual([]);
  });

  it("INT-TC08 kirimLaporan + Turnstile (gagal): Cloudflare menolak token → laporan tidak disimpan", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", SECRET_SELALU_GAGAL);
    const unggah = await unggahPng();
    const deskripsi = `${PENANDA} INT-TC08 token ditolak ${Date.now()}`;
    const hasil = await kirimLaporan(
      { kategori: "rambu_marka_rusak", deskripsi, ...TITIK_CONTROLLER, media: [unggah.media] },
      TOKEN_DUMMY,
    );
    if (hasil.ok) await catatTiket(hasil.data.idTiket);
    expect(hasil).toEqual({ ok: false, error: PESAN_ANTIBOT_GAGAL });
    const { data: baru } = await admin.from("laporan").select("id").eq("deskripsi", deskripsi);
    expect(baru).toEqual([]);
  });

  it("INT-TC09 kirimLaporan (gagal): token kosong → ditolak sebelum ke Cloudflare dan DB", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", SECRET_SELALU_LOLOS);
    const unggah = await unggahPng();
    const deskripsi = `${PENANDA} INT-TC09 token kosong ${Date.now()}`;
    const hasil = await kirimLaporan(
      { kategori: "rambu_marka_rusak", deskripsi, ...TITIK_CONTROLLER, media: [unggah.media] },
      "",
    );
    if (hasil.ok) await catatTiket(hasil.data.idTiket);
    expect(hasil).toEqual({ ok: false, error: PESAN_ANTIBOT_GAGAL });
    const { data: baru } = await admin.from("laporan").select("id").eq("deskripsi", deskripsi);
    expect(baru).toEqual([]);
  });
});
