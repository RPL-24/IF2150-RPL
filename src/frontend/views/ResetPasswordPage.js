document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const demo = params.get('demo') === '1';

    const API = {
        lupa: '/api/auth/forgot-password',
        atur: '/api/auth/reset-password'
    };

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const MIN_SANDI = 8;

    const stepEmail = document.getElementById('Step_Email');
    const stepTerkirim = document.getElementById('Step_Terkirim');
    const stepSandiBaru = document.getElementById('Step_KataSandiBaru');

    const formEmail = document.getElementById('Form_Email');
    const inputEmail = document.getElementById('Input_Email');
    const errEmail = document.getElementById('Error_Email');
    const alertEmail = document.getElementById('Alert_Email');
    const btnKirim = document.getElementById('Btn_KirimTautan');

    const formSandi = document.getElementById('Form_SandiBaru');
    const inputSandi = document.getElementById('Input_SandiBaru');
    const inputKonfirmasi = document.getElementById('Input_KonfirmasiSandi');
    const errSandi = document.getElementById('Error_SandiBaru');
    const errKonfirmasi = document.getElementById('Error_KonfirmasiSandi');
    const alertSandi = document.getElementById('Alert_SandiBaru');
    const btnSimpan = document.getElementById('Btn_SimpanSandi');
    const linkTautanBaru = document.getElementById('Link_TautanBaru');

    const popup = document.getElementById('Popup_SandiDiganti');

    function showStep(target) {
        [stepEmail, stepTerkirim, stepSandiBaru].forEach((el) => {
            el.hidden = el !== target;
        });
    }

    // Pindahkan fokus ke judul langkah yang ditampilkan agar pembaca layar mengumumkannya
    function fokuskanJudul(target) {
        const judul = target.querySelector('h2');
        if (!judul) return;
        judul.setAttribute('tabindex', '-1');
        judul.focus({ preventScroll: true });
    }

    function showEmailForm() {
        showStep(stepEmail);
        inputEmail.focus();
    }

    function showNewPasswordForm() {
        showStep(stepSandiBaru);
        inputSandi.focus();
    }

    function showMessage(email) {
        document.getElementById('Text_EmailTujuan').textContent = email;
        showStep(stepTerkirim);
        fokuskanJudul(stepTerkirim);
    }

    function showError(input, el, pesan) {
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        el.textContent = pesan;
    }

    function clearError(input, el) {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        el.textContent = '';
    }

    function showAlert(el, pesan) {
        el.textContent = pesan;
        el.hidden = false;
    }

    function hideAlert(el) {
        el.hidden = true;
    }

    function setBusy(btn, busy, teks) {
        btn.disabled = busy;
        btn.setAttribute('aria-busy', busy ? 'true' : 'false');
        btn.textContent = teks;
    }

    function validateEmail() {
        const v = inputEmail.value.trim();
        if (v === '') {
            showError(inputEmail, errEmail, 'Email wajib diisi');
            return false;
        }
        if (!EMAIL_REGEX.test(v)) {
            showError(inputEmail, errEmail, 'Format email tidak valid (contoh: user@mail.com)');
            return false;
        }
        clearError(inputEmail, errEmail);
        return true;
    }

    function validateNewPassword() {
        const v = inputSandi.value;
        if (v === '') {
            showError(inputSandi, errSandi, 'Kata sandi baru wajib diisi');
            return false;
        }
        if (v.length < MIN_SANDI) {
            showError(inputSandi, errSandi, `Kata sandi minimal ${MIN_SANDI} karakter`);
            return false;
        }
        clearError(inputSandi, errSandi);
        return true;
    }

    function validateConfirm() {
        const v = inputKonfirmasi.value;
        if (v === '') {
            showError(inputKonfirmasi, errKonfirmasi, 'Konfirmasi kata sandi wajib diisi');
            return false;
        }
        if (v !== inputSandi.value) {
            showError(inputKonfirmasi, errKonfirmasi, 'Konfirmasi kata sandi tidak cocok');
            return false;
        }
        clearError(inputKonfirmasi, errKonfirmasi);
        return true;
    }

    const disentuh = new Set();
    function pasangValidasi(input, fn, id) {
        input.addEventListener('blur', () => {
            disentuh.add(id);
            fn();
        });
        input.addEventListener('input', () => {
            if (disentuh.has(id)) fn();
        });
    }

    pasangValidasi(inputEmail, validateEmail, 'email');
    pasangValidasi(inputSandi, () => {
        validateNewPassword();
        if (disentuh.has('konfirmasi')) validateConfirm();
    }, 'sandi');
    pasangValidasi(inputKonfirmasi, validateConfirm, 'konfirmasi');

    function panggilDemo(url, body) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (url === API.lupa) {
                    resolve(body.email === 'tidakada@mail.com'
                        ? { ok: false, status: 404, message: '' }
                        : { ok: true, status: 200, message: '' });
                    return;
                }
                resolve(body.token === 'kedaluwarsa'
                    ? { ok: false, status: 410, message: '' }
                    : { ok: true, status: 200, message: '' });
            }, 400);
        });
    }

    async function panggilApi(url, body) {
        if (demo) return panggilDemo(url, body);
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            let data = {};
            try {
                data = await res.json();
            }
            catch (err) {
                // respons tanpa JSON, abaikan
            }
            return { ok: res.ok, status: res.status, message: data.message || '' };
        } catch (err) {
            return { ok: false, status: 0, message: 'Tidak dapat terhubung ke server. Coba lagi.' };
        }
    }

    formEmail.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert(alertEmail);
        disentuh.add('email');
        if (!validateEmail()) {
            inputEmail.focus();
            return;
        }

        const email = inputEmail.value.trim();
        setBusy(btnKirim, true, 'Mengirim...');
        const hasil = await panggilApi(API.lupa, { email });
        setBusy(btnKirim, false, 'Kirim Tautan');

        if (hasil.ok) {
            showMessage(email);
            return;
        }
        if (hasil.status === 404) {
            showError(inputEmail, errEmail, 'Email tidak terdaftar. Periksa kembali penulisannya.');
            inputEmail.focus();
            return;
        }
        showAlert(alertEmail, hasil.message || 'Gagal mengirim tautan. Coba lagi.');
    });

    document.getElementById('Btn_GunakanEmailLain').addEventListener('click', () => {
        formEmail.reset();
        clearError(inputEmail, errEmail);
        disentuh.delete('email');
        showEmailForm();
    });

    formSandi.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert(alertSandi);
        disentuh.add('sandi');
        disentuh.add('konfirmasi');
        const sandiOk = validateNewPassword();
        const konfirmasiOk = validateConfirm();
        if (!sandiOk || !konfirmasiOk) {
            (sandiOk ? inputKonfirmasi : inputSandi).focus();
            return;
        }

        setBusy(btnSimpan, true, 'Menyimpan...');
        const hasil = await panggilApi(API.atur, { token, password: inputSandi.value });
        setBusy(btnSimpan, false, 'Simpan Kata Sandi');

        if (hasil.ok) {
            popup.showModal();
            document.getElementById('Btn_KeMasuk').focus();
            return;
        }
        if ([401, 403, 404, 410].includes(hasil.status)) {
            showAlert(alertSandi, 'Tautan tidak valid atau sudah kedaluwarsa. Minta tautan baru.');
            linkTautanBaru.hidden = false;
            return;
        }
        showAlert(alertSandi, hasil.message || 'Gagal mengubah kata sandi. Coba lagi.');
    });

    document.getElementById('Btn_KeMasuk').addEventListener('click', () => popup.close());
    popup.addEventListener('close', () => window.location.replace('LoginPage.html'));

    document.querySelectorAll('.pw-toggle').forEach((btn) => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            const tampil = input.type === 'password';
            input.type = tampil ? 'text' : 'password';
            btn.textContent = tampil ? 'Sembunyikan' : 'Tampilkan';
            btn.setAttribute('aria-pressed', tampil ? 'true' : 'false');
            // Kembalikan fokus ke kolom agar pengguna dapat langsung mengetik
            input.focus({ preventScroll: true });
        });
    });

    if (token) {
        showNewPasswordForm();
    }
    else {
        showEmailForm();
    }
});