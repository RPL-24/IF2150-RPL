import type { EventGoogle } from "./google";

export interface EventKalender {
  judul: string;
  mulai: string;
  selesai: string;
  sumber: "google" | "tersedia" | "terpesan" | string;
}

/** KalenderGabungan.gabungkanJadwal — Algo-011. */
export function gabungkanJadwal(
  google: EventGoogle[],
  jadwal: { waktu: string; waktuSelesai: string; status: string }[],
): EventKalender[] {
  const hasil: EventKalender[] = [];
  for (const event of google) {
    const mulai = event.start?.dateTime ?? event.start?.date;
    const selesai = event.end?.dateTime ?? event.end?.date;
    if (!mulai || !selesai) continue;
    hasil.push({
      judul: event.summary?.trim() || "(tanpa judul)",
      mulai,
      selesai,
      sumber: "google",
    });
  }
  for (const slot of jadwal) {
    hasil.push({
      judul: "Sesi konsultasi",
      mulai: slot.waktu,
      selesai: slot.waktuSelesai,
      sumber: slot.status,
    });
  }
  return hasil.sort((a, b) => Date.parse(a.mulai) - Date.parse(b.mulai));
}
