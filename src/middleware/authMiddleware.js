const jwt = require('jsonwebtoken');
const db = require('../config/db');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET belum diatur pada file .env.');
  }
  return secret;
}

/**
 * Membuat JWT token untuk sesi login pengguna (Algo-C11-09 / startSession).
 * @param {object} payload - { idPengguna, email, role, idProfil, versiToken }
 * @returns {string} token JWT
 */
function generateToken(payload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
}

function tolakSesi(res) {
  return res.status(401).json({
    success: false,
    message: 'Sesi telah berakhir atau token tidak valid. Silakan login kembali.',
  });
}

/**
 * Middleware untuk memeriksa token JWT pada header Authorization: Bearer <token>.
 * Versi token dan status akun dibandingkan dengan basis data agar token dari sesi yang
 * sudah logout, atau milik akun yang tidak lagi aktif, langsung ditolak (KNF12).
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Silakan masuk (login) terlebih dahulu.',
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(authHeader.split(' ')[1], getJwtSecret());
  } catch (err) {
    return tolakSesi(res);
  }

  try {
    const { rows } = await db.query(
      'SELECT versi_token, status_akun FROM pengguna WHERE id_pengguna = $1;',
      [decoded.idPengguna]
    );
    const akun = rows[0];
    if (!akun || akun.versi_token !== decoded.versiToken || akun.status_akun !== 'Aktif') {
      return tolakSesi(res);
    }
    req.user = decoded;
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Middleware pembatas hak akses berdasarkan peran (KNF02: Pelajar, OrangTuaWali, TenagaKesehatan).
 * @param  {...string} allowedRoles
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki hak akses untuk fitur ini.',
      });
    }
    return next();
  };
}

module.exports = {
  generateToken,
  authenticate,
  authorizeRoles,
};
