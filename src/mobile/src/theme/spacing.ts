/** Spacing scale on a 4-point grid. Screen edge padding is `jarak.md`. */
export const jarak = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

/** Corner radii from the Figma prototype. */
export const sudut = {
  /** Small elements such as icon buttons. */
  sm: 8,
  /** Buttons and text fields. */
  md: 12,
  /** Cards and banners. */
  lg: 16,
  /** Chips and badges (capsule). */
  penuh: 9999,
} as const;

/** Fixed component sizes from the Figma prototype. */
export const ukuran = {
  /** Height of Tombol and single-line IsianTeks. */
  tinggiKontrol: 48,
  /** Height of the Mahasiswa tab bar, without the bottom safe area. */
  tinggiTabBar: 76,
  /** Hairline border width for cards and inputs. */
  garis: 1,
} as const;
