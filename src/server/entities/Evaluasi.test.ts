import type { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/types/database";
import {
  ambilDaftarSiapEvaluasi,
  ambilDetailEvaluasi,
  cariIdLaporan,
  getEvaluasiTerakhir,
  simpanEvaluasi,
  type DataEvaluasiBaru,
} from "./Evaluasi";

const laporan = {
  id: "laporan-1",
  id_tiket: "LK-0001",
  kategori: "jalan_berlubang",
  waktu_masuk: "2026-11-08T01:00:00Z",
} as const;

const rincianLaporan = {
  ...laporan,
  deskripsi: "Lubang di persimpangan.",
  latitude: -6.9175,
  longitude: 107.6191,
  status: "dikerjakan",
  tahap: "menunggu_evaluasi",
  foto: [{ path: "laporan/warga-1/lubang.jpg" }],
  video: [],
} as const;

const bukti = {
  id_hasil: "hasil-2",
  catatan: "Lubang sudah ditambal.",
  waktu_unggah: "2026-11-10T01:00:00Z",
  foto: [{ path: "hasil/petugas-1/tambalan.jpg" }],
  video: [{ path: "hasil/petugas-1/tambalan.mp4" }],
};

const eksekutor = { nama: "Petugas Kota" };
const pelapor = { nama: "Warga Satu" };
const errorDb = { code: "42501", message: "permission denied", details: "", hint: "" };

const query = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn(),
  single: vi.fn(),
};
const from = vi.fn(() => query);
const supabase = { from } as unknown as SupabaseClient<Database>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Evaluasi.ambilDaftarSiapEvaluasi", () => {
  it("memilih bukti terbaru dan melewati laporan yang belum memiliki bukti", async () => {
    const terbaru = { id_hasil: bukti.id_hasil, waktu_unggah: bukti.waktu_unggah, eksekutor };
    const lama = { ...terbaru, id_hasil: "hasil-1", waktu_unggah: "2026-11-09T01:00:00Z" };
    query.order.mockReturnValueOnce(query).mockResolvedValueOnce({
      data: [
        { ...laporan, hasil: [terbaru, lama] },
        { ...laporan, id: "laporan-2", id_tiket: "LK-0002", hasil: [] },
        {
          ...laporan,
          id: "laporan-3",
          id_tiket: "LK-0003",
          hasil: [{ ...terbaru, id_hasil: "hasil-3", eksekutor: null }],
        },
      ],
      error: null,
    });

    expect(await ambilDaftarSiapEvaluasi(supabase)).toEqual({
      data: [
        { ...laporan, id_hasil: bukti.id_hasil, waktu_unggah: bukti.waktu_unggah, nama_eksekutor: eksekutor.nama },
        {
          ...laporan,
          id: "laporan-3",
          id_tiket: "LK-0003",
          id_hasil: "hasil-3",
          waktu_unggah: bukti.waktu_unggah,
          nama_eksekutor: null,
        },
      ],
      error: null,
    });
    expect(from).toHaveBeenCalledWith("laporan");
    expect(query.eq).toHaveBeenNthCalledWith(1, "status", "dikerjakan");
    expect(query.eq).toHaveBeenNthCalledWith(2, "tahap", "menunggu_evaluasi");
    expect(query.order).toHaveBeenNthCalledWith(1, "waktu_masuk", { ascending: false });
    expect(query.order).toHaveBeenNthCalledWith(2, "waktu_unggah", { referencedTable: "hasil", ascending: false });
  });

  it("mengembalikan daftar kosong jika query tidak menemukan laporan", async () => {
    query.order.mockReturnValueOnce(query).mockResolvedValueOnce({ data: [], error: null });

    expect(await ambilDaftarSiapEvaluasi(supabase)).toEqual({ data: [], error: null });
  });

  it("meneruskan error database", async () => {
    query.order.mockReturnValueOnce(query).mockResolvedValueOnce({ data: null, error: errorDb });

    expect(await ambilDaftarSiapEvaluasi(supabase)).toEqual({ data: null, error: errorDb });
  });
});

