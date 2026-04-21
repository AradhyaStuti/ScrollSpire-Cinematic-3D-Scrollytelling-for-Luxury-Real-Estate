import React, { useEffect, useState } from 'react'
import { property } from '../data/property.js'

const fmt = new Intl.DateTimeFormat('en-IN', {
  timeZone: property.timezone,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
})

// 30s cadence is fine — we don't need second-accurate display, and
// the less frequent setState the better for React.
export default function MumbaiTime() {
  const [now, setNow] = useState(() => fmt.format(new Date()))

  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <span
      className="eyebrow text-[10px] text-cream/55 tabular-nums"
      aria-label={`Mumbai time ${now}`}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold mr-2 align-middle" />
      Mumbai · {now} IST
    </span>
  )
}
