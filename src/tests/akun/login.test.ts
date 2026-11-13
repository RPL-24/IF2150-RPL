import { describe, expect, it } from '@jest/globals';
/**
 * Tes login (UC13, Algo-030), entity akun (Algo-001, 002, 003, 006), dan
 * penyaring parameter `next`. Memakai boundary palsu, jadi tidak butuh
 * basis data.
 *
 * Memakai describe/it/expect global (Jest, atau Vitest dengan `globals: true`).
 * Runner harus dapat meresolusi alias `@/` (Jest: moduleNameMapper,
 * Vitest: vite-tsconfig-paths).
 */
import { hashPassword } from '../../lib/auth/password';
import { AkunController } from '../../modules/akun/controller';
import type { DataAkunBoundary } from '../../modules/akun/boundary';
import {
  Akun,
  Pengurus,
  Warga,
  type ProfilPeran,
  type StatusAkun,
} from '../../modules/akun/entity';
import { PeranTidakValid } from '../../modules/akun/galat';
import { ModulAkun } from '../../modules/akun/modul';
import { urlTujuanAman } from '../../modules/akun/ui/tujuan';
import { Validasi } from '../../modules/akun/validasi';

const KATA_SANDI = 'rahasia123';

let hashCache: Promise<string> | null = null;
function hashUji(): Promise<string> {
  if (!hashCache) hashCache = hashPassword(KATA_SANDI);
  return hashCache;
}

async function akunUji(
  peran: string,
  email: string,
  statusAkun: StatusAkun,
  profil: ProfilPeran | null,
): Promise<Akun> {
  return Akun.buatAkun(
    peran,
    { email, nama: 'Nama Uji', password: await hashUji(), statusAkun },
    profil,
  );
}

class BoundaryPalsu {
  panggilanAmbil = 0;
  private readonly daftar: Map<string, Akun>;

  constructor(daftar: Map<string, Akun>) {
    this.daftar = daftar;
  }

  async ambilAkun(email: string): Promise<Akun | null> {
    this.panggilanAmbil++;
    return this.daftar.get(email) ?? null;
  }
}

function buat(...akun: Akun[]) {
  const peta = new Map(akun.map((a) => [a.email, a]));
  const boundary = new BoundaryPalsu(peta);
  const controller = new AkunController(
    new ModulAkun(boundary as unknown as DataAkunBoundary),
    new Validasi(),
  );
  return { boundary, controller };
}

const PROFIL_WARGA = { idWarga: 7, idKomunitas: 'K1', statusTerdaftar: true };

