/* Resume page — two-column layout from resume.json, with PDF download */
import { motion } from 'framer-motion'
import resume from '../data/resume.json'
import Tag from '../components/Tag'

function Entry({ title, subtitle, dates, details, tags }) {
  return (
    <div className="resume-entry">
      <strong>{title}</strong>
      <div className="role">{subtitle}</div>
      <div className="dates">{dates}</div>
      {details && <div className="details">{details}</div>}
      {tags?.length > 0 && (
        <div className="resume-tags">
          {tags.map(t => <Tag key={t} label={t} />)}
        </div>
      )}
    </div>
  )
}

export default function Resume() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Resume</h2>
        <div className="download-resume">
          <a href="/doc/Resume_CTTsai.pdf" className="btn" target="_blank" rel="noreferrer">
            Download Resume
          </a>
        </div>
        <motion.div
          className="resume-columns"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="resume-col education">
            <h3>🎓 Education</h3>
            {resume.education.map(e => (
              <Entry key={e.institution} title={e.institution} subtitle={e.degree} dates={e.dates} tags={e.tags} />
            ))}
          </div>
          <div className="resume-col experience">
            <h3>💼 Experience</h3>
            {resume.experience.map(e => (
              <Entry key={e.company + e.dates} title={e.company} subtitle={e.role} dates={e.dates} details={e.details} tags={e.tags} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
