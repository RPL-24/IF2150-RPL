import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { gagal, ok } from "@/lib/action-result";
import { StatusLaporanPage } from "@/client/views/StatusLaporanPage";
import type { DetailStatus, ItemRiwayat } from "@/server/controllers/StatusController";

vi.mock("@/client/components/shared/MapView", () => ({ MapView: () => null }));
vi.mock("@/server/controllers/StatusController", () => ({
  ambilDetailStatus: vi.fn(), ambilLaporanPublik: vi.fn(), ambilRiwayatWarga: vi.fn(), prosesUpvote: vi.fn(),
}));

const detail: DetailStatus = {
  id_tiket: "LK-0001", kategori: "jalan_berlubang", deskripsi: "Lubang di dekat halte dari tiket notifikasi.",
  waktu_masuk: "2026-11-08T01:00:00Z", status: "ditolak", tahap: null, alasan_penolakan: "Di luar kewenangan kota.",
  foto: [], video: [], riwayat: [
    { status: "diterima", tahap: null, catatan: null, waktu: "2026-11-08T01:00:00Z" },
    { status: "ditolak", tahap: null, catatan: "Di luar kewenangan kota.", waktu: "2026-11-08T02:00:00Z" },
  ],
};
const riwayat: ItemRiwayat = {
  id: "00000000-0000-0000-0000-000000000001", id_tiket: detail.id_tiket, kategori: detail.kategori,
  status: detail.status, tahap: detail.tahap, waktu_masuk: detail.waktu_masuk,
};

function tampilkan(props: Partial<ComponentProps<typeof StatusLaporanPage>> = {}) {
  return renderToStaticMarkup(createElement(StatusLaporanPage, {
    peran: "warga", riwayatAwal: ok([riwayat]), petaAwal: null,
    tiketAwal: "LK-0001", detailAwal: ok(detail), ...props,
  }));
}

describe("Status deep link: panel awal I02-07", () => {
  it("langsung memilih tiket dan menampilkan rincian, linimasa serta alasan tanpa klik kartu", () => {
    const html = tampilkan();

    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain(detail.deskripsi);
    expect(html).toContain(detail.alasan_penolakan);
    expect(html).toMatch(/<ol\b[^>]*>.*Diterima.*Ditolak.*<\/ol>/);
    expect(html).toContain("Tutup detail");
    expect(html).not.toContain("Pilih tiket untuk melihat detail laporan.");
  });

  it("tetap menampilkan detail yang diminta meskipun daftar riwayat kosong", () => {
    const html = tampilkan({ riwayatAwal: ok([]) });

    expect(html).toContain(detail.deskripsi);
    expect(html).toContain("Detail tiket");
  });

  it("tetap menampilkan detail ketika pemuatan daftar riwayat gagal", () => {
    const html = tampilkan({ riwayatAwal: gagal("Gagal memuat riwayat.") });

    expect(html).toContain("Gagal memuat riwayat.");
    expect(html).toContain(detail.deskripsi);
  });

  it.each(["Tiket tidak ditemukan atau tidak dapat diakses.", "Format ID tiket tidak valid."])(
    "menampilkan error deep link meski daftar kosong: %s", (pesan) => {
      const html = tampilkan({ riwayatAwal: ok([]), detailAwal: gagal(pesan) });

      expect(html).toContain('role="alert"');
      expect(html).toContain(pesan);
      expect(html).not.toContain(detail.deskripsi);
    },
  );

  it("tidak menampilkan detail awal jika peran bukan warga", () => {
    const html = tampilkan({ peran: "admin", riwayatAwal: null });

    expect(html).not.toContain(detail.deskripsi);
    expect(html).not.toContain(detail.alasan_penolakan);
  });
});
