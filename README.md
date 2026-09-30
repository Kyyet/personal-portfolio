# Personal Portfolio

Modern dark personal portfolio website for a **Fresh Graduate SMK Rekayasa Perangkat Lunak / Web Developer**. Built to showcase profile, education, certificates, experience, projects, and skills for job applications.

**Design direction:** modern developer portfolio × premium dark SaaS × personal branding — clean, minimal, professional, with a deep charcoal background (`#0A0A0A`) and electric blue accent (`#005EE9`).

## Tech Stack

- **[Vite](https://vite.dev/)** — build tool & dev server
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility-first styling with custom design tokens
- **Vanilla JavaScript** — no framework, fast and lightweight
- **Plus Jakarta Sans + JetBrains Mono** — typography

## Features

- Sticky navbar with blur-on-scroll and active section indicator
- Hero with staggered entrance animation, grid pattern, and subtle glows
- About, Education (timeline), Certificates (cards + lightbox modal), Experience (timeline with responsibilities & tech tags), Featured Projects (4-column responsive grid)
- Skills grouped by category (no percentage bars) + horizontal tech marquee
- Contact section with validation-friendly form
- Fully responsive (desktop / tablet / mobile), semantic HTML, keyboard-friendly, `prefers-reduced-motion` support

## Getting Started

```bash
npm install
npm run dev      # start dev server → http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Customizing

All personal data is marked with placeholders — search for `[...]` in `index.html`:

| Placeholder | Replace with |
|---|---|
| `[NAMA LENGKAP]`, `[NAMA]`, `[Nama]` | Your full name / short name |
| `/profile.jpg` | Your photo → `public/profile.jpg` |
| `/cv.pdf` | Your CV → `public/cv.pdf` |
| `your@email.com`, `href="#"` | Your email & social links |
| `[Company Name]`, `[Month Year]` | Your experience details |
| Certificate `data-*` attributes | Your real certificates |

## Project Structure

```
├── index.html          # All sections (semantic static HTML)
├── public/             # Static assets (profile.jpg, cv.pdf, projects/)
├── src/
│   ├── main.js         # Interactions: nav, reveal, modal, form
│   └── style.css       # Design tokens + component styles
└── vite.config.js
```

---

© 2026 [Nama]. All rights reserved.
