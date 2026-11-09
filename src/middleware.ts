/**
 * Middleware pembatas sesi, peran, dan status akun DISETUJUI.
 * Hanya mengimpor modul yang aman untuk Edge (session, akses, konteks).
 *
 * Catatan Next.js 16: file ini diganti namanya menjadi `proxy.ts` dan fungsinya
 * `proxy`. Bila proyek memakai Next 16 dan ingin mengikuti konvensi baru,
 * ubah nama file dan nama fungsi; isinya tidak perlu diubah.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { tentukanAkses } from '@/lib/auth/akses';
import { COOKIE_SESI } from '@/lib/auth/konteks';
import { bacaToken } from '@/lib/auth/session';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const token = req.cookies.get(COOKIE_SESI)?.value;

  let sesi: Awaited<ReturnType<typeof bacaToken>>;
  try {
    sesi = await bacaToken(token);
  } catch (galat) {
    // Umumnya SESSION_SECRET belum diatur. Gagal tertutup dengan pesan jelas.
    console.error('[middleware] Gagal membaca sesi:', galat);
    return NextResponse.json(
      { galat: 'KONFIGURASI_SERVER', pesan: 'SESSION_SECRET belum diatur. Lihat src/.env.example.' },
      { status: 500 },
    );
  }

  const keputusan = tentukanAkses(pathname, search, sesi);

  let respons: NextResponse;
  switch (keputusan.aksi) {
    case 'tolak':
      respons = NextResponse.json(
        { galat: 'TIDAK_LOGIN' },
        { status: keputusan.status },
      );
      break;
    case 'redirect':
      respons = NextResponse.redirect(new URL(keputusan.ke, req.url));
      break;
    default:
      respons = NextResponse.next();
  }

  // Cookie ada tetapi tidak sah (rusak/kedaluwarsa): bersihkan.
  if (token && !sesi) respons.cookies.delete(COOKIE_SESI);

  return respons;
}

export const config = {
  // Lewati aset statis dan berkas berekstensi (gambar, ikon, dst).
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};