import { describe, expect, it } from 'vitest';
import {
  isDataLengkap,
  isEmailValid,
  isKonfirmasiPasswordSesuai,
  isPasswordKuat,
} from '../controllers/validators';

describe('isDataLengkap', () => {
  it('true jika semua data terisi', () => {
    expect(isDataLengkap('budi', 'budi@example.com', 'rahasia123')).toBe(true);
  });

  it('false jika ada data kosong', () => {
    expect(isDataLengkap('budi', '', 'rahasia123')).toBe(false);
  });

  it('false jika data hanya berisi spasi', () => {
    expect(isDataLengkap('budi', '   ', 'rahasia123')).toBe(false);
  });
});

describe('isPasswordKuat', () => {
  it('true jika minimal 8 karakter dan mengandung huruf serta angka', () => {
    expect(isPasswordKuat('rahasia123')).toBe(true);
  });

  it('false jika terlalu pendek', () => {
    expect(isPasswordKuat('abc1')).toBe(false);
  });

  it('false jika tidak mengandung angka', () => {
    expect(isPasswordKuat('rahasiaaaa')).toBe(false);
  });

  it('false jika tidak mengandung huruf', () => {
    expect(isPasswordKuat('12345678')).toBe(false);
  });
});

describe('isEmailValid', () => {
  it('true untuk format email yang wajar', () => {
    expect(isEmailValid('budi@example.com')).toBe(true);
  });

  it('false untuk format email yang tidak valid', () => {
    expect(isEmailValid('budi@')).toBe(false);
  });
});

describe('isKonfirmasiPasswordSesuai', () => {
  it('true jika password dan konfirmasi sama', () => {
    expect(isKonfirmasiPasswordSesuai('rahasia123', 'rahasia123')).toBe(true);
  });

  it('false jika password dan konfirmasi berbeda', () => {
    expect(isKonfirmasiPasswordSesuai('rahasia123', 'rahasia321')).toBe(false);
  });
});