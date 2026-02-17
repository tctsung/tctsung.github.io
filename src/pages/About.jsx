/* About page — editorial hero, bio, accomplishments, services */
import { motion } from 'framer-motion'

const accomplishments = [
  'Developed end-to-end agentic workflows with knowledge graph to orchestrate ads marketing automation',
  'Built large-scale data pipelines (>20 billion records per week) in pharmaceutical and digital marketing industries',
  'Published machine learning package focused on imbalanced classification with 10K+ downloads',
  'Collaborated with marketers, ML researchers, clinicians, bioinformaticians, statisticians, and engineers',
]

const links = [
  { href: 'mailto:tctsung@amazon.com', icon: 'fas fa-building', label: 'Work:', value: 'tctsung@amazon.com' },
  { href: 'mailto:tctsung@nyu.edu', icon: 'fas fa-envelope', label: 'Personal:', value: 'tctsung@nyu.edu' },
  { href: 'https://www.linkedin.com/in/tctsung', icon: 'fab fa-linkedin', value: 'linkedin.com/in/tctsung' },
  { href: 'https://github.com/tctsung', icon: 'fab fa-github', value: '@tctsung' },
  { href: 'https://www.instagram.com/tsung_pct/', icon: 'fab fa-instagram', value: '@tsung_pct' },
]

export default function About() {
  return (
    <>
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-left">
            <p className="hero-greeting">Welcome to my corner of the internet. I'm a</p>
            <h1 className="hero-title">1X ML Scientist · Amazon · NYU</h1>
            <p className="hero-by">by <strong>Ching-Tsung (Deron) Tsai 蔡璟聰</strong></p>
            <div className="hero-links">
              {links.map(l => (
                <a key={l.value} href={l.href} target="_blank" rel="noreferrer">
                  <i className={l.icon} />
                  {l.label && <strong>{l.label}</strong>} {l.value}
                </a>
              ))}
            </div>
          </div>
          <div className="hero-right">
            <img src="/img/me.jpg" alt="Deron" />
          </div>
        </div>
      </section>

      <section className="section about-bio">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bio-content"
          >
            <p className="bio-text">
              I like to understand problems before building data-driven solutions.
              Currently part of the Decision Science team at Amazon Ads.
              When I'm not building AI agents, you'll find me editing vlogs,
              carving turns on the slopes, or playing badminton.
            </p>

            <h3 className="bio-heading">Accomplishments</h3>
            <ul className="bio-list">
              {accomplishments.map(a => <li key={a}>{a}</li>)}
            </ul>

            <h3 className="bio-heading">Services</h3>
            <ul className="bio-list">
              <li>Consulting — statistical analysis, agentic workflow builds</li>
              <li>Tutoring — DS/ML interview prep (English, Chinese, Taiwanese)</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </>
  )
}
