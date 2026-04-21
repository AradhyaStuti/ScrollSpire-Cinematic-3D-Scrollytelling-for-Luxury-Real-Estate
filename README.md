
# ScrollSpire

Most luxury real estate sites feel like scrolling through a PDF.
ScrollSpire tries to break that pattern.

It’s a cinematic, scroll-driven landing page where a 3D tower gradually reveals itself—floor by floor—as you move down the page.

The demo property, **Kohinoor Heights**, is fictional. The focus here isn’t the listing—it’s the experience.

---

## Getting Started

```bash
npm install
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)
Use `--host` if you want to test it on your phone over the same network.

---

## How the experience flows

One continuous scroll, split into six chapters:

* **0–9% · Prologue**
  Intro reveal with a curtain-style loader

* **9–26% · The Rise**
  Camera orbits while floors build up dynamically

* **26–60% · The Tour**
  Smooth flythrough of key amenities

* **60–74% · The Lifestyle**
  Visual transition with testimonial overlay

* **74–86% · The Craft**
  Materials and design details

* **86–100% · The Address**
  Final rotation + CTA

---

## Under the hood

The building is fully procedural—no pre-made 3D model.

Each floor is generated and animated based on a shared scroll value. Instead of relying on React state, scroll progress is stored in a simple mutable object that both animation (GSAP) and rendering (Three.js) can read directly. This avoids unnecessary re-renders and keeps things smooth.

Lenis handles scrolling, GSAP handles timing, and both stay in sync through a lightweight bridge.

One detail I liked refining:
the hero text starts animating *as the loader opens*, not after. It makes the transition feel more connected.

---

## Stack

* Vite + React
* Three.js (via React Three Fiber)
* GSAP + ScrollTrigger
* Lenis (smooth scrolling)
* Tailwind CSS

No SSR—this is built as a front-end experience first.

---

## If you want to adapt it

* Replace static data with a CMS (e.g., Sanity)
* Swap procedural model with a real `.glb` if needed
* Upgrade images to video for richer sections
* Connect the form to an API or service like Formspree

---

## Things to improve

* Camera angles during the tour could be smoother
* Performance on older mobile devices still needs tuning
* Resize handling for scroll sections isn’t perfect yet
* Lighting flicker is random—could be more controlled
* Form isn’t wired to a backend
* Mobile navigation needs better accessibility (focus handling)
