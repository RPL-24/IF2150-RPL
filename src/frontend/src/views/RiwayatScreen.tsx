/**
 * Layar Tab Riwayat (Menampilkan UI-12 Riwayat Pekerjaan Penyedia jika role PEMBERI_JASA)
 * Traceability: UC01 (Pengalihan ke UI-12 setelah pendaftaran penyedia jasa berhasil),
 * Kelas DPPL C05 PemberiJasaUI
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSessionUser } from '../services/api';
import { ProviderHistoryView } from './history/ProviderHistoryView';

export const RiwayatScreen: React.FC = () => {
  const { isPenyediaJasa } = useSessionUser();

  if (isPenyediaJasa) {
    return <ProviderHistoryView />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Aktivitas</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
});