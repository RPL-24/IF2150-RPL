const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Endpoint status kesehatan server (Healthcheck - KNF05)
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'MahaSehat API Server',
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Helper untuk me-mount route modul secara aman (tidak error jika file teman belum di-merge)
function mountRouteIfAvailable(urlPath, routeFileName) {
  const fullPath = path.join(__dirname, routeFileName);
  if (fs.existsSync(fullPath)) {
    const moduleRouter = require(fullPath);
    router.use(urlPath, moduleRouter);
  }
}

// Daftar endpoint modul sesuai pembagian tugas MVC (UC01 - UC10)
mountRouteIfAvailable('/auth', 'authRoutes.js');
mountRouteIfAvailable('/check-in', 'checkInRoutes.js');
mountRouteIfAvailable('/reports', 'reportRoutes.js');
mountRouteIfAvailable('/tenaga-kesehatan', 'tenagaKesehatanRoutes.js');
mountRouteIfAvailable('/konsultasi', 'konsultasiRoutes.js');
mountRouteIfAvailable('/emergency', 'emergencyRoutes.js');

module.exports = router;