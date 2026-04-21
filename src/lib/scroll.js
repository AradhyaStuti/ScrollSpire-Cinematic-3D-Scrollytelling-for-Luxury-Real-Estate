import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis
let tickerFn

// Mutable store read by useFrame + scroll-driven GSAP without triggering
// a React re-render every frame.
export const scrollState = { progress: 0 }

export function initScroll() {
  if (lenis) return lenis

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  lenis = new Lenis({
    duration: reduce ? 0.1 : 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reduce
  })

  lenis.on('scroll', (e) => {
    ScrollTrigger.update()
    const max = document.documentElement.scrollHeight - window.innerHeight
    scrollState.progress = max > 0 ? e.scroll / max : 0
  })

  // Track the ticker fn so we can remove it — StrictMode double-invokes
  // effects, and a stacked ticker subscription made the building rotate
  // at 2x speed in dev (fine in prod). Took an evening to find.
  tickerFn = (time) => {
    if (lenis) lenis.raf(time * 1000)
  }
  gsap.ticker.add(tickerFn)
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function getLenis() {
  return lenis
}

export function destroyScroll() {
  if (tickerFn) {
    gsap.ticker.remove(tickerFn)
    tickerFn = null
  }
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
  ScrollTrigger.getAll().forEach((t) => t.kill())
}
