import { createClient as createSupabaseClient, PostgrestError } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { gagal, ok } from "@/lib/action-result";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getDaftarPublik, getMilikSaya, getRincian, getRincianPublik } from "@/server/entities/Laporan";
import { catatUpvote, getJumlahUpvote, sudahUpvote } from "@/server/entities/Upvote";
import type { Database } from "@/types/database";
import { ambilDetailStatus, ambilLaporanPublik, ambilRiwayatWarga, prosesUpvote } from "./StatusController";

vi.mock("@/lib/auth", () => ({ requireRole: vi.fn(), getCurrentUser: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/server/entities/Laporan", () => ({
  getMilikSaya: vi.fn(), getRincian: vi.fn(), getDaftarPublik: vi.fn(), getRincianPublik: vi.fn(),
}));
vi.mock("@/server/entities/Upvote", () => ({ catatUpvote: vi.fn(), getJumlahUpvote: vi.fn(), sudahUpvote: vi.fn() }));

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
  vi.mocked(getCurrentUser).mockResolvedValue(null);
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
  const laporanPublik: NonNullable<Awaited<ReturnType<typeof getDaftarPublik>>["data"]>[number] = {
    id: "00000000-0000-0000-0000-000000000097",
    id_tiket: "LK-0097",
    kategori: "trotoar_rusak",
    deskripsi: "Trotoar rusak dekat halte.",
    latitude: -6.9175,
    longitude: 107.6191,
    status: "dikerjakan",
    tahap: "menunggu_eksekusi",
    jumlah_upvote: 12,
    waktu_masuk: "2026-11-08T01:00:00Z",
    waktu_selesai: null,
  };

  it("tetap boleh diakses tanpa verifikasi role warga", async () => {
    vi.mocked(getDaftarPublik).mockResolvedValue({ data: [], error: null });

    expect(await ambilLaporanPublik()).toEqual(ok([]));
    expect(requireRole).not.toHaveBeenCalled();
    expect(getDaftarPublik).toHaveBeenCalledWith(supabase);
  });

  it("menyediakan isi kartu marker tanpa mengirim identitas atau kolom rincian", async () => {
    const sumber = { ...laporanPublik, id_pelapor: "identitas-pribadi", alasan_penolakan: "catatan-pribadi" };
    vi.mocked(getDaftarPublik).mockResolvedValue({ data: [sumber], error: null });

    expect(await ambilLaporanPublik()).toEqual(ok([{
      id: "00000000-0000-0000-0000-000000000097",
      id_tiket: "LK-0097",
      kategori: "trotoar_rusak",
      latitude: -6.9175,
      longitude: 107.6191,
      status: "dikerjakan",
      jumlah_upvote: 12,
      sudahDidukung: null,
    }]));
  });

  it("menampilkan jumlah dukungan nol ketika kolom view bernilai null", async () => {
    vi.mocked(getDaftarPublik).mockResolvedValue({ data: [{ ...laporanPublik, jumlah_upvote: null }], error: null });

    const hasil = await ambilLaporanPublik();

    expect(hasil.ok && hasil.data[0]).toHaveProperty("jumlah_upvote", 0);
  });

  it("memuat ulang status sudah didukung dari DB setelah refresh tanpa menulis dukungan", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "warga-uji", nama: "Warga Uji", role: "warga" });
    vi.mocked(getDaftarPublik).mockResolvedValue({ data: [laporanPublik], error: null });
    vi.mocked(sudahUpvote).mockResolvedValue({ data: true, error: null });

    for (let ulang = 0; ulang < 2; ulang++) {
      const hasil = await ambilLaporanPublik();
      expect(hasil.ok && hasil.data[0]).toHaveProperty("sudahDidukung", true);
    }
    expect(sudahUpvote).toHaveBeenCalledWith(supabase, laporanPublik.id, "warga-uji");
    expect(catatUpvote).not.toHaveBeenCalled();
  });

  it("menandai laporan yang belum didukung agar tombolnya dapat diaktifkan", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "warga-uji", nama: "Warga Uji", role: "warga" });
    vi.mocked(getDaftarPublik).mockResolvedValue({ data: [laporanPublik], error: null });
    vi.mocked(sudahUpvote).mockResolvedValue({ data: false, error: null });

    const hasil = await ambilLaporanPublik();
    expect(hasil.ok && hasil.data[0]).toHaveProperty("sudahDidukung", false);
  });

  it("memisahkan status dukungan antar akun tanpa mengirim identitas ke client", async () => {
    vi.mocked(getDaftarPublik).mockResolvedValue({ data: [laporanPublik], error: null });
    vi.mocked(sudahUpvote).mockImplementation(async (_supabase, _id, idUser) => ({ data: idUser === "warga-a", error: null }));
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "warga-a", nama: "A", role: "warga" });
    const hasilA = await ambilLaporanPublik();
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "warga-b", nama: "B", role: "warga" });
    const hasilB = await ambilLaporanPublik();

    expect(hasilA.ok && hasilA.data[0]).toHaveProperty("sudahDidukung", true);
    expect(hasilB.ok && hasilB.data[0]).toHaveProperty("sudahDidukung", false);
    expect(JSON.stringify([hasilA, hasilB])).not.toMatch(/warga-a|warga-b|id_user|id_pelapor/);
  });

  it.each(["error DB", "exception"])("tetap memuat peta dengan status dukungan belum diketahui saat %s", async (jenis) => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "warga-uji", nama: "Warga Uji", role: "warga" });
    vi.mocked(getDaftarPublik).mockResolvedValue({ data: [laporanPublik], error: null });
    if (jenis === "exception") {
      vi.mocked(sudahUpvote).mockRejectedValue(new Error("Internal connection details"));
    } else {
      vi.mocked(sudahUpvote).mockResolvedValue({
        data: false, error: new PostgrestError({ code: "42703", message: "Internal details", details: "", hint: "" }),
      });
    }

    const hasil = await ambilLaporanPublik();
    expect(hasil.ok && hasil.data[0]).toMatchObject({ id_tiket: "LK-0097", sudahDidukung: null });
    expect(JSON.stringify(hasil)).not.toContain("Internal");
  });

  it.each([null, "admin", "eksekutor"] as const)("tidak memeriksa dukungan pribadi untuk akun %s", async (role) => {
    vi.mocked(getCurrentUser).mockResolvedValue(role ? { id: "akun-uji", nama: "Akun Uji", role } : null);
    vi.mocked(getDaftarPublik).mockResolvedValue({ data: [laporanPublik], error: null });

    const hasil = await ambilLaporanPublik();
    expect(hasil.ok && hasil.data[0]).toHaveProperty("sudahDidukung", null);
    expect(sudahUpvote).not.toHaveBeenCalled();
  });

  it("tetap menampilkan peta dengan tombol nonaktif ketika pembacaan sesi gagal", async () => {
    vi.mocked(getCurrentUser).mockRejectedValue(new Error("Internal auth connection details"));
    vi.mocked(getDaftarPublik).mockResolvedValue({ data: [laporanPublik], error: null });

    const hasil = await ambilLaporanPublik();

    expect(hasil.ok && hasil.data[0]).toMatchObject({ id_tiket: "LK-0097", sudahDidukung: null });
    expect(sudahUpvote).not.toHaveBeenCalled();
    expect(JSON.stringify(hasil)).not.toContain("Internal");
  });

  it("mengembalikan daftar kosong ketika tidak ada data publik", async () => {
    vi.mocked(getDaftarPublik).mockResolvedValue({ data: null, error: null });

    expect(await ambilLaporanPublik()).toEqual(ok([]));
  });

  it("menangani kegagalan pembacaan publik tanpa membocorkan pesan database", async () => {
    vi.mocked(getDaftarPublik).mockResolvedValue({
      data: null,
      error: new PostgrestError({ code: "42703", message: "Internal database details", details: "", hint: "" }),
    });

    expect(await ambilLaporanPublik()).toEqual(gagal("Terjadi kesalahan. Coba lagi beberapa saat lagi."));
  });

  it("mengembalikan pesan kegagalan ketika koneksi pembacaan publik terputus", async () => {
    vi.mocked(getDaftarPublik).mockRejectedValue(new Error("Internal connection details"));

    expect(await ambilLaporanPublik()).toEqual(gagal("Gagal memuat laporan publik. Coba lagi beberapa saat lagi."));
  });
});

