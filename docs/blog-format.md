# Blog Format Guide
[tags: meta]

Documents the blog markdown format, naming conventions, and how to add new posts.

---

## File Location & Naming

- Blog posts live in `public/blogs/` as `.md` files
- Naming: `YYYYMMDD_title-in-kebab-case.md` (e.g. `20240508_consecutive-numbers-in-sql.md`)

## Markdown Structure

Prefer YAML frontmatter for new posts:

```md
---
title: Post Title
date: 2026-02-19
tags: [tag1, tag2, tag3]
summary: Summary text shown on the blog home page preview.
---

Full blog content starts here.
```

- **YAML `title`**: becomes the post title
- **YAML `date`**: shown on the post and blog index
- **YAML `tags`**: used for filtering
- **YAML `summary`**: shown on the blog home page preview
- **After frontmatter**: full post body with markdown rendering

## Supported Markdown Features

- Headers (`##`, `###`, etc.)
- Bold, italic, links, blockquotes, tables (GitHub Flavored Markdown via `remark-gfm`)
- Fenced code blocks with syntax highlighting (via `react-syntax-highlighter`)
- Inline HTML (via `rehype-raw`)
- Images
- Heading anchors for `##` through `#####`

## Images

- Store in `public/img/blog/<slug>/` where `<slug>` matches the filename without `.md`
- Example: `public/img/blog/20240508_consecutive-numbers-in-sql/fig1.webp`
- Reference in markdown: `![alt text](/img/blog/20240508_consecutive-numbers-in-sql/fig1.webp)`

## Adding a New Post

1. Create `public/blogs/YYYYMMDD_title.md` following the structure above
2. Add images to `public/img/blog/YYYYMMDD_title/`
3. Add the slug to `public/blogs/manifest.json`:

```json
[
  { "slug": "20260219_test" },
  { "slug": "20240508_consecutive-numbers-in-sql" }
]
```

## Publishing Obsidian Notes

Selected Obsidian notes can be published programmatically.

1. Add an entry to `docs/obsidian-posts.json`
2. Run `npm run publish:obsidian`
3. Commit the generated files in `public/blogs/` and `public/img/blog/`

The importer:

- strips Obsidian frontmatter
- writes website YAML frontmatter
- converts `[[#Heading]]` links to heading anchors
- converts unknown `[[Wiki Links]]` to plain text
- copies referenced `![[image.png]]` assets into the matching blog image folder
- renames images according to the registry when a mapping is provided

## Comments

Giscus (GitHub Discussions) loads at the bottom of each post. Config is in `src/pages/BlogPost.jsx`. Users comment via their GitHub account.

## Tags

Tags are auto-collected from all posts and shown as filter pills on the blog home page. The blog home also has a search bar that matches against title, summary, and tags.
