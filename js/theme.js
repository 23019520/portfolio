/**
 * js/theme.js
 * Dark / light mode toggle.
 * Persists preference to localStorage.
 */

(function () {
  'use strict';

  const toggle = document.getElementById('themeToggle');
  const icon   = document.getElementById('themeIcon');
  const html   = document.documentElement;

  // Apply saved preference on load
  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);

  toggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'dark';
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
  }
})();
