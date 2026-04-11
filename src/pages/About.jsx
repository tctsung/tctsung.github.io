/* About page — hero intro, accomplishments, services, and contact details */
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const logos = [
  { src: '/img/amazon_logo.webp', alt: 'Amazon' },
  { src: '/img/pfizer_logo.svg', alt: 'Pfizer' },
  { src: '/img/nyu_logo.webp', alt: 'NYU' },
  { src: '/img/regeneron_logo.svg', alt: 'Regeneron' },
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
  <>Developed end-to-end <strong>agentic workflows with knowledge graph</strong> to orchestrate ads marketing automation</>,
  <>Built large-scale data pipelines (<strong>&gt;20 billion</strong> records per week) in pharmaceutical and digital marketing industries</>,
  <>Published machine learning package focused on imbalanced classification with <strong>10K+ downloads</strong></>,
  'Collaborated with marketers, ML researchers, clinicians, bioinformaticians, statisticians, and engineers',
]

const logoEmail = 'tctsung@nyu.edu'

export default function About() {
  const [logoContactOpen, setLogoContactOpen] = useState(false)
  const logoContactRef = useRef(null)

  useEffect(() => {
    if (!logoContactOpen) return undefined

    const handlePointerDown = event => {
      if (logoContactRef.current && !logoContactRef.current.contains(event.target)) {
        setLogoContactOpen(false)
      }
    }

    const handleEscape = event => {
      if (event.key === 'Escape') setLogoContactOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [logoContactOpen])

  return (
    <section className="about-page">
      <div className="container">
        {/* Hero: photo left, text right */}
        <div className="hero-row">
          <div className="hero-photo">
            <img src="/img/me.webp" alt="Deron" />
          </div>
          <div className="hero-text">
            <h1>Aal Izz Well <span className="smiley-3d">☺︎</span></h1>
            <p className="intro">
              I&apos;m <span className="snow-slope"><strong>DERON, the 1.0X ML scientist 🤡</strong><svg className="squiggle" viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M0 4 Q25 0,50 4 T100 4 T150 4 T200 4" /><path d="M0 10 Q25 6,50 10 T100 10 T150 10 T200 10" /></svg></span>  <br/>Powered by Kiro + LangGraph + PyTorch + {' '}
              <span
                ref={logoContactRef}
                className={`inline-contact ${logoContactOpen ? 'is-open' : ''}`}
                onMouseEnter={() => setLogoContactOpen(true)}
                onMouseLeave={() => setLogoContactOpen(false)}
                onBlur={event => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setLogoContactOpen(false)
                  }
                }}
              >
                <button
                  type="button"
                  className="inline-contact-trigger"
                  aria-expanded={logoContactOpen}
                  aria-controls="logo-contact-card"
                  onClick={() => setLogoContactOpen(open => !open)}
                  onFocus={() => setLogoContactOpen(true)}
                >
                  [DM me for logo]
                </button>
                <span className="inline-contact-card" id="logo-contact-card" role="note">
                  <span className="inline-contact-icon" aria-hidden="true">
                    <i className="fas fa-envelope" />
                  </span>
                  <a href={`mailto:${logoEmail}`}>{logoEmail}</a>
                </span>
              </span>
              <br />
              When I&apos;m not messing with data or building AI agents to replace myself, you&apos;ll find me carving East Coast powder, editing vlogs, or playing badminton.
            </p>
            {/* Social icons */}
            <div className="social-row">
              {socials.map(s => (
                <a key={s.icon} href={s.href} target="_blank" rel="noreferrer"><i className={s.icon} /></a>
              ))}
            </div>
          </div>
        </div>

        {/* Logos row */}
        <div className="logos-row">
          {logos.map(l => <img key={l.alt} src={l.src} alt={l.alt} className="org-logo" />)}
        </div>

        {/* Accomplishments — two-sided */}
        <motion.div
          className="two-sided-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="two-sided-left">
            <h3>Things I have<br /><strong>ACCOMPLISHED</strong></h3>
          </div>
          <div className="two-sided-right">
            <ul>
              {accomplishments.map(a => <li key={a}>{a}</li>)}
            </ul>
          </div>
        </motion.div>

        {/* Services — two-sided */}
        <motion.div
          className="two-sided-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="two-sided-left">
            <h3>Problems I can<br /><strong>SOLVE</strong></h3>
          </div>
          <div className="two-sided-right">
            <div className="service-group">
              <h4>Consulting</h4>
              <ul>
                <li>Efficient ML: build LLM &amp; ML systems that minimize cost while maximizing performance under real-world constraints</li>
                <li>Agentic Automation: replace manual work with AI-driven automation for fast, consistent execution</li>
                <li>Data insights: turn data into clear understanding for more objective decision-making, especially in AdTech and clinical domains</li>
              </ul>
            </div>
            <div className="service-group">
              <h4>Mock Interviews</h4>
              <ul>
                <li>Data Scientist: Machine Learning, LLM, A/B Testing</li>
                <li>Data Engineer: SQL, Data Modeling</li>
                <li>Business Analyst: Data Visualization, Product Sense</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          className="contact-box contact-standalone"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3>Contact Me</h3>
          <p><strong>Personal:</strong> tctsung@nyu.edu</p>
          <p><strong>Work:</strong> tctsung@amazon.com</p>
        </motion.div>
      </div>
    </section>
  )
}
