// src/tests/unit/ModelAkun.test.js
// Model dan kelas pendukung modul A: Akun, TokenVerifikasi, SesiLogin, DokumenLegal,
// Barang.getListingPenjual, serta hash kata sandi pada Kriptografi.
const db = require('../../config/db');
const Akun = require('../../models/Akun');
const Barang = require('../../models/Barang');
const DokumenLegal = require('../../models/DokumenLegal');
const SesiLogin = require('../../models/SesiLogin');
const TokenVerifikasi = require('../../models/TokenVerifikasi');
const { Kriptografi } = require('../../pendukung/Kriptografi');

describe('Model Modul A Unit Test', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Kriptografi.hash / cocokkanHash (KF09, KF10)', () => {
    // 4 round cukup untuk menguji perilaku tanpa memperlambat test
    const kriptografi = new Kriptografi(4);

    test('hash bcrypt tidak sama dengan teks asli', async () => {
      const hash = await kriptografi.hash('rahasia123');
      expect(hash).not.toBe('rahasia123');
      expect(hash).toMatch(/^\$2b\$04\$/);
    });

    test('teks yang sama menghasilkan hash berbeda karena salt acak', async () => {
      expect(await kriptografi.hash('rahasia123')).not.toBe(await kriptografi.hash('rahasia123'));
    });

    test('cocokkanHash benar untuk kata sandi yang sesuai, salah untuk yang lain', async () => {
      const hash = await kriptografi.hash('rahasia123');
      expect(await kriptografi.cocokkanHash('rahasia123', hash)).toBe(true);
      expect(await kriptografi.cocokkanHash('rahasia124', hash)).toBe(false);
    });

    test('masukan null tidak pernah cocok', async () => {
      const hash = await kriptografi.hash('rahasia123');
      expect(await kriptografi.cocokkanHash(null, hash)).toBe(false);
      expect(await kriptografi.cocokkanHash('rahasia123', null)).toBe(false);
    });
  });

  describe('Akun (C23)', () => {
    test('getStatusAkun mengutamakan status blokir', () => {
      expect(new Akun({ statusAkun: 'Terverifikasi', statusBlokir: false }).getStatusAkun()).toBe('Terverifikasi');
      expect(new Akun({ statusAkun: 'Terverifikasi', statusBlokir: true }).getStatusAkun()).toBe('Diblokir');
    });

    test('getDataIdentitas hanya berisi nama, surel, dan NIM (KF04)', () => {
      const akun = new Akun({ nama: 'A', email: 'a@itb.ac.id', nim: '1', kataSandiHash: '$2b$x', peran: 'Admin' });
      expect(akun.getDataIdentitas()).toEqual({ nama: 'A', email: 'a@itb.ac.id', nim: '1' });
    });

    test('cariByEmail mencocokkan surel tanpa membedakan huruf besar/kecil (Algo-026)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      expect(await Akun.cariByEmail('  Uji@ITB.ac.id ')).toBeNull();
      const [sql, nilai] = query.mock.calls[0];
      expect(sql).toMatch(/LOWER\(email\) = LOWER\(\$1\)/);
      expect(nilai).toEqual(['Uji@ITB.ac.id']);
    });

    test('simpan menyimpan surel dalam huruf kecil dengan peran Pengguna (Algo-025)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      const id = await Akun.simpan('A', '1', ' Uji@ITB.ac.id ', '$2b$hash', 'Belum Terverifikasi', true);
      const nilai = query.mock.calls[0][1];
      expect(id).toMatch(/^[0-9a-f-]{36}$/);
      expect(nilai).toEqual([id, 'A', '1', 'uji@itb.ac.id', '$2b$hash', 'Belum Terverifikasi', 'Pengguna', true]);
    });
  });

  describe('TokenVerifikasi (C27)', () => {
    const token = (data) => new TokenVerifikasi({ kode: '012345', ...data });

    test('cocokkanKode hanya menerima kode yang persis sama (spasi di tepi diabaikan)', () => {
      expect(token().cocokkanKode('012345')).toBe(true);
      expect(token().cocokkanKode(' 012345 ')).toBe(true);
      expect(token().cocokkanKode('12345')).toBe(false);
      expect(token().cocokkanKode('012346')).toBe(false);
      expect(token().cocokkanKode(12345)).toBe(false);
      expect(token().cocokkanKode(undefined)).toBe(false);
    });

    test('sudahKedaluwarsa membandingkan waktu sekarang dengan waktuKedaluwarsa', () => {
      expect(token({ waktuKedaluwarsa: new Date(Date.now() + 60000) }).sudahKedaluwarsa()).toBe(false);
      expect(token({ waktuKedaluwarsa: new Date(Date.now() - 1000) }).sudahKedaluwarsa()).toBe(true);
    });

    test('cariTokenAktif mengambil token "Aktif" terbaru milik akun (Algo-029)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      await TokenVerifikasi.cariTokenAktif('akun-1');
      const [sql, nilai] = query.mock.calls[0];
      expect(sql).toMatch(/ORDER BY waktu_buat DESC/);
      expect(nilai).toEqual(['akun-1', 'Aktif']);
    });
  });

  describe('SesiLogin (C28)', () => {
    test('buatToken menghasilkan 64 karakter hex yang berbeda setiap kali', () => {
      const a = SesiLogin.buatToken('akun-1');
      const b = SesiLogin.buatToken('akun-1');
      expect(a).toMatch(/^[0-9a-f]{64}$/);
      expect(a).not.toBe(b);
    });

    test('cariSesiAktif hanya mengambil sesi aktif yang belum kedaluwarsa (Algo-030)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      expect(await SesiLogin.cariSesiAktif('tkn')).toBeNull();
      const sql = query.mock.calls[0][0];
      expect(sql).toMatch(/status_aktif = true/);
      expect(sql).toMatch(/waktu_kedaluwarsa > now\(\)/);
    });
  });

  describe('DokumenLegal (C40)', () => {
    test('getVersiTerbaru hanya mengambil versi terpublikasi yang sudah berlaku (Algo-063)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      expect(await DokumenLegal.getVersiTerbaru('kebijakan-privasi')).toBeNull();
      const [sql, nilai] = query.mock.calls[0];
      expect(sql).toMatch(/status_publikasi = true/);
      expect(sql).toMatch(/tanggal_berlaku <= CURRENT_DATE/);
      expect(sql).toMatch(/ORDER BY tanggal_berlaku DESC, versi DESC/);
      expect(nilai).toEqual(['kebijakan-privasi']);
    });

    test('getTautan dan getIsi mengembalikan atribut dokumen', () => {
      const dokumen = new DokumenLegal({ tautan: '/legal?jenis=kebijakan-privasi', isi: '## 1. A\nisi' });
      expect(dokumen.getTautan()).toBe('/legal?jenis=kebijakan-privasi');
      expect(dokumen.getIsi()).toBe('## 1. A\nisi');
    });
  });

  describe('Barang.getListingPenjual (C29, KF20)', () => {
    test('hanya listing Tersedia dan Terjual milik penjual, beserta foto utama', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({
        rows: [
          { id_barang: 'b1', id_penjual: 'akun-1', judul: 'Jas Lab', harga: '120000.00', status: 'Tersedia', foto_utama: '/uploads/b1/a.png' },
          { id_barang: 'b2', id_penjual: 'akun-1', judul: 'Buku', harga: '85000.00', status: 'Terjual', foto_utama: null },
        ],
      });

      const daftar = await Barang.getListingPenjual('akun-1');

      expect(query.mock.calls[0][1]).toEqual(['akun-1', 'Tersedia', 'Terjual']);
      expect(daftar.map((b) => [b.idBarang, b.harga, b.getStatus(), b.fotoUtama])).toEqual([
        ['b1', 120000, 'Tersedia', '/uploads/b1/a.png'],
        ['b2', 85000, 'Terjual', null],
      ]);
    });
  });
});
