/**
 * I-04 O-0402 Pilihan kategori kerusakan (4 pilihan dari SEMUA_KATEGORI). Pemilik: P2.
 */
import { Ionicons } from '@expo/vector-icons';
import { KATEGORI, SEMUA_KATEGORI } from '@silembur/shared';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { jarak, radius, warna } from '../../theme/tokens';

const IKON = {
  [KATEGORI.JALAN_BERLUBANG]: 'car-outline',
  [KATEGORI.LAMPU_JALAN_MATI]: 'bulb-outline',
  [KATEGORI.POHON_TUMBANG]: 'leaf-outline',
  [KATEGORI.LAINNYA]: 'ellipsis-horizontal-circle-outline',
};

/** @param {{ nilai: string|null, onUbah: (kategori: string) => void, nonaktif?: boolean }} props */
export default function PemilihKategori({ nilai, onUbah, nonaktif }) {
  return (
    <View style={s.grid} accessibilityRole="radiogroup">
      {SEMUA_KATEGORI.map((k) => {
        const dipilih = nilai === k;
        return (
          <Pressable
            key={k}
            accessibilityRole="radio"
            accessibilityState={{ checked: dipilih, disabled: !!nonaktif }}
            disabled={nonaktif}
            onPress={() => onUbah(k)}
            style={({ pressed }) => [s.pilihan, dipilih && s.dipilih, pressed && { opacity: 0.85 }]}
          >
            <Ionicons name={IKON[k] ?? 'help-circle-outline'} size={20} color={dipilih ? warna.primer : warna.teksLembut} />
            <Text style={[s.teks, dipilih && s.teksDipilih]}>{k}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: jarak.s },
  pilihan: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: jarak.s,
    paddingVertical: jarak.m,
    paddingHorizontal: jarak.m,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: warna.garis,
    backgroundColor: warna.permukaan,
  },
  dipilih: { borderColor: warna.primer, backgroundColor: warna.primerMuda },
  teks: { fontSize: 14, color: warna.teks, flexShrink: 1 },
  teksDipilih: { color: warna.primer, fontWeight: '700' },
});
