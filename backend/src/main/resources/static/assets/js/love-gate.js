(function () {
    'use strict';

    const overlay = document.getElementById('password-overlay');
    const form = document.getElementById('love-password-form');
    const input = document.getElementById('love-password');
    const toggle = document.getElementById('toggle-love-password');
    const error = document.getElementById('pwd-error');
    const submit = document.getElementById('unlock-love');

    if (!overlay || !form || !input) return;

    document.documentElement.classList.add('secret-gate-open');

    const revealLovePage = () => {
        overlay.classList.add('is-unlocking');
        window.setTimeout(() => {
            overlay.hidden = true;
            document.documentElement.classList.remove('secret-gate-open');
        }, 560);
    };

    if (sessionStorage.getItem('love_unlocked') === 'true') {
        overlay.hidden = true;
        document.documentElement.classList.remove('secret-gate-open');
    } else {
        window.requestAnimationFrame(() => input.focus({ preventScroll: true }));
    }

    toggle?.addEventListener('click', () => {
        const shouldShow = input.type === 'password';
        input.type = shouldShow ? 'text' : 'password';
        toggle.setAttribute('aria-pressed', String(shouldShow));
        toggle.setAttribute('aria-label', shouldShow ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
        const icon = toggle.querySelector('i');
        if (icon) icon.className = shouldShow ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
        input.focus();
    });

    input.addEventListener('input', () => {
        error?.classList.remove('is-visible');
        input.removeAttribute('aria-invalid');
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const pin = input.value.trim();

        if (!pin) {
            input.setAttribute('aria-invalid', 'true');
            error?.classList.add('is-visible');
            input.focus();
            return;
        }

        submit.disabled = true;
        submit.querySelector('span').textContent = 'Đang mở...';
        error?.classList.remove('is-visible');

        try {
            await ApiClient.post('/api/auth/admin/login', { pin });
            sessionStorage.setItem('love_unlocked', 'true');
            revealLovePage();
        } catch (requestError) {
            input.value = '';
            input.setAttribute('aria-invalid', 'true');
            error?.classList.remove('is-visible');
            void error?.offsetWidth;
            error?.classList.add('is-visible');
            input.focus();
        } finally {
            submit.disabled = false;
            submit.querySelector('span').textContent = 'Mở kỷ niệm';
        }
    });

    window.checkPassword = () => form.requestSubmit();
}());
