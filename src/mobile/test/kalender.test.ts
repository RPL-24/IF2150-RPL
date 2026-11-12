import { describe, expect, test } from 'vitest';
import { eventPadaTanggal, labelWaktuEvent, tanggalEvent } from '../src/lib/kalender';

describe('kalender mobile — tanggal lokal dan event multi-hari', () => {
  test('membaca tanggal all-day sebagai tanggal lokal, bukan UTC', () => {
    const tanggal = tanggalEvent('2031-06-02');
    expect(tanggal.getFullYear()).toBe(2031);
    expect(tanggal.getMonth()).toBe(5);
    expect(tanggal.getDate()).toBe(2);
    expect(tanggal.getHours()).toBe(0);
  });

  test('menampilkan event all-day pada hari yang benar dan memberi label Seharian', () => {
    const event = { judul: 'Libur', mulai: '2031-06-02', selesai: '2031-06-03', sumber: 'google' };
    expect(eventPadaTanggal(event, new Date(2031, 5, 2, 12))).toBe(true);
    expect(eventPadaTanggal(event, new Date(2031, 5, 3, 12))).toBe(false);
    expect(labelWaktuEvent(event)).toBe('Seharian');
  });

  test('menampilkan event multi-hari pada setiap hari yang beririsan', () => {
    const event = { judul: 'Konferensi', mulai: '2031-06-02T22:00:00.000Z', selesai: '2031-06-04T02:00:00.000Z', sumber: 'google' };
    expect(eventPadaTanggal(event, new Date('2031-06-03T12:00:00.000Z'))).toBe(true);
  });

  test('menolak tanggal event yang tidak valid', () => {
    const event = { judul: 'Invalid', mulai: 'bukan-tanggal', selesai: 'juga-bukan', sumber: 'google' };
    expect(eventPadaTanggal(event, new Date())).toBe(false);
  });
});
