import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { FormPemeliharaan } from "@/contracts";
import { periksaPemeliharaan } from "@/modules/pemeliharaan/internal/validasi";
import { buatPemeliharaanService, type RepositoriPemeliharaan } from "@/modules/pemeliharaan/service";

const FORM: FormPemeliharaan = {
  idPerangkat: "BAT-01",
  waktuPelaksanaan: "2026-10-28T11:00:00+07:00",
  tindakan: "  Membersihkan terminal baterai  ",
  catatanHasil: "Terminal bersih, sambungan diperiksa.",
};

function buatRepo() {
  return {
    cariPerangkatTeknisi: jest.fn<RepositoriPemeliharaan["cariPerangkatTeknisi"]>(async (_, idPerangkat) => ({
      idPerangkat,
      nama: "Baterai Komunal",
    })),
    daftarPerangkatTeknisi: jest.fn<RepositoriPemeliharaan["daftarPerangkatTeknisi"]>(async () => []),
    simpanCatatan: jest.fn<RepositoriPemeliharaan["simpanCatatan"]>(async () => true),
  };
}

describe("periksaPemeliharaan", () => {
  it("menerima formulir lengkap", () => {
    expect(periksaPemeliharaan(FORM)).toEqual({ valid: true, galat: [] });
  });

  it("menandai setiap kolom wajib yang kosong", () => {
    const hasil = periksaPemeliharaan({ idPerangkat: " ", waktuPelaksanaan: "", tindakan: "", catatanHasil: "" });
    expect(hasil.valid).toBe(false);
    expect(hasil.galat.map((g) => g.kolom).sort()).toEqual([
      "catatanHasil",
      "idPerangkat",
      "tindakan",
      "waktuPelaksanaan",
    ]);
  });

  it.each([null, "teks", 42, []])("menolak body bukan objek: %j", (body) => {
    expect(periksaPemeliharaan(body).valid).toBe(false);
  });

  it("menolak kolom bertipe bukan teks", () => {
    const hasil = periksaPemeliharaan({ ...FORM, tindakan: 123 });
    expect(hasil.galat).toEqual([{ kolom: "tindakan", pesan: "Isi tindakan" }]);
  });

  it.each([
    "2026-10-28T11:00:00", // tanpa zona waktu
    "2026-10-28",
    "28/10/2026 11:00",
    "2026-02-31T11:00:00+07:00", // tanggal mustahil
    "2026-13-01T11:00:00Z",
  ])("menolak waktu %s", (waktuPelaksanaan) => {
    const hasil = periksaPemeliharaan({ ...FORM, waktuPelaksanaan });
    expect(hasil.galat.map((g) => g.kolom)).toEqual(["waktuPelaksanaan"]);
  });

  it.each(["2026-10-28T11:00:00+07:00", "2026-10-28T04:00:00.000Z", "2024-02-29T11:00+07:00"])(
    "menerima waktu %s",
    (waktuPelaksanaan) => {
      expect(periksaPemeliharaan({ ...FORM, waktuPelaksanaan }).valid).toBe(true);
    },
  );
});

describe("PemeliharaanService.simpanCatatan", () => {
  let repo: ReturnType<typeof buatRepo>;
  beforeEach(() => {
    repo = buatRepo();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("menyimpan catatan yang terikat teknisi, perangkat, dan waktu", async () => {
    const hasil = await buatPemeliharaanService("TEK-01", repo).simpanCatatan(FORM);

    expect(hasil.ok).toBe(true);
    expect(repo.cariPerangkatTeknisi).toHaveBeenCalledWith("TEK-01", "BAT-01");
    const baris = repo.simpanCatatan.mock.calls[0][0];
    expect(baris).toMatchObject({
      idTeknisi: "TEK-01",
      idPerangkat: "BAT-01",
      tindakan: "Membersihkan terminal baterai",
      catatanHasil: "Terminal bersih, sambungan diperiksa.",
    });
    expect(baris.waktuPelaksanaan.toISOString()).toBe("2026-10-28T04:00:00.000Z");
    if (hasil.ok) expect(hasil.data.idCatatan).toBe(baris.idCatatan);
  });

  it("mengabaikan idTeknisi dan idCatatan dari body", async () => {
    const palsu = { ...FORM, idTeknisi: "TEK-LAIN", idCatatan: "CTT-PALSU" };
    await buatPemeliharaanService("TEK-01", repo).simpanCatatan(palsu);

    const baris = repo.simpanCatatan.mock.calls[0][0];
    expect(baris.idTeknisi).toBe("TEK-01");
    expect(baris.idCatatan).not.toBe("CTT-PALSU");
  });

  it("UC08 Alt 1: formulir tidak lengkap batal tanpa akses data", async () => {
    const hasil = await buatPemeliharaanService("TEK-01", repo).simpanCatatan({ ...FORM, catatanHasil: " " });

    expect(hasil).toEqual({
      ok: false,
      kode: "VALIDASI_GAGAL",
      pesan: "Isian belum lengkap",
      galat: [{ kolom: "catatanHasil", pesan: "Isi hasil pemeliharaan" }],
    });
    expect(repo.cariPerangkatTeknisi).not.toHaveBeenCalled();
    expect(repo.simpanCatatan).not.toHaveBeenCalled();
  });

  it("menolak perangkat di luar lingkup teknisi tanpa menyimpan", async () => {
    repo.cariPerangkatTeknisi.mockResolvedValue(null);
    const hasil = await buatPemeliharaanService("TEK-01", repo).simpanCatatan(FORM);

    expect(hasil).toMatchObject({ ok: false, kode: "TIDAK_DITEMUKAN" });
    expect(repo.simpanCatatan).not.toHaveBeenCalled();
  });

  it("melaporkan GAGAL_SIMPAN saat INSERT gagal", async () => {
    repo.simpanCatatan.mockResolvedValue(false);
    const hasil = await buatPemeliharaanService("TEK-01", repo).simpanCatatan(FORM);

    expect(hasil).toEqual({ ok: false, kode: "GAGAL_SIMPAN", pesan: "Penyimpanan gagal" });
  });

  it("melaporkan GAGAL_INTERNAL tanpa membocorkan galat database", async () => {
    repo.cariPerangkatTeknisi.mockRejectedValue(new Error("SELECT rahasia gagal"));
    const hasil = await buatPemeliharaanService("TEK-01", repo).simpanCatatan(FORM);

    expect(hasil).toEqual({ ok: false, kode: "GAGAL_INTERNAL", pesan: "Terjadi kesalahan. Coba lagi." });
  });
});
