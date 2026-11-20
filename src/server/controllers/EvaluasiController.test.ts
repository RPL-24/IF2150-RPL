import { PostgrestError } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { gagal, ok } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import * as Evaluasi from "@/server/entities/Evaluasi";
import type { Enums } from "@/types/database";
import {
  ambilDaftarUntukEvaluasi,
  ambilDetailEvaluasi,
  simpanKeputusan,
} from "./EvaluasiController";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth", () => ({ requireRole: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const ID_LAPORAN = "00000000-0000-0000-0000-000000000010";
const ID_HASIL = "00000000-0000-0000-0000-000000000020";
const ID_ADMIN = "00000000-0000-0000-0000-000000000099";

const itemEvaluasi: Evaluasi.ItemSiapEvaluasi = {
  id: ID_LAPORAN,
  id_tiket: "LK-0010",
  kategori: "jalan_berlubang",
  waktu_masuk: "2026-11-08T01:00:00Z",
  id_hasil: ID_HASIL,
  waktu_unggah: "2026-11-09T01:00:00Z",
  nama_eksekutor: "Petugas Kota",
};

const detailEvaluasi: Evaluasi.DetailEvaluasi = {
  laporan: {
    id: ID_LAPORAN,
    id_tiket: itemEvaluasi.id_tiket,
    kategori: itemEvaluasi.kategori,
    waktu_masuk: itemEvaluasi.waktu_masuk,
    deskripsi: "Lubang di persimpangan.",
    latitude: -6.9175,
    longitude: 107.6191,
    status: "dikerjakan",
    tahap: "menunggu_evaluasi",
    nama_pelapor: "Warga Satu",
    foto: [{ path: "laporan/warga-1/lubang.jpg" }],
    video: [],
  },
  hasilPerbaikan: {
    id_hasil: ID_HASIL,
    catatan: "Lubang sudah ditambal.",
    waktu_unggah: itemEvaluasi.waktu_unggah,
    nama_eksekutor: itemEvaluasi.nama_eksekutor,
    foto: [{ path: "hasil/petugas-1/tambalan.jpg" }],
    video: [],
  },
};

const errorDb = new PostgrestError({ code: "42501", message: "permission denied", details: "", hint: "" });
const pesanAksesDb = "Anda tidak memiliki akses untuk tindakan ini.";

const mockSingleInsertEvaluasi = vi.fn();
const mockSelectInsertEvaluasi = vi.fn(() => ({ single: mockSingleInsertEvaluasi }));
const mockInsertEvaluasi = vi.fn(() => ({ select: mockSelectInsertEvaluasi }));
const mockUpdateLaporan = vi.fn();
const mockMaybeSingleLaporan = vi.fn();

const mockFrom = vi.fn((tabel: string) => {
  if (tabel === "evaluasi") {
    return { insert: mockInsertEvaluasi };
  }
  if (tabel === "laporan") {
    return {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle: mockMaybeSingleLaporan })),
      })),
      update: mockUpdateLaporan,
    };
  }
  return {};
});

const mockSupabase = { from: mockFrom } as unknown as Awaited<ReturnType<typeof createClient>>;

beforeEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.mocked(requireRole).mockResolvedValue(
    ok({ id: ID_ADMIN, nama: "Admin Kota", role: "admin" }),
  );
  vi.mocked(createClient).mockResolvedValue(mockSupabase);
  mockMaybeSingleLaporan.mockResolvedValue({ data: { id: ID_LAPORAN }, error: null });
  mockSingleInsertEvaluasi.mockResolvedValue({
    data: { id_evaluasi: "00000000-0000-0000-0000-000000000030" },
    error: null,
  });
});

