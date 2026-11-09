/**
 * Tipe dan konstanta sesi. Murni (tanpa next/headers, tanpa node:crypto),
 * jadi aman diimpor dari middleware (Edge) maupun dari server.
 *
 * KonteksSesi adalah SATU-SATUNYA sumber idWarga, idKomunitas, idTeknisi,
 * dan idPengurus. Nilai-nilai ini tidak pernah dibaca dari form, body, atau
 * query string (lihat atribut `sesi: KonteksSesi` pada controller di DPPL).
 */

export const PERAN = ['WARGA', 'TEKNISI', 'PENGURUS'] as const;
export type Peran = (typeof PERAN)[number];

/** Hanya akun berstatus DISETUJUI (C06 StatusAkun) yang boleh punya sesi. */
export type KonteksSesi = {
  email: string;
  nama: string;
  statusAkun: 'DISETUJUI';
} & (
  | { peran: 'WARGA'; idWarga: number; idKomunitas: string }
  | { peran: 'TEKNISI'; idTeknisi: string }
  | { peran: 'PENGURUS'; idPengurus: string }
);

export const COOKIE_SESI = 'sesi';
export const SESI_MAKS_UMUR_DETIK = 60 * 60 * 8; // 8 jam

// Sesuaikan dengan konvensi route dari Rionaldo (shell dasbor) bila berbeda.
export const HALAMAN_LOGIN = '/login';
export const DASHBOARD_TUJUAN: Record<Peran, string> = {
  WARGA: '/dashboard/warga',
  TEKNISI: '/dashboard/teknisi',
  PENGURUS: '/dashboard/pengurus',
};

export class GalatAuth extends Error {
  readonly kode: 'TIDAK_LOGIN' | 'DILARANG';
  readonly status: 401 | 403;

  constructor(kode: 'TIDAK_LOGIN' | 'DILARANG', pesan?: string) {
    super(pesan ?? kode);
    this.name = 'GalatAuth';
    this.kode = kode;
    this.status = kode === 'TIDAK_LOGIN' ? 401 : 403;
  }
}

/**
 * Memvalidasi data hasil decode token menjadi KonteksSesi.
 * Hanya field yang dikenal yang diambil; field lain dibuang.
 * Mengembalikan null bila ada yang tidak sah.
 */
export function bentukKonteks(data: unknown): KonteksSesi | null {
  if (typeof data !== 'object' || data === null) return null;
  const d = data as Record<string, unknown>;

  if (typeof d.email !== 'string' || d.email === '') return null;
  if (typeof d.nama !== 'string') return null;
  if (d.statusAkun !== 'DISETUJUI') return null;

  const dasar = {
    email: d.email,
    nama: d.nama,
    statusAkun: 'DISETUJUI' as const,
  };

  switch (d.peran) {
    case 'WARGA':
      if (!Number.isInteger(d.idWarga)) return null;
      if (typeof d.idKomunitas !== 'string' || d.idKomunitas === '') return null;
      return {
        ...dasar,
        peran: 'WARGA',
        idWarga: d.idWarga as number,
        idKomunitas: d.idKomunitas,
      };
    case 'TEKNISI':
      if (typeof d.idTeknisi !== 'string' || d.idTeknisi === '') return null;
      return { ...dasar, peran: 'TEKNISI', idTeknisi: d.idTeknisi };
    case 'PENGURUS':
      if (typeof d.idPengurus !== 'string' || d.idPengurus === '') return null;
      return { ...dasar, peran: 'PENGURUS', idPengurus: d.idPengurus };
    default:
      return null;
  }
}