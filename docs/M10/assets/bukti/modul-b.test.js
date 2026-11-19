// Bukti yang dapat dijalankan ulang; hanya UC07–UC12. Tidak mengubah kode aplikasi.
const root = require('path').resolve(__dirname, '../../../..');
const R = p => require(root + '/src/' + p);
const { ListingService: S, validasiData, validasiFoto } = R('services/ListingService');
const L = R('models/ListingPenjual');
const B = R('models/Barang');
const F = R('models/FotoBarang');
const db = R('config/db');
const storage = R('penyimpanan/PenyimpananBerkas');
const C = R('controllers/BarangController');
const ref = R('models/ReferensiListing');
const data = {judul:'Jas kimia', harga:'120000', deskripsiKondisi:'Layak pakai', idKategori:ref.kategori[0], idLokasi:ref.lokasi[0]};
const png = {originalname:'foto.png', mimetype:'image/png', size:8, buffer:Buffer.from([137,80,78,71,13,10,26,10])};
afterEach(() => jest.restoreAllMocks());
function layanan(barang = {idPenjual:'saya', status:'Tersedia'}) {
  jest.spyOn(L,'transaksi').mockImplementation(fn=>fn({}));
  jest.spyOn(L,'akunAktif').mockResolvedValue(true);
  jest.spyOn(L,'kunci').mockResolvedValue(barang);
  jest.spyOn(F,'getGaleri').mockResolvedValue([]);
}
test('C14-UT01 normal: normalisasi data dan harga numerik',()=>{
  expect(validasiData({...data,judul:'  Jas kimia  '})).toEqual({...data,harga:120000});
});
test('C14-UT02 batas: judul 80, deskripsi 1000, harga 0.01 dan maksimum',()=>{
  for (const harga of ['0.01','9999999999.99']) expect(validasiData({...data,judul:'a'.repeat(80),deskripsiKondisi:'b'.repeat(1000),harga}).harga).toBe(Number(harga));
});
test('C14-UT03 negatif: kolom kosong, panjang lebih, kategori/lokasi asing, harga salah',()=>{
  for(const x of [{judul:''},{judul:'a'.repeat(81)},{deskripsiKondisi:''},{deskripsiKondisi:'b'.repeat(1001)},{idKategori:'asing'},{idLokasi:'asing'},...['','0','-1','NaN','Infinity','1e3','1.234','10000000000'].map(harga=>({harga}))]) expect(()=>validasiData({...data,...x})).toThrow();
});
test('C14-UT04 normal/batas: JPG/PNG asli 1 byte metadata sampai tepat 5 MB',()=>{
  validasiFoto([{...png,size:1},{...png,size:5*1024*1024},{originalname:'x.jpeg',mimetype:'image/jpeg',size:3,buffer:Buffer.from([255,216,255])}]);
});
test('C14-UT05 negatif: foto kosong, ukuran lebih, ekstensi/MIME/signature palsu',()=>{
  for(const x of [{size:0},{size:5*1024*1024+1},{originalname:'x.pdf'},{mimetype:'text/html'},{buffer:Buffer.from('palsu')}]) expect(()=>validasiFoto([{...png,...x}])).toThrow();
});
test('C14-UT06 normal: get pemilik mengembalikan data dan galeri',async()=>{
  const barang={idPenjual:'saya',status:'Tersedia'};
  jest.spyOn(B,'cariById').mockResolvedValue(barang);jest.spyOn(F,'getGaleri').mockResolvedValue(['foto']);
  expect(await S.get('id','saya')).toEqual({barang,daftarFoto:['foto'],...ref});
});
test('C14-UT07 negatif: get tidak ada/bukan pemilik/dinonaktifkan',async()=>{
  const spy=jest.spyOn(B,'cariById'); const galeri=jest.spyOn(F,'getGaleri');
  for(const [barang,status] of [[null,404],[{idPenjual:'lain'},403],[{idPenjual:'saya',status:'Dinonaktifkan'},409]]) {spy.mockResolvedValue(barang);await expect(S.get('id','saya')).rejects.toMatchObject({status});}
  expect(galeri).not.toHaveBeenCalled();
});
test('C14-UT08 normal/batas: buat listing dengan 1 dan 5 foto',async()=>{
  layanan();const save=jest.spyOn(B,'simpan').mockResolvedValue('id'); const galeri=jest.spyOn(L,'galeri').mockResolvedValue();
  jest.spyOn(storage,'simpan').mockImplementation(async(_,files)=>files.map((_,i)=>'/uploads/'+i));jest.spyOn(storage,'hapus').mockResolvedValue(true);
  for(const n of [1,5]) {const files=Array.from({length:n},()=>({...png}));await S.simpan(null,'saya',{...data,urutanFoto:JSON.stringify(files.map((_,i)=>'baru:'+i))},files);expect(galeri.mock.calls.at(-1)[1]).toHaveLength(n);}
  expect(save).toHaveBeenCalledWith(expect.objectContaining({idPenjual:'saya',harga:120000}),expect.any(Date),{});
});
test('C14-UT09 negatif: urutan foto JSON salah, 0/6 foto, duplikat, bukan array/string',async()=>{
  for(const urutanFoto of ['x','[]','{}','[1]','["a","a"]',JSON.stringify(['a','b','c','d','e','f'])]) await expect(S.simpan(null,'saya',{...data,urutanFoto},[])).rejects.toMatchObject({status:400});
});
test('C14-UT10 negatif: akun tidak aktif serta foto asing/tidak dirujuk',async()=>{
  layanan();jest.spyOn(storage,'hapus').mockResolvedValue(true);L.akunAktif.mockResolvedValueOnce(false);
  await expect(S.simpan(null,'saya',{...data,urutanFoto:'["baru:0"]'},[{...png}])).rejects.toMatchObject({status:403});
  for(const urutanFoto of ['["asing"]','["baru:0"]']) await expect(S.simpan('id','saya',{...data,urutanFoto},urutanFoto.includes('asing')?[]:[{...png},{...png}])).rejects.toMatchObject({status:400});
});
test('C14-UT11 normal: ubah data, pertahankan foto, hapus foto lama',async()=>{
  layanan();F.getGaleri.mockResolvedValue([{idFoto:'lama',pathBerkas:'/uploads/lama'},{idFoto:'buang',pathBerkas:'/uploads/buang'}]);
  jest.spyOn(storage,'simpan').mockResolvedValue(['/uploads/baru']);const hapus=jest.spyOn(storage,'hapus').mockResolvedValue(true);const update=jest.spyOn(L,'update').mockResolvedValue();const galeri=jest.spyOn(L,'galeri').mockResolvedValue();
  await S.simpan('id','saya',{...data,urutanFoto:'["baru:0","lama"]'},[{...png}]);
  expect(update).toHaveBeenCalled();expect(galeri.mock.calls[0][1].map(f=>f.pathBerkas)).toEqual(['/uploads/baru','/uploads/lama']);expect(hapus).toHaveBeenCalledWith(['/uploads/buang']);
});
test('C14-UT12 negatif: storage gagal dan DB gagal, bersihkan foto baru',async()=>{
  layanan();const simpan=jest.spyOn(storage,'simpan').mockResolvedValueOnce(null).mockResolvedValueOnce(['/uploads/baru']);const hapus=jest.spyOn(storage,'hapus').mockResolvedValue(true);
  await expect(S.simpan(null,'saya',{...data,urutanFoto:'["baru:0"]'},[{...png}])).rejects.toMatchObject({status:500});
  jest.spyOn(B,'simpan').mockRejectedValue(new Error('DB gagal'));
  await expect(S.simpan(null,'saya',{...data,urutanFoto:'["baru:0"]'},[{...png}])).rejects.toThrow('DB gagal');expect(hapus).toHaveBeenCalledWith(['/uploads/baru']);
});
test('C14-UT13 normal: hapus listing milik sendiri beserta berkas',async()=>{
  layanan();F.getGaleri.mockResolvedValue([{pathBerkas:'/uploads/lama'}]);const hapus=jest.spyOn(B,'hapus').mockResolvedValue(true);const berkas=jest.spyOn(storage,'hapus').mockResolvedValue(true);
  await S.hapus('id','saya');expect(hapus).toHaveBeenCalledWith('id',{});expect(berkas).toHaveBeenCalledWith(['/uploads/lama']);
});
test('C14-UT14 negatif: hapus akun tidak aktif/bukan pemilik',async()=>{
  layanan({idPenjual:'lain'});L.akunAktif.mockResolvedValueOnce(false);const hapus=jest.spyOn(B,'hapus');
  for(let i=0;i<2;i++) await expect(S.hapus('id','saya')).rejects.toMatchObject({status:403});expect(hapus).not.toHaveBeenCalled();
});
test('C14-UT15 normal: transisi tersedia-terjual dan terjual-tersedia',async()=>{
  layanan();const status=jest.spyOn(L,'setStatus').mockResolvedValue(true);
  for(const [a,b] of [['Tersedia','Terjual'],['Terjual','Tersedia']]) {await S.status('id','saya',a,b);expect(status).toHaveBeenLastCalledWith('id','saya',a,b,{});}
});
test('C14-UT16 negatif: transisi salah, akun tidak aktif, bukan pemilik, konflik status',async()=>{
  await expect(S.status('id','saya','Tersedia','Tersedia')).rejects.toMatchObject({status:400});layanan();L.akunAktif.mockResolvedValueOnce(false);
  await expect(S.status('id','saya','Tersedia','Terjual')).rejects.toMatchObject({status:403});L.kunci.mockResolvedValueOnce({idPenjual:'lain'});
  await expect(S.status('id','saya','Tersedia','Terjual')).rejects.toMatchObject({status:403});jest.spyOn(L,'setStatus').mockResolvedValue(false);
  await expect(S.status('id','saya','Tersedia','Terjual')).rejects.toMatchObject({status:409});
});
test('C14-UT17 normal: seluruh handler memetakan parameter, respons dan id sesi',async()=>{
  const req={akun:{idAkun:'saya'},params:{id:'id'},body:{...data,statusAsal:'Tersedia',statusTujuan:'Terjual'},files:[]};
  const res={status:jest.fn().mockReturnThis(),json:jest.fn().mockReturnThis()};
  jest.spyOn(B,'getListingPenjual').mockResolvedValue([]);for(const k of ['get','simpan','hapus','status']) jest.spyOn(S,k).mockResolvedValue({idBarang:'id'});
  for(const fn of Object.values(C)) await fn(req,res);
  expect(B.getListingPenjual).toHaveBeenCalledWith('saya');expect(S.simpan).toHaveBeenCalledWith('id','saya',req.body,[]);expect(S.hapus).toHaveBeenCalledWith('id','saya');expect(S.status).toHaveBeenCalledWith('id','saya','Tersedia','Terjual');expect(res.status).toHaveBeenCalledWith(201);
});
test('C14-UT18 negatif: kegagalan service diteruskan handler',async()=>{
  jest.spyOn(S,'simpan').mockRejectedValue(new Error('gagal'));
  await expect(C.buatBarang({akun:{idAkun:'saya'},body:data,files:[]},{})).rejects.toThrow('gagal');
});
test('C29-UT01 normal/negatif: mapping data dan lookup listing',async()=>{
  expect(B.dariBaris(null)).toBeNull();const query=jest.fn().mockResolvedValue({rows:[{id_barang:'id',id_penjual:'saya',harga:'12',status:'Tersedia',foto_utama:'foto'}]});
  expect((await B.cariById('id',{query})).harga).toBe(12);expect((await B.getListingPenjual('saya',{query}))[0].fotoUtama).toBe('foto');expect(new B({}).getStatus()).toBe('Tersedia');
});
test('C29-UT02 normal: insert dan delete berparameter',async()=>{
  const query=jest.fn().mockResolvedValue({rows:[{id_barang:'id'}],rowCount:1});expect(await B.simpan({...data,idPenjual:'saya'},new Date(),{query})).toBe('id');expect(await B.hapus('id',{query})).toBe(true);
  query.mockResolvedValue({rowCount:0});expect(await B.hapus('id',{query})).toBe(false);
});
test('C29-UT03 normal/negatif: transaksi COMMIT/ROLLBACK dan release',async()=>{
  const client={query:jest.fn().mockResolvedValue({}),release:jest.fn()};jest.spyOn(db.pool,'connect').mockResolvedValue(client);
  expect(await L.transaksi(async()=>42)).toBe(42);expect(client.query).toHaveBeenCalledWith('COMMIT');
  await expect(L.transaksi(async()=>{throw Error('gagal');})).rejects.toThrow('gagal');expect(client.query).toHaveBeenCalledWith('ROLLBACK');expect(client.release).toHaveBeenCalledTimes(2);
});
test('C29-UT04 normal/negatif: lock, akun aktif, update dan status bersyarat',async()=>{
  const client={query:jest.fn().mockResolvedValue({rows:[{id_barang:'id',status_akun:'Terverifikasi',status_blokir:false}],rowCount:1})};
  expect((await L.kunci('id',client)).idBarang).toBe('id');expect(await L.akunAktif('saya',client)).toBe(true);await L.update('id',data,client);expect(await L.setStatus('id','saya','Tersedia','Terjual',client)).toBe(true);
  client.query.mockResolvedValue({rows:[],rowCount:0});expect(await L.kunci('id',client)).toBeNull();expect(await L.akunAktif('saya',client)).toBe(false);expect(await L.setStatus('id','saya','Tersedia','Terjual',client)).toBe(false);
  client.query.mockResolvedValue({rows:[{status_akun:'Terverifikasi',status_blokir:true}]});expect(await L.akunAktif('saya',client)).toBe(false);
});
test('C30-UT01 normal/batas/negatif: format dan ukuran foto',()=>{
  for(const f of ['jpg','.JPEG','png']) expect(F.validasiFormat(f)).toBe(true);for(const f of ['',null,'pdf']) expect(F.validasiFormat(f)).toBe(false);
  for(const n of [1,5*1024*1024]) expect(F.validasiUkuran(n)).toBe(true);for(const n of [0,-1,5*1024*1024+1,'1']) expect(F.validasiUkuran(n)).toBe(false);
});
test('C30-UT02 normal/negatif: mapping, simpan, galeri terurut dan hapus',async()=>{
  expect(F.dariBaris(null)).toBeNull();const query=jest.fn().mockResolvedValue({rows:[{id_foto:'f',ukuran:'8',path_berkas:'foto'}],rowCount:1});
  expect(await F.simpan('id','foto.png','png',8,1,'foto',{query})).toBe(true);expect((await F.getGaleri('id',{query}))[0].ukuran).toBe(8);expect(await F.hapus('id',{query})).toBe(true);
  query.mockResolvedValue({rowCount:0});expect(await F.simpan('id','f','png',8,1,'f',{query})).toBe(false);expect(await F.hapus('id',{query})).toBe(true);
});
test('C30-UT03 normal/batas: galeri mengganti foto dan nomor urut 1..N',async()=>{
  const hapus=jest.spyOn(F,'hapus').mockResolvedValue(true),simpan=jest.spyOn(F,'simpan').mockResolvedValue(true);
  await L.galeri('id',[{namaBerkas:'a',format:'png',ukuran:8,pathBerkas:'a'},{namaBerkas:'b',format:'jpg',ukuran:3,pathBerkas:'b'}],{});
  expect(hapus).toHaveBeenCalled();expect(simpan.mock.calls.map(c=>c[4])).toEqual([1,2]);
});
test('C31-UT01 normal/negatif: referensi tetap, masukan bebas ditolak',()=>{
  expect(ref.kategori).toHaveLength(6);expect(()=>validasiData({...data,idKategori:'kategori bebas'})).toThrow();
});
test('C32-UT01 normal/negatif: referensi COD tetap, masukan bebas ditolak',()=>{
  expect(ref.lokasi).toHaveLength(6);expect(()=>validasiData({...data,idLokasi:'lokasi bebas'})).toThrow();
});
function view(nama) {
  const nodes=new Map();
  const el=()=>({value:'',validity:{valid:true},hidden:false,disabled:false,textContent:'',classList:{toggle:jest.fn(),add:jest.fn(),remove:jest.fn()},setAttribute:jest.fn(),append:jest.fn(),replaceChildren:jest.fn(),querySelectorAll:()=>[],querySelector:()=>null});
  const document={getElementById:id=>{if(!nodes.has(id))nodes.set(id,el());return nodes.get(id);},addEventListener:()=>{},querySelector:()=>null};
  const ctx={document,location:{search:'',hash:'',assign:jest.fn()},URLSearchParams,FormData,URL:{createObjectURL:()=>'/blob/foto',revokeObjectURL:jest.fn()},window:{addEventListener:jest.fn()},sessionStorage:{setItem:jest.fn()},ListingUI:{api:jest.fn(),galat:jest.fn(),toast:jest.fn(),mulai:jest.fn().mockResolvedValue(true),kartu:jest.fn(),el:jest.fn(el),konfirmasi:jest.fn()},history:{replaceState:jest.fn()}};
  const filename=root+'/src/views/js/'+nama+'.js';
  const instrumenter=require(root+'/src/node_modules/istanbul-lib-instrument').createInstrumenter();
  ctx.__coverage__=global.__coverage__||(global.__coverage__={});
  require('vm').runInNewContext(instrumenter.instrumentSync(require('fs').readFileSync(filename,'utf8'),filename)+'\nglobalThis.KelasUji='+nama,ctx);
  return {ctx,obj:new ctx.KelasUji(),document};
}
test('C03-UT01 normal: muat daftar kemudian render',async()=>{
  const {obj,ctx,document}=view('HalamanListingPenjual');obj.render=jest.fn();ctx.ListingUI.api.mockResolvedValue([{status:'Tersedia'}]);await obj.muat();expect(obj.daftar).toHaveLength(1);expect(obj.render).toHaveBeenCalled();expect(document.getElementById('memuat').hidden).toBe(true);
});
test('C03-UT02 negatif: gagal API ditampilkan tanpa render',async()=>{
  const {obj,ctx}=view('HalamanListingPenjual');obj.render=jest.fn();ctx.ListingUI.api.mockRejectedValue(Error('jaringan gagal'));await obj.muat();expect(ctx.ListingUI.galat).toHaveBeenCalledWith('jaringan gagal');expect(obj.render).not.toHaveBeenCalled();
});
test('C04-UT01 normal/batas/negatif: penambahan foto 1/5, urutan dan penolakan foto salah',()=>{
  const {obj}=view('FormulirBarang');obj.renderFoto=jest.fn();obj.preview=jest.fn();obj.error=jest.fn();const foto={name:'x.png',type:'image/png',size:5*1024*1024};
  obj.tambahFoto([foto]);expect(obj.foto).toHaveLength(1);obj.tambahFoto(Array.from({length:4},()=>foto));expect(obj.foto).toHaveLength(5);obj.tambahFoto([foto]);expect(obj.foto).toHaveLength(5);
  obj.pindah(0,4);expect(obj.dirty).toBe(true);obj.pindah(0,-1);obj.foto=[];for(const f of [{...foto,size:0},{...foto,size:5*1024*1024+1},{...foto,name:'x.pdf',type:'application/pdf'}])obj.tambahFoto([f]);expect(obj.foto).toHaveLength(0);
});
test('C04-UT02 normal/negatif: validasi semua isian dan foto wajib',()=>{
  const {obj,document}=view('FormulirBarang');for(const k of obj.fields)document.getElementById(k).value=String(data[k]);obj.foto=[{id:'lama'}];expect(obj.validasi()).toBe(true);document.getElementById('judul').value='';expect(obj.validasi()).toBe(false);document.getElementById('judul').value='Jas';obj.foto=[];expect(obj.validasi()).toBe(false);
});
test('C04-UT03 normal: simpan membentuk FormData, tujuan detail, sesi pesan',async()=>{
  const {obj,ctx,document}=view('FormulirBarang');for(const k of obj.fields)document.getElementById(k).value=String(data[k]);obj.foto=[{id:'lama'}];ctx.ListingUI.api.mockResolvedValue({idBarang:'id'});await obj.simpan();expect(ctx.ListingUI.api).toHaveBeenCalledWith('POST','/api/barang',expect.any(FormData));expect(ctx.location.assign).toHaveBeenCalledWith('/detail?id=id');expect(obj.busy).toBe(false);
});
test('C04-UT04 negatif: simpan gagal menampilkan galat dan mengaktifkan tombol',async()=>{
  const {obj,ctx,document}=view('FormulirBarang');obj.validasi=()=>true;obj.data=()=>data;obj.foto=[{id:'lama'}];ctx.ListingUI.api.mockRejectedValue(Error('server gagal'));await obj.simpan();expect(ctx.ListingUI.galat).toHaveBeenCalledWith('server gagal');expect(document.getElementById('simpan').disabled).toBe(false);
});
test('C04-UT05 normal/negatif: batal tanpa perubahan dan konfirmasi perubahan kotor',()=>{
  const {obj,ctx}=view('FormulirBarang');obj.batal();expect(ctx.location.assign).toHaveBeenCalledWith('/listing-saya');obj.dirty=true;obj.batal();expect(ctx.ListingUI.konfirmasi).toHaveBeenCalled();
});
test('C04-UT06 normal/negatif: mulai formulir baru, prefilled ubah, dan gagal memuat',async()=>{
  for(const edit of [false,true]){const {obj,ctx,document}=view('FormulirBarang');if(edit)obj.id='id';ctx.ListingUI.api.mockResolvedValue({...ref,barang:data,daftarFoto:[{idFoto:'f',pathBerkas:'foto'}]});await obj.mulai();expect(document.getElementById('simpan').disabled).toBe(false);if(edit)expect(obj.foto[0].id).toBe('f');}
  const {obj,ctx}=view('FormulirBarang');ctx.ListingUI.api.mockRejectedValue(Error('muat gagal'));await obj.mulai();expect(ctx.ListingUI.galat).toHaveBeenCalledWith('muat gagal');
});
test('C03-UT03 normal/negatif: mulai, dialog aksi, status usang dan gagal akses',async()=>{
  const {obj,ctx}=view('HalamanListingPenjual');ctx.ListingUI.api.mockResolvedValue([]);await obj.mulai();expect(ctx.ListingUI.api).toHaveBeenCalledWith('GET','/api/barang/saya');
  const barang={idBarang:'id',judul:'Jas',status:'Tersedia'};ctx.ListingUI.api.mockResolvedValue({barang});obj.muat=jest.fn();await obj.aksi(barang,'hapus');await ctx.ListingUI.konfirmasi.mock.calls.at(-1)[2]();expect(ctx.ListingUI.api).toHaveBeenCalledWith('DELETE','/api/barang/id');
  await obj.aksi(barang,'status');await ctx.ListingUI.konfirmasi.mock.calls.at(-1)[2]();expect(ctx.ListingUI.api).toHaveBeenCalledWith('PATCH','/api/barang/id/status',{statusAsal:'Tersedia',statusTujuan:'Terjual'});
  ctx.ListingUI.api.mockResolvedValue({barang:{...barang,status:'Terjual'}});await obj.aksi(barang,'status');expect(ctx.ListingUI.toast).toHaveBeenCalledWith('Status listing berubah. Silakan pilih aksi kembali.');
  ctx.ListingUI.api.mockRejectedValue(Error('akses gagal'));await obj.aksi(barang,'hapus');expect(ctx.ListingUI.galat).toHaveBeenCalledWith('akses gagal');
});
