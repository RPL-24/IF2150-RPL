/**
 * [Naufal Hasbialhaq] Service Katalog & Pendaftaran Layanan Penyedia Jasa
 * Traceability: UC01 (Mendaftarkan Jasa), UC02 (Memilih Jasa), KF04, KF05,
 * Kelas DPPL C13 KategoriJasa, C14 KategoriJasaUI, C04 PemberiJasa, C05 PemberiJasaUI,
 * Antarmuka UI-16 (Daftar Penyedia Jasa)
 */

import { apiGet, apiPost, Role } from './api';

/**
 * Daftar pilihan kategori / jenis jasa sesuai spesifikasi DPPL UI-16-06
 */
export const JENIS_JASA_OPTIONS = [
  { label: 'Servis', value: 'Servis' },
  { label: 'Kebersihan', value: 'Kebersihan' },
  { label: 'Jahit', value: 'Jahit' },
  { label: 'Renovasi', value: 'Renovasi' },
  { label: 'Desain', value: 'Desain' },
  { label: 'Lainnya', value: 'Lainnya' },
] as const;

export type JenisJasa = (typeof JENIS_JASA_OPTIONS)[number]['value'];

export interface KategoriJasaRecord {
  idKategoriJasa: string;
  jenisJasa: string;
  deskripsiJasa: string;
  tarif: number;
  jamKerja: string;
  daerahKerja: string;
}

export interface PemberiJasaDetail {
  idPemberiJasa: string;
  namaPengguna: string;
  namaToko: string;
  nomorTelpon: string;
  email: string;
  role?: Role;
  avatarUrl: string | null;
  akumulasiRating: number;
  idKategoriJasa: string | null;
  jenisJasa: string | null;
  deskripsiJasa: string | null;
  tarif: number | null;
  jamKerja: string | null;
  daerahKerja: string | null;
  latitude: number | null;
  longitude: number | null;
  statusKetersediaan: string;
  isOnline: boolean;
  jarakKm?: number | null;
}

export interface RegisterPenyediaJasaPayload {
  idPemberiJasa: string;
  namaToko: string;
  jenisJasa: string;
  deskripsiJasa: string;
  tarif: number;
  jamKerja: string;
  daerahKerja: string;
  latitude?: number;
  longitude?: number;
}

export interface RegisterPenyediaJasaResult {
  kategori: KategoriJasaRecord;
  pemberiJasa: PemberiJasaDetail | null;
  role: Role;
}

/**
 * Mengirimkan data pendaftaran penyedia jasa ke endpoint POST /api/services/register (UC01)
 */
export async function registerServiceProvider(
  payload: RegisterPenyediaJasaPayload
): Promise<RegisterPenyediaJasaResult> {
  return apiPost<RegisterPenyediaJasaResult>('/services/register', payload);
}

/**
 * Mengambil seluruh daftar kategori jasa dari endpoint GET /api/services/categories (Q-015)
 */
export async function fetchServiceCategories(): Promise<KategoriJasaRecord[]> {
  return apiGet<KategoriJasaRecord[]>('/services/categories');
}
