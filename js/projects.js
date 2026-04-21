(function () {

  'use strict';

  const GITHUB_USER = '23019520';
  const EXCLUDED_REPOS = ['PhaseOut', 'foodbridge', 'face-extraction-model'];

  const FEATURED = [
    {
      title: 'PhaseOut',
      subtitle: 'Sleep automation app for Android',
      tags: ['Flutter', 'Firebase', 'Android'],
      type: 'preview',
      url: 'https://23019520.github.io/phaseout-privacy/',
      github: 'https://github.com/23019520/PhaseOut',
      filter: 'mobile',
    },
    {
      title: 'FoodBridge',
      subtitle: 'Food donation & redistribution platform',
      tags: ['Flutter', 'Firebase', 'Web'],
      type: 'preview',
      url: 'https://foodbridge-ebon.vercel.app/',
      github: 'https://github.com/23019520/foodbridge',
      filter: 'mobile',
    },
    {
      title: 'Face Extraction Model',
      subtitle: 'Computer vision pipeline with OpenCV & TensorFlow',
      tags: ['Python', 'TensorFlow', 'OpenCV'],
      type: 'image',
      url: 'https://github.com/23019520/face-extraction-model',
      image: 'assets/images/1.jpg',
      github: 'https://github.com/23019520/face-extraction-model',
      filter: 'ml',
    }
  ];

  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  function init() {
    renderFeatured();
    renderGithubCard();
    initFilters();
    initTilt();
  }

  function renderFeatured() {
    FEATURED.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.dataset.filter = p.filter;

      if (p.type === 'preview') {
        card.innerHTML = `
          <div class="proj-preview-wrap">
            <iframe 
              src="${p.url}" 
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
              class="proj-iframe">
            </iframe>

            <div class="proj-iframe-overlay">
              <a href="${p.url}" target="_blank" rel="noopener" class="proj-visit-btn">
                Visit Site
              </a>
            </div>
          </div>

          ${cardBody(p)}
        `;
      } else {
        // ✅ FULL CLICKABLE CARD
        card.innerHTML = `
          <a href="${p.url}" target="_blank" rel="noopener" class="proj-full-link">
            <div class="proj-preview-wrap proj-image-wrap">
              <img src="${p.image}" alt="${p.title}" class="proj-cover-img" loading="lazy"/>
            </div>

            ${cardBody(p)}
          </a>
        `;
      }

      grid.appendChild(card);
    });
  }

  function cardBody(p) {
    return `
      <div class="proj-body">
        <div class="proj-title-row">
          <h3 class="proj-title">${p.title}</h3>

          <a href="${p.github}" target="_blank" rel="noopener" class="proj-gh-icon">
            GitHub
          </a>
        </div>

        <p class="proj-subtitle">${p.subtitle}</p>

        <div class="proj-tags">
          ${p.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')}
        </div>
      </div>
    `;
  }

  function renderGithubCard() {
    const card = document.createElement('div');
    card.className = 'project-card github-more-card';
    card.dataset.filter = 'all';

    card.innerHTML = `
      <div class="gh-card-inner">
        <h3 class="gh-card-title">More on GitHub</h3>
        <p class="gh-card-sub">Experiments, coursework & open-source work</p>
        <span class="gh-card-cta">Browse →</span>
      </div>
    `;

    card.addEventListener('click', openModal);
    grid.appendChild(card);
  }

  function openModal() {
    let overlay = document.getElementById('ghModalOverlay');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'ghModalOverlay';

      overlay.innerHTML = `
        <div id="ghModal">
          <div class="gh-modal-header">
            <h2>GitHub Projects</h2>
            <button id="ghModalClose">&times;</button>
          </div>

          <div id="ghModalBody">
            <div class="gh-modal-loading">Loading...</div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal();
      });

      document.getElementById('ghModalClose').onclick = closeModal;
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    fetchRepos();
  }

  function closeModal() {
    const overlay = document.getElementById('ghModalOverlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function fetchRepos() {
    const body = document.getElementById('ghModalBody');

    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`)
      .then(r => r.json())
      .then(repos => {

        const filtered = repos.filter(r =>
          !EXCLUDED_REPOS.map(e => e.toLowerCase()).includes(r.name.toLowerCase()) &&
          !r.fork
        );

        if (!filtered.length) {
          body.innerHTML = `<p class="gh-modal-empty">No additional repos.</p>`;
          return;
        }

        body.innerHTML = filtered.map(r => `
          <a class="gh-repo-row" href="${r.html_url}" target="_blank">
            <div>
              <p class="gh-repo-name">${r.name}</p>
              ${r.description ? `<p class="gh-repo-desc">${r.description}</p>` : ''}
            </div>

            <span class="gh-repo-stars">⭐ ${r.stargazers_count}</span>
          </a>
        `).join('');

      })
      .catch(() => {
        body.innerHTML = `<p class="gh-modal-empty">Failed to load repos.</p>`;
      });
  }

  function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {

        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const f = btn.dataset.filter;

        document.querySelectorAll('.project-card').forEach(card => {
          const show =
            f === 'all' ||
            card.dataset.filter === f ||
            card.classList.contains('github-more-card');

          card.style.display = show ? '' : 'none';
        });

      });
    });
  }

  function initTilt() {
    if (typeof VanillaTilt === 'undefined') return;

    VanillaTilt.init(document.querySelectorAll('.project-card'), {
      max: 8,
      speed: 400,
      glare: true,
      "max-glare": 0.1
    });
  }

  init();

})();