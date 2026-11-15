// Uji unit C39 LogAdmin (KF55): catatan tindakan moderasi admin yang hanya bertambah.
const LogAdmin = require('../../models/LogAdmin');
const db = require('../../config/db');

describe('LogAdmin (C39)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('C39-UT01 [Normal] catatTindakan: tindakan BLOKIR_AKUN beserta alasan → INSERT ke log_admin dengan seluruh nilai', async () => {
    const kueri = jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1 });

    await LogAdmin.catatTindakan('admin-1', 'BLOKIR_AKUN', 'akun-7', 'Penipuan berulang');

    const [teks, nilai] = kueri.mock.calls[0];
    expect(teks).toMatch(/INSERT INTO log_admin/);
    expect(nilai[0]).toMatch(/^[0-9a-f-]{36}$/);
    expect(nilai.slice(1, 4)).toEqual(['admin-1', 'BLOKIR_AKUN', 'akun-7']);
    expect(nilai[4]).toBeInstanceOf(Date);
    expect(nilai[5]).toBe('Penipuan berulang');
  });

  test('C39-UT02 [Normal] catatTindakan di dalam transaksi → memakai klien transaksi, bukan koneksi bawaan', async () => {
    const kueriBawaan = jest.spyOn(db, 'query');
    const klien = { query: jest.fn().mockResolvedValue({ rowCount: 1 }) };

    await LogAdmin.catatTindakan('admin-1', 'HAPUS_LISTING', 'brg-3', 'Barang palsu', klien);

    expect(klien.query).toHaveBeenCalledTimes(1);
    expect(kueriBawaan).not.toHaveBeenCalled();
  });

  test('C39-UT03 [Negatif] catatTindakan: basis data menolak INSERT → galat diteruskan ke pemanggil agar transaksi dibatalkan', async () => {
    const klien = { query: jest.fn().mockRejectedValue(new Error('koneksi putus')) };
    await expect(LogAdmin.catatTindakan('admin-1', 'BUKA_BLOKIR', 'akun-7', 'Banding diterima', klien)).rejects.toThrow('koneksi putus');
  });

  test('C39-UT04 [Normal] getAllLog: dua baris → dua objek LogAdmin, terbaru lebih dulu', async () => {
    const kueri = jest.spyOn(db, 'query').mockResolvedValue({
      rows: [
        { id_log_admin: 'la-2', id_admin: 'admin-1', jenis_tindakan: 'BUKA_BLOKIR', objek_ditindak: 'akun-7', waktu: new Date(), alasan: 'Banding diterima' },
        { id_log_admin: 'la-1', id_admin: 'admin-1', jenis_tindakan: 'BLOKIR_AKUN', objek_ditindak: 'akun-7', waktu: new Date(), alasan: 'Penipuan' },
      ],
    });

    const hasil = await LogAdmin.getAllLog();

    expect(hasil.map((l) => l.jenisTindakan)).toEqual(['BUKA_BLOKIR', 'BLOKIR_AKUN']);
    expect(hasil[0]).toBeInstanceOf(LogAdmin);
    expect(kueri.mock.calls[0][0]).toMatch(/ORDER BY waktu DESC/);
  });

  test('C39-UT05 [Batas] dariBaris: baris kosong (undefined) → null', () => {
    expect(LogAdmin.dariBaris(undefined)).toBeNull();
  });

  test('C39-UT06 [Negatif] tidak ada operasi untuk mengubah atau menghapus catatan (KF55)', () => {
    ['update', 'ubah', 'hapus', 'delete'].forEach((nama) => {
      expect(LogAdmin[nama]).toBeUndefined();
      expect(LogAdmin.prototype[nama]).toBeUndefined();
    });
  });
});
