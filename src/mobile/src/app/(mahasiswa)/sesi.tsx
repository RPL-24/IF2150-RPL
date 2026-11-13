import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import RefreshCw from 'lucide-react-native/icons/refresh-cw';
import CalendarDays from 'lucide-react-native/icons/calendar-days';

import { ambilKalender } from '@/api/kalender';
import { ambilSlotKonsultan, pesanSesi, type SlotKonsultasi } from '@/api/konsultasi';
import { ApiError } from '@/api/client';
import { AppBar, Banner, Lencana, Teks, Tombol } from '@/components';
import { useMuatan } from '@/lib/muatan';
import { jarak, sudut, warna } from '@/theme';

const fmtTanggal = (d: Date) => d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
const fmtJam = (s: string) => new Date(s).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
const bentrok = (a: SlotKonsultasi, b: { mulai: string; selesai: string }) => Date.parse(a.waktu) < Date.parse(b.selesai) && Date.parse(a.waktuSelesai) > Date.parse(b.mulai);

export default function PilihSesi() {
  const router = useRouter();
  const params = useLocalSearchParams<{ idKonsultan?: string; nama?: string; spesialisasi?: string }>();
  const id = params.idKonsultan ?? '';
  const ambilSlot = useCallback(() => ambilSlotKonsultan(id), [id]);
  const [muatan, muatUlang] = useMuatan(ambilSlot);
  const [tanggal, setTanggal] = useState(() => new Date().toDateString());
  const [terpilih, setTerpilih] = useState<string | null>(null);
  const [galatPesan, setGalatPesan] = useState('');
  const [sukses, setSukses] = useState(false);
  const [memesan, setMemesan] = useState(false);
  const slots = muatan.status === 'siap' ? muatan.data : [];
  const hari = useMemo(() => Array.from({ length: 3 }, (_, i) => { const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+i); return d; }), []);
  const slotHari = slots.filter((s) => new Date(s.waktu).toDateString() === tanggal);
  const rentang = useMemo(() => {
    const mulai = new Date(); mulai.setHours(0,0,0,0);
    const selesai = new Date(mulai); selesai.setDate(selesai.getDate()+8);
    return { mulai: mulai.toISOString(), selesai: selesai.toISOString() };
  }, []);
  const [kalender, setKalender] = useState<{ mulai: string; selesai: string }[]>([]);
  const [peringatanKalender, setPeringatanKalender] = useState(false);
  useEffect(() => { let aktif = true; void ambilKalender(rentang.mulai, rentang.selesai).then((r) => {
    if (!aktif) return;
    setKalender(r.mode === 'google' ? r.events.filter((e) => e.sumber === 'google').map((e) => ({ mulai: e.mulai, selesai: e.selesai })) : []);
    setPeringatanKalender(Boolean(r.peringatan) || r.mode === 'mock');
  }).catch(() => { if (aktif) setPeringatanKalender(true); });
  return () => { aktif = false; }; }, [rentang]);

  const konfirmasi = useCallback(async () => {
    if (!terpilih) return;
    setMemesan(true); setGalatPesan(''); setSukses(false);
    try {
      await pesanSesi(terpilih);
      setSukses(true);
      setTerpilih(null);
      muatUlang();
    } catch (error) {
      const pesan = error instanceof ApiError && error.status === 409
        ? (error.kode === 'SLOT_SUDAH_DIPESAN' ? 'Slot baru saja dipesan mahasiswa lain. Pilih slot lain.' : 'Jadwal bentrok dengan kalender atau sesi konsultasi Anda.')
        : 'Sesi gagal dipesan. Silakan tekan Konfirmasi sekali lagi.';
      setGalatPesan(pesan);
    } finally { setMemesan(false); }
  }, [terpilih, muatUlang]);

  return (
    <View style={styles.layar}>
      <AppBar judul="Pilih Sesi" onKembali={() => router.back()} />
      <ScrollView contentContainerStyle={styles.konten}>
        <Lencana label="Langkah 2 dari 2" jenis="info" />
        <View style={styles.kartuKonsultan}><Teks gaya="isiTebal">{params.nama ?? 'Konsultan'}</Teks><Teks gaya="keterangan">{params.spesialisasi ?? ''}</Teks></View>
        <Teks gaya="h3">Pilih tanggal</Teks>
        <View style={styles.strip}>{hari.map((d) => { const key = d.toDateString(); const aktif = key === tanggal; return <Pressable key={key} onPress={() => { setTanggal(key); setTerpilih(null); }} style={[styles.hari, aktif && styles.hariAktif]}><Teks gaya="keterangan" warna={aktif ? 'inversi' : 'teksSekunder'}>{d.toLocaleDateString('id-ID', { weekday: 'short' })}</Teks><Teks gaya="isiTebal" warna={aktif ? 'inversi' : 'teks'}>{d.getDate()}</Teks></Pressable>; })}</View>
        <Teks gaya="h3">Jadwal tersedia</Teks>
        {muatan.status === 'galat' ? <Banner jenis="galat">Gagal mengambil data jadwal konsultasi. Tekan Muat ulang untuk mencoba lagi. {muatan.pesan}</Banner> : null}
        {peringatanKalender ? <Banner jenis="info">Google Calendar belum terhubung atau tidak dapat diperiksa. Slot contoh tidak digunakan untuk menandai bentrok; server tetap memeriksa kalender yang terhubung saat konfirmasi.</Banner> : null}
        <Banner jenis="info">Slot dicek terhadap Google Calendar-mu sebelum pesanan disimpan.</Banner>
        <Tombol judul="Muat ulang" varian="sekunder" ikon={RefreshCw} onPress={muatUlang} memuat={muatan.status === 'memuat'} />
        {muatan.status === 'memuat' ? <Teks warna="teksSekunder">Memuat slot…</Teks> : null}
        {muatan.status === 'siap' && slotHari.length === 0 ? <View style={styles.kosong}><CalendarDays color={warna.teksSekunder} size={28}/><Teks gaya="keterangan">Tidak ada slot pada tanggal ini.</Teks></View> : null}
        {slotHari.map((slot) => {
          const sibuk = kalender.some((e) => bentrok(slot, e));
          const tersedia = slot.status === 'tersedia' && !sibuk;
          const aktif = terpilih === slot.idJadwal;
          return <Pressable key={slot.idJadwal} disabled={!tersedia} onPress={() => setTerpilih(slot.idJadwal)} style={[styles.slot, aktif && styles.slotAktif, !tersedia && styles.slotNonaktif]}>
            <View style={{ flex: 1, gap: 4 }}><Teks gaya="isiTebal">{fmtJam(slot.waktu)} – {fmtJam(slot.waktuSelesai)}</Teks><Teks gaya="keterangan">{fmtTanggal(new Date(slot.waktu))}</Teks></View>
            <Lencana label={sibuk ? 'Bentrok dengan kalendermu' : slot.status === 'terpesan' ? 'Terpesan' : 'Tersedia'} jenis={sibuk || slot.status === 'terpesan' ? 'peringatan' : 'sukses'} />
          </Pressable>;
        })}
        {sukses ? <Banner jenis="sukses">Sesi konsultasi berhasil dipesan. Sesi akan muncul di Beranda dan Kalender.</Banner> : null}
        {galatPesan ? <Banner jenis="galat">{galatPesan}</Banner> : null}
        <Tombol judul="Konfirmasi Pesanan" onPress={() => void konfirmasi()} disabled={!terpilih || memesan} memuat={memesan} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar }, konten: { padding: jarak.md, gap: jarak.md, paddingBottom: jarak.xxl },
  kartuKonsultan: { padding: jarak.md, backgroundColor: warna.kartu, borderWidth: 1, borderColor: warna.garis, borderRadius: sudut.lg, gap: jarak.xxs },
  strip: { flexDirection: 'row', gap: 5 }, hari: { flex: 1, minHeight: 58, alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: warna.kartu, borderRadius: sudut.md, borderWidth: 1, borderColor: warna.garis }, hariAktif: { backgroundColor: warna.merah, borderColor: warna.merah },
  slot: { flexDirection: 'row', alignItems: 'center', padding: jarak.md, gap: jarak.sm, borderRadius: sudut.md, borderWidth: 1, borderColor: warna.garis, backgroundColor: warna.kartu }, slotAktif: { borderColor: warna.merah, backgroundColor: warna.merahLembut }, slotNonaktif: { opacity: 0.65 },
  kosong: { alignItems: 'center', padding: jarak.xl, gap: jarak.sm, backgroundColor: warna.kartu, borderRadius: sudut.lg },
});