describe("StatusController.prosesUpvote", () => {
  const publik: NonNullable<Awaited<ReturnType<typeof getRincianPublik>>["data"]> = {
    id: "00000000-0000-0000-0000-000000000097",
    id_tiket: "LK-0097", kategori: "trotoar_rusak", deskripsi: "Trotoar rusak dekat halte.",
    latitude: -6.9175, longitude: 107.6191, status: "dikerjakan", tahap: "menunggu_eksekusi",
    jumlah_upvote: 12, waktu_masuk: "2026-11-08T01:00:00Z", waktu_selesai: null, foto: [], video: [],
  };

  beforeEach(() => {
    vi.mocked(getRincianPublik).mockResolvedValue({ data: publik, error: null });
    vi.mocked(getMilikSaya).mockResolvedValue({ ...responsRincian, data: [] });
    vi.mocked(sudahUpvote).mockResolvedValue({ data: false, error: null });
    vi.mocked(catatUpvote).mockResolvedValue({ success: true, data: null, error: null, count: null, status: 201, statusText: "Created" });
    vi.mocked(getJumlahUpvote).mockResolvedValue({ data: 13, error: null });
  });

  it("mencatat dukungan dengan identitas sesi dan mengembalikan counter terbaru dari DB", async () => {
    // Dukungan pengguna lain dapat bertambah bersamaan; jangan memakai nilai awal + 1.
    vi.mocked(getJumlahUpvote).mockResolvedValue({ data: 15, error: null });

    expect(await prosesUpvote("LK-0097")).toEqual(ok(15));
    expect(requireRole).toHaveBeenCalledWith("warga");
    expect(catatUpvote).toHaveBeenCalledExactlyOnceWith(supabase, publik.id, "warga-uji");
  });

  it.each(["Silakan masuk terlebih dahulu.", "Anda tidak memiliki akses ke fitur ini."])(
    "tidak menulis data saat akses ditolak: %s", async (pesan) => {
      vi.mocked(requireRole).mockResolvedValue(gagal(pesan));

      expect(await prosesUpvote("LK-0097")).toEqual(gagal(pesan));
      expect(catatUpvote).not.toHaveBeenCalled();
    },
  );

  it.each(["", "LK-97", "LK-0097' OR '1'='1", null])("menolak ID tiket yang tidak valid: %s", async (idTiket) => {
    expect(await prosesUpvote(idTiket as string)).toEqual(gagal("Format ID tiket tidak valid."));
    expect(catatUpvote).not.toHaveBeenCalled();
  });

  it("menolak tiket yang tidak terlihat pada view publik", async () => {
    vi.mocked(getRincianPublik).mockResolvedValue({ data: null, error: null });

    expect(await prosesUpvote("LK-0097")).toEqual(gagal("Tiket tidak ditemukan atau tidak dapat didukung."));
    expect(catatUpvote).not.toHaveBeenCalled();
  });

  it("menolak laporan yang sudah Berhasil", async () => {
    vi.mocked(getRincianPublik).mockResolvedValue({ data: { ...publik, status: "berhasil", tahap: null }, error: null });

    expect(await prosesUpvote("LK-0097")).toEqual(gagal("Laporan ini sudah selesai atau tidak lagi menerima dukungan."));
    expect(catatUpvote).not.toHaveBeenCalled();
  });

  it("menolak laporan sendiri tanpa mengirim identitas pelapor ke client", async () => {
    vi.mocked(getMilikSaya).mockResolvedValue({ ...responsRincian, data: [{ ...rincian, id: publik.id, id_tiket: publik.id_tiket }] });

    expect(await prosesUpvote("LK-0097")).toEqual(gagal("Anda tidak dapat mendukung laporan sendiri."));
    expect(catatUpvote).not.toHaveBeenCalled();
  });

  it("menangani dukungan yang sudah pernah diberikan tanpa insert ulang", async () => {
    vi.mocked(sudahUpvote).mockResolvedValue({ data: true, error: null });

    expect(await prosesUpvote("LK-0097")).toEqual({ ...gagal("Anda sudah mendukung laporan ini."), dukunganTercatat: true });
    expect(catatUpvote).not.toHaveBeenCalled();
  });

  it("menangani unique violation dari dua permintaan bersamaan sebagai dukungan ganda", async () => {
    vi.mocked(catatUpvote).mockResolvedValue({
      success: false, data: null, count: null, status: 409, statusText: "Conflict",
      error: new PostgrestError({ code: "23505", message: "duplicate key", details: "", hint: "" }),
    });

    expect(await prosesUpvote("LK-0097")).toEqual({ ...gagal("Anda sudah mendukung laporan ini."), dukunganTercatat: true });
    expect(getJumlahUpvote).not.toHaveBeenCalled();
  });

  it("menghentikan proses jika pemeriksaan laporan sendiri gagal", async () => {
    vi.mocked(getMilikSaya).mockResolvedValue({
      success: false, data: null, count: null, status: 400, statusText: "Bad Request",
      error: new PostgrestError({ code: "42703", message: "Internal details", details: "", hint: "" }),
    });

    expect(await prosesUpvote("LK-0097")).toEqual(gagal("Terjadi kesalahan. Coba lagi beberapa saat lagi."));
    expect(catatUpvote).not.toHaveBeenCalled();
  });

  it("menghentikan proses jika pemeriksaan dukungan ganda gagal", async () => {
    vi.mocked(sudahUpvote).mockResolvedValue({
      data: false, error: new PostgrestError({ code: "42703", message: "Internal details", details: "", hint: "" }),
    });

    expect(await prosesUpvote("LK-0097")).toEqual(gagal("Terjadi kesalahan. Coba lagi beberapa saat lagi."));
    expect(catatUpvote).not.toHaveBeenCalled();
  });

  it("tetap menghormati penolakan RLS saat status laporan berubah sebelum insert", async () => {
    vi.mocked(catatUpvote).mockResolvedValue({
      success: false, data: null, count: null, status: 403, statusText: "Forbidden",
      error: new PostgrestError({ code: "42501", message: "Internal RLS details", details: "", hint: "" }),
    });

    expect(await prosesUpvote("LK-0097")).toEqual(gagal("Anda tidak memiliki akses untuk tindakan ini."));
  });

  it("menandai dukungan sudah tersimpan ketika pembacaan counter gagal setelah insert", async () => {
    vi.mocked(getJumlahUpvote).mockResolvedValue({ data: null, error: null });

    expect(await prosesUpvote("LK-0097")).toEqual({
      ...gagal("Dukungan sudah tersimpan, tetapi jumlah dukungan belum dapat diperbarui. Muat ulang halaman."),
      dukunganTercatat: true,
    });
    expect(catatUpvote).toHaveBeenCalledTimes(1);
  });

  it("mempertahankan informasi insert berhasil jika pembacaan counter melempar exception", async () => {
    vi.mocked(getJumlahUpvote).mockRejectedValue(new Error("Network error"));

    const hasil = await prosesUpvote("LK-0097");

    expect(hasil).toHaveProperty("ok", false);
    expect(hasil).toHaveProperty("dukunganTercatat", true);
  });
});
