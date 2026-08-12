/**
 * SHAKTI COUNCIL - INTERACTIVITY & CORE LOGIC
 * Location: Kolkata, West Bengal, India
 * Pure Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. ACTIVE NAVIGATION & STICKY HEADER
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.main-header');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Highlight active link in menu
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      const parentItem = link.closest('.nav-item');
      if (parentItem) parentItem.classList.add('active');
    }
  });

  // Sticky navbar & scroll-to-top handler
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('is-sticky');
    } else {
      header?.classList.remove('is-sticky');
    }

    if (window.scrollY > 400) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------------
     2. MOBILE DRAWER NAVIGATION
     ------------------------------------------------------------------------ */
  const hamburgerToggle = document.querySelector('.hamburger-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileOverlay = document.querySelector('.mobile-drawer-overlay');
  const mobileCloseBtn = document.querySelector('.mobile-close-btn');

  function openMobileNav() {
    mobileDrawer?.classList.add('active');
    mobileOverlay?.classList.add('active');
    document.body.classList.add('scroll-locked');
  }

  function closeMobileNav() {
    mobileDrawer?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
    document.body.classList.remove('scroll-locked');
  }

  hamburgerToggle?.addEventListener('click', openMobileNav);
  mobileCloseBtn?.addEventListener('click', closeMobileNav);
  mobileOverlay?.addEventListener('click', closeMobileNav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('active')) {
      closeMobileNav();
    }
  });

  /* ------------------------------------------------------------------------
     3. CUSTOM CURSOR FOLLOWER (DESKTOP)
     ------------------------------------------------------------------------ */
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorRing = document.querySelector('.custom-cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursorRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursorRing);
    }
    renderCursorRing();

    // Hover effect elements
    const hoverTargets = document.querySelectorAll('a, button, .btn, .focus-card, .event-card, .gallery-item, .amount-btn');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ------------------------------------------------------------------------
     4. HERO SLIDER CONTROLLER
     ------------------------------------------------------------------------ */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let currentSlide = 0;
  let slideInterval = null;

  if (slides.length > 0) {
    function goToSlide(index) {
      slides[currentSlide]?.classList.remove('active');
      dots[currentSlide]?.classList.remove('active');
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide]?.classList.add('active');
      dots[currentSlide]?.classList.add('active');
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlideFunc() {
      goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
      slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
      if (slideInterval) clearInterval(slideInterval);
    }

    nextBtn?.addEventListener('click', () => { stopAutoSlide(); nextSlide(); startAutoSlide(); });
    prevBtn?.addEventListener('click', () => { stopAutoSlide(); prevSlideFunc(); startAutoSlide(); });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        stopAutoSlide();
        goToSlide(idx);
        startAutoSlide();
      });
    });

    const heroSection = document.querySelector('.hero-slider-section');
    heroSection?.addEventListener('mouseenter', stopAutoSlide);
    heroSection?.addEventListener('mouseleave', startAutoSlide);

    // Touch Swipe support
    let touchStartX = 0;
    heroSection?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    heroSection?.addEventListener('touchend', e => {
      const touchEndX = e.changedTouches[0].clientX;
      if (touchStartX - touchEndX > 50) nextSlide();
      if (touchEndX - touchStartX > 50) prevSlideFunc();
    }, { passive: true });

    startAutoSlide();
  }

  /* ------------------------------------------------------------------------
     5. SCROLL ANIMATED COUNTERS
     ------------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    let hasAnimatedStats = false;

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimatedStats) {
          hasAnimatedStats = true;
          statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target') || '0', 10);
            const prefix = stat.getAttribute('data-prefix') || '';
            const suffix = stat.getAttribute('data-suffix') || '';
            let count = 0;
            const step = Math.ceil(target / 60);

            const timer = setInterval(() => {
              count += step;
              if (count >= target) {
                count = target;
                clearInterval(timer);
              }
              stat.textContent = `${prefix}${count.toLocaleString('en-IN')}${suffix}`;
            }, 30);
          });
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);
  }

  /* ------------------------------------------------------------------------
     6. CAMPAIGN PROGRESS BAR ANIMATION
     ------------------------------------------------------------------------ */
  const progressFills = document.querySelectorAll('.progress-bar-fill');
  if (progressFills.length > 0) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetWidth = fill.getAttribute('data-progress') || '0%';
          fill.style.width = targetWidth;
          progressObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });

    progressFills.forEach(fill => progressObserver.observe(fill));
  }

  /* ------------------------------------------------------------------------
     7. MULTI-CATEGORY GALLERY FILTER & LIGHTBOX
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // Lightbox logic
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let activeGalleryIndex = 0;

  if (galleryItems.length > 0 && lightboxModal) {
    function openLightbox(index) {
      activeGalleryIndex = index;
      const currentItem = galleryItems[activeGalleryIndex];
      const img = currentItem.querySelector('img');
      const title = currentItem.getAttribute('data-title') || img.getAttribute('alt');

      if (lightboxImg) lightboxImg.src = img.src;
      if (lightboxCaption) lightboxCaption.textContent = title;

      lightboxModal.classList.add('active');
      document.body.classList.add('scroll-locked');
    }

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      document.body.classList.remove('scroll-locked');
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', () => {
      activeGalleryIndex = (activeGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
      openLightbox(activeGalleryIndex);
    });
    lightboxNext?.addEventListener('click', () => {
      activeGalleryIndex = (activeGalleryIndex + 1) % galleryItems.length;
      openLightbox(activeGalleryIndex);
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev?.click();
      if (e.key === 'ArrowRight') lightboxNext?.click();
    });
  }

  /* ------------------------------------------------------------------------
     8. DONATION CALCULATOR & DEMO PAYMENT MODAL
     ------------------------------------------------------------------------ */
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customAmountWrap = document.querySelector('.custom-amount-input-wrap');
  const customAmountInput = document.querySelector('.custom-amount-input');
  const impactExplanation = document.querySelector('.impact-explanation');
  const freqBtns = document.querySelectorAll('.freq-btn');
  const donateSubmitBtn = document.querySelector('.donate-submit-btn');
  const donationModal = document.querySelector('#donation-modal');
  const modalAmountText = document.querySelector('.modal-amount-text');
  const modalFreqText = document.querySelector('.modal-freq-text');
  const modalCloseBtns = document.querySelectorAll('.modal-close-action');

  let selectedAmount = '1000';
  let selectedFreq = 'One-time';

  const impactMap = {
    '500': 'Provides 1 month of complete school supplies & books for a underprivileged child in Kolkata.',
    '1000': 'Sponsors 50 hot nutritious meals for homeless families & children in Kolkata.',
    '2500': 'Funds 1 month of vocational tailoring & skill training for a woman in rural West Bengal.',
    '5000': 'Provides full medical diagnostics & medication for 10 elderly community members.',
    'custom': 'Your generous custom contribution directly supports Shakti Council’s key welfare programs.'
  };

  freqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      freqBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedFreq = btn.getAttribute('data-freq') || 'One-time';
    });
  });

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.getAttribute('data-amount');

      if (val === 'custom') {
        if (customAmountWrap) customAmountWrap.style.display = 'block';
        if (customAmountInput) {
          customAmountInput.focus();
          selectedAmount = customAmountInput.value || '1500';
        } else {
          selectedAmount = '1500';
        }
        if (impactExplanation) impactExplanation.textContent = impactMap['custom'];
      } else {
        if (customAmountWrap) customAmountWrap.style.display = 'none';
        selectedAmount = val || '1000';
        if (impactExplanation) impactExplanation.textContent = impactMap[selectedAmount] || impactMap['custom'];
      }
    });
  });

  customAmountInput?.addEventListener('input', (e) => {
    selectedAmount = e.target.value || '0';
    if (impactExplanation) {
      impactExplanation.textContent = impactMap['custom'];
    }
  });

  donateSubmitBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!selectedAmount || parseInt(selectedAmount, 10) <= 0) {
      alert('Please select or enter a valid donation amount.');
      return;
    }

    if (modalAmountText) modalAmountText.textContent = `₹${parseInt(selectedAmount, 10).toLocaleString('en-IN')}`;
    if (modalFreqText) modalFreqText.textContent = selectedFreq;

    donationModal?.classList.add('active');
    document.body.classList.add('scroll-locked');
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      donationModal?.classList.remove('active');
      document.body.classList.remove('scroll-locked');
    });
  });

  /* ------------------------------------------------------------------------
     9. ADMIN PANEL MODAL & DASHBOARD CONTROLLER
     ------------------------------------------------------------------------ */
  const adminBtns = document.querySelectorAll('.open-admin-btn');
  const adminModal = document.querySelector('#admin-modal');
  const adminNavItems = document.querySelectorAll('.admin-nav-item');
  const adminSections = document.querySelectorAll('.admin-dashboard-section');

  adminBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      adminModal?.classList.add('active');
      document.body.classList.add('scroll-locked');
    });
  });

  adminNavItems.forEach(item => {
    item.addEventListener('click', () => {
      adminNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const targetSectionId = item.getAttribute('data-target');
      adminSections.forEach(sec => {
        if (sec.id === targetSectionId) {
          sec.style.display = 'block';
        } else {
          sec.style.display = 'none';
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     10. FORM VALIDATION (CONTACT & NEWSLETTER)
     ------------------------------------------------------------------------ */
  const contactForm = document.querySelector('#contact-form');
  const newsletterForm = document.querySelector('#newsletter-form');
  const successModal = document.querySelector('#success-modal');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const nameInput = contactForm.querySelector('[name="fullname"]');
    const emailInput = contactForm.querySelector('[name="email"]');
    const messageInput = contactForm.querySelector('[name="message"]');

    if (!nameInput?.value.trim()) {
      showError(nameInput, 'Full name is required.');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    if (!emailInput?.value.trim() || !validateEmail(emailInput.value)) {
      showError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    if (!messageInput?.value.trim()) {
      showError(messageInput, 'Message cannot be empty.');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (isValid) {
      contactForm.reset();
      if (successModal) {
        const modalTitle = successModal.querySelector('.modal-title');
        const modalDesc = successModal.querySelector('.modal-desc');
        if (modalTitle) modalTitle.textContent = 'Message Received!';
        if (modalDesc) modalDesc.textContent = 'Thank you for reaching out to Shakti Council. Our Kolkata team will get back to you shortly.';
        successModal.classList.add('active');
        document.body.classList.add('scroll-locked');
      } else {
        alert('Thank you for contacting Shakti Council!');
      }
    }
  });

  const volunteerForm = document.querySelector('#volunteer-form');
  volunteerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    volunteerForm.reset();
    if (successModal) {
      const modalTitle = successModal.querySelector('.modal-title');
      const modalDesc = successModal.querySelector('.modal-desc');
      if (modalTitle) modalTitle.textContent = 'Application Submitted!';
      if (modalDesc) modalDesc.textContent = 'Thank you for applying to volunteer with Shakti Council. Our Kolkata community coordinator will contact you shortly.';
      successModal.classList.add('active');
      document.body.classList.add('scroll-locked');
    } else {
      alert('Thank you for applying to volunteer with Shakti Council!');
    }
  });

  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    if (!emailInput?.value.trim() || !validateEmail(emailInput.value)) {
      alert('Please enter a valid email address for newsletter subscription.');
      return;
    }

    newsletterForm.reset();
    if (successModal) {
      const modalTitle = successModal.querySelector('.modal-title');
      const modalDesc = successModal.querySelector('.modal-desc');
      if (modalTitle) modalTitle.textContent = 'Subscribed Successfully!';
      if (modalDesc) modalDesc.textContent = 'Welcome to the Shakti Council family! You will now receive regular updates on our impact in West Bengal.';
      successModal.classList.add('active');
      document.body.classList.add('scroll-locked');
    } else {
      alert('Thank you for subscribing!');
    }
  });

  function showError(inputEl, msg) {
    const parent = inputEl.closest('.form-group');
    let feedback = parent.querySelector('.form-feedback');
    if (!feedback) {
      feedback = document.createElement('span');
      feedback.className = 'form-feedback error';
      parent.appendChild(feedback);
    }
    feedback.textContent = msg;
    feedback.style.display = 'block';
  }

  function clearError(inputEl) {
    const parent = inputEl.closest('.form-group');
    const feedback = parent.querySelector('.form-feedback');
    if (feedback) {
      feedback.style.display = 'none';
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ------------------------------------------------------------------------
     12. GENERIC TRACK CAROUSEL SLIDER & NEWSLETTER HANDLER
     ------------------------------------------------------------------------ */
  function initTrackSlider(trackEl, prevBtnEl, nextBtnEl, dotsEl) {
    if (!trackEl) return;
    let currentIndex = 0;

    function getItemsPerView() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 992) return 2;
      return 3;
    }

    function updateTrack() {
      const items = trackEl.children;
      const itemsPerView = getItemsPerView();
      const maxIndex = Math.max(0, items.length - itemsPerView);
      if (currentIndex > maxIndex) currentIndex = maxIndex;

      const itemWidth = items[0]?.getBoundingClientRect().width || 300;
      const gap = 24;
      const moveDistance = (itemWidth + gap) * currentIndex;
      trackEl.style.transform = `translateX(-${moveDistance}px)`;

      if (dotsEl) {
        const dotBtns = dotsEl.querySelectorAll('.slider-dot-btn');
        dotBtns.forEach((dot, idx) => {
          if (idx === currentIndex) dot.classList.add('active');
          else dot.classList.remove('active');
        });
      }
    }

    nextBtnEl?.addEventListener('click', () => {
      const itemsPerView = getItemsPerView();
      const maxIndex = Math.max(0, trackEl.children.length - itemsPerView);
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateTrack();
    });

    prevBtnEl?.addEventListener('click', () => {
      const itemsPerView = getItemsPerView();
      const maxIndex = Math.max(0, trackEl.children.length - itemsPerView);
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = maxIndex;
      }
      updateTrack();
    });

    window.addEventListener('resize', updateTrack);
    updateTrack();
  }

  // Init Home Gallery Slider & Recent Events Slider
  initTrackSlider(
    document.querySelector('#home-gallery-track'),
    document.querySelector('#home-gallery-prev'),
    document.querySelector('#home-gallery-next'),
    document.querySelector('#home-gallery-dots')
  );

  initTrackSlider(
    document.querySelector('#home-events-track'),
    document.querySelector('#home-events-prev'),
    document.querySelector('#home-events-next'),
    document.querySelector('#home-events-dots')
  );

  // Init Testimonials Sliders (Home & About)
  initTrackSlider(
    document.querySelector('#home-testimonials-track'),
    document.querySelector('#home-testimonials-prev'),
    document.querySelector('#home-testimonials-next'),
    document.querySelector('#home-testimonials-dots')
  );

  initTrackSlider(
    document.querySelector('#about-testimonials-track'),
    document.querySelector('#about-testimonials-prev'),
    document.querySelector('#about-testimonials-next'),
    document.querySelector('#about-testimonials-dots')
  );

  // Footer Newsletter Form Submission
  const newsletterForms = document.querySelectorAll('.footer-newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for subscribing! You will receive monthly impact field updates from Shakti Council.');
      form.reset();
    });
  });

});


