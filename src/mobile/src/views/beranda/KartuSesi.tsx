import CalendarDays from 'lucide-react-native/icons/calendar-days';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Lencana, Teks, Tombol } from '@/components';
import type { Muatan } from '@/lib/muatan';
import { formatRentangJam, formatTanggal } from '@/lib/waktu';
import { jarak, warna } from '@/theme';

import { gayaKartu } from './gaya';

export type SesiBerikutnya = {
  /** ISO 8601 */
  waktu: string;
  /** ISO 8601 */
  waktuSelesai: string;
  /** Konsultan name. */
  nama: string;
  spesialisasi: string;
};

type Props = {
  sesi: Muatan<SesiBerikutnya | null>;
  /** Opens I-06 (Kalender) when a session exists. */
  onBuka: () => void;
  /** Opens I-07 (Konsultasi) from the empty state. */
  onPesan: () => void;
  onCobaLagi: () => void;
};

/** I-02-04: the next booked consultation, or a prompt to book one. */
export function KartuSesi({ sesi, onBuka, onPesan, onCobaLagi }: Props) {
  if (sesi.status === 'memuat') {
    return (
      <View style={[gayaKartu.kartu, gayaKartu.memuat]}>
        <ActivityIndicator color={warna.merah} accessibilityLabel="Memuat sesi konsultasi" />
      </View>
    );
  }

  if (sesi.status === 'galat') {
    return (
      <View style={gayaKartu.kartu}>
        <Teks gaya="isiTebal">Sesi konsultasi berikutnya</Teks>
        <Teks>{sesi.pesan}</Teks>
        <Tombol judul="Coba lagi" varian="teks" onPress={onCobaLagi} style={styles.tombolKiri} />
      </View>
    );
  }

  const data = sesi.data;
  if (!data) {
    return (
      <View style={gayaKartu.kartu}>
        <Teks gaya="isiTebal">Sesi konsultasi berikutnya</Teks>
        <Teks warna="teksSekunder">Belum ada sesi yang terjadwal.</Teks>
        <Tombol judul="Pesan sesi konsultasi" varian="teks" onPress={onPesan} style={styles.tombolKiri} />
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Membuka kalender"
      onPress={onBuka}
      style={({ pressed }) => [gayaKartu.kartu, pressed && { backgroundColor: warna.merahLembut }]}
    >
      <View style={styles.judul}>
        <Teks gaya="isiTebal" style={styles.isi}>
          Sesi konsultasi berikutnya
        </Teks>
        <Lencana label="Terjadwal" jenis="info" />
      </View>
      <View style={styles.baris}>
        <CalendarDays size={18} color={warna.teksSekunder} />
        <Teks style={styles.isi}>
          {formatTanggal(data.waktu)} · {formatRentangJam(data.waktu, data.waktuSelesai)}
        </Teks>
      </View>
      <Teks gaya="keterangan">
        Bersama {data.nama} ({data.spesialisasi})
      </Teks>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  judul: { flexDirection: 'row', alignItems: 'center', gap: jarak.xs },
  baris: { flexDirection: 'row', alignItems: 'center', gap: jarak.xs },
  isi: { flex: 1 },
  tombolKiri: { alignSelf: 'flex-start', paddingHorizontal: 0 },
});
