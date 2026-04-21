import React, { useEffect, useRef } from 'react'
// import { useLayoutEffect } from 'react'  // tried this to kill the 1-frame flash; useEffect works
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitChars } from '../../lib/splitChars.jsx'
import { property } from '../../data/property.js'

export default function HeroSection({ ready = false }) {
  // Hold intro animations until the Loader fires onReveal — otherwise
  // they'd play behind the curtain and the user never sees them.
  const root = useRef()
  const played = useRef(false)

  useEffect(() => {
    const q = gsap.utils.selector(root.current)
    gsap.set(q('[data-hero-eyebrow]'), { opacity: 0, y: 20 })
    gsap.set(q('[data-hero-title] .split-char'), { y: 90, opacity: 0 })
    gsap.set(q('[data-hero-sub]'), { opacity: 0, y: 24 })
    gsap.set(q('[data-hero-tag]'), { opacity: 0, letterSpacing: '0.6em' })
    gsap.set(q('[data-hero-indicator]'), { opacity: 0 })
  }, [])

  useEffect(() => {
    if (!ready || played.current) return
    played.current = true

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to('[data-hero-eyebrow]', { y: 0, opacity: 1, duration: 1 })
        .to(
          '[data-hero-title] .split-char',
          {
            y: 0,
            opacity: 1,
            stagger: 0.03,
            duration: 1.15,
            ease: 'expo.out'
          },
          '-=0.6'
        )
        .to(
          '[data-hero-tag]',
          {
            opacity: 0.8,
            letterSpacing: '0.3em',
            duration: 1.4,
            ease: 'power3.out'
          },
          '-=0.9'
        )
        .to(
          '[data-hero-sub]',
          { y: 0, opacity: 1, duration: 1 },
          '-=0.7'
        )
        .to(
          '[data-hero-indicator]',
          { opacity: 1, duration: 0.8 },
          '-=0.3'
        )

      gsap.to('[data-hero-overlay]', {
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      })

      gsap.to('[data-hero-indicator] .scroll-line', {
        scaleY: 0.3,
        transformOrigin: 'top',
        repeat: -1,
        yoyo: true,
        duration: 1.3,
        ease: 'sine.inOut'
      })
    }, root)

    return () => ctx.revert()
  }, [ready])

  return (
    <section
      ref={root}
      className="relative h-screen w-full"
      data-section="hero"
    >
      <div
        data-hero-overlay
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center text-center px-5 sm:px-6"
      >
        <div data-hero-eyebrow className="eyebrow mb-6 sm:mb-8">
          <span className="rule" />
          {property.location}
        </div>

        <h1
          data-hero-title
          className="serif text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[9vw] leading-[0.92] tracking-tight text-cream max-w-[20ch]"
        >
          <SplitChars text={property.name} />
        </h1>

        <div
          data-hero-tag
          className="mt-2 text-[10px] md:text-xs eyebrow text-gold"
        >
          A Private Vertical Estate
        </div>

        <p
          data-hero-sub
          className="mt-8 sm:mt-10 max-w-[24ch] sm:max-w-xl text-sm md:text-base text-cream/70 font-light tracking-wide"
        >
          {property.tagline}
        </p>

        <div
          data-hero-indicator
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-cream/70"
        >
          <span className="eyebrow text-[10px] mb-2 sm:mb-3">Scroll</span>
          <span className="scroll-line block w-px h-10 sm:h-14 bg-gradient-to-b from-gold via-gold/50 to-transparent" />
        </div>
      </div>
    </section>
  )
}
