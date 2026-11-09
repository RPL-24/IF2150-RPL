import { describe, expect, it } from "vitest";
import { PESAN_BERKAS_TIDAK_VALID } from "@/lib/media";
import type { MediaTerunggah } from "@/server/entities/Foto";
import {
  PESAN_DI_LUAR_WILAYAH,
  PESAN_FORM_TIDAK_LENGKAP,
  validasiBerkas,
  validasiForm,
  validasiLokasi,
} from "./laporan-validasi";

// 13 unit test (Vitest) yang memastikan aturan di file nomor 1 benar. Tes ini dijalankan dengan npm test.

const ID_USER = "11111111-1111-1111-1111-111111111111";
const MB = 1024 * 1024;

function media(nama: string, ukuran: number, tipe: "foto" | "video", idUser = ID_USER): MediaTerunggah {
  const format = nama.split(".").pop() ?? "";
  return { path: `laporan/${idUser}/${nama}`, format, ukuran, tipe };
}

describe("validasiForm", () => {
  it("menerima kategori valid dan deskripsi terisi", () => {
    expect(validasiForm("jalan_berlubang", "Lubang besar di depan sekolah")).toBeNull();
  });

  it("menolak kategori di luar enum", () => {
    expect(validasiForm("banjir", "Air menggenang")).toBe(PESAN_FORM_TIDAK_LENGKAP);
  });

  it("menolak deskripsi kosong atau hanya spasi", () => {
    expect(validasiForm("jalan_berlubang", "   ")).toBe(PESAN_FORM_TIDAK_LENGKAP);
  });
});

describe("validasiLokasi", () => {
  it("menerima titik di pusat kota Bandung", () => {
    expect(validasiLokasi(-6.9175, 107.6191)).toBeNull();
  });

  it("menolak titik di luar batas kota (Jakarta)", () => {
    expect(validasiLokasi(-6.2088, 106.8456)).toBe(PESAN_DI_LUAR_WILAYAH);
  });

  it("menolak koordinat bukan angka", () => {
    expect(validasiLokasi(Number.NaN, 107.6191)).toBe(PESAN_FORM_TIDAK_LENGKAP);
  });
});

describe("validasiBerkas", () => {
  it("menerima satu foto JPG 2 MB", () => {
    expect(validasiBerkas([media("a.jpg", 2 * MB, "foto")], ID_USER)).toBeNull();
  });

  it("menerima foto dan video sekaligus", () => {
    const daftar = [media("a.png", MB, "foto"), media("b.mp4", 8 * MB, "video")];
    expect(validasiBerkas(daftar, ID_USER)).toBeNull();
  });

  it("menolak daftar kosong", () => {
    expect(validasiBerkas([], ID_USER)).toBe(PESAN_FORM_TIDAK_LENGKAP);
  });

  it("menolak foto lebih dari 10 MB", () => {
    expect(validasiBerkas([media("a.jpg", 12 * MB, "foto")], ID_USER)).toBe(PESAN_BERKAS_TIDAK_VALID);
  });

  it("menolak format tidak didukung (PDF, AVI)", () => {
    expect(validasiBerkas([media("a.pdf", MB, "foto")], ID_USER)).toBe(PESAN_BERKAS_TIDAK_VALID);
    expect(validasiBerkas([media("b.avi", MB, "video")], ID_USER)).toBe(PESAN_BERKAS_TIDAK_VALID);
  });

  it("menolak tipe yang tidak sesuai isi berkas", () => {
    expect(validasiBerkas([media("b.mp4", MB, "foto")], ID_USER)).toBe(PESAN_BERKAS_TIDAK_VALID);
  });

  it("menolak berkas di folder milik user lain", () => {
    const punyaOrangLain = media("a.jpg", MB, "foto", "22222222-2222-2222-2222-222222222222");
    expect(validasiBerkas([punyaOrangLain], ID_USER)).toBe(PESAN_BERKAS_TIDAK_VALID);
  });
});