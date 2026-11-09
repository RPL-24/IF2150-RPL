import { Request, Response } from 'express';
import prisma from '../database/prisma.js';
import {
  KontrakError,
  KontrakPekerjaan,
  STATUS_PEKERJAAN,
} from '../models/KontrakPekerjaan.js';
import { Pengguna } from '../models/Pengguna.js';
import {
  NotifikasiController,
  notifikasiController as defaultNotifikasiController,
} from './NotifikasiController.js';
import { cancelExpiredContracts } from '../workers/autoCancelKontrakWorker.js';

/**
 * Kelas DPPL C18 - KontrakPekerjaanController
 * Mengatur logika bisnis kontrak kerja, penguncian penyedia jasa (Optimistic Locking),
 * validasi state transition, serta pengiriman notifikasi
 * (UC05, UC06, UC07 | KF02, KF07, KF10, KF11, KF12, KF13 | KNF04, KNF11, KNF18, KNF19, KNF20, KNF21, KNF22).
 */
export class KontrakPekerjaanController {
  private notifikasiController: NotifikasiController;

  constructor(notifCtrl: NotifikasiController = defaultNotifikasiController) {
    this.notifikasiController = notifCtrl;
  }

  /**
   * Menampilkan struktur formulir pembuatan kontrak kosong untuk diisi pelanggan (Tabel 5.12.1, KF10, KNF17)
   */
  public showKontrakForm(): {
    detailPekerjaan: string;
    persetujuanHarga: number;
    idPemberiJasa: string;
  } {
    return {
      detailPekerjaan: '',
      persetujuanHarga: 0,
      idPemberiJasa: '',
    };
  }

  /**
   * ALGO-041: getKontrakPekerjaan(idKontrakPekerjaan)
   * Mengambil objek data kontrak pekerjaan melalui model KontrakPekerjaan (ALGO-040, Q-019).
   */
  public async getKontrakPekerjaan(
    idKontrakPekerjaan: string
  ): Promise<KontrakPekerjaan | null> {
    const temp = await KontrakPekerjaan.fetchKontrakPekerjaan(idKontrakPekerjaan);
    return temp;
  }

  /**
   * Memperbarui status progres kontrak pekerjaan (Tabel 5.12.1, ALGO-036, Q-016)
   */
  private async statusUpdate(
    idKontrakPekerjaan: string,
    statusBaru: string
  ): Promise<boolean> {
    const kontrak = await this.getKontrakPekerjaan(idKontrakPekerjaan);
    if (!kontrak) {
      return false;
    }
    return kontrak.statusUpdate('statusPekerjaan', statusBaru);
  }

  /**
   * ALGO-043: kirimInput(detailPekerjaan, persetujuanHarga, idPelanggan, idPemberiJasa, expectedVersion)
   * Menerima input kesepakatan dari pelanggan (UC05, KF02, KF10, KF11):
   * 1. Validasi input pada sisi server (KNF18)
   * 2. Inisialisasi objek via newKontrak() (ALGO-038) & makeKontrak() (ALGO-039)
   * 3. Set status awal 'Menunggu' (konfirmasi penyedia jasa) dengan batas waktu 30 menit (KF07, KNF11)
   * 4. Kunci penyedia jasa dengan Optimistic Locking (KNF04, KNF19) & simpan ke DB (ALGO-037, Q-017)
   * 5. Kirim notifikasi pesanan masuk ke penyedia jasa (KF06, KNF12)
   */
  public async kirimInput(
    detailPekerjaan: string,
    persetujuanHarga: number,
    idPelanggan: string,
    idPemberiJasa: string,
    expectedVersion?: number
  ): Promise<KontrakPekerjaan> {
    const validation = KontrakPekerjaan.validateKontrakInput(
      detailPekerjaan,
      persetujuanHarga
    );

    if (!validation.valid || !validation.sanitizedDetail || !validation.harga) {
      throw new KontrakError(
        validation.message || 'Input kesepakatan tidak valid',
        400,
        'INVALID_INPUT'
      );
    }

    if (!idPelanggan || typeof idPelanggan !== 'string') {
      throw new KontrakError(
        'Identitas pelanggan wajib disertakan',
        400,
        'MISSING_CUSTOMER_ID'
      );
    }

    if (!idPemberiJasa || typeof idPemberiJasa !== 'string') {
      throw new KontrakError(
        'Identitas penyedia jasa wajib disertakan',
        400,
        'MISSING_PROVIDER_ID'
      );
    }

    const objKontrak = new KontrakPekerjaan();

    // ALGO-038: newKontrak(dataKontrak)
    objKontrak.newKontrak({
      idPelanggan,
      idPemberiJasa,
      detailPekerjaan: validation.sanitizedDetail,
      persetujuanHarga: validation.harga,
    });

    // ALGO-039: makeKontrak()
    const isCreated = objKontrak.makeKontrak();
    if (!isCreated) {
      throw new KontrakError(
        'Gagal membuat kontrak pekerjaan: data tidak valid',
        400,
        'MAKE_KONTRAK_FAILED'
      );
    }

    // ALGO-036: Set status awal kontrak ke 'Menunggu' (menunggu konfirmasi penyedia jasa)
    await objKontrak.statusUpdate('statusPekerjaan', STATUS_PEKERJAAN.MENUNGGU);

    // ALGO-037 (Q-017) + KNF04 & KNF19: Simpan kontrak & kunci penyedia jasa dengan Optimistic Locking
    await objKontrak.saveNewKontrakWithOptimisticLock(expectedVersion);

    // KF06 & KNF12: Kirim notifikasi pesanan masuk ke penyedia jasa
    await this.notifikasiController.buatNotifikasi(
      idPemberiJasa,
      `Pesanan baru masuk: "${validation.sanitizedDetail}" dengan kesepakatan harga Rp ${validation.harga.toLocaleString(
        'id-ID'
      )}. Harap konfirmasi dalam 30 menit.`
    );

    return objKontrak;
  }

