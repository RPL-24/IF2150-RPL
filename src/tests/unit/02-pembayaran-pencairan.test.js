const { siapkanDbUnit, tanggalWib } = require('./helpers/dbUnit');

let U;
let Pembayaran;
let PencairanDana;
let PaymentGateway;
let idSisi;
let idAmi;

beforeAll(() => {
  U = siapkanDbUnit();
  Pembayaran = require('../../models/Pembayaran');
  PencairanDana = require('../../models/PencairanDana');
  PaymentGateway = require('../../services/PaymentGateway');
  idSisi = U.db.prepare("SELECT idMasyarakat FROM Masyarakat WHERE username = 'sisi'").get().idMasyarakat;
  idAmi = U.db.prepare("SELECT idMitra FROM MitraPengacara WHERE username = 'ami'").get().idMitra;
});

afterAll(() => {
  U.bersihkan();
});

describe('PG PaymentGateway (Mendalam)', () => {
  test('PG-UT01 Normal: prosesPembayaran menyetujui kartu valid non-0000', async () => {
    const hasil = await PaymentGateway.prosesPembayaran({
      metode: 'kartu',
      nomorKartu: '4111111111111111',
      kadaluwarsa: '12/29',
      cvc: '123',
      nominal: 70000,
    });
    expect(hasil.sukses || hasil.berhasil).toBe(true);
  });

  test('PG-UT02 Batas: prosesPembayaran menyetujui kartu batas non-0000 (1000000000000001)', async () => {
    const hasil = await PaymentGateway.prosesPembayaran({
      metode: 'kartu',
      nomorKartu: '1000000000000001',
      kadaluwarsa: '12/29',
      cvc: '123',
      nominal: 70000,
    });
    expect(hasil.sukses || hasil.berhasil).toBe(true);
  });

  test('PG-UT03 Negatif: prosesPembayaran menolak kartu berawalan 0000', async () => {
    const hasil = await PaymentGateway.prosesPembayaran({
      metode: 'kartu',
      nomorKartu: '0000111122223333',
      kadaluwarsa: '12/29',
      cvc: '123',
      nominal: 70000,
    });
    expect(hasil.sukses || hasil.berhasil).toBe(false);
    expect(hasil.pesan || hasil.message).toContain('Kartu ditolak oleh bank penerbit');
  });

  test('PG-UT04 Normal: prosesPencairan menyetujui transfer ke rekening tujuan valid', async () => {
    const hasil = await PaymentGateway.prosesPencairan({
      rekeningTujuan: 'BCA|1234567890|Ami Pengacara',
      nominal: 100000,
    });
    expect(hasil.sukses || hasil.berhasil).toBe(true);
  });
});

describe('C49 Pembayaran (Mendalam)', () => {
  test('C49-UT01 Normal: hitungBiaya mengembalikan rincian biaya sesi konsultasi', () => {
    const info = U.db.prepare(
      `INSERT INTO SesiKonsultasi (idMasyarakat, idMitra, tanggalJadwal, waktuJadwal, statusSesi, statusPembayaran, waktuPengajuan)
       VALUES (?, ?, ?, '15:00', 'terjadwal', 'belum bayar', ?)`
    ).run(idSisi, idAmi, tanggalWib(2), new Date().toISOString());

    const biaya = Pembayaran.hitungBiaya(info.lastInsertRowid);
    expect(biaya).toBeDefined();
    expect(biaya.total || biaya.totalBayar || biaya).toBe(70000);
  });

  test('C49-UT02 Negatif: hitungBiaya untuk idSesi tidak terdaftar mengembalikan falsy', () => {
    expect(Pembayaran.hitungBiaya(999999)).toBeFalsy();
  });

  // Dilaporkan FAIL apa adanya (selaras dengan INT-TC33): terdapat karakter '+' pada query UPDATE SesiKonsultasi di models/Pembayaran.js
  test('C49-UT03 Normal: simpanHasil mencatat transaksi berhasil, melunasi sesi, dan menambah saldo mitra', () => {
    const info = U.db.prepare(
      `INSERT INTO SesiKonsultasi (idMasyarakat, idMitra, tanggalJadwal, waktuJadwal, statusSesi, statusPembayaran, waktuPengajuan)
       VALUES (?, ?, ?, '16:00', 'terjadwal', 'belum bayar', ?)`
    ).run(idSisi, idAmi, tanggalWib(2), new Date().toISOString());
    const idSesi = info.lastInsertRowid;
    const saldoAwal = U.db.prepare('SELECT saldo FROM MitraPengacara WHERE idMitra = ?').get(idAmi).saldo;

    Pembayaran.simpanHasil({
      idSesi,
      metodePembayaran: 'kartu',
      totalBayar: 70000,
      statusPembayaran: 'berhasil',
      referensiGateway: 'REF-UT-01',
    });

    const sesi = U.db.prepare('SELECT statusPembayaran FROM SesiKonsultasi WHERE idSesi = ?').get(idSesi);
    expect(sesi.statusPembayaran).toBe('lunas');
    expect(U.db.prepare('SELECT saldo FROM MitraPengacara WHERE idMitra = ?').get(idAmi).saldo).toBe(saldoAwal + 70000);
  });
});

describe('C51 PencairanDana (Mendalam)', () => {
  test('C51-UT01 Normal: profilKeuangan mengembalikan saldo dan rekening terdaftar mitra', () => {
    const profil = PencairanDana.profilKeuangan(idAmi);
    expect(profil).toBeDefined();
    expect(typeof profil.saldo).toBe('number');
  });

  test('C51-UT02 Normal: ajukan mengurangi saldo mitra dan menyimpan riwayat pencairan', () => {
    U.db.prepare('UPDATE MitraPengacara SET saldo = 250000 WHERE idMitra = ?').run(idAmi);
    PencairanDana.ajukan(idAmi, 100000, 'BCA|1234567890|Ami Pengacara', 'REF-CAIR-01');

    expect(U.db.prepare('SELECT saldo FROM MitraPengacara WHERE idMitra = ?').get(idAmi).saldo).toBe(150000);
    expect(PencairanDana.riwayatPencairan(idAmi).length).toBeGreaterThan(0);
  });

  test('C51-UT03 Batas: ajukan tepat sebesar seluruh saldo menyisakan saldo 0', () => {
    U.db.prepare('UPDATE MitraPengacara SET saldo = 120000 WHERE idMitra = ?').run(idAmi);
    PencairanDana.ajukan(idAmi, 120000, 'BCA|1234567890|Ami Pengacara', 'REF-CAIR-02');
    expect(U.db.prepare('SELECT saldo FROM MitraPengacara WHERE idMitra = ?').get(idAmi).saldo).toBe(0);
  });

  test('C51-UT04 Negatif: ajukan melebihi saldo ditolak dan saldo mitra tetap', () => {
    U.db.prepare('UPDATE MitraPengacara SET saldo = 50000 WHERE idMitra = ?').run(idAmi);
    expect(() => {
      PencairanDana.ajukan(idAmi, 50001, 'BCA|1234567890|Ami Pengacara', 'REF-CAIR-03');
    }).toThrow();
    expect(U.db.prepare('SELECT saldo FROM MitraPengacara WHERE idMitra = ?').get(idAmi).saldo).toBe(50000);
  });
});