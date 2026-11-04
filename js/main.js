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

  // 7. Google Ads Conversion & Event Tracking (AW-18435685520)
  initGoogleAdsTracking();

  // 8. GSAP & ScrollTrigger Animations (Template 3739 Motion Engine)
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
 * 1. Navbar Sticky & Multi-page Active Highlighting
 */
function initNavbarScroll() {
  const navbarPill = document.getElementById('navbarPill');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');
  
  // Highlight active link based on current page
  const path = window.location.pathname;
  let pageName = path.split('/').pop() || 'index.html';
  if (pageName === '' || pageName === 'Aofe' || pageName === 'en') pageName = 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === 'index.html' && (href === 'index.html' || href === './' || href === '#top'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;

    // Elevation on scroll
    if (currentY > 40) {
      navbarPill?.classList.add('scrolled');
    } else {
      navbarPill?.classList.remove('scrolled');
    }
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
    const isEn = document.documentElement.lang === 'en';
    if (modalImg) modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title || (isEn ? 'Work Details' : 'تفاصيل العمل');
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
  document.querySelectorAll('.cert-thumb-btn, .btn-cert-view, .cert-showcase-media').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      if (img) openModal(img, title, desc);
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
    const details = document.getElementById('projectDetails')?.value.trim() || '';

    const isEn = document.documentElement.lang === 'en';
    let message = '';

    if (isEn) {
      message = `Hello,
I would like to request a quotation / site inspection for a steel & contracting project:
• Name: ${name}
• City/District: ${city}
• Service Type: ${service}
• Details & Dimensions: ${details || 'No additional details provided'}

Please contact me to schedule a consultation.`;
    } else {
      message = `السلام عليكم ورحمة الله وبركاته،
أرغب في الاستفسار عن عرض سعر لمشروع حدادة ومقاولات:
• الاسم: ${name}
• المدينة/الحي: ${city}
• نوع الخدمة: ${service}
• التفاصيل والمقاسات: ${details || 'بدون تفاصيل إضافية'}

أرجو التواصل لتحديد موعد المعاينة المجانية.`;
    }

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/966597388770?text=${encoded}`;

    // Google Ads Lead Conversion Event
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'Leads',
        event_label: service || 'Quick Quote Form',
        value: 10.0,
        currency: 'SAR'
      });
      window.gtag('event', 'conversion', {
        send_to: 'AW-18435685520',
        event_category: 'Leads',
        event_label: 'Quote Form Submission',
        value: 10.0,
        currency: 'SAR'
      });
    }

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

  // A. Hero Section Entrance (Home Page)
  if (document.getElementById('heroTitle')) {
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

    // Parallax on Home Hero
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
  }

  // A2. Subpage Hero Entrance (Inner Pages)
  if (document.querySelector('.subpage-hero-card')) {
    const subHeroTl = gsap.timeline({
      defaults: { duration: 1, ease: 'power3.out' }
    });

    subHeroTl
      .fromTo('.subpage-hero-card .hero-bg-img',
        { scale: 1.08 },
        { scale: 1, duration: 1.6, ease: 'power2.out' },
        0
      )
      .fromTo('.breadcrumb-nav',
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.2
      )
      .fromTo('.subpage-hero-title',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        0.3
      )
      .fromTo('.subpage-hero-desc',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.45
      );

    // Parallax on Subpage Hero
    gsap.to('.subpage-hero-card .hero-bg-img', {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: {
        trigger: '.subpage-hero-shell',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    });
  }

  // C. Trust Counters Animation
  const counters = document.querySelectorAll('.metric-number');
  if (counters.length > 0) {
    counters.forEach(counter => {
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
  }

  // D. Staggered Service Cards Reveal
  if (document.querySelector('.service-card')) {
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: document.getElementById('servicesGrid') || '.service-card',
        start: 'top 82%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      stagger: 0.12,
      duration: 1.1,
      ease: 'power3.out'
    });
  }

  // D2. Detailed Service Cards for services.html
  if (document.querySelector('.service-detail-card')) {
    gsap.from('.service-detail-card', {
      scrollTrigger: {
        trigger: '.services-detail-grid',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 45,
      opacity: 0,
      stagger: 0.14,
      duration: 1.1,
      ease: 'power3.out'
    });
  }

  // E. Process Timeline Step Reveal
  if (document.querySelector('.process-step')) {
    gsap.from('.process-step', {
      scrollTrigger: {
        trigger: document.getElementById('processTimeline') || '.process-step',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out'
    });
  }

  // F. About Section Background Parallax Scrub
  if (document.getElementById('aboutParallaxImg')) {
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
  }

  // G. About Content Entrance
  if (document.querySelector('.about-text-content')) {
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
  }

  // H. Quote Request Banner
  if (document.getElementById('quoteBanner')) {
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
  }

  // I. Testimonial Cards Stagger
  if (document.querySelector('.testimonial-card')) {
    gsap.from('.testimonial-card', {
      scrollTrigger: {
        trigger: document.getElementById('testimonials') || '.testimonial-card',
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

  // J. Contact Info Cards on contact.html
  if (document.querySelector('.contact-info-box')) {
    gsap.from('.contact-info-box', {
      scrollTrigger: {
        trigger: '.contact-info-cards',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      x: 35,
      opacity: 0,
      stagger: 0.15,
      duration: 0.9,
      ease: 'power3.out'
    });
  }
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


/**
 * Google Ads Conversion & Interaction Tracking (AW-18435685520)
 * Automatically tracks user clicks on WhatsApp links and Phone call buttons
 */
function initGoogleAdsTracking() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href') || '';

    // WhatsApp click tracking
    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-18435685520',
          event_category: 'Contact',
          event_label: 'WhatsApp Contact',
          value: 1.0,
          currency: 'SAR'
        });
        window.gtag('event', 'whatsapp_click', {
          event_category: 'Engagement',
          event_label: href
        });
      }
    }

    // Directions & Google Maps click tracking (الحصول على الاتجاهات - AW-18435685520/K_LQCPmN9LAdEJD56NZE)
    if (
      href.includes('maps.google') ||
      href.includes('goo.gl/maps') ||
      link.classList.contains('btn-directions') ||
      link.dataset.conversion === 'directions'
    ) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-18435685520/K_LQCPmN9LAdEJD56NZE',
          event_category: 'Navigation',
          event_label: 'Get Directions (Google Maps)'
        });
      }
    }

    // Direct phone call tracking
    if (href.startsWith('tel:')) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-18435685520',
          event_category: 'Contact',
          event_label: 'Direct Phone Call',
          value: 1.0,
          currency: 'SAR'
        });
        window.gtag('event', 'phone_call_click', {
          event_category: 'Engagement',
          event_label: href
        });
      }
    }
  });
}
