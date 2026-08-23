(function() {
            const trialModal = document.getElementById('trial-modal');
            const trialBtn = document.getElementById('trial-btn');
            const bookNowBtn = document.getElementById('book-now-btn');
            const closeModal = document.querySelector('.close-modal');

            function openBooking(msg = "") {
                const modal = document.getElementById('trial-modal');
                if (modal) {
                    modal.style.display = 'flex';
                    if (msg) {
                        const msgField = document.getElementById('message');
                        if (msgField) msgField.value = msg;
                    }
                    document.body.style.overflow = 'hidden';
                }
            }

            window.closeBooking = function() {
                const modal = document.getElementById('trial-modal');
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }

            if (trialBtn) trialBtn.onclick = (e) => { e.stopImmediatePropagation(); e.preventDefault(); openBooking(); };
            if (bookNowBtn) bookNowBtn.onclick = (e) => { e.stopImmediatePropagation(); e.preventDefault(); openBooking(); };

            window.addEventListener('click', (e) => {
                const trialModal = document.getElementById('trial-modal');
                if (e.target === trialModal) closeBooking();
            });

            const trialForm = document.getElementById('trial-form');
            if (trialForm) {
                trialForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const btn = this.querySelector('button');
                    const originalText = btn.innerText;
                    btn.innerText = "ĐANG GỬI...";
                    btn.disabled = true;

                    // Sử dụng cấu hình của bạn
                    const serviceID = "service_mm7h96j";
                    const templateID = "template_t59gmii";
                    const publicKey = "KcZVp8Gd0nlMDosx9";

                    emailjs.sendForm(serviceID, templateID, this, publicKey)
                        .then(() => {
                            const toast = document.getElementById('toast');
                            if (toast) {
                                toast.innerText = "Gửi thành công! Tôi sẽ liên hệ bạn sớm.";
                                toast.style.display = 'block';
                                toast.style.backgroundColor = '#10b981';
                                setTimeout(() => toast.style.display = 'none', 3000);
                            }
                            btn.innerText = originalText;
                            btn.disabled = false;
                            closeBooking();
                            this.reset();
                        }, (err) => {
                            console.error("EmailJS Error:", err);
                            // Hiển thị lỗi chi tiết để dễ debug
                            alert("Lỗi EmailJS: " + (err.text || JSON.stringify(err)) + "\n\nVui lòng kiểm tra lại Service ID, Template ID hoặc Public Key trong tài khoản EmailJS của bạn.");
                            btn.innerText = originalText;
                            btn.disabled = false;
                        });
                });
            }

            window.changeTutorImage = async function(input) {
                const file = input.files[0];
                if (file) {
                    try {
                        const compressedBase64 = await compressImage(file);
                        document.getElementById('main-tutor-img').src = compressedBase64;
                        localStorage.setItem('tutor_profile_img', compressedBase64);
                        document.getElementById('btn-remove-img').style.display = 'inline-flex';
                    } catch (e) {
                        console.error("Lỗi xử lý ảnh:", e);
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            document.getElementById('main-tutor-img').src = e.target.result;
                            try {
                                localStorage.setItem('tutor_profile_img', e.target.result);
                            } catch(err) { console.warn("Không thể lưu ảnh vào bộ nhớ trình duyệt vì quá nặng."); }
                            document.getElementById('btn-remove-img').style.display = 'inline-flex';
                        };
                        reader.readAsDataURL(file);
                    }
                }
            };

            function compressImage(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (event) => {
                        const img = new Image();
                        img.src = event.target.result;
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX_WIDTH = 800;
                            const scaleSize = MAX_WIDTH / img.width;
                            if (img.width > MAX_WIDTH) {
                                canvas.width = MAX_WIDTH;
                                canvas.height = img.height * scaleSize;
                            } else {
                                canvas.width = img.width;
                                canvas.height = img.height;
                            }
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            resolve(canvas.toDataURL('image/jpeg', 0.7));
                        };
                        img.onerror = reject;
                    };
                    reader.onerror = reject;
                });
            }

            window.removeTutorImage = function() {
                if (confirm('Bạn có chắc muốn xóa ảnh đại diện này?')) {
                    localStorage.removeItem('tutor_profile_img');
                    document.getElementById('main-tutor-img').src = 'https://ui-avatars.com/api/?name=Truong&background=f15a24&color=fff&size=512';
                    document.getElementById('btn-remove-img').style.display = 'none';
                }
            };

            window.openLightbox = function(element) {
                const lightbox = document.getElementById('lightbox');
                const lightboxImg = document.getElementById('lightbox-img');
                const imgSrc = element.querySelector('img').src;
                lightboxImg.src = imgSrc;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            };

            window.closeLightbox = function() {
                const lightbox = document.getElementById('lightbox');
                if (lightbox) lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            };

            const API_BASE = `${API_CONFIG.BASE_URL}/api/certificates`;

            async function loadCertificates() {
                try {
                    const response = await fetch(API_BASE);
                    const certs = await response.json();
                    const gallery = document.getElementById('cert-gallery');
                    if (!gallery) return;

                    // Clear existing (except maybe placeholders if any, but better clear all and re-render)
                    gallery.innerHTML = '';

                    certs.forEach(cert => {
                        renderCertificate(cert);
                    });
                } catch (error) {
                    console.error("Lỗi tải chứng nhận:", error);
                }
            }

            function renderCertificate(cert) {
                const gallery = document.getElementById('cert-gallery');
                const certItem = document.createElement('div');
                certItem.className = 'cert-item';
                certItem.setAttribute('data-id', cert.id);
                certItem.onclick = function(e) {
                    if (e.target.classList.contains('fa-trash-can') || e.target.closest('.cert-delete-btn')) return;
                    window.openLightbox(this);
                };

                const isAdmin = false;
                const deleteBtn = isAdmin ? `<button class="cert-delete-btn" onclick="deleteCert(${cert.id})"><i class="fa-solid fa-trash-can"></i></button>` : '';

                certItem.innerHTML = `
                    <img src="${API_CONFIG.BASE_URL}${cert.imageUrl}" alt="${cert.title}">
                    <div class="cert-overlay"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
                    ${deleteBtn}
                `;
                gallery.appendChild(certItem);
            }

            window.deleteCert = async function(id) {
                if (!confirm("Bạn có chắc muốn xóa chứng nhận này?")) return;
                try {
                    const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
                    if (response.ok) {
                        const el = document.querySelector(`.cert-item[data-id="${id}"]`);
                        if (el) el.remove();
                    }
                } catch (error) {
                    console.error("Lỗi xóa chứng nhận:", error);
                }
            };

            const certUpload = document.getElementById('cert-upload');
            if (certUpload) {
                certUpload.addEventListener('change', async function(e) {
                    const files = e.target.files;
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('title', 'Chứng nhận mới');

                        try {
                            const response = await fetch(API_BASE, {
                                method: 'POST',
                                body: formData
                            });
                            if (response.ok) {
                                const newCert = await response.json();
                                renderCertificate(newCert);
                            }
                        } catch (error) {
                            console.error("Lỗi upload chứng nhận:", error);
                        }
                    }
                });
            }

            const track = document.getElementById('testimonial-track');
            const prevBtn = document.getElementById('prev-testim');
            const nextBtn = document.getElementById('next-testim');
            let currentPos = 0;

            if (nextBtn && track) {
                nextBtn.addEventListener('click', () => {
                    const cardWidth = track.querySelector('.testimonial-card-pro').offsetWidth + 30;
                    const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;
                    currentPos = Math.min(currentPos + cardWidth, maxScroll);
                    track.style.transform = `translateX(-${currentPos}px)`;
                });
            }

            if (prevBtn && track) {
                prevBtn.addEventListener('click', () => {
                    const cardWidth = track.querySelector('.testimonial-card-pro').offsetWidth + 30;
                    currentPos = Math.max(currentPos - cardWidth, 0);
                    track.style.transform = `translateX(-${currentPos}px)`;
                });
            }

            const monthDisplay = document.getElementById('monthDisplay');
            const daysContainer = document.getElementById('calendar-days');
            let currentDate = new Date(2026, 4, 7);

            const mySchedule = {
                1: 1, 2: 1, 3: 2, 4: 1, 5: 2, 6: 2, 7: 1,
                8: 1, 9: 2, 10: 2, 11: 1, 12: 1, 13: 2, 14: 2,
                15: 1, 16: 1, 17: 2, 18: 1, 19: 2, 20: 2, 21: 1,
                22: 1, 23: 2, 24: 2, 25: 1, 26: 1, 27: 2, 28: 2,
                29: 1, 30: 2, 31: 2
            };

            function renderCalendar(date) {
                if (!daysContainer || !monthDisplay) return;
                const year = date.getFullYear();
                const month = date.getMonth();
                const firstDay = new Date(year, month, 1).getDay();
                let startDay = firstDay === 0 ? 6 : firstDay - 1;
                const daysInMonth = new Date(year, month + 1, 0).getDate();

                monthDisplay.innerText = `Tháng ${month + 1}, ${year}`;
                daysContainer.innerHTML = '';

                for (let i = 0; i < startDay; i++) {
                    daysContainer.innerHTML += '<div></div>';
                }

                for (let d = 1; d <= daysInMonth; d++) {
                    let statusClass = '';
                    const status = mySchedule[d];
                    if (d < 7) statusClass = 'past';
                    else if (status === 1) statusClass = 'busy';
                    else if (status === 2) statusClass = 'available';
                    const dayEl = document.createElement('div');
                    dayEl.className = `day ${statusClass}`;
                    dayEl.innerText = d;
                    if (status === 2 && d >= 7) {
                        dayEl.style.cursor = 'pointer';
                        dayEl.onclick = () => openBooking(`Em muốn đặt lịch học thử vào ngày ${d}/${month + 1}/${year}`);
                    }
                    daysContainer.appendChild(dayEl);
                }
            }

            function checkAdmin() {}

            // Review System Logic
            const REVIEW_API = `${API_CONFIG.BASE_URL}/api/reviews`;

            window.openReviewModal = () => document.getElementById('review-modal').style.display = 'flex';
            window.closeReviewModal = () => document.getElementById('review-modal').style.display = 'none';

            async function loadReviews() {
                try {
                    const response = await fetch(REVIEW_API);
                    const reviews = await response.json();
                    reviews.forEach(review => renderReview(review));
                } catch (error) {
                    console.error("Lỗi tải đánh giá:", error);
                }
            }

            function renderReview(review) {
                const track = document.getElementById('testimonial-track');
                if (!track) return;

                const card = document.createElement('div');
                card.className = 'testimonial-card-pro';
                card.setAttribute('data-id', review.id);

                const stars = '<i class="fa-solid fa-star"></i>'.repeat(review.rating);

                // Logic: Admin can delete all, users can only delete their own (tracked via localStorage)
                const isAdmin = false;
                const myReviews = JSON.parse(localStorage.getItem('my_reviews') || '[]');
                const isMine = myReviews.includes(review.id);

                const deleteBtn = (isAdmin || isMine) ? `<i class="fa-solid fa-trash-can review-delete-btn" style="top: 20px; right: 20px;" onclick="deleteReview(${review.id})"></i>` : '';

                card.innerHTML = `
                    ${deleteBtn}
                    <i class="fa-solid fa-quote-right quote-icon"></i>
                    <div class="stars">${stars}</div>
                    <p>"${review.content}"</p>
                    <div class="student-info">
                        <strong>${review.author}</strong>
                        <span>${review.role}</span>
                    </div>
                `;
                track.appendChild(card);
            }

            window.deleteReview = async function(id) {
                if (!confirm("Xóa đánh giá này?")) return;
                try {
                    await fetch(`${REVIEW_API}/${id}`, { method: 'DELETE' });
                    const el = document.querySelector(`.testimonial-card-pro[data-id="${id}"]`);
                    if (el) el.remove();
                    // Reset slider position
                    currentPos = 0;
                    if (track) track.style.transform = `translateX(0)`;
                } catch (error) {
                    console.error("Lỗi xóa đánh giá:", error);
                }
            };

            const reviewForm = document.getElementById('review-form');
            if (reviewForm) {
                reviewForm.onsubmit = async function(e) {
                    e.preventDefault();
                    const btn = this.querySelector('button');
                    btn.innerText = "Đang gửi...";
                    btn.disabled = true;

                    const reviewData = {
                        author: document.getElementById('review-author').value,
                        role: document.getElementById('review-role').value,
                        content: document.getElementById('review-content').value,
                        rating: parseInt(this.querySelector('input[name="rating"]:checked').value)
                    };

                    try {
                        const response = await fetch(REVIEW_API, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(reviewData)
                        });
                        if (response.ok) {
                            const newReview = await response.json();

                            // Save to my_reviews in localStorage
                            const myReviews = JSON.parse(localStorage.getItem('my_reviews') || '[]');
                            myReviews.push(newReview.id);
                            localStorage.setItem('my_reviews', JSON.stringify(myReviews));

                            renderReview(newReview);
                            closeReviewModal();
                            this.reset();
                            alert("Cảm ơn bạn đã đánh giá!");
                        }
                    } catch (error) {
                        console.error("Lỗi gửi đánh giá:", error);
                        alert("Có lỗi xảy ra, vui lòng thử lại sau.");
                    } finally {
                        btn.innerText = "Gửi Đánh Giá";
                        btn.disabled = false;
                    }
                };
            }

            window.addEventListener('DOMContentLoaded', () => {
                const savedImg = localStorage.getItem('tutor_profile_img');
                if (savedImg) {
                    const profileImg = document.getElementById('main-tutor-img');
                    if (profileImg) profileImg.src = savedImg;
                }
                renderCalendar(currentDate);
                checkAdmin();
                loadCertificates();
                loadReviews(); // Load reviews on startup
            });
        })();
