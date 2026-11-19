const path = require('path');
module.exports = {
  rootDir: path.resolve(__dirname, '../../../..'),
  testMatch: ['<rootDir>/docs/M10/assets/bukti/modul-b.test.js'],
  collectCoverage: true,
  collectCoverageFrom: ['src/controllers/BarangController.js','src/services/ListingService.js','src/models/ListingPenjual.js','src/models/Barang.js','src/models/FotoBarang.js','src/models/ReferensiListing.js','src/views/js/FormulirBarang.js','src/views/js/HalamanListingPenjual.js'],
  coverageDirectory: path.join(require('os').tmpdir(), 'hiupl-modul-b-coverage'),
  coverageReporters: ['text','json-summary'],
};
