import { useLanguage } from '../../../core/providers/LanguageProvider'

const currentYear = new Date().getFullYear()

const socialLinks = [
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
]

function Footer() {
  const { t } = useLanguage()

  return (
    <footer
      className="w-full border-t transition-colors duration-300"
      style={{
        borderColor: 'var(--border-card)',
        backgroundColor: 'var(--bg-card)',
      }}
    >
      <div
        className="max-w-[1100px] mx-auto px-5 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-5"
      >
        {/* Left: copyright */}
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
            Ayomikun Festus-Olaleye
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            &copy; {currentYear} {t.footer.rights}
          </span>
        </div>

        {/* Center: built with */}
        <span
          className="text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          {t.footer.builtWith}{' '}
          <span style={{ color: 'var(--accent)' }}>React</span>
          {' & '}
          <span style={{ color: 'var(--accent)' }}>TypeScript</span>
        </span>

        {/* Right: social links */}
        <div className="flex items-center gap-2">
          {socialLinks.map(({ id, icon, href, label }) => (
            <a
              key={id}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base clay-card-sm transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <ion-icon name={icon}></ion-icon>
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
