import { useEffect, useRef, useState } from 'react';

import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

import {
  BahanTersimpan,
  MarginController,
  PreviewMargin,
} from '../controllers/MarginController';
import {
  DataBiaya,
  formatPersen,
  formatRupiah,
  hitungHpp,
  hitungTotalBiaya,
  parseAngka,
} from '../controllers/margin';
import { DAFTAR_TAG } from '../models/Produk';
import PilihanModal, { PilihanOpsi } from './PilihanModal';
import { palette, styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AddProduct'>;

type BarisBahan = {
  id: number;
  idBahan: string | null;
  baru: boolean;
  namaBahan: string;
  hargaBeli: string;
  satuan: string;
  takaran: string;
};

type InfoBahan = {
  nama: string;
  harga: number;
  satuan: string;
};

const BAHAN_BARU = '__baru__';

let counterBaris = 1;

function barisKosong(): BarisBahan {
  counterBaris += 1;
  return {
    id: counterBaris,
    idBahan: null,
    baru: false,
    namaBahan: '',
    hargaBeli: '',
    satuan: '',
    takaran: '',
  };
}

function infoBaris(baris: BarisBahan, daftar: BahanTersimpan[]): InfoBahan | null {
  if (baris.idBahan !== null) {
    const ada = daftar.find((b) => b.idBahan === baris.idBahan);
    return ada
      ? { nama: ada.namaBahan, harga: ada.hargaBeli, satuan: ada.satuan }
      : null;
  }
  if (baris.baru) {
    return {
      nama: baris.namaBahan,
      harga: parseAngka(baris.hargaBeli),
      satuan: baris.satuan,
    };
  }
  return null;
}

export default function AddProductPage({ navigation }: Props) {
  const controller = useRef(new MarginController()).current;

  const [inputNamaProduk, setInputNamaProduk] = useState('');
  const [inputTag, setInputTag] = useState<string | null>(null);
  const [inputHargaJual, setInputHargaJual] = useState('');
  const [inputHasilResep, setInputHasilResep] = useState('');
  const [inputTakaran, setInputTakaran] = useState<BarisBahan[]>([barisKosong()]);

  const [daftarBahan, setDaftarBahan] = useState<BahanTersimpan[]>([]);
  const [pilihTagTerbuka, setPilihTagTerbuka] = useState(false);
  const [pilihBahanUntuk, setPilihBahanUntuk] = useState<number | null>(null);

  const [error, setError] = useState('');
  const [preview, setPreview] = useState<PreviewMargin | null>(null);
  const [hasil, setHasil] = useState<PreviewMargin | null>(null);
  const [loading, setLoading] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);

  async function muatDaftarBahan() {
    try {
      setDaftarBahan(await controller.getDaftarBahan());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat daftar bahan baku');
    }
  }

  useEffect(() => {
    muatDaftarBahan();
  }, []);

  const dataBiaya: DataBiaya[] = [];
  for (const baris of inputTakaran) {
    const info = infoBaris(baris, daftarBahan);
    const takaran = parseAngka(baris.takaran);
    if (info !== null && !Number.isNaN(info.harga) && !Number.isNaN(takaran)) {
      dataBiaya.push({ hargaBeli: info.harga, takaran });
    }
  }
  const porsi = parseAngka(inputHasilResep);
  const porsiValid = Number.isFinite(porsi) && porsi > 0;
  const totalBiaya = hitungTotalBiaya(dataBiaya);
  const hppPerPorsi = porsiValid ? hitungHpp(dataBiaya, porsi) : 0;

  const canSubmit =
    inputNamaProduk.trim().length > 0 &&
    inputHargaJual.trim().length > 0 &&
    inputHasilResep.trim().length > 0 &&
    inputTakaran.every(
      (b) =>
        b.takaran.trim().length > 0 &&
        (b.idBahan !== null ||
          (b.baru &&
            b.namaBahan.trim().length > 0 &&
            b.hargaBeli.trim().length > 0 &&
            b.satuan.trim().length > 0)),
    );

  function showPage() {
    setInputNamaProduk('');
    setInputTag(null);
    setInputHargaJual('');
    setInputHasilResep('');
    setInputTakaran([barisKosong()]);
    setError('');
    setPreview(null);
    setHasil(null);
    muatDaftarBahan();
  }

  function showErrorMessage(pesan: string) {
    setError(pesan);
  }

  function showSuccessMessage(data: PreviewMargin) {
    setError('');
    setHasil(data);
  }

  async function getInput() {
    setError('');
    setLoading(true);

    try {
      const bahan = inputTakaran.map((baris) => {
        const info = infoBaris(baris, daftarBahan);
        return {
          idBahan: baris.idBahan,
          namaBahan: info?.nama ?? '',
          hargaBeli: info?.harga ?? 0,
          satuan: info?.satuan ?? '',
          takaran: parseAngka(baris.takaran),
        };
      });

      const hasilPreview = await controller.validasiInput({
        namaProduk: inputNamaProduk,
        tag: inputTag === null ? [] : [inputTag],
        hargaJual: parseAngka(inputHargaJual),
        hasilResep: parseAngka(inputHasilResep),
        bahan,
      });
      setPreview(hasilPreview);
    } catch (e) {
      showErrorMessage(
        e instanceof Error ? e.message : 'Terjadi kesalahan saat menghitung margin',
      );
    } finally {
      setLoading(false);
    }
  }

  async function simpanProduk() {
    if (preview === null) return;
    setMenyimpan(true);

    try {
      await controller.simpanProduk();
      const tersimpan = preview;
      setPreview(null);
      showSuccessMessage(tersimpan);
    } catch (e) {
      setPreview(null);
      showErrorMessage(
        e instanceof Error ? e.message : 'Terjadi kesalahan saat menyimpan produk',
      );
    } finally {
      setMenyimpan(false);
    }
  }

  function ubahBaris(id: number, perubahan: Partial<BarisBahan>) {
    setInputTakaran((daftar) =>
      daftar.map((b) => (b.id === id ? { ...b, ...perubahan } : b)),
    );
  }

  function pilihBahan(nilai: string) {
    if (pilihBahanUntuk === null) return;
    if (nilai === BAHAN_BARU) {
      ubahBaris(pilihBahanUntuk, { idBahan: null, baru: true });
    } else {
      ubahBaris(pilihBahanUntuk, { idBahan: nilai, baru: false });
    }
    setPilihBahanUntuk(null);
  }

  function hapusBaris(id: number) {
    setInputTakaran((daftar) =>
      daftar.length > 1 ? daftar.filter((b) => b.id !== id) : daftar,
    );
  }

  const opsiTag: PilihanOpsi[] = DAFTAR_TAG.map((tag) => ({
    nilai: tag,
    label: tag,
  }));

  const opsiBahan: PilihanOpsi[] = [
    ...daftarBahan.map((b) => ({
      nilai: b.idBahan,
      label: b.namaBahan,
      keterangan: `${formatRupiah(b.hargaBeli)}/${b.satuan}`,
    })),
    { nilai: BAHAN_BARU, label: '+ Bahan baru', aksen: true },
  ];

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

            <View>
              <Text style={styles.pageTitle}>Tambah produk</Text>
              <Text style={lokal.subjudul}>Harga dan biaya per porsi</Text>
            </View>
          </View>

          {hasil !== null ? (
            <View style={styles.form}>
              <View style={styles.successPanel}>
                <Text style={[styles.messageText, { color: palette.success }]}>
                  Produk berhasil disimpan
                </Text>
              </View>

              <View style={lokal.kartuProduk}>
                <Text style={lokal.namaProduk}>{hasil.namaProduk}</Text>
                <View style={lokal.barisAngka}>
                  <Text style={lokal.labelAngka}>Harga jual</Text>
                  <Text style={lokal.nilaiAngka}>{formatRupiah(hasil.hargaJual)}</Text>
                </View>
                <View style={lokal.barisAngka}>
                  <Text style={lokal.labelAngka}>HPP per porsi</Text>
                  <Text style={lokal.nilaiAngka}>{formatRupiah(hasil.hpp)}</Text>
                </View>
                <View style={lokal.barisAngka}>
                  <Text style={lokal.labelAngka}>Margin</Text>
                  <Text
                    style={[
                      lokal.nilaiAngka,
                      { color: hasil.margin < 0 ? palette.error : palette.success },
                    ]}
                  >
                    {formatRupiah(hasil.margin)} ({formatPersen(hasil.persenMargin)})
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => navigation.navigate('Home')}
                style={({ pressed }) => [
                  styles.primaryButton,
                  styles.primaryButtonEnabled,
                  pressed ? styles.primaryButtonPressed : undefined,
                ]}
              >
                <Text style={styles.primaryButtonText}>Kembali ke Beranda</Text>
              </Pressable>

              <Pressable onPress={showPage}>
                <Text style={styles.authLinkGreen}>+ Tambah produk lain</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nama produk</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Nasi Ayam Kecap"
                  placeholderTextColor={palette.placeholder}
                  value={inputNamaProduk}
                  onChangeText={setInputNamaProduk}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Tag</Text>
                <Pressable
                  style={[styles.input, lokal.pilih]}
                  onPress={() => setPilihTagTerbuka(true)}
                >
                  <Text
                    style={
                      inputTag === null ? lokal.pilihKosong : lokal.pilihIsi
                    }
                  >
                    {inputTag ?? 'Pilih tag'}
                  </Text>
                  <Text style={lokal.panah}>▾</Text>
                </Pressable>
              </View>

              <View style={lokal.dua}>
                <View style={[styles.fieldGroup, lokal.setengah]}>
                  <Text style={styles.fieldLabel}>Harga jual / porsi (Rp)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="20.000"
                    placeholderTextColor={palette.placeholder}
                    keyboardType="decimal-pad"
                    value={inputHargaJual}
                    onChangeText={setInputHargaJual}
                  />
                </View>
                <View style={[styles.fieldGroup, lokal.setengah]}>
                  <Text style={styles.fieldLabel}>Hasil resep (porsi)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="10"
                    placeholderTextColor={palette.placeholder}
                    keyboardType="number-pad"
                    value={inputHasilResep}
                    onChangeText={setInputHasilResep}
                  />
                </View>
              </View>

              <View style={lokal.judulBagian}>
                <Text style={lokal.teksBagian}>Bahan Baku & Takaran</Text>
                <Text style={styles.helperText}>{inputTakaran.length} bahan</Text>
              </View>
              <Text style={styles.helperText}>
                Takaran untuk satu resep. Biaya dibagi jumlah porsi untuk
                mendapatkan HPP.
              </Text>

              {inputTakaran.map((baris) => {
                const info = infoBaris(baris, daftarBahan);
                const takaran = parseAngka(baris.takaran);
                const hargaValid = info !== null && !Number.isNaN(info.harga);
                const namaTampil =
                  baris.idBahan !== null
                    ? (info?.nama ?? 'Pilih bahan')
                    : baris.baru
                      ? 'Bahan baru'
                      : 'Pilih bahan';

                return (
                  <View key={baris.id} style={lokal.kartuBahan}>
                    <View style={lokal.barisBahan}>
                      <Pressable
                        style={[styles.input, lokal.pilih, lokal.pilihBahan]}
                        onPress={() => setPilihBahanUntuk(baris.id)}
                      >
                        <Text
                          style={
                            namaTampil === 'Pilih bahan'
                              ? lokal.pilihKosong
                              : lokal.pilihIsi
                          }
                          numberOfLines={1}
                        >
                          {namaTampil}
                        </Text>
                        <Text style={lokal.panah}>▾</Text>
                      </Pressable>

                      <View style={[styles.input, lokal.kotakTakaran]}>
                        <TextInput
                          style={lokal.inputTakaran}
                          placeholder="0"
                          placeholderTextColor={palette.placeholder}
                          keyboardType="decimal-pad"
                          value={baris.takaran}
                          onChangeText={(t) => ubahBaris(baris.id, { takaran: t })}
                        />
                        <Text style={lokal.satuan} numberOfLines={1}>
                          {info?.satuan ?? ''}
                        </Text>
                      </View>

                      <Pressable
                        onPress={() => hapusBaris(baris.id)}
                        disabled={inputTakaran.length === 1}
                        accessibilityRole="button"
                        accessibilityLabel="Hapus bahan"
                      >
                        <Text
                          style={[
                            lokal.hapus,
                            inputTakaran.length === 1 && lokal.hapusNonaktif,
                          ]}
                        >
                          ✕
                        </Text>
                      </Pressable>
                    </View>

                    {baris.baru && (
                      <View style={lokal.bahanBaru}>
                        <TextInput
                          style={styles.input}
                          placeholder="Nama bahan"
                          placeholderTextColor={palette.placeholder}
                          value={baris.namaBahan}
                          onChangeText={(t) => ubahBaris(baris.id, { namaBahan: t })}
                        />
                        <View style={lokal.dua}>
                          <TextInput
                            style={[styles.input, lokal.setengah]}
                            placeholder="Harga beli / satuan"
                            placeholderTextColor={palette.placeholder}
                            keyboardType="decimal-pad"
                            value={baris.hargaBeli}
                            onChangeText={(t) => ubahBaris(baris.id, { hargaBeli: t })}
                          />
                          <TextInput
                            style={[styles.input, lokal.setengah]}
                            placeholder="Satuan (kg, ml, pak)"
                            placeholderTextColor={palette.placeholder}
                            autoCapitalize="none"
                            value={baris.satuan}
                            onChangeText={(t) => ubahBaris(baris.id, { satuan: t })}
                          />
                        </View>
                      </View>
                    )}

                    {hargaValid && (
                      <Text style={styles.helperText}>
                        {formatRupiah(info.harga)}/{info.satuan}
                        {!Number.isNaN(takaran)
                          ? ` · Biaya ${formatRupiah(info.harga * takaran)}`
                          : ''}
                      </Text>
                    )}
                  </View>
                );
              })}

              <Pressable
                style={lokal.tombolTambah}
                onPress={() => setInputTakaran((d) => [...d, barisKosong()])}
              >
                <Text style={lokal.teksTambah}>+ Tambah bahan</Text>
              </Pressable>

              <View style={lokal.panelHasil}>
                <View style={lokal.dua}>
                  <View style={lokal.setengah}>
                    <Text style={styles.helperText}>Total biaya resep</Text>
                    <Text style={lokal.angkaBesar}>{formatRupiah(totalBiaya)}</Text>
                  </View>
                  <View style={lokal.setengah}>
                    <Text style={styles.helperText}>HPP per porsi</Text>
                    <Text style={lokal.angkaBesar}>{formatRupiah(hppPerPorsi)}</Text>
                  </View>
                </View>
                {porsiValid && (
                  <Text style={styles.helperText}>
                    {formatRupiah(totalBiaya)} ÷ {porsi} porsi ={' '}
                    {formatRupiah(hppPerPorsi)}
                  </Text>
                )}
              </View>

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
                <Text
                  style={[
                    styles.primaryButtonText,
                    !canSubmit && styles.primaryButtonTextDisabled,
                  ]}
                >
                  {loading ? 'Menghitung dan menyimpan...' : 'Preview kalkulasi margin'}
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <PilihanModal
        visible={pilihTagTerbuka}
        judul="Pilih tag"
        opsi={opsiTag}
        onPilih={(nilai) => {
          setInputTag(nilai);
          setPilihTagTerbuka(false);
        }}
        onTutup={() => setPilihTagTerbuka(false)}
      />

      <PilihanModal
        visible={pilihBahanUntuk !== null}
        judul="Pilih bahan baku"
        opsi={opsiBahan}
        onPilih={pilihBahan}
        onTutup={() => setPilihBahanUntuk(null)}
      />

      <Modal
        visible={preview !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPreview(null)}
      >
        <View style={lokal.latar}>
          <View style={lokal.dialog}>
            <Text style={lokal.judulDialog}>Preview kalkulasi margin</Text>

            {preview !== null && (
              <>
                <View style={lokal.barisAngka}>
                  <Text style={lokal.labelAngka}>HPP per porsi</Text>
                  <Text style={lokal.nilaiAngka}>{formatRupiah(preview.hpp)}</Text>
                </View>
                <View style={lokal.barisAngka}>
                  <Text style={lokal.labelAngka}>Harga jual</Text>
                  <Text style={lokal.nilaiAngka}>
                    {formatRupiah(preview.hargaJual)}
                  </Text>
                </View>
                <View style={lokal.barisAngka}>
                  <Text style={lokal.labelAngka}>
                    {preview.margin < 0 ? 'Kerugian' : 'Keuntungan'}
                  </Text>
                  <Text
                    style={[
                      lokal.nilaiAngka,
                      { color: preview.margin < 0 ? palette.error : palette.success },
                    ]}
                  >
                    {formatRupiah(preview.margin)}
                  </Text>
                </View>
                <View style={lokal.barisAngka}>
                  <Text style={lokal.labelAngka}>Persentase margin</Text>
                  <Text style={lokal.nilaiAngka}>
                    {formatPersen(preview.persenMargin)}
                  </Text>
                </View>

                {preview.margin < 0 && (
                  <View style={styles.errorPanel}>
                    <Text style={[styles.messageText, { color: palette.error }]}>
                      Margin negatif: HPP lebih besar daripada harga jual.
                    </Text>
                  </View>
                )}
              </>
            )}

            <Pressable
              onPress={simpanProduk}
              disabled={menyimpan}
              style={({ pressed }) => [
                styles.primaryButton,
                menyimpan ? styles.primaryButtonDisabled : styles.primaryButtonEnabled,
                pressed && !menyimpan ? styles.primaryButtonPressed : undefined,
              ]}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  menyimpan && styles.primaryButtonTextDisabled,
                ]}
              >
                {menyimpan ? 'Menghitung dan menyimpan...' : 'Simpan produk'}
              </Text>
            </Pressable>

            <Pressable onPress={() => setPreview(null)} disabled={menyimpan}>
              <Text style={styles.authLink}>Kembali edit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const lokal = StyleSheet.create({
  subjudul: {
    fontSize: 13,
    color: palette.secondary,
  },
  pilih: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pilihBahan: {
    flex: 1,
    marginRight: 8,
  },
  pilihKosong: {
    flex: 1,
    fontSize: 15,
    color: palette.placeholder,
  },
  pilihIsi: {
    flex: 1,
    fontSize: 15,
    color: palette.text,
  },
  panah: {
    marginLeft: 6,
    fontSize: 14,
    color: palette.navy,
  },
  dua: {
    flexDirection: 'row',
    columnGap: 10,
  },
  setengah: {
    flex: 1,
  },
  judulBagian: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  teksBagian: {
    fontSize: 17,
    fontWeight: '800',
    color: palette.navy,
  },
  kartuBahan: {
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 14,
    backgroundColor: palette.white,
    rowGap: 8,
  },
  barisBahan: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kotakTakaran: {
    width: 104,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  inputTakaran: {
    flex: 1,
    padding: 0,
    fontSize: 15,
    textAlign: 'right',
    color: palette.text,
  },
  satuan: {
    marginLeft: 4,
    maxWidth: 40,
    fontSize: 12,
    color: palette.secondary,
  },
  hapus: {
    paddingHorizontal: 12,
    fontSize: 18,
    fontWeight: '700',
    color: palette.error,
  },
  hapusNonaktif: {
    opacity: 0.3,
  },
  bahanBaru: {
    rowGap: 8,
  },
  tombolTambah: {
    marginTop: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 25,
    backgroundColor: palette.white,
  },
  teksTambah: {
    fontWeight: '800',
    color: palette.navy,
  },
  panelHasil: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#EAF0FB',
    rowGap: 6,
  },
  angkaBesar: {
    fontSize: 20,
    fontWeight: '800',
    color: palette.navy,
  },
  latar: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(23, 39, 80, 0.45)',
  },
  dialog: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: palette.white,
    rowGap: 12,
  },
  judulDialog: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.navy,
  },
  kartuProduk: {
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 16,
    backgroundColor: palette.white,
    rowGap: 8,
  },
  namaProduk: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.navy,
  },
  barisAngka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelAngka: {
    fontSize: 14,
    color: palette.secondary,
  },
  nilaiAngka: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
  },
});
