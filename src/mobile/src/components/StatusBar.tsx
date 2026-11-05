import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

type Props = {
  /** `gelap` = dark icons for light screens (default); `terang` = light icons for the charcoal admin bar. */
  isi?: 'gelap' | 'terang';
};

/** System status bar (clock, battery) styled for Sehati's light screens. */
export function StatusBar({ isi = 'gelap' }: Props) {
  return <ExpoStatusBar style={isi === 'gelap' ? 'dark' : 'light'} />;
}
