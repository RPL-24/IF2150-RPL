// Menyusun baris Tabel 4.2 HIUPL dari hasil Jest yang sebenarnya.
//
// Pemakaian (dari folder src/):
//   npx jest --runInBand --json --outputFile=hasil-jest.json
//   node ../docs/M10/assets/skrip/tabel-uji-unit.js hasil-jest.json C20 C21
//
// Judul test wajib berpola:
//   CXX-UTYY [Normal|Batas|Negatif] operasi: prosedur atau masukan → hasil yang diharapkan
// Kolom "Hasil Pengujian" dan "Kesimpulan" diambil dari status test pada berkas JSON, bukan ditulis tangan.
// Test yang judulnya tidak berpola dicetak ke stderr dan membuat skrip keluar dengan kode 1.

const fs = require('fs');

const POLA = /^(C\d\d-UT\d\d) \[(Normal|Batas|Negatif)\] ([^:]+?): (.+?) → ([^→]+)$/;

function aman(teks) {
  return String(teks).replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function pesanGagal(hasil) {
  const baris = (hasil.failureMessages || []).join('\n').split('\n').map((b) => b.trim()).filter(Boolean);
  return baris[0] ? `Gagal: ${baris[0]}` : 'Gagal';
}

function main() {
  const [berkasJson, ...daftarKelas] = process.argv.slice(2);
  if (!berkasJson || daftarKelas.length === 0) {
    console.error('Pemakaian: node tabel-uji-unit.js <hasil-jest.json> <CXX> [CYY ...]');
    process.exit(2);
  }

  const jest = JSON.parse(fs.readFileSync(berkasJson, 'utf8'));
  const semua = jest.testResults.flatMap((suite) => suite.assertionResults);
  let adaSalah = false;

  for (const kelas of daftarKelas) {
    const milikKelas = semua.filter((h) => h.title.startsWith(`${kelas}-UT`));
    const baris = [];
    for (const h of milikKelas) {
      const cocok = POLA.exec(h.title);
      if (!cocok) {
        console.error(`Judul tidak berpola: ${h.title}`);
        adaSalah = true;
        continue;
      }
      const [, id, jenis, operasi, masukan, harapan] = cocok;
      const lulus = h.status === 'passed';
      baris.push({
        id,
        teks: `| ${id} | \`${aman(operasi)}\` | ${jenis} | ${aman(masukan)} | ${aman(harapan)} | ${lulus ? 'Sesuai dengan hasil yang diharapkan' : aman(pesanGagal(h))} | ${lulus ? 'Pass' : 'Fail'} |`,
      });
    }
    baris.sort((a, b) => a.id.localeCompare(b.id));

    const lulus = milikKelas.filter((h) => h.status === 'passed').length;
    console.log(`<!-- ${kelas}: ${milikKelas.length} test, ${lulus} lulus -->`);
    console.log('| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |');
    console.log('| :--- | :--- | :--- | :--- | :--- | :--- | :--- |');
    baris.forEach((b) => console.log(b.teks));
    console.log('');
  }

  if (adaSalah) process.exit(1);
}

main();
