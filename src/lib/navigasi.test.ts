import { describe, expect, it } from "vitest";
import { nextAman } from "@/lib/navigasi";

describe("nextAman", () => {
  it.each(["/lapor", "/tugas/LK-0001/hasil?x=1"])("menerima path internal %s", (p) => {
    expect(nextAman(p)).toBe(p);
  });

  it.each([
    null,
    undefined,
    "",
    "lapor",
    "//evil.com",
    "/\\evil.com",
    "https://evil.com",
    "javascript:alert(1)",
    "/%0d%0a",
    "/%2F%2Fevil.com",
    "/%E0%A4%A",
  ])("menolak %s", (p) => {
    expect(nextAman(p)).toBeNull();
  });
});
