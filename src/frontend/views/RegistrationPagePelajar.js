document.addEventListener('DOMContentLoaded', () => {
    const inputTahun = document.getElementById('Input_TahunLahir');
    if (inputTahun) inputTahun.max = String(new Date().getFullYear());

    const form = document.getElementById('Form_Registration');
    const roleInput = document.getElementById('Input_Role');
    const tabBtns = document.querySelectorAll('.seg-btn');
    
    // Input Fields
    const inputNama = document.getElementById('Input_Nama');
    const inputEmail = document.getElementById('Input_Email');
    const inputNoTelepon = document.getElementById('Input_NomorTelp');
    const inputPassword = document.getElementById('Input_KataSandi');
    const inputConfirmPassword = document.getElementById('Input_KonfirmasiKataSandi');
    const inputEmailOrtu = document.getElementById('Input_EmailOrangTua');

    // Error Elements
    const errorNama = document.getElementById('Error_Nama');
    const errorEmail = document.getElementById('Error_Email');
    const errorNoTelepon = document.getElementById('Error_NoTelepon');
    const hintError = document.getElementById('Hint_TglError');
    const errorEmailOrtu = document.getElementById('Error_EmailOrangTua');
    const alertError = document.getElementById('Alert_Error');
    
    // Containers
    const groupKontakOrtu = document.getElementById('Group_KontakOrangTua');

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

    // Validasi Format Tanggal Lahir
    function isValidDate(day, month, year) {
        const d = parseInt(day, 10);
        const m = parseInt(month, 10);
        const y = parseInt(year, 10);

        if (isNaN(d) || isNaN(m) || isNaN(y)) return false;
        if (m < 1 || m > 12) return false;
        if (y < 1900 || y > new Date().getFullYear()) return false;

        const dateObj = new Date(y, m - 1, d);
        return (
            dateObj.getFullYear() === y &&
            dateObj.getMonth() === m - 1 &&
            dateObj.getDate() === d
        );
    }

    // Usia dalam tahun penuh, dipakai untuk aturan email orang tua/wali
    function hitungUsia(day, month, year) {
        const lahir = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
        const sekarang = new Date();
        let usia = sekarang.getFullYear() - lahir.getFullYear();
        const belumUlangTahun =
            sekarang.getMonth() < lahir.getMonth() ||
            (sekarang.getMonth() === lahir.getMonth() && sekarang.getDate() < lahir.getDate());
        if (belumUlangTahun) usia -= 1;
        return usia;
    }

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

        // Validasi Tanggal Lahir
        const tgl = document.getElementById('Input_TanggalLahir').value;
        const bln = document.getElementById('Input_BulanLahir').value;
        const thn = document.getElementById('Input_TahunLahir').value;

        if (!isValidDate(tgl, bln, thn)) {
            hintError.innerText = "Tanggal lahir tidak valid (periksa kembali tanggal, bulan, dan tahun)";
            hintError.hidden = false;
            isValid = false;
        } else {
            hintError.hidden = true;
        }

        // Validasi Email Orang Tua (wajib hanya bila pelajar di bawah 18 tahun)
        const emailOrtuValue = inputEmailOrtu.value.trim();
        const emailOrtuRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const diBawahUmur = !isValidDate(tgl, bln, thn) || hitungUsia(tgl, bln, thn) < 18;
        if (emailOrtuValue === '') {
            if (diBawahUmur) {
                showErrorField(inputEmailOrtu, errorEmailOrtu, 'Email orang tua/wali wajib diisi untuk pelajar di bawah 18 tahun');
                isValid = false;
            } else {
                clearError(inputEmailOrtu, errorEmailOrtu);
            }
        } else if (!emailOrtuRegex.test(emailOrtuValue)) {
            showErrorField(inputEmailOrtu, errorEmailOrtu, 'Format email tidak valid (contoh: user@mail.com)');
            isValid = false;
        } else {
            clearError(inputEmailOrtu, errorEmailOrtu);
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
            tanggal_lahir: `${thn}-${bln.padStart(2, '0')}-${tgl.padStart(2, '0')}`,
            email_orang_tua: emailOrtuValue,
            riwayat_kesehatan: document.getElementById('Input_RiwayatKesehatan').value.trim(),
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
    inputEmailOrtu.addEventListener('input', () => clearError(inputEmailOrtu, errorEmailOrtu));

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
