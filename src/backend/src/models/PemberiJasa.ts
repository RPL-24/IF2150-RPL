import { randomUUID } from 'crypto';
import { Role } from '@prisma/client';
import { prisma } from '../database/prisma';
import { Pengguna, PenggunaProps } from './Pengguna';

export interface PemberiJasaProps extends PenggunaProps {
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
    private idKategoriJasa: string | null;
    private jenisJasa: string | null;
    private latitude: number | null;
    private longitude: number | null;
    private statusKetersediaan: string;
    private isOnline: boolean;

    constructor(props: PemberiJasaProps) {
        super({
            ...props,
            role: Role.PEMBERI_JASA,
            akumulasiRating: props.akumulasiRating ?? 0.0,
            riwayatRating: props.riwayatRating ?? [],
        });
        this.idKategoriJasa = props.idKategoriJasa ?? null;
        this.jenisJasa = props.jenisJasa ?? null;
        this.latitude = props.latitude ?? null;
        this.longitude = props.longitude ?? null;
        this.statusKetersediaan = props.statusKetersediaan ?? 'Available';
        this.isOnline = props.isOnline ?? true;
    }

    public getIdKategoriJasa(): string | null {
        return this.idKategoriJasa;
    }

    public getJenisJasa(): string | null {
        return this.jenisJasa;
    }


    public getStatusKetersediaan(): string {
        return this.statusKetersediaan;
    }

    public getIsOnline(): boolean {
        return this.isOnline;
    }


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
        let resolvedIdKategori: string | null = this.idKategoriJasa;
        if (resolvedIdKategori) {
            const existingKategori = await tx.kategoriJasa.findUnique({
            where: { idKategoriJasa: resolvedIdKategori },
            });

            if (!existingKategori) {
            await tx.kategoriJasa.create({
                data: {
                idKategoriJasa: resolvedIdKategori,
                jenisJasa: this.jenisJasa ?? 'Umum',
                deskripsiJasa: `Layanan ${this.jenisJasa ?? 'Umum'}`,
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
            idKategoriJasa: resolvedIdKategori,
            jenisJasa: this.jenisJasa,
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
        idKategoriJasa: result.pemberiJasaRecord.idKategoriJasa,
        jenisJasa: result.pemberiJasaRecord.jenisJasa,
        latitude: result.pemberiJasaRecord.latitude,
        longitude: result.pemberiJasaRecord.longitude,
        statusKetersediaan: result.pemberiJasaRecord.statusKetersediaan,
        isOnline: result.pemberiJasaRecord.isOnline,
        });
    }

    public override toJSON(): Record<string, unknown> {
        return {
        ...super.toJSON(),
        idPemberiJasa: this.idPengguna,
        idKategoriJasa: this.idKategoriJasa,
        jenisJasa: this.jenisJasa,
        latitude: this.latitude,
        longitude: this.longitude,
        statusKetersediaan: this.statusKetersediaan,
        isOnline: this.isOnline,
        };
    }
}

