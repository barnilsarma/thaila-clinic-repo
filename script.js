// ==================== HEADER SCROLL EFFECT ====================
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==================== MOBILE NAVIGATION ====================
hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});

// Close nav when clicking a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close nav when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 90;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== ACTIVE NAV LINK ====================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 120;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink?.classList.add('active');
        }
    });
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll('[data-scroll-animation]');
animatedElements.forEach(element => observer.observe(element));

// ==================== PARTICLES BACKGROUND ====================
function createParticles() {
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: radial-gradient(circle, rgba(252, 165, 243, 0.6), rgba(61, 160, 227, 0.4));
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 20 + 15}s linear infinite;
            animation-delay: ${Math.random() * -20}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Add particle animation CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) translateX(0) scale(0);
            opacity: 0;
        }
        10% {
            opacity: 0.8;
        }
        90% {
            opacity: 0.8;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px) scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Initialize particles
createParticles();

// ==================== APPOINTMENT FORM HANDLING ====================
const appointmentForm = document.getElementById('appointmentForm');

// Set minimum date to today
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

appointmentForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(appointmentForm);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Format the message
    const message = `
🏥 *NEW APPOINTMENT REQUEST*

👤 *Patient Details:*
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email || 'Not provided'}

📅 *Appointment Details:*
Date: ${new Date(data.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${data.time}
Department: ${data.department}

📝 *Additional Notes:*
${data.message || 'None'}

---
Booking made via website on ${new Date().toLocaleString('en-IN')}
    `;
    
    // Show loading state
    const submitButton = appointmentForm.querySelector('.btn-submit');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>PROCESSING...</span>';
    submitButton.disabled = true;
    
    try {
        // Send WhatsApp message (opens WhatsApp with pre-filled message)
        const whatsappNumber = '917176660645';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        // Show success message
        showNotification('success', 'Appointment request received! Redirecting to WhatsApp...');
        
        // Reset form
        appointmentForm.reset();
        
        // Wait a moment before redirecting
        setTimeout(() => {
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
        }, 1500);
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('error', 'Something went wrong. Please try calling us directly.');
    } finally {
        // Restore button
        setTimeout(() => {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }, 2000);
    }
});

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(type, message) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>'}
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .custom-notification {
        position: fixed;
        top: 100px;
        right: -400px;
        max-width: 400px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px 24px;
        z-index: 10000;
        transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border-left: 4px solid #FCA5F3;
    }
    
    .custom-notification.show {
        right: 32px;
    }
    
    .custom-notification.success {
        border-left-color: #10B981;
    }
    
    .custom-notification.error {
        border-left-color: #EF4444;
    }
    
    .notification-icon {
        font-size: 32px;
        color: #FCA5F3;
    }
    
    .custom-notification.success .notification-icon {
        color: #10B981;
    }
    
    .custom-notification.error .notification-icon {
        color: #EF4444;
    }
    
    .notification-content p {
        font-family: 'Urbanist', sans-serif;
        font-size: 15px;
        font-weight: 500;
        color: #2D2D2D;
        margin: 0;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 24px;
        color: #9E9E9E;
        cursor: pointer;
        padding: 0;
        transition: color 0.3s ease;
    }
    
    .notification-close:hover {
        color: #2D2D2D;
    }
    
    @media (max-width: 768px) {
        .custom-notification {
            max-width: calc(100% - 48px);
            right: -100%;
        }
        
        .custom-notification.show {
            right: 24px;
        }
    }
