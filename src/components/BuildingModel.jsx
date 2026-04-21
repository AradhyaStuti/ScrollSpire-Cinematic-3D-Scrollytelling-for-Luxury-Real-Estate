import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../lib/scroll.js'

// Procedural stand-in for the client GLB — replace with useGLTF when
// the real asset lands.

const FLOORS = 42
const FLOOR_H = 0.36
const BASE_W = 3.2
const TAPER = 0.012

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export default function BuildingModel() {
  const group = useRef()
  const slabRefs = useRef([])
  const glassRefs = useRef([])
  const interiorRefs = useRef([])
  const pierRefs = useRef([])

  // Deterministic per-floor params — useMemo so the pattern is stable
  // across re-renders (random() would reshuffle on every HMR).
  const litPattern = useMemo(() => {
    const arr = new Array(FLOORS)
    for (let i = 0; i < FLOORS; i++) {
      arr[i] = {
        intensity: 0.3 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.4,
        warm: Math.random() > 0.5
      }
    }
    return arr
  }, [])

  const floors = useMemo(() => {
    const arr = []
    for (let i = 0; i < FLOORS; i++) {
      const w = BASE_W - i * TAPER
      const d = BASE_W - i * TAPER
      arr.push({ i, w, d, y: i * FLOOR_H })
    }
    return arr
  }, [])

  // Reused geometries — one BoxGeometry per kind, scaled per mesh.
  const slabGeom = useMemo(
    () => new THREE.BoxGeometry(1, FLOOR_H * 0.2, 1),
    []
  )
  const glassGeom = useMemo(
    () => new THREE.BoxGeometry(1, FLOOR_H * 0.74, 1),
    []
  )
  const interiorGeom = useMemo(
    () => new THREE.BoxGeometry(0.98, FLOOR_H * 0.6, 0.98),
    []
  )

  useFrame(({ clock }) => {
    const p = scrollState.progress
    const t = clock.getElapsedTime()

    if (group.current) {
      const idle = Math.sin(t * 0.15) * 0.04
      let yaw = p * Math.PI * 0.9 + idle
      if (p > 0.8) {
        // Extra 360° during the CTA scene.
        const k = (p - 0.8) / 0.2
        yaw += easeOutCubic(k) * Math.PI * 2
      }
      group.current.rotation.y = yaw
      group.current.position.y = THREE.MathUtils.lerp(
        -3.2,
        0,
        Math.min(p / 0.15, 1)
      )
    }

    const revealStart = 0.1
    const revealEnd = 0.4
    const revealT = THREE.MathUtils.clamp(
      (p - revealStart) / (revealEnd - revealStart),
      0,
      1
    )
    const built = revealT * FLOORS
    const solidness = THREE.MathUtils.clamp((p - 0.15) / 0.2, 0, 1)

    for (let i = 0; i < FLOORS; i++) {
      const slab = slabRefs.current[i]
      const glass = glassRefs.current[i]
      const interior = interiorRefs.current[i]
      if (!slab || !glass) continue

      const perFloor = THREE.MathUtils.clamp(built - i, 0, 1)
      const e = easeOutCubic(perFloor)

      slab.scale.y = e
      glass.scale.y = e
      const drop = (1 - e) * 0.9
      slab.position.y = floors[i].y + drop

      slab.material.opacity = e
      glass.material.opacity = 0.25 + 0.35 * e
      slab.material.wireframe = solidness < 0.4 && i > built - 3
      glass.material.wireframe = solidness < 0.4 && i > built - 3

      if (interior) {
        const litT = THREE.MathUtils.clamp(perFloor * 1.3 - 0.3, 0, 1)
        const pat = litPattern[i]
        // TODO: swap random() for a cheap noise function — some floors flicker
        // way more than others and it's actually kind of distracting
        const flicker =
          0.85 + Math.sin(t * pat.speed + pat.phase) * 0.15 +
          (Math.random() > 0.995 ? -0.4 : 0)
        interior.material.emissiveIntensity = litT * pat.intensity * flicker
        interior.scale.y = e
        interior.position.y = floors[i].y + drop
      }
    }

    // Piers need to track the build — otherwise four gold lines float
    // in mid-air before any floors have arrived.
    const pierFade = THREE.MathUtils.clamp((p - 0.12) / 0.18, 0, 1)
    for (let i = 0; i < pierRefs.current.length; i++) {
      const pier = pierRefs.current[i]
      if (!pier) continue
      pier.scale.y = pierFade
      pier.position.y = ((FLOORS * FLOOR_H) / 2) * pierFade
      pier.material.opacity = pierFade
      pier.material.emissiveIntensity = 0.45 * pierFade
    }
  })

  return (
    <group ref={group}>
      <mesh position={[0, -0.16, 0]} receiveShadow>
        <boxGeometry args={[BASE_W * 1.5, 0.3, BASE_W * 1.5]} />
        <meshStandardMaterial
          color="#14182B"
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[BASE_W * 1.5 + 0.02, 0.01, BASE_W * 1.5 + 0.02]} />
        <meshStandardMaterial
          color="#E7BB4A"
          emissive="#C9A84C"
          emissiveIntensity={1.2}
          metalness={1}
          roughness={0.25}
        />
      </mesh>

      {floors.map((f, i) => (
        <group key={i} position={[0, f.y, 0]}>
          <mesh
            ref={(el) => (slabRefs.current[i] = el)}
            geometry={slabGeom}
            scale={[f.w, 1, f.d]}
          >
            <meshStandardMaterial
              color="#1F1B12"
              metalness={0.25}
              roughness={0.75}
              transparent
              opacity={0}
            />
          </mesh>

          <mesh
            ref={(el) => (glassRefs.current[i] = el)}
            geometry={glassGeom}
            scale={[f.w * 0.94, 1, f.d * 0.94]}
            position={[0, FLOOR_H * 0.37, 0]}
          >
            <meshPhysicalMaterial
              color="#0A1128"
              metalness={0.1}
              roughness={0.02}
              transmission={0.9}
              thickness={0.3}
              ior={1.45}
              transparent
              opacity={0.55}
              envMapIntensity={1.4}
            />
          </mesh>

          {/* Interior mesh is toneMapped:false so the emissive actually blooms. */}
          <mesh
            ref={(el) => (interiorRefs.current[i] = el)}
            geometry={interiorGeom}
            scale={[f.w * 0.9, 1, f.d * 0.9]}
            position={[0, FLOOR_H * 0.35, 0]}
          >
            <meshStandardMaterial
              color="#1A1308"
              emissive={litPattern[i].warm ? '#FFB466' : '#E7D28A'}
              emissiveIntensity={0}
              toneMapped={false}
            />
          </mesh>

          {i % 6 === 0 && i > 0 && (
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[f.w + 0.02, FLOOR_H * 0.06, f.d + 0.02]} />
              <meshStandardMaterial
                color="#E7BB4A"
                emissive="#C9A84C"
                emissiveIntensity={1.4}
                metalness={1}
                roughness={0.3}
                toneMapped={false}
              />
            </mesh>
          )}
        </group>
      ))}

      {[-1, 1].flatMap((sx, ai) =>
        [-1, 1].map((sz, bi) => {
          const wBase = BASE_W * 0.94
          const idx = ai * 2 + bi
          return (
            <mesh
              key={`pier-${sx}-${sz}`}
              ref={(el) => (pierRefs.current[idx] = el)}
              position={[sx * (wBase / 2), 0, sz * (wBase / 2)]}
              scale={[1, 0, 1]}
            >
              <boxGeometry args={[0.05, FLOORS * FLOOR_H, 0.05]} />
              <meshStandardMaterial
                color="#E7BB4A"
                emissive="#C9A84C"
                emissiveIntensity={0}
                metalness={1}
                roughness={0.3}
                transparent
                opacity={0}
              />
            </mesh>
          )
        })
      )}

      <ChhatriCrown y={FLOORS * FLOOR_H + 0.05} />
      <AviationLight y={FLOORS * FLOOR_H + 1.85} />
    </group>
  )
}

