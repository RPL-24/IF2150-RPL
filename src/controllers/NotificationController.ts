import { supabase } from '../services/supabase';
import { PushNotificationUI, pushNotificationUI } from '../services/PushNotificationUI';
import { Notifikasi, TipeNotifikasi } from '../models/Notifikasi';
import { isAngkaPositif, PESAN_INPUT_TIDAK_VALID } from '../models/pesan';
import { ValidationError } from './AuthController';
import {
  bandingkanHarga,
  buatJudulPerubahanHarga,
  buatPesanPerubahanHarga,
  buatPesanKerugian,
  JUDUL_KERUGIAN,
  cekMarginNegatif,
  hitungUlangProduk,
  HasilKalkulasiProduk,
  ProdukResep,
} from './notification';

// Kelas NotificationController (C19) untuk UC09 dan UC10.
export class NotificationController {
  constructor(private readonly push: PushNotificationUI = pushNotificationUI) {}

  getPush(): PushNotificationUI {
    return this.push;
  }

  // Menyimpan harga beli baru + riwayatnya, lalu mengevaluasi dampaknya.
  // Jika fungsi update harga sudah dibuat anggota lain (UC05/UC08), cukup
  // panggil evaluasiPerubahanHarga() setelah harga tersimpan.
  async perbaruiHargaBeli(idBahan: string, hargaBaru: number): Promise<void> {
    if (!isAngkaPositif(hargaBaru)) {
      throw new ValidationError(PESAN_INPUT_TIDAK_VALID);
    }

    const { data: bahan, error } = await supabase
      .from('tbl_bahan_baku')
      .select('nama_bahan, harga_beli')
      .eq('id_bahan', idBahan)
      .single();
    if (error) throw new Error(error.message);

    const hargaLama = Number(bahan.harga_beli);
    if (hargaBaru === hargaLama) return;

    const { error: errUpdate } = await supabase
      .from('tbl_bahan_baku')
      .update({ harga_beli: hargaBaru })
      .eq('id_bahan', idBahan);
    if (errUpdate) throw new Error(errUpdate.message);

    const { error: errRiwayat } = await supabase.from('tbl_riwayat_harga_bahan').insert({
      id_bahan: idBahan,
      harga_beli_lama: hargaLama,
      harga_beli_baru: hargaBaru,
    });
    if (errRiwayat) throw new Error(errRiwayat.message);

    await this.evaluasiPerubahanHarga(idBahan, bahan.nama_bahan as string, hargaLama, hargaBaru);
  }

  // Dipanggil setelah harga beli bahan tersimpan di database.
  async evaluasiPerubahanHarga(
    idBahan: string,
    namaBahan: string,
    hargaLama: number,
    hargaBaru: number,
  ): Promise<void> {
    const daftarProduk = await this.muatProdukPemakaiBahan(idBahan);
    const hasil = hitungUlangProduk(daftarProduk, idBahan, hargaBaru);
    await this.simpanMarginDanPeringatan(hasil);

    // UC09: produk yang margin-nya negatif.
    const rugi = cekMarginNegatif(hasil);
    for (const produk of rugi) {
      await this.buatNotifikasiKerugian(produk, namaBahan, hargaBaru);
    }

    // UC10: setiap perubahan harga bahan baku (naik maupun turun).
    if (bandingkanHarga(hargaLama, hargaBaru) !== 'tetap') {
      await this.buatNotifikasiPerubahanHarga(
        idBahan,
        namaBahan,
        hargaLama,
        hargaBaru,
        hasil.length,
      );
    }
  }

  async buatNotifikasiKerugian(
    produk: HasilKalkulasiProduk,
    namaBahan: string,
    hargaBahanBaru: number,
  ): Promise<Notifikasi> {
    const pesan = buatPesanKerugian(
      produk.namaProduk,
      namaBahan,
      produk.margin,
      produk.hargaJual,
      hargaBahanBaru,
    );
    const notif = await this.simpanNotifikasi(
      'kerugian',
      JUDUL_KERUGIAN,
      pesan,
      produk.idProduk,
      null,
    );
    await this.kirimNotifikasi(JUDUL_KERUGIAN, pesan, {
      tipe: 'kerugian',
      idProduk: produk.idProduk,
    });
    return notif;
  }

  async buatNotifikasiPerubahanHarga(
    idBahan: string,
    namaBahan: string,
    hargaLama: number,
    hargaBaru: number,
    jumlahProdukTerdampak: number,
  ): Promise<Notifikasi> {
    const judul = buatJudulPerubahanHarga(namaBahan, hargaLama, hargaBaru);
    const pesan = buatPesanPerubahanHarga(hargaLama, hargaBaru, jumlahProdukTerdampak);
    const notif = await this.simpanNotifikasi('harga_bahan', judul, pesan, null, idBahan);
    await this.kirimNotifikasi(judul, pesan, { tipe: 'harga_bahan' });
    return notif;
  }

  async kirimNotifikasi(
    judul: string,
    pesan: string,
    data: { tipe: TipeNotifikasi; idProduk?: string },
  ): Promise<void> {
    try {
      await this.push.tampilkanNotifikasi(judul, pesan, data);
    } catch (e) {
      // Gagal menampilkan push tidak boleh membatalkan update harga;
      // notifikasi tetap tersimpan di menu notifikasi.
      console.warn('Gagal menampilkan push notification:', e);
    }
  }

  async muatNotifikasi(): Promise<Notifikasi[]> {
    const { data, error } = await supabase
      .from('tbl_notifikasi')
      .select('id_notifikasi, id_produk, tipe, judul, pesan_alert, waktu_kirim, is_read')
      .order('waktu_kirim', { ascending: false });
    if (error) throw new Error(error.message);

    return (data ?? []).map(
      (b) =>
        new Notifikasi(
          b.id_notifikasi as string,
          b.judul as string,
          b.pesan_alert as string,
          new Date(b.waktu_kirim as string),
          b.tipe as TipeNotifikasi,
          (b.id_produk as string | null) ?? null,
          b.is_read as boolean,
        ),
    );
  }

  async tandaiSudahDibaca(notif: Notifikasi): Promise<void> {
    const { error } = await supabase
      .from('tbl_notifikasi')
      .update({ is_read: true })
      .eq('id_notifikasi', notif.getIdNotifikasi());
    if (error) throw new Error(error.message);
    notif.markAsRead();
  }

  async tandaiSemuaDibaca(): Promise<void> {
    const { error } = await supabase
      .from('tbl_notifikasi')
      .update({ is_read: true })
      .eq('is_read', false);
    if (error) throw new Error(error.message);
  }

  private async simpanNotifikasi(
    tipe: TipeNotifikasi,
    judul: string,
    pesan: string,
    idProduk: string | null,
    idBahan: string | null,
  ): Promise<Notifikasi> {
    const { data, error } = await supabase
      .from('tbl_notifikasi')
      .insert({ tipe, judul, pesan_alert: pesan, id_produk: idProduk, id_bahan: idBahan })
      .select('id_notifikasi, waktu_kirim')
      .single();
    if (error) throw new Error(error.message);

    return new Notifikasi(
      data.id_notifikasi as string,
      judul,
      pesan,
      new Date(data.waktu_kirim as string),
      tipe,
      idProduk,
    );
  }

  private async simpanMarginDanPeringatan(hasil: HasilKalkulasiProduk[]): Promise<void> {
    for (const h of hasil) {
      const { error } = await supabase
        .from('tbl_produk')
        .update({ margin: h.margin, status_peringatan: h.rugi })
        .eq('id_produk', h.idProduk);
      if (error) throw new Error(error.message);
    }
  }

  // Semua produk milik pemilik yang resepnya memakai bahan tersebut,
  // beserta seluruh resepnya (agar HPP dihitung penuh).
  private async muatProdukPemakaiBahan(idBahan: string): Promise<ProdukResep[]> {
    const { data: pemakai, error: errPemakai } = await supabase
      .from('tbl_resep_bahan')
      .select('id_produk')
      .eq('id_bahan', idBahan);
    if (errPemakai) throw new Error(errPemakai.message);

    const idProduk = (pemakai ?? []).map((r) => r.id_produk as string);
    if (idProduk.length === 0) return [];

    const { data, error } = await supabase
      .from('tbl_produk')
      .select(
        'id_produk, nama_produk, harga_jual, tbl_resep_bahan(id_bahan, takaran, tbl_bahan_baku(harga_beli))',
      )
      .in('id_produk', idProduk);
    if (error) throw new Error(error.message);

    return (data ?? []).map((p) => ({
      idProduk: p.id_produk as string,
      namaProduk: p.nama_produk as string,
      hargaJual: Number(p.harga_jual),
      resep: ((p.tbl_resep_bahan ?? []) as unknown as {
        id_bahan: string;
        takaran: number | string;
        tbl_bahan_baku: { harga_beli: number | string } | { harga_beli: number | string }[] | null;
      }[]).map((r) => {
        const bahan = Array.isArray(r.tbl_bahan_baku) ? r.tbl_bahan_baku[0] : r.tbl_bahan_baku;
        return {
          idBahan: r.id_bahan,
          takaran: Number(r.takaran),
          hargaBeli: Number(bahan?.harga_beli ?? 0),
        };
      }),
    }));
  }
}
