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

describe('PercakapanController.mulaiPercakapan (C18, UC16, KF31)', () => {
  beforeEach(() => {
    jest.spyOn(Barang, 'cariById').mockResolvedValue(barangContoh());
    jest.spyOn(Akun, 'getStatusBlokir').mockResolvedValue(false);
  });

  test('C18-UT01 [Negatif] mulaiPercakapan: penjual diblokir ditolak 403 tanpa membuat percakapan', async () => {
    Akun.getStatusBlokir.mockResolvedValue(true);
    const simpan = jest.spyOn(Percakapan, 'simpan');

    const hasil = await PercakapanController.mulaiPercakapan(ID_PEMBELI, ID_BARANG);

    expect(hasil).toMatchObject({ berhasil: false, status: 403 });
    expect(simpan).not.toHaveBeenCalled();
  });

  test('C18-UT02 [Negatif] mulaiPercakapan: menghubungi listing sendiri ditolak 400', async () => {
    const simpan = jest.spyOn(Percakapan, 'simpan');

    const hasil = await PercakapanController.mulaiPercakapan(ID_PENJUAL, ID_BARANG);

    expect(hasil).toMatchObject({ berhasil: false, status: 400 });
    expect(simpan).not.toHaveBeenCalled();
  });

  test('C18-UT03 [Negatif] mulaiPercakapan: barang tidak ada atau id tidak valid ditolak 404', async () => {
    Barang.cariById.mockResolvedValue(null);
    expect(await PercakapanController.mulaiPercakapan(ID_PEMBELI, ID_BARANG)).toMatchObject({ status: 404 });
    expect(await PercakapanController.mulaiPercakapan(ID_PEMBELI, 'bukan-uuid')).toMatchObject({ status: 404 });
    expect(await PercakapanController.mulaiPercakapan(ID_PEMBELI, undefined)).toMatchObject({ status: 404 });
  });

  test('C18-UT04 [Normal] mulaiPercakapan: kombinasi lama dipakai ulang (200) tanpa membuat percakapan baru', async () => {
    jest.spyOn(Percakapan, 'cariByKombinasi').mockResolvedValue(percakapanContoh());
    const simpan = jest.spyOn(Percakapan, 'simpan');

    const hasil = await PercakapanController.mulaiPercakapan(ID_PEMBELI, ID_BARANG);

    expect(Percakapan.cariByKombinasi).toHaveBeenCalledWith(ID_BARANG, ID_PEMBELI, ID_PENJUAL);
    expect(hasil).toEqual({ berhasil: true, status: 200, data: { idPercakapan: ID_PERCAKAPAN } });
    expect(simpan).not.toHaveBeenCalled();
  });

  test('C18-UT05 [Normal] mulaiPercakapan: kombinasi baru membuat percakapan (201)', async () => {
    jest.spyOn(Percakapan, 'cariByKombinasi').mockResolvedValue(null);
    jest.spyOn(Percakapan, 'simpan').mockResolvedValue(percakapanContoh());

    const hasil = await PercakapanController.mulaiPercakapan(ID_PEMBELI, ID_BARANG);

    expect(Percakapan.simpan).toHaveBeenCalledWith(ID_BARANG, ID_PEMBELI, ID_PENJUAL);
    expect(hasil).toEqual({ berhasil: true, status: 201, data: { idPercakapan: ID_PERCAKAPAN } });
  });
});

