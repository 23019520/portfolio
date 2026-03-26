/**
 * js/cursor.js
 * Custom animated cursor: dot + ring with lerp delay.
 * Hidden on touch/mobile devices.
 */

(function () {
  'use strict';

  // Hide on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;
  let mouseX = 0, mouseY = 0;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hover state on interactive elements
  const interactives = 'a, button, [data-tilt], .filter-btn, .nav-link, input, textarea';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      ring.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      ring.classList.remove('hover');
    }
  });

  // RAF loop
  function animate() {
    // Dot follows instantly
    dotX = mouseX;
    dotY = mouseY;

    // Ring lerps behind
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    dot.style.left  = dotX  + 'px';
    dot.style.top   = dotY  + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    requestAnimationFrame(animate);
  }

  animate();
})();
