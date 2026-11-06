import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { jarak, sudut, warna, type Warna } from '@/theme';

import { Teks } from './Teks';

const jenis = {
  merah: { teks: 'merah', latar: warna.merahLembut },
  sukses: { teks: 'sukses', latar: warna.suksesLembut },
  info: { teks: 'info', latar: warna.infoLembut },
  peringatan: { teks: 'peringatan', latar: warna.peringatanLembut },
  netral: { teks: 'teksSekunder', latar: warna.garis },
} as const satisfies Record<string, { teks: Warna; latar: string }>;

type Props = {
  label: string;
  jenis?: keyof typeof jenis;
  style?: StyleProp<ViewStyle>;
};

/** Small status badge, e.g. a session's status or "Online" on Status Server. */
export function Lencana({ label, jenis: j = 'netral', style }: Props) {
  const gaya = jenis[j];
  return (
    <View style={[styles.wadah, { backgroundColor: gaya.latar }, style]}>
      <Teks gaya="keterangan" warna={gaya.teks}>
        {label}
      </Teks>
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: {
    alignSelf: 'flex-start',
    paddingHorizontal: jarak.sm,
    paddingVertical: jarak.xxs,
    borderRadius: sudut.penuh,
  },
});
