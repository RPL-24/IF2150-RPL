import { describe, expect, it } from "@jest/globals";
import { JENIS_GANGGUAN, periksaLaporan } from "@/modules/laporan/internal/validasi";

const FORM = { jenisGangguan: "Kebocoran pipa", deskripsi: "Pipa dekat balai warga bocor.", fotoPendukung: [] as string[] };

describe("periksaLaporan", () => {
  it("menerima formulir lengkap dari daftar jenis komunitas", () => {
    for (const jenis of JENIS_GANGGUAN) {
      expect(periksaLaporan({ ...FORM, jenisGangguan: jenis })).toEqual({ valid: true, galat: [] });
    }
  });

  it("menandai kolom wajib yang kosong atau hanya spasi", () => {
    const hasil = periksaLaporan({ jenisGangguan: " ", deskripsi: "   ", fotoPendukung: [] });
    expect(hasil.valid).toBe(false);
    expect(hasil.galat.map((g) => g.kolom).sort()).toEqual(["deskripsi", "jenisGangguan"]);
  });

  it("menolak jenis di luar daftar", () => {
    expect(periksaLaporan({ ...FORM, jenisGangguan: "Gempa" }).galat[0].kolom).toBe("jenisGangguan");
  });

  it("menolak deskripsi lebih dari 1000 karakter", () => {
    expect(periksaLaporan({ ...FORM, deskripsi: "a".repeat(1001) }).galat[0].kolom).toBe("deskripsi");
  });

  it("menolak URI foto dari klien", () => {
    const hasil = periksaLaporan({ ...FORM, fotoPendukung: ["file:///etc/passwd"] });
    expect(hasil.galat).toEqual([{ kolom: "fotoPendukung", pesan: "Unggah foto belum tersedia" }]);
  });

  it.each([null, "teks", 42, []])("menolak body bukan objek: %j", (body) => {
    expect(periksaLaporan(body).valid).toBe(false);
  });
});
