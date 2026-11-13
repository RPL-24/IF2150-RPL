import { describe, expect, test } from 'vitest';
import { gabungkanJadwal, tanggalSlot, type JadwalKalender } from '../src/lib/kalender';
import { buatEventKalenderMock } from '../src/lib/google';

const SEKARANG = new Date('2031-05-31T00:00:00Z');

function slot(
  id: string,
  mulai: string,
  selesai: string,
  opsi: Partial<JadwalKalender> = {},
): JadwalKalender {
  return {
    idJadwal: id,
    namaKonsultan: 'Dr. Raisa',
    spesialisasi: 'Psikologi Klinis',
    waktu: mulai,
    waktuSelesai: selesai,
    status: 'tersedia',
    idMahasiswa: null,
    ...opsi,
  };
}

const idKonsultasi = (events: { idJadwal?: string }[]) => events.map((e) => e.idJadwal).filter(Boolean);

describe('KalenderGabungan.gabungkanJadwal — Algo-011', () => {
  test('menggabungkan event Google dan jadwal konsultasi dalam urutan waktu', () => {
    const hasil = gabungkanJadwal(
      [
        { summary: 'Rapat', start: { dateTime: '2031-06-02T10:00:00.000Z' }, end: { dateTime: '2031-06-02T11:00:00.000Z' } },
        { summary: 'Acara seharian', start: { date: '2031-06-01' }, end: { date: '2031-06-02' } },
      ],
      [slot('j1', '2031-06-02T08:00:00.000Z', '2031-06-02T09:00:00.000Z', { status: 'terpesan', idMahasiswa: 'mhs' })],
      'mhs',
      SEKARANG,
    );

    expect(hasil.map((event) => event.judul)).toEqual([
      'Acara seharian',
      'Sesi konsultasi saya',
      'Rapat',
    ]);
    expect(hasil[0]?.sumber).toBe('google');
    expect(hasil[1]?.sumber).toBe('terpesan');
  });

  test('mengabaikan event Google yang tidak memiliki waktu mulai atau selesai', () => {
    const hasil = gabungkanJadwal(
      [{ summary: 'Tidak valid', start: { dateTime: '2031-06-02T10:00:00Z' } }],
      [],
      'mhs',
      SEKARANG,
    );
    expect(hasil).toEqual([]);
  });

  test('menggunakan judul pengganti saat summary kosong', () => {
    const hasil = gabungkanJadwal(
      [{ start: { dateTime: '2031-06-02T10:00:00Z' }, end: { dateTime: '2031-06-02T11:00:00Z' } }],
      [],
      'mhs',
      SEKARANG,
    );
    expect(hasil[0]?.judul).toBe('(tanpa judul)');
  });

  test('mengurutkan event berdasarkan waktu mulai, bukan urutan sumber', () => {
    const hasil = gabungkanJadwal(
      [
        { summary: 'Sore', start: { dateTime: '2031-06-02T16:00:00.000Z' }, end: { dateTime: '2031-06-02T17:00:00.000Z' } },
        { summary: 'Pagi', start: { dateTime: '2031-06-02T07:00:00.000Z' }, end: { dateTime: '2031-06-02T08:00:00.000Z' } },
      ],
      [slot('j1', '2031-06-02T12:00:00.000Z', '2031-06-02T13:00:00.000Z')],
      'mhs',
      SEKARANG,
    );

    expect(hasil.map((event) => event.judul)).toEqual(['Pagi', 'Slot konsultasi tersedia', 'Sore']);
  });

  test('mempertahankan event seharian dan waktu date-only Google', () => {
    const hasil = gabungkanJadwal(
      [{ summary: 'Libur', start: { date: '2031-06-01' }, end: { date: '2031-06-02' } }],
      [],
      'mhs',
      SEKARANG,
    );

    expect(hasil).toEqual([
      { judul: 'Libur', mulai: '2031-06-01', selesai: '2031-06-02', sumber: 'google' },
    ]);
  });
});

