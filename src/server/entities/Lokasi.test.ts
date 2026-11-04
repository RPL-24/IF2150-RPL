import { describe, expect, it } from "vitest";
import { BATAS_WILAYAH } from "@/lib/batas-wilayah";
import { dalamWilayah, hitungJarak } from "@/server/entities/Lokasi";

const KOTAK: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [0, 4],
  [4, 4],
  [4, 0],
];

const BENTUK_U: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [0, 4],
  [4, 4],
  [4, 3],
  [1, 3],
  [1, 1],
  [4, 1],
  [4, 0],
];

describe("dalamWilayah - polygon sederhana", () => {
  it("titik di tengah kotak ada di dalam", () => {
    expect(dalamWilayah({ latitude: 2, longitude: 2 }, KOTAK)).toBe(true);
  });

  it("titik di samping kotak ada di luar", () => {
    expect(dalamWilayah({ latitude: 0.5, longitude: 5 }, KOTAK)).toBe(false);
  });

  it("titik di celah bentuk U ada di luar", () => {
    expect(dalamWilayah({ latitude: 3, longitude: 2 }, BENTUK_U)).toBe(false);
  });

  it("titik di dasar bentuk U ada di dalam", () => {
    expect(dalamWilayah({ latitude: 0.5, longitude: 2 }, BENTUK_U)).toBe(true);
  });
});

describe("dalamWilayah - batas Kota Bandung", () => {
  it.each([
    { nama: "ITB Ganesha", latitude: -6.8915, longitude: 107.6107 },
    { nama: "Alun-alun Bandung", latitude: -6.9218, longitude: 107.607 },
  ])("$nama di dalam", ({ latitude, longitude }) => {
    expect(dalamWilayah({ latitude, longitude })).toBe(true);
  });

  it.each([
    { nama: "Lembang", latitude: -6.8117, longitude: 107.6176 },
    { nama: "Jatinangor", latitude: -6.93, longitude: 107.77 },
    { nama: "Cimahi", latitude: -6.8722, longitude: 107.5425 },
  ])("$nama di luar", ({ latitude, longitude }) => {
    expect(dalamWilayah({ latitude, longitude })).toBe(false);
  });

  it("semua titik BATAS_WILAYAH berformat [lat, lng] di sekitar Bandung", () => {
    for (const [lat, lng] of BATAS_WILAYAH) {
      expect(lat).toBeGreaterThan(-7.1);
      expect(lat).toBeLessThan(-6.7);
      expect(lng).toBeGreaterThan(107.4);
      expect(lng).toBeLessThan(107.9);
    }
  });
});

describe("hitungJarak", () => {
  const ITB = { latitude: -6.8915, longitude: 107.6107 };
  const ALUN_ALUN = { latitude: -6.9218, longitude: 107.607 };

  it("titik yang sama berjarak 0", () => {
    expect(hitungJarak(ITB, ITB)).toBe(0);
  });

  it("simetris", () => {
    expect(hitungJarak(ITB, ALUN_ALUN)).toBe(hitungJarak(ALUN_ALUN, ITB));
  });

  it("ITB Ganesha ke Alun-alun Bandung ≈ 3394 m", () => {
    expect(Math.abs(hitungJarak(ITB, ALUN_ALUN) - 3394)).toBeLessThanOrEqual(50);
  });

  it("0.0001° lintang di khatulistiwa ≈ 11.12 m", () => {
    const jarak = hitungJarak({ latitude: 0, longitude: 0 }, { latitude: 0.0001, longitude: 0 });
    expect(Math.abs(jarak - 11.12)).toBeLessThanOrEqual(0.2);
  });
});
