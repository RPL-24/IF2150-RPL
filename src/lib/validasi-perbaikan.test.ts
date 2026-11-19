import { describe, expect, it } from "vitest";
import { cekKelengkapan, cekMediaTerunggah, PESAN_TAK_LENGKAP, validasiForm } from "./validasi-perbaikan";

const foto = { name: "a.jpg", size: 1024 };
const video = { name: "b.mp4", size: 1024 };

describe("validasiForm", () => {
  it("C20-UT01 validasiForm (normal): catatan + minimal satu foto", () => {
    expect(validasiForm("Lubang ditambal aspal hotmix.", [foto], [])).toBe(true);
  });

  it("C20-UT02 validasiForm (normal): video opsional", () => {
    expect(validasiForm("Selesai.", [foto], [video])).toBe(true);
  });

  it.each(["", "   ", "\n\t"])("C20-UT03 validasiForm (negatif): catatan %j dianggap kosong", (catatan) => {
    expect(validasiForm(catatan, [foto], [])).toBe(false);
  });

  it("C20-UT04 validasiForm (negatif): tanpa foto ditolak", () => {
    expect(validasiForm("Selesai.", [], [video])).toBe(false);
  });
});

describe("cekKelengkapan", () => {
  it("C20-UT05 cekKelengkapan (normal): menandai bagian kosong (I06-04, I06-05)", () => {
    expect(cekKelengkapan("", [])).toEqual({ catatanKosong: true, fotoKosong: true });
    expect(cekKelengkapan("ok", [])).toEqual({ catatanKosong: false, fotoKosong: true });
    expect(cekKelengkapan(" ", [foto])).toEqual({ catatanKosong: true, fotoKosong: false });
    expect(cekKelengkapan("ok", [foto])).toEqual({ catatanKosong: false, fotoKosong: false });
  });
});

describe("PESAN_TAK_LENGKAP", () => {
  it("C20-UT06 PESAN_TAK_LENGKAP: sama persis dengan DPPL I06-08", () => {
    expect(PESAN_TAK_LENGKAP).toBe("Gagal terkirim: foto dan deskripsi wajib diisi.");
  });
});

describe("cekMediaTerunggah", () => {
  const ID = "11111111-1111-1111-1111-111111111111";
  const media = (path: string, tipe: "foto" | "video", format = path.split(".").pop() ?? "") => ({
    path,
    format,
    ukuran: 1024,
    tipe,
  });

  it("C20-UT07 cekMediaTerunggah (normal): folder hasil milik sendiri", () => {
    expect(cekMediaTerunggah([media(`hasil/${ID}/a.jpg`, "foto")], [media(`hasil/${ID}/b.mp4`, "video")], ID)).toBe(true);
  });

  it("C20-UT08 cekMediaTerunggah (negatif): folder eksekutor lain", () => {
    expect(cekMediaTerunggah([media("hasil/orang-lain/a.jpg", "foto")], [], ID)).toBe(false);
  });

  it("C20-UT09 cekMediaTerunggah (negatif): folder laporan warga", () => {
    expect(cekMediaTerunggah([media(`laporan/${ID}/a.jpg`, "foto")], [], ID)).toBe(false);
  });

  it("C20-UT10 cekMediaTerunggah (negatif): tipe tertukar", () => {
    expect(cekMediaTerunggah([media(`hasil/${ID}/a.mp4`, "video")], [], ID)).toBe(false);
  });

  it("C20-UT11 cekMediaTerunggah (negatif): format tidak cocok dengan ekstensi", () => {
    expect(cekMediaTerunggah([media(`hasil/${ID}/a.jpg`, "foto", "png")], [], ID)).toBe(false);
  });
});

describe("Tambahan HIUPL", () => {
  it("C20-UT12 validasiForm (batas): catatan tepat 1 karakter + tepat 1 foto dianggap lengkap", () => {
    expect(validasiForm("a", [foto], [])).toBe(true);
  });
});
