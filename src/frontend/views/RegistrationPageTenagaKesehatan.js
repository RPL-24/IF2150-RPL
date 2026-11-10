document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('Form_Registration');
    const roleInput = document.getElementById('Input_Role');
    const tabBtns = document.querySelectorAll('.seg-btn');
    
    // Input Fields
    const inputNama = document.getElementById('Input_Nama');
    const inputEmail = document.getElementById('Input_Email');
    const inputNoTelepon = document.getElementById('Input_NomorTelp');
    const inputJenisNakes = document.getElementById('Input_JenisTenagaKesehatan');
    const inputLokasi = document.getElementById('Input_Lokasi');
    const inputPassword = document.getElementById('Input_KataSandi');
    const inputConfirmPassword = document.getElementById('Input_KonfirmasiKataSandi');

    // Error Elements
    const errorNama = document.getElementById('Error_Nama');
    const errorEmail = document.getElementById('Error_Email');
    const errorNoTelepon = document.getElementById('Error_NoTelepon');
    const errorJenisNakes = document.getElementById('Error_JenisTenagaKesehatan');
    const errorLokasi = document.getElementById('Error_Lokasi');
    const alertError = document.getElementById('Alert_Error');

    // Pemilihan Role
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedRole = btn.getAttribute('data-role');
            if (selectedRole === 'pelajar') {
                window.location.href = 'RegistrationPagePelajar.html'; // Sesuaikan nama file pelajar Anda
            } else if (selectedRole === 'orangtuawali') {
                window.location.href = 'RegistrationPageOrangTuaWali.html';
            } else if (selectedRole === 'tenagakesehatan') {
                window.location.href = 'RegistrationPageTenagaKesehatan.html'; // Buat jika ada
            }
        });
    });

    // Helper untuk Error
    const clearError = (input, errorEl) => {
        input.classList.remove('is-invalid');
        errorEl.innerText = '';
    };

    const showErrorField = (input, errorEl, message) => {
        input.classList.add('is-invalid');
        errorEl.innerText = message;
    };

    const showGlobalError = (msg) => {
        alertError.innerText = msg;
        alertError.style.display = 'block';
    };

    // Logika Utama Saat Submit Form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        alertError.style.display = 'none';
        let isValid = true;

        // Validasi Nama
        const namaValue = inputNama.value.trim();
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (namaValue === '') {
            showErrorField(inputNama, errorNama, 'Nama wajib diisi');
            isValid = false;
        } else if (namaValue.length < 2) {
            showErrorField(inputNama, errorNama, 'Nama minimal terdiri dari 2 karakter');
            isValid = false;
        } else if (!nameRegex.test(namaValue)) {
            showErrorField(inputNama, errorNama, 'Nama hanya boleh berisi huruf');
            isValid = false;
        } else {
            clearError(inputNama, errorNama);
        }

        // Validasi Email
        const emailValue = inputEmail.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailValue === '') {
            showErrorField(inputEmail, errorEmail, 'Email wajib diisi');
            isValid = false;
        } else if (!emailRegex.test(emailValue)) {
            showErrorField(inputEmail, errorEmail, 'Format email tidak valid (contoh: user@mail.com)');
            isValid = false;
        } else {
            clearError(inputEmail, errorEmail);
        }

        // Validasi Nomor Telepon
        const phoneValue = inputNoTelepon.value.trim();
        const phoneRegex = /^08[0-9]{8,12}$/;
        if (phoneValue === '') {
            showErrorField(inputNoTelepon, errorNoTelepon, 'Nomor telepon wajib diisi');
            isValid = false;
        } else if (!phoneRegex.test(phoneValue)) {
            showErrorField(inputNoTelepon, errorNoTelepon, 'Nomor telepon harus diawali 08 dan terdiri dari 10-14 digit angka');
            isValid = false;
        } else {
            clearError(inputNoTelepon, errorNoTelepon);
        }

        // Validasi Jenis Tenaga Kesehatan
        const nakesValue = inputJenisNakes.value.trim();
        if (nakesValue === '') {
            showErrorField(inputJenisNakes, errorJenisNakes, 'Jenis tenaga kesehatan wajib diisi');
            isValid = false;
        } else {
            clearError(inputJenisNakes, errorJenisNakes);
        }

        // Validasi Lokasi
        const lokasiValue = inputLokasi.value.trim();
        if (lokasiValue == '') {
            showErrorField(inputLokasi, errorLokasi, 'Lokasi praktik wajib diisi');
            isValid = false;
        } else {
            clearError(inputLokasi, errorLokasi);
        }

        // Validasi Password & Konfirmasi Password
        const password = inputPassword.value;
        const confirmPassword = inputConfirmPassword.value;

        if (password.length < 8) {
            showGlobalError("Kata sandi minimal harus 8 karakter");
            isValid = false;
        } else if (password !== confirmPassword) {
            showGlobalError("Konfirmasi kata sandi tidak cocok!");
            isValid = false;
        }

        if (!isValid) return;

        const payload = {
            nama: namaValue,
            email: emailValue,
            telepon: phoneValue,
            role: roleInput.value,
            password,
            confirm_password: confirmPassword,
            jenis_tenaga_kesehatan: nakesValue,
            lokasi: lokasiValue,
        };

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.message || 'Registrasi gagal');
            }

            const pending = result && result.data && result.data.status_akun === 'Belum Terverifikasi';
            window.location.href = pending
                ? 'RegistrationSuccessPelajarPage.html'
                : 'RegistrationSuccessPage.html';
        } catch (err) {
            showGlobalError(err.message);
        }
    });

    inputNama.addEventListener('input', () => clearError(inputNama, errorNama));
    inputEmail.addEventListener('input', () => clearError(inputEmail, errorEmail));
    inputNoTelepon.addEventListener('input', () => clearError(inputNoTelepon, errorNoTelepon));
    inputJenisNakes.addEventListener('input', () => clearError(inputJenisNakes, errorJenisNakes));
    inputLokasi.addEventListener('input', () => clearError(inputLokasi, errorLokasi));

    const togglePassword = document.getElementById('Toggle_KataSandi');
    if (togglePassword && inputPassword) {
        togglePassword.addEventListener('click', () => {
            const show = inputPassword.type === 'password';
            inputPassword.type = show ? 'text' : 'password';
            togglePassword.textContent = show ? 'Sembunyikan' : 'Tampilkan';
            togglePassword.setAttribute('aria-label', show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
        });
    }

});