function ChhatriCrown({ y }) {
  const domeRef = useRef()
  const kalashRef = useRef()

  useFrame(({ clock }) => {
    const p = scrollState.progress
    const t = clock.getElapsedTime()
    const show = THREE.MathUtils.clamp((p - 0.18) / 0.2, 0, 1)
    if (domeRef.current) {
      domeRef.current.scale.setScalar(show)
    }
    if (kalashRef.current) {
      const glow =
        p > 0.8
          ? 2.8 + Math.sin(t * 2) * 0.6
          : 2.2 + Math.sin(t * 0.9) * 0.2
      kalashRef.current.material.emissiveIntensity = glow
    }
  })

  const pillars = []
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const r = 0.58
    pillars.push(
      <mesh key={i} position={[Math.cos(a) * r, 0.22, Math.sin(a) * r]}>
        <cylinderGeometry args={[0.025, 0.025, 0.36, 8]} />
        <meshStandardMaterial
          color="#E8C974"
          metalness={1}
          roughness={0.25}
          emissive="#D4A24C"
          emissiveIntensity={0.6}
          toneMapped={false}
        />
      </mesh>
    )
  }

  return (
    <group ref={domeRef} position={[0, y, 0]}>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.66, 0.78, 0.12, 20]} />
        <meshStandardMaterial color="#1F1B12" metalness={0.4} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.125, 0]}>
        <torusGeometry args={[0.68, 0.01, 6, 32]} />
        <meshStandardMaterial
          color="#D4A24C"
          metalness={1}
          roughness={0.25}
          emissive="#D4A24C"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {pillars}

      <mesh position={[0, 0.42, 0]} castShadow>
        <sphereGeometry
          args={[0.56, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          color="#E8C974"
          metalness={1}
          roughness={0.22}
          emissive="#D4A24C"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.56, 0.02, 8, 32]} />
        <meshStandardMaterial
          color="#A07828"
          metalness={1}
          roughness={0.35}
          emissive="#A07828"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Amlaka (ribbed collar). */}
      <mesh position={[0, 1.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.14, 0.045, 10, 24]} />
        <meshStandardMaterial
          color="#E8C974"
          metalness={1}
          roughness={0.3}
          emissive="#D4A24C"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.18, 8]} />
        <meshStandardMaterial
          color="#E8C974"
          metalness={1}
          roughness={0.22}
          emissive="#D4A24C"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={kalashRef} position={[0, 1.32, 0]}>
        <sphereGeometry args={[0.095, 14, 14]} />
        <meshStandardMaterial
          color="#FFD27A"
          metalness={1}
          roughness={0.15}
          emissive="#E8C974"
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 1.52, 0]}>
        <coneGeometry args={[0.045, 0.26, 10]} />
        <meshStandardMaterial
          color="#FFD27A"
          metalness={1}
          roughness={0.15}
          emissive="#E8C974"
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function AviationLight({ y }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.material.emissiveIntensity =
      Math.max(0, Math.sin(t * 1.6)) * 2.5
  })
  return (
    <mesh ref={ref} position={[0, y, 0]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial
        color="#FF4B4B"
        emissive="#FF2222"
        emissiveIntensity={0}
        toneMapped={false}
      />
    </mesh>
  )
}
