/**
 * UC14 Persetujuan akun.
 *   GET  /api/akun/persetujuan  -> daftar akun MENUNGGU
 *   POST /api/akun/persetujuan  -> { email, disetujui: boolean }
 * Hanya Pengurus. Peran diperiksa di route (wajibPeran) dan lagi di controller
 * terhadap data terkini, sebelum data apa pun dibaca atau diubah.
 */
import { NextResponse } from 'next/server';
import { GalatAuth } from '@/lib/auth/konteks';
import { wajibPeran } from '@/lib/auth/server';
import { akunController } from '@/modules/akun';

export const dynamic = 'force-dynamic';

function tanganiGalat(galat: unknown) {
  if (galat instanceof GalatAuth) {
    return NextResponse.json(
      {
        berhasil: false,
        kode: galat.kode,
        pesan:
          galat.kode === 'TIDAK_LOGIN'
            ? 'Silakan masuk terlebih dahulu.'
            : 'Anda tidak berwenang mengelola persetujuan akun.',
      },
      { status: galat.status },
    );
  }
  console.error('[persetujuan] Gagal memproses permintaan:', galat);
  return NextResponse.json(
    { berhasil: false, pesan: 'Terjadi kesalahan pada server. Perubahan belum tersimpan.' },
    { status: 500 },
  );
}

export async function GET() {
  try {
    const sesi = await wajibPeran('PENGURUS');
    const akun = await akunController.ambilAkunMenunggu(sesi);
    return NextResponse.json({
      berhasil: true,
      akun: akun.map(({ email, nama, peran }) => ({ email, nama, peran })),
    });
  } catch (galat) {
    return tanganiGalat(galat);
  }
}

export async function POST(req: Request) {
  try {
    // Periksa kewenangan lebih dulu, sebelum membaca isi permintaan.
    const sesi = await wajibPeran('PENGURUS');

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
    if (typeof isi.disetujui !== 'boolean') {
      return NextResponse.json(
        { berhasil: false, pesan: 'Permintaan tidak valid.' },
        { status: 400 },
      );
    }

    const hasil = isi.disetujui
      ? await akunController.setujuiAkun(sesi, isi.email)
      : await akunController.tolakAkun(sesi, isi.email);

    if (hasil.berhasil) return NextResponse.json(hasil);
    return NextResponse.json(hasil, {
      status: hasil.kode === 'TIDAK_DITEMUKAN' ? 404 : 409,
    });
  } catch (galat) {
    return tanganiGalat(galat);
  }
}