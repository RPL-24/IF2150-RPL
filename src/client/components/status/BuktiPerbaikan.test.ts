import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { BuktiHasilPerbaikan } from "@/server/controllers/StatusController";
import { BuktiPerbaikan } from "./BuktiPerbaikan";

const bukti: BuktiHasilPerbaikan = {
  id_hasil: "hasil-uji",
  catatan: "Lubang sudah ditambal dan permukaan jalan diratakan.",
  waktu_unggah: "2026-11-08T04:00:00Z",
  foto: [{ path: "hasil/eksekutor-uji/perbaikan.jpg" }],
};

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://laporkota-test.supabase.co");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("BuktiPerbaikan (tampilan KF19)", () => {
  it.each(["diterima", "ditolak", "dikerjakan"] as const)(
    "menyembunyikan bagian hasil ketika status %s", (status) => {
      expect(renderToStaticMarkup(createElement(BuktiPerbaikan, { status, bukti }))).toBe("");
    },
  );

  it("membedakan bukti yang belum dapat dimuat dari hasil pembacaan kosong", () => {
    const html = renderToStaticMarkup(createElement(BuktiPerbaikan, { status: "berhasil", bukti: undefined }));

    expect(html).toContain("Bukti hasil perbaikan belum dapat ditampilkan.");
    expect(html).not.toContain("<img");
  });

  it("menampilkan pesan ketika hasil pembacaan tidak menemukan bukti", () => {
    const html = renderToStaticMarkup(createElement(BuktiPerbaikan, { status: "berhasil", bukti: null }));

    expect(html).toContain("Belum ada bukti hasil perbaikan untuk laporan ini.");
    expect(html).not.toContain("<img");
  });

  it("menampilkan foto hasil dengan URL Storage, catatan dan waktu saat diberi data bukti", () => {
    const html = renderToStaticMarkup(createElement(BuktiPerbaikan, { status: "berhasil", bukti }));

    expect(html).toContain("Hasil perbaikan");
    expect(html).toContain(bukti.catatan);
    expect(html).toContain(`dateTime="${bukti.waktu_unggah}"`);
    expect(html).toContain("https://laporkota-test.supabase.co/storage/v1/object/public/media/hasil/eksekutor-uji/perbaikan.jpg");
    expect(html).toContain('alt="Foto hasil perbaikan 1"');
    expect(html).toContain('title="Perbesar foto hasil perbaikan"');
  });

  it("tetap menampilkan catatan hasil ketika belum ada foto", () => {
    const html = renderToStaticMarkup(createElement(BuktiPerbaikan, {
      status: "berhasil", bukti: { ...bukti, foto: [] },
    }));

    expect(html).toContain(bukti.catatan);
    expect(html).toContain("Belum ada foto hasil perbaikan untuk laporan ini.");
    expect(html).not.toContain("<img");
  });
});
