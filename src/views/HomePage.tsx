import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { AuthController } from '../controllers/AuthController';
import { formatRupiah } from '../controllers/margin';
import { palette, styles } from './styles';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { pushNotificationUI } from '../services/PushNotificationUI';

const auth = new AuthController();
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type ProdukRingkas = {
  id_produk: string;
  nama_produk: string;
  harga_jual: number;
  margin: number;
  status_peringatan: boolean;
};

export default function HomePage({ navigation }: Props) {
  const [username, setUsername] = useState('...');
  const [produk, setProduk] = useState<ProdukRingkas[]>([]);
  const [belumDibaca, setBelumDibaca] = useState(0);
  const [memuat, setMemuat] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      let aktif = true;

      async function muat() {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          if (aktif) setError('Session pengguna tidak ditemukan');
          return;
        }

        const [profil, daftarProduk, notif] = await Promise.all([
          supabase.from('tbl_pemilik_usaha').select('username').eq('id', userData.user.id).single(),
          supabase
            .from('tbl_produk')
            .select('id_produk, nama_produk, harga_jual, margin, status_peringatan')
            .order('created_at', { ascending: false }),
          supabase
            .from('tbl_notifikasi')
            .select('id_notifikasi', { count: 'exact', head: true })
            .eq('is_read', false),
        ]);

        if (!aktif) return;
        const galat = profil.error ?? daftarProduk.error ?? notif.error;
        if (galat) {
          setError(galat.message);
        } else {
          setError('');
          setUsername(profil.data?.username ?? '');
          setProduk((daftarProduk.data ?? []) as ProdukRingkas[]);
          setBelumDibaca(notif.count ?? 0);
        }
        setMemuat(false);
      }

      muat();
      return () => {
        aktif = false;
      };
    }, []),
  );

  async function logout() {
    try {
      await auth.logout();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal logout');
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={styles.pageTitle}>Selamat datang, {username}!</Text>

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('AddProduct')}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 12,
            backgroundColor: palette.green,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: palette.white, fontWeight: '700' }}>+ Tambah Produk</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Notifikasi')}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 12,
            backgroundColor: palette.white,
            borderWidth: 1,
            borderColor: palette.border,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: palette.navy, fontWeight: '700' }}>
            Notifikasi{belumDibaca > 0 ? ` (${belumDibaca})` : ''}
          </Text>
        </Pressable>
      </View>

      <Text style={{ fontSize: 16, fontWeight: '800', color: palette.navy, marginTop: 8 }}>
        Produk Saya
      </Text>

      {memuat ? (
        <ActivityIndicator color={palette.green} />
      ) : produk.length === 0 ? (
        <Text style={{ color: palette.secondary }}>Belum ada produk.</Text>
      ) : (
        produk.map((p) => (
          <Pressable
            key={p.id_produk}
            accessibilityRole="button"
            onPress={() => navigation.navigate('ProductDetail', { idProduk: p.id_produk })}
            style={{
              padding: 14,
              borderRadius: 12,
              backgroundColor: palette.white,
              borderWidth: 1,
              borderColor: p.status_peringatan ? palette.error : palette.border,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '700', color: palette.navy, flexShrink: 1 }}>
                {p.status_peringatan ? '⚠️ ' : ''}
                {p.nama_produk}
              </Text>
              <Text style={{ color: Number(p.margin) < 0 ? palette.error : palette.success }}>
                {formatRupiah(Number(p.margin))}
              </Text>
            </View>
            <Text style={{ color: palette.secondary, marginTop: 2 }}>
              Harga jual {formatRupiah(Number(p.harga_jual))}
            </Text>
          </Pressable>
        ))
      )}
      {/* <Pressable -> Ini buat nguji notif (kuri)
        accessibilityRole="button"
        onPress={() =>
          pushNotificationUI.tampilkanNotifikasi(
            'Margin Negatif!',
            'Ayam Geprek rugi ~Rp 1.500/porsi (-8,3%)',
            { tipe: 'kerugian' },
          )
        }
        style={{ padding: 14, alignItems: 'center', backgroundColor: '#FFE9A8', borderRadius: 12 }}
      >
        <Text>Uji push (hapus sebelum commit)</Text>
      </Pressable> */}

      <Pressable accessibilityRole="button" onPress={logout} style={{ padding: 14, alignItems: 'center' }}>
        <Text style={{ color: palette.secondary, fontWeight: '700' }}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}
