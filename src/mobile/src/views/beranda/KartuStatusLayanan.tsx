import House from 'lucide-react-native/icons/house';
import Server from 'lucide-react-native/icons/server';
import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import type { StatusLayanan } from '@/api/status';
import { Lencana, Teks, Tombol } from '@/components';
import type { Muatan } from '@/lib/muatan';
import { formatRelatif } from '@/lib/waktu';
import { jarak, warna } from '@/theme';

import { gayaKartu } from './gaya';

type Props = {
  status: Muatan<StatusLayanan>;
  /** Opens I-15 (Status Server). */
  onBuka: () => void;
  onCobaLagi: () => void;
};

const BARIS: { kunci: keyof StatusLayanan; label: string; ikon: LucideIcon }[] = [
  { kunci: 'website', label: 'Website', ikon: House },
  { kunci: 'server', label: 'Server', ikon: Server },
];

/** I-03-03: Website and Server with an Up/Down badge each. */
export function KartuStatusLayanan({ status, onBuka, onCobaLagi }: Props) {
  if (status.status === 'memuat') {
    return (
      <View style={[gayaKartu.kartu, gayaKartu.memuat]}>
        <ActivityIndicator color={warna.merah} accessibilityLabel="Memuat status layanan" />
      </View>
    );
  }

  if (status.status === 'galat') {
    return (
      <View style={gayaKartu.kartu}>
        <Teks gaya="isiTebal">Status layanan</Teks>
        <Teks>{status.pesan}</Teks>
        <Tombol judul="Coba lagi" varian="teks" onPress={onCobaLagi} style={styles.tombolKiri} />
      </View>
    );
  }

  const data = status.data;
  const terakhir = [data.website?.waktuCek, data.server?.waktuCek]
    .filter((w): w is string => !!w)
    .sort()
    .at(-1);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Membuka status server"
      onPress={onBuka}
      style={({ pressed }) => [gayaKartu.kartu, pressed && { backgroundColor: warna.merahLembut }]}
    >
      <Teks gaya="isiTebal">Status layanan</Teks>
      {BARIS.map(({ kunci, label, ikon: Ikon }) => {
        const cek = data[kunci];
        return (
          <View key={kunci} style={styles.baris}>
            <Ikon size={18} color={warna.teksSekunder} />
            <Teks style={styles.label}>{label}</Teks>
            {cek === null ? (
              <Lencana label="Belum dicek" />
            ) : (
              <Lencana label={cek.statusUptime ? 'Up' : 'Down'} jenis={cek.statusUptime ? 'sukses' : 'merah'} />
            )}
          </View>
        );
      })}
      <Teks gaya="keterangan">
        {terakhir ? `Diperiksa ${formatRelatif(terakhir)}` : 'Belum ada pemeriksaan'}
      </Teks>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baris: { flexDirection: 'row', alignItems: 'center', gap: jarak.xs },
  label: { flex: 1 },
  tombolKiri: { alignSelf: 'flex-start', paddingHorizontal: 0 },
});
