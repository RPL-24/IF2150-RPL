import { formatRupiah, hitungHpp, hitungMargin } from './margin';

export type ResepProduk = {
  idBahan: string;
  hargaBeli: number;
  takaran: number;
};

export type ProdukResep = {
  idProduk: string;
  namaProduk: string;
  hargaJual: number;
  resep: ResepProduk[];
};

export type HasilKalkulasiProduk = {
  idProduk: string;
  namaProduk: string;
  hargaJual: number;
  margin: number;
  rugi: boolean;
};

export type ArahPerubahan = 'naik' | 'turun' | 'tetap';

export function bandingkanHarga(hargaLama: number, hargaBaru: number): ArahPerubahan {
  if (hargaBaru > hargaLama) return 'naik';
  if (hargaBaru < hargaLama) return 'turun';
  return 'tetap';
}

// Hitung ulang HPP dan margin semua produk yang memakai bahan tersebut
// dengan harga beli baru. Produk yang tidak memakai bahan itu diabaikan.
export function hitungUlangProduk(
  daftarProduk: ProdukResep[],
  idBahan: string,
  hargaBaru: number,
): HasilKalkulasiProduk[] {
  const hasil: HasilKalkulasiProduk[] = [];
  for (const produk of daftarProduk) {
    if (!produk.resep.some((r) => r.idBahan === idBahan)) continue;

    const hpp = hitungHpp(
      produk.resep.map((r) => ({
        hargaBeli: r.idBahan === idBahan ? hargaBaru : r.hargaBeli,
        takaran: r.takaran,
      })),
    );
    const margin = hitungMargin(produk.hargaJual, hpp);
    hasil.push({
      idProduk: produk.idProduk,
      namaProduk: produk.namaProduk,
      hargaJual: produk.hargaJual,
      margin,
      rugi: margin < 0,
    });
  }
  return hasil;
}

export function cekMarginNegatif(hasil: HasilKalkulasiProduk[]): HasilKalkulasiProduk[] {
  return hasil.filter((h) => h.rugi);
}

export const JUDUL_KERUGIAN = 'Margin Negatif!';

// Persen perubahan, dibulatkan 1 desimal. Contoh: 40.000 -> 45.000 = 12,5.
export function hitungPersen(dari: number, ke: number): number {
  if (dari === 0) return 0;
  return Math.round(((ke - dari) / Math.abs(dari)) * 1000) / 10;
}

// Contoh: 12.5 -> "+12,5%", -8.3 -> "-8,3%", 0 -> "0%".
export function formatPersen(nilai: number): string {
  const tanda = nilai > 0 ? '+' : nilai < 0 ? '-' : '';
  return `${tanda}${String(Math.abs(nilai)).replace('.', ',')}%`;
}

export function buatPesanKerugian(
  namaProduk: string,
  namaBahan: string,
  margin: number,
  hargaJual: number,
  hargaBahanBaru: number,
): string {
  const persen = formatPersen(Math.round((margin / hargaJual) * 1000) / 10);
  return (
    `${namaProduk} rugi ~${formatRupiah(Math.abs(margin))}/porsi (${persen}) ` +
    `karena harga ${namaBahan} naik menjadi ${formatRupiah(hargaBahanBaru)}.`
  );
}

export function buatJudulPerubahanHarga(
  namaBahan: string,
  hargaLama: number,
  hargaBaru: number,
): string {
  const arah = bandingkanHarga(hargaLama, hargaBaru);
  if (arah === 'tetap') return `Harga ${namaBahan} diperbarui`;
  return `Harga ${namaBahan} ${arah} ${formatPersen(hitungPersen(hargaLama, hargaBaru))}`;
}

export function buatPesanPerubahanHarga(
  hargaLama: number,
  hargaBaru: number,
  jumlahProdukTerdampak: number,
): string {
  const dasar = `Harga beli berubah dari ${formatRupiah(hargaLama)} menjadi ${formatRupiah(hargaBaru)}.`;
  return jumlahProdukTerdampak > 0
    ? `${dasar} Periksa dampaknya pada HPP produk.`
    : dasar;
}

const NAMA_BULAN = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGS', 'SEP', 'OKT', 'NOV', 'DES'];

function samaHari(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// "HARI INI · 28 OKT 2026", "KEMARIN · 27 OKT 2026", atau "20 OKT 2026".
export function labelHari(waktu: Date, sekarang: Date): string {
  const tanggal = `${waktu.getDate()} ${NAMA_BULAN[waktu.getMonth()]} ${waktu.getFullYear()}`;
  if (samaHari(waktu, sekarang)) return `HARI INI · ${tanggal}`;
  const kemarin = new Date(sekarang);
  kemarin.setDate(kemarin.getDate() - 1);
  if (samaHari(waktu, kemarin)) return `KEMARIN · ${tanggal}`;
  return tanggal;
}

export function formatJam(waktu: Date): string {
  const dua = (n: number) => String(n).padStart(2, '0');
  return `${dua(waktu.getHours())}.${dua(waktu.getMinutes())}`;
}

// Mengelompokkan daftar (urut terbaru dulu) per hari, urutan dipertahankan.
export function kelompokkanPerHari<T>(
  daftar: T[],
  ambilWaktu: (item: T) => Date,
  sekarang: Date,
): { label: string; item: T[] }[] {
  const hasil: { label: string; item: T[] }[] = [];
  for (const item of daftar) {
    const label = labelHari(ambilWaktu(item), sekarang);
    const terakhir = hasil[hasil.length - 1];
    if (terakhir && terakhir.label === label) terakhir.item.push(item);
    else hasil.push({ label, item: [item] });
  }
  return hasil;
}
