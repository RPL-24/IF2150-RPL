const LaporanKesehatan = require('../models/LaporanKesehatan');
const CheckIn = require('../models/CheckIn');
const { hitungUsia, selisihHari, tambahHari, tanggalValid } = require('../utils/waktu');

const ACUAN = '2026-11-10';

function buatCheckIn(hariLalu, mood, jamTidur = '22:00', jamBangun = '06:00') {
  return new CheckIn({
    id_check_in: `C-${hariLalu}`,
    tanggal_check_in: tambahHari(ACUAN, -hariLalu),
    skala_mood: mood,
    jam_tidur: `${jamTidur}:00`,
    jam_bangun: `${jamBangun}:00`,
    pola_makan: 'Teratur',
    pemicu_stres: 'Tidak ada',
  });
}

function evaluasi(data, opsi = {}) {
  const laporan = new LaporanKesehatan();
  return { hasil: laporan.evaluateThreshold(data, { acuan: ACUAN, ...opsi }), laporan };
}

describe('LaporanKesehatan.evaluateThreshold (Algo-C07-01)', () => {
  test('data kosong belum dapat dinilai dan tidak melampaui ambang', () => {
    const { hasil, laporan } = evaluasi([]);
    expect(hasil.indikatorRisiko).toBe('Belum Dapat Dinilai');
    expect(hasil.ambangTerlampaui).toBe(false);
    expect(laporan.detectEmergency()).toBe(false);
  });

  test('periode kosong tetap menghitung hari dari check-in terakhir sepanjang riwayat', () => {
    const { hasil } = evaluasi([], { tanggalTerakhir: tambahHari(ACUAN, -20) });
    expect(hasil.jumlahHariTidakCheckIn).toBe(20);
  });

  test('tiga hari mood rendah beruntun menghasilkan risiko Tinggi', () => {
    const { hasil } = evaluasi([buatCheckIn(0, 2), buatCheckIn(1, 1), buatCheckIn(2, 2)]);
    expect(hasil.indikatorRisiko).toBe('Tinggi');
    expect(hasil.ambangTerlampaui).toBe(true);
  });

  test('rangkaian mood rendah putus bila ada tanggal terlewat', () => {
    const { hasil } = evaluasi([buatCheckIn(0, 2), buatCheckIn(1, 2), buatCheckIn(3, 2)]);
    expect(hasil.indikatorRisiko).not.toBe('Tinggi');
  });

  test('rata-rata tidur di bawah 5 jam menghasilkan risiko Sedang', () => {
    const { hasil } = evaluasi([buatCheckIn(0, 4, '02:00', '06:00'), buatCheckIn(1, 4, '02:00', '06:00')]);
    expect(hasil.indikatorRisiko).toBe('Sedang');
  });

  test('durasi tidur melewati tengah malam dihitung benar', () => {
    expect(LaporanKesehatan.hitungDurasiTidur('22:00', '06:00')).toBe(8);
    expect(LaporanKesehatan.hitungDurasiTidur('01:00', '06:30')).toBe(5.5);
  });

  test('kondisi baik dan rutin check-in berisiko Rendah', () => {
    const { hasil, laporan } = evaluasi([buatCheckIn(0, 4), buatCheckIn(1, 5)]);
    expect(hasil.indikatorRisiko).toBe('Rendah');
    expect(hasil.jumlahHariTidakCheckIn).toBe(0);
    expect(laporan.detectEmergency()).toBe(false);
  });
});

describe('LaporanKesehatan.detectEmergency (Algo-C07-02)', () => {
  test('darurat bila tidak aktif check-in dan kondisinya memburuk', () => {
    const { laporan } = evaluasi([buatCheckIn(4, 2), buatCheckIn(5, 1), buatCheckIn(6, 2)]);
    expect(laporan.detectEmergency()).toBe(true);
  });

  test('tidak darurat bila masih aktif check-in walau mood rendah', () => {
    const { laporan } = evaluasi([buatCheckIn(0, 2), buatCheckIn(1, 1), buatCheckIn(2, 2)]);
    expect(laporan.detectEmergency()).toBe(false);
  });

  test('tidak darurat bila tidak aktif tetapi kondisi terakhirnya baik', () => {
    const { laporan } = evaluasi([buatCheckIn(5, 5), buatCheckIn(6, 4)]);
    expect(laporan.detectEmergency()).toBe(false);
  });
});

describe('CheckIn.createCheckIn (Algo-C06-01, Algo-C06-02)', () => {
  const dataSah = { skalaMood: 3, jamTidur: '22:00', jamBangun: '06:00', polaMakan: 'Teratur' };

  test('menerima data yang sah', () => {
    const checkIn = CheckIn.createCheckIn(dataSah);
    expect(checkIn.idCheckIn).toBeTruthy();
    expect(checkIn.catatanRefleksi).toBeNull();
  });

  test.each([
    ['mood di luar rentang', { skalaMood: 6 }],
    ['mood bukan bilangan bulat', { skalaMood: 2.5 }],
    ['format jam salah', { jamTidur: '25:00' }],
    ['durasi tidur nol', { jamBangun: '22:00' }],
    ['pola makan kosong', { polaMakan: '   ' }],
    ['refleksi berupa teks kosong', { catatanRefleksi: '' }],
  ])('menolak %s', (_, ubahan) => {
    expect(() => CheckIn.createCheckIn({ ...dataSah, ...ubahan })).toThrow('Data check-in tidak valid');
  });
});

describe('utilitas waktu', () => {
  test('usia tepat pada hari ulang tahun ke-18 sudah dewasa', () => {
    expect(hitungUsia('2008-11-10', ACUAN)).toBe(18);
    expect(hitungUsia('2008-11-11', ACUAN)).toBe(17);
  });

  test('tanggal yang tidak ada di kalender ditolak', () => {
    expect(tanggalValid('2026-02-30')).toBe(false);
    expect(tanggalValid('2026-02-28')).toBe(true);
  });

  test('selisih hari melintasi bulan', () => {
    expect(selisihHari('2026-10-31', '2026-11-01')).toBe(1);
  });
});
