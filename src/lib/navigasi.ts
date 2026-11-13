// Fungsi murni (tanpa Supabase): aman dipakai di client maupun server.

import type { Enums } from "@/types/database";

const adaKarakterKontrol = (s: string) =>
  [...s].some((c) => c.charCodeAt(0) < 0x20 || c.charCodeAt(0) === 0x7f);

/**
 * Validasi parameter `?next=` agar tidak jadi open redirect.
 * Hanya path relatif internal ("/lapor", "/tugas/LK-0001/hasil?x=1"); selain itu null.
 * Dicek juga versi ter-decode, supaya "/%2F%2Fevil.com" atau "/%0d%0a" ikut ditolak.
 */
export function nextAman(next: string | null | undefined): string | null {
  if (!next || !next.startsWith("/")) return null;

  let decoded: string;
  try {
    decoded = decodeURIComponent(next);
  } catch {
    return null; // percent-encoding rusak
  }

  for (const s of [next, decoded]) {
    if (s.startsWith("//") || s.startsWith("/\\") || adaKarakterKontrol(s)) return null;
  }
  return next;
}

export type MenuNavigasi = { href: string; label: string };

/**
 * Menu header per peran; `null` = tamu. Admin kosong karena menunya sudah ada di AdminSidebar.
 * "Buat Laporan" = langkah 1 skenario UC01 ("Warga memilih menu Buat Laporan").
 */
export function menuNavigasi(peran: Enums<"peran_user"> | null): MenuNavigasi[] {
  switch (peran) {
    case "warga":
      return [
        { href: "/lapor", label: "Buat Laporan" },
        { href: "/status", label: "Laporan Saya" },
      ];
    case "eksekutor":
      return [{ href: "/tugas", label: "Daftar Tugas" }];
    case "admin":
      return [];
    case null:
      return [
        { href: "/status", label: "Peta Laporan" },
        { href: "/login", label: "Masuk" },
        { href: "/daftar", label: "Daftar" },
      ];
  }
}

/** Link aktif jika path sama atau di bawahnya ("/tugas/LK-0001/hasil" → "/tugas"). */
export function linkAktif(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
