/**
 * POST /api/auth/logout: menghapus cookie sesi.
 * Berada di /api/auth sehingga tidak butuh sesi; aman dipanggil berulang.
 */
import { NextResponse } from 'next/server';
import { hapusSesi } from '@/lib/auth/server';

export async function POST() {
  await hapusSesi();
  return NextResponse.json({ berhasil: true });
}