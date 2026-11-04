import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { supabase } from '../services/supabase';
import { AuthController } from '../controllers/AuthController';
import { styles } from './styles';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const auth = new AuthController();
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomePage({ navigation }: Props) {
  const [username, setUsername] = useState('...');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        if (active) setError('Session pengguna tidak ditemukan');
        return;
      }

      const { data, error: profileError } = await supabase
        .from('tbl_pemilik_usaha')
        .select('username')
        .eq('id', userData.user.id)
        .single();

      if (active) {
        if (profileError) setError(profileError.message);
        else setUsername(data.username);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  async function logout() {
    try {
      await auth.logout();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal logout');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat datang, {username}!</Text>
      <Text>Halaman utama Pross (placeholder untuk integrasi fitur anggota lain).</Text>
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <Button title="Logout" onPress={logout} />
      <Button title="+ Tambah Produk" onPress={() => navigation.navigate('AddProduct')} />
    </View>
  );
}