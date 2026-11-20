// Unit test C04 Foto (Peran A, tingkat Mendalam). ID test case: C04-UTxx (HIUPL Tabel 4.2.4).
import { afterEach, describe, expect, it, vi } from "vitest";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { formatDariNama, isFotoValid, ukuranValid, urlMedia } from "@/server/entities/Foto";

const MB = 1024 * 1024;

describe("C04 Foto.formatDariNama", () => {
  it("C04-UT01 formatDariNama (normal): IMG_2041.jpg → jpg", () => {
    expect(formatDariNama("IMG_2041.jpg")).toBe("jpg");
  });

  it.each([
    ["foto.JPEG", "jpg"],
    ["a.b.PNG", "png"],
    ["VID.MKV", "mkv"],
  ])("C04-UT02 formatDariNama (batas): %s → %s (huruf besar, jpeg, titik ganda)", (nama, hasil) => {
    expect(formatDariNama(nama)).toBe(hasil);
  });

  it.each(["tanpa-ekstensi", "foto."])("C04-UT03 formatDariNama (negatif): %s → string kosong", (nama) => {
    expect(formatDariNama(nama)).toBe("");
  });
});

describe("C04 Foto.isFotoValid", () => {
  it.each(["a.jpg", "a.jpeg", "a.png", "A.JPG", "A.PNG"])("C04-UT04 isFotoValid (normal): %s 2 MB → true", (name) => {
    expect(isFotoValid({ name, size: 2 * MB })).toBe(true);
  });

  it("C04-UT05 isFotoValid (batas): tepat 10 MB → true", () => {
    expect(isFotoValid({ name: "a.jpg", size: MAX_FILE_SIZE })).toBe(true);
  });

  it("C04-UT06 isFotoValid (batas): 10 MB + 1 byte → false", () => {
    expect(isFotoValid({ name: "a.jpg", size: MAX_FILE_SIZE + 1 })).toBe(false);
  });

  it("C04-UT07 isFotoValid (batas): ukuran terkecil 1 byte → true", () => {
    expect(isFotoValid({ name: "a.png", size: 1 })).toBe(true);
  });

  it.each(["a.gif", "a.webp", "a.mp4", "a.heic", "a.pdf", "jpg", "a.constructor"])(
    "C04-UT08 isFotoValid (negatif): format %s → false",
    (name) => {
      expect(isFotoValid({ name, size: MB })).toBe(false);
    },
  );

  it.each([0, -1])("C04-UT09 isFotoValid (negatif): ukuran %i byte → false", (size) => {
    expect(isFotoValid({ name: "a.jpg", size })).toBe(false);
  });
});

describe("C04 Foto.ukuranValid", () => {
  it("C04-UT10 ukuranValid (normal): 2 MB → true", () => {
    expect(ukuranValid(2 * MB)).toBe(true);
  });

  it("C04-UT11 ukuranValid (batas): tepat 10 MB → true, 10 MB + 1 byte → false", () => {
    expect(ukuranValid(MAX_FILE_SIZE)).toBe(true);
    expect(ukuranValid(MAX_FILE_SIZE + 1)).toBe(false);
  });

  it.each([0, -5, Number.NaN])("C04-UT12 ukuranValid (negatif): %s → false", (ukuran) => {
    expect(ukuranValid(ukuran)).toBe(false);
  });
});

describe("C04 Foto.urlMedia", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("C04-UT13 urlMedia (normal): membentuk URL publik bucket media", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co");
    expect(urlMedia("laporan/u/f.jpg")).toBe("https://x.supabase.co/storage/v1/object/public/media/laporan/u/f.jpg");
  });

  it("C04-UT14 urlMedia (batas): path kosong → URL folder bucket", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co");
    expect(urlMedia("")).toBe("https://x.supabase.co/storage/v1/object/public/media/");
  });
});
