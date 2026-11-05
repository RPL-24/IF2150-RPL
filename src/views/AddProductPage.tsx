import { useRef, useState } from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

import { MarginController } from '../controllers/MarginController';
import {
  formatRupiah,
  parseAngka,
  parseTag,
} from '../controllers/margin';
import { PESAN_INPUT_TIDAK_VALID } from '../models/pesan';
import { palette, styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AddProduct'>;

type BarisBahan = {
  id: number;
  namaBahan: string;
  hargaBeli: string;
  takaran: string;
};

type HasilProduk = {
  nama: string;
  hargaJual: number;
  hpp: number;
  margin: number;
};

let counterBaris = 1;

function barisKosong(): BarisBahan {
  counterBaris += 1;
  return { id: counterBaris, namaBahan: '', hargaBeli: '', takaran: '' };
}

export default function AddProductPage({ navigation }: Props) {
  const controller = useRef(new MarginController()).current;

  const [tahap, setTahap] = useState<1 | 2>(1);
  const [inputNamaProduk, setInputNamaProduk] = useState('');
  const [inputTag, setInputTag] = useState('');
  const [inputTakaran, setInputTakaran] = useState<BarisBahan[]>([barisKosong()]);
  const [inputHargaJual, setInputHargaJual] = useState('');

  const [error, setError] = useState('');
  const [hasil, setHasil] = useState<HasilProduk | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit =
    tahap === 1
      ? inputNamaProduk.trim().length > 0
      : inputHargaJual.trim().length > 0 &&
        inputTakaran.every(
          (b) =>
            b.namaBahan.trim().length > 0 &&
            b.hargaBeli.trim().length > 0 &&
            b.takaran.trim().length > 0,
        );

  function showPage() {
    setTahap(1);
    setInputNamaProduk('');
    setInputTag('');
    setInputTakaran([barisKosong()]);
    setInputHargaJual('');
    setError('');
    setHasil(null);
  }

  function showErrorMessage(pesan: string) {
    setError(pesan);
  }

  function showSuccessMessage(data: HasilProduk) {
    setError('');
    setHasil(data);
  }

  async function getInput() {
    setError('');
    setLoading(true);

    try {
      if (tahap === 1) {
        await controller.validasiNamaProduk(inputNamaProduk, parseTag(inputTag));
        setTahap(2);
        return;
      }

      const daftarBahan = inputTakaran.map((b) => ({
        namaBahan: b.namaBahan,
        hargaBeli: parseAngka(b.hargaBeli),
        takaran: parseAngka(b.takaran),
      }));
      const hargaJual = parseAngka(inputHargaJual);

      if (
        Number.isNaN(hargaJual) ||
        daftarBahan.some((b) => Number.isNaN(b.hargaBeli) || Number.isNaN(b.takaran))
      ) {
        showErrorMessage(PESAN_INPUT_TIDAK_VALID);
        return;
      }

      await controller.validasiInput(daftarBahan, hargaJual);

      const produk = controller.getCurrentProduk();
      if (produk !== null) {
        showSuccessMessage({
          nama: produk.getNamaProduk(),
          hargaJual: produk.getHargaJual(),
          hpp: produk.getHargaJual() - produk.getMargin(),
          margin: produk.getMargin(),
        });
      }
    } catch (e) {
      showErrorMessage(
        e instanceof Error ? e.message : 'Terjadi kesalahan saat menyimpan produk',
      );
    } finally {
      setLoading(false);
    }
  }

  function ubahBaris(id: number, kolom: keyof Omit<BarisBahan, 'id'>, nilai: string) {
    setInputTakaran((daftar) =>
      daftar.map((b) => (b.id === id ? { ...b, [kolom]: nilai } : b)),
    );
  }

  function tambahBaris() {
    setInputTakaran((daftar) => [...daftar, barisKosong()]);
  }

  function hapusBaris(id: number) {
    setInputTakaran((daftar) =>
      daftar.length > 1 ? daftar.filter((b) => b.id !== id) : daftar,
    );
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: palette.background }]}
      edges={['top', 'bottom']}
    >
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.authScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.pageHeaderWithBack}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Kembali"
            >
              <Text style={styles.backText}>←</Text>
            </Pressable>

            <Text style={styles.pageTitle}>Tambah produk</Text>
          </View>

          {hasil !== null ? (
            <View style={styles.form}>
              <View style={styles.successPanel}>
                <Text style={[styles.messageText, { color: palette.success }]}>
                  Produk "{hasil.nama}" berhasil ditambahkan.
                </Text>
                <Text style={styles.messageText}>
                  Harga jual: {formatRupiah(hasil.hargaJual)}
                </Text>
                <Text style={styles.messageText}>
                  HPP: {formatRupiah(hasil.hpp)}
                </Text>
                <Text
                  style={[
                    styles.messageText,
                    {
                      fontWeight: '700',
                      color: hasil.margin < 0 ? palette.error : palette.success,
                    },
                  ]}
                >
                  Margin: {formatRupiah(hasil.margin)}
                  {hasil.margin < 0 ? ' (rugi)' : ''}
                </Text>
              </View>

              <Pressable
                onPress={showPage}
                style={({ pressed }) => [
                  styles.primaryButton,
                  styles.primaryButtonEnabled,
                  pressed ? styles.primaryButtonPressed : undefined,
                ]}
              >
                <Text style={styles.primaryButtonText}>Tambah produk lain</Text>
              </Pressable>

              <Pressable onPress={() => navigation.goBack()}>
                <Text style={styles.authLink}>Selesai</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.form}>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nama produk</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Nasi Goreng Spesial"
                  placeholderTextColor={palette.placeholder}
                  value={inputNamaProduk}
                  onChangeText={setInputNamaProduk}
                  editable={tahap === 1}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Tag (opsional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: makanan, nasi"
                  placeholderTextColor={palette.placeholder}
                  autoCapitalize="none"
                  value={inputTag}
                  onChangeText={setInputTag}
                  editable={tahap === 1}
                />
                <Text style={styles.helperText}>Pisahkan beberapa tag dengan koma.</Text>
              </View>

              {tahap === 2 && (
                <>
                  <Text style={styles.fieldLabel}>Bahan baku</Text>
                  <Text style={styles.helperText}>
                    Harga beli ditulis per satuan takaran (misal per gram atau per
                    ml), dan satuannya harus sama dengan takaran. Gunakan titik
                    untuk ribuan dan koma untuk desimal.
                  </Text>

                  {inputTakaran.map((baris, indeks) => (
                    <View key={baris.id} style={{ marginTop: 12 }}>
                      <TextInput
                        style={styles.input}
                        placeholder={`Nama bahan ${indeks + 1}`}
                        placeholderTextColor={palette.placeholder}
                        value={baris.namaBahan}
                        onChangeText={(t) => ubahBaris(baris.id, 'namaBahan', t)}
                      />
                      <View style={{ flexDirection: 'row', marginTop: 8 }}>
                        <TextInput
                          style={[styles.input, { flex: 1, marginRight: 8 }]}
                          placeholder="Harga beli / satuan"
                          placeholderTextColor={palette.placeholder}
                          keyboardType="decimal-pad"
                          value={baris.hargaBeli}
                          onChangeText={(t) => ubahBaris(baris.id, 'hargaBeli', t)}
                        />
                        <TextInput
                          style={[styles.input, { flex: 1 }]}
                          placeholder="Takaran"
                          placeholderTextColor={palette.placeholder}
                          keyboardType="decimal-pad"
                          value={baris.takaran}
                          onChangeText={(t) => ubahBaris(baris.id, 'takaran', t)}
                        />
                      </View>
                      {inputTakaran.length > 1 && (
                        <Pressable onPress={() => hapusBaris(baris.id)}>
                          <Text style={[styles.helperText, { color: palette.error }]}>
                            Hapus bahan ini
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  ))}

                  <Pressable onPress={tambahBaris}>
                    <Text style={[styles.authLinkGreen, { marginVertical: 12 }]}>
                      + Tambah bahan
                    </Text>
                  </Pressable>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Harga jual</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Contoh: 18.000"
                      placeholderTextColor={palette.placeholder}
                      keyboardType="decimal-pad"
                      value={inputHargaJual}
                      onChangeText={setInputHargaJual}
                    />
                  </View>
                </>
              )}

              {error !== '' && (
                <View style={styles.errorPanel}>
                  <Text style={[styles.messageText, { color: palette.error }]}>
                    {error}
                  </Text>
                </View>
              )}

              <Pressable
                onPress={getInput}
                disabled={!canSubmit || loading}
                style={({ pressed }) => [
                  styles.primaryButton,
                  canSubmit ? styles.primaryButtonEnabled : styles.primaryButtonDisabled,
                  pressed && canSubmit ? styles.primaryButtonPressed : undefined,
                ]}
              >
                {loading ? (
                  <>
                    <ActivityIndicator size="small" color={palette.navy} />
                    <Text style={styles.primaryButtonText}>{'  '}Memproses...</Text>
                  </>
                ) : (
                  <Text
                    style={[
                      styles.primaryButtonText,
                      !canSubmit && styles.primaryButtonTextDisabled,
                    ]}
                  >
                    {tahap === 1 ? 'Lanjut' : 'Simpan produk'}
                  </Text>
                )}
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
