import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { KonteksSesi } from "@/lib/auth/konteks";
import { ModulLaporan } from "@/modules/laporan/internal/ModulLaporan";
import { LaporanController } from "@/modules/laporan/service";
import { TEKNISI, TEKNISI_LAIN, WARGA, buatRepoPalsu, laporan, riwayat } from "./palsu";

function buat(sesi: KonteksSesi = TEKNISI) {
  const palsu = buatRepoPalsu({
    laporan: [
      laporan("LAP-1", 7, "MENUNGGU", 8),
      laporan("LAP-2", 7, "SEDANG_DIPERBAIKI", 7),
      laporan("LAP-3", 8, "SELESAI", 6),
      laporan("LAP-4", 8, "MENUNGGU", 9), // tidak ditugaskan ke siapa pun
    ],
    riwayat: [riwayat("R-1", "LAP-2", "SEDANG_DIPERBAIKI", 9), riwayat("R-3", "LAP-3", "SEDANG_DIPERBAIKI", 7)],
    penugasan: [
      { idTeknisi: "TEK-01", idLaporan: "LAP-1" },
      { idTeknisi: "TEK-01", idLaporan: "LAP-2" },
      { idTeknisi: "TEK-01", idLaporan: "LAP-3" },
    ],
  });
  const akun = { validasiKeanggotaan: async () => true };
  return { ...palsu, controller: new LaporanController(sesi, new ModulLaporan(palsu.repo, akun)) };
}
const status = (d: ReturnType<typeof buat>, id: string) => d.dataLaporan.find((l) => l.idLaporan === id)?.status;

describe("UC07: perbaruiStatus (Algo-017, 040, 042)", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("MENUNGGU ke SEDANG_DIPERBAIKI menyimpan status dan satu riwayat bersama", async () => {
    const d = buat();
    const hasil = await d.controller.perbaruiStatus("LAP-1", "SEDANG_DIPERBAIKI");
    expect(hasil.ok && hasil.data).toMatchObject({ idLaporan: "LAP-1", status: "SEDANG_DIPERBAIKI" });
    expect(status(d, "LAP-1")).toBe("SEDANG_DIPERBAIKI");
    expect(d.dataRiwayat.filter((r) => r.idLaporan === "LAP-1")).toHaveLength(1);
    expect(d.repo.simpanStatusDanRiwayat).toHaveBeenCalledWith(
      expect.objectContaining({ idLaporan: "LAP-1", status: "SEDANG_DIPERBAIKI" }),
      expect.objectContaining({ idLaporan: "LAP-1", status: "SEDANG_DIPERBAIKI" }),
      "TEK-01",
      "MENUNGGU",
    );
  });

  it("SEDANG_DIPERBAIKI ke SELESAI sah", async () => {
    const d = buat();
    expect((await d.controller.perbaruiStatus("LAP-2", "SELESAI")).ok).toBe(true);
    expect(status(d, "LAP-2")).toBe("SELESAI");
  });

  it("alur penuh MENUNGGU, SEDANG_DIPERBAIKI, SELESAI mencatat dua riwayat berurutan", async () => {
    const d = buat();
    await d.controller.perbaruiStatus("LAP-1", "SEDANG_DIPERBAIKI");
    await d.controller.perbaruiStatus("LAP-1", "SELESAI");
    expect(d.dataRiwayat.filter((r) => r.idLaporan === "LAP-1").map((r) => r.status)).toEqual([
      "SEDANG_DIPERBAIKI",
      "SELESAI",
    ]);
  });

  it("lompat MENUNGGU ke SELESAI ditolak dengan opsi sah, tanpa menyimpan", async () => {
    const d = buat();
    const hasil = await d.controller.perbaruiStatus("LAP-1", "SELESAI");
    expect(hasil).toMatchObject({ ok: false, kode: "VALIDASI_GAGAL", opsi: { statusBerikutnya: ["SEDANG_DIPERBAIKI"] } });
    expect(d.repo.simpanStatusDanRiwayat).not.toHaveBeenCalled();
    expect(status(d, "LAP-1")).toBe("MENUNGGU");
  });

  it.each([
    ["LAP-2", "MENUNGGU"], // mundur
    ["LAP-2", "SEDANG_DIPERBAIKI"], // sama
    ["LAP-3", "SEDANG_DIPERBAIKI"], // mundur dari status akhir
    ["LAP-3", "SELESAI"], // status akhir tidak berubah lagi
  ] as const)("%s ke %s ditolak", async (id, baru) => {
    const d = buat();
    const awal = status(d, id);
    expect(await d.controller.perbaruiStatus(id, baru)).toMatchObject({ ok: false, kode: "VALIDASI_GAGAL" });
    expect(status(d, id)).toBe(awal);
    expect(d.repo.simpanStatusDanRiwayat).not.toHaveBeenCalled();
  });

  it("status akhir tidak punya langkah berikutnya", async () => {
    const hasil = await buat().controller.perbaruiStatus("LAP-3", "SELESAI");
    expect(hasil).toMatchObject({ opsi: { statusBerikutnya: [] } });
  });

  it("teknisi yang tidak ditugaskan ditolak sebelum status dibaca atau diubah", async () => {
    const d = buat(TEKNISI_LAIN);
    expect(await d.controller.perbaruiStatus("LAP-1", "SEDANG_DIPERBAIKI")).toMatchObject({
      ok: false,
      kode: "TIDAK_BERWENANG",
    });
    expect(d.repo.cariDetailTugas).not.toHaveBeenCalled();
    expect(d.repo.simpanStatusDanRiwayat).not.toHaveBeenCalled();
    expect(status(d, "LAP-1")).toBe("MENUNGGU");
  });

  it("laporan yang tidak ditugaskan ke siapa pun juga ditolak", async () => {
    const d = buat();
    expect(await d.controller.perbaruiStatus("LAP-4", "SEDANG_DIPERBAIKI")).toMatchObject({ kode: "TIDAK_BERWENANG" });
  });

  it("warga tidak boleh mengubah status", async () => {
    const d = buat(WARGA);
    expect(await d.controller.perbaruiStatus("LAP-1", "SEDANG_DIPERBAIKI")).toMatchObject({ kode: "TIDAK_BERWENANG" });
    expect(d.repo.cariPenugasan).not.toHaveBeenCalled();
  });

  it.each(["DITOLAK", "selesai", "", null, 3])("status di luar enumerasi %j ditolak tanpa query", async (nilai) => {
    const d = buat();
    expect(await d.controller.perbaruiStatus("LAP-1", nilai)).toMatchObject({ ok: false, kode: "VALIDASI_GAGAL" });
    expect(d.repo.cariPenugasan).not.toHaveBeenCalled();
  });

  it("konflik atau kegagalan transaksi dilaporkan sebagai KONFLIK dan tidak mengubah apa pun", async () => {
    const d = buat();
    d.repo.simpanStatusDanRiwayat.mockResolvedValueOnce(false);
    expect(await d.controller.perbaruiStatus("LAP-1", "SEDANG_DIPERBAIKI")).toMatchObject({ ok: false, kode: "KONFLIK" });
    expect(status(d, "LAP-1")).toBe("MENUNGGU");
    expect(d.dataRiwayat.filter((r) => r.idLaporan === "LAP-1")).toHaveLength(0);
  });

  it("riwayat gagal tersimpan membatalkan perubahan status", async () => {
    const d = buat();
    d.kendali.gagalRiwayat = true;
    expect(await d.controller.perbaruiStatus("LAP-1", "SEDANG_DIPERBAIKI")).toMatchObject({ kode: "KONFLIK" });
    expect(status(d, "LAP-1")).toBe("MENUNGGU");
    expect(d.dataRiwayat.some((r) => r.idLaporan === "LAP-1")).toBe(false);
  });

  it("galat tak terduga menjadi GAGAL_INTERNAL", async () => {
    const d = buat();
    d.repo.cariPenugasan.mockRejectedValueOnce(new Error("koneksi putus"));
    expect(await d.controller.perbaruiStatus("LAP-1", "SEDANG_DIPERBAIKI")).toMatchObject({ kode: "GAGAL_INTERNAL" });
  });
});

