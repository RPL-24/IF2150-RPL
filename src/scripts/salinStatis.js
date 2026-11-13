// Menyalin berkas View ke public/ untuk deploy Vercel.
//   npm run salin-statis   (dijalankan otomatis oleh Vercel lewat buildCommand di vercel.json)
//
// Vercel mengabaikan express.static(): berkas statis harus berada di public/.
// Hasilnya meniru susunan URL saat lokal: views/pages/masuk.html → public/masuk.html (/masuk),
// views/css/... → public/css/..., views/js/... → public/js/..., ikon dan sw.js di akar.
const fs = require('fs');
const path = require('path');

const DIR_VIEWS = path.join(__dirname, '..', 'views');
const DIR_PUBLIC = path.join(__dirname, '..', 'public');

fs.rmSync(DIR_PUBLIC, { recursive: true, force: true });
fs.mkdirSync(DIR_PUBLIC, { recursive: true });

let jumlah = 0;
for (const nama of fs.readdirSync(DIR_VIEWS)) {
  const asal = path.join(DIR_VIEWS, nama);
  if (nama === 'pages') {
    for (const halaman of fs.readdirSync(asal)) {
      fs.copyFileSync(path.join(asal, halaman), path.join(DIR_PUBLIC, halaman));
      jumlah += 1;
    }
  } else {
    fs.cpSync(asal, path.join(DIR_PUBLIC, nama), { recursive: true });
    jumlah += fs.statSync(asal).isDirectory() ? fs.readdirSync(asal, { recursive: true }).length : 1;
  }
}

console.log(`Berkas statis disalin ke public/ (${jumlah} berkas).`);
