import DP from '../../assets/img/Dp.jpg'
import { Link } from 'react-scroll'
import { useLanguage } from '../../core/providers/LanguageProvider'

const techStack = [
  'React', 'TypeScript', 'Node.js', 'Python',
  'FastAPI', 'Redux', 'Docker', 'GitHub Actions',
]

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

function Home() {
  const { t } = useLanguage()

  return (
    <section
      name="home"
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Background atmosphere blobs */}
      <div
        className="clay-blob w-[480px] h-[480px] -top-24 -right-24"
        style={{ backgroundColor: 'var(--accent-dim)', opacity: 0.5 }}
      />
      <div
        className="clay-blob w-[320px] h-[320px] bottom-0 left-0"
        style={{ backgroundColor: 'hsla(200, 60%, 60%, 0.08)' }}
      />

      <div className="section-wrap relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start">

          {/* Left: hero text */}
          <div className="flex flex-col gap-7 flex-1 text-center lg:text-left">

            {/* Status badge */}
            <div className="flex justify-center lg:justify-start">
              <span
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full clay-card-sm"
                style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-dim)' }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--success)', boxShadow: '0 0 6px var(--success)' }}
                />
                {t.home.available}
              </span>
            </div>

            {/* Name + role */}
            <div className="flex flex-col gap-2">
              <div
                className="flex items-center justify-center lg:justify-start gap-2 text-xs font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                <ion-icon name="location-outline"></ion-icon>
                <span>{t.home.location}</span>
              </div>
              <h1
                className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Ayomikun{' '}
                <span style={{ color: 'var(--accent)' }}>Festus-Olaleye</span>
              </h1>
              <p
                className="text-sm font-semibold tracking-widest uppercase mt-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t.home.role}
              </p>
            </div>

            {/* Bio */}
            <div
              className="flex flex-col gap-3 text-sm leading-7 max-w-[580px] mx-auto lg:mx-0"
              style={{ color: 'var(--text-secondary)' }}
            >
              <p>{t.home.bio1}</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                to="contact"
                smooth
                duration={700}
                className="clay-btn-primary flex items-center gap-2 px-6 py-2.5 text-sm cursor-pointer"
              >
                <ion-icon name="paper-plane-outline"></ion-icon>
                {t.home.cta.contact}
              </Link>

              <Link
                to="experience"
                smooth
                duration={700}
                className="clay-btn-outline flex items-center gap-2 px-6 py-2.5 text-sm cursor-pointer"
              >
                <ion-icon name="briefcase-outline"></ion-icon>
                {t.home.cta.experience}
              </Link>

              <a
                href="/Resume.pdf"
                download
                className="clay-btn-outline flex items-center gap-2 px-6 py-2.5 text-sm"
              >
                <ion-icon name="download-outline"></ion-icon>
                {t.home.cta.cv}
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              {socialLinks.map(({ id, icon, href, label }) => (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg clay-card-sm transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
                >
                  <ion-icon name={icon}></ion-icon>
                </a>
              ))}
            </div>
          </div>

          {/* Right: clay profile card */}
          <div className="flex flex-col items-center gap-6 shrink-0">
            <div
              className="clay-card p-5 flex flex-col items-center gap-5"
              style={{ width: '260px' }}
            >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={DP}
                  alt="Ayomikun Festus-Olaleye"
                  className="w-28 h-28 rounded-2xl object-cover"
                  style={{ boxShadow: 'var(--clay-shadow)' }}
                />
                <span
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2"
                  style={{ backgroundColor: 'var(--success)', borderColor: 'var(--bg-card)' }}
                />
              </div>

              <div className="flex flex-col items-center gap-1 text-center">
                <span
                  className="text-sm font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Ayomikun Festus-Olaleye
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                  Software Engineer
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Full-Stack + AI Systems
                </span>
              </div>

              <div
                className="w-full pt-4 border-t"
                style={{ borderColor: 'var(--border-card)' }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {t.home.coreStack}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {techStack.map((tech) => (
                    <span key={tech} className="clay-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Home
