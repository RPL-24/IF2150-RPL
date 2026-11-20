import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { formatRupiah } from '../controllers/margin';
import { palette, styles } from './styles';
import { Produk } from '../models/Produk';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

type Detail = {
  nama_produk: string;
  tag: string[];
  harga_jual: number;
  hasil_resep: number;
  margin: number;
  status_peringatan: boolean;
};

// Halaman detail minimal sebagai tujuan ketukan notifikasi UC09.
// Boleh diganti/diperkaya oleh halaman UC04 (Melihat Margin Keuntungan Produk).
export default function ProductDetailPage({ navigation, route }: Props) {
  const { idProduk } = route.params;
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      let aktif = true;
      supabase
        .from('tbl_produk')
        .select('nama_produk, tag, harga_jual, hasil_resep, margin, status_peringatan')
        .eq('id_produk', idProduk)
        .single()
        .then(({ data, error: galat }) => {
          if (!aktif) return;
          if (galat) setError(galat.message);
          else {
            setError('');
            setDetail(data as Detail);
          }
        });
      return () => {
        aktif = false;
      };
    }, [idProduk]),
  );

  if (error !== '') {
    return (
      <View style={[styles.screen, { padding: 20 }]}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }
  if (detail === null) {
    return (
      <View style={[styles.screen, { justifyContent: 'center' }]}>
        <ActivityIndicator color={palette.green} />
      </View>
    );
  }

  const rugi = Number(detail.margin) < 0;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20, gap: 10 }}>
      <Text style={styles.pageTitle}>{detail.nama_produk}</Text>
      {detail.status_peringatan && (
        <Text style={{ color: palette.error, fontWeight: '700' }}>
          ⚠️ Produk ini sedang merugi
        </Text>
      )}
      <Text style={{ color: palette.navy }}>
        Harga jual: {formatRupiah(Number(detail.harga_jual))}
      </Text>
      <Text style={{ color: rugi ? palette.error : palette.success, fontWeight: '700' }}>
        Margin: {formatRupiah(Number(detail.margin))}
      </Text>
      {detail.tag.length > 0 && (
        <Text style={{ color: palette.secondary }}>Tag: {detail.tag.join(', ')}</Text>
      )}
      <Pressable
        style={[styles.primaryButton, styles.primaryButtonEnabled, { marginTop: 20 }]}
        onPress={() => {
          const p = new Produk();
          p.setNamaProduk(detail.nama_produk);
          p.setTag(detail.tag);
          p.setHargaJual(Number(detail.harga_jual));
          p.setHasilResep(Number(detail.hasil_resep || 1));
          p.setMargin(Number(detail.margin));

          navigation.navigate('EditProduct', { idProduk, produkData: p });
        }}
      >
        <Text style={styles.primaryButtonText}>Edit Harga Jual</Text>
      </Pressable>
    </ScrollView>
  );
}
