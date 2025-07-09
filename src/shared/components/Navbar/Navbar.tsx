import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { useTheme } from '../../../core/providers/ThemeProvider'
import { useLanguage } from '../../../core/providers/LanguageProvider'
import LanguagePicker from '../LanguagePicker/LanguagePicker'

function Navbar() {
  const [nav, setNav] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { id: 1, to: 'home',       label: t.nav.home },
    { id: 2, to: 'about',      label: t.nav.about },
    { id: 3, to: 'experience', label: t.nav.experience },
    { id: 4, to: 'services',   label: t.nav.services },
    { id: 5, to: 'project',    label: t.nav.projects },
    { id: 6, to: 'contact',    label: t.nav.contact },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 navbar-blur ${scrolled ? 'shadow-sm' : ''}`}
      style={{
        backgroundColor: scrolled ? 'color-mix(in srgb, var(--bg-card) 92%, transparent)' : 'color-mix(in srgb, var(--bg) 85%, transparent)',
        borderBottom: scrolled ? '1px solid var(--border-card)' : '1px solid transparent',
        height: '64px',
      }}
    >
      <div className="max-w-[1100px] mx-auto h-full flex items-center justify-between px-5 md:px-8">

        {/* Logo */}
        <Link
          to="home"
          smooth
          duration={700}
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
              boxShadow: 'var(--clay-shadow-sm)',
            }}
          >
            A
          </span>
          <span
            className="text-sm font-semibold hidden sm:block"
            style={{ color: 'var(--text-primary)' }}
          >
            Ayomikun <span style={{ color: 'var(--accent)' }}>F-O</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ id, to, label }) => (
            <Link
              key={id}
              to={to}
              smooth
              duration={600}
              spy
              activeClass="nav-active"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors duration-200"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent)'
                e.currentTarget.style.backgroundColor = 'var(--accent-dim)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguagePicker />
          </div>

          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 clay-card-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ion-icon name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}></ion-icon>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setNav(!nav)}
            aria-label="Toggle menu"
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 clay-card-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ion-icon name={nav ? 'close-outline' : 'menu-outline'}></ion-icon>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {nav && (
        <div
          className="md:hidden absolute top-16 left-0 w-full py-3 px-4 flex flex-col gap-1 shadow-lg"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-card)',
            borderTop: '1px solid var(--border-card)',
          }}
        >
          {links.map(({ id, to, label }) => (
            <Link
              key={id}
              to={to}
              smooth
              duration={500}
              onClick={() => setNav(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors duration-200"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-dim)'
                e.currentTarget.style.color = 'var(--accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 mt-1 border-t flex items-center gap-2" style={{ borderColor: 'var(--border-card)' }}>
            <LanguagePicker />
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