describe('AkunController.login (UC13, Algo-030)', () => {
  it('warga DISETUJUI masuk ke dasbor warga dengan sesi yang benar', async () => {
    const { controller } = buat(await akunUji('WARGA', 'w@b.id', 'DISETUJUI', PROFIL_WARGA));
    const hasil = await controller.login('w@b.id', KATA_SANDI);

    expect(hasil.berhasil).toBe(true);
    if (hasil.berhasil) {
      expect(hasil.tujuan).toBe('/dashboard/warga');
      expect(hasil.sesi.peran).toBe('WARGA');
      if (hasil.sesi.peran === 'WARGA') {
        expect(hasil.sesi.idWarga).toBe(7);
        expect(hasil.sesi.idKomunitas).toBe('K1');
      }
    }
  });

  it('teknisi dan pengurus diarahkan ke dasbor masing-masing', async () => {
    const { controller } = buat(
      await akunUji('TEKNISI', 't@b.id', 'DISETUJUI', { idTeknisi: 'T1', kontak: '08' }),
      await akunUji('PENGURUS', 'p@b.id', 'DISETUJUI', { idPengurus: 'P1' }),
    );
    const t = await controller.login('t@b.id', KATA_SANDI);
    const p = await controller.login('p@b.id', KATA_SANDI);

    expect(t.berhasil && t.tujuan).toBe('/dashboard/teknisi');
    expect(p.berhasil && p.tujuan).toBe('/dashboard/pengurus');
  });

  it('email dinormalisasi (spasi dan huruf besar)', async () => {
    const { controller } = buat(await akunUji('WARGA', 'w@b.id', 'DISETUJUI', PROFIL_WARGA));
    const hasil = await controller.login('  W@B.ID ', KATA_SANDI);
    expect(hasil.berhasil).toBe(true);
  });

  it('kata sandi salah dan email tidak ada memberi hasil yang sama', async () => {
    const { controller } = buat(await akunUji('WARGA', 'w@b.id', 'DISETUJUI', PROFIL_WARGA));
    const salah = await controller.login('w@b.id', 'salah-total');
    const tidakAda = await controller.login('tidak-ada@b.id', KATA_SANDI);

    expect(salah).toEqual(tidakAda);
    expect(salah.berhasil).toBe(false);
    if (!salah.berhasil) {
      expect(salah.kode).toBe('KREDENSIAL_SALAH');
      expect(salah.pesan).toBe('Email atau password salah');
    }
  });

  it('akun MENUNGGU dengan kata sandi benar diberi tahu masih menunggu', async () => {
    const { controller } = buat(await akunUji('WARGA', 'w@b.id', 'MENUNGGU', null));
    const hasil = await controller.login('w@b.id', KATA_SANDI);

    expect(hasil.berhasil).toBe(false);
    if (!hasil.berhasil) {
      expect(hasil.kode).toBe('MENUNGGU_PERSETUJUAN');
      expect(hasil.pesan).toBe('Akun masih menunggu persetujuan pengurus');
    }
  });

  it('status akun tidak bocor bila kata sandi salah', async () => {
    const { controller } = buat(await akunUji('WARGA', 'w@b.id', 'MENUNGGU', null));
    const hasil = await controller.login('w@b.id', 'salah-total');

    expect(hasil.berhasil).toBe(false);
    if (!hasil.berhasil) expect(hasil.kode).toBe('KREDENSIAL_SALAH');
  });

  it('akun DITOLAK mendapat pesan tidak disetujui', async () => {
    const { controller } = buat(await akunUji('WARGA', 'w@b.id', 'DITOLAK', null));
    const hasil = await controller.login('w@b.id', KATA_SANDI);

    expect(hasil.berhasil).toBe(false);
    if (!hasil.berhasil) {
      expect(hasil.kode).toBe('DITOLAK');
      expect(hasil.pesan).toBe('Akun tidak memperoleh persetujuan');
    }
  });

  it('akun DISETUJUI tanpa profil peran tidak membuat sesi', async () => {
    const { controller } = buat(await akunUji('TEKNISI', 't@b.id', 'DISETUJUI', null));
    const hasil = await controller.login('t@b.id', KATA_SANDI);

    expect(hasil.berhasil).toBe(false);
    if (!hasil.berhasil) expect(hasil.kode).toBe('AKUN_TIDAK_LENGKAP');
  });

  it('input kosong atau bukan string ditolak tanpa menyentuh boundary', async () => {
    const { controller, boundary } = buat();
    const a = await controller.login('', '');
    const b = await controller.login(undefined, 123);
    const c = await controller.login('w@b.id', 'x'.repeat(500));

    expect(a.berhasil).toBe(false);
    expect(b.berhasil).toBe(false);
    expect(c.berhasil).toBe(false);
    expect(boundary.panggilanAmbil).toBe(0);
  });

  it('sesi tidak memuat hash kata sandi', async () => {
    const { controller } = buat(await akunUji('WARGA', 'w@b.id', 'DISETUJUI', PROFIL_WARGA));
    const hasil = await controller.login('w@b.id', KATA_SANDI);

    expect(hasil.berhasil).toBe(true);
    if (hasil.berhasil) {
      expect(JSON.stringify(hasil.sesi).includes('scrypt')).toBe(false);
    }
  });
});

