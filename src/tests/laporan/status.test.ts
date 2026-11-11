import { describe, expect, it } from "@jest/globals";
import { LaporanGangguan, type DataLaporan } from "@/modules/laporan/internal/LaporanGangguan";
import { URUTAN_STATUS, adalahStatus, statusBerikutnya } from "@/modules/laporan/internal/StatusLaporan";

const DATA: DataLaporan = {
  idLaporan: "LAP-1",
  idWarga: 1,
  jenisGangguan: "Kebocoran pipa",
  deskripsi: "Bocor",
  fotoPendukung: [],
  waktuDibuat: new Date("2026-10-28T01:10:00Z"),
  status: "MENUNGGU",
};

describe("transisi status (Algo-017)", () => {
  it("hanya mengizinkan satu langkah maju", () => {
    expect(statusBerikutnya("MENUNGGU")).toEqual(["SEDANG_DIPERBAIKI"]);
    expect(statusBerikutnya("SEDANG_DIPERBAIKI")).toEqual(["SELESAI"]);
    expect(statusBerikutnya("SELESAI")).toEqual([]);
  });

  it.each([
    ["MENUNGGU", "SEDANG_DIPERBAIKI", true],
    ["SEDANG_DIPERBAIKI", "SELESAI", true],
    ["MENUNGGU", "SELESAI", false], // lompat
    ["SEDANG_DIPERBAIKI", "MENUNGGU", false], // mundur
    ["SELESAI", "SEDANG_DIPERBAIKI", false], // mundur dari status akhir
    ["MENUNGGU", "MENUNGGU", false], // sama
    ["SELESAI", "SELESAI", false],
  ] as const)("%s ke %s: %s", (dari, ke, sah) => {
    expect(LaporanGangguan.dariData({ ...DATA, status: dari }).validasiTransisi(ke)).toBe(sah);
  });

  it("menolak nilai di luar enumerasi", () => {
    const laporan = LaporanGangguan.dariData(DATA);
    for (const nilai of ["DITOLAK", "", null, undefined, 1]) expect(laporan.validasiTransisi(nilai)).toBe(false);
    expect(adalahStatus("SELESAI")).toBe(true);
    expect(adalahStatus("selesai")).toBe(false);
  });

  it("ubahStatus yang tidak sah melempar galat dan tidak mengubah objek", () => {
    const laporan = LaporanGangguan.dariData(DATA);
    expect(() => laporan.ubahStatus("SELESAI")).toThrow();
    expect(laporan.status).toBe("MENUNGGU");
    laporan.ubahStatus("SEDANG_DIPERBAIKI");
    expect(laporan.status).toBe("SEDANG_DIPERBAIKI");
  });

  it("laporan baru berstatus MENUNGGU dan memangkas spasi", () => {
    const laporan = LaporanGangguan.baru(
      { jenisGangguan: " Kebocoran pipa ", deskripsi: " Bocor ", fotoPendukung: [] },
      7,
      new Date("2026-11-01T00:00:00Z"),
    );
    expect(laporan.status).toBe("MENUNGGU");
    expect(laporan.toData()).toMatchObject({ idWarga: 7, jenisGangguan: "Kebocoran pipa", deskripsi: "Bocor" });
    expect(laporan.idLaporan).toMatch(/^LAP-[0-9A-F]{8}$/);
  });

  it("urutan status sesuai DPPL", () => {
    expect([...URUTAN_STATUS]).toEqual(["MENUNGGU", "SEDANG_DIPERBAIKI", "SELESAI"]);
  });
});
