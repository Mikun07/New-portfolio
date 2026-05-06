import ProjectCard from '../../components/Card/ProjectCard'
import { useLanguage } from '../../context/LanguageContext'

interface Project {
  id: number
  img?: string
  github: string
  href?: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  featured?: boolean
}

const projects: Project[] = [
  {
    id: 1,
    github: 'https://github.com/Mikun07/ffsd-travels',
    href: 'https://festus-olaleye-ayomikun.netlify.app',
    title: 'FFSD Travels: Travel Booking Platform',
    subtitle: 'Featured Project',
    description:
      'Responsive travel booking platform built with React, TypeScript, Redux, and REST APIs. Features dynamic search, filtering, and API-driven booking workflows. Implements reusable component systems with Shadcn UI and Tailwind CSS, with performance optimisation via lazy loading and modular state management.',
    tags: ['React', 'TypeScript', 'Redux', 'REST APIs', 'Shadcn UI', 'Tailwind CSS', 'Docker'],
    featured: true,
  },
  {
    id: 2,
    github: 'https://github.com/Mikun07/Product_Search.git',
    href: 'https://productseacrh.netlify.app',
    title: 'MikunStore: E-Commerce Platform',
    subtitle: 'Web Application',
    description:
      'Full-featured e-commerce app built with React 18 and Vite. Browse 100 products across 9 categories with search, filtering, sorting, and pagination. Features cart management, favourites, side-by-side product comparison, multi-currency pricing, 5-language i18n, dark/light mode, and a jsPDF-generated receipt on checkout. End-to-end tested with Cypress.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'React Router', 'Context API', 'jsPDF', 'Cypress'],
  },
  {
    id: 3,
    github: 'https://github.com/Mikun07/Movie-Recommendation-Website.git',
    href: 'https://mikun-films.netlify.app',
    title: 'Movie Recommendation Platform',
    subtitle: 'Web Application',
    description:
      'Movie recommendation system by genre built with React. Implements Redux for state management, local storage for data persistence, and Tailwind CSS for responsive styling.',
    tags: ['React', 'Redux', 'Tailwind CSS', 'JavaScript'],
  },
  {
    id: 4,
    github: 'https://github.com/Mikun07/hotel-booking-dashboard.git',
    href: 'https://mimabooking.netlify.app',
    title: 'Hotel Booking Dashboard',
    subtitle: 'Web Application',
    description:
      'Hotel booking dashboard interface with interactive UI components built with React and Tailwind CSS. Focuses on intuitive UX and responsive layout across all devices.',
    tags: ['React', 'Tailwind CSS', 'JavaScript'],
  },
  {
    id: 5,
    github: 'https://github.com/Mikun07/Blog-Frontend.git',
    href: 'https://binary-blog.netlify.app/',
    title: 'Binary Blog',
    subtitle: 'Full-Stack Application',
    description:
      'Modern responsive blog platform with a React and Tailwind CSS frontend integrated with a PHP Laravel backend REST API for content management and user authentication.',
    tags: ['React', 'Tailwind CSS', 'PHP', 'Laravel', 'REST API'],
  },
  {
    id: 6,
    github: 'https://github.com/Mikun07/New-portfolio.git',
    title: 'Developer Portfolio',
    subtitle: 'Web Application',
    description:
      'Modern, fully responsive personal portfolio built with React 18, TypeScript, and Tailwind CSS. Features dark/light mode, a global language switcher (EN / DE / FR / NL / SV), a custom toast notification system, useReducer-driven contact form with EmailJS integration, and Vitest unit tests.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vitest', 'EmailJS', 'i18n'],
  },
]

function Projects() {
  const { t } = useLanguage()

  return (
    <section
      name="project"
      className="flex flex-col px-6 lg:px-10 py-24"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* ── Section header ── */}
      <div className="mb-10">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: 'var(--accent)' }}
        >
          {t.projects.eyebrow}
        </p>
        <h2
          className="text-3xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          {t.projects.heading}
        </h2>
      </div>

      {/* ── All 6 projects in a 3-col grid — no pagination needed ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
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
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default Projects
