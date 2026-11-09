/**
 * POST /api/auth/registrasi (UC12).
 * Tanpa sesi: jalur /api/auth dikecualikan di middleware.
 */
import { NextResponse } from 'next/server';
import { akunController } from '@/modules/akun';

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
    const hasil = await akunController.daftarkan(
      isi.nama,
      isi.email,
      isi.password,
      isi.peran,
    );
    if (hasil.berhasil) return NextResponse.json(hasil, { status: 201 });
    return NextResponse.json(hasil, {
      status: hasil.kode === 'EMAIL_TERDAFTAR' ? 409 : 400,
    });
  } catch (galat) {
    // Jangan mencatat body (berisi kata sandi).
    console.error('[registrasi] Gagal menyimpan akun:', galat);
    return NextResponse.json(
      {
        berhasil: false,
        pesan: 'Terjadi kesalahan pada server. Pendaftaran belum tersimpan.',
      },
      { status: 500 },
    );
  }
}