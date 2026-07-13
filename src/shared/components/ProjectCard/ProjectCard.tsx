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
  maxHeight: number
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
    const viewportPadding = 16
    const preferredMaxHeight = 280
    const estimatedHeight = Math.min(preferredMaxHeight, Math.max(docs.length * 40, 120))
    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding
    const spaceAbove = rect.top - viewportPadding
    const openUp = spaceBelow < estimatedHeight && spaceAbove > spaceBelow
    const availableHeight = Math.max(openUp ? spaceAbove : spaceBelow, 120)
    const maxHeight = Math.min(estimatedHeight, availableHeight)
    const viewportWidth = window.innerWidth
    const width = Math.min(
      Math.max(rect.width, 240),
      viewportWidth - viewportPadding * 2
    )
    const left = Math.min(
      Math.max(rect.left + window.scrollX, window.scrollX + viewportPadding),
      window.scrollX + viewportWidth - width - viewportPadding
    )

    setPos({
      top: openUp
        ? rect.top + window.scrollY - maxHeight - 8
        : rect.bottom + window.scrollY + 8,
      left,
      width,
      maxHeight,
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
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onClose)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onClose)
    }
  }, [onClose, triggerRef])

  if (!pos) return null

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-label="Project documents"
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        width: pos.width,
        zIndex: 9999,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: 'var(--clay-shadow)',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
      }}
    >
      <div style={{ maxHeight: pos.maxHeight, overflowY: 'auto', overflowX: 'hidden' }}>
        {(docs ?? []).map((doc) => (
          <button
            key={doc.url}
            type="button"
            role="menuitem"
            onClick={() => { onDownload(doc); onClose() }}
            className="flex w-full items-start gap-2 px-4 py-2.5 text-left text-xs font-medium leading-snug transition-colors duration-150"
            style={{
              color: 'var(--text-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'normal',
              overflowWrap: 'anywhere',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-dim)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
          >
            <ion-icon name="download-outline" style={{ flexShrink: '0', marginTop: '1px' }}></ion-icon>
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
  const visibleTags = tags.slice(0, 5)
  const hiddenTagCount = tags.length - visibleTags.length
  const docEntries = docs ?? []
  const docCount = docEntries.length
  const hasDocs = docCount > 0
  const singleDoc = docCount === 1 ? docEntries[0] : undefined
  const closeDropdown = useCallback(() => setDocsOpen(false), [])

  const handleDownload = useCallback(async (doc: DocEntry) => {
    if (doc.url.endsWith('.md')) {
      showToast(`Preparing "${doc.label}" as PDF...`, 'info')
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
    <article className="clay-card group flex h-full flex-col overflow-hidden">

      {/* Thumbnail / placeholder */}
      <div className="relative h-28 shrink-0 overflow-hidden sm:h-32" style={{ borderRadius: 'var(--clay-radius) var(--clay-radius) 0 0' }}>
        {img ? (
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full select-none items-center justify-center text-3xl font-bold"
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
            className="flex h-7 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-white/30 px-2.5 text-[0.7rem] font-semibold text-white transition-colors duration-200 hover:border-white"
          >
            <ion-icon name="logo-github"></ion-icon>
            {labels.code}
          </a>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex h-7 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-white/30 px-2.5 text-[0.7rem] font-semibold text-white transition-colors duration-200 hover:border-white"
            >
              <ion-icon name="open-outline"></ion-icon>
              {labels.live}
            </a>
          )}
        </div>

        {/* Featured badge */}
        {featured && (
          <span
            className="absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[0.65rem] font-bold"
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
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex flex-col gap-0.5">
          <span className="line-clamp-1 text-[0.68rem] font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            {subtitle}
          </span>
          <h3 className="line-clamp-2 text-[0.82rem] font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <p
            className={`text-[0.72rem] leading-relaxed ${needsToggle && !expanded ? 'line-clamp-3' : ''}`}
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            {description}
          </p>
          {needsToggle && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-0.5 self-start text-[0.7rem] font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              {expanded ? labels.showLess : labels.readMore}
            </button>
          )}
        </div>

        {/* Tags */}
        <div
          className="mt-auto flex flex-wrap gap-1 pt-2"
          style={{ borderTop: '1px solid var(--border-card)' }}
        >
          {visibleTags.map((tag) => (
            <span key={tag} className="clay-tag">{tag}</span>
          ))}
          {hiddenTagCount > 0 && (
            <span className="clay-tag">+{hiddenTagCount}</span>
          )}
        </div>

        {/* Action row */}
        <div className="flex min-h-[30px] flex-wrap items-center gap-1.5 pt-0.5">
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="clay-btn-outline flex h-7 items-center justify-center gap-1.5 whitespace-nowrap px-2.5 text-[0.7rem]"
          >
            <ion-icon name="logo-github"></ion-icon>
            {labels.code}
          </a>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="clay-btn-outline flex h-7 items-center justify-center gap-1.5 whitespace-nowrap px-2.5 text-[0.7rem]"
            >
              <ion-icon name="open-outline"></ion-icon>
              {labels.live}
            </a>
          )}

          {singleDoc && (
            <button
              type="button"
              onClick={() => handleDownload(singleDoc)}
              className="clay-btn-primary flex h-7 max-w-full items-center justify-center gap-1.5 whitespace-nowrap px-2.5 text-[0.7rem]"
              aria-label={`Download ${singleDoc.label}`}
              title={singleDoc.label}
            >
              <ion-icon name="download-outline"></ion-icon>
              <span className="truncate">Document</span>
            </button>
          )}

          {hasDocs && docCount > 1 && (
            <>
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setDocsOpen((v) => !v)}
                className="clay-btn-primary flex h-7 items-center justify-center gap-1.5 whitespace-nowrap px-2.5 text-[0.7rem]"
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
                  docs={docEntries}
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