describe("Evaluasi.ambilDetailEvaluasi", () => {
  it("memetakan laporan, pelapor, dan bukti terbaru beserta medianya", async () => {
    query.maybeSingle.mockResolvedValueOnce({
      data: { ...rincianLaporan, pelapor, hasil: [{ ...bukti, eksekutor }] },
      error: null,
    });

    expect(await ambilDetailEvaluasi(supabase, laporan.id_tiket)).toEqual({
      data: {
        laporan: { ...rincianLaporan, nama_pelapor: pelapor.nama },
        hasilPerbaikan: { ...bukti, nama_eksekutor: eksekutor.nama },
      },
      error: null,
    });
    expect(from).toHaveBeenCalledWith("laporan");
    expect(query.eq).toHaveBeenCalledWith("id_tiket", laporan.id_tiket);
    expect(query.order).toHaveBeenCalledWith("waktu_unggah", { referencedTable: "hasil", ascending: false });
    expect(query.limit).toHaveBeenCalledWith(1, { referencedTable: "hasil" });
  });

  it("mengembalikan nilai null untuk profil pelapor dan bukti yang belum tersedia", async () => {
    query.maybeSingle.mockResolvedValueOnce({
      data: { ...rincianLaporan, pelapor: null, hasil: [] },
      error: null,
    });

    expect(await ambilDetailEvaluasi(supabase, laporan.id_tiket)).toEqual({
      data: {
        laporan: { ...rincianLaporan, nama_pelapor: null },
        hasilPerbaikan: null,
      },
      error: null,
    });
  });

  it("mempertahankan bukti jika profil eksekutor tidak tersedia", async () => {
    query.maybeSingle.mockResolvedValueOnce({
      data: { ...rincianLaporan, pelapor, hasil: [{ ...bukti, eksekutor: null }] },
      error: null,
    });

    expect(await ambilDetailEvaluasi(supabase, laporan.id_tiket)).toEqual({
      data: {
        laporan: { ...rincianLaporan, nama_pelapor: pelapor.nama },
        hasilPerbaikan: { ...bukti, nama_eksekutor: null },
      },
      error: null,
    });
  });

  it.each([
    { kondisi: "tiket tidak ditemukan", error: null },
    { kondisi: "database menolak query", error: errorDb },
  ])("mengembalikan data null ketika $kondisi", async ({ error }) => {
    query.maybeSingle.mockResolvedValueOnce({ data: null, error });

    expect(await ambilDetailEvaluasi(supabase, "LK-9999")).toEqual({ data: null, error });
  });
});

describe("Evaluasi.cariIdLaporan", () => {
  it.each([
    { kondisi: "tiket ditemukan", data: { id: laporan.id }, error: null, id: laporan.id },
    { kondisi: "tiket tidak ditemukan", data: null, error: null, id: null },
    { kondisi: "database menolak query", data: null, error: errorDb, id: null },
  ])("mengembalikan hasil pencarian ketika $kondisi", async ({ data, error, id }) => {
    query.maybeSingle.mockResolvedValueOnce({ data, error });

    expect(await cariIdLaporan(supabase, laporan.id_tiket)).toEqual({ data: id, error });
    expect(from).toHaveBeenCalledWith("laporan");
    expect(query.select).toHaveBeenCalledWith("id");
    expect(query.eq).toHaveBeenCalledWith("id_tiket", laporan.id_tiket);
  });
});

describe("Evaluasi.simpanEvaluasi", () => {
  const dataEvaluasi: DataEvaluasiBaru = {
    id_laporan: laporan.id,
    id_hasil: bukti.id_hasil,
    id_admin: "admin-1",
    keputusan: "belum_selesai",
    catatan: "Tambalan belum rata.",
  };

  it.each<{ kondisi: string; input: DataEvaluasiBaru; error: typeof errorDb | null }>([
    { kondisi: "keputusan dengan catatan", input: dataEvaluasi, error: null },
    {
      kondisi: "keputusan selesai dengan catatan null",
      input: { ...dataEvaluasi, keputusan: "selesai", catatan: null },
      error: null,
    },
    { kondisi: "insert ditolak database", input: dataEvaluasi, error: errorDb },
  ])("meneruskan hasil insert untuk $kondisi", async ({ input, error }) => {
    const respons = { data: error ? null : { id_evaluasi: "evaluasi-1" }, error };
    query.single.mockResolvedValueOnce(respons);

    expect(await simpanEvaluasi(supabase, input)).toEqual(respons);
    expect(from).toHaveBeenCalledWith("evaluasi");
    expect(query.insert).toHaveBeenCalledWith(input);
    expect(query.select).toHaveBeenCalledWith("id_evaluasi");
  });
});

describe("Evaluasi.getEvaluasiTerakhir", () => {
  it.each([
    {
      kondisi: "evaluasi tersedia",
      data: { keputusan: "belum_selesai", catatan: "Tambalan belum rata.", waktu_evaluasi: "2026-11-11T01:00:00Z" },
      error: null,
    },
    { kondisi: "belum ada evaluasi", data: null, error: null },
    { kondisi: "database menolak query", data: null, error: errorDb },
  ])("mengembalikan hasil query ketika $kondisi", async ({ data, error }) => {
    query.maybeSingle.mockResolvedValueOnce({ data, error });

    expect(await getEvaluasiTerakhir(supabase, laporan.id)).toEqual({ data, error });
    expect(from).toHaveBeenCalledWith("evaluasi");
    expect(query.select).toHaveBeenCalledWith("keputusan, catatan, waktu_evaluasi");
    expect(query.eq).toHaveBeenCalledWith("id_laporan", laporan.id);
    expect(query.order).toHaveBeenCalledWith("waktu_evaluasi", { ascending: false });
    expect(query.limit).toHaveBeenCalledWith(1);
  });
});
