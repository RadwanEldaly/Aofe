/**
 * FUTURE STEEL | شركة عمارات عوف للمقاولات العامة والحدادة
 * Motion & Interaction Engine (Vanilla JS + GSAP + ScrollTrigger)
 * Recreating animations from Wix Template 3739 & Navbar/Hero from Wix Template 3718
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Navbar Sticky & Scroll Effects (Template 3718)
  initNavbarScroll();

  // 2. Mobile Navigation Drawer
  initMobileDrawer();

  // 3. FAQ Accordion Toggle
  initAccordion();

  // 4. Project Gallery Filter
  initGalleryFilter();

  // 5. Lightbox Modal for Projects & Certificates
  initLightboxModal();

  // 6. Interactive WhatsApp Form Generator
  initQuickQuoteForm();

  // 7. GSAP & ScrollTrigger Animations (Template 3739 Motion Engine)
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    initGSAPAnimations(prefersReducedMotion);
  } else {
    // Fallback if GSAP is blocked or offline
    initFallbackAnimations();
  }
});

/**
 * 1. Navbar Sticky & Elevation Behavior
 */
function initNavbarScroll() {
  const navbarPill = document.getElementById('navbarPill');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], main[id]');

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;

    // Elevation on scroll
    if (currentY > 60) {
      navbarPill?.classList.add('scrolled');
    } else {
      navbarPill?.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSectionId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      const height = section.offsetHeight;
      if (currentY >= top && currentY < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    lastScrollY = currentY;
  }, { passive: true });
}

/**
 * 2. Mobile Navigation Drawer
 */
function initMobileDrawer() {
  const navToggle = document.getElementById('navToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('open');
    navToggle?.setAttribute('aria-expanded', 'true');
    mobileDrawer?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    mobileDrawer?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  navToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * 3. FAQ Accordion Interaction
 */
function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * 4. Project Gallery Filter
 */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4 });
          } else {
            card.style.opacity = '1';
          }
        } else {
          card.style.display = 'none';
        }
      });

      // Refresh ScrollTrigger after DOM changes
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });
}

/**
 * 5. Lightbox Modal for Project Details & Official Certificates
 */
function initLightboxModal() {
  const modal = document.getElementById('lightboxModal');
  const modalClose = document.getElementById('modalClose');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');

  function openModal(imgSrc, title, desc) {
    if (!modal) return;
    if (modalImg) modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title || 'تفاصيل العمل';
    if (modalDesc) modalDesc.textContent = desc || '';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind to Project cards "عرض التفاصيل"
  document.querySelectorAll('.btn-view-project').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      openModal(img, title, desc);
    });
  });

  // Bind to Certificates buttons
  document.querySelectorAll('.cert-thumb-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      openModal(img, title, desc);
    });
  });

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * 6. Quick Quote Form: WhatsApp Message Pre-fill
 */
function initQuickQuoteForm() {
  const form = document.getElementById('quickQuoteForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('clientName')?.value.trim() || '';
    const city = document.getElementById('clientCity')?.value.trim() || '';
    const service = document.getElementById('serviceType')?.value || '';
    const details = document.getElementById('projectDetails')?.value.trim() || 'بدون تفاصيل إضافية';

    const message = `السلام عليكم ورحمة الله وبركاته،
أرغب في الاستفسار عن عرض سعر لمشروع حدادة:
• الاسم: ${name}
• المدينة/الحي: ${city}
• نوع الخدمة: ${service}
• التفاصيل والمقاسات: ${details}

أرجو التواصل لتحديد موعد المعاينة المجانية.`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/966597388770?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
  });
}

/**
 * 7. GSAP & ScrollTrigger Animations (Reverse-Engineered from Wix 3739)
 */
function initGSAPAnimations(prefersReducedMotion) {
  if (prefersReducedMotion) {
    // Graceful simple fade-ins for reduced-motion users
    document.querySelectorAll('.service-card, .project-card, .metric-card').forEach(el => {
      el.style.opacity = '1';
    });
    return;
  }

  // A. Hero Section Entrance (Page Load)
  const heroTl = gsap.timeline({
    defaults: {
      duration: 1.2,
      ease: 'power3.out'
    }
  });

  heroTl
    .fromTo('#heroBgImg', 
      { scale: 1.08 },
      { scale: 1, duration: 1.8, ease: 'power2.out' },
      0
    )
    .fromTo('#heroBadge', 
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      0.2
    )
    .fromTo('#heroTitle', 
      { y: 45, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
      0.3
    )
    .fromTo('#heroDesc', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      0.55
    )
    .fromTo('#heroCtas a', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out' },
      0.7
    )
    .fromTo('.hero-corner-mark', 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 0.18, duration: 1.4, ease: 'power2.out' },
      0.4
    );

  // B. Hero Background Parallax Scrub on Scroll
  gsap.to('#heroBgImg', {
    yPercent: 16,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-shell',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6
    }
  });

  // C. Trust Counters Animation
  document.querySelectorAll('.metric-number').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const suffix = counter.textContent.replace(/[0-9]/g, '');

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        let obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = Math.floor(obj.val) + suffix;
          }
        });
      }
    });
  });

  // D. Staggered Service Cards Reveal (1200ms easeInOutCubic as per Wix 3739)
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '#servicesGrid',
      start: 'top 82%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    stagger: 0.14,
    duration: 1.2,
    ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  });

  // E. Process Timeline Step Reveal
  gsap.from('.process-step', {
    scrollTrigger: {
      trigger: '#processTimeline',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 1,
    ease: 'power3.out'
  });

  // F. About Section Background Parallax Scrub
  gsap.to('#aboutParallaxImg', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.8
    }
  });

  // G. About Content Entrance
  gsap.from('.about-text-content', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    },
    x: 40,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  });

  // H. Quote Request Banner: Scroll-Scrubbed Reveal (Wix 3739 measured effect)
  gsap.fromTo('#quoteTitle', 
    { y: 36, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#quoteBanner',
        start: 'top 90%',
        end: 'center center',
        scrub: 0.8
      }
    }
  );

  gsap.from('.quote-form', {
    scrollTrigger: {
      trigger: '#quoteBanner',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });

  // I. Testimonial Cards Stagger
  gsap.from('.testimonial-card', {
    scrollTrigger: {
      trigger: '#testimonials',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 40,
    opacity: 0,
    stagger: 0.18,
    duration: 1,
    ease: 'power3.out'
  });
}

/**
 * Fallback animations when GSAP is offline/unavailable
 */
function initFallbackAnimations() {
  const animatedElements = document.querySelectorAll('.service-card, .project-card, .metric-card, .process-step');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
    observer.observe(el);
  });
}
