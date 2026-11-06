/**
 * State of data loaded from the backend, so every card or screen handles the
 * same four cases: still loading, failed, loaded but empty, and loaded.
 * "Empty" is `{ status: 'siap', data: null }`.
 */
export type Muatan<T> =
  | { status: 'memuat' }
  | { status: 'galat'; pesan: string }
  | { status: 'siap'; data: T };
