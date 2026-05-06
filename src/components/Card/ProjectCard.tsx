import { useState } from 'react'

interface CardLabels {
  code: string
  live: string
  readMore: string
  showLess: string
  featured: string
}

interface ProjectCardProps {
  img?: string
  github: string
  href: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  featured?: boolean
  labels: CardLabels
}

function ProjectCard({ img, github, href, title, subtitle, description, tags, featured, labels }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article
      className="flex flex-col rounded-xl border overflow-hidden transition-colors duration-200 group"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--bg-card)',
        height: '100%',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* ── Thumbnail / placeholder ── */}
      <div className="relative overflow-hidden h-32 shrink-0">
        {img ? (
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-3xl font-bold tracking-tight select-none"
            style={{
              background: 'linear-gradient(135deg, var(--accent-dim) 0%, var(--bg-card) 100%)',
              color: 'var(--accent)',
            }}
          >
            {title.charAt(0)}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white border border-white/30 hover:border-white transition-colors duration-200"
          >
            <ion-icon name="logo-github"></ion-icon>
            {labels.code}
          </a>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white border border-white/30 hover:border-white transition-colors duration-200"
          >
            <ion-icon name="open-outline"></ion-icon>
            {labels.live}
          </a>
        </div>

        {/* Featured badge */}
        {featured && (
          <span
            className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
          >
            {labels.featured}
          </span>
        )}
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex flex-col gap-0.5">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            {subtitle}
          </span>
          <h3
            className="text-sm font-bold leading-snug"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h3>
        </div>

        {/* Description — clamped to 4 lines with toggle */}
        <div className="flex flex-col gap-1">
          <p
            className="text-xs leading-relaxed"
            style={{
              color: 'var(--text-secondary)',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: expanded ? 'unset' : 4,
              overflow: expanded ? 'visible' : 'hidden',
            }}
          >
            {description}
          </p>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="self-start text-xs font-semibold mt-0.5 transition-opacity duration-200"
            style={{ color: 'var(--accent)' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {expanded ? labels.showLess : labels.readMore}
          </button>
        </div>

        {/* Tech tags — pinned to bottom */}
        <div className="flex flex-wrap gap-1.5 pt-2 mt-auto" style={{ borderTop: '1px solid var(--border)' }}>
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full border font-medium"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default ProjectCard
