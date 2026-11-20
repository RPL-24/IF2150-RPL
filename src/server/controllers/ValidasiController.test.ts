import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { gagal, ok } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import * as LaporanEntity from "@/server/entities/Laporan";
import type { LaporanAntrean, LaporanRincian } from "./ValidasiController";
import {
  ambilRincianLaporan,
  saringAntrean,
  setujuiLaporan,
  susunAntrean,
  tolakLaporan,
} from "./ValidasiController";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth", () => ({ requireRole: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const contohAntrean: LaporanAntrean[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    id_tiket: "LK-0001",
    kategori: "jalan_berlubang",
    deskripsi: "Lubang besar di persimpangan.",
    latitude: -6.9175,
    longitude: 107.6191,
    status: "diterima",
    tahap: null,
    jumlah_upvote: 2,
    skor_prioritas: 20,
    waktu_masuk: "2026-11-08T01:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    id_tiket: "LK-0002",
    kategori: "lampu_jalan_mati",
    deskripsi: "Lampu jalan padam sepanjang trotoar.",
    latitude: -6.918,
    longitude: 107.62,
    status: "diterima",
    tahap: null,
    jumlah_upvote: 5,
    skor_prioritas: 50,
    waktu_masuk: "2026-11-09T05:00:00Z",
  },
];

const contohRincian: LaporanRincian = {
  ...contohAntrean[0],
  alasan_penolakan: null,
  waktu_selesai: null,
  pelapor: { nama: "Warga Satu" },
  foto: [{ path: "laporan/warga-1/foto.jpg" }],
  video: [],
  riwayat: [{ status: "diterima", tahap: null, catatan: null, waktu: "2026-11-08T01:00:00Z" }],
};

const mockSelectUpdate = vi.fn();
const mockEqStatus = vi.fn(() => ({ select: mockSelectUpdate }));
const mockEqTiket = vi.fn(() => ({ eq: mockEqStatus }));
const mockUpdate = vi.fn(() => ({ eq: mockEqTiket }));
const mockFrom = vi.fn(() => ({ update: mockUpdate }));

const mockSupabase = { from: mockFrom } as unknown as Awaited<ReturnType<typeof createClient>>;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireRole).mockResolvedValue(
    ok({ id: "admin-1", nama: "Admin Kota", role: "admin" }),
  );
  vi.mocked(createClient).mockResolvedValue(mockSupabase);
  mockSelectUpdate.mockResolvedValue({ data: [{ id: contohAntrean[0].id }], error: null });
});

describe("ValidasiController - Verifikasi Akses", () => {
  it("menolak akses pada seluruh operasi jika pengguna bukan admin", async () => {
    const ditolak = gagal("Anda tidak memiliki akses ke fitur ini.");
    vi.mocked(requireRole).mockResolvedValue(ditolak);

    expect(await susunAntrean()).toEqual(ditolak);
    expect(await saringAntrean("semua")).toEqual(ditolak);
    expect(await ambilRincianLaporan("LK-0001")).toEqual(ditolak);
    expect(await setujuiLaporan("LK-0001")).toEqual(ditolak);
    expect(await tolakLaporan("LK-0001", "Duplikat")).toEqual(ditolak);

    expect(requireRole).toHaveBeenCalledWith("admin");
    expect(createClient).not.toHaveBeenCalled();
  });
});

