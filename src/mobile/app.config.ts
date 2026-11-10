import { existsSync } from 'node:fs';
import { join } from 'node:path';

import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Extends `app.json` with values that must not be committed.
 *
 * `google-services.json` (Firebase, needed for Android push) contains an API key, so it
 * is kept out of git (M9 A.3). EAS builds get it from the secret file variable
 * `GOOGLE_SERVICES_JSON`; local builds use a `google-services.json` placed in this folder
 * (download it from the Firebase console, project `sehati-75469`).
 *
 * Without either, the file is left out instead of failing the build: the app still works,
 * it just cannot get a push token on Android (`daftarkanPerangkatIni` skips quietly).
 */
function berkasGoogleServices(projectRoot: string): string | undefined {
  if (process.env.GOOGLE_SERVICES_JSON) return process.env.GOOGLE_SERVICES_JSON;
  return existsSync(join(projectRoot, 'google-services.json')) ? './google-services.json' : undefined;
}

export default ({ config, projectRoot }: ConfigContext): ExpoConfig => {
  const googleServicesFile = berkasGoogleServices(projectRoot);
  return {
    ...(config as ExpoConfig),
    android: {
      ...config.android,
      ...(googleServicesFile && { googleServicesFile }),
    },
  };
};
