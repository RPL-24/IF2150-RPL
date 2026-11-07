// src/tests/iuran/iuran.test.ts
import { ModulIuran, KonteksSesiIuran } from '../../modules/iuran/internal/ModulIuran';
import { IuranRepository } from '../../modules/iuran/repository';

const createMockRepo = (): jest.Mocked<IuranRepository> => ({
  ambilPeriodeById: jest.fn(),
  ambilTagihanFinalWarga: jest.fn(),
  ambilPemakaianPeriode: jest.fn(),
  ambilTarifAktif: jest.fn(),
  simpanTagihanDraft: jest.fn(),
  tetapkanPeriodeDanTagihanFinal: jest.fn(),
  ambilTagihanFinalPeriode: jest.fn(),
});

describe('ModulIuran - UC02, UC09, UC10', () => {
  let repo: jest.Mocked<IuranRepository>;
  let modul: ModulIuran;

  const sesiWarga: KonteksSesiIuran = {
    idAkun: 'akun-warga-1',
    peran: 'WARGA',
    idWarga: 'warga-1',
  };

  const sesiPengurus: KonteksSesiIuran = {
    idAkun: 'akun-pengurus-1',
    peran: 'PENGURUS',
  };

  beforeEach(() => {
    repo = createMockRepo();
    modul = new ModulIuran(repo);
  });

  describe('UC02 - ambilTagihanWarga (Algo-050)', () => {
    it('mengembalikan daftar kosong bila periode masih DRAFT', async () => {
      repo.ambilPeriodeById.mockResolvedValue({
        id: 'periode-2026-11',
        nama: 'November 2026',
        status: 'DRAFT',
      });

      const hasil = await modul.ambilTagihanWarga(sesiWarga, 'periode-2026-11');
      expect(hasil).toEqual([]);
      expect(repo.ambilTagihanFinalWarga).not.toHaveBeenCalled();
    });

    it('hanya mengembalikan tagihan berstatus FINAL milik warga sesi', async () => {
      repo.ambilPeriodeById.mockResolvedValue({
        id: 'periode-2026-10',
        nama: 'Oktober 2026',
        status: 'FINAL',
      });
      repo.ambilTagihanFinalWarga.mockResolvedValue([
        {
          idWarga: 'warga-1',
          idPeriode: 'periode-2026-10',
          volumeAirM3: 10,
          energiListrikKwh: 50,
          biayaAir: 20000,
          biayaListrik: 75000,
          biayaBeban: 15000,
          totalTagihan: 110000,
          status: 'FINAL',
        },
      ]);

      const hasil = await modul.ambilTagihanWarga(sesiWarga, 'periode-2026-10');
      expect(hasil).toHaveLength(1);
      expect(hasil[0].totalTagihan).toBe(110000);
    });
  });

  describe('UC09 - hitungAgregatKomunal (Algo-036)', () => {
    it('menolak non-Pengurus SEBELUM melakukan query ke database', async () => {
      await expect(
        modul.hitungAgregatKomunal(sesiWarga, 'periode-2026-11')
      ).rejects.toThrow('AKSES_DITOLAK_BUKAN_PENGURUS');

      expect(repo.ambilPeriodeById).not.toHaveBeenCalled();
      expect(repo.ambilPemakaianPeriode).not.toHaveBeenCalled();
    });

    it('menghitung total dan rata-rata pemakaian komunal dengan benar untuk Pengurus', async () => {
      repo.ambilPeriodeById.mockResolvedValue({
        id: 'periode-2026-11',
        nama: 'November 2026',
        status: 'DRAFT',
      });
      repo.ambilPemakaianPeriode.mockResolvedValue([
        { idWarga: 'warga-1', volumeAirM3: 12, energiListrikKwh: 40 },
        { idWarga: 'warga-2', volumeAirM3: 18, energiListrikKwh: 60 },
      ]);

      const agregat = await modul.hitungAgregatKomunal(sesiPengurus, 'periode-2026-11');
      expect(agregat.totalAirM3).toBe(30);
      expect(agregat.totalListrikKwh).toBe(100);
      expect(agregat.rataRataAirM3).toBe(15);
      expect(agregat.rataRataListrikKwh).toBe(50);
      expect(agregat.jumlahWargaTercatat).toBe(2);
    });
  });

  describe('UC10 - hitungPratinjauIuran & tetapkanFinal', () => {
    it('menghitung pratinjau DRAFT dan menyimpannya ke repository', async () => {
      repo.ambilPeriodeById.mockResolvedValue({
        id: 'periode-2026-11',
        nama: 'November 2026',
        status: 'DRAFT',
      });
      repo.ambilPemakaianPeriode.mockResolvedValue([
        { idWarga: 'warga-1', volumeAirM3: 10, energiListrikKwh: 20 },
      ]);
      repo.ambilTarifAktif.mockResolvedValue({
        id: 'tarif-1',
        biayaBebanTetap: 10000,
        tarifPerM3Air: 2500,
        tarifPerKwhListrik: 1500,
      });

      const pratinjau = await modul.hitungPratinjauIuran(sesiPengurus, 'periode-2026-11');
      expect(pratinjau).toHaveLength(1);
      expect(pratinjau[0].totalTagihan).toBe(10 * 2500 + 20 * 1500 + 10000); // 65000
      expect(pratinjau[0].status).toBe('DRAFT');
      expect(repo.simpanTagihanDraft).toHaveBeenCalledTimes(1);
    });
  });
});