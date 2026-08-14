/**
 * The Jobvis orb: a holographic core in layered shells, drawn with Three.js.
 *
 * Five pieces, each doing one job:
 *   core    a small icosahedron that brightens and swells with the voice
 *   spiral  a helix threaded through the core, always turning
 *   shells  three counter-rotating wireframes, the "hologram" read
 *   debris  points orbiting on a wide shell, so the space has depth
 *   rings   thin tori that sweep, so the thing looks like it is scanning
 *
 * Then bloom and a whisper of chromatic aberration on top, which is what makes
 * it read as light rather than as geometry.
 *
 * The scene owns no state about the conversation. It takes a level (0-1) and a
 * mode, and the caller feeds those from the WebRTC audio analyser at whatever
 * rate it likes — here, once per frame.
 */

import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export type OrbMode = "idle" | "connecting" | "listening" | "speaking" | "error";

/**
 * Spectral iridescence. Each shell takes a different hue and they counter-
 * rotate, so the colour shifts as the thing turns — that motion is what makes
 * it read as iridescent rather than merely colourful. The wizard stays green;
 * this riot means you are talking to Jobvis.
 */
export const PALETTE = {
  core: 0xeafcff,
  cyan: 0x22e5ff,
  violet: 0x8b5cff,
  magenta: 0xff3dda,
  rose: 0xff5c8a,
  backdrop: 0x07030f,
  error: 0xffd166,
};

