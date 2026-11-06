import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { jarak, sudut, warna } from '@/theme';

import { Teks } from './Teks';

type Props = {
  judul: string;
  /** Shows a back arrow that calls this. Usually `router.back`. */
  onKembali?: () => void;
  /** Optional element on the right, e.g. an icon button. */
  aksi?: ReactNode;
  /** `terang` for Mahasiswa screens, `gelap` (charcoal) for Administrator screens. */
  varian?: 'terang' | 'gelap';
};

/** Top app bar. Pads itself below the status bar / notch. */
export function AppBar({ judul, onKembali, aksi, varian = 'terang' }: Props) {
  const { top } = useSafeAreaInsets();
  const gelap = varian === 'gelap';
  const warnaIsi = gelap ? 'inversi' : 'teks';
  return (
    <View
      style={[
        styles.wadah,
        { paddingTop: top + jarak.xs },
        gelap ? { backgroundColor: warna.arang } : styles.terang,
      ]}
    >
      {onKembali && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          hitSlop={jarak.xs}
          onPress={onKembali}
          style={({ pressed }) => [styles.kembali, pressed && { opacity: 0.6 }]}
        >
          <ChevronLeft size={24} color={warna[warnaIsi]} />
        </Pressable>
      )}
      <Teks gaya="h3" warna={warnaIsi} accessibilityRole="header" numberOfLines={1} style={styles.judul}>
        {judul}
      </Teks>
      {aksi}
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: jarak.xs,
    paddingHorizontal: jarak.md,
    paddingBottom: jarak.sm,
  },
  terang: {
    backgroundColor: warna.kartu,
    borderBottomColor: warna.garis,
    borderBottomWidth: 1,
  },
  kembali: { marginLeft: -jarak.xs, padding: jarak.xxs, borderRadius: sudut.sm },
  judul: { flex: 1 },
});
