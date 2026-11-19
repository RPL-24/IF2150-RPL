import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationController } from '../controllers/NotificationController';
import { Notifikasi } from '../models/Notifikasi';
import { PESAN_INPUT_TIDAK_VALID } from '../models/pesan';

// Unit test kelas C19 NotificationController. Supabase dan
// PushNotificationUI diganti mock sehingga tidak ada akses jaringan.

type Hasil = { data?: unknown; error: { message: string } | null };

type QueryPalsu = {
  tabel: string;
  select: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  in: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  then: (ok: (v: Hasil) => unknown, gagal?: (e: unknown) => unknown) => Promise<unknown>;
};

const { from } = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock('../services/supabase', () => ({ supabase: { from } }));
// Modul asli memuat expo-notifications yang hanya berjalan di perangkat.
vi.mock('../services/PushNotificationUI', () => ({
  PushNotificationUI: class {},
  pushNotificationUI: {},
}));

// Setiap pemanggilan supabase.from() mengambil hasil berikutnya dari antrean.
let antrean: Hasil[] = [];
let query: QueryPalsu[] = [];

function buatQuery(tabel: string, hasil: Hasil): QueryPalsu {
  const q = { tabel } as QueryPalsu;
  for (const m of ['select', 'update', 'insert', 'eq', 'in', 'order'] as const) {
    q[m] = vi.fn(() => q);
  }
  q.single = vi.fn(() => Promise.resolve(hasil));
  q.then = (ok, gagal) => Promise.resolve(hasil).then(ok, gagal);
  return q;
}

function siapkan(...hasil: Hasil[]) {
  antrean = [...hasil];
}

const ok = (data?: unknown): Hasil => ({ data, error: null });
const gagal = (pesan: string): Hasil => ({ data: null, error: { message: pesan } });

const tampilkanNotifikasi = vi.fn();
const pushPalsu = { tampilkanNotifikasi } as never;

function controller() {
  return new NotificationController(pushPalsu);
}

// Data contoh: Nasi Goreng (harga jual 15.000) memakai 2 bahan.
// Bahan b1 (telur) takaran 2, bahan b2 (beras) takaran 1 dengan harga 5.000.
const produkNasiGoreng = {
  id_produk: 'p1',
  nama_produk: 'Nasi Goreng',
  harga_jual: 15000,
  tbl_resep_bahan: [
    { id_bahan: 'b1', takaran: 2, tbl_bahan_baku: { harga_beli: 2000 } },
    { id_bahan: 'b2', takaran: '1', tbl_bahan_baku: [{ harga_beli: '5000' }] },
  ],
};

// Hasil query berurutan untuk perbaruiHargaBeli('b1', hargaBaru) sampai
// tahap pembaruan margin produk.
function alurSampaiMargin(hargaLama: number) {
  return [
    ok({ nama_bahan: 'Telur', harga_beli: hargaLama }), // ambil bahan
    ok(), // update harga bahan
    ok(), // insert riwayat harga
    ok([{ id_produk: 'p1' }]), // produk pemakai bahan
    ok([produkNasiGoreng]), // detail produk + resep
    ok(), // update margin produk p1
  ];
}

const notifTersimpan = (id: string) =>
  ok({ id_notifikasi: id, waktu_kirim: '2026-11-19T06:00:00.000Z' });

beforeEach(() => {
  antrean = [];
  query = [];
  from.mockReset();
  from.mockImplementation((tabel: string) => {
    const hasil = antrean.shift();
    if (hasil === undefined) throw new Error(`Query tak terduga ke ${tabel}`);
    const q = buatQuery(tabel, hasil);
    query.push(q);
    return q;
  });
  tampilkanNotifikasi.mockReset();
  tampilkanNotifikasi.mockResolvedValue(undefined);
});

