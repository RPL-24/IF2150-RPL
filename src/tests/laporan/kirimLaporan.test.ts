import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { KonteksSesi } from "@/lib/auth/konteks";
import { ModulLaporan, type AnggotaKomunitas, type RepositoriLaporan } from "@/modules/laporan/internal/ModulLaporan";
import { LaporanController } from "@/modules/laporan/service";

const WARGA: KonteksSesi = {
  email: "warga@fajar.test",
  nama: "Sari Lestari",
  statusAkun: "DISETUJUI",
  peran: "WARGA",
  idWarga: 7,
  idKomunitas: "KOM-1",
};
const TEKNISI: KonteksSesi = {
  email: "teknisi@fajar.test",
  nama: "Arif Pratama",
  statusAkun: "DISETUJUI",
  peran: "TEKNISI",
  idTeknisi: "TEK-01",
};
const FORM = { jenisGangguan: "Kebocoran pipa", deskripsi: "Pipa dekat balai warga bocor.", fotoPendukung: [] };

function buat(sesi: KonteksSesi, anggota = true, simpan = true) {
  const repo = { simpanLaporan: jest.fn<RepositoriLaporan["simpanLaporan"]>(async () => simpan) };
  const akun = { validasiKeanggotaan: jest.fn<AnggotaKomunitas["validasiKeanggotaan"]>(async () => anggota) };
  return { repo, akun, controller: new LaporanController(sesi, new ModulLaporan(repo, akun)) };
}

describe("LaporanController.kirimLaporan (Algo-025, Algo-034)", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("menyimpan laporan berstatus MENUNGGU milik warga sesi", async () => {
    const { repo, akun, controller } = buat(WARGA);
    const hasil = await controller.kirimLaporan({ ...FORM, deskripsi: "  Pipa bocor  " });

    expect(hasil.ok).toBe(true);
    if (!hasil.ok) return;
    expect(hasil.data.status).toBe("MENUNGGU");
    expect(akun.validasiKeanggotaan).toHaveBeenCalledWith(7, "KOM-1");
    expect(repo.simpanLaporan).toHaveBeenCalledTimes(1);
    expect(repo.simpanLaporan.mock.calls[0][0]).toMatchObject({
      idLaporan: hasil.data.idLaporan,
      idWarga: 7,
      deskripsi: "Pipa bocor",
      status: "MENUNGGU",
    });
  });

  it("mengabaikan idWarga yang disusupkan di body", async () => {
    const { repo, controller } = buat(WARGA);
    await controller.kirimLaporan({ ...FORM, idWarga: 999, idKomunitas: "KOM-LAIN", status: "SELESAI" });
    expect(repo.simpanLaporan.mock.calls[0][0]).toMatchObject({ idWarga: 7, status: "MENUNGGU" });
  });

  it("menolak formulir tidak valid tanpa memeriksa keanggotaan atau menyimpan", async () => {
    const { repo, akun, controller } = buat(WARGA);
    const hasil = await controller.kirimLaporan({ jenisGangguan: "", deskripsi: "", fotoPendukung: [] });
    expect(hasil).toMatchObject({ ok: false, kode: "VALIDASI_GAGAL" });
    expect(akun.validasiKeanggotaan).not.toHaveBeenCalled();
    expect(repo.simpanLaporan).not.toHaveBeenCalled();
  });

  it("menolak non-anggota komunitas sebelum laporan dibuat (Algo-003)", async () => {
    const { repo, controller } = buat(WARGA, false);
    expect(await controller.kirimLaporan(FORM)).toMatchObject({ ok: false, kode: "TIDAK_BERWENANG" });
    expect(repo.simpanLaporan).not.toHaveBeenCalled();
  });

  it("menolak peran selain warga", async () => {
    const { repo, controller } = buat(TEKNISI);
    expect(await controller.kirimLaporan(FORM)).toMatchObject({ ok: false, kode: "TIDAK_BERWENANG" });
    expect(repo.simpanLaporan).not.toHaveBeenCalled();
  });

  it("gagal simpan tidak pernah dilaporkan sebagai sukses", async () => {
    const { controller } = buat(WARGA, true, false);
    expect(await controller.kirimLaporan(FORM)).toMatchObject({ ok: false, kode: "GAGAL_SIMPAN" });
  });

  it("galat tak terduga menjadi GAGAL_INTERNAL", async () => {
    const { akun, controller } = buat(WARGA);
    akun.validasiKeanggotaan.mockRejectedValueOnce(new Error("koneksi putus"));
    expect(await controller.kirimLaporan(FORM)).toMatchObject({ ok: false, kode: "GAGAL_INTERNAL" });
  });
});
