// Uji use case UC19 sampai UC24 dan KNF02 (Modul E) lewat peramban sungguhan.
//
// Prasyarat: aplikasi berjalan (npm start) dengan basis data hasil `npm run db:init` dan `npm run db:seed`
// yang masih bersih, server SMTP lokal di port 1025 dengan API ala Mailpit di port 8025, dan Chrome.
//
// Pemakaian (dari folder src/):
//   node ../docs/M10/assets/skrip/uji-use-case-modul-e.cjs <path playwright-core> <label> [chrome.exe]
//   label: "v9.0" untuk kode tag v9.0, atau "perbaikan" setelah cacat diperbaiki.
// Hasil: tangkapan layar di docs/M10/assets/bukti/ dan ringkasan di use-case-modul-e-<label>.json.
// Setiap pemeriksaan dicatat apa adanya; skrip tidak berhenti saat satu pemeriksaan gagal.

const fs = require('fs');
const path = require('path');

const [, , PW = 'playwright-core', LABEL = 'v9.0', CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'] = process.argv;
const { chromium } = require(PW);
const { Client } = require(path.join(process.cwd(), 'node_modules', 'pg'));
require(path.join(process.cwd(), 'node_modules', 'dotenv')).config({ path: path.join(process.cwd(), '.env') });

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const SMTP_API = process.env.MAILPIT_URL || 'http://localhost:8025';
const BUKTI = path.join(__dirname, '..', 'bukti');
const SUFFIX = LABEL === 'v9.0' ? '-v9.0' : '';
const SANDI = 'ujicoba123';
const FOTO = (nama) => ({ name: nama, mimeType: 'image/jpeg', buffer: fs.readFileSync(path.join(BUKTI, 'produk', nama)) });
const BERKAS_BUKTI = { name: 'bukti-penipuan.png', mimeType: 'image/png', buffer: fs.readFileSync(path.join(BUKTI, 'UC10-TC01.png')) };

const hasil = {};
let browser;
let db;

function catat(id, pemeriksaan, lulus, teramati) {
  hasil[id] = hasil[id] || { pemeriksaan: [], tangkapan: [] };
  hasil[id].pemeriksaan.push({ pemeriksaan, lulus: Boolean(lulus), teramati });
}

async function layar(page, id, akhiran = '') {
  const nama = `${id}${akhiran}${SUFFIX}.png`;
  await page.screenshot({ path: path.join(BUKTI, nama), fullPage: true });
  hasil[id] = hasil[id] || { pemeriksaan: [], tangkapan: [] };
  hasil[id].tangkapan.push(nama);
}

async function api(method, url, token, body) {
  const res = await fetch(BASE + url, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}) },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  let isi = null;
  try { isi = await res.json(); } catch { /* bukan JSON */ }
  return { status: res.status, isi };
}

async function masuk(email) {
  const r = await api('POST', '/api/akun/login', null, { email, kataSandi: SANDI });
  return { email, token: r.isi?.data?.token, peran: r.isi?.data?.peran, status: r.status, kode: r.isi?.kode, pesan: r.isi?.pesan };
}

async function buatListing(token, judul, foto) {
  const fd = new FormData();
  fd.append('judul', judul);
  fd.append('harga', '120000');
  fd.append('deskripsiKondisi', `${judul}, kondisi baik.`);
  fd.append('idKategori', 'Buku kuliah');
  fd.append('idLokasi', 'Labtek V');
  fd.append('urutanFoto', '["baru:0"]');
  fd.append('foto', new Blob([foto.buffer], { type: foto.mimeType }), foto.name);
  const r = await api('POST', '/api/barang', token, fd);
  if (r.status !== 201) throw new Error(`Gagal membuat listing: ${r.status} ${JSON.stringify(r.isi)}`);
  return r.isi.data.idBarang;
}

