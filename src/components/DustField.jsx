import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../lib/scroll.js'

// Helical-orbit dust. Swarm radius bulges mid-scroll via sin(p·π).
export default function DustField({ count = 420 }) {
  const ref = useRef()

  const seed = useMemo(() => {
    const radii = new Float32Array(count)
    const phases = new Float32Array(count)
    const speeds = new Float32Array(count)
    const ySpeeds = new Float32Array(count)
    const yInits = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      radii[i]   = 2.5 + Math.random() * 6
      phases[i]  = Math.random() * Math.PI * 2
      speeds[i]  = (Math.random() < 0.5 ? 1 : -1) * (0.05 + Math.random() * 0.2)
      ySpeeds[i] = 0.06 + Math.random() * 0.22
      yInits[i]  = -6 + Math.random() * 18
    }
    return { radii, phases, speeds, ySpeeds, yInits }
  }, [count])

  const positions = useMemo(() => new Float32Array(count * 3), [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const p = scrollState.progress
    const radiusScale = 1 + Math.sin(p * Math.PI) * 0.4

    const arr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const phase = seed.phases[i] + t * seed.speeds[i]
      const r = seed.radii[i] * radiusScale
      arr[i * 3]     = Math.cos(phase) * r
      const y = seed.yInits[i] + t * seed.ySpeeds[i]
      arr[i * 3 + 1] = ((y + 8) % 16) - 8
      arr[i * 3 + 2] = Math.sin(phase) * r
    }
    ref.current.geometry.attributes.position.needsUpdate = true

    if (ref.current.material) {
      ref.current.material.opacity = 0.38 + p * 0.3
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
        size={0.045}
        color="#E8C974"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
