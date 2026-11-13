/**
 * App-wide error types and the JSON error envelope.
 *
 * Status codes (not fixed by the DPPL; documented in the route README):
 *   400 malformed body, 401 unauthenticated, 403 wrong role, 404 not found,
 *   409 conflict (slot taken / calendar clash), 422 validation, 502 upstream.
 */

export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly kode: string,
    message: string,
    readonly detail?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }

  toJSON() {
    return {
      error: { kode: this.kode, pesan: this.message, detail: this.detail },
    };
  }
}

export const gagalAuth = (pesan = "Sesi tidak valid atau sudah berakhir") =>
  new AppError(401, "TIDAK_TERAUTENTIKASI", pesan);

export const gagalPeran = (peran: string) =>
  new AppError(403, "PERAN_TIDAK_DIIZINKAN", `Rute ini hanya untuk ${peran}`);

export const permintaanTidakValid = (pesan: string, detail?: unknown) =>
  new AppError(400, "PERMINTAAN_TIDAK_VALID", pesan, detail);

export const gagalValidasi = (pesan: string, detail?: unknown) =>
  new AppError(422, "VALIDASI_GAGAL", pesan, detail);

export const tidakDitemukan = (pesan = "Data tidak ditemukan") =>
  new AppError(404, "TIDAK_DITEMUKAN", pesan);

export const bentrokJadwal = (pesan = "Jadwal bentrok dengan event lain") =>
  new AppError(409, "JADWAL_BENTROK", pesan);

export const slotSudahDipesan = (pesan = "Slot sudah dipesan orang lain") =>
  new AppError(409, "SLOT_SUDAH_DIPESAN", pesan);

export const gagalUpstream = (pesan: string) =>
  new AppError(502, "GAGAL_LAYANAN_EKSTERNAL", pesan);

/** Issue #11 — Google Calendar conflict is confirmable by an explicit override. */
export const bentrokGoogleCalendar = (pesan = "Ada jadwal Google Calendar pada hari yang sama") =>
  new AppError(409, "GOOGLE_CALENDAR_CONFLICT", pesan);
