import { describe, expect, it } from "vitest";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { validasiBerkas, pilihBuktiSelesai, type BarisHasil } from "@/server/entities/HasilPerbaikan";

const MB = 1024 * 1024;
const berkas = (name: string, size = 2 * MB) => ({ name, size });

describe("validasiBerkas", () => {
  it("foto JPG/PNG dan video MP4/MOV/MKV valid", () => {
    expect(
      validasiBerkas([berkas("a.jpg"), berkas("b.PNG")], [berkas("c.mp4"), berkas("d.mov"), berkas("e.mkv")]),
    ).toBe(true);
  });

  it("tanpa video tetap valid (video opsional)", () => {
    expect(validasiBerkas([berkas("a.jpg")], [])).toBe(true);
  });

  it("daftar kosong valid; kelengkapan dicek validasiForm, bukan di sini", () => {
    expect(validasiBerkas([], [])).toBe(true);
  });

  it.each(["a.gif", "a.heic", "a.mp4"])("foto %s ditolak", (name) => {
    expect(validasiBerkas([berkas("ok.jpg"), berkas(name)], [])).toBe(false);
  });

  it.each(["a.avi", "a.webm", "a.jpg"])("video %s ditolak", (name) => {
    expect(validasiBerkas([berkas("ok.jpg")], [berkas(name)])).toBe(false);
  });

  it("pas 10 MB valid, 10 MB + 1 byte ditolak", () => {
    expect(validasiBerkas([berkas("a.jpg", MAX_FILE_SIZE)], [berkas("b.mp4", MAX_FILE_SIZE)])).toBe(true);
    expect(validasiBerkas([berkas("a.jpg", MAX_FILE_SIZE + 1)], [])).toBe(false);
    expect(validasiBerkas([berkas("a.jpg")], [berkas("b.mp4", MAX_FILE_SIZE + 1)])).toBe(false);
  });

  it("berkas 0 byte ditolak", () => {
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

  it("null jika belum ada hasil perbaikan", () => {
    expect(pilihBuktiSelesai([])).toBeNull();
  });

  it("null jika hasil belum dievaluasi", () => {
    expect(pilihBuktiSelesai([hasil("h1", "2026-11-01T08:00:00Z", [])])).toBeNull();
  });

  it("null jika semua hasil dikembalikan", () => {
    expect(
      pilihBuktiSelesai([
        hasil("h1", "2026-11-01T08:00:00Z", ["minta_ulang_bukti"]),
        hasil("h2", "2026-11-02T08:00:00Z", ["belum_selesai"]),
      ]),
    ).toBeNull();
  });

  it("memilih hasil yang dikonfirmasi selesai, bukan hasil lama yang dikembalikan", () => {
    const bukti = pilihBuktiSelesai([
      hasil("h1", "2026-11-01T08:00:00Z", ["minta_ulang_bukti"]),
      hasil("h2", "2026-11-03T08:00:00Z", ["selesai"]),
    ]);
    expect(bukti?.id_hasil).toBe("h2");
  });

  it("jika ada beberapa yang selesai, ambil yang terbaru", () => {
    const bukti = pilihBuktiSelesai([
      hasil("h2", "2026-11-03T08:00:00Z", ["selesai"]),
      hasil("h3", "2026-11-05T08:00:00Z", ["selesai"]),
    ]);
    expect(bukti?.id_hasil).toBe("h3");
  });

  it("tidak menyertakan data evaluasi di hasilnya", () => {
    const bukti = pilihBuktiSelesai([hasil("h1", "2026-11-01T08:00:00Z", ["selesai"])]);
    expect(bukti).toEqual({
      id_hasil: "h1",
      catatan: "Catatan h1",
      waktu_unggah: "2026-11-01T08:00:00Z",
      foto: [{ path: "hasil/u/h1.jpg" }],
      video: [],
    });
  });

  it("tidak mengubah urutan daftar asli", () => {
    const daftar = [hasil("h1", "2026-11-01T08:00:00Z", ["selesai"]), hasil("h2", "2026-11-03T08:00:00Z", ["selesai"])];
    pilihBuktiSelesai(daftar);
    expect(daftar.map((h) => h.id_hasil)).toEqual(["h1", "h2"]);
  });
});