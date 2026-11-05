import type { TextStyle } from 'react-native';

import { warna } from './colors';
import { font } from './fonts';

/** Text styles from the Figma prototype (Plus Jakarta Sans, size/line height). */
export const teks = {
  /** H1: screen titles. ExtraBold 26/34. */
  h1: { fontFamily: font.extraBold, fontSize: 26, lineHeight: 34, color: warna.teks },
  /** H2: section titles. Bold 20/28. */
  h2: { fontFamily: font.bold, fontSize: 20, lineHeight: 28, color: warna.teks },
  /** H3: card titles. SemiBold 16/24. */
  h3: { fontFamily: font.semiBold, fontSize: 16, lineHeight: 24, color: warna.teks },
  /** Isi: body text. Regular 14/21. */
  isi: { fontFamily: font.regular, fontSize: 14, lineHeight: 21, color: warna.teks },
  /** Isi Tebal: emphasised body text. SemiBold 14/21. */
  isiTebal: { fontFamily: font.semiBold, fontSize: 14, lineHeight: 21, color: warna.teks },
  /** Keterangan: captions and helper text. Medium 12/16. */
  keterangan: { fontFamily: font.medium, fontSize: 12, lineHeight: 16, color: warna.teksSekunder },
  /** Label: buttons, tabs, field labels. SemiBold 13/18. */
  label: { fontFamily: font.semiBold, fontSize: 13, lineHeight: 18, color: warna.teks },
} as const satisfies Record<string, TextStyle>;

export type GayaTeks = keyof typeof teks;
