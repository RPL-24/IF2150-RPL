// src/tests/unit/SurelAdapter.test.js
// C43 SurelAdapter: transport nodemailer diganti tiruan. Pengiriman ke SMTP sungguhan (Mailpit) diuji di src/tests/db/.
jest.mock('nodemailer');
const nodemailer = require('nodemailer');

const sendMail = jest.fn();
nodemailer.createTransport.mockImplementation((opsi) => ({ opsi, sendMail }));

const SurelAdapter = require('../../integrasi/SurelAdapter');

describe('SurelAdapter Unit Test (C43)', () => {
  beforeEach(() => {
    sendMail.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('C43-UT01 kirimSurel meneruskan pengirim, tujuan, subjek, dan isi ke SMTP lalu mengembalikan true', async () => {
    sendMail.mockResolvedValue({ messageId: '<1@itbeli>' });
    expect(await SurelAdapter.kirimSurel('uji@itb.ac.id', 'Kode Verifikasi ITBELI', 'Kode: 123456')).toBe(true);
    expect(sendMail).toHaveBeenCalledWith({
      from: SurelAdapter.alamatPengirim,
      to: 'uji@itb.ac.id',
      subject: 'Kode Verifikasi ITBELI',
      text: 'Kode: 123456',
    });
  });

  test('C43-UT02 kirimSurel mengembalikan false tanpa melempar galat bila SMTP menolak', async () => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => {});
    sendMail.mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1:1025'));
    expect(await SurelAdapter.kirimSurel('uji@itb.ac.id', 'Subjek', 'Isi')).toBe(false);
    expect(log.mock.calls[0][0]).toContain('uji@itb.ac.id');
  });

  test.each([
    [465, true],
    [587, false],
    [1025, false],
  ])('C43-UT03 port %p → secure %p (465 TLS langsung, selain itu STARTTLS/tanpa TLS)', (port, aman) => {
    const adapter = new SurelAdapter.constructor('smtp.contoh.id', port, 'ITBELI <no-reply@itbeli.local>');
    expect(adapter.transporter.opsi).toMatchObject({ host: 'smtp.contoh.id', port, secure: aman });
    expect(adapter).toMatchObject({ hostSmtp: 'smtp.contoh.id', portSmtp: port, alamatPengirim: 'ITBELI <no-reply@itbeli.local>' });
  });

  test('C43-UT04 autentikasi SMTP hanya dipasang bila nama pengguna diisi', () => {
    const tanpaAuth = new SurelAdapter.constructor('localhost', 1025, 'a@b');
    const denganAuth = new SurelAdapter.constructor('smtp.contoh.id', 587, 'a@b', 'pengguna', 'sandi');
    expect(tanpaAuth.transporter.opsi.auth).toBeUndefined();
    expect(denganAuth.transporter.opsi.auth).toEqual({ user: 'pengguna', pass: 'sandi' });
  });
});
