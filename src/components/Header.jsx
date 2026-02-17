/* Sticky header with nav links */
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)

  return (
    <header className="header">
      <div className="container">
        <div className="logo">Ching-Tsung (Deron) Tsai 蔡璟聰</div>
        <nav className={`nav${menuOpen ? ' open' : ''}`}>
          <ul>
            <li><NavLink to="/" end onClick={close}>About</NavLink></li>
            <li><NavLink to="/resume" onClick={close}>Resume</NavLink></li>
            <li><NavLink to="/projects" onClick={close}>Projects</NavLink></li>
            <li><NavLink to="/blog" onClick={close}>Blog &amp; Vlog</NavLink></li>
          </ul>
        </nav>
        <div className="mobile-menu-btn" onClick={() => setMenuOpen(v => !v)}>
          <span /><span /><span />
        </div>
      </div>
    </header>
  )
}
