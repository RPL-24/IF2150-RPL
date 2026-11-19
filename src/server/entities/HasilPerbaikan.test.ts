import { describe, expect, it, vi } from "vitest";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { validasiBerkas, pilihBuktiSelesai, simpanBukti, getBuktiLengkap, type BarisHasil } from "@/server/entities/HasilPerbaikan";

const MB = 1024 * 1024;
const berkas = (name: string, size = 2 * MB) => ({ name, size });

describe("validasiBerkas", () => {
  it("C08-UT01 validasiBerkas (normal): foto JPG/PNG + video MP4/MOV/MKV valid", () => {
    expect(
      validasiBerkas([berkas("a.jpg"), berkas("b.PNG")], [berkas("c.mp4"), berkas("d.mov"), berkas("e.mkv")]),
    ).toBe(true);
  });

  it("C08-UT02 validasiBerkas (normal): tanpa video tetap valid", () => {
    expect(validasiBerkas([berkas("a.jpg")], [])).toBe(true);
  });

  it("C08-UT03 validasiBerkas (batas): daftar kosong valid (kelengkapan dicek C20)", () => {
    expect(validasiBerkas([], [])).toBe(true);
  });

  it.each(["a.gif", "a.heic", "a.mp4"])("C08-UT04 validasiBerkas (negatif): foto %s ditolak", (name) => {
    expect(validasiBerkas([berkas("ok.jpg"), berkas(name)], [])).toBe(false);
  });

  it.each(["a.avi", "a.webm", "a.jpg"])("C08-UT05 validasiBerkas (negatif): video %s ditolak", (name) => {
    expect(validasiBerkas([berkas("ok.jpg")], [berkas(name)])).toBe(false);
  });

  it("C08-UT06 validasiBerkas (batas): tepat 10 MB valid, 10 MB + 1 byte ditolak", () => {
    expect(validasiBerkas([berkas("a.jpg", MAX_FILE_SIZE)], [berkas("b.mp4", MAX_FILE_SIZE)])).toBe(true);
    expect(validasiBerkas([berkas("a.jpg", MAX_FILE_SIZE + 1)], [])).toBe(false);
    expect(validasiBerkas([berkas("a.jpg")], [berkas("b.mp4", MAX_FILE_SIZE + 1)])).toBe(false);
  });

  it("C08-UT07 validasiBerkas (batas): berkas 0 byte ditolak", () => {
    expect(validasiBerkas([berkas("a.jpg", 0)], [])).toBe(false);
  });
});

describe("pilihBuktiSelesai", () => {
  const hasil = (
    id: string,
    waktu: string,
    keputusan: ("selesai" | "belum_selesai" | "minta_ulang_bukti")[],
  ): BarisHasil => ({
    id_hasil: id,
    catatan: `Catatan ${id}`,
    waktu_unggah: waktu,
    foto: [{ path: `hasil/u/${id}.jpg` }],
    video: [],
    evaluasi: keputusan.map((k) => ({ keputusan: k })),
  });

  it("C08-UT08 pilihBuktiSelesai (batas): belum ada hasil -> null", () => {
    expect(pilihBuktiSelesai([])).toBeNull();
  });

  it("C08-UT09 pilihBuktiSelesai (negatif): belum dievaluasi -> null", () => {
    expect(pilihBuktiSelesai([hasil("h1", "2026-11-01T08:00:00Z", [])])).toBeNull();
  });

  it("C08-UT10 pilihBuktiSelesai (negatif): semua dikembalikan -> null", () => {
    expect(
      pilihBuktiSelesai([
        hasil("h1", "2026-11-01T08:00:00Z", ["minta_ulang_bukti"]),
        hasil("h2", "2026-11-02T08:00:00Z", ["belum_selesai"]),
      ]),
    ).toBeNull();
  });

  it("C08-UT11 pilihBuktiSelesai (normal): pilih yang selesai, bukan yang dikembalikan", () => {
    const bukti = pilihBuktiSelesai([
      hasil("h1", "2026-11-01T08:00:00Z", ["minta_ulang_bukti"]),
      hasil("h2", "2026-11-03T08:00:00Z", ["selesai"]),
    ]);
    expect(bukti?.id_hasil).toBe("h2");
  });

  it("C08-UT12 pilihBuktiSelesai (normal): beberapa selesai -> terbaru", () => {
    const bukti = pilihBuktiSelesai([
      hasil("h2", "2026-11-03T08:00:00Z", ["selesai"]),
      hasil("h3", "2026-11-05T08:00:00Z", ["selesai"]),
    ]);
    expect(bukti?.id_hasil).toBe("h3");
  });

  it("C08-UT13 pilihBuktiSelesai (normal): tanpa field evaluasi", () => {
    const bukti = pilihBuktiSelesai([hasil("h1", "2026-11-01T08:00:00Z", ["selesai"])]);
    expect(bukti).toEqual({
      id_hasil: "h1",
      catatan: "Catatan h1",
      waktu_unggah: "2026-11-01T08:00:00Z",
      foto: [{ path: "hasil/u/h1.jpg" }],
      video: [],
    });
  });

  it("C08-UT14 pilihBuktiSelesai (normal): tidak mengubah daftar asli", () => {
    const daftar = [hasil("h1", "2026-11-01T08:00:00Z", ["selesai"]), hasil("h2", "2026-11-03T08:00:00Z", ["selesai"])];
    pilihBuktiSelesai(daftar);
    expect(daftar.map((h) => h.id_hasil)).toEqual(["h1", "h2"]);
  });
});

