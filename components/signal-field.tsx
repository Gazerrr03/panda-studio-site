'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uMotion;
  uniform vec2 uPointer;
  uniform vec2 uResolution;
  varying vec2 vUv;

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
      p = p * 2.02 + 19.19;
      amplitude *= 0.48;
    }
    return value;
  }

  void main() {
    vec2 pixel = gl_FragCoord.xy;
    vec2 uv = pixel / uResolution;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    float time = uTime * 0.055 * uMotion;

    float broadWave = fbm(vec2(uv.x * 2.15 - time, 2.7 + time * 0.38));
    float longRhythm = sin(uv.x * 8.4 - time * 2.1) * 0.035;
    float shortRhythm = sin(uv.x * 19.0 + 1.6 + time * 1.4) * 0.016;
    float pointerLift = exp(-pow((uv.x - uPointer.x) * 5.2, 2.0)) * 0.13 * uMotion;
    float leftPeak = exp(-pow((uv.x - 0.15 + sin(time * 0.31) * 0.012) * 11.0, 2.0)) * 0.20;
    float mainPeak = exp(-pow((uv.x - 0.39 - sin(time * 0.52) * 0.022) * 11.5, 2.0)) * 0.40;
    float secondPeak = exp(-pow((uv.x - 0.62 + sin(time * 0.37) * 0.016) * 14.0, 2.0)) * 0.27;
    float thirdPeak = exp(-pow((uv.x - 0.80 - sin(time * 0.43) * 0.014) * 15.5, 2.0)) * 0.18;
    float edgeFalloff = smoothstep(0.0, 0.09, uv.x) * smoothstep(0.0, 0.08, 1.0 - uv.x);
    float crest = 0.13 + broadWave * 0.20 + longRhythm + shortRhythm;
    crest += leftPeak + mainPeak + secondPeak + thirdPeak + pointerLift;
    crest *= mix(0.48, 1.0, edgeFalloff);
    crest = clamp(crest, 0.12, 0.79);

    float cellSize = mix(3.1, 4.1, step(900.0, uResolution.x));
    vec2 cell = floor(pixel / cellSize);
    vec2 local = fract(pixel / cellSize);
    float seed = hash(cell);
    vec2 jitter = vec2(hash(cell + 13.7), hash(cell + 41.3));
    vec2 center = mix(vec2(0.34), vec2(0.66), jitter);
    float radius = mix(0.13, 0.31, hash(cell + 8.4));
    float dotShape = 1.0 - smoothstep(radius, radius + 0.15, length(local - center));

    float depth = crest - uv.y;
    float belowCrest = smoothstep(-0.006, 0.012, depth);
    float floorFade = smoothstep(0.015, 0.14, uv.y);
    float cloud = fbm(vec2(uv.x * 4.1 * aspect + time * 0.7, uv.y * 5.3 - time));
    float current = fbm(vec2(uv.x * 11.0 - time * 1.5, uv.y * 7.0));
    float density = 0.48 + cloud * 0.46 + current * 0.17;
    float particleGate = step(1.0 - clamp(density, 0.0, 0.96), seed);

    float crestGlow = exp(-abs(depth) * 21.0);
    float depthLight = mix(0.48, 0.93, crestGlow);
    float shimmer = 0.84 + 0.16 * hash(cell + floor(uTime * 4.0 * uMotion));
    float alpha = dotShape * particleGate * belowCrest * floorFade;
    alpha *= (0.58 + crestGlow * 0.58) * shimmer;

    vec3 color = vec3(depthLight);
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.96));
  }
`;

function ParticleCurtain() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const drawingBufferSize = useRef(new THREE.Vector2(1, 1));
  const { gl } = useThree();

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.current.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight,
      );
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  useFrame((state) => {
    if (!material.current) return;
    gl.getDrawingBufferSize(drawingBufferSize.current);
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    material.current.uniforms.uPointer.value.lerp(pointerTarget.current, 0.035);
    material.current.uniforms.uResolution.value.copy(drawingBufferSize.current);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uMotion: {
            value:
              typeof window !== 'undefined' &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 0
                : 1,
          },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uResolution: { value: new THREE.Vector2(1, 1) },
        }}
      />
    </mesh>
  );
}

export function SignalField() {
  return (
    <Canvas
      className="signal-field"
      dpr={[1, 1.35]}
      fallback={<div className="signal-field signal-field-fallback" aria-hidden="true" />}
      gl={{ alpha: false, antialias: false, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <color attach="background" args={['#111210']} />
      <ParticleCurtain />
    </Canvas>
  );
}
