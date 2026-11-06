/**
 * Helper HTTP bersama. Pemilik: P1.
 */

/** Error dengan status HTTP. Lempar dari model/controller, ditangkap errorHandler. */
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/**
 * Penanda fitur yang belum dikerjakan. Dipakai stub controller & model starter.
 * Hapus pemanggilannya saat fitur selesai.
 *   throw belumDiimplementasi('P2', 'POST /api/laporan (UC01)');
 */
export function belumDiimplementasi(pemilik, apa) {
  return new HttpError(501, `Belum diimplementasi: ${apa}`, { pemilik });
}

/** Handler stub untuk route yang belum dikerjakan. */
export const stub = (pemilik, apa) => () => {
  throw belumDiimplementasi(pemilik, apa);
};

/** Ambil parameter id numerik dari req.params, lempar 400 jika tidak valid. */
export function paramId(req, nama = 'id') {
  const id = Number(req.params[nama]);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, `Parameter ${nama} tidak valid`);
  return id;
}

/** Ubah kunci foto menjadi URL yang bisa dipakai klien. */
export function urlFoto(foto) {
  if (!foto) return null;
  if (/^https?:\/\//.test(foto)) return foto;
  return `/uploads/${foto}`;
}
