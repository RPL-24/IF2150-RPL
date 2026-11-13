import { describe, expect, it } from "vitest";
import { cekKelengkapan, cekMediaTerunggah, PESAN_TAK_LENGKAP, validasiForm } from "./validasi-perbaikan";

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

describe("cekMediaTerunggah", () => {
  const ID = "11111111-1111-1111-1111-111111111111";
  const media = (path: string, tipe: "foto" | "video", format = path.split(".").pop() ?? "") => ({
    path,
    format,
    ukuran: 1024,
    tipe,
  });

  it("menerima foto dan video di folder hasil milik sendiri", () => {
    expect(cekMediaTerunggah([media(`hasil/${ID}/a.jpg`, "foto")], [media(`hasil/${ID}/b.mp4`, "video")], ID)).toBe(true);
  });

  it("menolak berkas di folder eksekutor lain", () => {
    expect(cekMediaTerunggah([media("hasil/orang-lain/a.jpg", "foto")], [], ID)).toBe(false);
  });

  it("menolak berkas dari folder laporan warga", () => {
    expect(cekMediaTerunggah([media(`laporan/${ID}/a.jpg`, "foto")], [], ID)).toBe(false);
  });

  it("menolak tipe yang tertukar (video di daftar foto)", () => {
    expect(cekMediaTerunggah([media(`hasil/${ID}/a.mp4`, "video")], [], ID)).toBe(false);
  });

  it("menolak format yang tidak cocok dengan ekstensi path", () => {
    expect(cekMediaTerunggah([media(`hasil/${ID}/a.jpg`, "foto", "png")], [], ID)).toBe(false);
  });
});