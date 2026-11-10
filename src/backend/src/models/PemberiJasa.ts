import { randomUUID } from 'crypto';
import { Role } from '@prisma/client';
import { prisma } from '../database/prisma';
import { Pengguna, PenggunaProps } from './Pengguna';

export interface PemberiJasaDetail {
  idPemberiJasa: string;
  namaPengguna: string;
  namaToko: string;
  nomorTelpon: string;
  email: string;
  role?: string;
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

export interface PemberiJasaProps extends PenggunaProps {
  namaToko?: string;
  idKategoriJasa?: string | null;
  jenisJasa?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  statusKetersediaan?: string;
  isOnline?: boolean;
}

export interface CreatePemberiJasaInput {
  namaPengguna: string;
  username: string;
  email: string;
  nomorTelepon: string;
  passwordHash: string;
  idKategoriJasa?: string | null;
  jenisJasa: string;
  namaToko?: string;
  latitude?: number | null;
  longitude?: number | null;
  avatarUrl?: string | null;
}

export class PemberiJasa extends Pengguna {
  private idPemberiJasa: string = '';
  public idKategoriJasa: string = '';
  public jenisJasa: string = '';
  private namaToko: string = '';
  private latitude: number | null = null;
  private longitude: number | null = null;
  private statusKetersediaan: string = 'Available';
  private isOnline: boolean = true;
  private dataPemberiJasa: PemberiJasaDetail | null = null;

  // Constructor overloading: Mendukung pemanggilan model OOP (HEAD) maupun service instantiation (develop)
  constructor();
  constructor(props: PemberiJasaProps);
  constructor(idPemberiJasa?: string, idKategoriJasa?: string, jenisJasa?: string);
  constructor(
    propsOrId?: PemberiJasaProps | string,
    idKategoriJasa?: string,
    jenisJasa?: string
  ) {
    if (typeof propsOrId === 'object' && propsOrId !== null) {
      super({
        ...propsOrId,
        role: Role.PEMBERI_JASA,
        akumulasiRating: propsOrId.akumulasiRating ?? 0.0,
        riwayatRating: propsOrId.riwayatRating ?? [],
      });
      this.idPemberiJasa = propsOrId.idPengguna || '';
      this.namaToko = propsOrId.namaToko ?? '';
      this.idKategoriJasa = propsOrId.idKategoriJasa ?? '';
      this.jenisJasa = propsOrId.jenisJasa ?? '';
      this.latitude = propsOrId.latitude ?? null;
      this.longitude = propsOrId.longitude ?? null;
      this.statusKetersediaan = propsOrId.statusKetersediaan ?? 'Available';
      this.isOnline = propsOrId.isOnline ?? true;
    } else {
      const id = typeof propsOrId === 'string' ? propsOrId : '';
      super({
        idPengguna: id,
        nomorTelepon: '',
        email: '',
        namaPengguna: '',
        username: '',
        passwordHash: '',
        role: Role.PEMBERI_JASA,
        akumulasiRating: 0.0,
        riwayatRating: [],
      });
      this.idPemberiJasa = id;
      this.idKategoriJasa = idKategoriJasa ?? '';
      this.jenisJasa = jenisJasa ?? '';
      this.namaToko = '';
      this.latitude = null;
      this.longitude = null;
      this.statusKetersediaan = 'Available';
      this.isOnline = true;
    }
  }

  // ==================== GETTERS & SETTERS ====================
  public getIDPemberiJasa(): string {
    return this.idPemberiJasa || this.idPengguna;
  }

  public setIDPemberiJasa(idPemberiJasa: string): void {
    this.idPemberiJasa = idPemberiJasa;
    this.idPengguna = idPemberiJasa;
  }

  public getIDKategoriJasa(): string {
    return this.idKategoriJasa;
  }

  public setIDKategoriJasa(idKategoriJasa: string): void {
    this.idKategoriJasa = idKategoriJasa;
  }

  public getIdKategoriJasa(): string | null {
    return this.idKategoriJasa || null;
  }

  public getJenisJasa(): string | null {
    return this.jenisJasa || null;
  }

  public getNamaToko(): string {
    return this.namaToko;
  }