async function laporLewatApi(token, objek, jenisObjek = 'Listing') {
  const fd = new FormData();
  fd.append('objekDilaporkan', objek);
  fd.append('jenisPelanggaran', 'Penipuan');
  fd.append('teksAlasan', 'Dibuat lewat API untuk menyiapkan data uji');
  fd.append('jenisObjek', jenisObjek);
  fd.append('bukti', new Blob([BERKAS_BUKTI.buffer], { type: 'image/png' }), 'bukti.png');
  const r = await api('POST', '/api/laporan', token, fd);
  if (r.status !== 201) throw new Error(`Gagal membuat laporan: ${r.status}`);
  return r.isi.data.idLaporan;
}

async function laporanUntuk(tokenAdmin, objek) {
  const r = await api('GET', '/api/admin/laporan', tokenAdmin);
  return (r.isi?.data || []).filter((l) => l.objekDilaporkan === objek);
}

async function surelUntuk(alamat) {
  const daftar = await (await fetch(`${SMTP_API}/api/v1/search?query=${encodeURIComponent(`to:"${alamat}"`)}`)).json();
  return Promise.all(daftar.messages.map(async (m) => (await fetch(`${SMTP_API}/api/v1/message/${m.ID}`)).json()));
}

async function konteks(akun) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, baseURL: BASE });
  if (akun) {
    await ctx.addInitScript(({ token, peran, email }) => {
      localStorage.setItem('itbeli_token', token);
      localStorage.setItem('itbeli_peran', peran);
      localStorage.setItem('itbeli_email', email);
    }, akun);
  }
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  page.galat = [];
  page.dialog = [];
  page.on('pageerror', (e) => page.galat.push(e.message));
  page.on('dialog', (d) => { page.dialog.push(d.message()); d.accept().catch(() => {}); });
  return { ctx, page };
}

async function isiFormulirLaporan(page, { kategori = 'Penipuan', alasan, bukti = true }) {
  await page.waitForSelector('#formulir-laporan');
  await page.check(`input[name="kategori"][value="${kategori}"]`);
  await page.fill('#teks-alasan', alasan);
  if (bukti) await page.setInputFiles('#input-bukti-file', BERKAS_BUKTI);
}

// Katalog dilihat dengan sesi admin, yang tidak terlibat sebagai penjual maupun pelapor
async function lihatKatalog(tokenPengamat, kataKunci) {
  const r = await api('GET', `/api/katalog?q=${encodeURIComponent(kataKunci)}`, tokenPengamat);
  return { status: r.status, id: (r.isi?.data?.daftar || []).map((b) => b.idBarang) };
}

async function teks(page, sel) {
  return (await page.locator(sel).first().innerText().catch(() => '')).trim();
}

