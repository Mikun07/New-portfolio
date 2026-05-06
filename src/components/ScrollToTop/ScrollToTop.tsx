import { useEffect, useState } from 'react'
import { useWindowScroll } from 'react-use'

function ScrollToTop() {
  const { y: pageYOffset } = useWindowScroll()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(pageYOffset > 400)
  }, [pageYOffset])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-16 right-6 z-50 flex items-center justify-center w-11 h-11 rounded-full border text-base text-white shadow-lg transition-all duration-300"
      style={{
        backgroundColor: 'var(--accent)',
        borderColor: 'var(--accent)',
        boxShadow: '0 4px 20px hsla(24, 95%, 53%, 0.45)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--accent-hover)'
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 8px 24px hsla(24, 95%, 53%, 0.55)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--accent)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 20px hsla(24, 95%, 53%, 0.45)'
      }}
    >
      <ion-icon name="chevron-up-outline"></ion-icon>
    </button>
  )
}

export default ScrollToTop
