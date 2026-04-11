/* Site footer — unified explore-more navigation used across all pages */
import { NavLink } from 'react-router-dom'

const exploreLinks = [
  { to: '/', label: 'About', description: 'what I work on' },
  { to: '/resume', label: 'Resume', description: 'the serious version' },
  { to: '/blog', label: 'Blog', description: 'thoughts, tutorials & demos' },
  { to: '/vlog', label: 'Vlog', description: 'travel & life' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <section className="footer-explore" aria-labelledby="footer-explore-heading">
          <p className="footer-explore-title" id="footer-explore-heading">EXPLORE MORE</p>

          <nav className="footer-explore-list" aria-label="Explore more">
            {exploreLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className="footer-explore-row">
                <span className="footer-explore-row-text">
                  <span className="footer-explore-label">{link.label}</span>
                  <span className="footer-explore-description">{link.description}</span>
                </span>
              </NavLink>
            ))}
          </nav>

          <nav className="footer-explore-inline" aria-label="Explore more compact">
            {exploreLinks.map((link, index) => (
              <span key={link.to} className="footer-inline-item">
                <NavLink to={link.to} end={link.to === '/'}>{link.label}</NavLink>
                {index < exploreLinks.length - 1 && <span className="footer-inline-separator" aria-hidden="true">·</span>}
              </span>
            ))}
          </nav>
        </section>

        <p className="footer-copy">&copy; {new Date().getFullYear()} Ching-Tsung (Deron) Tsai. All rights reserved.</p>
      </div>
    </footer>
  )
}
