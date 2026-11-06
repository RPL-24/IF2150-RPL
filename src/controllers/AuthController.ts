import { supabase } from '../services/supabase';
import { PemilikUsaha } from '../models/PemilikUsaha';
import {
  isDataLengkap,
  isEmailValid,
  isPasswordKuat,
} from './validators';

export class ValidationError extends Error {}

type LoginFunctionResult = {
  ok: boolean;
  code?: string;
  access_token?: string;
  refresh_token?: string;
};

export class AuthController {
  async validateData(
    usernameOrEmail: string,
    email: string | null,
    password: string,
  ): Promise<boolean> {
    if (email !== null) {
      return this.registrasi(usernameOrEmail, email, password);
    }

    return this.login(usernameOrEmail, password);
  }

  private async registrasi(
    username: string,
    email: string,
    password: string,
  ): Promise<boolean> {
    if (!isDataLengkap(username, email, password)) {
      throw new ValidationError('Data Registrasi Belum Lengkap');
    }

    const usernameNormalized = username.trim().toLowerCase();
    const emailNormalized = email.trim().toLowerCase();

    if (!isEmailValid(emailNormalized)) {
      throw new ValidationError('Format email tidak valid');
    }

    if (await PemilikUsaha.isTerdaftar(usernameNormalized, emailNormalized)) {
      throw new ValidationError('Akun sudah dibuat');
    }

    if (!isPasswordKuat(password)) {
      throw new ValidationError('Password terlalu lemah');
    }

    await new PemilikUsaha(usernameNormalized, emailNormalized, password).createUser();
    return true;
  }

  private async login(usernameOrEmail: string, password: string): Promise<boolean> {
    if (!isDataLengkap(usernameOrEmail, password)) {
      throw new ValidationError('Username atau Password Salah');
    }

    const identifier = usernameOrEmail.trim();

    if (identifier.includes('@')) {
      const accountFound = await PemilikUsaha.isTerdaftar('', identifier.toLowerCase());
      if (!accountFound) {
        throw new ValidationError('Tidak dapat menemukan akun');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: identifier.toLowerCase(),
        password,
      });

      if (error) {
        throw new ValidationError('Username atau Password Salah');
      }

      return true;
    }

    const { data, error } = await supabase.functions.invoke<LoginFunctionResult>(
      'login-with-username',
      { body: { username: identifier.toLowerCase(), password } },
    );

    if (error || !data) {
      throw new ValidationError('Terjadi kesalahan saat menghubungi layanan login');
    }

    if (!data.ok) {
      if (data.code === 'ACCOUNT_NOT_FOUND') {
        throw new ValidationError('Tidak dapat menemukan akun');
      }
      if (data.code === 'INVALID_CREDENTIALS') {
        throw new ValidationError('Username atau Password Salah');
      }
      throw new ValidationError('Terjadi kesalahan saat login');
    }

    if (!data.access_token || !data.refresh_token) {
      throw new ValidationError('Session login tidak diterima');
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

    if (sessionError) {
      throw new ValidationError('Gagal menyimpan session login');
    }

    return true;
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }
}