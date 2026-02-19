# Blog Format Guide
[tags: meta]

Documents the blog markdown format, naming conventions, and how to add new posts.

---

## File Location & Naming

- Blog posts live in `public/blogs/` as `.md` files
- Naming: `YYYYMMDD_title-in-kebab-case.md` (e.g. `20240508_consecutive-numbers-in-sql.md`)
- Date and title are parsed from the filename automatically

## Markdown Structure

Every blog post must follow this exact structure:

```
# Post Title
[tags: tag1, tag2, tag3]

Summary text shown on the blog home page preview.

---

Full blog content starts here.
```

- **Line 1**: `# Title` — becomes the post title
- **Line 2**: `[tags: ...]` — comma-separated tags for filtering (e.g. `tutorial, SQL, LeetCode`)
- **Between tags and `---`**: plain text summary for the blog home page
- **After `---`**: full post body with markdown rendering

## Supported Markdown Features

- Headers (`##`, `###`, etc.)
- Bold, italic, links, blockquotes, tables (GitHub Flavored Markdown via `remark-gfm`)
- Fenced code blocks with syntax highlighting (via `react-syntax-highlighter`)
- Inline HTML (via `rehype-raw`)
- Images

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

## Comments

Giscus (GitHub Discussions) loads at the bottom of each post. Config is in `src/pages/BlogPost.jsx`. Users comment via their GitHub account.

## Tags

Tags are auto-collected from all posts and shown as filter pills on the blog home page. The blog home also has a search bar that matches against title, summary, and tags.
