import React, { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroCanvas from './components/HeroCanvas.jsx'
import HeroSection from './components/sections/HeroSection.jsx'
import RevealSection from './components/sections/RevealSection.jsx'
import AmenitiesSection from './components/sections/AmenitiesSection.jsx'
import LifestyleSection from './components/sections/LifestyleSection.jsx'
import HeritageSection from './components/sections/HeritageSection.jsx'
import CTASection from './components/sections/CTASection.jsx'
import Loader from './components/Loader.jsx'
import ChapterIndicator from './components/ChapterIndicator.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import Marquee from './components/Marquee.jsx'
import GrainOverlay from './components/GrainOverlay.jsx'
import JaaliBackground from './components/JaaliBackground.jsx'
import MagneticButton from './components/MagneticButton.jsx'
import MobileMenu from './components/MobileMenu.jsx'
import ScrollTopButton from './components/ScrollTopButton.jsx'
import MumbaiTime from './components/MumbaiTime.jsx'
import AvailabilityRibbon from './components/AvailabilityRibbon.jsx'
import SectionDivider from './components/SectionDivider.jsx'
import { initScroll, destroyScroll, getLenis } from './lib/scroll.js'
import { property } from './data/property.js'

const sectionIds = ['#residence', '#amenities', '#lifestyle', '#craft', '#enquire']

// TODO: consolidate ScrollProgress + ChapterIndicator into one aside?
// They read the same scrollState every frame.

export default function App() {
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const lenis = initScroll()
    lenis.stop()
    document.documentElement.style.overflow = 'hidden'
    return () => destroyScroll()
  }, [])

  const onLoaderReveal = () => {
    setRevealed(true)
    document.documentElement.style.overflow = ''
    const lenis = getLenis()
    if (lenis) lenis.start()
    ScrollTrigger.refresh()
  }

  const onLoaderDone = () => setDone(true)

  useEffect(() => {
    if (!revealed) return
    const lenis = getLenis()
    const go = (selector) => {
      const el = document.querySelector(selector)
      if (lenis && el) lenis.scrollTo(el, { duration: 1.4 })
      else if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    const top = () => {
      if (lenis) lenis.scrollTo(0, { duration: 1.4 })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    const bottom = () => {
      if (lenis) lenis.scrollTo(document.body.scrollHeight, { duration: 1.4 })
      else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }

    const currentIndex = () => {
      const y = window.scrollY + window.innerHeight * 0.5
      let i = -1
      sectionIds.forEach((id, idx) => {
        const el = document.querySelector(id)
        if (el && el.getBoundingClientRect().top + window.scrollY <= y) i = idx
      })
      return i
    }

    const onKey = (e) => {
      // Let the user type in form fields without hijacking their keys.
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'PageDown') {
        e.preventDefault()
        const next = Math.min(currentIndex() + 1, sectionIds.length - 1)
        go(sectionIds[Math.max(next, 0)])
      } else if (e.key === 'PageUp') {
        e.preventDefault()
        const prev = currentIndex() - 1
        if (prev < 0) top()
        else go(sectionIds[prev])
      } else if (e.key === 'Home') {
        e.preventDefault()
        top()
      } else if (e.key === 'End') {
        e.preventDefault()
        bottom()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [revealed])

  return (
    <div className="relative">
      <div className="fixed inset-0 z-0">
        <HeroCanvas />
      </div>
      <JaaliBackground />

      <header
        id="top"
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 sm:px-6 md:px-10 py-4 sm:py-6 text-cream"
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="#top"
            className="serif text-base sm:text-lg md:text-xl tracking-wider"
            data-cursor
          >
            {property.name.split(' ')[0]}
            <span className="gold-text">.</span>
          </a>
          <span className="hidden lg:inline-block h-3 w-px bg-cream/20" />
          <span className="hidden lg:inline-block">
            <MumbaiTime />
          </span>
        </div>

        <nav className="hidden md:flex gap-6 lg:gap-8 eyebrow text-[10px]">
          {[
            ['Residence', '#residence'],
            ['Amenities', '#amenities'],
            ['Lifestyle', '#lifestyle'],
            ['Craft',     '#craft'],
            ['Enquire',   '#enquire']
          ].map(([label, href]) => (
            <MagneticButton key={href} strength={0.25}>
              <a
                href={href}
                className="nav-link hover:text-gold transition-colors duration-500"
                data-cursor
              >
                {label}
              </a>
            </MagneticButton>
          ))}
        </nav>

        <MagneticButton strength={0.25}>
          <a
            href={`tel:${property.contactPhone.replace(/\s/g, '')}`}
            className="hidden lg:inline-block eyebrow text-[10px] text-gold hover:text-goldSoft transition-colors"
            data-cursor
          >
            {property.contactPhone}
          </a>
        </MagneticButton>
      </header>

      <MobileMenu />

      <main className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <HeroSection ready={revealed} />
        </div>
        <div id="residence" className="pointer-events-auto">
          <RevealSection />
        </div>
        <SectionDivider />
        <div id="amenities" className="pointer-events-auto">
          <AmenitiesSection />
        </div>
        <SectionDivider />
        <div id="lifestyle" className="pointer-events-auto">
          <LifestyleSection />
        </div>
        <SectionDivider />
        <div id="craft" className="pointer-events-auto">
          <HeritageSection />
        </div>
        <div className="pointer-events-auto relative z-10">
          <Marquee
            items={[
              property.name,
              property.location,
              `From ${property.priceFrom}`,
              'By Invitation Only',
              `${property.residences} Residences`,
              `${property.floors} Floors`,
              property.handover
            ]}
          />
        </div>
        <div id="enquire" className="pointer-events-auto">
          <CTASection />
        </div>
      </main>

      <footer className="relative z-10 border-t border-cream/10 pt-12 pb-10 px-6 sm:px-8 md:px-16 text-[10px] tracking-[0.22em] uppercase text-cream/45">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-2">
            <div className="serif text-xl sm:text-2xl text-cream tracking-wider normal-case">
              {property.name.split(' ')[0]}
              <span className="gold-text">.</span>
            </div>
            <div>{property.location}</div>
            <div className="text-cream/35">{property.state}</div>
            <div className="pt-3 gold-text">{property.handover}</div>
          </div>
          <div className="md:col-span-4 space-y-1.5">
            <div className="text-cream/35">Developed By</div>
            <div className="text-cream">{property.credits.developer}</div>
            <div className="text-cream/35 pt-2">Architect</div>
            <div className="text-cream">{property.credits.architect}</div>
          </div>
          <div className="md:col-span-4 space-y-1.5">
            <div className="text-cream/35">Concierge</div>
            <a
              href={`tel:${property.contactPhone.replace(/\s/g, '')}`}
              className="block text-cream hover:text-gold transition-colors"
              data-cursor
            >
              {property.contactPhone}
            </a>
            <a
              href={`mailto:${property.contactEmail}`}
              className="block text-cream hover:text-gold transition-colors break-all"
              data-cursor
            >
              {property.contactEmail}
            </a>
            <div className="pt-3 text-cream/35">
              RERA · {property.reraNumber}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[9px] text-cream/35">
          <div>
            © {new Date().getFullYear()} {property.name}. All rights reserved.
          </div>
          <div>A demonstration in cinematic scrollytelling.</div>
        </div>
      </footer>

      <ScrollProgress />
      <ChapterIndicator />
      <ScrollTopButton />
      <AvailabilityRibbon />
      <GrainOverlay />
      <CustomCursor />

      {!done && (
        <Loader onReveal={onLoaderReveal} onDone={onLoaderDone} />
      )}
    </div>
  )
}
