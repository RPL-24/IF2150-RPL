import { StyleSheet } from 'react-native';

import { jarak, sudut, ukuran, warna } from '@/theme';

/** Shared card frame for the Beranda cards. */
export const gayaKartu = StyleSheet.create({
  kartu: {
    gap: jarak.xs,
    padding: jarak.lg,
    backgroundColor: warna.kartu,
    borderColor: warna.garis,
    borderWidth: ukuran.garis,
    borderRadius: sudut.lg,
    borderCurve: 'continuous',
  },
  memuat: { minHeight: 96, alignItems: 'center', justifyContent: 'center' },
});
