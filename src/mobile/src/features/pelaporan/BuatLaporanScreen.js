/**
 * I-04 Buat Laporan — UC01 (KF01-KF04) + mode revisi (gap G7). Pemilik: P2.
 * Spesifikasi objek antarmuka: docs/M8/K02_G03_DPPL2.md (BAB 6, Tabel 6.4). Tugas: src/docs/tasks/P2.md
 *
 * Route:
 *  - /warga/lapor        -> buat laporan baru (POST /laporan)
 *  - /warga/revisi/[id]  -> komponen yang sama, isian diisi dari laporan lama (PUT /laporan/:id/revisi)
 *
 * Tombol Kirim terkunci sampai foto, kategori, lokasi, dan deskripsi lengkap (UC01 langkah 2, alternatif 1).
 * Pemeriksaan ini hanya untuk UX; server tetap memvalidasi (validasiIsianFormulir, Algo-004).
 */
import { Ionicons } from '@expo/vector-icons';
import { ATURAN, SEMUA_KATEGORI, STATUS, SUMBER_LOKASI } from '@silembur/shared';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { urlLengkap } from '../../api/client';
import { laporanApi } from '../../api/laporan';
import { wargaApi } from '../../api/warga';
import { Isian, Kartu, Layar, TampilanGagal, TampilanKosong, TampilanMemuat, Tombol } from '../../components/ui';
import { useApi } from '../../hooks/useApi';
import { huruf, jarak, radius, warna } from '../../theme/tokens';
import { kodeLaporan } from '../../utils/format';
import PemilihFoto from './PemilihFoto';
import PemilihKategori from './PemilihKategori';
import PemilihLokasi from './PemilihLokasi';

const TEKS_BANTU = 'Lengkapi foto, kategori, lokasi, dan deskripsi untuk melanjutkan';

const ISIAN_KOSONG = {
  foto: null, // asset expo-image-picker { uri, mimeType, fileName } atau { uri, lama: true } (foto tersimpan)
  kategori: null,
  lokasi: null, // { latitude, longitude }
  sumberLokasi: SUMBER_LOKASI.GPS,
  lokasiDiubah: false,
  deskripsi: '',
};

/** Isian awal mode revisi dari DTO LaporanSaya. */
function isianDariLaporan(l) {
  return {
    foto: l.foto ? { uri: urlLengkap(l.foto), lama: true } : null,
    kategori: SEMUA_KATEGORI.includes(l.kategori) ? l.kategori : null,
    lokasi: l.lokasi ? { latitude: l.lokasi.latitude, longitude: l.lokasi.longitude } : null,
    sumberLokasi: SUMBER_LOKASI.GPS,
    lokasiDiubah: false,
    deskripsi: l.deskripsi ?? '',
  };
}

export default function BuatLaporanScreen() {
  const { id } = useLocalSearchParams();
  const idRevisi = Array.isArray(id) ? id[0] : id;
  const modeRevisi = Boolean(idRevisi);

  const muatan = useApi(() => (modeRevisi ? wargaApi.detailSaya(idRevisi) : Promise.resolve(null)), [idRevisi]);
  const laporanLama = muatan.data?.laporan ?? null;

  if (!modeRevisi) return <FormLaporan />;
  if (muatan.memuat) return <TampilanMemuat />;
  if (muatan.error) {
    return (
      <Layar tepi={[]}>
        <TampilanGagal pesan={muatan.error.message} onCobaLagi={muatan.muatUlang} />
      </Layar>
    );
  }
  if (!laporanLama) {
    return (
      <Layar tepi={[]}>
        <TampilanKosong pesan="Laporan tidak ditemukan" />
      </Layar>
    );
  }
  if (laporanLama.status !== STATUS.PERLU_REVISI) {
    return (
      <Layar tepi={[]}>
        <TampilanKosong
          ikon="lock-closed-outline"
          pesan={`Laporan ${kodeLaporan(laporanLama.id)} berstatus "${laporanLama.status}". Revisi hanya untuk laporan berstatus "${STATUS.PERLU_REVISI}".`}
        />
      </Layar>
    );
  }
  return <FormLaporan key={laporanLama.id} laporanLama={laporanLama} />;
}

