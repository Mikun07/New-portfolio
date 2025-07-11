import { useLanguage } from '../../core/providers/LanguageProvider'

interface Service {
  id: number
  icon: string
  title: string
  description: string
  tags: string[]
}

const services: Service[] = [
  {
    id: 1,
    icon: 'layers-outline',
    title: 'Full-Stack Engineering',
    description:
      'End-to-end web application development from React/TypeScript frontends to Node.js and FastAPI backends. Clean architecture, modular component systems, and typed API service layers built for production.',
    tags: ['React', 'TypeScript', 'Node.js', 'FastAPI'],
  },
  {
    id: 2,
    icon: 'sparkles-outline',
    title: 'AI / LLM Integration',
    description:
      'Engineered LLM orchestration pipelines using the Claude API and GPT-4 with asyncio for fault-isolated concurrent execution. Structured JSON validation via Pydantic v2 and CI-gated 80% test coverage.',
    tags: ['Claude API', 'GPT-4', 'asyncio', 'Prompt Engineering'],
  },
  {
    id: 3,
    icon: 'git-network-outline',
    title: 'API Design & State Management',
    description:
      'RESTful and GraphQL API design with Redux Toolkit and typed service layers. Request caching, debounced queries, and structured action patterns eliminate stale-state and reduce unnecessary API calls.',
    tags: ['REST APIs', 'GraphQL', 'Redux', 'Pydantic v2'],
  },
  {
    id: 4,
    icon: 'flask-outline',
    title: 'Testing & Quality Engineering',
    description:
      'Frontend and backend testing pipelines: Jest + Cypress for E2E, Pytest with mypy strict mode, Vitest unit tests, and GitHub Actions CI gates enforcing zero type errors and coverage thresholds.',
    tags: ['Pytest', 'Cypress', 'Vitest', 'CI Gates'],
  },
  {
    id: 5,
    icon: 'cube-outline',
    title: 'DevOps & Deployment',
    description:
      'Docker containerisation, GitHub Actions CI/CD pipelines, and Netlify continuous deployment. Reproducible builds, zero environment drift, and automated quality gates on every push.',
    tags: ['Docker', 'GitHub Actions', 'Netlify', 'CI/CD'],
  },
  {
    id: 6,
    icon: 'color-wand-outline',
    title: 'UI/UX Implementation',
    description:
      'Pixel-accurate, accessible, and responsive interfaces built with Tailwind CSS and Shadcn UI. Lighthouse performance optimisation, lazy loading, code splitting, and WCAG compliance.',
    tags: ['Tailwind CSS', 'Shadcn UI', 'Figma', 'WCAG'],
  },
]

function Services() {
  const { t } = useLanguage()

  return (
    <section
      name="services"
      style={{ backgroundColor: 'var(--bg-section)' }}
    >
      <div className="section-wrap">
        {/* Header */}
        <div className="mb-12">
          <p className="eyebrow">{t.services.eyebrow}</p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {t.services.heading}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(({ id, icon, title, description, tags }) => (
            <article
              key={id}
              className="clay-card p-6 flex flex-col gap-4 cursor-default"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 clay-card-sm"
                style={{
                  backgroundColor: 'var(--accent-dim)',
                  color: 'var(--accent)',
                }}
              >
                <ion-icon name={icon}></ion-icon>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2 flex-1">
                <h3
                  className="text-sm font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {description}
                </p>
              </div>

              {/* Tags */}
              <div
                className="flex flex-wrap gap-1.5 pt-3 mt-auto"
                style={{ borderTop: '1px solid var(--border-card)' }}
              >
                {tags.map((tag) => (
                  <span key={tag} className="clay-tag">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
