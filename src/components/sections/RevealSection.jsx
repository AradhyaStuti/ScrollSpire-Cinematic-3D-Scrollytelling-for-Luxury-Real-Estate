import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitChars } from '../../lib/splitChars.jsx'
import { property } from '../../data/property.js'

export default function RevealSection() {
  const root = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 75%',
          end: 'top 15%',
          scrub: 1.2
        },
        defaults: { ease: 'power3.out' }
      })

      tl.from('[data-reveal-eyebrow]', { y: 30, opacity: 0, duration: 1 })
        .from(
          '[data-reveal-headline] .split-char',
          { y: 70, opacity: 0, stagger: 0.02, duration: 1 },
          '<0.1'
        )
        .from(
          '[data-reveal-body]',
          { y: 30, opacity: 0, duration: 1 },
          '<0.15'
        )
        .from(
          '[data-reveal-stat]',
          { y: 40, opacity: 0, stagger: 0.15, duration: 1 },
          '<0.2'
        )

      const counters = root.current.querySelectorAll('[data-count]')
      counters.forEach((el) => {
        const end = Number(el.dataset.count)
        const obj = { n: 0 }
        gsap.to(obj, {
          n: end,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => {
            el.textContent = Math.round(obj.n).toString().padStart(2, '0')
          }
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative h-[200vh]"
      data-section="reveal"
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 md:px-16 grid md:grid-cols-12 gap-6 md:gap-10 items-center">
          <div className="md:col-span-6">
            <div data-reveal-eyebrow className="eyebrow mb-4 sm:mb-6">
              <span className="rule" />
              Chapter I · The Rise
            </div>
            <h2
              data-reveal-headline
              className="serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.98] text-cream"
            >
              <SplitChars text="Built floor by floor —" />
              <br />
              <SplitChars text="a vertical haveli." />
            </h2>
          </div>

          <div className="md:col-span-5 md:col-start-8 space-y-6 md:space-y-10">
            <p
              data-reveal-body
              className="text-sm md:text-base text-cream/65 leading-relaxed max-w-sm"
            >
              Each residence is a private wing — engineered as a stand-alone
              villa, stacked into a single vertical address above Worli Bay.
            </p>
            <div className="grid grid-cols-2 gap-5 sm:gap-6">
              <div data-reveal-stat>
                <div className="flex items-baseline gap-2">
                  <span
                    className="serif text-5xl md:text-6xl gold-text"
                    data-count={property.floors}
                  >
                    00
                  </span>
                </div>
                <div className="eyebrow mt-2 text-cream/60 text-[10px]">
                  Floors
                </div>
              </div>
              <div data-reveal-stat>
                <div className="flex items-baseline gap-2">
                  <span
                    className="serif text-5xl md:text-6xl gold-text"
                    data-count={property.residences}
                  >
                    00
                  </span>
                </div>
                <div className="eyebrow mt-2 text-cream/60 text-[10px]">
                  Residences
                </div>
              </div>
              <div data-reveal-stat className="col-span-2 mt-1 md:mt-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="serif text-4xl md:text-5xl gold-text">
                    {property.priceFrom}
                  </span>
                  <span className="eyebrow text-cream/50 text-[10px]">
                    Onwards
                  </span>
                </div>
                <div className="eyebrow mt-2 text-cream/60 text-[10px]">
                  For Private Enquiries
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
