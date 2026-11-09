
import React, { useRef } from 'react';
import {
  AccessibilityInfo,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Header, UI_THEME } from '../../components/Header';
import { InputField, InputFieldHandle } from '../../components/InputField';
import { Button } from '../../components/Button';
import {
  JENIS_JASA_OPTIONS,
  JenisJasa,
} from '../../services/serviceCatalogService';
import {
  FORM_LIMITS,
  PendaftaranJasaField,
  formatRupiah,
  isMinimalFilled,
  sanitizeJamInput,
  sanitizeTarifInput,
  toRegisterPayload,
  useCatalogController,
} from '../../controllers/useCatalogController';

export const ServiceRegistrationView: React.FC = () => {
  const navigation = useNavigation();
  const {
    user,
    form,
    errors,
    isSubmitting,
    serverError,
    setFieldValue,
    handleBlur,
    validateBeforeSubmit,
    dismissServerError,
  } = useCatalogController();

  const scrollViewRef =
    useRef<React.ComponentRef<typeof ScrollView>>(null);

  const fieldRefs = useRef<
    Partial<Record<PendaftaranJasaField, InputFieldHandle | null>>
  >({});

  const fieldOffsets = useRef<Partial<Record<PendaftaranJasaField, number>>>(
    {}
  );

  const registerFieldLayout =
    (fields: PendaftaranJasaField[]) => (event: LayoutChangeEvent) => {
      const y = event.nativeEvent.layout.y;
      for (const f of fields) {
        fieldOffsets.current[f] = y;
      }
    };

  const focusField = (field: PendaftaranJasaField) => {
    const targetY = fieldOffsets.current[field];
    if (typeof targetY === 'number') {
      scrollViewRef.current?.scrollTo({
        y: Math.max(targetY - 24, 0),
        animated: true,
      });
    }
    setTimeout(() => {
      fieldRefs.current[field]?.focus();
    }, 150);
  };

  const handlePressSubmit = () => {
    const validation = validateBeforeSubmit();

    if (!validation.isValid) {
      const invalidCount = Object.keys(validation.errors).length;
      AccessibilityInfo.announceForAccessibility(
        `Periksa kembali ${invalidCount} isian yang belum valid`
      );
      if (validation.firstInvalidField) {
        focusField(validation.firstInvalidField);
      }
      return;
    }

    const payload = toRegisterPayload(form, user.idPengguna);
    console.log('[UI-16] Payload pendaftaran penyedia jasa valid:', payload);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* UI-16-01 & UI-16-02: Tombol Kembali, Judul, dan Subjudul */}
          <Header
            title="Daftar Penyedia Jasa"
            subtitle="Lengkapi data untuk mulai menerima pesanan"
            onBackPress={() => navigation.goBack()}
            testID="ui16-header"
          />

          {/* Banner Error Server / Jaringan */}
          {serverError ? (
            <View style={styles.errorBanner} testID="ui16-server-error">
              <Ionicons
                name="warning"
                size={20}
                color={UI_THEME.error}
                style={styles.errorBannerIcon}
              />
              <Text style={styles.errorBannerText}>{serverError}</Text>
              <Pressable
                onPress={dismissServerError}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Tutup pesan kesalahan"
              >
                <Ionicons name="close" size={18} color={UI_THEME.error} />
              </Pressable>
            </View>
          ) : null}

          {/* UI-16-03 & UI-16-04: Nama Toko / Penyedia Jasa */}
          <View onLayout={registerFieldLayout(['namaToko'])}>
            <InputField
              ref={(el) => {
                fieldRefs.current.namaToko = el;
              }}
              label="Nama Toko / Penyedia Jasa"
              placeholder="Masukkan nama toko atau usahamu"
              iconName="storefront-outline"
              value={form.namaToko}
              onChangeText={(text) => setFieldValue('namaToko', text)}
              onBlur={() => handleBlur('namaToko')}
              maxLength={FORM_LIMITS.namaTokoMax}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => fieldRefs.current.jenisJasa?.open()}
              error={errors.namaToko}
              testID="ui16-nama-toko"
            />
          </View>

          {/* UI-16-05 & UI-16-06: Dropdown Jenis Jasa */}
          <View onLayout={registerFieldLayout(['jenisJasa'])}>
            <InputField
              ref={(el) => {
                fieldRefs.current.jenisJasa = el;
              }}
              label="Jenis Jasa"
              type="select"
              placeholder="Pilih jenis jasa yang ditawarkan"
              iconName="construct-outline"
              value={form.jenisJasa}
              options={JENIS_JASA_OPTIONS}
              onSelectOption={(val) =>
                setFieldValue('jenisJasa', val as JenisJasa)
              }
              error={errors.jenisJasa}
              testID="ui16-jenis-jasa"
            />
          </View>

          {/* Deskripsi Jasa */}
          <View onLayout={registerFieldLayout(['deskripsiJasa'])}>
            <InputField
              ref={(el) => {
                fieldRefs.current.deskripsiJasa = el;
              }}
              label="Deskripsi Jasa"
              placeholder="Ceritakan keahlian, pengalaman, dan layanan yang kamu tawarkan"
              iconName="document-text-outline"
              value={form.deskripsiJasa}
              onChangeText={(text) => setFieldValue('deskripsiJasa', text)}
              onBlur={() => handleBlur('deskripsiJasa')}
              multiline
              numberOfLines={4}
              maxLength={FORM_LIMITS.deskripsiMax}
              showCounter
              error={errors.deskripsiJasa}
              testID="ui16-deskripsi"
            />
          </View>

          {/* Estimasi Tarif Dasar */}
          <View onLayout={registerFieldLayout(['tarif'])}>
            <InputField
              ref={(el) => {
                fieldRefs.current.tarif = el;
              }}
              label="Estimasi Tarif Dasar"
              placeholder="75.000"
              prefix="Rp"
              keyboardType="number-pad"
              value={formatRupiah(form.tarif)}
              onChangeText={(text) =>
                setFieldValue('tarif', sanitizeTarifInput(text))
              }
              onBlur={() => handleBlur('tarif')}
              returnKeyType="next"
              onSubmitEditing={() => fieldRefs.current.jamMulai?.focus()}
              helperText="Tarif awal sebelum negosiasi dengan pelanggan"
              error={errors.tarif}
              testID="ui16-tarif"
            />
          </View>

          {/* Jam Kerja (Mulai & Selesai) */}
          <View
            style={styles.timeSection}
            onLayout={registerFieldLayout(['jamMulai', 'jamSelesai'])}
          >
            <Text style={styles.sectionLabel}>Jam Kerja</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeCol}>
                <InputField
                  ref={(el) => {
                    fieldRefs.current.jamMulai = el;
                  }}
                  label="Mulai"
                  placeholder="08:00"
                  iconName="time-outline"
                  keyboardType="number-pad"
                  maxLength={5}
                  value={form.jamMulai}
                  onChangeText={(text) =>
                    setFieldValue('jamMulai', sanitizeJamInput(text))
                  }
                  onBlur={() => handleBlur('jamMulai')}
                  returnKeyType="next"
                  onSubmitEditing={() => fieldRefs.current.jamSelesai?.focus()}
                  error={errors.jamMulai}
                  containerStyle={styles.timeInputContainer}
                  testID="ui16-jam-mulai"
                />
              </View>

              <View style={styles.timeCol}>
                <InputField
                  ref={(el) => {
                    fieldRefs.current.jamSelesai = el;
                  }}
                  label="Selesai"
                  placeholder="17:00"
                  iconName="time-outline"
                  keyboardType="number-pad"
                  maxLength={5}
                  value={form.jamSelesai}
                  onChangeText={(text) =>
                    setFieldValue('jamSelesai', sanitizeJamInput(text))
                  }
                  onBlur={() => handleBlur('jamSelesai')}
                  returnKeyType="next"
                  onSubmitEditing={() => fieldRefs.current.daerahKerja?.focus()}
                  error={errors.jamSelesai}
                  containerStyle={styles.timeInputContainer}
                  testID="ui16-jam-selesai"
                />
              </View>
            </View>
          </View>

          {/* Wilayah / Lokasi Kerja */}
          <View onLayout={registerFieldLayout(['daerahKerja'])}>
            <InputField
              ref={(el) => {
                fieldRefs.current.daerahKerja = el;
              }}
              label="Wilayah / Lokasi Kerja"
              placeholder="Contoh: Coblong, Dago, Bandung Utara"
              iconName="location-outline"
              value={form.daerahKerja}
              onChangeText={(text) => setFieldValue('daerahKerja', text)}
              onBlur={() => handleBlur('daerahKerja')}
              maxLength={FORM_LIMITS.daerahMax}
              returnKeyType="done"
              onSubmitEditing={handlePressSubmit}
              error={errors.daerahKerja}
              testID="ui16-daerah"
            />
          </View>
        </ScrollView>

        {/* UI-16-07: Tombol Ajukan Pendaftaran */}
        <View style={styles.footer}>
          <Button
            title="Ajukan Pendaftaran"
            onPress={handlePressSubmit}
            disabled={!isMinimalFilled(form) || isSubmitting}
            loading={isSubmitting}
            testID="ui16-submit"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: UI_THEME.background,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_THEME.errorBg,
    borderLeftWidth: 4,
    borderLeftColor: UI_THEME.error,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },
  errorBannerIcon: {
    marginRight: 10,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: UI_THEME.error,
    fontWeight: '600',
    marginRight: 8,
  },
  timeSection: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: UI_THEME.textTitle,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeCol: {
    flex: 1,
  },
  timeInputContainer: {
    marginBottom: 0,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: UI_THEME.background,
    borderTopWidth: 1,
    borderTopColor: UI_THEME.border,
  },
});

export default ServiceRegistrationView;
