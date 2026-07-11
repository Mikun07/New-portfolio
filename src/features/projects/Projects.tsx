import ProjectCard from '../../shared/components/ProjectCard/ProjectCard'
import { useLanguage } from '../../core/providers/LanguageProvider'

interface DocEntry {
  readonly label: string
  readonly url: string
}

interface Project {
  readonly id: number
  readonly img?: string
  readonly github: string
  readonly href?: string
  readonly docs?: readonly DocEntry[]
  readonly title: string
  readonly subtitle: string
  readonly description: string
  readonly tags: readonly string[]
  readonly featured?: boolean
}

// To add docs for a project: drop the PDF into public/projects/<folder>/
// then add { label: 'Your Label', url: '/projects/<folder>/filename.pdf' } below.

const projects: Project[] = [
  {
    id: 1,
    github: 'https://github.com/Mikun07/reqsmell',
    href: 'https://reqsmell.netlify.app',
    docs: [
      // { label: 'Thesis Report', url: '/projects/reqsmell/thesis-report.pdf' },
      // { label: 'API Specification', url: '/projects/reqsmell/api-spec.pdf' },
    ],
    title: 'ReqSmell: AI Requirements Analysis Tool',
    subtitle: 'MSc Thesis Project',
    description:
      'Full-stack AI research tool built as two independently deployed services: a React/TypeScript SPA and a Python/FastAPI backend. Engineered 4 concurrent async LLM pipelines (Claude API + GPT-4) with asyncio fault isolation and Pydantic v2 structured validation. GitHub Actions CI enforces 80% Pytest coverage, mypy strict mode, and TypeScript strict mode on every pull request. Client-side PDF reports generated entirely in-browser.',
    tags: ['React', 'TypeScript', 'Python', 'FastAPI', 'Claude API', 'GPT-4', 'Pytest', 'GitHub Actions'],
    featured: true,
  },
  {
    id: 2,
    github: 'https://github.com/Mikun07/mikunair',
    href: 'https://mikunair.netlify.app',
    docs: [
      { label: 'Frontend - Requirements', url: '/projects/mikunair/Frontend/requirements/REQ-001-requirements-engineering.md' },
      { label: 'Frontend - Architecture', url: '/projects/mikunair/Frontend/architecture/ARCH-001-software-architecture.md' },
      { label: 'Frontend - Design', url: '/projects/mikunair/Frontend/design/DESIGN-001-software-design.md' },
      { label: 'Frontend - Testing Strategy', url: '/projects/mikunair/Frontend/quality/QUALITY-001-testing-strategy.md' },
      { label: 'Frontend - Deployment', url: '/projects/mikunair/Frontend/devops/DEVOPS-001-deployment-strategy.md' },
      { label: 'Frontend - Changelog', url: '/projects/mikunair/Frontend/changelog/CHANGELOG.md' },
      { label: 'Backend - Architecture', url: '/projects/mikunair/Backend/architecture/ARCH-001-backend-architecture.md' },
      { label: 'Backend - Design', url: '/projects/mikunair/Backend/design/DESIGN-001-backend-design.md' },
      { label: 'Backend - Testing Strategy', url: '/projects/mikunair/Backend/quality/QUALITY-001-backend-testing-strategy.md' },
      { label: 'Backend - Deployment', url: '/projects/mikunair/Backend/devops/DEVOPS-001-backend-deployment.md' },
      { label: 'Backend - Changelog', url: '/projects/mikunair/Backend/changelog/CHANGELOG.md' },
    ],
    title: 'MikunAir: Full-Stack Flight Booking',
    subtitle: 'Portfolio Project',
    description:
      'Production-grade flight booking system as two independently versioned and containerised services: a React 18/TypeScript SPA (Vite, Tailwind, Apollo Client) and a Node.js/Express/TypeScript API with GitHub Actions CI. Dual-protocol API: GraphQL for flight search with depth-limited abuse prevention, REST + Zod for bookings. PostgreSQL SELECT FOR UPDATE prevents overbooking under concurrent load. Hub-and-spoke connecting-flight engine with 45-minute/4-hour layover enforcement. GDPR-compliant identity management with PII erasure tested by integration test IT-011.',
    tags: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL', 'Docker', 'Playwright', 'Drizzle ORM'],
    featured: true,
  },
  {
    id: 4,
    github: 'https://github.com/Mikun07/Product_Search.git',
    href: 'https://productseacrh.netlify.app',
    docs: [
      // { label: 'Project Report', url: '/projects/mikunstore/report.pdf' },
    ],
    title: 'MikunStore: E-Commerce Platform',
    subtitle: 'Web Application',
    description:
      'Full-featured e-commerce app with 100 products across 9 categories: search, filtering, sorting, pagination, cart, favourites, side-by-side comparison, multi-currency pricing, 5-language i18n, dark/light mode, and jsPDF-generated receipts. End-to-end tested with Cypress.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Context API', 'jsPDF', 'Cypress', 'i18n'],
  },
  {
    id: 5,
    github: 'https://github.com/Mikun07/Movie-Recommendation-Website.git',
    href: 'https://mikun-films.netlify.app',
    docs: [
      // { label: 'Project Report', url: '/projects/cinevault/report.pdf' },
    ],
    title: 'CineVault: Movie Discovery Platform',
    subtitle: 'Web Application',
    description:
      'Type-safe movie discovery app powered by the TMDB API. Multi-select genre filtering, rotating hero carousel, dark/light mode, and a 5-language switcher. TypeScript strict mode enforced across all API shapes. State managed with Redux Toolkit; API layer via Axios with automatic auth headers.',
    tags: ['React', 'TypeScript', 'Redux Toolkit', 'Axios', 'Tailwind CSS', 'TMDB API'],
  },
  {
    id: 6,
    github: 'https://github.com/Mikun07/New-portfolio.git',
    href: 'https://festus-olaleye-ayomikun.netlify.app',
    docs: [
      { label: 'Project Overview', url: '/projects/portfolio/portfolio/project-overview.md' },
      { label: 'ADR-001 - Scroll SPA', url: '/projects/portfolio/architecture/ADR-001-scroll-spa.md' },
      { label: 'Architecture Report', url: '/projects/portfolio/architecture/architecture-report.md' },
      { label: 'ADR-002 - CSS Variables', url: '/projects/portfolio/architecture/ADR-002-css-variables-theming.md' },
      { label: 'ADR-003 - Context API', url: '/projects/portfolio/architecture/ADR-003-context-api-state.md' },
      { label: 'ADR-004 - useReducer Form', url: '/projects/portfolio/architecture/ADR-004-usereducer-form.md' },
      { label: 'ADR-005 - Type-safe i18n', url: '/projects/portfolio/architecture/ADR-005-type-safe-i18n.md' },
      { label: 'ADR-006 - Folder Structure', url: '/projects/portfolio/architecture/ADR-006-layered-folder-structure.md' },
      { label: 'Framework Compliance Audit', url: '/projects/portfolio/governance/framework-compliance-audit.md' },
      { label: 'Module Catalog', url: '/projects/portfolio/design/module-catalog.md' },
      { label: 'Interface Specifications', url: '/projects/portfolio/design/interface-specs.md' },
      { label: 'Design Decision - Email Service', url: '/projects/portfolio/design/DDR-001-emailservice-extraction.md' },
      { label: 'Frontend Engineering Report', url: '/projects/portfolio/frontend/frontend-engineering-report.md' },
      { label: 'Implementation Plan', url: '/projects/portfolio/implementation/implementation-plan.md' },
      { label: 'Requirements (FR-001-020)', url: '/projects/portfolio/requirements/FR-001-FR-020.md' },
      { label: 'Requirements Engineering Report', url: '/projects/portfolio/requirements/requirements-engineering-report.md' },
      { label: 'Non-Functional Requirements', url: '/projects/portfolio/requirements/NFR-001-NFR-010.md' },
      { label: 'User Stories', url: '/projects/portfolio/requirements/user-stories.md' },
      { label: 'Acceptance Criteria', url: '/projects/portfolio/requirements/acceptance-criteria.md' },
      { label: 'Traceability Matrix', url: '/projects/portfolio/requirements/traceability-matrix.md' },
      { label: 'Risk Assessment', url: '/projects/portfolio/risk/risk-assessment.md' },
      { label: 'Security Engineering Report', url: '/projects/portfolio/security/security-engineering.md' },
      { label: 'Test Strategy', url: '/projects/portfolio/quality/test-strategy.md' },
      { label: 'Quality Gates', url: '/projects/portfolio/quality/quality-gates.md' },
      { label: 'Metrics Plan', url: '/projects/portfolio/quality/metrics-plan.md' },
      { label: 'CI/CD Design', url: '/projects/portfolio/devops/ci-cd-design.md' },
      { label: 'Deployment Notes', url: '/projects/portfolio/devops/deployment-notes.md' },
      { label: 'Operational Readiness', url: '/projects/portfolio/devops/operational-readiness.md' },
      { label: 'GitHub Readiness', url: '/projects/portfolio/github/repository-readiness.md' },
      { label: 'Interview Preparation', url: '/projects/portfolio/portfolio/interview-preparation.md' },
      { label: 'Release Notes v1.0.0', url: '/projects/portfolio/releases/release-notes-v1.0.0.md' },
    ],
    title: 'Developer Portfolio',
    subtitle: 'Web Application',
    description:
      'This portfolio: Claymorphism + Minimalism design, React 18, TypeScript, Tailwind CSS, dark/light mode, 5-language i18n switcher (EN/DE/FR/NL/SV), custom toast system, useReducer contact form with EmailJS integration, Vitest unit tests, and GitHub Actions CI pipeline.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vitest', 'EmailJS', 'i18n'],
  },
]

function Projects() {
  const { t } = useLanguage()

  return (
    <section
      name="project"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="section-wrap">
        <div className="mb-12">
          <p className="eyebrow">{t.projects.eyebrow}</p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {t.projects.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              labels={{
                code: t.projects.code,
                live: t.projects.live,
                readMore: t.projects.readMore,
                showLess: t.projects.showLess,
                featured: t.projects.featured,
                docsBtn: t.projects.docsBtn,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
