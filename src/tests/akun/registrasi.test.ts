/**
 * Tes registrasi (UC12): Validasi (Algo-031) dan AkunController.daftarkan
 * (Algo-029) dengan boundary palsu, jadi tidak butuh basis data.
 *
 * Memakai describe/it/expect global (Jest, atau Vitest dengan `globals: true`).
 * Runner harus dapat meresolusi alias `@/` (Jest: moduleNameMapper,
 * Vitest: vite-tsconfig-paths).
 */
import { AkunController } from '../../modules/akun/controller';
import type { DataAkunBoundary } from '../../modules/akun/boundary';
import type { AkunRingkas, DataAkun } from '../../modules/akun/entity';
import { EmailSudahTerdaftar } from '../../modules/akun/galat';
import { ModulAkun } from '../../modules/akun/modul';
import { Validasi } from '../../modules/akun/validasi';

class BoundaryPalsu {
  tersimpan: DataAkun[] = [];
  sudahAda = new Set<string>();
  galatSimpan: Error | null = null;

  async cariEmail(email: string): Promise<AkunRingkas | null> {
    return this.sudahAda.has(email)
      ? { email, nama: 'Lama', peran: 'WARGA', statusAkun: 'MENUNGGU' }
      : null;
  }

  async simpanAkun(akun: DataAkun): Promise<boolean> {
    if (this.galatSimpan) throw this.galatSimpan;
    this.tersimpan.push(akun);
    return true;
  }
}

function buat(boundary: BoundaryPalsu) {
  return new AkunController(
    new ModulAkun(boundary as unknown as DataAkunBoundary),
    new Validasi(),
  );
}

describe('Validasi.validasiRegistrasi (Algo-031)', () => {
  const v = new Validasi();

  it('menerima data lengkap dengan email baru', () => {
    expect(v.validasiRegistrasi('Nadia Putri', 'nadia@example.test', 'rahasia123', null)).toBe(true);
  });

  it('menolak nama kosong atau hanya spasi', () => {
    expect(v.validasiRegistrasi('', 'a@b.id', 'rahasia123', null)).toBe(false);
    expect(v.validasiRegistrasi('   ', 'a@b.id', 'rahasia123', null)).toBe(false);
  });

  it('menolak email tanpa format sah', () => {
    expect(v.validasiRegistrasi('Nadia', 'tanpa-at', 'rahasia123', null)).toBe(false);
    expect(v.validasiRegistrasi('Nadia', 'a@b', 'rahasia123', null)).toBe(false);
    expect(v.validasiRegistrasi('Nadia', '', 'rahasia123', null)).toBe(false);
  });

  it('menolak kata sandi di bawah 8 karakter, menerima tepat 8', () => {
    expect(v.validasiRegistrasi('Nadia', 'a@b.id', '1234567', null)).toBe(false);
    expect(v.validasiRegistrasi('Nadia', 'a@b.id', '12345678', null)).toBe(true);
  });

  it('menolak kata sandi lebih panjang dari batas hash', () => {
    expect(v.validasiRegistrasi('Nadia', 'a@b.id', 'x'.repeat(129), null)).toBe(false);
  });

  it('menolak email yang sudah terdaftar', () => {
    const lama = { email: 'a@b.id' };
    expect(v.validasiRegistrasi('Nadia', 'a@b.id', 'rahasia123', lama)).toBe(false);
  });
});

describe('AkunController.daftarkan (UC12, Algo-029)', () => {
  it('menyimpan akun MENUNGGU dengan kata sandi ter-hash dan email dinormalisasi', async () => {
    const b = new BoundaryPalsu();
    const hasil = await buat(b).daftarkan('  Nadia Putri ', ' Nadia@Example.TEST ', 'rahasia123', 'Warga');

    expect(hasil).toEqual({ berhasil: true, email: 'nadia@example.test' });
    expect(b.tersimpan.length).toBe(1);
    const akun = b.tersimpan[0];
    expect(akun.email).toBe('nadia@example.test');
    expect(akun.nama).toBe('Nadia Putri');
    expect(akun.peran).toBe('WARGA');
    expect(akun.statusAkun).toBe('MENUNGGU');
    expect(akun.password).not.toBe('rahasia123');
    expect(akun.password.startsWith('scrypt$')).toBe(true);
  });

  it('menolak email yang sudah terdaftar tanpa menyimpan akun baru', async () => {
    const b = new BoundaryPalsu();
    b.sudahAda.add('a@b.id');
    const hasil = await buat(b).daftarkan('Nadia', 'A@B.id', 'rahasia123', 'WARGA');

    expect(hasil.berhasil).toBe(false);
    if (!hasil.berhasil) {
      expect(hasil.kode).toBe('EMAIL_TERDAFTAR');
      expect(hasil.galat.email).toBeDefined();
    }
    expect(b.tersimpan.length).toBe(0);
  });

  it('menangani balapan: penyimpanan menolak email unik yang baru dipakai', async () => {
    const b = new BoundaryPalsu();
    b.galatSimpan = new EmailSudahTerdaftar('a@b.id');
    const hasil = await buat(b).daftarkan('Nadia', 'a@b.id', 'rahasia123', 'WARGA');

    expect(hasil.berhasil).toBe(false);
    if (!hasil.berhasil) expect(hasil.kode).toBe('EMAIL_TERDAFTAR');
  });

  it('tidak melaporkan berhasil bila penyimpanan gagal karena galat lain', async () => {
    const b = new BoundaryPalsu();
    b.galatSimpan = new Error('db mati');
    await expect(buat(b).daftarkan('Nadia', 'a@b.id', 'rahasia123', 'WARGA')).rejects.toThrow('db mati');
    expect(b.tersimpan.length).toBe(0);
  });

  it('menolak peran yang tidak dikenal', async () => {
    const b = new BoundaryPalsu();
    const hasil = await buat(b).daftarkan('Nadia', 'a@b.id', 'rahasia123', 'ADMIN');

    expect(hasil.berhasil).toBe(false);
    if (!hasil.berhasil) {
      expect(hasil.kode).toBe('DATA_TIDAK_VALID');
      expect(hasil.galat.peran).toBeDefined();
    }
    expect(b.tersimpan.length).toBe(0);
  });

  it('menandai kolom wajib yang kosong dan tidak menyimpan', async () => {
    const b = new BoundaryPalsu();
    const hasil = await buat(b).daftarkan('', '', '', 'WARGA');

    expect(hasil.berhasil).toBe(false);
    if (!hasil.berhasil) {
      expect(hasil.galat.nama).toBeDefined();
      expect(hasil.galat.email).toBeDefined();
      expect(hasil.galat.password).toBeDefined();
    }
    expect(b.tersimpan.length).toBe(0);
  });

  it('menolak body bertipe salah tanpa melempar galat', async () => {
    const b = new BoundaryPalsu();
    const hasil = await buat(b).daftarkan(undefined, 123, null, {});

    expect(hasil.berhasil).toBe(false);
    expect(b.tersimpan.length).toBe(0);
  });
});