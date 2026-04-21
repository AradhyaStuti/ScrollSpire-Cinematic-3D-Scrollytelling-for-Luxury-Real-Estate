import React, { useEffect, useRef } from 'react'

export default function MagneticButton({ children, strength = 0.35, ...rest }) {
  const wrap = useRef()
  const inner = useRef()

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let raf
    const state = { x: 0, y: 0, tx: 0, ty: 0 }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      state.tx = (e.clientX - cx) * strength
      state.ty = (e.clientY - cy) * strength
    }
    const onLeave = () => {
      state.tx = 0
      state.ty = 0
    }
    const tick = () => {
      state.x += (state.tx - state.x) * 0.18
      state.y += (state.ty - state.y) * 0.18
      if (inner.current) {
        inner.current.style.transform = `translate(${state.x}px, ${state.y}px)`
      }
      raf = requestAnimationFrame(tick)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  return (
    <span ref={wrap} className="inline-block" {...rest}>
      <span ref={inner} className="inline-block will-change-transform">
        {children}
      </span>
    </span>
  )
}