describe('C19 NotificationController.perbaruiHargaBeli()', () => {
  it('C19-UT01 normal: harga naik, margin tetap positif, hanya notifikasi perubahan harga', async () => {
    // HPP baru = 2 x 3000 + 5000 = 11000, margin = 4000.
    siapkan(...alurSampaiMargin(2000), notifTersimpan('n1'));

    await controller().perbaruiHargaBeli('b1', 3000);

    expect(query.map((q) => q.tabel)).toEqual([
      'tbl_bahan_baku',
      'tbl_bahan_baku',
      'tbl_riwayat_harga_bahan',
      'tbl_resep_bahan',
      'tbl_produk',
      'tbl_produk',
      'tbl_notifikasi',
    ]);
    expect(query[1].update).toHaveBeenCalledWith({ harga_beli: 3000 });
    expect(query[2].insert).toHaveBeenCalledWith({
      id_bahan: 'b1',
      harga_beli_lama: 2000,
      harga_beli_baru: 3000,
    });
    expect(query[5].update).toHaveBeenCalledWith({ margin: 4000, status_peringatan: false });
    expect(query[6].insert).toHaveBeenCalledWith(
      expect.objectContaining({ tipe: 'harga_bahan', id_bahan: 'b1', id_produk: null }),
    );
    expect(tampilkanNotifikasi).toHaveBeenCalledTimes(1);
    expect(tampilkanNotifikasi).toHaveBeenCalledWith(expect.any(String), expect.any(String), {
      tipe: 'harga_bahan',
    });
  });

  it('C19-UT02 normal: harga naik hingga margin negatif, notifikasi kerugian dan perubahan harga dikirim', async () => {
    // HPP baru = 2 x 6000 + 5000 = 17000, margin = -2000.
    siapkan(...alurSampaiMargin(2000), notifTersimpan('n1'), notifTersimpan('n2'));

    await controller().perbaruiHargaBeli('b1', 6000);

    expect(query[5].update).toHaveBeenCalledWith({ margin: -2000, status_peringatan: true });
    expect(query[6].insert).toHaveBeenCalledWith(
      expect.objectContaining({ tipe: 'kerugian', judul: 'Margin Negatif!', id_produk: 'p1' }),
    );
    expect(query[7].insert).toHaveBeenCalledWith(
      expect.objectContaining({ tipe: 'harga_bahan', id_bahan: 'b1' }),
    );
    expect(tampilkanNotifikasi).toHaveBeenNthCalledWith(1, 'Margin Negatif!', expect.any(String), {
      tipe: 'kerugian',
      idProduk: 'p1',
    });
    expect(tampilkanNotifikasi).toHaveBeenNthCalledWith(2, expect.any(String), expect.any(String), {
      tipe: 'harga_bahan',
    });
  });

  it('C19-UT03 batas: margin tepat 0 tidak dianggap kerugian', async () => {
    // HPP baru = 2 x 5000 + 5000 = 15000, margin = 0.
    siapkan(...alurSampaiMargin(2000), notifTersimpan('n1'));

    await controller().perbaruiHargaBeli('b1', 5000);

    expect(query[5].update).toHaveBeenCalledWith({ margin: 0, status_peringatan: false });
    expect(query[6].insert).toHaveBeenCalledWith(expect.objectContaining({ tipe: 'harga_bahan' }));
    expect(tampilkanNotifikasi).toHaveBeenCalledTimes(1);
  });

  it('C19-UT04 batas: harga baru sama dengan harga lama tidak mengubah apa pun', async () => {
    siapkan(ok({ nama_bahan: 'Telur', harga_beli: '2000' }));

    await controller().perbaruiHargaBeli('b1', 2000);

    expect(query).toHaveLength(1);
    expect(tampilkanNotifikasi).not.toHaveBeenCalled();
  });

  it('C19-UT05 batas: bahan tidak dipakai produk mana pun, hanya notifikasi perubahan harga', async () => {
    siapkan(
      ok({ nama_bahan: 'Telur', harga_beli: 2000 }),
      ok(),
      ok(),
      ok(null), // tidak ada resep yang memakai bahan
      notifTersimpan('n1'),
    );

    await controller().perbaruiHargaBeli('b1', 1500);

    expect(query.map((q) => q.tabel)).toEqual([
      'tbl_bahan_baku',
      'tbl_bahan_baku',
      'tbl_riwayat_harga_bahan',
      'tbl_resep_bahan',
      'tbl_notifikasi',
    ]);
    expect(tampilkanNotifikasi).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['nol', 0],
    ['negatif', -1000],
    ['bukan angka', Number.NaN],
  ])('C19-UT06 negatif: harga %s ditolak sebelum mengakses basis data', async (_label, harga) => {
    await expect(controller().perbaruiHargaBeli('b1', harga)).rejects.toThrow(
      PESAN_INPUT_TIDAK_VALID,
    );
    expect(from).not.toHaveBeenCalled();
  });

  it('C19-UT07 negatif: bahan baku tidak ditemukan', async () => {
    siapkan(gagal('Bahan tidak ditemukan'));

    await expect(controller().perbaruiHargaBeli('b9', 3000)).rejects.toThrow(
      'Bahan tidak ditemukan',
    );
    expect(tampilkanNotifikasi).not.toHaveBeenCalled();
  });

  it('C19-UT08 negatif: gagal menyimpan harga baru', async () => {
    siapkan(ok({ nama_bahan: 'Telur', harga_beli: 2000 }), gagal('Update ditolak'));

    await expect(controller().perbaruiHargaBeli('b1', 3000)).rejects.toThrow('Update ditolak');
    expect(query).toHaveLength(2);
  });

  it('C19-UT09 negatif: gagal menyimpan riwayat harga', async () => {
    siapkan(ok({ nama_bahan: 'Telur', harga_beli: 2000 }), ok(), gagal('Riwayat gagal'));

    await expect(controller().perbaruiHargaBeli('b1', 3000)).rejects.toThrow('Riwayat gagal');
  });

  it('C19-UT10 negatif: gagal memuat produk pemakai bahan', async () => {
    siapkan(
      ok({ nama_bahan: 'Telur', harga_beli: 2000 }),
      ok(),
      ok(),
      gagal('Resep gagal dimuat'),
    );

    await expect(controller().perbaruiHargaBeli('b1', 3000)).rejects.toThrow(
      'Resep gagal dimuat',
    );
  });

  it('C19-UT11 negatif: gagal memuat detail produk', async () => {
    siapkan(
      ok({ nama_bahan: 'Telur', harga_beli: 2000 }),
      ok(),
      ok(),
      ok([{ id_produk: 'p1' }]),
      gagal('Produk gagal dimuat'),
    );

    await expect(controller().perbaruiHargaBeli('b1', 3000)).rejects.toThrow(
      'Produk gagal dimuat',
    );
  });

  it('C19-UT12 negatif: gagal memperbarui margin produk', async () => {
    const langkah = alurSampaiMargin(2000);
    langkah[5] = gagal('Margin gagal disimpan');
    siapkan(...langkah);

    await expect(controller().perbaruiHargaBeli('b1', 3000)).rejects.toThrow(
      'Margin gagal disimpan',
    );
    expect(tampilkanNotifikasi).not.toHaveBeenCalled();
  });

  it('C19-UT13 negatif: gagal menyimpan notifikasi', async () => {
    siapkan(...alurSampaiMargin(2000), gagal('Notifikasi gagal disimpan'));

    await expect(controller().perbaruiHargaBeli('b1', 3000)).rejects.toThrow(
      'Notifikasi gagal disimpan',
    );
    expect(tampilkanNotifikasi).not.toHaveBeenCalled();
  });
});

