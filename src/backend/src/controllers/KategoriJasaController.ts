import { Request, Response } from 'express';
import { KategoriJasa, KategoriJasaInput, KategoriJasaRecord } from '../models/KategoriJasa';
import { PemberiJasaController } from './PemberiJasaController';
import { PemberiJasaDetail } from '../models/PemberiJasa';

export interface SubmitKategoriJasaPayload extends KategoriJasaInput {
  idPemberiJasa?: string;
  namaToko?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Kelas C15 - KategoriJasaController
 * Mengatur logika program kategori jasa dan pendaftaran layanan (UC01, UC02)
 */
export class KategoriJasaController {
  private kategoriJasa: KategoriJasa;
  private pemberiJasaController: PemberiJasaController;
  private lastSavedStatus: boolean = false;

  constructor(
    kategoriJasaModel?: KategoriJasa,
    pemberiJasaCtrl?: PemberiJasaController
  ) {
    this.kategoriJasa = kategoriJasaModel ?? new KategoriJasa();
    this.pemberiJasaController = pemberiJasaCtrl ?? new PemberiJasaController();
  }

  /**
   * ALGO-032: Menyiapkan struktur data kosong untuk formulir pendaftaran kategori jasa
   */
  public showFormKategoriJasa(): KategoriJasaInput {
    return {
      jenisJasa: '',
      deskripsiJasa: '',
      tarif: 0,
      jamKerja: '',
      daerahKerja: '',
    };
  }

  /**
   * ALGO-033: Memvalidasi kelengkapan data kategori jasa serta memastikan tarif bernilai >= 0
   * Menolak tarif negatif atau field kosong
   */
  public validateKategoriJasa(dataJasa: Partial<KategoriJasaInput> | null | undefined): boolean {
    if (!dataJasa || typeof dataJasa !== 'object') {
      return false;
    }

    const { jenisJasa, deskripsiJasa, tarif, jamKerja, daerahKerja } = dataJasa;

    // Pastikan semua field teks ada dan tidak kosong
    if (
      typeof jenisJasa !== 'string' ||
      jenisJasa.trim() === '' ||
      typeof deskripsiJasa !== 'string' ||
      deskripsiJasa.trim() === '' ||
      typeof jamKerja !== 'string' ||
      jamKerja.trim() === '' ||
      typeof daerahKerja !== 'string' ||
      daerahKerja.trim() === ''
    ) {
      return false;
    }

    // Pastikan tarif ada, bertipe angka yang valid, dan tidak negatif
    if (
      tarif === null ||
      tarif === undefined ||
      (typeof tarif === 'string' && (tarif as string).trim() === '') ||
      typeof tarif !== 'number' ||
      Number.isNaN(tarif) ||
      !Number.isFinite(tarif) ||
      tarif < 0
    ) {
      return false;
    }

    return true;
  }

  /**
   * ALGO-035: Menghubungkan ID kategori jasa yang baru dibuat ke data pemberi jasa
   */
  public async updateDataPemberiJasa(
    idKategoriJasa: string,
    idPemberiJasa?: string,
    extraData?: { namaToko?: string; latitude?: number; longitude?: number }
  ): Promise<PemberiJasaDetail | null> {
    return await this.pemberiJasaController.setInformasiKategoriJasa(
      idKategoriJasa,
      idPemberiJasa,
      extraData
    );
  }

  /**
   * ALGO-034: Memvalidasi masukan form, menyimpan kategori jasa baru,
   * dan memperbarui data pemberi jasa jika idPemberiJasa disertakan
   */
  public async submitFormKategoriJasa(dataJasa: SubmitKategoriJasaPayload): Promise<{
    kategori: KategoriJasaRecord;
    pemberiJasa: PemberiJasaDetail | null;
  }> {
    const isValid = this.validateKategoriJasa(dataJasa);
    if (!isValid) {
      this.lastSavedStatus = false;
      throw new Error('Data kategori jasa tidak valid: pastikan seluruh field terisi dan tarif tidak negatif');
    }

    const savedKategori = await this.kategoriJasa.saveKategoriJasa({
      idKategoriJasa: dataJasa.idKategoriJasa,
      jenisJasa: dataJasa.jenisJasa,
      deskripsiJasa: dataJasa.deskripsiJasa,
      tarif: dataJasa.tarif,
      jamKerja: dataJasa.jamKerja,
      daerahKerja: dataJasa.daerahKerja,
    });

    let updatedPemberiJasa: PemberiJasaDetail | null = null;
    if (dataJasa.idPemberiJasa && dataJasa.idPemberiJasa.trim() !== '') {
      updatedPemberiJasa = await this.updateDataPemberiJasa(
        savedKategori.idKategoriJasa,
        dataJasa.idPemberiJasa.trim(),
        {
          namaToko: dataJasa.namaToko,
          latitude: dataJasa.latitude,
          longitude: dataJasa.longitude,
        }
      );
    }

    this.lastSavedStatus = true;
    return {
      kategori: savedKategori,
      pemberiJasa: updatedPemberiJasa,
    };
  }

