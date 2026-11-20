const { siapkanDbUnit } = require('./helpers/dbUnit');

let U;
let Laporan;
let LiveChat;
let idSisi;
let idTono;
let idBudi;
let idCitra;
let idAdmin;

beforeAll(() => {
  U = siapkanDbUnit();
  Laporan = require('../../models/Laporan');
  LiveChat = require('../../models/LiveChat');
  idSisi = U.db.prepare("SELECT idMasyarakat FROM Masyarakat WHERE username = 'sisi'").get().idMasyarakat;
  idTono = U.db.prepare("SELECT idMasyarakat FROM Masyarakat WHERE username = 'tono'").get().idMasyarakat;
  idBudi = U.db.prepare("SELECT idMitra FROM MitraPengacara WHERE username = 'budi'").get().idMitra;
  idCitra = U.db.prepare("SELECT idMitra FROM MitraPengacara WHERE username = 'citra'").get().idMitra;
  idAdmin = U.db.prepare("SELECT idAdmin FROM Admin WHERE email = 'admin@lawhub.test'").get().idAdmin;
});

afterAll(() => {
  U.bersihkan();
});

describe('C48 Laporan (Mendalam)', () => {
  let idLaporanUji;

  test('C48-UT01 Normal: buatLaporan menyimpan laporan pelanggaran berstatus menunggu', () => {
    const res = Laporan.buatLaporan({
      idPelapor: idSisi,
      peranPelapor: 'masyarakat',
      idTerlapor: idBudi,
      peranTerlapor: 'mitra',
      jenisPelanggaran: 'Bahasa kasar',
      deskripsi: 'Menggunakan kata tidak pantas saat konsultasi.',
    });
    idLaporanUji = res.lastInsertRowid;
    expect(Laporan.getDetailLaporan(idLaporanUji).statusLaporan).toBe('menunggu');
  });

  test('C48-UT02 Normal: prosesBlokirAkun menyetujui laporan dan memblokir akun terlapor', () => {
    Laporan.prosesBlokirAkun(idLaporanUji, 'Terbukti melanggar ketentuan.');
    const lap = U.db.prepare('SELECT * FROM Laporan WHERE idLaporan = ?').get(idLaporanUji);
    const mitra = U.db.prepare('SELECT statusAkun FROM MitraPengacara WHERE idMitra = ?').get(idBudi);

    expect(lap.statusLaporan).toBe('disetujui');
    expect(lap.catatanAdmin).toBe('Terbukti melanggar ketentuan.');
    expect(mitra.statusAkun).toBe('diblokir');
  });

  test('C48-UT03 Negatif: prosesBlokirAkun pada laporan yang sudah ditinjau melempar LAPORAN_SUDAH_DITINJAU', () => {
    expect(() => Laporan.prosesBlokirAkun(idLaporanUji, 'Ulang')).toThrow('LAPORAN_SUDAH_DITINJAU');
  });

  test('C48-UT04 Normal: tolakLaporan mengubah status menjadi ditolak dan akun terlapor tetap aktif', () => {
    const res = Laporan.buatLaporan({
      idPelapor: idSisi,
      peranPelapor: 'masyarakat',
      idTerlapor: idCitra,
      peranTerlapor: 'mitra',
      jenisPelanggaran: 'Spam',
      deskripsi: 'Promosi berulang.',
    });
    Laporan.tolakLaporan(res.lastInsertRowid, 'Bukti kurang.');

    expect(U.db.prepare('SELECT statusLaporan FROM Laporan WHERE idLaporan = ?').get(res.lastInsertRowid).statusLaporan)
      .toBe('ditolak');
    expect(U.db.prepare('SELECT statusAkun FROM MitraPengacara WHERE idMitra = ?').get(idCitra).statusAkun)
      .toBe('aktif');
  });

  test('C48-UT05 Negatif: prosesBlokirAkun dengan ID tidak terdaftar melempar LAPORAN_TIDAK_DITEMUKAN', () => {
    expect(() => Laporan.prosesBlokirAkun(999999, '')).toThrow('LAPORAN_TIDAK_DITEMUKAN');
  });
});

describe('C50 LiveChat (Mendalam)', () => {
  let idChatUji;

  test('C50-UT01 Normal: buatSesiChat membuat sesi menunggu saat ada admin standby', () => {
    U.db.prepare('UPDATE Admin SET statusStandby = 1 WHERE idAdmin = ?').run(idAdmin);
    const hasil = LiveChat.buatSesiChat(idSisi);
    idChatUji = hasil.idChat || hasil.lastInsertRowid || hasil;

    expect(U.db.prepare('SELECT statusChat FROM LiveChat WHERE idChat = ?').get(idChatUji).statusChat)
      .toBe('menunggu');
  });

  test('C50-UT02 Normal: klaimChatOlehAdmin menetapkan idAdmin dan mengubah status menjadi berlangsung', () => {
    LiveChat.klaimChatOlehAdmin(idChatUji, idAdmin);
    const chat = U.db.prepare('SELECT * FROM LiveChat WHERE idChat = ?').get(idChatUji);
    expect(chat.idAdmin).toBe(idAdmin);
    expect(chat.statusChat).toBe('berlangsung');
  });

  test('C50-UT03 Batas: klaimChatOlehAdmin kedua pada sesi yang sudah diklaim tidak menimpa idAdmin awal', () => {
    LiveChat.klaimChatOlehAdmin(idChatUji, idAdmin + 99);
    const chat = U.db.prepare('SELECT * FROM LiveChat WHERE idChat = ?').get(idChatUji);
    expect(chat.idAdmin).toBe(idAdmin);
  });

  test('C50-UT04 Negatif: buatSesiChat ditolak saat tidak ada admin standby', () => {
    U.db.prepare('UPDATE Admin SET statusStandby = 0').run();
    expect(() => LiveChat.buatSesiChat(idTono)).toThrow();
  });
});
