export const PESAN_INPUT_TIDAK_VALID = 'Input Takaran / Harga Jual Tidak Valid';
export const PESAN_NAMA_PRODUK_WAJIB = 'Nama produk wajib diisi';
export const PESAN_NAMA_BAHAN_WAJIB = 'Nama bahan baku wajib diisi';
export const PESAN_SATUAN_WAJIB = 'Satuan bahan baku wajib diisi';
export const PESAN_TAKARAN_TIDAK_VALID = 'Takaran harus lebih dari 0';
export const PESAN_HASIL_RESEP_TIDAK_VALID =
  'Hasil resep harus berupa bilangan bulat lebih dari 0';

export function isAngkaPositif(nilai: number): boolean {
  return typeof nilai === 'number' && Number.isFinite(nilai) && nilai > 0;
}

export function isBilanganBulatPositif(nilai: number): boolean {
  return isAngkaPositif(nilai) && Number.isInteger(nilai);
}
