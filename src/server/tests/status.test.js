// Test state machine status (gap G2) dan fungsi inti ubahStatus(). Pemilik: P1.
import { STATUS, bolehTransisi } from '@silembur/shared';
import { afterAll, describe, expect, it } from 'vitest';
import { pool, withTransaction } from '../src/db/pool.js';
import { Laporan } from '../src/models/index.js';

afterAll(() => pool.end());

describe('bolehTransisi (unit)', () => {
  it.each([
    [STATUS.MENUNGGU_VERIFIKASI, STATUS.TERVERIFIKASI, true],
    [STATUS.MENUNGGU_VERIFIKASI, STATUS.PERLU_REVISI, true],
    [STATUS.PERLU_REVISI, STATUS.MENUNGGU_VERIFIKASI, true],
    [STATUS.TERVERIFIKASI, STATUS.DIPROSES, true],
    [STATUS.DIPROSES, STATUS.SELESAI, true],
    [STATUS.MENUNGGU_VERIFIKASI, STATUS.SELESAI, false],
    [STATUS.DITOLAK, STATUS.TERVERIFIKASI, false],
    [STATUS.SELESAI, STATUS.DIPROSES, false],
    [STATUS.DIGABUNG, STATUS.MENUNGGU_VERIFIKASI, false],
  ])('%s -> %s = %s', (dari, ke, harapan) => {
    expect(bolehTransisi(dari, ke)).toBe(harapan);
  });
});

describe('ubahStatus (integrasi DB)', () => {
  async function laporanBerstatus(status) {
    const { rows } = await pool.query('SELECT id_laporan FROM laporan WHERE status_laporan = $1 LIMIT 1', [status]);
    return rows[0].id_laporan;
  }

  it('mengubah status dan mencatat riwayat', async () => {
    const id = await laporanBerstatus(STATUS.TERVERIFIKASI);
    const sebelum = await pool.query('SELECT COUNT(*) AS n FROM riwayat_status WHERE id_laporan = $1', [id]);

    await withTransaction((db) =>
      Laporan.ubahStatus(db, { idLaporan: id, statusBaru: STATUS.DIPROSES, deskripsi: 'Uji: mulai ditangani' }),
    );

    const { rows } = await pool.query('SELECT status_laporan FROM laporan WHERE id_laporan = $1', [id]);
    expect(rows[0].status_laporan).toBe(STATUS.DIPROSES);
    const sesudah = await pool.query(
      'SELECT COUNT(*) AS n FROM riwayat_status WHERE id_laporan = $1',
      [id],
    );
    expect(sesudah.rows[0].n).toBe(sebelum.rows[0].n + 1);
  });

  it('menolak transisi ilegal dengan 409 dan tidak mengubah apa pun', async () => {
    const id = await laporanBerstatus(STATUS.DITOLAK);
    await expect(
      withTransaction((db) => Laporan.ubahStatus(db, { idLaporan: id, statusBaru: STATUS.SELESAI, deskripsi: 'x' })),
    ).rejects.toMatchObject({ status: 409 });
    const { rows } = await pool.query('SELECT status_laporan FROM laporan WHERE id_laporan = $1', [id]);
    expect(rows[0].status_laporan).toBe(STATUS.DITOLAK);
  });
});