describe("ValidasiController.susunAntrean & saringAntrean", () => {
  beforeEach(() => {
    vi.spyOn(LaporanEntity, "getByStatus").mockResolvedValue({
      data: contohAntrean,
      error: null,
      count: null,
      status: 200,
      statusText: "OK",
    } as unknown as Awaited<ReturnType<typeof LaporanEntity.getByStatus>>);
  });

  it("mengambil antrean berstatus diterima terurut terbaru dulu secara default (ascending = false)", async () => {
    const hasil = await susunAntrean();

    expect(LaporanEntity.getByStatus).toHaveBeenCalledWith(mockSupabase, "diterima");
    expect(hasil.ok).toBe(true);
    if (hasil.ok) {
      expect(hasil.data.map((l) => l.id_tiket)).toEqual(["LK-0002", "LK-0001"]);
    }
  });

  it("mengurutkan antrean dari terlama saat ascending = true", async () => {
    const hasil = await susunAntrean(true);

    expect(hasil.ok).toBe(true);
    if (hasil.ok) {
      expect(hasil.data.map((l) => l.id_tiket)).toEqual(["LK-0001", "LK-0002"]);
    }
  });

  it("mengembalikan seluruh antrean saat kategori bernilai 'semua' atau kosong", async () => {
    const hasilSemua = await saringAntrean("semua");
    const hasilKosong = await saringAntrean("   ");

    expect(hasilSemua.ok && hasilSemua.data).toHaveLength(2);
    expect(hasilKosong.ok && hasilKosong.data).toHaveLength(2);
  });

  it("memfilter antrean berdasarkan kategori kerusakan yang valid", async () => {
    const hasil = await saringAntrean("jalan_berlubang");

    expect(hasil.ok).toBe(true);
    if (hasil.ok) {
      expect(hasil.data).toHaveLength(1);
      expect(hasil.data[0].id_tiket).toBe("LK-0001");
    }
  });

  it("menolak kategori yang tidak valid", async () => {
    expect(await saringAntrean("kategori_palsu")).toEqual(gagal("Kategori tidak valid."));
  });
});

describe("ValidasiController.ambilRincianLaporan", () => {
  it("mengambil rincian laporan ketika ID tiket ditemukan", async () => {
    vi.spyOn(LaporanEntity, "getRincian").mockResolvedValue({
      data: contohRincian,
      error: null,
      count: null,
      status: 200,
      statusText: "OK",
    } as unknown as Awaited<ReturnType<typeof LaporanEntity.getRincian>>);

    const hasil = await ambilRincianLaporan("LK-0001");

    expect(LaporanEntity.getRincian).toHaveBeenCalledWith(mockSupabase, "LK-0001");
    expect(hasil).toEqual(ok(contohRincian));
  });
});

describe("ValidasiController.setujuiLaporan", () => {
  it("memperbarui status menjadi dikerjakan/menunggu_eksekusi tanpa menghitung prioritas manual", async () => {
    const spyPrioritas = vi.spyOn(LaporanEntity, "urutPrioritas");

    const hasil = await setujuiLaporan("LK-0001");

    expect(hasil).toEqual(ok(undefined));
    expect(mockFrom).toHaveBeenCalledWith("laporan");
    expect(mockUpdate).toHaveBeenCalledWith({
      status: "dikerjakan",
      tahap: "menunggu_eksekusi",
    });
    expect(mockEqTiket).toHaveBeenCalledWith("id_tiket", "LK-0001");
    expect(mockEqStatus).toHaveBeenCalledWith("status", "diterima");
    expect(spyPrioritas).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/validasi");
  });
});

describe("ValidasiController.tolakLaporan", () => {
  it.each(["", "   ", "\n\t"])(
    "menolak jika alasan penolakan kosong atau hanya spasi (KF11): %j",
    async (alasanKosong) => {
      const hasil = await tolakLaporan("LK-0001", alasanKosong);

      expect(hasil).toEqual(gagal("Alasan penolakan wajib diisi."));
      expect(mockUpdate).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    },
  );

  it("berhasil menolak laporan dengan alasan valid dan memanggil revalidatePath", async () => {
    const hasil = await tolakLaporan("LK-0001", "  Foto bukti tidak menunjukkan kerusakan jalan.  ");

    expect(hasil).toEqual(ok(undefined));
    expect(mockFrom).toHaveBeenCalledWith("laporan");
    expect(mockUpdate).toHaveBeenCalledWith({
      status: "ditolak",
      alasan_penolakan: "Foto bukti tidak menunjukkan kerusakan jalan.",
    });
    expect(mockEqTiket).toHaveBeenCalledWith("id_tiket", "LK-0001");
    expect(mockEqStatus).toHaveBeenCalledWith("status", "diterima");
    expect(revalidatePath).toHaveBeenCalledWith("/validasi");
  });
});