describe('Entity akun', () => {
  it('buatAkun menolak peran yang tidak dikenal (Algo-002)', () => {
    let galat: unknown;
    try {
      Akun.buatAkun('ADMIN', { email: 'a@b.id', nama: 'x', password: 'h', statusAkun: 'MENUNGGU' }, null);
    } catch (e) {
      galat = e;
    }
    expect(galat instanceof PeranTidakValid).toBe(true);
  });

  it('buatAkun menerima peran tanpa memandang huruf besar-kecil', () => {
    const akun = Akun.buatAkun('Warga', { email: 'a@b.id', nama: 'x', password: 'h', statusAkun: 'MENUNGGU' }, null);
    expect(akun instanceof Warga).toBe(true);
  });

  it('validasiKeanggotaan hanya benar untuk warga terdaftar di komunitas yang sama (Algo-003)', async () => {
    const terdaftar = (await akunUji('WARGA', 'a@b.id', 'DISETUJUI', PROFIL_WARGA)) as Warga;
    const belum = (await akunUji('WARGA', 'b@b.id', 'DISETUJUI', { ...PROFIL_WARGA, statusTerdaftar: false })) as Warga;
    const tanpaProfil = (await akunUji('WARGA', 'c@b.id', 'MENUNGGU', null)) as Warga;

    expect(terdaftar.validasiKeanggotaan('K1')).toBe(true);
    expect(terdaftar.validasiKeanggotaan('K2')).toBe(false);
    expect(belum.validasiKeanggotaan('K1')).toBe(false);
    expect(tanpaProfil.validasiKeanggotaan('K1')).toBe(false);
  });

  it('verifikasiKewenangan hanya benar untuk pengurus DISETUJUI (Algo-006)', async () => {
    const aktif = (await akunUji('PENGURUS', 'p@b.id', 'DISETUJUI', { idPengurus: 'P1' })) as Pengurus;
    const menunggu = (await akunUji('PENGURUS', 'q@b.id', 'MENUNGGU', { idPengurus: 'P2' })) as Pengurus;

    expect(aktif.verifikasiKewenangan()).toBe(true);
    expect(menunggu.verifikasiKewenangan()).toBe(false);
  });

  it('cocokKredensial menolak email berbeda walau kata sandi benar (Algo-001)', async () => {
    const akun = await akunUji('WARGA', 'a@b.id', 'DISETUJUI', PROFIL_WARGA);
    expect(await akun.cocokKredensial('a@b.id', KATA_SANDI)).toBe(true);
    expect(await akun.cocokKredensial('lain@b.id', KATA_SANDI)).toBe(false);
    expect(await akun.cocokKredensial('a@b.id', 'salah')).toBe(false);
  });
});

describe('urlTujuanAman', () => {
  it('menerima jalur internal', () => {
    expect(urlTujuanAman('/dashboard/warga')).toBe('/dashboard/warga');
    expect(urlTujuanAman('/dashboard/warga/laporan?x=1')).toBe('/dashboard/warga/laporan?x=1');
  });

  it('menolak jalur ke situs lain dan bentuk berbahaya', () => {
    expect(urlTujuanAman('//evil.com')).toBe(null);
    expect(urlTujuanAman('https://evil.com')).toBe(null);
    expect(urlTujuanAman('/\\evil.com')).toBe(null);
    expect(urlTujuanAman('javascript:alert(1)')).toBe(null);
    expect(urlTujuanAman('/ok\nLocation: x')).toBe(null);
  });

  it('menolak kosong, halaman auth, dan API', () => {
    expect(urlTujuanAman(null)).toBe(null);
    expect(urlTujuanAman('')).toBe(null);
    expect(urlTujuanAman('/login')).toBe(null);
    expect(urlTujuanAman('/login?next=/x')).toBe(null);
    expect(urlTujuanAman('/registrasi')).toBe(null);
    expect(urlTujuanAman('/api/laporan')).toBe(null);
  });
});