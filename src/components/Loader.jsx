import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { property } from '../data/property.js'

// Two-phase exit: onReveal fires when curtains start parting (so the
// hero can animate in *through* the curtain), onDone fires when the
// curtains are fully gone and the component can unmount.
export default function Loader({ onReveal, onDone }) {
  const root = useRef()
  const [pct, setPct] = useState(0)

  // Warm the browser cache while the loader is on screen so the tour
  // images don't pop-in when the user scrolls into them.
  useEffect(() => {
    const urls = [
      property.heroImage,
      property.lifestyleImage,
      ...property.amenities.map((a) => a.image)
    ]
    urls.forEach((u) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = u
    })
  }, [])

  useEffect(() => {
    const chars = root.current.querySelectorAll('.load-char')
    gsap.set(chars, { y: '110%' })

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.to(chars, { y: '0%', stagger: 0.04, duration: 0.9 })
      .from(
        '[data-loader-meta]',
        { y: 20, opacity: 0, duration: 0.8 },
        '<0.15'
      )
      .from(
        '[data-loader-mandala]',
        {
          opacity: 0,
          scale: 0.6,
          rotate: -45,
          duration: 1.1,
          ease: 'power3.out'
        },
        '<0.1'
      )

    const spin = gsap.to('[data-loader-mandala]', {
      rotate: 360,
      duration: 18,
      ease: 'none',
      repeat: -1
    })

    const obj = { n: 0 }
    const counter = gsap.to(obj, {
      n: 100,
      duration: 2.3,
      delay: 0.4,
      ease: 'power1.inOut',
      onUpdate: () => setPct(Math.floor(obj.n)),
      onComplete: () => {
        const out = gsap.timeline({
          onComplete: () => onDone && onDone()
        })
        out
          .to('[data-loader-meta]', {
            opacity: 0,
            y: -10,
            duration: 0.5,
            ease: 'power2.in'
          })
          .to(
            '[data-loader-mandala]',
            {
              opacity: 0,
              scale: 0.85,
              duration: 0.6,
              ease: 'power2.in'
            },
            '<'
          )
          .to(
            chars,
            {
              y: '-110%',
              stagger: 0.025,
              duration: 0.7,
              ease: 'power3.in'
            },
            '<0.1'
          )
          .to(
            '[data-loader-curtain-top]',
            {
              yPercent: -100,
              duration: 1.2,
              ease: 'expo.inOut',
              onStart: () => onReveal && onReveal()
            },
            '<0.1'
          )
          .to(
            '[data-loader-curtain-bottom]',
            { yPercent: 100, duration: 1.2, ease: 'expo.inOut' },
            '<'
          )
          .set(root.current, { display: 'none' })
      }
    })

    return () => {
      tl.kill()
      counter.kill()
      spin.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chars = Array.from(property.name)

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] pointer-events-auto"
      aria-label="Loading"
    >
      <div
        data-loader-curtain-top
        className="absolute inset-x-0 top-0 h-1/2 bg-[#0A0E1F]"
      />
      <div
        data-loader-curtain-bottom
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0A0E1F]"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          data-loader-mandala
          aria-hidden
          className="absolute opacity-80 pointer-events-none"
          style={{
            width: 'min(80vw, 480px)',
            height: 'min(80vw, 480px)'
          }}
        >
          <Mandala />
        </div>

        <div className="relative flex flex-col items-center">
          <div
            className="eyebrow text-cream/50 mb-6 sm:mb-8 text-center px-4"
            data-loader-meta
          >
            <span className="rule" />
            Est. {new Date().getFullYear()} · {property.location}
          </div>

          <h1
            data-loader-title
            className="serif text-[13vw] sm:text-[11vw] md:text-[8vw] leading-[0.9] text-cream text-center px-4"
          >
            <span className="inline-block overflow-hidden align-bottom">
              {chars.map((ch, i) => (
                <span
                  key={i}
                  className="load-char inline-block"
                  style={{ willChange: 'transform' }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </span>
          </h1>

          <div
            className="mt-10 sm:mt-14 w-[min(80vw,260px)]"
            data-loader-meta
          >
            <div className="relative h-px w-full bg-cream/15 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gold"
                style={{
                  width: `${pct}%`,
                  transition: 'width 80ms linear',
                  boxShadow: '0 0 22px rgba(212,162,76,0.85)'
                }}
              />
            </div>
            <div className="mt-3 flex justify-between text-[10px] eyebrow text-cream/50">
              <span>Preparing Experience</span>
              <span className="gold-text tabular-nums">
                {String(pct).padStart(3, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Mandala() {
  const petals = []
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * 360
    petals.push(
      <path
        key={i}
        d="M 240 70 Q 255 140 240 170 Q 225 140 240 70 Z"
        fill="none"
        stroke="#D4A24C"
        strokeWidth="0.8"
        opacity="0.55"
        transform={`rotate(${a} 240 240)`}
      />
    )
  }
  const spokes = []
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * 360
    spokes.push(
      <line
        key={i}
        x1="240"
        y1="40"
        x2="240"
        y2="60"
        stroke="#D4A24C"
        strokeWidth="0.6"
        opacity="0.45"
        transform={`rotate(${a} 240 240)`}
      />
    )
  }
  return (
    <svg viewBox="0 0 480 480" className="w-full h-full">
      <g fill="none" stroke="#D4A24C">
        <circle cx="240" cy="240" r="220" strokeWidth="0.6" opacity="0.45" />
        <circle cx="240" cy="240" r="180" strokeWidth="0.8" opacity="0.6" />
        <circle cx="240" cy="240" r="140" strokeWidth="0.6" opacity="0.4" />
        <circle cx="240" cy="240" r="96" strokeWidth="0.9" opacity="0.65" />
        <circle cx="240" cy="240" r="52" strokeWidth="0.7" opacity="0.7" />
        {spokes}
        {petals}
        <circle cx="240" cy="240" r="6" fill="#D4A24C" stroke="none" />
      </g>
    </svg>
  )
}
