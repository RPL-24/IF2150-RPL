import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { KonteksSesi } from "@/lib/auth/konteks";
import { ModulLaporan } from "@/modules/laporan/internal/ModulLaporan";
import { LaporanController } from "@/modules/laporan/service";
import { TEKNISI, WARGA, WARGA_LAIN, buatRepoPalsu, laporan, riwayat } from "./palsu";

function buat(sesi: KonteksSesi) {
  const palsu = buatRepoPalsu({
    laporan: [
      laporan("LAP-A", 7, "SEDANG_DIPERBAIKI", 8),
      laporan("LAP-B", 7, "MENUNGGU", 10),
      laporan("LAP-X", 8, "MENUNGGU", 9),
    ],
    riwayat: [
      riwayat("R-2", "LAP-A", "SELESAI", 12),
      riwayat("R-1", "LAP-A", "SEDANG_DIPERBAIKI", 9),
      riwayat("R-X", "LAP-X", "SEDANG_DIPERBAIKI", 9),
    ],
  });
  const akun = { validasiKeanggotaan: async () => true };
  return { ...palsu, controller: new LaporanController(sesi, new ModulLaporan(palsu.repo, akun)) };
}

describe("UC04: pembacaan laporan milik warga sesi", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("daftar hanya berisi laporan milik sesi, terbaru lebih dulu", async () => {
    const { controller, repo } = buat(WARGA);
    const hasil = await controller.daftarMilikWarga();
    expect(hasil.ok && hasil.data.map((l) => l.idLaporan)).toEqual(["LAP-B", "LAP-A"]);
    expect(repo.cariMilikWarga).toHaveBeenCalledWith(7);
  });

  it("warga lain melihat laporannya sendiri, bukan milik warga pertama", async () => {
    const { controller } = buat(WARGA_LAIN);
    const hasil = await controller.daftarMilikWarga();
    expect(hasil.ok && hasil.data.map((l) => l.idLaporan)).toEqual(["LAP-X"]);
  });

  it("daftar kosong adalah hasil sah, bukan galat", async () => {
    const { controller, dataLaporan } = buat(WARGA);
    dataLaporan.length = 0;
    expect(await controller.daftarMilikWarga()).toEqual({ ok: true, data: [] });
  });

  it("detail laporan sendiri memuat deskripsi dan nama pemilik", async () => {
    const { controller } = buat(WARGA);
    const hasil = await controller.detailMilikWarga("LAP-A");
    expect(hasil.ok && hasil.data).toMatchObject({
      idLaporan: "LAP-A",
      status: "SEDANG_DIPERBAIKI",
      deskripsi: "Deskripsi LAP-A",
      namaPemilik: "Sari Lestari",
    });
  });

  it("laporan milik warga lain dan ID yang tidak ada menghasilkan pesan yang sama", async () => {
    const { controller } = buat(WARGA);
    const asing = await controller.detailMilikWarga("LAP-X");
    const kosong = await controller.detailMilikWarga("LAP-TIDAK-ADA");
    expect(asing).toMatchObject({ ok: false, kode: "TIDAK_DITEMUKAN" });
    expect(asing).toEqual(kosong);
  });

  it("riwayat laporan sendiri urut waktu naik", async () => {
    const { controller } = buat(WARGA);
    const hasil = await controller.riwayatMilikWarga("LAP-A");
    expect(hasil.ok && hasil.data.map((r) => r.status)).toEqual(["SEDANG_DIPERBAIKI", "SELESAI"]);
  });

  it("laporan tanpa perubahan status memberi riwayat kosong yang sah", async () => {
    const { controller } = buat(WARGA);
    expect(await controller.riwayatMilikWarga("LAP-B")).toEqual({ ok: true, data: [] });
  });

  it("riwayat laporan milik warga lain ditolak sebelum riwayat dibaca", async () => {
    const { controller, repo } = buat(WARGA);
    const hasil = await controller.riwayatMilikWarga("LAP-X");
    expect(hasil).toMatchObject({ ok: false, kode: "TIDAK_DITEMUKAN" });
    expect(repo.cariRiwayatMilik).not.toHaveBeenCalled();
  });

  it.each(["", "../etc/passwd", "LAP A", "a".repeat(65), 42, null])("ID tidak valid %j ditolak tanpa query", async (id) => {
    const { controller, repo } = buat(WARGA);
    expect(await controller.detailMilikWarga(id)).toMatchObject({ ok: false, kode: "VALIDASI_GAGAL" });
    expect(await controller.riwayatMilikWarga(id)).toMatchObject({ ok: false, kode: "VALIDASI_GAGAL" });
    expect(repo.cariDetailMilik).not.toHaveBeenCalled();
  });

  it("teknisi tidak boleh memakai operasi warga", async () => {
    const { controller, repo } = buat(TEKNISI);
    for (const hasil of [
      await controller.daftarMilikWarga(),
      await controller.detailMilikWarga("LAP-A"),
      await controller.riwayatMilikWarga("LAP-A"),
    ]) {
      expect(hasil).toMatchObject({ ok: false, kode: "TIDAK_BERWENANG" });
    }
    expect(repo.cariMilikWarga).not.toHaveBeenCalled();
  });

  it("galat basis data diteruskan sebagai galat, bukan daftar kosong", async () => {
    const { controller, repo } = buat(WARGA);
    repo.cariMilikWarga.mockRejectedValueOnce(new Error("koneksi putus"));
    expect(await controller.daftarMilikWarga()).toMatchObject({ ok: false, kode: "GAGAL_INTERNAL" });
  });
});
