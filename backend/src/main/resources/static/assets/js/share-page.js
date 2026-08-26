(() => {
    'use strict';

    const posts = [
        { category: 'it', img: '../assets/images/blog-maven-stitch.jpg', badgeText: 'Công nghệ', date: '07/05/2026', readTime: '5 phút', title: 'Fixing Maven Dependency Conflicts in Spring Boot Projects', desc: 'Lỗi Maven là nỗi ám ảnh của mọi Java Developer. Bài viết này chia sẻ cách debug và xử lý triệt để các lỗi dependency không tìm thấy...' },
        { category: 'tutor', img: '../assets/images/blog-casio-stitch.jpg', badgeText: 'Gia sư', date: '05/05/2026', readTime: '8 phút', title: 'Top 5 Mẹo Bấm Máy Tính Casio Giải Nhanh Trắc Nghiệm Hóa', desc: 'Làm thế nào để xử lý các bài toán bảo toàn electron và bảo toàn khối lượng chỉ bằng vài phím bấm Casio? Khám phá ngay bí quyết...' },
        { category: 'experience', img: '../assets/images/blog-roadmap-stitch.jpg', badgeText: 'Kinh nghiệm', date: '02/05/2026', readTime: '10 phút', title: 'Lộ Trình Bứt Phá Môn Hóa 8+ Từ Con Số 0', desc: 'Dành riêng cho những bạn đang mất gốc môn Hóa. Một kế hoạch chi tiết từ việc nắm vững bảng tuần hoàn đến các dạng toán nâng cao...' },
        { category: 'it', img: '../assets/images/blog-clean-code-stitch.jpg', badgeText: 'Công nghệ', date: '28/04/2026', readTime: '6 phút', title: 'Tại sao bạn nên bắt đầu với Clean Code ngay hôm nay?', desc: 'Viết code chạy được là một chuyện, viết code để người khác và chính bạn trong tương lai có thể đọc được lại là chuyện khác...' }
    ];

    const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[char]);

    function renderPosts(filter = 'all') {
        const grid = document.getElementById('blog-grid');
        if (!grid) return;
        const filtered = filter === 'all' ? posts : posts.filter(post => post.category === filter);
        grid.innerHTML = filtered.map(post => `
            <article class="blog-card" data-category="${post.category}">
                <div class="blog-card-img">
                    <img src="${post.img}" alt="${escapeHtml(post.title)}" loading="lazy">
                    <span class="blog-badge ${post.category}-badge">${post.badgeText}</span>
                </div>
                <div class="blog-card-content">
                    <div class="blog-meta">
                        <span><i class="fa-solid fa-calendar-days"></i> ${post.date}</span>
                        <span><i class="fa-solid fa-clock"></i> ${post.readTime}</span>
                    </div>
                    <h3>${escapeHtml(post.title)}</h3>
                    <p>${escapeHtml(post.desc)}</p>
                    <a href="#" class="read-more">Đọc thêm <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </article>`).join('');
    }

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(item => item.classList.remove('active'));
            button.classList.add('active');
            renderPosts(button.dataset.filter);
        });
    });

    renderPosts();

    document.getElementById('download-profile')?.addEventListener('click', () => window.print());

    const revealItems = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(item => observer.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add('is-visible'));
    }
})();