  /**
   * Mengonfirmasi bahwa data kategori jasa telah berhasil tersimpan
   */
  public confirmDataTersimpan(): boolean {
    return this.lastSavedStatus;
  }

  /**
   * Mengambil seluruh daftar kategori jasa terurut alfabetis (ALGO-031 / Q-015)
   */
  public async fetchAllKategoriJasa(): Promise<KategoriJasaRecord[]> {
    return await this.kategoriJasa.getAllKategori();
  }

  /**
   * Mengambil detail kategori jasa berdasarkan ID
   */
  public async fetchKategoriJasaById(idKategoriJasa: string): Promise<KategoriJasaRecord | null> {
    if (!idKategoriJasa || idKategoriJasa.trim() === '') {
      return null;
    }
    return await this.kategoriJasa.getKategoriById(idKategoriJasa.trim());
  }

  /**
   * Menyaring daftar kategori jasa berdasarkan kriteria kata kunci
   */
  public async filterKategoriJasa(kriteria: string): Promise<KategoriJasaRecord[]> {
    const allKategori = await this.kategoriJasa.getAllKategori();
    if (!kriteria || kriteria.trim() === '') {
      return allKategori;
    }
    const q = kriteria.trim().toLowerCase();
    return allKategori.filter(
      (item) =>
        item.jenisJasa.toLowerCase().includes(q) ||
        item.deskripsiJasa.toLowerCase().includes(q) ||
        item.daerahKerja.toLowerCase().includes(q)
    );
  }

  /**
   * Express Handler: GET /api/services/categories
   */
  public getAllCategoriesHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.fetchAllKategoriJasa();
      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Gagal mengambil daftar kategori jasa',
      });
    }
  };

  /**
   * Express Handler: GET /api/services/categories/:id
   */
  public getCategoryByIdHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await this.fetchKategoriJasaById(id);

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Kategori jasa tidak ditemukan',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Gagal mengambil detail kategori jasa',
      });
    }
  };

  /**
   * Express Handler: POST /api/services/categories (atau POST /api/services/register)
   */
  public createCategoryAndBindServiceHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: SubmitKategoriJasaPayload = {
        idKategoriJasa: req.body.idKategoriJasa,
        jenisJasa: req.body.jenisJasa,
        deskripsiJasa: req.body.deskripsiJasa,
        tarif: typeof req.body.tarif === 'string' && req.body.tarif.trim() !== ''
          ? Number(req.body.tarif)
          : req.body.tarif,
        jamKerja: req.body.jamKerja,
        daerahKerja: req.body.daerahKerja,
        idPemberiJasa: req.body.idPemberiJasa,
        namaToko: req.body.namaToko,
        latitude: req.body.latitude !== undefined ? Number(req.body.latitude) : undefined,
        longitude: req.body.longitude !== undefined ? Number(req.body.longitude) : undefined,
      };

      if (!this.validateKategoriJasa(payload)) {
        res.status(400).json({
          success: false,
          message: 'Data kategori jasa tidak valid: semua field wajib diisi dan tarif tidak boleh negatif',
        });
        return;
      }

      const result = await this.submitFormKategoriJasa(payload);
      res.status(201).json({
        success: true,
        message: 'Pendaftaran kategori layanan jasa berhasil disimpan',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Gagal menyimpan kategori layanan jasa',
      });
    }
  };
}

export default KategoriJasaController;