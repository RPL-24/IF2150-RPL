// Profiling Barang.getKatalog (kode asli proyek) terhadap basis data yang sudah diisi isi-data-uji.js.
//   N=40 node profil-katalog.js ../../../../src "label" > hasil.txt
const path = require('path'); const { Pool } = require('pg');
const SRC = process.argv[2]; const LABEL = process.argv[3] || 'run';
const Barang = require(path.join(SRC, 'models', 'Barang.js'));
const Pencarian = require(path.join(SRC, 'controllers', 'PencarianController.js'));
const pool = new Pool({ max: 1 }); // koneksi dari variabel lingkungan PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const SKENARIO = [
  ['A beranda katalog (tanpa filter, terbaru, hal 1)', {}],
  ['B cari "jas praktikum"', { daftarKata: Pencarian.siapkanPencarian('jas praktikum').daftarKata }],
  ['C kategori Kalkulator + harga 50rb-200rb + termurah', { kategori: 'Kalkulator', hargaMin: 50000, hargaMaks: 200000, urut: 'termurah' }],
  ['D beranda halaman 500 (offset 9980)', { offset: 9980 }],
  ['E cari kata yang tidak ada', { daftarKata: ['zzzqqq'] }],
];
(async () => {
  console.log(`===== ${LABEL} =====`);
  for (const [nama, kriteria] of SKENARIO) {
    const k = { batas: 20, offset: 0, ...kriteria };
    for (let i = 0; i < 3; i++) await Barang.getKatalog(k, pool); // pemanasan
    const total = [], perKueri = [[], []];
    let hasil;
    for (let i = 0; i < (Number(process.env.N) || 15); i++) {
      let n = 0;
      const klien = { query: async (t, v) => { const t0 = process.hrtime.bigint(); const r = await pool.query(t, v); perKueri[n++].push(Number(process.hrtime.bigint() - t0) / 1e6); return r; } };
      const t0 = process.hrtime.bigint();
      hasil = await Barang.getKatalog(k, klien);
      total.push(Number(process.hrtime.bigint() - t0) / 1e6);
    }
    console.log(`\n## ${nama}\n   total=${hasil.total} baris, dikembalikan=${hasil.daftar.length}`);
    console.log(`   median getKatalog: ${median(total).toFixed(1)} ms (COUNT ${median(perKueri[0]).toFixed(1)} ms + data ${median(perKueri[1]).toFixed(1)} ms), min ${Math.min(...total).toFixed(1)}, maks ${Math.max(...total).toFixed(1)}`);
    // Rencana eksekusi kedua kueri
    let n = 0;
    const penjelas = { query: async (t, v) => { const r = await pool.query(t, v); const e = await pool.query('EXPLAIN (ANALYZE, BUFFERS) ' + t, v); console.log(`   -- rencana kueri ${++n}:`); for (const b of e.rows) console.log('      ' + b['QUERY PLAN']); return r; } };
    await Barang.getKatalog(k, penjelas);
  }
  await pool.end();
})().catch((e) => { console.error(e); process.exit(1); });
