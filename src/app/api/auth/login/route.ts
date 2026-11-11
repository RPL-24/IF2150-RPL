/**
 * POST /api/auth/login (UC13).
 * Tanpa sesi: jalur /api/auth dikecualikan di middleware.
 * KonteksSesi hanya dipakai untuk membuat cookie dan tidak dikirim ke klien.
 */
import { NextResponse } from 'next/server';
import { buatSesi } from '@/lib/auth/server';
import { akunController } from '@/modules/akun';

const STATUS_GAGAL = {
  KREDENSIAL_SALAH: 401,
  MENUNGGU_PERSETUJUAN: 403,
  DITOLAK: 403,
  AKUN_TIDAK_LENGKAP: 403,
} as const;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { berhasil: false, pesan: 'Permintaan tidak valid.' },
      { status: 400 },
    );
  }

  const isi = (typeof body === 'object' && body !== null ? body : {}) as Record<
    string,
    unknown
  >;

  try {
    const hasil = await akunController.login(isi.email, isi.password);

    if (!hasil.berhasil) {
      return NextResponse.json(
        { berhasil: false, kode: hasil.kode, pesan: hasil.pesan },
        { status: STATUS_GAGAL[hasil.kode] },
      );
    }

    await buatSesi(hasil.sesi);
    return NextResponse.json({ berhasil: true, tujuan: hasil.tujuan });
  } catch (galat) {
    // Jangan mencatat body (berisi kata sandi).
    console.error('[login] Gagal memproses login:', galat);
    return NextResponse.json(
      { berhasil: false, pesan: 'Terjadi kesalahan pada server. Silakan coba lagi.' },
      { status: 500 },
    );
  }
}