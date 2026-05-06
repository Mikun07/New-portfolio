import DP from '../../assets/img/Dp.jpg'
import { Link } from 'react-scroll'
import { useLanguage } from '../../context/LanguageContext'

const techStack = [
  'React', 'TypeScript', 'Node.js', 'Redux',
  'Tailwind CSS', 'Docker', 'Vitest', 'Cypress',
]

function Home() {
  const { t } = useLanguage()

  return (
    <section
      name="home"
      className="min-h-screen flex flex-col justify-center px-6 lg:px-10 py-24 lg:py-0"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="w-full flex flex-col gap-10">

        {/* ── Profile row ── */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={DP}
            alt="Ayomikun Festus-Olaleye"
            className="w-24 h-24 rounded-full object-cover border-2 shrink-0"
            style={{ borderColor: 'var(--accent)' }}
          />

          <div className="flex flex-col gap-1 text-center sm:text-left">
            <div
              className="flex items-center justify-center sm:justify-start gap-1 text-xs font-medium mb-1"
              style={{ color: 'var(--text-muted)' }}
            >
              <ion-icon name="location-outline"></ion-icon>
              <span>{t.home.location}</span>
            </div>

            <h1
              className="text-3xl lg:text-4xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Ayomikun Festus-Olaleye
            </h1>

            <p
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: 'var(--accent)' }}
            >
              {t.home.role}
            </p>

            <span
              className="mt-2 self-center sm:self-start text-xs px-3 py-1 rounded-full font-medium w-fit"
              style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)' }}
            >
              {t.home.available}
            </span>
          </div>
        </div>

        {/* ── Summary ── */}
        <div className="flex flex-col gap-4 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
          <p>{t.home.bio1}</p>
          <p>{t.home.bio2}</p>
        </div>

        {/* ── Tech stack pills ── */}
        <div className="flex flex-col gap-3">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            {t.home.coreStack}
          </p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-3 py-1 rounded-full border font-medium transition-colors duration-200"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-card)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* ── CTAs ── */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="contact"
            smooth
            duration={700}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-200 text-white"
            style={{ backgroundColor: 'var(--accent)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
          >
            <ion-icon name="paper-plane-outline"></ion-icon>
            {t.home.cta.contact}
          </Link>

          <Link
            to="experience"
            smooth
            duration={700}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border transition-colors duration-200"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <ion-icon name="briefcase-outline"></ion-icon>
            {t.home.cta.experience}
          </Link>

          <a
            href="/Resume.pdf"
            download
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-colors duration-200"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <ion-icon name="download-outline"></ion-icon>
            {t.home.cta.cv}
          </a>
        </div>
      </div>
    </section>
  )
}

export default Home
