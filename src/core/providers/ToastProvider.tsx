/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++nextId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const iconMap: Record<ToastType, string> = {
    success: 'checkmark-circle-outline',
    error: 'alert-circle-outline',
    info: 'information-circle-outline',
  }

  const colorMap: Record<ToastType, string> = {
    success: 'var(--success)',
    error: 'var(--error)',
    info: 'var(--accent)',
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container, top-right */}
      <div className="fixed top-20 right-5 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="relative pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl min-w-[280px] max-w-[360px] overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              animation: 'slideInRight 0.25s ease-out',
            }}
          >
            {/* Icon */}
            <ion-icon
              name={iconMap[toast.type]}
              style={{
                color: colorMap[toast.type],
                fontSize: '1.25rem',
                flexShrink: 0,
                marginTop: '1px',
              } as React.CSSProperties}
            ></ion-icon>

            {/* Message */}
            <p
              className="text-sm font-medium flex-1 leading-snug"
              style={{ color: 'var(--text-primary)' }}
            >
              {toast.message}
            </p>

            {/* Dismiss */}
            <button
              onClick={() => dismiss(toast.id)}
              className="shrink-0 transition-opacity duration-200"
              style={{ color: 'var(--text-muted)', opacity: 0.7 }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
              aria-label="Dismiss"
            >
              <ion-icon name="close-outline" style={{ fontSize: '1rem' } as React.CSSProperties}></ion-icon>
            </button>

            {/* Progress bar, drains over 5 seconds */}
            <div
              className="absolute bottom-0 left-0 h-0.5 rounded-full"
              style={{
                backgroundColor: colorMap[toast.type],
                animation: 'drainProgress 5s linear forwards',
                width: '100%',
              }}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
