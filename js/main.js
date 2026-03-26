/**
 * js/main.js
 * Entry point — bootstraps nav, hamburger, contact form, footer streak.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initContactForm();
    initFooterStreak();
  });

  // ── Sticky Nav ────────────────────────────────────────
  function initNav() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Scroll class
    window.addEventListener('scroll', () => {
      navbar?.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // Hamburger toggle
    hamburger?.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu?.classList.toggle('open');
      document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger?.classList.remove('open');
        mobileMenu?.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Contact Form (Formspree AJAX) ──────────────────────
  function initContactForm() {
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const error   = document.getElementById('formError');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnText   = form.querySelector('.btn-text');
      const btnLoader = form.querySelector('.btn-loader');
      btnText.style.display  = 'none';
      btnLoader.style.display = 'inline-flex';

      try {
        const res = await fetch(form.action, {
          method:  'POST',
          body:    new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          form.reset();
          success.style.display = 'block';
          error.style.display   = 'none';
        } else {
          throw new Error('Submission failed');
        }
      } catch {
        error.style.display   = 'block';
        success.style.display = 'none';
      } finally {
        btnText.style.display  = 'inline';
        btnLoader.style.display = 'none';
      }
    });
  }

  // ── Footer GitHub Streak ──────────────────────────────
  async function initFooterStreak() {
    const el = document.getElementById('footerStreak');
    if (!el) return;

    const user = await GitHubAPI.getUser().catch(() => null);
    if (user) {
      el.innerHTML = `<span style="font-size:0.72rem;color:var(--text-muted);">
        <i class="fa-brands fa-github" style="margin-right:0.35rem;"></i>
        ${user.public_repos} public repos · ${user.followers} followers
      </span>`;
    }
  }

})();
