import React from 'react'

export default function SectionDivider() {
  return (
    <div
      className="relative z-10 py-6 sm:py-10 flex items-center justify-center pointer-events-none"
      aria-hidden
    >
      <svg
        width="220"
        height="18"
        viewBox="0 0 220 18"
        fill="none"
        className="text-gold/70"
      >
        <line x1="0" y1="9" x2="92" y2="9" stroke="currentColor" strokeWidth="0.6" />
        <line x1="128" y1="9" x2="220" y2="9" stroke="currentColor" strokeWidth="0.6" />
        <path
          d="M110 3 L117 9 L110 15 L103 9 Z"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
        />
        <circle cx="110" cy="9" r="1.3" fill="currentColor" />
      </svg>
    </div>
  )
}
