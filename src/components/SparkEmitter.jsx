import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../lib/scroll.js'

// Looping particles around a fixed origin. visibility is scroll-driven
// so the emitter is mostly dormant until the user reaches the CTA.
export default function SparkEmitter({ origin = [0, 17, 0], count = 80 }) {
  const ref = useRef()

  const seed = useMemo(() => {
    const lives = new Float32Array(count)
    const offsets = new Float32Array(count)
    const radii = new Float32Array(count)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      lives[i] = Math.random()
      offsets[i] = Math.random() * Math.PI * 2
      radii[i] = Math.random() * 0.35
      speeds[i] = 0.35 + Math.random() * 0.55
    }
    return { lives, offsets, radii, speeds }
  }, [count])

  const positions = useMemo(() => new Float32Array(count * 3), [count])

  useFrame((_, dt) => {
    if (!ref.current) return
    const p = scrollState.progress
    const visibility = THREE.MathUtils.clamp((p - 0.2) / 0.3, 0, 1)

    const arr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      seed.lives[i] += dt * seed.speeds[i] * 0.25
      if (seed.lives[i] > 1) seed.lives[i] -= 1
      const life = seed.lives[i]
      const wobble = Math.sin(life * Math.PI * 4 + seed.offsets[i]) * 0.08
      const spread = life * 0.9
      arr[i * 3]     = origin[0] + Math.cos(seed.offsets[i]) * (seed.radii[i] + spread) + wobble
      arr[i * 3 + 1] = origin[1] + life * 3.5
      arr[i * 3 + 2] = origin[2] + Math.sin(seed.offsets[i]) * (seed.radii[i] + spread) + wobble
    }
    ref.current.geometry.attributes.position.needsUpdate = true

    if (ref.current.material) {
      ref.current.material.opacity = visibility * 0.9
      ref.current.material.size = 0.04 + Math.sin(p * Math.PI) * 0.02
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#FFD27A"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}
