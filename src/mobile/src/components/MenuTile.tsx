import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { jarak, sudut, ukuran, warna } from '@/theme';

import { Teks } from './Teks';

type Props = {
  ikon: LucideIcon;
  judul: string;
  /** Optional one-line description under the title. */
  keterangan?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Menu card on Beranda Administrator (I-03) leading to a management screen. */
export function MenuTile({ ikon: Ikon, judul, keterangan, onPress, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={keterangan ? `${judul}. ${keterangan}` : judul}
      onPress={onPress}
      style={({ pressed }) => [styles.wadah, pressed && { backgroundColor: warna.merahLembut }, style]}
    >
      <View style={styles.ikon}>
        <Ikon size={22} color={warna.merah} />
      </View>
      <Teks gaya="isiTebal">{judul}</Teks>
      {keterangan && <Teks gaya="keterangan">{keterangan}</Teks>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wadah: {
    flex: 1,
    gap: jarak.xs,
    padding: jarak.md,
    backgroundColor: warna.kartu,
    borderColor: warna.garis,
    borderWidth: ukuran.garis,
    borderRadius: sudut.lg,
    borderCurve: 'continuous',
  },
  ikon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: warna.merahLembut,
    borderRadius: sudut.md,
    borderCurve: 'continuous',
  },
});
