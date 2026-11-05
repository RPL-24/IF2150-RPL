import { StyleSheet, View } from 'react-native';

import { jarak, warna } from '@/theme';

import { Teks } from './Teks';

type Props = {
  /** Screen title, e.g. "Beranda". */
  judul: string;
  /** Screen ID from DPPL BAB 6, e.g. "I-02". */
  idLayar: string;
  /** GitHub issue that implements this screen, e.g. 4. */
  issue: number;
};

/**
 * Temporary placeholder shown until the screen's owner implements it.
 * Delete the usage (not this file) when the real view lands.
 */
export function LayarSementara({ judul, idLayar, issue }: Props) {
  return (
    <View style={styles.wadah}>
      <Teks gaya="h2">{judul}</Teks>
      <Teks gaya="keterangan">
        {idLayar} · dikerjakan pada issue #{issue}
      </Teks>
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: jarak.xs,
    padding: jarak.xl,
    backgroundColor: warna.latar,
  },
});
