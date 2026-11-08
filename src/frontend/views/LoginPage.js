/**
 * MahaSehat - LoginPage.js
 * Logika autentikasi dan interaksi antarmuka LoginPage.
 * Keterlacakan DPPL: UC01 (Autentikasi Pengguna), C01 (Pengguna)
 */

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
        alertError.style.display = 'block';
    };

    const hideGlobalError = () => {
        if (!alertError) return;
        alertError.textContent = '';
        alertError.style.display = 'none';
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

            // Validasi Identifier (Email atau Username)
            if (!identifierValue) {
                showErrorField(inputIdentifier, errorIdentifier, 'Email atau username wajib diisi.');
                isValid = false;
            } else if (identifierValue.includes('@')) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(identifierValue)) {
                    showErrorField(inputIdentifier, errorIdentifier, 'Format email tidak valid (contoh: nama@kampus.ac.id).');
                    isValid = false;
                }
            } else if (identifierValue.length < 3) {
                showErrorField(inputIdentifier, errorIdentifier, 'Username minimal 3 karakter.');
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
                // Coba panggil API backend jika server sedang berjalan
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

                if (response.ok) {
                    const data = await response.json();
                    if (data.token) {
                        localStorage.setItem('mahasehat_token', data.token);
                    }
                    if (data.user) {
                        localStorage.setItem('mahasehat_user', JSON.stringify(data.user));
                    }
                    window.location.href = 'DashboardPage.html';
                    return;
                }

                // Jika server merespons dengan status error (400/401/500)
                const errorData = await response.json().catch(() => ({}));
                showGlobalError(errorData.message || 'Email/username atau kata sandi tidak cocok.');
            } catch (err) {
                // Fallback untuk mode pengujian statis / prototipe frontend tanpa backend live
                console.info('Backend endpoint tidak aktif, beralih ke navigasi prototipe:', err.message);
                
                // Simpan sesi mock sederhana
                localStorage.setItem('mahasehat_mock_session', JSON.stringify({
                    identifier: identifierValue,
                    loggedInAt: new Date().toISOString()
                }));

                window.location.href = 'DashboardPage.html';
            } finally {
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'Masuk';
                }
            }
        });
    }
});
