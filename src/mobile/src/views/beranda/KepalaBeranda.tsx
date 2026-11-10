import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Teks } from '@/components';
import { jarak, sudut, ukuran, warna } from '@/theme';

/** One round icon button on the right of the header. */
export type AksiKepala = {
  ikon: LucideIcon;
  /** Accessibility label, e.g. "Notifikasi" or "Keluar". */
  label: string;
  onPress?: () => void;
};

type Props = {
  /** Small line above the title, e.g. "Selamat pagi," or "Panel Administrator". */
  atas: string;
  /** Title, e.g. the user's name or "Halo, Admin". */
  judul: string;
  /** Buttons shown left to right (bell and logout on I-02, logout on I-03). */
  aksi: AksiKepala[];
};

/** Header shared by I-02 and I-03 (I-02-01/02, I-03-01/02). */
export function KepalaBeranda({ atas, judul, aksi }: Props) {
  return (
    <View style={styles.kepala}>
      <View style={styles.teks}>
        <Teks warna="teksSekunder">{atas}</Teks>
        <Teks gaya="h2" numberOfLines={1}>
          {judul}
        </Teks>
      </View>
      {aksi.map(({ ikon: Ikon, label, onPress }) => (
        <Pressable
          key={label}
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={onPress}
          style={({ pressed }) => [styles.tombol, pressed && { backgroundColor: warna.merahLembut }]}
        >
          <Ikon size={22} color={warna.teks} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  kepala: { flexDirection: 'row', alignItems: 'center', gap: jarak.sm },
  teks: { flex: 1 },
  tombol: {
    width: ukuran.tinggiKontrol,
    height: ukuran.tinggiKontrol,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: warna.kartu,
    borderColor: warna.garis,
    borderWidth: ukuran.garis,
    borderRadius: sudut.penuh,
  },
});
