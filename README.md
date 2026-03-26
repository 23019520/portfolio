# Unarine Dzivhani — Portfolio

Personal portfolio website for Unarine Dzivhani, BSc Computer Science graduate and Full-Stack Developer.

**Live:** https://unarined.dev  
**Stack:** Vanilla HTML · CSS3 · JavaScript (ES6+) · Three.js · GSAP · GitHub Pages

---

## 🗂 Structure

```
portfolio/
├── index.html                  # Single-page application entry point
├── css/
│   ├── main.css                # Variables, reset, base styles
│   ├── nav.css                 # Navigation
│   ├── hero.css                # Hero section
│   ├── projects.css            # Project cards
│   ├── animations.css          # Keyframes & GSAP init states
│   └── responsive.css          # All media queries
├── js/
│   ├── main.js                 # Nav, contact form, footer
│   ├── three-scene.js          # Three.js particle background
│   ├── gsap-animations.js      # GSAP + ScrollTrigger
│   ├── github-api.js           # GitHub REST API + caching
│   ├── projects.js             # Project cards renderer
│   ├── cursor.js               # Custom animated cursor
│   ├── theme.js                # Dark/light mode toggle
│   └── typed-init.js           # Typed.js subtitle
├── assets/
│   ├── images/                 # profile.jpg/webp, og-image.png
│   ├── cv/                     # Unarine_Dzivhani_CV.pdf
│   └── icons/                  # Favicons (16, 32, 180, 192px)
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Auto-deploy to GitHub Pages on push
│       └── lighthouse.yml      # Lighthouse CI on pull requests
├── CNAME                       # Custom domain
├── robots.txt
├── sitemap.xml
├── .prettierrc
└── .gitignore
```

---

## 🚀 Local Development

No build step required. Open the project with VS Code and use the **Live Server** extension:

1. Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. Browser opens at `http://127.0.0.1:5500`

---

## 🌐 Deployment

The site auto-deploys to GitHub Pages on every push to `main` via GitHub Actions.

**Manual first-time setup:**
1. Go to repo **Settings → Pages**
2. Set Source to **GitHub Actions**
3. Push to `main` — the workflow handles the rest

---

## 🔧 Configuration Checklist

Before going live, update these:

| File | What to change |
|------|---------------|
| `index.html` | Replace `YOUR_FORM_ID` in the Formspree form action |
| `index.html` | Update OG image URL and canonical URL |
| `CNAME` | Set your actual custom domain |
| `sitemap.xml` | Update domain and dates |
| `assets/images/` | Add `profile.jpg`, `profile.webp`, `og-image.png` |
| `assets/cv/` | Add `Unarine_Dzivhani_CV.pdf` |
| `assets/icons/` | Add favicon files (16, 32, 180, 192px) |

---

## 📊 Lighthouse Targets

| Category | Target |
|----------|--------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 90 |

---

## 🔗 Links

- **GitHub:** https://github.com/23019520
- **LinkedIn:** https://www.linkedin.com/in/unarine-dzivhani-programmer
- **Email:** unarined3@gmail.com
