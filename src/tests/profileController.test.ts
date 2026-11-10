import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  baris: {
    username: 'sari',
    email: 'sari@dapur.id',
    nama_usaha: null as string | null,
    no_telp: null as string | null,
  },
  emailTerdaftar: false,
  updates: [] as Record<string, unknown>[],
  emailUpdates: [] as string[],
  updateEmailError: null as { message: string } | null,
  signOutCalls: 0,
  signOutError: null as { message: string } | null,
}));

vi.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      getUser: async () => ({ data: { user: { id: 'u1' } }, error: null }),
      updateUser: async (attrs: { email?: string }) => {
        if (attrs.email) state.emailUpdates.push(attrs.email);
        return { error: state.updateEmailError };
      },
      signOut: async () => {
        state.signOutCalls += 1;
        return { error: state.signOutError };
      },
    },
    rpc: async () => ({ data: state.emailTerdaftar, error: null }),
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: state.baris, error: null }),
        }),
      }),
      update: (data: Record<string, unknown>) => ({
        eq: async () => {
          state.updates.push(data);
          return { error: null };
        },
      }),
    }),
  },
}));

import { ValidationError } from '../controllers/AuthController';
import {
  PESAN_EMAIL_TIDAK_VALID,
  PESAN_TELP_TIDAK_VALID,
  ProfileController,
} from '../controllers/ProfileController';

beforeEach(() => {
  state.baris = {
    username: 'sari',
    email: 'sari@dapur.id',
    nama_usaha: null,
    no_telp: null,
  };
  state.emailTerdaftar = false;
  state.updates = [];
  state.emailUpdates = [];
  state.updateEmailError = null;
  state.signOutCalls = 0;
  state.signOutError = null;
});

describe('ProfileController.muatProfil', () => {
  it('memuat data pemilik dan mengosongkan kolom opsional yang null', async () => {
    const pemilik = await new ProfileController().muatProfil();

    expect(pemilik.getUsername()).toBe('sari');
    expect(pemilik.getEmail()).toBe('sari@dapur.id');
    expect(pemilik.getNamaUsaha()).toBe('');
    expect(pemilik.getNoTelp()).toBe('');
  });
});

describe('ProfileController.validateProfileData', () => {
  const c = new ProfileController();

  it('true untuk data valid, termasuk telepon dengan spasi', () => {
    expect(c.validateProfileData('Dapur Bu Sari', 'sari@dapur.id', '0812 3456 7890')).toBe(true);
  });

  it('true jika nama usaha dan telepon dikosongkan (opsional)', () => {
    expect(c.validateProfileData('', 'sari@dapur.id', '')).toBe(true);
  });

  it('menolak email yang formatnya tidak valid', () => {
    expect(() => c.validateProfileData('', 'sari@', '')).toThrow(PESAN_EMAIL_TIDAK_VALID);
    expect(() => c.validateProfileData('', 'sari@', '')).toThrow(ValidationError);
  });

  it('menolak telepon yang bukan angka', () => {
    expect(() => c.validateProfileData('', 'sari@dapur.id', '08abc')).toThrow(
      PESAN_TELP_TIDAK_VALID,
    );
  });
});

describe('ProfileController.updateProfileData', () => {
  it('menyimpan nama usaha dan telepon tanpa menyentuh email jika email tidak berubah', async () => {
    const c = new ProfileController();
    const hasil = await c.updateProfileData('  Dapur Bu Sari ', 'SARI@dapur.id', ' 0812 3456 7890 ');

    expect(state.updates).toEqual([
      { nama_usaha: 'Dapur Bu Sari' },
      { no_telp: '0812 3456 7890' },
    ]);
    expect(state.emailUpdates).toEqual([]);
    expect(hasil.emailPerluKonfirmasi).toBe(false);
  });

  it('meminta konfirmasi email jika email berubah', async () => {
    const c = new ProfileController();
    const hasil = await c.updateProfileData('Dapur Bu Sari', 'Baru@Dapur.id', '');

    expect(state.emailUpdates).toEqual(['baru@dapur.id']);
    expect(hasil.emailPerluKonfirmasi).toBe(true);
  });

  it('menolak email yang sudah dipakai akun lain dan tidak menyimpan apa pun', async () => {
    state.emailTerdaftar = true;
    const c = new ProfileController();

    await expect(c.updateProfileData('Dapur Bu Sari', 'lain@dapur.id', '')).rejects.toThrow(
      'Email sudah digunakan akun lain',
    );
    expect(state.updates).toEqual([]);
    expect(state.emailUpdates).toEqual([]);
  });

  it('tidak menyimpan nama usaha dan telepon jika Supabase menolak email', async () => {
    state.updateEmailError = { message: 'Email address "x@y.z" is invalid' };
    const c = new ProfileController();

    await expect(c.updateProfileData('Dapur Bu Sari', 'x@y.z', '0812')).rejects.toThrow('is invalid');
    expect(state.updates).toEqual([]);
  });
});

describe('ProfileController.processLogout', () => {
  it('mengakhiri sesi satu kali', async () => {
    const c = new ProfileController();
    await c.processLogout();

    expect(state.signOutCalls).toBe(1);
  });

  it('meneruskan error jika signOut gagal', async () => {
    state.signOutError = { message: 'gagal logout' };
    const c = new ProfileController();

    await expect(c.processLogout()).rejects.toThrow('gagal logout');
  });
});