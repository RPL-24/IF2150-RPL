import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Teks, Tombol } from '@/components';
import { formatWaktuHarian } from '@/lib/waktu';
import type { Muatan } from '@/lib/muatan';
import { warna } from '@/theme';

import { gayaKartu } from './gaya';

export type Afirmasi = {
  konten: string;
  /** "HH:MM" */
  waktuKirim: string;
};

type Props = {
  afirmasi: Muatan<Afirmasi | null>;
  /** Opens I-04 (Daily Affirmations). */
  onBuka: () => void;
  onCobaLagi: () => void;
};

/** I-02-03: today's affirmation, or a prompt to set one up. */
export function KartuAfirmasi({ afirmasi, onBuka, onCobaLagi }: Props) {
  if (afirmasi.status === 'memuat') {
    return (
      <View style={[gayaKartu.kartu, styles.merah, gayaKartu.memuat]}>
        <ActivityIndicator color={warna.inversi} accessibilityLabel="Memuat afirmasi" />
      </View>
    );
  }

  if (afirmasi.status === 'galat') {
    return (
      <View style={gayaKartu.kartu}>
        <Teks gaya="keterangan">Afirmasi hari ini</Teks>
        <Teks>{afirmasi.pesan}</Teks>
        <Tombol judul="Coba lagi" varian="teks" onPress={onCobaLagi} style={styles.tombolKiri} />
      </View>
    );
  }

  const data = afirmasi.data;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Membuka pengaturan afirmasi harian"
      onPress={onBuka}
      style={({ pressed }) => [gayaKartu.kartu, styles.merah, pressed && styles.ditekan]}
    >
      <Teks gaya="keterangan" warna="inversi">
        Afirmasi hari ini
      </Teks>
      {data ? (
        <>
          <Teks gaya="h3" warna="inversi">
            {data.konten}
          </Teks>
          <Teks gaya="keterangan" warna="inversi">
            Dikirim setiap hari pukul {formatWaktuHarian(data.waktuKirim)}
          </Teks>
        </>
      ) : (
        <>
          <Teks gaya="h3" warna="inversi">
            Mulai harimu dengan kata-kata baik.
          </Teks>
          <Teks gaya="keterangan" warna="inversi">
            Ketuk untuk mengatur waktu afirmasi harian.
          </Teks>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  merah: { backgroundColor: warna.merah, borderColor: warna.merah },
  ditekan: { opacity: 0.85 },
  tombolKiri: { alignSelf: 'flex-start', paddingHorizontal: 0 },
});
