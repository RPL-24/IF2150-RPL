import { createClient as createSupabaseClient, PostgrestError } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { gagal, ok } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { pesanErrorDb } from "@/lib/error-db";
import { PESAN_BERKAS_TIDAK_VALID } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";
import { PESAN_TAK_LENGKAP } from "@/lib/validasi-perbaikan";
import type { MediaTerunggah } from "@/server/entities/Foto";
import { simpanBukti } from "@/server/entities/HasilPerbaikan";
import { getRincian } from "@/server/entities/Laporan";
import type { Database } from "@/types/database";
import { unggahHasil, verifikasiAkses } from "./PerbaikanController";

vi.mock("@/lib/auth", () => ({ requireRole: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/server/entities/Laporan", () => ({ getRincian: vi.fn() }));
// validasiBerkas tetap asli (fungsi murni); hanya simpanBukti yang menyentuh basis data.
vi.mock("@/server/entities/HasilPerbaikan", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/server/entities/HasilPerbaikan")>()),
  simpanBukti: vi.fn(),
}));

const supabase = createSupabaseClient<Database>("https://laporkota-test.supabase.co", "sb_publishable_unit_test", {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

const PESAN_TUGAS_TAK_AKTIF = "Tugas tidak ditemukan atau sudah tidak aktif. Loading ulang..";
const PESAN_GAGAL_KIRIM = "Gagal mengirim hasil perbaikan. Silakan periksa koneksi Anda lalu coba lagi";
const ID = "eksekutor-uji";
const MB = 1024 * 1024;

const respons = (data: unknown, error: PostgrestError | null = null) =>
  ({ data, error, count: null, status: error ? 500 : 200, statusText: error ? "Error" : "OK" }) as never;

const media = (nama: string, tipe: MediaTerunggah["tipe"], ukuran = 2 * MB, folder = `hasil/${ID}`): MediaTerunggah => ({
  path: `${folder}/${nama}`, format: nama.split(".").pop()!, ukuran, tipe,
});
const foto = [media("a.jpg", "foto")];
const video = [media("b.mp4", "video")];

const laporan = {
  id: "uuid-LK-0007", id_tiket: "LK-0007", kategori: "trotoar_rusak", deskripsi: "Uji",
  latitude: -6.9175, longitude: 107.6191, status: "dikerjakan", tahap: "menunggu_eksekusi",
  jumlah_upvote: 0, skor_prioritas: 3, waktu_masuk: "2026-11-05T08:00:00Z",
  waktu_selesai: null, alasan_penolakan: null, pelapor: null, foto: [], video: [], riwayat: [],
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(requireRole).mockResolvedValue(ok({ id: ID, nama: "Eksekutor Uji", role: "eksekutor" }));
  vi.mocked(createClient).mockResolvedValue(supabase);
  vi.mocked(getRincian).mockResolvedValue(respons(laporan));
  vi.mocked(simpanBukti).mockResolvedValue(respons("uuid-hasil"));
});

describe("PerbaikanController.verifikasiAkses", () => {
  it("C20-UT13 verifikasiAkses (normal + negatif): eksekutor true, ditolak false", async () => {
    expect(await verifikasiAkses()).toBe(true);
    expect(requireRole).toHaveBeenCalledWith("eksekutor");
    vi.mocked(requireRole).mockResolvedValue(gagal("Anda tidak memiliki akses ke fitur ini."));
    expect(await verifikasiAkses()).toBe(false);
  });
});

describe("PerbaikanController.unggahHasil", () => {
  it("C20-UT14 unggahHasil (normal): simpan catatan (di-trim) + foto + video", async () => {
    expect(await unggahHasil("LK-0007", "  Lubang sudah ditambal.  ", foto, video)).toEqual(ok({ idTiket: "LK-0007" }));
    expect(simpanBukti).toHaveBeenCalledWith(supabase, {
      idLaporan: "uuid-LK-0007", catatan: "Lubang sudah ditambal.", media: [...foto, ...video],
    });
  });

  it("C20-UT15 unggahHasil (negatif): akses ditolak", async () => {
    vi.mocked(requireRole).mockResolvedValue(gagal("Anda tidak memiliki akses ke fitur ini."));
    expect(await unggahHasil("LK-0007", "Catatan", foto, [])).toEqual(gagal("Anda tidak memiliki akses ke fitur ini."));
    expect(createClient).not.toHaveBeenCalled();
  });

  it.each([
    ["catatan kosong", "", foto],
    ["catatan hanya spasi", "   ", foto],
    ["tanpa foto (UC04 Alt 1)", "Catatan", []],
  ])("C20-UT16 unggahHasil (negatif): %s ditolak dengan pesan I06-08", async (_nama, catatan, daftarFoto) => {
    expect(await unggahHasil("LK-0007", catatan, daftarFoto, video)).toEqual(gagal(PESAN_TAK_LENGKAP));
    expect(createClient).not.toHaveBeenCalled();
  });

  it("C20-UT17 unggahHasil (negatif): tipe masukan salah dari client", async () => {
    expect(await unggahHasil("LK-0007", null as never, "x" as never, [])).toEqual(gagal(PESAN_TAK_LENGKAP));
  });

  it.each([
    ["foto GIF", [media("a.gif", "foto")], []],
    ["video AVI", foto, [media("b.avi", "video")]],
    ["foto 10 MB + 1 byte", [media("a.jpg", "foto", 10 * MB + 1)], []],
    ["foto di folder eksekutor lain", [media("a.jpg", "foto", MB, "hasil/eksekutor-lain")], []],
    ["foto dari folder laporan warga", [media("a.jpg", "foto", MB, `laporan/${ID}`)], []],
  ])("C20-UT18 unggahHasil (negatif): %s ditolak sebagai berkas tidak valid", async (_nama, daftarFoto, daftarVideo) => {
    expect(await unggahHasil("LK-0007", "Catatan", daftarFoto, daftarVideo)).toEqual(gagal(PESAN_BERKAS_TIDAK_VALID));
    expect(simpanBukti).not.toHaveBeenCalled();
  });

  it("C20-UT19 unggahHasil (batas): foto tepat 10 MB diterima", async () => {
    expect(await unggahHasil("LK-0007", "Catatan", [media("a.png", "foto", 10 * MB)], [])).toEqual(ok({ idTiket: "LK-0007" }));
  });

  it.each([
    ["tiket tidak ada", null],
    ["hasil sudah dikirim (menunggu_evaluasi)", { ...laporan, tahap: "menunggu_evaluasi" }],
  ])("C20-UT20 unggahHasil (negatif): %s, tidak menyimpan bukti", async (_nama, data) => {
    vi.mocked(getRincian).mockResolvedValue(respons(data));
    expect(await unggahHasil("LK-0007", "Catatan", foto, [])).toEqual(gagal(PESAN_TUGAS_TAK_AKTIF));
    expect(simpanBukti).not.toHaveBeenCalled();
  });

  it("C20-UT21 unggahHasil (negatif): error membaca laporan", async () => {
    const error = new PostgrestError({ code: "500", message: "x", details: "", hint: "" });
    vi.mocked(getRincian).mockResolvedValue(respons(null, error));
    expect(await unggahHasil("LK-0007", "Catatan", foto, [])).toEqual(gagal(pesanErrorDb(error)));
  });

  it("C20-UT22 unggahHasil (negatif): RPC menolak, pesan diteruskan", async () => {
    const error = new PostgrestError({ code: "P0001", message: "Tugas tidak dalam tahap menunggu eksekusi.", details: "", hint: "" });
    vi.mocked(simpanBukti).mockResolvedValue(respons(null, error));
    expect(await unggahHasil("LK-0007", "Catatan", foto, [])).toEqual(gagal("Tugas tidak dalam tahap menunggu eksekusi."));
  });

  it("C20-UT23 unggahHasil (negatif): koneksi gagal", async () => {
    vi.mocked(createClient).mockRejectedValue(new Error("fetch failed"));
    expect(await unggahHasil("LK-0007", "Catatan", foto, [])).toEqual(gagal(PESAN_GAGAL_KIRIM));
  });
});
