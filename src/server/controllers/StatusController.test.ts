import { createClient as createSupabaseClient, PostgrestError } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { gagal, ok } from "@/lib/action-result";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getDaftarPublik, getMilikSaya, getRincian } from "@/server/entities/Laporan";
import type { Database } from "@/types/database";
import { ambilDetailStatus, ambilLaporanPublik, ambilRiwayatWarga } from "./StatusController";

vi.mock("@/lib/auth", () => ({ requireRole: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/server/entities/Laporan", () => ({
  getMilikSaya: vi.fn(), getRincian: vi.fn(), getDaftarPublik: vi.fn(),
}));

// Entity dimock; client ini hanya menjadi parameter, tidak menghubungi Supabase.
const supabase = createSupabaseClient<Database>("https://laporkota-test.supabase.co", "sb_publishable_unit_test", {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

type Rincian = NonNullable<Awaited<ReturnType<typeof getRincian>>["data"]>;

const rincian: Rincian = {
  id: "00000000-0000-0000-0000-000000000001",
  id_tiket: "LK-0001",
  kategori: "jalan_berlubang",
  deskripsi: "Jalan berlubang di depan halte.",
  latitude: -6.9175,
  longitude: 107.6191,
  status: "ditolak",
  tahap: null,
  jumlah_upvote: 0,
  skor_prioritas: 0,
  waktu_masuk: "2026-11-08T01:00:00Z",
  waktu_selesai: null,
  alasan_penolakan: "Lokasi tidak termasuk jalan yang dikelola kota.",
  pelapor: { nama: "Warga Uji" },
  foto: [{ path: "laporan/warga-uji/foto.jpg" }],
  video: [{ path: "laporan/warga-uji/video.mp4" }],
  riwayat: [
    { status: "diterima", tahap: null, catatan: null, waktu: "2026-11-08T01:00:00Z" },
    { status: "ditolak", tahap: null, catatan: "Di luar kewenangan kota.", waktu: "2026-11-08T02:00:00Z" },
  ],
};

const responsRincian = {
  success: true, data: rincian, error: null, count: null, status: 200, statusText: "OK",
} satisfies Awaited<ReturnType<typeof getRincian>>;

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(requireRole).mockResolvedValue(ok({ id: "warga-uji", nama: "Warga Uji", role: "warga" }));
  vi.mocked(createClient).mockResolvedValue(supabase);
  vi.mocked(getRincian).mockResolvedValue(responsRincian);
});

