import { useState } from 'react'
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
      { label: 'Project Overview', url: '/projects/reqsmell/PROJECT-OVERVIEW.md' },
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
      { label: 'Project Overview', url: '/projects/mikunair/PROJECT-OVERVIEW.md' },
    ],
    title: 'MikunAir: Full-Stack Flight Booking',
    subtitle: 'Full-Stack Platform',
    description:
      'Production-grade flight booking system as two independently versioned and containerised services: a React 18/TypeScript SPA (Vite, Tailwind, Apollo Client) and a Node.js/Express/TypeScript API with GitHub Actions CI. Dual-protocol API: GraphQL for flight search with depth-limited abuse prevention, REST + Zod for bookings. PostgreSQL SELECT FOR UPDATE prevents overbooking under concurrent load. Hub-and-spoke connecting-flight engine with 45-minute/4-hour layover enforcement. GDPR-compliant identity management with PII erasure tested by integration test IT-011.',
    tags: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL', 'Docker', 'Playwright', 'Drizzle ORM'],
  },
  {
    id: 3,
    github: 'https://github.com/Mikun07/incidenttrack-frontend',
    docs: [
      { label: 'Project Overview', url: '/projects/IncidentTrack/PROJECT-OVERVIEW.md' },
    ],
    title: 'IncidentTrack: Full-Stack Incident Management Platform',
    subtitle: 'Full-Stack Platform',
    description:
      'Full-stack incident management system built as independently versioned frontend and backend repositories. The platform tracks services, incidents, lifecycle transitions, timelines, postmortems, action items, role-based access, and audit logs. Backend rules enforce incident state transitions, RBAC, validation, and accountability; the React frontend presents operational dashboards and response workflows.',
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Vitest', 'RBAC'],
  },
  {
    id: 7,
    github: 'https://github.com/Mikun07/Blog-Frontend.git',
    docs: [
      { label: 'Backend Overview', url: '/projects/BinaryBlog/PROJECT-OVERVIEW-BACKEND.md' },
      { label: 'Frontend Overview', url: '/projects/BinaryBlog/PROJECT-OVERVIEW-FRONTEND.md' },
    ],
    title: 'BinaryBlog: Full-Stack Blog Platform',
    subtitle: 'Full-Stack React + Laravel Platform',
    description:
      'Full-stack blog platform split into a React single-page frontend and a Laravel 10 REST API. Guests can browse and filter published posts, authors can draft, publish, archive, delete, and upload cover images, while admins manage users, posts, comments, and backend health. The backend uses Sanctum authentication, MySQL, Eloquent models, Form Request validation, notifications, and PHPUnit CI across PHP 8.1, 8.2, and 8.3.',
    tags: ['React', 'Laravel', 'PHP', 'MySQL', 'Sanctum', 'REST API', 'PHPUnit', 'GitHub Actions'],
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
      { label: 'Project Overview', url: '/projects/portfolio/project-overview.md' },
    ],
    title: 'Developer Portfolio',
    subtitle: 'Web Application',
    description:
      'This portfolio: Claymorphism + Minimalism design, React 18, TypeScript, Tailwind CSS, dark/light mode, 5-language i18n switcher (EN/DE/FR/NL/SV), custom toast system, useReducer contact form with EmailJS integration, Vitest unit tests, and GitHub Actions CI pipeline.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vitest', 'EmailJS', 'i18n'],
  },
]

const PROJECTS_PER_PAGE = 3

function Projects() {
  const { t } = useLanguage()
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE)
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  const firstProjectIndex = (currentPage - 1) * PROJECTS_PER_PAGE
  const visibleProjects = projects.slice(firstProjectIndex, firstProjectIndex + PROJECTS_PER_PAGE)
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages))
  }

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
          {visibleProjects.map((project) => (
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

        {totalPages > 1 && (
          <nav
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
            aria-label="Project pagination"
          >
            <p
              className="text-xs font-semibold tabular-nums"
              style={{ color: 'var(--text-secondary)' }}
            >
              {currentPage} / {totalPages}
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={!hasPreviousPage}
                className="clay-btn-outline flex h-9 w-9 items-center justify-center text-sm disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Show previous projects page"
              >
                <ion-icon name="chevron-back-outline"></ion-icon>
              </button>

              {pageNumbers.map((pageNumber) => {
                const isCurrentPage = pageNumber === currentPage

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => goToPage(pageNumber)}
                    className={`${isCurrentPage ? 'clay-btn-primary' : 'clay-btn-outline'} flex h-9 min-w-9 items-center justify-center px-3 text-xs tabular-nums`}
                    aria-label={`Show projects page ${pageNumber}`}
                    aria-current={isCurrentPage ? 'page' : undefined}
                  >
                    {pageNumber}
                  </button>
                )
              })}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={!hasNextPage}
                className="clay-btn-outline flex h-9 w-9 items-center justify-center text-sm disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Show next projects page"
              >
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </button>
            </div>
          </nav>
        )}
      </div>
    </section>
  )
}

export default Projects
