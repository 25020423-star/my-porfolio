(() => {
    'use strict';

    const githubProfile = 'https://github.com/hoangmanhtruong-uet-dev';
    const projects = [
        {
            id: 'url-shortener', title: 'High-Throughput URL Shortener', featured: true,
            categories: ['java', 'cloud'], categoryLabel: 'Java · Distributed Systems', status: 'Architecture Ready',
            description: 'Dịch vụ rút gọn URL hướng đến tải đọc lớn, tách read/write path và bảo vệ hot keys bằng cache nhiều lớp.',
            tech: ['Java 21', 'Spring Boot', 'Redis', 'MySQL', 'Docker'], metrics: ['5K RPS', 'Cache hit 95%', 'p95 < 80ms'],
            flow: [['fa-display', 'Web / Mobile'], ['fa-bolt', 'Redirect API'], ['fa-database', 'Redis + MySQL']],
            live: null,
            decisions: [
                ['Spring Boot cho core service', 'Typed domain model, validation và hệ sinh thái production-ready phù hợp hơn một runtime JavaScript cho nghiệp vụ redirect cần độ ổn định cao.'],
                ['Redis read-through cache', 'Giảm truy vấn MySQL trên redirect path; TTL và negative caching được dùng để bảo vệ hệ thống trước hot URL hoặc cache miss lặp lại.'],
                ['Base62 + sequence allocation', 'Sinh mã ngắn dễ index và tránh collision; cấp block ID giúp giảm contention khi scale ngang.']
            ],
            tradeoffs: ['Cache tăng tốc đọc nhưng tạo bài toán invalidation và consistency.', 'Sequence dễ vận hành hơn hash ngẫu nhiên nhưng cần chiến lược cấp ID khi đa vùng.', 'Analytics được xử lý bất đồng bộ để không làm chậm redirect path.'],
            security: ['Rate limiting theo IP và account.', 'Kiểm tra URL độc hại trước khi publish.', 'Parameterized query, audit log và giới hạn thời hạn link.']
        },
        {
            id: 'realtime-chat', title: 'Realtime Messaging Platform', featured: true,
            categories: ['java', 'fullstack'], categoryLabel: 'Realtime · Event-driven', status: 'Interactive Prototype',
            description: 'Nền tảng nhắn tin realtime với room, presence, delivery state và khả năng fan-out nhiều node.',
            tech: ['Spring Boot', 'STOMP', 'WebSocket', 'Redis Pub/Sub', 'MySQL'], metrics: ['10K connections', 'p95 < 120ms', '99.9% target'],
            flow: [['fa-mobile-screen', 'Clients'], ['fa-comments', 'WebSocket Hub'], ['fa-tower-broadcast', 'Pub/Sub']],
            live: 'chat.html',
            decisions: [['STOMP trên WebSocket', 'Chuẩn hóa topic, subscription và event contract, đồng thời vẫn giữ được kết nối hai chiều độ trễ thấp.'], ['Redis Pub/Sub cho fan-out', 'Giúp nhiều instance WebSocket chia sẻ sự kiện mà không buộc client bám vào một node duy nhất.'], ['Store-and-forward', 'Tin nhắn được lưu trước khi phát để hỗ trợ reconnect và trạng thái delivered/read.']],
            tradeoffs: ['WebSocket cần quản lý connection state và backpressure.', 'Pub/Sub nhanh nhưng không đảm bảo lưu bền như stream.', 'Presence ưu tiên eventual consistency để giảm tải.'],
            security: ['JWT handshake và authorization theo room.', 'Giới hạn kích thước file/message.', 'Chống spam, XSS và kiểm tra MIME khi upload.']
        },
        {
            id: 'education-platform', title: 'Education Operations Platform',
            categories: ['java', 'fullstack', 'cloud'], categoryLabel: 'EdTech · Platform', status: 'Running',
            description: 'Cổng học sinh, quản lý lớp, học phí, thi thử và báo cáo học tập trong một modular monolith dễ vận hành.',
            tech: ['Spring Boot', 'MySQL', 'Session Auth', 'Cloudinary'], metrics: ['6 modules', 'Mobile-first', '4/4 core flows'],
            flow: [['fa-user-graduate', 'Student Portal'], ['fa-cubes', 'Domain Modules'], ['fa-database', 'MySQL']],
            live: 'student_portal.html',
            decisions: [['Modular monolith trước microservices', 'Giữ deployment đơn giản trong giai đoạn tăng trưởng nhưng phân ranh giới domain rõ để tách service khi có dữ liệu tải thực tế.'], ['Server-side session', 'Phù hợp ứng dụng cùng domain, giảm bề mặt token phía client và đơn giản hóa revoke.'], ['Cloud object storage', 'Tách vòng đời ảnh/tài liệu khỏi filesystem của container.']],
            tradeoffs: ['Một deployment tạo blast radius lớn hơn.', 'Session cần sticky routing hoặc shared store khi scale ngang.', 'Domain boundaries phải được giữ bằng convention và test.'],
            security: ['BCrypt cho mật khẩu học sinh.', 'Admin mutation được bảo vệ bằng server session.', 'Validation, upload limits và write-only password DTO.']
        },
        {
            id: 'chemistry-lab', title: 'Neon Virtual Chemistry Lab',
            categories: ['ai', 'fullstack'], categoryLabel: 'AI · Simulation', status: 'Running',
            description: 'Phòng lab hóa học tương tác với mô phỏng phản ứng, bảng tuần hoàn, calculator và trợ lý nghiên cứu AI.',
            tech: ['JavaScript', 'Gemini', 'Spring Boot', 'Responsive UI'], metrics: ['6 lab tools', 'C4 documented', 'Mobile ready'],
            flow: [['fa-flask-vial', 'Virtual Lab'], ['fa-brain', 'AI Orchestrator'], ['fa-book-open', 'Knowledge']],
            live: 'chemlab.html',
            decisions: [['Simulation tại client', 'Tương tác tức thời và giảm số request cho các thao tác mô phỏng an toàn.'], ['AI qua backend gateway', 'API key không xuất hiện ở trình duyệt và prompt policy được quản lý tập trung.'], ['Progressive enhancement', 'Các công cụ cơ bản vẫn sử dụng được khi AI tạm thời không phản hồi.']],
            tradeoffs: ['Mô phỏng phía client không thay thế engine khoa học chuyên dụng.', 'AI có độ trễ và kết quả không hoàn toàn xác định.', 'Nội dung trực quan cần tối ưu cho thiết bị yếu.'],
            security: ['Không thực thi mã do AI sinh.', 'Giới hạn payload ảnh và prompt.', 'Sanitize output trước khi render.']
        },
        {
            id: 'auction-system', title: 'Auction Management System',
            categories: ['java', 'fullstack'], categoryLabel: 'Java · Transactional', status: 'Case Study',
            description: 'Hệ thống quản lý phiên đấu giá với bidding rules, transaction boundary và dữ liệu nhất quán.',
            tech: ['Java', 'JDBC', 'MySQL', 'Optimistic Lock'], metrics: ['ACID bidding', 'Conflict safe', 'Audit trail'],
            flow: [['fa-users', 'Bidders'], ['fa-gavel', 'Auction Core'], ['fa-database', 'Ledger DB']],
            live: 'auction.html',
            decisions: [['Optimistic locking', 'Phù hợp tỷ lệ xung đột vừa phải và tránh giữ database lock dài trong phiên đấu giá.'], ['Immutable bid ledger', 'Mỗi lượt ra giá là một record mới để audit và tái dựng trạng thái.'], ['Server-side validation', 'Giá tối thiểu, thời hạn và quyền tham gia được xác minh tại domain service.']],
            tradeoffs: ['Bid cạnh tranh cao có thể phải retry.', 'Polling đơn giản hơn realtime nhưng trải nghiệm kém hơn.', 'Audit log tăng dung lượng lưu trữ.'],
            security: ['Idempotency key cho thao tác đặt giá.', 'Authorization theo auction và user.', 'Chống sửa giá phía client và ghi audit.']
        },
        {
            id: 'contextual-ai', title: 'Contextual AI Assistant',
            categories: ['ai', 'java'], categoryLabel: 'AI · Automation', status: 'Beta',
            description: 'Trợ lý Gemini có prompt routing, xử lý ảnh và fallback an toàn cho bài toán học tập và nghiên cứu.',
            tech: ['Gemini API', 'Java 21', 'REST', 'Multimodal'], metrics: ['1 AI gateway', '2 modalities', 'Safe fallback'],
            flow: [['fa-message', 'Prompt'], ['fa-route', 'AI Gateway'], ['fa-wand-magic-sparkles', 'Gemini']],
            live: 'tech_research.html',
            decisions: [['Một Gemini client dùng chung', 'Giảm duplicated HTTP code, thống nhất timeout, parsing và xử lý lỗi.'], ['Prompt theo use case', 'Mỗi domain tự sở hữu context nhưng không sở hữu transport client.'], ['Fail-safe response', 'Khi provider lỗi, UI nhận thông báo có kiểm soát thay vì stack trace.']],
            tradeoffs: ['Phụ thuộc provider bên ngoài.', 'Prompt dài tăng latency và chi phí.', 'Structured output vẫn cần validation.'],
            security: ['API key chỉ ở environment backend.', 'Giới hạn input và loại bỏ markup nguy hiểm.', 'Không đưa dữ liệu nhạy cảm vào prompt log.']
        },
        {
            id: 'analytics-dashboard', title: 'Streaming Analytics Dashboard',
            categories: ['fullstack', 'cloud'], categoryLabel: 'Data · Observability', status: 'In Progress',
            description: 'Dashboard nhập CSV, tổng hợp sự kiện và trực quan hóa KPI theo thời gian gần thực.',
            tech: ['JavaScript', 'Chart.js', 'Worker', 'Object Storage'], metrics: ['100K rows', '60 FPS charts', 'Async import'],
            flow: [['fa-file-csv', 'Data Sources'], ['fa-gears', 'Processing'], ['fa-chart-line', 'Dashboard']],
            live: null,
            decisions: [['Web Worker cho parsing', 'Tách tác vụ CSV khỏi main thread để giao diện không đóng băng.'], ['Pre-aggregation', 'Tính KPI theo bucket thay vì render toàn bộ điểm dữ liệu.'], ['Schema validation', 'Phát hiện cột thiếu và kiểu dữ liệu sai trước khi ingest.']],
            tradeoffs: ['Pre-aggregation làm mất một phần độ chi tiết.', 'Xử lý client bị giới hạn bởi bộ nhớ thiết bị.', 'Realtime làm tăng độ phức tạp đồng bộ.'],
            security: ['Giới hạn kích thước file.', 'CSV formula injection protection.', 'Không lưu dữ liệu upload lâu hơn cần thiết.']
        },
        {
            id: 'social-platform', title: 'Facebook Mini Social Platform',
            categories: ['java', 'fullstack'], categoryLabel: 'Social · Realtime', status: 'In Progress',
            description: 'Mạng xã hội thu nhỏ với newsfeed, friendship graph, comment và notification realtime.',
            tech: ['Spring Boot', 'WebSocket', 'MySQL', 'Cloudinary'], metrics: ['Fan-out feed', 'Realtime alerts', 'Cursor paging'],
            flow: [['fa-users', 'Social Clients'], ['fa-newspaper', 'Feed Service'], ['fa-bell', 'Events']],
            live: null,
            decisions: [['Cursor pagination', 'Ổn định hơn offset khi feed liên tục có bài mới.'], ['Hybrid fan-out', 'Fan-out on write cho user thường và on read cho tài khoản có nhiều follower.'], ['Object storage cho media', 'Giảm tải ứng dụng và tận dụng CDN.']],
            tradeoffs: ['Feed ranking cần thêm dữ liệu hành vi.', 'WebSocket tăng connection overhead.', 'Hybrid fan-out phức tạp hơn một chiến lược duy nhất.'],
            security: ['Privacy check trên mọi feed query.', 'Signed upload và content moderation.', 'Rate limit comment, follow và message.']
        },
        {
            id: 'vision-api', title: 'Image Recognition API',
            categories: ['ai', 'cloud'], categoryLabel: 'Computer Vision · MLOps', status: 'Research',
            description: 'Pipeline nhận diện ảnh gồm preprocessing, model serving, confidence policy và theo dõi model drift.',
            tech: ['Python', 'TensorFlow', 'OpenCV', 'REST'], metrics: ['Batch inference', 'Model versioning', 'Drift alerts'],
            flow: [['fa-image', 'Image'], ['fa-microchip', 'Inference API'], ['fa-tags', 'Prediction']],
            live: null,
            decisions: [['Model server riêng', 'Tách dependency ML nặng khỏi application API và scale theo GPU/CPU profile.'], ['Confidence threshold', 'Chuyển kết quả không chắc chắn sang review thay vì đoán cưỡng ép.'], ['Versioned artifacts', 'Có thể rollback model độc lập với code ứng dụng.']],
            tradeoffs: ['Model chính xác hơn thường tốn latency hơn.', 'GPU giảm thời gian xử lý nhưng tăng chi phí idle.', 'Threshold cao làm tăng manual review.'],
            security: ['Kiểm tra định dạng và decompression bomb.', 'Xóa metadata nhạy cảm.', 'Quota theo API key và cô lập inference worker.']
        },
        {
            id: 'commerce-platform', title: 'Resilient Commerce Platform',
            categories: ['java', 'cloud', 'fullstack'], categoryLabel: 'Commerce · Cloud', status: 'Architecture Ready',
            description: 'Nền tảng bán hàng với inventory reservation, payment workflow và xử lý webhook idempotent.',
            tech: ['Spring Boot', 'MySQL', 'Redis', 'VNPay'], metrics: ['Idempotent pay', 'Saga workflow', '99.9% target'],
            flow: [['fa-cart-shopping', 'Storefront'], ['fa-boxes-stacked', 'Order Core'], ['fa-credit-card', 'Payment']],
            live: null,
            decisions: [['Reservation thay vì trừ kho ngay', 'Giữ hàng có thời hạn trong lúc thanh toán và tự động trả kho khi hết TTL.'], ['Idempotent webhook', 'Mỗi callback thanh toán chỉ được áp dụng một lần dù provider retry.'], ['Outbox pattern', 'Đồng bộ event với transaction order mà không cần distributed transaction.']],
            tradeoffs: ['Reservation làm inventory state phức tạp.', 'Saga chấp nhận eventual consistency.', 'Outbox cần worker và cleanup.'],
            security: ['Xác minh chữ ký payment webhook.', 'Không lưu dữ liệu thẻ.', 'RBAC cho thao tác giá, kho và hoàn tiền.']
        },
        {
            id: 'devops-pipeline', title: 'Cloud Delivery Pipeline',
            categories: ['cloud'], categoryLabel: 'Cloud · DevOps', status: 'Operational',
            description: 'Pipeline build, test, container scan và deploy có health check, rollback cùng quản lý cấu hình bằng environment.',
            tech: ['GitHub Actions', 'Docker', 'Render', 'Health Checks'], metrics: ['7 automated tests', 'Zero secret in Git', 'Rollback ready'],
            flow: [['fa-code-branch', 'Git Push'], ['fa-gears', 'CI Pipeline'], ['fa-cloud-arrow-up', 'Deploy']],
            live: '../index.html',
            decisions: [['Immutable artifact', 'Cùng một image hoặc JAR đi qua các môi trường để giảm khác biệt build.'], ['Health-gated release', 'Chỉ đưa traffic vào instance sau khi startup và dependency check thành công.'], ['Environment configuration', 'Secret và endpoint không nằm trong source hoặc frontend bundle.']],
            tradeoffs: ['Free-tier cold start làm request đầu chậm.', 'Rolling deploy cần tài nguyên chạy song song.', 'Health check quá nông có thể bỏ sót dependency lỗi.'],
            security: ['Dependency scanning trong CI.', 'Secret qua environment và rotation.', 'Least-privilege token cho pipeline.']
        },
        {
            id: 'task-manager', title: 'Offline-first Task Manager',
            categories: ['fullstack'], categoryLabel: 'PWA · Productivity', status: 'Prototype',
            description: 'Ứng dụng công việc tối giản với offline queue, deadline, ưu tiên và đồng bộ khi có mạng trở lại.',
            tech: ['PWA', 'JavaScript', 'IndexedDB', 'Service Worker'], metrics: ['Offline ready', 'Fast startup', 'Sync queue'],
            flow: [['fa-list-check', 'Task UI'], ['fa-hard-drive', 'Local Store'], ['fa-rotate', 'Sync API']],
            live: null,
            decisions: [['Local-first writes', 'Thao tác phản hồi tức thì và được đưa vào sync queue khi offline.'], ['Conflict policy đơn giản', 'Last-write-wins kèm version phù hợp dữ liệu cá nhân một người dùng.'], ['Service Worker cache', 'App shell mở được khi mạng chập chờn.']],
            tradeoffs: ['Conflict nâng cao cần CRDT hoặc merge UI.', 'Cache app shell phải quản lý version.', 'Offline data cần giới hạn dung lượng.'],
            security: ['Không cache token dài hạn.', 'Clear local data khi logout.', 'CSP và kiểm tra nội dung task trước render.']
        },
        {
            id: 'weather-platform', title: 'Weather Intelligence Web',
            categories: ['fullstack', 'cloud'], categoryLabel: 'API Integration · Web', status: 'Prototype',
            description: 'Dự báo thời tiết theo thành phố với cache response, graceful degradation và trải nghiệm mobile.',
            tech: ['JavaScript', 'Weather API', 'Cache', 'CSS'], metrics: ['7-day forecast', 'Cached response', 'Mobile ready'],
            flow: [['fa-location-dot', 'Location'], ['fa-cloud-sun', 'Weather API'], ['fa-mobile-screen', 'Forecast UI']],
            live: null,
            decisions: [['Backend proxy cho provider', 'Ẩn API key, chuẩn hóa response và áp dụng quota tập trung.'], ['Cache theo tọa độ', 'Giảm số call provider nhưng vẫn giữ độ mới phù hợp dữ liệu thời tiết.'], ['Stale-if-error', 'Hiển thị dữ liệu gần nhất khi provider gián đoạn.']],
            tradeoffs: ['Cache có thể chậm cập nhật thời tiết đột biến.', 'Geocoding tạo thêm dependency.', 'Dữ liệu provider khác nhau về đơn vị và độ chính xác.'],
            security: ['Không gửi vị trí khi chưa được phép.', 'Rate limit proxy.', 'Không log tọa độ chính xác của người dùng.']
        },
        {
            id: 'travel-booking', title: 'Travel Booking Experience',
            categories: ['java', 'fullstack'], categoryLabel: 'Booking · Geospatial', status: 'Concept',
            description: 'Nền tảng khám phá và đặt tour với inventory, bản đồ, review và luồng giữ chỗ có thời hạn.',
            tech: ['Spring Boot', 'MySQL', 'Maps API', 'Payment'], metrics: ['Geo search', 'Hold inventory', 'Review flow'],
            flow: [['fa-map-location-dot', 'Discovery'], ['fa-calendar-check', 'Booking'], ['fa-credit-card', 'Checkout']],
            live: null,
            decisions: [['Time-bound booking hold', 'Ngăn overbooking trong lúc người dùng hoàn tất thanh toán.'], ['Geo index', 'Tối ưu truy vấn tour theo bán kính và khu vực.'], ['Review verified booking', 'Chỉ khách đã hoàn tất tour mới được đánh giá.']],
            tradeoffs: ['Giữ chỗ làm giảm inventory tạm thời.', 'Maps API phát sinh chi phí theo lượt gọi.', 'Tìm kiếm geo cần index chuyên dụng khi scale.'],
            security: ['Xác minh ownership của booking.', 'Payment callback có chữ ký.', 'Ẩn thông tin liên hệ trước khi đặt chỗ.']
        },
        {
            id: 'tcp-network', title: 'Concurrent TCP Gateway',
            categories: ['java', 'cloud'], categoryLabel: 'Networking · Performance', status: 'Lab',
            description: 'Ứng dụng client-server đa luồng với connection lifecycle, bounded queue và backpressure.',
            tech: ['Java Networking', 'Thread Pool', 'TCP/IP', 'Metrics'], metrics: ['Bounded workers', 'Backpressure', 'Graceful shutdown'],
            flow: [['fa-laptop', 'TCP Clients'], ['fa-network-wired', 'Gateway'], ['fa-server', 'Worker Pool']],
            live: null,
            decisions: [['Bounded executor', 'Ngăn số thread tăng không giới hạn khi có traffic burst.'], ['Length-prefixed protocol', 'Tách message frame chính xác trên TCP stream.'], ['Graceful shutdown', 'Dừng nhận kết nối mới nhưng hoàn tất request đang xử lý.']],
            tradeoffs: ['Blocking I/O đơn giản nhưng tốn thread ở concurrency cao.', 'Protocol tùy chỉnh cần versioning.', 'Backpressure có thể từ chối client khi quá tải.'],
            security: ['Connection timeout và giới hạn frame.', 'TLS khi đi qua mạng không tin cậy.', 'Chống slowloris bằng read deadline.']
        },
        {
            id: 'music-streaming', title: 'Music Streaming Web',
            categories: ['fullstack', 'cloud'], categoryLabel: 'Media · Fullstack', status: 'Concept',
            description: 'Ứng dụng nghe nhạc với playlist, tìm kiếm, media delivery qua CDN và lưu trạng thái phát.',
            tech: ['React', 'Node.js', 'MongoDB', 'CDN'], metrics: ['Range requests', 'CDN delivery', 'Resume playback'],
            flow: [['fa-music', 'Player'], ['fa-magnifying-glass', 'Catalog API'], ['fa-globe', 'Media CDN']],
            live: null,
            decisions: [['CDN cho media', 'Tách bandwidth âm thanh khỏi application server.'], ['HTTP range requests', 'Cho phép tua và tiếp tục tải mà không cần tải lại toàn bộ file.'], ['Denormalized catalog', 'Tối ưu browse/search và chấp nhận update bất đồng bộ.']],
            tradeoffs: ['CDN invalidation cần version asset.', 'Denormalization làm write phức tạp.', 'Streaming bitrate cao tăng chi phí egress.'],
            security: ['Signed media URL có TTL.', 'Quota và chống hotlink.', 'Kiểm soát quyền sở hữu playlist.']
        }
    ];

    const grid = document.getElementById('projects-grid');
    const count = document.getElementById('project-count');
    const empty = document.getElementById('project-empty');
    const modal = document.getElementById('case-modal');
    let selectedProject = null;
    let activeFilter = 'all';
    let activeC4Level = 'context';
    let lastFocusedElement = null;

    const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);

    function renderProjects(filter = activeFilter) {
        activeFilter = filter;
        const visible = filter === 'all' ? projects : projects.filter(project => project.categories.includes(filter));
        count.textContent = `${visible.length} / ${projects.length} hệ thống`;
        empty.hidden = visible.length > 0;
        grid.innerHTML = visible.map((project, index) => projectCard(project, index)).join('');
        requestAnimationFrame(() => {
            grid.querySelectorAll('.architect-card').forEach((card, index) => {
                setTimeout(() => card.classList.add('visible'), Math.min(index * 55, 330));
            });
        });
    }

    function projectCard(project, index) {
        const liveAction = project.live
            ? `<a class="project-cta" href="${project.live}" data-card-action><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>`
            : `<span class="project-cta disabled" aria-disabled="true" title="Demo đang được hoàn thiện"><i class="fa-solid fa-hourglass-half"></i> Demo soon</span>`;
        return `
            <article class="architect-card${project.featured ? ' featured' : ''}" tabindex="0" data-project-id="${project.id}" aria-label="Mở case study ${escapeHtml(project.title)}">
                <div class="architecture-preview">
                    <span class="architecture-label">SYSTEM FLOW / ${String(index + 1).padStart(2, '0')}</span>
                    <span class="architecture-status">${escapeHtml(project.status)}</span>
                    <div class="mini-architecture">${project.flow.map(node => `
                        <div class="mini-node"><span><i class="fa-solid ${node[0]}"></i>${escapeHtml(node[1])}</span></div>`).join('')}
                    </div>
                </div>
                <div class="architect-card-body">
                    <div class="project-topline"><span class="project-category">${escapeHtml(project.categoryLabel)}</span><span class="project-index">P${String(index + 1).padStart(2, '0')}</span></div>
                    <h3>${escapeHtml(project.title)}</h3>
                    <p>${escapeHtml(project.description)}</p>
                    <div class="engineering-metrics">${metricChips(project.metrics)}</div>
                    <div class="tech-stack">${project.tech.map(item => `<span class="tech-badge">${escapeHtml(item)}</span>`).join('')}</div>
                    <div class="project-card-actions">
                        <a class="project-cta" href="${githubProfile}" target="_blank" rel="noopener noreferrer" data-card-action><i class="fa-brands fa-github"></i> GitHub</a>
                        ${liveAction}
                        <button class="project-cta architecture" type="button" data-open-case="${project.id}" data-card-action><i class="fa-solid fa-diagram-project"></i> C4 / ADR</button>
                    </div>
                </div>
            </article>`;
    }

    function metricChips(metrics) {
        return metrics.map(metric => `<span class="metric-chip"><i class="fa-solid fa-signal"></i>${escapeHtml(metric)}</span>`).join('');
    }

    function openCase(projectId, updateHash = true) {
        selectedProject = projects.find(project => project.id === projectId);
        if (!selectedProject) return;
        lastFocusedElement = document.activeElement;
        activeC4Level = 'context';
        document.getElementById('case-kicker').textContent = `${selectedProject.categoryLabel} · ${selectedProject.status}`;
        document.getElementById('case-title').textContent = selectedProject.title;
        document.getElementById('case-summary').textContent = selectedProject.description;
        document.getElementById('case-metrics').innerHTML = metricChips(selectedProject.metrics);
        document.getElementById('case-stack').innerHTML = selectedProject.tech.map(item => `<span class="tech-badge">${escapeHtml(item)}</span>`).join('');
        document.getElementById('case-decisions').innerHTML = selectedProject.decisions.map((decision, index) => `
            <article class="decision-card"><span class="decision-number">ADR-${String(index + 1).padStart(2, '0')}</span><div><h3>${escapeHtml(decision[0])}</h3><p>${escapeHtml(decision[1])}</p></div></article>`).join('');
        document.getElementById('case-tradeoffs').innerHTML = selectedProject.tradeoffs.map(item => `<li>${escapeHtml(item)}</li>`).join('');
        document.getElementById('case-security').innerHTML = selectedProject.security.map(item => `<li>${escapeHtml(item)}</li>`).join('');
        document.getElementById('case-actions').innerHTML = `
            <a class="project-cta" href="${githubProfile}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Source</a>
            ${selectedProject.live ? `<a class="project-cta architecture" href="${selectedProject.live}"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>` : ''}`;
        switchCaseTab('architecture');
        setC4Level('context');
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('case-open');
        modal.querySelector('.case-close').focus();
        if (updateHash) history.replaceState(null, '', `#case-${selectedProject.id}`);
    }

    function closeCase() {
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('case-open');
        if (location.hash.startsWith('#case-')) history.replaceState(null, '', location.pathname + location.search);
        lastFocusedElement?.focus();
    }

    function switchCaseTab(tabName) {
        document.querySelectorAll('[data-case-tab]').forEach(button => {
            const active = button.dataset.caseTab === tabName;
            button.classList.toggle('active', active);
            button.setAttribute('aria-selected', String(active));
        });
        document.querySelectorAll('[data-case-panel]').forEach(panel => {
            const active = panel.dataset.casePanel === tabName;
            panel.hidden = !active;
            panel.classList.toggle('active', active);
        });
    }

    function setC4Level(level) {
        if (!selectedProject) return;
        activeC4Level = level;
        document.querySelectorAll('[data-c4-level]').forEach(button => button.classList.toggle('active', button.dataset.c4Level === level));
        const stack = selectedProject.tech;
        const levels = {
            context: [
                ['fa-user', 'Primary users', 'Web / Mobile'],
                ['fa-cube', selectedProject.title, 'System boundary'],
                ['fa-cloud', 'External services', 'Provider APIs'],
                ['fa-chart-line', 'Operations', 'Metrics & alerts']
            ],
            container: [
                ['fa-display', 'Client App', 'Presentation'],
                ['fa-shield-halved', 'API Layer', 'Auth & validation'],
                ['fa-gears', 'Core Service', stack[0] || 'Application'],
                ['fa-database', 'Data & Infra', stack.slice(-2).join(' · ')]
            ],
            component: [
                ['fa-code', 'Controller', 'API contracts'],
                ['fa-diagram-project', 'Domain Service', 'Business rules'],
                ['fa-box-archive', 'Repository', 'Persistence'],
                ['fa-tower-broadcast', 'Adapters', 'Events / Providers']
            ]
        };
        const captions = {
            context: 'C4 Level 1 · Phạm vi hệ thống, người dùng và các dependency bên ngoài.',
            container: 'C4 Level 2 · Các container triển khai và trách nhiệm chính.',
            component: 'C4 Level 3 · Các component bên trong application service.'
        };
        document.getElementById('case-architecture').innerHTML = levels[level].map(node => `
            <div class="c4-node"><span><i class="fa-solid ${node[0]}"></i><strong>${escapeHtml(node[1])}</strong><small>${escapeHtml(node[2])}</small></span></div>`).join('');
        document.getElementById('diagram-caption').textContent = captions[level];
    }

    document.querySelectorAll('.project-filter').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.project-filter').forEach(item => {
                const active = item === button;
                item.classList.toggle('active', active);
                item.setAttribute('aria-pressed', String(active));
            });
            renderProjects(button.dataset.filter);
        });
    });

    grid.addEventListener('click', event => {
        if (event.target.closest('[data-card-action]')) return;
        const card = event.target.closest('[data-project-id]');
        if (card) openCase(card.dataset.projectId);
    });
    grid.addEventListener('keydown', event => {
        if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-project-id]')) {
            event.preventDefault();
            openCase(event.target.dataset.projectId);
        }
    });
    grid.addEventListener('click', event => {
        const trigger = event.target.closest('[data-open-case]');
        if (trigger) openCase(trigger.dataset.openCase);
    });
    document.querySelectorAll('[data-close-case]').forEach(element => element.addEventListener('click', closeCase));
    document.querySelectorAll('[data-case-tab]').forEach(button => button.addEventListener('click', () => switchCaseTab(button.dataset.caseTab)));
    document.querySelectorAll('[data-c4-level]').forEach(button => button.addEventListener('click', () => setC4Level(button.dataset.c4Level)));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !modal.hidden) closeCase();
        if (event.key === 'Tab' && !modal.hidden) {
            const focusable = [...modal.querySelectorAll('button:not([disabled]), a[href]')].filter(element => element.offsetParent !== null);
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable.at(-1);
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
    });

    renderProjects();
    const deepLinkedProject = location.hash.startsWith('#case-') ? location.hash.slice(6) : null;
    if (deepLinkedProject) openCase(deepLinkedProject, false);
})();
