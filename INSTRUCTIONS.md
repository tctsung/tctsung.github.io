# AI Coding Instructions

Mandatory rules for any LLM writing code in this repo. Follow exactly.

---

## Color Theme

| Role | Hex |
|------|-----|
| Primary background | `#FFFFFF` (white) |
| Accent / highlight | `#A6F1E0` (mint green) |
| Secondary accent | `#73C7C7` (teal blue) |
| Education accent | `#C5CAE9` (soft lavender) |

- Derive hover states, shadows, and tints from these three.
- Accessibility: mint green and teal are light colors. Default to dark text (`#1a1a1a` or similar) on top of them. Exception: white text is acceptable on the darker teal (`#73C7C7`) for small UI elements like badges, year markers, and pills where contrast is sufficient.
- Use the 60-30-10 rule: ~60% white, ~30% mint/teal for sections and accents, ~10% dark for text and contrast elements.

---

## Design

- Clean, modern, minimalist.
- Responsive: must look good on mobile, tablet, and desktop. Test both viewports.
- Consistent spacing, typography, and components across all pages.
- Intuitive navigation with a sticky header and a shared footer "EXPLORE MORE" section.

---

## Tech Stack

Deployed on GitHub Pages via GitHub Actions (build step runs in CI, output is static files).

| Layer | Choice |
|-------|--------|
| Framework | React (Vite) |
| Styling | Single global CSS file |
| Animations | Framer Motion for component animations and page transitions; CSS `@keyframes` for lightweight ambient UI motion (e.g. cats, hover effects) |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-raw` for blog posts; `react-syntax-highlighter` for code blocks |
| Fonts | Google Fonts — **Montserrat** (weights 400–800) as the sole UI font, with **Noto Sans TC** (400, 700) as CJK fallback only. No other font families. |
| Icons | Font Awesome (CDN) |
| Deploy | `gh-pages` branch via GitHub Actions -- Vite builds to static files |

---

## Project Structure

```
tctsung.github.io/
├── public/                  # Static assets served as-is
│   ├── blogs/               # Blog posts as Markdown (e.g. 20240508_consecutive-numbers-in-sql.md)
│   │   └── manifest.json    # List of post slugs — update manually for new posts; auto-updated by publish:obsidian
│   ├── img/
│   │   └── blog/            # Blog images organized by slug
│   └── doc/
│       └── resume.pdf
├── scripts/               # One-off scripts
│   └── publish-obsidian-posts.mjs
├── src/
│   ├── components/          # Reusable UI (Header, Footer, CatRunner, ScrollToTop, etc.)
│   ├── pages/               # One component per page
│   │   ├── About.jsx
│   │   ├── Resume.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogPost.jsx
│   │   └── Vlog.jsx
│   ├── data/                # JSON data files -- the single source of truth for content
│   │   ├── vlogs.json
│   │   └── resume.json
│   ├── assets/              # Images, SVGs
│   ├── styles/              # CSS files
│   ├── App.jsx              # Router + layout + shared route behavior
│   └── main.jsx             # Entry point
├── docs/                    # Detailed guides for AI and contributors
│   └── blog-format.md       # Blog markdown format guide
├── INSTRUCTIONS.md           # This file
└── README.md
```

Key rules:
- Vlog and resume data live in `src/data/` as JSON. Pages import and render from these files. Never hardcode this content in JSX.
- Shared UI (header, footer, nav) must be components -- no copy-paste across pages.
- Route changes should scroll the page to the top via shared router logic, not per-page hacks.
- Keep assets (images, PDFs) out of `src/` when possible; use `public/` for static files.
- **Images**: Always put new images in `public/img/`. Preferred format: **WebP** for photos/screenshots, **SVG** for logos/icons, **PNG** only when WebP produces a larger file (e.g. simple logos with few colors). When adding a new image that isn't already WebP, ask the user whether to convert it. Never edit `dist/` directly — it gets wiped on each build.

---

## Pages

4 main pages in the nav:

1. **About** -- Intro hero, bio, social links, accomplishments, services, and contact.
2. **Resume** -- Rendered resume with PDF download link.
3. **Blog** -- Blog posts loaded from `blogs/*.md`.
4. **Vlog** -- Embedded vlogs from JSON with tag filter + search.

Global navigation:
- Header is sticky on all pages.
- Footer includes a shared "EXPLORE MORE" navigation component on all pages.
- Desktop/tablet footer uses 4 equal card-style links; mobile footer uses a compact inline link layout.

---

## Blog

Blog posts live in `public/blogs/` as Markdown files. Never hardcode blog content in JSX.

- Naming: `YYYYMMDD_title-in-kebab-case.md`
- YAML frontmatter: `title`, `date`, `tags`, `summary`
- Images go in `public/img/blog/<slug>/`
- When adding a new post, add its slug to `public/blogs/manifest.json`
- Comments powered by Giscus (GitHub Discussions), config in `src/pages/BlogPost.jsx`
- Selected Obsidian notes can be published programmatically:
  - Add an entry to `docs/obsidian-posts.json` — `slug` is the clean kebab name (no date prefix)
  - Run `npm run publish:obsidian`
  - The script auto-prepends `YYYYMMDD_` from the `date` field to the slug for the filename and manifest
  - Commit the generated markdown in `public/blogs/` and copied assets in `public/img/blog/`

For the full blog format guide, see `docs/blog-format.md`.

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

Rendered as a vertical timeline with a center line. Education entries appear on the left, experience on the right. Year markers (from the `years` array) are shown between items on the center line — only include years that are meaningful (no out-of-range years). Each entry has a `position` field (integer) that controls its order top-to-bottom; this avoids overlap and lets you fine-tune placement without dynamic collision logic.

```json
{
  "years": [2025, 2024, 2023, 2022, 2019],
  "education": [
    {
      "institution": "New York University",
      "degree": "M.S. in Biostatistics",
      "dates": "2021.09 - 2023.05",
      "tags": ["Statistical Inference", "ML", "DL"],
      "position": 4
    }
  ],
  "experience": [
    {
      "company": "Amazon",
      "role": "Business Intelligence Engineer",
      "dates": "2025.04 - Present",
      "details": null,
      "tags": ["AWS", "LLM", "ETL", "Causal ML"],
      "position": 1
    },
    {
      "company": "Pfizer",
      "role": "Senior Software Developer",
      "dates": "2023.10 - 2025.03",
      "details": "Senior Software Developer (2024.10 ~)\nSoftware Developer (2023.10 ~)",
      "tags": ["ETL", "Python", "R", "Azure", "Airflow"],
      "position": 2
    }
  ]
}
```

---

## Animations

- Subtle page transitions and scroll-triggered fade-ins.
- Two cats peek from page edges; clicking/tapping them makes them spin and fly away for that appearance only.
- Respect `prefers-reduced-motion`.

---

## Code Quality

- Comments explain **why** and high-level structure, not the obvious.
- Every file starts with a brief comment on its purpose.
- No inline styles. No duplicated code across pages.
- English only.
- Never run interactive CLI commands. Pipe `yes |` or use `<<< "y"` to auto-confirm prompts (e.g. `yes | npm create vite@latest`).

---

## Performance

- **Load only what you use.** For libraries that support tree-shaking or light builds (e.g. `react-syntax-highlighter`), import only the needed modules/languages — never the full bundle.
- Lazy-load heavy pages (e.g. `BlogPost`) with `React.lazy` + `Suspense`.
