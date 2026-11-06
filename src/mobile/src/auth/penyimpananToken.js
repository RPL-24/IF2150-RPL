/**
 * Penyimpanan token login di HP (Android/iOS): SecureStore (terenkripsi).
 * Versi browser ada di penyimpananToken.web.js (dipilih otomatis oleh Expo). Pemilik: P1.
 */
import * as SecureStore from 'expo-secure-store';

export const ambilToken = (kunci) => SecureStore.getItemAsync(kunci);
export const simpanToken = (kunci, nilai) => SecureStore.setItemAsync(kunci, nilai);
export const hapusToken = (kunci) => SecureStore.deleteItemAsync(kunci);
