import { describe, expect, it } from "vitest";
import { linkAktif, menuNavigasi, nextAman } from "@/lib/navigasi";

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

describe("menuNavigasi", () => {
  const href = (peran: Parameters<typeof menuNavigasi>[0]) => menuNavigasi(peran).map((m) => m.href);

  it("warga: Buat Laporan dan Laporan Saya", () => {
    expect(menuNavigasi("warga")).toEqual([
      { href: "/lapor", label: "Buat Laporan" },
      { href: "/status", label: "Laporan Saya" },
    ]);
  });

  it("tamu: peta publik, masuk, daftar", () => {
    expect(href(null)).toEqual(["/status", "/login", "/daftar"]);
  });

  it("eksekutor: daftar tugas", () => {
    expect(href("eksekutor")).toEqual(["/tugas"]);
  });

  it("admin: kosong (menu ada di AdminSidebar)", () => {
    expect(href("admin")).toEqual([]);
  });
});

describe("linkAktif", () => {
  it.each([
    ["/tugas", "/tugas", true],
    ["/tugas/LK-0001/hasil", "/tugas", true],
    ["/status", "/status", true],
    ["/statusx", "/status", false],
    ["/lapor", "/status", false],
  ])("%s vs %s → %s", (pathname, h, hasil) => {
    expect(linkAktif(pathname, h)).toBe(hasil);
  });
});
