'use client';

/**
 * AuthView, bagian login (I-01, UC13). View pasif: hanya menampilkan formulir
 * dan meneruskan isiannya ke API. Dasbor tujuan ditentukan server dari akun;
 * parameter `next` hanya dipakai bila lolos penyaringan dan tetap dibatasi
 * peran oleh middleware.
 * Ganti elemen dasar dengan components/ui dari shell bila sudah tersedia.
 */
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { urlTujuanAman } from '@/modules/akun/ui/tujuan';

export default function LoginView() {
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pesan, setPesan] = useState<string | null>(null);
  const [sedangKirim, setSedangKirim] = useState(false);
  const [berhasil, setBerhasil] = useState(false);

  async function tekanMasuk(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sedangKirim) return;
    setSedangKirim(true);
    setPesan(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const hasil = await res.json();

      if (res.ok && hasil.berhasil) {
        setBerhasil(true);
        const tujuan = urlTujuanAman(params.get('next')) ?? hasil.tujuan;
        // Muat ulang penuh agar cookie sesi langsung dipakai middleware.
        window.location.assign(tujuan);
        return;
      }
      setPesan(hasil.pesan ?? 'Masuk gagal.');
    } catch {
      setPesan('Tidak dapat terhubung ke server. Silakan coba lagi.');
    }

    // Hanya sampai sini bila gagal: kata sandi tidak dipertahankan, email tetap.
    setPassword('');
    setSedangKirim(false);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Masuk</h1>

      <form onSubmit={tekanMasuk} className="mt-4 space-y-4" noValidate>
        {pesan && (
          <p role="alert" className="text-red-600">
            {pesan}
          </p>
        )}
        {berhasil && (
          <p role="status">Berhasil masuk. Mengalihkan ke dasbor…</p>
        )}

        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium">
            Kata sandi
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <button
          type="submit"
          disabled={sedangKirim}
          className="w-full rounded bg-blue-700 p-2 text-white disabled:opacity-60"
        >
          {sedangKirim ? 'Memproses…' : 'Masuk'}
        </button>
      </form>

      <p className="mt-4">
        Belum punya akun?{' '}
        <Link href="/registrasi" className="underline">
          Daftar akun
        </Link>
      </p>
    </main>
  );
}