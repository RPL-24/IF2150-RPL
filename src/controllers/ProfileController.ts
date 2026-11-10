import { PemilikUsaha } from '../models/PemilikUsaha';
import { AuthController, ValidationError } from './AuthController';
import { isEmailValid, isNoTelpValid } from './validators';

export const PESAN_EMAIL_TIDAK_VALID = 'Format email tidak valid';
export const PESAN_TELP_TIDAK_VALID = 'Nomor telepon harus berupa angka';

export type HasilUpdateProfil = { emailPerluKonfirmasi: boolean };

export class ProfileController {
  private currentPemilik: PemilikUsaha | null = null;
  private auth = new AuthController();

  async muatProfil(): Promise<PemilikUsaha> {
    this.currentPemilik = await PemilikUsaha.muatSaatIni();
    return this.currentPemilik;
  }

  validateProfileData(namaUsaha: string, email: string, noTelp: string): boolean {
    if (!isEmailValid(email)) {
      throw new ValidationError(PESAN_EMAIL_TIDAK_VALID);
    }

    if (noTelp.trim() !== '' && !isNoTelpValid(noTelp)) {
      throw new ValidationError(PESAN_TELP_TIDAK_VALID);
    }

    return true;
  }

  async updateProfileData(
    namaUsaha: string,
    email: string,
    noTelp: string,
  ): Promise<HasilUpdateProfil> {
    const pemilik = this.currentPemilik ?? (await this.muatProfil());
    const emailBaru = email.trim().toLowerCase();
    const emailBerubah = emailBaru !== pemilik.getEmail().toLowerCase();

    if (emailBerubah && (await PemilikUsaha.isTerdaftar('', emailBaru))) {
      throw new ValidationError('Email sudah digunakan akun lain');
    }

    if (emailBerubah) {
      await pemilik.setEmail(emailBaru);
    }

    await pemilik.setNamaUsaha(namaUsaha.trim());
    await pemilik.setNoTelp(noTelp.trim());

    return { emailPerluKonfirmasi: emailBerubah };
  }

  async processLogout(): Promise<void> {
    this.currentPemilik = null;
    await this.endSession();
  }

  async endSession(): Promise<void> {
    await this.auth.logout();
  }
}