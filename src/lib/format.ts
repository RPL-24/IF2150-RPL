// Fungsi murni: format tanggal/waktu untuk UI (DPPL Bab 6, mis. "24 Okt 2026", "20 Okt, 19.02").
// Zona waktu tetap Asia/Jakarta supaya hasil render server dan client sama (tidak hydration mismatch).

const ZONA = "Asia/Jakarta";

/** "24 Okt 2026" (I02-05). */
export function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: ZONA });
}

/** "24 Okt 2026, 19.02" (I03-08, I02-08). */
export function formatWaktu(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: ZONA,
  });
}
