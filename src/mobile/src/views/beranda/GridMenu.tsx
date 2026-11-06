import { useRouter, type Href } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { MenuTile, Teks } from '@/components';
import { jarak } from '@/theme';

export type ItemMenu = {
  ikon: LucideIcon;
  judul: string;
  keterangan?: string;
  tujuan: Href;
};

type Props = {
  judul: string;
  menu: ItemMenu[];
  kolom: number;
};

/** Titled grid of MenuTiles; each tile opens its screen (`HomeView.bukaMenu`). */
export function GridMenu({ judul, menu, kolom }: Props) {
  const router = useRouter();
  const baris: ItemMenu[][] = [];
  for (let i = 0; i < menu.length; i += kolom) baris.push(menu.slice(i, i + kolom));

  return (
    <View style={styles.menu}>
      <Teks gaya="h3" accessibilityRole="header">
        {judul}
      </Teks>
      {baris.map((isiBaris, i) => (
        <View key={i} style={styles.baris}>
          {isiBaris.map((m) => (
            <MenuTile
              key={m.judul}
              ikon={m.ikon}
              judul={m.judul}
              keterangan={m.keterangan}
              onPress={() => router.push(m.tujuan)}
            />
          ))}
          {/* Keep tile widths equal on a short last row. */}
          {Array.from({ length: kolom - isiBaris.length }, (_, j) => (
            <View key={`kosong-${j}`} style={styles.pengisi} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: { gap: jarak.sm, marginTop: jarak.xs },
  baris: { flexDirection: 'row', gap: jarak.sm },
  pengisi: { flex: 1 },
});
