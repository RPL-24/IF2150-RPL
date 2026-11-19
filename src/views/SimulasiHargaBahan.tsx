import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { NotificationController } from '../controllers/NotificationController';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

// SEMENTARA, KHUSUS PENGUJIAN UC09/UC10.

const controller = new NotificationController();

type Props = {
  idBahan: string;
  satuan?: string;
  onBerhasil?: () => void;
};

export default function SimulasiHargaBahan({ idBahan, satuan, onBerhasil }: Props) {
  const [harga, setHarga] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState<{ teks: string; galat: boolean } | null>(null);

  if (!__DEV__) return null;

  async function simpan() {
    setMenyimpan(true);
    setPesan(null);
    try {
      await controller.perbaruiHargaBeli(idBahan, Number(harga.replace(',', '.')));
      setPesan({ teks: 'Harga diperbarui. Notifikasi dikirim bila ada perubahan.', galat: false });
      setHarga('');
      onBerhasil?.();
    } catch (e) {
      setPesan({ teks: e instanceof Error ? e.message : 'Gagal memperbarui harga.', galat: true });
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <View style={styles.box}>
      <Text style={styles.judul}>Simulasi perubahan harga (khusus pengujian)</Text>
      <View style={styles.baris}>
        <TextInput
          style={styles.input}
          value={harga}
          onChangeText={setHarga}
          placeholder={`Harga beli baru${satuan ? ` per ${satuan}` : ''}`}
          placeholderTextColor={COLORS.muted}
          keyboardType="numeric"
          editable={!menyimpan}
        />
        <Pressable
          style={[styles.tombol, (menyimpan || harga.trim() === '') && styles.tombolNonaktif]}
          onPress={simpan}
          disabled={menyimpan || harga.trim() === ''}
          accessibilityLabel="Simpan harga simulasi"
        >
          {menyimpan ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.teksTombol}>Simpan</Text>
          )}
        </Pressable>
      </View>
      {pesan && (
        <Text style={[styles.pesan, pesan.galat && { color: COLORS.danger }]}>{pesan.teks}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.muted,
    backgroundColor: COLORS.background,
  },
  judul: { color: COLORS.navySoft, fontSize: 12, fontWeight: '600', marginBottom: SPACING.sm },
  baris: { flexDirection: 'row', gap: SPACING.sm },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.navy,
    backgroundColor: COLORS.card,
  },
  tombol: {
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.input,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    minWidth: 80,
    alignItems: 'center',
  },
  tombolNonaktif: { opacity: 0.5 },
  teksTombol: { color: COLORS.white, fontWeight: '700' },
  pesan: { marginTop: SPACING.sm, color: COLORS.greenDark, fontSize: 12 },
});
