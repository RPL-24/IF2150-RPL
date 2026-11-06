import { useCallback, useState } from 'react';
import { AppState, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { pushNotificationUI, type StatusIzin } from '../services/PushNotificationUI';
import { palette } from './styles';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'IzinNotifikasi'>;

export default function IzinNotifikasiPage({ navigation }: Props) {
  const [status, setStatus] = useState<StatusIzin>('memeriksa');

  const periksa = useCallback(async () => {
    setStatus('memeriksa');
    try {
      setStatus(await pushNotificationUI.periksaIzin());
    } catch {
      setStatus('ditolak');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      periksa();
      // Kembali dari pengaturan Android -> periksa ulang otomatis.
      const langganan = AppState.addEventListener('change', (s) => {
        if (s === 'active') periksa();
      });
      return () => langganan.remove();
    }, [periksa]),
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.background }}
      contentContainerStyle={{ padding: 20, gap: 12, flexGrow: 1 }}
    >
      <View>
        <Text style={{ color: palette.navy, fontSize: 22, fontWeight: '800' }}>Izin notifikasi</Text>
        <Text style={{ color: palette.secondary, fontSize: 12 }}>Pengaturan notifikasi Pross</Text>
      </View>

      {status === 'memeriksa' && (
        <>
          <View style={{ padding: 12, borderRadius: 12, backgroundColor: '#EAF0FF' }}>
            <Text style={{ color: palette.navy, fontWeight: '700' }}>
              Memeriksa status notifikasi...
            </Text>
            <Text style={{ color: palette.secondary, fontSize: 12, marginTop: 2 }}>
              Membaca status izin dari perangkat Android.
            </Text>
          </View>
          <View style={{ height: 56, borderRadius: 12, backgroundColor: '#E3E8E5' }} />
          <View style={{ height: 56, borderRadius: 12, backgroundColor: '#E3E8E5' }} />
          <View
            style={{
              padding: 14,
              borderRadius: 12,
              backgroundColor: palette.disabled,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: palette.disabledText, fontWeight: '700' }}>Memeriksa...</Text>
          </View>
        </>
      )}

      {status === 'ditolak' && (
        <View style={{ alignItems: 'center', gap: 10, paddingTop: 24 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: palette.errorBackground,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 30 }}>🔕</Text>
          </View>
          <Text style={{ color: palette.navy, fontSize: 18, fontWeight: '800' }}>
            Notifikasi belum diizinkan
          </Text>
          <Text style={{ color: palette.secondary, textAlign: 'center', lineHeight: 19 }}>
            Peringatan margin negatif tidak dapat dikirim ke perangkat. Aktifkan izin agar Anda tidak
            melewatkan perubahan biaya.
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => pushNotificationUI.bukaPengaturan()}
            style={{
              alignSelf: 'stretch',
              padding: 14,
              borderRadius: 12,
              backgroundColor: palette.brightGreen,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: palette.navy, fontWeight: '800' }}>Buka pengaturan Android</Text>
          </Pressable>

          <View
            style={{
              alignSelf: 'stretch',
              padding: 14,
              borderRadius: 12,
              backgroundColor: palette.white,
              borderWidth: 1,
              borderColor: palette.border,
            }}
          >
            <Text style={{ color: palette.navy, fontWeight: '700', fontSize: 12 }}>
              Langkah mengaktifkan
            </Text>
            <Text style={{ color: palette.secondary, fontSize: 12, marginTop: 4 }}>
              Pengaturan Android → Aplikasi → Pross → Notifikasi → Izinkan notifikasi.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={periksa}
            style={{
              alignSelf: 'stretch',
              padding: 14,
              borderRadius: 12,
              backgroundColor: palette.white,
              borderWidth: 1,
              borderColor: palette.border,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: palette.navy, fontWeight: '700' }}>Periksa izin lagi</Text>
          </Pressable>
        </View>
      )}

      {status === 'diizinkan' && (
        <View style={{ alignItems: 'center', gap: 10, paddingTop: 24 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: palette.successBackground,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 30 }}>🔔</Text>
          </View>
          <Text style={{ color: palette.navy, fontSize: 18, fontWeight: '800' }}>
            Notifikasi sudah aktif
          </Text>
          <Text style={{ color: palette.secondary, textAlign: 'center', lineHeight: 19 }}>
            Anda akan menerima peringatan margin negatif dan perubahan harga bahan baku.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={{
              alignSelf: 'stretch',
              padding: 14,
              borderRadius: 12,
              backgroundColor: palette.brightGreen,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: palette.navy, fontWeight: '800' }}>Kembali</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
