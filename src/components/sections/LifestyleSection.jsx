import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitChars } from '../../lib/splitChars.jsx'
import { property } from '../../data/property.js'

export default function LifestyleSection() {
  const root = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-lifestyle-reveal]',
        { clipPath: 'inset(0% 50% 0% 50%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1
          }
        }
      )

      gsap.from('[data-lifestyle-headline] .split-char', {
        y: 60,
        opacity: 0,
        stagger: 0.025,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: root.current,
          start: 'top 70%'
        }
      })

      gsap.from('[data-lifestyle-body]', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: root.current,
          start: 'top 60%'
        }
      })

      gsap.from('[data-lifestyle-quote]', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-lifestyle-quote]',
          start: 'top 85%'
        }
      })

      gsap.to('[data-lifestyle-image]', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative h-[180vh]"
      data-section="lifestyle"
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div className="max-w-6xl mx-auto w-full px-6 sm:px-8 md:px-16">
          <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-center">
            <div className="md:col-span-5">
              <div className="eyebrow mb-4 sm:mb-6">
                <span className="rule" />
                Chapter III · The Lifestyle
              </div>
              <h2
                data-lifestyle-headline
                className="serif text-4xl sm:text-5xl md:text-6xl leading-[0.98] text-cream"
              >
                <SplitChars text="The Arabian Sea," />
                <br />
                <SplitChars text="a Worli sunset," />
                <br />
                <SplitChars text="a private sky." />
              </h2>
              <p
                data-lifestyle-body
                className="mt-6 md:mt-8 text-sm md:text-base text-cream/70 leading-relaxed max-w-md"
              >
                Mornings open onto the bay. Evenings close on the Bandra–Worli
                Sea Link. Everything in between is yours to script.
              </p>

              <figure
                data-lifestyle-quote
                className="mt-8 md:mt-10 max-w-md border-l border-gold/50 pl-5 sm:pl-6"
              >
                <blockquote className="serif italic text-lg sm:text-xl text-cream/85 leading-snug">
                  &ldquo;{property.testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-3 eyebrow text-[10px] text-gold/80">
                  — {property.testimonial.author}
                </figcaption>
              </figure>
            </div>

            <div className="md:col-span-7 relative">
              <div
                data-lifestyle-reveal
                className="aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden relative"
              >
                <img
                  data-lifestyle-image
                  src={property.lifestyleImage}
                  alt="Worli Sea Link at dusk"
                  className="w-full h-full object-cover scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 eyebrow text-cream/70 text-[10px]">
                  Worli Sea Face · 18:42
                </div>
                <span className="ornament-corner" />
                <span className="ornament-corner tr" />
                <span className="ornament-corner bl" />
                <span className="ornament-corner br" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
