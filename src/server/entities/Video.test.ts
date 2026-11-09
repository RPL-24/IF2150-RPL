import { describe, expect, it } from "vitest";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { isVideoValid } from "@/server/entities/Video";

const MB = 1024 * 1024;

describe("isVideoValid", () => {
  it.each(["a.mp4", "a.mov", "a.mkv", "A.MOV"])("%s valid", (name) => {
    expect(isVideoValid({ name, size: 8 * MB })).toBe(true);
  });

  it.each(["a.avi", "a.webm", "a.jpg"])("%s tidak valid", (name) => {
    expect(isVideoValid({ name, size: MB })).toBe(false);
  });

  it("MIME kosong (umum untuk .mkv) tetap dinilai dari ekstensi", () => {
    const berkas = { name: "VID_0388.mkv", size: MB, type: "" };
    expect(isVideoValid(berkas)).toBe(true);
  });

  it("ukuran 0, pas 10 MB, 10 MB + 1 byte", () => {
    expect(isVideoValid({ name: "a.mp4", size: 0 })).toBe(false);
    expect(isVideoValid({ name: "a.mp4", size: MAX_FILE_SIZE })).toBe(true);
    expect(isVideoValid({ name: "a.mp4", size: MAX_FILE_SIZE + 1 })).toBe(false);
  });
});
