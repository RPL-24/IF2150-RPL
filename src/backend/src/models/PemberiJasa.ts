import prisma from '../database/prisma';

export interface PemberiJasaDetail {
  idPemberiJasa: string;
  namaPengguna: string;
  namaToko: string;
  nomorTelpon: string;
  email: string;
  avatarUrl: string | null;
  akumulasiRating: number;
  idKategoriJasa: string | null;
  jenisJasa: string | null;
  deskripsiJasa: string | null;
  tarif: number | null;
  jamKerja: string | null;
  daerahKerja: string | null;
  latitude: number | null;
  longitude: number | null;
  statusKetersediaan: string;
  isOnline: boolean;
  jarakKm?: number | null;
}

export interface SearchServiceFilter {
  keyword?: string;
  idKategoriJasa?: string;
}

/**
 * Kelas C04 - PemberiJasa
 * Menyimpan titik lokasi, akumulasi rating, identitas pemberi jasa, dan kategori keahlian (UC01, UC02)
 */
export class PemberiJasa {
  private idPemberiJasa: string = '';
  public idKategoriJasa: string = '';
  public jenisJasa: string = '';
  private dataPemberiJasa: PemberiJasaDetail | null = null;

  constructor(idPemberiJasa?: string, idKategoriJasa?: string, jenisJasa?: string) {
    if (idPemberiJasa) this.idPemberiJasa = idPemberiJasa;
    if (idKategoriJasa) this.idKategoriJasa = idKategoriJasa;
    if (jenisJasa) this.jenisJasa = jenisJasa;
  }

  public getIDPemberiJasa(): string {
    return this.idPemberiJasa;
  }

  public setIDPemberiJasa(idPemberiJasa: string): void {
    this.idPemberiJasa = idPemberiJasa;
  }

  public getIDKategoriJasa(): string {
    return this.idKategoriJasa;
  }

  public setIDKategoriJasa(idKategoriJasa: string): void {
    this.idKategoriJasa = idKategoriJasa;
  }

  /**
   * ALGO-002 & Q-002: Mengambil detail profil, lokasi/daerah kerja, rating, dan tarif Pemberi Jasa berdasarkan ID
   * Query:
   * SELECT pj.id_pemberi_jasa, u.nama_pengguna, u.nomor_telpon, u.email, u.akumulasi_rating,
   *        pj.id_kategori_jasa, pj.jenis_jasa, kj.deskripsi_jasa, kj.tarif, kj.jam_kerja, kj.daerah_kerja
   * FROM pemberi_jasa pj
   * JOIN pengguna u ON pj.id_pemberi_jasa = u.id_pengguna
   * LEFT JOIN kategori_jasa kj ON pj.id_kategori_jasa = kj.id_kategori_jasa
   * WHERE pj.id_pemberi_jasa = $1;
   */
  public async getPemberiJasaByID(idPemberiJasa: string): Promise<PemberiJasaDetail | null> {
    const row = await prisma.pemberiJasa.findUnique({
      where: { idPemberiJasa },
      include: {
        pengguna: true,
        kategoriJasa: true,
      },
    });

    if (!row) {
      this.dataPemberiJasa = null;
      return null;
    }

    const formatted: PemberiJasaDetail = {
      idPemberiJasa: row.idPemberiJasa,
      namaPengguna: row.pengguna.namaPengguna,
      namaToko: row.namaToko,
      nomorTelpon: row.pengguna.nomorTelpon,
      email: row.pengguna.email,
      avatarUrl: row.pengguna.avatarUrl,
      akumulasiRating: row.pengguna.akumulasiRating,
      idKategoriJasa: row.idKategoriJasa,
      jenisJasa: row.jenisJasa ?? row.kategoriJasa?.jenisJasa ?? null,
      deskripsiJasa: row.kategoriJasa?.deskripsiJasa ?? null,
      tarif: row.kategoriJasa?.tarif ?? null,
      jamKerja: row.kategoriJasa?.jamKerja ?? null,
      daerahKerja: row.kategoriJasa?.daerahKerja ?? null,
      latitude: row.latitude,
      longitude: row.longitude,
      statusKetersediaan: row.statusKetersediaan,
      isOnline: row.isOnline,
    };

    this.dataPemberiJasa = formatted;
    return formatted;
  }

  /**
   * ALGO-003 & Q-003: Mengambil daftar Pemberi Jasa yang tersedia berdasarkan ID Kategori Jasa
   * Query:
   * SELECT pj.id_pemberi_jasa, u.nama_pengguna, u.akumulasi_rating, pj.id_kategori_jasa, pj.jenis_jasa
   * FROM pemberi_jasa pj
   * JOIN pengguna u ON pj.id_pemberi_jasa = u.id_pengguna
   * WHERE pj.id_kategori_jasa = $1;
   */
  public async getPemberiJasaByKategori(idKategoriJasa: string): Promise<PemberiJasaDetail[]> {
    const rows = await prisma.pemberiJasa.findMany({
      where: { idKategoriJasa },
      include: {
        pengguna: true,
        kategoriJasa: true,
      },
    });

    return rows.map((row) => ({
      idPemberiJasa: row.idPemberiJasa,
      namaPengguna: row.pengguna.namaPengguna,
      namaToko: row.namaToko,
      nomorTelpon: row.pengguna.nomorTelpon,
      email: row.pengguna.email,
      avatarUrl: row.pengguna.avatarUrl,
      akumulasiRating: row.pengguna.akumulasiRating,
      idKategoriJasa: row.idKategoriJasa,
      jenisJasa: row.jenisJasa ?? row.kategoriJasa?.jenisJasa ?? null,
      deskripsiJasa: row.kategoriJasa?.deskripsiJasa ?? null,
      tarif: row.kategoriJasa?.tarif ?? null,
      jamKerja: row.kategoriJasa?.jamKerja ?? null,
      daerahKerja: row.kategoriJasa?.daerahKerja ?? null,
      latitude: row.latitude,
      longitude: row.longitude,
      statusKetersediaan: row.statusKetersediaan,
      isOnline: row.isOnline,
    }));
  }

