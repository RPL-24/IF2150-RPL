// src/tests/unit/ModelModulD.test.js
// Pengujian unit kelas Model Modul D:
//   C33 Percakapan, C34 Pesan, C35 Notifikasi, dan LanggananPush (prefiks LGP).
// Kueri basis data diganti tiruan (jest.spyOn(db, 'query')); perilaku SQL terhadap PostgreSQL
// sungguhan diuji di src/tests/db/ModulD.test.js.
const db = require('../../config/db');
const Percakapan = require('../../models/Percakapan');
const Pesan = require('../../models/Pesan');
const Notifikasi = require('../../models/Notifikasi');
const LanggananPush = require('../../models/LanggananPush');

const WAKTU = new Date('2026-11-10T08:00:00Z');
const ID_PERCAKAPAN = '55555555-5555-4555-8555-555555555555';
const ID_PEMBELI = '11111111-1111-4111-8111-111111111111';
const ID_PENJUAL = '22222222-2222-4222-8222-222222222222';
const ID_BARANG = '44444444-4444-4444-8444-444444444444';
const ID_PESAN = '66666666-6666-4666-8666-666666666666';
const ID_NOTIF = '77777777-7777-4777-8777-777777777777';
const ID_LANGGANAN = '88888888-8888-4888-8888-888888888888';

const BARIS_PERCAKAPAN = {
  id_percakapan: ID_PERCAKAPAN,
  id_pembeli: ID_PEMBELI,
  id_penjual: ID_PENJUAL,
  id_barang: ID_BARANG,
  waktu_dibuat: WAKTU,
  waktu_pembaruan_terakhir: WAKTU,
};

const BARIS_PESAN = {
  id_pesan: ID_PESAN,
  id_percakapan: ID_PERCAKAPAN,
  id_pengirim: ID_PEMBELI,
  isi_pesan_terenkripsi: 'ciphertext-base64',
  waktu_kirim: WAKTU,
  status_baca: false,
};

const BARIS_NOTIF = {
  id_notifikasi: ID_NOTIF,
  id_akun: ID_PENJUAL,
  jenis: 'pesan',
  isi: 'Pesan baru dari Pembeli Uji',
  waktu_kirim: WAKTU,
  status_baca: false,
};

const BARIS_LANGGANAN = {
  id: ID_LANGGANAN,
  id_akun: ID_PENJUAL,
  endpoint: 'https://push.contoh.test/sub-1',
  p256dh: 'kunci-p256dh',
  auth: 'kunci-auth',
};