describe('C19 NotificationController.evaluasiPerubahanHarga()', () => {
  it('C19-UT14 normal: produk tanpa data resep tetap dihitung dengan aman', async () => {
    siapkan(
      ok([{ id_produk: 'p2' }]),
      ok([
        {
          id_produk: 'p2',
          nama_produk: 'Teh Manis',
          harga_jual: 5000,
          tbl_resep_bahan: [{ id_bahan: 'b1', takaran: 1, tbl_bahan_baku: null }],
        },
        { id_produk: 'p3', nama_produk: 'Kosong', harga_jual: 1000, tbl_resep_bahan: null },
      ]),
      ok(), // update margin p2 (p3 tidak memakai b1 sehingga dilewati)
      notifTersimpan('n1'),
    );

    await controller().evaluasiPerubahanHarga('b1', 'Gula', 1000, 2000);

    expect(query[2].update).toHaveBeenCalledWith({ margin: 3000, status_peringatan: false });
    expect(query[3].insert).toHaveBeenCalledWith(expect.objectContaining({ tipe: 'harga_bahan' }));
  });

  it('C19-UT15 batas: harga lama sama dengan harga baru tidak membuat notifikasi perubahan harga', async () => {
    siapkan(ok([]));

    await controller().evaluasiPerubahanHarga('b1', 'Gula', 1000, 1000);

    expect(query).toHaveLength(1);
    expect(tampilkanNotifikasi).not.toHaveBeenCalled();
  });
});

