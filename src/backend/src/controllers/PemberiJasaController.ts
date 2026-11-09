import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {
  PenggunaController,
  RegistrationInputPayload,
  ValidationResult,
} from './PenggunaController';
import { Pengguna } from '../models/Pengguna';
import { PemberiJasa } from '../models/PemberiJasa';

export interface ProviderRegistrationPayload extends RegistrationInputPayload {
    idKategoriJasa?: string;
    jenisJasa?: string;
    namaToko?: string;
    latitude?: number;
    longitude?: number;
}

export class PemberiJasaController extends PenggunaController {
    public static override validasiInfoRegistrasi(payload: ProviderRegistrationPayload): ValidationResult & {
        providerData?: {
        idKategoriJasa: string;
        jenisJasa: string;
        namaToko?: string;
        latitude?: number | null;
        longitude?: number | null;
        };
    } {
    const baseValidation = super.validasiInfoRegistrasi(payload);
    if (!baseValidation.valid) {
      return baseValidation;
    }

    const idKategoriJasa = (payload.idKategoriJasa ?? '').trim();
    const jenisJasa = (payload.jenisJasa ?? '').trim();
    const namaToko = payload.namaToko ? payload.namaToko.trim() : undefined;

    if (!idKategoriJasa) {
        return {
            valid: false,
            message: 'Field idKategoriJasa wajib diisi untuk Pemberi Jasa.',
        };
    }

    if (!jenisJasa) {
        return {
            valid: false,
            message: 'Field jenisJasa wajib diisi untuk Pemberi Jasa.',
        };
    }

    return {
        ...baseValidation,
        providerData: {
            idKategoriJasa,
            jenisJasa,
            namaToko,
            latitude: typeof payload.latitude === 'number' ? payload.latitude : null,
            longitude: typeof payload.longitude === 'number' ? payload.longitude : null,
        },
        };
  }

    public static async registrasiPemberiJasa(req: Request,res: Response): Promise<void> {
        try {
            const validation = PemberiJasaController.validasiInfoRegistrasi(req.body);
            if (
                !validation.valid ||
                !validation.sanitizedData ||
                !validation.providerData
            ) {
                res.status(400).json({
                success: false,
                message: validation.message,
                });
                return;
            }

            const {
                namaPengguna,
                username,
                password,
                email,
                nomorTelepon,
                avatarUrl,
            } = validation.sanitizedData;
            const { idKategoriJasa, jenisJasa, namaToko, latitude, longitude } =
                validation.providerData;

            // Cek duplikasi username atau email di database (Q-005)
            const { usernameExists, emailExists } =
                await Pengguna.cekDuplikasiKredensial(username, email);

            if (usernameExists || emailExists) {
                res.status(400).json({
                success: false,
                message: usernameExists
                    ? 'Username sudah terdaftar. Silakan gunakan username lain.'
                    : 'Email sudah terdaftar. Silakan gunakan alamat email lain.',
                });
                return;
            }

            const passwordHash = await bcrypt.hash(
                password,
                PemberiJasaController.BCRYPT_SALT_ROUNDS
            );

            const pemberiJasaBaru = PemberiJasa.makePemberiJasa({
                namaPengguna,
                username,
                email,
                nomorTelepon,
                passwordHash,
                avatarUrl,
                idKategoriJasa,
                jenisJasa,
                namaToko,
                latitude,
                longitude,
            });

            const savedPemberiJasa = await pemberiJasaBaru.simpanKeDb();

            res.status(201).json({
                success: true,
                message: 'Registrasi pemberi jasa berhasil.',
                data: savedPemberiJasa.toJSON(),
            });
        } catch (error) {
            console.error(
                '[PemberiJasaController.registrasiPemberiJasa] Error:',
                error
            );
            res.status(500).json({
                success: false,
                message:
                'Terjadi kesalahan internal saat memproses registrasi pemberi jasa.',
            });
        }
    }
}

