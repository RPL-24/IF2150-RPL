
import { useState } from 'react';

import {
  ActivityIndicator,
  Image,
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

import { AuthController } from '../controllers/AuthController';

import {
  isEmailValid,
  isPasswordKuat,
  isKonfirmasiPasswordSesuai,
} from '../controllers/validators';

import { palette, styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const auth = new AuthController();

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <View style={styles.eyeIcon}>
      <View style={styles.eyeShape}>
        <View style={styles.eyePupil} />
      </View>

      {!visible && <View style={styles.eyeSlash} />}
    </View>
  );
}

export default function RegistrationPage({ navigation }: Props) {
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const canSubmit =
    usernameInput.trim().length > 0 &&
    emailInput.trim().length > 0 &&
    passwordInput.length > 0 &&
    confirmPasswordInput.length > 0;

  async function submitForm() {
    setMessage('');
    setIsError(false);

    setEmailError('');
    setPasswordError('');
    setConfirmError('');

    // ==========================================
    // 1. VALIDASI KELENGKAPAN
    // ==========================================

    if (!canSubmit) {
      setIsError(true);
      setMessage('Lengkapi semua data terlebih dahulu.');
      return;
    }

    // ==========================================
    // 2. VALIDASI EMAIL
    // ==========================================

    if (!isEmailValid(emailInput.trim().toLowerCase())) {
      setEmailError('Format email tidak valid.');
      return;
    }

    // ==========================================
    // 3. VALIDASI PASSWORD
    // ==========================================

    if (!isPasswordKuat(passwordInput)) {
      setPasswordError(
        'Password terlalu lemah. Gunakan minimal 8 karakter, huruf dan angka.',
      );
      return;
    }

    // ==========================================
    // 4. VALIDASI KONFIRMASI PASSWORD
    // ==========================================

    if (
      !isKonfirmasiPasswordSesuai(
        passwordInput,
        confirmPasswordInput,
      )
    ) {
      setConfirmError('Konfirmasi password belum cocok.');
      return;
    }

    // ==========================================
    // 5. REGISTRASI MELALUI AUTH CONTROLLER
    // ==========================================

    setLoading(true);

    try {
      await auth.validateData(
        usernameInput,
        emailInput,
        passwordInput,
      );

      setRegistered(true);
      setIsError(false);
      setMessage('Akun berhasil dibuat.');
    } catch (error) {
      setIsError(true);

      setMessage(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat membuat akun.',
      );
    } finally {
      setLoading(false);
    }
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

          {/* HEADER */}

          <View style={styles.pageHeaderWithBack}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Kembali"
            >
              <Text style={styles.backText}>←</Text>
            </Pressable>

            <Text style={styles.pageTitle}>
              Daftar akun
            </Text>
          </View>

          {/* BRAND CARD */}

          <View style={styles.brandCard}>
            <Image
              source={require('../assets/LogoPross.jpeg')}
              style={styles.brandLogo}
            />

            <Text style={styles.brandHeadline}>
              Mulai usaha lebih terukur
            </Text>

            <Text style={styles.brandSubtitle}>
              Buat akun Pross untuk usaha kuliner Anda.
            </Text>
          </View>

          {/* REGISTRATION FORM */}

          <View style={styles.form}>

            {/* USERNAME */}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Username
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Pilih username"
                placeholderTextColor={palette.placeholder}
                autoCapitalize="none"
                autoCorrect={false}
                value={usernameInput}
                onChangeText={setUsernameInput}
              />
            </View>

            {/* EMAIL */}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Email
              </Text>

              <TextInput
                style={[
                  styles.input,
                  emailError !== '' && styles.inputError,
                ]}
                placeholder="nama@email.com"
                placeholderTextColor={palette.placeholder}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={emailInput}
                onChangeText={(value) => {
                  setEmailInput(value);
                  setEmailError('');
                }}
              />

              {emailError !== '' && (
                <Text style={styles.fieldError}>
                  {emailError}
                </Text>
              )}
            </View>

            {/* PASSWORD */}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Password
              </Text>

              <View
                style={[
                  styles.passwordField,
                  passwordError !== '' && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Buat password"
                  placeholderTextColor={palette.placeholder}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={passwordInput}
                  onChangeText={(value) => {
                    setPasswordInput(value);
                    setPasswordError('');
                  }}
                />

                <Pressable
                  style={styles.passwordToggle}
                  onPress={() =>
                    setShowPassword((value) => !value)
                  }
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword
                      ? 'Sembunyikan password'
                      : 'Tampilkan password'
                  }
                >
                  <EyeIcon visible={showPassword} />
                </Pressable>
              </View>

              <Text style={styles.helperText}>
                Saran: gunakan frasa panjang, huruf dan angka.
              </Text>

              {passwordError !== '' && (
                <Text style={styles.fieldError}>
                  {passwordError}
                </Text>
              )}
            </View>

            {/* CONFIRM PASSWORD */}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Konfirmasi password
              </Text>

              <View
                style={[
                  styles.passwordField,
                  confirmError !== '' && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Ulangi password"
                  placeholderTextColor={palette.placeholder}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={confirmPasswordInput}
                  onChangeText={(value) => {
                    setConfirmPasswordInput(value);
                    setConfirmError('');
                  }}
                  onSubmitEditing={submitForm}
                  returnKeyType="done"
                />

                <Pressable
                  style={styles.passwordToggle}
                  onPress={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  accessibilityRole="button"
                  accessibilityLabel={
                    showConfirmPassword
                      ? 'Sembunyikan konfirmasi password'
                      : 'Tampilkan konfirmasi password'
                  }
                >
                  <EyeIcon visible={showConfirmPassword} />
                </Pressable>
              </View>

              {confirmError !== '' && (
                <Text style={styles.fieldError}>
                  {confirmError}
                </Text>
              )}
            </View>

            {/* GENERAL MESSAGE */}

            {message !== '' && (
              <View
                style={
                  isError
                    ? styles.errorPanel
                    : styles.successPanel
                }
              >
                <Text
                  style={[
                    styles.messageText,
                    {
                      color: isError
                        ? palette.error
                        : palette.success,
                    },
                  ]}
                >
                  {message}
                </Text>
              </View>
            )}

            {/* REGISTER BUTTON */}

            {!registered && (
              <Pressable
                onPress={submitForm}
                disabled={!canSubmit || loading}
                style={({ pressed }) => [
                  styles.primaryButton,
                  canSubmit
                    ? styles.primaryButtonEnabled
                    : styles.primaryButtonDisabled,
                  pressed && canSubmit
                    ? styles.primaryButtonPressed
                    : undefined,
                ]}
              >
                {loading ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color={palette.navy}
                    />

                    <Text style={styles.primaryButtonText}>
                      {'  '}Membuat akun...
                    </Text>
                  </>
                ) : (
                  <Text
                    style={[
                      styles.primaryButtonText,
                      !canSubmit &&
                        styles.primaryButtonTextDisabled,
                    ]}
                  >
                    Daftar
                  </Text>
                )}
              </Pressable>
            )}

            {/* SUCCESS BUTTON */}

            {registered && (
              <Pressable
                style={[
                  styles.primaryButton,
                  styles.primaryButtonEnabled,
                ]}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.primaryButtonText}>
                  Masuk
                </Text>
              </Pressable>
            )}

            {/* LOGIN LINK */}

            <Pressable
              onPress={() => navigation.navigate('Login')}
            >
              <Text
                style={[
                  styles.authLink,
                  styles.authLinkGreen,
                ]}
              >
                Sudah punya akun? Masuk
              </Text>
            </Pressable>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
