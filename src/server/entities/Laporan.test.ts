import { describe, expect, it, vi } from "vitest";
import { filterKategori, getRincian, urutPrioritas } from "@/server/entities/Laporan";

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

describe("getRincian (Peran C)", () => {
  function supabasePalsu(respons: { data: unknown; error: unknown }) {
    const maybeSingle = vi.fn().mockResolvedValue(respons);
    const order = vi.fn().mockReturnValue({ maybeSingle });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    return { client: { from } as never, from, select, eq, order };
  }

  it("C02-UT40 getRincian (normal): membaca laporan per id_tiket beserta foto, video, dan riwayat terurut", async () => {
    const data = { id_tiket: "LK-0001", foto: [{ path: "laporan/u/a.jpg" }], video: [], riwayat: [] };
    const p = supabasePalsu({ data, error: null });
    expect(await getRincian(p.client, "LK-0001")).toEqual({ data, error: null });
    expect(p.from).toHaveBeenCalledWith("laporan");
    expect(p.select).toHaveBeenCalledWith(expect.stringContaining("foto!foto_id_laporan_fkey(path)"));
    expect(p.eq).toHaveBeenCalledWith("id_tiket", "LK-0001");
    expect(p.order).toHaveBeenCalledWith("waktu", { referencedTable: "riwayat", ascending: true });
  });

  it("C02-UT41 getRincian (batas): tiket tidak ada atau tidak boleh dilihat -> data null", async () => {
    expect(await getRincian(supabasePalsu({ data: null, error: null }).client, "LK-9999")).toEqual({ data: null, error: null });
  });

  it("C02-UT42 getRincian (negatif): error basis data diteruskan", async () => {
    const error = { code: "500", message: "x" };
    expect(await getRincian(supabasePalsu({ data: null, error }).client, "LK-0001")).toEqual({ data: null, error });
  });
});
