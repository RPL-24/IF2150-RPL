import { beforeEach, expect, it, vi } from 'vitest';
import { PemilikUsaha } from '../models/PemilikUsaha';

const { signUp } = vi.hoisted(() => ({
  signUp: vi.fn(),
}));

vi.mock('../services/supabase', () => ({
  supabase: {
    auth: { signUp },
  },
}));

beforeEach(() => {
  signUp.mockReset();
});

it('membuat akun dengan email dan username yang dinormalisasi', async () => {
  signUp.mockResolvedValueOnce({ error: null });
  const pemilik = new PemilikUsaha(
    ' Kevin_Uji ',
    ' Kevin@Example.com ',
    'Pross1234',
  );

  await expect(pemilik.createUser()).resolves.toBeUndefined();

  expect(signUp).toHaveBeenCalledWith({
    email: 'kevin@example.com',
    password: 'Pross1234',
    options: { data: { username: 'kevin_uji' } },
  });
});

it('meneruskan pesan error ketika Supabase menolak pembuatan akun', async () => {
  signUp.mockResolvedValueOnce({
    error: { message: 'User already registered' },
  });
  const pemilik = new PemilikUsaha(
    'kevin_uji',
    'kevin@example.com',
    'Pross1234',
  );

  await expect(pemilik.createUser()).rejects.toThrow('User already registered');
});