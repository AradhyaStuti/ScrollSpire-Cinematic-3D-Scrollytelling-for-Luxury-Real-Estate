import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../lib/scroll.js'

// Inverted sphere with a two-stop gradient shader. Colors lerp between
// four palette stops keyed to scroll progress.
export default function SkyDome() {
  const matRef = useRef()

  const uniforms = useMemo(
    () => ({
      uTop:     { value: new THREE.Color('#0A0E1F') },
      uMid:     { value: new THREE.Color('#1A1530') },
      uHorizon: { value: new THREE.Color('#3A1B22') },
      uProgress: { value: 0 }
    }),
    []
  )

  const palettes = useMemo(
    () => ({
      arrival: {
        top: new THREE.Color('#080B1A'),
        mid: new THREE.Color('#171D38'),
        horizon: new THREE.Color('#3A1E28')
      },
      rise: {
        top: new THREE.Color('#0A0E22'),
        mid: new THREE.Color('#1C1D3A'),
        horizon: new THREE.Color('#4A2C3E')
      },
      tour: {
        top: new THREE.Color('#0C1126'),
        mid: new THREE.Color('#1E1C3D'),
        horizon: new THREE.Color('#5C3C2E')
      },
      address: {
        top: new THREE.Color('#0A0C1E'),
        mid: new THREE.Color('#241C34'),
        horizon: new THREE.Color('#6B3E28')
      }
    }),
    []
  )

  const tmpTop = useMemo(() => new THREE.Color(), [])
  const tmpMid = useMemo(() => new THREE.Color(), [])
  const tmpHz  = useMemo(() => new THREE.Color(), [])

  useFrame(() => {
    const p = scrollState.progress
    let a, b, t
    if (p < 0.2) {
      a = palettes.arrival; b = palettes.rise; t = p / 0.2
    } else if (p < 0.6) {
      a = palettes.rise; b = palettes.tour; t = (p - 0.2) / 0.4
    } else {
      a = palettes.tour; b = palettes.address; t = (p - 0.6) / 0.4
    }
    tmpTop.copy(a.top).lerp(b.top, t)
    tmpMid.copy(a.mid).lerp(b.mid, t)
    tmpHz.copy(a.horizon).lerp(b.horizon, t)

    uniforms.uTop.value.copy(tmpTop)
    uniforms.uMid.value.copy(tmpMid)
    uniforms.uHorizon.value.copy(tmpHz)
    uniforms.uProgress.value = p
  })

  return (
    <mesh scale={[-1, 1, 1]}>
      {/* Inverted large sphere */}
      <sphereGeometry args={[55, 48, 32]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        vertexShader={`
          varying vec3 vWorld;
          void main() {
            vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uTop;
          uniform vec3 uMid;
          uniform vec3 uHorizon;
          varying vec3 vWorld;
          void main() {
            // Normalized vertical factor 0 (horizon) -> 1 (zenith)
            float h = clamp(vWorld.y / 40.0 + 0.25, 0.0, 1.0);
            vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.55, h));
            col = mix(col, uTop, smoothstep(0.55, 1.0, h));
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  )
}
