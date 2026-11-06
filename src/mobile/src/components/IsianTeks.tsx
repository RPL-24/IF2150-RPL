import { useState } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

import { jarak, sudut, teks, ukuran, warna } from '@/theme';

import { Teks } from './Teks';

export type IsianTeksProps = Omit<TextInputProps, 'style'> & {
  /** Field label shown above the input. */
  label?: string;
  /** Helper text under the input. Replaced by `galat` when there is an error. */
  keterangan?: string;
  /** Validation message. Turns the border red and is announced to screen readers. */
  galat?: string;
  style?: StyleProp<ViewStyle>;
};

/** Single-line text field from the Figma component set. */
export function IsianTeks({ label, keterangan, galat, style, multiline, onFocus, onBlur, ...props }: IsianTeksProps) {
  const [fokus, setFokus] = useState(false);
  const pesanBawah = galat ?? keterangan;
  return (
    <View style={[styles.wadah, style]}>
      {label && <Teks gaya="label">{label}</Teks>}
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={warna.teksSekunder}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        onFocus={(e) => {
          setFokus(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFokus(false);
          onBlur?.(e);
        }}
        style={[
          styles.isian,
          multiline && styles.banyakBaris,
          fokus && { borderColor: warna.merah },
          galat !== undefined && { borderColor: warna.galat },
        ]}
        {...props}
      />
      {pesanBawah && (
        <Teks
          gaya="keterangan"
          warna={galat ? 'galat' : 'teksSekunder'}
          accessibilityLiveRegion={galat ? 'polite' : undefined}
        >
          {pesanBawah}
        </Teks>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: { gap: jarak.xxs },
  isian: {
    ...teks.isi,
    minHeight: ukuran.tinggiKontrol,
    paddingHorizontal: jarak.md,
    backgroundColor: warna.kartu,
    borderColor: warna.garis,
    borderWidth: ukuran.garis,
    borderRadius: sudut.md,
    borderCurve: 'continuous',
  },
  banyakBaris: { minHeight: 120, paddingTop: jarak.sm, paddingBottom: jarak.sm },
});
