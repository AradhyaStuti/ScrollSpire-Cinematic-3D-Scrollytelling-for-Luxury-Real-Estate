import React, { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dot = useRef()
  const ring = useRef()
  const label = useRef()
  const state = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    scale: 1,
    targetScale: 1,
    text: ''
  })

  useEffect(() => {
    const hasFinePointer =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!hasFinePointer) {
      if (dot.current) dot.current.style.display = 'none'
      if (ring.current) ring.current.style.display = 'none'
      if (label.current) label.current.style.display = 'none'
      return
    }

    document.body.classList.add('has-custom-cursor')

    const onMove = (e) => {
      state.current.tx = e.clientX
      state.current.ty = e.clientY
      if (dot.current) {
        dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      }
    }

    const onOver = (e) => {
      const interactive = e.target.closest(
        'a, button, input, textarea, [data-cursor]'
      )
      state.current.targetScale = interactive ? 2.4 : 1

      let newText = ''
      if (interactive) {
        const labelled = e.target.closest('[data-cursor-text]')
        if (labelled) newText = labelled.dataset.cursorText
      }
      if (newText !== state.current.text) {
        state.current.text = newText
        if (label.current) {
          label.current.textContent = newText
          label.current.style.opacity = newText ? '1' : '0'
        }
      }
    }

    const onDown = () => (state.current.targetScale = 0.75)
    const onUp = () => (state.current.targetScale = 1)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    let raf
    const tick = () => {
      const s = state.current
      s.x += (s.tx - s.x) * 0.18
      s.y += (s.ty - s.y) * 0.18
      s.scale += (s.targetScale - s.scale) * 0.14
      if (ring.current) {
        ring.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%) scale(${s.scale})`
      }
      if (label.current) {
        label.current.style.transform = `translate3d(${s.x + 28}px, ${s.y}px, 0) translateY(-50%)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  return (
    <>
      <div
        ref={ring}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-gold pointer-events-none z-[90]"
        style={{ transition: 'opacity 0.3s ease', mixBlendMode: 'difference' }}
      />
      <div
        ref={dot}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-gold pointer-events-none z-[91]"
      />
      <div
        ref={label}
        className="fixed top-0 left-0 pointer-events-none z-[91] text-[10px] tracking-[0.22em] uppercase text-gold whitespace-nowrap"
        style={{ opacity: 0, transition: 'opacity 0.25s ease' }}
      />
    </>
  )
}
