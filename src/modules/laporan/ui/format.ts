import type { StatusLaporan } from "@/contracts";

// "28 Okt 2026 · 08.10 WIB", dihitung dari waktu ISO.
export function waktuWib(iso: string): string {
  const bagian = Object.fromEntries(
    new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value]),
  );
  return `${bagian.day} ${bagian.month} ${bagian.year} · ${bagian.hour}.${bagian.minute} WIB`;
}

// Judul dan keterangan tiap peristiwa pada riwayat (mockup I-07 dan I-11).
export const PERISTIWA: Record<StatusLaporan, { judul: string; isi: string }> = {
  MENUNGGU: { judul: "Laporan diajukan", isi: "MENUNGGU · Waktu pengajuan laporan." },
  SEDANG_DIPERBAIKI: { judul: "Perbaikan dimulai", isi: "SEDANG_DIPERBAIKI · Teknisi menangani gangguan." },
  SELESAI: { judul: "Perbaikan selesai", isi: "SELESAI · Pasokan kembali diperiksa." },
};
