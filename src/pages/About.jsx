/* About page — name card with flip animation, bio, social links */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const titles = [
  'ML Scientist',
  'Business Intelligence Engineer',
  'Skiing/Badminton Enthusiast',
  'Statistics MS',
  'Biotech BS',
  'Artist',
]

const socials = [
  { href: 'https://github.com/tctsung', icon: 'fab fa-github', label: 'GitHub' },
  { href: 'https://www.instagram.com/tsung_pct/', icon: 'fab fa-instagram', label: 'Instagram' },
  { href: 'https://www.linkedin.com/in/tctsung', icon: 'fab fa-linkedin', label: 'LinkedIn' },
  { href: 'https://medium.com/@tctsung', icon: 'fas fa-book', label: 'Medium' },
  { href: 'https://www.youtube.com/@ching-tsungderontsai2750/videos', icon: 'fab fa-youtube', label: 'YouTube' },
]

export default function About() {
  const [titleIdx, setTitleIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setTitleIdx(i => (i + 1) % titles.length), 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Card flip container */}
          <div className="card-flip-container" onClick={() => setFlipped(f => !f)}>
            <div className={`card-flip-inner${flipped ? ' flipped' : ''}`}>
              {/* Front — name card */}
              <div className="card-front">
                <div className="name-card">
                  <div className="profile-image">
                    <img src="/img/me.jpg" alt="Ching-Tsung (Deron) Tsai" />
                  </div>
                  <div className="profile-content">
                    <h1>Hello, I'm Ching-Tsung (Deron)</h1>
                    <div className="rotating-titles">
                      <span className="im-a">I'm a </span>
                      {titles.map((t, i) => (
                        <span key={t} className={`title${i === titleIdx ? ' visible' : ''}`}>{t}</span>
                      ))}
                    </div>
                    <p>
                      I'm a guy who likes to understand problems before building data-driven solutions.
                      After 3+ years crafting pipelines and ML solutions for big pharma and startups,
                      I'm now part of the Decision Science team at Amazon Ads. When I'm not messing with data,
                      you'll probably find me editing vlogs, carving turns on the slopes, or playing badminton!
                    </p>
                    <p>
                      I'm open for online <strong>1-on-1 tutoring</strong> (programming, stats) and{' '}
                      <strong>consulting</strong> (ML/DS application, biomedical stuff, or interview prep).
                      Feel free to shoot me a DM or email if you're interested!
                    </p>
                    <div className="social-links">
                      {socials.map(s => (
                        <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                           onClick={e => e.stopPropagation()}>
                          <i className={s.icon} />
                        </a>
                      ))}
                    </div>
                    <div className="contact-info">
                      <h3>Contact Me</h3>
                      <p><strong>Personal:</strong> tctsung@nyu.edu</p>
                      <p><strong>Work:</strong> tctsung@amazon.com</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Back — namecard image */}
              <div className="card-back">
                <img src="/ref/namecard.png" alt="Name card back" />
              </div>
            </div>
          </div>
          <p className="flip-hint">Click the card to flip ↻</p>
        </motion.div>
      </div>
    </section>
  )
}
