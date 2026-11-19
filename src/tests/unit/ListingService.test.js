const { validasiData, validasiFoto, ListingService } = require('../../services/ListingService');
const Listing = require('../../models/ListingPenjual');
const Barang = require('../../models/Barang');
const Foto = require('../../models/FotoBarang');
const storage = require('../../penyimpanan/PenyimpananBerkas');
const data = { judul: 'Jas kimia', harga: '120000', deskripsiKondisi: 'Masih layak pakai', idKategori: 'Jas praktikum', idLokasi: 'Labtek V' };
const foto = { originalname:'foto.png',mimetype:'image/png',size:8,buffer:Buffer.from([137,80,78,71,13,10,26,10]) };
afterEach(() => jest.restoreAllMocks());
test.each(['', '0', '-1', 'NaN', 'Infinity', '1e3', '1.234', '10000000000'])('harga tidak valid: %s', harga => {
  expect(() => validasiData({...data,harga})).toThrow();
});
test('judul dan deskripsi dibatasi, kategori/lokasi dari referensi', () => {
  for (const input of [{judul:'x'.repeat(81)},{deskripsiKondisi:'x'.repeat(1001)},{idKategori:'asing'},{idLokasi:''}]) expect(() => validasiData({...data,...input})).toThrow();
  expect(validasiData({...data,judul:'  Jas kimia  '})).toEqual({...data,judul:'Jas kimia',harga:120000});
});
test('menolak ekstensi, MIME, signature palsu dan foto lebih dari 5 MB', () => {
  expect(() => validasiFoto([foto])).not.toThrow();
  for (const f of [{...foto, originalname:'x.html'}, {...foto,mimetype:'text/html'}, {...foto,buffer:Buffer.from('<script>')}, {...foto,size:5*1024*1024+1}]) expect(() => validasiFoto([f])).toThrow();
});
test('bukan pemilik tidak memperoleh galeri', async () => {
  jest.spyOn(Barang,'cariById').mockResolvedValue({idPenjual:'lain',status:'Tersedia'});
  const galeri = jest.spyOn(Foto,'getGaleri');
  await expect(ListingService.get('id','saya')).rejects.toMatchObject({status:403});
  expect(galeri).not.toHaveBeenCalled();
});
test('kegagalan database setelah unggah membersihkan foto baru', async () => {
  jest.spyOn(Listing,'transaksi').mockImplementation(fn => fn({}));
  jest.spyOn(Listing,'akunAktif').mockResolvedValue(true);
  jest.spyOn(storage,'simpan').mockResolvedValue(['/uploads/new.png']);
  const hapus = jest.spyOn(storage,'hapus').mockResolvedValue(true);
  jest.spyOn(Barang,'simpan').mockRejectedValue(new Error('database gagal'));
  await expect(ListingService.simpan(null,'saya',{...data,urutanFoto:'["baru:0"]'},[foto])).rejects.toThrow('database gagal');
  expect(hapus).toHaveBeenCalledWith(['/uploads/new.png']);
});
test('foto asing ditolak sebelum penyimpanan berkas', async () => {
  jest.spyOn(Listing,'transaksi').mockImplementation(fn => fn({}));
  jest.spyOn(Listing,'akunAktif').mockResolvedValue(true);
  jest.spyOn(Listing,'kunci').mockResolvedValue({idPenjual:'saya',status:'Tersedia'});
  jest.spyOn(Foto,'getGaleri').mockResolvedValue([]);
  const simpan = jest.spyOn(storage,'simpan');
  await expect(ListingService.simpan('id','saya',{...data,urutanFoto:'["foto-orang-lain"]'},[])).rejects.toMatchObject({status:400});
  expect(simpan).not.toHaveBeenCalled();
});
test('status kedaluwarsa menghasilkan konflik', async () => {
  jest.spyOn(Listing,'transaksi').mockImplementation(fn => fn({}));
  jest.spyOn(Listing,'akunAktif').mockResolvedValue(true);
  jest.spyOn(Listing,'kunci').mockResolvedValue({idPenjual:'saya',status:'Terjual'});
  jest.spyOn(Listing,'setStatus').mockResolvedValue(false);
  await expect(ListingService.status('id','saya','Tersedia','Terjual')).rejects.toMatchObject({status:409});
});
