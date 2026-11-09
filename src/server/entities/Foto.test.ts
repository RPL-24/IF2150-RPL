import { describe, expect, it } from "vitest";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { formatDariNama, isFotoValid, urlMedia } from "@/server/entities/Foto";

const MB = 1024 * 1024;

describe("formatDariNama", () => {
  it.each([
    ["IMG_2041.jpg", "jpg"],
    ["foto.JPEG", "jpg"],
    ["a.b.PNG", "png"],
    ["VID.MKV", "mkv"],
    ["tanpa-ekstensi", ""],
  ])("%s → %s", (nama, hasil) => {
    expect(formatDariNama(nama)).toBe(hasil);
  });
});

describe("isFotoValid", () => {
  it.each(["a.jpg", "a.jpeg", "a.png", "A.JPG", "A.PNG"])("%s valid", (name) => {
    expect(isFotoValid({ name, size: 2 * MB })).toBe(true);
  });

  it.each(["a.gif", "a.webp", "a.mp4", "a.heic", "jpg", "a.constructor"])("%s tidak valid", (name) => {
    expect(isFotoValid({ name, size: MB })).toBe(false);
  });

  it("ukuran 0 tidak valid", () => {
    expect(isFotoValid({ name: "a.jpg", size: 0 })).toBe(false);
  });

  it("pas 10 MB valid, 10 MB + 1 byte tidak", () => {
    expect(isFotoValid({ name: "a.jpg", size: MAX_FILE_SIZE })).toBe(true);
    expect(isFotoValid({ name: "a.jpg", size: MAX_FILE_SIZE + 1 })).toBe(false);
  });
});

describe("urlMedia", () => {
  it("membentuk URL publik bucket media", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://x.supabase.co";
    expect(urlMedia("laporan/u/f.jpg")).toBe("https://x.supabase.co/storage/v1/object/public/media/laporan/u/f.jpg");
  });
});
