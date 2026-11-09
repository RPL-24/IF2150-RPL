/**
 * [Naufal Hasbialhaq] UI-16 Daftar Penyedia Jasa
 * Traceability: UC01 Mendaftarkan Jasa (Skenario Normal & Alternatif 1), KF04, KF05,
 * Kelas DPPL C14 KategoriJasaUI & C05 PemberiJasaUI, Antarmuka UI-16
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export const ServiceRegistrationView: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* UI-16-01: Tombol Kembali */}
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke layar sebelumnya"
          testID="ui16-back-button"
        >
          <Ionicons name="chevron-back" size={20} color="#1B3A5C" />
          <Text style={styles.backText}>Kembali</Text>
        </Pressable>

        {/* UI-16-02: Judul dan Subjudul Layar */}
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Daftar Penyedia Jasa</Text>
          <Text style={styles.subtitle}>
            Lengkapi data untuk mulai menerima pesanan
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7F6',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B3A5C',
    marginLeft: 4,
  },
  headerTextContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1B3A5C',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#7A8794',
  },
});

export default ServiceRegistrationView;
