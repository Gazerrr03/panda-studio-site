'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMotion;
  uniform vec2 uPointer;
  varying float vHeight;
  varying float vFade;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.55;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + 17.17;
      amplitude *= 0.48;
    }
    return value;
  }

  void main() {
    vec3 pos = position;
    float slowTime = uTime * 0.075 * uMotion;
    float broad = fbm(vec2(pos.x * 0.42 + slowTime, pos.z * 0.48 - slowTime));
    float detail = fbm(vec2(pos.x * 1.25 - slowTime, pos.z * 1.4 + slowTime * 0.6));
    float pointerWave = exp(-2.2 * distance(pos.xz * vec2(0.13, 0.22), uPointer)) * 0.34;
    float height = (broad - 0.48) * 2.25 + (detail - 0.5) * 0.42 + pointerWave;

    pos.y += height;
    pos.z += sin(pos.x * 0.8 + slowTime) * 0.1;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = clamp(4.8 / -mvPosition.z, 1.0, 2.35);

    vHeight = height;
    vFade = smoothstep(5.8, 1.2, -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vHeight;
  varying float vFade;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float alpha = 1.0 - smoothstep(0.16, 0.5, length(point));
    float brightness = 0.32 + smoothstep(-0.5, 0.9, vHeight) * 0.62;
    gl_FragColor = vec4(vec3(brightness), alpha * vFade * 0.78);
  }
`;

function ParticleField() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointerTarget = useRef(new THREE.Vector2());

  const positions = useMemo(() => {
    const columns = 250;
    const rows = 150;
    const data = new Float32Array(columns * rows * 3);
    let index = 0;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        data[index++] = (column / (columns - 1) - 0.5) * 11;
        data[index++] = 0;
        data[index++] = (row / (rows - 1) - 0.5) * 7;
      }
    }

    return data;
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.current.set(
        event.clientX / window.innerWidth - 0.5,
        0.5 - event.clientY / window.innerHeight,
      );
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    material.current.uniforms.uPointer.value.lerp(pointerTarget.current, 0.035);
  });

  return (
    <points rotation={[-0.63, 0, -0.04]} position={[0.35, -0.1, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uMotion: {
            value:
              typeof window !== 'undefined' &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 0
                : 1,
          },
          uPointer: { value: new THREE.Vector2() },
        }}
      />
    </points>
  );
}

export function SignalField() {
  return (
    <Canvas
      className="signal-field"
      camera={{ position: [0, 1.15, 5.4], fov: 48, near: 0.1, far: 20 }}
      dpr={[1, 1.45]}
      fallback={<div className="signal-field" aria-hidden="true" />}
      gl={{ alpha: false, antialias: false, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <color attach="background" args={['#111210']} />
      <ParticleField />
    </Canvas>
  );
}
