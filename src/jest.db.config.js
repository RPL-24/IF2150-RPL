// Konfigurasi test integrasi dengan komponen nyata (PostgreSQL dan Mailpit dari docker-compose.yml).
//   docker compose up -d
//   npm run test:db
module.exports = {
  testMatch: ['<rootDir>/tests/db/**/*.test.js'],
  globalSetup: '<rootDir>/tests/db/siapkanBasisData.js',
  setupFiles: ['<rootDir>/tests/db/lingkunganUji.js'],
  testTimeout: 30000,
};
