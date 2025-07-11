import { useLanguage } from '../../core/providers/LanguageProvider'

interface ExperienceItem {
  id: number
  role: string
  company: string
  location: string
  period: string
  type: string
  bullets: string[]
}

const experiences: ExperienceItem[] = [
  {
    id: 1,
    role: 'Software Engineer',
    company: 'Financial, Forensic Studies & Diagnostic Ltd (FFSD)',
    location: 'Lagos, Nigeria',
    period: 'Dec 2023 - Aug 2024',
    type: 'Full-time',
    bullets: [
      'Architected and delivered FFSD Travels end-to-end: component architecture, Redux state, typed REST API service layer, Docker, and Netlify CI/CD serving real users in production.',
      'Raised Lighthouse performance score from 62 to 91 (+47%) via lazy loading, route-based code splitting, API caching, and memoisation across a microservices-integrated React/TypeScript frontend.',
      'Reduced production API calls by 60% by introducing debounced search and request-level caching in Redux, measured via network profiling.',
      'Integrated 5+ third-party REST APIs (flights, hotels, payments) through a service-layer abstraction that fully decouples UI components from data-fetching concerns.',
      'Grew frontend test coverage from 0% to 70% by authoring Jest unit tests and Cypress end-to-end tests across all critical booking, search, and checkout flows.',
      'Engineered a reusable library of 30+ Shadcn UI / Tailwind CSS components as the single source of truth; zero design-regression QA reports in the final two sprints.',
    ],
  },
  {
    id: 2,
    role: 'Software Engineer, Frontend',
    company: 'Pedistack (Fintech)',
    location: 'Remote',
    period: 'Jan 2023 - Nov 2023',
    type: 'Full-time, Remote',
    bullets: [
      'Eliminated stale-state and race-condition defects by implementing Redux state management with structured action patterns and typed REST API integrations.',
      'Reduced reported UI layout bugs by 25% (by QA ticket volume) via consistent responsive design across desktop and mobile breakpoints.',
      'Cut code duplication across 4+ product areas by building a shared library of 20+ modular React components.',
      'Ensured GDPR compliance and WCAG accessibility across all customer-facing flows through structured code review and QA collaboration.',
      'Coached and mentored junior developers via code review and pair programming.',
    ],
  },
  {
    id: 3,
    role: 'Frontend Developer, Intern',
    company: 'PricewaterhouseCoopers (PwC)',
    location: 'Lagos, Nigeria',
    period: 'Apr 2021 - Sep 2021',
    type: 'Internship',
    bullets: [
      'Delivered enterprise Angular UI components to PwC compliance and accessibility standards, achieving QA sign-off within sprint timelines.',
      'Contributed to UI testing cycles and technical documentation within a structured SDLC.',
    ],
  },
]

function Experience() {
  const { t } = useLanguage()

  return (
    <section
      name="experience"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="section-wrap">
        {/* Header */}
        <div className="mb-12">
          <p className="eyebrow">{t.experience.eyebrow}</p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {t.experience.heading}
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative flex flex-col gap-6">
          {experiences.map(({ id, role, company, location, period, type, bullets }) => (
            <div key={id} className="relative flex gap-6">

              {/* Timeline dot + connector */}
              <div className="hidden md:flex flex-col items-center shrink-0 mt-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold z-10 clay-card-sm"
                  style={{
                    backgroundColor: 'var(--accent-dim)',
                    color: 'var(--accent)',
                  }}
                >
                  {id}
                </div>
                {id < experiences.length && (
                  <div
                    className="w-0.5 flex-1 mt-2"
                    style={{ backgroundColor: 'var(--border-card)', minHeight: '24px' }}
                  />
                )}
              </div>

              {/* Card */}
              <div className="clay-card p-6 flex-1">
                {/* Card header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                  <div className="flex flex-col gap-1">
                    <h3
                      className="text-base font-bold leading-snug"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {role}
                    </h3>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: 'var(--accent)' }}
                    >
                      {company}
                    </span>
                    <div
                      className="flex flex-wrap items-center gap-3 text-xs mt-0.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <span className="flex items-center gap-1">
                        <ion-icon name="location-outline"></ion-icon>
                        {location}
                      </span>
                      <span className="flex items-center gap-1">
                        <ion-icon name="briefcase-outline"></ion-icon>
                        {type}
                      </span>
                    </div>
                  </div>

                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap self-start clay-card-sm"
                    style={{
                      backgroundColor: 'var(--accent-dim)',
                      color: 'var(--accent)',
                    }}
                  >
                    {period}
                  </span>
                </div>

                {/* Bullets */}
                <ul className="flex flex-col gap-2.5">
                  {bullets.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: 'var(--accent)' }}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
