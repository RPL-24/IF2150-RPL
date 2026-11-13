import { describe, expect, it } from '@jest/globals';
/**
 * Tes persetujuan akun (UC14) dan ModulAkun.ambilWarga (UC03) dengan boundary
 * palsu, jadi tidak butuh basis data.
 *
 * Memakai describe/it/expect global (Jest, atau Vitest dengan `globals: true`).
 * Runner harus dapat meresolusi alias `@/` (Jest: moduleNameMapper,
 * Vitest: vite-tsconfig-paths).
 */
import { GalatAuth, type KonteksSesi } from '../../lib/auth/konteks';
import { AkunController } from '../../modules/akun/controller';
import type { DataAkunBoundary } from '../../modules/akun/boundary';
import { Warga, type AkunRingkas, type StatusAkun } from '../../modules/akun/entity';
import { ModulAkun } from '../../modules/akun/modul';
import { Validasi } from '../../modules/akun/validasi';

class BoundaryPalsu {
  panggilan = 0;
  galatPerbarui: Error | null = null;
  private readonly data: Map<string, AkunRingkas>;
  private readonly daftarWarga: Map<number, Warga>;

  constructor(awal: AkunRingkas[], warga: Warga[] = []) {
    this.data = new Map(awal.map((a) => [a.email, { ...a }]));
    this.daftarWarga = new Map(warga.map((w) => [w.getIdWarga(), w]));
  }

  status(email: string): StatusAkun | undefined {
    return this.data.get(email)?.statusAkun;
  }

  async cariEmail(email: string): Promise<AkunRingkas | null> {
    this.panggilan++;
    const akun = this.data.get(email);
    return akun ? { ...akun } : null;
  }

  async ambilBerdasarkanStatus(status: StatusAkun): Promise<AkunRingkas[]> {
    this.panggilan++;
    return [...this.data.values()].filter((a) => a.statusAkun === status).map((a) => ({ ...a }));
  }

  async perbaruiStatusAkun(email: string, dari: StatusAkun, ke: StatusAkun): Promise<boolean> {
    this.panggilan++;
    if (this.galatPerbarui) throw this.galatPerbarui;
    const akun = this.data.get(email);
    if (!akun || akun.statusAkun !== dari) return false;
    akun.statusAkun = ke;
    return true;
  }

  async cariWarga(idWarga: number): Promise<Warga | null> {
    this.panggilan++;
    return this.daftarWarga.get(idWarga) ?? null;
  }
}

const AKUN_AWAL: AkunRingkas[] = [
  { email: 'p@b.id', nama: 'Pengurus', peran: 'PENGURUS', statusAkun: 'DISETUJUI' },
  { email: 'n@b.id', nama: 'Nadia', peran: 'WARGA', statusAkun: 'MENUNGGU' },
  { email: 't@b.id', nama: 'Teguh', peran: 'TEKNISI', statusAkun: 'MENUNGGU' },
  { email: 'd@b.id', nama: 'Dewi', peran: 'WARGA', statusAkun: 'DISETUJUI' },
];

const SESI_PENGURUS: KonteksSesi = {
  email: 'p@b.id',
  nama: 'Pengurus',
  statusAkun: 'DISETUJUI',
  peran: 'PENGURUS',
  idPengurus: 'P1',
};
const SESI_WARGA: KonteksSesi = {
  email: 'd@b.id',
  nama: 'Dewi',
  statusAkun: 'DISETUJUI',
  peran: 'WARGA',
  idWarga: 3,
  idKomunitas: 'K1',
};
const SESI_TEKNISI: KonteksSesi = {
  email: 't2@b.id',
  nama: 'Teknisi',
  statusAkun: 'DISETUJUI',
  peran: 'TEKNISI',
  idTeknisi: 'T9',
};

function buat(boundary: BoundaryPalsu) {
  return new AkunController(
    new ModulAkun(boundary as unknown as DataAkunBoundary),
    new Validasi(),
  );
}

async function tangkap(janji: Promise<unknown>): Promise<unknown> {
  try {
    await janji;
    return undefined;
  } catch (e) {
    return e;
  }
}

describe('AkunController.ambilAkunMenunggu (UC14)', () => {
  it('Pengurus hanya melihat akun berstatus MENUNGGU', async () => {
    const daftar = await buat(new BoundaryPalsu(AKUN_AWAL)).ambilAkunMenunggu(SESI_PENGURUS);

    expect(daftar.length).toBe(2);
    expect(daftar.map((a) => a.email).sort().join(',')).toBe('n@b.id,t@b.id');
  });

  it('daftar kosong bila tidak ada pengajuan', async () => {
    const b = new BoundaryPalsu([AKUN_AWAL[0], AKUN_AWAL[3]]);
    const daftar = await buat(b).ambilAkunMenunggu(SESI_PENGURUS);
    expect(daftar.length).toBe(0);
  });

  it('warga dan teknisi ditolak sebelum data apa pun dibaca (A2)', async () => {
    const b = new BoundaryPalsu(AKUN_AWAL);
    const c = buat(b);

    for (const sesi of [SESI_WARGA, SESI_TEKNISI]) {
      const galat = await tangkap(c.ambilAkunMenunggu(sesi));
      expect(galat instanceof GalatAuth).toBe(true);
      expect((galat as GalatAuth).status).toBe(403);
    }
    expect(b.panggilan).toBe(0);
  });

  it('Pengurus yang statusnya sudah berubah di basis data tidak lagi berwenang', async () => {
    const b = new BoundaryPalsu([
      { email: 'p@b.id', nama: 'Pengurus', peran: 'PENGURUS', statusAkun: 'DITOLAK' },
      AKUN_AWAL[1],
    ]);
    const galat = await tangkap(buat(b).ambilAkunMenunggu(SESI_PENGURUS));

    expect(galat instanceof GalatAuth).toBe(true);
  });

  it('sesi Pengurus yang akunnya tidak ada lagi ditolak', async () => {
    const b = new BoundaryPalsu([AKUN_AWAL[1]]);
    const galat = await tangkap(buat(b).ambilAkunMenunggu(SESI_PENGURUS));

    expect(galat instanceof GalatAuth).toBe(true);
  });
});

