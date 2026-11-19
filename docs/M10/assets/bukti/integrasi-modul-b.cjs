// Jalankan dari root proyek: node docs/M10/assets/bukti/integrasi-modul-b.cjs
// Membuat DB uji terpisah; tidak menghapus/menginisialisasi ulang DB pengembangan.
const path=require('path'),fs=require('fs'),assert=require('node:assert/strict'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../../..'),R=p=>require(root+'/src/'+p);
R('node_modules/dotenv').config({path:root+'/src/.env'});
process.env.DB_NAME='itbeli_modulb_20261119_uji';process.env.DATABASE_URL='';process.env.BLOB_READ_WRITE_TOKEN='';
const {Client}=R('node_modules/pg');
const config=R('config/env');
const request=R('node_modules/supertest');
const results=[];
async function test(id,fn){try{const actual=await fn();results.push({id,status:'Pass',actual});console.log(id+' Pass '+JSON.stringify(actual));}catch(e){results.push({id,status:'Fail',actual:e.message});console.log(id+' Fail '+e.message);}}
async function main(){
  if(process.argv.includes('--cleanup')){
    const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'fixture-modul-b.json'))),db=R('config/db'),storage=R('penyimpanan/PenyimpananBerkas');
    for(const idAkun of fixture.akun){const rows=await db.query('SELECT path_berkas FROM foto_barang f JOIN barang b ON b.id_barang=f.id_barang WHERE b.id_penjual=$1',[idAkun]);await storage.hapus(rows.rows.map(f=>f.path_berkas));await db.query('DELETE FROM barang WHERE id_penjual=$1',[idAkun]);await db.query('DELETE FROM akun WHERE id_akun=$1',[idAkun]);}
    await db.pool.end();fs.unlinkSync(path.join(__dirname,'fixture-modul-b.json'));console.log('Fixture akun, sesi, listing, dan berkas putaran Modul B dibersihkan.');return;
  }
  const admin=new Client({...config.db,database:'postgres'});await admin.connect();
  try{await admin.query('CREATE DATABASE itbeli_modulb_20261119_uji');}catch(e){if(e.code!=='42P04') throw e;}finally{await admin.end();}
  const db=R('config/db'),app=R('app'),S=R('models/SesiLogin'),B=R('models/Barang'),storage=R('penyimpanan/PenyimpananBerkas');
  await db.query(fs.readFileSync(root+'/src/database/schema.sql','utf8').replace(/^\uFEFF/,''));
  const akun=[crypto.randomUUID(),crypto.randomUUID()],tokens=[crypto.randomUUID(),crypto.randomUUID()];
  for(let i=0;i<2;i++){
    await db.query(`INSERT INTO akun(id_akun,nama,nim,email,kata_sandi_hash,status_akun,setuju_kebijakan) VALUES($1,$2,$3,$4,$5,'Terverifikasi',true)`,[akun[i],'Penjual Uji '+i,'13525115',`modulb.${akun[i]}@itb.ac.id`,'fixture-tanpa-login']);
    await S.simpan(akun[i],tokens[i],new Date(),new Date(Date.now()+86400000));
  }
  const ref=R('models/ReferensiListing'),data={judul:'Buku Introduction to Algorithms',harga:'120000',deskripsiKondisi:'Layak pakai',idKategori:'Buku kuliah',idLokasi:ref.lokasi[0]},png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jO1sAAAAASUVORK5CYII=','base64');
  const http=(method,url,who=0)=>request(app)[method](url).set('Authorization','Bearer '+tokens[who]);
  async function create(overrides={},n=1){let q=http('post','/api/barang');for(const [k,v]of Object.entries({...data,...overrides}))q=q.field(k,String(v));q=q.field('urutanFoto',JSON.stringify(Array.from({length:n},(_,i)=>'baru:'+i)));for(let i=0;i<n;i++)q=q.attach('foto',png,{filename:'foto.png',contentType:'image/png'});return q;}
  let id,foto;
  await test('INT-TC13',async()=>{const r=await create();assert.equal(r.status,201);id=r.body.data.idBarang;const b=await B.cariById(id);assert.equal(b.status,'Tersedia');assert.equal(b.idPenjual,akun[0]);const f=await db.query('SELECT * FROM foto_barang WHERE id_barang=$1',[id]);assert.equal(f.rowCount,1);foto=f.rows[0];assert(fs.existsSync(root+'/src'+foto.path_berkas));return {http:r.status,status:b.status,foto:f.rowCount,berkasAda:true};});
  if(!id)throw Error('Fixture listing gagal dibuat');
  await test('INT-TC14',async()=>{const r=await http('get','/api/barang/saya');assert.equal(r.status,200);assert(r.body.data.some(x=>x.idBarang===id));assert(r.body.data.every(x=>x.idPenjual===akun[0]));return {http:200,hanyaPemilik:true,jumlah:r.body.data.length};});
  await test('INT-TC15',async()=>{const r=await http('put','/api/barang/'+id).field('judul','Buku Introduction to Algorithms Edisi Ketiga').field('harga','90000').field('deskripsiKondisi',data.deskripsiKondisi).field('idKategori',data.idKategori).field('idLokasi',data.idLokasi).field('urutanFoto',JSON.stringify([foto.id_foto]));assert.equal(r.status,200);const b=await B.cariById(id);assert.equal(b.harga,90000);assert.equal(b.judul,'Buku Introduction to Algorithms Edisi Ketiga');return {http:200,harga:b.harga,judul:b.judul};});
  await test('INT-TC16',async()=>{const statuses=[];for(const method of ['get','put','delete']){let q=http(method,'/api/barang/'+id,1);if(method==='put')q=q.field('judul','Serangan').field('harga','1').field('deskripsiKondisi',data.deskripsiKondisi).field('idKategori',data.idKategori).field('idLokasi',data.idLokasi).field('urutanFoto',JSON.stringify([foto.id_foto]));const r=await q;assert.equal(r.status,403);statuses.push(r.status);}assert.equal((await B.cariById(id)).harga,90000);return {http:statuses,dataTidakBerubah:true};});
  await test('INT-TC17',async()=>{const r=await http('patch','/api/barang/'+id+'/status').send({statusAsal:'Tersedia',statusTujuan:'Terjual'});assert.equal(r.status,200);assert.equal((await B.cariById(id)).status,'Terjual');const katalog=await B.getKatalog({daftarKata:['Buku Introduction to Algorithms Edisi Ketiga']});assert(!katalog.daftar.some(b=>b.idBarang===id));const saya=await http('get','/api/barang/saya');assert(saya.body.data.some(b=>b.idBarang===id&&b.status==='Terjual'));return {http:200,status:'Terjual',katalog:false,riwayat:true};});
  await test('INT-TC18',async()=>{const r=await http('patch','/api/barang/'+id+'/status').send({statusAsal:'Tersedia',statusTujuan:'Terjual'});assert.equal(r.status,409);return {http:409,status:(await B.cariById(id)).status};});
  await test('INT-TC19',async()=>{const r=await http('patch','/api/barang/'+id+'/status').send({statusAsal:'Terjual',statusTujuan:'Tersedia'});assert.equal(r.status,200);assert.equal((await B.cariById(id)).status,'Tersedia');assert((await B.getKatalog({daftarKata:['Buku Introduction to Algorithms Edisi Ketiga']})).daftar.some(b=>b.idBarang===id));return {http:200,status:'Tersedia',katalog:true};});
  await test('INT-TC20',async()=>{const r=await http('patch','/api/barang/'+id+'/status').send({statusAsal:'Terjual',statusTujuan:'Tersedia'});assert.equal(r.status,409);return {http:409,status:(await B.cariById(id)).status};});
  await test('INT-TC21',async()=>{const r=await create({},5);assert.equal(r.status,201);assert.equal((await db.query('SELECT * FROM foto_barang WHERE id_barang=$1',[r.body.data.idBarang])).rowCount,5);return {http:201,jumlahFoto:5};});
  await test('INT-TC22',async()=>{const codes=[];for(const [overrides,n]of [[{judul:''},1],[{},0],[{},6]]){const r=await create(overrides,n);assert.equal(r.status,400);codes.push(r.status);}return {http:codes};});
  await test('INT-TC23',async()=>{const r=await http('delete','/api/barang/'+id);assert.equal(r.status,200);assert.equal(await B.cariById(id),null);assert.equal((await db.query('SELECT * FROM foto_barang WHERE id_barang=$1',[id])).rowCount,0);assert(!fs.existsSync(root+'/src'+foto.path_berkas));return {http:200,barang:null,metadataFoto:0,berkasAda:false};});
  // Fixture khusus pengujian browser, tetap di DB uji.
  const fixture=await create({judul:'Earbuds ATARU'});assert.equal(fixture.status,201);
  fs.writeFileSync(path.join(__dirname,'fixture-modul-b.json'),JSON.stringify({tokens,akun,id:fixture.body.data.idBarang,baseURL:'http://localhost:3117',database:process.env.DB_NAME},null,2));
  fs.writeFileSync(path.join(__dirname,'integrasi-modul-b.json'),JSON.stringify(results,null,2));
  const server=app.listen(3117,'0.0.0.0',()=>console.log('Server pengujian UC07–UC12 siap di port 3117'));
  async function cleanup(){server.close();for(const idAkun of akun){const rows=await db.query('SELECT path_berkas FROM foto_barang f JOIN barang b ON b.id_barang=f.id_barang WHERE b.id_penjual=$1',[idAkun]);await storage.hapus(rows.rows.map(f=>f.path_berkas));await db.query('DELETE FROM barang WHERE id_penjual=$1',[idAkun]);await db.query('DELETE FROM akun WHERE id_akun=$1',[idAkun]);}await db.pool.end();process.exit(0);}
  process.on('SIGINT',cleanup);process.on('SIGTERM',cleanup);
}
main().catch(e=>{console.error(e.message);process.exit(1);});
