import { useState, useRef, useEffect } from 'react'
import { useLanguage, languages } from '../../../core/providers/LanguageProvider'

function LanguagePicker() {
  const { locale, setLocale } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = languages.find((l) => l.code === locale) ?? languages[0]

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative flex-1">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Select language"
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border text-sm font-medium transition-colors duration-200"
        style={{
          borderColor: open ? 'var(--accent)' : 'var(--border)',
          color: open ? 'var(--accent)' : 'var(--text-secondary)',
          backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)'
          e.currentTarget.style.color = 'var(--accent)'
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }
        }}
      >
        <ion-icon name="globe-outline" style={{ fontSize: '0.9rem' }}></ion-icon>
        <span className="text-xs">{current.label}</span>
        <ion-icon
          name={open ? 'chevron-up-outline' : 'chevron-down-outline'}
          style={{ fontSize: '0.7rem' }}
        ></ion-icon>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-44 rounded-xl border overflow-hidden z-50 shadow-lg"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
          }}
        >
          {languages.map((lang) => {
            const active = lang.code === locale
            return (
              <button
                key={lang.code}
                onClick={() => { setLocale(lang.code); setOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors duration-150"
                style={{
                  backgroundColor: active ? 'var(--accent-dim)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'var(--accent-dim)'
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <span>{lang.label}</span>
                {active && (
                  <ion-icon
                    name="checkmark-outline"
                    style={{ marginLeft: 'auto', color: 'var(--accent)' }}
                  ></ion-icon>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LanguagePicker
