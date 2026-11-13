import type { EventKalender } from '@/api';

/** Google all-day events use YYYY-MM-DD and an exclusive end date.
 * Parse date-only values as local dates; `new Date("YYYY-MM-DD")` treats them
 * as UTC and can move them to the previous day in Indonesian timezones.
 */
export function tanggalEvent(nilai: string): Date {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(nilai);
  if (dateOnly) {
    return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
  }
  return new Date(nilai);
}

export function eventPadaTanggal(event: EventKalender, tanggal: Date): boolean {
  const mulai = tanggalEvent(event.mulai);
  const selesai = tanggalEvent(event.selesai);
  if (Number.isNaN(mulai.getTime()) || Number.isNaN(selesai.getTime())) return false;

  const awalHari = new Date(tanggal);
  awalHari.setHours(0, 0, 0, 0);
  const akhirHari = new Date(awalHari);
  akhirHari.setDate(akhirHari.getDate() + 1);

  // Event intervals are [start, end); this also includes multi-day events.
  return mulai < akhirHari && selesai > awalHari;
}

export function labelWaktuEvent(event: EventKalender): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(event.mulai)
    && /^\d{4}-\d{2}-\d{2}$/.test(event.selesai)) return 'Seharian';

  const mulai = tanggalEvent(event.mulai);
  const selesai = tanggalEvent(event.selesai);
  if (Number.isNaN(mulai.getTime()) || Number.isNaN(selesai.getTime())) return '--:--';
  const opsi: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  return `${mulai.toLocaleTimeString('id-ID', opsi)} – ${selesai.toLocaleTimeString('id-ID', opsi)}`;
}

/** Badge and colour for an event's source (I-06-05, I-06-06). */
export function penandaEvent(sumber: string): {
  label: string;
  lencana: 'info' | 'merah' | 'netral';
  garis: 'info' | 'merah' | 'teksSekunder';
} {
  if (sumber === 'google') return { label: 'Google Calendar', lencana: 'info', garis: 'info' };
  if (sumber === 'terpesan') return { label: 'Sesi saya', lencana: 'merah', garis: 'merah' };
  return { label: 'Slot tersedia', lencana: 'netral', garis: 'teksSekunder' };
}

/** "Bersama Dr. Raisa (Psikologi Klinis)" for consultation entries, otherwise `null`. */
export function labelKonsultan(event: EventKalender): string | null {
  if (!event.konsultan) return null;
  return event.spesialisasi
    ? `Bersama ${event.konsultan} (${event.spesialisasi})`
    : `Bersama ${event.konsultan}`;
}
