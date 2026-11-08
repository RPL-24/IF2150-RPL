const { encryptAES256, decryptAES256 } = require('../utils/encryption');
const { parseCoordinates, calculateDistanceKm } = require('../utils/distance');
const { generateToken } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

describe('Pondasi Utilitas MahaSehat (KNF01, Algo-C02-03, Algo-C20-03)', () => {
  test('Enkripsi dan Dekripsi AES-256 mengembalikan teks jurnal asli dengan benar (KNF01)', () => {
    const plainJournal = 'Hari ini saya merasa cemas karena banyak ujian minggu depan.';
    const encrypted = encryptAES256(plainJournal);

    expect(encrypted).not.toBe(plainJournal);
    expect(encrypted).toContain(':');

    const decrypted = decryptAES256(encrypted);
    expect(decrypted).toBe(plainJournal);
  });

  test('Enkripsi AES-256 mengembalikan null jika input kosong atau null', () => {
    expect(encryptAES256(null)).toBeNull();
    expect(encryptAES256('   ')).toBeNull();
  });

  test('Validasi koordinat menerima format lat,lng yang sah dan menolak nilai di luar rentang (Algo-C02-03)', () => {
    expect(parseCoordinates('-6.8915,107.6107')).toEqual({ lat: -6.8915, lng: 107.6107 });
    expect(parseCoordinates('95.0,107.6107')).toBeNull(); // lat > 90
    expect(parseCoordinates('-6.8915,190.0')).toBeNull(); // lng > 180
    expect(parseCoordinates('bukan-koordinat')).toBeNull();
  });

  test('Kalkulasi jarak Haversine menghitung jarak fasilitas kesehatan dengan akurat (Algo-C20-03)', () => {
    const userLoc = '-6.8915,107.6107'; // ITB Ganesha
    const faskesSame = '-6.8915,107.6107';
    const faskesBorromeus = '-6.8942,107.6135';

    expect(calculateDistanceKm(userLoc, faskesSame)).toBe(0);
    const dist = calculateDistanceKm(userLoc, faskesBorromeus);
    expect(dist).toBeGreaterThan(0.3);
    expect(dist).toBeLessThan(1.0);
    expect(calculateDistanceKm(null, faskesBorromeus)).toBe(-1.0);
  });

  test('JWT generateToken menghasilkan token sesi yang memuat informasi pengguna dan role', () => {
    const token = generateToken({
      idPengguna: 1,
      email: 'budi.pelajar@mahasehat.id',
      role: 'Pelajar',
      idProfil: 'PLJ-001',
    });
    expect(typeof token).toBe('string');
    const decoded = jwt.decode(token);
    expect(decoded.role).toBe('Pelajar');
    expect(decoded.idProfil).toBe('PLJ-001');
  });
});