describe("StatusController.ambilDetailStatus", () => {
  it.each([
    "Silakan masuk terlebih dahulu.",
    "Anda tidak memiliki akses ke fitur ini.",
  ])("menghentikan pembacaan saat akses ditolak: %s", async (pesan) => {
    vi.mocked(requireRole).mockResolvedValue(gagal(pesan));

    expect(await ambilDetailStatus("LK-0001")).toEqual(gagal(pesan));
    expect(requireRole).toHaveBeenCalledWith("warga");
    expect(createClient).not.toHaveBeenCalled();
    expect(getRincian).not.toHaveBeenCalled();
  });

  it.each(["", "LK-123", "lk-0001", "LK-0001' OR '1'='1", `LK-${"9".repeat(20)}`])(
    "menolak ID tiket tidak valid tanpa query: %s", async (idTiket) => {
      expect(await ambilDetailStatus(idTiket)).toEqual(gagal("Format ID tiket tidak valid."));
      expect(getRincian).not.toHaveBeenCalled();
    },
  );

  it("menolak input non-string dari pemanggil action", async () => {
    expect(await ambilDetailStatus(null as unknown as string)).toEqual(gagal("Format ID tiket tidak valid."));
    expect(getRincian).not.toHaveBeenCalled();
  });

  it.each(["LK-0001", "LK-10000", "LK-9223372036854775807"])(
    "menerima format tiket dari sequence: %s", async (idTiket) => {
      vi.mocked(getRincian).mockResolvedValue({ ...responsRincian, data: { ...rincian, id_tiket: idTiket } });

      const hasil = await ambilDetailStatus(idTiket);

      expect(requireRole).toHaveBeenCalledWith("warga");
      expect(getRincian).toHaveBeenCalledWith(supabase, idTiket);
      expect(hasil.ok && hasil.data.id_tiket).toBe(idTiket);
    },
  );

  it("mengirim detail, media dan linimasa tanpa profil pelapor atau kolom internal", async () => {
    const hasil = await ambilDetailStatus("LK-0001");

    expect(hasil).toEqual(ok({
      id_tiket: rincian.id_tiket,
      kategori: rincian.kategori,
      deskripsi: rincian.deskripsi,
      waktu_masuk: rincian.waktu_masuk,
      status: rincian.status,
      tahap: rincian.tahap,
      alasan_penolakan: rincian.alasan_penolakan,
      foto: rincian.foto,
      video: rincian.video,
      riwayat: rincian.riwayat,
    }));
    expect(hasil.ok && hasil.data).not.toHaveProperty("pelapor");
    expect(hasil.ok && hasil.data).not.toHaveProperty("skor_prioritas");
  });

  it("memberi pesan yang sama saat tiket tidak ada atau tidak terlihat karena RLS", async () => {
    vi.mocked(getRincian).mockResolvedValue({ ...responsRincian, data: null });

    expect(await ambilDetailStatus("LK-0001")).toEqual(gagal("Tiket tidak ditemukan atau tidak dapat diakses."));
  });

  it("tetap menampilkan detail tanpa media atau linimasa", async () => {
    vi.mocked(getRincian).mockResolvedValue({
      ...responsRincian, data: { ...rincian, foto: [], video: [], riwayat: [] },
    });

    const hasil = await ambilDetailStatus("LK-0001");

    expect(hasil.ok).toBe(true);
    if (hasil.ok) {
      expect(hasil.data.foto).toEqual([]);
      expect(hasil.data.video).toEqual([]);
      expect(hasil.data.riwayat).toEqual([]);
    }
  });

  it("mempertahankan linimasa dari entity termasuk perubahan tahap yang berulang", async () => {
    const riwayat: Rincian["riwayat"] = [
      { status: "diterima", tahap: null, catatan: null, waktu: "2026-11-08T01:00:00Z" },
      { status: "dikerjakan", tahap: "menunggu_eksekusi", catatan: null, waktu: "2026-11-08T02:00:00Z" },
      { status: "dikerjakan", tahap: "menunggu_evaluasi", catatan: null, waktu: "2026-11-08T03:00:00Z" },
      { status: "dikerjakan", tahap: "menunggu_eksekusi", catatan: "Perbaikan perlu diulang.", waktu: "2026-11-08T04:00:00Z" },
    ];
    vi.mocked(getRincian).mockResolvedValue({
      ...responsRincian,
      data: { ...rincian, status: "dikerjakan", tahap: "menunggu_eksekusi", alasan_penolakan: null, riwayat },
    });

    const hasil = await ambilDetailStatus("LK-0001");

    expect(hasil.ok && hasil.data.riwayat).toEqual(riwayat);
  });

  it("merapikan alasan penolakan dari admin", async () => {
    vi.mocked(getRincian).mockResolvedValue({
      ...responsRincian, data: { ...rincian, alasan_penolakan: "  Di luar kewenangan kota.  " },
    });

    const hasil = await ambilDetailStatus("LK-0001");

    expect(hasil.ok && hasil.data.alasan_penolakan).toBe("Di luar kewenangan kota.");
  });

  it("menandai alasan penolakan kosong agar View dapat memberi pesan yang jelas", async () => {
    vi.mocked(getRincian).mockResolvedValue({
      ...responsRincian, data: { ...rincian, alasan_penolakan: "   " },
    });

    const hasil = await ambilDetailStatus("LK-0001");

    expect(hasil.ok && hasil.data.alasan_penolakan).toBeNull();
  });

  it.each(["diterima", "dikerjakan", "berhasil"] as const)(
    "tidak mengirim alasan penolakan untuk status %s", async (status) => {
      vi.mocked(getRincian).mockResolvedValue({ ...responsRincian, data: { ...rincian, status } });

      const hasil = await ambilDetailStatus("LK-0001");

      expect(hasil.ok && hasil.data.alasan_penolakan).toBeNull();
    },
  );

  it("tidak menganggap foto laporan awal sebagai foto hasil saat pembacaan bukti belum tersambung", async () => {
    vi.mocked(getRincian).mockResolvedValue({ ...responsRincian, data: { ...rincian, status: "berhasil" } });

    const hasil = await ambilDetailStatus("LK-0001");

    expect(hasil.ok).toBe(true);
    if (hasil.ok) {
      expect(hasil.data.foto).toEqual(rincian.foto);
      expect(hasil.data.hasilPerbaikan).toBeUndefined();
    }
  });

  it("menyembunyikan pesan mentah kegagalan database", async () => {
    vi.mocked(getRincian).mockResolvedValue({
      success: false,
      data: null,
      error: new PostgrestError({ code: "42703", message: "Internal database details", details: "", hint: "" }),
      count: null, status: 400, statusText: "Bad Request",
    });

    expect(await ambilDetailStatus("LK-0001")).toEqual(gagal("Terjadi kesalahan. Coba lagi beberapa saat lagi."));
  });

  it("mengubah exception koneksi menjadi ActionResult gagal", async () => {
    vi.mocked(getRincian).mockRejectedValue(new Error("Internal connection details"));

    expect(await ambilDetailStatus("LK-0001")).toEqual(gagal("Gagal memuat detail tiket. Coba lagi beberapa saat lagi."));
  });
});

describe("StatusController.ambilRiwayatWarga", () => {
  it("mengambil riwayat dengan identitas sesi dan hanya mengirim kolom kartu", async () => {
    vi.mocked(getMilikSaya).mockResolvedValue({
      ...responsRincian,
      data: [{
        id: rincian.id, id_tiket: rincian.id_tiket, kategori: rincian.kategori,
        deskripsi: rincian.deskripsi, status: rincian.status, tahap: rincian.tahap,
        alasan_penolakan: rincian.alasan_penolakan, waktu_masuk: rincian.waktu_masuk, waktu_selesai: null,
      }],
    });

    const hasil = await ambilRiwayatWarga();

    expect(getMilikSaya).toHaveBeenCalledWith(supabase, "warga-uji");
    expect(hasil).toEqual(ok([{
      id: rincian.id, id_tiket: rincian.id_tiket, kategori: rincian.kategori,
      status: rincian.status, tahap: rincian.tahap, waktu_masuk: rincian.waktu_masuk,
    }]));
  });
});

describe("StatusController.ambilLaporanPublik", () => {
  it("tetap boleh diakses tanpa verifikasi role warga", async () => {
    vi.mocked(getDaftarPublik).mockResolvedValue({ data: [], error: null });

    expect(await ambilLaporanPublik()).toEqual(ok([]));
    expect(requireRole).not.toHaveBeenCalled();
    expect(getDaftarPublik).toHaveBeenCalledWith(supabase);
  });
});
