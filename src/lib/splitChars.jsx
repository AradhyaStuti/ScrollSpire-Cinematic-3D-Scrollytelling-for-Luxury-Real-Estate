import React from 'react'

// Each word is wrapped in an inline-block span with white-space:nowrap,
// so line-wraps only happen between words — never mid-word. The inner
// spans remain individually selectable via `.split-char` for GSAP.
export function SplitChars({ text, className = '', charClass = '', masked = false }) {
  const words = text.split(' ')

  const inner = words.map((word, wi) => (
    <React.Fragment key={wi}>
      <span
        className="split-word"
        style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
      >
        {Array.from(word).map((ch, ci) => (
          <span
            key={ci}
            aria-hidden="true"
            className={`split-char ${charClass}`}
          >
            {ch}
          </span>
        ))}
      </span>
      {wi < words.length - 1 && ' '}
    </React.Fragment>
  ))

  if (masked) {
    return (
      <span className={`mask-line ${className}`} aria-label={text}>
        {inner}
      </span>
    )
  }
  return (
    <span className={className} aria-label={text}>
      {inner}
    </span>
  )
}
