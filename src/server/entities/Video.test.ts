// Unit test C05 Video (Peran A, tingkat Mendalam). ID test case: C05-UTxx (HIUPL Tabel 4.2.5).
import { describe, expect, it } from "vitest";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { isVideoValid } from "@/server/entities/Video";

const MB = 1024 * 1024;

describe("C05 Video.isVideoValid", () => {
  it.each(["a.mp4", "a.mov", "a.mkv"])("C05-UT01 isVideoValid (normal): %s 8 MB → true", (name) => {
    expect(isVideoValid({ name, size: 8 * MB })).toBe(true);
  });

  it("C05-UT02 isVideoValid (normal): ekstensi huruf besar A.MOV → true", () => {
    expect(isVideoValid({ name: "A.MOV", size: 8 * MB })).toBe(true);
  });

  it("C05-UT03 isVideoValid (normal): MIME kosong (umum untuk .mkv) tetap dinilai dari ekstensi → true", () => {
    const berkas = { name: "VID_0388.mkv", size: MB, type: "" };
    expect(isVideoValid(berkas)).toBe(true);
  });

  it("C05-UT04 isVideoValid (batas): tepat 10 MB → true", () => {
    expect(isVideoValid({ name: "a.mp4", size: MAX_FILE_SIZE })).toBe(true);
  });

  it("C05-UT05 isVideoValid (batas): 10 MB + 1 byte → false", () => {
    expect(isVideoValid({ name: "a.mp4", size: MAX_FILE_SIZE + 1 })).toBe(false);
  });

  it("C05-UT06 isVideoValid (batas): ukuran terkecil 1 byte → true", () => {
    expect(isVideoValid({ name: "a.mov", size: 1 })).toBe(true);
  });

  it("C05-UT07 isVideoValid (negatif): ukuran 0 byte → false", () => {
    expect(isVideoValid({ name: "a.mp4", size: 0 })).toBe(false);
  });

  it.each(["a.avi", "a.webm", "a.jpg", "a.png", "mp4"])("C05-UT08 isVideoValid (negatif): format %s → false", (name) => {
    expect(isVideoValid({ name, size: MB })).toBe(false);
  });
});
