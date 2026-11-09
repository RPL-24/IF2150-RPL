import { describe, expect, it } from "vitest";
import { cekKelengkapan, PESAN_TAK_LENGKAP, validasiForm } from "./validasri-perbaikan";

const foto = { name: "a.jpg", size: 1024 };
const video = { name: "b.mp4", size: 1024 };

describe("validasiForm", () => {
  it("lengkap jika ada catatan dan minimal satu foto", () => {
    expect(validasiForm("Lubang ditambal aspal hotmix.", [foto], [])).toBe(true);
  });

  it("video tidak wajib, tapi boleh ada", () => {
    expect(validasiForm("Selesai.", [foto], [video])).toBe(true);
  });

  it.each(["", "   ", "\n\t"])("catatan %j dianggap kosong", (catatan) => {
    expect(validasiForm(catatan, [foto], [])).toBe(false);
  });

  it("tanpa foto ditolak, walaupun ada video", () => {
    expect(validasiForm("Selesai.", [], [video])).toBe(false);
  });
});

describe("cekKelengkapan", () => {
  it("menandai bagian yang kosong (garis merah I06-04 dan I06-05)", () => {
    expect(cekKelengkapan("", [])).toEqual({ catatanKosong: true, fotoKosong: true });
    expect(cekKelengkapan("ok", [])).toEqual({ catatanKosong: false, fotoKosong: true });
    expect(cekKelengkapan(" ", [foto])).toEqual({ catatanKosong: true, fotoKosong: false });
    expect(cekKelengkapan("ok", [foto])).toEqual({ catatanKosong: false, fotoKosong: false });
  });
});

describe("PESAN_TAK_LENGKAP", () => {
  it("sama persis dengan DPPL I06-08", () => {
    expect(PESAN_TAK_LENGKAP).toBe("Gagal terkirim: foto dan deskripsi wajib diisi.");
  });
});