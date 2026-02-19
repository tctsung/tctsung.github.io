/* Blog home — lists posts with tag filter + search, parsed from public/blogs/*.md */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Tag from '../components/Tag'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [activeTag, setActiveTag] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}blogs/manifest.json`)
      .then(r => r.ok ? r.json() : [])
      .then(list => {
        const sorted = list.sort((a, b) => b.slug.localeCompare(a.slug))
        return Promise.all(sorted.map(async entry => {
          try {
            const res = await fetch(`${import.meta.env.BASE_URL}blogs/${entry.slug}.md`)
            const text = await res.text()
            return { ...entry, ...parseFrontContent(text, entry.slug) }
          } catch { return null }
        }))
      })
      .then(results => setPosts(results.filter(Boolean)))
      .catch(() => setPosts([]))
  }, [])

  /* Collect all unique tags across posts */
  const allTags = ['All', ...new Set(posts.flatMap(p => p.tags))]

  const filtered = posts.filter(p => {
    const matchTag = activeTag === 'All' || p.tags.includes(activeTag)
    const q = search.toLowerCase()
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))
    return matchTag && matchSearch
  })

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Blog</h2>

        <div className="vlog-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveTag('All') }}
            />
            <button onClick={() => {}}>Search</button>
          </div>
          <div className="tags-filter">
            {allTags.map(t => (
              <span
                key={t}
                className={`filter-tag${activeTag === t ? ' active' : ''}`}
                onClick={() => { setActiveTag(t); setSearch('') }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="blog-home-list">
          {filtered.length === 0
            ? <p className="no-posts">No matching posts found.</p>
            : filtered.map(p => (
              <div className="blog-home-item" key={p.slug}>
                <span className="blog-home-date">{p.date}</span>
                <Link to={`/blog/${p.slug}`} className="blog-home-title">{p.title}</Link>
                <p className="blog-home-summary">{p.summary}</p>
                <div className="blog-home-tags">
                  {p.tags.map(t => <Tag key={t} label={t} />)}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

/* Parse title, tags, summary, and date from markdown front content */
function parseFrontContent(md, slug) {
  const lines = md.split('\n')
  let title = slug, tags = [], summaryLines = [], titleFound = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!titleFound && trimmed.startsWith('# ')) {
      title = trimmed.replace(/^#\s+/, '')
      titleFound = true
      continue
    }
    if (titleFound) {
      if (trimmed === '---') break
      /* Parse [tags: a, b, c] */
      const tagMatch = trimmed.match(/^\[tags:\s*(.+)\]$/)
      if (tagMatch) {
        tags = tagMatch[1].split(',').map(t => t.trim()).filter(Boolean)
        continue
      }
      if (trimmed) summaryLines.push(trimmed)
    }
  }

  const dateStr = slug.match(/^(\d{4})(\d{2})(\d{2})/)
  const date = dateStr
    ? new Date(+dateStr[1], +dateStr[2] - 1, +dateStr[3]).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : ''

  return { title, tags, summary: summaryLines.join(' '), date }
}
