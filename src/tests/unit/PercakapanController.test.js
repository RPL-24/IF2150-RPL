// Uji C18 PercakapanController (UC16, UC17, UC18) dengan model di-mock; tidak butuh basis data.
const crypto = require('crypto');
const Kriptografi = require('../../pendukung/Kriptografi');
const PercakapanController = require('../../controllers/PercakapanController');
const Percakapan = require('../../models/Percakapan');
const Pesan = require('../../models/Pesan');
const Barang = require('../../models/Barang');
const FotoBarang = require('../../models/FotoBarang');
const Akun = require('../../models/Akun');
const NotifikasiController = require('../../controllers/NotifikasiController');

const ID_PEMBELI = '11111111-1111-4111-8111-111111111111';
const ID_PENJUAL = '22222222-2222-4222-8222-222222222222';
const ID_ADMIN = '33333333-3333-4333-8333-333333333333';
const ID_BARANG = '44444444-4444-4444-8444-444444444444';
const ID_PERCAKAPAN = '55555555-5555-4555-8555-555555555555';

const barangContoh = () => new Barang({ idBarang: ID_BARANG, idPenjual: ID_PENJUAL, judul: 'Jas Lab', harga: 50000 });
const percakapanContoh = () =>
  new Percakapan({
    idPercakapan: ID_PERCAKAPAN,
    idPembeli: ID_PEMBELI,
    idPenjual: ID_PENJUAL,
    idBarang: ID_BARANG,
    waktuPembaruanTerakhir: new Date('2026-11-09T10:00:00Z'),
  });