`;
document.head.appendChild(notificationStyle);

// ==================== PHONE NUMBER VALIDATION ====================
const phoneInput = document.querySelector('input[type="tel"]');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        // Remove non-digit characters
        let value = e.target.value.replace(/\D/g, '');
        
        // Limit to 10 digits
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        e.target.value = value;
    });
    
    phoneInput.addEventListener('blur', function(e) {
        const value = e.target.value;
        if (value && value.length !== 10) {
            e.target.setCustomValidity('Please enter a valid 10-digit mobile number');
            e.target.reportValidity();
        } else {
            e.target.setCustomValidity('');
        }
    });
}

// ==================== PARALLAX EFFECT ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax for hero shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const speed = 0.3 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ==================== COUNTER ANIMATION ====================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-item h3');
            counters.forEach(counter => {
                const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
                animateCounter(counter, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ==================== FORM INPUT ANIMATIONS ====================
const formInputs = document.querySelectorAll('.input-wrapper input, .input-wrapper select, .input-wrapper textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

// ==================== SCROLL TO TOP BUTTON ====================
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 192px;
    right: 32px;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #FCA5F3 0%, #3DA0E3 100%);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 8px 32px rgba(252, 165, 243, 0.3);
    z-index: 998;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1) translateY(-4px)';
});

scrollToTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1) translateY(0)';
});

// ==================== PAGE LOAD ANIMATION ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Trigger initial animations
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroContent) {
        setTimeout(() => heroContent.style.opacity = '1', 200);
    }
    if (heroVisual) {
        setTimeout(() => heroVisual.style.opacity = '1', 400);
    }
});

// ==================== CONSOLE BRANDING ====================
console.log('%c🏥 Sri Thaila Clinic & Pharmacy', 'font-size: 24px; font-weight: bold; color: #FCA5F3;');
console.log('%cTrusted Care, Close to Home', 'font-size: 14px; color: #6B6B6B;');
console.log('%cWebsite developed with ❤️', 'font-size: 12px; color: #9E9E9E;');

// ==================== KEYBOARD ACCESSIBILITY ====================
document.addEventListener('keydown', (e) => {
    // Close mobile nav with Escape key
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ==================== FLOATING ELEMENTS ANIMATION ====================
const floatingElements = document.querySelectorAll('.float-element');
floatingElements.forEach((element, index) => {
    setInterval(() => {
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        element.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 10 - 5}deg)`;
    }, 3000 + (index * 1000));
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll-heavy functions
window.addEventListener('scroll', throttle(() => {
    // Scroll-dependent operations here
}, 100));

// ==================== TOUCH DEVICE DETECTION ====================
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
    
    // Add touch-specific styles
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `
        .touch-device .info-card {
            animation: none;
        }
        .touch-device .floating-cards {
            display: flex;
            flex-direction: column;
            gap: 16px;
            position: static;
        }
        .touch-device .info-card {
            position: static;
        }
    `;
    document.head.appendChild(touchStyle);
}

// ==================== RIPPLE EFFECT ON BUTTONS ====================
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
    ripple.classList.add('ripple');
    
    const rippleSpan = button.getElementsByClassName('ripple')[0];
    if (rippleSpan) {
        rippleSpan.remove();
    }
    
    button.appendChild(ripple);
}

const buttons = document.querySelectorAll('.btn-primary, .btn-hero-primary, .btn-submit');
buttons.forEach(button => {
    button.addEventListener('click', createRipple);
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
});

// Add ripple styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleAnimation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ==================== INITIALIZE ALL FEATURES ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sri Thaila Clinic website loaded successfully! ✨');
    
    // ==================== GALLERY RENDERING ====================
    // Render gallery items using map function
    const galleryContainer = document.getElementById('galleryContainer');
    
    if (galleryContainer && typeof galleryPhotos !== 'undefined') {
        const galleryHTML = galleryPhotos.map(photo => `
            <div class="gallery-item" data-id="${photo.id}">
                <img src="${photo.url}" alt="${photo.title}" loading="lazy">
            </div>
        `).join('');
        
        galleryContainer.innerHTML = galleryHTML;
        
        // Add click event listeners to gallery items
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const photoUrl = this.querySelector('img').src;
                const photoTitle = this.querySelector('.gallery-item-title').textContent;
                console.log(`Viewing: ${photoTitle} - ${photoUrl}`);
                // You can add lightbox or modal functionality here if needed
            });
        });
    }
});