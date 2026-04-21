import React from 'react'

export default function Marquee({ items, speed = 40 }) {
  const row = items.join('  ·  ')
  return (
    <div className="relative overflow-hidden py-4 sm:py-6 border-y border-cream/10 bg-ink/30 backdrop-blur-sm">
      <div
        className="flex whitespace-nowrap serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl gold-text"
        style={{
          animation: `marqueeScroll ${speed}s linear infinite`
        }}
      >
        <span className="pr-8 sm:pr-10">{row}</span>
        <span className="pr-8 sm:pr-10">{row}</span>
        <span className="pr-8 sm:pr-10">{row}</span>
      </div>

      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  )
}
