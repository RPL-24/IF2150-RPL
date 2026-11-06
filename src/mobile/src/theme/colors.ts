/**
 * Sehati colour tokens, taken from the Figma prototype
 * (https://www.figma.com/design/OqbMU5rHz4uQwCNpkvndPY, page "Komponen").
 * The app is light-only (`userInterfaceStyle: "light"` in app.json), so these
 * are fixed brand values rather than platform semantic colours.
 */
export const warna = {
  /** Brand red: primary buttons, active tab, highlights. */
  merah: '#E10A1E',
  /** Pale red: selected chips, soft highlights. */
  merahLembut: '#FDECEE',
  /** Charcoal: dark surfaces such as the admin app bar. */
  arang: '#3A3A3C',

  /** Main text. */
  teks: '#1F1F23',
  /** Secondary text: captions, placeholders, inactive tabs. */
  teksSekunder: '#6B6B73',
  /** Text and icons on red or charcoal surfaces. */
  inversi: '#FFFFFF',

  /** Screen background. */
  latar: '#FAF7F5',
  /** Card and input background. */
  kartu: '#FFFFFF',
  /** Borders and dividers (1px). */
  garis: '#E8E3E0',

  sukses: '#1E8E5A',
  suksesLembut: '#E6F4EC',
  info: '#2563EB',
  infoLembut: '#EAF1FD',
  peringatan: '#B45309',
  peringatanLembut: '#FEF3E2',
  /** Errors use the brand red on the pale red background. */
  galat: '#E10A1E',
  galatLembut: '#FDECEE',
} as const;

export type Warna = keyof typeof warna;
