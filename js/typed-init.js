/**
 * js/typed-init.js
 * Initialises Typed.js on the hero subtitle element.
 */

(function () {
  'use strict';

  if (typeof Typed === 'undefined') return;

  new Typed('#typedText', {
    strings: [
      'Full-Stack Developer.',
      'Mobile App Builder.',
      'ML Engineer.',
      'Problem Solver.',
      'API Architect.',
      'Game Developer.',
    ],
    typeSpeed:      55,
    backSpeed:      30,
    backDelay:      1800,
    loop:           true,
    smartBackspace: true,
  });
})();
