const request = require('supertest');
const app = require('../../app');
const Auth = require('../../pendukung/Otorisasi');
const { ListingService } = require('../../services/ListingService');
const Barang = require('../../models/Barang');
const id = '11111111-1111-4111-8111-111111111111';
const token = 'Bearer uji';
const png = Buffer.from([137,80,78,71,13,10,26,10]);
const data = { judul:'Jas',harga:'120000',deskripsiKondisi:'Bekas layak',idKategori:'Jas praktikum',idLokasi:'Labtek V' };
afterEach(() => jest.restoreAllMocks());
function login() { jest.spyOn(Auth,'verifikasiToken').mockResolvedValue({getIdAkun:()=>id}); }
test.each(['get','delete','patch','put'])('%s menolak tanpa sesi', async method => {
  const r = await request(app)[method]('/api/barang/'+id); expect(r.status).toBe(401);
});
test('POST menolak tanpa sesi', async () => { expect((await request(app).post('/api/barang')).status).toBe(401); });
test('ID salah ditolak sebelum query', async () => { login(); expect((await request(app).get('/api/barang/bad').set('Authorization',token)).status).toBe(400); });
test('daftar hanya meminta listing dari id sesi', async () => {
  login(); const get = jest.spyOn(Barang,'getListingPenjual').mockResolvedValue([]);
  expect((await request(app).get('/api/barang/saya').set('Authorization',token)).body.data).toEqual([]);
  expect(get).toHaveBeenCalledWith(id);
});
test('POST mengabaikan idPenjual dari klien', async () => {
  login(); const save = jest.spyOn(ListingService,'simpan').mockResolvedValue({idBarang:id});
  const r = await request(app).post('/api/barang').set('Authorization',token).send({...data,idPenjual:'penyerang'});
  expect(r.status).toBe(201); expect(save.mock.calls[0][1]).toBe(id);
});
test('kepemilikan gagal dipetakan ke 403', async () => {
  login(); jest.spyOn(ListingService,'hapus').mockRejectedValue(Object.assign(new Error('Bukan pemilik'),{status:403}));
  expect((await request(app).delete('/api/barang/'+id).set('Authorization',token)).status).toBe(403);
});
test('konflik status dipetakan ke 409', async () => {
  login(); jest.spyOn(ListingService,'status').mockRejectedValue(Object.assign(new Error('Sudah berubah'),{status:409}));
  expect((await request(app).patch('/api/barang/'+id+'/status').set('Authorization',token).send({statusAsal:'Tersedia',statusTujuan:'Terjual'})).status).toBe(409);
});
test('lebih dari lima foto ditolak multer', async () => {
  login(); let req = request(app).post('/api/barang').set('Authorization',token);
  for (let i=0;i<6;i++) req = req.attach('foto',png,{filename:'foto.png',contentType:'image/png'});
  expect((await req).status).toBe(400);
});
test('foto lebih dari 5 MB ditolak multer', async () => {
  login(); const r = await request(app).post('/api/barang').set('Authorization',token).attach('foto',Buffer.alloc(5*1024*1024+1),{filename:'foto.png',contentType:'image/png'});
  expect(r.status).toBe(400);
});
