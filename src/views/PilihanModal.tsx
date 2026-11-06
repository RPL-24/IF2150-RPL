import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { palette } from './styles';

export type PilihanOpsi = {
  nilai: string;
  label: string;
  keterangan?: string;
  aksen?: boolean;
};

type Props = {
  visible: boolean;
  judul: string;
  opsi: PilihanOpsi[];
  onPilih: (nilai: string) => void;
  onTutup: () => void;
};

export default function PilihanModal({
  visible,
  judul,
  opsi,
  onPilih,
  onTutup,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onTutup}
    >
      <Pressable style={lokal.latar} onPress={onTutup}>
        <Pressable style={lokal.kartu} onPress={() => undefined}>
          <Text style={lokal.judul}>{judul}</Text>

          <ScrollView style={lokal.daftar}>
            {opsi.length === 0 && (
              <Text style={lokal.kosong}>Belum ada pilihan</Text>
            )}

            {opsi.map((item) => (
              <Pressable
                key={item.nilai}
                style={({ pressed }) => [
                  lokal.opsi,
                  pressed ? lokal.opsiDitekan : undefined,
                ]}
                onPress={() => onPilih(item.nilai)}
              >
                <Text style={[lokal.label, item.aksen && lokal.aksen]}>
                  {item.label}
                </Text>
                {item.keterangan !== undefined && (
                  <Text style={lokal.keterangan}>{item.keterangan}</Text>
                )}
              </Pressable>
            ))}
          </ScrollView>

          <Pressable onPress={onTutup}>
            <Text style={lokal.batal}>Batal</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const lokal = StyleSheet.create({
  latar: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(23, 39, 80, 0.45)',
  },
  kartu: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: palette.white,
  },
  judul: {
    marginBottom: 10,
    fontSize: 17,
    fontWeight: '800',
    color: palette.navy,
  },
  daftar: {
    maxHeight: 340,
  },
  kosong: {
    paddingVertical: 12,
    color: palette.secondary,
  },
  opsi: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  opsiDitekan: {
    backgroundColor: palette.background,
  },
  label: {
    fontSize: 15,
    color: palette.text,
  },
  aksen: {
    fontWeight: '700',
    color: palette.green,
  },
  keterangan: {
    marginTop: 2,
    fontSize: 12,
    color: palette.secondary,
  },
  batal: {
    marginTop: 14,
    textAlign: 'center',
    fontWeight: '700',
    color: palette.navy,
  },
});
