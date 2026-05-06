import AP from '../../assets/img/Ap.jpg'
import { useLanguage } from '../../context/LanguageContext'

interface SkillCategory {
  label: string
  items: string[]
}

// Mirrors the Skills section of the CV exactly
const skills: SkillCategory[] = [
  {
    label: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'Java'],
  },
  {
    label: 'Frontend',
    items: ['React', 'Redux', 'HTML5', 'CSS3', 'Tailwind CSS', 'Shadcn UI', 'Angular'],
  },
  {
    label: 'Testing & QA',
    items: ['Jest', 'Vitest', 'Cypress'],
  },
  {
    label: 'Backend & Databases',
    items: ['Node.js', 'MongoDB', 'SQL Server'],
  },
  {
    label: 'Tools & Platforms',
    items: ['Git', 'GitHub', 'Docker', 'Netlify', 'CI/CD', 'Agile (Scrum)', 'Figma'],
  },
  {
    label: 'Software Engineering',
    items: ['REST APIs', 'Modular Design', 'Clean Architecture', 'Performance Optimisation'],
  },
  {
    label: 'AI & Machine Learning',
    items: ['LLMs (GPT-4, Claude)', 'NLP', 'Prompt Engineering'],
  },
]

const education = [
  {
    id: 1,
    degree: "Master's in Software Engineering",
    institution: 'Blekinge Institute of Technology',
    location: 'Karlskrona, Sweden',
    period: 'Sep 2024 – Jun 2026 (Expected)',
    detail: 'Thesis: Evaluating Generative AI as a Support for the Detection of Practically Relevant Requirements Smells',
  },
  {
    id: 2,
    degree: 'Bachelor of Technology, Computer Science',
    institution: 'Bell University of Technology',
    location: 'Ogun State, Nigeria',
    period: 'Sep 2018 – Aug 2022',
    detail: 'Second Class Honours · CGPA: 3.43/5.0',
  },
]

function About() {
  const { t } = useLanguage()

  return (
    <section
      name="about"
      className="min-h-screen flex flex-col justify-center px-6 lg:px-10 py-24"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* ── Section header ── */}
      <div className="mb-10">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: 'var(--accent)' }}
        >
          {t.about.eyebrow}
        </p>
        <h2
          className="text-3xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          {t.about.heading}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">

        {/* ── Left — photo + education ── */}
        <div className="flex flex-col gap-8 lg:w-[280px] shrink-0">
          <img
            src={AP}
            alt="Ayomikun Festus-Olaleye"
            className="w-full max-w-[240px] rounded-xl object-cover border"
            style={{ borderColor: 'var(--border)' }}
          />

          {/* Education — from CV */}
          <div className="flex flex-col gap-4">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--text-muted)' }}
            >
              {t.about.education}
            </p>
            {education.map(({ id, degree, institution, location, period, detail }) => (
              <div
                key={id}
                className="flex flex-col gap-1 p-4 rounded-lg border"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--bg-card)',
                }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {degree}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--accent)' }}
                >
                  {institution}
                </span>
                <span
                  className="text-xs flex items-center gap-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <ion-icon name="location-outline"></ion-icon>
                  {location}
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {period}
                </span>
                <span
                  className="text-xs mt-1 leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right — bio + skills ── */}
        <div className="flex flex-col gap-8 flex-1">

          {/* Bio */}
          <div className="flex flex-col gap-3 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
            <p>{t.about.bio1}</p>
            <p>{t.about.bio2}</p>
          </div>

          {/* Skills — every category from the CV */}
          <div className="flex flex-col gap-5">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--text-muted)' }}
            >
              {t.about.skills}
            </p>
            {skills.map(({ label, items }) => (
              <div key={label} className="flex flex-col gap-2">
                <span
                  className="text-xs font-semibold"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-3 py-1 rounded-full border font-medium"
                      style={{
                        borderColor: 'var(--border)',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-card)',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications — each links to its own PDF, opens in new tab (no download) */}
          <div className="flex flex-col gap-3">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--text-muted)' }}
            >
              {t.about.certifications}
            </p>
            <div className="flex flex-col gap-2">
              {[
                {
                  label: 'Bachelor of Technology — Computer Science',
                  issuer: 'Bells University of Technology · Aug 2022',
                  pdf: '/Bachelor Degree.pdf',
                },
                {
                  label: 'Computer Professionals (CPN) — Graduate',
                  issuer: 'Computer Professionals Registration Council of Nigeria · Nov 2022',
                  pdf: '/CPN Certificate.pdf',
                },
                {
                  label: 'SQL Server Database Administration (SQL DBA)',
                  issuer: 'Udemy · Jun 2020',
                  pdf: '/SQL Certification .pdf',
                },
                {
                  label: 'Microsoft Office, Windows Server, CCNA, CCNP, Java, Android Dev',
                  issuer: 'New Horizons · Aug 2022',
                  pdf: '/New Horizons Certificate.pdf',
                },
              ].map(({ label, issuer, pdf }) => (
                <a
                  key={label}
                  href={pdf}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 p-3 rounded-lg border transition-colors duration-200 group"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--bg-card)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                >
                  <ion-icon
                    name="ribbon-outline"
                    style={{ color: 'var(--accent)', fontSize: '1.1rem', marginTop: '1px', flexShrink: '0' } as React.CSSProperties}
                  ></ion-icon>
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-xs font-semibold leading-snug"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {issuer}
                    </span>
                  </div>
                  <ion-icon
                    name="open-outline"
                    style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: 'auto', marginTop: '2px', flexShrink: '0' } as React.CSSProperties}
                  ></ion-icon>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default About
