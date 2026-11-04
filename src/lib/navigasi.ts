// Fungsi murni (tanpa Supabase): aman dipakai di client maupun server.

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
