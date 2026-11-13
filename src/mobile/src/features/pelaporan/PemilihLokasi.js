/**
 * I-04 O-0403 Peta lokasi kerusakan (KF03). Pemilik: P2.
 * - Formulir BARU (belum ada lokasi) dan izin lokasi SUDAH diberikan: lokasi GPS diisi otomatis saat layar
 *   dibuka (KF03 "mengambil data lokasi laporan secara otomatis"). Tidak pernah memunculkan permintaan izin,
 *   dan tidak berjalan di mode revisi (lokasi lama sudah terisi) maupun bila pengguna sudah memilih titik.
 * - "Gunakan Lokasi Saya": GPS lewat expo-location -> sumber GPS. Dibatasi ~8 detik; lewat batas itu dipakai
 *   lokasi terakhir yang diketahui, dan bila tidak ada, pengguna diarahkan ke pin manual.
 * - Izin ditolak / GPS mati / pengguna ingin mengoreksi: ketuk atau geser pin di peta -> sumber MANUAL.
 * Wilayah (kecamatan) & alamat ditentukan server dari koordinat (Algo-006).
 */
import { Ionicons } from '@expo/vector-icons';
import { SUMBER_LOKASI } from '@silembur/shared';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PetaPilih } from '../../components/map/Peta';
import { Tombol } from '../../components/ui';
import { huruf, jarak, radius, warna } from '../../theme/tokens';

const PESAN_MANUAL = 'Ketuk peta atau geser pin untuk menandai lokasi kerusakan.';
const BATAS_GPS_MS = 8000;

/** Ambil posisi GPS dengan batas waktu; lewat batas -> lokasi terakhir yang diketahui (bisa null). */
async function ambilPosisi() {
  let timer;
  const batas = new Promise((resolve) => {
    timer = setTimeout(() => resolve(null), BATAS_GPS_MS);
  });
  try {
    const posisi = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
      batas,
    ]);
    if (posisi) return posisi;
  } finally {
    clearTimeout(timer);
  }
  return Location.getLastKnownPositionAsync();
}

/**
 * @param {{ nilai: { latitude: number, longitude: number } | null, sumber: 'GPS'|'MANUAL',
 *           onUbah: (koordinat: { latitude: number, longitude: number }, sumber: 'GPS'|'MANUAL') => void,
 *           nonaktif?: boolean, isiOtomatis?: boolean }} props
 *   isiOtomatis: false mematikan pengisian GPS otomatis (mis. mode revisi). Pengisian otomatis juga hanya
 *   berjalan bila `nilai` masih kosong saat komponen dipasang.
 */
export default function PemilihLokasi({ nilai, sumber, onUbah, nonaktif, isiOtomatis = true }) {
  const [mencari, setMencari] = useState(false);
  const [pesan, setPesan] = useState('');
  // PetaPilih memakai initialRegion: dipasang ulang agar peta berpindah ke titik GPS.
  const [versiPeta, setVersiPeta] = useState(0);
  // Nilai terbaru untuk pemeriksaan setelah await (hasil GPS otomatis tidak boleh menimpa pilihan pengguna).
  const nilaiRef = useRef(nilai);
  nilaiRef.current = nilai;
  const onUbahRef = useRef(onUbah);
  onUbahRef.current = onUbah;
  const disentuhPengguna = useRef(false);

  function terapkanPosisi(posisi) {
    onUbahRef.current({ latitude: posisi.coords.latitude, longitude: posisi.coords.longitude }, SUMBER_LOKASI.GPS);
    setVersiPeta((v) => v + 1);
  }

  // KF03: isi otomatis hanya untuk formulir baru, hanya bila izin sudah ada (tanpa memunculkan dialog izin).
  useEffect(() => {
    if (!isiOtomatis || nilaiRef.current || nonaktif) return undefined;
    let aktif = true;
    (async () => {
      try {
        const izin = await Location.getForegroundPermissionsAsync();
        if (!aktif || !izin.granted || !(await Location.hasServicesEnabledAsync())) return;
        if (!aktif || disentuhPengguna.current || nilaiRef.current) return;
        setMencari(true);
        const posisi = await ambilPosisi();
        if (aktif && posisi && !disentuhPengguna.current && !nilaiRef.current) terapkanPosisi(posisi);
      } catch {
        // Diam: pengguna tetap bisa menekan "Gunakan Lokasi Saya" atau memilih titik di peta.
      } finally {
        if (aktif) setMencari(false);
      }
    })();
    return () => {
      aktif = false;
    };
    // Hanya sekali saat dipasang (formulir baru dipasang ulang lewat `key` setelah terkirim).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function gunakanLokasiSaya() {
    disentuhPengguna.current = true;
    setMencari(true);
    setPesan('');
    try {
      const izin = await Location.requestForegroundPermissionsAsync();
      if (!izin.granted) {
        setPesan(`Izin lokasi ditolak. ${PESAN_MANUAL}`);
        return;
      }
      if (!(await Location.hasServicesEnabledAsync())) {
        setPesan(`GPS tidak aktif. ${PESAN_MANUAL}`);
        return;
      }
      const posisi = await ambilPosisi();
      if (!posisi) {
        setPesan(`Lokasi GPS tidak dapat dibaca. ${PESAN_MANUAL}`);
        return;
      }
      terapkanPosisi(posisi);
    } catch {
      setPesan(`Lokasi GPS tidak dapat dibaca. ${PESAN_MANUAL}`);
    } finally {
      setMencari(false);
    }
  }

  return (
    <View>
      <Tombol
        judul="Gunakan Lokasi Saya"
        ikon="locate"
        varian="sekunder"
        memuat={mencari}
        nonaktif={nonaktif}
        onPress={gunakanLokasiSaya}
        style={{ marginBottom: jarak.m }}
      />
      {pesan ? (
        <View style={s.peringatan}>
          <Ionicons name="alert-circle-outline" size={18} color={warna.peringatan} />
          <Text style={s.peringatanTeks}>{pesan}</Text>
        </View>
      ) : null}
      <View pointerEvents={nonaktif ? 'none' : 'auto'}>
        <PetaPilih
          key={versiPeta}
          nilai={nilai}
          onUbah={(koordinat) => {
            disentuhPengguna.current = true;
            onUbah(koordinat, SUMBER_LOKASI.MANUAL);
          }}
        />
      </View>
      <Text style={[huruf.kecil, { marginTop: jarak.s }]}>
        {nilai
          ? `${nilai.latitude.toFixed(6)}, ${nilai.longitude.toFixed(6)} · ${
              sumber === SUMBER_LOKASI.GPS ? 'dari GPS' : 'dipilih di peta'
            }. Wilayah ditentukan otomatis dari titik ini.`
          : `Belum ada lokasi. Tekan "Gunakan Lokasi Saya" atau ${PESAN_MANUAL.charAt(0).toLowerCase()}${PESAN_MANUAL.slice(1)}`}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  peringatan: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: jarak.s,
    backgroundColor: warna.peringatanMuda,
    padding: jarak.m,
    borderRadius: radius.s,
    marginBottom: jarak.m,
  },
  peringatanTeks: { flex: 1, color: warna.peringatan, fontSize: 13 },
});
