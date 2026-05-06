import { useState } from 'react'
import { Link } from 'react-scroll'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import LanguagePicker from '../LanguagePicker/LanguagePicker'

function Navbar() {
  const [nav, setNav] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()

  const links = [
    { id: 1, to: 'home',       label: t.nav.home,       icon: 'home-outline' },
    { id: 2, to: 'about',      label: t.nav.about,      icon: 'information-circle-outline' },
    { id: 3, to: 'experience', label: t.nav.experience, icon: 'briefcase-outline' },
    { id: 4, to: 'services',   label: t.nav.services,   icon: 'terminal-outline' },
    { id: 5, to: 'project',    label: t.nav.projects,   icon: 'folder-open-outline' },
    { id: 6, to: 'contact',    label: t.nav.contact,    icon: 'chatbubble-ellipses-outline' },
  ]

  return (
    <nav
      className="lg:hidden w-full h-16 fixed top-0 left-0 z-50 flex items-center justify-between px-4 border-b transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Logo */}
      <Link
        to="home"
        smooth
        duration={700}
        className="flex items-center gap-2 font-semibold cursor-pointer"
        style={{ color: 'var(--text-primary)' }}
      >
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          A
        </span>
        <span className="text-sm hidden sm:block">Ayomikun F-O</span>
      </Link>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <LanguagePicker />

        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors duration-200"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
            backgroundColor: 'transparent',
          }}
        >
          <ion-icon name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}></ion-icon>
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setNav(!nav)}
          className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors duration-200"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
            backgroundColor: 'transparent',
          }}
        >
          <ion-icon name={nav ? 'close' : 'menu-outline'}></ion-icon>
        </button>
      </div>

      {/* Mobile drawer */}
      {nav && (
        <div
          className="absolute top-16 left-0 w-full border-b flex flex-col py-2 z-50 transition-colors duration-300"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
          }}
        >
          {links.map(({ id, to, label, icon }) => (
            <Link
              key={id}
              to={to}
              smooth
              duration={500}
              onClick={() => setNav(false)}
              className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ion-icon name={icon}></ion-icon>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar
