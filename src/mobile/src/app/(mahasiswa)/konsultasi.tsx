import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import RefreshCw from 'lucide-react-native/icons/refresh-cw';
import Users from 'lucide-react-native/icons/users';

import { ambilDaftarKonsultan, ambilSlotKonsultan, type Konsultan } from '@/api/konsultasi';
import { AppBar, Banner, Lencana, Teks, Tombol } from '@/components';
import { useMuatan } from '@/lib/muatan';
import { jarak, sudut, warna } from '@/theme';

type KonsultanTampil = Konsultan & { jumlahSlotTersedia: number };

async function ambilKonsultanDenganSlot(): Promise<KonsultanTampil[]> {
  const daftar = await ambilDaftarKonsultan();
  return Promise.all(daftar.map(async (k) => ({
    ...k,
    jumlahSlotTersedia: (await ambilSlotKonsultan(k.idKonsultan)).filter((slot) => slot.status === 'tersedia').length,
  })));
}

export default function Konsultasi() {
  const router = useRouter();
  const [muatan, muatUlang] = useMuatan(ambilKonsultanDenganSlot);
  const [mengambil, setMengambil] = useState<string | null>(null);
  const [galatPilih, setGalatPilih] = useState('');

  const pilih = useCallback(async (konsultan: Konsultan) => {
    setMengambil(konsultan.idKonsultan);
    setGalatPilih('');
    try {
      // Q-014 is fetched before navigating so the next screen has fresh slots.
      await ambilSlotKonsultan(konsultan.idKonsultan);
      router.push({ pathname: '/sesi', params: {
        idKonsultan: konsultan.idKonsultan,
        nama: konsultan.nama,
        spesialisasi: konsultan.spesialisasi,
      } });
    } catch (error) {
      setGalatPilih(error instanceof Error ? error.message : 'Gagal mengambil data jadwal konsultasi.');
    } finally {
      setMengambil(null);
    }
  }, [router]);

  return (
    <View style={styles.layar}>
      <AppBar judul="Pesan Konsultasi" />
      <ScrollView contentContainerStyle={styles.konten}>
        <View style={styles.langkah}><Lencana label="Langkah 1 dari 2" jenis="info" /></View>
        <Teks gaya="h2">Pilih konsultan</Teks>
        <Teks warna="teksSekunder">Pilih konsultan untuk melihat jadwal yang tersedia. Jadwal akan diperiksa terhadap Google Calendar sebelum dipesan.</Teks>

        {muatan.status === 'galat' ? (
          <Banner jenis="galat">Gagal mengambil data jadwal konsultasi. Tekan Muat ulang untuk mencoba lagi. {muatan.pesan}</Banner>
        ) : null}
        {galatPilih ? <Banner jenis="galat">Gagal mengambil data jadwal konsultasi. Tekan Muat ulang untuk mencoba lagi. {galatPilih}</Banner> : null}
        <Tombol judul="Muat ulang" varian="sekunder" ikon={RefreshCw} onPress={muatUlang} memuat={muatan.status === 'memuat'} />

        {muatan.status === 'memuat' ? <Teks warna="teksSekunder">Memuat daftar konsultan…</Teks> : null}
        {muatan.status === 'siap' && muatan.data.length === 0 ? (
          <View style={styles.kosong}><Users size={30} color={warna.teksSekunder} /><Teks gaya="isiTebal">Belum ada konsultan</Teks><Teks gaya="keterangan">Silakan periksa kembali nanti.</Teks></View>
        ) : null}
        {muatan.status === 'siap' ? muatan.data.map((k) => (
          <Pressable key={k.idKonsultan} disabled={mengambil !== null} onPress={() => void pilih(k)} style={({ pressed }) => [styles.kartu, pressed && { opacity: 0.7 }]}>
            <View style={styles.inisial}><Teks gaya="h3" warna="merah">{k.nama.split(/\s+/).slice(0, 2).map((x) => x[0]).join('').toUpperCase()}</Teks></View>
            <View style={styles.detail}><Teks gaya="isiTebal">{k.nama}</Teks><Teks gaya="keterangan">{k.spesialisasi}</Teks><Teks gaya="keterangan" warna="info">{k.jumlahSlotTersedia} slot tersedia</Teks></View>
            {mengambil === k.idKonsultan ? <Teks gaya="keterangan">Memuat…</Teks> : <Teks warna="merah">›</Teks>}
          </Pressable>
        )) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  konten: { padding: jarak.md, gap: jarak.md, paddingBottom: jarak.xxl },
  langkah: { alignItems: 'flex-start' },
  kartu: { flexDirection: 'row', alignItems: 'center', gap: jarak.md, padding: jarak.md, backgroundColor: warna.kartu, borderWidth: 1, borderColor: warna.garis, borderRadius: sudut.lg },
  inisial: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: warna.merahLembut },
  detail: { flex: 1, gap: jarak.xxs },
  kosong: { alignItems: 'center', gap: jarak.sm, padding: jarak.xl, backgroundColor: warna.kartu, borderRadius: sudut.lg },
});
