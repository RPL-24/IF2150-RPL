import { useCallback, useState } from 'react';
import { AppState, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { pushNotificationUI } from '../services/PushNotificationUI';
import { NotificationController } from '../controllers/NotificationController';
import { formatJam, kelompokkanPerHari } from '../controllers/notification';
import type { Notifikasi } from '../models/Notifikasi';
import { palette } from './styles';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const controller = new NotificationController();
type Props = NativeStackScreenProps<RootStackParamList, 'Notifikasi'>;
type Tampilan = 'memuat' | 'sukses' | 'error';

const BIRU_MUDA = '#EAF0FF';
const BIRU_BORDER = '#C9D7F7';
const MERAH_BORDER = '#F5C6C0';

export default function NotificationPage({ navigation }: Props) {
  const [tampilan, setTampilan] = useState<Tampilan>('memuat');
  const [daftar, setDaftar] = useState<Notifikasi[]>([]);
  const [namaUsaha, setNamaUsaha] = useState('');
  const [izinDitolak, setIzinDitolak] = useState(false);
  const [pesanError, setPesanError] = useState('');
  const [versi, setVersi] = useState(0);

  const muat = useCallback(async () => {
    setTampilan('memuat');
    setPesanError('');
    try {
      const { data: userData } = await supabase.auth.getUser();
      const [hasil, profil] = await Promise.all([
        controller.muatNotifikasi(),
        userData.user
          ? supabase
              .from('tbl_pemilik_usaha')
              .select('username, nama_usaha')
              .eq('id', userData.user.id)
              .single()
          : Promise.resolve({ data: null }),
      ]);
      setDaftar(hasil);
      setNamaUsaha(profil.data?.nama_usaha || profil.data?.username || '');
      setTampilan('sukses');
    } catch (e) {
      setPesanError(e instanceof Error ? e.message : '');
      setTampilan('error');
    }
  }, []);

  const periksaIzin = useCallback(async () => {
    try {
      setIzinDitolak((await pushNotificationUI.periksaIzin()) === 'ditolak');
    } catch {
      setIzinDitolak(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      muat();
      periksaIzin();
      // Setelah pengguna kembali dari pengaturan Android, periksa izin lagi.
      const langganan = AppState.addEventListener('change', (status) => {
        if (status === 'active') periksaIzin();
      });
      return () => langganan.remove();
    }, [muat, periksaIzin]),
  );

  async function tandaiDibaca(notif: Notifikasi) {
    try {
      await controller.tandaiSudahDibaca(notif);
      setVersi((v) => v + 1);
    } catch (e) {
      setPesanError(e instanceof Error ? e.message : 'Gagal memperbarui notifikasi');
    }
  }

  async function tandaiSemua() {
    try {
      await controller.tandaiSemuaDibaca();
      daftar.forEach((n) => n.markAsRead());
      setVersi((v) => v + 1);
    } catch (e) {
      setPesanError(e instanceof Error ? e.message : 'Gagal memperbarui notifikasi');
    }
  }

  const belumDibaca = daftar.filter((n) => !n.getIsRead()).length;
  const subjudul =
    tampilan === 'memuat'
      ? 'Memuat pembaruan usaha...'
      : belumDibaca > 0
        ? `${belumDibaca} belum dibaca${namaUsaha ? ` · ${namaUsaha}` : ''}`
        : 'Pembaruan usaha Anda';

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: palette.navy }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            onPress={() => navigation.goBack()}
            style={{ marginBottom: 4 }}
          >
            <Text style={{ color: palette.white, fontSize: 24 }}>‹</Text>
          </Pressable>
          <Text style={{ color: palette.white, fontSize: 24, fontWeight: '800' }}>Notifikasi</Text>
          <Text style={{ color: '#C8D2EC', fontSize: 12, marginTop: 2 }}>{subjudul}</Text>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1 }}>
        {izinDitolak && (
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('IzinNotifikasi')}
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: palette.errorBackground,
              borderWidth: 1,
              borderColor: MERAH_BORDER,
            }}
          >
            <Text style={{ color: palette.error, fontWeight: '700' }}>
              Push notification belum diizinkan
            </Text>
            <Text style={{ color: palette.navy, marginTop: 2, fontSize: 12 }}>
              Ketuk untuk mengatur izin notifikasi.
            </Text>
          </Pressable>
        )}

        {tampilan === 'memuat' && (
          <>
            <Skeleton />
            <Skeleton />
          </>
        )}

        {tampilan === 'error' && (
          <StatusKosong
            ikon="🔕"
            warna={palette.errorBackground}
            judul="Notifikasi gagal dimuat"
            deskripsi="Pesan usaha belum bisa dimunculkan. Periksa koneksi lalu coba lagi."
            tombol="Coba lagi"
            onPress={muat}
          />
        )}

        {tampilan === 'sukses' && daftar.length === 0 && (
          <StatusKosong
            ikon="🔔"
            warna={palette.successBackground}
            judul="Belum ada notifikasi"
            deskripsi="Peringatan margin dan perubahan harga bahan akan muncul di sini setelahnya."
            tombol="Kembali ke Beranda"
            onPress={() => navigation.navigate('Home')}
          />
        )}

        {tampilan === 'sukses' && daftar.length > 0 && (
          <>
            {pesanError !== '' && (
              <Text style={{ color: palette.error, fontSize: 12 }}>{pesanError}</Text>
            )}
            {belumDibaca > 0 && (
              <Pressable
                accessibilityRole="button"
                onPress={tandaiSemua}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: palette.white,
                  borderWidth: 1,
                  borderColor: palette.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: palette.navy, fontWeight: '700' }}>Tandai semua dibaca</Text>
              </Pressable>
            )}

            {kelompokkanPerHari(daftar, (n) => n.getWaktuKirim(), new Date()).map((grup) => (
              <View key={grup.label} style={{ gap: 10 }}>
                <Text
                  style={{ color: palette.secondary, fontSize: 11, fontWeight: '700', marginTop: 6 }}
                >
                  {grup.label}
                </Text>
                {grup.item.map((n) => (
                  <KartuNotifikasi
                    key={n.getIdNotifikasi()}
                    notif={n}
                    onTandaiDibaca={() => tandaiDibaca(n)}
                    onTinjauProduk={() => {
                      const id = n.getIdProduk();
                      if (id !== null) navigation.navigate('ProductDetail', { idProduk: id });
                    }}
                  />
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function KartuNotifikasi({
  notif,
  onTandaiDibaca,
  onTinjauProduk,
}: {
  notif: Notifikasi;
  onTandaiDibaca: () => void;
  onTinjauProduk: () => void;
}) {
  const dibaca = notif.getIsRead();
  const rugi = notif.getTipe() === 'kerugian';
  const latar = dibaca ? palette.white : rugi ? palette.errorBackground : BIRU_MUDA;
  const garis = dibaca ? palette.border : rugi ? MERAH_BORDER : BIRU_BORDER;
  const warnaJudul = !dibaca && rugi ? palette.error : palette.navy;
  // Status dibaca ditunjukkan dengan ikon + label, bukan warna saja.
  const status = `${dibaca ? '✓ Sudah dibaca' : '✉ Belum dibaca'} · ${formatJam(notif.getWaktuKirim())}`;

  return (
    <View
      style={{
        padding: 14,
        borderRadius: 14,
        backgroundColor: latar,
        borderWidth: 1,
        borderColor: garis,
        gap: 4,
      }}
    >
      <Text style={{ color: palette.secondary, fontSize: 11 }}>{status}</Text>
      <Text style={{ color: warnaJudul, fontSize: 16, fontWeight: '800' }}>{notif.getJudul()}</Text>
      <Text style={{ color: palette.navy, fontSize: 13, lineHeight: 19 }}>{notif.getPesanAlert()}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        {rugi && notif.getIdProduk() !== null ? (
          <Pressable accessibilityRole="button" onPress={onTinjauProduk}>
            <Text style={{ color: palette.navy, fontWeight: '700', fontSize: 12 }}>Tinjau produk</Text>
          </Pressable>
        ) : (
          <View />
        )}
        {!dibaca && (
          <Pressable accessibilityRole="button" onPress={onTandaiDibaca}>
            <Text style={{ color: palette.navy, fontWeight: '700', fontSize: 12 }}>Tandai dibaca</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function Skeleton() {
  return (
    <View style={{ padding: 14, borderRadius: 14, backgroundColor: palette.white, gap: 8 }}>
      <View style={{ height: 14, borderRadius: 7, backgroundColor: '#E3E8E5', width: '90%' }} />
      <View style={{ height: 10, borderRadius: 5, backgroundColor: '#E3E8E5', width: '60%' }} />
    </View>
  );
}

function StatusKosong({
  ikon,
  warna,
  judul,
  deskripsi,
  tombol,
  onPress,
}: {
  ikon: string;
  warna: string;
  judul: string;
  deskripsi: string;
  tombol: string;
  onPress: () => void;
}) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 48, paddingHorizontal: 8, gap: 10 }}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: warna,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 30 }}>{ikon}</Text>
      </View>
      <Text style={{ color: palette.navy, fontSize: 18, fontWeight: '800' }}>{judul}</Text>
      <Text style={{ color: palette.secondary, textAlign: 'center', lineHeight: 19 }}>{deskripsi}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={{
          alignSelf: 'stretch',
          marginTop: 8,
          padding: 14,
          borderRadius: 12,
          backgroundColor: palette.brightGreen,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: palette.navy, fontWeight: '800' }}>{tombol}</Text>
      </Pressable>
    </View>
  );
}
