import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { gagal, ok } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
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

describe("EvaluasiController.simpanKeputusan", () => {
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