/** Formulir I-04. Tanpa `laporanLama` = buat baru; dengan `laporanLama` = mode revisi. */
function FormLaporan({ laporanLama = null }) {
  const router = useRouter();
  const modeRevisi = Boolean(laporanLama);
  const [isian, setIsian] = useState(() => (laporanLama ? isianDariLaporan(laporanLama) : ISIAN_KOSONG));
  const [versiForm, setVersiForm] = useState(0); // dinaikkan saat form dikosongkan agar peta ikut kembali awal
  const [mengirim, setMengirim] = useState(false);
  const [error, setError] = useState(null);

  // Tab "Lapor" tetap terpasang: kosongkan pesan error lama saat isian berubah.
  useEffect(() => {
    if (error) setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isian]);

  const ubah = (bagian) => setIsian((i) => ({ ...i, ...bagian }));

  const deskripsiBersih = isian.deskripsi.trim();
  // O-0405: validasiIsianFormulir() di sisi tampilan, hanya untuk membuka kunci tombol.
  const lengkap = Boolean(
    isian.foto && isian.kategori && isian.lokasi && deskripsiBersih && deskripsiBersih.length <= ATURAN.BATAS_DESKRIPSI,
  );

  async function kirim() {
    if (!lengkap || mengirim) return;
    setMengirim(true);
    setError(null);
    try {
      let hasil;
      if (modeRevisi) {
        hasil = await laporanApi.revisi(laporanLama.id, {
          foto: isian.foto.lama ? undefined : isian.foto,
          kategori: isian.kategori,
          deskripsi: deskripsiBersih,
          ...(isian.lokasiDiubah
            ? { latitude: isian.lokasi.latitude, longitude: isian.lokasi.longitude, sumberLokasi: isian.sumberLokasi }
            : {}),
        });
        router.replace(`/warga/laporan/${hasil.laporan.id}?mode=saya`);
      } else {
        hasil = await laporanApi.buat({
          foto: isian.foto,
          kategori: isian.kategori,
          deskripsi: deskripsiBersih,
          latitude: isian.lokasi.latitude,
          longitude: isian.lokasi.longitude,
          sumberLokasi: isian.sumberLokasi,
        });
        // Tab "Lapor" tetap ada di bawah detail: kosongkan form untuk laporan berikutnya.
        setIsian(ISIAN_KOSONG);
        setVersiForm((v) => v + 1);
        router.push(`/warga/laporan/${hasil.laporan.id}?mode=saya`);
      }
    } catch (err) {
      setError(err);
    } finally {
      setMengirim(false);
    }
  }

  return (
    <Layar tepi={modeRevisi ? [] : ['top']}>
      {modeRevisi ? (
        <Kartu style={s.infoRevisi}>
          <Text style={huruf.subjudul}>Revisi {kodeLaporan(laporanLama.id)}</Text>
          {laporanLama.catatanVerifikasi?.catatan ? (
            <Text style={[huruf.isi, { marginTop: jarak.xs }]}>
              Catatan admin: {laporanLama.catatanVerifikasi.catatan}
            </Text>
          ) : null}
          <Text style={[huruf.kecil, { marginTop: jarak.xs }]}>
            Perbaiki bagian yang diminta, lalu kirim ulang untuk diverifikasi.
          </Text>
        </Kartu>
      ) : (
        <View style={{ marginBottom: jarak.l }}>
          <Text style={huruf.judul}>Buat Laporan</Text>
          <Text style={huruf.kecil}>Laporkan kerusakan fasilitas umum di Kota Bandung.</Text>
        </View>
      )}

      <Bagian judul="Foto Kerusakan">
        <PemilihFoto foto={isian.foto} onUbah={(foto) => ubah({ foto })} nonaktif={mengirim} />
      </Bagian>

      <Bagian judul="Kategori Kerusakan">
        <PemilihKategori nilai={isian.kategori} onUbah={(kategori) => ubah({ kategori })} nonaktif={mengirim} />
      </Bagian>

      <Bagian judul="Lokasi Kerusakan">
        <PemilihLokasi
          key={versiForm}
          nilai={isian.lokasi}
          sumber={isian.sumberLokasi}
          nonaktif={mengirim}
          onUbah={(lokasi, sumberLokasi) => ubah({ lokasi, sumberLokasi, lokasiDiubah: true })}
        />
      </Bagian>

      <Bagian judul="Deskripsi Kerusakan">
        <Isian
          placeholder="Jelaskan kerusakan, ukuran, dan patokan lokasi"
          value={isian.deskripsi}
          onChangeText={(deskripsi) => ubah({ deskripsi })}
          maxLength={ATURAN.BATAS_DESKRIPSI}
          multiline
          editable={!mengirim}
          style={s.deskripsi}
        />
        <Text style={[huruf.kecil, s.penghitung]}>
          {isian.deskripsi.length}/{ATURAN.BATAS_DESKRIPSI}
        </Text>
      </Bagian>

      {error ? (
        <View style={s.error}>
          <Ionicons name="alert-circle" size={18} color={warna.bahaya} />
          <View style={{ flex: 1 }}>
            <Text style={s.errorTeks}>{error.message}</Text>
            {(error.details ?? []).map((d) => (
              <Text key={`${d.field}-${d.pesan}`} style={s.errorDetail}>
                • {d.pesan}
              </Text>
            ))}
          </View>
        </View>
      ) : null}

      <Tombol
        judul={modeRevisi ? 'Kirim Revisi' : 'Kirim Laporan'}
        ikon="send"
        nonaktif={!lengkap}
        memuat={mengirim}
        onPress={kirim}
      />
      {!lengkap ? <Text style={[huruf.kecil, s.teksBantu]}>{TEKS_BANTU}</Text> : null}
    </Layar>
  );
}

function Bagian({ judul, children }) {
  return (
    <View style={s.bagian}>
      <Text style={s.judulBagian}>
        {judul}
        <Text style={{ color: warna.bahaya }}> *</Text>
      </Text>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  bagian: { marginBottom: jarak.xl },
  judulBagian: { ...huruf.subjudul, fontSize: 15, marginBottom: jarak.s },
  infoRevisi: { backgroundColor: warna.peringatanMuda, marginBottom: jarak.l },
  deskripsi: { minHeight: 110, textAlignVertical: 'top' },
  penghitung: { textAlign: 'right', marginTop: -jarak.m },
  teksBantu: { textAlign: 'center', marginTop: jarak.s },
  error: {
    flexDirection: 'row',
    gap: jarak.s,
    backgroundColor: warna.bahayaMuda,
    padding: jarak.m,
    borderRadius: radius.m,
    marginBottom: jarak.m,
  },
  errorTeks: { color: warna.bahaya, fontWeight: '600' },
  errorDetail: { color: warna.bahaya, fontSize: 13, marginTop: 2 },
});
