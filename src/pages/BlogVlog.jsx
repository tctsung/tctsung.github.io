/* Blog & Vlog page — vlogs from JSON with tag filter + search; blog posts from blogs/*.md */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import vlogData from '../data/vlogs.json'
import Tag from '../components/Tag'

export default function BlogVlog() {
  const [activeTag, setActiveTag] = useState('All')
  const [search, setSearch] = useState('')
  const [blogPosts, setBlogPosts] = useState([])

  /* Attempt to load blog index — blogs/ may be empty */
  useEffect(() => {
    fetch('/blogs/index.json')
      .then(r => r.ok ? r.json() : [])
      .then(setBlogPosts)
      .catch(() => setBlogPosts([]))
  }, [])

  const filtered = vlogData.vlogs.filter(v => {
    const matchTag = activeTag === 'All' || v.tags.includes(activeTag)
    const q = search.toLowerCase()
    const matchSearch = !q || v.title.toLowerCase().includes(q) || v.tags.some(t => t.toLowerCase().includes(q))
    return matchTag && matchSearch
  })

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Blog &amp; Vlog</h2>

        {/* Vlog intro */}
        <div className="vlog-intro">
          <p>{vlogData.intro}</p>
        </div>

        {/* Filters */}
        <div className="vlog-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search vlogs..."
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveTag('All') }}
            />
            <button onClick={() => {}}>Search</button>
          </div>
          <div className="tags-filter">
            {vlogData.tags.map(t => (
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

        {/* Vlog grid */}
        <motion.div
          className="vlog-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {filtered.map(v => (
            <div className="vlog-card" key={v.youtubeId}>
              <a href={`https://youtu.be/${v.youtubeId}`} target="_blank" rel="noreferrer">
                <div className="vlog-thumbnail">
                  <img src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} alt={v.title} />
                  <div className="play-icon"><i className="fas fa-play-circle" /></div>
                </div>
              </a>
              <div className="vlog-card-body">
                <h3>{v.title}</h3>
                <div className="vlog-card-tags">
                  {v.tags.map(t => <Tag key={t} label={t} />)}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Blog posts section */}
        <div className="blog-section">
          <h2 className="section-title">Blog</h2>
          {blogPosts.length === 0 ? (
            <p className="no-posts">No blog posts yet — stay tuned!</p>
          ) : (
            <div className="blog-list">
              {blogPosts.map(p => (
                <div className="blog-post-card" key={p.slug}>
                  <h3>{p.title}</h3>
                  <span className="date">{p.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
