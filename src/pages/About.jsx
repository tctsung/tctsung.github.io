import { motion } from 'framer-motion'

const logos = [
  { src: '/img/amazon_logo.jpg', alt: 'Amazon' },
  { src: '/img/pfizer_logo.svg', alt: 'Pfizer' },
  { src: '/img/nyu_logo.jpg', alt: 'NYU' },
  { src: '/img/nctu_logo.png', alt: 'NCTU' },
]

const socials = [
  { href: 'https://github.com/tctsung', icon: 'fab fa-github' },
  { href: 'https://www.instagram.com/tsung_pct/', icon: 'fab fa-instagram' },
  { href: 'https://www.linkedin.com/in/tctsung', icon: 'fab fa-linkedin' },
  { href: 'https://medium.com/@tctsung', icon: 'fas fa-book' },
  { href: 'https://www.youtube.com/@ching-tsungderontsai2750/videos', icon: 'fab fa-youtube' },
]

const accomplishments = [
  'Developed end-to-end agentic workflows with knowledge graph to orchestrate ads marketing automation',
  'Built large-scale data pipelines (>20 billion records per week) in pharmaceutical and digital marketing industries',
  'Published machine learning package focused on imbalanced classification with 10K+ downloads',
  'Collaborated with marketers, ML researchers, clinicians, bioinformaticians, statisticians, and engineers',
]

export default function About() {
  return (
    <section className="about-page">
      <div className="container">
        {/* Hero: photo left, text right */}
        <div className="hero-row">
          <div className="hero-photo">
            <img src="/img/me.jpg" alt="Deron" />
          </div>
          <div className="hero-text">
            <h1>Aal Izz Well <span className="smiley-3d">☺︎</span></h1>
            <p className="intro">
              I'm the <strong>1X ML Scientist, Deron (璟聰)</strong>.
              <br />
              When I'm not messing with data or building AI agents to replace myself, you'll find me <span className="snow-slope">carving East Coast powder<svg className="squiggle" viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M0 4 Q25 0,50 4 T100 4 T150 4 T200 4" /><path d="M0 10 Q25 6,50 10 T100 10 T150 10 T200 10" /></svg></span>, editing vlogs, or playing badminton.
            </p>
            {/* Social icons */}
            <div className="social-row">
              {socials.map(s => (
                <a key={s.icon} href={s.href} target="_blank" rel="noreferrer"><i className={s.icon} /></a>
              ))}
            </div>
            {/* Contact box */}
            <div className="contact-box">
              <h3>Contact Me</h3>
              <p><strong>Personal:</strong> tctsung@nyu.edu</p>
              <p><strong>Work:</strong> tctsung@amazon.com</p>
            </div>
          </div>
        </div>

        {/* Logos row */}
        <div className="logos-row">
          {logos.map(l => <img key={l.alt} src={l.src} alt={l.alt} className="org-logo" />)}
        </div>

        {/* Accomplishments */}
        <motion.div
          className="accomplishments-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3>Accomplishments</h3>
          <ul>
            {accomplishments.map(a => <li key={a}>{a}</li>)}
          </ul>
        </motion.div>

        {/* Services */}
        <motion.div
          className="services-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3>Services</h3>
          <div className="service-group">
            <h4>Consulting</h4>
            <ul>
              <li>Building Agentic workflows</li>
              <li>ML solutions for tabular/text data to replace manual work</li>
              <li>Study design/Statistical analysis in AdTech & Clinical domains</li>
            </ul>
          </div>
          <div className="service-group">
            <h4>Interview Prep</h4>
            <ul>
              <li><strong>Data Scientist</strong> — ML, LLM, A/B Testing</li>
              <li><strong>Data Engineer</strong> — SQL, Data Modeling</li>
              <li><strong>Business Analyst</strong> — Data Visualization, Study Design</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
