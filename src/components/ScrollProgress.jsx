import React, { useEffect, useRef } from 'react'
import { scrollState } from '../lib/scroll.js'

export default function ScrollProgress() {
  const ref = useRef()
  const raf = useRef()

  useEffect(() => {
    const tick = () => {
      if (ref.current) {
        ref.current.style.transform = `scaleX(${scrollState.progress})`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-30 h-[2px] bg-cream/5 pointer-events-none">
      <div
        ref={ref}
        className="h-full origin-left bg-gradient-to-r from-goldSoft via-gold to-goldSoft"
        style={{
          transform: 'scaleX(0)',
          boxShadow: '0 0 12px rgba(201,168,76,0.55)'
        }}
      />
    </div>
  )
}
