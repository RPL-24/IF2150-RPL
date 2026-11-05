import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/** Root navigator: entry screen, the Mahasiswa tab group, and the Administrator stack. */
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(mahasiswa)" />
        <Stack.Screen name="admin" />
      </Stack>
    </>
  );
}
