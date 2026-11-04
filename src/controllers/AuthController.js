const bcrypt = require('bcryptjs');
const Pengguna = require('../models/Pengguna');

exports.tampilLogin = (req, res) => {
  if (req.session.user) return res.redirect('/' + req.session.user.peran);
  res.render('auth/login');
};

exports.prosesLogin = (req, res) => {
  const { email, kataSandi } = req.body;
  const p = Pengguna.cariByEmail(email);

  if (!p || !bcrypt.compareSync(kataSandi, p.kataSandi)) {
    req.flash('error', 'Email atau kata sandi salah');
    return res.redirect('/login');
  }

  req.session.user = { id: p.id, nama: p.nama, peran: p.peran };
  res.redirect('/' + p.peran);
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};