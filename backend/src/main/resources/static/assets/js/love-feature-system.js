(function () {
    'use strict';

    const pageName = location.pathname.split('/').pop()?.replace('.html', '') || '';
    const pages = {
        timeline: { title: 'Dòng thời gian', label: 'Các cột mốc', icon: 'fa-route' },
        map: { title: 'Bản đồ kỷ niệm', label: 'Nơi ta đã đi qua', icon: 'fa-map-location-dot' },
        bucketlist: { title: 'Bucket List', label: 'Ước mơ chung', icon: 'fa-list-check' },
        messages: { title: 'Hộp thư', label: 'Những lời chưa nói', icon: 'fa-envelope-open-text' },
        tracking: { title: 'Vị trí', label: 'Khoảng cách của hai ta', icon: 'fa-location-crosshairs' },
        chat: { title: 'Trò chuyện', label: 'Kết nối thời gian thực', icon: 'fa-comments' },
        locket: { title: 'Locket Love', label: 'Khoảnh khắc tức thì', icon: 'fa-square-rss' },
        photobooth: { title: 'Photobooth', label: 'Chụp dải ảnh cùng nhau', icon: 'fa-camera-retro' }
    };

    const current = pages[pageName];
    if (!current || !document.body.classList.contains('love-feature-page')) return;

    const header = document.createElement('header');
    header.className = 'love-feature-bar';
    header.innerHTML = `
        <a class="love-feature-brand" href="love.html" aria-label="Quay lại Góc Kỷ Niệm">
            <span class="love-feature-brand-mark"><i class="fa-solid fa-heart"></i></span>
            <span><strong>Secret Corner</strong><small>Góc kỷ niệm</small></span>
        </a>
        <div class="love-feature-current">
            <span class="love-feature-current-icon"><i class="fa-solid ${current.icon}"></i></span>
            <span class="love-feature-current-copy"><strong>${current.title}</strong><small>${current.label}</small></span>
        </div>
        <div class="love-feature-actions">
            <select class="love-feature-switcher" aria-label="Chuyển trang tính năng"></select>
            <a href="love.html" class="love-feature-action" aria-label="Dashboard kỷ niệm"><i class="fa-solid fa-table-cells-large"></i></a>
            <a href="../index.html" class="love-feature-action" data-desktop-only aria-label="Trang cá nhân"><i class="fa-solid fa-house"></i></a>
            <button type="button" class="love-feature-action" id="love-feature-theme" aria-label="Đổi giao diện"><i class="fa-solid fa-moon"></i></button>
        </div>`;

    const select = header.querySelector('select');
    Object.entries(pages).forEach(([key, page]) => {
        const option = document.createElement('option');
        option.value = `${key}.html`;
        option.textContent = page.title;
        option.selected = key === pageName;
        select.appendChild(option);
    });
    select.addEventListener('change', () => { location.href = select.value; });

    const progress = document.createElement('div');
    progress.className = 'love-feature-progress';
    progress.setAttribute('aria-hidden', 'true');
    header.appendChild(progress);
    document.body.prepend(header);

    const dock = document.createElement('nav');
    dock.className = 'love-feature-mobile-dock';
    dock.setAttribute('aria-label', 'Điều hướng nhanh');
    const dockPages = [
        ['love.html', 'fa-heart', 'Kỷ niệm', 'love'],
        ['timeline.html', 'fa-route', 'Timeline', 'timeline'],
        ['locket.html', 'fa-square-rss', 'Locket', 'locket'],
        ['chat.html', 'fa-comments', 'Chat', 'chat']
    ];
    dockPages.forEach(([href, icon, label, key]) => {
        const link = document.createElement('a');
        link.href = href;
        link.className = key === pageName ? 'active' : '';
        link.innerHTML = `<i class="fa-solid ${icon}"></i><span>${label}</span>`;
        dock.appendChild(link);
    });
    document.body.appendChild(dock);

    const themeButton = header.querySelector('#love-feature-theme');
    const setTheme = (isLight) => {
        document.body.classList.toggle('love-feature-light', isLight);
        themeButton.querySelector('i').className = `fa-solid ${isLight ? 'fa-sun' : 'fa-moon'}`;
        themeButton.setAttribute('aria-label', isLight ? 'Dùng giao diện tối' : 'Dùng giao diện sáng');
        localStorage.setItem('loveFeatureTheme', isLight ? 'light' : 'dark');
    };
    setTheme(localStorage.getItem('loveFeatureTheme') === 'light');
    themeButton.addEventListener('click', () => setTheme(!document.body.classList.contains('love-feature-light')));

    const updateProgress = () => {
        const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        progress.style.transform = `scaleX(${Math.min(1, scrollY / max)})`;
    };
    addEventListener('scroll', updateProgress, { passive: true });
    addEventListener('resize', updateProgress, { passive: true });
    updateProgress();

    document.querySelectorAll('img:not([loading])').forEach((image) => image.loading = 'lazy');
    document.body.classList.add('love-feature-ready');
}());