describe('gabungkanJadwal — siapa konsultannya dan milik siapa (issue #11)', () => {
  test('slot tersedia memuat nama konsultan dan bukan milik saya', () => {
    const [e] = gabungkanJadwal([], [slot('j1', '2031-06-01T03:00:00Z', '2031-06-01T04:00:00Z')], 'mhs', SEKARANG);
    expect(e).toMatchObject({
      sumber: 'tersedia',
      konsultan: 'Dr. Raisa',
      spesialisasi: 'Psikologi Klinis',
      milikSaya: false,
    });
  });

  test('sesi yang saya pesan ditandai milikSaya dan memuat konsultan', () => {
    const hasil = gabungkanJadwal(
      [],
      [slot('j1', '2031-06-01T03:00:00Z', '2031-06-01T04:00:00Z', { status: 'terpesan', idMahasiswa: 'mhs' })],
      'mhs',
      SEKARANG,
    );
    expect(hasil).toHaveLength(1);
    expect(hasil[0]).toMatchObject({ sumber: 'terpesan', milikSaya: true, konsultan: 'Dr. Raisa' });
  });

  test('sesi yang dipesan mahasiswa lain tidak ditampilkan', () => {
    const hasil = gabungkanJadwal(
      [],
      [slot('j1', '2031-06-01T03:00:00Z', '2031-06-01T04:00:00Z', { status: 'terpesan', idMahasiswa: 'lain' })],
      'mhs',
      SEKARANG,
    );
    expect(hasil).toEqual([]);
  });
});

describe('gabungkanJadwal — slot yang disembunyikan (issue #11)', () => {
  test('sudah punya sesi: slot konsultan lain di hari yang sama hilang, hari lain tetap', () => {
    const hasil = gabungkanJadwal(
      [],
      [
        slot('saya', '2031-06-01T03:00:00Z', '2031-06-01T04:00:00Z', { status: 'terpesan', idMahasiswa: 'mhs' }),
        slot('lain-jam', '2031-06-01T07:00:00Z', '2031-06-01T08:00:00Z', { namaKonsultan: 'Bagas' }),
        slot('hari-lain', '2031-06-02T03:00:00Z', '2031-06-02T04:00:00Z'),
      ],
      'mhs',
      SEKARANG,
    );
    expect(idKonsultasi(hasil)).toEqual(['saya', 'hari-lain']);
  });

  test('sesi mahasiswa lain di hari yang sama tidak menyembunyikan slot saya', () => {
    const hasil = gabungkanJadwal(
      [],
      [
        slot('orang', '2031-06-01T03:00:00Z', '2031-06-01T04:00:00Z', { status: 'terpesan', idMahasiswa: 'lain' }),
        slot('buka', '2031-06-01T07:00:00Z', '2031-06-01T08:00:00Z'),
      ],
      'mhs',
      SEKARANG,
    );
    expect(idKonsultasi(hasil)).toEqual(['buka']);
  });

  test('event Google, termasuk yang bertumpang dengan slot, tidak menyembunyikan slot', () => {
    const hasil = gabungkanJadwal(
      [{ summary: 'Kuliah', start: { dateTime: '2031-06-01T03:30:00Z' }, end: { dateTime: '2031-06-01T05:00:00Z' } }],
      [slot('j1', '2031-06-01T03:00:00Z', '2031-06-01T04:00:00Z')],
      'mhs',
      SEKARANG,
    );
    expect(hasil.map((e) => e.sumber).sort()).toEqual(['google', 'tersedia']);
  });

  test('slot tersedia yang sudah lewat disembunyikan', () => {
    const hasil = gabungkanJadwal(
      [],
      [slot('lampau', '2031-05-30T03:00:00Z', '2031-05-30T04:00:00Z')],
      'mhs',
      SEKARANG,
    );
    expect(hasil).toEqual([]);
  });

  test('tanggalSlot memakai tanggal ISO yang sama dengan pemeriksaan pemesanan', () => {
    expect(tanggalSlot('2031-06-01T03:00:00Z')).toBe('2031-06-01');
    expect(tanggalSlot('2031-06-01T23:59:59.000Z')).toBe('2031-06-01');
  });
});

describe('Google Calendar mock — rentang waktu', () => {
  test('hanya menghasilkan contoh event yang berada di rentang yang diminta', () => {
    const awal = new Date('2031-06-01T00:00:00.000Z');
    const akhir = new Date('2031-06-08T00:00:00.000Z');
    const events = buatEventKalenderMock(awal.toISOString(), akhir.toISOString());
    expect(events).toHaveLength(2);
    expect(events.every((event) => {
      const mulai = Date.parse(event.start?.dateTime ?? '');
      const selesai = Date.parse(event.end?.dateTime ?? '');
      return mulai < akhir.getTime() && selesai > awal.getTime();
    })).toBe(true);
  });

  test('tidak mengembalikan contoh event di luar rentang yang sempit', () => {
    const events = buatEventKalenderMock(
      '2031-06-01T00:00:00.000Z',
      '2031-06-01T12:00:00.000Z',
    );
    expect(events).toEqual([]);
  });
});
