// C18 PercakapanController - milik modul D.
// Token sudah diverifikasi Otorisasi.wajibLogin di route, sehingga operasi menerima idAkun dari req.akun.
// Hasil: { berhasil, status, data } atau { berhasil, status, pesan } (status = kode HTTP).
const Kriptografi = require('../pendukung/Kriptografi');
const Percakapan = require('../models/Percakapan');
const Pesan = require('../models/Pesan');
const Barang = require('../models/Barang');
const FotoBarang = require('../models/FotoBarang');
const Akun = require('../models/Akun');
const NotifikasiController = require('./NotifikasiController');

const TAUTAN_KEBIJAKAN_PRIVASI = '/legal?jenis=kebijakan-privasi'; // KF39, halaman legal modul A
const PESAN_TIDAK_TERBUKA = '[Pesan tidak dapat dibuka]';
const PANJANG_MAKS_PESAN = 2000;
const PANJANG_MAKS_CUPLIKAN = 80;
// Kolom id bertipe UUID; id lain ditolak lebih awal agar tidak menjadi galat kueri
const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const gagal = (status, pesan) => ({ berhasil: false, status, pesan });
const sukses = (status, data) => ({ berhasil: true, status, data });

class PercakapanController {
  // KF35: hanya pembeli dan penjual percakapan; admin pun bukan peserta
  static verifikasiPeserta(idAkun, percakapan) {
    return percakapan.cekPeserta(idAkun);
  }

  // KF36: null dari Kriptografi (kunci salah / isi diubah) ditampilkan sebagai teks pengganti
  static dekripsiPesan(daftarPesan) {
    return daftarPesan.map((pesan) => Kriptografi.dekripsi(pesan.isiPesanTerenkripsi) ?? PESAN_TIDAK_TERBUKA);
  }

  // Algo-016 (KF31)
  static async mulaiPercakapan(idAkun, idBarang) {
    if (!POLA_UUID.test(String(idBarang ?? ''))) return gagal(404, 'Barang tidak ditemukan.');
    const barang = await Barang.cariById(idBarang);
    if (barang === null) return gagal(404, 'Barang tidak ditemukan.');
    if (barang.idPenjual === idAkun) return gagal(400, 'Anda tidak dapat menghubungi listing milik sendiri.');
    if (await Akun.getStatusBlokir(barang.idPenjual)) {
      return gagal(403, 'Penjual sedang diblokir dan tidak dapat dihubungi.');
    }

    const lama = await Percakapan.cariByKombinasi(idBarang, idAkun, barang.idPenjual);
    if (lama !== null) return sukses(200, { idPercakapan: lama.idPercakapan });

    const baru = await Percakapan.simpan(idBarang, idAkun, barang.idPenjual);
    return sukses(201, { idPercakapan: baru.idPercakapan });
  }

  // Algo-017 (KF32, KF35, KF36, KF39)
  static async bukaPercakapan(idAkun, idPercakapan) {
    if (!POLA_UUID.test(String(idPercakapan ?? ''))) return gagal(404, 'Percakapan tidak ditemukan.');
    const percakapan = await Percakapan.cariById(idPercakapan);
    if (percakapan === null) return gagal(404, 'Percakapan tidak ditemukan.');
    if (!PercakapanController.verifikasiPeserta(idAkun, percakapan)) {
      return gagal(403, 'Anda bukan peserta percakapan ini.');
    }

    const daftarPesan = await Pesan.getDaftarPesan(idPercakapan);
    const daftarIsi = PercakapanController.dekripsiPesan(daftarPesan);
    await Pesan.tandaiDibaca(idPercakapan, idAkun);

    return sukses(200, {
      idPercakapan,
      idAkunSaya: idAkun,
      lawanBicara: await percakapan.getLawanBicara(idAkun),
      barang: await PercakapanController.ambilRingkasanBarang(percakapan.idBarang),
      pesan: daftarPesan.map((pesan, i) => ({
        idPesan: pesan.idPesan,
        idPengirim: pesan.idPengirim,
        isi: daftarIsi[i],
        waktuKirim: pesan.waktuKirim,
        dariSaya: pesan.idPengirim === idAkun,
      })),
      tautanKebijakanPrivasi: TAUTAN_KEBIJAKAN_PRIVASI,
    });
  }

