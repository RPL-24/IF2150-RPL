/**
 * I-01 Login. Pemilik: P1.
 * CONTOH LAYAR YANG SUDAH JADI: pola state form -> panggil API lewat context -> tangani error.
 *
 * O-0101 tab peran (Masyarakat/Petugas) hanya membantu tampilan; tujuan setelah login
 * ditentukan peran akun dari server (lihat GerbangPeran di _layout.js).
 * O-0103 Google Sign-In (SKPL 2.4) = tugas stretch P1, tombol tampil nonaktif bila belum dikonfigurasi.
 */
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { Isian, Kartu, Layar, Tombol } from '../components/ui';
import { huruf, jarak, radius, warna } from '../theme/tokens';

const TAB = [
  { kunci: 'masyarakat', label: 'Masyarakat', ikon: 'person-outline' },
  { kunci: 'petugas', label: 'Petugas', ikon: 'shield-checkmark-outline' },
];
const googleAktif = Boolean(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);

export default function Login() {
  const { masuk } = useAuth();
  const [tab, setTab] = useState('masyarakat');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lihatSandi, setLihatSandi] = useState(false);
  const [memuat, setMemuat] = useState(false);
  const [error, setError] = useState('');

  const lengkap = email.trim() !== '' && password !== '';

  async function kirim() {
    setError('');
    setMemuat(true);
    try {
      await masuk(email.trim(), password);
    } catch (err) {
      setError(err.message);
    } finally {
      setMemuat(false);
    }
  }

  return (
    <Layar tepi={['top', 'bottom']}>
      <View style={s.kepala}>
        <Image source={require('../../assets/logo.jpeg')} style={s.logo} />
        <View>
          <Text style={s.merek}>SILEMBUR</Text>
          <Text style={huruf.label}>PORTAL LAYANAN PUBLIK</Text>
        </View>
      </View>

      <Kartu>
        <View style={s.tabWadah}>
          {TAB.map((t) => {
            const aktif = tab === t.kunci;
            return (
              <Pressable key={t.kunci} onPress={() => setTab(t.kunci)} style={[s.tab, aktif && s.tabAktif]}>
                <Ionicons name={t.ikon} size={18} color={aktif ? warna.putih : warna.teksLembut} />
                <Text style={[s.tabTeks, aktif && { color: warna.putih }]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Isian
          label="Email"
          placeholder={tab === 'masyarakat' ? 'contoh@gmail.com' : 'petugas@instansi.go.id'}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
        <View>
          <Isian
            label="Kata Sandi"
            placeholder="Masukkan kata sandi akun"
            secureTextEntry={!lihatSandi}
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={lengkap ? kirim : undefined}
          />
          <Pressable style={s.mata} onPress={() => setLihatSandi((v) => !v)} hitSlop={10}>
            <Ionicons name={lihatSandi ? 'eye-off-outline' : 'eye-outline'} size={20} color={warna.teksLembut} />
          </Pressable>
        </View>

        {error ? <Text style={s.error}>{error}</Text> : null}
        <Tombol judul="Masuk" ikon="log-in-outline" onPress={kirim} nonaktif={!lengkap} memuat={memuat} />

        {tab === 'masyarakat' ? (
          <Tombol
            judul={googleAktif ? 'Masuk dengan Google' : 'Masuk dengan Google (belum dikonfigurasi)'}
            ikon="logo-google"
            varian="sekunder"
            nonaktif={!googleAktif}
            style={{ marginTop: jarak.m }}
            onPress={() => {}}
          />
        ) : null}
      </Kartu>

      {__DEV__ ? (
        <Kartu style={{ backgroundColor: warna.permukaanLembut }}>
          <Text style={huruf.label}>AKUN UJI (kata sandi: silembur123)</Text>
          <Text style={huruf.kecil}>warga1@silembur.test · admin@silembur.test · pemda@silembur.test</Text>
        </Kartu>
      ) : null}
    </Layar>
  );
}

const s = StyleSheet.create({
  kepala: { flexDirection: 'row', alignItems: 'center', marginBottom: jarak.xl, marginTop: jarak.s },
  logo: { width: 56, height: 56, borderRadius: radius.s, marginRight: jarak.m },
  merek: { fontSize: 24, fontWeight: '800', color: warna.primer },
  tabWadah: {
    flexDirection: 'row',
    backgroundColor: warna.permukaanLembut,
    borderRadius: radius.m,
    padding: jarak.xs,
    marginBottom: jarak.xl,
  },
  tab: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: radius.s },
  tabAktif: { backgroundColor: warna.primer },
  tabTeks: { fontWeight: '700', color: warna.teksLembut },
  mata: { position: 'absolute', right: jarak.l, top: 38 },
  error: { color: warna.bahaya, marginBottom: jarak.m },
});
