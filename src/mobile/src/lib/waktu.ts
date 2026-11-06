/**
 * Date and time formatting for display. The backend stores DateTime as
 * ISO 8601 (UTC) and Time as "HH:MM" (DPPL 5.37); screens show WIB in Indonesian.
 */

const ZONA = 'Asia/Jakarta';

/** "Jumat, 30 Oktober 2026" */
export function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: ZONA,
  });
}

/** "10.00" */
export function formatJam(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: ZONA,
  });
}

/** "10.00–11.00" */
export function formatRentangJam(mulaiIso: string, selesaiIso: string): string {
  return `${formatJam(mulaiIso)}–${formatJam(selesaiIso)}`;
}

/** "07:00" (Time from the backend) to "07.00". */
export function formatWaktuHarian(hhmm: string): string {
  return hhmm.replace(':', '.');
}

/** Greeting for the hour in WIB: pagi, siang, sore, or malam. */
export function sapaan(sekarang: Date = new Date()): string {
  const jam = Number(
    sekarang.toLocaleTimeString('en-GB', { hour: '2-digit', hour12: false, timeZone: ZONA }),
  );
  if (jam >= 4 && jam < 11) return 'Selamat pagi';
  if (jam >= 11 && jam < 15) return 'Selamat siang';
  if (jam >= 15 && jam < 18) return 'Selamat sore';
  return 'Selamat malam';
}

/** "baru saja", "5 menit yang lalu", "3 jam yang lalu", or the date when older than a day. */
export function formatRelatif(iso: string, sekarang: Date = new Date()): string {
  const menit = Math.floor((sekarang.getTime() - new Date(iso).getTime()) / 60_000);
  if (menit < 1) return 'baru saja';
  if (menit < 60) return `${menit} menit yang lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam yang lalu`;
  return `pada ${formatTanggal(iso)}`;
}
