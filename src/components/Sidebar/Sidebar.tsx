import DP from '../../assets/img/Dp.jpg'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import LanguagePicker from '../LanguagePicker/LanguagePicker'

interface SocialLink {
  id: number
  icon: string
  href: string
  label: string
  download?: boolean
}

const socialLinks: SocialLink[] = [
  {
    id: 1,
    icon: 'logo-linkedin',
    href: 'https://www.linkedin.com/in/ayomikun-festus-olaleye-bab137249/',
    label: 'LinkedIn',
  },
  {
    id: 2,
    icon: 'logo-github',
    href: 'https://github.com/Mikun07',
    label: 'GitHub',
  },
  {
    id: 3,
    icon: 'document-text-outline',
    href: '/Resume.pdf',
    label: 'Resume',
    download: true,
  },
]

function Sidebar() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()

  return (
    <aside
      className="
        hidden lg:flex flex-col gap-6
        w-[280px] h-screen sticky top-0 overflow-y-auto
        border-l p-6
        transition-colors duration-300
      "
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Profile */}
      <div className="flex flex-col items-center text-center gap-3 pt-8">
        <div className="relative">
          <img
            src={DP}
            alt="Ayomikun Festus-Olaleye"
            className="w-24 h-24 rounded-full object-cover border-2"
            style={{ borderColor: 'var(--accent)' }}
          />
          <span
            className="absolute bottom-1 right-1 w-3 h-3 rounded-full border-2"
            style={{ backgroundColor: 'var(--success)', borderColor: 'var(--bg-card)' }}
          />
        </div>

        <div>
          <h2
            className="font-bold text-base leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Ayomikun Festus-Olaleye
          </h2>
          <p className="text-xs mt-1 font-medium" style={{ color: 'var(--accent)' }}>
            {t.sidebar.title}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {t.sidebar.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <ion-icon name="location-outline"></ion-icon>
          <span>{t.sidebar.location}</span>
        </div>

        <span
          className="text-xs px-3 py-1 rounded-full font-medium"
          style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)' }}
        >
          {t.sidebar.available}
        </span>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      <p className="text-xs leading-relaxed text-center" style={{ color: 'var(--text-secondary)' }}>
        {t.sidebar.bio}
      </p>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* Social links */}
      <div className="flex flex-col gap-2">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {t.sidebar.findMe}
        </p>
        {socialLinks.map(({ id, icon, href, label, download }) => (
          <a
            key={id}
            href={href}
            download={download}
            target={download ? undefined : '_blank'}
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
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
            <ion-icon name={icon}></ion-icon>
            {label}
          </a>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* Contact info */}
      <div className="flex flex-col gap-2">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {t.sidebar.contact}
        </p>
        <a
          href="mailto:ayomikunolaleye@gmail.com"
          className="text-xs break-all transition-colors duration-200"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          ayomikunolaleye@gmail.com
        </a>
        <a
          href="tel:+46762640140"
          className="flex items-center gap-1 text-xs transition-colors duration-200"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ion-icon name="call-outline"></ion-icon>
          (+46) 76 264 0140
        </a>
      </div>

      <div className="flex-1" />

      {/* Theme toggle + language picker — side by side */}
      <div className="flex flex-row gap-2">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? t.sidebar.lightMode : t.sidebar.darkMode}
          className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-sm font-medium border transition-colors duration-200 whitespace-nowrap"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <ion-icon name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}></ion-icon>
          <span className="text-xs">{theme === 'dark' ? t.sidebar.lightMode : t.sidebar.darkMode}</span>
        </button>
        <LanguagePicker />
      </div>
    </aside>
  )
}

export default Sidebar
