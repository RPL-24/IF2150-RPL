import { describe, expect, it } from "vitest";
import { filterKategori, urutPrioritas } from "@/server/entities/Laporan";

const L = (id: string, skor_prioritas: number, waktu_masuk: string, kategori: "jalan_berlubang" | "trotoar_rusak") => ({
  id,
  skor_prioritas,
  waktu_masuk,
  kategori,
});

const DAFTAR = [
  L("a", 10, "2026-10-20T08:00:00+00:00", "jalan_berlubang"),
  L("b", 90, "2026-10-22T08:00:00+00:00", "trotoar_rusak"),
  L("c", 10, "2026-10-19T08:00:00.123456+00:00", "trotoar_rusak"),
  L("d", 100, "2026-10-25T08:00:00+00:00", "jalan_berlubang"),
];

describe("urutPrioritas", () => {
  it("skor tertinggi dulu, seri → waktu masuk paling lama dulu", () => {
    expect(urutPrioritas(DAFTAR).map((l) => l.id)).toEqual(["d", "b", "c", "a"]);
  });

  it("tidak mengubah array input", () => {
    const salinan = [...DAFTAR];
    urutPrioritas(DAFTAR);
    expect(DAFTAR).toEqual(salinan);
  });

  it("daftar kosong", () => {
    expect(urutPrioritas([])).toEqual([]);
  });
});

describe("filterKategori", () => {
  it("hanya kategori yang dipilih", () => {
    expect(filterKategori(DAFTAR, "trotoar_rusak").map((l) => l.id)).toEqual(["b", "c"]);
  });

  it("null = semua kategori (salinan baru)", () => {
    const hasil = filterKategori(DAFTAR, null);
    expect(hasil).toEqual(DAFTAR);
    expect(hasil).not.toBe(DAFTAR);
  });
});
