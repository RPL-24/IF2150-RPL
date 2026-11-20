// src/views/EditProductPage.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PriceController, ValidationError } from '../controllers/PriceController';
import type { RootStackParamList } from '../navigation/types';

export default function EditProductPage() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'EditProduct'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EditProduct'>>();
  
  const { idProduk, produkData } = route.params;

  const [hargaBaruInput, setHargaBaruInput] = useState<string>(produkData.getHargaJual().toString());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSimpan = async () => {
    setErrorMessage('');
    const hargaBaru = Number(hargaBaruInput);

    if (isNaN(hargaBaru)) {
      setErrorMessage('Format harga tidak valid');
      return;
    }

    setIsLoading(true);
    try {
      const controller = new PriceController(produkData, idProduk);
      const isValid = await controller.validasiInput(hargaBaru);
      
      if (isValid) {
        Alert.alert('Sukses', 'Harga jual berhasil diperbarui');
        navigation.goBack(); 
      }
    } catch (error: any) {
      if (error instanceof ValidationError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Terjadi kesalahan: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goToRiwayatHarga = () => {
    navigation.navigate('PriceHistoryPage', {
      idProduk: idProduk,
      currentHargaJual: produkData.getHargaJual(),
      namaProduk: produkData.getNamaProduk()
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Produk</Text>

      {/* Menampilkan pesan error jika ada */}
      {errorMessage !== '' && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      <View style={styles.card}>
        <Text style={styles.label}>Nama Produk:</Text>
        <Text style={styles.value}>{produkData.getNamaProduk()}</Text>

        <Text style={styles.label}>Harga Jual Saat Ini:</Text>
        <Text style={styles.value}>Rp {produkData.getHargaJual().toLocaleString('id-ID')}</Text>

        <Text style={styles.label}>Margin Saat Ini:</Text>
        <Text style={styles.value}>Rp {produkData.getMargin().toLocaleString('id-ID')}</Text>
      </View>

      <Text style={styles.label}>Harga Jual Baru (Rp):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={hargaBaruInput}
        onChangeText={setHargaBaruInput}
        placeholder="Masukkan harga jual baru"
      />

      {/* Tombol Simpan */}
      <TouchableOpacity 
        style={styles.primaryButton} 
        onPress={handleSimpan} 
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Simpan Perubahan</Text>
        )}
      </TouchableOpacity>

      {/* Tombol Lihat Riwayat */}
      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={goToRiwayatHarga}
      >
        <Text style={styles.secondaryButtonText}>Lihat Riwayat Harga Jual</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 20, elevation: 2 },
  label: { fontSize: 14, color: '#666', marginTop: 10 },
  value: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16, marginBottom: 20 },
  primaryButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { padding: 15, alignItems: 'center' },
  secondaryButtonText: { color: '#007bff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: 'red', marginBottom: 15, textAlign: 'center', fontWeight: 'bold' }
});