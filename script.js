/* ============================================
   NexaBio Sciences — JavaScript
   Advanced Interactions & Motion Graphics
   ============================================ */

'use strict';

// ============================================
// LOADER
// ============================================
(function initLoader() {
  const fill = document.getElementById('loader-fill');
  const percentEl = document.getElementById('loader-percent');
  const loader = document.getElementById('loader');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 4 + 1;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initAll();
      }, 400);
    }
    fill.style.width = progress + '%';
    percentEl.textContent = Math.floor(progress) + '%';
  }, 40);

  document.body.style.overflow = 'hidden';
})();

// ============================================
// CUSTOM CURSOR
// ============================================
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Interactive states
  const interactives = document.querySelectorAll('a, button, .product-card, .region-card, .dot, .slider-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      follower.style.width = '56px';
      follower.style.height = '56px';
      follower.style.borderColor = 'rgba(0,212,255,0.7)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '12px';
      cursor.style.height = '12px';
      follower.style.width = '36px';
      follower.style.height = '36px';
      follower.style.borderColor = 'rgba(0,212,255,0.5)';
    });
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
}

// ============================================
// PARTICLE CANVAS
// ============================================
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const PARTICLE_COUNT = 90;
  const particles = [];
  const mouse = { x: -9999, y: -9999 };

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Colors matching theme
  const colors = ['rgba(0,212,255,', 'rgba(123,47,255,', 'rgba(0,255,179,'];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const colorBase = colors[Math.floor(Math.random() * colors.length)];
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.5 + 0.5,
      colorBase,
      opacity: Math.random() * 0.5 + 0.15,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseOffset: Math.random() * Math.PI * 2,
    });
  }

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame += 0.01;

    particles.forEach((p, i) => {
      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        p.vx += (dx / dist) * force * 0.08;
        p.vy += (dy / dist) * force * 0.08;
      }

      // Damping
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.5) {
        p.vx = (p.vx / speed) * 1.5;
        p.vy = (p.vy / speed) * 1.5;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Pulsing opacity
      const pulsedOpacity = p.opacity + Math.sin(frame / p.pulseSpeed + p.pulseOffset) * 0.1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.colorBase + Math.max(0, Math.min(1, pulsedOpacity)) + ')';
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const cx = p.x - q.x, cy = p.y - q.y;
        const d = Math.sqrt(cx * cx + cy * cy);
        if (d < 100) {
          const lineOpacity = (1 - d / 100) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0,212,255,${lineOpacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      if (
        scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  });

  // Close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ============================================
// SCROLL REVEAL
// ============================================
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-num, .num-val');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target.toLocaleString();
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ============================================
// TESTIMONIALS SLIDER
// ============================================
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');

function goToSlide(index) {
  if (!slides.length) return;
  slides[currentSlide].style.opacity = '0.4';
  slides[currentSlide].style.transform = 'scale(0.97)';
  dots[currentSlide].classList.remove('active');

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide].style.opacity = '1';
  slides[currentSlide].style.transform = 'scale(1)';
  dots[currentSlide].classList.add('active');
}

function changeSlide(dir) {
  goToSlide(currentSlide + dir);
}

// Auto-rotate testimonials
let testimonialInterval;
function startTestimonialAuto() {
  testimonialInterval = setInterval(() => changeSlide(1), 5000);
}

function stopTestimonialAuto() {
  clearInterval(testimonialInterval);
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.innerHTML = 'Sending... <span class="spinner"></span>';

    setTimeout(() => {
      success.classList.add('show');
      form.reset();
      btn.disabled = false;
      btn.innerHTML = 'Send Message <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9l14 0M10 3l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1500);
  });
}

// ============================================
// NEWSLETTER FORM
// ============================================
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('newsletter-email');
    const btn = form.querySelector('button');
    if (!input.value) return;
    btn.textContent = '✓';
    btn.style.background = 'linear-gradient(135deg, #00ffb3, #00d4ff)';
    input.value = '';
    setTimeout(() => {
      btn.textContent = '→';
      btn.style.background = '';
    }, 3000);
  });
}

