import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
// [DEV-ONLY][ISSUE-6] START — tombol testing sementara, HAPUS sebelum merge
import { useNavigation } from '@react-navigation/native';
import { useSessionUser } from '../services/api';
// [DEV-ONLY][ISSUE-6] END

export const BerandaScreen: React.FC = () => {
  // [DEV-ONLY][ISSUE-6] START — tombol testing sementara, HAPUS sebelum merge
  const navigation = useNavigation();
  const { user } = useSessionUser();
  // [DEV-ONLY][ISSUE-6] END

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beranda</Text>
      {/* [DEV-ONLY][ISSUE-6] START — tombol testing sementara, HAPUS sebelum merge */}
      <Pressable
        style={styles.devButton}
        onPress={() => navigation.navigate('ServiceRegistration')}
        testID="dev-open-ui16-button"
      >
        <Text style={styles.devButtonText}>
          Daftar Jadi Penyedia Jasa (UI-16)
        </Text>
      </Pressable>
      <Text style={styles.devRoleText}>Role aktif: {user.role}</Text>
      {/* [DEV-ONLY][ISSUE-6] END */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  // [DEV-ONLY][ISSUE-6] START — tombol testing sementara, HAPUS sebelum merge
  devButton: {
    marginTop: 16,
    backgroundColor: '#20AE96',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  devButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  devRoleText: {
    marginTop: 8,
    fontSize: 12,
    color: '#7A8794',
  },
  // [DEV-ONLY][ISSUE-6] END
});