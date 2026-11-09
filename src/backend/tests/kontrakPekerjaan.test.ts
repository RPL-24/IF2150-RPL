import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import type { Request, Response } from 'express';
import prisma from '../src/database/prisma.js';
import {
  AUTO_CANCEL_TIMEOUT_MS,
  KontrakError,
  KontrakPekerjaan,
  STATUS_KETERSEDIAAN,
  STATUS_PEKERJAAN,
} from '../src/models/KontrakPekerjaan.js';
import { Pengguna } from '../src/models/Pengguna.js';
import { KontrakPekerjaanController } from '../src/controllers/KontrakPekerjaanController.js';
import { cancelExpiredContracts } from '../src/workers/autoCancelKontrakWorker.js';
import {
  authenticateJWT,
  authorizeRoles,
  signJWT,
  verifyJWT,
} from '../src/middlewares/authMiddleware.js';

process.env.NODE_ENV = 'test';

interface MockPemberiJasaRow {
  idPemberiJasa: string;
  namaToko: string;
  statusKetersediaan: string;
  version: number;
}

interface MockKontrakRow {
  idKontrakPekerjaan: string;
  idPelanggan: string;
  idPemberiJasa: string;
  detailPekerjaan: string;
  persetujuanHarga: number;
  statusPekerjaan: string;
  hasRating: boolean;
  createdAt: Date;
  expiresAt: Date | null;
}

interface MockNotifikasiRow {
  idNotifikasi: string;
  idPenerima: string;
  isiNotifikasi: string;
  waktuNotifikasi: Date;
  statusBaca: string;
}

const mockDb = {
  pemberiJasa: new Map<string, MockPemberiJasaRow>(),
  kontrakPekerjaan: new Map<string, MockKontrakRow>(),
  notifikasi: [] as MockNotifikasiRow[],
};