// ============================================
// BACK TO TOP
// ============================================
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// SMOOTH ANCHOR SCROLLING
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================
// PRODUCT CARD PARALLAX (tilt effect)
// ============================================
function initCardTilt() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;

      // Move glow to follow mouse
      const glow = card.querySelector('.product-card-glow');
      if (glow) {
        glow.style.left = (x - 75) + 'px';
        glow.style.top = (y - 75) + 'px';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============================================
// GLITCH HERO TEXT (subtle)
// ============================================
function initGlitchEffect() {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  
  setInterval(() => {
    if (Math.random() > 0.97) {
      title.style.filter = 'blur(0.5px)';
      setTimeout(() => {
        title.style.filter = '';
      }, 80);
    }
  }, 300);
}

// ============================================
// REGION CARDS STAGGER ANIMATION
// ============================================
function initRegionCards() {
  const cards = document.querySelectorAll('.region-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 100}ms`;
  });
}

// ============================================
// MARQUEE SPEED ON HOVER
// ============================================
function initMarquee() {
  const content = document.getElementById('marquee-content');
  if (!content) return;
  const section = content.closest('.marquee-section');
  section.addEventListener('mouseenter', () => {
    content.style.animationPlayState = 'paused';
  });
  section.addEventListener('mouseleave', () => {
    content.style.animationPlayState = 'running';
  });
}

// ============================================
// NAVBAR LINK HOVER UNDERLINE EFFECT
// ============================================
function initNavEffects() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', function () {
      this.style.letterSpacing = '0.3px';
    });
    link.addEventListener('mouseleave', function () {
      this.style.letterSpacing = '';
    });
  });
}

// ============================================
// STAT BAR HOVER GLOW
// ============================================
function initStatHover() {
  document.querySelectorAll('.number-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.background = 'rgba(0,212,255,0.04)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = '';
    });
  });
}

// ============================================
// SCROLL-BASED PARALLAX ON HERO
// ============================================
function initHeroParallax() {
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    if (!heroContent) return;
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
      heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
    }
  }, { passive: true });
}

// ============================================
// SECTION ENTRANCE: SECTION TAG GLOW
// ============================================
function initSectionTagGlow() {
  const tags = document.querySelectorAll('.section-tag');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.boxShadow = '0 0 20px rgba(0,212,255,0.3)';
        setTimeout(() => {
          entry.target.style.boxShadow = '';
        }, 2000);
      }
    });
  }, { threshold: 0.8 });
  tags.forEach(t => observer.observe(t));
}

// ============================================
// INITIALIZE ALL
// ============================================
function initAll() {
  initCursor();
  initParticles();
  initNavbar();
  initScrollReveal();
  initCounters();
  initContactForm();
  initNewsletter();
  initBackToTop();
  initSmoothScroll();
  initCardTilt();
  initGlitchEffect();
  initRegionCards();
  initMarquee();
  initNavEffects();
  initStatHover();
  initHeroParallax();
  initSectionTagGlow();
  startTestimonialAuto();

  // Make slider functions global
  window.goToSlide = goToSlide;
  window.changeSlide = changeSlide;

  // Testimonial slider hover pause
  const slider = document.querySelector('.testimonials-slider');
  if (slider) {
    slider.addEventListener('mouseenter', stopTestimonialAuto);
    slider.addEventListener('mouseleave', startTestimonialAuto);
  }

  // Initialize slides state
  slides.forEach((slide, i) => {
    if (i !== 0) {
      slide.style.opacity = '0.4';
      slide.style.transform = 'scale(0.97)';
      slide.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    } else {
      slide.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    }
  });

  console.log('%cNexaBio Sciences — Premium Website Initialized ✓', 
    'color: #00d4ff; font-size: 14px; font-weight: bold; padding: 4px;');
}
