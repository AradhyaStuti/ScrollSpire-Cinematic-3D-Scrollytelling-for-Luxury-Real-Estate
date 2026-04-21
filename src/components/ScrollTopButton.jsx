import React, { useEffect, useRef, useState } from 'react'
import { scrollState } from '../lib/scroll.js'
import { getLenis } from '../lib/scroll.js'

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false)
  const raf = useRef()

  useEffect(() => {
    const tick = () => {
      const show = scrollState.progress > 0.12
      setVisible((curr) => (curr === show ? curr : show))
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const go = () => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { duration: 1.6 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={go}
      aria-label="Scroll to top"
      data-cursor
      className="fixed bottom-5 right-5 md:bottom-8 md:right-[88px] lg:right-[110px] z-30 w-11 h-11 md:w-12 md:h-12 border border-gold/50 flex items-center justify-center text-gold transition-all duration-500 hover:bg-gold/10 hover:border-gold"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(10px)'
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M6 11V1M6 1L2 5M6 1L10 5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="square"
        />
      </svg>
    </button>
  )
}
