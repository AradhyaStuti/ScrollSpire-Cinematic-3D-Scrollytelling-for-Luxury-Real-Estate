import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { getLenis } from '../lib/scroll.js'
import { property } from '../data/property.js'

const items = [
  ['Residence', '#residence', '01'],
  ['Amenities', '#amenities', '02'],
  ['Lifestyle', '#lifestyle', '03'],
  ['Craft',     '#craft',     '04'],
  ['Enquire',   '#enquire',   '05']
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const drawer = useRef()
  const scrim = useRef()

  useEffect(() => {
    const d = drawer.current
    const s = scrim.current
    if (!d || !s) return

    if (open) {
      document.documentElement.style.overflow = 'hidden'
      const lenis = getLenis()
      if (lenis) lenis.stop()

      gsap.set([d, s], { display: 'block' })
      gsap.fromTo(
        s,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power3.out' }
      )
      gsap.fromTo(
        d,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.7, ease: 'expo.out' }
      )
      gsap.fromTo(
        d.querySelectorAll('[data-drawer-item]'),
        { x: 36, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.7,
          delay: 0.2,
          ease: 'power3.out'
        }
      )
      gsap.fromTo(
        d.querySelectorAll('[data-drawer-foot]'),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.5,
          ease: 'power3.out'
        }
      )
    } else if (d.style.display === 'block') {
      document.documentElement.style.overflow = ''
      const lenis = getLenis()
      if (lenis) lenis.start()

      gsap.to(s, { opacity: 0, duration: 0.3, ease: 'power3.in' })
      gsap.to(d, {
        xPercent: 100,
        duration: 0.5,
        ease: 'expo.in',
        onComplete: () => {
          gsap.set([d, s], { display: 'none' })
        }
      })
    }
  }, [open])

  // TODO: focus-trap when open. Tabbing out of the drawer currently
  // lands on the hidden desktop nav links.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (href) => {
    setOpen(false)
    setTimeout(() => {
      const lenis = getLenis()
      const target = document.querySelector(href)
      if (lenis && target)
        lenis.scrollTo(target, { offset: -20, duration: 1.4 })
      else if (target) target.scrollIntoView({ behavior: 'smooth' })
    }, 450)
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden fixed right-5 z-[70] flex items-center gap-2 text-cream"
        style={{ top: 'max(env(safe-area-inset-top), 1.1rem)' }}
      >
        <span
          className="block w-1.5 h-1.5 rounded-full transition-colors duration-300"
          style={{ background: open ? '#D4A24C' : '#F4EEE0' }}
        />
        <span
          className="eyebrow text-[10px] transition-colors duration-300"
          style={{ color: open ? '#D4A24C' : '#F4EEE0' }}
        >
          {open ? 'Close' : 'Menu'}
        </span>
      </button>

      <div
        ref={scrim}
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-[2px]"
        style={{ display: 'none' }}
        aria-hidden
      />

      <aside
        ref={drawer}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className="fixed top-0 right-0 bottom-0 z-[65] w-[86vw] max-w-[380px] bg-ink border-l border-gold/25 shadow-[0_0_60px_-10px_rgba(0,0,0,0.6)] flex flex-col"
        style={{ display: 'none' }}
      >
        <div
          className="flex items-center justify-between px-6 border-b border-cream/10"
          style={{
            paddingTop: 'max(env(safe-area-inset-top), 1.25rem)',
            paddingBottom: '1.25rem'
          }}
        >
          <div className="serif text-lg tracking-wider">
            {property.name.split(' ')[0]}
            <span className="gold-text">.</span>
          </div>
          <div className="eyebrow text-[10px] text-cream/50">
            <span className="rule" />
            Mumbai
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {items.map(([label, href, num], i) => (
            <button
              key={href}
              type="button"
              data-drawer-item
              onClick={() => go(href)}
              className="group w-full text-left px-4 py-5 border-b border-cream/5 flex items-baseline gap-5 hover:bg-cream/[0.02] transition-colors"
            >
              <span className="eyebrow text-[10px] text-gold/70 tabular-nums min-w-[24px]">
                {num}
              </span>
              <span className="serif text-3xl sm:text-4xl text-cream group-hover:text-gold transition-colors duration-500">
                {label}
              </span>
              <span className="ml-auto text-gold/60 serif text-2xl translate-x-0 group-hover:translate-x-1 transition-transform duration-500">
                →
              </span>
            </button>
          ))}
        </nav>

        <div
          data-drawer-foot
          className="px-6 pt-5 border-t border-cream/10 space-y-2 text-[10px] uppercase tracking-[0.22em]"
          style={{
            paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)'
          }}
        >
          <div className="text-cream/35">Concierge</div>
          <a
            href={`tel:${property.contactPhone.replace(/\s/g, '')}`}
            className="block gold-text hover:text-goldSoft transition-colors"
          >
            {property.contactPhone}
          </a>
          <a
            href={`mailto:${property.contactEmail}`}
            className="block text-cream/70 hover:text-gold transition-colors break-all"
          >
            {property.contactEmail}
          </a>
          <div className="pt-2 text-cream/35">
            By Invitation Only
          </div>
        </div>
      </aside>
    </>
  )
}