describe("EvaluasiController - Verifikasi Akses", () => {
  it("menolak akses jika pengguna bukan admin", async () => {
    const ditolak = gagal("Anda tidak memiliki akses ke fitur ini.");
    vi.mocked(requireRole).mockResolvedValue(ditolak);

    expect(await ambilDaftarUntukEvaluasi()).toEqual(ditolak);
    expect(await ambilDetailEvaluasi("LK-0010")).toEqual(ditolak);
    expect(await simpanKeputusan("LK-0010", ID_HASIL, "selesai")).toEqual(ditolak);

    expect(requireRole).toHaveBeenCalledWith("admin");
    expect(createClient).not.toHaveBeenCalled();
  });
});

describe("EvaluasiController.ambilDaftarUntukEvaluasi", () => {
  it("mengembalikan daftar laporan yang siap dievaluasi", async () => {
    const ambilDaftar = vi.spyOn(Evaluasi, "ambilDaftarSiapEvaluasi")
      .mockResolvedValue({ data: [itemEvaluasi], error: null });

    expect(await ambilDaftarUntukEvaluasi()).toEqual(ok([itemEvaluasi]));
    expect(ambilDaftar).toHaveBeenCalledWith(mockSupabase);
  });

  it("mengembalikan daftar kosong jika belum ada laporan yang siap dievaluasi", async () => {
    vi.spyOn(Evaluasi, "ambilDaftarSiapEvaluasi").mockResolvedValue({ data: [], error: null });

    expect(await ambilDaftarUntukEvaluasi()).toEqual(ok([]));
  });

  it("menerjemahkan error database saat mengambil daftar", async () => {
    vi.spyOn(Evaluasi, "ambilDaftarSiapEvaluasi").mockResolvedValue({ data: null, error: errorDb });

    expect(await ambilDaftarUntukEvaluasi()).toEqual(gagal(pesanAksesDb));
  });
});

describe("EvaluasiController.ambilDetailEvaluasi", () => {
  it.each(["LK-0010", "  LK-0010  "])("mengambil detail untuk tiket %j", async (idTiket) => {
    const ambilDetail = vi.spyOn(Evaluasi, "ambilDetailEvaluasi")
      .mockResolvedValue({ data: detailEvaluasi, error: null });

    expect(await ambilDetailEvaluasi(idTiket)).toEqual(ok(detailEvaluasi));
    expect(ambilDetail).toHaveBeenCalledWith(mockSupabase, "LK-0010");
  });

  it("menolak ID tiket yang hanya berisi spasi", async () => {
    expect(await ambilDetailEvaluasi("   ")).toEqual(gagal("ID tiket wajib diisi."));
    expect(createClient).not.toHaveBeenCalled();
  });

  it("mengembalikan pesan saat tiket tidak ditemukan", async () => {
    vi.spyOn(Evaluasi, "ambilDetailEvaluasi").mockResolvedValue({ data: null, error: null });

    expect(await ambilDetailEvaluasi("LK-9999")).toEqual(gagal("Laporan tidak ditemukan."));
  });

  it("menerjemahkan error database saat mengambil detail", async () => {
    vi.spyOn(Evaluasi, "ambilDetailEvaluasi").mockResolvedValue({ data: null, error: errorDb });

    expect(await ambilDetailEvaluasi("LK-0010")).toEqual(gagal(pesanAksesDb));
  });

  it.each<{ kondisi: string; data: Evaluasi.DetailEvaluasi }>([
    {
      kondisi: "laporan sudah berhasil",
      data: { ...detailEvaluasi, laporan: { ...detailEvaluasi.laporan, status: "berhasil", tahap: null } },
    },
    {
      kondisi: "laporan masih menunggu eksekusi",
      data: { ...detailEvaluasi, laporan: { ...detailEvaluasi.laporan, tahap: "menunggu_eksekusi" } },
    },
    {
      kondisi: "bukti perbaikan belum tersedia",
      data: { ...detailEvaluasi, hasilPerbaikan: null },
    },
  ])("menolak detail ketika $kondisi", async ({ data }) => {
    vi.spyOn(Evaluasi, "ambilDetailEvaluasi").mockResolvedValue({ data, error: null });

    expect(await ambilDetailEvaluasi("LK-0010")).toEqual(gagal("Laporan ini tidak sedang menunggu evaluasi."));
  });
});

describe("EvaluasiController.simpanKeputusan", () => {
  it.each([
    ["   ", ID_HASIL],
    ["LK-0010", "   "],
  ])("menolak jika salah satu ID kosong (%j, %j)", async (idTiket, idHasil) => {
    expect(await simpanKeputusan(idTiket, idHasil, "selesai")).toEqual(gagal("Data evaluasi tidak lengkap."));
    expect(createClient).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("menolak keputusan di luar enum database", async () => {
    const keputusanInvalid = "ditunda" as Enums<"keputusan_evaluasi">;

    expect(await simpanKeputusan("LK-0010", ID_HASIL, keputusanInvalid))
      .toEqual(gagal("Keputusan evaluasi tidak valid."));
    expect(createClient).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it.each([
    { error: null, pesan: "Laporan tidak ditemukan." },
    { error: errorDb, pesan: pesanAksesDb },
  ])("menghentikan penyimpanan jika pencarian gagal: $pesan", async ({ error, pesan }) => {
    mockMaybeSingleLaporan.mockResolvedValueOnce({ data: null, error });

    expect(await simpanKeputusan("LK-0010", ID_HASIL, "selesai")).toEqual(gagal(pesan));
    expect(mockInsertEvaluasi).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("menerjemahkan error insert dan tidak merevalidasi halaman", async () => {
    mockSingleInsertEvaluasi.mockResolvedValueOnce({ data: null, error: errorDb });

    expect(await simpanKeputusan("LK-0010", ID_HASIL, "selesai")).toEqual(gagal(pesanAksesDb));
    expect(mockInsertEvaluasi).toHaveBeenCalledOnce();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it.each(["", "   ", undefined])(
    "wajib gagal jika keputusan 'belum_selesai' tanpa catatan (KF17): %j",
    async (catatanKosong) => {
      const hasil = await simpanKeputusan("LK-0010", ID_HASIL, "belum_selesai", catatanKosong);

      expect(hasil).toEqual(gagal("Catatan evaluasi wajib diisi untuk keputusan ini."));
      expect(mockInsertEvaluasi).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    },
  );

  it.each(["", "   ", undefined])(
    "wajib gagal jika keputusan 'minta_ulang_bukti' tanpa catatan: %j",
    async (catatanKosong) => {
      const hasil = await simpanKeputusan("LK-0010", ID_HASIL, "minta_ulang_bukti", catatanKosong);

      expect(hasil).toEqual(gagal("Catatan evaluasi wajib diisi untuk keputusan ini."));
      expect(mockInsertEvaluasi).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    },
  );

  it("berhasil jika keputusan 'selesai' meski catatan kosong", async () => {
    const hasil = await simpanKeputusan("LK-0010", ID_HASIL, "selesai", "   ");

    expect(hasil).toEqual(ok(undefined));
    expect(mockInsertEvaluasi).toHaveBeenCalledWith({
      id_laporan: ID_LAPORAN,
      id_hasil: ID_HASIL,
      id_admin: ID_ADMIN,
      keputusan: "selesai",
      catatan: null,
    });
    expect(mockUpdateLaporan).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/evaluasi");
  });

  it("melakukan INSERT ke tabel evaluasi tanpa meng-update tabel laporan secara langsung", async () => {
    const hasil = await simpanKeputusan(
      "LK-0010",
      ID_HASIL,
      "belum_selesai",
      "  Tambalan aspal masih belum rata di sisi timur.  ",
    );

    expect(hasil).toEqual(ok(undefined));
    expect(mockFrom).toHaveBeenCalledWith("evaluasi");
    expect(mockInsertEvaluasi).toHaveBeenCalledWith({
      id_laporan: ID_LAPORAN,
      id_hasil: ID_HASIL,
      id_admin: ID_ADMIN,
      keputusan: "belum_selesai",
      catatan: "Tambalan aspal masih belum rata di sisi timur.",
    });
    expect(mockUpdateLaporan).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/evaluasi");
  });
});