describe('C19 NotificationController.buatNotifikasiKerugian() dan kirimNotifikasi()', () => {
  it('C19-UT16 normal: notifikasi kerugian tersimpan dan dikembalikan sebagai objek Notifikasi', async () => {
    siapkan(notifTersimpan('n7'));

    const notif = await controller().buatNotifikasiKerugian(
      { idProduk: 'p1', namaProduk: 'Nasi Goreng', hargaJual: 15000, margin: -2000, rugi: true },
      'Telur',
      6000,
    );

    expect(notif).toBeInstanceOf(Notifikasi);
    expect(notif.getIdNotifikasi()).toBe('n7');
    expect(notif.getTipe()).toBe('kerugian');
    expect(notif.getIdProduk()).toBe('p1');
    expect(notif.getPesanAlert()).toContain('Nasi Goreng');
    expect(notif.getIsRead()).toBe(false);
  });

  it('C19-UT17 negatif: kegagalan push notification tidak membatalkan proses', async () => {
    const peringatan = vi.spyOn(console, 'warn').mockImplementation(() => {});
    tampilkanNotifikasi.mockRejectedValueOnce(new Error('Izin ditolak'));
    siapkan(notifTersimpan('n8'));

    const notif = await controller().buatNotifikasiPerubahanHarga('b1', 'Telur', 2000, 3000, 2);

    expect(notif.getIdNotifikasi()).toBe('n8');
    expect(peringatan).toHaveBeenCalled();
    peringatan.mockRestore();
  });

  it('C19-UT18 normal: getPush mengembalikan layanan push yang dipakai controller', () => {
    expect(controller().getPush()).toBe(pushPalsu);
  });
});

describe('C19 NotificationController.muatNotifikasi()', () => {
  it('C19-UT19 normal: baris basis data dipetakan menjadi objek Notifikasi', async () => {
    siapkan(
      ok([
        {
          id_notifikasi: 'n1',
          id_produk: 'p1',
          tipe: 'kerugian',
          judul: 'Margin Negatif!',
          pesan_alert: 'Nasi Goreng rugi',
          waktu_kirim: '2026-11-19T06:00:00.000Z',
          is_read: false,
        },
        {
          id_notifikasi: 'n2',
          id_produk: null,
          tipe: 'harga_bahan',
          judul: 'Harga Telur naik',
          pesan_alert: 'Telur naik 50%',
          waktu_kirim: '2026-11-18T06:00:00.000Z',
          is_read: true,
        },
      ]),
    );

    const daftar = await controller().muatNotifikasi();

    expect(query[0].order).toHaveBeenCalledWith('waktu_kirim', { ascending: false });
    expect(daftar).toHaveLength(2);
    expect(daftar[0].getIdProduk()).toBe('p1');
    expect(daftar[0].getWaktuKirim().toISOString()).toBe('2026-11-19T06:00:00.000Z');
    expect(daftar[1].getIdProduk()).toBeNull();
    expect(daftar[1].getIsRead()).toBe(true);
  });

  it('C19-UT20 batas: tidak ada notifikasi menghasilkan daftar kosong', async () => {
    siapkan(ok(null));

    await expect(controller().muatNotifikasi()).resolves.toEqual([]);
  });

  it('C19-UT21 negatif: kesalahan basis data diteruskan sebagai error', async () => {
    siapkan(gagal('Koneksi terputus'));

    await expect(controller().muatNotifikasi()).rejects.toThrow('Koneksi terputus');
  });
});

describe('C19 NotificationController.tandaiSudahDibaca() dan tandaiSemuaDibaca()', () => {
  const notifBaru = () =>
    new Notifikasi('n1', 'Judul', 'Pesan', new Date(0), 'kerugian', 'p1', false);

  it('C19-UT22 normal: satu notifikasi ditandai sudah dibaca', async () => {
    siapkan(ok());
    const notif = notifBaru();

    await controller().tandaiSudahDibaca(notif);

    expect(query[0].update).toHaveBeenCalledWith({ is_read: true });
    expect(query[0].eq).toHaveBeenCalledWith('id_notifikasi', 'n1');
    expect(notif.getIsRead()).toBe(true);
  });

  it('C19-UT23 negatif: status tidak berubah bila basis data gagal', async () => {
    siapkan(gagal('Update gagal'));
    const notif = notifBaru();

    await expect(controller().tandaiSudahDibaca(notif)).rejects.toThrow('Update gagal');
    expect(notif.getIsRead()).toBe(false);
  });

  it('C19-UT24 normal: semua notifikasi belum dibaca ditandai sudah dibaca', async () => {
    siapkan(ok());

    await controller().tandaiSemuaDibaca();

    expect(query[0].update).toHaveBeenCalledWith({ is_read: true });
    expect(query[0].eq).toHaveBeenCalledWith('is_read', false);
  });

  it('C19-UT25 negatif: kegagalan menandai semua diteruskan sebagai error', async () => {
    siapkan(gagal('Update massal gagal'));

    await expect(controller().tandaiSemuaDibaca()).rejects.toThrow('Update massal gagal');
  });
});