  /**
   * ALGO-004 & Q-004: Memperbarui data kategori jasa dan jenis jasa pada tabel pemberi_jasa
   * Query:
   * UPDATE pemberi_jasa
   * SET id_kategori_jasa = $1,
   *     jenis_jasa = (SELECT jenis_jasa FROM kategori_jasa WHERE id_kategori_jasa = $1)
   * WHERE id_pemberi_jasa = $2;
   */
  public async savePemberiJasa(
    idPemberiJasa?: string,
    idKategoriJasa?: string,
    extraData?: { namaToko?: string; latitude?: number; longitude?: number }
  ): Promise<PemberiJasaDetail | null> {
    const targetIdPemberiJasa = idPemberiJasa || this.idPemberiJasa;
    const targetIdKategoriJasa = idKategoriJasa || this.idKategoriJasa;

    if (!targetIdPemberiJasa || !targetIdKategoriJasa) {
      throw new Error('idPemberiJasa dan idKategoriJasa wajib diisi');
    }

    const kategori = await prisma.kategoriJasa.findUnique({
      where: { idKategoriJasa: targetIdKategoriJasa },
    });

    if (!kategori) {
      throw new Error('Kategori jasa tidak ditemukan');
    }

    this.idPemberiJasa = targetIdPemberiJasa;
    this.idKategoriJasa = targetIdKategoriJasa;
    this.jenisJasa = kategori.jenisJasa;

    await prisma.pemberiJasa.upsert({
      where: { idPemberiJasa: targetIdPemberiJasa },
      update: {
        idKategoriJasa: targetIdKategoriJasa,
        jenisJasa: kategori.jenisJasa,
        ...(extraData?.namaToko !== undefined ? { namaToko: extraData.namaToko } : {}),
        ...(extraData?.latitude !== undefined ? { latitude: extraData.latitude } : {}),
        ...(extraData?.longitude !== undefined ? { longitude: extraData.longitude } : {}),
      },
      create: {
        idPemberiJasa: targetIdPemberiJasa,
        idKategoriJasa: targetIdKategoriJasa,
        jenisJasa: kategori.jenisJasa,
        namaToko: extraData?.namaToko ?? '',
        latitude: extraData?.latitude ?? null,
        longitude: extraData?.longitude ?? null,
      },
    });

    return this.getPemberiJasaByID(targetIdPemberiJasa);
  }

  /**
   * Mengambil daftar Pemberi Jasa dengan filter kata kunci dan/atau ID kategori
   * Digunakan oleh endpoint GET /api/services/search
   */
  public async searchPemberiJasa(filter: SearchServiceFilter): Promise<PemberiJasaDetail[]> {
    const { keyword, idKategoriJasa } = filter;

    const rows = await prisma.pemberiJasa.findMany({
      where: {
        ...(idKategoriJasa ? { idKategoriJasa } : {}),
        ...(keyword && keyword.trim() !== ''
          ? {
              OR: [
                { jenisJasa: { contains: keyword.trim(), mode: 'insensitive' } },
                { namaToko: { contains: keyword.trim(), mode: 'insensitive' } },
                {
                  pengguna: {
                    namaPengguna: { contains: keyword.trim(), mode: 'insensitive' },
                  },
                },
                {
                  kategoriJasa: {
                    OR: [
                      { jenisJasa: { contains: keyword.trim(), mode: 'insensitive' } },
                      { deskripsiJasa: { contains: keyword.trim(), mode: 'insensitive' } },
                      { daerahKerja: { contains: keyword.trim(), mode: 'insensitive' } },
                    ],
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        pengguna: true,
        kategoriJasa: true,
      },
    });

    return rows.map((row) => ({
      idPemberiJasa: row.idPemberiJasa,
      namaPengguna: row.pengguna.namaPengguna,
      namaToko: row.namaToko,
      nomorTelpon: row.pengguna.nomorTelpon,
      email: row.pengguna.email,
      avatarUrl: row.pengguna.avatarUrl,
      akumulasiRating: row.pengguna.akumulasiRating,
      idKategoriJasa: row.idKategoriJasa,
      jenisJasa: row.jenisJasa ?? row.kategoriJasa?.jenisJasa ?? null,
      deskripsiJasa: row.kategoriJasa?.deskripsiJasa ?? null,
      tarif: row.kategoriJasa?.tarif ?? null,
      jamKerja: row.kategoriJasa?.jamKerja ?? null,
      daerahKerja: row.kategoriJasa?.daerahKerja ?? null,
      latitude: row.latitude,
      longitude: row.longitude,
      statusKetersediaan: row.statusKetersediaan,
      isOnline: row.isOnline,
    }));
  }
}

export default PemberiJasa;