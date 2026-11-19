// src/tests/unit/ModelAkun.test.js
// Model dan kelas pendukung modul A: Akun, Penjual, Admin, TokenVerifikasi, SesiLogin, DokumenLegal,
// Barang.getListingPenjual, serta hash kata sandi pada Kriptografi.
// Kueri basis data diganti tiruan; perilaku SQL terhadap PostgreSQL sungguhan diuji di src/tests/db/.
const db = require('../../config/db');
const Admin = require('../../models/Admin');
const Akun = require('../../models/Akun');
const Barang = require('../../models/Barang');
const DokumenLegal = require('../../models/DokumenLegal');
const Penjual = require('../../models/Penjual');
const SesiLogin = require('../../models/SesiLogin');
const TokenVerifikasi = require('../../models/TokenVerifikasi');
const { Kriptografi } = require('../../pendukung/Kriptografi');

const BARIS_AKUN = {
  id_akun: 'akun-1',
  nama: 'Mahasiswa Uji',
  nim: '13599999',
  email: 'uji@itb.ac.id',
  kata_sandi_hash: '$2b$10$hash',
  status_akun: 'Terverifikasi',
  status_blokir: false,
  peran: 'Pengguna',
  setuju_kebijakan: true,
  waktu_daftar: new Date('2026-11-01T00:00:00Z'),
};

