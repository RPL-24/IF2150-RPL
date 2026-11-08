const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Masyarakat = require('../models/Masyarakat');
const Akun = require('../models/Akun');

exports.tampilMasyarakat = (req, res) =>
    res.render('auth/registrasi-masyarakat', { lama: {} });

exports.prosesMasyarakat = (req, res) => {
    const daftarError = validationResult(req).array().map(e => e.msg);
    const { nama, username, noHp, email, kataSandi } = req.body;

    if(!daftarError.length){
        if(Akun.cariByEmail(email)) daftarError.push('Email sudah terdaftar');
        if(Masyarakat.IsUsnAda(username)) daftarError.push('Username sudah dipakai');
    }

    if(daftarError.length){
        return res.status(400).render('auth/registarsi-masyarakat', {
            lama: req.body,
            error: daftarError,
        });
    }

    Masyarakat.buat({
        nama,
        username,
        noHp: '+62' + noHp.replace(/^0/, ''),
        email,
        sandiHash: bcrypt.hashSync(kataSandi, 10),
    });

    req.flash('sukses', 'Registrasi berhasil, silahkan melakukan login');
    res.redirect('/login-masyarakat');
};