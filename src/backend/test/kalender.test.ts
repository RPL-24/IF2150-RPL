import { describe, expect, test } from 'vitest';
import { gabungkanJadwal } from '../src/lib/kalender';
import { buatEventKalenderMock } from '../src/lib/google';

describe('KalenderGabungan.gabungkanJadwal — Algo-011', () => {
  test('menggabungkan event Google dan jadwal konsultasi dalam urutan waktu', () => {
    const hasil = gabungkanJadwal(
      [
        { summary: 'Rapat', start: { dateTime: '2031-06-02T10:00:00.000Z' }, end: { dateTime: '2031-06-02T11:00:00.000Z' } },
        { summary: 'Acara seharian', start: { date: '2031-06-01' }, end: { date: '2031-06-02' } },
      ],
      [{ waktu: '2031-06-02T08:00:00.000Z', waktuSelesai: '2031-06-02T09:00:00.000Z', status: 'terpesan' }],
    );

    expect(hasil.map((event) => event.judul)).toEqual([
      'Acara seharian',
      'Sesi konsultasi',
      'Rapat',
    ]);
    expect(hasil[0]?.sumber).toBe('google');
    expect(hasil[1]?.sumber).toBe('terpesan');
  });

  test('mengabaikan event Google yang tidak memiliki waktu mulai atau selesai', () => {
    const hasil = gabungkanJadwal(
      [{ summary: 'Tidak valid', start: { dateTime: '2031-06-02T10:00:00Z' } }],
      [],
    );
    expect(hasil).toEqual([]);
  });

  test('menggunakan judul pengganti saat summary kosong', () => {
    const hasil = gabungkanJadwal(
      [{ start: { dateTime: '2031-06-02T10:00:00Z' }, end: { dateTime: '2031-06-02T11:00:00Z' } }],
      [],
    );
    expect(hasil[0]?.judul).toBe('(tanpa judul)');
  });
});

describe('KalenderGabungan.gabungkanJadwal — kasus tambahan', () => {
  test('mengurutkan event berdasarkan waktu mulai, bukan urutan sumber', () => {
    const hasil = gabungkanJadwal(
      [
        { summary: 'Sore', start: { dateTime: '2031-06-02T16:00:00.000Z' }, end: { dateTime: '2031-06-02T17:00:00.000Z' } },
        { summary: 'Pagi', start: { dateTime: '2031-06-02T07:00:00.000Z' }, end: { dateTime: '2031-06-02T08:00:00.000Z' } },
      ],
      [
        { waktu: '2031-06-02T12:00:00.000Z', waktuSelesai: '2031-06-02T13:00:00.000Z', status: 'tersedia' },
      ],
    );

    expect(hasil.map((event) => event.judul)).toEqual([
      'Pagi',
      'Sesi konsultasi',
      'Sore',
    ]);
  });

  test('mempertahankan event seharian dan waktu date-only Google', () => {
    const hasil = gabungkanJadwal(
      [{ summary: 'Libur', start: { date: '2031-06-01' }, end: { date: '2031-06-02' } }],
      [],
    );

    expect(hasil).toEqual([
      { judul: 'Libur', mulai: '2031-06-01', selesai: '2031-06-02', sumber: 'google' },
    ]);
  });

  test('memasukkan jadwal konsultasi dari berbagai status', () => {
    const hasil = gabungkanJadwal([], [
      { waktu: '2031-06-02T08:00:00.000Z', waktuSelesai: '2031-06-02T09:00:00.000Z', status: 'tersedia' },
      { waktu: '2031-06-02T10:00:00.000Z', waktuSelesai: '2031-06-02T11:00:00.000Z', status: 'terpesan' },
    ]);

    expect(hasil.map((event) => event.sumber)).toEqual(['tersedia', 'terpesan']);
    expect(hasil.every((event) => event.judul === 'Sesi konsultasi')).toBe(true);
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