describe('Model Modul A Unit Test', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Kriptografi.hash / cocokkanHash (C42, KF09, KF10)', () => {
    // 4 round cukup untuk menguji perilaku tanpa memperlambat test
    const kriptografi = new Kriptografi(4);

    test('C42-UT01 hash bcrypt tidak sama dengan teks asli', async () => {
      const hash = await kriptografi.hash('rahasia123');
      expect(hash).not.toBe('rahasia123');
      expect(hash).toMatch(/^\$2b\$04\$/);
    });

    test('C42-UT02 teks yang sama menghasilkan hash berbeda karena salt acak', async () => {
      expect(await kriptografi.hash('rahasia123')).not.toBe(await kriptografi.hash('rahasia123'));
    });

    test('C42-UT03 cocokkanHash benar untuk kata sandi yang sesuai, salah untuk yang lain', async () => {
      const hash = await kriptografi.hash('rahasia123');
      expect(await kriptografi.cocokkanHash('rahasia123', hash)).toBe(true);
      expect(await kriptografi.cocokkanHash('rahasia124', hash)).toBe(false);
    });

    test('C42-UT04 masukan null tidak pernah cocok', async () => {
      const hash = await kriptografi.hash('rahasia123');
      expect(await kriptografi.cocokkanHash(null, hash)).toBe(false);
      expect(await kriptografi.cocokkanHash('rahasia123', null)).toBe(false);
    });
  });

  describe('Akun (C23)', () => {
    test('C23-UT01 simpan menyimpan surel dalam huruf kecil dengan peran Pengguna (Algo-025)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      const id = await Akun.simpan('A', '1', ' Uji@ITB.ac.id ', '$2b$hash', 'Belum Terverifikasi', true);
      const nilai = query.mock.calls[0][1];
      expect(id).toMatch(/^[0-9a-f-]{36}$/);
      expect(nilai).toEqual([id, 'A', '1', 'uji@itb.ac.id', '$2b$hash', 'Belum Terverifikasi', 'Pengguna', true]);
    });

    test('C23-UT02 simpan meneruskan galat indeks unik surel (23505) ke pemanggil', async () => {
      jest.spyOn(db, 'query').mockRejectedValue(Object.assign(new Error('duplikat'), { code: '23505' }));
      await expect(Akun.simpan('A', '1', 'uji@itb.ac.id', '$2b$hash', 'Belum Terverifikasi', true))
        .rejects.toMatchObject({ code: '23505' });
    });

    test('C23-UT03 cariByEmail memetakan baris tabel akun ke objek Akun', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [BARIS_AKUN] });
      const akun = await Akun.cariByEmail('uji@itb.ac.id');
      expect(akun).toBeInstanceOf(Akun);
      expect(akun).toMatchObject({
        idAkun: 'akun-1', nama: 'Mahasiswa Uji', nim: '13599999', email: 'uji@itb.ac.id',
        kataSandiHash: '$2b$10$hash', statusAkun: 'Terverifikasi', statusBlokir: false, peran: 'Pengguna',
      });
    });

    test('C23-UT04 cariByEmail mencocokkan surel tanpa membedakan huruf besar/kecil (Algo-026)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      await Akun.cariByEmail('  Uji@ITB.ac.id ');
      const [sql, nilai] = query.mock.calls[0];
      expect(sql).toMatch(/LOWER\(email\) = LOWER\(\$1\)/);
      expect(nilai).toEqual(['Uji@ITB.ac.id']);
    });

    test('C23-UT05 cariByEmail mengembalikan null bila surel tidak terdaftar', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      expect(await Akun.cariByEmail('tidak-ada@itb.ac.id')).toBeNull();
    });

    test('C23-UT06 cariById mengembalikan objek Akun milik idAkun', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [BARIS_AKUN] });
      const akun = await Akun.cariById('akun-1');
      expect(akun.idAkun).toBe('akun-1');
      expect(query.mock.calls[0][1]).toEqual(['akun-1']);
    });

    test('C23-UT07 cariById mengembalikan null bila akun tidak ada', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      expect(await Akun.cariById('tidak-ada')).toBeNull();
    });

    test('C23-UT08 perbaruiStatusAkun mengubah status di basis data dan pada objek', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      const akun = new Akun({ idAkun: 'akun-1', statusAkun: 'Belum Terverifikasi' });
      expect(await akun.perbaruiStatusAkun('Terverifikasi')).toBe(true);
      expect(akun.statusAkun).toBe('Terverifikasi');
      expect(query.mock.calls[0][1]).toEqual(['Terverifikasi', 'akun-1']);
    });

    test('C23-UT09 perbaruiStatusAkun tidak mengubah objek bila tidak ada baris yang diperbarui', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 0 });
      const akun = new Akun({ idAkun: 'tidak-ada', statusAkun: 'Belum Terverifikasi' });
      expect(await akun.perbaruiStatusAkun('Terverifikasi')).toBe(false);
      expect(akun.statusAkun).toBe('Belum Terverifikasi');
    });

    test('C23-UT10 getStatusAkun mengembalikan statusAkun bila tidak diblokir', () => {
      expect(new Akun({ statusAkun: 'Terverifikasi', statusBlokir: false }).getStatusAkun()).toBe('Terverifikasi');
      expect(new Akun({ statusAkun: 'Belum Terverifikasi', statusBlokir: false }).getStatusAkun()).toBe('Belum Terverifikasi');
    });

    test('C23-UT11 getStatusAkun mengutamakan status blokir', () => {
      expect(new Akun({ statusAkun: 'Terverifikasi', statusBlokir: true }).getStatusAkun()).toBe('Diblokir');
    });

    test('C23-UT12 getDataIdentitas hanya berisi nama, surel, dan NIM (KF04)', () => {
      const akun = new Akun({ nama: 'A', email: 'a@itb.ac.id', nim: '1', kataSandiHash: '$2b$x', peran: 'Admin' });
      expect(akun.getDataIdentitas()).toEqual({ nama: 'A', email: 'a@itb.ac.id', nim: '1' });
    });

    test('C23-UT13 getSyaratTidakDiblokir memberi kriteria statusBlokir false (KF30, KF54)', () => {
      expect(Akun.getSyaratTidakDiblokir()).toEqual({ statusBlokir: false });
    });

    test('C23-UT14 getStatusBlokir true untuk akun yang diblokir (KF53)', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [{ status_blokir: true }] });
      expect(await Akun.getStatusBlokir('akun-1')).toBe(true);
    });

    test('C23-UT15 getStatusBlokir false untuk akun aktif maupun akun yang tidak ada', async () => {
      const query = jest.spyOn(db, 'query');
      query.mockResolvedValueOnce({ rows: [{ status_blokir: false }] });
      expect(await Akun.getStatusBlokir('akun-1')).toBe(false);
      query.mockResolvedValueOnce({ rows: [] });
      expect(await Akun.getStatusBlokir('tidak-ada')).toBe(false);
    });

    test('C23-UT16 blokir mengubah status menjadi "Diblokir" memakai klien transaksi (KF51)', async () => {
      const klien = { query: jest.fn().mockResolvedValue({ rowCount: 1 }) };
      const query = jest.spyOn(db, 'query');
      const akun = new Akun({ idAkun: 'akun-1', statusAkun: 'Terverifikasi', statusBlokir: false });
      expect(await akun.blokir(klien)).toBe(true);
      expect(akun).toMatchObject({ statusAkun: 'Diblokir', statusBlokir: true });
      expect(klien.query.mock.calls[0][1]).toEqual(['Diblokir', 'akun-1']);
      expect(query).not.toHaveBeenCalled();
    });

    test('C23-UT17 blokir tidak mengubah objek bila akun tidak ditemukan', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 0 });
      const akun = new Akun({ idAkun: 'tidak-ada', statusAkun: 'Terverifikasi', statusBlokir: false });
      expect(await akun.blokir()).toBe(false);
      expect(akun).toMatchObject({ statusAkun: 'Terverifikasi', statusBlokir: false });
    });

    test('C23-UT18 bukaBlokir mengembalikan status "Terverifikasi" (KF51)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      const akun = new Akun({ idAkun: 'akun-1', statusAkun: 'Diblokir', statusBlokir: true });
      expect(await akun.bukaBlokir()).toBe(true);
      expect(akun).toMatchObject({ statusAkun: 'Terverifikasi', statusBlokir: false });
      expect(query.mock.calls[0][1]).toEqual(['Terverifikasi', 'akun-1']);
    });

    test('C23-UT19 bukaBlokir tidak mengubah objek bila akun tidak ditemukan', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 0 });
      const akun = new Akun({ idAkun: 'tidak-ada', statusAkun: 'Diblokir', statusBlokir: true });
      expect(await akun.bukaBlokir()).toBe(false);
      expect(akun).toMatchObject({ statusAkun: 'Diblokir', statusBlokir: true });
    });

    test('C23-UT20 perbaruiKataSandiHash mengganti hash di basis data dan pada objek', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      const akun = new Akun({ idAkun: 'akun-1', kataSandiHash: '$2b$10$lama' });
      expect(await akun.perbaruiKataSandiHash('$2b$10$baru')).toBe(true);
      expect(akun.kataSandiHash).toBe('$2b$10$baru');
      expect(query.mock.calls[0][1]).toEqual(['$2b$10$baru', 'akun-1']);
    });

    test('C23-UT21 perbaruiKataSandiHash tidak mengubah objek bila akun tidak ditemukan', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 0 });
      const akun = new Akun({ idAkun: 'tidak-ada', kataSandiHash: '$2b$10$lama' });
      expect(await akun.perbaruiKataSandiHash('$2b$10$baru')).toBe(false);
      expect(akun.kataSandiHash).toBe('$2b$10$lama');
    });
  });

  describe('Penjual (C25)', () => {
    test('C25-UT01 getIdentitas mengembalikan identitas publik penjual (Algo-027)', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({
        rows: [{ id_akun: 'akun-1', nama: 'Penjual Uji', email: 'penjual@itb.ac.id', status_akun: 'Terverifikasi' }],
      });
      expect(await Penjual.getIdentitas('akun-1')).toEqual({
        idPenjual: 'akun-1', namaPenjual: 'Penjual Uji', emailPenjual: 'penjual@itb.ac.id', statusVerifikasi: 'Terverifikasi',
      });
    });

    test('C25-UT02 getIdentitas mengembalikan null bila penjual tidak ada', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      expect(await Penjual.getIdentitas('tidak-ada')).toBeNull();
    });
  });

  describe('Admin (C26)', () => {
    test('C26-UT01 verifikasiPeran true untuk akun berperan Admin yang tidak diblokir (Algo-028, KF56)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [{ jumlah: 1 }] });
      expect(await Admin.verifikasiPeran('admin-1')).toBe(true);
      const [sql, nilai] = query.mock.calls[0];
      expect(sql).toMatch(/peran = \$2/);
      expect(sql).toMatch(/status_blokir = false/);
      expect(nilai).toEqual(['admin-1', 'Admin']);
    });

    test('C26-UT02 verifikasiPeran false untuk akun Pengguna, admin diblokir, atau akun yang tidak ada', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [{ jumlah: 0 }] });
      expect(await Admin.verifikasiPeran('pengguna-1')).toBe(false);
    });

    test('C26-UT03 Admin mewarisi atribut dan operasi Akun', () => {
      const admin = Admin.dariBaris({ ...BARIS_AKUN, peran: 'Admin' });
      expect(admin).toBeInstanceOf(Admin);
      expect(admin).toBeInstanceOf(Akun);
      expect(admin.getStatusAkun()).toBe('Terverifikasi');
    });
  });

  describe('TokenVerifikasi (C27)', () => {
    const token = (data) => new TokenVerifikasi({ idToken: 'token-1', kode: '012345', ...data });

    test('C27-UT01 simpan menyisipkan token beserta status pakai', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      const buat = new Date('2026-11-15T00:00:00Z');
      const kedaluwarsa = new Date('2026-11-15T00:15:00Z');
      expect(await TokenVerifikasi.simpan('akun-1', '012345', buat, kedaluwarsa, 'Aktif')).toBe(true);
      const nilai = query.mock.calls[0][1];
      expect(nilai[0]).toMatch(/^[0-9a-f-]{36}$/);
      expect(nilai.slice(1)).toEqual(['akun-1', '012345', buat, kedaluwarsa, 'Aktif']);
    });

    test('C27-UT02 simpan mengembalikan false bila tidak ada baris yang tersimpan', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 0 });
      expect(await TokenVerifikasi.simpan('akun-1', '012345', new Date(), new Date(), 'Aktif')).toBe(false);
    });

    test('C27-UT03 cariTokenAktif memetakan baris ke objek TokenVerifikasi', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({
        rows: [{
          id_token: 'token-1', id_akun: 'akun-1', kode: '012345',
          waktu_buat: new Date(), waktu_kedaluwarsa: new Date(), status_pakai: 'Aktif',
        }],
      });
      const hasil = await TokenVerifikasi.cariTokenAktif('akun-1');
      expect(hasil).toBeInstanceOf(TokenVerifikasi);
      expect(hasil).toMatchObject({ idToken: 'token-1', idAkun: 'akun-1', kode: '012345', statusPakai: 'Aktif' });
    });

    test('C27-UT04 cariTokenAktif mengambil token "Aktif" terbaru, null bila tidak ada (Algo-029)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      expect(await TokenVerifikasi.cariTokenAktif('akun-1')).toBeNull();
      const [sql, nilai] = query.mock.calls[0];
      expect(sql).toMatch(/ORDER BY waktu_buat DESC/);
      expect(nilai).toEqual(['akun-1', 'Aktif']);
    });

    test('C27-UT05 cocokkanKode menerima kode yang persis sama', () => {
      expect(token().cocokkanKode('012345')).toBe(true);
    });

    test('C27-UT06 cocokkanKode mengabaikan spasi di tepi dan mempertahankan nol di depan', () => {
      expect(token().cocokkanKode(' 012345 ')).toBe(true);
      expect(token().cocokkanKode('12345')).toBe(false);
    });

    test('C27-UT07 cocokkanKode menolak kode berbeda atau bukan teks', () => {
      expect(token().cocokkanKode('012346')).toBe(false);
      expect(token().cocokkanKode(12345)).toBe(false);
      expect(token().cocokkanKode(undefined)).toBe(false);
    });

    test('C27-UT08 sudahKedaluwarsa false sebelum batas waktu', () => {
      expect(token({ waktuKedaluwarsa: new Date(Date.now() + 60000) }).sudahKedaluwarsa()).toBe(false);
    });

    test('C27-UT09 sudahKedaluwarsa true setelah batas waktu', () => {
      expect(token({ waktuKedaluwarsa: new Date(Date.now() - 1000) }).sudahKedaluwarsa()).toBe(true);
    });

    test('C27-UT10 tandaiTerpakai mengubah status_pakai menjadi "Terpakai" (KF07)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      const t = token({ statusPakai: 'Aktif' });
      await t.tandaiTerpakai();
      expect(t.statusPakai).toBe('Terpakai');
      expect(query.mock.calls[0][1]).toEqual(['Terpakai', 'token-1']);
    });

    test('C27-UT11 tandaiHangus mengubah status_pakai menjadi "Hangus" (Algo-005)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      const t = token({ statusPakai: 'Aktif' });
      await t.tandaiHangus();
      expect(t.statusPakai).toBe('Hangus');
      expect(query.mock.calls[0][1]).toEqual(['Hangus', 'token-1']);
    });
  });

  describe('SesiLogin (C28)', () => {
    test('C28-UT01 buatToken menghasilkan 64 karakter hex yang berbeda setiap kali', () => {
      const a = SesiLogin.buatToken('akun-1');
      const b = SesiLogin.buatToken('akun-1');
      expect(a).toMatch(/^[0-9a-f]{64}$/);
      expect(a).not.toBe(b);
    });

    test('C28-UT02 simpan mencatat sesi aktif beserta masa berlakunya (KF11)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      const mulai = new Date('2026-11-15T00:00:00Z');
      const kedaluwarsa = new Date('2026-11-16T00:00:00Z');
      expect(await SesiLogin.simpan('akun-1', 'tkn', mulai, kedaluwarsa)).toBe(true);
      const [sql, nilai] = query.mock.calls[0];
      expect(sql).toMatch(/VALUES \(\$1, \$2, \$3, \$4, \$5, true\)/);
      expect(nilai.slice(1)).toEqual(['akun-1', 'tkn', mulai, kedaluwarsa]);
    });

    test('C28-UT03 simpan mengembalikan false bila tidak ada baris yang tersimpan', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 0 });
      expect(await SesiLogin.simpan('akun-1', 'tkn', new Date(), new Date())).toBe(false);
    });

    test('C28-UT04 cariSesiAktif memetakan baris ke objek SesiLogin', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({
        rows: [{
          id_sesi: 'sesi-1', id_akun: 'akun-1', token: 'tkn',
          waktu_mulai: new Date(), waktu_kedaluwarsa: new Date(), status_aktif: true,
        }],
      });
      const sesi = await SesiLogin.cariSesiAktif('tkn');
      expect(sesi).toBeInstanceOf(SesiLogin);
      expect(sesi).toMatchObject({ idSesi: 'sesi-1', idAkun: 'akun-1', token: 'tkn', statusAktif: true });
    });

    test('C28-UT05 cariSesiAktif hanya mengambil sesi aktif yang belum kedaluwarsa (Algo-030)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      expect(await SesiLogin.cariSesiAktif('tkn')).toBeNull();
      const sql = query.mock.calls[0][0];
      expect(sql).toMatch(/status_aktif = true/);
      expect(sql).toMatch(/waktu_kedaluwarsa > now\(\)/);
    });

    test('C28-UT06 getIdAkun mengembalikan pemilik sesi', () => {
      expect(new SesiLogin({ idAkun: 'akun-1' }).getIdAkun()).toBe('akun-1');
    });

    test('C28-UT07 nonaktifkan menonaktifkan sesi milik token (KF12)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      await SesiLogin.nonaktifkan('tkn');
      const [sql, nilai] = query.mock.calls[0];
      expect(sql).toMatch(/SET status_aktif = false WHERE token = \$1/);
      expect(nilai).toEqual(['tkn']);
    });

    test('C28-UT08 nonaktifkanByAkun mencabut semua sesi akun, dengan atau tanpa klien transaksi (Algo-031)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 2 });
      await SesiLogin.nonaktifkanByAkun('akun-1');
      expect(query.mock.calls[0][1]).toEqual(['akun-1']);

      const klien = { query: jest.fn().mockResolvedValue({ rowCount: 1 }) };
      await SesiLogin.nonaktifkanByAkun('akun-2', klien);
      expect(klien.query.mock.calls[0][0]).toMatch(/WHERE id_akun = \$1 AND status_aktif = true/);
      expect(klien.query.mock.calls[0][1]).toEqual(['akun-2']);
      expect(query).toHaveBeenCalledTimes(1);
    });
  });

  describe('DokumenLegal (C40)', () => {
    test('C40-UT01 getVersiTerbaru memetakan baris ke objek DokumenLegal', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({
        rows: [{
          id_dokumen: 'dok-1', jenis_dokumen: 'kebijakan-privasi', judul: 'Kebijakan Privasi', isi: 'isi',
          klausa_privasi_pesan: 'Isi percakapan pribadi dienkripsi', versi: '1.0', tanggal_berlaku: '2026-10-01',
          status_publikasi: true, tautan: '/legal?jenis=kebijakan-privasi',
        }],
      });
      const dokumen = await DokumenLegal.getVersiTerbaru('kebijakan-privasi');
      expect(dokumen).toBeInstanceOf(DokumenLegal);
      expect(dokumen).toMatchObject({ judul: 'Kebijakan Privasi', versi: '1.0', klausaPrivasiPesan: 'Isi percakapan pribadi dienkripsi' });
    });

    test('C40-UT02 getVersiTerbaru hanya mengambil versi terpublikasi yang sudah berlaku, null bila tidak ada (Algo-063)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      expect(await DokumenLegal.getVersiTerbaru('kebijakan-privasi')).toBeNull();
      const [sql, nilai] = query.mock.calls[0];
      expect(sql).toMatch(/status_publikasi = true/);
      expect(sql).toMatch(/tanggal_berlaku <= CURRENT_DATE/);
      expect(sql).toMatch(/ORDER BY tanggal_berlaku DESC, versi DESC/);
      expect(nilai).toEqual(['kebijakan-privasi']);
    });

    test('C40-UT03 getTautan dan getIsi mengembalikan atribut dokumen', () => {
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
