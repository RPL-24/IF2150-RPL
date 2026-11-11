// Pembantu pemanggilan API ITBELI dari View.
// Menyisipkan token sesi dan menyeragamkan bentuk respons menjadi
// { status, sukses, data?, kode?, pesan? }.
const Api = {
  KUNCI_TOKEN: 'itbeli_token',
  KUNCI_PERAN: 'itbeli_peran',
  KUNCI_EMAIL: 'itbeli_email',

  getToken() {
    return localStorage.getItem(Api.KUNCI_TOKEN);
  },

  simpanSesi(token, peran, email) {
    localStorage.setItem(Api.KUNCI_TOKEN, token);
    localStorage.setItem(Api.KUNCI_PERAN, peran);
    localStorage.setItem(Api.KUNCI_EMAIL, email);
  },

  hapusSesi() {
    [Api.KUNCI_TOKEN, Api.KUNCI_PERAN, Api.KUNCI_EMAIL].forEach((k) => localStorage.removeItem(k));
  },

  async kirim(method, path, body) {
    const headers = {};
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const token = Api.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let res;
    try {
      res = await fetch(path, {
        method,
        headers,
        body: isFormData ? body : (body === undefined ? undefined : JSON.stringify(body)),
      });
    } catch {
      return { status: 0, sukses: false, pesan: 'Tidak dapat terhubung ke server.' };
    }

    const isi = await res.json().catch(() => ({ sukses: false, pesan: 'Respons server tidak valid.' }));
    return { status: res.status, ...isi };
  },
};
