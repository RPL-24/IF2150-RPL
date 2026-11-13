import { describe, expect, it } from "vitest";
import { PESAN_UMUM, pesanErrorDb } from "@/lib/error-db";

describe("pesanErrorDb", () => {
  it("P0001 memakai pesan dari trigger/RPC apa adanya", () => {
    const message = "Lampirkan minimal satu foto atau video.";
    expect(pesanErrorDb({ code: "P0001", message })).toBe(message);
  });

  it("P0001 tanpa pesan jatuh ke pesan umum", () => {
    expect(pesanErrorDb({ code: "P0001", message: " " })).toBe(PESAN_UMUM);
  });

  it("23505 pada constraint upvote", () => {
    const message = 'duplicate key value violates unique constraint "upvote_id_laporan_id_user_key"';
    expect(pesanErrorDb({ code: "23505", message })).toBe("Anda sudah mendukung laporan ini.");
  });

  it("23505 pada constraint lain", () => {
    const message = 'duplicate key value violates unique constraint "laporan_id_tiket_key"';
    expect(pesanErrorDb({ code: "23505", message })).toBe("Data yang sama sudah ada.");
  });

  it("42501 (RLS) dan 23514 (CHECK)", () => {
    expect(pesanErrorDb({ code: "42501", message: "new row violates row-level security policy" })).toBe(
      "Anda tidak memiliki akses untuk tindakan ini.",
    );
    expect(pesanErrorDb({ code: "23514", message: "violates check constraint" })).toBe("Data tidak valid.");
  });

  it("kode lain dan tanpa kode → pesan umum (pesan mentah tidak bocor)", () => {
    expect(pesanErrorDb({ code: "22P02", message: "invalid input syntax for type uuid" })).toBe(PESAN_UMUM);
    expect(pesanErrorDb({ message: "fetch failed" })).toBe(PESAN_UMUM);
  });
});
