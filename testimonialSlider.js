(function () {
  // testimonialSlider.js - Carousel for testimonials
  const testimonials = window.testimonialDb || [];

  function renderSlides(container) {
    const wrapper = container.querySelector('.testimonial-wrapper');
    if (!wrapper || testimonials.length === 0) return;

    // Clear wrapper
    wrapper.innerHTML = '';

    // Render each testimonial as a slide
    testimonials.forEach(testimonial => {
      const slide = document.createElement('div');
      slide.className = 'testimonial-slide';

      // Create star rating
      const starsHtml = Array(5)
        .fill('')
        .map((_, i) => `<i class="fas fa-star${i < testimonial.stars ? '' : ' ' + 'far'}" style="${i < testimonial.stars ? '' : 'opacity: 0.3;'}"></i>`)
        .join('');

      // Get initials for avatar
      const initials = testimonial.username
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();

      slide.innerHTML = `
        <div class="testimonial-header">
          <h3 class="testimonial-title">${escapeHtml(testimonial.title)}</h3>
          <div class="testimonial-stars">${starsHtml}</div>
        </div>
        <p class="testimonial-text">"${escapeHtml(testimonial.reviewtext)}"</p>
        <div class="testimonial-footer">
          <div class="testimonial-avatar">${initials}</div>
          <div class="testimonial-author">
            <div class="testimonial-author-name">${escapeHtml(testimonial.username)}</div>
            <div class="testimonial-author-role">Verified Patient</div>
          </div>
        </div>
      `;

      wrapper.appendChild(slide);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function init() {
    const containers = document.querySelectorAll('.testimonial-slider-container');
    containers.forEach(container => {
      // First render the slides
      renderSlides(container);
      // Then initialize the slider logic
      initSlider(container);
    });
  }

  function initSlider(container) {
    const wrapper = container.querySelector('.testimonial-wrapper');
    const slides = container.querySelectorAll('.testimonial-slide');
    const prevBtn = container.querySelector('.testimonial-prev');
    const nextBtn = container.querySelector('.testimonial-next');
    const dotsContainer = container.querySelector('.testimonial-dots');

    if (!wrapper || slides.length === 0) return;

    let current = 0;
    let autoSlideInterval;

    // Create dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `testimonial-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
    }

    function updateSlider() {
      // Translate wrapper
      const offset = -current * 100;
      wrapper.style.transform = `translateX(${offset}%)`;

      // Update dots
      const dots = container.querySelectorAll('.testimonial-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function goToSlide(index) {
      current = index % slides.length;
      if (current < 0) current = slides.length - 1;
      updateSlider();
      resetAutoSlide();
    }

    function nextSlide() {
      goToSlide(current + 1);
    }

    function prevSlide() {
      goToSlide(current - 1);
    }

    function autoSlide() {
      nextSlide();
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(autoSlide, 5000);
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Mouse over pauses, mouse out resumes
    container.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    container.addEventListener('mouseleave', resetAutoSlide);

    // Initial setup
    updateSlider();
    resetAutoSlide();

    // Store references for cleanup if needed
    container._sliderCleanup = () => {
      clearInterval(autoSlideInterval);
    };
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for manual re-init
  window.initTestimonialSliders = init;
})();
