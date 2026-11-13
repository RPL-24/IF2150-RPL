/**
 * MahaSehat - LoginPage.js
 * Logika autentikasi dan interaksi antarmuka LoginPage.
 * Keterlacakan DPPL: UC09 (Masuk Akun), C01 (Pengguna)
 */

// Tujuan dashboard per peran (dinormalisasi: huruf kecil, hanya a-z)
const HALAMAN_PER_ROLE = {
    pelajar: 'DashboardPagePelajar.html',
    orangtuawali: 'DashboardPageOrangTuaWali.html',
    orangtua: 'DashboardPageOrangTuaWali.html',
    wali: 'DashboardPageOrangTuaWali.html',
    tenagakesehatan: 'DashboardPageTenagaKesehatan.html'
};

document.addEventListener('DOMContentLoaded', () => {
    // Form & Panels
    const form = document.getElementById('Form_Registration') || document.querySelector('form');

    // Input Fields
    const inputIdentifier = document.getElementById('Input_Email');
    const inputPassword = document.getElementById('Input_KataSandi');
    const btnTogglePassword = document.getElementById('Toggle_Password');
    const btnSubmit = document.getElementById('Btn_Masuk');

    // Error & Alert Elements
    const errorIdentifier = document.getElementById('Error_Email');
    const errorPassword = document.getElementById('Error_KataSandi');
    const alertError = document.getElementById('Alert_Error');

    // ==========================================================================
    // 1. Toggle Show / Hide Password
    // ==========================================================================
    if (btnTogglePassword && inputPassword) {
        btnTogglePassword.addEventListener('click', () => {
            const isPassword = inputPassword.getAttribute('type') === 'password';
            inputPassword.setAttribute('type', isPassword ? 'text' : 'password');
            btnTogglePassword.textContent = isPassword ? 'Sembunyikan' : 'Tampilkan';
            btnTogglePassword.setAttribute('aria-label', isPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
        });
    }

    // ==========================================================================
    // 2. Helper Pesan Error & Reset
    // ==========================================================================
    const clearError = (input, errorEl) => {
        if (!input) return;
        const wrapper = input.closest('.input-wrapper') || input;
        wrapper.classList.remove('is-invalid');
        input.classList.remove('is-invalid');
        if (errorEl) errorEl.textContent = '';
    };

    const showErrorField = (input, errorEl, message) => {
        if (!input) return;
        const wrapper = input.closest('.input-wrapper') || input;
        wrapper.classList.add('is-invalid');
        input.classList.add('is-invalid');
        if (errorEl) errorEl.textContent = message;
    };

    const showGlobalError = (message) => {
        if (!alertError) return;
        alertError.textContent = message;
        alertError.hidden = false;
    };

    const hideGlobalError = () => {
        if (!alertError) return;
        alertError.textContent = '';
        alertError.hidden = true;
    };

    // Bersihkan error saat pengguna mulai mengetik
    if (inputIdentifier) {
        inputIdentifier.addEventListener('input', () => {
            clearError(inputIdentifier, errorIdentifier);
            hideGlobalError();
        });
    }

    if (inputPassword) {
        inputPassword.addEventListener('input', () => {
            clearError(inputPassword, errorPassword);
            hideGlobalError();
        });
    }

    // ==========================================================================
    // 3. Validasi & Submit Form
    // ==========================================================================
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideGlobalError();

            const identifierValue = inputIdentifier ? inputIdentifier.value.trim() : '';
            const passwordValue = inputPassword ? inputPassword.value : '';

            let isValid = true;

            // Validasi Email (login hanya memakai email)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!identifierValue) {
                showErrorField(inputIdentifier, errorIdentifier, 'Email wajib diisi.');
                isValid = false;
            } else if (!emailRegex.test(identifierValue)) {
                showErrorField(inputIdentifier, errorIdentifier, 'Format email tidak valid.');
                isValid = false;
            }

            // Validasi Kata Sandi
            if (!passwordValue) {
                showErrorField(inputPassword, errorPassword, 'Kata sandi wajib diisi.');
                isValid = false;
            } else if (passwordValue.length < 8) {
                showErrorField(inputPassword, errorPassword, 'Kata sandi minimal 8 karakter.');
                isValid = false;
            }

            if (!isValid) return;

            // Efek Loading pada Tombol Masuk
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.textContent = 'Memproses...';
            }

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        identifier: identifierValue,
                        password: passwordValue
                    })
                });

                const hasil = await response.json().catch(() => ({}));

                // Respons API: { success, message, data: { token, pengguna } }
                if (response.ok && hasil.data && hasil.data.token) {
                    const { token, pengguna } = hasil.data;
                    localStorage.setItem('mahasehat_token', token);
                    localStorage.setItem('mahasehat_user', JSON.stringify(pengguna));
                    localStorage.setItem('role', pengguna.role);

                    // Arahkan langsung ke dashboard sesuai role
                    const roleKey = String(pengguna.role || '').toLowerCase().replace(/[^a-z]/g, '');
                    const tujuan = HALAMAN_PER_ROLE[roleKey];

                    if (tujuan) {
                        window.location.href = tujuan;
                        return;
                    }

                    showGlobalError('Peran akun tidak dikenali. Hubungi admin.');
                    return;
                }

                // 400/401/403: pesan dari server, misalnya akun belum dikonfirmasi wali
                showGlobalError(hasil.message || 'Email atau kata sandi salah.');
            } catch (err) {
                // Server tidak bisa dihubungi: tetap di halaman login
                showGlobalError('Tidak dapat terhubung ke server. Coba lagi beberapa saat lagi.');
            } finally {
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'Masuk';
                }
            }
        });
    }
});
