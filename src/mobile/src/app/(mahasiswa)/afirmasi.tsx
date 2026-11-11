import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import Clock from 'lucide-react-native/icons/clock';
import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ambilAfirmasi, hapusAfirmasi, simpanWaktuAfirmasi, type Afirmasi as ItemAfirmasi } from '@/api';
import { AppBar, Banner, Teks, Tombol } from '@/components';
import { useMuatan } from '@/lib/muatan';
import { formatWaktuHarian } from '@/lib/waktu';
import { jarak, sudut, ukuran, warna } from '@/theme';

/** Mirrors the backend's `KONTEN_BAWAAN` (Algo-028) for the I-04-02 preview. */
const KONTEN_BAWAAN =
  'Hari ini kamu sudah melakukan yang terbaik. Tarik napas, dan beri dirimu ruang untuk beristirahat.';

/** I-04-04: the field's default send time. */
const WAKTU_BAWAAN = '07:00';

/** I-04-05: quick-pick chips. */
const PILIHAN_WAKTU = ['06:00', '07:00', '08:00', '21:00'] as const;

/** "HH:MM" -> a Date at that local time, for opening the picker. */
function keTanggal(hhmm: string): Date {
  const [jam, menit] = hhmm.split(':').map(Number);
  const tanggal = new Date();
  tanggal.setHours(jam, menit, 0, 0);
  return tanggal;
}

/** A picker Date back to "HH:MM" for storage. */
function jamMenit(tanggal: Date): string {
  const dua = (n: number) => String(n).padStart(2, '0');
  return `${dua(tanggal.getHours())}:${dua(tanggal.getMinutes())}`;
}

