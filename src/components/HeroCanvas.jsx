import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  ContactShadows,
  MeshReflectorMaterial,
  Float,
  PerformanceMonitor
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing'
import * as THREE from 'three'
import BuildingModel from './BuildingModel.jsx'
import DustField from './DustField.jsx'
import StarField from './StarField.jsx'
import SkyDome from './SkyDome.jsx'
import SparkEmitter from './SparkEmitter.jsx'
import { scrollState } from '../lib/scroll.js'

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function CameraRig() {
  const target = useRef(new THREE.Vector3(0, 2, 0))
  const lerped = useRef({ x: 0, y: 3, z: 11, tY: 2 })
  const breath = useRef({ t: Math.random() * 1000 })

  useFrame(({ camera }, dt) => {
    const p = scrollState.progress
    let y, z, tY, orbit

    if (p < 0.1) {
      const k = p / 0.1
      y = THREE.MathUtils.lerp(3.2, 2.6, k)
      z = THREE.MathUtils.lerp(11, 10, k)
      tY = THREE.MathUtils.lerp(2, 2.5, k)
      orbit = k * 0.15
    } else if (p < 0.3) {
      const k = easeInOutCubic((p - 0.1) / 0.2)
      y = THREE.MathUtils.lerp(2.6, 4, k)
      z = THREE.MathUtils.lerp(10, 8.5, k)
      tY = THREE.MathUtils.lerp(2.5, 4, k)
      orbit = 0.15 + k * 0.6
    } else if (p < 0.7) {
      const k = (p - 0.3) / 0.4
      const wave = Math.sin(k * Math.PI * 1.5)
      y = THREE.MathUtils.lerp(6, 10, k) + wave * 1.2
      z = THREE.MathUtils.lerp(6.5, 5.2, k)
      tY = THREE.MathUtils.lerp(4, 8, k)
      orbit = 0.75 + k * 1.1
    } else if (p < 0.85) {
      const k = easeInOutCubic((p - 0.7) / 0.15)
      y = THREE.MathUtils.lerp(10, 6, k)
      z = THREE.MathUtils.lerp(5.2, 12, k)
      tY = THREE.MathUtils.lerp(8, 5, k)
      orbit = 1.85 + k * 0.4
    } else {
      const k = easeInOutCubic((p - 0.85) / 0.15)
      y = THREE.MathUtils.lerp(6, 4.5, k)
      z = THREE.MathUtils.lerp(12, 9, k)
      tY = THREE.MathUtils.lerp(5, 4, k)
      orbit = 2.25 + k * 0.1
    }

    breath.current.t += dt
    const bt = breath.current.t
    const breathX = Math.sin(bt * 0.45) * 0.09 + Math.sin(bt * 1.13) * 0.03
    const breathY = Math.sin(bt * 0.37) * 0.06 + Math.sin(bt * 1.4) * 0.02
    const breathTilt = Math.sin(bt * 0.5) * 0.01

    const targetX = Math.sin(orbit) * z + breathX
    const targetZ = Math.cos(orbit) * z
    const targetY = y + breathY

    // Dt-normalized lerp coefficient — stable across 60/120hz.
    const smooth = 1 - Math.pow(0.001, dt)
    lerped.current.x  += (targetX - lerped.current.x)  * smooth
    lerped.current.y  += (targetY - lerped.current.y)  * smooth
    lerped.current.z  += (targetZ - lerped.current.z)  * smooth
    lerped.current.tY += (tY      - lerped.current.tY) * smooth

    camera.position.set(
      lerped.current.x,
      lerped.current.y,
      lerped.current.z
    )
    camera.rotation.z = breathTilt
    target.current.set(0, lerped.current.tY, 0)
    camera.lookAt(target.current)
  })

  return null
}

function CTAGlow() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const p = scrollState.progress
    const pulse = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 1.8)
    const base = p > 0.8 ? 2.4 + pulse * 1.6 : 0.4 + p * 0.5
    ref.current.intensity = base
  })
  return (
    <pointLight
      ref={ref}
      position={[0, 5, -3]}
      color="#D4A24C"
      intensity={0.5}
      distance={24}
      decay={1.6}
    />
  )
}

