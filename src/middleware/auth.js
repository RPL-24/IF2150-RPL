exports.wajibLogin = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Silakan login terlebih dahulu');
    return res.redirect('/login');
  }
  next();
};

exports.wajibPeran = (...peran) => (req, res, next) => {
  if (!req.session.user || !peran.includes(req.session.user.peran)) {
    return res.status(403).render('error', { pesan: 'Akses ditolak' });
  }
  next();
};