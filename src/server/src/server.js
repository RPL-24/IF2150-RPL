/**
 * Titik masuk server. Listen di 0.0.0.0 agar HP (Expo Go) di jaringan yang sama bisa mengakses.
 * Pemilik: P1.
 */
import os from 'node:os';
import { buatApp } from './app.js';
import { config } from './config.js';

const app = buatApp();

app.listen(config.port, '0.0.0.0', () => {
  const ipLan = Object.values(os.networkInterfaces())
    .flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal)
    .map((i) => i.address);
  console.log(`SILEMBUR API berjalan di http://localhost:${config.port}/api`);
  for (const ip of ipLan) console.log(`  dari HP/emulator: http://${ip}:${config.port}/api`);
  console.log(`  penyimpanan foto: ${config.storageDriver}, peta/wilayah: ${config.googleMapsApiKey ? 'google' : 'offline'}`);
});
