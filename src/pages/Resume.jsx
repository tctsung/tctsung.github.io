/* Resume page — vertical timeline, items alternate left/right by position order */
import { motion } from 'framer-motion'
import resume from '../data/resume.json'
import Tag from '../components/Tag'

/* Merge and sort all entries by position */
function buildTimeline() {
  const items = [
    ...resume.education.map(e => ({ ...e, type: 'education', title: e.institution, subtitle: e.degree })),
    ...resume.experience.map(e => ({ ...e, type: 'experience', title: e.company, subtitle: e.role })),
  ]
  items.sort((a, b) => a.position - b.position)
  return items
}

/* Assign year markers to the item whose start date is closest */
function getYearInsertions(items) {
  const sortedYears = [...new Set(resume.years)].sort((a, b) => b - a)
  const map = {}
  for (const y of sortedYears) {
    let best = items[0], bestDist = Infinity
    for (const item of items) {
      const start = parseStart(item.dates)
      const end = parseEnd(item.dates)
      if (start <= y + 1 && end >= y) {
        const dist = Math.abs(start - y)
        if (dist < bestDist) { bestDist = dist; best = item }
      }
    }
    if (!map[best.position]) map[best.position] = []
    map[best.position].push(y)
  }
  for (const k in map) map[k].sort((a, b) => b - a)
  return map
}

function parseStart(dates) {
  const [y, m] = dates.split(' - ')[0].split('.')
  return Number(y) + (Number(m) - 1) / 12
}

function parseEnd(dates) {
  const e = dates.split(' - ')[1]?.trim()
  if (!e || e === 'Present') return new Date().getFullYear() + 1
  const [y, m] = e.split('.')
  return Number(y) + (Number(m) - 1) / 12
}

export default function Resume() {
  const items = buildTimeline()
  const yearMap = getYearInsertions(items)

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Resume</h2>
        <div className="download-resume">
          <a href="/doc/Resume_CTTsai.pdf" className="btn" target="_blank" rel="noreferrer">
            Download Resume
          </a>
        </div>

        {/* Legend */}
        <div className="tl-legend">
          <span className="tl-legend-item"><span className="tl-legend-dot edu" /> Education</span>
          <span className="tl-legend-item"><span className="tl-legend-dot exp" /> Experience</span>
        </div>

        <motion.div
          className="timeline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {items.map((item, i) => {
            const prev = i > 0 ? items[i - 1] : null
            const sameGroup = prev && prev.title === item.title
            return (
            <div key={item.title + item.dates} className={sameGroup ? 'tl-grouped' : ''}>
              {yearMap[item.position]?.map(y => (
                <div className="year-marker" key={y}>{y}</div>
              ))}
              <div className={`tl-item ${item.side}`}>
                <div className={`tl-dot ${item.type}`} />
                <div className={`tl-content ${item.type}`}>
                  <div className="tl-header">
                    <strong>{item.title}</strong> | {item.dates}
                  </div>
                  <div className="tl-body">
                    {item.details
                      ? item.details.split('\n').map((line, i) => <div key={i}>{line}</div>)
                      : item.subtitle}
                    {item.tags?.length > 0 && (
                      <div className={`resume-tags${item.side === 'left' ? ' right-aligned' : ''}`}>
                        {item.tags.map(t => <Tag key={t} label={t} />)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )})}
        </motion.div>
      </div>
    </section>
  )
}
