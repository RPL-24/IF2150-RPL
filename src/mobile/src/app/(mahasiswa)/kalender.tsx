import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import CalendarDays from 'lucide-react-native/icons/calendar-days';
import RefreshCw from 'lucide-react-native/icons/refresh-cw';

import { ambilKalender, type EventKalender } from '@/api';
import { eventPadaTanggal, labelKonsultan, labelWaktuEvent, penandaEvent } from '@/lib/kalender';
import { AppBar, Banner, Lencana, Teks, Tombol } from '@/components';
import { jarak, sudut, warna } from '@/theme';

const NAMA_HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function awalMinggu(tanggal: Date) {
  const hasil = new Date(tanggal);
  hasil.setHours(0, 0, 0, 0);
  const selisih = (hasil.getDay() + 6) % 7;
  hasil.setDate(hasil.getDate() - selisih);
  return hasil;
}

function tanggalSama(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function Kalender() {
  const [minggu, setMinggu] = useState(() => awalMinggu(new Date()));
  const [hariDipilih, setHariDipilih] = useState(() => new Date());
  const [events, setEvents] = useState<EventKalender[]>([]);
  const [peringatan, setPeringatan] = useState<string | undefined>();
  const [mode, setMode] = useState<'google' | 'mock'>('mock');
  const [memuat, setMemuat] = useState(true);

  const hariMinggu = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const tanggal = new Date(minggu);
    tanggal.setDate(minggu.getDate() + i);
    return tanggal;
  }), [minggu]);

  const muat = useCallback(async () => {
    setMemuat(true);
    setPeringatan(undefined);
    try {
      const dari = new Date(minggu);
      const sampai = new Date(minggu);
      sampai.setDate(sampai.getDate() + 7);
      const hasil = await ambilKalender(
        dari.toISOString(),
       sampai.toISOString(),
      );
      setEvents(hasil.events);
      setMode(hasil.mode);
      setPeringatan(hasil.peringatan);
    } catch (error) {
      setPeringatan(error instanceof Error ? error.message : 'Gagal mengambil data event.');
    } finally {
      setMemuat(false);
    }
  }, [minggu]);

  useEffect(() => { void muat(); }, [muat]);

  const eventsHariIni = useMemo(
    () => events.filter((event) => eventPadaTanggal(event, hariDipilih)),
    [events, hariDipilih],
  );

  const labelBulan = minggu.getMonth() === hariMinggu[6]?.getMonth()
    ? `${NAMA_BULAN[minggu.getMonth()]} ${minggu.getFullYear()}`
    : `${NAMA_BULAN[minggu.getMonth()]} – ${NAMA_BULAN[hariMinggu[6]!.getMonth()]} ${hariMinggu[6]!.getFullYear()}`;

  return (
    <View style={styles.layar}>
      <AppBar judul="Kalender" />
      <ScrollView contentContainerStyle={styles.konten}>
        <View style={styles.barisJudul}>
          <View>
            <Teks gaya="h2">{labelBulan}</Teks>
            <Teks gaya="keterangan">Jadwal kegiatan dan sesi konsultasi</Teks>
          </View>
          <CalendarDays size={24} color={warna.merah} />
        </View>

        {peringatan ? (
          <Banner jenis="galat" judul="Kalender tidak dapat dimuat">
            {`${peringatan} Tekan Muat ulang untuk mencoba lagi.`}
          </Banner>
        ) : null}

        <Tombol judul="Muat ulang" varian="sekunder" ikon={RefreshCw} onPress={() => void muat()} memuat={memuat} />

        {mode === 'mock' && !peringatan ? (
          <Banner jenis="info">Menampilkan contoh acara. Hubungkan Google Calendar untuk melihat kalender pribadi.</Banner>
        ) : null}

        <View style={styles.strip}>
          {hariMinggu.map((tanggal) => {
            const aktif = tanggalSama(tanggal, hariDipilih);
            return (
              <Pressable
                key={tanggal.toISOString()}
                accessibilityRole="button"
                accessibilityState={{ selected: aktif }}
                onPress={() => setHariDipilih(tanggal)}
                style={[styles.hari, aktif && styles.hariAktif]}
              >
                <Teks gaya="keterangan" warna={aktif ? 'inversi' : 'teksSekunder'}>{NAMA_HARI[tanggal.getDay()]}</Teks>
                <Teks gaya="isiTebal" warna={aktif ? 'inversi' : 'teks'}>{tanggal.getDate()}</Teks>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.legend}>
          <Lencana label="Google Calendar" jenis="info" />
          <Lencana label="Sesi saya" jenis="merah" />
          <Lencana label="Slot tersedia" jenis="netral" />
        </View>

        <View style={styles.barisDaftar}>
          <Teks gaya="h3">Agenda {hariDipilih.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</Teks>
          <Teks gaya="keterangan">{eventsHariIni.length} acara</Teks>
        </View>

        {memuat ? (
          <Teks gaya="keterangan">Memuat agenda…</Teks>
        ) : eventsHariIni.length === 0 ? (
          <View style={styles.kosong}>
            <CalendarDays size={28} color={warna.teksSekunder} />
            <Teks gaya="isiTebal">Belum ada acara</Teks>
            <Teks gaya="keterangan">Tidak ada jadwal pada hari yang dipilih.</Teks>
          </View>
        ) : eventsHariIni.map((event, index) => {
          const penanda = penandaEvent(event.sumber);
          const konsultan = labelKonsultan(event);
          return (
            <View key={`${event.mulai}-${event.judul}-${index}`} style={styles.kartu}>
              <View style={[styles.garisWarna, { backgroundColor: warna[penanda.garis] }]} />
              <View style={styles.detailEvent}>
                <Teks gaya="isiTebal">{event.judul}</Teks>
                <Teks gaya="keterangan">{labelWaktuEvent(event)}</Teks>
                {konsultan ? <Teks gaya="keterangan">{konsultan}</Teks> : null}
                <Lencana label={penanda.label} jenis={penanda.lencana} />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  konten: { padding: jarak.md, gap: jarak.md, paddingBottom: jarak.xxl },
  barisJudul: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  strip: { flexDirection: 'row', justifyContent: 'space-between', gap: 4 },
  hari: { flex: 1, minHeight: 66, alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: warna.kartu, borderRadius: sudut.md, borderWidth: 1, borderColor: warna.garis },
  hariAktif: { backgroundColor: warna.merah, borderColor: warna.merah },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: jarak.xs },
  barisDaftar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kartu: { flexDirection: 'row', backgroundColor: warna.kartu, borderRadius: sudut.md, borderWidth: 1, borderColor: warna.garis, overflow: 'hidden' },
  garisWarna: { width: 5 },
  detailEvent: { flex: 1, padding: jarak.md, gap: jarak.xs },
  kosong: { alignItems: 'center', gap: jarak.xs, backgroundColor: warna.kartu, padding: jarak.xl, borderRadius: sudut.lg, borderWidth: 1, borderColor: warna.garis },
});