async function main() {
  browser = await chromium.launch({ headless: true, executablePath: CHROME });
  db = new Client({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
  await db.connect();

  const pembeli = await masuk('pembeli.uji@itb.ac.id');
  const penjual = await masuk('penjual.uji@itb.ac.id');
  const admin = await masuk('admin.uji@itb.ac.id');
  const [L1, L2, L3] = [
    await buatListing(penjual.token, 'Buku Introduction to Algorithms', FOTO('buku-algoritma.jpeg')),
    await buatListing(penjual.token, 'Earbuds ATARU', FOTO('earbuds.jpeg')),
    await buatListing(penjual.token, 'Samsung Galaxy Z Flip', FOTO('hape.jpeg')),
  ];

  // ───── UC19-TC01: laporan dari detail listing ─────
  {
    const id = 'UC19-TC01';
    const { ctx, page } = await konteks(pembeli);
    await page.goto(`/barang?id=${L1}`);
    const tombol = page.locator('a[title="Laporkan"]');
    catat(id, 'Tombol "Laporkan" tampil di detail listing', await tombol.count() > 0, `${await tombol.count()} tombol`);
    await tombol.first().click();
    await page.waitForURL(/laporan-form/);
    await isiFormulirLaporan(page, { alasan: 'Penjual meminta transfer di muka sebelum bertemu' });
    await page.click('#tombol-kirim');
    await page.waitForSelector('#pesan-sukses:not([hidden])');
    const sukses = await teks(page, '#pesan-sukses');
    catat(id, 'Notifikasi "Laporan berhasil dikirim"', /Laporan berhasil dikirim/.test(sukses), sukses);
    await layar(page, id, '-kirim');
    await ctx.close();

    const [lap] = await laporanUntuk(admin.token, L1);
    hasil.idR1 = lap?.idLaporan;
    const adm = await konteks(admin);
    await adm.page.goto(`/admin-detail?id=${lap.idLaporan}`);
    await adm.page.waitForFunction(() => document.querySelector('#detail-badge')?.textContent.trim() !== '');
    await adm.page.waitForTimeout(500);
    const badge = await teks(adm.page, '#detail-badge');
    const jumlahBukti = await adm.page.locator('#detail-daftar-bukti img').count();
    const riwayat = await teks(adm.page, '#detail-riwayat-audit');
    catat(id, 'Laporan tersimpan berstatus Baru', badge === 'Baru', `badge: ${badge}`);
    catat(id, 'Bukti dapat dilihat admin', jumlahBukti >= 1, `${jumlahBukti} gambar bukti`);
    catat(id, 'Riwayat berisi "Penerimaan laporan"', /Penerimaan laporan/.test(riwayat), riwayat.replace(/\s+/g, ' ').slice(0, 160));
    await layar(adm.page, id, '-admin');
    await adm.ctx.close();
  }

  // ───── UC19-TC02: laporan dari ruang percakapan ─────
  {
    const id = 'UC19-TC02';
    const prc = await api('POST', '/api/percakapan', pembeli.token, { idBarang: L2 });
    const idPercakapan = prc.isi?.data?.idPercakapan || prc.isi?.data?.percakapan?.idPercakapan;
    const pesanRahasia = 'Rekening saya 1234567890, tolong transfer dulu';
    await api('POST', `/api/percakapan/${idPercakapan}/pesan`, penjual.token, { isi: pesanRahasia });
    const { ctx, page } = await konteks(pembeli);
    await page.goto(`/percakapan?id=${idPercakapan}`);
    await page.waitForTimeout(1500);
    const tombolLapor = await page.locator('text=/Laporkan/i').count();
    catat(id, 'Tombol "Laporkan" tersedia di ruang percakapan (I-10)', tombolLapor > 0, `${tombolLapor} elemen bertuliskan "Laporkan"`);
    await layar(page, id, '-percakapan');
    // KF37 diperiksa lewat alamat formulir secara langsung
    await page.goto(`/laporan-form?objek=${idPercakapan}&jenis=Percakapan`);
    await isiFormulirLaporan(page, { kategori: 'Konten tidak pantas', alasan: 'Meminta transfer ke rekening pribadi' });
    const infoPrivasi = await page.locator('#info-privasi-chat').isVisible();
    catat(id, 'Formulir menampilkan pemberitahuan privasi percakapan', infoPrivasi, infoPrivasi ? 'tampil' : 'tidak tampil');
    await page.click('#tombol-kirim');
    await page.waitForSelector('#pesan-sukses:not([hidden])');
    await ctx.close();
    const [lap] = await laporanUntuk(admin.token, idPercakapan);
    hasil.idR2 = lap?.idLaporan;
    const adm = await konteks(admin);
    await adm.page.goto(`/admin-detail?id=${lap.idLaporan}`);
    await adm.page.waitForTimeout(1200);
    const isiHalaman = await adm.page.locator('body').innerText();
    catat(id, 'Objek laporan berupa ID percakapan', (await teks(adm.page, '#detail-objek-nama')) === idPercakapan, await teks(adm.page, '#detail-objek-nama'));
    catat(id, 'Isi pesan tidak ikut tampil pada laporan (KF37)', !isiHalaman.includes(pesanRahasia), isiHalaman.includes(pesanRahasia) ? 'isi pesan tampil' : 'isi pesan tidak tampil');
    const [baris] = (await db.query('SELECT objek_dilaporkan, teks_alasan FROM laporan WHERE id_laporan = $1', [lap.idLaporan])).rows;
    catat(id, 'Baris laporan di basis data tidak memuat isi pesan', !JSON.stringify(baris).includes(pesanRahasia), JSON.stringify(baris));
    await layar(adm.page, id, '-admin');
    await adm.ctx.close();
  }

  // ───── UC19-TC03 dan UC19-TC04: isian wajib kosong ─────
  for (const [id, opsi, label] of [
    ['UC19-TC03', { alasan: '', bukti: true }, 'alasan kosong'],
    ['UC19-TC04', { alasan: 'Penjual tidak datang ke lokasi COD', bukti: false }, 'tanpa bukti'],
  ]) {
    const sebelum = (await laporanUntuk(admin.token, L3)).length;
    const { ctx, page } = await konteks(pembeli);
    await page.goto(`/laporan-form?objek=${L3}&jenis=Listing`);
    await isiFormulirLaporan(page, opsi);
    await page.click('#tombol-kirim');
    await page.waitForSelector('#pesan-galat:not([hidden])');
    const galat = await teks(page, '#pesan-galat');
    const garis = await page.$eval('#teks-alasan', (el) => el.style.borderColor);
    catat(id, `Pengiriman dihentikan dengan pesan galat (${label})`, galat.length > 0, galat);
    if (id === 'UC19-TC03') catat(id, 'Kolom alasan diberi penanda merah', garis !== '', `borderColor: "${garis}"`);
    await page.waitForTimeout(500);
    const sesudah = (await laporanUntuk(admin.token, L3)).length;
    catat(id, 'Tidak ada laporan baru tersimpan', sebelum === sesudah, `jumlah laporan atas objek: ${sebelum} → ${sesudah}`);
    await layar(page, id);
    await ctx.close();
  }

  // Data tambahan untuk UC20 sampai UC24
  const R3 = await laporLewatApi(pembeli.token, L2);
  const R4 = await laporLewatApi(pembeli.token, L3);
  await api('PATCH', `/api/admin/laporan/${hasil.idR2}/status`, admin.token, { status: 'Selesai' });
  await api('PATCH', `/api/admin/laporan/${R3}/status`, admin.token, { status: 'Diproses' });

  // ───── UC20-TC01 dan UC20-TC02: daftar dan penyaringan laporan ─────
  {
    const { ctx, page } = await konteks(admin);
    await page.goto('/admin-laporan');
    await page.waitForSelector('#tabel-laporan-body tr');
    await page.waitForTimeout(800);
    const baris = await page.locator('#tabel-laporan-body tr').count();
    const kepala = (await page.locator('#tabel-laporan thead').innerText()).replace(/\s+/g, ' ');
    const stat = { baru: await teks(page, '#stat-baru'), diproses: await teks(page, '#stat-diproses'), selesai: await teks(page, '#stat-selesai'), total: await teks(page, '#stat-total') };
    catat('UC20-TC01', 'Tabel menampilkan seluruh laporan', baris === 4, `${baris} baris`);
    catat('UC20-TC01', 'Kolom pelapor, objek, kategori, waktu, dan status tersedia', /Pelapor/i.test(kepala) && /Objek/i.test(kepala) && /Kategori/i.test(kepala) && /Waktu|Tanggal/i.test(kepala) && /Status/i.test(kepala), kepala);
    catat('UC20-TC01', 'Kartu jumlah per status sesuai', stat.baru === '2' && stat.diproses === '1' && stat.selesai === '1' && stat.total === '4', JSON.stringify(stat));
    await layar(page, 'UC20-TC01');
    await page.click('#tab-baru');
    await page.waitForTimeout(1000);
    const status = await page.locator('#tabel-laporan-body tr').allInnerTexts();
    const hanyaBaru = status.length === 2 && status.every((s) => /Baru/.test(s) && !/Diproses\s*$|Selesai\s*$/.test(s.split('\t').pop()));
    catat('UC20-TC02', 'Hanya laporan berstatus Baru yang tampil', hanyaBaru, `${status.length} baris`);
    await layar(page, 'UC20-TC02');
    await ctx.close();
  }

  // ───── UC20-TC03: akses oleh akun bukan admin ─────
  {
    const { ctx, page } = await konteks(pembeli);
    await page.goto('/admin-laporan');
    await page.waitForTimeout(2500);
    const urlAkhir = new URL(page.url()).pathname;
    catat('UC20-TC03', 'Muncul peringatan "Akses Ditolak"', page.dialog.some((d) => /Akses Ditolak/i.test(d)), page.dialog.join(' | ') || 'tidak ada dialog');
    catat('UC20-TC03', 'Pengguna dialihkan ke beranda', urlAkhir === '/' || urlAkhir === '/katalog', `alamat akhir: ${urlAkhir}`);
    await layar(page, 'UC20-TC03');
    await ctx.close();
  }

  // ───── UC21-TC01: ubah status dari halaman detail ─────
  {
    const id = 'UC21-TC01';
    const { ctx, page } = await konteks(admin);
    await page.goto(`/admin-detail?id=${hasil.idR1}`);
    await page.waitForFunction(() => document.querySelector('#detail-badge')?.textContent.trim() === 'Baru');
    const [sebelum] = (await db.query('SELECT waktu_perubahan FROM laporan WHERE id_laporan = $1', [hasil.idR1])).rows;
    await page.selectOption('#select-status-penanganan', 'Diproses');
    await page.click('#btn-simpan-status');
    await page.waitForFunction(() => document.querySelector('#detail-badge')?.textContent.trim() === 'Diproses');
    await page.waitForTimeout(800);
    const [sesudah] = (await db.query('SELECT status_penanganan, waktu_perubahan FROM laporan WHERE id_laporan = $1', [hasil.idR1])).rows;
    const riwayat = await teks(page, '#detail-riwayat-audit');
    const baruNonaktif = await page.$eval('#select-status-penanganan option[value="Baru"]', (o) => o.disabled);
    catat(id, 'Status dan waktu perubahan tersimpan', sesudah.status_penanganan === 'Diproses' && sesudah.waktu_perubahan > sebelum.waktu_perubahan, `${sesudah.status_penanganan}, waktu berubah: ${sesudah.waktu_perubahan > sebelum.waktu_perubahan}`);
    catat(id, 'Riwayat bertambah "Perubahan status laporan menjadi Diproses"', /Perubahan status laporan menjadi Diproses/.test(riwayat), riwayat.replace(/\s+/g, ' ').slice(0, 200));
    catat(id, 'Pilihan status mundur (Baru) tidak dapat dipilih', baruNonaktif, `option Baru disabled: ${baruNonaktif}`);
    await layar(page, id);
    await ctx.close();
  }

  // ───── UC21-TC02: ubah status lewat daftar I-13 ─────
  {
    const id = 'UC21-TC02';
    const { ctx, page } = await konteks(admin);
    await page.goto('/admin-laporan');
    await page.waitForSelector('#tabel-laporan-body tr');
    await page.waitForTimeout(800);
    const statSelesaiAwal = await teks(page, '#stat-selesai');
    await page.locator(`select[onchange*="${R3}"]`).selectOption('Selesai');
    await page.waitForTimeout(2000);
    const [db3] = (await db.query('SELECT status_penanganan FROM laporan WHERE id_laporan = $1', [R3])).rows;
    const statSelesaiAkhir = await teks(page, '#stat-selesai');
    catat(id, 'Status tersimpan di server', db3.status_penanganan === 'Selesai', db3.status_penanganan);
    catat(id, 'Kartu jumlah per status diperbarui tanpa memuat ulang halaman', statSelesaiAkhir === String(Number(statSelesaiAwal) + 1), `Selesai: ${statSelesaiAwal} → ${statSelesaiAkhir}`);
    catat(id, 'Tidak ada galat JavaScript di halaman', page.galat.length === 0, page.galat.join(' | ') || 'tidak ada');
    await layar(page, id);
    await ctx.close();
  }

  // ───── UC22-TC01: hapus listing yang dilaporkan ─────
  {
    const id = 'UC22-TC01';
    const { ctx, page } = await konteks(admin);
    await page.goto(`/admin-detail?id=${hasil.idR1}`);
    await page.waitForFunction(() => document.querySelector('#detail-badge')?.textContent.trim() !== '');
    await page.click('#btn-hapus-listing');
    await page.fill('#modal-alasan-tindakan', 'Barang palsu');
    await page.click('#modal-konfirmasi-moderasi button:has-text("Konfirmasi")');
    await page.waitForTimeout(2000);
    await layar(page, id, '-admin');
    const katalog = await api('GET', `/api/katalog/${L1}`, admin.token);
    const surel = await surelUntuk(penjual.email);
    const peringatan = surel.find((s) => /Penghapusan Listing/i.test(s.Subject));
    const [lap] = (await db.query('SELECT status_penanganan FROM laporan WHERE id_laporan = $1', [hasil.idR1])).rows;
    const logAdmin = (await db.query("SELECT jenis_tindakan, alasan FROM log_admin WHERE objek_ditindak = $1", [L1])).rows;
    const logAudit = (await db.query('SELECT tindakan FROM log_audit WHERE id_laporan = $1 ORDER BY waktu', [hasil.idR1])).rows.map((r) => r.tindakan);
    catat(id, 'Listing tidak dapat dibuka lagi', katalog.status === 404, `GET /api/katalog/:id → ${katalog.status}`);
    catat(id, 'Surel peringatan berisi alasan terkirim ke penjual', Boolean(peringatan && /Barang palsu/.test(peringatan.Text)), peringatan ? peringatan.Subject : 'tidak ada surel');
    catat(id, 'Laporan menjadi Selesai', lap.status_penanganan === 'Selesai', lap.status_penanganan);
    catat(id, 'Tercatat di log admin dan log audit', logAdmin.length === 1 && logAdmin[0].jenis_tindakan === 'HAPUS_LISTING' && logAudit.some((t) => t.startsWith('Penghapusan listing')), `log_admin: ${JSON.stringify(logAdmin)}; log_audit: ${logAudit.join(' / ')}`);
    const kat = await konteks(admin);
    await kat.page.goto('/katalog?q=Buku');
    await kat.page.waitForTimeout(1500);
    await layar(kat.page, id, '-katalog');
    await kat.ctx.close();
    await ctx.close();
  }

  // ───── UC23-TC01: blokir akun dari laporan atas listing L3 ─────
  {
    const id = 'UC23-TC01';
    const sesiPenjual = await masuk(penjual.email);
    const pj = await konteks(sesiPenjual);
    await pj.page.goto('/listing-saya');
    await pj.page.waitForTimeout(1200);
    const { ctx, page } = await konteks(admin);
    await page.goto(`/admin-detail?id=${R4}`);
    await page.waitForFunction(() => document.querySelector('#detail-badge')?.textContent.trim() !== '');
    await page.click('#btn-blokir-akun');
    await page.fill('#modal-alasan-tindakan', 'Penipuan berulang');
    await page.click('#modal-konfirmasi-moderasi button:has-text("Konfirmasi")');
    await page.waitForTimeout(2000);
    await layar(page, id, '-admin');
    const status = (await db.query('SELECT email, status_blokir FROM akun WHERE email IN ($1, $2) ORDER BY email', [penjual.email, pembeli.email])).rows;
    const penjualDiblokir = status.find((s) => s.email === penjual.email)?.status_blokir;
    const pelaporDiblokir = status.find((s) => s.email === pembeli.email)?.status_blokir;
    catat(id, 'Akun penjual (pemilik listing yang dilaporkan) menjadi Diblokir', penjualDiblokir === true, `status_blokir penjual: ${penjualDiblokir}; pelapor: ${pelaporDiblokir}`);
    const cekSesi = await api('GET', '/api/barang/saya', sesiPenjual.token);
    catat(id, 'Sesi penjual yang sedang aktif berakhir', cekSesi.status === 401, `GET /api/barang/saya dengan sesi lama → ${cekSesi.status}`);
    const loginUlang = await masuk(penjual.email);
    catat(id, 'Login ulang penjual ditolak dengan pesan penangguhan', loginUlang.kode === 'AKUN_DIBLOKIR', `${loginUlang.status} ${loginUlang.kode || ''} ${loginUlang.pesan || ''}`.trim());
    const kat = await lihatKatalog(admin.token, 'Samsung');
    const masihTampil = kat.id.includes(L3);
    catat(id, 'Listing penjual hilang dari katalog dan pencarian', kat.status === 200 && !masihTampil, `GET /api/katalog?q=Samsung → ${kat.status}; listing Samsung milik penjual masih tampil: ${masihTampil}`);
    const surel = await surelUntuk(penjual.email);
    const tangguh = surel.find((s) => /Penangguhan Akun/i.test(s.Subject));
    catat(id, 'Surel penangguhan berisi alasan terkirim ke penjual', Boolean(tangguh && /Penipuan berulang/.test(tangguh.Text)), tangguh ? tangguh.Subject : 'tidak ada surel ke penjual');
    const logAdmin = (await db.query("SELECT a.email, l.alasan FROM log_admin l JOIN akun a ON a.id_akun::text = l.objek_ditindak WHERE l.jenis_tindakan = 'BLOKIR_AKUN'")).rows;
    catat(id, 'Log admin mencatat pemblokiran akun penjual', logAdmin.some((r) => r.email === penjual.email), JSON.stringify(logAdmin));
    // Peramban penjual dimuat ulang: sesi yang dicabut membuat halaman berpindah ke /masuk,
    // lalu login lewat formulir memperlihatkan pesan penangguhan (bila akun memang diblokir).
    await pj.page.reload();
    await pj.page.waitForURL(/\/masuk/, { timeout: 5000 }).catch(() => {});
    await pj.page.waitForTimeout(800);
    catat(id, 'Halaman penjual berpindah ke /masuk setelah dimuat ulang', /\/masuk/.test(pj.page.url()), `alamat: ${new URL(pj.page.url()).pathname}`);
    await layar(pj.page, id, '-penjual');
    if (/\/masuk/.test(pj.page.url())) {
      // Konteks baru tanpa token tersimpan, seperti penjual yang mencoba masuk lagi lewat formulir
      const lg = await konteks(null);
      await lg.page.goto('/masuk');
      await lg.page.waitForSelector('#formulir-login:not([hidden])');
      await lg.page.fill('#email', penjual.email);
      await lg.page.fill('#kata-sandi', SANDI);
      await lg.page.click('#tombol-masuk');
      await lg.page.waitForSelector('#pesan-galat:not([hidden])', { timeout: 5000 }).catch(() => {});
      const pesan = await teks(lg.page, '#pesan-galat');
      catat(id, 'Formulir masuk menampilkan pesan penangguhan', /ditangguhkan/i.test(pesan), pesan || 'tidak ada pesan');
      await layar(lg.page, id, '-login');
      await lg.ctx.close();
    }
    await pj.ctx.close();
    await ctx.close();
  }

  // ───── UC24-TC01: buka blokir dari laporan yang sama ─────
  {
    const id = 'UC24-TC01';
    const { ctx, page } = await konteks(admin);
    await page.goto(`/admin-detail?id=${R4}`);
    await page.waitForFunction(() => document.querySelector('#detail-badge')?.textContent.trim() !== '');
    await page.click('#btn-buka-blokir');
    await page.fill('#modal-alasan-tindakan', 'Banding diterima');
    await page.click('#modal-konfirmasi-moderasi button:has-text("Konfirmasi")');
    await page.waitForTimeout(2000);
    await layar(page, id, '-admin');
    const loginPenjual = await masuk(penjual.email);
    catat(id, 'Penjual dapat masuk kembali', Boolean(loginPenjual.token), `${loginPenjual.status} ${loginPenjual.kode || 'berhasil'}`);
    const kat = await lihatKatalog(admin.token, 'Samsung');
    const tampil = kat.id.includes(L3);
    catat(id, 'Listing penjual tampil di katalog setelah buka blokir', kat.status === 200 && tampil, `GET /api/katalog?q=Samsung → ${kat.status}; listing Samsung milik penjual tampil: ${tampil}`);
    const logAdmin = (await db.query("SELECT a.email, l.alasan FROM log_admin l JOIN akun a ON a.id_akun::text = l.objek_ditindak WHERE l.jenis_tindakan = 'BUKA_BLOKIR'")).rows;
    catat(id, 'Log admin mencatat BUKA_BLOKIR untuk penjual beserta alasan', logAdmin.some((r) => r.email === penjual.email && r.alasan === 'Banding diterima'), JSON.stringify(logAdmin));
    const kp = await konteks(admin);
    await kp.page.goto('/katalog?q=Samsung');
    await kp.page.waitForTimeout(1500);
    await layar(kp.page, id, '-katalog');
    await kp.ctx.close();
    await ctx.close();
  }

  // ───── KNF02 ─────
  {
    const logAdmin = (await db.query('SELECT id_admin, jenis_tindakan, objek_ditindak, waktu, alasan FROM log_admin ORDER BY waktu')).rows;
    const lengkap = logAdmin.every((r) => r.id_admin && r.jenis_tindakan && r.objek_ditindak && r.waktu && r.alasan);
    catat('KNF02-TC01', 'Setiap tindakan moderasi menghasilkan satu baris log_admin yang lengkap', logAdmin.length === 3 && lengkap, JSON.stringify(logAdmin.map((r) => [r.jenis_tindakan, r.alasan])));
    const logAudit = (await db.query('SELECT tindakan FROM log_audit WHERE id_laporan = $1 ORDER BY waktu', [hasil.idR1])).rows.map((r) => r.tindakan);
    const { ctx, page } = await konteks(admin);
    await page.goto(`/admin-detail?id=${hasil.idR1}`);
    await page.waitForTimeout(1500);
    const riwayat = await teks(page, '#detail-riwayat-audit');
    catat('KNF02-TC02', 'Riwayat di I-14 memuat setiap catatan log_audit laporan', logAudit.length > 0 && logAudit.every((t) => riwayat.includes(t)), `log_audit: ${logAudit.join(' / ')}`);
    await layar(page, 'KNF02-TC02');
    await ctx.close();
    const rAdmin = await api('GET', `/api/admin/laporan/${hasil.idR1}`, admin.token);
    const pembeliBaru = await masuk(pembeli.email);
    const rPengguna = await api('GET', `/api/admin/laporan/${hasil.idR1}`, pembeliBaru.token || pembeli.token);
    catat('KNF02-TC04', 'Admin dapat membaca laporan dan riwayatnya; pengguna biasa ditolak', rAdmin.status === 200 && rPengguna.status === 403, `admin → ${rAdmin.status}; pengguna → ${rPengguna.status}`);
  }

  await db.end();
  await browser.close();
  for (const [id, h] of Object.entries(hasil)) {
    if (typeof h === 'object' && h.pemeriksaan) h.kesimpulan = h.pemeriksaan.every((p) => p.lulus) ? 'Pass' : 'Fail';
  }
  const keluar = path.join(BUKTI, `use-case-modul-e-${LABEL}.json`);
  fs.writeFileSync(keluar, `${JSON.stringify({ label: LABEL, waktu: new Date().toISOString(), basis: BASE, hasil }, null, 2)}\n`);
  for (const [id, h] of Object.entries(hasil)) if (h.kesimpulan) console.log(id, h.kesimpulan, h.pemeriksaan.filter((p) => !p.lulus).map((p) => `${p.pemeriksaan}: ${p.teramati}`).join(' || '));
}

main().catch(async (e) => {
  console.error('Skrip berhenti:', e);
  fs.writeFileSync(path.join(BUKTI, `use-case-modul-e-${LABEL}-galat.json`), `${JSON.stringify({ galat: String(e.stack), hasil }, null, 2)}\n`);
  if (browser) await browser.close().catch(() => {});
  if (db) await db.end().catch(() => {});
  process.exit(1);
});
