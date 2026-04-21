import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitChars } from '../../lib/splitChars.jsx'
import { property } from '../../data/property.js'

export default function AmenitiesSection() {
  const root = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('[data-amenity]')
      const images = gsap.utils.toArray('[data-amenity-image]')
      const pips = gsap.utils.toArray('[data-pip]')

      gsap.set(cards, { opacity: 0, y: 40 })
      gsap.set(cards[0], { opacity: 1, y: 0 })
      gsap.set(images, { clipPath: 'inset(100% 0 0 0)' })
      gsap.set(images[0], { clipPath: 'inset(0% 0 0 0)' })

      const activatePip = (i) => {
        pips.forEach((p, j) => {
          gsap.to(p, {
            scaleX: j === i ? 1.8 : 1,
            backgroundColor:
              j === i ? 'rgba(212,162,76,1)' : 'rgba(244,238,224,0.2)',
            duration: 0.6,
            ease: 'power3.out',
            transformOrigin: 'left'
          })
        })
      }
      activatePip(0)

      // FIXME: window.innerHeight captured at trigger-creation time.
      // If the user resizes / rotates the phone mid-section the boundaries
      // are stale. Need ScrollTrigger.refresh() on resize but it flashes
      // the cards during the refresh so I punted on it.
      cards.forEach((card, i) => {
        if (i === 0) return
        const image = images[i]
        const prevImage = images[i - 1]

        ScrollTrigger.create({
          trigger: root.current,
          start: `top+=${i * window.innerHeight} top`,
          end: `top+=${(i + 1) * window.innerHeight} top`,
          onEnter: () => {
            gsap.to(cards[i - 1], {
              opacity: 0,
              y: -30,
              duration: 0.7,
              ease: 'power3.inOut'
            })
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              delay: 0.1,
              ease: 'power3.out'
            })
            gsap.to(prevImage, {
              clipPath: 'inset(0 0 100% 0)',
              duration: 1.1,
              ease: 'expo.inOut'
            })
            gsap.to(image, {
              clipPath: 'inset(0% 0 0 0)',
              duration: 1.2,
              delay: 0.05,
              ease: 'expo.inOut'
            })
            activatePip(i)
          },
          onLeaveBack: () => {
            gsap.to(card, {
              opacity: 0,
              y: 40,
              duration: 0.5,
              ease: 'power3.inOut'
            })
            gsap.to(cards[i - 1], {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out'
            })
            gsap.to(image, {
              clipPath: 'inset(100% 0 0 0)',
              duration: 0.9,
              ease: 'expo.inOut'
            })
            gsap.to(prevImage, {
              clipPath: 'inset(0% 0 0 0)',
              duration: 1,
              ease: 'expo.inOut'
            })
            activatePip(i - 1)
          }
        })
      })

      cards.forEach((card) => {
        const el = card.querySelector('[data-metric]')
        if (!el) return
        const end = Number(el.dataset.metric)
        const obj = { n: 0 }
        ScrollTrigger.create({
          trigger: card,
          start: 'top 90%',
          onEnter: () => {
            gsap.to(obj, {
              n: end,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = Math.round(obj.n)
              }
            })
          }
        })
      })

      gsap.from('[data-amenities-eyebrow]', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: root.current,
          start: 'top 70%'
        }
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative h-[400vh]"
      data-section="amenities"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="max-w-6xl mx-auto w-full px-6 sm:px-8 md:px-16 relative">
          <div
            data-amenities-eyebrow
            className="eyebrow mb-6 sm:mb-10"
          >
            <span className="rule" />
            Chapter II · The Tour
          </div>

          <div className="grid md:grid-cols-12 gap-6 md:gap-12 items-center">
            <div className="md:col-span-6 relative aspect-[16/10] sm:aspect-[4/3] md:aspect-[4/5] w-full">
              <div className="absolute inset-0 border border-cream/10" />
              {property.amenities.map((a) => (
                <div
                  key={a.title}
                  data-amenity-image
                  className="absolute inset-0 overflow-hidden"
                >
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/10" />
                  <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 eyebrow text-cream/85">
                    {a.title}
                  </div>
                </div>
              ))}
              <span className="ornament-corner" />
              <span className="ornament-corner tr" />
              <span className="ornament-corner bl" />
              <span className="ornament-corner br" />
            </div>

            <div className="md:col-span-5 md:col-start-8 relative min-h-[40vh] md:min-h-[46vh]">
              {property.amenities.map((a, i) => (
                <article
                  key={a.title}
                  data-amenity
                  className="absolute inset-0"
                >
                  <div className="eyebrow text-cream/50 mb-3 md:mb-4 text-[10px]">
                    0{i + 1} / 0{property.amenities.length}
                    <span className="ml-3 text-cream/40 hidden sm:inline">
                      {a.subtitle}
                    </span>
                  </div>
                  <h3 className="serif text-3xl sm:text-4xl md:text-6xl leading-[0.98] text-cream mb-4 md:mb-6">
                    <SplitChars text={a.title} />
                  </h3>
                  <p className="text-sm md:text-base text-cream/70 leading-relaxed max-w-md mb-6 md:mb-8">
                    {a.description}
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="serif text-5xl sm:text-6xl md:text-7xl gold-text"
                      data-metric={a.metric}
                    >
                      0
                    </span>
                    <span className="serif text-2xl md:text-3xl text-gold/80">
                      {a.metricUnit}
                    </span>
                  </div>
                  <div className="eyebrow mt-2 text-cream/50 text-[10px]">
                    {a.metricLabel}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 md:mt-10 flex gap-2 md:gap-3">
            {property.amenities.map((_, i) => (
              <span
                key={i}
                data-pip
                className="block w-6 sm:w-10 h-px bg-cream/20 origin-left"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
