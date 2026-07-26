document.addEventListener('DOMContentLoaded', function () {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const header = document.getElementById('site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const body = document.body;

  const scrollToTarget = function (href) {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (event) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        event.preventDefault();
        scrollToTarget(href);
        if (body.classList.contains('nav-open')) {
          body.classList.remove('nav-open');
          if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      body.classList.toggle('nav-open');
    });
  }

  const onScroll = () => {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 20);

    const hero = document.querySelector('.hero-new');
    if (hero) {
      const progress = Math.min(scrollY / (window.innerHeight || 800), 1);
      const world = hero.querySelector('.hero-layer.worldmap img');
      if (world) {
        world.style.transform = `translateY(${progress * 32}px) translateX(-6%)`;
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const createRipple = function (e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    ripple.className = 'ripple-ef';
    button.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 700);
  };

  document.querySelectorAll('.ripple').forEach((button) => {
    button.addEventListener('click', createRipple);
  });

  (function initParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;

    window.addEventListener('resize', () => {
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    });

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.4 + 0.8,
      dx: (Math.random() - 0.5) * 0.45,
      dy: (Math.random() - 0.2) * 0.55,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${particle.alpha})`;
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    draw();
  })();

  document.querySelectorAll('.accordion .accordion-item').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.nextElementSibling;
      const isOpen = panel.style.display === 'block';

      document.querySelectorAll('.accordion .panel').forEach((item) => {
        item.style.display = 'none';
      });
      document.querySelectorAll('.accordion .accordion-item .chev').forEach((chev) => {
        chev.textContent = '+';
      });

      if (!isOpen) {
        panel.style.display = 'block';
        button.querySelector('.chev').textContent = '-';
      }
    });
  });

  const trackButton = document.getElementById('track-btn');
  if (trackButton) {
    trackButton.addEventListener('click', () => {
      const input = document.getElementById('track-input');
      const output = document.getElementById('track-result');
      const value = input.value.trim();

      if (!value) {
        output.textContent = 'Please enter a tracking number.';
        return;
      }

      output.innerHTML = `<strong>Tracking:</strong> ${value}<br><em>Checking status...</em>`;
      window.setTimeout(() => {
        output.innerHTML = '<strong>Status:</strong> In Transit<br><small>Left origin facility — expected delivery in 3-5 business days.</small>';
      }, 1200);
    });
  }

  const demoHandler = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const submit = form.querySelector('button[type="submit"]');
      if (submit) {
        submit.disabled = true;
        submit.dataset.orig = submit.dataset.orig || submit.textContent;
        submit.textContent = 'Sending...';
      }

      window.setTimeout(() => {
        if (submit) {
          submit.disabled = false;
          submit.textContent = 'Submitted';
        }
        alert('Form submitted (demo). Our team will contact you.');
        form.reset();
      }, 900);
    });
  };

  demoHandler('rate-form');
  demoHandler('book-form');

  const revealElements = document.querySelectorAll('.fade-on-scroll');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  const counterElements = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const counter = entry.target;
        const endValue = Number(counter.dataset.counter) || 0;
        let current = 0;
        const step = Math.max(1, Math.ceil(endValue / 60));

        const update = () => {
          current += step;
          if (current >= endValue) {
            counter.textContent = endValue;
          } else {
            counter.textContent = current;
            requestAnimationFrame(update);
          }
        };

        update();
        counterObserver.unobserve(counter);
      });
    },
    { threshold: 0.4 }
  );

  counterElements.forEach((counter) => counterObserver.observe(counter));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 920 && body.classList.contains('nav-open')) {
      body.classList.remove('nav-open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});