  // KF36
  static enkripsiPesan(isi) {
    return Kriptografi.enkripsi(isi);
  }

  static potongCuplikan(isi) {
    return isi.length > PANJANG_MAKS_CUPLIKAN ? `${isi.slice(0, PANJANG_MAKS_CUPLIKAN - 1)}…` : isi;
  }

  // Algo-018 (KF32, KF34, KF35, KF36)
  static async kirimPesan(idAkun, idPercakapan, isi) {
    const isiBersih = typeof isi === 'string' ? isi.trim() : '';
    if (isiBersih === '') return gagal(400, 'Isi pesan tidak boleh kosong.');
    if (isiBersih.length > PANJANG_MAKS_PESAN) {
      return gagal(400, `Isi pesan maksimal ${PANJANG_MAKS_PESAN} karakter.`);
    }

    if (!POLA_UUID.test(String(idPercakapan ?? ''))) return gagal(404, 'Percakapan tidak ditemukan.');
    const percakapan = await Percakapan.cariById(idPercakapan);
    if (percakapan === null) return gagal(404, 'Percakapan tidak ditemukan.');
    if (!PercakapanController.verifikasiPeserta(idAkun, percakapan)) {
      return gagal(403, 'Anda bukan peserta percakapan ini.');
    }

    // shortcut: simpan pesan dan perbarui waktu tanpa transaksi; bila update gagal, pesan tetap tersimpan
    // dan urutan daftar saja yang tertinggal. Pakai transaksi bila model menerima client.
    const pesanBaru = await percakapan.addPesan(idAkun, PercakapanController.enkripsiPesan(isiBersih));
    await percakapan.perbaruiWaktuTerakhir(pesanBaru.waktuKirim || new Date());

    const idPenerima = idAkun === percakapan.idPembeli ? percakapan.idPenjual : percakapan.idPembeli;
    await PercakapanController.beritahuPenerima(percakapan, idPenerima);

    return sukses(201, {
      idPesan: pesanBaru.idPesan,
      idPengirim: idAkun,
      isi: isiBersih,
      waktuKirim: pesanBaru.waktuKirim,
      dariSaya: true,
    });
  }

  // KF34: kegagalan notifikasi hanya dicatat, pesan tetap terkirim.
  // KF36: notifikasi tersimpan plaintext, jadi tidak memuat isi/cuplikan pesan.
  static async beritahuPenerima(percakapan, idPenerima) {
    try {
      // Lawan bicara dari sisi penerima adalah pengirim
      const pengirim = await percakapan.getLawanBicara(idPenerima);
      const nama = pengirim ? pengirim.nama : 'Pengguna ITBELI';
      await NotifikasiController.kirimNotifikasi(idPenerima, 'pesan', `Pesan baru dari ${nama}`);
    } catch (galat) {
      console.error('Notifikasi pesan baru gagal dikirim:', galat);
    }
  }

  // Kartu ringkas barang pada kepala ruang; null bila listing sudah dihapus (id_barang ON DELETE SET NULL)
  static async ambilRingkasanBarang(idBarang) {
    if (idBarang == null) return null;
    const barang = await Barang.cariById(idBarang);
    if (barang === null) return null;
    const [fotoUtama] = await FotoBarang.getGaleri(idBarang);
    return {
      idBarang: barang.idBarang,
      judul: barang.judul,
      harga: barang.harga,
      status: barang.status,
      fotoUtama: fotoUtama ? fotoUtama.pathBerkas : null,
    };
  }
}

module.exports = PercakapanController;
