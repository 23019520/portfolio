/**
 * js/projects.js
 * Renders project cards from GitHub API or fallback static data.
 * Supports filter buttons: All / Mobile / ML / Game Dev
 */

(function () {
  'use strict';

  // ── Static fallback projects ─────────────────────────
  // Used when GitHub API is unavailable. Keep updated with real repos.
  const FALLBACK_PROJECTS = [
    {
      name: 'Ride-Request App',
      description: 'Full-stack cross-platform ride-booking app with real-time GPS tracking, user authentication, and live driver matching.',
      tags: ['Flutter', 'Firebase', 'Google Maps', 'Dart'],
      category: 'mobile',
      featured: true,
      icon: '🚗',
      github: 'https://github.com/23019520',
      demo: null,
    },
    {
      name: 'Student Marketplace App',
      description: 'Cross-platform buying & selling platform for students with secure transactions, user ratings, and a web companion interface.',
      tags: ['Flutter', 'Firebase', 'Dart'],
      category: 'mobile',
      featured: false,
      icon: '🛍️',
      github: 'https://github.com/23019520',
      demo: null,
    },
    {
      name: 'Face Extraction Model',
      description: 'Computer vision model trained to automatically detect and extract faces from full-body images with high precision using TensorFlow and OpenCV.',
      tags: ['Python', 'TensorFlow', 'OpenCV', 'Google Colab'],
      category: 'ml',
      featured: false,
      icon: '🧠',
      github: 'https://github.com/23019520',
      demo: null,
    },
    {
      name: 'Pixel Platformer Game',
      description: 'Mario-inspired 2D platformer built in Godot Engine featuring physics-based gameplay, custom pixel art, sound effects, and interactive game mechanics.',
      tags: ['GDScript', 'Godot Engine', '2D', 'Pixel Art'],
      category: 'game',
      featured: false,
      icon: '🎮',
      github: 'https://github.com/23019520',
      demo: null,
    },
  ];

  // ── DOM refs ──────────────────────────────────────────
  const grid    = document.getElementById('projectsGrid');
  const filters = document.querySelectorAll('.filter-btn');

  if (!grid) return;

  // ── Init ──────────────────────────────────────────────
  async function init() {
    renderSkeletons(3);

    const repos = await GitHubAPI.getRepos();
    const projects = repos ? mapReposToProjects(repos) : FALLBACK_PROJECTS;

    renderProjects(projects);
    initFilters(projects);
    initTilt();
    triggerGSAP();
  }

  // ── Map GitHub repos to project shape ─────────────────
  function mapReposToProjects(repos) {
    const knownNames = FALLBACK_PROJECTS.map(p => p.name.toLowerCase().replace(/\s+/g, '-'));

    // Merge: prefer fallback rich data, add GitHub stats
    const merged = FALLBACK_PROJECTS.map(fp => {
      const slug   = fp.name.toLowerCase().replace(/\s+/g, '-');
      const match  = repos.find(r =>
        r.name.toLowerCase().includes(slug.split('-')[0]) ||
        r.description?.toLowerCase().includes(fp.name.toLowerCase().split(' ')[0])
      );
      return {
        ...fp,
        stars:   match?.stargazers_count || 0,
        forks:   match?.forks_count      || 0,
        github:  match?.html_url         || fp.github,
        demo:    match?.homepage         || fp.demo,
      };
    });

    // Add any GitHub repos not in fallback list
    repos.forEach(r => {
      const already = knownNames.some(n => r.name.toLowerCase().includes(n.split('-')[0]));
      if (!already && !r.fork && r.name !== 'portfolio') {
        merged.push({
          name:        r.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          description: r.description || 'No description provided.',
          tags:        r.topics?.length ? r.topics : [r.language].filter(Boolean),
          category:    'all',
          featured:    false,
          icon:        '📦',
          github:      r.html_url,
          demo:        r.homepage || null,
          stars:       r.stargazers_count,
          forks:       r.forks_count,
        });
      }
    });

    return merged;
  }

  // ── Render helpers ────────────────────────────────────
  const INITIAL_VISIBLE = 4;
  let allProjects = [];

  function renderSkeletons(n) {
    grid.innerHTML = Array.from({ length: n }, () =>
      `<div class="skeleton-card"></div>`
    ).join('');
  }

  function renderProjects(projects) {
    grid.innerHTML = '';

    // Featured first
    allProjects = [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    allProjects.forEach((p, i) => {
      const html = cardHTML(p, i);
      grid.insertAdjacentHTML('beforeend', html);
    });

    // Hide cards beyond the initial limit
    const cards = grid.querySelectorAll('.project-card');
    cards.forEach((card, i) => {
      if (i >= INITIAL_VISIBLE) card.classList.add('project-collapsed');
    });

    // Render the "more" button if needed
    renderMoreButton(cards.length);
  }

  function renderMoreButton(total) {
    const existing = document.getElementById('projectsMoreBtn');
    if (existing) existing.remove();

    if (total <= INITIAL_VISIBLE) return;

    const remaining = total - INITIAL_VISIBLE;
    const wrap = document.createElement('div');
    wrap.className = 'projects-more-wrap';
    wrap.innerHTML = `
      <button class="projects-more-btn" id="projectsMoreBtn">
        <span class="more-btn-text">+${remaining} more projects</span>
        <i class="fa-solid fa-chevron-down more-btn-icon"></i>
      </button>`;
    grid.insertAdjacentElement('afterend', wrap);

    let expanded = false;
    wrap.querySelector('#projectsMoreBtn').addEventListener('click', () => {
      expanded = !expanded;
      const cards = grid.querySelectorAll('.project-card.project-collapsed, .project-card.project-expanded');
      const btn   = document.getElementById('projectsMoreBtn');

      cards.forEach(card => {
        card.classList.toggle('project-collapsed', !expanded);
        card.classList.toggle('project-expanded',   expanded);
      });

      btn.querySelector('.more-btn-text').textContent = expanded
        ? 'Show less'
        : `+${remaining} more projects`;
      btn.querySelector('.more-btn-icon').style.transform = expanded
        ? 'rotate(180deg)' : 'rotate(0deg)';

      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  }

  function cardHTML(p, _i) {
    const tagsHTML  = p.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
    const statsHTML = (p.stars !== undefined)
      ? `<div class="project-stats">
           <span><i class="fa-regular fa-star"></i> ${p.stars}</span>
           <span><i class="fa-solid fa-code-fork"></i> ${p.forks}</span>
         </div>` : '';

    const demoLink = p.demo
      ? `<a href="${p.demo}" target="_blank" rel="noopener" aria-label="Live demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
      : '';

    const featured = p.featured ? 'featured' : '';
    const previewHTML = p.featured
      ? `<div class="project-preview">${p.icon}</div>` : '';

    return `
      <article class="project-card ${featured}" data-category="${p.category}" data-tilt>
        ${previewHTML}
        <div class="project-body">
          <div class="project-top">
            <span class="project-icon">${p.icon}</span>
            <div class="project-links">
              <a href="${p.github}" target="_blank" rel="noopener" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
              ${demoLink}
            </div>
          </div>
          <h3 class="project-name">${p.name}</h3>
          <p class="project-desc">${p.description}</p>
          <div class="project-tags">${tagsHTML}</div>
          ${statsHTML}
        </div>
      </article>`;
  }

  // ── Filters ───────────────────────────────────────────
  function initFilters(projects) {
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const f = btn.dataset.filter;
        const cards = [...grid.querySelectorAll('.project-card')];

        // First pass: show/hide by category
        let visibleCount = 0;
        cards.forEach(card => {
          const cat  = card.dataset.category;
          const show = f === 'all' || cat === f || cat === 'all';
          card.classList.toggle('hidden', !show);
          if (show) visibleCount++;
        });

        // Second pass: re-apply collapse on visible cards
        let shown = 0;
        cards.forEach(card => {
          if (!card.classList.contains('hidden')) {
            shown++;
            card.classList.remove('project-expanded');
            if (shown > INITIAL_VISIBLE) {
              card.classList.add('project-collapsed');
            } else {
              card.classList.remove('project-collapsed');
            }
          }
        });

        // Re-render more button
        const moreWrap = document.querySelector('.projects-more-wrap');
        if (moreWrap) moreWrap.remove();
        renderMoreButton(visibleCount);
      });
    });
  }

  // ── vanilla-tilt ──────────────────────────────────────
  function initTilt() {
    if (typeof VanillaTilt === 'undefined') return;
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max:     8,
      speed:   400,
      glare:   true,
      'max-glare': 0.1,
    });
  }

  // ── Re-trigger GSAP on newly rendered cards ───────────
  function triggerGSAP() {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  // ── Run ───────────────────────────────────────────────
  init();

})();
