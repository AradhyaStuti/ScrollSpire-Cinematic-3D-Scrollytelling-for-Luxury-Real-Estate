import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../lib/scroll.js'

// phi bias keeps stars in the upper hemisphere — otherwise the mirror
// ground doubles them and it looks wrong.
export default function StarField({ count = 900 }) {
  const ref = useRef()

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const r = 38 + Math.random() * 8
      const phi = Math.acos(1 - Math.random() * 1.35) // bias upper hemisphere
      const theta = Math.random() * Math.PI * 2
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.cos(phi) + 3
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      sz[i] = 0.04 + Math.random() * 0.16
    }
    return { positions: pos, sizes: sz }
  }, [count])

  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 0.008
    ref.current.material.opacity = 0.4 + scrollState.progress * 0.45
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
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#FFE0B0"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}
