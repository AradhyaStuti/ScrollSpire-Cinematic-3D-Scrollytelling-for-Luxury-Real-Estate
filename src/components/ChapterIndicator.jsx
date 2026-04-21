import React, { useEffect, useRef, useState } from 'react'
import { scrollState, getLenis } from '../lib/scroll.js'

// Boundaries are eyeballed from the actual section heights; if you add
// or remove a section, recalc these.
const chapters = [
  { key: 'hook',     label: 'Prologue · The Arrival', from: 0,    to: 0.09, target: null },
  { key: 'reveal',   label: 'I · The Rise',           from: 0.09, to: 0.26, target: '#residence' },
  { key: 'tour',     label: 'II · The Tour',          from: 0.26, to: 0.6,  target: '#amenities' },
  { key: 'life',     label: 'III · The Lifestyle',    from: 0.6,  to: 0.74, target: '#lifestyle' },
  { key: 'craft',    label: 'IV · The Craft',         from: 0.74, to: 0.86, target: '#craft'     },
  { key: 'cta',      label: 'V · The Address',        from: 0.86, to: 1,    target: '#enquire'   }
]

export default function ChapterIndicator() {
  const [active, setActive] = useState(0)
  const raf = useRef()
  const progressRef = useRef()

  useEffect(() => {
    const tick = () => {
      const p = scrollState.progress
      let idx = 0
      for (let i = 0; i < chapters.length; i++) {
        if (p >= chapters[i].from) idx = i
      }
      setActive((curr) => (curr === idx ? curr : idx))
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleY(${p})`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const jumpTo = (c) => {
    const lenis = getLenis()
    if (c.target) {
      const el = document.querySelector(c.target)
      if (lenis && el) return lenis.scrollTo(el, { duration: 1.6 })
      if (el) return el.scrollIntoView({ behavior: 'smooth' })
    }
    if (lenis) lenis.scrollTo(0, { duration: 1.6 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <aside className="fixed right-5 md:right-8 lg:right-10 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-5 lg:gap-6 text-cream/70">
      <div className="absolute -left-5 lg:-left-6 top-0 bottom-0 w-px bg-cream/15">
        <div
          ref={progressRef}
          className="absolute top-0 left-0 w-full bg-gold origin-top h-full"
          style={{ transform: 'scaleY(0)', transition: 'transform 0.08s linear' }}
        />
      </div>

      {chapters.map((c, i) => {
        const isActive = i === active
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => jumpTo(c)}
            aria-label={`Jump to ${c.label}`}
            data-cursor
            data-cursor-text="Jump"
            className="flex items-center gap-3 transition-all duration-500 group"
            style={{
              opacity: isActive ? 1 : 0.35,
              transform: isActive ? 'translateX(0)' : 'translateX(6px)'
            }}
          >
            <span
              className="block h-px transition-all duration-500 group-hover:w-[36px]"
              style={{
                width: isActive ? 28 : 12,
                background: isActive ? '#D4A24C' : 'currentColor'
              }}
            />
            <span
              className="eyebrow text-[10px] hidden lg:inline group-hover:text-gold transition-colors"
              style={{ color: isActive ? '#D4A24C' : 'inherit' }}
            >
              {c.label}
            </span>
          </button>
        )
      })}
    </aside>
  )
}
