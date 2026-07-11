import AP from '../../assets/img/Ap.jpg'
import { useLanguage } from '../../core/providers/LanguageProvider'

interface SkillCategory {
  label: string
  items: string[]
}

const skills: SkillCategory[] = [
  { label: 'Languages', items: ['TypeScript', 'JavaScript (ES6+)', 'Python', 'Java', 'SQL'] },
  { label: 'Frontend', items: ['React.js', 'Redux Toolkit', 'Angular', 'Vue 3', 'Tailwind CSS', 'Shadcn UI', 'HTML5', 'CSS3', 'Responsive Design'] },
  { label: 'Backend & Data', items: ['Node.js', 'Express', 'FastAPI', 'Pydantic v2', 'REST', 'GraphQL', 'PostgreSQL', 'MongoDB', 'MySQL', 'SQL Server'] },
  { label: 'DevOps & Observability', items: ['Docker', 'Azure Container Apps', 'GitHub Actions', 'CI/CD', 'Git', 'Azure', 'Netlify', 'Structured Logging', 'Correlation-ID Tracing', 'Azure Monitor'] },
  { label: 'Testing & QA', items: ['Jest', 'Vitest', 'Pytest', 'Cypress', 'Playwright', 'Supertest', 'k6', 'TypeScript Strict Mode', 'mypy Strict Mode'] },
  { label: 'Methods & AI', items: ['Agile/Scrum', 'Code Review', 'Requirements Engineering', 'Clean Architecture', 'Event-Driven Architecture', 'STRIDE Threat Modelling', 'GDPR', 'WCAG', 'LLM Orchestration', 'Claude API', 'OpenAI GPT-4 API'] },
]

const education = [
  {
    id: 1,
    degree: "MSc Software Engineering",
    institution: 'Blekinge Institute of Technology',
    location: 'Karlskrona, Sweden',
    period: 'Sep 2024 - Sep 2026 (Expected)',
    detail: 'Thesis: AI-assisted Detection of Requirements Smells | Courses: Software Architecture, Applied AI, Software Metrics, Software Quality',
  },
  {
    id: 2,
    degree: 'B.Tech Computer Science',
    institution: 'Bell University of Technology',
    location: 'Ogun State, Nigeria',
    period: 'Sep 2018 - Aug 2022',
    detail: 'Second Class Honours | CGPA: 3.43/5.0',
  },
]

const certifications = [
  {
    label: 'Bachelor of Technology - Computer Science',
    issuer: 'Bells University of Technology, Aug 2022',
    pdf: '/Bachelor Degree.pdf',
  },
  {
    label: 'Computer Professionals (CPN) - Graduate',
    issuer: 'Computer Professionals Registration Council of Nigeria, Nov 2022',
    pdf: '/CPN Certificate.pdf',
  },
  {
    label: 'SQL Server Database Administration (SQL DBA)',
    issuer: 'Udemy, Jun 2020',
    pdf: '/SQL Certification .pdf',
  },
  {
    label: 'Microsoft Office, Windows Server, CCNA, CCNP, Java, Android Dev',
    issuer: 'New Horizons, Aug 2022',
    pdf: '/New Horizons Certificate.pdf',
  },
]

function About() {
  const { t } = useLanguage()

  return (
    <section
      name="about"
      style={{ backgroundColor: 'var(--bg-section)' }}
    >
      <div className="section-wrap">
        {/* Header */}
        <div className="mb-12">
          <p className="eyebrow">{t.about.eyebrow}</p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {t.about.heading}
          </h2>
        </div>

        <div className="flex flex-col xl:flex-row gap-10 xl:gap-14">

          {/* Left column: photo + education + certifications */}
          <div className="flex flex-col gap-8 xl:w-[300px] shrink-0">
            <div className="clay-card p-4 flex flex-col items-center gap-4">
              <img
                src={AP}
                alt="Ayomikun Festus-Olaleye"
                className="w-full max-w-[220px] rounded-2xl object-cover"
                style={{ boxShadow: 'var(--clay-shadow-sm)' }}
              />
              <div className="text-center">
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Ayomikun Festus-Olaleye
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>
                  Full-Stack Software Engineer
                </p>
              </div>
            </div>

            {/* Education */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t.about.education}
              </p>
              {education.map(({ id, degree, institution, location, period, detail }) => (
                <div key={id} className="clay-card-sm p-4 flex flex-col gap-1.5">
                  <span className="text-sm font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                    {degree}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                    {institution}
                  </span>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <ion-icon name="location-outline"></ion-icon>
                    {location}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {period}
                  </span>
                  <span className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: bio + skills + certifications */}
          <div className="flex flex-col gap-10 flex-1">

            {/* Bio */}
            <div
              className="clay-card p-6 flex flex-col gap-3 text-sm leading-7"
              style={{ color: 'var(--text-secondary)' }}
            >
              <p>{t.about.bio1}</p>
              <p>{t.about.bio2}</p>
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t.about.skills}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.map(({ label, items }) => (
                  <div key={label} className="clay-card-sm p-4 flex flex-col gap-2">
                    <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                      {label}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((item) => (
                        <span key={item} className="clay-tag">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t.about.certifications}
              </p>
              <div className="flex flex-col gap-3">
                {certifications.map(({ label, issuer, pdf }) => (
                  <a
                    key={label}
                    href={pdf}
                    target="_blank"
                    rel="noreferrer"
                    className="clay-card-sm p-4 flex items-start gap-3 group"
                    style={{ display: 'flex' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--clay-shadow-accent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--clay-shadow-sm)'
                    }}
                  >
                    <ion-icon
                      name="ribbon-outline"
                      style={{ color: 'var(--accent)', fontSize: '1.1rem', marginTop: '1px', flexShrink: 0 } as React.CSSProperties}
                    ></ion-icon>
                    <div className="flex flex-col gap-0.5 flex-1">
                      <span className="text-xs font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                        {label}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {issuer}
                      </span>
                    </div>
                    <ion-icon
                      name="open-outline"
                      style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flexShrink: 0, marginTop: '2px' } as React.CSSProperties}
                    ></ion-icon>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default About
