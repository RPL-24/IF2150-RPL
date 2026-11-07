const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * Mengambil kunci enkripsi 32-byte (256-bit) dari environment variable AES_SECRET_KEY.
 * Jika panjang kunci tidak tepat 32 byte, dilakukan derivasi SHA-256 agar selalu valid 256-bit.
 */
function getSecretKey() {
  const rawKey = process.env.AES_SECRET_KEY;
  if (!rawKey) {
    throw new Error('AES_SECRET_KEY belum diatur pada file .env.');
  }
  return crypto.createHash('sha256').update(String(rawKey)).digest();
}

/**
 * Mengenkripsi teks menggunakan AES-256-CBC (Memenuhi KNF01).
 * Format keluaran: "<iv_hex>:<ciphertext_hex>"
 * @param {string|null} plainText
 * @returns {string|null}
 */
function encryptAES256(plainText) {
  if (plainText === null || plainText === undefined) {
    return null;
  }
  const text = String(plainText).trim();
  if (text === '') {
    return null;
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Mendekripsi ciphertext AES-256-CBC kembali ke plainText.
 * @param {string|null} cipherText
 * @returns {string|null}
 */
function decryptAES256(cipherText) {
  if (!cipherText || typeof cipherText !== 'string') {
    return null;
  }
  const parts = cipherText.split(':');
  if (parts.length !== 2) {
    // Jika data belum terenkripsi (misal data teks biasa), kembalikan apa adanya
    return cipherText;
  }

  try {
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, getSecretKey(), iv);
    let decrypted = decipher.update(encryptedText, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return '[Data Terenkripsi]';
  }
}

module.exports = {
  encryptAES256,
  decryptAES256,
};

