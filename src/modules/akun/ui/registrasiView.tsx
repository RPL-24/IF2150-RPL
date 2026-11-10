'use client';

/**
 * AuthView, bagian registrasi (I-02, UC12). View pasif: hanya menampilkan
 * formulir dan meneruskan isiannya ke API; validasi sebenarnya di server.
 * Ganti elemen dasar dengan components/ui dari shell bila sudah tersedia.
 */
import Link from 'next/link';
import { useState, type FormEvent } from 'react';

type Kolom = 'nama' | 'email' | 'password' | 'peran';
type Galat = Partial<Record<Kolom, string>>;

export default function RegistrasiView() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [peran, setPeran] = useState('WARGA');
  const [galat, setGalat] = useState<Galat>({});
  const [pesan, setPesan] = useState<string | null>(null);
  const [sedangKirim, setSedangKirim] = useState(false);
  const [berhasil, setBerhasil] = useState(false);

  async function tekanDaftar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sedangKirim) return;
    setSedangKirim(true);
    setPesan(null);
    setGalat({});

    try {
      const res = await fetch('/api/auth/registrasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password, peran }),
      });
      const hasil = await res.json();

      if (res.ok && hasil.berhasil) {
        setBerhasil(true);
      } else {
        setPesan(hasil.pesan ?? 'Pendaftaran gagal.');
        setGalat(hasil.galat ?? {});
      }
    } catch {
      // Kegagalan jaringan tidak boleh tampil sebagai pendaftaran berhasil.
      setPesan('Tidak dapat terhubung ke server. Pendaftaran belum tersimpan.');
    } finally {
      // Kata sandi tidak dipertahankan; isian lain tetap.
      setPassword('');
      setSedangKirim(false);
    }
  }

  if (berhasil) {
    return (
      <main className="mx-auto max-w-md p-6">
        <h1 className="text-2xl font-semibold">Pendaftaran diajukan</h1>
        <p className="mt-3" role="status">
          Akun Anda menunggu persetujuan Pengurus. Anda belum bisa masuk sebelum
          akun disetujui.
        </p>
        <p className="mt-4">
          <Link href="/login" className="underline">
            Masuk
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Registrasi akun</h1>

      <form onSubmit={tekanDaftar} className="mt-4 space-y-4" noValidate>
        {pesan && (
          <p role="alert" className="text-red-600">
            {pesan}
          </p>
        )}

        <div>
          <label htmlFor="nama" className="block font-medium">
            Nama lengkap
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            autoComplete="name"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            aria-invalid={Boolean(galat.nama)}
            aria-describedby={galat.nama ? 'galat-nama' : undefined}
            className="w-full rounded border p-2"
          />
          {galat.nama && (
            <p id="galat-nama" role="alert" className="text-sm text-red-600">
              {galat.nama}
            </p>
          )}
        </div>

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
            aria-invalid={Boolean(galat.email)}
            aria-describedby={galat.email ? 'galat-email' : undefined}
            className="w-full rounded border p-2"
          />
          {galat.email && (
            <p id="galat-email" role="alert" className="text-sm text-red-600">
              {galat.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block font-medium">
            Kata sandi
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(galat.password)}
            aria-describedby={galat.password ? 'galat-password' : 'bantuan-password'}
            className="w-full rounded border p-2"
          />
          <p id="bantuan-password" className="text-sm text-gray-600">
            Minimal 8 karakter.
          </p>
          {galat.password && (
            <p id="galat-password" role="alert" className="text-sm text-red-600">
              {galat.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="peran" className="block font-medium">
            Peran yang diajukan
          </label>
          <select
            id="peran"
            name="peran"
            value={peran}
            onChange={(e) => setPeran(e.target.value)}
            aria-invalid={Boolean(galat.peran)}
            aria-describedby={galat.peran ? 'galat-peran' : undefined}
            className="w-full rounded border p-2"
          >
            <option value="WARGA">Warga</option>
            <option value="TEKNISI">Teknisi</option>
            <option value="PENGURUS">Pengurus</option>
          </select>
          {galat.peran && (
            <p id="galat-peran" role="alert" className="text-sm text-red-600">
              {galat.peran}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={sedangKirim}
          className="w-full rounded bg-blue-700 p-2 text-white disabled:opacity-60"
        >
          {sedangKirim ? 'Memproses…' : 'Ajukan akun'}
        </button>
      </form>

      <p className="mt-4">
        Sudah memiliki akun?{' '}
        <Link href="/login" className="underline">
          Masuk
        </Link>
      </p>
    </main>
  );
}