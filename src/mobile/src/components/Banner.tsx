import type { LucideIcon } from 'lucide-react-native';
import AlertCircle from 'lucide-react-native/icons/circle-exclamation-point';
import CircleCheck from 'lucide-react-native/icons/circle-check';
import Info from 'lucide-react-native/icons/info';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { jarak, sudut, warna, type Warna } from '@/theme';

import { Teks } from './Teks';

const jenis = {
  galat: { ikon: AlertCircle, warna: 'galat', latar: warna.galatLembut },
  sukses: { ikon: CircleCheck, warna: 'sukses', latar: warna.suksesLembut },
  info: { ikon: Info, warna: 'info', latar: warna.infoLembut },
} as const satisfies Record<string, { ikon: LucideIcon; warna: Warna; latar: string }>;

type Props = {
  jenis: keyof typeof jenis;
  /** Optional bold first line. */
  judul?: string;
  /** Message text. */
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Inline message from the Figma component set: Galat, Sukses, Info. */
export function Banner({ jenis: j, judul, children, style }: Props) {
  const gaya = jenis[j];
  const Ikon = gaya.ikon;
  return (
    <View
      accessibilityRole={j === 'galat' ? 'alert' : undefined}
      accessibilityLiveRegion="polite"
      style={[styles.wadah, { backgroundColor: gaya.latar }, style]}
    >
      <Ikon size={20} color={warna[gaya.warna]} />
      <View style={styles.teks}>
        {judul && <Teks gaya="isiTebal">{judul}</Teks>}
        <Teks>{children}</Teks>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: jarak.sm,
    padding: jarak.md,
    borderRadius: sudut.lg,
    borderCurve: 'continuous',
  },
  teks: { flex: 1, gap: jarak.xxs },
});
