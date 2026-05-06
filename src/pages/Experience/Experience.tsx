import { useLanguage } from '../../context/LanguageContext'

interface ExperienceItem {
  id: number
  role: string
  company: string
  location: string
  period: string
  type: string
  bullets: string[]
}

// Matches Professional Experience section of CV exactly
const experiences: ExperienceItem[] = [
  {
    id: 1,
    role: 'Web Developer (Frontend-Focused)',
    company: 'Financial, Forensic Studies & Diagnostic LTD (FFSD)',
    location: 'Lagos, Nigeria',
    period: 'Dec 2023 – Aug 2024',
    type: 'Full-time',
    bullets: [
      'Designed and implemented scalable frontend architecture using React, TypeScript, and modular component-based development practices.',
      'Developed responsive and dynamic user interfaces integrated with REST APIs to support real-time booking workflows and interactive system features.',
      'Implemented Redux-based global state management for user sessions, booking processes, and complex application state consistency.',
      'Built reusable UI component systems with Shadcn UI and Tailwind CSS to improve maintainability, design consistency, and development efficiency.',
      'Applied performance optimisation techniques including lazy loading, code splitting, and efficient state handling to improve application responsiveness.',
      'Used Docker-based development environments and Git workflows to improve development consistency and team collaboration.',
      'Leveraged AI tools including GPT-4 and Claude to support problem-solving, debugging, and development productivity.',
      'Applied frontend testing and validation practices to improve UI reliability, maintainability, and user experience quality.',
    ],
  },
  {
    id: 2,
    role: 'Frontend Engineer (Junior Software Engineer)',
    company: 'Pedistack',
    location: 'Remote',
    period: 'Jan 2023 – Nov 2023',
    type: 'Full-time · Remote',
    bullets: [
      'Developed reusable and modular UI components using React and JavaScript for responsive web applications.',
      'Integrated REST APIs and implemented Redux state management to support interactive and data-driven user experiences.',
      'Improved application responsiveness and UI consistency across desktop and mobile devices.',
      'Collaborated within agile software development teams during sprint planning, iterative development, and feature delivery cycles.',
      'Participated in debugging, testing workflows, and frontend quality improvement activities.',
      'Utilised Git-based workflows and collaborative development practices within remote engineering teams.',
    ],
  },
  {
    id: 3,
    role: 'Frontend Developer (Intern)',
    company: 'PricewaterhouseCoopers (PwC)',
    location: 'Lagos, Nigeria',
    period: 'Apr 2021 – Sep 2021',
    type: 'Internship',
    bullets: [
      'Developed responsive enterprise UI components using Angular for internal business applications.',
      'Collaborated with product and QA teams to align frontend development with business and testing requirements.',
      'Assisted with testing cycles, UI improvements, technical documentation, and frontend maintenance workflows.',
    ],
  },
]

function Experience() {
  const { t } = useLanguage()

  return (
    <section
      name="experience"
      className="min-h-screen flex flex-col justify-center px-6 lg:px-10 py-24"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* ── Section header ── */}
      <div className="mb-10">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: 'var(--accent)' }}
        >
          {t.experience.eyebrow}
        </p>
        <h2
          className="text-3xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          {t.experience.heading}
        </h2>
      </div>

      {/* ── Timeline ── */}
      <div className="relative flex flex-col gap-0">
        {/* Vertical line — hidden on mobile, shown from md up */}
        <div
          className="hidden md:block absolute left-[7px] top-2 bottom-2 w-px"
          style={{ backgroundColor: 'var(--border)' }}
        />

        {experiences.map(({ id, role, company, location, period, type, bullets }) => (
          <div key={id} className="relative flex gap-6 pb-10 last:pb-0">

            {/* Timeline dot */}
            <div className="hidden md:flex flex-col items-center shrink-0">
              <div
                className="w-4 h-4 rounded-full border-2 mt-1 shrink-0 z-10"
                style={{
                  borderColor: 'var(--accent)',
                  backgroundColor: 'var(--bg)',
                }}
              />
            </div>

            {/* Card */}
            <div
              className="flex-1 rounded-xl border p-6 transition-colors duration-200"
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
              {/* Card header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                <div className="flex flex-col gap-1">
                  <h3
                    className="text-sm font-bold leading-snug"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {role}
                  </h3>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: 'var(--accent)' }}
                  >
                    {company}
                  </span>
                  <div
                    className="flex items-center gap-3 text-xs"
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

                {/* Period badge */}
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap self-start"
                  style={{
                    backgroundColor: 'var(--accent-dim)',
                    color: 'var(--accent)',
                  }}
                >
                  {period}
                </span>
              </div>

              {/* Bullet points */}
              <ul className="flex flex-col gap-2">
                {bullets.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {/* Orange dash accent instead of default bullet */}
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
    </section>
  )
}

export default Experience
