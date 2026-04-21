# ScrollSpire

Most luxury real-estate websites are a 14-page PDF with a scrollbar.
ScrollSpire is an attempt at something else: a cinematic, scroll-driven
landing page with a procedurally-built 3D tower that reveals itself floor
by floor as you scroll.

Demo property is **Kohinoor Heights** — a fictional 48-storey tower on
Worli Sea Face, Mumbai. The content is invented; the code is the point.

## Run it

```
npm install
npm run dev
```

Then http://localhost:5173. Add `--host` to the dev command if you want to see it
on your phone over the LAN.

## The scene map

Six chapters, one long scroll, no page loads.

| Scroll | Chapter | What happens |
|---|---|---|
| 0–9% | Prologue · The Arrival | Hero title fades in through the loader curtain |
| 9–26% | I · The Rise | Camera orbits as 48 floors stack up, wireframe → solid |
| 26–60% | II · The Tour | Dive sweep through four pinned amenities |
| 60–74% | III · The Lifestyle | Clip-path wipe + testimonial card |
| 74–86% | IV · The Craft | Materials gallery + credits |
| 86–100% | V · The Address | 360° spin, gold glow, viewing form |

## What's actually going on

The tower isn't a GLB — it's 42 procedural floors plus a chhatri-dome crown
(hemisphere + amlaka ring + kalash finial), each mesh animated per-frame against a
shared `scrollState.progress` that Lenis populates from real scroll position.

`src/lib/scroll.js` is the spine. Lenis drives it, `ScrollTrigger.update()`
piggybacks on every Lenis tick, and `scrollState` is a plain mutable object that
both GSAP and R3F read. No context provider, no re-renders — the 3D scene reads
scroll progress without React ever knowing a scroll happened.

The loader-to-hero handoff is the bit I'm happiest with. `onReveal` fires when the
curtains *start* parting, not when they finish — so the hero text animates in
*through* the curtain, not after it.

## The bug that took an evening

In dev, the tower rotated at roughly 2× the intended rate; in production builds
it was fine. Turned out React StrictMode was double-invoking the effect that
registered Lenis's RAF callback on `gsap.ticker`, and my original cleanup only
killed the Lenis instance, not the ticker listener. Every StrictMode remount
was stacking another ticker subscriber. Fix in `src/lib/scroll.js`: store the
callback in a module-level `tickerFn` and call `gsap.ticker.remove(tickerFn)`
in `destroyScroll()`. Obvious in retrospect, two hours at the time.

## Stack

Vite + React, Three.js via `@react-three/fiber`, drei for helpers,
`@react-three/postprocessing` for bloom, GSAP ScrollTrigger, Lenis, Tailwind.

No Next.js. Fast HMR was the priority; SSR wasn't worth the friction for a
portfolio piece. Swap to Next if you need the SEO.

## Swap for production

- `src/data/property.js` → GROQ fetch from Sanity
- `BuildingModel.jsx` → `useGLTF('/models/building.glb')`
- Amenity/lifestyle `<img>` → Mux or Cloudinary video
- `CTASection` `onSubmit` is a stub with a setTimeout; wire it to `/api/contact`
  with Resend, or drop in a Formspree endpoint for zero-backend

## Known rough edges

- Camera yaw during the Tour wraps a touch tight — amenity #4 can get a weird framing
- Mobile perf is guarded (fewer particles, smaller reflector, DPR capped) but the
  spark emitter still costs a few frames on older Android
- `SectionDivider` is decorative; once the chapter rail is visible on desktop it's
  redundant
- Amenity ScrollTriggers capture `window.innerHeight` at creation time — resizing
  mid-section drifts the card boundaries. Fix is `ScrollTrigger.refresh()` on
  resize but it flashes the cards. Haven't solved that yet
- Interior-light flicker uses `Math.random()` per frame per floor. Some floors
  strobe in a distracting way, want to swap for a cheap noise fn
- Form posts nowhere. It's a `setTimeout` stub. See `CTASection.jsx`
- Drawer nav doesn't focus-trap — tabbing out lands on the hidden desktop nav

If you're poking around the code, the files worth reading first are
`HeroCanvas.jsx` (camera + post-fx), `BuildingModel.jsx` (the procedural tower),
and `lib/scroll.js` (the tiny Lenis↔GSAP bridge that makes everything else
possible).
