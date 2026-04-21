import React from 'react'

const svg = `
<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'>
  <filter id='n'>
    <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
    <feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/>
  </filter>
  <rect width='100%' height='100%' filter='url(#n)'/>
</svg>
`
const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

export default function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[80] pointer-events-none opacity-[0.07] mix-blend-overlay"
      style={{ backgroundImage: `url("${url}")` }}
    />
  )
}
