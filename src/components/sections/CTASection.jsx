import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitChars } from '../../lib/splitChars.jsx'
import { property } from '../../data/property.js'
import MagneticButton from '../MagneticButton.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CTASection() {
  const root = useRef()
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'
  const [form, setForm] = useState({ name: '', email: '', phone: '', note: '' })
  const [touched, setTouched] = useState({})

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-cta-eyebrow]', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%' }
      })

      gsap.from('[data-cta-headline] .split-char', {
        y: 90,
        opacity: 0,
        stagger: 0.03,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' }
      })

      gsap.from('[data-cta-form] > *', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 55%' }
      })

      gsap.from('[data-cta-footer]', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-cta-footer]', start: 'top 95%' }
      })
    }, root)

    return () => ctx.revert()
  }, [])

  const update = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))
  const touch = (k) => () => setTouched((t) => ({ ...t, [k]: true }))

  const errors = {
    name: !form.name.trim() ? 'Please enter your name.' : '',
    email: !form.email.trim()
      ? 'Please enter your email.'
      : !EMAIL_RE.test(form.email.trim())
      ? 'Please enter a valid email.'
      : ''
  }
  const isValid = !errors.name && !errors.email

  const onSubmit = async (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true, phone: true, note: true })
    if (!isValid) return
    setStatus('sending')
    // TODO: replace with POST /api/contact (Resend / SendGrid / Formspree).
    await new Promise((r) => setTimeout(r, 950))
    setStatus('sent')
  }

  const sent = status === 'sent'
  const sending = status === 'sending'

  return (
    <section
      ref={root}
      className="relative h-[150vh]"
      data-section="cta"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full px-6 sm:px-8 text-center">
          <div data-cta-eyebrow className="eyebrow mb-6 sm:mb-8">
            <span className="rule" />
            <span className="hidden sm:inline">Private Viewings · </span>
            By Invitation Only
          </div>

          <h2
            data-cta-headline
            className="serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-cream"
          >
            <SplitChars text={property.ctaHeadline} />
          </h2>

          {sent ? (
            <div className="mt-10 sm:mt-14 text-cream/80">
              <p className="serif text-xl sm:text-2xl gold-text mb-3">
                Your request has been received.
              </p>
              <p className="text-sm text-cream/60">
                Our concierge will be in touch within one business day.
              </p>
            </div>
          ) : (
            <form
              data-cta-form
              onSubmit={onSubmit}
              noValidate
              className="mt-10 sm:mt-14 space-y-5 sm:space-y-6 text-left"
            >
              <Field
                label="Full name"
                type="text"
                value={form.name}
                onChange={update('name')}
                onBlur={touch('name')}
                error={touched.name && errors.name}
                autoComplete="name"
              />
              <Field
                label="Email address"
                type="email"
                value={form.email}
                onChange={update('email')}
                onBlur={touch('email')}
                error={touched.email && errors.email}
                autoComplete="email"
              />
              <Field
                label="Contact number (optional)"
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                onBlur={touch('phone')}
                autoComplete="tel"
              />
              <div>
                <textarea
                  rows={3}
                  placeholder="Tell us what you're looking for"
                  value={form.note}
                  onChange={update('note')}
                  className="cta-input resize-none"
                />
              </div>
              <div className="pt-6 text-center">
                <MagneticButton>
                  <button
                    type="submit"
                    disabled={sending}
                    className="gold-btn disabled:opacity-60 disabled:cursor-not-allowed"
                    data-cursor
                    data-cursor-text={sending ? 'Sending' : 'Submit'}
                  >
                    {sending ? 'Submitting…' : 'Request Viewing'}
                  </button>
                </MagneticButton>
              </div>
            </form>
          )}

          <div
            data-cta-footer
            className="mt-12 sm:mt-20 space-y-2 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-cream/45 break-all sm:break-normal"
          >
            <div>
              <a
                href={`mailto:${property.contactEmail}`}
                className="hover:text-gold transition-colors"
                data-cursor
              >
                {property.contactEmail}
              </a>
            </div>
            <div>
              <a
                href={`tel:${property.contactPhone.replace(/\s/g, '')}`}
                className="hover:text-gold transition-colors"
                data-cursor
              >
                {property.contactPhone}
              </a>
            </div>
            <div className="pt-2 text-cream/35">
              {property.location} · {property.state}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, error, ...rest }) {
  return (
    <div>
      <input
        placeholder={label}
        {...rest}
        className="cta-input"
        data-cursor
        aria-invalid={!!error}
      />
      <div
        className="mt-1 h-4 text-[10px] tracking-[0.18em] uppercase transition-colors"
        style={{ color: error ? '#C94A3A' : 'transparent' }}
      >
        {error || '·'}
      </div>
    </div>
  )
}
