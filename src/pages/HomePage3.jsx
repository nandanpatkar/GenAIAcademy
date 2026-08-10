import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { disposeThreeScene } from "../utils/disposeThreeScene";
import {
  ArrowRight,
  BrainCircuit,
  ChevronDown,
  Code2,
  GraduationCap,
  Layers3,
  Mic2,
  Network,
  Orbit,
  Rocket,
  Sparkles,
} from "lucide-react";
import "./HomePage3.css";

const STORY = [
  {
    id: "orient",
    nav: "Start",
    eyebrow: "GENAI ACADEMY / 3.0",
    title: "Don’t just learn AI. Build its world.",
    body: "Follow one connected path from first principles to production systems—then prove what you know in labs that actually run.",
    tags: ["Guided tracks", "Live labs", "Built in-browser"],
    accent: "#22d3ee",
    icon: Sparkles,
  },
  {
    id: "learn",
    nav: "Learn",
    eyebrow: "01 / KNOWLEDGE ORBIT",
    title: "See how every idea connects.",
    body: "Explore Gen AI, Agentic AI, and Data Science as a living knowledge system—not a pile of disconnected tutorials.",
    tags: ["3 learning tracks", "Knowledge galaxy", "Progress memory"],
    accent: "#8b5cf6",
    icon: Orbit,
    metric: { value: "3", label: "CONNECTED TRACKS" },
  },
  {
    id: "build",
    nav: "Build",
    eyebrow: "02 / BUILDER DISTRICT",
    title: "Turn concepts into working code.",
    body: "Move from lesson to implementation inside a cloud IDE with an AI pair-programmer, live execution, and GitHub workflows.",
    tags: ["Cloud IDE", "AI code assistant", "Multi-language runtime"],
    accent: "#f59e0b",
    icon: Code2,
    metric: { value: "0", label: "LOCAL SETUP" },
  },
  {
    id: "simulate",
    nav: "Simulate",
    eyebrow: "03 / SYSTEMS LAB",
    title: "Architect systems you can stress-test.",
    body: "Design RAG pipelines, agent loops, AWS architectures, and distributed systems—then watch traffic expose every trade-off.",
    tags: ["7+ simulators", "System design", "AWS architecture"],
    accent: "#38bdf8",
    icon: Network,
    metric: { value: "7+", label: "INTERACTIVE LABS" },
  },
  {
    id: "prepare",
    nav: "Prepare",
    eyebrow: "04 / INTERVIEW ARENA",
    title: "Practice where the questions push back.",
    body: "Train with voice interviews, adaptive quizzes, DSA animation, and structured courses built around real engineering decisions.",
    tags: ["22 courses", "Voice interviewer", "Live code feedback"],
    accent: "#fb7185",
    icon: Mic2,
    metric: { value: "22", label: "INTERVIEW COURSES" },
  },
  {
    id: "launch",
    nav: "Launch",
    eyebrow: "05 / YOUR LAUNCHPAD",
    title: "Your route to AI architect starts here.",
    body: "One workspace. One connected journey. Everything you need to learn, build, simulate, and prepare for what comes next.",
    tags: ["Free to start", "100% in-browser", "Build at your pace"],
    accent: "#22c55e",
    icon: Rocket,
  },
];

const WORLD_SITES = [
  { position: [0, 0, 0], accent: 0x22d3ee, type: "core" },
  { position: [-8, 0, -18], accent: 0x8b5cf6, type: "learn" },
  { position: [8, 0, -36], accent: 0xf59e0b, type: "build" },
  { position: [-6, 0, -54], accent: 0x38bdf8, type: "simulate" },
  { position: [8, 0, -72], accent: 0xfb7185, type: "prepare" },
  { position: [0, 0, -92], accent: 0x22c55e, type: "launch" },
];

const CAMERA_POINTS = [
  [0, 14, 28],
  [-4, 9, 7],
  [-12, 8, -13],
  [12, 8, -31],
  [-10, 8, -50],
  [12, 8, -68],
  [4, 9, -88],
  [0, 7, -104],
];

