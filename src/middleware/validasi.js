const { body } = require('express-validator');

exports.registrasiMasyarakat = [
    body('nama').trim().notEmpty().withMessage('nama lengkap wajib diisi'),
    body('username').trim().matches(/^[A-Za-z0-9_]{3,20}$/), //regex
    body('noHp').trim().matches(/^0?\d{8,13}$/),
    body('email').trim().isEmail(),
    body('kataSandi').isLength({ min: 6}),
    body('konfirmasi').custom((v, { req }) => v === req.body.kataSandi)
        .withMessage('Konfirmasi kata sandi tidak sama'),
];