/** A cheap chromatic aberration: split the channels radially, strongest at the edge. */
const ChromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    amount: { value: 0.0032 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    varying vec2 vUv;
    void main() {
      vec2 toCenter = vUv - vec2(0.5);
      float falloff = dot(toCenter, toCenter) * 2.0;
      vec2 offset = toCenter * amount * falloff;
      float r = texture2D(tDiffuse, vUv + offset).r;
      vec4 g = texture2D(tDiffuse, vUv);
      float b = texture2D(tDiffuse, vUv - offset).b;
      gl_FragColor = vec4(r, g.g, b, g.a);
    }
  `,
};

export type OrbHandle = {
  setLevel: (level: number) => void;
  setMode: (mode: OrbMode) => void;
  /** Nudge the spin, in radians. Mouse drag and pinch gestures both land here. */
  spinBy: (dx: number, dy: number) => void;
  /** Multiply the camera distance. Scroll and two-hand pinch both land here. */
  zoomBy: (factor: number) => void;
  reset: () => void;
  dispose: () => void;
};

const MIN_DISTANCE = 3.0;
const MAX_DISTANCE = 12.0;

// The heart's speaking response. `level` is the MEAN of the low half of the
// spectrum, which for ordinary speech sits around 0.1-0.2 and rarely passes
// 0.3 — an earlier version gated red above 0.34 and so never fired at all.
// Speaking alone earns a base warmth; the level pushes it the rest of the way.
const SPEAKING_WARMTH = 0.45;
const PEAK_GAIN = 2.6;
const COOL_HEART = new THREE.Color(0xeafcff);
const HOT_HEART = new THREE.Color(0xff2d3a);
const COOL_HALO = new THREE.Color(0xff3dda);

export function createOrbScene(canvas: HTMLCanvasElement): OrbHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(PALETTE.backdrop, 0.07);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  // Full-bleed: keep the orb close enough to still glow, and nudge it off the
  // centreline so it sits clear of the slab while its outer shells still pass
  // BEHIND the glass — the refraction is the composition.
  const restingDistance = () => (window.innerWidth < 720 ? 7.4 : 5.2);
  let distance = restingDistance();
  camera.position.set(0, 0, distance);

  const group = new THREE.Group();
  scene.add(group);

  // --- core -----------------------------------------------------------------
  // Wireframe, not solid: a filled sphere under this much bloom is just a white
  // disc, and the faceting is what makes it read as constructed rather than lit.
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: PALETTE.cyan,
    transparent: true,
    opacity: 0.7,
    wireframe: true,
    blending: THREE.AdditiveBlending,
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.52, 2), coreMaterial);
  group.add(core);

  // The heart: small and solid, so there is something genuinely bright for the
  // bloom to bleed from. The faceted shell above keeps it from reading as a disc.
  const heartMaterial = new THREE.MeshBasicMaterial({
    color: PALETTE.core,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
  });
  const heart = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), heartMaterial);
  group.add(heart);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 32, 32),
    new THREE.MeshBasicMaterial({
      color: PALETTE.magenta,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    }),
  );
  group.add(halo);

  // --- spiral ---------------------------------------------------------------
  const spiralPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= 260; i++) {
    const t = i / 260;
    const angle = t * Math.PI * 12;
    const radius = 0.16 + t * 0.5;
    spiralPoints.push(new THREE.Vector3(Math.cos(angle) * radius, (t - 0.5) * 1.25, Math.sin(angle) * radius));
  }
  const spiral = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(spiralPoints),
    new THREE.LineBasicMaterial({ color: PALETTE.magenta, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending }),
  );
  group.add(spiral);

  // --- shells ---------------------------------------------------------------
  const shellSpecs = [
    { radius: 1.15, detail: 1, opacity: 0.576, speed: 0.16, color: PALETTE.cyan },
    { radius: 1.5, detail: 2, opacity: 0.32, speed: -0.1, color: PALETTE.violet },
    { radius: 1.95, detail: 1, opacity: 0.24, speed: 0.06, color: PALETTE.magenta },
  ];
  const shells = shellSpecs.map((spec) => {
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(spec.radius, spec.detail),
      new THREE.MeshBasicMaterial({
        color: spec.color,
        wireframe: true,
        transparent: true,
        opacity: spec.opacity,
        blending: THREE.AdditiveBlending,
      }),
    );
    group.add(mesh);
    return { mesh, speed: spec.speed, baseOpacity: spec.opacity, hue: new THREE.Color(spec.color).getHSL({ h: 0, s: 0, l: 0 }).h };
  });

  // --- debris ---------------------------------------------------------------
  const debrisCount = 520;
  const positions = new Float32Array(debrisCount * 3);
  for (let i = 0; i < debrisCount; i++) {
    // A shell rather than a ball: an even spread on the sphere, jittered outward.
    const theta = Math.acos(2 * ((i + 0.5) / debrisCount) - 1);
    const phi = i * 2.39996; // golden angle, so the points never band
    const radius = 2.25 + (i % 7) * 0.09;
    positions[i * 3] = Math.sin(theta) * Math.cos(phi) * radius;
    positions[i * 3 + 1] = Math.cos(theta) * radius;
    positions[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius;
  }
  const debrisGeometry = new THREE.BufferGeometry();
  debrisGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const debris = new THREE.Points(
    debrisGeometry,
    new THREE.PointsMaterial({
      color: PALETTE.cyan,
      size: 0.03,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  group.add(debris);

  // --- ambient field --------------------------------------------------------
  // A wide, faint drift that reaches the corners, so the animation genuinely
  // owns the whole frame — and so the glass slab always has something moving
  // behind it to refract instead of blurring flat black.
  const ambientCount = 900;
  const ambient = new Float32Array(ambientCount * 3);
  for (let i = 0; i < ambientCount; i++) {
    const theta = Math.acos(2 * ((i + 0.5) / ambientCount) - 1);
    const phi = i * 2.39996;
    const radius = 4.4 + ((i * 37) % 100) / 100 * 3.6;
    ambient[i * 3] = Math.sin(theta) * Math.cos(phi) * radius;
    ambient[i * 3 + 1] = Math.cos(theta) * radius * 0.72;
    ambient[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius;
  }
  const ambientGeometry = new THREE.BufferGeometry();
  ambientGeometry.setAttribute("position", new THREE.BufferAttribute(ambient, 3));
  const ambientField = new THREE.Points(
    ambientGeometry,
    new THREE.PointsMaterial({
      color: PALETTE.violet,
      size: 1.9,
      // Constant pixel size, like stars. With attenuation on, a point that
      // drifts near the camera renders as a large square — one did.
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  // Deliberately NOT in `group`: it should not swing when you spin the orb.
  scene.add(ambientField);

  // --- scan rings -----------------------------------------------------------
  const rings = [0, 1, 2].map((i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.7 + i * 0.22, 0.005, 8, 160),
      new THREE.MeshBasicMaterial({
        color: [PALETTE.magenta, PALETTE.cyan, PALETTE.rose][i],
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      }),
    );
    ring.rotation.x = Math.PI / 2 + i * 0.4;
    ring.rotation.z = i * 0.7;
    group.add(ring);
    return ring;
  });

  // --- post -----------------------------------------------------------------
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.72, 0.8, 0.15);
  composer.addPass(bloom);
  const chroma = new ShaderPass(ChromaticAberrationShader);
  composer.addPass(chroma);

  // --- state ----------------------------------------------------------------
  let level = 0;
  let smoothed = 0;
  let mode: OrbMode = "idle";
  let warmth = 0;
  let spinX = 0;
  let spinY = 0;
  let momentumX = 0;
  let momentumY = 0;
  let disposed = false;
  // Timer, not Clock: Clock is deprecated, and Timer's Page Visibility support
  // means a backgrounded tab does not return with one enormous delta.
  const timer = new THREE.Timer();
  timer.connect(document);

  // Track the CSS size ourselves. Comparing against canvas.width does NOT work:
  // setPixelRatio makes the drawing buffer a multiple of the CSS size, so on any
  // retina display the check never matched and this ran every single frame —
  // re-allocating the composer targets, and resetting the camera distance, which
  // silently undid every zoom the moment it was applied.
  let lastWidth = 0;
  let lastHeight = 0;
  let wide: boolean | null = null;

  function resize() {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    if (width === lastWidth && height === lastHeight) return;
    lastWidth = width;
    lastHeight = height;
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
    bloom.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // The slab occupies the left edge on wide screens; sit the core right of it
    // so the composition balances, then let the outer shells reach back under.
    const nowWide = width >= 900;
    group.position.x = nowWide ? 0.55 : 0;
    // Only re-seat the camera when the layout actually flips between the wide
    // and narrow compositions — resizing a window should not throw away a zoom.
    if (wide !== nowWide) {
      wide = nowWide;
      distance = restingDistance();
    }
  }

  let faulted = false;

  function tint(fault: boolean) {
    faulted = fault;
    coreMaterial.color.setHex(fault ? PALETTE.error : PALETTE.cyan);
    heartMaterial.color.setHex(fault ? PALETTE.error : PALETTE.core);
    if (fault) warmth = 0;
    shells.forEach((shell, i) => {
      (shell.mesh.material as THREE.MeshBasicMaterial).color.setHex(fault ? PALETTE.error : shellSpecs[i].color);
    });
    (spiral.material as THREE.LineBasicMaterial).color.setHex(fault ? PALETTE.error : PALETTE.magenta);
  }

  function frame() {
    if (disposed) return;
    resize();
    timer.update();
    const delta = Math.min(timer.getDelta(), 0.1);
    const time = timer.getElapsed();

    // Ease toward the measured level so a dropped frame never makes it stutter.
    smoothed += (level - smoothed) * Math.min(1, delta * 9);
    const idle = mode === "idle" || mode === "connecting";
    const breath = idle ? 0.5 + Math.sin(time * 1.4) * 0.5 : 1;
    const energy = idle ? 0.12 * breath : 0.25 + smoothed * 1.35;

    core.scale.setScalar(1 + energy * 0.35);
    core.rotation.y += delta * (0.35 + smoothed * 2.2);
    coreMaterial.opacity = 0.32 + energy * 0.36;
    heart.scale.setScalar(1 + energy * 0.55);
    heartMaterial.opacity = 0.48 + energy * 0.32;

    // Peak heat. The heart runs ice → amber → hot red as the voice drives it,
    // and only from `smoothed` (the real audio level), so the idle breathing
    // never fakes it. The floor keeps ordinary speech cool: this should mean
    // "he is loud right now", not "a session is open".
    if (!faulted) {
      // Red is reserved for Jobvis SPEAKING. Level alone is not enough: your own
      // voice drives the analyser too, and a stale last frame would otherwise
      // leave the heart glowing red into the silence. Not speaking, not hot.
      const heat = mode === "speaking" ? Math.min(1, SPEAKING_WARMTH + smoothed * PEAK_GAIN) : 0;
      // Ease the return so it cools down rather than snapping back.
      warmth += (heat - warmth) * Math.min(1, delta * 6);
      heartMaterial.color.copy(COOL_HEART).lerp(HOT_HEART, warmth);
      (halo.material as THREE.MeshBasicMaterial).color.copy(COOL_HALO).lerp(HOT_HEART, warmth * 0.85);
    }
    halo.scale.setScalar(1 + energy * 0.5);
    (halo.material as THREE.MeshBasicMaterial).opacity = 0.028 + energy * 0.128;

    spiral.rotation.y -= delta * (0.6 + smoothed * 2.6);
    (spiral.material as THREE.LineBasicMaterial).opacity = 0.224 + energy * 0.4;

    shells.forEach((shell, i) => {
      shell.mesh.rotation.y += delta * shell.speed;
      shell.mesh.rotation.x += delta * shell.speed * 0.45;
      shell.mesh.scale.setScalar(1 + smoothed * 0.09);
      const material = shell.mesh.material as THREE.MeshBasicMaterial;
      material.opacity = shell.baseOpacity * (0.7 + energy * 0.9);
      // The shimmer: each shell's hue drifts on its own phase, so the whole
      // thing cycles through the spectrum instead of sitting on three colours.
      if (!faulted) {
        const drift = Math.sin(time * 0.22 + i * 2.1) * 0.07;
        material.color.setHSL((shell.hue + drift + 1) % 1, 0.95, 0.58 + energy * 0.12);
      }
    });

    debris.rotation.y += delta * 0.045;
    debris.rotation.x = Math.sin(time * 0.12) * 0.12;
    (debris.material as THREE.PointsMaterial).opacity = 0.32 + energy * 0.36;

    ambientField.rotation.y += delta * 0.012;
    ambientField.rotation.x = Math.sin(time * 0.05) * 0.06;
    (ambientField.material as THREE.PointsMaterial).opacity = 0.256 + energy * 0.272;

    rings.forEach((ring, i) => {
      ring.rotation.z += delta * (0.22 + i * 0.09) * (i % 2 === 0 ? 1 : -1);
      // The sweep: each ring rises and falls out of phase with the others.
      ring.position.y = Math.sin(time * 0.55 + i * 2.1) * 0.85;
      (ring.material as THREE.MeshBasicMaterial).opacity = 0.128 + energy * 0.36;
    });

    // Drag momentum, then a slow drift so the orb is never quite still.
    spinY += momentumY;
    spinX += momentumX;
    momentumY *= 0.92;
    momentumX *= 0.92;
    group.rotation.y = spinY + time * 0.05;
    group.rotation.x = THREE.MathUtils.clamp(spinX, -0.9, 0.9);

    bloom.strength = 0.76 + energy * 0.84;
    chroma.uniforms.amount.value = 0.0032 + smoothed * 0.007;

    camera.position.z += (distance - camera.position.z) * Math.min(1, delta * 6);
    composer.render();
    requestAnimationFrame(frame);
  }

  resize();
  requestAnimationFrame(frame);

  return {
    setLevel: (value: number) => {
      level = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
    },
    setMode: (next: OrbMode) => {
      mode = next;
      tint(next === "error");
    },
    spinBy: (dx: number, dy: number) => {
      momentumY += dx;
      momentumX += dy;
    },
    zoomBy: (factor: number) => {
      distance = THREE.MathUtils.clamp(distance * factor, MIN_DISTANCE, MAX_DISTANCE);
    },
    reset: () => {
      spinX = spinY = momentumX = momentumY = 0;
      distance = restingDistance();
    },
    dispose: () => {
      disposed = true;
      timer.dispose();
      composer.dispose();
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material.dispose();
        }
      });
    },
  };
}