function createMaterial(color, { emissive = 0x000000, roughness = 0.72, metalness = 0.05 } = {}) {
  return new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: emissive ? 0.48 : 0, roughness, metalness });
}

function mesh(geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(...position);
  object.rotation.set(...rotation);
  object.castShadow = true;
  object.receiveShadow = true;
  return object;
}

function addBox(group, size, position, material, rotation) {
  const object = mesh(new THREE.BoxGeometry(...size), material, position, rotation);
  group.add(object);
  return object;
}

function addBuilding(group, x, z, height, accentMaterial, darkMaterial) {
  addBox(group, [2.7, height, 2.7], [x, 0.65 + height / 2, z], darkMaterial);
  addBox(group, [2.85, 0.2, 2.85], [x, 0.76 + height, z], accentMaterial);
  for (let row = 0; row < Math.max(1, Math.floor(height / 1.3)); row += 1) {
    addBox(group, [1.45, 0.22, 0.05], [x, 1.35 + row * 1.12, z + 1.38], accentMaterial);
  }
}

function createDiorama(site, index) {
  const group = new THREE.Group();
  group.position.set(...site.position);

  const accent = createMaterial(site.accent, { emissive: site.accent, roughness: 0.38, metalness: 0.15 });
  const accentSoft = createMaterial(new THREE.Color(site.accent).multiplyScalar(0.55), { emissive: site.accent });
  const dark = createMaterial(0x172033, { roughness: 0.88 });
  const pale = createMaterial(0xcbd5e1, { roughness: 0.92 });
  const island = mesh(new THREE.CylinderGeometry(7, 6.45, 1.1, 10), createMaterial(0x111b2e), [0, 0, 0]);
  group.add(island);

  const lowerIsland = mesh(new THREE.CylinderGeometry(5.8, 3.8, 1.8, 10), createMaterial(0x0b1220), [0, -1.35, 0]);
  group.add(lowerIsland);

  const rim = mesh(new THREE.TorusGeometry(6.55, 0.07, 8, 48), accent, [0, 0.6, 0], [Math.PI / 2, 0, 0]);
  rim.userData.spin = index % 2 ? -0.08 : 0.08;
  group.add(rim);

  if (site.type === "core") {
    const tower = mesh(new THREE.CylinderGeometry(1.7, 2.25, 5.2, 8), dark, [0, 3.15, 0]);
    group.add(tower);
    const orb = mesh(new THREE.IcosahedronGeometry(1.45, 1), accent, [0, 6.7, 0]);
    orb.userData.float = { base: 6.7, speed: 0.8, amount: 0.22 };
    orb.userData.spin = 0.15;
    group.add(orb);
    [2.5, 3.5].forEach((radius, ringIndex) => {
      const ring = mesh(new THREE.TorusGeometry(radius, 0.06, 8, 48), accent, [0, 6.7, 0], [Math.PI / 2 + ringIndex * 0.45, 0, ringIndex * 0.6]);
      ring.userData.spin = ringIndex ? -0.18 : 0.2;
      group.add(ring);
    });
    addBuilding(group, -3.6, 1.5, 2.5, accentSoft, dark);
    addBuilding(group, 3.6, 1.2, 3.4, accentSoft, dark);
  }

  if (site.type === "learn") {
    const center = mesh(new THREE.SphereGeometry(1.15, 18, 18), accent, [0, 4.6, 0]);
    center.userData.float = { base: 4.6, speed: 0.75, amount: 0.3 };
    group.add(center);
    [2.2, 3.3, 4.4].forEach((radius, orbitIndex) => {
      const ring = mesh(new THREE.TorusGeometry(radius, 0.045, 6, 56), accentSoft, [0, 4.6, 0], [Math.PI / 2 + orbitIndex * 0.38, 0, orbitIndex * 0.7]);
      ring.userData.spin = orbitIndex % 2 ? -0.12 : 0.12;
      group.add(ring);
      const node = mesh(new THREE.SphereGeometry(0.32 + orbitIndex * 0.05, 12, 12), pale, [radius, 4.6, 0]);
      node.userData.spinAround = { radius, speed: 0.32 + orbitIndex * 0.1, phase: orbitIndex * 2.1, y: 4.6 };
      group.add(node);
    });
    [-3.8, 3.8].forEach((x) => addBuilding(group, x, 1.4, 2.2, accentSoft, dark));
  }

  if (site.type === "build") {
    addBuilding(group, -3.4, 1.2, 4.4, accent, dark);
    addBuilding(group, 3.2, 2, 3.2, accentSoft, dark);
    addBuilding(group, 0, -2.8, 2.4, accentSoft, dark);
    const screen = addBox(group, [5.4, 3.1, 0.25], [0, 4.3, 0], dark, [0, -0.14, 0]);
    screen.userData.float = { base: 4.3, speed: 0.65, amount: 0.18 };
    for (let line = 0; line < 4; line += 1) {
      addBox(screen, [3.5 - line * 0.35, 0.12, 0.08], [-0.45 + line * 0.12, 0.72 - line * 0.48, 0.17], line === 0 ? accent : pale);
    }
  }

  if (site.type === "simulate") {
    const nodes = [[-3.5, 2.6, -1.5], [0, 4.5, 0], [3.6, 2.8, -1], [-2.2, 2, 3], [2.4, 2.2, 3.2]];
    nodes.forEach(([x, y, z], nodeIndex) => {
      const server = mesh(new THREE.BoxGeometry(1.8, 1.4, 1.8), nodeIndex === 1 ? accent : dark, [x, y, z]);
      server.userData.float = { base: y, speed: 0.55 + nodeIndex * 0.08, amount: 0.16 };
      group.add(server);
      addBox(server, [1.1, 0.1, 0.05], [0, 0.25, 0.93], accentSoft);
      addBox(server, [0.7, 0.1, 0.05], [0.2, -0.2, 0.93], pale);
    });
    const paths = [[0, 1], [1, 2], [1, 3], [1, 4]];
    paths.forEach(([from, to]) => {
      const curve = new THREE.LineCurve3(
        new THREE.Vector3(...nodes[from]),
        new THREE.Vector3(...nodes[to]),
      );
      group.add(mesh(new THREE.TubeGeometry(curve, 10, 0.045, 6, false), accent));
    });
  }

  if (site.type === "prepare") {
    for (let seat = 0; seat < 9; seat += 1) {
      const angle = (seat / 9) * Math.PI * 1.5 - Math.PI * 0.25;
      addBox(group, [1.25, 0.45, 1.1], [Math.cos(angle) * 4.7, 1.15, Math.sin(angle) * 4.7], seat % 3 === 0 ? accentSoft : dark, [0, -angle + Math.PI / 2, 0]);
    }
    const podium = mesh(new THREE.CylinderGeometry(2.25, 2.6, 0.65, 16), dark, [0, 1.05, 0]);
    group.add(podium);
    const micStem = mesh(new THREE.CylinderGeometry(0.11, 0.11, 3.2, 10), pale, [0, 2.8, 0], [0, 0, -0.28]);
    group.add(micStem);
    const mic = mesh(new THREE.CapsuleGeometry(0.38, 0.75, 8, 14), accent, [-0.45, 4.32, 0], [0, 0, -0.28]);
    mic.userData.float = { base: 4.32, speed: 0.8, amount: 0.12 };
    group.add(mic);
  }

  if (site.type === "launch") {
    const pad = mesh(new THREE.CylinderGeometry(3.8, 4.2, 0.7, 16), dark, [0, 1, 0]);
    group.add(pad);
    const rocket = new THREE.Group();
    rocket.position.set(0, 1.5, 0);
    rocket.userData.float = { base: 1.5, speed: 0.7, amount: 0.26 };
    rocket.add(mesh(new THREE.CylinderGeometry(0.72, 0.95, 4.3, 16), pale, [0, 2.6, 0]));
    rocket.add(mesh(new THREE.ConeGeometry(0.96, 2, 16), accent, [0, 5.75, 0]));
    rocket.add(mesh(new THREE.ConeGeometry(0.58, 1.8, 14), accentSoft, [0, -0.3, 0], [Math.PI, 0, 0]));
    rocket.add(addBox(new THREE.Group(), [0.18, 1.25, 1.55], [0, 1.45, 0], accentSoft));
    group.add(rocket);
    [2.3, 3.2, 4.15].forEach((radius, ringIndex) => {
      const ring = mesh(new THREE.TorusGeometry(radius, 0.055, 7, 48), accent, [0, 1.4, 0], [Math.PI / 2, 0, 0]);
      ring.userData.spin = ringIndex % 2 ? -0.18 : 0.16;
      group.add(ring);
    });
  }

  for (let detail = 0; detail < 12; detail += 1) {
    const angle = (detail / 12) * Math.PI * 2;
    const radius = 5.15 + (detail % 2) * 0.45;
    const marker = mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.7 + (detail % 3) * 0.2, 6), detail % 4 === 0 ? accentSoft : dark, [Math.cos(angle) * radius, 1, Math.sin(angle) * radius]);
    group.add(marker);
  }

  return group;
}

function WorldCanvas({ scrollRootRef, onActiveChange }) {
  const mountRef = useRef(null);
  const progressRef = useRef({ target: 0, current: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    const scrollRoot = scrollRootRef.current;
    if (!mount || !scrollRoot) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07101d);
    scene.fog = new THREE.FogExp2(0x07101d, 0.018);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 220);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0x9bdcff, 0x07101d, 1.45));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(14, 28, 18);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -32;
    keyLight.shadow.camera.right = 32;
    keyLight.shadow.camera.top = 32;
    keyLight.shadow.camera.bottom = -32;
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight(0x22d3ee, 28, 60, 2);
    cyanLight.position.set(-8, 10, -30);
    scene.add(cyanLight);
    const greenLight = new THREE.PointLight(0x22c55e, 22, 50, 2);
    greenLight.position.set(0, 9, -91);
    scene.add(greenLight);

    const world = new THREE.Group();
    scene.add(world);
    WORLD_SITES.forEach((site, index) => world.add(createDiorama(site, index)));

    const routeCurve = new THREE.CatmullRomCurve3(WORLD_SITES.map(({ position }) => new THREE.Vector3(position[0], 0.8, position[2])));
    const route = mesh(
      new THREE.TubeGeometry(routeCurve, 180, 0.08, 7, false),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 1.2, transparent: true, opacity: 0.48 }),
    );
    world.add(route);

    const starGeometry = new THREE.BufferGeometry();
    const stars = [];
    for (let index = 0; index < 520; index += 1) {
      const seed = Math.sin(index * 999.17) * 43758.5453;
      const fraction = seed - Math.floor(seed);
      stars.push((fraction - 0.5) * 150, 4 + ((index * 17) % 42), 35 - ((index * 29) % 165));
    }
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(stars, 3));
    const starField = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0x8bdcf4, size: 0.09, transparent: true, opacity: 0.46 }));
    scene.add(starField);

    const cameraCurve = new THREE.CatmullRomCurve3(CAMERA_POINTS.map((point) => new THREE.Vector3(...point)), false, "catmullrom", 0.44);
    let activeIndex = -1;
    let frameId = 0;
    let narrowViewport = mount.clientWidth <= 760;
    const animationStartedAt = window.performance.now();

    const updateScroll = () => {
      const max = Math.max(1, scrollRoot.scrollHeight - scrollRoot.clientHeight);
      progressRef.current.target = THREE.MathUtils.clamp(scrollRoot.scrollTop / max, 0, 1);
    };

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      narrowViewport = width <= 760;
      camera.fov = narrowViewport ? 68 : 45;
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const render = (timestamp = window.performance.now()) => {
      const elapsed = (timestamp - animationStartedAt) / 1000;
      const progress = progressRef.current;
      progress.current = reducedMotion
        ? progress.target
        : THREE.MathUtils.lerp(progress.current, progress.target, 0.065);

      if (reducedMotion) {
        camera.position.set(25, 28, 28);
        camera.lookAt(0, 0, -44);
      } else {
        const position = cameraCurve.getPointAt(progress.current);
        const tangent = cameraCurve.getTangentAt(progress.current);
        const focalPoint = position.clone().add(tangent.clone().multiplyScalar(12));
        if (narrowViewport) {
          position.add(tangent.clone().multiplyScalar(-7));
          position.y += 2.5;
        }
        camera.position.copy(position);
        camera.lookAt(focalPoint.setY(narrowViewport ? 1.1 : 2.7));
      }

      const nextActive = Math.min(STORY.length - 1, Math.floor(progress.target * STORY.length));
      if (nextActive !== activeIndex) {
        activeIndex = nextActive;
        onActiveChange(nextActive);
      }

      if (!reducedMotion) {
        world.traverse((object) => {
          if (object.userData.spin) object.rotation.y += object.userData.spin * 0.008;
          if (object.userData.float) {
            const { base, speed, amount } = object.userData.float;
            object.position.y = base + Math.sin(elapsed * speed) * amount;
          }
          if (object.userData.spinAround) {
            const { radius, speed, phase, y } = object.userData.spinAround;
            object.position.set(Math.cos(elapsed * speed + phase) * radius, y, Math.sin(elapsed * speed + phase) * radius);
          }
        });
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };

    updateScroll();
    resize();
    scrollRoot.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    render();

    return () => {
      window.cancelAnimationFrame(frameId);
      scrollRoot.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", resize);
      // Also disposes textures and releases the GL context, which
      // renderer.dispose() on its own does not do. See utils/disposeThreeScene.
      disposeThreeScene(scene, renderer, mount);
    };
  }, [onActiveChange, scrollRootRef]);

  return <div className="hp3-canvas" ref={mountRef} />;
}

