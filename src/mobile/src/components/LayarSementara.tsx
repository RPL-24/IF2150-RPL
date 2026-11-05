import { StyleSheet, Text, View } from 'react-native';

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
      <Text style={styles.judul}>{judul}</Text>
      <Text style={styles.ket}>
        {idLayar} · dikerjakan pada issue #{issue}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  judul: { fontSize: 20, fontWeight: '700' },
  ket: { fontSize: 13, color: '#6B6B73' },
});
