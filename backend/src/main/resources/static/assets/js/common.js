// Page Transition Injector
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.createElement('div');
    loader.className = 'page-transition';
    loader.id = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-logo">Mtruong<span>_dev</span></div>
            <div class="loader-bar"></div>
        </div>
    `;
    document.body.prepend(loader);

});

window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 300);
    }
});

// Safety net: ẩn loader sau tối đa 2s dù window.load chưa fire
setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
    }
}, 2000);

// Auth and Navbar Logic
if (typeof API_CONFIG === 'undefined') {
    window.API_CONFIG = {
        // Cách 1: Đường dẫn tương đối — production tự gọi đúng domain, local trỏ về localhost:8080
        BASE_URL: (window.location.hostname === '127.0.0.1' ||
                   window.location.hostname === 'localhost' ||
                   window.location.protocol === 'file:')
            ? 'http://localhost:8080'
            : '', // Để trống → trình duyệt tự gọi đúng domain hiện tại (Render, custom domain, v.v.)
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Unified Navbar Scroll Handling
    const navbar = document.querySelector('.navbar-unified');
    if (navbar) {
        const navLinks = navbar.querySelector('.nav-links-unified');
        if (navLinks) {
            const isInsidePages = window.location.pathname.includes('/pages/');
            const pagePrefix = isInsidePages ? '' : 'pages/';
            const homeHref = isInsidePages ? '../index.html' : 'index.html';
            const mainNavigation = [
                { label: 'Trang Chủ', href: homeHref, file: 'index.html' },
                { label: 'Cá Nhân', href: `${pagePrefix}about.html`, file: 'about.html' },
                { label: 'Giảng Dạy', href: `${pagePrefix}teaching.html`, file: 'teaching.html' },
                { label: 'Mục Tiêu', href: `${pagePrefix}muctieu.html`, file: 'muctieu.html' },
                { label: 'Dự Án', href: `${pagePrefix}projects.html`, file: 'projects.html' }
            ];
            const currentFile = window.location.pathname.split('/').pop() || 'index.html';
            navLinks.innerHTML = mainNavigation.map(item => `
                <li><a href="${item.href}"${currentFile === item.file ? ' class="active" aria-current="page"' : ''}>${item.label}</a></li>
            `).join('');
        }

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 2. Premium Theme Switching Logic
    const themeBtn = document.querySelector('.theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeBtn?.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeBtn?.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        }
    }

    // 3. Scroll Reveal Engine (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Unobserve after activation for performance
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    const sharedFooter = document.querySelector('[data-shared-footer]');
    if (sharedFooter) {
        sharedFooter.classList.add('shared-footer');
        sharedFooter.innerHTML = `
            <div class="shared-footer-inner">
                <p>© 2026 Hoàng Mạnh Trường · Chia sẻ kiến thức và xây dựng trải nghiệm học tập tốt hơn.</p>
                <nav aria-label="Liên kết cuối trang">
                    <a href="${window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html'}">Trang chủ</a>
                    <a href="${window.location.pathname.includes('/pages/') ? 'about.html#knowledge' : 'pages/about.html#knowledge'}">Cá nhân</a>
                    <a href="mailto:truongcri0101@gmail.com">Liên hệ</a>
                </nav>
            </div>`;
    }

    // 4. Global Auth State Handling for Navbar
    updateNavbarAuth();
});

function updateNavbarAuth() {
    const guestLinks = document.getElementById('guest-links');
    const userLinks = document.getElementById('user-links');
    if (guestLinks) guestLinks.style.display = 'none';
    if (userLinks) userLinks.style.display = 'none';
}

function logout() {
    sessionStorage.removeItem('isAdmin');
    localStorage.removeItem('current_student'); // Keep student logout just in case
    window.location.href = (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) ? 'index.html' : '../index.html';
}

window.promptAdmin = function() {};

window.UiModal = {
    open(target) {
        const modal = typeof target === 'string' ? document.querySelector(target) : target;
        if (modal) modal.hidden = false;
    },
    close(target) {
        const modal = typeof target === 'string' ? document.querySelector(target) : target;
        if (modal) modal.hidden = true;
    }
};
