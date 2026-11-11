// src/tests/iuran/iuran.test.ts
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ModulIuran, type KonteksSesiIuran, type RepositoriIuran } from "@/modules/iuran/internal/ModulIuran";
import { Rekapitulasi } from "@/modules/iuran/internal/Rekapitulasi";

const createMockRepo = (): jest.Mocked<RepositoriIuran> => ({
  daftarPeriode: jest.fn(),
  ambilPeriodeById: jest.fn(),
  ambilTagihanWarga: jest.fn(),
  ambilPemakaianPeriode: jest.fn(),
  ambilTarifPeriode: jest.fn(),
  simpanTagihanDraft: jest.fn(),
  tetapkanPeriodeDanTagihanFinal: jest.fn(),
  ambilTagihanFinalPeriode: jest.fn(),
  simpanRekapitulasi: jest.fn(),
});

describe("ModulIuran - UC02, UC09, UC10, UC11", () => {
  let repo: jest.Mocked<RepositoriIuran>;
  let modul: ModulIuran;

  const sesiWarga: KonteksSesiIuran = {
    peran: "WARGA",
    idWarga: 1,
    idKomunitas: "kom-1",
  };

  const sesiPengurus: KonteksSesiIuran = {
    peran: "PENGURUS",
    idPengurus: "pengurus-1",
    idKomunitas: "kom-1",
  };

  beforeEach(() => {
    repo = createMockRepo();
    modul = new ModulIuran(repo);
  });

  describe("UC02 - lihatTagihanFinal (Algo-050)", () => {
    it("mengembalikan TIDAK_DITEMUKAN bila periode belum FINAL (tanpa query tagihan warga)", async () => {
      repo.ambilPeriodeById.mockResolvedValue({
        idPeriode: "2026-11",
        bulan: 11,
        tahun: 2026,
        statusFinal: false,
      });

      const hasil = await modul.lihatTagihanFinal(sesiWarga, "2026-11");
      expect(hasil.ok).toBe(false);
      if (!hasil.ok) {
        expect(hasil.kode).toBe("TIDAK_DITEMUKAN");
      }
      expect(repo.ambilTagihanWarga).not.toHaveBeenCalled();
    });

    it("mengembalikan tagihan bila periode dan tagihan berstatus FINAL", async () => {
      repo.ambilPeriodeById.mockResolvedValue({
        idPeriode: "2026-10",
        bulan: 10,
        tahun: 2026,
        statusFinal: true,
      });
      repo.ambilTagihanWarga.mockResolvedValue({
        idTagihan: "tgh-2026-10-1",
        idWarga: 1,
        idPeriode: "2026-10",
        jumlahIuran: 110000,
        status: "FINAL",
        rincian: {
          volumeAirM3: 10,
          energiKWh: 50,
          biayaTetap: 15000,
          subtotalAir: 20000,
          subtotalEnergi: 75000,
        },
      });

      const hasil = await modul.lihatTagihanFinal(sesiWarga, "2026-10");
      expect(hasil.ok).toBe(true);
      if (hasil.ok) {
        expect(hasil.data.jumlahIuran).toBe(110000);
        expect(hasil.data.status).toBe("FINAL");
      }
    });
  });

  describe("UC09 - analisisPemakaian (Algo-036)", () => {
    it("menolak non-Pengurus SEBELUM melakukan query ke database", async () => {
      const hasil = await modul.analisisPemakaian(sesiWarga, "2026-11");
      expect(hasil.ok).toBe(false);
      if (!hasil.ok) {
        expect(hasil.kode).toBe("TIDAK_BERWENANG");
      }
      expect(repo.ambilPeriodeById).not.toHaveBeenCalled();
      expect(repo.ambilPemakaianPeriode).not.toHaveBeenCalled();
    });

    it("menghitung agregat pemakaian komunal beserta rincian pekanan M1..M4", async () => {
      repo.ambilPeriodeById.mockResolvedValue({
        idPeriode: "2026-11",
        bulan: 11,
        tahun: 2026,
        statusFinal: false,
      });
      repo.ambilPemakaianPeriode.mockResolvedValue([
        {
          idPemakaian: "p1",
          idWarga: 1,
          idPeriode: "2026-11",
          volumeAirM3: 12,
          energiKWh: 40,
          waktuCatat: "2026-11-05T08:00:00.000Z", // M1
        },
        {
          idPemakaian: "p2",
          idWarga: 2,
          idPeriode: "2026-11",
          volumeAirM3: 18,
          energiKWh: 60,
          waktuCatat: "2026-11-18T08:00:00.000Z", // M3
        },
      ]);

      const hasil = await modul.analisisPemakaian(sesiPengurus, "2026-11");
      expect(hasil.ok).toBe(true);
      if (hasil.ok) {
        expect(hasil.data.totalAirM3).toBe(30);
        expect(hasil.data.totalEnergiKWh).toBe(100);
        expect(hasil.data.rincianPekanan).toHaveLength(4);
        expect(hasil.data.rincianPekanan[0]).toEqual({ label: "M1", airM3: 12, energiKWh: 40 });
        expect(hasil.data.rincianPekanan[2]).toEqual({ label: "M3", airM3: 18, energiKWh: 60 });
      }
    });
  });

  describe("UC10 - hitungPratinjau & tetapkanFinal (Algo-013..016, 028)", () => {
    it("menghitung pratinjau DRAFT dan menyimpannya ke repository", async () => {
      repo.ambilPeriodeById.mockResolvedValue({
        idPeriode: "2026-11",
        bulan: 11,
        tahun: 2026,
        statusFinal: false,
      });
      repo.ambilPemakaianPeriode.mockResolvedValue([
        {
          idPemakaian: "p1",
          idWarga: 1,
          idPeriode: "2026-11",
          volumeAirM3: 10,
          energiKWh: 20,
          waktuCatat: "2026-11-25T10:00:00.000Z",
        },
      ]);
      repo.ambilTarifPeriode.mockResolvedValue({
        idAturan: "tarif-1",
        idPeriode: "2026-11",
        biayaTetap: 10000,
        tarifAirPerM3: 2500,
        tarifEnergiPerKWh: 1500,
      });
      repo.simpanTagihanDraft.mockResolvedValue(true);

      const hasil = await modul.hitungPratinjau(sesiPengurus, "2026-11");
      expect(hasil.ok).toBe(true);
      if (hasil.ok) {
        expect(hasil.data.totalIuran).toBe(65000);
        expect(hasil.data.tagihan[0].status).toBe("DRAFT");
      }
      expect(repo.simpanTagihanDraft).toHaveBeenCalledTimes(1);
    });

    it("menolak tetapkanFinal jika pemanggil bukan Pengurus", async () => {
      const hasil = await modul.tetapkanFinal(sesiWarga, "2026-11");
      expect(hasil.ok).toBe(false);
      if (!hasil.ok) {
        expect(hasil.kode).toBe("TIDAK_BERWENANG");
      }
      expect(repo.tetapkanPeriodeDanTagihanFinal).not.toHaveBeenCalled();
    });

    it("menolak tetapkanFinal dengan DATA_BELUM_LENGKAP jika ada data warga yang null", async () => {
      repo.ambilPeriodeById.mockResolvedValue({
        idPeriode: "2026-11",
        bulan: 11,
        tahun: 2026,
        statusFinal: false,
      });
      repo.ambilPemakaianPeriode.mockResolvedValue([
        {
          idPemakaian: "p1",
          idWarga: 1,
          idPeriode: "2026-11",
          volumeAirM3: 10,
          energiKWh: null, // belum lengkap!
          waktuCatat: null,
        },
      ]);
      repo.ambilTarifPeriode.mockResolvedValue({
        idAturan: "tarif-1",
        idPeriode: "2026-11",
        biayaTetap: 10000,
        tarifAirPerM3: 2500,
        tarifEnergiPerKWh: 1500,
      });

      const hasil = await modul.tetapkanFinal(sesiPengurus, "2026-11");
      expect(hasil.ok).toBe(false);
      if (!hasil.ok) {
        expect(hasil.kode).toBe("DATA_BELUM_LENGKAP");
      }
      expect(repo.tetapkanPeriodeDanTagihanFinal).not.toHaveBeenCalled();
    });

    it("berhasil menetapkan periode dan tagihan menjadi FINAL bila data lengkap", async () => {
      repo.ambilPeriodeById.mockResolvedValue({
        idPeriode: "2026-11",
        bulan: 11,
        tahun: 2026,
        statusFinal: false,
      });
      repo.ambilPemakaianPeriode.mockResolvedValue([
        {
          idPemakaian: "p1",
          idWarga: 1,
          idPeriode: "2026-11",
          volumeAirM3: 10,
          energiKWh: 20,
          waktuCatat: "2026-11-25T10:00:00.000Z",
        },
      ]);
      repo.ambilTarifPeriode.mockResolvedValue({
        idAturan: "tarif-1",
        idPeriode: "2026-11",
        biayaTetap: 10000,
        tarifAirPerM3: 2500,
        tarifEnergiPerKWh: 1500,
      });
      repo.simpanTagihanDraft.mockResolvedValue(true);
      repo.tetapkanPeriodeDanTagihanFinal.mockResolvedValue({
        idPeriode: "2026-11",
        bulan: 11,
        tahun: 2026,
        statusFinal: true,
      });

      const hasil = await modul.tetapkanFinal(sesiPengurus, "2026-11");
      expect(hasil.ok).toBe(true);
      if (hasil.ok) {
        expect(hasil.data.statusFinal).toBe(true);
      }
    });
  });

  describe("UC11 - buatRekapitulasi & ekspor (Algo-022)", () => {
    it("menghasilkan RekapitulasiDTO serta mendukung ekspor CSV dan PDF", async () => {
      repo.ambilPeriodeById.mockResolvedValue({
        idPeriode: "2026-10",
        bulan: 10,
        tahun: 2026,
        statusFinal: true,
      });
      repo.ambilTagihanFinalPeriode.mockResolvedValue([
        {
          idTagihan: "tgh-1",
          idWarga: 1,
          namaWarga: "Budi Santoso",
          idPeriode: "2026-10",
          jumlahIuran: 65000,
          status: "FINAL",
          rincian: {
            volumeAirM3: 10,
            energiKWh: 20,
            biayaTetap: 10000,
            subtotalAir: 25000,
            subtotalEnergi: 30000,
          },
        },
      ]);
      repo.simpanRekapitulasi.mockImplementation(async (r) => r);

      const hasil = await modul.buatRekapitulasi(sesiPengurus, "2026-10");
      expect(hasil.ok).toBe(true);
      if (hasil.ok) {
        expect(hasil.data.totalIuran).toBe(65000);
        const csv = Rekapitulasi.toCSV(hasil.data);
        expect(csv).toContain("Budi Santoso");
        expect(csv).toContain("65000");

        const pdf = Rekapitulasi.toPDFBuffer(hasil.data);
        expect(pdf.toString("utf-8")).toContain("%PDF-");
      }
    });
  });
});