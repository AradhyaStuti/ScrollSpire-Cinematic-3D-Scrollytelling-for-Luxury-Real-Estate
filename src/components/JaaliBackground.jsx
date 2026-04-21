import React from 'react'

// Inline SVG pattern used as a repeating background-image. No network
// request, no separate asset.
export default function JaaliBackground() {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
      <g fill='none' stroke='#D4A24C' stroke-width='0.6' opacity='0.55'>
        <circle cx='60' cy='60' r='40'/>
        <circle cx='60' cy='60' r='26'/>
        <circle cx='60' cy='60' r='12'/>
        <path d='M60 20 L60 100 M20 60 L100 60'/>
        <path d='M31.7 31.7 L88.3 88.3 M88.3 31.7 L31.7 88.3'/>
        <path d='M60 12 L64 20 L60 28 L56 20 Z' fill='#D4A24C' opacity='0.35'/>
        <path d='M60 92 L64 100 L60 108 L56 100 Z' fill='#D4A24C' opacity='0.35'/>
        <path d='M12 60 L20 64 L28 60 L20 56 Z' fill='#D4A24C' opacity='0.35'/>
        <path d='M92 60 L100 64 L108 60 L100 56 Z' fill='#D4A24C' opacity='0.35'/>
      </g>
    </svg>
  `
  const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[1] pointer-events-none opacity-[0.08]"
      style={{
        backgroundImage: `url("${url}")`,
        backgroundRepeat: 'repeat',
        mixBlendMode: 'screen'
      }}
    />
  )
}
