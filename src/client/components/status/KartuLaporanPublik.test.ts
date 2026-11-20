import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { StatusLaporanPage } from "@/client/views/StatusLaporanPage";
import type { ItemPeta } from "@/server/controllers/StatusController";
import { KartuLaporanPublik } from "./KartuLaporanPublik";

// Leaflet memerlukan browser; pengujian ini memeriksa kontrol HTML pemilihan tiket.
vi.mock("@/client/components/shared/MapView", () => ({ MapView: () => null }));
vi.mock("@/server/controllers/StatusController", () => ({
  ambilDetailStatus: vi.fn(), ambilLaporanPublik: vi.fn(), ambilRiwayatWarga: vi.fn(), prosesUpvote: vi.fn(),
}));

const laporan: ItemPeta = {
  id: "00000000-0000-0000-0000-000000000097",
  id_tiket: "LK-0097",
  kategori: "trotoar_rusak",
  latitude: -6.9175,
  longitude: 107.6191,
  status: "dikerjakan",
  jumlah_upvote: 12,
  sudahDidukung: false,
};

describe("KartuLaporanPublik (I02-13)", () => {
  it("menampilkan tiket, label kategori, badge status dan jumlah dukungan", () => {
    const html = renderToStaticMarkup(createElement(KartuLaporanPublik, { laporan }));

    expect(html).toContain("LK-0097");
    expect(html).toContain("Trotoar rusak");
    expect(html).toContain("Dikerjakan");
    expect(html).toMatch(/12(?:<!-- -->)? dukungan/);
    expect(html).not.toContain("107.6191");
  });

  it("menampilkan jumlah nol untuk laporan yang belum didukung", () => {
    const html = renderToStaticMarkup(createElement(KartuLaporanPublik, {
      laporan: { ...laporan, jumlah_upvote: 0 },
    }));

    expect(html).toMatch(/0(?:<!-- -->)? dukungan/);
  });

  it("memperbarui isi ringkasan ketika menerima tiket lain yang dipilih", () => {
    const html = renderToStaticMarkup(createElement(KartuLaporanPublik, {
      laporan: { ...laporan, id_tiket: "LK-0100", kategori: "lampu_jalan_mati", status: "berhasil", jumlah_upvote: 5 },
    }));

    expect(html).toContain("LK-0100");
    expect(html).toContain("Lampu jalan mati");
    expect(html).toContain("Berhasil");
    expect(html).toMatch(/5(?:<!-- -->)? dukungan/);
    expect(html).not.toContain("LK-0097");
  });

  it("menyediakan kontrol tiket yang dapat dioperasikan dengan keyboard pada peta publik", () => {
    const html = renderToStaticMarkup(createElement(StatusLaporanPage, {
      peran: null, riwayatAwal: null, petaAwal: { ok: true, data: [laporan] },
    }));

    expect(html).toContain("<select");
    expect(html).toContain('aria-label="Pilih laporan pada peta"');
    expect(html).toContain('value="LK-0097"');
    expect(html).toContain("Trotoar rusak");
  });

  it("menampilkan tombol Dukung dengan jumlah yang sama seperti kartu untuk akun warga", () => {
    const html = renderToStaticMarkup(createElement(KartuLaporanPublik, { laporan, peran: "warga", onDukung: () => {} }));

    expect(html).toMatch(/Dukung \((?:<!-- -->)?12(?:<!-- -->)?\)/);
    expect(html).toMatch(/12(?:<!-- -->)? dukungan/);
    expect(html).not.toMatch(/<button[^>]* disabled=""/);
  });

  it("mengarahkan pengunjung tanpa login untuk masuk sebelum mendukung", () => {
    const html = renderToStaticMarkup(createElement(KartuLaporanPublik, { laporan, peran: null }));

    expect(html).toContain("/login?next=%2Fstatus");
    expect(html).toContain("Masuk untuk mendukung");
  });

  it("menonaktifkan dukungan untuk laporan Berhasil dan mempertahankan jumlah lamanya", () => {
    const html = renderToStaticMarkup(createElement(KartuLaporanPublik, {
      laporan: { ...laporan, status: "berhasil" }, peran: "warga", onDukung: () => {},
    }));

    expect(html).toMatch(/<button[^>]* disabled=""/);
    expect(html).toContain("Laporan sudah selesai");
    expect(html).toMatch(/12(?:<!-- -->)? dukungan/);
  });

  it("menampilkan keadaan proses dan mencegah klik ulang saat permintaan berjalan", () => {
    const html = renderToStaticMarkup(createElement(KartuLaporanPublik, {
      laporan, peran: "warga", memuatDukungan: true, onDukung: () => {},
    }));

    expect(html).toContain('aria-busy="true"');
    expect(html).toMatch(/<button[^>]* disabled=""/);
    expect(html).toContain("Memproses");
  });

  it("memperbarui angka pada kartu dan tombol ketika dukungan berhasil", () => {
    const html = renderToStaticMarkup(createElement(KartuLaporanPublik, {
      laporan: { ...laporan, jumlah_upvote: 13 }, peran: "warga", sudahDidukung: true, onDukung: () => {},
    }));

    expect(html).toMatch(/13(?:<!-- -->)? dukungan/);
    expect(html).toMatch(/Didukung \((?:<!-- -->)?13(?:<!-- -->)?\)/);
    expect(html).toMatch(/<button[^>]* disabled=""/);
  });

  it("menampilkan pesan kesalahan dukungan ganda yang bisa dibaca pengguna", () => {
    const html = renderToStaticMarkup(createElement(KartuLaporanPublik, {
      laporan, peran: "warga", sudahDidukung: true, pesanDukungan: "Anda sudah mendukung laporan ini.", gagalDukungan: true,
    }));

    expect(html).toContain('role="alert"');
    expect(html).toContain("Anda sudah mendukung laporan ini.");
  });

  it("langsung menonaktifkan tombol dari status database setelah refresh tanpa state klik sebelumnya", () => {
    const html = renderToStaticMarkup(createElement(KartuLaporanPublik, {
      laporan: { ...laporan, sudahDidukung: true }, peran: "warga", onDukung: () => {},
    }));

    expect(html).toMatch(/<button[^>]* disabled=""/);
    expect(html).toContain("Didukung (12)");
    expect(html).not.toContain("Memproses");
  });

  it("tidak mengaktifkan tombol saat status dukungan belum berhasil dibaca", () => {
    const html = renderToStaticMarkup(createElement(KartuLaporanPublik, {
      laporan: { ...laporan, sudahDidukung: null }, peran: "warga", onDukung: () => {},
    }));

    expect(html).toMatch(/<button[^>]* disabled=""/);
    expect(html).toContain("Status dukungan belum tersedia. Muat ulang Peta.");
    expect(html).not.toContain("Didukung (12)");
  });

  it.each(["admin", "eksekutor"] as const)("tidak menyediakan tombol aktif untuk peran %s", (peran) => {
    const html = renderToStaticMarkup(createElement(KartuLaporanPublik, { laporan, peran, onDukung: () => {} }));

    expect(html).toMatch(/<button[^>]* disabled=""/);
    expect(html).toContain("Dukungan hanya tersedia untuk akun warga.");
  });
});