describe('Model Modul D Unit Test', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Percakapan (C33)', () => {
    test('C33-UT01 [Normal] dariBaris: memetakan baris snake_case menjadi objek Percakapan', () => {
      const p = Percakapan.dariBaris(BARIS_PERCAKAPAN);
      expect(p).toBeInstanceOf(Percakapan);
      expect(p).toEqual(
        expect.objectContaining({
          idPercakapan: ID_PERCAKAPAN,
          idPembeli: ID_PEMBELI,
          idPenjual: ID_PENJUAL,
          idBarang: ID_BARANG,
          waktuDibuat: WAKTU,
          waktuPembaruanTerakhir: WAKTU,
        }),
      );
    });

    test('C33-UT02 [Batas] dariBaris: baris null atau undefined mengembalikan null', () => {
      expect(Percakapan.dariBaris(null)).toBeNull();
      expect(Percakapan.dariBaris(undefined)).toBeNull();
    });

    test('C33-UT03 [Normal] cariById: mengembalikan objek Percakapan bila ditemukan', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [BARIS_PERCAKAPAN] });
      const p = await Percakapan.cariById(ID_PERCAKAPAN);
      expect(p).toBeInstanceOf(Percakapan);
      expect(p.idPercakapan).toBe(ID_PERCAKAPAN);
      expect(query).toHaveBeenCalledWith(expect.stringContaining('WHERE id_percakapan = $1'), [ID_PERCAKAPAN]);
    });

    test('C33-UT04 [Negatif] cariById: mengembalikan null bila tidak ditemukan', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      expect(await Percakapan.cariById(ID_PERCAKAPAN)).toBeNull();
    });

    test('C33-UT05 [Normal] cariByKombinasi: kueri mencari kombinasi id_barang, id_pembeli, id_penjual (Algo-040)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [BARIS_PERCAKAPAN] });
      const p = await Percakapan.cariByKombinasi(ID_BARANG, ID_PEMBELI, ID_PENJUAL);
      expect(p.idPercakapan).toBe(ID_PERCAKAPAN);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE id_barang = $1 AND id_pembeli = $2 AND id_penjual = $3'),
        [ID_BARANG, ID_PEMBELI, ID_PENJUAL],
      );
    });

    test('C33-UT06 [Negatif] cariByKombinasi: mengembalikan null bila kombinasi belum ada', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      expect(await Percakapan.cariByKombinasi(ID_BARANG, ID_PEMBELI, ID_PENJUAL)).toBeNull();
    });

    test('C33-UT07 [Normal] simpan: INSERT percakapan baru dengan UUID dan mengembalikan objek Percakapan (Algo-041)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [BARIS_PERCAKAPAN] });
      const p = await Percakapan.simpan(ID_BARANG, ID_PEMBELI, ID_PENJUAL);
      expect(p).toBeInstanceOf(Percakapan);
      expect(query.mock.calls[0][0]).toContain('INSERT INTO percakapan');
      expect(query.mock.calls[0][1][0]).toMatch(/^[0-9a-f-]{36}$/);
      expect(query.mock.calls[0][1].slice(1, 4)).toEqual([ID_PEMBELI, ID_PENJUAL, ID_BARANG]);
    });

    test('C33-UT08 [Batas] simpan: saat ON CONFLICT DO NOTHING (0 baris kembali), mengembalikan hasil cariByKombinasi', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
      const cari = jest.spyOn(Percakapan, 'cariByKombinasi').mockResolvedValue(Percakapan.dariBaris(BARIS_PERCAKAPAN));

      const p = await Percakapan.simpan(ID_BARANG, ID_PEMBELI, ID_PENJUAL);
      expect(cari).toHaveBeenCalledWith(ID_BARANG, ID_PEMBELI, ID_PENJUAL);
      expect(p.idPercakapan).toBe(ID_PERCAKAPAN);
    });

    test('C33-UT09 [Normal] cekPeserta: mengembalikan true untuk pembeli dan penjual', () => {
      const p = Percakapan.dariBaris(BARIS_PERCAKAPAN);
      expect(p.cekPeserta(ID_PEMBELI)).toBe(true);
      expect(p.cekPeserta(ID_PENJUAL)).toBe(true);
    });

    test('C33-UT10 [Negatif] cekPeserta: mengembalikan false untuk pihak ketiga, admin, null, dan undefined (KF35)', () => {
      const p = Percakapan.dariBaris(BARIS_PERCAKAPAN);
      expect(p.cekPeserta('33333333-3333-4333-8333-333333333333')).toBe(false);
      expect(p.cekPeserta(null)).toBe(false);
      expect(p.cekPeserta(undefined)).toBe(false);
    });

    test('C33-UT11 [Normal] addPesan: meneruskan idPercakapan, idPengirim, dan isi terenkripsi ke Pesan.simpanPesan', async () => {
      const p = Percakapan.dariBaris(BARIS_PERCAKAPAN);
      const pesan = Pesan.dariBaris(BARIS_PESAN);
      const simpanPesan = jest.spyOn(Pesan, 'simpanPesan').mockResolvedValue(pesan);

      const hasil = await p.addPesan(ID_PEMBELI, 'ciphertext-base64');
      expect(simpanPesan).toHaveBeenCalledWith(ID_PERCAKAPAN, ID_PEMBELI, 'ciphertext-base64');
      expect(hasil).toBe(pesan);
    });

    test('C33-UT12 [Normal] perbaruiWaktuTerakhir: menjalankan UPDATE dan memperbarui atribut objek (Algo-042)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      const p = Percakapan.dariBaris(BARIS_PERCAKAPAN);
      const waktuBaru = new Date('2026-11-10T09:15:00Z');

      await p.perbaruiWaktuTerakhir(waktuBaru);
      expect(query).toHaveBeenCalledWith(
        'UPDATE percakapan SET waktu_pembaruan_terakhir = $1 WHERE id_percakapan = $2',
        [waktuBaru, ID_PERCAKAPAN],
      );
      expect(p.waktuPembaruanTerakhir).toBe(waktuBaru);
    });

    test('C33-UT13 [Normal] getDaftarPercakapanByPengguna: kueri OR id_pembeli/id_penjual urut terbaru dulu (Algo-043)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [BARIS_PERCAKAPAN] });
      const daftar = await Percakapan.getDaftarPercakapanByPengguna(ID_PEMBELI);
      expect(daftar).toHaveLength(1);
      expect(daftar[0]).toBeInstanceOf(Percakapan);
      expect(query.mock.calls[0][0]).toContain('WHERE id_pembeli = $1 OR id_penjual = $1');
      expect(query.mock.calls[0][0]).toContain('ORDER BY waktu_pembaruan_terakhir DESC');
    });

    test('C33-UT14 [Normal] getLawanBicara: mengembalikan penjual bagi pembeli, pembeli bagi penjual, dan null bila akun tidak ada (Algo-044)', async () => {
      const p = Percakapan.dariBaris(BARIS_PERCAKAPAN);
      const query = jest
        .spyOn(db, 'query')
        .mockResolvedValueOnce({ rows: [{ id_akun: ID_PENJUAL, nama: 'Penjual Uji' }] })
        .mockResolvedValueOnce({ rows: [{ id_akun: ID_PEMBELI, nama: 'Pembeli Uji' }] })
        .mockResolvedValueOnce({ rows: [] });

      expect(await p.getLawanBicara(ID_PEMBELI)).toEqual({ idAkun: ID_PENJUAL, nama: 'Penjual Uji' });
      expect(query.mock.calls[0][1]).toEqual([ID_PENJUAL]);

      expect(await p.getLawanBicara(ID_PENJUAL)).toEqual({ idAkun: ID_PEMBELI, nama: 'Pembeli Uji' });
      expect(query.mock.calls[1][1]).toEqual([ID_PEMBELI]);

      expect(await p.getLawanBicara(ID_PEMBELI)).toBeNull();
    });
  });

  describe('Pesan (C34)', () => {
    test('C34-UT01 [Normal] dariBaris: memetakan baris pesan ke objek Pesan', () => {
      const m = Pesan.dariBaris(BARIS_PESAN);
      expect(m).toBeInstanceOf(Pesan);
      expect(m).toEqual(
        expect.objectContaining({
          idPesan: ID_PESAN,
          idPercakapan: ID_PERCAKAPAN,
          idPengirim: ID_PEMBELI,
          isiPesanTerenkripsi: 'ciphertext-base64',
          waktuKirim: WAKTU,
          statusBaca: false,
        }),
      );
    });

    test('C34-UT02 [Batas] dariBaris: baris null mengembalikan null', () => {
      expect(Pesan.dariBaris(null)).toBeNull();
    });

    test('C34-UT03 [Normal] getDaftarPesan: mengambil pesan urut waktu_kirim ASC (Algo-045)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [BARIS_PESAN] });
      const daftar = await Pesan.getDaftarPesan(ID_PERCAKAPAN);
      expect(daftar).toHaveLength(1);
      expect(daftar[0]).toBeInstanceOf(Pesan);
      expect(query.mock.calls[0][0]).toContain('ORDER BY waktu_kirim ASC');
      expect(query.mock.calls[0][1]).toEqual([ID_PERCAKAPAN]);
    });

    test('C34-UT04 [Batas] getDaftarPesan: percakapan tanpa pesan mengembalikan daftar kosong', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      expect(await Pesan.getDaftarPesan(ID_PERCAKAPAN)).toEqual([]);
    });

    test('C34-UT05 [Normal] simpanPesan: INSERT isi terenkripsi dengan status_baca false (Algo-046)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [BARIS_PESAN] });
      const m = await Pesan.simpanPesan(ID_PERCAKAPAN, ID_PEMBELI, 'ciphertext-base64');
      expect(m).toBeInstanceOf(Pesan);
      expect(query.mock.calls[0][0]).toContain('INSERT INTO pesan');
      expect(query.mock.calls[0][0]).toContain('false');
      expect(query.mock.calls[0][1][0]).toMatch(/^[0-9a-f-]{36}$/);
      expect(query.mock.calls[0][1].slice(1)).toEqual([ID_PERCAKAPAN, ID_PEMBELI, 'ciphertext-base64']);
    });

    test('C34-UT06 [Normal] getCuplikanPesanTerakhir: mengambil satu pesan terbaru DESC LIMIT 1 (Algo-047)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [BARIS_PESAN] });
      const m = await Pesan.getCuplikanPesanTerakhir(ID_PERCAKAPAN);
      expect(m.idPesan).toBe(ID_PESAN);
      expect(query.mock.calls[0][0]).toContain('ORDER BY waktu_kirim DESC LIMIT 1');
    });

    test('C34-UT07 [Negatif] getCuplikanPesanTerakhir: mengembalikan null bila belum ada pesan', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      expect(await Pesan.getCuplikanPesanTerakhir(ID_PERCAKAPAN)).toBeNull();
    });

    test('C34-UT08 [Normal] tandaiDibaca: memperbarui pesan lawan bicara (id_pengirim <> $2) yang belum dibaca', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 3 });
      const jumlah = await Pesan.tandaiDibaca(ID_PERCAKAPAN, ID_PENJUAL);
      expect(jumlah).toBe(3);
      expect(query.mock.calls[0][0]).toContain('id_pengirim <> $2 AND status_baca = false');
      expect(query.mock.calls[0][1]).toEqual([ID_PERCAKAPAN, ID_PENJUAL]);
    });

    test('C34-UT09 [Normal] hitungPesanBelumDibaca: menghitung pesan lawan bicara yang belum dibaca (Algo-048)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [{ jumlah: 4 }] });
      expect(await Pesan.hitungPesanBelumDibaca(ID_PERCAKAPAN, ID_PENJUAL)).toBe(4);
      expect(query.mock.calls[0][0]).toContain('id_pengirim <> $2 AND status_baca = false');
    });

    test('C34-UT10 [Batas] hitungPesanBelumDibaca: mengembalikan 0 bila semua pesan sudah dibaca', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [{ jumlah: 0 }] });
      expect(await Pesan.hitungPesanBelumDibaca(ID_PERCAKAPAN, ID_PENJUAL)).toBe(0);
    });
  });

  describe('Notifikasi (C35)', () => {
    test('C35-UT01 [Normal] dariBaris: memetakan baris notifikasi menjadi objek Notifikasi', () => {
      const n = Notifikasi.dariBaris(BARIS_NOTIF);
      expect(n).toBeInstanceOf(Notifikasi);
      expect(n).toEqual(
        expect.objectContaining({
          idNotifikasi: ID_NOTIF,
          idAkun: ID_PENJUAL,
          jenis: 'pesan',
          isi: 'Pesan baru dari Pembeli Uji',
          waktuKirim: WAKTU,
          statusBaca: false,
        }),
      );
    });

    test('C35-UT02 [Batas] dariBaris: baris null mengembalikan null', () => {
      expect(Notifikasi.dariBaris(null)).toBeNull();
    });

    test('C35-UT03 [Normal] simpan: INSERT notifikasi lengkap dan nilai bawaan waktuKirim/statusBaca mengembalikan true (Algo-049)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      expect(await Notifikasi.simpan(ID_PENJUAL, 'pesan', 'Pesan baru', WAKTU, false)).toBe(true);
      expect(query.mock.calls[0][1].slice(1)).toEqual([ID_PENJUAL, 'pesan', 'Pesan baru', WAKTU, false]);

      expect(await Notifikasi.simpan(ID_PENJUAL, 'pesan', 'Pesan bawaan')).toBe(true);
      expect(query.mock.calls[1][1][4]).toBeInstanceOf(Date);
      expect(query.mock.calls[1][1][5]).toBe(false);
    });

    test('C35-UT04 [Negatif] simpan: mengembalikan false bila tidak ada baris yang tersimpan', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 0 });
      expect(await Notifikasi.simpan(ID_PENJUAL, 'pesan', 'Pesan', WAKTU, false)).toBe(false);
    });

    test('C35-UT05 [Normal] hitungBelumDibaca: menghitung notifikasi belum dibaca milik akun (Algo-050)', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [{ jumlah: 5 }] });
      expect(await Notifikasi.hitungBelumDibaca(ID_PENJUAL)).toBe(5);
      expect(query.mock.calls[0][1]).toEqual([ID_PENJUAL]);
    });

    test('C35-UT06 [Normal] getDaftarByAkun: mengambil daftar terbaru dengan batas bawaan 50 dan batas khusus', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rows: [BARIS_NOTIF] });
      const daftar = await Notifikasi.getDaftarByAkun(ID_PENJUAL);
      expect(daftar).toHaveLength(1);
      expect(daftar[0]).toBeInstanceOf(Notifikasi);
      expect(query.mock.calls[0][1]).toEqual([ID_PENJUAL, 50]);

      await Notifikasi.getDaftarByAkun(ID_PENJUAL, 10);
      expect(query.mock.calls[1][1]).toEqual([ID_PENJUAL, 10]);
    });

    test('C35-UT07 [Batas] getDaftarByAkun: mengembalikan daftar kosong bila belum ada notifikasi', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      expect(await Notifikasi.getDaftarByAkun(ID_PENJUAL)).toEqual([]);
    });

    test('C35-UT08 [Normal] tandaiDibaca: menandai notifikasi milik akun mengembalikan true', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      expect(await Notifikasi.tandaiDibaca(ID_NOTIF, ID_PENJUAL)).toBe(true);
      expect(query.mock.calls[0][0]).toContain('WHERE id_notifikasi = $1 AND id_akun = $2');
    });

    test('C35-UT09 [Negatif] tandaiDibaca: notifikasi tidak ditemukan atau bukan milik akun mengembalikan false', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 0 });
      expect(await Notifikasi.tandaiDibaca(ID_NOTIF, ID_PEMBELI)).toBe(false);
    });

    test('C35-UT10 [Normal] tandaiSemuaDibaca: memperbarui semua notifikasi belum dibaca milik akun dan mengembalikan jumlah baris', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 2 });
      expect(await Notifikasi.tandaiSemuaDibaca(ID_PENJUAL)).toBe(2);
      expect(query.mock.calls[0][0]).toContain('WHERE id_akun = $1 AND status_baca = false');
    });
  });

  describe('LanggananPush (LGP)', () => {
    test('LGP-UT01 [Normal] dariBaris: memetakan baris langganan_push ke objek LanggananPush', () => {
      const l = LanggananPush.dariBaris(BARIS_LANGGANAN);
      expect(l).toBeInstanceOf(LanggananPush);
      expect(l).toEqual(
        expect.objectContaining({
          id: ID_LANGGANAN,
          idAkun: ID_PENJUAL,
          endpoint: 'https://push.contoh.test/sub-1',
          p256dh: 'kunci-p256dh',
          auth: 'kunci-auth',
        }),
      );
    });

    test('LGP-UT02 [Batas] dariBaris: baris null mengembalikan null', () => {
      expect(LanggananPush.dariBaris(null)).toBeNull();
    });

    test('LGP-UT03 [Normal] simpan: INSERT ON CONFLICT (endpoint) DO UPDATE mengembalikan true', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      expect(await LanggananPush.simpan(ID_PENJUAL, 'https://push.contoh.test/sub-1', 'p', 'a')).toBe(true);
      expect(query.mock.calls[0][0]).toContain('ON CONFLICT (endpoint) DO UPDATE');
      expect(query.mock.calls[0][1][0]).toMatch(/^[0-9a-f-]{36}$/);
      expect(query.mock.calls[0][1].slice(1)).toEqual([ID_PENJUAL, 'https://push.contoh.test/sub-1', 'p', 'a']);
    });

    test('LGP-UT04 [Negatif] simpan: mengembalikan false bila rowCount 0', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 0 });
      expect(await LanggananPush.simpan(ID_PENJUAL, 'https://push.contoh.test/sub-1', 'p', 'a')).toBe(false);
    });

    test('LGP-UT05 [Normal] getByAkun: mengembalikan daftar LanggananPush milik akun dan array kosong bila belum ada', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [BARIS_LANGGANAN] }).mockResolvedValueOnce({ rows: [] });
      const ada = await LanggananPush.getByAkun(ID_PENJUAL);
      expect(ada).toHaveLength(1);
      expect(ada[0]).toBeInstanceOf(LanggananPush);
      expect(await LanggananPush.getByAkun(ID_PEMBELI)).toEqual([]);
    });

    test('LGP-UT06 [Normal] hapusByEndpoint: menghapus langganan berdasarkan endpoint mengembalikan true', async () => {
      const query = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });
      expect(await LanggananPush.hapusByEndpoint('https://push.contoh.test/sub-1')).toBe(true);
      expect(query.mock.calls[0][1]).toEqual(['https://push.contoh.test/sub-1']);
    });

    test('LGP-UT07 [Negatif] hapusByEndpoint: endpoint tidak ada mengembalikan false', async () => {
      jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 0 });
      expect(await LanggananPush.hapusByEndpoint('https://push.contoh.test/tidak-ada')).toBe(false);
    });
  });
});
