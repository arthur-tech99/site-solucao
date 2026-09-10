(() => {
  'use strict';

  // ---- Config: replace with the real business WhatsApp number (country + area code, no symbols) ----
  const WHATSAPP_NUMBER = '5511999999999';
  const WHATSAPP_DEFAULT_MESSAGE = 'Olá! Quero um diagnóstico gratuito de TI para minha empresa.';

  const waLink = (message) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  document.querySelectorAll('[data-wa-cta]').forEach((el) => {
    el.setAttribute('href', waLink(WHATSAPP_DEFAULT_MESSAGE));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  // ---- Mobile nav ----
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');

  navToggle?.addEventListener('click', () => {
    const isOpen = header.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('is-open');
      navToggle?.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- Active nav link on scroll ----
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav__link')];

  const setActiveLink = () => {
    const scrollPos = window.scrollY + 120;
    let current = sections[0]?.id;
    for (const section of sections) {
      if (section.offsetTop <= scrollPos) current = section.id;
    }
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // ---- Reveal on scroll ----
  const revealItems = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));

  // ---- Custom video player ----
  const video = document.getElementById('heroVideo');
  const overlay = document.getElementById('videoOverlay');
  const playBtn = document.getElementById('playBtn');
  const ctrlPlay = document.getElementById('ctrlPlay');
  const videoTime = document.getElementById('videoTime');

  const formatTime = (secs) => {
    if (!Number.isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    if (!video.currentSrc) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  overlay?.addEventListener('click', togglePlay);
  playBtn?.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
  ctrlPlay?.addEventListener('click', togglePlay);

  video?.addEventListener('play', () => {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    ctrlPlay.classList.replace('fa-play', 'fa-pause');
  });
  video?.addEventListener('pause', () => {
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    ctrlPlay.classList.replace('fa-pause', 'fa-play');
  });
  video?.addEventListener('timeupdate', () => {
    videoTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  });
  video?.addEventListener('loadedmetadata', () => {
    videoTime.textContent = `0:00 / ${formatTime(video.duration)}`;
  });

  // ---- Contact form -> WhatsApp handoff ----
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    const message = [
      'Olá! Gostaria de um diagnóstico gratuito de TI.',
      `Nome: ${data.nome}`,
      `Empresa: ${data.empresa}`,
      `Telefone: ${data.telefone}`,
      `E-mail: ${data.email}`,
      `Principal desafio: ${data.desafio}`,
      data.mensagem ? `Mensagem: ${data.mensagem}` : null,
    ].filter(Boolean).join('\n');

    window.open(waLink(message), '_blank', 'noopener');
    form.reset();
  });

  // ---- Footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
