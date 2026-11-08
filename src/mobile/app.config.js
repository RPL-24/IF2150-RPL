/**
 * Konfigurasi dinamis di atas app.json. Pemilik: P1.
 *
 * GOOGLE_MAPS_ANDROID_API_KEY (opsional, bukan EXPO_PUBLIC_): kunci Google Maps SDK for Android
 * untuk APK/development build. Expo Go sudah membawa kuncinya sendiri, jadi variabel ini hanya
 * dibutuhkan saat build (`eas build` atau `npx expo run:android`). iOS memakai Apple Maps bawaan.
 */
module.exports = ({ config }) => {
  const kunciMapsAndroid = process.env.GOOGLE_MAPS_ANDROID_API_KEY;
  if (!kunciMapsAndroid) return config;
  return {
    ...config,
    plugins: [...(config.plugins ?? []), ['react-native-maps', { androidGoogleMapsApiKey: kunciMapsAndroid }]],
  };
};
