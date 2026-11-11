/**
 * Device side of Algo-003 `daftarkanPerangkat`: asks for notification permission
 * and gets this device's Expo push token, which the backend uses to send
 * affirmations and reminders through the Expo Push API.
 */
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { daftarkanPerangkat } from '@/api/perangkat';

/**
 * Android channel the backend's pushes land in. Its messages carry no `channelId`,
 * and Expo then delivers them to the channel named "default".
 */
const KANAL_ANDROID = 'default';

/**
 * Whether this device can get an Expo push token at all. Checked before the
 * permission prompt, so nobody is asked for a permission that cannot be used.
 * - Expo Go on Android has no push support since SDK 53 (a development build is needed).
 * - Emulators and simulators are skipped: only some have push support (Android images
 *   with Google Play services, recent iOS simulators), and that cannot be checked
 *   from JavaScript. Push is tested on a physical device.
 */
export function pushDidukung(): boolean {
  const expoGoAndroid =
    Platform.OS === 'android' && Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
  return Device.isDevice && !expoGoAndroid;
}

/**
 * Returns the Expo push token, asking for permission first if it has not been
 * answered yet. Returns `null` when the user declines or the device has no push
 * support (`pushDidukung`).
 */
export async function ambilTokenPush(): Promise<string | null> {
  if (!pushDidukung()) return null;

  if (Platform.OS === 'android') {
    // Android 13+ shows the permission prompt only after a channel exists.
    await Notifications.setNotificationChannelAsync(KANAL_ANDROID, {
      name: 'Afirmasi dan pengingat',
      importance: AndroidImportance.HIGH,
    });
  }

  let izin = await Notifications.getPermissionsAsync();
  if (izin.status !== 'granted' && izin.canAskAgain) {
    izin = await Notifications.requestPermissionsAsync();
  }
  if (izin.status !== 'granted') return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
  return data;
}

/**
 * Algo-003 `daftarkanPerangkat`, run after every login: gets the push token and
 * stores it on the new session. It never throws, because a failure here must not
 * undo the login; the user simply gets no push notifications on this device.
 */
export async function daftarkanPerangkatIni(): Promise<void> {
  try {
    const token = await ambilTokenPush();
    if (token) await daftarkanPerangkat(token);
  } catch (e) {
    if (__DEV__) console.warn('Pendaftaran perangkat untuk notifikasi gagal:', e);
  }
}