function GodRay() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const p = scrollState.progress
    const base = 0.12 + p * 0.15
    ref.current.material.opacity = base + Math.sin(t * 0.6) * 0.05
    ref.current.rotation.y = t * 0.05
  })
  return (
    <mesh ref={ref} position={[0, 10, -4]}>
      <coneGeometry args={[4, 14, 32, 1, true]} />
      <meshBasicMaterial
        color="#D4A24C"
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function FogDriver() {
  const { scene } = useThree()
  useFrame(() => {
    if (!scene.fog) return
    const p = scrollState.progress
    const near = THREE.MathUtils.lerp(16, 22, Math.min(p * 1.6, 1))
    const far  = THREE.MathUtils.lerp(34, 54, Math.min(p * 1.6, 1))
    scene.fog.near = near
    scene.fog.far = far
  })
  return null
}

function BloomController({ bloomRef, mobile }) {
  useFrame(() => {
    if (!bloomRef.current) return
    const p = scrollState.progress
    const base = mobile ? 0.55 : 0.8
    const boost = p < 0.3 ? 0.05 : (p - 0.3) * 0.9
    bloomRef.current.intensity = base + boost
  })
  return null
}

function Ground({ mobile }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.32, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <MeshReflectorMaterial
        blur={[mobile ? 200 : 400, mobile ? 50 : 100]}
        resolution={mobile ? 256 : 1024}
        mixBlur={1}
        mixStrength={mobile ? 1.2 : 1.8}
        roughness={0.85}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0B1020"
        metalness={0.55}
        mirror={mobile ? 0.35 : 0.55}
      />
    </mesh>
  )
}

export default function HeroCanvas() {
  // Captured once at mount — orientation changes don't promote a phone to full fx.
  const [mobile] = React.useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
  )
  const [dpr, setDpr] = React.useState(mobile ? 1 : 1.25)
  const bloomRef = useRef()

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('[canvas] mobile =', mobile, 'starting dpr =', dpr)
  }

  return (
    <Canvas
      dpr={dpr}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping
      }}
      camera={{ position: [0, 3, 11], fov: 35, near: 0.1, far: 100 }}
    >
      <fog attach="fog" args={['#0A0E1F', 16, 42]} />

      {/* TODO: debounce this — saw DPR thrashing on a 2019 MBP under heavy tabs */}
      <PerformanceMonitor
        onIncline={() =>
          setDpr(Math.min(window.devicePixelRatio, mobile ? 1.25 : 2))
        }
        onDecline={() => setDpr(1)}
      />

      <ambientLight intensity={0.32} color="#FFE0B0" />
      <directionalLight
        position={[8, 14, 6]}
        intensity={1.5}
        color="#FFC170"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight
        position={[-8, 5, 6]}
        intensity={0.7}
        color="#C94A3A"
        distance={34}
      />
      <pointLight
        position={[0, 12, -8]}
        intensity={0.5}
        color="#7EA8D4"
        distance={30}
      />
      <CTAGlow />

      <Suspense fallback={null}>
        <SkyDome />
        <StarField count={mobile ? 450 : 900} />
        <Environment preset="night" background={false} />
        <GodRay />
        <Float speed={0.6} rotationIntensity={0} floatIntensity={0.08}>
          <BuildingModel />
        </Float>
        <SparkEmitter origin={[0, 16.4, 0]} count={mobile ? 40 : 80} />
        {!mobile && <DustField />}
        <Ground mobile={mobile} />
        {!mobile && (
          <ContactShadows
            position={[0, -0.31, 0]}
            opacity={0.55}
            scale={22}
            blur={2.6}
            far={12}
            color="#000"
          />
        )}
      </Suspense>

      <CameraRig />
      <FogDriver />
      <BloomController bloomRef={bloomRef} mobile={mobile} />

      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom
          ref={bloomRef}
          intensity={mobile ? 0.6 : 0.9}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.35}
          mipmapBlur
          radius={mobile ? 0.6 : 0.85}
        />
        <Vignette eskil={false} offset={0.25} darkness={0.9} />
        {!mobile && <SMAA />}
      </EffectComposer>
    </Canvas>
  )
}
