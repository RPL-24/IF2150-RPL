import { describe, expect, it } from "vitest";
import { formatTanggal, formatWaktu } from "@/lib/format";

describe("format waktu", () => {
  it("memakai zona Asia/Jakarta (UTC+7)", () => {
    expect(formatTanggal("2026-10-24T18:00:00Z")).toBe("25 Okt 2026");
    expect(formatWaktu("2026-10-24T12:02:00.123456+00:00")).toBe("24 Okt 2026, 19.02");
  });
});
