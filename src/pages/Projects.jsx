/* Projects page — project cards from projects.json */
import { motion } from 'framer-motion'
import projects from '../data/projects.json'

export default function Projects() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Projects</h2>
        <div className="project-intro">
          <p>My side projects are driven by three things I value the most: helping others out, boosting work efficiency, and acquiring new knowledge.</p>
        </div>
        <motion.div
          className="projects-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {projects.map(p => (
            <div className="project-card" key={p.title}>
              <div className="project-card-image">
                <img src={p.image} alt={p.title} />
              </div>
              <div className="project-card-body">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="tech-stack">
                  {p.tools.map(t => <span className="tech" key={t}>{t}</span>)}
                </div>
                <a href={p.link} className="btn sm" target="_blank" rel="noreferrer">View Code</a>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
