import { describe, expect, test } from "vitest";
import {
  POLA_EXPO_TOKEN,
  POLA_WAKTU,
  escapeLikePattern,
  parseIso8601,
  validasiInput,
  validasiRentangJadwal,
  validasiTokenPush,
  validasiWaktu,
} from "../src/lib/validasi";
import { nimDariEmail } from "../src/config";
import { jamMenitWib } from "../src/jobs/scheduler";

describe("Algo-023 validasiWaktu", () => {
  test.each(["00:00", "07:30", "23:59", "09:05"])("menerima %s", (waktu) => {
    expect(validasiWaktu(waktu)).toBe(true);
    expect(POLA_WAKTU.test(waktu)).toBe(true);
  });

  test.each(["7:00", "24:00", "23:60", "07:5", "0730", "", "07:30:00", null, 730])(
    "menolak %s",
    (waktu) => {
      expect(validasiWaktu(waktu)).toBe(false);
    },
  );
});

describe("Algo-026 validasiInput", () => {
  test("menerima semua isian terisi", () => {
    expect(validasiInput(["pertanyaan", "jawaban"])).toBe(true);
  });

  test("menolak isian kosong atau hanya spasi", () => {
    expect(validasiInput(["ok", ""])).toBe(false);
    expect(validasiInput(["ok", "   "])).toBe(false);
    expect(validasiInput([null])).toBe(false);
    expect(validasiInput([123])).toBe(false);
  });
});

describe("Algo-025 validasiJadwal (rentang)", () => {
  test("menerima rentang ISO-8601 yang wajar", () => {
    const hasil = validasiRentangJadwal("2030-01-01T01:00:00Z", "2030-01-01T02:00:00Z");
    expect(hasil).not.toBeNull();
    expect(hasil!.selesai.getTime()).toBeGreaterThan(hasil!.mulai.getTime());
  });

  test("menolak selesai <= mulai", () => {
    expect(validasiRentangJadwal("2030-01-01T02:00:00Z", "2030-01-01T02:00:00Z")).toBeNull();
    expect(validasiRentangJadwal("2030-01-01T03:00:00Z", "2030-01-01T02:00:00Z")).toBeNull();
  });

  test("menolak format tidak valid / tanpa jam", () => {
    expect(validasiRentangJadwal("2030-01-01", "2030-01-02")).toBeNull();
    expect(validasiRentangJadwal("bukan tanggal", "juga bukan")).toBeNull();
    expect(validasiRentangJadwal(undefined, "2030-01-01T02:00:00Z")).toBeNull();
  });

  test("parseIso8601 menerima timestamp dan menolak sisanya", () => {
    expect(parseIso8601("2030-01-01T01:00:00Z")).toBeInstanceOf(Date);
    expect(parseIso8601("2030-01-01")).toBeNull();
    expect(parseIso8601(42)).toBeNull();
  });
});

describe("Algo-003 pola Expo push token", () => {
  test("menerima ExpoPushToken dan ExponentPushToken", () => {
    expect(validasiTokenPush("ExpoPushToken[abc-123]")).toBe(true);
    expect(validasiTokenPush("ExponentPushToken[xyz]")).toBe(true);
  });

  test("menolak bentuk lain", () => {
    expect(validasiTokenPush("ExpoPushToken[]")).toBe(false);
    expect(validasiTokenPush("ExpoPushTokenabc")).toBe(false);
    expect(validasiTokenPush("fcm:abc")).toBe(false);
    expect(validasiTokenPush(undefined)).toBe(false);
    expect(POLA_EXPO_TOKEN.test("device-token")).toBe(false);
  });
});

describe("Algo-017 escape pola LIKE", () => {
  test("meng-escape %, _, dan ! dengan '!'", () => {
    expect(escapeLikePattern("100%")).toBe("100!%");
    expect(escapeLikePattern("a_b")).toBe("a!_b");
    expect(escapeLikePattern("wow!")).toBe("wow!!");
    expect(escapeLikePattern("biasa")).toBe("biasa");
  });
});

describe("Algo-001 nim dari email kampus", () => {
  test("mengambil local-part pada domain kampus", () => {
    expect(nimDariEmail("13525052@std.stei.itb.ac.id")).toBe("13525052");
    expect(nimDariEmail("18222001@mahasiswa.itb.ac.id")).toBe("18222001");
  });

  test("case-insensitive", () => {
    expect(nimDariEmail("13525052@STD.STEI.ITB.AC.ID")).toBe("13525052");
  });

  test("null untuk domain non-kampus", () => {
    expect(nimDariEmail("orang@gmail.com")).toBeNull();
    expect(nimDariEmail("bukan-email")).toBeNull();
  });
});

describe("Algo-005 jam menit WIB", () => {
  test("menambahkan offset +7 terhadap UTC", () => {
    // 2026-01-01T00:00:00Z -> 07:00 WIB
    expect(jamMenitWib(new Date("2026-01-01T00:00:00Z"))).toBe("07:00");
    expect(jamMenitWib(new Date("2026-01-01T16:59:00Z"))).toBe("23:59");
    expect(jamMenitWib(new Date("2026-01-01T17:00:00Z"))).toBe("00:00");
  });

  test("selalu dua digit", () => {
    expect(jamMenitWib(new Date("2026-01-01T01:05:00Z"))).toBe("08:05");
  });
});
