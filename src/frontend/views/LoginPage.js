document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('Form_Registration');
    
    // Input Fields
    const inputEmail = document.getElementById('Input_Email');
    const inputPassword = document.getElementById('Input_KataSandi');

    // Error Elements
    const errorEmail = document.getElementById('Error_Email');
    const alertError = document.getElementById('Alert_Error');

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

        // Validasi Password & Konfirmasi Password
        const password = inputPassword.value;

        if (password.length < 8) {
            showGlobalError("Kata sandi minimal harus 8 karakter");
            isValid = false;
        }

        if (!isValid) return;

        window.location.href = 'DashboardPage.html';
    });

    inputEmail.addEventListener('input', () => clearError(inputEmail, errorEmail));
});