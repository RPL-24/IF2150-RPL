/**
 * Galat yang pesannya aman ditampilkan ke pengguna, beserta kode status HTTP-nya.
 */
class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = AppError;
