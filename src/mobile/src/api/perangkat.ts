/**
 * `AuthController.daftarkanPerangkat` (DPPL C-25, Algo-003).
 */
import { api } from './client';

/**
 * Stores the Expo push token on the current session. The backend also ends any
 * other session that was using this token (Q-033 then Q-034), so one device only
 * receives notifications for the account signed in on it.
 */
export async function daftarkanPerangkat(tokenPush: string): Promise<void> {
  await api.post('/api/auth/device', { tokenPush });
}
