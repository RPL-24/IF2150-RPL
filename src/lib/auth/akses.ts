/**
 * Aturan akses per rute, ditulis sebagai fungsi murni (tanpa Next) agar bisa diuji.
 * Dipakai oleh src/middleware.ts. Aman untuk Edge.
 *
 * `sesi` berasal dari bacaToken(), yang hanya menghasilkan KonteksSesi untuk
 * akun berstatus DISETUJUI. Jadi sesi null berarti belum login, token rusak,
 * kedaluwarsa, atau statusnya bukan DISETUJUI.
 *
 * Penegakan per peran untuk /api/* tetap dilakukan handler lewat wajibPeran()
 * (lapis kedua); di sini API hanya dipastikan sudah login.
 */
import {
  DASHBOARD_TUJUAN,
  HALAMAN_LOGIN,
  type KonteksSesi,
  type Peran,
} from './konteks';

// Sesuaikan dengan konvensi route (Raffi/Rionaldo) bila berbeda.
/** Halaman untuk yang belum login; yang sudah login dialihkan ke dasbornya. */
export const HALAMAN_TAMU = ['/login', '/registrasi'];
/** Tanpa sesi: login/registrasi, dan telemetri perangkat (bukan pengguna). */
export const PREFIX_PUBLIK = ['/api/auth', '/api/telemetri'];

export type KeputusanAkses =
  | { aksi: 'lanjut' }
  | { aksi: 'redirect'; ke: string }
  | { aksi: 'tolak'; status: 401 };

function cocok(pathname: string, awalan: string): boolean {
  return pathname === awalan || pathname.startsWith(awalan + '/');
}

export function tentukanAkses(
  pathname: string,
  search: string,
  sesi: KonteksSesi | null,
): KeputusanAkses {
  if (PREFIX_PUBLIK.some((a) => cocok(pathname, a))) return { aksi: 'lanjut' };

  const api = cocok(pathname, '/api');
  const halamanTamu = HALAMAN_TAMU.some((a) => cocok(pathname, a));

  if (!sesi) {
    if (api) return { aksi: 'tolak', status: 401 };
    if (halamanTamu) return { aksi: 'lanjut' };
    // Halaman login wajib memvalidasi `next` (diawali "/" dan bukan "//").
    const next =
      pathname === '/' ? '' : `?next=${encodeURIComponent(pathname + search)}`;
    return { aksi: 'redirect', ke: HALAMAN_LOGIN + next };
  }

  if (api) return { aksi: 'lanjut' };

  const tujuan = DASHBOARD_TUJUAN[sesi.peran];
  if (pathname === '/' || halamanTamu) return { aksi: 'redirect', ke: tujuan };

  for (const [peran, awalan] of Object.entries(DASHBOARD_TUJUAN) as [Peran, string][]) {
    if (cocok(pathname, awalan) && peran !== sesi.peran) {
      return { aksi: 'redirect', ke: tujuan };
    }
  }
  return { aksi: 'lanjut' };
}