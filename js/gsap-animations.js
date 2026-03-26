/**
 * js/gsap-animations.js
 * All GSAP + ScrollTrigger animations as per spec.
 */

(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger plugin
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ── Helper: reduced motion check ────────────────────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // ── Hero Animations (page load) ───────────────────────
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTL
    .to('.gsap-hero-eyebrow', { opacity: 1, y: 0, duration: 0.6, delay: 0.2 })
    .to('.hero-name', {
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.9,
      ease: 'power4.inOut',
    }, '-=0.2')
    .to('.gsap-hero-subtitle', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .to('.gsap-hero-ctas', { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');

  // ── Nav links stagger ────────────────────────────────
  gsap.from('.nav-link', {
    opacity: 0,
    y: -12,
    duration: 0.5,
    stagger: 0.08,
    delay: 0.6,
    ease: 'power2.out',
  });

  // ── Section headings ─────────────────────────────────
  gsap.utils.toArray('.gsap-section-label').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      opacity: 1,
      x: 0,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'transform',
    });
    // Init
    gsap.set(el, { x: -40, opacity: 0 });
  });

  // ── About section ────────────────────────────────────
  gsap.to('.gsap-about-text', {
    scrollTrigger: { trigger: '#about', start: 'top 75%', once: true },
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
  });

  gsap.to('.gsap-about-photo', {
    scrollTrigger: { trigger: '#about', start: 'top 75%', once: true },
    opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: 'power3.out',
  });

  // ── Skill groups ─────────────────────────────────────
  gsap.utils.toArray('.gsap-skill-group').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      opacity: 1, y: 0, duration: 0.6, delay: i * 0.1, ease: 'power2.out',
    });
  });

  // Skill icons pop-in
  gsap.utils.toArray('.skill-icon-item').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      scale: 0,
      opacity: 0,
      duration: 0.4,
      delay: i * 0.04,
      ease: 'back.out(1.7)',
    });
  });

  // ── Timeline items ───────────────────────────────────
  gsap.utils.toArray('.gsap-timeline-item').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      opacity: 1, y: 0, duration: 0.7, delay: i * 0.15, ease: 'power3.out',
    });
  });

  // ── Project cards ────────────────────────────────────
  gsap.utils.toArray('.project-card').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      opacity: 0,
      y: 50,
      rotation: -2,
      duration: 0.65,
      delay: i * 0.07,
      ease: 'power3.out',
    });
  });

  // ── Contact form ─────────────────────────────────────
  gsap.to('.gsap-contact-form', {
    scrollTrigger: { trigger: '#contact', start: 'top 75%', once: true },
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
  });

})();
