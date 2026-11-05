import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { jarak, sudut, ukuran, warna, type Warna } from '@/theme';

import { LogoGoogle } from './LogoGoogle';
import { Teks } from './Teks';

const varian = {
  /** Filled red: the one main action on a screen. */
  utama: { latar: warna.merah, garis: warna.merah, teks: 'inversi' },
  /** Outlined: secondary actions next to a Utama button. */
  sekunder: { latar: warna.kartu, garis: warna.merah, teks: 'merah' },
  /** "Masuk dengan Google" on I-01. */
  google: { latar: warna.kartu, garis: warna.garis, teks: 'teks' },
  /** Text only: low-emphasis actions such as "Batal". */
  teks: { latar: 'transparent', garis: 'transparent', teks: 'merah' },
} as const satisfies Record<string, { latar: string; garis: string; teks: Warna }>;

type Props = {
  judul: string;
  onPress?: () => void;
  varian?: keyof typeof varian;
  /** Optional leading icon. Ignored by the Google variant, which shows the G mark. */
  ikon?: LucideIcon;
  disabled?: boolean;
  /** Shows a spinner and blocks presses, e.g. while a request is in flight. */
  memuat?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Button from the Figma component set: Utama, Sekunder, Google, Teks. */
export function Tombol({ judul, onPress, varian: v = 'utama', ikon: Ikon, disabled, memuat, style }: Props) {
  const gaya = varian[v];
  const nonaktif = disabled || memuat;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={judul}
      accessibilityState={{ disabled: !!nonaktif, busy: !!memuat }}
      disabled={nonaktif}
      onPress={onPress}
      style={({ pressed }) => [
        styles.dasar,
        { backgroundColor: gaya.latar, borderColor: gaya.garis },
        v === 'teks' && styles.teks,
        { opacity: disabled ? 0.4 : pressed ? 0.7 : 1 },
        style,
      ]}
    >
      {memuat ? (
        <ActivityIndicator color={warna[gaya.teks]} />
      ) : (
        <View style={styles.isi}>
          {v === 'google' ? <LogoGoogle /> : Ikon && <Ikon size={18} color={warna[gaya.teks]} />}
          <Teks gaya="label" warna={gaya.teks}>
            {judul}
          </Teks>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dasar: {
    height: ukuran.tinggiKontrol,
    paddingHorizontal: jarak.lg,
    borderRadius: sudut.md,
    borderCurve: 'continuous',
    borderWidth: ukuran.garis,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teks: { paddingHorizontal: jarak.sm },
  isi: { flexDirection: 'row', alignItems: 'center', gap: jarak.xs },
});