  /**
   * Penyedia jasa mengonfirmasi persetujuan kontrak (Terima / Tolak)
   * - Jika diterima: status berubah Menunggu -> On Progress, kunci penyedia jasa dengan Optimistic Locking (KNF04, KNF19, Q-016, Q-018)
   * - Jika ditolak: status berubah Menunggu -> Ditolak, lepaskan kunci ketersediaan penyedia jasa
   */
  public async konfirmasiPersetujuanPenyedia(
    idKontrakPekerjaan: string,
    idPemberiJasa: string,
    disetujui: boolean,
    expectedVersion?: number
  ): Promise<KontrakPekerjaan> {
    const kontrak = await this.getKontrakPekerjaan(idKontrakPekerjaan);
    if (!kontrak) {
      throw new KontrakError(
        'Kontrak pekerjaan tidak ditemukan',
        404,
        'CONTRACT_NOT_FOUND'
      );
    }

    if (kontrak.getIdPemberiJasa() !== idPemberiJasa) {
      throw new KontrakError(
        'Akses ditolak: Anda bukan penyedia jasa pada kontrak ini',
        403,
        'FORBIDDEN_PROVIDER'
      );
    }

    if (kontrak.getStatusPekerjaan() !== STATUS_PEKERJAAN.MENUNGGU) {
      throw new KontrakError(
        `Kontrak dengan status '${kontrak.getStatusPekerjaan()}' tidak dapat dikonfirmasi ulang`,
        400,
        'INVALID_STATE_TRANSITION'
      );
    }

    const expiresAt = kontrak.getExpiresAt();
    if (expiresAt && expiresAt.getTime() <= Date.now()) {
      await cancelExpiredContracts(new Date());
      throw new KontrakError(
        'Kontrak telah melewati batas waktu 30 menit dan dibatalkan secara otomatis',
        410,
        'CONTRACT_EXPIRED'
      );
    }

    const detail = kontrak.getDetailPekerjaan();

    if (disetujui) {
      const { kontrak: acceptedKontrak } =
        await kontrak.acceptKontrakWithOptimisticLock(expectedVersion);

      await this.notifikasiController.buatNotifikasi(
        detail.idPelanggan,
        `Penyedia jasa telah menyetujui kontrak "${detail.detailPekerjaan}". Status pekerjaan kini On Progress.`
      );

      return acceptedKontrak;
    } else {
      const rejectedKontrak = await kontrak.rejectKontrakAndUnlock();

      await this.notifikasiController.buatNotifikasi(
        detail.idPelanggan,
        `Penyedia jasa menolak kontrak "${detail.detailPekerjaan}". Silakan pilih penyedia jasa lainnya.`
      );

      return rejectedKontrak;
    }
  }

