/**
 * Utility Generator ID sesuai spesifikasi proyek CariUang:
 * - id_pengguna           : 001XXX
 * - id_pemberi_jasa       : 002XXX
 * - id_pelanggan          : 003XXX
 * - id_layanan_pelanggan  : 004XXX
 * - id_kategoriJasa       : 005XXX
 * - id_kontrak_pekerjaan  : 006XXX
 * - id_chat               : 007XXX
 * - id_tiket              : 008XXX
 * - id_rating             : 009XXX
 * - id_pengguna_pemberi   : 010XXX
 * - id_pengguna_penerima  : 011XXX
 * - id_notifikasi         : 012XXX
 * - id_penerima           : 013XXX
 */

export const ID_PREFIX = {
  PENGGUNA: '001',
  PEMBERI_JASA: '002',
  PELANGGAN: '003',
  LAYANAN_PELANGGAN: '004',
  KATEGORI_JASA: '005',
  KONTRAK_PEKERJAAN: '006',
  CHAT: '007',
  TIKET: '008',
  RATING: '009',
  PENGGUNA_PEMBERI: '010',
  PENGGUNA_PENERIMA: '011',
  NOTIFIKASI: '012',
  PENERIMA: '013',
} as const;

/**
 * Menghasilkan ID dengan 3 digit prefix dan 3 digit suffix (pola 6 karakter XXX).
 * @param prefix 3 digit kode prefix (misal '005' untuk kategori jasa)
 * @param sequence Nomor urut (opsional). Jika tidak diberikan, akan di-generate nomor acak 3 digit (100-999).
 */
export function generateEntityId(prefix: string, sequence?: number | string): string {
  if (sequence !== undefined) {
    const formatted = String(sequence).padStart(3, '0').slice(-3);
    return `${prefix}${formatted}`;
  }
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `${prefix}${randomSuffix}`;
}
