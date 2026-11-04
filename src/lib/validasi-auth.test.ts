import { describe, expect, it } from "vitest";
import { validasiDaftar, validasiMasuk } from "@/lib/validasi-auth";

describe("validasiMasuk", () => {
  it("trim + lowercase email, password tidak diubah", () => {
    expect(validasiMasuk({ email: "  Warga1@LaporKota.TEST ", password: " rahasia1 " })).toEqual({
      ok: true,
      data: { email: "warga1@laporkota.test", password: " rahasia1 " },
    });
  });

  it.each([
    [{ email: "   ", password: "12345678" }, "Email wajib diisi."],
    [{ email: "bukan-email", password: "12345678" }, "Format email tidak valid."],
    [{ email: "a@b", password: "12345678" }, "Format email tidak valid."],
    [{ email: "a b@c.id", password: "12345678" }, "Format email tidak valid."],
    [{ email: "a@b.id", password: "1234567" }, "Kata sandi minimal 8 karakter."],
  ])("menolak %o", (input, error) => {
    expect(validasiMasuk(input)).toEqual({ ok: false, error });
  });
});

describe("validasiDaftar", () => {
  it("trim nama", () => {
    expect(validasiDaftar({ nama: "  Budi ", email: "budi@x.id", password: "12345678" })).toEqual({
      ok: true,
      data: { nama: "Budi", email: "budi@x.id", password: "12345678" },
    });
  });

  it("nama wajib dan maksimal 100 karakter", () => {
    const dasar = { email: "budi@x.id", password: "12345678" };
    expect(validasiDaftar({ ...dasar, nama: "  " })).toEqual({ ok: false, error: "Nama wajib diisi." });
    expect(validasiDaftar({ ...dasar, nama: "a".repeat(100) }).ok).toBe(true);
    expect(validasiDaftar({ ...dasar, nama: "a".repeat(101) })).toEqual({
      ok: false,
      error: "Nama maksimal 100 karakter.",
    });
  });

  it("meneruskan error email/password", () => {
    expect(validasiDaftar({ nama: "Budi", email: "x", password: "12345678" })).toEqual({
      ok: false,
      error: "Format email tidak valid.",
    });
  });
});
