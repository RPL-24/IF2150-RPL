import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { supabase } from '../services/supabase';
import { formatRupiah } from '../controllers/margin';
import { palette, styles } from './styles';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

type Detail = {
  nama_produk: string;
  tag: string[];
  harga_jual: number;
  margin: number;
  status_peringatan: boolean;
};

// Halaman detail minimal sebagai tujuan ketukan notifikasi UC09.
// Boleh diganti/diperkaya oleh halaman UC04 (Melihat Margin Keuntungan Produk).
export default function ProductDetailPage({ route }: Props) {
  const { idProduk } = route.params;
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let aktif = true;
    supabase
      .from('tbl_produk')
      .select('nama_produk, tag, harga_jual, margin, status_peringatan')
      .eq('id_produk', idProduk)
      .single()
      .then(({ data, error: galat }) => {
        if (!aktif) return;
        if (galat) setError(galat.message);
        else setDetail(data as Detail);
      });
    return () => {
      aktif = false;
    };
  }, [idProduk]);

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
    </ScrollView>
  );
}
