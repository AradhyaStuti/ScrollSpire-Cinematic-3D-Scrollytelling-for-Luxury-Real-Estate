import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitChars } from '../../lib/splitChars.jsx'
import { property } from '../../data/property.js'

export default function HeritageSection() {
  const root = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-heritage-eyebrow]', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%' }
      })

      gsap.from('[data-heritage-headline] .split-char', {
        y: 60,
        opacity: 0,
        stagger: 0.022,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' }
      })

      gsap.from('[data-heritage-body]', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 65%' }
      })

      gsap.utils.toArray('[data-material]').forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
          {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.1,
            ease: 'expo.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: card, start: 'top 85%' }
          }
        )
        const img = card.querySelector('img')
        if (img) {
          gsap.to(img, {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          })
        }
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative min-h-screen py-24 sm:py-32 md:py-40"
      data-section="heritage"
    >
      <div className="max-w-6xl mx-auto w-full px-6 sm:px-8 md:px-16">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-20">
          <div className="md:col-span-6">
            <div data-heritage-eyebrow className="eyebrow mb-4 sm:mb-6">
              <span className="rule" />
              Chapter IV · The Craft
            </div>
            <h2
              data-heritage-headline
              className="serif text-4xl sm:text-5xl md:text-6xl leading-[0.98] text-cream"
            >
              <SplitChars text="Built by hand," />
              <br />
              <SplitChars text="from known workshops." />
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p
              data-heritage-body
              className="text-sm md:text-base text-cream/65 leading-relaxed max-w-md"
            >
              Every material here has an origin story. Nothing is anonymous.
              The concierge can introduce you to the people who made it.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 max-w-4xl">
          {property.materials.map((m, i) => (
            <figure
              key={m.name}
              data-material
              className="relative group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-ink2 border border-cream/10">
                <img
                  src={m.image}
                  alt={m.name}
                  loading="lazy"
                  className="w-full h-[110%] object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
                <div className="absolute top-3 left-3 eyebrow text-[10px] text-gold/90">
                  0{i + 1}
                </div>
                <span className="ornament-corner" />
                <span className="ornament-corner tr" />
              </div>
              <figcaption className="pt-3 sm:pt-4">
                <div className="serif text-lg sm:text-xl text-cream leading-tight">
                  {m.name}
                </div>
                <div className="eyebrow text-[10px] text-gold/80 mt-1">
                  {m.origin}
                </div>
                <p className="mt-2 text-[11px] sm:text-xs text-cream/55 leading-relaxed">
                  {m.note}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-16 md:mt-24 pt-8 border-t border-cream/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-cream/55">
          {[
            ['Developer', property.credits.developer],
            ['Architect', property.credits.architect],
            ['Interiors', property.credits.interiors],
            ['Landscape', property.credits.landscape]
          ].map(([label, value]) => (
            <div key={label}>
              <div className="text-cream/35 mb-1">{label}</div>
              <div className="text-cream">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
