import { useLanguage } from '../../context/LanguageContext'

interface Service {
  id: number
  icon: string
  title: string
  description: string
  tags: string[]
}

// Derived from CV skills and professional experience — what I actually do
const services: Service[] = [
  {
    id: 1,
    icon: 'layers-outline',
    title: 'Frontend Engineering',
    description:
      'Scalable, production-ready web applications built with React and TypeScript. Focus on modular component architecture, performance optimisation, code splitting, and maintainable, reusable systems.',
    tags: ['React', 'TypeScript', 'Redux', 'Shadcn UI'],
  },
  {
    id: 2,
    icon: 'git-network-outline',
    title: 'API Integration & State Management',
    description:
      'REST API integration and Redux-based global state management for complex, data-driven applications. Reliable, consistent application state across user sessions, booking flows, and interactive workflows.',
    tags: ['REST APIs', 'Redux', 'Node.js', 'MongoDB'],
  },
  {
    id: 3,
    icon: 'color-wand-outline',
    title: 'UI/UX Implementation',
    description:
      'Responsive, accessible interfaces built with Tailwind CSS and Shadcn UI. Pixel-accurate implementation of Figma designs into high-quality, cross-device user experiences with smooth interactions.',
    tags: ['Tailwind CSS', 'Figma', 'HTML5', 'CSS3'],
  },
  {
    id: 4,
    icon: 'flask-outline',
    title: 'Testing & Quality Engineering',
    description:
      'Frontend testing strategies using Jest for unit tests and Cypress for end-to-end testing. Debugging, refactoring, and code reviews to support maintainable and reliable software delivery.',
    tags: ['Jest', 'Cypress', 'E2E Testing', 'CI/CD'],
  },
  {
    id: 5,
    icon: 'sparkles-outline',
    title: 'AI-Assisted Development',
    description:
      'Applied AI workflows using LLMs (GPT-4, Claude) for productivity, debugging, and prompt engineering. Leveraging AI tools to improve problem-solving, technical research, and development processes.',
    tags: ['GPT-4', 'Claude', 'Prompt Engineering', 'NLP'],
  },
  {
    id: 6,
    icon: 'cube-outline',
    title: 'Dev Tooling & Deployment',
    description:
      'Docker-based development environments, Git workflows, and Netlify deployments to support efficient, consistent, and maintainable software delivery across teams and projects.',
    tags: ['Docker', 'Git', 'Netlify', 'Agile / Scrum'],
  },
]

function Services() {
  const { t } = useLanguage()

  return (
    <section
      name="services"
      className="min-h-screen flex flex-col justify-center px-6 lg:px-10 py-24"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* ── Section header ── */}
      <div className="mb-10">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: 'var(--accent)' }}
        >
          {t.services.eyebrow}
        </p>
        <h2
          className="text-3xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          {t.services.heading}
        </h2>
      </div>

      {/* ── 2-col grid on md+, single col on mobile ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map(({ id, icon, title, description, tags }) => (
          <article
            key={id}
            className="flex flex-col gap-4 p-6 rounded-xl border transition-colors duration-200 cursor-default"
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
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
              style={{
                backgroundColor: 'var(--accent-dim)',
                color: 'var(--accent)',
              }}
            >
              <ion-icon name={icon}></ion-icon>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-2">
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
            <div className="flex flex-wrap gap-2 mt-auto pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full border font-medium"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-muted)',
                    backgroundColor: 'transparent',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Services
