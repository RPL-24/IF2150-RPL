export function isDataLengkap(...nilai: (string | null | undefined)[]): boolean {
  return nilai.every((value) => typeof value === 'string' && value.trim().length > 0);
}

export function isPasswordKuat(password: string): boolean {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

export function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isKonfirmasiPasswordSesuai(
  password: string,
  konfirmasi: string,
): boolean {
  return password.length > 0 && password === konfirmasi;
}