describe("UC07: daftar tugas dan detail tugas", () => {
  it("daftar hanya tugas milik teknisi sesi, laporan terlama dulu", async () => {
    const hasil = await buat().controller.daftarPenugasan();
    expect(hasil.ok && hasil.data.map((l) => l.idLaporan)).toEqual(["LAP-3", "LAP-2", "LAP-1"]);
  });

  it("teknisi lain tidak melihat tugas teknisi pertama", async () => {
    expect(await buat(TEKNISI_LAIN).controller.daftarPenugasan()).toEqual({ ok: true, data: [] });
  });

  it("detail tugas yang tidak ditugaskan sama dengan ID yang tidak ada", async () => {
    const d = buat();
    const asing = await d.controller.detailTugas("LAP-4");
    expect(asing).toMatchObject({ ok: false, kode: "TIDAK_DITEMUKAN" });
    expect(asing).toEqual(await d.controller.detailTugas("LAP-TIDAK-ADA"));
  });

  it("detail dan riwayat tugas sendiri terbaca", async () => {
    const d = buat();
    const detail = await d.controller.detailTugas("LAP-2");
    expect(detail.ok && detail.data).toMatchObject({ idLaporan: "LAP-2", status: "SEDANG_DIPERBAIKI" });
    const riw = await d.controller.riwayatTugas("LAP-2");
    expect(riw.ok && riw.data.map((r) => r.status)).toEqual(["SEDANG_DIPERBAIKI"]);
  });

  it("riwayat tugas milik orang lain ditolak sebelum riwayat dibaca", async () => {
    const d = buat(TEKNISI_LAIN);
    expect(await d.controller.riwayatTugas("LAP-2")).toMatchObject({ ok: false, kode: "TIDAK_DITEMUKAN" });
    expect(d.repo.cariRiwayatTugas).not.toHaveBeenCalled();
  });

  it("warga tidak boleh membaca tugas teknisi", async () => {
    const d = buat(WARGA);
    expect(await d.controller.daftarPenugasan()).toMatchObject({ kode: "TIDAK_BERWENANG" });
    expect(await d.controller.detailTugas("LAP-1")).toMatchObject({ kode: "TIDAK_BERWENANG" });
  });
});
