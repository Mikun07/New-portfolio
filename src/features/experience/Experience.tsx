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
    role: 'Software Engineer, MSc Thesis Research (ReqSmell)',
    company: 'Blekinge Institute of Technology | AI Requirements Analysis Tool',
    location: 'Karlskrona, Sweden',
    period: 'Jan 2026 - Present',
    type: 'Research project',
    bullets: [
      'Achieved zero cross-pipeline contamination across 4 concurrent LLM analysis pipelines (Claude API and GPT-4), verified in thesis evaluation through fault-isolated asyncio orchestration in FastAPI.',
      'Kept zero type errors reaching main by gating every pull request behind 80% Pytest coverage, mypy strict mode, Ruff linting, and GitHub Actions CI/CD.',
      'Deployed the research tool as two independently released services: a React 18 and TypeScript SPA plus a FastAPI backend.',
    ],
  },
  {
    id: 2,
    role: 'Software Engineer',
    company: 'FFSD Group (Financial, Forensic Studies & Diagnostic Ltd)',
    location: 'Lagos, Nigeria',
    period: 'Dec 2023 - Aug 2024',
    type: 'Full-time',
    bullets: [
      'Owned the frontend of DQV, FFSD\'s document qualification and verification platform, covering architecture, UI/UX design, custom component library work, testing, documentation, and production deployment with React, TypeScript, and Redux.',
      'Raised the live deployment Lighthouse score from 62 to 91 through lazy loading, route-based code splitting, and client-side response caching delivered in two-week Agile sprints.',
      'Reduced production API calls by 60%, verified through network profiling, by introducing debounced search and request-level response caching in the Redux state layer.',
      'Grew test coverage from 0% to 70% with Jest and Cypress tests across document upload, verification, and search workflows.',
      'Swapped backend providers with zero UI changes by decoupling the interface from 5+ third-party REST integrations behind a typed service layer.',
      'Delivered zero design-regression QA tickets in the final two Scrum sprints after building a reusable 30+ component library with GDPR and WCAG-aware review practices.',
    ],
  },
  {
    id: 3,
    role: 'Software Engineer (Fixed-Term Contract)',
    company: 'Pedistack, fintech startup',
    location: 'Remote',
    period: 'Jan 2023 - Nov 2023',
    type: 'Fixed-term contract',
    bullets: [
      'Eliminated recurring stale-state and race-condition defects by introducing structured Redux action patterns and typed REST API integrations.',
      'Reduced reported UI layout bugs by 25%, measured by QA ticket volume, by enforcing responsive design standards across desktop and mobile breakpoints.',
      'Built the team\'s shared library of 20+ React components as a single source of UI logic across 4+ product areas, reducing duplication for the Agile team.',
    ],
  },
  {
    id: 4,
    role: 'Independent Software Engineer',
    company: 'Self-Directed Engineering Projects',
    location: 'Remote',
    period: 'Oct 2021 - Dec 2022',
    type: 'Project-based',
    bullets: [
      'Shipped MikunStore, a React 18 and Vite e-commerce app with the full purchase funnel covered end-to-end in Cypress, from browsing through checkout to client-side PDF receipts.',
      'Built CineVault, a Redux Toolkit movie discovery app with zero TypeScript strict-mode violations across all TMDB API response shapes through a fully typed data layer.',
    ],
  },
  {
    id: 5,
    role: 'Software Engineer Intern',
    company: 'PricewaterhouseCoopers (PwC)',
    location: 'Lagos, Nigeria',
    period: 'Apr 2021 - Sep 2021',
    type: 'Internship',
    bullets: [
      'Shipped enterprise Angular UI components to PwC compliance and accessibility standards, with QA sign-off inside every sprint.',
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
