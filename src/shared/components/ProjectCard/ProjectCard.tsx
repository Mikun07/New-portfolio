import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useToast } from '../../../core/providers/ToastProvider'
import { downloadAsPdf } from '../../utils/downloadAsPdf'

interface CardLabels {
  readonly code: string
  readonly live: string
  readonly readMore: string
  readonly showLess: string
  readonly featured: string
  readonly docsBtn: string
}

interface DocEntry {
  readonly label: string
  readonly url: string
}

interface ProjectCardProps {
  readonly img?: string
  readonly github: string
  readonly href?: string
  readonly docs?: readonly DocEntry[]
  readonly title: string
  readonly subtitle: string
  readonly description: string
  readonly tags: readonly string[]
  readonly featured?: boolean
  readonly labels: CardLabels
}

interface DropdownPos {
  top: number
  left: number
  width: number
  openUp: boolean
}

function DocsDropdown({
  docs,
  triggerRef,
  onClose,
  onDownload,
}: {
  docs: readonly DocEntry[]
  triggerRef: React.RefObject<HTMLButtonElement | null>
  onClose: () => void
  onDownload: (doc: DocEntry) => void
}) {
  const [pos, setPos] = useState<DropdownPos | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const maxMenuHeight = 260
    const openUp = spaceBelow < maxMenuHeight && spaceAbove > spaceBelow
    setPos({
      top: openUp
        ? rect.top + window.scrollY - Math.min(maxMenuHeight, spaceAbove - 16) - 8
        : rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: Math.max(rect.width, 220),
      openUp,
    })
  }, [docs.length, triggerRef])

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    function onScroll(e: Event) {
      if (menuRef.current?.contains(e.target as Node)) return
      onClose()
    }
    document.addEventListener('mousedown', onMouseDown)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [onClose, triggerRef])

  if (!pos) return null

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        minWidth: pos.width,
        zIndex: 9999,
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: 'var(--clay-shadow)',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
      }}
    >
      <div style={{ maxHeight: '260px', overflowY: 'auto', overflowX: 'hidden' }}>
        {(docs ?? []).map((doc) => (
          <button
            key={doc.url}
            type="button"
            onClick={() => { onDownload(doc); onClose() }}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors duration-150 w-full text-left"
            style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-dim)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
          >
            <ion-icon name="download-outline" style={{ flexShrink: '0' }}></ion-icon>
            {doc.label}
          </button>
        ))}
      </div>
    </div>,
    document.body
  )
}

function ProjectCard({ img, github, href, docs, title, subtitle, description, tags, featured, labels }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [docsOpen, setDocsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { showToast } = useToast()
  const needsToggle = description.length > 200
  const hasDocs = docs && docs.length > 0
  const closeDropdown = useCallback(() => setDocsOpen(false), [])

  const handleDownload = useCallback(async (doc: DocEntry) => {
    if (doc.url.endsWith('.md')) {
      showToast(`Preparing "${doc.label}" as PDF…`, 'info')
      try {
        await downloadAsPdf(doc.url, doc.label)
        showToast(`"${doc.label}" downloaded!`, 'success')
      } catch {
        showToast(`Failed to download "${doc.label}". Try again.`, 'error')
      }
    } else {
      const a = document.createElement('a')
      a.href = doc.url
      a.download = doc.label
      a.click()
      showToast(`"${doc.label}" downloaded!`, 'success')
    }
  }, [showToast])

  return (
    <article className="clay-card flex flex-col overflow-hidden group">

      {/* Thumbnail / placeholder */}
      <div className="relative overflow-hidden h-36 shrink-0" style={{ borderRadius: 'var(--clay-radius) var(--clay-radius) 0 0' }}>
        {img ? (
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl font-bold select-none"
            style={{
              background: 'linear-gradient(135deg, var(--accent-dim) 0%, var(--bg-card) 100%)',
              color: 'var(--accent)',
            }}
          >
            {title.charAt(0)}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/65 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white border border-white/30 hover:border-white transition-colors duration-200"
          >
            <ion-icon name="logo-github"></ion-icon>
            {labels.code}
          </a>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white border border-white/30 hover:border-white transition-colors duration-200"
            >
              <ion-icon name="open-outline"></ion-icon>
              {labels.live}
            </a>
          )}
        </div>

        {/* Featured badge */}
        {featured && (
          <span
            className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#fff',
              boxShadow: 'var(--clay-shadow-sm)',
            }}
          >
            {labels.featured}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            {subtitle}
          </span>
          <h3 className="text-sm font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <p
            className="text-xs leading-relaxed"
            style={{
              color: 'var(--text-secondary)',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: needsToggle && !expanded ? 4 : 'unset',
              overflow: needsToggle && !expanded ? 'hidden' : 'visible',
            }}
          >
            {description}
          </p>
          {needsToggle && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="self-start text-xs font-semibold mt-0.5"
              style={{ color: 'var(--accent)' }}
            >
              {expanded ? labels.showLess : labels.readMore}
            </button>
          )}
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

        {/* Action row */}
        <div className="flex flex-wrap gap-2 pt-1 items-center">
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="clay-btn-outline flex items-center gap-1.5 px-3 py-1.5 text-xs"
          >
            <ion-icon name="logo-github"></ion-icon>
            {labels.code}
          </a>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="clay-btn-outline flex items-center gap-1.5 px-3 py-1.5 text-xs"
            >
              <ion-icon name="open-outline"></ion-icon>
              {labels.live}
            </a>
          )}

          {hasDocs && (
            <>
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setDocsOpen((v) => !v)}
                className="clay-btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs"
                aria-haspopup="true"
                aria-expanded={docsOpen}
              >
                <ion-icon name="document-text-outline"></ion-icon>
                {labels.docsBtn}
                <ion-icon
                  name={docsOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                  style={{ fontSize: '11px', marginLeft: '2px' }}
                ></ion-icon>
              </button>

              {docsOpen && (
                <DocsDropdown
                  docs={docs}
                  triggerRef={triggerRef}
                  onClose={closeDropdown}
                  onDownload={handleDownload}
                />
              )}
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProjectCard
