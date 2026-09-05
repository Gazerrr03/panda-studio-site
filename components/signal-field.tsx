'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { useTheme } from '@/components/theme-switcher';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMotion;
  uniform float uPointScale;
  attribute float aSeed;
  varying float vAlpha;
  varying float vLight;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.54;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(13.17, 9.41);
      amplitude *= 0.48;
    }
    return value;
  }

  float crater(vec2 point, vec2 center, float radius) {
    float d = length((point - center) / radius);
    return 1.0 - smoothstep(0.28, 1.0, d);
  }

  void main() {
    float time = uTime * 0.105 * uMotion;
    vec3 p = position;
    p.x += (aSeed - 0.5) * 0.038;
    p.z += (hash(vec2(aSeed * 91.7, position.x)) - 0.5) * 0.034;
    vec2 field = vec2(p.x, p.z);

    float terrain = fbm(field * vec2(0.34, 0.48) + vec2(time * 0.35, -time * 0.22));
    float detail = fbm(field * vec2(1.05, 1.28) + vec2(-time * 0.48, time * 0.29));
    float ridges = 1.0 - abs(noise(vec2(p.x * 0.72 - time * 0.26, p.z * 0.55)) * 2.0 - 1.0);

    float rear = smoothstep(0.02, 0.94, p.z / 3.3);
    float column = pow(noise(vec2(p.x * 1.12 + time * 0.22, 4.7)), 6.0);
    float spectralLift = column * rear * (0.42 + 0.58 * noise(vec2(p.x * 2.7, time + 2.4)));
    p.y = (terrain - 0.51) * 2.85 + (detail - 0.5) * 0.64;
    p.y += ridges * 0.42 + spectralLift * 2.35;
    p.y += (hash(vec2(aSeed * 37.1, position.z * 11.3)) - 0.5) * 0.2;

    vec2 drift = vec2(sin(time * 0.21), cos(time * 0.17)) * 0.18;
    float pitA = crater(field, vec2(-2.45, -0.35) + drift, 0.88);
    float pitB = crater(field, vec2(0.55, 0.25) - drift * 0.7, 0.72);
    float pitC = crater(field, vec2(2.7, -0.85) + drift.yx * 0.55, 0.92);
    float pitD = crater(field, vec2(-0.25, 1.55) - drift * 0.45, 0.58);
    float pits = max(max(pitA, pitB), max(pitC, pitD));
    p.y -= pits * 1.25;

    float edgeNoise = fbm(vec2(p.x * 0.39 + 6.2, time * 0.16 + 1.8));
    float frontEdge = -5.8 + (edgeNoise - 0.5) * 1.55;
    float rearEdge = 3.02 - (noise(vec2(p.x * 0.31 - 3.8, time * 0.13)) - 0.5) * 0.8;
    float edgeMask = smoothstep(frontEdge, frontEdge + 0.34, p.z);
    edgeMask *= 1.0 - smoothstep(rearEdge - 0.3, rearEdge, p.z);
    float sideMask = 1.0 - smoothstep(8.55, 9.2, abs(p.x));
    float holeMask = 1.0 - smoothstep(0.34, 0.88, pits);
    float looseGrain = step(0.045 + (1.0 - edgeMask) * 0.36, aSeed);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = clamp(uPointScale / max(4.0, -mvPosition.z), 1.0, 2.7);

    float heightLight = smoothstep(-0.55, 0.8, p.y);
    float depthLight = mix(0.52, 1.0, smoothstep(-3.3, 2.6, p.z));
    vLight = (0.37 + heightLight * 0.58) * depthLight;
    vLight *= 0.74 + aSeed * 0.35;
    vAlpha = edgeMask * sideMask * holeMask * looseGrain;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uLightTheme;
  varying float vAlpha;
  varying float vLight;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float grain = 1.0 - smoothstep(0.34, 0.52, length(point));
    float alpha = grain * vAlpha;
    if (alpha < 0.025) discard;
    vec3 silver = mix(vec3(0.42), vec3(0.88), clamp(vLight, 0.0, 1.0));
    vec3 graphite = mix(vec3(0.37, 0.42, 0.36), vec3(0.15, 0.23, 0.20), clamp(vLight, 0.0, 1.0));
    gl_FragColor = vec4(mix(silver, graphite, uLightTheme), alpha * mix(0.56, 0.48, uLightTheme));
  }
`;

function PointSurface() {
  const theme = useTheme();
  const material = useRef<THREE.ShaderMaterial>(null);
  const { camera, size } = useThree();
  const geometry = useMemo(() => {
    const columns = 600;
    const rows = 360;
    const positions = new Float32Array(columns * rows * 3);
    const seeds = new Float32Array(columns * rows);
    let vertex = 0;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const offset = vertex * 3;
        positions[offset] = (column / (columns - 1) - 0.5) * 18.4;
        positions[offset + 1] = 0;
        positions[offset + 2] = -6.2 + (row / (rows - 1)) * 9.6;
        seeds[vertex] = Math.abs(Math.sin(vertex * 12.9898) * 43758.5453) % 1;
        vertex += 1;
      }
    }

    const points = new THREE.BufferGeometry();
    points.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    points.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    return points;
  }, []);

  useFrame((state) => {
    camera.position.set(0, size.width < 760 ? 4.9 : 4.35, size.width < 760 ? 9.8 : 8.0);
    camera.lookAt(0, size.width < 760 ? -0.45 : -0.25, 0);
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points
      geometry={geometry}
      position={[0, size.width < 760 ? -0.6 : -0.95, 0]}
      frustumCulled={false}
    >
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        uniforms={{
          uTime: { value: 0 },
          uLightTheme: { value: theme === 'light' ? 1 : 0 },
          uMotion: {
            value:
              typeof window !== 'undefined' &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 0
                : 1,
          },
          uPointScale: { value: 18 },
        }}
      />
    </points>
  );
}

export function SignalField() {
  const theme = useTheme();
  return (
    <Canvas
      className="signal-field"
      dpr={[1, 1.35]}
      fallback={<div className="signal-field signal-field-fallback" aria-hidden="true" />}
      camera={{ position: [0, 4.35, 8], fov: 42, near: 0.1, far: 30 }}
      gl={{ alpha: false, antialias: false, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <color attach="background" args={[theme === 'light' ? '#f5f4ef' : '#111210']} />
      <PointSurface />
    </Canvas>
  );
}
