const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mahasehat_default_jwt_secret_key_2026';

/**
 * Membuat JWT token untuk sesi login pengguna (Algo-C11-08 / startSession).
 * @param {object} payload - { idPengguna, email, role, idProfil }
 * @returns {string} token JWT
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
}

/**
 * Middleware untuk memeriksa token JWT pada header Authorization: Bearer <token>.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Silakan masuk (login) terlebih dahulu.',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Sesi telah berakhir atau token tidak valid. Silakan login kembali.',
    });
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

