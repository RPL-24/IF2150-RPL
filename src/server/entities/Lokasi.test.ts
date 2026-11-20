// Unit test C03 Lokasi (Peran A, tingkat Mendalam). ID test case: C03-UTxx (HIUPL Tabel 4.2.3).
import { describe, expect, it } from "vitest";
import { BATAS_WILAYAH } from "@/lib/batas-wilayah";
import { dalamWilayah, getKoordinat, hitungJarak } from "@/server/entities/Lokasi";

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

const ITB = { latitude: -6.8915, longitude: 107.6107 };
const ALUN_ALUN = { latitude: -6.9218, longitude: 107.607 };

describe("C03 Lokasi.dalamWilayah", () => {
  it.each([
    { nama: "ITB Ganesha", ...ITB },
    { nama: "Alun-alun Bandung", ...ALUN_ALUN },
  ])("C03-UT01 dalamWilayah (normal): $nama di dalam batas Kota Bandung → true", ({ latitude, longitude }) => {
    expect(dalamWilayah({ latitude, longitude })).toBe(true);
  });

  it("C03-UT02 dalamWilayah (normal): titik di tengah polygon kotak → true", () => {
    expect(dalamWilayah({ latitude: 2, longitude: 2 }, KOTAK)).toBe(true);
  });

  it("C03-UT03 dalamWilayah (batas): titik 0,0001° di dalam tepi → true, 0,0001° di luar tepi → false", () => {
    expect(dalamWilayah({ latitude: 0.0001, longitude: 2 }, KOTAK)).toBe(true);
    expect(dalamWilayah({ latitude: -0.0001, longitude: 2 }, KOTAK)).toBe(false);
  });

  it("C03-UT04 dalamWilayah (batas): polygon tidak cembung, titik di dasar bentuk U → true", () => {
    expect(dalamWilayah({ latitude: 0.5, longitude: 2 }, BENTUK_U)).toBe(true);
  });

  it("C03-UT05 dalamWilayah (negatif): titik di celah bentuk U → false", () => {
    expect(dalamWilayah({ latitude: 3, longitude: 2 }, BENTUK_U)).toBe(false);
  });

  it.each([
    { nama: "Lembang", latitude: -6.8117, longitude: 107.6176 },
    { nama: "Jatinangor", latitude: -6.93, longitude: 107.77 },
    { nama: "Cimahi", latitude: -6.8722, longitude: 107.5425 },
    { nama: "Jakarta", latitude: -6.2088, longitude: 106.8456 },
  ])("C03-UT06 dalamWilayah (negatif): $nama di luar batas Kota Bandung → false", ({ latitude, longitude }) => {
    expect(dalamWilayah({ latitude, longitude })).toBe(false);
  });

  it("C03-UT07 dalamWilayah (negatif): koordinat NaN → false", () => {
    expect(dalamWilayah({ latitude: Number.NaN, longitude: 107.6107 })).toBe(false);
  });

  it("C03-UT08 dalamWilayah (negatif): polygon kosong → false", () => {
    expect(dalamWilayah(ITB, [])).toBe(false);
  });

  it("C03-UT09 data BATAS_WILAYAH: semua titik berformat [lat, lng] di sekitar Bandung", () => {
    expect(BATAS_WILAYAH.length).toBeGreaterThanOrEqual(3);
    for (const [lat, lng] of BATAS_WILAYAH) {
      expect(lat).toBeGreaterThan(-7.1);
      expect(lat).toBeLessThan(-6.7);
      expect(lng).toBeGreaterThan(107.4);
      expect(lng).toBeLessThan(107.9);
    }
  });
});

describe("C03 Lokasi.hitungJarak", () => {
  it("C03-UT10 hitungJarak (normal): ITB Ganesha ke Alun-alun Bandung ≈ 3394 m (±50 m)", () => {
    expect(Math.abs(hitungJarak(ITB, ALUN_ALUN) - 3394)).toBeLessThanOrEqual(50);
  });

  it("C03-UT11 hitungJarak (normal): simetris, jarak A→B = B→A", () => {
    expect(hitungJarak(ITB, ALUN_ALUN)).toBe(hitungJarak(ALUN_ALUN, ITB));
  });

  it("C03-UT12 hitungJarak (batas): titik yang sama berjarak 0", () => {
    expect(hitungJarak(ITB, ITB)).toBe(0);
  });

  it("C03-UT13 hitungJarak (batas): 0,0001° lintang ≈ 11,12 m (±0,2 m)", () => {
    const jarak = hitungJarak({ latitude: 0, longitude: 0 }, { latitude: 0.0001, longitude: 0 });
    expect(Math.abs(jarak - 11.12)).toBeLessThanOrEqual(0.2);
  });

  it("C03-UT14 hitungJarak (batas): sekitar radius duplikat 20 m, 0,00017° < 20 m dan 0,00019° > 20 m", () => {
    const asal = { latitude: -6.9, longitude: 107.6 };
    expect(hitungJarak(asal, { latitude: -6.90017, longitude: 107.6 })).toBeLessThan(20);
    expect(hitungJarak(asal, { latitude: -6.90019, longitude: 107.6 })).toBeGreaterThan(20);
  });

  it("C03-UT15 hitungJarak (batas): dua titik berseberangan di bumi ≈ 20.015 km (jarak maksimum)", () => {
    const jarak = hitungJarak({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 180 });
    expect(Math.abs(jarak - 20_015_087)).toBeLessThanOrEqual(1_000);
  });

  it("C03-UT16 hitungJarak (negatif): koordinat NaN → NaN, bukan angka palsu", () => {
    expect(hitungJarak(ITB, { latitude: Number.NaN, longitude: 107.6 })).toBeNaN();
  });
});

describe("C03 Lokasi.getKoordinat", () => {
  it("C03-UT17 getKoordinat (normal): mengembalikan [latitude, longitude]", () => {
    expect(getKoordinat(ITB)).toEqual([-6.8915, 107.6107]);
  });

  it("C03-UT18 getKoordinat (batas): titik (0, 0) → [0, 0]", () => {
    expect(getKoordinat({ latitude: 0, longitude: 0 })).toEqual([0, 0]);
  });

  it("C03-UT19 getKoordinat (negatif): urutan tidak tertukar menjadi [longitude, latitude]", () => {
    const hasil = getKoordinat(ITB);
    expect(hasil).not.toEqual([ITB.longitude, ITB.latitude]);
    expect(hasil[0]).toBe(ITB.latitude);
  });
});
