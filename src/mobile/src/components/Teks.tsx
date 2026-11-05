import { Text, type TextProps } from 'react-native';

import { teks, warna, type GayaTeks, type Warna } from '@/theme';

type Props = TextProps & {
  /** Text style from the Figma prototype. Defaults to `isi` (body). */
  gaya?: GayaTeks;
  /** Colour token, when the text should not use the style's default colour. */
  warna?: Warna;
};

/** Text that always uses a theme text style, so screens never set font sizes. */
export function Teks({ gaya = 'isi', warna: w, style, ...props }: Props) {
  return <Text style={[teks[gaya], w && { color: warna[w] }, style]} {...props} />;
}
