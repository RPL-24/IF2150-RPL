
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
import { palette, styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const auth = new AuthController();

// Ikon mata untuk password
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

export default function LoginPage({ navigation }: Props) {
  const [identifierInput, setIdentifierInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit =
    identifierInput.trim().length > 0 &&
    passwordInput.length > 0;

  async function login() {
    setError('');
    setLoading(true);

    try {
      await auth.validateData(
        identifierInput,
        null,
        passwordInput,
      );

    } catch (e) {
      setPasswordInput('');

      setError(
        e instanceof Error
          ? e.message
          : 'Terjadi kesalahan saat login',
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

          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Masuk</Text>
          </View>

          {/* BRAND CARD */}

          <View style={styles.brandCard}>
            <Image
              source={require('../assets/LogoPross.jpeg')}
              style={styles.brandLogo}
            />

            <Text style={styles.brandHeadline}>
              Kenali biaya, jaga untung.
            </Text>

            <Text style={styles.brandSubtitle}>
              Kelola HPP usaha kuliner dengan lebih yakin.
            </Text>
          </View>

          {/* LOGIN FORM */}

          <View style={styles.form}>

            {/* USERNAME / EMAIL */}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Username atau email
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Masukkan username atau email"
                placeholderTextColor={palette.placeholder}
                autoCapitalize="none"
                autoCorrect={false}
                value={identifierInput}
                onChangeText={setIdentifierInput}
                returnKeyType="next"
              />
            </View>

            {/* PASSWORD */}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Password
              </Text>

              <View style={styles.passwordField}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Masukkan password"
                  placeholderTextColor={palette.placeholder}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={passwordInput}
                  onChangeText={setPasswordInput}
                  onSubmitEditing={login}
                  returnKeyType="done"
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
            </View>

            {/* FORGOT PASSWORD */}

            <Pressable
              onPress={() => navigation.navigate('ResetPassword')}
            >
              <Text style={styles.forgotLink}>
                Lupa password?
              </Text>
            </Pressable>

            {/* ERROR MESSAGE */}

            {error !== '' && (
              <View style={styles.errorPanel}>
                <Text
                  style={[
                    styles.messageText,
                    { color: palette.error },
                  ]}
                >
                  {error}
                </Text>
              </View>
            )}

            {/* LOGIN BUTTON */}

            <Pressable
              onPress={login}
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
                    {'  '}Memeriksa akun...
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
                  Masuk
                </Text>
              )}
            </Pressable>

            {/* REGISTER LINK */}

            <Pressable
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.authLink}>
                Belum punya akun? Daftar
              </Text>
            </Pressable>

          </View>

          {/* FOOTER */}

          <View style={styles.authFooter}>
            <Text style={styles.footerText}>
              Pross · Teman tumbuh usaha kuliner Anda
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