describe('PercakapanController.bukaPercakapan (C18, UC16, KF35, KF36)', () => {
  beforeEach(() => {
    jest.spyOn(Percakapan, 'cariById').mockResolvedValue(percakapanContoh());
    jest.spyOn(Percakapan.prototype, 'getLawanBicara').mockResolvedValue({ idAkun: ID_PENJUAL, nama: 'Budi' });
    jest.spyOn(Barang, 'cariById').mockResolvedValue(barangContoh());
    jest.spyOn(FotoBarang, 'getGaleri').mockResolvedValue([{ pathBerkas: '/uploads/jas.jpg' }]);
    jest.spyOn(Pesan, 'tandaiDibaca').mockResolvedValue(1);
  });

  test('C18-UT06 [Negatif] bukaPercakapan: non-peserta (termasuk admin) ditolak 403 tanpa membaca pesan', async () => {
    const getDaftarPesan = jest.spyOn(Pesan, 'getDaftarPesan');

    const hasil = await PercakapanController.bukaPercakapan(ID_ADMIN, ID_PERCAKAPAN);

    expect(hasil).toMatchObject({ berhasil: false, status: 403 });
    expect(getDaftarPesan).not.toHaveBeenCalled();
    expect(Pesan.tandaiDibaca).not.toHaveBeenCalled();
  });

  test('C18-UT07 [Negatif] bukaPercakapan: percakapan tidak ada atau id bukan UUID ditolak 404', async () => {
    Percakapan.cariById.mockResolvedValue(null);
    expect(await PercakapanController.bukaPercakapan(ID_PEMBELI, ID_PERCAKAPAN)).toMatchObject({ status: 404 });
    expect(await PercakapanController.bukaPercakapan(ID_PEMBELI, 'abc')).toMatchObject({ status: 404 });
    expect(await PercakapanController.bukaPercakapan(ID_PEMBELI, null)).toMatchObject({ status: 404 });
  });

  test('C18-UT08 [Normal] bukaPercakapan: peserta menerima pesan terdekripsi, pesan rusak diganti, dan pesan lawan ditandai dibaca', async () => {
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

  test('C18-UT09 [Batas] bukaPercakapan dan ambilRingkasanBarang: barang dihapus atau idBarang null menghasilkan barang null, tanpa foto menghasilkan fotoUtama null', async () => {
    jest.spyOn(Pesan, 'getDaftarPesan').mockResolvedValue([]);
    Barang.cariById.mockResolvedValue(null);

    const hasil = await PercakapanController.bukaPercakapan(ID_PENJUAL, ID_PERCAKAPAN);
    expect(hasil.data.barang).toBeNull();
    expect(await PercakapanController.ambilRingkasanBarang(null)).toBeNull();

    Barang.cariById.mockResolvedValue(barangContoh());
    FotoBarang.getGaleri.mockResolvedValue([]);
    const ringkasan = await PercakapanController.ambilRingkasanBarang(ID_BARANG);
    expect(ringkasan.fotoUtama).toBeNull();
  });
});

describe('PercakapanController.kirimPesan (C18, UC17, KF32, KF34, KF36)', () => {
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

  test.each([[''], ['   \n '], [undefined], [123]])(
    'C18-UT10 [Negatif] kirimPesan: isi kosong atau bukan teks (%p) ditolak 400',
    async (isi) => {
      const hasil = await PercakapanController.kirimPesan(ID_PEMBELI, ID_PERCAKAPAN, isi);

      expect(hasil).toMatchObject({ berhasil: false, status: 400 });
      expect(Percakapan.prototype.addPesan).not.toHaveBeenCalled();
    },
  );

  test('C18-UT11 [Batas] kirimPesan: isi lebih dari 2000 karakter ditolak 400, tepat 2000 diterima', async () => {
    expect(await PercakapanController.kirimPesan(ID_PEMBELI, ID_PERCAKAPAN, 'a'.repeat(2001))).toMatchObject({
      status: 400,
    });
    expect(await PercakapanController.kirimPesan(ID_PEMBELI, ID_PERCAKAPAN, 'a'.repeat(2000))).toMatchObject({
      status: 201,
    });
  });

  test('C18-UT12 [Negatif] kirimPesan: percakapan tidak ditemukan atau id bukan UUID ditolak 404', async () => {
    Percakapan.cariById.mockResolvedValue(null);
    expect(await PercakapanController.kirimPesan(ID_PEMBELI, ID_PERCAKAPAN, 'Halo')).toMatchObject({ status: 404 });
    expect(await PercakapanController.kirimPesan(ID_PEMBELI, 'bukan-uuid', 'Halo')).toMatchObject({ status: 404 });
    expect(await PercakapanController.kirimPesan(ID_PEMBELI, undefined, 'Halo')).toMatchObject({ status: 404 });
  });

  test('C18-UT13 [Negatif] kirimPesan: non-peserta ditolak 403 dan tidak ada pesan tersimpan', async () => {
    const hasil = await PercakapanController.kirimPesan(ID_ADMIN, ID_PERCAKAPAN, 'Halo');

    expect(hasil).toMatchObject({ berhasil: false, status: 403 });
    expect(Percakapan.prototype.addPesan).not.toHaveBeenCalled();
    expect(NotifikasiController.kirimNotifikasi).not.toHaveBeenCalled();
  });

  test('C18-UT14 [Normal] kirimPesan: isi tersimpan terenkripsi, waktu diperbarui, dan respons berisi teks murni', async () => {
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

  test('C18-UT15 [Normal] kirimPesan: penerima (lawan bicara) diberi notifikasi berisi nama pengirim tanpa isi pesan (KF36)', async () => {
    await PercakapanController.kirimPesan(ID_PEMBELI, ID_PERCAKAPAN, 'Nomor WA saya 0812xxxx');

    expect(Percakapan.prototype.getLawanBicara).toHaveBeenCalledWith(ID_PENJUAL);
    expect(NotifikasiController.kirimNotifikasi).toHaveBeenCalledWith(ID_PENJUAL, 'pesan', 'Pesan baru dari Ani');
  });

  test('C18-UT16 [Batas] kirimPesan dan beritahuPenerima: kegagalan notifikasi tidak menggagalkan kirim pesan, dan nama cadangan dipakai bila pengirim null', async () => {
    NotifikasiController.kirimNotifikasi.mockRejectedValueOnce(new Error('db notifikasi mati'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const hasil = await PercakapanController.kirimPesan(ID_PENJUAL, ID_PERCAKAPAN, 'Masih, kak');
    expect(hasil).toMatchObject({ berhasil: true, status: 201 });
    expect(NotifikasiController.kirimNotifikasi.mock.calls[0][0]).toBe(ID_PEMBELI);
    expect(console.error).toHaveBeenCalled();

    Percakapan.prototype.getLawanBicara.mockResolvedValueOnce(null);
    Percakapan.prototype.addPesan.mockResolvedValueOnce(
      new Pesan({ idPesan: 'p-2', idPengirim: ID_PEMBELI, isiPesanTerenkripsi: 'x', waktuKirim: null, statusBaca: false }),
    );
    await PercakapanController.kirimPesan(ID_PEMBELI, ID_PERCAKAPAN, 'Halo');
    expect(NotifikasiController.kirimNotifikasi).toHaveBeenLastCalledWith(
      ID_PENJUAL,
      'pesan',
      'Pesan baru dari Pengguna ITBELI',
    );
  });
});

describe('PercakapanController.getDaftarPercakapan dan cuplikan (C18, UC18, KF33, KF34)', () => {
  const WAKTU_PESAN = new Date('2026-11-09T09:30:00Z');

  test('C18-UT17 [Normal] getDaftarPercakapan: daftar memuat lawan bicara, judul barang, cuplikan terdekripsi, dan hitung belum dibaca', async () => {
    const tanpaPesan = new Percakapan({
      idPercakapan: '66666666-6666-4666-8666-666666666666',
      idPembeli: ID_PEMBELI,
      idPenjual: ID_PENJUAL,
      idBarang: null,
      waktuPembaruanTerakhir: new Date('2026-11-08T10:00:00Z'),
    });
    jest.spyOn(Percakapan, 'getDaftarPercakapanByPengguna').mockResolvedValue([percakapanContoh(), tanpaPesan]);
    jest.spyOn(Percakapan.prototype, 'getLawanBicara').mockResolvedValue({ idAkun: ID_PEMBELI, nama: 'Ani' });
    jest.spyOn(Barang, 'cariById').mockResolvedValue(barangContoh());
    jest
      .spyOn(Pesan, 'getCuplikanPesanTerakhir')
      .mockImplementation(async (idPercakapan) =>
        idPercakapan === ID_PERCAKAPAN
          ? new Pesan({ idPengirim: ID_PEMBELI, isiPesanTerenkripsi: Kriptografi.enkripsi('Bisa COD?'), waktuKirim: WAKTU_PESAN })
          : null,
      );
    jest
      .spyOn(Pesan, 'hitungPesanBelumDibaca')
      .mockImplementation(async (idPercakapan) => (idPercakapan === ID_PERCAKAPAN ? 3 : 0));

    const hasil = await PercakapanController.getDaftarPercakapan(ID_PENJUAL);

    expect(Percakapan.getDaftarPercakapanByPengguna).toHaveBeenCalledWith(ID_PENJUAL);
    expect(Pesan.hitungPesanBelumDibaca).toHaveBeenCalledWith(ID_PERCAKAPAN, ID_PENJUAL);
    expect(hasil).toEqual({
      berhasil: true,
      status: 200,
      data: [
        {
          idPercakapan: ID_PERCAKAPAN,
          idBarang: ID_BARANG,
          judulBarang: 'Jas Lab',
          lawanBicara: { idAkun: ID_PEMBELI, nama: 'Ani' },
          cuplikan: { isi: 'Bisa COD?', waktuKirim: WAKTU_PESAN, dariSaya: false },
          belumDibaca: 3,
          waktuPembaruanTerakhir: new Date('2026-11-09T10:00:00Z'),
        },
        expect.objectContaining({ idBarang: null, judulBarang: null, cuplikan: null, belumDibaca: 0 }),
      ],
    });
  });

  test('C18-UT18 [Negatif] ambilCuplikanPesanTerakhir: cuplikan yang gagal didekripsi tampil sebagai teks pengganti', async () => {
    jest.spyOn(Pesan, 'getCuplikanPesanTerakhir').mockResolvedValue(
      new Pesan({ idPengirim: ID_PENJUAL, isiPesanTerenkripsi: 'rusak', waktuKirim: WAKTU_PESAN }),
    );

    const cuplikan = await PercakapanController.ambilCuplikanPesanTerakhir(ID_PERCAKAPAN, ID_PENJUAL);

    expect(cuplikan).toEqual({ isi: '[Pesan tidak dapat dibuka]', waktuKirim: WAKTU_PESAN, dariSaya: true });
  });

  test('C18-UT19 [Batas] getDaftarPercakapan: pengguna tanpa percakapan mendapat daftar kosong', async () => {
    jest.spyOn(Percakapan, 'getDaftarPercakapanByPengguna').mockResolvedValue([]);
    expect(await PercakapanController.getDaftarPercakapan(ID_ADMIN)).toEqual({ berhasil: true, status: 200, data: [] });
  });

  test('C18-UT20 [Batas] potongCuplikan: tepat 80 karakter utuh, 81 karakter dipotong menjadi 79 karakter dan elipsis', () => {
    const tepat80 = 'a'.repeat(80);
    const lebih81 = 'b'.repeat(81);
    expect(PercakapanController.potongCuplikan(tepat80)).toBe(tepat80);
    expect(PercakapanController.potongCuplikan(lebih81)).toBe(`${'b'.repeat(79)}…`);
  });

  test('C18-UT21 [Batas] getDaftarPercakapan: listing yang dihapus menghasilkan judulBarang null', async () => {
    jest.spyOn(Percakapan, 'getDaftarPercakapanByPengguna').mockResolvedValue([percakapanContoh()]);
    jest.spyOn(Percakapan.prototype, 'getLawanBicara').mockResolvedValue({ idAkun: ID_PENJUAL, nama: 'Budi' });
    jest.spyOn(Barang, 'cariById').mockResolvedValue(null);
    jest.spyOn(Pesan, 'getCuplikanPesanTerakhir').mockResolvedValue(null);
    jest.spyOn(Pesan, 'hitungPesanBelumDibaca').mockResolvedValue(0);

    const hasil = await PercakapanController.getDaftarPercakapan(ID_PEMBELI);
    expect(hasil.data[0].judulBarang).toBeNull();
  });
});