beforeAll(() => {
  Kriptografi.kunciEnkripsi = crypto.randomBytes(32).toString('hex');
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('PercakapanController.mulaiPercakapan (UC16, KF31)', () => {
  beforeEach(() => {
    jest.spyOn(Barang, 'cariById').mockResolvedValue(barangContoh());
    jest.spyOn(Akun, 'getStatusBlokir').mockResolvedValue(false);
  });

  test('penjual diblokir ditolak 403 tanpa membuat percakapan', async () => {
    Akun.getStatusBlokir.mockResolvedValue(true);
    const simpan = jest.spyOn(Percakapan, 'simpan');

    const hasil = await PercakapanController.mulaiPercakapan(ID_PEMBELI, ID_BARANG);

    expect(hasil).toMatchObject({ berhasil: false, status: 403 });
    expect(simpan).not.toHaveBeenCalled();
  });

  test('menghubungi listing sendiri ditolak 400', async () => {
    const simpan = jest.spyOn(Percakapan, 'simpan');

    const hasil = await PercakapanController.mulaiPercakapan(ID_PENJUAL, ID_BARANG);

    expect(hasil).toMatchObject({ berhasil: false, status: 400 });
    expect(simpan).not.toHaveBeenCalled();
  });

  test('barang tidak ada atau id tidak valid ditolak 404', async () => {
    Barang.cariById.mockResolvedValue(null);
    expect(await PercakapanController.mulaiPercakapan(ID_PEMBELI, ID_BARANG)).toMatchObject({ status: 404 });
    expect(await PercakapanController.mulaiPercakapan(ID_PEMBELI, 'bukan-uuid')).toMatchObject({ status: 404 });
    expect(await PercakapanController.mulaiPercakapan(ID_PEMBELI, undefined)).toMatchObject({ status: 404 });
  });

  test('kombinasi lama dipakai ulang (200) tanpa membuat percakapan baru', async () => {
    jest.spyOn(Percakapan, 'cariByKombinasi').mockResolvedValue(percakapanContoh());
    const simpan = jest.spyOn(Percakapan, 'simpan');

    const hasil = await PercakapanController.mulaiPercakapan(ID_PEMBELI, ID_BARANG);

    expect(Percakapan.cariByKombinasi).toHaveBeenCalledWith(ID_BARANG, ID_PEMBELI, ID_PENJUAL);
    expect(hasil).toEqual({ berhasil: true, status: 200, data: { idPercakapan: ID_PERCAKAPAN } });
    expect(simpan).not.toHaveBeenCalled();
  });

  test('kombinasi baru membuat percakapan (201)', async () => {
    jest.spyOn(Percakapan, 'cariByKombinasi').mockResolvedValue(null);
    jest.spyOn(Percakapan, 'simpan').mockResolvedValue(percakapanContoh());

    const hasil = await PercakapanController.mulaiPercakapan(ID_PEMBELI, ID_BARANG);

    expect(Percakapan.simpan).toHaveBeenCalledWith(ID_BARANG, ID_PEMBELI, ID_PENJUAL);
    expect(hasil).toEqual({ berhasil: true, status: 201, data: { idPercakapan: ID_PERCAKAPAN } });
  });
});

describe('PercakapanController.bukaPercakapan (UC16, KF35, KF36)', () => {
  beforeEach(() => {
    jest.spyOn(Percakapan, 'cariById').mockResolvedValue(percakapanContoh());
    jest.spyOn(Percakapan.prototype, 'getLawanBicara').mockResolvedValue({ idAkun: ID_PENJUAL, nama: 'Budi' });
    jest.spyOn(Barang, 'cariById').mockResolvedValue(barangContoh());
    jest.spyOn(FotoBarang, 'getGaleri').mockResolvedValue([{ pathBerkas: '/uploads/jas.jpg' }]);
    jest.spyOn(Pesan, 'tandaiDibaca').mockResolvedValue(1);
  });

  test('non-peserta (termasuk admin) ditolak 403 tanpa membaca pesan', async () => {
    const getDaftarPesan = jest.spyOn(Pesan, 'getDaftarPesan');

    const hasil = await PercakapanController.bukaPercakapan(ID_ADMIN, ID_PERCAKAPAN);

    expect(hasil).toMatchObject({ berhasil: false, status: 403 });
    expect(getDaftarPesan).not.toHaveBeenCalled();
    expect(Pesan.tandaiDibaca).not.toHaveBeenCalled();
  });

  test('percakapan tidak ada ditolak 404', async () => {
    Percakapan.cariById.mockResolvedValue(null);
    expect(await PercakapanController.bukaPercakapan(ID_PEMBELI, ID_PERCAKAPAN)).toMatchObject({ status: 404 });
    expect(await PercakapanController.bukaPercakapan(ID_PEMBELI, 'abc')).toMatchObject({ status: 404 });
  });

  test('peserta menerima pesan terdekripsi, pesan rusak diganti, dan pesan lawan ditandai dibaca', async () => {
    jest.spyOn(Pesan, 'getDaftarPesan').mockResolvedValue([
      new Pesan({ idPesan: 'p1', idPengirim: ID_PENJUAL, isiPesanTerenkripsi: Kriptografi.enkripsi('Masih ada') }),
      new Pesan({ idPesan: 'p2', idPengirim: ID_PEMBELI, isiPesanTerenkripsi: 'rusak' }),
    ]);

    const hasil = await PercakapanController.bukaPercakapan(ID_PEMBELI, ID_PERCAKAPAN);

    expect(hasil.status).toBe(200);
    expect(hasil.data.pesan).toEqual([
      expect.objectContaining({ idPesan: 'p1', isi: 'Masih ada', dariSaya: false }),
      expect.objectContaining({ idPesan: 'p2', isi: '[Pesan tidak dapat dibuka]', dariSaya: true }),
    ]);
    expect(hasil.data).toMatchObject({
      idAkunSaya: ID_PEMBELI,
      lawanBicara: { idAkun: ID_PENJUAL, nama: 'Budi' },
      barang: { idBarang: ID_BARANG, judul: 'Jas Lab', fotoUtama: '/uploads/jas.jpg' },
      tautanKebijakanPrivasi: '/legal?jenis=kebijakan-privasi',
    });
    expect(Pesan.tandaiDibaca).toHaveBeenCalledWith(ID_PERCAKAPAN, ID_PEMBELI);
  });

  test('barang sudah dihapus menghasilkan barang null', async () => {
    jest.spyOn(Pesan, 'getDaftarPesan').mockResolvedValue([]);
    Barang.cariById.mockResolvedValue(null);

    const hasil = await PercakapanController.bukaPercakapan(ID_PENJUAL, ID_PERCAKAPAN);

    expect(hasil.data.barang).toBeNull();
  });
});

describe('PercakapanController.kirimPesan (UC17, KF32, KF34, KF36)', () => {
  const WAKTU = new Date('2026-11-09T11:00:00Z');

  beforeEach(() => {
    jest.spyOn(Percakapan, 'cariById').mockResolvedValue(percakapanContoh());
    jest
      .spyOn(Percakapan.prototype, 'addPesan')
      .mockImplementation(async (idPengirim, isiPesanTerenkripsi) =>
        new Pesan({ idPesan: 'p-baru', idPengirim, isiPesanTerenkripsi, waktuKirim: WAKTU, statusBaca: false }),
      );
    jest.spyOn(Percakapan.prototype, 'perbaruiWaktuTerakhir').mockResolvedValue();
    jest.spyOn(Percakapan.prototype, 'getLawanBicara').mockResolvedValue({ idAkun: ID_PEMBELI, nama: 'Ani' });
    jest.spyOn(NotifikasiController, 'kirimNotifikasi').mockResolvedValue({});
  });

  test.each([[''], ['   \n '], [undefined], [123]])('isi kosong atau bukan teks (%p) ditolak 400', async (isi) => {
    const hasil = await PercakapanController.kirimPesan(ID_PEMBELI, ID_PERCAKAPAN, isi);

    expect(hasil).toMatchObject({ berhasil: false, status: 400 });
    expect(Percakapan.prototype.addPesan).not.toHaveBeenCalled();
  });

  test('isi lebih dari 2000 karakter ditolak 400, tepat 2000 diterima', async () => {
    expect(await PercakapanController.kirimPesan(ID_PEMBELI, ID_PERCAKAPAN, 'a'.repeat(2001))).toMatchObject({
      status: 400,
    });
    expect(await PercakapanController.kirimPesan(ID_PEMBELI, ID_PERCAKAPAN, 'a'.repeat(2000))).toMatchObject({
      status: 201,
    });
  });

  test('non-peserta ditolak 403 dan tidak ada pesan tersimpan', async () => {
    const hasil = await PercakapanController.kirimPesan(ID_ADMIN, ID_PERCAKAPAN, 'Halo');

    expect(hasil).toMatchObject({ berhasil: false, status: 403 });
    expect(Percakapan.prototype.addPesan).not.toHaveBeenCalled();
    expect(NotifikasiController.kirimNotifikasi).not.toHaveBeenCalled();
  });

  test('isi tersimpan terenkripsi, waktu diperbarui, dan respons berisi teks murni', async () => {
    const hasil = await PercakapanController.kirimPesan(ID_PEMBELI, ID_PERCAKAPAN, '  Jas labnya masih ada?  ');

    const [idPengirim, isiTersimpan] = Percakapan.prototype.addPesan.mock.calls[0];
    expect(idPengirim).toBe(ID_PEMBELI);
    expect(isiTersimpan).not.toContain('Jas labnya');
    expect(Kriptografi.dekripsi(isiTersimpan)).toBe('Jas labnya masih ada?');
    expect(Percakapan.prototype.perbaruiWaktuTerakhir).toHaveBeenCalledWith(WAKTU);
    expect(hasil).toEqual({
      berhasil: true,
      status: 201,
      data: { idPesan: 'p-baru', idPengirim: ID_PEMBELI, isi: 'Jas labnya masih ada?', waktuKirim: WAKTU, dariSaya: true },
    });
  });

  test('penerima (lawan bicara) diberi notifikasi berisi nama pengirim tanpa isi pesan (KF36)', async () => {
    await PercakapanController.kirimPesan(ID_PEMBELI, ID_PERCAKAPAN, 'Nomor WA saya 0812xxxx');

    expect(Percakapan.prototype.getLawanBicara).toHaveBeenCalledWith(ID_PENJUAL);
    expect(NotifikasiController.kirimNotifikasi).toHaveBeenCalledWith(ID_PENJUAL, 'pesan', 'Pesan baru dari Ani');
  });

  test('kegagalan notifikasi tidak menggagalkan kirim pesan', async () => {
    NotifikasiController.kirimNotifikasi.mockRejectedValue(new Error('db notifikasi mati'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const hasil = await PercakapanController.kirimPesan(ID_PENJUAL, ID_PERCAKAPAN, 'Masih, kak');

    expect(hasil).toMatchObject({ berhasil: true, status: 201 });
    expect(NotifikasiController.kirimNotifikasi.mock.calls[0][0]).toBe(ID_PEMBELI);
    expect(console.error).toHaveBeenCalled();
  });
});
