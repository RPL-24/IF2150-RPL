/**
 * Pembuat gambar PNG sederhana (tanpa dependensi) untuk foto laporan contoh pada seed.
 * Menghasilkan gambar bergradasi dengan warna dasar per kategori, cukup untuk menguji tampilan.
 */
import zlib from 'node:zlib';

function chunk(tipe, data) {
  const panjang = Buffer.alloc(4);
  panjang.writeUInt32BE(data.length);
  const isi = Buffer.concat([Buffer.from(tipe, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(isi) >>> 0);
  return Buffer.concat([panjang, isi, crc]);
}

/** @param {[number, number, number]} warna RGB 0-255 */
export function buatPng(warna, lebar = 480, tinggi = 320) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(lebar, 0);
  ihdr.writeUInt32BE(tinggi, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  const baris = Buffer.alloc((lebar * 3 + 1) * tinggi);
  for (let y = 0; y < tinggi; y++) {
    const awal = y * (lebar * 3 + 1);
    baris[awal] = 0;
    const terang = 0.65 + 0.35 * (y / tinggi);
    for (let x = 0; x < lebar; x++) {
      const garis = (x + y) % 60 < 6 ? 0.85 : 1;
      for (let c = 0; c < 3; c++) baris[awal + 1 + x * 3 + c] = Math.min(255, Math.round(warna[c] * terang * garis));
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(baris)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
