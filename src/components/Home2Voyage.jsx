import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/* Act 03 of Home 2.0: a synthwave voyage rendered fully procedurally —
   shader grid road with noise-displaced terrain walls, scanline sun,
   starfield, light pylons, and a primitive-built spaceship steered by the
   pointer. No models or textures are fetched; everything is generated. */

const GRID_VERT = `
  uniform float uScroll;
  varying vec2 vGrid;
  varying float vElev;
  varying float vWorldZ;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  void main() {
    vec3 pos = position;
    vec2 g = vec2(position.x, position.y + uScroll);
    float side = smoothstep(4.0, 14.0, abs(position.x));
    float elev = noise(g * 0.11) * 6.0 * side;
    pos.z += elev;
    vElev = elev;
    vGrid = g * 0.55;
    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vWorldZ = wp.z;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const GRID_FRAG = `
  uniform vec3 uRoad;
  uniform vec3 uHill;
  varying vec2 vGrid;
  varying float vElev;
  varying float vWorldZ;
  void main() {
    vec2 c = abs(fract(vGrid) - 0.5);
    float line = smoothstep(0.42, 0.5, max(c.x, c.y));
    vec3 col = mix(uRoad, uHill, clamp(vElev / 5.0, 0.0, 1.0));
    float fade = smoothstep(-95.0, -25.0, vWorldZ);
    float alpha = line * fade * 0.85;
    if (alpha < 0.015) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

const SUN_FRAG = `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float dist = length((vUv - 0.5) * 2.0);
    float disc = 1.0 - smoothstep(0.82, 0.86, dist);
    vec3 top = vec3(0.65, 0.55, 0.98);
    vec3 mid = vec3(0.13, 0.83, 0.93);
    vec3 bottom = vec3(0.0, 1.0, 0.53);
    vec3 col = vUv.y > 0.5
      ? mix(mid, top, (vUv.y - 0.5) * 2.0)
      : mix(bottom, mid, vUv.y * 2.0);
    float stripes = vUv.y < 0.48
      ? step(0.35, fract(vUv.y * 16.0 - uTime * 0.22))
      : 1.0;
    float glow = (1.0 - smoothstep(0.7, 1.4, dist)) * 0.25;
    float alpha = disc * stripes + glow;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

const SUN_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export default function Home2Voyage() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x05070c, 1);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070c, 0.02);
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 260);
    camera.position.set(0, 2.4, 9);

    scene.add(new THREE.HemisphereLight(0x2c3d55, 0x05070c, 1.6));
    const keyLight = new THREE.DirectionalLight(0xbfe8ff, 1.6);
    keyLight.position.set(3, 8, 6);
    scene.add(keyLight);

    // Grid road + terrain
    const gridUniforms = {
      uScroll: { value: 0 },
      uRoad: { value: new THREE.Color("#00ff88") },
      uHill: { value: new THREE.Color("#22d3ee") },
    };
    const grid = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 140, 110, 150),
      new THREE.ShaderMaterial({
        vertexShader: GRID_VERT,
        fragmentShader: GRID_FRAG,
        uniforms: gridUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    grid.rotation.x = -Math.PI / 2;
    grid.position.z = -40;
    scene.add(grid);

    // Horizon sun
    const sunUniforms = { uTime: { value: 0 } };
    const sun = new THREE.Mesh(
      new THREE.PlaneGeometry(46, 46),
      new THREE.ShaderMaterial({
        vertexShader: SUN_VERT,
        fragmentShader: SUN_FRAG,
        uniforms: sunUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    sun.position.set(0, 7, -95);
    scene.add(sun);

    // Starfield
    const starCount = 900;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const radius = 70 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.48;
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = 4 + radius * Math.cos(phi) * 0.5;
      starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 40;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: 0xaadcff, size: 0.5, sizeAttenuation: true,
      transparent: true, opacity: 0.8, depthWrite: false,
    }));
    scene.add(stars);

    // Roadside light pylons rushing past
    const pylonMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    const pylonGeo = new THREE.BoxGeometry(0.22, 2.6, 0.22);
    const pylons = [];
    for (let i = 0; i < 10; i++) {
      for (const sign of [-1, 1]) {
        const pylon = new THREE.Mesh(pylonGeo, pylonMat);
        pylon.position.set(5.4 * sign, 1.3, -6 - i * 14);
        scene.add(pylon);
        pylons.push(pylon);
      }
    }

    // Spaceship, built entirely from primitives
    const ship = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd7e0ea, metalness: 0.85, roughness: 0.35 });
    const hull = new THREE.Mesh(new THREE.ConeGeometry(0.34, 1.7, 8), bodyMat);
    hull.rotation.x = -Math.PI / 2;
    ship.add(hull);
    const cockpit = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x101820, metalness: 0.9, roughness: 0.1, emissive: 0x22d3ee, emissiveIntensity: 0.5 })
    );
    cockpit.scale.set(1, 0.7, 1.4);
    cockpit.position.set(0, 0.14, 0.05);
    ship.add(cockpit);
    const wings = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.06, 0.55), bodyMat);
    wings.position.set(0, -0.04, 0.45);
    ship.add(wings);
    const tipMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    for (const sign of [-1, 1]) {
      const tip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.55), tipMat);
      tip.position.set(1.15 * sign, -0.04, 0.45);
      ship.add(tip);
    }
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.5), bodyMat);
    fin.position.set(0, 0.26, 0.55);
    ship.add(fin);
    const engine = new THREE.Mesh(
      new THREE.CircleGeometry(0.18, 24),
      new THREE.MeshBasicMaterial({ color: 0x8ff9ff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    engine.position.set(0, 0, 0.88);
    ship.add(engine);
    const trailMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false });
    const trail = new THREE.Mesh(new THREE.ConeGeometry(0.13, 2.2, 12, 1, true), trailMat);
    trail.rotation.x = Math.PI / 2;
    trail.position.set(0, 0, 2.0);
    ship.add(trail);
    const engineLight = new THREE.PointLight(0x22d3ee, 6, 7);
    engineLight.position.set(0, 0.2, 1.1);
    ship.add(engineLight);
    ship.position.set(0, 1.35, 3.6);
    scene.add(ship);

    const clock = new THREE.Clock();
    const mouse = { x: 0, y: 0 };
    let raf = 0;
    let inView = false;

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const frame = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      gridUniforms.uScroll.value += dt * 7.0;
      sunUniforms.uTime.value = t;
      stars.rotation.y = t * 0.004;

      for (const pylon of pylons) {
        pylon.position.z += dt * 26;
        if (pylon.position.z > 9) pylon.position.z -= 140;
      }

      const targetX = mouse.x * 2.4;
      ship.position.x += (targetX - ship.position.x) * 0.06;
      ship.position.y = 1.35 + Math.sin(t * 2.1) * 0.09 - mouse.y * 0.5;
      ship.rotation.z += (-(targetX - ship.position.x) * 0.55 - ship.rotation.z) * 0.08;
      ship.rotation.x = Math.sin(t * 1.7) * 0.03;
      trailMat.opacity = 0.24 + Math.sin(t * 9) * 0.1;

      camera.position.x += (mouse.x * 0.9 - camera.position.x) * 0.04;
      camera.lookAt(ship.position.x * 0.4, 1.5, -30);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    const start = () => { if (!raf && !reducedMotion) { clock.getDelta(); raf = requestAnimationFrame(frame); } };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    const onPointerMove = (event) => {
      const rect = host.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    };

    const resizeObserver = new ResizeObserver(() => { resize(); if (reducedMotion) renderer.render(scene, camera); });
    resizeObserver.observe(host);
    const viewObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start(); else stop();
    }, { threshold: 0.05 });
    viewObserver.observe(host);
    if (!reducedMotion) host.addEventListener("pointermove", onPointerMove);

    resize();
    renderer.render(scene, camera);

    return () => {
      stop();
      resizeObserver.disconnect();
      viewObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      scene.traverse(obj => {
        obj.geometry?.dispose?.();
        const material = obj.material;
        if (Array.isArray(material)) material.forEach(m => m.dispose());
        else material?.dispose?.();
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className="h2x-voyage-canvas" aria-hidden="true" />;
}
