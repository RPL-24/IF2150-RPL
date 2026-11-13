'use client';

/**
 * PengurusView, bagian persetujuan akun (I-16, UC14). View pasif: menampilkan
 * daftar pengajuan dan meneruskan keputusan ke API. Password tidak pernah
 * ditampilkan. Notifikasi berhasil hanya muncul setelah server melaporkan
 * perubahan tersimpan; konflik atau kegagalan menampilkan galat dan memuat
 * ulang daftar.
 */
import { useEffect, useState } from 'react';
import PageTitle from '@/components/shell/PageTitle';
import { Alert, Badge, Button, Card, EmptyState, Table } from '@/components/ui';

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
    <>
      <PageTitle judul="Persetujuan akun" deskripsi="Tinjau pengajuan akun baru, lalu setujui atau tolak." />

      {pesan && <Alert nada={pesan.jenis === 'galat' ? 'bahaya' : 'info'}>{pesan.teks}</Alert>}

      {galatMuat && (
        <Alert nada="bahaya">
          {galatMuat}{' '}
          <Button varian="link" onClick={() => setVersi((v) => v + 1)}>
            Muat ulang
          </Button>
        </Alert>
      )}

      {daftar === null && !galatMuat && <EmptyState>Memuat…</EmptyState>}

      {daftar !== null && daftar.length === 0 && <EmptyState>Tidak ada akun menunggu persetujuan.</EmptyState>}

      {daftar !== null && daftar.length > 0 && (
        <Card>
          <h2>Menunggu persetujuan · {daftar.length} akun</h2>
          <Table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Peran diajukan</th>
                <th>
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((p) => (
                <tr key={p.email}>
                  <td>{p.nama}</td>
                  <td>
                    <Badge nada="netral">{NAMA_PERAN[p.peran] ?? p.peran}</Badge>
                  </td>
                  <td className="num">
                    <Button onClick={() => setDipilih(p.email)} disabled={sedangProses} aria-pressed={dipilih === p.email}>
                      Tinjau
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {terpilih && (
        <Card aria-label={`Pengajuan ${terpilih.nama}`}>
          <h2>Pengajuan {terpilih.nama}</h2>
          <p>
            <Badge nada="peringatan">Menunggu</Badge>
          </p>
          <hr className="garis" />
          <dl className="facts">
            <div>
              <dt>Nama</dt>
              <dd>{terpilih.nama}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{terpilih.email}</dd>
            </div>
            <div>
              <dt>Peran diajukan</dt>
              <dd>{NAMA_PERAN[terpilih.peran] ?? terpilih.peran}</dd>
            </div>
          </dl>
          <hr className="garis" />
          <div className="actions">
            <Button varian="primary" onClick={() => proses(true)} disabled={sedangProses}>
              {sedangProses ? 'Memproses…' : 'Setujui akun'}
            </Button>
            <Button varian="danger" onClick={() => proses(false)} disabled={sedangProses}>
              Tolak
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
