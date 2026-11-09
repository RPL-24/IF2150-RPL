import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Extends `app.json` with values that must not be committed.
 *
 * `google-services.json` (Firebase, needed for Android push) contains an API key, so it
 * is kept out of git (M9 A.3). EAS builds get it from the secret file variable
 * `GOOGLE_SERVICES_JSON`; local builds fall back to a `google-services.json` placed in
 * this folder (download it from the Firebase console, project `sehati-75469`).
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  android: {
    ...config.android,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
  },
});