/** I-04-05: one quick-pick time. The active chip is red. */
function Chip({ waktu, aktif, onTekan }: { waktu: string; aktif: boolean; onTekan: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Pilih pukul ${formatWaktuHarian(waktu)}`}
      accessibilityState={{ selected: aktif }}
      onPress={onTekan}
      style={({ pressed }) => [styles.chip, aktif ? styles.chipAktif : styles.chipNonaktif, pressed && { opacity: 0.7 }]}
    >
      <Teks gaya="label" style={{ color: aktif ? warna.inversi : warna.teksSekunder }}>
        {waktu}
      </Teks>
    </Pressable>
  );
}

/**
 * The form half of I-04. Mounted with `key={row id}` so it re-initializes
 * whenever the saved schedule appears or disappears, and keeps the user's
 * in-progress edits while the same schedule stays on the server.
 */
function Formulir({ awal }: { awal: ItemAfirmasi | null }) {
  // I-04-03: "on" means the backend has a row (`ambilAfirmasi` returns null otherwise).
  const [aktif, setAktif] = useState(awal !== null);
  const [waktu, setWaktu] = useState(awal?.waktuKirim ?? WAKTU_BAWAAN);
  const [tampilPicker, setTampilPicker] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);
  // I-04-07 success / I-04-08 error; only one shows at a time.
  const [sukses, setSukses] = useState<string | null>(null);
  const [galat, setGalat] = useState(false);

  /** `submitWaktuPengiriman(waktu)`: save the time, creating the schedule if needed. */
  const simpan = async () => {
    setMenyimpan(true);
    setSukses(null);
    setGalat(false);
    try {
      await simpanWaktuAfirmasi(waktu);
      setAktif(true);
      setSukses('Setelan tersimpan.');
    } catch {
      setGalat(true); // I-04-08, UC-01 alternative scenario 1.
    } finally {
      setMenyimpan(false);
    }
  };

  /** I-04-03: off deletes the schedule; on re-creates it at the picked time. */
  const ubahAktif = async (berikutnya: boolean) => {
    setMenyimpan(true);
    setSukses(null);
    setGalat(false);
    try {
      await (berikutnya ? simpanWaktuAfirmasi(waktu) : hapusAfirmasi());
      setAktif(berikutnya); // On failure the Switch reverts on its own (value-bound).
      setSukses(berikutnya ? 'Setelan tersimpan.' : 'Pengiriman afirmasi harian dimatikan.');
    } catch {
      setGalat(true);
    } finally {
      setMenyimpan(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.isi} keyboardShouldPersistTaps="handled">
      {/* I-04-02 */}
      <View style={styles.kartu}>
        <Teks gaya="label">Contoh afirmasi</Teks>
        <Teks>{awal?.konten ?? KONTEN_BAWAAN}</Teks>
      </View>

      {/* I-04-03 */}
      <View style={[styles.kartu, styles.barisToggle]}>
        <Teks gaya="label">Kirim afirmasi harian</Teks>
        <Switch
          accessibilityLabel="Kirim afirmasi harian"
          value={aktif}
          onValueChange={(nilai) => void ubahAktif(nilai)}
          disabled={menyimpan}
          trackColor={{ false: warna.garis, true: warna.merah }}
          thumbColor={warna.inversi}
        />
      </View>

      <View style={styles.kartu}>
        {/* I-04-04 */}
        <Teks gaya="label">Waktu pengiriman</Teks>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Waktu pengiriman"
          accessibilityHint="Membuka pemilih waktu"
          onPress={() => setTampilPicker(true)}
          style={({ pressed }) => [styles.isianWaktu, pressed && { opacity: 0.7 }]}
        >
          <Clock size={18} color={warna.teksSekunder} />
          <Teks gaya="isiTebal" style={styles.teksWaktu}>
            {waktu}
          </Teks>
        </Pressable>

        {/* I-04-05 */}
        <View style={styles.chips}>
          {PILIHAN_WAKTU.map((pilihan) => (
            <Chip
              key={pilihan}
              waktu={pilihan}
              aktif={waktu === pilihan}
              onTekan={() => setWaktu(pilihan)}
            />
          ))}
        </View>

        {/* I-04-06 */}
        <Teks gaya="keterangan" warna="teksSekunder">
          Afirmasi dikirim setiap hari pukul {formatWaktuHarian(waktu)}.
        </Teks>

        {tampilPicker && (
          <>
            <DateTimePicker
              value={keTanggal(waktu)}
              mode="time"
              is24Hour
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, tanggal) => {
                if (tanggal) setWaktu(jamMenit(tanggal));
                if (Platform.OS === 'android') setTampilPicker(false);
              }}
            />
            {Platform.OS === 'ios' && (
              <Tombol judul="Selesai" varian="teks" onPress={() => setTampilPicker(false)} />
            )}
          </>
        )}
      </View>

      {/* I-04-07 */}
      <Tombol judul="Simpan Setelan" memuat={menyimpan} onPress={() => void simpan()} />

      {sukses && <Banner jenis="sukses">{sukses}</Banner>}
      {/* I-04-08 */}
      {galat && <Banner jenis="galat">Setelan gagal disimpan. Silakan coba lagi.</Banner>}
    </ScrollView>
  );
}

/** I-04 Daily Affirmations (`AffirmationView`), UC-01. */
export default function Afirmasi() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [muatan, muatUlang] = useMuatan(ambilAfirmasi);

  return (
    <View style={[styles.layar, { paddingTop: top }]}>
      {/* I-04-01 */}
      <AppBar judul="Daily Affirmations" onKembali={router.back} />

      {muatan.status === 'memuat' ? (
        <ActivityIndicator size="large" color={warna.merah} style={styles.memuat} />
      ) : muatan.status === 'galat' ? (
        <View style={styles.tengah}>
          <Banner jenis="galat">{muatan.pesan}</Banner>
          <Tombol judul="Coba Lagi" varian="sekunder" onPress={muatUlang} />
        </View>
      ) : (
        <Formulir key={muatan.data?.idAffirmation ?? 'belum'} awal={muatan.data} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: jarak.md, gap: jarak.sm },
  memuat: { marginTop: jarak.xl },
  tengah: { padding: jarak.md, gap: jarak.sm },
  kartu: {
    backgroundColor: warna.kartu,
    borderColor: warna.garis,
    borderWidth: ukuran.garis,
    borderRadius: sudut.lg,
    borderCurve: 'continuous',
    padding: jarak.md,
    gap: jarak.sm,
  },
  barisToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  isianWaktu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: jarak.xs,
    minHeight: ukuran.tinggiKontrol,
    paddingHorizontal: jarak.md,
    backgroundColor: warna.latar,
    borderColor: warna.garis,
    borderWidth: ukuran.garis,
    borderRadius: sudut.md,
    borderCurve: 'continuous',
  },
  teksWaktu: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: jarak.xs },
  chip: {
    paddingHorizontal: jarak.md,
    paddingVertical: jarak.xs,
    borderRadius: sudut.penuh,
    borderWidth: ukuran.garis,
  },
  chipAktif: { backgroundColor: warna.merah, borderColor: warna.merah },
  chipNonaktif: { backgroundColor: warna.kartu, borderColor: warna.garis },
});
