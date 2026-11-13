'use client';

/**
 * PengurusView, bagian persetujuan akun (I-16, UC14). View pasif: menampilkan
 * daftar pengajuan dan meneruskan keputusan ke API. Password tidak pernah
 * ditampilkan. Notifikasi berhasil hanya muncul setelah server melaporkan
 * perubahan tersimpan; konflik atau kegagalan menampilkan galat dan memuat
 * ulang daftar.
 * Ganti elemen dasar dengan components/ui dari shell bila sudah tersedia.
 */
import { useEffect, useState } from 'react';

type Pengajuan = { email: string; nama: string; peran: string };
type Pesan = { jenis: 'sukses' | 'galat'; teks: string };

const NAMA_PERAN: Record<string, string> = {
  WARGA: 'Warga',
  TEKNISI: 'Teknisi',
  PENGURUS: 'Pengurus',
};

export default function PersetujuanView() {
  const [daftar, setDaftar] = useState<Pengajuan[] | null>(null);
  const [galatMuat, setGalatMuat] = useState<string | null>(null);
  const [versi, setVersi] = useState(0);
  const [dipilih, setDipilih] = useState<string | null>(null);
  const [sedangProses, setSedangProses] = useState(false);
  const [pesan, setPesan] = useState<Pesan | null>(null);

  // Memuat daftar; `versi` dinaikkan untuk memuat ulang.
  useEffect(() => {
    let batal = false;
    (async () => {
      try {
        const res = await fetch('/api/akun/persetujuan', { cache: 'no-store' });
        const hasil = await res.json();
        if (batal) return;
        if (res.ok && hasil.berhasil) {
          setDaftar(hasil.akun);
          setGalatMuat(null);
        } else {
          setGalatMuat(hasil.pesan ?? 'Daftar pengajuan gagal dimuat.');
        }
      } catch {
        if (!batal) setGalatMuat('Tidak dapat terhubung ke server.');
      }
    })();
    return () => {
      batal = true;
    };
  }, [versi]);

  async function proses(disetujui: boolean) {
    if (!dipilih || sedangProses) return;
    setSedangProses(true);
    setPesan(null);

    try {
      const res = await fetch('/api/akun/persetujuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: dipilih, disetujui }),
      });
      const hasil = await res.json();

      if (res.ok && hasil.berhasil) {
        setPesan({
          jenis: 'sukses',
          teks: disetujui ? 'Akun berhasil disetujui.' : 'Akun berhasil ditolak.',
        });
      } else {
        setPesan({ jenis: 'galat', teks: hasil.pesan ?? 'Proses persetujuan gagal.' });
      }
    } catch {
      setPesan({
        jenis: 'galat',
        teks: 'Tidak dapat terhubung ke server. Perubahan belum tersimpan.',
      });
    }

    // Apa pun hasilnya, daftar dimuat ulang agar sesuai keadaan sebenarnya.
    setDipilih(null);
    setSedangProses(false);
    setVersi((v) => v + 1);
  }

  const terpilih = daftar?.find((p) => p.email === dipilih) ?? null;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Persetujuan akun</h1>

      {pesan && (
        <p
          role={pesan.jenis === 'galat' ? 'alert' : 'status'}
          className={pesan.jenis === 'galat' ? 'mt-3 text-red-600' : 'mt-3 text-green-700'}
        >
          {pesan.teks}
        </p>
      )}

      {galatMuat && (
        <p role="alert" className="mt-3 text-red-600">
          {galatMuat}{' '}
          <button type="button" className="underline" onClick={() => setVersi((v) => v + 1)}>
            Muat ulang
          </button>
        </p>
      )}

      {daftar === null && !galatMuat && <p className="mt-3">Memuat…</p>}

      {daftar !== null && daftar.length === 0 && (
        <p className="mt-3">Tidak ada akun menunggu persetujuan.</p>
      )}

      {daftar !== null && daftar.length > 0 && (
        <>
          <p className="mt-3 font-medium">Menunggu persetujuan · {daftar.length} akun</p>
          <table className="mt-2 w-full border-collapse text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Nama</th>
                <th className="p-2">Peran diajukan</th>
                <th className="p-2">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((p) => (
                <tr key={p.email} className="border-b">
                  <td className="p-2">{p.nama}</td>
                  <td className="p-2">{NAMA_PERAN[p.peran] ?? p.peran}</td>
                  <td className="p-2">
                    <button
                      type="button"
                      className="underline"
                      onClick={() => setDipilih(p.email)}
                      disabled={sedangProses}
                      aria-pressed={dipilih === p.email}
                    >
                      Tinjau
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {terpilih && (
        <section className="mt-6 rounded border p-4" aria-label={`Pengajuan ${terpilih.nama}`}>
          <h2 className="text-lg font-semibold">Pengajuan {terpilih.nama}</h2>
          <p className="text-sm uppercase tracking-wide">Menunggu</p>
          <dl className="mt-2 space-y-1">
            <div>
              <dt className="inline font-medium">Nama: </dt>
              <dd className="inline">{terpilih.nama}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Email: </dt>
              <dd className="inline">{terpilih.email}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Peran diajukan: </dt>
              <dd className="inline">{NAMA_PERAN[terpilih.peran] ?? terpilih.peran}</dd>
            </div>
          </dl>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => proses(true)}
              disabled={sedangProses}
              className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-60"
            >
              {sedangProses ? 'Memproses…' : 'Setujui akun'}
            </button>
            <button
              type="button"
              onClick={() => proses(false)}
              disabled={sedangProses}
              className="rounded border px-4 py-2 disabled:opacity-60"
            >
              Tolak
            </button>
          </div>
        </section>
      )}
    </main>
  );
}