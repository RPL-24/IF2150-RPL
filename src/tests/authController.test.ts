import { beforeEach, expect, it, vi } from 'vitest';
import { AuthController } from '../controllers/AuthController';

const { rpc, signUp, signInWithPassword, invoke, setSession } = vi.hoisted(
  () => ({
    rpc: vi.fn(),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    invoke: vi.fn(),
    setSession: vi.fn(),
  }),
);

vi.mock('../services/supabase', () => ({
  supabase: {
    rpc,
    auth: { signUp, signInWithPassword, setSession },
    functions: { invoke },
  },
}));

beforeEach(() => {
  rpc.mockReset();
  signUp.mockReset();
  signInWithPassword.mockReset();
  invoke.mockReset();
  setSession.mockReset();
});

it('mendaftarkan akun ketika data valid dan akun belum terdaftar', async () => {
  rpc.mockResolvedValueOnce({ data: false, error: null });
  signUp.mockResolvedValueOnce({ error: null });

  const auth = new AuthController();
  const hasil = await auth.validateData(
    'kevin_uji',
    'kevin@example.com',
    'Pross1234',
  );

  expect(hasil).toBe(true);
  expect(signUp).toHaveBeenCalledWith({
    email: 'kevin@example.com',
    password: 'Pross1234',
    options: { data: { username: 'kevin_uji' } },
  });
});

it('menolak registrasi ketika username kosong', async () => {
  const auth = new AuthController();

  await expect(
    auth.validateData('', 'kevin@example.com', 'Pross1234'),
  ).rejects.toThrow('Data Registrasi Belum Lengkap');

  expect(signUp).not.toHaveBeenCalled();
});

it('menolak registrasi ketika format email salah', async () => {
  const auth = new AuthController();

  await expect(
    auth.validateData('kevin_uji', 'email-tidak-valid', 'Pross1234'),
  ).rejects.toThrow('Format email tidak valid');

  expect(signUp).not.toHaveBeenCalled();
});

it('menolak registrasi ketika akun sudah terdaftar', async () => {
  rpc.mockResolvedValueOnce({ data: true, error: null });
  const auth = new AuthController();

  await expect(
    auth.validateData('kevin_uji', 'kevin@example.com', 'Pross1234'),
  ).rejects.toThrow('Akun sudah dibuat');

  expect(signUp).not.toHaveBeenCalled();
});

it('menolak registrasi ketika password terlalu lemah', async () => {
  rpc.mockResolvedValueOnce({ data: false, error: null });
  const auth = new AuthController();

  await expect(
    auth.validateData('kevin_uji', 'kevin@example.com', 'abc'),
  ).rejects.toThrow('Password terlalu lemah');

  expect(signUp).not.toHaveBeenCalled();
});


it('mengizinkan login via email dengan password benar', async () => {
  rpc.mockResolvedValueOnce({ data: true, error: null });
  signInWithPassword.mockResolvedValueOnce({ error: null });

  const auth = new AuthController();
  const hasil = await auth.validateData(
    'kevin@example.com',
    null,
    'Pross1234',
  );

  expect(hasil).toBe(true);
  expect(signInWithPassword).toHaveBeenCalledWith({
    email: 'kevin@example.com',
    password: 'Pross1234',
  });
});

it('menolak login via email ketika password salah', async () => {
  rpc.mockResolvedValueOnce({ data: true, error: null });
  signInWithPassword.mockResolvedValueOnce({
    error: { message: 'Invalid login credentials' },
  });

  const auth = new AuthController();

  await expect(
    auth.validateData('kevin@example.com', null, 'Salah1234'),
  ).rejects.toThrow('Username atau Password Salah');
});

it('menolak login via email ketika akun belum terdaftar', async () => {
  rpc.mockResolvedValueOnce({ data: false, error: null });

  const auth = new AuthController();

  await expect(
    auth.validateData('belumdaftar@example.com', null, 'Pross1234'),
  ).rejects.toThrow('Tidak dapat menemukan akun');

  expect(signInWithPassword).not.toHaveBeenCalled();
});


it('mengizinkan login via username dan menyimpan sesi', async () => {
  invoke.mockResolvedValueOnce({
    data: {
      ok: true,
      access_token: 'access-token-uji',
      refresh_token: 'refresh-token-uji',
    },
    error: null,
  });
  setSession.mockResolvedValueOnce({ error: null });

  const auth = new AuthController();
  const hasil = await auth.validateData(' Kevin_Uji ', null, 'Pross1234');

  expect(hasil).toBe(true);
  expect(invoke).toHaveBeenCalledWith('login-with-username', {
    body: { username: 'kevin_uji', password: 'Pross1234' },
  });
  expect(setSession).toHaveBeenCalledWith({
    access_token: 'access-token-uji',
    refresh_token: 'refresh-token-uji',
  });
});

it('menolak login via username ketika password salah', async () => {
  invoke.mockResolvedValueOnce({
    data: { ok: false, code: 'INVALID_CREDENTIALS' },
    error: null,
  });

  const auth = new AuthController();

  await expect(
    auth.validateData('kevin_uji', null, 'Salah1234'),
  ).rejects.toThrow('Username atau Password Salah');

  expect(setSession).not.toHaveBeenCalled();
});

it('menolak login via username ketika token sesi tidak lengkap', async () => {
  invoke.mockResolvedValueOnce({
    data: { ok: true, access_token: 'access-token-uji' },
    error: null,
  });

  const auth = new AuthController();

  await expect(
    auth.validateData('kevin_uji', null, 'Pross1234'),
  ).rejects.toThrow('Session login tidak diterima');

  expect(setSession).not.toHaveBeenCalled();
});