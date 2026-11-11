import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { pemdaApi } from '../../api/pemda';
import { PESAN } from '@silembur/shared';

export default function FasilitasBerulangPreview({ onLihatSemua }) {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    let mounted = true;
    pemdaApi.fasilitasBerulang(3)
      .then((res) => {
        if (mounted) setList(res.data || []);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <View style={styles.cardContainer}>
        <ActivityIndicator color="#0066CC" />
      </View>
    );
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Fasilitas Rusak Berulang</Text>
        <TouchableOpacity onPress={onLihatSemua}>
          <Text style={styles.link}>Tampilkan lebih banyak</Text>
        </TouchableOpacity>
      </View>

      {list.length === 0 ? (
        <Text style={styles.emptyText}>{PESAN.BELUM_ADA_FASILITAS_BERULANG || 'Belum ada fasilitas rusak berulang'}</Text>
      ) : (
        list.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemNama}>{item.nama}</Text>
              <Text style={styles.itemWilayah}>{item.wilayah}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.jumlahKerusakanBerulang} Laporan</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  link: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 13,
    color: '#666666',
    fontStyle: 'italic',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemNama: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
  },
  itemWilayah: {
    fontSize: 12,
    color: '#777777',
  },
  badge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    color: '#CC0000',
    fontWeight: 'bold',
  },
});