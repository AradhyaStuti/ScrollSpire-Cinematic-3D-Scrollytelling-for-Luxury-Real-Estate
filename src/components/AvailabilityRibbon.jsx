import React, { useEffect, useRef, useState } from 'react'
import { scrollState } from '../lib/scroll.js'
import { property } from '../data/property.js'

export default function AvailabilityRibbon() {
  const [visible, setVisible] = useState(false)
  const raf = useRef()

  useEffect(() => {
    const tick = () => {
      // Hide at the CTA so it doesn't compete with the form.
      const p = scrollState.progress
      const show = p > 0.08 && p < 0.82
      setVisible((curr) => (curr === show ? curr : show))
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div
      className="fixed left-5 md:left-8 bottom-5 md:bottom-8 z-30 transition-all duration-700 pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)'
      }}
    >
      <div className="relative border border-gold/40 bg-ink/55 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-cream/70">
          <span className="gold-text serif text-base sm:text-lg tabular-nums leading-none">
            {pad(property.residencesAvailable)}
          </span>
          <span className="leading-tight">
            <span className="block text-cream">
              of {pad(property.residences)} remaining
            </span>
            <span className="text-cream/45 text-[9px]">By Invitation</span>
          </span>
        </div>
        <span className="absolute inset-0 border border-gold/15 -m-1 pointer-events-none" />
      </div>
    </div>
  )
}
