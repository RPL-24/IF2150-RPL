// Unit test C17 LaporanController bagian validasi (Peran A, tingkat Mendalam).
// Operasi DPPL validasiBerkas & validasiLokasi (+ validasiForm). ID test case: C17-UT01 s.d. C17-UT20.
import { describe, expect, it } from "vitest";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { PESAN_BERKAS_TIDAK_VALID } from "@/lib/media";
import type { MediaTerunggah } from "@/server/entities/Foto";
import {
  PESAN_DI_LUAR_WILAYAH,
  PESAN_FORM_TIDAK_LENGKAP,
  validasiBerkas,
  validasiForm,
  validasiLokasi,
} from "./laporan-validasi";

const ID_USER = "11111111-1111-1111-1111-111111111111";
const MB = 1024 * 1024;

function media(nama: string, ukuran: number, tipe: "foto" | "video", idUser = ID_USER): MediaTerunggah {
  const format = nama.split(".").pop() ?? "";
  return { path: `laporan/${idUser}/${nama}`, format, ukuran, tipe };
}

describe("C17 LaporanController.validasiForm", () => {
  it("C17-UT01 validasiForm (normal): kategori valid dan deskripsi terisi → null", () => {
    expect(validasiForm("jalan_berlubang", "Lubang besar di depan sekolah")).toBeNull();
  });

  it("C17-UT02 validasiForm (batas): deskripsi 1 karakter → null", () => {
    expect(validasiForm("lampu_jalan_mati", "a")).toBeNull();
  });

  it("C17-UT03 validasiForm (negatif): kategori di luar enum → pesan form tidak lengkap", () => {
    expect(validasiForm("banjir", "Air menggenang")).toBe(PESAN_FORM_TIDAK_LENGKAP);
  });

  it("C17-UT04 validasiForm (negatif): deskripsi kosong atau hanya spasi → pesan form tidak lengkap", () => {
    expect(validasiForm("jalan_berlubang", "")).toBe(PESAN_FORM_TIDAK_LENGKAP);
    expect(validasiForm("jalan_berlubang", "   ")).toBe(PESAN_FORM_TIDAK_LENGKAP);
  });

  it("C17-UT05 validasiForm (negatif): kategori nama properti bawaan objek (constructor) ditolak", () => {
    expect(validasiForm("constructor", "Uji")).toBe(PESAN_FORM_TIDAK_LENGKAP);
  });
});

describe("C17 LaporanController.validasiLokasi", () => {
  it("C17-UT06 validasiLokasi (normal): titik di pusat Kota Bandung → null", () => {
    expect(validasiLokasi(-6.9175, 107.6191)).toBeNull();
  });

  it("C17-UT07 validasiLokasi (batas): titik dekat tepi tenggara kota (±1,4 km dari batas) → null", () => {
    expect(validasiLokasi(-6.955, 107.7)).toBeNull();
  });

  it("C17-UT08 validasiLokasi (negatif): titik di luar batas kota (Jakarta) → pesan di luar wilayah", () => {
    expect(validasiLokasi(-6.2088, 106.8456)).toBe(PESAN_DI_LUAR_WILAYAH);
  });

  it("C17-UT09 validasiLokasi (negatif): koordinat NaN → pesan form tidak lengkap", () => {
    expect(validasiLokasi(Number.NaN, 107.6191)).toBe(PESAN_FORM_TIDAK_LENGKAP);
  });

  it("C17-UT10 validasiLokasi (negatif): koordinat Infinity → pesan form tidak lengkap", () => {
    expect(validasiLokasi(-6.9175, Number.POSITIVE_INFINITY)).toBe(PESAN_FORM_TIDAK_LENGKAP);
  });
});

describe("C17 LaporanController.validasiBerkas", () => {
  it("C17-UT11 validasiBerkas (normal): satu foto JPG 2 MB → null", () => {
    expect(validasiBerkas([media("a.jpg", 2 * MB, "foto")], ID_USER)).toBeNull();
  });

  it("C17-UT12 validasiBerkas (normal): foto PNG dan video MP4 sekaligus → null", () => {
    const daftar = [media("a.png", MB, "foto"), media("b.mp4", 8 * MB, "video")];
    expect(validasiBerkas(daftar, ID_USER)).toBeNull();
  });

  it("C17-UT13 validasiBerkas (batas): foto dan video tepat 10 MB → null", () => {
    const daftar = [media("a.jpg", MAX_FILE_SIZE, "foto"), media("b.mkv", MAX_FILE_SIZE, "video")];
    expect(validasiBerkas(daftar, ID_USER)).toBeNull();
  });

  it("C17-UT14 validasiBerkas (batas): foto 10 MB + 1 byte → pesan berkas tidak valid", () => {
    expect(validasiBerkas([media("a.jpg", MAX_FILE_SIZE + 1, "foto")], ID_USER)).toBe(PESAN_BERKAS_TIDAK_VALID);
  });

  it("C17-UT15 validasiBerkas (negatif): daftar berkas kosong → pesan form tidak lengkap", () => {
    expect(validasiBerkas([], ID_USER)).toBe(PESAN_FORM_TIDAK_LENGKAP);
  });

  it("C17-UT16 validasiBerkas (negatif): format tidak didukung (PDF, AVI) → pesan berkas tidak valid", () => {
    expect(validasiBerkas([media("a.pdf", MB, "foto")], ID_USER)).toBe(PESAN_BERKAS_TIDAK_VALID);
    expect(validasiBerkas([media("b.avi", MB, "video")], ID_USER)).toBe(PESAN_BERKAS_TIDAK_VALID);
  });

  it("C17-UT17 validasiBerkas (negatif): tipe tidak sesuai isi (MP4 dikirim sebagai foto) → ditolak", () => {
    expect(validasiBerkas([media("b.mp4", MB, "foto")], ID_USER)).toBe(PESAN_BERKAS_TIDAK_VALID);
  });

  it("C17-UT18 validasiBerkas (negatif): berkas di folder milik user lain → ditolak", () => {
    const punyaOrangLain = media("a.jpg", MB, "foto", "22222222-2222-2222-2222-222222222222");
    expect(validasiBerkas([punyaOrangLain], ID_USER)).toBe(PESAN_BERKAS_TIDAK_VALID);
  });

  it("C17-UT19 validasiBerkas (negatif): kolom format tidak cocok dengan ekstensi path → ditolak", () => {
    const palsu: MediaTerunggah = { path: `laporan/${ID_USER}/a.jpg`, format: "png", ukuran: MB, tipe: "foto" };
    expect(validasiBerkas([palsu], ID_USER)).toBe(PESAN_BERKAS_TIDAK_VALID);
  });

  it("C17-UT20 validasiBerkas (negatif): folder berawalan ID user tapi bukan miliknya (ID-palsu/) → ditolak", () => {
    const mirip: MediaTerunggah = { path: `laporan/${ID_USER}-palsu/a.jpg`, format: "jpg", ukuran: MB, tipe: "foto" };
    expect(validasiBerkas([mirip], ID_USER)).toBe(PESAN_BERKAS_TIDAK_VALID);
  });
});