function BrandMark() {
  return (
    <span className="hp3-brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

export default function HomePage3({ onEnter, onSwitch }) {
  const mainRef = useRef(null);
  const [active, setActive] = useState(0);
  const activeStory = STORY[active];
  const ActiveIcon = activeStory.icon;

  const stats = useMemo(
    () => [
      { value: "3", label: "Learning tracks", icon: BrainCircuit },
      { value: "7+", label: "Interactive simulators", icon: Layers3 },
      { value: "22", label: "Interview courses", icon: GraduationCap },
    ],
    [],
  );

  const goToScene = (index) => {
    const root = mainRef.current;
    if (!root) return;
    const max = root.scrollHeight - root.clientHeight;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.scrollTo({ top: max * (index / (STORY.length - 1)), behavior: reduceMotion ? "auto" : "smooth" });
  };

  // Preserve the current story beat when a phone rotates. Height-only resizes
  // (such as a collapsing mobile URL bar) are intentionally ignored.
  useEffect(() => {
    const root = mainRef.current;
    if (!root) return undefined;
    let previousWidth = root.clientWidth;
    let resizeFrame = 0;

    const handleResize = () => {
      const nextWidth = root.clientWidth;
      if (Math.abs(nextWidth - previousWidth) < 48) return;
      previousWidth = nextWidth;
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        const max = Math.max(0, root.scrollHeight - root.clientHeight);
        root.scrollTo({ top: max * (active / (STORY.length - 1)), behavior: "auto" });
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);

  return (
    <main className="hp3-root" ref={mainRef}>
      <a className="hp3-skip-link" href="#hp3-story">Skip to the story</a>

      <div className="hp3-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${(active + 1) / STORY.length})` }} />
      </div>

      <nav className="hp3-nav" aria-label="Landing page navigation">
        <button type="button" className="hp3-brand" onClick={() => goToScene(0)} aria-label="GenAI Academy home">
          <BrandMark />
          <span>GENAI <b>ACADEMY</b></span>
          <small>03</small>
        </button>

        <div className="hp3-nav-center" aria-label="Current scene">
          <ActiveIcon size={15} aria-hidden="true" />
          <span>{activeStory.nav}</span>
          <span>{String(active + 1).padStart(2, "0")} / {String(STORY.length).padStart(2, "0")}</span>
        </div>

        <button type="button" className="hp3-enter hp3-enter-small" onClick={onEnter}>
          Skip tour <ArrowRight size={16} aria-hidden="true" />
        </button>
      </nav>

      <aside className="hp3-route" aria-label="Explore the platform journey">
        {STORY.map((scene, index) => (
          <button
            type="button"
            key={scene.id}
            className={index === active ? "is-active" : ""}
            onClick={() => goToScene(index)}
            aria-label={`Go to ${scene.nav} scene`}
            aria-current={index === active ? "step" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <i style={{ "--scene-accent": scene.accent }} />
            <b>{scene.nav}</b>
          </button>
        ))}
      </aside>

      <div className="hp3-world-stage" aria-label="A scroll-controlled miniature world representing the GenAI Academy journey">
        <WorldCanvas scrollRootRef={mainRef} onActiveChange={setActive} />
        <div className="hp3-world-vignette" />
        <div className="hp3-grid-floor" />
      </div>

      <div className="hp3-story" id="hp3-story">
        {STORY.map((scene, index) => {
          const Icon = scene.icon;
          const isHero = index === 0;
          const isFinal = index === STORY.length - 1;
          return (
            <section
              key={scene.id}
              id={`hp3-${scene.id}`}
              className={`hp3-scene ${index % 2 ? "is-right" : "is-left"} ${isHero ? "is-hero" : ""} ${isFinal ? "is-final" : ""}`}
              style={{ "--accent": scene.accent }}
              aria-labelledby={`hp3-title-${scene.id}`}
            >
              <div className="hp3-copy">
                <div className="hp3-eyebrow">
                  <span><Icon size={14} aria-hidden="true" /></span>
                  {scene.eyebrow}
                </div>

                {isHero ? (
                  <h1 id={`hp3-title-${scene.id}`}>{scene.title}</h1>
                ) : (
                  <h2 id={`hp3-title-${scene.id}`}>{scene.title}</h2>
                )}

                <p>{scene.body}</p>

                <ul className="hp3-tags" aria-label={`${scene.nav} highlights`}>
                  {scene.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>

                {scene.metric && (
                  <div className="hp3-scene-metric" aria-label={`${scene.metric.value} ${scene.metric.label}`}>
                    <strong>{scene.metric.value}</strong>
                    <span>{scene.metric.label}</span>
                  </div>
                )}

                {isHero && (
                  <div className="hp3-hero-actions">
                    <button type="button" className="hp3-enter" onClick={onEnter}>
                      Enter Academy <ArrowRight size={18} aria-hidden="true" />
                    </button>
                    <button type="button" className="hp3-explore" onClick={() => goToScene(1)}>
                      Explore the world <ChevronDown size={17} aria-hidden="true" />
                    </button>
                  </div>
                )}

                {isFinal && (
                  <div className="hp3-final-actions">
                    <button type="button" className="hp3-enter hp3-enter-large" onClick={onEnter}>
                      Start your journey <Rocket size={18} aria-hidden="true" />
                    </button>
                    {onSwitch && (
                      <button type="button" className="hp3-view-previous" onClick={onSwitch}>
                        View home 2.0
                      </button>
                    )}
                  </div>
                )}
              </div>

              {isHero && (
                <div className="hp3-stats" aria-label="Platform highlights">
                  {stats.map(({ value, label, icon: StatIcon }) => (
                    <div key={label}>
                      <StatIcon size={17} aria-hidden="true" />
                      <strong>{value}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              )}

              {!isFinal && (
                <button type="button" className="hp3-continue" onClick={() => goToScene(index + 1)} aria-label={`Continue to ${STORY[index + 1].nav}`}>
                  <span>SCROLL TO CONTINUE</span>
                  <ChevronDown size={17} aria-hidden="true" />
                </button>
              )}
            </section>
          );
        })}
      </div>

      <footer className="hp3-footer">
        <span>© 2026 GENAI ACADEMY</span>
        <span>LEARN / BUILD / SIMULATE / PREPARE</span>
      </footer>
    </main>
  );
}
