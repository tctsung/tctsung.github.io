/* Vlog page — vlogs from JSON with tag filter + search; desktop embeds in modal, mobile links to YouTube */
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import vlogData from '../data/vlogs.json'
import Tag from '../components/Tag'

export default function Vlog() {
  const [activeTag, setActiveTag] = useState('All')
  const [search, setSearch] = useState('')
  const [activeVideo, setActiveVideo] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  /* Close modal on Escape */
  const closeModal = useCallback(() => setActiveVideo(null), [])
  useEffect(() => {
    if (!activeVideo) return
    const onKey = e => e.key === 'Escape' && closeModal()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [activeVideo, closeModal])

  const handleClick = (v, e) => {
    if (isMobile) return // let the <a> navigate to YouTube
    e.preventDefault()
    setActiveVideo(v)
  }

  const filtered = vlogData.vlogs.filter(v => {
    const matchTag = activeTag === 'All' || v.tags.includes(activeTag)
    const q = search.toLowerCase()
    const matchSearch = !q || v.title.toLowerCase().includes(q) || v.tags.some(t => t.toLowerCase().includes(q))
    return matchTag && matchSearch
  })

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Vlog</h2>

        <div className="vlog-intro">
          <p>{vlogData.intro}</p>
        </div>

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

        <motion.div
          className="vlog-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {filtered.map(v => (
            <div className="vlog-card" key={v.youtubeId}>
              <a
                href={`https://youtu.be/${v.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                onClick={e => handleClick(v, e)}
              >
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
      </div>

      {/* YouTube embed modal (desktop only) */}
      {activeVideo && (
        <div className="video-modal-overlay" onClick={closeModal}>
          <div className="video-modal" onClick={e => e.stopPropagation()}>
            <button className="video-modal-close" onClick={closeModal} aria-label="Close">&times;</button>
            <div className="video-modal-player">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h3 className="video-modal-title">{activeVideo.title}</h3>
          </div>
        </div>
      )}
    </section>
  )
}