function setupMockPrisma(): void {
  mockDb.pemberiJasa.clear();
  mockDb.kontrakPekerjaan.clear();
  mockDb.notifikasi = [];

  mockDb.pemberiJasa.set('provider-1', {
    idPemberiJasa: 'provider-1',
    namaToko: 'Jahit Keliling Pak Budi',
    statusKetersediaan: STATUS_KETERSEDIAAN.AVAILABLE,
    version: 1,
  });

  const mockDelegates = {
    pemberiJasa: {
      findUnique: async ({ where }: any) => {
        const row = mockDb.pemberiJasa.get(where.idPemberiJasa);
        return row ? { ...row } : null;
      },
      update: async ({ where, data }: any) => {
        const row = mockDb.pemberiJasa.get(where.idPemberiJasa);
        if (!row) throw new Error('Provider not found');
        if (data.statusKetersediaan !== undefined) {
          row.statusKetersediaan = data.statusKetersediaan;
        }
        if (data.version?.increment) {
          row.version += data.version.increment;
        } else if (typeof data.version === 'number') {
          row.version = data.version;
        }
        return { ...row };
      },
      updateMany: async ({ where, data }: any) => {
        const row = mockDb.pemberiJasa.get(where.idPemberiJasa);
        if (!row) return { count: 0 };
        if (where.version !== undefined && row.version !== where.version) {
          return { count: 0 };
        }
        if (
          where.statusKetersediaan !== undefined &&
          row.statusKetersediaan !== where.statusKetersediaan
        ) {
          return { count: 0 };
        }
        if (data.statusKetersediaan !== undefined) {
          row.statusKetersediaan = data.statusKetersediaan;
        }
        if (data.version?.increment) {
          row.version += data.version.increment;
        }
        return { count: 1 };
      },
    },
    kontrakPekerjaan: {
      create: async ({ data }: any) => {
        const row: MockKontrakRow = {
          idKontrakPekerjaan: data.idKontrakPekerjaan,
          idPelanggan: data.idPelanggan,
          idPemberiJasa: data.idPemberiJasa,
          detailPekerjaan: data.detailPekerjaan,
          persetujuanHarga: data.persetujuanHarga,
          statusPekerjaan: data.statusPekerjaan,
          hasRating: Boolean(data.hasRating),
          createdAt: data.createdAt ?? new Date(),
          expiresAt: data.expiresAt ?? null,
        };
        mockDb.kontrakPekerjaan.set(row.idKontrakPekerjaan, row);
        return { ...row };
      },
      findUnique: async ({ where }: any) => {
        const row = mockDb.kontrakPekerjaan.get(where.idKontrakPekerjaan);
        return row ? { ...row } : null;
      },
      findFirst: async ({ where }: any) => {
        for (const row of mockDb.kontrakPekerjaan.values()) {
          if (where.idPemberiJasa && row.idPemberiJasa !== where.idPemberiJasa) {
            continue;
          }
          if (
            where.idKontrakPekerjaan?.not &&
            row.idKontrakPekerjaan === where.idKontrakPekerjaan.not
          ) {
            continue;
          }
          if (
            where.statusPekerjaan?.in &&
            !where.statusPekerjaan.in.includes(row.statusPekerjaan)
          ) {
            continue;
          }
          return { ...row };
        }
        return null;
      },
      findMany: async ({ where }: any) => {
        const results: MockKontrakRow[] = [];
        for (const row of mockDb.kontrakPekerjaan.values()) {
          if (
            where?.statusPekerjaan &&
            row.statusPekerjaan !== where.statusPekerjaan
          ) {
            continue;
          }
          if (where?.OR) {
            const matchedOr = where.OR.some((cond: any) => {
              if (cond.idPelanggan) {
                return row.idPelanggan === cond.idPelanggan;
              }
              if (cond.idPemberiJasa) {
                return row.idPemberiJasa === cond.idPemberiJasa;
              }
              if (cond.expiresAt?.lte) {
                return (
                  row.expiresAt !== null &&
                  row.expiresAt.getTime() <= cond.expiresAt.lte.getTime()
                );
              }
              if (cond.expiresAt === null && cond.createdAt?.lte) {
                return (
                  row.expiresAt === null &&
                  row.createdAt.getTime() <= cond.createdAt.lte.getTime()
                );
              }
              return false;
            });
            if (!matchedOr) continue;
          }
          results.push({ ...row });
        }
        return results;
      },
      count: async ({ where }: any) => {
        let count = 0;
        for (const row of mockDb.kontrakPekerjaan.values()) {
          if (where.idPemberiJasa && row.idPemberiJasa !== where.idPemberiJasa) {
            continue;
          }
          if (
            where.idKontrakPekerjaan?.not &&
            row.idKontrakPekerjaan === where.idKontrakPekerjaan.not
          ) {
            continue;
          }
          if (
            where.statusPekerjaan?.in &&
            !where.statusPekerjaan.in.includes(row.statusPekerjaan)
          ) {
            continue;
          }
          count++;
        }
        return count;
      },
      update: async ({ where, data }: any) => {
        const row = mockDb.kontrakPekerjaan.get(where.idKontrakPekerjaan);
        if (!row) throw new Error('Contract not found');
        Object.assign(row, data);
        return { ...row };
      },
      updateMany: async ({ where, data }: any) => {
        const row = mockDb.kontrakPekerjaan.get(where.idKontrakPekerjaan);
        if (!row) return { count: 0 };
        if (typeof where.statusPekerjaan === 'string') {
          if (row.statusPekerjaan !== where.statusPekerjaan) return { count: 0 };
        } else if (where.statusPekerjaan?.in) {
          if (!where.statusPekerjaan.in.includes(row.statusPekerjaan)) {
            return { count: 0 };
          }
        }
        Object.assign(row, data);
        return { count: 1 };
      },
    },
    notifikasi: {
      create: async ({ data }: any) => {
        const notif: MockNotifikasiRow = {
          idNotifikasi: data.idNotifikasi,
          idPenerima: data.idPenerima,
          isiNotifikasi: data.isiNotifikasi,
          waktuNotifikasi: data.waktuNotifikasi ?? new Date(),
          statusBaca: data.statusBaca ?? 'Unread',
        };
        mockDb.notifikasi.push(notif);
        return notif;
      },
      update: async ({ where, data }: any) => {
        const found = mockDb.notifikasi.find(
          (n) => n.idNotifikasi === where.idNotifikasi
        );
        if (found) Object.assign(found, data);
        return found;
      },
      findFirst: async ({ where }: any) => {
        const items = mockDb.notifikasi.filter(
          (n) => n.idPenerima === where.idPenerima
        );
        return items.length > 0 ? items[items.length - 1] : null;
      },
    },
    $transaction: async (fn: any) => {
      return fn(mockDelegates);
    },
  };

  Object.assign(prisma, mockDelegates);
}

function createMockReqRes(options: {
  headers?: Record<string, string>;
  body?: Record<string, any>;
  params?: Record<string, string>;
  query?: Record<string, string>;
}) {
  const req = {
    headers: options.headers ?? {},
    body: options.body ?? {},
    params: options.params ?? {},
    query: options.query ?? {},
  } as unknown as Request;

  let statusCode = 200;
  let jsonBody: any = null;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(payload: any) {
      jsonBody = payload;
      return this;
    },
    getStatus: () => statusCode,
    getJson: () => jsonBody,
  } as unknown as Response & { getStatus: () => number; getJson: () => any };

  return { req, res };
}

