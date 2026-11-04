export const PESAN_INPUT_TIDAK_VALID = 'Input Takaran / Harga Jual Tidak Valid';

export function isAngkaPositif(nilai: number): boolean {
  return typeof nilai === 'number' && Number.isFinite(nilai) && nilai > 0;
}
