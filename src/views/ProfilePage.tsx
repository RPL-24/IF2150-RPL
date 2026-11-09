import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import {
  PESAN_EMAIL_TIDAK_VALID,
  PESAN_TELP_TIDAK_VALID,
  ProfileController,
} from '../controllers/ProfileController';
import { palette, styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const BIRU_MUDA = '#EAF0FF';
const BIRU_BORDER = '#C9D7F7';
const MERAH_BORDER = '#F5C6C0';

function inisial(nama: string): string {
  const kata = nama.trim().split(/\s+/).filter(Boolean);
  const hasil = (kata[0]?.[0] ?? '?') + (kata[1]?.[0] ?? '');
  return hasil.toUpperCase();
}

export default function ProfilePage({ navigation }: Props) {
  const [controller] = useState(() => new ProfileController());

  const [username, setUsername] = useState('');
  const [namaUsaha, setNamaUsaha] = useState('');
  const [email, setEmail] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [namaTersimpan, setNamaTersimpan] = useState('');

  const [memuat, setMemuat] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);
  const [sukses, setSukses] = useState('');
  const [galat, setGalat] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [errTelp, setErrTelp] = useState('');
  const [dialogLogout, setDialogLogout] = useState(false);
  const [keluar, setKeluar] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let aktif = true;

      controller
        .muatProfil()
        .then((p) => {
          if (!aktif) return;
          setUsername(p.getUsername());
          setNamaUsaha(p.getNamaUsaha());
          setEmail(p.getEmail());
          setNoTelp(p.getNoTelp());
          setNamaTersimpan(p.getNamaUsaha());
          setMemuat(false);
        })
        .catch((e) => {
          if (!aktif) return;
          setGalat(e instanceof Error ? e.message : 'Gagal memuat profil');
          setMemuat(false);
        });

      return () => {
        aktif = false;
      };
    }, [controller]),
  );

  async function getProfileInput() {
    setSukses('');
    setGalat('');
    setErrEmail('');
    setErrTelp('');

    const nama = namaUsaha.trim();
    const mail = email.trim();
    const telp = noTelp.trim();

    setMenyimpan(true);
    try {
      if (controller.validateProfileData(nama, mail, telp)) {
        const hasil = await controller.updateProfileData(nama, mail, telp);
        setNamaTersimpan(nama);
        setSukses(
          hasil.emailPerluKonfirmasi
            ? 'Cek email baru Anda untuk mengonfirmasi perubahan email.'
            : 'Data usaha Anda sudah disimpan.',
        );
      }
    } catch (e) {
      const pesan = e instanceof Error ? e.message : 'Gagal menyimpan profil';
      if (pesan === PESAN_EMAIL_TIDAK_VALID) setErrEmail(pesan);
      else if (pesan === PESAN_TELP_TIDAK_VALID) setErrTelp(pesan);
      else setGalat(pesan);
    } finally {
      setMenyimpan(false);
    }
  }

  async function konfirmasiLogout() {
    setKeluar(true);
    try {
      await controller.processLogout();
    } catch (e) {
      setDialogLogout(false);
      setKeluar(false);
      setGalat(e instanceof Error ? e.message : 'Gagal logout');
    }
  }

  const namaTampil = namaTersimpan || username;
  const belumLengkap = namaTersimpan === '' || noTelp.trim() === '';

  if (memuat) {
    return (
      <View style={[styles.screen, { justifyContent: 'center' }]}>
        <ActivityIndicator color={palette.green} />
      </View>
    );
  }

    return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: palette.navy }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            onPress={() => navigation.goBack()}
            style={{ marginBottom: 4 }}
          >
            <Text style={{ color: palette.white, fontSize: 24 }}>‹</Text>
          </Pressable>
          <Text style={{ color: palette.white, fontSize: 24, fontWeight: '800' }}>Profil</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 10 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 12,
            borderRadius: 12,
            backgroundColor: palette.white,
            borderWidth: 1,
            borderColor: palette.border,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: palette.successBackground,
            }}
          >
            <Text style={{ fontWeight: '800', color: palette.green }}>{inisial(namaTampil)}</Text>
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: palette.navy }}>
              {namaTampil}
            </Text>
            <Text style={{ fontSize: 12, color: palette.secondary }}>
              Pemilik usaha · @{username}
            </Text>
          </View>
        </View>

        {sukses !== '' && (
          <View style={{ padding: 12, borderRadius: 12, backgroundColor: palette.successBackground }}>
            <Text style={{ color: palette.success, fontWeight: '700' }}>
              Profil berhasil diperbarui
            </Text>
            <Text style={{ color: palette.navy, marginTop: 2, fontSize: 12 }}>{sukses}</Text>
          </View>
        )}

        {galat !== '' && (
          <View
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: palette.errorBackground,
              borderWidth: 1,
              borderColor: MERAH_BORDER,
            }}
          >
            <Text style={{ color: palette.error, fontWeight: '700' }}>{galat}</Text>
          </View>
        )}

        {menyimpan && (
          <View
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: BIRU_MUDA,
              borderWidth: 1,
              borderColor: BIRU_BORDER,
            }}
          >
            <Text style={{ color: palette.navy, fontWeight: '700' }}>Menyimpan profil...</Text>
            <Text style={{ color: palette.navy, marginTop: 2, fontSize: 12 }}>
              Isian sementara dinonaktifkan. Mohon tunggu.
            </Text>
          </View>
        )}

        {!menyimpan && sukses === '' && galat === '' && belumLengkap && (
          <View
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: BIRU_MUDA,
              borderWidth: 1,
              borderColor: BIRU_BORDER,
            }}
          >
            <Text style={{ color: palette.navy, fontWeight: '700' }}>Lengkapi profil usaha</Text>
            <Text style={{ color: palette.navy, marginTop: 2, fontSize: 12 }}>
              Nama usaha dan nomor telepon belum diisi. Anda dapat melengkapinya di bawah.
            </Text>
          </View>
        )}

        <View style={{ marginTop: 6 }}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Username</Text>
            <TextInput
              style={[styles.input, { color: palette.secondary }]}
              value={username}
              editable={false}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Nama usaha (opsional)</Text>
            <TextInput
              style={styles.input}
              value={namaUsaha}
              onChangeText={setNamaUsaha}
              editable={!menyimpan}
              placeholder="Isi nama usaha Anda"
              placeholderTextColor={palette.placeholder}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={[styles.input, errEmail !== '' && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              editable={!menyimpan}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errEmail !== '' && <Text style={styles.fieldError}>{errEmail}</Text>}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Nomor telepon (opsional)</Text>
            <TextInput
              style={[styles.input, errTelp !== '' && styles.inputError]}
              value={noTelp}
              onChangeText={setNoTelp}
              editable={!menyimpan}
              keyboardType="phone-pad"
              placeholder="Contoh: 0812 3456 7890"
              placeholderTextColor={palette.placeholder}
            />
            {errTelp !== '' && <Text style={styles.fieldError}>{errTelp}</Text>}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={menyimpan}
          onPress={() => {
            // TODO #18: arahkan ke layar Reset Password setelah issue itu selesai
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 14,
            borderRadius: 12,
            backgroundColor: palette.white,
            borderWidth: 1,
            borderColor: palette.border,
          }}
        >
          <Text style={{ color: palette.navy, fontWeight: '700' }}>Ubah password</Text>
          <Text style={{ color: palette.navy, fontSize: 20 }}>›</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={menyimpan}
          onPress={getProfileInput}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 14,
            borderRadius: 12,
            backgroundColor: menyimpan ? palette.disabled : palette.green,
          }}
        >
          {menyimpan && (
            <ActivityIndicator color={palette.disabledText} style={{ marginRight: 8 }} />
          )}
          <Text
            style={{
              fontWeight: '700',
              color: menyimpan ? palette.disabledText : palette.white,
            }}
          >
            {menyimpan ? 'Menyimpan perubahan...' : 'Simpan perubahan'}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={menyimpan}
          onPress={() => setDialogLogout(true)}
          style={{
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
            backgroundColor: palette.white,
            borderWidth: 1,
            borderColor: palette.error,
            opacity: menyimpan ? 0.5 : 1,
          }}
        >
          <Text style={{ color: palette.error, fontWeight: '700' }}>Logout</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={dialogLogout}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!keluar) setDialogLogout(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            padding: 24,
            backgroundColor: 'rgba(23, 39, 80, 0.45)',
          }}
        >
          <View style={{ padding: 18, borderRadius: 18, backgroundColor: palette.white, gap: 10 }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: palette.navy }}>
              Keluar dari akun?
            </Text>
            <Text style={{ fontSize: 13, lineHeight: 19, color: palette.secondary }}>
              Anda perlu masuk lagi untuk mengelola {namaTampil}. Perubahan yang belum disimpan
              tidak akan diterapkan.
            </Text>

            <Pressable
              accessibilityRole="button"
              disabled={keluar}
              onPress={() => setDialogLogout(false)}
              style={{
                padding: 12,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: palette.white,
                borderWidth: 1,
                borderColor: palette.border,
              }}
            >
              <Text style={{ color: palette.navy, fontWeight: '700' }}>Batal</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={keluar}
              onPress={konfirmasiLogout}
              style={{
                padding: 12,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: palette.white,
                borderWidth: 1,
                borderColor: palette.error,
                opacity: keluar ? 0.5 : 1,
              }}
            >
              <Text style={{ color: palette.error, fontWeight: '700' }}>
                {keluar ? 'Keluar...' : 'Keluar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}