describe('KontrakPekerjaan & KontrakPekerjaanController (UC05, UC06, UC07)', () => {
  const controller = new KontrakPekerjaanController();

  beforeEach(() => {
    setupMockPrisma();
  });

  test('ALGO-037 (saveKontrak Q-017 & Q-018), ALGO-038 (newKontrak), ALGO-039 (makeKontrak), ALGO-040 (fetchKontrakPekerjaan Q-019), dan KNF18', async () => {
    const kontrak = new KontrakPekerjaan();
    kontrak.newKontrak({
      idPelanggan: 'cust-1',
      idPemberiJasa: 'provider-1',
      detailPekerjaan: 'Jahit celana bahan dan permak kemeja',
      persetujuanHarga: 75000,
    });

    assert.equal(kontrak.getStatusPekerjaan(), STATUS_PEKERJAAN.MENUNGGU);
    assert.ok(kontrak.getExpiresAt() instanceof Date);

    const created = kontrak.makeKontrak();
    assert.equal(created, true);
    const id = kontrak.getIdKontrakPekerjaan()!;
    assert.ok(id);

    // ALGO-037 (Q-017): INSERT kontrak baru
    const savedNew = await kontrak.saveKontrak();
    assert.equal(savedNew, true);

    // ALGO-040 (Q-019): fetchKontrakPekerjaan
    const fetched = await KontrakPekerjaan.fetchKontrakPekerjaan(id);
    assert.ok(fetched);
    assert.equal(fetched.getPersetujuanHarga(), 75000);

    // ALGO-036 (Q-016) & ALGO-037 (Q-018): UPDATE kontrak yang sudah ada
    const statusUpdated = await fetched.statusUpdate(
      'statusPekerjaan',
      STATUS_PEKERJAAN.ON_PROGRESS
    );
    assert.equal(statusUpdated, true);
    assert.equal(fetched.getStatusPekerjaan(), STATUS_PEKERJAAN.ON_PROGRESS);

    const savedExisting = await fetched.saveKontrak();
    assert.equal(savedExisting, true);

    // KNF18: Tolak input kosong, harga negatif, atau injeksi berbahaya
    assert.equal(
      KontrakPekerjaan.validateKontrakInput('', 50000).valid,
      false
    );
    assert.equal(
      KontrakPekerjaan.validateKontrakInput('Perbaikan pipa', -10000).valid,
      false
    );
    assert.equal(
      KontrakPekerjaan.validateKontrakInput(
        'Test; DROP TABLE kontrak_pekerjaan',
        50000
      ).valid,
      false
    );
  });

  test('UC05, ALGO-043 (kirimInput), KNF04 & KNF19: Pelanggan membuat kontrak -> status Menunggu & Optimistic Lock penyedia jasa', async () => {
    const kontrak = await controller.kirimInput(
      'Servis resleting jaket kulit',
      85000,
      'cust-1',
      'provider-1',
      1
    );

    const detail = kontrak.getDetailPekerjaan();
    assert.equal(detail.statusPekerjaan, STATUS_PEKERJAAN.MENUNGGU);
    assert.equal(detail.persetujuanHarga, 85000);
    assert.ok(detail.expiresAt);

    // Penyedia jasa terkunci (statusKetersediaan = 'On Progress', version naik 1 -> 2)
    const provider = mockDb.pemberiJasa.get('provider-1')!;
    assert.equal(provider.statusKetersediaan, STATUS_KETERSEDIAAN.ON_PROGRESS);
    assert.equal(provider.version, 2);

    // Notifikasi terkirim ke penyedia jasa
    assert.equal(mockDb.notifikasi.length, 1);
    assert.equal(mockDb.notifikasi[0].idPenerima, 'provider-1');

    // KNF04: Pelanggan ke-2 mencoba memesan penyedia jasa yang sama secara bersamaan -> ditolak (409 Conflict)
    await assert.rejects(
      async () => {
        await controller.kirimInput(
          'Permak jas',
          120000,
          'cust-2',
          'provider-1',
          1
        );
      },
      (err: unknown) => {
        assert.ok(err instanceof KontrakError);
        assert.equal(err.statusCode, 409);
        return true;
      }
    );
  });

  test('Penyedia menerima kontrak (Optimistic Locking KNF04 & KNF19) -> On Progress -> Selesai (UC06, KNF20) -> Konfirmasi Pelanggan (UC07, ALGO-042, KNF21, KNF22) -> Done', async () => {
    const kontrak = await controller.kirimInput(
      'Sol sepatu kulit 2 pasang',
      100000,
      'cust-1',
      'provider-1'
    );
    const idKontrak = kontrak.getIdKontrakPekerjaan()!;

    // Uji Optimistic Locking gagal jika version tidak sesuai (mis. version lama = 1 padahal sekarang 2)
    await assert.rejects(
      async () => {
        await controller.konfirmasiPersetujuanPenyedia(
          idKontrak,
          'provider-1',
          true,
          1
        );
      },
      (err: unknown) => {
        assert.ok(err instanceof KontrakError);
        assert.equal(err.code, 'OPTIMISTIC_LOCK_CONFLICT');
        assert.equal(err.statusCode, 409);
        return true;
      }
    );

    // Penyedia menerima dengan version yang valid (version = 2) -> status menjadi 'On Progress'
    const accepted = await controller.konfirmasiPersetujuanPenyedia(
      idKontrak,
      'provider-1',
      true,
      2
    );
    assert.equal(accepted.getStatusPekerjaan(), STATUS_PEKERJAAN.ON_PROGRESS);
    assert.equal(mockDb.pemberiJasa.get('provider-1')!.version, 3);

    // UC06: Penyedia menyelesaikan pekerjaan -> status menjadi 'Menunggu Konfirmasi Pelanggan' + kirim notifikasi (KNF20)
    const finished = await controller.selesaikanPekerjaan(
      idKontrak,
      'provider-1'
    );
    assert.equal(
      finished.getStatusPekerjaan(),
      STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN
    );

    // UC07 & ALGO-042 & C01 Pengguna.konfirmasiPekerjaan: Pelanggan mengonfirmasi penyelesaian & pembayaran -> status 'Done' & buka kunci penyedia
    const confirmed = await controller.konfirmasiPekerjaan(idKontrak, 'cust-1');
    assert.equal(confirmed, true);

    const finalKontrak = await controller.getKontrakPekerjaan(idKontrak);
    assert.equal(finalKontrak?.getStatusPekerjaan(), STATUS_PEKERJAAN.DONE);

    // Kunci ketersediaan penyedia jasa terbuka kembali ('Available')
    const providerAfterDone = mockDb.pemberiJasa.get('provider-1')!;
    assert.equal(
      providerAfterDone.statusKetersediaan,
      STATUS_KETERSEDIAAN.AVAILABLE
    );
  });

  test('KF07 & KNF11: Auto-cancel 30 menit membatalkan kontrak Menunggu yang kedaluwarsa dan membuka kunci penyedia jasa', async () => {
    const kontrak = await controller.kirimInput(
      'Perbaikan engsel pintu kayu',
      150000,
      'cust-1',
      'provider-1'
    );
    const idKontrak = kontrak.getIdKontrakPekerjaan()!;

    assert.equal(
      mockDb.pemberiJasa.get('provider-1')!.statusKetersediaan,
      STATUS_KETERSEDIAAN.ON_PROGRESS
    );

    // Simulasikan waktu berjalan 31 menit ke depan (> 30 menit)
    const futureTime = new Date(Date.now() + AUTO_CANCEL_TIMEOUT_MS + 60_000);
    const result = await cancelExpiredContracts(futureTime);

    assert.equal(result.cancelledCount, 1);
    assert.deepEqual(result.cancelledIds, [idKontrak]);

    const expiredKontrak = await controller.getKontrakPekerjaan(idKontrak);
    assert.equal(
      expiredKontrak?.getStatusPekerjaan(),
      STATUS_PEKERJAAN.DIBATALKAN
    );

    // Kunci penyedia jasa telah dilepaskan kembali menjadi 'Available'
    assert.equal(
      mockDb.pemberiJasa.get('provider-1')!.statusKetersediaan,
      STATUS_KETERSEDIAAN.AVAILABLE
    );
  });

  test('KNF22: Validasi state transition menolak perubahan status yang tidak sah & mendukung Pengguna.konfirmasiPekerjaan()', async () => {
    const kontrak = await controller.kirimInput(
      'Bersih taman rumah',
      90000,
      'cust-1',
      'provider-1'
    );
    const idKontrak = kontrak.getIdKontrakPekerjaan()!;

    // Pelanggan tidak bisa langsung konfirmasi Done saat status masih 'Menunggu'
    const pelanggan = new Pengguna({ idPengguna: 'cust-1' });
    const prematureConfirm = await pelanggan.konfirmasiPekerjaan(idKontrak);
    assert.equal(prematureConfirm, false);

    // Penyedia menolak kontrak -> status 'Ditolak' & kunci penyedia jasa dilepas
    const rejected = await controller.konfirmasiPersetujuanPenyedia(
      idKontrak,
      'provider-1',
      false
    );
    assert.equal(rejected.getStatusPekerjaan(), STATUS_PEKERJAAN.DITOLAK);
    assert.equal(
      mockDb.pemberiJasa.get('provider-1')!.statusKetersediaan,
      STATUS_KETERSEDIAAN.AVAILABLE
    );
  });

  test('REST API Handlers + JWT Auth Middleware: alur lengkap dari pembuatan kontrak hingga selesai', async () => {
    const pelangganToken = signJWT({
      idPengguna: 'cust-1',
      username: 'pelanggan1',
      role: 'PELANGGAN',
    });
    const providerToken = signJWT({
      idPengguna: 'provider-1',
      username: 'pakbudi',
      role: 'PEMBERI_JASA',
    });

    const decoded = verifyJWT(pelangganToken);
    assert.equal(decoded.idPengguna, 'cust-1');

    // 1. Tanpa token -> 401 Unauthorized
    const unauth = createMockReqRes({});
    let nextCalled = false;
    authenticateJWT(unauth.req, unauth.res, () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, false);
    assert.equal(unauth.res.getStatus(), 401);

    // 2. Pelanggan membuat kontrak -> 201 Created (status: 'Menunggu')
    const createCall = createMockReqRes({
      headers: { authorization: `Bearer ${pelangganToken}` },
      body: {
        idPemberiJasa: 'provider-1',
        detailPekerjaan: 'Cuci AC 1 PK ruang tamu',
        persetujuanHarga: 125000,
        expectedVersion: 1,
      },
    });
    authenticateJWT(createCall.req, createCall.res, () => {});
    authorizeRoles('PELANGGAN')(createCall.req, createCall.res, () => {});
    await controller.handleKirimInput(createCall.req, createCall.res);

    assert.equal(createCall.res.getStatus(), 201);
    const createdJson = createCall.res.getJson();
    assert.equal(createdJson.data.statusPekerjaan, STATUS_PEKERJAAN.MENUNGGU);
    const kontrakId = createdJson.data.idKontrakPekerjaan;

    // 3. Penyedia jasa menyetujui kontrak -> 200 OK (status: 'On Progress')
    const acceptCall = createMockReqRes({
      headers: { authorization: `Bearer ${providerToken}` },
      params: { id: kontrakId },
      body: { disetujui: true, expectedVersion: 2 },
    });
    authenticateJWT(acceptCall.req, acceptCall.res, () => {});
    authorizeRoles('PEMBERI_JASA')(acceptCall.req, acceptCall.res, () => {});
    await controller.handleKonfirmasiPersetujuan(
      acceptCall.req,
      acceptCall.res
    );

    assert.equal(acceptCall.res.getStatus(), 200);
    assert.equal(
      acceptCall.res.getJson().data.statusPekerjaan,
      STATUS_PEKERJAAN.ON_PROGRESS
    );

    // 4. Penyedia jasa menyelesaikan pekerjaan -> 200 OK (status: 'Menunggu Konfirmasi Pelanggan')
    const finishCall = createMockReqRes({
      headers: { authorization: `Bearer ${providerToken}` },
      params: { id: kontrakId },
    });
    authenticateJWT(finishCall.req, finishCall.res, () => {});
    await controller.handleSelesaikanPekerjaan(finishCall.req, finishCall.res);

    assert.equal(finishCall.res.getStatus(), 200);
    assert.equal(
      finishCall.res.getJson().data.statusPekerjaan,
      STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN
    );

    // 5. Pelanggan mengonfirmasi selesai & pembayaran -> 200 OK (status: 'Done')
    const confirmCall = createMockReqRes({
      headers: { authorization: `Bearer ${pelangganToken}` },
      params: { id: kontrakId },
    });
    authenticateJWT(confirmCall.req, confirmCall.res, () => {});
    await controller.handleKonfirmasiPekerjaan(
      confirmCall.req,
      confirmCall.res
    );

    assert.equal(confirmCall.res.getStatus(), 200);
    assert.equal(
      confirmCall.res.getJson().data.statusPekerjaan,
      STATUS_PEKERJAAN.DONE
    );
  });
});
