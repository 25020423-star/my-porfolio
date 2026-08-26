window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar') || document.querySelector('.main-nav');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Simple reveal animation on scroll
const revealElements = document.querySelectorAll('section');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
};

const revealOptions = {
    threshold: 0.15
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease-out';
    revealObserver.observe(el);
});

// --- Modal & Email Registration Logic ---

// CẤU HÌNH EMAILJS TẠI ĐÂY
const EMAILJS_CONFIG = {
    PUBLIC_KEY: "KcZVp8Gd0nlMDosx9",    // Thay bằng Public Key của bạn
    SERVICE_ID: "service_mm7h96j",    // Thay bằng Service ID của bạn
    TEMPLATE_ID: "template_t59gmii"   // Thay bằng Template ID của bạn
};

const trialBtn = document.getElementById('trial-btn');
const trialModal = document.getElementById('trial-modal');
const closeModal = document.querySelector('.close-modal');
const trialForm = document.getElementById('trial-form');
const toast = document.getElementById('toast');

// Modal Toggle
if (trialBtn && trialModal) {
    trialBtn.addEventListener('click', () => {
        trialModal.style.display = 'flex';
        setTimeout(() => trialModal.classList.add('show'), 10);
        document.body.style.overflow = 'hidden';
    });

    const closeActions = () => {
        trialModal.classList.remove('show');
        setTimeout(() => trialModal.style.display = 'none', 300);
        document.body.style.overflow = 'auto';
    };

    if (closeModal) closeModal.addEventListener('click', closeActions);
    
    window.addEventListener('click', (e) => {
        if (e.target === trialModal) closeActions();
    });
}

// Initialize EmailJS
if (typeof emailjs !== 'undefined') {
    if (EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
}

// Form Submission
if (trialForm) {
    trialForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Kiểm tra xem đã cấu hình chưa
        if (EMAILJS_CONFIG.PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
            showToast('Bạn chưa cấu hình Public Key trong main.js!', 'error');
            return;
        }

        const submitBtn = trialForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Đang gửi...';
        submitBtn.disabled = true;

        emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, this)
            .then(() => {
                showToast('Gửi thành công! Tôi sẽ liên hệ bạn sớm.');
                trialForm.reset();
                setTimeout(() => {
                    trialModal.classList.remove('show');
                    setTimeout(() => trialModal.style.display = 'none', 300);
                    document.body.style.overflow = 'auto';
                }, 1000);
            }, (error) => {
                showToast('Gửi thất bại. Lỗi: ' + (error.text || 'Kiểm tra ID'), 'error');
                console.error('EmailJS Error:', error);
            })
            .finally(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
    });
}

function showToast(message, type = 'success') {
    if (toast) {
        toast.innerText = message;
        toast.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// --- Typing Animation Logic ---
const typingText = document.getElementById('typing-text');
const phrases = ["Java Developer", "Chemistry Tutor", "UET Student"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 150;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at the end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Load hero image from backend setting
async function loadHeroImage() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/settings/hero_image_url`);
        if (response.ok) {
            const data = await response.json();
            const configuredUrl = data?.settingValue?.trim();
            const heroImg = document.getElementById('hero-img');
            if (!configuredUrl || !heroImg) return;

            // Keep the bundled image visible unless the configured replacement
            // has actually loaded. Old database values may point at files that
            // no longer exist after a redeploy.
            const replacement = new Image();
            replacement.onload = () => {
                if (replacement.naturalWidth > 0) heroImg.src = configuredUrl;
            };
            replacement.onerror = () => {
                console.warn('Configured hero image is unavailable; using bundled fallback.');
            };
            replacement.src = configuredUrl;
        }
    } catch (error) {
        console.error('Failed to load hero image setting:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typingText) {
        type();
    }
    loadHeroImage();
});
