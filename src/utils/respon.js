function keSnakeCase(nilai) {
  if (Array.isArray(nilai)) {
    return nilai.map(keSnakeCase);
  }
  if (nilai && typeof nilai === 'object' && !(nilai instanceof Date)) {
    const sumber = typeof nilai.toJSON === 'function' ? nilai.toJSON() : nilai;
    return Object.fromEntries(
      Object.entries(sumber).map(([kunci, isi]) => [
        kunci.replace(/[A-Z]/g, (huruf) => `_${huruf.toLowerCase()}`),
        keSnakeCase(isi),
      ])
    );
  }
  return nilai;
}

/** Bentuk respons seragam seluruh API: { success, message, data }, dengan kunci snake_case. */
function kirim(res, status, message, data = null) {
  return res.status(status).json({ success: true, message, data: keSnakeCase(data) });
}

/** Meneruskan galat dari handler async ke global error handler Express. */
function tanganiAsync(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

module.exports = { kirim, tanganiAsync, keSnakeCase };
