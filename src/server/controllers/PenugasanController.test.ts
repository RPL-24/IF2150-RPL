import { createClient as createSupabaseClient, PostgrestError } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { gagal, ok } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getEvaluasiTerakhir } from "@/server/entities/Evaluasi";
import { getByStatus, getRincian } from "@/server/entities/Laporan";
import type { Database } from "@/types/database";
import { bukaLaporan, doFilter, doSorting, verifikasiAkses } from "./PenugasanController";

vi.mock("@/lib/auth", () => ({ requireRole: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/server/entities/Laporan", () => ({ getByStatus: vi.fn(), getRincian: vi.fn() }));
vi.mock("@/server/entities/Evaluasi", () => ({ getEvaluasiTerakhir: vi.fn() }));

// Entity dimock; client ini hanya menjadi parameter, tidak menghubungi Supabase.
const supabase = createSupabaseClient<Database>("https://laporkota-test.supabase.co", "sb_publishable_unit_test", {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

const PESAN_TANPA_AKSES = "Anda tidak memiliki akses ke daftar tugas Eksekutor Lapangan.";
const PESAN_GAGAL_LOAD = "Gagal memuat daftar tugas. Coba muat ulang halaman!";
const PESAN_KATEGORI_TAK_DIKENAL = "Kategori tidak dikenal. Pilih kategori dari daftar.";
const PESAN_TUGAS_TAK_ADA = "Tugas tidak ditemukan atau sudah tidak aktif. Muat ulang daftar tugas.";
const PESAN_GAGAL_RINCIAN = "Gagal memuat rincian tugas. Coba lagi!";

const errorDb = new PostgrestError({ code: "500", message: "x", details: "", hint: "" });
const respons = (data: unknown, error: PostgrestError | null = null) =>
  ({ data, error, count: null, status: error ? 500 : 200, statusText: error ? "Error" : "OK" }) as never;

function tugas(id_tiket: string, kategori: string, skor_prioritas: number, waktu_masuk: string) {
  return {
    id: `uuid-${id_tiket}`, id_tiket, kategori, deskripsi: `Deskripsi ${id_tiket}`,
    latitude: -6.9175, longitude: 107.6191, status: "dikerjakan", tahap: "menunggu_eksekusi",
    jumlah_upvote: 0, skor_prioritas, waktu_masuk,
  };
}

const daftar = [
  tugas("LK-0001", "jalan_berlubang", 5, "2026-11-01T08:00:00Z"),
  tugas("LK-0002", "lampu_jalan_mati", 9, "2026-11-02T08:00:00Z"),
  tugas("LK-0003", "lampu_jalan_mati", 9, "2026-11-01T09:00:00Z"),
];

const rincian = {
  ...tugas("LK-0007", "trotoar_rusak", 3, "2026-11-05T08:00:00Z"),
  waktu_selesai: null, alasan_penolakan: null, pelapor: null,
  foto: [{ path: "laporan/warga-uji/foto.jpg" }], video: [], riwayat: [],
};

const idTiket = (hasil: { ok: boolean; data?: { id_tiket: string }[] }) => hasil.data?.map((t) => t.id_tiket);

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(requireRole).mockResolvedValue(ok({ id: "eksekutor-uji", nama: "Eksekutor Uji", role: "eksekutor" }));
  vi.mocked(createClient).mockResolvedValue(supabase);
  vi.mocked(getByStatus).mockResolvedValue(respons(daftar));
  vi.mocked(getRincian).mockResolvedValue(respons(rincian));
  vi.mocked(getEvaluasiTerakhir).mockResolvedValue(respons(null));
});

describe("PenugasanController.verifikasiAkses", () => {
  it("C19-UT01 verifikasiAkses (normal): sesi eksekutor -> true", async () => {
    expect(await verifikasiAkses()).toBe(true);
    expect(requireRole).toHaveBeenCalledWith("eksekutor");
  });

  it("C19-UT02 verifikasiAkses (negatif): sesi ditolak -> false", async () => {
    vi.mocked(requireRole).mockResolvedValue(gagal("Anda tidak memiliki akses ke fitur ini."));
    expect(await verifikasiAkses()).toBe(false);
  });
});

describe("PenugasanController.doSorting", () => {
  it("C19-UT03 doSorting (normal): memuat tugas aktif lalu urut prioritas", async () => {
    const hasil = await doSorting();
    expect(getByStatus).toHaveBeenCalledWith(supabase, "dikerjakan", "menunggu_eksekusi");
    expect(idTiket(hasil)).toEqual(["LK-0003", "LK-0002", "LK-0001"]);
  });

  it("C19-UT04 doSorting (batas): tanpa tugas -> [] (UC03 Alt 2)", async () => {
    vi.mocked(getByStatus).mockResolvedValue(respons([]));
    expect(await doSorting()).toEqual(ok([]));
  });

  it("C19-UT05 doSorting (negatif): akses ditolak, basis data tidak dibaca", async () => {
    vi.mocked(requireRole).mockResolvedValue(gagal("Anda tidak memiliki akses ke fitur ini."));
    expect(await doSorting()).toEqual(gagal(PESAN_TANPA_AKSES));
    expect(getByStatus).not.toHaveBeenCalled();
  });

  it("C19-UT06 doSorting (negatif): error basis data -> pesan gagal memuat", async () => {
    vi.mocked(getByStatus).mockResolvedValue(respons(null, errorDb));
    expect(await doSorting()).toEqual(gagal(PESAN_GAGAL_LOAD));
  });
});

describe("PenugasanController.doFilter", () => {
  it("C19-UT07 doFilter (normal): hanya kategori terpilih, terurut (UC03 Alt 1)", async () => {
    expect(idTiket(await doFilter("lampu_jalan_mati"))).toEqual(["LK-0003", "LK-0002"]);
  });

  it.each(["semua", "", "Lampu jalan mati", "x' or '1'='1"])("C19-UT08 doFilter (negatif): menolak kategori %j tanpa query", async (kategori) => {
    expect(await doFilter(kategori)).toEqual(gagal(PESAN_KATEGORI_TAK_DIKENAL));
    expect(getByStatus).not.toHaveBeenCalled();
  });

  it("C19-UT09 doFilter (negatif): error basis data -> pesan gagal memuat", async () => {
    vi.mocked(getByStatus).mockResolvedValue(respons(null, errorDb));
    expect(await doFilter("jalan_berlubang")).toEqual(gagal(PESAN_GAGAL_LOAD));
  });
});

describe("PenugasanController.bukaLaporan", () => {
  const harapan = (evaluasiTerakhir: unknown) =>
    ok({
      id: rincian.id, id_tiket: rincian.id_tiket, kategori: rincian.kategori, deskripsi: rincian.deskripsi,
      latitude: rincian.latitude, longitude: rincian.longitude, jumlah_upvote: rincian.jumlah_upvote,
      skor_prioritas: rincian.skor_prioritas, waktu_masuk: rincian.waktu_masuk, status: rincian.status,
      tahap: rincian.tahap, foto: rincian.foto, video: rincian.video, evaluasiTerakhir,
    });

  it("C19-UT10 bukaLaporan (normal): tugas aktif tanpa evaluasi", async () => {
    expect(await bukaLaporan("LK-0007")).toEqual(harapan(null));
    expect(getRincian).toHaveBeenCalledWith(supabase, "LK-0007");
    expect(getEvaluasiTerakhir).toHaveBeenCalledWith(supabase, rincian.id);
  });

  it("C19-UT11 bukaLaporan (normal): tugas revisi membawa catatan evaluasi terakhir", async () => {
    const evaluasi = { keputusan: "minta_ulang_bukti", catatan: "Foto buram.", waktu_evaluasi: "2026-11-06T08:00:00Z" };
    vi.mocked(getEvaluasiTerakhir).mockResolvedValue(respons(evaluasi));
    expect(await bukaLaporan("LK-0007")).toEqual(harapan(evaluasi));
  });

  it.each([
    ["tiket tidak ada", null],
    ["sudah dikirim (menunggu_evaluasi)", { ...rincian, tahap: "menunggu_evaluasi" }],
    ["sudah berhasil", { ...rincian, status: "berhasil", tahap: null }],
  ])("C19-UT12 bukaLaporan (negatif): %s ditolak tanpa membaca evaluasi", async (_nama, data) => {
    vi.mocked(getRincian).mockResolvedValue(respons(data));
    expect(await bukaLaporan("LK-0007")).toEqual(gagal(PESAN_TUGAS_TAK_ADA));
    expect(getEvaluasiTerakhir).not.toHaveBeenCalled();
  });

  it("C19-UT13 bukaLaporan (negatif): error membaca rincian", async () => {
    vi.mocked(getRincian).mockResolvedValue(respons(null, errorDb));
    expect(await bukaLaporan("LK-0007")).toEqual(gagal(PESAN_GAGAL_RINCIAN));
  });

  it("C19-UT14 bukaLaporan (negatif): error membaca evaluasi terakhir", async () => {
    vi.mocked(getEvaluasiTerakhir).mockResolvedValue(respons(null, errorDb));
    expect(await bukaLaporan("LK-0007")).toEqual(gagal(PESAN_GAGAL_RINCIAN));
  });

  it("C19-UT15 bukaLaporan (negatif): akses ditolak", async () => {
    vi.mocked(requireRole).mockResolvedValue(gagal("Silakan masuk terlebih dahulu."));
    expect(await bukaLaporan("LK-0007")).toEqual(gagal(PESAN_TANPA_AKSES));
    expect(createClient).not.toHaveBeenCalled();
  });
});