describe('AkunController.setujuiAkun dan tolakAkun (UC14)', () => {
  it('menyetujui pengajuan: status menjadi DISETUJUI', async () => {
    const b = new BoundaryPalsu(AKUN_AWAL);
    const hasil = await buat(b).setujuiAkun(SESI_PENGURUS, 'n@b.id');

    expect(hasil).toEqual({ berhasil: true, email: 'n@b.id', status: 'DISETUJUI' });
    expect(b.status('n@b.id')).toBe('DISETUJUI');
    expect(b.status('t@b.id')).toBe('MENUNGGU');
  });

  it('menolak pengajuan: status menjadi DITOLAK (A1)', async () => {
    const b = new BoundaryPalsu(AKUN_AWAL);
    const hasil = await buat(b).tolakAkun(SESI_PENGURUS, 'T@B.id ');

    expect(hasil).toEqual({ berhasil: true, email: 't@b.id', status: 'DITOLAK' });
    expect(b.status('t@b.id')).toBe('DITOLAK');
  });

  it('pengajuan yang sudah diproses tidak bisa diproses lagi dan statusnya tidak berubah', async () => {
    const b = new BoundaryPalsu(AKUN_AWAL);
    const c = buat(b);

    const pertama = await c.setujuiAkun(SESI_PENGURUS, 'n@b.id');
    const kedua = await c.tolakAkun(SESI_PENGURUS, 'n@b.id');

    expect(pertama.berhasil).toBe(true);
    expect(kedua.berhasil).toBe(false);
    if (!kedua.berhasil) expect(kedua.kode).toBe('SUDAH_DIPROSES');
    expect(b.status('n@b.id')).toBe('DISETUJUI');
  });

  it('akun yang sudah DISETUJUI sejak awal tidak bisa diubah lewat persetujuan', async () => {
    const b = new BoundaryPalsu(AKUN_AWAL);
    const hasil = await buat(b).tolakAkun(SESI_PENGURUS, 'd@b.id');

    expect(hasil.berhasil).toBe(false);
    if (!hasil.berhasil) expect(hasil.kode).toBe('SUDAH_DIPROSES');
    expect(b.status('d@b.id')).toBe('DISETUJUI');
  });

  it('email yang tidak ada atau kosong menghasilkan TIDAK_DITEMUKAN', async () => {
    const b = new BoundaryPalsu(AKUN_AWAL);
    const c = buat(b);
    const a = await c.setujuiAkun(SESI_PENGURUS, 'tidak-ada@b.id');
    const kosong = await c.setujuiAkun(SESI_PENGURUS, '');
    const bukanTeks = await c.setujuiAkun(SESI_PENGURUS, 42);

    for (const hasil of [a, kosong, bukanTeks]) {
      expect(hasil.berhasil).toBe(false);
      if (!hasil.berhasil) expect(hasil.kode).toBe('TIDAK_DITEMUKAN');
    }
  });

  it('non-Pengurus ditolak dan tidak ada status yang berubah', async () => {
    const b = new BoundaryPalsu(AKUN_AWAL);
    const c = buat(b);

    const galatWarga = await tangkap(c.setujuiAkun(SESI_WARGA, 'n@b.id'));
    const galatTeknisi = await tangkap(c.tolakAkun(SESI_TEKNISI, 'n@b.id'));

    expect(galatWarga instanceof GalatAuth).toBe(true);
    expect(galatTeknisi instanceof GalatAuth).toBe(true);
    expect(b.status('n@b.id')).toBe('MENUNGGU');
    expect(b.panggilan).toBe(0);
  });

  it('kegagalan penyimpanan tidak dilaporkan berhasil', async () => {
    const b = new BoundaryPalsu(AKUN_AWAL);
    b.galatPerbarui = new Error('db mati');
    const galat = await tangkap(buat(b).setujuiAkun(SESI_PENGURUS, 'n@b.id'));

    expect(galat instanceof Error).toBe(true);
    expect((galat as Error).message).toBe('db mati');
    expect(b.status('n@b.id')).toBe('MENUNGGU');
  });
});

describe('ModulAkun.ambilWarga (UC03)', () => {
  const warga = new Warga(
    { email: 'd@b.id', nama: 'Dewi', password: '', statusAkun: 'DISETUJUI' },
    { idWarga: 3, idKomunitas: 'K1', statusTerdaftar: true },
  );

  it('mengembalikan warga terkini beserta keanggotaannya', async () => {
    const modul = new ModulAkun(new BoundaryPalsu(AKUN_AWAL, [warga]) as unknown as DataAkunBoundary);
    const hasil = await modul.ambilWarga(3);

    expect(hasil === null).toBe(false);
    expect(hasil?.validasiKeanggotaan('K1')).toBe(true);
    expect(hasil?.validasiKeanggotaan('K2')).toBe(false);
  });

  it('mengembalikan null bila warga tidak ada', async () => {
    const modul = new ModulAkun(new BoundaryPalsu(AKUN_AWAL, [warga]) as unknown as DataAkunBoundary);
    expect(await modul.ambilWarga(999)).toBe(null);
  });
});