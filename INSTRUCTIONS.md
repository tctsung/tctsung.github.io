# AI Coding Instructions

Mandatory rules for any LLM writing code in this repo. Follow exactly.

---

## Color Theme

| Role | Hex |
|------|-----|
| Primary background | `#FFFFFF` (white) |
| Accent / highlight | `#A6F1E0` (mint green) |
| Secondary accent | `#73C7C7` (teal blue) |

- Derive hover states, shadows, and tints from these three.
- Accessibility: mint green and teal are light colors. Always use dark text (`#1a1a1a` or similar) on top of them. Never place white or light text on these backgrounds.
- Use the 60-30-10 rule: ~60% white, ~30% mint/teal for sections and accents, ~10% dark for text and contrast elements.

---

## Design

- Clean, modern, minimalist.
- Responsive: must look good on mobile, tablet, and desktop. Test both viewports.
- Consistent spacing, typography, and components across all pages.
- Intuitive navigation with a sticky header.

---

## Tech Stack

Deployed on GitHub Pages via GitHub Actions (build step runs in CI, output is static files).

| Layer | Choice |
|-------|--------|
| Framework | React (Vite) |
| Styling | CSS Modules or a single global CSS file -- keep it simple |
| Animations | Framer Motion for component animations (card flip, page transitions); CSS `@keyframes` for lightweight things (running cat) |
| Markdown | `react-markdown` for rendering blog posts from `.md` files |
| Fonts | Google Fonts (Poppins) via CDN |
| Icons | Font Awesome or `react-icons` |
| Deploy | `gh-pages` branch via GitHub Actions -- Vite builds to static files |

---

## Project Structure

```
tctsung.github.io/
├── public/                  # Static assets served as-is
│   └── doc/
│       └── resume.pdf
├── src/
│   ├── components/          # Reusable UI (Header, Footer, Card, CatAnimation, etc.)
│   ├── pages/               # One component per page
│   │   ├── About.jsx
│   │   ├── Resume.jsx
│   │   ├── BlogVlog.jsx
│   │   └── Projects.jsx
│   ├── data/                # JSON data files -- the single source of truth for content
│   │   ├── vlogs.json
│   │   └── resume.json
│   ├── assets/              # Images, SVGs
│   ├── styles/              # CSS files
│   ├── App.jsx              # Router + layout
│   └── main.jsx             # Entry point
├── blogs/                   # Blog posts as Markdown files (e.g. 2026-02-17-my-post.md)
├── INSTRUCTIONS.md           # This file
└── README.md
```

Key rules:
- Blog content lives in `blogs/` as Markdown. Never hardcode blog content in JSX.
- Vlog and resume data live in `src/data/` as JSON. Pages import and render from these files. Never hardcode this content in JSX.
- Shared UI (header, footer, nav) must be components -- no copy-paste across pages.
- Keep assets (images, PDFs) out of `src/` when possible; use `public/` for static files.

---

## Pages

4 main pages in the nav:

1. **About** -- Name card intro, bio, social links. Card flip animation.
2. **Resume** -- Rendered resume with PDF download link.
3. **Blog & Vlog** -- Blog posts loaded from `blogs/*.md`; embedded vlogs.
4. **Demos & Projects** -- Project showcase with screenshots and links.

---

## Data File Formats

### vlogs.json

YouTube video ID is extracted from the URL. Thumbnails are auto-generated via `https://img.youtube.com/vi/{youtubeId}/mqdefault.jpg`.

```json
{
  "intro": "Short intro paragraph for the vlog section.",
  "tags": ["All", "USA", "Nature", "Family", "Europe", "Ski", "Friend"],
  "vlogs": [
    {
      "youtubeId": "CSCATZFWBT4",
      "title": "Clear Kayaking in Silver Springs State Park, Florida",
      "tags": ["Nature", "USA"]
    }
  ]
}
```

### resume.json

Rendered as two side-by-side columns: education (left) and experience (right). Each column has its own background tint (e.g. mint green tint for education, teal blue tint for experience) to visually distinguish them. Entries within each column are listed chronologically top-to-bottom (most recent first).

```json
{
  "education": [
    {
      "institution": "New York University",
      "degree": "M.S. in Biostatistics",
      "dates": "2021.09 - 2023.05",
      "tags": ["Statistical Inference", "ML", "DL"]
    }
  ],
  "experience": [
    {
      "company": "Amazon",
      "role": "Business Intelligence Engineer",
      "dates": "2025.04 - Present",
      "details": null,
      "tags": ["AWS", "LLM", "ETL", "Causal ML"]
    },
    {
      "company": "Pfizer",
      "role": "Senior Software Developer",
      "dates": "2023.10 - 2025.03",
      "details": "Promoted from Software Developer (2023.10)",
      "tags": ["ETL", "Python", "R", "Azure", "Airflow"]
    }
  ]
}
```

---

## Animations

- Name card flip on the About page (Framer Motion, triggered on hover/click).
- Small cat running across the page (CSS sprite or lightweight SVG/GIF, <50KB).
- Subtle page transitions and scroll-triggered fade-ins.
- Respect `prefers-reduced-motion`.

---

## Code Quality

- Comments explain **why** and high-level structure, not the obvious.
- Every file starts with a brief comment on its purpose.
- No inline styles. No duplicated code across pages.
- English only.
- Never run interactive CLI commands. Pipe `yes |` or use `<<< "y"` to auto-confirm prompts (e.g. `yes | npm create vite@latest`).

---

## Setup Status

- The Vite + React project is already scaffolded at `/tmp/vite-temp`. Copy the scaffolding files (`package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`) into this repo. Do NOT run `npm create vite` again.
- `src/data/vlogs.json` and `src/data/resume.json` are already created with content extracted from the old HTML pages.
- After copying scaffolding files, run `npm install` to install dependencies, then build out the pages and components.
