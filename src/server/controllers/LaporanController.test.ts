// Unit test C17 LaporanController (Peran A, tingkat Mendalam): kirimLaporan (Algo-036),
// verifikasiAntiBot (Algo-038, private, diuji lewat kirimLaporan), dukungLaporanDuplikat.
// ID test case: C17-UT21 s.d. C17-UT40. Basis data, auth, dan Cloudflare di-mock; komponen nyata diuji di INT-TC01 dst.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { gagal, ok } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { PESAN_UMUM } from "@/lib/error-db";
import { PESAN_BERKAS_TIDAK_VALID } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";
import type { MediaTerunggah } from "@/server/entities/Foto";
import { getRincianPublik, simpanLaporan, type DataLaporanBaru } from "@/server/entities/Laporan";
import { catatUpvote } from "@/server/entities/Upvote";
import {
  PESAN_ANTIBOT_GAGAL,
  PESAN_DI_LUAR_WILAYAH,
  PESAN_FORM_TIDAK_LENGKAP,
} from "./laporan-validasi";
import { dukungLaporanDuplikat, kirimLaporan } from "./LaporanController";

vi.mock("@/lib/auth", () => ({ requireRole: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/server/entities/Laporan", () => ({ simpanLaporan: vi.fn(), getRincianPublik: vi.fn() }));
vi.mock("@/server/entities/Upvote", () => ({ catatUpvote: vi.fn() }));

const ID_USER = "11111111-1111-1111-1111-111111111111";
const TOKEN = "token-turnstile-uji";
const URL_SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MB = 1024 * 1024;

// Client Supabase palsu: hanya rpc("cari_laporan_duplikat") yang dipakai langsung oleh controller.
const rpc = vi.fn();
const supabasePalsu = { rpc } as never;
const fetchPalsu = vi.fn();

const foto: MediaTerunggah = { path: `laporan/${ID_USER}/a.jpg`, format: "jpg", ukuran: 2 * MB, tipe: "foto" };
const DATA: DataLaporanBaru = {
  kategori: "jalan_berlubang",
  deskripsi: "  Lubang besar di depan sekolah  ",
  latitude: -6.9175,
  longitude: 107.6191,
  media: [foto],
};

/** Respons Cloudflare siteverify. */
const responsCloudflare = (success: boolean, status = 200) =>
  new Response(JSON.stringify({ success, "error-codes": success ? [] : ["invalid-input-response"] }), { status });

/** Bentuk { data, error } seperti hasil query Supabase. */
const hasilDb = (data: unknown, error: { code: string; message: string } | null = null) => ({ data, error }) as never;

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-uji");
  vi.stubGlobal("fetch", fetchPalsu);
  vi.mocked(requireRole).mockResolvedValue(ok({ id: ID_USER, nama: "Warga Uji", role: "warga" }));
  vi.mocked(createClient).mockResolvedValue(supabasePalsu);
  fetchPalsu.mockResolvedValue(responsCloudflare(true));
  rpc.mockResolvedValue({ data: [], error: null });
  vi.mocked(simpanLaporan).mockResolvedValue(hasilDb({ id: "uuid-baru", id_tiket: "LK-0101" }));
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("C17 LaporanController.kirimLaporan", () => {
  it("C17-UT21 kirimLaporan (normal): data valid, token sah, tidak ada duplikat → terkirim LK-0101", async () => {
    const hasil = await kirimLaporan(DATA, TOKEN);
    expect(hasil).toEqual(ok({ jenis: "terkirim", idTiket: "LK-0101" }));
    expect(requireRole).toHaveBeenCalledWith("warga");
    expect(rpc).toHaveBeenCalledWith("cari_laporan_duplikat", {
      p_kategori: "jalan_berlubang",
      p_lat: -6.9175,
      p_lng: 107.6191,
    });
  });

  it("C17-UT22 kirimLaporan (batas): deskripsi dengan spasi di awal/akhir disimpan dalam bentuk ter-trim", async () => {
    await kirimLaporan(DATA, TOKEN);
    expect(simpanLaporan).toHaveBeenCalledWith(supabasePalsu, { ...DATA, deskripsi: "Lubang besar di depan sekolah" });
  });

  it("C17-UT23 kirimLaporan (normal): laporan serupa ≤ 20 m ditemukan → jenis duplikat, laporan baru tidak disimpan", async () => {
    rpc.mockResolvedValue({ data: [{ id_tiket: "LK-0042", status: "diterima", jarak_m: 7.5 }], error: null });
    const hasil = await kirimLaporan(DATA, TOKEN);
    expect(hasil).toEqual(ok({ jenis: "duplikat", idTiket: "LK-0042" }));
    expect(simpanLaporan).not.toHaveBeenCalled();
  });

  it("C17-UT24 kirimLaporan (batas): beberapa laporan serupa → yang pertama (terdekat dari RPC) dipakai", async () => {
    rpc.mockResolvedValue({
      data: [
        { id_tiket: "LK-0042", status: "diterima", jarak_m: 3 },
        { id_tiket: "LK-0050", status: "dikerjakan", jarak_m: 19.9 },
      ],
      error: null,
    });
    expect(await kirimLaporan(DATA, TOKEN)).toEqual(ok({ jenis: "duplikat", idTiket: "LK-0042" }));
  });

  it("C17-UT25 kirimLaporan (negatif): bukan warga / belum login → ditolak sebelum verifikasi anti-bot", async () => {
    vi.mocked(requireRole).mockResolvedValue(gagal("Anda tidak memiliki akses ke fitur ini."));
    const hasil = await kirimLaporan(DATA, TOKEN);
    expect(hasil).toEqual(gagal("Anda tidak memiliki akses ke fitur ini."));
    expect(fetchPalsu).not.toHaveBeenCalled();
    expect(simpanLaporan).not.toHaveBeenCalled();
  });

  it("C17-UT26 kirimLaporan (negatif): data form tidak lengkap → PESAN_FORM_TIDAK_LENGKAP, tidak ke DB", async () => {
    const hasil = await kirimLaporan({ ...DATA, deskripsi: "   " }, TOKEN);
    expect(hasil).toEqual(gagal(PESAN_FORM_TIDAK_LENGKAP));
    expect(rpc).not.toHaveBeenCalled();
  });

  it("C17-UT27 kirimLaporan (negatif): lokasi di luar wilayah → PESAN_DI_LUAR_WILAYAH, tidak ke DB", async () => {
    const hasil = await kirimLaporan({ ...DATA, latitude: -6.2088, longitude: 106.8456 }, TOKEN);
    expect(hasil).toEqual(gagal(PESAN_DI_LUAR_WILAYAH));
    expect(rpc).not.toHaveBeenCalled();
  });

  it("C17-UT28 kirimLaporan (negatif): berkas milik folder user lain → PESAN_BERKAS_TIDAK_VALID", async () => {
    const asing = { ...foto, path: "laporan/22222222-2222-2222-2222-222222222222/a.jpg" };
    const hasil = await kirimLaporan({ ...DATA, media: [asing] }, TOKEN);
    expect(hasil).toEqual(gagal(PESAN_BERKAS_TIDAK_VALID));
    expect(simpanLaporan).not.toHaveBeenCalled();
  });

  it("C17-UT29 kirimLaporan (negatif): RPC cek duplikat error → pesan umum, laporan tidak disimpan", async () => {
    rpc.mockResolvedValue({ data: null, error: { code: "08006", message: "koneksi putus" } });
    expect(await kirimLaporan(DATA, TOKEN)).toEqual(gagal(PESAN_UMUM));
    expect(simpanLaporan).not.toHaveBeenCalled();
  });

  it("C17-UT30 kirimLaporan (negatif): RPC kirim_laporan menolak (P0001) → pesan dari DB diteruskan", async () => {
    vi.mocked(simpanLaporan).mockResolvedValue(hasilDb(null, { code: "P0001", message: "Lampirkan minimal satu foto atau video." }));
    expect(await kirimLaporan(DATA, TOKEN)).toEqual(gagal("Lampirkan minimal satu foto atau video."));
  });

  it("C17-UT31 kirimLaporan (negatif): RPC tidak mengembalikan baris dan tanpa error → pesan umum", async () => {
    vi.mocked(simpanLaporan).mockResolvedValue(hasilDb(null));
    expect(await kirimLaporan(DATA, TOKEN)).toEqual(gagal(PESAN_UMUM));
  });
});

describe("C17 LaporanController.verifikasiAntiBot (lewat kirimLaporan)", () => {
  it("C17-UT32 verifikasiAntiBot (normal): token dan secret dikirim ke siteverify Cloudflare (POST)", async () => {
    await kirimLaporan(DATA, TOKEN);
    expect(fetchPalsu).toHaveBeenCalledTimes(1);
    const [url, opsi] = fetchPalsu.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(URL_SITEVERIFY);
    expect(opsi.method).toBe("POST");
    const body = new URLSearchParams(opsi.body as URLSearchParams);
    expect(body.get("secret")).toBe("secret-uji");
    expect(body.get("response")).toBe(TOKEN);
  });

  it("C17-UT33 verifikasiAntiBot (negatif): token kosong → ditolak tanpa memanggil Cloudflare", async () => {
    expect(await kirimLaporan(DATA, "")).toEqual(gagal(PESAN_ANTIBOT_GAGAL));
    expect(fetchPalsu).not.toHaveBeenCalled();
    expect(simpanLaporan).not.toHaveBeenCalled();
  });

  it("C17-UT34 verifikasiAntiBot (negatif): token tidak valid (Cloudflare success: false) → ditolak", async () => {
    fetchPalsu.mockResolvedValue(responsCloudflare(false));
    expect(await kirimLaporan(DATA, "token-palsu")).toEqual(gagal(PESAN_ANTIBOT_GAGAL));
    expect(rpc).not.toHaveBeenCalled();
    expect(simpanLaporan).not.toHaveBeenCalled();
  });

  it("C17-UT35 verifikasiAntiBot (batas): TURNSTILE_SECRET_KEY tidak diatur → gagal-tertutup, ditolak", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    expect(await kirimLaporan(DATA, TOKEN)).toEqual(gagal(PESAN_ANTIBOT_GAGAL));
    expect(fetchPalsu).not.toHaveBeenCalled();
  });

  it("C17-UT36 verifikasiAntiBot (negatif): Cloudflare membalas HTTP 500 → ditolak", async () => {
    fetchPalsu.mockResolvedValue(responsCloudflare(true, 500));
    expect(await kirimLaporan(DATA, TOKEN)).toEqual(gagal(PESAN_ANTIBOT_GAGAL));
  });

  it("C17-UT37 verifikasiAntiBot (negatif): Cloudflare tidak bisa dihubungi (fetch error) → ditolak", async () => {
    fetchPalsu.mockRejectedValue(new TypeError("fetch failed"));
    expect(await kirimLaporan(DATA, TOKEN)).toEqual(gagal(PESAN_ANTIBOT_GAGAL));
    expect(simpanLaporan).not.toHaveBeenCalled();
  });
});

describe("C17 LaporanController.dukungLaporanDuplikat", () => {
  beforeEach(() => {
    vi.mocked(getRincianPublik).mockResolvedValue(hasilDb({ id: "uuid-lk-0042", id_tiket: "LK-0042" }));
    vi.mocked(catatUpvote).mockResolvedValue(hasilDb(null));
  });

  it("C17-UT38 dukungLaporanDuplikat (normal): warga mendukung LK-0042 → ok, upvote dicatat untuk user aktif", async () => {
    expect(await dukungLaporanDuplikat("LK-0042")).toEqual(ok({ idTiket: "LK-0042" }));
    expect(catatUpvote).toHaveBeenCalledWith(supabasePalsu, "uuid-lk-0042", ID_USER);
  });

  it("C17-UT39 dukungLaporanDuplikat (batas): tiket tidak ada / tidak publik → 'Laporan tidak ditemukan.'", async () => {
    vi.mocked(getRincianPublik).mockResolvedValue(hasilDb(null));
    expect(await dukungLaporanDuplikat("LK-9999")).toEqual(gagal("Laporan tidak ditemukan."));
    expect(catatUpvote).not.toHaveBeenCalled();
  });

  it("C17-UT40 dukungLaporanDuplikat (negatif): dukungan kedua oleh akun yang sama (23505) → ditolak", async () => {
    vi.mocked(catatUpvote).mockResolvedValue(
      hasilDb(null, { code: "23505", message: 'duplicate key value violates unique constraint "upvote_id_laporan_id_user_key"' }),
    );
    expect(await dukungLaporanDuplikat("LK-0042")).toEqual(gagal("Anda sudah mendukung laporan ini."));
  });

  it("C17-UT41 dukungLaporanDuplikat (negatif): mendukung laporan sendiri ditolak RLS (42501)", async () => {
    vi.mocked(catatUpvote).mockResolvedValue(hasilDb(null, { code: "42501", message: "new row violates row-level security" }));
    expect(await dukungLaporanDuplikat("LK-0042")).toEqual(gagal("Anda tidak memiliki akses untuk tindakan ini."));
  });

  it("C17-UT42 dukungLaporanDuplikat (negatif): bukan warga → ditolak, tidak membaca DB", async () => {
    vi.mocked(requireRole).mockResolvedValue(gagal("Silakan masuk terlebih dahulu."));
    expect(await dukungLaporanDuplikat("LK-0042")).toEqual(gagal("Silakan masuk terlebih dahulu."));
    expect(getRincianPublik).not.toHaveBeenCalled();
  });

  it("C17-UT43 dukungLaporanDuplikat (negatif): error DB saat membaca laporan → pesan umum", async () => {
    vi.mocked(getRincianPublik).mockResolvedValue(hasilDb(null, { code: "08006", message: "koneksi putus" }));
    expect(await dukungLaporanDuplikat("LK-0042")).toEqual(gagal(PESAN_UMUM));
  });
});