describe("simpanBukti", () => {
  const media = [{ path: "hasil/u1/a.jpg", format: "jpg", ukuran: 1024, tipe: "foto" as const }];

  it("C08-UT15 simpanBukti (normal): memanggil RPC kirim_hasil_perbaikan dengan argumen yang benar", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: "uuid-hasil", error: null });
    const hasilRpc = await simpanBukti({ rpc } as never, { idLaporan: "uuid-lap", catatan: "Sudah ditambal", media });
    expect(rpc).toHaveBeenCalledWith("kirim_hasil_perbaikan", {
      p_id_laporan: "uuid-lap", p_catatan: "Sudah ditambal", p_media: media,
    });
    expect(hasilRpc).toEqual({ data: "uuid-hasil", error: null });
  });

  it("C08-UT16 simpanBukti (negatif): error RPC diteruskan tanpa diubah", async () => {
    const error = { code: "P0001", message: "Tugas tidak aktif." };
    const rpc = vi.fn().mockResolvedValue({ data: null, error });
    expect(await simpanBukti({ rpc } as never, { idLaporan: "x", catatan: "c", media })).toEqual({ data: null, error });
  });

  it("C08-UT20 simpanBukti (batas): 3 foto + 1 video dikirim dalam satu panggilan RPC", async () => {
    const banyak = [
      { path: "hasil/u1/1.jpg", format: "jpg", ukuran: 1024, tipe: "foto" as const },
      { path: "hasil/u1/2.jpg", format: "jpg", ukuran: 1024, tipe: "foto" as const },
      { path: "hasil/u1/3.jpg", format: "jpg", ukuran: 1024, tipe: "foto" as const },
      { path: "hasil/u1/v.mp4", format: "mp4", ukuran: 2048, tipe: "video" as const },
    ];
    const rpc = vi.fn().mockResolvedValue({ data: "uuid-hasil", error: null });
    await simpanBukti({ rpc } as never, { idLaporan: "uuid-lap", catatan: "c", media: banyak });
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc.mock.calls[0][1].p_media).toHaveLength(4);
  });
});

describe("getBuktiLengkap", () => {
  function supabasePalsu(respons: { data: unknown; error: unknown }) {
    const eq = vi.fn().mockResolvedValue(respons);
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    return { client: { from } as never, from, eq };
  }
  const baris = (id_hasil: string, waktu_unggah: string, keputusan: "selesai" | "minta_ulang_bukti") => ({
    id_hasil, catatan: `Catatan ${id_hasil}`, waktu_unggah,
    foto: [{ path: `hasil/u1/${id_hasil}.jpg` }], video: [], evaluasi: [{ keputusan }],
  });

  it("C08-UT17 getBuktiLengkap (normal): membaca hasil_perbaikan laporan, memilih bukti yang selesai", async () => {
    const p = supabasePalsu({
      data: [baris("h1", "2026-11-05T08:00:00Z", "minta_ulang_bukti"), baris("h2", "2026-11-06T08:00:00Z", "selesai")],
      error: null,
    });
    const bukti = await getBuktiLengkap(p.client, "uuid-lap");
    expect(p.from).toHaveBeenCalledWith("hasil_perbaikan");
    expect(p.eq).toHaveBeenCalledWith("id_laporan", "uuid-lap");
    expect(bukti).toEqual({
      data: { id_hasil: "h2", catatan: "Catatan h2", waktu_unggah: "2026-11-06T08:00:00Z", foto: [{ path: "hasil/u1/h2.jpg" }], video: [] },
      error: null,
    });
  });

  it("C08-UT18 getBuktiLengkap (batas): data null dari basis data -> belum ada bukti", async () => {
    expect(await getBuktiLengkap(supabasePalsu({ data: null, error: null }).client, "uuid-lap")).toEqual({ data: null, error: null });
  });

  it("C08-UT19 getBuktiLengkap (negatif): error basis data diteruskan, data null", async () => {
    const error = { code: "500", message: "x" };
    expect(await getBuktiLengkap(supabasePalsu({ data: [baris("h1", "2026-11-05T08:00:00Z", "selesai")], error }).client, "uuid-lap"))
      .toEqual({ data: null, error });
  });
});