  /**
   * UC06 & KF12: Penyedia jasa menyelesaikan pekerjaan
   * - Validasi state transition: wajib dari 'On Progress' ke 'Menunggu Konfirmasi Pelanggan' (KNF22)
   * - Perbarui status via statusUpdate() (ALGO-036, Q-016)
   * - Kirim notifikasi ke pelanggan bahwa pekerjaan telah selesai (KNF20)
   */
  public async selesaikanPekerjaan(
    idKontrakPekerjaan: string,
    idPemberiJasa: string
  ): Promise<KontrakPekerjaan> {
    const kontrak = await this.getKontrakPekerjaan(idKontrakPekerjaan);
    if (!kontrak) {
      throw new KontrakError(
        'Kontrak pekerjaan tidak ditemukan',
        404,
        'CONTRACT_NOT_FOUND'
      );
    }

    if (kontrak.getIdPemberiJasa() !== idPemberiJasa) {
      throw new KontrakError(
        'Akses ditolak: Anda bukan penyedia jasa pada kontrak ini',
        403,
        'FORBIDDEN_PROVIDER'
      );
    }

    const currentStatus = kontrak.getStatusPekerjaan();
    if (
      !KontrakPekerjaan.isValidStateTransition(
        currentStatus,
        STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN
      )
    ) {
      throw new KontrakError(
        `Pekerjaan hanya dapat diselesaikan jika berstatus '${STATUS_PEKERJAAN.ON_PROGRESS}' (status saat ini: '${currentStatus}')`,
        400,
        'INVALID_STATE_TRANSITION'
      );
    }

    // ALGO-036 & Q-016: Update status ke 'Menunggu Konfirmasi Pelanggan'
    const isUpdated = await this.statusUpdate(
      idKontrakPekerjaan,
      STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN
    );

    if (!isUpdated) {
      throw new KontrakError(
        'Gagal memperbarui status penyelesaian pekerjaan',
        500,
        'UPDATE_FAILED'
      );
    }

    await kontrak.fetchKontrakPekerjaan(idKontrakPekerjaan);
    const detail = kontrak.getDetailPekerjaan();

    // KNF20: Kirim notifikasi ke pelanggan bahwa pekerjaan sudah selesai
    await this.notifikasiController.buatNotifikasi(
      detail.idPelanggan,
      `Pekerjaan "${detail.detailPekerjaan}" telah selesai dikerjakan oleh penyedia jasa. Mohon konfirmasi penyelesaian dan pembayaran sebesar Rp ${detail.persetujuanHarga.toLocaleString(
        'id-ID'
      )}.`
    );

    return kontrak;
  }

  /**
   * ALGO-042: konfirmasiPekerjaan(idKontrak)
   * Pelanggan mengonfirmasi penyelesaian pekerjaan & pembayaran (UC07, KF13, KNF21, KNF22):
   * - Verifikasi status aktif sebelumnya ('On Progress' atau 'Menunggu Konfirmasi Pelanggan') (KNF22)
   * - Ubah status kontrak menjadi 'Done' melalui Pengguna.konfirmasiPekerjaan() & KontrakPekerjaan.statusUpdate()
   * - Buka kembali kunci ketersediaan penyedia jasa ('Available')
   * - Kirim notifikasi ke penyedia jasa
   */
  public async konfirmasiPekerjaan(
    idKontrak: string,
    idPelanggan?: string
  ): Promise<boolean> {
    const kontrak = await this.getKontrakPekerjaan(idKontrak);
    if (!kontrak) {
      return false;
    }

    if (idPelanggan && kontrak.getIdPelanggan() !== idPelanggan) {
      throw new KontrakError(
        'Akses ditolak: Anda bukan pelanggan pemilik kontrak ini',
        403,
        'FORBIDDEN_CUSTOMER'
      );
    }

    const currentStatus = kontrak.getStatusPekerjaan();
    if (
      !KontrakPekerjaan.isValidStateTransition(
        currentStatus,
        STATUS_PEKERJAAN.DONE
      )
    ) {
      return false;
    }

    const pelanggan = new Pengguna({
      idPengguna: idPelanggan ?? kontrak.getIdPelanggan(),
    });

    const isConfirmed = await pelanggan.konfirmasiPekerjaan(idKontrak);
    if (!isConfirmed) {
      return false;
    }

    const detail = kontrak.getDetailPekerjaan();

    // KNF21: Kirim notifikasi konfirmasi selesai & pembayaran ke penyedia jasa
    await this.notifikasiController.buatNotifikasi(
      detail.idPemberiJasa,
      `Pelanggan telah mengonfirmasi penyelesaian pekerjaan "${detail.detailPekerjaan}" dan menyelesaikan pembayaran sebesar Rp ${detail.persetujuanHarga.toLocaleString(
        'id-ID'
      )}. Status pekerjaan kini Done.`
    );

    return true;
  }

  // ============================================================================
  // Express HTTP Handlers
  // ============================================================================