  public getStatusKetersediaan(): string {
    return this.statusKetersediaan;
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  // ==================== REGISTRATION & PERSISTENCE (HEAD) ====================
  public static makePemberiJasa(input: CreatePemberiJasaInput): PemberiJasa {
    return new PemberiJasa({
      idPengguna: randomUUID(),
      namaPengguna: input.namaPengguna.trim(),
      username: input.username.trim(),
      email: input.email.trim().toLowerCase(),
      nomorTelepon: input.nomorTelepon.trim(),
      passwordHash: input.passwordHash,
      role: Role.PEMBERI_JASA,
      avatarUrl: input.avatarUrl ?? null,
      akumulasiRating: 0.0,
      riwayatRating: [],
      namaToko: (input.namaToko ?? input.namaPengguna).trim(),
      idKategoriJasa: input.idKategoriJasa ? input.idKategoriJasa.trim() : null,
      jenisJasa: input.jenisJasa.trim(),
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      statusKetersediaan: 'Available',
      isOnline: true,
    });
  }

  public async simpanKeDb(): Promise<PemberiJasa> {
    const result = await prisma.$transaction(async (tx) => {
      const penggunaRecord = await tx.pengguna.create({
        data: {
          idPengguna: this.idPengguna,
          namaPengguna: this.namaPengguna,
          username: this.username,
          email: this.email,
          nomorTelpon: this.nomorTelepon,
          password: this.passwordHash,
          role: Role.PEMBERI_JASA,
          avatarUrl: this.avatarUrl,
          akumulasiRating: 0.0,
          riwayatRating: [],
        },
      });

      let resolvedIdKategori: string | null = this.idKategoriJasa || null;
      if (resolvedIdKategori) {
        const existingKategori = await tx.kategoriJasa.findUnique({
          where: { idKategoriJasa: resolvedIdKategori },
        });

        if (!existingKategori) {
          await tx.kategoriJasa.create({
            data: {
              idKategoriJasa: resolvedIdKategori,
              jenisJasa: this.jenisJasa || 'Umum',
              deskripsiJasa: `Layanan ${this.jenisJasa || 'Umum'}`,
              tarif: 0,
              jamKerja: '08:00 - 17:00',
              daerahKerja: 'Bandung',
            },
          });
        }
      }

      const pemberiJasaRecord = await tx.pemberiJasa.create({
        data: {
          idPemberiJasa: penggunaRecord.idPengguna,
          namaToko: this.namaToko || '',
          idKategoriJasa: resolvedIdKategori,
          jenisJasa: this.jenisJasa || null,
          latitude: this.latitude,
          longitude: this.longitude,
          statusKetersediaan: this.statusKetersediaan,
          isOnline: this.isOnline,
        },
      });

      return { penggunaRecord, pemberiJasaRecord };
    });

    return new PemberiJasa({
      idPengguna: result.penggunaRecord.idPengguna,
      namaPengguna: result.penggunaRecord.namaPengguna,
      username: result.penggunaRecord.username,
      email: result.penggunaRecord.email,
      nomorTelepon: result.penggunaRecord.nomorTelpon,
      passwordHash: result.penggunaRecord.password,
      role: result.penggunaRecord.role,
      avatarUrl: result.penggunaRecord.avatarUrl,
      akumulasiRating: result.penggunaRecord.akumulasiRating,
      riwayatRating: result.penggunaRecord.riwayatRating,
      namaToko: result.pemberiJasaRecord.namaToko,
      idKategoriJasa: result.pemberiJasaRecord.idKategoriJasa,
      jenisJasa: result.pemberiJasaRecord.jenisJasa,
      latitude: result.pemberiJasaRecord.latitude,
      longitude: result.pemberiJasaRecord.longitude,
      statusKetersediaan: result.pemberiJasaRecord.statusKetersediaan,
      isOnline: result.pemberiJasaRecord.isOnline,
    });
  }

  // ==================== QUERY & SERVICE METHODS (DEVELOP) ====================
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
      role: row.pengguna.role,
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
      role: row.pengguna.role,
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

    const pengguna = await prisma.pengguna.findUnique({
      where: { idPengguna: targetIdPemberiJasa },
    });

    if (!pengguna) {
      throw new Error('Pengguna tidak ditemukan');
    }

    if (pengguna.role === Role.LAYANAN_PELANGGAN) {
      throw new Error('Akun layanan pelanggan tidak dapat didaftarkan sebagai penyedia jasa');
    }

    this.idPemberiJasa = targetIdPemberiJasa;
    this.idKategoriJasa = targetIdKategoriJasa;
    this.jenisJasa = kategori.jenisJasa;

    await prisma.$transaction([
      prisma.pemberiJasa.upsert({
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
      }),
      prisma.pengguna.update({
        where: { idPengguna: targetIdPemberiJasa },
        data: { role: Role.PEMBERI_JASA },
      }),
    ]);

    return this.getPemberiJasaByID(targetIdPemberiJasa);
  }

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
      role: row.pengguna.role,
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

  // ==================== DATA SANITIZATION ====================
  public override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      idPemberiJasa: this.idPemberiJasa || this.idPengguna,
      namaToko: this.namaToko,
      idKategoriJasa: this.idKategoriJasa,
      jenisJasa: this.jenisJasa,
      latitude: this.latitude,
      longitude: this.longitude,
      statusKetersediaan: this.statusKetersediaan,
      isOnline: this.isOnline,
    };
  }
}

export default PemberiJasa;