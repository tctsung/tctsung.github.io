/* Sticky header — transparent on hero, frosted glass on scroll */
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const close = () => setMenuOpen(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header${scrolled ? ' header-solid' : ''}`}>
      <div className="container">
        <NavLink to="/" className="logo" onClick={close}>
          CHING-TSUNG (DERON) TSAI 蔡璟聰
        </NavLink>
        <nav className={`nav${menuOpen ? ' open' : ''}`}>
          <ul>
            <li><NavLink to="/" end onClick={close}>About</NavLink></li>
            <li><NavLink to="/resume" onClick={close}>Resume</NavLink></li>
            <li><NavLink to="/projects" onClick={close}>Projects</NavLink></li>
            <li><NavLink to="/blog" onClick={close}>Blog</NavLink></li>
            <li><NavLink to="/vlog" onClick={close}>Vlog</NavLink></li>
          </ul>
        </nav>
        <div className="mobile-menu-btn" onClick={() => setMenuOpen(v => !v)}>
          <span /><span /><span />
        </div>
      </div>
    </header>
  )
}