  public handleShowKontrakForm = (_req: Request, res: Response): void => {
    const formTemplate = this.showKontrakForm();
    res.status(200).json({
      success: true,
      data: formTemplate,
    });
  };

  public handleKirimInput = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        detailPekerjaan,
        persetujuanHarga,
        idPemberiJasa,
        version,
        expectedVersion,
      } = req.body;

      const idPelanggan = req.user?.idPengguna || req.body.idPelanggan;
      const parsedExpectedVersion =
        expectedVersion !== undefined
          ? Number(expectedVersion)
          : version !== undefined
          ? Number(version)
          : undefined;

      if (
        parsedExpectedVersion !== undefined &&
        (!Number.isInteger(parsedExpectedVersion) || parsedExpectedVersion < 1)
      ) {
        res.status(400).json({
          success: false,
          code: 'INVALID_VERSION',
          message: 'Parameter version untuk Optimistic Locking harus berupa bilangan bulat positif',
        });
        return;
      }

      const kontrak = await this.kirimInput(
        detailPekerjaan,
        persetujuanHarga,
        idPelanggan,
        idPemberiJasa,
        parsedExpectedVersion
      );

      res.status(201).json({
        success: true,
        message: 'Kontrak pekerjaan berhasil dibuat dengan status Menunggu konfirmasi penyedia jasa',
        data: kontrak.getDetailPekerjaan(),
      });
    } catch (error) {
      this.handleErrorResponse(res, error);
    }
  };

  public handleGetKontrakById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = String(req.params.id || '');
      const kontrak = await this.getKontrakPekerjaan(id);

      if (!kontrak) {
        res.status(404).json({
          success: false,
          code: 'CONTRACT_NOT_FOUND',
          message: 'Kontrak pekerjaan tidak ditemukan',
        });
        return;
      }

      const detail = kontrak.getDetailPekerjaan();
      if (
        req.user &&
        req.user.role !== 'LAYANAN_PELANGGAN' &&
        req.user.idPengguna !== detail.idPelanggan &&
        req.user.idPengguna !== detail.idPemberiJasa
      ) {
        res.status(403).json({
          success: false,
          code: 'FORBIDDEN_ACCESS',
          message: 'Akses ditolak: Anda tidak terlibat dalam kontrak pekerjaan ini',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: detail,
      });
    } catch (error) {
      this.handleErrorResponse(res, error);
    }
  };

  public handleGetDaftarKontrak = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.idPengguna;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Pengguna belum terautentikasi',
        });
        return;
      }

      const statusFilter =
        typeof req.query.status === 'string' && req.query.status.trim() !== ''
          ? req.query.status.trim()
          : undefined;

      const list = await prisma.kontrakPekerjaan.findMany({
        where: {
          OR: [{ idPelanggan: userId }, { idPemberiJasa: userId }],
          ...(statusFilter ? { statusPekerjaan: statusFilter } : {}),
        },
        include: {
          pelanggan: {
            select: {
              idPengguna: true,
              namaPengguna: true,
              username: true,
              avatarUrl: true,
              akumulasiRating: true,
            },
          },
          pemberiJasa: {
            select: {
              idPemberiJasa: true,
              namaToko: true,
              jenisJasa: true,
              statusKetersediaan: true,
              version: true,
              pengguna: {
                select: {
                  namaPengguna: true,
                  avatarUrl: true,
                  akumulasiRating: true,
                },
              },
            },
          },
          rating: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: list,
      });
    } catch (error) {
      this.handleErrorResponse(res, error);
    }
  };

  public handleKonfirmasiPersetujuan = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = String(req.params.id || '');
      const idPemberiJasa = req.user?.idPengguna || req.body.idPemberiJasa;
      const { disetujui, aksi, version, expectedVersion } = req.body;

      let isApproved: boolean;
      if (typeof disetujui === 'boolean') {
        isApproved = disetujui;
      } else if (typeof aksi === 'string') {
        const normalizedAksi = aksi.trim().toLowerCase();
        if (normalizedAksi === 'terima' || normalizedAksi === 'accept') {
          isApproved = true;
        } else if (normalizedAksi === 'tolak' || normalizedAksi === 'reject') {
          isApproved = false;
        } else {
          res.status(400).json({
            success: false,
            code: 'INVALID_ACTION',
            message: 'Nilai aksi harus berupa "terima" atau "tolak" (atau boolean disetujui)',
          });
          return;
        }
      } else {
        res.status(400).json({
          success: false,
          code: 'MISSING_APPROVAL_DECISION',
          message: 'Parameter disetujui (boolean) atau aksi ("terima" | "tolak") wajib diisi',
        });
        return;
      }

      const parsedExpectedVersion =
        expectedVersion !== undefined
          ? Number(expectedVersion)
          : version !== undefined
          ? Number(version)
          : undefined;

      if (
        parsedExpectedVersion !== undefined &&
        (!Number.isInteger(parsedExpectedVersion) || parsedExpectedVersion < 1)
      ) {
        res.status(400).json({
          success: false,
          code: 'INVALID_VERSION',
          message: 'Parameter version untuk Optimistic Locking harus berupa bilangan bulat positif',
        });
        return;
      }

      const updatedKontrak = await this.konfirmasiPersetujuanPenyedia(
        id,
        idPemberiJasa,
        isApproved,
        parsedExpectedVersion
      );

      res.status(200).json({
        success: true,
        message: isApproved
          ? 'Kontrak disetujui. Status pekerjaan berubah menjadi On Progress.'
          : 'Kontrak ditolak dan kunci ketersediaan penyedia jasa telah dilepaskan.',
        data: updatedKontrak.getDetailPekerjaan(),
      });
    } catch (error) {
      this.handleErrorResponse(res, error);
    }
  };

  public handleTerimaKontrak = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    req.body = { ...req.body, disetujui: true };
    await this.handleKonfirmasiPersetujuan(req, res);
  };

  public handleTolakKontrak = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    req.body = { ...req.body, disetujui: false };
    await this.handleKonfirmasiPersetujuan(req, res);
  };

  public handleSelesaikanPekerjaan = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = String(req.params.id || '');
      const idPemberiJasa = req.user?.idPengguna || req.body.idPemberiJasa;

      const updatedKontrak = await this.selesaikanPekerjaan(id, idPemberiJasa);

      res.status(200).json({
        success: true,
        message:
          'Pekerjaan ditandai selesai. Status berubah menjadi Menunggu Konfirmasi Pelanggan dan notifikasi telah dikirim.',
        data: updatedKontrak.getDetailPekerjaan(),
      });
    } catch (error) {
      this.handleErrorResponse(res, error);
    }
  };

  public handleKonfirmasiPekerjaan = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = String(req.params.id || '');
      const idPelanggan = req.user?.idPengguna || req.body.idPelanggan;

      const existing = await this.getKontrakPekerjaan(id);
      if (!existing) {
        res.status(404).json({
          success: false,
          code: 'CONTRACT_NOT_FOUND',
          message: 'Kontrak pekerjaan tidak ditemukan',
        });
        return;
      }

      if (idPelanggan && existing.getIdPelanggan() !== idPelanggan) {
        res.status(403).json({
          success: false,
          code: 'FORBIDDEN_CUSTOMER',
          message: 'Akses ditolak: Anda bukan pelanggan pemilik kontrak ini',
        });
        return;
      }

      const currentStatus = existing.getStatusPekerjaan();
      if (
        !KontrakPekerjaan.isValidStateTransition(
          currentStatus,
          STATUS_PEKERJAAN.DONE
        )
      ) {
        res.status(400).json({
          success: false,
          code: 'INVALID_STATE_TRANSITION',
          message: `Konfirmasi penyelesaian gagal: status kontrak saat ini adalah '${currentStatus}' (harus '${STATUS_PEKERJAAN.MENUNGGU_KONFIRMASI_PELANGGAN}' atau '${STATUS_PEKERJAAN.ON_PROGRESS}')`,
        });
        return;
      }

      const isConfirmed = await this.konfirmasiPekerjaan(id, idPelanggan);
      if (!isConfirmed) {
        res.status(400).json({
          success: false,
          code: 'CONFIRMATION_FAILED',
          message: 'Gagal mengonfirmasi pekerjaan',
        });
        return;
      }

      const updated = await this.getKontrakPekerjaan(id);

      res.status(200).json({
        success: true,
        message:
          'Penyelesaian pekerjaan dan pembayaran berhasil dikonfirmasi. Status pekerjaan kini Done dan penyedia jasa kembali Available.',
        data: updated?.getDetailPekerjaan(),
      });
    } catch (error) {
      this.handleErrorResponse(res, error);
    }
  };

  private handleErrorResponse(res: Response, error: unknown): void {
    if (error instanceof KontrakError) {
      res.status(error.statusCode).json({
        success: false,
        code: error.code,
        message: error.message,
      });
      return;
    }

    const message =
      error instanceof Error
        ? error.message
        : 'Terjadi kesalahan internal pada server';
    res.status(500).json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message,
    });
  }
}

export const kontrakPekerjaanController = new KontrakPekerjaanController();
export default KontrakPekerjaanController;
