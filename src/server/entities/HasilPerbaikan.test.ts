import { describe, expect, it } from "vitest";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { validasiBerkas } from "@/server/entities/HasilPerbaikan";

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