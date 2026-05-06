import { useLanguage } from '../../context/LanguageContext'

const currentYear = new Date().getFullYear()

function Footer() {
  const { t } = useLanguage()

  return (
    <footer
      className="w-full px-6 lg:px-10 py-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors duration-300"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--bg-card)',
      }}
    >
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        &copy; {currentYear} Ayomikun Festus-Olaleye. {t.footer.rights}
      </span>

      <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
        {t.footer.builtWith}
        <span style={{ color: 'var(--accent)' }}>React</span>
        &amp;
        <span style={{ color: 'var(--accent)' }}>TypeScript</span>
      </span>
    </footer>
  )
}

export default Footer
