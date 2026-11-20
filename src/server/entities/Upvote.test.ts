import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { catatUpvote, getJumlahUpvote, sudahUpvote } from "./Upvote";

// Database tiruan agar tes tidak mengubah data asli.
function buatMock(hasil: unknown) {
  const insert = vi.fn().mockResolvedValue(hasil);
  const from = vi.fn().mockReturnValue({ insert });

  const supabase = { from } as unknown as SupabaseClient<Database>;

  return { supabase, from, insert };
}

describe("C06 Upvote - catatUpvote", () => {
  it("C06-UT01 mengirim dukungan dengan ID laporan dan pengguna yang benar", async () => {
    const hasil = { data: null, error: null };
    const mock = buatMock(hasil);

    const respons = await catatUpvote(
      mock.supabase,
      "laporan-uji",
      "pengguna-uji",
    );

    expect(mock.from).toHaveBeenCalledWith("upvote");
    expect(mock.insert).toHaveBeenCalledWith({
      id_laporan: "laporan-uji",
      id_user: "pengguna-uji",
    });
    expect(respons).toEqual(hasil);
  });

  it("C06-UT02 meneruskan error database untuk dukungan ganda", async () => {
    const hasil = {
      data: null,
      error: {
        code: "23505",
        message: "Dukungan sudah pernah diberikan.",
      },
    };
    const mock = buatMock(hasil);

    const respons = await catatUpvote(
      mock.supabase,
      "laporan-uji",
      "pengguna-uji",
    );

    expect(respons.error?.code).toBe("23505");
    expect(respons).toEqual(hasil);
  });

  it("C06-UT03 meneruskan error database ketika akses ditolak", async () => {
    const hasil = {
      data: null,
      error: {
        code: "42501",
        message: "Akses ditolak.",
      },
    };
    const mock = buatMock(hasil);

    const respons = await catatUpvote(
      mock.supabase,
      "laporan-uji",
      "pengguna-uji",
    );

    expect(respons.error?.code).toBe("42501");
    expect(respons).toEqual(hasil);
  });
});

describe("C06 Upvote - getJumlahUpvote", () => {
  function buatMockJumlah(hasil: unknown) {
    const maybeSingle = vi.fn().mockResolvedValue(hasil);
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });

    const supabase = { from } as unknown as SupabaseClient<Database>;

    return { supabase, from, select, eq };
  }

  it("C06-UT04 mengembalikan jumlah dukungan dari laporan publik", async () => {
    const mock = buatMockJumlah({
      data: { jumlah_upvote: 5 },
      error: null,
    });

    const respons = await getJumlahUpvote(
      mock.supabase,
      "laporan-uji",
    );

    expect(respons).toEqual({ data: 5, error: null });
    expect(mock.from).toHaveBeenCalledWith("laporan_publik");
    expect(mock.select).toHaveBeenCalledWith("jumlah_upvote");
    expect(mock.eq).toHaveBeenCalledWith("id", "laporan-uji");
  });

  it("C06-UT05 mempertahankan jumlah nol sebagai angka nol", async () => {
    const mock = buatMockJumlah({
      data: { jumlah_upvote: 0 },
      error: null,
    });

    const respons = await getJumlahUpvote(
      mock.supabase,
      "laporan-uji",
    );

    expect(respons).toEqual({ data: 0, error: null });
  });

  it("C06-UT06 mengembalikan null ketika laporan tidak ditemukan atau tidak publik", async () => {
    const mock = buatMockJumlah({
      data: null,
      error: null,
    });

    const respons = await getJumlahUpvote(
      mock.supabase,
      "laporan-uji",
    );

    expect(respons).toEqual({ data: null, error: null });
  });

  it("C06-UT07 meneruskan error ketika pembacaan jumlah gagal", async () => {
    const error = {
      code: "42501",
      message: "Akses pembacaan ditolak.",
    };
    const mock = buatMockJumlah({
      data: null,
      error,
    });

    const respons = await getJumlahUpvote(
      mock.supabase,
      "laporan-uji",
    );

    expect(respons).toEqual({ data: null, error });
  });
});

describe("C06 Upvote - sudahUpvote", () => {
  function buatMockStatus(hasil: unknown) {
    const eqUser = vi.fn().mockResolvedValue(hasil);
    const eqLaporan = vi.fn().mockReturnValue({ eq: eqUser });
    const select = vi.fn().mockReturnValue({ eq: eqLaporan });
    const from = vi.fn().mockReturnValue({ select });

    const supabase = { from } as unknown as SupabaseClient<Database>;

    return { supabase, from, select, eqLaporan, eqUser };
  }

  it("C06-UT08 mengembalikan true jika pengguna sudah mendukung", async () => {
    const mock = buatMockStatus({ count: 1, error: null });

    const respons = await sudahUpvote(
      mock.supabase,
      "laporan-uji",
      "pengguna-uji",
    );

    expect(respons).toEqual({ data: true, error: null });
    expect(mock.from).toHaveBeenCalledWith("upvote");
    expect(mock.select).toHaveBeenCalledWith("id_upvote", {
      count: "exact",
      head: true,
    });
    expect(mock.eqLaporan).toHaveBeenCalledWith("id_laporan", "laporan-uji");
    expect(mock.eqUser).toHaveBeenCalledWith("id_user", "pengguna-uji");
  });

  it("C06-UT09 mengembalikan false jika pengguna belum mendukung", async () => {
    const mock = buatMockStatus({ count: 0, error: null });

    const respons = await sudahUpvote(
      mock.supabase,
      "laporan-uji",
      "pengguna-uji",
    );

    expect(respons).toEqual({ data: false, error: null });
  });

  it("C06-UT10 meneruskan error jika pemeriksaan dukungan gagal", async () => {
    const error = {
      code: "42501",
      message: "Akses pembacaan ditolak.",
    };
    const mock = buatMockStatus({ count: null, error });

    const respons = await sudahUpvote(
      mock.supabase,
      "laporan-uji",
      "pengguna-uji",
    );

    expect(respons).toEqual({ data: false, error });
  });
});