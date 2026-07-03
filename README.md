## Personal Portfolio

A minimalist, React-based personal website built entirely through vibe coding.
I operated in a Copilot-style workflow, providing clear instructions on frontend/backend design while AI generated the implementation.

Check [INSTRUCTIONS.md](INSTRUCTIONS.md) for the well-designed system prompt used to control the AI's output, UI guidelines, tech stack (React, Vite, Framer Motion), and the data-driven architecture (JSON and Markdown)


## AI Models Used

- Version 1: thinking-Claude, Windsurf + Claude 3.7 Sonnet, and Grok

- Version 2: Claude Opus 4.6, Gemini 3 Pro

## Run Locally

```bash
npm install
npm run dev
```

## Add a Blog Post

**Manual** — write `.md` directly:
1. Create `public/blogs/YYYYMMDD_title-in-kebab-case.md` with YAML frontmatter (title, date, tags, summary)
2. Add `{"slug": "YYYYMMDD_title-in-kebab-case"}` to `public/blogs/manifest.json`
3. Commit

**From Obsidian** — publish a note programmatically:
1. Add entry to `docs/obsidian-posts.json` with `sourcePath` pointing to your vault note
2. `npm run publish:obsidian`
3. Commit generated `public/blogs/*.md` and `public/img/blog/` assets
