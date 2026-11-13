'use client';

/**
 * AuthView, bagian registrasi (I-02, UC12). View pasif: hanya menampilkan
 * formulir dan meneruskan isiannya ke API; validasi sebenarnya di server.
 */
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Alert, Button, Card, Field, Input, Select } from '@/components/ui';

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
      <main className="auth">
        <Card className="auth-card">
          <div className="brand">
            fajar<span>.tech</span>
          </div>
          <h1>Pendaftaran diajukan</h1>
          <Alert>
            Akun Anda menunggu persetujuan Pengurus. Anda belum bisa masuk sebelum akun disetujui.
          </Alert>
          <p className="auth-alt">
            <Link href="/login">Kembali ke halaman masuk</Link>
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="auth">
      <Card className="auth-card">
        <div className="brand">
          fajar<span>.tech</span>
        </div>
        <h1>Registrasi akun</h1>
        <p className="auth-sub">Akun baru perlu disetujui Pengurus sebelum bisa dipakai.</p>

        <form onSubmit={tekanDaftar} noValidate>
          {pesan && <Alert nada="bahaya">{pesan}</Alert>}

          <Field label="Nama lengkap" galat={galat.nama}>
            {(f) => (
              <Input {...f} name="nama" type="text" autoComplete="name" required value={nama} onChange={(e) => setNama(e.target.value)} />
            )}
          </Field>

          <Field label="Email" galat={galat.email}>
            {(f) => (
              <Input {...f} name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            )}
          </Field>

          <Field label="Kata sandi (minimal 8 karakter)" galat={galat.password}>
            {(f) => (
              <Input
                {...f}
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </Field>

          <Field label="Peran yang diajukan" galat={galat.peran}>
            {(f) => (
              <Select {...f} name="peran" value={peran} onChange={(e) => setPeran(e.target.value)}>
                <option value="WARGA">Warga</option>
                <option value="TEKNISI">Teknisi</option>
                <option value="PENGURUS">Pengurus</option>
              </Select>
            )}
          </Field>

          <Button type="submit" varian="primary" className="penuh" disabled={sedangKirim}>
            {sedangKirim ? 'Memproses…' : 'Ajukan akun'}
          </Button>
        </form>

        <p className="auth-alt">
          Sudah memiliki akun? <Link href="/login">Masuk</Link>
        </p>
      </Card>
    </main>
  );
}
